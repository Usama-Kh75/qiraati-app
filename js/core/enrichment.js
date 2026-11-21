/* ==========================================================================
 * منصة قراءتي التفاعلية الذكية - منظومة اختبارات نهاية الفصل والتدريبات الصيفية الإثرائية وبنك بطاقات القراءة
 * متوافق 100% مع كتاب قراءتي الجديد للصف الأول الابتدائي ومنهج وزارة التربية
 * إعداد وتطوير: المهندس أسامة خليل هاشم
 * ========================================================================== */

(function() {
    'use strict';

    // مفاتيح التخزين المعتمدة (تلتزم بالبادئة qiraati-smart-)
    const STORAGE_KEY_EXAMS = 'qiraati-smart-exams-results';
    const STORAGE_KEY_SUMMER_TASKS = 'qiraati-smart-summer-tasks';
    const STORAGE_KEY_CARDS_FAV = 'qiraati-smart-cards-fav';

    // ==========================================================================
    // 1. بيانات اختبارات نهاية الفصل (Exams & Assessments Data)
    // ==========================================================================
    const EXAMS_DATA = {
        term1: {
            id: 'term1',
            title: 'اختبار نهاية الفصل الدراسي الأول',
            badge: 'نصف السنة • الوحدات 1 - 3',
            color: '#2563eb',
            desc: 'تقييم شامل لمهارات الوعي الصوتي، حروف المد، دمج وتحليل الكلمات، وتنوين الضم حتى نهاية الوحدة الثالثة.',
            questions: [
                {
                    id: 1,
                    skill: 'الوعي الصوتي وحروف المد',
                    question: 'مَا هُوَ حَرْفُ الْمَدِّ فِي كَلِمَةِ (دَار)؟',
                    audio: 'vowel_a_sound',
                    options: [
                        { text: 'حَرْفُ الْأَلِفِ (ا)', correct: true },
                        { text: 'حَرْفُ الْوَاوِ (و)', correct: false },
                        { text: 'حَرْفُ الْيَاءِ (ي)', correct: false }
                    ],
                    feedback: 'أحسنت يا بطل! حرف الألف (ا) هو صوت المد الطويل في كلمة دَار.'
                },
                {
                    id: 2,
                    skill: 'تحليل الكلمات إلى مقاطع',
                    question: 'مَا هُوَ التَّحْلِيلُ الْمَقْطَعِيُّ الصَّحِيحُ لِكَلِمَةِ (دَادَا)؟',
                    audio: 'faseeh_blend_dada',
                    options: [
                        { text: 'دَا + دَا', correct: true },
                        { text: 'دَ + ادَا', correct: false },
                        { text: 'دَادْ + ا', correct: false }
                    ],
                    feedback: 'ممتاز! كلمة دَادَا تتكون من مقطعين متماثلين: (دَا + دَا).'
                },
                {
                    id: 3,
                    skill: 'تمييز الحركات والمدود القصيرة',
                    question: 'أَيُّ كَلِمَةٍ تَبْدَأُ بِحَرَكَةِ الضَّمَّةِ الْقَصِيرَةِ (بُـ)؟',
                    audio: 'letter_b_bu_sound',
                    options: [
                        { text: 'بُرْتُقَال', correct: true },
                        { text: 'بَصَل', correct: false },
                        { text: 'بِطِّيخ', correct: false }
                    ],
                    feedback: 'رائع جداً! بُرْتُقَال تبدأ بصوت الضمة القصير (بُـ).'
                },
                {
                    id: 4,
                    skill: 'تركيب المقاطع لتكوين كلمة',
                    question: 'عِنْدَ تَرْكِيبِ الْمَقْطَعَيْنِ (نُو + ر)، مَاذَا تَتَكَوَّنُ؟',
                    audio: 'act5_noor',
                    options: [
                        { text: 'نُور', correct: true },
                        { text: 'نَار', correct: false },
                        { text: 'دُور', correct: false }
                    ],
                    feedback: 'إجابة صحيحة ومبهرة! نُو + ر = نُور.'
                },
                {
                    id: 5,
                    skill: 'تمييز تنوين الضم',
                    question: 'أَيُّ كَلِمَةٍ تَحْتَوِي عَلَى تَنْوِينِ الضَّمِّ (ـٌ)؟',
                    audio: 'tanween_dham_wardun',
                    options: [
                        { text: 'وَرْدٌ', correct: true },
                        { text: 'وَرْدَةَ', correct: false },
                        { text: 'وَرْدِ', correct: false }
                    ],
                    feedback: 'بارك الله فيك! وَرْدٌ تنتهي بتنوين الضم وصوته (ـٌ un).'
                },
                {
                    id: 6,
                    skill: 'التمييز بين الحروف المتشابهة',
                    question: 'أَيُّ كَلِمَةٍ تَبْدَأُ بِحَرْفِ الرَّاءِ (ر)؟',
                    audio: 'letter_r_sound',
                    options: [
                        { text: 'رِيف', correct: true },
                        { text: 'دَار', correct: false },
                        { text: 'بَاب', correct: false }
                    ],
                    feedback: 'صحيح 100%! رِيف تبدأ بحرف الراء المكسور (رِ).'
                },
                {
                    id: 7,
                    skill: 'المقاطع الساكنة المقفلة',
                    question: 'مَا هُوَ الْمَقْطَعُ السَّاكِنُ فِي كَلِمَةِ (طَبْل)؟',
                    audio: 'letter_b_tabl_syllable',
                    options: [
                        { text: 'طَبْـ', correct: true },
                        { text: 'طَـ', correct: false },
                        { text: 'لُـ', correct: false }
                    ],
                    feedback: 'بطل القراءة! المقطع الساكن المغلق هو (طَبْـ) بحركة السكون على الباء.'
                },
                {
                    id: 8,
                    skill: 'قراءة الكلمات البصرية',
                    question: 'أَيُّ كَلِمَةٍ مِنَ الْكَلِمَاتِ الْآتِيَةِ هِيَ كَلِمَةُ (بُوق)؟',
                    audio: 'letter_q_booq_syllables',
                    options: [
                        { text: 'بُوق', correct: true },
                        { text: 'بَقَر', correct: false },
                        { text: 'بَاب', correct: false }
                    ],
                    feedback: 'ممتاز! بُوق نَدِيم قَدِيم.'
                },
                {
                    id: 9,
                    skill: 'التاء المربوطة والمفتوحة',
                    question: 'كَلِمَةُ (سَارَة) تَنْتَهِي بِـ:',
                    audio: 'unit2_sarah_word',
                    options: [
                        { text: 'تَاءٍ مَرْبُوطَةٍ (ـة / ة)', correct: true },
                        { text: 'تَاءٍ مَفْتُوحَةٍ (ت)', correct: false },
                        { text: 'هَاءِ مِيَاه (ـه)', correct: false }
                    ],
                    feedback: 'أحسنت! سَارَة تنتهي بتاء مربوطة لطيفة.'
                },
                {
                    id: 10,
                    skill: 'الفهم القرائي والتطابق الدلالي',
                    question: 'مَنْ هُوَ الَّذِي يَقُودُ بَقَرَ بَدْرَانَ فِي الدَّرْسِ؟',
                    audio: 'letter_q_nadeem_sentence',
                    options: [
                        { text: 'نَدِيم', correct: true },
                        { text: 'فَارُوق', correct: false },
                        { text: 'طَارِق', correct: false }
                    ],
                    feedback: 'إجابة عبقرية! (نَدِيمٌ يَقُودُ بَقَرَ بَدْرَان).'
                }
            ]
        },
        term2: {
            id: 'term2',
            title: 'اختبار نهاية الفصل الثاني والنهائي الختامي',
            badge: 'الاختبار النهائي • الوحدات 4 - 6',
            color: '#db2777',
            desc: 'اختبار شامل ختامي يغطي الحروف الأخيرة، الشدة، الهمزات، تنوين الكسر، واللام الشمسية والقمرية 100%.',
            questions: [
                {
                    id: 1,
                    skill: 'اللام الشمسية واللام القمرية',
                    question: 'كَلِمَةُ (الشَّمْس) هِيَ لَامٌ:',
                    audio: 'lam_sound_shamsiyyah',
                    options: [
                        { text: 'شَمْسِيَّةٌ (تُكْتَبُ وَلَا تُنْطَقُ وَبَعْدَهَا شَدَّة)', correct: true },
                        { text: 'قَمَرِيَّةٌ (تُكْتَبُ وَتُنْطَقُ وَعَلَيْهَا سُكُون)', correct: false },
                        { text: 'لَامٌ أَصْلِيَّةٌ غَيْرُ مُعَرِّفَة', correct: false }
                    ],
                    feedback: 'أحسنت صنعاً! اللام الشمسية تُدغم ولا تُنطق ويُشدد الحرف بعدها (الشَّـ).'
                },
                {
                    id: 2,
                    skill: 'اللام الشمسية واللام القمرية',
                    question: 'كَلِمَةُ (الْقَمَر) هِيَ لَامٌ:',
                    audio: 'lam_sound_qamariyyah',
                    options: [
                        { text: 'قَمَرِيَّةٌ (تُكْتَبُ وَتُنْطَقُ وَعَلَيْهَا سُكُون)', correct: true },
                        { text: 'شَمْسِيَّةٌ (لَا تُنْطَق)', correct: false },
                        { text: 'لَامٌ مَكْسُورَة', correct: false }
                    ],
                    feedback: 'ممتاز! اللام القمرية تُكتب وتُنطق بوضوح تام (الْـ).'
                },
                {
                    id: 3,
                    skill: 'الشدة وتضعيف الحرف',
                    question: 'مَا مَعْنَى وُجُودِ الشَّدَّةِ (ـّ) فَوْقَ الْحَرْفِ؟',
                    audio: 'shaddah_formation',
                    options: [
                        { text: 'أَنَّ الْحَرْفَ مَرَّتَانِ (أَوَّلُهُ سَاكِنٌ وَالثَّانِي مُتَحَرِّك)', correct: true },
                        { text: 'أَنَّ الْحَرْفَ يُنْطَقُ مَدًّا طَوِيلًا فَقَطْ', correct: false },
                        { text: 'أَنَّ الْحَرْفَ مَحْذُوفٌ لَا يُنْطَق', correct: false }
                    ],
                    feedback: 'إجابة تربوية دقيقة! الشدة تدل على حرفين مدمجين معاً.'
                },
                {
                    id: 4,
                    skill: 'تنوين الكسر',
                    question: 'أَيُّ كَلِمَةٍ مِمَّا يَلِي تَنْتَهِي بِتَنْوِينِ الْكَسْرِ (ـٍ)؟',
                    audio: 'letter_sad_tayyarah_words',
                    options: [
                        { text: 'خَلِيلٍ', correct: true },
                        { text: 'خَلِيلٌ', correct: false },
                        { text: 'خَلِيلًا', correct: false }
                    ],
                    feedback: 'رائع جداً! خَلِيلٍ تنتهي بكسرتين متماثلتين تحت الحرف الأخير.'
                },
                {
                    id: 5,
                    skill: 'أشكال الهمزة',
                    question: 'مَا هِيَ الْكَلِمَةُ الَّتِي تَحْتَوِي عَلَى هَمْزَةٍ مَفْتُوحَةٍ فَوْقَ الْأَلِفِ (أَ)؟',
                    audio: 'letter_hamza_words_intro',
                    options: [
                        { text: 'أَحْمَد', correct: true },
                        { text: 'إِقْبَال', correct: false },
                        { text: 'أُمِّي (بِالضَّمَّة)', correct: false }
                    ],
                    feedback: 'بطل! أَحْمَد تبدأ بهمزة مفتوحة (أَ).'
                },
                {
                    id: 6,
                    skill: 'التمييز بين الظاء والضاد',
                    question: 'فِي دَرْسِ (مَحْفُوظٌ وَظَافِرٌ)، كَلِمَةُ (ظَافِر) تَبْدَأُ بِحَرْفِ:',
                    audio: 'letter_dha_sound',
                    options: [
                        { text: 'الظَّاءِ (ظ) بِعَصَا وَنُقْطَة', correct: true },
                        { text: 'الضَّادِ (ض) بِسِنٍّ وَنُقْطَة', correct: false },
                        { text: 'الطَّاءِ (ط) بِدُونِ نُقْطَة', correct: false }
                    ],
                    feedback: 'ممتاز! حرف الظاء (ظ) يخرج طرف اللسان فيه مع الثنايا العليا.'
                },
                {
                    id: 7,
                    skill: 'أشكال حرف الهاء',
                    question: 'كَلِمَةُ (مِيَاهُ الْمَطَرِ)، كَلِمَةُ (مِيَاه) تَنْتَهِي بِـ:',
                    audio: 'letter_h_sound',
                    options: [
                        { text: 'هَاءٍ آخِرِيَّةٍ مُنْفَصِلَةٍ (ـه / ه)', correct: true },
                        { text: 'تَاءٍ مَرْبُوطَةٍ مُنْقَّطَة (ة)', correct: false },
                        { text: 'تَاءٍ مَفْتُوحَة (ت)', correct: false }
                    ],
                    feedback: 'صحيح 100%! مِيَاه تنتهي بهاء من غير نقطتين.'
                },
                {
                    id: 8,
                    skill: 'تحليل الكلمات المشددة',
                    question: 'تَحْلِيلُ كَلِمَةِ (بَطّ) هُوَ:',
                    audio: 'letter_t_batt_syllables',
                    options: [
                        { text: 'بَطْ + طُ', correct: true },
                        { text: 'بَ + طَ', correct: false },
                        { text: 'بَاطّ', correct: false }
                    ],
                    feedback: 'إجابة متميزة! الحرف المشدد طّ يُفك إلى ساكن ومتحرك.'
                },
                {
                    id: 9,
                    skill: 'التمييز بين الغين والخاء',
                    question: 'أَيُّ كَلِمَةٍ مِمَّا يَلِي تَبْدَأُ بِحَرْفِ الْغَيْنِ (غـ)؟',
                    audio: 'letter_ghayn_sound',
                    options: [
                        { text: 'غَزَال', correct: true },
                        { text: 'خَرُوف', correct: false },
                        { text: 'عَلَم', correct: false }
                    ],
                    feedback: 'أحسنت! غَزَالٌ وَغُرَابٌ تبدأ بالغين.'
                },
                {
                    id: 10,
                    skill: 'الطلاقة القرائية الختامية',
                    question: 'مَاذَا قَالَتْ زَيْنَبُ فِي نَصِّ (سَأَلَ الْمُعَلِّمُ)؟',
                    audio: 'lam_read_s2',
                    options: [
                        { text: 'نَرَى الشَّمْسَ وَالْقَمَرَ وَالنُّجُوم', correct: true },
                        { text: 'نَرَى الْغَيْمَ وَالْمَطَر', correct: false },
                        { text: 'نَرَى الْأَرْضَ وَالْبَحْر', correct: false }
                    ],
                    feedback: 'مبروك يا عبقري! أجبت على السؤال الختامي بتفوق واستحققت وسام القراءة الأكبر!'
                }
            ]
        }
    };

    // ==========================================================================
    // 2. بيانات التدريبات الصيفية الإثرائية (Summer Enrichment Camp Data)
    // ==========================================================================
    const SUMMER_STORIES = [
        {
            id: 'summer_story1',
            title: 'نُزْهَةُ الْأَصْدِقَاءِ فِي بُسْتَانِ النَّخِيل',
            icon: '🌴',
            text: 'فِي صَبَاحِ يَوْمٍ جَمِيلٍ مِنَ الْعُطْلَةِ الصَّيْفِيَّةِ، خَرَجَ فِرَاسٌ وَسَارَةُ وَنَدِيمٌ إِلَى بُسْتَانِ الْجَدِّ فِي قَرْيَتِنَا الْجَمِيلَةِ. كَانَتْ أَشْجَارُ النَّخِيلِ بَاسِقَةً تُعَانِقُ السَّمَاءَ، وَالرُّمَّانُ وَالْعِنَبُ يَتَدَلَّى بَيْنَ الْأَغْصَانِ. قَالَ فِرَاسٌ: «مَا أَجْمَلَ هَوَاءَ الرِّيفِ النَّقِيَّ!». قَطَفَتْ سَارَةُ بَعْضَ التَّمْرِ اللَّذِيذِ وَقَدَّمَتْهُ لِلْأَصْدِقَاءِ، وَجَلَسَ الْجَمِيعُ تَحْتَ ظِلِّ شَجَرَةِ التُّوتِ يَقْرَؤُونَ قِصَصَ «قِرَاءَتِي» بِفَرَحٍ وَسُرُورٍ.',
            questions: [
                {
                    q: 'إِلَى أَيْنَ خَرَجَ الْأَصْدِقَاءُ فِي الصَّبَاحِ؟',
                    options: ['إِلَى بُسْتَانِ الْجَدِّ فِي الْقَرْيَة', 'إِلَى شَاطِئِ الْبَحْر', 'إِلَى السُّوقِ الْكَبِير'],
                    correct: 0
                },
                {
                    q: 'مَاذَا قَطَفَتْ سَارَةُ لِلْأَصْدِقَاءِ؟',
                    options: ['بَعْضَ التَّمْرِ اللَّذِيذ', 'أَزْهَارًا صَفْرَاء', 'تُفَّاحًا أَخْضَر'],
                    correct: 0
                },
                {
                    q: 'مَاذَا فَعَلَ الْأَصْدِقَاءُ تَحْتَ ظِلِّ شَجَرَةِ التُّوتِ؟',
                    options: ['جَلَسُوا يَقْرَؤُونَ قِصَصَ قِرَاءَتِي', 'نَامُوا طَوِيلًا', 'لَعِبُوا بِالْكُرَةِ فَقَطْ'],
                    correct: 0
                }
            ]
        },
        {
            id: 'summer_story2',
            title: 'الْبَبَّغَاءُ الْفَصِيحُ وَالْقِطُّ الْمُشْمِشِيُّ',
            icon: '🦜',
            text: 'فِي بَيْتِ الصَّدِيقِ طَارِقٍ، كَانَ هُنَاكَ بَبَّغَاءٌ جَمِيلُ الرِّيشِ اسْمُهُ «فَصِيحٌ»، وَقِطٌّ صَغِيرٌ لَطِيفٌ اسْمُهُ «مُشْمِشٌ». كَانَ فَصِيحٌ يُرَدِّدُ كَلِمَاتِ الْقِرَاءَةِ كُلَّمَا سَمِعَ طَارِقًا يَتَدَرَّبُ: «دَادَا.. بَابَا.. مَامَا.. وَرْدٌ!». أَمَّا مُشْمِشٌ فَكَانَ يَمُوءُ بِرِقَّةٍ وَيَمْشِي حَوْلَ قَفَصِهِ. يَوْمًا مَا فَتَحَ طَارِقٌ الْبَابَ، فَصَاحَ فَصِيحٌ: «أَهْلًا وَسَهْلًا بِكُم!». ضَحِكَ الْجَمِيعُ وَأَعْطَوْا فَصِيحًا حَبَّاتِ فُسْتُقٍ شَهِيَّة.',
            questions: [
                {
                    q: 'مَا هُوَ اسْمُ الْبَبَّغَاءِ فِي الْقِصَّةِ؟',
                    options: ['فَصِيحٌ', 'ظَافِرٌ', 'شَامِلٌ'],
                    correct: 0
                },
                {
                    q: 'مَاذَا كَانَ يُرَدِّدُ فَصِيحٌ عِنْدَمَا يَتَدَرَّبُ طَارِقٌ؟',
                    options: ['كَلِمَاتِ الْقِرَاءَةِ (دَادَا.. بَابَا..)', 'أَصْوَاتَ السَّيَّارَاتِ', 'الْبُكَاءَ'],
                    correct: 0
                }
            ]
        },
        {
            id: 'summer_story3',
            title: 'سَفِينَةُ الْفَضَاءِ وَالْكَوَاكِبُ السَّبْعَةُ',
            icon: '🚀',
            text: 'صَنَعَ مُنْتَظَرٌ مَعَ أُخْتِهِ زَيْنَبَ مُجَسَّمًا لِسَفِينَةِ فَضَاءٍ صَغِيرَةٍ مِنْ كَرْتُونِ الْوَرَقِ الْمُلَوَّنِ. لَوَّنَ مُنْتَظَرٌ السَّفِينَةَ بِاللَّوْنِ الْفِضِّيِّ، وَكَتَبَ عَلَيْهَا كَلِمَةَ (الْعِلْمُ نُورٌ). قَالَتْ زَيْنَبُ: «تَخَيَّلْ أَنَّنَا نَطِيرُ فَوْقَ السَّحَابِ وَنَرَى كَوْكَبَ الْمِرِّيخِ وَالْقَمَرَ وَالشَّمْسَ!». قَالَ لَهَا مُنْتَظَرٌ: «إِذَا اجْتَهَدْنَا فِي دِرَاسَتِنَا وَقَرَأْنَا كَثِيرًا، سَنُصْبِحُ عُلَمَاءَ فَضَاءٍ نَرْفَعُ اسْمَ بِلَادِنَا الْعِرَاقِ عَالِيًا!».',
            questions: [
                {
                    q: 'مَاذَا صَنَعَ مُنْتَظَرٌ وَزَيْنَبُ؟',
                    options: ['مُجَسَّمًا لِسَفِينَةِ فَضَاءٍ صَغِيرَة', 'طَيَّارَةً وَرَقِيَّةً فَقَطْ', 'قَلْعَةً رَمْلِيَّة'],
                    correct: 0
                },
                {
                    q: 'مَاذَا كَتَبَ مُنْتَظَرٌ عَلَى السَّفِينَةِ؟',
                    options: ['الْعِلْمُ نُورٌ', 'الصَّيْفُ حَارٌّ', 'إِلَى اللِّقَاءِ'],
                    correct: 0
                }
            ]
        },
        {
            id: 'summer_story4',
            title: 'مُسَابَقَةُ الْقِرَاءَةِ فِي الْعُطْلَةِ الصَّيْفِيَّةِ',
            icon: '🏆',
            text: 'أَعْلَنَتْ مَكْتَبَةُ الْمَدْرَسَةِ عَنْ مُسَابَقَةِ «فَارِسِ الْقِرَاءَةِ الصَّيْفِيِّ» لِأَبْطَالِ الصَّفِّ الْأَوَّلِ. اشْتَرَكَ فِيهَا حَسَنٌ وَهِشَامٌ وَخِتَامٌ. كَانَ كُلُّ تِلْمِيذٍ يَقْرَأُ كِتَابًا صَغِيرًا كُلَّ أُسْبُوعٍ، وَيَكْتُبُ كَلِمَاتِهِ الْجَدِيدَةَ فِي دَفْتَرِهِ الْخَاصِّ. عِنْدَ نِهَايَةِ الصَّيْفِ، فَازَ التَّلَامِيذُ جَمِيعًا بِأَوْسِمَةِ التَّفَوُّقِ وَكَانُوا مُسْتَعِدِّينَ تَمَامًا لِبَدْءِ الصَّفِّ الثَّانِي الِابْتِدَائِيِّ بِكُلِّ هِمَّةٍ وَنَشَاطٍ.',
            questions: [
                {
                    q: 'مَا هُوَ عُنْوَانُ الْمُسَابَقَةِ الَّتِي أَعْلَنَتْهَا الْمَكْتَبَةُ؟',
                    options: ['فَارِسُ الْقِرَاءَةِ الصَّيْفِيِّ', 'سِبَاقُ الْجَرْي', 'رَسْمُ اللَّوْحَات'],
                    correct: 0
                },
                {
                    q: 'كَيْفَ كَانَ التَّلَامِيذُ عِنْدَ نِهَايَةِ الصَّيْفِ؟',
                    options: ['مُسْتَعِدِّينَ تَمَامًا لِبَدْءِ الصَّفِّ الثَّانِي', 'مُتْعَبِينَ وَكَسَالَى', 'نَاسِينَ لِلْقِرَاءَة'],
                    correct: 0
                }
            ]
        }
    ];

    // جدول الأسابيع الصيفية الـ 8 للمتابعة
    const SUMMER_WEEKS_PLAN = [
        { week: 1, title: 'الأسبوع 1: مراجعة أصوات المدود والحركات القصيرة', tasks: ['قراءة كلمات (دَادَا، دَار، دُور، دِين)', 'كتابة حرف المد بالألوان 3 مرات', 'ترديد نشيد البطة'] },
        { week: 2, title: 'الأسبوع 2: ورشة الحروف (ب، م، د، ر)', tasks: ['تحليل وتركيب (مَامَا، بَابَا، بَاب، بُوم)', 'إملاء منظور لـ 4 كلمات', 'سرد قصة الأسرة بأسلوبك'] },
        { week: 3, title: 'الأسبوع 3: حروف الوحدة الثانية وتنوين الضم', tasks: ['قراءة نص (فِرَاسٌ وَأَنِيسٌ وَمَيْسُون)', 'تمييز تنوين الضم في (وَرْدٌ، قِطَارٌ)', 'ترديد نشيد مدرستي'] },
        { week: 4, title: 'الأسبوع 4: حروف (ط، ف، ق، ل، ع) والتقطيع', tasks: ['قراءة نص ريف مناف وبوق نديم', 'تقطيع 5 كلمات إلى مقاطع صوتية', 'رسم كلمة بَطّ ولُطْفِي'] },
        { week: 5, title: 'الأسبوع 5: حروف (ح، ش، ز، ج، ص) وتنوين الكسر', tasks: ['قراءة نص طَيَّارَةُ وَقَّاص', 'استخراج الكلمات المنتهية بتنوين كسر', 'تحدي الكلمات البصرية الصيفي'] },
        { week: 6, title: 'الأسبوع 6: الهمزة والشدة وحروف (ض، خ، ث، ك)', tasks: ['قراءة قصة أَمِين بَنَّاء وزُرْنَا بَيْتَ جَدِّي', 'تحديد الحرف المشدد وفكه', 'ترديد نشيد هيا نلعب'] },
        { week: 7, title: 'الأسبوع 7: الحروف (غ، هـ، ذ، ظ) والإتقان', tasks: ['قراءة نصوص (غَزَال، مِيَاهُ الْمَطَر، مَحْفُوظ)', 'التمييز بين الظاء (ظ) والضاد (ض)', 'كتابة جملة كاملة بخط جميل'] },
        { week: 8, title: 'الأسبوع 8: اللام الشمسية واللام القمرية والتخرج', tasks: ['تصنيف 10 كلمات (شمسية / قمرية)', 'قراءة نص سَأَلَ الْمُعَلِّمُ كاملاً بطلاقة', 'طباعة شهادة الاستعداد للصف الثاني'] }
    ];

    // ==========================================================================
    // 3. بنك بطاقات القراءة الذكية (Smart Flashcards Bank Data)
    // ==========================================================================
    const FLASHCARDS_BANK = [
        // حروف ومدود
        { id: 'c_01', type: 'letter', unit: 'prep', word: 'اَ / ا / اِ / اُ', syllables: ['أَ', 'إِ', 'أُ', 'ا'], audio: 'vowel_a_sound', hint: 'أصوات الألف والمد', meaning: 'حرف الألف بحركاته ومدوده' },
        { id: 'c_02', type: 'letter', unit: 'prep', word: 'و / وُ / وِ / وَ', syllables: ['وَ', 'وُ', 'وِ', 'وُو'], audio: 'vowel_w_sound', hint: 'مد الواو وصوته', meaning: 'حرف الواو وحركاته' },
        { id: 'c_03', type: 'letter', unit: 'prep', word: 'يـ / ي / يُ / يِ', syllables: ['يَـ', 'يُـ', 'يِـ', 'يِي'], audio: 'vowel_y_sound', hint: 'مد الياء وصوته', meaning: 'حرف الياء وأشكاله' },
        
        // كلمات الوحدة 1 (أسرتي)
        { id: 'c_04', type: 'word', unit: 'unit1', word: 'دَادَا', syllables: ['دَا', 'دَا'], audio: 'faseeh_blend_dada', hint: 'الطفل الرضيع الصغير', meaning: 'كلمة أساسية تتكون من مقطعين متماثلين (دَا + دَا)' },
        { id: 'c_05', type: 'word', unit: 'unit1', word: 'دَار', syllables: ['دَا', 'ر'], audio: 'letter_r_read_dar', hint: 'البيت والمنزل', meaning: 'مقطع ممدود بالألف يليه حرف الراء' },
        { id: 'c_06', type: 'word', unit: 'unit1', word: 'بَابَا', syllables: ['بَا', 'بَا'], audio: 'letter_b_read_baba', hint: 'الأب الحنون', meaning: 'مقطعان صوتيان (بَا + بَا)' },
        { id: 'c_07', type: 'word', unit: 'unit1', word: 'مَامَا', syllables: ['مَا', 'مَا'], audio: 'letter_m_read_mama', hint: 'الأم الغالية', meaning: 'مقطعان صوتيان (مَا + مَا)' },
        { id: 'c_08', type: 'word', unit: 'unit1', word: 'بَابُ', syllables: ['بَا', 'بُ'], audio: 'letter_b_read_babu', hint: 'باب البيت', meaning: 'مقطع ممدود ومقطع مضموم' },
        { id: 'c_09', type: 'word', unit: 'unit1', word: 'بُوم', syllables: ['بُو', 'م'], audio: 'letter_m_read_bum', hint: 'طائر البوم', meaning: 'مد بالواو يليه الميم' },
        { id: 'c_10', type: 'word', unit: 'unit1', word: 'دُود', syllables: ['دُو', 'د'], audio: 'letter_d_dood_syllables', hint: 'دودة الأرض', meaning: 'مد بالواو وصوت الدال' },

        // كلمات الوحدة 2 (مدرستي)
        { id: 'c_11', type: 'word', unit: 'unit2', word: 'نُور', syllables: ['نُو', 'ر'], audio: 'act5_noor', hint: 'الضياء واسم بنت', meaning: 'مقطع نُو ممدود يليه راء' },
        { id: 'c_12', type: 'word', unit: 'unit2', word: 'دُور', syllables: ['دُو', 'ر'], audio: 'letter_r_read_door', hint: 'بيوت كثيرة', meaning: 'جمع دار، مقطع دُو يليه راء' },
        { id: 'c_13', type: 'word', unit: 'unit2', word: 'فِرَاس', syllables: ['فِـ', 'رَا', 'س'], audio: 'unit2_firas_word', hint: 'اسم تلميذ شجاع', meaning: 'ثلاثة مقاطع صوتية متناسقة' },
        { id: 'c_14', type: 'word', unit: 'unit2', word: 'بَنَات', syllables: ['بَـ', 'نَا', 'ت'], audio: 'unit2_banat_word', hint: 'جمع بنت', meaning: 'تاء مفتوحة في آخر الكلمة' },
        { id: 'c_15', type: 'word', unit: 'unit2', word: 'سَارَة', syllables: ['سَا', 'رَ', 'ة'], audio: 'unit2_sarah_word', hint: 'اسم تلميذة لطيفة', meaning: 'تنتهي بتاء مربوطة' },
        { id: 'c_16', type: 'word', unit: 'unit2', word: 'وَرْدٌ', syllables: ['وَرْ', 'دٌ'], audio: 'tanween_dham_wardun', hint: 'أزهار جميلة', meaning: 'مقطع ساكن يليه تنوين ضم' },
        { id: 'c_17', type: 'word', unit: 'unit2', word: 'قِطَارٌ', syllables: ['قِـ', 'طَا', 'رٌ'], audio: 'tanween_dham_qitarun', hint: 'وسيلة نقل سريعة', meaning: 'تنتهي بتنوين ضم (ـٌ)' },
        { id: 'c_18', type: 'word', unit: 'unit2', word: 'نَمِير', syllables: ['نَـ', 'مِيـ', 'ر'], audio: 'unit2_nameer_word', hint: 'اسم تلميذ نشيط', meaning: 'مد بالياء في الوسط (مِيـ)' },

        // كلمات الوحدة 3 (ألعابي وحيواناتي)
        { id: 'c_19', type: 'word', unit: 'unit3', word: 'بَطّ', syllables: ['بَطْ', 'طُ'], audio: 'letter_t_batt_syllables', hint: 'طائر يسبح في الماء', meaning: 'كلمة مشددة الحرف الأخير' },
        { id: 'c_20', type: 'word', unit: 'unit3', word: 'طُيُور', syllables: ['طُ', 'يُو', 'ر'], audio: 'letter_t_tuyooro_syllables', hint: 'كائنات تطير في السماء', meaning: 'مد بالواو وحرف الطاء' },
        { id: 'c_21', type: 'word', unit: 'unit3', word: 'طَارِق', syllables: ['طَا', 'رِ', 'ق'], audio: 'letter_t_tariq_syllables', hint: 'اسم ولد بطل', meaning: 'ثلاثة مقاطع صوتية' },
        { id: 'c_22', type: 'word', unit: 'unit3', word: 'رِيف', syllables: ['رِيـ', 'ف'], audio: 'letter_f_reef_syllables', hint: 'الطبيعة الخضراء', meaning: 'مد بالياء يليه فاء' },
        { id: 'c_23', type: 'word', unit: 'unit3', word: 'مَنَاف', syllables: ['مَـ', 'نَا', 'ف'], audio: 'letter_f_manaf_syllables', hint: 'اسم رجل في الريف', meaning: 'مقطع ممدود بالألف' },
        { id: 'c_24', type: 'word', unit: 'unit3', word: 'بُوق', syllables: ['بُو', 'ق'], audio: 'letter_q_booq_syllables', hint: 'آلة موسيقية للنفخ', meaning: 'بوق قديم لناديم' },
        { id: 'c_25', type: 'word', unit: 'unit3', word: 'نَدِيم', syllables: ['نَـ', 'دِيـ', 'م'], audio: 'letter_q_nadeem_syllables', hint: 'يقود بقر بدران', meaning: 'مد بالياء في الوسط' },
        { id: 'c_26', type: 'word', unit: 'unit3', word: 'نَبِيل', syllables: ['نَـ', 'بِيـ', 'ل'], audio: 'letter_l_nabeel_syllables', hint: 'بقال يبيع اللبن والرمان', meaning: 'مد بالياء وحرف اللام' },
        { id: 'c_27', type: 'word', unit: 'unit3', word: 'سَالِم', syllables: ['سَا', 'لِـ', 'م'], audio: 'letter_ayn_salim_syllables', hint: 'مزارع في البستان', meaning: 'مد بالألف وحرف العين' },

        // كلمات الوحدة 4 (صحتي وبيئتي)
        { id: 'c_28', type: 'word', unit: 'unit4', word: 'حِمَار', syllables: ['حِـ', 'مَا', 'ر'], audio: 'letter_ha_words_intro', hint: 'حيوان أليف صبور', meaning: 'حاء مكسورة ومد بالألف' },
        { id: 'c_29', type: 'word', unit: 'unit4', word: 'شَمْس', syllables: ['شَمْ', 'س'], audio: 'letter_sh_sound', hint: 'تضيء الكون بالنهار', meaning: 'مقطع ساكن (شَمْـ)' },
        { id: 'c_30', type: 'word', unit: 'unit4', word: 'زَيْتُون', syllables: ['زَيْـ', 'تُو', 'ن'], audio: 'letter_z_words_intro', hint: 'شجرة مباركة وثمر شهي', meaning: 'مقطع ساكن ومد بالواو' },
        { id: 'c_31', type: 'word', unit: 'unit4', word: 'جَمَل', syllables: ['جَـ', 'مَـ', 'ل'], audio: 'letter_j_words_intro', hint: 'سفينة الصحراء', meaning: 'حركات قصيرة متوالية' },
        { id: 'c_32', type: 'word', unit: 'unit4', word: 'طَيَّارَة', syllables: ['طَيْـ', 'يَا', 'رَ', 'ة'], audio: 'letter_sad_tayyarah_words', hint: 'طائرة وقاص الورقية', meaning: 'ياء مشددة وتاء مربوطة' },
        { id: 'c_33', type: 'word', unit: 'unit4', word: 'مَقَصّ', syllables: ['مَـ', 'قَصْ', 'صُ'], audio: 'letter_sad_words_intro', hint: 'أداة لقص الورق', meaning: 'صاد مشددة بالضم' },

        // كلمات الوحدة 5 (هواياتي وألعابي)
        { id: 'c_34', type: 'word', unit: 'unit5', word: 'أَمِين', syllables: ['أَ', 'مِيـ', 'ن'], audio: 'letter_hamza_words_intro', hint: 'بناء نشيط يبني دارنا', meaning: 'همزة مفتوحة ومد بالياء' },
        { id: 'c_35', type: 'word', unit: 'unit5', word: 'إِقْبَال', syllables: ['إِقْـ', 'بَا', 'ل'], audio: 'letter_hamza_words_intro', hint: 'اسم بنت مجتهدة', meaning: 'همزة مكسورة ومقطع ساكن' },
        { id: 'c_36', type: 'word', unit: 'unit5', word: 'ضُحَى', syllables: ['ضُـ', 'حَى'], audio: 'letter_dhad_words_intro', hint: 'تعمل في المستشفى', meaning: 'ضاد مضمومة وألف مقصورة' },
        { id: 'c_37', type: 'word', unit: 'unit5', word: 'حَوْض', syllables: ['حَوْ', 'ض'], audio: 'letter_dhad_words_intro', hint: 'حوض السباحة', meaning: 'مقطع ساكن بحرف الواو' },
        { id: 'c_38', type: 'word', unit: 'unit5', word: 'خَرُوف', syllables: ['خَـ', 'رُو', 'ف'], audio: 'letter_kha_words_intro', hint: 'خروف خليل السمين', meaning: 'خاء مفتوحة ومد بالواو' },
        { id: 'c_39', type: 'word', unit: 'unit5', word: 'مِحْرَاث', syllables: ['مِحْـ', 'رَا', 'ث'], audio: 'letter_tha_words_intro', hint: 'محراث حارث الفلاح', meaning: 'مقطع ساكن وحرف الثاء' },
        { id: 'c_40', type: 'word', unit: 'unit5', word: 'كِتَاب', syllables: ['كِـ', 'تَا', 'ب'], audio: 'letter_kaf_words_intro', hint: 'كتاب حكايات مفيدة', meaning: 'كاف مكسورة ومد بالألف' },
        { id: 'c_41', type: 'word', unit: 'unit5', word: 'مَالِك', syllables: ['مَا', 'لِـ', 'ك'], audio: 'letter_kaf_words_intro', hint: 'سماك يبيع السمك', meaning: 'مد بالألف وكاف متطرفة' },
        { id: 'c_42', type: 'word', unit: 'unit5', word: 'جَدِّي', syllables: ['جَدْ', 'دِي'], audio: 'shaddah_formation', hint: 'أبو الأب الحكيم', meaning: 'دال مشددة ومد بالياء' },

        // كلمات الوحدة 6 (العالم من حولي)
        { id: 'c_43', type: 'word', unit: 'unit6', word: 'غُرَاب', syllables: ['غُـ', 'رَا', 'ب'], audio: 'letter_ghayn_words_intro', hint: 'طائر ذكي أسود', meaning: 'غين مضمومة ومد بالألف' },
        { id: 'c_44', type: 'word', unit: 'unit6', word: 'غَزَال', syllables: ['غَـ', 'زَا', 'ل'], audio: 'letter_ghayn_words_intro', hint: 'غزال رشيق في الغابة', meaning: 'غين مفتوحة ومد بالألف' },
        { id: 'c_45', type: 'word', unit: 'unit6', word: 'مِيَاه', syllables: ['مِـ', 'يَا', 'ه'], audio: 'letter_h_words_intro', hint: 'مياه المطر العذبة', meaning: 'تنتهي بهاء منفصلة' },
        { id: 'c_46', type: 'word', unit: 'unit6', word: 'هِلَال', syllables: ['هِـ', 'لَا', 'ل'], audio: 'letter_h_words_intro', hint: 'هلال العيد في السماء', meaning: 'هاء مكسورة ومقطع لَا' },
        { id: 'c_47', type: 'word', unit: 'unit6', word: 'أُسْتَاذ', syllables: ['أُسْـ', 'تَا', 'ذ'], audio: 'letter_dhal_words_intro', hint: 'أستاذ وتلاميذ في الصف', meaning: 'همزة مضمومة وحرف الذال' },
        { id: 'c_48', type: 'word', unit: 'unit6', word: 'مُنْتَظَر', syllables: ['مُنْـ', 'تَـ', 'ظَـ', 'ر'], audio: 'letter_dha_words_intro', hint: 'تلميذ نشيط ومجتهد', meaning: 'أربعة مقاطع بحرف الظاء' },
        { id: 'c_49', type: 'word', unit: 'unit6', word: 'مَحْفُوظ', syllables: ['مَحْـ', 'فُو', 'ظ'], audio: 'letter_dha_words_intro', hint: 'تلميذ نظيف يحفظ دروسه', meaning: 'مقطع ساكن ومد وحرف الظاء' },
        { id: 'c_50', type: 'word', unit: 'unit6', word: 'الشَّمْسُ', syllables: ['اشْـ', 'شَمْـ', 'سُ'], audio: 'lam_word_ashams', hint: 'اللام الشمسية المدغمة', meaning: 'لام شمسية لا تُنطق وبعدها شدة' },
        { id: 'c_51', type: 'word', unit: 'unit6', word: 'الْقَمَرُ', syllables: ['اَلْـ', 'قَـ', 'مَـ', 'رُ'], audio: 'lam_word_alqamar', hint: 'اللام القمرية المظهرة', meaning: 'لام قمرية ساكنة تُنطق بوضوح' },
        { id: 'c_52', type: 'word', unit: 'unit6', word: 'الْمُعَلِّمُ', syllables: ['اَلْـ', 'مُـ', 'عَلْـ', 'لِـ', 'مُ'], audio: 'lam_word_almuallim', hint: 'معلم القراءة الفاضل', meaning: 'لام قمرية ولام مشددة' },

        // مقاطع صوتية تأسيسية (Syllables)
        { id: 'c_53', type: 'syllable', unit: 'unit1', word: 'دَا', syllables: ['دَ', 'ا'], audio: 'vowel_a_sound', hint: 'مقطع مد مفتوح', meaning: 'دال مع مد الألف' },
        { id: 'c_54', type: 'syllable', unit: 'unit1', word: 'بَا', syllables: ['بَ', 'ا'], audio: 'letter_b_ba_sound', hint: 'مقطع مد مفتوح', meaning: 'باء مع مد الألف' },
        { id: 'c_55', type: 'syllable', unit: 'unit1', word: 'مَا', syllables: ['مَ', 'ا'], audio: 'letter_m_ma_sound', hint: 'مقطع مد مفتوح', meaning: 'ميم مع مد الألف' },
        { id: 'c_56', type: 'syllable', unit: 'unit1', word: 'دُو', syllables: ['دُ', 'و'], audio: 'letter_d_du_sound', hint: 'مقطع مد بالواو', meaning: 'دال مع مد الواو' },
        { id: 'c_57', type: 'syllable', unit: 'unit2', word: 'نُو', syllables: ['نُ', 'و'], audio: 'act5_noor', hint: 'مقطع مد بالواو', meaning: 'نون مع مد الواو' },
        { id: 'c_58', type: 'syllable', unit: 'unit2', word: 'رِيـ', syllables: ['رِ', 'ي'], audio: 'letter_r_sound', hint: 'مقطع مد بالياء', meaning: 'راء مع مد الياء' },
        { id: 'c_59', type: 'syllable', unit: 'unit3', word: 'قِدْ', syllables: ['قِ', 'دْ'], audio: 'letter_d_qidr_syllable', hint: 'مقطع ساكن مغلق', meaning: 'قاف مكسورة ودال ساكنة ✊' },
        { id: 'c_60', type: 'syllable', unit: 'unit3', word: 'طَبْـ', syllables: ['طَ', 'بْ'], audio: 'letter_b_tabl_syllable', hint: 'مقطع ساكن مغلق', meaning: 'طاء مفتوحة وباء ساكنة ✊' },

        // جمل قرائية مسترسلة (Sentences Fluency)
        { id: 'c_61', type: 'sentence', unit: 'unit1', word: 'دَادَا دَارُ دُور', syllables: ['دَادَا', 'دَارُ', 'دُور'], audio: 'letter_d_read_all', hint: 'جملة الوحدة الأولى الأساسية', meaning: 'قراءة مسترسلة من 3 كلمات تأسيسية' },
        { id: 'c_62', type: 'sentence', unit: 'unit1', word: 'بَابَا مَامَا دَادَا', syllables: ['بَابَا', 'مَامَا', 'دَادَا'], audio: 'letter_d_read_all', hint: 'الأسرة السعيدة', meaning: 'قراءة كلمات الوحدة الأولى الثلاث' },
        { id: 'c_63', type: 'sentence', unit: 'unit2', word: 'دَارُ نُور بَابُ دَارِنَا', syllables: ['دَارُ', 'نُور', 'بَابُ', 'دَارِنَا'], audio: 'unit2_firas_sentence1', hint: 'جملة درس دار نور', meaning: 'طلاقة قرائية مركبة' },
        { id: 'c_64', type: 'sentence', unit: 'unit3', word: 'بُوقُ نَدِيمٍ قَدِيمٌ', syllables: ['بُوقُ', 'نَدِيمٍ', 'قَدِيمٌ'], audio: 'letter_q_nadeem_sentence', hint: 'جملة درس بوق نديم', meaning: 'جملة متناغمة القوافي' },
        { id: 'c_65', type: 'sentence', unit: 'unit6', word: 'سَأَلَ الْمُعَلِّمُ التَّلَامِيذَ', syllables: ['سَأَلَ', 'الْمُعَلِّمُ', 'التَّلَامِيذَ'], audio: 'lam_read_s1', hint: 'جملة درس اللام الشمسية والقمرية', meaning: 'جمع اللام القمرية والشمسية في جملة واحدة' },
        { id: 'c_66', type: 'sentence', unit: 'unit6', word: 'نَرَى الشَّمْسَ وَالْقَمَرَ', syllables: ['نَرَى', 'الشَّمْسَ', 'وَالْقَمَرَ'], audio: 'lam_read_s2', hint: 'مقولة التلميذة زينب', meaning: 'قراءة شمسية وقمرية بطلاقة' }
    ];

    // ==========================================================================
    // 4. حالة المنظومة (State Management)
    // ==========================================================================
    let currentActiveTab = 'exams'; // 'exams' | 'summer' | 'cards' | 'print'
    let activeExamId = null;
    let activeQuestionIdx = 0;
    let examScore = 0;
    let examAnswers = []; // [ { qIdx, selectedOption, isCorrect } ]
    let examTimer = null;
    let examTimeSeconds = 0;

    // حالة بطاقات القراءة
    let activeCardFilter = 'all'; // 'all' | 'word' | 'syllable' | 'letter' | 'sentence'
    let activeCardUnit = 'all';   // 'all' | 'unit1' | 'unit2' ...
    let cardSearchQuery = '';
    let isAutoFlashPlaying = false;
    let autoFlashTimer = null;
    let autoFlashIndex = 0;
    let autoFlashIntervalMs = 2500;

    // حالة التدريبات الصيفية
    let currentStoryIdx = 0;
    let summerTasksCompleted = {}; // { "w1_t0": true, ... }

    // ==========================================================================
    // 5. تهيئة وتحميل البيانات المحلية
    // ==========================================================================
    function init() {
        try {
            const savedTasks = localStorage.getItem(STORAGE_KEY_SUMMER_TASKS);
            if (savedTasks) {
                summerTasksCompleted = JSON.parse(savedTasks);
            }
        } catch (e) {
            console.warn('Error loading summer tasks from localStorage:', e);
        }
    }

    // ==========================================================================
    // 6. التحكم بالنافذة المنبثقة والتبويبات
    // ==========================================================================
    window.openEnrichmentModal = function(tabName) {
        const modal = document.getElementById('enrichmentModal');
        if (!modal) return;
        modal.style.display = 'flex';
        switchEnrichmentTab(tabName || 'exams');
    };

    window.closeEnrichmentModal = function() {
        const modal = document.getElementById('enrichmentModal');
        if (modal) modal.style.display = 'none';
        stopAutoFlash();
        if (typeof stopAudio === 'function') stopAudio();
    };

    window.switchEnrichmentTab = function(tabName) {
        currentActiveTab = tabName || 'exams';

        // تحديث أزرار التبويبات
        ['exams', 'summer', 'cards', 'print'].forEach(t => {
            const btn = document.getElementById(`tabEnrich_${t}`);
            const pane = document.getElementById(`paneEnrich_${t}`);
            if (btn) btn.classList.toggle('active', t === currentActiveTab);
            if (pane) pane.classList.toggle('active', t === currentActiveTab);
        });

        // تشغيل التهيئات الخاصة بكل قسم
        if (currentActiveTab === 'exams') {
            if (!activeExamId) renderExamsHub();
        } else if (currentActiveTab === 'cards') {
            renderFlashcardsGrid();
        } else if (currentActiveTab === 'summer') {
            renderSummerStory(currentStoryIdx);
            renderSummerWeeksPlan();
        } else if (currentActiveTab === 'print') {
            renderPrintHub();
        }
    };

    // ==========================================================================
    // 7. منطق اختبارات نهاية الفصل (Exams Engine)
    // ==========================================================================
    function renderExamsHub() {
        const container = document.getElementById('examsHubContent');
        if (!container) return;

        container.innerHTML = `
            <div class="exams-hub-selector no-print">
                <div class="exam-choice-card card-term1" onclick="startExam('term1')">
                    <span class="exam-card-badge" style="background: #dbeafe; color: #1e40af;">نصف السنة</span>
                    <div style="font-size: 2.2rem;">📘</div>
                    <div class="exam-card-title">اختبار نهاية الفصل الدراسي الأول</div>
                    <div class="exam-card-desc">
                        يغطي وحدات التهيئة، حروف المد، والوحدات (أسرتي، مدرستي، ألعابي وحيواناتي). اختبار شيق وتفاعلي من 10 أسئلة ذكية.
                    </div>
                    <div class="exam-card-meta">
                        <span style="color: #2563eb;">10 أسئلة مهارية ⭐</span>
                        <button class="btn btn-primary" style="padding: 6px 14px; font-size: 0.85rem;">ابدأ الاختبار 🚀</button>
                    </div>
                </div>

                <div class="exam-choice-card card-term2" onclick="startExam('term2')">
                    <span class="exam-card-badge" style="background: #fce7f3; color: #9d174d;">نهاية العام الختامي</span>
                    <div style="font-size: 2.2rem;">🏆</div>
                    <div class="exam-card-title">اختبار نهاية الفصل الثاني والنهائي</div>
                    <div class="exam-card-desc">
                        الاختبار الختامي الشامل لكتاب قراءتي 100%! يغطي الحركات، الشدة، الهمزات، واللام الشمسية واللام القمرية بأسئلة تفاعلية رائعة.
                    </div>
                    <div class="exam-card-meta">
                        <span style="color: #db2777;">10 أسئلة ختامية 🌟</span>
                        <button class="btn btn-primary" style="background: #db2777; border-color: #be185d; padding: 6px 14px; font-size: 0.85rem;">ابدأ الاختبار 🚀</button>
                    </div>
                </div>
            </div>

            <div class="rule-highlight-card" style="border-right-color: #6366f1; background: #ffffff;">
                <div class="rule-card-title" style="color: #4338ca;">
                    <span>💡</span> <span>إرشادات الاختبار للتلميذ والمعلم وولي الأمر:</span>
                </div>
                <p class="rule-card-text" style="color: #475569; font-size: 0.9rem; line-height: 1.8;">
                    • اضغط زر <b>«استمع للسؤال 🔊»</b> ليستمع الطفل إلى قراءة السؤال بصوت فصيح المشجع.<br>
                    • اختر الإجابة الصحيحة بنقرة واحدة لتحصل على التغذية الراجعة والتعزيز الصوتي الفوري.<br>
                    • عند اكتمال الاختبار، تُمنح وثيقة تقرير رسمي وتقدير لفظي معتمد (ممتاز، جيد جداً...) جاهزة للطباعة والتوقيع.
                </p>
            </div>
        `;
    }

    window.startExam = function(examId) {
        if (!EXAMS_DATA[examId]) return;
        activeExamId = examId;
        activeQuestionIdx = 0;
        examScore = 0;
        examAnswers = [];
        examTimeSeconds = 0;

        if (examTimer) clearInterval(examTimer);
        examTimer = setInterval(() => { examTimeSeconds++; }, 1000);

        renderActiveQuestion();
    };

    function renderActiveQuestion() {
        const container = document.getElementById('examsHubContent');
        if (!container || !activeExamId) return;

        const exam = EXAMS_DATA[activeExamId];
        const q = exam.questions[activeQuestionIdx];
        const total = exam.questions.length;
        const progressPercent = Math.round(((activeQuestionIdx) / total) * 100);

        container.innerHTML = `
            <div class="active-exam-container">
                <div class="exam-top-bar no-print">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <button class="btn-step" onclick="exitExamPrompt()" style="padding: 6px 12px; font-size: 0.82rem;">✕ خروج</button>
                        <span style="font-weight: 900; color: #1e3a8a; font-size: 1rem;">${exam.title}</span>
                    </div>

                    <div class="exam-progress-bar-wrap">
                        <div style="display: flex; justify-content: space-between; font-size: 0.78rem; font-weight: 800; color: #64748b;">
                            <span>السؤال ${activeQuestionIdx + 1} من ${total}</span>
                            <span>${progressPercent}% مكتمل</span>
                        </div>
                        <div class="exam-progress-rail">
                            <div class="exam-progress-fill" style="width: ${progressPercent}%;"></div>
                        </div>
                    </div>

                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-weight: 900; color: #f59e0b; font-size: 1.1rem;">⭐ ${examScore}</span>
                        <button class="btn-guide-pill" onclick="playCurrentQuestionAudio()" title="استمع للسؤال بصوت فصيح">
                            <span>🔊 استمع للسؤال</span>
                        </button>
                    </div>
                </div>

                <div class="exam-question-card">
                    <div class="exam-skill-pill">
                        <span>🎯 مهارة:</span> <span>${q.skill}</span>
                    </div>
                    <div class="exam-question-text">${q.question}</div>

                    <div class="exam-options-grid" id="examOptionsGrid">
                        ${q.options.map((opt, idx) => `
                            <button class="exam-option-btn" onclick="handleOptionSelect(${idx})" id="optBtn_${idx}">
                                <span>${opt.text}</span>
                            </button>
                        `).join('')}
                    </div>

                    <div id="examFeedbackBox" style="margin-top: 20px; font-size: 1.1rem; font-weight: 900; display: none;"></div>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center;" class="no-print">
                    <button class="btn-step" onclick="prevQuestion()" ${activeQuestionIdx === 0 ? 'disabled style="opacity: 0.4;"' : ''}>
                        <span>السابق ➡️</span>
                    </button>
                    <span style="font-size: 0.85rem; color: #94a3b8; font-weight: 700;">منصة قراءتي التفاعلية الذكية • إعداد المهندس أسامة خليل هاشم</span>
                    <button class="btn-step primary" id="btnNextQuestion" onclick="nextQuestion()" style="display: none;">
                        <span>السؤال التالي ⬅️</span>
                    </button>
                </div>
            </div>
        `;

        // تشغيل صوت السؤال تلقائياً أو عبر فصيح
        playCurrentQuestionAudio();
    }

    window.playCurrentQuestionAudio = function() {
        if (!activeExamId) return;
        const exam = EXAMS_DATA[activeExamId];
        const q = exam.questions[activeQuestionIdx];
        if (q && q.audio && typeof mascotSpeak === 'function') {
            mascotSpeak(q.question, q.audio);
        }
    };

    window.handleOptionSelect = function(selectedIdx) {
        if (!activeExamId) return;
        const exam = EXAMS_DATA[activeExamId];
        const q = exam.questions[activeQuestionIdx];
        const opt = q.options[selectedIdx];
        const feedbackBox = document.getElementById('examFeedbackBox');
        const nextBtn = document.getElementById('btnNextQuestion');

        // تعطيل الأزرار لمنع التكرار
        const allBtns = document.querySelectorAll('.exam-option-btn');
        allBtns.forEach(b => b.disabled = true);

        const chosenBtn = document.getElementById(`optBtn_${selectedIdx}`);

        if (opt.correct) {
            examScore++;
            if (chosenBtn) chosenBtn.classList.add('selected-correct');
            if (feedbackBox) {
                feedbackBox.style.display = 'block';
                feedbackBox.style.color = '#059669';
                feedbackBox.innerHTML = `🌟 أحسنت إجابة صحيحة! ${q.feedback}`;
            }
            if (typeof playAudio === 'function') playAudio('faseeh_encourage_super');
        } else {
            if (chosenBtn) chosenBtn.classList.add('selected-wrong');
            // إبراز الصحيح
            q.options.forEach((o, i) => {
                if (o.correct) {
                    const cBtn = document.getElementById(`optBtn_${i}`);
                    if (cBtn) cBtn.classList.add('selected-correct');
                }
            });
            if (feedbackBox) {
                feedbackBox.style.display = 'block';
                feedbackBox.style.color = '#dc2626';
                feedbackBox.innerHTML = `💡 الإجابة الصحيحة هي: (${q.options.find(o => o.correct).text}). ${q.feedback}`;
            }
        }

        examAnswers.push({
            qIdx: activeQuestionIdx,
            question: q.question,
            skill: q.skill,
            selected: opt.text,
            isCorrect: opt.correct
        });

        if (nextBtn) {
            nextBtn.style.display = 'inline-flex';
            if (activeQuestionIdx === exam.questions.length - 1) {
                nextBtn.innerHTML = 'عرض النتيجة النهائية 🏆';
            }
        }
    };

    window.nextQuestion = function() {
        if (!activeExamId) return;
        const exam = EXAMS_DATA[activeExamId];
        if (activeQuestionIdx < exam.questions.length - 1) {
            activeQuestionIdx++;
            renderActiveQuestion();
        } else {
            finishExam();
        }
    };

    window.prevQuestion = function() {
        if (!activeExamId) return;
        if (activeQuestionIdx > 0) {
            activeQuestionIdx--;
            renderActiveQuestion();
        }
    };

    window.exitExamPrompt = function() {
        if (confirm('هل ترغب في مغادرة الاختبار والعودة لقائمة الاختبارات؟')) {
            if (examTimer) clearInterval(examTimer);
            activeExamId = null;
            renderExamsHub();
        }
    };

    function finishExam() {
        if (examTimer) clearInterval(examTimer);
        const container = document.getElementById('examsHubContent');
        if (!container || !activeExamId) return;

        const exam = EXAMS_DATA[activeExamId];
        const total = exam.questions.length;
        const percentage = Math.round((examScore / total) * 100);

        let rating = 'مُمْتَازٌ 🌟';
        let ratingColor = '#059669';
        if (percentage >= 90) { rating = 'مُمْتَازٌ مَعَ مَرْتَبَةِ الشَّرَفِ 🌟'; ratingColor = '#059669'; }
        else if (percentage >= 80) { rating = 'جَيِّدٌ جِدًّا ✨'; ratingColor = '#16a34a'; }
        else if (percentage >= 70) { rating = 'جَيِّدٌ 👍'; ratingColor = '#2563eb'; }
        else if (percentage >= 60) { rating = 'وَسَطٌ ⚖️'; ratingColor = '#ca8a04'; }
        else { rating = 'مَقْبُولٌ وَبِحَاجَةٍ لِمُتَابَعَةٍ ⚠️'; ratingColor = '#ea580c'; }

        // اسم التلميذ من الملف الشخصي
        let studentName = 'بطل قراءتي الذكية';
        try {
            const p = localStorage.getItem('qiraati-smart-eval-profile');
            if (p) studentName = JSON.parse(p).name || studentName;
        } catch(e) {}

        container.innerHTML = `
            <div class="exam-result-grand-card">
                <div class="exam-score-dial" style="background: linear-gradient(135deg, ${ratingColor} 0%, #0f172a 100%);">
                    <span class="exam-score-num">${percentage}%</span>
                    <span class="exam-score-lbl">${examScore} من ${total} صحيحة</span>
                </div>

                <h2 style="font-size: 1.8rem; font-weight: 900; color: #1e293b; margin: 10px 0 6px 0;">
                    تهانينا يا ${studentName}! 🎉
                </h2>
                <div style="font-size: 1.25rem; font-weight: 900; color: ${ratingColor}; margin-bottom: 16px;">
                    التقدير اللفظي المعتمد: ${rating}
                </div>
                <p style="font-size: 0.95rem; color: #475569; max-width: 600px; margin: 0 auto 20px auto; line-height: 1.7;">
                    لقد أتممت بنجاح <b>«${exam.title}»</b> في منصة قراءتي التفاعلية الذكية، وأثبت استيعابك للمهارات الفونيمية والقرائية المقررة.
                </p>

                <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;" class="no-print">
                    <button class="btn btn-teach" onclick="window.print()" style="padding: 10px 22px; font-size: 0.95rem;">
                        <span>🖨️</span> <span>طباعة وثيقة النتيجة الرسمية</span>
                    </button>
                    <button class="btn btn-primary" onclick="startExam('${activeExamId}')" style="padding: 10px 20px; font-size: 0.95rem;">
                        <span>🔄</span> <span>إعادة الاختبار</span>
                    </button>
                    <button class="btn btn-step" onclick="activeExamId = null; renderExamsHub();" style="padding: 10px 18px; font-size: 0.95rem;">
                        <span>📋</span> <span>قائمة الاختبارات</span>
                    </button>
                </div>
            </div>

            <!-- الوثيقة القابلة للطباعة الرسمية A4 -->
            <div class="exam-report-print-container" style="background: white; border: 2px solid #cbd5e1; border-radius: 16px; padding: 24px; margin-top: 20px;">
                <div style="text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 14px; margin-bottom: 16px;">
                    <div style="font-size: 0.9rem; font-weight: 800; color: #64748b;">جُمْهُورِيَّةُ الْعِرَاقِ • وِزَارَةُ التَّرْبِيَة • مَنَصَّةُ قِرَاءَتِي الذَّكِيَّة</div>
                    <h3 style="margin: 6px 0; color: #1e3a8a; font-size: 1.4rem;">استمارة نتيجة اختبار المهارات القرائية الرسمي</h3>
                    <div style="font-size: 0.85rem; font-weight: 800; color: #059669;">إعداد وتطوير: المهندس أسامة خليل هاشم</div>
                </div>

                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; font-size: 0.9rem; font-weight: 800; margin-bottom: 16px; background: #f8fafc; padding: 12px; border-radius: 10px;">
                    <div>👤 التلميذ: <b>${studentName}</b></div>
                    <div>📘 المادة: <b>قراءتي (الصف الأول)</b></div>
                    <div>🏆 التقدير: <b style="color: ${ratingColor};">${rating}</b></div>
                </div>

                <table class="grades-glossary-table" style="width: 100%; font-size: 0.88rem; margin-bottom: 20px;">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>السؤال والمهارة المقررة</th>
                            <th>الإجابة المرصودة</th>
                            <th>النتيجة</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${examAnswers.map((ans, idx) => `
                            <tr>
                                <td>${idx + 1}</td>
                                <td><b>${ans.skill}:</b> ${ans.question}</td>
                                <td>${ans.selected}</td>
                                <td style="text-align: center; font-weight: 900; color: ${ans.isCorrect ? '#059669' : '#dc2626'};">
                                    ${ans.isCorrect ? 'صحيح ✔️' : 'خاطئ ✖️'}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1.5px solid #e2e8f0; padding-top: 16px; font-size: 0.82rem; font-weight: 800; color: #475569;">
                    <div>توقيع معلم الصف: __________________</div>
                    <div>ختم المدرسة الرسمي: [ مُعْتَمَد ١٠٠٪ ]</div>
                    <div>إعداد المنصة: المهندس أسامة خليل هاشم</div>
                </div>
            </div>
        `;

        if (typeof playAudio === 'function') playAudio('lam_completion_congrats');
    }

    // ==========================================================================
    // 8. منطق التدريبات الصيفية الإثرائية (Summer Camp Engine)
    // ==========================================================================
    function renderSummerStory(idx) {
        currentStoryIdx = idx;
        const container = document.getElementById('summerStoryContent');
        if (!container) return;

        const story = SUMMER_STORIES[currentStoryIdx];

        container.innerHTML = `
            <div class="summer-story-box">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
                    <h3 class="summer-story-title">
                        <span>${story.icon}</span> <span>${story.title}</span>
                    </h3>
                    <div style="display: flex; gap: 6px;">
                        ${SUMMER_STORIES.map((s, i) => `
                            <button class="filter-pill-btn ${i === currentStoryIdx ? 'active' : ''}" onclick="switchSummerStory(${i})">
                                ${s.icon} قصة ${i + 1}
                            </button>
                        `).join('')}
                    </div>
                </div>

                <div class="summer-story-text" id="summerStoryTextEl">
                    ${story.text.split(' ').map(w => `<span class="summer-story-word" onclick="speakStoryWord('${w.replace(/['"«».,:!؟]/g, '')}')">${w}</span>`).join(' ')}
                </div>

                <div style="background: #f0fdf4; border: 1.5px solid #a7f3d0; border-radius: 14px; padding: 14px; margin-bottom: 18px;">
                    <div style="font-size: 0.95rem; font-weight: 900; color: #065f46; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
                        <span>💡</span> <span>توجيه القراءة الصيفية:</span>
                    </div>
                    <div style="font-size: 0.85rem; color: #047857; font-weight: 700;">
                        انقر على أي كلمة في القصة للاستماع إلى نطقها الفونيمي المشكول بطلاقة!
                    </div>
                </div>

                <!-- أسئلة الفهم القرائي للقصة -->
                <div style="margin-top: 18px;">
                    <div style="font-size: 1.05rem; font-weight: 900; color: #1e3a8a; margin-bottom: 10px;">
                        📝 أسئلة الفهم الاستيعابي للقصة:
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        ${story.questions.map((qObj, qI) => `
                            <div style="background: white; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 12px 16px;">
                                <div style="font-weight: 800; color: #1e293b; margin-bottom: 8px;">
                                    ${qI + 1}. ${qObj.q}
                                </div>
                                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                                    ${qObj.options.map((opt, oI) => `
                                        <button class="filter-pill-btn" onclick="checkStoryAnswer(this, ${oI === qObj.correct})" style="font-size: 0.88rem; padding: 6px 14px;">
                                            ${opt}
                                        </button>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    window.switchSummerStory = function(idx) {
        renderSummerStory(idx);
    };

    window.speakStoryWord = function(word) {
        if (typeof mascotSpeak === 'function') {
            mascotSpeak(word, null);
        }
    };

    window.checkStoryAnswer = function(btnEl, isCorrect) {
        if (isCorrect) {
            btnEl.style.background = '#10b981';
            btnEl.style.color = 'white';
            btnEl.style.borderColor = '#059669';
            if (typeof playAudio === 'function') playAudio('faseeh_encourage_super');
        } else {
            btnEl.style.background = '#ef4444';
            btnEl.style.color = 'white';
            btnEl.style.borderColor = '#dc2626';
        }
    };

    function renderSummerWeeksPlan() {
        const container = document.getElementById('summerWeeksContainer');
        if (!container) return;

        container.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
                <div>
                    <h3 style="margin: 0; color: #0369a1; font-size: 1.25rem; font-weight: 900;">
                        🗓️ جدول أنشطة وتحديات الأسابيع الصيفية الـ 8
                    </h3>
                    <div style="font-size: 0.82rem; color: #64748b; font-weight: 700; margin-top: 2px;">
                        برنامج متكامل للحفاظ على المكتسبات القرائية والانتقال الواثق للصف الثاني الابتدائي:
                    </div>
                </div>
                <button class="btn btn-teach no-print" onclick="window.print()" style="font-size: 0.88rem; padding: 6px 16px;">
                    <span>🖨️</span> <span>طباعة جدول الأنشطة الصيفية</span>
                </button>
            </div>

            <div class="summer-weeks-grid">
                ${SUMMER_WEEKS_PLAN.map(w => `
                    <div class="summer-week-card">
                        <div class="summer-week-header">
                            <span>${w.title.split(':')[0]}</span>
                            <span style="font-size: 0.76rem; background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 8px;">مكتمل</span>
                        </div>
                        <div style="font-size: 0.82rem; font-weight: 800; color: #1e293b; margin-bottom: 8px;">
                            ${w.title.split(':')[1] || ''}
                        </div>
                        <div>
                            ${w.tasks.map((task, tI) => {
                                const taskKey = `w${w.week}_t${tI}`;
                                const isChecked = summerTasksCompleted[taskKey] ? 'checked' : '';
                                return `
                                    <label class="summer-task-item">
                                        <input type="checkbox" class="summer-task-checkbox" ${isChecked} onchange="toggleSummerTask('${taskKey}', this.checked)">
                                        <span>${task}</span>
                                    </label>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    window.toggleSummerTask = function(taskKey, isChecked) {
        summerTasksCompleted[taskKey] = isChecked;
        try {
            localStorage.setItem(STORAGE_KEY_SUMMER_TASKS, JSON.stringify(summerTasksCompleted));
        } catch(e) {}
    };

    // ==========================================================================
    // 9. منطق بنك بطاقات القراءة الذكية (Smart Flashcards Bank Engine)
    // ==========================================================================
    function getFilteredCards() {
        return FLASHCARDS_BANK.filter(card => {
            if (activeCardFilter !== 'all' && card.type !== activeCardFilter) return false;
            if (activeCardUnit !== 'all' && card.unit !== activeCardUnit) return false;
            if (cardSearchQuery && cardSearchQuery.trim() !== '') {
                const q = cardSearchQuery.trim();
                const matchWord = card.word.includes(q);
                const matchHint = card.hint.includes(q);
                if (!matchWord && !matchHint) return false;
            }
            return true;
        });
    }

    function renderFlashcardsGrid() {
        const grid = document.getElementById('flashcardsGridEl');
        const countBadge = document.getElementById('cardsCountBadge');
        if (!grid) return;

        const cards = getFilteredCards();
        if (countBadge) countBadge.innerText = `${cards.length} بطاقة ذكية`;

        if (cards.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #64748b; font-weight: 800;">
                    🔍 لم يتم العثور على بطاقات تطابق معايير البحث والفلترة.
                </div>
            `;
            return;
        }

        grid.innerHTML = cards.map((card, i) => `
            <div class="flashcard-wrapper" id="cardWrap_${card.id}" onclick="flipFlashcard('${card.id}')" title="انقر لقلب البطاقة ومعاينة التحليل الصوتي المقطعي">
                <div class="flashcard-inner">
                    <!-- الوجه الأمامي (Front) -->
                    <div class="flashcard-front">
                        <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
                            <span class="card-top-tag">${getCardTypeLabel(card.type)}</span>
                            <button class="btn-guide-pill" onclick="event.stopPropagation(); playCardAudio('${card.id}')" title="استمع لنطق الكلمة" style="padding: 2px 8px; font-size: 0.78rem;">
                                <span>🔊</span>
                            </button>
                        </div>

                        <div class="card-main-word">${card.word}</div>

                        <div class="card-sub-hint">
                            <span>🔄 انقر للقلب</span>
                        </div>
                    </div>

                    <!-- الوجه الخلفي (Back) -->
                    <div class="flashcard-back">
                        <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
                            <span class="card-top-tag" style="background: #dcfce7; color: #166534;">التحليل الصوتي 👏</span>
                            <span style="font-size: 0.8rem; font-weight: 800; color: #047857;">${card.unit.toUpperCase()}</span>
                        </div>

                        <div style="margin: auto 0; text-align: center;">
                            <div class="card-syllables-row">
                                ${card.syllables.map(s => `<span class="syllable-chip">${s}</span>`).join(' + ')}
                            </div>
                            <div style="font-size: 0.84rem; font-weight: 700; color: #334155; margin-top: 10px;">
                                ${card.hint}
                            </div>
                        </div>

                        <button class="btn btn-teach" onclick="event.stopPropagation(); playCardAudio('${card.id}')" style="padding: 4px 14px; font-size: 0.82rem;">
                            <span>🔊 استمع للنطق</span>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function getCardTypeLabel(type) {
        if (type === 'word') return '📖 كلمة بصرية';
        if (type === 'syllable') return '🧩 مقطع صوتي';
        if (type === 'letter') return '🔤 صوت حرف';
        if (type === 'sentence') return '📜 جملة قرائية';
        return 'بطاقة';
    }

    window.flipFlashcard = function(cardId) {
        const wrap = document.getElementById(`cardWrap_${cardId}`);
        if (wrap) wrap.classList.toggle('flipped');
    };

    window.playCardAudio = function(cardId) {
        const card = FLASHCARDS_BANK.find(c => c.id === cardId);
        if (!card) return;
        if (card.audio && typeof playAudio === 'function') {
            playAudio(card.audio);
        } else if (typeof mascotSpeak === 'function') {
            mascotSpeak(card.word, null);
        }
    };

    window.setCardFilter = function(filterVal) {
        activeCardFilter = filterVal;
        document.querySelectorAll('.filter-pill-btn[data-filter]').forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-filter') === filterVal);
        });
        renderFlashcardsGrid();
    };

    window.setCardUnitFilter = function(unitVal) {
        activeCardUnit = unitVal;
        renderFlashcardsGrid();
    };

    window.searchFlashcards = function(query) {
        cardSearchQuery = query;
        renderFlashcardsGrid();
    };

    // وضع القراءة السريعة التلقائية (Auto-Flash Speed Drill)
    window.toggleAutoFlash = function() {
        if (isAutoFlashPlaying) {
            stopAutoFlash();
        } else {
            startAutoFlash();
        }
    };

    function startAutoFlash() {
        const cards = getFilteredCards();
        if (cards.length === 0) return;
        isAutoFlashPlaying = true;
        autoFlashIndex = 0;

        const btn = document.getElementById('btnAutoFlashToggle');
        if (btn) btn.innerHTML = '<span>⏸️</span> <span>إيقاف القراءة السريعة</span>';

        const speedSelect = document.getElementById('autoFlashSpeedSelect');
        autoFlashIntervalMs = speedSelect ? parseInt(speedSelect.value) : 2500;

        runAutoFlashStep();
        autoFlashTimer = setInterval(runAutoFlashStep, autoFlashIntervalMs);
    }

    function runAutoFlashStep() {
        const cards = getFilteredCards();
        if (!cards.length) { stopAutoFlash(); return; }

        if (autoFlashIndex >= cards.length) autoFlashIndex = 0;
        const currentCard = cards[autoFlashIndex];

        // تمرير إلى البطاقة وتسليط الضوء
        document.querySelectorAll('.flashcard-wrapper').forEach(w => w.style.outline = 'none');
        const activeWrap = document.getElementById(`cardWrap_${currentCard.id}`);
        if (activeWrap) {
            activeWrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            activeWrap.style.outline = '4px solid #10b981';
            activeWrap.style.borderRadius = '24px';
        }

        playCardAudio(currentCard.id);
        autoFlashIndex++;
    }

    function stopAutoFlash() {
        isAutoFlashPlaying = false;
        if (autoFlashTimer) clearInterval(autoFlashTimer);
        autoFlashTimer = null;
        const btn = document.getElementById('btnAutoFlashToggle');
        if (btn) btn.innerHTML = '<span>⚡</span> <span>بدء القراءة السريعة التلقائية</span>';
        document.querySelectorAll('.flashcard-wrapper').forEach(w => w.style.outline = 'none');
    }

    // ==========================================================================
    // 10. مركز الطباعة والتصدير الورقي (Print Hub)
    // ==========================================================================
    function renderPrintHub() {
        const container = document.getElementById('printHubContent');
        if (!container) return;

        container.innerHTML = `
            <div style="background: white; border-radius: 20px; border: 2px solid #e2e8f0; padding: 24px; margin-bottom: 20px;">
                <h3 style="color: #1e3a8a; margin: 0 0 10px 0; font-size: 1.3rem;">
                    🖨️ مركز الطباعة والتصدير الملون للأنشطة والبطاقات الورقية
                </h3>
                <p style="color: #64748b; font-size: 0.9rem; line-height: 1.7; margin-bottom: 20px;">
                    يقدم هذا المركز نماذج عالية الجودة معدة للطباعة بحجم الورق القياسي (A4) للاستخدام المباشر في الفصول الدراسية والمنازل.
                </p>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px;">
                    <div style="border: 1.5px solid #cbd5e1; border-radius: 16px; padding: 18px; background: #f8fafc; text-align: center;">
                        <div style="font-size: 2.2rem; margin-bottom: 8px;">🗂️</div>
                        <h4 style="margin: 0 0 6px 0; color: #047857;">بطاقات القراءة السريعة للقص (A4)</h4>
                        <p style="font-size: 0.82rem; color: #64748b; margin-bottom: 14px;">
                            طباعة شبكة البطاقات المختارة بخطوط قص منقطة (✂️) لقصها وتوزيعها على التلاميذ.
                        </p>
                        <button class="btn btn-teach" onclick="switchEnrichmentTab('cards'); setTimeout(() => window.print(), 300);" style="padding: 6px 16px; font-size: 0.85rem;">
                            <span>🖨️ طباعة البطاقات</span>
                        </button>
                    </div>

                    <div style="border: 1.5px solid #cbd5e1; border-radius: 16px; padding: 18px; background: #f8fafc; text-align: center;">
                        <div style="font-size: 2.2rem; margin-bottom: 8px;">🗓️</div>
                        <h4 style="margin: 0 0 6px 0; color: #0284c7;">جدول متابعة القراءة الصيفية</h4>
                        <p style="font-size: 0.82rem; color: #64748b; margin-bottom: 14px;">
                            لوحة متابعة أسبوعية لـ 8 أسابيع صيفية لتعليقها في غرفة الطفل وتلوين النجوم.
                        </p>
                        <button class="btn btn-primary" onclick="switchEnrichmentTab('summer'); setTimeout(() => window.print(), 300);" style="padding: 6px 16px; font-size: 0.85rem; background: #0284c7;">
                            <span>🖨️ طباعة جدول الصيف</span>
                        </button>
                    </div>

                    <div style="border: 1.5px solid #cbd5e1; border-radius: 16px; padding: 18px; background: #f8fafc; text-align: center;">
                        <div style="font-size: 2.2rem; margin-bottom: 8px;">📝</div>
                        <h4 style="margin: 0 0 6px 0; color: #dc2626;">نماذج الاختبارات التحريرية</h4>
                        <p style="font-size: 0.82rem; color: #64748b; margin-bottom: 14px;">
                            طباعة نماذج أسئلة الاختبار للفصل الأول والثاني بصيغة استمارة تقييم رسمية.
                        </p>
                        <button class="btn btn-danger" onclick="switchEnrichmentTab('exams'); setTimeout(() => window.print(), 300);" style="padding: 6px 16px; font-size: 0.85rem;">
                            <span>🖨️ طباعة نماذج الاختبار</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // تهيئة عند بدء التشغيل
    document.addEventListener('DOMContentLoaded', init);
    // كشف خارجي للتكامل
    window.EnrichmentHub = {
        init: init,
        open: window.openEnrichmentModal,
        close: window.closeEnrichmentModal
    };

})();
