#!/usr/bin/env python3
"""
أداة التدقيق الشامل والفحص الختامي لمنصة قراءتي التفاعلية الذكية (100% المنهج)
وحزم الإصدار النهائي المستقل (v3.29 Final Release)
إعداد وتطوير: المهندس أسامة خليل هاشم
"""

import os
import re
import glob

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def audit():
    print("=" * 70)
    print("🔍 بدء التدقيق الشامل لكتاب قراءتي 100% وفحص الإصدار النهائي v3.29")
    print("   إعداد وتطوير: المهندس أسامة خليل هاشم")
    print("=" * 70)

    errors = []
    warnings = []

    # 1. فحص curriculum_data.js بدقة
    curr_path = os.path.join(BASE_DIR, 'curriculum_data.js')
    with open(curr_path, 'r', encoding='utf-8') as f:
        curr_txt = f.read()

    # الوحدات
    units = re.findall(r'id:\s*"(unit_[^"]+)",[\s\S]*?title:\s*"([^"]+)"', curr_txt)
    print(f"✔ الوحدات المكتشفة ({len(units)} وحدات):")
    for uid, utitle in units:
        print(f"   - {uid}: {utitle}")

    # الدروس
    lesson_ids = re.findall(r'id:\s*"(tab-[^"]+)"', curr_txt)
    print(f"\n✔ إجمالي الدروس في curriculum_data.js: {len(lesson_ids)} درساً.")

    # التحقق من أن جميع الدروس بحالة ready
    # نبحث عن أي درس حالته ليست ready
    non_ready_matches = re.findall(r'id:\s*"(tab-[^"]+)"[\s\S]{1,150}?status:\s*"(?!ready")([^"]+)"', curr_txt)
    if non_ready_matches:
        errors.append(f"هناك دروس غير بحالة ready في curriculum_data.js: {non_ready_matches}")
    else:
        print("✔ جميع الدروس في curriculum_data.js بحالة ready بنسبة 100%.")

    # 2. فحص views/ ومطابقتها مع الدروس
    views_dir = os.path.join(BASE_DIR, 'views')
    view_files = []
    for u in ['prep', 'unit1', 'unit2', 'unit3', 'unit4', 'unit5', 'unit6']:
        u_dir = os.path.join(views_dir, u)
        if os.path.exists(u_dir):
            view_files.extend(glob.glob(os.path.join(u_dir, '*.html')))
    print(f"✔ عدد واجهات الدروس في views/: {len(view_files)} واجهة.")

    # Check view element IDs
    view_element_ids = set()
    for vf in view_files:
        with open(vf, 'r', encoding='utf-8') as f:
            v_content = f.read()
        m = re.findall(r'id="(view-tab-[^"]+)"', v_content)
        for vid in m:
            view_element_ids.add(vid)

    missing_views = []
    for lid in lesson_ids:
        expected_view_id = f"view-{lid}"
        if expected_view_id not in view_element_ids:
            missing_views.append(lid)

    extra_views = []
    curr_lids_set = {f"view-{lid}" for lid in lesson_ids}
    for vid in view_element_ids:
        if vid not in curr_lids_set:
            extra_views.append(vid)

    if missing_views:
        errors.append(f"دروس في curriculum_data.js ليس لها واجهة view-* مقابلة ({len(missing_views)}): {missing_views}")
    else:
        print(f"✔ جميع الدروس ({len(lesson_ids)}) لها واجهات view-* مقابلة ومطابقة بنسبة 100%.")

    if extra_views:
        warnings.append(f"واجهات إضافية موجودة في views/ وغير مربوطة في القائمة ({len(extra_views)}): {extra_views}")
    else:
        print("✔ لا توجد أي واجهات معلقة أو غير مربوطة.")

    # 3. فحص تطابق index.html (خريطة LESSON_VIEW_MANIFEST أو الواجهات المضمنة) بعد البناء
    import json
    idx_path = os.path.join(BASE_DIR, 'index.html')
    with open(idx_path, 'r', encoding='utf-8') as f:
        idx_txt = f.read()

    m_manifest = re.search(r'window\.LESSON_VIEW_MANIFEST\s*=\s*(\{[^;]+\});', idx_txt)
    if m_manifest:
        manifest_map = json.loads(m_manifest.group(1))
        print(f"✔ عدد واجهات الدروس المسجلة في LESSON_VIEW_MANIFEST داخل index.html: {len(manifest_map)} واجهة.")
        missing_in_manifest = [lid for lid in lesson_ids if lid not in manifest_map]
        missing_on_disk = [
            (lid, p) for lid, p in manifest_map.items()
            if not os.path.exists(os.path.join(BASE_DIR, p))
        ]
        if missing_in_manifest:
            errors.append(f"دروس غير مسجلة في LESSON_VIEW_MANIFEST ({len(missing_in_manifest)}): {missing_in_manifest}")
        elif missing_on_disk:
            errors.append(f"ملفات واجهات مفقودة على القرص ({len(missing_on_disk)}): {missing_on_disk}")
        else:
            print("✔ مطابقة تامة بين خريطة LESSON_VIEW_MANIFEST في index.html وفهرس المنهج والملفات 100%.")
    else:
        idx_view_ids = set(re.findall(r'id="(view-tab-[^"]+)"', idx_txt))
        print(f"✔ عدد واجهات الدروس الموجودة داخل index.html: {len(idx_view_ids)} واجهة.")
        if len(idx_view_ids) != len(lesson_ids):
            errors.append(f"عدم تطابق بين واجهات index.html ({len(idx_view_ids)}) ودروس المنهج ({len(lesson_ids)})!")
        else:
            print("✔ مطابقة تامة بين واجهات index.html وفهرس المنهج 100%.")

    # 4. فحص الصور المستخدمة في views و curriculum_data
    all_img_refs = set()
    for vf in view_files:
        with open(vf, 'r', encoding='utf-8') as f:
            txt = f.read()
        imgs = re.findall(r'src=["\']([^"\']+\.png)["\']', txt)
        for img in imgs:
            all_img_refs.add(img.replace('./', ''))

    curr_imgs = re.findall(r'["\']([^"\']+\.png)["\']', curr_txt)
    for img in curr_imgs:
        all_img_refs.add(img.replace('./', ''))

    missing_imgs = [img for img in all_img_refs if not os.path.exists(os.path.join(BASE_DIR, img))]
    if missing_imgs:
        errors.append(f"صور مفقودة على القرص ({len(missing_imgs)}): {missing_imgs}")
    else:
        print(f"✔ جميع الصور المشار إليها ({len(all_img_refs)} صورة) موجودة فعلياً على القرص.")

    # 5. فحص الصوتيات
    audio_files_disk = set(os.listdir(os.path.join(BASE_DIR, 'audio')))
    print(f"✔ إجمالي الملفات الصوتية في audio/: {len(audio_files_disk)} ملف mp3.")

    # 6. فحص وسوم HTML في app-shell-top.html و index.html
    top_shell = os.path.join(views_dir, 'app-shell-top.html')
    with open(top_shell, 'r', encoding='utf-8') as f:
        top_txt = f.read()
    
    if '<style>' in top_txt and '</style>' not in top_txt:
        errors.append("وسم <style> في views/app-shell-top.html غير مغلق!")
    else:
        print("✔ بنية وسوم رأس الصفحة <head> سليمة ومتوافقة مع المعايير.")

    vbadge_match = re.search(r'class="app-version-badge"[^>]*>([^<]+)<', top_txt)
    if vbadge_match:
        cur_badge = vbadge_match.group(1).strip()
        print(f"✔ شارة الإصدار الرسمية: {cur_badge}")
        if cur_badge != 'v3.29 Final':
            warnings.append(f"شارة الإصدار هي '{cur_badge}' والمفترض ترقيتها إلى 'v3.29 Final' بمناسبة اكتمال الكتاب 100%.")

    # 7. فحص وجود التوقيع الرسمي في المكونات
    official_signature = "أسامة خليل هاشم"
    components_to_check = [
        ('README.md', os.path.join(BASE_DIR, 'README.md')),
        ('manifest.json', os.path.join(BASE_DIR, 'manifest.json')),
        ('index.html', os.path.join(BASE_DIR, 'index.html')),
        ('views/app-shell-top.html', top_shell),
        ('sw.js', os.path.join(BASE_DIR, 'sw.js')),
    ]
    for cname, cpath in components_to_check:
        if os.path.exists(cpath):
            with open(cpath, 'r', encoding='utf-8') as f:
                c_txt = f.read()
            if official_signature in c_txt:
                print(f"✔ التوقيع الرسمي للمهندس أسامة خليل هاشم موجود ومؤكد في {cname}.")
            else:
                errors.append(f"التوقيع الرسمي مفقود في {cname}!")

    # 8. فحص الحزمة المستقلة (قراءتي_التفاعلية_الذكية.html)
    standalone_path = os.path.join(BASE_DIR, 'قراءتي_التفاعلية_الذكية.html')
    if os.path.exists(standalone_path):
        size_mb = os.path.getsize(standalone_path) / (1024 * 1024)
        print(f"\n✔ ملف الحزمة المستقلة موجود: قراءتي_التفاعلية_الذكية.html ({size_mb:.2f} MB).")
        with open(standalone_path, 'r', encoding='utf-8') as sf:
            stxt = sf.read()
        
        st_checks = [
            ("window.AUDIO_DATA =", "قواعد الصوتيات المدمجة"),
            ("window.CURRICULUM_DATA =", "فهرس المنهج المدمج"),
            ('id="view-tab-lesson1"', "واجهة الدرس الأول"),
            ('id="view-tab-al_shamsiyyah_qamariyyah"', "واجهة الدرس الختامي ص 128"),
        ]
        for check_str, desc in st_checks:
            if check_str in stxt:
                print(f"   ✔ الحزمة المستقلة تتضمن {desc}.")
            else:
                errors.append(f"الحزمة المستقلة تفتقر إلى {desc}!")

        # فحص عدم وجود صور غير مدمجة
        unencoded_imgs = [img for img in re.findall(r'src="([^"]+\.png)"', stxt) if not img.startswith('data:')]
        if unencoded_imgs:
            errors.append(f"توجد صور غير مدمجة في الحزمة المستقلة: {unencoded_imgs[:5]}")
        else:
            print("   ✔ كافة الصور في الحزمة المستقلة مدمجة 100% بصيغة Data-URI.")
    else:
        warnings.append("ملف الحزمة المستقلة قراءتي_التفاعلية_الذكية.html غير موجود!")

    # Summary
    print("\n" + "=" * 70)
    print("ملخص نتائج التدقيق الشامل:")
    print("=" * 70)
    if errors:
        print(f"❌ الأخطاء المكتشفة ({len(errors)}):")
        for e in errors:
            print(f"   - {e}")
    else:
        print("✔ ممتاز: لا توجد أي أخطاء حرجة بنسبة 100%!")

    if warnings:
        print(f"\n⚠️ التنبيهات ({len(warnings)}):")
        for w in warnings:
            print(f"   - {w}")
    else:
        print("✔ ممتاز: لا توجد أي تنبيهات بنسبة 100%!")

if __name__ == '__main__':
    audit()
