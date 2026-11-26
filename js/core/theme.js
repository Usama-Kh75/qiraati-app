/* ==========================================================================
 * منصة قراءتي التفاعلية الذكية - مدير المظهر والوضع الليلي المريح (Theme Manager)
 * إعداد وتطوير: المهندس أسامة خليل هاشم
 * ========================================================================== */

(function (window, document) {
    'use strict';

    const STORAGE_KEY_THEME = 'qiraati-smart-theme';
    const VALID_MODES = ['light', 'dark', 'system'];
    let _mediaQuery = null;
    let _initialized = false;

    function getPreference() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY_THEME);
            if (saved && VALID_MODES.includes(saved)) {
                return saved;
            }
        } catch (e) {}
        return 'light';
    }

    function _getSystemPrefersDark() {
        try {
            return Boolean(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
        } catch (e) {
            return false;
        }
    }

    function getResolvedTheme(pref) {
        const mode = pref || getPreference();
        if (mode === 'system') {
            return _getSystemPrefersDark() ? 'dark' : 'light';
        }
        return mode === 'dark' ? 'dark' : 'light';
    }

    function _applyToDocument(resolved) {
        const isDark = resolved === 'dark';
        const root = document.documentElement;
        root.setAttribute('data-theme', resolved);
        root.classList.toggle('dark-mode', isDark);

        const themeMeta = document.querySelector('meta[name="theme-color"]');
        if (themeMeta) {
            themeMeta.setAttribute('content', isDark ? '#0f172a' : '#2563eb');
        }
    }

    function syncUI() {
        const pref = getPreference();
        const resolved = getResolvedTheme(pref);
        const isDark = resolved === 'dark';

        const topBtn = document.getElementById('btnTopThemeToggle');
        if (topBtn) {
            topBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
            topBtn.classList.toggle('is-dark', isDark);
            topBtn.title = isDark
                ? 'التبديل إلى الوضع النهاري المشرق'
                : 'التبديل إلى الوضع الليلي المريح للعين';
            topBtn.innerHTML = isDark
                ? '<span>☀️</span><span class="btn-system-text">نهاري</span>'
                : '<span>🌙</span><span class="btn-system-text">ليلي</span>';
        }

        const megaBtn = document.getElementById('megaThemeToggleBtn');
        if (megaBtn) {
            megaBtn.innerHTML = isDark
                ? '<span>☀️ نهاري</span>'
                : '<span>🌙 ليلي</span>';
        }

        ['light', 'dark', 'system'].forEach((mode) => {
            const card = document.getElementById('themeOpt_' + mode);
            if (card) {
                card.classList.toggle('active', pref === mode);
                card.setAttribute('aria-pressed', pref === mode ? 'true' : 'false');
            }
        });
    }

    function setTheme(mode) {
        const target = VALID_MODES.includes(mode) ? mode : 'light';
        try {
            localStorage.setItem(STORAGE_KEY_THEME, target);
        } catch (e) {}

        const resolved = getResolvedTheme(target);
        _applyToDocument(resolved);
        syncUI();
        return resolved;
    }

    function toggle() {
        const currentResolved = getResolvedTheme();
        const nextMode = currentResolved === 'dark' ? 'light' : 'dark';
        return setTheme(nextMode);
    }

    function init() {
        const resolved = getResolvedTheme();
        _applyToDocument(resolved);

        if (!_initialized) {
            _initialized = true;
            if (window.matchMedia) {
                _mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                const onMediaChange = () => {
                    if (getPreference() === 'system') {
                        _applyToDocument(getResolvedTheme('system'));
                        syncUI();
                    }
                };
                if (typeof _mediaQuery.addEventListener === 'function') {
                    _mediaQuery.addEventListener('change', onMediaChange);
                } else if (typeof _mediaQuery.addListener === 'function') {
                    _mediaQuery.addListener(onMediaChange);
                }
            }
        }

        syncUI();
    }

    window.ThemeManager = {
        init,
        getPreference,
        getResolvedTheme,
        setTheme,
        toggle,
        syncUI
    };
    window.setAppTheme = setTheme;
    window.toggleDarkMode = toggle;
})(window, document);
