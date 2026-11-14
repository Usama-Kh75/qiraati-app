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

            if (e.target.id === 'installModal') {

                closeInstallModal();

            }

        }

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

