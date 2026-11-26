#!/usr/bin/env python3
"""
أداة بناء وتوليد الحزمة الأحادية المستقلة الشاملة (قراءتي_التفاعلية_الذكية.html)
بكافة الألعاب والوسائط المدمجة 100% للعمل أوفلاين دون إنترنت أو خادم محلي
إعداد وتطوير: المهندس أسامة خليل هاشم

تقوم هذه الأداة بدمج:
1. كافة واجهات المنهج الـ 46 وواجهات app-shell
2. كافة ملفات التنسيق CSS الـ 28 داخل وسم <style> وخط Tajawal المحلي
3. كافة الصور والأيقونات المستخدمة فعلياً بصيغة Data-URI Base64
4. كافة الأصوات الفونيمية والتسجيلات الحديثة (2,908+ ملف MP3) بنسبة 100% داخل window.AUDIO_DATA
5. كافة السكربتات البرمجية ومنظومات الألعاب والسبورات والتقييم والإثراء
6. ضبط التوافقية الكاملة للتشغيل المباشر عبر بروتوكول file://
"""

import os
import sys
import re
import glob
import time
import json
import base64

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def file_to_base64_image(filepath):
    with open(filepath, 'rb') as f:
        data = f.read()
    ext = os.path.splitext(filepath)[1].lower()
    mime = "image/png"
    if ext in ['.jpg', '.jpeg']:
        mime = "image/jpeg"
    elif ext == '.svg':
        mime = "image/svg+xml"
    elif ext == '.webp':
        mime = "image/webp"
    b64 = base64.b64encode(data).decode('utf-8')
    return f"data:{mime};base64,{b64}"

def file_to_base64_audio(filepath):
    with open(filepath, 'rb') as f:
        data = f.read()
    b64 = base64.b64encode(data).decode('utf-8')
    return f"data:audio/mp3;base64,{b64}"

def build_standalone():
    t_start = time.time()
    print("=" * 75)
    print("🚀 بدء بناء وتوليد الحزمة الأحادية المستقلة الشاملة: قراءتي_التفاعلية_الذكية.html")
    print("   إعداد وتطوير: المهندس أسامة خليل هاشم")
    print("=" * 75)

    # 1. التأكد من تحديث index.html الخفيف وتجميع النص الكامل المضمن من ملفات views/
    sys.path.insert(0, os.path.join(BASE_DIR, 'tools'))
    import build
    build.build_index(inline_views=False)

    out_path = os.path.join(BASE_DIR, 'قراءتي_التفاعلية_الذكية.html')
    html, _, _, _ = build.assemble_html(inline_views=True)

    # 2. حصر وترميز كافة الصور والأيقونات المستخدمة فعلياً (Base64 Data URIs)
    print("\n[1/7] جارٍ ترميز الصور والأيقونات المستخدمة فعلياً في الذاكرة (Base64)...")
    ref_sources = [html]
    for extra_ref in ['curriculum_data.js', 'manifest.json']:
        ep = os.path.join(BASE_DIR, extra_ref)
        if os.path.exists(ep):
            with open(ep, 'r', encoding='utf-8', errors='ignore') as rf:
                ref_sources.append(rf.read())
    for jp in glob.glob(os.path.join(BASE_DIR, 'js', '**', '*.js'), recursive=True):
        with open(jp, 'r', encoding='utf-8', errors='ignore') as rf:
            ref_sources.append(rf.read())

    referenced_names = set(re.findall(r'([a-zA-Z0-9_\-]+\.png)', "\n".join(ref_sources)))
    png_files = [
        os.path.join(BASE_DIR, name)
        for name in sorted(referenced_names)
        if os.path.exists(os.path.join(BASE_DIR, name))
    ] + sorted(glob.glob(os.path.join(BASE_DIR, 'icons', '*.png')))
    print(f"✔ تم العثور على {len(png_files)} صورة وأيقونة مستخدمة على القرص.")

    raw_image_data = {}
    for pf in png_files:
        fname = os.path.basename(pf)
        b64_uri = file_to_base64_image(pf)
        raw_image_data[fname] = b64_uri
        rel_icon = f"icons/{fname}"
        if pf.replace('\\', '/').endswith(rel_icon):
            raw_image_data[rel_icon] = b64_uri

    print(f"✔ تم ترميز {len(raw_image_data)} أصلاً صورياً بنجاح بنسبة 100%.")

    # 3. دمج وضغط ملفات التنسيق CSS داخل وسم style واحد مع تضمين خطوط Tajawal WOFF2
    print("\n[2/7] جارٍ دمج ملفات التصميم CSS وخط Tajawal المحلي داخل وسم <style>...")
    css_files = [
        'css/fonts.css',
        'css/variables.css',
        'css/layout.css',
        'css/components.css',
        'css/stations.css',
        'css/lessons-prep.css',
        'css/lessons-unit1.css',
        'css/lessons-unit2.css',
        'css/lessons-unit3.css',
        'css/lessons-unit4.css',
        'css/lessons-unit5.css',
        'css/lessons-unit6.css',
        'css/evaluation.css',
        'css/enrichment.css',
        'css/blackboard.css',
        'css/games.css',
        'css/gamification.css',
        'css/teacher-dashboard.css',
        'css/classroom-sync.css',
        'css/classroom-quiz.css',
        'css/interactive-guide.css',
        'css/diagnostic-exams.css',
        'css/voice-coach.css',
        'css/dictation-lab.css',
        'css/readers-theater.css',
        'css/nasheed-studio.css',
        'css/story-studio.css',
        'css/student-profiles.css',
        'css/dark-mode.css'
    ]

    css_combined = []
    for cfile in css_files:
        cpath = os.path.join(BASE_DIR, cfile)
        if os.path.exists(cpath):
            with open(cpath, 'r', encoding='utf-8') as f:
                ccontent = f.read()
            if cfile == 'css/fonts.css':
                def embed_font_woff2(m):
                    font_fname = m.group(1)
                    fpath = os.path.join(BASE_DIR, 'fonts', font_fname)
                    if os.path.exists(fpath):
                        with open(fpath, 'rb') as ff:
                            fb64 = base64.b64encode(ff.read()).decode('utf-8')
                        return f"url('data:font/woff2;base64,{fb64}')"
                    return m.group(0)
                ccontent = re.sub(r"url\(['\"]?\.\./fonts/([a-zA-Z0-9_\-\.]+\.woff2)['\"]?\)", embed_font_woff2, ccontent)
            css_combined.append(f"/* === {cfile} === */\n" + ccontent)
        else:
            print(f"⚠️ تنبيه: ملف CSS مفقود: {cfile}")

    inlined_css_str = (
        "<style>\n"
        "/* ==========================================================================\n"
        " * الحزمة المجمعة للتنسيقات وأنماط التصميم - منصة قراءتي التفاعلية الذكية\n"
        " * إعداد وتطوير: المهندس أسامة خليل هاشم\n"
        " * ========================================================================== */\n"
        + "\n\n".join(css_combined) +
        "\n</style>"
    )

    # استبدال استدعاءات CSS وروابط preload الخاصة بالخطوط في index.html
    html = re.sub(r'<link\s+rel="preload"\s+href="fonts/[^"]+"\s+[^>]*>\s*', '', html)
    css_link_pattern = r'<link\s+rel="stylesheet"\s+href="css/[^"]+"\s*>\s*'
    html = re.sub(css_link_pattern, '', html)
    # وضع وسم style المدمج قبل </head>
    html = html.replace('</head>', f"{inlined_css_str}\n</head>")
    print("✔ تم دمج كافة ملفات التنسيق وخط Tajawal WOFF2 بنجاح داخل وسم <style>.")

    # 4. دمج وترميز ملف manifest.json
    print("\n[3/7] جارٍ دمج ملف manifest.json كـ Data URI...")
    manifest_path = os.path.join(BASE_DIR, 'manifest.json')
    if os.path.exists(manifest_path):
        with open(manifest_path, 'r', encoding='utf-8') as f:
            manifest_txt = f.read()
        for ifname, ib64 in raw_image_data.items():
            manifest_txt = manifest_txt.replace(f'"{ifname}"', f'"{ib64}"')
        manifest_b64 = base64.b64encode(manifest_txt.encode('utf-8')).decode('utf-8')
        manifest_data_uri = f"data:application/manifest+json;base64,{manifest_b64}"
        html = re.sub(r'<link\s+rel="manifest"\s+href=["\'](?:\./)?manifest\.json["\']\s*>',
                      f'<link rel="manifest" href="{manifest_data_uri}">', html)

    # دمج apple-touch-icon
    if 'icons/icon-192.png' in raw_image_data:
        html = re.sub(r'<link\s+rel="apple-touch-icon"\s+href=["\'](?:\./)?icons/icon-192\.png["\']\s*>',
                      f'<link rel="apple-touch-icon" href="{raw_image_data["icons/icon-192.png"]}">', html)
    print("✔ تم دمج بيانات manifest.json و apple-touch-icon.")

    # 5. دمج الأصوات والتسجيلات الفونيمية مباشرة من audio/*.mp3 مع حفظ المفاتيح التراثية
    print("\n[4/7] جارٍ دمج قواعد الصوتيات الفونيمية المحدثة (AUDIO_DATA) 100%...")
    audio_path1 = os.path.join(BASE_DIR, 'audio_data.js')
    audio_path2 = os.path.join(BASE_DIR, 'audio_data_unit6.js')

    merged_audio_data = {}
    legacy_pattern = re.compile(r'"([a-zA-Z0-9_\-]+)"\s*:\s*"(data:audio/[^"]+)"')
    for apath in (audio_path1, audio_path2):
        if os.path.exists(apath):
            with open(apath, 'r', encoding='utf-8') as f:
                for k, v in legacy_pattern.findall(f.read()):
                    merged_audio_data[k] = v

    existing_audio_keys = set(merged_audio_data.keys())
    audio_dir = os.path.join(BASE_DIR, 'audio')
    audio_files_disk = sorted([f for f in os.listdir(audio_dir) if f.endswith('.mp3')])
    print(f"✔ إجمالي الملفات الصوتية المحدثة على القرص في audio/: {len(audio_files_disk)} ملف mp3.")

    supplemental_audio_dict = {}
    for mf in audio_files_disk:
        mkey = mf[:-4]
        mpath = os.path.join(audio_dir, mf)
        b64_audio = file_to_base64_audio(mpath)
        if mkey not in existing_audio_keys:
            supplemental_audio_dict[mkey] = b64_audio
        merged_audio_data[mkey] = b64_audio

    print(f"✔ تم تحديث وترميز {len(merged_audio_data)} مفتاحاً صوتياً (منها {len(audio_files_disk)} ملف MP3 حديث من القرص).")
    merged_audio_json = json.dumps(merged_audio_data, ensure_ascii=False)
    inlined_audio_block = (
        "<script>\n"
        "/* FULL FRESH AUDIO DATA (DISK + LEGACY KEYS) - إعداد المهندس أسامة خليل هاشم */\n"
        f"window.AUDIO_DATA = {merged_audio_json};\n"
        "</script>\n"
    )

    # استبدال وسوم audio_data.js و audio_data_unit6.js
    html = re.sub(r'<script\s+(?:defer\s+)?src=["\'](?:\./)?audio_data\.js["\']\s*></script>', '', html)
    html = re.sub(r'<script\s+(?:defer\s+)?src=["\'](?:\./)?audio_data_unit6\.js["\']\s*></script>', '', html)

    # 6. دمج فهرس المنهج curriculum_data.js وترميز صوره
    print("\n[5/7] جارٍ دمج فهرس المنهج curriculum_data.js...")
    curriculum_path = os.path.join(BASE_DIR, 'curriculum_data.js')
    with open(curriculum_path, 'r', encoding='utf-8') as f:
        curriculum_js = f.read()

    # استبدال الصور داخل curriculum_data.js
    def replace_curr_img(m):
        q1 = m.group(1)
        img_basename = os.path.basename(m.group(2))
        q2 = m.group(3)
        if img_basename in raw_image_data:
            return f"{q1}{raw_image_data[img_basename]}{q2}"
        return m.group(0)

    curriculum_js = re.sub(r'(["\'])(?:\./)?([a-zA-Z0-9_\-\/]+\.png)(["\'])', replace_curr_img, curriculum_js)
    inlined_curriculum = f"<script>\n/* CURRICULUM DATA INLINED - إعداد المهندس أسامة خليل هاشم */\n{curriculum_js}\n</script>"
    html = re.sub(r'<script\s+(?:defer\s+)?src=["\'](?:\./)?curriculum_data\.js["\']\s*></script>', '', html)

    # 7. دمج كافة وحدات الجافاسكربت المعيارية (Modular JS)
    print("\n[6/7] جارٍ دمج وحدات JavaScript المعيارية الـ 28 بالترتيب التكاملي الدقيق...")
    js_modules = [
        'js/core/ai-bridge.js',
        'js/core/theme.js',
        'js/core/modals.js',
        'js/core/audio.js',
        'js/core/view-loader.js',
        'js/core/progress.js',
        'js/core/navigation.js',
        'js/core/evaluation.js',
        'js/core/enrichment.js',
        'js/core/blackboard.js',
        'js/core/games.js',
        'js/core/gamification.js',
        'js/core/teacher-dashboard.js',
        'js/core/classroom-sync.js',
        'js/core/classroom-quiz.js',
        'js/core/interactive-guide.js',
        'js/core/diagnostic-exams.js',
        'js/core/voice-coach.js',
        'js/core/dictation-lab.js',
        'js/core/readers-theater.js',
        'js/core/nasheed-studio.js',
        'js/core/story-studio.js',
        'js/core/student-profiles.js',
        'js/lessons/prep.js',
        'js/lessons/unit1.js',
        'js/lessons/unit2.js',
        'js/lessons/unit3.js',
        'js/lessons/unit4.js',
        'js/lessons/unit5.js',
        'js/lessons/unit6.js',
        'js/app.js'
    ]

    inlined_js_blocks = []
    for jmod in js_modules:
        jpath = os.path.join(BASE_DIR, jmod)
        if os.path.exists(jpath):
            with open(jpath, 'r', encoding='utf-8') as f:
                jcode = f.read()
            
            # استبدال أي صور مستدعاة داخل ملفات الجافاسكربت
            jcode = re.sub(r'(["\'])(?:\./)?([a-zA-Z0-9_\-\/]+\.png)(["\'])', replace_curr_img, jcode)

            # تعديل تسجيل ServiceWorker ليتجاهل بروتوكول file:// بأمان
            if jmod == 'js/core/modals.js':
                jcode = jcode.replace(
                    "if ('serviceWorker' in navigator) {",
                    "if ('serviceWorker' in navigator && (window.location.protocol === 'http:' || window.location.protocol === 'https:')) {"
                )

            inlined_js_blocks.append(f"<script>\n/* === {jmod} - إعداد المهندس أسامة خليل هاشم === */\n{jcode}\n</script>")
            # إزالة استدعاء السكربت القديم (يدعم defer الاختيارية)
            pat = rf'<script\s+(?:defer\s+)?src=["\'](?:\./)?{re.escape(jmod)}["\']\s*></script>'
            html = re.sub(pat, '', html)
        else:
            print(f"⚠️ تنبيه: ملف JS مفقود: {jmod}")

    # بناء كائن IMAGE_DATA العام لحقنه في بداية السكربتات
    image_data_json = json.dumps(raw_image_data, ensure_ascii=False)
    image_data_script = f"<script>\n/* GLOBAL IMAGE DATA MAP (OFFLINE 100%) - إعداد المهندس أسامة خليل هاشم */\nwindow.IMAGE_DATA = {image_data_json};\n</script>\n"

    all_scripts_bundle = (
        image_data_script + "\n" +
        inlined_audio_block + "\n" +
        inlined_curriculum + "\n" +
        "\n".join(inlined_js_blocks)
    )

    # وضع حزمة السكربتات الكاملة قبل إغلاق </body>
    html = html.replace('</body>', f"{all_scripts_bundle}\n</body>")

    # 8. استبدال كافة مسارات الصور في قوالب واجهات HTML (DOM Template Image Replacement)
    print("\n[7/7] جارٍ استبدال مسارات الصور داخل HTML ببيانات Base64 Data-URI...")
    def replace_html_img(m):
        prefix = m.group(1)
        img_name = os.path.basename(m.group(2))
        suffix = m.group(3)
        if img_name in raw_image_data:
            return f"{prefix}{raw_image_data[img_name]}{suffix}"
        return m.group(0)

    html_img_pattern = re.compile(r'(src=["\']|href=["\']|openBookPageModal\(["\'])(?:\./)?([a-zA-Z0-9_\-\/]+\.png)(["\'])')
    html = html_img_pattern.sub(replace_html_img, html)

    # فحص ختامي لضمان عدم وجود روابط صور مكسورة أو غير مدمجة
    unembedded = re.findall(r'src=["\']([^"\']+\.png)["\']', html)
    unembedded_clean = [img for img in unembedded if not img.startswith('data:')]
    if unembedded_clean:
        print(f"⚠️ تحذير: توجد {len(unembedded_clean)} صورة لم يتم دمجها: {unembedded_clean[:5]}")
    else:
        print("✔ تم التحقق: 100% من كافة الصور والأيقونات مدمجة بصيغة Data-URI خالية من أي روابط خارجية.")

    # 9. حفظ الحزمة المستقلة الشاملة (خط Tajawal مضمن محلياً بالكامل كـ Base64 WOFF2)
    print("\n💾 جارٍ كتابة ملف الحزمة الأحادية المستقلة الشاملة...")
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(html)

    size_bytes = os.path.getsize(out_path)
    size_mb = size_bytes / (1024 * 1024)
    t_end = time.time()
    elapsed = t_end - t_start

    print("=" * 75)
    print("✨ تم بنجاح تام بناء وتوليد الحزمة الأحادية المستقلة الشاملة!")
    print(f"   اسم الملف: {os.path.basename(out_path)}")
    print(f"   المسار الكامل: {out_path}")
    print(f"   الحجم النهائي: {size_mb:.2f} ميجابايت ({size_bytes:,} بايت)")
    print(f"   إجمالي الأصوات المدمجة: {len(merged_audio_data)} تسجيلاً صوتياً (100% المنهج والألعاب)")
    print(f"   إجمالي الصور المدمجة: {len(raw_image_data)} صورة وأيقونة")
    print(f"   زمن المعالجة والبناء: {elapsed:.2f} ثانية")
    print("=" * 75)
    print("✔ الحزمة جاهزة للتشغيل الفوري بنقرة واحدة (أوفلاين 100%) على:")
    print("   1. شاشات العرض الذكية والسبورات التفاعلية المدرسية (Interactive Whiteboards)")
    print("   2. الحواسيب المحمولة والمكتبية (Windows / macOS / Linux)")
    print("   3. الهواتف الذكية والأجهزة اللوحية (Android / iPad / iPhone) دون خادم أو شبكة")
    print("=" * 75)

if __name__ == '__main__':
    build_standalone()
