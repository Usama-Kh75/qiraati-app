#!/usr/bin/env python3
"""
أداة التوليد الصوتي التعبيري الواقعي لمنصة قراءتي التفاعلية الذكية
باستخدام Gemini Expressive TTS (gemini-3.8-flash-tts)
إعداد وتطوير: المهندس أسامة خليل هاشم

القواعد الصارمة:
1. قراءة GEMINI_API_KEY حصراً من متغيرات البيئة (os.environ). يُمنع منعاً باتاً كتابة أي مفتاح سري في الكود.
2. الحفاظ التام على التسجيلات البشرية الحقيقية (الملفات التي تبدأ بـ teacher_) وعدم استبدالها إلا بأمر صريح (--overwrite-human).
3. معالجة الصوت المولد فورياً عبر master_audio.py لضمان الدفء ونقاء الاستوديو وتوحيد العلو.
"""

import os
import sys
import json
import base64
import argparse
import subprocess
import urllib.request
import urllib.error

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUDIO_DIR = os.path.join(BASE_DIR, 'audio')
MANIFEST_PATH = os.path.join(BASE_DIR, 'tools', 'tts_manifest.json')

sys.path.insert(0, os.path.join(BASE_DIR, 'tools'))
try:
    import master_audio
except ImportError:
    master_audio = None

def get_gemini_api_key():
    key = os.environ.get('GEMINI_API_KEY', '').strip()
    return key

def call_gemini_tts(text, style_prompt, voice_name="Puck", api_key=None):
    """استدعاء Gemini Interactions API لتوليد الصوت التعبيري"""
    if not api_key:
        api_key = get_gemini_api_key()
    if not api_key:
        raise ValueError("متغير البيئة GEMINI_API_KEY غير موجود! يرجى تعيينه في النظام قبل التشغيل.")

    endpoint = "https://generativelanguage.googleapis.com/v1beta/interactions"
    headers = {
        "x-goog-api-key": api_key,
        "Content-Type": "application/json"
    }

    payload = {
        "model": "gemini-3.8-flash-tts",
        "input": [{
            "type": "user_input",
            "content": [{
                "type": "text",
                "text": text,
                "annotations": [{
                    "type": "speech_metadata",
                    "style": style_prompt
                }]
            }]
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

    req = urllib.request.Request(
        endpoint,
        data=json.dumps(payload).encode('utf-8'),
        headers=headers,
        method="POST"
    )

    try:
        with urllib.request.urlopen(req, timeout=60) as response:
            res_data = json.loads(response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode('utf-8', errors='ignore')
        raise RuntimeError(f"HTTP Error {e.code}: {err_msg}")
    except Exception as e:
        raise RuntimeError(f"فشل الاتصال بـ Gemini API: {e}")

    # استخراج البيانات الصوتية Base64
    audio_b64 = None
    if "steps" in res_data:
        for step in res_data["steps"]:
            if step.get("type") == "model_output":
                for item in step.get("content", []):
                    if item.get("type") == "audio" and "data" in item:
                        audio_b64 = item["data"]
                        break
    elif "output_audio" in res_data:
        audio_b64 = res_data["output_audio"].get("data")

    if not audio_b64:
        raise RuntimeError(f"لم يتم العثور على بيانات صوتية في استجابة Gemini: {res_data}")

    return base64.b64decode(audio_b64)

def generate_entry(item, overwrite_human=False, api_key=None):
    key = item["key"]
    out_mp3 = os.path.join(AUDIO_DIR, f"{key}.mp3")
    is_human = key.startswith("teacher_")

    if is_human and os.path.exists(out_mp3) and not overwrite_human:
        print(f"🔒 تم تخطي الملف البشري المحمي: {key}.mp3 (استخدم --overwrite-human للاستبدال)")
        return False

    print(f"🎙️ جارٍ توليد [{key}] بصوت {item.get('character')}...")
    raw_audio = call_gemini_tts(
        text=item["text"],
        style_prompt=item.get("style", ""),
        voice_name=item.get("voice", "Puck"),
        api_key=api_key
    )

    temp_wav = os.path.join(AUDIO_DIR, f"{key}.temp.wav")
    with open(temp_wav, "wb") as f:
        f.write(raw_audio)

    # معالجة الملف عبر ffmpeg
    ffmpeg_exe = master_audio.find_ffmpeg() if master_audio else None
    if ffmpeg_exe:
        filter_chain = master_audio.build_filter_chain(include_loudnorm=True)
        cmd = [
            ffmpeg_exe, "-y", "-i", temp_wav,
            "-af", filter_chain,
            "-codec:a", "libmp3lame", "-b:a", "64k", "-ar", "24000", "-ac", "1",
            out_mp3
        ]
        res = subprocess.run(cmd, capture_output=True, text=True)
        if res.returncode != 0:
            # إعادة المحاولة بدون loudnorm في حال المقاطع القصيرة
            fallback_chain = master_audio.build_filter_chain(include_loudnorm=False)
            cmd_fb = [
                ffmpeg_exe, "-y", "-i", temp_wav,
                "-af", fallback_chain,
                "-codec:a", "libmp3lame", "-b:a", "64k", "-ar", "24000", "-ac", "1",
                out_mp3
            ]
            subprocess.run(cmd_fb, check=True)
    else:
        # تحويل مباشر إن تعذر ffmpeg
        with open(out_mp3, "wb") as f:
            f.write(raw_audio)

    if os.path.exists(temp_wav):
        try: os.remove(temp_wav)
        except Exception: pass

    print(f"✔ تم توليد ومعالجة: {key}.mp3 بنجاح ({os.path.getsize(out_mp3)} بايت)")
    return True

def main():
    parser = argparse.ArgumentParser(description="أداة التوليد الصوتي التعبيري عبر Gemini TTS")
    parser.add_argument("--key", type=str, help="مفتاح عنصر محدد لتوليده من tts_manifest.json")
    parser.add_argument("--character", choices=["faseeh", "teacher"], help="توليد شخصية محددة فقط")
    parser.add_argument("--all", action="store_true", help="توليد كافة العناصر الواردة في الجدول")
    parser.add_argument("--overwrite-human", action="store_true", help="استبدال التسجيلات البشرية teacher_* (بحذر)")
    args = parser.parse_args()

    if not os.path.exists(MANIFEST_PATH):
        print(f"❌ ملف الجدول غير موجود: {MANIFEST_PATH}")
        sys.exit(1)

    with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    items = manifest.get("items", [])
    if args.key:
        items = [it for it in items if it["key"] == args.key]
        if not items:
            print(f"❌ المفتاح {args.key} غير موجود في {MANIFEST_PATH}")
            sys.exit(1)
    elif args.character:
        items = [it for it in items if it.get("character") == args.character]

    if not args.key and not args.all and not args.character:
        print("ℹ️ الاستخدام: حدد --key <name> أو --all أو --character <faseeh|teacher>")
        print(f"   إجمالي العناصر المتاحة في الجدول: {len(items)}")
        sys.exit(0)

    api_key = get_gemini_api_key()
    if not api_key:
        print("❌ لم يتم العثور على GEMINI_API_KEY في متغيرات البيئة!")
        print("   يرجى تعيين المتغير: set GEMINI_API_KEY=your_key ثم إعادة التشغيل.")
        sys.exit(1)

    print("=" * 65)
    print("🚀 بدء التوليد الصوتي التعبيري لمنصة قراءتي الذكية (v3.56)")
    print("=" * 65)

    success = 0
    for it in items:
        try:
            if generate_entry(it, overwrite_human=args.overwrite_human, api_key=api_key):
                success += 1
        except Exception as e:
            print(f"❌ خطأ أثناء توليد {it['key']}: {e}")

    print("=" * 65)
    print(f"✨ اكتمل التوليد: {success}/{len(items)} ملفات بنجاح.")

if __name__ == '__main__':
    main()
