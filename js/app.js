/* ==========================================================================
 * منصة قراءتي التفاعلية الذكية - ملف الإطلاق والتهيئة العامة (Application Bootstrap)
 * إعداد وتطوير: المهندس أسامة خليل هاشم
 * ========================================================================== */

window.addEventListener('load', () => {
    // تسجيل عامل الخدمة PWA
    if ('serviceWorker' in navigator && (window.location.protocol === 'http:' || window.location.protocol === 'https:')) {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('✔ Service Worker مسجل بنجاح:', reg.scope))
            .catch(err => console.log('Service Worker تسجيل فشل:', err));
    }
});

window.addEventListener('DOMContentLoaded', () => {
    // 0. تهيئة المظهر (الوضع الليلي/النهاري) وسجل التقدم التلقائي
    if (window.ThemeManager && typeof window.ThemeManager.init === 'function') {
        window.ThemeManager.init();
    }
    if (window.StudentProgress && typeof window.StudentProgress.init === 'function') {
        window.StudentProgress.init();
    }

    // 1. بناء القائمة الجانبية للمنهج واستئناف آخر درس
    if (typeof buildCurriculumSidebar === 'function') {
        buildCurriculumSidebar();
    }

    // 2. تهيئة مستوى الصوت الرئيسي والشارات
    if (typeof getMasterVolume === 'function') {
        const curVol = getMasterVolume();
        const topSlider = document.getElementById('topVolumeSlider');
        if (topSlider) topSlider.value = curVol;
        const topBadge = document.getElementById('topVolBadge');
        if (topBadge) topBadge.innerText = curVol + '%';
        const topIcon = document.getElementById('topVolIcon');
        if (topIcon) topIcon.innerText = curVol === 0 ? '🔇' : (curVol < 70 ? '🔉' : '🔊');
    }

    // 3. تطبيق تفضيل الصوت المحفوظ مع الترحيل التلقائي
    const savedVoicePref = localStorage.getItem('qiraati-smart-voice-pref') || localStorage.getItem('qiraati_smart_voice_pref') || 'integrated';
    if (typeof applyVoiceCardVisuals === 'function') {
        applyVoiceCardVisuals(savedVoicePref);
    }

    // 4. تطبيق وضع زر الإيقاف العائم مع الترحيل التلقائي
    const savedFloatingStop = localStorage.getItem('qiraati-smart-floating-stop') || localStorage.getItem('qiraati_smart_floating_stop') || localStorage.getItem('qiraati_floating_stop');
    const chkFloating = document.getElementById('chkFloatingStop');
    if (chkFloating && savedFloatingStop !== null) {
        chkFloating.checked = savedFloatingStop === 'true';
    }

    console.log('✅ تم إطلاق منصة قراءتي التفاعلية الذكية بنجاح - إعداد المهندس أسامة خليل هاشم');
});
