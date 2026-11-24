/* ==========================================================================
 * منصة قراءتي التفاعلية الذكية - استوديو التدريب الصوتي والتعرف على نطق التلميذ أوفلاين
 * (Speech Recognition & Voice Coach Studio - Oral Reading Fluency & Articulation Lab)
 * متوافق 100% مع كتاب قراءتي الجديد ومعايير وزارة التربية العراقية
 * إعداد وتطوير: المهندس أسامة خليل هاشم
 * ========================================================================== */

(function () {
    'use strict';

    // مفاتيح التخزين المعزولة الملتزمة بقواعد أسامة (البادئة qiraati-smart-)
    const STORAGE_KEY_VOICE_RECORDS = 'qiraati-smart-voice-records';
    const STORAGE_KEY_VOICE_SETTINGS = 'qiraati-smart-voice-settings';
    const STORAGE_KEY_FLUENCY_STATS = 'qiraati-smart-fluency-stats';

    // ==========================================================================
    // 1. قاعدة بيانات مخارج الحروف العربية وتشريح الصوت المنهجي
    // ==========================================================================
    const ARTICULATION_DATABASE = {
        'ا': {
            char: 'ا',
            name: 'الألف والهمزة',
            category: 'throat',
            categoryName: 'الجوف وأقصى الحلق',
            makhrajPoint: 'الجوف لمد الألف وأقصى الحلق للهمزة',
            description: 'يخرج مد الألف صافيًا من الجوف مع فتح الفم باعتدال، بينما تخرج الهمزة بنبرة حنجرية واضحة من أقصى الحلق.',
            traits: { voice: 'مجهور', force: 'شديد للهمزة / رخو للمد', tone: 'مرقق' },
            vowels: ['أَ', 'أُ', 'إِ'],
            mad: ['آ', 'بَا', 'دَا'],
            audioKey: 'phoneme_pure_alif',
            modelWord: 'أَسَد',
            confusable: {
                pair: 'أ / ع',
                target: 'أ (أَمِين)',
                confused: 'ع (عَلَم)',
                advice: 'تخرج الهمزة من أقصى الحلق قرب الحنجرة بنبرة واضحة، بينما تخرج العين من وسط الحلق بعمق!'
            }
        },
        'د': {
            char: 'د',
            name: 'الدال',
            category: 'tongue_tip',
            categoryName: 'طرف اللسان والأسنان',
            makhrajPoint: 'طرف اللسان مع أصول الثنايا العليا',
            description: 'يخرج صوت (د) عند ملامسة طرف اللسان لأصول الأسنان العلوية بلطف، وهو صوت شديد مجهور مرقق.',
            traits: { voice: 'مجهور (اهتزاز الحبال)', force: 'شديد (انحباس الصوت)', tone: 'مرقق (لسان مستفل)' },
            vowels: ['دَ', 'دُ', 'دِ'],
            mad: ['دَا', 'دُو', 'دِي'],
            audioKey: 'phoneme_pure_dal',
            modelWord: 'دَار',
            confusable: {
                pair: 'د / ض',
                target: 'د (دَار)',
                confused: 'ض (ضَوْء)',
                advice: 'احذر من تفخيم الدال حتى لا تشبه الضاد. انطق: دَ - دَ - دَار برقة وخفة!'
            }
        },
        'ر': {
            char: 'ر',
            name: 'الراء',
            category: 'tongue_tip',
            categoryName: 'طرف اللسان والأسنان',
            makhrajPoint: 'طرف اللسان مع ما يحاذيه من الحنك الأعلى',
            description: 'يخرج صوت (ر) بارتعاد لطيف لطرف اللسان لمرة واحدة، وهو صوت متوسط بين الشدة والرخاوة.',
            traits: { voice: 'مجهور', force: 'بيني (متوسط)', tone: 'مفخم مع الفتح / مرقق مع الكسر' },
            vowels: ['رَ', 'رُ', 'رِ'],
            mad: ['رَا', 'رُو', 'رِي'],
            audioKey: 'phoneme_pure_raa',
            modelWord: 'رِيم',
            confusable: {
                pair: 'ر / ل',
                target: 'ر (رِيم)',
                confused: 'ل (لَبَن)',
                advice: 'احرص على ارتعاد خفيف لطرف اللسان، ولا تحبس الصوت على جانبي اللسان كاللام!'
            }
        },
        'و': {
            char: 'و',
            name: 'الواو',
            category: 'lips',
            categoryName: 'الشفتان',
            makhrajPoint: 'انضمام الشفتين مع فرجة صغيرة',
            description: 'يخرج صوت (و) بانضمام واستدارة الشفتين إلى الأمام، وهو صوت مجهور رخو لين.',
            traits: { voice: 'مجهور', force: 'رخو (جريان الصوت)', tone: 'مرقق' },
            vowels: ['وَ', 'وُ', 'وِ'],
            mad: ['وَا', 'وُو', 'وِي'],
            audioKey: 'phoneme_pure_waw',
            modelWord: 'وَرْد',
            confusable: {
                pair: 'وَ / فـَ',
                target: 'وَ (وَرْد)',
                confused: 'فَ (فِيل)',
                advice: 'استدر شفتيك كالطوق للأمام عند نطق الواو دون أن تلمس الأسنان الشفة السفلى!'
            }
        },
        'ي': {
            char: 'ي',
            name: 'الياء',
            category: 'tongue_mid',
            categoryName: 'وسط اللسان',
            makhrajPoint: 'وسط اللسان مع ما يحاذيه من الحنك الأعلى',
            description: 'يخرج صوت (ي) بارتفاع وسط اللسان نحو سقف الحلق الرخو مع خفض الفك السفلي قليلاً.',
            traits: { voice: 'مجهور', force: 'رخو', tone: 'مرقق' },
            vowels: ['يَ', 'يُ', 'يِ'],
            mad: ['يَا', 'يُو', 'يِي'],
            audioKey: 'phoneme_pure_yaa',
            modelWord: 'يَد',
            confusable: {
                pair: 'ي / ج',
                target: 'ي (يَد)',
                confused: 'ج (جَمَل)',
                advice: 'دع الصوت يجري بسلاسة دون إلصاق وسط اللسان بسقف الحلق حتى لا ينقلب جيماً!'
            }
        },
        'ب': {
            char: 'ب',
            name: 'الباء',
            category: 'lips',
            categoryName: 'الشفتان',
            makhrajPoint: 'انطباق الشفتين على بعضهما تماماً',
            description: 'يخرج صوت (ب) بانطباق الشفة العليا على الشفة السفلى بقوة ثم انفراجهما، وهو صوت شديد مجهور وفيه قلقلة.',
            traits: { voice: 'مجهور', force: 'شديد (قلقلة)', tone: 'مرقق' },
            vowels: ['بَ', 'بُ', 'بِ'],
            mad: ['بَا', 'بُو', 'بِي'],
            audioKey: 'phoneme_pure_baa',
            modelWord: 'بَاب',
            confusable: {
                pair: 'ب / م',
                target: 'ب (بَاب)',
                confused: 'م (مَامَا)',
                advice: 'انطق الباء بحبس الهواء في الفم وانفراجه بقوة دون إخراج غنة من الأنف كالـميم!'
            }
        },
        'م': {
            char: 'م',
            name: 'الميم',
            category: 'lips',
            categoryName: 'الشفتان والخيشوم',
            makhrajPoint: 'انطباق الشفتين بلطف مع غنة من الأنف',
            description: 'يخرج صوت (م) بانطباق الشفتين مع جريان جزء من الصوت عبر تجويف الأنف (الخيشوم).',
            traits: { voice: 'مجهور', force: 'بيني (متوسط)', tone: 'مرقق (ذو غنة)' },
            vowels: ['مَ', 'مُ', 'مِ'],
            mad: ['مَا', 'مُو', 'مِي'],
            audioKey: 'phoneme_pure_meem',
            modelWord: 'مَامَا',
            confusable: {
                pair: 'م / ن',
                target: 'م (مَطَر)',
                confused: 'ن (نُور)',
                advice: 'أغلق الشفتين تماماً عند نطق الميم، بينما النون تكون بطرف اللسان لا الشفتين!'
            }
        },
        'ن': {
            char: 'ن',
            name: 'النون',
            category: 'tongue_tip',
            categoryName: 'طرف اللسان والخيشوم',
            makhrajPoint: 'طرف اللسان مع لثة الأسنان العليا مع غنة',
            description: 'يخرج صوت (ن) بملامسة طرف اللسان للثة العلوية، ويصاحبه رنين خيشومي لطيف.',
            traits: { voice: 'مجهور', force: 'بيني', tone: 'مرقق (ذو غنة)' },
            vowels: ['نَ', 'نُ', 'نِ'],
            mad: ['نَا', 'نُو', 'نِي'],
            audioKey: 'phoneme_pure_noon',
            modelWord: 'نُور',
            confusable: {
                pair: 'ن / ل',
                target: 'ن (نُور)',
                confused: 'ل (لَبَن)',
                advice: 'تأكد من خروج صوت النون بنعومة وغنة خفيفة من الأنف!'
            }
        },
        'ز': {
            char: 'ز',
            name: 'الزاي',
            category: 'tongue_tip',
            categoryName: 'طرف اللسان والأسنان',
            makhrajPoint: 'رأس اللسان مع الصفحة الداخلية للثنايا السفلى',
            description: 'يخرج صوت (ز) بجريان الهواء بين اللسان والأسنان مع اهتزاز الحبال الصوتية (صوت كأزيز النحلة).',
            traits: { voice: 'مجهور', force: 'رخو (صفير)', tone: 'مرقق' },
            vowels: ['زَ', 'زُ', 'زِ'],
            mad: ['زَا', 'زُو', 'زِي'],
            audioKey: 'phoneme_pure_zay',
            modelWord: 'زُورَق',
            confusable: {
                pair: 'ز / ذ',
                target: 'ز (زُورَق)',
                confused: 'ذ (ذُبَاب)',
                advice: 'لا تخرج لسانك بين أسنانك عند نطق الزاي، بل دعه وراء الأسنان تماماً ليحدث الصفير!'
            }
        },
        'ق': {
            char: 'ق',
            name: 'القاف',
            category: 'tongue_back',
            categoryName: 'أقصى اللسان',
            makhrajPoint: 'أقصى اللسان مما يلي الحلق مع الحنك اللحمي',
            description: 'يخرج صوت (ق) من عمق الفم بأقصى اللسان، وهو صوت مفخم قوي شديد مجهور.',
            traits: { voice: 'مجهور', force: 'شديد (قلقلة)', tone: 'مفخم مستعلٍ' },
            vowels: ['قَ', 'قُ', 'قِ'],
            mad: ['قَا', 'قُو', 'قِي'],
            audioKey: 'phoneme_pure_qaf',
            modelWord: 'قَلَم',
            confusable: {
                pair: 'ق / ك',
                target: 'ق (قَلَم)',
                confused: 'ك (كِتَاب)',
                advice: 'القاف من أعمق اللسان مع تفخيم وامتلاء الفم، بينما الكاف مرققة تخرج من موضع أمامه بقليل مع همس!'
            }
        },
        'ل': {
            char: 'ل',
            name: 'اللام',
            category: 'tongue_tip',
            categoryName: 'حافة وطرف اللسان',
            makhrajPoint: 'أدنى حافة اللسان إلى منتهاها مع لثة الأسنان العليا',
            description: 'يخرج صوت (ل) بانحراف الصوت على جانبي اللسان عند ملامسة لثة الثنايا العليا.',
            traits: { voice: 'مجهور', force: 'بيني (انحراف)', tone: 'مرقق غالباً' },
            vowels: ['لَ', 'لُ', 'لِ'],
            mad: ['لَا', 'لُو', 'لِي'],
            audioKey: 'phoneme_pure_lam',
            modelWord: 'لَبَن',
            confusable: {
                pair: 'ل / ر',
                target: 'ل (لَبَن)',
                confused: 'ر (رِيم)',
                advice: 'ثبّت طرف لسانك عند اللثة ودع الهواء يخرج من جانبي اللسان بدون ارتعاد!'
            }
        },
        'ف': {
            char: 'ف',
            name: 'الفاء',
            category: 'lips',
            categoryName: 'الشفة والأسنان',
            makhrajPoint: 'بطن الشفة السفلى مع أطراف الثنايا العليا',
            description: 'يخرج صوت (ف) بملامسة أطراف الأسنان العلوية للشفة السفلى وجريان الهواء بنعومة.',
            traits: { voice: 'مهموس (جريان النفس)', force: 'رخو', tone: 'مرقق' },
            vowels: ['فَ', 'فُ', 'فِ'],
            mad: ['فَا', 'فُو', 'فِي'],
            audioKey: 'phoneme_pure_faa',
            modelWord: 'فِيل',
            confusable: {
                pair: 'ف / ث',
                target: 'ف (فِيل)',
                confused: 'ث (ثَوْب)',
                advice: 'ضع أسنانك العليا على شفتك السفلى، ولا تخرج طرف لسانك كالـثاء!'
            }
        },
        'ط': {
            char: 'ط',
            name: 'الطاء',
            category: 'tongue_tip',
            categoryName: 'طرف اللسان والأسنان',
            makhrajPoint: 'طرف اللسان مع أصول الثنايا العليا مع إطباق',
            description: 'أقوى حروف الهجاء، يخرج بتطابق اللسان مع الحنك الأعلى، وهو صوت شديد مجهور مفخم مطبق.',
            traits: { voice: 'مجهور', force: 'شديد (قلقلة)', tone: 'مفخم مطبق قوي' },
            vowels: ['طَ', 'طُ', 'طِ'],
            mad: ['طَا', 'طُو', 'طِي'],
            audioKey: 'phoneme_pure_ta',
            modelWord: 'طَيَّار',
            confusable: {
                pair: 'ط / ت',
                target: 'ط (طَيَّار)',
                confused: 'ت (تِين)',
                advice: 'فخّم الطاء وألصق لسانك بسقف الحلق (طَ)، وإياك وترقيقها لتصبح كـالتاء (تَ)!'
            }
        },
        'ع': {
            char: 'ع',
            name: 'العين',
            category: 'throat',
            categoryName: 'وسط الحلق',
            makhrajPoint: 'وسط الحلق (منطقة لسان المزمار)',
            description: 'يخرج صوت (ع) من منتصف الحلق برجوع لسان المزمار إلى الخلف، صوت ناصع عميق.',
            traits: { voice: 'مجهور', force: 'بيني', tone: 'مرقق' },
            vowels: ['عَ', 'عُ', 'عِ'],
            mad: ['عَا', 'عُو', 'عِي'],
            audioKey: 'phoneme_pure_ayn',
            modelWord: 'عَلَم',
            confusable: {
                pair: 'ع / أ',
                target: 'ع (عَلَم)',
                confused: 'أ (أَيْمَن)',
                advice: 'اضغط بلطف في وسط حلقك لإخراج العين الصافية ولا تنطقها همزة رخوة!'
            }
        },
        'ك': {
            char: 'ك',
            name: 'الكاف',
            category: 'tongue_back',
            categoryName: 'أقصى اللسان',
            makhrajPoint: 'أقصى اللسان مع الحنك العظمي الصلب',
            description: 'يخرج صوت (ك) بانحباس الصوت ثم تدفق دفعة هواء لطيفة (الهمس)، صوت مرقق خفيف.',
            traits: { voice: 'مهموس', force: 'شديد', tone: 'مرقق' },
            vowels: ['كَ', 'كُ', 'كِ'],
            mad: ['كَا', 'كُو', 'كِي'],
            audioKey: 'phoneme_pure_kaf',
            modelWord: 'كِتَاب',
            confusable: {
                pair: 'ك / ق',
                target: 'ك (كِتَاب)',
                confused: 'ق (قَلَم)',
                advice: 'انطق الكاف برقة مع همسة هواء خفيفة ولا تفخمها كـالقاف!'
            }
        },
        'ت': {
            char: 'ت',
            name: 'التاء',
            category: 'tongue_tip',
            categoryName: 'طرف اللسان والأسنان',
            makhrajPoint: 'طرف اللسان مع أصول الثنايا العليا',
            description: 'يخرج صوت (ت) بملامسة طرف اللسان لأصول الأسنان مع همسة هواء رقيقة مرققة.',
            traits: { voice: 'مهموس', force: 'شديد', tone: 'مرقق مستفل' },
            vowels: ['تَ', 'تُ', 'تِ'],
            mad: ['تَا', 'تُو', 'تِي'],
            audioKey: 'phoneme_pure_taa',
            modelWord: 'تِين',
            confusable: {
                pair: 'ت / ط',
                target: 'ت (تِين)',
                confused: 'ط (طَيْر)',
                advice: 'رقق التاء وافتح فمك برقة (تَ)، ولا تفخمها لتصبح كالطاء!'
            }
        },
        'س': {
            char: 'س',
            name: 'السين',
            category: 'tongue_tip',
            categoryName: 'طرف اللسان والأسنان',
            makhrajPoint: 'رأس اللسان مع الصفحة الداخلية للثنايا السفلى',
            description: 'يخرج صوت (س) بجريان النفس وصفير ناعم مرقق بين رأس اللسان والثنايا السفلى.',
            traits: { voice: 'مهموس (جريان النفس)', force: 'رخو (صفير)', tone: 'مرقق مستفل' },
            vowels: ['سَ', 'سُ', 'سِ'],
            mad: ['سَا', 'سُو', 'سِي'],
            audioKey: 'phoneme_pure_seen',
            modelWord: 'فِرَاس',
            confusable: {
                pair: 'س / ص',
                target: 'س (سَالِم)',
                confused: 'ص (صَلَاح)',
                advice: 'ابتسم قليلاً عند نطق السين المرققة (سَـ) وخفف لسانك دون تفخيمها كـالصاد (صَـ)!'
            }
        },
        'ص': {
            char: 'ص',
            name: 'الصاد',
            category: 'tongue_tip',
            categoryName: 'طرف اللسان والأسنان',
            makhrajPoint: 'طرف اللسان مع ما بين الثنايا العليا والسفلى مع استعلاء',
            description: 'يخرج صوت (ص) بصفير قوي وتفخيم واستعلاء لأقصى اللسان وملء الفم بالصدى.',
            traits: { voice: 'مهموس', force: 'رخو (صفير)', tone: 'مفخم مطبق' },
            vowels: ['صَ', 'صُ', 'صِ'],
            mad: ['صَا', 'صُو', 'صِي'],
            audioKey: 'phoneme_pure_sad',
            modelWord: 'صَلَاح',
            confusable: {
                pair: 'ص / س',
                target: 'ص (صَلَاح)',
                confused: 'س (سَبِيل)',
                advice: 'الصاد مفخمة ممتلئة بالصدى (صَـ)، والسين مرققة مبتسمة ناعمة (سَـ)!'
            }
        },
        'ذ': {
            char: 'ذ',
            name: 'الذال',
            category: 'tongue_tip',
            categoryName: 'طرف اللسان وأطراف الأسنان',
            makhrajPoint: 'طرف اللسان خارجاً بين الثنايا العليا والسفلى',
            description: 'يخرج صوت (ذ) بإخراج رأس اللسان قليلاً بين الأسنان، وهو صوت مجهور رخو مرقق ناعم.',
            traits: { voice: 'مجهور', force: 'رخو', tone: 'مرقق' },
            vowels: ['ذَ', 'ذُ', 'ذِ'],
            mad: ['ذَا', 'ذُو', 'ذِي'],
            audioKey: 'phoneme_pure_dhal',
            modelWord: 'ذُبَاب',
            confusable: {
                pair: 'ذ / ز',
                target: 'ذ (ذُبَاب)',
                confused: 'ز (زُورَق)',
                advice: 'أخرج طرف لسانك قليلاً بين أسنانك عند نطق الذال، ولا تحبسه فيتحول إلى زاي!'
            }
        },
        'ح': {
            char: 'ح',
            name: 'الحاء',
            category: 'throat',
            categoryName: 'وسط الحلق',
            makhrajPoint: 'وسط الحلق',
            description: 'يخرج صوت (ح) بهواء نقي ونفس دافئ من وسط الحلق دون أي شخير أو خشونة.',
            traits: { voice: 'مهموس', force: 'رخو', tone: 'مرقق' },
            vowels: ['حَ', 'حُ', 'حِ'],
            mad: ['حَا', 'حُو', 'حِي'],
            audioKey: 'phoneme_pure_haa',
            modelWord: 'حَوْض',
            confusable: {
                pair: 'ح / هـ',
                target: 'ح (حَوْض)',
                confused: 'هـ (هِلَال)',
                advice: 'الحاء من وسط الحلق بنفَس مسموع وواضح، بينما الهاء من أقصى الحلق في العمق!'
            }
        },
        'خ': {
            char: 'خ',
            name: 'الخاء',
            category: 'throat',
            categoryName: 'أدنى الحلق',
            makhrajPoint: 'أدنى الحلق مما يلي الفم',
            description: 'يخرج صوت (خ) من أعلى الحلق عند مدخل الفم، صوت مفخم رخو ذو حفيف مسموع.',
            traits: { voice: 'مهموس', force: 'رخو', tone: 'مفخم' },
            vowels: ['خَ', 'خُ', 'خِ'],
            mad: ['خَا', 'خُو', 'خِي'],
            audioKey: 'phoneme_pure_khaa',
            modelWord: 'خَيْمَة',
            confusable: {
                pair: 'خ / غ',
                target: 'خ (خَيْمَة)',
                confused: 'غ (غَزَال)',
                advice: 'الخاء صوت مهموس يخرج معه هواء كثير، بينما الغين مجهورة تهتز معها الأوتار!'
            }
        },
        'ض': {
            char: 'ض',
            name: 'الضاد',
            category: 'tongue_mid',
            categoryName: 'حافة اللسان',
            makhrajPoint: 'إحدى حافتي اللسان أو كلتيهما مع الأضراس العليا',
            description: 'حرف لغة الضاد المميز، يخرج بامتداد اللسان وتلامس حافته مع الأضراس العليا مع استطالة.',
            traits: { voice: 'مجهور', force: 'رخو (استطالة)', tone: 'مفخم مطبق' },
            vowels: ['ضَ', 'ضُ', 'ضِ'],
            mad: ['ضَا', 'ضُو', 'ضِي'],
            audioKey: 'phoneme_pure_dhad',
            modelWord: 'ضَوْء',
            confusable: {
                pair: 'ض / د',
                target: 'ض (ضَوْء)',
                confused: 'د (دَار)',
                advice: 'الضاد تخرج من حافة اللسان مفخمة مطبقة ممتلئة، وإياك أن تنطقها دالاً مرققة!'
            }
        },
        'ش': {
            char: 'ش',
            name: 'الشين',
            category: 'tongue_mid',
            categoryName: 'وسط اللسان',
            makhrajPoint: 'وسط اللسان مع الحنك الأعلى مع انتشار الهواء',
            description: 'يخرج صوت (ش) بانتشار الهواء وتدفقه داخل الفم (صفة التفشي)، صوت رخو مهموس.',
            traits: { voice: 'مهموس', force: 'رخو (تفشي)', tone: 'مرقق' },
            vowels: ['شَ', 'شُ', 'شِ'],
            mad: ['شَا', 'شُو', 'شِي'],
            audioKey: 'phoneme_pure_sheen',
            modelWord: 'شَمْس',
            confusable: {
                pair: 'ش / س',
                target: 'ش (شَمْس)',
                confused: 'س (سَبِيل)',
                advice: 'دع الهواء ينتشر في فمك كاملاً عند نطق الشين (شـ)، ولا تجعله صفقة ضيقة كالسين!'
            }
        },
        'ث': {
            char: 'ث',
            name: 'الثاء',
            category: 'tongue_tip',
            categoryName: 'طرف اللسان وأطراف الأسنان',
            makhrajPoint: 'طرف اللسان مع أطراف الثنايا العليا',
            description: 'يخرج صوت (ث) بإخراج طرف اللسان قليلاً مع همس وجريان نفس لطيف وناعم.',
            traits: { voice: 'مهموس', force: 'رخو', tone: 'مرقق' },
            vowels: ['ثَ', 'ثُ', 'ثِ'],
            mad: ['ثَا', 'ثُو', 'ثِي'],
            audioKey: 'phoneme_pure_thaa',
            modelWord: 'ثَوْب',
            confusable: {
                pair: 'ث / س',
                target: 'ث (ثَوْب)',
                confused: 'س (سَبِيل)',
                advice: 'أخرج طرف لسانك بين أسنانك (ثَـ)، وإن لم تخرجه تحول إلى سين!'
            }
        },
        'غ': {
            char: 'غ',
            name: 'الغين',
            category: 'throat',
            categoryName: 'أدنى الحلق',
            makhrajPoint: 'أدنى الحلق قرب اللهاة',
            description: 'يخرج صوت (غ) من أعلى الحلق مجهوراً مفخماً مع اهتزاز الحبال الصوتية.',
            traits: { voice: 'مجهور', force: 'رخو', tone: 'مفخم مستعلٍ' },
            vowels: ['غَ', 'غُ', 'غِ'],
            mad: ['غَا', 'غُو', 'غِي'],
            audioKey: 'phoneme_pure_ghayn',
            modelWord: 'غَزَال',
            confusable: {
                pair: 'غ / خ',
                target: 'غ (غَزَال)',
                confused: 'خ (خَيْمَة)',
                advice: 'اجعل صوت الغين مجهوراً سلساً واهتزازياً دون خشونة هواء الخاء!'
            }
        },
        'ظ': {
            char: 'ظ',
            name: 'الظاء',
            category: 'tongue_tip',
            categoryName: 'طرف اللسان والأسنان',
            makhrajPoint: 'طرف اللسان مع أطراف الثنايا العليا مع إطباق وتفخيم',
            description: 'يخرج صوت (ظ) بإخراج طرف اللسان بين الأسنان مع إطباق وتفخيم وامتلاء الفم بالصدى.',
            traits: { voice: 'مجهور', force: 'رخو', tone: 'مفخم مطبق' },
            vowels: ['ظَ', 'ظُ', 'ظِ'],
            mad: ['ظَا', 'ظُو', 'ظِي'],
            audioKey: 'phoneme_pure_dha',
            modelWord: 'ظَبْي',
            confusable: {
                pair: 'ظ / ذ',
                target: 'ظ (مَحْفُوظ)',
                confused: 'ذ (أُسْتَاذ)',
                advice: 'فخّم الظاء واملأ فمك بصداها (ظَ)، والذال تكون رقيقة مرققة نحيفة (ذَ)!'
            }
        },
        'ج': {
            char: 'ج',
            name: 'الجيم',
            category: 'tongue_mid',
            categoryName: 'وسط اللسان',
            makhrajPoint: 'وسط اللسان مع وسط الحنك الأعلى',
            description: 'يخرج صوت (ج) بإلصاق وسط اللسان بالحلق ثم انفصاله، صوت فصيح مجهور شديد.',
            traits: { voice: 'مجهور', force: 'شديد (قلقلة)', tone: 'مرقق' },
            vowels: ['جَ', 'جُ', 'جِ'],
            mad: ['جَا', 'جُو', 'جِي'],
            audioKey: 'phoneme_pure_jeem',
            modelWord: 'جَمَل',
            confusable: {
                pair: 'ج / ي',
                target: 'ج (جَمَل)',
                confused: 'ي (يَد)',
                advice: 'احرص على غلق المخرج تماماً عند نطق الجيم الفصيحة ثم إطلاقه بقوة!'
            }
        },
        'هـ': {
            char: 'هـ',
            name: 'الهاء',
            category: 'throat',
            categoryName: 'أقصى الحلق',
            makhrajPoint: 'أقصى الحلق مما يلي الصدر',
            description: 'يخرج صوت (هـ) من أعمق نقطة في الحلق قرب الصدر، صوت مهموس رخو رقيق ولطيف.',
            traits: { voice: 'مهموس', force: 'رخو', tone: 'مرقق خفي' },
            vowels: ['هَ', 'هُ', 'هِ'],
            mad: ['هَا', 'هُو', 'هِي'],
            audioKey: 'phoneme_pure_ha',
            modelWord: 'هِلَال',
            confusable: {
                pair: 'هـ / ح',
                target: 'هـ (هِلَال)',
                confused: 'ح (حَوْض)',
                advice: 'انطق الهاء بنفَس عميق خفيف دون حكّة الحاء في منتصف الحلق!'
            }
        }
    };

    // ==========================================================================
    // 2. بنك الكلمات المنهجية للطلاقة القرائية والتقطيع المقطعي (Grade 1)
    // ==========================================================================
    const FLUENCY_WORDS_BATTERY = [
        // الوحدة الأولى
        { word: 'دَار', unit: 'unit1', syllables: ['دَا', 'رْ'], audioKey: 'word_dar', level: 'بسيط' },
        { word: 'دَادَا', unit: 'unit1', syllables: ['دَا', 'دَا'], audioKey: 'word_dada', level: 'بسيط' },
        { word: 'دُور', unit: 'unit1', syllables: ['دُو', 'رْ'], audioKey: 'word_door', level: 'بسيط' },
        { word: 'دَوْر', unit: 'unit1', syllables: ['دَوْ', 'رْ'], audioKey: 'word_dawr', level: 'بسيط' },
        { word: 'بَاب', unit: 'unit1', syllables: ['بَا', 'بْ'], audioKey: 'word_bab', level: 'بسيط' },
        { word: 'نُور', unit: 'unit1', syllables: ['نُو', 'رْ'], audioKey: 'word_noor', level: 'بسيط' },
        { word: 'نَام', unit: 'unit1', syllables: ['نَا', 'مْ'], audioKey: 'word_naam', level: 'بسيط' },
        { word: 'بَان', unit: 'unit1', syllables: ['بَا', 'نْ'], audioKey: 'word_ban', level: 'بسيط' },
        { word: 'مَامَا', unit: 'unit1', syllables: ['مَا', 'مَا'], audioKey: 'word_mama', level: 'بسيط' },
        { word: 'رِيم', unit: 'unit1', syllables: ['رِي', 'مْ'], audioKey: 'word_reem', level: 'بسيط' },
        { word: 'دَارِي', unit: 'unit1', syllables: ['دَا', 'رِي'], audioKey: 'word_dari', level: 'متوسط' },
        { word: 'دِينَا', unit: 'unit1', syllables: ['دِي', 'نَا'], audioKey: 'word_deena', level: 'متوسط' },
        // الوحدة الثانية
        { word: 'مِيزَان', unit: 'unit2', syllables: ['مِي', 'زَا', 'نْ'], audioKey: 'word_mizan', level: 'متوسط' },
        { word: 'قَدُّورِي', unit: 'unit2', syllables: ['قَدْ', 'دُو', 'رِي'], audioKey: 'word_qaddouri', level: 'متقدم' },
        { word: 'وَزَّان', unit: 'unit2', syllables: ['وَزْ', 'زَا', 'نْ'], audioKey: 'word_wazzan', level: 'متقدم' },
        { word: 'زُورَق', unit: 'unit2', syllables: ['زُو', 'رَ', 'قْ'], audioKey: 'word_zoraq', level: 'متوسط' },
        { word: 'بُوق', unit: 'unit2', syllables: ['بُو', 'قْ'], audioKey: 'word_booq', level: 'بسيط' },
        { word: 'مَازِن', unit: 'unit2', syllables: ['مَا', 'زِ', 'نْ'], audioKey: 'word_mazin', level: 'متوسط' },
        { word: 'قَلَم', unit: 'unit2', syllables: ['قَ', 'لَ', 'مْ'], audioKey: 'word_qalam', level: 'بسيط' },
        { word: 'وَرْد', unit: 'unit2', syllables: ['وَرْ', 'دْ'], audioKey: 'word_ward', level: 'بسيط' },
        { word: 'قِطَار', unit: 'unit2', syllables: ['قِ', 'طَا', 'رْ'], audioKey: 'word_qitar', level: 'متوسط' },
        // الوحدة الثالثة
        { word: 'رِيف', unit: 'unit3', syllables: ['رِي', 'فْ'], audioKey: 'word_reef', level: 'بسيط' },
        { word: 'مَنَاف', unit: 'unit3', syllables: ['مَ', 'نَا', 'فْ'], audioKey: 'word_manaf', level: 'متوسط' },
        { word: 'بَقَر', unit: 'unit3', syllables: ['بَ', 'قَ', 'رْ'], audioKey: 'word_baqar', level: 'بسيط' },
        { word: 'وَزّ', unit: 'unit3', syllables: ['وَزْ', 'زْ'], audioKey: 'word_wazz', level: 'بسيط' },
        { word: 'سَبِيل', unit: 'unit3', syllables: ['سَ', 'بِي', 'لْ'], audioKey: 'word_sabeel', level: 'متوسط' },
        { word: 'مَطَر', unit: 'unit3', syllables: ['مَ', 'طَ', 'رْ'], audioKey: 'word_matar', level: 'بسيط' },
        { word: 'بَطّ', unit: 'unit3', syllables: ['بَطْ', 'طْ'], audioKey: 'word_batt', level: 'بسيط' },
        { word: 'طَيَّار', unit: 'unit3', syllables: ['طَيْ', 'يَا', 'رْ'], audioKey: 'word_tayyar', level: 'متقدم' },
        // الوحدة الرابعة
        { word: 'عَلَم', unit: 'unit4', syllables: ['عَ', 'لَ', 'مْ'], audioKey: 'word_alam', level: 'بسيط' },
        { word: 'بِلَاد', unit: 'unit4', syllables: ['بِ', 'لَا', 'دْ'], audioKey: 'word_bilad', level: 'متوسط' },
        { word: 'كِتَاب', unit: 'unit4', syllables: ['كِ', 'تَا', 'بْ'], audioKey: 'word_kitab', level: 'متوسط' },
        { word: 'مَكْتَبَة', unit: 'unit4', syllables: ['مَكْ', 'تَ', 'بَ', 'ةْ'], audioKey: 'word_maktaba', level: 'متقدم' },
        { word: 'سَلْمَى', unit: 'unit4', syllables: ['سَلْ', 'مَى'], audioKey: 'word_salma', level: 'متوسط' },
        { word: 'بَنَات', unit: 'unit4', syllables: ['بَ', 'نَا', 'تْ'], audioKey: 'word_banat', level: 'متوسط' },
        { word: 'نَبِيل', unit: 'unit4', syllables: ['نَ', 'بِي', 'لْ'], audioKey: 'word_nabeel', level: 'متوسط' },
        // الوحدة الخامسة
        { word: 'صَلَاح', unit: 'unit5', syllables: ['صَ', 'لَا', 'حْ'], audioKey: 'word_salah', level: 'متوسط' },
        { word: 'فَلَّاح', unit: 'unit5', syllables: ['فَلْ', 'لَا', 'حْ'], audioKey: 'word_fallah', level: 'متوسط' },
        { word: 'حَقْل', unit: 'unit5', syllables: ['حَقْ', 'لْ'], audioKey: 'word_haql', level: 'متوسط' },
        { word: 'حَوْض', unit: 'unit5', syllables: ['حَوْ', 'ضْ'], audioKey: 'word_hawdh', level: 'متوسط' },
        { word: 'خَيْمَة', unit: 'unit5', syllables: ['خَيْ', 'مَ', 'ةْ'], audioKey: 'word_khayma', level: 'متوسط' },
        { word: 'نَخْل', unit: 'unit5', syllables: ['نَخْ', 'لْ'], audioKey: 'word_nakhl', level: 'متوسط' },
        { word: 'ذُبَاب', unit: 'unit5', syllables: ['ذُ', 'بَا', 'بْ'], audioKey: 'word_dhubab', level: 'متوسط' },
        // الوحدة السادسة
        { word: 'شُرْطِيّ', unit: 'unit6', syllables: ['شُرْ', 'طِيْ', 'يْ'], audioKey: 'word_shurti', level: 'متقدم' },
        { word: 'مُرُور', unit: 'unit6', syllables: ['مُ', 'رُو', 'رْ'], audioKey: 'word_muroor', level: 'متوسط' },
        { word: 'أَثَاث', unit: 'unit6', syllables: ['أَ', 'ثَا', 'ثْ'], audioKey: 'word_athath', level: 'متوسط' },
        { word: 'غَزَال', unit: 'unit6', syllables: ['غَ', 'زَا', 'لْ'], audioKey: 'word_ghazal', level: 'متوسط' },
        { word: 'مَحْفُوظ', unit: 'unit6', syllables: ['مَحْ', 'فُو', 'ظْ'], audioKey: 'word_mahfooth', level: 'متقدم' },
        { word: 'نَظِيف', unit: 'unit6', syllables: ['نَ', 'ظِي', 'فْ'], audioKey: 'word_natheef', level: 'متوسط' },
        { word: 'هِلَال', unit: 'unit6', syllables: ['هِ', 'لَا', 'لْ'], audioKey: 'word_hilal', level: 'متوسط' },
        { word: 'جَمَل', unit: 'unit6', syllables: ['جَ', 'مَ', 'لْ'], audioKey: 'word_jamal', level: 'بسيط' }
    ];

    // ==========================================================================
    // 3. بنك الجمل والنصوص المنهجية لقطار القراءة التعبيرية (Karaoke Express)
    // ==========================================================================
    const STORY_EXPRESS_BATTERY = [
        {
            id: 's1',
            title: 'دَادَا رَبَاب ونَمِير',
            unit: 'الوحدة الأولى',
            words: ['دَادَا', 'رَبَاب', 'نَمِيرٌ', 'قَارِئٌ', 'نَامَ', 'بَدْرِي'],
            audioKey: 'story_dada_rabab',
            timing: [0, 800, 1600, 2400, 3200, 4000]
        },
        {
            id: 's2',
            title: 'مِيزَانُ قَدُّورِي',
            unit: 'الوحدة الثانية',
            words: ['مِيزَانُ', 'قَدُّورِي', 'قَدُّورِي', 'وَزَّانٌ', 'وَزَنَ', 'زَبِيبَ', 'مَازِن'],
            audioKey: 'story_mizan_qaddouri',
            timing: [0, 700, 1500, 2300, 3100, 3900, 4700]
        },
        {
            id: 's3',
            title: 'رِيفُ مَنَاف',
            unit: 'الوحدة الثالثة',
            words: ['رِيفُ', 'مَنَاف', 'فِي', 'رِيفِ', 'مَنَاف', 'بَقَرٌ', 'وَوَزٌّ'],
            audioKey: 'story_reef_manaf',
            timing: [0, 750, 1400, 2100, 2800, 3600, 4400]
        },
        {
            id: 's4',
            title: 'أَنَا وَأَخِي فِي المَدْرَسَة',
            unit: 'الوحدة الرابعة',
            words: ['أَنَا', 'تِلْمِيذٌ', 'نَشِيطٌ', 'أَقْرَأُ', 'دُرُوسِي', 'كُلَّ', 'يَوْمٍ'],
            audioKey: 'story_school_pupil',
            timing: [0, 600, 1300, 2000, 2700, 3400, 4200]
        },
        {
            id: 's5',
            title: 'حَوْضُ السِّبَاحَةِ وَالحَقْل',
            unit: 'الوحدة الخامسة',
            words: ['صَلَاحٌ', 'فَلَّاحٌ', 'يَزْرَعُ', 'الحَقْلَ', 'وَيَسْبَحُ', 'فِي', 'الحَوْضِ'],
            audioKey: 'story_swimming_pool',
            timing: [0, 750, 1500, 2300, 3100, 3800, 4600]
        }
    ];

    // ==========================================================================
    // 4. حالة النظام والمحرك الصوتي (State Management)
    // ==========================================================================
    const State = {
        activeTab: 'studio',
        selectedLetterKey: 'د',
        selectedWordIndex: 0,
        selectedStoryIndex: 0,
        currentFilterUnit: 'all',

        // المحرك الصوتي ومحلل الذبذبات
        audioContext: null,
        analyserNode: null,
        micStream: null,
        mediaRecorder: null,
        recordedChunks: [],
        recordedAudioBlob: null,
        recordedAudioUrl: null,
        isRecording: false,
        animationFrameId: null,

        // التعرف على الكلام SpeechRecognition
        speechRecognizer: null,
        isSpeechSupported: false,
        lastRecognizedText: '',
        recognitionConfidence: 0,

        // مؤشرات الطلاقة للجلسة الحالية
        sessionAttempts: 0,
        sessionSuccessCount: 0,
        sessionAccuracyTotal: 0
    };

    // ==========================================================================
    // 5. تهيئة محرك التعرف الصوتي ومحلل Web Audio API
    // ==========================================================================
    function initSpeechEngine() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            try {
                State.speechRecognizer = new SpeechRecognition();
                State.speechRecognizer.continuous = false;
                State.speechRecognizer.interimResults = false;
                State.speechRecognizer.lang = 'ar-IQ'; // اللهجة العراقية الفصيحة المعتمدة
                State.speechRecognizer.maxAlternatives = 3;

                State.speechRecognizer.onresult = function (event) {
                    if (event.results && event.results.length > 0) {
                        const transcript = event.results[0][0].transcript.trim();
                        const confidence = Math.round((event.results[0][0].confidence || 0.85) * 100);
                        handleSpeechRecognized(transcript, confidence);
                    }
                };

                State.speechRecognizer.onerror = function (event) {
                    console.log('Voice Coach speech recognition notice:', event.error);
                    handleSpeechRecognitionFallback();
                };

                State.speechRecognizer.onend = function () {
                    if (State.isRecording) {
                        stopRecording();
                    }
                };

                State.isSpeechSupported = true;
            } catch (err) {
                console.warn('SpeechRecognition init error:', err);
                State.isSpeechSupported = false;
            }
        } else {
            State.isSpeechSupported = false;
        }
    }

    // تنظيف وتطبيع النص العربي للمقارنة الفونيمية الذكية
    function normalizeArabicText(text) {
        if (!text) return '';
        return text
            .replace(/[َُِّْٰـ]/g, '') // إزالة الحركات
            .replace(/[إأآا]/g, 'ا')
            .replace(/ة/g, 'ه')
            .replace(/ى/g, 'ي')
            .replace(/[^\u0621-\u064A\s]/g, '') // إبقاء الحروف العربية فقط
            .trim();
    }

    // حساب مسافة التشابه الفونيمي ليفنشتاين
    function calculateSimilarity(str1, str2) {
        const s1 = normalizeArabicText(str1);
        const s2 = normalizeArabicText(str2);
        if (s1 === s2) return 100;
        if (!s1 || !s2) return 0;

        const track = Array(s2.length + 1).fill(null).map(() => Array(s1.length + 1).fill(null));
        for (let i = 0; i <= s1.length; i += 1) track[0][i] = i;
        for (let j = 0; j <= s2.length; j += 1) track[j][0] = j;

        for (let j = 1; j <= s2.length; j += 1) {
            for (let i = 1; i <= s1.length; i += 1) {
                const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
                track[j][i] = Math.min(
                    track[j][i - 1] + 1,
                    track[j - 1][i] + 1,
                    track[j - 1][i - 1] + indicator
                );
            }
        }
        const dist = track[s2.length][s1.length];
        const maxLen = Math.max(s1.length, s2.length);
        const sim = Math.max(0, Math.round(((maxLen - dist) / maxLen) * 100));
        return sim;
    }

    // ==========================================================================
    // 6. تشغيل وإيقاف التسجيل الصوتي ومحلل الموجات الحية (Visualizer)
    // ==========================================================================
    async function toggleRecording() {
        if (State.isRecording) {
            stopRecording();
        } else {
            await startRecording();
        }
    }

    async function startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            State.micStream = stream;

            // 1. إعداد محلل الصوت Web Audio API لرسم الموجات الحية
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                State.audioContext = new AudioContextClass();
                const source = State.audioContext.createMediaStreamSource(stream);
                State.analyserNode = State.audioContext.createAnalyser();
                State.analyserNode.fftSize = 256;
                source.connect(State.analyserNode);
                startVisualizerAnimation();
            }

            // 2. إعداد MediaRecorder لتسجيل صوت التلميذ للمقارنة
            State.recordedChunks = [];
            const mimeTypes = ['audio/webm', 'audio/mp4', 'audio/ogg', ''];
            let chosenMime = '';
            for (const mime of mimeTypes) {
                if (!mime || MediaRecorder.isTypeSupported(mime)) {
                    chosenMime = mime;
                    break;
                }
            }

            State.mediaRecorder = chosenMime ? new MediaRecorder(stream, { mimeType: chosenMime }) : new MediaRecorder(stream);
            State.mediaRecorder.ondataavailable = function (e) {
                if (e.data && e.data.size > 0) {
                    State.recordedChunks.push(e.data);
                }
            };
            State.mediaRecorder.onstop = function () {
                if (State.recordedChunks.length > 0) {
                    State.recordedAudioBlob = new Blob(State.recordedChunks, { type: State.mediaRecorder.mimeType || 'audio/webm' });
                    if (State.recordedAudioUrl) {
                        URL.revokeObjectURL(State.recordedAudioUrl);
                    }
                    State.recordedAudioUrl = URL.createObjectURL(State.recordedAudioBlob);
                    const btnPlay = document.getElementById('btnVcPlayPupil');
                    if (btnPlay) btnPlay.disabled = false;

                    // تشغيل التقييم بالذكاء الاصطناعي التوليدي إن كان متاحاً
                    evaluateVoiceWithAI(State.recordedAudioBlob);
                }
            };
            State.mediaRecorder.start();

            // 3. تشغيل SpeechRecognition إن وُجد
            if (State.speechRecognizer && State.isSpeechSupported) {
                try {
                    State.speechRecognizer.start();
                } catch (e) {
                    console.log('Recognizer already active or error:', e);
                }
            }

            State.isRecording = true;
            updateMicUi(true);

            // إيقاف تلقائي بعد 5 ثوانٍ لحماية الأطفال من التسجيل المطول
            setTimeout(() => {
                if (State.isRecording) {
                    stopRecording();
                }
            }, 5000);

        } catch (err) {
            console.warn('Microphone access denied or error:', err);
            // تفعيل وضع المحاكاة الصفي أوفلاين
            handleMicFallbackMode();
        }
    }

    function stopRecording() {
        State.isRecording = false;
        updateMicUi(false);

        if (State.mediaRecorder && State.mediaRecorder.state !== 'inactive') {
            try { State.mediaRecorder.stop(); } catch (e) {}
        }
        if (State.speechRecognizer) {
            try { State.speechRecognizer.stop(); } catch (e) {}
        }
        if (State.micStream) {
            State.micStream.getTracks().forEach(track => track.stop());
            State.micStream = null;
        }
        if (State.animationFrameId) {
            cancelAnimationFrame(State.animationFrameId);
            State.animationFrameId = null;
        }
        if (State.audioContext) {
            try {
                if (State.audioContext.state !== 'closed') {
                    State.audioContext.suspend();
                }
            } catch (e) {}
        }

        // رسم خط سكوني هادئ على الكانفاس
        drawIdleWaveform();

        // إن لم يتم تشغيل onresult من SpeechRecognition، نفعّل وضع التقييم الموجه
        setTimeout(() => {
            const modal = document.getElementById('voiceCoachModal');
            if (modal && modal.style.display !== 'none' && !State.lastRecognizedText) {
                handleSpeechRecognitionFallback();
            }
        }, 350);
    }

    function updateMicUi(recording) {
        const btnMic = document.getElementById('btnVcMic');
        const statusDot = document.getElementById('vcWaveformStatusDot');
        const statusLabel = document.getElementById('vcWaveformStatusText');

        if (btnMic) {
            if (recording) {
                btnMic.classList.add('recording');
                btnMic.title = 'انقر لإيقاف التسجيل واحتساب النتيجة';
                btnMic.innerHTML = '⏹️';
            } else {
                btnMic.classList.remove('recording');
                btnMic.title = 'انقر للتحدث والتدرب الصوتي';
                btnMic.innerHTML = '🎙️';
            }
        }
        if (statusDot && statusLabel) {
            if (recording) {
                statusDot.className = 'vc-status-dot active';
                statusLabel.innerText = 'جاري الاستماع وتحليل مخارج الحروف...';
                statusLabel.style.color = '#fca5a5';
            } else {
                statusDot.className = 'vc-status-dot ready';
                statusLabel.innerText = 'المحلل الصوتي جاهز (أوفلاين 100%)';
                statusLabel.style.color = '#94a3b8';
            }
        }
    }

    // رسم الموجات الصوتية الحية عبر Canvas
    function startVisualizerAnimation() {
        const canvas = document.getElementById('voiceCoachWaveform');
        if (!canvas || !State.analyserNode) return;
        const ctx = canvas.getContext('2d');
        const bufferLength = State.analyserNode.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        function render() {
            if (!State.isRecording) return;
            State.animationFrameId = requestAnimationFrame(render);
            State.analyserNode.getByteTimeDomainData(dataArray);

            ctx.fillStyle = '#0f172a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.lineWidth = 3;
            ctx.strokeStyle = '#10b981';
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#10b981';
            ctx.beginPath();

            const sliceWidth = canvas.width / bufferLength;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0;
                const y = (v * canvas.height) / 2;
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
                x += sliceWidth;
            }

            ctx.lineTo(canvas.width, canvas.height / 2);
            ctx.stroke();
            ctx.shadowBlur = 0;
        }

        render();
    }

    function drawIdleWaveform() {
        const canvas = document.getElementById('voiceCoachWaveform');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.lineWidth = 2;
        ctx.strokeStyle = '#334155';
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
    }

    // ==========================================================================
    // 7. تحليل النطق وحساب نسبة الطلاقة والتغذية الراجعة الفورية
    // ==========================================================================
    function getTargetItem() {
        if (State.activeTab === 'articulation' || State.activeTab === 'studio') {
            const letterData = ARTICULATION_DATABASE[State.selectedLetterKey] || ARTICULATION_DATABASE['د'];
            return {
                type: 'letter',
                text: letterData.char,
                fullDisplay: letterData.name + ' (' + letterData.char + ')',
                audioKey: letterData.audioKey,
                advice: letterData.confusable.advice,
                confusable: letterData.confusable
            };
        } else if (State.activeTab === 'fluency') {
            const wordData = FLUENCY_WORDS_BATTERY[State.selectedWordIndex] || FLUENCY_WORDS_BATTERY[0];
            return {
                type: 'word',
                text: wordData.word,
                fullDisplay: wordData.word,
                audioKey: wordData.audioKey,
                advice: 'ركز على نطق مقاطع الكلمة بانسيابية: ' + wordData.syllables.join(' - '),
                syllables: wordData.syllables
            };
        } else {
            const story = STORY_EXPRESS_BATTERY[State.selectedStoryIndex] || STORY_EXPRESS_BATTERY[0];
            return {
                type: 'story',
                text: story.words.join(' '),
                fullDisplay: story.title,
                audioKey: story.audioKey,
                advice: 'اقرأ الجملة كاملة بتنغيم سليم ومراعاة الوقف الصحيح!',
                story: story
            };
        }
    }

    function handleSpeechRecognized(recognizedText, confidence) {
        State.lastRecognizedText = recognizedText;
        const target = getTargetItem();
        const sim = calculateSimilarity(recognizedText, target.text);
        const finalScore = sim;

        processVoiceEvaluationResult(finalScore, recognizedText, false);
    }

    function handleSpeechRecognitionFallback() {
        // عند عدم توفر محرك تعرف نصي أوفلاين أو انقطاع الإنترنت: لا نمنح نقاطاً وهمية تلقائية
        const adviceBox = document.getElementById('vcCoachAdviceText');
        if (adviceBox) {
            adviceBox.innerHTML = '🛡️ <b>وضع المتابعة والتوجيه الصفي:</b> استمع للتسجيل المرجعي، وكرر المحاولة بصوت واضح، أو اطلب من المعلم تقييم نطقك بالنجوم أدناه.';
        }
        processVoiceEvaluationResult(0, '', true);
    }

    function handleMicFallbackMode() {
        const adviceBox = document.getElementById('vcCoachAdviceText');
        if (adviceBox) {
            adviceBox.innerHTML = '🛡️ <b>وضع التدريب الصفي الموجه (أوفلاين):</b> يمكنك الاستماع للنموذج المرجعي، والتدرب مع المعلم أو ولي الأمر، وتقييم النطق عبر أزرار النجوم السريعة أدناه!';
        }
        processVoiceEvaluationResult(0, 'تدريب مسموع', true);
    }

    async function evaluateVoiceWithAI(blob) {
        if (!window.AIBridge || !window.AIBridge.isAvailable()) return false;
        const target = getTargetItem();
        const statusLabel = document.getElementById('vcWaveformStatusText');
        if (statusLabel) {
            statusLabel.innerText = '✨ جاري التقييم الدقيق بالذكاء الاصطناعي...';
            statusLabel.style.color = '#818cf8';
        }
        try {
            const letterData = ARTICULATION_DATABASE[State.selectedLetterKey] || {};
            const aiRes = await window.AIBridge.evaluatePronunciation({
                audioBlob: blob,
                targetWord: target.text,
                makhraj: letterData.makhrajPoint || 'طرف اللسان والأسنان',
                confusablePair: letterData.confusable?.pair || ''
            });
            if (aiRes && aiRes.success && !aiRes.fallback) {
                State.lastRecognizedText = aiRes.spokenText || target.text;
                processVoiceEvaluationResult(aiRes.score || 90, aiRes.spokenText || target.text, false, aiRes);
                return true;
            }
        } catch (e) {
            console.warn('VoiceCoach AI evaluation error:', e);
        }
        return false;
    }

    function processVoiceEvaluationResult(score, spokenText, isFallback, aiData = null) {
        State.sessionAttempts++;
        State.sessionAccuracyTotal += score;
        if (score >= 80) State.sessionSuccessCount++;

        // تحديث مقياس الطلاقة القرائية
        const gaugeVal = document.getElementById('vcGaugeValue');
        const feedbackBadge = document.getElementById('vcFeedbackBadge');
        const adviceBox = document.getElementById('vcCoachAdviceText');

        if (gaugeVal) {
            gaugeVal.innerText = score + '%';
        }

        let badgeText = '';
        let badgeClass = 'vc-feedback-badge';
        let mascotPraise = '';

        if (aiData) {
            badgeText = `✨ تقييم الذكاء الاصطناعي (${score}%) - ${aiData.accuracy || 'متقن'}`;
            badgeClass += (score >= 80 ? '' : ' needs-work');
            mascotPraise = aiData.faseehAdvice || 'أحسنت يا بطل! نطقك فصيح ومخارجك سليمة!';
            if (window.Gamification && typeof window.Gamification.awardStars === 'function' && score >= 80) {
                window.Gamification.awardStars(2, 'إتقان نطق فصيح بالذكاء الاصطناعي');
            }
        } else if (isFallback) {
            badgeText = '✋ تقييم المعلم / ولي الأمر';
            badgeClass += ' needs-work';
            mascotPraise = 'استمع لصوت المعلمة رنا جيداً، ولاحظ حركة الشفتين واللسان ثم ردد!';
        } else if (score >= 85) {
            badgeText = '🌟 نطق سليم وفصيح 100%';
            mascotPraise = 'أحسنت يا بطل! نطقك صحيح وفصيح ومخارج حروفك متقنة جداً!';
            // إضافة نجوم بنظام Gamification إن وجد
            if (window.Gamification && typeof window.Gamification.awardStars === 'function') {
                window.Gamification.awardStars(2, 'إتقان نطق فصيح');
            }
        } else if (score >= 70) {
            badgeText = '👍 نطق جيد جداً - استمر';
            badgeClass += ' needs-work';
            mascotPraise = 'أداء رائع وقريب جداً! كرر الكلمة مرة أخرى لتصل لدرجة الإتقان التام.';
        } else {
            badgeText = '💪 تدرب مجدداً مع فصيح';
            badgeClass += ' retry';
            mascotPraise = 'استمع لصوت المعلمة رنا جيداً، ولاحظ حركة الشفتين واللسان ثم ردد!';
        }

        if (feedbackBadge) {
            feedbackBadge.className = badgeClass;
            feedbackBadge.innerText = badgeText;
        }

        const target = getTargetItem();
        if (adviceBox) {
            let note = '';
            if (aiData) {
                note = `<b>✨ توجيه الذكاء الاصطناعي و"فصيح":</b> ${aiData.feedback || ''}<br><small style="color:#059669; font-weight:800;"><b>التشكيل والمدود:</b> ${aiData.formationEvaluation || 'سليم'}</small>`;
                if (spokenText) {
                    note += '<br><small style="color:#64748b;">(النطق المسموع: "' + spokenText + '")</small>';
                }
            } else {
                note = '<b>توجيه المدرب الصوتي:</b> ' + (target.advice || mascotPraise);
                if (spokenText) {
                    note += '<br><small style="color:#64748b;">(النطق المسموع: "' + spokenText + '")</small>';
                }
            }
            adviceBox.innerHTML = note;
        }

        // تشجيع صوتي بصوت فصيح
        if (typeof window.mascotSpeak === 'function') {
            window.mascotSpeak(mascotPraise);
        }

        // حفظ التسجيل في السجل المحلي
        saveVoiceRecord(target.text, score, target.type);
    }

    // حفظ التسجيل الصوتي في السجل المحلي (معزول بالبادئة qiraati-smart-)
    function saveVoiceRecord(itemText, score, itemType) {
        try {
            const raw = localStorage.getItem(STORAGE_KEY_VOICE_RECORDS);
            const records = raw ? JSON.parse(raw) : [];
            const newRecord = {
                id: 'vc_' + Date.now(),
                text: itemText,
                score: score,
                type: itemType,
                timestamp: new Date().toLocaleString('ar-IQ'),
                date: new Date().toLocaleDateString('ar-IQ')
            };
            records.unshift(newRecord);
            // الاحتفاظ بآخر 30 تسجيلاً فقط لتوفير الذاكرة
            if (records.length > 30) records.pop();
            localStorage.setItem(STORAGE_KEY_VOICE_RECORDS, JSON.stringify(records));

            // تحديث جدول السجل إن كان معروضاً
            renderPortfolioTab();
        } catch (e) {
            console.warn('Failed to save voice record:', e);
        }
    }

    // ==========================================================================
    // 8. الاستماع للنموذج المرجعي ونطق التلميذ المقارن (Dual Audio Playback)
    // ==========================================================================
    function playModelAudio() {
        const target = getTargetItem();
        if (target.audioKey && typeof window.playAudio === 'function') {
            window.playAudio(target.audioKey);
        } else {
            // نطق تعزيزي فصيح
            if (typeof window.mascotSpeak === 'function') {
                window.mascotSpeak('استمع لنطق الحرف المرجعي: ' + target.text);
            }
        }
    }

    function playPupilRecording() {
        if (!State.recordedAudioUrl) return;
        const audio = new Audio(State.recordedAudioUrl);
        audio.play().catch(e => console.warn('Pupil audio play error:', e));
    }

    // تقييم التلميذ اليدوي السريع بنجوم التقييم الثلاثية (Trio Rating)
    function rateCurrentItemManually(stars) {
        const score = stars === 3 ? 100 : stars === 2 ? 80 : 60;
        const target = getTargetItem();
        processVoiceEvaluationResult(score, 'تقييم المعلم/التلميذ (' + stars + ' نجوم)', false);
    }

    // ==========================================================================
    // 9. إدارة التبويبات وتحديث الواجهات (Tabs & UI Rendering)
    // ==========================================================================
    function switchTab(tabKey) {
        State.activeTab = tabKey;

        // تحديث أزرار التبويبات
        document.querySelectorAll('.vc-tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeBtn = document.getElementById('tabVc_' + tabKey);
        if (activeBtn) activeBtn.classList.add('active');

        // تحديث اللوحات
        document.querySelectorAll('.vc-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        const activePane = document.getElementById('paneVc_' + tabKey);
        if (activePane) activePane.classList.add('active');

        // إعادة ضبط وتوليد محتوى التبويب
        if (tabKey === 'studio') {
            renderStudioMainStage();
        } else if (tabKey === 'articulation') {
            renderArticulationTab();
        } else if (tabKey === 'fluency') {
            renderFluencyTab();
        } else if (tabKey === 'stories') {
            renderStoriesTab();
        } else if (tabKey === 'portfolio') {
            renderPortfolioTab();
        }
    }

    // توليد شاشة العرض الرئيسية للاستوديو
    function renderStudioMainStage() {
        const letterData = ARTICULATION_DATABASE[State.selectedLetterKey] || ARTICULATION_DATABASE['د'];
        const displayItem = document.getElementById('vcTargetItemDisplay');
        const displayLabel = document.getElementById('vcTargetLabel');
        const syllablesContainer = document.getElementById('vcSyllablesBadgesContainer');

        if (displayItem) {
            displayItem.innerText = letterData.char;
        }
        if (displayLabel) {
            displayLabel.innerText = 'الحرف المستهدف: ' + letterData.name + ' (' + letterData.makhrajPoint + ')';
        }

        if (syllablesContainer) {
            let badgesHtml = '';
            letterData.vowels.forEach(v => {
                badgesHtml += '<button class="vc-syllable-badge" onclick="VoiceCoach.trainCustomPhoneme(\'' + v + '\')">' + v + '</button>';
            });
            letterData.mad.forEach(m => {
                badgesHtml += '<button class="vc-syllable-badge" style="background:#fef3c7; color:#92400e; border-color:#fde68a;" onclick="VoiceCoach.trainCustomPhoneme(\'' + m + '\')">' + m + '</button>';
            });
            syllablesContainer.innerHTML = badgesHtml;
        }

        const adviceBox = document.getElementById('vcCoachAdviceText');
        if (adviceBox) {
            adviceBox.innerHTML = '<b>المخرج الصوتي:</b> ' + letterData.description + '<br><b>تنبيه الأزواج المشتبهة:</b> ' + letterData.confusable.advice;
        }

        drawIdleWaveform();
    }

    // توليد تبويب مختبر مخارج الحروف
    function renderArticulationTab() {
        const paletteContainer = document.getElementById('vcLettersPaletteContainer');
        if (paletteContainer) {
            let html = '';
            Object.keys(ARTICULATION_DATABASE).forEach(k => {
                const item = ARTICULATION_DATABASE[k];
                const isActive = k === State.selectedLetterKey ? ' active' : '';
                html += '<button class="vc-letter-chip' + isActive + '" onclick="VoiceCoach.selectLetter(\'' + k + '\')">' + item.char + '</button>';
            });
            paletteContainer.innerHTML = html;
        }

        // تفاصيل الحرف المحدد
        const letter = ARTICULATION_DATABASE[State.selectedLetterKey] || ARTICULATION_DATABASE['د'];
        const charTitle = document.getElementById('vcAnatomyCharTitle');
        const makhrajBadge = document.getElementById('vcAnatomyMakhrajBadge');
        const anatomyDesc = document.getElementById('vcAnatomyDescText');
        const svgContainer = document.getElementById('vcAnatomySvgWrapper');

        if (charTitle) charTitle.innerText = 'حرف ' + letter.name + ' (' + letter.char + ')';
        if (makhrajBadge) makhrajBadge.innerText = letter.makhrajPoint;
        if (anatomyDesc) anatomyDesc.innerText = letter.description;

        // رسم تمثيلي تشريحي SVG ناعم لمخرج الحرف
        if (svgContainer) {
            svgContainer.innerHTML = generateMouthSvg(letter.category);
        }

        // صفات الحرف
        const traitsContainer = document.getElementById('vcLetterTraitsContainer');
        if (traitsContainer) {
            traitsContainer.innerHTML = `
                <div class="vc-trait-card">
                    <div class="vc-trait-name">الصوت</div>
                    <div class="vc-trait-val">${letter.traits.voice}</div>
                </div>
                <div class="vc-trait-card">
                    <div class="vc-trait-name">الشدة والرخاوة</div>
                    <div class="vc-trait-val">${letter.traits.force}</div>
                </div>
                <div class="vc-trait-card">
                    <div class="vc-trait-name">التفخيم والترقيق</div>
                    <div class="vc-trait-val">${letter.traits.tone}</div>
                </div>
            `;
        }

        // بطاقة الأزواج المشتبهة
        const confusablePair = document.getElementById('vcConfusablePairTitle');
        const confusableAdvice = document.getElementById('vcConfusableAdviceText');
        if (confusablePair) confusablePair.innerText = 'علاج خلط: ' + letter.confusable.pair;
        if (confusableAdvice) confusableAdvice.innerText = letter.confusable.advice;
    }

    // توليد أيقونة ومخطط تشريحي تفاعلي SVG للمخرج الفموي
    function generateMouthSvg(category) {
        let tonguePath = 'M 30,95 Q 60,85 95,95';
        let highlightDot = 'cx="90" cy="85" r="7"';

        if (category === 'tongue_tip') {
            tonguePath = 'M 30,95 Q 65,70 100,55';
            highlightDot = 'cx="100" cy="55" r="8"';
        } else if (category === 'lips') {
            tonguePath = 'M 30,95 Q 60,95 85,95';
            highlightDot = 'cx="110" cy="65" r="9"';
        } else if (category === 'throat') {
            tonguePath = 'M 30,95 Q 60,95 90,95';
            highlightDot = 'cx="35" cy="100" r="9"';
        } else if (category === 'tongue_mid') {
            tonguePath = 'M 30,95 Q 65,55 95,95';
            highlightDot = 'cx="65" cy="55" r="8"';
        } else if (category === 'tongue_back') {
            tonguePath = 'M 30,95 Q 45,55 95,95';
            highlightDot = 'cx="45" cy="60" r="8"';
        }

        return `
            <svg viewBox="0 0 130 130" width="120" height="120" xmlns="http://www.w3.org/2000/svg">
                <!-- تجويف الفم -->
                <path d="M 25,110 Q 20,40 65,30 Q 110,25 115,65 Q 110,105 65,115 Z" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2"/>
                <!-- سقف الحلق والأسنان -->
                <path d="M 60,32 Q 95,35 110,60" fill="none" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
                <!-- اللسان -->
                <path d="${tonguePath}" fill="none" stroke="#ef4444" stroke-width="6" stroke-linecap="round"/>
                <!-- نقطة تركيز المخرج الصوتي -->
                <circle ${highlightDot} fill="#059669" stroke="#ffffff" stroke-width="2"/>
                <!-- نص توضيحي للمخرج -->
                <text x="65" y="125" text-anchor="middle" font-size="10" font-weight="bold" fill="#047857">موضع اللسان</text>
            </svg>
        `;
    }

    // توليد تبويب استوديو الطلاقة القرائية لكلمات المنهج
    function renderFluencyTab() {
        const grid = document.getElementById('vcFluencyWordsGrid');
        if (!grid) return;

        const filtered = FLUENCY_WORDS_BATTERY.filter(w => {
            return State.currentFilterUnit === 'all' || w.unit === State.currentFilterUnit;
        });

        let html = '';
        filtered.forEach((w, idx) => {
            const isSelected = idx === State.selectedWordIndex ? ' active' : '';
            html += `
                <div class="vc-word-card${isSelected}" onclick="VoiceCoach.selectWord(${idx})">
                    <span class="vc-word-status-tag mastered">${w.level}</span>
                    <div class="vc-word-main">${w.word}</div>
                    <div class="vc-word-syllables-sub">${w.syllables.join(' • ')}</div>
                </div>
            `;
        });
        grid.innerHTML = html;
    }

    // توليد تبويب قطار الجمل والقصص التعبيرية
    function renderStoriesTab() {
        const story = STORY_EXPRESS_BATTERY[State.selectedStoryIndex] || STORY_EXPRESS_BATTERY[0];
        const titleEl = document.getElementById('vcStoryCurrentTitle');
        const unitEl = document.getElementById('vcStoryCurrentUnit');
        const passageEl = document.getElementById('vcStoryPassageContainer');

        if (titleEl) titleEl.innerText = story.title;
        if (unitEl) unitEl.innerText = story.unit;

        if (passageEl) {
            let wordsHtml = '';
            story.words.forEach((w, idx) => {
                wordsHtml += `<span class="vc-karaoke-word" id="vcKaraoke_${idx}">${w}</span> `;
            });
            passageEl.innerHTML = wordsHtml;
        }
    }

    // تشغيل القراءة الكاراوكي للجملة التعبيرية
    function playStoryWithKaraoke() {
        const story = STORY_EXPRESS_BATTERY[State.selectedStoryIndex] || STORY_EXPRESS_BATTERY[0];
        playModelAudio();

        // تلوين الكلمات بالترتيب الزمني
        story.words.forEach((w, idx) => {
            const delay = story.timing[idx] || (idx * 800);
            setTimeout(() => {
                document.querySelectorAll('.vc-karaoke-word').forEach(el => el.classList.remove('highlight'));
                const curWord = document.getElementById('vcKaraoke_' + idx);
                if (curWord) {
                    curWord.classList.add('highlight');
                    curWord.classList.add('read-done');
                }
            }, delay);
        });

        // إزالة التظليل عند الانتهاء
        const totalDuration = (story.timing[story.timing.length - 1] || 4000) + 1000;
        setTimeout(() => {
            document.querySelectorAll('.vc-karaoke-word').forEach(el => el.classList.remove('highlight'));
        }, totalDuration);
    }

    // توليد تبويب سجل التسجيلات والتقارير الفردية A4
    function renderPortfolioTab() {
        let records = [];
        try {
            const raw = localStorage.getItem(STORAGE_KEY_VOICE_RECORDS);
            records = raw ? JSON.parse(raw) : [];
        } catch (e) {
            records = [];
        }

        // ملخص الإحصائيات
        const totalRecordingsEl = document.getElementById('vcStatTotalRecords');
        const avgScoreEl = document.getElementById('vcStatAvgScore');
        const masteredLettersEl = document.getElementById('vcStatMasteredCount');

        const total = records.length;
        const avg = total > 0 ? Math.round(records.reduce((acc, r) => acc + (r.score || 0), 0) / total) : 0;
        const mastered = records.filter(r => (r.score || 0) >= 85).length;

        if (totalRecordingsEl) totalRecordingsEl.innerText = total;
        if (avgScoreEl) avgScoreEl.innerText = avg + '%';
        if (masteredLettersEl) masteredLettersEl.innerText = mastered;

        // جدول التسجيلات
        const tableBody = document.getElementById('vcRecordsTableBody');
        if (tableBody) {
            if (records.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:24px; color:#94a3b8;">لا توجد تسجيلات محفوظة حتى الآن. ابدأ بالتدرب الصوتي الآن!</td></tr>';
            } else {
                let rowsHtml = '';
                records.forEach((r, idx) => {
                    const badgeClass = r.score >= 85 ? 'color:#166534; font-weight:800;' : r.score >= 70 ? 'color:#854d0e; font-weight:800;' : 'color:#991b1b; font-weight:800;';
                    rowsHtml += `
                        <tr>
                            <td><b>${r.text}</b></td>
                            <td>${r.type === 'letter' ? 'مخرج حرف' : r.type === 'word' ? 'طلاقة كلمة' : 'جملة تعبيرية'}</td>
                            <td style="${badgeClass}">${r.score}%</td>
                            <td style="font-size:0.8rem; color:#64748b;">${r.timestamp}</td>
                            <td>
                                <button class="vc-table-play-btn" onclick="VoiceCoach.trainCustomPhoneme('${r.text}')">إعادة التدريب 🎙️</button>
                            </td>
                        </tr>
                    `;
                });
                tableBody.innerHTML = rowsHtml;
            }
        }
    }

    // طباعة تقرير الطلاقة القرائية وتشخيص مخارج الحروف الفردي A4
    function printFluencyReportA4() {
        let records = [];
        try {
            const raw = localStorage.getItem(STORAGE_KEY_VOICE_RECORDS);
            records = raw ? JSON.parse(raw) : [];
        } catch (e) { records = []; }

        const total = records.length;
        const avg = total > 0 ? Math.round(records.reduce((acc, r) => acc + (r.score || 0), 0) / total) : 0;
        const mastered = records.filter(r => (r.score || 0) >= 85).length;

        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert('يرجى السماح بالنوافذ المنبثقة لطباعة التقرير.');
            return;
        }

        const reportHtml = `
            <!DOCTYPE html>
            <html lang="ar" dir="rtl">
            <head>
                <meta charset="UTF-8">
                <title>تقرير الطلاقة القرائية وتشخيص مخارج الحروف - قراءتي الذكية</title>
                <style>
                    body { font-family: 'Tajawal', sans-serif, Tahoma; padding: 20mm; direction: rtl; color: #0f172a; }
                    .header { text-align: center; border-bottom: 2px solid #059669; padding-bottom: 12px; margin-bottom: 20px; }
                    .header h1 { margin: 0; font-size: 1.6rem; color: #065f46; }
                    .header p { margin: 4px 0 0 0; font-size: 0.95rem; color: #64748b; }
                    .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; background: #f8fafc; padding: 14px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e2e8f0; }
                    .stats-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 20px; text-align: center; }
                    .stat-card { border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; }
                    .stat-num { font-size: 1.8rem; font-weight: 900; color: #059669; }
                    table { width: 100%; border-collapse: collapse; margin-top: 14px; }
                    th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: right; }
                    th { background: #f1f5f9; }
                    .signature-box { margin-top: 40px; display: flex; justify-content: space-between; padding-top: 20px; border-top: 1.5px dashed #cbd5e1; }
                    .author-tag { text-align: center; margin-top: 30px; font-weight: 800; color: #047857; font-size: 0.9rem; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>جمهورية العراق - وزارة التربية</h1>
                    <p>منصة قراءتي التفاعلية الذكية • تقرير الطلاقة القرائية وتشخيص مخارج الحروف الفردي</p>
                </div>
                <div class="meta-grid">
                    <div><b>الصف والشعبة:</b> الأول الابتدائي (شعبة أ)</div>
                    <div><b>تاريخ التقرير:</b> ${new Date().toLocaleDateString('ar-IQ')}</div>
                    <div><b>المجال التشخيصي:</b> الوعي الفونيمي والطلاقة ونطق الحروف</div>
                    <div><b>الحالة العامة:</b> ${avg >= 85 ? 'متقن ومتميز 🌟' : avg >= 70 ? 'جيد جداً (مسار طبيعي) 👍' : 'يحتاج دعماً إضافياً 💪'}</div>
                </div>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-num">${total}</div>
                        <div>إجمالي الكلمات والحروف المتدرب عليها</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-num">${avg}%</div>
                        <div>متوسط دقة النطق والطلاقة</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-num">${mastered}</div>
                        <div>الأصوات المتقنة بامتياز (100%)</div>
                    </div>
                </div>
                <h3>سجل التدريبات والنطق الأخير:</h3>
                <table>
                    <thead>
                        <tr>
                            <th>الصوت / الكلمة</th>
                            <th>المجال</th>
                            <th>دقة النطق</th>
                            <th>تاريخ التدريب</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${records.slice(0, 15).map(r => `
                            <tr>
                                <td><b>${r.text}</b></td>
                                <td>${r.type === 'letter' ? 'مخرج حرف' : r.type === 'word' ? 'طلاقة كلمة' : 'قراءة تعبيرية'}</td>
                                <td>${r.score}%</td>
                                <td>${r.timestamp}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="signature-box">
                    <div><b>توقيع معلم المادة:</b> ____________________</div>
                    <div><b>توقيع المشرف التربوي:</b> ____________________</div>
                </div>
                <div class="author-tag">
                    إعداد وتطوير: المهندس أسامة خليل هاشم
                </div>
                <script>
                    window.onload = function() { window.print(); };
                </script>
            </body>
            </html>
        `;

        printWindow.document.write(reportHtml);
        printWindow.document.close();
    }

    // ==========================================================================
    // 10. التفاعل والتنقل المباشر
    // ==========================================================================
    function selectLetter(letterChar) {
        if (!ARTICULATION_DATABASE[letterChar]) return;
        State.selectedLetterKey = letterChar;
        renderArticulationTab();
        renderStudioMainStage();
        switchTab('studio');
    }

    function selectWord(idx) {
        State.selectedWordIndex = idx;
        const wordData = FLUENCY_WORDS_BATTERY[idx];
        if (!wordData) return;

        const displayItem = document.getElementById('vcTargetItemDisplay');
        const displayLabel = document.getElementById('vcTargetLabel');
        const syllablesContainer = document.getElementById('vcSyllablesBadgesContainer');

        if (displayItem) displayItem.innerText = wordData.word;
        if (displayLabel) displayLabel.innerText = 'الكلمة المستهدفة (الوحدة: ' + wordData.unit + ')';

        if (syllablesContainer) {
            let html = '';
            wordData.syllables.forEach(s => {
                html += '<span class="vc-syllable-badge">' + s + '</span>';
            });
            syllablesContainer.innerHTML = html;
        }

        switchTab('studio');
    }

    function selectStory(idx) {
        State.selectedStoryIndex = idx;
        renderStoriesTab();
    }

    function filterFluencyWords(unitKey) {
        State.currentFilterUnit = unitKey;
        renderFluencyTab();
    }

    function trainCustomPhoneme(phoneme) {
        const displayItem = document.getElementById('vcTargetItemDisplay');
        const displayLabel = document.getElementById('vcTargetLabel');
        if (displayItem) displayItem.innerText = phoneme;
        if (displayLabel) displayLabel.innerText = 'التدريب الصوتي الفردي للمقطع: ' + phoneme;
        switchTab('studio');
    }

    function nextItem() {
        if (State.activeTab === 'fluency') {
            State.selectedWordIndex = (State.selectedWordIndex + 1) % FLUENCY_WORDS_BATTERY.length;
            selectWord(State.selectedWordIndex);
        } else {
            const keys = Object.keys(ARTICULATION_DATABASE);
            const curIdx = keys.indexOf(State.selectedLetterKey);
            const nextKey = keys[(curIdx + 1) % keys.length];
            selectLetter(nextKey);
        }
    }

    function prevItem() {
        if (State.activeTab === 'fluency') {
            State.selectedWordIndex = (State.selectedWordIndex - 1 + FLUENCY_WORDS_BATTERY.length) % FLUENCY_WORDS_BATTERY.length;
            selectWord(State.selectedWordIndex);
        } else {
            const keys = Object.keys(ARTICULATION_DATABASE);
            const curIdx = keys.indexOf(State.selectedLetterKey);
            const prevKey = keys[(curIdx - 1 + keys.length) % keys.length];
            selectLetter(prevKey);
        }
    }

    // ==========================================================================
    // 11. النوافذ وفتح/إغلاق الاستوديو
    // ==========================================================================
    function openModal(initialTab) {
        const modal = document.getElementById('voiceCoachModal');
        if (!modal) return;
        modal.style.display = 'flex';
        initSpeechEngine();
        switchTab(initialTab || 'studio');
    }

    function closeModal() {
        const modal = document.getElementById('voiceCoachModal');
        if (modal) modal.style.display = 'none';
        if (State.isRecording) {
            stopRecording();
        }
        if (State.micStream) {
            State.micStream.getTracks().forEach(track => track.stop());
            State.micStream = null;
        }
        if (State.animationFrameId) {
            cancelAnimationFrame(State.animationFrameId);
            State.animationFrameId = null;
        }
        if (State.audioContext) {
            try {
                if (State.audioContext.state !== 'closed') {
                    State.audioContext.suspend();
                }
            } catch (e) {}
        }
    }

    // تصدير الواجهة البرمجية للكائن العام
    window.VoiceCoach = {
        openModal: openModal,
        closeModal: closeModal,
        switchTab: switchTab,
        toggleRecording: toggleRecording,
        playModelAudio: playModelAudio,
        playPupilRecording: playPupilRecording,
        rateCurrentItemManually: rateCurrentItemManually,
        selectLetter: selectLetter,
        selectWord: selectWord,
        selectStory: selectStory,
        filterFluencyWords: filterFluencyWords,
        trainCustomPhoneme: trainCustomPhoneme,
        nextItem: nextItem,
        prevItem: prevItem,
        playStoryWithKaraoke: playStoryWithKaraoke,
        printFluencyReportA4: printFluencyReportA4
    };

    window.openVoiceCoachModal = openModal;
    window.closeVoiceCoachModal = closeModal;

    // استماع مفاتيح الاختصار وإغلاق عند النقر بالخلفية
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('voiceCoachModal');
            if (modal && modal.style.display !== 'none') {
                closeModal();
            }
        }
    });

})();
