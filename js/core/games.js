/* ==========================================================================
 * منصة قراءتي التفاعلية الذكية - بنك الألعاب اللغوية والمسابقات الصفية للشاشات الذكية
 * الصف الأول الابتدائي • متوافق 100% مع كتاب قراءتي والسبورات والشاشات التفاعلية
 * إعداد وتطوير: المهندس أسامة خليل هاشم
 * ========================================================================== */

(function () {
    'use strict';

    // ==========================================================================
    // 1. المحرك الصوتي الذاتي والمؤثرات التفاعلية (Web Audio SFX Engine)
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

    // تكة دوران العجلة الفيزيائية
    function playWheelTickSound(pitch = 1.0) {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(320 * pitch, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.04);

            gain.gain.setValueAtTime(0.06, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.04);
        } catch (e) { }
    }

    // صوت فرقعة الفقاعة اللطيف
    function playBubblePopSound() {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(500 + Math.random() * 200, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.06);

            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.06);
        } catch (e) { }
    }

    // صفارة قطار المقاطع الكرتونية (تشو تشو!)
    function playTrainWhistleSound() {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const now = ctx.currentTime;

            // نغمتان متداخلتان لصفارة القطار
            [587.33, 739.99].forEach((freq) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(freq, now);
                osc.frequency.linearRampToValueAtTime(freq * 1.05, now + 0.2);
                osc.frequency.linearRampToValueAtTime(freq, now + 0.4);

                gain.gain.setValueAtTime(0.04, now);
                gain.gain.linearRampToValueAtTime(0.07, now + 0.1);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(now);
                osc.stop(now + 0.45);
            });
        } catch (e) { }
    }

    // رنة جرس النجاح البهيجة
    function playSuccessSound() {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const now = ctx.currentTime;
            const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (وتر دو الكبير)

            freqs.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const startTime = now + idx * 0.08;

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, startTime);

                gain.gain.setValueAtTime(0.08, startTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.35);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(startTime);
                osc.stop(startTime + 0.35);
            });
        } catch (e) { }
    }

    // تنبيه الخطأ اللطيف بدون إحباط الطفل
    function playGentleWrongSound() {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(220, ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(160, ctx.currentTime + 0.2);

            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.2);
        } catch (e) { }
    }

    // موسيقى الانتصار والتتويج الكبرى والاحتفال الصفي
    function playCheerFanfare() {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const now = ctx.currentTime;
            const notes = [
                { f: 523.25, t: 0.0, d: 0.15 },
                { f: 523.25, t: 0.18, d: 0.15 },
                { f: 523.25, t: 0.36, d: 0.15 },
                { f: 659.25, t: 0.54, d: 0.25 },
                { f: 783.99, t: 0.82, d: 0.45 }
            ];

            notes.forEach(n => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const st = now + n.t;

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(n.f, st);

                gain.gain.setValueAtTime(0.08, st);
                gain.gain.exponentialRampToValueAtTime(0.0001, st + n.d);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(st);
                osc.stop(st + n.d);
            });
        } catch (e) { }
    }

    // نطق الكلمة أو الحرف بالاعتماد على محرك المنصة أو النطق التخليقي
    function speakGameItem(text, audioKey) {
        if (window.mascotSpeak) {
            window.mascotSpeak(text, audioKey || null);
        } else if ('speechSynthesis' in window) {
            const utter = new SpeechSynthesisUtterance(text);
            utter.lang = 'ar-SA';
            utter.rate = 0.85;
            window.speechSynthesis.speak(utter);
        }
    }

    // ==========================================================================
    // 2. بنك البيانات اللغوية المعتمدة للألعاب (Curriculum Language Data)
    // ==========================================================================
    const WHEEL_DATA_MODES = {
        letters: [
            { text: 'د', title: 'حرف الدال', desc: 'مثل: دَادَا - دَار', audio: 'letter_d_sound' },
            { text: 'ر', title: 'حرف الراء', desc: 'مثل: رِيم - دُور', audio: 'letter_r_sound' },
            { text: 'ب', title: 'حرف الباء', desc: 'مثل: بَابَا - بُوم', audio: 'letter_b_sound' },
            { text: 'م', title: 'حرف الميم', desc: 'مثل: مَامَا - مِيَاه', audio: 'letter_m_sound' },
            { text: 'ن', title: 'حرف النون', desc: 'مثل: نُور - نَمِير', audio: 'letter_n_sound' },
            { text: 'ق', title: 'حرف القاف', desc: 'مثل: بُوق - قِطَار', audio: 'letter_q_words_intro' },
            { text: 'ل', title: 'حرف اللام', desc: 'مثل: لَبَن - نَبِيل', audio: 'letter_l_words_intro' },
            { text: 'ف', title: 'حرف الفاء', desc: 'مثل: فِرَاس - رِيف', audio: 'letter_f_sound' },
            { text: 'س', title: 'حرف السين', desc: 'مثل: سَارَة - سَالِم', audio: 'letter_s_sound' },
            { text: 'ط', title: 'حرف الطاء', desc: 'مثل: طَيَّارَة - بَطّ', audio: 'letter_ta_words_intro' },
            { text: 'ع', title: 'حرف العين', desc: 'مثل: عَلَم - عِيد', audio: 'letter_ayn_words_intro' },
            { text: 'ز', title: 'حرف الزاي', desc: 'مثل: زَيْد - زَيْتُون', audio: 'letter_z_words_intro' }
        ],
        syllables: [
            { text: 'دَا', title: 'مقطع دَا', desc: 'دال ممدودة بالألف (دَادَا)', audio: 'letter_d_sound' },
            { text: 'دُو', title: 'مقطع دُو', desc: 'دال ممدودة بالواو (دُور)', audio: 'letter_d_sound' },
            { text: 'دِي', title: 'مقطع دِي', desc: 'دال ممدودة بالياء (دِين)', audio: 'letter_d_sound' },
            { text: 'بَا', title: 'مقطع بَا', desc: 'باء ممدودة بالألف (بَابَا)', audio: 'letter_b_sound' },
            { text: 'بُو', title: 'مقطع بُو', desc: 'باء ممدودة بالواو (بُوم)', audio: 'letter_b_sound' },
            { text: 'رَا', title: 'مقطع رَا', desc: 'راء ممدودة بالألف (فِرَاس)', audio: 'letter_r_sound' },
            { text: 'رُو', title: 'مقطع رُو', desc: 'راء ممدودة بالواو (خَرُوف)', audio: 'letter_r_sound' },
            { text: 'نُو', title: 'مقطع نُو', desc: 'نون ممدودة بالواو (نُور)', audio: 'letter_n_sound' },
            { text: 'مِيـ', title: 'مقطع مِيـ', desc: 'ميم ممدودة بالياء (نَمِير)', audio: 'letter_m_sound' },
            { text: 'قَا', title: 'مقطع قَا', desc: 'قاف ممدودة بالألف (قَال)', audio: 'letter_q_words_intro' },
            { text: 'سَا', title: 'مقطع سَا', desc: 'سين ممدودة بالألف (سَارَة)', audio: 'letter_s_sound' },
            { text: 'طَا', title: 'مقطع طَا', desc: 'طاء ممدودة بالألف (قِطَار)', audio: 'letter_ta_words_intro' }
        ],
        words: [
            { text: 'دَادَا', title: 'دَادَا', desc: 'الطفل الرضيع الصغير (دَا + دَا)', audio: 'faseeh_blend_dada' },
            { text: 'دَار', title: 'دَار', desc: 'بيت الأسرة الجميل (دَا + ر)', audio: 'letter_r_read_dar' },
            { text: 'بَابَا', title: 'بَابَا', desc: 'الأب الحنون (بَا + بَا)', audio: 'letter_b_read_baba' },
            { text: 'مَامَا', title: 'مَامَا', desc: 'الأم الغالية (مَا + مَا)', audio: 'letter_m_read_mama' },
            { text: 'نُور', title: 'نُور', desc: 'الضياء واسم بنت (نُو + ر)', audio: 'act5_noor' },
            { text: 'بُوق', title: 'بُوق', desc: 'بوق نديم القديم (بُو + ق)', audio: 'letter_q_booq_syllables' },
            { text: 'مِيَاه', title: 'مِيَاه', desc: 'مياه المطر تسقي الزرع', audio: 'act5_halwa' },
            { text: 'زَيْتُون', title: 'زَيْتُون', desc: 'زيتون بلادي الشهي', audio: 'letter_z_words_intro' },
            { text: 'قِطَارٌ', title: 'قِطَارٌ', desc: 'قطار سريع بتنوين الضم', audio: 'tanween_dham_qitarun' },
            { text: 'غَزَال', title: 'غَزَال', desc: 'غزال وغراب صديقان', audio: 'letter_ghayn_words_intro' },
            { text: 'سَالِم', title: 'سَالِم', desc: 'سالم زارع البستان النشيط', audio: 'letter_ayn_salim_syllables' },
            { text: 'نَبِيه', title: 'نَبِيه', desc: 'نبيه تلميذ نشيط وذكي', audio: 'act5_halwa' }
        ],
        challenges: [
            { text: '👏 صفق!', title: 'تحدي التصفيق المقطعي', desc: 'اقرأ الكلمة (بَابَا) وصفق بعدد مقاطعها!' },
            { text: '✍️ ارسم!', title: 'الرسم في الهواء', desc: 'ارسم حرف (ر) بإصبعك في الهواء أمام زملائك!' },
            { text: '🦁 صوت!', title: 'صوت الحرف', desc: 'انطق صوت حرف (م) مثل هدير البقرة أو البوم!' },
            { text: '🎯 هات كلمة!', title: 'بنك الكلمات', desc: 'اذكر كلمة أخرى تبدأ بحرف (د) غير كلمة دار!' },
            { text: '🌟 فريقك!', title: 'نقاط للفريق', desc: 'أحسنت! فزت بـ 20 نقطة إضافية لفريقك المفضل!' },
            { text: '🚂 القطار!', title: 'صوت القطار', desc: 'قلد صوت صفارة القطار واقرأ كلمة (قِطَار)!' },
            { text: '🔍 ابحث!', title: 'حرف المد', desc: 'ما هو حرف المد في كلمة (نُور)؟ و / ا / ي؟' },
            { text: '🤝 شارك!', title: 'تحية الصداقة', desc: 'صافح زميلك وقل له: أنت بطل القراءة الذكية!' }
        ]
    };

    // بنك كلمات اللام الشمسية واللام القمرية
    const LAM_WORDS_BANK = [
        { word: 'الشَّمْس', type: 'shamsi', reason: 'الشين حرف مشدد، واللام كُتبت ولم تُلفظ' },
        { word: 'الْقَمَر', type: 'qamari', reason: 'القاف حرف قمري، واللام ساكنة ظاهرة في النطق' },
        { word: 'الدَّار', type: 'shamsi', reason: 'الدال حرف شمسي مشدد بعد الـ' },
        { word: 'الْبَاب', type: 'qamari', reason: 'الباء حرف قمري ينطق بوضوح' },
        { word: 'الصَّيْف', type: 'shamsi', reason: 'الصاد حرف شمسي مشدد' },
        { word: 'الْمَطَر', type: 'qamari', reason: 'الميم حرف قمري يلفظ لامه' },
        { word: 'الطَّيْر', type: 'shamsi', reason: 'الطاء حرف شمسي مدغم' },
        { word: 'الْوَلَد', type: 'qamari', reason: 'الواو حرف قمري تظهر لامه' },
        { word: 'الرَّبِيع', type: 'shamsi', reason: 'الراء حرف شمسي مشدد' },
        { word: 'الْكِتَاب', type: 'qamari', reason: 'الكاف حرف قمري ساكن اللام' },
        { word: 'النَّهَار', type: 'shamsi', reason: 'النون حرف شمسي مشدد' },
        { word: 'الْعَلَم', type: 'qamari', reason: 'العين حرف قمري واضح' }
    ];

    // بنك كلمات قطار المقاطع والتركيب
    const TRAIN_WORDS_BANK = [
        { word: 'دَار', syllables: ['دَا', 'ر'], pic: 'activity_5.png', audio: 'letter_r_read_dar' },
        { word: 'دَادَا', syllables: ['دَا', 'دَا'], pic: 'unit1_family_listen.png', audio: 'faseeh_blend_dada' },
        { word: 'بَابَا', syllables: ['بَا', 'بَا'], pic: 'unit1_story_living.png', audio: 'letter_b_read_baba' },
        { word: 'مَامَا', syllables: ['مَا', 'مَا'], pic: 'unit1_story_kitchen.png', audio: 'letter_m_read_mama' },
        { word: 'نُور', syllables: ['نُو', 'ر'], pic: 'unit2_school_listen.png', audio: 'act5_noor' },
        { word: 'بُوق', syllables: ['بُو', 'ق'], pic: 'activity_booq_scene.png', audio: 'letter_q_booq_syllables' },
        { word: 'مِيَاه', syllables: ['مِـ', 'يَا', 'ه'], pic: 'activity_ha_scene.png', audio: 'act5_halwa' },
        { word: 'قِطَار', syllables: ['قِـ', 'طَا', 'ر'], pic: 'activity_3_items.png', audio: 'tanween_dham_qitarun' },
        { word: 'غَزَال', syllables: ['غَـ', 'زَا', 'ل'], pic: 'activity_8_directions.png', audio: 'letter_ghayn_words_intro' }
    ];

    // أسئلة مسابقة وسام القراءة الذهبي (10 مستويات)
    const QUIZ_QUESTIONS_BANK = [
        {
            level: 1, points: 100,
            question: 'ما هو الحرف الأول في كلمة «دَار»؟',
            answers: ['حرف الدال (د)', 'حرف الراء (ر)', 'حرف الباء (ب)', 'حرف الميم (م)'],
            correct: 0,
            hint: 'تبدأ بحرف الدال المستقر على السطر'
        },
        {
            level: 2, points: 200,
            question: 'كم مقطعاً صوتياً تتكون منه كلمة «دَادَا»؟',
            answers: ['مقطع واحد', 'مقطعان (دَا + دَا)', 'ثلاثة مقاطع', 'أربعة مقاطع'],
            correct: 1,
            hint: 'مقطعان متماثلان بالمد'
        },
        {
            level: 3, points: 300,
            question: 'ما هو حرف المد في كلمة «نُور»؟',
            answers: ['مد الألف (ا)', 'مد الواو (و)', 'مد الياء (ي)', 'الهمزة (ء)'],
            correct: 1,
            hint: 'واو المد التي تمد صوت الضمة'
        },
        {
            level: 4, points: 400,
            question: 'أي الكلمات التالية تنتهي بحرف الميم المنفصل (م)؟',
            answers: ['بَاب', 'نَمِير', 'بُوم', 'دُود'],
            correct: 2,
            hint: 'طائر البوم الجميل'
        },
        {
            level: 5, points: 500,
            question: 'ما هي الحركة الموضوعة فوق الراء في كلمة «وَرْدٌ»؟',
            answers: ['الفتحة', 'الكسرة', 'السكون', 'الضمة'],
            correct: 2,
            hint: 'سكون دائرية فوق الراء تجعلها مقطعاً ساكناً'
        },
        {
            level: 6, points: 600,
            question: 'أي من الكلمات التالية تحتوي على تنوين الضم (ـٌ)؟',
            answers: ['قِطَارٌ', 'قِطَارَ', 'قِطَارِ', 'قِطَارْ'],
            correct: 0,
            hint: 'ينطق ضمتين متجاورتين بنغمة النون'
        },
        {
            level: 7, points: 700,
            question: 'الحرف المشدد في اللغة العربية عبارة عن كم حرف في الأصل؟',
            answers: ['حرف واحد فقط', 'حرفين: الأول ساكن والثاني متحرك', 'ثلاثة حروف', 'أربعة حروف'],
            correct: 1,
            hint: 'أدغم الحرفان معاً فصار حرفاً واحداً مشدداً'
        },
        {
            level: 8, points: 800,
            question: 'كلمة «الشَّمْس» لامها شمسية أم قمرية؟',
            answers: ['لام شمسية (تُكتب ولا تُلفظ)', 'لام قمرية (تُلفظ ساكنة)', 'ليست لام أصلاً', 'حرف مد'],
            correct: 0,
            hint: 'شمسية والحرف الذي بعدها مشدد'
        },
        {
            level: 9, points: 900,
            question: 'نقول: «..... وَلَدٌ نَشِيطٌ» - اسم الإشارة المناسب هو:',
            answers: ['هَذِهِ', 'هَذَا', 'هَؤُلَاءِ', 'تِلْكَ'],
            correct: 1,
            hint: 'اسم إشارة للمفرد المذكر'
        },
        {
            level: 10, points: 1000,
            question: 'ما معنى القراءة بطلاقة وفهم يا بطل الصف الأول؟',
            answers: ['القراءة بسرعة دون فهم', 'القراءة المعبرة بدقة ونطق الحركات وفهم المعنى', 'حفظ الكلمات شكلياً فقط', 'قراءة الحرف الأول فقط'],
            correct: 1,
            hint: 'القراءة المعبرة السليمة مع الفهم التام'
        }
    ];

    // ==========================================================================
    // 3. حالة بنك الألعاب العامة (Global Games State)
    // ==========================================================================
    const GamesState = {
        activeTab: 'wheel',
        totalScore: parseInt(localStorage.getItem('qiraati-smart-games-score') || localStorage.getItem('qiraati_smart_games_score') || '0', 10),
        starsCount: parseInt(localStorage.getItem('qiraati-smart-games-stars') || localStorage.getItem('qiraati_smart_games_stars') || '0', 10),
        
        // حالة عجلة الحظ
        wheel: {
            mode: 'letters',
            isSpinning: false,
            currentRotation: 0,
            lastResult: null
        },

        // حالة مسابقة الفريقين
        battle: {
            redScore: 0,
            blueScore: 0,
            currentRound: 1,
            totalRounds: 5,
            timerVal: 10,
            timerInterval: null,
            activeQuestion: null,
            roundResolved: false
        },

        // حالة صائد الفقاعات
        bubble: {
            timerVal: 45,
            timerInterval: null,
            poppedCount: 0,
            targetCondition: null,
            spawnInterval: null
        },

        // حالة قطار المقاطع
        train: {
            currentIndex: 0,
            placedSyllables: []
        },

        // حالة صندوق الذاكرة
        memory: {
            difficulty: 6, // 6, 8, 12
            flippedCards: [],
            matchedPairs: 0,
            moves: 0,
            timer: 0,
            timerInterval: null,
            cardsData: []
        },

        // حالة ميزان اللام
        sorter: {
            currentIndex: 0,
            streak: 0,
            score: 0
        },

        // حالة من سيربح الوسام
        quiz: {
            currentLevel: 0,
            score: 0,
            lifelines: { fifty: true, poll: true, switch: true }
        }
    };

    function saveGamesProgress() {
        localStorage.setItem('qiraati-smart-games-score', GamesState.totalScore.toString());
        localStorage.setItem('qiraati-smart-games-stars', GamesState.starsCount.toString());
        localStorage.setItem('qiraati_smart_games_score', GamesState.totalScore.toString());
        localStorage.setItem('qiraati_smart_games_stars', GamesState.starsCount.toString());
        updateGlobalStatsStrip();
    }

    function addScoreAndStars(scoreDelta, starsDelta = 1) {
        GamesState.totalScore += scoreDelta;
        GamesState.starsCount += starsDelta;
        saveGamesProgress();
    }

    function updateGlobalStatsStrip() {
        const scoreEl = document.getElementById('gamesGlobalScore');
        const starsEl = document.getElementById('gamesGlobalStars');
        if (scoreEl) scoreEl.textContent = GamesState.totalScore;
        if (starsEl) starsEl.textContent = GamesState.starsCount;
    }

    // ==========================================================================
    // 4. التحكم بالنافذة المنبثقة والتبويبات (Modal & Tabs Controller)
    // ==========================================================================
    window.openGamesModal = function (tabName = 'wheel') {
        const modal = document.getElementById('gamesModal');
        if (!modal) return;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        updateGlobalStatsStrip();
        switchGamesTab(tabName);
    };

    window.closeGamesModal = function () {
        const modal = document.getElementById('gamesModal');
        if (modal) modal.style.display = 'none';
        document.body.style.overflow = '';

        // إيقاف أي مؤقتات نشطة
        stopBattleTimer();
        stopBubbleGame();
        stopMemoryTimer();
    };

    window.switchGamesTab = function (tabName) {
        GamesState.activeTab = tabName;
        const tabs = ['wheel', 'battle', 'bubble', 'train', 'memory', 'sorter', 'quiz'];

        tabs.forEach(t => {
            const btn = document.getElementById(`tabGames_${t}`);
            const pane = document.getElementById(`paneGames_${t}`);
            if (btn) btn.classList.toggle('active', t === tabName);
            if (pane) pane.classList.toggle('active', t === tabName);
        });

        // تهيئة التبويب المحدد
        if (tabName === 'wheel') initWheelTab();
        else if (tabName === 'battle') initBattleTab();
        else if (tabName === 'bubble') initBubbleTab();
        else if (tabName === 'train') initTrainTab();
        else if (tabName === 'memory') initMemoryTab();
        else if (tabName === 'sorter') initSorterTab();
        else if (tabName === 'quiz') initQuizTab();
    };

    window.toggleGamesFullscreen = function () {
        const modalBox = document.querySelector('.games-modal-box');
        if (!modalBox) return;
        if (!document.fullscreenElement) {
            modalBox.requestFullscreen().catch(err => {
                console.warn('Fullscreen error:', err);
            });
        } else {
            document.exitFullscreen().catch(err => { });
        }
    };

    // ==========================================================================
    // 5. اللعبة 1: عجلة الحظ اللغوية الدوارة (🎡 Spinning Wheel Logic)
    // ==========================================================================
    let wheelCanvas = null;
    let wheelCtx = null;

    const WHEEL_COLORS = [
        '#ef4444', '#f97316', '#f59e0b', '#10b981',
        '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6',
        '#ec4899', '#14b8a6', '#84cc16', '#e11d48'
    ];

    function initWheelTab() {
        wheelCanvas = document.getElementById('wheelCanvas');
        if (!wheelCanvas) return;
        wheelCtx = wheelCanvas.getContext('2d');

        drawWheelCanvas();
    }

    window.setWheelMode = function (modeKey) {
        if (GamesState.wheel.isSpinning) return;
        GamesState.wheel.mode = modeKey;

        const pills = document.querySelectorAll('.wheel-mode-pill');
        pills.forEach(p => p.classList.toggle('active', p.getAttribute('data-mode') === modeKey));

        drawWheelCanvas();
    };

    function drawWheelCanvas() {
        if (!wheelCanvas || !wheelCtx) return;
        const dpr = window.devicePixelRatio || 1;
        const size = 360;

        wheelCanvas.width = size * dpr;
        wheelCanvas.height = size * dpr;
        wheelCtx.resetTransform();
        wheelCtx.scale(dpr, dpr);

        const cx = size / 2;
        const cy = size / 2;
        const radius = (size / 2) - 8;

        const items = WHEEL_DATA_MODES[GamesState.wheel.mode] || WHEEL_DATA_MODES.letters;
        const numSlices = items.length;
        const sliceAngle = (2 * Math.PI) / numSlices;

        wheelCtx.clearRect(0, 0, size, size);

        // رسم القطاعات
        for (let i = 0; i < numSlices; i++) {
            const angle = GamesState.wheel.currentRotation + i * sliceAngle;

            wheelCtx.beginPath();
            wheelCtx.moveTo(cx, cy);
            wheelCtx.arc(cx, cy, radius, angle, angle + sliceAngle);
            wheelCtx.closePath();

            wheelCtx.fillStyle = WHEEL_COLORS[i % WHEEL_COLORS.length];
            wheelCtx.fill();
            wheelCtx.lineWidth = 2.5;
            wheelCtx.strokeStyle = '#ffffff';
            wheelCtx.stroke();

            // كتابة النص في القطاع
            wheelCtx.save();
            wheelCtx.translate(cx, cy);
            wheelCtx.rotate(angle + sliceAngle / 2);

            wheelCtx.textAlign = 'right';
            wheelCtx.textBaseline = 'middle';
            wheelCtx.fillStyle = '#ffffff';
            wheelCtx.font = 'bold 20px "Amiri", "Traditional Arabic", sans-serif';
            wheelCtx.shadowColor = 'rgba(0,0,0,0.5)';
            wheelCtx.shadowBlur = 4;

            wheelCtx.fillText(items[i].text, radius - 24, 0);
            wheelCtx.restore();
        }

        // حافة ذهبية محيطية
        wheelCtx.beginPath();
        wheelCtx.arc(cx, cy, radius, 0, 2 * Math.PI);
        wheelCtx.lineWidth = 6;
        wheelCtx.strokeStyle = '#f59e0b';
        wheelCtx.stroke();
    }

    window.spinWheelNow = function () {
        if (GamesState.wheel.isSpinning) return;
        GamesState.wheel.isSpinning = true;

        const spinBtn = document.getElementById('btnSpinWheel');
        if (spinBtn) spinBtn.disabled = true;

        const items = WHEEL_DATA_MODES[GamesState.wheel.mode] || WHEEL_DATA_MODES.letters;
        const numSlices = items.length;
        const sliceAngle = (2 * Math.PI) / numSlices;

        // زاوية توقف عشوائية مع دورات متعددة
        const extraRounds = 5 + Math.floor(Math.random() * 4);
        const randomTargetIndex = Math.floor(Math.random() * numSlices);
        // السهم في الأعلى (الزاوية 3*PI/2)
        const targetSliceCenter = (1.5 * Math.PI) - (randomTargetIndex * sliceAngle) - (sliceAngle / 2);
        const finalRotation = GamesState.wheel.currentRotation + (extraRounds * 2 * Math.PI) + (targetSliceCenter % (2 * Math.PI));

        const startRotation = GamesState.wheel.currentRotation;
        const totalDelta = finalRotation - startRotation;
        const duration = 4000;
        const startTime = performance.now();
        let lastTickAngle = startRotation;

        function animateWheel(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // منحنى تباطؤ سلس (cubic ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);

            GamesState.wheel.currentRotation = startRotation + totalDelta * easeOut;
            drawWheelCanvas();

            // صوت التكات
            if (Math.abs(GamesState.wheel.currentRotation - lastTickAngle) >= sliceAngle) {
                playWheelTickSound(1.0 + (1 - progress) * 0.4);
                lastTickAngle = GamesState.wheel.currentRotation;
                // هزة خفيفة للمؤشر
                const pointer = document.getElementById('wheelPointer');
                if (pointer) {
                    pointer.style.transform = 'translateX(-50%) rotate(-12deg)';
                    setTimeout(() => { pointer.style.transform = 'translateX(-50%) rotate(0deg)'; }, 40);
                }
            }

            if (progress < 1) {
                requestAnimationFrame(animateWheel);
            } else {
                GamesState.wheel.isSpinning = false;
                if (spinBtn) spinBtn.disabled = false;

                // استخراج العنصر المستقر عنده السهم
                const winningItem = items[randomTargetIndex];
                GamesState.wheel.lastResult = winningItem;
                displayWheelResult(winningItem);
                playSuccessSound();
                addScoreAndStars(15, 1);
            }
        }

        requestAnimationFrame(animateWheel);
    };

    function displayWheelResult(item) {
        const resText = document.getElementById('wheelResultText');
        const resTitle = document.getElementById('wheelResultTitle');
        const resDesc = document.getElementById('wheelResultDesc');
        const card = document.getElementById('wheelResultCard');

        if (resText) resText.textContent = item.text;
        if (resTitle) resTitle.textContent = item.title;
        if (resDesc) resDesc.textContent = item.desc;

        if (card) {
            card.style.animation = 'none';
            card.offsetHeight; // trigger reflow
            card.style.animation = 'correctPulse 0.5s ease';
        }

        speakGameItem(item.title + '. ' + item.desc, item.audio || null);
    }

    // ==========================================================================
    // 6. اللعبة 2: تحدي الشاشة الذكية لمسابقات الفريقين (⚔️ Dual Battle Logic)
    // ==========================================================================
    function initBattleTab() {
        GamesState.battle.redScore = 0;
        GamesState.battle.blueScore = 0;
        GamesState.battle.currentRound = 1;
        updateBattleScoresUI();
        loadBattleRound();
    }

    function updateBattleScoresUI() {
        const redEl = document.getElementById('battleRedScore');
        const blueEl = document.getElementById('battleBlueScore');
        const roundEl = document.getElementById('battleRoundBadge');

        if (redEl) redEl.textContent = GamesState.battle.redScore;
        if (blueEl) blueEl.textContent = GamesState.battle.blueScore;
        if (roundEl) roundEl.textContent = `الجولة ${GamesState.battle.currentRound} من ${GamesState.battle.totalRounds}`;
    }

    function loadBattleRound() {
        stopBattleTimer();
        GamesState.battle.roundResolved = false;
        GamesState.battle.timerVal = 10;
        updateBattleTimerUI(10);

        // إنشاء سؤال تفاعلي جذاب من بنك الكلمات
        const words = TRAIN_WORDS_BANK;
        const correctItem = words[Math.floor(Math.random() * words.length)];
        
        // خيارات عشوائية مع خيار صحيح
        const otherWords = words.filter(w => w.word !== correctItem.word).map(w => w.word);
        const shuffledWrong = otherWords.sort(() => 0.5 - Math.random()).slice(0, 3);
        const options = [correctItem.word, ...shuffledWrong].sort(() => 0.5 - Math.random());

        GamesState.battle.activeQuestion = {
            item: correctItem,
            options: options,
            correctAnswer: correctItem.word
        };

        // تحديث محطة السؤال المركزية
        const promptPic = document.getElementById('battlePromptPic');
        const promptWord = document.getElementById('battlePromptWord');
        const promptSub = document.getElementById('battlePromptSub');

        if (promptPic) {
            promptPic.src = correctItem.pic;
            promptPic.style.display = 'block';
        }
        if (promptWord) promptWord.textContent = 'ما هي الكلمة الصحيحة؟';
        if (promptSub) promptSub.textContent = 'أسرع فريق يلمس الإجابة يحصد النقطة!';

        // بناء أزرار الخيارات لكلا الفريقين
        renderBattleTeamOptions('red', options, correctItem.word);
        renderBattleTeamOptions('blue', options, correctItem.word);

        // بدء العد التنازلي الحماسي (10 ثوانٍ)
        startBattleTimer();
    }

    function renderBattleTeamOptions(team, options, correctAnswer) {
        const container = document.getElementById(`battleOptions_${team}`);
        if (!container) return;
        container.innerHTML = '';

        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'battle-option-btn';
            btn.textContent = opt;
            btn.onclick = () => handleBattleChoice(team, opt, btn);
            container.appendChild(btn);
        });
    }

    function handleBattleChoice(team, choice, btnElement) {
        if (GamesState.battle.roundResolved) return;

        const q = GamesState.battle.activeQuestion;
        if (!q) return;

        if (choice === q.correctAnswer) {
            GamesState.battle.roundResolved = true;
            stopBattleTimer();

            btnElement.classList.add('correct');
            playSuccessSound();

            if (team === 'red') GamesState.battle.redScore += 10;
            else GamesState.battle.blueScore += 10;

            updateBattleScoresUI();

            const teamTitle = (team === 'red') ? '🦅 فريق الصقور' : '🌟 فريق النجوم';
            const promptWord = document.getElementById('battlePromptWord');
            if (promptWord) promptWord.textContent = `نقطة لـ ${teamTitle}! أحسنتم! 👏`;

            speakGameItem(`أحسنت يا بطل! الكلمة هي ${q.correctAnswer}`, q.item.audio || null);

            setTimeout(() => {
                advanceBattleRound();
            }, 1800);
        } else {
            btnElement.classList.add('wrong');
            playGentleWrongSound();
            btnElement.disabled = true;
        }
    }

    function advanceBattleRound() {
        if (GamesState.battle.currentRound < GamesState.battle.totalRounds) {
            GamesState.battle.currentRound++;
            updateBattleScoresUI();
            loadBattleRound();
        } else {
            concludeBattleGame();
        }
    }

    function startBattleTimer() {
        GamesState.battle.timerInterval = setInterval(() => {
            GamesState.battle.timerVal--;
            updateBattleTimerUI(GamesState.battle.timerVal);

            if (GamesState.battle.timerVal <= 0) {
                stopBattleTimer();
                GamesState.battle.roundResolved = true;
                playGentleWrongSound();

                const promptWord = document.getElementById('battlePromptWord');
                if (promptWord) promptWord.textContent = 'انتهى الوقت! تعادل في هذه الجولة ⌛';

                setTimeout(() => {
                    advanceBattleRound();
                }, 1600);
            }
        }, 1000);
    }

    function stopBattleTimer() {
        if (GamesState.battle.timerInterval) {
            clearInterval(GamesState.battle.timerInterval);
            GamesState.battle.timerInterval = null;
        }
    }

    function updateBattleTimerUI(val) {
        const ring = document.getElementById('battleTimerRing');
        const text = document.getElementById('battleTimerText');
        if (text) text.textContent = val;
        if (ring) {
            const deg = (val / 10) * 360;
            ring.style.setProperty('--timer-deg', `${deg}deg`);
        }
    }

    function concludeBattleGame() {
        stopBattleTimer();
        playCheerFanfare();

        const red = GamesState.battle.redScore;
        const blue = GamesState.battle.blueScore;

        let resultTitle = '';
        if (red > blue) resultTitle = '🏆 فوز باهر لفريق الصقور (الأحمر)! مبارك للأبطال 🦅';
        else if (blue > red) resultTitle = '🏆 فوز باهر لفريق النجوم (الأزرق)! مبارك للأبطال 🌟';
        else resultTitle = '🤝 تعادل بطولي رائع بين الفريقين! كلاهما أبطال القراءة الذكية!';

        const promptWord = document.getElementById('battlePromptWord');
        const promptSub = document.getElementById('battlePromptSub');
        if (promptWord) promptWord.textContent = resultTitle;
        if (promptSub) promptSub.textContent = 'تم توثيق فوز المسابقة الصفية في سجل الإنجاز! اضغط زر إعادة لبدء مسابقة جديدة.';

        addScoreAndStars(red + blue, 3);
    }

    window.resetBattleGame = function () {
        initBattleTab();
    };

    // ==========================================================================
    // 7. اللعبة 3: صائد الفقاعات والكلمات الطائرة (🫧 Bubble Popper Logic)
    // ==========================================================================
    function initBubbleTab() {
        stopBubbleGame();
        GamesState.bubble.timerVal = 45;
        GamesState.bubble.poppedCount = 0;

        const timerEl = document.getElementById('bubbleTimer');
        const scoreEl = document.getElementById('bubbleScore');
        if (timerEl) timerEl.textContent = '45 ث';
        if (scoreEl) scoreEl.textContent = '0';

        // اختيار شرط الهدف
        const targets = [
            { tag: 'حرف الدال (د)', filter: (c) => c.includes('د') || c.includes('دَا'), hint: 'فرقع كل فقاعة تحتوي على حرف أو مقطع الدال!' },
            { tag: 'مد الألف (ـا)', filter: (c) => c.includes('ا') || c.includes('ـا') || c.includes('بَا') || c.includes('دَا'), hint: 'فرقع كل فقاعة بها صوت مد الألف الطويل!' },
            { tag: 'مد الواو (ـو)', filter: (c) => c.includes('و') || c.includes('نُو') || c.includes('دُو') || c.includes('بُو'), hint: 'اصطد كل فقاعة بها صوت مد الواو!' }
        ];

        const targetObj = targets[Math.floor(Math.random() * targets.length)];
        GamesState.bubble.targetCondition = targetObj;

        const tagEl = document.getElementById('bubbleTargetTag');
        const textEl = document.getElementById('bubbleTargetText');
        if (tagEl) tagEl.textContent = targetObj.tag;
        if (textEl) textEl.textContent = targetObj.hint;

        startBubbleGame();
    }

    function startBubbleGame() {
        const field = document.getElementById('bubbleCanvasField');
        if (!field) return;
        field.innerHTML = '';

        // توليد فقاعات دوري
        GamesState.bubble.spawnInterval = setInterval(() => {
            spawnOneBubble(field);
        }, 900);

        // مؤقت 45 ثانية
        GamesState.bubble.timerInterval = setInterval(() => {
            GamesState.bubble.timerVal--;
            const timerEl = document.getElementById('bubbleTimer');
            if (timerEl) timerEl.textContent = `${GamesState.bubble.timerVal} ث`;

            if (GamesState.bubble.timerVal <= 0) {
                stopBubbleGame();
                playCheerFanfare();
                alert(`أحسنت يا بطل! 🎉 تم اصطياد ${GamesState.bubble.poppedCount} فقاعة بنجاح!`);
                addScoreAndStars(GamesState.bubble.poppedCount * 10, 2);
            }
        }, 1000);
    }

    function stopBubbleGame() {
        if (GamesState.bubble.timerInterval) {
            clearInterval(GamesState.bubble.timerInterval);
            GamesState.bubble.timerInterval = null;
        }
        if (GamesState.bubble.spawnInterval) {
            clearInterval(GamesState.bubble.spawnInterval);
            GamesState.bubble.spawnInterval = null;
        }
    }

    function spawnOneBubble(container) {
        if (!container) return;
        const rect = container.getBoundingClientRect();
        if (rect.width <= 0) return;

        const bubble = document.createElement('div');
        bubble.className = 'bubble-float-item';

        const size = 68 + Math.floor(Math.random() * 24);
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;

        const startLeft = 10 + Math.random() * (rect.width - size - 20);
        bubble.style.left = `${startLeft}px`;
        bubble.style.bottom = '-80px';

        // اختيار محتوى الفقاعة
        const pool = ['دَادَا', 'دَار', 'بَابَا', 'نُور', 'رِيم', 'بُوم', 'دُو', 'دَا', 'رَا', 'نُو', 'مَامَا', 'سَارَة'];
        const text = pool[Math.floor(Math.random() * pool.length)];
        bubble.textContent = text;
        bubble.style.fontSize = `${size * 0.28}px`;

        const speed = 4000 + Math.random() * 3000;
        const anim = bubble.animate([
            { transform: 'translateY(0) scale(1)' },
            { transform: `translateY(-${rect.height + 120}px) scale(1.05)` }
        ], {
            duration: speed,
            easing: 'linear'
        });

        bubble.onclick = () => {
            const isMatch = GamesState.bubble.targetCondition.filter(text);
            if (isMatch) {
                playBubblePopSound();
                bubble.classList.add('popping');
                GamesState.bubble.poppedCount++;
                const scoreEl = document.getElementById('bubbleScore');
                if (scoreEl) scoreEl.textContent = GamesState.bubble.poppedCount;

                setTimeout(() => { bubble.remove(); }, 250);
            } else {
                playGentleWrongSound();
                bubble.style.border = '2px solid #ef4444';
            }
        };

        anim.onfinish = () => {
            if (bubble.parentElement) bubble.remove();
        };

        container.appendChild(bubble);
    }

    window.restartBubbleGame = function () {
        initBubbleTab();
    };

    // ==========================================================================
    // 8. اللعبة 4: محطة قطار المقاطع والتركيب (🚂 Syllable Train Logic)
    // ==========================================================================
    function initTrainTab() {
        GamesState.train.currentIndex = 0;
        loadTrainWord(0);
    }

    function loadTrainWord(index) {
        const item = TRAIN_WORDS_BANK[index % TRAIN_WORDS_BANK.length];
        GamesState.train.placedSyllables = [];

        const picEl = document.getElementById('trainWordPic');
        const titleEl = document.getElementById('trainWordTitle');
        const wagonsContainer = document.getElementById('trainWagonsContainer');
        const bankContainer = document.getElementById('trainSyllablesBank');

        if (picEl) picEl.src = item.pic;
        if (titleEl) titleEl.textContent = `ركّب مقاطع كلمة: ${item.word}`;

        // تجهيز العربات الفارغة
        if (wagonsContainer) {
            wagonsContainer.innerHTML = '';
            item.syllables.forEach((syl, i) => {
                const wagon = document.createElement('div');
                wagon.className = 'train-wagon-slot';
                wagon.id = `trainWagon_${i}`;

                wagon.innerHTML = `
                    <span class="train-wagon-number">${i + 1}</span>
                    <span class="train-wagon-content" id="trainWagonContent_${i}">?</span>
                    <div class="train-wheel train-wheel-left"></div>
                    <div class="train-wheel train-wheel-right"></div>
                `;
                wagonsContainer.appendChild(wagon);
            });
        }

        // تجهيز بنك المقاطع مبعثرة
        if (bankContainer) {
            bankContainer.innerHTML = '';
            const shuffledSyllables = [...item.syllables].sort(() => 0.5 - Math.random());

            shuffledSyllables.forEach(syl => {
                const tile = document.createElement('button');
                tile.className = 'train-syllable-tile';
                tile.textContent = syl;
                tile.onclick = () => handleTrainSyllablePick(syl, tile, item);
                bankContainer.appendChild(tile);
            });
        }
    }

    function handleTrainSyllablePick(syl, tileElement, item) {
        const nextIndex = GamesState.train.placedSyllables.length;
        const expectedSyl = item.syllables[nextIndex];

        if (syl === expectedSyl) {
            GamesState.train.placedSyllables.push(syl);
            tileElement.classList.add('used');

            const wagonContent = document.getElementById(`trainWagonContent_${nextIndex}`);
            if (wagonContent) wagonContent.textContent = syl;

            playSuccessSound();

            // هل اكتملت الكلمة؟
            if (GamesState.train.placedSyllables.length === item.syllables.length) {
                concludeTrainWord(item);
            }
        } else {
            playGentleWrongSound();
            tileElement.style.animation = 'wrongShake 0.4s ease';
            setTimeout(() => { tileElement.style.animation = ''; }, 400);
        }
    }

    function concludeTrainWord(item) {
        playTrainWhistleSound();
        addScoreAndStars(20, 1);

        const comp = document.getElementById('trainComposition');
        if (comp) {
            comp.style.transform = 'translateX(-80px)';
            setTimeout(() => {
                comp.style.transform = 'translateX(0)';
            }, 900);
        }

        speakGameItem(`أحسنت! قطار كلمة ${item.word} ينطلق بسلام!`, item.audio || null);

        setTimeout(() => {
            GamesState.train.currentIndex++;
            loadTrainWord(GamesState.train.currentIndex);
        }, 1800);
    }

    window.nextTrainWord = function () {
        GamesState.train.currentIndex++;
        loadTrainWord(GamesState.train.currentIndex);
    };

    // ==========================================================================
    // 9. اللعبة 5: صندوق الذاكرة والبطاقات المتطابقة (🃏 Memory Match 3D Logic)
    // ==========================================================================
    function initMemoryTab() {
        stopMemoryTimer();
        GamesState.memory.flippedCards = [];
        GamesState.memory.matchedPairs = 0;
        GamesState.memory.moves = 0;
        GamesState.memory.timer = 0;

        const movesEl = document.getElementById('memoryMovesCount');
        const timerEl = document.getElementById('memoryTimerVal');
        if (movesEl) movesEl.textContent = '0';
        if (timerEl) timerEl.textContent = '00:00';

        buildMemoryGrid();
    }

    window.setMemoryDifficulty = function (numCards) {
        GamesState.memory.difficulty = numCards;
        const pills = document.querySelectorAll('.memory-diff-pill');
        pills.forEach(p => p.classList.toggle('active', parseInt(p.getAttribute('data-cards'), 10) === numCards));

        initMemoryTab();
    };

    function buildMemoryGrid() {
        const grid = document.getElementById('memoryGridArena');
        if (!grid) return;
        grid.innerHTML = '';

        const numCards = GamesState.memory.difficulty;
        grid.className = `memory-grid-arena memory-grid-${numCards}`;

        const numPairs = numCards / 2;
        const selectedWords = TRAIN_WORDS_BANK.slice(0, numPairs);

        // إنشاء أزواج البطاقات (واحدة كلمة والأخرى صورة)
        const deck = [];
        selectedWords.forEach((item, idx) => {
            deck.push({ pairId: idx, type: 'word', content: item.word, audio: item.audio });
            deck.push({ pairId: idx, type: 'pic', content: item.pic, title: item.word, audio: item.audio });
        });

        // خلط البطاقات
        deck.sort(() => 0.5 - Math.random());
        GamesState.memory.cardsData = deck;

        deck.forEach((card, index) => {
            const cardEl = document.createElement('div');
            cardEl.className = 'memory-card-3d';
            cardEl.setAttribute('data-index', index);

            cardEl.innerHTML = `
                <div class="memory-card-face memory-card-front">
                    <span class="memory-card-front-pattern">🌟</span>
                </div>
                <div class="memory-card-face memory-card-back">
                    ${card.type === 'pic' ? `<img src="${card.content}" class="memory-card-img" alt="${card.title}">` : `<span class="memory-card-word">${card.content}</span>`}
                </div>
            `;

            cardEl.onclick = () => flipMemoryCard(cardEl, card, index);
            grid.appendChild(cardEl);
        });

        startMemoryTimer();
    }

    function flipMemoryCard(cardEl, card, index) {
        if (GamesState.memory.flippedCards.length >= 2) return;
        if (cardEl.classList.contains('flipped') || cardEl.classList.contains('matched')) return;

        cardEl.classList.add('flipped');
        playBubblePopSound();

        GamesState.memory.flippedCards.push({ element: cardEl, data: card });

        if (GamesState.memory.flippedCards.length === 2) {
            GamesState.memory.moves++;
            const movesEl = document.getElementById('memoryMovesCount');
            if (movesEl) movesEl.textContent = GamesState.memory.moves;

            checkMemoryMatch();
        }
    }

    function checkMemoryMatch() {
        const [c1, c2] = GamesState.memory.flippedCards;
        const isMatch = (c1.data.pairId === c2.data.pairId);

        if (isMatch) {
            playSuccessSound();
            c1.element.classList.add('matched');
            c2.element.classList.add('matched');
            GamesState.memory.matchedPairs++;
            GamesState.memory.flippedCards = [];

            speakGameItem(c1.data.type === 'word' ? c1.data.content : c2.data.content, c1.data.audio);

            if (GamesState.memory.matchedPairs === GamesState.memory.difficulty / 2) {
                stopMemoryTimer();
                playCheerFanfare();
                addScoreAndStars(30, 2);
            }
        } else {
            playGentleWrongSound();
            setTimeout(() => {
                c1.element.classList.remove('flipped');
                c2.element.classList.remove('flipped');
                GamesState.memory.flippedCards = [];
            }, 900);
        }
    }

    function startMemoryTimer() {
        stopMemoryTimer();
        GamesState.memory.timerInterval = setInterval(() => {
            GamesState.memory.timer++;
            const mins = String(Math.floor(GamesState.memory.timer / 60)).padStart(2, '0');
            const secs = String(GamesState.memory.timer % 60).padStart(2, '0');
            const timerEl = document.getElementById('memoryTimerVal');
            if (timerEl) timerEl.textContent = `${mins}:${secs}`;
        }, 1000);
    }

    function stopMemoryTimer() {
        if (GamesState.memory.timerInterval) {
            clearInterval(GamesState.memory.timerInterval);
            GamesState.memory.timerInterval = null;
        }
    }

    window.restartMemoryGame = function () {
        initMemoryTab();
    };

    // ==========================================================================
    // 10. اللعبة 6: ميزان اللام الشمسية واللام القمرية (☀️🌙 Sun & Moon Logic)
    // ==========================================================================
    function initSorterTab() {
        GamesState.sorter.currentIndex = 0;
        GamesState.sorter.streak = 0;
        GamesState.sorter.score = 0;
        loadSorterCard();
    }

    function loadSorterCard() {
        const idx = GamesState.sorter.currentIndex % LAM_WORDS_BANK.length;
        const item = LAM_WORDS_BANK[idx];

        const wordDisplay = document.getElementById('sorterWordDisplay');
        const feedbackPill = document.getElementById('sorterFeedbackPill');
        const streakEl = document.getElementById('sorterStreakCount');

        if (wordDisplay) wordDisplay.textContent = item.word;
        if (feedbackPill) feedbackPill.style.display = 'none';
        if (streakEl) streakEl.textContent = GamesState.sorter.streak;
    }

    window.classifySorterWord = function (choice) {
        const idx = GamesState.sorter.currentIndex % LAM_WORDS_BANK.length;
        const item = LAM_WORDS_BANK[idx];
        const feedbackPill = document.getElementById('sorterFeedbackPill');

        if (choice === item.type) {
            playSuccessSound();
            GamesState.sorter.streak++;
            GamesState.sorter.score += 10;
            addScoreAndStars(10, 1);

            if (feedbackPill) {
                feedbackPill.style.display = 'block';
                feedbackPill.style.background = '#dcfce7';
                feedbackPill.style.color = '#15803d';
                feedbackPill.textContent = `✔ أحسنت! إجابة صحيحة (${item.reason})`;
            }

            speakGameItem(`${item.word}. لام ${choice === 'shamsi' ? 'شمسية' : 'قمرية'}. ${item.reason}`);

            setTimeout(() => {
                GamesState.sorter.currentIndex++;
                loadSorterCard();
            }, 1800);
        } else {
            playGentleWrongSound();
            GamesState.sorter.streak = 0;

            if (feedbackPill) {
                feedbackPill.style.display = 'block';
                feedbackPill.style.background = '#fee2e2';
                feedbackPill.style.color = '#b91c1c';
                feedbackPill.textContent = `✘ ليست ${choice === 'shamsi' ? 'شمسية' : 'قمرية'}! حاول ثانية يا بطل.`;
            }
        }
    };

    window.speakSorterWord = function () {
        const idx = GamesState.sorter.currentIndex % LAM_WORDS_BANK.length;
        const item = LAM_WORDS_BANK[idx];
        speakGameItem(item.word);
    };

    // ==========================================================================
    // 11. اللعبة 7: من سيربح وسام القراءة الذهبي (🏆 Reading Trophy Quiz Logic)
    // ==========================================================================
    function initQuizTab() {
        GamesState.quiz.currentLevel = 0;
        GamesState.quiz.score = 0;
        GamesState.quiz.lifelines = { fifty: true, poll: true, switch: true };

        updateQuizLifelinesUI();
        updateQuizLadderUI();
        loadQuizQuestion();
    }

    function updateQuizLifelinesUI() {
        const btn50 = document.getElementById('btnQuiz50');
        const btnPoll = document.getElementById('btnQuizPoll');
        const btnSwitch = document.getElementById('btnQuizSwitch');

        if (btn50) btn50.disabled = !GamesState.quiz.lifelines.fifty;
        if (btnPoll) btnPoll.disabled = !GamesState.quiz.lifelines.poll;
        if (btnSwitch) btnSwitch.disabled = !GamesState.quiz.lifelines.switch;
    }

    function updateQuizLadderUI() {
        const stepsContainer = document.getElementById('quizLadderSteps');
        if (!stepsContainer) return;
        stepsContainer.innerHTML = '';

        QUIZ_QUESTIONS_BANK.forEach((q, idx) => {
            const step = document.createElement('div');
            step.className = 'quiz-step-item';
            if (idx === GamesState.quiz.currentLevel) step.classList.add('active');
            else if (idx < GamesState.quiz.currentLevel) step.classList.add('completed');

            step.innerHTML = `
                <span>${idx + 1}. ${q.points} نقطة</span>
                <span>${idx === GamesState.quiz.currentLevel ? '⭐' : (idx < GamesState.quiz.currentLevel ? '✔' : '🔒')}</span>
            `;
            stepsContainer.appendChild(step);
        });
    }

    function loadQuizQuestion() {
        const q = QUIZ_QUESTIONS_BANK[GamesState.quiz.currentLevel];
        if (!q) {
            concludeQuizVictory();
            return;
        }

        updateQuizLadderUI();

        const qText = document.getElementById('quizQuestionText');
        const grid = document.getElementById('quizAnswersGrid');

        if (qText) qText.textContent = q.question;
        if (grid) {
            grid.innerHTML = '';
            q.answers.forEach((ans, idx) => {
                const btn = document.createElement('button');
                btn.className = 'quiz-answer-btn';
                btn.setAttribute('data-index', idx);
                btn.innerHTML = `<span style="opacity: 0.7;">[${idx + 1}]</span> <span>${ans}</span>`;
                btn.onclick = () => handleQuizAnswer(idx, btn, q);
                grid.appendChild(btn);
            });
        }

        speakGameItem(q.question);
    }

    function handleQuizAnswer(index, btn, q) {
        const allBtns = document.querySelectorAll('.quiz-answer-btn');
        allBtns.forEach(b => b.disabled = true);

        btn.classList.add('selected');

        setTimeout(() => {
            if (index === q.correct) {
                btn.classList.remove('selected');
                btn.classList.add('correct');
                playSuccessSound();

                GamesState.quiz.score += q.points;
                addScoreAndStars(q.points, 1);

                setTimeout(() => {
                    GamesState.quiz.currentLevel++;
                    loadQuizQuestion();
                }, 1600);
            } else {
                btn.classList.remove('selected');
                btn.classList.add('wrong');
                playGentleWrongSound();

                const correctBtn = document.querySelector(`.quiz-answer-btn[data-index="${q.correct}"]`);
                if (correctBtn) correctBtn.classList.add('correct');

                setTimeout(() => {
                    alert(`حاول ثانية يا بطل! رصيدك في المسابقة: ${GamesState.quiz.score} نقطة.`);
                    initQuizTab();
                }, 1800);
            }
        }, 800);
    }

    window.useQuizLifeline = function (type) {
        if (!GamesState.quiz.lifelines[type]) return;
        GamesState.quiz.lifelines[type] = false;
        updateQuizLifelinesUI();

        const q = QUIZ_QUESTIONS_BANK[GamesState.quiz.currentLevel];
        if (!q) return;

        if (type === 'fifty') {
            // حذف إجابتين خاطئتين
            const wrongIndices = [0, 1, 2, 3].filter(i => i !== q.correct);
            const toHide = wrongIndices.sort(() => 0.5 - Math.random()).slice(0, 2);

            toHide.forEach(idx => {
                const b = document.querySelector(`.quiz-answer-btn[data-index="${idx}"]`);
                if (b) {
                    b.style.opacity = '0.2';
                    b.disabled = true;
                }
            });
        } else if (type === 'poll') {
            alert(`تصويت تلاميذ الصف:\n- الإجابة (${q.correct + 1}): 78% صوتوا لها!\n- بقية الإجابات: 22%`);
        } else if (type === 'switch') {
            loadQuizQuestion();
        }
    };

    function concludeQuizVictory() {
        playCheerFanfare();
        addScoreAndStars(1000, 5);

        const qText = document.getElementById('quizQuestionText');
        const grid = document.getElementById('quizAnswersGrid');

        if (qText) qText.innerHTML = '👑 ألف مبارك يا بطل! لقد توجت بـ «وسام القراءة الذهبي» للصف الأول الابتدائي!';
        if (grid) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 20px; background: rgba(255,255,255,0.15); border-radius: 16px;">
                    <div style="font-size: 3rem; margin-bottom: 8px;">🏆🌟👑</div>
                    <div style="font-size: 1.3rem; font-weight: 900; color: #fde047;">وسام القراءة والطلاقة الملكي</div>
                    <div style="font-size: 0.95rem; margin-top: 6px; opacity: 0.9;">أكملت جميع أسئلة المسابقة ونلت 1000 نقطة كاملة!</div>
                    <button class="btn-games-action" style="margin-top: 14px; background: #eab308; color: #1e1b4b;" onclick="window.print()">
                        <span>🖨️</span> <span>طباعة وسام التفوق</span>
                    </button>
                </div>
            `;
        }
    }

    window.restartQuizGame = function () {
        initQuizTab();
    };

    // ==========================================================================
    // 12. واجهة التصدير العامة للنافذة (Public GamesHub API)
    // ==========================================================================
    window.GamesHub = {
        open: window.openGamesModal,
        close: window.closeGamesModal,
        switchTab: window.switchGamesTab,
        spinWheel: window.spinWheelNow,
        resetBattle: window.resetBattleGame,
        restartBubble: window.restartBubbleGame,
        restartMemory: window.restartMemoryGame,
        restartQuiz: window.restartQuizGame
    };

})();
