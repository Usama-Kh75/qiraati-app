/* ==========================================================================
 * منصة قراءتي التفاعلية الذكية - مسرح القراءة التعبيرية والدمى المتحركة الرقمية
 * ومحاكاة المحادثة الصفية (Interactive Readers Theater & Puppets Lab)
 * متوافق 100% مع كتاب قراءتي ومعايير وزارة التربية العراقية للأجهزة اللوحية والسبورات
 * إعداد وتطوير: المهندس أسامة خليل هاشم
 * ========================================================================== */

(function () {
    'use strict';

    // مفاتيح التخزين المعزولة ببادئة قواعد أسامة (qiraati-smart-)
    const STORAGE_KEY_STATS = 'qiraati-smart-readers-theater-stats';
    const STORAGE_KEY_SETTINGS = 'qiraati-smart-readers-theater-settings';
    const STORAGE_KEY_CAST = 'qiraati-smart-readers-theater-cast';

    // ==========================================================================
    // 1. تعريف الدمى الرقمية والرسوم المتجهة (Animated Vector Puppets)
    // ==========================================================================
    const PUPPETS_DATA = {
        faseeh: {
            id: 'faseeh',
            name: 'فَصِيح',
            role: 'الراوي والمعلم الذكي',
            avatar: '🦜',
            color: '#059669',
            renderSvg: function () {
                return `
                <svg class="rt-puppet-svg" viewBox="0 0 120 160" width="100" height="135">
                    <g class="rt-puppet-body">
                        <!-- الجسم والقبعة -->
                        <path d="M 30,80 Q 20,130 60,135 Q 100,130 90,80 Z" fill="#10b981" />
                        <ellipse cx="60" cy="105" rx="22" ry="25" fill="#fef08a" />
                        <!-- الجناح الأيمن -->
                        <path class="rt-puppet-arm-right" d="M 28,85 Q 10,105 25,120 Q 30,105 32,90 Z" fill="#059669" />
                        <!-- الجناح الأيسر المتحرك للتلويح -->
                        <path class="rt-puppet-arm-left" d="M 92,85 Q 110,105 95,120 Q 90,105 88,90 Z" fill="#059669" />
                        <!-- الرأس -->
                        <g class="rt-puppet-head">
                            <circle cx="60" cy="50" r="32" fill="#34d399" />
                            <circle cx="48" cy="45" r="7" fill="#ffffff" />
                            <circle cx="48" cy="45" r="3.5" fill="#1e293b" />
                            <circle cx="72" cy="45" r="7" fill="#ffffff" />
                            <circle cx="72" cy="45" r="3.5" fill="#1e293b" />
                            <!-- المنقار المتحرك للكلام -->
                            <polygon class="rt-puppet-mouth" points="52,52 68,52 60,66" fill="#f59e0b" />
                            <!-- قبعة التخرج العلمية -->
                            <polygon points="60,16 26,28 60,38 94,28" fill="#1e1b4b" />
                            <rect x="48" y="28" width="24" height="8" fill="#1e1b4b" rx="2" />
                            <circle cx="60" cy="22" r="3" fill="#eab308" />
                            <line x1="60" y1="22" x2="88" y2="34" stroke="#eab308" stroke-width="2" />
                        </g>
                    </g>
                </svg>`;
            }
        },
        nader: {
            id: 'nader',
            name: 'نَادِر',
            role: 'الصبي الشجاع النشيط',
            avatar: '👦',
            color: '#2563eb',
            renderSvg: function () {
                return `
                <svg class="rt-puppet-svg" viewBox="0 0 120 160" width="100" height="135">
                    <g class="rt-puppet-body">
                        <!-- القميص الأزرق -->
                        <path d="M 32,82 L 88,82 L 84,136 L 36,136 Z" fill="#3b82f6" rx="8" />
                        <line x1="60" y1="82" x2="60" y2="136" stroke="#1d4ed8" stroke-width="2" />
                        <!-- الأيدي -->
                        <path class="rt-puppet-arm-left" d="M 88,85 Q 106,100 100,118" stroke="#fcd34d" stroke-width="9" stroke-linecap="round" fill="none" />
                        <path class="rt-puppet-arm-right" d="M 32,85 Q 14,100 20,118" stroke="#fcd34d" stroke-width="9" stroke-linecap="round" fill="none" />
                        <!-- الرأس -->
                        <g class="rt-puppet-head">
                            <circle cx="60" cy="50" r="28" fill="#fcd34d" />
                            <!-- الشعر المرتب -->
                            <path d="M 32,46 Q 60,14 88,46 Q 60,32 32,46 Z" fill="#78350f" />
                            <circle cx="50" cy="48" r="4.5" fill="#1e293b" />
                            <circle cx="70" cy="48" r="4.5" fill="#1e293b" />
                            <!-- ابتسامة وفم متكلم -->
                            <path class="rt-puppet-mouth" d="M 52,62 Q 60,70 68,62 Z" fill="#be123c" />
                        </g>
                    </g>
                </svg>`;
            }
        },
        rabab: {
            id: 'rabab',
            name: 'رَبَاب',
            role: 'التلميذة المهذبة اللطيفة',
            avatar: '👧',
            color: '#db2777',
            renderSvg: function () {
                return `
                <svg class="rt-puppet-svg" viewBox="0 0 120 160" width="100" height="135">
                    <g class="rt-puppet-body">
                        <!-- فستان وردي -->
                        <path d="M 40,82 L 80,82 L 95,138 L 25,138 Z" fill="#ec4899" />
                        <polygon points="50,82 60,94 70,82" fill="#ffffff" />
                        <!-- الأذرع -->
                        <path class="rt-puppet-arm-left" d="M 80,85 Q 98,102 92,120" stroke="#fcd34d" stroke-width="8" stroke-linecap="round" fill="none" />
                        <path class="rt-puppet-arm-right" d="M 40,85 Q 22,102 28,120" stroke="#fcd34d" stroke-width="8" stroke-linecap="round" fill="none" />
                        <!-- الرأس والجدائل -->
                        <g class="rt-puppet-head">
                            <!-- الجدائل -->
                            <path d="M 28,45 Q 12,65 18,90" stroke="#451a03" stroke-width="9" stroke-linecap="round" fill="none" />
                            <path d="M 92,45 Q 108,65 102,90" stroke="#451a03" stroke-width="9" stroke-linecap="round" fill="none" />
                            <circle cx="60" cy="48" r="28" fill="#fcd34d" />
                            <!-- الشعر وفيونكة -->
                            <path d="M 32,44 Q 60,18 88,44 Z" fill="#451a03" />
                            <polygon points="60,22 50,16 50,28" fill="#f43f5e" />
                            <polygon points="60,22 70,16 70,28" fill="#f43f5e" />
                            <circle cx="50" cy="46" r="4" fill="#1e293b" />
                            <circle cx="70" cy="46" r="4" fill="#1e293b" />
                            <!-- الرموش والخدود -->
                            <circle cx="42" cy="54" r="5" fill="#fbcfe8" />
                            <circle cx="78" cy="54" r="5" fill="#fbcfe8" />
                            <path class="rt-puppet-mouth" d="M 52,60 Q 60,68 68,60 Z" fill="#be123c" />
                        </g>
                    </g>
                </svg>`;
            }
        },
        dada: {
            id: 'dada',
            name: 'دَادَا',
            role: 'الطفل الصغير المحبوب',
            avatar: '👶',
            color: '#f59e0b',
            renderSvg: function () {
                return `
                <svg class="rt-puppet-svg" viewBox="0 0 120 160" width="100" height="135">
                    <g class="rt-puppet-body">
                        <!-- مريلة صفراء وبدلة نوم -->
                        <path d="M 38,88 Q 28,136 60,138 Q 92,136 82,88 Z" fill="#fef08a" />
                        <path d="M 44,92 Q 60,116 76,92 Z" fill="#38bdf8" />
                        <!-- الأيدي الصغيرة -->
                        <path class="rt-puppet-arm-left" d="M 80,92 Q 95,105 88,118" stroke="#fcd34d" stroke-width="8" stroke-linecap="round" fill="none" />
                        <path class="rt-puppet-arm-right" d="M 40,92 Q 25,105 32,118" stroke="#fcd34d" stroke-width="8" stroke-linecap="round" fill="none" />
                        <!-- رأس البيبي -->
                        <g class="rt-puppet-head">
                            <circle cx="60" cy="52" r="30" fill="#fcd34d" />
                            <!-- خصلة شعر لطيفة -->
                            <path d="M 60,22 Q 68,14 62,26" stroke="#78350f" stroke-width="4" stroke-linecap="round" fill="none" />
                            <circle cx="49" cy="50" r="5" fill="#1e293b" />
                            <circle cx="71" cy="50" r="5" fill="#1e293b" />
                            <circle cx="42" cy="58" r="6" fill="#fca5a5" />
                            <circle cx="78" cy="58" r="6" fill="#fca5a5" />
                            <ellipse class="rt-puppet-mouth" cx="60" cy="64" rx="7" ry="5" fill="#e11d48" />
                        </g>
                    </g>
                </svg>`;
            }
        },
        qaddouri: {
            id: 'qaddouri',
            name: 'قَدُّورِي',
            role: 'الوزان الأمين الصادق',
            avatar: '👨‍🌾',
            color: '#7c2d12',
            renderSvg: function () {
                return `
                <svg class="rt-puppet-svg" viewBox="0 0 120 160" width="100" height="135">
                    <g class="rt-puppet-body">
                        <!-- ثوب دافئ وجيليه -->
                        <path d="M 32,82 L 88,82 L 90,138 L 30,138 Z" fill="#f8fafc" />
                        <path d="M 32,82 L 50,138 L 30,138 Z" fill="#9a3412" />
                        <path d="M 88,82 L 70,138 L 90,138 Z" fill="#9a3412" />
                        <!-- ميزان الوزان في يده -->
                        <g class="rt-puppet-arm-left">
                            <line x1="88" y1="92" x2="108" y2="82" stroke="#d97706" stroke-width="3" />
                            <circle cx="108" cy="82" r="3" fill="#b45309" />
                            <path d="M 98,96 Q 108,104 118,96 Z" fill="#d97706" />
                        </g>
                        <!-- الرأس بالكوفية والشارب -->
                        <g class="rt-puppet-head">
                            <circle cx="60" cy="50" r="28" fill="#fcd34d" />
                            <!-- الكوفية والعقال -->
                            <path d="M 30,42 Q 60,18 90,42 L 88,32 Q 60,12 32,32 Z" fill="#ffffff" />
                            <rect x="36" y="28" width="48" height="6" fill="#1e293b" rx="3" />
                            <circle cx="50" cy="46" r="4" fill="#1e293b" />
                            <circle cx="70" cy="46" r="4" fill="#1e293b" />
                            <!-- شوارب الوزان العريضة -->
                            <path d="M 44,56 Q 60,54 76,56 Q 60,62 44,56 Z" fill="#1e293b" />
                            <path class="rt-puppet-mouth" d="M 54,64 Q 60,68 66,64 Z" fill="#be123c" />
                        </g>
                    </g>
                </svg>`;
            }
        },
        duck: {
            id: 'duck',
            name: 'البَطَّة',
            role: 'البطة السابحة المرحة',
            avatar: '🦆',
            color: '#eab308',
            renderSvg: function () {
                return `
                <svg class="rt-puppet-svg" viewBox="0 0 120 160" width="100" height="135">
                    <g class="rt-puppet-body">
                        <!-- جسم البطة الريشي -->
                        <ellipse cx="60" cy="105" rx="36" ry="26" fill="#fde047" />
                        <!-- الجناح المرفرف -->
                        <path class="rt-puppet-arm-left" d="M 45,95 Q 25,105 40,118 Q 55,115 50,98 Z" fill="#eab308" />
                        <!-- الرأس والمنقار البطة -->
                        <g class="rt-puppet-head">
                            <circle cx="68" cy="62" r="24" fill="#fde047" />
                            <circle cx="74" cy="58" r="4.5" fill="#1e293b" />
                            <!-- منقار البطة عريض يفتح ويغلق -->
                            <path class="rt-puppet-mouth" d="M 86,60 L 112,64 L 86,72 Z" fill="#ea580c" />
                        </g>
                        <!-- موجات الماء اللطيفة -->
                        <path d="M 20,132 Q 40,126 60,132 Q 80,138 100,132" stroke="#38bdf8" stroke-width="4" fill="none" />
                    </g>
                </svg>`;
            }
        },
        goose: {
            id: 'goose',
            name: 'الوِزَّة',
            role: 'الوزة الرشيقة النظيفة',
            avatar: '🦢',
            color: '#0284c7',
            renderSvg: function () {
                return `
                <svg class="rt-puppet-svg" viewBox="0 0 120 160" width="100" height="135">
                    <g class="rt-puppet-body">
                        <!-- جسم أبيض ناصع -->
                        <ellipse cx="55" cy="110" rx="35" ry="24" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2" />
                        <!-- رقبة طويلة رشيقة -->
                        <path d="M 70,105 Q 85,75 75,55" stroke="#f8fafc" stroke-width="14" fill="none" stroke-linecap="round" />
                        <!-- الجناح -->
                        <path class="rt-puppet-arm-left" d="M 38,100 Q 15,110 32,122" fill="#e2e8f0" />
                        <!-- الرأس والمنقار البرتقالي -->
                        <g class="rt-puppet-head">
                            <circle cx="75" cy="48" r="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" />
                            <circle cx="78" cy="45" r="3.5" fill="#1e293b" />
                            <polygon class="rt-puppet-mouth" points="88,44 108,48 88,54" fill="#f97316" />
                        </g>
                        <!-- الماء -->
                        <path d="M 15,134 Q 40,128 65,134 Q 90,140 105,134" stroke="#0284c7" stroke-width="4" fill="none" />
                    </g>
                </svg>`;
            }
        },
        crow: {
            id: 'crow',
            name: 'الغُرَابُ الذَّكِيّ',
            role: 'المفكر الصبور البارع',
            avatar: '🦅',
            color: '#334155',
            renderSvg: function () {
                return `
                <svg class="rt-puppet-svg" viewBox="0 0 120 160" width="100" height="135">
                    <g class="rt-puppet-body">
                        <!-- جسم الغراب الأسود الرمادي -->
                        <ellipse cx="60" cy="100" rx="32" ry="28" fill="#1e293b" />
                        <path class="rt-puppet-arm-left" d="M 40,90 Q 15,100 35,116 Z" fill="#334155" />
                        <!-- الرأس والمنقار الحاد -->
                        <g class="rt-puppet-head">
                            <circle cx="68" cy="56" r="24" fill="#1e293b" />
                            <circle cx="74" cy="52" r="5" fill="#ffffff" />
                            <circle cx="75" cy="52" r="2.5" fill="#0f172a" />
                            <polygon class="rt-puppet-mouth" points="86,52 116,58 86,66" fill="#64748b" />
                        </g>
                        <!-- الحصاة الصغيرة في يده أو تحته -->
                        <ellipse cx="60" cy="132" rx="12" ry="7" fill="#64748b" />
                    </g>
                </svg>`;
            }
        },
        bulbul: {
            id: 'bulbul',
            name: 'البُلْبُل',
            role: 'المغرد الفرحان الجميل',
            avatar: '🐦',
            color: '#10b981',
            renderSvg: function () {
                return `
                <svg class="rt-puppet-svg" viewBox="0 0 120 160" width="100" height="135">
                    <g class="rt-puppet-body">
                        <!-- صدر أصفر وظهر بني -->
                        <ellipse cx="58" cy="102" rx="28" ry="24" fill="#eab308" />
                        <path d="M 40,88 Q 20,95 35,114 Z" fill="#78350f" />
                        <!-- الرأس والمنقار -->
                        <g class="rt-puppet-head">
                            <circle cx="66" cy="60" r="20" fill="#78350f" />
                            <circle cx="70" cy="57" r="4" fill="#ffffff" />
                            <circle cx="71" cy="57" r="2" fill="#000000" />
                            <polygon class="rt-puppet-mouth" points="82,58 102,61 82,66" fill="#f59e0b" />
                        </g>
                        <!-- نوتة موسيقية خارجة -->
                        <text x="86" y="44" font-size="16" fill="#ec4899">🎵</text>
                    </g>
                </svg>`;
            }
        }
    };

    // ==========================================================================
    // 2. بنك المسرحيات المنهجية الرسمية (Curriculum Readers Theater Plays)
    // ==========================================================================
    const PLAYS_BANK = [
        {
            id: 'play_dar_dada',
            title: 'مسرحية: فِي دَارِ دَادَا وَبَسْمَةِ الأُسْرَة',
            unit: 'unit1',
            backdrop: 'room',
            curriculumPage: 'ص 22 - 27',
            cast: ['faseeh', 'dada', 'nader', 'rabab'],
            lines: [
                { speaker: 'faseeh', text: 'أَهْلاً بِكُمْ يَا أَصْدِقَائِي فِي دَارِنَا الجَمِيلَةِ، مَاذَا نَرَى هُنَا؟', intonation: 'تَسَاؤُلٌ وَتَرْحِيب 🌸', sfx: 'theater_bell' },
                { speaker: 'dada', text: 'دَادَا.. دَادَا.. بَابَا.. مَامَا!', intonation: 'بَرَاءَةٌ وَفَرَح 👶', sfx: 'cheer' },
                { speaker: 'nader', text: 'أَنَا نَادِر.. دَارُنَا وَاسِعَةٌ وَفِيهَا بَابٌ كَبِير!', intonation: 'فَخْرٌ وَحَمَاس 💪', sfx: 'knock' },
                { speaker: 'rabab', text: 'دَارُ رَبَابَ قَرِيبَةٌ مِنْ دَارِ نُورِي يَا أَبْطَال!', intonation: 'رِقَّةٌ وَمَوَدَّة 💖', sfx: 'magic' },
                { speaker: 'faseeh', text: 'دَارٌ.. دُورٌ.. بَابٌ.. نَامَ دَادَا فِي أَمَانٍ وَسَلَام!', intonation: 'إِلْقَاءٌ خِتَامِيّ مُتَرَغِّم 🎶', sfx: 'fanfare' }
            ]
        },
        {
            id: 'play_mizan_qaddouri',
            title: 'مسرحية: مِيزَانُ قَدُّورِي وَسُوقُ النَّشَاطِ',
            unit: 'unit2',
            backdrop: 'curtain',
            curriculumPage: 'ص 36 - 38',
            cast: ['faseeh', 'qaddouri', 'nader', 'rabab'],
            lines: [
                { speaker: 'faseeh', text: 'فِي سُوقِ الحَيِّ الجَمِيلِ، يَلْتَقِي الأَصْدِقَاءُ عِنْدَ دُكَّانِ الوَزَّانِ!', intonation: 'تَشْوِيقٌ رِوَائِيّ 🎪', sfx: 'theater_bell' },
                { speaker: 'qaddouri', text: 'أَنَا قَدُّورِي وَزَّان.. أَزِنُ زَبِيبَ مَازِنٍ بِالعَدْلِ وَالأَمَانَة!', intonation: 'أَمَانَةٌ وَعَزِيمَة ⚖️', sfx: 'drumroll' },
                { speaker: 'nader', text: 'نَادِرٌ بَزَّاز.. حَطَّ طَيْرٌ فَوْقَ بَيْتِنَا وَفَرِحْنَا جَمِيعاً!', intonation: 'فَرَحٌ وَانْطِلَاق 🕊️', sfx: 'birds' },
                { speaker: 'rabab', text: 'شُكْراً يَا عَمَّ قَدُّورِي، مِيزَانُكَ عَادِلٌ وَزَبِيبُكَ لَذِيذٌ جِدّاً!', intonation: 'شُكْرٌ وَابْتِسَامَة 🍇', sfx: 'applause' },
                { speaker: 'faseeh', text: 'عَاشَ قَدُّورِي وَنَادِر، الصِّدْقُ وَالعَمَلُ يُفْرِحَانِ القُلُوب!', intonation: 'حِكْمَةٌ وَتَتْوِيج 🌟', sfx: 'fanfare' }
            ]
        },
        {
            id: 'play_baqar_basim',
            title: 'مسرحية: بَقَرُ بَاسِم وَطُيُورُ الرِّيفِ البَاسِم',
            unit: 'unit3',
            backdrop: 'countryside',
            curriculumPage: 'ص 44 - 48',
            cast: ['faseeh', 'duck', 'goose', 'nader'],
            lines: [
                { speaker: 'faseeh', text: 'مَا أَجْمَلَ رِيفَ مَنَاف! أَنْهَارٌ صَافِيَةٌ وَعُشْبٌ أَخْضَرُ رَيَّان!', intonation: 'إِعْجَابٌ وَتَأَمُّل 🌳', sfx: 'birds' },
                { speaker: 'duck', text: 'بَطٌّ يَسْبَحُ فِي المَاءِ.. كَاك كَاك.. أَنَا أُحِبُّ السِّبَاحَة!', intonation: 'مَرَحٌ وَحَرَكَة 🦆', sfx: 'water' },
                { speaker: 'goose', text: 'وَأَنَا الوِزَّةُ أَعُومُ مَعَ البَطِّ بِأَمَانٍ وَصَفَاء!', intonation: 'هُدُوءٌ وَرَشَاقَة 🦢', sfx: 'water' },
                { speaker: 'nader', text: 'بَقَرُ بَاسِم يَرْعَى فِي الحَقْلِ وَيُعْطِينَا الحَلِيبَ الطَّازَج!', intonation: 'نَشَاطٌ صَفَوِيّ 🥛', sfx: 'applause' },
                { speaker: 'faseeh', text: 'فِي الرِّيفِ خَيْرٌ وَبَرَكَةٌ لِكُلِّ الأَحِبَّةِ الصِّغَار!', intonation: 'ابْتِهَاجٌ خِتَامِيّ 🎉', sfx: 'fanfare' }
            ]
        },
        {
            id: 'play_matar_bulbul',
            title: 'مسرحية: مَطَرٌ مَطَرٌ.. وَتَغْرِيدُ البُلْبُل',
            unit: 'unit3',
            backdrop: 'river',
            curriculumPage: 'ص 52 - 58',
            cast: ['faseeh', 'bulbul', 'rabab', 'nader'],
            lines: [
                { speaker: 'faseeh', text: 'تَهْطِلُ قَطَرَاتُ المَاءِ مِنَ السَّمَاءِ.. مَطَرٌ.. مَطَرٌ نَاعِم!', intonation: 'اسْتِبْشَارٌ وَرَوْعَة 🌧️', sfx: 'water' },
                { speaker: 'bulbul', text: 'تُوِيت.. تُوِيت.. أَنَا البُلْبُلُ أَفْرَحُ بِلَحْنِ المَطَرِ وَأُغَرِّد!', intonation: 'تَغْرِيدٌ مُبْهِج 🎶', sfx: 'birds' },
                { speaker: 'rabab', text: 'المَطَرُ يَنْزِلُ.. الزَّرْعُ يَفْرَحُ.. وَالوَرْدُ يَتَفَتَّحُ عَاطِراً!', intonation: 'تَعَجُّبٌ سَعِيد 🌸', sfx: 'magic' },
                { speaker: 'nader', text: 'نَحْنُ نَمْشِي تَحْتَ المَظَلَّةِ وَنَقُولُ: سُقْيَا خَيْرٍ وَرَحْمَة!', intonation: 'حَمْدٌ وَشُكْر ☔', sfx: 'applause' },
                { speaker: 'faseeh', text: 'أَحْسَنْتُمْ يَا فُرْسَانَ القِرَاءَةِ.. صَوْتُكُمُ التَّعْبِيرِيُّ رَائِع!', intonation: 'تَشْجِيعٌ بَاهِر 🎖️', sfx: 'fanfare' }
            ]
        },
        {
            id: 'play_crow_smart',
            title: 'مسرحية: الغُرَابُ الذَّكِيُّ وَجَرَّةُ المَاءِ',
            unit: 'unit5',
            backdrop: 'countryside',
            curriculumPage: 'ص 88 - 92',
            cast: ['faseeh', 'crow', 'rabab', 'nader'],
            lines: [
                { speaker: 'faseeh', text: 'عَطِشَ غُرَابٌ ذَكِيٌّ.. وَجَدَ جَرَّةً فِيهَا مَاءٌ قَلِيلٌ فِي القَاع!', intonation: 'تَشْوِيقٌ دِرَامِيّ 🏺', sfx: 'mystery' },
                { speaker: 'crow', text: 'كَيْفَ أَشْرَبُ وَفَمُ الجَرَّةِ ضَيِّقٌ؟ لَنْ أَيْرَسَ.. عَقْلِي سَيَجِدُ الحَلّ!', intonation: 'إِصْرَارٌ وَتَفْكِير 🧠', sfx: 'drumroll' },
                { speaker: 'nader', text: 'انْظُرُوا! الغُرَابُ يَحْمِلُ حَصَاةً صَغِيرَةً وَيَرْمِيهَا فِي الجَرَّة!', intonation: 'دَهْشَةٌ وَمُتَابَعَة 🪨', sfx: 'magic' },
                { speaker: 'rabab', text: 'حَصَاةٌ وَرَاءَ حَصَاة.. ارْتَفَعَ المَاءُ إِلَى أَعْلَى الجَرَّة!', intonation: 'فَرَحُ النَّجَاح ✨', sfx: 'cheer' },
                { speaker: 'crow', text: 'شَرِبْتُ وَارْتَوَيْتُ الحَمْدُ لِلَّه.. بِالتَّفْكِيرِ نَصِلُ لِلنَّجَاح!', intonation: 'انْتِصَارٌ وَفَرَح 🏆', sfx: 'applause' },
                { speaker: 'faseeh', text: 'مَا أَرْوَعَ العَقْلَ وَالصَّبْرَ.. أَحْسَنْتَ أَيُّهَا الغُرَابُ الذَّكِيّ!', intonation: 'إِشَادَةٌ خِتَامِيَّة 👏', sfx: 'fanfare' }
            ]
        },
        {
            id: 'play_classroom_love',
            title: 'مسرحية: فِي مَدْرَسَتِنَا نَتَعَلَّمُ وَنَبْنِي الوَطَن',
            unit: 'unit6',
            backdrop: 'classroom',
            curriculumPage: 'ص 102 - 108',
            cast: ['faseeh', 'nader', 'rabab', 'dada'],
            lines: [
                { speaker: 'faseeh', text: 'دَقَّ جَرَسُ المَدْرَسَةِ.. صَبَاحُ الخَيْرِ يَا فُرْسَانَ العِلْمِ وَالأَمَل!', intonation: 'تَرْحِيبٌ مَدْرَسِيّ 🔔', sfx: 'theater_bell' },
                { speaker: 'nader', text: 'صَبَاحُ النُّورِ يَا مُعَلِّمِي.. أَنَا أُحِبُّ مَدْرَسَتِي وَكِتَابَ قِرَاءَتِي!', intonation: 'أَدَبٌ وَحَمَاس 📚', sfx: 'applause' },
                { speaker: 'rabab', text: 'فِي صَفِّنَا نَقْرَأُ الحُرُوفَ، نَرْسُمُ العَلَمَ، وَنَتَعَاوَنُ بِمَحَبَّة!', intonation: 'فَخْرٌ وَتَعَاوُن 🇮🇶', sfx: 'magic' },
                { speaker: 'dada', text: 'أَنَا أَيْضاً سَأَكْبَرُ وَأَذْهَبُ مَعَكُمْ إِلَى المَدْرَسَة!', intonation: 'شَوْقٌ بَرِيء 🎈', sfx: 'cheer' },
                { speaker: 'faseeh', text: 'بِالعِلْمِ نَرْقَى وَبِالقِرَاءَةِ نُنِيرُ دُرُوبَ العِرَاقِ الحَبِيب!', intonation: 'نِدَاءٌ وَطَنِيٌّ خَالِد ❤️', sfx: 'fanfare' }
            ]
        }
    ];

    // ==========================================================================
    // 3. بنك محاكاة المحادثات الصفية (Classroom Conversation Scenarios)
    // ==========================================================================
    const CONVERSATION_SCENARIOS = [
        {
            id: 'convo_greeting',
            title: 'محادثة: التَّحِيَّةُ وَالتَّعَارُفُ فِي اليَوْمِ الأَوَّل',
            partner: 'faseeh',
            prompt: 'فَصِيح يُرَحِّبُ بِكَ فِي الصَّفِّ.. كَيْفَ تُجِيبُهُ بِأَدَبٍ وَثِقَة؟',
            partnerMessage: 'مَرْحَباً بِكَ يَا بَطَل! مَا اسْمُكَ الجَمِيل؟',
            options: [
                { text: 'أَهْلاً يَا فَصِيح.. أَنَا تِلْمِيذُ الصَّفِّ الأَوَّلِ المُجْتَهِد!', intonation: 'ثِقَةٌ وَفَرَح', correct: true },
                { text: 'أَنَا لَا أَعْرِفُ شَيْئاً هُنَا.', intonation: 'تَرَدُّد', correct: false },
                { text: 'مَرْحَباً بِكَ.. أَنَا مُسْتَعِدٌّ لِلتَّعَلُّمِ مَعَكَ!', intonation: 'حَمَاسٌ وَأَدَب', correct: true }
            ]
        },
        {
            id: 'convo_asking_help',
            title: 'محادثة: آدَابُ الاسْتِئْذَانِ وَطَلَبِ المُسَاعَدَة',
            partner: 'rabab',
            prompt: 'رَبَاب تَسْأَلُكَ عَنْ قَلَمِ التَّلْوِينِ.. كَيْفَ تَتَحَاوَرُ مَعَهَا؟',
            partnerMessage: 'مِنْ فَضْلِكَ يَا زَمِيلِي، هَلْ تُعِيرُنِي القَلَمَ الأَحْمَرَ لِأَرْسُمَ الوَرْدَة؟',
            options: [
                { text: 'تَفَضَّلِي يَا رَبَاب بِكُلِّ سُرُور.. النَّظَافَةُ وَالتَّعَاوُنُ خُلُقُنَا!', intonation: 'كَرَمٌ وَمَوَدَّة', correct: true },
                { text: 'لَا أُرِيدُ إِعْطَاءَكَ القَلَم.', intonation: 'قَسْوَة', correct: false },
                { text: 'بِالتَّأْكِيدِ يَا صَدِيقَتِي، خُذِي القَلَمَ وَأَعِيدِيهِ بَعْدَ الإِكْمَال.', intonation: 'تَهْذِيبٌ وَلُطْف', correct: true }
            ]
        },
        {
            id: 'convo_picture_desc',
            title: 'محادثة: وَصْفُ الصُّورَةِ وَحَيَوَانَاتِ الرِّيف',
            partner: 'nader',
            prompt: 'نَادِر يَسْأَلُكَ عَنِ الصُّورَةِ فِي دَرْسِ الرِّيفِ.. صِفْهَا لَهُ!',
            partnerMessage: 'مَاذَا تُشَاهِدُ فِي صُورَةِ رِيفِ مَنَاف يَا صَدِيقِي؟',
            options: [
                { text: 'أُشَاهِدُ بَقَرَ بَاسِم يَرْعَى فِي العُشْبِ، وَبَطّاً يَسْبَحُ فِي النَّهْر!', intonation: 'وَصْفٌ دَقِيق', correct: true },
                { text: 'أُشَاهِدُ سَيَّارَاتٍ كَثِيرَةً فِي المَدِينَة.', intonation: 'غَيْرُ مُطَابِق', correct: false },
                { text: 'أَرَى أَشْجَاراً خَضْرَاءَ وَنَهْراً صَافِياً وَطُيُوراً تُغَرِّد!', intonation: 'تَعْبِيرٌ شَاعِرِيّ', correct: true }
            ]
        }
    ];

    // ==========================================================================
    // 4. محرك المؤثرات الصوتية والدرامية الفيزيائي 100% Web Audio API
    // ==========================================================================
    let audioCtx = null;

    function getAudioContext() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                audioCtx = new AudioContextClass();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    const SFX_GENERATORS = {
        // 1. تصفيق الجمهور والتشجيع
        applause: function (ctx) {
            const bufferSize = ctx.sampleRate * 1.5;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.4)) * 0.6;
            }
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 1000;
            filter.Q.value = 1.2;
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.7, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.4);
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            noise.start();
        },
        // 2. جرس المسرح الكلاسيكي (Ding-Dong-Dang)
        theater_bell: function (ctx) {
            const freqs = [659.25, 523.25, 783.99]; // E5, C5, G5
            freqs.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const startTime = ctx.currentTime + idx * 0.28;
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, startTime);
                gain.gain.setValueAtTime(0.35, startTime);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.2);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(startTime);
                osc.stop(startTime + 1.25);
            });
        },
        // 3. قرع الطبول والتشويق
        drumroll: function (ctx) {
            for (let i = 0; i < 20; i++) {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const time = ctx.currentTime + i * 0.05;
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(110 + i * 2, time);
                gain.gain.setValueAtTime(0.25 + (i / 20) * 0.3, time);
                gain.gain.exponentialRampToValueAtTime(0.01, time + 0.08);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(time);
                osc.stop(time + 0.09);
            }
        },
        // 4. بوق النصر والختام التتويجي
        fanfare: function (ctx) {
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            notes.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const t = ctx.currentTime + idx * 0.18;
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(freq, t);
                gain.gain.setValueAtTime(0.25, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(t);
                osc.stop(t + 0.6);
            });
        },
        // 5. بريق السحر والنجوم
        magic: function (ctx) {
            const freqs = [880, 1174, 1318, 1567, 1760, 2093];
            freqs.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const t = ctx.currentTime + idx * 0.07;
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, t);
                gain.gain.setValueAtTime(0.3, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(t);
                osc.stop(t + 0.5);
            });
        },
        // 6. ضحك ومرح الأطفال
        laughter: function (ctx) {
            for (let i = 0; i < 6; i++) {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const t = ctx.currentTime + i * 0.15;
                osc.type = 'sine';
                osc.frequency.setValueAtTime(440 + Math.sin(i) * 80, t);
                osc.frequency.exponentialRampToValueAtTime(560, t + 0.12);
                gain.gain.setValueAtTime(0.3, t);
                gain.gain.exponentialRampToValueAtTime(0.01, t + 0.14);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(t);
                osc.stop(t + 0.15);
            }
        },
        // 7. تغريد البلابل والعصافير
        birds: function (ctx) {
            const chirps = [1800, 2400, 2200, 2800, 2600];
            chirps.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const t = ctx.currentTime + idx * 0.12;
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, t);
                osc.frequency.exponentialRampToValueAtTime(freq + 600, t + 0.08);
                gain.gain.setValueAtTime(0.25, t);
                gain.gain.exponentialRampToValueAtTime(0.005, t + 0.1);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(t);
                osc.stop(t + 0.11);
            });
        },
        // 8. خرير الماء والسباحة
        water: function (ctx) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(320, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.4);
            gain.gain.setValueAtTime(0.35, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.5);
        },
        // 9. تشويق ولغز درامي
        mystery: function (ctx) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(180, ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(260, ctx.currentTime + 0.6);
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.7);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.75);
        },
        // 10. طرق الباب (طق طق!)
        knock: function (ctx) {
            [0, 0.22, 0.44].forEach((delay) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const t = ctx.currentTime + delay;
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(95, t);
                gain.gain.setValueAtTime(0.5, t);
                gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(t);
                osc.stop(t + 0.09);
            });
        },
        // 11. حركة ستارة المسرح
        curtain: function (ctx) {
            const bufferSize = ctx.sampleRate * 0.8;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * 0.2;
            }
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(400, ctx.currentTime);
            filter.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.8);
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.4, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            noise.start();
        },
        // 12. هتاف برافو وبطولة
        cheer: function (ctx) {
            const notes = [392, 523.25, 659.25, 783.99]; // G4, C5, E5, G5
            notes.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const t = ctx.currentTime + idx * 0.1;
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, t);
                gain.gain.setValueAtTime(0.35, t);
                gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(t);
                osc.stop(t + 0.55);
            });
        }
    };

    // ==========================================================================
    // 5. حالة المسرح التفاعلي (State Management)
    // ==========================================================================
    const State = {
        currentTab: 'theater',
        currentPlayId: 'play_dar_dada',
        currentLineIndex: 0,
        isAutoPlaying: false,
        autoPlayTimer: null,
        performanceMode: 'interactive', // interactive | auto | choral
        curtainsOpen: true,
        currentBackdrop: 'room',
        castAssignments: {}, // { speakerId: pupilName }
        currentConvoId: 'convo_greeting',
        convoStep: 0,
        isRecording: false,
        mediaRecorder: null,
        audioChunks: [],
        recordedBlobUrl: null
    };

    // ==========================================================================
    // 6. واجهات التحكم الرئيسية لـ ReadersTheater
    // ==========================================================================
    const ReadersTheater = {
        // فتح النافذة الرئيسية
        openModal: function (tab = 'theater') {
            const modal = document.getElementById('readersTheaterModal');
            if (modal) {
                modal.style.display = 'flex';
                this.switchTab(tab);
                this.initStage();
            }
        },

        // إغلاق النافذة
        closeModal: function () {
            const modal = document.getElementById('readersTheaterModal');
            if (modal) {
                modal.style.display = 'none';
                this.stopAutoPlay();
            }
        },

        // تبديل الشاشة المكبرة للسبورات الذكية
        toggleFullscreenStage: function () {
            const box = document.querySelector('.readers-theater-modal-box');
            if (box) {
                box.classList.toggle('fullscreen-mode');
                const btn = document.getElementById('rtBtnFullscreen');
                if (btn) {
                    const isFull = box.classList.contains('fullscreen-mode');
                    btn.innerHTML = isFull ? '<span>🗗</span> <span>الوضع العادي</span>' : '<span>📺</span> <span>مسرح ملء الشاشة</span>';
                }
            }
        },

        // التبديل بين التبويبات الأربعة
        switchTab: function (tab) {
            State.currentTab = tab;
            const tabs = ['theater', 'puppets', 'conversation', 'soundboard'];
            tabs.forEach(t => {
                const btn = document.getElementById(`rtTabBtn_${t}`);
                const panel = document.getElementById(`rtTabPanel_${t}`);
                if (btn) btn.classList.toggle('active', t === tab);
                if (panel) panel.classList.toggle('active', t === tab);
            });

            if (tab === 'puppets') {
                this.renderPuppetsLab();
            } else if (tab === 'conversation') {
                this.loadConversation(State.currentConvoId);
            }
        },

        // تهيئة المسرح
        initStage: function () {
            this.loadPlay(State.currentPlayId);
            this.setStageBackdrop(State.currentBackdrop);
            this.updateCastChips();
            this.updateTicketPreview();
        },

        // تحميل مسرحية
        loadPlay: function (playId) {
            State.currentPlayId = playId;
            State.currentLineIndex = 0;
            const play = PLAYS_BANK.find(p => p.id === playId) || PLAYS_BANK[0];
            
            // ضبط الخلفية الخاصة بالمسرحية
            if (play.backdrop) {
                this.setStageBackdrop(play.backdrop);
            }

            // تحديث عناصر القائمة
            const selectEl = document.getElementById('rtPlaySelect');
            if (selectEl && selectEl.value !== playId) {
                selectEl.value = playId;
            }

            this.renderStagePuppets(play.cast);
            this.updateCastChips();
            this.showLine(0);
        },

        // تغيير المسرحية من القائمة المنسدلة
        onPlaySelectChange: function () {
            const select = document.getElementById('rtPlaySelect');
            if (select) {
                this.loadPlay(select.value);
            }
        },

        // تغيير نمط الأداء (تفاعلي / تشغيل تلقائي / قراءة جماعية)
        setPerformanceMode: function (mode) {
            State.performanceMode = mode;
            ['interactive', 'auto', 'choral'].forEach(m => {
                const pill = document.getElementById(`rtMode_${m}`);
                if (pill) pill.classList.toggle('active', m === mode);
            });

            if (mode === 'auto') {
                this.startAutoPlay();
            } else {
                this.stopAutoPlay();
            }
        },

        // تبديل ستائر المسرح
        toggleCurtains: function () {
            const curtains = document.getElementById('rtStageCurtains');
            if (curtains) {
                State.curtainsOpen = !State.curtainsOpen;
                curtains.classList.toggle('rt-curtains-open', State.curtainsOpen);
                this.playSoundEffect('curtain');
                const btn = document.getElementById('rtBtnCurtains');
                if (btn) {
                    btn.innerHTML = State.curtainsOpen ? '<span>🎭</span> <span>إغلاق الستار</span>' : '<span>🎪</span> <span>فتح الستار</span>';
                }
            }
        },

        // تغيير خلفية المسرح
        setStageBackdrop: function (theme) {
            State.currentBackdrop = theme;
            const scene = document.getElementById('rtStageScene');
            if (scene) {
                scene.className = 'rt-stage-scene rt-scene-' + theme;
            }
            const sel = document.getElementById('rtBackdropSelect');
            if (sel) sel.value = theme;
        },

        onBackdropSelectChange: function () {
            const sel = document.getElementById('rtBackdropSelect');
            if (sel) this.setStageBackdrop(sel.value);
        },

        // عرض الدمى على خشبة المسرح
        renderStagePuppets: function (puppetIds) {
            const row = document.getElementById('rtStagePuppetsRow');
            if (!row) return;

            let html = '';
            puppetIds.forEach(id => {
                const puppet = PUPPETS_DATA[id];
                if (puppet) {
                    const pupilName = State.castAssignments[id] || puppet.name;
                    html += `
                    <div class="rt-puppet-figure" id="rtPuppet_${id}" onclick="ReadersTheater.onPuppetClick('${id}')">
                        <div class="rt-speech-bubble" id="rtBubble_${id}"></div>
                        <div class="rt-puppet-svg-wrap">
                            ${puppet.renderSvg()}
                        </div>
                        <div class="rt-puppet-name-tag">${pupilName}</div>
                    </div>`;
                }
            });
            row.innerHTML = html;
        },

        // تفاعل النقر على الدمية
        onPuppetClick: function (puppetId) {
            this.animatePuppet(puppetId, 'talk');
            this.animatePuppet(puppetId, 'bounce');
            this.playSoundEffect('magic');
        },

        // تحريك دمية محددة
        animatePuppet: function (puppetId, action) {
            const el = document.getElementById(`rtPuppet_${puppetId}`);
            if (!el) return;
            const cls = `rt-puppet-${action}`;
            el.classList.add(cls);
            setTimeout(() => {
                el.classList.remove(cls);
            }, 1200);
        },

        // شريط توزيع الأدوار على التلاميذ
        updateCastChips: function () {
            const container = document.getElementById('rtCastChipsContainer');
            if (!container) return;

            const play = PLAYS_BANK.find(p => p.id === State.currentPlayId) || PLAYS_BANK[0];
            const currentSpeaker = play.lines[State.currentLineIndex]?.speaker;

            let html = '';
            play.cast.forEach(puppetId => {
                const puppet = PUPPETS_DATA[puppetId];
                if (!puppet) return;
                const assignedPupil = State.castAssignments[puppetId] || '';
                const isActive = (puppetId === currentSpeaker);
                html += `
                <div class="rt-cast-chip ${isActive ? 'active-speaker' : ''}" id="rtCastChip_${puppetId}">
                    <span>${puppet.avatar}</span>
                    <span>${puppet.name}:</span>
                    <input type="text" class="rt-cast-pupil-input" placeholder="اسم التلميذ" 
                           value="${assignedPupil}" 
                           onchange="ReadersTheater.onAssignPupil('${puppetId}', this.value)"
                           title="اكتب اسم التلميذ الذي يؤدي هذا الدور">
                </div>`;
            });
            container.innerHTML = html;
        },

        onAssignPupil: function (puppetId, pupilName) {
            State.castAssignments[puppetId] = pupilName.trim();
            try {
                localStorage.setItem(STORAGE_KEY_CAST, JSON.stringify(State.castAssignments));
            } catch (e) {}
            // تحديث بطاقات الدمى
            const tag = document.querySelector(`#rtPuppet_${puppetId} .rt-puppet-name-tag`);
            if (tag) {
                tag.textContent = pupilName.trim() || PUPPETS_DATA[puppetId]?.name || '';
            }
            this.updateTicketPreview();
        },

        // عرض سطر محدد في شاشة التلقين
        showLine: function (index) {
            const play = PLAYS_BANK.find(p => p.id === State.currentPlayId) || PLAYS_BANK[0];
            if (index < 0) index = 0;
            if (index >= play.lines.length) index = play.lines.length - 1;
            State.currentLineIndex = index;

            const line = play.lines[index];
            const speaker = PUPPETS_DATA[line.speaker] || PUPPETS_DATA.faseeh;
            const pupilName = State.castAssignments[line.speaker] || speaker.name;

            // تحديث شريط المتحدث
            const avatarEl = document.getElementById('rtSpeakerAvatar');
            if (avatarEl) avatarEl.textContent = speaker.avatar;

            const nameEl = document.getElementById('rtSpeakerName');
            if (nameEl) nameEl.textContent = pupilName + ` (${speaker.name})`;

            const intonationEl = document.getElementById('rtSpeakerIntonation');
            if (intonationEl) intonationEl.textContent = line.intonation;

            // نص السطر النشط
            const lineBox = document.getElementById('rtActiveLineBox');
            if (lineBox) {
                lineBox.textContent = line.text;
                lineBox.style.transform = 'scale(0.98)';
                setTimeout(() => lineBox.style.transform = 'scale(1)', 150);
            }

            // مؤشر الخطوة
            const counterEl = document.getElementById('rtLineCounter');
            if (counterEl) {
                counterEl.textContent = `${index + 1} / ${play.lines.length}`;
            }

            // تسليط الضوء على الدمية المتحدثة
            this.highlightSpeakingPuppet(line.speaker, line.text);

            // تشغيل المؤثر الدرامي المصاحب للسطر إن وجد
            if (line.sfx && SFX_GENERATORS[line.sfx]) {
                this.playSoundEffect(line.sfx);
            }

            this.updateCastChips();
        },

        // إبراز الدمية المتحدثة وبالون الكلام
        highlightSpeakingPuppet: function (speakerId, text) {
            const allPuppets = document.querySelectorAll('.rt-puppet-figure');
            allPuppets.forEach(p => {
                p.classList.remove('speaking');
                p.classList.remove('rt-puppet-talking');
            });

            const speakingEl = document.getElementById(`rtPuppet_${speakerId}`);
            if (speakingEl) {
                speakingEl.classList.add('speaking');
                speakingEl.classList.add('rt-puppet-talking');

                const bubble = document.getElementById(`rtBubble_${speakerId}`);
                if (bubble) {
                    bubble.textContent = text;
                }

                // تحريك بقعة الضوء (Spotlight) نحو الدمية
                const spotlight = document.getElementById('rtStageSpotlight');
                if (spotlight) {
                    const rect = speakingEl.getBoundingClientRect();
                    const stageRect = document.getElementById('rtStageScene').getBoundingClientRect();
                    const leftOffset = rect.left - stageRect.left + (rect.width / 2) - 110;
                    spotlight.style.left = `${Math.max(10, leftOffset)}px`;
                }

                setTimeout(() => {
                    speakingEl.classList.remove('rt-puppet-talking');
                }, 1800);
            }
        },

        // السطر التالي
        nextLine: function () {
            const play = PLAYS_BANK.find(p => p.id === State.currentPlayId) || PLAYS_BANK[0];
            if (State.currentLineIndex < play.lines.length - 1) {
                this.showLine(State.currentLineIndex + 1);
            } else {
                // نهاية المسرحية - تصفيق واحتفال
                this.playSoundEffect('applause');
                this.playSoundEffect('fanfare');
                this.recordCompletion();
            }
        },

        // السطر السابق
        prevLine: function () {
            if (State.currentLineIndex > 0) {
                this.showLine(State.currentLineIndex - 1);
            }
        },

        // القراءة الآلية المؤتمتة
        startAutoPlay: function () {
            this.stopAutoPlay();
            State.isAutoPlaying = true;
            const btn = document.getElementById('rtBtnAutoPlay');
            if (btn) btn.innerHTML = '<span>⏸️</span> <span>إيقاف مؤقت</span>';

            State.autoPlayTimer = setInterval(() => {
                const play = PLAYS_BANK.find(p => p.id === State.currentPlayId) || PLAYS_BANK[0];
                if (State.currentLineIndex < play.lines.length - 1) {
                    this.nextLine();
                } else {
                    this.stopAutoPlay();
                }
            }, 3800);
        },

        stopAutoPlay: function () {
            State.isAutoPlaying = false;
            if (State.autoPlayTimer) {
                clearInterval(State.autoPlayTimer);
                State.autoPlayTimer = null;
            }
            const btn = document.getElementById('rtBtnAutoPlay');
            if (btn) btn.innerHTML = '<span>▶️</span> <span>تشغيل المسرحية تلقائياً</span>';
        },

        toggleAutoPlay: function () {
            if (State.isAutoPlaying) {
                this.stopAutoPlay();
            } else {
                this.startAutoPlay();
            }
        },

        // تشغيل مؤثر صوتي درامي
        playSoundEffect: function (effectKey) {
            try {
                const ctx = getAudioContext();
                if (ctx && SFX_GENERATORS[effectKey]) {
                    SFX_GENERATORS[effectKey](ctx);
                }
            } catch (err) {
                console.warn('Audio SFX error:', err);
            }
        },

        // ======================================================================
        // 7. مختبر الدمى الرقمية والتحريك (Digital Puppets Lab Tab)
        // ======================================================================
        renderPuppetsLab: function () {
            const grid = document.getElementById('rtPuppetsGrid');
            if (!grid) return;

            let html = '';
            Object.values(PUPPETS_DATA).forEach(puppet => {
                html += `
                <div class="rt-puppet-card" id="rtPuppetCard_${puppet.id}">
                    <div class="rt-card-puppet-preview">
                        ${puppet.renderSvg()}
                    </div>
                    <h4>${puppet.name}</h4>
                    <span class="rt-puppet-role-badge">${puppet.role}</span>
                    <div class="rt-puppet-action-btns">
                        <button class="rt-action-btn-sm" onclick="ReadersTheater.testPuppetAction('${puppet.id}', 'talk')" title="تحريك الفم والكلام">🗣️ تَحَدُّث</button>
                        <button class="rt-action-btn-sm" onclick="ReadersTheater.testPuppetAction('${puppet.id}', 'bounce')" title="قفز مرح">🦘 قَفْز</button>
                        <button class="rt-action-btn-sm" onclick="ReadersTheater.testPuppetAction('${puppet.id}', 'wave')" title="تلويح وتحية">👋 تَلْوِيح</button>
                        <button class="rt-action-btn-sm" onclick="ReadersTheater.testPuppetAction('${puppet.id}', 'clap')" title="تصفيق وتشجيع">👏 تَصْفِيق</button>
                    </div>
                </div>`;
            });
            grid.innerHTML = html;
        },

        testPuppetAction: function (puppetId, action) {
            const card = document.getElementById(`rtPuppetCard_${puppetId}`);
            if (card) {
                const svgWrap = card.querySelector('.rt-puppet-svg');
                if (svgWrap) {
                    const cls = `rt-puppet-${action}`;
                    svgWrap.classList.add(cls);
                    this.playSoundEffect(action === 'clap' ? 'applause' : 'magic');
                    setTimeout(() => svgWrap.classList.remove(cls), 1200);
                }
            }
        },

        // ======================================================================
        // 8. محاكاة المحادثة الصفية (Classroom Conversation Tab)
        // ======================================================================
        loadConversation: function (convoId) {
            State.currentConvoId = convoId;
            State.convoStep = 0;
            const convo = CONVERSATION_SCENARIOS.find(c => c.id === convoId) || CONVERSATION_SCENARIOS[0];

            const sel = document.getElementById('rtConvoSelect');
            if (sel && sel.value !== convoId) sel.value = convoId;

            const promptEl = document.getElementById('rtConvoPromptText');
            if (promptEl) promptEl.textContent = convo.prompt;

            // إعادة ضبط سجل الحوار
            const historyEl = document.getElementById('rtConvoHistory');
            if (historyEl) {
                const partner = PUPPETS_DATA[convo.partner] || PUPPETS_DATA.faseeh;
                historyEl.innerHTML = `
                <div class="rt-chat-row partner">
                    <div class="rt-speaker-avatar">${partner.avatar}</div>
                    <div class="rt-chat-bubble">${convo.partnerMessage}</div>
                </div>`;
            }

            // عرض خيارات الرد
            this.renderConversationOptions(convo);
        },

        onConvoSelectChange: function () {
            const sel = document.getElementById('rtConvoSelect');
            if (sel) this.loadConversation(sel.value);
        },

        renderConversationOptions: function (convo) {
            const container = document.getElementById('rtConvoOptionsContainer');
            if (!container) return;

            let html = '';
            convo.options.forEach((opt, idx) => {
                html += `
                <button class="rt-convo-opt-btn" onclick="ReadersTheater.chooseConvoOption(${idx})">
                    <span>💬 ${opt.text}</span>
                    <span class="rt-intonation-pill">${opt.intonation}</span>
                </button>`;
            });
            container.innerHTML = html;
        },

        chooseConvoOption: function (optionIndex) {
            const convo = CONVERSATION_SCENARIOS.find(c => c.id === State.currentConvoId);
            if (!convo) return;

            const opt = convo.options[optionIndex];
            const historyEl = document.getElementById('rtConvoHistory');
            if (historyEl) {
                // إضافة رد التلميذ
                historyEl.innerHTML += `
                <div class="rt-chat-row user">
                    <div class="rt-speaker-avatar">⭐</div>
                    <div class="rt-chat-bubble">${opt.text}</div>
                </div>`;

                // رد المساعد
                setTimeout(() => {
                    const partner = PUPPETS_DATA[convo.partner] || PUPPETS_DATA.faseeh;
                    const feedback = opt.correct ?
                        'أَحْسَنْتَ يَا بَطَل! تَعْبِيرُكَ صَحِيحٌ وَنَبْرَتُكَ مُؤَدَّبَةٌ وَرَائِعَة! 🌟' :
                        'حَاوِلْ مَرَّةً أُخْرَى بِنَبْرَةٍ أَكْثَرَ لُطْفاً وَتَعْبِيراً يَا بَطَل! ✨';
                    historyEl.innerHTML += `
                    <div class="rt-chat-row partner">
                        <div class="rt-speaker-avatar">${partner.avatar}</div>
                        <div class="rt-chat-bubble">${feedback}</div>
                    </div>`;
                    historyEl.scrollTop = historyEl.scrollHeight;

                    if (opt.correct) {
                        this.playSoundEffect('cheer');
                        this.playSoundEffect('applause');
                    } else {
                        this.playSoundEffect('mystery');
                    }
                }, 600);

                historyEl.scrollTop = historyEl.scrollHeight;
            }
        },

        // زر التحدث عبر الميكروفون لمحاكاة الصوت الفوري
        simulateMicInput: function () {
            this.playSoundEffect('theater_bell');
            const historyEl = document.getElementById('rtConvoHistory');
            if (historyEl) {
                historyEl.innerHTML += `
                <div class="rt-chat-row user">
                    <div class="rt-speaker-avatar">🎙️</div>
                    <div class="rt-chat-bubble">«تَمَّ الاسْتِمَاعُ لِصَوْتِ التِّلْمِيذِ.. طَلَاقَةٌ تَعْبِيرِيَّةٌ مُمْتَازَة!»</div>
                </div>`;
                historyEl.scrollTop = historyEl.scrollHeight;
                setTimeout(() => {
                    this.playSoundEffect('fanfare');
                }, 400);
            }
        },

        // ======================================================================
        // 9. مولد تذاكر المسرح المدرسية الفاخرة A4 (Pupil Theater Tickets)
        // ======================================================================
        updateTicketPreview: function () {
            const play = PLAYS_BANK.find(p => p.id === State.currentPlayId) || PLAYS_BANK[0];
            const firstCast = play.cast[1] || play.cast[0];
            const pupilName = State.castAssignments[firstCast] || 'تِلْمِيذُ الصَّفِّ الأَوَّلِ المُبْدِع';
            const roleName = PUPPETS_DATA[firstCast]?.name || 'بَطَلُ المَسْرَحِيَّة';

            const titleEl = document.getElementById('rtTicketPlayTitle');
            if (titleEl) titleEl.textContent = play.title;

            const pupilEl = document.getElementById('rtTicketPupilName');
            if (pupilEl) pupilEl.textContent = pupilName;

            const roleEl = document.getElementById('rtTicketRoleName');
            if (roleEl) roleEl.textContent = `الدَّوْر: ${roleName}`;
        },

        printTicket: function () {
            this.playSoundEffect('fanfare');
            const play = PLAYS_BANK.find(p => p.id === State.currentPlayId) || PLAYS_BANK[0];
            const firstCast = play.cast[1] || play.cast[0];
            const pupilName = State.castAssignments[firstCast] || 'تِلْمِيذُ الصَّفِّ الأَوَّلِ المُبْدِع';
            const roleName = PUPPETS_DATA[firstCast]?.name || 'بَطَلُ المَسْرَحِيَّة';

            const container = document.getElementById('rtPrintableTicketContainer');
            if (container) {
                container.innerHTML = `
                <div style="padding: 40px; font-family: 'Scheherazade New', Tahoma, sans-serif; text-align: center; border: 8px double #d97706; border-radius: 24px; max-width: 750px; margin: 30px auto; background: #fffbeb;">
                    <div style="font-size: 2.4rem;">🎭 🎪 🌟</div>
                    <h1 style="color: #9a3412; font-size: 2rem; margin: 10px 0;">تَذْكِرَةُ مَسْرَحِ القِرَاءَةِ التَّعْبِيرِيَّةِ المَدْرَسِيّ</h1>
                    <div style="font-size: 1.25rem; font-weight: 800; color: #b45309;">مَنْظُومَةُ قِرَاءَتِي التَّفَاعُلِيَّةِ الذَّكِيَّةِ • المَنْهَجُ العِرَاقِيُّ الرَّسْمِيّ</div>
                    <hr style="border: 2px solid #fed7aa; margin: 20px 0;">
                    <div style="font-size: 1.4rem; color: #1e293b; margin: 15px 0;">
                        تَمَّ مَنْحُ هَذِهِ التَّذْكِرَةِ التَّقْدِيرِيَّةِ لِلْمُمَثِّلِ الصَّغِيرِ البَارِع:
                    </div>
                    <div style="font-size: 1.85rem; font-weight: 900; color: #be123c; background: #ffffff; padding: 8px 24px; border-radius: 16px; border: 2px dashed #f43f5e; display: inline-block; margin: 10px auto;">
                        ${pupilName}
                    </div>
                    <div style="font-size: 1.3rem; font-weight: 800; color: #047857; margin: 15px 0;">
                        لِأَدَائِهِ المُتَمَيِّزِ لِدَوْرِ: <span style="color: #b45309; text-decoration: underline;">${roleName}</span>
                    </div>
                    <div style="font-size: 1.2rem; font-weight: 700; color: #475569; margin: 10px 0;">
                        فِي ${play.title}
                    </div>
                    <div style="display: flex; justify-content: space-around; margin-top: 30px; font-size: 1rem; font-weight: 800; color: #78350f;">
                        <div>تَارِيخُ العَرْض: ${new Date().toLocaleDateString('ar-IQ')}</div>
                        <div>خَاتَمُ المَسْرَحِ الصَّفِيّ: ⭐⭐⭐⭐⭐</div>
                    </div>
                    <div style="margin-top: 30px; font-size: 0.95rem; font-weight: 700; color: #92400e; border-top: 1px solid #fed7aa; padding-top: 15px;">
                        إعداد وتطوير: المهندس أسامة خليل هاشم • منصة قراءتي التفاعلية الذكية
                    </div>
                </div>`;
                window.print();
            }
        },

        // تسجيل إتمام مسرحية وحفظ الإحصائيات
        recordCompletion: function () {
            try {
                let stats = JSON.parse(localStorage.getItem(STORAGE_KEY_STATS) || '{"playsCompleted": 0, "stars": 0}');
                stats.playsCompleted = (stats.playsCompleted || 0) + 1;
                stats.stars = (stats.stars || 0) + 5;
                localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
            } catch (e) {}
        }
    };

    // استرجاع توزيع الأدوار المحفوظ
    try {
        const savedCast = localStorage.getItem(STORAGE_KEY_CAST);
        if (savedCast) {
            State.castAssignments = JSON.parse(savedCast);
        }
    } catch (e) {}

    // تصدير الكائن العام
    window.ReadersTheater = ReadersTheater;

})();
