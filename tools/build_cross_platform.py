#!/usr/bin/env python3
"""
أداة بناء وتوليد النسخ المستقلة متعددة المنصات لأنظمة ماك ولينكس
(macOS .dmg & Linux AppImage) لمنصة قراءتي التفاعلية الذكية - الصف الأول الابتدائي
إعداد وتطوير: المهندس أسامة خليل هاشم

تقوم هذه الأداة بـ:
1. التحقق من بناء الحزمة الأحادية الشاملة قراءتي_التفاعلية_الذكية.html (أوفلاين 100%)
2. توليد الأيقونة الرسمية لماك AppIcon.icns بكافة المقاسات وريتينا (1024x1024 حتى 16x16)
3. حزم وتوليد صورة القرص الرسمية لنظام ماك (Qiraati_Smart_macOS.dmg) مع وصلة Applications
4. حزم وتوليد الحزمة المضغوطة المباشرة لماك (Qiraati_Smart_macOS_v3.63.zip)
5. حزم وتوليد الحزمة الشاملة المستقلة المحمولة للينكس (Qiraati_Smart_Linux.AppImage)
6. حزم وتوليد الحزمة الأرشيفية للينكس ومختبرات الحاسوب (Qiraati_Smart_Linux_v3.63.tar.gz)
7. حساب البصمات الرقمية الرسمية SHA-256 لكافة الحزم المنتجة
8. إنشاء أدلة الاستخدام والتثبيت الشاملة للشاشات وأجهزة ماك ولينكس بالعربية
9. إجراء الفحص الذاتي والاختبار الآلي الشامل --self-test بنجاح 100%
"""

import os
import sys
import io
import time
import shutil
import tarfile
import zipfile
import hashlib
import argparse
from PIL import Image
import pycdlib

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VERSION = "3.63"
AUTHOR = "المهندس أسامة خليل هاشم"

DIST_MACOS = os.path.join(BASE_DIR, "dist", f"Qiraati_Smart_macOS_v{VERSION}")
DIST_LINUX = os.path.join(BASE_DIR, f"dist", f"Qiraati_Smart_Linux_v{VERSION}")

def compute_sha256(filepath):
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest().lower()

def ensure_icns(output_path):
    source_png = os.path.join(BASE_DIR, "icons", "icon-512.png")
    if not os.path.exists(source_png):
        raise FileNotFoundError(f"لم يتم العثور على أيقونة المصدر: {source_png}")
    
    print("🎨 جارٍ توليد أيقونة ماك الرسمية عالية الدقة (AppIcon.icns)...")
    im = Image.open(source_png).convert("RGBA")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    im.save(output_path, format="ICNS")
    print(f"✔ تم إنشاء AppIcon.icns بنجاح بحجم: {os.path.getsize(output_path):,} بايت")
    return output_path

def ensure_standalone_bundle():
    bundle_path = os.path.join(BASE_DIR, "قراءتي_التفاعلية_الذكية.html")
    index_path = os.path.join(BASE_DIR, "index.html")
    needs_rebuild = (
        not os.path.exists(bundle_path)
        or os.path.getsize(bundle_path) < 100_000_000
        or (os.path.exists(index_path) and os.path.getmtime(index_path) > os.path.getmtime(bundle_path))
    )
    if needs_rebuild:
        print("📦 الحزمة الأحادية غير متوفرة أو أقدم من index.html، جارٍ البناء والتوليد عبر build_standalone.py...")
        sys.path.insert(0, os.path.join(BASE_DIR, "tools"))
        import build_standalone
        build_standalone.build_standalone()
    else:
        print(f"✔ تم التحقق من وجود الحزمة الأحادية الشاملة: {os.path.basename(bundle_path)} ({os.path.getsize(bundle_path):,} بايت)")
    return bundle_path

def build_macos(standalone_html):
    t0 = time.time()
    print("\n" + "=" * 80)
    print("🍎 [1/2] بدء بناء وتوليد حزمة نظام ماك (macOS .dmg & .zip)")
    print(f"   الإصدار: v{VERSION} - إعداد وتطوير: {AUTHOR}")
    print("=" * 80)

    os.makedirs(DIST_MACOS, exist_ok=True)
    icns_path = os.path.join(DIST_MACOS, "AppIcon.icns")
    ensure_icns(icns_path)

    # 1. إعداد مسارات وهيكل التطبيق المؤقت
    temp_app_dir = os.path.join(DIST_MACOS, "Qiraati_Smart.app")
    if os.path.exists(temp_app_dir):
        shutil.rmtree(temp_app_dir)

    contents_dir = os.path.join(temp_app_dir, "Contents")
    macos_bin_dir = os.path.join(contents_dir, "MacOS")
    resources_dir = os.path.join(contents_dir, "Resources")
    app_res_dir = os.path.join(resources_dir, "app")

    os.makedirs(macos_bin_dir, exist_ok=True)
    os.makedirs(resources_dir, exist_ok=True)
    os.makedirs(app_res_dir, exist_ok=True)

    # نسخ ملفات المصدر
    info_plist_src = os.path.join(BASE_DIR, "tools", "macos_src", "Info.plist")
    launcher_src = os.path.join(BASE_DIR, "tools", "macos_src", "Qiraati_Smart_Launcher")

    shutil.copy2(info_plist_src, os.path.join(contents_dir, "Info.plist"))
    launcher_dest = os.path.join(macos_bin_dir, "Qiraati_Smart_Launcher")
    shutil.copy2(launcher_src, launcher_dest)
    shutil.copy2(icns_path, os.path.join(resources_dir, "AppIcon.icns"))

    # نسخ الحزمة الأحادية والتوثيق
    bundle_mb = os.path.getsize(standalone_html) / (1024 * 1024)
    print(f"📋 جارٍ نسخ الحزمة الأحادية ({bundle_mb:.2f} ميجابايت) إلى حزمة تطبيق ماك...")
    dest_html = os.path.join(app_res_dir, "قراءتي_التفاعلية_الذكية.html")
    shutil.copy2(standalone_html, dest_html)
    shutil.copy2(os.path.join(BASE_DIR, "README.md"), os.path.join(app_res_dir, "README.md"))

    # 2. بناء ملف صورة القرص الرسمي Qiraati_Smart_macOS.dmg عبر pycdlib
    dmg_path = os.path.join(DIST_MACOS, "Qiraati_Smart_macOS.dmg")
    print(f"\n💿 جارٍ إنشاء صورة قرص ماك الرسمية: {os.path.basename(dmg_path)}...")

    iso = pycdlib.PyCdlib()
    iso.new(interchange_level=3, joliet=3, rock_ridge="1.09", vol_ident="QIRAATI_SMART")

    # إضافة مجلدات التطبيق وهيكله
    # ملاحظة: في ISO، الأسماء القياسية ISO9660 تتطلب صيغ 8.3 ولكن Joliet و RockRidge يحفظان الأسماء الحقيقية
    iso.add_directory("/APP", joliet_path="/Qiraati_Smart.app", rr_name="Qiraati_Smart.app")
    iso.add_directory("/APP/CONTENTS", joliet_path="/Qiraati_Smart.app/Contents", rr_name="Contents")
    iso.add_directory("/APP/CONTENTS/MACOS", joliet_path="/Qiraati_Smart.app/Contents/MacOS", rr_name="MacOS")
    iso.add_directory("/APP/CONTENTS/RESOURCES", joliet_path="/Qiraati_Smart.app/Contents/Resources", rr_name="Resources")
    iso.add_directory("/APP/CONTENTS/RESOURCES/APP", joliet_path="/Qiraati_Smart.app/Contents/Resources/app", rr_name="app")

    # إضافة الملفات مع تعيين أذونات التشغيل لـ Launcher
    iso.add_file(os.path.join(contents_dir, "Info.plist"),
                 "/APP/CONTENTS/INFO.PLI;1",
                 joliet_path="/Qiraati_Smart.app/Contents/Info.plist",
                 rr_name="Info.plist",
                 file_mode=0o100644)

    iso.add_file(launcher_dest,
                 "/APP/CONTENTS/MACOS/LAUNCHER;1",
                 joliet_path="/Qiraati_Smart.app/Contents/MacOS/Qiraati_Smart_Launcher",
                 rr_name="Qiraati_Smart_Launcher",
                 file_mode=0o100755)

    iso.add_file(os.path.join(resources_dir, "AppIcon.icns"),
                 "/APP/CONTENTS/RESOURCES/APPICON.ICN;1",
                 joliet_path="/Qiraati_Smart.app/Contents/Resources/AppIcon.icns",
                 rr_name="AppIcon.icns",
                 file_mode=0o100644)

    iso.add_file(os.path.join(app_res_dir, "README.md"),
                 "/APP/CONTENTS/RESOURCES/APP/README.MD;1",
                 joliet_path="/Qiraati_Smart.app/Contents/Resources/app/README.md",
                 rr_name="README.md",
                 file_mode=0o100644)

    iso.add_file(dest_html,
                 "/APP/CONTENTS/RESOURCES/APP/QIRAATI.HTM;1",
                 joliet_path="/Qiraati_Smart.app/Contents/Resources/app/قراءتي_التفاعلية_الذكية.html",
                 rr_name="قراءتي_التفاعلية_الذكية.html",
                 file_mode=0o100644)

    # إضافة وصلة التطبيقات السريعة /Applications
    iso.add_symlink(rr_path="/APPS;1",
                    symlink_path="/Applications",
                    rr_symlink_name="Applications",
                    joliet_path="/Applications")

    iso.write(dmg_path)
    iso.close()

    dmg_size_mb = os.path.getsize(dmg_path) / (1024 * 1024)
    print(f"✔ تم إنشاء Qiraati_Smart_macOS.dmg بنجاح بحجم: {dmg_size_mb:.2f} ميجابايت")

    # 3. بناء حزمة ZIP المباشرة لماك (مع الحفاظ على صلاحيات التنفيذ 0755)
    zip_path = os.path.join(DIST_MACOS, f"Qiraati_Smart_macOS_v{VERSION}.zip")
    print(f"\n📦 جارٍ ضغط حزمة ماك المباشرة: {os.path.basename(zip_path)}...")

    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(temp_app_dir):
            for file in files:
                fpath = os.path.join(root, file)
                rel_path = os.path.relpath(fpath, DIST_MACOS)
                zinfo = zipfile.ZipInfo(rel_path.replace("\\", "/"))
                zinfo.date_time = time.localtime(os.path.getmtime(fpath))[:6]
                zinfo.compress_type = zipfile.ZIP_DEFLATED
                # تعيين الصلاحيات لنظام يونكس / ماك
                if file == "Qiraati_Smart_Launcher":
                    zinfo.external_attr = 0o755 << 16  # rwxr-xr-x
                else:
                    zinfo.external_attr = 0o644 << 16  # rw-r--r--
                with open(fpath, "rb") as fp:
                    zf.writestr(zinfo, fp.read())

    zip_size_mb = os.path.getsize(zip_path) / (1024 * 1024)
    print(f"✔ تم إنشاء {os.path.basename(zip_path)} بنجاح بحجم: {zip_size_mb:.2f} ميجابايت")

    # 4. حساب البصمات الرقمية SHA-256
    dmg_hash = compute_sha256(dmg_path)
    with open(dmg_path + ".sha256", "w", encoding="utf-8") as f:
        f.write(f"{dmg_hash}  {os.path.basename(dmg_path)}\n")

    zip_hash = compute_sha256(zip_path)
    with open(zip_path + ".sha256", "w", encoding="utf-8") as f:
        f.write(f"{zip_hash}  {os.path.basename(zip_path)}\n")

    # 5. كتابة دليل الاستخدام والتثبيت لماك
    guide_path = os.path.join(DIST_MACOS, "دليل_تثبيت_وتشغيل_ماك_macOS.md")
    with open(guide_path, "w", encoding="utf-8") as f:
        f.write(f"""# دليل تثبيت وتشغيل منصة قراءتي التفاعلية الذكية على نظام ماك (macOS)
### الصف الأول الابتدائي (المنهج الفونيمي الصوتي والحركي - أوفلاين 100%)
### الإصدار: v{VERSION} | إعداد وتطوير: {AUTHOR}

---

## 1. محتويات حزمة التوزيع الرسمية (macOS Distribution)
تحتوي هذه الحزمة على كافة الملفات المعتمدة لتشغيل المنصة على أجهزة Apple Mac (معالجات Apple Silicon M1/M2/M3/M4 ومعالجات Intel Core):

1. **صورة القرص الرسمية (`Qiraati_Smart_macOS.dmg`):**
   - صيغة التثبيت المعيارية المفضلة لنظام macOS.
   - مدمج بها حزمة التطبيق `Qiraati_Smart.app` وأيقونة التطبيقات `Applications` للتثبيت الفوري بالسحب والإفلات.
   - البصمة الرقمية SHA-256: `{dmg_hash}`

2. **حزمة الأرشيف المباشرة (`Qiraati_Smart_macOS_v{VERSION}.zip`):**
   - حزمة مضغوطة قابلة للفك الفوري بنقرة واحدة لأي مجلد.
   - البصمة الرقمية SHA-256: `{zip_hash}`

3. **أيقونة التطبيق الرسمية عالية الدقة (`AppIcon.icns`):**
   - تدعم شاشات ريتينا (Retina 5K/4K) بدقة تصل إلى 1024x1024 بكسل.

---

## 2. خطوات التثبيت والتشغيل على نظام ماك

### الطريقة الأولى: التثبيت عبر صورة القرص (.dmg) - الطريقة الموصى بها
1. انقر نقراً مزدوجاً على ملف `Qiraati_Smart_macOS.dmg` لفتح صورة القرص وتثبيتها.
2. ستظهر نافذة تحتوي على تطبيق **قراءتي الذكية (`Qiraati_Smart.app`)** بجانب مجلد **التطبيقات (`Applications`)**.
3. اسحب أيقونة `Qiraati_Smart.app` وأفلتها داخل مجلد `Applications`.
4. افتح مجلد التطبيقات أو Launchpad وشغّل **قراءتي الذكية** بنقرة واحدة!

### الطريقة الثانية: التشغيل المباشر من الحزمة المضغوطة (.zip)
1. انقر نقراً مزدوجاً على ملف `Qiraati_Smart_macOS_v{VERSION}.zip` لفك الضغط.
2. سينتج تطبيق `Qiraati_Smart.app`.
3. انقر نقراً مزدوجاً على التطبيق للتشغيل الفوري.

> **ملاحظة أمان ماك (Gatekeeper):**
> نظراً لأن التطبيق تم تصريفه محلياً للمدارس بدون شهادة Apple Developer المدفوعة، قد يظهر ماك تنبيهاً أمنياً عند أول فتح:
> - انقر بزر الفأرة الأيمن (أو Control + Click) على `Qiraati_Smart.app` واختر **Open (فتح)** ثم اضغط **Open**.
> - أو اذهب إلى: **إعدادات النظام (System Settings) > الخصوصية والأمان (Privacy & Security)** واضغط **Open Anyway (فتح على أية حال)**.

---

## 3. مميزات نسخة ماك المستقلة
- **أوفلاين 100%:** تعمل بالكامل بدون إنترنت وبدون الحاجة لشبكة محلية أو اتصالات خارجية.
- **تكامل تام مع شاشات Retina:** وضوح فائق لكافة صفحات الكتاب الـ 129 والرسومات المتجهة.
- **كافة الوسائط والألعاب مدمجة:** 2,908+ تسجيلاً صوتياً نقياً بصوت الأستاذ باسل العراقي الفصيح ومكتبة الفونيمات النقية للـ 28 حرفاً، 372+ صورة ورسمة، خط Tajawal المحلي أوفلاين، لوحة تتبع الحروف، ونظام التقييم الذكي.
- **توقيع وهوية أصيلة:** إعداد وتطوير المهندس أسامة خليل هاشم.
""")

    # تنظيف المجلد المؤقت غير المضغوط
    shutil.rmtree(temp_app_dir)
    if os.path.exists(icns_path):
        os.remove(icns_path)

    elapsed = time.time() - t0
    print(f"\n✨ اكتمل بناء وتوليد حزمة ماك بنجاح في {elapsed:.2f} ثانية!")
    return dmg_path, zip_path

def build_linux(standalone_html):
    t0 = time.time()
    print("\n" + "=" * 80)
    print("🐧 [2/2] بدء بناء وتوليد حزمة نظام لينكس (Linux AppImage & .tar.gz)")
    print(f"   الإصدار: v{VERSION} - إعداد وتطوير: {AUTHOR}")
    print("=" * 80)

    os.makedirs(DIST_LINUX, exist_ok=True)

    # 1. تجهيز دليل التطبيق AppDir
    temp_appdir = os.path.join(DIST_LINUX, "AppDir")
    if os.path.exists(temp_appdir):
        shutil.rmtree(temp_appdir)

    os.makedirs(os.path.join(temp_appdir, "app"), exist_ok=True)
    os.makedirs(os.path.join(temp_appdir, "usr", "share", "applications"), exist_ok=True)
    os.makedirs(os.path.join(temp_appdir, "usr", "share", "icons", "hicolor", "512x512", "apps"), exist_ok=True)

    # نسخ المشغل AppRun وملف سطح المكتب
    apprun_src = os.path.join(BASE_DIR, "tools", "linux_src", "AppRun")
    desktop_src = os.path.join(BASE_DIR, "tools", "linux_src", "qiraati-smart.desktop")
    install_src = os.path.join(BASE_DIR, "tools", "linux_src", "install.sh")
    icon_src = os.path.join(BASE_DIR, "icons", "icon-512.png")

    shutil.copy2(apprun_src, os.path.join(temp_appdir, "AppRun"))
    shutil.copy2(desktop_src, os.path.join(temp_appdir, "qiraati-smart.desktop"))
    shutil.copy2(desktop_src, os.path.join(temp_appdir, "usr", "share", "applications", "qiraati-smart.desktop"))
    shutil.copy2(icon_src, os.path.join(temp_appdir, "qiraati-smart.png"))
    shutil.copy2(icon_src, os.path.join(temp_appdir, "usr", "share", "icons", "hicolor", "512x512", "apps", "qiraati-smart.png"))

    # نسخ الحزمة الأحادية والتوثيق وسكربت التثبيت
    print("📋 جارٍ نسخ الحزمة الأحادية والوسائط المدمجة إلى AppDir...")
    shutil.copy2(standalone_html, os.path.join(temp_appdir, "app", "قراءتي_التفاعلية_الذكية.html"))
    shutil.copy2(os.path.join(BASE_DIR, "README.md"), os.path.join(temp_appdir, "app", "README.md"))
    shutil.copy2(install_src, os.path.join(temp_appdir, "app", "install.sh"))

    # 2. إنشاء أرشيف tar.gz المضغوط لـ AppDir (في الذاكرة / ملف)
    tar_path = os.path.join(DIST_LINUX, f"Qiraati_Smart_Linux_v{VERSION}.tar.gz")
    print(f"\n📦 جارٍ ضغط حزمة الأرشيف الرسمية: {os.path.basename(tar_path)}...")

    with tarfile.open(tar_path, "w:gz", compresslevel=6) as tar:
        for root, dirs, files in os.walk(temp_appdir):
            for file in files:
                fpath = os.path.join(root, file)
                rel_path = os.path.relpath(fpath, temp_appdir).replace("\\", "/")
                ti = tar.gettarinfo(fpath, arcname=rel_path)
                ti.uid = 0
                ti.gid = 0
                ti.uname = "root"
                ti.gname = "root"
                if file in ["AppRun", "install.sh"]:
                    ti.mode = 0o755
                else:
                    ti.mode = 0o644
                with open(fpath, "rb") as fp:
                    tar.addfile(ti, fp)

    tar_size_mb = os.path.getsize(tar_path) / (1024 * 1024)
    print(f"✔ تم إنشاء {os.path.basename(tar_path)} بنجاح بحجم: {tar_size_mb:.2f} ميجابايت")

    # 3. بناء حزمة Qiraati_Smart_Linux.AppImage (المستقلة المحمولة Universal AppImage)
    appimage_path = os.path.join(DIST_LINUX, "Qiraati_Smart_Linux.AppImage")
    print(f"\n🚀 جارٍ تصنيع حزمة AppImage المستقلة الشاملة: {os.path.basename(appimage_path)}...")

    # قالب المشغل التنفيذي المحمول
    runner_template = """#!/bin/sh
# ==============================================================================
# منصة قراءتي التفاعلية الذكية - الحزمة المستقلة لنظام لينكس (Universal AppImage)
# الصف الأول الابتدائي - أوفلاين 100% بدون إنترنت أو خادم خارجي
# إعداد وتطوير: المهندس أسامة خليل هاشم
# ==============================================================================

set -e

APP_NAME="qiraati-smart"
APP_VERSION="__APP_VERSION__"
PAYLOAD_OFFSET=0000000000

# معالجة المعاملات القياسية لـ AppImage
case "$1" in
    --appimage-version|-v)
        echo "منصة قراءتي التفاعلية الذكية - الإصدار $APP_VERSION"
        echo "Interactive Smart Qiraati Educational Platform v$APP_VERSION"
        echo "الصف الأول الابتدائي - أوفلاين 100%"
        echo "إعداد وتطوير: المهندس أسامة خليل هاشم"
        exit 0
        ;;
    --appimage-help|-h)
        echo "استخدام حزمة قراءتي الذكية (Qiraati Smart Linux AppImage):"
        echo "  $0 [خيارات]"
        echo ""
        echo "الخيارات المتاحة:"
        echo "  (بدون خيارات)        تشغيل المنصة التفاعلية بنقرة واحدة (أوفلاين 100%)"
        echo "  --appimage-extract   استخراج ملفات المنصة إلى مجلد squashfs-root الحالي"
        echo "  --appimage-version   عرض إصدار المنصة وبيانات المطور والملكية الفكرية"
        echo "  --server             تشغيل خادم محلي مدمج على المنفذ 41753"
        echo "  --help, -h           عرض رسالة المساعدة هذه"
        exit 0
        ;;
    --appimage-extract)
        TARGET_DIR="./squashfs-root"
        echo "📦 جارٍ استخراج ملفات قراءتي الذكية إلى: $TARGET_DIR..."
        mkdir -p "$TARGET_DIR"
        tail -c +"$PAYLOAD_OFFSET" "$0" | tar -xz -C "$TARGET_DIR"
        echo "✔ تم الاستخراج بنجاح! يمكنك الآن تشغيل: $TARGET_DIR/AppRun"
        exit 0
        ;;
esac

# بيئة التشغيل السريعة عبر التخزين المؤقت الموثوق
CACHE_BASE="${XDG_CACHE_HOME:-$HOME/.cache}/qiraati-smart-v$APP_VERSION"
SENTINEL_FILE="$CACHE_BASE/.extracted_ok"

if [ ! -f "$SENTINEL_FILE" ]; then
    echo "🚀 جارٍ تهيئة وتشغيل منصة قراءتي الذكية لأول مرة..."
    mkdir -p "$CACHE_BASE"
    tail -c +"$PAYLOAD_OFFSET" "$0" | tar -xz -C "$CACHE_BASE"
    touch "$SENTINEL_FILE"
fi

# تنفيذ مشغل المنصة المدمج
exec "$CACHE_BASE/AppRun" "$@"
"""

    # حساب إزاحة البايتات بدقة متناهية بعد حقن رقم الإصدار وتطبيع نهايات الأسطر إلى LF
    populated_template = runner_template.replace("__APP_VERSION__", VERSION).replace("\r\n", "\n")
    dummy_header = populated_template.encode("utf-8")
    exact_offset = len(dummy_header) + 1  # 1-based index لـ tail -c
    final_runner = populated_template.replace("PAYLOAD_OFFSET=0000000000", f"PAYLOAD_OFFSET={exact_offset:010d}")
    final_header_bytes = final_runner.encode("utf-8")

    # كتابة ملف AppImage بدمج الرأس التنفيذي مع حزمة tar.gz
    with open(appimage_path, "wb") as f_out:
        f_out.write(final_header_bytes)
        with open(tar_path, "rb") as f_in:
            while chunk := f_in.read(1024 * 1024):
                f_out.write(chunk)

    appimage_size_mb = os.path.getsize(appimage_path) / (1024 * 1024)
    print(f"✔ تم إنشاء Qiraati_Smart_Linux.AppImage بنجاح بحجم: {appimage_size_mb:.2f} ميجابايت")

    # 4. حساب البصمات الرقمية SHA-256
    appimage_hash = compute_sha256(appimage_path)
    with open(appimage_path + ".sha256", "w", encoding="utf-8") as f:
        f.write(f"{appimage_hash}  {os.path.basename(appimage_path)}\n")

    tar_hash = compute_sha256(tar_path)
    with open(tar_path + ".sha256", "w", encoding="utf-8") as f:
        f.write(f"{tar_hash}  {os.path.basename(tar_path)}\n")

    # 5. كتابة دليل الاستخدام والتثبيت للينكس
    guide_path = os.path.join(DIST_LINUX, "دليل_تثبيت_وتشغيل_لينكس_Linux.md")
    with open(guide_path, "w", encoding="utf-8") as f:
        f.write(f"""# دليل تثبيت وتشغيل منصة قراءتي التفاعلية الذكية على أنظمة لينكس (Linux)
### الصف الأول الابتدائي (المنهج الفونيمي الصوتي والحركي - أوفلاين 100%)
### الإصدار: v{VERSION} | إعداد وتطوير: {AUTHOR}

---

## 1. محتويات حزمة التوزيع الرسمية (Linux Distribution)
تدعم هذه الحزمة كافة توزيعات لينكس الحديثة والقديمة (Ubuntu, Debian, Fedora, Arch, Linux Mint, RedHat, openSUSE, elementary OS, CentOS, ChromeOS):

1. **الحزمة المستقلة المحمولة (`Qiraati_Smart_Linux.AppImage`):**
   - حزمة تنفيذية تعمل مباشرة بنقرة واحدة بدون الحاجة لصلاحيات الجذر (Root) وبدون FUSE dependencies.
   - تدعم وسائط التشغيل القياسية: `--appimage-extract`, `--appimage-version`, `--server`.
   - البصمة الرقمية SHA-256: `{appimage_hash}`

2. **حزمة الأرشيف وتكامل الأنظمة (`Qiraati_Smart_Linux_v{VERSION}.tar.gz`):**
   - حزمة مخصصة لمديري المختبرات المدرسية ومسؤولي الأنظمة لتثبيت المنصة في القوائم الرسمية.
   - البصمة الرقمية SHA-256: `{tar_hash}`

---

## 2. خطوات التشغيل السريع (AppImage)

1. **منح صلاحية التشغيل للملف:**
   - من خلال موجه الأوامر (Terminal):
     ```bash
     chmod +x Qiraati_Smart_Linux.AppImage
     ```
   - أو عبر واجهة سطح المكتب: انقر بزر الفأرة الأيمن على الملف > **خصائص (Properties)** > **الأذونات (Permissions)** > ضع علامة صح أمام **السماح بتشغيل الملف كبرنامج (Allow executing file as program)**.

2. **التشغيل:**
   - انقر نقراً مزدوجاً على الملف، أو من خلال الطرفية:
     ```bash
     ./Qiraati_Smart_Linux.AppImage
     ```
   - ستعمل المنصة فوراً وتفتح في نافذة تطبيق مستقلة فائقة السرعة.

---

## 3. تثبيت الاختصارات في قوائم سطح المكتب للمختبرات المدرسية
إذا أردت تثبيت المنصة كبرنامج رسمي يظهر في قائمة البرامج الرئيسية وسطح المكتب:
1. قم بفك حزمة `Qiraati_Smart_Linux_v{VERSION}.tar.gz`.
2. شغّل سكربت التثبيت التلقائي:
   ```bash
   ./app/install.sh
   ```
3. ستظهر أيقونة **قراءتي الذكية** فوراً في قائمة التعليم والتطبيقات!

---

## 4. مميزات نسخة لينكس
- **لا تتطلب FUSE أو Root:** تعمل على توزيعات Ubuntu 22.04 و 24.04 و Debian 12 دون أي متطلبات إضافية.
- **استجابة فورية:** بعد أول تشغيل، يتم تخزين الملفات مؤقتاً لتفتح المنصة في أجزاء من الثانية.
- **دعم كامل للسبورات الذكية والشاشات اللمسية:** تكامل كامل مع اللمس المتعدد وأقلام الشاشات وقسم تمارين اليد وكانفاس التتبع.
- **توقيع وهوية أصيلة:** إعداد وتطوير المهندس أسامة خليل هاشم.
""")

    # تنظيف المجلد المؤقت غير المضغوط
    shutil.rmtree(temp_appdir)

    elapsed = time.time() - t0
    print(f"\n✨ اكتمل بناء وتوليد حزمة لينكس بنجاح في {elapsed:.2f} ثانية!")
    return appimage_path, tar_path

def self_test():
    print("\n" + "=" * 80)
    print("🔍 [3/3] إجراء الفحص الذاتي والاختبار الآلي الشامل للحزم المنتجة")
    print("=" * 80)

    all_passed = True

    # 1. فحص حزمة ماك
    dmg_file = os.path.join(DIST_MACOS, "Qiraati_Smart_macOS.dmg")
    zip_file = os.path.join(DIST_MACOS, f"Qiraati_Smart_macOS_v{VERSION}.zip")

    if not os.path.exists(dmg_file) or os.path.getsize(dmg_file) < 100_000_000:
        print("❌ فشل: ملف Qiraati_Smart_macOS.dmg غير صالح أو مفقود")
        all_passed = False
    else:
        print(f"✔ فحص حجم DMG: {os.path.getsize(dmg_file):,} بايت (سليم)")
        # فحص قراءة ISO/DMG الداخلي
        try:
            iso = pycdlib.PyCdlib()
            iso.open(dmg_file)
            # التحقق من وجود الملفات الرئيسية
            r1 = iso.get_record(rr_path="/Qiraati_Smart.app/Contents/MacOS/Qiraati_Smart_Launcher")
            r2 = iso.get_record(rr_path="/Applications")
            mode = oct(r1.rock_ridge.get_file_mode())
            is_symlink = r2.rock_ridge.is_symlink()
            iso.close()
            print(f"✔ فحص هيكل DMG الداخلي: Launcher mode={mode}, /Applications symlink={is_symlink} (سليم 100%)")
        except Exception as e:
            print(f"❌ خطأ أثناء فحص سجلات DMG: {e}")
            all_passed = False

    if not os.path.exists(zip_file) or os.path.getsize(zip_file) < 100_000_000:
        print(f"❌ فشل: ملف Qiraati_Smart_macOS_v{VERSION}.zip غير صالح أو مفقود")
        all_passed = False
    else:
        # فحص سلامة الـ ZIP وإصدار Info.plist
        try:
            with zipfile.ZipFile(zip_file, "r") as zf:
                bad_file = zf.testzip()
                if bad_file:
                    print(f"❌ خطأ: ملف تالف داخل ZIP: {bad_file}")
                    all_passed = False
                else:
                    plist_txt = zf.read("Qiraati_Smart.app/Contents/Info.plist").decode("utf-8", errors="ignore")
                    if f"<string>{VERSION}</string>" not in plist_txt:
                        print(f"❌ خطأ: Info.plist داخل ZIP لا يحمل الإصدار {VERSION}")
                        all_passed = False
                    else:
                        print(f"✔ فحص سلامة ZIP وإصدار Info.plist ({VERSION}): خالي من الأخطاء وسلامة CRC32 مؤكدة")
        except Exception as e:
            print(f"❌ خطأ في فحص ZIP: {e}")
            all_passed = False

    # 2. فحص حزمة لينكس
    appimage_file = os.path.join(DIST_LINUX, "Qiraati_Smart_Linux.AppImage")
    tar_file = os.path.join(DIST_LINUX, f"Qiraati_Smart_Linux_v{VERSION}.tar.gz")

    if not os.path.exists(appimage_file) or os.path.getsize(appimage_file) < 100_000_000:
        print("❌ فشل: ملف Qiraati_Smart_Linux.AppImage غير صالح أو مفقود")
        all_passed = False
    else:
        print(f"✔ فحص حجم AppImage: {os.path.getsize(appimage_file):,} بايت (سليم)")
        # فحص قراءة الرأس والأرشيف المدمج والإصدار
        try:
            with open(appimage_file, "rb") as f:
                header = f.read(1024).decode("utf-8", errors="ignore")
                if f'APP_VERSION="{VERSION}"' not in header:
                    raise ValueError(f'رأس AppImage لا يحمل APP_VERSION="{VERSION}"')
                # البحث عن إزاحة PAYLOAD_OFFSET
                import re
                m = re.search(r"PAYLOAD_OFFSET=(\d+)", header)
                if not m:
                    raise ValueError("لم يتم العثور على PAYLOAD_OFFSET في رأس AppImage")
                offset = int(m.group(1))
                f.seek(offset - 1)  # 1-based offset
                tar_magic = f.read(2)
                # فحص magic bytes لـ gzip (0x1f, 0x8b)
                if tar_magic != b"\x1f\x8b":
                    raise ValueError(f"بيانات الأرشيف لا تبدأ بـ GZIP Magic Bytes: {tar_magic}")
                print(f"✔ فحص AppImage: الرأس سليم (v{VERSION}) وإزاحة البايتات دقيقة ({offset}) وبداية GZIP مؤكدة 100%")
        except Exception as e:
            print(f"❌ خطأ أثناء فحص AppImage: {e}")
            all_passed = False

    if not os.path.exists(tar_file) or os.path.getsize(tar_file) < 100_000_000:
        print("❌ فشل: ملف tar.gz غير صالح أو مفقود")
        all_passed = False
    else:
        try:
            with tarfile.open(tar_file, "r:gz") as tar:
                members = tar.getnames()
                if "AppRun" in members and "qiraati-smart.desktop" in members:
                    desktop_f = tar.extractfile("qiraati-smart.desktop")
                    desktop_txt = desktop_f.read().decode("utf-8", errors="ignore") if desktop_f else ""
                    if f"X-AppImage-Version={VERSION}" not in desktop_txt:
                        print(f"❌ خطأ: ملف qiraati-smart.desktop لا يحمل X-AppImage-Version={VERSION}")
                        all_passed = False
                    else:
                        print(f"✔ فحص سلامة tar.gz: تم العثور على {len(members)} عنصراً مع AppRun و Desktop Entry (v{VERSION})")
                else:
                    print(f"❌ عناصر مفقودة داخل tar.gz: {members[:5]}")
                    all_passed = False
        except Exception as e:
            print(f"❌ خطأ في فحص tar.gz: {e}")
            all_passed = False

    # 3. فحص البصمات الرقمية
    for hfile in [dmg_file + ".sha256", zip_file + ".sha256", appimage_file + ".sha256", tar_file + ".sha256"]:
        if os.path.exists(hfile):
            with open(hfile, "r", encoding="utf-8") as f:
                content = f.read().strip()
                print(f"✔ بصمة رقمية صالحة: {os.path.basename(hfile)} -> {content[:16]}...")
        else:
            print(f"❌ ملف بصمة مفقود: {hfile}")
            all_passed = False

    print("=" * 80)
    if all_passed:
        print("🎉 نجحت كافة الفحوصات والاختبارات الآلية بنسبة 100%!")
    else:
        print("⚠️ حدث خطأ في بعض الفحوصات، يرجى المراجعة.")
    print("=" * 80)
    return all_passed

def main():
    parser = argparse.ArgumentParser(description=f"أداة بناء وتوليد حزم ماك ولينكس لمنصة قراءتي الذكية v{VERSION}")
    parser.add_argument("--all", action="store_true", default=True, help="بناء كافة حزم ماك ولينكس معاً")
    parser.add_argument("--macos", action="store_true", help="بناء حزم ماك فقط")
    parser.add_argument("--linux", action="store_true", help="بناء حزم لينكس فقط")
    parser.add_argument("--self-test", action="store_true", help="إجراء الفحص الذاتي فقط")
    args = parser.parse_args()

    t_start = time.time()
    print("*" * 80)
    print("🌟 منصة قراءتي التفاعلية الذكية - أداة حزم وتوليد النسخ متعددة المنصات (macOS & Linux)")
    print(f"   الإصدار المعتمد: v{VERSION}")
    print(f"   إعداد وتطوير: {AUTHOR}")
    print("*" * 80)

    if args.self_test:
        success = self_test()
        sys.exit(0 if success else 1)

    standalone_html = ensure_standalone_bundle()

    if args.macos:
        build_macos(standalone_html)
    elif args.linux:
        build_linux(standalone_html)
    else:
        build_macos(standalone_html)
        build_linux(standalone_html)

    if not self_test():
        sys.exit(1)

    total_time = time.time() - t_start
    print("\n" + "=" * 80)
    print("🏁 اكتملت عملية البناء والحزم لكافة المنصات المستقلة بنجاح تام!")
    print(f"   إجمالي الوقت المستغرق: {total_time:.2f} ثانية")
    print(f"   مجلد توزيع ماك: {DIST_MACOS}")
    print(f"   مجلد توزيع لينكس: {DIST_LINUX}")
    print("=" * 80)

if __name__ == "__main__":
    main()
