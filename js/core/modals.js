/* ==========================================================================
 * منصة قراءتي التفاعلية الذكية - إدارة النوافذ والتثبيت والشاشات (Modals & PWA)
 * إعداد وتطوير: المهندس أسامة خليل هاشم
 * ========================================================================== */


        /* ========================================================

           1. PWA & Fullscreen

        ======================================================== */

        if ('serviceWorker' in navigator) {

            window.addEventListener('load', () => {

                navigator.serviceWorker.register('./sw.js')

                    .then(reg => console.log('SW Registered'))

                    .catch(err => console.log('SW Failed', err));

            });

        }

        let deferredPrompt = null;

        window.addEventListener('beforeinstallprompt', (e) => {

            e.preventDefault();

            deferredPrompt = e;

            const btn = document.getElementById('btnPwaInstall');

            if (btn) btn.style.display = 'inline-flex';

        });

        function installPWA() {

            if (deferredPrompt) {

                deferredPrompt.prompt();

                deferredPrompt.userChoice.then((choiceResult) => {

                    if (choiceResult.outcome === 'accepted') {

                        console.log('PWA installation accepted');

                    }

                    deferredPrompt = null;

                });

            } else {

                const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || window.innerWidth <= 768;

                openInstallModal(isMobile ? 'mobile' : 'pc');

            }

        }

        /* ========================================================

           نافذة التثبيت والتشغيل على الهاتف والحاسوب (Modal Logic)

        ======================================================== */

        function openInstallModal(tab = 'mobile') {

            const modal = document.getElementById('installModal');

            if (!modal) return;

            modal.style.display = 'flex';

            switchModalTab(tab);

            const input = document.getElementById('mobileUrlInput');

            if (input) {

                if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {

                    input.value = 'http://192.168.0.133:8080';

                } else {

                    input.value = window.location.origin;

                }

            }

        }

        function closeInstallModal() {

            const modal = document.getElementById('installModal');

            if (modal) modal.style.display = 'none';

        }

        function closeModalOnBackdrop(e) {
            if (!e.target.classList || !e.target.classList.contains('modal-backdrop')) return;
            const targetId = e.target.id;
            if (targetId === 'installModal') {
                closeInstallModal();
            } else if (targetId === 'gamesModal' && typeof closeGamesModal === 'function') {
                closeGamesModal();
            } else if (targetId === 'blackboardModal' && typeof closeBlackboardModal === 'function') {
                closeBlackboardModal();
            } else if (targetId === 'enrichmentModal' && typeof closeEnrichmentModal === 'function') {
                closeEnrichmentModal();
            } else if (targetId === 'evaluationModal' && typeof closeEvaluationModal === 'function') {
                closeEvaluationModal();
            } else if (targetId === 'settingsModal' && typeof closeSettingsModal === 'function') {
                closeSettingsModal();
            } else if (targetId === 'bookPageModal' && typeof closeBookPageModal === 'function') {
                closeBookPageModal();
            } else {
                e.target.style.display = 'none';
            }
        }

        // دعم إغلاق النوافذ بمفتاح الهروب (Escape Key UX)
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (typeof closeGamesModal === 'function') {
                    const gm = document.getElementById('gamesModal');
                    if (gm && gm.style.display !== 'none') { closeGamesModal(); return; }
                }
                if (typeof closeBlackboardModal === 'function') {
                    const bm = document.getElementById('blackboardModal');
                    if (bm && bm.style.display !== 'none') { closeBlackboardModal(); return; }
                }
                if (typeof closeEnrichmentModal === 'function') {
                    const em = document.getElementById('enrichmentModal');
                    if (em && em.style.display !== 'none') { closeEnrichmentModal(); return; }
                }
                if (typeof closeEvaluationModal === 'function') {
                    const evm = document.getElementById('evaluationModal');
                    if (evm && evm.style.display !== 'none') { closeEvaluationModal(); return; }
                }
                if (typeof closeSettingsModal === 'function') {
                    const sm = document.getElementById('settingsModal');
                    if (sm && sm.style.display !== 'none') { closeSettingsModal(); return; }
                }
                const im = document.getElementById('installModal');
                if (im && im.style.display !== 'none') { closeInstallModal(); return; }
                const bpm = document.getElementById('bookPageModal');
                if (bpm && bpm.style.display !== 'none') { bpm.style.display = 'none'; return; }
            }
        });

        function showMobileModal() {

            openInstallModal('mobile');

        }

        function switchModalTab(tab) {

            const mobileBtn = document.getElementById('tabMobileBtn');

            const pcBtn = document.getElementById('tabPcBtn');

            const mobileContent = document.getElementById('tabMobileContent');

            const pcContent = document.getElementById('tabPcContent');

            if (tab === 'mobile') {

                if (mobileBtn) mobileBtn.classList.add('active');

                if (pcBtn) pcBtn.classList.remove('active');

                if (mobileContent) mobileContent.style.display = 'block';

                if (pcContent) pcContent.style.display = 'none';

            } else {

                if (pcBtn) pcBtn.classList.add('active');

                if (mobileBtn) mobileBtn.classList.remove('active');

                if (pcContent) pcContent.style.display = 'block';

                if (mobileContent) mobileContent.style.display = 'none';

            }

        }

        function copyMobileUrl() {

            const input = document.getElementById('mobileUrlInput');

            if (!input) return;

            input.select();

            input.setSelectionRange(0, 99999);

            navigator.clipboard.writeText(input.value).then(() => {

                const btnText = document.getElementById('copyBtnText');

                if (btnText) {

                    btnText.innerText = 'تم النسخ! ✔️';

                    setTimeout(() => {

                        btnText.innerText = 'نسخ';

                    }, 2000);

                }

            }).catch(() => {

                alert('رابط التطبيق هو: ' + input.value);

            });

        }

        function triggerDirectInstall() {

            if (deferredPrompt) {

                deferredPrompt.prompt();

                deferredPrompt.userChoice.then((choiceResult) => {

                    if (choiceResult.outcome === 'accepted') {

                        closeInstallModal();

                    }

                    deferredPrompt = null;

                });

            } else {

                alert('لتثبيت التطبيق على حاسوبك:\n1. اضغط على أيقونة التثبيت في نهاية شريط عنوان المتصفح (Address Bar).\n2. أو من قائمة المتصفح اختر: "التطبيقات" -> "تثبيت هذا الموقع كتطبيق".');

            }

        }

        function toggleFullScreen() {

            const btnText = document.getElementById('fullscreenText');

            if (!document.fullscreenElement) {

                document.documentElement.requestFullscreen().then(() => {

                    btnText.innerText = 'تصغير';

                });

            } else {

                if (document.exitFullscreen) {

                    document.exitFullscreen().then(() => {

                        btnText.innerText = 'تكبير';

                    });

                }

            }

        }

        function toggleSidebar() {

            const sb = document.getElementById('curriculumSidebar');

            const bd = document.getElementById('sidebarBackdrop');

            if (sb) {

                sb.classList.toggle('open');

                if (bd) {

                    if (sb.classList.contains('open')) {
                        bd.classList.add('show');
                    } else {
                        bd.classList.remove('show');
                    }
                }
            }
        }

        /* ========================================================
           نافذة استعراض صفحات الكتاب المدرسي بدقة فائقة
        ======================================================== */
        function openBookPageModal(imgSrc, title) {
            const modal = document.getElementById('bookPageModal');
            const titleEl = document.getElementById('bookPageModalTitle');
            const imgEl = document.getElementById('bookPageModalImg');
            if (titleEl) titleEl.innerText = title || 'استعراض صفحة الكتاب المدرسي';
            if (imgEl) {
                const resolvedSrc = (window.IMAGE_DATA && window.IMAGE_DATA[imgSrc]) ? window.IMAGE_DATA[imgSrc] : imgSrc;
                imgEl.src = resolvedSrc;
            }
            if (modal) modal.style.display = 'flex';
        }

        function closeBookPageModal() {
            const modal = document.getElementById('bookPageModal');
            if (modal) modal.style.display = 'none';
        }

        window.openBookPageModal = openBookPageModal;
        window.closeBookPageModal = closeBookPageModal;

        /* ========================================================
           إدارة قوائم الشريط العلوي المنسدلة (Top Navbar Dropdowns)
           إعداد وتطوير: المهندس أسامة خليل هاشم
        ======================================================== */
        function toggleTopDropdown(menuId, event) {
            if (event) event.stopPropagation();
            const target = document.getElementById(menuId);
            const isOpen = target && target.style.display === 'flex';
            closeAllTopDropdowns();
            if (target && !isOpen) {
                target.style.display = 'flex';
            }
        }

        function closeAllTopDropdowns() {
            document.querySelectorAll('.top-dropdown-menu').forEach(el => el.style.display = 'none');
        }

        /* ========================================================
           إدارة مركز الأدوات والاستوديوهات وشريط الأدوات السريع
           إعداد وتطوير: المهندس أسامة خليل هاشم (الإصدار v3.55)
        ======================================================== */
        function toggleToolsHub(event) {
            if (event) event.stopPropagation();
            const panel = document.getElementById('toolsMegaPanel');
            const btn = document.getElementById('btnToolsHub');
            if (!panel) return;
            const isShown = panel.style.display === 'flex' || panel.style.display === 'block';
            closeAllTopDropdowns();
            if (!isShown) {
                panel.style.display = 'flex';
                if (btn) btn.classList.add('active');
            } else {
                panel.style.display = 'none';
                if (btn) btn.classList.remove('active');
            }
        }

        function closeToolsHub() {
            const panel = document.getElementById('toolsMegaPanel');
            const btn = document.getElementById('btnToolsHub');
            if (panel) panel.style.display = 'none';
            if (btn) btn.classList.remove('active');
        }

        function toggleQuickRibbon() {
            const ribbon = document.getElementById('navbarQuickRibbon');
            const btn = document.getElementById('btnToggleRibbon');
            const icon = document.getElementById('ribbonToggleIcon');
            const text = document.getElementById('ribbonToggleText');
            if (!ribbon) return;
            const isCollapsed = ribbon.classList.contains('ribbon-collapsed');
            if (isCollapsed) {
                ribbon.classList.remove('ribbon-collapsed');
                if (icon) icon.textContent = '▴';
                if (text) text.textContent = 'إخفاء الشريط السريع';
                if (btn) btn.classList.remove('collapsed');
                try { localStorage.setItem('qiraati-smart-quick-ribbon', 'visible'); } catch(e) {}
            } else {
                ribbon.classList.add('ribbon-collapsed');
                if (icon) icon.textContent = '▾';
                if (text) text.textContent = 'إظهار الشريط السريع';
                if (btn) btn.classList.add('collapsed');
                try { localStorage.setItem('qiraati-smart-quick-ribbon', 'hidden'); } catch(e) {}
            }
        }

        function initQuickRibbonState() {
            try {
                const saved = localStorage.getItem('qiraati-smart-quick-ribbon');
                const ribbon = document.getElementById('navbarQuickRibbon');
                const btn = document.getElementById('btnToggleRibbon');
                const icon = document.getElementById('ribbonToggleIcon');
                const text = document.getElementById('ribbonToggleText');
                if (saved === 'visible') {
                    if (ribbon) ribbon.classList.remove('ribbon-collapsed');
                    if (icon) icon.textContent = '▴';
                    if (text) text.textContent = 'إخفاء الشريط السريع';
                    if (btn) btn.classList.remove('collapsed');
                } else {
                    if (ribbon) ribbon.classList.add('ribbon-collapsed');
                    if (icon) icon.textContent = '▾';
                    if (text) text.textContent = 'إظهار الشريط السريع';
                    if (btn) btn.classList.add('collapsed');
                }
            } catch(e) {}
        }

        document.addEventListener('click', function(e) {
            if (!e.target.closest('.top-dropdown') && !e.target.closest('.tools-hub-dropdown')) {
                closeAllTopDropdowns();
                closeToolsHub();
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeAllTopDropdowns();
                closeToolsHub();
            }
        });

        window.toggleTopDropdown = toggleTopDropdown;
        window.closeAllTopDropdowns = closeAllTopDropdowns;
        window.toggleToolsHub = toggleToolsHub;
        window.closeToolsHub = closeToolsHub;
        window.toggleQuickRibbon = toggleQuickRibbon;
        window.initQuickRibbonState = initQuickRibbonState;

        window.addEventListener('DOMContentLoaded', initQuickRibbonState);
        if (document.readyState === 'interactive' || document.readyState === 'complete') {
            initQuickRibbonState();
        }

