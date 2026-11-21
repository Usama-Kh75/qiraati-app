#!/usr/bin/env python3
"""
أداة الفحص والتدقيق التكاملي الشامل واختبار تجربة المستخدم (UX / Integration Audit)
لمنصة قراءتي التفاعلية الذكية لكافة الوحدات والألعاب والسبورات والأنظمة المرافقة
إعداد وتطوير: المهندس أسامة خليل هاشم
"""

import os
import re
import glob
import subprocess

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def run_integration_audit():
    print("=" * 75)
    print("🚀 بدء التدقيق التكاملي الشامل واختبار تجربة المستخدم لمنصة قراءتي الذكية")
    print("   إعداد وتطوير: المهندس أسامة خليل هاشم")
    print("=" * 75)

    errors = []
    warnings = []
    successes = []

    # 1. تجميع وقراءة كافة محتويات HTML
    views_dir = os.path.join(BASE_DIR, 'views')
    top_shell_path = os.path.join(views_dir, 'app-shell-top.html')
    bottom_shell_path = os.path.join(views_dir, 'app-shell-bottom.html')
    index_path = os.path.join(BASE_DIR, 'index.html')

    with open(top_shell_path, 'r', encoding='utf-8') as f:
        top_html = f.read()
    with open(bottom_shell_path, 'r', encoding='utf-8') as f:
        bottom_html = f.read()
    with open(index_path, 'r', encoding='utf-8') as f:
        index_html = f.read()

    # جمع كافة واجهات الدروس بمفتاح مسار فريد
    unit_dirs = ['prep', 'unit1', 'unit2', 'unit3', 'unit4', 'unit5', 'unit6']
    all_views_html = {}
    for u in unit_dirs:
        u_path = os.path.join(views_dir, u)
        if os.path.exists(u_path):
            for vf in sorted(glob.glob(os.path.join(u_path, '*.html'))):
                rel_key = f"{u}/{os.path.basename(vf)}"
                with open(vf, 'r', encoding='utf-8') as f:
                    all_views_html[rel_key] = f.read()

    combined_html = top_html + "\n" + "\n".join(all_views_html.values()) + "\n" + bottom_html

    # استخراج كافة الـ IDs الموجودة في HTML
    dom_ids = set(re.findall(r'id=["\']([^"\']+)["\']', combined_html))
    print(f"✔ تم فحص واجهات HTML: تم العثور على {len(dom_ids)} معرّف فريد (DOM ID) في {len(all_views_html)} واجهة.")

    # 2. فحص مطابقة وتكامل وحدات المنهج الـ 46
    curr_path = os.path.join(BASE_DIR, 'curriculum_data.js')
    with open(curr_path, 'r', encoding='utf-8') as f:
        curr_txt = f.read()

    lesson_ids = re.findall(r'id:\s*"(tab-[^"]+)"', curr_txt)
    print(f"✔ فحص وحدات المنهج: {len(lesson_ids)} درساً معتمداً.")

    for lid in lesson_ids:
        expected_view_id = f"view-{lid}"
        if expected_view_id not in dom_ids:
            errors.append(f"واجهة الدرس مفقودة في HTML: {expected_view_id}")
    if not any("واجهة الدرس مفقودة" in e for e in errors):
        successes.append(f"كافة واجهات الدروس الـ {len(lesson_ids)} متكاملة ومطابقة بنسبة 100%.")

    # عناصر تُبنى ديناميكياً داخل DOM بواسطة محركات JavaScript (Dynamic Template Elements)
    dynamic_dom_elements = {
        'anatomyDescText', 'anatomyNaskhChar',
        'btnNextQuestion', 'examFeedbackBox',
        'evalConfettiCanvas',
        'gamificationStarsCanvas', 'certEditableName',
        'classroomNoticeToast',
        'hostOptionCard_0', 'hostOptionCard_1', 'hostOptionCard_2', 'hostOptionCard_3',
        'hostOptionCount_0', 'hostOptionCount_1', 'hostOptionCount_2', 'hostOptionCount_3'
    }

    # 3. فحص المعرفات البرمجية المستخدمة في ملفات JavaScript الأساسية
    js_files = {
        'games.js': os.path.join(BASE_DIR, 'js', 'core', 'games.js'),
        'blackboard.js': os.path.join(BASE_DIR, 'js', 'core', 'blackboard.js'),
        'enrichment.js': os.path.join(BASE_DIR, 'js', 'core', 'enrichment.js'),
        'evaluation.js': os.path.join(BASE_DIR, 'js', 'core', 'evaluation.js'),
        'gamification.js': os.path.join(BASE_DIR, 'js', 'core', 'gamification.js'),
        'teacher-dashboard.js': os.path.join(BASE_DIR, 'js', 'core', 'teacher-dashboard.js'),
        'classroom-sync.js': os.path.join(BASE_DIR, 'js', 'core', 'classroom-sync.js'),
        'classroom-quiz.js': os.path.join(BASE_DIR, 'js', 'core', 'classroom-quiz.js'),
        'interactive-guide.js': os.path.join(BASE_DIR, 'js', 'core', 'interactive-guide.js'),
        'audio.js': os.path.join(BASE_DIR, 'js', 'core', 'audio.js'),
        'navigation.js': os.path.join(BASE_DIR, 'js', 'core', 'navigation.js'),
        'modals.js': os.path.join(BASE_DIR, 'js', 'core', 'modals.js'),
        'app.js': os.path.join(BASE_DIR, 'js', 'app.js'),
    }

    print("\n--- فحص تكامل ملفات الجافاسكربت مع عناصر واجهة المستخدم ---")
    for js_name, js_path in js_files.items():
        if not os.path.exists(js_path):
            errors.append(f"الملف {js_name} غير موجود على القرص!")
            continue
        with open(js_path, 'r', encoding='utf-8') as f:
            js_txt = f.read()

        # استخراج getElementById
        elem_ids = re.findall(r'getElementById\(["\']([^"\']+)["\']\)', js_txt)
        missing_in_html = [eid for eid in set(elem_ids) if eid not in dom_ids and eid not in dynamic_dom_elements]
        if missing_in_html:
            errors.append(f"معرفات مستخدمة في {js_name} ولكنها غير موجودة في HTML ({len(missing_in_html)}): {missing_in_html}")
        else:
            successes.append(f"جميع عناصر getElementById في {js_name} ({len(set(elem_ids))} عنصر) موجودة ومربوطة في HTML بنجاح.")

    # 4. فحص الألعاب السبعة في بنك الألعاب اللغوية
    print("\n--- فحص بنك الألعاب اللغوية التفاعلية (7 ألعاب للشاشات الذكية) ---")
    games_tabs = [
        ('عجلة الحظ الدوارة', 'tabGames_wheel', 'paneGames_wheel'),
        ('تحدي الفريقين (شاشة ذكية)', 'tabGames_battle', 'paneGames_battle'),
        ('صائد الفقاعات والكلمات', 'tabGames_bubble', 'paneGames_bubble'),
        ('قطار المقاطع والتركيب', 'tabGames_train', 'paneGames_train'),
        ('صندوق الذاكرة (3D Flip)', 'tabGames_memory', 'paneGames_memory'),
        ('ميزان اللام الشمسية والقمرية', 'tabGames_sorter', 'paneGames_sorter'),
        ('من سيربح وسام القراءة الذهبي', 'tabGames_quiz', 'paneGames_quiz')
    ]

    for g_title, tab_id, pane_id in games_tabs:
        if tab_id not in dom_ids:
            errors.append(f"تبويب اللعبة {g_title} ({tab_id}) مفقود في HTML!")
        if pane_id not in dom_ids:
            errors.append(f"حاوية اللعبة {g_title} ({pane_id}) مفقودة في HTML!")
    if not any("تبويب اللعبة" in e or "حاوية اللعبة" in e for e in errors):
        successes.append("كافة الألعاب السبعة (7 ألعاب) متكاملة التبويبات والحاويات بنسبة 100%.")

    # 5. فحص سبورة تتبع الحروف ومختبر الخط (4 تبويبات)
    print("\n--- فحص سبورة تتبع الحروف ومختبر الخط العربي ---")
    bb_tabs = [
        ('تتبع ورسم الحروف', 'tabBlackboard_trace', 'paneBlackboard_trace'),
        ('مختبر تشريح الحرف', 'tabBlackboard_anatomy', 'paneBlackboard_anatomy'),
        ('سبورة الرسم الحر', 'tabBlackboard_freehand', 'paneBlackboard_freehand'),
        ('كراسة أوراق العمل A4', 'tabBlackboard_print', 'paneBlackboard_print')
    ]
    for b_title, tab_id, pane_id in bb_tabs:
        if tab_id not in dom_ids:
            errors.append(f"تبويب السبورة {b_title} ({tab_id}) مفقود!")
        if pane_id not in dom_ids:
            errors.append(f"حاوية السبورة {b_title} ({pane_id}) مفقودة!")
    if not any("تبويب السبورة" in e or "حاوية السبورة" in e for e in errors):
        successes.append("كافة أقسام سبورة الحروف والخط (4 أقسام) متكاملة بنسبة 100%.")

    # 6. فحص منظومة الإثراء وبنك البطاقات (4 تبويبات)
    print("\n--- فحص منظومة الإثراء وبنك بطاقات القراءة الذكية ---")
    enrich_tabs = [
        ('اختبارات نهاية الفصل', 'tabEnrich_exams', 'paneEnrich_exams'),
        ('التدريبات الصيفية', 'tabEnrich_summer', 'paneEnrich_summer'),
        ('بطاقات القراءة 3D', 'tabEnrich_cards', 'paneEnrich_cards'),
        ('مركز الطباعة الورقية', 'tabEnrich_print', 'paneEnrich_print')
    ]
    for e_title, tab_id, pane_id in enrich_tabs:
        if tab_id not in dom_ids:
            errors.append(f"تبويب الإثراء {e_title} ({tab_id}) مفقود!")
        if pane_id not in dom_ids:
            errors.append(f"حاوية الإثراء {e_title} ({pane_id}) مفقودة!")
    if not any("تبويب الإثراء" in e or "حاوية الإثراء" in e for e in errors):
        successes.append("كافة أقسام منظومة الإثراء والاختبارات (4 أقسام) متكاملة بنسبة 100%.")

    # 7. فحص منظومة تقييم التلاميذ وشهادة التخرج (3 تبويبات)
    print("\n--- فحص منظومة التقييم وشهادة التخرج وسجل الإنجاز ---")
    eval_tabs = [
        ('التقييم الأسبوعي', 'tabEval_eval', 'paneEval_eval'),
        ('شهادة التخرج الكبرى', 'tabEval_cert', 'paneEval_cert'),
        ('سجل الإنجاز والأوسمة', 'tabEval_progress', 'paneEval_progress')
    ]
    for ev_title, tab_id, pane_id in eval_tabs:
        if tab_id not in dom_ids:
            errors.append(f"تبويب التقييم {ev_title} ({tab_id}) مفقود!")
        if pane_id not in dom_ids:
            errors.append(f"حاوية التقييم {ev_title} ({pane_id}) مفقودة!")
    if not any("تبويب التقييم" in e or "حاوية التقييم" in e for e in errors):
        successes.append("كافة أقسام منظومة التقييم وسجل الإنجاز والشهادة (3 أقسام) متكاملة بنسبة 100%.")

    # 7 ب. فحص نظام التحدي والتقييم الذكي وتحدي النجوم (4 تبويبات)
    print("\n--- فحص نظام الاختبار والتقييم الذكي (Gamification & Stars) ---")
    gamification_tabs = [
        ('ساحة التحدي والمسابقة', 'tabGamification_challenge', 'paneGamification_challenge'),
        ('خزانة الأوسمة ورتب الأبطال', 'tabGamification_badges', 'paneGamification_badges'),
        ('شهادة بطل التحدي الفاخرة', 'tabGamification_certificate', 'paneGamification_certificate'),
        ('لوحة الذكاء والتقييم القرائي', 'tabGamification_analytics', 'paneGamification_analytics')
    ]
    for gm_title, tab_id, pane_id in gamification_tabs:
        if tab_id not in dom_ids:
            errors.append(f"تبويب التحدي {gm_title} ({tab_id}) مفقود!")
        if pane_id not in dom_ids:
            errors.append(f"حاوية التحدي {gm_title} ({pane_id}) مفقودة!")
    if not any("تبويب التحدي" in e or "حاوية التحدي" in e for e in errors):
        successes.append("كافة أقسام نظام الاختبار والتقييم الذكي (4 أقسام) متكاملة بنسبة 100%.")

    # 7 ج. فحص لوحة تحكم المعلم وسجل الصف والتقارير المطبوعة أوفلاين (7 تبويبات)
    print("\n--- فحص لوحة تحكم المعلم وإدارة سجل تقدم التلاميذ والتقارير (Teacher Dashboard) ---")
    teacher_tabs = [
        ('المؤشرات والتحليلات الصفية', 'tabTeacher_overview', 'paneTeacher_overview'),
        ('سجل إدارة وتتبع التلاميذ', 'tabTeacher_roster', 'paneTeacher_roster'),
        ('سجل الحضور والغياب اليومي', 'tabTeacher_attendance', 'paneTeacher_attendance'),
        ('خطة الدعم والمعالجة الفونيمية', 'tabTeacher_remedial', 'paneTeacher_remedial'),
        ('التقارير المطبوعة والشهادات أوفلاين', 'tabTeacher_reports', 'paneTeacher_reports'),
        ('إعدادات الصف وإدارة البيانات', 'tabTeacher_settings', 'paneTeacher_settings'),
        ('المزامنة والرادار الصفي الحي', 'tabTeacher_sync', 'paneTeacher_sync')
    ]
    for t_title, tab_id, pane_id in teacher_tabs:
        if tab_id not in dom_ids:
            errors.append(f"تبويب لوحة المعلم {t_title} ({tab_id}) مفقود!")
        if pane_id not in dom_ids:
            errors.append(f"حاوية لوحة المعلم {t_title} ({pane_id}) مفقودة!")
    if not any("تبويب لوحة المعلم" in e or "حاوية لوحة المعلم" in e for e in errors):
        successes.append("كافة أقسام لوحة تحكم المعلم وسجل الصف والتقارير المطبوعة (7 أقسام) متكاملة بنسبة 100%.")

    # 7 د. فحص محرك المزامنة الصفية المحلية أوفلاين (Classroom Local Offline Sync)
    print("\n--- فحص محرك المزامنة الصفية المحلية أوفلاين وشبكة التابلت (Local Offline Sync) ---")
    sync_elements = [
        ('زر المزامنة بالشريط العلوي', 'btnTopClassSync'),
        ('نافذة مزامنة التابلت للتلميذ', 'classroomSyncModal'),
        ('شاشة وضع انتباه الصف (قفل الشاشات)', 'classroomFocusOverlay'),
        ('نافذة ماسح كود التلميذ بالكاميرا', 'classroomQrScanModal'),
        ('قائمة التوجيه الصفي الجماعي للدروس', 'syncBroadcastLessonSelect'),
        ('شبكة رادار أجهزة التابلت الحية', 'classroomRadarGrid')
    ]
    for s_title, s_id in sync_elements:
        if s_id not in dom_ids:
            errors.append(f"عنصر المزامنة الصفية {s_title} ({s_id}) مفقود!")
    if not any("عنصر المزامنة الصفية" in e for e in errors):
        successes.append("كافة عناصر محرك المزامنة الصفية وشاشات التابلت والرادار الحي متكاملة بنسبة 100%.")

    # 7 هـ. فحص محرك المسابقات التنافسية الصفية المباشرة (Classroom Live Quiz & Game Show)
    print("\n--- فحص محرك المسابقات التنافسية الصفية المباشرة (Classroom Live Quiz & Game Show) ---")
    quiz_elements = [
        ('زر المسابقات بالشريط العلوي', 'btnTopQuizShow'),
        ('نافذة المسابقات الرئيسية', 'classroomQuizModal'),
        ('تبويب شاشة العرض الذكية', 'tabQuizMode_host'),
        ('تبويب لوحة التابلت', 'tabQuizMode_tablet'),
        ('تبويب السبورة المباشرة', 'tabQuizMode_hotseat'),
        ('حاوية شاشة العرض الذكية', 'quizPane_host'),
        ('حاوية لوحة التابلت', 'quizPane_tablet'),
        ('حاوية السبورة المباشرة', 'quizPane_hotseat'),
        ('مرحلة إعداد المسابقة', 'quizHostStage_setup'),
        ('مرحلة انتظار اللوبي', 'quizHostStage_lobby'),
        ('مرحلة السؤال التنافسي', 'quizHostStage_question'),
        ('مرحلة كشف النتيجة', 'quizHostStage_revealed'),
        ('مرحلة لوحة الصدارة', 'quizHostStage_leaderboard'),
        ('مرحلة منصة التتويج الكبرى', 'quizHostStage_podium'),
        ('كانفاس تتويج الأبطال', 'quizPodiumConfettiCanvas'),
        ('زر بزر التابلت الأحمر', 'tabletBtnOption_0'),
        ('زر بزر التابلت الأزرق', 'tabletBtnOption_1'),
        ('زر بزر التابلت الأصفر', 'tabletBtnOption_2'),
        ('زر بزر التابلت الأخضر', 'tabletBtnOption_3')
    ]
    for q_title, q_id in quiz_elements:
        if q_id not in dom_ids:
            errors.append(f"عنصر المسابقات التنافسية {q_title} ({q_id}) مفقود!")
    if not any("عنصر المسابقات التنافسية" in e for e in errors):
        successes.append("كافة عناصر محرك المسابقات التنافسية الصفية وأجهزة التابلت واستوديو العرض (18 عنصراً) متكاملة بنسبة 100%.")

    # 7 و. فحص جولة الاستكشاف ودليل المعلم وولي الأمر الرقمي (Guided Tour & Digital Guide)
    print("\n--- فحص جولة الاستكشاف ودليل المعلم وولي الأمر الرقمي (Guided Tour & Digital Guide) ---")
    guide_tabs = [
        ('فلسفة المنهج الفونيمي', 'tabGuide_phonics', 'paneGuide_phonics'),
        ('دليل المعلم وإدارة الحصة', 'tabGuide_teacher', 'paneGuide_teacher'),
        ('استوديو المسابقات التنافسية', 'tabGuide_quiz', 'paneGuide_quiz'),
        ('المزامنة وشبكة التابلت', 'tabGuide_sync', 'paneGuide_sync'),
        ('دليل ولي الأمر المنزلي', 'tabGuide_parent', 'paneGuide_parent'),
        ('الدعم التقني والتثبيت', 'tabGuide_tech', 'paneGuide_tech')
    ]
    for g_title, tab_id, pane_id in guide_tabs:
        if tab_id not in dom_ids:
            errors.append(f"تبويب الدليل {g_title} ({tab_id}) مفقود!")
        if pane_id not in dom_ids:
            errors.append(f"حاوية الدليل {g_title} ({pane_id}) مفقودة!")
    if not any("تبويب الدليل" in e or "حاوية الدليل" in e for e in errors):
        successes.append("كافة فصول دليل المعلم وولي الأمر الرقمي (6 فصول) متكاملة بنسبة 100%.")

    tour_and_guide_elements = [
        ('زر جولة الاستكشاف بالشريط العلوي', 'btnTopTour'),
        ('زر دليل المنصة والمسابقات بالشريط العلوي', 'btnTopDigitalGuide'),
        ('حاوية جولة الاستكشاف', 'platformTourOverlay'),
        ('صندوق تمييز العنصر في الجولة', 'platformTourTargetHighlight'),
        ('بطاقة توجيه الجولة التفاعلية', 'platformTourPopover'),
        ('نافذة دليل المنصة والمسابقات', 'digitalGuideModal'),
        ('حاوية طباعة الدليل الرسمية', 'guidePrintArea')
    ]
    for tg_title, tg_id in tour_and_guide_elements:
        if tg_id not in dom_ids:
            errors.append(f"عنصر الجولة والدليل {tg_title} ({tg_id}) مفقود!")
    if not any("عنصر الجولة والدليل" in e for e in errors):
        successes.append("كافة عناصر جولة الاستكشاف التفاعلية ودليل المنصة (7 عناصر) متكاملة بنسبة 100%.")

    # 8. فحص عزل مفاتيح التخزين المحلي (LocalStorage Key Hygiene)
    print("\n--- فحص عزل مفاتيح التخزين المحلي (قواعد أسامة) ---")
    storage_keys = []
    for js_name, js_path in js_files.items():
        with open(js_path, 'r', encoding='utf-8') as f:
            js_txt = f.read()
        matches = re.findall(r'localStorage\.(?:getItem|setItem|removeItem)\(["\']([^"\']+)["\']', js_txt)
        storage_keys.extend(matches)

    invalid_keys = [k for k in storage_keys if not (k.startswith('qiraati_') or k.startswith('qiraati-'))]
    if invalid_keys:
        errors.append(f"توجد مفاتيح تخزين محلي غير معزولة ببادئة التطبيق: {set(invalid_keys)}")
    else:
        successes.append(f"جميع مفاتيح التخزين المحلي ({len(set(storage_keys))} مفتاح) معزولة ببادئة qiraati بنسبة 100%.")

    # 9. فحص ارتباط وتضمين كافة ملفات CSS و JS في index.html
    print("\n--- فحص سلامة استدعاء ملفات CSS و JS داخل index.html ---")
    css_files = [
        'css/variables.css', 'css/layout.css', 'css/components.css', 'css/stations.css',
        'css/lessons-prep.css', 'css/lessons-unit1.css', 'css/lessons-unit2.css',
        'css/lessons-unit3.css', 'css/lessons-unit4.css', 'css/lessons-unit5.css',
        'css/lessons-unit6.css', 'css/evaluation.css', 'css/enrichment.css',
        'css/blackboard.css', 'css/games.css', 'css/gamification.css', 'css/teacher-dashboard.css',
        'css/classroom-sync.css', 'css/classroom-quiz.css', 'css/interactive-guide.css'
    ]
    for cf in css_files:
        if cf not in index_html:
            errors.append(f"ملف الأنماط {cf} غير مستدعى في index.html!")
    if not any("غير مستدعى في index.html" in e for e in errors):
        successes.append(f"كافة ملفات CSS الـ ({len(css_files)} ملف) مستدعاة بشكل صحيح.")

    core_scripts = [
        'audio_data.js', 'audio_data_unit6.js', 'curriculum_data.js',
        'js/core/modals.js', 'js/core/audio.js', 'js/core/navigation.js',
        'js/core/evaluation.js', 'js/core/enrichment.js', 'js/core/blackboard.js',
        'js/core/games.js', 'js/core/gamification.js', 'js/core/teacher-dashboard.js',
        'js/core/classroom-sync.js', 'js/core/classroom-quiz.js', 'js/core/interactive-guide.js', 'js/app.js'
    ]
    for cs in core_scripts:
        if cs not in index_html:
            errors.append(f"السكربت الأساسي {cs} غير مستدعى في index.html!")
    if not any("السكربت الأساسي" in e for e in errors):
        successes.append(f"كافة السكربتات الأساسية الـ ({len(core_scripts)} سكربت) مستدعاة بترتيب صحيح.")

    # 10. فحص وجود التوقيع الرسمي في جميع المكونات
    official_signature = "أسامة خليل هاشم"
    sig_targets = [
        ('index.html', index_html),
        ('README.md', open(os.path.join(BASE_DIR, 'README.md'), encoding='utf-8').read()),
        ('manifest.json', open(os.path.join(BASE_DIR, 'manifest.json'), encoding='utf-8').read()),
        ('views/app-shell-top.html', top_html),
        ('views/app-shell-bottom.html', bottom_html),
        ('sw.js', open(os.path.join(BASE_DIR, 'sw.js'), encoding='utf-8').read()),
        ('js/core/games.js', open(os.path.join(BASE_DIR, 'js', 'core', 'games.js'), encoding='utf-8').read()),
        ('js/core/blackboard.js', open(os.path.join(BASE_DIR, 'js', 'core', 'blackboard.js'), encoding='utf-8').read()),
        ('js/core/enrichment.js', open(os.path.join(BASE_DIR, 'js', 'core', 'enrichment.js'), encoding='utf-8').read()),
        ('js/core/evaluation.js', open(os.path.join(BASE_DIR, 'js', 'core', 'evaluation.js'), encoding='utf-8').read()),
        ('js/core/gamification.js', open(os.path.join(BASE_DIR, 'js', 'core', 'gamification.js'), encoding='utf-8').read()),
        ('js/core/teacher-dashboard.js', open(os.path.join(BASE_DIR, 'js', 'core', 'teacher-dashboard.js'), encoding='utf-8').read()),
        ('js/core/classroom-sync.js', open(os.path.join(BASE_DIR, 'js', 'core', 'classroom-sync.js'), encoding='utf-8').read()),
        ('js/core/classroom-quiz.js', open(os.path.join(BASE_DIR, 'js', 'core', 'classroom-quiz.js'), encoding='utf-8').read()),
        ('css/teacher-dashboard.css', open(os.path.join(BASE_DIR, 'css', 'teacher-dashboard.css'), encoding='utf-8').read()),
        ('css/classroom-sync.css', open(os.path.join(BASE_DIR, 'css', 'classroom-sync.css'), encoding='utf-8').read()),
        ('css/classroom-quiz.css', open(os.path.join(BASE_DIR, 'css', 'classroom-quiz.css'), encoding='utf-8').read()),
        ('css/interactive-guide.css', open(os.path.join(BASE_DIR, 'css', 'interactive-guide.css'), encoding='utf-8').read()),
        ('js/core/interactive-guide.js', open(os.path.join(BASE_DIR, 'js', 'core', 'interactive-guide.js'), encoding='utf-8').read()),
    ]
    for s_name, s_content in sig_targets:
        if official_signature not in s_content:
            errors.append(f"التوقيع الرسمي للمهندس أسامة خليل هاشم مفقود في {s_name}!")
    if not any("التوقيع الرسمي" in e for e in errors):
        successes.append("التوقيع الرسمي للمهندس أسامة خليل هاشم مثبت ومؤكد في كافة ملفات ومكونات المنصة.")

    # طباعة النتائج
    print("\n" + "=" * 75)
    print("ملخص تقرير الفحص والتدقيق التكاملي الشامل:")
    print("=" * 75)
    for s in successes:
        print(f"✔ {s}")

    if warnings:
        print(f"\n⚠️ تنبيهات ({len(warnings)}):")
        for w in warnings:
            print(f"   - {w}")

    if errors:
        print(f"\n❌ أخطاء مكتشفة ({len(errors)}):")
        for e in errors:
            print(f"   - {e}")
        return False
    else:
        print("\n🎉 النتيجة النهائية: تكامل تام بنسبة 100% وخالٍ تماماً من أي أخطاء برمجية أو تكاملية!")
        return True

if __name__ == '__main__':
    run_integration_audit()
