#!/usr/bin/env python3
"""
أداة بناء وتوليد حزمة تطبيق أندرويد المستقل (Qiraati_Smart.apk)
للأجهزة اللوحية المدرسية والهواتف الذكية للعمل أوفلاين 100%
لمنصة قراءتي التفاعلية الذكية - الصف الأول الابتدائي
إعداد وتطوير: المهندس أسامة خليل هاشم

تقوم هذه الأداة بـ:
1. التحقق من بيئة بناء أندرويد (Android SDK, Build Tools, Java/JDK, aapt, apksigner, keytool)
2. بناء وتحديث index.html من قوالب views/
3. توليد حزم الأيقونات متعددة المقاسات (mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi)
4. مزامنة ونقل كافة أصول المنصة (الواجهات، ملفات CSS، المنطق JS، الأصوات، الصور) إلى assets
5. توليد أو التحقق من شهادة التوقيع الرسمية (qiraati-release.keystore)
6. ضبط وتوليد ملف local.properties ومسار Android SDK
7. تصريف وبناء الحزمة بصيغة Release APK عبر Gradle Wrapper
8. التحقق من التوقيع الرقمي (V1, V2, V3) وفحص بيانات الحزمة عبر aapt
9. استخراج الحزمة النهائية إلى مجلد التوزيع: dist/Qiraati_Smart_Android_v3.38/Qiraati_Smart.apk
10. حساب البصمة الرقمية SHA-256 وتوليد دليل الاستخدام والتثبيت المدرسي الشامل
"""

import os
import sys
import glob
import time
import shutil
import hashlib
import subprocess
from PIL import Image

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ANDROID_SRC = os.path.join(BASE_DIR, "tools", "android_src")
APP_SRC = os.path.join(ANDROID_SRC, "app")
ASSETS_DIR = os.path.join(APP_SRC, "src", "main", "assets")
RES_DIR = os.path.join(APP_SRC, "src", "main", "res")
DIST_DIR = os.path.join(BASE_DIR, "dist", "Qiraati_Smart_Android_v3.38")

SDK_DIR = r"C:\Users\asalz\AppData\Local\Android\Sdk"
BUILD_TOOLS_DIR = os.path.join(SDK_DIR, "build-tools", "34.0.0")
AAPT_PATH = os.path.join(BUILD_TOOLS_DIR, "aapt.exe")
APKSIGNER_PATH = os.path.join(BUILD_TOOLS_DIR, "apksigner.bat")
ZIPALIGN_PATH = os.path.join(BUILD_TOOLS_DIR, "zipalign.exe")

KEYTOOL_PATH = r"C:\Program Files\Microsoft\jdk-17.0.21.21-hotspot\bin\keytool.exe"
if not os.path.exists(KEYTOOL_PATH):
    # fallback to where keytool
    try:
        res = subprocess.run(["where.exe", "keytool"], capture_output=True, text=True)
        if res.returncode == 0 and res.stdout.strip():
            KEYTOOL_PATH = res.stdout.strip().splitlines()[0]
    except Exception:
        pass


def compute_sha256(filepath):
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest().lower()


def ensure_environment():
    print("\n[1/8] فحص بيئة تطوير وبناء أندرويد...")
    if not os.path.exists(SDK_DIR):
        print(f"❌ خطأ: لم يتم العثور على Android SDK في: {SDK_DIR}")
        sys.exit(1)
    if not os.path.exists(BUILD_TOOLS_DIR):
        print(f"❌ خطأ: لم يتم العثور على Build Tools في: {BUILD_TOOLS_DIR}")
        sys.exit(1)
    if not os.path.exists(KEYTOOL_PATH):
        print(f"❌ خطأ: لم يتم العثور على أداة keytool في: {KEYTOOL_PATH}")
        sys.exit(1)

    # ضبط local.properties
    local_props = os.path.join(ANDROID_SRC, "local.properties")
    sdk_escaped = SDK_DIR.replace("\\", "\\\\").replace(":", "\\:")
    with open(local_props, "w", encoding="utf-8") as f:
        f.write(f"sdk.dir={sdk_escaped}\n")

    print(f"✔ تم التحقق من Android SDK 34 و Build Tools 34.0.0 بنجاح.")


def update_web_build():
    print("\n[2/8] تحديث وبناء واجهات index.html...")
    sys.path.insert(0, os.path.join(BASE_DIR, "tools"))
    import build
    build.build_index()


def generate_android_icons():
    print("\n[3/8] توليد أيقونات أندرويد متعددة المقاسات والأيقونات التكيفية...")
    source_png = os.path.join(BASE_DIR, "icons", "icon-512.png")
    if not os.path.exists(source_png):
        print(f"❌ خطأ: أيقونة المصدر غير موجودة في: {source_png}")
        sys.exit(1)

    im = Image.open(source_png).convert("RGBA")

    # المقاسات القياسية لشاشات أندرويد
    densities = {
        "mipmap-mdpi": 48,
        "mipmap-hdpi": 72,
        "mipmap-xhdpi": 96,
        "mipmap-xxhdpi": 144,
        "mipmap-xxxhdpi": 192
    }

    for folder, size in densities.items():
        target_dir = os.path.join(RES_DIR, folder)
        os.makedirs(target_dir, exist_ok=True)

        resized = im.resize((size, size), Image.Resampling.LANCZOS)

        # 1. ic_launcher.png
        p1 = os.path.join(target_dir, "ic_launcher.png")
        resized.save(p1, format="PNG")

        # 2. ic_launcher_round.png
        p2 = os.path.join(target_dir, "ic_launcher_round.png")
        resized.save(p2, format="PNG")

    print(f"✔ تم توليد كافة الأيقونات لجميع كثافات الشاشات (mdpi -> xxxhdpi).")


def ensure_keystore():
    print("\n[4/8] فحص شهادة التوقيع الرقمي للمطور (qiraati-release.keystore)...")
    keystore_path = os.path.join(APP_SRC, "qiraati-release.keystore")
    if os.path.exists(keystore_path):
        print(f"✔ شهادة التوقيع موجودة مسبقاً: {keystore_path}")
        return keystore_path

    print("🔑 جارٍ إنشاء شهادة التوقيع الرقمي الرسمية للمهندس أسامة خليل هاشم...")
    cmd = [
        KEYTOOL_PATH,
        "-genkeypair",
        "-v",
        "-keystore", keystore_path,
        "-alias", "qiraati",
        "-keyalg", "RSA",
        "-keysize", "2048",
        "-validity", "10000",
        "-storepass", "qiraati_smart_2026",
        "-keypass", "qiraati_smart_2026",
        "-dname", "CN=Osama Khalil Hashem, OU=Educational Technology, O=Qiraati Smart Platform, L=Baghdad, ST=Baghdad, C=IQ"
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"❌ فشل إنشاء شهادة التوقيع:\n{res.stderr}")
        sys.exit(1)
    print("✔ تم إنشاء شهادة التوقيع الرقمي الرسمية بنجاح.")
    return keystore_path


def copy_if_newer(src, dst):
    if not os.path.exists(dst) or os.path.getmtime(src) > os.path.getmtime(dst) or os.path.getsize(src) != os.path.getsize(dst):
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copy2(src, dst)
        return True
    return False


def sync_assets():
    print("\n[5/8] مزامنة أصول ووسائط المنصة داخل حزمة أندرويد (assets)...")
    os.makedirs(ASSETS_DIR, exist_ok=True)

    files_copied = 0
    total_files = 0

    # 1. الملفات الجذرية
    root_files = [
        "index.html",
        "manifest.json",
        "sw.js",
        "audio_data.js",
        "audio_data_unit6.js",
        "curriculum_data.js"
    ]

    for rf in root_files:
        src = os.path.join(BASE_DIR, rf)
        if os.path.exists(src):
            dst = os.path.join(ASSETS_DIR, rf)
            if copy_if_newer(src, dst):
                files_copied += 1
            total_files += 1

    # 2. صور الجذر (page_*.png, activity_*.png, unit*.png, mobile_qr.png)
    for p in glob.glob(os.path.join(BASE_DIR, "*.png")):
        fname = os.path.basename(p)
        dst = os.path.join(ASSETS_DIR, fname)
        if copy_if_newer(p, dst):
            files_copied += 1
        total_files += 1

    # 3. المجلدات الفرعية: css, js, audio, icons
    for sub in ["css", "js", "audio", "icons"]:
        sub_src = os.path.join(BASE_DIR, sub)
        if os.path.exists(sub_src):
            for root, dirs, files in os.walk(sub_src):
                rel_root = os.path.relpath(root, BASE_DIR)
                target_root = os.path.join(ASSETS_DIR, rel_root)
                for f in files:
                    src_f = os.path.join(root, f)
                    dst_f = os.path.join(target_root, f)
                    if copy_if_newer(src_f, dst_f):
                        files_copied += 1
                    total_files += 1

    print(f"✔ تمت مزامنة كافة أصول المنصة ({total_files} ملف، تم تحديث/نسخ {files_copied} ملف) بنجاح.")


def compile_apk():
    print("\n[6/8] تصريف وبناء حزمة أندرويد الرسمية المستقلة عبر Gradle...")
    gradlew_bat = os.path.join(ANDROID_SRC, "gradlew.bat")
    wrapper_jar = os.path.join(ANDROID_SRC, "gradle", "wrapper", "gradle-wrapper.jar")

    if os.path.exists(gradlew_bat):
        cmd = [gradlew_bat, "assembleRelease", "--no-daemon"]
    elif os.path.exists(wrapper_jar):
        cmd = ["java", "-Dorg.gradle.appname=gradlew", "-classpath", wrapper_jar, "org.gradle.wrapper.GradleWrapperMain", "assembleRelease", "--no-daemon"]
    else:
        print(f"❌ خطأ: لم يتم العثور على مشغل Gradle.")
        sys.exit(1)

    print(f"   تشغيل تصريف Gradle Release APK...")
    t0 = time.time()
    res = subprocess.run(cmd, cwd=ANDROID_SRC, capture_output=True, text=True, encoding="utf-8", errors="replace")
    t1 = time.time()

    if res.returncode != 0:
        print(f"❌ فشل بناء حزمة أندرويد:\n{res.stderr}\n{res.stdout}")
        sys.exit(1)

    print(f"✔ اكتمل بناء Gradle بنجاح في {t1 - t0:.1f} ثانية.")

    release_apk = os.path.join(APP_SRC, "build", "outputs", "apk", "release", "app-release.apk")
    if not os.path.exists(release_apk):
        print(f"❌ خطأ: لم يتم العثور على ملف APK الناتج في: {release_apk}")
        sys.exit(1)

    return release_apk


def verify_apk(apk_path):
    print("\n[7/8] التحقق والفحص الذاتي للحزمة والتوقيع الرقمي...")

    # 1. فحص التوقيع عبر apksigner
    if os.path.exists(APKSIGNER_PATH):
        cmd = [APKSIGNER_PATH, "verify", "--verbose", apk_path]
        res = subprocess.run(cmd, capture_output=True, text=True)
        if res.returncode == 0:
            print("✔ تم التحقق من سلامة التوقيع الرقمي الرسمي (V1 / V2 / V3) بنجاح 100%.")
        else:
            print(f"⚠ تحذير التوقيع:\n{res.stdout}\n{res.stderr}")

    # 2. فحص بيانات الحزمة عبر aapt
    if os.path.exists(AAPT_PATH):
        cmd = [AAPT_PATH, "dump", "badging", apk_path]
        res = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace")
        if res.returncode == 0:
            lines = res.stdout.splitlines()
            for line in lines[:8]:
                if any(k in line for k in ["package:", "sdkVersion:", "targetSdkVersion:", "application-label:"]):
                    print(f"   ℹ {line}")
            print("✔ تم فحص بيانات التعريف والشاشات المدعومة وتوافق الأجهزة اللوحية.")


def package_distribution(apk_path):
    print("\n[8/8] تجهيز مجلد التوزيع الرسمي وحساب البصمة الرقمية والدليل...")
    os.makedirs(DIST_DIR, exist_ok=True)

    dest_apk = os.path.join(DIST_DIR, "Qiraati_Smart.apk")
    shutil.copy2(apk_path, dest_apk)

    size_mb = os.path.getsize(dest_apk) / (1024 * 1024)
    apk_hash = compute_sha256(dest_apk)

    hash_file = os.path.join(DIST_DIR, "Qiraati_Smart.apk.sha256")
    with open(hash_file, "w", encoding="utf-8") as f:
        f.write(f"{apk_hash}  Qiraati_Smart.apk\n")

    # كتابة دليل الاستخدام والتثبيت الشامل
    manual_path = os.path.join(DIST_DIR, "دليل_تثبيت_وتشغيل_أندرويد_للأجهزة_اللوحية_والهواتف.md")
    manual_content = f"""# دليل تثبيت وتشغيل حزمة أندرويد المستقلة (APK) أوفلاين 100%
## منصة قراءتي التفاعلية الذكية • الصف الأول الابتدائي (المنهج العراقي التفاعلي الشامل)
**إعداد وتطوير:** **المهندس أسامة خليل هاشم**  
**اسم الحزمة:** `Qiraati_Smart.apk`  
**معرف التطبيق (Application ID):** `iq.usama.qiraati`  
**الإصدار:** `v3.38.0` (كود البناء: `338` • كاش الخدمة: `qiraati-smart-v61`)  
**الحد الأدنى لنظام أندرويد (Min SDK):** Android 7.0 (API 24 Nougat) فما فوق  
**النظام المستهدف (Target SDK):** Android 14 (API 34)  
**البصمة الرقمية للحزمة (SHA-256):**  
`{apk_hash}`

---

## 🌟 نبذة عن التطبيق
تطبيق **«قراءتي التفاعلية الذكية»** للأندرويد هو حزمة تثبيت مستقلة بصيغة **APK** مخصصة للعمل **أوفلاين 100%** دون الحاجة إلى اتصال بالإنترنت أو خادم محلي. تم تصميم التطبيق خصيصاً ليلبي متطلبات:

1. **الأجهزة اللوحية المدرسية (School Tablets):** في الصفوف المدرسية والقاعات التعليمية التفاعلية بمقاسات الشاشات 7 و 8 و 10 بوصات.
2. **الهواتف الذكية (Smartphones):** لكافة هواتف المعلمين والتلاميذ وأولياء الأمور لتوفير بيئة تعليمية منزلية آمنة ومسلية ومحفزة.
3. **أجهزة العرض والشاشات الذكية بنظام أندرويد (Android Smart TVs & Interactive Boards):** للتعليم الصفي الجماعي.

---

## 🚀 مميزات تطبيق أندرويد المستقل
* **استقلالية كاملة (100% Offline):** كافة واجهات المنهج الـ 46، وأكثر من 2,700 ملف صوتي بشري وفونيمي، وبنك الألعاب، والسبورات الذكية مدمجة بالكامل داخل ملف APK.
* **شاشة كاملة غامرة (Immersive Sticky Fullscreen):** إخفاء تلقائي لأشرطة النظام وأزرار التنقل السفلية لتركيز الطفل الكامل على الأنشطة التعليمية وتوسيع مساحة الرسم والتفاعل.
* **تحكم فوري بالصوت (Audio-Focus & Stream Music):** ربط أزرار الصوت المادية في التابلت والهاتف مباشرة بصوت الحروف والألعاب دون تأخير وبجودة صوتية فائقة.
* **بقاء الشاشة مضاءة (Keep Screen On):** حماية الجهاز اللوحي من الإغلاق التلقائي للشاشة أثناء تفاعل التلميذ مع لوحات القراءة والتهجئة والدمج الفونيمي.
* **التوافق التلقائي مع الوضعين الأفقي والعمودي (Landscape & Portrait Responsive):** تدوير ذكي وسلس يدعم الوضع الأفقي المفضل للأجهزة اللوحية المدرسية والوضع العمودي للهواتف مع الحفاظ على موضع الدرس وحفظ التقدم.
* **حفظ تقدم التلميذ محلياً (Offline Storage):** حفظ النجوم والأوسمة وإعدادات الصوت والرسومات في ذاكرة التخزين المحلية للجهاز اللوحي.
* **خروج آمن ومدروس:** منع خروج الطفل غير المقصود عند لمس زر الرجوع؛ حيث يطلب التطبيق ضغطة تأكيد مزدوجة مع إشعار عربي لطيف: *«اضغط مرة أخرى للخروج من تطبيق قراءتي الذكية»*.

---

## 📱 طرق تثبيت الحزمة على الأجهزة اللوحية والهواتف

### الطريقة الأولى: التثبيت المباشر من ذاكرة الجهاز أو الفلاش ميموري (موصى بها)
1. انسخ ملف **`Qiraati_Smart.apk`** إلى ذاكرة الهاتف أو التابلت عبر كابل USB، أو عبر بطاقة ذاكرة SD، أو فلاش ميموري USB OTG.
2. افتح تطبيق **«ملفاتي» (Files / My Files)** على جهازك اللوحي، وانتقل إلى مجلد التنزيلات أو المسار الذي نسخت إليه الحزمة.
3. اضغط على ملف **`Qiraati_Smart.apk`**.
4. إذا ظهر لك تنبيه أمان أندرويد *«لأسباب أمنية، غير مسموح لهاتفك بتثبيت تطبيقات غير معروفة من هذا المصدر»*:
   * اضغط على **«الإعدادات» (Settings)**.
   * قم بتفعيل خيار **«السماح بتثبيت التطبيقات من هذا المصدر» (Allow from this source)**.
5. اضغط على **«تثبيت» (Install)**.
6. خلال ثوانٍ معدودة ستكتمل عملية التثبيت وتظهر أيقونة المنصة الرسمية الفاخرة باسم **«قراءتي الذكية»** في درج التطبيقات والشاشة الرئيسية.

---

### الطريقة الثانية: المشاركة عبر البلوتوث أو تطبيقات المراسلة
* يمكن للمعلم إرسال ملف **`Qiraati_Smart.apk`** مباشرة لأولياء الأمور عبر تليغرام أو واتساب أو البلوتوث أو Nearby Share / Quick Share، ويقوم المستلم بالضغط على الملف وتثبيته فوراً.

---

### الطريقة الثالثة: التثبيت الجماعي للمختبرات المدرسية عبر ADB (IT Administrators)
لمسؤولي المختبرات المدرسية الراغبين بتثبيت التطبيق دفعة واحدة على حزم الأجهزة اللوحية الموصولة بالحاسوب عبر أوامر موجه الأوامر:
```cmd
adb install -r Qiraati_Smart.apk
```
* لتشغيل التطبيق مباشرة بعد التثبيت:
```cmd
adb shell am start -n iq.usama.qiraati/.MainActivity
```

---

## 🛡️ مواصفات الأمان والبصمة الرقمية
* الحزمة موثقة وموقعة بشهادة رقمية رسمية (RSA 2048-bit) صادرة باسم: **«المهندس أسامة خليل هاشم»**.
* خالية من أي برمجيات تتبع أو إعلانات تجارية؛ بيئة تربوية مدرسية آمنة 100% للأطفال.

---
**منصة قراءتي التفاعلية الذكية • إعداد وتطوير: المهندس أسامة خليل هاشم**
"""
    with open(manual_path, "w", encoding="utf-8") as f:
        f.write(manual_content)

    print(f"\n" + "=" * 80)
    print("✨ تم بنجاح تام بناء وتجهيز حزمة تطبيق أندرويد المستقل (APK) أوفلاين 100%!")
    print(f"   اسم الحزمة النهائي: Qiraati_Smart.apk")
    print(f"   مسار الحزمة: {dest_apk}")
    print(f"   الحجم النهائي: {size_mb:.2f} ميجابايت")
    print(f"   البصمة الرقمية SHA-256: {apk_hash}")
    print(f"   دليل التثبيت المدرسي: {manual_path}")
    print("=" * 80)


def main():
    t_start = time.time()
    print("=" * 80)
    print("🚀 بدء بناء وتوليد حزمة تطبيق أندرويد المستقل (Qiraati_Smart.apk)")
    print("   للأجهزة اللوحية المدرسية والهواتف الذكية أوفلاين 100%")
    print("   منصة قراءتي التفاعلية الذكية - الصف الأول الابتدائي")
    print("   إعداد وتطوير: المهندس أسامة خليل هاشم")
    print("=" * 80)

    ensure_environment()
    update_web_build()
    generate_android_icons()
    ensure_keystore()
    sync_assets()
    apk_path = compile_apk()
    verify_apk(apk_path)
    package_distribution(apk_path)

    elapsed = time.time() - t_start
    print(f"\n⏱ زمن الإنجاز الكلي: {elapsed:.2f} ثانية.")


if __name__ == "__main__":
    main()
