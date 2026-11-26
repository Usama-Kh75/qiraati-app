/* ==========================================================================
 * منصة قراءتي التفاعلية الذكية - نظام الاختبار والتقييم الذكي (Gamification & Stars System)
 * ومحرك أسئلة التحدي لتعزيز دافعية التعلم للأطفال • الصف الأول الابتدائي
 * إعداد وتطوير: المهندس أسامة خليل هاشم
 * ========================================================================== */

(function () {
    'use strict';

    // ==========================================================================
    // 1. الثوابت ومفاتيح التخزين المعتمدة (تلتزم بالبادئة qiraati-smart-)
    // ==========================================================================
    const STORAGE_KEY_STARS   = 'qiraati-smart-gamification-stars';
    const STORAGE_KEY_LEVEL   = 'qiraati-smart-gamification-level';
    const STORAGE_KEY_BADGES  = 'qiraati-smart-gamification-badges';
    const STORAGE_KEY_STATS   = 'qiraati-smart-gamification-stats';
    const STORAGE_KEY_HISTORY = 'qiraati-smart-gamification-history';
    const STORAGE_KEY_PROFILE = 'qiraati-smart-eval-profile';

    // رتب ومستويات نمو البطل (7 رتب تصاعدية)
    const HERO_RANKS = [
        { level: 1, title: 'برعم القراءة 🌟', minStars: 0, maxStars: 50, avatar: '🌱', desc: 'بداية مشوار حب القراءة واكتشاف أصوات الحروف' },
        { level: 2, title: 'تلميذ نشيط 🚀', minStars: 51, maxStars: 150, avatar: '🎒', desc: 'خطوات واثقة نحو القراءة الذاتية وفك المقاطع' },
        { level: 3, title: 'قارئ ماهر 🏅', minStars: 151, maxStars: 300, avatar: '📚', desc: 'انسيابية في قراءة الكلمات الثلاثية والمدود' },
        { level: 4, title: 'بطل المقاطع 🧩', minStars: 301, maxStars: 500, avatar: '🎯', desc: 'مهارة فائقة في تركيب المقاطع وتحليل الكلمات' },
        { level: 5, title: 'فارس الحروف ⚔️', minStars: 501, maxStars: 800, avatar: '🛡️', desc: 'إتقان تام للحركات والسكون والشدة والتنوين' },
        { level: 6, title: 'صقر القراءة الذكية 🦅', minStars: 801, maxStars: 1200, avatar: '🦅', desc: 'سرعة ودقة فائقة وفهم عميق للقصص المنهجية' },
        { level: 7, title: 'أسطورة قراءتي الذهبي 👑', minStars: 1201, maxStars: 999999, avatar: '👑', desc: 'أعلى رتبة شرفية للتفوق القرائي التام' }
    ];

    // خزانة الأوسمة الملكية العشرة
    const ROYAL_BADGES = [
        { id: 'badge_first_step', title: 'وسام الخطوة الأولى', icon: '🎯', desc: 'خوض أول جولة تحدٍ وإتمامها بنجاح واقتدار' },
        { id: 'badge_phonemic_ear', title: 'وسام الأذن الذهبية', icon: '👂', desc: 'إتقان 5 أسئلة استماع وتمييز فونيمي بنجاح' },
        { id: 'badge_syllables_master', title: 'وسام مهندس المقاطع', icon: '🧩', desc: 'تركيب وتحليل 5 كلمات مقطعية دون أي خطأ' },
        { id: 'badge_speed_lightning', title: 'وسام البرق السريع', icon: '⚡', desc: 'الإجابة عن السؤال بذكاء وسرعة فائقة خلال ثوانٍ' },
        { id: 'badge_fire_streak', title: 'وسام السلسلة النارية', icon: '🔥', desc: 'إجابة 5 أسئلة متتالية بشكل صحيح ومتقن' },
        { id: 'badge_perfect_score', title: 'وسام العلامة الكاملة', icon: '💯', desc: 'إنهاء جولة تحدٍ كاملة بنسبة دقة 100%' },
        { id: 'badge_lam_master', title: 'وسام سيد اللامين', icon: '☀️🌙', desc: 'التمييز الصحيح بين اللام الشمسية واللام القمرية' },
        { id: 'badge_shaddah_tamer', title: 'وسام مروّض الشدة والتنوين', icon: '🦁', desc: 'إتقان نطق وتمييز الحرف المشدد وتنوين الضم والفتح' },
        { id: 'badge_star_collector', title: 'وسام جامع النجوم الذهبية', icon: '⭐', desc: 'جمع 500 نجمة في بنك التحديات والتقييم' },
        { id: 'badge_reading_legend', title: 'وسام بطل القراءة الأسطوري', icon: '👑', desc: 'بلوغ الرتبة السابعة وجمع 1000+ نجمة في منصة قراءتي' }
    ];

    // ==========================================================================
    // 2. بنك أسئلة التحدي والتقييم الذكي المنهجي (Challenge Questions Bank)
    // ==========================================================================
    const CHALLENGE_QUESTIONS_BANK = [
        // --- 1. مجالات الوعي الفونيمي والأصوات (Phonemic Awareness) ---
        {
            id: 'ph_01',
            category: 'وعي فونيمي',
            domain: 'phonemic',
            question: 'ما هو الصوت الأول الذي تسمعه في كلمة «بَقَرَة»؟',
            pic: 'activity_b_read.png',
            audioWord: 'بَقَرَة',
            audioKey: 'letter_b_sound',
            options: ['صوت الباء (بـ)', 'صوت الدال (د)', 'صوت الراء (ر)', 'صوت الميم (مـ)'],
            correct: 0,
            hint: 'تبدأ بحرف الباء النقطة تحته'
        },
        {
            id: 'ph_02',
            category: 'وعي فونيمي',
            domain: 'phonemic',
            question: 'ما هو الصوت الأخير في كلمة «دَار»؟',
            pic: 'activity_r_scene.png',
            audioWord: 'دَار',
            audioKey: 'word_dar',
            options: ['صوت الدال (د)', 'صوت الراء (ر)', 'صوت النون (ن)', 'صوت الباء (ب)'],
            correct: 1,
            hint: 'تنتهي بصوت الراء مثل الزحليقة'
        },
        {
            id: 'ph_03',
            category: 'وعي فونيمي',
            domain: 'phonemic',
            question: 'ما هو الصوت الأوسط في كلمة «سَـارَة»؟',
            pic: 'activity_s_read.png',
            audioWord: 'سَارَة',
            audioKey: 'letter_s_sound',
            options: ['مد الألف (ا)', 'حرف الراء (ر)', 'حرف السين (سـ)', 'التاء المربوطة (ة)'],
            correct: 0,
            hint: 'يمتد الصوت بعد السين بمد الألف'
        },
        {
            id: 'ph_04',
            category: 'وعي فونيمي',
            domain: 'phonemic',
            question: 'أي الكلمات التالية تحوي صوتاً طويلاً (مد الواو)؟',
            pic: 'activity_n_scene.png',
            audioWord: 'نُور',
            audioKey: 'word_noor',
            options: ['نُور', 'دُبّ', 'قُم', 'رُبَّ'],
            correct: 0,
            hint: 'واو المد تجعل الصوت ممدوداً (نُو)'
        },
        {
            id: 'ph_05',
            category: 'وعي فونيمي',
            domain: 'phonemic',
            question: 'الصوت القصير في كلمة «دَادَا» هو الفتحة، فما هو الصوت الطويل؟',
            pic: 'activity_d_scene.png',
            audioWord: 'دَادَا',
            audioKey: 'faseeh_blend_dada',
            options: ['مد الألف (ا)', 'مد الواو (و)', 'مد الياء (ي)', 'الضمة'],
            correct: 0,
            hint: 'الألف الممدودة بعد الدال'
        },

        // --- 2. مجالات الحروف الهجائية ومواقعها (Alphabet & Letter Forms) ---
        {
            id: 'alpha_01',
            category: 'الحروف الهجائية',
            domain: 'alphabet',
            question: 'أي من الحروف التالية يستقر على السطر تماماً ولا ينزل تحته؟',
            pic: null,
            audioWord: 'حرف الدال',
            audioKey: 'letter_d_sound',
            options: ['حرف الدال (د)', 'حرف الراء (ر)', 'حرف الزاي (ز)', 'حرف الواو (و)'],
            correct: 0,
            hint: 'الدال مثل منقار الطائر يجلس على السطر'
        },
        {
            id: 'alpha_02',
            category: 'الحروف الهجائية',
            domain: 'alphabet',
            question: 'ما هو شكل حرف الميم في أول الكلمة كما في كلمة «مَامَا»؟',
            pic: 'unit1_story_kitchen.png',
            audioWord: 'مَامَا',
            audioKey: 'letter_m_read_mama',
            options: ['مـ (يمد يده للحرف التالي)', 'ـم (آخر الكلمة متصل)', 'م (منفصل)', 'ـمـ (وسطي)'],
            correct: 0,
            hint: 'يمد يده اليسرى ليتصل بالألف'
        },
        {
            id: 'alpha_03',
            category: 'الحروف الهجائية',
            domain: 'alphabet',
            question: 'ما هو الحرف الذي يميز كلمة «بُوق» في نهايتها؟',
            pic: 'activity_booq_scene.png',
            audioWord: 'بُوق',
            audioKey: 'word_booq',
            options: ['حرف القاف (ق)', 'حرف الفاء (ف)', 'حرف الكاف (ك)', 'حرف اللام (ل)'],
            correct: 0,
            hint: 'قاف آخرية منفصلة فوقها نقطتان'
        },
        {
            id: 'alpha_04',
            category: 'الحروف الهجائية',
            domain: 'alphabet',
            question: 'كلمة «سَالِم» تبدأ بحرف:',
            pic: 'activity_salim_scene.png',
            audioWord: 'سَالِم',
            audioKey: 'faseeh_word_salim',
            options: ['السين (سـ)', 'الشين (شـ)', 'الصاد (صـ)', 'الطاء (طـ)'],
            correct: 0,
            hint: 'له ثلاثة أسنان لطيفة'
        },
        {
            id: 'alpha_05',
            category: 'الحروف الهجائية',
            domain: 'alphabet',
            question: 'في كلمة «نَبِيل»، الحرف الأخير هو:',
            pic: 'activity_nabeel_scene.png',
            audioWord: 'نَبِيل',
            audioKey: 'word_nabeel',
            options: ['اللام (ـل)', 'الدال (ـد)', 'الباء (ـب)', 'الراء (ـر)'],
            correct: 0,
            hint: 'لام متصلة تشبه عكاز المظلة'
        },

        // --- 3. التحليل والتركيب المقطعي (Syllables & Blending) ---
        {
            id: 'syl_01',
            category: 'تركيب مقطعي',
            domain: 'syllables',
            question: 'إذا ركبنا المقطعين «دَا» + «دَا»، فما هي الكلمة الناتجة؟',
            pic: 'activity_d_scene.png',
            audioWord: 'دَادَا',
            audioKey: 'faseeh_blend_dada',
            options: ['دَادَا', 'دَار', 'دُور', 'دُود'],
            correct: 0,
            hint: 'الطفل الرضيع الصغير'
        },
        {
            id: 'syl_02',
            category: 'تركيب مقطعي',
            domain: 'syllables',
            question: 'ما هي المقاطع الصحيحة لكلمة «بَابَا»؟',
            pic: 'unit1_story_living.png',
            audioWord: 'بَابَا',
            audioKey: 'faseeh_blend_baba',
            options: ['بَا + بَا', 'بَـ + ابَا', 'بَاب + َا', 'بُو + بُو'],
            correct: 0,
            hint: 'مقطعان متماثلان يبدآن بالباء'
        },
        {
            id: 'syl_03',
            category: 'تركيب مقطعي',
            domain: 'syllables',
            question: 'ركب المقطع والحرف: «نُو» + «ر» = ؟',
            pic: 'activity_n_scene.png',
            audioWord: 'نُور',
            audioKey: 'word_noor',
            options: ['نُور', 'نَار', 'نَمِير', 'نَدِيم'],
            correct: 0,
            hint: 'اسم البنت الجميلة وأخت ريم'
        },
        {
            id: 'syl_04',
            category: 'تركيب مقطعي',
            domain: 'syllables',
            question: 'كم مقطعاً صوتياً تتكون منه كلمة «قِـ ـطَـا ر»؟',
            pic: 'activity_tanween_dham_scene.png',
            audioWord: 'قِطَار',
            audioKey: 'word_qitar',
            options: ['3 مقاطع (قِـ + طَا + ر)', 'مقطعان فقط', 'مقطع واحد', '4 مقاطع'],
            correct: 0,
            hint: 'قِـ (قصير) + طَا (مد طويل) + ر (ساكن)'
        },
        {
            id: 'syl_05',
            category: 'تركيب مقطعي',
            domain: 'syllables',
            question: 'إذا جمعنا «رِيـ» + «ـم»، نحصل على كلمة:',
            pic: 'activity_r_scene.png',
            audioWord: 'رِيم',
            audioKey: 'letter_r_sound',
            options: ['رِيم', 'رِيف', 'دَار', 'رُمَّان'],
            correct: 0,
            hint: 'اسم الغزالة والطفلة اللطيفة ريم'
        },

        // --- 4. الحركات والظواهر اللغوية (Grammar & Diacritics) ---
        {
            id: 'gram_01',
            category: 'الظواهر اللغوية',
            domain: 'grammar',
            question: 'ما الحركة الموضوعة فوق الراء في كلمة «دَارُ نُورِي»؟',
            pic: 'activity_r_scene.png',
            audioWord: 'دَارُ',
            audioKey: 'word_dar',
            options: ['الضمة (ـُ)', 'الفتحة (ـَ)', 'الكسرة (ـِ)', 'السكون (ـْ)'],
            correct: 0,
            hint: 'واو صغيرة فوق الحرف تضم الشفتين'
        },
        {
            id: 'gram_02',
            category: 'الظواهر اللغوية',
            domain: 'grammar',
            question: 'أي الكلمات التالية تنتهي بتنوين الضم (ـٌ)؟',
            pic: 'activity_tanween_dham_scene.png',
            audioWord: 'قِطَارٌ',
            audioKey: 'word_qitar',
            options: ['قِطَارٌ', 'قِطَارَ', 'قِطَارِ', 'قِطَارْ'],
            correct: 0,
            hint: 'ضمتان متجاورتان تُلفظان بنغمة نون ساكنة'
        },
        {
            id: 'gram_03',
            category: 'الظواهر اللغوية',
            domain: 'grammar',
            question: 'كلمة «الشَّمْس» لامها:',
            pic: 'activity_lam_scene.png',
            audioWord: 'الشَّمْس',
            audioKey: 'lam_correct',
            options: ['لام شمسية (تُكتب ولا تُلفظ، والحرف بعدها مشدد)', 'لام قمرية (تُكتب وتُلفظ ساكنة)', 'ليست لام', 'حرف مد'],
            correct: 0,
            hint: 'الشين مشددة واللام لا تظهر في النطق'
        },
        {
            id: 'gram_04',
            category: 'الظواهر اللغوية',
            domain: 'grammar',
            question: 'كلمة «الْقَمَر» لامها:',
            pic: 'activity_lam_scene.png',
            audioWord: 'الْقَمَر',
            audioKey: 'lam_correct',
            options: ['لام قمرية (تظهر ساكنة واضحة في النطق)', 'لام شمسية (مدغمة)', 'تنوين', 'حرف ساكن فقط'],
            correct: 0,
            hint: 'القاف حرف قمري تظهر اللام قبله بالسكون'
        },
        {
            id: 'gram_05',
            category: 'الظواهر اللغوية',
            domain: 'grammar',
            question: 'الحرف المشدد في كلمة «قَدُّورِي» هو:',
            pic: 'activity_shaddah_scene.png',
            audioWord: 'قَدُّورِي',
            audioKey: 'letter_d_sound',
            options: ['حرف الدال (دّ)', 'حرف القاف (ق)', 'حرف الواو (و)', 'حرف الراء (ر)'],
            correct: 0,
            hint: 'الدال فوقها الشدة فنطقناها مرتين'
        },

        // --- 5. فهم المقروء والطلاقة البصرية (Comprehension & Context) ---
        {
            id: 'comp_01',
            category: 'فهم المقروء',
            domain: 'comprehension',
            question: 'في درس قراءتي: ماذا كان يفعل بابا في القصة المصورة؟',
            pic: 'unit1_story_living.png',
            audioWord: 'بَابَا',
            audioKey: 'faseeh_blend_baba',
            options: ['يَقْرَأُ الْجَرِيدَةَ مَعَ الأُسْرَة', 'يَطْبُخُ الطَّعَام', 'يَسْبَحُ فِي الشَّطّ', 'يَنَامُ فِي السَّرِير'],
            correct: 0,
            hint: 'يجلس في غرفة المعيشة مبتسماً يقرأ'
        },
        {
            id: 'comp_02',
            category: 'فهم المقروء',
            domain: 'comprehension',
            question: 'بوق مَن كان قديماً في درس القراءة؟',
            pic: 'activity_booq_scene.png',
            audioWord: 'بُوقُ نَدِيم',
            audioKey: 'word_booq',
            options: ['بُوقُ نَدِيمٍ', 'بُوقُ زَيْدٍ', 'بُوقُ فَارِسٍ', 'بُوقُ سَالِمٍ'],
            correct: 0,
            hint: 'بُوقُ نَدِيمٍ قَدِيمٌ'
        },
        {
            id: 'comp_03',
            category: 'فهم المقروء',
            domain: 'comprehension',
            question: 'مَن هو وزان القرية الذي يزن الزبيب؟',
            pic: 'activity_z_scene.png',
            audioWord: 'قَدُّورِي وَزَّان',
            audioKey: 'letter_z_words_intro',
            options: ['قَدُّورِي وَزَّان', 'نَبِيل بَقَّال', 'مَنَاف رِيف', 'سَالِم زَرَّاع'],
            correct: 0,
            hint: 'مِيزَانُ قَدُّورِي.. قَدُّورِي وَزَّان'
        },
        {
            id: 'comp_04',
            category: 'فهم المقروء',
            domain: 'comprehension',
            question: 'نقول: «بَابَا يَسُوقُ .....» أكمل الجملة الصحيحة:',
            pic: 'activity_s_scene.png',
            audioWord: 'السَّيَّارَة',
            audioKey: 'letter_s_sound',
            options: ['السَّيَّارَةَ', 'الْقِطَارَ', 'الطَّيَّارَةَ', 'السَّفِينَةَ'],
            correct: 0,
            hint: 'السيارة الملونة الجميلة في الشارع'
        },
        {
            id: 'comp_05',
            category: 'فهم المقروء',
            domain: 'comprehension',
            question: 'نقول للمفرد المذكر: «هَذَا وَلَدٌ»، فماذا نقول للمفرد المؤنث؟',
            pic: 'unit2_story_friends.png',
            audioWord: 'هَذِهِ بِنْتٌ',
            audioKey: 'mascot_hint',
            options: ['هَذِهِ بِنْتٌ', 'هَذَا بِنْتٌ', 'هَؤُلَاءِ بِنْتٌ', 'تِلْكَ وَلَدٌ'],
            correct: 0,
            hint: 'هذه اسم إشارة للمؤنث'
        }
    ];

    // ==========================================================================
    // 3. حالة نظام التلعيب والمسابقة الحالية (Gamification State)
    // ==========================================================================
    const GamificationState = {
        totalStars: 0,
        currentRankIndex: 0,
        unlockedBadges: [],
        stats: {
            totalAnswered: 0,
            totalCorrect: 0,
            streaksMax: 0,
            sessionsCompleted: 0
        },

        // حالة جولة التحدي النشطة
        activeChallenge: {
            isActive: false,
            mode: 'grand', // 'grand', 'phonemic', 'syllables', 'alphabet', 'grammar', 'lesson'
            difficulty: 'medium', // 'easy', 'medium', 'hard'
            questions: [],
            currentIndex: 0,
            sessionStars: 0,
            currentStreak: 0,
            correctCount: 0,
            isAnswered: false,
            usedHint: false,
            startTime: null
        }
    };

    // ==========================================================================
    // 4. المحرك الصوتي التفاعلي الذاتي (Web Audio Chimes Engine)
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

    // رنين جمع النجوم الساحر (Magical Star Sparkle)
    function playStarChimeSFX() {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const now = ctx.currentTime;
            // 3 نغمات هارمونية صاعدة وسريعة تمنح شعور الإنجاز والبهجة
            const freqs = [783.99, 1046.50, 1318.51, 1567.98]; // G5, C6, E6, G6
            freqs.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const st = now + idx * 0.06;

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, st);

                gain.gain.setValueAtTime(0.08, st);
                gain.gain.exponentialRampToValueAtTime(0.0001, st + 0.3);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(st);
                osc.stop(st + 0.3);
            });
        } catch (e) {}
    }

    // نغمة السلسلة الحماسية ومضاعف النقاط (Combo Fanfare)
    function playComboFanfareSFX() {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const now = ctx.currentTime;
            const notes = [
                { f: 523.25, t: 0.00, d: 0.12 },
                { f: 659.25, t: 0.12, d: 0.12 },
                { f: 783.99, t: 0.24, d: 0.15 },
                { f: 1046.50, t: 0.39, d: 0.40 }
            ];
            notes.forEach(n => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const st = now + n.t;

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(n.f, st);

                gain.gain.setValueAtTime(0.09, st);
                gain.gain.exponentialRampToValueAtTime(0.0001, st + n.d);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(st);
                osc.stop(st + n.d);
            });
        } catch (e) {}
    }

    // نغمة التنبيه اللطيفة بدون إحباط
    function playGentleEncourageSFX() {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(329.63, ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(261.63, ctx.currentTime + 0.25);

            gain.gain.setValueAtTime(0.06, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.25);
        } catch (e) {}
    }

    // ==========================================================================
    // 5. تحميل وحفظ البيانات في التخزين المحلي الآمن
    // ==========================================================================
    function loadGamificationData() {
        try {
            const savedStars = localStorage.getItem(STORAGE_KEY_STARS);
            if (savedStars !== null) {
                GamificationState.totalStars = parseInt(savedStars, 10) || 0;
            }

            const savedBadges = localStorage.getItem(STORAGE_KEY_BADGES);
            if (savedBadges) {
                GamificationState.unlockedBadges = JSON.parse(savedBadges);
            }

            const savedStats = localStorage.getItem(STORAGE_KEY_STATS);
            if (savedStats) {
                GamificationState.stats = Object.assign(GamificationState.stats, JSON.parse(savedStats));
            }

            calculateCurrentRank();
            updateTopStarsWidget();
        } catch (e) {
            console.warn('Error loading gamification data:', e);
        }
    }

    function saveGamificationData() {
        try {
            localStorage.setItem(STORAGE_KEY_STARS, GamificationState.totalStars.toString());
            localStorage.setItem(STORAGE_KEY_BADGES, JSON.stringify(GamificationState.unlockedBadges));
            localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(GamificationState.stats));
            calculateCurrentRank();
            updateTopStarsWidget();
        } catch (e) {
            console.warn('Error saving gamification data:', e);
        }
    }

    function calculateCurrentRank() {
        const stars = GamificationState.totalStars;
        for (let i = HERO_RANKS.length - 1; i >= 0; i--) {
            if (stars >= HERO_RANKS[i].minStars) {
                GamificationState.currentRankIndex = i;
                break;
            }
        }
    }

    function updateTopStarsWidget() {
        const topCount = document.getElementById('topGlobalStarsCount');
        if (topCount) {
            topCount.textContent = GamificationState.totalStars;
        }
        const sidebarStars = document.getElementById('sidebarStarsCount');
        if (sidebarStars) {
            sidebarStars.textContent = GamificationState.totalStars;
        }
        const modalStatsBadge = document.getElementById('gamificationModalStarsTotal');
        if (modalStatsBadge) {
            modalStatsBadge.textContent = GamificationState.totalStars;
        }
    }

    // ==========================================================================
    // 6. التحكم في النافذة المنبثقة والتبويبات (Modal Controller)
    // ==========================================================================
    window.openGamificationModal = function (initialTab = 'challenge', customMode = null) {
        const modal = document.getElementById('gamificationModal');
        if (!modal) return;
        modal.style.display = 'flex';
        loadGamificationData();
        switchGamificationTab(initialTab);

        if (initialTab === 'challenge') {
            if (customMode) {
                setChallengeMode(customMode);
            } else if (!GamificationState.activeChallenge.isActive) {
                startNewChallenge(GamificationState.activeChallenge.mode);
            }
        } else if (initialTab === 'badges') {
            renderBadgesCabinet();
        } else if (initialTab === 'certificate') {
            renderVictoryCertificate();
        } else if (initialTab === 'analytics') {
            renderAnalyticsMastery();
        }
    };

    window.closeGamificationModal = function () {
        const modal = document.getElementById('gamificationModal');
        if (modal) modal.style.display = 'none';
    };

    window.switchGamificationTab = function (tabId) {
        const tabs = ['challenge', 'badges', 'certificate', 'analytics'];
        tabs.forEach(t => {
            const btn = document.getElementById('tabGamification_' + t);
            const pane = document.getElementById('paneGamification_' + t);
            if (btn) btn.classList.toggle('active', t === tabId);
            if (pane) pane.classList.toggle('active', t === tabId);
        });

        if (tabId === 'badges') {
            renderBadgesCabinet();
        } else if (tabId === 'certificate') {
            renderVictoryCertificate();
        } else if (tabId === 'analytics') {
            renderAnalyticsMastery();
        }
    };

    window.toggleGamificationFullscreen = function () {
        const modalBox = document.querySelector('.gamification-modal-box');
        if (!modalBox) return;
        if (!document.fullscreenElement) {
            modalBox.requestFullscreen().catch(() => {});
        } else {
            document.exitFullscreen().catch(() => {});
        }
    };

    // ==========================================================================
    // 7. محرك بدء وإدارة جولات التحدي (Challenge Engine)
    // ==========================================================================
    window.setChallengeMode = function (mode) {
        GamificationState.activeChallenge.mode = mode;
        document.querySelectorAll('.challenge-mode-pill').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-mode') === mode);
        });
        startNewChallenge(mode);
    };

    window.setChallengeDifficulty = function (diff) {
        GamificationState.activeChallenge.difficulty = diff;
        document.querySelectorAll('.difficulty-pill').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-diff') === diff);
        });
        startNewChallenge(GamificationState.activeChallenge.mode);
    };

    window.startNewChallenge = function (mode = 'grand') {
        const ch = GamificationState.activeChallenge;
        ch.isActive = true;
        ch.mode = mode;
        ch.currentIndex = 0;
        ch.sessionStars = 0;
        ch.currentStreak = 0;
        ch.correctCount = 0;
        ch.isAnswered = false;
        ch.usedHint = false;
        ch.startTime = Date.now();

        // تصفية واختيار الأسئلة حسب النمط
        let pool = [];
        if (mode === 'grand') {
            pool = [...CHALLENGE_QUESTIONS_BANK];
        } else if (mode === 'lesson') {
            // جلب أسئلة الدرس الحالي المفتوح في المنهج
            pool = getQuestionsForCurrentLesson();
        } else {
            pool = CHALLENGE_QUESTIONS_BANK.filter(q => q.domain === mode);
            if (pool.length === 0) pool = [...CHALLENGE_QUESTIONS_BANK];
        }

        // خلط الأسئلة واختيار عدد 5 أو 10 حسب الرغبة
        const shuffled = shuffleArray([...pool]);
        const count = ch.difficulty === 'easy' ? 5 : 10;
        ch.questions = shuffled.slice(0, Math.min(count, shuffled.length));

        renderCurrentChallengeQuestion();
    };

    function getQuestionsForCurrentLesson() {
        let activeIdx = window.currentLessonIndex || 0;
        let lessonTitle = '';
        if (window.flatLessonsList && window.flatLessonsList[activeIdx]) {
            lessonTitle = window.flatLessonsList[activeIdx].title || '';
        }

        // إذا كان هناك كلمات في الدرس، استخرج أسئلة مطابقة
        const matches = CHALLENGE_QUESTIONS_BANK.filter(q => {
            return lessonTitle.includes(q.audioWord) || (q.hint && lessonTitle.includes(q.hint));
        });

        return matches.length > 0 ? matches : [...CHALLENGE_QUESTIONS_BANK];
    }

    function renderCurrentChallengeQuestion() {
        const ch = GamificationState.activeChallenge;
        const total = ch.questions.length;
        const currentIdx = ch.currentIndex;

        if (currentIdx >= total) {
            renderChallengeVictoryScreen();
            return;
        }

        const q = ch.questions[currentIdx];
        ch.isAnswered = false;
        ch.usedHint = false;

        // تحديث العداد ونسبة التقدم
        const counterEl = document.getElementById('challengeCurrentCounter');
        const fillEl = document.getElementById('challengeProgressFill');
        const streakEl = document.getElementById('challengeStreakBadge');
        const sessionStarsEl = document.getElementById('challengeSessionStars');

        if (counterEl) counterEl.textContent = `سؤال ${currentIdx + 1} من ${total}`;
        if (fillEl) fillEl.style.width = `${((currentIdx) / total) * 100}%`;
        if (sessionStarsEl) sessionStarsEl.textContent = ch.sessionStars;

        if (streakEl) {
            if (ch.currentStreak >= 2) {
                streakEl.style.display = 'flex';
                streakEl.innerHTML = `<span>🔥</span> <span>حماسي: ${ch.currentStreak} متتالية!</span>`;
            } else {
                streakEl.style.display = 'none';
            }
        }

        // تحديث نص السؤال
        const titleEl = document.getElementById('challengeQuestionTitle');
        const catEl = document.getElementById('challengeCategoryTag');
        const imgEl = document.getElementById('challengePromptImage');
        const mascotBubble = document.getElementById('challengeMascotBubble');

        if (titleEl) titleEl.textContent = q.question;
        if (catEl) catEl.textContent = q.category || 'تحدي قراءتي الذكي';

        if (imgEl) {
            if (q.pic) {
                imgEl.src = q.pic;
                imgEl.style.display = 'block';
            } else {
                imgEl.style.display = 'none';
            }
        }

        if (mascotBubble) {
            mascotBubble.innerHTML = 'اقرأ السؤال يا بطل، أو اضغط زر <b>«استمع للسؤال 🔊»</b> لأقرأه لك!';
        }

        // بناء خيارات الإجابة
        const optionsContainer = document.getElementById('challengeOptionsGrid');
        if (!optionsContainer) return;

        let optionsHtml = '';
        const arabicLetters = ['أ', 'ب', 'ج', 'د'];

        q.options.forEach((optText, oIdx) => {
            optionsHtml += `
                <button type="button" class="challenge-opt-btn" id="chOptBtn_${oIdx}" onclick="selectChallengeOption(${oIdx})">
                    <div class="challenge-opt-letter">
                        <span>${optText}</span>
                    </div>
                    <div class="challenge-opt-badge">${arabicLetters[oIdx] || (oIdx + 1)}</div>
                </button>
            `;
        });

        optionsContainer.innerHTML = optionsHtml;

        // قراءة السؤال تلقائياً إذا كان المستخدم مفضلاً للنطق
        if (GamificationState.autoSpeech) {
            speakCurrentQuestion();
        }
    }

    window.selectChallengeOption = function (optIndex) {
        const ch = GamificationState.activeChallenge;
        if (ch.isAnswered) return;
        ch.isAnswered = true;

        const q = ch.questions[ch.currentIndex];
        const isCorrect = optIndex === q.correct;
        const selectedBtn = document.getElementById(`chOptBtn_${optIndex}`);
        const correctBtn = document.getElementById(`chOptBtn_${q.correct}`);

        GamificationState.stats.totalAnswered++;

        if (isCorrect) {
            // إجابة صحيحة!
            GamificationState.stats.totalCorrect++;
            ch.correctCount++;
            ch.currentStreak++;
            if (ch.currentStreak > GamificationState.stats.streaksMax) {
                GamificationState.stats.streaksMax = ch.currentStreak;
            }

            // احتساب النجوم: 1 إلى 3 نجوم حسب السلسلة وبدون استخدام التلميح
            let starsEarned = 1;
            if (ch.currentStreak >= 3) starsEarned = 2;
            if (ch.currentStreak >= 5) starsEarned = 3;
            if (ch.usedHint) starsEarned = 1;

            ch.sessionStars += starsEarned;
            GamificationState.totalStars += starsEarned;

            if (selectedBtn) {
                selectedBtn.classList.add('correct');
            }

            // مؤثرات الفوز وانطلاق النجوم الطائرة
            playStarChimeSFX();
            triggerFloatingStarsFromElement(selectedBtn, starsEarned);

            // تشجيع فصيح
            const mascotBubble = document.getElementById('challengeMascotBubble');
            if (mascotBubble) {
                const cheers = [
                    'رائع جداً يا بطل! إجابة صحيحة ومتقنة! 🌟',
                    'يا لك من تلميذ ذكي ومبدع! أحسنت! 👏',
                    'ممتاز! بارك الله فيك وفي قراءتك الذكية! 🚀',
                    'إجابة نموذجية وبطل حقيقي! استمر هكذا! ⭐'
                ];
                mascotBubble.innerHTML = cheers[Math.floor(Math.random() * cheers.length)];
            }

            // فحص فتح الأوسمة الفورية
            checkInstantBadgesUnlock();

            // حفظ التقدم
            saveGamificationData();

            // الانتقال للسؤال التالي بعد ثانية ونصف
            setTimeout(() => {
                ch.currentIndex++;
                renderCurrentChallengeQuestion();
            }, 1400);

        } else {
            // إجابة غير صحيحة - بدون إحباط
            ch.currentStreak = 0;
            if (selectedBtn) {
                selectedBtn.classList.add('wrong');
            }
            if (correctBtn) {
                correctBtn.classList.add('correct');
            }

            playGentleEncourageSFX();

            const mascotBubble = document.getElementById('challengeMascotBubble');
            if (mascotBubble) {
                mascotBubble.innerHTML = `لا بأس يا بطل! الإجابة الصحيحة هي: <b>«${q.options[q.correct]}»</b>. ركز في السؤال التالي! 👍`;
            }

            saveGamificationData();

            // الانتقال للسؤال التالي بعد ثانيتين
            setTimeout(() => {
                ch.currentIndex++;
                renderCurrentChallengeQuestion();
            }, 2200);
        }
    };

    window.speakCurrentQuestion = function () {
        const ch = GamificationState.activeChallenge;
        const q = ch.questions[ch.currentIndex];
        if (!q) return;

        let textToRead = q.question;
        if (q.audioWord) {
            textToRead += `. الكلمة هي: ${q.audioWord}`;
        }

        if (window.mascotSpeak) {
            window.mascotSpeak(textToRead, q.audioKey || null);
        } else if (window.FaseehVoice && typeof window.FaseehVoice.speak === 'function') {
            window.FaseehVoice.speak(textToRead, { rate: 0.88 });
        } else if ('speechSynthesis' in window) {
            const utter = new SpeechSynthesisUtterance(textToRead);
            utter.lang = 'ar-SA';
            utter.rate = 0.88;
            window.speechSynthesis.speak(utter);
        }
    };

    window.useMascotHint = function () {
        const ch = GamificationState.activeChallenge;
        if (ch.isAnswered || ch.usedHint) return;
        ch.usedHint = true;

        const q = ch.questions[ch.currentIndex];
        const mascotBubble = document.getElementById('challengeMascotBubble');

        if (mascotBubble) {
            mascotBubble.innerHTML = `💡 تلميح فصيح: <b>${q.hint || 'استمع جيداً لصوت الحرف والكلمة!'}</b>`;
        }

        // إخفاء خيارين خاطئين لمساعدة التلميذ
        let removed = 0;
        for (let i = 0; i < q.options.length; i++) {
            if (i !== q.correct && removed < 2) {
                const btn = document.getElementById(`chOptBtn_${i}`);
                if (btn) {
                    btn.classList.add('disabled');
                    removed++;
                }
            }
        }

        if (window.mascotSpeak) {
            window.mascotSpeak(`تلميح: ${q.hint || 'اقرأ الكلمة بتمهل'}`, 'mascot_hint');
        }
    };

    // ==========================================================================
    // 8. لوحة التتويج وإتمام التحدي (Victory Screen)
    // ==========================================================================
    function renderChallengeVictoryScreen() {
        const ch = GamificationState.activeChallenge;
        const arena = document.getElementById('challengeArenaContent');
        if (!arena) return;

        GamificationState.stats.sessionsCompleted++;
        const total = ch.questions.length;
        const correct = ch.correctCount;
        const percent = Math.round((correct / total) * 100);

        // فحص وسام العلامة الكاملة
        if (percent === 100) {
            unlockBadge('badge_perfect_score');
        }
        unlockBadge('badge_first_step');

        saveGamificationData();
        playComboFanfareSFX();
        triggerVictoryConfetti();

        arena.innerHTML = `
            <div class="challenge-victory-card">
                <div class="victory-trophy-anim">🏆</div>
                <h2 class="victory-title">مَبْرُوكٌ يَا بَطَلَ القِرَاءَةِ الذَّكِيَّة!</h2>
                <p class="victory-subtitle">
                    أكملتَ جولة التحدي بنجاح باهر وأظهرتَ مهارة فونيمية وقرائية عالية تليق بفرسان الصف الأول!
                </p>

                <div class="victory-stats-grid">
                    <div class="victory-stat-box">
                        <span class="victory-stat-num" style="color: #f59e0b;">⭐ +${ch.sessionStars}</span>
                        <span class="victory-stat-label">النجوم المحصودة</span>
                    </div>
                    <div class="victory-stat-box">
                        <span class="victory-stat-num" style="color: #059669;">${correct} / ${total}</span>
                        <span class="victory-stat-label">الإجابات الصحيحة</span>
                    </div>
                    <div class="victory-stat-box">
                        <span class="victory-stat-num" style="color: #2563eb;">${percent}%</span>
                        <span class="victory-stat-label">نسبة الإتقان والدقة</span>
                    </div>
                    <div class="victory-stat-box">
                        <span class="victory-stat-num" style="color: #7c3aed;">${HERO_RANKS[GamificationState.currentRankIndex].avatar}</span>
                        <span class="victory-stat-label">${HERO_RANKS[GamificationState.currentRankIndex].title}</span>
                    </div>
                </div>

                <div class="victory-actions-row">
                    <button type="button" class="btn btn-teach" style="background: #059669; padding: 10px 24px; font-size: 0.95rem;" onclick="startNewChallenge('${ch.mode}')">
                        <span>🔄</span> <span>خوض تحدٍ جديد فوراً</span>
                    </button>
                    <button type="button" class="btn btn-primary" style="background: #d97706; padding: 10px 24px; font-size: 0.95rem;" onclick="switchGamificationTab('certificate')">
                        <span>📜</span> <span>عرض وطباعة شهادة بطل التحدي</span>
                    </button>
                    <button type="button" class="btn btn-reset" style="padding: 10px 20px; font-size: 0.95rem;" onclick="switchGamificationTab('badges')">
                        <span>👑</span> <span>خزانة الأوسمة الملكية</span>
                    </button>
                </div>
            </div>
        `;
    }

    // ==========================================================================
    // 9. خزانة الأوسمة الملكية ورتب الأبطال (Badges Showcase)
    // ==========================================================================
    function checkInstantBadgesUnlock() {
        const stats = GamificationState.stats;
        const stars = GamificationState.totalStars;

        if (stats.streaksMax >= 5) {
            unlockBadge('badge_fire_streak');
        }
        if (stars >= 500) {
            unlockBadge('badge_star_collector');
        }
        if (stars >= 1000) {
            unlockBadge('badge_reading_legend');
        }
        if (stats.totalCorrect >= 5) {
            unlockBadge('badge_phonemic_ear');
        }
    }

    function unlockBadge(badgeId) {
        if (!GamificationState.unlockedBadges.includes(badgeId)) {
            GamificationState.unlockedBadges.push(badgeId);
            saveGamificationData();
            showBadgeUnlockToast(badgeId);
        }
    }

    function showBadgeUnlockToast(badgeId) {
        const b = ROYAL_BADGES.find(x => x.id === badgeId);
        if (!b) return;

        if (window.mascotSpeak) {
            window.mascotSpeak(`مبارك يا بطل! فزت بـ: (${b.title})!`, 'lam_correct');
        }
    }

    function renderBadgesCabinet() {
        const heroBox = document.getElementById('heroRankHeroCardContainer');
        const badgesGrid = document.getElementById('badgesCabinetGrid');
        if (!heroBox || !badgesGrid) return;

        const rank = HERO_RANKS[GamificationState.currentRankIndex];
        const nextRank = HERO_RANKS[GamificationState.currentRankIndex + 1] || rank;
        const stars = GamificationState.totalStars;

        let xpPercent = 100;
        if (nextRank !== rank) {
            const range = nextRank.minStars - rank.minStars;
            const progress = stars - rank.minStars;
            xpPercent = Math.min(100, Math.max(0, Math.round((progress / range) * 100)));
        }

        heroBox.innerHTML = `
            <div class="hero-rank-hero-card">
                <div class="hero-rank-info">
                    <div class="hero-rank-avatar">${rank.avatar}</div>
                    <div class="hero-rank-title-group">
                        <h3>رتبتك الحالية: ${rank.title}</h3>
                        <div class="hero-rank-subtitle">${rank.desc}</div>
                    </div>
                </div>
                <div class="hero-xp-box">
                    <div class="hero-xp-labels">
                        <span>إجمالي النجوم: ${stars} ⭐</span>
                        <span>الرتبة التالية: ${nextRank.title}</span>
                    </div>
                    <div class="hero-xp-track">
                        <div class="hero-xp-fill" style="width: ${xpPercent}%;"></div>
                    </div>
                </div>
            </div>
        `;

        let badgesHtml = '';
        ROYAL_BADGES.forEach(b => {
            const isUnlocked = GamificationState.unlockedBadges.includes(b.id);
            badgesHtml += `
                <div class="badge-card ${isUnlocked ? 'unlocked' : 'locked'}" onclick="showBadgeCardModal('${b.title}', '${b.desc}', ${isUnlocked})">
                    <div class="badge-icon-box">${b.icon}</div>
                    <div class="badge-info">
                        <h4 class="badge-title">${b.title}</h4>
                        <div class="badge-desc">${b.desc}</div>
                        <span class="badge-status-pill">${isUnlocked ? 'مكتسب ومفتوح ✅' : 'قيد التحدي 🔒'}</span>
                    </div>
                </div>
            `;
        });

        badgesGrid.innerHTML = badgesHtml;
    }

    window.showBadgeCardModal = function (title, desc, isUnlocked) {
        if (isUnlocked) {
            playStarChimeSFX();
            if (window.mascotSpeak) {
                window.mascotSpeak(`وسام الفخر: ${title}! ${desc}`, 'lam_correct');
            }
        } else {
            if (window.mascotSpeak) {
                window.mascotSpeak(`هذا الوسام بانتظارك: ${title}! ${desc}`, 'mascot_hint');
            }
        }
    };

    // ==========================================================================
    // 10. شهادة بطل التحدي الفاخرة للطباعة والتنزيل (Victory Certificate)
    // ==========================================================================
    function renderVictoryCertificate() {
        const container = document.getElementById('victoryCertificateContainer');
        if (!container) return;

        // قراءة اسم التلميذ المحفوظ من الملف الشخصي
        let studentName = 'بَطَلُ قِرَاءَتِي الذَّكِيَّة';
        try {
            const profileStr = localStorage.getItem(STORAGE_KEY_PROFILE);
            if (profileStr) {
                const profile = JSON.parse(profileStr);
                if (profile && profile.name) studentName = profile.name;
            }
        } catch (e) {}

        const today = new Date();
        const dateStr = `${today.getDate()} / ${today.getMonth() + 1} / ${today.getFullYear()} م`;
        const rank = HERO_RANKS[GamificationState.currentRankIndex];

        container.innerHTML = `
            <div class="cert-actions-toolbar" style="display: flex; justify-content: flex-end; gap: 8px; margin-bottom: 12px;">
                <button type="button" class="btn btn-teach" style="background: #059669; padding: 8px 18px;" onclick="printVictoryCertificate()">
                    <span>🖨️</span> <span>طباعة الشهادة (A4 جاهزة)</span>
                </button>
            </div>

            <div class="cert-printable-container">
                <span class="cert-corner-ornament cert-corner-tl">⚜️</span>
                <span class="cert-corner-ornament cert-corner-tr">⚜️</span>
                <span class="cert-corner-ornament cert-corner-bl">⚜️</span>
                <span class="cert-corner-ornament cert-corner-br">⚜️</span>

                <div class="cert-header-emblem">🏆</div>
                <h1 class="cert-main-title">شَهَادَةُ بَطَلِ التَّحَدِّي وَالتَّفَوُّقِ القِرَائِيّ</h1>
                <div class="cert-main-subtitle">مَنْصَةُ قِرَاءَتِي التَّفَاعُلِيَّةِ الذَّكِيَّة • الصَّفُّ الأَوَّلُ الاِبْتِدَائِيّ</div>

                <div class="cert-body-text">
                    تَشْهَدُ إِدَارَةُ مَنْصَةِ قِرَاءَتِي التَّفَاعُلِيَّةِ بِأَنَّ التِّلْمِيذَ المَبْدَع / التِّلْمِيذَةَ المُتَأَلِّقَة:
                    <br>
                    <div class="cert-student-highlight" id="certEditableName" contenteditable="true" title="انقر لتعديل الاسم مباشرة">
                        ${(window.qiraatiEscapeHtml || (v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))))(studentName)}
                    </div>
                    <br>
                    قَدْ حَقَّقَ مَرْتَبَةَ الشَّرَفِ وَأَكْمَلَ سِلْسِلَةَ اخْتِبَارَاتِ التَّحَدِّي الذَّكِيَّة، وَحَصَدَ رَصِيداً قَدْرُهُ 
                    <b style="color: #d97706;">(${GamificationState.totalStars}) نَجْمَةً ذَهَبِيَّةً</b>، 
                    وَاسْتَحَقَّ بِجَدَارَةٍ رُتْبَةَ:
                    <b style="color: #047857;">«${rank.title}»</b>
                    لِتَمَيُّزِهِ فِي الوَعْيِ الفُونِيمِيِّ وَتَرْكِيبِ الكَلِمَاتِ وَالطَّلَاقَةِ القِرَائِيَّة.
                </div>

                <div class="cert-signatures-row">
                    <div style="text-align: right;">
                        <div class="cert-sig-title">تَارِيخُ التَّتْوِيج:</div>
                        <div class="cert-sig-name" style="font-size: 1rem; color: #475569;">${dateStr}</div>
                    </div>

                    <div class="cert-seal-box">
                        <div class="cert-gold-seal">★</div>
                        <div style="font-size: 0.76rem; font-weight: 800; color: #92400e; margin-top: 4px;">الخَتْمُ الذَّهَبِيُّ المَعْتَمَد</div>
                    </div>

                    <div class="cert-signature-author">
                        <div class="cert-sig-title">إِعْدَادُ وَتَطْوِيرُ المَنْصَة:</div>
                        <div class="cert-sig-name">المُهَنْدِسُ أُسَامَةُ خَلِيل هَاشِم</div>
                    </div>
                </div>
            </div>
        `;
    }

    window.printVictoryCertificate = function () {
        window.print();
    };

    // ==========================================================================
    // 11. لوحة الذكاء والتقييم القرائي (Analytics & Mastery)
    // ==========================================================================
    function renderAnalyticsMastery() {
        const container = document.getElementById('analyticsMasteryContainer');
        if (!container) return;

        const stats = GamificationState.stats;
        const total = stats.totalAnswered || 0;
        const correct = stats.totalCorrect || 0;
        const accuracy = total > 0 ? Math.round((correct / total) * 100) : 100;

        container.innerHTML = `
            <div class="analytics-cards-grid">
                <div class="analytics-card">
                    <div class="analytics-card-header">
                        <div class="analytics-card-title"><span>🎯</span> <span>مؤشر الدقة القرائية</span></div>
                        <span class="gamification-stat-badge" style="background: #ecfdf5; color: #047857; border-color: #a7f3d0;">${accuracy}%</span>
                    </div>
                    <div class="skill-mastery-bar-container">
                        <div class="skill-mastery-row">
                            <div class="skill-mastery-meta">
                                <span>الإجابات الصحيحة: ${correct}</span>
                                <span>إجمالي الأسئلة: ${total}</span>
                            </div>
                            <div class="skill-mastery-track">
                                <div class="skill-mastery-fill" style="width: ${accuracy}%; background: #10b981;"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="analytics-card">
                    <div class="analytics-card-header">
                        <div class="analytics-card-title"><span>🔥</span> <span>أطول سلسلة إجابات بدون خطأ</span></div>
                        <span class="gamification-stat-badge" style="background: #fef2f2; color: #dc2626; border-color: #fecaca;">${stats.streaksMax} متتالية</span>
                    </div>
                    <div style="font-size: 0.85rem; color: #475569; font-weight: 700; line-height: 1.5;">
                        تعكس السلسلة النارية تركيز التلميذ العالي واستقراره الذهني أثناء حل التحديات.
                    </div>
                </div>

                <div class="analytics-card">
                    <div class="analytics-card-header">
                        <div class="analytics-card-title"><span>🏆</span> <span>جولات التحدي المنجزة</span></div>
                        <span class="gamification-stat-badge" style="background: #eff6ff; color: #1d4ed8; border-color: #bfdbfe;">${stats.sessionsCompleted} جولة</span>
                    </div>
                    <div style="font-size: 0.85rem; color: #475569; font-weight: 700; line-height: 1.5;">
                        كل جولة منجزة ترفع من دافعية التلميذ وتبني عادة القراءة اليومية التفاعلية.
                    </div>
                </div>
            </div>

            <!-- تفصيل المجالات الخمسة -->
            <div style="background: white; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 20px;">
                <h3 style="margin-top: 0; font-size: 1.1rem; color: #1e293b; font-weight: 900; display: flex; align-items: center; gap: 8px;">
                    <span>📊</span> <span>مصفوفة إتقان المهارات القرائية الخمس:</span>
                </h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px; margin-top: 14px;">
                    ${renderSkillRow('الوعي الفونيمي والأصوات', 95, '#059669', 'تمياز الصوت الأول والأخير والمدود')}
                    ${renderSkillRow('التحليل والتركيب المقطعي', 92, '#2563eb', 'دمج المقاطع لإنتاج كلمات')}
                    ${renderSkillRow('الحروف الهجائية ومواقعها', 96, '#7c3aed', 'التعرف على أشكال الحروف')}
                    ${renderSkillRow('الظواهر اللغوية (الشدة واللام)', 88, '#d97706', 'اللام الشمسية والقمرية والسكون')}
                    ${renderSkillRow('فهم المقروء والطلاقة', 94, '#047857', 'ربط الجمل بالمشاهد المصورة')}
                </div>
            </div>
        `;
    }

    function renderSkillRow(name, percent, color, sub) {
        return `
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px;">
                <div style="display: flex; justify-content: space-between; font-weight: 900; font-size: 0.88rem; color: #1e293b;">
                    <span>${name}</span>
                    <span style="color: ${color};">${percent}%</span>
                </div>
                <div style="font-size: 0.74rem; color: #64748b; margin: 4px 0 6px 0;">${sub}</div>
                <div style="height: 6px; background: #e2e8f0; border-radius: 6px; overflow: hidden;">
                    <div style="width: ${percent}%; height: 100%; background: ${color}; border-radius: 6px;"></div>
                </div>
            </div>
        `;
    }

    // ==========================================================================
    // 12. محرك الجزيئات البصرية والنجوم الطائرة (3D Floating Stars)
    // ==========================================================================
    function triggerFloatingStarsFromElement(el, count = 2) {
        let startX = window.innerWidth / 2;
        let startY = window.innerHeight / 2;

        if (el) {
            const rect = el.getBoundingClientRect();
            startX = rect.left + rect.width / 2;
            startY = rect.top + rect.height / 2;
        }

        let targetEl = document.getElementById('topStarsWidget') || document.getElementById('gamificationModalStarsTotal');
        let targetX = 80;
        let targetY = 30;

        if (targetEl) {
            const tRect = targetEl.getBoundingClientRect();
            targetX = tRect.left + tRect.width / 2;
            targetY = tRect.top + tRect.height / 2;
        }

        let canvas = document.getElementById('gamificationStarsCanvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'gamificationStarsCanvas';
            document.body.appendChild(canvas);
        }

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const stars = [];
        for (let i = 0; i < count * 4; i++) {
            stars.push({
                x: startX + (Math.random() - 0.5) * 40,
                y: startY + (Math.random() - 0.5) * 40,
                vx: (Math.random() - 0.5) * 8,
                vy: -Math.random() * 8 - 4,
                targetX: targetX,
                targetY: targetY,
                phase: 'scatter',
                size: Math.random() * 12 + 16,
                progress: 0,
                alpha: 1,
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 10
            });
        }

        let animId;
        function render() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let active = 0;

            stars.forEach(s => {
                if (s.alpha > 0) {
                    active++;
                    if (s.phase === 'scatter') {
                        s.x += s.vx;
                        s.y += s.vy;
                        s.vy += 0.3; // Gravity
                        s.vx *= 0.94;
                        if (s.vy > 1) {
                            s.phase = 'seek';
                        }
                    } else {
                        // الحركة السريعة نحو رصيد النجوم في الأعلى
                        s.x += (s.targetX - s.x) * 0.18;
                        s.y += (s.targetY - s.y) * 0.18;
                        const dist = Math.hypot(s.targetX - s.x, s.targetY - s.y);
                        if (dist < 20) {
                            s.alpha -= 0.15;
                        }
                    }

                    s.rotation += s.rotSpeed;

                    ctx.save();
                    ctx.globalAlpha = Math.max(0, s.alpha);
                    ctx.translate(s.x, s.y);
                    ctx.rotate((s.rotation * Math.PI) / 180);
                    ctx.font = `${s.size}px sans-serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('⭐', 0, 0);
                    ctx.restore();
                }
            });

            if (active > 0) {
                animId = requestAnimationFrame(render);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                updateTopStarsWidget();
            }
        }

        render();
    }

    function triggerVictoryConfetti() {
        let canvas = document.getElementById('gamificationStarsCanvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'gamificationStarsCanvas';
            document.body.appendChild(canvas);
        }

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const colors = ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#ef4444', '#fbbf24'];

        for (let i = 0; i < 150; i++) {
            particles.push({
                x: canvas.width / 2,
                y: canvas.height * 0.45,
                vx: (Math.random() - 0.5) * 16,
                vy: (Math.random() - 0.7) * 16,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: 1,
                decay: Math.random() * 0.015 + 0.008,
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 14
            });
        }

        function render() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let active = 0;

            particles.forEach(p => {
                if (p.alpha > 0) {
                    active++;
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.35;
                    p.alpha -= p.decay;
                    p.rotation += p.rotSpeed;

                    ctx.save();
                    ctx.globalAlpha = Math.max(0, p.alpha);
                    ctx.translate(p.x, p.y);
                    ctx.rotate((p.rotation * Math.PI) / 180);
                    ctx.fillStyle = p.color;
                    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
                    ctx.restore();
                }
            });

            if (active > 0) {
                requestAnimationFrame(render);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }

        render();
    }

    // أداة مساعدة لخلط المصفوفة عشوائياً
    function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    // ==========================================================================
    // 13. منح النجوم من منظومة حفظ التقدم وتهيئة النظام عند تحميل الصفحة
    // ==========================================================================
    window.awardGamificationStars = function (delta, reason) {
        const amount = parseInt(delta, 10) || 0;
        if (amount === 0) return GamificationState.totalStars;
        GamificationState.totalStars = Math.max(0, (GamificationState.totalStars || 0) + amount);
        saveGamificationData();
        if (typeof renderAnalyticsView === 'function') renderAnalyticsView();
        return GamificationState.totalStars;
    };

    window.addEventListener('DOMContentLoaded', () => {
        loadGamificationData();
    });

})();
