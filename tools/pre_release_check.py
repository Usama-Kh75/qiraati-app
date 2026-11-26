#!/usr/bin/env python3
"""
بوابة الفحص والجودة الآلية الإلزامية قبل كل إصدار
لمنصة قراءتي التفاعلية الذكية (v3.64)
إعداد وتطوير: المهندس أسامة خليل هاشم

تقوم هذه الأداة بإجراء كافة الفحوصات الصارمة لمنع أي أخطاء قبل النشر:
1. بناء index.html الخفيف وتوليد الحزمة الأحادية المستقلة (build.py + build_standalone.py).
2. فحص السلامة النحوية عبر node --check لجميع ملفات js/**/*.js و sw.js (0 أخطاء).
3. فحص index.html وواجهات الدروس للتحقق من خلوها تماماً من المعرفات المكررة (0 Duplicate IDs) واكتمال خريطة LESSON_VIEW_MANIFEST (46 درساً) وloading="lazy" للصور واستضافة خط Tajawal محلياً.
4. فحص تكامل وجود كافة الصور والأصول الرقمية المذكورة في الكود والتحقق الصارم من وجودها على القرص (0 صور مكسورة 404).
5. فحص مكتبة الأصوات الفونيمية النقية للـ 28 حرفاً وجميع مفاتيح الصوت الحرفية في الواجهات والكود (0 مفاتيح مفقودة).
6. الفحص الأمني الصارم لعدم وجود أي مفاتيح سرية (AIza...) في أي ملف واجهة أمامي.
7. مطابقة رقم الإصدار (v3.64) وترقية مخزن الكاش إلى (qiraati-smart-v91).
"""

import os
import sys
import re
import glob
import subprocess
from collections import Counter

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def print_header(title):
    print("\n" + "=" * 70)
    print(f"🔍 {title}")
    print("=" * 70)

def step1_build():
    print_header("[1/7] بناء وتجميع الواجهات والحزمة المستقلة")
    # 1. build.py
    cmd_build = [sys.executable, os.path.join(BASE_DIR, 'tools', 'build.py')]
    res_b = subprocess.run(cmd_build, capture_output=True, text=True, encoding='utf-8')
    if res_b.returncode != 0:
        print("❌ فشل تشغيل build.py:")
        print(res_b.stderr)
        return False
    print("✔ نجح بناء وتجميع index.html")

    # 2. build_standalone.py
    cmd_std = [sys.executable, os.path.join(BASE_DIR, 'tools', 'build_standalone.py')]
    res_std = subprocess.run(cmd_std, capture_output=True, text=True, encoding='utf-8')
    if res_std.returncode != 0:
        print("❌ فشل تشغيل build_standalone.py:")
        print(res_std.stderr)
        return False
    print("✔ نجح بناء وتوليد قراءتي_التفاعلية_الذكية.html")
    return True

def step2_syntax_check():
    print_header("[2/7] الفحص النحوي الشامل لأكواد JavaScript (node --check)")
    js_files = glob.glob(os.path.join(BASE_DIR, 'js', '**', '*.js'), recursive=True)
    js_files.append(os.path.join(BASE_DIR, 'sw.js'))

    errors = []
    for jf in sorted(js_files):
        rel = os.path.relpath(jf, BASE_DIR)
        res = subprocess.run(['node', '--check', jf], capture_output=True, text=True)
        if res.returncode != 0:
            errors.append((rel, res.stderr.strip()))
        else:
            print(f"  ✔ {rel}")

    if errors:
        print(f"\n❌ تم العثور على أخطاء نحوية في {len(errors)} ملفات:")
        for f, err in errors:
            print(f"  - {f}:\n{err}\n")
        return False

    print(f"\n✔ اجتازت جميع ملفات JavaScript ({len(js_files)} ملفاً) الفحص بنجاح تام (0 أخطاء).")
    return True

def step3_dom_integrity():
    print_header("[3/7] فحص سلامة DOM والتقسيم الكسول والصور في index.html و views/")
    index_path = os.path.join(BASE_DIR, 'index.html')
    if not os.path.exists(index_path):
        print("❌ ملف index.html غير موجود!")
        return False

    index_size = os.path.getsize(index_path)
    if index_size >= 1_048_576:
        print(f"❌ حجم index.html أكبر من 1 م.ب ({index_size:,} بايت) — يجب أن يبقى خفيفاً ومقسماً!")
        return False
    print(f"✔ حجم index.html خفيف ومحسّن: {index_size / 1024:.1f} ك.ب ({index_size:,} بايت).")

    with open(index_path, 'r', encoding='utf-8') as f:
        html = f.read()

    # فحص خريطة LESSON_VIEW_MANIFEST داخل index.html
    import json
    m_manifest = re.search(r'window\.LESSON_VIEW_MANIFEST\s*=\s*(\{[^;]+\});', html)
    if not m_manifest:
        print("❌ تعذر العثور على window.LESSON_VIEW_MANIFEST في index.html!")
        return False
    manifest_map = json.loads(m_manifest.group(1))
    if len(manifest_map) != 46:
        print(f"❌ عدد الدروس في LESSON_VIEW_MANIFEST هو {len(manifest_map)} بدلاً من 46!")
        return False
    for lid, rel_p in manifest_map.items():
        if not os.path.exists(os.path.join(BASE_DIR, rel_p)):
            print(f"❌ ملف واجهة الدرس مفقود على القرص: {rel_p} ({lid})")
            return False
    print(f"✔ خريطة LESSON_VIEW_MANIFEST مكتملة 100% ({len(manifest_map)} درساً وجميع ملفاتها موجودة).")

    # تجميع index.html + ملفات واجهات الدروس الـ 46 لفحص DOM والصور
    view_parts = [html]
    for unit_sub in ['prep', 'unit1', 'unit2', 'unit3', 'unit4', 'unit5', 'unit6']:
        for vf in sorted(glob.glob(os.path.join(BASE_DIR, 'views', unit_sub, '*.html'))):
            with open(vf, 'r', encoding='utf-8') as vfp:
                view_parts.append(vfp.read())
    combined_html = "\n".join(view_parts)

    # فحص المعرفات المكررة عبر الهيكل وكافة الواجهات
    ids = re.findall(r'\bid=[\"\']([^\"\']+)[\"\']', combined_html)
    id_counts = Counter(ids)
    duplicates = {k: v for k, v in id_counts.items() if v > 1}
    if duplicates:
        print(f"❌ تم العثور على {len(duplicates)} معرفات DOM مكررة:")
        for k, v in list(duplicates.items())[:10]:
            print(f"  - id=\"{k}\" مكرر {v} مرات")
        return False
    print(f"✔ سلامة المعرفات: {len(ids)} معرف DOM فريد عبر index.html و46 واجهة (0 Duplicate IDs).")

    # فحص تحميل الصور البطيء loading="lazy"
    imgs = re.findall(r'<img\s+[^>]*>', combined_html)
    missing_lazy = [img for img in imgs if 'loading=' not in img]
    if missing_lazy:
        print(f"❌ تم العثور على {len(missing_lazy)} صور تفتقر لخاصية loading=\"lazy\":")
        for img in missing_lazy[:5]:
            print(f"  - {img[:80]}")
        return False
    print(f"✔ سلامة الصور: جميع الصور ({len(imgs)} صورة) تحتوي على خاصية loading=\"lazy\" بنسبة 100%.")
    return True

def step4_image_assets_integrity():
    print_header("[4/7] فحص تكامل وجود كافة الصور والأصول الرقمية (0 صور مكسورة 404)")
    scan_files = (
        glob.glob(os.path.join(BASE_DIR, 'js', '**', '*.js'), recursive=True) +
        glob.glob(os.path.join(BASE_DIR, 'views', '**', '*.html'), recursive=True) +
        [os.path.join(BASE_DIR, 'index.html'), os.path.join(BASE_DIR, 'sw.js')]
    )

    img_pattern = re.compile(r'["\']([^"\'\n\r\t<>]*?\.(?:png|jpg|jpeg|webp|svg|gif))["\']', re.IGNORECASE)
    missing = []
    checked_count = 0

    for sf in scan_files:
        try:
            with open(sf, 'r', encoding='utf-8', errors='ignore') as fp:
                content = fp.read()
                matches = img_pattern.findall(content)
                for match in matches:
                    if match.startswith('http') or match.startswith('data:') or '${' in match:
                        continue
                    checked_count += 1
                    clean = match.lstrip('./').replace('/', os.sep)
                    target = os.path.join(BASE_DIR, clean)
                    if not os.path.exists(target):
                        basename_target = os.path.join(BASE_DIR, os.path.basename(clean))
                        if not os.path.exists(basename_target):
                            rel_src = os.path.relpath(sf, BASE_DIR)
                            missing.append((rel_src, match))
        except Exception as e:
            print(f"  ⚠ خطأ في قراءة {sf}: {e}")

    if missing:
        print(f"❌ تم العثور على {len(missing)} إشارات لصور غير موجودة على القرص (404 Not Found):")
        for src, img in sorted(set(missing)):
            print(f"  - في {src}: {img}")
        return False

    print(f"✔ تكامل الصور 100%: تم فحص {checked_count} إشارة للصور في {len(scan_files)} ملفاً، وكافة الصور موجودة على القرص (0 صور مكسورة).")
    return True

def step5_audio_assets_integrity():
    print_header("[5/7] فحص مكتبة الأصوات الفونيمية النقية الـ 28 وسلامة المفاتيح الصوتية (0 مفاتيح مفقودة)")
    required_pure_phonemes = [
        "phoneme_pure_alif", "phoneme_pure_baa", "phoneme_pure_taa", "phoneme_pure_thaa",
        "phoneme_pure_jeem", "phoneme_pure_haa", "phoneme_pure_khaa", "phoneme_pure_dal",
        "phoneme_pure_dhal", "phoneme_pure_raa", "phoneme_pure_zay", "phoneme_pure_seen",
        "phoneme_pure_sheen", "phoneme_pure_sad", "phoneme_pure_dhad", "phoneme_pure_ta",
        "phoneme_pure_dha", "phoneme_pure_ayn", "phoneme_pure_ghayn", "phoneme_pure_faa",
        "phoneme_pure_qaf", "phoneme_pure_kaf", "phoneme_pure_lam", "phoneme_pure_meem",
        "phoneme_pure_noon", "phoneme_pure_ha", "phoneme_pure_waw", "phoneme_pure_yaa",
        "letter_marboota_sound", "tanween_dham_sound", "shaddah_sound"
    ]
    missing_phonemes = []
    for k in required_pure_phonemes:
        p = os.path.join(BASE_DIR, 'audio', f'{k}.mp3')
        if not (os.path.exists(p) and os.path.getsize(p) >= 2500):
            missing_phonemes.append(k)
    if missing_phonemes:
        print(f"❌ ملفات فونيمات نقية مفقودة أو صغيرة الحجم ({len(missing_phonemes)}):")
        for k in missing_phonemes:
            print(f"  - audio/{k}.mp3")
        return False
    print(f"✔ مكتبة الأصوات الفونيمية النقية مكتملة 100% ({len(required_pure_phonemes)} ملفاً >= 2500 بايت).")

    scan_files = sorted(
        glob.glob(os.path.join(BASE_DIR, 'views', '**', '*.html'), recursive=True) +
        glob.glob(os.path.join(BASE_DIR, 'js', '**', '*.js'), recursive=True) +
        ([os.path.join(BASE_DIR, 'curriculum_data.js')] if os.path.exists(os.path.join(BASE_DIR, 'curriculum_data.js')) else [])
    )
    ignored_tokens = {'faseeh_ai_tts'}
    patterns = [
        re.compile(r"playAudio\s*\(\s*['\"]([a-zA-Z0-9_\-]+)['\"]\s*(?=[),])"),
        re.compile(r"mascotSpeak\s*\([^;\n)]*?,\s*['\"]([a-zA-Z0-9_\-]+)['\"]\s*(?=[),])"),
        re.compile(r"\baudioKey\s*:\s*['\"]([a-zA-Z0-9_\-]+)['\"]\s*(?=[,}\]])"),
        re.compile(r"\bsoundKey\s*:\s*['\"]([a-zA-Z0-9_\-]+)['\"]\s*(?=[,}\]])"),
        re.compile(r"\baudio\s*:\s*['\"]([a-zA-Z0-9_\-]+)['\"]\s*(?=[,}\]])"),
    ]
    checked_keys = set()
    missing_audio = []
    for sf in scan_files:
        rel_src = os.path.relpath(sf, BASE_DIR)
        with open(sf, 'r', encoding='utf-8', errors='ignore') as fp:
            content = fp.read()
        for pat in patterns:
            for m in pat.finditer(content):
                k = m.group(1)
                if k in ignored_tokens:
                    continue
                checked_keys.add(k)
                target = os.path.join(BASE_DIR, 'audio', f'{k}.mp3')
                if not (os.path.exists(target) and os.path.getsize(target) >= 2500):
                    missing_audio.append((rel_src, k))

    if missing_audio:
        print(f"❌ تم العثور على {len(set(missing_audio))} مفاتيح صوتية مفقودة على القرص (404 Not Found):")
        for src, k in sorted(set(missing_audio)):
            print(f"  - في {src}: audio/{k}.mp3")
        return False

    print(f"✔ تكامل الملفات الصوتية 100%: تم التحقق من {len(checked_keys)} مفتاحاً صوتياً فريداً في {len(scan_files)} ملفاً (0 مفاتيح مفقودة).")
    return True

def step6_security_scan():
    print_header("[6/7] الفحص الأمني لعدم وجود مفاتيح سرية (Secret Keys Scan)")
    scan_files = (
        glob.glob(os.path.join(BASE_DIR, 'js', '**', '*.js'), recursive=True) +
        glob.glob(os.path.join(BASE_DIR, 'views', '**', '*.html'), recursive=True) +
        glob.glob(os.path.join(BASE_DIR, 'css', '*.css')) +
        [os.path.join(BASE_DIR, 'index.html'), os.path.join(BASE_DIR, 'sw.js')]
    )

    leaked = []
    pattern = re.compile(r'AIza[0-9A-Za-z-_]{35}')

    for sf in scan_files:
        try:
            with open(sf, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                matches = pattern.findall(content)
                if matches:
                    rel = os.path.relpath(sf, BASE_DIR)
                    leaked.append((rel, len(matches)))
        except Exception:
            pass

    if leaked:
        print(f"❌ خطر أمني! تم العثور على مفاتيح سرية في {len(leaked)} ملفات:")
        for f, cnt in leaked:
            print(f"  - {f}: {cnt} مفتاح")
        return False

    print(f"✔ الأمان الرقمي 100%: تم مسح {len(scan_files)} ملفاً، ولم يُعثر على أي مفتاح سري.")
    return True

def step7_version_alignment():
    print_header("[7/7] مطابقة رقم الإصدار (v3.64) ومخزن الكاش (qiraati-smart-v91) واستضافة الخطوط")
    top_shell = os.path.join(BASE_DIR, 'views', 'app-shell-top.html')
    sw_file = os.path.join(BASE_DIR, 'sw.js')
    index_file = os.path.join(BASE_DIR, 'index.html')

    with open(top_shell, 'r', encoding='utf-8') as f:
        top_content = f.read()
    with open(sw_file, 'r', encoding='utf-8') as f:
        sw_content = f.read()
    with open(index_file, 'r', encoding='utf-8') as f:
        index_content = f.read()

    # فحص الإصدار في views/app-shell-top.html
    top_ver_match = re.search(r'class="app-version-badge"[^>]*>([^<]+)<', top_content)
    top_ver = top_ver_match.group(1).strip() if top_ver_match else None

    # فحص الإصدار والكاش في sw.js
    sw_ver_match = re.search(r'الإصدار:\s*(v[0-9\.]+)', sw_content)
    sw_ver = sw_ver_match.group(1).strip() if sw_ver_match else None

    sw_cache_match = re.search(r"const\s+CACHE_NAME\s*=\s*'([^']+)'", sw_content)
    sw_cache = sw_cache_match.group(1).strip() if sw_cache_match else None

    print(f"  - إصدار الواجهة (app-shell-top): {top_ver}")
    print(f"  - إصدار عامل الخدمة (sw.js): {sw_ver}")
    print(f"  - اسم مخزن الكاش (sw.js): {sw_cache}")

    expected_ver = "v3.64"
    expected_cache = "qiraati-smart-v92"

    errors = []
    if top_ver != expected_ver:
        errors.append(f"إصدار الواجهة يجب أن يكون {expected_ver} (الموجود: {top_ver})")
    if sw_ver != expected_ver:
        errors.append(f"إصدار sw.js يجب أن يكون {expected_ver} (الموجود: {sw_ver})")
    if sw_cache != expected_cache:
        errors.append(f"مخزن الكاش يجب أن يكون {expected_cache} (الموجود: {sw_cache})")

    # التحقق من خلو index.html و views من Google Fonts ووجود ملفات Tajawal الثمانية محلياً
    if 'fonts.googleapis.com' in index_content or 'fonts.gstatic.com' in index_content:
        errors.append("تم العثور على رابط خارجي لخطوط Google Fonts داخل index.html!")

    expected_fonts = [
        os.path.join('css', 'fonts.css'),
        os.path.join('fonts', 'tajawal-400-arabic.woff2'),
        os.path.join('fonts', 'tajawal-400-latin.woff2'),
        os.path.join('fonts', 'tajawal-700-arabic.woff2'),
        os.path.join('fonts', 'tajawal-700-latin.woff2'),
        os.path.join('fonts', 'tajawal-800-arabic.woff2'),
        os.path.join('fonts', 'tajawal-800-latin.woff2'),
        os.path.join('fonts', 'tajawal-900-arabic.woff2'),
        os.path.join('fonts', 'tajawal-900-latin.woff2'),
    ]
    for font_rel in expected_fonts:
        if not os.path.exists(os.path.join(BASE_DIR, font_rel)):
            errors.append(f"ملف الخط المحلي مفقود: {font_rel}")
        sw_entry = "'./" + font_rel.replace('\\', '/') + "'"
        if sw_entry not in sw_content:
            errors.append(f"ملف الخط المحلي غير مدرج في sw.js: {sw_entry}")

    if errors:
        print("\n❌ عدم تطابق في بيانات الإصدار أو الخطوط:")
        for e in errors:
            print(f"  - {e}")
        return False

    print("\n✔ تطابق تام في بيانات الإصدار المعياري v3.64 وكاش qiraati-smart-v92 وملفات خط Tajawal المحلية (8 WOFF2).")
    return True

def main():
    print("=" * 70)
    print("🛡️ منصة قراءتي التفاعلية الذكية - بوابة الفحص الآلي الإلزامية")
    print("   إعداد وتطوير: المهندس أسامة خليل هاشم (v3.64)")
    print("=" * 70)

    steps = [
        ("البناء والتجميع", step1_build),
        ("الفحص النحوي", step2_syntax_check),
        ("سلامة المعرفات والصور في DOM", step3_dom_integrity),
        ("تكامل وجود الصور والأصول (0 أخطاء 404)", step4_image_assets_integrity),
        ("سلامة المكتبة الفونيمية ومفاتيح الصوت (0 أخطاء 404)", step5_audio_assets_integrity),
        ("الفحص الأمني", step6_security_scan),
        ("مطابقة الإصدار والكاش", step7_version_alignment)
    ]

    all_passed = True
    for name, func in steps:
        if not func():
            all_passed = False
            print(f"\n❌ فشل فحص: {name}!")
            break

    print("\n" + "=" * 70)
    if all_passed:
        print("🎉 مبروك! اجتاز المشروع كافة معايير الجودة بنسبة 100% وهو جاهز للنشر.")
        print("=" * 70)
        sys.exit(0)
    else:
        print("⛔ توقف: المشروع غير جاهز للنشر، يرجى معالجة الأخطاء أعلاه أولاً.")
        print("=" * 70)
        sys.exit(1)

if __name__ == '__main__':
    main()
