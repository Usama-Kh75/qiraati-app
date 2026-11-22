/* ==========================================================================
 * منصة قراءتي التفاعلية الذكية - محرك لوحة تحكم المعلم وسجل تقدم التلاميذ الصفي
 * وإدارة التقارير المطبوعة أوفلاين (Teacher Dashboard & Offline Reports Engine)
 * متوافق 100% مع معايير وزارة التربية والعمل أوفلاين بدون إنترنت
 * إعداد وتطوير: المهندس أسامة خليل هاشم
 * ========================================================================== */

(function() {
    'use strict';

    // مفاتيح التخزين المحلي الصارمة (تلتزم بقواعد أسامة)
    const STORAGE_KEY_CLASSES = 'qiraati-smart-teacher-classes';
    const STORAGE_KEY_STUDENTS = 'qiraati-smart-teacher-students';
    const STORAGE_KEY_ACTIVE_CLASS = 'qiraati-smart-teacher-active-class';
    const STORAGE_KEY_SETTINGS = 'qiraati-smart-teacher-settings';
    const STORAGE_KEY_ATTENDANCE = 'qiraati-smart-teacher-attendance';

    // المهارات الفونيمية المعتمدة
    const SKILLS_LIST = [
        { id: 'listening', name: 'الاستماع والتمييز الصوتي', icon: '👂' },
        { id: 'speaking', name: 'المحادثة والتعبير الشفهي', icon: '🗣️' },
        { id: 'reading', name: 'قراءة الكلمات والمقاطع', icon: '📖' },
        { id: 'writing', name: 'رسم الحروف والخط على السطر', icon: '✍️' },
        { id: 'spelling', name: 'الإملاء والتحليل الفونيمي', icon: '📝' },
        { id: 'memorization', name: 'المحفوظات والأناشيد', icon: '🎶' },
        { id: 'participation', name: 'المشاركة الصفية والتفاعل', icon: '🙋‍♂️' },
        { id: 'attendance', name: 'المواظبة والانضباط المدرسي', icon: '⏰' }
    ];

    const GRADE_RANKS = [
        { label: 'ممتاز', score: 6, color: '#16a34a', bg: '#dcfce7' },
        { label: 'جيد جداً', score: 5, color: '#4338ca', bg: '#e0e7ff' },
        { label: 'جيد', score: 4, color: '#b45309', bg: '#fef3c7' },
        { label: 'وسط', score: 3, color: '#c2410c', bg: '#ffedd5' },
        { label: 'مقبول', score: 2, color: '#ea580c', bg: '#fed7aa' },
        { label: 'يحتاج دعم', score: 1, color: '#dc2626', bg: '#fee2e2' }
    ];

    // الحالة العامة
    let state = {
        activeTab: 'overview',
        activeClassId: 'class_a',
        activeReportType: 'roster',
        activeReportStudentId: null,
        reportOrientation: 'portrait', // 'portrait' or 'landscape'
        currentAttendanceDate: getTodayDateString(),
        classes: [],
        studentsMap: {}, // { classId: [studentObj, ...] }
        settings: {
            teacherName: 'الأستاذ / الأستاذة',
            schoolName: 'مدرسة النخبة الابتدائية للبنين والبنات',
            directorate: 'المديرية العامة للتربية',
            academicYear: '2026 / 2027',
            headmasterName: 'مدير / مديرة المدرسة'
        },
        attendanceMap: {} // { "YYYY-MM-DD": { [studentId]: "present"|"absent"|"late"|"excused" } }
    };

    function getTodayDateString() {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function escapeHtml(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // تهيئة البيانات وتحميلها من التخزين المحلي
    function init() {
        loadData();
        if (state.classes.length === 0) {
            setupInitialDefaults();
        }
        updateSidebarCard();
    }

    function loadData() {
        try {
            const rawClasses = localStorage.getItem(STORAGE_KEY_CLASSES);
            if (rawClasses) state.classes = JSON.parse(rawClasses);

            const rawStudents = localStorage.getItem(STORAGE_KEY_STUDENTS);
            if (rawStudents) state.studentsMap = JSON.parse(rawStudents);

            const rawActiveClass = localStorage.getItem(STORAGE_KEY_ACTIVE_CLASS);
            if (rawActiveClass) state.activeClassId = rawActiveClass;

            const rawSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);
            if (rawSettings) state.settings = Object.assign(state.settings, JSON.parse(rawSettings));

            const rawAttendance = localStorage.getItem(STORAGE_KEY_ATTENDANCE);
            if (rawAttendance) state.attendanceMap = JSON.parse(rawAttendance);
        } catch (e) {
            console.error('خطأ في استرجاع بيانات لوحة المعلم:', e);
        }
    }

    function saveData() {
        try {
            localStorage.setItem(STORAGE_KEY_CLASSES, JSON.stringify(state.classes));
            localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(state.studentsMap));
            localStorage.setItem(STORAGE_KEY_ACTIVE_CLASS, state.activeClassId);
            localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(state.settings));
            localStorage.setItem(STORAGE_KEY_ATTENDANCE, JSON.stringify(state.attendanceMap));
            updateSidebarCard();
        } catch (e) {
            console.error('خطأ في حفظ بيانات لوحة المعلم:', e);
        }
    }

    // إعداد البيانات الافتراضية لأول مرة
    function setupInitialDefaults() {
        state.classes = [
            { id: 'class_a', name: 'الصف الأول - شعبة (أ)' },
            { id: 'class_b', name: 'الصف الأول - شعبة (ب)' }
        ];
        state.activeClassId = 'class_a';
        state.studentsMap['class_a'] = generateSampleStudentsList('class_a');
        state.studentsMap['class_b'] = [];
        saveData();
    }

    // توليد عينة واقعية من التلاميذ
    function generateSampleStudentsList(classId) {
        return [
            {
                id: 'std_' + Date.now() + '_1',
                name: 'أحمد علي حسين',
                gender: 'boy',
                birthDate: '2018-04-15',
                guardianName: 'علي حسين (الأب)',
                phone: '07701234567',
                stars: 140,
                streak: 12,
                completedLessons: 44,
                skills: { listening: 'ممتاز', speaking: 'ممتاز', reading: 'ممتاز', writing: 'جيد جداً', spelling: 'ممتاز', memorization: 'ممتاز', participation: 'ممتاز', attendance: 'ممتاز' },
                status: 'متفوق',
                needsSupport: false,
                remedialNotes: '',
                notes: 'تلميذ متفوق جداً، سريع الاستجابة في التحليل الفونيمي والتهجئة.'
            },
            {
                id: 'std_' + Date.now() + '_2',
                name: 'فاطمة حيدر كريم',
                gender: 'girl',
                birthDate: '2018-05-20',
                guardianName: 'حيدر كريم (الأب)',
                phone: '07802345678',
                stars: 155,
                streak: 15,
                completedLessons: 46,
                skills: { listening: 'ممتاز', speaking: 'ممتاز', reading: 'ممتاز', writing: 'ممتاز', spelling: 'ممتاز', memorization: 'ممتاز', participation: 'ممتاز', attendance: 'ممتاز' },
                status: 'متفوق',
                needsSupport: false,
                remedialNotes: '',
                notes: 'أكملت كافة دروس كتاب قراءتي بنسبة 100% مع إتقان الخط العربي.'
            },
            {
                id: 'std_' + Date.now() + '_3',
                name: 'علي محمد جاسم',
                gender: 'boy',
                birthDate: '2018-02-10',
                guardianName: 'محمد جاسم (الأب)',
                phone: '07713456789',
                stars: 110,
                streak: 8,
                completedLessons: 38,
                skills: { listening: 'ممتاز', speaking: 'جيد جداً', reading: 'جيد جداً', writing: 'جيد', spelling: 'جيد جداً', memorization: 'ممتاز', participation: 'جيد جداً', attendance: 'ممتاز' },
                status: 'متقن',
                needsSupport: false,
                remedialNotes: '',
                notes: 'مواظب ومشارك بفاعلية، يحتاج مزيداً من ضبط سطر الكتابة بالقلم.'
            },
            {
                id: 'std_' + Date.now() + '_4',
                name: 'زينب كرار رضا',
                gender: 'girl',
                birthDate: '2018-08-03',
                guardianName: 'كرار رضا (الأب)',
                phone: '07504567890',
                stars: 145,
                streak: 14,
                completedLessons: 45,
                skills: { listening: 'ممتاز', speaking: 'ممتاز', reading: 'ممتاز', writing: 'جيد جداً', spelling: 'ممتاز', memorization: 'ممتاز', participation: 'ممتاز', attendance: 'ممتاز' },
                status: 'متفوق',
                needsSupport: false,
                remedialNotes: '',
                notes: 'نطق فصيح وطلاقة مميزة في قراءة الأناشيد وسرد أحداث الصور.'
            },
            {
                id: 'std_' + Date.now() + '_5',
                name: 'حسن باسم فاضل',
                gender: 'boy',
                birthDate: '2018-06-12',
                guardianName: 'باسم فاضل (الأب)',
                phone: '07725678901',
                stars: 85,
                streak: 5,
                completedLessons: 30,
                skills: { listening: 'جيد جداً', speaking: 'جيد', reading: 'جيد', writing: 'وسط', spelling: 'جيد', memorization: 'جيد جداً', participation: 'جيد', attendance: 'جيد جداً' },
                status: 'متوسط',
                needsSupport: false,
                remedialNotes: '',
                notes: 'مستوى متدرج، يحتاج تشجيعاً في لوحة تتبع الحروف لتقوية عضلات اليد.'
            },
            {
                id: 'std_' + Date.now() + '_6',
                name: 'مريم مصطفى جواد',
                gender: 'girl',
                birthDate: '2018-03-25',
                guardianName: 'مصطفى جواد (الأب)',
                phone: '07816789012',
                stars: 160,
                streak: 16,
                completedLessons: 46,
                skills: { listening: 'ممتاز', speaking: 'ممتاز', reading: 'ممتاز', writing: 'ممتاز', spelling: 'ممتاز', memorization: 'ممتاز', participation: 'ممتاز', attendance: 'ممتاز' },
                status: 'متفوق',
                needsSupport: false,
                remedialNotes: '',
                notes: 'الأولى على الصف في مسابقة تحدي النجوم وقراءة الكلمات المقطعية.'
            },
            {
                id: 'std_' + Date.now() + '_7',
                name: 'يوسف عمار قاسم',
                gender: 'boy',
                birthDate: '2018-09-18',
                guardianName: 'عمار قاسم (الأب)',
                phone: '07737890123',
                stars: 55,
                streak: 3,
                completedLessons: 22,
                skills: { listening: 'وسط', speaking: 'جيد', reading: 'يحتاج دعم', writing: 'يحتاج دعم', spelling: 'يحتاج دعم', memorization: 'جيد', participation: 'وسط', attendance: 'جيد' },
                status: 'يحتاج دعم',
                needsSupport: true,
                remedialNotes: 'صعوبة في التمييز الفونيمي بين صوت (د) وصوت (ر)، والخلط في اتجاه رسم الحرف.',
                notes: 'مدرج ضمن خطة الدعم الفونيمي والمتابعة اليومية مع المعلم والأسرة.'
            },
            {
                id: 'std_' + Date.now() + '_8',
                name: 'نور الهدى سجاد حميد',
                gender: 'girl',
                birthDate: '2018-01-14',
                guardianName: 'سجاد حميد (الأب)',
                phone: '07518901234',
                stars: 115,
                streak: 9,
                completedLessons: 40,
                skills: { listening: 'ممتاز', speaking: 'ممتاز', reading: 'جيد جداً', writing: 'جيد جداً', spelling: 'جيد جداً', memorization: 'ممتاز', participation: 'ممتاز', attendance: 'ممتاز' },
                status: 'متقن',
                needsSupport: false,
                remedialNotes: '',
                notes: 'هادئة ومتمكنة من التهجئة المقطعية، وتشارك دائماً بحماس.'
            },
            {
                id: 'std_' + Date.now() + '_9',
                name: 'عباس ماجد كاظم',
                gender: 'boy',
                birthDate: '2018-07-07',
                guardianName: 'ماجد كاظم (الأب)',
                phone: '07749012345',
                stars: 90,
                streak: 6,
                completedLessons: 32,
                skills: { listening: 'جيد جداً', speaking: 'جيد جداً', reading: 'جيد', writing: 'جيد', spelling: 'جيد', memorization: 'ممتاز', participation: 'جيد جداً', attendance: 'جيد جداً' },
                status: 'متقن',
                needsSupport: false,
                remedialNotes: '',
                notes: 'يحب الألعاب التفاعلية والسبورة الذكية، سريع التعلم الحركي.'
            },
            {
                id: 'std_' + Date.now() + '_10',
                name: 'رقية فراس عبد الحسين',
                gender: 'girl',
                birthDate: '2018-11-30',
                guardianName: 'فراس عبد الحسين (الأب)',
                phone: '07820123456',
                stars: 150,
                streak: 13,
                completedLessons: 45,
                skills: { listening: 'ممتاز', speaking: 'ممتاز', reading: 'ممتاز', writing: 'ممتاز', spelling: 'ممتاز', memorization: 'ممتاز', participation: 'ممتاز', attendance: 'ممتاز' },
                status: 'متفوق',
                needsSupport: false,
                remedialNotes: '',
                notes: 'بطلة متميزة في القراءة السريعة وحفظ الأناشيد المنهجية كاملة.'
            },
            {
                id: 'std_' + Date.now() + '_11',
                name: 'سيف إحسان ضياء',
                gender: 'boy',
                birthDate: '2018-04-22',
                guardianName: 'إحسان ضياء (الأب)',
                phone: '07751234567',
                stars: 60,
                streak: 3,
                completedLessons: 24,
                skills: { listening: 'وسط', speaking: 'جيد', reading: 'يحتاج دعم', writing: 'وسط', spelling: 'يحتاج دعم', memorization: 'جيد', participation: 'وسط', attendance: 'جيد' },
                status: 'يحتاج دعم',
                needsSupport: true,
                remedialNotes: 'خلط بين الحركات القصيرة (الفتحة والضمة والكسرة) وحروف المد الطويلة (ا، و، ي).',
                notes: 'يحتاج تدريباً مكثفاً ببطاقات القراءة الذكية ولعبة العجلة الدوارة.'
            },
            {
                id: 'std_' + Date.now() + '_12',
                name: 'بنين ضياء مهدي',
                gender: 'girl',
                birthDate: '2018-10-09',
                guardianName: 'ضياء مهدي (الأب)',
                phone: '07832345678',
                stars: 120,
                streak: 10,
                completedLessons: 41,
                skills: { listening: 'ممتاز', speaking: 'جيد جداً', reading: 'جيد جداً', writing: 'جيد جداً', spelling: 'جيد جداً', memorization: 'ممتاز', participation: 'ممتاز', attendance: 'ممتاز' },
                status: 'متقن',
                needsSupport: false,
                remedialNotes: '',
                notes: 'تلميذة مجتهدة ودقيقة في رسم الحروف، تحرز تقدماً مستمراً.'
            },
            {
                id: 'std_' + Date.now() + '_13',
                name: 'مهدي ثامر نعيم',
                gender: 'boy',
                birthDate: '2018-02-19',
                guardianName: 'ثامر نعيم (الأب)',
                phone: '07523456789',
                stars: 135,
                streak: 11,
                completedLessons: 43,
                skills: { listening: 'ممتاز', speaking: 'ممتاز', reading: 'ممتاز', writing: 'جيد جداً', spelling: 'ممتاز', memorization: 'ممتاز', participation: 'ممتاز', attendance: 'ممتاز' },
                status: 'متفوق',
                needsSupport: false,
                remedialNotes: '',
                notes: 'مهارة استماع وتفريق فونيمي عالية جداً بين الحروف المتشابهة رسمياً.'
            },
            {
                id: 'std_' + Date.now() + '_14',
                name: 'حوراء رائد صبحي',
                gender: 'girl',
                birthDate: '2018-12-05',
                guardianName: 'رائد صبحي (الأب)',
                phone: '07764567890',
                stars: 110,
                streak: 8,
                completedLessons: 39,
                skills: { listening: 'ممتاز', speaking: 'جيد جداً', reading: 'جيد جداً', writing: 'جيد جداً', spelling: 'جيد جداً', memorization: 'ممتاز', participation: 'جيد جداً', attendance: 'ممتاز' },
                status: 'متقن',
                needsSupport: false,
                remedialNotes: '',
                notes: 'انضباط صفي رفيع ومشاركة نشطة في حصة القراءة اليومية.'
            },
            {
                id: 'std_' + Date.now() + '_15',
                name: 'مصطفى ليث خليل',
                gender: 'boy',
                birthDate: '2018-05-11',
                guardianName: 'ليث خليل (الأب)',
                phone: '07845678901',
                stars: 150,
                streak: 14,
                completedLessons: 46,
                skills: { listening: 'ممتاز', speaking: 'ممتاز', reading: 'ممتاز', writing: 'ممتاز', spelling: 'ممتاز', memorization: 'ممتاز', participation: 'ممتاز', attendance: 'ممتاز' },
                status: 'متفوق',
                needsSupport: false,
                remedialNotes: '',
                notes: 'أتم الكتاب كاملاً بامتياز تام، ومؤهل لنيل وسام بطل التحدي الأكبر.'
            }
        ];
    }

    // جلب قائمة تلاميذ الشعبة النشطة
    function getActiveStudents() {
        return state.studentsMap[state.activeClassId] || [];
    }

    // جلب تفاصيل الشعبة النشطة
    function getActiveClassObj() {
        return state.classes.find(c => c.id === state.activeClassId) || { id: state.activeClassId, name: 'الشعبة الحالية' };
    }

    // --- تحديث بطاقة القائمة الجانبية (Sidebar) ---
    function updateSidebarCard() {
        const classObj = getActiveClassObj();
        const students = getActiveStudents();

        const badgeEl = document.getElementById('sidebarTeacherClassBadge');
        const countEl = document.getElementById('sidebarTeacherStudentsCount');
        const avgEl = document.getElementById('sidebarTeacherAvgProgress');

        if (badgeEl) badgeEl.textContent = classObj.name.replace('الصف الأول - ', '');
        if (countEl) countEl.textContent = students.length;

        if (avgEl) {
            if (students.length === 0) {
                avgEl.textContent = '0%';
            } else {
                const totalProgress = students.reduce((sum, s) => sum + Math.round((s.completedLessons / 46) * 100), 0);
                avgEl.textContent = Math.round(totalProgress / students.length) + '%';
            }
        }
    }

    // --- فتح وإغلاق النافذة الرئيسية للوحة المعلم ---
    function openModal(initialTab = 'overview') {
        const modal = document.getElementById('teacherDashboardModal');
        if (!modal) return;

        renderClassSelectorDropdown();
        switchTab(initialTab);
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        const modal = document.getElementById('teacherDashboardModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    // تبديل التبويبات
    function switchTab(tabId) {
        state.activeTab = tabId;

        // تحديث أزرار التبويبات
        const tabBtns = document.querySelectorAll('.teacher-modal-tab');
        tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.id === `tabTeacher_${tabId}`);
        });

        // تحديث محتوى التبويبات
        const tabPanes = document.querySelectorAll('.teacher-tab-pane');
        tabPanes.forEach(pane => {
            pane.classList.toggle('active', pane.id === `paneTeacher_${tabId}`);
        });

        // ريندر المحتوى حسب التبويب النشط
        if (tabId === 'overview') renderOverviewTab();
        else if (tabId === 'roster') renderRosterTab();
        else if (tabId === 'attendance') renderAttendanceTab();
        else if (tabId === 'remedial') renderRemedialTab();
        else if (tabId === 'reports') renderReportsTab();
        else if (tabId === 'settings') renderSettingsTab();
        else if (tabId === 'sync') renderSyncTab();
    }

    // ريندر تبويب المزامنة والرادار الصفي الحي
    function renderSyncTab() {
        if (window.ClassroomSync && window.ClassroomSync.renderTeacherRadar) {
            window.ClassroomSync.renderTeacherRadar();
        }
    }

    // بناء قائمة الشعب المنسدلة
    function renderClassSelectorDropdown() {
        const selectEl = document.getElementById('teacherClassSelect');
        if (!selectEl) return;

        selectEl.innerHTML = state.classes.map(c => `
            <option value="${c.id}" ${c.id === state.activeClassId ? 'selected' : ''}>${escapeHtml(c.name)}</option>
        `).join('');
    }

    // تغيير الشعبة المختارة
    function onClassSelectChange(classId) {
        state.activeClassId = classId;
        saveData();
        switchTab(state.activeTab);
    }

    // إضافة شعبة جديدة
    function promptAddClass() {
        const className = prompt('أدخل اسم الشعبة الجديدة (مثال: الصف الأول - شعبة ج):');
        if (!className || !className.trim()) return;

        const newId = 'class_' + Date.now();
        state.classes.push({ id: newId, name: className.trim() });
        state.studentsMap[newId] = [];
        state.activeClassId = newId;
        saveData();
        renderClassSelectorDropdown();
        switchTab(state.activeTab);
    }

    // =========================================================================
    // التبويب 1: نظرة عامة والمؤشرات الإحصائية الصفية (Overview Tab)
    // =========================================================================
    function renderOverviewTab() {
        const students = getActiveStudents();
        const classObj = getActiveClassObj();

        // 1. تحديث بانر الترحيب
        const welcomeSchoolEl = document.getElementById('teacherWelcomeSchool');
        const welcomeTeacherEl = document.getElementById('teacherWelcomeName');
        const welcomeClassEl = document.getElementById('teacherWelcomeClass');
        const welcomeYearEl = document.getElementById('teacherWelcomeYear');

        if (welcomeSchoolEl) welcomeSchoolEl.textContent = state.settings.schoolName;
        if (welcomeTeacherEl) welcomeTeacherEl.textContent = state.settings.teacherName;
        if (welcomeClassEl) welcomeClassEl.textContent = classObj.name;
        if (welcomeYearEl) welcomeYearEl.textContent = state.settings.academicYear;

        // 2. حساب المؤشرات الإحصائية (KPIs)
        const totalStudents = students.length;
        const boysCount = students.filter(s => s.gender === 'boy').length;
        const girlsCount = students.filter(s => s.gender === 'girl').length;

        let totalProgressPct = 0;
        let totalStars = 0;
        let excellentCount = 0;
        let remedialCount = 0;

        students.forEach(s => {
            totalProgressPct += Math.round((s.completedLessons / 46) * 100);
            totalStars += (s.stars || 0);
            if (s.status === 'متفوق') excellentCount++;
            if (s.needsSupport || s.status === 'يحتاج دعم') remedialCount++;
        });

        const avgProgress = totalStudents > 0 ? Math.round(totalProgressPct / totalStudents) : 0;
        const avgStars = totalStudents > 0 ? Math.round(totalStars / totalStudents) : 0;

        // تحديث قيم بطاقات KPI
        const kpiStudents = document.getElementById('kpiTotalStudents');
        const kpiProgress = document.getElementById('kpiAvgProgress');
        const kpiStars = document.getElementById('kpiAvgStars');
        const kpiExcellent = document.getElementById('kpiExcellentCount');
        const kpiRemedial = document.getElementById('kpiRemedialCount');
        const kpiGender = document.getElementById('kpiGenderRatio');

        if (kpiStudents) kpiStudents.textContent = totalStudents;
        if (kpiProgress) kpiProgress.textContent = `${avgProgress}%`;
        if (kpiStars) kpiStars.textContent = `${avgStars} ⭐`;
        if (kpiExcellent) kpiExcellent.textContent = excellentCount;
        if (kpiRemedial) kpiRemedial.textContent = remedialCount;
        if (kpiGender) kpiGender.textContent = `${boysCount} ذكور / ${girlsCount} إناث`;

        // 3. حساب نسب إتقان المهارات الفونيمية الثمانية
        const skillsContainer = document.getElementById('teacherSkillsProgressGrid');
        if (skillsContainer) {
            skillsContainer.innerHTML = SKILLS_LIST.map(skill => {
                let scoreSum = 0;
                students.forEach(s => {
                    const gradeStr = s.skills ? s.skills[skill.id] : 'جيد';
                    const gradeObj = GRADE_RANKS.find(g => g.label === gradeStr) || { score: 4 };
                    scoreSum += gradeObj.score;
                });
                const maxPossible = totalStudents * 6;
                const skillPct = maxPossible > 0 ? Math.round((scoreSum / maxPossible) * 100) : 0;
                const barColor = skillPct >= 85 ? '#16a34a' : (skillPct >= 65 ? '#2563eb' : (skillPct >= 50 ? '#f59e0b' : '#dc2626'));

                return `
                    <div class="skill-progress-item">
                        <div class="skill-info-row">
                            <span>${skill.icon} ${skill.name}</span>
                            <span style="color: ${barColor};">${skillPct}%</span>
                        </div>
                        <div class="skill-bar-track">
                            <div class="skill-bar-fill" style="width: ${skillPct}%; background: ${barColor};"></div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // 4. لوحة شرف نجوم الصف (Top 5 Stars)
        const honorContainer = document.getElementById('teacherHonorRollList');
        if (honorContainer) {
            const sortedByStars = [...students].sort((a, b) => (b.stars || 0) - (a.stars || 0)).slice(0, 5);
            if (sortedByStars.length === 0) {
                honorContainer.innerHTML = '<div style="color: #64748b; font-size: 0.85rem; padding: 10px;">لا يوجد تلاميذ مسجلون في هذه الشعبة بعد.</div>';
            } else {
                honorContainer.innerHTML = sortedByStars.map((s, idx) => {
                    const medal = idx === 0 ? '🥇' : (idx === 1 ? '🥈' : (idx === 2 ? '🥉' : '⭐'));
                    return `
                        <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; margin-bottom: 6px;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span style="font-size: 1.2rem;">${medal}</span>
                                <span style="font-size: 1.2rem;">${s.gender === 'boy' ? '👦' : '👧'}</span>
                                <span style="font-weight: 800; font-size: 0.88rem; color: #1e293b;">${escapeHtml(s.name)}</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span style="font-size: 0.8rem; font-weight: 900; color: #d97706; background: #fef3c7; padding: 2px 8px; border-radius: 6px;">${s.stars} ⭐</span>
                                <span style="font-size: 0.78rem; font-weight: 800; color: #166534; background: #dcfce7; padding: 2px 8px; border-radius: 6px;">${Math.round((s.completedLessons/46)*100)}%</span>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }
    }

    // =========================================================================
    // التبويب 2: سجل إدارة وتتبع التلاميذ الصفي (Roster Tab)
    // =========================================================================
    function renderRosterTab() {
        filterRosterTable();
    }

    function filterRosterTable() {
        const students = getActiveStudents();
        const searchInput = document.getElementById('rosterSearchInput');
        const statusFilter = document.getElementById('rosterStatusFilter');
        const genderFilter = document.getElementById('rosterGenderFilter');
        const tableBody = document.getElementById('rosterTableBody');
        const countBadge = document.getElementById('rosterFilteredCount');

        if (!tableBody) return;

        const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
        const statusVal = statusFilter ? statusFilter.value : 'all';
        const genderVal = genderFilter ? genderFilter.value : 'all';

        const filtered = students.filter(s => {
            const matchesQuery = !query || s.name.toLowerCase().includes(query) || (s.guardianName && s.guardianName.toLowerCase().includes(query));
            const matchesStatus = statusVal === 'all' || s.status === statusVal || (statusVal === 'remedial' && s.needsSupport);
            const matchesGender = genderVal === 'all' || s.gender === genderVal;
            return matchesQuery && matchesStatus && matchesGender;
        });

        if (countBadge) countBadge.textContent = `${filtered.length} من أصل ${students.length}`;

        if (filtered.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 40px; color: #64748b;">
                        <div style="font-size: 2.2rem; margin-bottom: 8px;">🔍</div>
                        <div style="font-weight: 800; font-size: 1rem;">لم يتم العثور على أي تلميذ مطابق للبحث</div>
                        <div style="font-size: 0.82rem; margin-top: 4px;">جرب تغيير معايير البحث أو أضف تلميذاً جديداً أو اضغط زر توليد عينة تجريبية.</div>
                    </td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = filtered.map((s, idx) => {
            const progressPct = Math.round((s.completedLessons / 46) * 100);
            const statusClass = s.status === 'متفوق' ? 'badge-grade-excellent' : (s.status === 'متقن' ? 'badge-grade-vgood' : (s.status === 'متوسط' ? 'badge-grade-good' : 'badge-grade-support'));
            const avatar = s.gender === 'boy' ? '👦' : '👧';

            return `
                <tr>
                    <td style="font-weight: 800; color: #64748b; width: 40px; text-align: center;">${idx + 1}</td>
                    <td>
                        <div class="student-name-box">
                            <span class="student-avatar-pill">${avatar}</span>
                            <div>
                                <div class="student-full-name">${escapeHtml(s.name)}</div>
                                <div class="student-meta-sub">${s.gender === 'boy' ? 'ذكر' : 'أنثى'} • ${escapeHtml(s.birthDate || '2018')} • ${escapeHtml(s.phone || 'ولي الأمر')}</div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <span style="font-weight: 900; color: #d97706; font-size: 0.95rem;">${s.stars || 0}</span>
                            <span style="font-size: 0.85rem;">⭐</span>
                            <span style="font-size: 0.75rem; color: #64748b;">(${s.streak || 0} متواصل)</span>
                        </div>
                    </td>
                    <td style="min-width: 140px;">
                        <div style="display: flex; justify-content: space-between; font-size: 0.78rem; font-weight: 800; margin-bottom: 3px;">
                            <span>${s.completedLessons} من 46 درساً</span>
                            <span style="color: #1e40af;">${progressPct}%</span>
                        </div>
                        <div class="skill-bar-track">
                            <div class="skill-bar-fill" style="width: ${progressPct}%; background: ${progressPct >= 80 ? '#16a34a' : (progressPct >= 50 ? '#2563eb' : '#f59e0b')};"></div>
                        </div>
                    </td>
                    <td>
                        <div style="display: flex; gap: 4px; flex-wrap: wrap;">
                            <span class="badge-grade" style="background: #f1f5f9; color: #334155;" title="القراءة">📖 ${s.skills?.reading || 'جيد'}</span>
                            <span class="badge-grade" style="background: #f1f5f9; color: #334155;" title="الكتابة">✍️ ${s.skills?.writing || 'جيد'}</span>
                            <span class="badge-grade" style="background: #f1f5f9; color: #334155;" title="الإملاء">📝 ${s.skills?.spelling || 'جيد'}</span>
                        </div>
                    </td>
                    <td>
                        <span class="badge-grade ${statusClass}">${s.needsSupport ? '⚠️ يحتاج دعم' : s.status}</span>
                    </td>
                    <td>
                        <div style="display: flex; gap: 4px; flex-wrap: wrap;">
                            <button class="table-btn-action table-btn-eval" onclick="TeacherDashboard.openStudentInEvaluationModal('${s.id}')" title="مزامنة مع سجل التقييم الوزاري الفردي">
                                <span>🎓</span> <span>سجل التقييم</span>
                            </button>
                            <button class="table-btn-action table-btn-print" onclick="TeacherDashboard.printIndividualReportForStudent('${s.id}')" title="طباعة بطاقة إشعار ولي الأمر الفردي">
                                <span>🖨️</span> <span>إشعار</span>
                            </button>
                            <button class="table-btn-action table-btn-cert" onclick="TeacherDashboard.printCertificateForStudent('${s.id}')" title="طباعة شهادة تفوق صفية">
                                <span>🏅</span> <span>شهادة</span>
                            </button>
                            <button class="table-btn-action" onclick="TeacherDashboard.editStudent('${s.id}')" title="تعديل بيانات التلميذ">
                                <span>✏️</span>
                            </button>
                            <button class="table-btn-action table-btn-delete" onclick="TeacherDashboard.deleteStudent('${s.id}')" title="حذف التلميذ">
                                <span>🗑️</span>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // --- نموذج إضافة وتعديل التلميذ ---
    let editingStudentId = null;

    function openAddStudentModal() {
        editingStudentId = null;
        const modal = document.getElementById('studentFormModal');
        const titleEl = document.getElementById('studentFormTitle');
        const form = document.getElementById('studentDataForm');

        if (titleEl) titleEl.textContent = 'إضافة تلميذ جديد للشعبة';
        if (form) form.reset();

        const birthInput = document.getElementById('formStudentBirth');
        if (birthInput) birthInput.value = '2018-04-15';

        if (modal) modal.style.display = 'flex';
    }

    function editStudent(studentId) {
        const students = getActiveStudents();
        const std = students.find(s => s.id === studentId);
        if (!std) return;

        editingStudentId = studentId;
        const modal = document.getElementById('studentFormModal');
        const titleEl = document.getElementById('studentFormTitle');

        if (titleEl) titleEl.textContent = `تعديل بيانات التلميذ: ${std.name}`;

        document.getElementById('formStudentName').value = std.name || '';
        document.getElementById('formStudentGender').value = std.gender || 'boy';
        document.getElementById('formStudentBirth').value = std.birthDate || '2018-04-15';
        document.getElementById('formStudentGuardian').value = std.guardianName || '';
        document.getElementById('formStudentPhone').value = std.phone || '';
        document.getElementById('formStudentLessons').value = std.completedLessons || 0;
        document.getElementById('formStudentStars').value = std.stars || 0;
        document.getElementById('formStudentStatus').value = std.status || 'متقن';
        document.getElementById('formStudentNeedsSupport').checked = !!std.needsSupport;
        document.getElementById('formStudentRemedial').value = std.remedialNotes || '';
        document.getElementById('formStudentNotes').value = std.notes || '';

        if (modal) modal.style.display = 'flex';
    }

    function closeStudentFormModal() {
        const modal = document.getElementById('studentFormModal');
        if (modal) modal.style.display = 'none';
    }

    function saveStudentForm(e) {
        if (e && e.preventDefault) e.preventDefault();

        const nameInput = document.getElementById('formStudentName');
        if (!nameInput || !nameInput.value.trim()) {
            alert('يرجى إدخال اسم التلميذ الرباعي أو الثلاثي.');
            return;
        }

        const name = nameInput.value.trim();
        const gender = document.getElementById('formStudentGender').value;
        const birthDate = document.getElementById('formStudentBirth').value;
        const guardianName = document.getElementById('formStudentGuardian').value.trim();
        const phone = document.getElementById('formStudentPhone').value.trim();
        const completedLessons = parseInt(document.getElementById('formStudentLessons').value, 10) || 0;
        const stars = parseInt(document.getElementById('formStudentStars').value, 10) || 0;
        const status = document.getElementById('formStudentStatus').value;
        const needsSupport = document.getElementById('formStudentNeedsSupport').checked;
        const remedialNotes = document.getElementById('formStudentRemedial').value.trim();
        const notes = document.getElementById('formStudentNotes').value.trim();

        const students = getActiveStudents();

        if (editingStudentId) {
            const idx = students.findIndex(s => s.id === editingStudentId);
            if (idx !== -1) {
                students[idx] = Object.assign(students[idx], {
                    name, gender, birthDate, guardianName, phone,
                    completedLessons: Math.min(46, Math.max(0, completedLessons)),
                    stars, status, needsSupport, remedialNotes, notes
                });
            }
        } else {
            const newStudent = {
                id: 'std_' + Date.now(),
                name, gender, birthDate, guardianName, phone,
                completedLessons: Math.min(46, Math.max(0, completedLessons)),
                stars, streak: 5,
                skills: {
                    listening: status === 'متفوق' ? 'ممتاز' : 'جيد جداً',
                    speaking: status === 'متفوق' ? 'ممتاز' : 'جيد',
                    reading: status === 'متفوق' ? 'ممتاز' : (needsSupport ? 'يحتاج دعم' : 'جيد'),
                    writing: status === 'متفوق' ? 'جيد جداً' : 'جيد',
                    spelling: status === 'متفوق' ? 'ممتاز' : (needsSupport ? 'يحتاج دعم' : 'جيد'),
                    memorization: 'ممتاز',
                    participation: 'ممتاز',
                    attendance: 'ممتاز'
                },
                status, needsSupport, remedialNotes, notes
            };
            students.push(newStudent);
        }

        state.studentsMap[state.activeClassId] = students;
        saveData();
        closeStudentFormModal();
        filterRosterTable();
        renderOverviewTab();
    }

    function deleteStudent(studentId) {
        const students = getActiveStudents();
        const std = students.find(s => s.id === studentId);
        if (!std) return;

        if (confirm(`هل أنت متأكد من حذف التلميذ (${std.name}) من سجل الشعبة؟`)) {
            state.studentsMap[state.activeClassId] = students.filter(s => s.id !== studentId);
            saveData();
            filterRosterTable();
            renderOverviewTab();
        }
    }

    // زر توليد عينة تجريبية
    function generateSampleStudentsPrompt() {
        if (confirm('هل تريد ملء الشعبة الحالية بـ 15 تلميذاً وتلميذة ببيانات وإحصائيات متدرجة لتجربة لوحة المعلم؟')) {
            state.studentsMap[state.activeClassId] = generateSampleStudentsList(state.activeClassId);
            saveData();
            filterRosterTable();
            renderOverviewTab();
            alert('✨ تم توليد عينة التلاميذ بنجاح!');
        }
    }

    // رصد نجوم صفية جماعية
    function awardClassStarsPrompt() {
        const input = prompt('أدخل عدد النجوم الإضافية لمكافأة جميع تلاميذ الصف (مثال: 5):', '5');
        if (!input) return;
        const starsAdd = parseInt(input, 10);
        if (isNaN(starsAdd) || starsAdd <= 0) return;

        const students = getActiveStudents();
        students.forEach(s => {
            s.stars = (s.stars || 0) + starsAdd;
        });

        saveData();
        filterRosterTable();
        renderOverviewTab();
        alert(`⭐ تم منح ${starsAdd} نجوم إضافية لكافة تلاميذ الصف بنجاح!`);
    }

    // =========================================================================
    // التبويب 3: سجل الحضور والغياب اليومي (Attendance Tab)
    // =========================================================================
    function renderAttendanceTab() {
        const dateInput = document.getElementById('attendanceDatePicker');
        if (dateInput) dateInput.value = state.currentAttendanceDate;

        const dateStr = state.currentAttendanceDate;
        const students = getActiveStudents();
        const dayRecord = state.attendanceMap[dateStr] || {};

        // حساب إحصائيات اليوم
        let present = 0, absent = 0, late = 0, excused = 0;
        students.forEach(s => {
            const st = dayRecord[s.id] || 'present';
            if (st === 'present') present++;
            else if (st === 'absent') absent++;
            else if (st === 'late') late++;
            else if (st === 'excused') excused++;
        });

        const elPres = document.getElementById('attStatsPresent');
        const elAbs = document.getElementById('attStatsAbsent');
        const elLate = document.getElementById('attStatsLate');
        const elExc = document.getElementById('attStatsExcused');
        const elPct = document.getElementById('attStatsRate');

        if (elPres) elPres.textContent = present;
        if (elAbs) elAbs.textContent = absent;
        if (elLate) elLate.textContent = late;
        if (elExc) elExc.textContent = excused;
        if (elPct) {
            const rate = students.length > 0 ? Math.round((present / students.length) * 100) : 0;
            elPct.textContent = `${rate}%`;
        }

        const tableBody = document.getElementById('attendanceTableBody');
        if (!tableBody) return;

        if (students.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 30px; color: #64748b;">لا يوجد تلاميذ مسجلون في هذه الشعبة.</td></tr>';
            return;
        }

        tableBody.innerHTML = students.map((s, idx) => {
            const currentStatus = dayRecord[s.id] || 'present';
            const avatar = s.gender === 'boy' ? '👦' : '👧';

            return `
                <tr>
                    <td style="width: 40px; text-align: center; font-weight: 800;">${idx + 1}</td>
                    <td>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 1.3rem;">${avatar}</span>
                            <span style="font-weight: 800; color: #1e293b;">${escapeHtml(s.name)}</span>
                        </div>
                    </td>
                    <td>
                        <div style="display: flex; gap: 6px;">
                            <button class="attendance-status-badge ${currentStatus === 'present' ? 'att-present' : ''}" onclick="TeacherDashboard.toggleStudentAttendance('${s.id}', 'present')">
                                ✔️ حاضر
                            </button>
                            <button class="attendance-status-badge ${currentStatus === 'absent' ? 'att-absent' : ''}" onclick="TeacherDashboard.toggleStudentAttendance('${s.id}', 'absent')">
                                ❌ غائب
                            </button>
                            <button class="attendance-status-badge ${currentStatus === 'late' ? 'att-late' : ''}" onclick="TeacherDashboard.toggleStudentAttendance('${s.id}', 'late')">
                                ⚠️ متأخر
                            </button>
                            <button class="attendance-status-badge ${currentStatus === 'excused' ? 'att-excused' : ''}" onclick="TeacherDashboard.toggleStudentAttendance('${s.id}', 'excused')">
                                📝 إجازة
                            </button>
                        </div>
                    </td>
                    <td>
                        <span style="font-size: 0.8rem; color: #64748b;">${escapeHtml(s.phone || 'ولي الأمر مسجل')}</span>
                    </td>
                </tr>
            `;
        }).join('');
    }

    function onAttendanceDateChange(date) {
        state.currentAttendanceDate = date;
        renderAttendanceTab();
    }

    function stepAttendanceDate(delta) {
        const cur = new Date(state.currentAttendanceDate);
        cur.setDate(cur.getDate() + delta);
        const y = cur.getFullYear();
        const m = String(cur.getMonth() + 1).padStart(2, '0');
        const d = String(cur.getDate()).padStart(2, '0');
        state.currentAttendanceDate = `${y}-${m}-${d}`;
        renderAttendanceTab();
    }

    function setAllAttendanceStatus(status) {
        const dateStr = state.currentAttendanceDate;
        if (!state.attendanceMap[dateStr]) state.attendanceMap[dateStr] = {};

        const students = getActiveStudents();
        students.forEach(s => {
            state.attendanceMap[dateStr][s.id] = status;
        });

        saveData();
        renderAttendanceTab();
    }

    function toggleStudentAttendance(studentId, status) {
        const dateStr = state.currentAttendanceDate;
        if (!state.attendanceMap[dateStr]) state.attendanceMap[dateStr] = {};

        state.attendanceMap[dateStr][studentId] = status;
        saveData();
        renderAttendanceTab();
    }

    // =========================================================================
    // التبويب 4: خطة الدعم الفونيمي والمعالجة القرائية (Remedial Tab)
    // =========================================================================
    function renderRemedialTab() {
        const students = getActiveStudents();
        const remedialList = students.filter(s => s.needsSupport || s.status === 'يحتاج دعم');
        const container = document.getElementById('remedialCardsContainer');
        const countBadge = document.getElementById('remedialCasesCount');

        if (countBadge) countBadge.textContent = `${remedialList.length} حالات للمتابعة`;
        if (!container) return;

        if (remedialList.length === 0) {
            container.innerHTML = `
                <div style="background: white; border: 1.5px solid #bbf7d0; border-radius: 16px; padding: 40px; text-align: center; color: #166534;">
                    <div style="font-size: 3rem; margin-bottom: 10px;">🌟</div>
                    <h3 style="margin: 0 0 6px 0; font-size: 1.2rem;">رائع جداً! لا توجد حالات تعثر في هذه الشعبة</h3>
                    <p style="margin: 0; font-size: 0.9rem; color: #15803d;">كافة تلاميذ الصف يحققون مستويات إتقان متميزة في القراءة والكتابة والوعي الفونيمي.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = remedialList.map(s => {
            const avatar = s.gender === 'boy' ? '👦' : '👧';
            const defaultRemedial = s.gender === 'boy' ?
                'صعوبة في التمييز بين صوت (د) و (ر) والخلط في نطق الحركات القصيرة.' :
                'صعوبة في دمج المقاطع الثنائية وبطء في التهجئة الصوتية.';
            const problemDesc = s.remedialNotes || defaultRemedial;

            return `
                <div class="remedial-card">
                    <div style="flex-grow: 1;">
                        <div class="remedial-student-info">
                            <span class="student-avatar-pill">${avatar}</span>
                            <div>
                                <div style="font-weight: 900; font-size: 1.05rem; color: #1e293b;">${escapeHtml(s.name)}</div>
                                <div style="font-size: 0.78rem; color: #64748b;">نسبة إنجاز المنهج: ${Math.round((s.completedLessons/46)*100)}% • النجوم: ${s.stars || 0} ⭐</div>
                            </div>
                        </div>
                        <div class="remedial-details-grid">
                            <div style="background: #fff1f2; border: 1px solid #fecdd3; padding: 8px 12px; border-radius: 8px;">
                                <div style="font-weight: 800; color: #9f1239; margin-bottom: 2px;">⚠️ التحدي الفونيمي المرصود:</div>
                                <div style="color: #475569;">${problemDesc}</div>
                            </div>
                            <div style="background: #eff6ff; border: 1px solid #bfdbfe; padding: 8px 12px; border-radius: 8px;">
                                <div style="font-weight: 800; color: #1d4ed8; margin-bottom: 2px;">💡 الأداة المقترحة في المنصة:</div>
                                <div style="color: #475569;">سبورة تتبع الحروف + ألعاب بطاقات القراءة الذكية + تحدي النجوم اليومي.</div>
                            </div>
                            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 8px 12px; border-radius: 8px;">
                                <div style="font-weight: 800; color: #15803d; margin-bottom: 2px;">🏠 توجيه ولي الأمر والمنزل:</div>
                                <div style="color: #475569;">الاستماع إلى أصوات الحروف النقية من المنصة وتدريب اليد لمدة 10 دقائق يومياً.</div>
                            </div>
                        </div>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 6px; min-width: 130px;">
                        <button class="btn-roster-action btn-roster-primary" style="font-size: 0.78rem; padding: 6px 10px;" onclick="TeacherDashboard.editStudent('${s.id}')">
                            ✏️ تعديل الخطة
                        </button>
                        <button class="btn-roster-action" style="background: #f1f5f9; border: 1px solid #cbd5e1; font-size: 0.78rem; padding: 6px 10px;" onclick="TeacherDashboard.openStudentInEvaluationModal('${s.id}')">
                            🎓 سجل التقييم
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // =========================================================================
    // التبويب 5: التقارير المطبوعة أوفلاين (Printable Reports Tab)
    // =========================================================================
    function renderReportsTab() {
        populateReportStudentSelect();
        updateReportPreview();
    }

    function populateReportStudentSelect() {
        const select = document.getElementById('reportStudentSelect');
        if (!select) return;

        const students = getActiveStudents();
        if (students.length === 0) {
            select.innerHTML = '<option value="">لا يوجد تلاميذ في الشعبة</option>';
            state.activeReportStudentId = null;
            return;
        }

        if (!state.activeReportStudentId || !students.some(s => s.id === state.activeReportStudentId)) {
            state.activeReportStudentId = students[0].id;
        }

        select.innerHTML = students.map(s => `
            <option value="${s.id}" ${s.id === state.activeReportStudentId ? 'selected' : ''}>${escapeHtml(s.name)} (${s.gender === 'boy' ? 'ذكر' : 'أنثى'})</option>
        `).join('');
    }

    function onReportStudentChange(studentId) {
        state.activeReportStudentId = studentId;
        updateReportPreview();
    }

    function selectReportType(reportType) {
        state.activeReportType = reportType;

        // تحديث البطاقات
        const cards = document.querySelectorAll('.report-option-card');
        cards.forEach(card => {
            card.classList.toggle('selected', card.getAttribute('data-type') === reportType);
        });

        // ضبط اتجاه الورقة التلقائي
        if (reportType === 'cert' || reportType === 'roster') {
            state.reportOrientation = 'landscape';
        } else {
            state.reportOrientation = 'portrait';
        }

        // إظهار أو إخفاء حقل اختيار التلميذ
        const studentSelectBox = document.getElementById('reportStudentSelectBox');
        if (studentSelectBox) {
            studentSelectBox.style.display = (reportType === 'individual' || reportType === 'cert') ? 'flex' : 'none';
        }

        updateReportPreview();
    }

    function toggleReportOrientation() {
        state.reportOrientation = state.reportOrientation === 'portrait' ? 'landscape' : 'portrait';
        updateReportPreview();
    }

    function updateReportPreview() {
        const previewContainer = document.getElementById('reportLivePreviewContainer');
        const printAreaContainer = document.getElementById('teacherPrintArea');
        if (!previewContainer) return;

        let htmlContent = '';
        const reportType = state.activeReportType;

        if (reportType === 'roster') {
            htmlContent = generateClassRosterHTML();
        } else if (reportType === 'individual') {
            htmlContent = generateIndividualReportHTML(state.activeReportStudentId);
        } else if (reportType === 'remedial') {
            htmlContent = generateRemedialPlanHTML();
        } else if (reportType === 'cert') {
            htmlContent = generateMeritCertificateHTML(state.activeReportStudentId);
        }

        previewContainer.innerHTML = htmlContent;

        // مزامنة منطقة الطباعة المباشرة لـ @media print
        if (printAreaContainer) {
            printAreaContainer.innerHTML = htmlContent;
        }

        // تحديث زر الاتجاه
        const orientBtn = document.getElementById('btnReportOrientText');
        if (orientBtn) {
            orientBtn.textContent = state.reportOrientation === 'portrait' ? 'أفقي (Landscape)' : 'رأسي (Portrait)';
        }
    }

    // توليد HTML كشف الصف الشامل
    function generateClassRosterHTML() {
        const students = getActiveStudents();
        const classObj = getActiveClassObj();
        const isLandscape = state.reportOrientation === 'landscape';

        return `
            <div class="printable-sheet ${isLandscape ? 'landscape' : ''}">
                <div class="official-print-header">
                    <div class="official-print-ministry">
                        جمهورية العراق<br>
                        وزارة التربية<br>
                        ${escapeHtml(state.settings.directorate)}<br>
                        ${escapeHtml(state.settings.schoolName)}
                    </div>
                    <div class="official-print-title-box">
                        <h2 class="official-print-main-title">سجل متابعة وتقييم الصف الدراسي الشامل</h2>
                        <div class="official-print-sub-title">منصة قراءتي التفاعلية الذكية • الصف الأول الابتدائي (${escapeHtml(classObj.name)})</div>
                        <div style="font-size: 0.82rem; color: #475569; margin-top: 3px;">العام الدراسي: ${state.settings.academicYear} • تاريخ الطباعة: ${getTodayDateString()}</div>
                    </div>
                    <div class="official-print-logo-box">
                        <b>نظام التقييم الفونيمي الذكي</b><br>
                        إعداد: المهندس أسامة خليل هاشم<br>
                        عدد المقيدين: ${students.length} تلميذاً
                    </div>
                </div>

                <table class="roster-table" style="width: 100%; border: 1.5px solid #1e3a8a; font-size: ${isLandscape ? '0.82rem' : '0.74rem'}; margin-top: 10px;">
                    <thead>
                        <tr style="background: #1e3a8a; color: white;">
                            <th style="padding: 6px; border: 1px solid #cbd5e1; text-align: center; color: white;">ت</th>
                            <th style="padding: 6px; border: 1px solid #cbd5e1; text-align: right; color: white;">اسم التلميذ الرباعي</th>
                            <th style="padding: 6px; border: 1px solid #cbd5e1; text-align: center; color: white;">الجنس</th>
                            <th style="padding: 6px; border: 1px solid #cbd5e1; text-align: center; color: white;">النجوم ⭐</th>
                            <th style="padding: 6px; border: 1px solid #cbd5e1; text-align: center; color: white;">إنجاز المنهج</th>
                            <th style="padding: 6px; border: 1px solid #cbd5e1; text-align: center; color: white;">الاستماع</th>
                            <th style="padding: 6px; border: 1px solid #cbd5e1; text-align: center; color: white;">القراءة</th>
                            <th style="padding: 6px; border: 1px solid #cbd5e1; text-align: center; color: white;">الكتابة</th>
                            <th style="padding: 6px; border: 1px solid #cbd5e1; text-align: center; color: white;">الإملاء</th>
                            <th style="padding: 6px; border: 1px solid #cbd5e1; text-align: center; color: white;">المواظبة</th>
                            <th style="padding: 6px; border: 1px solid #cbd5e1; text-align: center; color: white;">التقدير العام</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${students.map((s, idx) => `
                            <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                                <td style="padding: 5px; border: 1px solid #cbd5e1; text-align: center; font-weight: 800;">${idx + 1}</td>
                                <td style="padding: 5px; border: 1px solid #cbd5e1; font-weight: 800;">${escapeHtml(s.name)}</td>
                                <td style="padding: 5px; border: 1px solid #cbd5e1; text-align: center;">${s.gender === 'boy' ? 'ذكر' : 'أنثى'}</td>
                                <td style="padding: 5px; border: 1px solid #cbd5e1; text-align: center; font-weight: 800; color: #b45309;">${s.stars || 0}</td>
                                <td style="padding: 5px; border: 1px solid #cbd5e1; text-align: center; font-weight: 800; color: #1e40af;">${Math.round((s.completedLessons/46)*100)}%</td>
                                <td style="padding: 5px; border: 1px solid #cbd5e1; text-align: center;">${s.skills?.listening || 'جيد'}</td>
                                <td style="padding: 5px; border: 1px solid #cbd5e1; text-align: center;">${s.skills?.reading || 'جيد'}</td>
                                <td style="padding: 5px; border: 1px solid #cbd5e1; text-align: center;">${s.skills?.writing || 'جيد'}</td>
                                <td style="padding: 5px; border: 1px solid #cbd5e1; text-align: center;">${s.skills?.spelling || 'جيد'}</td>
                                <td style="padding: 5px; border: 1px solid #cbd5e1; text-align: center;">${s.skills?.attendance || 'ممتاز'}</td>
                                <td style="padding: 5px; border: 1px solid #cbd5e1; text-align: center; font-weight: 900;">${s.needsSupport ? 'يحتاج دعم' : s.status}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div class="official-print-footer">
                    <div class="signature-box">
                        <div class="signature-title">معلم الصف الأول الابتدائي</div>
                        <div class="signature-line">${escapeHtml(state.settings.teacherName)}</div>
                    </div>
                    <div style="text-align: center; font-size: 0.8rem; color: #64748b;">
                        <div>منصة قراءتي التفاعلية الذكية المعتمدة أوفلاين</div>
                        <div style="font-weight: 800; color: #059669; margin-top: 2px;">إعداد وتطوير: المهندس أسامة خليل هاشم</div>
                    </div>
                    <div class="signature-box">
                        <div class="signature-title">مدير / مديرة المدرسة</div>
                        <div class="signature-line">${escapeHtml(state.settings.headmasterName)}</div>
                    </div>
                </div>
            </div>
        `;
    }

    // توليد HTML بطاقة التقرير الفردي للتلميذ
    function generateIndividualReportHTML(studentId) {
        const students = getActiveStudents();
        const std = students.find(s => s.id === studentId) || students[0] || {
            name: 'تلميذ نموذج',
            gender: 'boy',
            completedLessons: 40,
            stars: 120,
            status: 'متفوق',
            skills: {}
        };
        const classObj = getActiveClassObj();
        const progressPct = Math.round((std.completedLessons / 46) * 100);

        return `
            <div class="printable-sheet">
                <div class="official-print-header">
                    <div class="official-print-ministry">
                        جمهورية العراق • وزارة التربية<br>
                        ${escapeHtml(state.settings.directorate)}<br>
                        ${escapeHtml(state.settings.schoolName)}
                    </div>
                    <div class="official-print-title-box">
                        <h2 class="official-print-main-title">بطاقة التقرير الفردي وإشعار ولي الأمر</h2>
                        <div class="official-print-sub-title">منصة قراءتي التفاعلية الذكية • الصف الأول الابتدائي</div>
                        <div style="font-size: 0.82rem; color: #475569; margin-top: 3px;">العام الدراسي: ${state.settings.academicYear}</div>
                    </div>
                    <div class="official-print-logo-box">
                        <b>سجل الإنجاز والتقييم الصفي</b><br>
                        إعداد: المهندس أسامة خليل هاشم
                    </div>
                </div>

                <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 14px 18px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 14px;">
                        <span style="font-size: 2.8rem;">${std.gender === 'boy' ? '👦' : '👧'}</span>
                        <div>
                            <h3 style="margin: 0 0 4px 0; font-size: 1.25rem; color: #1e3a8a;">${escapeHtml(std.name)}</h3>
                            <div style="font-size: 0.85rem; color: #475569;">
                                الشعبة: <b>${escapeHtml(classObj.name)}</b> • التولد: <b>${escapeHtml(std.birthDate || '2018')}</b> • ولي الأمر: <b>${escapeHtml(std.guardianName || 'مسجل')}</b>
                            </div>
                        </div>
                    </div>
                    <div style="text-align: left;">
                        <div style="font-size: 0.85rem; font-weight: 800; color: #059669;">التقدير العام: <span style="font-size: 1.1rem;">${std.needsSupport ? 'يحتاج دعم' : std.status}</span></div>
                        <div style="font-size: 0.85rem; font-weight: 800; color: #d97706; margin-top: 2px;">رصيد النجوم: <span style="font-size: 1.1rem;">${std.stars || 0} ⭐</span></div>
                    </div>
                </div>

                <div style="margin-bottom: 16px;">
                    <h4 style="margin: 0 0 8px 0; font-size: 0.95rem; color: #1e3a8a; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 4px;">
                        📊 مسيرة إنجاز المنهج والأنشطة القرائية:
                    </h4>
                    <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.85rem; font-weight: 800; margin-bottom: 4px;">
                        <span>تم إكمال ${std.completedLessons} درساً ونشاطاً من أصل 46 درساً في كتاب قراءتي</span>
                        <span style="color: #1e40af;">${progressPct}%</span>
                    </div>
                    <div class="skill-bar-track" style="height: 10px;">
                        <div class="skill-bar-fill" style="width: ${progressPct}%; background: #16a34a;"></div>
                    </div>
                </div>

                <div style="margin-bottom: 16px;">
                    <h4 style="margin: 0 0 8px 0; font-size: 0.95rem; color: #1e3a8a; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 4px;">
                        📝 مستويات إتقان المهارات اللغوية والفونيمية:
                    </h4>
                    <table style="width: 100%; border-collapse: collapse; font-size: 0.82rem;">
                        <thead>
                            <tr style="background: #f1f5f9;">
                                <th style="border: 1px solid #cbd5e1; padding: 6px; text-align: right;">المهارة القرائية</th>
                                <th style="border: 1px solid #cbd5e1; padding: 6px; text-align: center;">المستوى المرصود</th>
                                <th style="border: 1px solid #cbd5e1; padding: 6px; text-align: right;">الوصف والتقييم</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${SKILLS_LIST.map(sk => {
                                const grade = std.skills ? (std.skills[sk.id] || 'جيد') : 'جيد';
                                return `
                                    <tr>
                                        <td style="border: 1px solid #cbd5e1; padding: 6px; font-weight: 800;">${sk.icon} ${sk.name}</td>
                                        <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center; font-weight: 900; color: #1e40af;">${grade}</td>
                                        <td style="border: 1px solid #cbd5e1; padding: 6px; color: #475569;">${grade === 'ممتاز' ? 'إتقان تام وطلاقة عالية' : (grade === 'جيد جداً' ? 'مستوى متقدم ومتميز' : (grade === 'يحتاج دعم' ? 'يحتاج متابعة وتدريباً منزلياً إضافياً' : 'مستوى جيد ومستقر'))}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
                    <div style="background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 10px; padding: 10px 14px;">
                        <b style="color: #166534; font-size: 0.85rem;">🌟 نقاط القوة والتميز:</b>
                        <p style="margin: 4px 0 0 0; font-size: 0.8rem; color: #334155; line-height: 1.4;">${escapeHtml(std.notes || 'تلميذ متفاعل ومواظب، يمتلك دافعية عالية للقراءة والتهجئة الفونيمية.')}</p>
                    </div>
                    <div style="background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 10px; padding: 10px 14px;">
                        <b style="color: #92400e; font-size: 0.85rem;">💡 توصيات المعلم لولي الأمر:</b>
                        <p style="margin: 4px 0 0 0; font-size: 0.8rem; color: #334155; line-height: 1.4;">${escapeHtml(std.remedialNotes || 'الاستمرار في تشجيع التلميذ على تتبع الحروف بالقلم واستماع أصوات الكلمات أوفلاين يومياً.')}</p>
                    </div>
                </div>

                <!-- إشعار استلام وتوقيع ولي الأمر المقتطع -->
                <div style="border-top: 2px dashed #94a3b8; padding-top: 10px; margin-top: 15px;">
                    <div style="font-size: 0.78rem; font-weight: 800; color: #64748b; margin-bottom: 6px; text-align: center;">
                        ✂️ (يُفصل هذا الجزء ويُعاد إلى إدارة المدرسة بعد توقيع ولي الأمر)
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; background: #f8fafc; padding: 8px 14px; border: 1px solid #cbd5e1; border-radius: 8px;">
                        <div>
                            أنا ولي أمر التلميذ/ة: <b>${escapeHtml(std.name)}</b> • اطلعت على تقرير المستوى لشهر (تشرين/تشرين الثاني).
                        </div>
                        <div style="display: flex; gap: 20px;">
                            <span>توقيع ولي الأمر: ......................</span>
                            <span>التاريخ: .... / .... / 2026</span>
                        </div>
                    </div>
                </div>

                <div class="official-print-footer">
                    <div class="signature-box">
                        <div class="signature-title">معلم الصف الأول الابتدائي</div>
                        <div class="signature-line">${escapeHtml(state.settings.teacherName)}</div>
                    </div>
                    <div style="text-align: center; font-size: 0.78rem; color: #64748b;">
                        <b>إعداد وتطوير: المهندس أسامة خليل هاشم</b><br>
                        منصة قراءتي التفاعلية الذكية PWA أوفلاين
                    </div>
                    <div class="signature-box">
                        <div class="signature-title">مدير / مديرة المدرسة</div>
                        <div class="signature-line">${escapeHtml(state.settings.headmasterName)}</div>
                    </div>
                </div>
            </div>
        `;
    }

    // توليد خطة الدعم الفونيمي A4
    function generateRemedialPlanHTML() {
        const students = getActiveStudents();
        const remedialList = students.filter(s => s.needsSupport || s.status === 'يحتاج دعم');
        const classObj = getActiveClassObj();

        return `
            <div class="printable-sheet">
                <div class="official-print-header">
                    <div class="official-print-ministry">
                        جمهورية العراق • وزارة التربية<br>
                        ${escapeHtml(state.settings.directorate)}<br>
                        ${escapeHtml(state.settings.schoolName)}
                    </div>
                    <div class="official-print-title-box">
                        <h2 class="official-print-main-title">سجل خطة الدعم الفونيمي والمعالجة القرائية</h2>
                        <div class="official-print-sub-title">تشخيص ومتابعة حالات التعثر اللغوي • ${escapeHtml(classObj.name)}</div>
                        <div style="font-size: 0.82rem; color: #475569; margin-top: 3px;">العام الدراسي: ${state.settings.academicYear}</div>
                    </div>
                    <div class="official-print-logo-box">
                        <b>نظام التشخيص العلاجي</b><br>
                        إعداد: المهندس أسامة خليل هاشم
                    </div>
                </div>

                <table class="roster-table" style="width: 100%; border: 1.5px solid #dc2626; font-size: 0.82rem; margin-top: 14px;">
                    <thead>
                        <tr style="background: #dc2626; color: white;">
                            <th style="padding: 8px; border: 1px solid #cbd5e1; text-align: center; color: white;">ت</th>
                            <th style="padding: 8px; border: 1px solid #cbd5e1; text-align: right; color: white;">اسم التلميذ</th>
                            <th style="padding: 8px; border: 1px solid #cbd5e1; text-align: right; color: white;">الصعوبة أو التحدي الفونيمي</th>
                            <th style="padding: 8px; border: 1px solid #cbd5e1; text-align: right; color: white;">الإجراء العلاجي في المنصة</th>
                            <th style="padding: 8px; border: 1px solid #cbd5e1; text-align: center; color: white;">حالة المتابعة</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${remedialList.length === 0 ? `
                            <tr><td colspan="5" style="text-align: center; padding: 25px;">لا توجد حالات تعثر في هذه الشعبة.</td></tr>
                        ` : remedialList.map((s, idx) => `
                            <tr>
                                <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center; font-weight: 800;">${idx + 1}</td>
                                <td style="padding: 8px; border: 1px solid #cbd5e1; font-weight: 800; color: #1e3a8a;">${escapeHtml(s.name)}</td>
                                <td style="padding: 8px; border: 1px solid #cbd5e1; color: #b91c1c;">${escapeHtml(s.remedialNotes || 'صعوبة في تمييز الحركات وحروف المد والتهجئة المقطعية.')}</td>
                                <td style="padding: 8px; border: 1px solid #cbd5e1; color: #15803d;">سبورة تتبع الحروف + بطاقات القراءة الذكية + تحدي النجوم.</td>
                                <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center; font-weight: 800;">قيد المتابعة اليومية</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div class="official-print-footer">
                    <div class="signature-box">
                        <div class="signature-title">معلم الصف الأول الابتدائي</div>
                        <div class="signature-line">${escapeHtml(state.settings.teacherName)}</div>
                    </div>
                    <div style="text-align: center; font-size: 0.78rem; color: #64748b;">
                        <b>إعداد وتطوير: المهندس أسامة خليل هاشم</b><br>
                        منصة قراءتي التفاعلية الذكية PWA أوفلاين
                    </div>
                    <div class="signature-box">
                        <div class="signature-title">المشرف التربوي المتابع</div>
                        <div class="signature-line">.....................................</div>
                    </div>
                </div>
            </div>
        `;
    }

    // توليد شهادة الشكر والتفوق الصفية A4 Landscape
    function generateMeritCertificateHTML(studentId) {
        const students = getActiveStudents();
        const std = students.find(s => s.id === studentId) || students[0] || {
            name: 'بطل قراءتي الذكية',
            gender: 'boy',
            stars: 150
        };
        const classObj = getActiveClassObj();

        return `
            <div class="printable-sheet landscape merit-certificate-sheet">
                <div class="merit-cert-header-icon">👑</div>
                <div class="merit-cert-presented-to">جمهورية العراق • وزارة التربية • ${escapeHtml(state.settings.schoolName)}</div>
                <h1 class="merit-cert-title">شهادة شكر وتفوق وتميز قرائي</h1>
                <div class="merit-cert-presented-to">تتشرف إدارة المدرسة ومعلم الصف بمنح هذه الشهادة للتلميذ/ة البطل/ة:</div>
                <div class="merit-cert-student-name">${escapeHtml(std.name)}</div>
                <div class="merit-cert-body-text">
                    تقديراً لتميزه الباهر واجتهاده الرائع في إتقان دروس كتاب قراءتي الجديد للصف الأول الابتدائي،
                    وحصوله على رصيد <b>(${std.stars || 0}) نجمة تفاعلية</b> في تحديات القراءة الفونيمية والتهجئة الذكية،
                    متمنين له دوام التألق والنجاح في مسيرته الدراسية المباركة.
                </div>

                <div style="display: flex; justify-content: space-around; align-items: flex-end; margin-top: 30px; font-size: 0.95rem;">
                    <div class="signature-box">
                        <div style="font-weight: 900; margin-bottom: 30px; color: #1e3a8a;">معلم الصف الأول الابتدائي</div>
                        <div class="signature-line">${escapeHtml(state.settings.teacherName)}</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 1.8rem;">⭐ 🏅 ⭐</div>
                        <div style="font-size: 0.85rem; font-weight: 800; color: #047857; margin-top: 4px;">
                            إعداد وتطوير: المهندس أسامة خليل هاشم
                        </div>
                    </div>
                    <div class="signature-box">
                        <div style="font-weight: 900; margin-bottom: 30px; color: #1e3a8a;">مدير / مديرة المدرسة</div>
                        <div class="signature-line">${escapeHtml(state.settings.headmasterName)}</div>
                    </div>
                </div>
            </div>
        `;
    }

    // أمر الطباعة المباشر
    function printCurrentReport() {
        window.print();
    }

    // طباعة إشعار تلميذ محدد مباشرة
    function printIndividualReportForStudent(studentId) {
        state.activeReportStudentId = studentId;
        state.activeReportType = 'individual';
        openModal('reports');
        selectReportType('individual');
    }

    // طباعة شهادة تلميذ محدد مباشرة
    function printCertificateForStudent(studentId) {
        state.activeReportStudentId = studentId;
        state.activeReportType = 'cert';
        openModal('reports');
        selectReportType('cert');
    }

    // =========================================================================
    // التبويب 6: الإعدادات وإدارة البيانات واستيراد/تصدير CSV / JSON
    // =========================================================================
    function renderSettingsTab() {
        document.getElementById('settingTeacherName').value = state.settings.teacherName || '';
        document.getElementById('settingSchoolName').value = state.settings.schoolName || '';
        document.getElementById('settingDirectorate').value = state.settings.directorate || '';
        document.getElementById('settingAcademicYear').value = state.settings.academicYear || '';
        document.getElementById('settingHeadmaster').value = state.settings.headmasterName || '';

        // قائمة إدارة الشعب
        const classesListEl = document.getElementById('classesManageList');
        if (classesListEl) {
            classesListEl.innerHTML = state.classes.map(c => `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: white; border: 1px solid #cbd5e1; border-radius: 8px; margin-bottom: 6px;">
                    <span style="font-weight: 800; color: #1e293b;">${escapeHtml(c.name)}</span>
                    <div style="display: flex; gap: 6px;">
                        <button class="table-btn-action" onclick="TeacherDashboard.renameClassPrompt('${c.id}')">✏️ إعادة تسمية</button>
                        ${state.classes.length > 1 ? `<button class="table-btn-action table-btn-delete" onclick="TeacherDashboard.deleteClassPrompt('${c.id}')">🗑️ حذف</button>` : ''}
                    </div>
                </div>
            `).join('');
        }
    }

    function saveTeacherSettings(e) {
        if (e && e.preventDefault) e.preventDefault();

        state.settings.teacherName = document.getElementById('settingTeacherName').value.trim() || 'معلم الصف';
        state.settings.schoolName = document.getElementById('settingSchoolName').value.trim() || 'المدرسة الابتدائية';
        state.settings.directorate = document.getElementById('settingDirectorate').value.trim() || 'مديرية التربية';
        state.settings.academicYear = document.getElementById('settingAcademicYear').value.trim() || '2026 / 2027';
        state.settings.headmasterName = document.getElementById('settingHeadmaster').value.trim() || 'مدير المدرسة';

        saveData();
        alert('✔ تم حفظ إعدادات المعلم والمدرسة بنجاح!');
        renderOverviewTab();
    }

    function renameClassPrompt(classId) {
        const cls = state.classes.find(c => c.id === classId);
        if (!cls) return;
        const newName = prompt('أدخل الاسم الجديد للشعبة:', cls.name);
        if (newName && newName.trim()) {
            cls.name = newName.trim();
            saveData();
            renderSettingsTab();
            renderClassSelectorDropdown();
            updateSidebarCard();
        }
    }

    function deleteClassPrompt(classId) {
        if (state.classes.length <= 1) {
            alert('لا يمكن حذف الشعبة الوحيدة المتبقية في النظام.');
            return;
        }
        if (confirm('هل أنت متأكد من حذف هذه الشعبة بكافة سجلات تلاميذها؟')) {
            state.classes = state.classes.filter(c => c.id !== classId);
            delete state.studentsMap[classId];
            if (state.activeClassId === classId) {
                state.activeClassId = state.classes[0].id;
            }
            saveData();
            renderSettingsTab();
            renderClassSelectorDropdown();
            updateSidebarCard();
        }
    }

    // تصدير كشف إكسل (CSV) مع بوم للغة العربية
    function exportRosterToCSV() {
        const students = getActiveStudents();
        const classObj = getActiveClassObj();

        if (students.length === 0) {
            alert('لا توجد بيانات تلاميذ لتصديرها في الشعبة الحالية.');
            return;
        }

        const headers = ['ت', 'اسم التلميذ', 'الجنس', 'تاريخ الميلاد', 'ولي الأمر', 'الهاتف', 'النجوم', 'إنجاز المنهج (%)', 'الاستماع', 'القراءة', 'الكتابة', 'الإملاء', 'التقدير العام', 'ملاحظات المعلم'];
        
        const rows = students.map((s, idx) => [
            idx + 1,
            `"${s.name.replace(/"/g, '""')}"`,
            s.gender === 'boy' ? 'ذكر' : 'أنثى',
            s.birthDate || '',
            `"${(s.guardianName || '').replace(/"/g, '""')}"`,
            s.phone || '',
            s.stars || 0,
            Math.round((s.completedLessons / 46) * 100),
            s.skills?.listening || 'جيد',
            s.skills?.reading || 'جيد',
            s.skills?.writing || 'جيد',
            s.skills?.spelling || 'جيد',
            s.needsSupport ? 'يحتاج دعم' : s.status,
            `"${(s.notes || '').replace(/"/g, '""')}"`
        ]);

        const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
        downloadFile(csvContent, `سجل_تلاميذ_${classObj.name.replace(/\s+/g, '_')}_${getTodayDateString()}.csv`, 'text/csv;charset=utf-8;');
    }

    // تصدير نسخة احتياطية كاملة JSON
    function exportBackupJSON() {
        const backupData = {
            version: '3.42',
            exportedAt: new Date().toISOString(),
            author: 'المهندس أسامة خليل هاشم',
            platform: 'منصة قراءتي التفاعلية الذكية',
            classes: state.classes,
            studentsMap: state.studentsMap,
            settings: state.settings,
            attendanceMap: state.attendanceMap
        };

        const jsonStr = JSON.stringify(backupData, null, 2);
        downloadFile(jsonStr, `نسخة_احتياطية_لوحة_المعلم_قراءتي_${getTodayDateString()}.json`, 'application/json');
    }

    // استيراد نسخة احتياطية JSON
    function importBackupJSON(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                if (!data.classes || !data.studentsMap) {
                    alert('ملف النسخة الاحتياطية غير صالح أو غير متوافق مع نظام قراءتي.');
                    return;
                }

                if (confirm('هل أنت متأكد من استعادة هذه النسخة الاحتياطية؟ سيتم استبدال سجلات الصف الحالية بالبيانات المستوردة.')) {
                    state.classes = data.classes;
                    state.studentsMap = data.studentsMap;
                    if (data.settings) state.settings = Object.assign(state.settings, data.settings);
                    if (data.attendanceMap) state.attendanceMap = data.attendanceMap;
                    if (state.classes.length > 0) state.activeClassId = state.classes[0].id;

                    saveData();
                    renderClassSelectorDropdown();
                    switchTab(state.activeTab);
                    alert('✔ تم استعادة النسخة الاحتياطية بنجاح!');
                }
            } catch (err) {
                alert('فشل قراءة ملف النسخة الاحتياطية: ' + err.message);
            }
        };
        reader.readAsText(file);
    }

    // إعادة تعيين بيانات الشعبة
    function resetClassDataPrompt() {
        if (confirm('تحذير: هل أنت متأكد من مسح كافة سجلات التلاميذ في الشعبة الحالية؟ لا يمكن التراجع عن هذا الإجراء.')) {
            state.studentsMap[state.activeClassId] = [];
            saveData();
            switchTab(state.activeTab);
            alert('تم مسح سجلات الشعبة بنجاح.');
        }
    }

    function downloadFile(content, fileName, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // مزامنة وفتح التلميذ في سجل التقييم الوزاري الفردي
    function openStudentInEvaluationModal(studentId) {
        const students = getActiveStudents();
        const std = students.find(s => s.id === studentId);
        if (!std) return;

        const classObj = getActiveClassObj();

        // تحديث بروفايل التلميذ في التخزين المحلي لنافذة التقييم
        const profile = {
            name: std.name,
            birthDate: std.birthDate || '15 / 04 / 2018',
            socialStatus: 'مستقر وطبيعي',
            behavior: std.status === 'متفوق' ? 'متميز ومؤدب' : 'حسن السيرة',
            school: state.settings.schoolName,
            grade: classObj.name,
            teacher: state.settings.teacherName,
            avatar: std.gender === 'boy' ? '👦' : '👧'
        };

        try {
            localStorage.setItem('qiraati-smart-eval-profile', JSON.stringify(profile));
        } catch (e) {}

        closeModal();

        if (typeof window.openEvaluationModal === 'function') {
            window.openEvaluationModal('eval');
        } else {
            const evalModal = document.getElementById('evaluationModal');
            if (evalModal) evalModal.style.display = 'flex';
        }
    }

    // دوال الربط والمزامنة الصفية مع محرك ClassroomSync
    function getActiveClassStudents() {
        return state.studentsMap[state.activeClassId] || [];
    }

    function getClasses() {
        return state.classes || [];
    }

    function ingestStudentProgress(studentData) {
        if (!studentData || !studentData.name) return;
        const currentList = state.studentsMap[state.activeClassId] || [];

        // البحث عن التلميذ بالمعرّف أو بالاسم الدقيق
        let existing = currentList.find(s => s.id === studentData.id || s.name === studentData.name);

        if (existing) {
            existing.stars = Math.max(existing.stars || 0, studentData.stars || 0);
            existing.streak = Math.max(existing.streak || 0, studentData.streak || 0);
            existing.completedLessons = Math.max(existing.completedLessons || 0, studentData.completedLessons || 0);

            // تحديث المهارات الفونيمية بنسب إتقان واقعية
            const acc = studentData.accuracy || 100;
            existing.skills.listening = existing.stars > 100 ? 'ممتاز' : (existing.stars > 50 ? 'جيد جداً' : 'جيد');
            existing.skills.reading = existing.completedLessons > 25 ? 'ممتاز' : (existing.completedLessons > 12 ? 'جيد جداً' : 'جيد');
            existing.skills.writing = 'ممتاز';
            existing.skills.spelling = acc >= 90 ? 'ممتاز' : (acc >= 75 ? 'جيد جداً' : 'جيد');
            existing.skills.participation = 'ممتاز';
            existing.skills.attendance = 'ممتاز';
            existing.status = existing.stars > 120 ? 'متفوق' : 'جيد';
        } else {
            const newStudent = {
                id: studentData.id || ('std_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6)),
                name: studentData.name,
                gender: 'boy',
                birthDate: '2018-01-01',
                guardianName: 'ولي أمر التلميذ',
                phone: '',
                stars: studentData.stars || 0,
                streak: studentData.streak || 0,
                completedLessons: studentData.completedLessons || 0,
                skills: {
                    listening: studentData.stars > 100 ? 'ممتاز' : 'جيد جداً',
                    speaking: 'ممتاز',
                    reading: studentData.completedLessons > 20 ? 'ممتاز' : 'جيد جداً',
                    writing: 'جيد جداً',
                    spelling: (studentData.accuracy || 100) >= 85 ? 'ممتاز' : 'جيد',
                    memorization: 'ممتاز',
                    participation: 'ممتاز',
                    attendance: 'ممتاز'
                },
                status: (studentData.stars || 0) > 100 ? 'متفوق' : 'جيد',
                notes: 'تمت المزامنة آلياً عبر واي فاي الصف'
            };
            currentList.push(newStudent);
            state.studentsMap[state.activeClassId] = currentList;
        }

        saveData();
        updateSidebarCard();
    }

    // استيعاب وإيداع نتائج المسابقة التنافسية في سجل درجات ونجوم الصف
    function ingestQuizResults(players, quizTitle) {
        if (!Array.isArray(players) || players.length === 0) return;
        const currentList = getActiveStudents();

        players.forEach(p => {
            if (!p || !p.name) return;
            const existing = currentList.find(s => s.id === p.id || s.name.trim() === p.name.trim());
            const earnedStars = Math.max(10, Math.round((p.total_score || 1000) / 100));

            if (existing) {
                existing.stars = (existing.stars || 0) + earnedStars;
                if (!existing.notes) existing.notes = '';
                existing.notes += ` [مسابقة: ${quizTitle || 'قراءتي'} (+${earnedStars}⭐)]`;
            } else {
                const newStd = {
                    id: p.id || ('std_' + Math.random().toString(36).substring(2, 8)),
                    name: p.name,
                    gender: 'boy',
                    stars: earnedStars,
                    completedLessons: 15,
                    status: 'متفوق',
                    skills: {
                        listening: 'ممتاز',
                        speaking: 'ممتاز',
                        reading: 'ممتاز',
                        writing: 'جيد جداً',
                        spelling: 'ممتاز',
                        memorization: 'ممتاز',
                        participation: 'ممتاز',
                        attendance: 'ممتاز'
                    },
                    notes: `أبطال مسابقة: ${quizTitle || 'قراءتي'}`
                };
                currentList.push(newStd);
            }
        });

        saveData();
        updateSidebarCard();
        renderOverviewTab();
    }

    // التهيئة عند تحميل المستند
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // الواجهة العامة
    window.TeacherDashboard = {
        openModal,
        closeModal,
        switchTab,
        onClassSelectChange,
        promptAddClass,
        openAddStudentModal,
        closeStudentFormModal,
        saveStudentForm,
        editStudent,
        deleteStudent,
        generateSampleStudentsPrompt,
        awardClassStarsPrompt,
        filterRosterTable,
        onAttendanceDateChange,
        stepAttendanceDate,
        setAllAttendanceStatus,
        toggleStudentAttendance,
        selectReportType,
        printCurrentReport,
        toggleReportOrientation,
        onReportStudentChange,
        printIndividualReportForStudent,
        printCertificateForStudent,
        saveTeacherSettings,
        renameClassPrompt,
        deleteClassPrompt,
        exportRosterToCSV,
        exportBackupJSON,
        importBackupJSON,
        resetClassDataPrompt,
        openStudentInEvaluationModal,
        updateSidebarCard,
        getActiveClassStudents,
        getClasses,
        ingestStudentProgress,
        ingestQuizResults,
        generateTeacherAiAnalytics
    };

    async function generateTeacherAiAnalytics() {
        const container = document.getElementById('teacherAiAnalyticsContainer');
        if (!container) return;

        container.style.display = 'block';
        container.innerHTML = `
            <div style="background: white; border: 2px solid #818cf8; border-radius: 16px; padding: 24px; text-align: center; color: #4338ca; font-weight: 800; font-size: 1rem; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.12); animation: fadeInModal 0.2s ease;">
                <div style="font-size: 2rem; margin-bottom: 8px;">✨ 🧑‍🏫</div>
                <div>جارٍ معالجة وتحليل بيانات الشعبة بالذكاء الاصطناعي...</div>
                <div style="font-size: 0.8rem; color: #64748b; margin-top: 4px;">تصنيف المجموعات وتوليد الخطط الفردية ورسائل أولياء الأمور</div>
            </div>
        `;

        const students = getActiveStudents();
        const activeClassObj = state.classes.find(c => c.id === state.activeClassId) || { name: 'الأول أ' };

        if (window.AIBridge) {
            try {
                const res = await window.AIBridge.analyzeTeacherData({
                    classId: state.activeClassId,
                    className: activeClassObj.name,
                    studentsData: students
                });

                if (res && res.success) {
                    renderTeacherAiAnalyticsResults(res, activeClassObj.name);
                    return;
                }
            } catch (e) {
                console.warn('Teacher AI Analytics error:', e);
            }
        }

        container.innerHTML = `
            <div style="background: #fef2f2; border: 1.5px solid #fecdd3; border-radius: 12px; padding: 16px; color: #991b1b; text-align: center;">
                تعذر الاتصال بخادم الذكاء الاصطناعي، يرجى تشغيل الخادم في ai_server/.
            </div>
        `;
    }

    function renderTeacherAiAnalyticsResults(data, className) {
        const container = document.getElementById('teacherAiAnalyticsContainer');
        if (!container) return;

        const adv = data.groups?.advanced || { title: 'مجموعة التفوق والإثراء', count: 0, recommendation: 'أنشطة إثرائية' };
        const mas = data.groups?.mastery || { title: 'مجموعة الإتقان المرحلي', count: 0, recommendation: 'تمارين مستمرة' };
        const rem = data.groups?.remedial || { title: 'مجموعة الدعم العلاجي', count: 0, recommendation: 'تدريب صوتي مركز' };

        const indPlan = (data.individualPlans && data.individualPlans[0]) || {
            studentName: 'تلميذ بحاجة لدعم',
            strugglingSkill: 'التمييز بين الحروف والمدود',
            dailyActivities: ['نشاط الاستماع', 'نشاط التتبع', 'نشاط القراءة']
        };

        const whatsappText = data.parentWhatsAppTemplate || 'السلام عليكم ولي أمر التلميذ العزيز، نحيطكم علماً بتقدم طفلكم في مادة قراءتي..';

        container.style.display = 'block';
        container.innerHTML = `
            <div style="background: #ffffff; border: 2px solid #818cf8; border-radius: 18px; padding: 20px; box-shadow: 0 10px 25px rgba(99, 102, 241, 0.1); margin-bottom: 20px;">
                <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; margin-bottom: 16px; flex-wrap: wrap; gap: 8px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 1.8rem;">✨</span>
                        <div>
                            <h4 style="margin: 0; font-size: 1.15rem; font-weight: 900; color: #1e1b4b;">تقرير التحليل التربوي الذكي للشعبة (${escapeHtml(className)})</h4>
                            <div style="font-size: 0.78rem; color: #64748b;">توليد آلي مدعوم بنموذج الذكاء الاصطناعي وفق معايير وزارة التربية</div>
                        </div>
                    </div>
                    <button class="btn" onclick="document.getElementById('teacherAiAnalyticsContainer').style.display='none'" style="padding: 4px 10px; font-size: 0.8rem; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; color: #64748b; cursor: pointer;">✕ إخفاء التقرير</button>
                </div>

                <!-- 1. الملخص التنفيذي -->
                <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 12px 16px; margin-bottom: 16px;">
                    <div style="font-size: 0.85rem; font-weight: 900; color: #1e40af; margin-bottom: 4px;">📋 الملخص التنفيذي لمستوى الشعبة:</div>
                    <p style="margin: 0; font-size: 0.88rem; color: #334155; line-height: 1.6;">${escapeHtml(data.executiveSummary || '')}</p>
                </div>

                <!-- 2. المجموعات المتجانسة الثلاث -->
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 16px;">
                    <div style="background: #ecfdf5; border: 1.5px solid #a7f3d0; border-radius: 12px; padding: 12px;">
                        <div style="font-size: 0.86rem; font-weight: 900; color: #065f46; margin-bottom: 4px;">🌟 ${escapeHtml(adv.title)} (${adv.count})</div>
                        <p style="margin: 0; font-size: 0.78rem; color: #047857; line-height: 1.5;">${escapeHtml(adv.recommendation)}</p>
                    </div>
                    <div style="background: #eff6ff; border: 1.5px solid #bfdbfe; border-radius: 12px; padding: 12px;">
                        <div style="font-size: 0.86rem; font-weight: 900; color: #1e40af; margin-bottom: 4px;">👍 ${escapeHtml(mas.title)} (${mas.count})</div>
                        <p style="margin: 0; font-size: 0.78rem; color: #1d4ed8; line-height: 1.5;">${escapeHtml(mas.recommendation)}</p>
                    </div>
                    <div style="background: #fff1f2; border: 1.5px solid #fecdd3; border-radius: 12px; padding: 12px;">
                        <div style="font-size: 0.86rem; font-weight: 900; color: #9f1239; margin-bottom: 4px;">🎯 ${escapeHtml(rem.title)} (${rem.count})</div>
                        <p style="margin: 0; font-size: 0.78rem; color: #be123c; line-height: 1.5;">${escapeHtml(rem.recommendation)}</p>
                    </div>
                </div>

                <!-- 3. الخطة العلاجية الفردية المركزة -->
                <div style="background: #faf5ff; border: 1.5px solid #e9d5ff; border-radius: 12px; padding: 14px; margin-bottom: 16px;">
                    <div style="font-size: 0.88rem; font-weight: 900; color: #6b21a8; margin-bottom: 8px;">
                        🩺 نموذج خطة علاجية فردية مركزة: <u>${escapeHtml(indPlan.studentName)}</u> (المهارة المتعثرة: ${escapeHtml(indPlan.strugglingSkill)})
                    </div>
                    <ul style="margin: 0; padding-right: 20px; font-size: 0.84rem; color: #4c1d95; line-height: 1.6;">
                        ${indPlan.dailyActivities.map(act => `<li>${escapeHtml(act)}</li>`).join('')}
                    </ul>
                </div>

                <!-- 4. رسالة واتساب المجهزة لأولياء الأمور -->
                <div style="background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 12px; padding: 14px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
                    <div style="flex: 1; min-width: 260px;">
                        <div style="font-size: 0.85rem; font-weight: 900; color: #166534; margin-bottom: 4px;">💬 رسالة جاهزة للنسخ والمشاركة مع ولي الأمر عبر واتساب:</div>
                        <div style="font-size: 0.8rem; color: #14532d; white-space: pre-wrap; max-height: 80px; overflow-y: auto; background: white; padding: 8px 12px; border-radius: 8px; border: 1px solid #bbf7d0;" id="aiTeacherWhatsAppText">${escapeHtml(whatsappText)}</div>
                    </div>
                    <button class="btn btn-teach" onclick="copyTeacherWhatsAppMessage()" style="padding: 9px 16px; font-size: 0.85rem; background: #16a34a; border-color: #15803d; color: white; display: inline-flex; align-items: center; gap: 6px;" id="btnCopyTeacherWhatsApp">
                        <span>📋</span> <span>نسخ الرسالة لواتساب</span>
                    </button>
                </div>
            </div>
        `;
    }

    function copyTeacherWhatsAppMessage() {
        const textEl = document.getElementById('aiTeacherWhatsAppText');
        const btn = document.getElementById('btnCopyTeacherWhatsApp');
        if (!textEl) return;
        const text = textEl.innerText;
        navigator.clipboard.writeText(text).then(() => {
            if (btn) {
                btn.innerHTML = '<span>✔</span> <span>تم نسخ الرسالة بنجاح!</span>';
                btn.style.background = '#059669';
                setTimeout(() => {
                    btn.innerHTML = '<span>📋</span> <span>نسخ الرسالة لواتساب</span>';
                    btn.style.background = '#16a34a';
                }, 2500);
            }
        }).catch(err => {
            alert('تعذر النسخ التلقائي: يرجى تحديد النص ونسخه يدوياً.');
        });
    }

    window.generateTeacherAiAnalytics = generateTeacherAiAnalytics;
    window.copyTeacherWhatsAppMessage = copyTeacherWhatsAppMessage;

    // دوال مساعدة عامة على النافذة
    window.openTeacherDashboardModal = openModal;
    window.closeTeacherDashboardModal = closeModal;

})();
