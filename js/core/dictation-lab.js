/* ==========================================================================
 * منصة قراءتي التفاعلية الذكية - مختبر الإملاء المنظور والاختباري بالتحليل الصوتي الفوري
 * (Smart Phonics Spelling & Dictation Lab for Tablets & Interactive Whiteboards)
 * متوافق 100% مع كتاب قراءتي الجديد ومعايير وزارة التربية العراقية أوفلاين
 * إعداد وتطوير: المهندس أسامة خليل هاشم
 * ========================================================================== */

(function () {
    'use strict';

    // مفاتيح التخزين المعزولة الملتزمة بقواعد أسامة (البادئة qiraati-smart-)
    const STORAGE_KEY_STATS = 'qiraati-smart-dictation-stats';
    const STORAGE_KEY_HISTORY = 'qiraati-smart-dictation-history';
    const STORAGE_KEY_SETTINGS = 'qiraati-smart-dictation-settings';

    // ==========================================================================
    // 1. بنك كلمات الإملاء الشامل لمنهج قراءتي للصف الأول الابتدائي
    // ==========================================================================
    const CURRICULUM_DICTATION_BANK = [
        // الوحدة الأولى
        { id: 'dar', word: 'دَار', unit: 'unit1', skill: 'mad_alif', skillName: 'مد الألف', syllables: ['دَا', 'رْ'], audioKey: 'word_dar', hint: 'تتكون من مقطع ممدود (دَا) وصوت ساكن (رْ).' },
        { id: 'dada', word: 'دَادَا', unit: 'unit1', skill: 'mad_alif', skillName: 'مد الألف', syllables: ['دَا', 'دَا'], audioKey: 'word_dada', hint: 'مقطعان متماثلان بالمد الطويل (دَا + دَا).' },
        { id: 'door', word: 'دُور', unit: 'unit1', skill: 'mad_waw', skillName: 'مد الواو', syllables: ['دُو', 'رْ'], audioKey: 'word_door', hint: 'انتبه لصوت مد الواو الطويل (دُو) متبوعاً بحرف الراء.' },
        { id: 'dood', word: 'دُود', unit: 'unit1', skill: 'mad_waw', skillName: 'مد الواو', syllables: ['دُو', 'دْ'], audioKey: 'sound_du', hint: 'مد الواو الطويل في الوسط بين حرفي الدال.' },
        { id: 'bab', word: 'بَاب', unit: 'unit1', skill: 'mad_alif', skillName: 'مد الألف', syllables: ['بَا', 'بْ'], audioKey: 'word_bab', hint: 'يبدأ بمقطع ممدود بالباء (بَا) وينتهي بباء ساكنة.' },
        { id: 'mama', word: 'مَامَا', unit: 'unit1', skill: 'mad_alif', skillName: 'مد الألف', syllables: ['مَا', 'مَا'], audioKey: 'word_mama', hint: 'مقطعان متماثلان بمد الألف (مَا + مَا).' },
        { id: 'noor', word: 'نُور', unit: 'unit1', skill: 'mad_waw', skillName: 'مد الواو', syllables: ['نُو', 'رْ'], audioKey: 'word_noor', hint: 'صوت النون المضمومة مع مد الواو الطويل (نُو).' },
        { id: 'reem', word: 'رِيم', unit: 'unit1', skill: 'mad_yaa', skillName: 'مد الياء', syllables: ['رِي', 'مْ'], audioKey: 'word_reem', hint: 'مد الياء الطويل الهادئ (رِي) ثم حرف الميم.' },
        { id: 'ban', word: 'بَان', unit: 'unit1', skill: 'mad_alif', skillName: 'مد الألف', syllables: ['بَا', 'نْ'], audioKey: 'word_ban', hint: 'مقطع (بَا) متبوع بحرف النون.' },
        { id: 'naam', word: 'نَام', unit: 'unit1', skill: 'mad_alif', skillName: 'مد الألف', syllables: ['نَا', 'مْ'], audioKey: 'word_naam', hint: 'مقطع (نَا) متبوع بحرف الميم.' },
        { id: 'deena', word: 'دِينَا', unit: 'unit1', skill: 'mad_yaa', skillName: 'مد الياء والألف', syllables: ['دِي', 'نَا'], audioKey: 'word_deena', hint: 'يجمع بين مد الياء (دِي) ومد الألف (نَا).' },
        { id: 'dari', word: 'دَارِي', unit: 'unit1', skill: 'mad_yaa', skillName: 'مد الألف والياء', syllables: ['دَا', 'رِي'], audioKey: 'word_dari', hint: 'مقطعان ممدودان (دَا) ثم (رِي).' },

        // الوحدة الثانية
        { id: 'mizan', word: 'مِيزَان', unit: 'unit2', skill: 'mad_yaa', skillName: 'مد الياء والألف', syllables: ['مِي', 'زَا', 'نْ'], audioKey: 'word_mizan', hint: 'انتبه للكسرة الممدودة (مِي) ثم (زَا).' },
        { id: 'qaddouri', word: 'قَدُّورِي', unit: 'unit2', skill: 'shadda', skillName: 'الشدة والتضعيف', syllables: ['قَدْ', 'دُو', 'رِي'], audioKey: 'word_qaddouri', hint: 'الدال مشددة ومضاعفة (قَدْ + دُو + رِي).' },
        { id: 'wazzan', word: 'وَزَّان', unit: 'unit2', skill: 'shadda', skillName: 'الشدة والتضعيف', syllables: ['وَزْ', 'زَا', 'نْ'], audioKey: 'word_wazzan', hint: 'الزاي حرف مشدد قوي بعد الواو المفتوحة.' },
        { id: 'booq', word: 'بُوق', unit: 'unit2', skill: 'mad_waw', skillName: 'مد الواو', syllables: ['بُو', 'قْ'], audioKey: 'word_booq', hint: 'مد الواو (بُو) ثم القاف الشديدة المفخمة.' },
        { id: 'nadeem', word: 'نَدِيم', unit: 'unit2', skill: 'mad_yaa', skillName: 'مد الياء', syllables: ['نَ', 'دِي', 'مْ'], audioKey: 'sound_di', hint: 'فتحة قصيرة (نَ) ثم مد طويل (دِي).' },
        { id: 'mazin', word: 'مَازِن', unit: 'unit2', skill: 'short_vowels', skillName: 'الحركات القصيرة', syllables: ['مَا', 'زِ', 'نْ'], audioKey: 'word_mazin', hint: 'مد ألف في البداية (مَا) ثم كسرة خفيفة (زِ).' },
        { id: 'qalam', word: 'قَلَم', unit: 'unit2', skill: 'short_vowels', skillName: 'الحركات القصيرة', syllables: ['قَ', 'لَ', 'مْ'], audioKey: 'word_qalam', hint: 'كلمة ثلاثية بحركات قصيرة متتالية (قَ + لَ + مْ).' },
        { id: 'ward', word: 'وَرْد', unit: 'unit2', skill: 'short_vowels', skillName: 'السكون والحركات', syllables: ['وَرْ', 'دْ'], audioKey: 'word_ward', hint: 'مقطع ساكن قوي (وَرْ) يليه الدال.' },

        // الوحدة الثالثة
        { id: 'reef', word: 'رِيف', unit: 'unit3', skill: 'mad_yaa', skillName: 'مد الياء', syllables: ['رِي', 'فْ'], audioKey: 'word_reef', hint: 'مد الياء الصافي (رِي) ثم الفاء الرخوة.' },
        { id: 'manaf', word: 'مَنَاف', unit: 'unit3', skill: 'mad_alif', skillName: 'مد الألف', syllables: ['مَ', 'نَا', 'فْ'], audioKey: 'word_manaf', hint: 'فتحة (مَ) ثم مد ألف (نَا) ثم فاء.' },
        { id: 'baqar', word: 'بَقَر', unit: 'unit3', skill: 'short_vowels', skillName: 'الحركات القصيرة', syllables: ['بَ', 'قَ', 'رْ'], audioKey: 'word_baqar', hint: 'ثلاث حركات فتح سريعة متتالية.' },
        { id: 'wazz', word: 'وَزّ', unit: 'unit3', skill: 'shadda', skillName: 'الشدة والتضعيف', syllables: ['وَزْ', 'زْ'], audioKey: 'word_wazz', hint: 'واو مفتوحة تليها زاي مشددة قوية.' },
        { id: 'batt', word: 'بَطّ', unit: 'unit3', skill: 'shadda', skillName: 'الشدة والتضعيف', syllables: ['بَطْ', 'طْ'], audioKey: 'word_batt', hint: 'حرف الطاء مشدد ومفخم.' },
        { id: 'matar', word: 'مَطَر', unit: 'unit3', skill: 'short_vowels', skillName: 'الحركات القصيرة', syllables: ['مَ', 'طَ', 'رْ'], audioKey: 'word_matar', hint: 'انتبه لنطق وكتابة الطاء المفخمة وليس التاء.' },
        { id: 'nabeel', word: 'نَبِيل', unit: 'unit3', skill: 'mad_yaa', skillName: 'مد الياء', syllables: ['نَ', 'بِي', 'لْ'], audioKey: 'word_nabeel', hint: 'فتحة (نَ) ثم مد الياء للباء (بِي) ثم لام.' },
        { id: 'tayyar', word: 'طَيَّار', unit: 'unit3', skill: 'shadda', skillName: 'الشدة ومد الألف', syllables: ['طَيْ', 'يَا', 'رْ'], audioKey: 'word_tayyar', hint: 'الياء مشددة وممدودة بالألف بعد الطاء.' },

        // الوحدة الرابعة
        { id: 'alam', word: 'عَلَم', unit: 'unit4', skill: 'short_vowels', skillName: 'الحركات القصيرة', syllables: ['عَ', 'لَ', 'مْ'], audioKey: 'word_alam', hint: 'عين مفتوحة من وسط الحلق ثم لام وميم.' },
        { id: 'bilad', word: 'بِلَاد', unit: 'unit4', skill: 'mad_alif', skillName: 'مد الألف', syllables: ['بِ', 'لَا', 'دْ'], audioKey: 'word_bilad', hint: 'كسرة الباء (بِ) ثم مقطع (لَا) الممدود.' },
        { id: 'kitab', word: 'كِتَاب', unit: 'unit4', skill: 'mad_alif', skillName: 'مد الألف', syllables: ['كِ', 'تَا', 'بْ'], audioKey: 'word_kitab', hint: 'كاف مكسورة مرققة (كِ) ثم (تَا).' },
        { id: 'maktaba', word: 'مَكْتَبَة', unit: 'unit4', skill: 'ta_marboota', skillName: 'التاء المربوطة', syllables: ['مَكْ', 'تَ', 'بَ', 'ةْ'], audioKey: 'word_maktaba', hint: 'تنتهي بتاء مربوطة (ـة) تلفظ هاء عند الوقف.' },
        { id: 'banat', word: 'بَنَات', unit: 'unit4', skill: 'short_vowels', skillName: 'التاء المفتوحة', syllables: ['بَ', 'نَا', 'تْ'], audioKey: 'word_banat', hint: 'تنتهي بتاء مفتوحة صريحة (ت).' },
        { id: 'salma', word: 'سَلْمَى', unit: 'unit4', skill: 'mad_alif', skillName: 'الألف المقصورة', syllables: ['سَلْ', 'مَى'], audioKey: 'word_salma', hint: 'تنتهي بألف مقصورة على صورة الياء (ى).' },

        // الوحدة الخامسة
        { id: 'salah', word: 'صَلَاح', unit: 'unit5', skill: 'mad_alif', skillName: 'الصاد ومد الألف', syllables: ['صَ', 'لَا', 'حْ'], audioKey: 'word_salah', hint: 'صاد مفخمة مطبقة (صَ) وليس سيناً.' },
        { id: 'fallah', word: 'فَلَّاح', unit: 'unit5', skill: 'shadda', skillName: 'الشدة ومد الألف', syllables: ['فَلْ', 'لَا', 'حْ'], audioKey: 'word_fallah', hint: 'اللام مشددة ممدودة بالألف (لَّا).' },
        { id: 'haql', word: 'حَقْل', unit: 'unit5', skill: 'short_vowels', skillName: 'الحاء والقاف الساكنة', syllables: ['حَقْ', 'لْ'], audioKey: 'word_haql', hint: 'قاف ساكنة مقلقلة بعد الحاء المفتوحة.' },
        { id: 'hawdh', word: 'حَوْض', unit: 'unit5', skill: 'short_vowels', skillName: 'الضاد الساكنة', syllables: ['حَوْ', 'ضْ'], audioKey: 'word_hawdh', hint: 'تنتهي بحرف الضاد المفخم المجهور.' },
        { id: 'khayma', word: 'خَيْمَة', unit: 'unit5', skill: 'ta_marboota', skillName: 'التاء المربوطة', syllables: ['خَيْ', 'مَ', 'ةْ'], audioKey: 'word_khayma', hint: 'تنتهي بتاء مربوطة متصلة (ـة).' },

        // الوحدة السادسة
        { id: 'shurti', word: 'شُرْطِيّ', unit: 'unit6', skill: 'shadda', skillName: 'الشدة والتضعيف', syllables: ['شُرْ', 'طِيْ', 'يْ'], audioKey: 'word_shurti', hint: 'انتبه لحرف الطاء والياء المشددة في النهاية.' },
        { id: 'muroor', word: 'مُرُور', unit: 'unit6', skill: 'mad_waw', skillName: 'مد الواو', syllables: ['مُ', 'رُو', 'رْ'], audioKey: 'word_muroor', hint: 'ضمة الميم (مُ) ثم مد الواو للراء (رُو).' },
        { id: 'athath', word: 'أُثَاث', unit: 'unit6', skill: 'mad_alif', skillName: 'الثاء والهمزة', syllables: ['أُ', 'ثَا', 'ثْ'], audioKey: 'word_athath', hint: 'همزة مضمومة ثم حرف الثاء اللثوي الممدود.' },
        { id: 'ghazal', word: 'غَزَال', unit: 'unit6', skill: 'mad_alif', skillName: 'الغين ومد الألف', syllables: ['غَ', 'زَا', 'لْ'], audioKey: 'word_ghazal', hint: 'غين مفتوحة ثم زاي ممدودة بالألف (زَا).' },
        { id: 'mahfooth', word: 'مَحْفُوظ', unit: 'unit6', skill: 'mad_waw', skillName: 'الظاء ومد الواو', syllables: ['مَحْ', 'فُو', 'ظْ'], audioKey: 'word_mahfooth', hint: 'تنتهي بحرف الظاء المفخم اللثوي (ظ).' },
        { id: 'natheef', word: 'نَظِيف', unit: 'unit6', skill: 'mad_yaa', skillName: 'الظاء ومد الياء', syllables: ['نَ', 'ظِي', 'فْ'], audioKey: 'word_natheef', hint: 'ظاء مكسورة ممدودة بالياء (ظِي).' },
        { id: 'hilal', word: 'هِلَال', unit: 'unit6', skill: 'mad_alif', skillName: 'الهاء ومد الألف', syllables: ['هِ', 'لَا', 'لْ'], audioKey: 'word_hilal', hint: 'هاء مكسورة خفيفة تليها اللام ألف (لَا).' }
    ];

    // جدول الأزواج الصوتية المشتبهة والمتقاربة في المخارج
    const CONFUSABLE_PAIRS = {
        'ت': { pair: 'ط', name: 'التاء / الطاء', diff: 'التاء مرققة هامسة (تِين)، والطاء مفخمة مطبقة قوية (طِين).' },
        'ط': { pair: 'ت', name: 'الطاء / التاء', diff: 'الطاء مفخمة مستعلية (طَلَب)، والتاء مرققة رقيقة (تَلَف).' },
        'د': { pair: 'ض', name: 'الدال / الضاد', diff: 'الدال مرققة من أصول الثنايا (دَار)، والضاد مفخمة من حافة اللسان (ضَوْء).' },
        'ض': { pair: 'د', name: 'الضاد / الدال', diff: 'الضاد حرف استطالة وتفخيم (حَوْض)، والدال مرققة (حَد).' },
        'س': { pair: 'ص', name: 'السين / الصاد', diff: 'السين مرققة صافية (سَيْف)، والصاد مفخمة مطبقة (صَيْف).' },
        'ص': { pair: 'س', name: 'الصاد / السين', diff: 'الصاد مفخمة ومستعلية (صَلَاح)، والسين مرققة (سَلَام).' },
        'ذ': { pair: 'ز', name: 'الذال / الزاي', diff: 'الذال لثوية نخرج فيها طرف اللسان (ذُبَاب)، والزاي صوت صفير داخل الفم (زَرَافَة).' },
        'ز': { pair: 'ذ', name: 'الزاي / الذال', diff: 'الزاي لا يخرج فيها اللسان (وَزَّان)، أما الذال فنخرج طرف اللسان.' },
        'ق': { pair: 'ك', name: 'القاف / الكاف', diff: 'القاف من أقصى اللسان مفخمة عميقة (قَلَم)، والكاف مرققة مهموسة (كِتَاب).' },
        'ك': { pair: 'ق', name: 'الكاف / القاف', diff: 'الكاف مرققة لطيفة (كَلْب)، والقاف مفخمة شديدة (قَلْب).' },
        'ح': { pair: 'هـ', name: 'الحاء / الهاء', diff: 'الحاء من وسط الحلق صافية (حَقْل)، والهاء من أقصى الحلق خفيفة (هِلَال).' },
        'هـ': { pair: 'ح', name: 'الهاء / الحاء', diff: 'الهاء تخرج بهمس وخفاء من أقصى الصدر (هِمَّة)، والحاء بحشرجة وسط الحلق (حِمَّة).' },
        'ع': { pair: 'أ', name: 'العين / الهمزة', diff: 'العين من وسط الحلق واضحة (عَلَم)، والهمزة بنبرة حادة من الحنجرة (أَمَل).' },
        'أ': { pair: 'ع', name: 'الهمزة / العين', diff: 'الهمزة نبرية حادة (أَثَاث)، والعين صوت حلقي سلس (عَبِير).' },
        'خ': { pair: 'غ', name: 'الخاء / الغين', diff: 'الخاء مهموسة احتكاكية (خَيْمَة)، والغين مجهورة عميقة (غَزَال).' },
        'غ': { pair: 'خ', name: 'الغين / الخاء', diff: 'الغين مجهورة باهتزاز الحبال (غَابَة)، والخاء مهموسة جافة (خَابَ).' }
    };

    // ==========================================================================
    // 2. حالة التطبيق والمحرك (Engine State)
    // ==========================================================================
    const State = {
        currentTab: 'seen',           // 'seen', 'blind', 'whiteboard', 'bank', 'diagnostics', 'worksheet', 'stats'
        currentWordItem: CURRICULUM_DICTATION_BANK[0],
        inputCharacters: [],          // مصفوفة الحروف المدخلة حالياً
        activeSlotIndex: 0,
        isWordHidden: false,          // هل تم إخفاء الكلمة في الإملاء المنظور؟
        timerSeconds: 5,
        timerInterval: null,
        scrambledLetters: [],
        usedTileIndices: new Set(),
        filterUnit: 'all',
        filterSkill: 'all',
        // أدوات السبورة
        wbCanvas: null,
        wbCtx: null,
        wbDrawing: false,
        wbTool: 'pen',                // 'pen', 'corrector', 'highlighter', 'eraser'
        wbColor: '#1e1b4b',
        wbWidth: 4,
        wbUndoStack: [],
        wbMaxUndo: 25,
        lastX: 0,
        lastY: 0
    };

    // ==========================================================================
    // 3. خوارزميات المعالجة الفونيمية والتطبيع والتحليل
    // ==========================================================================

    // إزالة علامات التشكيل بدقة
    function stripDiacritics(str) {
        if (!str) return '';
        return str.replace(/[\u064B-\u0652\u0670]/g, '');
    }

    // تطبيع الحروف للمقارنة الفونيمية المرنة
    function normalizeArabic(str) {
        if (!str) return '';
        let s = stripDiacritics(str.trim());
        s = s.replace(/[إأآٱ]/g, 'ا');
        s = s.replace(/ة/g, 'ه');
        s = s.replace(/ى/g, 'ي');
        return s;
    }

    // تقطيع الكلمة العربية إلى مقاطع فونيمية أولية
    function segmentArabicWordPhonics(wordWithTashkeel) {
        if (!wordWithTashkeel) return [];
        // التقطيع حسب تراكيب المدود والسكون والحركات
        const raw = wordWithTashkeel.trim();
        const chars = raw.split('');
        const syllables = [];
        let cur = '';

        for (let i = 0; i < chars.length; i++) {
            const ch = chars[i];
            cur += ch;
            const nextCh = chars[i + 1] || '';
            const isMad = (ch === 'ا' || ch === 'و' || ch === 'ي' || ch === 'ى');
            const isSukun = (nextCh === 'ْ');
            const isNextHaraka = /[\u064E\u064F\u0650]/.test(nextCh);

            if (isMad || isSukun || i === chars.length - 1) {
                if (cur.trim()) {
                    syllables.push(cur.trim());
                    cur = '';
                }
            }
        }
        if (cur.trim()) syllables.push(cur.trim());
        return syllables.length > 0 ? syllables : [raw];
    }

    // ==========================================================================
    // 4. محرك التشخيص الإملائي التلقائي الفوري (Phonic Error Diagnostics)
    // ==========================================================================
    function diagnoseSpellingError(pupilInput, targetWordWithTashkeel) {
        const pupilClean = stripDiacritics(pupilInput || '').trim();
        const targetClean = stripDiacritics(targetWordWithTashkeel || '').trim();

        // 1. التطابق التام
        if (pupilClean === targetClean) {
            return {
                isCorrect: true,
                errorType: null,
                message: 'أحسنت يا بطل! إملاء متقن بنسبة 100%!',
                advice: 'ما شاء الله! قمت بكتابة الكلمة وتحديد حروفها ومقاطعها بالشكل الصحيح تماماً.',
                diffAlignment: generateDiffAlignment(pupilClean, targetClean)
            };
        }

        // 2. تحليل الفوارق بالمصفوفة
        const diff = generateDiffAlignment(pupilClean, targetClean);
        let errorType = 'general';
        let adviceMsg = 'راجع حروف الكلمة بعناية واستمع إلى نطقها الصوتي مرة أخرى.';
        let confusablePairData = null;

        // أ. فحص خطأ التنوين مقابل النون الساكنة (مثل: كتابن -> كتاب)
        if (pupilClean.endsWith('ن') && !targetClean.endsWith('ن')) {
            errorType = 'tanween_vs_noon';
            adviceMsg = 'تنبيه يا بطل: التنوين نونٌ ساكنة تُلفظ عند الوصل ولا تُكتب! جرب الوقف على الكلمة بالسكون، فإن سكنت دون نون، نكتب تنويناً ( ٌ ً ٍ ) وليس حرف النون!';
        }
        // ب. فحص اللام الشمسية (مثل: اشمس -> الشمس، اربيع -> الربيع)
        else if (pupilClean.startsWith('ا') && !pupilClean.startsWith('ال') && targetClean.startsWith('ال')) {
            errorType = 'solar_lam_omission';
            adviceMsg = 'انتبه يا ذكي: اللام الشمسية تُكتب ولا تُلفظ لأنها تدغم في الحرف المشدد بعدها! لا تنسَ كتابة اللام (الـ).';
        }
        // ج. فحص التاء المربوطة والمفتوحة والهاء (مثل: مدرست -> مدرسة، او مدرسه -> مدرسة)
        else if ((pupilClean.endsWith('ت') && targetClean.endsWith('ة')) || (pupilClean.endsWith('ه') && targetClean.endsWith('ة'))) {
            errorType = 'ta_marboota_error';
            adviceMsg = 'قاعدة التاء المربوطة: انطق الكلمة بوقوف ساكن! إذا نُطقت (هـ) ساكنة فهي تاء مربوطة منقوطة (ـة / ة)، وإذا نطقت (ت) فهي تاء مفتوحة.';
        }
        // د. فحص أزواج المخارج الصوتية المتقاربة (ت/ط، د/ض، س/ص، إلخ)
        else {
            for (let i = 0; i < Math.min(pupilClean.length, targetClean.length); i++) {
                const pChar = pupilClean[i];
                const tChar = targetClean[i];
                if (pChar !== tChar && CONFUSABLE_PAIRS[tChar] && CONFUSABLE_PAIRS[tChar].pair === pChar) {
                    errorType = 'confusable_pair';
                    confusablePairData = CONFUSABLE_PAIRS[tChar];
                    adviceMsg = `انتبه للصوت يا بطل! لقد استبدلت حرف (${tChar}) بحرف (${pChar}). ${confusablePairData.diff}`;
                    break;
                }
            }
        }

        // هـ. فحص المد مقابل الحركة القصيرة (زيادة أو نقصان حرف المد)
        if (errorType === 'general') {
            const hasExtraMad = (pupilClean.includes('ا') && !targetClean.includes('ا')) ||
                               (pupilClean.includes('و') && !targetClean.includes('و')) ||
                               (pupilClean.includes('ي') && !targetClean.includes('ي'));
            const isMissingMad = (!pupilClean.includes('ا') && targetClean.includes('ا')) ||
                                (!pupilClean.includes('و') && targetClean.includes('و')) ||
                                (!pupilClean.includes('ي') && targetClean.includes('ي'));

            if (hasExtraMad) {
                errorType = 'extra_long_vowel';
                adviceMsg = 'لقد أطلت الصوت وكتبت مدّاً طويلاً (ا، و، ي)، بينما الصوت هنا حركة قصيرة خفيفة (فتحة، ضمة، كسرة) فقط!';
            } else if (isMissingMad) {
                errorType = 'missing_long_vowel';
                adviceMsg = 'الصوت هنا ممدود وطويل! لا تنسَ إضافة حرف المد المناسب (الألف بعد الفتحة، أو الواو بعد الضمة، أو الياء بعد الكسرة).';
            }
        }

        return {
            isCorrect: false,
            errorType: errorType,
            message: 'هناك خطأ إملائي بسيط! دعنا نكتشفه ونصححه سوياً.',
            advice: adviceMsg,
            confusablePair: confusablePairData,
            diffAlignment: diff
        };
    }

    // خوارزمية محاذاة الفوارق التفصيلية (Diff Alignment)
    function generateDiffAlignment(pupilClean, targetClean) {
        const pArr = pupilClean.split('');
        const tArr = targetClean.split('');
        const alignment = [];
        const maxLen = Math.max(pArr.length, tArr.length);

        for (let i = 0; i < maxLen; i++) {
            const pChar = pArr[i] || '';
            const tChar = tArr[i] || '';

            if (pChar === tChar && pChar !== '') {
                alignment.push({ status: 'match', pupil: pChar, target: tChar });
            } else if (pChar && !tChar) {
                alignment.push({ status: 'extra', pupil: pChar, target: '' });
            } else if (!pChar && tChar) {
                alignment.push({ status: 'missing', pupil: '', target: tChar });
            } else {
                alignment.push({ status: 'mismatch', pupil: pChar, target: tChar });
            }
        }
        return alignment;
    }

    // ==========================================================================
    // 5. إدارة جلسة الإملاء والتفاعل البصري واللمسي
    // ==========================================================================

    function selectWordItem(wordId) {
        const item = CURRICULUM_DICTATION_BANK.find(w => w.id === wordId) || CURRICULUM_DICTATION_BANK[0];
        State.currentWordItem = item;
        resetSpellingSession();
        renderActiveWord();
        renderBankCards();
    }

    function resetSpellingSession() {
        State.inputCharacters = [];
        State.activeSlotIndex = 0;
        State.isWordHidden = false;
        State.usedTileIndices.clear();
        clearInterval(State.timerInterval);

        // إخفاء بطاقة النتيجة السابقة
        const resCard = document.getElementById('dlResultCard');
        if (resCard) resCard.style.display = 'none';

        // إعداد الحروف المبعثرة (Scrambled Tiles)
        prepareScrambledLetters();
    }

    function prepareScrambledLetters() {
        const targetClean = stripDiacritics(State.currentWordItem.word);
        const letters = targetClean.split('');
        // إضافة حرفين تمويهيين من المنهج لزيادة المتعة والتركيز
        const distractors = ['ر', 'د', 'ب', 'م', 'ن', 'و', 'ي', 'ل', 'س', 'ق'];
        const randomDistractor = distractors[Math.floor(Math.random() * distractors.length)];
        if (!letters.includes(randomDistractor) && letters.length < 6) {
            letters.push(randomDistractor);
        }
        // خلط الحروف عشوائياً
        State.scrambledLetters = letters.sort(() => Math.random() - 0.5);
    }

    function renderActiveWord() {
        const item = State.currentWordItem;
        const targetClean = stripDiacritics(item.word);

        // 1. عرض الكلمة في الإملاء المنظور
        const wordTextEl = document.getElementById('dlWordTargetText');
        const sylRowEl = document.getElementById('dlWordSyllablesRow');
        const displayCard = document.getElementById('dlWordDisplayCard');

        if (wordTextEl) {
            if (State.currentTab === 'blind') {
                wordTextEl.innerHTML = '<span style="color: #94a3b8; font-size: 2.2rem;">🎧 استمع واكتب الكلمة بدقة</span>';
                if (displayCard) displayCard.classList.add('hidden-mode');
                if (sylRowEl) sylRowEl.style.display = 'none';
            } else if (State.isWordHidden) {
                wordTextEl.innerHTML = '<span style="color: #64748b; font-size: 2.5rem;">🙈 تم إخفاء الكلمة! اكتب ما حفظت</span>';
                if (displayCard) displayCard.classList.add('hidden-mode');
                if (sylRowEl) sylRowEl.style.display = 'none';
            } else {
                wordTextEl.innerText = item.word;
                if (displayCard) displayCard.classList.remove('hidden-mode');
                if (sylRowEl) {
                    sylRowEl.style.display = 'flex';
                    const colors = ['c1', 'c2', 'c3', 'c4'];
                    sylRowEl.innerHTML = (item.syllables || [item.word]).map((s, idx) =>
                        `<span class="dl-syllable-pill ${colors[idx % colors.length]}">${s}</span>`
                    ).join('');
                }
            }
        }

        // 2. رسم خانات التهجئة الفارغة (Slots)
        renderSpellingSlots(targetClean.length);

        // 3. رسم بطاقات الحروف المبعثرة
        renderScrambledTiles();

        // 4. تحديث معلومات المهارة والوحدة
        const skillBadge = document.getElementById('dlActiveSkillBadge');
        if (skillBadge) skillBadge.innerText = `${item.skillName} • ${getUnitTitleArabic(item.unit)}`;
    }

    function renderSpellingSlots(targetLength) {
        const slotsWrapper = document.getElementById('dlSlotsWrapper');
        if (!slotsWrapper) return;

        slotsWrapper.innerHTML = '';
        for (let i = 0; i < targetLength; i++) {
            const slot = document.createElement('div');
            slot.className = 'dl-letter-slot';
            slot.id = `dlSlot_${i}`;
            const char = State.inputCharacters[i] || '';
            slot.innerText = char;

            if (i === State.activeSlotIndex) {
                slot.classList.add('active');
            }
            if (char) {
                slot.classList.add('filled');
            }

            slot.onclick = () => {
                State.activeSlotIndex = i;
                renderSlotFocus();
            };
            slotsWrapper.appendChild(slot);
        }
    }

    function renderSlotFocus() {
        const slotsWrapper = document.getElementById('dlSlotsWrapper');
        if (!slotsWrapper) return;
        const slots = slotsWrapper.querySelectorAll('.dl-letter-slot');
        slots.forEach((s, idx) => {
            if (idx === State.activeSlotIndex) s.classList.add('active');
            else s.classList.remove('active');
        });
    }

    function renderScrambledTiles() {
        const tilesRow = document.getElementById('dlScrambledTilesRow');
        if (!tilesRow) return;

        tilesRow.innerHTML = State.scrambledLetters.map((letter, idx) => {
            const isUsed = State.usedTileIndices.has(idx);
            return `<button class="dl-tile-btn ${isUsed ? 'used' : ''}" onclick="DictationLab.handleTileClick('${letter}', ${idx})" title="إدراج حرف ${letter}">${letter}</button>`;
        }).join('');
    }

    // ==========================================================================
    // 6. التعامل مع إدخال الأحرف (Touch Keyboard & Tiles & Physical Keys)
    // ==========================================================================

    function insertCharacter(char) {
        const targetClean = stripDiacritics(State.currentWordItem.word);
        if (State.inputCharacters.length < targetClean.length + 3) {
            State.inputCharacters[State.activeSlotIndex] = char;
            if (State.activeSlotIndex < targetClean.length - 1) {
                State.activeSlotIndex++;
            }
            updateSlotsUI();
            playKeyAudioFeedback(char);
        }
    }

    function applyDiacritic(diacritic) {
        if (State.activeSlotIndex >= 0 && State.inputCharacters[State.activeSlotIndex]) {
            State.inputCharacters[State.activeSlotIndex] += diacritic;
            updateSlotsUI();
            playAudioTone(600, 0.08);
        } else if (State.inputCharacters.length > 0) {
            const lastIdx = State.inputCharacters.length - 1;
            State.inputCharacters[lastIdx] += diacritic;
            updateSlotsUI();
            playAudioTone(600, 0.08);
        }
    }

    function backspaceCharacter() {
        if (State.activeSlotIndex >= 0 && State.inputCharacters[State.activeSlotIndex]) {
            State.inputCharacters[State.activeSlotIndex] = '';
            if (State.activeSlotIndex > 0) State.activeSlotIndex--;
        } else if (State.activeSlotIndex > 0) {
            State.activeSlotIndex--;
            State.inputCharacters[State.activeSlotIndex] = '';
        }
        // تحديث البلاطات المبعثرة إن كانت مستخدمة
        updateSlotsUI();
        playAudioTone(350, 0.05);
    }

    function clearAllCharacters() {
        State.inputCharacters = [];
        State.activeSlotIndex = 0;
        State.usedTileIndices.clear();
        updateSlotsUI();
        renderScrambledTiles();
        playAudioTone(280, 0.1);
    }

    function updateSlotsUI() {
        const targetClean = stripDiacritics(State.currentWordItem.word);
        for (let i = 0; i < targetClean.length; i++) {
            const slot = document.getElementById(`dlSlot_${i}`);
            if (slot) {
                const char = State.inputCharacters[i] || '';
                slot.innerText = char;
                if (char) slot.classList.add('filled');
                else slot.classList.remove('filled');

                if (i === State.activeSlotIndex) slot.classList.add('active');
                else slot.classList.remove('active');
            }
        }
    }

    function handleTileClick(letter, tileIndex) {
        if (State.usedTileIndices.has(tileIndex)) return;
        State.usedTileIndices.add(tileIndex);
        insertCharacter(letter);
        renderScrambledTiles();
    }

    // ==========================================================================
    // 7. التحقق والتقييم وعرض النتيجة التلقائية
    // ==========================================================================

    function checkCurrentSpelling() {
        const pupilString = State.inputCharacters.join('');
        const item = State.currentWordItem;
        const diagnosis = diagnoseSpellingError(pupilString, item.word);

        const resCard = document.getElementById('dlResultCard');
        if (!resCard) return;

        resCard.style.display = 'block';
        resCard.className = 'dl-result-card ' + (diagnosis.isCorrect ? 'success' : 'error');

        // الأيقونة والعناوين
        const resIcon = document.getElementById('dlResultIcon');
        const resTitle = document.getElementById('dlResultTitle');
        const resSubtitle = document.getElementById('dlResultSubtitle');

        if (resIcon) resIcon.innerText = diagnosis.isCorrect ? '🎉' : '🔍';
        if (resTitle) resTitle.innerText = diagnosis.isCorrect ? 'إجابة صحيحة ومتقنة!' : 'تحليل الخطأ والتصحيح الذكي';
        if (resSubtitle) resSubtitle.innerText = diagnosis.message;

        // عرض مقارنة الفوارق الدقيقة (Diff Alignment)
        const diffBox = document.getElementById('dlDiffContainer');
        if (diffBox) {
            diffBox.innerHTML = `
                <div class="dl-diff-row">
                    <span class="dl-diff-label">كتابتك يا بطل:</span>
                    <div class="dl-diff-letters">
                        ${diagnosis.diffAlignment.map(d => `<span class="dl-diff-char ${d.status}">${d.pupil || '—'}</span>`).join('')}
                    </div>
                </div>
                <div class="dl-diff-row">
                    <span class="dl-diff-label">الكلمة الصحيحة:</span>
                    <div class="dl-diff-letters">
                        ${diagnosis.diffAlignment.map(d => `<span class="dl-diff-char match">${d.target}</span>`).join('')}
                    </div>
                </div>
            `;
        }

        // نصيحة وتوجيه فصيح
        const faseehText = document.getElementById('dlFaseehAdviceText');
        const faseehAudioBtn = document.getElementById('dlFaseehAudioBtn');
        if (faseehText) faseehText.innerText = diagnosis.advice;

        if (faseehAudioBtn) {
            if (diagnosis.confusablePair) {
                faseehAudioBtn.style.display = 'inline-flex';
                faseehAudioBtn.onclick = () => playConfusablePairAudio(diagnosis.confusablePair);
            } else {
                faseehAudioBtn.style.display = 'none';
            }
        }

        // تسجيل النتيجة في الإحصائيات المحلية
        recordDictationSession(item, diagnosis.isCorrect, diagnosis.errorType);

        // احتفال فوري إذا كانت صحيحة
        if (diagnosis.isCorrect) {
            triggerCelebration();
            playSuccessAudio();
        } else {
            playAudioTone(240, 0.25);
        }
    }

    // ==========================================================================
    // 8. مؤقت الإخفاء التلقائي للإملاء المنظور (Timed Concealment)
    // ==========================================================================

    function startTimedConcealment(seconds) {
        clearInterval(State.timerInterval);
        State.timerSeconds = seconds;
        let remaining = seconds;
        const progressEl = document.getElementById('dlTimerProgress');

        if (progressEl) {
            progressEl.style.width = '100%';
            progressEl.style.transition = 'none';
            setTimeout(() => {
                progressEl.style.transition = `width ${seconds}s linear`;
                progressEl.style.width = '0%';
            }, 50);
        }

        State.timerInterval = setInterval(() => {
            remaining--;
            if (remaining <= 0) {
                clearInterval(State.timerInterval);
                concealWordNow();
            }
        }, 1000);
    }

    function concealWordNow() {
        clearInterval(State.timerInterval);
        State.isWordHidden = true;
        renderActiveWord();
        playAudioTone(440, 0.1);
    }

    function revealWordNow() {
        State.isWordHidden = false;
        renderActiveWord();
        playAudioTone(520, 0.1);
    }

    // ==========================================================================
    // 9. كانفاس السبورة الإملائية الذكية (Whiteboard Stylus Canvas)
    // ==========================================================================

    function initWhiteboardCanvas() {
        const canvas = document.getElementById('dlWhiteboardCanvas');
        if (!canvas) return;

        State.wbCanvas = canvas;
        State.wbCtx = canvas.getContext('2d');

        // ضبط أبعاد الكانفاس الحقيقية لتناسب كثافة الشاشة Retina
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = (rect.width || 850) * dpr;
        canvas.height = (rect.height || 380) * dpr;
        State.wbCtx.scale(dpr, dpr);

        drawRuledNotebookLines();
        saveWhiteboardState();

        // ربط أحداث القلم واللمس والماوس
        canvas.onpointerdown = handlePointerDown;
        canvas.onpointermove = handlePointerMove;
        canvas.onpointerup = handlePointerUp;
        canvas.onpointercancel = handlePointerUp;
    }

    function drawRuledNotebookLines() {
        const ctx = State.wbCtx;
        const canvas = State.wbCanvas;
        if (!ctx || !canvas) return;

        const w = canvas.getBoundingClientRect().width || 850;
        const h = canvas.getBoundingClientRect().height || 380;

        ctx.save();
        // خلفية بيضاء نقية
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);

        // خطوط كراسة النسخ الرسمية للمنهج العراقي
        const lineSpacing = 110;
        const startY = 80;

        for (let y = startY; y < h - 40; y += lineSpacing) {
            // خط الصعود (علوي منقط رمادي)
            ctx.beginPath();
            ctx.strokeStyle = '#94a3b8';
            ctx.setLineDash([6, 6]);
            ctx.lineWidth = 1.5;
            ctx.moveTo(20, y - 32);
            ctx.lineTo(w - 20, y - 32);
            ctx.stroke();

            // خط الأساس (أحمر عريض أساسي ترتكز عليه الحروف)
            ctx.beginPath();
            ctx.strokeStyle = '#ef4444';
            ctx.setLineDash([]);
            ctx.lineWidth = 2.5;
            ctx.moveTo(20, y);
            ctx.lineTo(w - 20, y);
            ctx.stroke();

            // خط الهبوط (سفلي رمادي منقط للحروف النازلة كـ ر، و، ز، م)
            ctx.beginPath();
            ctx.strokeStyle = '#cbd5e1';
            ctx.setLineDash([4, 4]);
            ctx.lineWidth = 1.5;
            ctx.moveTo(20, y + 26);
            ctx.lineTo(w - 20, y + 26);
            ctx.stroke();
        }

        // علامة حقوق المنصة المعتمدة
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 12px "Segoe UI", Tahoma, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('منصة قراءتي الذكية - سبورة كراسة الخط الرسمية • إعداد المهندس أسامة خليل هاشم', 30, h - 14);

        ctx.restore();
    }

    function handlePointerDown(e) {
        State.wbDrawing = true;
        const rect = State.wbCanvas.getBoundingClientRect();
        State.lastX = e.clientX - rect.left;
        State.lastY = e.clientY - rect.top;
    }

    function handlePointerMove(e) {
        if (!State.wbDrawing) return;
        const rect = State.wbCanvas.getBoundingClientRect();
        const curX = e.clientX - rect.left;
        const curY = e.clientY - rect.top;

        const ctx = State.wbCtx;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(State.lastX, State.lastY);
        ctx.lineTo(curX, curY);

        if (State.wbTool === 'eraser') {
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 28;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();
        } else if (State.wbTool === 'highlighter') {
            ctx.strokeStyle = 'rgba(250, 204, 21, 0.45)';
            ctx.lineWidth = 20;
            ctx.lineCap = 'square';
            ctx.stroke();
        } else if (State.wbTool === 'corrector') {
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 3.5;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();
        } else {
            ctx.strokeStyle = State.wbColor;
            ctx.lineWidth = State.wbWidth;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();
        }
        ctx.restore();

        State.lastX = curX;
        State.lastY = curY;
    }

    function handlePointerUp() {
        if (State.wbDrawing) {
            State.wbDrawing = false;
            saveWhiteboardState();
        }
    }

    function setWhiteboardTool(tool) {
        State.wbTool = tool;
        const tools = ['pen', 'corrector', 'highlighter', 'eraser'];
        tools.forEach(t => {
            const btn = document.getElementById(`dlWbBtn_${t}`);
            if (btn) {
                if (t === tool) btn.classList.add('active');
                else btn.classList.remove('active');
            }
        });
    }

    function setWhiteboardColor(colorHex) {
        State.wbColor = colorHex;
        State.wbTool = 'pen';
        setWhiteboardTool('pen');
    }

    function saveWhiteboardState() {
        if (!State.wbCanvas) return;
        if (State.wbUndoStack.length >= State.wbMaxUndo) {
            State.wbUndoStack.shift();
        }
        State.wbUndoStack.push(State.wbCanvas.toDataURL());
    }

    function undoWhiteboard() {
        if (State.wbUndoStack.length <= 1) return;
        State.wbUndoStack.pop();
        const prevDataUrl = State.wbUndoStack[State.wbUndoStack.length - 1];
        const img = new Image();
        img.onload = () => {
            const rect = State.wbCanvas.getBoundingClientRect();
            State.wbCtx.clearRect(0, 0, rect.width, rect.height);
            State.wbCtx.drawImage(img, 0, 0, rect.width, rect.height);
        };
        img.src = prevDataUrl;
    }

    function clearWhiteboard() {
        drawRuledNotebookLines();
        saveWhiteboardState();
        playAudioTone(300, 0.1);
    }

    function toggleFullscreenWhiteboard() {
        const box = document.querySelector('.dictation-lab-modal-box');
        if (box) {
            box.classList.toggle('fullscreen-wb');
            setTimeout(initWhiteboardCanvas, 200);
        }
    }

    function downloadWhiteboardCard() {
        if (!State.wbCanvas) return;
        const link = document.createElement('a');
        link.download = `بطاقة_إملاء_${State.currentWordItem.id}_قراءتي_الذكية.png`;
        link.href = State.wbCanvas.toDataURL('image/png');
        link.click();
    }

    // ==========================================================================
    // 10. بنك كلمات المنهج وإضافة الكلمات المخصصة
    // ==========================================================================

    function renderBankCards() {
        const bankGrid = document.getElementById('dlBankGrid');
        if (!bankGrid) return;

        const filtered = CURRICULUM_DICTATION_BANK.filter(item => {
            const matchUnit = State.filterUnit === 'all' || item.unit === State.filterUnit;
            const matchSkill = State.filterSkill === 'all' || item.skill === State.filterSkill;
            return matchUnit && matchSkill;
        });

        bankGrid.innerHTML = filtered.map(item => {
            const isActive = item.id === State.currentWordItem.id;
            return `
                <div class="dl-bank-card ${isActive ? 'active' : ''}" onclick="DictationLab.selectWordItem('${item.id}')">
                    <span class="dl-bank-word">${item.word}</span>
                    <div class="dl-bank-meta">
                        <span class="dl-bank-skill-badge">${item.skillName}</span>
                        <span>${getUnitTitleArabic(item.unit)}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    function filterBank(type, val) {
        if (type === 'unit') State.filterUnit = val;
        if (type === 'skill') State.filterSkill = val;

        // تحديث كلاسات الأزرار
        const parent = type === 'unit' ? document.getElementById('dlBankUnitFilters') : document.getElementById('dlBankSkillFilters');
        if (parent) {
            parent.querySelectorAll('.dl-filter-pill').forEach(btn => {
                if (btn.getAttribute('data-filter') === val) btn.classList.add('active');
                else btn.classList.remove('active');
            });
        }
        renderBankCards();
    }

    function handleCustomWordSubmit() {
        const input = document.getElementById('dlCustomWordInput');
        if (!input || !input.value.trim()) return;

        const customWord = input.value.trim();
        const customItem = {
            id: 'custom_' + Date.now(),
            word: customWord,
            unit: 'custom',
            skill: 'custom',
            skillName: 'كلمة مخصصة من المعلم',
            syllables: segmentArabicWordPhonics(customWord),
            audioKey: null,
            hint: 'كلمة إملائية مخصصة تمت صياغتها وتحليلها فونيمياً للمختبر.'
        };

        CURRICULUM_DICTATION_BANK.unshift(customItem);
        input.value = '';
        selectWordItem(customItem.id);
        switchTab('seen');
    }

    // ==========================================================================
    // 11. مولد شيتات وأوراق عمل الإملاء الورقية الرسمية A4
    // ==========================================================================

    function renderWorksheetPreview() {
        const pageEl = document.getElementById('dlSheetPage');
        if (!pageEl) return;

        const activeWords = CURRICULUM_DICTATION_BANK.slice(0, 6);
        pageEl.innerHTML = `
            <div class="dl-sheet-header">
                <div style="text-align: right;">
                    <div style="font-weight: 900; font-size: 1.15rem; color: #1e1b4b;">جمهورية العراق - وزارة التربية</div>
                    <div style="font-size: 0.95rem; color: #475569;">المديرية العامة للمناهج • قراءتي للصف الأول الابتدائي</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 1.5rem; font-weight: 900; color: #1e1b4b;">كراسة الإملاء المنظور والاختباري</div>
                    <div style="font-size: 0.85rem; color: #64748b;">ورقة تدريب وتقييم رسمية A4</div>
                </div>
                <div style="text-align: left;">
                    <div style="font-weight: 800; font-size: 0.95rem; color: #4338ca;">منصة قراءتي التفاعلية الذكية</div>
                    <div style="font-size: 0.8rem; color: #64748b;">إعداد: المهندس أسامة خليل هاشم</div>
                </div>
            </div>

            <div class="dl-sheet-info-grid">
                <div>اسم التلميذ: .......................................</div>
                <div>الصف: الأول الابتدائي (الشعبة: .....)</div>
                <div>التاريخ: ...... / ...... / ٢٠٢٦م</div>
                <div>الوحدة: ${getUnitTitleArabic(State.currentWordItem.unit)}</div>
                <div>المهارة الإملائية: ${State.currentWordItem.skillName}</div>
                <div>درجة التقييم: ........... / ١٠</div>
            </div>

            <table class="dl-sheet-table">
                <thead>
                    <tr>
                        <th style="width: 8%;">ت</th>
                        <th style="width: 25%;">الكلمة المقررة (إملاء منظور)</th>
                        <th style="width: 32%;">كتابة وتدريب التلميذ على السطر</th>
                        <th style="width: 35%;">الإملاء الاختباري (بدون نظر)</th>
                    </tr>
                </thead>
                <tbody>
                    ${activeWords.map((item, idx) => `
                        <tr>
                            <td>${idx + 1}</td>
                            <td style="font-size: 1.8rem; font-weight: 900; letter-spacing: 2px;">${item.word}</td>
                            <td><div class="dl-sheet-ruled-line"></div></td>
                            <td><div class="dl-sheet-ruled-line"></div></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <div style="display: flex; justify-content: space-between; margin-top: 30px; font-weight: 700;">
                <div>ملاحظات وتوجيهات المعلم: ............................................................................</div>
            </div>

            <div class="dl-sheet-footer">
                <div>توقيع معلم المادة: .................................</div>
                <div>توقيع ولي الأمر: .................................</div>
                <div>تصميم واعتماد: <b>المهندس أسامة خليل هاشم</b></div>
            </div>
        `;
    }

    function printWorksheetA4() {
        renderWorksheetPreview();
        setTimeout(() => {
            window.print();
        }, 150);
    }

    // ==========================================================================
    // 12. الإحصائيات وسجل الإنجاز وشهادة التميز (Stats & Certificate)
    // ==========================================================================

    function getDictationStats() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY_STATS);
            if (raw) return JSON.parse(raw);
        } catch (e) {}
        return {
            totalSessions: 0,
            correctCount: 0,
            perfectStreak: 0,
            errorsByType: {}
        };
    }

    function recordDictationSession(wordItem, isCorrect, errorType) {
        const stats = getDictationStats();
        stats.totalSessions++;
        if (isCorrect) {
            stats.correctCount++;
            stats.perfectStreak++;
        } else {
            stats.perfectStreak = 0;
            if (errorType) {
                stats.errorsByType[errorType] = (stats.errorsByType[errorType] || 0) + 1;
            }
        }
        try {
            localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
        } catch (e) {}
        renderStatsDisplay();
    }

    function renderStatsDisplay() {
        const stats = getDictationStats();
        const totalEl = document.getElementById('dlStatTotal');
        const correctEl = document.getElementById('dlStatCorrect');
        const accuracyEl = document.getElementById('dlStatAccuracy');
        const streakEl = document.getElementById('dlStatStreak');

        const acc = stats.totalSessions > 0 ? Math.round((stats.correctCount / stats.totalSessions) * 100) : 100;

        if (totalEl) totalEl.innerText = stats.totalSessions;
        if (correctEl) correctEl.innerText = stats.correctCount;
        if (accuracyEl) accuracyEl.innerText = acc + '%';
        if (streakEl) streakEl.innerText = stats.perfectStreak;
    }

    // ==========================================================================
    // 13. الأصوات والمؤثرات الصوتية الفونيمية (Audio Synthesis & Feedback)
    // ==========================================================================

    function playActiveWordAudio(isSlow) {
        const item = State.currentWordItem;
        if (item.audioKey && window.playAudio) {
            window.playAudio(item.audioKey);
        } else {
            speakArabicTTS(item.word, isSlow ? 0.65 : 0.95);
        }
    }

    function playConfusablePairAudio(confusableData) {
        if (!confusableData) return;
        speakArabicTTS(`استمع للفرق: حرف ${confusableData.name}. ${confusableData.diff}`);
    }

    function playKeyAudioFeedback(char) {
        speakArabicTTS(char, 1.1);
    }

    function speakArabicTTS(text, rate) {
        if ('speechSynthesis' in window) {
            try {
                window.speechSynthesis.cancel();
                const utter = new SpeechSynthesisUtterance(text);
                utter.lang = 'ar-SA';
                utter.rate = rate || 0.9;
                window.speechSynthesis.speak(utter);
            } catch (e) {}
        } else {
            playAudioTone(480, 0.08);
        }
    }

    function playAudioTone(freq, dur) {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + dur);
        } catch (e) {}
    }

    function playSuccessAudio() {
        playAudioTone(523.25, 0.12);
        setTimeout(() => playAudioTone(659.25, 0.15), 120);
        setTimeout(() => playAudioTone(783.99, 0.25), 260);
    }

    function triggerCelebration() {
        // تشغيل كانفاس النجوم الطائرة إن كان متاحاً في التطبيق
        if (window.Gamification && window.Gamification.triggerCelebration) {
            window.Gamification.triggerCelebration();
        }
    }

    function getUnitTitleArabic(unitKey) {
        const map = {
            'prep': 'التهيئة والمفاهيم',
            'unit1': 'الوحدة الأولى (دادا ودار)',
            'unit2': 'الوحدة الثانية (ميزان قدوري)',
            'unit3': 'الوحدة الثالثة (ريف مناف)',
            'unit4': 'الوحدة الرابعة (علم بلادي)',
            'unit5': 'الوحدة الخامسة (صلاح فلاح)',
            'unit6': 'الوحدة السادسة (حوض السباحة)',
            'custom': 'كلمات مخصصة'
        };
        return map[unitKey] || 'المنهج الدراسي';
    }

    // ==========================================================================
    // 14. التنقل بين التبويبات وفتح/إغلاق النافذة
    // ==========================================================================

    function switchTab(tabId) {
        State.currentTab = tabId;
        const tabs = ['seen', 'blind', 'whiteboard', 'bank', 'worksheet', 'stats'];

        tabs.forEach(t => {
            const btn = document.getElementById(`dlTabBtn_${t}`);
            const content = document.getElementById(`dlTabContent_${t}`);
            if (btn) {
                if (t === tabId) btn.classList.add('active');
                else btn.classList.remove('active');
            }
            if (content) {
                if (t === tabId) content.classList.add('active');
                else content.classList.remove('active');
            }
        });

        if (tabId === 'whiteboard') {
            setTimeout(initWhiteboardCanvas, 100);
        } else if (tabId === 'bank') {
            renderBankCards();
        } else if (tabId === 'worksheet') {
            renderWorksheetPreview();
        } else if (tabId === 'stats') {
            renderStatsDisplay();
        } else {
            renderActiveWord();
        }
    }

    function openModal(initialTab) {
        const modal = document.getElementById('dictationLabModal');
        if (!modal) return;
        modal.style.display = 'flex';
        resetSpellingSession();
        switchTab(initialTab || 'seen');
        renderActiveWord();
    }

    function closeModal() {
        const modal = document.getElementById('dictationLabModal');
        if (modal) modal.style.display = 'none';
        clearInterval(State.timerInterval);
    }

    // دعم لوحة المفاتيح المباشرة للكمبيوتر
    document.addEventListener('keydown', function (e) {
        const modal = document.getElementById('dictationLabModal');
        if (!modal || modal.style.display === 'none') return;

        if (e.key === 'Escape') {
            closeModal();
            return;
        }

        // تجاهل الاختصارات إذا كان التركيز في حقل نصي مخصص
        if (document.activeElement && document.activeElement.tagName === 'INPUT') return;

        if (State.currentTab === 'seen' || State.currentTab === 'blind') {
            if (e.key === 'Backspace') {
                e.preventDefault();
                backspaceCharacter();
            } else if (e.key === 'Enter') {
                e.preventDefault();
                checkCurrentSpelling();
            } else if (/^[\u0600-\u06FF]$/.test(e.key)) {
                e.preventDefault();
                insertCharacter(e.key);
            }
        }
    });

    async function evaluateHandwritingWithAI() {
        if (!State.wbCanvas) return;
        const targetWord = State.currentWordItem ? State.currentWordItem.word : 'كلمة إملائية';

        if (window.AIBridge) {
            try {
                const res = await window.AIBridge.evaluateHandwriting({
                    canvas: State.wbCanvas,
                    targetText: targetWord,
                    mode: 'word'
                });

                if (res && res.success) {
                    if (typeof window.showHandwritingFeedbackModal === 'function') {
                        window.showHandwritingFeedbackModal(res, targetWord);
                    }
                    if (res.score >= 80 && window.Gamification && typeof window.Gamification.awardStars === 'function') {
                        window.Gamification.awardStars(2, 'إتقان إملاء الكلمة');
                    }
                }
            } catch (e) {
                console.warn('Dictation handwriting evaluation error:', e);
            }
        }
    }

    // ==========================================================================
    // 15. الواجهة البرمجية العامة للكائن (Public API)
    // ==========================================================================
    window.DictationLab = {
        openModal: openModal,
        closeModal: closeModal,
        switchTab: switchTab,
        selectWordItem: selectWordItem,
        insertCharacter: insertCharacter,
        applyDiacritic: applyDiacritic,
        backspaceCharacter: backspaceCharacter,
        clearAllCharacters: clearAllCharacters,
        handleTileClick: handleTileClick,
        checkCurrentSpelling: checkCurrentSpelling,
        startTimedConcealment: startTimedConcealment,
        concealWordNow: concealWordNow,
        revealWordNow: revealWordNow,
        playActiveWordAudio: playActiveWordAudio,
        setWhiteboardTool: setWhiteboardTool,
        setWhiteboardColor: setWhiteboardColor,
        undoWhiteboard: undoWhiteboard,
        clearWhiteboard: clearWhiteboard,
        toggleFullscreenWhiteboard: toggleFullscreenWhiteboard,
        downloadWhiteboardCard: downloadWhiteboardCard,
        evaluateHandwritingWithAI: evaluateHandwritingWithAI,
        filterBank: filterBank,
        handleCustomWordSubmit: handleCustomWordSubmit,
        printWorksheetA4: printWorksheetA4
    };

    window.openDictationLabModal = openModal;
    window.closeDictationLabModal = closeModal;

})();
