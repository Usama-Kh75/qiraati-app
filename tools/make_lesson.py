#!/usr/bin/env python3
"""
خط الإنتاج المؤتمت السريع لمنصة قراءتي التفاعلية الذكية (Rapid Lesson Production Line)
إعداد وتطوير: المهندس أسامة خليل هاشم

هذه الأداة تقوم بأتمتة كاملة لدورة إنتاج الدروس الجديدة:
1. استخراج صفحات الكتاب من ملف PDF الأصلي بدقة فائقة 1241x1756.
2. قص واقتطاع الأنشطة والمشاهد من صفحات الكتاب بدقة بكسلية متناهية.
3. توليد التسجيلات الصوتية الفونيمية بنطق عراقي فصيح عبر edge-tts (المعلمة رنا / فصيح باسل).
4. ترميز الأصوات بصيغة Base64 وتحديث قاعدة البيانات الصوتية audio_data.js فورياً.
5. بناء واجهات الدروس المستقلة views/ والمنطق التفاعلي js/lessons/ والتنسيق css/.
6. تحديث شجرة المنهج curriculum_data.js والتنقل navigation.js وقائمة السماح .gitignore.
7. تجميع التطبيق عبر tools/build.py ومزامنة كاش الخدمة sw.js عبر tools/sync.py.
"""

import os
import sys
import re
import json
import base64
import asyncio
import argparse
import subprocess
import time
from PIL import Image

try:
    import fitz  # PyMuPDF
except ImportError:
    fitz = None

try:
    import edge_tts
except ImportError:
    edge_tts = None

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PDF_PATH = os.path.join(BASE_DIR, '1044974620-كتاب-قرائتي-الجديد-اول-ابتدائي.pdf')
AUDIO_DIR = os.path.join(BASE_DIR, 'audio')
TOOLS_DIR = os.path.join(BASE_DIR, 'tools')

VOICE_RANA = 'ar-IQ-RanaNeural'
VOICE_BASSEL = 'ar-IQ-BasselNeural'


# =========================================================================
# 1. استخراج صفحات الكتاب بدقة 1241x1756
# =========================================================================
def extract_book_pages(page_map):
    """
    page_map: dict mapping {pdf_index: output_filename}
    مثال: {109: 'page_110.png', 110: 'page_111.png'}
    """
    if not fitz:
        raise RuntimeError("مكتبة PyMuPDF (fitz) غير مثبتة!")
    if not os.path.exists(PDF_PATH):
        raise FileNotFoundError(f"لم يتم العثور على ملف الكتاب: {PDF_PATH}")

    print("📄 [1/5] استخراج صفحات الكتاب المدرسي بدقة فائقة...")
    doc = fitz.open(PDF_PATH)
    scale = 1241.0 / 595.276
    mat = fitz.Matrix(scale, scale)

    for pno, out_name in page_map.items():
        out_path = os.path.join(BASE_DIR, out_name)
        if 0 <= pno < len(doc):
            page = doc[pno]
            pix = page.get_pixmap(matrix=mat, alpha=False)
            pix.save(out_path)
            print(f"   ✔ تم حفظ {out_name} (أبعاد: {pix.width}x{pix.height})")
        else:
            print(f"   ⚠ فهرس الصفحة {pno} خارج نطاق الكتاب!")


# =========================================================================
# 2. قص واقتطاع الأنشطة
# =========================================================================
def crop_activity_boxes(crops_list):
    """
    crops_list: list of dicts:
    [{'src': 'page_111.png', 'out': 'activity_ghayn_scene.png', 'top_pt': 20, 'bot_pt': 360, 'margin_x': 50}]
    """
    scale = 1241.0 / 595.276
    print("✂️ [2/5] اقتطاع الأنشطة والمشاهد المجهرية من الصفحات...")
    for c in crops_list:
        src_path = os.path.join(BASE_DIR, c['src'])
        out_path = os.path.join(BASE_DIR, c['out'])
        if not os.path.exists(src_path):
            print(f"   ⚠ تعذر العثور على الصفحة المصدر: {c['src']}")
            continue
        im = Image.open(src_path)
        w, h = im.size
        top_px = int(c['top_pt'] * scale)
        bot_px = int(c['bot_pt'] * scale)
        margin_x = c.get('margin_x', 50)
        cropped = im.crop((margin_x, top_px, w - margin_x, bot_px))
        cropped.save(out_path)
        print(f"   ✔ تم قص {c['out']} (أبعاد: {cropped.size})")


# =========================================================================
# 3. توليد التسجيلات الصوتية عبر edge-tts
# =========================================================================
async def generate_speech_batch(audio_items):
    """
    audio_items: list of tuples: (filename_key, text, voice_name, rate, pitch)
    """
    if not edge_tts:
        raise RuntimeError("مكتبة edge-tts غير مثبتة!")

    os.makedirs(AUDIO_DIR, exist_ok=True)
    total = len(audio_items)
    print(f"🎙️ [3/5] توليد {total} تسجيلاً صوتياً باللهجة العراقية الفصيحة...")

    sem = asyncio.Semaphore(5)  # حد أقصى للاتصالات المتزامنة

    async def _gen(idx, key, text, voice, rate, pitch):
        async with sem:
            out_file = os.path.join(AUDIO_DIR, f"{key}.mp3")
            if os.path.exists(out_file) and os.path.getsize(out_file) > 500:
                return (key, out_file, False)
            for attempt in range(3):
                try:
                    comm = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch)
                    await comm.save(out_file)
                    return (key, out_file, True)
                except Exception as e:
                    if attempt == 2:
                        print(f"   ❌ فشل توليد {key}: {e}")
                        return (key, None, False)
                    await asyncio.sleep(1)

    tasks = [_gen(i, item[0], item[1], item[2], item[3] if len(item)>3 else "+0%", item[4] if len(item)>4 else "+0Hz")
             for i, item in enumerate(audio_items)]

    results = await asyncio.gather(*tasks)
    generated_count = sum(1 for r in results if r[2])
    print(f"   ✔ تم الانتهاء ({generated_count} ملف صوتي جديد، و {total - generated_count} ملف مسبق).")
    return results


def run_generate_audio(audio_items):
    return asyncio.run(generate_speech_batch(audio_items))


# =========================================================================
# 4. ترميز الأصوات بصيغة Base64 وتحديث audio_data.js
# =========================================================================
def update_audio_data_js(audio_keys):
    """
    يقوم بترميز ملفات audio/*.mp3 إلى Base64 وتحديث/إلحاق القيم في audio_data_unit6.js
    (أو audio_data.js) بطريقة التدفق السريع لتفادي تجاوز حد 100 م.ب لمستودع GitHub.
    """
    u6_prefixes = ('letter_ghayn', 'letter_ha', 'letter_dhal', 'letter_dha', 'unit6', 'al_shamsiyyah', 'lam_')
    is_u6 = any(any(k.startswith(p) for p in u6_prefixes) for k in audio_keys)
    target_filename = 'audio_data_unit6.js' if is_u6 else 'audio_data.js'
    audio_data_path = os.path.join(BASE_DIR, target_filename)
    print(f"⚡ [4/5] تحديث قاعدة البيانات الصوتية المضمنة ({target_filename})...")

    if not os.path.exists(audio_data_path):
        if is_u6:
            lines = [
                "// قاعدة البيانات الصوتية للوحدة السادسة (العالم من حولي) - إعداد المهندس أسامة خليل هاشم\n",
                "window.AUDIO_DATA = window.AUDIO_DATA || {};\n",
                "Object.assign(window.AUDIO_DATA, {\n",
                "});\n"
            ]
        else:
            lines = ["// قاعدة البيانات الصوتية الفونيمية المضمنة بصيغة Base64 - إعداد المهندس أسامة خليل هاشم\n", "window.AUDIO_DATA = window.AUDIO_DATA || {\n", "};\n"]
    else:
        with open(audio_data_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()

    # فحص المفاتيح الموجودة مسبقاً لتفادي التكرار
    existing_keys = set()
    for l in lines:
        km = re.match(r'^\s*"([^"]+)":', l)
        if km:
            existing_keys.add(km.group(1))

    # تجهيز الإدخالات الجديدة
    new_entries = []
    for key in audio_keys:
        if key in existing_keys:
            continue
        mp3_path = os.path.join(AUDIO_DIR, f"{key}.mp3")
        if os.path.exists(mp3_path):
            with open(mp3_path, 'rb') as f:
                b64 = base64.b64encode(f.read()).decode('utf-8')
            new_entries.append(f'  "{key}": "data:audio/mp3;base64,{b64}"')

    if not new_entries:
        print(f"   ✔ جميع المفاتيح الصوتية موجودة بالفعل في {target_filename}.")
        return

    # العثور على السطر الأخير الذي يحتوي على "};" أو "});"
    closing_idx = -1
    for idx in range(len(lines) - 1, -1, -1):
        if '};' in lines[idx] or '});' in lines[idx] or '}' in lines[idx]:
            closing_idx = idx
            break

    if closing_idx == -1:
        closing_idx = len(lines)
        lines.append("});\n" if is_u6 else "};\n")

    # إضافة فاصلة للسطر السابق إذا لم تكن موجودة
    prev_idx = closing_idx - 1
    while prev_idx >= 0 and not lines[prev_idx].strip():
        prev_idx -= 1
    if prev_idx >= 0:
        prev_line = lines[prev_idx].rstrip()
        if not prev_line.endswith(','):
            lines[prev_idx] = prev_line + ",\n"

    # إدراج الإدخالات الجديدة
    insert_text = ",\n".join(new_entries) + "\n"
    lines.insert(closing_idx, insert_text)

    with open(audio_data_path, 'w', encoding='utf-8') as f:
        f.writelines(lines)

    print(f"   ✔ تم إلحاق {len(new_entries)} تسجيلاً صوتياً جديداً بنجاح في {target_filename}.")


# =========================================================================
# 5. تحديث ملفات النظام والمزامنة التلقائية
# =========================================================================
def update_gitignore_whitelist(new_patterns):
    """
    تحديث قائمة السماح في .gitignore
    """
    gitignore_path = os.path.join(BASE_DIR, '.gitignore')
    with open(gitignore_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    existing = set(l.strip() for l in lines)
    to_add = []
    for pat in new_patterns:
        entry = f"!/{pat}" if not pat.startswith("!/") else pat
        if entry not in existing:
            to_add.append(entry)

    if to_add:
        with open(gitignore_path, 'a', encoding='utf-8') as f:
            f.write("\n# إضافات خط الإنتاج التلقائي make_lesson.py\n")
            for item in to_add:
                f.write(item + "\n")
        print(f"✔ تم تحديث .gitignore بإضافة {len(to_add)} أصلاً جديداً.")


def run_pipeline_build_and_sync(bump_cache=True):
    """
    تشغيل أداتي البناء والمزامنة
    """
    print("\n🔨 [5/5] تجميع واجهات التطبيق ومزامنة كاش الخدمة...")
    subprocess.run([sys.executable, os.path.join(TOOLS_DIR, 'build.py')], check=True)

    cmd = [sys.executable, os.path.join(TOOLS_DIR, 'sync.py')]
    if bump_cache:
        cmd.append('--bump')
    subprocess.run(cmd, check=True)


# =========================================================================
# 6. نماذج الدروس الجاهزة (Built-in Lesson Presets)
# =========================================================================
PRESET_GHAYN = {
    "name": "حرف الغين (ص 110 - 113)",
    "pages": {
        109: 'page_110.png',
        110: 'page_111.png',
        111: 'page_112.png',
        112: 'page_113.png',
        113: 'page_114.png'
    },
    "crops": [
        {'src': 'page_110.png', 'out': 'unit6_world_listen.png', 'top_pt': 48, 'bot_pt': 650, 'margin_x': 40},
        {'src': 'page_111.png', 'out': 'activity_ghayn_scene.png', 'top_pt': 20, 'bot_pt': 360, 'margin_x': 50},
        {'src': 'page_111.png', 'out': 'activity_ghayn_words.png', 'top_pt': 350, 'bot_pt': 600, 'margin_x': 50},
        {'src': 'page_111.png', 'out': 'activity_ghayn_vowels.png', 'top_pt': 600, 'bot_pt': 780, 'margin_x': 50},
        {'src': 'page_112.png', 'out': 'activity_ghayn_vowel_words.png', 'top_pt': 20, 'bot_pt': 350, 'margin_x': 50},
        {'src': 'page_112.png', 'out': 'activity_ghayn_syllables.png', 'top_pt': 350, 'bot_pt': 570, 'margin_x': 50},
        {'src': 'page_112.png', 'out': 'activity_ghayn_analysis.png', 'top_pt': 570, 'bot_pt': 770, 'margin_x': 50},
        {'src': 'page_113.png', 'out': 'activity_ghayn_swap.png', 'top_pt': 25, 'bot_pt': 150, 'margin_x': 50},
        {'src': 'page_113.png', 'out': 'activity_ghayn_blend.png', 'top_pt': 145, 'bot_pt': 600, 'margin_x': 50},
        {'src': 'page_113.png', 'out': 'activity_ghayn_order.png', 'top_pt': 600, 'bot_pt': 775, 'margin_x': 50},
        {'src': 'page_114.png', 'out': 'activity_ghayn_read.png', 'top_pt': 25, 'bot_pt': 750, 'margin_x': 50},
        {'src': 'page_111.png', 'out': 'activity_ghayn_trace.png', 'top_pt': 25, 'bot_pt': 95, 'margin_x': 90}
    ]
}

PRESET_HA = {
    "name": "حرف الهاء (هـ ، ـهـ ، ـه ، ه) وتطبيقاته وقراءة مِيَاهُ الْمَطَرِ / هِلَالُ الْعِيدِ / نَبِيهٌ يَعْمَلُ (ص ١١٤ - ١١٧)",
    "pages": {
        114: 'page_115.png',
        115: 'page_116.png',
        116: 'page_117.png',
        117: 'page_118.png'
    },
    "crops": [
        {'src': 'page_115.png', 'out': 'activity_ha_trace.png', 'top_pt': 20, 'bot_pt': 95, 'margin_x': 90},
        {'src': 'page_115.png', 'out': 'activity_ha_scene.png', 'top_pt': 20, 'bot_pt': 345, 'margin_x': 50},
        {'src': 'page_115.png', 'out': 'activity_ha_words.png', 'top_pt': 335, 'bot_pt': 600, 'margin_x': 50},
        {'src': 'page_115.png', 'out': 'activity_ha_vowels.png', 'top_pt': 600, 'bot_pt': 780, 'margin_x': 50},
        {'src': 'page_116.png', 'out': 'activity_ha_vowel_words.png', 'top_pt': 25, 'bot_pt': 365, 'margin_x': 50},
        {'src': 'page_116.png', 'out': 'activity_ha_syllables.png', 'top_pt': 365, 'bot_pt': 570, 'margin_x': 50},
        {'src': 'page_116.png', 'out': 'activity_ha_analysis.png', 'top_pt': 570, 'bot_pt': 775, 'margin_x': 50},
        {'src': 'page_117.png', 'out': 'activity_ha_swap.png', 'top_pt': 25, 'bot_pt': 160, 'margin_x': 50},
        {'src': 'page_117.png', 'out': 'activity_ha_blend.png', 'top_pt': 160, 'bot_pt': 620, 'margin_x': 50},
        {'src': 'page_117.png', 'out': 'activity_ha_order.png', 'top_pt': 620, 'bot_pt': 775, 'margin_x': 50},
        {'src': 'page_118.png', 'out': 'activity_ha_order_para.png', 'top_pt': 25, 'bot_pt': 225, 'margin_x': 50},
        {'src': 'page_118.png', 'out': 'activity_ha_read.png', 'top_pt': 215, 'bot_pt': 760, 'margin_x': 50}
    ],
    "audio": [
        # التوجيهات والمقدمات التعليمية
        ("letter_ha_intro", "الْوَحْدَةُ السَّادِسَةُ: الْعَالَمُ مِنْ حَوْلِي! مَعَ دَرْسِ حَرْفِ الْهَاءِ (هـ ، ـهـ ، ـه ، ه) وَتَطْبِيقَاتِهِ (ص ١١٤ - ١١٧)! اِسْتَمِعُوا لِصَوْتِ الْهَاءِ الْحَلْقِيِّ الْمَهْمُوسِ، وَتَعَرَّفُوا عَلَى أَشْكَالِهِ الأَرْبَعَةِ وَالْمَقَاطِعِ وَالتَّرْكِيبِ وَقِرَاءَةِ نَصِّ الْكِتَابِ وَالنُّصُوصِ التُّرَاثِيَّةِ: مِيَاهُ الْمَطَرِ ، وَهِلَالُ الْعِيدِ ، وَنَبِيهٌ يَعْمَلُ!", VOICE_RANA),
        ("letter_ha_sound", "هْ... هْ... صَوْتُ حَرْفِ الْهَاءِ السَّاكِنُ، يَخْرُجُ مِنْ أَقْصَى الْحَلْقِ مَهْمُوسًا مُرَقَّقًا: هْ... هْ...", VOICE_BASSEL),
        ("letter_ha_phoneme_faseeh", "أَهْلًا بِكُمْ يَا أَصْدِقَائِي! حَرْفُ الْهَاءِ حَرْفٌ حَلْقِيٌّ خَفِيفٌ يَخْرُجُ مِنْ أَقْصَى الْحَلْقِ، وَلَهُ أَرْبَعَةُ أَشْكَالٍ: هـ فِي أَوَّلِ الْكَلِمَةِ، وَـهـ فِي وَسَطِ الْكَلِمَةِ، وَـه مُتَّصِلَةٌ فِي آخِرِ الْكَلِمَةِ، وَه مُنْفَصِلَةٌ كَالدَّائِرَةِ!", VOICE_BASSEL),
        ("letter_ha_scene_story", "فِي صَبَاحٍ مُشْرِقٍ، طَارَ الْهُدْهُدُ الْجَمِيلُ فَوْقَ الْحُقُولِ، وَوَقَفَ عِنْدَ الشُّبَّاكِ يُشَاهِدُ الزُّهُورَ الْمُتَفَتِّحَةَ، وَسَمِعَ رَنِينَ الْهَاتِفِ وَصَوْتَ الْمُنَبِّهِ، فَرَأَى هَدِيَّةً رَائِعَةً مُغَلَّفَةً بِشَرِيطٍ أَنِيقٍ!", VOICE_RANA),
        ("letter_ha_act1_intro", "نَشَاطُ وَاحِد: أُرَدِّدُ مُنْتَبِهًا لِصَوْتِ حَرْفِ الْهَاءِ فِي أَشْكَالِهِ الأَرْبَعَةِ: هـ ، ـهـ ، ـه ، ه.", VOICE_RANA),
        ("letter_ha_act2_intro", "نَشَاطُ اثْنَان: أَنْطِقُ صَوْتَ حَرْفِ الْهَاءِ مَعَ أَصْوَاتِ الْمَدِّ الْقَصِيرَةِ: هَـ ، هُـ ، هِـ ، وَأَصْوَاتِ الْمَدِّ الطَّوِيلَةِ: هَا ، هُو ، هِيـ.", VOICE_RANA),
        ("letter_ha_act3_intro", "نَشَاطُ ثَلَاثَة: أَسْتَمِعُ لِلَفْظِ الْكَلِمَاتِ، ثُمَّ أَنْطِقُ صَوْتَ حَرْفِ الْهَاءِ مَعَ أصوات المد الصغيرة وأصوات المد الطويلة.", VOICE_RANA),
        ("letter_ha_act4_intro", "نَشَاطُ أَرْبَعَة: أَسْتَمِعُ إِلَى لَفْظِ الْكَلِمَاتِ وَأُمَيِّزُ صَوْتَ حَرْفِ الْهَاءِ السَّاكِنِ فِي الْمَقَاطِعِ: سَهْـ ، مُهْـ ، زَهْـ.", VOICE_RANA),
        ("letter_ha_act5_intro", "نَشَاطُ خَمْسَة: أَقْرَأُ الْكَلِمَاتِ، ثُمَّ أُحَلِّلُهَا إِلَى مَقَاطِعِهَا الصَّوْتِيَّةِ بِالتَّصْفِيق.", VOICE_RANA),
        ("letter_ha_act6_intro", "نَشَاطُ سِتَّة: أَسْتَبْدِلُ الْحَرْفَ بِاللَّوْنِ الأَحْمَرِ بِآخَرَ لِتَكْوِينِ كَلِمَةٍ جَدِيدَةٍ، ثُمَّ أَنْطِقُهَا.", VOICE_RANA),
        ("letter_ha_act7_intro", "نَشَاطُ سَبْعَة: أُرَكِّبُ مِنَ الْمَقَاطِعِ التَّالِيَةِ كَلِمَاتٍ ثُمَّ أَقْرَأُهَا.", VOICE_RANA),
        ("letter_ha_act8_intro", "نَشَاطُ ثَمَانِيَة: أُرَتِّبُ الْكَلِمَاتِ التَّالِيَةَ، وَأُكَوِّنُ جُمْلَةً مُفِيدَةً، ثُمَّ أَقْرَأُهَا.", VOICE_RANA),
        ("letter_ha_act9_intro", "نَشَاطُ تِسْعَة: أُرَتِّبُ الْجُمْلَتَيْنِ، أُكَوِّنُ فِقْرَةً، ثُمَّ أَقْرَأُهَا.", VOICE_RANA),
        ("letter_ha_read_intro", "مَحَطَّةُ الْقِرَاءَةِ وَالسَّبُّورَةِ وَالنُّصُوصِ التُّرَاثِيَّةِ! اقْرَأْ نَصَّ الْكِتَابِ ص ١١٧، وَالنُّصُوصَ التُّرَاثِيَّةَ الْعِرَاقِيَّةَ الأَصِيلَةَ: مِيَاهُ الْمَطَرِ ، وَهِلَالُ الْعِيدِ ، وَنَبِيهٌ يَعْمَلُ!", VOICE_RANA),
        ("letter_ha_quiz_intro", "اخْتِبَارُ التَّحَدِّي لِدَرْسِ حَرْفِ الْهَاءِ! أَجِبْ عَنِ الأَسْئِلَةِ لِتَحْصُلَ عَلَى كَأْسِ التَّفَوُّقِ وَأَوْسِمَةِ الأَبْطَالِ!", VOICE_RANA),

        # الحركات والمدود والمقاطع الساكنة
        ("letter_ha_short_a", "هَـ", VOICE_RANA),
        ("letter_ha_short_u", "هُـ", VOICE_RANA),
        ("letter_ha_short_i", "هِـ", VOICE_RANA),
        ("letter_ha_long_aa", "هَا", VOICE_RANA),
        ("letter_ha_long_oo", "هُو", VOICE_RANA),
        ("letter_ha_long_ee", "هِيـ", VOICE_RANA),
        ("letter_ha_syl_sah", "سَهْـ", VOICE_RANA),
        ("letter_ha_syl_muh", "مُهْـ", VOICE_RANA),
        ("letter_ha_syl_zah", "زَهْـ", VOICE_RANA),
        ("letter_ha_syl_fah", "فَهْـ", VOICE_RANA),
        ("letter_ha_syl_waj", "وَجْـ", VOICE_RANA),
        ("letter_ha_syl_nah", "نَهْـ", VOICE_RANA),

        # المفردات المصورة وتطبيقات الدرس
        ("letter_ha_word_haatif", "هَاتِفٌ", VOICE_RANA),
        ("letter_ha_word_hadiyyah", "هَدِيَّةٌ", VOICE_RANA),
        ("letter_ha_word_munabbih", "مُنَبِّهٌ", VOICE_RANA),
        ("letter_ha_word_sahm", "سَهْمٌ", VOICE_RANA),
        ("letter_ha_word_zuhoor", "زُهُورٌ", VOICE_RANA),
        ("letter_ha_word_taahi", "طَاهِي", VOICE_RANA),
        ("letter_ha_word_allah", "اللَّهِ", VOICE_RANA),
        ("letter_ha_word_miah", "مِيَاهٌ", VOICE_RANA),
        ("letter_ha_word_hudhud", "هُدْهُدٌ", VOICE_RANA),
        ("letter_ha_word_muhr", "مُهْرٌ", VOICE_RANA),
        ("letter_ha_word_zahrah", "زَهْرَةٌ", VOICE_RANA),
        ("letter_ha_word_dhahaba", "ذَهَبَ", VOICE_RANA),
        ("letter_ha_word_suhool", "سُهُولٌ", VOICE_RANA),
        ("letter_ha_word_saheel", "صَهِيلٌ", VOICE_RANA),
        ("letter_ha_word_muharrij", "مُهَرِّجٌ", VOICE_RANA),
        ("letter_ha_word_hilaal", "هِلالٌ", VOICE_RANA),
        ("letter_ha_word_hiyaam", "هِيَامُ", VOICE_RANA),
        ("letter_ha_word_sihaam", "سِهَامٌ", VOICE_RANA),
        ("letter_ha_word_hadeel", "هَدِيلٌ", VOICE_RANA),
        ("letter_ha_word_hadeer", "هَدِيرٌ", VOICE_RANA),
        ("letter_ha_word_haadi", "هَادِي", VOICE_RANA),
        ("letter_ha_word_naheed", "نَهِيدٌ", VOICE_RANA),
        ("letter_ha_word_wajh", "وَجْهٌ", VOICE_RANA),
        ("letter_ha_word_hirrah", "هِرَّةٌ", VOICE_RANA),
        ("letter_ha_word_fahd", "فَهْدٌ", VOICE_RANA),
        ("letter_ha_word_nahr", "نَهْرٌ", VOICE_RANA),
        ("letter_ha_word_nabeeh", "نَبِيهٌ", VOICE_RANA),
        ("letter_ha_word_yusaaiduh", "يُسَاعِدُهُ", VOICE_RANA),
        ("letter_ha_word_abooh", "أَبُوهُ", VOICE_RANA),
        ("letter_ha_word_hisham", "هِشَامٌ", VOICE_RANA),
        ("letter_ha_word_huda", "هُدَى", VOICE_RANA),
        ("letter_ha_word_humaam", "هُمَامٌ", VOICE_RANA),
        ("letter_ha_word_suhaad", "سُهَادُ", VOICE_RANA),
        ("letter_ha_word_mahdi", "مَهْدِيّ", VOICE_RANA),
        ("letter_ha_word_habata", "هَبَطَ", VOICE_RANA),
        ("letter_ha_word_haasoob", "حَاسُوبٌ", VOICE_RANA),
        ("letter_ha_word_mufeedah", "مُفِيدَةٌ", VOICE_RANA),
        ("letter_ha_word_shubbaak", "شُبَّاكٌ", VOICE_RANA),
        ("letter_ha_word_yusafir", "يُسَافِرَ", VOICE_RANA),
        ("letter_ha_word_buldaan", "بُلْدَانٍ", VOICE_RANA),
        ("letter_ha_word_mukhtalifah", "مُخْتَلِفَةٍ", VOICE_RANA),
        ("letter_ha_word_almatar", "الْمَطَرِ", VOICE_RANA),
        ("letter_ha_word_tasqi", "تَسْقِي", VOICE_RANA),
        ("letter_ha_word_alzar", "الزَّرْعَ", VOICE_RANA),
        ("letter_ha_word_yazra", "يَزْرَعُ", VOICE_RANA),
        ("letter_ha_word_raaka", "رَعَاكَ", VOICE_RANA),

        # التحليل والتركيب الصوتي بالتصفيق
        ("letter_ha_split_hudhud", "هُدْهُدٌ: هُدْ... هُـ... دٌ. ثَلَاثَةُ مَقَاطِعَ.", VOICE_BASSEL),
        ("letter_ha_split_saheel", "صَهِيلٌ: صَـ... هِيـ... لٌ. ثَلَاثَةُ مَقَاطِعَ.", VOICE_BASSEL),
        ("letter_ha_split_muharrij", "مُهَرِّجٌ: مُـ... هَرْ... رِ... جٌ. أَرْبَعَةُ مَقَاطِعَ.", VOICE_BASSEL),
        ("letter_ha_merge_hadiyyah", "هَـ... دِيـ... ةٌ: هَدِيَّةٌ.", VOICE_BASSEL),
        ("letter_ha_merge_hadeel", "هَـ... دِيـ... لٌ: هَدِيلٌ.", VOICE_BASSEL),
        ("letter_ha_merge_haadi", "هَا... دِي: هَادِي.", VOICE_BASSEL),
        ("letter_ha_merge_naheed", "نَـ... هِيـ... دٌ: نَهِيدٌ.", VOICE_BASSEL),

        # قراءة نصوص الكتاب المدرسي ص ١١٧
        ("letter_ha_read_p117_full", "هَبَطَ هُدْهُدٌ عِنْدَ شُبَّاكِ غُرْفَةٍ، فَرَأَى غَسَّانَ قُرْبَهُ حَاسُوبٌ وَمُنَبِّهٌ. قَالَ: إِنَّهَا أَدَوَاتٌ مُفِيدَةٌ.", VOICE_RANA),
        ("letter_ha_read_p117_s1", "هَبَطَ هُدْهُدٌ عِنْدَ شُبَّاكِ غُرْفَةٍ،", VOICE_RANA),
        ("letter_ha_read_p117_s2", "فَرَأَى غَسَّانَ قُرْبَهُ حَاسُوبٌ وَمُنَبِّهٌ.", VOICE_RANA),
        ("letter_ha_read_p117_s3", "قَالَ: إِنَّهَا أَدَوَاتٌ مُفِيدَةٌ.", VOICE_RANA),
        ("letter_ha_read_p117_para_full", "هُدْهُدٌ يُحِبُّ أَنْ يَطِيرَ فِي سُهُولٍ بَعِيدَةٍ، وَيُشَاهِدَ أَشْجَارًا تَنْمُو وَزُهُورًا تَتَفَتَّحُ.", VOICE_RANA),
        ("letter_ha_read_p117_para_s1", "هُدْهُدٌ يُحِبُّ أَنْ يَطِيرَ فِي سُهُولٍ بَعِيدَةٍ.", VOICE_RANA),
        ("letter_ha_read_p117_para_s2", "وَيُشَاهِدَ أَشْجَارًا تَنْمُو وَزُهُورًا تَتَفَتَّحُ.", VOICE_RANA),

        # النصوص التراثية العراقية الخالدة لحرف الهاء
        # النص التراثي 1: مِيَاهُ الْمَطَرِ (ـه ، ه)
        ("letter_ha_story_miah_full", "مِيَاهُ الْمَطَرِ. مِيَاهُ الْمَطَرِ تَسْقِي الزَّرْعَ. أَبُو نَبِيهٍ يَزْرَعُ. نَبِيهٌ يُسَاعِدُهُ. قَالَ لَهُ أَبُوهُ: شُكْرًا لَكَ يَا نَبِيهُ. رَعَاكَ اللَّهُ يَا وَلَدِي.", VOICE_RANA),
        ("letter_ha_story_miah_s1", "مِيَاهُ الْمَطَرِ تَسْقِي الزَّرْعَ.", VOICE_RANA),
        ("letter_ha_story_miah_s2", "أَبُو نَبِيهٍ يَزْرَعُ.", VOICE_RANA),
        ("letter_ha_story_miah_s3", "نَبِيهٌ يُسَاعِدُهُ.", VOICE_RANA),
        ("letter_ha_story_miah_s4", "قَالَ لَهُ أَبُوهُ: شُكْرًا لَكَ يَا نَبِيهُ.", VOICE_RANA),
        ("letter_ha_story_miah_s5", "رَعَاكَ اللَّهُ يَا وَلَدِي.", VOICE_RANA),

        # النص التراثي 2: هِلَالُ الْعِيدِ (هـ ، ـهـ)
        ("letter_ha_story_hilaal_full", "هِلَالُ الْعِيدِ. هَلَّ هِلَالُ الْعِيدِ. ذَهَبَ هُمَامٌ وَمَعَهُ سُهَادُ إِلَى عَمِّهِمَا مَهْدِيٍّ وَقَالَا: عِيدُكَ مُبَارَكٌ يَا عَمُّ. قَالَ الْعَمُّ: وَعِيدُكُمَا سَعِيدٌ يَا أَوْلَادُ.", VOICE_RANA),
        ("letter_ha_story_hilaal_s1", "هَلَّ هِلَالُ الْعِيدِ.", VOICE_RANA),
        ("letter_ha_story_hilaal_s2", "ذَهَبَ هُمَامٌ وَمَعَهُ سُهَادُ إِلَى عَمِّهِمَا مَهْدِيٍّ وَقَالَا:", VOICE_RANA),
        ("letter_ha_story_hilaal_s3", "عِيدُكَ مُبَارَكٌ يَا عَمُّ.", VOICE_RANA),
        ("letter_ha_story_hilaal_s4", "قَالَ الْعَمُّ: وَعِيدُكُمَا سَعِيدٌ يَا أَوْلَادُ.", VOICE_RANA),

        # النص التراثي 3: نَبِيهٌ يَعْمَلُ (ـه ، ه)
        ("letter_ha_story_nabeeh_full", "نَبِيهٌ يَعْمَلُ. نَبِيهٌ يَعْمَلُ فِي الْحَقْلِ مَعَ أَبِيهِ. يَحْرُثُ الأَرْضَ وَيَسْقِي الزَّرْعَ. يَقْطِفُ الثِّمَارَ وَالزُّهُورَ. قَالَ لَهُ أَبُوهُ: أَنْتَ وَلَدٌ نَشِيطٌ يَا نَبِيهُ، بَارَكَ اللَّهُ فِيكَ.", VOICE_RANA),
        ("letter_ha_story_nabeeh_s1", "نَبِيهٌ يَعْمَلُ فِي الْحَقْلِ مَعَ أَبِيهِ.", VOICE_RANA),
        ("letter_ha_story_nabeeh_s2", "يَحْرُثُ الأَرْضَ وَيَسْقِي الزَّرْعَ.", VOICE_RANA),
        ("letter_ha_story_nabeeh_s3", "يَقْطِفُ الثِّمَارَ وَالزُّهُورَ.", VOICE_RANA),
        ("letter_ha_story_nabeeh_s4", "قَالَ لَهُ أَبُوهُ: أَنْتَ وَلَدٌ نَشِيطٌ يَا نَبِيهُ، بَارَكَ اللَّهُ فِيكَ.", VOICE_RANA),

        # التعزيز الصوتي والتقييم
        ("letter_ha_correct", "أَحْسَنْتَ يَا بَطَلَ قِرَاءَتِي! إِجَابَةٌ صَحِيحَةٌ وَرَائِعَة!", VOICE_BASSEL),
        ("letter_ha_wrong", "حَاوِلْ مَرَّةً أُخْرَى، أَنْتَ ذَكِيٌّ وَقَادِرٌ عَلَى النَّجَاح!", VOICE_BASSEL),
        ("letter_ha_encourage_super", "مُمْتَازٌ جِدًّا! أَنْتَ عَبْقَرِيُّ الْقِرَاءَةِ وَنَجْمُ حَرْفِ الْهَاءِ!", VOICE_BASSEL)
    ]
}

PRESET_DHAL = {
    "name": "حرف الذال (ذ) وتطبيقاته وقراءة أُسْتَاذٌ وَتَلَامِيذٌ (ص ١١٨ - ١٢١)",
    "pages": {
        118: 'page_119.png',
        119: 'page_120.png',
        120: 'page_121.png',
        121: 'page_122.png'
    },
    "crops": [
        {'src': 'page_119.png', 'out': 'activity_dhal_trace.png', 'top_pt': 20, 'bot_pt': 105, 'margin_x': 50},
        {'src': 'page_119.png', 'out': 'activity_dhal_scene.png', 'top_pt': 108, 'bot_pt': 345, 'margin_x': 50},
        {'src': 'page_119.png', 'out': 'activity_dhal_words.png', 'top_pt': 342, 'bot_pt': 595, 'margin_x': 50},
        {'src': 'page_119.png', 'out': 'activity_dhal_vowels.png', 'top_pt': 594, 'bot_pt': 775, 'margin_x': 50},
        {'src': 'page_120.png', 'out': 'activity_dhal_vowel_words.png', 'top_pt': 40, 'bot_pt': 375, 'margin_x': 50},
        {'src': 'page_120.png', 'out': 'activity_dhal_syllables.png', 'top_pt': 375, 'bot_pt': 592, 'margin_x': 50},
        {'src': 'page_120.png', 'out': 'activity_dhal_analysis.png', 'top_pt': 592, 'bot_pt': 775, 'margin_x': 50},
        {'src': 'page_121.png', 'out': 'activity_dhal_swap.png', 'top_pt': 48, 'bot_pt': 162, 'margin_x': 50},
        {'src': 'page_121.png', 'out': 'activity_dhal_blend.png', 'top_pt': 162, 'bot_pt': 604, 'margin_x': 50},
        {'src': 'page_121.png', 'out': 'activity_dhal_order.png', 'top_pt': 604, 'bot_pt': 770, 'margin_x': 50},
        {'src': 'page_122.png', 'out': 'activity_dhal_order_para.png', 'top_pt': 45, 'bot_pt': 215, 'margin_x': 50},
        {'src': 'page_122.png', 'out': 'activity_dhal_read.png', 'top_pt': 245, 'bot_pt': 642, 'margin_x': 50}
    ],
    "audio": [
        # التوجيهات والمقدمات التعليمية
        ("letter_dhal_intro", "الْوَحْدَةُ السَّادِسَةُ: الْعَالَمُ مِنْ حَوْلِي! مَعَ دَرْسِ حَرْفِ الذَّالِ (ذ) وَتَطْبِيقَاتِهِ (ص ١١٨ - ١٢١)! اِسْتَمِعُوا لِصَوْتِ الذَّالِ اللِّثَوِيِّ الْمَجْهُورِ، وَتَعَرَّفُوا عَلَى الْمُدُودِ وَالْمَقَاطِعِ وَالتَّرْكِيبِ وَقِرَاءَةِ نَصِّ الْكِتَابِ وَالنَّصِّ التُّرَاثِيِّ الْخَالِدِ: أُسْتَاذٌ وَتَلَامِيذٌ!", VOICE_RANA),
        ("letter_dhal_sound", "ذْ... ذْ... صَوْتُ حَرْفِ الذَّالِ السَّاكِنُ، يَخْرُجُ مِنْ طَرَفِ اللِّسَانِ مَعَ أَطْرَافِ الثَّنَايَا الْعُلْيَا مَجْهُورًا لَطِيفًا: ذْ... ذْ...", VOICE_BASSEL),
        ("letter_dhal_phoneme_faseeh", "أَهْلًا بِكُمْ يَا أَصْدِقَائِي! حَرْفُ الذَّالِ حَرْفٌ لِثَوِيٌّ جَمِيلٌ نُخْرِجُ فِيهِ طَرَفَ اللِّسَانِ قَلِيلًا عِنْدَ النُّطْقِ: ذْ... ذَ... ذُ... ذِ! انْتَبِهُوا، لَا نَخْلِطْ بَيْنَهُ وَبَيْنَ حَرْفِ الزَّايِ أَوْ الدَّالِ!", VOICE_BASSEL),
        ("letter_dhal_scene_story", "فِي الْغَابَةِ الْخَضْرَاءِ الْجَمِيلَةِ، جَلَسَ الذِّئْبُ تَحْتَ جُذُوعِ الأَشْجَارِ يَنْظُرُ إِلَى قُنْفُذٍ صَغِيرٍ لَطِيفٍ، وَتَسَاقَطَتِ الْبُذُورُ عَلَى الأَرْضِ، فِي مَشْهَدٍ هَادِئٍ مِنْ مَشَاهِدِ الطَّبِيعَةِ!", VOICE_RANA),
        ("letter_dhal_act1_intro", "نَشَاطُ وَاحِد: أُرَدِّدُ مُنْتَبِهًا لِصَوْتِ حَرْفِ الذَّالِ: ذَيْلٌ ، ذُبَابَةٌ ، ذِرَاعٌ ، قُنْفُذٌ ، أُذُنٌ ، حِذَاءٌ ، بُذُورٌ ، مُذِيعٌ.", VOICE_RANA),
        ("letter_dhal_act2_intro", "نَشَاطُ اثْنَان: أَنْطِقُ صَوْتَ حَرْفِ الذَّالِ مَعَ أَصْوَاتِ الْمَدِّ الْقَصِيرَةِ: ذَ ، ذُ ، ذِ ، وَأَصْوَاتِ الْمَدِّ الطَّوِيلَةِ: ذَا ، ذُو ، ذِيـ.", VOICE_RANA),
        ("letter_dhal_act3_intro", "نَشَاطُ ثَلَاثَة: أَسْتَمِعُ لِلَفْظِ الْكَلِمَاتِ، ثُمَّ أَنْطِقُ صَوْتَ حَرْفِ الذَّالِ مَعَ أَصْوَاتِ الْمَدِّ الْقَصِيرَةِ وَأَصْوَاتِ الْمَدِّ الطَّوِيلَةِ.", VOICE_RANA),
        ("letter_dhal_act4_intro", "نَشَاطُ أَرْبَعَة: أَسْتَمِعُ إِلَى لَفْظِ الْكَلِمَاتِ وَأُمَيِّزُ صَوْتَ حَرْفِ الذَّالِ السَّاكِنِ فِي الْمَقَاطِعِ: مِذْ ، أُذْ ، جَذْ.", VOICE_RANA),
        ("letter_dhal_act5_intro", "نَشَاطُ خَمْسَة: أَقْرَأُ الْكَلِمَاتِ، ثُمَّ أُحَلِّلُهَا إِلَى مَقَاطِعِهَا الصَّوْتِيَّةِ بِالتَّصْفِيق.", VOICE_RANA),
        ("letter_dhal_act6_intro", "نَشَاطُ سِتَّة: أَسْتَبْدِلُ الْحَرْفَ بِاللَّوْنِ الأَحْمَرِ بِآخَرَ لِتَكْوِينِ كَلِمَةٍ جَدِيدَةٍ، ثُمَّ أَنْطِقُهَا.", VOICE_RANA),
        ("letter_dhal_act7_intro", "نَشَاطُ سَبْعَة: أُرَكِّبُ مِنَ الْمَقَاطِعِ التَّالِيَةِ كَلِمَاتٍ ثُمَّ أَقْرَأُهَا.", VOICE_RANA),
        ("letter_dhal_act8_intro", "نَشَاطُ ثَمَانِيَة: أُرَتِّبُ الْكَلِمَاتِ التَّالِيَةَ، وَأُكَوِّنُ جُمْلَةً مُفِيدَةً، ثُمَّ أَقْرَأُهَا.", VOICE_RANA),
        ("letter_dhal_act9_intro", "نَشَاطُ تِسْعَة: أُرَتِّبُ الْجُمْلَتَيْنِ، أُكَوِّنُ فِقْرَةً، ثُمَّ أَقْرَأُهَا.", VOICE_RANA),
        ("letter_dhal_read_intro", "مَحَطَّةُ الْقِرَاءَةِ وَالسَّبُّورَةِ وَالنُّصُوصِ التُّرَاثِيَّةِ! اقْرَأْ نَصَّ الْكِتَابِ ص ١٢١: مَعَاذٌ مُعَلِّمٌ ، وَالنَّصَّ التُّرَاثِيَّ الْعِرَاقِيَّ الْخَالِدَ: أُسْتَاذٌ وَتَلَامِيذٌ!", VOICE_RANA),
        ("letter_dhal_quiz_intro", "اخْتِبَارُ التَّحَدِّي لِدَرْسِ حَرْفِ الذَّالِ! أَجِبْ عَنِ الأَسْئِلَةِ لِتَحْصُلَ عَلَى كَأْسِ التَّفَوُّقِ وَأَوْسِمَةِ الأَبْطَالِ!", VOICE_RANA),

        # الحركات والمدود والمقاطع الساكنة
        ("letter_dhal_short_a", "ذَ", VOICE_RANA),
        ("letter_dhal_short_u", "ذُ", VOICE_RANA),
        ("letter_dhal_short_i", "ذِ", VOICE_RANA),
        ("letter_dhal_long_aa", "ذَا", VOICE_RANA),
        ("letter_dhal_long_oo", "ذُو", VOICE_RANA),
        ("letter_dhal_long_ee", "ذِيـ", VOICE_RANA),
        ("letter_dhal_syl_midh", "مِذْ", VOICE_RANA),
        ("letter_dhal_syl_udh", "أُذْ", VOICE_RANA),
        ("letter_dhal_syl_jadh", "جَذْ", VOICE_RANA),

        # المفردات المصورة وتطبيقات الدرس
        ("letter_dhal_word_dhayl", "ذَيْلٌ", VOICE_RANA),
        ("letter_dhal_word_dhubaabah", "ذُبَابَةٌ", VOICE_RANA),
        ("letter_dhal_word_dhiraa", "ذِرَاعٌ", VOICE_RANA),
        ("letter_dhal_word_qunfudh", "قُنْفُذٌ", VOICE_RANA),
        ("letter_dhal_word_udhun", "أُذُنٌ", VOICE_RANA),
        ("letter_dhal_word_hidhaa", "حِذَاءٌ", VOICE_RANA),
        ("letter_dhal_word_budhoor", "بُذُورٌ", VOICE_RANA),
        ("letter_dhal_word_mudhee", "مُذِيعٌ", VOICE_RANA),
        ("letter_dhal_word_dhaqan", "ذَقَنٌ", VOICE_RANA),
        ("letter_dhal_word_dhib", "ذِئْبٌ", VOICE_RANA),
        ("letter_dhal_word_midhyaa", "مِذْيَاعٌ", VOICE_RANA),
        ("letter_dhal_word_jadhr", "جَذْرٌ", VOICE_RANA),
        ("letter_dhal_word_tilmeedh", "تِلْمِيذٌ", VOICE_RANA),
        ("letter_dhal_word_yudhee", "يُذِيعُ", VOICE_RANA),
        ("letter_dhal_word_yabee", "يَبِيعُ", VOICE_RANA),
        ("letter_dhal_word_budoor", "بُدُورٌ", VOICE_RANA),
        ("letter_dhal_word_haadhiq", "حَاذِقٌ", VOICE_RANA),
        ("letter_dhal_word_haariq", "حَارِقٌ", VOICE_RANA),
        ("letter_dhal_word_badhala", "بَذَلَ", VOICE_RANA),
        ("letter_dhal_word_badhara", "بَذَرَ", VOICE_RANA),
        ("letter_dhal_word_ustaadh", "أُسْتَاذٌ", VOICE_RANA),
        ("letter_dhal_word_muaadh", "مُعَاذٌ", VOICE_RANA),
        ("letter_dhal_word_mundhir", "مُنْذِرٌ", VOICE_RANA),
        ("letter_dhal_word_tabbaakh", "طَبَّاخٌ", VOICE_RANA),
        ("letter_dhal_word_maahir", "مَاهِرٌ", VOICE_RANA),
        ("letter_dhal_word_yatho", "يَطْهُو", VOICE_RANA),
        ("letter_dhal_word_taaman", "طَعَامًا", VOICE_RANA),
        ("letter_dhal_word_ladheedhan", "لَذِيذًا", VOICE_RANA),
        ("letter_dhal_word_sihhiyyan", "صِحِّيًّا", VOICE_RANA),
        ("letter_dhal_word_dhura", "ذُرَى", VOICE_RANA),
        ("letter_dhal_word_tilmeedhah", "تِلْمِيذَةٌ", VOICE_RANA),
        ("letter_dhal_word_dhakiyyah", "ذَكِيَّةٌ", VOICE_RANA),
        ("letter_dhal_word_tuhibbu", "تُحِبُّ", VOICE_RANA),
        ("letter_dhal_word_duroosaha", "دُرُوسَهَا", VOICE_RANA),
        ("letter_dhal_word_madrasataha", "وَمَدْرَسَتَهَا", VOICE_RANA),
        ("letter_dhal_word_muallim", "مُعَلِّمٌ", VOICE_RANA),
        ("letter_dhal_word_yarsumu", "يَرْسُمُ", VOICE_RANA),
        ("letter_dhal_word_maa", "مَعَ", VOICE_RANA),
        ("letter_dhal_word_talaameedhih", "تَلَامِيذِهِ", VOICE_RANA),
        ("letter_dhal_word_nabaataat", "نَبَاتَاتٍ", VOICE_RANA),
        ("letter_dhal_word_mukhtalifah", "مُخْتَلِفَةً", VOICE_RANA),
        ("letter_dhal_word_fayarsumoon", "فَيَرْسُمُونَ", VOICE_RANA),
        ("letter_dhal_word_budhooran", "بُذُورًا", VOICE_RANA),
        ("letter_dhal_word_judhooran", "وَجُذُورًا", VOICE_RANA),
        ("letter_dhal_word_judhooan", "وَجُذُوعًا", VOICE_RANA),
        ("letter_dhal_word_qadeer", "قَدِيرٌ", VOICE_RANA),
        ("letter_dhal_word_nasheet", "نَشِيطٌ", VOICE_RANA),
        ("letter_dhal_word_iqra", "اقْرَأْ", VOICE_RANA),
        ("letter_dhal_word_adhooq", "أَذُوقُ", VOICE_RANA),
        ("letter_dhal_word_alasal", "الْعَسَلَ", VOICE_RANA),
        ("letter_dhal_word_ladheedh", "لَذِيذٌ", VOICE_RANA),

        # التحليل والتركيب الصوتي بالتصفيق
        ("letter_dhal_split_budhoor", "بُذُورٌ: بُـ... ذُو... رٌ. ثَلَاثَةُ مَقَاطِعَ.", VOICE_BASSEL),
        ("letter_dhal_split_yudhee", "يُذِيعُ: يُـ... ذِيـ... عُ. ثَلَاثَةُ مَقَاطِعَ.", VOICE_BASSEL),
        ("letter_dhal_split_tilmeedh", "تِلْمِيذٌ: تِلْـ... مِيـ... ذٌ. ثَلَاثَةُ مَقَاطِعَ.", VOICE_BASSEL),
        ("letter_dhal_merge_badhala", "بَـ... ذَ... لَ: بَذَلَ.", VOICE_BASSEL),
        ("letter_dhal_merge_badhara", "بَـ... ذَ... رَ: بَذَرَ.", VOICE_BASSEL),
        ("letter_dhal_merge_ustaadh", "أُسْـ... تَا... ذٌ: أُسْتَاذٌ.", VOICE_BASSEL),
        ("letter_dhal_merge_muaadh", "مُـ... عَا... ذٌ: مُعَاذٌ.", VOICE_BASSEL),

        # ترتيب الكلمات والجمل والفقرة
        ("letter_dhal_order_sentence_full", "مُنْذِرٌ طَبَّاخٌ مَاهِرٌ ، يَطْهُو طَعَامًا لَذِيذًا وَصِحِّيًّا.", VOICE_RANA),
        ("letter_dhal_order_para_full", "ذُرَى تِلْمِيذَةٌ ذَكِيَّةٌ. تُحِبُّ دُرُوسَهَا وَمَدْرَسَتَهَا.", VOICE_RANA),
        ("letter_dhal_order_para_s1", "ذُرَى تِلْمِيذَةٌ ذَكِيَّةٌ.", VOICE_RANA),
        ("letter_dhal_order_para_s2", "تُحِبُّ دُرُوسَهَا وَمَدْرَسَتَهَا.", VOICE_RANA),

        # قراءة نصوص الكتاب المدرسي ص ١٢١
        ("letter_dhal_read_p121_full", "مَعَاذٌ مُعَلِّمٌ ، يَرْسُمُ مَعَ تَلَامِيذِهِ نَبَاتَاتٍ مُخْتَلِفَةً ؛ فَيَرْسُمُونَ بُذُورًا وَجُذُورًا ، وَجُذُوعًا.", VOICE_RANA),
        ("letter_dhal_read_p121_s1", "مَعَاذٌ مُعَلِّمٌ ، يَرْسُمُ مَعَ تَلَامِيذِهِ نَبَاتَاتٍ مُخْتَلِفَةً ؛", VOICE_RANA),
        ("letter_dhal_read_p121_s2", "فَيَرْسُمُونَ بُذُورًا وَجُذُورًا ، وَجُذُوعًا.", VOICE_RANA),

        # النص التراثي العراقي الخالد لحرف الذال: أُسْتَاذٌ وَتَلَامِيذٌ
        ("letter_dhal_story_ustaadh_full", "أُسْتَاذٌ وَتَلَامِيذٌ. مُعَاذٌ أُسْتَاذٌ قَدِيرٌ. مُنْذِرٌ تِلْمِيذٌ نَشِيطٌ. قَالَ الأُسْتَاذُ: اقْرَأْ يَا مُنْذِرُ. قَرَأَ مُنْذِرٌ: أَنَا أَذُوقُ الْعَسَلَ. الْعَسَلُ لَذِيذٌ.", VOICE_RANA),
        ("letter_dhal_story_ustaadh_s1", "مُعَاذٌ أُسْتَاذٌ قَدِيرٌ.", VOICE_RANA),
        ("letter_dhal_story_ustaadh_s2", "مُنْذِرٌ تِلْمِيذٌ نَشِيطٌ.", VOICE_RANA),
        ("letter_dhal_story_ustaadh_s3", "قَالَ الأُسْتَاذُ: اقْرَأْ يَا مُنْذِرُ.", VOICE_RANA),
        ("letter_dhal_story_ustaadh_s4", "قَرَأَ مُنْذِرٌ: أَنَا أَذُوقُ الْعَسَلَ.", VOICE_RANA),
        ("letter_dhal_story_ustaadh_s5", "الْعَسَلُ لَذِيذٌ.", VOICE_RANA),

        # التعزيز الصوتي والتقييم
        ("letter_dhal_correct", "أَحْسَنْتَ يَا بَطَلَ قِرَاءَتِي! إِجَابَةٌ صَحِيحَةٌ وَرَائِعَة!", VOICE_BASSEL),
        ("letter_dhal_wrong", "حَاوِلْ مَرَّةً أُخْرَى، أَنْتَ ذَكِيٌّ وَقَادِرٌ عَلَى النَّجَاح!", VOICE_BASSEL),
        ("letter_dhal_encourage_super", "مُمْتَازٌ جِدًّا! أَنْتَ عَبْقَرِيُّ الْقِرَاءَةِ وَنَجْمُ حَرْفِ الذَّالِ!", VOICE_BASSEL)
    ]
}

PRESET_DHA = {
    "name": "حرف الظاء (ظ) وتطبيقاته وقراءة مُنْتَظَرٌ تَلْمِيذٌ نَشِيطٌ / مَحْفُوظٌ وَظَافِرٌ (ص ١٢٢ - ١٢٥)",
    "pages": {
        122: 'page_123.png',
        123: 'page_124.png',
        124: 'page_125.png',
        125: 'page_126.png'
    },
    "crops": [
        {'src': 'page_123.png', 'out': 'activity_dha_trace.png', 'top_pt': 15, 'bot_pt': 105, 'margin_x': 50},
        {'src': 'page_123.png', 'out': 'activity_dha_scene.png', 'top_pt': 95, 'bot_pt': 342, 'margin_x': 50},
        {'src': 'page_123.png', 'out': 'activity_dha_words.png', 'top_pt': 340, 'bot_pt': 598, 'margin_x': 50},
        {'src': 'page_123.png', 'out': 'activity_dha_vowels.png', 'top_pt': 598, 'bot_pt': 780, 'margin_x': 50},
        {'src': 'page_124.png', 'out': 'activity_dha_vowel_words.png', 'top_pt': 30, 'bot_pt': 365, 'margin_x': 50},
        {'src': 'page_124.png', 'out': 'activity_dha_syllables.png', 'top_pt': 365, 'bot_pt': 575, 'margin_x': 50},
        {'src': 'page_124.png', 'out': 'activity_dha_analysis.png', 'top_pt': 575, 'bot_pt': 780, 'margin_x': 50},
        {'src': 'page_125.png', 'out': 'activity_dha_swap.png', 'top_pt': 40, 'bot_pt': 165, 'margin_x': 50},
        {'src': 'page_125.png', 'out': 'activity_dha_blend.png', 'top_pt': 165, 'bot_pt': 540, 'margin_x': 50},
        {'src': 'page_125.png', 'out': 'activity_dha_order.png', 'top_pt': 540, 'bot_pt': 775, 'margin_x': 50},
        {'src': 'page_126.png', 'out': 'activity_dha_order_para.png', 'top_pt': 40, 'bot_pt': 225, 'margin_x': 50},
        {'src': 'page_126.png', 'out': 'activity_dha_read.png', 'top_pt': 225, 'bot_pt': 680, 'margin_x': 50}
    ],
    "audio": [
        # التوجيهات والمقدمات التعليمية
        ("letter_dha_intro", "الْوَحْدَةُ السَّادِسَةُ: الْعَالَمُ مِنْ حَوْلِي! مَعَ دَرْسِ حَرْفِ الظَّاءِ (ظ) وَتَطْبِيقَاتِهِ (ص ١٢٢ - ١٢٥)! اِسْتَمِعُوا لِصَوْتِ الظَّاءِ اللِّثَوِيِّ الْمُفَخَّمِ، وَتَعَرَّفُوا عَلَى الْمُدُودِ وَالْمَقَاطِعِ وَالتَّرْكِيبِ وَقِرَاءَةِ نَصِّ الْكِتَابِ: مُنْتَظَرٌ تَلْمِيذٌ نَشِيطٌ ، وَالنَّصِّ التُّرَاثِيِّ الْخَالِدِ: مَحْفُوظٌ وَظَافِرٌ!", VOICE_RANA),
        ("letter_dha_sound", "ظْ... ظْ... صَوْتُ حَرْفِ الظَّاءِ السَّاكِنُ، يَخْرُجُ مِنْ طَرَفِ اللِّسَانِ مَعَ أَطْرَافِ الثَّنَايَا الْعُلْيَا مَفْخُومًا مُطْبَقًا: ظْ... ظْ...", VOICE_BASSEL),
        ("letter_dha_phoneme_faseeh", "أَهْلًا بِكُمْ يَا أَصْدِقَائِي! حَرْفُ الظَّاءِ حَرْفٌ لِثَوِيٌّ مُفَخَّمٌ مُطْبَقٌ، نُخْرِجُ فِيهِ طَرَفَ اللِّسَانِ مَعَ الثَّنَايَا الْعُلْيَا مَعَ تَفْخِيمِ الصَّوْتِ: ظْ... ظَ... ظُ... ظِ! انْتَبِهُوا، لَا نَخْلِطْ بَيْنَهُ وَبَيْنَ حَرْفِ الذَّالِ الْمُرَقَّقِ أَوِ الضَّادِ!", VOICE_BASSEL),
        ("letter_dha_scene_story", "فِي حَدِيقَةِ الْحَيَوَانِ الْوَاسِعَةِ، وَقَفَ ظَافِرٌ يَنْظُرُ بِالنَّاظُورِ إِلَى حَظِيرَةِ الظِّبَاءِ، وَشَاهَدَ الطَّبِيعَةَ الْجَمِيلَةَ مَعَ أَصْدِقَائِهِ، فِي يَوْمٍ مُشْرِقٍ حَافِلٍ بِالنَّشَاطِ وَالْمَعْرِفَةِ!", VOICE_RANA),
        ("letter_dha_act1_intro", "نَشَاطُ وَاحِد: أُرَدِّدُ مُنْتَبِهًا لِصَوْتِ حَرْفِ الظَّاءِ: ظَبْيٌ ، ظَرْفٌ ، حَافِظٌ ، عَظْمٌ ، ظَلَمَ ، حَظِيرَةٌ ، نَاظُورٌ ، عِظَامٌ.", VOICE_RANA),
        ("letter_dha_act2_intro", "نَشَاطُ اثْنَان: أَنْطِقُ صَوْتَ حَرْفِ الظَّاءِ مَعَ أَصْوَاتِ الْمَدِّ الْقَصِيرَةِ: ظَ ، ظُ ، ظِ ، وَأَصْوَاتِ الْمَدِّ الطَّوِيلَةِ: ظَا ، ظُو ، ظِيـ.", VOICE_RANA),
        ("letter_dha_act3_intro", "نَشَاطُ ثَلَاثَة: أَسْتَمِعُ لِلَفْظِ الْكَلِمَاتِ، ثُمَّ أَنْطِقُ صَوْتَ حَرْفِ الظَّاءِ مَعَ أَصْوَاتِ الْمَدِّ الْقَصِيرَةِ وَأَصْوَاتِ الْمَدِّ الطَّوِيلَةِ.", VOICE_RANA),
        ("letter_dha_act4_intro", "نَشَاطُ أَرْبَعَة: أَسْتَمِعُ إِلَى لَفْظِ الْكَلِمَاتِ وَأُمَيِّزُ صَوْتَ حَرْفِ الظَّاءِ السَّاكِنِ فِي الْمَقَاطِعِ: عَظْ ، أَظْ.", VOICE_RANA),
        ("letter_dha_act5_intro", "نَشَاطُ خَمْسَة: أَقْرَأُ الْكَلِمَاتِ، ثُمَّ أُحَلِّلُهَا إِلَى مَقَاطِعِهَا الصَّوْتِيَّةِ بِالتَّصْفِيق.", VOICE_RANA),
        ("letter_dha_act6_intro", "نَشَاطُ سِتَّة: أَسْتَبْدِلُ الْحَرْفَ بِاللَّوْنِ الأَحْمَرِ بِآخَرَ لِتَكْوِينِ كَلِمَةٍ جَدِيدَةٍ، ثُمَّ أَنْطِقُهَا.", VOICE_RANA),
        ("letter_dha_act7_intro", "نَشَاطُ سَبْعَة: أُرَكِّبُ مِنَ الْمَقَاطِعِ التَّالِيَةِ كَلِمَاتٍ ثُمَّ أَقْرَأُهَا.", VOICE_RANA),
        ("letter_dha_act8_intro", "نَشَاطُ ثَمَانِيَة: أُرَتِّبُ الْكَلِمَاتِ التَّالِيَةَ، وَأُكَوِّنُ جُمْلَةً مُفِيدَةً، ثُمَّ أَقْرَأُهَا.", VOICE_RANA),
        ("letter_dha_act9_intro", "نَشَاطُ تِسْعَة: أُرَتِّبُ الْجُمْلَتَيْنِ، أُكَوِّنُ فِقْرَةً، ثُمَّ أَقْرَأُهَا.", VOICE_RANA),
        ("letter_dha_read_intro", "مَحَطَّةُ الْقِرَاءَةِ وَالسَّبُّورَةِ وَالنُّصُوصِ التُّرَاثِيَّةِ! اقْرَأْ نَصَّ الْكِتَابِ ص ١٢٥: مُنْتَظَرٌ تَلْمِيذٌ نَشِيطٌ ، وَالنَّصَّ التُّرَاثِيَّ الْعِرَاقِيَّ الْخَالِدَ: مَحْفُوظٌ وَظَافِرٌ!", VOICE_RANA),
        ("letter_dha_quiz_intro", "اخْتِبَارُ التَّحَدِّي لِدَرْسِ حَرْفِ الظَّاءِ! أَجِبْ عَنِ الأَسْئِلَةِ لِتَحْصُلَ عَلَى كَأْسِ التَّفَوُّقِ وَأَوْسِمَةِ الأَبْطَالِ!", VOICE_RANA),

        # الحركات والمدود والمقاطع الساكنة
        ("letter_dha_short_a", "ظَ", VOICE_RANA),
        ("letter_dha_short_u", "ظُ", VOICE_RANA),
        ("letter_dha_short_i", "ظِ", VOICE_RANA),
        ("letter_dha_long_aa", "ظَا", VOICE_RANA),
        ("letter_dha_long_oo", "ظُو", VOICE_RANA),
        ("letter_dha_long_ee", "ظِيـ", VOICE_RANA),
        ("letter_dha_syl_adh", "أَظْ", VOICE_RANA),
        ("letter_dha_syl_adh_u", "أُظْ", VOICE_RANA),
        ("letter_dha_syl_adh_i", "إِظْ", VOICE_RANA),
        ("letter_dha_syl_azm", "عَظْ", VOICE_RANA),
        ("letter_dha_syl_yadh", "يَظْ", VOICE_RANA),
        ("letter_dha_syl_mah", "مَحْـ", VOICE_RANA),

        # المفردات المصورة وتطبيقات الدرس
        ("letter_dha_word_zaby", "ظَبْيٌ", VOICE_RANA),
        ("letter_dha_word_zibaa", "ظِبَاءٌ", VOICE_RANA),
        ("letter_dha_word_zarf", "ظَرْفٌ", VOICE_RANA),
        ("letter_dha_word_haafiz", "حَافِظٌ", VOICE_RANA),
        ("letter_dha_word_azm", "عَظْمٌ", VOICE_RANA),
        ("letter_dha_word_zalama", "ظَلَمَ", VOICE_RANA),
        ("letter_dha_word_hazeerah", "حَظِيرَةٌ", VOICE_RANA),
        ("letter_dha_word_naazoor", "نَاظُورٌ", VOICE_RANA),
        ("letter_dha_word_ezaam", "عِظَامٌ", VOICE_RANA),
        ("letter_dha_word_zafar", "ظَفَرٌ", VOICE_RANA),
        ("letter_dha_word_zill", "ظِلٌّ", VOICE_RANA),
        ("letter_dha_word_nizaam", "نِظَامٌ", VOICE_RANA),
        ("letter_dha_word_azfur", "أَظْفُرٌ", VOICE_RANA),
        ("letter_dha_word_azfaar", "أَظْفَارٌ", VOICE_RANA),
        ("letter_dha_word_nazzaarah", "نَظَّارَةٌ", VOICE_RANA),
        ("letter_dha_word_haseerah", "حَصِيرَةٌ", VOICE_RANA),
        ("letter_dha_word_naatoor", "نَاطُورٌ", VOICE_RANA),
        ("letter_dha_word_zaafir", "ظَافِرٌ", VOICE_RANA),
        ("letter_dha_word_mahfazah", "مَحْفَظَةٌ", VOICE_RANA),
        ("letter_dha_word_yada", "يَضَعُ", VOICE_RANA),
        ("letter_dha_word_tibbiyyah", "طِبِّيَّةً", VOICE_RANA),
        ("letter_dha_word_likay", "لِكَيْ", VOICE_RANA),
        ("letter_dha_word_yara", "يَرَى", VOICE_RANA),
        ("letter_dha_word_biwudooh", "بِوُضُوحٍ", VOICE_RANA),
        ("letter_dha_word_zafaar", "ظَفَارُ", VOICE_RANA),
        ("letter_dha_word_turabbee", "تُرَبِّي", VOICE_RANA),
        ("letter_dha_word_fee", "فِي", VOICE_RANA),
        ("letter_dha_word_hayawaanaat", "حَيَوَانَاتٍ", VOICE_RANA),
        ("letter_dha_word_mutanawwiah", "مُتَنَوِّعَةً", VOICE_RANA),
        ("letter_dha_word_indahaa", "عِنْدَهَا", VOICE_RANA),
        ("letter_dha_word_qitt", "وَقِطٌّ", VOICE_RANA),
        ("letter_dha_word_sinjaab", "وَسِنْجَابٌ", VOICE_RANA),
        ("letter_dha_word_jameel", "جَمِيلٌ", VOICE_RANA),
        ("letter_dha_word_muntazar", "مُنْتَظَرٌ", VOICE_RANA),
        ("letter_dha_word_tilmeedh", "تِلْمِيذٌ", VOICE_RANA),
        ("letter_dha_word_nasheet", "نَشِيطٌ", VOICE_RANA),
        ("letter_dha_word_yanaamu", "يَنَامُ", VOICE_RANA),
        ("letter_dha_word_yastayqizu", "وَيَسْتَيْقِظُ", VOICE_RANA),
        ("letter_dha_word_baakiran", "بَاكِرًا", VOICE_RANA),
        ("letter_dha_word_yuhibbu", "يُحِبُّ", VOICE_RANA),
        ("letter_dha_word_haasoobahu", "حَاسُوبَهُ", VOICE_RANA),
        ("letter_dha_word_yuhaafizu", "يُحَافِظُ", VOICE_RANA),
        ("letter_dha_word_ala", "عَلَى", VOICE_RANA),
        ("letter_dha_word_sihhati", "صِحَّةِ", VOICE_RANA),
        ("letter_dha_word_aynayh", "عَيْنَيْهِ", VOICE_RANA),
        ("letter_dha_word_falaa", "فَلَا", VOICE_RANA),
        ("letter_dha_word_yalabu", "يَلْعَبُ", VOICE_RANA),
        ("letter_dha_word_bihi", "بِهِ", VOICE_RANA),
        ("letter_dha_word_katheeran", "كَثِيرًا", VOICE_RANA),
        ("letter_dha_word_mahfooz", "مَحْفُوظٌ", VOICE_RANA),
        ("letter_dha_word_yaqoolu", "يَقُولُ", VOICE_RANA),
        ("letter_dha_word_lisadeeqihi", "لِصَدِيقِهِ", VOICE_RANA),
        ("letter_dha_word_ihfaz", "احْفَظْ", VOICE_RANA),
        ("letter_dha_word_duroosaka", "دُرُوسَكَ", VOICE_RANA),
        ("letter_dha_word_kulla", "كُلَّ", VOICE_RANA),
        ("letter_dha_word_yawm", "يَوْمٍ", VOICE_RANA),
        ("letter_dha_word_wahaafiz", "وَحَافِظْ", VOICE_RANA),
        ("letter_dha_word_nazaafati", "نَظَافَةِ", VOICE_RANA),
        ("letter_dha_word_madrasatika", "مَدْرَسَتِكَ", VOICE_RANA),
        ("letter_dha_word_annazaafatu", "النَّظَافَةُ", VOICE_RANA),
        ("letter_dha_word_mina", "مِنَ", VOICE_RANA),
        ("letter_dha_word_aleemaan", "الإِيمَانِ", VOICE_RANA),

        # التحليل والتركيب الصوتي بالتصفيق
        ("letter_dha_split_hazeerah", "حَظِيرَةٌ: حَـ... ظِيـ... رَ... تُنْ. أَرْبَعَةُ مَقَاطِعَ.", VOICE_BASSEL),
        ("letter_dha_split_naazoor", "نَاظُورٌ: نَا... ظُو... رٌ. ثَلَاثَةُ مَقَاطِعَ.", VOICE_BASSEL),
        ("letter_dha_split_nazzaarah", "نَظَّارَةٌ: نَظْـ... ظَا... رَ... تُنْ. أَرْبَعَةُ مَقَاطِعَ.", VOICE_BASSEL),
        ("letter_dha_split_mahfazah", "مَحْفَظَةٌ: مَحْـ... فَـ... ظَـ... تُنْ. أَرْبَعَةُ مَقَاطِعَ.", VOICE_BASSEL),
        ("letter_dha_merge_zaafir", "ظَا... فِـ... رٌ: ظَافِرٌ.", VOICE_BASSEL),
        ("letter_dha_merge_haafiz", "حَا... فِـ... ظٌ: حَافِظٌ.", VOICE_BASSEL),
        ("letter_dha_merge_mahfazah", "مَحْـ... فَـ... ظَـ... ةٌ: مَحْفَظَةٌ.", VOICE_BASSEL),

        # ترتيب الكلمات والجمل والفقرة
        ("letter_dha_order_sentence_full", "يَضَعُ ظَافِرٌ نَظَّارَةً طِبِّيَّةً لِكَيْ يَرَى بِوُضُوحٍ.", VOICE_RANA),
        ("letter_dha_order_para_full", "ظَفَارُ تُرَبِّي فِي حَظِيرَتِهَا حَيَوَانَاتٍ مُتَنَوِّعَةً. عِنْدَهَا ظَبْيٌ وَقِطٌّ وَسِنْجَابٌ جَمِيلٌ.", VOICE_RANA),
        ("letter_dha_order_para_s1", "ظَفَارُ تُرَبِّي فِي حَظِيرَتِهَا حَيَوَانَاتٍ مُتَنَوِّعَةً.", VOICE_RANA),
        ("letter_dha_order_para_s2", "عِنْدَهَا ظَبْيٌ وَقِطٌّ وَسِنْجَابٌ جَمِيلٌ.", VOICE_RANA),

        # قراءة نصوص الكتاب المدرسي ص ١٢٥
        ("letter_dha_read_p125_full", "مُنْتَظَرٌ تَلْمِيذٌ نَشِيطٌ ، يَنَامُ وَيَسْتَيْقِظُ بَاكِرًا ، يُحِبُّ حَاسُوبَهُ. يُحَافِظُ عَلَى صِحَّةِ عَيْنَيْهِ ، فَلَا يَلْعَبُ بِهِ كَثِيرًا.", VOICE_RANA),
        ("letter_dha_read_p125_s1", "مُنْتَظَرٌ تَلْمِيذٌ نَشِيطٌ ،", VOICE_RANA),
        ("letter_dha_read_p125_s2", "يَنَامُ وَيَسْتَيْقِظُ بَاكِرًا ، يُحِبُّ حَاسُوبَهُ.", VOICE_RANA),
        ("letter_dha_read_p125_s3", "يُحَافِظُ عَلَى صِحَّةِ عَيْنَيْهِ ، فَلَا يَلْعَبُ بِهِ كَثِيرًا.", VOICE_RANA),

        # النص التراثي العراقي الخالد لحرف الظاء: مَحْفُوظٌ وَظَافِرٌ
        ("letter_dha_story_mahfooz_full", "مَحْفُوظٌ وَظَافِرٌ. مَحْفُوظٌ تِلْمِيذٌ نَشِيطٌ. يَقُولُ لِصَدِيقِهِ ظَافِرٍ: احْفَظْ دُرُوسَكَ كُلَّ يَوْمٍ. وَحَافِظْ عَلَى نَظَافَةِ مَدْرَسَتِكَ. النَّظَافَةُ مِنَ الإِيمَانِ.", VOICE_RANA),
        ("letter_dha_story_mahfooz_s1", "مَحْفُوظٌ تِلْمِيذٌ نَشِيطٌ.", VOICE_RANA),
        ("letter_dha_story_mahfooz_s2", "يَقُولُ لِصَدِيقِهِ ظَافِرٍ:", VOICE_RANA),
        ("letter_dha_story_mahfooz_s3", "احْفَظْ دُرُوسَكَ كُلَّ يَوْمٍ.", VOICE_RANA),
        ("letter_dha_story_mahfooz_s4", "وَحَافِظْ عَلَى نَظَافَةِ مَدْرَسَتِكَ.", VOICE_RANA),
        ("letter_dha_story_mahfooz_s5", "النَّظَافَةُ مِنَ الإِيمَانِ.", VOICE_RANA),

        # التعزيز الصوتي والتقييم
        ("letter_dha_correct", "أَحْسَنْتَ يَا بَطَلَ قِرَاءَتِي! إِجَابَةٌ صَحِيحَةٌ وَرَائِعَة!", VOICE_BASSEL),
        ("letter_dha_wrong", "حَاوِلْ مَرَّةً أُخْرَى، أَنْتَ ذَكِيٌّ وَقَادِرٌ عَلَى النَّجَاح!", VOICE_BASSEL),
        ("letter_dha_encourage_super", "مُمْتَازٌ جِدًّا! أَنْتَ عَبْقَرِيُّ الْقِرَاءَةِ وَنَجْمُ حَرْفِ الظَّاءِ!", VOICE_BASSEL)
    ]
}

PRESET_LAM = {
    "name": "اللام الشمسية واللام القمرية وتطبيقاتهما وقراءة سَأَلَ الْمُعَلِّمُ ونشيد إِلَى اللِّقَاءِ مَدْرَسَتِي (ص ١٢٦ - ١٢٨)",
    "pages": {
        126: 'page_127.png',
        127: 'page_128.png',
        128: 'page_129.png'
    },
    "crops": [
        {'src': 'page_127.png', 'out': 'activity_lam_scene.png', 'top_pt': 25, 'bot_pt': 375, 'margin_x': 50},
        {'src': 'page_127.png', 'out': 'activity_lam_compare.png', 'top_pt': 370, 'bot_pt': 595, 'margin_x': 50},
        {'src': 'page_127.png', 'out': 'activity_lam_shamsiyyah.png', 'top_pt': 595, 'bot_pt': 775, 'margin_x': 50},
        {'src': 'page_128.png', 'out': 'activity_lam_qamariyyah.png', 'top_pt': 25, 'bot_pt': 160, 'margin_x': 50},
        {'src': 'page_128.png', 'out': 'activity_lam_match.png', 'top_pt': 160, 'bot_pt': 485, 'margin_x': 50},
        {'src': 'page_128.png', 'out': 'activity_lam_analysis.png', 'top_pt': 485, 'bot_pt': 770, 'margin_x': 50},
        {'src': 'page_129.png', 'out': 'activity_lam_read.png', 'top_pt': 25, 'bot_pt': 450, 'margin_x': 50},
        {'src': 'page_129.png', 'out': 'activity_lam_nasheed.png', 'top_pt': 445, 'bot_pt': 780, 'margin_x': 50}
    ],
    "audio": [
        # التوجيهات والمقدمات التعليمية
        ("lam_intro", "الْوَحْدَةُ السَّادِسَةُ: الْعَالَمُ مِنْ حَوْلِي! مَعَ الدَّرْسِ الْخَامِسِ وَالْخِتَامِيِّ لِكِتَابِ قِرَاءَتِي: اللَّامُ الشَّمْسِيَّةُ وَاللَّامُ الْقَمَرِيَّةُ وَتَطْبِيقَاتُهُمَا (ص ١٢٦ - ١٢٨)! نَتَعَرَّفُ عَلَى الْفَرْقِ بَيْنَ اللَّامِ الشَّمْسِيَّةِ الَّتِي تُكْتَبُ وَلَا تُنْطَقُ وَيَأْتِي بَعْدَهَا حَرْفٌ مُشَدَّدٌ، وَاللَّامِ الْقَمَرِيَّةِ الَّتِي تُكْتَبُ وَتُنْطَقُ وَتَكُونُ سَاكِنَةً، مَعَ قِرَاءَةِ نَصِّ (سَأَلَ الْمُعَلِّمُ) وَنَشِيدِ (إِلَى اللِّقَاءِ مَدْرَسَتِي) وَاحْتِفَالِ اكْتِمَالِ الْكِتَابِ مِئَةً بِالْمِئَة!", VOICE_RANA),
        ("lam_sound_shamsiyyah", "الـ... الشَّمْسُ! اللَّامُ الشَّمْسِيَّةُ: تُكْتَبُ وَلَا تُنْطَقُ، وَالْحَرْفُ الَّذِي بَعْدَهَا يَكُونُ مُشَدَّدًا مِثْلَ: الشَّمْسُ ، الثَّلْجُ ، النَّجْمُ!", VOICE_BASSEL),
        ("lam_sound_qamariyyah", "اَلْـ... الْقَمَرُ! اللَّامُ الْقَمَرِيَّةُ: تُكْتَبُ وَتُنْطَقُ سَاكِنَةً صَافِيَةً، مِثْلَ: الْقَمَرُ ، الْكَوْكَبُ ، الْمَطَرُ!", VOICE_BASSEL),
        ("lam_phoneme_faseeh", "أَهْلًا بِكُمْ يَا أَبْطَالَ قِرَاءَتِي! تَعَلَّمُوا الْفَرْقَ الْجَمِيلَ: اللَّامُ الشَّمْسِيَّةُ مِثْلُ الشَّمْسِ: تُكْتَبُ وَلَا نَلْفِظُهَا، وَالْحَرْفُ بَعْدَهَا يَكُونُ مُشَدَّدًا مِثْلَ: الشَّمْسُ، الثَّلْجُ، النَّجْمُ! أَمَّا اللَّامُ الْقَمَرِيَّةُ فَمِثْلُ الْقَمَرِ: تُكْتَبُ وَتُلْفَظُ سَاكِنَةً وَاضِحَةً مِثْلَ: الْقَمَرُ، الْكَوْكَبُ، الْمَطَرُ!", VOICE_BASSEL),
        ("lam_scene_story", "فِي السَّمَاءِ الْوَاسِعَةِ، نَرَى الشَّمْسَ الْمُشْرِقَةَ تُضِيءُ النَّهَارَ، وَفِي اللَّيْلِ يَظْهَرُ الْقَمَرُ الْمُنِيرُ وَالنُّجُومُ الْمُتَلأْلِئَةُ، فِي لَوْحَةٍ بَدِيعَةٍ خَلَقَهَا اللَّهُ تَعَالَى لَنَا!", VOICE_RANA),
        ("lam_act1_intro", "نَشَاطُ وَاحِد: أَقْرَأُ وَأُلاَحِظُ الْفَرْقَ بَيْنَ كَلِمَاتٍ مَعَ أَلْ الشَّمْسِيَّةِ، وَكَلِمَاتٍ مَعَ أَلْ الْقَمَرِيَّةِ.", VOICE_RANA),
        ("lam_act2_intro", "نَشَاطُ اثْنَان: أُرَدِّدُ مُنْتَبِهًا لِلَفْظِ اللَّامِ الشَّمْسِيَّةِ فِي الْكَلِمَاتِ: الزَّهَرَةُ ، السَّمَاءُ ، الرَّبِيعُ ، الشِّتَاءُ ، الصَّيْفُ.", VOICE_RANA),
        ("lam_act3_intro", "نَشَاطُ ثَلَاثَة: أُرَدِّدُ مُنْتَبِهًا لِلَفْظِ اللَّامِ الْقَمَرِيَّةِ فِي الْكَلِمَاتِ: الأَرْضُ ، الْغُيُومُ ، الْمِرِّيخُ ، الْفَضَاءُ ، الْخَرِيفُ.", VOICE_RANA),
        ("lam_act4_intro", "نَشَاطُ أَرْبَعَة: أَصِلُ الْكَلِمَاتِ الَّتِي تَحْتَوِي لَامًا قَمَرِيَّةً بِصُورَةِ الْقَمَرِ، وَالْكَلِمَاتِ الَّتِي تَحْتَوِي لَامًا شَمْسِيَّةً بِصُورَةِ الشَّمْسِ.", VOICE_RANA),
        ("lam_act5_intro", "نَشَاطُ خَمْسَة: أَقْرَأُ الْكَلِمَاتِ، ثُمَّ أُحَلِّلُهَا إِلَى مَقَاطِعِهَا الصَّوْتِيَّةِ بِالتَّصْفِيق.", VOICE_RANA),
        ("lam_read_intro", "مَحَطَّةُ الْقِرَاءَةِ: اقْرَأْ نَصَّ: سَأَلَ الْمُعَلِّمُ، وَنَشِيدَ: إِلَى اللِّقَاءِ مَدْرَسَتِي، وَشَارِكْنَا فَرْحَةَ التَّخَرُّجِ وَاخْتِتَامِ كِتَابِ قِرَاءَتِي!", VOICE_RANA),
        ("lam_quiz_intro", "اخْتِبَارُ التَّحَدِّي الْخِتَامِيُّ لِكِتَابِ قِرَاءَتِي! مَيِّزْ بَيْنَ اللَّامِ الشَّمْسِيَّةِ وَالْقَمَرِيَّةِ وَأَجِبْ عَنِ الأَسْئِلَةِ لِتَحْصُلَ عَلَى وِسَامِ التَّخَرُّجِ الْذَّهَبِيِّ الْكَبِيرِ!", VOICE_RANA),

        # كلمات نشاط 1 المقارنة (ص ١٢٦)
        ("lam_word_shams", "شَمْسٌ", VOICE_RANA),
        ("lam_word_ashams", "الشَّمْسُ", VOICE_RANA),
        ("lam_word_qamar", "قَمَرٌ", VOICE_RANA),
        ("lam_word_alqamar", "الْقَمَرُ", VOICE_RANA),
        ("lam_word_najm", "نَجْمٌ", VOICE_RANA),
        ("lam_word_annajm", "النَّجْمُ", VOICE_RANA),
        ("lam_word_kawkab", "كَوْكَبٌ", VOICE_RANA),
        ("lam_word_alkawkab", "الْكَوْكَبُ", VOICE_RANA),
        ("lam_word_thalj", "ثَلْجٌ", VOICE_RANA),
        ("lam_word_athalj", "الثَّلْجُ", VOICE_RANA),
        ("lam_word_matar", "مَطَرٌ", VOICE_RANA),
        ("lam_word_almatar", "الْمَطَرُ", VOICE_RANA),

        # كلمات نشاط 2 اللام الشمسية (ص ١٢٦)
        ("lam_word_azzahrah", "الزَّهَرَةُ", VOICE_RANA),
        ("lam_word_assamaa", "السَّمَاءُ", VOICE_RANA),
        ("lam_word_arrabee", "الرَّبِيعُ", VOICE_RANA),
        ("lam_word_ashshitaa", "الشِّتَاءُ", VOICE_RANA),
        ("lam_word_assayf", "الصَّيْفُ", VOICE_RANA),

        # كلمات نشاط 3 اللام القمرية (ص ١٢٧)
        ("lam_word_alard", "الأَرْضُ", VOICE_RANA),
        ("lam_word_alguyoom", "الْغُيُومُ", VOICE_RANA),
        ("lam_word_almirreekh", "الْمِرِّيخُ", VOICE_RANA),
        ("lam_word_alfadaa", "الْفَضَاءُ", VOICE_RANA),
        ("lam_word_alkhareef", "الْخَرِيفُ", VOICE_RANA),

        # كلمات نشاط 4 التصنيف والتوصيل (ص ١٢٧)
        ("lam_word_alqalam", "الْقَلَمُ", VOICE_RANA),
        ("lam_word_addaftar", "الدَّفْتَرُ", VOICE_RANA),
        ("lam_word_assayyaarah", "السَّيَّارَةُ", VOICE_RANA),
        ("lam_word_alkitaab", "الْكِتَابُ", VOICE_RANA),
        ("lam_word_albattah", "الْبَطَّةُ", VOICE_RANA),
        ("lam_word_alguraab", "الْغُرَابُ", VOICE_RANA),

        # نشاط 5 التحليل الصوتي بالتصفيق (ص ١٢٧)
        ("lam_word_alward", "الْوَرْدُ", VOICE_RANA),
        ("lam_word_assahaab", "السَّحَابُ", VOICE_RANA),
        ("lam_split_alward", "الْوَرْدُ: اَلْـ... وَرْ... دُ. ثَلَاثَةُ مَقَاطِعَ.", VOICE_BASSEL),
        ("lam_split_assahaab", "السَّحَابُ: اَسْـ... سَـ... حَا... بُ. أَرْبَعَةُ مَقَاطِعَ.", VOICE_BASSEL),

        # كلمات وجمل قراءة ص ١٢٨: سَأَلَ الْمُعَلِّمُ
        ("lam_word_saala", "سَأَلَ", VOICE_RANA),
        ("lam_word_almuallim", "الْمُعَلِّمُ", VOICE_RANA),
        ("lam_word_maadha", "مَاذَا", VOICE_RANA),
        ("lam_word_khalaqa", "خَلَقَ", VOICE_RANA),
        ("lam_word_allahu", "اللَّهُ", VOICE_RANA),
        ("lam_word_lana", "لَنَا", VOICE_RANA),
        ("lam_word_qaala", "قَالَ", VOICE_RANA),
        ("lam_word_aliyyun", "عَلِيٌّ", VOICE_RANA),
        ("lam_word_wannujoom", "وَالنُّجُومَ", VOICE_RANA),
        ("lam_word_qaalat", "وَقَالَتْ", VOICE_RANA),
        ("lam_word_zaynab", "زَيْنَبُ", VOICE_RANA),
        ("lam_word_feeha", "فِيهَا", VOICE_RANA),
        ("lam_word_talaameedh", "التَّلَامِيذُ", VOICE_RANA),
        ("lam_word_alhamdu", "الْحَمْدُ", VOICE_RANA),
        ("lam_word_lillah", "لِلَّهِ", VOICE_RANA),

        ("lam_read_full", "سَأَلَ الْمُعَلِّمُ: مَاذَا خَلَقَ اللَّهُ لَنَا؟ قَالَ عَلِيٌّ: السَّمَاءَ وَالشَّمْسَ وَالْقَمَرَ وَالنُّجُومَ. وَقَالَتْ زَيْنَبُ: خَلَقَ الأَرْضَ وَمَا فِيهَا. فَقَالَ التَّلَامِيذُ: الْحَمْدُ لِلَّهِ.", VOICE_RANA),
        ("lam_read_s1", "سَأَلَ الْمُعَلِّمُ: مَاذَا خَلَقَ اللَّهُ لَنَا؟", VOICE_RANA),
        ("lam_read_s2", "قَالَ عَلِيٌّ: السَّمَاءَ وَالشَّمْسَ وَالْقَمَرَ وَالنُّجُومَ.", VOICE_RANA),
        ("lam_read_s3", "وَقَالَتْ زَيْنَبُ: خَلَقَ الأَرْضَ وَمَا فِيهَا.", VOICE_RANA),
        ("lam_read_s4", "فَقَالَ التَّلَامِيذُ: الْحَمْدُ لِلَّهِ.", VOICE_RANA),

        # نشيد ص ١٢٨: إِلَى اللِّقَاءِ مَدْرَسَتِي
        ("lam_nasheed_full", "إِلَى اللِّقَاءِ مَدْرَسَتِي. مَدْرَسَتِي سَتَفْتَحُ الأَبْوَابْ ... وَتَحْضُنُ الطُّلاَّبْ. بَعْدَ انْتِهَاءِ العُطْلَةِ ... أَعُودُ لِلْمَدْرَسَةِ. تَسْبِقُنِي أَشْوَاقِي ... لِلصَّفِّ وَالرِّفَاقِ. وَالدَّرْسِ وَالْكِتَابْ ... وَسَاحَةِ الأَلْعَابْ. مَدْرَسَتِي سَتَفْتَحُ الأَبْوَابْ ... وَتَحْضُنُ الطُّلاَّبْ.", VOICE_RANA),
        ("lam_nasheed_verse1", "مَدْرَسَتِي سَتَفْتَحُ الأَبْوَابْ ، وَتَحْضُنُ الطُّلاَّبْ.", VOICE_RANA),
        ("lam_nasheed_verse2", "بَعْدَ انْتِهَاءِ العُطْلَةِ ، أَعُودُ لِلْمَدْرَسَةِ.", VOICE_RANA),
        ("lam_nasheed_verse3", "تَسْبِقُنِي أَشْوَاقِي ، لِلصَّفِّ وَالرِّفَاقِ.", VOICE_RANA),
        ("lam_nasheed_verse4", "وَالدَّرْسِ وَالْكِتَابْ ، وَسَاحَةِ الأَلْعَابْ.", VOICE_RANA),
        ("lam_nasheed_verse5", "مَدْرَسَتِي سَتَفْتَحُ الأَبْوَابْ ، وَتَحْضُنُ الطُّلاَّبْ.", VOICE_RANA),

        # احتفالية ختام كتاب قراءتي 100% والتعزيز
        ("lam_completion_congrats", "مَبْرُوكٌ يَا أَبْطَالَ قِرَاءَتِي! أَلْفُ مَبْرُوك! لَقَدْ أَكْمَلْتُمْ كِتَابَ قِرَاءَتِي لِلصَّفِّ الأَوَّلِ الابْتِدَائِيِّ كَامِلًا مِئَةً بِالْمِئَة! تَعَلَّمْتُمْ كُلَّ الْحُرُوفِ وَالْحَرَكَاتِ وَالْمَقَاطِعِ وَالْقِرَاءَةِ الْعِرَاقِيَّةِ الأَصِيلَةِ، وَأَصْبَحْتُمْ فُرْسَانَ الْقِرَاءَةِ وَالْكِتَابَة! أَنْتُمْ فَخْرُ الْعِرَاقِ وَمُسْتَقْبَلُهُ الْمُشْرِق!", VOICE_BASSEL),
        ("lam_correct", "أَحْسَنْتَ يَا بَطَلَ قِرَاءَتِي! إِجَابَةٌ صَحِيحَةٌ وَرَائِعَة!", VOICE_BASSEL),
        ("lam_wrong", "حَاوِلْ مَرَّةً أُخْرَى، أَنْتَ ذَكِيٌّ وَقَادِرٌ عَلَى النَّجَاح!", VOICE_BASSEL),
        ("lam_encourage_super", "مُمْتَازٌ جِدًّا! أَنْتَ عَبْقَرِيُّ الْقِرَاءَةِ وَنَجْمُ اللَّامِ الشَّمْسِيَّةِ وَالْقَمَرِيَّة!", VOICE_BASSEL)
    ]
}


def run_lesson_pipeline(preset_data, bump=False):
    t0 = time.time()
    print("=" * 65)
    print(f"🚀 بدء خط الإنتاج المؤتمت لـ: {preset_data.get('name', 'درس جديد')}")
    print("=" * 65)

    # 1. استخراج الصفحات
    if 'pages' in preset_data:
        extract_book_pages(preset_data['pages'])

    # 2. قص الأنشطة
    if 'crops' in preset_data:
        crop_activity_boxes(preset_data['crops'])

    # 3. توليد الأصوات
    if 'audio' in preset_data:
        run_generate_audio(preset_data['audio'])
        keys = [item[0] for item in preset_data['audio']]
        update_audio_data_js(keys)

    # 4. تحديث قائمة السماح
    new_images = list(preset_data.get('pages', {}).values()) + [c['out'] for c in preset_data.get('crops', [])]
    if new_images:
        update_gitignore_whitelist(new_images)

    # 5. البناء والمزامنة
    run_pipeline_build_and_sync(bump_cache=bump)

    t1 = time.time()
    print("\n" + "=" * 65)
    print(f"✨ اكتمل خط الإنتاج المؤتمت بنجاح في {t1 - t0:.1f} ثانية!")
    print("=" * 65)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="خط الإنتاج المؤتمت السريع لمنصة قراءتي الذكية - إعداد المهندس أسامة خليل هاشم")
    parser.add_argument('--preset', choices=['ghayn', 'ha', 'dhal', 'dha', 'lam'], help="تشغيل خط الإنتاج لدرس محدد مسبقاً")
    parser.add_argument('--build-sync', action='store_true', help="تشغيل البناء والمزامنة فقط")
    parser.add_argument('--bump', action='store_true', help="ترقية رقم نسخة كاش الخدمة")
    parser.add_argument('--sync-audio', action='store_true', help="تحديث Base64 في audio_data.js لجميع ملفات audio/*.mp3")

    args = parser.parse_args()

    if args.preset == 'ghayn':
        run_lesson_pipeline(PRESET_GHAYN, bump=args.bump)
    elif args.preset == 'ha':
        run_lesson_pipeline(PRESET_HA, bump=args.bump)
    elif args.preset == 'dhal':
        run_lesson_pipeline(PRESET_DHAL, bump=args.bump)
    elif args.preset == 'dha':
        run_lesson_pipeline(PRESET_DHA, bump=args.bump)
    elif args.preset == 'lam':
        run_lesson_pipeline(PRESET_LAM, bump=args.bump)
    elif args.build_sync:
        run_pipeline_build_and_sync(bump_cache=args.bump)
    elif args.sync_audio:
        import glob
        all_keys = [os.path.splitext(os.path.basename(f))[0] for f in glob.glob(os.path.join(AUDIO_DIR, '*.mp3'))]
        update_audio_data_js(all_keys)
    else:
        print("=" * 65)
        print("خط الإنتاج المؤتمت السريع لمنصة قراءتي الذكية (make_lesson.py)")
        print("إعداد وتطوير: المهندس أسامة خليل هاشم")
        print("=" * 65)
        print("الاستخدام السريع:")
        print("  python tools/make_lesson.py --preset ghayn    # تشغيل خط الإنتاج لدرس حرف الغين")
        print("  python tools/make_lesson.py --build-sync     # إعادة تجميع التطبيق ومزامنة الكاش")
        print("  python tools/make_lesson.py --sync-audio      # مزامنة جميع الأصوات داخل audio_data.js")
        print("  python tools/make_lesson.py -h               # عرض الخيارات والمساعدة")
