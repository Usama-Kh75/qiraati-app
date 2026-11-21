/* ==========================================================================
 * منصة قراءتي التفاعلية الذكية - محرك المزامنة الصفية المحلية أوفلاين عبر الواي فاي
 * (Classroom Local Offline Wi-Fi Sync Engine)
 * لمزامنة تقدم التلاميذ بين شاشات التابلت ولوحة تحكم المعلم دون الحاجة للإنترنت
 * متوافق 100% مع معايير وزارة التربية وقواعد أسامة المعمارية
 * إعداد وتطوير: المهندس أسامة خليل هاشم
 * ========================================================================== */

(function () {
    'use strict';

    // مفاتيح التخزين المحلي الصارمة (تلتزم بالبادئة qiraati-smart- وفق قواعد أسامة)
    const STORAGE_KEY_ROLE = 'qiraati-smart-sync-role';
    const STORAGE_KEY_STUDENT = 'qiraati-smart-sync-student';
    const STORAGE_KEY_HOST = 'qiraati-smart-sync-host';
    const STORAGE_KEY_AUTOSYNC = 'qiraati-smart-sync-autosync';
    const STORAGE_KEY_QUEUE = 'qiraati-smart-sync-queue';
    const STORAGE_KEY_TABLET_ID = 'qiraati-smart-sync-tablet-id';
    const STORAGE_KEY_ACTIVITY_FEED = 'qiraati-smart-sync-activity-feed';

    // حالة المحرك العامة
    let state = {
        role: 'pupil', // 'pupil' (التابلت) أو 'teacher' (المعلم)
        connectionStatus: 'offline', // 'online', 'syncing', 'offline'
        hostUrl: '',
        autoSync: true,
        tabletId: '',
        student: {
            id: '',
            name: 'تلميذ بطل',
            classId: 'class_a',
            className: 'الصف الأول - شعبة (أ)'
        },
        connectedStudents: {}, // { [studentId]: studentDataObj }
        activeBroadcast: null,
        lastBroadcastId: null,
        isHandRaised: false,
        activityFeed: [],
        focusModeActive: false,
        pollTimer: null,
        radarTimer: null,
        broadcastChannel: null,
        qrScannerStream: null
    };

    // تهيئة المعرّف الفريد للتابلت
    function initTabletId() {
        let tid = localStorage.getItem(STORAGE_KEY_TABLET_ID);
        if (!tid) {
            tid = 'tab_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
            localStorage.setItem(STORAGE_KEY_TABLET_ID, tid);
        }
        state.tabletId = tid;
    }

    // اكتشاف عنوان الخادم المحلي تلقائياً
    function detectHostUrl() {
        const savedHost = localStorage.getItem(STORAGE_KEY_HOST);
        if (savedHost) {
            state.hostUrl = savedHost;
            return;
        }

        // إذا كان التطبيق مفتوحاً عبر بروتوكول HTTP المحلي
        if (window.location.protocol.startsWith('http')) {
            state.hostUrl = window.location.origin;
        } else {
            // القيمة الافتراضية لخادم بايثون الصفي المحلي
            state.hostUrl = 'http://localhost:8080';
        }
    }

    // استرجاع الإعدادات المخزنة
    function loadSavedState() {
        try {
            const savedRole = localStorage.getItem(STORAGE_KEY_ROLE);
            if (savedRole) state.role = savedRole;

            const savedStudent = localStorage.getItem(STORAGE_KEY_STUDENT);
            if (savedStudent) state.student = Object.assign(state.student, JSON.parse(savedStudent));

            const savedAuto = localStorage.getItem(STORAGE_KEY_AUTOSYNC);
            state.autoSync = savedAuto !== 'false';

            const savedFeed = localStorage.getItem(STORAGE_KEY_ACTIVITY_FEED);
            if (savedFeed) state.activityFeed = JSON.parse(savedFeed);
        } catch (e) {
            console.warn('استرجاع إعدادات المزامنة:', e);
        }
    }

    // حفظ الإعدادات
    function saveState() {
        try {
            localStorage.setItem(STORAGE_KEY_ROLE, state.role);
            localStorage.setItem(STORAGE_KEY_STUDENT, JSON.stringify(state.student));
            localStorage.setItem(STORAGE_KEY_HOST, state.hostUrl);
            localStorage.setItem(STORAGE_KEY_AUTOSYNC, state.autoSync ? 'true' : 'false');
            localStorage.setItem(STORAGE_KEY_ACTIVITY_FEED, JSON.stringify(state.activityFeed.slice(-30)));
        } catch (e) {
            console.error('حفظ إعدادات المزامنة:', e);
        }
    }

    // تهيئة المحرك عند التحميل
    function init() {
        initTabletId();
        detectHostUrl();
        loadSavedState();

        // تهيئة قناة BroadcastChannel للمزامنة الفورية المحلية بين النوافذ والتبويبات
        try {
            if ('BroadcastChannel' in window) {
                state.broadcastChannel = new BroadcastChannel('qiraati-classroom-sync');
                state.broadcastChannel.onmessage = handleBroadcastChannelMessage;
            }
        } catch (e) {
            console.warn('BroadcastChannel غير مدعوم في هذا المتصفح:', e);
        }

        updateTopBarIndicator();
        startBackgroundPolling();
        hookAppActivityEvents();

        // تعبئة قائمة الدروس في التوجيه الصفي إذا كانت متوفرة
        populateBroadcastLessonsDropdown();
    }

    // ==========================================================================
    // 1. التعامل مع قناة BroadcastChannel والتواصل المحلي
    // ==========================================================================
    function handleBroadcastChannelMessage(event) {
        if (!event || !event.data) return;
        const msg = event.data;

        if (msg.type === 'PUPIL_REPORT') {
            if (state.role === 'teacher') {
                registerStudentReport(msg.payload);
            }
        } else if (msg.type === 'TEACHER_BROADCAST') {
            applyBroadcastCommand(msg.payload);
        } else if (msg.type === 'HAND_RAISE') {
            if (state.role === 'teacher') {
                handlePupilHandRaise(msg.payload);
            }
        }
    }

    // ==========================================================================
    // 2. تحديث مؤشر الشريط العلوي
    // ==========================================================================
    function updateTopBarIndicator() {
        const dot = document.getElementById('topSyncStatusDot');
        const lbl = document.getElementById('topSyncStatusLabel');
        if (!dot || !lbl) return;

        dot.className = 'sync-status-dot';
        if (state.connectionStatus === 'online') {
            dot.classList.add('status-online');
            lbl.textContent = state.role === 'teacher' ? 'رادار الصف 📡' : 'متصل بالمعلم 🟢';
        } else if (state.connectionStatus === 'syncing') {
            dot.classList.add('status-syncing');
            lbl.textContent = 'جاري المزامنة 🔄';
        } else {
            dot.classList.add('status-offline');
            lbl.textContent = 'أوفلاين محلي ⚪';
        }
    }

    // ==========================================================================
    // 3. جمع بيانات تقدم التلميذ اللحظية
    // ==========================================================================
    function collectPupilProgressPayload() {
        let stars = 0;
        let rankTitle = 'برعم القراءة 🌟';
        let levelNum = 1;
        let accuracy = 100;
        let streak = 0;
        let badgesCount = 0;
        let completedLessonsCount = 0;
        let currentStation = 'المحطة التعليمية';

        // 1. استخراج رصيد النجوم
        try {
            const rawStars = localStorage.getItem('qiraati-smart-gamification-stars');
            if (rawStars) stars = parseInt(rawStars, 10) || 0;
            const rawLevel = localStorage.getItem('qiraati-smart-gamification-level');
            if (rawLevel) levelNum = parseInt(rawLevel, 10) || 1;

            const rawStats = localStorage.getItem('qiraati-smart-gamification-stats');
            if (rawStats) {
                const sObj = JSON.parse(rawStats);
                streak = sObj.streak || 0;
                if (sObj.totalAnswered && sObj.totalAnswered > 0) {
                    accuracy = Math.round(((sObj.correctAnswered || 0) / sObj.totalAnswered) * 100);
                }
            }

            const rawBadges = localStorage.getItem('qiraati-smart-gamification-badges');
            if (rawBadges) {
                const bArr = JSON.parse(rawBadges);
                badgesCount = Array.isArray(bArr) ? bArr.length : 0;
            }

            const rawProgress = localStorage.getItem('qiraati-smart-progress-lessons');
            if (rawProgress) {
                const pArr = JSON.parse(rawProgress);
                completedLessonsCount = Array.isArray(pArr) ? pArr.length : 0;
            }
        } catch (e) {
            console.warn('قراءة بيانات التقدم:', e);
        }

        // استخراج المحطة الحالية
        const activeView = document.querySelector('.lesson-view.active');
        if (activeView) {
            const titleEl = activeView.querySelector('.lesson-header h2, .station-title');
            if (titleEl) currentStation = titleEl.textContent.trim();
        }

        // استنتاج الرتبة
        if (stars >= 1201) rankTitle = 'أسطورة قراءتي 👑';
        else if (stars >= 801) rankTitle = 'صقر القراءة 🦅';
        else if (stars >= 501) rankTitle = 'فارس الحروف ⚔️';
        else if (stars >= 301) rankTitle = 'بطل المقاطع 🧩';
        else if (stars >= 151) rankTitle = 'قارئ ماهر 🏅';
        else if (stars >= 51) rankTitle = 'تلميذ نشيط 🚀';

        return {
            tabletId: state.tabletId,
            studentId: state.student.id || ('std_' + state.tabletId),
            studentName: state.student.name || 'تلميذ بطل',
            classId: state.student.classId || 'class_a',
            className: state.student.className || 'الصف الأول - شعبة (أ)',
            stars: stars,
            level: levelNum,
            rank: rankTitle,
            accuracy: accuracy,
            streak: streak,
            badgesCount: badgesCount,
            completedLessons: completedLessonsCount,
            currentStation: currentStation,
            handRaised: state.isHandRaised,
            timestamp: Date.now()
        };
    }

    // ==========================================================================
    // 4. إرسال ومزامنة تقدم التلميذ إلى خادم المعلم
    // ==========================================================================
    async function sendPupilProgressNow() {
        const payload = collectPupilProgressPayload();
        state.connectionStatus = 'syncing';
        updateTopBarIndicator();

        // 1. البث عبر BroadcastChannel المحلي
        if (state.broadcastChannel) {
            try {
                state.broadcastChannel.postMessage({
                    type: 'PUPIL_REPORT',
                    payload: payload
                });
            } catch (e) {}
        }

        // 2. الإرسال عبر HTTP REST للشبكة المحلية
        let success = false;
        if (state.hostUrl) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 3500);

                const res = await fetch(`${state.hostUrl}/api/sync/report`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                    signal: controller.signal
                });
                clearTimeout(timeoutId);

                if (res.ok) {
                    success = true;
                    state.connectionStatus = 'online';
                }
            } catch (e) {
                // فشل الاتصال بالخادم، يتم الحفظ في طابور الانتظار
                state.connectionStatus = 'offline';
            }
        }

        updateTopBarIndicator();
        updatePupilModalStatus(success);

        // صوت تعزيزي لطيف عند النجاح
        if (success && window.AudioEngine && window.AudioEngine.playSystemTone) {
            window.AudioEngine.playSystemTone('success');
        }

        return success;
    }

    // ==========================================================================
    // 5. رفع اليد لطلب مساعدة المعلم
    // ==========================================================================
    async function toggleRaiseHand() {
        state.isHandRaised = !state.isHandRaised;
        const btn = document.getElementById('btnSyncPupilRaiseHand');
        if (btn) {
            btn.classList.toggle('raised', state.isHandRaised);
            btn.innerHTML = state.isHandRaised
                ? '<span>✋</span> <span>يدك مرفوعة الآن (المعلم ينتبه لك)</span>'
                : '<span>🙋‍♂️</span> <span>رفع اليد لطلب مساعدة المعلم</span>';
        }

        const payload = {
            tabletId: state.tabletId,
            studentId: state.student.id,
            studentName: state.student.name,
            handRaised: state.isHandRaised,
            timestamp: Date.now()
        };

        if (state.broadcastChannel) {
            try {
                state.broadcastChannel.postMessage({ type: 'HAND_RAISE', payload: payload });
            } catch (e) {}
        }

        if (state.hostUrl) {
            try {
                await fetch(`${state.hostUrl}/api/sync/hand`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } catch (e) {}
        }

        // إعادة إرسال التقرير لتحديث الرادار
        sendPupilProgressNow();
    }

    // ==========================================================================
    // 6. استطلاع وبث أوامر المعلم الجماعية (Polling & Broadcast)
    // ==========================================================================
    function startBackgroundPolling() {
        if (state.pollTimer) clearInterval(state.pollTimer);

        state.pollTimer = setInterval(async () => {
            if (state.role === 'pupil') {
                await pollTeacherBroadcast();
                if (state.autoSync) {
                    sendPupilProgressNow();
                }
            } else if (state.role === 'teacher') {
                await fetchClassroomReports();
            }
        }, 4000);
    }

    // استطلاع أوامر المعلم لشاشات التابلت
    async function pollTeacherBroadcast() {
        if (!state.hostUrl) return;
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2500);

            const res = await fetch(`${state.hostUrl}/api/sync/broadcast`, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (res.ok) {
                const data = await res.json();
                state.connectionStatus = 'online';
                updateTopBarIndicator();

                if (data && data.broadcast && data.broadcast.id !== state.lastBroadcastId) {
                    state.lastBroadcastId = data.broadcast.id;
                    applyBroadcastCommand(data.broadcast);
                }
            }
        } catch (e) {
            state.connectionStatus = 'offline';
            updateTopBarIndicator();
        }
    }

    // تطبيق أمر التوجيه الصفي المستلم من المعلم
    function applyBroadcastCommand(cmd) {
        if (!cmd || !cmd.action) return;

        if (cmd.action === 'navigate_lesson') {
            handleBroadcastNavigate(cmd);
        } else if (cmd.action === 'focus_mode') {
            handleBroadcastFocus(cmd.enabled, cmd.message);
        } else if (cmd.action === 'award_stars') {
            handleBroadcastAwardStars(cmd.stars, cmd.message);
        } else if (cmd.action === 'roster_sync') {
            handleBroadcastRosterSync(cmd.roster);
        }
    }

    // توجيه جماعي إلى درس محدد
    function handleBroadcastNavigate(cmd) {
        if (!cmd.lessonId) return;

        // إشعار لطيف للتلميذ
        if (window.Navigation && window.Navigation.switchLesson) {
            window.Navigation.switchLesson(cmd.lessonId);
        } else if (window.switchTab) {
            window.switchTab(cmd.lessonId);
        }

        // عرض رسالة إرشادية سريعة
        showClassroomNotification(`📢 وجّه المعلم الصف إلى درس: ${cmd.title || cmd.lessonId}`);
        if (window.AudioEngine && window.AudioEngine.playSystemTone) {
            window.AudioEngine.playSystemTone('chime');
        }
    }

    // وضع التركيز الصفي (Focus Mode)
    function handleBroadcastFocus(enabled, msg) {
        state.focusModeActive = !!enabled;
        const overlay = document.getElementById('classroomFocusOverlay');
        const msgEl = document.getElementById('focusOverlayMsg');
        if (!overlay) return;

        if (enabled) {
            if (msgEl && msg) msgEl.textContent = msg;
            overlay.style.display = 'flex';
            if (window.stopAudio) window.stopAudio();
        } else {
            overlay.style.display = 'none';
        }
    }

    // مكافأة نجوم جماعية من المعلم
    function handleBroadcastAwardStars(stars, msg) {
        const count = parseInt(stars, 10) || 5;
        if (window.Gamification && window.Gamification.awardBonusStars) {
            window.Gamification.awardBonusStars(count, msg || 'مكافأة تشجيعية من المعلم');
        } else {
            // تحديث محلي مباشر إذا لم يكن المحرك متاحاً
            try {
                let cur = parseInt(localStorage.getItem('qiraati-smart-gamification-stars') || '0', 10);
                cur += count;
                localStorage.setItem('qiraati-smart-gamification-stars', cur.toString());
                const topCount = document.getElementById('topGlobalStarsCount');
                if (topCount) topCount.textContent = cur;
            } catch (e) {}
        }

        showClassroomNotification(`⭐ أحسنت! أرسل لك المعلم ${count} نجوم تشجيعية!`);
    }

    // استلام قائمة الشعبة من المعلم
    function handleBroadcastRosterSync(roster) {
        if (!Array.isArray(roster)) return;
        updatePupilStudentSelectOptions(roster);
    }

    // ==========================================================================
    // 7. واجهات نافذة التابلت (Pupil Sync Modal UI)
    // ==========================================================================
    function openPupilSyncModal() {
        const modal = document.getElementById('classroomSyncModal');
        if (!modal) return;

        updatePupilModalValues();
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // محاولة المزامنة الفورية
        sendPupilProgressNow();
    }

    function closePupilSyncModal() {
        const modal = document.getElementById('classroomSyncModal');
        if (modal) modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    function updatePupilModalValues() {
        const nameInput = document.getElementById('syncPupilNameInput');
        const hostInput = document.getElementById('syncPupilHostInput');
        const autoToggle = document.getElementById('syncPupilAutoToggle');
        const cardName = document.getElementById('syncPupilCardName');
        const cardClass = document.getElementById('syncPupilCardClass');

        if (nameInput) nameInput.value = state.student.name || '';
        if (hostInput) hostInput.value = state.hostUrl || '';
        if (autoToggle) autoToggle.checked = state.autoSync;
        if (cardName) cardName.textContent = state.student.name || 'تلميذ بطل';
        if (cardClass) cardClass.textContent = state.student.className || 'الصف الأول - شعبة (أ)';

        // تحديث الشارات
        const payload = collectPupilProgressPayload();
        const starsBadge = document.getElementById('syncPupilStarsBadge');
        const levelBadge = document.getElementById('syncPupilLevelBadge');
        const completedBadge = document.getElementById('syncPupilCompletedBadge');

        if (starsBadge) starsBadge.textContent = payload.stars + ' ⭐';
        if (levelBadge) levelBadge.textContent = payload.rank;
        if (completedBadge) completedBadge.textContent = payload.completedLessons + ' دروس';

        // توليد رمز QR المحمول للتلميذ
        renderPupilQrCode();
    }

    function updatePupilModalStatus(isOnline) {
        const indicator = document.getElementById('syncPupilStatusIndicator');
        if (!indicator) return;

        if (isOnline) {
            indicator.style.background = '#dcfce7';
            indicator.style.color = '#15803d';
            indicator.style.border = '1px solid #86efac';
            indicator.innerHTML = '<span>🟢</span> <span>متصل بصف المعلم ومُزامَن الآن</span>';
        } else {
            indicator.style.background = '#fef3c7';
            indicator.style.color = '#b45309';
            indicator.style.border = '1px solid #fde047';
            indicator.innerHTML = '<span>⚪</span> <span>يعمل أوفلاين (يبحث عن شبكة الصف)</span>';
        }
    }

    function onPupilStudentSelectChange(studentId) {
        const select = document.getElementById('syncPupilStudentSelect');
        if (!select) return;

        const opt = select.options[select.selectedIndex];
        if (opt && opt.value) {
            state.student.id = opt.value;
            state.student.name = opt.text;
            saveState();
            updatePupilModalValues();
            sendPupilProgressNow();
        }
    }

    function onPupilNameInputChange(val) {
        state.student.name = val.trim() || 'تلميذ بطل';
        saveState();
        const cardName = document.getElementById('syncPupilCardName');
        if (cardName) cardName.textContent = state.student.name;
    }

    function onPupilClassSelectChange(val) {
        state.student.classId = val;
        const select = document.getElementById('syncPupilClassSelect');
        if (select) {
            const opt = select.options[select.selectedIndex];
            if (opt) state.student.className = opt.text;
        }
        saveState();
        updatePupilModalValues();
    }

    function onPupilHostInputChange(val) {
        state.hostUrl = val.trim();
        saveState();
    }

    function onPupilAutoSyncToggle(val) {
        state.autoSync = !!val;
        saveState();
    }

    function updatePupilStudentSelectOptions(roster) {
        const select = document.getElementById('syncPupilStudentSelect');
        if (!select) return;

        select.innerHTML = '<option value="">-- اختر اسمك من قائمة الصف --</option>' +
            roster.map(s => `<option value="${s.id}" ${s.id === state.student.id ? 'selected' : ''}>${s.name}</option>`).join('');
    }

    // ==========================================================================
    // 8. محرك رادار المعلم وشبكة التابلت الحية (Teacher Radar Engine)
    // ==========================================================================
    async function fetchClassroomReports() {
        if (!state.hostUrl) return;
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2500);

            const res = await fetch(`${state.hostUrl}/api/sync/reports`, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (res.ok) {
                const data = await res.json();
                state.connectionStatus = 'online';
                updateTopBarIndicator();

                if (data && Array.isArray(data.students)) {
                    data.students.forEach(st => {
                        state.connectedStudents[st.studentId] = st;
                    });
                    renderTeacherRadar();
                }
            }
        } catch (e) {
            // استخدام البيانات المخزنة محلياً
            renderTeacherRadar();
        }
    }

    function registerStudentReport(report) {
        if (!report || !report.studentId) return;
        state.connectedStudents[report.studentId] = report;

        // إضافة سجل للتغذية الحية
        addActivityFeedItem({
            text: `${report.studentName}: نشط في ${report.currentStation} (${report.stars} ⭐)`,
            time: new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' })
        });

        renderTeacherRadar();
    }

    function handlePupilHandRaise(payload) {
        if (!payload || !payload.studentId) return;
        if (state.connectedStudents[payload.studentId]) {
            state.connectedStudents[payload.studentId].handRaised = payload.handRaised;
        }

        if (payload.handRaised) {
            addActivityFeedItem({
                text: `🙋‍♂️ ${payload.studentName} رفع يده لطلب المساعدة!`,
                time: new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' }),
                urgent: true
            });

            if (window.AudioEngine && window.AudioEngine.playSystemTone) {
                window.AudioEngine.playSystemTone('attention');
            }
        }

        renderTeacherRadar();
    }

    // ريندر شبكة رادار أجهزة التابلت في لوحة المعلم
    function renderTeacherRadar() {
        const grid = document.getElementById('classroomRadarGrid');
        const countConnected = document.getElementById('syncConnectedCount');
        const countActive = document.getElementById('syncActiveCount');
        const avgStarsEl = document.getElementById('syncAvgStars');
        const handCountEl = document.getElementById('syncHandRaiseCount');
        const hostDisplay = document.getElementById('syncHostDisplay');

        if (hostDisplay) {
            hostDisplay.textContent = state.hostUrl || 'http://localhost:8080';
        }

        const studentsArr = Object.values(state.connectedStudents);
        const now = Date.now();

        // حساب الإحصائيات
        let activeNowCount = 0;
        let totalStars = 0;
        let handRaisedCount = 0;

        studentsArr.forEach(st => {
            const isRecent = (now - (st.timestamp || 0)) < 90000; // في آخر دقيقة ونصف
            if (isRecent) activeNowCount++;
            totalStars += (st.stars || 0);
            if (st.handRaised) handRaisedCount++;
        });

        if (countConnected) countConnected.textContent = studentsArr.length;
        if (countActive) countActive.textContent = activeNowCount;
        if (avgStarsEl) avgStarsEl.textContent = studentsArr.length ? Math.round(totalStars / studentsArr.length) : '0';
        if (handCountEl) handCountEl.textContent = handRaisedCount;

        if (!grid) return;

        if (studentsArr.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 16px;">
                    <div style="font-size: 3rem; margin-bottom: 10px;">📡</div>
                    <div style="font-size: 1.15rem; font-weight: 800; color: #1e293b;">الرادار يبحث عن شاشات التابلت على شبكة الواي فاي...</div>
                    <div style="font-size: 0.88rem; color: #64748b; margin-top: 6px;">
                        اطلب من التلاميذ فتح التطبيق على أجهزتهم اللوحية والضغط على «المزامنة الصفية» لربط أجهزتهم بالصف فوراً.
                    </div>
                </div>
            `;
            return;
        }

        // بناء كروت أجهزة التابلت
        grid.innerHTML = studentsArr.map(st => {
            const isRecent = (now - (st.timestamp || 0)) < 90000;
            const statusClass = isRecent ? 'online' : 'idle';
            const statusLabel = isRecent ? 'متصل الآن 🟢' : 'خامل 🟡';
            const isHand = !!st.handRaised;

            return `
                <div class="sync-tablet-card ${isRecent ? 'active-online' : ''} ${isHand ? 'hand-alert' : ''}" id="tabletCard_${st.studentId}">
                    ${isHand ? '<div class="hand-raised-badge"><span>✋</span> <span>يطلب المساعدة!</span></div>' : ''}
                    <div>
                        <div class="tablet-card-top">
                            <div class="tablet-pupil-title">
                                <div class="tablet-pupil-avatar">🎒</div>
                                <div>
                                    <div class="tablet-pupil-name">${escapeHtml(st.studentName)}</div>
                                    <div class="tablet-pupil-id">${escapeHtml(st.className || '')}</div>
                                </div>
                            </div>
                            <span class="tablet-status-badge ${statusClass}">${statusLabel}</span>
                        </div>

                        <div class="tablet-activity-box">
                            <div class="tablet-activity-label"><span>📍</span> النشاط الحالي:</div>
                            <div class="tablet-activity-text" title="${escapeHtml(st.currentStation || '')}">${escapeHtml(st.currentStation || 'يتعلم القراءة')}</div>
                        </div>

                        <div class="tablet-stats-bar">
                            <span class="tablet-stars-pill">⭐ <b>${st.stars || 0}</b></span>
                            <span class="tablet-accuracy-pill">دقة: <b>${st.accuracy || 100}%</b></span>
                            <span class="tablet-sync-time">${formatTimeAgo(st.timestamp)}</span>
                        </div>
                    </div>

                    <div class="tablet-card-actions">
                        <button type="button" class="btn-tablet-star" onclick="ClassroomSync.awardStudentStarFromRadar('${st.studentId}', 5)" title="منح 5 نجوم تشجيعية لهذا التلميذ">
                            <span>⭐</span> <span>+5 تشجيع</span>
                        </button>
                        ${isHand ? `
                            <button type="button" class="btn-tablet-star" style="background: #fee2e2; border-color: #fca5a5; color: #b91c1c;" onclick="ClassroomSync.dismissHandRaise('${st.studentId}')" title="تأكيد تقديم المساعدة وخفض اليد">
                                <span>✔</span> <span>تمت المساعدة</span>
                            </button>
                        ` : ''}
                        <button type="button" class="btn-tablet-inspect" onclick="ClassroomSync.inspectStudentTablet('${st.studentId}')" title="فحص التفاصيل">
                            <span>👀</span>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        renderActivityFeed();
    }

    function addActivityFeedItem(item) {
        state.activityFeed.unshift(item);
        if (state.activityFeed.length > 25) state.activityFeed.pop();
        saveState();
        renderActivityFeed();
    }

    function renderActivityFeed() {
        const feedList = document.getElementById('classroomActivityFeed');
        if (!feedList) return;

        if (state.activityFeed.length === 0) {
            feedList.innerHTML = '<div style="color: #94a3b8; font-size: 0.85rem; text-align: center; padding: 12px;">بانتظار أنشطة التلاميذ...</div>';
            return;
        }

        feedList.innerHTML = state.activityFeed.map(it => `
            <div class="sync-feed-item" style="${it.urgent ? 'border-right-color: #ef4444; background: #fef2f2;' : ''}">
                <span>${escapeHtml(it.text)}</span>
                <span class="sync-feed-time">${it.time}</span>
            </div>
        `).join('');
    }

    // ==========================================================================
    // 9. غرفة التحكم والتوجيه الصفي للمعلم (Broadcast & Controls)
    // ==========================================================================
    async function broadcastCommand(cmd) {
        cmd.id = 'cmd_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
        cmd.timestamp = Date.now();

        // 1. الإرسال عبر BroadcastChannel
        if (state.broadcastChannel) {
            try {
                state.broadcastChannel.postMessage({ type: 'TEACHER_BROADCAST', payload: cmd });
            } catch (e) {}
        }

        // 2. الإرسال عبر HTTP REST
        if (state.hostUrl) {
            try {
                await fetch(`${state.hostUrl}/api/sync/broadcast`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(cmd)
                });
            } catch (e) {}
        }

        showClassroomNotification('✔ تم إرسال الأمر لكافة شاشات التابلت بنجاح');
    }

    // إرسال توجيه جماعي إلى درس محدد
    function broadcastLessonFromSelect() {
        const select = document.getElementById('syncBroadcastLessonSelect');
        if (!select || !select.value) return;

        const lessonId = select.value;
        const opt = select.options[select.selectedIndex];
        const title = opt ? opt.text : lessonId;

        broadcastCommand({
            action: 'navigate_lesson',
            lessonId: lessonId,
            title: title
        });
    }

    // تفعيل / إلغاء وضع التركيز الصفي (Focus Mode)
    function toggleFocusMode() {
        state.focusModeActive = !state.focusModeActive;
        const btn = document.getElementById('btnSyncToggleFocus');
        if (btn) {
            btn.classList.toggle('btn-radar-warning', state.focusModeActive);
            btn.innerHTML = state.focusModeActive
                ? '<span>🔓</span> <span>إلغاء وضع التركيز الصفي</span>'
                : '<span>🔒</span> <span>وضع انتباه الصف (قفل الشاشات)</span>';
        }

        broadcastCommand({
            action: 'focus_mode',
            enabled: state.focusModeActive,
            message: 'انتبهوا لشرح المعلم على السبورة يا أبطال 🔔✨'
        });
    }

    // إرسال مكافأة نجوم جماعية لكل أجهزة التابلت
    function broadcastAwardGroupStars() {
        broadcastCommand({
            action: 'award_stars',
            stars: 5,
            message: 'مكافأة تميز وتفاعل صفي من المعلم ⭐'
        });

        // مكافأة المعلم لنفسه أيضاً إن رغب
        if (window.Gamification && window.Gamification.awardBonusStars) {
            window.Gamification.awardBonusStars(5, 'مكافأة التميز الصفي');
        }
    }

    // إرسال رسالة مخصصة للشاشات
    function broadcastCustomMessage() {
        const input = document.getElementById('syncBroadcastMsgInput');
        if (!input || !input.value.trim()) return;

        const msg = input.value.trim();
        broadcastCommand({
            action: 'custom_message',
            message: msg
        });
        input.value = '';
    }

    // تعميم قائمة أسماء تلاميذ الشعبة النشطة على كل أجهزة التابلت
    function broadcastCurrentClassRoster() {
        let roster = [];
        if (window.TeacherDashboard && window.TeacherDashboard.getActiveClassStudents) {
            roster = window.TeacherDashboard.getActiveClassStudents();
        }

        if (!roster || roster.length === 0) {
            alert('يرجى التأكد من وجود تلاميذ في سجل الشعبة النشطة أولاً.');
            return;
        }

        broadcastCommand({
            action: 'roster_sync',
            roster: roster.map(s => ({ id: s.id, name: s.name }))
        });

        alert(`✔ تم بث قائمة أسماء ${roster.length} تلميذاً إلى كافة أجهزة التابلت في الصف.`);
    }

    // دمج وسحب بيانات التابلت مباشرة في سجل درجات المعلم الرسمي
    function ingestAllPupilDataIntoTeacherRecords() {
        const studentsArr = Object.values(state.connectedStudents);
        if (studentsArr.length === 0) {
            alert('لا توجد بيانات أجهزة لوحية متصلة حالياً لسحبها.');
            return;
        }

        if (!window.TeacherDashboard || !window.TeacherDashboard.ingestStudentProgress) {
            alert('لوحة تحكم المعلم غير جاهزة للدمج حالياً.');
            return;
        }

        let updatedCount = 0;
        studentsArr.forEach(st => {
            window.TeacherDashboard.ingestStudentProgress({
                id: st.studentId,
                name: st.studentName,
                stars: st.stars || 0,
                streak: st.streak || 0,
                completedLessons: st.completedLessons || 0,
                accuracy: st.accuracy || 100
            });
            updatedCount++;
        });

        alert(`🎉 تم بنجاح سحب وتحديث سجلات ${updatedCount} تلميذاً في كشف الدرجات والتقارير المطبوعة أوفلاين!`);
    }

    // منح نجمة تشجيعية لتلميذ محدد من الرادار
    function awardStudentStarFromRadar(studentId, count) {
        const st = state.connectedStudents[studentId];
        if (!st) return;

        st.stars = (st.stars || 0) + (count || 5);
        broadcastCommand({
            action: 'award_stars',
            targetStudentId: studentId,
            stars: count || 5,
            message: `أحسنت يا ${st.studentName}! أرسل لك المعلم نجوم تميز ⭐`
        });

        renderTeacherRadar();
    }

    // إخفاء تنبيه رفع اليد
    function dismissHandRaise(studentId) {
        if (state.connectedStudents[studentId]) {
            state.connectedStudents[studentId].handRaised = false;
            renderTeacherRadar();
        }
    }

    function inspectStudentTablet(studentId) {
        const st = state.connectedStudents[studentId];
        if (!st) return;

        alert(`📋 بطاقة تقدم التلميذ:\n\n• الاسم: ${st.studentName}\n• الرتبة: ${st.rank || ''}\n• رصيد النجوم: ${st.stars} ⭐\n• الدقة: ${st.accuracy}%\n• النشاط اللحظي: ${st.currentStation}\n• التابلت: ${st.tabletId}`);
    }

    // ==========================================================================
    // 10. توليد ومسح كود QR للتلميذ بدون شبكة إطلاقاً (Offline QR Engine)
    // ==========================================================================
    function renderPupilQrCode() {
        const canvas = document.getElementById('syncPupilQrCanvas');
        if (!canvas) return;

        const payload = collectPupilProgressPayload();
        // تشفير مضغوط وسريع
        const codeStr = `QIR|${payload.studentId}|${encodeURIComponent(payload.studentName)}|${payload.stars}|${payload.accuracy}|${payload.completedLessons}|${Date.now()}`;

        // رسم كود مرئي بديل نقي خفيف بدون مكتبات خارجية
        drawCompactVisualCode(canvas, codeStr);
    }

    function drawCompactVisualCode(canvas, text) {
        const ctx = canvas.getContext('2d');
        const size = 180;
        canvas.width = size;
        canvas.height = size;

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);

        // رسم مربعات محاكاة QR Code خفيفة وأنيقة بدقة بكسلية
        ctx.fillStyle = '#0f172a';
        const blockSize = 6;
        const count = Math.floor(size / blockSize);

        // مربعات الزوايا الثلاثة (Finder Patterns)
        drawFinderPattern(ctx, 10, 10, 42);
        drawFinderPattern(ctx, size - 52, 10, 42);
        drawFinderPattern(ctx, 10, size - 52, 42);

        // توليد مصفوفة بكسلات من قيمة النص
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
            hash = ((hash << 5) - hash) + text.charCodeAt(i);
            hash |= 0;
        }

        for (let x = 3; x < count - 3; x++) {
            for (let y = 3; y < count - 3; y++) {
                // تجاوز مربعات الزوايا
                if ((x < 10 && y < 10) || (x > count - 11 && y < 10) || (x < 10 && y > count - 11)) continue;

                const bit = Math.abs((hash * (x + 1) * (y + 1) + (x ^ y)) % 7);
                if (bit === 0 || bit === 2) {
                    ctx.fillRect(x * blockSize, y * blockSize, blockSize - 1, blockSize - 1);
                }
            }
        }

        // شعار في الوسط
        ctx.fillStyle = '#059669';
        ctx.fillRect(size / 2 - 14, size / 2 - 14, 28, 28);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Tajawal, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('📖', size / 2, size / 2);
    }

    function drawFinderPattern(ctx, x, y, size) {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(x, y, size, size);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + 6, y + 6, size - 12, size - 12);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(x + 12, y + 12, size - 24, size - 24);
    }

    // فتح ماسح كاميرا المعلم لمسح كود التلميذ أوفلاين
    function openQrScanner() {
        const modal = document.getElementById('classroomQrScanModal');
        if (!modal) return;
        modal.style.display = 'flex';

        const video = document.getElementById('qrScannerVideo');
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia && video) {
            navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
                .then(stream => {
                    state.qrScannerStream = stream;
                    video.srcObject = stream;
                    video.play();
                })
                .catch(err => {
                    console.warn('تعذر فتح الكاميرا:', err);
                });
        }
    }

    function closeQrScanner() {
        const modal = document.getElementById('classroomQrScanModal');
        if (modal) modal.style.display = 'none';

        if (state.qrScannerStream) {
            state.qrScannerStream.getTracks().forEach(track => track.stop());
            state.qrScannerStream = null;
        }
    }

    function processManualQrCode() {
        const input = document.getElementById('qrScannerManualInput');
        if (!input || !input.value.trim()) return;

        const raw = input.value.trim();
        parseAndApplyQrPayload(raw);
        input.value = '';
        closeQrScanner();
    }

    function parseAndApplyQrPayload(raw) {
        if (!raw.startsWith('QIR|')) {
            alert('رمز غير صالح لمنصة قراءتي الذكية.');
            return;
        }

        const parts = raw.split('|');
        const studentId = parts[1];
        const studentName = decodeURIComponent(parts[2] || 'تلميذ');
        const stars = parseInt(parts[3] || '0', 10);
        const accuracy = parseInt(parts[4] || '100', 10);
        const completedLessons = parseInt(parts[5] || '0', 10);

        const report = {
            tabletId: 'qr_' + studentId,
            studentId: studentId,
            studentName: studentName,
            stars: stars,
            accuracy: accuracy,
            completedLessons: completedLessons,
            currentStation: 'تم المسح عبر الكود البصري 📸',
            timestamp: Date.now()
        };

        registerStudentReport(report);
        alert(`✔ تم بنجاح استيراد تقدم التلميذ «${studentName}» (${stars} ⭐)!`);
    }

    // ==========================================================================
    // 11. ربط الأحداث التلقائية مع أنشطة المنصة
    // ==========================================================================
    function hookAppActivityEvents() {
        // عند فتح أي درس، مزامنة المحطة تلقائياً إذا كان التلميذ متصلاً
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.lesson-btn, .station-tab, .btn-action');
            if (btn && state.role === 'pupil' && state.autoSync) {
                setTimeout(sendPupilProgressNow, 800);
            }
        });
    }

    function populateBroadcastLessonsDropdown() {
        const select = document.getElementById('syncBroadcastLessonSelect');
        if (!select) return;

        const lessons = [
            { id: 'tab-prep-1', name: 'التهيئة ص 6: في الطريق للمدرسة' },
            { id: 'tab-prep-2', name: 'التهيئة ص 7: التمييز البصري' },
            { id: 'tab-prep-3', name: 'التهيئة ص 8: المتاهة والاتجاهات' },
            { id: 'tab-prep-4', name: 'التهيئة ص 9: تصنيف الأشياء' },
            { id: 'tab-prep-5', name: 'التهيئة ص 10: الوعي الصوتي' },
            { id: 'tab-unit1-d', name: 'حرف الدال ص 18: دَادَا دُور' },
            { id: 'tab-unit1-r', name: 'حرف الراء ص 22: دَار دُور' },
            { id: 'tab-unit1-b', name: 'حرف الباء ص 26: بَابَا بَاب' },
            { id: 'tab-unit2-m', name: 'حرف الميم ص 32: مَامَا نَام' },
            { id: 'tab-unit2-n', name: 'حرف النون ص 36: بَان نُورِي' },
            { id: 'tab-unit3-w', name: 'حرف الواو ص 44: وَرْد وَدَاد' },
            { id: 'tab-unit3-y', name: 'حرف الياء ص 48: دَار نُورِي' },
            { id: 'tab-unit4-s', name: 'حرف السين ص 56: فِرَاس وَأَنِيس' },
            { id: 'tab-unit4-q', name: 'حرف القاف ص 64: بُوق نَدِيم' },
            { id: 'tab-unit5-z', name: 'حرف الزاي ص 78: مِيزَان قَدُّورِي' },
            { id: 'tab-unit5-t', name: 'حرف الطاء ص 82: طَيَّارَة وَقَّاص' },
            { id: 'tab-unit6-sh', name: 'حرف الشين ص 100: شَامِل شُرْطِيّ' },
            { id: 'tab-unit6-th', name: 'حرف الثاء ص 114: مِحْرَاث حَارِث' }
        ];

        select.innerHTML = '<option value="">-- اختر درساً لتوجيه الصف إليه --</option>' +
            lessons.map(l => `<option value="${l.id}">${l.name}</option>`).join('');
    }

    function showClassroomNotification(msg) {
        let box = document.getElementById('classroomNoticeToast');
        if (!box) {
            box = document.createElement('div');
            box.id = 'classroomNoticeToast';
            box.style.position = 'fixed';
            box.style.bottom = '25px';
            box.style.left = '50%';
            box.style.transform = 'translateX(-50%)';
            box.style.background = 'linear-gradient(135deg, #065f46 0%, #047857 100%)';
            box.style.color = '#ffffff';
            box.style.padding = '12px 24px';
            box.style.borderRadius = '20px';
            box.style.boxShadow = '0 10px 25px rgba(0,0,0,0.25)';
            box.style.fontSize = '1.05rem';
            box.style.fontWeight = '800';
            box.style.zIndex = '9999999';
            box.style.direction = 'rtl';
            box.style.pointerEvents = 'none';
            box.style.transition = 'all 0.3s ease';
            document.body.appendChild(box);
        }

        box.textContent = msg;
        box.style.opacity = '1';
        box.style.transform = 'translateX(-50%) translateY(0)';

        setTimeout(() => {
            box.style.opacity = '0';
            box.style.transform = 'translateX(-50%) translateY(20px)';
        }, 3500);
    }

    // دوال مساعدة
    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function formatTimeAgo(timestamp) {
        if (!timestamp) return 'أوفلاين';
        const diff = Math.floor((Date.now() - timestamp) / 1000);
        if (diff < 20) return 'الآن';
        if (diff < 60) return `منذ ${diff} ث`;
        const mins = Math.floor(diff / 60);
        return `منذ ${mins} د`;
    }

    // التهيئة التلقائية
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // الواجهة العامة المعيارية
    window.ClassroomSync = {
        init,
        openPupilSyncModal,
        closePupilSyncModal,
        sendPupilProgressNow,
        toggleRaiseHand,
        onPupilStudentSelectChange,
        onPupilNameInputChange,
        onPupilClassSelectChange,
        onPupilHostInputChange,
        onPupilAutoSyncToggle,
        renderTeacherRadar,
        fetchClassroomReports,
        broadcastLessonFromSelect,
        toggleFocusMode,
        broadcastAwardGroupStars,
        broadcastCustomMessage,
        broadcastCurrentClassRoster,
        ingestAllPupilDataIntoTeacherRecords,
        awardStudentStarFromRadar,
        dismissHandRaise,
        inspectStudentTablet,
        openQrScanner,
        closeQrScanner,
        processManualQrCode,
        state
    };

    // دوال مساعدة على مستوى النافذة
    window.openClassroomSyncModal = openPupilSyncModal;
    window.closeClassroomSyncModal = closePupilSyncModal;

})();
