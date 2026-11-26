#!/usr/bin/env python3
"""
أداة التوليد الصوتي التعبيري الواقعي لمنصة قراءتي التفاعلية الذكية
باستخدام Gemini Expressive TTS (gemini-3.8-flash-tts)
إعداد وتطوير: المهندس أسامة خليل هاشم

القواعد الصارمة:
1. قراءة GEMINI_API_KEY حصراً من متغيرات البيئة (os.environ). يُمنع منعاً باتاً كتابة أي مفتاح سري في الكود.
2. الحفاظ التام على التسجيلات البشرية الحقيقية (teacher_* ومطابقاتها) وآيات القرآن الكريم وعدم استبدالها إلا بأمر صريح (--overwrite-human).
3. معالجة الصوت المولد فورياً عبر ffmpeg للحفاظ على الدفء ونقاء الاستوديو وتوحيد العلو.
"""

import os
import re
import sys
import glob
import json
import time
import random
import shutil
import base64
import hashlib
import argparse
import threading
import subprocess
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUDIO_DIR = os.path.join(BASE_DIR, 'audio')
BACKUP_DIR = os.path.join(BASE_DIR, 'audio_backup_raw')
MANIFEST_PATH = os.path.join(BASE_DIR, 'tools', 'tts_manifest.json')
TRANSCRIPTS_CACHE_PATH = os.path.join(BACKUP_DIR, 'transcripts_cache.json')
TTS_DONE_LOG_PATH = os.path.join(BACKUP_DIR, 'tts_done_v363.json')
BATCH_JOBS_STATE_PATH = os.path.join(BACKUP_DIR, 'tts_batch_jobs_v363.json')

sys.path.insert(0, os.path.join(BASE_DIR, 'tools'))
try:
    import master_audio
except ImportError:
    master_audio = None

DEFAULT_FASEEH_VOICE = "voice_xoaeymuomp2b"
DEFAULT_FASEEH_STYLE = "warm, cheerful, clear"
DEFAULT_TTS_MODEL = "gemini-3.8-flash-tts"
DEFAULT_TEXT_MODEL = "gemini-4-hydrogen"


class DailyQuotaExhaustedError(RuntimeError):
    """خطأ انتهاء الحصة اليومية (RPD) للتوقف الفوري دون انتظار"""

QURAN_PROTECTED_KEYS = {
    'unit1_fatiha_ayah1', 'unit1_fatiha_ayah2', 'unit1_fatiha_ayah3',
    'unit1_fatiha_ayah4', 'unit1_fatiha_ayah5', 'unit1_fatiha_ayah6',
    'unit1_fatiha_ayah7', 'unit1_fatiha_full', 'unit1_fatiha_sadaqa',
}
RANA_UI_PROTECTED_KEYS = {'voice_preview_rana', 'voice_confirm_rana'}

DIALOGUE_SUFFIXES = (
    '_intro', '_prompt', '_desc', '_hint', '_welcome', '_complete', '_congrats',
    '_correct', '_wrong', '_encourage_super', '_success', '_click',
    '_above', '_below', '_left', '_right', '_cheer'
)
DIALOGUE_SUBSTRINGS = (
    '_story', 'story_', '_scene', 'scene_', '_listen', '_picnic',
    '_pic1', '_pic2', '_pic3', '_facility', '_hobbies', '_order_para',
    '_order_sentence', 'act4_', 'act5_diff_', 'act7_', 'act8_',
    '_q1', '_q2', '_q3', '_q4', '_q5', 'quiz_', '_talk_'
)


def build_gentle_gemini_filter_chain(include_loudnorm=True):
    """سلسلة معالجة لطيفة تحافظ على دفء وهواء الصوت البشري لـ Gemini 3.8 TTS"""
    filters = [
        "highpass=f=70",
        "equalizer=f=220:width_type=o:width=1.2:g=1.2",
    ]
    if include_loudnorm:
        filters.append("loudnorm=I=-16:TP=-1.5:LRA=11")
    filters.append("afade=t=in:st=0:d=0.01,areverse,afade=t=in:st=0:d=0.02,areverse")
    return ",".join(filters)


def get_gemini_api_key():
    key = os.environ.get('GEMINI_API_KEY', '').strip()
    if key:
        return key
    env_path = os.path.join(BASE_DIR, 'ai_server', '.env')
    if os.path.exists(env_path):
        try:
            with open(env_path, 'r', encoding='utf-8') as f:
                for raw_line in f:
                    line = raw_line.strip()
                    if not line or line.startswith('#') or '=' not in line:
                        continue
                    k, v = line.split('=', 1)
                    if k.strip() == 'GEMINI_API_KEY':
                        val = v.strip().strip('"').strip("'")
                        if val:
                            return val
        except Exception:
            pass
    return ''


def get_protected_keys():
    """حصر كافة المفاتيح المحمية: تسجيلات المعلمة البشرية ومطابقاتها بالـ MD5 + القرآن + معاينة رنا"""
    mp3_files = sorted(glob.glob(os.path.join(AUDIO_DIR, '*.mp3')))
    md5_map = {}
    teacher_hashes = set()

    for path in mp3_files:
        key = os.path.splitext(os.path.basename(path))[0]
        with open(path, 'rb') as f:
            digest = hashlib.md5(f.read()).hexdigest()
        md5_map[key] = digest
        if key.startswith('teacher_') or '_teacher_' in key or key.endswith('_teacher'):
            teacher_hashes.add(digest)

    # v3.64: تُحمى تسجيلات المعلمة بأسمائها الصريحة (teacher_*) فقط؛ أما نسخها المكررة تحت مفاتيح الدروس
    # (مثل letter_d_dar) فتُستبدل بصوت الأستاذ باسل لأن الأصل محفوظ في مفتاح teacher_* ويُستعمل في وضع المعلمة.
    protected = {
        k for k in md5_map
        if (k.startswith('teacher_') or '_teacher_' in k or k.endswith('_teacher'))
        and k != 'unit2_facility_teacher'
    }
    protected.update(QURAN_PROTECTED_KEYS)
    protected.update(RANA_UI_PROTECTED_KEYS)
    return protected, md5_map


def call_gemini_tts(text, style_prompt, voice_name=DEFAULT_FASEEH_VOICE, api_key=None, model_name=DEFAULT_TTS_MODEL, abort_event=None):
    """استدعاء Gemini Interactions API لتوليد الصوت التعبيري مع إعادة المحاولة والتباعد الأسي"""
    if abort_event is not None and abort_event.is_set():
        raise DailyQuotaExhaustedError("تم إيقاف الطلبات بسبب استنفاد الحصة اليومية للنموذج.")
    if not api_key:
        api_key = get_gemini_api_key()
    if not api_key:
        raise ValueError("متغير البيئة GEMINI_API_KEY غير موجود! يرجى تعيينه في النظام قبل التشغيل.")

    endpoint = "https://generativelanguage.googleapis.com/v1beta/interactions"
    headers = {
        "x-goog-api-key": api_key,
        "Content-Type": "application/json"
    }

    content_item = {
        "type": "text",
        "text": text
    }
    if style_prompt:
        content_item["annotations"] = [{
            "type": "speech_metadata",
            "style": style_prompt
        }]

    payload = {
        "model": model_name,
        "input": [{
            "type": "user_input",
            "content": [content_item]
        }],
        "response_format": {
            "type": "audio"
        },
        "generation_config": {
            "speech_config": [
                {"voice": voice_name}
            ]
        }
    }

    last_err = None
    res_data = None
    body_bytes = json.dumps(payload).encode('utf-8')
    for attempt in range(6):
        if abort_event is not None and abort_event.is_set():
            raise DailyQuotaExhaustedError("تم إيقاف الطلبات بسبب استنفاد الحصة اليومية للنموذج.")
        req = urllib.request.Request(
            endpoint,
            data=body_bytes,
            headers=headers,
            method="POST"
        )
        try:
            with urllib.request.urlopen(req, timeout=60) as response:
                res_data = json.loads(response.read().decode('utf-8'))
            break
        except urllib.error.HTTPError as e:
            err_msg = e.read().decode('utf-8', errors='ignore')
            if e.code == 429 and "requests per day" in err_msg.lower():
                if abort_event is not None:
                    abort_event.set()
                raise DailyQuotaExhaustedError(f"HTTP Error {e.code}: {err_msg}")
            last_err = RuntimeError(f"HTTP Error {e.code}: {err_msg}")
            if e.code in (429, 500, 502, 503, 504) and attempt < 5:
                wait_s = min(45.0, (2 ** (attempt + 1)) + random.uniform(0.3, 1.8))
                print(f"   ⏳ إعادة المحاولة {attempt + 1}/5 خلال {wait_s:.1f}ث ({e.code})...", flush=True)
                time.sleep(wait_s)
                continue
            raise last_err
        except Exception as e:
            last_err = RuntimeError(f"فشل الاتصال بـ Gemini API: {e}")
            if attempt < 5:
                wait_s = min(30.0, (2 ** attempt) + random.uniform(0.3, 1.5))
                time.sleep(wait_s)
                continue
            raise last_err

    if res_data is None:
        raise last_err or RuntimeError("تعذر الحصول على استجابة من Gemini TTS")

    audio_b64 = None
    if "steps" in res_data:
        for step in res_data["steps"]:
            if step.get("type") == "model_output":
                for item in step.get("content", []):
                    if item.get("type") == "audio" and "data" in item:
                        audio_b64 = item["data"]
                        break
            if audio_b64:
                break
    elif "output_audio" in res_data:
        audio_b64 = res_data["output_audio"].get("data")

    if not audio_b64:
        raise RuntimeError(f"لم يتم العثور على بيانات صوتية في استجابة Gemini: {res_data}")

    return base64.b64decode(audio_b64)


def strip_html_and_emoji(raw):
    """تنظيف النصوص المرجعية في فقاعات الواجهة من HTML والرموز التعبيرية"""
    if not raw:
        return ""
    s = str(raw)
    s = re.sub(r'<br\s*/?>', '، ', s, flags=re.IGNORECASE)
    s = re.sub(r'</(p|div|li|h[1-6])>', '، ', s, flags=re.IGNORECASE)
    s = re.sub(r'<[^>]*>', ' ', s)
    s = s.replace('&nbsp;', ' ').replace('&amp;', ' و ')
    s = re.sub(r'&quot;|&apos;|&#39;|&lt;|&gt;', ' ', s)
    s = re.sub(r'[\U0001F000-\U0001FAFF\u2600-\u27BF\uFE00-\uFE0F\u200D]', ' ', s)
    return re.sub(r'\s+', ' ', s).strip()


def extract_make_lesson_texts():
    """استخراج النصوص الحرفية من tools/make_lesson.py"""
    ml_path = os.path.join(BASE_DIR, 'tools', 'make_lesson.py')
    if not os.path.exists(ml_path):
        return {}
    with open(ml_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    matches = re.findall(r'\(\s*"([a-zA-Z0-9_]+)"\s*,\s*"([^"]+)"\s*,\s*VOICE_\w+', content)
    return {k: t.strip() for k, t in matches}


def extract_mascot_speak_texts():
    """استخراج النصوص المرجعية من استدعاءات mascotSpeak في الواجهات والمنطق"""
    code_files = (
        glob.glob(os.path.join(BASE_DIR, 'views', '**', '*.html'), recursive=True) +
        glob.glob(os.path.join(BASE_DIR, 'js', '**', '*.js'), recursive=True)
    )
    pat = re.compile(r"""mascotSpeak\s*\(\s*(['"`])((?:\\.|(?!\1).)*?)\1\s*,\s*['"]([a-zA-Z0-9_]+)['"]""", re.S)
    ref_map = {}
    for cf in code_files:
        with open(cf, 'r', encoding='utf-8', errors='ignore') as f:
            txt = f.read()
        for m in pat.finditer(txt):
            cleaned = strip_html_and_emoji(m.group(2))
            key = m.group(3)
            if cleaned and (key not in ref_map or len(cleaned) > len(ref_map[key])):
                ref_map[key] = cleaned
    return ref_map


def transcribe_audio_with_gemini(mp3_path, ref_text, api_key):
    """نسخ النص العربي المنطوق فعلياً من الملف الصوتي الأصلي عبر gemini-4-hydrogen"""
    with open(mp3_path, 'rb') as f:
        audio_b64 = base64.b64encode(f.read()).decode('utf-8')

    prompt = (
        "استمع لهذا المقطع الصوتي التعليمي من منهج قراءتي للصف الأول الابتدائي العراقي "
        "واكتب النص المنطوق حرفياً من أول كلمة إلى آخر كلمة باللغة العربية الفصحى المشكولة بدقة تامة "
        "دون أي مقدمة أو شرح أو تنسيق إضافي أو علامات اقتباس أو أحرف إنجليزية."
    )
    if ref_text:
        prompt += f"\nمرجع اختياري لضبط أسماء الشخصيات والتشكيل فقط — التزم بما يُنطق فعلاً في التسجيل: {ref_text[:450]}"

    endpoint = f"https://generativelanguage.googleapis.com/v1beta/models/{DEFAULT_TEXT_MODEL}:generateContent?key={api_key}"
    payload = {
        "contents": [{
            "parts": [
                {"text": prompt},
                {"inlineData": {"mimeType": "audio/mp3", "data": audio_b64}}
            ]
        }],
        "generationConfig": {
            "temperature": 0.0,
            "maxOutputTokens": 4096,
            "thinkingConfig": {"thinkingLevel": "low"}
        }
    }
    body_bytes = json.dumps(payload).encode('utf-8')

    last_err = None
    for attempt in range(7):
        req = urllib.request.Request(
            endpoint,
            data=body_bytes,
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                data = json.loads(resp.read().decode('utf-8'))
            cand = data.get("candidates", [{}])[0]
            finish_reason = cand.get("finishReason", "")
            if finish_reason and finish_reason not in ("STOP",):
                raise RuntimeError(f"انتهى التوليد بسبب {finish_reason} قبل الاكتمال")
            parts = cand.get("content", {}).get("parts", [])
            txt = "".join(p.get("text", "") for p in parts if not p.get("thought")).strip()
            txt = re.sub(r'\s+', ' ', txt).strip('"\'` \n\r\t')
            if (
                not re.search(r'[\u0600-\u06FF]', txt)
                or len(txt) < 1
                or re.search(r'[A-Za-z]', txt)
                or '->' in txt
                or '"' in txt
                or ('\u064b' <= txt[0] <= '\u065f')
                or txt[0] in '،.!؟:)-*'
            ):
                raise RuntimeError(f"نص منسوخ غير صالح: {txt[:100]!r}")
            return txt
        except urllib.error.HTTPError as e:
            err_msg = e.read().decode('utf-8', errors='ignore')
            last_err = RuntimeError(f"ASR HTTP {e.code}: {err_msg[:200]}")
            if e.code in (429, 500, 502, 503, 504) and attempt < 6:
                wait_s = min(60.0, (2 ** (attempt + 1)) + random.uniform(1.0, 3.0))
                time.sleep(wait_s)
                continue
            raise last_err
        except Exception as e:
            last_err = e
            if attempt < 6:
                wait_s = min(20.0, (2 ** attempt) + random.uniform(0.2, 1.2))
                time.sleep(wait_s)
                continue
            raise last_err

    raise last_err or RuntimeError("فشل النسخ الصوتي")


def select_style_for_key(key):
    """تحديد الأسلوب التعبيري المناسب لصوت الأستاذ باسل حسب نوع الحوار"""
    if key.startswith('phoneme_pure_') or key.startswith('syl_') or key in ('letter_marboota_sound', 'tanween_dham_sound', 'shaddah_sound'):
        return "calm, crisp, slow articulation"
    if key.startswith('word_'):
        return "clear, steady, distinct"
    if key.startswith('sentence_'):
        return "warm, clear, steady"
    if any(x in key for x in ('_story', 'story_', '_scene', 'scene_', '_listen', '_picnic', 'act4_full_story')):
        return "warm, expressive storytelling"
    if any(x in key for x in ('_correct', '_encourage_super', '_complete', '_congrats', '_success', 'applause')):
        return "joyful, proud, encouraging"
    if '_wrong' in key:
        return "gentle, patient, reassuring"
    if 'nasheed' in key:
        return "cheerful, rhythmic, playful"
    return "warm, cheerful, clear"


def is_dialogue_audio_key(key):
    """تحديد ما إذا كان الملف الصوتي ينتمي إلى الحوارات والقصص والمقدمات والتشجيع والأسئلة والأناشيد"""
    if key == 'letter_sad_word_nasheeda':
        return False
    if key.endswith(DIALOGUE_SUFFIXES):
        return True
    if any(sub in key for sub in DIALOGUE_SUBSTRINGS):
        return True
    if 'nasheed' in key:
        return True
    return False


def parse_js_module_dialogues():
    """استخراج النصوص الموحدة لوحدات بنك الألعاب ومسرح القراء واستوديو القصص مباشرة من ملفات JS"""
    items = []

    # 1. بنك الألعاب — الكلمات والتركيبات الفونيمية (10 ملفات)
    games_words = [
        ("faseeh_blend_baba", "بَا <short pause> بَا <short pause> بَابَا!", "clear, steady, distinct"),
        ("faseeh_blend_mama", "مَا <short pause> مَا <short pause> مَامَا!", "clear, steady, distinct"),
        ("faseeh_blend_booq", "بُو <short pause> أَقْ <short pause> بُوقٌ!", "clear, steady, distinct"),
        ("faseeh_blend_bat", "بَ <short pause> أَطْ <short pause> بَطٌّ!", "clear, steady, distinct"),
        ("faseeh_blend_qitar", "قِ <short pause> طَا <short pause> أَرْ <short pause> قِطَارٌ!", "clear, steady, distinct"),
        ("faseeh_blend_ghazal", "غَ <short pause> زَا <short pause> أَلْ <short pause> غَزَالٌ!", "clear, steady, distinct"),
        ("faseeh_blend_miah", "مِ <short pause> يَا <short pause> أَهْ <short pause> مِيَاهٌ!", "clear, steady, distinct"),
        ("faseeh_word_zaytoon", "زَيْتُونٌ!", "clear, steady, distinct"),
        ("faseeh_word_salim", "سَالِمٌ!", "clear, steady, distinct"),
        ("faseeh_word_nabeeh", "نَبِيهٌ!", "clear, steady, distinct"),
    ]
    for k, t, st in games_words:
        items.append({"key": k, "character": "bassel_module", "text": t, "style": st, "voice": DEFAULT_FASEEH_VOICE})

    # 2. بنك الألعاب — أسئلة مسابقة وسام القراءة وكلمات ميزان اللام
    games_path = os.path.join(BASE_DIR, 'js', 'core', 'games.js')
    with open(games_path, 'r', encoding='utf-8') as f:
        games_js = f.read()

    m_quiz = re.search(r"const\s+QUIZ_QUESTIONS_BANK\s*=\s*\[([\s\S]*?)\n\s*\];", games_js)
    if not m_quiz:
        raise RuntimeError("تعذر العثور على QUIZ_QUESTIONS_BANK في games.js")
    quiz_questions = re.findall(r"question:\s*'([^']+)'", m_quiz.group(1))
    if len(quiz_questions) != 10:
        raise RuntimeError(f"عدد أسئلة المسابقة المتوقع 10، والموجود {len(quiz_questions)}")
    for idx, q_txt in enumerate(quiz_questions, 1):
        items.append({
            "key": f"game_quiz_q{idx}",
            "character": "bassel_module",
            "text": q_txt.strip(),
            "style": "warm, encouraging, clear",
            "voice": DEFAULT_FASEEH_VOICE
        })

    m_lam = re.search(r"const\s+LAM_WORDS_BANK\s*=\s*\[([\s\S]*?)\n\s*\];", games_js)
    if not m_lam:
        raise RuntimeError("تعذر العثور على LAM_WORDS_BANK في games.js")
    lam_words = re.findall(r"word:\s*'([^']+)'", m_lam.group(1))
    if len(lam_words) != 12:
        raise RuntimeError(f"عدد كلمات اللام المتوقع 12، والموجود {len(lam_words)}")
    for idx, w_txt in enumerate(lam_words, 1):
        items.append({
            "key": f"game_lam_w{idx}",
            "character": "bassel_module",
            "text": w_txt.strip(),
            "style": "clear, steady, distinct",
            "voice": DEFAULT_FASEEH_VOICE
        })

    # 3. مسرح القراءة التعبيرية والمحادثة الصفية (36 ملفاً)
    rt_path = os.path.join(BASE_DIR, 'js', 'core', 'readers-theater.js')
    with open(rt_path, 'r', encoding='utf-8') as f:
        rt_js = f.read()

    m_plays = re.search(r"const\s+PLAYS_BANK\s*=\s*\[([\s\S]*?)\n\s*\];", rt_js)
    if not m_plays:
        raise RuntimeError("تعذر العثور على PLAYS_BANK في readers-theater.js")
    play_blocks = re.split(r"\{\s*id:\s*'(play_[^']+)'", m_plays.group(1))
    # play_blocks = [prefix, playId1, body1, playId2, body2, ...]
    for i in range(1, len(play_blocks), 2):
        play_id = play_blocks[i]
        body = play_blocks[i + 1]
        lines = re.findall(r"\{\s*speaker:\s*'([^']+)',\s*text:\s*'([^']+)'", body)
        for l_idx, (speaker, l_txt) in enumerate(lines, 1):
            items.append({
                "key": f"rt_{play_id}_l{l_idx}",
                "character": "bassel_module",
                "text": l_txt.strip(),
                "style": "expressive, theatrical, warm",
                "voice": DEFAULT_FASEEH_VOICE
            })

    m_convos = re.search(r"const\s+CONVERSATION_SCENARIOS\s*=\s*\[([\s\S]*?)\n\s*\];", rt_js)
    if not m_convos:
        raise RuntimeError("تعذر العثور على CONVERSATION_SCENARIOS في readers-theater.js")
    convo_blocks = re.split(r"\{\s*id:\s*'(convo_[^']+)'", m_convos.group(1))
    for i in range(1, len(convo_blocks), 2):
        convo_id = convo_blocks[i]
        body = convo_blocks[i + 1]
        m_msg = re.search(r"partnerMessage:\s*'([^']+)'", body)
        if m_msg:
            items.append({
                "key": f"rt_{convo_id}_partner",
                "character": "bassel_module",
                "text": m_msg.group(1).strip(),
                "style": "warm, friendly, conversational",
                "voice": DEFAULT_FASEEH_VOICE
            })

    items.append({
        "key": "rt_convo_feedback_correct",
        "character": "bassel_module",
        "text": "أَحْسَنْتَ يَا بَطَلُ! <short pause> تَعْبِيرُكَ صَحِيحٌ وَنَبْرَتُكَ مُؤَدَّبَةٌ وَرَائِعَةٌ!",
        "style": "joyful, proud, encouraging",
        "voice": DEFAULT_FASEEH_VOICE
    })
    items.append({
        "key": "rt_convo_feedback_retry",
        "character": "bassel_module",
        "text": "حَاوِلْ مَرَّةً أُخْرَى بِنَبْرَةٍ أَكْثَرَ لُطْفاً وَتَعْبِيراً يَا بَطَلُ!",
        "style": "gentle, patient, reassuring",
        "voice": DEFAULT_FASEEH_VOICE
    })

    # 4. استوديو القصص المصورة (26 ملفاً)
    ss_path = os.path.join(BASE_DIR, 'js', 'core', 'story-studio.js')
    with open(ss_path, 'r', encoding='utf-8') as f:
        ss_js = f.read()

    m_books = re.search(r"const\s+STORYBOOKS\s*=\s*\[([\s\S]*?)\n\s*\];", ss_js)
    if not m_books:
        raise RuntimeError("تعذر العثور على STORYBOOKS في story-studio.js")
    book_blocks = re.split(r"id:\s*'([a-z0-9_]+)',\s*\n\s*title:", m_books.group(1))
    for i in range(1, len(book_blocks), 2):
        book_id = book_blocks[i]
        body = book_blocks[i + 1]
        bubbles = re.findall(r"type:\s*'(?:speech|thought|shout)',\s*text:\s*'([^']+)'", body)
        for p_idx, b_txt in enumerate(bubbles, 1):
            items.append({
                "key": f"ss_{book_id}_p{p_idx}",
                "character": "bassel_module",
                "text": b_txt.strip(),
                "style": "warm, expressive storytelling",
                "voice": DEFAULT_FASEEH_VOICE
            })

    m_cur = re.search(r"currentStory:\s*\{([\s\S]*?)\n\s*\},\s*\n\s*// القصة المحددة", ss_js)
    if not m_cur:
        raise RuntimeError("تعذر العثور على currentStory في story-studio.js")
    cur_bubbles = re.findall(r"type:\s*'(?:speech|thought|shout)',\s*text:\s*'([^']+)'", m_cur.group(1))
    for p_idx, b_txt in enumerate(cur_bubbles, 1):
        items.append({
            "key": f"ss_default_story_p{p_idx}",
            "character": "bassel_module",
            "text": b_txt.strip(),
            "style": "warm, expressive storytelling",
            "voice": DEFAULT_FASEEH_VOICE
        })

    m_chal = re.search(r"const\s+CHALLENGES_DATA\s*=\s*\[([\s\S]*?)\n\s*\];", ss_js)
    if not m_chal:
        raise RuntimeError("تعذر العثور على CHALLENGES_DATA في story-studio.js")
    ch_blocks = re.split(r"id:\s*'(ch_[^']+)'", m_chal.group(1))
    for i in range(1, len(ch_blocks), 2):
        ch_id = ch_blocks[i]
        body = ch_blocks[i + 1]
        m_desc = re.search(r"desc:\s*'([^']+)'", body)
        m_win = re.search(r"fullCaption:\s*'([^']+)'", body)
        if m_desc:
            items.append({
                "key": f"ss_{ch_id}_prompt",
                "character": "bassel_module",
                "text": m_desc.group(1).strip(),
                "style": "warm, encouraging, clear",
                "voice": DEFAULT_FASEEH_VOICE
            })
        if m_win:
            items.append({
                "key": f"ss_{ch_id}_win",
                "character": "bassel_module",
                "text": m_win.group(1).strip(),
                "style": "joyful, proud, encouraging",
                "voice": DEFAULT_FASEEH_VOICE
            })

    return items


def build_dialogues_manifest(api_key):
    """بناء وتحديث tools/tts_manifest.json بالحوارات الموجودة والملفات الجديدة مع حماية التسجيلات البشرية والقرآن"""
    if not os.path.exists(MANIFEST_PATH):
        raise FileNotFoundError(f"ملف الجدول غير موجود: {MANIFEST_PATH}")

    with open(MANIFEST_PATH, 'r', encoding='utf-8') as f:
        manifest = json.load(f)

    protected_keys, _ = get_protected_keys()
    preserved_items = [
        it for it in manifest.get("items", [])
        if it.get("character") in ("faseeh", "teacher")
    ]
    preserved_keys = {it["key"] for it in preserved_items}

    # استبعاد أي مفتاح محمي أو محفوظ مسبقاً
    mp3_files = sorted(glob.glob(os.path.join(AUDIO_DIR, '*.mp3')))
    cat_a_keys = []
    for path in mp3_files:
        key = os.path.splitext(os.path.basename(path))[0]
        if key in protected_keys or key in preserved_keys:
            continue
        if is_dialogue_audio_key(key):
            cat_a_keys.append(key)

    ml_texts = extract_make_lesson_texts()
    # معالجة أي ملف نصه ثابت ومعروف أو فارغ على القرص
    ml_texts.setdefault('letter_hamza_blend_intro', 'تَرْكِيبُ الْمَقَاطِعِ لِتَكْوِينِ كَلِمَاتٍ! <short pause> اِسْتَمِعْ وَرَكِّبِ الْكَلِمَاتِ!')
    ms_texts = extract_mascot_speak_texts()

    os.makedirs(BACKUP_DIR, exist_ok=True)
    transcripts_cache = {}
    if os.path.exists(TRANSCRIPTS_CACHE_PATH):
        try:
            with open(TRANSCRIPTS_CACHE_PATH, 'r', encoding='utf-8') as f:
                transcripts_cache = json.load(f)
        except Exception:
            transcripts_cache = {}

    to_transcribe = [
        k for k in cat_a_keys
        if k not in ml_texts
        and os.path.getsize(os.path.join(AUDIO_DIR, f"{k}.mp3")) >= 500
        and not (k in transcripts_cache and re.search(r'[\u0600-\u06FF]', transcripts_cache[k]))
    ]

    print("=" * 70)
    print("📋 بناء جدول حوارات الأستاذ باسل (v3.62)")
    print(f"   - عناصر محفوظة (faseeh + teacher): {len(preserved_items)}")
    print(f"   - ملفات محمية (بشري + قرآن + رنا): {len(protected_keys)}")
    print(f"   - حوارات وقصص وأناشيد موجودة (Cat A): {len(cat_a_keys)}")
    print(f"     • نص حرفي من make_lesson.py: {sum(1 for k in cat_a_keys if k in ml_texts)}")
    print(f"     • منسوخ مسبقاً في الكاش: {len(cat_a_keys) - sum(1 for k in cat_a_keys if k in ml_texts) - len(to_transcribe)}")
    print(f"     • يحتاج نسخاً صوتياً عبر gemini-3.8-flash: {len(to_transcribe)}")
    print("=" * 70)

    if to_transcribe:
        if not api_key:
            raise ValueError("متغير البيئة GEMINI_API_KEY مطلوب لنسخ الملفات الصوتية غير الموثقة نصياً.")
        cache_lock = threading.Lock()
        done_asr = 0
        failed_asr = []

        def _worker(k):
            mp3_p = os.path.join(AUDIO_DIR, f"{k}.mp3")
            ref = ms_texts.get(k, "")
            return k, transcribe_audio_with_gemini(mp3_p, ref, api_key)

        with ThreadPoolExecutor(max_workers=8) as ex:
            futs = {ex.submit(_worker, k): k for k in to_transcribe}
            for fut in as_completed(futs):
                k = futs[fut]
                done_asr += 1
                try:
                    key, txt = fut.result()
                    with cache_lock:
                        transcripts_cache[key] = txt
                        if done_asr % 20 == 0 or done_asr == len(to_transcribe):
                            with open(TRANSCRIPTS_CACHE_PATH, 'w', encoding='utf-8') as cf:
                                json.dump(transcripts_cache, cf, ensure_ascii=False, indent=2)
                    print(f"  📝 [{done_asr}/{len(to_transcribe)}] {key}: {txt[:70]}")
                except Exception as e:
                    failed_asr.append((k, str(e)))
                    print(f"  ⚠️ [{done_asr}/{len(to_transcribe)}] فشل نسخ {k}: {e}")

        with open(TRANSCRIPTS_CACHE_PATH, 'w', encoding='utf-8') as cf:
            json.dump(transcripts_cache, cf, ensure_ascii=False, indent=2)

        if len(failed_asr) > max(1, int(len(to_transcribe) * 0.15)):
            raise RuntimeError(f"تجاوزت نسبة فشل النسخ الصوتي 15% ({len(failed_asr)}/{len(to_transcribe)})")

    cat_a_items = []
    skipped_invalid = []
    for k in cat_a_keys:
        txt = ml_texts.get(k) or transcripts_cache.get(k) or ""
        txt = re.sub(r'\s+', ' ', txt).strip()
        if not re.search(r'[\u0600-\u06FF]', txt) or len(txt) < 2:
            skipped_invalid.append(k)
            continue
        cat_a_items.append({
            "key": k,
            "character": "bassel_dialogue",
            "text": txt,
            "style": select_style_for_key(k),
            "voice": DEFAULT_FASEEH_VOICE
        })

    if skipped_invalid:
        print(f"⚠️ تم تخطي {len(skipped_invalid)} عنصراً لعدم توفر نص عربي صالح: {skipped_invalid[:15]}")

    cat_b_items = [
        it for it in parse_js_module_dialogues()
        if it["key"] not in protected_keys and it["key"] not in preserved_keys
    ]

    # دمج مع التحقق من عدم وجود أي تداخل مفاتيح
    seen_keys = set(preserved_keys)
    merged_items = list(preserved_items)
    for it in cat_a_items + cat_b_items:
        if it["key"] in seen_keys or it["key"] in protected_keys:
            continue
        seen_keys.add(it["key"])
        merged_items.append(it)

    manifest["meta"]["version"] = "v3.63"
    manifest["meta"]["faseeh_voice"] = DEFAULT_FASEEH_VOICE
    manifest["meta"]["faseeh_style"] = DEFAULT_FASEEH_STYLE
    manifest["meta"]["tts_model"] = DEFAULT_TTS_MODEL
    manifest["items"] = merged_items

    with open(MANIFEST_PATH, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)

    print("=" * 70)
    print(f"✔ تم تحديث {MANIFEST_PATH} بنجاح:")
    print(f"   - faseeh: {sum(1 for i in merged_items if i.get('character') == 'faseeh')}")
    print(f"   - teacher: {sum(1 for i in merged_items if i.get('character') == 'teacher')}")
    print(f"   - bassel_dialogue (Cat A): {sum(1 for i in merged_items if i.get('character') == 'bassel_dialogue')}")
    print(f"   - bassel_module (Cat B): {sum(1 for i in merged_items if i.get('character') == 'bassel_module')}")
    print(f"   - الإجمالي الكلي: {len(merged_items)}")
    print("=" * 70)


PHONEME_PURE_DEFINITIONS = [
    ("phoneme_pure_alif", "أَ <short pause> أُ <short pause> إِ <short pause> آا"),
    ("phoneme_pure_baa", "أَبْ <short pause> أَبْ <short pause> بَ"),
    ("phoneme_pure_taa", "أَتْ <short pause> أَتْ <short pause> تَ"),
    ("phoneme_pure_thaa", "أَثْ <short pause> أَثْ <short pause> ثَ"),
    ("phoneme_pure_jeem", "أَجْ <short pause> أَجْ <short pause> جَ"),
    ("phoneme_pure_haa", "أَحْ <short pause> أَحْ <short pause> حَ"),
    ("phoneme_pure_khaa", "أَخْ <short pause> أَخْ <short pause> خَ"),
    ("phoneme_pure_dal", "أَدْ <short pause> أَدْ <short pause> دَ"),
    ("phoneme_pure_dhal", "أَذْ <short pause> أَذْ <short pause> ذَ"),
    ("phoneme_pure_raa", "أَرْ <short pause> أَرْ <short pause> رَ"),
    ("phoneme_pure_zay", "أَزْ <short pause> أَزْ <short pause> زَ"),
    ("phoneme_pure_seen", "أَسْ <short pause> أَسْ <short pause> سَ"),
    ("phoneme_pure_sheen", "أَشْ <short pause> أَشْ <short pause> شَ"),
    ("phoneme_pure_sad", "أَصْ <short pause> أَصْ <short pause> صَ"),
    ("phoneme_pure_dhad", "أَضْ <short pause> أَضْ <short pause> ضَ"),
    ("phoneme_pure_ta", "أَطْ <short pause> أَطْ <short pause> طَ"),
    ("phoneme_pure_dha", "أَظْ <short pause> أَظْ <short pause> ظَ"),
    ("phoneme_pure_ayn", "أَعْ <short pause> أَعْ <short pause> عَ"),
    ("phoneme_pure_ghayn", "غَ <short pause> غُ <short pause> غِ"),
    ("phoneme_pure_faa", "أَفْ <short pause> أَفْ <short pause> فَ"),
    ("phoneme_pure_qaf", "أَقْ <short pause> أَقْ <short pause> قَ"),
    ("phoneme_pure_kaf", "أَكْ <short pause> أَكْ <short pause> كَ"),
    ("phoneme_pure_lam", "أَلْ <short pause> أَلْ <short pause> لَ"),
    ("phoneme_pure_meem", "أَمْ <short pause> أَمْ <short pause> مَ"),
    ("phoneme_pure_noon", "أَنْ <short pause> أَنْ <short pause> نَ"),
    ("phoneme_pure_ha", "أَهْ <short pause> أَهْ <short pause> هَ"),
    ("phoneme_pure_waw", "أَوْ <short pause> وُو <short pause> وَ"),
    ("phoneme_pure_yaa", "أَيْ <short pause> يِي <short pause> يَ"),
    ("letter_marboota_sound", "تْ <short pause> هْ <short pause> مَدْرَسَهْ <short pause> مَدْرَسَةُ"),
    ("tanween_dham_sound", "أُنْ <short pause> أُنْ <short pause> دٌ <short pause> رٌ <short pause> وَرْدٌ"),
    ("shaddah_sound", "قِطْ، طَة <short pause> قِطَّةٌ <short pause> بَطَّةٌ"),
]

MISSING_V363_DEFINITIONS = [
    # 53 مفردة معجمية وإملائية وتشخيصية أساسية
    ("word_alam", "عَلَمٌ", "clear, steady, distinct"),
    ("word_athath", "أَثَاثٌ", "clear, steady, distinct"),
    ("word_bab", "بَابُ", "clear, steady, distinct, pronounce final damma clearly without tanween"),
    ("word_ban", "بَانُ", "clear, steady, distinct, pronounce final damma clearly without tanween"),
    ("word_banat", "بَنَاتُ", "clear, steady, distinct, pronounce final damma clearly without tanween"),
    ("word_baqar", "بَقَرٌ", "clear, steady, distinct"),
    ("word_batt", "بَطٌّ", "clear, steady, distinct"),
    ("word_bilad", "بِلَادٌ", "clear, steady, distinct"),
    ("word_booq", "بُوقٌ", "clear, steady, distinct"),
    ("word_dar", "دَارُ", "clear, steady, distinct, pronounce final damma clearly without tanween"),
    ("word_dari", "دَارِي", "clear, steady, distinct"),
    ("word_dawr", "دَوْرٌ", "clear, steady, distinct"),
    ("word_deena", "دِينَا", "clear, steady, distinct"),
    ("word_dhubab", "ذُبَابٌ", "clear, steady, distinct"),
    ("word_dood", "دُودُ", "clear, steady, distinct, pronounce final damma clearly without tanween"),
    ("word_door", "دُورُ", "clear, steady, distinct, pronounce final damma clearly without tanween"),
    ("word_fallah", "فَلَّاحٌ", "clear, steady, distinct"),
    ("word_ghazal", "غَزَالٌ", "clear, steady, distinct"),
    ("word_haql", "حَقْلٌ", "clear, steady, distinct"),
    ("word_hawdh", "حَوْضٌ", "clear, steady, distinct"),
    ("word_hilal", "هِلَالٌ", "clear, steady, distinct"),
    ("word_jamal", "جَمَلٌ", "clear, steady, distinct"),
    ("word_khayma", "خَيْمَةٌ", "clear, steady, distinct"),
    ("word_kitab", "كِتَابٌ", "clear, steady, distinct"),
    ("word_mahfooth", "مَحْفُوظٌ", "clear, steady, distinct"),
    ("word_maktaba", "مَكْتَبَةٌ", "clear, steady, distinct"),
    ("word_mama", "مَامَا", "clear, steady, distinct"),
    ("word_manaf", "مَنَافٌ", "clear, steady, distinct"),
    ("word_matar", "مَطَرٌ", "clear, steady, distinct"),
    ("word_mazin", "مَازِنٌ", "clear, steady, distinct"),
    ("word_mizan", "مِيزَانٌ", "clear, steady, distinct"),
    ("word_muroor", "مُرُورٌ", "clear, steady, distinct"),
    ("word_naam", "نَامَ", "clear, steady, distinct"),
    ("word_nabeel", "نَبِيلٌ", "clear, steady, distinct"),
    ("word_nadeem", "نَدِيمٌ", "clear, steady, distinct"),
    ("word_nakhl", "نَخْلٌ", "clear, steady, distinct"),
    ("word_natheef", "نَظِيفٌ", "clear, steady, distinct"),
    ("word_noor", "نُورُ", "clear, steady, distinct, pronounce final damma clearly without tanween"),
    ("word_nouri", "نُورِي", "clear, steady, distinct"),
    ("word_qaddouri", "قَدُّورِي", "clear, steady, distinct"),
    ("word_qalam", "قَلَمٌ", "clear, steady, distinct"),
    ("word_qitar", "قِطَارٌ", "clear, steady, distinct"),
    ("word_reef", "رِيفٌ", "clear, steady, distinct"),
    ("word_reem", "رِيمُ", "clear, steady, distinct, pronounce final damma clearly without tanween"),
    ("word_sabeel", "سَبِيلٌ", "clear, steady, distinct"),
    ("word_salah", "صَلَاحٌ", "clear, steady, distinct"),
    ("word_salma", "سَلْمَى", "clear, steady, distinct"),
    ("word_shurti", "شُرْطِيٌّ", "clear, steady, distinct"),
    ("word_tayyar", "طَيَّارٌ", "clear, steady, distinct"),
    ("word_ward", "وَرْدٌ", "clear, steady, distinct"),
    ("word_wazz", "وَزٌّ", "clear, steady, distinct"),
    ("word_wazzan", "وَزَّانٌ", "clear, steady, distinct"),
    ("word_zoraq", "زُورَقٌ", "clear, steady, distinct"),
    # 13 مفردة إضافية لبطاقات الإثراء والتحدي والاختبارات
    ("word_babu", "بَابُ", "clear, steady, distinct"),
    ("word_firas", "فِرَاسُ", "clear, steady, distinct, pronounce final damma clearly without tanween"),
    ("word_sarah", "سَارَةُ", "clear, steady, distinct"),
    ("word_nameer", "نَمِيرٌ", "clear, steady, distinct"),
    ("word_tuyoor", "طُيُورٌ", "clear, steady, distinct"),
    ("word_tariq", "طَارِقٌ", "clear, steady, distinct"),
    ("word_himar", "حِمَارٌ", "clear, steady, distinct"),
    ("word_tayyarah", "طَيَّارَةٌ", "clear, steady, distinct"),
    ("word_khaleelin", "خَلِيلٍ", "clear, steady, distinct"),
    ("word_jaddi", "جَدِّي", "clear, steady, distinct"),
    ("word_ghurab", "غُرَابٌ", "clear, steady, distinct"),
    ("word_ustadh", "أُسْتَاذٌ", "clear, steady, distinct"),
    ("word_muntadhar", "مُنْتَظَرٌ", "clear, steady, distinct"),
    # 7 مقاطع صوتية تأسيسية نقية
    ("syl_bu", "بُ <short pause> بُ", "calm, crisp, slow articulation"),
    ("syl_daa", "دَا <short pause> دَا", "calm, crisp, slow articulation"),
    ("syl_baa", "بَا <short pause> بَا", "calm, crisp, slow articulation"),
    ("syl_maa", "مَا <short pause> مَا", "calm, crisp, slow articulation"),
    ("syl_doo", "دُو <short pause> دُو", "calm, crisp, slow articulation"),
    ("syl_noo", "نُو <short pause> نُو", "calm, crisp, slow articulation"),
    ("syl_ree", "رِي <short pause> رِي", "calm, crisp, slow articulation"),
    # جملتا طلاقة قرائية
    ("sentence_dar_noor", "دَارُ نُورٍ، <short pause> بَابُ دَارِنَا.", "warm, clear, steady"),
    ("sentence_booq_nadeem", "بُوقُ نَدِيمٍ قَدِيمٌ، <short pause> نَدِيمٌ يَقُودُ بَقَرَ بَدْرَانَ.", "warm, clear, steady"),
    # 5 قصص قطار القراءة التعبيرية (Voice Coach)
    ("story_dada_rabab", "دَادَا رَبَاب <short pause> نَمِيرٌ قَارِئٌ <short pause> نَامَ بَدْرِي.", "warm, expressive storytelling"),
    ("story_mizan_qaddouri", "مِيزَانُ قَدُّورِي <short pause> قَدُّورِي وَزَّانٌ <short pause> وَزَنَ زَبِيبَ مَازِن.", "warm, expressive storytelling"),
    ("story_reef_manaf", "رِيفُ مَنَاف <short pause> فِي رِيفِ مَنَاف بَقَرٌ وَوَزٌّ.", "warm, expressive storytelling"),
    ("story_school_pupil", "أَنَا تِلْمِيذٌ نَشِيطٌ <short pause> أَقْرَأُ دُرُوسِي كُلَّ يَوْمٍ.", "warm, expressive storytelling"),
    ("story_swimming_pool", "صَلَاحٌ فَلَّاحٌ <short pause> يَزْرَعُ الْحَقْلَ وَيَسْبَحُ فِي الْحَوْضِ.", "warm, expressive storytelling"),
    # صوتا التفاعل والتشجيع في الدروس
    ("applause", "أَحْسَنْتَ يَا بَطَلُ! <short pause> تَصْفِيقٌ حَارٌّ لِهَذَا التَّقْطِيعِ الصَّوْتِيِّ الرَّائِعِ!", "joyful, proud, encouraging"),
    ("hint_draw", "تَمَّ مَسْحُ السَّبُّورَةِ! <short pause> هَيَّا ارْسُمِ الْحَرْفَ مَرَّةً أُخْرَى بِخَطٍّ جَمِيلٍ يَا بَطَلُ!", "warm, encouraging"),
]


def build_v363_manifest():
    """تحديث tts_manifest.json بالكامل للإصدار v3.63 بصوت الأستاذ باسل المضبوط ومكتبة الـ 28 حرفاً والـ 123 مفتاحاً"""
    if not os.path.exists(MANIFEST_PATH):
        raise FileNotFoundError(f"ملف الجدول غير موجود: {MANIFEST_PATH}")

    with open(MANIFEST_PATH, 'r', encoding='utf-8') as f:
        manifest = json.load(f)

    protected_keys, _ = get_protected_keys()
    old_items = manifest.get("items", [])

    # تنظيف وتحديث عناصر faseeh (50) و bassel_dialogue (538) والإبقاء على teacher (4)
    updated_items = []
    seen = set()

    # إعادة توليد bassel_module محدثاً من الكود
    module_map = {it["key"]: it for it in parse_js_module_dialogues()}

    for it in old_items:
        k = it["key"]
        ch = it.get("character")
        if k in seen:
            continue
        if ch == "teacher":
            seen.add(k)
            updated_items.append(it)
        elif ch == "faseeh":
            txt = it["text"]
            txt = txt.replace("<chuckle> ", "").replace("<chuckle>", "")
            if k == "letter_ha_phoneme_faseeh":
                txt = txt.replace("هَـ <short pause> هُـ <short pause> هِـ", "هَ <short pause> هُ <short pause> هِ")
            if k == "faseeh_blend_firas":
                txt = txt.replace("فِـ", "فِ")
            style = select_style_for_key(k)
            if "phoneme" in k or "vowels" in k:
                style = "warm, clear, steady articulation"
            elif "blend" in k:
                style = "clear, steady, distinct"
            elif k in ("mascot_welcome", "voice_preview_bassel", "voice_confirm_bassel", "voice_confirm_integrated", "unit2_welcome_bassel"):
                style = "warm, cheerful, clear"
            seen.add(k)
            updated_items.append({
                "key": k,
                "character": "faseeh",
                "text": txt.strip(),
                "style": style,
                "voice": DEFAULT_FASEEH_VOICE,
            })
        elif ch == "bassel_module":
            if k in module_map:
                seen.add(k)
                updated_items.append(module_map[k])
        elif ch == "bassel_dialogue":
            if k in protected_keys:
                continue
            seen.add(k)
            updated_items.append({
                "key": k,
                "character": "bassel_dialogue",
                "text": it["text"],
                "style": select_style_for_key(k),
                "voice": DEFAULT_FASEEH_VOICE,
            })

    # التأكد من إضافة أي عناصر bassel_module جديدة
    for k, it in module_map.items():
        if k not in seen and k not in protected_keys:
            seen.add(k)
            updated_items.append(it)

    # إضافة مكتبة الأصوات الفونيمية النقية للـ 28 حرفاً + القواعد الثلاث
    for k, txt in PHONEME_PURE_DEFINITIONS:
        if k in protected_keys:
            raise RuntimeError(f"مفتاح محمي في PHONEME_PURE_DEFINITIONS: {k}")
        if k in seen:
            continue
        seen.add(k)
        updated_items.append({
            "key": k,
            "character": "phoneme_pure",
            "text": txt,
            "style": "calm, crisp, slow articulation",
            "voice": DEFAULT_FASEEH_VOICE,
        })

    # إضافة الـ 82 عنصراً المفقوداً لتصفير أخطاء الصوت 404
    for k, txt, st in MISSING_V363_DEFINITIONS:
        if k in protected_keys:
            raise RuntimeError(f"مفتاح محمي في MISSING_V363_DEFINITIONS: {k}")
        if k in seen:
            continue
        seen.add(k)
        updated_items.append({
            "key": k,
            "character": "missing_v363",
            "text": txt,
            "style": st,
            "voice": DEFAULT_FASEEH_VOICE,
        })

    manifest["meta"]["version"] = "v3.63"
    manifest["meta"]["faseeh_voice"] = DEFAULT_FASEEH_VOICE
    manifest["meta"]["faseeh_style"] = DEFAULT_FASEEH_STYLE
    manifest["meta"]["tts_model"] = DEFAULT_TTS_MODEL
    manifest["items"] = updated_items

    with open(MANIFEST_PATH, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)

    from collections import Counter
    counts = Counter(i.get("character") for i in updated_items)
    print("=" * 70)
    print(f"✔ تم بناء جدول الإصدار v3.63 في {MANIFEST_PATH}:")
    for ch, cnt in counts.items():
        print(f"   - {ch}: {cnt}")
    print(f"   - الإجمالي الكلي: {len(updated_items)}")
    print("=" * 70)


def _extract_curriculum_reference_texts():
    """جمع نصوص مرجعية لكل مفتاح صوتي من الواجهات والمنطق.
    يعيد (refs, first_node): refs نصوص كاملة، first_node أول نص عربي داخل العنصر القابل للنقر (للمقاطع والحركات)."""
    def _clean(s):
        s = strip_html_and_emoji(s)
        return re.sub(r'\s+', ' ', s).strip()

    def _first_arabic_node(inner):
        for seg in re.split(r'<[^>]+>', inner):
            seg = _clean(seg)
            if re.search(r'[\u0600-\u06FF]', seg):
                return seg
        return ""

    refs, first_node = {}, {}
    html_files = glob.glob(os.path.join(BASE_DIR, 'views', '**', '*.html'), recursive=True)
    js_files = glob.glob(os.path.join(BASE_DIR, 'js', '**', '*.js'), recursive=True)

    # خرائط الدوال: fnName -> {arg: audioKey}
    fn_maps = {}
    pat_fn = re.compile(r"function\s+(\w+)\s*\(\s*(\w+)\s*\)\s*\{([\s\S]{0,8000}?)\n\s{0,12}\}")
    for jf in js_files:
        with open(jf, 'r', encoding='utf-8', errors='ignore') as f:
            jtxt = f.read()
        for m in pat_fn.finditer(jtxt):
            name, param, body = m.group(1), m.group(2), m.group(3)
            mp = dict(re.findall(r"['\"]?([A-Za-z0-9_]+)['\"]?\s*:\s*['\"]([a-z][a-z0-9_]+)['\"]", body))
            pm = re.search(r"playAudio\(\s*['\"]([a-z0-9_]+)['\"]\s*\+\s*" + re.escape(param) + r"\s*\)", body)
            entry = fn_maps.setdefault(name, {"map": {}, "prefix": None})
            entry["map"].update(mp)
            if pm:
                entry["prefix"] = pm.group(1)

    pat_click = re.compile(r"""<([a-zA-Z0-9]+)\b[^>]*onclick=["']([^"']*)["'][^>]*>([\s\S]{1,600}?)</\1>""")
    for hf in html_files:
        with open(hf, 'r', encoding='utf-8', errors='ignore') as f:
            txt = f.read()
        for m in pat_click.finditer(txt):
            handler, inner = m.group(2), m.group(3)
            keys = re.findall(r"playAudio\(\s*['\"]([a-zA-Z0-9_]+)['\"]", handler)
            for fn, arg in re.findall(r"(\w+)\(\s*['\"]([A-Za-z0-9_]+)['\"]", handler):
                e = fn_maps.get(fn)
                if e:
                    if arg in e["map"]:
                        keys.append(e["map"][arg])
                    elif e["prefix"]:
                        keys.append(e["prefix"] + arg)
            if not keys:
                continue
            full = _clean(inner)
            first = _first_arabic_node(inner)
            for k in keys:
                if re.search(r'[\u0600-\u06FF]', full):
                    refs.setdefault(k, []).append(full)
                if first:
                    first_node.setdefault(k, first)

    pat_ms = re.compile(r"""mascotSpeak\s*\(\s*(['"`])((?:\\.|(?!\1).)*?)\1\s*,\s*['"]([a-zA-Z0-9_]+)['"]""", re.S)
    pat_obj = re.compile(r"\{[^{}\n]{0,260}?(?:audio|audioKey|sound|soundKey)\s*:\s*['\"]([a-zA-Z0-9_]+)['\"][^{}\n]{0,260}?\}")
    pat_fields = re.compile(r"(?:word|text|title|label|syl|syllable|sentence|question)\s*:\s*['\"]([^'\"]+)['\"]")
    for cf in html_files + js_files:
        with open(cf, 'r', encoding='utf-8', errors='ignore') as f:
            txt = f.read()
        for m in pat_ms.finditer(txt):
            c = _clean(m.group(2))
            if re.search(r'[\u0600-\u06FF]', c):
                refs.setdefault(m.group(3), []).append(c)
        for m in pat_obj.finditer(txt):
            for fv in pat_fields.findall(m.group(0)):
                c = _clean(fv)
                if re.search(r'[\u0600-\u06FF]', c):
                    refs.setdefault(m.group(1), []).append(c)
    return refs, first_node


CURRICULUM_LETTER_CHARS = {
    'letter_ayn_salim': 'ع', 'letter_l_nabeel': 'ل', 'letter_q_booq': 'ق', 'letter_f_reef': 'ف',
    'letter_dhad': 'ض', 'letter_dhal': 'ذ', 'letter_dha': 'ظ', 'letter_ghayn': 'غ', 'letter_hamza': 'أ',
    'letter_kaf': 'ك', 'letter_kha': 'خ', 'letter_tha': 'ث', 'letter_sad': 'ص', 'letter_sh': 'ش',
    'letter_ha': 'ه', 'letter_ta': 'ط', 'letter_b': 'ب', 'letter_m': 'م', 'letter_d': 'د', 'letter_f': 'ف',
    'letter_r': 'ر', 'letter_s': 'س', 'letter_n': 'ن', 'letter_t': 'ت', 'letter_h': 'ح', 'letter_z': 'ز',
    'letter_j': 'ج',
}
VOWEL_SUFFIX_MARKS = {
    'short_a': '\u064e', 'short_u': '\u064f', 'short_i': '\u0650',
    'long_aa': '\u064eا', 'long_oo': '\u064fو', 'long_ee': '\u0650ي',
}


def _derive_vowel_text(key):
    """نص حتمي لمقاطع الحركات القصيرة والمدود (مثل letter_kaf_long_aa -> كَا <short pause> كَا)"""
    m = re.match(r'^(letter_[a-z_]+?)_(short_a|short_u|short_i|long_aa|long_oo|long_ee)$', key)
    if not m or m.group(1) not in CURRICULUM_LETTER_CHARS:
        return ""
    syl = CURRICULUM_LETTER_CHARS[m.group(1)] + VOWEL_SUFFIX_MARKS[m.group(2)]
    return f"{syl} <short pause> {syl}"


def _extract_make_lesson_texts_all_history():
    """نصوص make_lesson.py الحالية مع نصوص الإصدارات السابقة منه في تاريخ git (للدروس التي حُذفت قوالبها لاحقاً)"""
    texts = {}
    try:
        res = subprocess.run(
            ['git', 'log', '-p', '--', 'tools/make_lesson.py'],
            cwd=BASE_DIR, capture_output=True, text=True, encoding='utf-8', errors='ignore'
        )
        for k, t in re.findall(r'\(\s*"([a-zA-Z0-9_]+)"\s*,\s*"([^"]+)"\s*,\s*VOICE_\w+', res.stdout):
            texts.setdefault(k, t.strip())
    except Exception:
        pass
    texts.update(extract_make_lesson_texts())
    return texts


def _style_for_curriculum_key(key):
    if re.search(r'_(short|long)_|_syl_|_shape_|_tanween_(dham|fath|kasr)$|_sound$', key):
        return "calm, crisp, slow articulation"
    if re.search(r'_split_|_merge_', key):
        return "clear, steady, slow, distinct"
    if re.search(r'_word_|^item_|^word_|^lam_word_', key):
        return "clear, steady, distinct"
    if re.search(r'_read_|_sentence|_order_', key):
        return "warm, clear, steady"
    return select_style_for_key(key)


def build_full_curriculum_manifest(api_key, asr_workers=8):
    """v3.64: إضافة كل ملفات الدروس المتبقية (غير المسجلة في الجدول) بصوت الأستاذ باسل لتغطية المنهج كاملاً"""
    with open(MANIFEST_PATH, 'r', encoding='utf-8') as f:
        manifest = json.load(f)
    protected_keys, _ = get_protected_keys()
    existing = {it["key"] for it in manifest.get("items", [])}

    targets = []
    for path in sorted(glob.glob(os.path.join(AUDIO_DIR, '*.mp3'))):
        k = os.path.splitext(os.path.basename(path))[0]
        if k in existing or k in protected_keys or 'fatiha' in k:
            continue
        if os.path.getsize(path) < 500:
            continue
        targets.append(k)

    ml_texts = _extract_make_lesson_texts_all_history()
    refs, first_node = _extract_curriculum_reference_texts()

    # نصوص ثابتة لا تحتاج نسخاً صوتياً: النص الأصلي، ثم الحركات والمدود والمقاطع القصيرة من الواجهة
    fixed = {}
    for k in targets:
        size = os.path.getsize(os.path.join(AUDIO_DIR, f"{k}.mp3"))
        if k in ml_texts:
            fixed[k] = ml_texts[k]
            continue
        if size < 25000:
            dv = _derive_vowel_text(k)
            if dv:
                fixed[k] = dv
                continue
            if re.search(r'_syl_', k) and first_node.get(k):
                s = first_node[k].replace('ـ', '').strip()
                if 0 < len(s) <= 8:
                    fixed[k] = f"{s} <short pause> {s}"

    os.makedirs(BACKUP_DIR, exist_ok=True)
    cache = {}
    if os.path.exists(TRANSCRIPTS_CACHE_PATH):
        try:
            with open(TRANSCRIPTS_CACHE_PATH, 'r', encoding='utf-8') as f:
                cache = json.load(f)
        except Exception:
            cache = {}

    to_asr = [k for k in targets if k not in fixed and not re.search(r'[\u0600-\u06FF]', cache.get(k, ''))]
    print("=" * 70)
    print("📋 بناء جدول المنهج الكامل بصوت الأستاذ باسل (v3.64)")
    print(f"   - ملفات متبقية بغير صوت باسل: {len(targets)}")
    print(f"   - نص أصلي من make_lesson.py: {sum(1 for k in targets if k in ml_texts)}")
    print(f"   - حركات ومقاطع من الواجهة: {len(fixed) - sum(1 for k in targets if k in ml_texts)}")
    print(f"   - يحتاج نسخاً صوتياً (ASR): {len(to_asr)}")
    print("=" * 70, flush=True)

    if to_asr:
        if not api_key:
            raise ValueError("GEMINI_API_KEY مطلوب لنسخ الملفات الصوتية.")
        lock = threading.Lock()
        failed = []
        done_n = 0

        def _w(k):
            ref = (refs.get(k) or [""])[0]
            return k, transcribe_audio_with_gemini(os.path.join(AUDIO_DIR, f"{k}.mp3"), ref, api_key)

        with ThreadPoolExecutor(max_workers=max(1, asr_workers)) as ex:
            futs = {ex.submit(_w, k): k for k in to_asr}
            for fut in as_completed(futs):
                k = futs[fut]
                done_n += 1
                try:
                    _, txt = fut.result()
                    with lock:
                        cache[k] = txt
                        if done_n % 25 == 0:
                            with open(TRANSCRIPTS_CACHE_PATH, 'w', encoding='utf-8') as cf:
                                json.dump(cache, cf, ensure_ascii=False, indent=2)
                    if done_n % 25 == 0 or done_n == len(to_asr):
                        print(f"  📝 [{done_n}/{len(to_asr)}] {k}: {txt[:60]}", flush=True)
                except Exception as e:
                    failed.append((k, str(e)))
                    print(f"  ⚠️ [{done_n}/{len(to_asr)}] فشل نسخ {k}: {str(e)[:120]}", flush=True)
        with open(TRANSCRIPTS_CACHE_PATH, 'w', encoding='utf-8') as cf:
            json.dump(cache, cf, ensure_ascii=False, indent=2)
        if failed:
            print(f"⚠️ فشل نسخ {len(failed)} ملفاً (سيُستعمل النص المرجعي إن وُجد).")

    new_items, skipped = [], []
    for k in targets:
        txt = fixed.get(k) or cache.get(k) or ""
        if not re.search(r'[\u0600-\u06FF]', txt):
            cand = [r for r in refs.get(k, []) if len(r) >= 1]
            txt = cand[0] if cand else ""
        txt = txt.replace('ـ', '')
        txt = re.sub(r'\s+', ' ', txt).strip()
        if not re.search(r'[\u0600-\u06FF]', txt):
            skipped.append(k)
            continue
        new_items.append({
            "key": k,
            "character": "bassel_curriculum",
            "text": txt,
            "style": _style_for_curriculum_key(k),
            "voice": DEFAULT_FASEEH_VOICE,
        })

    manifest["items"] = manifest.get("items", []) + new_items
    manifest["meta"]["version"] = "v3.64"
    with open(MANIFEST_PATH, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
    print(f"✔ أُضيف {len(new_items)} عنصراً (bassel_curriculum). تخطي بلا نص: {len(skipped)} {skipped[:20]}")


def load_done_log():
    if os.path.exists(TTS_DONE_LOG_PATH):
        try:
            with open(TTS_DONE_LOG_PATH, 'r', encoding='utf-8') as f:
                return set(json.load(f))
        except Exception:
            return set()
    return set()


def save_done_log(done_keys):
    os.makedirs(BACKUP_DIR, exist_ok=True)
    tmp = TTS_DONE_LOG_PATH + ".tmp"
    with open(tmp, 'w', encoding='utf-8') as f:
        json.dump(sorted(done_keys), f, ensure_ascii=False, indent=2)
    os.replace(tmp, TTS_DONE_LOG_PATH)


def encode_wav_to_mp3_and_save(
    key,
    raw_audio,
    bitrate="64k",
    protected_keys=None,
    overwrite_human=False
):
    """معالجة الصوت المولد عبر ffmpeg وحفظه ذرياً بصيغة MP3 بعد حماية التسجيلات البشرية"""
    out_mp3 = os.path.join(AUDIO_DIR, f"{key}.mp3")
    is_protected = (key in protected_keys) if protected_keys is not None else key.startswith("teacher_")

    if is_protected and os.path.exists(out_mp3) and not overwrite_human:
        print(f"🔒 تم تخطي الملف المحمي: {key}.mp3 (استخدم --overwrite-human للاستبدال)", flush=True)
        return False

    # نسخ احتياطي خام قبل الاستبدال في audio_backup_raw/
    if os.path.exists(out_mp3):
        os.makedirs(BACKUP_DIR, exist_ok=True)
        bak_path = os.path.join(BACKUP_DIR, f"{key}.mp3")
        if not os.path.exists(bak_path):
            shutil.copy2(out_mp3, bak_path)

    temp_wav = os.path.join(AUDIO_DIR, f"{key}.temp.wav")
    temp_mp3 = os.path.join(AUDIO_DIR, f"{key}.tmp.mp3")
    try:
        with open(temp_wav, "wb") as f:
            f.write(raw_audio)

        ffmpeg_exe = master_audio.find_ffmpeg() if master_audio else None
        if ffmpeg_exe:
            filter_chain = build_gentle_gemini_filter_chain(include_loudnorm=True)
            cmd = [
                ffmpeg_exe, "-y", "-i", temp_wav,
                "-af", filter_chain,
                "-codec:a", "libmp3lame", "-b:a", bitrate, "-ar", "24000", "-ac", "1",
                temp_mp3
            ]
            res = subprocess.run(cmd, capture_output=True, text=True)
            if res.returncode != 0:
                fallback_chain = build_gentle_gemini_filter_chain(include_loudnorm=False)
                cmd_fb = [
                    ffmpeg_exe, "-y", "-i", temp_wav,
                    "-af", fallback_chain,
                    "-codec:a", "libmp3lame", "-b:a", bitrate, "-ar", "24000", "-ac", "1",
                    temp_mp3
                ]
                subprocess.run(cmd_fb, check=True, capture_output=True, text=True)
        else:
            with open(temp_mp3, "wb") as f:
                f.write(raw_audio)

        sz = os.path.getsize(temp_mp3) if os.path.exists(temp_mp3) else 0
        if sz < 2500:
            raise RuntimeError(f"حجم الملف الناتج صغير جداً ({sz} بايت): {key}.mp3")

        os.replace(temp_mp3, out_mp3)
        return os.path.getsize(out_mp3)
    finally:
        for p in (temp_wav, temp_mp3):
            if os.path.exists(p):
                try:
                    os.remove(p)
                except Exception:
                    pass


def generate_entry(
    item,
    overwrite_human=False,
    api_key=None,
    default_voice=DEFAULT_FASEEH_VOICE,
    default_style=DEFAULT_FASEEH_STYLE,
    bitrate="96k",
    protected_keys=None,
    model_name=DEFAULT_TTS_MODEL,
    abort_event=None
):
    key = item["key"]
    out_mp3 = os.path.join(AUDIO_DIR, f"{key}.mp3")
    is_protected = (key in protected_keys) if protected_keys is not None else key.startswith("teacher_")

    if is_protected and os.path.exists(out_mp3) and not overwrite_human:
        print(f"🔒 تم تخطي الملف المحمي: {key}.mp3 (استخدم --overwrite-human للاستبدال)", flush=True)
        return False

    voice_to_use = item.get("voice") or default_voice
    style_to_use = item.get("style", default_style)
    raw_audio = call_gemini_tts(
        text=item["text"],
        style_prompt=style_to_use,
        voice_name=voice_to_use,
        api_key=api_key,
        model_name=model_name,
        abort_event=abort_event
    )

    return encode_wav_to_mp3_and_save(
        key,
        raw_audio,
        bitrate=bitrate,
        protected_keys=protected_keys,
        overwrite_human=overwrite_human
    )


def load_batch_jobs_state():
    if os.path.exists(BATCH_JOBS_STATE_PATH):
        try:
            with open(BATCH_JOBS_STATE_PATH, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return data if isinstance(data, list) else []
        except Exception:
            return []
    return []


def save_batch_jobs_state(jobs):
    os.makedirs(BACKUP_DIR, exist_ok=True)
    tmp = BATCH_JOBS_STATE_PATH + ".tmp"
    with open(tmp, 'w', encoding='utf-8') as f:
        json.dump(jobs, f, ensure_ascii=False, indent=2)
    os.replace(tmp, BATCH_JOBS_STATE_PATH)


def upload_jsonl_to_files_api(jsonl_bytes, display_name, api_key):
    """رفع ملف JSONL لطلبات Batch API عبر بروتوكول Resumable Upload"""
    last_err = None
    for attempt in range(4):
        try:
            start_req = urllib.request.Request(
                "https://generativelanguage.googleapis.com/upload/v1beta/files",
                data=json.dumps({"file": {"display_name": display_name}}).encode('utf-8'),
                headers={
                    "x-goog-api-key": api_key,
                    "X-Goog-Upload-Protocol": "resumable",
                    "X-Goog-Upload-Command": "start",
                    "X-Goog-Upload-Header-Content-Length": str(len(jsonl_bytes)),
                    "X-Goog-Upload-Header-Content-Type": "application/jsonl",
                    "Content-Type": "application/json",
                },
                method="POST"
            )
            with urllib.request.urlopen(start_req, timeout=60) as r:
                upload_url = next(
                    (v for k, v in r.headers.items() if k.lower() == "x-goog-upload-url"),
                    None
                )
            if not upload_url:
                raise RuntimeError("لم يتم إرجاع X-Goog-Upload-URL من Gemini Files API")

            up_req = urllib.request.Request(
                upload_url,
                data=jsonl_bytes,
                headers={
                    "Content-Length": str(len(jsonl_bytes)),
                    "X-Goog-Upload-Offset": "0",
                    "X-Goog-Upload-Command": "upload, finalize",
                },
                method="POST"
            )
            with urllib.request.urlopen(up_req, timeout=120) as r:
                file_info = json.loads(r.read().decode('utf-8'))
            return file_info["file"]["name"]
        except urllib.error.HTTPError as e:
            err_msg = e.read().decode('utf-8', errors='ignore')
            last_err = RuntimeError(f"فشل رفع JSONL (HTTP {e.code}): {err_msg}")
            if e.code in (429, 500, 502, 503, 504) and attempt < 3:
                time.sleep(min(30.0, (2 ** (attempt + 1)) + random.uniform(0.3, 1.5)))
                continue
            raise last_err
        except Exception as e:
            last_err = RuntimeError(f"فشل الاتصال أثناء رفع JSONL: {e}")
            if attempt < 3:
                time.sleep(min(20.0, (2 ** attempt) + random.uniform(0.3, 1.5)))
                continue
            raise last_err
    raise last_err


def delete_uploaded_file_best_effort(file_name, api_key):
    """حذف الملف المؤقت من Gemini Files API دون تعطيل التنفيذ عند الفشل"""
    if not file_name:
        return
    try:
        req = urllib.request.Request(
            f"https://generativelanguage.googleapis.com/v1beta/{file_name.lstrip('/')}",
            headers={"x-goog-api-key": api_key},
            method="DELETE"
        )
        with urllib.request.urlopen(req, timeout=30):
            pass
    except Exception:
        pass


def create_tts_batch_job(file_name, model_name, display_name, api_key):
    """إنشاء مهمة BatchGenerateContent من ملف JSONL مرفوع"""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:batchGenerateContent?key={api_key}"
    payload = {
        "batch": {
            "displayName": display_name,
            "inputConfig": {"fileName": file_name}
        }
    }
    body_bytes = json.dumps(payload).encode('utf-8')
    last_err = None
    for attempt in range(4):
        req = urllib.request.Request(
            url,
            data=body_bytes,
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                res = json.loads(r.read().decode('utf-8'))
            return res["name"]
        except urllib.error.HTTPError as e:
            if e.code == 429:
                raise
            err_msg = e.read().decode('utf-8', errors='ignore')
            last_err = RuntimeError(f"فشل إنشاء الدفعة (HTTP {e.code}): {err_msg}")
            if e.code in (500, 502, 503, 504) and attempt < 3:
                time.sleep(min(30.0, (2 ** (attempt + 1)) + random.uniform(0.3, 1.5)))
                continue
            raise last_err
        except Exception as e:
            last_err = RuntimeError(f"فشل الاتصال أثناء إنشاء الدفعة: {e}")
            if attempt < 3:
                time.sleep(min(20.0, (2 ** attempt) + random.uniform(0.3, 1.5)))
                continue
            raise last_err
    raise last_err


def get_batch_job(batch_name, api_key):
    """استعلام حالة مهمة Batch API مع إعادة المحاولة عند أخطاء الشبكة أو 5xx"""
    url = f"https://generativelanguage.googleapis.com/v1beta/{batch_name.lstrip('/')}?key={api_key}"
    last_err = None
    for attempt in range(6):
        req = urllib.request.Request(url, method="GET")
        try:
            with urllib.request.urlopen(req, timeout=45) as r:
                return json.loads(r.read().decode('utf-8'))
        except urllib.error.HTTPError as e:
            err_msg = e.read().decode('utf-8', errors='ignore')
            last_err = RuntimeError(f"خطأ استعلام الدفعة {batch_name} (HTTP {e.code}): {err_msg}")
            if e.code in (429, 500, 502, 503, 504) and attempt < 5:
                time.sleep(min(30.0, (2 ** attempt) + random.uniform(0.3, 1.5)))
                continue
            raise last_err
        except Exception as e:
            last_err = RuntimeError(f"فشل الاتصال أثناء استعلام الدفعة {batch_name}: {e}")
            if attempt < 5:
                time.sleep(min(30.0, (2 ** attempt) + random.uniform(0.3, 1.5)))
                continue
            raise last_err
    raise last_err


def build_batch_jsonl_bytes(chunk_items, default_voice, default_style):
    """بناء محتوى JSONL بالصيغة المعتمدة لـ gemini-3.8-flash-tts مع speechMetadata.style"""
    lines = []
    for item in chunk_items:
        part = {"text": item["text"]}
        style_to_use = item.get("style", default_style)
        if style_to_use:
            part["speechMetadata"] = {"style": style_to_use}
        voice_to_use = item.get("voice") or default_voice
        if voice_to_use.startswith(("voice_", "voicekey_")):
            voice_config = {"voice": voice_to_use}
        else:
            voice_config = {"prebuiltVoiceConfig": {"voiceName": voice_to_use}}
        line_obj = {
            "key": item["key"],
            "request": {
                "contents": [{"role": "user", "parts": [part]}],
                "generationConfig": {
                    "responseModalities": ["AUDIO"],
                    "speechConfig": {
                        "voiceConfig": voice_config
                    }
                }
            }
        }
        lines.append(json.dumps(line_obj, ensure_ascii=False))
    return ("\n".join(lines) + "\n").encode("utf-8")


def _process_single_batch_result(obj, fallback_key, bitrate, protected_keys, overwrite_human):
    """استخراج الصوت من عنصر نتيجة واحد في Batch API وتحويله وحفظه كـ MP3"""
    meta = obj.get("metadata") if isinstance(obj.get("metadata"), dict) else {}
    key = obj.get("key") or meta.get("key") or fallback_key
    if not key:
        return None, "failed", "مفتاح العنصر مفقود في مخرجات الدفعة"

    err = obj.get("error")
    status_obj = obj.get("status")
    if err:
        return key, "failed", f"خطأ API: {err}"
    if isinstance(status_obj, dict) and status_obj.get("code", 0) != 0:
        return key, "failed", f"حالة خطأ: {status_obj}"
    if status_obj and not isinstance(status_obj, dict):
        return key, "failed", f"حالة خطأ: {status_obj}"

    cands = obj.get("response", {}).get("candidates", [])
    b64_data = None
    if cands:
        parts = cands[0].get("content", {}).get("parts", [])
        for p in parts:
            inline = p.get("inlineData") or p.get("inline_data")
            if inline and inline.get("data"):
                b64_data = inline["data"]
                break

    if not b64_data:
        finish_reason = cands[0].get("finishReason") if cands else "no_candidates"
        return key, "failed", f"لا توجد بيانات صوتية في الاستجابة ({finish_reason})"

    try:
        wav_bytes = base64.b64decode(b64_data)
        res_size = encode_wav_to_mp3_and_save(
            key,
            wav_bytes,
            bitrate=bitrate,
            protected_keys=protected_keys,
            overwrite_human=overwrite_human
        )
        if res_size is False:
            return key, "skipped", 0
        return key, "ok", res_size
    except Exception as e:
        return key, "failed", str(e)


def process_batch_responses_file(
    responses_file,
    api_key,
    bitrate,
    protected_keys,
    overwrite_human,
    done_keys,
    log_lock,
    expected_keys=None
):
    """تنزيل ملف نتائج Batch API وتدفق معالجته سطراً بسطر داخل audio_backup_raw/"""
    os.makedirs(BACKUP_DIR, exist_ok=True)
    safe_id = re.sub(r'[^A-Za-z0-9_.-]+', '_', responses_file.strip('/'))
    temp_jsonl = os.path.join(BACKUP_DIR, f"batch_resp_{safe_id}.jsonl")
    dl_url = f"https://generativelanguage.googleapis.com/download/v1beta/{responses_file.lstrip('/')}:download?alt=media"

    seen_keys = set()
    ok_count = 0
    failed = []
    idx = 0
    try:
        last_err = None
        for attempt in range(4):
            try:
                dl_req = urllib.request.Request(dl_url, headers={"x-goog-api-key": api_key})
                with urllib.request.urlopen(dl_req, timeout=180) as dr, open(temp_jsonl, "wb") as out_f:
                    while True:
                        chunk = dr.read(1024 * 1024)
                        if not chunk:
                            break
                        out_f.write(chunk)
                last_err = None
                break
            except Exception as e:
                last_err = e
                if attempt < 3:
                    time.sleep(min(20.0, (2 ** attempt) + random.uniform(0.3, 1.2)))
        if last_err is not None:
            raise RuntimeError(f"فشل تنزيل ملف نتائج الدفعة {responses_file}: {last_err}")

        with open(temp_jsonl, "r", encoding="utf-8") as f:
            for raw_line in f:
                line = raw_line.strip()
                if not line:
                    continue
                obj = json.loads(line)
                fallback_k = expected_keys[idx] if (expected_keys and idx < len(expected_keys)) else None
                idx += 1
                key, status, info = _process_single_batch_result(
                    obj, fallback_k, bitrate, protected_keys, overwrite_human
                )
                if key:
                    seen_keys.add(key)
                if status == "ok":
                    ok_count += 1
                    with log_lock:
                        done_keys.add(key)
                        if ok_count % 10 == 0:
                            save_done_log(done_keys)
                    print(f"   ✔ {key}.mp3 ({info} بايت)", flush=True)
                elif status == "skipped":
                    print(f"   🔒 تخطي محمي: {key}.mp3", flush=True)
                else:
                    failed.append((key or f"line_{idx}", info))
                    print(f"   ❌ فشل {key or f'line_{idx}'}: {info}", flush=True)
        with log_lock:
            save_done_log(done_keys)
        return seen_keys, ok_count, failed
    finally:
        if os.path.exists(temp_jsonl):
            try:
                os.remove(temp_jsonl)
            except Exception:
                pass


def run_batch_generation(
    pending_items,
    api_key,
    model_name,
    default_voice,
    default_style,
    bitrate,
    protected_keys,
    overwrite_human,
    done_keys,
    batch_size=120,
    batch_concurrency=2,
    poll_interval=12,
    resume=False
):
    """تشغيل التوليد عبر Gemini Batch API بدفعات متوازية واسترجاع ذري للنتائج"""
    log_lock = threading.Lock()
    filtered_items = []
    for it in pending_items:
        k = it["key"]
        out_mp3 = os.path.join(AUDIO_DIR, f"{k}.mp3")
        is_protected = (k in protected_keys) if protected_keys is not None else k.startswith("teacher_")
        if is_protected and os.path.exists(out_mp3) and not overwrite_human:
            print(f"🔒 تم تخطي الملف المحمي قبل الإرسال: {k}.mp3", flush=True)
            continue
        filtered_items.append(it)

    if not filtered_items:
        return 0, []

    remaining_map = {it["key"]: it for it in filtered_items}
    active_jobs = []
    assigned_keys = set()

    if resume:
        saved_jobs = load_batch_jobs_state()
        for sj in saved_jobs:
            sj_keys = [k for k in sj.get("keys", []) if k in remaining_map]
            if sj.get("model") == model_name and sj.get("batch_name") and sj_keys:
                active_jobs.append({
                    "batch_name": sj["batch_name"],
                    "file_name": sj.get("file_name"),
                    "model": model_name,
                    "keys": sj_keys,
                    "chunk_index": sj.get("chunk_index", 0),
                    "fresh": False,
                })
                assigned_keys.update(sj_keys)
        if active_jobs:
            print(f"♻️  استئناف {len(active_jobs)} دفعات نشطة مسجلة مسبقاً ({len(assigned_keys)} عنصراً).", flush=True)

    unassigned = [it for it in filtered_items if it["key"] not in assigned_keys]
    chunk_sz = max(1, batch_size)
    pending_chunks = [unassigned[i:i + chunk_sz] for i in range(0, len(unassigned), chunk_sz)]

    total_ok = 0
    total_failed = []
    next_chunk_idx = (max((j.get("chunk_index", 0) for j in active_jobs), default=0)) + 1
    retries_429 = 0
    terminal_success_states = {"BATCH_STATE_SUCCEEDED", "JOB_STATE_SUCCEEDED"}
    terminal_fail_states = {
        "BATCH_STATE_FAILED", "JOB_STATE_FAILED",
        "BATCH_STATE_CANCELLED", "JOB_STATE_CANCELLED",
        "BATCH_STATE_EXPIRED", "JOB_STATE_EXPIRED"
    }

    while active_jobs or pending_chunks:
        while len(active_jobs) < max(1, batch_concurrency) and pending_chunks:
            chunk = pending_chunks[0]
            c_idx = next_chunk_idx
            disp = f"qiraati-tts-v363-chunk-{c_idx}"
            jsonl_bytes = build_batch_jsonl_bytes(chunk, default_voice, default_style)
            file_name = upload_jsonl_to_files_api(jsonl_bytes, disp, api_key)
            try:
                batch_name = create_tts_batch_job(file_name, model_name, disp, api_key)
                pending_chunks.pop(0)
                next_chunk_idx += 1
                retries_429 = 0
                job_entry = {
                    "batch_name": batch_name,
                    "file_name": file_name,
                    "model": model_name,
                    "keys": [it["key"] for it in chunk],
                    "chunk_index": c_idx,
                    "fresh": True,
                }
                active_jobs.append(job_entry)
                save_batch_jobs_state([
                    {k: v for k, v in j.items() if k != "fresh"} for j in active_jobs
                ])
                print(f"📦 أُرسلت الدفعة #{c_idx} ({len(chunk)} عنصراً): {batch_name}", flush=True)
            except urllib.error.HTTPError as e:
                err_msg = e.read().decode('utf-8', errors='ignore')
                delete_uploaded_file_best_effort(file_name, api_key)
                if e.code == 429:
                    if active_jobs:
                        print(f"⏳ حد طابور Batch API ممتلئ مؤقتاً (429) — انتظار اكتمال الدفعات الجارية...", flush=True)
                        break
                    retries_429 += 1
                    if retries_429 <= 6:
                        wait_s = min(60, 15 * retries_429)
                        print(f"⏳ HTTP 429 عند إرسال الدفعة — انتظار {wait_s}ث ({retries_429}/6)...", flush=True)
                        time.sleep(wait_s)
                        continue
                raise RuntimeError(f"فشل إرسال الدفعة #{c_idx} (HTTP {e.code}): {err_msg}")

        if not active_jobs:
            break

        if all(j.get("fresh") for j in active_jobs):
            time.sleep(max(1, poll_interval))
        for j in active_jobs:
            j["fresh"] = False

        still_active = []
        freed_slot = False
        for job in active_jobs:
            batch_name = job["batch_name"]
            job_data = get_batch_job(batch_name, api_key)
            meta = job_data.get("metadata", {})
            state = meta.get("state", "")
            stats = meta.get("batchStats", {})
            is_done = bool(job_data.get("done")) or (state in terminal_success_states) or (state in terminal_fail_states)

            if not is_done:
                print(
                    f"   ⏳ {batch_name} ({len(job['keys'])} عنصراً): {state or 'PENDING'} {stats}",
                    flush=True
                )
                still_active.append(job)
                continue

            freed_slot = True
            print(f"📥 انتهت الدفعة {batch_name}: {state} | {stats}", flush=True)
            resp = job_data.get("response", {})

            if state in terminal_success_states or (
                state not in terminal_fail_states and not job_data.get("error") and (
                    resp.get("responsesFile") or resp.get("inlinedResponses")
                )
            ):
                seen_keys = set()
                if resp.get("responsesFile"):
                    rf = resp["responsesFile"]
                    seen_keys, ok_c, fails = process_batch_responses_file(
                        rf, api_key, bitrate, protected_keys, overwrite_human,
                        done_keys, log_lock, expected_keys=job["keys"]
                    )
                    total_ok += ok_c
                    total_failed.extend(fails)
                    delete_uploaded_file_best_effort(rf, api_key)
                elif resp.get("inlinedResponses"):
                    inlined = resp["inlinedResponses"]
                    if isinstance(inlined, dict):
                        inlined = inlined.get("inlinedResponses", [])
                    for idx_i, obj in enumerate(inlined):
                        fk = job["keys"][idx_i] if idx_i < len(job["keys"]) else None
                        key, st_res, info = _process_single_batch_result(
                            obj, fk, bitrate, protected_keys, overwrite_human
                        )
                        if key:
                            seen_keys.add(key)
                        if st_res == "ok":
                            total_ok += 1
                            with log_lock:
                                done_keys.add(key)
                            print(f"   ✔ {key}.mp3 ({info} بايت)", flush=True)
                        elif st_res == "skipped":
                            print(f"   🔒 تخطي محمي: {key}.mp3", flush=True)
                        else:
                            total_failed.append((key or f"inlined_{idx_i}", info))
                    with log_lock:
                        save_done_log(done_keys)
                else:
                    for k in job["keys"]:
                        total_failed.append((k, "اكتملت الدفعة بدون responsesFile أو inlinedResponses"))

                for expected_k in job["keys"]:
                    if expected_k not in seen_keys and expected_k not in done_keys:
                        total_failed.append((expected_k, "مفقود من مخرجات الدفعة"))
            else:
                err_info = job_data.get("error") or meta.get("error") or state
                for k in job["keys"]:
                    if k not in done_keys:
                        total_failed.append((k, f"فشل الدفعة {state}: {err_info}"))
                print(f"❌ فشلت الدفعة {batch_name}: {err_info}", flush=True)

            delete_uploaded_file_best_effort(job.get("file_name"), api_key)

        active_jobs = still_active
        save_batch_jobs_state([
            {k: v for k, v in j.items() if k != "fresh"} for j in active_jobs
        ])

        if active_jobs and not (freed_slot and pending_chunks):
            time.sleep(max(1, poll_interval))

    if not active_jobs and os.path.exists(BATCH_JOBS_STATE_PATH):
        try:
            os.remove(BATCH_JOBS_STATE_PATH)
        except Exception:
            pass

    return total_ok, total_failed


def main():
    parser = argparse.ArgumentParser(description="أداة التوليد الصوتي التعبيري عبر Gemini TTS")
    parser.add_argument("--key", type=str, help="مفتاح عنصر محدد لتوليده من tts_manifest.json")
    parser.add_argument("--keys", type=str, help="قائمة مفاتيح مفصولة بفاصلة لتوليدها")
    parser.add_argument("--character", type=str, help="توليد شخصية أو عدة شخصيات مفصولة بفاصلة (مثل bassel_dialogue,bassel_module)")
    parser.add_argument("--all", action="store_true", help="توليد كافة العناصر الواردة في الجدول")
    parser.add_argument("--overwrite-human", action="store_true", help="استبدال الملفات المحمية (بحذر)")
    parser.add_argument("--build-dialogues-manifest", action="store_true", help="بناء وتحديث جدول الحوارات والمسرح والألعاب")
    parser.add_argument("--build-v363-manifest", action="store_true", help="تحديث جدول v3.63 بالصوت المعاير ومكتبة الفونيمات النقية الـ 28 والمفاتيح المفقودة")
    parser.add_argument("--build-full-curriculum-manifest", action="store_true", help="v3.64: إضافة كل ملفات الدروس المتبقية بصوت الأستاذ باسل")
    parser.add_argument("--workers", type=int, default=4, help="عدد مسارات التوليد المتوازية")
    parser.add_argument("--bitrate", type=str, default="96k", help="معدل البت لـ MP3 (مثل 64k أو 96k)")
    parser.add_argument("--model", type=str, default=DEFAULT_TTS_MODEL, help="نموذج توليد الصوت (الافتراضي: gemini-3.8-flash-tts)")
    parser.add_argument("--resume", action="store_true", help="تخطي المفاتيح المنجزة مسبقاً في tts_done_v363.json")
    parser.add_argument("--batch", action="store_true", help="تشغيل التوليد عبر Gemini Batch API بحصة منفصلة وبنصف التكلفة")
    parser.add_argument("--batch-size", type=int, default=120, help="عدد العناصر في كل دفعة Batch API")
    parser.add_argument("--batch-concurrency", type=int, default=2, help="الحد الأقصى للدفعات النشطة بالتوازي")
    parser.add_argument("--poll-interval", type=int, default=12, help="فاصل استعلام حالة الدفعات بالثواني")
    args = parser.parse_args()

    api_key = get_gemini_api_key()

    if args.build_v363_manifest:
        build_v363_manifest()
        if not (args.key or args.keys or args.all or args.character):
            sys.exit(0)

    if args.build_full_curriculum_manifest:
        build_full_curriculum_manifest(api_key, asr_workers=args.workers)
        if not (args.key or args.keys or args.all or args.character):
            sys.exit(0)

    if args.build_dialogues_manifest:
        build_dialogues_manifest(api_key)
        if not (args.key or args.keys or args.all or args.character):
            sys.exit(0)

    if not os.path.exists(MANIFEST_PATH):
        print(f"❌ ملف الجدول غير موجود: {MANIFEST_PATH}")
        sys.exit(1)

    with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    meta = manifest.get("meta", {})
    default_voice = meta.get("faseeh_voice", DEFAULT_FASEEH_VOICE)
    default_style = meta.get("faseeh_style", DEFAULT_FASEEH_STYLE)

    items = manifest.get("items", [])
    if args.key:
        items = [it for it in items if it["key"] == args.key]
        if not items:
            print(f"❌ المفتاح {args.key} غير موجود في {MANIFEST_PATH}")
            sys.exit(1)
    elif args.keys:
        wanted = {k.strip() for k in args.keys.split(",") if k.strip()}
        items = [it for it in items if it["key"] in wanted]
        if not items:
            print(f"❌ لم يُعثر على أي من المفاتيح المطلوبة في {MANIFEST_PATH}")
            sys.exit(1)
    elif args.character:
        wanted_chars = {c.strip() for c in args.character.split(",") if c.strip()}
        items = [it for it in items if it.get("character") in wanted_chars]
        if not items:
            print(f"❌ لم يُعثر على عناصر للشخصيات: {wanted_chars}")
            sys.exit(1)

    if not args.key and not args.keys and not args.all and not args.character:
        print("ℹ️ الاستخدام: حدد --key <name> أو --keys <k1,k2> أو --all أو --character <char1,char2> أو --build-dialogues-manifest")
        print(f"   إجمالي العناصر المتاحة في الجدول: {len(items)}")
        sys.exit(0)

    if not api_key:
        print("❌ لم يتم العثور على GEMINI_API_KEY في متغيرات البيئة أو ai_server/.env!")
        print("   يرجى تعيين المتغير: set GEMINI_API_KEY=your_key ثم إعادة التشغيل.")
        sys.exit(1)

    protected_keys, _ = get_protected_keys()
    done_keys = load_done_log() if args.resume else set()
    pending_items = []
    skipped_resume = 0
    for it in items:
        k = it["key"]
        mp3_p = os.path.join(AUDIO_DIR, f"{k}.mp3")
        if args.resume and k in done_keys and os.path.exists(mp3_p) and os.path.getsize(mp3_p) >= 2500:
            skipped_resume += 1
            continue
        pending_items.append(it)

    print("=" * 65, flush=True)
    print("🚀 بدء التوليد الصوتي التعبيري لمنصة قراءتي الذكية (v3.63)", flush=True)
    print(f"   • المطلوب: {len(items)} | مستأنف/مكتمل مسبقاً: {skipped_resume} | متبقي للتوليد: {len(pending_items)}", flush=True)
    if args.batch:
        print(f"   • الوضع: Batch API | النموذج: {args.model} | حجم الدفعة: {args.batch_size} | تزامن الدفعات: {args.batch_concurrency} | معدل البت: {args.bitrate} | الصوت: {default_voice}", flush=True)
    else:
        print(f"   • النموذج: {args.model} | المسارات: {args.workers} | معدل البت: {args.bitrate} | الصوت: {default_voice}", flush=True)
    print("=" * 65, flush=True)

    if not pending_items:
        print("✨ كافة الملفات المطلوبة منجزة ومحققة بالفعل!", flush=True)
        sys.exit(0)

    if args.batch:
        success, failed = run_batch_generation(
            pending_items=pending_items,
            api_key=api_key,
            model_name=args.model,
            default_voice=default_voice,
            default_style=default_style,
            bitrate=args.bitrate,
            protected_keys=protected_keys,
            overwrite_human=args.overwrite_human,
            done_keys=done_keys,
            batch_size=args.batch_size,
            batch_concurrency=args.batch_concurrency,
            poll_interval=args.poll_interval,
            resume=args.resume
        )
        print("=" * 65, flush=True)
        print(f"✨ اكتمل التوليد عبر Batch API: {success}/{len(pending_items)} ملفات جديدة/محدثة بنجاح (فشل: {len(failed)}).", flush=True)
        if failed:
            for fk, fe in failed[:15]:
                print(f"   - {fk}: {fe}", flush=True)
            sys.exit(1)
        sys.exit(0)

    success = 0
    failed = []
    quota_exhausted_err = None
    log_lock = threading.Lock()
    abort_event = threading.Event()
    total_pending = len(pending_items)

    def _run_item(it):
        res_size = generate_entry(
            it,
            overwrite_human=args.overwrite_human,
            api_key=api_key,
            default_voice=default_voice,
            default_style=default_style,
            bitrate=args.bitrate,
            protected_keys=protected_keys,
            model_name=args.model,
            abort_event=abort_event
        )
        return it["key"], res_size

    workers = max(1, args.workers)
    ex = ThreadPoolExecutor(max_workers=workers)
    try:
        fut_map = {ex.submit(_run_item, it): it["key"] for it in pending_items}
        done_cnt = 0
        for fut in as_completed(fut_map):
            k = fut_map[fut]
            done_cnt += 1
            try:
                key, res_size = fut.result()
                if res_size:
                    success += 1
                    with log_lock:
                        done_keys.add(key)
                        if success % 5 == 0 or done_cnt == total_pending:
                            save_done_log(done_keys)
                    print(f"✔ [{done_cnt}/{total_pending}] {key}.mp3 ({res_size} بايت)", flush=True)
                else:
                    print(f"🔒 [{done_cnt}/{total_pending}] تخطي محمي: {key}.mp3", flush=True)
            except DailyQuotaExhaustedError as qe:
                if quota_exhausted_err is None:
                    quota_exhausted_err = str(qe)
                abort_event.set()
                print(f"⛔ [{done_cnt}/{total_pending}] انتهت الحصة اليومية للنموذج ({k}): {qe}", flush=True)
                break
            except Exception as e:
                failed.append((k, str(e)))
                print(f"❌ [{done_cnt}/{total_pending}] فشل {k}: {e}", flush=True)
    finally:
        with log_lock:
            save_done_log(done_keys)
        if abort_event.is_set():
            ex.shutdown(wait=False, cancel_futures=True)
        else:
            ex.shutdown(wait=True)

    print("=" * 65, flush=True)
    print(f"✨ اكتمل التوليد: {success}/{total_pending} ملفات جديدة/محدثة بنجاح (فشل: {len(failed)}).", flush=True)
    if quota_exhausted_err:
        print(f"⛔ توقف فوري بسبب انتهاء الحصة اليومية: {quota_exhausted_err}", flush=True)
        sys.exit(2)
    if failed:
        for fk, fe in failed[:15]:
            print(f"   - {fk}: {fe}", flush=True)
        sys.exit(1)


if __name__ == '__main__':
    main()
