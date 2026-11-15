/* ==========================================================================
 * منصة قراءتي التفاعلية الذكية - الوحدة الرابعة: صحتي وبيئتي (Unit 4 Lessons)
 * الدرس الأول: مدخل الوحدة: الاستماع والمحادثة (صحتي وبيئتي) (ص ٧١ - ٧٢)
 * الدرس الثاني: حرف الحاء (حـ ، ـحـ ، ـح ، ح) وقراءة صَلَاح تِلْمِيذ (ص ٧٢ - ٧٦)
 * إعداد وتطوير: المهندس أسامة خليل هاشم
 * ========================================================================== */

(function() {
    /* ========================================================
       القسم 1: مدخل الوحدة الرابعة: الاستماع والمحادثة (صحتي وبيئتي)
    ======================================================== */
    window.switchUnit4Station = function(stationNum) {
        document.querySelectorAll('#view-tab-unit4_intro .station-tab').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('#view-tab-unit4_intro .unit4-station').forEach(el => el.classList.remove('active'));

        const targetStation = document.getElementById('stationUnit4_' + stationNum);
        const targetBtn = document.getElementById('btnStationUnit4_' + stationNum);

        if (targetStation) targetStation.classList.add('active');
        if (targetBtn) targetBtn.classList.add('active');

        if (stationNum === 1) {
            mascotSpeak('مَرْحَباً بِكُمْ فِي الْوَحْدَةِ الرَّابِعَة: صِحَّتِي وَبِيئَتِي! اِسْتَمِعُوا لِقِصَّةِ الصِّحَّةِ وَالنَّظَافَةِ وَالْبِيئَةِ الْجَمِيلَة!', 'unit4_intro_welcome');
        } else if (stationNum === 2) {
            mascotSpeak('الْمُحَادَثَةُ وَالتَّعْبِيرُ الشَّفَوِيّ! كَيْفَ نُحَافِظُ عَلَى صِحَّتِنَا وَنَظَافَةِ مَدْرَسَتِنَا وَبِيئَتِنَا؟ اِضْغَطْ عَلَى الْبِطَاقَاتِ!', 'unit4_talk_health');
        } else if (stationNum === 3) {
            mascotSpeak('تَحَدِّي السُّلُوكِيَّاتِ الصِّحِّيَّةِ وَالْبِيئِيَّة! اِخْتَبِرْ مَعْلُومَاتِكَ وَسَاعِدْ فَصِيحَ فِي اخْتِيَارِ الْعَادَاتِ السَّلِيمَة!', 'letter_h_quiz_intro');
        }
    };

    window.playUnit4Story = function(type) {
        mascotCelebrates();
        if (type === 'full') {
            mascotSpeak('اِسْتَمِعْ لِقِصَّةِ صِحَّتِي وَبِيئَتِي كَامِلَةً مَعَ الْمُعَلِّمَةِ رَنَا الفَصِيحَة:', 'unit4_intro_story_full');
        } else if (type === 'welcome') {
            mascotSpeak('تَرْحِيبُ فَصِيح بِالْوَحْدَةِ الرَّابِعَة:', 'unit4_intro_welcome');
        } else if (type === 'health') {
            mascotSpeak('كَيْفَ أُحَافِظُ عَلَى صِحَّتِي الْيَوْمِيَّة:', 'unit4_talk_health');
        } else if (type === 'clean') {
            mascotSpeak('الْعِنَايَةُ بِالنَّظَافَةِ وَحِمَايَةِ الْبِيئَة:', 'unit4_talk_clean');
        } else if (type === 'food') {
            mascotSpeak('الْغِذَاءُ الصِّحِّيُّ الْمُتَوَازِنُ لِلْأَبْطَال:', 'unit4_talk_food');
        }
    };

    window.checkUnit4Habit = function(item, isHealthy, btn) {
        if (isHealthy) {
            mascotCelebrates();
            btn.style.borderColor = '#10b981';
            btn.style.background = '#ecfdf5';
            playAudio('letter_h_correct');
            mascotSpeak(`عَادَةٌ صِحِّيَّةٌ مُمْتَازَة: <b>${item}</b>! صِحَّتُنَا أَمَانَةٌ وَنَظَافَتُنَا قُوَّة!`, 'letter_h_correct');
        } else {
            mascotThinks();
            btn.style.borderColor = '#ef4444';
            btn.style.background = '#fef2f2';
            playAudio('letter_h_wrong');
            mascotSpeak(`انْتَبِهْ يَا بَطَل! <b>${item}</b> عَادَةٌ غَيْرُ صِحِّيَّةٍ وَتَضُرُّ بِالْجِسْمِ وَالْبِيئَة!`, 'letter_h_wrong');
        }
    };

    /* ========================================================
       القسم 2: درس حرف الحاء وقراءة صَلَاح تِلْمِيذ وصَلَاح فَلَّاح
    ======================================================== */
    window.switchLetterHStation = function(stationNum) {
        document.querySelectorAll('#view-tab-letter_h .station-tab').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('#view-tab-letter_h .letter-h-station').forEach(el => el.classList.remove('active'));

        const targetStation = document.getElementById('stationH_' + stationNum);
        const targetBtn = document.getElementById('btnStationH_' + stationNum);

        if (targetStation) targetStation.classList.add('active');
        if (targetBtn) targetBtn.classList.add('active');

        if (stationNum === 1) {
            mascotSpeak('الْوَحْدَةُ الرَّابِعَةُ: حَرْفُ الْحَاءِ (حـ ، ـحـ ، ـح ، ح) وَقِرَاءَةُ صَلَاح تِلْمِيذ وَصَلَاح فَلَّاح (ص ٧٢ - ٧٦)! اسْتَمِعُوا لِصَوْتِ الْحَاءِ الْحَلْقِيِّ الصَّافِي، وَتَعَلَّمُوا مَعَ صَلَاحٍ الْعِنَايَةَ بِالصِّحَّةِ وَالْبِيئَة!', 'letter_h_intro');
        } else if (stationNum === 2) {
            mascotSpeak('أَصْوَاتُ الْمُدُودِ وَالْحَاءِ السَّاكِنَةِ وَالتَّنْوِين! قَارِنْ بَيْنَ حَـ حُـ حِـ وَ حَا حُو حِيـ، وَمَيِّزْ مَقَاطِعَ: مِحْـ ، فَحْـ ، مَحْـ ، وَتَنْوِينَاتِ: حٌ ، حً ، حٍ!', 'letter_h_vowels_station');
        } else if (stationNum === 3) {
            mascotSpeak('الْتَّحْلِيلُ وَالتَّرْكِيبُ الصَّوْتِيّ! فَكِّكْ كَلِمَاتِ (حَبْل ، نَحْل ، حَقْل ، صَلَاح ، فَلَّاح ، مِحْرَار ، مَحْفَظَة) بِالتَّصْفِيق، وَرَكِّبِ الْمَقَاطِعَ لِتَكْوِينِ كَلِمَاتٍ جَدِيدَة!', 'letter_h_analysis_intro');
        } else if (stationNum === 4) {
            mascotSpeak('قِرَاءَةُ (صَلَاح تِلْمِيذ) وَ(صَلَاح فَلَّاح) وَنُصُوصِ الْكِتَابِ الْمَدْرَسِيّ! اقْرَأْ قِرَاءَةً جَهْرِيَّةً سَلِيمَةً سَطْراً بِسَطْر وَتَدَرَّبْ عَلَى كِتَابَةِ حَرْفِ الْحَاءِ عَلَى السَّبُّورَةِ التَّفَاعُلِيَّة!', 'letter_h_read_intro');
            setTimeout(initHCanvas, 100);
        }
    };

    window.playHLetterSound = function() {
        mascotCelebrates();
        playAudio('letter_h_sound');
    };

    window.playHPhonemeFaseeh = function() {
        mascotCelebrates();
        playAudio('letter_h_phoneme_faseeh');
    };

    window.playHWord = function(wordKey) {
        mascotCelebrates();
        const map = {
            'salah': 'letter_h_word_salah',
            'telmeeth': 'letter_h_word_telmeeth',
            'fallaah': 'letter_h_word_fallaah',
            'haql': 'letter_h_word_haql',
            'qamh': 'letter_h_word_qamh',
            'mahasin': 'letter_h_word_mahasin',
            'hisaan': 'letter_h_word_hisaan',
            'habl': 'letter_h_word_habl',
            'hasheesh': 'letter_h_word_hasheesh',
            'milh': 'letter_h_word_milh',
            'miftaah': 'letter_h_word_miftaah',
            'hithaa': 'letter_h_word_hithaa',
            'huboob': 'letter_h_word_huboob',
            'hamaamah': 'letter_h_word_hamaamah',
            'heetaan': 'letter_h_word_heetaan',
            'hoot': 'letter_h_word_hoot',
            'haait': 'letter_h_word_haait',
            'nahl': 'letter_h_word_nahl',
            'mihraar': 'letter_h_word_mihraar',
            'fahm': 'letter_h_word_fahm',
            'mahfazah': 'letter_h_word_mahfazah',
            'sahab': 'letter_h_word_sahab',
            'haamid': 'letter_h_word_haamid',
            'haatim': 'letter_h_word_haatim',
            'haaris': 'letter_h_word_haaris',
            'hasan': 'letter_h_word_hasan',
            'hayawan': 'letter_h_word_hayawan',
            'timsah': 'letter_h_word_timsah',
            'hanaan': 'letter_h_word_hanaan'
        };
        const audioKey = map[wordKey] || ('letter_h_word_' + wordKey);
        playAudio(audioKey);
    };

    window.playHVowel = function(vowelKey) {
        mascotCelebrates();
        const map = {
            'short_a': 'letter_h_short_a',
            'short_u': 'letter_h_short_u',
            'short_i': 'letter_h_short_i',
            'long_aa': 'letter_h_long_aa',
            'long_oo': 'letter_h_long_oo',
            'long_ee': 'letter_h_long_ee',
            'tanween_dham': 'letter_h_tanween_dham',
            'tanween_fath': 'letter_h_tanween_fath',
            'tanween_kasr': 'letter_h_tanween_kasr'
        };
        playAudio(map[vowelKey] || ('letter_h_' + vowelKey));
    };

    window.playHSyllable = function(sylKey) {
        mascotCelebrates();
        const map = {
            'mih': 'letter_h_syl_mih',
            'fah': 'letter_h_syl_fah',
            'mah': 'letter_h_syl_mah'
        };
        playAudio(map[sylKey] || ('letter_h_syl_' + sylKey));
    };

    window.playHSplitWord = function(wordKey) {
        mascotCelebrates();
        const map = {
            'habl': 'letter_h_split_habl',
            'nahl': 'letter_h_split_nahl',
            'haql': 'letter_h_split_haql',
            'salah': 'letter_h_split_salah',
            'fallaah': 'letter_h_split_fallaah',
            'qamh': 'letter_h_split_qamh',
            'miftaah': 'letter_h_split_miftaah',
            'mahfazah': 'letter_h_split_mahfazah',
            'hisaan': 'letter_h_split_hisaan'
        };
        playAudio(map[wordKey] || ('letter_h_split_' + wordKey));
    };

    window.playHMerge = function(wordKey) {
        mascotCelebrates();
        const map = {
            'sahab': 'letter_h_merge_sahab',
            'haamid': 'letter_h_merge_haamid',
            'haatim': 'letter_h_merge_haatim',
            'haaris': 'letter_h_merge_haaris',
            'salah': 'letter_h_merge_salah',
            'fallaah': 'letter_h_merge_fallaah',
            'haql': 'letter_h_merge_haql',
            'mahasin': 'letter_h_merge_mahasin',
            'hasan': 'letter_h_merge_hasan'
        };
        playAudio(map[wordKey] || ('letter_h_merge_' + wordKey));
    };

    /* تبديل نصوص القراءة الثلاثة في المحطة الرابعة */
    window.switchHReadingTab = function(tabName) {
        document.querySelectorAll('.reading-tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.reading-subpanel').forEach(panel => panel.classList.remove('active'));

        const btn = document.getElementById('btnHReading_' + tabName);
        const panel = document.getElementById('subpanelHReading_' + tabName);

        if (btn) btn.classList.add('active');
        if (panel) panel.classList.add('active');

        if (tabName === 'telmeeth') {
            mascotSpeak('نَصُّ قِرَاءَةِ (صَلَاح تِلْمِيذ): صَلَاحٌ تِلْمِيذٌ نَشِيطٌ يُحَافِظُ عَلَى صِحَّتِهِ وَنَظَافَةِ بِيئَتِهِ!', 'letter_h_read_telmeeth_full');
        } else if (tabName === 'fallaah') {
            mascotSpeak('نَصُّ قِرَاءَةِ (صَلَاح فَلَّاح) التُّرَاثِيِّ الْأَصِيل: صَلَاحٌ فَلَّاحٌ عِنْدَهُ حَقْلٌ يَزْرَعُ فِيهِ الْقَمْح!', 'letter_h_read_fallaah_full');
        } else if (tabName === 'book') {
            mascotSpeak('نُصُوصُ كِتَابِ الْقِرَاءَةِ الْجَدِيدِ ص ٧٤: يُطْعِمُ حَسَنٌ حَمَامًا، نَرْفُقُ بِحَمَامِنَا وَلَنْ نَحْبِسَ حَيَوَانًا!', 'letter_h_read_book_full');
        }
    };

    /* قراءة أسطر النصوص سطر بسطر */
    window.playHReadingLine = function(textType, lineNum) {
        mascotCelebrates();
        document.querySelectorAll('.reading-line-card').forEach(el => el.classList.remove('active'));

        if (textType === 'telmeeth') {
            if (lineNum === 0) {
                playAudio('letter_h_read_telmeeth_full');
            } else {
                const lineCard = document.getElementById('lineHTelmeeth' + lineNum);
                if (lineCard) lineCard.classList.add('active');
                playAudio('letter_h_read_t' + lineNum);
            }
        } else if (textType === 'fallaah') {
            if (lineNum === 0) {
                playAudio('letter_h_read_fallaah_full');
            } else {
                const lineCard = document.getElementById('lineHFallaah' + lineNum);
                if (lineCard) lineCard.classList.add('active');
                playAudio('letter_h_read_f' + lineNum);
            }
        } else if (textType === 'book') {
            if (lineNum === 0) {
                playAudio('letter_h_read_book_full');
            } else {
                const lineCard = document.getElementById('lineHBook' + lineNum);
                if (lineCard) lineCard.classList.add('active');
                playAudio('letter_h_read_b' + lineNum);
            }
        }
    };

    /* سبورة رسم وتتبع حرف الحاء */
    var hCanvas = null;
    var hCtx = null;
    var isDrawingH = false;
    var hStrokeColor = '#059669';

    window.initHCanvas = function() {
        const box = document.getElementById('hCanvasBox');
        if (!box) return;

        hCanvas = document.getElementById('canvasHTrace');
        if (!hCanvas) return;

        hCanvas.width = box.clientWidth || 600;
        hCanvas.height = box.clientHeight || 300;
        hCtx = hCanvas.getContext('2d');
        hCtx.lineCap = 'round';
        hCtx.lineJoin = 'round';
        hCtx.lineWidth = 6;
        hCtx.strokeStyle = hStrokeColor;

        drawHGuidelines();

        function getPos(e) {
            const rect = hCanvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
        }

        function startDraw(e) {
            isDrawingH = true;
            const pos = getPos(e);
            hCtx.beginPath();
            hCtx.moveTo(pos.x, pos.y);
            if (e.touches) e.preventDefault();
        }

        function moveDraw(e) {
            if (!isDrawingH) return;
            const pos = getPos(e);
            hCtx.lineTo(pos.x, pos.y);
            hCtx.stroke();
            if (e.touches) e.preventDefault();
        }

        function stopDraw(e) {
            if (isDrawingH) {
                isDrawingH = false;
                hCtx.closePath();
            }
        }

        hCanvas.onmousedown = startDraw;
        hCanvas.onmousemove = moveDraw;
        window.addEventListener('mouseup', stopDraw);

        hCanvas.ontouchstart = startDraw;
        hCanvas.ontouchmove = moveDraw;
        hCanvas.ontouchend = stopDraw;
    };

    function drawHGuidelines() {
        if (!hCtx || !hCanvas) return;
        const w = hCanvas.width;
        const h = hCanvas.height;

        hCtx.clearRect(0, 0, w, h);

        // خط الأساس الأخضر
        const baseline = h * 0.58;
        hCtx.save();
        hCtx.setLineDash([8, 6]);
        hCtx.strokeStyle = '#cbd5e1';
        hCtx.lineWidth = 2;

        // خط علوي
        hCtx.beginPath();
        hCtx.moveTo(20, h * 0.3);
        hCtx.lineTo(w - 20, h * 0.3);
        hCtx.stroke();

        // خط الأساس الرئيسي
        hCtx.setLineDash([]);
        hCtx.strokeStyle = '#10b981';
        hCtx.lineWidth = 3;
        hCtx.beginPath();
        hCtx.moveTo(20, baseline);
        hCtx.lineTo(w - 20, baseline);
        hCtx.stroke();

        // خط سفلي
        hCtx.setLineDash([8, 6]);
        hCtx.strokeStyle = '#cbd5e1';
        hCtx.lineWidth = 2;
        hCtx.beginPath();
        hCtx.moveTo(20, h * 0.85);
        hCtx.lineTo(w - 20, h * 0.85);
        hCtx.stroke();

        // رسم نموذج خفيف منقط لحرف الحاء حـ وح
        hCtx.font = 'bold ' + Math.floor(h * 0.38) + 'px "Tajawal", "Traditional Arabic", sans-serif';
        hCtx.fillStyle = '#e2e8f0';
        hCtx.textAlign = 'center';
        hCtx.textBaseline = 'alphabetic';
        hCtx.fillText('حـ', w * 0.72, baseline);
        hCtx.fillText('ـحـ', w * 0.48, baseline);
        hCtx.fillText('ح', w * 0.22, baseline + (h * 0.1));

        hCtx.restore();
    }

    window.clearHCanvas = function() {
        if (hCtx && hCanvas) {
            drawHGuidelines();
            mascotSpeak('تَمَّ مَسْحُ السَّبُّورَةِ! اِبْدَأْ بِكِتَابَةِ حَرْفِ الْحَاءِ مِنْ جَدِيدٍ يَا بَطَل!', 'letter_h_draw_hint');
        }
    };

    window.setHCanvasColor = function(color) {
        hStrokeColor = color;
        if (hCtx) hCtx.strokeStyle = color;
    };

    /* اختبار التحدي التفاعلي لدرس حرف الحاء */
    window.checkHQuiz = function(qNum, answer, btn) {
        const correctAnswers = {
            1: 'h_initial',
            2: 'haa_long',
            3: 'habl'
        };

        const parent = btn.closest('.h-quiz-card');
        if (parent) {
            parent.querySelectorAll('button').forEach(b => {
                b.style.borderColor = '#cbd5e1';
                b.style.background = '#ffffff';
            });
        }

        if (answer === correctAnswers[qNum]) {
            mascotCelebrates();
            btn.style.borderColor = '#059669';
            btn.style.background = '#ecfdf5';
            playAudio('letter_h_correct');
            mascotSpeak('أَحْسَنْتَ يَا بَطَل! إِجَابَةٌ صَحِيحَةٌ وَعَبْقَرِيَّة!', 'letter_h_correct');
        } else {
            mascotThinks();
            btn.style.borderColor = '#ef4444';
            btn.style.background = '#fef2f2';
            playAudio('letter_h_wrong');
            mascotSpeak('حَاوِلْ مَرَّةً أُخْرَى، رَكِّزْ جَيِّداً فِي صَوْتِ الْحَاءِ وَمَوْضِعِهِ!', 'letter_h_wrong');
        }
    };

    /* ========================================================
       الدرس الثالث: حرف الشين (شـ ، ـشـ ، ـش ، ش) وقراءة شَامِل شُرْطِيُّ الْمُرُور (ص ٧٥ - ٧٨)
    ======================================================== */
    let currentShStation = 1;
    let shCanvas = null;
    let shCtx = null;
    let isDrawingSh = false;
    let shStrokeColor = '#d97706';

    window.switchLetterShStation = function(stationNum) {
        currentShStation = stationNum;
        document.querySelectorAll('.letter-sh-station').forEach(el => el.classList.remove('active'));
        const target = document.getElementById('stationSh_' + stationNum);
        if (target) target.classList.add('active');

        for (let i = 1; i <= 4; i++) {
            const btn = document.getElementById('btnStationSh_' + i);
            if (btn) {
                if (i === stationNum) btn.classList.add('active');
                else btn.classList.remove('active');
            }
        }

        if (stationNum === 1) {
            mascotSpeak('أَهْلاً بِكُمْ فِي الْمَحَطَّةِ الأُولَى: أَتَعَرَّفُ حَرْفَ الشِّينِ وَصَوْتَهُ الصَّافِي وَأَشْكَالَهُ وَكَلِمَاتِهِ الْمُصَوَّرَةِ فِي الْكِتَابِ ص ٧٥!', 'letter_sh_intro');
        } else if (stationNum === 2) {
            mascotSpeak('الْمَحَطَّةُ الثَّانِيَةُ: أَصْوَاتُ الْمُدُودِ وَالتَّنْوِينِ وَتَمْيِيزُ صَوْتِ الشِّينِ السَّاكِنِ فِي ص ٧٥ - ٧٦!', 'letter_sh_vowels_station');
        } else if (stationNum === 3) {
            mascotSpeak('الْمَحَطَّةُ الثَّالِثَةُ: وَرْشَةُ التَّحْلِيلِ وَالتَّرْكِيبِ الصَّوْتِيِّ ص ٧٦ - ٧٧! صَفِّقُوا مَعِي لِكُلِّ مَقْطَعٍ وَاقْبِضُوا لِلسَّاكِن!', 'letter_sh_analysis_intro');
        } else if (stationNum === 4) {
            mascotSpeak('الْمَحَطَّةُ الرَّابِعَةُ: لَوْحَةُ قِرَاءَةِ (شَامِل شُرْطِيُّ الْمُرُور) وَنُصُوصِ الْكِتَابِ ص ٧٧ - ٧٨، مَعَ سَبُّورَةِ الرَّسْمِ وَاخْتِبَارِ التَّحَدِّي!', 'letter_sh_read_intro');
            setTimeout(initShCanvas, 100);
        }
    };

    window.playShLetterSound = function() {
        mascotCelebrates();
        playAudio('letter_sh_sound');
    };

    window.playShPhonemeFaseeh = function() {
        mascotCelebrates();
        playAudio('letter_sh_phoneme_faseeh');
    };

    window.playShWord = function(wordKey) {
        mascotCelebrates();
        const map = {
            'shamah': 'letter_sh_word_shamah',
            'shubbak': 'letter_sh_word_shubbak',
            'shiraa': 'letter_sh_word_shiraa',
            'mishmish': 'letter_sh_word_mishmish',
            'ashjaar': 'letter_sh_word_ashjaar',
            'shaari': 'letter_sh_word_shaari',
            'qushoor': 'letter_sh_word_qushoor',
            'manasheer': 'letter_sh_word_manasheer',
            'shams': 'letter_sh_word_shams',
            'shibl': 'letter_sh_word_shibl',
            'tabasheer': 'letter_sh_word_tabasheer',
            'ushb': 'letter_sh_word_ushb',
            'misht': 'letter_sh_word_misht',
            'mishaal': 'letter_sh_word_mishaal',
            'minshaar': 'letter_sh_word_minshaar',
            'farashah': 'letter_sh_word_farashah',
            'sheereen': 'letter_sh_word_sheereen',
            'ward': 'letter_sh_word_ward',
            'naseem': 'letter_sh_word_naseem',
            'hadeeqah': 'letter_sh_word_hadeeqah',
            'hulw': 'letter_sh_word_hulw',
            'mushriqah': 'letter_sh_word_mushriqah',
            'shamil': 'letter_sh_word_shamil',
            'shurti': 'letter_sh_word_shurti',
            'muroor': 'letter_sh_word_muroor',
            'nasheet': 'letter_sh_word_nasheet',
            'yaqif': 'letter_sh_word_yaqif',
            'tuloo': 'letter_sh_word_tuloo',
            'yusaid': 'letter_sh_word_yusaid',
            'alnaas': 'letter_sh_word_alnaas',
            'uboor': 'letter_sh_word_uboor',
            'reesh': 'letter_sh_word_reesh',
            'jaysh': 'letter_sh_word_jaysh',
            'qirsh': 'letter_sh_word_qirsh'
        };
        const audioKey = map[wordKey] || ('letter_sh_word_' + wordKey);
        playAudio(audioKey);
    };

    window.playShVowel = function(vowelKey) {
        mascotCelebrates();
        const map = {
            'short_a': 'letter_sh_short_a',
            'short_u': 'letter_sh_short_u',
            'short_i': 'letter_sh_short_i',
            'long_aa': 'letter_sh_long_aa',
            'long_oo': 'letter_sh_long_oo',
            'long_ee': 'letter_sh_long_ee',
            'tanween_dham': 'letter_sh_tanween_dham',
            'tanween_fath': 'letter_sh_tanween_fath',
            'tanween_kasr': 'letter_sh_tanween_kasr'
        };
        const audioKey = map[vowelKey] || ('letter_sh_' + vowelKey);
        playAudio(audioKey);
    };

    window.playShSyllable = function(sylKey) {
        mascotCelebrates();
        const map = {
            'mish': 'letter_sh_syl_mish',
            'ush': 'letter_sh_syl_ush',
            'sham': 'letter_sh_syl_sham',
            'min': 'letter_sh_syl_min'
        };
        const audioKey = map[sylKey] || ('letter_sh_syl_' + sylKey);
        playAudio(audioKey);
    };

    window.playShSplitWord = function(splitKey, count, hasSukoon) {
        mascotCelebrates();
        const map = {
            'shaari': 'letter_sh_split_shaari',
            'qushoor': 'letter_sh_split_qushoor',
            'minshaar': 'letter_sh_split_minshaar',
            'shamil': 'letter_sh_split_shamil',
            'nasheet': 'letter_sh_split_nasheet',
            'mishmish': 'letter_sh_split_mishmish',
            'shams': 'letter_sh_split_shams',
            'ushb': 'letter_sh_split_ushb'
        };
        const audioKey = map[splitKey] || ('letter_sh_split_' + splitKey);
        playAudio(audioKey);

        const card = document.getElementById('cardShSplit_' + splitKey);
        if (card) {
            card.classList.add('pulse-highlight');
            setTimeout(() => card.classList.remove('pulse-highlight'), 1200);
        }
    };

    window.playShMerge = function(mergeKey) {
        mascotCelebrates();
        const map = {
            'farashah': 'letter_sh_merge_farashah',
            'shams': 'letter_sh_merge_shams',
            'shamah': 'letter_sh_merge_shamah',
            'shamil': 'letter_sh_merge_shamil',
            'nasheet': 'letter_sh_merge_nasheet',
            'shurti': 'letter_sh_merge_shurti'
        };
        const audioKey = map[mergeKey] || ('letter_sh_merge_' + mergeKey);
        playAudio(audioKey);

        const card = document.getElementById('cardShMerge_' + mergeKey);
        if (card) {
            card.classList.add('pulse-highlight');
            setTimeout(() => card.classList.remove('pulse-highlight'), 1200);
        }
    };

    window.switchShReadingTab = function(tabIndex) {
        document.querySelectorAll('.sh-reading-panel').forEach(p => p.classList.remove('active'));
        const panel = document.getElementById('shReadingPanel_' + tabIndex);
        if (panel) panel.classList.add('active');

        for (let i = 1; i <= 2; i++) {
            const btn = document.getElementById('btnShReadingTab_' + i);
            if (btn) {
                if (i === tabIndex) btn.classList.add('active');
                else btn.classList.remove('active');
            }
        }
    };

    window.playShReadingLine = function(lineKey) {
        mascotCelebrates();
        playAudio('letter_sh_read_' + lineKey);
    };

    window.initShCanvas = function() {
        const box = document.getElementById('shCanvasBox');
        if (!box) return;

        shCanvas = document.getElementById('canvasShTrace');
        if (!shCanvas) return;

        shCanvas.width = box.clientWidth || 600;
        shCanvas.height = box.clientHeight || 300;
        shCtx = shCanvas.getContext('2d');
        shCtx.lineCap = 'round';
        shCtx.lineJoin = 'round';
        shCtx.lineWidth = 6;
        shCtx.strokeStyle = shStrokeColor;

        drawShGuidelines();

        function getPos(e) {
            const rect = shCanvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
        }

        function startDraw(e) {
            isDrawingSh = true;
            const pos = getPos(e);
            shCtx.beginPath();
            shCtx.moveTo(pos.x, pos.y);
            if (e.touches) e.preventDefault();
        }

        function moveDraw(e) {
            if (!isDrawingSh) return;
            const pos = getPos(e);
            shCtx.lineTo(pos.x, pos.y);
            shCtx.stroke();
            if (e.touches) e.preventDefault();
        }

        function stopDraw(e) {
            if (isDrawingSh) {
                isDrawingSh = false;
                shCtx.closePath();
            }
        }

        shCanvas.onmousedown = startDraw;
        shCanvas.onmousemove = moveDraw;
        window.addEventListener('mouseup', stopDraw);

        shCanvas.ontouchstart = startDraw;
        shCanvas.ontouchmove = moveDraw;
        shCanvas.ontouchend = stopDraw;
    };

    function drawShGuidelines() {
        if (!shCtx || !shCanvas) return;
        const w = shCanvas.width;
        const h = shCanvas.height;

        shCtx.clearRect(0, 0, w, h);

        const baseline = h * 0.58;
        shCtx.save();
        shCtx.setLineDash([8, 6]);
        shCtx.strokeStyle = '#cbd5e1';
        shCtx.lineWidth = 2;

        // خط علوي
        shCtx.beginPath();
        shCtx.moveTo(20, h * 0.28);
        shCtx.lineTo(w - 20, h * 0.28);
        shCtx.stroke();

        // خط الأساس الرئيسي الأخضر
        shCtx.setLineDash([]);
        shCtx.strokeStyle = '#10b981';
        shCtx.lineWidth = 3;
        shCtx.beginPath();
        shCtx.moveTo(20, baseline);
        shCtx.lineTo(w - 20, baseline);
        shCtx.stroke();

        // خط سفلي
        shCtx.setLineDash([8, 6]);
        shCtx.strokeStyle = '#cbd5e1';
        shCtx.lineWidth = 2;
        shCtx.beginPath();
        shCtx.moveTo(20, h * 0.85);
        shCtx.lineTo(w - 20, h * 0.85);
        shCtx.stroke();

        // رسم نموذج خفيف منقط لحرف الشين بأشكاله
        shCtx.font = 'bold ' + Math.floor(h * 0.35) + 'px "Tajawal", "Traditional Arabic", sans-serif';
        shCtx.fillStyle = '#fde68a';
        shCtx.textAlign = 'center';
        shCtx.textBaseline = 'alphabetic';
        shCtx.fillText('شـ', w * 0.78, baseline);
        shCtx.fillText('ـشـ', w * 0.55, baseline);
        shCtx.fillText('ـش', w * 0.32, baseline + (h * 0.08));
        shCtx.fillText('ش', w * 0.12, baseline + (h * 0.08));

        shCtx.restore();
    }

    window.clearShCanvas = function() {
        if (shCtx && shCanvas) {
            drawShGuidelines();
            playAudio('letter_sh_draw_hint');
        }
    };

    window.setShCanvasColor = function(color) {
        shStrokeColor = color;
        if (shCtx) {
            shCtx.strokeStyle = color;
        }
    };

    window.checkShQuiz = function(qNum, answer, btn) {
        const correctAnswers = {
            1: 'start',
            2: 'qushoor',
            3: 'shamil_split',
            4: 'mish',
            5: 'police'
        };

        const parent = btn.closest('.quiz-question-box');
        if (parent) {
            parent.querySelectorAll('button').forEach(b => {
                b.style.borderColor = '#cbd5e1';
                b.style.background = '#ffffff';
            });
        }

        if (answer === correctAnswers[qNum]) {
            mascotCelebrates();
            btn.style.borderColor = '#d97706';
            btn.style.background = '#fffbeb';
            playAudio('letter_sh_correct');
            mascotSpeak('أَحْسَنْتَ يَا بَطَل! إِجَابَةٌ صَحِيحَةٌ وَعَبْقَرِيَّة!', 'letter_sh_correct');
        } else {
            mascotThinks();
            btn.style.borderColor = '#ef4444';
            btn.style.background = '#fef2f2';
            playAudio('letter_sh_wrong');
            mascotSpeak('حَاوِلْ مَرَّةً أُخْرَى، رَكِّزْ جَيِّداً فِي صَوْتِ الشِّينِ وَمَوْضِعِهِ!', 'letter_sh_wrong');
        }
    };


    /* ========================================================
       الدرس الرابع: حرف الزاي (ز ، ـز) وقراءة مِيزَان قَدُّورِي / وَزّ (ص ٧٨ - ٨٠)
    ======================================================== */
    let currentZStation = 1;
    let zCanvas = null;
    let zCtx = null;
    let isDrawingZ = false;
    let zStrokeColor = '#059669';

    window.switchLetterZStation = function(stationNum) {
        currentZStation = stationNum;
        document.querySelectorAll('.letter-z-station').forEach(el => el.classList.remove('active'));
        const target = document.getElementById('stationZ_' + stationNum);
        if (target) target.classList.add('active');

        for (let i = 1; i <= 4; i++) {
            const btn = document.getElementById('btnStationZ_' + i);
            if (btn) {
                if (i === stationNum) btn.classList.add('active');
                else btn.classList.remove('active');
            }
        }

        if (stationNum === 1) {
            mascotSpeak('أَهْلاً بِكُمْ فِي الْمَحَطَّةِ الأُولَى: أَتَعَرَّفُ حَرْفَ الزَّايِ وَصَوْتَهُ الصَّفِيرِيَّ الصَّافِي وَأَشْكَالَهُ وَكَلِمَاتِهِ الْمُصَوَّرَةِ فِي الْكِتَابِ ص ٧٨!', 'letter_z_intro');
        } else if (stationNum === 2) {
            mascotSpeak('الْمَحَطَّةُ الثَّانِيَةُ: أَصْوَاتُ الْمُدُودِ وَالتَّنْوِينِ وَتَمْيِيزُ صَوْتِ الزَّايِ السَّاكِنِ فِي ص ٧٨ - ٧٩!', 'letter_z_vowels_station');
        } else if (stationNum === 3) {
            mascotSpeak('الْمَحَطَّةُ الثَّالِثَةُ: وَرْشَةُ التَّحْلِيلِ وَالتَّرْكِيبِ الصَّوْتِيِّ ص ٧٩ - ٨٠! صَفِّقُوا مَعِي لِكُلِّ مَقْطَعٍ وَاقْبِضُوا لِلسَّاكِن!', 'letter_z_analysis_intro');
        } else if (stationNum === 4) {
            mascotSpeak('الْمَحَطَّةُ الرَّابِعَةُ: لَوْحَةُ قِرَاءَةِ (مِيزَان قَدُّورِي / وَزّ) وَنُصُوصِ الْكِتَابِ ص ٨٠، مَعَ سَبُّورَةِ الرَّسْمِ وَاخْتِبَارِ التَّحَدِّي!', 'letter_z_read_intro');
            setTimeout(initZCanvas, 100);
        }
    };

    window.playZLetterSound = function() {
        mascotCelebrates();
        playAudio('letter_z_sound');
    };

    window.playZPhonemeFaseeh = function() {
        mascotCelebrates();
        playAudio('letter_z_phoneme_faseeh');
    };

    window.playZWord = function(wordKey) {
        mascotCelebrates();
        const map = {
            'zahrah': 'letter_z_word_zahrah',
            'zujajah': 'letter_z_word_zujajah',
            'ghazal': 'letter_z_word_ghazal',
            'ruzz': 'letter_z_word_ruzz',
            'halazoon': 'letter_z_word_halazoon',
            'mizmar': 'letter_z_word_mizmar',
            'jazeerah': 'letter_z_word_jazeerah',
            'zaytoon': 'letter_z_word_zaytoon',
            'zeenah': 'letter_z_word_zeenah',
            'mizhariyyah': 'letter_z_word_mizhariyyah',
            'azhaar': 'letter_z_word_azhaar',
            'zawraq': 'letter_z_word_zawraq',
            'zaynab': 'letter_z_word_zaynab',
            'mazraah': 'letter_z_word_mazraah',
            'zurna': 'letter_z_word_zurna',
            'mazin': 'letter_z_word_mazin',
            'nashtari': 'letter_z_word_nashtari',
            'haleeb': 'letter_z_word_haleeb',
            'zubd': 'letter_z_word_zubd',
            'mizan': 'letter_z_word_mizan',
            'qaddoori': 'letter_z_word_qaddoori',
            'wazzan': 'letter_z_word_wazzan',
            'wazana': 'letter_z_word_wazana',
            'zabeeb': 'letter_z_word_zabeeb',
            'nadir': 'letter_z_word_nadir',
            'bazzaz': 'letter_z_word_bazzaz',
            'marra': 'letter_z_word_marra',
            'darbina': 'letter_z_word_darbina',
            'daqqa': 'letter_z_word_daqqa',
            'babana': 'letter_z_word_babana',
            'wazz': 'letter_z_word_wazz',
            'dada': 'letter_z_word_dada',
            'rabab': 'letter_z_word_rabab',
            'nameer': 'letter_z_word_nameer',
            'rabba': 'letter_z_word_rabba',
            'zayd': 'letter_z_word_zayd',
            'zaydoon': 'letter_z_word_zaydoon',
            'qareeb': 'letter_z_word_qareeb',
            'nazoor': 'letter_z_word_nazoor',
            'dar': 'letter_z_word_dar',
            'mawz': 'letter_z_word_mawz',
            'zirr': 'letter_z_word_zirr',
            'hizam': 'letter_z_word_hizam'
        };
        const audioKey = map[wordKey] || ('letter_z_word_' + wordKey);
        playAudio(audioKey);
    };

    window.playZVowel = function(vowelKey) {
        mascotCelebrates();
        const map = {
            'short_a': 'letter_z_short_a',
            'short_u': 'letter_z_short_u',
            'short_i': 'letter_z_short_i',
            'long_aa': 'letter_z_long_aa',
            'long_oo': 'letter_z_long_oo',
            'long_ee': 'letter_z_long_ee',
            'tanween_dham': 'letter_z_tanween_dham',
            'tanween_fath': 'letter_z_tanween_fath',
            'tanween_kasr': 'letter_z_tanween_kasr'
        };
        const audioKey = map[vowelKey] || ('letter_z_' + vowelKey);
        playAudio(audioKey);
    };

    window.playZSyllable = function(sylKey) {
        mascotCelebrates();
        const map = {
            'miz': 'letter_z_syl_miz',
            'az': 'letter_z_syl_az',
            'maz': 'letter_z_syl_maz',
            'zay': 'letter_z_syl_zay'
        };
        const audioKey = map[sylKey] || ('letter_z_syl_' + sylKey);
        playAudio(audioKey);
    };

    window.playZSplitWord = function(splitKey, count, hasSukoon) {
        mascotCelebrates();
        const map = {
            'mizmar': 'letter_z_split_mizmar',
            'zaytoon': 'letter_z_split_zaytoon',
            'zawraq': 'letter_z_split_zawraq',
            'ghazal': 'letter_z_split_ghazal',
            'halazoon': 'letter_z_split_halazoon',
            'mazraah': 'letter_z_split_mazraah',
            'azhaar': 'letter_z_split_azhaar'
        };
        const audioKey = map[splitKey] || ('letter_z_split_' + splitKey);
        playAudio(audioKey);

        const card = document.getElementById('cardZSplit_' + splitKey);
        if (card) {
            card.classList.add('pulse-highlight');
            setTimeout(() => card.classList.remove('pulse-highlight'), 1200);
        }
    };

    window.playZMerge = function(mergeKey) {
        mascotCelebrates();
        const map = {
            'zaytoon': 'letter_z_merge_zaytoon',
            'zaynab': 'letter_z_merge_zaynab',
            'mazraah': 'letter_z_merge_mazraah',
            'mizmar': 'letter_z_merge_mizmar',
            'ghazal': 'letter_z_merge_ghazal',
            'halazoon': 'letter_z_merge_halazoon'
        };
        const audioKey = map[mergeKey] || ('letter_z_merge_' + mergeKey);
        playAudio(audioKey);

        const card = document.getElementById('cardZMerge_' + mergeKey);
        if (card) {
            card.classList.add('pulse-highlight');
            setTimeout(() => card.classList.remove('pulse-highlight'), 1200);
        }
    };

    window.switchZReadingTab = function(tabIndex) {
        document.querySelectorAll('.z-reading-panel').forEach(p => p.classList.remove('active'));
        const panel = document.getElementById('zReadingPanel_' + tabIndex);
        if (panel) panel.classList.add('active');

        for (let i = 1; i <= 3; i++) {
            const btn = document.getElementById('btnZReadingTab_' + i);
            if (btn) {
                if (i === tabIndex) btn.classList.add('active');
                else btn.classList.remove('active');
            }
        }
    };

    window.playZReadingLine = function(lineKey) {
        mascotCelebrates();
        playAudio('letter_z_read_' + lineKey);
    };

    window.initZCanvas = function() {
        const box = document.getElementById('zCanvasBox');
        if (!box) return;

        zCanvas = document.getElementById('canvasZTrace');
        if (!zCanvas) return;

        zCanvas.width = box.clientWidth || 600;
        zCanvas.height = box.clientHeight || 300;
        zCtx = zCanvas.getContext('2d');
        zCtx.lineCap = 'round';
        zCtx.lineJoin = 'round';
        zCtx.lineWidth = 6;
        zCtx.strokeStyle = zStrokeColor;

        drawZGuidelines();

        function getPos(e) {
            const rect = zCanvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
        }

        function startDraw(e) {
            isDrawingZ = true;
            const pos = getPos(e);
            zCtx.beginPath();
            zCtx.moveTo(pos.x, pos.y);
            if (e.touches) e.preventDefault();
        }

        function moveDraw(e) {
            if (!isDrawingZ) return;
            const pos = getPos(e);
            zCtx.lineTo(pos.x, pos.y);
            zCtx.stroke();
            if (e.touches) e.preventDefault();
        }

        function stopDraw(e) {
            if (isDrawingZ) {
                isDrawingZ = false;
                zCtx.closePath();
            }
        }

        zCanvas.onmousedown = startDraw;
        zCanvas.onmousemove = moveDraw;
        window.addEventListener('mouseup', stopDraw);

        zCanvas.ontouchstart = startDraw;
        zCanvas.ontouchmove = moveDraw;
        zCanvas.ontouchend = stopDraw;
    };

    function drawZGuidelines() {
        if (!zCtx || !zCanvas) return;
        const w = zCanvas.width;
        const h = zCanvas.height;

        zCtx.clearRect(0, 0, w, h);

        const baseline = h * 0.58;
        zCtx.save();
        zCtx.setLineDash([8, 6]);
        zCtx.strokeStyle = '#cbd5e1';
        zCtx.lineWidth = 2;

        // خط علوي
        zCtx.beginPath();
        zCtx.moveTo(20, h * 0.28);
        zCtx.lineTo(w - 20, h * 0.28);
        zCtx.stroke();

        // خط الأساس الرئيسي الأخضر
        zCtx.setLineDash([]);
        zCtx.strokeStyle = '#059669';
        zCtx.lineWidth = 3;
        zCtx.beginPath();
        zCtx.moveTo(20, baseline);
        zCtx.lineTo(w - 20, baseline);
        zCtx.stroke();

        // خط سفلي
        zCtx.setLineDash([8, 6]);
        zCtx.strokeStyle = '#cbd5e1';
        zCtx.lineWidth = 2;
        zCtx.beginPath();
        zCtx.moveTo(20, h * 0.85);
        zCtx.lineTo(w - 20, h * 0.85);
        zCtx.stroke();

        // رسم نموذج خفيف منقط لحرف الزاي بأشكاله
        zCtx.font = 'bold ' + Math.floor(h * 0.38) + 'px "Tajawal", "Traditional Arabic", sans-serif';
        zCtx.fillStyle = '#bbf7d0';
        zCtx.textAlign = 'center';
        zCtx.textBaseline = 'alphabetic';
        zCtx.fillText('ز', w * 0.72, baseline + (h * 0.08));
        zCtx.fillText('ـز', w * 0.32, baseline + (h * 0.08));

        zCtx.restore();
    }

    window.clearZCanvas = function() {
        if (zCtx && zCanvas) {
            drawZGuidelines();
            playAudio('letter_z_draw_hint');
        }
    };

    window.setZCanvasColor = function(color) {
        zStrokeColor = color;
        if (zCtx) {
            zCtx.strokeStyle = color;
        }
    };

    window.checkZQuiz = function(qNum, answer, btn) {
        const correctAnswers = {
            1: 'start',
            2: 'mizmar',
            3: 'zaytoon_split',
            4: 'miz',
            5: 'qaddoori'
        };

        const parent = btn.closest('.quiz-question-box');
        if (parent) {
            parent.querySelectorAll('button').forEach(b => {
                b.style.borderColor = '#cbd5e1';
                b.style.background = '#ffffff';
            });
        }

        if (answer === correctAnswers[qNum]) {
            mascotCelebrates();
            btn.style.borderColor = '#059669';
            btn.style.background = '#f0fdf4';
            playAudio('letter_z_correct');
            mascotSpeak('أَحْسَنْتَ يَا بَطَل! إِجَابَةٌ صَحِيحَةٌ وَعَبْقَرِيَّة!', 'letter_z_correct');
        } else {
            mascotThinks();
            btn.style.borderColor = '#ef4444';
            btn.style.background = '#fef2f2';
            playAudio('letter_z_wrong');
            mascotSpeak('حَاوِلْ مَرَّةً أُخْرَى، رَكِّزْ جَيِّداً فِي صَوْتِ الزَّايِ وَمَوْضِعِهِ!', 'letter_z_wrong');
        }
    };

    /* ========================================================
       الدرس الخامس: حرف الجيم (جـ ، ـجـ ، ـج ، ج) وقراءة فَرَج نَسَّاج (ص ٨١ - ٨٣)
    ======================================================== */
    let currentJStation = 1;
    let jCanvas = null;
    let jCtx = null;
    let isDrawingJ = false;
    let jStrokeColor = '#7c3aed';

    window.switchLetterJStation = function(stationNum) {
        currentJStation = stationNum;
        document.querySelectorAll('.letter-j-station').forEach(el => el.classList.remove('active'));
        const target = document.getElementById('stationJ_' + stationNum);
        if (target) target.classList.add('active');

        for (let i = 1; i <= 4; i++) {
            const btn = document.getElementById('btnStationJ_' + i);
            if (btn) {
                if (i === stationNum) btn.classList.add('active');
                else btn.classList.remove('active');
            }
        }

        if (stationNum === 1) {
            mascotSpeak('أَهْلاً بِكُمْ فِي الْمَحَطَّةِ الأُولَى: أَتَعَرَّفُ حَرْفَ الْجِيمِ وَصَوْتَهُ الشَّدِيدَ الْمَجْهُورَ وَأَشْكَالَهُ الأَرْبَعَةَ وَكَلِمَاتِهِ الْمُصَوَّرَةِ فِي الْكِتَابِ ص ٨١!', 'letter_j_intro');
        } else if (stationNum === 2) {
            mascotSpeak('الْمَحَطَّةُ الثَّانِيَةُ: نَسْتَمِعُ إِلَى أَصْوَاتِ الْجِيمِ مَعَ الْحَرَكَاتِ وَالْمُدُودِ وَالتَّنْوِينِ وَالْمَقَاطِعِ السَّاكِنَةِ (ص ٨١ - ٨٢)!', 'letter_j_vowels_station');
        } else if (stationNum === 3) {
            mascotSpeak('الْمَحَطَّةُ الثَّالِثَةُ: وَرْشَةُ التَّحْلِيلِ وَالتَّرْكِيبِ الصَّوْتِيِّ لِحَرْفِ الْجِيمِ (ص ٨٢ - ٨٣)!', 'letter_j_analysis_intro');
        } else if (stationNum === 4) {
            mascotSpeak('الْمَحَطَّةُ الرَّابِعَةُ: قِرَاءَةُ نَصِّ (تَعْبُرُ جَنَى شَارِعَنَا) وَنَصِّ (فَرَج نَسَّاج)، مَعَ سَبُّورَةِ الرَّسْمِ وَاخْتِبَارِ التَّحَدِّي الذَّكِيّ!', 'letter_j_read_intro');
            setTimeout(initJCanvas, 100);
        }
    };

    window.playLetterJSound = function() {
        mascotCelebrates();
        playAudio('letter_j_sound');
    };

    window.playJLetterSound = function() {
        mascotCelebrates();
        playAudio('letter_j_sound');
    };

    window.playJPhonemeFaseeh = function() {
        mascotCelebrates();
        playAudio('letter_j_phoneme_faseeh');
    };

    window.playJWord = function(wordKey) {
        mascotCelebrates();
        const map = {
            'jamal': 'letter_j_word_jamal',
            'jazar': 'letter_j_word_jazar',
            'jubn': 'letter_j_word_jubn',
            'jisr': 'letter_j_word_jisr',
            'thalj': 'letter_j_word_thalj',
            'najm': 'letter_j_word_najm',
            'nujoom': 'letter_j_word_nujoom',
            'ajeen': 'letter_j_word_ajeen',
            'jaami': 'letter_j_word_jaami',
            'jaamoos': 'letter_j_word_jaamoos',
            'jaamoosah': 'letter_j_word_jaamoosah',
            'majoon': 'letter_j_word_majoon',
            'rijl': 'letter_j_word_rijl',
            'mijhar': 'letter_j_word_mijhar',
            'jimaal': 'letter_j_word_jimaal',
            'jaalis': 'letter_j_word_jaalis',
            'jana': 'letter_j_word_jana',
            'jameel': 'letter_j_word_jameel',
            'jameelah': 'letter_j_word_jameelah',
            'faraj': 'letter_j_word_faraj',
            'nassaaj': 'letter_j_word_nassaaj',
            'nassaajah': 'letter_j_word_nassaajah',
            'yansiju': 'letter_j_word_yansiju',
            'tansiju': 'letter_j_word_tansiju',
            'bisaat': 'letter_j_word_bisaat',
            'qumaash': 'letter_j_word_qumaash',
            'jadeedan': 'letter_j_word_jadeedan',
            'mahirah': 'letter_j_word_mahirah',
            'tunaqqishu': 'letter_j_word_tunaqqishu',
            'wardan': 'letter_j_word_wardan',
            'ashjaaran': 'letter_j_word_ashjaaran',
            'shaariuna': 'letter_j_word_shaariuna',
            'hadeeqah': 'letter_j_word_hadeeqah',
            'madrasah': 'letter_j_word_madrasah',
            'taaburu': 'letter_j_word_taaburu',
            'saara': 'letter_j_word_saara',
            'wisaam': 'letter_j_word_wisaam',
            'nawras': 'letter_j_word_nawras',
            'widaad': 'letter_j_word_widaad',
            'wasan': 'letter_j_word_wasan',
            'tadrusaan': 'letter_j_word_tadrusaan',
            'shajarah': 'letter_j_word_shajarah',
            'burj': 'letter_j_word_burj',
            'jazeerah': 'letter_j_word_jazeerah',
            'jawrab': 'letter_j_word_jawrab',
            'jaras': 'letter_j_word_jaras',
            'hajar': 'letter_j_word_hajar',
            'taaj': 'letter_j_word_taaj',
            'dajaajah': 'letter_j_word_dajaajah',
            'khurooj': 'letter_j_word_khurooj'
        };
        const audioKey = map[wordKey] || ('letter_j_word_' + wordKey);
        playAudio(audioKey);
    };

    window.playJVowel = function(vowelKey) {
        mascotCelebrates();
        const map = {
            'short_a': 'letter_j_short_a',
            'short_u': 'letter_j_short_u',
            'short_i': 'letter_j_short_i',
            'long_aa': 'letter_j_long_aa',
            'long_oo': 'letter_j_long_oo',
            'long_ee': 'letter_j_long_ee',
            'tanween_dham': 'letter_j_tanween_dham',
            'tanween_fath': 'letter_j_tanween_fath',
            'tanween_kasr': 'letter_j_tanween_kasr'
        };
        const audioKey = map[vowelKey] || ('letter_j_' + vowelKey);
        playAudio(audioKey);
    };

    window.playJSyllable = function(sylKey) {
        mascotCelebrates();
        const map = {
            'naj': 'letter_j_syl_naj',
            'rij': 'letter_j_syl_rij',
            'mij': 'letter_j_syl_mij',
            'yaj': 'letter_j_syl_yaj'
        };
        const audioKey = map[sylKey] || ('letter_j_syl_' + sylKey);
        playAudio(audioKey);
    };

    window.playJSplitWord = function(wordKey) {
        mascotCelebrates();
        const map = {
            'ajeen': 'letter_j_split_ajeen',
            'majoon': 'letter_j_split_majoon',
            'jaamoos': 'letter_j_split_jaamoos',
            'jazar': 'letter_j_split_jazar',
            'najm': 'letter_j_split_najm',
            'faraj': 'letter_j_split_faraj',
            'nassaaj': 'letter_j_split_nassaaj'
        };
        const audioKey = map[wordKey] || ('letter_j_split_' + wordKey);
        playAudio(audioKey);
    };

    window.playJMerge = function(mergeKey) {
        mascotCelebrates();
        const map = {
            'jimaal': 'letter_j_merge_jimaal',
            'jaami': 'letter_j_merge_jaami',
            'jaalis': 'letter_j_merge_jaalis',
            'jameel': 'letter_j_merge_jameel',
            'jubn': 'letter_j_merge_jubn',
            'thalj': 'letter_j_merge_thalj'
        };
        const audioKey = map[mergeKey] || ('letter_j_merge_' + mergeKey);
        playAudio(audioKey);
    };

    window.switchJReadingTab = function(tabId) {
        const bookTab = document.getElementById('jReadingBookContent');
        const farajTab = document.getElementById('jReadingFarajContent');
        const btnBook = document.getElementById('btnJReadBook');
        const btnFaraj = document.getElementById('btnJReadFaraj');

        if (tabId === 'book') {
            if (bookTab) bookTab.style.display = 'block';
            if (farajTab) farajTab.style.display = 'none';
            if (btnBook) { btnBook.classList.add('active'); btnBook.style.background = '#7c3aed'; btnBook.style.color = '#ffffff'; }
            if (btnFaraj) { btnFaraj.classList.remove('active'); btnFaraj.style.background = '#ede9fe'; btnFaraj.style.color = '#5b21b6'; }
            mascotSpeak('نَقْرَأُ نَصَّ الْكِتَابِ الْمَدْرَسِيِّ ص ٨٣: تَعْبُرُ جَنَى شَارِعَنَا!', 'letter_j_read_intro');
        } else {
            if (bookTab) bookTab.style.display = 'none';
            if (farajTab) farajTab.style.display = 'block';
            if (btnFaraj) { btnFaraj.classList.add('active'); btnFaraj.style.background = '#7c3aed'; btnFaraj.style.color = '#ffffff'; }
            if (btnBook) { btnBook.classList.remove('active'); btnBook.style.background = '#ede9fe'; btnBook.style.color = '#5b21b6'; }
            mascotSpeak('نَقْرَأُ الْقِرَاءَةَ التُّرَاثِيَّةَ الْعِرَاقِيَّةَ الأَصِيلَةَ: فَرَجٌ نَسَّاجٌ يَنْسِجُ بِسَاطًا جَدِيدًا!', 'letter_j_read_faraj_full');
        }
    };

    window.playJReadingLine = function(lineKey) {
        mascotCelebrates();
        const map = {
            'b_full': 'letter_j_read_book_full',
            'b1': 'letter_j_read_b1',
            'b2': 'letter_j_read_b2',
            'b3': 'letter_j_read_b3',
            'b4': 'letter_j_read_b4',
            'b5': 'letter_j_read_b5',
            'f_full': 'letter_j_read_faraj_full',
            'f1': 'letter_j_read_f1',
            'f2': 'letter_j_read_f2',
            'f3': 'letter_j_read_f3',
            'f4': 'letter_j_read_f4',
            'f5': 'letter_j_read_f5',
            'f6': 'letter_j_read_f6'
        };
        const audioKey = map[lineKey] || ('letter_j_read_' + lineKey);
        playAudio(audioKey);
    };

    window.initJCanvas = function() {
        jCanvas = document.getElementById('letterJDrawCanvas');
        if (!jCanvas) return;
        jCtx = jCanvas.getContext('2d');

        const rect = jCanvas.parentElement.getBoundingClientRect();
        jCanvas.width = rect.width || 600;
        jCanvas.height = 300;

        drawJGuidelines();

        function getPos(e) {
            const r = jCanvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return {
                x: (clientX - r.left) * (jCanvas.width / r.width),
                y: (clientY - r.top) * (jCanvas.height / r.height)
            };
        }

        function startDraw(e) {
            isDrawingJ = true;
            const pos = getPos(e);
            jCtx.beginPath();
            jCtx.moveTo(pos.x, pos.y);
            e.preventDefault();
        }

        function draw(e) {
            if (!isDrawingJ) return;
            const pos = getPos(e);
            jCtx.lineTo(pos.x, pos.y);
            jCtx.strokeStyle = jStrokeColor;
            jCtx.lineWidth = 6;
            jCtx.lineCap = 'round';
            jCtx.lineJoin = 'round';
            jCtx.stroke();
            e.preventDefault();
        }

        function stopDraw() {
            isDrawingJ = false;
        }

        jCanvas.onmousedown = startDraw;
        jCanvas.onmousemove = draw;
        window.addEventListener('mouseup', stopDraw);

        jCanvas.ontouchstart = startDraw;
        jCanvas.ontouchmove = draw;
        window.addEventListener('touchend', stopDraw);
    };

    function drawJGuidelines() {
        if (!jCtx || !jCanvas) return;
        const w = jCanvas.width;
        const h = jCanvas.height;
        jCtx.clearRect(0, 0, w, h);

        jCtx.save();
        const baseline = h * 0.52;

        // خط الأساس الأخضر
        jCtx.strokeStyle = '#10b981';
        jCtx.lineWidth = 3;
        jCtx.beginPath();
        jCtx.moveTo(20, baseline);
        jCtx.lineTo(w - 20, baseline);
        jCtx.stroke();

        // خط علوي منقط
        jCtx.strokeStyle = '#cbd5e1';
        jCtx.lineWidth = 1.5;
        jCtx.setLineDash([6, 6]);
        jCtx.beginPath();
        jCtx.moveTo(20, h * 0.22);
        jCtx.lineTo(w - 20, h * 0.22);
        jCtx.stroke();

        // خط سفلي منقط لنزول بطن الجيم
        jCtx.beginPath();
        jCtx.moveTo(20, h * 0.85);
        jCtx.lineTo(w - 20, h * 0.85);
        jCtx.stroke();

        // رسم نموذج خفيف منقط لحرف الجيم بأشكاله الأربعة
        jCtx.font = 'bold ' + Math.floor(h * 0.32) + 'px "Tajawal", "Traditional Arabic", sans-serif';
        jCtx.fillStyle = '#ddd6fe';
        jCtx.textAlign = 'center';
        jCtx.textBaseline = 'alphabetic';
        jCtx.fillText('جـ', w * 0.82, baseline);
        jCtx.fillText('ـجـ', w * 0.58, baseline);
        jCtx.fillText('ـج', w * 0.35, baseline + (h * 0.12));
        jCtx.fillText('ج', w * 0.14, baseline + (h * 0.12));

        jCtx.restore();
    }

    window.clearJCanvas = function() {
        if (jCtx && jCanvas) {
            drawJGuidelines();
            playAudio('letter_j_draw_hint');
        }
    };

    window.setJCanvasColor = function(color) {
        jStrokeColor = color;
        if (jCtx) {
            jCtx.strokeStyle = color;
        }
    };

    window.checkJQuiz = function(qNum, answer, btn) {
        const correctAnswers = {
            1: 'start',
            2: 'naj',
            3: 'ajeen_split',
            4: 'jaami',
            5: 'bisaat'
        };

        const parent = btn.closest('.quiz-question-box');
        if (parent) {
            parent.querySelectorAll('button').forEach(b => {
                b.style.borderColor = '#cbd5e1';
                b.style.background = '#ffffff';
            });
        }

        if (answer === correctAnswers[qNum]) {
            mascotCelebrates();
            btn.style.borderColor = '#7c3aed';
            btn.style.background = '#faf5ff';
            playAudio('letter_j_correct');
            mascotSpeak('أَحْسَنْتَ يَا بَطَل! إِجَابَةٌ صَحِيحَةٌ وَعَبْقَرِيَّة!', 'letter_j_correct');
        } else {
            mascotThinks();
            btn.style.borderColor = '#ef4444';
            btn.style.background = '#fef2f2';
            playAudio('letter_j_wrong');
            mascotSpeak('حَاوِلْ مَرَّةً أُخْرَى، رَكِّزْ جَيِّداً فِي صَوْتِ الْجِيمِ وَمَوْضِعِهِ!', 'letter_j_wrong');
        }
    };

    /* ========================================================
       الدرس السادس: حرف الصاد (صـ ، ـصـ ، ـص ، ص) وتنوين الكسر وقراءة طَيَّارَةُ وَقَّاص (ص ٨٤ - ٨٨)
    ======================================================== */
    let currentSadStation = 1;
    let sadCanvas = null;
    let sadCtx = null;
    let isDrawingSad = false;
    let sadStrokeColor = '#0284c7';

    window.switchLetterSadStation = function(stationNum) {
        currentSadStation = stationNum;
        document.querySelectorAll('.letter-sad-station').forEach(el => el.classList.remove('active'));
        const target = document.getElementById('stationSad_' + stationNum);
        if (target) target.classList.add('active');

        for (let i = 1; i <= 4; i++) {
            const btn = document.getElementById('btnStationSad_' + i);
            if (btn) {
                if (i === stationNum) btn.classList.add('active');
                else btn.classList.remove('active');
            }
        }

        if (stationNum === 1) {
            mascotSpeak('أَهْلاً بِكُمْ فِي الْمَحَطَّةِ الأُولَى: أَتَعَرَّفُ حَرْفَ الصَّادِ الْمُفَخَّمِ الرَّنَّانِ وَأَشْكَالَهُ الأَرْبَعَةَ وَكَلِمَاتِهِ الْمُصَوَّرَةِ فِي الْكِتَابِ ص ٨٤!', 'letter_sad_intro');
        } else if (stationNum === 2) {
            mascotSpeak('الْمَحَطَّةُ الثَّانِيَةُ: نَسْتَمِعُ إِلَى أَصْوَاتِ الصَّادِ مَعَ الْحَرَكَاتِ وَالْمُدُودِ وَالتَّنْوِينِ وَالْمَقَاطِعِ السَّاكِنَةِ (ص ٨٤ - ٨٥)!', 'letter_sad_vowels_station');
        } else if (stationNum === 3) {
            mascotSpeak('الْمَحَطَّةُ الثَّالِثَةُ: مَحَطَّةُ تَنْوِينِ الْكَسْرِ الشَّامِلَةِ ( ٍ ) وَوَرْشَةُ التَّحْلِيلِ وَالتَّرْكِيبِ الصَّوْتِيِّ (ص ٨٥ - ٨٨)!', 'tanween_kasr_intro');
        } else if (stationNum === 4) {
            mascotSpeak('الْمَحَطَّةُ الرَّابِعَةُ: قِرَاءَةُ نُصُوصِ الْكِتَابِ ص ٨٦ وَص ٨٨ وَطَيَّارَةُ وَقَّاص، مَعَ سَبُّورَةِ الرَّسْمِ وَاخْتِبَارِ التَّحَدِّي الذَّكِيّ!', 'letter_sad_read_intro');
            setTimeout(initSadCanvas, 100);
        }
    };

    window.playLetterSadSound = function() {
        mascotCelebrates();
        playAudio('letter_sad_sound');
    };

    window.playSadLetterSound = function() {
        mascotCelebrates();
        playAudio('letter_sad_sound');
    };

    window.playSadPhonemeFaseeh = function() {
        mascotCelebrates();
        playAudio('letter_sad_phoneme_faseeh');
    };

    window.playSadWord = function(wordKey) {
        mascotCelebrates();
        const map = {
            'sayyad': 'letter_sad_word_sayyad',
            'sundooq': 'letter_sad_word_sundooq',
            'sinnarah': 'letter_sad_word_sinnarah',
            'qafas': 'letter_sad_word_qafas',
            'isba': 'letter_sad_word_isba',
            'safirah': 'letter_sad_word_safirah',
            'soos': 'letter_sad_word_soos',
            'seesan': 'letter_sad_word_seesan',
            'saarookh': 'letter_sad_word_saarookh',
            'soorah': 'letter_sad_word_soorah',
            'saqr': 'letter_sad_word_saqr',
            'misbaah': 'letter_sad_word_misbaah',
            'qasr': 'letter_sad_word_qasr',
            'aseer': 'letter_sad_word_aseer',
            'soof': 'letter_sad_word_soof',
            'saadiq': 'letter_sad_word_saadiq',
            'sabah': 'letter_sad_word_sabah',
            'saba': 'letter_sad_word_saba',
            'saaboon': 'letter_sad_word_saaboon',
            'sidq': 'letter_sad_word_sidq',
            'waqqas': 'letter_sad_word_waqqas',
            'mansoor': 'letter_sad_word_mansoor',
            'miqas': 'letter_sad_word_miqas',
            'tayyarah': 'letter_sad_word_tayyarah',
            'qas': 'letter_sad_word_qas',
            'sanaa': 'letter_sad_word_sanaa',
            'sadeeq': 'letter_sad_word_sadeeq',
            'waraq': 'letter_sad_word_waraq',
            'farah': 'letter_sad_word_farah',
            'nasheeda': 'letter_sad_word_nasheeda',
            'raaha': 'letter_sad_word_raaha',
            'nazafah': 'letter_sad_word_nazafah',
            'eemaan': 'letter_sad_word_eemaan',
            'furookh': 'letter_sad_word_furookh'
        };
        const audioKey = map[wordKey] || ('letter_sad_word_' + wordKey);
        playAudio(audioKey);
    };

    window.playSadVowel = function(vowelKey) {
        mascotCelebrates();
        const map = {
            'short_a': 'letter_sad_short_a',
            'short_u': 'letter_sad_short_u',
            'short_i': 'letter_sad_short_i',
            'long_aa': 'letter_sad_long_aa',
            'long_oo': 'letter_sad_long_oo',
            'long_ee': 'letter_sad_long_ee',
            'tanween_dham': 'letter_sad_tanween_dham',
            'tanween_fath': 'letter_sad_tanween_fath',
            'tanween_kasr': 'letter_sad_tanween_kasr'
        };
        const audioKey = map[vowelKey] || ('letter_sad_' + vowelKey);
        playAudio(audioKey);
    };

    window.playSadSyllable = function(sylKey) {
        mascotCelebrates();
        const map = {
            'mis': 'letter_sad_syl_mis',
            'is': 'letter_sad_syl_is',
            'qas': 'letter_sad_syl_qas',
            'fas': 'letter_sad_syl_fas'
        };
        const audioKey = map[sylKey] || ('letter_sad_syl_' + sylKey);
        playAudio(audioKey);
    };

    window.playSadSplitWord = function(wordKey) {
        mascotCelebrates();
        const map = {
            'aseer': 'letter_sad_split_aseer',
            'saarookh': 'letter_sad_split_saarookh',
            'soof': 'letter_sad_split_soof',
            'misbaah': 'letter_sad_split_misbaah',
            'isba': 'letter_sad_split_isba',
            'qasr': 'letter_sad_split_qasr',
            'saadiq': 'letter_sad_split_saadiq',
            'saboon': 'letter_sad_split_saboon',
            'malab': 'tanween_kasr_split_malab',
            'wasee': 'tanween_kasr_split_wasee',
            'qitaar': 'tanween_kasr_split_qitaar',
            'saree': 'tanween_kasr_split_saree',
            'wisadah': 'tanween_kasr_split_wisadah',
            'naimah': 'tanween_kasr_split_naimah'
        };
        const audioKey = map[wordKey] || ('letter_sad_split_' + wordKey);
        playAudio(audioKey);
    };

    window.playSadMerge = function(mergeKey) {
        mascotCelebrates();
        const map = {
            'saboon': 'letter_sad_merge_saboon',
            'saadiq': 'letter_sad_merge_saadiq',
            'sidq': 'letter_sad_merge_sidq',
            'aseer': 'letter_sad_merge_aseer',
            'soos': 'letter_sad_merge_soos'
        };
        const audioKey = map[mergeKey] || ('letter_sad_merge_' + mergeKey);
        playAudio(audioKey);
    };

    window.switchSadReadingTab = function(tabId) {
        const bookTab = document.getElementById('sadReadingBookContent');
        const sabaTab = document.getElementById('sadReadingSabaContent');
        const waqqasTab = document.getElementById('sadReadingWaqqasContent');
        const btnBook = document.getElementById('btnSadReadBook');
        const btnSaba = document.getElementById('btnSadReadSaba');
        const btnWaqqas = document.getElementById('btnSadReadWaqqas');

        if (tabId === 'book') {
            if (bookTab) bookTab.style.display = 'block';
            if (sabaTab) sabaTab.style.display = 'none';
            if (waqqasTab) waqqasTab.style.display = 'none';
            if (btnBook) { btnBook.classList.add('active'); btnBook.style.background = '#0284c7'; btnBook.style.color = '#ffffff'; }
            if (btnSaba) { btnSaba.classList.remove('active'); btnSaba.style.background = '#e0f2fe'; btnSaba.style.color = '#0369a1'; }
            if (btnWaqqas) { btnWaqqas.classList.remove('active'); btnWaqqas.style.background = '#e0f2fe'; btnWaqqas.style.color = '#0369a1'; }
            mascotSpeak('نَقْرَأُ نَصَّ الْكِتَابِ الْمَدْرَسِيِّ ص ٨٦: صَادِقٌ يَقُولُ!', 'letter_sad_read_intro');
        } else if (tabId === 'saba') {
            if (bookTab) bookTab.style.display = 'none';
            if (sabaTab) sabaTab.style.display = 'block';
            if (waqqasTab) waqqasTab.style.display = 'none';
            if (btnBook) { btnBook.classList.remove('active'); btnBook.style.background = '#e0f2fe'; btnBook.style.color = '#0369a1'; }
            if (btnSaba) { btnSaba.classList.add('active'); btnSaba.style.background = '#0284c7'; btnSaba.style.color = '#ffffff'; }
            if (btnWaqqas) { btnWaqqas.classList.remove('active'); btnWaqqas.style.background = '#e0f2fe'; btnWaqqas.style.color = '#0369a1'; }
            mascotSpeak('نَقْرَأُ نَصَّ صَبَا وَالْحَدِيثَ الشَّرِيفَ ص ٨٨: النَّظَافَةُ مِنَ الإِيمَانِ!', 'letter_sad_read_saba_full');
        } else if (tabId === 'waqqas') {
            if (bookTab) bookTab.style.display = 'none';
            if (sabaTab) sabaTab.style.display = 'none';
            if (waqqasTab) waqqasTab.style.display = 'block';
            if (btnBook) { btnBook.classList.remove('active'); btnBook.style.background = '#e0f2fe'; btnBook.style.color = '#0369a1'; }
            if (btnSaba) { btnSaba.classList.remove('active'); btnSaba.style.background = '#e0f2fe'; btnSaba.style.color = '#0369a1'; }
            if (btnWaqqas) { btnWaqqas.classList.add('active'); btnWaqqas.style.background = '#0284c7'; btnWaqqas.style.color = '#ffffff'; }
            mascotSpeak('نَقْرَأُ الْقِصَّةَ التُّرَاثِيَّةَ الْعِرَاقِيَّةَ الأَصِيلَةَ: طَيَّارَةُ وَقَّاص!', 'letter_sad_read_waqqas_full');
        }
    };

    window.playSadReadingLine = function(lineId) {
        mascotCelebrates();
        const map = {
            'b_full': 'letter_sad_read_book_full',
            'b1': 'letter_sad_read_b1',
            'b2': 'letter_sad_read_b2',
            'b3': 'letter_sad_read_b3',
            's_full': 'letter_sad_read_saba_full',
            's1': 'letter_sad_read_s1',
            's2': 'letter_sad_read_s2',
            's3': 'letter_sad_read_s3',
            's4': 'letter_sad_read_s4',
            'w_full': 'letter_sad_read_waqqas_full',
            'w1': 'letter_sad_read_w1',
            'w2': 'letter_sad_read_w2',
            'w3': 'letter_sad_read_w3',
            'w4': 'letter_sad_read_w4',
            'w5': 'letter_sad_read_w5',
            'w6': 'letter_sad_read_w6'
        };
        const audioKey = map[lineId] || ('letter_sad_read_' + lineId);
        playAudio(audioKey);
    };

    function initSadCanvas() {
        sadCanvas = document.getElementById('letterSadDrawCanvas');
        if (!sadCanvas) return;
        sadCtx = sadCanvas.getContext('2d');

        function resizeSadCanvas() {
            if (!sadCanvas) return;
            const rect = sadCanvas.parentElement.getBoundingClientRect();
            sadCanvas.width = rect.width;
            sadCanvas.height = rect.height;
            drawSadGuidelines();
        }

        resizeSadCanvas();
        window.addEventListener('resize', resizeSadCanvas);

        function getSadPos(e) {
            const rect = sadCanvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
        }

        sadCanvas.onmousedown = function(e) {
            isDrawingSad = true;
            const pos = getSadPos(e);
            sadCtx.beginPath();
            sadCtx.moveTo(pos.x, pos.y);
            sadCtx.strokeStyle = sadStrokeColor;
            sadCtx.lineWidth = 6;
            sadCtx.lineCap = 'round';
            sadCtx.lineJoin = 'round';
        };

        sadCanvas.onmousemove = function(e) {
            if (!isDrawingSad) return;
            const pos = getSadPos(e);
            sadCtx.lineTo(pos.x, pos.y);
            sadCtx.stroke();
        };

        window.onmouseup = function() {
            isDrawingSad = false;
        };

        sadCanvas.ontouchstart = function(e) {
            e.preventDefault();
            isDrawingSad = true;
            const pos = getSadPos(e);
            sadCtx.beginPath();
            sadCtx.moveTo(pos.x, pos.y);
            sadCtx.strokeStyle = sadStrokeColor;
            sadCtx.lineWidth = 6;
            sadCtx.lineCap = 'round';
            sadCtx.lineJoin = 'round';
        };

        sadCanvas.ontouchmove = function(e) {
            e.preventDefault();
            if (!isDrawingSad) return;
            const pos = getSadPos(e);
            sadCtx.lineTo(pos.x, pos.y);
            sadCtx.stroke();
        };

        sadCanvas.ontouchend = function(e) {
            e.preventDefault();
            isDrawingSad = false;
        };
    }

    function drawSadGuidelines() {
        if (!sadCtx || !sadCanvas) return;
        const w = sadCanvas.width;
        const h = sadCanvas.height;

        sadCtx.save();
        sadCtx.fillStyle = '#ffffff';
        sadCtx.fillRect(0, 0, w, h);

        const baseline = h * 0.62;

        // خط السطر الأساسي باللون الأزرق
        sadCtx.strokeStyle = '#0284c7';
        sadCtx.lineWidth = 3;
        sadCtx.beginPath();
        sadCtx.moveTo(20, baseline);
        sadCtx.lineTo(w - 20, baseline);
        sadCtx.stroke();

        // خط علوي منقط
        sadCtx.strokeStyle = '#cbd5e1';
        sadCtx.lineWidth = 1.5;
        sadCtx.setLineDash([6, 6]);
        sadCtx.beginPath();
        sadCtx.moveTo(20, h * 0.28);
        sadCtx.lineTo(w - 20, h * 0.28);
        sadCtx.stroke();

        // خط سفلي منقط لنزول كاسة الصاد
        sadCtx.beginPath();
        sadCtx.moveTo(20, h * 0.85);
        sadCtx.lineTo(w - 20, h * 0.85);
        sadCtx.stroke();

        // رسم نموذج خفيف منقط لحرف الصاد بأشكاله الأربعة
        sadCtx.font = 'bold ' + Math.floor(h * 0.30) + 'px "Tajawal", "Traditional Arabic", sans-serif';
        sadCtx.fillStyle = '#bae6fd';
        sadCtx.textAlign = 'center';
        sadCtx.textBaseline = 'alphabetic';
        sadCtx.fillText('صـ', w * 0.82, baseline);
        sadCtx.fillText('ـصـ', w * 0.58, baseline);
        sadCtx.fillText('ـص', w * 0.35, baseline + (h * 0.10));
        sadCtx.fillText('ص', w * 0.14, baseline + (h * 0.10));

        sadCtx.restore();
    }

    window.clearSadCanvas = function() {
        if (sadCtx && sadCanvas) {
            drawSadGuidelines();
            playAudio('letter_sad_draw_hint');
        }
    };

    window.setSadCanvasColor = function(color) {
        sadStrokeColor = color;
        if (sadCtx) {
            sadCtx.strokeStyle = color;
        }
    };

    window.checkSadQuiz = function(qNum, answer, btn) {
        const correctAnswers = {
            1: 'start',
            2: 'mis',
            3: 'wasee',
            4: 'aseer_split',
            5: 'mansoor'
        };

        const parent = btn.closest('.quiz-question-box');
        if (parent) {
            parent.querySelectorAll('button').forEach(b => {
                b.style.borderColor = '#cbd5e1';
                b.style.background = '#ffffff';
            });
        }

        if (answer === correctAnswers[qNum]) {
            mascotCelebrates();
            btn.style.borderColor = '#0284c7';
            btn.style.background = '#f0f9ff';
            playAudio('letter_sad_correct');
            mascotSpeak('أَحْسَنْتَ يَا بَطَل! إِجَابَةٌ صَحِيحَةٌ وَعَبْقَرِيَّة!', 'letter_sad_correct');
        } else {
            mascotThinks();
            btn.style.borderColor = '#ef4444';
            btn.style.background = '#fef2f2';
            playAudio('letter_sad_wrong');
            mascotSpeak('حَاوِلْ مَرَّةً أُخْرَى، رَكِّزْ جَيِّداً فِي صَوْتِ الصَّادِ وَتَنْوِينِ الْكَسْرِ!', 'letter_sad_wrong');
        }
    };
})();
