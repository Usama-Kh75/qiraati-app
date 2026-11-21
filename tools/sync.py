#!/usr/bin/env python3
"""
أداة المزامنة الفورية لكاش الخدمة وقائمة السماح وفحوصات الجودة
إعداد وتطوير: المهندس أسامة خليل هاشم

تقوم هذه الأداة بمسح تلقائي للأصول الصوتية والصور المتتبعة في git،
وتحديث مصفوفة ASSETS_TO_CACHE في ملف sw.js وترقية نسخة الكاش،
والتحقق من سلامة كافة الفحوصات في ثوانٍ معدودة.
"""

import os
import sys
import re
import subprocess
import time

def get_git_tracked_files(pattern=None):
    cmd = ['git', '-c', 'core.quotepath=false', 'ls-files']
    if pattern:
        cmd.append(pattern)
    res = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8')
    if res.returncode != 0:
        raise RuntimeError(f"فشل تنفيذ أمر git ls-files: {res.stderr}")
    return [line.strip() for line in res.stdout.splitlines() if line.strip()]

def sync_assets(bump_cache=False):
    t0 = time.time()
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    sw_path = os.path.join(base_dir, 'sw.js')

    print("=" * 65)
    print("بدء المزامنة الفورية لأصول منصة قراءتي الذكية...")
    print("=" * 65)

    # 1. جلب الملفات الصوتية المتتبعة في git
    tracked_mp3s = get_git_tracked_files('audio/*.mp3')
    print(f"✔ تم العثور على {len(tracked_mp3s)} ملف صوتي متتبَّع في audio/.")

    # 2. جلب كافة الصور المتتبعة في git (يشمل icons والصور الجذرية)
    tracked_pngs = get_git_tracked_files('*.png')
    print(f"✔ تم العثور على {len(tracked_pngs)} صورة PNG متتبَّعة في git.")

    # 3. قراءة sw.js واستخراج رقم النسخة الحالية
    with open(sw_path, 'r', encoding='utf-8') as f:
        sw_txt = f.read()

    v_match = re.search(r"const\s+CACHE_NAME\s*=\s*'qiraati-smart-v(\d+)';", sw_txt)
    cur_ver = int(v_match.group(1)) if v_match else 38
    new_ver = cur_ver + 1 if bump_cache else cur_ver

    # 4. بناء مصفوفة ASSETS_TO_CACHE النظيفة والمنظمة
    core_assets = [
        "'./'",
        "'./index.html'",
        "'./manifest.json'",
        "'./audio_data.js'",
        "'./audio_data_unit6.js'",
        "'./curriculum_data.js'",
        "'./css/variables.css'",
        "'./css/layout.css'",
        "'./css/components.css'",
        "'./css/stations.css'",
        "'./css/lessons-prep.css'",
        "'./css/lessons-unit1.css'",
        "'./css/lessons-unit2.css'",
        "'./css/lessons-unit3.css'",
        "'./css/lessons-unit4.css'",
        "'./css/lessons-unit5.css'",
        "'./css/lessons-unit6.css'",
        "'./css/evaluation.css'",
        "'./css/enrichment.css'",
        "'./css/blackboard.css'",
        "'./css/games.css'",
        "'./css/gamification.css'",
        "'./css/teacher-dashboard.css'",
        "'./css/classroom-sync.css'",
        "'./css/classroom-quiz.css'",
        "'./css/interactive-guide.css'",
        "'./css/diagnostic-exams.css'",
        "'./css/voice-coach.css'",
        "'./css/dictation-lab.css'",
        "'./css/readers-theater.css'",
        "'./css/nasheed-studio.css'",
        "'./js/core/modals.js'",
        "'./js/core/audio.js'",
        "'./js/core/navigation.js'",
        "'./js/core/evaluation.js'",
        "'./js/core/enrichment.js'",
        "'./js/core/blackboard.js'",
        "'./js/core/games.js'",
        "'./js/core/gamification.js'",
        "'./js/core/teacher-dashboard.js'",
        "'./js/core/classroom-sync.js'",
        "'./js/core/classroom-quiz.js'",
        "'./js/core/interactive-guide.js'",
        "'./js/core/diagnostic-exams.js'",
        "'./js/core/voice-coach.js'",
        "'./js/core/dictation-lab.js'",
        "'./js/core/readers-theater.js'",
        "'./js/core/nasheed-studio.js'",
        "'./js/lessons/prep.js'",
        "'./js/lessons/unit1.js'",
        "'./js/lessons/unit2.js'",
        "'./js/lessons/unit3.js'",
        "'./js/lessons/unit4.js'",
        "'./js/lessons/unit5.js'",
        "'./js/lessons/unit6.js'",
        "'./js/app.js'"
    ]

    image_assets = [f"'./{img}'" for img in sorted(tracked_pngs)]
    audio_assets = [f"'./{mp3}'" for mp3 in sorted(tracked_mp3s)]

    all_cache_entries = core_assets + image_assets + audio_assets
    cache_array_str = ",\n\n  ".join(all_cache_entries)

    # 5. استبدال مصفوفة ASSETS_TO_CACHE ورقم النسخة في sw.js
    new_sw_txt = re.sub(
        r"const\s+CACHE_NAME\s*=\s*'qiraati-smart-v\d+';",
        f"const CACHE_NAME = 'qiraati-smart-v{new_ver}';",
        sw_txt
    )

    new_sw_txt = re.sub(
        r"const\s+ASSETS_TO_CACHE\s*=\s*\[[\s\S]*?\];",
        f"const ASSETS_TO_CACHE = [\n\n  {cache_array_str}\n\n];",
        new_sw_txt
    )

    with open(sw_path, 'w', encoding='utf-8') as f:
        f.write(new_sw_txt)

    t1 = time.time()
    print(f"✔ تم تحديث sw.js بنجاح (الكاش: qiraati-smart-v{new_ver})")
    print(f"   إجمالي الأصول المخزنة: {len(all_cache_entries)} أصلاً ({len(core_assets)} أساسي + {len(image_assets)} صور + {len(audio_assets)} صوت).")
    print(f"   زمن المزامنة: {(t1 - t0)*1000:.1f} مللي ثانية.")

    # 6. تشغيل فحص ما قبل الدفع للتحقق التلقائي
    print("\n" + "=" * 65)
    print("التحقق الفوري من سلامة جميع الفحوصات:")
    print("=" * 65)
    hook_path = os.path.join(base_dir, '.git', 'hooks', 'pre-push.mjs')
    if os.path.exists(hook_path):
        subprocess.run(['node', hook_path], check=False)

if __name__ == '__main__':
    bump = '--bump' in sys.argv
    sync_assets(bump_cache=bump)
