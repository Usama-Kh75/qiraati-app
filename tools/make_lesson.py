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

    print("📄 جارٍ استخراج صفحات الكتاب المدرسي بدقة فائقة...")
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
    print("✂️ جارٍ اقتطاع الأنشطة والمشاهد المجهرية من الصفحات...")
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
    print(f"🎙️ بدء توليد {total} تسجيلاً صوتياً باللهجة العراقية الفصيحة...")

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
    print(f"✔ تم اكتمال توليد الأصوات ({generated_count} جديد / {total} إجمالي).")
    return results


def run_generate_audio(audio_items):
    return asyncio.run(generate_speech_batch(audio_items))


# =========================================================================
# 4. ترميز الأصوات بصيغة Base64 وتحديث audio_data.js
# =========================================================================
def update_audio_data_js(audio_keys):
    """
    يقوم بترميز ملفات audio/*.mp3 إلى Base64 وتحديث/إلحاق القيم في audio_data.js
    بطريقة التدفق السريع دون التسبب في مسح أو تلف المفاتيح السابقة.
    """
    audio_data_path = os.path.join(BASE_DIR, 'audio_data.js')
    print("⚡ جارٍ تحديث قاعدة البيانات الصوتية المضمنة (audio_data.js)...")

    if not os.path.exists(audio_data_path):
        lines = ["// قاعدة البيانات الصوتية الفونيمية المضمنة بصيغة Base64 - إعداد المهندس أسامة خليل هاشم\n", "window.AUDIO_DATA = {\n", "};\n"]
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
        print("✔ جميع المفاتيح الصوتية موجودة بالفعل في audio_data.js.")
        return

    # العثور على السطر الأخير الذي يحتوي على "};"
    closing_idx = -1
    for idx in range(len(lines) - 1, -1, -1):
        if '};' in lines[idx] or '}' in lines[idx]:
            closing_idx = idx
            break

    if closing_idx == -1:
        closing_idx = len(lines)
        lines.append("};\n")

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

    print(f"✔ تم إلحاق {len(new_entries)} تسجيلاً صوتياً جديداً بنجاح في audio_data.js.")


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
    print("\n🔨 تشغيل أداة البناء build.py...")
    subprocess.run([sys.executable, os.path.join(TOOLS_DIR, 'build.py')], check=True)

    print("\n🔄 تشغيل أداة المزامنة الفورية sync.py...")
    cmd = [sys.executable, os.path.join(TOOLS_DIR, 'sync.py')]
    if bump_cache:
        cmd.append('--bump')
    subprocess.run(cmd, check=True)


if __name__ == '__main__':
    print("=" * 65)
    print("خط الإنتاج المؤتمت السريع لمنصة قراءتي الذكية (make_lesson.py)")
    print("إعداد وتطوير: المهندس أسامة خليل هاشم")
    print("=" * 65)
    print("الأداة جاهزة للعمل كوحدة برمجية أو من سطر الأوامر.")
