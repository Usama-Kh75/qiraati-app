/* ==========================================================================
 * منصة قراءتي التفاعلية الذكية - استوديو الأناشيد المنهجية والإنشاد الإيقاعي
 * التفاعلي بالدف المدرسي والتحليل الموسيقي (Interactive Phonics Nasheed & Rhythm Studio)
 * متوافق 100% مع كتاب قراءتي ومعايير وزارة التربية العراقية للأجهزة اللوحية والسبورات
 * إعداد وتطوير: المهندس أسامة خليل هاشم
 * ========================================================================== */

(function () {
    'use strict';

    // مفاتيح التخزين المعزولة ببادئة قواعد أسامة (qiraati-smart-)
    const STORAGE_KEY_SETTINGS = 'qiraati-smart-nasheed-studio-settings';
    const STORAGE_KEY_STATS = 'qiraati-smart-nasheed-studio-stats';
    const STORAGE_KEY_RECORDINGS = 'qiraati-smart-nasheed-studio-recordings';

    // ==========================================================================
    // 1. قاعدة بيانات الأناشيد المنهجية المعتمدة لكتاب قراءتي
    // ==========================================================================
    const NASHEEDS_DATA = [
        {
            id: 'duck',
            title: 'نَشِيدُ البَطَّة (اسْبَحْ بِالشَّطِّ)',
            unit: 'الوَحْدَةُ التَّمْهِيدِيَّةُ (ص 7)',
            icon: '🦆',
            rhythm: 'إيقاع النشاط والمرح (4/4)',
            defaultBpm: 100,
            color: '#0284c7',
            desc: 'أول نشيد في الكتاب المدرسي - تعليمي حركي يربط الأصوات والبيئة النهرية العراقية.',
            objectives: 'التمييز بين الأصوات المتشابهة، إتقان إيقاع الحركة والسباحة، تمثيل المعنى بالإنشاد الحركي.',
            vocabulary: [
                { word: 'اسْبَحْ', meaning: 'تَحَرَّكْ فِي المَاءِ بِأَمَان' },
                { word: 'الشَّطّ', meaning: 'ضَفَّةُ النَّهْرِ أَوْ نَهْرُ دِجْلَةَ وَالفُرَات' },
                { word: 'نُطّ', meaning: 'اقْفِزْ بِمَرَحٍ وَخِفَّة' },
                { word: 'تَغُوصْ', meaning: 'تَنْزِلُ تَحْتَ سَطْحِ المَاءِ' }
            ],
            melodyNotes: [
                { note: 'C4', dur: 0.5 }, { note: 'D4', dur: 0.5 }, { note: 'E4', dur: 0.5 }, { note: 'E4', dur: 0.5 },
                { note: 'G4', dur: 0.5 }, { note: 'G4', dur: 0.5 }, { note: 'E4', dur: 1.0 },
                { note: 'F4', dur: 0.5 }, { note: 'F4', dur: 0.5 }, { note: 'D4', dur: 0.5 }, { note: 'D4', dur: 0.5 },
                { note: 'C4', dur: 1.0 }, { note: 'C4', dur: 1.0 }
            ],
            verses: [
                {
                    h1: [
                        { text: 'اسْبَحْ', syllables: ['اسْـ', 'ـبَحْ'] },
                        { text: 'بِالشَّطِّ', syllables: ['بِشْـ', 'ـشَطْـ', 'ـطِ'] },
                        { text: 'يَا', syllables: ['يَا'] },
                        { text: 'بَطّ', syllables: ['بَطّ'] }
                    ],
                    h2: [
                        { text: 'وَالْعَبْ', syllables: ['وَلْـ', 'ـعَبْ'] },
                        { text: 'فِي', syllables: ['فِي'] },
                        { text: 'المَاءِ', syllables: ['الْـ', 'ـمَا', 'ءِ'] },
                        { text: 'وَنُطّ', syllables: ['وَ', 'نُطّ'] }
                    ]
                },
                {
                    h1: [
                        { text: 'أَنْتَ', syllables: ['أَنْـ', 'ـتَ'] },
                        { text: 'صَدِيقِي', syllables: ['صَـ', 'ـدِيـ', 'ـقِي'] },
                        { text: 'يَا', syllables: ['يَا'] },
                        { text: 'بَطّ', syllables: ['بَطّ'] }
                    ],
                    h2: [
                        { text: 'تَسْبَحُ', syllables: ['تَسْـ', 'ـبَـ', 'ـحُ'] },
                        { text: 'فِي', syllables: ['فِي'] },
                        { text: 'الشَّطِّ', syllables: ['الشَّطْـ', 'ـطِ'] },
                        { text: 'وَتَغُوصْ', syllables: ['وَ', 'تَـ', 'ـغُوصْ'] }
                    ]
                },
                {
                    h1: [
                        { text: 'تَأْكُلُ', syllables: ['تَأْ', 'كُـ', 'ـلُ'] },
                        { text: 'مِنْ', syllables: ['مِنْ'] },
                        { text: 'خَيْرِ', syllables: ['خَيْـ', 'ـرِ'] },
                        { text: 'النَّهْرِ', syllables: ['النَّـ', 'ـهْرِ'] }
                    ],
                    h2: [
                        { text: 'وَتُغَنِّي', syllables: ['وَ', 'تُـ', 'ـغَنِّـ', 'ـي'] },
                        { text: 'مَعَ', syllables: ['مَـ', 'ـعَ'] },
                        { text: 'ضَوْءِ', syllables: ['ضَوْ', 'ءِ'] },
                        { text: 'الفَجْرِ', syllables: ['الْـ', 'ـفَجْرِ'] }
                    ]
                },
                {
                    h1: [
                        { text: 'رِيشُكَ', syllables: ['رِيـ', 'ـشُـ', 'ـكَ'] },
                        { text: 'زَاهٍ', syllables: ['زَا', 'هٍ'] },
                        { text: 'يَا', syllables: ['يَا'] },
                        { text: 'بَطّ', syllables: ['بَطّ'] }
                    ],
                    h2: [
                        { text: 'اسْبَحْ', syllables: ['اسْـ', 'ـبَحْ'] },
                        { text: 'بِالشَّطِّ', syllables: ['بِشْـ', 'ـشَطْـ', 'ـطِ'] },
                        { text: 'وَنُطّ', syllables: ['وَ', 'نُطّ'] }
                    ]
                }
            ]
        },
        {
            id: 'mama_baba',
            title: 'نَشِيدُ (مَامَا بَابَا)',
            unit: 'خَاتِمَةُ الوَحْدَةِ الأُولَى (ص 30)',
            icon: '❤️',
            rhythm: 'إيقاع المقدار الوجداني الحنون (4/4)',
            defaultBpm: 85,
            color: '#e11d48',
            desc: 'نشيد وجداني عاطفي يعزز بر الوالدين ومكانة الأسرة المترابطة بنبرة دافئة عذبة.',
            objectives: 'غرس محبة الوالدين، إتقان المدود الطويلة (الألف والواو والياء)، التعبير الوجداني الإنشادي.',
            vocabulary: [
                { word: 'فُؤَادِي', meaning: 'قَلْبِي وَمَشَاعِرِي الرَّقِيقَة' },
                { word: 'ضِيَائِي', meaning: 'نُورِي الَّذِي يُضِيءُ دَرْبِي' },
                { word: 'رَجَائِي', meaning: 'أَمَلِي وَأُمْنِيَتِي الغَالِيَة' },
                { word: 'دُمْتَ', meaning: 'بَقِيتَ لِي سَالِماً وَمُعَافَى' }
            ],
            melodyNotes: [
                { note: 'G4', dur: 0.5 }, { note: 'A4', dur: 0.5 }, { note: 'G4', dur: 0.5 }, { note: 'F4', dur: 0.5 },
                { note: 'E4', dur: 1.0 }, { note: 'D4', dur: 1.0 },
                { note: 'C4', dur: 0.5 }, { note: 'E4', dur: 0.5 }, { note: 'G4', dur: 1.0 },
                { note: 'A4', dur: 1.0 }, { note: 'G4', dur: 1.0 }
            ],
            verses: [
                {
                    h1: [
                        { text: 'مَامَا', syllables: ['مَا', 'مَا'] },
                        { text: 'مَامَا', syllables: ['مَا', 'مَا'] },
                        { text: 'بَابَا', syllables: ['بَا', 'بَا'] },
                        { text: 'بَابَا', syllables: ['بَا', 'بَا'] }
                    ],
                    h2: [
                        { text: 'يَا', syllables: ['يَا'] },
                        { text: 'حَبِيبِي', syllables: ['حَـ', 'ـبِيـ', 'ـبِي'] },
                        { text: 'يَا', syllables: ['يَا'] },
                        { text: 'فُؤَادِي', syllables: ['فُـ', 'ـؤَا', 'دِي'] }
                    ]
                },
                {
                    h1: [
                        { text: 'دُمْتَ', syllables: ['دُمْـ', 'ـتَ'] },
                        { text: 'لِي', syllables: ['لِي'] },
                        { text: 'نُورَ', syllables: ['نُو', 'رَ'] },
                        { text: 'البِلادِ', syllables: ['الْـ', 'ـبِـ', 'ـلادِ'] }
                    ],
                    h2: [
                        { text: 'أَنْتَ', syllables: ['أَنْـ', 'ـتَ'] },
                        { text: 'يَا', syllables: ['يَا'] },
                        { text: 'بَابَا', syllables: ['بَا', 'بَا'] },
                        { text: 'ضِيَائِي', syllables: ['ضِـ', 'ـيَا', 'ئِي'] }
                    ]
                },
                {
                    h1: [
                        { text: 'أَنْتِ', syllables: ['أَنْـ', 'ـتِ'] },
                        { text: 'يَا', syllables: ['يَا'] },
                        { text: 'أُمِّي', syllables: ['أُمْـ', 'ـمِي'] },
                        { text: 'رَجَائِي', syllables: ['رَ', 'جَا', 'ئِي'] }
                    ],
                    h2: [
                        { text: 'فِي', syllables: ['فِي'] },
                        { text: 'عُيُونِي', syllables: ['عُـ', 'ـيُو', 'نِي'] },
                        { text: 'أَنْتُمَا', syllables: ['أَنْـ', 'ـتُـ', 'ـمَا'] }
                    ]
                },
                {
                    h1: [
                        { text: 'فِي', syllables: ['فِي'] },
                        { text: 'فُؤَادِي', syllables: ['فُـ', 'ـؤَا', 'دِي'] },
                        { text: 'أَنْتُمَا', syllables: ['أَنْـ', 'ـتُـ', 'ـمَا'] }
                    ],
                    h2: [
                        { text: 'مَامَا', syllables: ['مَا', 'مَا'] },
                        { text: 'مَامَا', syllables: ['مَا', 'مَا'] },
                        { text: 'بَابَا', syllables: ['بَا', 'بَا'] },
                        { text: 'بَابَا', syllables: ['بَا', 'بَا'] }
                    ]
                }
            ]
        },
        {
            id: 'school',
            title: 'نَشِيدُ (مَدْرَسَتِي)',
            unit: 'خَاتِمَةُ الوَحْدَةِ الثَّانِيَةِ (ص 48)',
            icon: '🏫',
            rhythm: 'إيقاع المسيرة المدرسية الصباحية (4/4)',
            defaultBpm: 95,
            color: '#16a34a',
            desc: 'نشيد الفخر بالمدرسة والزملاء والمعلمين، يعزز الانتماء والشغف بالتعلم والقراءة.',
            objectives: 'حب المدرسة وتقدير المعلم، الطلاقة في نطق التاء المربوطة والمفتوحة، الانضباط الإيقاعي الجماعي.',
            vocabulary: [
                { word: 'الأَصْحَاب', meaning: 'الأَصْدِقَاءُ وَالزُّمَلاءُ الأَحِبَّاء' },
                { word: 'نَتْلُو', meaning: 'نَقْرَأُ بِصَوْتٍ جَمِيلٍ وَمُنَغَّم' },
                { word: 'دَارَ العِلْمِ', meaning: 'المَدْرَسَةُ الَّتِي تُعَلِّمُنَا الحِكْمَة' },
                { word: 'ارْتِقَاء', meaning: 'صُعُودٌ وَتَفَوُّقٌ وَنَجَاحٌ بَاهِر' }
            ],
            melodyNotes: [
                { note: 'C4', dur: 0.5 }, { note: 'E4', dur: 0.5 }, { note: 'G4', dur: 0.5 }, { note: 'G4', dur: 0.5 },
                { note: 'F4', dur: 0.5 }, { note: 'E4', dur: 0.5 }, { note: 'D4', dur: 1.0 },
                { note: 'C4', dur: 0.5 }, { note: 'E4', dur: 0.5 }, { note: 'G4', dur: 0.5 }, { note: 'C5', dur: 1.0 }
            ],
            verses: [
                {
                    h1: [
                        { text: 'مَدْرَسَتِي', syllables: ['مَدْ', 'رَ', 'سَـ', 'ـتِي'] },
                        { text: 'حُلْوَةْ', syllables: ['حُلْـ', 'ـوَةْ'] }
                    ],
                    h2: [
                        { text: 'فِيهَا', syllables: ['فِيـ', 'ـهَا'] },
                        { text: 'الأَصْحَابْ', syllables: ['الْأَصْـ', 'ـحَابْ'] }
                    ]
                },
                {
                    h1: [
                        { text: 'نَقْرَأُ', syllables: ['نَقْـ', 'ـرَ', 'أُ'] },
                        { text: 'نَكْتُبْ', syllables: ['نَكْـ', 'ـتُبْ'] }
                    ],
                    h2: [
                        { text: 'نَتْلُو', syllables: ['نَتْـ', 'ـلُو'] },
                        { text: 'الكِتَابْ', syllables: ['الْـ', 'ـكِـ', 'ـتَابْ'] }
                    ]
                },
                {
                    h1: [
                        { text: 'مَدْرَسَتِي', syllables: ['مَدْ', 'رَ', 'سَـ', 'ـتِي'] },
                        { text: 'يَا', syllables: ['يَا'] },
                        { text: 'دَارَ', syllables: ['دَا', 'رَ'] },
                        { text: 'العِلْمِ', syllables: ['الْـ', 'ـعِلْمِ'] }
                    ],
                    h2: [
                        { text: 'فِيكِ', syllables: ['فِيـ', 'ـكِ'] },
                        { text: 'نُحَقِّقُ', syllables: ['نُـ', 'ـحَقْـ', 'ـقِـ', 'ـقُ'] },
                        { text: 'أَحْلَى', syllables: ['أَحْـ', 'ـلَى'] },
                        { text: 'حُلْمِ', syllables: ['حُلْمِ'] }
                    ]
                },
                {
                    h1: [
                        { text: 'مَعَ', syllables: ['مَـ', 'ـعَ'] },
                        { text: 'إِخْوَتِي', syllables: ['إِخْـ', 'ـوَ', 'تِي'] },
                        { text: 'مَعَ', syllables: ['مَـ', 'ـعَ'] },
                        { text: 'أَصْدِقَائِي', syllables: ['أَصْـ', 'ـدِ', 'قَا', 'ئِي'] }
                    ],
                    h2: [
                        { text: 'نَمْضِي', syllables: ['نَمْـ', 'ـضِي'] },
                        { text: 'إِلَيْهَا', syllables: ['إِ', 'لَيْـ', 'ـهَا'] },
                        { text: 'بِارْتِقَاءِ', syllables: ['بِارْ', 'تِـ', 'ـقَا', 'ءِ'] }
                    ]
                }
            ]
        },
        {
            id: 'lets_play',
            title: 'نَشِيدُ (هَيَّا نَلْعَبْ)',
            unit: 'الوَحْدَةُ الرَّابِعَةُ (ص 108)',
            icon: '🪁',
            rhythm: 'إيقاع الهزج واللعب الحركي (2/4)',
            defaultBpm: 105,
            color: '#ea580c',
            desc: 'نشيد طفولي بهيج عن الرياضة وصنع الطائرات الورقية وبناء المكعبات والنشاط الصفي.',
            objectives: 'تمييز الحروف المشددة (الشدة ـّ)، التوازن الحركي الإيقاعي، إبراز نبرة الفرح والبهجة.',
            vocabulary: [
                { word: 'البُسْتَان', meaning: 'حَدِيقَةٌ فِيهَا أَشْجَارٌ وَأَزْهَارٌ مُلَوَّنَة' },
                { word: 'المُكَعَّب', meaning: 'لُعْبَةُ بِنَاءِ البُيُوتِ وَالقِلاعِ الخَشَبِيَّة' },
                { word: 'طَيَّارَةَ وَرَقِ', meaning: 'طَائِرَةٌ نَصْنَعُهَا بِأَيْدِينَا لِتَطِيرَ فِي الهَوَاء' },
                { word: 'الأُفُق', meaning: 'مَدَى الرُّؤْيَةِ البَعِيدُ حَيْثُ تَلْتَقِي السَّمَاءُ بِالأَرْض' }
            ],
            melodyNotes: [
                { note: 'E4', dur: 0.5 }, { note: 'F4', dur: 0.5 }, { note: 'G4', dur: 0.5 }, { note: 'G4', dur: 0.5 },
                { note: 'A4', dur: 0.5 }, { note: 'G4', dur: 0.5 }, { note: 'F4', dur: 0.5 }, { note: 'E4', dur: 1.0 }
            ],
            verses: [
                {
                    h1: [
                        { text: 'هَيَّا', syllables: ['هَيْـ', 'ـيَا'] },
                        { text: 'نَلْعَبْ', syllables: ['نَلْـ', 'ـعَبْ'] },
                        { text: 'هَيَّا', syllables: ['هَيْـ', 'ـيَا'] },
                        { text: 'نَلْعَبْ', syllables: ['نَلْـ', 'ـعَبْ'] }
                    ],
                    h2: [
                        { text: 'فِي', syllables: ['فِي'] },
                        { text: 'البُسْتَانِ', syllables: ['الْـ', 'ـبُسْـ', 'ـتَا', 'نِ'] },
                        { text: 'أَوْ', syllables: ['أَوْ'] },
                        { text: 'فِي', syllables: ['فِي'] },
                        { text: 'المَلْعَبْ', syllables: ['الْـ', 'ـمَلْـ', 'ـعَبْ'] }
                    ]
                },
                {
                    h1: [
                        { text: 'نَبْنِي', syllables: ['نَبْـ', 'ـنِي'] },
                        { text: 'دَاراً', syllables: ['دَا', 'راً'] },
                        { text: 'بِالمُكَعَّبْ', syllables: ['بِلْـ', 'ـمُـ', 'ـكَعْـ', 'ـعَبْ'] }
                    ],
                    h2: [
                        { text: 'نَصْنَعُ', syllables: ['نَصْـ', 'ـنَـ', 'ـعُ'] },
                        { text: 'طَيَّارَةَ', syllables: ['طَيْـ', 'ـيَا', 'رَ', 'ةَ'] },
                        { text: 'وَرَقِ', syllables: ['وَ', 'رَ', 'قِ'] }
                    ]
                },
                {
                    h1: [
                        { text: 'تَعْلُو', syllables: ['تَعْـ', 'ـلُو'] },
                        { text: 'فِي', syllables: ['فِي'] },
                        { text: 'جَوٍّ', syllables: ['جَـ', 'ـوٍّ'] },
                        { text: 'كَالأُفُقِ', syllables: ['كَلْـ', 'ـأُ', 'فُـ', 'ـقِ'] }
                    ],
                    h2: [
                        { text: 'نَفْرَحُ', syllables: ['نَفْـ', 'ـرَ', 'حُ'] },
                        { text: 'نَمْرَحُ', syllables: ['نَمْـ', 'ـرَ', 'حُ'] },
                        { text: 'كُلَّ', syllables: ['كُلْـ', 'ـلَ'] },
                        { text: 'حِينْ', syllables: ['حِينْ'] }
                    ]
                },
                {
                    h1: [
                        { text: 'نَسْعَى', syllables: ['نَسْـ', 'ـعَى'] },
                        { text: 'جِدّاً', syllables: ['جِدْ', 'داً'] },
                        { text: 'فِي', syllables: ['فِي'] },
                        { text: 'كُلِّ', syllables: ['كُلْـ', 'ـلِ'] },
                        { text: 'أَمْرِ', syllables: ['أَمْرِ'] }
                    ],
                    h2: [
                        { text: 'وَنَصُونُ', syllables: ['وَ', 'نَـ', 'ـصُو', 'نُ'] },
                        { text: 'أَحْلَى', syllables: ['أَحْـ', 'ـلَى'] },
                        { text: 'أَيَّامِ', syllables: ['أَيْـ', 'ـيَا', 'مِ'] },
                        { text: 'العُمْرِ', syllables: ['الْـ', 'ـعُمْرِ'] }
                    ]
                }
            ]
        },
        {
            id: 'farewell',
            title: 'نَشِيدُ (إِلَى اللِّقَاءِ مَدْرَسَتِي)',
            unit: 'خَاتِمَةُ العَامِ وَالوَحْدَةِ الخَامِسَةِ (ص 123 - 126)',
            icon: '🌟',
            rhythm: 'إيقاع الوفاء والشوق والأمل (4/4)',
            defaultBpm: 88,
            color: '#8b5cf6',
            desc: 'نشيد ختام العام الدراسي والنجاح الباهر، يودع الصف الأول ببهجة الترقية إلى الصف الثاني.',
            objectives: 'شكر المعلم والاعتراف بالفضل، التعبير عن بهجة النجاح والترقية، إتقان نطق اللام القمرية والشمسية.',
            vocabulary: [
                { word: 'صَحْبِي', meaning: 'أَصْدِقَائِي الأَوْفِيَاء فِي الفَصْلِ الدِّرَاسِيّ' },
                { word: 'قَضَيْتُ', meaning: 'عِشْتُ أَيَّاماً سَعِيدَةً مُثْمِرَة' },
                { word: 'أَدَبِي', meaning: 'حُسْنُ أَخْلاقِي وَتَهْذِيبِي العَالِي' },
                { word: 'مَجْدِنَا', meaning: 'رِفْعَتُنَا وَعِزُّنَا فِي خِدْمَةِ الوَطَن' }
            ],
            melodyNotes: [
                { note: 'C4', dur: 0.5 }, { note: 'D4', dur: 0.5 }, { note: 'E4', dur: 0.5 }, { note: 'D4', dur: 0.5 },
                { note: 'C4', dur: 0.5 }, { note: 'E4', dur: 0.5 }, { note: 'G4', dur: 1.0 },
                { note: 'F4', dur: 0.5 }, { note: 'E4', dur: 0.5 }, { note: 'D4', dur: 0.5 }, { note: 'C4', dur: 1.0 }
            ],
            verses: [
                {
                    h1: [
                        { text: 'إِلَى', syllables: ['إِ', 'لَى'] },
                        { text: 'اللِّقَاءِ', syllables: ['اللِّـ', 'ـقَا', 'ءِ'] },
                        { text: 'مَدْرَسَتِي', syllables: ['مَدْ', 'رَ', 'سَـ', 'ـتِي'] }
                    ],
                    h2: [
                        { text: 'إِلَى', syllables: ['إِ', 'لَى'] },
                        { text: 'اللِّقَاءِ', syllables: ['اللِّـ', 'ـقَا', 'ءِ'] },
                        { text: 'يَا', syllables: ['يَا'] },
                        { text: 'صَحْبِي', syllables: ['صَحْـ', 'ـبِي'] }
                    ]
                },
                {
                    h1: [
                        { text: 'قَضَيْتُ', syllables: ['قَـ', 'ـضَيْـ', 'ـتُ'] },
                        { text: 'فِيكِ', syllables: ['فِيـ', 'ـكِ'] },
                        { text: 'سَنَتِي', syllables: ['سَـ', 'ـنَـ', 'ـتِي'] }
                    ],
                    h2: [
                        { text: 'حَمَلْتُ', syllables: ['حَـ', 'ـمَلْـ', 'ـتُ'] },
                        { text: 'نُورَ', syllables: ['نُو', 'رَ'] },
                        { text: 'أَدَبِي', syllables: ['أَ', 'دَ', 'بِي'] }
                    ]
                },
                {
                    h1: [
                        { text: 'سَنَلْتَقِي', syllables: ['سَـ', 'ـنَلْـ', 'ـتَـ', 'ـقِي'] },
                        { text: 'فِي', syllables: ['فِي'] },
                        { text: 'غَدِنَا', syllables: ['غَـ', 'ـدِ', 'نَا'] }
                    ],
                    h2: [
                        { text: 'فِي', syllables: ['فِي'] },
                        { text: 'عِزِّنَا', syllables: ['عِزْ', 'زِ', 'نَا'] },
                        { text: 'وَمَجْدِنَا', syllables: ['وَ', 'مَجْـ', 'ـدِ', 'نَا'] }
                    ]
                },
                {
                    h1: [
                        { text: 'شُكْراً', syllables: ['شُكْـ', 'ـراً'] },
                        { text: 'لِمُعَلِّمِي', syllables: ['لِـ', 'ـمُـ', 'ـعَلْـ', 'ـلِـ', 'ـمِي'] },
                        { text: 'الكَرِيمْ', syllables: ['الْـ', 'ـكَـ', 'ـرِيمْ'] }
                    ],
                    h2: [
                        { text: 'شُكْراً', syllables: ['شُكْـ', 'ـراً'] },
                        { text: 'لِعِلْمِكَ', syllables: ['لِـ', 'ـعِلْـ', 'ـمِـ', 'ـكَ'] },
                        { text: 'العَظِيمْ', syllables: ['الْـ', 'ـعَـ', 'ـظِيمْ'] }
                    ]
                }
            ]
        },
        {
            id: 'iraq_flag',
            title: 'نَشِيدُ (عَلَمِي وَعَلَمُ بِلادِي)',
            unit: 'تَحِيَّةُ العَلَمِ وَالوَطَنِيَّةِ (الرَّفْعَةُ وَالمَجْد)',
            icon: '🇮🇶',
            rhythm: 'إيقاع المسيرة الوطنية المهيبة (4/4)',
            defaultBpm: 110,
            color: '#b91c1c',
            desc: 'نشيد تحية العلم العراقي الصباحية، يغرس حب العراق ووحدته والفخر براية المجد خفاقة.',
            objectives: 'ترسيخ الانتماء الوطني، النطق السليم للهمزات والمدود، استشعار عزة راية الوطن وشموخها.',
            vocabulary: [
                { word: 'قِمَم', meaning: 'أَعَالِي الجِبَالِ الشَّاهِقَة' },
                { word: 'رِفْعَتِكَ', meaning: 'عُلُوِّكَ وَمَكَانَتِكَ السَّامِيَة' },
                { word: 'الفَخَار', meaning: 'الشَّرَفُ وَالعِزَّةُ وَالكَرَامَة' },
                { word: 'رَفْرِفْ', meaning: 'تَحَرَّكْ فِي الهَوَاءِ شَامِخاً مُنْتَصِراً' }
            ],
            melodyNotes: [
                { note: 'G4', dur: 0.5 }, { note: 'C5', dur: 1.0 }, { note: 'B4', dur: 0.5 }, { note: 'A4', dur: 0.5 },
                { note: 'G4', dur: 1.0 }, { note: 'F4', dur: 0.5 }, { note: 'E4', dur: 0.5 }, { note: 'D4', dur: 0.5 },
                { note: 'C4', dur: 1.0 }
            ],
            verses: [
                {
                    h1: [
                        { text: 'عَلَمِي', syllables: ['عَـ', 'ـلَـ', 'ـمِي'] },
                        { text: 'عَلَمِي', syllables: ['عَـ', 'ـلَـ', 'ـمِي'] },
                        { text: 'يَا', syllables: ['يَا'] },
                        { text: 'عَلَمِي', syllables: ['عَـ', 'ـلَـ', 'ـمِي'] }
                    ],
                    h2: [
                        { text: 'يَا', syllables: ['يَا'] },
                        { text: 'أَعْلَى', syllables: ['أَعْـ', 'ـلَى'] },
                        { text: 'مِنْ', syllables: ['مِنْ'] },
                        { text: 'كُلِّ', syllables: ['كُلْـ', 'ـلِ'] },
                        { text: 'قِمَمِ', syllables: ['قِـ', 'ـمَـ', 'ـمِ'] }
                    ]
                },
                {
                    h1: [
                        { text: 'فِي', syllables: ['فِي'] },
                        { text: 'رِفْعَتِكَ', syllables: ['رِفْـ', 'ـعَـ', 'ـتِـ', 'ـكَ'] },
                        { text: 'نُورُ', syllables: ['نُو', 'رُ'] },
                        { text: 'الأَمَلِ', syllables: ['الْأَ', 'مَـ', 'ـلِ'] }
                    ],
                    h2: [
                        { text: 'رَفْرِفْ', syllables: ['رَفْـ', 'ـرِفْ'] },
                        { text: 'فِي', syllables: ['فِي'] },
                        { text: 'سَمَاءِ', syllables: ['سَـ', 'ـمَا', 'ءِ'] },
                        { text: 'البَطَلِ', syllables: ['الْـ', 'ـبَـ', 'ـطَـ', 'ـلِ'] }
                    ]
                },
                {
                    h1: [
                        { text: 'عِشْتَ', syllables: ['عِشْـ', 'ـتَ'] },
                        { text: 'لَنَا', syllables: ['لَـ', 'ـنَا'] },
                        { text: 'رَمْزَ', syllables: ['رَمْـ', 'ـزَ'] },
                        { text: 'الفَخَارْ', syllables: ['الْـ', 'ـفَـ', 'ـخَارْ'] }
                    ],
                    h2: [
                        { text: 'فِي', syllables: ['فِي'] },
                        { text: 'اللَّيْلِ', syllables: ['اللَّيْـ', 'ـلِ'] },
                        { text: 'وَضَوْءِ', syllables: ['وَ', 'ضَوْ', 'ءِ'] },
                        { text: 'النَّهَارْ', syllables: ['النَّـ', 'ـهَارْ'] }
                    ]
                },
                {
                    h1: [
                        { text: 'أَلْوَانُكَ', syllables: ['أَلْـ', 'ـوَا', 'نُـ', 'ـكَ'] },
                        { text: 'سِحْرُ', syllables: ['سِحْـ', 'ـرُ'] },
                        { text: 'الإِبْهَارْ', syllables: ['الْإِبْـ', 'ـهَارْ'] }
                    ],
                    h2: [
                        { text: 'تَحْمِي', syllables: ['تَحْـ', 'ـمِي'] },
                        { text: 'أَرْضَنَا', syllables: ['أَرْ', 'ضَـ', 'ـنَا'] },
                        { text: 'وَالدَّارْ', syllables: ['وَدْ', 'دَارْ'] }
                    ]
                }
            ]
        },
        {
            id: 'phonics_train',
            title: 'أُنْشُودَةُ الحَرَكَاتِ وَقِطَارِ الحُرُوف',
            unit: 'التَّأْسِيسُ الفُونِيمِيُّ الشَّامِل',
            icon: '🚂',
            rhythm: 'إيقاع التقطيع الهجائي التأسيسي (4/4)',
            defaultBpm: 92,
            color: '#d97706',
            desc: 'أنشودة الحركات القصيرة (الفتحة والضمة والكسرة) والمدود الطويلة والتنوين بنغم شجي محبب.',
            objectives: 'التمييز بين الصوت القصير والصوت الطويل، نطق الفتحة والضمة والكسرة بحركة الشفاه السليمة.',
            vocabulary: [
                { word: 'فَتْحَة', meaning: 'نَفْتَحُ فَمَنَا بِصَوْتٍ قَصِيرٍ جَمِيل (ـَ)' },
                { word: 'ضَمَّة', meaning: 'نَضُمُّ شَفَتَيْنَا بِلُطْفٍ كَالوَاوِ الصَّغِيرَة (ـُ)' },
                { word: 'كَسْرَة', meaning: 'نَبْتَسِمُ فَرَحاً عِنْدَ نُطْقِهَا تَحْتَ الحَرْف (ـِ)' },
                { word: 'تَنْوِين', meaning: 'صَوْتُ جَرَسِ النُّونِ الرَّنَّانِ فِي آخِرِ الاسْم' }
            ],
            melodyNotes: [
                { note: 'C4', dur: 0.5 }, { note: 'D4', dur: 0.5 }, { note: 'E4', dur: 0.5 }, { note: 'F4', dur: 0.5 },
                { note: 'G4', dur: 1.0 }, { note: 'G4', dur: 1.0 },
                { note: 'F4', dur: 0.5 }, { note: 'E4', dur: 0.5 }, { note: 'D4', dur: 1.0 }, { note: 'C4', dur: 1.0 }
            ],
            verses: [
                {
                    h1: [
                        { text: 'فَتْحَةٌ', syllables: ['فَتْـ', 'ـحَـ', 'ـتُنْ'] },
                        { text: 'فَوْقَ', syllables: ['فَوْ', 'قَ'] },
                        { text: 'الرَّأْسِ', syllables: ['الرَّأْ', 'سِ'] },
                        { text: 'تَقُولْ', syllables: ['تَـ', 'ـقُولْ'] }
                    ],
                    h2: [
                        { text: 'أَ', syllables: ['أَ'] },
                        { text: 'دَ', syllables: ['دَ'] },
                        { text: 'رَ', syllables: ['رَ'] },
                        { text: 'فَرَحٌ', syllables: ['فَـ', 'ـرَ', 'حُنْ'] },
                        { text: 'مَوْصُولْ', syllables: ['مَوْ', 'صُولْ'] }
                    ]
                },
                {
                    h1: [
                        { text: 'ضَمَّةٌ', syllables: ['ضَمْـ', 'ـمَـ', 'ـتُنْ'] },
                        { text: 'حُلْوَةٌ', syllables: ['حُلْـ', 'ـوَ', 'تُنْ'] },
                        { text: 'كَالوَاوْ', syllables: ['كَلْـ', 'ـوَاوْ'] }
                    ],
                    h2: [
                        { text: 'أُ', syllables: ['أُ'] },
                        { text: 'دُ', syllables: ['دُ'] },
                        { text: 'رُ', syllables: ['رُ'] },
                        { text: 'صَوْتُ', syllables: ['صَوْ', 'تُ'] },
                        { text: 'النَّاوْ', syllables: ['النَّاوْ'] }
                    ]
                },
                {
                    h1: [
                        { text: 'كَسْرَةٌ', syllables: ['كَسْـ', 'ـرَ', 'تُنْ'] },
                        { text: 'تَحْتَ', syllables: ['تَحْـ', 'ـتَ'] },
                        { text: 'الحَرْفِ', syllables: ['الْـ', 'ـحَرْ', 'فِ'] },
                        { text: 'هُنَا', syllables: ['هُـ', 'ـنَا'] }
                    ],
                    h2: [
                        { text: 'إِ', syllables: ['إِ'] },
                        { text: 'دِ', syllables: ['دِ'] },
                        { text: 'رِ', syllables: ['رِ'] },
                        { text: 'نَبْتَسِمُ', syllables: ['نَبْـ', 'ـتَـ', 'ـسِـ', 'ـمُ'] },
                        { text: 'أَنَا', syllables: ['أَ', 'نَا'] }
                    ]
                },
                {
                    h1: [
                        { text: 'مَدُّ', syllables: ['مَدْ', 'دُ'] },
                        { text: 'الأَلِفِ', syllables: ['الْأَ', 'لِـ', 'ـفِ'] },
                        { text: 'وَالوَاوِ', syllables: ['وَلْـ', 'ـوَا', 'وِ'] },
                        { text: 'وَاليَاءْ', syllables: ['وَلْـ', 'ـيَاءْ'] }
                    ],
                    h2: [
                        { text: 'أَنْغَامٌ', syllables: ['أَنْـ', 'ـغَا', 'مُنْ'] },
                        { text: 'تَمْلأُ', syllables: ['تَمْـ', 'ـلأُ'] },
                        { text: 'الأَرْجَاءْ', syllables: ['الْأَرْ', 'جَاءْ'] }
                    ]
                }
            ]
        }
    ];

    // ==========================================================================
    // 2. محرك الصوت والإيقاع التفاعلي الفائق (Web Audio Interactive Sound Engine)
    // ==========================================================================
    let audioCtx = null;
    let masterGain = null;
    let reverbGain = null;
    let delayNode = null;
    let analyserNode = null;

    function initAudioContext() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                audioCtx = new AudioContextClass();
                masterGain = audioCtx.createGain();
                masterGain.gain.setValueAtTime(0.85, audioCtx.currentTime);

                // إعداد المحلل الصوتي الطيفي
                analyserNode = audioCtx.createAnalyser();
                analyserNode.fftSize = 256;
                analyserNode.smoothingTimeConstant = 0.8;

                // إعداد دارة الصدى والارتداد الصفي (Classroom Echo & Reverb)
                delayNode = audioCtx.createDelay();
                delayNode.delayTime.setValueAtTime(0.22, audioCtx.currentTime);

                reverbGain = audioCtx.createGain();
                reverbGain.gain.setValueAtTime(0.35, audioCtx.currentTime);

                // دارة التغذية الراجعة
                delayNode.connect(reverbGain);
                reverbGain.connect(delayNode);
                reverbGain.connect(masterGain);

                masterGain.connect(analyserNode);
                analyserNode.connect(audioCtx.destination);
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    // توليد نغمة الدف المدرسي: دُم (DUM) العميقة الرنانة
    function playDumSound() {
        initAudioContext();
        if (!audioCtx) return;

        const now = audioCtx.currentTime;

        // مذبذب النبضة العميقة (Sub-bass pitch drop)
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(135, now);
        osc.frequency.exponentialRampToValueAtTime(52, now + 0.35);

        gain.gain.setValueAtTime(1.0, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        // مرشح تمرير منخفض لمحاكاة جلد الدف الجلدي الطبيعي
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, now);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);

        osc.start(now);
        osc.stop(now + 0.46);

        // صدى طفيف للدم لإعطاء عمق القاعة المدرسية
        if (delayNode) {
            gain.connect(delayNode);
        }
    }

    // توليد نغمة الدف المدرسي: تَكْ (TAK) الحادة على الإطار
    function playTakSound() {
        initAudioContext();
        if (!audioCtx) return;

        const now = audioCtx.currentTime;

        // 1. نقرة خشبية حادة
        const osc = audioCtx.createOscillator();
        const oscGain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(460, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.08);

        oscGain.gain.setValueAtTime(0.8, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

        osc.connect(oscGain);
        oscGain.connect(masterGain);

        osc.start(now);
        osc.stop(now + 0.1);

        // 2. ضوضاء بيضاء رنانة لحافة الدف
        const bufferSize = audioCtx.sampleRate * 0.06;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
        }

        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;

        const noiseFilter = audioCtx.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.setValueAtTime(1600, now);

        const noiseGain = audioCtx.createGain();
        noiseGain.gain.setValueAtTime(0.65, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(masterGain);

        noise.start(now);
        noise.stop(now + 0.075);
    }

    // توليد رنين صنوخ الرق (Zills / Jingles)
    function playJinglesSound() {
        initAudioContext();
        if (!audioCtx) return;

        const now = audioCtx.currentTime;
        const freqs = [3400, 4800, 6200, 7800];

        freqs.forEach((freq, idx) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq + (idx * 15), now);

            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

            osc.connect(gain);
            gain.connect(masterGain);

            osc.start(now);
            osc.stop(now + 0.29);
        });
    }

    // توليد تصفيق صفي حي (Classroom Clapping)
    function playClapSound() {
        initAudioContext();
        if (!audioCtx) return;

        const now = audioCtx.currentTime;
        // محاكاة التقاء كفي التلميذ بضربات متقاربة سريعة
        [0, 0.012, 0.024].forEach((delay) => {
            const bufferSize = audioCtx.sampleRate * 0.05;
            const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1);
            }

            const noise = audioCtx.createBufferSource();
            noise.buffer = buffer;

            const filter = audioCtx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(1100, now + delay);
            filter.Q.setValueAtTime(2.5, now + delay);

            const gain = audioCtx.createGain();
            gain.gain.setValueAtTime(0.6, now + delay);
            gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.08);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(masterGain);

            noise.start(now + delay);
            noise.stop(now + delay + 0.09);
        });
    }

    // توليد رنين المثلث المدرسي (School Triangle)
    function playTriangleSound() {
        initAudioContext();
        if (!audioCtx) return;

        const now = audioCtx.currentTime;
        const freqs = [2400, 4220, 6180];

        freqs.forEach((freq, idx) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);

            const initialGain = idx === 0 ? 0.35 : 0.15;
            gain.gain.setValueAtTime(initialGain, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

            osc.connect(gain);
            gain.connect(masterGain);

            osc.start(now);
            osc.stop(now + 1.25);
        });
    }

    // توليد شخشيخة الماراكاس (Maracas)
    function playMaracasSound() {
        initAudioContext();
        if (!audioCtx) return;

        const now = audioCtx.currentTime;
        const bufferSize = audioCtx.sampleRate * 0.08;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1);
        }

        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(4500, now);

        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);

        noise.start(now);
        noise.stop(now + 0.1);
    }

    // جدول ترددات النوتات الموسيقية (Notes Frequency Map)
    const NOTE_FREQS = {
        'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23,
        'G4': 392.00, 'A4': 440.00, 'B4': 493.88, 'C5': 523.25,
        'D5': 587.33, 'E5': 659.25
    };

    // عزف نغمة موسيقية بلحن الماريمبا / الزيلوفون المدرسي
    function playMelodyNote(noteName, duration = 0.5) {
        initAudioContext();
        if (!audioCtx) return;

        const freq = NOTE_FREQS[noteName] || 330;
        const now = audioCtx.currentTime;

        // نغمة أساسية + توافقيات زيلوفونية ناعمة
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const noteGain = audioCtx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(freq, now);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(freq * 2, now);

        noteGain.gain.setValueAtTime(0.4, now);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc1.connect(noteGain);
        osc2.connect(noteGain);
        noteGain.connect(masterGain);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + duration + 0.05);
        osc2.stop(now + duration + 0.05);
    }

    // ==========================================================================
    // 3. حالة استوديو الأناشيد والإعدادات (State Management)
    // ==========================================================================
    const state = {
        currentNasheedIdx: 0,
        isPlaying: false,
        playInterval: null,
        currentBpm: 95,
        isSyllablesMode: false,
        isDuffAccompEnabled: true,
        isVocalsEnabled: true,
        currentVerseIdx: 0,
        currentWordIdx: 0,
        currentStep: 0,
        activeTab: 'stage',
        visualizerMode: 'bars', // bars, wave, circles
        visualizerAnimFrame: null,
        challengeActive: false,
        challengeScore: 0,
        challengeAccuracy: 100,
        challengeStreak: 0,
        challengeInterval: null,
        challengeNotes: [],
        recorder: null,
        recordedChunks: [],
        recordedAudioUrl: null,
        activeReverbPreset: 'classroom', // classroom, hall, clean
        savedRecordings: []
    };

    // استرجاع الإعدادات وسجل التسجيلات من localStorage
    function loadSavedState() {
        try {
            const rawRecs = localStorage.getItem(STORAGE_KEY_RECORDINGS);
            if (rawRecs) {
                state.savedRecordings = JSON.parse(rawRecs);
            }
        } catch (e) {
            console.warn('تعذر قراءة تسجيلات الأناشيد:', e);
        }
    }

    function saveRecordings() {
        try {
            localStorage.setItem(STORAGE_KEY_RECORDINGS, JSON.stringify(state.savedRecordings));
        } catch (e) {
            console.warn('تعذر حفظ تسجيلات الأناشيد:', e);
        }
    }

    // ==========================================================================
    // 4. بناء وعرض واجهة الكاراوكي والمسرح (Stage & Karaoke Rendering)
    // ==========================================================================
    function renderCurriculumStrip() {
        const strip = document.getElementById('nsCurriculumStrip');
        if (!strip) return;

        strip.innerHTML = NASHEEDS_DATA.map((nasheed, idx) => `
            <div class="ns-song-chip ${idx === state.currentNasheedIdx ? 'active' : ''}" 
                 onclick="NasheedStudio.selectNasheed(${idx})"
                 title="${nasheed.desc}">
                <div class="ns-song-chip-icon">${nasheed.icon}</div>
                <div class="ns-song-chip-info">
                    <div class="ns-song-chip-title">${nasheed.title}</div>
                    <div class="ns-song-chip-sub">${nasheed.unit}</div>
                </div>
            </div>
        `).join('');
    }

    function renderActiveNasheed() {
        const nasheed = NASHEEDS_DATA[state.currentNasheedIdx];
        if (!nasheed) return;

        // تحديث الترويسة والبيانات
        const titleEl = document.getElementById('nsSongDisplayTitle');
        const unitEl = document.getElementById('nsSongUnitBadge');
        const rhythmEl = document.getElementById('nsSongRhythmBadge');
        const tempoEl = document.getElementById('nsSongTempoBadge');
        const bpmSlider = document.getElementById('nsTempoSlider');
        const bpmVal = document.getElementById('nsTempoValueDisplay');

        if (titleEl) titleEl.innerHTML = `<span>${nasheed.icon}</span> <span>${nasheed.title}</span>`;
        if (unitEl) unitEl.textContent = nasheed.unit;
        if (rhythmEl) rhythmEl.textContent = nasheed.rhythm;
        if (tempoEl) tempoEl.textContent = `${state.currentBpm} BPM`;
        if (bpmSlider) bpmSlider.value = state.currentBpm;
        if (bpmVal) bpmVal.textContent = `${state.currentBpm} BPM`;

        // تحديث المعاينة للطباعة
        const prevTitle = document.getElementById('nsPreviewSongTitle');
        if (prevTitle) prevTitle.textContent = nasheed.title;

        // بناء الأبيات والكلمات
        const container = document.getElementById('nsVersesList');
        if (!container) return;

        container.className = `ns-verses-list ${state.isSyllablesMode ? 'ns-syllables-mode' : ''}`;
        container.innerHTML = nasheed.verses.map((verse, vIdx) => {
            const h1Html = verse.h1.map((w, wIdx) => {
                const syllablesHtml = w.syllables.map(s => `<span class="ns-syllable-chunk">${s}</span>`).join('');
                return `
                    <span class="ns-karaoke-word" id="nsWord_${vIdx}_0_${wIdx}" 
                          onclick="NasheedStudio.speakWord('${w.text}', event)"
                          title="انقر للاستماع للكلمة بنبرة الإنشاد">
                        ${state.isSyllablesMode ? syllablesHtml : w.text}
                    </span>
                `;
            }).join(' ');

            const h2Html = verse.h2.map((w, wIdx) => {
                const syllablesHtml = w.syllables.map(s => `<span class="ns-syllable-chunk">${s}</span>`).join('');
                return `
                    <span class="ns-karaoke-word" id="nsWord_${vIdx}_1_${wIdx}" 
                          onclick="NasheedStudio.speakWord('${w.text}', event)"
                          title="انقر للاستماع للكلمة بنبرة الإنشاد">
                        ${state.isSyllablesMode ? syllablesHtml : w.text}
                    </span>
                `;
            }).join(' ');

            return `
                <div class="ns-verse-item ${vIdx === state.currentVerseIdx ? 'active-verse' : ''}" 
                     id="nsVerseItem_${vIdx}"
                     onclick="NasheedStudio.jumpToVerse(${vIdx})">
                    <div class="ns-hemistich ns-hemistich-1">${h1Html}</div>
                    <div class="ns-verse-separator">✦</div>
                    <div class="ns-hemistich ns-hemistich-2">${h2Html}</div>
                </div>
            `;
        }).join('');
    }

    // ==========================================================================
    // 5. محرك العزف والإنشاد والكاراوكي التفاعلي (Karaoke Chanting Playback)
    // ==========================================================================
    function startChantPlayback() {
        initAudioContext();
        stopChantPlayback();

        state.isPlaying = true;
        updatePlayButtonState();

        const nasheed = NASHEEDS_DATA[state.currentNasheedIdx];
        const stepTimeMs = (60 / state.currentBpm) * 1000;

        let flatWords = [];
        nasheed.verses.forEach((v, vIdx) => {
            v.h1.forEach((w, wIdx) => flatWords.push({ vIdx, part: 0, wIdx, word: w.text }));
            v.h2.forEach((w, wIdx) => flatWords.push({ vIdx, part: 1, wIdx, word: w.text }));
        });

        let currentWordIndex = 0;
        let noteIndex = 0;

        const ball = document.getElementById('nsBouncingBall');
        if (ball) ball.classList.add('active');

        state.playInterval = setInterval(() => {
            if (!state.isPlaying) return;

            // إزالة التمييز السابق
            document.querySelectorAll('.ns-karaoke-word.current-word').forEach(el => el.classList.remove('current-word'));
            document.querySelectorAll('.ns-verse-item.active-verse').forEach(el => el.classList.remove('active-verse'));

            if (currentWordIndex >= flatWords.length) {
                // انتهاء النشيد كاملاً
                stopChantPlayback();
                return;
            }

            const item = flatWords[currentWordIndex];
            const wordEl = document.getElementById(`nsWord_${item.vIdx}_${item.part}_${item.wIdx}`);
            const verseEl = document.getElementById(`nsVerseItem_${item.vIdx}`);

            if (verseEl) verseEl.classList.add('active-verse');
            if (wordEl) {
                wordEl.classList.add('current-word');
                moveBouncingBallTo(wordEl);
            }

            // مرافقة الدف المدرسي (Duff Beat)
            if (state.isDuffAccompEnabled) {
                if (currentWordIndex % 2 === 0) {
                    playDumSound();
                } else {
                    playTakSound();
                }
            }

            // مرافقة اللحن الزيلوفوني (Melodic Synthesizer)
            if (nasheed.melodyNotes && nasheed.melodyNotes.length > 0) {
                const note = nasheed.melodyNotes[noteIndex % nasheed.melodyNotes.length];
                playMelodyNote(note.note, note.dur);
                noteIndex++;
            }

            // نطق الكلمة عبر محرك فصيح الطبيعي عند تفعيل الإنشاد الصوتي
            if (state.isVocalsEnabled) {
                try {
                    const targetRate = (state.currentBpm / 100) * 0.92;
                    if (window.FaseehVoice && typeof window.FaseehVoice.speak === 'function') {
                        window.FaseehVoice.speak(item.word, { rate: targetRate, keepBubble: true });
                    } else if (window.speechSynthesis) {
                        const utter = new SpeechSynthesisUtterance(item.word);
                        utter.lang = 'ar-SA';
                        utter.rate = targetRate;
                        utter.pitch = 1.05;
                        window.speechSynthesis.speak(utter);
                    }
                } catch (e) {
                    // تجاهل الأخطاء أوفلاين
                }
            }

            currentWordIndex++;
        }, stepTimeMs);
    }

    function stopChantPlayback() {
        state.isPlaying = false;
        if (state.playInterval) {
            clearInterval(state.playInterval);
            state.playInterval = null;
        }

        const ball = document.getElementById('nsBouncingBall');
        if (ball) ball.classList.remove('active');

        document.querySelectorAll('.ns-karaoke-word.current-word').forEach(el => el.classList.remove('current-word'));
        updatePlayButtonState();
    }

    function updatePlayButtonState() {
        const btn = document.getElementById('nsBtnPlayChant');
        if (!btn) return;
        if (state.isPlaying) {
            btn.innerHTML = `<span>⏸️</span> <span>إيقاف الإنشاد</span>`;
            btn.classList.add('playing');
        } else {
            btn.innerHTML = `<span>▶️</span> <span>بدء الإنشاد والكاراوكي</span>`;
            btn.classList.remove('playing');
        }
    }

    function moveBouncingBallTo(targetEl) {
        const ball = document.getElementById('nsBouncingBall');
        const stage = document.querySelector('.ns-karaoke-stage-box');
        if (!ball || !targetEl || !stage) return;

        const stageRect = stage.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();

        const x = targetRect.left - stageRect.left + (targetRect.width / 2) - 13;
        const y = targetRect.top - stageRect.top - 28;

        ball.style.transform = `translate(${x}px, ${y}px)`;
    }

    // ==========================================================================
    // 6. مختبر الدف المدرسي والإيقاعات الصفية (School Duff & Rhythms)
    // ==========================================================================
    let patternInterval = null;
    let patternStep = 0;

    const RHYTHM_PATTERNS = [
        { id: 'march', name: 'المسيرة المدرسية (4/4)', steps: ['dum', 'tak', 'tak', 'dum'], tempo: 100 },
        { id: 'maqsum', name: 'المقسوم العراقي (4/4)', steps: ['dum', 'tak', 'rest', 'tak', 'dum', 'rest', 'tak', 'rest'], tempo: 92 },
        { id: 'lullaby', name: 'التهويدة الهادئة (3/4)', steps: ['dum', 'tak', 'tak'], tempo: 80 },
        { id: 'malfuf', name: 'الملفوف السريع (2/4)', steps: ['dum', 'tak', 'tak', 'rest'], tempo: 110 }
    ];

    let currentPatternIdx = 0;

    function triggerDuffHit(zone, event) {
        initAudioContext();

        const wrapper = document.getElementById('nsDuffDrumWrapper');
        if (wrapper) {
            wrapper.classList.add('hit');
            setTimeout(() => wrapper.classList.remove('hit'), 120);

            // إنشاء تأثير التموج الارتدادي المرئي
            if (event) {
                const rect = wrapper.getBoundingClientRect();
                const x = event.clientX ? (event.clientX - rect.left) : (rect.width / 2);
                const y = event.clientY ? (event.clientY - rect.top) : (rect.height / 2);

                const ripple = document.createElement('div');
                ripple.className = 'ns-drum-ripple';
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                wrapper.appendChild(ripple);
                setTimeout(() => ripple.remove(), 550);
            }
        }

        if (zone === 'dum') {
            playDumSound();
        } else if (zone === 'tak') {
            playTakSound();
        } else if (zone === 'jingle') {
            playJinglesSound();
        }

        // إشعار لعبة التحدي عند النقر
        if (state.challengeActive) {
            handleChallengeHit(zone);
        }
    }

    function startPatternPlayback(patternIdx) {
        stopPatternPlayback();
        initAudioContext();

        currentPatternIdx = patternIdx;
        const pattern = RHYTHM_PATTERNS[patternIdx];
        if (!pattern) return;

        const stepTime = (60 / pattern.tempo) * 500;
        patternStep = 0;

        renderPatternLeds(pattern.steps.length);

        patternInterval = setInterval(() => {
            const currentSound = pattern.steps[patternStep % pattern.steps.length];
            highlightPatternLed(patternStep % pattern.steps.length);

            if (currentSound === 'dum') {
                triggerDuffHit('dum');
            } else if (currentSound === 'tak') {
                triggerDuffHit('tak');
            }

            patternStep++;
        }, stepTime);

        // تمييز النمط النشط
        document.querySelectorAll('.ns-pattern-item').forEach((item, idx) => {
            item.classList.toggle('active', idx === patternIdx);
        });
    }

    function stopPatternPlayback() {
        if (patternInterval) {
            clearInterval(patternInterval);
            patternInterval = null;
        }
        document.querySelectorAll('.ns-pattern-item.active').forEach(i => i.classList.remove('active'));
    }

    function renderPatternLeds(count) {
        const row = document.getElementById('nsLedRow');
        if (!row) return;
        row.innerHTML = Array.from({ length: count }).map((_, i) => `
            <div class="ns-led-dot" id="nsLed_${i}"></div>
        `).join('');
    }

    function highlightPatternLed(idx) {
        document.querySelectorAll('.ns-led-dot.active').forEach(d => d.classList.remove('active'));
        const led = document.getElementById(`nsLed_${idx}`);
        if (led) led.classList.add('active');
    }

    // ==========================================================================
    // 7. المحلل الموسيقي المرئي وتحدي دقة الإيقاع (Visualizer & Beat Challenge)
    // ==========================================================================
    function startVisualizerLoop() {
        const canvas = document.getElementById('nsVisualizerCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // ضبط دقة الكانفاس لتلائم شاشات الريتنا والسبورات الذكية
        const dpr = window.devicePixelRatio || 1;
        canvas.width = canvas.clientWidth * dpr;
        canvas.height = canvas.clientHeight * dpr;
        ctx.scale(dpr, dpr);

        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        function draw() {
            state.visualizerAnimFrame = requestAnimationFrame(draw);

            ctx.fillStyle = '#0c0a09';
            ctx.fillRect(0, 0, width, height);

            if (!analyserNode) {
                // رسم موجة افتراضية هادئة عند سكون الصوت
                drawIdleWave(ctx, width, height);
                return;
            }

            const bufferLength = analyserNode.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            if (state.visualizerMode === 'bars') {
                analyserNode.getByteFrequencyData(dataArray);
                const barWidth = (width / bufferLength) * 2.5;
                let x = 0;

                for (let i = 0; i < bufferLength; i++) {
                    const barHeight = (dataArray[i] / 255) * height * 0.85;

                    const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
                    gradient.addColorStop(0, '#ea580c');
                    gradient.addColorStop(0.5, '#f59e0b');
                    gradient.addColorStop(1, '#fef08a');

                    ctx.fillStyle = gradient;
                    ctx.fillRect(x, height - barHeight, barWidth - 2, barHeight);

                    x += barWidth;
                }
            } else if (state.visualizerMode === 'wave') {
                analyserNode.getByteTimeDomainData(dataArray);
                ctx.lineWidth = 3;
                ctx.strokeStyle = '#f97316';
                ctx.beginPath();

                const sliceWidth = width * 1.0 / bufferLength;
                let x = 0;

                for (let i = 0; i < bufferLength; i++) {
                    const v = dataArray[i] / 128.0;
                    const y = v * height / 2;

                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                    x += sliceWidth;
                }
                ctx.lineTo(width, height / 2);
                ctx.stroke();
            } else if (state.visualizerMode === 'circles') {
                analyserNode.getByteFrequencyData(dataArray);
                let sum = 0;
                for (let i = 0; i < 32; i++) sum += dataArray[i];
                const avg = sum / 32;

                const radius = 25 + (avg / 255) * (height / 2.5);
                ctx.beginPath();
                ctx.arc(width / 2, height / 2, radius, 0, 2 * Math.PI);
                ctx.strokeStyle = '#ea580c';
                ctx.lineWidth = 4;
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#f97316';
                ctx.stroke();
                ctx.shadowBlur = 0;
            }
        }

        draw();
    }

    function drawIdleWave(ctx, width, height) {
        ctx.strokeStyle = 'rgba(234, 88, 12, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        const t = Date.now() * 0.003;
        for (let x = 0; x < width; x += 5) {
            const y = height / 2 + Math.sin(x * 0.03 + t) * 12;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }

    // لعبة تحدي دقة الإيقاع
    function startRhythmChallenge() {
        initAudioContext();
        stopRhythmChallenge();

        state.challengeActive = true;
        state.challengeScore = 0;
        state.challengeStreak = 0;
        state.challengeAccuracy = 100;
        state.challengeNotes = [];

        updateChallengeStats();

        const btn = document.getElementById('nsBtnStartChallenge');
        if (btn) {
            btn.innerHTML = `<span>⏹️</span> <span>إيقاف التحدي</span>`;
            btn.classList.add('active');
        }

        const banner = document.getElementById('nsFeedbackBanner');
        if (banner) banner.textContent = 'استعد... انقر على الدف (D) مع وصول النوتة للخط!';

        const highway = document.getElementById('nsBeatHighway');
        let noteCounter = 0;

        state.challengeInterval = setInterval(() => {
            if (!state.challengeActive) return;

            // توليد نوتة إيقاعية متحركة
            noteCounter++;
            const noteEl = document.createElement('div');
            noteEl.className = 'ns-beat-node';
            noteEl.id = `nsBeatNode_${noteCounter}`;
            noteEl.innerHTML = (noteCounter % 2 === 0) ? 'دُم' : 'تَك';
            noteEl.style.left = '0px';

            if (highway) highway.appendChild(noteEl);

            const startTime = Date.now();
            const noteObj = { id: noteCounter, el: noteEl, startTime, targetTime: startTime + 2000, hit: false };
            state.challengeNotes.push(noteObj);

            // تحريك النوتة حتى خط الهدف
            const animInterval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const progress = elapsed / 2000;
                const highwayWidth = highway ? highway.clientWidth : 600;

                noteEl.style.left = `${progress * (highwayWidth - 120)}px`;

                if (elapsed >= 2200) {
                    clearInterval(animInterval);
                    if (!noteObj.hit) {
                        noteEl.remove();
                        // نوتة ضائعة
                        state.challengeStreak = 0;
                        updateChallengeStats();
                    }
                }
            }, 25);

        }, 1200);
    }

    function stopRhythmChallenge() {
        state.challengeActive = false;
        if (state.challengeInterval) {
            clearInterval(state.challengeInterval);
            state.challengeInterval = null;
        }

        const btn = document.getElementById('nsBtnStartChallenge');
        if (btn) {
            btn.innerHTML = `<span>🎮</span> <span>بدء تحدي دقة الإيقاع</span>`;
            btn.classList.remove('active');
        }

        document.querySelectorAll('.ns-beat-node').forEach(n => n.remove());
    }

    function handleChallengeHit(zone) {
        if (!state.challengeActive || state.challengeNotes.length === 0) return;

        const now = Date.now();
        const nextNote = state.challengeNotes.find(n => !n.hit && Math.abs(now - n.targetTime) < 350);

        const banner = document.getElementById('nsFeedbackBanner');

        if (nextNote) {
            nextNote.hit = true;
            const diff = Math.abs(now - nextNote.targetTime);

            if (diff < 120) {
                state.challengeScore += 30;
                state.challengeStreak++;
                if (banner) banner.textContent = '🌟 ممتاز! إيقاع دقيق 100% (+30)';
            } else {
                state.challengeScore += 15;
                state.challengeStreak++;
                if (banner) banner.textContent = '👏 جيد جداً! نغمة قريبة (+15)';
            }

            if (nextNote.el) {
                nextNote.el.style.transform = 'translateY(-50%) scale(1.4)';
                nextNote.el.style.opacity = '0';
                setTimeout(() => nextNote.el && nextNote.el.remove(), 200);
            }
        } else {
            state.challengeStreak = 0;
            if (banner) banner.textContent = '🥁 ركّز مع نبضة الدف القادمة!';
        }

        updateChallengeStats();
    }

    function updateChallengeStats() {
        const scoreEl = document.getElementById('nsChStatScore');
        const accEl = document.getElementById('nsChStatAccuracy');
        const streakEl = document.getElementById('nsChStatStreak');

        if (scoreEl) scoreEl.textContent = state.challengeScore;
        if (accEl) accEl.textContent = `${Math.min(100, Math.max(60, 100 - (state.challengeStreak === 0 ? 15 : 0)))}%`;
        if (streakEl) streakEl.textContent = state.challengeStreak;
    }

    // ==========================================================================
    // 8. استوديو التسجيل والصدى الصفي (Vocal Recording & Echo)
    // ==========================================================================
    function startAudioRecording() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert('خاصية الميكروفون غير مدعومة في هذا المتصفح.');
            return;
        }

        initAudioContext();

        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            state.recorder = new MediaRecorder(stream);
            state.recordedChunks = [];

            state.recorder.ondataavailable = e => {
                if (e.data.size > 0) state.recordedChunks.push(e.data);
            };

            state.recorder.onstop = () => {
                const blob = new Blob(state.recordedChunks, { type: 'audio/webm' });
                state.recordedAudioUrl = URL.createObjectURL(blob);

                const currentNasheed = NASHEEDS_DATA[state.currentNasheedIdx];
                const recItem = {
                    id: Date.now(),
                    title: `${currentNasheed.title} - إنشاد التلميذ`,
                    date: new Date().toLocaleDateString('ar-IQ'),
                    url: state.recordedAudioUrl
                };

                state.savedRecordings.unshift(recItem);
                saveRecordings();
                renderRecordingsList();

                const statusEl = document.getElementById('nsRecStatusText');
                if (statusEl) statusEl.textContent = 'تم حفظ تسجيل إنشادك بنجاح! 🎵';
            };

            state.recorder.start();

            const micCircle = document.getElementById('nsMicCircle');
            const statusEl = document.getElementById('nsRecStatusText');
            if (micCircle) micCircle.classList.add('recording');
            if (statusEl) statusEl.textContent = 'جارٍ تسجيل الإنشاد الحي... أنشد مع الدف!';

        }).catch(err => {
            console.warn('تعذر الوصول للميكروفون:', err);
            alert('يرجى السماح بالوصول إلى الميكروفون لتسجيل الإنشاد.');
        });
    }

    function stopAudioRecording() {
        if (state.recorder && state.recorder.state === 'recording') {
            state.recorder.stop();
        }
        const micCircle = document.getElementById('nsMicCircle');
        if (micCircle) micCircle.classList.remove('recording');
    }

    function playRecordedAudio() {
        if (!state.recordedAudioUrl) {
            alert('لا يوجد تسجيل حالي. اضغط على "بدء التسجيل" أولاً.');
            return;
        }
        const audio = new Audio(state.recordedAudioUrl);
        audio.play();
    }

    function renderRecordingsList() {
        const list = document.getElementById('nsRecordingsList');
        if (!list) return;

        if (state.savedRecordings.length === 0) {
            list.innerHTML = `
                <div style="text-align: center; color: #78716c; padding: 20px;">
                    لا توجد تسجيلات محفوظة بعد. سجّل صوتك العذب مع الدف المدرسي! 🎙️
                </div>
            `;
            return;
        }

        list.innerHTML = state.savedRecordings.map(rec => `
            <div class="ns-rec-item">
                <div class="ns-rec-meta">
                    <div class="ns-rec-title">🎤 ${rec.title}</div>
                    <div class="ns-rec-date">${rec.date}</div>
                </div>
                <div class="ns-rec-controls">
                    <button class="ns-btn-rec-ctrl" onclick="NasheedStudio.playSpecificRec('${rec.url}')">▶️ تشغيل</button>
                    <button class="ns-btn-rec-ctrl" onclick="NasheedStudio.deleteRec(${rec.id})">🗑️ حذف</button>
                </div>
            </div>
        `).join('');
    }

    // ==========================================================================
    // 9. مولد بطاقات الأناشيد المنهجية وشهادات بلبل الصف A4 (A4 Printables)
    // ==========================================================================
    function printNasheedCard() {
        const nasheed = NASHEEDS_DATA[state.currentNasheedIdx];
        const container = document.getElementById('nsPrintableContainer');
        if (!container || !nasheed) return;

        const versesRows = nasheed.verses.map((v, i) => `
            <div style="display: flex; justify-content: space-between; padding: 8px 14px; background: ${i % 2 === 0 ? '#fff7ed' : '#ffffff'}; border-radius: 8px; margin-bottom: 6px; font-size: 1.25rem; font-weight: bold; border: 1px solid #fed7aa;">
                <span>${v.h1.map(w => w.text).join(' ')}</span>
                <span style="color: #ea580c;">✦</span>
                <span>${v.h2.map(w => w.text).join(' ')}</span>
            </div>
        `).join('');

        const vocabRows = nasheed.vocabulary.map(voc => `
            <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px 12px; margin-bottom: 6px;">
                <strong style="color: #0369a1; font-size: 1.05rem;">${voc.word}:</strong>
                <span style="color: #334155; font-size: 0.95rem;">${voc.meaning}</span>
            </div>
        `).join('');

        container.innerHTML = `
            <div class="ns-print-page" style="direction: rtl; font-family: system-ui, -apple-system, sans-serif;">
                <div style="text-align: center; border-bottom: 3px double #ea580c; padding-bottom: 12px; margin-bottom: 16px;">
                    <div style="font-size: 1rem; color: #78350f; font-weight: bold;">جُمْهُورِيَّةُ العِرَاق • وِزَارَةُ التَّرْبِيَة • كِتَابُ قِرَاءَتِي لِلصَّفِّ الأَوَّلِ الاِبْتِدَائِيّ</div>
                    <h1 style="font-size: 1.8rem; color: #c2410c; margin: 8px 0;">🎵 ${nasheed.title} 🥁</h1>
                    <div style="font-size: 0.95rem; color: #451a03; font-weight: bold;">
                        ${nasheed.unit} • ${nasheed.rhythm}
                    </div>
                </div>

                <div style="margin-bottom: 18px;">
                    <h3 style="color: #9a3412; font-size: 1.15rem; border-right: 4px solid #ea580c; padding-right: 8px; margin-bottom: 10px;">
                        أَبْيَاتُ النَّشِيدِ المُقَرَّرَةِ بِالضَّبْطِ وَالتَّشْكِيلِ الكَامِل:
                    </h3>
                    ${versesRows}
                </div>

                <div style="margin-bottom: 18px;">
                    <h3 style="color: #9a3412; font-size: 1.15rem; border-right: 4px solid #ea580c; padding-right: 8px; margin-bottom: 10px;">
                        مَعَانِي الكَلِمَاتِ وَالقِيَمُ التَّرْبَوِيَّةُ المُسْتَفَادَة:
                    </h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                        ${vocabRows}
                    </div>
                </div>

                <div style="border-top: 2px dashed #fed7aa; padding-top: 14px; margin-top: 20px; display: flex; justify-content: space-between; align-items: center; font-size: 0.88rem; color: #78350f; font-weight: bold;">
                    <div>اسْمُ التِّلْمِيذِ / التِّلْمِيذَة: .......................................</div>
                    <div>دَرَجَةُ الإِنْشَادِ الإِيقَاعِيّ: [  ★  ★  ★  ★  ★  ]</div>
                    <div>تَوْقِيعُ مُعَلِّمِ الصَّفّ: ........................</div>
                </div>

                <div style="text-align: center; margin-top: 18px; font-size: 0.82rem; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 8px;">
                    إعداد وتطوير: المهندس أسامة خليل هاشم • منصة قراءتي التفاعلية الذكية المعتمدة
                </div>
            </div>
        `;

        window.print();
    }

    function printCertificate() {
        const container = document.getElementById('nsPrintableContainer');
        const nasheed = NASHEEDS_DATA[state.currentNasheedIdx];
        if (!container || !nasheed) return;

        const pupilNameInput = document.getElementById('nsPreviewPupilName');
        const pupilName = (pupilNameInput && pupilNameInput.value.trim()) ? pupilNameInput.value.trim() : 'تِلْمِيذُ الصَّفِّ الأَوَّلِ المُبْدِع';

        container.innerHTML = `
            <div class="ns-print-page" style="direction: rtl; font-family: system-ui, -apple-system, sans-serif; text-align: center; border: 6px double #b45309; padding: 25px; background: #fffdfa;">
                <div style="font-size: 1.1rem; color: #78350f; font-weight: bold; margin-bottom: 6px;">
                    جُمْهُورِيَّةُ العِرَاق • وِزَارَةُ التَّرْبِيَة • مِنْصَّةُ قِرَاءَتِي الذَّكِيَّة
                </div>
                
                <div style="font-size: 3.2rem; margin: 10px 0;">🏆 🥁 🎶</div>

                <h1 style="font-size: 2.2rem; color: #b45309; margin: 0 0 10px 0; font-weight: 900;">
                    شَهَادَةُ بُلْبُلِ الصَّفِّ وَفَارِسِ الإِنْشَادِ الإِيقَاعِيّ
                </h1>

                <p style="font-size: 1.2rem; color: #451a03; line-height: 1.8; margin: 15px auto; max-width: 650px;">
                    تَشْهَدُ إِدَارَةُ مَدْرَسَتِنَا العَزِيزَةِ بِأَنَّ التِّلْمِيذَ المُتَأَلِّق:
                    <br>
                    <span style="font-size: 1.7rem; font-weight: 900; color: #ea580c; border-bottom: 2px dashed #ea580c; display: inline-block; padding: 4px 20px; margin: 8px 0;">
                        ${pupilName}
                    </span>
                    <br>
                    قَدْ أَتْقَنَ بِجَدَارَةٍ وَتَفَوُّقٍ الإِنْشَادَ الإِيقَاعِيَّ التَّفَاعُلِيَّ لِنَشِيد:
                    <strong style="color: #b45309;">( ${nasheed.title} )</strong>
                    <br>
                    مَعَ ضَرْبَاتِ الدُّفِّ المَدْرَسِيِّ وَالتَّقْطِيعِ الفُونِيمِيِّ وَتَنَاغُمِ النَّبَضَاتِ الصَّفِيَّة.
                </p>

                <div style="display: flex; justify-content: center; gap: 15px; font-size: 1.8rem; margin: 15px 0;">
                    ⭐ ⭐ ⭐ ⭐ ⭐
                </div>

                <div style="display: flex; justify-content: space-around; margin-top: 30px; border-top: 2px dashed #fed7aa; padding-top: 20px; font-weight: bold; color: #78350f; font-size: 1.05rem;">
                    <div>خَاتَمُ التَّمَيُّزِ المَدْرَسِيّ<br><span style="font-size: 2.2rem;">💮</span></div>
                    <div>مُعَلِّمُ / مُعَلِّمَةُ الصَّفّ<br>......................................</div>
                    <div>إِعْدَادٌ وَتَطْوِير<br>المهندس أسامة خليل هاشم</div>
                </div>
            </div>
        `;

        window.print();
    }

    // ==========================================================================
    // 10. واجهات التفاعل البرمجية العامة (Public Controller API)
    // ==========================================================================
    window.NasheedStudio = {
        init: function () {
            loadSavedState();
            renderCurriculumStrip();
            renderActiveNasheed();
            renderRecordingsList();
            startVisualizerLoop();
            this.bindKeyboardShortcuts();
        },

        openModal: function (tab = 'stage') {
            initAudioContext();
            const modal = document.getElementById('nasheedStudioModal');
            if (modal) {
                modal.style.display = 'flex';
                this.switchTab(tab);
            }
        },

        closeModal: function () {
            stopChantPlayback();
            stopPatternPlayback();
            stopRhythmChallenge();
            stopAudioRecording();
            const modal = document.getElementById('nasheedStudioModal');
            if (modal) modal.style.display = 'none';
        },

        toggleFullscreen: function () {
            const box = document.querySelector('.nasheed-studio-modal-box');
            if (box) {
                box.classList.toggle('fullscreen-mode');
            }
        },

        switchTab: function (tabName) {
            state.activeTab = tabName;

            // تحديث أزرار التبويبات
            document.querySelectorAll('.ns-tab-btn').forEach(btn => btn.classList.remove('active'));
            const activeBtn = document.getElementById(`nsTabBtn_${tabName}`);
            if (activeBtn) activeBtn.classList.add('active');

            // تحديث محتوى التبويبات
            document.querySelectorAll('.ns-tab-content').forEach(content => content.classList.remove('active'));
            const activeContent = document.getElementById(`nsTabContent_${tabName}`);
            if (activeContent) activeContent.classList.add('active');

            if (tabName === 'visualizer') {
                setTimeout(startVisualizerLoop, 50);
            }
        },

        selectNasheed: function (idx) {
            stopChantPlayback();
            state.currentNasheedIdx = idx;
            state.currentBpm = NASHEEDS_DATA[idx].defaultBpm;
            renderCurriculumStrip();
            renderActiveNasheed();
        },

        jumpToVerse: function (vIdx) {
            state.currentVerseIdx = vIdx;
            document.querySelectorAll('.ns-verse-item.active-verse').forEach(el => el.classList.remove('active-verse'));
            const vEl = document.getElementById(`nsVerseItem_${vIdx}`);
            if (vEl) vEl.classList.add('active-verse');
        },

        togglePlayChant: function () {
            if (state.isPlaying) {
                stopChantPlayback();
            } else {
                startChantPlayback();
            }
        },

        toggleSyllablesMode: function () {
            state.isSyllablesMode = !state.isSyllablesMode;
            const btn = document.getElementById('nsBtnToggleSyllables');
            if (btn) btn.classList.toggle('active-toggle', state.isSyllablesMode);
            renderActiveNasheed();
        },

        toggleDuffAccomp: function () {
            state.isDuffAccompEnabled = !state.isDuffAccompEnabled;
            const btn = document.getElementById('nsBtnToggleDuff');
            if (btn) btn.classList.toggle('active-toggle', state.isDuffAccompEnabled);
        },

        toggleVocals: function () {
            state.isVocalsEnabled = !state.isVocalsEnabled;
            const btn = document.getElementById('nsBtnToggleVocals');
            if (btn) btn.classList.toggle('active-toggle', state.isVocalsEnabled);
        },

        adjustTempo: function (delta) {
            state.currentBpm = Math.max(60, Math.min(140, state.currentBpm + delta));
            renderActiveNasheed();
            if (state.isPlaying) {
                startChantPlayback(); // إعادة الجدولة بالسرعة الجديدة
            }
        },

        setTempo: function (val) {
            state.currentBpm = parseInt(val, 10) || 95;
            renderActiveNasheed();
            if (state.isPlaying) {
                startChantPlayback();
            }
        },

        speakWord: function (wordText, event) {
            if (event) event.stopPropagation();
            initAudioContext();
            playDumSound();

            try {
                if (window.FaseehVoice && typeof window.FaseehVoice.speak === 'function') {
                    window.FaseehVoice.speak(wordText, { rate: 0.90, keepBubble: true });
                } else if (window.speechSynthesis) {
                    const utter = new SpeechSynthesisUtterance(wordText);
                    utter.lang = 'ar-SA';
                    utter.rate = 0.9;
                    utter.pitch = 1.05;
                    window.speechSynthesis.speak(utter);
                }
            } catch (e) {
                // تجاهل
            }
        },

        hitDum: function (event) {
            triggerDuffHit('dum', event);
        },

        hitTak: function (event) {
            triggerDuffHit('tak', event);
        },

        hitJingle: function (event) {
            triggerDuffHit('jingle', event);
        },

        playInst: function (type) {
            initAudioContext();
            if (type === 'clap') playClapSound();
            else if (type === 'triangle') playTriangleSound();
            else if (type === 'maracas') playMaracasSound();
            else if (type === 'snare') playTakSound();
        },

        playPattern: function (idx) {
            if (patternInterval && currentPatternIdx === idx) {
                stopPatternPlayback();
            } else {
                startPatternPlayback(idx);
            }
        },

        setVisualizerMode: function (mode) {
            state.visualizerMode = mode;
            document.querySelectorAll('.ns-btn-vis-mode').forEach(b => b.classList.remove('active'));
            const btn = document.getElementById(`nsBtnVisMode_${mode}`);
            if (btn) btn.classList.add('active');
        },

        toggleChallenge: function () {
            if (state.challengeActive) {
                stopRhythmChallenge();
            } else {
                startRhythmChallenge();
            }
        },

        startRecording: function () {
            startAudioRecording();
        },

        stopRecording: function () {
            stopAudioRecording();
        },

        playRecording: function () {
            playRecordedAudio();
        },

        playSpecificRec: function (url) {
            const audio = new Audio(url);
            audio.play();
        },

        deleteRec: function (id) {
            state.savedRecordings = state.savedRecordings.filter(r => r.id !== id);
            saveRecordings();
            renderRecordingsList();
        },

        setReverbPreset: function (preset) {
            state.activeReverbPreset = preset;
            document.querySelectorAll('.ns-btn-reverb').forEach(b => b.classList.remove('active'));
            const btn = document.getElementById(`nsBtnReverb_${preset}`);
            if (btn) btn.classList.add('active');

            if (delayNode && reverbGain && audioCtx) {
                const now = audioCtx.currentTime;
                if (preset === 'clean') {
                    reverbGain.gain.setValueAtTime(0, now);
                } else if (preset === 'classroom') {
                    delayNode.delayTime.setValueAtTime(0.2, now);
                    reverbGain.gain.setValueAtTime(0.35, now);
                } else if (preset === 'hall') {
                    delayNode.delayTime.setValueAtTime(0.42, now);
                    reverbGain.gain.setValueAtTime(0.65, now);
                }
            }
        },

        printCard: function () {
            printNasheedCard();
        },

        printCertificate: function () {
            printCertificate();
        },

        bindKeyboardShortcuts: function () {
            window.addEventListener('keydown', (e) => {
                const modal = document.getElementById('nasheedStudioModal');
                if (!modal || modal.style.display === 'none') return;

                const key = e.key.toLowerCase();
                if (key === 'd') {
                    this.hitDum();
                } else if (key === 't' || key === 'k') {
                    this.hitTak();
                } else if (key === 'j') {
                    this.hitJingle();
                } else if (key === 'c') {
                    this.playInst('clap');
                } else if (key === 'm') {
                    this.playInst('maracas');
                } else if (key === 'r') {
                    this.playInst('triangle');
                } else if (key === ' ' && e.target.tagName !== 'INPUT') {
                    e.preventDefault();
                    if (state.challengeActive) {
                        this.hitDum();
                    } else {
                        this.togglePlayChant();
                    }
                }
            });
        }
    };

    // التشغيل التلقائي عند اكتمال تحميل الصفحة
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => window.NasheedStudio.init());
    } else {
        window.NasheedStudio.init();
    }

})();
