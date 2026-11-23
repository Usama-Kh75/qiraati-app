/* ==========================================================================
 * منصة قراءتي التفاعلية الذكية - الوحدة الخامسة: هواياتي وألعابي (Unit 5 Lessons)
 * الدرس الأول: الهمزة (ء ، أ ، إ ، ؤ ، ئ) وأشكالها وتطبيقاتها (ص ٨٩ - ٩٢)
 * إعداد وتطوير: المهندس أسامة خليل هاشم
 * ========================================================================== */

(function() {
    /* ========================================================
       القسم 1: التنقل بين محطات درس الهمزة وأشكالها
    ======================================================== */
    window.switchLetterHamzaStation = function(stationNum) {
        document.querySelectorAll('#view-tab-letter_hamza .station-tab').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('#view-tab-letter_hamza .letter-hamza-station').forEach(el => el.classList.remove('active'));

        const targetStation = document.getElementById('stationHamza_' + stationNum);
        const targetBtn = document.getElementById('btnStationHamza_' + stationNum);

        if (targetStation) targetStation.classList.add('active');
        if (targetBtn) targetBtn.classList.add('active');

        if (stationNum === 1) {
            mascotSpeak('الْوَحْدَةُ الْخَامِسَةُ: هِوَايَاتِي وَأَلْعَابِي! مَعَ دَرْسِ الْهَمْزَةِ (ء ، أ ، إ ، ؤ ، ئ) وَأَشْكَالِهَا! اسْتَمِعْ لِصَوْتِ الْهَمْزَةِ الْقَوِيِّ وَتَعَرَّفْ عَلَى صُوَرِ وَكَلِمَاتِ الْكِتَابِ ص ٨٩ - ٩٠!', 'letter_hamza_intro');
        } else if (stationNum === 2) {
            mascotSpeak('أَصْوَاتُ الْحَرَكَاتِ وَالْمُدُودِ وَالْمَقَاطِعِ السَّاكِنَةِ وَأَشْكَالِ الْهَمْزَة! قَارِنْ بَيْنَ أَ ، أُ ، إِ وَ آ ، أُو ، إِيـ، وَمَيِّزْ مَقَاطِعَ: فَأْ ، رَأْ ، مَأْ ، وَأَشْكَالَ الْهَمْزَةِ الْخَمْسَة!', 'letter_hamza_vowels_station');
        } else if (stationNum === 3) {
            mascotSpeak('الْتَّحْلِيلُ وَالتَّرْكِيبُ الصَّوْتِيّ! حَلِّلْ كَلِمَاتِ (أَزْرَعُ ، يَقْرَأُ ، إِحْسَانُ ، فَأْرٌ ، رَأْسٌ ، مَاءٌ) بِالتَّصْفِيق، وَرَكِّبِ الْمَقَاطِعَ لِتَكْوِينِ كَلِمَاتٍ مُفِيدَة!', 'letter_hamza_analysis_intro');
        } else if (stationNum === 4) {
            mascotSpeak('مَحَطَّةُ الْقِرَاءَةِ وَالسَّبُّورَةِ وَاخْتِبَارِ التَّحَدِّي! اقْرَأْ نُصُوصَ (يَلْعَبُ أَحْمَدُ فِي حَدِيقَتِنَا) وَالنُّصُوصَ التُّرَاثِيَّةَ الْعِرَاقِيَّةَ (أَمِين بَنَّاء / أَيْمَن وَإِقْبَال)، وَتَدَرَّبْ عَلَى كِتَابَةِ الْهَمْزَة!', 'letter_hamza_read_intro');
            setTimeout(initHamzaCanvas, 100);
        }
    };

    /* ========================================================
       القسم 2: أصوات الهمزة الفونيمية والكلمات المصورة
    ======================================================== */
    window.playHamzaLetterSound = function() {
        mascotCelebrates();
        playAudio('letter_hamza_sound');
    };

    window.playHamzaPhonemeFaseeh = function() {
        mascotCelebrates();
        playAudio('letter_hamza_phoneme_faseeh');
    };

    window.playHamzaWord = function(wordKey) {
        mascotCelebrates();
        const map = {
            'arnab': 'letter_hamza_word_arnab',
            'asad': 'letter_hamza_word_asad',
            'uzun': 'letter_hamza_word_uzun',
            'ukhtuboot': 'letter_hamza_word_ukhtuboot',
            'ibreeq': 'letter_hamza_word_ibreeq',
            'iwazzah': 'letter_hamza_word_iwazzah',
            'faar': 'letter_hamza_word_faar',
            'azhaar': 'letter_hamza_word_azhaar',
            'ahmad': 'letter_hamza_word_ahmad',
            'eemaan': 'letter_hamza_word_eemaan',
            'azra': 'letter_hamza_word_azra',
            'ashjaar': 'letter_hamza_word_ashjaar',
            'ureed': 'letter_hamza_word_ureed',
            'yaqra': 'letter_hamza_word_yaqra',
            'ihsaan': 'letter_hamza_word_ihsaan',
            'faas': 'letter_hamza_word_faas',
            'raas': 'letter_hamza_word_raas',
            'maa': 'letter_hamza_word_maa',
            'inaa': 'letter_hamza_word_inaa',
            'ameen': 'letter_hamza_word_ameen',
            'bannaa': 'letter_hamza_word_bannaa',
            'ayman': 'letter_hamza_word_ayman',
            'iqbaal': 'letter_hamza_word_iqbaal',
            'ummee': 'letter_hamza_word_ummee',
            'lu_lu': 'letter_hamza_word_lu_lu',
            'zi_b': 'letter_hamza_word_zi_b',
            'shaati': 'letter_hamza_word_shaati'
        };
        const audioKey = map[wordKey] || ('letter_hamza_word_' + wordKey);
        playAudio(audioKey);
    };

    /* ========================================================
       القسم 3: أصوات الحركات والمدود والمقاطع الساكنة وأشكال الهمزة
    ======================================================== */
    window.playHamzaVowel = function(type) {
        mascotCelebrates();
        const map = {
            'short_a': 'letter_hamza_short_a',
            'short_u': 'letter_hamza_short_u',
            'short_i': 'letter_hamza_short_i',
            'long_aa': 'letter_hamza_long_aa',
            'long_oo': 'letter_hamza_long_oo',
            'long_ee': 'letter_hamza_long_ee'
        };
        playAudio(map[type] || 'letter_hamza_vowels_station');
    };

    window.playHamzaShape = function(shapeKey) {
        mascotCelebrates();
        const map = {
            'alif_up': 'letter_hamza_shape_alif_up',
            'alif_down': 'letter_hamza_shape_alif_down',
            'waw': 'letter_hamza_shape_waw',
            'nabra': 'letter_hamza_shape_nabra',
            'line': 'letter_hamza_shape_line'
        };
        playAudio(map[shapeKey] || 'letter_hamza_shapes_intro');
    };

    window.playHamzaSyllable = function(sylKey) {
        mascotCelebrates();
        const map = {
            'fa': 'letter_hamza_syl_fa',
            'ra': 'letter_hamza_syl_ra',
            'ma': 'letter_hamza_syl_ma',
            'yaq': 'letter_hamza_syl_yaq',
            'az': 'letter_hamza_syl_az',
            'ih': 'letter_hamza_syl_ih',
            'ash': 'letter_hamza_syl_ash'
        };
        playAudio(map[sylKey] || 'letter_hamza_syl_intro');
    };

    /* ========================================================
       القسم 4: التحليل والتركيب الصوتي
    ======================================================== */
    window.playHamzaSplit = function(wordKey) {
        mascotCelebrates();
        const map = {
            'azra': 'letter_hamza_split_azra',
            'yaqra': 'letter_hamza_split_yaqra',
            'ihsaan': 'letter_hamza_split_ihsaan',
            'faar': 'letter_hamza_split_faar',
            'raas': 'letter_hamza_split_raas',
            'maa': 'letter_hamza_split_maa',
            'ashjaar': 'letter_hamza_split_ashjaar',
            'ureed': 'letter_hamza_split_ureed'
        };
        playAudio(map[wordKey] || 'letter_hamza_analysis_intro');
    };

    window.playHamzaMerge = function(wordKey) {
        mascotCelebrates();
        const map = {
            'ashjaar': 'letter_hamza_merge_ashjaar',
            'ureed': 'letter_hamza_merge_ureed',
            'faar': 'letter_hamza_merge_faar',
            'ameen': 'letter_hamza_merge_ameen',
            'bannaa': 'letter_hamza_merge_bannaa'
        };
        playAudio(map[wordKey] || 'letter_hamza_blend_intro');
    };

    /* ========================================================
       القسم 5: قراءة نصوص الكتاب والنصوص التراثية
    ======================================================== */
    window.switchHamzaReadingTab = function(tab) {
        const btnBook = document.getElementById('btnHamzaReadBook');
        const btnAmeen = document.getElementById('btnHamzaReadAmeen');
        const btnAyman = document.getElementById('btnHamzaReadAyman');

        const contentBook = document.getElementById('hamzaReadingBookContent');
        const contentAmeen = document.getElementById('hamzaReadingAmeenContent');
        const contentAyman = document.getElementById('hamzaReadingAymanContent');

        if (btnBook) {
            btnBook.style.background = tab === 'book' ? '#0284c7' : '#e0f2fe';
            btnBook.style.color = tab === 'book' ? '#ffffff' : '#0369a1';
        }
        if (btnAmeen) {
            btnAmeen.style.background = tab === 'ameen' ? '#d97706' : '#fef3c7';
            btnAmeen.style.color = tab === 'ameen' ? '#ffffff' : '#92400e';
        }
        if (btnAyman) {
            btnAyman.style.background = tab === 'ayman' ? '#4f46e5' : '#e0e7ff';
            btnAyman.style.color = tab === 'ayman' ? '#ffffff' : '#3730a3';
        }

        if (contentBook) contentBook.style.display = tab === 'book' ? 'block' : 'none';
        if (contentAmeen) contentAmeen.style.display = tab === 'ameen' ? 'block' : 'none';
        if (contentAyman) contentAyman.style.display = tab === 'ayman' ? 'block' : 'none';

        if (tab === 'book') {
            mascotSpeak('نَصُّ الْكِتَابِ ص ٩٢: يَلْعَبُ أَحْمَدُ فِي حَدِيقَتِنَا! اسْتَمِعْ وَاقْرَأْ بِلِسَانٍ عَرَبِيٍّ فَصِيح!', 'letter_hamza_read_book_full');
        } else if (tab === 'ameen') {
            mascotSpeak('الْقِرَاءَةُ التُّرَاثِيَّةُ الْعِرَاقِيَّةُ الْخَالِدَة: أَمِين بَنَّاء! اسْتَمِعْ لِلْقِصَّةِ الْجَمِيلَة!', 'letter_hamza_read_ameen_full');
        } else if (tab === 'ayman') {
            mascotSpeak('الْقِرَاءَةُ التُّرَاثِيَّةُ: أَيْمَنُ وَإِقْبَالُ! اسْتَمِعْ لِلْقِرَاءَةِ الْمُعَبِّرَةِ مَعَ أَيْمَنَ وَإِقْبَالَ!', 'letter_hamza_read_ayman_full');
        }
    };

    window.playHamzaReadingLine = function(lineKey) {
        mascotCelebrates();
        const map = {
            'b_full': 'letter_hamza_read_book_full',
            'b1': 'letter_hamza_read_s1',
            'b2': 'letter_hamza_read_s2',
            'a_full': 'letter_hamza_read_ameen_full',
            'a1': 'letter_hamza_read_a1',
            'a2': 'letter_hamza_read_a2',
            'a3': 'letter_hamza_read_a3',
            'a4': 'letter_hamza_read_a4',
            'a5': 'letter_hamza_read_a5',
            'y_full': 'letter_hamza_read_ayman_full',
            'y1': 'letter_hamza_read_y1',
            'y2': 'letter_hamza_read_y2',
            'y3': 'letter_hamza_read_y3',
            'y4': 'letter_hamza_read_y4'
        };
        playAudio(map[lineKey] || 'letter_hamza_read_intro');
    };

    /* ========================================================
       القسم 6: سبورة رسم الهمزة التفاعلية
    ======================================================== */
    let hamzaCanvasInitialized = false;
    let hamzaCanvas, hamzaCtx;
    let isDrawingHamza = false;
    let currentHamzaColor = '#0284c7';

    window.initHamzaCanvas = function() {
        hamzaCanvas = document.getElementById('letterHamzaDrawCanvas');
        if (!hamzaCanvas) return;

        hamzaCtx = hamzaCanvas.getContext('2d');
        const rect = hamzaCanvas.parentElement.getBoundingClientRect();
        hamzaCanvas.width = rect.width * 2;
        hamzaCanvas.height = 320 * 2;
        hamzaCtx.scale(2, 2);

        hamzaCtx.lineCap = 'round';
        hamzaCtx.lineJoin = 'round';
        hamzaCtx.lineWidth = 6;
        hamzaCtx.strokeStyle = currentHamzaColor;

        clearHamzaCanvas();

        if (!hamzaCanvasInitialized) {
            hamzaCanvasInitialized = true;

            const getPos = (e) => {
                const b = hamzaCanvas.getBoundingClientRect();
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;
                return {
                    x: clientX - b.left,
                    y: clientY - b.top
                };
            };

            const startDraw = (e) => {
                e.preventDefault();
                isDrawingHamza = true;
                const p = getPos(e);
                hamzaCtx.beginPath();
                hamzaCtx.moveTo(p.x, p.y);
            };

            const drawMove = (e) => {
                if (!isDrawingHamza) return;
                e.preventDefault();
                const p = getPos(e);
                hamzaCtx.lineTo(p.x, p.y);
                hamzaCtx.stroke();
            };

            const endDraw = (e) => {
                if (!isDrawingHamza) return;
                e.preventDefault();
                isDrawingHamza = false;
                hamzaCtx.closePath();
            };

            hamzaCanvas.addEventListener('mousedown', startDraw);
            hamzaCanvas.addEventListener('mousemove', drawMove);
            window.addEventListener('mouseup', endDraw);

            hamzaCanvas.addEventListener('touchstart', startDraw, { passive: false });
            hamzaCanvas.addEventListener('touchmove', drawMove, { passive: false });
            window.addEventListener('touchend', endDraw, { passive: false });
        }
    };

    window.clearHamzaCanvas = function() {
        if (!hamzaCtx || !hamzaCanvas) return;
        hamzaCtx.clearRect(0, 0, hamzaCanvas.width, hamzaCanvas.height);
        // Draw baseline
        const w = hamzaCanvas.width / 2;
        hamzaCtx.save();
        hamzaCtx.strokeStyle = '#cbd5e1';
        hamzaCtx.lineWidth = 2;
        hamzaCtx.setLineDash([8, 6]);
        hamzaCtx.beginPath();
        hamzaCtx.moveTo(20, 220);
        hamzaCtx.lineTo(w - 20, 220);
        hamzaCtx.stroke();
        hamzaCtx.restore();
    };

    window.setHamzaCanvasColor = function(color) {
        currentHamzaColor = color;
        if (hamzaCtx) hamzaCtx.strokeStyle = color;
    };

    /* ========================================================
       القسم 7: اختبار التحدي الفونيمي التفاعلي
    ======================================================== */
    let hamzaScore = 0;
    const answeredHamzaQuestions = {};

    window.answerHamzaQuiz = function(qNum, selectedOption, isCorrect, btn) {
        if (answeredHamzaQuestions[qNum]) return;
        answeredHamzaQuestions[qNum] = true;

        const parent = btn.parentElement;
        parent.querySelectorAll('.hamza-quiz-option').forEach(b => {
            b.style.pointerEvents = 'none';
        });

        if (isCorrect) {
            btn.classList.add('correct');
            hamzaScore++;
            mascotCelebrates();
            playAudio('letter_hamza_correct');
            mascotSpeak('أَحْسَنْتَ يَا عَبْقَرِيّ! إِجَابَةٌ صَحِيحَةٌ وَمُمَيَّزَةٌ جِدًّا! 🌟', 'letter_hamza_correct');
        } else {
            btn.classList.add('wrong');
            mascotThinks();
            playAudio('letter_hamza_wrong');
            mascotSpeak('فَكِّرْ جَيِّدًا فِي مَوْقِعِ وَشَكْلِ الْهَمْزَةِ يَا بَطَل! حَاوِلْ مَرَّةً أُخْرَى! 💡', 'letter_hamza_wrong');
        }

        const scoreEl = document.getElementById('hamzaQuizScore');
        if (scoreEl) scoreEl.innerText = hamzaScore;

        if (Object.keys(answeredHamzaQuestions).length === 5) {
            setTimeout(() => {
                mascotCelebrates();
                playAudio('letter_hamza_encourage_super');
                mascotSpeak(`مَا شَاءَ اللَّه! أَتْمَمْتَ اخْتِبَارَ التَّحَدِّي لِدَرْسِ الْهَمْزَةِ بِنَجَاحٍ بَاهِر: ${hamzaScore} مِنْ ٥! أَنْتَ بَطَلُ الْقِرَاءَةِ! 🏆🎉`, 'letter_hamza_encourage_super');
            }, 1200);
        }
    };

    /* ==========================================================================
       الدرس الثاني: حرف الضاد (ضـ ، ض) وتطبيقاته (ص ٩٣ - ٩٥)
       ========================================================================== */

    /* ========================================================
       القسم 8: التنقل بين محطات درس حرف الضاد
    ======================================================== */
    window.switchLetterDhadStation = function(stationNum) {
        document.querySelectorAll('#view-tab-letter_dhad .station-tab').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('#view-tab-letter_dhad .letter-dhad-station').forEach(el => el.classList.remove('active'));

        const targetStation = document.getElementById('stationDhad_' + stationNum);
        const targetBtn = document.getElementById('btnStationDhad_' + stationNum);

        if (targetStation) targetStation.classList.add('active');
        if (targetBtn) targetBtn.classList.add('active');

        if (stationNum === 1) {
            mascotSpeak('الْوَحْدَةُ الْخَامِسَةُ: هِوَايَاتِي وَأَلْعَابِي! مَعَ دَرْسِ حَرْفِ الضَّادِ (ضـ ، ض) وَتَطْبِيقَاتِهِ! اسْتَمِعْ لِصَوْتِ الضَّادِ الْمُفَخَّمِ وَتَعَرَّفْ عَلَى صُوَرِ وَكَلِمَاتِ الْكِتَابِ فِي صَفْحَةِ ثَلَاثَةٍ وَتِسْعِينَ!', 'letter_dhad_intro');
        } else if (stationNum === 2) {
            mascotSpeak('أَصْوَاتُ الْحَرَكَاتِ وَالْمُدُودِ وَالْمَقَاطِعِ السَّاكِنَةِ وَأَشْكَالِ حَرْفِ الضَّاد! قَارِنْ بَيْنَ ضَـ ، ضُـ ، ضِـ وَ ضَا ، ضُو ، ضِيـ، وَمَيِّزْ مَقَاطِعَ: مِضْـ ، يَضْـ ، وَأَشْكَالَ الضَّادِ فِي أَوَّلِ وَوَسَطِ وَآخِرِ الْكَلِمَة!', 'letter_dhad_vowels_station');
        } else if (stationNum === 3) {
            mascotSpeak('الْتَّحْلِيلُ وَالتَّرْكِيبُ الصَّوْتِيّ! حَلِّلْ كَلِمَاتِ (رِيَاضٌ ، ضُحَى ، خُضَارٌ) بِالتَّصْفِيق، وَرَكِّبِ الْمَقَاطِعَ لِتَكْوِينِ: ضَابِطٌ ، رَضِيعٌ ، عَضَلَاتٌ!', 'letter_dhad_analysis_intro');
        } else if (stationNum === 4) {
            mascotSpeak('مَحَطَّةُ الْقِرَاءَةِ وَالسَّبُّورَةِ وَاخْتِبَارِ التَّحَدِّي! اقْرَأْ نَصَّ الْكِتَابِ (ضُحَى تَعْمَلُ فِي مُسْتَشْفَى) وَالنَّصَّ التُّرَاثِيَّ الْعِرَاقِيَّ الْخَالِدَ (حَوْضُ السِّبَاحَةِ)، وَتَدَرَّبْ عَلَى رَسْمِ حَرْفِ الضَّادِ عَلَى السَّبُّورَةِ التَّفَاعُلِيَّة!', 'letter_dhad_read_intro');
            setTimeout(initDhadCanvas, 100);
        }
    };

    /* ========================================================
       القسم 9: أصوات الضاد الفونيمية والكلمات المصورة
    ======================================================== */
    window.playDhadLetterSound = function() {
        mascotCelebrates();
        playAudio('letter_dhad_sound');
    };

    window.playDhadPhonemeFaseeh = function() {
        mascotCelebrates();
        playAudio('letter_dhad_phoneme_faseeh');
    };

    window.playDhadWord = function(wordKey) {
        mascotCelebrates();
        const audioKey = 'letter_dhad_word_' + wordKey;
        playAudio(audioKey);
    };

    /* ========================================================
       القسم 10: أصوات الحركات والمدود والمقاطع الساكنة وأشكال الضاد
    ======================================================== */
    window.playDhadVowel = function(type) {
        mascotCelebrates();
        const map = {
            'short_a': 'letter_dhad_short_a',
            'short_u': 'letter_dhad_short_u',
            'short_i': 'letter_dhad_short_i',
            'long_aa': 'letter_dhad_long_aa',
            'long_oo': 'letter_dhad_long_oo',
            'long_ee': 'letter_dhad_long_ee'
        };
        playAudio(map[type] || 'letter_dhad_vowels_station');
    };

    window.playDhadShape = function(shapeKey) {
        mascotCelebrates();
        const map = {
            'first': 'letter_dhad_shape_first',
            'mid': 'letter_dhad_shape_mid',
            'last_conn': 'letter_dhad_shape_last_conn',
            'last_sep': 'letter_dhad_shape_last_sep'
        };
        playAudio(map[shapeKey] || 'letter_dhad_shapes_intro');
    };

    window.playDhadSyllable = function(sylKey) {
        mascotCelebrates();
        const map = {
            'mid': 'letter_dhad_syl_mid',
            'yad': 'letter_dhad_syl_yad',
            'rad': 'letter_dhad_syl_rad',
            'ad': 'letter_dhad_syl_ad'
        };
        playAudio(map[sylKey] || 'letter_dhad_syl_intro');
    };

    /* ========================================================
       القسم 11: التحليل والتركيب الصوتي للضاد
    ======================================================== */
    window.playDhadSplit = function(wordKey) {
        mascotCelebrates();
        const map = {
            'riyaad': 'letter_dhad_split_riyaad',
            'duha': 'letter_dhad_split_duha',
            'khudaar': 'letter_dhad_split_khudaar',
            'daabit': 'letter_dhad_split_daabit',
            'radeea': 'letter_dhad_split_radeea',
            'adalaat': 'letter_dhad_split_adalaat',
            'hawd': 'letter_dhad_split_hawd',
            'naahid': 'letter_dhad_split_naahid'
        };
        playAudio(map[wordKey] || 'letter_dhad_analysis_intro');
    };

    window.playDhadMerge = function(wordKey) {
        mascotCelebrates();
        const map = {
            'daabit': 'letter_dhad_merge_daabit',
            'radeea': 'letter_dhad_merge_radeea',
            'adalaat': 'letter_dhad_merge_adalaat',
            'riyaad': 'letter_dhad_merge_riyaad',
            'hawd': 'letter_dhad_merge_hawd'
        };
        playAudio(map[wordKey] || 'letter_dhad_blend_intro');
    };

    /* ========================================================
       القسم 12: قراءة نصوص الكتاب والنصوص التراثية للضاد
    ======================================================== */
    window.switchDhadReadingTab = function(tab) {
        const btnBook = document.getElementById('btnDhadReadBook');
        const btnHawd = document.getElementById('btnDhadReadHawd');

        const contentBook = document.getElementById('dhadReadingBookContent');
        const contentHawd = document.getElementById('dhadReadingHawdContent');

        if (btnBook) {
            btnBook.style.background = tab === 'book' ? '#059669' : '#e0f2fe';
            btnBook.style.color = tab === 'book' ? '#ffffff' : '#047857';
        }
        if (btnHawd) {
            btnHawd.style.background = tab === 'hawd' ? '#0284c7' : '#f0fdf4';
            btnHawd.style.color = tab === 'hawd' ? '#ffffff' : '#0369a1';
        }

        if (contentBook) contentBook.style.display = tab === 'book' ? 'block' : 'none';
        if (contentHawd) contentHawd.style.display = tab === 'hawd' ? 'block' : 'none';

        if (tab === 'book') {
            mascotSpeak('نَصُّ الْكِتَابِ ص ٩٥: ضُحَى تَعْمَلُ فِي مُسْتَشْفَى! اسْتَمِعْ وَاقْرَأْ بِلِسَانٍ عَرَبِيٍّ فَصِيح!', 'letter_dhad_read_book_full');
        } else if (tab === 'hawd') {
            mascotSpeak('الْقِرَاءَةُ التُّرَاثِيَّةُ الْعِرَاقِيَّةُ الْخَالِدَة: حَوْضُ السِّبَاحَةِ! رِيَاضٌ يَسْبَحُ فِي الحَوْضِ! اسْتَمِعْ لِلْقِصَّةِ الْجَمِيلَة!', 'letter_dhad_read_hawd_full');
        }
    };

    window.playDhadReadingLine = function(lineKey) {
        mascotCelebrates();
        const map = {
            'b_full': 'letter_dhad_read_book_full',
            'b1': 'letter_dhad_read_b1',
            'b2': 'letter_dhad_read_b2',
            'b3': 'letter_dhad_read_b3',
            'h_full': 'letter_dhad_read_hawd_full',
            'h1': 'letter_dhad_read_h1',
            'h2': 'letter_dhad_read_h2',
            'h3': 'letter_dhad_read_h3',
            'h4': 'letter_dhad_read_h4',
            'h5': 'letter_dhad_read_h5'
        };
        playAudio(map[lineKey] || 'letter_dhad_read_intro');
    };

    /* ========================================================
       القسم 13: سبورة رسم الضاد التفاعلية
    ======================================================== */
    let dhadCanvasInitialized = false;
    let dhadCanvas, dhadCtx;
    let isDrawingDhad = false;
    let currentDhadColor = '#059669';

    window.initDhadCanvas = function() {
        dhadCanvas = document.getElementById('letterDhadDrawCanvas');
        if (!dhadCanvas) return;

        dhadCtx = dhadCanvas.getContext('2d');
        const rect = dhadCanvas.parentElement.getBoundingClientRect();
        dhadCanvas.width = rect.width * 2;
        dhadCanvas.height = 320 * 2;
        dhadCtx.scale(2, 2);

        dhadCtx.lineCap = 'round';
        dhadCtx.lineJoin = 'round';
        dhadCtx.lineWidth = 6;
        dhadCtx.strokeStyle = currentDhadColor;

        clearDhadCanvas();

        if (!dhadCanvasInitialized) {
            dhadCanvasInitialized = true;

            const getPos = (e) => {
                const b = dhadCanvas.getBoundingClientRect();
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;
                return {
                    x: clientX - b.left,
                    y: clientY - b.top
                };
            };

            const startDraw = (e) => {
                e.preventDefault();
                isDrawingDhad = true;
                const p = getPos(e);
                dhadCtx.beginPath();
                dhadCtx.moveTo(p.x, p.y);
            };

            const drawMove = (e) => {
                if (!isDrawingDhad) return;
                e.preventDefault();
                const p = getPos(e);
                dhadCtx.lineTo(p.x, p.y);
                dhadCtx.stroke();
            };

            const endDraw = (e) => {
                if (!isDrawingDhad) return;
                e.preventDefault();
                isDrawingDhad = false;
                dhadCtx.closePath();
            };

            dhadCanvas.addEventListener('mousedown', startDraw);
            dhadCanvas.addEventListener('mousemove', drawMove);
            window.addEventListener('mouseup', endDraw);

            dhadCanvas.addEventListener('touchstart', startDraw, { passive: false });
            dhadCanvas.addEventListener('touchmove', drawMove, { passive: false });
            window.addEventListener('touchend', endDraw, { passive: false });
        }
    };

    window.clearDhadCanvas = function() {
        if (!dhadCtx || !dhadCanvas) return;
        dhadCtx.clearRect(0, 0, dhadCanvas.width, dhadCanvas.height);
        // Draw baseline
        const w = dhadCanvas.width / 2;
        dhadCtx.save();
        dhadCtx.strokeStyle = '#cbd5e1';
        dhadCtx.lineWidth = 2;
        dhadCtx.setLineDash([8, 6]);
        dhadCtx.beginPath();
        dhadCtx.moveTo(20, 220);
        dhadCtx.lineTo(w - 20, 220);
        dhadCtx.stroke();
        dhadCtx.restore();
    };

    window.setDhadCanvasColor = function(color) {
        currentDhadColor = color;
        if (dhadCtx) dhadCtx.strokeStyle = color;
    };

    /* ========================================================
       القسم 14: اختبار التحدي الفونيمي التفاعلي للضاد
    ======================================================== */
    let dhadScore = 0;
    const answeredDhadQuestions = {};

    window.answerDhadQuiz = function(qNum, selectedOption, isCorrect, btn) {
        if (answeredDhadQuestions[qNum]) return;
        answeredDhadQuestions[qNum] = true;

        const parent = btn.parentElement;
        parent.querySelectorAll('.dhad-quiz-option').forEach(b => {
            b.style.pointerEvents = 'none';
        });

        if (isCorrect) {
            btn.classList.add('correct');
            dhadScore++;
            mascotCelebrates();
            playAudio('letter_dhad_correct');
            mascotSpeak('أَحْسَنْتَ يَا عَبْقَرِيّ! إِجَابَةٌ صَحِيحَةٌ وَمُمَيَّزَةٌ جِدًّا! 🌟', 'letter_dhad_correct');
        } else {
            btn.classList.add('wrong');
            mascotThinks();
            playAudio('letter_dhad_wrong');
            mascotSpeak('فَكِّرْ جَيِّدًا فِي مَخْرَجِ وَشَكْلِ حَرْفِ الضَّادِ يَا بَطَل! حَاوِلْ مَرَّةً أُخْرَى! 💡', 'letter_dhad_wrong');
        }

        const scoreEl = document.getElementById('dhadQuizScore');
        if (scoreEl) scoreEl.innerText = dhadScore;

        if (Object.keys(answeredDhadQuestions).length === 5) {
            setTimeout(() => {
                mascotCelebrates();
                playAudio('letter_dhad_encourage_super');
                mascotSpeak(`مَا شَاءَ اللَّه! أَتْمَمْتَ اخْتِبَارَ التَّحَدِّي لِدَرْسِ حَرْفِ الضَّادِ بِنَجَاحٍ بَاهِر: ${dhadScore} مِنْ ٥! أَنْتَ بَطَلُ لُغَةِ الضَّاد! 🏆🎉`, 'letter_dhad_encourage_super');
            }, 1200);
        }
    };

    /* ==========================================================================
       الدرس الثالث: حرف الخاء (خـ ، خ) وتطبيقاته (ص ٩٦ - ٩٨)
       ========================================================================== */

    /* ========================================================
       القسم 15: التنقل بين محطات درس حرف الخاء
    ======================================================== */
    window.switchLetterKhaStation = function(stationNum) {
        for (let i = 1; i <= 4; i++) {
            const st = document.getElementById(`stationKha_${i}`);
            const btn = document.getElementById(`btnStationKha_${i}`);
            if (st) st.classList.remove('active');
            if (btn) btn.classList.remove('active');
        }

        const activeSt = document.getElementById(`stationKha_${stationNum}`);
        const activeBtn = document.getElementById(`btnStationKha_${stationNum}`);
        if (activeSt) activeSt.classList.add('active');
        if (activeBtn) activeBtn.classList.add('active');

        if (stationNum === 1) {
            mascotSpeak('الْمَحَطَّةُ الأُولَى: أَتَعَرَّفُ حَرْفَ الْخَاءِ (خـ ، خ) وَصُوَرَ الْكِتَابِ فِي صَفْحَةِ ٩٦! اِسْتَمِعْ لِصَوْتِ الْخَاءِ الْمُفَخَّمِ وَقِصَّةِ الْمَشْهَد!', 'letter_kha_intro');
        } else if (stationNum === 2) {
            mascotSpeak('الْمَحَطَّةُ الثَّانِيَةُ: أَصْوَاتُ الْحَرَكَاتِ وَالْمُدُودِ وَالْمَقَاطِعِ السَّاكِنَةِ وَأَشْكَالِ حَرْفِ الْخَاء (ص ٩٦ - ٩٧)! مَيِّزْ بَيْنَ خَـ ، خُـ ، خِـ وَ خَا ، خُو ، خِيـ، وَمَقَاطِعِ: نَخْـ ، أَخْـ ، صَخْـ!', 'letter_kha_vowels_station');
        } else if (stationNum === 3) {
            mascotSpeak('الْمَحَطَّةُ الثَّالِثَةُ: التَّحْلِيلُ وَالتَّرْكِيبُ الصَّوْتِيُّ (ص ٩٧ - ٩٨)! حَلِّلْ وَرَكِّبْ كَلِمَاتِ (خُلُودٌ ، مَطْبَخٌ ، خَرَجَ ، خَاتَمٌ ، صُخُورٌ ، فَخُورٌ) وَجُمْلَةَ: يَبِيعُ خَلْدُونُ خُضَارًا مُتَنَوِّعَةً!', 'letter_kha_analysis_intro');
        } else if (stationNum === 4) {
            mascotSpeak('الْمَحَطَّةُ الرَّابِعَةُ: الْقِرَاءَةُ الْمُعَبِّرَةُ لِنَصِّ الْكِتَابِ (خِتَامُ تَطْبَخُ فِي مَطْبَخِ خَالَتِي) وَالنَّصِّ التُّرَاثِيِّ (خَرُوفُ خَلِيلٍ)، وَالسَّبُّورَةُ وَاخْتِبَارُ التَّحَدِّي!', 'letter_kha_read_intro');
            setTimeout(window.initKhaCanvas, 150);
        }
    };

    /* ========================================================
       القسم 16: نطق صوت حرف الخاء وفصيح
    ======================================================== */
    window.playKhaLetterSound = function() {
        mascotSpeak('صَوْتُ حَرْفِ الْخَاءِ الصَّافِي: خْ... اِخْـ! حَرْفٌ حَلْقِيٌّ مُفَخَّمٌ رَخْوٌ مَهْمُوسٌ.', 'letter_kha_sound');
    };

    window.playKhaPhonemeFaseeh = function() {
        mascotSpeak('أَهْلًا بِكُمْ يَا أَبْطَالَ الْقِرَاءَةِ! أَنَا صَدِيقُكُمْ فَصِيح! حَرْفُ الْخَاءِ حَرْفٌ حَلْقِيٌّ مُفَخَّمٌ جَمِيل، يَخْرُجُ صَوْتُهُ مِنْ أَدْنَى الْحَلْقِ، وَيَتَمَيَّزُ بِالتَّفْخِيمِ وَالرَّخَاوَةِ وَالْهَمْسِ، وَيَجْلِسُ كَالْقَوْسِ الْمُمَوَّجِ مَعَ نُقْطَةٍ وَاحِدَةٍ فِي أَعْلَاهُ كَالْجَوْهَرَةِ التَّاجِيَّة!', 'letter_kha_phoneme_faseeh');
    };

    /* ========================================================
       القسم 17: سبورة رسم حرف الخاء
    ======================================================== */
    let khaCanvas = null;
    let khaCtx = null;
    let isDrawingKha = false;
    let currentKhaColor = '#d97706';

    window.initKhaCanvas = function() {
        khaCanvas = document.getElementById('khaDrawingCanvas');
        if (!khaCanvas) return;
        khaCtx = khaCanvas.getContext('2d');

        const rect = khaCanvas.getBoundingClientRect();
        if (rect.width > 0) {
            khaCanvas.width = rect.width * 2;
            khaCanvas.height = 320 * 2;
            khaCtx.scale(2, 2);

            // Draw baseline
            khaCtx.save();
            khaCtx.strokeStyle = '#cbd5e1';
            khaCtx.lineWidth = 2;
            khaCtx.setLineDash([8, 6]);
            khaCtx.beginPath();
            khaCtx.moveTo(20, 220);
            khaCtx.lineTo(rect.width - 20, 220);
            khaCtx.stroke();
            khaCtx.restore();

            const getPos = (e) => {
                const r = khaCanvas.getBoundingClientRect();
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;
                return {
                    x: clientX - r.left,
                    y: clientY - r.top
                };
            };

            const startDraw = (e) => {
                e.preventDefault();
                isDrawingKha = true;
                const pos = getPos(e);
                khaCtx.beginPath();
                khaCtx.moveTo(pos.x, pos.y);
                khaCtx.strokeStyle = currentKhaColor;
                khaCtx.lineWidth = 6;
                khaCtx.lineCap = 'round';
                khaCtx.lineJoin = 'round';
            };

            const drawMove = (e) => {
                if (!isDrawingKha) return;
                e.preventDefault();
                const pos = getPos(e);
                khaCtx.lineTo(pos.x, pos.y);
                khaCtx.stroke();
            };

            const endDraw = (e) => {
                if (!isDrawingKha) return;
                e.preventDefault();
                isDrawingKha = false;
                khaCtx.closePath();
            };

            khaCanvas.addEventListener('mousedown', startDraw);
            khaCanvas.addEventListener('mousemove', drawMove);
            window.addEventListener('mouseup', endDraw);

            khaCanvas.addEventListener('touchstart', startDraw, { passive: false });
            khaCanvas.addEventListener('touchmove', drawMove, { passive: false });
            window.addEventListener('touchend', endDraw, { passive: false });
        }
    };

    window.clearKhaCanvas = function() {
        if (!khaCtx || !khaCanvas) return;
        khaCtx.clearRect(0, 0, khaCanvas.width, khaCanvas.height);
        // Draw baseline
        const w = khaCanvas.width / 2;
        khaCtx.save();
        khaCtx.strokeStyle = '#cbd5e1';
        khaCtx.lineWidth = 2;
        khaCtx.setLineDash([8, 6]);
        khaCtx.beginPath();
        khaCtx.moveTo(20, 220);
        khaCtx.lineTo(w - 20, 220);
        khaCtx.stroke();
        khaCtx.restore();
    };

    window.setKhaCanvasColor = function(color) {
        currentKhaColor = color;
        if (khaCtx) khaCtx.strokeStyle = color;
    };

    /* ========================================================
       القسم 18: اختبار التحدي الفونيمي التفاعلي للخاء
    ======================================================== */
    let khaScore = 0;
    const answeredKhaQuestions = {};

    window.answerKhaQuiz = function(qNum, selectedOption, isCorrect, btn) {
        if (answeredKhaQuestions[qNum]) return;
        answeredKhaQuestions[qNum] = true;

        const parent = btn.parentElement;
        parent.querySelectorAll('.kha-quiz-option').forEach(b => {
            b.style.pointerEvents = 'none';
        });

        if (isCorrect) {
            btn.classList.add('correct');
            khaScore++;
            mascotCelebrates();
            playAudio('letter_kha_correct');
            mascotSpeak('أَحْسَنْتَ يَا عَبْقَرِيّ! إِجَابَةٌ صَحِيحَةٌ وَمُمَيَّزَةٌ جِدًّا! 🌟', 'letter_kha_correct');
        } else {
            btn.classList.add('wrong');
            mascotThinks();
            playAudio('letter_kha_wrong');
            mascotSpeak('فَكِّرْ جَيِّدًا فِي مَخْرَجِ وَشَكْلِ حَرْفِ الْخَاءِ يَا بَطَل! حَاوِلْ مَرَّةً أُخْرَى! 💡', 'letter_kha_wrong');
        }

        const scoreEl = document.getElementById('khaQuizScore');
        if (scoreEl) scoreEl.innerText = khaScore;

        if (Object.keys(answeredKhaQuestions).length === 5) {
            setTimeout(() => {
                mascotCelebrates();
                playAudio('letter_kha_encourage_super');
                mascotSpeak(`مَا شَاءَ اللَّه! أَتْمَمْتَ اخْتِبَارَ التَّحَدِّي لِدَرْسِ حَرْفِ الْخَاءِ بِنَجَاحٍ بَاهِر: ${khaScore} مِنْ ٥! أَنْتَ بَطَلُ الْقِرَاءَةِ! 🏆🎉`, 'letter_kha_encourage_super');
            }, 1200);
        }
    };

    /* ==========================================================================
       الدرس الرابع: حرف الثاء (ثـ ، ث) وتطبيقاته (ص ٩٩ - ١٠١)
       ========================================================================== */

    /* ========================================================
       القسم 19: التنقل بين محطات درس حرف الثاء
    ======================================================== */
    window.switchLetterThaStation = function(stationNum) {
        for (let i = 1; i <= 4; i++) {
            const st = document.getElementById(`stationTha_${i}`);
            const btn = document.getElementById(`btnStationTha_${i}`);
            if (st) st.classList.remove('active');
            if (btn) btn.classList.remove('active');
        }

        const activeSt = document.getElementById(`stationTha_${stationNum}`);
        const activeBtn = document.getElementById(`btnStationTha_${stationNum}`);
        if (activeSt) activeSt.classList.add('active');
        if (activeBtn) activeBtn.classList.add('active');

        if (stationNum === 1) {
            mascotSpeak('الْمَحَطَّةُ الأُولَى: أَتَعَرَّفُ حَرْفَ الثَّاءِ (ثـ ، ث) وَصُوَرَ الْكِتَابِ فِي صَفْحَةِ ٩٩! اِسْتَمِعْ لِصَوْتِ الثَّاءِ اللِّثَوِيِّ الْهَامِسِ وَقِصَّةِ الْمَشْهَد!', 'letter_tha_intro');
        } else if (stationNum === 2) {
            mascotSpeak('الْمَحَطَّةُ الثَّانِيَةُ: أَصْوَاتُ الْحَرَكَاتِ وَالْمُدُودِ وَالْمَقَاطِعِ السَّاكِنَةِ وَأَشْكَالِ حَرْفِ الثَّاء (ص ٩٩ - ١٠٠)! مَيِّزْ بَيْنَ ثَـ ، ثُـ ، ثِـ وَ ثَا ، ثُو ، ثِيـ، وَمَقَاطِعِ: أَثْـ ، اثْـ ، مُثْـ!', 'letter_tha_vowels_station');
        } else if (stationNum === 3) {
            mascotSpeak('الْمَحَطَّةُ الثَّالِثَةُ: التَّحْلِيلُ وَالتَّرْكِيبُ الصَّوْتِيُّ (ص ١٠٠ - ١٠١)! حَلِّلْ وَرَكِّبْ كَلِمَاتِ (ثِمَارٌ ، مِيرَاثٌ ، ثَعْلَبٌ ، أَثَاثٌ ، ثُعْبَانٌ ، لَيْثٌ) وَجُمْلَةَ: لَعِبَ لَيْثٌ بِأَثْقَالٍ!', 'letter_tha_analysis_intro');
        } else if (stationNum === 4) {
            mascotSpeak('الْمَحَطَّةُ الرَّابِعَةُ: الْقِرَاءَةُ الْمُعَبِّرَةُ لِنَصِّ الْكِتَابِ (تُرَاثُ تَصْنَعُ لُعَبًا مِنْ وَرَقٍ) وَالنَّصِّ التُّرَاثِيِّ (مِحْرَاثُ حَارِثٍ)، وَالسَّبُّورَةُ وَاخْتِبَارُ التَّحَدِّي!', 'letter_tha_read_intro');
            setTimeout(window.initThaCanvas, 150);
        }
    };

    /* ========================================================
       القسم 20: نطق صوت حرف الثاء وفصيح
    ======================================================== */
    window.playThaLetterSound = function() {
        mascotSpeak('صَوْتُ حَرْفِ الثَّاءِ الصَّافِي: ثْ... اِثْـ! حَرْفٌ لِثَوِيٌّ رَخْوٌ مَهْمُوسٌ.', 'letter_tha_sound');
    };

    window.playThaPhonemeFaseeh = function() {
        mascotSpeak('مَرْحَبًا بِكُمْ يَا عَبَاقِرَةَ الْقِرَاءَةِ! أَنَا صَدِيقُكُمْ فَصِيح! حَرْفُ الثَّاءِ حَرْفٌ لِثَوِيٌّ رَخْوٌ مَهْمُوسٌ لَطِيف، يَخْرُجُ مِنْ طَرَفِ اللِّسَانِ مَعَ أَطْرَافِ الثَّنَايَا الْعُلْيَا بِكُلِّ هُدُوءٍ وَعُذُوبَة، وَيَجْلِسُ كَالصَّحْنِ الْمُمَوَّجِ الْأَنِيقِ مَعَ ثَلَاثِ نِقَاطٍ زَاهِيَةٍ فَوْقَهُ مُرَتَّبَةٍ كَالتَّاجِ أَوْ كَالْمُثَلَّثِ الْبَدِيع!', 'letter_tha_phoneme_faseeh');
    };

    /* ========================================================
       القسم 21: سبورة رسم حرف الثاء
    ======================================================== */
    let thaCanvas = null;
    let thaCtx = null;
    let isDrawingTha = false;
    let currentThaColor = '#0284c7';

    window.initThaCanvas = function() {
        thaCanvas = document.getElementById('thaDrawingCanvas');
        if (!thaCanvas) return;
        thaCtx = thaCanvas.getContext('2d');

        const rect = thaCanvas.getBoundingClientRect();
        if (rect.width > 0) {
            thaCanvas.width = rect.width * 2;
            thaCanvas.height = 320 * 2;
            thaCtx.scale(2, 2);

            // Draw baseline
            thaCtx.save();
            thaCtx.strokeStyle = '#bae6fd';
            thaCtx.lineWidth = 2;
            thaCtx.setLineDash([8, 6]);
            thaCtx.beginPath();
            thaCtx.moveTo(20, 220);
            thaCtx.lineTo(rect.width - 20, 220);
            thaCtx.stroke();
            thaCtx.restore();

            const getPos = (e) => {
                const r = thaCanvas.getBoundingClientRect();
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;
                return {
                    x: clientX - r.left,
                    y: clientY - r.top
                };
            };

            const startDraw = (e) => {
                e.preventDefault();
                isDrawingTha = true;
                const pos = getPos(e);
                thaCtx.beginPath();
                thaCtx.moveTo(pos.x, pos.y);
                thaCtx.strokeStyle = currentThaColor;
                thaCtx.lineWidth = 6;
                thaCtx.lineCap = 'round';
                thaCtx.lineJoin = 'round';
            };

            const drawMove = (e) => {
                if (!isDrawingTha) return;
                e.preventDefault();
                const pos = getPos(e);
                thaCtx.lineTo(pos.x, pos.y);
                thaCtx.stroke();
            };

            const endDraw = (e) => {
                if (!isDrawingTha) return;
                e.preventDefault();
                isDrawingTha = false;
                thaCtx.closePath();
            };

            thaCanvas.addEventListener('mousedown', startDraw);
            thaCanvas.addEventListener('mousemove', drawMove);
            window.addEventListener('mouseup', endDraw);

            thaCanvas.addEventListener('touchstart', startDraw, { passive: false });
            thaCanvas.addEventListener('touchmove', drawMove, { passive: false });
            window.addEventListener('touchend', endDraw, { passive: false });
        }
    };

    window.clearThaCanvas = function() {
        if (!thaCtx || !thaCanvas) return;
        thaCtx.clearRect(0, 0, thaCanvas.width, thaCanvas.height);
        // Draw baseline
        const w = thaCanvas.width / 2;
        thaCtx.save();
        thaCtx.strokeStyle = '#bae6fd';
        thaCtx.lineWidth = 2;
        thaCtx.setLineDash([8, 6]);
        thaCtx.beginPath();
        thaCtx.moveTo(20, 220);
        thaCtx.lineTo(w - 20, 220);
        thaCtx.stroke();
        thaCtx.restore();
    };

    window.setThaCanvasColor = function(color) {
        currentThaColor = color;
        if (thaCtx) thaCtx.strokeStyle = color;
    };

    /* ========================================================
       القسم 22: اختبار التحدي الفونيمي التفاعلي للثاء
    ======================================================== */
    let thaScore = 0;
    const answeredThaQuestions = {};

    window.answerThaQuiz = function(qNum, selectedOption, isCorrect, btn) {
        if (answeredThaQuestions[qNum]) return;
        answeredThaQuestions[qNum] = true;

        const parent = btn.parentElement;
        parent.querySelectorAll('.tha-quiz-option').forEach(b => {
            b.style.pointerEvents = 'none';
        });

        if (isCorrect) {
            btn.classList.add('correct');
            thaScore++;
            mascotCelebrates();
            playAudio('letter_tha_correct');
            mascotSpeak('أَحْسَنْتَ يَا عَبْقَرِيّ! إِجَابَةٌ صَحِيحَةٌ وَمُمَيَّزَةٌ جِدًّا! 🌟', 'letter_tha_correct');
        } else {
            btn.classList.add('wrong');
            mascotThinks();
            playAudio('letter_tha_wrong');
            mascotSpeak('فَكِّرْ جَيِّدًا فِي مَخْرَجِ وَشَكْلِ حَرْفِ الثَّاءِ يَا بَطَل! حَاوِلْ مَرَّةً أُخْرَى! 💡', 'letter_tha_wrong');
        }

        const scoreEl = document.getElementById('thaQuizScore');
        if (scoreEl) scoreEl.innerText = thaScore;

        if (Object.keys(answeredThaQuestions).length === 5) {
            setTimeout(() => {
                mascotCelebrates();
                playAudio('letter_tha_encourage_super');
                mascotSpeak(`مَا شَاءَ اللَّه! أَتْمَمْتَ اخْتِبَارَ التَّحَدِّي لِدَرْسِ حَرْفِ الثَّاءِ بِنَجَاحٍ بَاهِر: ${thaScore} مِنْ ٥! أَنْتَ بَطَلُ الْقِرَاءَةِ! 🏆🎉`, 'letter_tha_encourage_super');
            }, 1200);
        }
    };

    /* ==========================================================================
       الدرس الخامس: حرف الكاف (كـ ، ك) وتطبيقاته (ص ١٠٢ - ١٠٤)
       ========================================================================== */

    /* ========================================================
       القسم 23: التنقل بين محطات درس حرف الكاف
    ======================================================== */
    window.switchLetterKafStation = function(stationNum) {
        for (let i = 1; i <= 4; i++) {
            const st = document.getElementById(`stationKaf_${i}`);
            const btn = document.getElementById(`btnStationKaf_${i}`);
            if (st) st.classList.remove('active');
            if (btn) btn.classList.remove('active');
        }

        const activeSt = document.getElementById(`stationKaf_${stationNum}`);
        const activeBtn = document.getElementById(`btnStationKaf_${stationNum}`);
        if (activeSt) activeSt.classList.add('active');
        if (activeBtn) activeBtn.classList.add('active');

        if (stationNum === 1) {
            mascotSpeak('الْمَحَطَّةُ الأُولَى: أَتَعَرَّفُ حَرْفَ الْكَافِ (كـ ، ك) وَصُوَرَ الْكِتَابِ فِي صَفْحَةِ ١٠٢! اِسْتَمِعْ لِصَوْتِ الْكَافِ الشَّدِيدِ الْمَهْمُوسِ الْمُرَقَّقِ وَقِصَّةِ الْمَشْهَد!', 'letter_kaf_intro');
        } else if (stationNum === 2) {
            mascotSpeak('الْمَحَطَّةُ الثَّانِيَةُ: أَصْوَاتُ الْحَرَكَاتِ وَالْمُدُودِ وَالْمَقَاطِعِ السَّاكِنَةِ وَأَشْكَالِ حَرْفِ الْكَاف (ص ١٠٢ - ١٠٣)! مَيِّزْ بَيْنَ كَـ ، كُـ ، كِـ وَ كَا ، كُو ، كِيـ، وَمَقَاطِعِ: مَكْـ ، رُكْـ ، مِكْـ!', 'letter_kaf_vowels_station');
        } else if (stationNum === 3) {
            mascotSpeak('الْمَحَطَّةُ الثَّالِثَةُ: التَّحْلِيلُ وَالتَّرْكِيبُ الصَّوْتِيُّ (ص ١٠٣ - ١٠٤)! حَلِّلْ وَرَكِّبْ كَلِمَاتِ (مَكْتَبَةٌ ، كَوْثَرٌ ، كِتَابٌ ، كَبِيرَةٌ ، حِكَايَاتٌ ، بُرْكَانٌ) وَجُمْلَةَ: كِنَانُ يَقْرَأُ كِتَابًا عَنْ حَيْوَانَاتٍ عَجِيبَةٍ!', 'letter_kaf_analysis_intro');
        } else if (stationNum === 4) {
            mascotSpeak('الْمَحَطَّةُ الرَّابِعَةُ: الْقِرَاءَةُ الْمُعَبِّرَةُ لِنَصِّ الْكِتَابِ (بَابَا يَقْرَأُ كِتَابًا) وَالنُّصُوصِ التُّرَاثِيَّةِ (مَالِكٌ سَمَّاكٌ / كِتَابٌ مَكْتُوبٌ)، وَالسَّبُّورَةُ وَاخْتِبَارُ التَّحَدِّي!', 'letter_kaf_read_intro');
            setTimeout(window.initKafCanvas, 150);
        }
    };

    /* ========================================================
       القسم 24: نطق صوت حرف الكاف وفصيح
    ======================================================== */
    window.playKafLetterSound = function() {
        mascotSpeak('صَوْتُ حَرْفِ الْكَافِ الصَّافِي: كْ... كْ... كْ! حَرْفٌ شَدِيدٌ مَهْمُوسٌ مُرَقَّق.', 'letter_kaf_sound');
    };

    window.playKafPhonemeFaseeh = function() {
        mascotSpeak('مَرْحَبًا يَا أَصْدِقَائِي! أَنَا صَدِيقُكُمْ فَصِيح. صَوْتُ حَرْفِ الْكَافِ هُوَ: كْ... اِكْـ! يَخْرُجُ مِنْ أَقْصَى اللِّسَانِ مَعَ الْحَنَكِ الْأَعْلَى، وَهُوَ حَرْفٌ شَدِيدٌ مَهْمُوسٌ مُرَقَّق، يَتَمَيَّزُ عَنِ الْقَافِ الْمُفَخَّمَة. رَدِّدُوا مَعِي: كْ... كْ... كْ!', 'letter_kaf_phoneme_faseeh');
    };

    /* ========================================================
       القسم 25: سبورة رسم حرف الكاف
    ======================================================== */
    let kafCanvas = null;
    let kafCtx = null;
    let isDrawingKaf = false;
    let currentKafColor = '#4338ca';

    window.initKafCanvas = function() {
        kafCanvas = document.getElementById('kafDrawingCanvas');
        if (!kafCanvas) return;
        kafCtx = kafCanvas.getContext('2d');

        const rect = kafCanvas.getBoundingClientRect();
        if (rect.width > 0) {
            kafCanvas.width = rect.width * 2;
            kafCanvas.height = 320 * 2;
            kafCtx.scale(2, 2);

            window.clearKafCanvas();

            const getPos = (e) => {
                const r = kafCanvas.getBoundingClientRect();
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;
                return {
                    x: clientX - r.left,
                    y: clientY - r.top
                };
            };

            const startDraw = (e) => {
                e.preventDefault();
                isDrawingKaf = true;
                const pos = getPos(e);
                kafCtx.beginPath();
                kafCtx.moveTo(pos.x, pos.y);
                kafCtx.strokeStyle = currentKafColor;
                kafCtx.lineWidth = 6;
                kafCtx.lineCap = 'round';
                kafCtx.lineJoin = 'round';
            };

            const drawMove = (e) => {
                if (!isDrawingKaf) return;
                e.preventDefault();
                const pos = getPos(e);
                kafCtx.lineTo(pos.x, pos.y);
                kafCtx.stroke();
            };

            const endDraw = (e) => {
                if (!isDrawingKaf) return;
                e.preventDefault();
                isDrawingKaf = false;
                kafCtx.closePath();
            };

            kafCanvas.addEventListener('mousedown', startDraw);
            kafCanvas.addEventListener('mousemove', drawMove);
            window.addEventListener('mouseup', endDraw);

            kafCanvas.addEventListener('touchstart', startDraw, { passive: false });
            kafCanvas.addEventListener('touchmove', drawMove, { passive: false });
            window.addEventListener('touchend', endDraw, { passive: false });
        }
    };

    window.clearKafCanvas = function() {
        if (!kafCtx || !kafCanvas) return;
        kafCtx.clearRect(0, 0, kafCanvas.width, kafCanvas.height);
        // Draw baseline
        const w = kafCanvas.width / 2;
        kafCtx.save();
        kafCtx.strokeStyle = '#c7d2fe';
        kafCtx.lineWidth = 2;
        kafCtx.setLineDash([8, 6]);
        kafCtx.beginPath();
        kafCtx.moveTo(20, 220);
        kafCtx.lineTo(w - 20, 220);
        kafCtx.stroke();
        kafCtx.restore();
    };

    window.setKafCanvasColor = function(color) {
        currentKafColor = color;
        if (kafCtx) kafCtx.strokeStyle = color;
    };

    /* ========================================================
       القسم 26: اختبار التحدي الفونيمي التفاعلي للكاف
    ======================================================== */
    let kafScore = 0;
    const answeredKafQuestions = {};

    window.answerKafQuiz = function(qNum, selectedOption, isCorrect, btn) {
        if (answeredKafQuestions[qNum]) return;
        answeredKafQuestions[qNum] = true;

        const parent = btn.parentElement;
        parent.querySelectorAll('.kaf-quiz-option').forEach(b => {
            b.style.pointerEvents = 'none';
        });

        if (isCorrect) {
            btn.classList.add('correct');
            kafScore++;
            mascotCelebrates();
            playAudio('letter_kaf_correct');
            mascotSpeak('أَحْسَنْتَ يَا عَبْقَرِيّ! إِجَابَةٌ صَحِيحَةٌ وَمُمَيَّزَةٌ جِدًّا! 🌟', 'letter_kaf_correct');
        } else {
            btn.classList.add('wrong');
            mascotThinks();
            playAudio('letter_kaf_wrong');
            mascotSpeak('فَكِّرْ جَيِّدًا فِي مَخْرَجِ وَشَكْلِ حَرْفِ الْكَافِ يَا بَطَل! حَاوِلْ مَرَّةً أُخْرَى! 💡', 'letter_kaf_wrong');
        }

        const scoreEl = document.getElementById('kafQuizScore');
        if (scoreEl) scoreEl.innerText = kafScore;

        if (Object.keys(answeredKafQuestions).length === 5) {
            setTimeout(() => {
                mascotCelebrates();
                playAudio('letter_kaf_encourage_super');
                mascotSpeak(`مَا شَاءَ اللَّه! أَتْمَمْتَ اخْتِبَارَ التَّحَدِّي لِدَرْسِ حَرْفِ الْكَافِ بِنَجَاحٍ بَاهِر: ${kafScore} مِنْ ٥! أَنْتَ بَطَلُ الْقِرَاءَةِ! 🏆🎉`, 'letter_kaf_encourage_super');
            }, 1200);
        }
    };

    /* ==========================================================================
       الدرس السادس: الشدة (ـّ) وتطبيقاتها وقراءة زُرْنَا بَيْتَ جَدِّي ونشيد هَيَّا نَلْعَبْ (ص ١٠٥ - ١٠٨)
    ========================================================================== */

    /* ========================================================
       القسم 27: محطات درس الشدة وتطبيقاتها
    ======================================================== */
    window.switchShaddahStation = function(stationNum) {
        for (let i = 1; i <= 4; i++) {
            const btn = document.getElementById(`btnStationShaddah_${i}`);
            const sec = document.getElementById(`stationShaddah_${i}`);
            if (btn) btn.classList.remove('active');
            if (sec) sec.classList.remove('active');
        }

        const activeBtn = document.getElementById(`btnStationShaddah_${stationNum}`);
        const activeSec = document.getElementById(`stationShaddah_${stationNum}`);
        if (activeBtn) activeBtn.classList.add('active');
        if (activeSec) activeSec.classList.add('active');

        mascotCelebrates();

        if (stationNum === 1) {
            mascotSpeak('الْمَحَطَّةُ الأُولَى: أَتَعَرَّفُ الشَّدَّةَ (ـّ) وَأَصْوَاتَ الْحَرَكَاتِ وَالْمَشْهَدَ التَّفَاعُلِيَّ ص ١٠٥!', 'shaddah_intro');
        } else if (stationNum === 2) {
            mascotSpeak('الْمَحَطَّةُ الثَّانِيَةُ: مَعْمَلُ تَكْوِينِ الشَّدَّةِ وَتَمْيِيزِ الْحَرْفِ الْمُشَدَّدِ وَرَسْمِ الْكَلِمَاتِ ص ١٠٥ - ١٠٦!', 'shaddah_act2_intro');
        } else if (stationNum === 3) {
            mascotSpeak('الْمَحَطَّةُ الثَّالِثَةُ: التَّحْلِيلُ الصَّوْتِيُّ وَتَرْكِيبُ الْمَقَاطِعِ الْمُشَدَّدَةِ ص ١٠٦ - ١٠٧!', 'shaddah_act5_intro');
        } else if (stationNum === 4) {
            mascotSpeak('الْمَحَطَّةُ الرَّابِعَةُ: قِرَاءَةُ زُرْنَا بَيْتَ جَدِّي وَإِنْشَادُ هَيَّا نَلْعَبْ وَالسَّبُّورَةُ وَالتَّحَدِّي ص ١٠٧ - ١٠٨!', 'shaddah_read_intro');
            setTimeout(initShaddahCanvas, 300);
        }
    };

    /* ========================================================
       القسم 28: أصوات الشدة وحركاتها الثلاث
    ======================================================== */
    window.playShaddahSound = function() {
        mascotCelebrates();
        playAudio('shaddah_sound');
        mascotSpeak('الشَّدَّةُ (ـّ): إِدْغَامُ حَرْفَيْنِ مُتَمَاثِلَيْنِ الأَوَّلُ سَاكِنٌ وَالثَّانِي مُتَحَرِّكٌ! 🔊', 'shaddah_sound');
    };

    window.playShaddahPhonemeFaseeh = function() {
        mascotCelebrates();
        mascotSpeak('فَصِيح يَقُولُ: عِنْدَ رُؤْيَةِ الشَّدَّةِ نَضْغَطُ عَلَى الْحَرْفِ بِقُوَّةٍ خَفِيفَةٍ كَأَنَّهُ مَرَّتَيْنِ: قِطْـ طَة... قِطَّة! 🗣️', 'shaddah_phoneme_faseeh');
    };

    window.playShaddahHaraka = function(harakaType) {
        mascotCelebrates();
        const map = {
            'fatha': 'shaddah_fatha',
            'dhamma': 'shaddah_dhamma',
            'kasra': 'shaddah_kasra'
        };
        playAudio(map[harakaType] || 'shaddah_sound');
    };

    /* ========================================================
       القسم 29: نشاط 2 معمل تكوين الشدة
    ======================================================== */
    window.playShaddahFormation = function(formKey) {
        mascotCelebrates();
        const map = {
            'qittah': 'shaddah_form_qittah',
            'dabboos': 'shaddah_form_dabboos',
            'bitteekh': 'shaddah_form_bitteekh'
        };
        playAudio(map[formKey] || 'shaddah_act2_intro');
    };

    /* ========================================================
       القسم 30: نشاط 3 استماع وتحديد الحرف المشدد
    ======================================================== */
    window.pickShaddahLetter = function(btn, isShaddah) {
        if (btn.classList.contains('picked')) return;
        if (isShaddah) {
            btn.classList.add('picked');
            mascotCelebrates();
            playAudio('shaddah_correct');
            mascotSpeak('أَحْسَنْتَ يَا عَبْقَرِيّ! هَذَا هُوَ الْحَرْفُ الْمُشَدَّدُ بِالضَّبْطِ! 🌟👏', 'shaddah_correct');
        } else {
            mascotThinks();
            playAudio('shaddah_wrong');
            mascotSpeak('انْتَبِهْ يَا بَطَل! هَذَا حَرْفٌ غَيْرُ مُشَدَّدٍ، ابْحَثْ عَنِ الْحَرْفِ الَّذِي تَعْلُوهُ الشَّدَّةُ (ـّ)! 💡', 'shaddah_wrong');
        }
    };

    /* ========================================================
       القسم 31: نشاط 4 رسم الكلمات بالشدة والحركات
    ======================================================== */
    window.playShaddahDraw = function(wordKey) {
        mascotCelebrates();
        const map = {
            'tayyaarah': 'shaddah_draw_tayyaarah',
            'najjaar': 'shaddah_draw_najjaar',
            'sabboorah': 'shaddah_draw_sabboorah',
            'tumashshitu': 'shaddah_draw_tumashshitu'
        };
        playAudio(map[wordKey] || 'shaddah_act4_intro');
    };

    /* ========================================================
       القسم 32: التحليل والتركيب الصوتي نشاط 5 و 8
    ======================================================== */
    window.playShaddahSplit = function(wordKey) {
        mascotCelebrates();
        const map = {
            'barraad': 'shaddah_split_barraad',
            'yaqussu': 'shaddah_split_yaqussu',
            'muallim': 'shaddah_split_muallim'
        };
        playAudio(map[wordKey] || 'shaddah_act5_intro');
    };

    window.playShaddahMerge = function(wordKey) {
        mascotCelebrates();
        const map = {
            'tuffaah': 'shaddah_merge_tuffaah',
            'najjaar': 'shaddah_merge_najjaar',
            'yuhibbu': 'shaddah_merge_yuhibbu'
        };
        playAudio(map[wordKey] || 'shaddah_act8_intro');
    };

    /* ========================================================
       القسم 33: قراءة زُرْنَا بَيْتَ جَدِّي ونشيد هَيَّا نَلْعَبْ
    ======================================================== */
    window.switchShaddahReadingTab = function(tab) {
        const btnJaddi = document.getElementById('btnShaddahReadJaddi');
        const btnNasheed = document.getElementById('btnShaddahReadNasheed');
        const btnHeritage = document.getElementById('btnShaddahReadHeritage');

        const contentJaddi = document.getElementById('shaddahReadingJaddiContent');
        const contentNasheed = document.getElementById('shaddahReadingNasheedContent');
        const contentHeritage = document.getElementById('shaddahReadingHeritageContent');

        if (btnJaddi) {
            btnJaddi.style.background = tab === 'jaddi' ? '#e11d48' : '#ffe4e6';
            btnJaddi.style.color = tab === 'jaddi' ? '#ffffff' : '#be123c';
        }
        if (btnNasheed) {
            btnNasheed.style.background = tab === 'nasheed' ? '#0284c7' : '#e0f2fe';
            btnNasheed.style.color = tab === 'nasheed' ? '#ffffff' : '#0369a1';
        }
        if (btnHeritage) {
            btnHeritage.style.background = tab === 'heritage' ? '#d97706' : '#fef3c7';
            btnHeritage.style.color = tab === 'heritage' ? '#ffffff' : '#92400e';
        }

        if (contentJaddi) contentJaddi.style.display = tab === 'jaddi' ? 'block' : 'none';
        if (contentNasheed) contentNasheed.style.display = tab === 'nasheed' ? 'block' : 'none';
        if (contentHeritage) contentHeritage.style.display = tab === 'heritage' ? 'block' : 'none';

        if (tab === 'jaddi') {
            mascotSpeak('نَصُّ الْكِتَابِ ص ١٠٧: زُرْنَا بَيْتَ جَدِّي! اسْتَمِعْ وَاقْرَأْ بِلِسَانٍ عَرَبِيٍّ فَصِيح!', 'shaddah_read_jaddi_full');
        } else if (tab === 'nasheed') {
            mascotSpeak('نَشِيدُ: هَيَّا نَلْعَبْ ص ١٠٨! أَنْشِدْ مَعَنَا بِأَلْحَانٍ عَذْبَةٍ وَإِيقَاعٍ مَرِح!', 'shaddah_nasheed_full');
        } else if (tab === 'heritage') {
            mascotSpeak('النُّصُوصُ التُّرَاثِيَّةُ الْعِرَاقِيَّةُ لِلشَّدَّةِ: مِيزَانُ قَدُّورِي وَطَيَّارَةُ وَقَّاص!', 'shaddah_read_qaddoori');
        }
    };

    window.playShaddahReadLine = function(lineKey) {
        mascotCelebrates();
        const map = {
            'j_full': 'shaddah_read_jaddi_full',
            's1': 'shaddah_read_s1',
            's2': 'shaddah_read_s2',
            's3': 'shaddah_read_s3',
            's4': 'shaddah_read_s4'
        };
        playAudio(map[lineKey] || 'shaddah_read_intro');
    };

    window.playShaddahNasheedVerse = function(verseKey) {
        mascotCelebrates();
        const map = {
            'n_full': 'shaddah_nasheed_full',
            'b1': 'shaddah_nasheed_b1',
            'b2': 'shaddah_nasheed_b2',
            'b3': 'shaddah_nasheed_b3',
            'b4': 'shaddah_nasheed_b4'
        };
        playAudio(map[verseKey] || 'shaddah_nasheed_intro');
    };

    window.playShaddahHeritage = function(key) {
        mascotCelebrates();
        const map = {
            'qaddoori': 'shaddah_read_qaddoori',
            'waqqas': 'shaddah_read_waqqas'
        };
        playAudio(map[key] || 'shaddah_read_qaddoori');
    };

    /* ========================================================
       القسم 34: سبورة رسم الشدة التفاعلية
    ======================================================== */
    let shaddahCanvasInitialized = false;
    let shaddahCanvas, shaddahCtx;
    let isDrawingShaddah = false;
    let currentShaddahColor = '#e11d48';

    window.initShaddahCanvas = function() {
        shaddahCanvas = document.getElementById('shaddahDrawingCanvas');
        if (!shaddahCanvas) return;
        shaddahCtx = shaddahCanvas.getContext('2d');

        const rect = shaddahCanvas.getBoundingClientRect();
        if (rect.width > 0) {
            shaddahCanvas.width = rect.width * 2;
            shaddahCanvas.height = 320 * 2;
            shaddahCtx.scale(2, 2);

            window.clearShaddahCanvas();

            const getPos = (e) => {
                const r = shaddahCanvas.getBoundingClientRect();
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;
                return {
                    x: clientX - r.left,
                    y: clientY - r.top
                };
            };

            const startDraw = (e) => {
                e.preventDefault();
                isDrawingShaddah = true;
                const pos = getPos(e);
                shaddahCtx.beginPath();
                shaddahCtx.moveTo(pos.x, pos.y);
                shaddahCtx.strokeStyle = currentShaddahColor;
                shaddahCtx.lineWidth = 6;
                shaddahCtx.lineCap = 'round';
                shaddahCtx.lineJoin = 'round';
            };

            const drawMove = (e) => {
                if (!isDrawingShaddah) return;
                e.preventDefault();
                const pos = getPos(e);
                shaddahCtx.lineTo(pos.x, pos.y);
                shaddahCtx.stroke();
            };

            const endDraw = (e) => {
                if (!isDrawingShaddah) return;
                e.preventDefault();
                isDrawingShaddah = false;
                shaddahCtx.closePath();
            };

            shaddahCanvas.addEventListener('mousedown', startDraw);
            shaddahCanvas.addEventListener('mousemove', drawMove);
            window.addEventListener('mouseup', endDraw);

            shaddahCanvas.addEventListener('touchstart', startDraw, { passive: false });
            shaddahCanvas.addEventListener('touchmove', drawMove, { passive: false });
            window.addEventListener('touchend', endDraw, { passive: false });
        }
    };

    window.clearShaddahCanvas = function() {
        if (!shaddahCtx || !shaddahCanvas) return;
        shaddahCtx.clearRect(0, 0, shaddahCanvas.width, shaddahCanvas.height);
        // Draw baseline
        const w = shaddahCanvas.width / 2;
        shaddahCtx.save();
        shaddahCtx.strokeStyle = '#fecdd3';
        shaddahCtx.lineWidth = 2;
        shaddahCtx.setLineDash([8, 6]);
        shaddahCtx.beginPath();
        shaddahCtx.moveTo(20, 220);
        shaddahCtx.lineTo(w - 20, 220);
        shaddahCtx.stroke();
        shaddahCtx.restore();
    };

    window.setShaddahCanvasColor = function(color) {
        currentShaddahColor = color;
        if (shaddahCtx) shaddahCtx.strokeStyle = color;
    };

    /* ========================================================
       القسم 35: اختبار التحدي الفونيمي التفاعلي للشدة
    ======================================================== */
    let shaddahScore = 0;
    const answeredShaddahQuestions = {};

    window.answerShaddahQuiz = function(qNum, selectedOption, isCorrect, btn) {
        if (answeredShaddahQuestions[qNum]) return;
        answeredShaddahQuestions[qNum] = true;

        const parent = btn.parentElement;
        parent.querySelectorAll('.shaddah-quiz-option').forEach(b => {
            b.style.pointerEvents = 'none';
        });

        if (isCorrect) {
            btn.classList.add('correct');
            shaddahScore++;
            mascotCelebrates();
            playAudio('shaddah_correct');
            mascotSpeak('أَحْسَنْتَ يَا عَبْقَرِيّ! إِجَابَةٌ صَحِيحَةٌ وَمُمَيَّزَةٌ جِدًّا! 🌟', 'shaddah_correct');
        } else {
            btn.classList.add('wrong');
            mascotThinks();
            playAudio('shaddah_wrong');
            mascotSpeak('فَكِّرْ جَيِّدًا فِي تَعْرِيفِ الشَّدَّةِ وَحَرَكَتِهَا يَا بَطَل! حَاوِلْ مَرَّةً أُخْرَى! 💡', 'shaddah_wrong');
        }

        const scoreEl = document.getElementById('shaddahQuizScore');
        if (scoreEl) scoreEl.innerText = shaddahScore;

        if (Object.keys(answeredShaddahQuestions).length === 5) {
            setTimeout(() => {
                mascotCelebrates();
                playAudio('shaddah_encourage_super');
                mascotSpeak(`مَا شَاءَ اللَّه! أَتْمَمْتَ اخْتِبَارَ التَّحَدِّي لِدَرْسِ الشَّدَّةِ بِنَجَاحٍ بَاهِر: ${shaddahScore} مِنْ ٥! أَنْتَ بَطَلُ الْقِرَاءَةِ! 🏆🎉`, 'shaddah_encourage_super');
            }, 1200);
        }
    };
})();
