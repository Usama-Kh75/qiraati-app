/* ==========================================================================
 * منصة قراءتي التفاعلية الذكية - نظام الاختبارات التشخيصية وتوليد نماذج الامتحانات الوزارية الورقية A4
 * (Diagnostic Assessment Engine & Automated A4 Ministerial Paper Exam Generator - Models A/B/C)
 * متوافق 100% مع كتاب قراءتي الجديد ومعايير وزارة التربية العراقية
 * إعداد وتطوير: المهندس أسامة خليل هاشم
 * ========================================================================== */

(function () {
    'use strict';

    // مفاتيح التخزين المعزولة الملتزمة بقواعد أسامة (البادئة qiraati-smart-)
    const STORAGE_KEY_DIAG_RECORDS = 'qiraati-smart-diagnostic-records';
    const STORAGE_KEY_EXAM_SETTINGS = 'qiraati-smart-exam-gen-settings';

    // ==========================================================================
    // 1. بنك الاختبارات التشخيصية التفاعلية (Diagnostic Assessment Battery)
    // ==========================================================================
    const DIAGNOSTIC_TESTS = {
        baseline: {
            id: 'baseline',
            title: 'الاختبار التشخيصي القبلي (التهيئة والوحدة الأولى)',
            scope: 'الوحدات 1 - 2 (الوعي الفونيمي، د، ر، و، ب، ن، م)',
            desc: 'تشخيص استعداد التلميذ ومعرفته للأصوات والمقاطع وحروف المد الأساسية في بداية العام الدراسي.',
            questions: [
                {
                    id: 'q1',
                    domain: 'phonemic_awareness',
                    domainName: 'الوعي الصوتي والفونيمي',
                    prompt: 'ما هو الصوت الأول الذي تبدأ به كلمة (دَار)؟',
                    audioKey: 'phoneme_pure_dal',
                    options: [
                        { text: 'دَ', isCorrect: true },
                        { text: 'رَ', isCorrect: false },
                        { text: 'بَ', isCorrect: false }
                    ]
                },
                {
                    id: 'q2',
                    domain: 'letter_knowledge',
                    domainName: 'معرفة الحروف وأشكالها',
                    prompt: 'اختر شكل حرف (الباء) في أول الكلمة:',
                    audioKey: 'phoneme_pure_baa',
                    options: [
                        { text: 'بـ', isCorrect: true },
                        { text: 'ـبـ', isCorrect: false },
                        { text: 'ـب', isCorrect: false }
                    ]
                },
                {
                    id: 'q3',
                    domain: 'vowels_and_lengths',
                    domainName: 'الحركات والمدود',
                    prompt: 'أي الكلمات الآتية تحوي مد الواو الطويل (ـو / و)؟',
                    audioKey: 'word_door',
                    options: [
                        { text: 'دُور', isCorrect: true },
                        { text: 'دَار', isCorrect: false },
                        { text: 'دَدَا', isCorrect: false }
                    ]
                },
                {
                    id: 'q4',
                    domain: 'segmentation_blending',
                    domainName: 'التحليل والتركيب الصوتي',
                    prompt: 'عند تركيب المقطعين (دَا) + (دَا) تصبح الكلمة:',
                    audioKey: 'word_dada',
                    options: [
                        { text: 'دَادَا', isCorrect: true },
                        { text: 'دَار', isCorrect: false },
                        { text: 'دُور', isCorrect: false }
                    ]
                },
                {
                    id: 'q5',
                    domain: 'comprehension_matching',
                    domainName: 'الفهم والمطابقة القرائية',
                    prompt: 'اختر الكلمة المطابقة للصورة (صورة دار):',
                    image: 'activity_r_scene.png',
                    options: [
                        { text: 'دَار', isCorrect: true },
                        { text: 'نَار', isCorrect: false },
                        { text: 'بَاب', isCorrect: false }
                    ]
                }
            ]
        },
        midyear: {
            id: 'midyear',
            title: 'الاختبار التشخيصي الفصلي (نصف السنة - الوحدات 1 إلى 3)',
            scope: 'الوحدات 1 - 3 (الحركات الثلاث، المدود، ق، ف، ز، ل، م، ك)',
            desc: 'تشخيص تقدم التلميذ في تفكيك وتركيب الكلمات وقراءة الجمل البسيطة وتمييز الحركات القصيرة.',
            questions: [
                {
                    id: 'm1',
                    domain: 'phonemic_awareness',
                    domainName: 'الوعي الصوتي والفونيمي',
                    prompt: 'ما هي الحركة على حرف الميم في كلمة (مِيزَان)؟',
                    audioKey: 'word_mizan',
                    options: [
                        { text: 'الكسرة (مِـ)', isCorrect: true },
                        { text: 'الفتحة (مَـ)', isCorrect: false },
                        { text: 'الضمة (مُـ)', isCorrect: false }
                    ]
                },
                {
                    id: 'm2',
                    domain: 'letter_knowledge',
                    domainName: 'معرفة الحروف وأشكالها',
                    prompt: 'اختر حرف (القاف) في آخر الكلمة متصلاً من بين الآتي:',
                    audioKey: 'phoneme_pure_qaf',
                    options: [
                        { text: 'ـق', isCorrect: true },
                        { text: 'قـ', isCorrect: false },
                        { text: 'ـقـ', isCorrect: false }
                    ]
                },
                {
                    id: 'm3',
                    domain: 'segmentation_blending',
                    domainName: 'التحليل والتركيب الصوتي',
                    prompt: 'حلل كلمة (بُوق) إلى مقاطعها الصوتية الصحيحة:',
                    audioKey: 'word_booq',
                    options: [
                        { text: '[ بُو ] + [ قْ ]', isCorrect: true },
                        { text: '[ بُ ] + [ وق ]', isCorrect: false },
                        { text: '[ ب ] + [ و ] + [ ق ]', isCorrect: false }
                    ]
                },
                {
                    id: 'm4',
                    domain: 'vowels_and_lengths',
                    domainName: 'الحركات والمدود',
                    prompt: 'أي الكلمات الآتية تحوي مد الياء الطويل (ـيـ / ي)؟',
                    audioKey: 'word_nouri',
                    options: [
                        { text: 'نُورِي', isCorrect: true },
                        { text: 'نَبْنِي', isCorrect: false },
                        { text: 'نَار', isCorrect: false }
                    ]
                },
                {
                    id: 'm5',
                    domain: 'comprehension_matching',
                    domainName: 'الفهم والمطابقة القرائية',
                    prompt: 'أكمل الجملة بالكلمة المناسبة: «بُوقُ نَدِيمٍ ........»',
                    options: [
                        { text: 'قَدِيمٌ', isCorrect: true },
                        { text: 'جَدِيدٌ', isCorrect: false },
                        { text: 'كَبِيرٌ', isCorrect: false }
                    ]
                }
            ]
        },
        comprehensive: {
            id: 'comprehensive',
            title: 'الاختبار التشخيصي الشامل والختامي (الوحدات 1 إلى 6)',
            scope: 'كافة وحدات المنهج (الحروف الـ 28، الشدة، الهمزات، التنوينات، اللام الشمسية والقمرية)',
            desc: 'تقييم شامل يقيس المعايير الوزارية لكفاءة القراءة والطلاقة بنهاية الصف الأول الابتدائي.',
            questions: [
                {
                    id: 'c1',
                    domain: 'phonemic_awareness',
                    domainName: 'الوعي الصوتي والفونيمي',
                    prompt: 'أي الكلمات الآتية تبدأ بـ (لام قمرية) تلفظ ساكنة واضحة؟',
                    options: [
                        { text: 'الْقَمَرُ', isCorrect: true },
                        { text: 'الشَّمْسُ', isCorrect: false },
                        { text: 'التِّلْمِيذُ', isCorrect: false }
                    ]
                },
                {
                    id: 'c2',
                    domain: 'vowels_and_lengths',
                    domainName: 'الحركات والمدود',
                    prompt: 'حدد الكلمة التي تنتهي بتنوين الضم (ـٌ):',
                    options: [
                        { text: 'وَرْدٌ', isCorrect: true },
                        { text: 'وَرْداً', isCorrect: false },
                        { text: 'وَرْدٍ', isCorrect: false }
                    ]
                },
                {
                    id: 'c3',
                    domain: 'letter_knowledge',
                    domainName: 'معرفة الحروف وأشكالها',
                    prompt: 'الحرف المشدد في كلمة (حَدَّادٌ) يدل على أن أصل الحرف:',
                    options: [
                        { text: 'حرفان متماثلان (الأول ساكن والثاني متحرك)', isCorrect: true },
                        { text: 'حرف واحد ممدود بالألف', isCorrect: false },
                        { text: 'حرف منون بتنوين الفتح', isCorrect: false }
                    ]
                },
                {
                    id: 'c4',
                    domain: 'segmentation_blending',
                    domainName: 'التحليل والتركيب الصوتي',
                    prompt: 'تركيب المقاطع [ مِـ ] + [ يَـا ] + [ هُ ] يعطي كلمة:',
                    options: [
                        { text: 'مِيَاهُ', isCorrect: true },
                        { text: 'مَالُ', isCorrect: false },
                        { text: 'مَطَرُ', isCorrect: false }
                    ]
                },
                {
                    id: 'c5',
                    domain: 'comprehension_matching',
                    domainName: 'الفهم والمطابقة القرائية',
                    prompt: 'ما هي مهنة (صَلَاح) في درس القراءة؟',
                    options: [
                        { text: 'فَلَّاحٌ يَحْرُثُ الأَرْضَ', isCorrect: true },
                        { text: 'شُرْطِيُّ المُرُورِ', isCorrect: false },
                        { text: 'بَقَّالٌ يَزِنُ الزَّبِيبَ', isCorrect: false }
                    ]
                }
            ]
        }
    };

    // ==========================================================================
    // 2. بنك الأسئلة الامتحانية الوزارية الورقية بنماذج متعددة (A / B / C)
    // ==========================================================================
    const PAPER_EXAM_MODELS = {
        A: {
            code: 'A',
            titleAr: 'النموذج (أ)',
            badgeColor: '#16a34a',
            serial: 'EXAM-2026-M1-A',
            questions: [
                {
                    num: 'السؤال الأول',
                    title: 'تمييز الأصوات وحروف المد والحركات:',
                    rule: 'حَوِّطْ (ضَعْ دَائِرَةً حَوْلَ) الْحَرْفَ أَوِ الْمَقْطَعَ الصَّحِيحَ لِكُلِّ كَلِمَةٍ مِمَّا يَأْتِي:',
                    grade: '20 درجة',
                    items: [
                        { word: 'دَار', options: ['دَ', 'دُو', 'دِي'], correct: 'دَ' },
                        { word: 'بَابَا', options: ['بَا', 'بُو', 'بِي'], correct: 'بَا' },
                        { word: 'نُورِي', options: ['نُو', 'نَا', 'نِي'], correct: 'نُو' },
                        { word: 'مِيزَان', options: ['مِي', 'مَا', 'مُو'], correct: 'مِي' }
                    ]
                },
                {
                    num: 'السؤال الثاني',
                    title: 'التَّحْلِيلُ الصَّوْتِيُّ (الْفُونِيمِيُّ):',
                    rule: 'حَلِّلِ الْكَلِمَاتِ التَّالِيَةَ إِلَى مَقَاطِعِهَا الصَّوْتِيَّةِ فِي الْمُرَبَّعَاتِ الْمُخَصَّصَةِ:',
                    grade: '20 درجة',
                    items: [
                        { word: 'دَادَا', boxes: ['دَا', 'دَا'] },
                        { word: 'دُور', boxes: ['دُو', 'ر'] },
                        { word: 'بُوق', boxes: ['بُو', 'ق'] },
                        { word: 'رَبَاب', boxes: ['رَ', 'بَا', 'ب'] }
                    ]
                },
                {
                    num: 'السؤال الثالث',
                    title: 'التَّرْكِيبُ الصَّوْتِيُّ لِكَلِمَاتِ الْمَنْهَجِ:',
                    rule: 'رَكِّبْ مِنَ الْمَقَاطِعِ الْآتِيَةِ كَلِمَاتٍ تَامَّةَ الْمَعْنَى وَاكْتُبْهَا مَضْبُوطَةً بِالشَّكْلِ:',
                    grade: '20 درجة',
                    items: [
                        { parts: ['بَا', 'ن'], result: 'بَان' },
                        { parts: ['نَ', 'مِير'], result: 'نَمِير' },
                        { parts: ['مَا', 'مَا'], result: 'مَامَا' },
                        { parts: ['نَبْ', 'نِي'], result: 'نَبْنِي' }
                    ]
                },
                {
                    num: 'السؤال الرابع',
                    title: 'الْمُطَابَقَةُ وَالْفَهْمُ الْقِرَائِيُّ:',
                    rule: 'صِلْ بَيْنَ الْكَلِمَةِ فِي الْعَمُودِ (أ) وَمَا يُطَابِقُهَا فِي الْعَمُودِ (ب):',
                    grade: '20 درجة',
                    colA: ['بَقَرُ', 'وَزٌّ', 'مِيزَانُ', 'بُوقُ'],
                    colB: ['قَدُّورِي', 'بَدْرَانَ', 'نَدِيمٍ', 'سَابِحٌ فِي الشَّطِّ'],
                    matches: [
                        { a: 'بَقَرُ', b: 'بَدْرَانَ' },
                        { a: 'وَزٌّ', b: 'سَابِحٌ فِي الشَّطِّ' },
                        { a: 'مِيزَانُ', b: 'قَدُّورِي' },
                        { a: 'بُوقُ', b: 'نَدِيمٍ' }
                    ]
                },
                {
                    num: 'السؤال الخامس',
                    title: 'الْخَطُّ الْعَرَبِيُّ وَرَسْمُ الْحُرُوفِ:',
                    rule: 'أَعِدْ كِتَابَةَ الْجُمْلَةِ الْآتِيَةِ بِخَطِّ النَّسْخِ الْجَمِيلِ مَرَّتَيْنِ عَلَى السَّطْرِ:',
                    grade: '20 درجة',
                    sampleSentence: 'دَارُ نُورِي بَابُ دَارِنَا كَبِيرٌ',
                    instruction: 'يُرَاعَى اسْتِقَامَةُ السَّطْرِ وَوُضُوحُ الْحَرَكَاتِ وَحُسْنُ التَّنْسِيقِ.'
                }
            ]
        },
        B: {
            code: 'B',
            titleAr: 'النموذج (ب)',
            badgeColor: '#0284c7',
            serial: 'EXAM-2026-M2-B',
            questions: [
                {
                    num: 'السؤال الأول',
                    title: 'تمييز الأصوات وحروف المد والحركات:',
                    rule: 'حَوِّطْ (ضَعْ دَائِرَةً حَوْلَ) الْحَرْفَ أَوِ الْمَقْطَعَ الصَّحِيحَ لِكُلِّ كَلِمَةٍ مِمَّا يَأْتِي:',
                    grade: '20 درجة',
                    items: [
                        { word: 'دُور', options: ['دُو', 'دَ', 'دِي'], correct: 'دُو' },
                        { word: 'مَامَا', options: ['مَا', 'مُو', 'مِي'], correct: 'مَا' },
                        { word: 'رَبَاب', options: ['رَ', 'رُو', 'رِي'], correct: 'رَ' },
                        { word: 'نَبْنِي', options: ['نِي', 'نَا', 'نُو'], correct: 'نِي' }
                    ]
                },
                {
                    num: 'السؤال الثاني',
                    title: 'التَّحْلِيلُ الصَّوْتِيُّ (الْفُونِيمِيُّ):',
                    rule: 'حَلِّلِ الْكَلِمَاتِ التَّالِيَةَ إِلَى مَقَاطِعِهَا الصَّوْتِيَّةِ فِي الْمُرَبَّعَاتِ الْمُخَصَّصَةِ:',
                    grade: '20 درجة',
                    items: [
                        { word: 'مَامَا', boxes: ['مَا', 'مَا'] },
                        { word: 'دَار', boxes: ['دَا', 'ر'] },
                        { word: 'نُورِي', boxes: ['نُو', 'رِي'] },
                        { word: 'مِيزَان', boxes: ['مِي', 'زَا', 'ن'] }
                    ]
                },
                {
                    num: 'السؤال الثالث',
                    title: 'التَّرْكِيبُ الصَّوْتِيُّ لِكَلِمَاتِ الْمَنْهَجِ:',
                    rule: 'رَكِّبْ مِنَ الْمَقَاطِعِ الْآتِيَةِ كَلِمَاتٍ تَامَّةَ الْمَعْنَى وَاكْتُبْهَا مَضْبُوطَةً بِالشَّكْلِ:',
                    grade: '20 درجة',
                    items: [
                        { parts: ['دُو', 'ر'], result: 'دُور' },
                        { parts: ['بُو', 'ق'], result: 'بُوق' },
                        { parts: ['دَا', 'دَا'], result: 'دَادَا' },
                        { parts: ['رَ', 'بَاب'], result: 'رَبَاب' }
                    ]
                },
                {
                    num: 'السؤال الرابع',
                    title: 'الْمُطَابَقَةُ وَالْفَهْمُ الْقِرَائِيُّ:',
                    rule: 'صِلْ بَيْنَ الْكَلِمَةِ فِي الْعَمُودِ (أ) وَمَا يُطَابِقُهَا فِي الْعَمُودِ (ب):',
                    grade: '20 درجة',
                    colA: ['دَارُ', 'مَامَا', 'نَمِيرٌ', 'دَادَا'],
                    colB: ['نَامَ بَعْدَ اللَّعِبِ', 'نُورِي قَرِيبٌ', 'حَبِيبَةُ قَلْبِي', 'رَبَابُ تَبْتَسِمُ'],
                    matches: [
                        { a: 'دَارُ', b: 'نُورِي قَرِيبٌ' },
                        { a: 'مَامَا', b: 'حَبِيبَةُ قَلْبِي' },
                        { a: 'نَمِيرٌ', b: 'نَامَ بَعْدَ اللَّعِبِ' },
                        { a: 'دَادَا', b: 'رَبَابُ تَبْتَسِمُ' }
                    ]
                },
                {
                    num: 'السؤال الخامس',
                    title: 'الْخَطُّ الْعَرَبِيُّ وَرَسْمُ الْحُرُوفِ:',
                    rule: 'أَعِدْ كِتَابَةَ الْجُمْلَةِ الْآتِيَةِ بِخَطِّ النَّسْخِ الْجَمِيلِ مَرَّتَيْنِ عَلَى السَّطْرِ:',
                    grade: '20 درجة',
                    sampleSentence: 'مَامَا مَامَا دَادَا نَامَ نُورِي نَامَ',
                    instruction: 'يُرَاعَى اسْتِقَامَةُ السَّطْرِ وَوُضُوحُ الْحَرَكَاتِ وَحُسْنُ التَّنْسِيقِ.'
                }
            ]
        },
        C: {
            code: 'C',
            titleAr: 'النموذج (ج)',
            badgeColor: '#9333ea',
            serial: 'EXAM-2026-M3-C',
            questions: [
                {
                    num: 'السؤال الأول',
                    title: 'تمييز الأصوات وحروف المد والحركات:',
                    rule: 'حَوِّطْ (ضَعْ دَائِرَةً حَوْلَ) الْحَرْفَ أَوِ الْمَقْطَعَ الصَّحِيحَ لِكُلِّ كَلِمَةٍ مِمَّا يَأْتِي:',
                    grade: '20 درجة',
                    items: [
                        { word: 'بَان', options: ['بَا', 'بُو', 'بِي'], correct: 'بَا' },
                        { word: 'بُوق', options: ['بُو', 'بَا', 'بِي'], correct: 'بُو' },
                        { word: 'فَارُوق', options: ['فَا', 'فُو', 'فِي'], correct: 'فَا' },
                        { word: 'رِيف', options: ['رِي', 'رَا', 'رُو'], correct: 'رِي' }
                    ]
                },
                {
                    num: 'السؤال الثاني',
                    title: 'التَّحْلِيلُ الصَّوْتِيُّ (الْفُونِيمِيُّ):',
                    rule: 'حَلِّلِ الْكَلِمَاتِ التَّالِيَةَ إِلَى مَقَاطِعِهَا الصَّوْتِيَّةِ فِي الْمُرَبَّعَاتِ الْمُخَصَّصَةِ:',
                    grade: '20 درجة',
                    items: [
                        { word: 'نَبْنِي', boxes: ['نَبْ', 'نِي'] },
                        { word: 'بَان', boxes: ['بَا', 'ن'] },
                        { word: 'فَارُوق', boxes: ['فَا', 'رُو', 'ق'] },
                        { word: 'سَالِم', boxes: ['سَا', 'لِـ', 'م'] }
                    ]
                },
                {
                    num: 'السؤال الثالث',
                    title: 'التَّرْكِيبُ الصَّوْتِيُّ لِكَلِمَاتِ الْمَنْهَجِ:',
                    rule: 'رَكِّبْ مِنَ الْمَقَاطِعِ الْآتِيَةِ كَلِمَاتٍ تَامَّةَ الْمَعْنَى وَاكْتُبْهَا مَضْبُوطَةً بِالشَّكْلِ:',
                    grade: '20 درجة',
                    items: [
                        { parts: ['نُو', 'رِي'], result: 'نُورِي' },
                        { parts: ['مِي', 'زَان'], result: 'مِيزَان' },
                        { parts: ['دَا', 'ر'], result: 'دَار' },
                        { parts: ['رِي', 'ف'], result: 'رِيف' }
                    ]
                },
                {
                    num: 'السؤال الرابع',
                    title: 'الْمُطَابَقَةُ وَالْفَهْمُ الْقِرَائِيُّ:',
                    rule: 'صِلْ بَيْنَ الْكَلِمَةِ فِي الْعَمُودِ (أ) وَمَا يُطَابِقُهَا فِي الْعَمُودِ (ب):',
                    grade: '20 درجة',
                    colA: ['رِيفُ', 'سَالِمٌ', 'مِيَاهُ', 'طَيَّارَةُ'],
                    colB: ['مَنَافٍ فِيهِ بَقَرٌ', 'زَرَّاعٌ يَبْذُرُ الْقَمْحَ', 'الْمَطَرِ تَسْقِي الزَّرْعَ', 'وَقَّاصٍ تَرْتَفِعُ فِي الْجَوِّ'],
                    matches: [
                        { a: 'رِيفُ', b: 'مَنَافٍ فِيهِ بَقَرٌ' },
                        { a: 'سَالِمٌ', b: 'زَرَّاعٌ يَبْذُرُ الْقَمْحَ' },
                        { a: 'مِيَاهُ', b: 'الْمَطَرِ تَسْقِي الزَّرْعَ' },
                        { a: 'طَيَّارَةُ', b: 'وَقَّاصٍ تَرْتَفِعُ فِي الْجَوِّ' }
                    ]
                },
                {
                    num: 'السؤال الخامس',
                    title: 'الْخَطُّ الْعَرَبِيُّ وَرَسْمُ الْحُرُوفِ:',
                    rule: 'أَعِدْ كِتَابَةَ الْجُمْلَةِ الْآتِيَةِ بِخَطِّ النَّسْخِ الْجَمِيلِ مَرَّتَيْنِ عَلَى السَّطْرِ:',
                    grade: '20 درجة',
                    sampleSentence: 'نَبْنِي دَارَنَا وَنَبْنِي دَارَ دَادَا رَبَابَ',
                    instruction: 'يُرَاعَى اسْتِقَامَةُ السَّطْرِ وَوُضُوحُ الْحَرَكَاتِ وَحُسْنُ التَّنْسِيقِ.'
                }
            ]
        }
    };

    // ==========================================================================
    // 3. حالة النظام وإدارة الذاكرة المؤقتة (System State)
    // ==========================================================================
    let currentDiagTestKey = 'baseline';
    let currentDiagQIndex = 0;
    let diagUserAnswers = [];
    let diagSelectedStudentId = null;

    let activeExamModel = 'A'; // 'A' | 'B' | 'C' | 'ALL'
    let examSchoolName = 'مَدْرَسَةُ الْعِرَاقِ الِابْتِدَائِيَّةِ';
    let examTeacherName = 'مُعَلِّمُ / مُعَلِّمَةُ الصَّفِّ الأَوَّلِ';
    let examYear = '2026 / 2027 م';
    let examTerm = 'امْتِحَانُ نِصْفِ السَّنَةِ (الدَّوْرُ الأَوَّلُ)';
    let examTotalMarks = '100';

    // تحميل الإعدادات المحفوظة
    function loadSavedExamSettings() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY_EXAM_SETTINGS);
            if (raw) {
                const s = JSON.parse(raw);
                if (s.school) examSchoolName = s.school;
                if (s.teacher) examTeacherName = s.teacher;
                if (s.year) examYear = s.year;
                if (s.term) examTerm = s.term;
                if (s.marks) examTotalMarks = s.marks;
            }
        } catch (e) {
            console.warn("تعذر قراءة إعدادات الامتحانات:", e);
        }
    }

    function saveExamSettings() {
        try {
            const s = {
                school: examSchoolName,
                teacher: examTeacherName,
                year: examYear,
                term: examTerm,
                marks: examTotalMarks
            };
            localStorage.setItem(STORAGE_KEY_EXAM_SETTINGS, JSON.stringify(s));
        } catch (e) {
            console.warn("تعذر حفظ إعدادات الامتحانات:", e);
        }
    }

    // ==========================================================================
    // 4. منطق الاختبار التشخيصي التفاعلي (Interactive Diagnostic Logic)
    // ==========================================================================
    function initDiagnosticTestUI() {
        const testSelect = document.getElementById('diagTestSelector');
        if (testSelect) {
            testSelect.innerHTML = Object.keys(DIAGNOSTIC_TESTS).map(k => `
                <option value="${k}" ${k === currentDiagTestKey ? 'selected' : ''}>${DIAGNOSTIC_TESTS[k].title}</option>
            `).join('');

            testSelect.onchange = function () {
                currentDiagTestKey = this.value;
                startDiagnosticTest();
            };
        }

        // ملء قائمة التلاميذ من المعلم إن وجدت
        populateStudentSelect();

        startDiagnosticTest();
    }

    function populateStudentSelect() {
        const sel = document.getElementById('diagStudentSelector');
        if (!sel) return;

        let students = [];
        try {
            const raw = localStorage.getItem('qiraati-smart-teacher-students');
            if (raw) students = JSON.parse(raw);
        } catch (e) { }

        const esc = window.qiraatiEscapeHtml || (v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])));
        let opts = `<option value="">-- تلميذ افتراضي / زائر --</option>`;
        if (Array.isArray(students) && students.length > 0) {
            opts += students.map(s => `<option value="${esc(s.id)}">${esc(s.name)} (${s.gender === 'female' ? 'طالبة' : 'طالب'})</option>`).join('');
        }
        sel.innerHTML = opts;

        sel.onchange = function () {
            diagSelectedStudentId = this.value || null;
        };
    }

    function startDiagnosticTest() {
        currentDiagQIndex = 0;
        diagUserAnswers = [];
        renderDiagnosticQuestion();
    }

    function renderDiagnosticQuestion() {
        const test = DIAGNOSTIC_TESTS[currentDiagTestKey];
        const container = document.getElementById('diagMainContentArea');
        if (!container || !test) return;

        const totalQ = test.questions.length;
        if (currentDiagQIndex >= totalQ) {
            renderDiagnosticResultReport();
            return;
        }

        const q = test.questions[currentDiagQIndex];
        const pct = Math.round((currentDiagQIndex / totalQ) * 100);

        container.innerHTML = `
            <div class="diag-quiz-progress-bar-container">
                <div class="diag-quiz-progress-bar" style="width: ${pct}%;"></div>
            </div>

            <div class="diag-quiz-header-status">
                <span class="diag-domain-pill">📌 المجال: ${q.domainName}</span>
                <span style="font-weight: 800; color: #0284c7;">السؤال ${currentDiagQIndex + 1} من ${totalQ}</span>
            </div>

            <div class="diag-prompt-box">
                ${q.audioKey ? `
                    <button class="diag-prompt-audio-btn" onclick="DiagnosticExams.playPromptAudio('${q.audioKey}')" title="استمع لنطق السؤال">
                        🔊
                    </button>
                ` : ''}
                <h3 class="diag-prompt-title">${q.prompt}</h3>
                ${q.image ? `<img src="${q.image}" class="diag-option-img" style="margin: 12px auto; display: block; border-radius: 8px;" alt="صورة توضيحية">` : ''}
                <p class="diag-prompt-desc">اختر الإجابة الصحيحة لتحديد المستوى الفونيمي بدقة</p>
            </div>

            <div class="diag-options-grid">
                ${q.options.map((opt, idx) => `
                    <button class="diag-option-card" onclick="DiagnosticExams.handleAnswerOption(${idx})">
                        <span class="diag-option-text">${opt.text}</span>
                    </button>
                `).join('')}
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto;">
                <span style="font-size: 0.85rem; color: #64748b;">🎯 اختبار تشخيصي مؤتمت وفق كتاب قراءتي</span>
                ${currentDiagQIndex > 0 ? `
                    <button class="btn btn-secondary" onclick="DiagnosticExams.prevQuestion()" style="padding: 6px 14px; font-size: 0.85rem;">
                        <span>السابق</span>
                    </button>
                ` : '<span></span>'}
            </div>
        `;
    }

    function handleAnswerOption(idx) {
        const test = DIAGNOSTIC_TESTS[currentDiagTestKey];
        const q = test.questions[currentDiagQIndex];
        const selected = q.options[idx];

        diagUserAnswers.push({
            qId: q.id,
            domain: q.domain,
            domainName: q.domainName,
            isCorrect: !!selected.isCorrect,
            selectedText: selected.text
        });

        // تشغيل صوت التغذية الراجعة إن توفر
        if (selected.isCorrect) {
            playAudioFeedback(true);
        } else {
            playAudioFeedback(false);
        }

        currentDiagQIndex++;
        setTimeout(() => {
            renderDiagnosticQuestion();
        }, 350);
    }

    function playAudioFeedback(isCorrect) {
        try {
            if (window.AUDIO_DATA) {
                const key = isCorrect ? 'sfx_correct' : 'sfx_incorrect';
                if (window.playAudioKey) window.playAudioKey(key);
            }
        } catch (e) { }
    }

    function renderDiagnosticResultReport() {
        const test = DIAGNOSTIC_TESTS[currentDiagTestKey];
        const container = document.getElementById('diagMainContentArea');
        if (!container || !test) return;

        const totalQ = test.questions.length;
        const correctCount = diagUserAnswers.filter(a => a.isCorrect).length;
        const percentage = Math.round((correctCount / totalQ) * 100);

        // تحليل المهارات بحسب المجالات الخمسة
        const domainStats = {};
        diagUserAnswers.forEach(ans => {
            if (!domainStats[ans.domain]) {
                domainStats[ans.domain] = { name: ans.domainName, total: 0, correct: 0 };
            }
            domainStats[ans.domain].total++;
            if (ans.isCorrect) domainStats[ans.domain].correct++;
        });

        // تحديد المستوى التشخيصي
        let levelLabel = 'مُتْقِنٌ لِلْمَهَارَاتِ (مُمْتَاز)';
        let levelColor = '#16a34a';
        let levelDesc = 'يمتلك التلميذ أساساً فونيمياً ممتازاً، وهو جاهز للمرحلة القرائية التالية بكل ثقة.';
        if (percentage < 60) {
            levelLabel = 'بِحَاجَةٍ إِلَى دَعْمٍ وَمُعَالَجَةٍ مُكَثَّفَةٍ';
            levelColor = '#dc2626';
            levelDesc = 'يظهر التلميذ فجوة في الوعي الصوتي أو التمييز البصري للحروف والمدود، يُنصح بتطبيق خطة الدعم الفردية فوراً.';
        } else if (percentage < 85) {
            levelLabel = 'مُتَوَسِّطٌ (قَرِيبٌ مِنَ الإِتْقَانِ)';
            levelColor = '#ea580c';
            levelDesc = 'مستوى جيد مع وجود بعض التردد في المقاطع الطويلة أو التحليل الصوتي، يحتاج تدريبات إثرائية وتعزيزية.';
        }

        // خطة المعالجة المقترحة تلقائياً
        const recommendations = [];
        Object.keys(domainStats).forEach(dom => {
            const stat = domainStats[dom];
            const p = Math.round((stat.correct / stat.total) * 100);
            if (p < 100) {
                if (dom === 'phonemic_awareness') {
                    recommendations.push('مراجعة أنشطة التمييز السمعي للأصوات الأولى والأخيرة في دروس التهيئة (ص 7 - ص 11).');
                } else if (dom === 'letter_knowledge') {
                    recommendations.push('التدرب على لوحة تتبع الحروف وأشكال الحرف (أول، وسط، آخر) عبر سبورة الحروف والخط.');
                } else if (dom === 'vowels_and_lengths') {
                    recommendations.push('التركيز على ورشات دمج الحركات القصيرة وحروف المد (الألف، الواو، الياء) في دروس دادا ودور ونوري.');
                } else if (dom === 'segmentation_blending') {
                    recommendations.push('استخدام بطاقات المقاطع وتطبيق لعبة قطار المقاطع والتحليل الصوتي في بنك الألعاب.');
                } else if (dom === 'comprehension_matching') {
                    recommendations.push('الربط بين قراءة الكلمة والصورة المقترنة بها في بنك بطاقات القراءة المصورة.');
                }
            }
        });

        if (recommendations.length === 0) {
            recommendations.push('مواصلة القراءة الإثرائية الحرة وخوض تحدي النجوم ومسابقات التابلت الصفية للحفاظ على الطلاقة الفائقة.');
        }

        // تخزين النتيجة محلياً
        saveDiagnosticRecord({
            studentId: diagSelectedStudentId,
            testKey: currentDiagTestKey,
            testTitle: test.title,
            score: correctCount,
            total: totalQ,
            percentage: percentage,
            level: levelLabel,
            date: new Date().toLocaleDateString('ar-IQ'),
            domainStats: domainStats
        });

        container.innerHTML = `
            <div class="diag-report-container">
                <div class="diag-profile-header">
                    <div class="diag-gauge-box">
                        <div class="diag-score-circle" style="background: linear-gradient(135deg, ${levelColor} 0%, #0f172a 100%);">
                            <span class="diag-score-num">${percentage}%</span>
                            <span class="diag-score-pct">${correctCount} من ${totalQ}</span>
                        </div>
                        <div>
                            <h3 style="margin: 0 0 6px 0; font-size: 1.25rem; color: #0f172a;">${test.title}</h3>
                            <div style="display: inline-block; background: ${levelColor}15; color: ${levelColor}; border: 1.5px solid ${levelColor}50; padding: 4px 12px; border-radius: 8px; font-weight: 800; font-size: 0.9rem;">
                                ${levelLabel}
                            </div>
                        </div>
                    </div>

                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                        <button class="btn btn-primary" onclick="DiagnosticExams.startDiagnosticTest()" style="padding: 8px 16px; font-size: 0.88rem;">
                            <span>🔄</span> <span>إعادة الاختبار</span>
                        </button>
                        <button class="btn btn-step" onclick="DiagnosticExams.linkToTeacherDashboard()" style="padding: 8px 16px; font-size: 0.88rem; background: #0284c7; color: white;">
                            <span>🧑‍🏫</span> <span>حفظ بسجل المعلم</span>
                        </button>
                    </div>
                </div>

                <p style="font-size: 0.92rem; color: #475569; line-height: 1.7; margin-bottom: 20px;">
                    ${levelDesc}
                </p>

                <h4 style="margin: 0 0 10px 0; font-size: 1rem; color: #1e293b; font-weight: 900;">
                    📊 تفصيل الإتقان حسب المجالات الفونيمية الخمسة:
                </h4>

                <div class="diag-skills-breakdown">
                    ${Object.keys(domainStats).map(dom => {
            const st = domainStats[dom];
            const p = Math.round((st.correct / st.total) * 100);
            const bColor = p >= 80 ? '#16a34a' : (p >= 50 ? '#ea580c' : '#dc2626');
            return `
                            <div class="diag-skill-item">
                                <div class="diag-skill-top">
                                    <span>${st.name}</span>
                                    <span style="color: ${bColor};">${st.correct}/${st.total} (${p}%)</span>
                                </div>
                                <div class="diag-skill-bar-track">
                                    <div class="diag-skill-bar-fill" style="width: ${p}%; background: ${bColor};"></div>
                                </div>
                            </div>
                        `;
        }).join('')}
                </div>

                <div class="diag-remedial-plan-box">
                    <h4 class="diag-remedial-title">
                        <span>💡</span>
                        <span>خطة المعالجة الفردية والتوصيات التربوية المقترحة:</span>
                    </h4>
                    <ul class="diag-remedial-list">
                        ${recommendations.map(r => `<li>${r}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    function saveDiagnosticRecord(rec) {
        try {
            let list = [];
            const raw = localStorage.getItem(STORAGE_KEY_DIAG_RECORDS);
            if (raw) list = JSON.parse(raw);
            list.unshift(rec);
            if (list.length > 50) list = list.slice(0, 50); // الاحتفاظ بأحدث 50 سجلاً
            localStorage.setItem(STORAGE_KEY_DIAG_RECORDS, JSON.stringify(list));
            renderDiagnosticRecordsTab();
        } catch (e) {
            console.warn("تعذر حفظ سجل التشخيص:", e);
        }
    }

    // ==========================================================================
    // 5. محرك توليد الامتحانات الوزارية الورقية A4 (A4 Paper Exam Generator)
    // ==========================================================================
    function renderPaperExams() {
        const previewArea = document.getElementById('examPaperPreviewArea');
        if (!previewArea) return;

        let modelsToRender = [];
        if (activeExamModel === 'ALL') {
            modelsToRender = ['A', 'B', 'C'];
        } else {
            modelsToRender = [activeExamModel];
        }

        previewArea.innerHTML = modelsToRender.map(mKey => {
            const m = PAPER_EXAM_MODELS[mKey];
            return generateSingleA4ExamHTML(m);
        }).join('');
    }

    function generateSingleA4ExamHTML(model) {
        const q1 = model.questions[0];
        const q2 = model.questions[1];
        const q3 = model.questions[2];
        const q4 = model.questions[3];
        const q5 = model.questions[4];

        return `
            <div class="exam-paper-a4 printable-exam-zone" id="examPaper_${model.code}">
                <div class="exam-border-frame">
                    <div class="exam-border-inner">

                        <!-- ترويسة الامتحان الرسمية -->
                        <div class="exam-header-grid">
                            <div class="exam-header-col-r">
                                <div>جُمْهُورِيَّةُ الْعِرَاقِ</div>
                                <div>وِزَارَةُ التَّرْبِيَةِ</div>
                                <div>${examSchoolName}</div>
                                <div>الْمَادَّةُ: قِرَاءَتِي (اللُّغَةُ الْعَرَبِيَّةُ)</div>
                            </div>

                            <div class="exam-header-col-c">
                                <h2 class="exam-main-title">${examTerm}</h2>
                                <div class="exam-sub-title">امْتِحَانُ الصَّفِّ الأَوَّلِ الِابْتِدَائِيِّ • الْعَامُ الدِّرَاسِيُّ ${examYear}</div>
                                <div style="font-size: 0.8rem; font-weight: 800; margin-top: 4px; color: #1e293b;">
                                    الزَّمَنُ: سَاعَةٌ وَنِصْفٌ • الدَّرَجَةُ الْكُلِّيَّةُ: (${examTotalMarks}) دَرَجَةً
                                </div>
                            </div>

                            <div class="exam-header-col-l">
                                <div class="exam-model-seal" style="border-color: ${model.badgeColor}; color: ${model.badgeColor};">
                                    ${model.titleAr}
                                </div>
                                <div class="exam-qr-code-placeholder">
                                    <span>كُود: ${model.serial}</span>
                                </div>
                            </div>
                        </div>

                        <!-- جدول بيانات التلميذ وسجل الدرجات الرسمي -->
                        <div class="exam-meta-box">
                            <div class="exam-student-fields">
                                <div>اسْمُ التِّلْمِيذِ / التِّلْمِيذَةِ: <span class="exam-dots" style="min-width: 220px;"></span></div>
                                <div style="display: flex; gap: 20px;">
                                    <span>الصَّفُّ وَالشُّعْبَةُ: <span class="exam-dots" style="min-width: 70px;"></span></span>
                                    <span>الرَّقْمُ الامْتِحَانِيُّ: <span class="exam-dots" style="min-width: 80px;"></span></span>
                                </div>
                            </div>

                            <div>
                                <table class="exam-score-table">
                                    <thead>
                                        <tr>
                                            <th>س1</th>
                                            <th>س2</th>
                                            <th>س3</th>
                                            <th>س4</th>
                                            <th>س5</th>
                                            <th>الْمَجْمُوعُ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style="height: 18px;"></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td style="font-weight: 900;"></td>
                                        </tr>
                                        <tr>
                                            <td colspan="6" style="text-align: right; padding: 2px 4px; font-size: 0.7rem;">
                                                تَوْقِيعُ الْمُصَحِّحِ: ................... تَوْقِيعُ الْمُدَقِّقِ: ...................
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- قائمة الأسئلة الخمسة المنهجية -->
                        <div class="exam-questions-list">

                            <!-- س1: تمييز الحركات وحروف المد -->
                            <div class="exam-q-row">
                                <div class="exam-q-header">
                                    <span><b>${q1.num}:</b> ${q1.title}</span>
                                    <span class="exam-q-grade-badge">(${q1.grade})</span>
                                </div>
                                <div class="exam-q-body">
                                    <div style="margin-bottom: 6px;">${q1.rule}</div>
                                    <div class="exam-items-flex">
                                        ${q1.items.map(it => `
                                            <div class="exam-word-circle-box">
                                                <span style="font-size: 1.15rem; font-weight: 900;">${it.word} :</span>
                                                <div style="display: flex; gap: 8px;">
                                                    ${it.options.map(opt => `
                                                        <span style="display: inline-flex; align-items: center; gap: 3px;">
                                                            <span class="exam-choice-bubble"></span>
                                                            <span style="font-size: 1rem;">[ ${opt} ]</span>
                                                        </span>
                                                    `).join('')}
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>

                            <!-- س2: التحليل الفونيمي -->
                            <div class="exam-q-row">
                                <div class="exam-q-header">
                                    <span><b>${q2.num}:</b> ${q2.title}</span>
                                    <span class="exam-q-grade-badge">(${q2.grade})</span>
                                </div>
                                <div class="exam-q-body">
                                    <div style="margin-bottom: 6px;">${q2.rule}</div>
                                    <div class="exam-items-flex">
                                        ${q2.items.map(it => `
                                            <div class="exam-seg-item">
                                                <span class="exam-seg-word">${it.word} ➔</span>
                                                <div style="display: flex; gap: 4px;">
                                                    ${it.boxes.map(() => `<span class="exam-seg-box"></span>`).join('')}
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>

                            <!-- س3: التركيب الصوتي -->
                            <div class="exam-q-row">
                                <div class="exam-q-header">
                                    <span><b>${q3.num}:</b> ${q3.title}</span>
                                    <span class="exam-q-grade-badge">(${q3.grade})</span>
                                </div>
                                <div class="exam-q-body">
                                    <div style="margin-bottom: 6px;">${q3.rule}</div>
                                    <div class="exam-items-flex">
                                        ${q3.items.map(it => `
                                            <div class="exam-blend-item">
                                                <span>${it.parts.map(p => `[ ${p} ]`).join(' + ')} =</span>
                                                <span class="exam-blend-answer-line"></span>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>

                            <!-- س4: المطابقة والفهم القرائي -->
                            <div class="exam-q-row">
                                <div class="exam-q-header">
                                    <span><b>${q4.num}:</b> ${q4.title}</span>
                                    <span class="exam-q-grade-badge">(${q4.grade})</span>
                                </div>
                                <div class="exam-q-body">
                                    <div style="margin-bottom: 6px;">${q4.rule}</div>
                                    <div class="exam-match-grid">
                                        <div class="exam-match-col">
                                            <div style="font-weight: 900; margin-bottom: 4px; color: #0284c7;">الْعَمُودُ (أ)</div>
                                            ${q4.colA.map((item, idx) => `
                                                <div class="exam-match-card">
                                                    <span>${idx + 1}. ${item}</span>
                                                    <span class="exam-match-anchor"></span>
                                                </div>
                                            `).join('')}
                                        </div>
                                        <div class="exam-match-col">
                                            <div style="font-weight: 900; margin-bottom: 4px; color: #16a34a;">الْعَمُودُ (ب)</div>
                                            ${q4.colB.map((item, idx) => `
                                                <div class="exam-match-card">
                                                    <span class="exam-match-anchor"></span>
                                                    <span>( ) ${item}</span>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- س5: الخط ورسم الحروف -->
                            <div class="exam-q-row">
                                <div class="exam-q-header">
                                    <span><b>${q5.num}:</b> ${q5.title}</span>
                                    <span class="exam-q-grade-badge">(${q5.grade})</span>
                                </div>
                                <div class="exam-q-body">
                                    <div style="margin-bottom: 4px;">${q5.rule}</div>
                                    <div class="exam-handwriting-sample">« ${q5.sampleSentence} »</div>
                                    <div class="exam-handwriting-rule-lines"></div>
                                    <div class="exam-handwriting-rule-lines"></div>
                                </div>
                            </div>

                        </div>

                        <!-- التذييل الرسمي وضمان الجودة -->
                        <div class="exam-footer-sign-off">
                            <span>مَعَ تَمَنِّيَاتِنَا لِأَبْنَائِنَا التَّلَامِيذِ بِالنَّجَاحِ وَالتَّفَوُّقِ الدَّائِمِ</span>
                            <span>إِعْدَادُ وَتَطْوِيرُ: الْمُهَنْدِسُ أُسَامَةُ خَلِيل هَاشِم</span>
                        </div>

                    </div>
                </div>
            </div>
        `;
    }

    // ==========================================================================
    // 6. مفاتيح التصحيح وشيت المعلم المدمج (Master Answer Keys & Stencils)
    // ==========================================================================
    function renderMasterAnswerKeys() {
        const container = document.getElementById('diagMasterKeysContent');
        if (!container) return;

        const mA = PAPER_EXAM_MODELS.A;
        const mB = PAPER_EXAM_MODELS.B;
        const mC = PAPER_EXAM_MODELS.C;

        container.innerHTML = `
            <div class="diag-keys-card printable-stencil-zone">
                <div style="text-align: center; border-bottom: 2px solid #cbd5e1; padding-bottom: 12px; margin-bottom: 16px;">
                    <div style="font-size: 0.85rem; font-weight: 800; color: #64748b;">
                        جُمْهُورِيَّةُ الْعِرَاقِ • وِزَارَةُ التَّرْبِيَةِ • مَنَصَّةُ قِرَاءَتِي الذَّكِيَّةِ
                    </div>
                    <h3 style="margin: 6px 0; font-size: 1.35rem; color: #0f172a;">
                        مَفَاتِيحُ التَّصْحِيحِ السَّرِيعِ وَشِيتُ التَّقْيِيمِ الْمُؤْتَمَتِ (A4)
                    </h3>
                    <div style="font-size: 0.85rem; font-weight: 800; color: #0284c7;">
                        النماذج الثلاثة المتطابقة (A / B / C) جنباً إلى جنب لتصحيح فوري خلال دقائق • إعداد المهندس أسامة خليل هاشم
                    </div>
                </div>

                <div class="diag-keys-table-container">
                    <table class="diag-master-stencil-table">
                        <thead>
                            <tr>
                                <th style="width: 14%;">السؤال والمعيار</th>
                                <th class="model-a-col" style="width: 28%;">النموذج (أ) Model A</th>
                                <th class="model-b-col" style="width: 28%;">النموذج (ب) Model B</th>
                                <th class="model-c-col" style="width: 28%;">النموذج (ج) Model C</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- س1 -->
                            <tr>
                                <td><b>س1: تمييز الأصوات والحركات</b><br><span style="font-size: 0.78rem; color: #64748b;">(20 درجة • 5 لكل فرع)</span></td>
                                <td class="model-a-col">
                                    ${mA.questions[0].items.map(it => `<div>• ${it.word} ➔ <span class="diag-ans-badge">${it.correct}</span></div>`).join('')}
                                </td>
                                <td class="model-b-col">
                                    ${mB.questions[0].items.map(it => `<div>• ${it.word} ➔ <span class="diag-ans-badge">${it.correct}</span></div>`).join('')}
                                </td>
                                <td class="model-c-col">
                                    ${mC.questions[0].items.map(it => `<div>• ${it.word} ➔ <span class="diag-ans-badge">${it.correct}</span></div>`).join('')}
                                </td>
                            </tr>

                            <!-- س2 -->
                            <tr>
                                <td><b>س2: التحليل الصوتي</b><br><span style="font-size: 0.78rem; color: #64748b;">(20 درجة • 5 لكل فرع)</span></td>
                                <td class="model-a-col">
                                    ${mA.questions[1].items.map(it => `<div>• ${it.word} ➔ <span class="diag-ans-badge">${it.boxes.map(b => `[${b}]`).join(' + ')}</span></div>`).join('')}
                                </td>
                                <td class="model-b-col">
                                    ${mB.questions[1].items.map(it => `<div>• ${it.word} ➔ <span class="diag-ans-badge">${it.boxes.map(b => `[${b}]`).join(' + ')}</span></div>`).join('')}
                                </td>
                                <td class="model-c-col">
                                    ${mC.questions[1].items.map(it => `<div>• ${it.word} ➔ <span class="diag-ans-badge">${it.boxes.map(b => `[${b}]`).join(' + ')}</span></div>`).join('')}
                                </td>
                            </tr>

                            <!-- س3 -->
                            <tr>
                                <td><b>س3: التركيب الصوتي</b><br><span style="font-size: 0.78rem; color: #64748b;">(20 درجة • 5 لكل فرع)</span></td>
                                <td class="model-a-col">
                                    ${mA.questions[2].items.map(it => `<div>• ${it.parts.join('+')} ➔ <span class="diag-ans-badge">${it.result}</span></div>`).join('')}
                                </td>
                                <td class="model-b-col">
                                    ${mB.questions[2].items.map(it => `<div>• ${it.parts.join('+')} ➔ <span class="diag-ans-badge">${it.result}</span></div>`).join('')}
                                </td>
                                <td class="model-c-col">
                                    ${mC.questions[2].items.map(it => `<div>• ${it.parts.join('+')} ➔ <span class="diag-ans-badge">${it.result}</span></div>`).join('')}
                                </td>
                            </tr>

                            <!-- س4 -->
                            <tr>
                                <td><b>س4: المطابقة القرائية</b><br><span style="font-size: 0.78rem; color: #64748b;">(20 درجة • 5 لكل فرع)</span></td>
                                <td class="model-a-col">
                                    ${mA.questions[3].matches.map(m => `<div>• ${m.a} ➔ <span class="diag-ans-badge">${m.b}</span></div>`).join('')}
                                </td>
                                <td class="model-b-col">
                                    ${mB.questions[3].matches.map(m => `<div>• ${m.a} ➔ <span class="diag-ans-badge">${m.b}</span></div>`).join('')}
                                </td>
                                <td class="model-c-col">
                                    ${mC.questions[3].matches.map(m => `<div>• ${m.a} ➔ <span class="diag-ans-badge">${m.b}</span></div>`).join('')}
                                </td>
                            </tr>

                            <!-- س5 -->
                            <tr>
                                <td><b>س5: الخط ورسم الحروف</b><br><span style="font-size: 0.78rem; color: #64748b;">(20 درجة كاملة)</span></td>
                                <td class="model-a-col">
                                    <div>«${mA.questions[4].sampleSentence}»</div>
                                    <div style="font-size: 0.75rem; color: #475569; margin-top: 4px;">معيار: 10 للرسم، 5 للسطر، 5 للحركات.</div>
                                </td>
                                <td class="model-b-col">
                                    <div>«${mB.questions[4].sampleSentence}»</div>
                                    <div style="font-size: 0.75rem; color: #475569; margin-top: 4px;">معيار: 10 للرسم، 5 للسطر، 5 للحركات.</div>
                                </td>
                                <td class="model-c-col">
                                    <div>«${mC.questions[4].sampleSentence}»</div>
                                    <div style="font-size: 0.75rem; color: #475569; margin-top: 4px;">معيار: 10 للرسم، 5 للسطر، 5 للحركات.</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px; padding-top: 14px; border-top: 1px solid #e2e8f0;">
                    <div style="font-size: 0.85rem; color: #64748b;">
                        💡 يُطبع هذا الشيت على صفحة A4 واحدة ليوضع أمام المعلم أثناء تدقيق وتصحيح الدفاتر الامتحانية.
                    </div>
                    <button class="btn btn-primary" onclick="DiagnosticExams.printMasterAnswerKey()" style="padding: 9px 20px; font-weight: 800; font-size: 0.92rem;">
                        <span>🖨️</span> <span>طباعة شيت التصحيح السريع A4</span>
                    </button>
                </div>
            </div>
        `;
    }

    // ==========================================================================
    // 7. سجل التشخيص الصفي (Diagnostic Records & Class Progress)
    // ==========================================================================
    function renderDiagnosticRecordsTab() {
        const container = document.getElementById('diagRecordsListContainer');
        if (!container) return;

        let records = [];
        try {
            const raw = localStorage.getItem(STORAGE_KEY_DIAG_RECORDS);
            if (raw) records = JSON.parse(raw);
        } catch (e) { }

        if (!records || records.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #64748b;">
                    <span style="font-size: 3rem; display: block; margin-bottom: 10px;">📋</span>
                    <h4 style="margin: 0 0 6px 0; color: #1e293b;">لا توجد سجلات تشخيصية محفوظة حتى الآن</h4>
                    <p style="font-size: 0.88rem; margin: 0;">قم بإجراء اختبار تشخيصي في التبويب الأول لحفظ تقارير التلاميذ هنا تلقائياً.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                <span style="font-weight: 800; color: #1e293b; font-size: 0.95rem;">إجمالي الاختبارات المنجزة: ${records.length} اختباراً</span>
                <button class="btn btn-secondary" onclick="DiagnosticExams.clearDiagnosticRecords()" style="padding: 4px 12px; font-size: 0.8rem; color: #dc2626;">
                    مسح السجل المؤقت
                </button>
            </div>

            <div style="display: flex; flex-direction: column; gap: 10px;">
                ${records.map((r, idx) => `
                    <div style="background: white; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 14px 18px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                        <div>
                            <div style="font-weight: 800; color: #0f172a; font-size: 0.95rem;">${idx + 1}. ${r.testTitle}</div>
                            <div style="font-size: 0.8rem; color: #64748b; margin-top: 3px;">
                                التاريخ: ${r.date} • الدرجة: <b style="color: #0284c7;">${r.score} من ${r.total}</b> (${r.percentage}%)
                            </div>
                        </div>

                        <div>
                            <span style="background: ${r.percentage >= 80 ? '#dcfce7' : '#fef2f2'}; color: ${r.percentage >= 80 ? '#166534' : '#991b1b'}; padding: 4px 10px; border-radius: 6px; font-weight: 800; font-size: 0.82rem;">
                                ${r.level}
                            </span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // ==========================================================================
    // 8. واجهة التفاعل العامة وتصدير الدوال (Public API)
    // ==========================================================================
    window.DiagnosticExams = {
        openModal: function (tab) {
            const modal = document.getElementById('diagnosticExamsModal');
            if (modal) {
                modal.style.display = 'flex';
                loadSavedExamSettings();
                this.switchTab(tab || 'generator');
            }
        },

        closeModal: function () {
            const modal = document.getElementById('diagnosticExamsModal');
            if (modal) modal.style.display = 'none';
        },

        switchTab: function (tabName) {
            const tabs = ['test', 'generator', 'keys', 'records'];
            tabs.forEach(t => {
                const btn = document.getElementById(`tabDiag_${t}`);
                const pane = document.getElementById(`paneDiag_${t}`);
                if (btn) btn.classList.toggle('active', t === tabName);
                if (pane) pane.classList.toggle('active', t === tabName);
            });

            if (tabName === 'test') {
                initDiagnosticTestUI();
            } else if (tabName === 'generator') {
                renderPaperExams();
            } else if (tabName === 'keys') {
                renderMasterAnswerKeys();
            } else if (tabName === 'records') {
                renderDiagnosticRecordsTab();
            }
        },

        // التحكم في النماذج
        setModel: function (m) {
            activeExamModel = m;
            document.querySelectorAll('.diag-model-btn').forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-model') === m);
            });
            renderPaperExams();
        },

        // تحديث إعدادات الامتحان
        updateSettings: function () {
            const sSchool = document.getElementById('examInpSchool');
            const sTeacher = document.getElementById('examInpTeacher');
            const sYear = document.getElementById('examInpYear');
            const sTerm = document.getElementById('examInpTerm');
            const sMarks = document.getElementById('examInpMarks');

            if (sSchool) examSchoolName = sSchool.value || examSchoolName;
            if (sTeacher) examTeacherName = sTeacher.value || examTeacherName;
            if (sYear) examYear = sYear.value || examYear;
            if (sTerm) examTerm = sTerm.value || examTerm;
            if (sMarks) examTotalMarks = sMarks.value || examTotalMarks;

            saveExamSettings();
            renderPaperExams();
        },

        // الطباعة المباشرة
        printCurrentExam: function () {
            window.print();
        },

        printMasterAnswerKey: function () {
            this.switchTab('keys');
            setTimeout(() => {
                window.print();
            }, 250);
        },

        // الاختبار التشخيصي
        startDiagnosticTest: startDiagnosticTest,
        handleAnswerOption: handleAnswerOption,
        playPromptAudio: function (key) {
            try {
                if (window.playAudioKey) {
                    window.playAudioKey(key);
                } else if (window.playAudio) {
                    window.playAudio(key);
                }
            } catch (e) {
                console.warn("تعذر تشغيل الصوت:", e);
            }
        },

        prevQuestion: function () {
            if (currentDiagQIndex > 0) {
                currentDiagQIndex--;
                diagUserAnswers.pop();
                renderDiagnosticQuestion();
            }
        },

        linkToTeacherDashboard: function () {
            alert('تم ربط نتيجة الاختبار التشخيصي وحفظها بنجاح داخل سجل تقدم التلميذ في لوحة المعلم!');
            if (window.TeacherDashboard && window.TeacherDashboard.openModal) {
                this.closeModal();
                window.TeacherDashboard.openModal('overview');
            }
        },

        clearDiagnosticRecords: function () {
            if (confirm('هل أنت متأكد من رغبتك في مسح السجلات التشخيصية المؤقتة؟')) {
                localStorage.removeItem(STORAGE_KEY_DIAG_RECORDS);
                renderDiagnosticRecordsTab();
            }
        }
    };

    // دوال مساعدة عامة على نافذة window للربط السريع
    window.openDiagnosticExamsModal = function (tab) {
        window.DiagnosticExams.openModal(tab);
    };

    window.closeDiagnosticExamsModal = function () {
        window.DiagnosticExams.closeModal();
    };

    // تهيئة تلقائية عند اكتمال تحميل الصفحة
    document.addEventListener('DOMContentLoaded', function () {
        loadSavedExamSettings();
    });

})();
