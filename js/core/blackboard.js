/* ==========================================================================
 * منصة قراءتي التفاعلية الذكية - سبورة تتبع ورسم الحروف ومختبر الخط العربي
 * المنطق البرمجي، خوارزمية التصحيح الذكي، ومحاكاة خط النسخ
 * إعداد وتطوير: المهندس أسامة خليل هاشم
 * ========================================================================== */

(function () {
    'use strict';

    // ==========================================================================
    // 1. قاعدة البيانات الشاملة للحروف الهجائية وقواعد خط النسخ
    // ==========================================================================
    const ARABIC_LETTERS_DATA = [
        {
            id: 'alif', char: 'أ', name: 'ألف', phoneme: 'أَ / ا',
            type: 'on_line', connector: false,
            forms: { isolated: 'أ', initial: 'أ', medial: 'ـأ', final: 'ـأ' },
            vowels: ['أَ', 'أُ', 'إِ', 'أْ', 'آ', 'أً', 'أٌ', 'إٍ'],
            words: ['أَسَد', 'أُمّي', 'أَرْنَب'],
            tip: 'يستقر حرف الألف على السطر تماماً، ويصعد قائماً كالسيف دون ميلان بطول 5 نقاط.',
            startPoint: { x: 50, y: 22 },
            waypoints: [{ x: 50, y: 22 }, { x: 50, y: 44 }, { x: 50, y: 66 }],
            direction: 'down',
            svgPath: 'M 50 22 L 50 66',
            hasHamza: true
        },
        {
            id: 'baa', char: 'ب', name: 'باء', phoneme: 'بْ / بـ',
            type: 'on_line', connector: true,
            forms: { isolated: 'ب', initial: 'بـ', medial: 'ـبـ', final: 'ـب' },
            vowels: ['بَ', 'بُ', 'بِ', 'بْ', 'بَا', 'بُو', 'بِي'],
            words: ['بَاب', 'بَابَا', 'بَقَرَة'],
            tip: 'يبدأ حرف الباء بسنة مائلة قليلاً، ثم يمتد منبسطاً على سطر الأساس بطول 4 نقاط، ونقطته تحته.',
            startPoint: { x: 74, y: 55 },
            waypoints: [{ x: 74, y: 55 }, { x: 72, y: 66 }, { x: 45, y: 66 }, { x: 26, y: 66 }, { x: 26, y: 56 }],
            direction: 'rtl',
            svgPath: 'M 74 55 Q 73 66 65 66 L 33 66 Q 26 66 26 56',
            dots: [{ x: 50, y: 78 }]
        },
        {
            id: 'taa', char: 'ت', name: 'تاء', phoneme: 'تْ / تـ',
            type: 'on_line', connector: true,
            forms: { isolated: 'ت', initial: 'تـ', medial: 'ـتـ', final: 'ـت' },
            vowels: ['تَ', 'تُ', 'تِ', 'تْ', 'تَا', 'تُو', 'تِي'],
            words: ['تَمْر', 'تُفَّاح', 'تِين'],
            tip: 'يشبه طبق الباء في استقراره على السطر، ويزينه نقطتان متجاورتان كالعينين في وسطه بالأعلى.',
            startPoint: { x: 74, y: 55 },
            waypoints: [{ x: 74, y: 55 }, { x: 72, y: 66 }, { x: 45, y: 66 }, { x: 26, y: 66 }, { x: 26, y: 56 }],
            direction: 'rtl',
            svgPath: 'M 74 55 Q 73 66 65 66 L 33 66 Q 26 66 26 56',
            dots: [{ x: 46, y: 45 }, { x: 54, y: 45 }]
        },
        {
            id: 'thaa', char: 'ث', name: 'ثاء', phoneme: 'ثْ / ثـ',
            type: 'on_line', connector: true,
            forms: { isolated: 'ث', initial: 'ثـ', medial: 'ـثـ', final: 'ـث' },
            vowels: ['ثَ', 'ثُ', 'ثِ', 'ثْ', 'ثَا', 'ثُو', 'ثِي'],
            words: ['ثَوْب', 'ثِمَار', 'ثَعْلَب'],
            tip: 'يستقر على السطر وتتوج رأسه ثلاث نقاط تشكل تاجاً هرمياً جميلاً.',
            startPoint: { x: 74, y: 55 },
            waypoints: [{ x: 74, y: 55 }, { x: 72, y: 66 }, { x: 45, y: 66 }, { x: 26, y: 66 }, { x: 26, y: 56 }],
            direction: 'rtl',
            svgPath: 'M 74 55 Q 73 66 65 66 L 33 66 Q 26 66 26 56',
            dots: [{ x: 46, y: 47 }, { x: 54, y: 47 }, { x: 50, y: 39 }]
        },
        {
            id: 'jeem', char: 'ج', name: 'جيم', phoneme: 'جْ / جـ',
            type: 'below_line', connector: true,
            forms: { isolated: 'ج', initial: 'جـ', medial: 'ـجـ', final: 'ـج' },
            vowels: ['جَ', 'جُ', 'جِ', 'جْ', 'جَا', 'جُو', 'جِي'],
            words: ['جَمَل', 'جَبَل', 'جِسْر'],
            tip: 'رأس الجيم يعلو سطر الأساس بمقدار بسيط، وبطنه الواسع يهبط تحت السطر بنصف دائرة ونقطته ببطنه.',
            startPoint: { x: 68, y: 48 },
            waypoints: [{ x: 68, y: 48 }, { x: 45, y: 48 }, { x: 58, y: 56 }, { x: 65, y: 72 }, { x: 40, y: 84 }, { x: 26, y: 70 }],
            direction: 'curve',
            svgPath: 'M 68 48 L 45 48 C 65 54 68 76 40 84 C 28 84 25 72 26 70',
            dots: [{ x: 45, y: 68 }]
        },
        {
            id: 'haa', char: 'ح', name: 'حاء', phoneme: 'حْ / حـ',
            type: 'below_line', connector: true,
            forms: { isolated: 'ح', initial: 'حـ', medial: 'ـحـ', final: 'ـح' },
            vowels: ['حَ', 'حُ', 'حِ', 'حْ', 'حَا', 'حُو', 'حِي'],
            words: ['حِصَان', 'حَلِيب', 'حَمَامَة'],
            tip: 'أخت الجيم تماماً لكنها خالية من النقط، ناصعة كالماء العذب الصافي.',
            startPoint: { x: 68, y: 48 },
            waypoints: [{ x: 68, y: 48 }, { x: 45, y: 48 }, { x: 58, y: 56 }, { x: 65, y: 72 }, { x: 40, y: 84 }, { x: 26, y: 70 }],
            direction: 'curve',
            svgPath: 'M 68 48 L 45 48 C 65 54 68 76 40 84 C 28 84 25 72 26 70'
        },
        {
            id: 'khaa', char: 'خ', name: 'خاء', phoneme: 'خْ / خـ',
            type: 'below_line', connector: true,
            forms: { isolated: 'خ', initial: 'خـ', medial: 'ـخـ', final: 'ـخ' },
            vowels: ['خَ', 'خُ', 'خِ', 'خْ', 'خَا', 'خُو', 'خِي'],
            words: ['خَرُوف', 'خُبْز', 'خِيَار'],
            tip: 'رأسها فوق السطر وبطنها تحته، ونقطتها تزهو فوق رأسها مباشرة.',
            startPoint: { x: 68, y: 48 },
            waypoints: [{ x: 68, y: 48 }, { x: 45, y: 48 }, { x: 58, y: 56 }, { x: 65, y: 72 }, { x: 40, y: 84 }, { x: 26, y: 70 }],
            direction: 'curve',
            svgPath: 'M 68 48 L 45 48 C 65 54 68 76 40 84 C 28 84 25 72 26 70',
            dots: [{ x: 52, y: 36 }]
        },
        {
            id: 'dal', char: 'د', name: 'دال', phoneme: 'دْ / دَ',
            type: 'on_line', connector: false,
            forms: { isolated: 'د', initial: 'د', medial: 'ـد', final: 'ـد' },
            vowels: ['دَ', 'دُ', 'دِ', 'دْ', 'دَا', 'دُو', 'دِي'],
            words: ['دَار', 'دَادَا', 'دُور'],
            tip: 'من الحروف الرافضة المستقرة؛ ضلع مائل ينحدر من خط الوسط، ثم خط أفقي يستقر فوق السطر.',
            startPoint: { x: 62, y: 50 },
            waypoints: [{ x: 62, y: 50 }, { x: 54, y: 64 }, { x: 34, y: 66 }],
            direction: 'curve-left',
            svgPath: 'M 62 50 Q 52 64 34 66'
        },
        {
            id: 'dhal', char: 'ذ', name: 'ذال', phoneme: 'ذْ / ذَ',
            type: 'on_line', connector: false,
            forms: { isolated: 'ذ', initial: 'ذ', medial: 'ـذ', final: 'ـذ' },
            vowels: ['ذَ', 'ذُ', 'ذِ', 'ذْ', 'ذَا', 'ذُو', 'ذِي'],
            words: ['ذُرَة', 'ذِئْب', 'أُسْتَاذ'],
            tip: 'أخت الدال الرافضة، تستقر على السطر وتعلوها نقطة واحدة في أعلاها.',
            startPoint: { x: 62, y: 50 },
            waypoints: [{ x: 62, y: 50 }, { x: 54, y: 64 }, { x: 34, y: 66 }],
            direction: 'curve-left',
            svgPath: 'M 62 50 Q 52 64 34 66',
            dots: [{ x: 58, y: 40 }]
        },
        {
            id: 'raa', char: 'ر', name: 'راء', phoneme: 'رْ / رَ',
            type: 'below_line', connector: false,
            forms: { isolated: 'ر', initial: 'ر', medial: 'ـر', final: 'ـر' },
            vowels: ['رَ', 'رُ', 'رِ', 'رْ', 'رَا', 'رُو', 'رِي'],
            words: ['رِيم', 'رِيف', 'رُمَّان'],
            tip: 'تشبه الزحليقة أو هلال القمر؛ جزء صغير فوق السطر ثم انحدار مقوس رشيق يهبط تحت السطر.',
            startPoint: { x: 58, y: 58 },
            waypoints: [{ x: 58, y: 58 }, { x: 54, y: 66 }, { x: 42, y: 78 }, { x: 32, y: 84 }],
            direction: 'down-curve',
            svgPath: 'M 58 58 Q 54 66 45 76 T 32 84'
        },
        {
            id: 'zaay', char: 'ز', name: 'زاي', phoneme: 'زْ / زَ',
            type: 'below_line', connector: false,
            forms: { isolated: 'ز', initial: 'ز', medial: 'ـز', final: 'ـز' },
            vowels: ['زَ', 'زُ', 'زِ', 'زْ', 'زَا', 'زُو', 'زِي'],
            words: ['زُهُور', 'زَيْتُون', 'زَوْرَق'],
            tip: 'شقيقة الراء الرافضة وتهبط تحت السطر كالهلال، ونقطتها تشع فوقها كنجمة لامعة.',
            startPoint: { x: 58, y: 58 },
            waypoints: [{ x: 58, y: 58 }, { x: 54, y: 66 }, { x: 42, y: 78 }, { x: 32, y: 84 }],
            direction: 'down-curve',
            svgPath: 'M 58 58 Q 54 66 45 76 T 32 84',
            dots: [{ x: 58, y: 46 }]
        },
        {
            id: 'seen', char: 'س', name: 'سين', phoneme: 'سْ / سـ',
            type: 'below_line', connector: true,
            forms: { isolated: 'س', initial: 'سـ', medial: 'ـسـ', final: 'ـس' },
            vowels: ['سَ', 'سُ', 'سِ', 'سْ', 'سَا', 'سُو', 'سِي'],
            words: ['سَمَكَة', 'سَيَّارَة', 'سَرِير'],
            tip: 'ثلاث أسنان رشيقة تستقر على السطر، يتبعها كأس نوني عميق يهبط تحت السطر ثم يصعد.',
            startPoint: { x: 74, y: 58 },
            waypoints: [{ x: 74, y: 58 }, { x: 66, y: 66 }, { x: 58, y: 66 }, { x: 50, y: 66 }, { x: 44, y: 78 }, { x: 28, y: 74 }],
            direction: 'rtl',
            svgPath: 'M 74 58 Q 70 66 66 66 L 58 66 Q 54 66 50 66 C 50 78 30 84 28 72'
        },
        {
            id: 'sheen', char: 'ش', name: 'شين', phoneme: 'شْ / شـ',
            type: 'below_line', connector: true,
            forms: { isolated: 'ش', initial: 'شـ', medial: 'ـشـ', final: 'ـش' },
            vowels: ['شَ', 'شُ', 'شِ', 'شْ', 'شَا', 'شُو', 'شِي'],
            words: ['شَمْس', 'شَجَرَة', 'شَاطِئ'],
            tip: 'ثلاث أسنان وكأس يهبط تحت السطر، وثلاث نقاط تضيء فوق أسنانها كالشمس.',
            startPoint: { x: 74, y: 58 },
            waypoints: [{ x: 74, y: 58 }, { x: 66, y: 66 }, { x: 58, y: 66 }, { x: 50, y: 66 }, { x: 44, y: 78 }, { x: 28, y: 74 }],
            direction: 'rtl',
            svgPath: 'M 74 58 Q 70 66 66 66 L 58 66 Q 54 66 50 66 C 50 78 30 84 28 72',
            dots: [{ x: 58, y: 47 }, { x: 66, y: 47 }, { x: 62, y: 39 }]
        },
        {
            id: 'saad', char: 'ص', name: 'صاد', phoneme: 'صْ / صـ',
            type: 'below_line', connector: true,
            forms: { isolated: 'ص', initial: 'صـ', medial: 'ـصـ', final: 'ـص' },
            vowels: ['صَ', 'صُ', 'صِ', 'صْ', 'صَا', 'صُو', 'صِي'],
            words: ['صَبَاح', 'صُنْدُوق', 'صَقْر'],
            tip: 'رأس بيضاوي مستقر، ثم سنة صغيرة قائمة، ثم كأس عميق ينزل تحت السطر كالنون.',
            startPoint: { x: 56, y: 66 },
            waypoints: [{ x: 56, y: 66 }, { x: 70, y: 56 }, { x: 50, y: 66 }, { x: 45, y: 58 }, { x: 40, y: 78 }, { x: 26, y: 72 }],
            direction: 'loop-left',
            svgPath: 'M 56 66 C 68 56 75 58 70 66 L 46 66 L 46 58 C 46 78 28 84 26 72'
        },
        {
            id: 'dhaad', char: 'ض', name: 'ضاد', phoneme: 'ضْ / ضـ',
            type: 'below_line', connector: true,
            forms: { isolated: 'ض', initial: 'ضـ', medial: 'ـضـ', final: 'ـض' },
            vowels: ['ضَ', 'ضُ', 'ضِ', 'ضْ', 'ضَا', 'ضُو', 'ضِي'],
            words: ['ضَوْء', 'ضِفْدَع', 'ضِرْس'],
            tip: 'شقيقة الصاد وحرف لغتنا الفريد، كأسها تحت السطر ونقطتها تعلو رأسها البيضاوي.',
            startPoint: { x: 56, y: 66 },
            waypoints: [{ x: 56, y: 66 }, { x: 70, y: 56 }, { x: 50, y: 66 }, { x: 45, y: 58 }, { x: 40, y: 78 }, { x: 26, y: 72 }],
            direction: 'loop-left',
            svgPath: 'M 56 66 C 68 56 75 58 70 66 L 46 66 L 46 58 C 46 78 28 84 26 72',
            dots: [{ x: 62, y: 44 }]
        },
        {
            id: 'taa_straight', char: 'ط', name: 'طاء', phoneme: 'طْ / طـ',
            type: 'on_line', connector: true,
            forms: { isolated: 'ط', initial: 'طـ', medial: 'ـطـ', final: 'ـط' },
            vowels: ['طَ', 'طُ', 'طِ', 'طْ', 'طَا', 'طُو', 'طِي'],
            words: ['طَيَّارَة', 'طَبِيب', 'طِفْل'],
            tip: 'حرف قوي يستقر على السطر تماماً دون نزول، وترتفع فيه ألف قائمة تنزل على رأس الطاء.',
            startPoint: { x: 55, y: 66 },
            waypoints: [{ x: 55, y: 66 }, { x: 72, y: 58 }, { x: 50, y: 66 }, { x: 28, y: 66 }],
            direction: 'loop-left',
            svgPath: 'M 55 66 C 68 56 74 58 68 66 L 28 66 M 52 24 L 52 66'
        },
        {
            id: 'dhaa', char: 'ظ', name: 'ظاء', phoneme: 'ظْ / ظـ',
            type: 'on_line', connector: true,
            forms: { isolated: 'ظ', initial: 'ظـ', medial: 'ـظـ', final: 'ـظ' },
            vowels: ['ظَ', 'ظُ', 'ظِ', 'ظْ', 'ظَا', 'ظُو', 'ظِي'],
            words: ['ظِلّ', 'ظَرْف', 'ظَافِر'],
            tip: 'تستقر على السطر كأختها الطاء، وتزينها ألف قائمة ونقطة ظاهرة على يمين الألف.',
            startPoint: { x: 55, y: 66 },
            waypoints: [{ x: 55, y: 66 }, { x: 72, y: 58 }, { x: 50, y: 66 }, { x: 28, y: 66 }],
            direction: 'loop-left',
            svgPath: 'M 55 66 C 68 56 74 58 68 66 L 28 66 M 52 24 L 52 66',
            dots: [{ x: 42, y: 44 }]
        },
        {
            id: 'ayn', char: 'ع', name: 'عين', phoneme: 'عْ / عـ',
            type: 'below_line', connector: true,
            forms: { isolated: 'ع', initial: 'عـ', medial: 'ـعـ', final: 'ـع' },
            vowels: ['عَ', 'عُ', 'عِ', 'عْ', 'عَا', 'عُو', 'عِي'],
            words: ['عَيْن', 'عُصْفُور', 'عِنَب'],
            tip: 'رأسها كحاجب العين فوق السطر (يشبه رقم 2 صغيراً)، وبطنها يهبط تحت السطر بنصف دائرة واسعة.',
            startPoint: { x: 64, y: 48 },
            waypoints: [{ x: 64, y: 48 }, { x: 50, y: 46 }, { x: 56, y: 62 }, { x: 64, y: 74 }, { x: 42, y: 84 }, { x: 26, y: 72 }],
            direction: 'curve',
            svgPath: 'M 64 48 C 64 42 50 42 52 56 L 56 62 C 68 66 66 84 40 84 C 28 84 25 72 26 70'
        },
        {
            id: 'ghayn', char: 'غ', name: 'غين', phoneme: 'غْ / غـ',
            type: 'below_line', connector: true,
            forms: { isolated: 'غ', initial: 'غـ', medial: 'ـغـ', final: 'ـغ' },
            vowels: ['غَ', 'غُ', 'غِ', 'غْ', 'غَا', 'غُو', 'غِي'],
            words: ['غَزَال', 'غُرَاب', 'غَيْمَة'],
            tip: 'حاجبها فوق السطر وبطنها تحته، وتتوج بنقطة واحدة فوق حاجبها الأنيق.',
            startPoint: { x: 64, y: 48 },
            waypoints: [{ x: 64, y: 48 }, { x: 50, y: 46 }, { x: 56, y: 62 }, { x: 64, y: 74 }, { x: 42, y: 84 }, { x: 26, y: 72 }],
            direction: 'curve',
            svgPath: 'M 64 48 C 64 42 50 42 52 56 L 56 62 C 68 66 66 84 40 84 C 28 84 25 72 26 70',
            dots: [{ x: 56, y: 34 }]
        },
        {
            id: 'faa', char: 'ف', name: 'فاء', phoneme: 'فْ / فـ',
            type: 'on_line', connector: true,
            forms: { isolated: 'ف', initial: 'فـ', medial: 'ـفـ', final: 'ـف' },
            vowels: ['فَ', 'فُ', 'فِ', 'فْ', 'فَا', 'فُو', 'فِي'],
            words: ['فِيل', 'فَرَاشَة', 'فَأْر'],
            tip: 'رأس دائري مستدير مع رقبة قصيرة تستقر على السطر كطبق الباء المنبسط.',
            startPoint: { x: 64, y: 55 },
            waypoints: [{ x: 64, y: 55 }, { x: 74, y: 50 }, { x: 64, y: 66 }, { x: 26, y: 66 }, { x: 26, y: 56 }],
            direction: 'loop-left',
            svgPath: 'M 64 55 C 72 48 76 58 64 66 L 33 66 Q 26 66 26 56',
            dots: [{ x: 66, y: 40 }]
        },
        {
            id: 'qaaf', char: 'ق', name: 'قاف', phoneme: 'قْ / قـ',
            type: 'below_line', connector: true,
            forms: { isolated: 'ق', initial: 'قـ', medial: 'ـقـ', final: 'ـق' },
            vowels: ['قَ', 'قُ', 'قِ', 'قْ', 'قَا', 'قُو', 'قِي'],
            words: ['قَلَم', 'قِرَاءَتِي', 'قِطَّة'],
            tip: 'رأس مستدير وكأس عميق كالنون يهبط تحت السطر تماماً، وتعلوها نقطتان.',
            startPoint: { x: 64, y: 55 },
            waypoints: [{ x: 64, y: 55 }, { x: 74, y: 50 }, { x: 64, y: 66 }, { x: 50, y: 78 }, { x: 28, y: 72 }],
            direction: 'loop-left',
            svgPath: 'M 64 55 C 72 48 76 58 64 66 C 64 78 32 84 28 70',
            dots: [{ x: 62, y: 38 }, { x: 70, y: 38 }]
        },
        {
            id: 'kaaf', char: 'ك', name: 'كاف', phoneme: 'كْ / كـ',
            type: 'on_line', connector: true,
            forms: { isolated: 'ك', initial: 'كـ', medial: 'ـكـ', final: 'ـك' },
            vowels: ['كَ', 'كُ', 'كِ', 'كْ', 'كَا', 'كُو', 'كِي'],
            words: ['كِتَاب', 'كُرَة', 'كَلْب'],
            tip: 'قائمة طويلة كالألف تستقر على السطر وتنبسط، وفي وسطها شارة الكاف (همزة لطيفة).',
            startPoint: { x: 68, y: 24 },
            waypoints: [{ x: 68, y: 24 }, { x: 68, y: 66 }, { x: 28, y: 66 }, { x: 28, y: 56 }],
            direction: 'down-left',
            svgPath: 'M 68 24 L 68 66 L 34 66 Q 28 66 28 56 M 52 48 Q 46 44 48 40'
        },
        {
            id: 'laam', char: 'ل', name: 'لام', phoneme: 'لْ / لـ',
            type: 'below_line', connector: true,
            forms: { isolated: 'ل', initial: 'لـ', medial: 'ـلـ', final: 'ـل' },
            vowels: ['لَ', 'لُ', 'لِ', 'لْ', 'لَا', 'لُو', 'لِي'],
            words: ['لَبَن', 'لَيْمُون', 'لَعِبَ'],
            tip: 'عصا طويلة كالألف تهبط وتصنع كأساً مقوساً تحت السطر تشبه يد المظلة المقلوبة.',
            startPoint: { x: 62, y: 24 },
            waypoints: [{ x: 62, y: 24 }, { x: 62, y: 66 }, { x: 48, y: 80 }, { x: 30, y: 72 }],
            direction: 'down-curve',
            svgPath: 'M 62 24 L 62 66 C 62 82 32 82 30 68'
        },
        {
            id: 'meem', char: 'م', name: 'ميم', phoneme: 'مْ / مـ',
            type: 'below_line', connector: true,
            forms: { isolated: 'م', initial: 'مـ', medial: 'ـمـ', final: 'ـم' },
            vowels: ['مَ', 'مُ', 'مِ', 'مْ', 'مَا', 'مُو', 'مِي'],
            words: ['مَامَا', 'مَدْرَسَتِي', 'مَاء'],
            tip: 'رأس مستدير لطيف يستقر على السطر، يليه خط هابط مستقيم ينزل تحت السطر كالخنجر.',
            startPoint: { x: 62, y: 60 },
            waypoints: [{ x: 62, y: 60 }, { x: 50, y: 55 }, { x: 44, y: 66 }, { x: 44, y: 88 }],
            direction: 'loop-down',
            svgPath: 'M 62 60 C 62 54 50 54 50 66 L 44 66 L 44 88'
        },
        {
            id: 'noon', char: 'ن', name: 'نون', phoneme: 'نْ / نـ',
            type: 'below_line', connector: true,
            forms: { isolated: 'ن', initial: 'نـ', medial: 'ـنـ', final: 'ـن' },
            vowels: ['نَ', 'نُ', 'نِ', 'نْ', 'نَا', 'نُو', 'نِي'],
            words: ['نُور', 'نَامَ', 'نَجْمَة'],
            tip: 'كأس هلالي نصف دائري عميق ينزل تحت السطر، ونقطته في وسطه كحبة اللؤلؤ في المحارة.',
            startPoint: { x: 68, y: 56 },
            waypoints: [{ x: 68, y: 56 }, { x: 65, y: 72 }, { x: 48, y: 82 }, { x: 28, y: 70 }],
            direction: 'curve-up',
            svgPath: 'M 68 56 C 68 84 30 84 28 64',
            dots: [{ x: 48, y: 60 }]
        },
        {
            id: 'haa_alone', char: 'هـ', name: 'هاء', phoneme: 'هْ / هـ',
            type: 'on_line', connector: true,
            forms: { isolated: 'ه', initial: 'هـ', medial: 'ـهـ', final: 'ـه' },
            vowels: ['هَ', 'هُ', 'هِ', 'هْ', 'هَا', 'هُو', 'هِي'],
            words: ['هِلَال', 'هَدِيَّة', 'هُدْهُد'],
            tip: 'دائرة كبرى خارجية تستقر على السطر، وفي بطنها دائرة صغرى كالفراشة.',
            startPoint: { x: 66, y: 55 },
            waypoints: [{ x: 66, y: 55 }, { x: 50, y: 48 }, { x: 40, y: 66 }, { x: 28, y: 66 }],
            direction: 'loop-left',
            svgPath: 'M 66 55 C 66 45 46 45 46 66 L 28 66 M 58 58 C 58 52 50 52 50 62'
        },
        {
            id: 'waaw', char: 'و', name: 'واو', phoneme: 'و / وْ',
            type: 'below_line', connector: false,
            forms: { isolated: 'و', initial: 'و', medial: 'ـو', final: 'ـو' },
            vowels: ['وَ', 'وُ', 'وِ', 'وْ', 'وَا', 'وُو', 'وِي'],
            words: ['وَرْد', 'وَادِي', 'وَلَد'],
            tip: 'رأس مستدير كالقاف يستقر على السطر، وجسم هلالي ينحدر تحت السطر كالراء.',
            startPoint: { x: 62, y: 58 },
            waypoints: [{ x: 62, y: 58 }, { x: 70, y: 54 }, { x: 60, y: 66 }, { x: 44, y: 78 }, { x: 32, y: 84 }],
            direction: 'loop-down',
            svgPath: 'M 62 58 C 68 52 74 60 62 66 Q 52 74 34 84'
        },
        {
            id: 'yaa', char: 'ي', name: 'ياء', phoneme: 'يْ / يـ',
            type: 'below_line', connector: true,
            forms: { isolated: 'ي', initial: 'يـ', medial: 'ـيـ', final: 'ـي' },
            vowels: ['يَ', 'يُ', 'يِ', 'يْ', 'يَا', 'يُو', 'يِي'],
            words: ['يَد', 'يَمَامَة', 'يَقِين'],
            tip: 'تشبه البطة السابحة؛ رأسها المقوس فوق السطر، وجسمها المقوس الأملس يهبط تحت السطر.',
            startPoint: { x: 64, y: 52 },
            waypoints: [{ x: 64, y: 52 }, { x: 52, y: 50 }, { x: 60, y: 64 }, { x: 48, y: 80 }, { x: 26, y: 74 }],
            direction: 's-curve',
            svgPath: 'M 64 52 C 54 48 54 58 60 64 C 60 78 30 84 26 72',
            dots: [{ x: 44, y: 88 }, { x: 52, y: 88 }]
        }
    ];

    // بنك الكلمات المنهجية للتدريب الحر
    const CURRICULUM_WORDS_BANK = [
        { word: 'دَار', unit: 'unit1', desc: 'دار - بيت الأسرة' },
        { word: 'دَادَا', unit: 'unit1', desc: 'دادا - الطفل الصغير' },
        { word: 'دُور', unit: 'unit1', desc: 'دور - جمع دار' },
        { word: 'بَاب', unit: 'unit1', desc: 'باب - مدخل البيت' },
        { word: 'بَابَا', unit: 'unit1', desc: 'بابا - الأب الحنون' },
        { word: 'بَان', unit: 'unit1', desc: 'بان - اسم علم' },
        { word: 'نُور', unit: 'unit1', desc: 'نور - الضياء والاسم' },
        { word: 'نَامَ', unit: 'unit1', desc: 'نام - فعل ماضٍ' },
        { word: 'مَامَا', unit: 'unit1', desc: 'ماما - الأم الحبيبة' },
        { word: 'رِيم', unit: 'unit1', desc: 'ريم - الغزال الناصع' },
        { word: 'مِيزَان', unit: 'unit1', desc: 'ميزان - أداة الوزن' },
        { word: 'وَرْد', unit: 'unit2', desc: 'ورد - زهور الربيع' },
        { word: 'وَادِي', unit: 'unit2', desc: 'وادي - مجرى الماء' },
        { word: 'رِيف', unit: 'unit2', desc: 'ريف - الطبيعة الخلابة' },
        { word: 'بَقَر', unit: 'unit2', desc: 'بقر - من أنعام الريف' },
        { word: 'فَقِير', unit: 'unit2', desc: 'فقير - درس ريف مناف' },
        { word: 'قِرَاءَتِي', unit: 'unit2', desc: 'قراءتي - عنوان كتابنا' },
        { word: 'طَيَّارَة', unit: 'unit3', desc: 'طيارة - طيارة وقاص' },
        { word: 'بَطّ', unit: 'unit3', desc: 'بط - بط وطيور' },
        { word: 'بُلْبُل', unit: 'unit3', desc: 'بلبل - طائر مغرد' },
        { word: 'عُصْفُور', unit: 'unit3', desc: 'عصفور - عصفور جميل' },
        { word: 'مَاء', unit: 'unit4', desc: 'ماء - سر الحياة' },
        { word: 'لَبَن', unit: 'unit4', desc: 'لبن - صحة وقوة' },
        { word: 'تَمْر', unit: 'unit4', desc: 'تمر - غذاء بركة' },
        { word: 'هِلَال', unit: 'unit5', desc: 'هلال - هلال العيد' },
        { word: 'عِيد', unit: 'unit5', desc: 'عيد - فرحة الأطفال' },
        { word: 'مَدْرَسَتِي', unit: 'unit6', desc: 'مدرستي - بيتي الثاني' }
    ];

    // ==========================================================================
    // 2. حالة السبورة والمتحكم العام (State Management)
    // ==========================================================================
    const BlackboardState = {
        activeTab: 'trace', // 'trace' | 'anatomy' | 'freehand' | 'print'
        activeLetterId: 'alif',
        activeLetterForm: 'isolated',
        activeVowel: '',
        boardTheme: 'theme-green', // 'theme-green' | 'theme-black' | 'theme-lined'
        chalkColor: '#ffffff',
        strokeSize: 8,
        brushType: 'chalk', // 'chalk' | 'pen' | 'calligraphy' | 'rainbow'
        guideOpacity: 0.85,
        isDrawing: false,
        lastPoint: null,
        userStrokePoints: [],
        undoStack: [],
        isAutoPlaying: false,
        rainbowHue: 0,
        activeWord: 'دَار'
    };

    // عناصر الكانفاس والمحاور
    let traceCanvas = null;
    let traceCtx = null;
    let guideCanvas = null;
    let guideCtx = null;
    let gridCanvas = null;
    let gridCtx = null;

    let freehandCanvas = null;
    let freehandCtx = null;
    let freehandGridCanvas = null;
    let freehandGridCtx = null;

    // ==========================================================================
    // 3. محرك الصوتيات التوليدي (Web Audio Synthesizer)
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

    // صوت طباشير ناعم عند الرسم
    function playChalkSound() {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(140 + Math.random() * 40, ctx.currentTime);

            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(800 + Math.random() * 400, ctx.currentTime);
            filter.Q.setValueAtTime(3, ctx.currentTime);

            gain.gain.setValueAtTime(0.015, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.06);
        } catch (e) { }
    }

    // نغمة نجمة الإنجاز الاحتفالية
    function playStarSound(starIndex) {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
            const freq = freqs[starIndex] || 783.99;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);

            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.4);
        } catch (e) { }
    }

    // نغمة تنبيه الاتجاه المعاكس
    function playWarningSound() {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(220, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.2);

            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.25);
        } catch (e) { }
    }

    // ==========================================================================
    // 4. فتح وإغلاق النافذة المنبثقة للسبورة والتبديل بين التبويبات
    // ==========================================================================
    window.openBlackboardModal = function (initialTab = 'trace') {
        const modal = document.getElementById('blackboardModal');
        if (!modal) return;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        switchBlackboardTab(initialTab);

        // تهيئة الكانفاس بعد اكتمال العرض
        setTimeout(() => {
            initTraceCanvases();
            initFreehandCanvases();
            renderLetterSelector();
            selectLetter(BlackboardState.activeLetterId);
            renderAnatomyTab();
            renderFreehandWords();
            renderPrintSheets();
        }, 50);
    };

    window.closeBlackboardModal = function () {
        const modal = document.getElementById('blackboardModal');
        if (!modal) return;
        modal.style.display = 'none';
        document.body.style.overflow = '';
    };

    window.switchBlackboardTab = function (tabKey) {
        BlackboardState.activeTab = tabKey;
        const tabs = ['trace', 'anatomy', 'freehand', 'print'];

        tabs.forEach(t => {
            const tabBtn = document.getElementById(`tabBlackboard_${t}`);
            const pane = document.getElementById(`paneBlackboard_${t}`);
            if (tabBtn) tabBtn.classList.toggle('active', t === tabKey);
            if (pane) pane.classList.toggle('active', t === tabKey);
        });

        // إعادة ضبط أبعاد الكانفاس عند الانتقال لتبويب سبورة
        if (tabKey === 'trace') {
            setTimeout(resizeTraceCanvases, 50);
        } else if (tabKey === 'freehand') {
            setTimeout(resizeFreehandCanvases, 50);
        }
    };

    // ==========================================================================
    // 5. تهيئة الكانفاس وشبكة السطور الأربعة لخط النسخ
    // ==========================================================================
    function initTraceCanvases() {
        const container = document.getElementById('bbCanvasContainer');
        if (!container) return;

        gridCanvas = document.getElementById('bbGridCanvas');
        guideCanvas = document.getElementById('bbGuideCanvas');
        traceCanvas = document.getElementById('bbDrawingCanvas');

        if (!gridCanvas || !guideCanvas || !traceCanvas) return;

        gridCtx = gridCanvas.getContext('2d');
        guideCtx = guideCanvas.getContext('2d');
        traceCtx = traceCanvas.getContext('2d');

        resizeTraceCanvases();
        attachDrawingEvents(traceCanvas, traceCtx, true);

        window.addEventListener('resize', debounce(resizeTraceCanvases, 150));
    }

    function resizeTraceCanvases() {
        const container = document.getElementById('bbCanvasContainer');
        if (!container || !gridCanvas || !guideCanvas || !traceCanvas) return;

        const rect = container.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        const dpr = window.devicePixelRatio || 1;
        const w = rect.width;
        const h = rect.height;

        [gridCanvas, guideCanvas, traceCanvas].forEach(c => {
            c.width = w * dpr;
            c.height = h * dpr;
            c.style.width = `${w}px`;
            c.style.height = `${h}px`;
            const ctx = c.getContext('2d');
            ctx.resetTransform?.();
            ctx.scale(dpr, dpr);
        });

        drawCalligraphyGrid(gridCtx, w, h);
        drawLetterGuide();
        redrawUserStrokes();
    }

    // رسم السطور الأربعة المعتمدة لخط النسخ
    function drawCalligraphyGrid(ctx, w, h) {
        ctx.clearRect(0, 0, w, h);

        const ascenderY = h * 0.22;
        const midlineY = h * 0.44;
        const baselineY = h * 0.66;
        const descenderY = h * 0.86;

        ctx.save();

        // 1. خط القمة / الصعود (منقط خفيف)
        ctx.strokeStyle = 'rgba(167, 243, 208, 0.45)';
        ctx.setLineDash([4, 6]);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(10, ascenderY);
        ctx.lineTo(w - 10, ascenderY);
        ctx.stroke();

        // تسمية خط القمة
        ctx.fillStyle = 'rgba(167, 243, 208, 0.6)';
        ctx.font = '11px Tajawal, sans-serif';
        ctx.fillText('خط الصعود (أ، ل، ط)', 14, ascenderY - 4);

        // 2. خط الوسط (منقط ناعم)
        ctx.strokeStyle = 'rgba(253, 230, 138, 0.5)';
        ctx.setLineDash([3, 5]);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(10, midlineY);
        ctx.lineTo(w - 10, midlineY);
        ctx.stroke();

        ctx.fillStyle = 'rgba(253, 230, 138, 0.65)';
        ctx.fillText('خط الوسط (ارتفاع الرؤوس والأسنان)', 14, midlineY - 4);

        // 3. خط الأساس (سطر الكتابة الرئيسي - عريض وواضح بلون مميز)
        ctx.strokeStyle = '#ef4444';
        ctx.setLineDash([]);
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(10, baselineY);
        ctx.lineTo(w - 10, baselineY);
        ctx.stroke();

        ctx.fillStyle = '#fca5a5';
        ctx.font = 'bold 12px Tajawal, sans-serif';
        ctx.fillText('سطر الكتابة الأساسي (استقرار الحروف) ـــــــــــــ', 14, baselineY + 16);

        // 4. خط القاع / الهبوط (منقط خفيف)
        ctx.strokeStyle = 'rgba(196, 181, 253, 0.45)';
        ctx.setLineDash([4, 6]);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(10, descenderY);
        ctx.lineTo(w - 10, descenderY);
        ctx.stroke();

        ctx.fillStyle = 'rgba(196, 181, 253, 0.6)';
        ctx.fillText('خط الهبوط (نزول الراء والنون والميم)', 14, descenderY + 14);

        ctx.restore();
    }

    // ==========================================================================
    // 6. رسم المرشد المنقط للحرف ونقاط البداية والتوجيه
    // ==========================================================================
    function drawLetterGuide() {
        if (!guideCtx || !guideCanvas) return;
        const w = guideCanvas.width / (window.devicePixelRatio || 1);
        const h = guideCanvas.height / (window.devicePixelRatio || 1);

        guideCtx.clearRect(0, 0, w, h);

        const letter = getActiveLetter();
        if (!letter) return;

        guideCtx.save();
        guideCtx.globalAlpha = BlackboardState.guideOpacity;

        // رسم الحرف كخط منقط كبير في خلفية السبورة
        const displayChar = getDisplayChar(letter);
        const baselineY = h * 0.66;

        guideCtx.font = `bold ${h * 0.52}px "Tajawal", "Traditional Arabic", serif`;
        guideCtx.textAlign = 'center';
        guideCtx.textBaseline = 'alphabetic';

        // ظل منقط للحرف
        guideCtx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        guideCtx.lineWidth = 3;
        guideCtx.setLineDash([6, 8]);
        guideCtx.strokeText(displayChar, w * 0.5, baselineY);

        guideCtx.fillStyle = 'rgba(255, 255, 255, 0.12)';
        guideCtx.fillText(displayChar, w * 0.5, baselineY);

        // رسم نقاط التوجيه والأسهم للحرف المحدد
        if (letter.startPoint) {
            const spX = (letter.startPoint.x / 100) * w;
            const spY = (letter.startPoint.y / 100) * h;

            // نقطة البداية الخضراء النابضة 🟢
            guideCtx.setLineDash([]);
            guideCtx.fillStyle = '#10b981';
            guideCtx.beginPath();
            guideCtx.arc(spX, spY, 14, 0, Math.PI * 2);
            guideCtx.fill();
            guideCtx.strokeStyle = '#ffffff';
            guideCtx.lineWidth = 3;
            guideCtx.stroke();

            // رقم 1 داخل نقطة البداية
            guideCtx.fillStyle = '#ffffff';
            guideCtx.font = 'bold 12px Tajawal, sans-serif';
            guideCtx.textAlign = 'center';
            guideCtx.textBaseline = 'middle';
            guideCtx.fillText('1', spX, spY);

            // وسم نصي توجيهي "ابدأ من هنا ✍️"
            guideCtx.fillStyle = '#34d399';
            guideCtx.font = 'bold 11px Tajawal, sans-serif';
            guideCtx.fillText('ابدأ من هنا 🟢', spX, spY - 22);
        }

        // رسم نقاط التوجيه الفرعية (Waypoints) إن وجدت
        if (letter.waypoints && letter.waypoints.length > 2) {
            letter.waypoints.slice(1, -1).forEach((pt, idx) => {
                const ptX = (pt.x / 100) * w;
                const ptY = (pt.y / 100) * h;

                guideCtx.fillStyle = '#f59e0b';
                guideCtx.beginPath();
                guideCtx.arc(ptX, ptY, 8, 0, Math.PI * 2);
                guideCtx.fill();
                guideCtx.strokeStyle = '#ffffff';
                guideCtx.lineWidth = 2;
                guideCtx.stroke();

                guideCtx.fillStyle = '#ffffff';
                guideCtx.font = 'bold 9px Tajawal, sans-serif';
                guideCtx.fillText(`${idx + 2}`, ptX, ptY);
            });
        }

        guideCtx.restore();
    }

    function getDisplayChar(letter) {
        if (!letter) return '';
        let char = letter.char;
        if (BlackboardState.activeLetterForm && letter.forms) {
            char = letter.forms[BlackboardState.activeLetterForm] || letter.char;
        }
        if (BlackboardState.activeVowel) {
            char = char + BlackboardState.activeVowel;
        }
        return char;
    }

    // ==========================================================================
    // 7. محرك الرسم والتفاعل الحسي (Drawing & Pointer Handling)
    // ==========================================================================
    function attachDrawingEvents(canvas, ctx, isTraceMode = true) {
        canvas.addEventListener('pointerdown', (e) => onPointerDown(e, canvas, ctx, isTraceMode));
        canvas.addEventListener('pointermove', (e) => onPointerMove(e, canvas, ctx, isTraceMode));
        canvas.addEventListener('pointerup', (e) => onPointerUp(e, canvas, ctx, isTraceMode));
        canvas.addEventListener('pointercancel', (e) => onPointerUp(e, canvas, ctx, isTraceMode));
    }

    function getCanvasCoords(e, canvas) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            pressure: e.pressure || 0.5
        };
    }

    function onPointerDown(e, canvas, ctx, isTraceMode) {
        canvas.setPointerCapture(e.pointerId);
        BlackboardState.isDrawing = true;
        const pt = getCanvasCoords(e, canvas);
        BlackboardState.lastPoint = pt;

        if (isTraceMode) {
            BlackboardState.userStrokePoints = [pt];
            saveUndoState();
            checkStartingDirection(pt, canvas);
        }

        playChalkSound();
        drawStrokeSegment(ctx, pt, pt, BlackboardState.strokeSize);
    }

    function onPointerMove(e, canvas, ctx, isTraceMode) {
        if (!BlackboardState.isDrawing) return;
        const pt = getCanvasCoords(e, canvas);

        if (isTraceMode) {
            BlackboardState.userStrokePoints.push(pt);
            // فحص الاتجاه في الوقت الحقيقي
            realtimeDirectionCheck(canvas);
        }

        // حساب سماكة القلم بناءً على نوع الفرشاة
        let size = BlackboardState.strokeSize;
        if (BlackboardState.brushType === 'calligraphy') {
            // محاكاة قلم الخط المشطوف: يتغير العرض حسب زاوية الحركة
            const dx = pt.x - BlackboardState.lastPoint.x;
            const dy = pt.y - BlackboardState.lastPoint.y;
            const angle = Math.atan2(dy, dx);
            size = BlackboardState.strokeSize * (0.4 + 0.6 * Math.abs(Math.sin(angle - Math.PI / 4)));
        }

        drawStrokeSegment(ctx, BlackboardState.lastPoint, pt, size);
        BlackboardState.lastPoint = pt;

        // تشغيل صوت طباشيري خفيف أثناء السحب
        if (Math.random() < 0.25) playChalkSound();
    }

    function onPointerUp(e, canvas, ctx, isTraceMode) {
        if (!BlackboardState.isDrawing) return;
        BlackboardState.isDrawing = false;
        try { canvas.releasePointerCapture(e.pointerId); } catch (err) { }

        if (isTraceMode) {
            evaluateUserStroke(canvas);
        }
    }

    function drawStrokeSegment(ctx, fromPt, toPt, size) {
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = size;

        let strokeColor = BlackboardState.chalkColor;
        if (BlackboardState.brushType === 'rainbow') {
            BlackboardState.rainbowHue = (BlackboardState.rainbowHue + 4) % 360;
            strokeColor = `hsl(${BlackboardState.rainbowHue}, 90%, 65%)`;
        }

        ctx.strokeStyle = strokeColor;

        ctx.beginPath();
        ctx.moveTo(fromPt.x, fromPt.y);
        ctx.lineTo(toPt.x, toPt.y);
        ctx.stroke();

        ctx.restore();
    }

    function saveUndoState() {
        if (!traceCanvas) return;
        try {
            const data = traceCanvas.toDataURL();
            BlackboardState.undoStack.push(data);
            if (BlackboardState.undoStack.length > 10) BlackboardState.undoStack.shift();
        } catch (e) { }
    }

    window.undoStroke = function () {
        if (BlackboardState.undoStack.length === 0 || !traceCtx || !traceCanvas) return;
        const lastImgData = BlackboardState.undoStack.pop();
        const img = new Image();
        img.onload = () => {
            const w = traceCanvas.width / (window.devicePixelRatio || 1);
            const h = traceCanvas.height / (window.devicePixelRatio || 1);
            traceCtx.clearRect(0, 0, w, h);
            traceCtx.drawImage(img, 0, 0, w, h);
        };
        img.src = lastImgData;
    };

    window.clearBlackboard = function () {
        if (!traceCtx || !traceCanvas) return;
        saveUndoState();
        const w = traceCanvas.width / (window.devicePixelRatio || 1);
        const h = traceCanvas.height / (window.devicePixelRatio || 1);
        traceCtx.clearRect(0, 0, w, h);
        BlackboardState.userStrokePoints = [];
        hideEvaluationOverlay();
        hideDirectionWarning();
    };

    function redrawUserStrokes() {
        // إذا كان هناك صورة مخزنة يعيد رسمها
    }

    // ==========================================================================
    // 8. خوارزمية التصحيح الذكي لمسار الكتابة والتحقق من الاتجاه (AI Path Correction)
    // ==========================================================================
    function checkStartingDirection(firstPt, canvas) {
        const letter = getActiveLetter();
        if (!letter || !letter.startPoint) return;

        const w = canvas.width / (window.devicePixelRatio || 1);
        const h = canvas.height / (window.devicePixelRatio || 1);

        const idealStartX = (letter.startPoint.x / 100) * w;
        const idealStartY = (letter.startPoint.y / 100) * h;

        const dist = Math.hypot(firstPt.x - idealStartX, firstPt.y - idealStartY);

        // إذا بدأ بعيداً جداً عن النقطة الخضراء
        if (dist > w * 0.28) {
            showDirectionWarning(`⚠️ انتبه يا بطل: ابدأ دائماً من النقطة الخضراء 🟢 بالأعلى!`);
            playWarningSound();
        }
    }

    function realtimeDirectionCheck(canvas) {
        const letter = getActiveLetter();
        if (!letter || BlackboardState.userStrokePoints.length < 15) return;

        const pts = BlackboardState.userStrokePoints;
        const p1 = pts[0];
        const pLast = pts[pts.length - 1];

        // تحقق من الاتجاه المعاكس
        if (letter.direction === 'down' && (pLast.y < p1.y - 40)) {
            showDirectionWarning(`⚠️ اتجاه خاطئ: حرف ${letter.name} يُكتب من الأعلى إلى الأسفل ⬇️`);
            playWarningSound();
        } else if (letter.direction === 'rtl' && (pLast.x > p1.x + 50)) {
            showDirectionWarning(`⚠️ انتبه: الكتابة باللغة العربية تبدأ من اليمين نحو اليسار ⬅️`);
            playWarningSound();
        }
    }

    function evaluateUserStroke(canvas) {
        const pts = BlackboardState.userStrokePoints;
        if (pts.length < 10) return;

        const letter = getActiveLetter();
        if (!letter) return;

        const w = canvas.width / (window.devicePixelRatio || 1);
        const h = canvas.height / (window.devicePixelRatio || 1);

        // فحص نسبة تغطية محطات الحرف (Waypoints Coverage)
        let visitedWaypoints = 0;
        const waypoints = letter.waypoints || [letter.startPoint];

        waypoints.forEach(wp => {
            const wpX = (wp.x / 100) * w;
            const wpY = (wp.y / 100) * h;
            const minDistance = Math.min(...pts.map(p => Math.hypot(p.x - wpX, p.y - wpY)));
            if (minDistance < w * 0.16) {
                visitedWaypoints++;
            }
        });

        const coverageRate = visitedWaypoints / waypoints.length;
        let score = Math.round(coverageRate * 100);

        // احتساب النجوم والرسالة التقييمية
        let stars = '⭐';
        let feedback = '';
        let starCount = 1;

        if (score >= 80) {
            stars = '⭐⭐⭐';
            feedback = `رائع ومبهر يا بطل! 🌟 كتبت حرف (${letter.name}) ببراعة وإتقان تام لخط النسخ.`;
            starCount = 3;
            score = Math.min(100, score + 10);
            if (window.mascotCelebrates) window.mascotCelebrates();
        } else if (score >= 60) {
            stars = '⭐⭐';
            feedback = `أحسنت بني! رسم جميل ومسار طيب، ركز أكثر على البقاء على سطر الأساس.`;
            starCount = 2;
        } else {
            stars = '⭐';
            feedback = `محاولة شجاعة! حاول مرة أخرى واتبع الأسهم والنقاط من 1 إلى 2.`;
            starCount = 1;
        }

        // تشغيل نغمة النجوم
        for (let i = 0; i < starCount; i++) {
            setTimeout(() => playStarSound(i), i * 160);
        }

        showEvaluationOverlay(stars, score, feedback);
    }

    function showEvaluationOverlay(stars, score, feedback) {
        const overlay = document.getElementById('bbEvaluationOverlay');
        const starsEl = document.getElementById('bbEvalStars');
        const scoreEl = document.getElementById('bbEvalScore');
        const msgEl = document.getElementById('bbEvalFeedbackMsg');

        if (!overlay || !starsEl || !scoreEl || !msgEl) return;

        starsEl.innerText = stars;
        scoreEl.innerText = `الدقة: ${score}%`;
        msgEl.innerText = feedback;

        overlay.classList.add('show');
    }

    window.hideEvaluationOverlay = function () {
        const overlay = document.getElementById('bbEvaluationOverlay');
        if (overlay) overlay.classList.remove('show');
    };

    function showDirectionWarning(text) {
        const pill = document.getElementById('bbDirectionWarning');
        if (!pill) return;
        pill.innerText = text;
        pill.classList.add('show');
        clearTimeout(pill._timer);
        pill._timer = setTimeout(() => {
            pill.classList.remove('show');
        }, 3200);
    }

    function hideDirectionWarning() {
        const pill = document.getElementById('bbDirectionWarning');
        if (pill) pill.classList.remove('show');
    }

    // ==========================================================================
    // 9. المحاكاة التلقائية لحركة القلم واليد الذكية (Auto-Demo)
    // ==========================================================================
    window.startAutoDemo = function () {
        if (BlackboardState.isAutoPlaying) return;
        const letter = getActiveLetter();
        if (!letter || !letter.waypoints || !traceCtx || !traceCanvas) return;

        BlackboardState.isAutoPlaying = true;
        clearBlackboard();

        const handEl = document.getElementById('bbVirtualHand');
        if (handEl) handEl.style.display = 'block';

        const w = traceCanvas.width / (window.devicePixelRatio || 1);
        const h = traceCanvas.height / (window.devicePixelRatio || 1);

        const pts = letter.waypoints.map(wp => ({
            x: (wp.x / 100) * w,
            y: (wp.y / 100) * h
        }));

        let step = 0;
        const totalSteps = 60;
        let lastPt = pts[0];

        function animateStroke() {
            if (step >= totalSteps || !BlackboardState.isAutoPlaying) {
                BlackboardState.isAutoPlaying = false;
                if (handEl) handEl.style.display = 'none';
                return;
            }

            const t = step / totalSteps;
            // استيفاء مسار بيزير أو خطوط
            const idx = Math.min(pts.length - 2, Math.floor(t * (pts.length - 1)));
            const subT = (t * (pts.length - 1)) - idx;
            const pA = pts[idx];
            const pB = pts[idx + 1] || pA;

            const curX = pA.x + (pB.x - pA.x) * subT;
            const curY = pA.y + (pB.y - pA.y) * subT;

            drawStrokeSegment(traceCtx, lastPt, { x: curX, y: curY }, 10);
            lastPt = { x: curX, y: curY };

            if (handEl) {
                handEl.style.left = `${curX}px`;
                handEl.style.top = `${curY}px`;
            }

            step++;
            requestAnimationFrame(animateStroke);
        }

        animateStroke();
    };

    // ==========================================================================
    // 10. تشغيل نطق الحرف بصوت المعلمة الفصيح
    // ==========================================================================
    window.speakLetterSound = function () {
        const letter = getActiveLetter();
        if (!letter) return;

        const textToSpeak = `حرف ${letter.name}. صوته: ${letter.phoneme}. مثل: ${letter.words[0] || ''}`;

        if (window.mascotSpeak) {
            window.mascotSpeak(textToSpeak, letter.audioKey || null);
        } else if ('speechSynthesis' in window) {
            const utter = new SpeechSynthesisUtterance(textToSpeak);
            utter.lang = 'ar-SA';
            utter.rate = 0.85;
            window.speechSynthesis.speak(utter);
        }
    };

    // ==========================================================================
    // 11. تبديل سمة السبورة وألوان الطباشير وسماكة القلم
    // ==========================================================================
    window.setBoardTheme = function (themeKey) {
        BlackboardState.boardTheme = themeKey;
        const board = document.getElementById('bbBoardFrame');
        if (!board) return;
        board.className = `bb-board-frame ${themeKey}`;

        // إعادة رسم الشبكة والخطوط لتتناسب مع السمة
        resizeTraceCanvases();
    };

    window.setChalkColor = function (colorHex, btnEl) {
        BlackboardState.brushType = (colorHex === 'rainbow') ? 'rainbow' : 'chalk';
        BlackboardState.chalkColor = colorHex === 'rainbow' ? '#ffffff' : colorHex;

        document.querySelectorAll('.bb-chalk-color-btn').forEach(b => b.classList.remove('active'));
        if (btnEl) btnEl.classList.add('active');
    };

    window.setStrokeSize = function (sizeNum, btnEl) {
        BlackboardState.strokeSize = sizeNum;
        document.querySelectorAll('.bb-stroke-size-btn').forEach(b => b.classList.remove('active'));
        if (btnEl) btnEl.classList.add('active');
    };

    window.setBrushType = function (typeKey) {
        BlackboardState.brushType = typeKey;
    };

    window.setGuideOpacity = function (opacityVal) {
        BlackboardState.guideOpacity = parseFloat(opacityVal);
        drawLetterGuide();
    };

    // ==========================================================================
    // 12. شريط اختيار الحروف والمواضع والحركات
    // ==========================================================================
    function renderLetterSelector() {
        const container = document.getElementById('bbLetterSelectorBar');
        if (!container) return;

        container.innerHTML = ARABIC_LETTERS_DATA.map(l => `
            <button class="bb-letter-chip ${l.id === BlackboardState.activeLetterId ? 'active' : ''}"
                    onclick="selectLetter('${l.id}')"
                    title="${l.name}">
                ${l.char}
            </button>
        `).join('');
    }

    window.selectLetter = function (letterId) {
        BlackboardState.activeLetterId = letterId;
        renderLetterSelector();

        const letter = getActiveLetter();
        if (!letter) return;

        // تحديث شريط المواضع
        updateLetterFormButtons();

        // تحديث نصيحة خط النسخ
        const tipEl = document.getElementById('bbLetterTipText');
        if (tipEl) tipEl.innerText = letter.tip;

        const titleEl = document.getElementById('bbActiveLetterTitle');
        if (titleEl) titleEl.innerText = `حرف ${letter.name} (${letter.char})`;

        clearBlackboard();
        drawLetterGuide();
    };

    window.selectNextLetter = function () {
        hideEvaluationOverlay();
        const curIdx = ARABIC_LETTERS_DATA.findIndex(l => l.id === BlackboardState.activeLetterId);
        const nextIdx = (curIdx + 1) % ARABIC_LETTERS_DATA.length;
        selectLetter(ARABIC_LETTERS_DATA[nextIdx].id);
    };

    window.selectLetterForm = function (formKey) {
        BlackboardState.activeLetterForm = formKey;
        updateLetterFormButtons();
        clearBlackboard();
        drawLetterGuide();
    };

    window.selectVowel = function (vowelMark) {
        BlackboardState.activeVowel = (BlackboardState.activeVowel === vowelMark) ? '' : vowelMark;
        updateVowelButtons();
        clearBlackboard();
        drawLetterGuide();
    };

    function updateLetterFormButtons() {
        ['isolated', 'initial', 'medial', 'final'].forEach(f => {
            const btn = document.getElementById(`btnForm_${f}`);
            if (btn) btn.classList.toggle('active', f === BlackboardState.activeLetterForm);
        });
    }

    function updateVowelButtons() {
        ['fatha', 'damma', 'kasra', 'sukoon'].forEach(v => {
            const btn = document.getElementById(`btnVowel_${v}`);
            if (btn) {
                const mark = btn.getAttribute('data-vowel');
                btn.classList.toggle('active', mark === BlackboardState.activeVowel);
            }
        });
    }

    function getActiveLetter() {
        return ARABIC_LETTERS_DATA.find(l => l.id === BlackboardState.activeLetterId) || ARABIC_LETTERS_DATA[0];
    }

    // ==========================================================================
    // 13. التبويب 2: مختبر الخط العربي وتشريح الحروف
    // ==========================================================================
    function renderAnatomyTab() {
        const container = document.getElementById('anatomyHubContent');
        if (!container) return;

        const onLineLetters = ARABIC_LETTERS_DATA.filter(l => l.type === 'on_line');
        const belowLineLetters = ARABIC_LETTERS_DATA.filter(l => l.type === 'below_line');
        const nonConnectors = ARABIC_LETTERS_DATA.filter(l => !l.connector);

        container.innerHTML = `
            <div class="anatomy-hero-banner">
                <div>
                    <h2 style="margin: 0; font-size: 1.6rem; font-weight: 900;">🏛️ مختبر خط النسخ وتشريح أسرار الحروف</h2>
                    <p style="margin: 6px 0 0 0; font-size: 0.88rem; opacity: 0.95;">
                        قواعد استقرار الحروف على السطر، أسرار الحروف الرافضة، وميزان النقط وفق المنهج الفونيمي للصف الأول.
                    </p>
                </div>
                <div style="font-size: 3.2rem;">🖋️📜</div>
            </div>

            <div class="anatomy-sections-grid">
                <!-- قسم الحروف المستقرة على السطر -->
                <div class="anatomy-card">
                    <div class="anatomy-card-header">
                        <span class="anatomy-card-icon">🟢</span>
                        <div>
                            <h3 style="margin: 0; font-size: 1.1rem; font-weight: 900; color: #065f46;">الحروف المستقرة على السطر (لا تهبط أبداً)</h3>
                            <div style="font-size: 0.78rem; color: #64748b;">تستند كلياً فوق السطر الأحمر ولا تتدلى تحته</div>
                        </div>
                    </div>
                    <div class="anatomy-letters-flex">
                        ${onLineLetters.map(l => `
                            <span class="anatomy-letter-badge" onclick="testAnatomyLetter('${l.id}')">${l.char}</span>
                        `).join('')}
                    </div>
                    <div style="font-size: 0.82rem; color: #334155; line-height: 1.5; background: #f8fafc; padding: 10px; border-radius: 10px;">
                        💡 <b>القاعدة الذهبية:</b> حروف (أ، ب، ت، ث، د، ذ، ط، ظ، ك، ف) تجلس بأمان وثبات فوق السطر كالسرير الهادئ.
                    </div>
                </div>

                <!-- قسم الحروف الهابطة تحت السطر -->
                <div class="anatomy-card">
                    <div class="anatomy-card-header">
                        <span class="anatomy-card-icon">🌊</span>
                        <div>
                            <h3 style="margin: 0; font-size: 1.1rem; font-weight: 900; color: #1e40af;">الحروف الهابطة تحت السطر (حروف نصلي شروق غيا)</h3>
                            <div style="font-size: 0.78rem; color: #64748b;">ينزل قسم منها أو كأسها تحت السطر الأحمر</div>
                        </div>
                    </div>
                    <div class="anatomy-letters-flex">
                        ${belowLineLetters.map(l => `
                            <span class="anatomy-letter-badge" style="border-color: #93c5fd;" onclick="testAnatomyLetter('${l.id}')">${l.char}</span>
                        `).join('')}
                    </div>
                    <div style="font-size: 0.82rem; color: #334155; line-height: 1.5; background: #eff6ff; padding: 10px; border-radius: 10px;">
                        💡 <b>سر الحفظ:</b> تجمعها عبارة (نَصَلِّي شُرُوقَ غَيَّا) بالإضافة إلى الجيم والحاء والخاء والعين.
                    </div>
                </div>

                <!-- قسم الحروف الرافضة (حروف القطع) -->
                <div class="anatomy-card">
                    <div class="anatomy-card-header">
                        <span class="anatomy-card-icon">⚡</span>
                        <div>
                            <h3 style="margin: 0; font-size: 1.1rem; font-weight: 900; color: #b45309;">الحروف الرافضة الستة (حروف الانفصال الكهربائية)</h3>
                            <div style="font-size: 0.78rem; color: #64748b;">تمسك بما قبلها وترفض أن تمسك بما بعدها</div>
                        </div>
                    </div>
                    <div class="anatomy-letters-flex">
                        ${nonConnectors.map(l => `
                            <span class="anatomy-letter-badge" style="border-color: #fcd34d; background: #fffbeb;" onclick="testAnatomyLetter('${l.id}')">${l.char}</span>
                        `).join('')}
                    </div>
                    <div style="font-size: 0.82rem; color: #334155; line-height: 1.5; background: #fefce8; padding: 10px; border-radius: 10px;">
                        💡 <b>قصة الحروف الستة:</b> (أ ، د ، ذ ، ر ، ز ، و) يدها اليمنى تصافح الأصدقاء، أما يدها اليسرى فلا تمسك أحداً أبداً!
                    </div>
                </div>

                <!-- شاشة الفحص والمقارنة الحية -->
                <div class="anatomy-card" style="grid-column: 1 / -1;">
                    <div class="anatomy-card-header">
                        <span class="anatomy-card-icon">🔍</span>
                        <div>
                            <h3 style="margin: 0; font-size: 1.1rem; font-weight: 900; color: #0f172a;">المجهر البصري: فحص تموضع الحرف على سطر النسخ</h3>
                            <div style="font-size: 0.78rem; color: #64748b;">انقر فوق أي حرف بالأعلى لتشريحه وعرض موقعه الميزاني</div>
                        </div>
                    </div>
                    <div class="anatomy-interactive-display" id="anatomyInteractiveDisplay">
                        <div class="anatomy-naskh-sample" id="anatomyNaskhChar">ب</div>
                        <div class="anatomy-baseline-indicator"></div>
                        <div style="font-size: 0.95rem; font-weight: 800; color: #94a3b8; margin-top: 14px;" id="anatomyDescText">
                            حرف الباء: يستقر على السطر تماماً، طوله 4 نقاط خطية.
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    window.testAnatomyLetter = function (letterId) {
        const letter = ARABIC_LETTERS_DATA.find(l => l.id === letterId);
        if (!letter) return;

        const charEl = document.getElementById('anatomyNaskhChar');
        const descEl = document.getElementById('anatomyDescText');
        if (!charEl || !descEl) return;

        charEl.innerText = letter.char;
        charEl.style.transform = 'scale(0.8)';
        setTimeout(() => { charEl.style.transform = 'scale(1)'; }, 50);

        const posText = letter.type === 'on_line' ? '🟢 حرف مستقر على السطر' : '🌊 حرف يهبط تحت السطر';
        const connText = letter.connector ? 'يمسك بما قبله وما بعده' : '⚡ حرف رافض (لا يمسك بما بعده)';

        descEl.innerHTML = `
            <b>حرف ${letter.name} (${letter.char}):</b> ${posText} • ${connText}.<br>
            <span style="color: #6ee7b7; font-size: 0.85rem;">${letter.tip}</span>
        `;
    };

    // ==========================================================================
    // 14. التبويب 3: سبورة الكلمات والرسم الحر وتصدير الشهادة الفنية
    // ==========================================================================
    function initFreehandCanvases() {
        const container = document.getElementById('freehandCanvasContainer');
        if (!container) return;

        freehandGridCanvas = document.getElementById('freehandGridCanvas');
        freehandCanvas = document.getElementById('freehandDrawingCanvas');

        if (!freehandGridCanvas || !freehandCanvas) return;

        freehandGridCtx = freehandGridCanvas.getContext('2d');
        freehandCtx = freehandCanvas.getContext('2d');

        resizeFreehandCanvases();
        attachDrawingEvents(freehandCanvas, freehandCtx, false);
    }

    function resizeFreehandCanvases() {
        const container = document.getElementById('freehandCanvasContainer');
        if (!container || !freehandGridCanvas || !freehandCanvas) return;

        const rect = container.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        const dpr = window.devicePixelRatio || 1;
        const w = rect.width;
        const h = rect.height;

        [freehandGridCanvas, freehandCanvas].forEach(c => {
            c.width = w * dpr;
            c.height = h * dpr;
            c.style.width = `${w}px`;
            c.style.height = `${h}px`;
            const ctx = c.getContext('2d');
            ctx.resetTransform?.();
            ctx.scale(dpr, dpr);
        });

        drawCalligraphyGrid(freehandGridCtx, w, h);
        renderFreehandWordGuide();
    }

    function renderFreehandWords() {
        const container = document.getElementById('freehandWordChipsScroll');
        if (!container) return;

        container.innerHTML = CURRICULUM_WORDS_BANK.map(w => `
            <button class="freehand-word-chip ${w.word === BlackboardState.activeWord ? 'active' : ''}"
                    onclick="selectFreehandWord('${w.word}')">
                ${w.word}
            </button>
        `).join('');
    }

    window.selectFreehandWord = function (wordStr) {
        BlackboardState.activeWord = wordStr;
        renderFreehandWords();
        renderFreehandWordGuide();
    };

    window.setCustomFreehandWord = function (val) {
        if (!val || !val.trim()) return;
        BlackboardState.activeWord = val.trim();
        renderFreehandWordGuide();
    };

    function renderFreehandWordGuide() {
        if (!freehandGridCtx || !freehandGridCanvas) return;
        const w = freehandGridCanvas.width / (window.devicePixelRatio || 1);
        const h = freehandGridCanvas.height / (window.devicePixelRatio || 1);

        drawCalligraphyGrid(freehandGridCtx, w, h);

        const word = BlackboardState.activeWord;
        if (!word) return;

        freehandGridCtx.save();
        const baselineY = h * 0.66;

        freehandGridCtx.font = `bold ${h * 0.45}px "Tajawal", "Traditional Arabic", serif`;
        freehandGridCtx.textAlign = 'center';
        freehandGridCtx.textBaseline = 'alphabetic';

        freehandGridCtx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        freehandGridCtx.lineWidth = 2.5;
        freehandGridCtx.setLineDash([5, 7]);
        freehandGridCtx.strokeText(word, w * 0.5, baselineY);

        freehandGridCtx.restore();
    }

    window.clearFreehandBoard = function () {
        if (!freehandCtx || !freehandCanvas) return;
        const w = freehandCanvas.width / (window.devicePixelRatio || 1);
        const h = freehandCanvas.height / (window.devicePixelRatio || 1);
        freehandCtx.clearRect(0, 0, w, h);
    };

    // تصدير لوحة التلميذ كبطاقة فنية موثقة بصورة PNG
    window.exportStudentArtwork = function () {
        if (!freehandCanvas) return;

        const offCanvas = document.createElement('canvas');
        offCanvas.width = 1200;
        offCanvas.height = 800;
        const offCtx = offCanvas.getContext('2d');

        // خلفية خشبية فاخرة
        offCtx.fillStyle = '#1c4b38';
        offCtx.fillRect(0, 0, 1200, 800);

        // برواز ذهبي
        offCtx.strokeStyle = '#d97706';
        offCtx.lineWidth = 18;
        offCtx.strokeRect(9, 9, 1182, 782);

        // رسم محتوى سبورة الطفل
        offCtx.drawImage(freehandCanvas, 40, 140, 1120, 520);

        // الترويسة
        offCtx.fillStyle = '#ffffff';
        offCtx.font = 'bold 36px Tajawal, sans-serif';
        offCtx.textAlign = 'center';
        offCtx.fillText('لوحة خطاط المستقبل الصغير 🎨', 600, 65);

        offCtx.fillStyle = '#a7f3d0';
        offCtx.font = '22px Tajawal, sans-serif';
        offCtx.fillText('منصة قراءتي التفاعلية الذكية • كتاب قراءتي الأول الابتدائي', 600, 105);

        // التذييل والتوثيق
        offCtx.fillStyle = '#ffffff';
        offCtx.font = 'bold 20px Tajawal, sans-serif';
        offCtx.textAlign = 'right';
        offCtx.fillText('إعداد وتطوير: المهندس أسامة خليل هاشم', 1140, 750);

        const today = new Date().toLocaleDateString('ar-EG');
        offCtx.textAlign = 'left';
        offCtx.fillText(`التاريخ: ${today}`, 60, 750);

        // تنزيل الصورة
        const link = document.createElement('a');
        link.download = `qiraati-calligraphy-${Date.now()}.png`;
        link.href = offCanvas.toDataURL('image/png');
        link.click();
    };

    // ==========================================================================
    // 15. التبويب 4: كراسة أوراق عمل الخط والنسخ القابلة للطباعة (A4)
    // ==========================================================================
    function renderPrintSheets() {
        const container = document.getElementById('printSheetsContent');
        if (!container) return;

        const letter = getActiveLetter();
        if (!letter) return;

        container.innerHTML = `
            <div class="print-sheet-paper">
                <div class="print-sheet-header">
                    <div>
                        <div class="print-sheet-meta">جمهورية العراق • وزارة التربية • كتاب قراءتي للصف الأول الابتدائي</div>
                        <h2 class="print-sheet-title">كراسة تحسين الخط العربي والنسخ — حرف ${letter.name} (${letter.char})</h2>
                        <div class="print-sheet-meta">إعداد وتطوير: <b>المهندس أسامة خليل هاشم</b> • البصمة الرقمية المعتمدة</div>
                    </div>
                    <div style="text-align: center; border: 2px dashed #059669; padding: 6px 14px; border-radius: 12px; background: #ecfdf5;">
                        <span style="font-size: 2.2rem; font-weight: 900; color: #047857;">${letter.char}</span>
                        <div style="font-size: 0.72rem; font-weight: 800; color: #065f46;">${letter.name}</div>
                    </div>
                </div>

                <!-- سطر التوجيه والتشريح -->
                <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 12px; margin-bottom: 20px; font-size: 0.88rem; color: #1e293b; line-height: 1.5;">
                    💡 <b>إرشادات المعلم لخط النسخ:</b> ${letter.tip}
                </div>

                <!-- نموذج الحرف بأشكاله الأربعة -->
                <div style="margin-bottom: 24px;">
                    <h4 style="margin: 0 0 10px 0; font-size: 1rem; color: #0f172a; font-weight: 900;">1. أشكال الحرف ومواضعه من الكلمة (تتبع ثم اكتب):</h4>
                    <div class="print-grid-lines-row">
                        <div class="print-ascender"></div>
                        <div class="print-midline"></div>
                        <div class="print-baseline"></div>
                        <div class="print-descender"></div>
                        <div style="width: 100%; display: flex; justify-content: space-around; font-size: 2.4rem; font-weight: 900; color: #334155; position: relative; z-index: 2;">
                            <span>${letter.forms?.isolated || letter.char}</span>
                            <span>${letter.forms?.initial || letter.char}</span>
                            <span>${letter.forms?.medial || letter.char}</span>
                            <span>${letter.forms?.final || letter.char}</span>
                        </div>
                    </div>
                </div>

                <!-- تدريب الكلمات المنهجية -->
                <div style="margin-bottom: 24px;">
                    <h4 style="margin: 0 0 10px 0; font-size: 1rem; color: #0f172a; font-weight: 900;">2. كلمات منهج قراءتي التطبيقية:</h4>
                    <div class="print-grid-lines-row">
                        <div class="print-ascender"></div>
                        <div class="print-midline"></div>
                        <div class="print-baseline"></div>
                        <div class="print-descender"></div>
                        <div style="width: 100%; display: flex; justify-content: space-around; font-size: 1.8rem; font-weight: 900; color: #334155; position: relative; z-index: 2;">
                            ${letter.words.map(w => `<span>${w}</span>`).join('')}
                        </div>
                    </div>
                </div>

                <!-- سطور الكتابة الحرة -->
                <div style="margin-bottom: 20px;">
                    <h4 style="margin: 0 0 10px 0; font-size: 1rem; color: #0f172a; font-weight: 900;">3. سطور النسخ الحرة للتلميذ:</h4>
                    ${[1, 2, 3].map(() => `
                        <div class="print-grid-lines-row">
                            <div class="print-ascender"></div>
                            <div class="print-midline"></div>
                            <div class="print-baseline"></div>
                            <div class="print-descender"></div>
                        </div>
                    `).join('')}
                </div>

                <!-- ختم التقييم والتوقيع الرسمي -->
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1.5px solid #cbd5e1; padding-top: 14px; margin-top: 24px;">
                    <div style="font-size: 0.82rem; color: #475569;">
                        اسم التلميذ: ....................................... | الصف والشعبة: ......................
                    </div>
                    <div style="border: 1.5px solid #059669; border-radius: 10px; padding: 6px 16px; text-align: center; background: #ecfdf5;">
                        <span style="font-size: 0.8rem; font-weight: 800; color: #065f46;">تقييم المعلم:</span>
                        <div style="font-size: 1.1rem; color: #059669; font-weight: 900;">⭐⭐⭐ ممتاز</div>
                    </div>
                </div>
            </div>
        `;
    }

    // ==========================================================================
    // دالة مساعدة لتأخير التنفيذ (Debounce)
    // ==========================================================================
    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

})();
