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
        'hostOptionCount_0', 'hostOptionCount_1', 'hostOptionCount_2', 'hostOptionCount_3',
        'vcKaraoke_0', 'vcKaraoke_1', 'vcKaraoke_2', 'vcKaraoke_3', 'vcKaraoke_4', 'vcKaraoke_5', 'vcKaraoke_6'
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
        'diagnostic-exams.js': os.path.join(BASE_DIR, 'js', 'core', 'diagnostic-exams.js'),
        'voice-coach.js': os.path.join(BASE_DIR, 'js', 'core', 'voice-coach.js'),
        'dictation-lab.js': os.path.join(BASE_DIR, 'js', 'core', 'dictation-lab.js'),
        'readers-theater.js': os.path.join(BASE_DIR, 'js', 'core', 'readers-theater.js'),
        'nasheed-studio.js': os.path.join(BASE_DIR, 'js', 'core', 'nasheed-studio.js'),
        'story-studio.js': os.path.join(BASE_DIR, 'js', 'core', 'story-studio.js'),
        'audio.js': os.path.join(BASE_DIR, 'js', 'core', 'audio.js'),
        'theme.js': os.path.join(BASE_DIR, 'js', 'core', 'theme.js'),
        'view-loader.js': os.path.join(BASE_DIR, 'js', 'core', 'view-loader.js'),
        'progress.js': os.path.join(BASE_DIR, 'js', 'core', 'progress.js'),
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

    # 8. فحص نظام الاختبارات التشخيصية وتوليد نماذج الامتحانات الوزارية الورقية A4
    print("\n--- فحص نظام الاختبارات التشخيصية وتوليد نماذج الامتحانات الوزارية الورقية A4 ---")
    diag_elements = [
        ('زر الامتحانات الوزارية بالشريط العلوي', 'btnTopDiagnosticExams'),
        ('نافذة الاختبارات والامتحانات الوزارية', 'diagnosticExamsModal'),
        ('تبويب مولد الامتحانات A4', 'tabDiag_generator'),
        ('حاوية مولد الامتحانات A4', 'paneDiag_generator'),
        ('تبويب مفاتيح التصحيح السريع', 'tabDiag_keys'),
        ('حاوية مفاتيح التصحيح السريع', 'paneDiag_keys'),
        ('تبويب الاختبار التشخيصي التفاعلي', 'tabDiag_test'),
        ('حاوية الاختبار التشخيصي التفاعلي', 'paneDiag_test'),
        ('تبويب سجل التشخيص الصفي', 'tabDiag_records'),
        ('حاوية سجل التشخيص الصفي', 'paneDiag_records'),
        ('حقل اسم المدرسة', 'examInpSchool'),
        ('حقل اسم المعلم', 'examInpTeacher'),
        ('حقل العام الدراسي', 'examInpYear'),
        ('حقل الدور الامتحاني', 'examInpTerm'),
        ('حقل الدرجة الكلية', 'examInpMarks'),
        ('قائمة اختيار نوع الاختبار التشخيصي', 'diagTestSelector'),
        ('قائمة اختيار التلميذ للتشخيص', 'diagStudentSelector'),
        ('حاوية معاينة الورقة الامتحانية A4', 'examPaperPreviewArea'),
        ('حاوية شيت مفاتيح التصحيح A4', 'diagMasterKeysContent'),
        ('منطقة أسئلة ونتائج الاختبار التشخيصي', 'diagMainContentArea'),
        ('قائمة سجلات التشخيص المحفوظة', 'diagRecordsListContainer')
    ]
    for de_title, de_id in diag_elements:
        if de_id not in dom_ids:
            errors.append(f"عنصر الاختبارات والامتحانات الوزارية {de_title} ({de_id}) مفقود!")
    if not any("عنصر الاختبارات والامتحانات الوزارية" in e for e in errors):
        successes.append(f"كافة عناصر نظام الاختبارات التشخيصية ومولد الامتحانات الوزارية A4 ({len(diag_elements)} عنصراً) متكاملة بنسبة 100%.")

    # 8 ج. فحص استوديو التدريب الصوتي والتعرف على نطق التلميذ أوفلاين (Speech Recognition & Voice Coach)
    print("\n--- فحص استوديو التدريب الصوتي والتعرف على نطق التلميذ أوفلاين ---")
    voice_coach_elements = [
        ('زر المدرب الصوتي بالشريط العلوي', 'btnTopVoiceCoach'),
        ('بطاقة المدرب الصوتي بالقائمة الجانبية', 'sidebarVoiceCoachCard'),
        ('نافذة استوديو التدريب الصوتي', 'voiceCoachModal'),
        ('تبويب استوديو النطق المباشر', 'tabVc_studio'),
        ('حاوية استوديو النطق المباشر', 'paneVc_studio'),
        ('تبويب مختبر مخارج الحروف', 'tabVc_articulation'),
        ('حاوية مختبر مخارج الحروف', 'paneVc_articulation'),
        ('تبويب استوديو الطلاقة لكلمات المنهج', 'tabVc_fluency'),
        ('حاوية استوديو الطلاقة لكلمات المنهج', 'paneVc_fluency'),
        ('تبويب قطار الجمل والقراءة الكاراوكي', 'tabVc_stories'),
        ('حاوية قطار الجمل والقراءة الكاراوكي', 'paneVc_stories'),
        ('تبويب سجل التسجيلات والتقارير A4', 'tabVc_portfolio'),
        ('حاوية سجل التسجيلات والتقارير A4', 'paneVc_portfolio'),
        ('كانفاس رسم الموجات الصوتية الحية', 'voiceCoachWaveform'),
        ('زر الميكروفون التفاعلي', 'btnVcMic'),
        ('زر استماع صوت التلميذ المقارن', 'btnVcPlayPupil'),
        ('مؤشر نسبة دقة النطق الفورية', 'vcGaugeValue'),
        ('شارة التغذية الراجعة الفونيمية', 'vcFeedbackBadge'),
        ('صندوق توجيهات المدرب الصوتي', 'vcCoachAdviceText'),
        ('حاوية حروف الهجاء الـ 28', 'vcLettersPaletteContainer'),
        ('حاوية شبكة كلمات الطلاقة المنهجية', 'vcFluencyWordsGrid'),
        ('حاوية نص الجملة التعبيرية الكاراوكي', 'vcStoryPassageContainer'),
        ('جدول سجل التسجيلات الصوتية', 'vcRecordsTableBody')
    ]
    for vc_title, vc_id in voice_coach_elements:
        if vc_id not in dom_ids:
            errors.append(f"عنصر استوديو التدريب الصوتي {vc_title} ({vc_id}) مفقود!")
    if not any("عنصر استوديو التدريب الصوتي" in e for e in errors):
        successes.append(f"كافة عناصر استوديو التدريب الصوتي والتعرف على نطق التلميذ ({len(voice_coach_elements)} عنصراً) متكاملة بنسبة 100%.")

    # فحص عناصر مختبر الإملاء المنظور والاختباري الذكي (Smart Phonics Spelling & Dictation Lab)
    print("\n--- فحص مختبر الإملاء المنظور والاختباري الذكي بالتحليل الصوتي الفوري ---")
    dictation_lab_elements = [
        ('نافذة مختبر الإملاء الرئيسية', 'dictationLabModal'),
        ('زر تبويب الإملاء المنظور', 'dlTabBtn_seen'),
        ('زر تبويب الإملاء الاختباري', 'dlTabBtn_blind'),
        ('زر تبويب سبورة الخط', 'dlTabBtn_whiteboard'),
        ('زر تبويب بنك المنهج', 'dlTabBtn_bank'),
        ('زر تبويب شيتات A4', 'dlTabBtn_worksheet'),
        ('زر تبويب لوحة الإنجاز', 'dlTabBtn_stats'),
        ('حاوية تبويب الإملاء المنظور', 'dlTabContent_seen'),
        ('حاوية تبويب الإملاء الاختباري', 'dlTabContent_blind'),
        ('حاوية تبويب سبورة الخط', 'dlTabContent_whiteboard'),
        ('حاوية تبويب بنك المنهج', 'dlTabContent_bank'),
        ('حاوية تبويب شيتات A4', 'dlTabContent_worksheet'),
        ('حاوية تبويب لوحة الإنجاز', 'dlTabContent_stats'),
        ('بطاقة عرض الكلمة المستهدفة', 'dlWordDisplayCard'),
        ('نص الكلمة المستهدفة', 'dlWordTargetText'),
        ('صف مقاطع الكلمة الملونة', 'dlWordSyllablesRow'),
        ('شارة المهارة الإملائية النشطة', 'dlActiveSkillBadge'),
        ('شريط تقدم مؤقت الإخفاء', 'dlTimerProgress'),
        ('حاوية خانات التهجئة التفاعلية', 'dlSlotsWrapper'),
        ('صف بطاقات الحروف المبعثرة', 'dlScrambledTilesRow'),
        ('بطاقة النتيجة والتشخيص التلقائي', 'dlResultCard'),
        ('أيقونة النتيجة الإملائية', 'dlResultIcon'),
        ('عنوان نتيجة التشخيص', 'dlResultTitle'),
        ('الوصف التوضيحي للتشخيص', 'dlResultSubtitle'),
        ('حاوية مقارنة الفوارق التفصيلية', 'dlDiffContainer'),
        ('نص نصيحة وتوجيه فصيح', 'dlFaseehAdviceText'),
        ('زر الاستماع الصوتي المقارن', 'dlFaseehAudioBtn'),
        ('كانفاس سبورة الخط المسطرة', 'dlWhiteboardCanvas'),
        ('زر قلم الخط', 'dlWbBtn_pen'),
        ('زر قلم التصحيح', 'dlWbBtn_corrector'),
        ('زر قلم التظليل', 'dlWbBtn_highlighter'),
        ('زر ممحاة السبورة', 'dlWbBtn_eraser'),
        ('شبكة كلمات بنك المنهج', 'dlBankGrid'),
        ('فلاتر وحدات بنك الكلمات', 'dlBankUnitFilters'),
        ('فلاتر مهارات بنك الكلمات', 'dlBankSkillFilters'),
        ('حقل إدخال الكلمة المخصصة', 'dlCustomWordInput'),
        ('صفحة شيت الإملاء A4', 'dlSheetPage'),
        ('عداد إجمالي الكلمات', 'dlStatTotal'),
        ('عداد الكلمات المتقنة', 'dlStatCorrect'),
        ('مؤشر الدقة الإملائية', 'dlStatAccuracy'),
        ('عداد سلسلة الإتقان', 'dlStatStreak')
    ]
    for dl_title, dl_id in dictation_lab_elements:
        if dl_id not in dom_ids:
            errors.append(f"عنصر مختبر الإملاء الذكي {dl_title} ({dl_id}) مفقود!")
    if not any("عنصر مختبر الإملاء الذكي" in e for e in errors):
        successes.append(f"كافة عناصر مختبر الإملاء المنظور والاختباري الذكي ({len(dictation_lab_elements)} عنصراً) متكاملة بنسبة 100%.")

    # فحص عناصر مسرح القراءة التعبيرية والدمى المتحركة الرقمية ومحاكاة المحادثة الصفية
    print("\n--- فحص مسرح القراءة التعبيرية والدمى المتحركة الرقمية ومحاكاة المحادثة الصفية ---")
    readers_theater_elements = [
        ('زر مسرح القراءة بالشريط العلوي', 'btnTopReadersTheater'),
        ('بطاقة مسرح القراءة بالقائمة الجانبية', 'sidebarReadersTheaterCard'),
        ('نافذة المسرح الرئيسية', 'readersTheaterModal'),
        ('زر تبويب مسرح القراءة', 'rtTabBtn_theater'),
        ('زر تبويب مختبر الدمى', 'rtTabBtn_puppets'),
        ('زر تبويب محاكاة المحادثة', 'rtTabBtn_conversation'),
        ('زر تبويب المؤثرات والتذاكر', 'rtTabBtn_soundboard'),
        ('حاوية تبويب مسرح القراءة', 'rtTabPanel_theater'),
        ('حاوية تبويب مختبر الدمى', 'rtTabPanel_puppets'),
        ('حاوية تبويب محاكاة المحادثة', 'rtTabPanel_conversation'),
        ('حاوية تبويب المؤثرات والتذاكر', 'rtTabPanel_soundboard'),
        ('قائمة اختيار المسرحية', 'rtPlaySelect'),
        ('قائمة اختيار خلفية المسرح', 'rtBackdropSelect'),
        ('حاوية شرائح فريق التمثيل', 'rtCastChipsContainer'),
        ('ستائر المسرح الكلاسيكية', 'rtStageCurtains'),
        ('مشهد خشبة المسرح', 'rtStageScene'),
        ('بقعة الضوء المسرحية', 'rtStageSpotlight'),
        ('صف الدمى على المسرح', 'rtStagePuppetsRow'),
        ('أيقونة المتحدث في التلقين', 'rtSpeakerAvatar'),
        ('اسم المتحدث في التلقين', 'rtSpeakerName'),
        ('شارة النبرة التعبيرية', 'rtSpeakerIntonation'),
        ('مؤشر عداد الأسطر', 'rtLineCounter'),
        ('صندوق السطر النشط الكبير', 'rtActiveLineBox'),
        ('زر السطر السابق', 'rtBtnPrevLine'),
        ('زر السطر التالي', 'rtBtnNextLine'),
        ('زر التشغيل التلقائي', 'rtBtnAutoPlay'),
        ('شبكة الدمى بمختبر التحريك', 'rtPuppetsGrid'),
        ('قائمة المحادثات الصفية', 'rtConvoSelect'),
        ('نص موجه المحادثة', 'rtConvoPromptText'),
        ('سجل المحادثة المتتابع', 'rtConvoHistory'),
        ('حاوية خيارات الرد التعبيري', 'rtConvoOptionsContainer'),
        ('زر الميكروفون التعبيري', 'rtBtnConvoMic'),
        ('عنوان المسرحية بالتذكرة', 'rtTicketPlayTitle'),
        ('اسم التلميذ بالتذكرة', 'rtTicketPupilName'),
        ('دور التلميذ بالتذكرة', 'rtTicketRoleName'),
        ('زر طباعة التذكرة A4', 'rtBtnPrintTicket')
    ]
    for rt_title, rt_id in readers_theater_elements:
        if rt_id not in dom_ids:
            errors.append(f"عنصر مسرح القراءة والدمى {rt_title} ({rt_id}) مفقود!")
    if not any("عنصر مسرح القراءة والدمى" in e for e in errors):
        successes.append(f"كافة عناصر مسرح القراءة التعبيرية والدمى المتحركة الرقمية ({len(readers_theater_elements)} عنصراً) متكاملة بنسبة 100%.")

    # 8 ن. فحص استوديو الأناشيد المنهجية والإنشاد الإيقاعي التفاعلي بالدف المدرسي والتحليل الموسيقي
    print("\n--- فحص استوديو الأناشيد المنهجية والإنشاد الإيقاعي التفاعلي بالدف المدرسي والتحليل الموسيقي ---")
    nasheed_studio_elements = [
        ('زر استوديو الأناشيد بالشريط العلوي', 'btnTopNasheedStudio'),
        ('بطاقة استوديو الأناشيد بالقائمة الجانبية', 'sidebarNasheedStudioCard'),
        ('نافذة استوديو الأناشيد الرئيسية', 'nasheedStudioModal'),
        ('زر تكبير الاستوديو لملء الشاشة', 'nsBtnFullscreen'),
        ('زر إغلاق استوديو الأناشيد', 'nsBtnClose'),
        ('زر تبويب مسرح الأناشيد', 'nsTabBtn_stage'),
        ('زر تبويب مختبر الدف', 'nsTabBtn_duff'),
        ('زر تبويب المحلل الموسيقي', 'nsTabBtn_visualizer'),
        ('زر تبويب استوديو التسجيل', 'nsTabBtn_recorder'),
        ('زر تبويب بطاقات الأناشيد وA4', 'nsTabBtn_printables'),
        ('حاوية تبويب مسرح الأناشيد', 'nsTabContent_stage'),
        ('حاوية تبويب مختبر الدف', 'nsTabContent_duff'),
        ('حاوية تبويب المحلل الموسيقي', 'nsTabContent_visualizer'),
        ('حاوية تبويب استوديو التسجيل', 'nsTabContent_recorder'),
        ('حاوية تبويب بطاقات الأناشيد وA4', 'nsTabContent_printables'),
        ('شريط اختيار الأناشيد المنهجية', 'nsCurriculumStrip'),
        ('عنوان النشيد المعروض', 'nsSongDisplayTitle'),
        ('شارة وحدة النشيد', 'nsSongUnitBadge'),
        ('شارة إيقاع النشيد', 'nsSongRhythmBadge'),
        ('شارة سرعة النشيد BPM', 'nsSongTempoBadge'),
        ('الكرة الإيقاعية النطاطة', 'nsBouncingBall'),
        ('قائمة أبيات النشيد', 'nsVersesList'),
        ('زر بدء الإنشاد والكاراوكي', 'nsBtnPlayChant'),
        ('زر التقطيع الفونيمي للمقاطع', 'nsBtnToggleSyllables'),
        ('زر مرافقة الدف المدرسي', 'nsBtnToggleDuff'),
        ('زر الإنشاد الصوتي الآلي', 'nsBtnToggleVocals'),
        ('شريط منزلق ضبط السرعة BPM', 'nsTempoSlider'),
        ('مؤشر عرض سرعة الإيقاع', 'nsTempoValueDisplay'),
        ('زر تقليل سرعة الإيقاع', 'nsBtnTempoMinus'),
        ('زر زيادة سرعة الإيقاع', 'nsBtnTempoPlus'),
        ('مجسم الدف المدرسي التفاعلي', 'nsDuffDrumWrapper'),
        ('زر ضربة دُم العميقة', 'nsBtnDum'),
        ('زر ضربة تَكْ الحادة', 'nsBtnTak'),
        ('زر رَنَّة الصُّنُوج النحاسية', 'nsBtnJingle'),
        ('قائمة الأنماط الإيقاعية', 'nsPatternsList'),
        ('شريط مصابيح LED الإيقاعية', 'nsLedRow'),
        ('شاشة كانفاس المحلل الموسيقي', 'nsVisualizerCanvas'),
        ('زر نمط أعمدة التردد', 'nsBtnVisMode_bars'),
        ('زر نمط الأمواج التناغمية', 'nsBtnVisMode_wave'),
        ('زر نمط الدوائر النبضية', 'nsBtnVisMode_circles'),
        ('عداد نقاط تحدي الإيقاع', 'nsChStatScore'),
        ('مؤشر دقة التوافق الإيقاعي', 'nsChStatAccuracy'),
        ('مؤشر التتابع الإيقاعي', 'nsChStatStreak'),
        ('مسار النوتات الإيقاعية المتحركة', 'nsBeatHighway'),
        ('شريط التوجيه والتغذية الراجعة', 'nsFeedbackBanner'),
        ('زر بدء تحدي دقة الإيقاع', 'nsBtnStartChallenge'),
        ('أيقونة الميكروفون التفاعلية', 'nsMicCircle'),
        ('نص حالة التسجيل الصوتي', 'nsRecStatusText'),
        ('زر مؤثر صدى الصف المدرسي', 'nsBtnReverb_classroom'),
        ('زر مؤثر صدى القاعة الكبرى', 'nsBtnReverb_hall'),
        ('زر الصوت النقي المباشر', 'nsBtnReverb_clean'),
        ('زر بدء التسجيل الحي', 'nsBtnStartRec'),
        ('زر إيقاف وحفظ التسجيل', 'nsBtnStopRec'),
        ('زر الاستماع للتسجيل الحي', 'nsBtnPlayRec'),
        ('سجل إنشاد التلميذ والتسجيلات', 'nsRecordingsList'),
        ('عنوان النشيد بالمعاينة', 'nsPreviewSongTitle'),
        ('حقل اسم التلميذ بالشهادة', 'nsPreviewPupilName'),
        ('زر طباعة بطاقة النشيد A4', 'nsBtnPrintCard'),
        ('زر طباعة شهادة بلبل الصف A4', 'nsBtnPrintCertificate'),
        ('حاوية الطباعة المنعزلة A4', 'nsPrintableContainer')
    ]
    for ns_title, ns_id in nasheed_studio_elements:
        if ns_id not in dom_ids:
            errors.append(f"عنصر استوديو الأناشيد {ns_title} ({ns_id}) مفقود!")
    if not any("عنصر استوديو الأناشيد" in e for e in errors):
        successes.append(f"كافة عناصر استوديو الأناشيد المنهجية والإنشاد الإيقاعي بالدف المدرسي ({len(nasheed_studio_elements)} عنصراً) متكاملة بنسبة 100%.")

    # 8 س. فحص استوديو القصة المصورة التفاعلية وصانع القصص الرقمية الفونيمية
    print("\n--- فحص استوديو القصة المصورة التفاعلية وصانع القصص الرقمية الفونيمية ---")
    story_studio_elements = [
        ('زر استوديو القصة بالشريط العلوي', 'btnTopStoryStudio'),
        ('شارة زر استوديو القصة', 'topStoryStudioLabel'),
        ('بطاقة استوديو القصة بالقائمة الجانبية', 'sidebarStoryStudioCard'),
        ('نافذة استوديو القصة الرئيسية', 'storyStudioModal'),
        ('زر تكبير الاستوديو لملء الشاشة', 'ssBtnFullscreen'),
        ('زر إغلاق استوديو القصة', 'ssBtnClose'),
        ('زر تبويب صانع الكوميكس', 'ssTabBtnCreator'),
        ('زر تبويب مكتبة القصص', 'ssTabBtnLibrary'),
        ('زر تبويب تحدي إكمال القصة', 'ssTabBtnChallenge'),
        ('زر تبويب معرض القصص والطباعة', 'ssTabBtnExport'),
        ('كانفاس مؤثرات الكونفيتي', 'storyStudioConfettiCanvas'),
        ('حاوية تبويب صانع الكوميكس', 'ssTabPanel_creator'),
        ('مجموعة الشخصيات بالشريط الجانبي', 'ssResourceGrp_chars'),
        ('شبكة الشخصيات الكرتونية SVG', 'ssCharsGrid'),
        ('مجموعة الأدوات بالشريط الجانبي', 'ssResourceGrp_props'),
        ('شبكة الأدوات والعناصر المصورة', 'ssPropsGrid'),
        ('مجموعة فقاعات الحوار', 'ssResourceGrp_bubbles'),
        ('مجموعة بنك الكلمات الفونيمية', 'ssResourceGrp_words'),
        ('رقائق بنك الكلمات المنهجية', 'ssWordsBankChips'),
        ('رقائق الجمل القصصية الجاهزة', 'ssSentencesChips'),
        ('مجموعة المؤثرات الكوميدية SFX', 'ssResourceGrp_sfx'),
        ('شبكة ملصقات SFX الكوميدية', 'ssSfxGrid'),
        ('مجموعة الخلفيات البيئية', 'ssResourceGrp_bgs'),
        ('شبكة بطاقات الخلفيات', 'ssBgsGrid'),
        ('شريط التنقل بين اللوحات', 'ssPanelNav'),
        ('كانفاس صفحة الكوميكس واللوحات', 'ssComicPageCanvas'),
        ('حقل إدخال نص الحوار للفقاعة', 'ssInputBubbleText'),
        ('حقل إدخال عنوان القصة', 'ssStoryTitleInput'),
        ('حاوية تبويب مكتبة القصص', 'ssTabPanel_library'),
        ('قائمة بطاقات القصص بالمكتبة', 'ssBookList'),
        ('عنوان قصة القارئ التفاعلي', 'ssReaderTitle'),
        ('معلومات قصة القارئ التفاعلي', 'ssReaderMeta'),
        ('زر تشغيل القراءة الصوتية بالمكتبة', 'ssBtnPlayStory'),
        ('زر فتح القصة في محرر الكوميكس', 'ssBtnEditStory'),
        ('كانفاس عرض القارئ التفاعلي', 'ssReaderViewport'),
        ('حاوية تبويب تحدي القصة الناقصة', 'ssTabPanel_challenge'),
        ('عنوان تحدي القصة الناقصة', 'ssChTitle'),
        ('وصف تحدي القصة الناقصة', 'ssChDesc'),
        ('عداد نجوم التحدي', 'ssChStarsCount'),
        ('شريط لوحات التحدي الثلاث', 'ssChallengeStrip'),
        ('شبكة خيارات الإجابة الفونيمية', 'ssChOptionsRow'),
        ('حاوية تبويب المعرض والطباعة A4', 'ssTabPanel_export'),
        ('شبكة القصص المحفوظة بالمعرض', 'ssSavedGalleryGrid'),
        ('حاوية الطباعة المنعزلة A4', 'storyStudioPrintA4Area')
    ]
    for ss_title, ss_id in story_studio_elements:
        if ss_id not in dom_ids:
            errors.append(f"عنصر استوديو القصة المصورة {ss_title} ({ss_id}) مفقود!")
    if not any("عنصر استوديو القصة المصورة" in e for e in errors):
        successes.append(f"كافة عناصر استوديو القصة المصورة التفاعلية وصانع القصص الرقمية ({len(story_studio_elements)} عنصراً) متكاملة بنسبة 100%.")

    # 9. فحص عزل مفاتيح التخزين المحلي (LocalStorage Key Hygiene)
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
        'css/classroom-sync.css', 'css/classroom-quiz.css', 'css/interactive-guide.css', 'css/diagnostic-exams.css', 'css/voice-coach.css', 'css/dictation-lab.css', 'css/readers-theater.css', 'css/nasheed-studio.css', 'css/story-studio.css', 'css/student-profiles.css', 'css/dark-mode.css'
    ]
    for cf in css_files:
        if cf not in index_html:
            errors.append(f"ملف الأنماط {cf} غير مستدعى في index.html!")
    if not any("غير مستدعى في index.html" in e for e in errors):
        successes.append(f"كافة ملفات CSS الـ ({len(css_files)} ملف) مستدعاة بشكل صحيح.")

    core_scripts = [
        'audio_data.js', 'audio_data_unit6.js', 'curriculum_data.js',
        'js/core/theme.js', 'js/core/modals.js', 'js/core/audio.js', 'js/core/view-loader.js', 'js/core/progress.js', 'js/core/navigation.js',
        'js/core/evaluation.js', 'js/core/enrichment.js', 'js/core/blackboard.js',
        'js/core/games.js', 'js/core/gamification.js', 'js/core/teacher-dashboard.js',
        'js/core/classroom-sync.js', 'js/core/classroom-quiz.js', 'js/core/interactive-guide.js',
        'js/core/diagnostic-exams.js', 'js/core/voice-coach.js', 'js/core/dictation-lab.js', 'js/core/readers-theater.js', 'js/core/nasheed-studio.js', 'js/core/story-studio.js', 'js/core/student-profiles.js', 'js/app.js'
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
        ('css/diagnostic-exams.css', open(os.path.join(BASE_DIR, 'css', 'diagnostic-exams.css'), encoding='utf-8').read()),
        ('js/core/diagnostic-exams.js', open(os.path.join(BASE_DIR, 'js', 'core', 'diagnostic-exams.js'), encoding='utf-8').read()),
        ('css/voice-coach.css', open(os.path.join(BASE_DIR, 'css', 'voice-coach.css'), encoding='utf-8').read()),
        ('js/core/voice-coach.js', open(os.path.join(BASE_DIR, 'js', 'core', 'voice-coach.js'), encoding='utf-8').read()),
        ('css/dictation-lab.css', open(os.path.join(BASE_DIR, 'css', 'dictation-lab.css'), encoding='utf-8').read()),
        ('js/core/dictation-lab.js', open(os.path.join(BASE_DIR, 'js', 'core', 'dictation-lab.js'), encoding='utf-8').read()),
        ('css/readers-theater.css', open(os.path.join(BASE_DIR, 'css', 'readers-theater.css'), encoding='utf-8').read()),
        ('js/core/readers-theater.js', open(os.path.join(BASE_DIR, 'js', 'core', 'readers-theater.js'), encoding='utf-8').read()),
        ('css/nasheed-studio.css', open(os.path.join(BASE_DIR, 'css', 'nasheed-studio.css'), encoding='utf-8').read()),
        ('js/core/nasheed-studio.js', open(os.path.join(BASE_DIR, 'js', 'core', 'nasheed-studio.js'), encoding='utf-8').read()),
        ('css/story-studio.css', open(os.path.join(BASE_DIR, 'css', 'story-studio.css'), encoding='utf-8').read()),
        ('js/core/story-studio.js', open(os.path.join(BASE_DIR, 'js', 'core', 'story-studio.js'), encoding='utf-8').read()),
        ('css/dark-mode.css', open(os.path.join(BASE_DIR, 'css', 'dark-mode.css'), encoding='utf-8').read()),
        ('js/core/theme.js', open(os.path.join(BASE_DIR, 'js', 'core', 'theme.js'), encoding='utf-8').read()),
        ('js/core/view-loader.js', open(os.path.join(BASE_DIR, 'js', 'core', 'view-loader.js'), encoding='utf-8').read()),
        ('js/core/progress.js', open(os.path.join(BASE_DIR, 'js', 'core', 'progress.js'), encoding='utf-8').read()),
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
