/* ==========================================================================
 * منصة قراءتي التفاعلية الذكية - محمل واجهات الدروس الكسول (Lazy View Loader)
 * إعداد وتطوير: المهندس أسامة خليل هاشم
 * ========================================================================== */

(function (window, document) {
    'use strict';

    const _htmlCache = new Map();
    const _inflight = new Map();

    function getManifest() {
        return (window.LESSON_VIEW_MANIFEST && typeof window.LESSON_VIEW_MANIFEST === 'object')
            ? window.LESSON_VIEW_MANIFEST
            : {};
    }

    function getPath(lessonId) {
        if (!lessonId) return null;
        const manifest = getManifest();
        return manifest[lessonId] || null;
    }

    function getAllViewPaths() {
        const manifest = getManifest();
        return Object.values(manifest).filter(Boolean);
    }

    function _getPlaceholderElements() {
        return {
            box: document.getElementById('lessonLoadingPlaceholder'),
            spinner: document.getElementById('lessonLoadingSpinner'),
            msg: document.getElementById('lessonLoadingMessage'),
            errBox: document.getElementById('lessonLoadingErrorBox'),
            errDetail: document.getElementById('lessonLoadingErrorDetail'),
            retryBtn: document.getElementById('lessonLoadingRetryBtn')
        };
    }

    function showLoading(message) {
        const els = _getPlaceholderElements();
        if (!els.box) return;
        els.box.style.display = 'flex';
        els.box.classList.remove('is-error');
        if (els.spinner) els.spinner.style.display = 'inline-block';
        if (els.msg) {
            els.msg.style.display = 'block';
            els.msg.textContent = message || 'جارٍ تجهيز الدرس التفاعلي...';
        }
        if (els.errBox) els.errBox.style.display = 'none';
    }

    function hideLoading() {
        const els = _getPlaceholderElements();
        if (!els.box) return;
        els.box.style.display = 'none';
        els.box.classList.remove('is-error');
        if (els.errBox) els.errBox.style.display = 'none';
    }

    function showError(lessonId, err) {
        const els = _getPlaceholderElements();
        if (!els.box) return;
        els.box.style.display = 'flex';
        els.box.classList.add('is-error');
        if (els.spinner) els.spinner.style.display = 'none';
        if (els.msg) els.msg.style.display = 'none';
        if (els.errBox) els.errBox.style.display = 'flex';

        if (els.errDetail) {
            const isFileProto = window.location.protocol === 'file:';
            if (isFileProto) {
                els.errDetail.textContent = 'تعذر تحميل واجهة الدرس مباشرة عبر بروتوكول file://. يُرجى تشغيل التطبيق عبر الخادم المحلي، أو تثبيته كتطبيق PWA، أو فتح الحزمة المستقلة الشاملة (قراءتي_التفاعلية_الذكية.html).';
            } else {
                const detail = (err && err.message) ? ` (${err.message})` : '';
                els.errDetail.textContent = `تعذر تحميل ملف الدرس من الشبكة أو المخزن المحلي${detail}. تأكد من الاتصال أو من حفظ الدروس للعمل أوفلاين من الضبط.`;
            }
        }

        if (els.retryBtn) {
            els.retryBtn.onclick = function () {
                if (typeof window.goToLessonById === 'function') {
                    window.goToLessonById(lessonId);
                } else {
                    ensureLessonView(lessonId);
                }
            };
        }
    }

    function _fetchViewHtml(lessonId) {
        if (_htmlCache.has(lessonId)) {
            return Promise.resolve(_htmlCache.get(lessonId));
        }
        if (_inflight.has(lessonId)) {
            return _inflight.get(lessonId);
        }

        const relPath = getPath(lessonId);
        if (!relPath) {
            return Promise.reject(new Error(`لا يوجد مسار مسجل للدرس: ${lessonId}`));
        }

        const cleanRel = relPath.replace(/^\.\//, '');
        const promise = fetch('./' + cleanRel, { credentials: 'same-origin' })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`);
                }
                return res.text();
            })
            .then((html) => {
                _htmlCache.set(lessonId, html);
                return html;
            })
            .finally(() => {
                _inflight.delete(lessonId);
            });

        _inflight.set(lessonId, promise);
        return promise;
    }

    function _resolveEmbeddedImages(rootEl) {
        if (!rootEl || !window.IMAGE_DATA) return;
        rootEl.querySelectorAll('img[src]').forEach((img) => {
            const src = img.getAttribute('src');
            if (!src || src.startsWith('data:') || src.startsWith('http')) return;
            const clean = src.replace(/^\.\//, '');
            const base = clean.split('/').pop();
            if (window.IMAGE_DATA[clean]) {
                img.src = window.IMAGE_DATA[clean];
            } else if (window.IMAGE_DATA[base]) {
                img.src = window.IMAGE_DATA[base];
            }
        });
    }

    async function ensureLessonView(lessonId) {
        if (!lessonId) return null;

        // 1. إن كانت الواجهة موجودة مسبقاً في DOM (أحادية أو محمّلة مسبقاً)، أعدها فوراً
        const existing = document.getElementById('view-' + lessonId);
        if (existing) {
            hideLoading();
            return existing;
        }

        const relPath = getPath(lessonId);
        if (!relPath) {
            return null;
        }

        // إظهار مؤشر التحميل فقط عند الحاجة لجلب الملف عبر الشبكة
        const showTimer = _htmlCache.has(lessonId)
            ? null
            : setTimeout(() => showLoading('جارٍ تحميل الدرس التفاعلي...'), 60);

        try {
            const html = await _fetchViewHtml(lessonId);
            if (showTimer) clearTimeout(showTimer);

            // تحقق مجدداً بعد await لتفادي أي إدراج مكرر
            const alreadyInserted = document.getElementById('view-' + lessonId);
            if (alreadyInserted) {
                hideLoading();
                return alreadyInserted;
            }

            const stageCard = document.querySelector('.stage-card');
            if (!stageCard) {
                throw new Error('لم يُعثر على حاوية العرض .stage-card');
            }

            const tpl = document.createElement('template');
            tpl.innerHTML = html.trim();
            const viewEl = tpl.content.querySelector('.lesson-view') || tpl.content.firstElementChild;
            if (!viewEl) {
                throw new Error(`محتوى واجهة الدرس (${lessonId}) فارغ`);
            }

            _resolveEmbeddedImages(viewEl);
            stageCard.appendChild(viewEl);
            hideLoading();
            return document.getElementById('view-' + lessonId) || viewEl;
        } catch (err) {
            if (showTimer) clearTimeout(showTimer);
            console.warn('LessonViewLoader error:', lessonId, err);
            showError(lessonId, err);
            throw err;
        }
    }

    function prefetchLesson(lessonId) {
        if (!lessonId) return Promise.resolve(null);
        if (document.getElementById('view-' + lessonId)) return Promise.resolve(null);
        if (_htmlCache.has(lessonId) || _inflight.has(lessonId)) return Promise.resolve(null);
        if (!getPath(lessonId)) return Promise.resolve(null);
        if (window.location.protocol === 'file:') return Promise.resolve(null);

        return _fetchViewHtml(lessonId).catch(() => null);
    }

    function prefetchAdjacent(flatList, currentIndex) {
        if (!Array.isArray(flatList) || flatList.length === 0) return;
        const run = () => {
            const candidates = [currentIndex + 1, currentIndex - 1];
            candidates.forEach((idx) => {
                if (idx >= 0 && idx < flatList.length) {
                    const item = flatList[idx];
                    if (item && item.status === 'ready' && item.id) {
                        prefetchLesson(item.id);
                    }
                }
            });
        };

        if (typeof window.requestIdleCallback === 'function') {
            window.requestIdleCallback(run, { timeout: 1200 });
        } else {
            setTimeout(run, 450);
        }
    }

    window.LessonViewLoader = {
        getPath,
        getAllViewPaths,
        showLoading,
        hideLoading,
        showError,
        ensureLessonView,
        prefetchLesson,
        prefetchAdjacent
    };
})(window, document);
