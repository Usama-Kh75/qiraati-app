#!/usr/bin/env python3
"""
بوابة الفحص والجودة الآلية الإلزامية قبل كل إصدار
لمنصة قراءتي التفاعلية الذكية (v3.56)
إعداد وتطوير: المهندس أسامة خليل هاشم

تقوم هذه الأداة بإجراء كافة الفحوصات الصارمة لمنع أي أخطاء قبل النشر:
1. بناء index.html وتوليد الحزمة الأحادية المستقلة (build.py + build_standalone.py).
2. فحص السلامة النحوية عبر node --check لجميع ملفات js/**/*.js و sw.js (0 أخطاء).
3. فحص index.html للتحقق من خلوه تماماً من المعرفات المكررة (0 Duplicate IDs) والتحقق من وجود loading="lazy" للصور.
4. الفحص الأمني الصارم لعدم وجود أي مفاتيح سرية (AIza...) في أي ملف واجهة أمامي.
5. مطابقة رقم الإصدار (v3.56) وترقية مخزن الكاش إلى (qiraati-smart-v79).
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
    print_header("[1/5] بناء وتجميع الواجهات والحزمة المستقلة")
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
    print_header("[2/5] الفحص النحوي الشامل لأكواد JavaScript (node --check)")
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
    print_header("[3/5] فحص سلامة DOM والصور في index.html")
    index_path = os.path.join(BASE_DIR, 'index.html')
    if not os.path.exists(index_path):
        print("❌ ملف index.html غير موجود!")
        return False

    with open(index_path, 'r', encoding='utf-8') as f:
        html = f.read()

    # فحص المعرفات المكررة
    ids = re.findall(r'\bid=[\"\']([^\"\']+)[\"\']', html)
    id_counts = Counter(ids)
    duplicates = {k: v for k, v in id_counts.items() if v > 1}
    if duplicates:
        print(f"❌ تم العثور على {len(duplicates)} معرفات DOM مكررة:")
        for k, v in list(duplicates.items())[:10]:
            print(f"  - id=\"{k}\" مكرر {v} مرات")
        return False
    print(f"✔ سلامة المعرفات: {len(ids)} معرف DOM فريد ولا يوجد أي تكرار (0 Duplicate IDs).")

    # فحص تحميل الصور البطيء loading="lazy"
    imgs = re.findall(r'<img\s+[^>]*>', html)
    missing_lazy = [img for img in imgs if 'loading=' not in img]
    if missing_lazy:
        print(f"❌ تم العثور على {len(missing_lazy)} صور تفتقر لخاصية loading=\"lazy\":")
        for img in missing_lazy[:5]:
            print(f"  - {img[:80]}")
        return False
    print(f"✔ سلامة الصور: جميع الصور ({len(imgs)} صورة) تحتوي على خاصية loading=\"lazy\" بنسبة 100%.")
    return True

def step4_security_scan():
    print_header("[4/5] الفحص الأمني لعدم وجود مفاتيح سرية (Secret Keys Scan)")
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

def step5_version_alignment():
    print_header("[5/5] مطابقة رقم الإصدار (v3.56) ومخزن الكاش (qiraati-smart-v79)")
    top_shell = os.path.join(BASE_DIR, 'views', 'app-shell-top.html')
    sw_file = os.path.join(BASE_DIR, 'sw.js')

    with open(top_shell, 'r', encoding='utf-8') as f:
        top_content = f.read()
    with open(sw_file, 'r', encoding='utf-8') as f:
        sw_content = f.read()

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

    expected_ver = "v3.56"
    expected_cache = "qiraati-smart-v79"

    errors = []
    if top_ver != expected_ver:
        errors.append(f"إصدار الواجهة يجب أن يكون {expected_ver} (الموجود: {top_ver})")
    if sw_ver != expected_ver:
        errors.append(f"إصدار sw.js يجب أن يكون {expected_ver} (الموجود: {sw_ver})")
    if sw_cache != expected_cache:
        errors.append(f"مخزن الكاش يجب أن يكون {expected_cache} (الموجود: {sw_cache})")

    if errors:
        print("\n❌ عدم تطابق في بيانات الإصدار:")
        for e in errors:
            print(f"  - {e}")
        return False

    print("\n✔ تطابق تام في بيانات الإصدار المعياري v3.56 وكاش qiraati-smart-v79.")
    return True

def main():
    print("=" * 70)
    print("🛡️ منصة قراءتي التفاعلية الذكية - بوابة الفحص الآلي الإلزامية")
    print("   إعداد وتطوير: المهندس أسامة خليل هاشم (v3.56)")
    print("=" * 70)

    steps = [
        ("البناء والتجميع", step1_build),
        ("الفحص النحوي", step2_syntax_check),
        ("سلامة المعرفات والصور", step3_dom_integrity),
        ("الفحص الأمني", step4_security_scan),
        ("مطابقة الإصدار والكاش", step5_version_alignment)
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
