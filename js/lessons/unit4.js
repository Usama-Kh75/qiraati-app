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
})();
