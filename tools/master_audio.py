#!/usr/bin/env python3
"""
أداة المعالجة الصوتية الاستوديوية الجماعية لمنصة قراءتي التفاعلية الذكية
إعداد وتطوير: المهندس أسامة خليل هاشم

تقوم هذه الأداة بمعالجة ملفات MP3 الحالية في audio/ باستخدام ffmpeg:
1. قص الصمت الميت في البداية لتسريع الاستجابة.
2. تصفية الترددات المنخفضة المزعجة (Highpass filter).
3. إضفاء دفء طبيعي بشري لصوت النطق (EQ warm up).
4. تخفيف الرنين المعدني الحاد لـ TTS (Sibilance softening).
5. توحيد علو الصوت المعياري (EBU R128 loudnorm) لجميع الكلمات والأناشيد.
6. تلاشٍ ناعم (Fade in / out) لمنع صوت الطقطقة.
7. ترميز خفيف عالي النقاء (24kHz, 64kbps mono).
"""

import os
import sys
import glob
import shutil
import time
import argparse
import subprocess
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUDIO_DIR = os.path.join(BASE_DIR, 'audio')
BACKUP_DIR = os.path.join(BASE_DIR, 'audio_backup_raw')

def find_ffmpeg():
    """البحث الذكي عن مسار أداة ffmpeg"""
    # 1. متغير البيئة FFMPEG_PATH
    env_path = os.environ.get('FFMPEG_PATH')
    if env_path and os.path.isfile(env_path):
        return env_path
    
    # 2. أداة النظام في PATH
    sys_ffmpeg = shutil.which('ffmpeg')
    if sys_ffmpeg:
        return sys_ffmpeg
        
    # 3. مكتبة imageio_ffmpeg المثبتة مع بايثون
    try:
        import imageio_ffmpeg
        exe = imageio_ffmpeg.get_ffmpeg_exe()
        if exe and os.path.isfile(exe):
            return exe
    except Exception:
        pass
        
    # 4. مسارات شائعة في ويندوز
    common_paths = [
        r"C:\ProgramData\chocolatey\bin\ffmpeg.exe",
        r"C:\ffmpeg\bin\ffmpeg.exe",
        os.path.expandvars(r"%LOCALAPPDATA%\Microsoft\WinGet\Links\ffmpeg.exe")
    ]
    for p in common_paths:
        if os.path.isfile(p):
            return p
            
    return None

def build_filter_chain(include_loudnorm=True):
    """بناء سلسلة فلاتر ffmpeg المعتمدة"""
    filters = [
        "silenceremove=start_periods=1:start_silence=0.05:start_threshold=-45dB:detection=peak",
        "highpass=f=85",
        "equalizer=f=240:width_type=o:width=1.2:g=2.5",
        "equalizer=f=6800:width_type=o:width=1.5:g=-3.0"
    ]
    if include_loudnorm:
        filters.append("loudnorm=I=-16:TP=-1.5:LRA=11")
    filters.append("afade=t=in:st=0:d=0.015,areverse,afade=t=in:st=0:d=0.02,areverse")
    return ",".join(filters)

def master_single_file(ffmpeg_exe, in_path, out_path=None, backup=False):
    """معالجة ملف صوتي واحد باستخدام معايير الاستوديو"""
    if out_path is None:
        out_path = in_path

    if backup and os.path.abspath(in_path) != os.path.abspath(os.path.join(BACKUP_DIR, os.path.basename(in_path))):
        os.makedirs(BACKUP_DIR, exist_ok=True)
        bak_file = os.path.join(BACKUP_DIR, os.path.basename(in_path))
        if not os.path.exists(bak_file):
            shutil.copy2(in_path, bak_file)

    temp_out = in_path + ".tmp.mp3"
    orig_size = os.path.getsize(in_path)

    # المحاولة الأولى مع loudnorm
    filter_chain = build_filter_chain(include_loudnorm=True)
    cmd = [
        ffmpeg_exe, "-y", "-i", in_path,
        "-af", filter_chain,
        "-codec:a", "libmp3lame", "-b:a", "64k", "-ar", "24000", "-ac", "1",
        temp_out
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    
    # في حال فشل loudnorm على المقاطع الفائقة القصر (< 0.5s)، إعادة المحاولة بالفلاتر الأساسية
    if res.returncode != 0:
        filter_chain_fallback = build_filter_chain(include_loudnorm=False)
        cmd_fallback = [
            ffmpeg_exe, "-y", "-i", in_path,
            "-af", filter_chain_fallback,
            "-codec:a", "libmp3lame", "-b:a", "64k", "-ar", "24000", "-ac", "1",
            temp_out
        ]
        res = subprocess.run(cmd_fallback, capture_output=True, text=True)
        if res.returncode != 0:
            if os.path.exists(temp_out):
                try: os.remove(temp_out)
                except Exception: pass
            return False, in_path, orig_size, orig_size, res.stderr

    if not os.path.exists(temp_out) or os.path.getsize(temp_out) == 0:
        if os.path.exists(temp_out):
            try: os.remove(temp_out)
            except Exception: pass
        return False, in_path, orig_size, orig_size, "Output file is empty"

    new_size = os.path.getsize(temp_out)
    moved = False
    for _ in range(6):
        try:
            if os.path.exists(out_path):
                os.replace(temp_out, out_path)
            else:
                shutil.move(temp_out, out_path)
            moved = True
            break
        except PermissionError:
            time.sleep(0.12)

    if not moved:
        try:
            shutil.copy2(temp_out, out_path)
            os.remove(temp_out)
        except Exception as e:
            return False, in_path, orig_size, orig_size, f"Move error: {e}"

    return True, in_path, orig_size, new_size, ""

def master_all_audio(input_dir=AUDIO_DIR, backup=False, max_workers=None, target_file=None):
    """معالجة كافة الملفات في المجلد أو ملف محدد بالتوازي"""
    ffmpeg_exe = find_ffmpeg()
    if not ffmpeg_exe:
        print("❌ لم يتم العثور على أداة ffmpeg على النظام.")
        print("   يرجى التأكد من تثبيت ffmpeg أو تعيين متغير البيئة FFMPEG_PATH")
        return False

    print("=" * 70)
    print("🎧 استوديو واقعية الأصوات ومعالجة الاستوديو الجماعية")
    print("   إعداد وتطوير: المهندس أسامة خليل هاشم")
    print(f"   مسار ffmpeg المعتمد: {ffmpeg_exe}")
    print("=" * 70)

    if target_file:
        files = [target_file] if os.path.isfile(target_file) else []
    else:
        files = sorted(glob.glob(os.path.join(input_dir, "*.mp3")))

    total_files = len(files)
    if total_files == 0:
        print(f"⚠️ لم يتم العثور على أي ملفات صوتية للمعالجة في {input_dir}")
        return True

    print(f"📂 إجمالي الملفات المكتشفة: {total_files} ملف صوتي.")
    if backup:
        print(f"📦 تفعيل النسخ الاحتياطي في: {BACKUP_DIR}")

    workers = max_workers or min(32, (os.cpu_count() or 4) * 2)
    print(f"⚡ بدء المعالجة المتوازية عبر {workers} مسارات متزامنة...")

    t0 = time.time()
    success_count = 0
    fail_count = 0
    total_orig_bytes = 0
    total_new_bytes = 0

    with ThreadPoolExecutor(max_workers=workers) as executor:
        future_map = {
            executor.submit(master_single_file, ffmpeg_exe, f, None, backup): f
            for f in files
        }
        done_count = 0
        for fut in as_completed(future_map):
            done_count += 1
            ok, fpath, orig_b, new_b, err = fut.result()
            total_orig_bytes += orig_b
            total_new_bytes += new_b
            if ok:
                success_count += 1
            else:
                fail_count += 1
                print(f"\n⚠️ تنبيه على الملف {os.path.basename(fpath)}: {err.strip()[:100]}")

            if done_count % 100 == 0 or done_count == total_files:
                pct = (done_count / total_files) * 100
                sys.stdout.write(f"\r⏳ تم إنجاز: {done_count}/{total_files} ({pct:.1f}%) | نجاح: {success_count} | تعذر: {fail_count}")
                sys.stdout.flush()

    t1 = time.time()
    print("\n" + "=" * 70)
    print("✨ اكتملت المعالجة الاستوديوية بنجاح تام!")
    print(f"   ⏱️ الزمن المستغرق: {t1 - t0:.1f} ثانية")
    print(f"   ✔ الملفات المعالجة بنجاح: {success_count}/{total_files}")
    if fail_count > 0:
        print(f"   ⚠️ ملفات واجهت تنبيهات: {fail_count}")
    
    orig_mb = total_orig_bytes / (1024 * 1024)
    new_mb = total_new_bytes / (1024 * 1024)
    saved_mb = orig_mb - new_mb
    saved_pct = (saved_mb / orig_mb * 100) if orig_mb > 0 else 0
    print(f"   📊 الحجم السابق: {orig_mb:.2f} ميغابايت")
    print(f"   📊 الحجم الجديد: {new_mb:.2f} ميغابايت")
    print(f"   💾 الوفر المحقق: {saved_mb:.2f} ميغابايت ({saved_pct:.1f}%)")
    print("=" * 70)
    return fail_count == 0

def main():
    parser = argparse.ArgumentParser(description="أداة المعالجة الصوتية الاستوديوية لمنصة قراءتي")
    parser.add_argument("--file", type=str, help="معالجة ملف صوتي واحد محدد")
    parser.add_argument("--dir", type=str, default=AUDIO_DIR, help="مجلد الملفات الصوتية")
    parser.add_argument("--backup", action="store_true", default=True, help="حفظ نسخة احتياطية خام في audio_backup_raw/")
    parser.add_argument("--workers", type=int, default=None, help="عدد خيوط المعالجة المتزامنة")
    args = parser.parse_args()

    master_all_audio(
        input_dir=args.dir,
        backup=args.backup,
        max_workers=args.workers,
        target_file=args.file
    )

if __name__ == '__main__':
    main()
