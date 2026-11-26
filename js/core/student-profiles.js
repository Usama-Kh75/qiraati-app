/* ==========================================================================
 * منصة قراءتي التفاعلية الذكية - ملفات التلاميذ وخريطة الإتقان والسبورة الصفية وزاوية ولي الأمر
 * إعداد وتطوير: المهندس أسامة خليل هاشم
 * الإصدار: v3.57
 * ========================================================================== */

(function(window) {
    'use strict';

    const ARABIC_LETTERS = [
        'أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر',
        'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف',
        'ق', 'ك', 'ل', 'م', 'ن', 'هـ', 'و', 'ي'
    ];

    const STORAGE_KEY_PROFILES = 'qiraati-smart-profiles';
    const STORAGE_KEY_ACTIVE = 'qiraati-smart-active-profile';

    function safeGetItem(key, defaultVal) {
        try {
            const v = localStorage.getItem(key);
            return v ? JSON.parse(v) : defaultVal;
        } catch (e) {
            return defaultVal;
        }
    }

    function safeSetItem(key, val) {
        try {
            localStorage.setItem(key, JSON.stringify(val));
        } catch (e) {}
    }

    // ==========================================================================
    // 1. مدير ملفات التلاميذ وخريطة إتقان الحروف (Student Profiles & Mastery)
    // ==========================================================================
    const StudentProfiles = {
        profiles: [],
        activeId: null,

        init() {
            this.profiles = safeGetItem(STORAGE_KEY_PROFILES, []);
            if (!this.profiles || this.profiles.length === 0) {
                const defaultProfile = {
                    id: 'std_' + Date.now(),
                    name: 'تلميذ مبدع',
                    section: 'أ',
                    avatar: '👦',
                    createdAt: Date.now(),
                    totalLearningMinutes: 0,
                    completedLessons: [],
                    letterStats: {}
                };
                this.profiles = [defaultProfile];
                safeSetItem(STORAGE_KEY_PROFILES, this.profiles);
            }

            this.activeId = safeGetItem(STORAGE_KEY_ACTIVE, this.profiles[0].id);
            if (!this.getProfile(this.activeId)) {
                this.activeId = this.profiles[0].id;
            }
            safeSetItem(STORAGE_KEY_ACTIVE, this.activeId);
            this.updateTopBadge();
            this.setupActivityHooks();
        },

        getProfile(id) {
            return this.profiles.find(p => p.id === id) || null;
        },

        getActiveProfile() {
            let active = this.getProfile(this.activeId);
            if (!active && this.profiles.length > 0) {
                active = this.profiles[0];
                this.activeId = active.id;
            }
            return active;
        },

        save() {
            safeSetItem(STORAGE_KEY_PROFILES, this.profiles);
            safeSetItem(STORAGE_KEY_ACTIVE, this.activeId);
            this.updateTopBadge();
        },

        createProfile(name, section, avatar) {
            name = (name || '').trim();
            if (!name) return null;
            const newP = {
                id: 'std_' + Date.now(),
                name: name,
                section: section || 'أ',
                avatar: avatar || '👦',
                createdAt: Date.now(),
                totalLearningMinutes: 0,
                completedLessons: [],
                letterStats: {}
            };
            this.profiles.push(newP);
            this.activeId = newP.id;
            this.save();
            this.renderProfilesList();
            this.renderMasteryMap();
            if (window.StudentProgress && typeof window.StudentProgress.onProfileChanged === 'function') {
                window.StudentProgress.onProfileChanged();
            }
            return newP;
        },

        switchProfile(id) {
            if (this.getProfile(id)) {
                this.activeId = id;
                this.save();
                this.renderProfilesList();
                this.renderMasteryMap();
                if (window.StudentProgress && typeof window.StudentProgress.onProfileChanged === 'function') {
                    window.StudentProgress.onProfileChanged();
                }
                const active = this.getActiveProfile();
                if (window.mascotSpeak) {
                    mascotSpeak(`أهلاً بك يا ${active.name}! مستعد لرحلة التعلم اليوم؟`, 'faseeh_encourage_super');
                }
            }
        },

        deleteProfile(id) {
            if (this.profiles.length <= 1) {
                alert('يجب الإبقاء على ملف تلميذ واحد على الأقل في الجهاز!');
                return;
            }
            if (!confirm('هل أنت متأكد من حذف هذا التلميذ وسجل إتقانه؟')) return;
            this.profiles = this.profiles.filter(p => p.id !== id);
            if (this.activeId === id) {
                this.activeId = this.profiles[0].id;
            }
            this.save();
            this.renderProfilesList();
            this.renderMasteryMap();
        },

        recordLetterAttempt(letter, isCorrect) {
            if (!letter) return;
            const active = this.getActiveProfile();
            if (!active) return;
            if (!active.letterStats) active.letterStats = {};
            if (!active.letterStats[letter]) {
                active.letterStats[letter] = { correct: 0, attempts: 0 };
            }
            active.letterStats[letter].attempts += 1;
            if (isCorrect) {
                active.letterStats[letter].correct += 1;
            }
            this.save();
        },

        getLetterMastery(letter) {
            const active = this.getActiveProfile();
            if (!active || !active.letterStats || !active.letterStats[letter]) {
                return { status: 'new', score: 0, attempts: 0, label: 'جديد' };
            }
            const stat = active.letterStats[letter];
            if (!stat.attempts || stat.attempts === 0) {
                return { status: 'new', score: 0, attempts: 0, label: 'جديد' };
            }
            const pct = Math.round((stat.correct / stat.attempts) * 100);
            if (stat.attempts >= 2 && pct >= 80) {
                return { status: 'mastered', score: pct, attempts: stat.attempts, label: 'متقن' };
            }
            return { status: 'training', score: pct, attempts: stat.attempts, label: 'قيد التدريب' };
        },

        getWeakestLetters(count) {
            count = count || 3;
            const active = this.getActiveProfile();
            const list = [];
            ARABIC_LETTERS.forEach(l => {
                const mastery = this.getLetterMastery(l);
                list.push({ letter: l, ...mastery });
            });
            // أولاً الحروف قيد التدريب بأقل نسبة دقة
            const inTraining = list.filter(item => item.status === 'training');
            inTraining.sort((a, b) => a.score - b.score || b.attempts - a.attempts);

            const result = inTraining.slice(0, count);
            if (result.length < count) {
                // استكمال الحروف الجديدة
                const news = list.filter(item => item.status === 'new');
                for (const n of news) {
                    if (result.length >= count) break;
                    result.push(n);
                }
            }
            return result;
        },

        updateTopBadge() {
            const active = this.getActiveProfile();
            const avatarEl = document.getElementById('topActiveStudentAvatar');
            const nameEl = document.getElementById('topActiveStudentName');
            if (avatarEl && active) avatarEl.innerText = active.avatar || '👦';
            if (nameEl && active) nameEl.innerText = active.name || 'التلميذ';
        },

        openModal(tab) {
            tab = tab || 'mastery';
            const modal = document.getElementById('studentProfilesModal');
            if (!modal) return;
            this.switchModalTab(tab);
            this.renderMasteryMap();
            this.renderProfilesList();
            this.renderSpacedBanner();
            modal.style.display = 'flex';
        },

        closeModal() {
            const modal = document.getElementById('studentProfilesModal');
            if (modal) modal.style.display = 'none';
        },

        switchModalTab(tab) {
            document.querySelectorAll('#studentProfilesModal .modal-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('#studentProfilesModal .profiles-tab-pane').forEach(p => p.style.display = 'none');
            const btn = document.getElementById('tabStudent_' + tab);
            const pane = document.getElementById('paneStudent_' + tab);
            if (btn) btn.classList.add('active');
            if (pane) pane.style.display = 'block';
        },

        renderMasteryMap() {
            const container = document.getElementById('masteryMapContainer');
            if (!container) return;
            let html = '';
            ARABIC_LETTERS.forEach(l => {
                const m = this.getLetterMastery(l);
                let cls = 'mastery-tile-' + m.status;
                let badge = m.status === 'mastered' ? '✔ ' + m.score + '%' : (m.status === 'training' ? '⏳ ' + m.score + '%' : 'جديد');
                html += `
                    <div class="mastery-letter-tile ${cls}" onclick="StudentProfiles.practiceLetter('${l}')" title="حرف (${l}) - الحالة: ${m.label} (الدقة: ${m.score}%)">
                        <span class="tile-glyph">${l}</span>
                        <span class="tile-score">${badge}</span>
                    </div>
                `;
            });
            container.innerHTML = html;

            // تحديث شريط الإحصاء التراكمي
            const counts = { mastered: 0, training: 0, new: 0 };
            ARABIC_LETTERS.forEach(l => {
                counts[this.getLetterMastery(l).status]++;
            });
            const masteredCountEl = document.getElementById('masteryCountMastered');
            const trainingCountEl = document.getElementById('masteryCountTraining');
            const newCountEl = document.getElementById('masteryCountNew');
            if (masteredCountEl) masteredCountEl.innerText = counts.mastered;
            if (trainingCountEl) trainingCountEl.innerText = counts.training;
            if (newCountEl) newCountEl.innerText = counts.new;
        },

        renderProfilesList() {
            const container = document.getElementById('profilesListContainer');
            if (!container) return;
            const esc = window.qiraatiEscapeHtml || (s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])));
            let html = '';
            this.profiles.forEach(p => {
                const isActive = p.id === this.activeId;
                const safeId = esc(p.id);
                const safeName = esc(p.name);
                const safeSection = esc(p.section || 'أ');
                const safeAvatar = esc(p.avatar || '👦');
                html += `
                    <div class="profile-card-item ${isActive ? 'active-profile' : ''}" onclick="StudentProfiles.switchProfile('${safeId}')">
                        <div class="profile-card-avatar">${safeAvatar}</div>
                        <div class="profile-card-info">
                            <div class="profile-card-name">${safeName} ${isActive ? '🌟 (النشط)' : ''}</div>
                            <div class="profile-card-meta">الصف الأول / شعبة (${safeSection})</div>
                        </div>
                        ${this.profiles.length > 1 ? `<button onclick="event.stopPropagation(); StudentProfiles.deleteProfile('${safeId}')" style="background:none; border:none; color:#ef4444; font-size:1.1rem; cursor:pointer;" title="حذف">🗑️</button>` : ''}
                    </div>
                `;
            });
            container.innerHTML = html;
        },

        renderSpacedBanner() {
            const container = document.getElementById('spacedRepetitionBannerBox');
            if (!container) return;
            const weakest = this.getWeakestLetters(3);
            const weakestChars = weakest.map(w => `(${w.letter})`).join(' ، ');
            container.innerHTML = `
                <div class="spaced-repetition-banner">
                    <div class="spaced-banner-content">
                        <span class="spaced-banner-mascot">🎯</span>
                        <div>
                            <div class="spaced-banner-title">المراجعة الذكية المتباعدة مع «فَصِيح»</div>
                            <div class="spaced-banner-desc">الحروف التي تحتاج تدريبًا إضافيًا لرفع إتقانك اليوم: <b>${weakestChars}</b></div>
                        </div>
                    </div>
                    <button class="btn-spaced-review" onclick="StudentProfiles.startSpacedRepetitionReview()">
                        <span>⚡</span>
                        <span>مراجعة سريعة لدقيقتين</span>
                    </button>
                </div>
            `;
        },

        startSpacedRepetitionReview() {
            this.closeModal();
            const weakest = this.getWeakestLetters(3);
            const chars = weakest.map(w => w.letter).join(' و ');
            if (window.mascotSpeak) {
                mascotSpeak(`رائع يا بطل! سنراجع معاً الحروف: ${chars} في دقيقتين لنتقنها 100%! استمع وكرر معي! 🌟`, 'faseeh_encourage_super');
            }
            if (window.VoiceCoach && typeof VoiceCoach.openModal === 'function') {
                setTimeout(() => {
                    VoiceCoach.openModal('studio');
                }, 1200);
            }
        },

        practiceLetter(letter) {
            if (window.mascotSpeak) {
                mascotSpeak(`هيا بنا نتدرب على صوت حرف (${letter}) النقي! استمع وردد معي يا بطل!`, 'faseeh_model_ana_wahdi');
            }
        },

        setupActivityHooks() {
            // ربط تلقائي بنتائج الأنشطة لتسجيل الإتقان
            window.addEventListener('qiraati-letter-attempt', (ev) => {
                if (ev && ev.detail) {
                    this.recordLetterAttempt(ev.detail.letter, ev.detail.isCorrect);
                }
            });
        }
    };

    // ==========================================================================
    // 2. زاوية ولي الأمر المحمية بقفل بسيط (Parent Corner Modal)
    // ==========================================================================
    const ParentCorner = {
        currentAnswer: null,

        generateQuestion() {
            const a = Math.floor(Math.random() * 7) + 3; // 3..9
            const b = Math.floor(Math.random() * 8) + 2; // 2..9
            this.currentAnswer = a + b;
            const qEl = document.getElementById('parentLockQuestion');
            const inpEl = document.getElementById('parentLockInput');
            const errEl = document.getElementById('parentLockError');
            if (qEl) qEl.innerText = `${a} + ${b} = ؟`;
            if (inpEl) {
                inpEl.value = '';
                inpEl.focus();
            }
            if (errEl) errEl.style.display = 'none';
        },

        openModal() {
            const modal = document.getElementById('parentCornerModal');
            if (!modal) return;
            const lockBox = document.getElementById('parentCornerLockPane');
            const contentBox = document.getElementById('parentCornerContentPane');
            if (lockBox) lockBox.style.display = 'block';
            if (contentBox) contentBox.style.display = 'none';
            this.generateQuestion();
            modal.style.display = 'flex';
        },

        closeModal() {
            const modal = document.getElementById('parentCornerModal');
            if (modal) modal.style.display = 'none';
        },

        verifyLock() {
            const inpEl = document.getElementById('parentLockInput');
            const errEl = document.getElementById('parentLockError');
            const userVal = parseInt(inpEl ? inpEl.value.trim() : '', 10);
            if (userVal === this.currentAnswer) {
                const lockBox = document.getElementById('parentCornerLockPane');
                const contentBox = document.getElementById('parentCornerContentPane');
                if (lockBox) lockBox.style.display = 'none';
                if (contentBox) contentBox.style.display = 'block';
                this.renderReport();
            } else {
                if (errEl) {
                    errEl.innerText = 'الإجابة غير صحيحة، حاول مجدداً لحماية تقرير ولي الأمر.';
                    errEl.style.display = 'block';
                }
                this.generateQuestion();
            }
        },

        renderReport() {
            const active = StudentProfiles.getActiveProfile() || { name: 'التلميذ', section: 'أ', totalLearningMinutes: 30 };
            const nameEl = document.getElementById('parentReportStudentName');
            const timeEl = document.getElementById('parentReportTime');
            const completedEl = document.getElementById('parentReportCompleted');
            const masteredEl = document.getElementById('parentReportMastered');
            const weakestBox = document.getElementById('parentReportWeakestBox');

            const progressStats = (window.StudentProgress && typeof window.StudentProgress.getSummaryStats === 'function')
                ? window.StudentProgress.getSummaryStats()
                : { completed: (active.completedLessons || []).length, learningMinutes: active.totalLearningMinutes || 0 };

            if (nameEl) nameEl.innerText = `${active.name} (الصف الأول / شعبة ${active.section || 'أ'})`;
            if (timeEl) timeEl.innerText = `${progressStats.learningMinutes || 0} دقيقة`;
            if (completedEl) completedEl.innerText = `${progressStats.completed || 0} درساً`;

            let masteredCount = 0;
            ARABIC_LETTERS.forEach(l => {
                if (StudentProfiles.getLetterMastery(l).status === 'mastered') masteredCount++;
            });
            if (masteredEl) masteredEl.innerText = `${masteredCount} من 28`;

            if (weakestBox) {
                const weakest = StudentProfiles.getWeakestLetters(3);
                weakestBox.innerHTML = weakest.map(w => 
                    `<span style="background:#fef3c7; color:#b45309; padding:4px 10px; border-radius:8px; font-weight:800; font-size:1.1rem; border:1px solid #fde68a;">حرف (${w.letter})</span>`
                ).join(' ');
            }
        },

        printReport() {
            window.print();
        }
    };

    // ==========================================================================
    // 3. وضع العرض الصفي للسبورة الذكية ومؤشر الليزر (Classroom Presentation Mode)
    // ==========================================================================
    const ClassroomPresentation = {
        isActive: false,
        laserActive: true,
        laserPoints: [],
        animId: null,

        init() {
            window.addEventListener('keydown', (e) => {
                if (e.key === 'F9') {
                    e.preventDefault();
                    this.toggle();
                } else if (e.key === 'Escape' && this.isActive) {
                    e.preventDefault();
                    this.exit();
                }
            });

            const canvas = document.getElementById('presentationLaserCanvas');
            if (canvas) {
                window.addEventListener('resize', () => this.resizeCanvas());
                this.resizeCanvas();
                this.setupLaserTracking();
            }
        },

        resizeCanvas() {
            const canvas = document.getElementById('presentationLaserCanvas');
            if (canvas) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
        },

        setupLaserTracking() {
            const onPointerMove = (e) => {
                if (!this.isActive || !this.laserActive) return;
                const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : null);
                const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : null);
                if (clientX !== null && clientY !== null) {
                    this.laserPoints.push({
                        x: clientX,
                        y: clientY,
                        birth: Date.now()
                    });
                }
            };
            window.addEventListener('mousemove', onPointerMove, { passive: true });
            window.addEventListener('touchmove', onPointerMove, { passive: true });
        },

        toggle() {
            if (this.isActive) this.exit();
            else this.enter();
        },

        enter() {
            this.isActive = true;
            document.body.classList.add('classroom-presentation-active');
            const bar = document.getElementById('presentationControlBar');
            if (bar) bar.style.display = 'flex';
            this.resizeCanvas();
            this.startLaserLoop();
        },

        exit() {
            this.isActive = false;
            document.body.classList.remove('classroom-presentation-active');
            const bar = document.getElementById('presentationControlBar');
            if (bar) bar.style.display = 'none';
            if (this.animId) {
                cancelAnimationFrame(this.animId);
                this.animId = null;
            }
            const canvas = document.getElementById('presentationLaserCanvas');
            if (canvas) {
                const ctx = canvas.getContext('2d');
                if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        },

        toggleLaser() {
            this.laserActive = !this.laserActive;
            const btn = document.getElementById('presLaserToggleBtn');
            if (btn) {
                if (this.laserActive) {
                    btn.classList.add('active-laser');
                    btn.innerHTML = '<span>🔴</span> <span>مؤشر الليزر: مفعل</span>';
                } else {
                    btn.classList.remove('active-laser');
                    btn.innerHTML = '<span>⚪</span> <span>مؤشر الليزر: معطل</span>';
                }
            }
        },

        startLaserLoop() {
            const canvas = document.getElementById('presentationLaserCanvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const render = () => {
                if (!this.isActive) return;
                const now = Date.now();
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                if (this.laserActive && this.laserPoints.length > 0) {
                    // الاحتفاظ بالنقاط لمدة 1000ms
                    this.laserPoints = this.laserPoints.filter(p => now - p.birth < 1000);

                    // رسم الذيل المتلاشي
                    for (let i = 0; i < this.laserPoints.length; i++) {
                        const p = this.laserPoints[i];
                        const age = now - p.birth;
                        const opacity = Math.max(0, 1 - age / 1000);
                        const radius = Math.max(2, 6 * opacity);

                        ctx.beginPath();
                        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(239, 68, 68, ${opacity * 0.7})`;
                        ctx.shadowColor = '#ef4444';
                        ctx.shadowBlur = 10 * opacity;
                        ctx.fill();
                    }

                    // النقطة الأخيرة الساطعة
                    if (this.laserPoints.length > 0) {
                        const last = this.laserPoints[this.laserPoints.length - 1];
                        ctx.beginPath();
                        ctx.arc(last.x, last.y, 8, 0, Math.PI * 2);
                        ctx.fillStyle = '#ffffff';
                        ctx.shadowColor = '#ef4444';
                        ctx.shadowBlur = 18;
                        ctx.fill();

                        ctx.beginPath();
                        ctx.arc(last.x, last.y, 5, 0, Math.PI * 2);
                        ctx.fillStyle = '#dc2626';
                        ctx.fill();
                    }
                }

                this.animId = requestAnimationFrame(render);
            };

            if (this.animId) cancelAnimationFrame(this.animId);
            this.animId = requestAnimationFrame(render);
        },

        pronounceLesson() {
            if (typeof window.pronounceCurrentLessonPresentation === 'function') {
                window.pronounceCurrentLessonPresentation();
            } else if (typeof flatLessonsList !== 'undefined' && flatLessonsList[currentLessonIndex]) {
                const lesson = flatLessonsList[currentLessonIndex];
                if (window.mascotSpeak) {
                    mascotSpeak(`الآن مع درس: ${lesson.title}`, lesson.introAudio || '');
                }
            }
        }
    };

    // دوال الربط العامة
    window.StudentProfiles = StudentProfiles;
    window.ParentCorner = ParentCorner;
    window.ClassroomPresentation = ClassroomPresentation;

    window.openParentCornerModal = function() {
        ParentCorner.openModal();
    };

    window.closeParentCornerModal = function() {
        ParentCorner.closeModal();
    };

    window.verifyParentLock = function() {
        ParentCorner.verifyLock();
    };

    window.toggleClassroomPresentation = function() {
        ClassroomPresentation.toggle();
    };

    window.exitClassroomPresentation = function() {
        ClassroomPresentation.exit();
    };

    window.pronounceCurrentLessonPresentation = function() {
        if (typeof flatLessonsList !== 'undefined' && flatLessonsList[currentLessonIndex]) {
            const lesson = flatLessonsList[currentLessonIndex];
            const readyAudioBtn = document.querySelector(`.lesson-view[id="view-${lesson.id}"] .btn-teach, .lesson-view[id="view-${lesson.id}"] button[onclick*="play"]`);
            if (readyAudioBtn) {
                readyAudioBtn.click();
            } else if (window.mascotSpeak) {
                mascotSpeak(`الآن مع درس: ${lesson.title}`, lesson.introAudio || '');
            }
        }
    };

    // التهيئة التلقائية عند تحميل المستند
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            StudentProfiles.init();
            ClassroomPresentation.init();
        });
    } else {
        StudentProfiles.init();
        ClassroomPresentation.init();
    }

})(window);
