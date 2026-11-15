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
})();
