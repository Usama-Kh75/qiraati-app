/* ==========================================================================
 * منصة قراءتي التفاعلية الذكية - نظام تقييم التلاميذ وشهادة التخرج وسجل الإنجاز
 * متوافق 100% مع سجل التقييم الأسبوعي الرسمي لوزارة التربية (2026 / 2027)
 * إعداد وتطوير: المهندس أسامة خليل هاشم
 * ========================================================================== */

(function() {
    'use strict';

    // 1. الثوابت الوزارية والبيانات الأساسية
    const EVAL_MONTHS = [
        { id: 'oct', name: 'تشرين الأول', index: 1 },
        { id: 'nov', name: 'تشرين الثاني', index: 2 },
        { id: 'dec', name: 'كانون الأول', index: 3 },
        { id: 'jan', name: 'كانون الثاني', index: 4 },
        { id: 'feb', name: 'شباط', index: 5 },
        { id: 'mar', name: 'آذار', index: 6 },
        { id: 'apr', name: 'نيسان', index: 7 },
        { id: 'may', name: 'أيار', index: 8 }
    ];

    const EVAL_WEEKS = [
        { id: 'w1', name: 'الأسبوع الأول' },
        { id: 'w2', name: 'الأسبوع الثاني' },
        { id: 'w3', name: 'الأسبوع الثالث' },
        { id: 'w4', name: 'الأسبوع الرابع' }
    ];

    const EVAL_SKILLS = [
        { id: 'listening', name: 'الاستماع', icon: '👂', desc: 'الإصغاء الواعي وتمييز الأصوات الفونيمية المتقاربة' },
        { id: 'speaking', name: 'المحادثة', icon: '🗣️', desc: 'التعبير الشفهي الواضح والتحدث عن الصور بجرأة وطلاقة' },
        { id: 'reading', name: 'القراءة', icon: '📖', desc: 'قراءة الحروف والمدود والمقاطع والكلمات والجمل بانسيابية' },
        { id: 'writing', name: 'الكتابة', icon: '✍️', desc: 'رسم الحروف باتجاهاتها الصحيحة وجمال الخط على السطر' },
        { id: 'spelling', name: 'الإملاء', icon: '📝', desc: 'الإملاء المنظور والاختباري والتمييز بين الحركات وحروف المد' },
        { id: 'memorization', name: 'المحفوظات', icon: '🎶', desc: 'حفظ وترديد النشيد المنهجي المقرر وسورة الفاتحة المباركة' },
        { id: 'participation', name: 'المشاركة الصفية والتفاعل', icon: '🙋‍♂️', desc: 'المبادرة بالإجابة والتفاعل الإيجابي مع المعلم والزملاء' },
        { id: 'attendance', name: 'المواظبة على الدوام', icon: '⏰', desc: 'الحضور اليومي المنتظم وعدم الغياب أو التأخر المدرسي' }
    ];

    const EVAL_GRADES = [
        { label: 'ممتاز', icon: '🌟', score: 6 },
        { label: 'جيد جداً', icon: '✨', score: 5 },
        { label: 'جيد', icon: '👍', score: 4 },
        { label: 'وسط', icon: '⚖️', score: 3 },
        { label: 'مقبول', icon: '⚠️', score: 2 },
        { label: 'ضعيف', icon: '🎯', score: 1 }
    ];

    // مفاتيح التخزين المعتمدة (تلتزم بالبادئة qiraati-smart-)
    const STORAGE_KEY_PROFILE = 'qiraati-smart-eval-profile';
    const STORAGE_KEY_RECORDS = 'qiraati-smart-eval-records';
    const STORAGE_KEY_PROGRESS = 'qiraati-smart-progress-lessons';
    const STORAGE_KEY_CERT = 'qiraati-smart-cert-custom';

    // الحالة الحالية
    let currentActiveMonth = 'oct';
    let currentActiveWeek = 'w1';
    let activeEvalTab = 'eval';

    // تهيئة البيانات الافتراضية
    let studentProfile = {
        name: 'بطل قراءتي الذكية',
        birthDate: '15 / 04 / 2018',
        socialStatus: 'مستقر وطبيعي',
        behavior: 'متميز ومؤدب',
        school: 'مدرسة النخبة الابتدائية للبنين / للبنات',
        grade: 'الصف الأول الابتدائي - شعبة (أ)',
        teacher: 'معلم الصف الأول الابتدائي',
        avatar: '👦'
    };

    let evaluationRecords = {}; // Format: { "oct_w1": { listening: "ممتاز", note: "..." } }
    let lessonsProgress = {};   // Format: { "tab-lesson1": true, ... }

    // تحميل البيانات المحفوظة
    function loadSavedData() {
        try {
            const savedProfile = localStorage.getItem(STORAGE_KEY_PROFILE);
            if (savedProfile) {
                studentProfile = Object.assign(studentProfile, JSON.parse(savedProfile));
            }
            const savedRecords = localStorage.getItem(STORAGE_KEY_RECORDS);
            if (savedRecords) {
                evaluationRecords = JSON.parse(savedRecords);
            }
            const savedProgress = localStorage.getItem(STORAGE_KEY_PROGRESS);
            if (savedProgress) {
                lessonsProgress = JSON.parse(savedProgress);
            } else {
                // افتراضياً لنسخة الإتمام 100% المكتملة، اجعل كافة الدروس منجزة
                if (window.flatLessonsList && Array.isArray(window.flatLessonsList)) {
                    window.flatLessonsList.forEach(l => { lessonsProgress[l.id] = true; });
                }
            }
        } catch (e) {
            console.warn('Error loading eval data from localStorage:', e);
        }
    }

    function saveProfile() {
        try {
            localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(studentProfile));
        } catch (e) {
            console.warn('Error saving profile:', e);
        }
    }

    function saveRecords() {
        try {
            localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(evaluationRecords));
        } catch (e) {
            console.warn('Error saving eval records:', e);
        }
    }

    function saveProgress() {
        try {
            localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(lessonsProgress));
        } catch (e) {
            console.warn('Error saving progress:', e);
        }
    }

    // =========================================================================
    // 2. التحكم في النافذة والتبويبات
    // =========================================================================
    window.openEvaluationModal = function(initialTab = 'eval') {
        const modal = document.getElementById('evaluationModal');
        if (!modal) return;
        modal.style.display = 'flex';
        loadSavedData();
        syncProfileToUI();
        switchEvalTab(initialTab);
        renderEvaluationTable();
        renderSummaryStats();
        renderPortfolioView();
        updateGrandCertUI();
    };

    window.closeEvaluationModal = function() {
        const modal = document.getElementById('evaluationModal');
        if (modal) modal.style.display = 'none';
    };

    window.switchEvalTab = function(tabId) {
        activeEvalTab = tabId;
        const tabs = ['eval', 'cert', 'progress', 'guide'];
        tabs.forEach(t => {
            const btn = document.getElementById('tabEval_' + t);
            const pane = document.getElementById('paneEval_' + t);
            if (btn) btn.classList.toggle('active', t === tabId);
            if (pane) pane.classList.toggle('active', t === tabId);
        });

        if (tabId === 'eval') {
            renderEvaluationTable();
            renderSummaryStats();
        } else if (tabId === 'cert') {
            updateGrandCertUI();
        } else if (tabId === 'progress') {
            renderPortfolioView();
        }
    };

    // =========================================================================
    // 3. إدارة الملف الشخصي للتلميذ والمزامنة
    // =========================================================================
    function syncProfileToUI() {
        // حقول الإدخال في بار التلميذ
        const nameInp = document.getElementById('evalStudentNameInput');
        const birthInp = document.getElementById('evalStudentBirthInput');
        const socialInp = document.getElementById('evalStudentSocialInput');
        const behaviorInp = document.getElementById('evalStudentBehaviorInput');
        const avatarEl = document.getElementById('evalStudentAvatarEl');

        if (nameInp) nameInp.value = studentProfile.name || '';
        if (birthInp) birthInp.value = studentProfile.birthDate || '';
        if (socialInp) socialInp.value = studentProfile.socialStatus || '';
        if (behaviorInp) behaviorInp.value = studentProfile.behavior || '';
        if (avatarEl) avatarEl.innerText = studentProfile.avatar || '👦';

        // حقول الشهادة
        const certNameInp = document.getElementById('certInputName');
        const certSchoolInp = document.getElementById('certInputSchool');
        const certTeacherInp = document.getElementById('certInputTeacher');
        if (certNameInp) certNameInp.value = studentProfile.name || '';
        if (certSchoolInp) certSchoolInp.value = studentProfile.school || '';
        if (certTeacherInp) certTeacherInp.value = studentProfile.teacher || '';

        // الشهادة المطبوعة
        updateGrandCertUI();
    }

    window.updateStudentField = function(field, value) {
        studentProfile[field] = value.trim();
        saveProfile();
        updateGrandCertUI();
        renderSummaryStats();
    };

    window.chooseStudentAvatar = function() {
        const avatars = ['👦', '👧', '🌟', '👑', '🚀', '🎒', '📚', '🎖️'];
        let curIdx = avatars.indexOf(studentProfile.avatar);
        let nextIdx = (curIdx + 1) % avatars.length;
        studentProfile.avatar = avatars[nextIdx];
        const el = document.getElementById('evalStudentAvatarEl');
        if (el) el.innerText = studentProfile.avatar;
        saveProfile();
    };

    // =========================================================================
    // 4. نظام تقييم المهارات الأسبوعي
    // =========================================================================
    window.selectEvalMonth = function(monthId) {
        currentActiveMonth = monthId;
        document.querySelectorAll('.month-pill-btn').forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-month') === monthId);
        });
        renderEvaluationTable();
        renderSummaryStats();
    };

    window.selectEvalWeek = function(weekId) {
        currentActiveWeek = weekId;
        document.querySelectorAll('.week-btn').forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-week') === weekId);
        });
        renderEvaluationTable();
        renderSummaryStats();
    };

    function getPeriodKey() {
        return `${currentActiveMonth}_${currentActiveWeek}`;
    }

    function renderEvaluationTable() {
        const tbody = document.getElementById('skillsEvalTableBody');
        if (!tbody) return;

        const periodKey = getPeriodKey();
        const periodData = evaluationRecords[periodKey] || {};

        let html = '';
        EVAL_SKILLS.forEach((skill, sIdx) => {
            const currentGrade = periodData[skill.id] || '';
            const statusPillText = currentGrade ? currentGrade : 'لم يُرصد بعد';
            const statusColor = getGradeColor(currentGrade);

            html += `
                <div class="skill-eval-row" id="rowSkill_${skill.id}">
                    <div class="skill-num-badge">${sIdx + 1}</div>
                    <div class="skill-title-box">
                        <div class="skill-name">
                            <span>${skill.icon}</span>
                            <span>${skill.name}</span>
                        </div>
                        <div class="skill-desc">${skill.desc}</div>
                    </div>
                    <div class="grade-options-group">
            `;

            EVAL_GRADES.forEach(g => {
                const isActive = currentGrade === g.label;
                html += `
                    <button type="button" class="grade-btn ${isActive ? 'active' : ''}" 
                            data-grade="${g.label}" 
                            onclick="setSkillGrade('${skill.id}', '${g.label}')"
                            title="رصد تقدير ${g.label}">
                        <span>${g.icon}</span>
                        <span>${g.label}</span>
                    </button>
                `;
            });

            html += `
                    </div>
                    <div>
                        <span class="skill-status-pill" style="color: ${statusColor}; border: 1px solid ${statusColor}44; background: ${statusColor}11;">
                            ${statusPillText}
                        </span>
                    </div>
                </div>
            `;
        });

        tbody.innerHTML = html;

        // تحديث خانة الملاحظة الأسبوعية
        const noteInp = document.getElementById('evalWeekNoteInput');
        if (noteInp) {
            noteInp.value = periodData.note || '';
        }
    }

    window.setSkillGrade = function(skillId, grade) {
        const periodKey = getPeriodKey();
        if (!evaluationRecords[periodKey]) {
            evaluationRecords[periodKey] = {};
        }
        evaluationRecords[periodKey][skillId] = grade;
        saveRecords();
        renderEvaluationTable();
        renderSummaryStats();

        // صوت ناعم للتعزيز
        if (typeof playAudio === 'function') {
            if (grade === 'ممتاز' || grade === 'جيد جداً') {
                playAudio('lam_correct');
            }
        }
    };

    window.quickFillWeek = function(grade) {
        const periodKey = getPeriodKey();
        if (!evaluationRecords[periodKey]) {
            evaluationRecords[periodKey] = {};
        }
        EVAL_SKILLS.forEach(s => {
            evaluationRecords[periodKey][s.id] = grade;
        });
        saveRecords();
        renderEvaluationTable();
        renderSummaryStats();
        if (typeof playAudio === 'function') {
            playAudio('lam_correct');
        }
    };

    window.clearWeekGrades = function() {
        const periodKey = getPeriodKey();
        if (evaluationRecords[periodKey]) {
            delete evaluationRecords[periodKey];
            saveRecords();
            renderEvaluationTable();
            renderSummaryStats();
        }
    };

    window.updateWeekNote = function(note) {
        const periodKey = getPeriodKey();
        if (!evaluationRecords[periodKey]) {
            evaluationRecords[periodKey] = {};
        }
        evaluationRecords[periodKey].note = note.trim();
        saveRecords();
    };

    function getGradeColor(grade) {
        switch (grade) {
            case 'ممتاز': return '#059669';
            case 'جيد جداً': return '#16a34a';
            case 'جيد': return '#2563eb';
            case 'وسط': return '#ca8a04';
            case 'مقبول': return '#ea580c';
            case 'ضعيف': return '#dc2626';
            default: return '#64748b';
        }
    }

    function renderSummaryStats() {
        const periodKey = getPeriodKey();
        const periodData = evaluationRecords[periodKey] || {};

        let totalGraded = 0;
        let excellentCount = 0;
        let vGoodCount = 0;
        let goodCount = 0;

        EVAL_SKILLS.forEach(s => {
            const g = periodData[s.id];
            if (g) {
                totalGraded++;
                if (g === 'ممتاز') excellentCount++;
                if (g === 'جيد جداً') vGoodCount++;
                if (g === 'جيد') goodCount++;
            }
        });

        const sumTotalEl = document.getElementById('evalStatTotalGraded');
        const sumRatingEl = document.getElementById('evalStatOverallRating');
        const sumNotesEl = document.getElementById('evalStatNotesStatus');

        if (sumTotalEl) sumTotalEl.innerText = `${totalGraded} / 8`;
        if (sumRatingEl) {
            if (totalGraded === 0) {
                sumRatingEl.innerText = 'بانتظار الرصد';
                sumRatingEl.style.color = '#64748b';
            } else if (excellentCount >= 6) {
                sumRatingEl.innerText = 'ممتاز جداً 🌟';
                sumRatingEl.style.color = '#059669';
            } else if (excellentCount + vGoodCount >= 5) {
                sumRatingEl.innerText = 'جيد جداً ✨';
                sumRatingEl.style.color = '#16a34a';
            } else {
                sumRatingEl.innerText = 'مستوى متقدم 👍';
                sumRatingEl.style.color = '#2563eb';
            }
        }
        if (sumNotesEl) {
            sumNotesEl.innerText = periodData.note ? 'تم تدوين التوجيهات ✅' : 'لا توجد ملاحظات';
        }
    }

    // =========================================================================
    // 5. شهادة التخرج الكبرى (100% المنهج)
    // =========================================================================
    function updateGrandCertUI() {
        const certName = document.getElementById('certDisplayStudentName');
        const certSchool = document.getElementById('certDisplaySchoolName');
        const certTeacher = document.getElementById('certDisplayTeacherName');
        const certDate = document.getElementById('certDisplayDate');
        const certRating = document.getElementById('certDisplayRating');

        const activeName = studentProfile.name || 'بَطَلُ قِرَاءَتِي الذَّكِيَّة';
        if (certName) certName.innerText = activeName;
        if (certSchool) certSchool.innerText = studentProfile.school || 'مَدْرَسَةُ النُّخْبَةِ الِابْتِدَائِيَّة';
        if (certTeacher) certTeacher.innerText = studentProfile.teacher || 'مُعَلِّمُ الصَّفِّ الأَوَّلِ الاِبْتِدَائِيّ';
        
        // ضبط تاريخ التخرج التلقائي
        const today = new Date();
        const arabicDate = `${today.getDate()} / ${today.getMonth() + 1} / ${today.getFullYear()} م`;
        if (certDate) certDate.innerText = arabicDate;

        const rateInp = document.getElementById('certInputRating');
        if (certRating && rateInp) {
            certRating.innerText = rateInp.value || 'مُمْتَازٌ مَعَ مَرْتَبَةِ الشَّرَفِ الأُولَى 🏆';
        }
    }

    window.updateCertLiveField = function(field, val) {
        if (field === 'name') {
            studentProfile.name = val;
            saveProfile();
            const certName = document.getElementById('certDisplayStudentName');
            if (certName) certName.innerText = val || 'بَطَلُ قِرَاءَتِي الذَّكِيَّة';
            const nameInp = document.getElementById('evalStudentNameInput');
            if (nameInp) nameInp.value = val;
        } else if (field === 'school') {
            studentProfile.school = val;
            saveProfile();
            const el = document.getElementById('certDisplaySchoolName');
            if (el) el.innerText = val;
        } else if (field === 'teacher') {
            studentProfile.teacher = val;
            saveProfile();
            const el = document.getElementById('certDisplayTeacherName');
            if (el) el.innerText = val;
        } else if (field === 'rating') {
            const el = document.getElementById('certDisplayRating');
            if (el) el.innerText = val;
        }
    };

    window.launchCelebration = function() {
        triggerConfettiFireworks();
        if (typeof playAudio === 'function') {
            playAudio('lam_completion_congrats');
        }
        if (typeof mascotCelebrates === 'function') {
            mascotCelebrates();
        }
    };

    window.playCelebrationAudioOnly = function() {
        if (typeof playAudio === 'function') {
            playAudio('lam_completion_congrats');
        }
    };

    // =========================================================================
    // 6. سجل الإنجاز ومسيرة التعلم (Portfolio & Badges)
    // =========================================================================
    function renderPortfolioView() {
        const unitsContainer = document.getElementById('portfolioUnitsGrid');
        if (!unitsContainer || !window.CURRICULUM_DATA) return;

        let totalLessonsCount = 0;
        let completedLessonsCount = 0;

        let html = '';
        window.CURRICULUM_DATA.forEach((unit, uIdx) => {
            const uLessons = unit.lessons || [];
            totalLessonsCount += uLessons.length;

            let uDone = 0;
            uLessons.forEach(l => {
                if (lessonsProgress[l.id]) uDone++;
            });
            completedLessonsCount += uDone;

            const percent = uLessons.length > 0 ? Math.round((uDone / uLessons.length) * 100) : 100;
            const isCompleted = percent === 100;

            html += `
                <div class="unit-journey-card">
                    <div>
                        <div class="unit-journey-header">
                            <div class="unit-journey-icon">${unit.icon || '📖'}</div>
                            <span class="unit-journey-status" style="${isCompleted ? '' : 'background: #fef3c7; color: #92400e;'}">
                                ${isCompleted ? 'مكتملة 100% ✅' : `${percent}% منجز`}
                            </span>
                        </div>
                        <div class="unit-journey-title">${unit.title}</div>
                        <div class="unit-journey-desc">الصفحات: (ص ${unit.pages}) • عدد الدروس: ${uLessons.length} درساً</div>
                    </div>
                    <div>
                        <div style="font-size: 0.78rem; font-weight: 800; color: #64748b; margin-bottom: 4px; display: flex; justify-content: space-between;">
                            <span>الإتقان الصوتي والقرائي</span>
                            <span>${uDone} / ${uLessons.length}</span>
                        </div>
                        <div style="height: 6px; background: #e2e8f0; border-radius: 6px; overflow: hidden;">
                            <div style="width: ${percent}%; height: 100%; background: #10b981; border-radius: 6px;"></div>
                        </div>
                    </div>
                </div>
            `;
        });

        unitsContainer.innerHTML = html;

        // تحديث إحصاءات البورتفوليو
        const percentOverall = totalLessonsCount > 0 ? Math.round((completedLessonsCount / totalLessonsCount) * 100) : 100;
        const barFill = document.getElementById('portfolioProgressFill');
        const percentLabel = document.getElementById('portfolioPercentLabel');
        const doneCountLabel = document.getElementById('portfolioDoneLessonsCount');
        const totalCountLabel = document.getElementById('portfolioTotalLessonsCount');

        if (barFill) barFill.style.width = percentOverall + '%';
        if (percentLabel) percentLabel.innerText = percentOverall + '%';
        if (doneCountLabel) doneCountLabel.innerText = completedLessonsCount;
        if (totalCountLabel) totalCountLabel.innerText = totalLessonsCount;

        // تحديث شارة الشريط الجانبي
        const sidebarPill = document.getElementById('sidebarProgressPill');
        const sidebarFill = document.getElementById('sidebarProgressFill');
        if (sidebarPill) sidebarPill.innerText = percentOverall + '% مكتمل';
        if (sidebarFill) sidebarFill.style.width = percentOverall + '%';
    }

    window.markAllLessonsDone = function() {
        if (window.flatLessonsList && Array.isArray(window.flatLessonsList)) {
            window.flatLessonsList.forEach(l => { lessonsProgress[l.id] = true; });
            saveProgress();
            renderPortfolioView();
            if (typeof playAudio === 'function') {
                playAudio('lam_correct');
            }
        }
    };

    window.showBadgeDetails = function(badgeTitle, badgeDesc) {
        if (typeof mascotSpeak === 'function') {
            mascotSpeak(`وسام التميز: <b>(${badgeTitle})</b>! ${badgeDesc} 🌟`, 'mascot_hint');
        }
        if (typeof playAudio === 'function') {
            playAudio('lam_correct');
        }
    };

    // =========================================================================
    // 7. الطباعة والتصدير
    // =========================================================================
    window.printActiveEvalTab = function() {
        window.print();
    };

    // =========================================================================
    // 8. محرك الاحتفال والألعاب النارية الذاتي الخفيف (Self-contained Canvas Fireworks)
    // =========================================================================
    function triggerConfettiFireworks() {
        let canvas = document.getElementById('evalConfettiCanvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'evalConfettiCanvas';
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100vw';
            canvas.style.height = '100vh';
            canvas.style.pointerEvents = 'none';
            canvas.style.zIndex = '999999';
            document.body.appendChild(canvas);
        }

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const colors = ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#eab308', '#ef4444'];

        for (let i = 0; i < 180; i++) {
            particles.push({
                x: canvas.width / 2 + (Math.random() - 0.5) * 300,
                y: canvas.height * 0.45 + (Math.random() - 0.5) * 200,
                vx: (Math.random() - 0.5) * 16,
                vy: (Math.random() - 0.7) * 18,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: 1,
                decay: Math.random() * 0.015 + 0.008,
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 12
            });
        }

        let animId;
        function render() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let activeCount = 0;

            particles.forEach(p => {
                if (p.alpha > 0) {
                    activeCount++;
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.35; // Gravity
                    p.alpha -= p.decay;
                    p.rotation += p.rotSpeed;

                    ctx.save();
                    ctx.globalAlpha = Math.max(0, p.alpha);
                    ctx.translate(p.x, p.y);
                    ctx.rotate((p.rotation * Math.PI) / 180);
                    ctx.fillStyle = p.color;
                    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
                    ctx.restore();
                }
            });

            if (activeCount > 0) {
                animId = requestAnimationFrame(render);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
            }
        }

        render();
    }

    // تهيئة البيانات عند تحميل المستند
    window.addEventListener('DOMContentLoaded', () => {
        loadSavedData();
        // تحديث شريط التقدم في القائمة الجانبية إذا وجد
        setTimeout(() => {
            renderPortfolioView();
        }, 300);
    });

})();
