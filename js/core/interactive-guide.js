/* ==========================================================================
 * منصة قراءتي التفاعلية الذكية - محرك جولة الاستكشاف ودليل المعلم وولي الأمر
 * (Interactive Guided Tour & Digital Teacher / Parent Platform & Quiz Manual)
 * متوافق مع الشاشات التفاعلية الذكية وأجهزة التابلت والهواتف المحمولة
 * إعداد وتطوير: المهندس أسامة خليل هاشم
 * ========================================================================== */

(function (window, document) {
    'use strict';

    /* ==========================================================================
       1. محرك جولة الاستكشاف التفاعلية (PlatformTour Engine)
       ========================================================================== */
    const PlatformTour = {
        currentStepIndex: 0,
        isActive: false,
        resizeHandler: null,
        scrollHandler: null,
        keyHandler: null,

        // خطوات الجولة الاستكشافية الـ 10 المختارة بعناية فائقة
        steps: [
            {
                target: '.brand-title',
                title: 'مرحباً بكم في منصة قراءتي التفاعلية الذكية',
                icon: '📖',
                text: 'المنصة الرقمية الأولى لتعليم القراءة العربية للصف الأول الابتدائي وفق المنهج الفونيمي الصوتي المعتمد لوزارة التربية، إعداد وتطوير المهندس أسامة خليل هاشم. تعمل المنصة بكامل طاقتها 100% أوفلاين دون إنترنت.',
                tip: '💡 المنصة مصممة للتفاعل المباشر باللمس على الشاشات الذكية وأجهزة التابلت وتدمج الصوت بالحركة.',
                placement: 'bottom'
            },
            {
                target: '.btn-sidebar-toggle',
                title: 'شجرة المنهج والدروس الـ 46',
                icon: '📚',
                text: 'فهرس شامل لكافة دروس ووحدات كتاب قراءتي الجديد الست بالإضافة إلى التهيئة والأنشطة التمهيدية. يمكنك التبديل الفوري ومتابعة حالات الإنجاز الملونة.',
                tip: '💡 اضغط زر الفهرس لإظهار أو طي قائمة الدروس لإفساح مساحة واسعة لمسرح التفاعل.',
                placement: 'bottom'
            },
            {
                target: '.stage-card',
                title: 'مسرح التعلم متعدد الحواس',
                icon: '🎭',
                text: 'المسرح التفاعلي الحي: استمع لصوت الحرف النقي (Synthetic Phonics)، الكلمات المصورة، والتهجئة المقطعية بصحبة صديق الأطفال الكرتوني "فَصِيح" المتزامن حركة ونطقاً.',
                tip: '💡 اضغط على الحروف والكلمات لسماع نطقها الفونيمي الصرف بدقة فائقة وبصوت معلمة فصيحة.',
                placement: 'top'
            },
            {
                target: '#btnTopQuizShow',
                title: 'المسابقات التنافسية الصفية (Live Game Show)',
                icon: '🏆',
                text: 'حوّل غرفة الصف إلى استوديو مسابقات تلفزيوني مباشر! اربط شاشات التابلت مع شاشة العرض الذكية أوفلاين وتنافس في نمط الفردي أو صراع الفرق مع منصة تتويج 3D.',
                tip: '💡 المسابقة لا تحتاج إنترنت إطلاقاً؛ تعمل على شبكة الصف أو نقطة اتصال الهاتف (Hotspot).',
                placement: 'bottom'
            },
            {
                target: '#btnTopClassSync',
                title: 'المزامنة الصفية المحلية وشبكة التابلت',
                icon: '📡',
                text: 'تحكّم في أجهزة تابلت التلاميذ في الصف أوفلاين: وجّه الصف جماعياً نحو الدرس بضغطة زر، فعّل وضع التركيز وقفل الشاشات، واستقبل طلبات رفع اليد فوراً.',
                tip: '💡 يمكنك مسح كود QR للتلميذ بكاميرا المعلم لمزامنة التابلت في ثانية واحدة دون أي راوتر!',
                placement: 'bottom'
            },
            {
                target: '#btnTopTeacherDashboard',
                title: 'لوحة تحكم المعلم الشاملة والتقارير A4',
                icon: '🧑‍🏫',
                text: 'مساعد المعلم الرقمي: إدارة الشعب، رصد الحضور بنقرة، قياس المهارات الفونيمية الثمانية، خطة المعالجة، وطباعة كشوف الدرجات والشهادات الفاخرة وقسيمة ولي الأمر.',
                tip: '💡 يدعم تصدير واستيراد البيانات بصيغة JSON وملفات Excel CSV للتوافق مع الإدارة المدرسية.',
                placement: 'bottom'
            },
            {
                target: '#topStarsWidget',
                title: 'تحدي النجوم ورصيد الأبطال',
                icon: '⭐',
                text: 'نظام التحفيز الرقمي الغامر (Gamification): أسئلة تحدٍ تفاعلية لكل درس، رصيد نجوم متصاعد، خزانة أوسمة شرفية، وشهادة بطل القراءة لتعزيز دافعية الأطفال.',
                tip: '💡 شجّع التلميذ على حصد 5 نجوم في كل درس لفتح الأوسمة الذهبية والشهادة الكبرى.',
                placement: 'bottom'
            },
            {
                target: '#btnTopBlackboard',
                title: 'سبورة تتبع الحروف ومختبر الخط العربي',
                icon: '✍️',
                text: 'تدريب عضلات اليد على رسم الحرف بالقلم أو الإصبع مع خطوط التوجيه المنقطة، مختبر تشريح اتجاه القلم، وسبورة الرسم الحر وأوراق عمل A4 قابلة للطباعة.',
                tip: '💡 ممتازة للأجهزة اللوحية والسبورات الذكية لتدريب تلاميذ الصف الأول على الاتجاه الصحيح للكتابة.',
                placement: 'bottom'
            },
            {
                target: '#btnTopGamesHub',
                title: 'الألعاب اللغوية الـ 7 للشاشات الذكية',
                icon: '🎮',
                text: '7 ألعاب تربوية تفاعلية ممتعة: عجلة الحظ، تحدي الفريقين، صائد الفقاعات، قطار المقاطع، صندوق الذاكرة، ميزان اللام، ومن سيربح وسام القراءة.',
                tip: '💡 مثالية كنشاط ختامي مبهج في نهاية كل حصة لترسيخ المفردات والحروف.',
                placement: 'bottom'
            },
            {
                target: '#btnTopDigitalGuide',
                title: 'دليل المنصة والمسابقات الرقمي',
                icon: '📖',
                text: 'مرجعك التربوي والتقني الشامل: شرح الطريقة الفونيمية، إدارة الحصة واللوحة، تشغيل المسابقات، إرشادات المتابعة المنزلية لولي الأمر، ودعم التشغيل والتثبيت.',
                tip: '💡 يمكنك فتح الدليل في أي وقت أو طباعة أي فصل منه بنسق ورقي A4 فاخر ومفصل.',
                placement: 'bottom'
            }
        ],

        init() {
            // التحقق من خوض الجولة سابقاً
            const completed = localStorage.getItem('qiraati_tour_completed');
            if (!completed) {
                // تشغيل تلقائي هادئ بعد اكتمال تحميل الواجهة بـ 1.8 ثانية
                setTimeout(() => {
                    if (!this.isActive && !document.querySelector('.modal-backdrop[style*="display: flex"]')) {
                        this.startTour(0);
                    }
                }, 1800);
            }
        },

        startTour(startIndex = 0) {
            this.isActive = true;
            this.currentStepIndex = Math.max(0, Math.min(startIndex, this.steps.length - 1));

            const overlay = document.getElementById('platformTourOverlay');
            const highlight = document.getElementById('platformTourTargetHighlight');
            const popover = document.getElementById('platformTourPopover');

            if (!overlay || !highlight || !popover) return;

            overlay.classList.add('tour-active');
            highlight.classList.add('active');
            popover.classList.add('active');

            this.bindEvents();
            this.renderStep(this.currentStepIndex);

            // تشغيل نغمة صوتية ترحيبية خفيفة
            this.playTourChime();
        },

        bindEvents() {
            this.resizeHandler = () => {
                if (this.isActive) this.updatePositions();
            };
            this.scrollHandler = () => {
                if (this.isActive) this.updatePositions();
            };
            this.keyHandler = (e) => {
                if (!this.isActive) return;
                if (e.key === 'ArrowLeft') {
                    // في الواجهة العربية: السهم الأيسر هو التالي
                    this.nextStep();
                } else if (e.key === 'ArrowRight') {
                    this.prevStep();
                } else if (e.key === 'Escape') {
                    this.endTour(false);
                }
            };

            window.addEventListener('resize', this.resizeHandler, { passive: true });
            window.addEventListener('scroll', this.scrollHandler, { passive: true });
            window.addEventListener('keydown', this.keyHandler);
        },

        unbindEvents() {
            if (this.resizeHandler) window.removeEventListener('resize', this.resizeHandler);
            if (this.scrollHandler) window.removeEventListener('scroll', this.scrollHandler);
            if (this.keyHandler) window.removeEventListener('keydown', this.keyHandler);
        },

        renderStep(index) {
            const step = this.steps[index];
            if (!step) return;

            const targetEl = document.querySelector(step.target);

            // تحديث عناصر البوبوفر
            const badgeEl = document.getElementById('tourStepBadge');
            const iconEl = document.getElementById('tourIconBox');
            const titleEl = document.getElementById('tourTitleText');
            const descEl = document.getElementById('tourDescText');
            const tipEl = document.getElementById('tourTipText');
            const fillEl = document.getElementById('tourProgressFill');
            const prevBtn = document.getElementById('tourBtnPrev');
            const nextBtn = document.getElementById('tourBtnNext');

            if (badgeEl) badgeEl.innerText = `الخطوة ${index + 1} من ${this.steps.length}`;
            if (iconEl) iconEl.innerText = step.icon;
            if (titleEl) titleEl.innerText = step.title;
            if (descEl) descEl.innerText = step.text;
            if (tipEl) tipEl.innerText = step.tip;

            const progressPct = ((index + 1) / this.steps.length) * 100;
            if (fillEl) fillEl.style.width = `${progressPct}%`;

            if (prevBtn) {
                prevBtn.disabled = (index === 0);
            }

            if (nextBtn) {
                if (index === this.steps.length - 1) {
                    nextBtn.innerHTML = '<span>🎉</span> <span>إنهاء واستكشاف</span>';
                    nextBtn.className = 'tour-nav-btn tour-btn-finish';
                } else {
                    nextBtn.innerHTML = '<span>التالي</span> <span>⬅️</span>';
                    nextBtn.className = 'tour-nav-btn tour-btn-next';
                }
            }

            // تموضع وتمرير
            if (targetEl && targetEl.offsetParent !== null) {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
                setTimeout(() => this.updatePositions(), 150);
            } else {
                // إذا كان العنصر مخفياً، نضع البوبوفر في منتصف الشاشة
                this.centerPopover();
            }
        },

        updatePositions() {
            if (!this.isActive) return;
            const step = this.steps[this.currentStepIndex];
            if (!step) return;

            const targetEl = document.querySelector(step.target);
            const highlight = document.getElementById('platformTourTargetHighlight');
            const popover = document.getElementById('platformTourPopover');

            if (!targetEl || targetEl.offsetParent === null) {
                this.centerPopover();
                return;
            }

            const rect = targetEl.getBoundingClientRect();
            const pad = 8;

            // تحديد موضع ومقاس صندوق التمييز
            if (highlight) {
                highlight.style.display = 'block';
                highlight.style.top = `${Math.max(0, rect.top - pad)}px`;
                highlight.style.left = `${Math.max(0, rect.left - pad)}px`;
                highlight.style.width = `${rect.width + (pad * 2)}px`;
                highlight.style.height = `${rect.height + (pad * 2)}px`;
            }

            // تحديد موضع بطاقة البوبوفر
            if (popover) {
                const popRect = popover.getBoundingClientRect();
                const popW = popRect.width || 400;
                const popH = popRect.height || 260;
                const viewW = window.innerWidth;
                const viewH = window.innerHeight;

                let top = rect.bottom + 16;
                let left = rect.left + (rect.width / 2) - (popW / 2);

                // فحص الخروج من الحدود
                if (top + popH > viewH - 20) {
                    // إذا خرج من أسفل الشاشة، ضعه أعلى العنصر
                    top = Math.max(16, rect.top - popH - 16);
                }

                if (left < 16) left = 16;
                if (left + popW > viewW - 16) left = viewW - popW - 16;

                popover.style.top = `${top}px`;
                popover.style.left = `${left}px`;
            }
        },

        centerPopover() {
            const highlight = document.getElementById('platformTourTargetHighlight');
            const popover = document.getElementById('platformTourPopover');

            if (highlight) highlight.style.display = 'none';

            if (popover) {
                const popW = popover.offsetWidth || 400;
                const popH = popover.offsetHeight || 260;
                popover.style.top = `${Math.max(20, (window.innerHeight - popH) / 2)}px`;
                popover.style.left = `${Math.max(20, (window.innerWidth - popW) / 2)}px`;
            }
        },

        nextStep() {
            if (this.currentStepIndex < this.steps.length - 1) {
                this.currentStepIndex++;
                this.renderStep(this.currentStepIndex);
            } else {
                this.endTour(true);
            }
        },

        prevStep() {
            if (this.currentStepIndex > 0) {
                this.currentStepIndex--;
                this.renderStep(this.currentStepIndex);
            }
        },

        endTour(userCompleted = true) {
            this.isActive = false;
            this.unbindEvents();

            const overlay = document.getElementById('platformTourOverlay');
            const highlight = document.getElementById('platformTourTargetHighlight');
            const popover = document.getElementById('platformTourPopover');

            if (overlay) overlay.classList.remove('tour-active');
            if (highlight) highlight.classList.remove('active');
            if (popover) popover.classList.remove('active');

            if (userCompleted) {
                localStorage.setItem('qiraati_tour_completed', 'true');
            }

            // مؤثر صوتي عند الإنهاء
            if (userCompleted) {
                this.playSuccessChime();
            }
        },

        skipTour() {
            this.endTour(true);
        },

        playTourChime() {
            try {
                if (window.AudioContext || window.webkitAudioContext) {
                    const ctx = new (window.AudioContext || window.webkitAudioContext)();
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
                    osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15); // E5
                    gain.gain.setValueAtTime(0.12, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start();
                    osc.stop(ctx.currentTime + 0.36);
                }
            } catch (e) {
                // تشغيل صامت عند عدم توفر AudioContext
            }
        },

        playSuccessChime() {
            try {
                if (window.AudioContext || window.webkitAudioContext) {
                    const ctx = new (window.AudioContext || window.webkitAudioContext)();
                    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
                    notes.forEach((freq, idx) => {
                        const osc = ctx.createOscillator();
                        const gain = ctx.createGain();
                        osc.type = 'triangle';
                        osc.frequency.setValueAtTime(freq, ctx.currentTime + (idx * 0.08));
                        gain.gain.setValueAtTime(0.15, ctx.currentTime + (idx * 0.08));
                        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + (idx * 0.08) + 0.3);
                        osc.connect(gain);
                        gain.connect(ctx.destination);
                        osc.start(ctx.currentTime + (idx * 0.08));
                        osc.stop(ctx.currentTime + (idx * 0.08) + 0.32);
                    });
                }
            } catch (e) {
                // صامت
            }
        }
    };


    /* ==========================================================================
       2. محرك دليل المعلم وولي الأمر الرقمي (InteractiveGuide Engine)
       ========================================================================== */
    const InteractiveGuide = {
        activeChapter: 'phonics',
        activeFilter: 'all',

        init() {
            // استرجاع آخر فصل تمت قراءته
            const savedChapter = localStorage.getItem('qiraati_guide_last_chapter');
            if (savedChapter && document.getElementById(`paneGuide_${savedChapter}`)) {
                this.activeChapter = savedChapter;
            }
        },

        openGuideModal(chapterId = null) {
            if (chapterId && document.getElementById(`paneGuide_${chapterId}`)) {
                this.activeChapter = chapterId;
            }

            const modal = document.getElementById('digitalGuideModal');
            if (!modal) return;

            modal.style.display = 'flex';
            this.switchChapter(this.activeChapter);
        },

        closeGuideModal() {
            const modal = document.getElementById('digitalGuideModal');
            if (modal) modal.style.display = 'none';
        },

        switchChapter(chapterId) {
            this.activeChapter = chapterId;
            localStorage.setItem('qiraati_guide_last_chapter', chapterId);

            // تحديث أزرار الفصول في الشريط الجانبي
            const chapterBtns = document.querySelectorAll('.guide-chapter-btn');
            chapterBtns.forEach(btn => {
                const target = btn.getAttribute('data-chapter');
                if (target === chapterId) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });

            // تحديث حاويات الفصول
            const panes = document.querySelectorAll('.guide-content-pane');
            panes.forEach(pane => {
                if (pane.id === `paneGuide_${chapterId}`) {
                    pane.style.display = 'block';
                    pane.scrollTop = 0;
                } else {
                    pane.style.display = 'none';
                }
            });
        },

        filterChapters(filterCategory) {
            this.activeFilter = filterCategory;

            // تحديث أزرار الفلترة
            const pills = document.querySelectorAll('.guide-filter-pill');
            pills.forEach(pill => {
                if (pill.getAttribute('data-filter') === filterCategory) {
                    pill.classList.add('active');
                } else {
                    pill.classList.remove('active');
                }
            });

            // إظهار وإخفاء أزرار الفصول حسب التصنيف
            const chapterBtns = document.querySelectorAll('.guide-chapter-btn');
            let firstVisible = null;

            chapterBtns.forEach(btn => {
                const cat = btn.getAttribute('data-category');
                if (filterCategory === 'all' || cat === filterCategory) {
                    btn.style.display = 'flex';
                    if (!firstVisible) firstVisible = btn.getAttribute('data-chapter');
                } else {
                    btn.style.display = 'none';
                }
            });

            // الانتقال لأول فصل ظاهر إذا كان الفصل الحالي محجوباً
            const currentBtn = document.querySelector(`.guide-chapter-btn[data-chapter="${this.activeChapter}"]`);
            if (currentBtn && currentBtn.style.display === 'none' && firstVisible) {
                this.switchChapter(firstVisible);
            }
        },

        searchInGuide(query) {
            const clearBtn = document.getElementById('guideSearchClear');
            if (clearBtn) {
                clearBtn.style.display = query ? 'block' : 'none';
            }

            const activePane = document.getElementById(`paneGuide_${this.activeChapter}`);
            if (!activePane) return;

            // إزالة التمييز السابق
            this.removeHighlights(activePane);

            if (!query || query.trim().length < 2) return;

            const q = query.trim().toLowerCase();
            this.highlightText(activePane, q);

            // التمرير لأول عنصر تم تمييزه
            const firstMark = activePane.querySelector('mark.guide-highlight');
            if (firstMark) {
                firstMark.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        },

        clearSearch() {
            const input = document.getElementById('guideSearchInput');
            if (input) {
                input.value = '';
                this.searchInGuide('');
            }
        },

        highlightText(node, query) {
            if (node.nodeType === 3) {
                const pos = node.data.toLowerCase().indexOf(query);
                if (pos >= 0) {
                    const spannode = document.createElement('mark');
                    spannode.className = 'guide-highlight';
                    const middlebit = node.splitText(pos);
                    middlebit.splitText(query.length);
                    const middleclone = middlebit.cloneNode(true);
                    spannode.appendChild(middleclone);
                    middlebit.parentNode.replaceChild(spannode, middlebit);
                }
            } else if (node.nodeType === 1 && node.childNodes && !/(script|style|mark)/i.test(node.tagName)) {
                for (let i = 0; i < node.childNodes.length; ++i) {
                    this.highlightText(node.childNodes[i], query);
                }
            }
        },

        removeHighlights(node) {
            const marks = node.querySelectorAll('mark.guide-highlight');
            marks.forEach(mark => {
                const parent = mark.parentNode;
                parent.replaceChild(document.createTextNode(mark.innerText), mark);
                parent.normalize();
            });
        },

        printCurrentChapter() {
            const activePane = document.getElementById(`paneGuide_${this.activeChapter}`);
            const printArea = document.getElementById('guidePrintArea');
            if (!activePane || !printArea) return;

            const chapterTitle = activePane.querySelector('h2') ? activePane.querySelector('h2').innerText : 'دليل المنصة';

            printArea.innerHTML = `
                <div class="guide-print-header">
                    <h1>📖 منصة قراءتي التفاعلية الذكية</h1>
                    <p><b>دليل المعلم وولي الأمر الرقمي لإدارة المنصة والمسابقات</b></p>
                    <p style="color: #059669; font-weight: 800; margin-top: 4px;">${chapterTitle}</p>
                </div>
                <div class="guide-print-body">
                    ${activePane.innerHTML}
                </div>
                <div class="guide-print-footer">
                    <p><b>إعداد وتطوير: المهندس أسامة خليل هاشم</b> • منصة قراءتي التفاعلية الذكية • مرخصة للاستخدام المدرسي والمنزلي أوفلاين 100%</p>
                </div>
            `;

            window.print();
        },

        // اختصارات الإجراءات السريعة من داخل الدليل
        launchQuizFromGuide() {
            this.closeGuideModal();
            if (window.ClassroomQuiz && typeof window.ClassroomQuiz.openQuizModal === 'function') {
                window.ClassroomQuiz.openQuizModal('host');
            } else if (typeof window.openClassroomQuizModal === 'function') {
                window.openClassroomQuizModal('host');
            }
        },

        launchTeacherFromGuide() {
            this.closeGuideModal();
            if (typeof window.openTeacherDashboardModal === 'function') {
                window.openTeacherDashboardModal('overview');
            }
        },

        launchSyncFromGuide() {
            this.closeGuideModal();
            if (typeof window.openClassroomSyncModal === 'function') {
                window.openClassroomSyncModal();
            }
        },

        launchTraceFromGuide() {
            this.closeGuideModal();
            if (typeof window.openHandwritingTrace === 'function') {
                window.openHandwritingTrace();
            }
        },

        launchGamesFromGuide() {
            this.closeGuideModal();
            if (typeof window.openGamesModal === 'function') {
                window.openGamesModal('wheel');
            }
        },

        launchTourFromGuide() {
            this.closeGuideModal();
            setTimeout(() => {
                PlatformTour.startTour(0);
            }, 300);
        }
    };

    // إتاحة الكائنات على النطاق العام window
    window.PlatformTour = PlatformTour;
    window.InteractiveGuide = InteractiveGuide;

    // دوال الربط العالمية للاستدعاء من HTML
    window.openDigitalGuideModal = function (chapterId) {
        InteractiveGuide.openGuideModal(chapterId);
    };

    window.closeDigitalGuideModal = function () {
        InteractiveGuide.closeGuideModal();
    };

    window.startPlatformTour = function (stepIndex = 0) {
        PlatformTour.startTour(stepIndex);
    };

    // تهيئة الأنظمة عند اكتمال الـ DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            InteractiveGuide.init();
            PlatformTour.init();
        });
    } else {
        InteractiveGuide.init();
        PlatformTour.init();
    }

})(window, document);
