#!/usr/bin/env python3
"""
أداة بناء وتوليد حزمة التثبيت المستقلة لنظام ويندوز والشاشات الذكية (Qiraati_Smart_Setup.exe)
لمنصة قراءتي التفاعلية الذكية - الصف الأول الابتدائي
إعداد وتطوير: المهندس أسامة خليل هاشم

تقوم هذه الأداة بـ:
1. بناء وتحديث index.html من قوالب views/
2. توليد الأيقونة متعددة المقاسات icons/qiraati.ico (256x256 حتى 16x16)
3. التحقق من وجود الحزمة الأحادية قراءتي_التفاعلية_الذكية.html أو بنائها
4. تصريف مشغل المنصة المكتبي المستقل Qiraati_Smart.exe عبر csc.exe
5. تصريف برنامج إلغاء التثبيت Uninstall.exe عبر csc.exe
6. تجميع كافة أصول المنصة والوسائط في حزمة مضغوطة app_bundle.zip
7. تصريف معالج التثبيت الرسومي الذكي Qiraati_Smart_Setup.exe مع الحزمة المدمجة
8. إجراء الفحص والاختبار الذاتي --self-test بنجاح 100%
9. إنشاء ملف البصمة الرقمية SHA-256 ودليل التثبيت الشامل للشاشات الذكية
"""

import os
import sys
import time
import shutil
import zipfile
import hashlib
import subprocess
from PIL import Image

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSC_PATH = r"C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe"
DIST_DIR = os.path.join(BASE_DIR, "dist", "Qiraati_Smart_Windows_v3.37")
TEMP_DIR = os.path.join(BASE_DIR, "temp_build")

def ensure_ico():
    ico_path = os.path.join(BASE_DIR, "icons", "qiraati.ico")
    png_path = os.path.join(BASE_DIR, "icons", "icon-512.png")
    if not os.path.exists(ico_path) or os.path.getmtime(png_path) > os.path.getmtime(ico_path):
        print("🎨 جارٍ توليد الأيقونة الرسمية متعددة المقاسات icons/qiraati.ico...")
        im = Image.open(png_path)
        sizes = [(256, 256), (128, 128), (64, 64), (48, 48), (32, 32), (24, 24), (16, 16)]
        im.save(ico_path, format="ICO", sizes=sizes)
        print("✔ تم إنشاء الأيقونة بنجاح.")
    return ico_path

def compute_sha256(filepath):
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest().lower()

def build_windows_package():
    t_start = time.time()
    print("=" * 80)
    print("🚀 بدء بناء وتوليد حزمة التثبيت المكتبي والشاشات الذكية لويندوز")
    print("   منصة قراءتي التفاعلية الذكية - الصف الأول الابتدائي")
    print("   إعداد وتطوير: المهندس أسامة خليل هاشم")
    print("=" * 80)

    # 1. التأكد من وجود csc.exe
    if not os.path.exists(CSC_PATH):
        print(f"❌ خطأ: لم يتم العثور على مترجم C# في: {CSC_PATH}")
        sys.exit(1)

    # 2. بناء وتحديث index.html أولاً
    print("\n[1/8] تحديث وبناء index.html...")
    sys.path.insert(0, os.path.join(BASE_DIR, "tools"))
    import build
    build.build_index()

    # 3. التأكد من الأيقونة
    print("\n[2/8] التحقق من الأيقونة الرسمية...")
    ico_path = ensure_ico()

    # 4. إعداد مجلدات البناء
    os.makedirs(DIST_DIR, exist_ok=True)
    os.makedirs(TEMP_DIR, exist_ok=True)

    metadata_cs = os.path.join(BASE_DIR, "tools", "windows_src", "AssemblyMetadata.cs")
    launcher_cs = os.path.join(BASE_DIR, "tools", "windows_src", "Launcher.cs")
    uninstaller_cs = os.path.join(BASE_DIR, "tools", "windows_src", "Uninstaller.cs")
    setup_cs = os.path.join(BASE_DIR, "tools", "windows_src", "SetupWizard.cs")

    launcher_exe = os.path.join(TEMP_DIR, "Qiraati_Smart.exe")
    uninstaller_exe = os.path.join(TEMP_DIR, "Uninstall.exe")

    # 5. تصريف المشغل المكتبي Qiraati_Smart.exe
    print("\n[3/8] تصريف مشغل المنصة المكتبي المستقل Qiraati_Smart.exe...")
    cmd_launcher = [
        CSC_PATH,
        "/nologo",
        "/target:winexe",
        "/platform:anycpu",
        "/optimize+",
        "/codepage:65001",
        f"/win32icon:{ico_path}",
        "/reference:System.Windows.Forms.dll",
        "/reference:System.Drawing.dll",
        "/reference:System.dll",
        f"/out:{launcher_exe}",
        metadata_cs,
        launcher_cs
    ]
    res = subprocess.run(cmd_launcher, capture_output=True, text=True, encoding="utf-8")
    if res.returncode != 0:
        print(f"❌ فشل تصريف المشغل Launcher:\n{res.stderr}\n{res.stdout}")
        sys.exit(1)
    print("✔ تم تصريف Qiraati_Smart.exe بنجاح.")

    # 6. تصريف برنامج إلغاء التثبيت Uninstall.exe
    print("\n[4/8] تصريف برنامج إلغاء التثبيت Uninstall.exe...")
    cmd_uninst = [
        CSC_PATH,
        "/nologo",
        "/target:winexe",
        "/platform:anycpu",
        "/optimize+",
        "/codepage:65001",
        f"/win32icon:{ico_path}",
        "/reference:System.Windows.Forms.dll",
        "/reference:System.dll",
        f"/out:{uninstaller_exe}",
        metadata_cs,
        uninstaller_cs
    ]
    res = subprocess.run(cmd_uninst, capture_output=True, text=True, encoding="utf-8")
    if res.returncode != 0:
        print(f"❌ فشل تصريف برنامج إلغاء التثبيت:\n{res.stderr}\n{res.stdout}")
        sys.exit(1)
    print("✔ تم تصريف Uninstall.exe بنجاح.")

    # 7. تجميع حزمة ملفات التطبيق في app_bundle.zip
    print("\n[5/8] حزم وضغط كافة ملفات المنصة والوسائط في app_bundle.zip...")
    bundle_zip = os.path.join(TEMP_DIR, "app_bundle.zip")
    
    files_to_bundle = [
        "index.html",
        "manifest.json",
        "sw.js",
        "audio_data.js",
        "audio_data_unit6.js",
        "curriculum_data.js",
        "README.md",
        "mobile_qr.png",
        "تشغيل_التطبيق_PWA.bat"
    ]

    with zipfile.ZipFile(bundle_zip, "w", zipfile.ZIP_DEFLATED, compresslevel=6) as zf:
        # إضافة الملفات التنفيذية الناتجة
        zf.write(launcher_exe, "Qiraati_Smart.exe")
        zf.write(uninstaller_exe, "Uninstall.exe")

        # إضافة الملفات الأساسية
        for fn in files_to_bundle:
            fp = os.path.join(BASE_DIR, fn)
            if os.path.exists(fp):
                zf.write(fp, fn)

        # إضافة كافة صور PNG (413 صورة)
        for fn in os.listdir(BASE_DIR):
            if fn.endswith(".png"):
                zf.write(os.path.join(BASE_DIR, fn), fn)

        # إضافة المجلدات
        for folder in ["css", "js", "icons", "audio"]:
            folder_path = os.path.join(BASE_DIR, folder)
            if os.path.exists(folder_path):
                for root, dirs, files in os.walk(folder_path):
                    for file in files:
                        full_f = os.path.join(root, file)
                        rel_f = os.path.relpath(full_f, BASE_DIR)
                        zf.write(full_f, rel_f)

    bundle_size_mb = os.path.getsize(bundle_zip) / (1024 * 1024)
    print(f"✔ تم إنشاء حزمة app_bundle.zip بنجاح! الحجم: {bundle_size_mb:.2f} ميجابايت.")

    # 8. تصريف معالج التثبيت الرسومي Qiraati_Smart_Setup.exe مدمجاً به الحزمة
    print("\n[6/8] تصريف معالج التثبيت الرسومي المستقل Qiraati_Smart_Setup.exe...")
    setup_exe = os.path.join(DIST_DIR, "Qiraati_Smart_Setup.exe")
    
    cmd_setup = [
        CSC_PATH,
        "/nologo",
        "/target:winexe",
        "/platform:anycpu",
        "/optimize+",
        "/codepage:65001",
        f"/win32icon:{ico_path}",
        "/reference:System.Windows.Forms.dll",
        "/reference:System.Drawing.dll",
        "/reference:System.IO.Compression.dll",
        "/reference:System.IO.Compression.FileSystem.dll",
        "/reference:System.dll",
        f"/resource:{bundle_zip},app_bundle.zip",
        f"/out:{setup_exe}",
        metadata_cs,
        setup_cs
    ]
    res = subprocess.run(cmd_setup, capture_output=True, text=True, encoding="utf-8")
    if res.returncode != 0:
        print(f"❌ فشل تصريف معالج التثبيت Setup:\n{res.stderr}\n{res.stdout}")
        sys.exit(1)

    setup_size_mb = os.path.getsize(setup_exe) / (1024 * 1024)
    print(f"✔ تم تصريف Qiraati_Smart_Setup.exe بنجاح! الحجم: {setup_size_mb:.2f} ميجابايت.")

    # 9. إجراء الاختبارات الذاتية
    print("\n[7/8] تشغيل الاختبارات الذاتية والتحقق من سلامة الحزمة...")
    
    # فحص المشغل
    res_l = subprocess.run([launcher_exe, "--self-test"], capture_output=True, text=True)
    if res_l.returncode != 0:
        print(f"❌ فشل الفحص الذاتي لـ Qiraati_Smart.exe")
        sys.exit(1)
    print("✔ نجح الفحص الذاتي لمشغل المنصة Qiraati_Smart.exe.")

    # فحص برنامج إلغاء التثبيت
    res_u = subprocess.run([uninstaller_exe, "--self-test"], capture_output=True, text=True)
    if res_u.returncode != 0:
        print(f"❌ فشل الفحص الذاتي لـ Uninstall.exe")
        sys.exit(1)
    print("✔ نجح الفحص الذاتي لبرنامج إلغاء التثبيت Uninstall.exe.")

    # فحص معالج التثبيت والحزمة المدمجة
    res_s = subprocess.run([setup_exe, "--self-test"], capture_output=True, text=True)
    if res_s.returncode != 0:
        print(f"❌ فشل الفحص الذاتي لـ Qiraati_Smart_Setup.exe:\n{res_s.stderr}")
        sys.exit(1)
    print("✔ نجح الفحص الذاتي لمعالج التثبيت Qiraati_Smart_Setup.exe وتكامل الحزمة المدمجة.")

    # 10. نسخ الحزمة الأحادية قراءتي_التفاعلية_الذكية.html إلى dist
    standalone_html = os.path.join(BASE_DIR, "قراءتي_التفاعلية_الذكية.html")
    if os.path.exists(standalone_html):
        print("\n[8/8] نسخ الحزمة الأحادية المستقلة الشاملة إلى مجلد التوزيع...")
        shutil.copy2(standalone_html, os.path.join(DIST_DIR, "قراءتي_التفاعلية_الذكية.html"))
        print("✔ تم نسخ قراءتي_التفاعلية_الذكية.html (صيغة الفلاش ميموري والشاشات المباشرة).")

    # إنشاء ملف البصمة الرقمية SHA-256
    setup_hash = compute_sha256(setup_exe)
    sha_file = setup_exe + ".sha256"
    with open(sha_file, "w", encoding="ascii") as f:
        f.write(f"{setup_hash}  {os.path.basename(setup_exe)}\n")
    print(f"✔ تم توليد ملف البصمة الرقمية SHA-256: {setup_hash}")

    # كتابة ملف تشغيل سريع بدون تثبيت (Batch runner)
    run_bat = os.path.join(DIST_DIR, "تشغيل_سريع_بدون_تثبيت.bat")
    with open(run_bat, "w", encoding="utf-8") as f:
        f.write('@echo off\n')
        f.write('chcp 65001 >nul\n')
        f.write('title منصة قراءتي التفاعلية الذكية - تشغيل سريع أوفلاين\n')
        f.write('echo ==========================================================================\n')
        f.write('echo    منصة قراءتي التفاعلية الذكية - الصف الأول الابتدائي (تشغيل فوري)\n')
        f.write('echo    إعداد وتطوير: المهندس أسامة خليل هاشم\n')
        f.write('echo ==========================================================================\n')
        f.write('echo.\n')
        f.write('echo جاري فتح المنصة التفاعلية الشاملة مباشرة في متصفحك...\n')
        f.write('start "" "قراءتي_التفاعلية_الذكية.html"\n')
        f.write('exit\n')

    # كتابة دليل التثبيت والاستخدام المكتبي والشاشات الذكية
    manual_path = os.path.join(DIST_DIR, "دليل_التثبيت_والتشغيل_المكتبي_والشاشات_الذكية.md")
    manual_content = f"""# دليل التثبيت المكتبي والشاشات الذكية أوفلاين • منصة قراءتي التفاعلية الذكية
**الصف الأول الابتدائي • المنهج العراقي التفاعلي الشامل**  
**إعداد وتطوير:** **المهندس أسامة خليل هاشم**  
**الإصدار:** `v3.37.0` (تحديث كاش الخدمة: `qiraati-smart-v60`)  
**البصمة الرقمية لمعالج التثبيت (SHA-256):**  
`{setup_hash}`

---

## 🌟 نبذة عن حزمة التثبيت
حزمة التثبيت المكتبي والشاشات الذكية أوفلاين هي تطبيق تنفيذي مخصص لنظام **ويندوز (Windows 11 / 10 / 8.1 / 7)**، تم تطويره خصيصاً للعمل في:
1. **الصفوف المدرسية والقاعات التعليمية:** على الشاشات الذكية التفاعلية (Interactive Smart Screens) والسبورات البيضاء الذكية (Smart Whiteboards).
2. **مختبرات الحواسيب المدرسية:** على أجهزة الحواسيب المكتبية والمحمولة دون اشتراط اتصال بالإنترنت.
3. **منازل التلاميذ وأولياء الأمور:** لتوفير بيئة تعليمية هادفة وآمنة 100% تعمل دون إنترنت (Offline).

---

## 🚀 محتويات الحزمة
* **`Qiraati_Smart_Setup.exe`**: معالج التثبيت الرسومي الذكي (Setup Wizard) باللغة العربية مع دعم التثبيت الصامت (`/S`).
* **`Qiraati_Smart.exe`**: المشغل المكتبي بنافذة تطبيق مستقلة وخادم محلي مدمج فائق السرعة وأيقونة صينية المهام (Tray).
* **`Uninstall.exe`**: أداة إلغاء التثبيت النظيفة من ويندوز.
* **`قراءتي_التفاعلية_الذكية.html`**: النسخة الأحادية المستقلة الشاملة الجاهزة للتشغيل المباشر من الفلاش ميموري (USB) بنقرة واحدة.
* **`تشغيل_سريع_بدون_تثبيت.bat`**: ملف تشغيل فوري بنقرة واحدة دون الحاجة للتثبيت.

---

## 💻 طريقة التثبيت والاستخدام

### الطريقة الأولى: التثبيت المكتبي التلقائي (موصى بها)
1. انقر نقراً مزدوجاً على ملف **`Qiraati_Smart_Setup.exe`**.
2. ستظهر لك واجهة معالج التثبيت باللغة العربية، اضغط **«التالي»**.
3. اختر مسار التثبيت المطلوب (افتراضياً في مجلد البرامج المحلي للمستخدم دون الحاجة لصلاحيات مدير النظام).
4. حدد خيارات إنشاء الاختصارات (سطح المكتب وقائمة ابدأ)، ثم اضغط **«تثبيت»**.
5. سيبدأ استخراج الملفات خلال ثوانٍ معدودة؛ وفور الانتهاء سيتم إنشاء اختصار رسمي على سطح المكتب باسم:  
   **«منصة قراءتي التفاعلية الذكية»**  
   وفتح المنصة تلقائياً في نافذة عرض مستقلة كاملة.

### الطريقة الثانية: التثبيت الصامت لمديري الأنظمة والمدارس (Silent Deployment)
لتثبيت المنصة دفعة واحدة على حواسيب المختبر المدرسي عبر الشبكة أو أوامر CMD/PowerShell:
```cmd
Qiraati_Smart_Setup.exe /S
```
يقوم هذا الأمر بتثبيت المنصة في المسار الافتراضي، وإنشاء اختصارات سطح المكتب وقائمة ابدأ، وتسجيل البرنامج في نظام ويندوز بهدوء تام.

### الطريقة الثالثة: التشغيل المباشر من الفلاش ميموري (USB Portable)
يمكن للمعلم نسخ ملف **`قراءتي_التفاعلية_الذكية.html`** إلى أي وحدة تخزين فلاشية (USB)، وتشغيله على أي شاشة ذكية أو حاسوب بنقرة واحدة دون الحاجة لتثبيت أي برامج إضافية.

---

## 📱 ميزة مشاركة المنصة عبر WiFi للتابلت والهواتف
عند تشغيل **`Qiraati_Smart.exe`** على حاسوب الصف أو الشاشة الذكية:
1. انقر بالزر الأيمن على أيقونة المنصة في شريط المهام بجانب الساعة.
2. اختر **«📱 مشاركة الرابط مع الشاشات والتابلت (WiFi)»**.
3. سيظهر عنوان IP المحلي (مثال: `http://192.168.1.50:8088/`).
4. يمكن لجميع تلاميذ الصف وأجهزتهم اللوحية المتصلة بنفس شبكة راوتر الصف فتح المنصة والمشاركة التفاعلية بنقرة واحدة!

---

## 🛡️ إلغاء التثبيت
يمكن إلغاء تثبيت المنصة في أي وقت عبر:
* الذهاب إلى: **إعدادات ويندوز ➔ التطبيقات والميزات (Apps & Features)** ➔ اختيار **«منصة قراءتي التفاعلية الذكية»** ➔ **«إلغاء التثبيت»**.
* أو النقر على اختصار **«إلغاء تثبيت منصة قراءتي»** في قائمة ابدأ.

---
**منصة قراءتي التفاعلية الذكية • إعداد وتطوير: المهندس أسامة خليل هاشم**
"""
    with open(manual_path, "w", encoding="utf-8") as f:
        f.write(manual_content)
    print("✔ تم إنشاء دليل التثبيت والتشغيل المكتبي والشاشات الذكية بنجاح.")

    # تنظيف مجلد البناء المؤقت
    try:
        shutil.rmtree(TEMP_DIR)
        print("✔ تم تنظيف مجلد البناء المؤقت.")
    except Exception:
        pass

    t_end = time.time()
    elapsed = t_end - t_start

    print("\n" + "=" * 80)
    print("✨ تم بنجاح تام بناء وتجهيز حزمة التثبيت المكتبي والشاشات الذكية لويندوز!")
    print(f"   الملف التنفيذي لمعالج التثبيت: {os.path.basename(setup_exe)}")
    print(f"   المسار: {setup_exe}")
    print(f"   الحجم النهائي: {setup_size_mb:.2f} ميجابايت")
    print(f"   البصمة الرقمية SHA-256: {setup_hash}")
    print(f"   زمن البناء والإنجاز: {elapsed:.2f} ثانية")
    print("=" * 80)

if __name__ == "__main__":
    build_windows_package()
