/* ==========================================================================
 * منصة قراءتي التفاعلية الذكية - منظومة حفظ التقدم التلقائي واستئناف الدروس
 * إعداد وتطوير: المهندس أسامة خليل هاشم
 * ========================================================================== */

(function (window, document) {
    'use strict';

    const STORAGE_KEY_V2 = 'qiraati-smart-progress-v2';
    const STORAGE_KEY_LAST = 'qiraati-smart-last-lesson';
    const STORAGE_KEY_LEGACY_LESSONS = 'qiraati-smart-progress-lessons';
    const STORAGE_KEY_ACTIVE_PROFILE = 'qiraati-smart-active-profile';

    let _store = null;
    let _initialized = false;
    let _learningTimer = null;
    let _isRestoringStation = false;

    function _safeParse(raw, fallback) {
        if (!raw) return fallback;
        try {
            const parsed = JSON.parse(raw);
            return parsed !== null && typeof parsed === 'object' ? parsed : fallback;
        } catch (e) {
            return fallback;
        }
    }

    function getActiveProfileId() {
        if (window.StudentProfiles && window.StudentProfiles.activeId) {
            return String(window.StudentProfiles.activeId);
        }
        try {
            const raw = localStorage.getItem(STORAGE_KEY_ACTIVE_PROFILE);
            if (raw) {
                try {
                    const parsed = JSON.parse(raw);
                    if (parsed) return String(parsed);
                } catch (e) {
                    return String(raw);
                }
            }
        } catch (e) {}
        return 'default';
    }

    function _createEmptyProfileState() {
        return {
            lastLessonId: null,
            lastStation: {},
            visited: {},
            completed: {},
            rewarded: {},
            learningMinutes: 0,
            updatedAt: 0
        };
    }

    function _normalizeProfileState(raw) {
        const base = _createEmptyProfileState();
        if (!raw || typeof raw !== 'object') return base;
        base.lastLessonId = typeof raw.lastLessonId === 'string' && raw.lastLessonId ? raw.lastLessonId : null;
        base.lastStation = (raw.lastStation && typeof raw.lastStation === 'object') ? { ...raw.lastStation } : {};
        base.visited = (raw.visited && typeof raw.visited === 'object') ? { ...raw.visited } : {};
        base.completed = (raw.completed && typeof raw.completed === 'object') ? { ...raw.completed } : {};
        base.rewarded = (raw.rewarded && typeof raw.rewarded === 'object') ? { ...raw.rewarded } : {};
        base.learningMinutes = Number.isFinite(Number(raw.learningMinutes)) ? Math.max(0, Number(raw.learningMinutes)) : 0;
        base.updatedAt = Number.isFinite(Number(raw.updatedAt)) ? Number(raw.updatedAt) : 0;
        return base;
    }

    function _getTotalCurriculumCount() {
        if (Array.isArray(window.flatLessonsList) && window.flatLessonsList.length > 0) {
            return window.flatLessonsList.length;
        }
        if (Array.isArray(window.CURRICULUM_DATA)) {
            let count = 0;
            window.CURRICULUM_DATA.forEach((u) => {
                if (Array.isArray(u.lessons)) count += u.lessons.length;
            });
            if (count > 0) return count;
        }
        return 46;
    }

    function _loadStore() {
        if (_store) return _store;

        let rawV2 = null;
        try {
            rawV2 = localStorage.getItem(STORAGE_KEY_V2);
        } catch (e) {}

        if (rawV2) {
            const parsed = _safeParse(rawV2, {});
            const normalized = {};
            Object.keys(parsed).forEach((pid) => {
                normalized[pid] = _normalizeProfileState(parsed[pid]);
            });
            _store = normalized;
            return _store;
        }

        // الترحيل النظيف لأول تشغيل بعد ترقية المرحلة الثانية
        _store = {};
        const pid = getActiveProfileId();
        const initialState = _createEmptyProfileState();
        const totalLessons = _getTotalCurriculumCount();

        try {
            const rawLegacy = localStorage.getItem(STORAGE_KEY_LEGACY_LESSONS);
            if (rawLegacy) {
                const legacyObj = _safeParse(rawLegacy, null);
                if (legacyObj && !Array.isArray(legacyObj)) {
                    const trueKeys = Object.keys(legacyObj).filter((k) => legacyObj[k] === true && k.startsWith('tab-'));
                    // ترحيل التقدم الحقيقي الجزئي فقط؛ تجاهل القيمة الافتراضية القديمة (46/46) لبدء سجل واقعي
                    if (trueKeys.length > 0 && trueKeys.length < totalLessons) {
                        const now = Date.now();
                        trueKeys.forEach((lid) => {
                            initialState.completed[lid] = now;
                            initialState.visited[lid] = now;
                            initialState.rewarded[lid] = true;
                        });
                    }
                }
            }

            const rawLast = localStorage.getItem(STORAGE_KEY_LAST);
            if (rawLast && /^tab-[a-zA-Z0-9_\-]+$/.test(rawLast)) {
                initialState.lastLessonId = rawLast;
            }
        } catch (e) {}

        _store[pid] = initialState;
        _saveStore();
        _syncBackwardsForState(initialState);
        return _store;
    }

    function _saveStore() {
        if (!_store) return;
        try {
            localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(_store));
        } catch (e) {
            console.warn('StudentProgress save error:', e);
        }
    }

    function _getState(profileId) {
        const store = _loadStore();
        const pid = profileId || getActiveProfileId();
        if (!store[pid]) {
            store[pid] = _createEmptyProfileState();
            _saveStore();
        }
        return store[pid];
    }

    function _syncBackwardsForState(st) {
        try {
            const completedMap = {};
            Object.keys(st.completed || {}).forEach((lid) => {
                if (st.completed[lid]) completedMap[lid] = true;
            });
            localStorage.setItem(STORAGE_KEY_LEGACY_LESSONS, JSON.stringify(completedMap));

            if (st.lastLessonId) {
                localStorage.setItem(STORAGE_KEY_LAST, st.lastLessonId);
            } else {
                localStorage.removeItem(STORAGE_KEY_LAST);
            }

            // مزامنة ملف التلميذ النشط في StudentProfiles بدون إطلاق حلقة عكسية
            if (window.StudentProfiles && typeof window.StudentProfiles.getActiveProfile === 'function') {
                const active = window.StudentProfiles.getActiveProfile();
                if (active) {
                    active.completedLessons = Object.keys(completedMap);
                    active.totalLearningMinutes = st.learningMinutes || 0;
                    try {
                        localStorage.setItem('qiraati-smart-profiles', JSON.stringify(window.StudentProfiles.profiles));
                    } catch (e) {}
                }
            }
        } catch (e) {
            console.warn('StudentProgress syncBackwards error:', e);
        }
    }

    function _setupStationDelegation() {
        const stageCard = document.querySelector('.stage-card');
        if (!stageCard || stageCard._progressStationBound) return;
        stageCard._progressStationBound = true;

        stageCard.addEventListener('click', (e) => {
            if (_isRestoringStation) return;
            const tabBtn = e.target.closest('.station-tab');
            if (!tabBtn) return;
            const viewEl = tabBtn.closest('.lesson-view');
            if (!viewEl || !viewEl.id || !viewEl.id.startsWith('view-')) return;
            const lessonId = viewEl.id.slice(5);
            const tabs = Array.from(viewEl.querySelectorAll('.station-tab'));
            const idx = tabs.indexOf(tabBtn);
            if (idx >= 0) {
                recordStationVisit(lessonId, idx);
            }
        });
    }

    function _startLearningTimer() {
        if (_learningTimer) return;
        _learningTimer = setInterval(() => {
            if (document.visibilityState === 'visible') {
                const st = _getState();
                st.learningMinutes = (st.learningMinutes || 0) + 1;
                st.updatedAt = Date.now();
                _saveStore();
                _syncBackwardsForState(st);
                updateSettingsUI();
            }
        }, 60000);
    }

    function init() {
        _loadStore();
        const st = _getState();
        _syncBackwardsForState(st);

        if (!_initialized) {
            _initialized = true;
            _setupStationDelegation();
            _startLearningTimer();
        }
        updateAllProgressUI();
    }

    function getLastLessonId() {
        // 1. الأولوية للرابط المباشر (#lesson=tab-...)
        try {
            const hash = window.location.hash || '';
            const m = hash.match(/^#lesson=(tab-[a-zA-Z0-9_\-]+)/);
            if (m && m[1]) {
                return m[1];
            }
        } catch (e) {}

        // 2. آخر درس في سجل التلميذ النشط
        const st = _getState();
        if (st.lastLessonId) return st.lastLessonId;

        // 3. المفتاح السريع المرجعي
        try {
            const fallback = localStorage.getItem(STORAGE_KEY_LAST);
            if (fallback && /^tab-[a-zA-Z0-9_\-]+$/.test(fallback)) {
                return fallback;
            }
        } catch (e) {}

        return null;
    }

    function recordLessonVisit(lessonId) {
        if (!lessonId) return;
        const st = _getState();
        st.lastLessonId = lessonId;
        if (!st.visited[lessonId]) {
            st.visited[lessonId] = Date.now();
        }
        st.updatedAt = Date.now();

        try {
            const targetHash = '#lesson=' + lessonId;
            if (window.location.hash !== targetHash) {
                window.history.replaceState(null, '', targetHash);
            }
        } catch (e) {}

        _saveStore();
        _syncBackwardsForState(st);
        updateAllProgressUI();
    }

    function recordStationVisit(lessonId, stationIndex) {
        if (!lessonId || typeof stationIndex !== 'number' || stationIndex < 0) return;
        const st = _getState();
        st.lastStation[lessonId] = stationIndex;
        st.updatedAt = Date.now();
        _saveStore();
    }

    function getSavedStation(lessonId) {
        if (!lessonId) return null;
        const st = _getState();
        const val = st.lastStation ? st.lastStation[lessonId] : undefined;
        return (typeof val === 'number' && val >= 0) ? val : null;
    }

    function restoreSavedStation(lessonId, viewEl) {
        const idx = getSavedStation(lessonId);
        if (idx === null || idx <= 0 || !viewEl) return false;
        const tabs = viewEl.querySelectorAll('.station-tab');
        if (!tabs || idx >= tabs.length) return false;
        _isRestoringStation = true;
        try {
            tabs[idx].click();
        } finally {
            _isRestoringStation = false;
        }
        return true;
    }

    function isCompleted(lessonId) {
        if (!lessonId) return false;
        const st = _getState();
        return Boolean(st.completed && st.completed[lessonId]);
    }

    function isVisited(lessonId) {
        if (!lessonId) return false;
        const st = _getState();
        return Boolean((st.visited && st.visited[lessonId]) || isCompleted(lessonId));
    }

    function getCompletedMap() {
        const st = _getState();
        const out = {};
        Object.keys(st.completed || {}).forEach((lid) => {
            if (st.completed[lid]) out[lid] = true;
        });
        return out;
    }

    function getSummaryStats() {
        const flat = Array.isArray(window.flatLessonsList) ? window.flatLessonsList : [];
        const total = flat.length > 0 ? flat.length : _getTotalCurriculumCount();
        const st = _getState();
        let completed = 0;
        let visited = 0;
        if (flat.length > 0) {
            flat.forEach((l) => {
                if (st.completed && st.completed[l.id]) completed++;
                if ((st.visited && st.visited[l.id]) || (st.completed && st.completed[l.id])) visited++;
            });
        } else {
            completed = Object.keys(st.completed || {}).filter((k) => st.completed[k]).length;
            visited = Object.keys(st.visited || {}).filter((k) => st.visited[k]).length;
        }
        const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
        return {
            completed,
            visited,
            total,
            pct,
            learningMinutes: st.learningMinutes || 0,
            lastLessonId: st.lastLessonId || null
        };
    }

    function toggleLessonComplete(lessonId) {
        const flat = Array.isArray(window.flatLessonsList) ? window.flatLessonsList : [];
        const curIdx = typeof window.currentLessonIndex === 'number' ? window.currentLessonIndex : 0;
        const targetId = lessonId || (flat[curIdx] ? flat[curIdx].id : null);
        if (!targetId) return false;

        const st = _getState();
        const wasDone = Boolean(st.completed && st.completed[targetId]);

        if (wasDone) {
            delete st.completed[targetId];
        } else {
            const now = Date.now();
            st.completed[targetId] = now;
            if (!st.visited[targetId]) st.visited[targetId] = now;

            if (!st.rewarded[targetId]) {
                st.rewarded[targetId] = true;
                if (typeof window.awardGamificationStars === 'function') {
                    window.awardGamificationStars(5, 'lesson_complete');
                }
                if (typeof window.mascotCelebrates === 'function') {
                    window.mascotCelebrates();
                }
                if (typeof window.mascotSpeak === 'function') {
                    window.mascotSpeak('أَحْسَنْتَ يَا بَطَل! تَمَّ حِفْظُ إِتْمَامِ الدَّرْسِ وَنِلْتَ <b>+5 نُجُوم</b> ذَهَبِيَّةٍ! ⭐🎉', 'lam_correct');
                } else if (typeof window.playAudio === 'function') {
                    window.playAudio('lam_correct');
                }
            } else if (typeof window.playAudio === 'function') {
                window.playAudio('lam_correct');
            }
        }

        st.updatedAt = Date.now();
        _saveStore();
        _syncBackwardsForState(st);
        updateAllProgressUI();
        return !wasDone;
    }

    function toggleCurrentLessonComplete() {
        return toggleLessonComplete(null);
    }

    function markAllCompleted(flatList) {
        const list = Array.isArray(flatList) && flatList.length > 0
            ? flatList
            : (Array.isArray(window.flatLessonsList) ? window.flatLessonsList : []);
        const st = _getState();
        const now = Date.now();
        list.forEach((l) => {
            if (l && l.id && (!l.status || l.status === 'ready')) {
                st.completed[l.id] = st.completed[l.id] || now;
                st.visited[l.id] = st.visited[l.id] || now;
            }
        });
        st.updatedAt = now;
        _saveStore();
        _syncBackwardsForState(st);
        updateAllProgressUI();
    }

    function resetActiveProgress() {
        const msg = 'هل أنت متأكد من إعادة ضبط تقدم التلميذ النشط فقط؟ سيتم تصفير الدروس المنجزة وآخر درس متوقف عنده لهذا التلميذ دون المساس ببقية التلاميذ أو إعدادات المنصة.';
        if (!window.confirm(msg)) return false;

        const store = _loadStore();
        const pid = getActiveProfileId();
        store[pid] = _createEmptyProfileState();
        _saveStore();
        _syncBackwardsForState(store[pid]);

        try {
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
        } catch (e) {}

        updateAllProgressUI();
        if (typeof window.goToLessonByIndex === 'function') {
            window.goToLessonByIndex(0);
        }
        return true;
    }

    function onProfileChanged() {
        _loadStore();
        const st = _getState();
        _syncBackwardsForState(st);
        updateAllProgressUI();

        const flat = Array.isArray(window.flatLessonsList) ? window.flatLessonsList : [];
        if (flat.length === 0 || typeof window.goToLessonByIndex !== 'function') return;

        let targetIdx = 0;
        let resumed = false;
        if (st.lastLessonId) {
            const idx = flat.findIndex((l) => l.id === st.lastLessonId && l.status === 'ready');
            if (idx > 0) {
                targetIdx = idx;
                resumed = true;
            }
        }
        window.goToLessonByIndex(targetIdx, { isInitialResume: resumed });
    }

    function updateSettingsUI() {
        const stats = getSummaryStats();
        const summaryBox = document.getElementById('settingsProgressSummary');
        const statsText = document.getElementById('settingsProgressStatsText');
        if (summaryBox && statsText) {
            statsText.textContent = `أنجزت ${stats.completed} من أصل ${stats.total} درساً (${stats.pct}%) • تصفّحت ${stats.visited} درساً • وقت التعلم المسجل: ${stats.learningMinutes} دقيقة`;
        }
    }

    function updateAllProgressUI() {
        const stats = getSummaryStats();
        const flat = Array.isArray(window.flatLessonsList) ? window.flatLessonsList : [];

        // 1. بطاقة التقدم في رأس القائمة الجانبية
        const sbText = document.getElementById('sidebarStudentProgressText');
        const sbPct = document.getElementById('sidebarStudentProgressPct');
        const sbFill = document.getElementById('sidebarStudentProgressFill');
        if (sbText) sbText.textContent = `${stats.completed} / ${stats.total} درساً`;
        if (sbPct) sbPct.textContent = `${stats.pct}%`;
        if (sbFill) sbFill.style.width = `${stats.pct}%`;

        // 2. شارة التقدم في قسم الاستوديوهات
        const sidebarPill = document.getElementById('sidebarProgressPill');
        const sidebarFill = document.getElementById('sidebarProgressFill');
        if (sidebarPill) sidebarPill.textContent = `${stats.pct}% مكتمل`;
        if (sidebarFill) sidebarFill.style.width = `${stats.pct}%`;

        // 3. عدّاد كل وحدة وعناصر الدروس
        if (Array.isArray(window.CURRICULUM_DATA)) {
            window.CURRICULUM_DATA.forEach((unit) => {
                const uLessons = Array.isArray(unit.lessons) ? unit.lessons : [];
                let uDone = 0;
                uLessons.forEach((lesson) => {
                    const done = isCompleted(lesson.id);
                    const visited = isVisited(lesson.id);
                    if (done) uDone++;

                    const navItem = document.getElementById('nav-' + lesson.id);
                    if (navItem) {
                        navItem.classList.toggle('is-completed', done);
                        navItem.classList.toggle('is-visited', !done && visited);
                        const badge = navItem.querySelector('.lesson-badge');
                        if (badge) {
                            if (lesson.status !== 'ready') {
                                badge.className = 'lesson-badge badge-upcoming';
                                badge.textContent = 'قيد التطوير 🚀';
                            } else if (done) {
                                badge.className = 'lesson-badge badge-completed';
                                badge.textContent = 'منجز ✅';
                            } else if (visited) {
                                badge.className = 'lesson-badge badge-visited';
                                badge.textContent = 'قيد التعلم 📖';
                            } else {
                                badge.className = 'lesson-badge badge-ready';
                                badge.textContent = 'جاهز ◀';
                            }
                        }
                    }
                });

                const unitPill = document.querySelector(`[data-unit-progress="${unit.id}"]`);
                if (unitPill) {
                    const uTotal = uLessons.length;
                    const uFull = uTotal > 0 && uDone === uTotal;
                    unitPill.textContent = uFull ? `${uDone}/${uTotal} ✓` : `${uDone}/${uTotal}`;
                    unitPill.classList.toggle('is-unit-complete', uFull);
                }
            });
        }

        // 4. زر إتمام الدرس الحالي وشارته العلوية
        const curIdx = typeof window.currentLessonIndex === 'number' ? window.currentLessonIndex : 0;
        const curLesson = flat[curIdx] || null;
        const isCurDone = curLesson ? isCompleted(curLesson.id) : false;

        const btnComplete = document.getElementById('btnToggleLessonComplete');
        if (btnComplete) {
            btnComplete.classList.toggle('is-completed', isCurDone);
            btnComplete.setAttribute('aria-pressed', isCurDone ? 'true' : 'false');
            btnComplete.innerHTML = isCurDone
                ? '<span>✅</span><span>تم إتمام الدرس</span>'
                : '<span>☑️</span><span>أتممتُ هذا الدرس</span>';
        }

        const topBadge = document.getElementById('topLessonCompleteBadge');
        if (topBadge) {
            topBadge.classList.toggle('is-completed', isCurDone);
            topBadge.textContent = isCurDone ? '✅ منجز' : '📖 قيد التعلم';
        }

        // 5. تحديث الضبط والتقييم
        updateSettingsUI();
        if (typeof window.refreshEvaluationPortfolio === 'function') {
            window.refreshEvaluationPortfolio();
        }
    }

    window.StudentProgress = {
        init,
        getActiveProfileId,
        getLastLessonId,
        recordLessonVisit,
        recordStationVisit,
        getSavedStation,
        restoreSavedStation,
        isCompleted,
        isVisited,
        getCompletedMap,
        getSummaryStats,
        toggleLessonComplete,
        toggleCurrentLessonComplete,
        markAllCompleted,
        resetActiveProgress,
        onProfileChanged,
        updateSettingsUI,
        updateAllProgressUI
    };
})(window, document);
