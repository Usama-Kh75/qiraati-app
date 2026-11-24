/* ==========================================================================
 * منصة قراءتي التفاعلية الذكية - استوديو القصة المصورة التفاعلية وصانع القصص الرقمية الفونيمية
 * (Interactive Phonics Storyteller & Comic Maker) للأجهزة اللوحية والسبورات
 * متوافق 100% مع كتاب قراءتي ومعايير وزارة التربية العراقية
 * إعداد وتطوير: المهندس أسامة خليل هاشم
 * ========================================================================== */

(function () {
    'use strict';

    // مفاتيح التخزين المعزولة ببادئة قواعد أسامة (qiraati-smart-)
    const STORAGE_KEY_DATA = 'qiraati-smart-story-maker-data';
    const STORAGE_KEY_SAVED = 'qiraati-smart-story-maker-saved';
    const STORAGE_KEY_STATS = 'qiraati-smart-story-maker-stats';

    // ==========================================================================
    // 1. قاعدة بيانات الخلفيات البيئية الملونة SVG
    // ==========================================================================
    const SCENE_BACKGROUNDS = {
        home_living: {
            id: 'home_living',
            name: 'دَارُ دَادَا (غُرْفَةُ المَعِيشَة)',
            icon: '🛋️',
            style: 'linear-gradient(180deg, #fef3c7 0%, #fde68a 65%, #d97706 65%, #b45309 100%)',
            elements: '<svg viewBox="0 0 400 300" width="100%" height="100%"><rect x="30" y="40" width="90" height="90" fill="#93c5fd" stroke="#1e3a8a" stroke-width="4" rx="4"/><line x1="75" y1="40" x2="75" y2="130" stroke="#1e3a8a" stroke-width="3"/><line x1="30" y1="85" x2="120" y2="85" stroke="#1e3a8a" stroke-width="3"/><rect x="260" y="30" width="100" height="70" fill="#fbcfe8" stroke="#be185d" stroke-width="3" rx="4"/><text x="310" y="70" font-size="16" font-weight="900" fill="#831843" text-anchor="middle">دَارُ دَادَا</text><path d="M 20 220 C 20 180, 160 180, 160 220 Z" fill="#a78bfa" stroke="#4c1d95" stroke-width="3"/><rect x="40" y="220" width="100" height="30" fill="#8b5cf6" rx="4"/></svg>'
        },
        school_yard: {
            id: 'school_yard',
            name: 'سَاحَةُ المَدْرَسَةِ وَالعَلَم',
            icon: '🏫',
            style: 'linear-gradient(180deg, #bae6fd 0%, #7dd3fc 60%, #86efac 60%, #22c55e 100%)',
            elements: '<svg viewBox="0 0 400 300" width="100%" height="100%"><rect x="180" y="40" width="6" height="150" fill="#475569"/><rect x="186" y="40" width="50" height="30" fill="#ef4444"/><rect x="186" y="50" width="50" height="10" fill="#ffffff"/><rect x="186" y="60" width="50" height="10" fill="#1e1b4b"/><text x="211" y="58" font-size="7" font-weight="900" fill="#15803d" text-anchor="middle">الله أكبر</text><rect x="30" y="70" width="110" height="110" fill="#fef08a" stroke="#ca8a04" stroke-width="3" rx="4"/><polygon points="20,70 85,25 150,70" fill="#dc2626"/><rect x="65" y="120" width="40" height="60" fill="#92400e" rx="4"/><circle cx="340" cy="50" r="30" fill="#facc15"/></svg>'
        },
        palm_orchard: {
            id: 'palm_orchard',
            name: 'رِيفُ بَاسِم وَبُسْتَانُ النَّخِيل',
            icon: '🌴',
            style: 'linear-gradient(180deg, #fed7aa 0%, #fdba74 55%, #a7f3d0 55%, #10b981 100%)',
            elements: '<svg viewBox="0 0 400 300" width="100%" height="100%"><path d="M 60 170 Q 70 100 80 50 Q 90 100 100 170 Z" fill="#78350f"/><path d="M 80 50 C 40 10, 10 30, 20 60 C 40 50, 70 50, 80 50" fill="#15803d"/><path d="M 80 50 C 120 10, 150 30, 140 60 C 120 50, 90 50, 80 50" fill="#16a34a"/><path d="M 80 50 C 70 0, 90 0, 80 50" fill="#15803d"/><path d="M 280 170 Q 290 90 300 40 Q 310 90 320 170 Z" fill="#78350f"/><path d="M 300 40 C 260 5, 230 25, 240 55" fill="#15803d"/><path d="M 300 40 C 340 5, 370 25, 360 55" fill="#16a34a"/><circle cx="180" cy="40" r="25" fill="#f59e0b"/></svg>'
        },
        river_bank: {
            id: 'river_bank',
            name: 'شَاطِئُ النَّهْرِ (اسْبَحْ بِالشَّطّ)',
            icon: '🛶',
            style: 'linear-gradient(180deg, #e0f2fe 0%, #bae6fd 45%, #38bdf8 45%, #0284c7 80%, #0369a1 100%)',
            elements: '<svg viewBox="0 0 400 300" width="100%" height="100%"><path d="M 0 135 Q 100 130 200 140 T 400 135 L 400 300 L 0 300 Z" fill="#0284c7" opacity="0.6"/><path d="M 120 190 Q 180 230 260 190 L 240 210 Q 180 240 140 210 Z" fill="#78350f"/><polygon points="190,140 190,190 230,190" fill="#ef4444"/><circle cx="330" cy="50" r="28" fill="#fde047"/></svg>'
        },
        fruit_market: {
            id: 'fruit_market',
            name: 'سُوقُ الفَوَاكِهِ وَمِيزَانُ قَدُّورِي',
            icon: '⚖️',
            style: 'linear-gradient(180deg, #fef3c7 0%, #fed7aa 55%, #f1f5f9 55%, #cbd5e1 100%)',
            elements: '<svg viewBox="0 0 400 300" width="100%" height="100%"><rect x="30" y="20" width="340" height="40" fill="#ef4444"/><polygon points="30,60 50,85 70,60 90,85 110,60 130,85 150,60 170,85 190,60 210,85 230,60 250,85 270,60 290,85 310,60 330,85 350,60 370,85 370,60" fill="#ffffff"/><rect x="40" y="165" width="320" height="50" fill="#b45309" rx="4"/><text x="200" y="46" font-size="18" font-weight="900" fill="#ffffff" text-anchor="middle">دُكَّانُ قَدُّورِي</text></svg>'
        },
        fun_park: {
            id: 'fun_park',
            name: 'حَدِيقَةُ الأَلْعَابِ وَالمَرَح',
            icon: '🎡',
            style: 'linear-gradient(180deg, #fbcfe8 0%, #f472b6 50%, #bbf7d0 50%, #4ade80 100%)',
            elements: '<svg viewBox="0 0 400 300" width="100%" height="100%"><circle cx="200" cy="120" r="70" fill="none" stroke="#6366f1" stroke-width="4"/><line x1="200" y1="120" x2="200" y2="210" stroke="#4338ca" stroke-width="6"/><circle cx="200" cy="50" r="12" fill="#ef4444"/><circle cx="270" cy="120" r="12" fill="#facc15"/><circle cx="200" cy="190" r="12" fill="#10b981"/><circle cx="130" cy="120" r="12" fill="#06b6d4"/></svg>'
        },
        starry_night: {
            id: 'starry_night',
            name: 'لَيْلَةُ النُّجُومِ وَالقَمَرِ المُنِير',
            icon: '🌙',
            style: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 65%, #312e81 100%)',
            elements: '<svg viewBox="0 0 400 300" width="100%" height="100%"><path d="M 320 40 A 30 30 0 1 0 350 70 A 24 24 0 1 1 320 40 Z" fill="#fef08a"/><circle cx="60" cy="50" r="3" fill="#ffffff"/><circle cx="120" cy="80" r="2.5" fill="#ffffff"/><circle cx="180" cy="40" r="3.5" fill="#fef08a"/><circle cx="250" cy="70" r="2" fill="#ffffff"/><circle cx="90" cy="120" r="3" fill="#ffffff"/><circle cx="220" cy="110" r="2.5" fill="#fef08a"/></svg>'
        },
        cozy_bedroom: {
            id: 'cozy_bedroom',
            name: 'غُرْفَةُ النَّوْمِ وَالمُطَالَعَة',
            icon: '🛏️',
            style: 'linear-gradient(180deg, #ede9fe 0%, #ddd6fe 65%, #c4b5fd 65%, #a78bfa 100%)',
            elements: '<svg viewBox="0 0 400 300" width="100%" height="100%"><rect x="40" y="40" width="120" height="70" fill="#f1f5f9" stroke="#64748b" stroke-width="3" rx="4"/><line x1="40" y1="75" x2="160" y2="75" stroke="#64748b" stroke-width="2"/><rect x="220" y="160" width="150" height="70" fill="#38bdf8" stroke="#0284c7" stroke-width="4" rx="8"/><rect x="330" y="145" width="40" height="30" fill="#ffffff" stroke="#94a3b8" rx="6"/></svg>'
        }
    };

    // ==========================================================================
    // 2. بنك الشخصيات الكرتونية الفونيمية المتجهة SVG
    // ==========================================================================
    let ssFaseehSvgCounter = 0;
    const CHARACTERS_DATA = {
        faseeh: {
            id: 'faseeh',
            name: 'فَصِيح',
            phonics: 'القَلَمُ الذَّكِيّ',
            get svg() {
                const idx = ++ssFaseehSvgCounter;
                return `<svg viewBox="0 0 120 150" width="90" height="110">
                <defs>
                    <linearGradient id="ss_faseeh_body_${idx}" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stop-color="#f59e0b"/>
                        <stop offset="50%" stop-color="#fbbf24"/>
                        <stop offset="100%" stop-color="#d97706"/>
                    </linearGradient>
                </defs>
                <polygon points="60,5 30,45 90,45" fill="#fed7aa"/>
                <polygon points="60,5 50,22 70,22" fill="#1e1b4b"/>
                <rect x="30" y="45" width="60" height="75" fill="url(#ss_faseeh_body_${idx})" rx="4"/>
                <rect x="30" y="120" width="60" height="14" fill="#cbd5e1"/>
                <path d="M 30 134 C 30 148, 90 148, 90 134 Z" fill="#ef4444"/>
                <circle cx="48" cy="70" r="9" fill="#ffffff"/><circle cx="48" cy="70" r="4.5" fill="#1e1b4b"/>
                <circle cx="72" cy="70" r="9" fill="#ffffff"/><circle cx="72" cy="70" r="4.5" fill="#1e1b4b"/>
                <path d="M 50 92 Q 60 102 70 92" stroke="#1e1b4b" stroke-width="3" fill="none" stroke-linecap="round"/>
                <ellipse cx="60" cy="110" rx="8" ry="4" fill="#dc2626"/>
            </svg>`;
            }
        },
        dada: {
            id: 'dada',
            name: 'دَادَا',
            phonics: 'دَ - ا - دَ - ا',
            svg: `<svg viewBox="0 0 120 150" width="90" height="110">
                <circle cx="60" cy="55" r="34" fill="#fed7aa"/>
                <path d="M 32 105 C 32 80, 88 80, 88 105 L 88 140 C 88 145, 32 145, 32 140 Z" fill="#60a5fa" rx="10"/>
                <circle cx="48" cy="52" r="6" fill="#1e1b4b"/><circle cx="72" cy="52" r="6" fill="#1e1b4b"/>
                <circle cx="38" cy="62" r="5" fill="#f87171" opacity="0.6"/>
                <circle cx="82" cy="62" r="5" fill="#f87171" opacity="0.6"/>
                <path d="M 52 70 Q 60 78 68 70" stroke="#b91c1c" stroke-width="3" fill="none" stroke-linecap="round"/>
                <path d="M 54 22 Q 60 14 66 22" stroke="#78350f" stroke-width="4" fill="none"/>
            </svg>`
        },
        rabab: {
            id: 'rabab',
            name: 'رَبَاب',
            phonics: 'رَ - بَـ - ا - ب',
            svg: `<svg viewBox="0 0 120 150" width="90" height="110">
                <circle cx="60" cy="50" r="30" fill="#fed7aa"/>
                <path d="M 30 45 C 20 20, 100 20, 90 45 Z" fill="#78350f"/>
                <path d="M 28 45 C 15 65, 20 90, 15 95" stroke="#78350f" stroke-width="8" stroke-linecap="round"/>
                <path d="M 92 45 C 105 65, 100 90, 105 95" stroke="#78350f" stroke-width="8" stroke-linecap="round"/>
                <circle cx="15" cy="98" r="6" fill="#ef4444"/>
                <circle cx="105" cy="98" r="6" fill="#ef4444"/>
                <circle cx="50" cy="48" r="5" fill="#1e1b4b"/><circle cx="70" cy="48" r="5" fill="#1e1b4b"/>
                <path d="M 52 64 Q 60 72 68 64" stroke="#dc2626" stroke-width="3" fill="none" stroke-linecap="round"/>
                <polygon points="34,80 86,80 96,140 24,140" fill="#ec4899"/>
                <polygon points="50,80 70,80 60,95" fill="#ffffff"/>
            </svg>`
        },
        nader: {
            id: 'nader',
            name: 'نَادِر',
            phonics: 'نَـ - ا - دِ - ر',
            svg: `<svg viewBox="0 0 120 150" width="90" height="110">
                <circle cx="60" cy="50" r="30" fill="#fed7aa"/>
                <path d="M 30 42 C 30 20, 90 20, 90 42 Z" fill="#1e293b"/>
                <circle cx="50" cy="48" r="5" fill="#1e1b4b"/><circle cx="70" cy="48" r="5" fill="#1e1b4b"/>
                <path d="M 52 64 Q 60 72 68 64" stroke="#1e1b4b" stroke-width="3" fill="none" stroke-linecap="round"/>
                <rect x="36" y="80" width="48" height="60" fill="#3b82f6" rx="8"/>
            </svg>`
        },
        qaddoori: {
            id: 'qaddoori',
            name: 'قَدُّورِي',
            phonics: 'وَزَّانٌ أَمِين',
            svg: `<svg viewBox="0 0 120 150" width="90" height="110">
                <circle cx="60" cy="55" r="30" fill="#fed7aa"/>
                <rect x="42" y="16" width="36" height="20" fill="#dc2626" rx="3"/>
                <rect x="36" y="34" width="48" height="6" fill="#1e1b4b" rx="2"/>
                <circle cx="50" cy="52" r="5" fill="#1e1b4b"/><circle cx="70" cy="52" r="5" fill="#1e1b4b"/>
                <path d="M 44 65 Q 60 70 76 65 Q 60 78 44 65 Z" fill="#475569"/>
                <rect x="30" y="85" width="60" height="58" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" rx="4"/>
                <path d="M 44 85 L 60 110 L 76 85" stroke="#ef4444" stroke-width="3" fill="none"/>
            </svg>`
        },
        basim: {
            id: 'basim',
            name: 'بَاسِم',
            phonics: 'بَـ - ا - سِ - م',
            svg: `<svg viewBox="0 0 120 150" width="90" height="110">
                <circle cx="60" cy="50" r="30" fill="#fed7aa"/>
                <path d="M 30 45 C 30 15, 90 15, 90 45 Z" fill="#b45309"/>
                <circle cx="50" cy="48" r="5" fill="#1e1b4b"/><circle cx="70" cy="48" r="5" fill="#1e1b4b"/>
                <path d="M 50 64 Q 60 74 70 64" stroke="#1e1b4b" stroke-width="3" fill="none" stroke-linecap="round"/>
                <rect x="34" y="80" width="52" height="60" fill="#10b981" rx="8"/>
            </svg>`
        },
        mazin: {
            id: 'mazin',
            name: 'مَازِن',
            phonics: 'مَـ - ا - زِ - ن',
            svg: `<svg viewBox="0 0 120 150" width="90" height="110">
                <circle cx="60" cy="50" r="30" fill="#fed7aa"/>
                <path d="M 30 42 C 40 18, 80 18, 90 42 Z" fill="#0f172a"/>
                <circle cx="50" cy="48" r="5" fill="#1e1b4b"/><circle cx="70" cy="48" r="5" fill="#1e1b4b"/>
                <path d="M 52 64 Q 60 72 68 64" stroke="#1e1b4b" stroke-width="3" fill="none" stroke-linecap="round"/>
                <rect x="36" y="80" width="48" height="60" fill="#f59e0b" rx="8"/>
            </svg>`
        },
        noor: {
            id: 'noor',
            name: 'نُور',
            phonics: 'نُـ - و - ر',
            svg: `<svg viewBox="0 0 120 150" width="90" height="110">
                <circle cx="60" cy="50" r="28" fill="#fed7aa"/>
                <path d="M 32 42 C 25 20, 95 20, 88 42 Z" fill="#451a03"/>
                <circle cx="50" cy="48" r="4.5" fill="#1e1b4b"/><circle cx="70" cy="48" r="4.5" fill="#1e1b4b"/>
                <path d="M 54 62 Q 60 68 66 62" stroke="#dc2626" stroke-width="2.5" fill="none" stroke-linecap="round"/>
                <polygon points="36,78 84,78 94,140 26,140" fill="#8b5cf6"/>
            </svg>`
        },
        duck: {
            id: 'duck',
            name: 'البَطَّة',
            phonics: 'بَـ - طَّ - ة',
            svg: `<svg viewBox="0 0 120 120" width="90" height="90">
                <ellipse cx="65" cy="70" rx="36" ry="26" fill="#facc15"/>
                <circle cx="40" cy="45" r="22" fill="#facc15"/>
                <polygon points="22,46 2,42 22,54" fill="#f97316"/>
                <circle cx="34" cy="40" r="4" fill="#1e1b4b"/>
                <circle cx="35" cy="38" r="1.5" fill="#ffffff"/>
                <path d="M 75 58 Q 95 62 88 78 Z" fill="#eab308"/>
            </svg>`
        },
        goose: {
            id: 'goose',
            name: 'الوِزَّة',
            phonics: 'وِ - زَّ - ة',
            svg: `<svg viewBox="0 0 120 120" width="90" height="90">
                <ellipse cx="65" cy="72" rx="38" ry="28" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
                <path d="M 40 75 Q 35 40 45 30" stroke="#f8fafc" stroke-width="16" fill="none" stroke-linecap="round"/>
                <circle cx="45" cy="28" r="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
                <polygon points="33,26 12,24 33,32" fill="#f97316"/>
                <circle cx="42" cy="24" r="3.5" fill="#1e1b4b"/>
            </svg>`
        },
        crow: {
            id: 'crow',
            name: 'الغُرَابُ الذَّكِيّ',
            phonics: 'غُـ - رَ - ا - ب',
            svg: `<svg viewBox="0 0 120 120" width="90" height="90">
                <ellipse cx="65" cy="65" rx="34" ry="24" fill="#1e293b"/>
                <circle cx="42" cy="44" r="18" fill="#1e293b"/>
                <polygon points="28,44 6,40 28,52" fill="#e2e8f0"/>
                <circle cx="38" cy="40" r="4" fill="#ffffff"/><circle cx="38" cy="40" r="2" fill="#1e1b4b"/>
                <path d="M 70 52 Q 95 60 85 75 Z" fill="#0f172a"/>
            </svg>`
        },
        bulbul: {
            id: 'bulbul',
            name: 'البُلْبُلُ المُغَرِّد',
            phonics: 'بُـ - لْـ - بُـ - ل',
            svg: `<svg viewBox="0 0 120 120" width="90" height="90">
                <ellipse cx="65" cy="65" rx="30" ry="20" fill="#b45309"/>
                <circle cx="44" cy="48" r="16" fill="#78350f"/>
                <polygon points="30,48 14,46 30,54" fill="#f59e0b"/>
                <circle cx="40" cy="44" r="3.5" fill="#ffffff"/><circle cx="40" cy="44" r="1.8" fill="#1e1b4b"/>
                <circle cx="72" cy="74" r="10" fill="#fde047"/>
            </svg>`
        },
        sheep: {
            id: 'sheep',
            name: 'الخَرُوف',
            phonics: 'خَـ - رُ - و - ف',
            svg: `<svg viewBox="0 0 120 120" width="90" height="90">
                <circle cx="65" cy="65" r="32" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="2"/>
                <circle cx="45" cy="50" r="15" fill="#f1f5f9"/>
                <circle cx="85" cy="50" r="15" fill="#f1f5f9"/>
                <circle cx="65" cy="38" r="15" fill="#f1f5f9"/>
                <circle cx="35" cy="60" r="16" fill="#fed7aa"/>
                <circle cx="30" cy="56" r="3" fill="#1e1b4b"/>
                <ellipse cx="28" cy="48" rx="8" ry="4" fill="#f43f5e" transform="rotate(-30 28 48)"/>
            </svg>`
        },
        puppy: {
            id: 'puppy',
            name: 'الكَلْبُ الوَفِيّ',
            phonics: 'كَـ - لْـ - ب',
            svg: `<svg viewBox="0 0 120 120" width="90" height="90">
                <circle cx="60" cy="55" r="28" fill="#b45309"/>
                <ellipse cx="36" cy="48" rx="10" ry="18" fill="#78350f"/>
                <ellipse cx="84" cy="48" rx="10" ry="18" fill="#78350f"/>
                <circle cx="50" cy="52" r="4.5" fill="#ffffff"/><circle cx="50" cy="52" r="2.5" fill="#1e1b4b"/>
                <circle cx="70" cy="52" r="4.5" fill="#ffffff"/><circle cx="70" cy="52" r="2.5" fill="#1e1b4b"/>
                <ellipse cx="60" cy="64" rx="6" ry="4" fill="#1e1b4b"/>
            </svg>`
        }
    };

    // ==========================================================================
    // 3. بنك الأدوات والعناصر المصورة (Props) SVG
    // ==========================================================================
    const PROPS_DATA = {
        book: {
            id: 'book',
            name: 'كِتَابُ قِرَاءَتِي',
            svg: `<svg viewBox="0 0 100 100" width="70" height="70"><path d="M 20 25 Q 50 35 50 75 Q 20 65 20 25 Z" fill="#3b82f6"/><path d="M 80 25 Q 50 35 50 75 Q 80 65 80 25 Z" fill="#60a5fa"/><rect x="47" y="30" width="6" height="45" fill="#1e40af"/><text x="50" y="55" font-size="10" font-weight="900" fill="#ffffff" text-anchor="middle">قِرَاءَتِي</text></svg>`
        },
        scale: {
            id: 'scale',
            name: 'مِيزَانُ قَدُّورِي',
            svg: `<svg viewBox="0 0 100 100" width="70" height="70"><rect x="47" y="15" width="6" height="65" fill="#475569"/><rect x="30" y="80" width="40" height="10" fill="#334155" rx="3"/><line x1="20" y1="25" x2="80" y2="25" stroke="#f59e0b" stroke-width="4"/><line x1="25" y1="25" x2="15" y2="55" stroke="#94a3b8" stroke-width="2"/><line x1="25" y1="25" x2="35" y2="55" stroke="#94a3b8" stroke-width="2"/><path d="M 12 55 Q 25 70 38 55 Z" fill="#eab308"/><line x1="75" y1="25" x2="65" y2="55" stroke="#94a3b8" stroke-width="2"/><line x1="75" y1="25" x2="85" y2="55" stroke="#94a3b8" stroke-width="2"/><path d="M 62 55 Q 75 70 88 55 Z" fill="#eab308"/></svg>`
        },
        horn: {
            id: 'horn',
            name: 'بُوقُ مَازِن',
            svg: `<svg viewBox="0 0 100 100" width="70" height="70"><path d="M 20 55 L 60 55 L 85 30 L 85 80 L 60 55 Z" fill="#f59e0b" stroke="#b45309" stroke-width="3"/><ellipse cx="85" cy="55" rx="5" ry="25" fill="#fde047" stroke="#b45309" stroke-width="2"/></svg>`
        },
        boat: {
            id: 'boat',
            name: 'زَوْرَقُ بَاسِم',
            svg: `<svg viewBox="0 0 100 100" width="70" height="70"><path d="M 10 50 Q 50 85 90 50 L 75 50 Q 50 75 25 50 Z" fill="#78350f"/><polygon points="50,15 50,48 80,48" fill="#ef4444"/><rect x="48" y="15" width="4" height="35" fill="#1e1b4b"/></svg>`
        },
        iraq_flag: {
            id: 'iraq_flag',
            name: 'عَلَمُ العِرَاق',
            svg: `<svg viewBox="0 0 100 100" width="70" height="70"><rect x="15" y="20" width="5" height="70" fill="#475569"/><rect x="20" y="20" width="65" height="14" fill="#ef4444"/><rect x="20" y="34" width="65" height="14" fill="#ffffff"/><rect x="20" y="48" width="65" height="14" fill="#1e1b4b"/><text x="52" y="45" font-size="9" font-weight="900" fill="#16a34a" text-anchor="middle">الله أكبر</text></svg>`
        },
        palm_tree: {
            id: 'palm_tree',
            name: 'نَخْلَةٌ عِرَاقِيَّة',
            svg: `<svg viewBox="0 0 100 100" width="70" height="70"><path d="M 45 95 Q 50 60 52 35 Q 56 60 55 95 Z" fill="#78350f"/><path d="M 52 35 C 20 10, 5 30, 10 45" stroke="#16a34a" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M 52 35 C 80 10, 95 30, 90 45" stroke="#16a34a" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M 52 35 C 45 5, 55 5, 52 35" stroke="#15803d" stroke-width="6" fill="none"/></svg>`
        },
        flower: {
            id: 'flower',
            name: 'وَرْدَةٌ حَمْرَاء',
            svg: `<svg viewBox="0 0 100 100" width="70" height="70"><circle cx="50" cy="50" r="12" fill="#facc15"/><circle cx="50" cy="30" r="12" fill="#ef4444"/><circle cx="50" cy="70" r="12" fill="#ef4444"/><circle cx="30" cy="50" r="12" fill="#ef4444"/><circle cx="70" cy="50" r="12" fill="#ef4444"/><path d="M 50 62 L 50 95" stroke="#16a34a" stroke-width="4"/></svg>`
        },
        apple: {
            id: 'apple',
            name: 'تُفَّاحَةٌ حَمْرَاء',
            svg: `<svg viewBox="0 0 100 100" width="70" height="70"><circle cx="43" cy="55" r="22" fill="#ef4444"/><circle cx="57" cy="55" r="22" fill="#ef4444"/><path d="M 50 35 Q 55 20 62 25" stroke="#78350f" stroke-width="3" fill="none"/><ellipse cx="65" cy="28" rx="6" ry="3" fill="#22c55e" transform="rotate(-30 65 28)"/></svg>`
        },
        basket: {
            id: 'basket',
            name: 'سَلَّةُ الزَّبِيب',
            svg: `<svg viewBox="0 0 100 100" width="70" height="70"><path d="M 20 45 L 80 45 L 70 85 L 30 85 Z" fill="#d97706" stroke="#92400e" stroke-width="3"/><path d="M 30 45 C 30 15, 70 15, 70 45" stroke="#b45309" stroke-width="4" fill="none"/><circle cx="40" cy="40" r="6" fill="#831843"/><circle cx="50" cy="36" r="6" fill="#831843"/><circle cx="60" cy="40" r="6" fill="#831843"/></svg>`
        },
        pitcher: {
            id: 'pitcher',
            name: 'جَرَّةُ المَاء (الغُرَاب)',
            svg: `<svg viewBox="0 0 100 100" width="70" height="70"><path d="M 38 20 L 62 20 L 58 35 Q 80 55 70 85 L 30 85 Q 20 55 42 35 Z" fill="#b45309" stroke="#78350f" stroke-width="3"/><ellipse cx="50" cy="75" rx="16" ry="6" fill="#38bdf8"/></svg>`
        },
        ball: {
            id: 'ball',
            name: 'كُرَةُ اللَّعِب',
            svg: `<svg viewBox="0 0 100 100" width="70" height="70"><circle cx="50" cy="50" r="28" fill="#ffffff" stroke="#1e1b4b" stroke-width="3"/><polygon points="50,38 60,45 56,58 44,58 40,45" fill="#1e1b4b"/></svg>`
        },
        sun: {
            id: 'sun',
            name: 'شَمْسٌ مُشْرِقَة',
            svg: `<svg viewBox="0 0 100 100" width="70" height="70"><circle cx="50" cy="50" r="22" fill="#facc15"/><line x1="50" y1="12" x2="50" y2="22" stroke="#f59e0b" stroke-width="4"/><line x1="50" y1="78" x2="50" y2="88" stroke="#f59e0b" stroke-width="4"/><line x1="12" y1="50" x2="22" y2="50" stroke="#f59e0b" stroke-width="4"/><line x1="78" y1="50" x2="88" y2="50" stroke="#f59e0b" stroke-width="4"/></svg>`
        }
    };

    // ==========================================================================
    // 4. بنك الكلمات والجمل الفونيمية المنهجية المشكولة
    // ==========================================================================
    const PHONICS_WORDS = {
        dada: ['دَادَا', 'دَار', 'دُور', 'بَاب', 'بَابَا', 'مَامَا', 'نَمِير', 'نَامَ'],
        qaddoori: ['مِيزَان', 'قَدُّورِي', 'وَزَّان', 'وَزَنَ', 'زَبِيب', 'نَادِر', 'بَزَّاز', 'مَازِن'],
        countryside: ['بَقَر', 'بَاسِم', 'رَبَاب', 'بَدْرِي', 'رِيف', 'زَوْرَق', 'يَسْبَح', 'بَطّ', 'وِزّ'],
        adventure: ['مَطَر', 'نَازِل', 'الوَلَد', 'الشَّمْس', 'غُرَاب', 'عَطْشَان', 'جَرَّة', 'مَاء', 'حَصَى'],
        sentences: [
            'دَادَا نَامَ',
            'دَارُ نُور كَبِير',
            'قَدُّورِي وَزَّانٌ أَمِين',
            'فَصِيحٌ صَدِيقِي الذَّكِيّ',
            'أَنَا أُحِبُّ مَدْرَسَتِي',
            'البَطُّ يَسْبَحُ فِي الشَّطّ',
            'مَطَرٌ مَطَرٌ يَنْزِلُ خَفِيفاً'
        ]
    };

    // ملصقات المؤثرات الصوتية البصرية الكوميدية
    const SFX_STICKERS = [
        'طَاخْ!', 'بَامْ!', 'زُوومْ!', 'وَاوْ!', 'هَيْ!',
        'يَايْ!', 'تِيكْ تَاكْ!', 'صَفِيقٌ!', 'تُوتْ تُوتْ!', 'طَقْ طَقْ!'
    ];

    // ==========================================================================
    // 5. مكتبة القصص الفونيمية الكوميدية الجاهزة
    // ==========================================================================
    const STORYBOOKS = [
        {
            id: 'faseeh_dada',
            title: 'مُغَامَرَةُ فَصِيح فِي دَارِ دَادَا',
            unit: 'الوَحْدَةُ الأُولَى: دَار دَادَا',
            icon: '✏️',
            layout: 4,
            desc: 'فصيح القلم الذكي يزور دار دادا ويتعلم معه قراءة الكلمات الأولى ببهجة.',
            panels: [
                {
                    bg: 'school_yard',
                    items: [
                        { type: 'char', id: 'faseeh', x: 28, y: 35, scale: 1.1, flip: false },
                        { type: 'prop', id: 'iraq_flag', x: 75, y: 25, scale: 0.9, flip: false }
                    ],
                    bubbles: [
                        { type: 'speech', text: 'أَهْلاً بِكُمْ! أَنَا فَصِيح، سَأَزُورُ دَارَ دَادَا!', x: 20, y: 10 }
                    ],
                    sfx: [{ text: 'طَقْ طَقْ!', x: 70, y: 15 }]
                },
                {
                    bg: 'home_living',
                    items: [
                        { type: 'char', id: 'dada', x: 30, y: 40, scale: 1.0, flip: false },
                        { type: 'char', id: 'faseeh', x: 70, y: 35, scale: 1.0, flip: true }
                    ],
                    bubbles: [
                        { type: 'speech', text: 'دَادَا .. دَار .. بَاب!', x: 30, y: 12 }
                    ],
                    sfx: [{ text: 'وَاوْ!', x: 75, y: 15 }]
                },
                {
                    bg: 'home_living',
                    items: [
                        { type: 'char', id: 'rabab', x: 25, y: 35, scale: 1.0, flip: false },
                        { type: 'char', id: 'faseeh', x: 65, y: 35, scale: 1.0, flip: true },
                        { type: 'prop', id: 'book', x: 45, y: 55, scale: 0.8, flip: false }
                    ],
                    bubbles: [
                        { type: 'speech', text: 'رَبَابُ تَقْرَأُ مَعَ دَادَا فِي الكِتَابِ!', x: 25, y: 10 }
                    ],
                    sfx: [{ text: 'يَايْ!', x: 70, y: 15 }]
                },
                {
                    bg: 'fun_park',
                    items: [
                        { type: 'char', id: 'faseeh', x: 45, y: 30, scale: 1.2, flip: false },
                        { type: 'prop', id: 'ball', x: 78, y: 60, scale: 0.8, flip: false }
                    ],
                    bubbles: [
                        { type: 'shout', text: 'نَحْنُ نُحِبُّ القِرَاءَةَ يَا أَصْدِقَائِي!', x: 25, y: 8 }
                    ],
                    sfx: [{ text: 'صَفِيقٌ!', x: 70, y: 20 }]
                }
            ]
        },
        {
            id: 'qaddoori_scale',
            title: 'مِيزَانُ قَدُّورِي وَسَلَّةُ الزَّبِيب',
            unit: 'الوَحْدَةُ الثَّالِثَة: مِيزَانُ قَدُّورِي',
            icon: '⚖️',
            layout: 3,
            desc: 'مازن يزور دكان قدوري ليزن الزبيب بالميزان العادل الأمين.',
            panels: [
                {
                    bg: 'fruit_market',
                    items: [
                        { type: 'char', id: 'mazin', x: 25, y: 35, scale: 1.0, flip: false },
                        { type: 'char', id: 'qaddoori', x: 70, y: 35, scale: 1.0, flip: true },
                        { type: 'prop', id: 'scale', x: 48, y: 40, scale: 0.9, flip: false }
                    ],
                    bubbles: [
                        { type: 'speech', text: 'مَرْحَباً عَمِّي قَدُّورِي الوَزَّان!', x: 20, y: 10 }
                    ],
                    sfx: [{ text: 'هَيْ!', x: 75, y: 15 }]
                },
                {
                    bg: 'fruit_market',
                    items: [
                        { type: 'char', id: 'qaddoori', x: 65, y: 35, scale: 1.0, flip: true },
                        { type: 'prop', id: 'basket', x: 35, y: 45, scale: 1.1, flip: false }
                    ],
                    bubbles: [
                        { type: 'speech', text: 'قَدُّورِي وَزَنَ زَبِيبَ مَازِن بِعَدْلٍ!', x: 25, y: 10 }
                    ],
                    sfx: [{ text: 'تِيكْ تَاكْ!', x: 65, y: 15 }]
                },
                {
                    bg: 'fruit_market',
                    items: [
                        { type: 'char', id: 'mazin', x: 30, y: 35, scale: 1.0, flip: false },
                        { type: 'char', id: 'faseeh', x: 70, y: 35, scale: 1.0, flip: true },
                        { type: 'prop', id: 'apple', x: 50, y: 55, scale: 0.8, flip: false }
                    ],
                    bubbles: [
                        { type: 'shout', text: 'شُكْراً يَا قَدُّورِي، أَنْتَ وَزَّانٌ أَمِين!', x: 20, y: 10 }
                    ],
                    sfx: [{ text: 'بَامْ!', x: 75, y: 20 }]
                }
            ]
        },
        {
            id: 'basim_countryside',
            title: 'يَوْمٌ سَعِيدٌ فِي رِيفِ بَاسِم',
            unit: 'الوَحْدَةُ الرَّابِعَة: رِيفُ بَاسِم',
            icon: '🛶',
            layout: 3,
            desc: 'باسم يركب الزورق في النهر، ويشاهد البطة والوزة في الريف الجميل.',
            panels: [
                {
                    bg: 'river_bank',
                    items: [
                        { type: 'char', id: 'basim', x: 35, y: 30, scale: 1.0, flip: false },
                        { type: 'prop', id: 'boat', x: 45, y: 50, scale: 1.2, flip: false }
                    ],
                    bubbles: [
                        { type: 'speech', text: 'رِيفُ بَاسِم جَمِيلٌ فِيهِ زَوْرَقٌ وَنَهْر!', x: 20, y: 10 }
                    ],
                    sfx: [{ text: 'زُوومْ!', x: 70, y: 15 }]
                },
                {
                    bg: 'river_bank',
                    items: [
                        { type: 'char', id: 'duck', x: 25, y: 45, scale: 1.1, flip: false },
                        { type: 'char', id: 'goose', x: 65, y: 40, scale: 1.1, flip: true }
                    ],
                    bubbles: [
                        { type: 'speech', text: 'البَطُّ وَالوِزُّ يَسْبَحُ فِي الشَّطِّ!', x: 25, y: 10 }
                    ],
                    sfx: [{ text: 'طَاخْ!', x: 70, y: 20 }]
                },
                {
                    bg: 'palm_orchard',
                    items: [
                        { type: 'char', id: 'basim', x: 30, y: 35, scale: 1.0, flip: false },
                        { type: 'char', id: 'sheep', x: 70, y: 40, scale: 1.0, flip: true },
                        { type: 'prop', id: 'palm_tree', x: 50, y: 25, scale: 1.0, flip: false }
                    ],
                    bubbles: [
                        { type: 'shout', text: 'فِي رِيفِ بَاسِم بَقَرٌ وَنَخِيلٌ كَثِير!', x: 20, y: 10 }
                    ],
                    sfx: [{ text: 'وَاوْ!', x: 75, y: 15 }]
                }
            ]
        },
        {
            id: 'mazin_horn',
            title: 'بُوقُ مَازِن وَقِطَارُ الحُرُوف',
            unit: 'الوَحْدَةُ الثَّانِيَة: بُوقُ مَازِن',
            icon: '🎺',
            layout: 3,
            desc: 'مازن ينفخ في بوقه القديم ليعلن انطلاق رحلة قطار الحروف الفونيمية.',
            panels: [
                {
                    bg: 'school_yard',
                    items: [
                        { type: 'char', id: 'mazin', x: 30, y: 35, scale: 1.0, flip: false },
                        { type: 'prop', id: 'horn', x: 55, y: 45, scale: 1.0, flip: false }
                    ],
                    bubbles: [
                        { type: 'shout', text: 'بُوقُ مَازِن يَعْزِفُ: تُوتْ تُوتْ!', x: 25, y: 10 }
                    ],
                    sfx: [{ text: 'تُوتْ تُوتْ!', x: 70, y: 15 }]
                },
                {
                    bg: 'fun_park',
                    items: [
                        { type: 'char', id: 'bulbul', x: 25, y: 40, scale: 1.0, flip: false },
                        { type: 'char', id: 'faseeh', x: 65, y: 35, scale: 1.1, flip: true }
                    ],
                    bubbles: [
                        { type: 'speech', text: 'البُلْبُلُ يُغَرِّدُ مَعَ بُوقِ مَازِن!', x: 25, y: 10 }
                    ],
                    sfx: [{ text: 'هَيْ!', x: 70, y: 15 }]
                },
                {
                    bg: 'fun_park',
                    items: [
                        { type: 'char', id: 'dada', x: 20, y: 40, scale: 1.0, flip: false },
                        { type: 'char', id: 'rabab', x: 50, y: 35, scale: 1.0, flip: false },
                        { type: 'char', id: 'mazin', x: 80, y: 35, scale: 1.0, flip: true }
                    ],
                    bubbles: [
                        { type: 'shout', text: 'قِطَارُ الحُرُوفِ انْطَلَقَ بِنَجَاح!', x: 25, y: 10 }
                    ],
                    sfx: [{ text: 'صَفِيقٌ!', x: 75, y: 15 }]
                }
            ]
        },
        {
            id: 'clever_crow',
            title: 'ذَكَاءُ الغُرَابِ الصَّغِير',
            unit: 'الوَحْدَةُ السَّادِسَة: الغُرَابُ الذَّكِيّ',
            icon: '🐦',
            layout: 4,
            desc: 'قصة الغراب العطشان الذي فكر واستخدم الحصى الصغير حتى ارتفع الماء وارتوى.',
            panels: [
                {
                    bg: 'palm_orchard',
                    items: [
                        { type: 'char', id: 'crow', x: 30, y: 35, scale: 1.1, flip: false },
                        { type: 'prop', id: 'sun', x: 75, y: 20, scale: 1.0, flip: false }
                    ],
                    bubbles: [
                        { type: 'thought', text: 'أَنَا عَطْشَانٌ جِدّاً .. أَيْنَ المَاء؟', x: 20, y: 10 }
                    ],
                    sfx: [{ text: 'طَاخْ!', x: 70, y: 15 }]
                },
                {
                    bg: 'palm_orchard',
                    items: [
                        { type: 'char', id: 'crow', x: 25, y: 35, scale: 1.1, flip: false },
                        { type: 'prop', id: 'pitcher', x: 65, y: 45, scale: 1.2, flip: false }
                    ],
                    bubbles: [
                        { type: 'speech', text: 'وَجَدْتُ جَرَّةً فِيهَا مَاءٌ قَلِيل!', x: 20, y: 10 }
                    ],
                    sfx: [{ text: 'وَاوْ!', x: 70, y: 15 }]
                },
                {
                    bg: 'palm_orchard',
                    items: [
                        { type: 'char', id: 'crow', x: 35, y: 30, scale: 1.1, flip: false },
                        { type: 'prop', id: 'pitcher', x: 65, y: 45, scale: 1.2, flip: false }
                    ],
                    bubbles: [
                        { type: 'thought', text: 'سَأَجْمَعُ الحَصَى الصَّغِيرَ وَأَرْمِيهِ فِي الجَرَّة!', x: 15, y: 10 }
                    ],
                    sfx: [{ text: 'طَقْ طَقْ!', x: 75, y: 15 }]
                },
                {
                    bg: 'palm_orchard',
                    items: [
                        { type: 'char', id: 'crow', x: 45, y: 30, scale: 1.2, flip: false },
                        { type: 'char', id: 'faseeh', x: 80, y: 35, scale: 1.0, flip: true }
                    ],
                    bubbles: [
                        { type: 'shout', text: 'ارْتَفَعَ المَاءِ وَشَرِبَ الغُرَابُ الذَّكِيّ!', x: 20, y: 10 }
                    ],
                    sfx: [{ text: 'يَايْ!', x: 75, y: 15 }]
                }
            ]
        }
    ];

    // ==========================================================================
    // 6. بنك تحديات إكمال القصة المصورة (Story Completion Challenges)
    // ==========================================================================
    const CHALLENGES_DATA = [
        {
            id: 'ch_mazin_horn',
            title: 'تَحَدِّي: صَوْتُ بُوقِ مَازِن',
            desc: 'مازن يحمل بوقه في باحة المدرسة، كيف تنتهي القصة بصوت البوق المبهج؟',
            panel1: { bg: 'school_yard', caption: '١. مَازِنُ حَمَلَ بُوقَهُ فِي الصَّفِّ.' },
            panel2: { bg: 'school_yard', caption: '٢. اسْتَعَدَّ مَازِنُ لِيَعْزِفَ نَغْمَةَ الحُرُوف.' },
            mysteryPrompt: 'اخْتَرِ النِّهَايَةَ الفُونِيمِيَّةَ السَّلِيمَةَ لِلَّوْحَةِ الثَّالِثَة:',
            options: [
                {
                    text: 'عَزَفَ مَازِن: تُوتْ تُوتْ!',
                    icon: '🎺',
                    isCorrect: true,
                    fullCaption: '٣. عَزَفَ مَازِنُ بِالبُوقِ: تُوتْ تُوتْ وَفَرِحَ التَّلَامِيذ!'
                },
                {
                    text: 'نَامَ مَازِنُ تَحْتَ الشَّجَرَةِ',
                    icon: '😴',
                    isCorrect: false
                },
                {
                    text: 'كَسَرَ مَازِنُ البُوقَ فِي النَّهْرِ',
                    icon: '💔',
                    isCorrect: false
                }
            ]
        },
        {
            id: 'ch_crow_water',
            title: 'تَحَدِّي: حِيلَةُ الغُرَابِ الذَّكِيّ',
            desc: 'الغراب العطشان وجد الجرة وفيها ماء قليل، ما هو التصرف الذكي الذي قام به؟',
            panel1: { bg: 'palm_orchard', caption: '١. غُرَابٌ عَطْشَانُ يَبْحَثُ عَنِ المَاء.' },
            panel2: { bg: 'palm_orchard', caption: '٢. وَجَدَ جَرَّةً فِيهَا مَاءٌ قَلِيلٌ لَا يَصِلُهُ.' },
            mysteryPrompt: 'مَاذَا فَعَلَ الغُرَابُ الذَّكِيُّ لِيَشْرَب؟',
            options: [
                {
                    text: 'رَمَى حَصَى صَغِيراً فِي الجَرَّة',
                    icon: '🪨',
                    isCorrect: true,
                    fullCaption: '٣. رَمَى الغُرَابُ الحَصَى فَارْتَفَعَ المَاءُ وَشَرِب!'
                },
                {
                    text: 'بَكَى الغُرَابُ وَغَادَرَ حَزِيناً',
                    icon: '😢',
                    isCorrect: false
                },
                {
                    text: 'كَسَرَ الجَرَّةَ بِالحَجَرِ الكَبِير',
                    icon: '💥',
                    isCorrect: false
                }
            ]
        },
        {
            id: 'ch_qaddoori_scale',
            title: 'تَحَدِّي: مِيزَانُ قَدُّورِي وَالزَّبِيب',
            desc: 'طلب مازن من قدوري أن يزن له الزبيب، كيف انتهى المشهد؟',
            panel1: { bg: 'fruit_market', caption: '١. مَازِنُ دَخَلَ دُكَّانَ قَدُّورِي.' },
            panel2: { bg: 'fruit_market', caption: '٢. طَلَبَ مَازِنُ سَلَّةً مِنَ الزَّبِيبِ اللَّذِيذ.' },
            mysteryPrompt: 'كَيْفَ أَتَمَّ قَدُّورِي عَمَلِيَّةَ الوَزْن؟',
            options: [
                {
                    text: 'وَزَنَ قَدُّورِي الزَّبِيبَ بِأَمَانَة',
                    icon: '⚖️',
                    isCorrect: true,
                    fullCaption: '٣. قَدُّورِي وَزَّانٌ أَمِينٌ وَزَنَ الزَّبِيبَ بِمِيزَانِهِ الدَّقِيق!'
                },
                {
                    text: 'أَكَلَ قَدُّورِي كُلَّ الزَّبِيب',
                    icon: '😋',
                    isCorrect: false
                },
                {
                    text: 'رَمَى قَدُّورِي المِيزَانَ خَارِجاً',
                    icon: '🗑️',
                    isCorrect: false
                }
            ]
        }
    ];

    // ==========================================================================
    // 7. محرك الصوت السردي الكوميدي عبر Web Audio API
    // ==========================================================================
    let audioCtx = null;

    function initAudio() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                audioCtx = new AudioContext();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function playPop() {
        initAudio();
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const now = audioCtx.currentTime;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(850, now + 0.08);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
    }

    function playPageFlip() {
        initAudio();
        if (!audioCtx) return;
        const now = audioCtx.currentTime;
        const bufferSize = audioCtx.sampleRate * 0.12;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1200, now);
        filter.Q.setValueAtTime(1.5, now);

        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);
        noise.start(now);
    }

    function playSlideWhistle() {
        initAudio();
        if (!audioCtx) return;
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.25);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.26);
    }

    function playMagicChime() {
        initAudio();
        if (!audioCtx) return;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
            const now = audioCtx.currentTime + idx * 0.07;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.45);
        });
    }

    function playComicDrum() {
        initAudio();
        if (!audioCtx) return;
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);

        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.16);
    }

    function playCheer() {
        initAudio();
        playMagicChime();
        setTimeout(playComicDrum, 250);
    }

    // خريطة الصوتيات الجاهزة بصوت الأستاذ باسل لفقاعات وقصص وتحديات الاستوديو
    const STORY_STUDIO_AUDIO_MAP = {
        'اهلا بكم انا فصيح سازور دار دادا': 'ss_faseeh_dada_p1',
        'دادا دار باب': 'ss_faseeh_dada_p2',
        'رباب تقرا مع دادا في الكتاب': 'ss_faseeh_dada_p3',
        'نحن نحب القراءة يا اصدقائي': 'ss_faseeh_dada_p4',
        'مرحبا عمي قدوري الوزان': 'ss_qaddoori_scale_p1',
        'قدوري وزن زبيب مازن بعدل': 'ss_qaddoori_scale_p2',
        'شكرا يا قدوري انت وزان امين': 'ss_qaddoori_scale_p3',
        'ريف باسم جميل فيه زورق ونهر': 'ss_basim_countryside_p1',
        'البط والوز يسبح في الشط': 'ss_basim_countryside_p2',
        'في ريف باسم بقر ونخيل كثير': 'ss_basim_countryside_p3',
        'بوق مازن يعزف توت توت': 'ss_mazin_horn_p1',
        'البلبل يغرد مع بوق مازن': 'ss_mazin_horn_p2',
        'قطار الحروف انطلق بنجاح': 'ss_mazin_horn_p3',
        'انا عطشان جدا اين الماء': 'ss_clever_crow_p1',
        'وجدت جرة فيها ماء قليل': 'ss_clever_crow_p2',
        'ساجمع الحصى الصغير وارميه في الجرة': 'ss_clever_crow_p3',
        'ارتفع الماء وشرب الغراب الذكي': 'ss_clever_crow_p4',
        'اهلا بكم في قصتي': 'ss_default_story_p1',
        'دادا في الريف الجميل': 'ss_default_story_p2',
        'نحن نحب مدرستنا': 'ss_default_story_p3',
        'مازن يحمل بوقه في باحة المدرسة كيف تنتهي القصة بصوت البوق المبهج': 'ss_ch_mazin_horn_prompt',
        'عزف مازن بالبوق توت توت وفرح التلاميذ': 'ss_ch_mazin_horn_win',
        'الغراب العطشان وجد الجرة وفيها ماء قليل ما هو التصرف الذكي الذي قام به': 'ss_ch_crow_water_prompt',
        'رمى الغراب الحصى فارتفع الماء وشرب': 'ss_ch_crow_water_win',
        'طلب مازن من قدوري ان يزن له الزبيب كيف انتهى المشهد': 'ss_ch_qaddoori_scale_prompt',
        'قدوري وزان امين وزن الزبيب بميزانه الدقيق': 'ss_ch_qaddoori_scale_win'
    };

    function normalizeStoryAudioText(raw) {
        if (window.FaseehVoice && typeof window.FaseehVoice.normalizeArabicForAudio === 'function') {
            return window.FaseehVoice.normalizeArabicForAudio(raw);
        }
        return String(raw || '')
            .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
            .replace(/[أإآٱ]/g, 'ا')
            .replace(/[^\u0621-\u064A0-9\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    // نطق الكلمات والجمل الفونيمية صوتياً بصوت الأستاذ باسل المعتمد
    function speakPhonicsText(text, onEnded) {
        const norm = normalizeStoryAudioText(text);
        const mappedKey = STORY_STUDIO_AUDIO_MAP[norm];
        if (mappedKey && typeof window.playAudio === 'function') {
            window.playAudio(mappedKey, onEnded);
            return;
        }
        if (window.FaseehVoice && typeof window.FaseehVoice.speak === 'function') {
            window.FaseehVoice.speak(text, { rate: 0.88, keepBubble: true, onEnded });
        } else if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(text);
            u.lang = 'ar-SA';
            u.rate = 0.85;
            u.pitch = 1.05;
            if (typeof onEnded === 'function') {
                u.onend = onEnded;
                u.onerror = onEnded;
            }
            window.speechSynthesis.speak(u);
        } else if (typeof onEnded === 'function') {
            onEnded();
        }
    }

    let _libraryPlayToken = 0;
    let _libraryPlayTimer = null;
    function stopLibraryStoryPlayback() {
        _libraryPlayToken++;
        if (_libraryPlayTimer) {
            clearTimeout(_libraryPlayTimer);
            _libraryPlayTimer = null;
        }
    }

    // ==========================================================================
    // 8. حالة الاستوديو وإدارة البيانات (State Management)
    // ==========================================================================
    const state = {
        activeTab: 'creator',          // creator, library, challenge, export
        activeLayout: 3,               // 2, 3, 4 panels
        activePanelIdx: 0,             // 0-based
        activeSidebarSubtab: 'chars',  // chars, props, bubbles, words, sfx, bgs
        selectedItem: null,            // { type, idx }
        isFullscreen: false,

        // بيانات القصة الحالية في المحرر
        currentStory: {
            title: 'قِصَّتِي المُصَوَّرَةُ الجَدِيدَة',
            layout: 3,
            panels: [
                {
                    bg: 'home_living',
                    items: [
                        { type: 'char', id: 'faseeh', x: 30, y: 35, scale: 1.0, flip: false }
                    ],
                    bubbles: [
                        { type: 'speech', text: 'أَهْلاً بِكُمْ فِي قِصَّتِي!', x: 25, y: 10 }
                    ],
                    sfx: []
                },
                {
                    bg: 'palm_orchard',
                    items: [
                        { type: 'char', id: 'dada', x: 35, y: 38, scale: 1.0, flip: false },
                        { type: 'prop', id: 'flower', x: 65, y: 55, scale: 0.9, flip: false }
                    ],
                    bubbles: [
                        { type: 'speech', text: 'دَادَا فِي الرِّيفِ الجَمِيل!', x: 25, y: 10 }
                    ],
                    sfx: [{ text: 'وَاوْ!', x: 70, y: 15 }]
                },
                {
                    bg: 'school_yard',
                    items: [
                        { type: 'char', id: 'faseeh', x: 35, y: 30, scale: 1.1, flip: false },
                        { type: 'char', id: 'rabab', x: 65, y: 35, scale: 1.0, flip: true }
                    ],
                    bubbles: [
                        { type: 'shout', text: 'نَحْنُ نُحِبُّ مَدْرَسَتَنَا!', x: 25, y: 10 }
                    ],
                    sfx: [{ text: 'صَفِيقٌ!', x: 70, y: 15 }]
                }
            ]
        },

        // القصة المحددة في المكتبة
        selectedLibraryStory: STORYBOOKS[0],
        libraryReaderPlaying: false,

        // التحدي النشط
        activeChallengeIdx: 0,
        challengeAnswered: false,
        challengeStars: 0
    };

    // ==========================================================================
    // 9. وظائف المحرك البرمجي (Core Engine Methods)
    // ==========================================================================
    function loadSavedStories() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY_SAVED);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    function saveStoryToStorage(story) {
        try {
            const stories = loadSavedStories();
            const newStory = {
                id: 'story_' + Date.now(),
                title: story.title || 'قِصَّةٌ مُصَوَّرَة',
                date: new Date().toLocaleDateString('ar-IQ'),
                layout: story.layout,
                panels: JSON.parse(JSON.stringify(story.panels))
            };
            stories.unshift(newStory);
            localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(stories));
            renderSavedGallery();
            return newStory;
        } catch (e) {
            console.error('Error saving story', e);
        }
    }

    // ==========================================================================
    // 10. العرض والرسم (Rendering Viewports)
    // ==========================================================================
    function renderCreatorStage() {
        const canvas = document.getElementById('ssComicPageCanvas');
        if (!canvas) return;

        canvas.className = `ss-comic-page-canvas layout-${state.activeLayout}`;
        canvas.innerHTML = '';

        for (let i = 0; i < state.activeLayout; i++) {
            const panelData = state.currentStory.panels[i] || {
                bg: 'school_yard',
                items: [],
                bubbles: [],
                sfx: []
            };

            const panelEl = document.createElement('div');
            panelEl.className = `ss-comic-panel ${i === state.activePanelIdx ? 'active-editing' : ''}`;
            panelEl.dataset.panelIdx = i;

            // شارة رقم اللوحة
            const badge = document.createElement('div');
            badge.className = 'ss-panel-badge';
            badge.textContent = `المَشْهَدُ ${i + 1}`;
            panelEl.appendChild(badge);

            // طبقة الخلفية
            const bgLayer = document.createElement('div');
            bgLayer.className = 'ss-panel-bg-layer';
            const bgConfig = SCENE_BACKGROUNDS[panelData.bg] || SCENE_BACKGROUNDS.school_yard;
            bgLayer.style.background = bgConfig.style;
            bgLayer.innerHTML = bgConfig.elements;
            panelEl.appendChild(bgLayer);

            // طبقة الملصقات
            const stickersLayer = document.createElement('div');
            stickersLayer.className = 'ss-panel-stickers-layer';

            // رسم الكائنات والشخصيات
            (panelData.items || []).forEach((item, itemIdx) => {
                const itemEl = document.createElement('div');
                itemEl.className = `ss-placed-item ${state.selectedItem && state.selectedItem.panelIdx === i && state.selectedItem.idx === itemIdx && state.selectedItem.type === 'item' ? 'selected' : ''}`;
                itemEl.style.left = `${item.x}%`;
                itemEl.style.top = `${item.y}%`;
                itemEl.style.transform = `scale(${item.scale || 1}) ${item.flip ? 'scaleX(-1)' : ''}`;

                if (item.type === 'char') {
                    const charObj = CHARACTERS_DATA[item.id];
                    if (charObj) itemEl.innerHTML = charObj.svg;
                } else if (item.type === 'prop') {
                    const propObj = PROPS_DATA[item.id];
                    if (propObj) itemEl.innerHTML = propObj.svg;
                }

                // مقابض التحكم بالعنصر
                const handleBar = document.createElement('div');
                handleBar.className = 'ss-item-handle-bar';
                handleBar.innerHTML = `
                    <button class="ss-handle-btn" onclick="StoryStudio.scaleItem(${i}, ${itemIdx}, 0.1)" title="تكبير">+</button>
                    <button class="ss-handle-btn" onclick="StoryStudio.scaleItem(${i}, ${itemIdx}, -0.1)" title="تصغير">-</button>
                    <button class="ss-handle-btn" onclick="StoryStudio.flipItem(${i}, ${itemIdx})" title="انعكاس">↔</button>
                    <button class="ss-handle-btn delete" onclick="StoryStudio.deleteItem(${i}, ${itemIdx})" title="حذف">🗑️</button>
                `;
                itemEl.appendChild(handleBar);

                // أحداث السحب باللمس والماوس
                setupDraggable(itemEl, i, itemIdx, 'item');

                stickersLayer.appendChild(itemEl);
            });

            // رسم فقاعات الحوار
            (panelData.bubbles || []).forEach((bubble, bIdx) => {
                const bubbleEl = document.createElement('div');
                bubbleEl.className = `ss-placed-bubble ${bubble.type}`;
                bubbleEl.style.left = `${bubble.x}%`;
                bubbleEl.style.top = `${bubble.y}%`;

                const body = document.createElement('div');
                body.className = 'ss-bubble-body';
                body.contentEditable = 'true';
                body.textContent = bubble.text;
                body.onblur = function () {
                    bubble.text = this.textContent;
                };
                body.onclick = function (e) {
                    e.stopPropagation();
                    speakPhonicsText(bubble.text);
                    playPop();
                };

                bubbleEl.appendChild(body);

                if (bubble.type === 'speech' || bubble.type === 'shout') {
                    const tail = document.createElement('div');
                    tail.className = 'ss-bubble-tail';
                    bubbleEl.appendChild(tail);
                } else if (bubble.type === 'thought') {
                    const dots = document.createElement('div');
                    dots.className = 'ss-thought-dots';
                    dots.innerHTML = '<div class="ss-thought-dot-1"></div><div class="ss-thought-dot-2"></div>';
                    bubbleEl.appendChild(dots);
                }

                // مقبض حذف الفقاعة
                const bDelete = document.createElement('button');
                bDelete.className = 'ss-handle-btn delete';
                bDelete.style.cssText = 'position:absolute; top:-12px; left:-12px; border-radius:50%; width:22px; height:22px; display:flex; align-items:center; justify-content:center;';
                bDelete.textContent = '✕';
                bDelete.onclick = function (e) {
                    e.stopPropagation();
                    StoryStudio.deleteBubble(i, bIdx);
                };
                bubbleEl.appendChild(bDelete);

                setupDraggable(bubbleEl, i, bIdx, 'bubble');
                stickersLayer.appendChild(bubbleEl);
            });

            // رسم ملصقات المؤثرات SFX
            (panelData.sfx || []).forEach((sfx, sIdx) => {
                const sfxEl = document.createElement('div');
                sfxEl.className = 'ss-placed-sfx';
                sfxEl.style.left = `${sfx.x}%`;
                sfxEl.style.top = `${sfx.y}%`;
                sfxEl.textContent = sfx.text;
                sfxEl.onclick = function (e) {
                    e.stopPropagation();
                    playComicDrum();
                };

                const sDelete = document.createElement('button');
                sDelete.className = 'ss-handle-btn delete';
                sDelete.style.cssText = 'position:absolute; top:-10px; left:-10px; border-radius:50%; width:20px; height:20px; font-size:10px; display:flex; align-items:center; justify-content:center;';
                sDelete.textContent = '✕';
                sDelete.onclick = function (e) {
                    e.stopPropagation();
                    StoryStudio.deleteSfx(i, sIdx);
                };
                sfxEl.appendChild(sDelete);

                setupDraggable(sfxEl, i, sIdx, 'sfx');
                stickersLayer.appendChild(sfxEl);
            });

            panelEl.appendChild(stickersLayer);

            // تحديد اللوحة النشطة عند النقر عليها
            panelEl.onclick = function (e) {
                if (e.target.closest('.ss-handle-btn') || e.target.closest('.ss-bubble-body')) return;
                StoryStudio.setActivePanel(i);
            };

            canvas.appendChild(panelEl);
        }

        renderPanelNav();
    }

    // إعداد السحب والإفلات اللمسي المتقدم للأجهزة اللوحية
    function setupDraggable(el, panelIdx, itemIdx, itemType) {
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        function onPointerDown(e) {
            if (e.target.closest('.ss-handle-btn') || e.target.isContentEditable) return;
            isDragging = true;
            startX = e.clientX || (e.touches && e.touches[0].clientX);
            startY = e.clientY || (e.touches && e.touches[0].clientY);

            const parentRect = el.parentElement.getBoundingClientRect();
            const elRect = el.getBoundingClientRect();

            initialLeft = ((elRect.left - parentRect.left) / parentRect.width) * 100;
            initialTop = ((elRect.top - parentRect.top) / parentRect.height) * 100;

            state.selectedItem = { panelIdx, idx: itemIdx, type: itemType };
            renderCreatorStage();

            window.addEventListener('pointermove', onPointerMove);
            window.addEventListener('pointerup', onPointerUp);
        }

        function onPointerMove(e) {
            if (!isDragging) return;
            const curX = e.clientX || (e.touches && e.touches[0].clientX);
            const curY = e.clientY || (e.touches && e.touches[0].clientY);
            const dx = curX - startX;
            const dy = curY - startY;

            const parentRect = el.parentElement.getBoundingClientRect();
            const pctDx = (dx / parentRect.width) * 100;
            const pctDy = (dy / parentRect.height) * 100;

            let newLeft = Math.max(0, Math.min(88, initialLeft + pctDx));
            let newTop = Math.max(0, Math.min(85, initialTop + pctDy));

            el.style.left = `${newLeft}%`;
            el.style.top = `${newTop}%`;

            // تحديث البيانات
            const panel = state.currentStory.panels[panelIdx];
            if (panel) {
                if (itemType === 'item' && panel.items[itemIdx]) {
                    panel.items[itemIdx].x = Math.round(newLeft);
                    panel.items[itemIdx].y = Math.round(newTop);
                } else if (itemType === 'bubble' && panel.bubbles[itemIdx]) {
                    panel.bubbles[itemIdx].x = Math.round(newLeft);
                    panel.bubbles[itemIdx].y = Math.round(newTop);
                } else if (itemType === 'sfx' && panel.sfx[itemIdx]) {
                    panel.sfx[itemIdx].x = Math.round(newLeft);
                    panel.sfx[itemIdx].y = Math.round(newTop);
                }
            }
        }

        function onPointerUp() {
            isDragging = false;
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
        }

        el.addEventListener('pointerdown', onPointerDown);
    }

    function renderPanelNav() {
        const nav = document.getElementById('ssPanelNav');
        if (!nav) return;
        nav.innerHTML = '';

        for (let i = 0; i < state.activeLayout; i++) {
            const btn = document.createElement('button');
            btn.className = `ss-panel-btn ${i === state.activePanelIdx ? 'active' : ''}`;
            btn.textContent = `المَشْهَدُ ${i + 1}`;
            btn.onclick = () => StoryStudio.setActivePanel(i);
            nav.appendChild(btn);
        }
    }

    // رسم عناصر الشريط الجانبي (الشخصيات، الأدوات، الخلفيات، إلخ)
    function renderSidebarResources() {
        // 1. شبكة الشخصيات
        const charsGrid = document.getElementById('ssCharsGrid');
        if (charsGrid) {
            charsGrid.innerHTML = '';
            Object.values(CHARACTERS_DATA).forEach(char => {
                const div = document.createElement('div');
                div.className = 'ss-sticker-item';
                div.innerHTML = `
                    <div class="ss-sticker-svg-box">${char.svg}</div>
                    <div class="ss-sticker-name">${char.name}</div>
                    <div class="ss-sticker-phonics">${char.phonics}</div>
                `;
                div.onclick = () => StoryStudio.addCharacterToPanel(char.id);
                charsGrid.appendChild(div);
            });
        }

        // 2. شبكة الأدوات والعناصر
        const propsGrid = document.getElementById('ssPropsGrid');
        if (propsGrid) {
            propsGrid.innerHTML = '';
            Object.values(PROPS_DATA).forEach(prop => {
                const div = document.createElement('div');
                div.className = 'ss-sticker-item';
                div.innerHTML = `
                    <div class="ss-sticker-svg-box">${prop.svg}</div>
                    <div class="ss-sticker-name">${prop.name}</div>
                `;
                div.onclick = () => StoryStudio.addPropToPanel(prop.id);
                propsGrid.appendChild(div);
            });
        }

        // 3. شبكة الخلفيات
        const bgsGrid = document.getElementById('ssBgsGrid');
        if (bgsGrid) {
            bgsGrid.innerHTML = '';
            Object.values(SCENE_BACKGROUNDS).forEach(bg => {
                const card = document.createElement('div');
                card.className = 'ss-bg-card';
                card.innerHTML = `
                    <div class="ss-bg-preview" style="background:${bg.style}">${bg.icon}</div>
                    <div class="ss-bg-title">${bg.name}</div>
                `;
                card.onclick = () => StoryStudio.setBackgroundForPanel(bg.id);
                bgsGrid.appendChild(card);
            });
        }

        // 4. بنك الكلمات الفونيمية
        const wordsBank = document.getElementById('ssWordsBankChips');
        if (wordsBank) {
            wordsBank.innerHTML = '';
            const allWords = [
                ...PHONICS_WORDS.dada,
                ...PHONICS_WORDS.qaddoori,
                ...PHONICS_WORDS.countryside,
                ...PHONICS_WORDS.adventure
            ];
            allWords.forEach(word => {
                const chip = document.createElement('span');
                chip.className = 'ss-word-chip';
                chip.textContent = word;
                chip.onclick = () => StoryStudio.insertWordIntoInput(word);
                wordsBank.appendChild(chip);
            });

            // الجمل الجاهزة
            const sentBank = document.getElementById('ssSentencesChips');
            if (sentBank) {
                sentBank.innerHTML = '';
                PHONICS_WORDS.sentences.forEach(sent => {
                    const chip = document.createElement('span');
                    chip.className = 'ss-word-chip';
                    chip.style.background = '#ede9fe';
                    chip.style.borderColor = '#c4b5fd';
                    chip.textContent = sent;
                    chip.onclick = () => StoryStudio.insertWordIntoInput(sent);
                    sentBank.appendChild(chip);
                });
            }
        }

        // 5. ملصقات المؤثرات الصوتية SFX
        const sfxGrid = document.getElementById('ssSfxGrid');
        if (sfxGrid) {
            sfxGrid.innerHTML = '';
            SFX_STICKERS.forEach(sfx => {
                const item = document.createElement('div');
                item.className = 'ss-sfx-item';
                item.textContent = sfx;
                item.onclick = () => StoryStudio.addSfxToPanel(sfx);
                sfxGrid.appendChild(item);
            });
        }
    }

    // ==========================================================================
    // 11. مكتبة القصص الجاهزة (Library Rendering)
    // ==========================================================================
    function renderLibrary() {
        const listEl = document.getElementById('ssBookList');
        if (!listEl) return;
        listEl.innerHTML = '';

        STORYBOOKS.forEach(book => {
            const card = document.createElement('div');
            card.className = `ss-book-card ${state.selectedLibraryStory && state.selectedLibraryStory.id === book.id ? 'active' : ''}`;
            card.innerHTML = `
                <div class="ss-book-cover-icon">${book.icon}</div>
                <div class="ss-book-details">
                    <div class="ss-book-title">${book.title}</div>
                    <div class="ss-book-phonics-meta">${book.unit}</div>
                    <div class="ss-book-panels-count">${book.panels.length} مَشَاهِدَ مُصَوَّرَة</div>
                </div>
            `;
            card.onclick = () => StoryStudio.selectLibraryBook(book.id);
            listEl.appendChild(card);
        });

        renderSelectedLibraryReader();
    }

    function renderSelectedLibraryReader() {
        const book = state.selectedLibraryStory;
        const viewport = document.getElementById('ssReaderViewport');
        const titleEl = document.getElementById('ssReaderTitle');
        const metaEl = document.getElementById('ssReaderMeta');
        if (!viewport || !book) return;

        if (titleEl) titleEl.textContent = book.title;
        if (metaEl) metaEl.textContent = `${book.unit} • ${book.desc}`;

        viewport.innerHTML = '';
        const canvas = document.createElement('div');
        canvas.className = `ss-comic-page-canvas layout-${book.layout}`;
        canvas.style.cssText = 'width: 100%; height: 100%; min-height: 440px;';

        book.panels.forEach((p, idx) => {
            const panelEl = document.createElement('div');
            panelEl.className = 'ss-comic-panel';

            const badge = document.createElement('div');
            badge.className = 'ss-panel-badge';
            badge.textContent = `المَشْهَدُ ${idx + 1}`;
            panelEl.appendChild(badge);

            const bgLayer = document.createElement('div');
            bgLayer.className = 'ss-panel-bg-layer';
            const bgConfig = SCENE_BACKGROUNDS[p.bg] || SCENE_BACKGROUNDS.school_yard;
            bgLayer.style.background = bgConfig.style;
            bgLayer.innerHTML = bgConfig.elements;
            panelEl.appendChild(bgLayer);

            const stickersLayer = document.createElement('div');
            stickersLayer.className = 'ss-panel-stickers-layer';

            (p.items || []).forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.className = 'ss-placed-item';
                itemEl.style.left = `${item.x}%`;
                itemEl.style.top = `${item.y}%`;
                itemEl.style.transform = `scale(${item.scale || 1}) ${item.flip ? 'scaleX(-1)' : ''}`;
                if (item.type === 'char') {
                    itemEl.innerHTML = CHARACTERS_DATA[item.id]?.svg || '';
                } else {
                    itemEl.innerHTML = PROPS_DATA[item.id]?.svg || '';
                }
                stickersLayer.appendChild(itemEl);
            });

            (p.bubbles || []).forEach(b => {
                const bEl = document.createElement('div');
                bEl.className = `ss-placed-bubble ${b.type}`;
                bEl.style.left = `${b.x}%`;
                bEl.style.top = `${b.y}%`;
                const bodyEl = document.createElement('div');
                bodyEl.className = 'ss-bubble-body';
                bodyEl.textContent = b.text || '';
                bEl.appendChild(bodyEl);
                bEl.onclick = () => {
                    speakPhonicsText(b.text);
                    playPop();
                };
                stickersLayer.appendChild(bEl);
            });

            (p.sfx || []).forEach(s => {
                const sEl = document.createElement('div');
                sEl.className = 'ss-placed-sfx';
                sEl.style.left = `${s.x}%`;
                sEl.style.top = `${s.y}%`;
                sEl.textContent = s.text;
                stickersLayer.appendChild(sEl);
            });

            panelEl.appendChild(stickersLayer);
            canvas.appendChild(panelEl);
        });

        viewport.appendChild(canvas);
    }

    // ==========================================================================
    // 12. استوديو تحديات إكمال القصة الناقصة (Challenges Engine)
    // ==========================================================================
    function renderChallenge() {
        const ch = CHALLENGES_DATA[state.activeChallengeIdx];
        if (!ch) return;

        const titleEl = document.getElementById('ssChTitle');
        const descEl = document.getElementById('ssChDesc');
        const starsEl = document.getElementById('ssChStarsCount');
        const stripEl = document.getElementById('ssChallengeStrip');
        const optionsEl = document.getElementById('ssChOptionsRow');

        if (titleEl) titleEl.textContent = ch.title;
        if (descEl) descEl.textContent = ch.desc;
        if (starsEl) starsEl.textContent = state.challengeStars;

        if (stripEl) {
            stripEl.innerHTML = `
                <div class="ss-ch-panel-card">
                    <div class="ss-ch-panel-visual" style="background:${SCENE_BACKGROUNDS[ch.panel1.bg]?.style}">
                        ${SCENE_BACKGROUNDS[ch.panel1.bg]?.elements || ''}
                    </div>
                    <div class="ss-ch-panel-caption">${ch.panel1.caption}</div>
                </div>
                <div class="ss-ch-panel-card">
                    <div class="ss-ch-panel-visual" style="background:${SCENE_BACKGROUNDS[ch.panel2.bg]?.style}">
                        ${SCENE_BACKGROUNDS[ch.panel2.bg]?.elements || ''}
                    </div>
                    <div class="ss-ch-panel-caption">${ch.panel2.caption}</div>
                </div>
                <div class="ss-ch-panel-card mystery" id="ssChMysteryPanel">
                    <div class="ss-ch-panel-visual">
                        <div class="ss-ch-mystery-badge">❓</div>
                    </div>
                    <div class="ss-ch-panel-caption" id="ssChMysteryCaption">٣. نِهَايَةُ القِصَّةِ المَفْقُودَة</div>
                </div>
            `;
        }

        if (optionsEl) {
            optionsEl.innerHTML = '';
            ch.options.forEach((opt, idx) => {
                const btn = document.createElement('button');
                btn.className = 'ss-ch-option-btn';
                btn.innerHTML = `
                    <span class="ss-ch-opt-icon">${opt.icon}</span>
                    <span class="ss-ch-opt-text">${opt.text}</span>
                `;
                btn.onclick = () => StoryStudio.checkChallengeAnswer(idx, btn);
                optionsEl.appendChild(btn);
            });
        }
    }

    // تشغيل مؤثرات الاحتفال والكونفيتي
    function triggerConfetti() {
        const canvas = document.getElementById('storyStudioConfettiCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;

        const particles = [];
        const colors = ['#7c3aed', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#ec4899'];

        for (let i = 0; i < 90; i++) {
            particles.push({
                x: canvas.width / 2,
                y: canvas.height / 2,
                r: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                vx: (Math.random() - 0.5) * 16,
                vy: (Math.random() - 0.5) * 16 - 4,
                gravity: 0.3,
                opacity: 1
            });
        }

        let animId;
        function update() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let alive = false;
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += p.gravity;
                p.opacity -= 0.015;
                if (p.opacity > 0) {
                    alive = true;
                    ctx.save();
                    ctx.globalAlpha = p.opacity;
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            });
            if (alive) {
                animId = requestAnimationFrame(update);
            } else {
                cancelAnimationFrame(animId);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
        update();
    }

    // ==========================================================================
    // 13. معرض القصص المحفوظة ومعاينة الطباعة A4
    // ==========================================================================
    function renderSavedGallery() {
        const grid = document.getElementById('ssSavedGalleryGrid');
        if (!grid) return;
        const stories = loadSavedStories();

        grid.innerHTML = '';
        if (stories.length === 0) {
            grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #64748b; font-weight: 800;">لَا تُوجَدُ قِصَصٌ مَحْفُوظَةٌ حَتَّى الآن. أَلِّفْ قِصَّتَكَ الأُولَى وَاحْفَظْهَا هُنَا!</div>';
            return;
        }

        stories.forEach((st, idx) => {
            const card = document.createElement('div');
            card.className = 'ss-saved-card';
            card.innerHTML = `
                <div class="ss-saved-preview">📖</div>
                <div class="ss-saved-info">
                    <div>
                        <div class="ss-saved-title">${st.title}</div>
                        <div class="ss-saved-date">${st.date} • ${st.panels.length} مَشَاهِد</div>
                    </div>
                    <div class="ss-saved-actions">
                        <button class="ss-btn-tool primary" onclick="StoryStudio.loadStoryIntoEditor('${st.id}')">تَعْدِيل</button>
                        <button class="ss-btn-tool" onclick="StoryStudio.printA4('${st.id}')">🖨️ طِبَاعَة</button>
                        <button class="ss-btn-tool" onclick="StoryStudio.deleteSavedStory(${idx})">🗑️</button>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    // إعداد منطقة الطباعة A4 القياسية
    function preparePrintArea(story) {
        const printArea = document.getElementById('storyStudioPrintA4Area');
        if (!printArea) return;

        const st = story || state.currentStory;
        const studentName = (document.getElementById('reportStudentSelect')?.value) || 'تِلْمِيذُ قِرَاءَتِي الذَّكِيّ';

        printArea.innerHTML = `
            <div style="font-family: 'Tajawal', system-ui; direction: rtl; text-align: right; width: 100%; height: 100%; display: flex; flex-direction: column;">
                <!-- ترويسة المجلة الرسمية -->
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 3px double #1e1b4b; padding-bottom: 10px; margin-bottom: 12px;">
                    <div>
                        <div style="font-size: 1.1rem; font-weight: 900; color: #1e1b4b;">جُمْهُورِيَّةُ العِرَاق - وِزَارَةُ التَّرْبِيَة</div>
                        <div style="font-size: 0.9rem; color: #4338ca; font-weight: 800;">مَجَلَّةُ القِصَّةِ الفُونِيمِيَّةِ المُصَوَّرَة (الصف الأول الابتدائي)</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 1.6rem; font-weight: 900; color: #7c3aed;">«${st.title}»</div>
                        <div style="font-size: 0.85rem; color: #64748b; font-weight: 700;">إِعْدَادُ التِّلْمِيذِ: ${studentName}</div>
                    </div>
                    <div style="text-align: left; font-size: 0.82rem; color: #64748b;">
                        <div>التَّارِيخ: ${new Date().toLocaleDateString('ar-IQ')}</div>
                        <div>مَنَصَّةُ قِرَاءَتِي التَّفَاعُلِيَّةُ الذَّكِيَّة</div>
                        <div style="font-weight: 800; color: #7c3aed;">إعداد المهندس أسامة خليل هاشم</div>
                    </div>
                </div>

                <!-- شبكة لوحات الكوميكس المطبوعة -->
                <div style="flex: 1; display: grid; grid-template-columns: repeat(${st.layout > 2 ? 3 : 2}, 1fr); gap: 12px; margin-bottom: 12px;">
                    ${st.panels.map((p, pIdx) => `
                        <div style="border: 3px solid #1e1b4b; border-radius: 8px; position: relative; overflow: hidden; background: #ffffff; display: flex; flex-direction: column; min-height: 220px;">
                            <div style="position: absolute; top: 6px; right: 6px; background: #1e1b4b; color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.75rem; font-weight: 900; z-index: 10;">
                                مَشْهَد ${pIdx + 1}
                            </div>
                            <div style="flex: 1; position: relative; background: ${SCENE_BACKGROUNDS[p.bg]?.style || '#f1f5f9'};">
                                ${SCENE_BACKGROUNDS[p.bg]?.elements || ''}
                            </div>
                            <div style="padding: 8px; background: #f8fafc; border-top: 2px solid #1e1b4b; font-size: 0.95rem; font-weight: 900; text-align: center; color: #1e1b4b;">
                                ${(p.bubbles || []).map(b => b.text).join(' • ') || '—'}
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- تذييل الصفحة وتوقيع المعلم -->
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 2px dashed #cbd5e1; padding-top: 8px; font-size: 0.82rem; color: #475569;">
                    <div>ختم وتوقيع معلم الصف: ..........................</div>
                    <div>تقييم التعبير القرائي: ⭐️⭐️⭐️⭐️⭐️</div>
                    <div>منصة قراءتي الذكية - استوديو القصة المصورة A4</div>
                </div>
            </div>
        `;
    }

    // ==========================================================================
    // 14. واجهة البرمجة العامة (Public API)
    // ==========================================================================
    window.StoryStudio = {
        init: function () {
            renderSidebarResources();
            renderCreatorStage();
            renderLibrary();
            renderChallenge();
            renderSavedGallery();
            this.bindKeyboardShortcuts();
        },

        openModal: function (tab = 'creator') {
            initAudio();
            playPageFlip();
            const modal = document.getElementById('storyStudioModal');
            if (modal) {
                modal.style.display = 'flex';
                this.switchTab(tab);
            }
        },

        closeModal: function () {
            playPop();
            stopLibraryStoryPlayback();
            if (typeof window.stopAudio === 'function') window.stopAudio();
            const modal = document.getElementById('storyStudioModal');
            if (modal) {
                modal.style.display = 'none';
            }
        },

        toggleFullscreen: function () {
            const box = document.querySelector('.story-studio-modal-box');
            if (box) {
                state.isFullscreen = !state.isFullscreen;
                box.classList.toggle('fullscreen', state.isFullscreen);
            }
        },

        switchTab: function (tabId) {
            state.activeTab = tabId;
            playPop();
            stopLibraryStoryPlayback();

            // تحديث أزرار التبويبات
            document.querySelectorAll('.ss-tab-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.tab === tabId);
            });

            // تحديث محتوى التبويبات
            document.querySelectorAll('.ss-tab-panel').forEach(panel => {
                panel.classList.toggle('active', panel.id === `ssTabPanel_${tabId}`);
            });

            if (tabId === 'creator') renderCreatorStage();
            if (tabId === 'library') renderLibrary();
            if (tabId === 'challenge') {
                renderChallenge();
                const ch = CHALLENGES_DATA[state.activeChallengeIdx];
                if (ch && ch.desc) {
                    setTimeout(() => speakPhonicsText(ch.desc), 150);
                }
            }
            if (tabId === 'export') renderSavedGallery();
        },

        switchSidebarSubtab: function (subtab) {
            state.activeSidebarSubtab = subtab;
            playPop();

            document.querySelectorAll('.ss-subtab-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.subtab === subtab);
            });

            document.querySelectorAll('.ss-resource-group').forEach(grp => {
                grp.classList.toggle('active', grp.id === `ssResourceGrp_${subtab}`);
            });
        },

        setLayout: function (count) {
            state.activeLayout = count;
            state.currentStory.layout = count;
            if (state.activePanelIdx >= count) state.activePanelIdx = count - 1;
            playPop();

            document.querySelectorAll('.ss-layout-btn').forEach(btn => {
                btn.classList.toggle('active', parseInt(btn.dataset.layout) === count);
            });

            renderCreatorStage();
        },

        setActivePanel: function (idx) {
            state.activePanelIdx = idx;
            playPop();
            renderCreatorStage();
        },

        addCharacterToPanel: function (charId) {
            playPop();
            const panel = state.currentStory.panels[state.activePanelIdx];
            if (!panel) return;
            panel.items = panel.items || [];
            panel.items.push({
                type: 'char',
                id: charId,
                x: 35 + (panel.items.length * 8) % 30,
                y: 35,
                scale: 1.0,
                flip: false
            });
            renderCreatorStage();
        },

        addPropToPanel: function (propId) {
            playPop();
            const panel = state.currentStory.panels[state.activePanelIdx];
            if (!panel) return;
            panel.items = panel.items || [];
            panel.items.push({
                type: 'prop',
                id: propId,
                x: 45 + (panel.items.length * 6) % 30,
                y: 50,
                scale: 0.9,
                flip: false
            });
            renderCreatorStage();
        },

        setBackgroundForPanel: function (bgId) {
            playPop();
            const panel = state.currentStory.panels[state.activePanelIdx];
            if (!panel) return;
            panel.bg = bgId;
            renderCreatorStage();
        },

        addBubbleToPanel: function (type = 'speech') {
            playPop();
            const panel = state.currentStory.panels[state.activePanelIdx];
            if (!panel) return;
            panel.bubbles = panel.bubbles || [];

            const inputEl = document.getElementById('ssInputBubbleText');
            const customText = inputEl ? inputEl.value.trim() : '';
            const defaultText = customText || (type === 'shout' ? 'مَرْحَى بِالقِرَاءَة!' : 'أَنَا أُحِبُّ مَدْرَسَتِي');

            panel.bubbles.push({
                type: type,
                text: defaultText,
                x: 25,
                y: 12
            });

            if (inputEl) inputEl.value = '';
            renderCreatorStage();
        },

        addSfxToPanel: function (sfxText) {
            playComicDrum();
            const panel = state.currentStory.panels[state.activePanelIdx];
            if (!panel) return;
            panel.sfx = panel.sfx || [];
            panel.sfx.push({
                text: sfxText,
                x: 65,
                y: 18
            });
            renderCreatorStage();
        },

        insertWordIntoInput: function (word) {
            playPop();
            const input = document.getElementById('ssInputBubbleText');
            if (input) {
                if (input.value) {
                    input.value += ' ' + word;
                } else {
                    input.value = word;
                }
                input.focus();
            }
        },

        scaleItem: function (panelIdx, itemIdx, delta) {
            playPop();
            const item = state.currentStory.panels[panelIdx]?.items[itemIdx];
            if (item) {
                item.scale = Math.max(0.5, Math.min(2.0, (item.scale || 1.0) + delta));
                renderCreatorStage();
            }
        },

        flipItem: function (panelIdx, itemIdx) {
            playPop();
            const item = state.currentStory.panels[panelIdx]?.items[itemIdx];
            if (item) {
                item.flip = !item.flip;
                renderCreatorStage();
            }
        },

        deleteItem: function (panelIdx, itemIdx) {
            playPop();
            const panel = state.currentStory.panels[panelIdx];
            if (panel && panel.items) {
                panel.items.splice(itemIdx, 1);
                state.selectedItem = null;
                renderCreatorStage();
            }
        },

        deleteBubble: function (panelIdx, bIdx) {
            playPop();
            const panel = state.currentStory.panels[panelIdx];
            if (panel && panel.bubbles) {
                panel.bubbles.splice(bIdx, 1);
                renderCreatorStage();
            }
        },

        deleteSfx: function (panelIdx, sIdx) {
            playPop();
            const panel = state.currentStory.panels[panelIdx];
            if (panel && panel.sfx) {
                panel.sfx.splice(sIdx, 1);
                renderCreatorStage();
            }
        },

        clearCurrentPanel: function () {
            playPop();
            const panel = state.currentStory.panels[state.activePanelIdx];
            if (panel) {
                panel.items = [];
                panel.bubbles = [];
                panel.sfx = [];
                renderCreatorStage();
            }
        },

        saveStory: function () {
            playMagicChime();
            const titleInput = document.getElementById('ssStoryTitleInput');
            if (titleInput && titleInput.value.trim()) {
                state.currentStory.title = titleInput.value.trim();
            }
            saveStoryToStorage(state.currentStory);
            triggerConfetti();
            alert(`🎉 تَمَّ حِفْظُ قِصَّتِكَ «${state.currentStory.title}» بِنَجَاح فِي المَكْتَبَة!`);
        },

        loadStoryIntoEditor: function (storyId) {
            const stories = loadSavedStories();
            const found = stories.find(s => s.id === storyId);
            if (found) {
                playPageFlip();
                state.currentStory = JSON.parse(JSON.stringify(found));
                state.activeLayout = found.layout || found.panels.length;
                this.switchTab('creator');
                renderCreatorStage();
            }
        },

        deleteSavedStory: function (idx) {
            playPop();
            const stories = loadSavedStories();
            stories.splice(idx, 1);
            localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(stories));
            renderSavedGallery();
        },

        selectLibraryBook: function (bookId) {
            playPageFlip();
            const b = STORYBOOKS.find(item => item.id === bookId);
            if (b) {
                state.selectedLibraryStory = b;
                renderLibrary();
            }
        },

        loadLibraryBookToEditor: function () {
            if (!state.selectedLibraryStory) return;
            playMagicChime();
            state.currentStory = JSON.parse(JSON.stringify(state.selectedLibraryStory));
            state.activeLayout = state.selectedLibraryStory.layout;
            this.switchTab('creator');
            renderCreatorStage();
        },

        playActiveLibraryStory: function () {
            const b = state.selectedLibraryStory;
            if (!b || !Array.isArray(b.panels) || b.panels.length === 0) return;
            stopLibraryStoryPlayback();
            playPageFlip();

            const myToken = _libraryPlayToken;
            const panels = b.panels;

            const playPanelAt = (idx) => {
                if (myToken !== _libraryPlayToken || idx >= panels.length) return;
                const p = panels[idx];
                const texts = (p.bubbles || []).map(bub => bub.text).join(' ').trim();
                let advanced = false;

                const goNext = () => {
                    if (advanced || myToken !== _libraryPlayToken) return;
                    advanced = true;
                    if (_libraryPlayTimer) {
                        clearTimeout(_libraryPlayTimer);
                        _libraryPlayTimer = null;
                    }
                    _libraryPlayTimer = setTimeout(() => playPanelAt(idx + 1), 400);
                };

                playPop();
                if (texts) {
                    _libraryPlayTimer = setTimeout(goNext, 10000);
                    speakPhonicsText(texts, goNext);
                } else {
                    _libraryPlayTimer = setTimeout(goNext, 800);
                }
            };

            playPanelAt(0);
        },

        checkChallengeAnswer: function (optIdx, btnEl) {
            const ch = CHALLENGES_DATA[state.activeChallengeIdx];
            if (!ch || state.challengeAnswered) return;

            const opt = ch.options[optIdx];
            if (opt.isCorrect) {
                state.challengeAnswered = true;
                btnEl.classList.add('correct');
                playCheer();
                triggerConfetti();
                state.challengeStars += 5;
                const starsEl = document.getElementById('ssChStarsCount');
                if (starsEl) starsEl.textContent = state.challengeStars;

                const mysteryPanel = document.getElementById('ssChMysteryPanel');
                const mysteryCaption = document.getElementById('ssChMysteryCaption');
                if (mysteryPanel) {
                    mysteryPanel.classList.remove('mystery');
                    mysteryPanel.querySelector('.ss-ch-panel-visual').innerHTML = `
                        <div style="font-size: 3rem;">🎉</div>
                    `;
                }
                if (mysteryCaption) {
                    mysteryCaption.textContent = opt.fullCaption;
                    speakPhonicsText(opt.fullCaption);
                }
            } else {
                playComicDrum();
                btnEl.classList.add('wrong');
                setTimeout(() => btnEl.classList.remove('wrong'), 800);
            }
        },

        nextChallenge: function () {
            state.activeChallengeIdx = (state.activeChallengeIdx + 1) % CHALLENGES_DATA.length;
            state.challengeAnswered = false;
            playPageFlip();
            renderChallenge();
            const ch = CHALLENGES_DATA[state.activeChallengeIdx];
            if (ch && ch.desc) {
                setTimeout(() => speakPhonicsText(ch.desc), 150);
            }
        },

        printA4: function (storyId) {
            let targetStory = state.currentStory;
            if (storyId) {
                const stories = loadSavedStories();
                const found = stories.find(s => s.id === storyId);
                if (found) targetStory = found;
            }
            preparePrintArea(targetStory);
            window.print();
        },

        generateAiStoryModal: async function () {
            const letters = ['د', 'ر', 'و', 'ب', 'م', 'ن', 'ي', 'س', 'ق', 'ل', 'ت', 'ف'];
            
            const btn = document.querySelector('.btn-ai-story');
            if (btn) btn.innerHTML = '<span>✨</span> <span>جارٍ التوليد الذكي...</span>';

            if (window.AIBridge) {
                try {
                    const res = await window.AIBridge.generateCurriculumStory({
                        learnedLetters: letters,
                        theme: 'المدرسة والدار والمرح',
                        lessonTitle: 'قراءتي'
                    });

                    if (res && res.success) {
                        this.applyAiGeneratedStory(res);
                    }
                } catch (e) {
                    console.warn('AI Story Studio generation error:', e);
                }
            }
            if (btn) btn.innerHTML = '<span>✨</span> <span>توليد قصة ذكية (AI)</span>';
        },

        applyAiGeneratedStory: function (data) {
            state.currentStory.title = data.title || 'قصة الحروف الذكية';
            state.activeLayout = 3;
            state.currentStory.panels = [
                {
                    bg: 'school_yard',
                    items: [
                        { type: 'char', id: 'dada_nour', x: 25, y: 35, scale: 1.2, flip: false },
                        { type: 'bubble', bubbleType: 'speech', text: (data.sentences && data.sentences[0]) || data.text, x: 20, y: 10 }
                    ]
                },
                {
                    bg: 'fruit_market',
                    items: [
                        { type: 'char', id: 'faseeh', x: 65, y: 40, scale: 1.1, flip: true },
                        { type: 'bubble', bubbleType: 'speech', text: (data.sentences && data.sentences[1]) || 'مَرْحَباً بِكُمْ!', x: 25, y: 15 }
                    ]
                },
                {
                    bg: 'river_bank',
                    items: [
                        { type: 'char', id: 'firas', x: 30, y: 38, scale: 1.1, flip: false },
                        { type: 'bubble', bubbleType: 'thought', text: (data.sentences && data.sentences[2]) || 'دَارِي دَارِي يَا دَادَا!', x: 20, y: 12 }
                    ]
                }
            ];
            state.activePanelIdx = 0;
            renderPanels();
            renderPanelNav();
            if (typeof window.mascotCelebrates === 'function') {
                window.mascotCelebrates();
            }
            if (typeof window.mascotSpeak === 'function') {
                window.mascotSpeak(`وَلَّدْتُ لَكَ قِصَّةً جَدِيدَةً بِعُنْوَان: ${data.title}! اقْرَأْهَا وَاسْتَمْتِعْ!`);
            }
        },

        bindKeyboardShortcuts: function () {
            window.addEventListener('keydown', (e) => {
                const modal = document.getElementById('storyStudioModal');
                if (!modal || modal.style.display === 'none') return;

                if (e.key === 'Escape') {
                    this.closeModal();
                } else if (e.key === 'f' && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    this.toggleFullscreen();
                }
            });
        }
    };

    // التشغيل التلقائي عند اكتمال تحميل الصفحة
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => window.StoryStudio.init());
    } else {
        window.StoryStudio.init();
    }

})();
