/* ==========================================================================
 * منصة قراءتي التفاعلية الذكية - الوحدة السادسة: العالم من حولي (Unit 6 Lessons)
 * الدرس الأول: حرف الغين (غـ ، ـغـ ، ـغ ، غ) وتطبيقاته وقراءة غُرَابٌ أَعْيَرُ / غَزَالٌ وَغُرَابٌ / أَصْبَاغُ هِشَامٍ (ص ١١٠ - ١١٣)
 * إعداد وتطوير: المهندس أسامة خليل هاشم
 * ========================================================================== */

(function() {
    /* ========================================================
       القسم 1: التنقل بين محطات درس حرف الغين
    ======================================================== */
    window.switchLetterGhaynStation = function(stationNum) {
        document.querySelectorAll('#view-tab-letter_ghayn .station-tab').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('#view-tab-letter_ghayn .letter-ghayn-station').forEach(el => el.classList.remove('active'));

        const targetStation = document.getElementById('stationGhayn_' + stationNum);
        const targetBtn = document.getElementById('btnStationGhayn_' + stationNum);

        if (targetStation) targetStation.classList.add('active');
        if (targetBtn) targetBtn.classList.add('active');

        if (stationNum === 1) {
            mascotSpeak('الْوَحْدَةُ السَّادِسَةُ: الْعَالَمُ مِنْ حَوْلِي! مَعَ دَرْسِ حَرْفِ الْغَيْنِ (غـ ، ـغـ ، ـغ ، غ) وَتَطْبِيقَاتِهِ (ص ١١٠ - ١١٣)! اِسْتَمِعُوا لِصَوْتِ الْغَيْنِ الْحَلْقِيِّ الْمُفَخَّمِ، وَتَعَرَّفُوا عَلَى أَشْكَالِهِ الأَرْبَعَةِ وَكَلِمَاتِ الْكِتَابِ ص ١١٠!', 'letter_ghayn_intro');
        } else if (stationNum === 2) {
            mascotSpeak('أَصْوَاتُ الْمُدُودِ وَالْمَقَاطِعِ السَّاكِنَةِ لِحَرْفِ الْغَيْنِ! قَارِنْ بَيْنَ غَـ ، غُـ ، غِـ وَ غَا ، غُو ، غِيـ، وَمَيِّزْ مَقَاطِعَ: مِغْـ ، أَغْـ فِي كَلِمَاتِ: مِغْزَلٌ ، مِغْسَلَةٌ ، أَغْنَامٌ!', 'letter_ghayn_act2_intro');
        } else if (stationNum === 3) {
            mascotSpeak('الْتَّحْلِيلُ وَالتَّرْكِيبُ وَاسْتِبْدَالُ الأَصْوَاتِ! حَلِّلْ كَلِمَاتِ (تَغْرِيدٌ ، صَبَّاغٌ ، غَوَّاصَةٌ) بِالتَّصْفِيق، وَاسْتَبْدِلِ الْحُرُوفَ، وَرَكِّبِ الْمَقَاطِعَ لِتَكْوِينِ كَلِمَاتٍ مُفِيدَة!', 'letter_ghayn_act5_intro');
        } else if (stationNum === 4) {
            mascotSpeak('مَحَطَّةُ الْقِرَاءَةِ وَالسَّبُّورَةِ وَالنُّصُوصِ التُّرَاثِيَّةِ! اقْرَأْ نَصَّ الْكِتَابِ ص ١١٣، وَالنُّصُوصَ التُّرَاثِيَّةَ الْعِرَاقِيَّةَ الأَصِيلَةَ: غَزَالٌ وَغُرَابٌ ، وَأَصْبَاغُ هِشَامٍ ، وَغُرَابٌ أَعْيَرُ!', 'letter_ghayn_read_intro');
            setTimeout(initGhaynCanvas, 100);
        }
    };

    /* ========================================================
       القسم 2: أصوات حرف الغين الفونيمية والكلمات المصورة
    ======================================================== */
    window.playGhaynLetterSound = function() {
        mascotCelebrates();
        playAudio('letter_ghayn_sound');
    };

    window.playGhaynPhonemeFaseeh = function() {
        mascotCelebrates();
        playAudio('letter_ghayn_phoneme_faseeh');
    };

    window.playGhaynWord = function(wordKey) {
        mascotCelebrates();
        const map = {
            'ghuraab': 'letter_ghayn_word_ghuraab',
            'ghazaal': 'letter_ghayn_word_ghazaal',
            'babbaghaa': 'letter_ghayn_word_babbaghaa',
            'ghoorilla': 'letter_ghayn_word_ghoorilla',
            'ghassaalah': 'letter_ghayn_word_ghassaalah',
            'samgh': 'letter_ghayn_word_samgh',
            'ghitaa': 'letter_ghayn_word_ghitaa',
            'ghusn': 'letter_ghayn_word_ghusn',
            'ghaabah': 'letter_ghayn_word_ghaabah',
            'ragheef': 'letter_ghayn_word_ragheef',
            'ghidhaa': 'letter_ghayn_word_ghidhaa',
            'mighzal': 'letter_ghayn_word_mighzal',
            'mighsalah': 'letter_ghayn_word_mighsalah',
            'aghnaam': 'letter_ghayn_word_aghnaam',
            'taghreed': 'letter_ghayn_word_taghreed',
            'sabbaagh': 'letter_ghayn_word_sabbaagh',
            'ghawwaasah': 'letter_ghayn_word_ghawwaasah',
            'sagheer': 'letter_ghayn_word_sagheer',
            'faqeer': 'letter_ghayn_word_faqeer',
            'ghareeb': 'letter_ghayn_word_ghareeb',
            'qareeb': 'letter_ghayn_word_qareeb',
            'taghleef': 'letter_ghayn_word_taghleef',
            'ghaalib': 'letter_ghayn_word_ghaalib',
            'ghaamidh': 'letter_ghayn_word_ghaamidh',
            'ghassaal': 'letter_ghayn_word_ghassaal',
            'ghassaan': 'letter_ghayn_word_ghassaan',
            'dimaagh': 'letter_ghayn_word_dimaagh',
            'asbaagh': 'letter_ghayn_word_asbaagh',
            'hishaam': 'letter_ghayn_word_hishaam',
            'maysmoon': 'letter_ghayn_word_maysmoon',
            'rassam': 'letter_ghayn_word_rassam',
            'tasbugh': 'letter_ghayn_word_tasbugh',
            'soorah': 'letter_ghayn_word_soorah',
            'ulbah': 'letter_ghayn_word_ulbah',
            'saaqee': 'letter_ghayn_word_saaqee',
            'maksoorah': 'letter_ghayn_word_maksoorah',
            'atshaan': 'letter_ghayn_word_atshaan',
            'sadeeqee': 'letter_ghayn_word_sadeeqee',
            'qaddama': 'letter_ghayn_word_qaddama',
            'shariba': 'letter_ghayn_word_shariba',
            'alhamdu': 'letter_ghayn_word_alhamdu',
            'shukran': 'letter_ghayn_word_shukran',
            'jarrah': 'letter_ghayn_word_jarrah',
            'hasaat': 'letter_ghayn_word_hasaat',
            'irtafa_a': 'letter_ghayn_word_irtafa_a',
            'fariha': 'letter_ghayn_word_fariha'
        };
        const audioKey = map[wordKey] || ('letter_ghayn_word_' + wordKey);
        playAudio(audioKey);
    };

    /* ========================================================
       القسم 3: أصوات الحركات والمدود والمقاطع الساكنة
    ======================================================== */
    window.playGhaynVowel = function(type) {
        mascotCelebrates();
        const map = {
            'short_a': 'letter_ghayn_short_a',
            'short_u': 'letter_ghayn_short_u',
            'short_i': 'letter_ghayn_short_i',
            'long_aa': 'letter_ghayn_long_aa',
            'long_oo': 'letter_ghayn_long_oo',
            'long_ee': 'letter_ghayn_long_ee'
        };
        playAudio(map[type] || 'letter_ghayn_act2_intro');
    };

    window.playGhaynSyllable = function(sylKey) {
        mascotCelebrates();
        const map = {
            'migh': 'letter_ghayn_syl_migh',
            'agh': 'letter_ghayn_syl_agh'
        };
        playAudio(map[sylKey] || 'letter_ghayn_act4_intro');
    };

    /* ========================================================
       القسم 4: التحليل والتركيب والاستبدال الصوتي
    ======================================================== */
    window.playGhaynSplit = function(wordKey) {
        mascotCelebrates();
        const map = {
            'taghreed': 'letter_ghayn_split_taghreed',
            'sabbaagh': 'letter_ghayn_split_sabbaagh',
            'ghawwaasah': 'letter_ghayn_split_ghawwaasah'
        };
        playAudio(map[wordKey] || 'letter_ghayn_act5_intro');
    };

    window.playGhaynMerge = function(wordKey) {
        mascotCelebrates();
        const map = {
            'taghleef': 'letter_ghayn_merge_taghleef',
            'ghaalib': 'letter_ghayn_merge_ghaalib',
            'ghaamidh': 'letter_ghayn_merge_ghaamidh',
            'ghaabah': 'letter_ghayn_merge_ghaabah'
        };
        playAudio(map[wordKey] || 'letter_ghayn_act7_intro');
    };

    window.playGhaynSwap = function(swapKey) {
        mascotCelebrates();
        if (swapKey === 'sagheer_faqeer') {
            playAudio('letter_ghayn_word_faqeer');
        } else if (swapKey === 'ghareeb_qareeb') {
            playAudio('letter_ghayn_word_qareeb');
        } else {
            playAudio('letter_ghayn_act6_intro');
        }
    };

    /* ========================================================
       القسم 5: القراءة ونصوص الكتاب والنصوص التراثية
    ======================================================== */
    window.playGhaynReadingSentence = function(sentenceKey) {
        mascotCelebrates();
        playAudio(sentenceKey);
    };

    window.playGhaynStoryFull = function(storyKey) {
        mascotCelebrates();
        const map = {
            'p113': 'letter_ghayn_read_p113_full',
            'gazelle': 'letter_ghayn_story_gazelle_full',
            'asbaagh': 'letter_ghayn_story_asbaagh_full',
            'ghuraab': 'letter_ghayn_story_ghuraab_full'
        };
        playAudio(map[storyKey] || 'letter_ghayn_read_intro');
    };

    /* ========================================================
       القسم 6: سبورة تتبع ورسم حرف الغين (Handwriting Canvas)
    ======================================================== */
    let ghaynCanvas = null;
    let ghaynCtx = null;
    let isDrawingGhayn = false;
    let ghaynBrushColor = '#059669';
    let ghaynBrushSize = 6;

    window.initGhaynCanvas = function() {
        ghaynCanvas = document.getElementById('ghaynCanvas');
        if (!ghaynCanvas) return;
        ghaynCtx = ghaynCanvas.getContext('2d');

        // ضبط أبعاد الكانفاس لتطابق دقة العرض
        const rect = ghaynCanvas.getBoundingClientRect();
        ghaynCanvas.width = rect.width || 600;
        ghaynCanvas.height = 240;

        drawGhaynGuidelines();

        // أحداث الفأرة واللمس
        ghaynCanvas.onmousedown = startGhaynDraw;
        ghaynCanvas.onmousemove = drawGhayn;
        ghaynCanvas.onmouseup = stopGhaynDraw;
        ghaynCanvas.onmouseleave = stopGhaynDraw;

        ghaynCanvas.ontouchstart = function(e) {
            e.preventDefault();
            const touch = e.touches[0];
            const r = ghaynCanvas.getBoundingClientRect();
            startGhaynDraw({ clientX: touch.clientX, clientY: touch.clientY });
        };
        ghaynCanvas.ontouchmove = function(e) {
            e.preventDefault();
            const touch = e.touches[0];
            drawGhayn({ clientX: touch.clientX, clientY: touch.clientY });
        };
        ghaynCanvas.ontouchend = stopGhaynDraw;
    };

    function drawGhaynGuidelines() {
        if (!ghaynCtx || !ghaynCanvas) return;
        ghaynCtx.clearRect(0, 0, ghaynCanvas.width, ghaynCanvas.height);

        // خط الأساس المنقط للكتابة العربية
        ghaynCtx.strokeStyle = '#d1fae5';
        ghaynCtx.lineWidth = 2;
        ghaynCtx.setLineDash([8, 8]);
        ghaynCtx.beginPath();
        ghaynCtx.moveTo(20, ghaynCanvas.height * 0.65);
        ghaynCtx.lineTo(ghaynCanvas.width - 20, ghaynCanvas.height * 0.65);
        ghaynCtx.stroke();
        ghaynCtx.setLineDash([]);

        // نصوص تتبع إرشادية خفيفة
        ghaynCtx.font = 'bold 72px Cairo, Tahoma, sans-serif';
        ghaynCtx.fillStyle = 'rgba(5, 150, 105, 0.15)';
        ghaynCtx.textAlign = 'center';
        ghaynCtx.textBaseline = 'middle';
        ghaynCtx.fillText('غـ    ـغـ    ـغ    غ', ghaynCanvas.width / 2, ghaynCanvas.height * 0.52);
    }

    function startGhaynDraw(e) {
        isDrawingGhayn = true;
        const rect = ghaynCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        ghaynCtx.beginPath();
        ghaynCtx.moveTo(x, y);
    }

    function drawGhayn(e) {
        if (!isDrawingGhayn) return;
        const rect = ghaynCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ghaynCtx.strokeStyle = ghaynBrushColor;
        ghaynCtx.lineWidth = ghaynBrushSize;
        ghaynCtx.lineCap = 'round';
        ghaynCtx.lineJoin = 'round';
        ghaynCtx.lineTo(x, y);
        ghaynCtx.stroke();
    }

    function stopGhaynDraw() {
        isDrawingGhayn = false;
    }

    window.clearGhaynCanvas = function() {
        if (!ghaynCtx || !ghaynCanvas) return;
        drawGhaynGuidelines();
        mascotSpeak('مَسَحْنَا السَّبُّورَة! حَاوِلْ كِتَابَةَ حَرْفِ الْغَيْنِ مَرَّةً أُخْرَى بِإِتْقَانٍ يَا بَطَل!', 'letter_ghayn_sound');
    };

    window.setGhaynCanvasColor = function(color) {
        ghaynBrushColor = color;
    };

    window.setGhaynCanvasSize = function(size) {
        ghaynBrushSize = size;
    };

    /* ========================================================
       القسم 7: اختبار التحدي التفاعلي لدرس حرف الغين
    ======================================================== */
    const ghaynQuizQuestions = [
        {
            question: "مَا هُوَ صَوْتُ حَرْفِ الْغَيْنِ النَّقِيّ؟",
            audio: "letter_ghayn_sound",
            options: ["غْ... اِغْـ", "قْ... اِقْـ", "خْ... اِخْـ"],
            correct: 0,
            hint: "اسْتَمِعْ لِصَوْتِ الْغَيْنِ الْحَلْقِيِّ الْمُفَخَّم!"
        },
        {
            question: "أَيُّ كَلِمَةٍ تَبْدَأُ بِحَرْفِ الْغَيْنِ (غـ)؟",
            audio: "letter_ghayn_word_ghazaal",
            options: ["قَلَمٌ", "غَزَالٌ", "خَرُوفٌ"],
            correct: 1,
            hint: "حَيَوَانٌ رَشِيقٌ يَعِيشُ فِي الْغَابَة!"
        },
        {
            question: "مَا هُوَ مَقْطَعُ الْمَدِّ الطَّوِيلِ فِي كَلِمَةِ (غَابَةٌ)؟",
            audio: "letter_ghayn_long_aa",
            options: ["غُو", "غِيـ", "غَا"],
            correct: 2,
            hint: "غَيْن مَعَ مَدِّ الأَلِف!"
        },
        {
            question: "أَيْنَ يَقَعُ حَرْفُ الْغَيْنِ فِي كَلِمَةِ (صَمْغٌ)؟",
            audio: "letter_ghayn_word_samgh",
            options: ["فِي آخِرِ الْكَلِمَةِ مُتَّصِل (ـغ)", "فِي أَوَّلِ الْكَلِمَةِ (غـ)", "فِي وَسَطِ الْكَلِمَةِ (ـغـ)"],
            correct: 0,
            hint: "مُتَّصِلٌ فِي نِهَايَةِ الْكَلِمَة!"
        },
        {
            question: "عِنْدَ تَفْكِيكِ كَلِمَةِ (تَغْرِيدٌ) إِلَى مَقَاطِع، مَا هُوَ الْمَقْطَعُ الأَوَّل؟",
            audio: "letter_ghayn_split_taghreed",
            options: ["رِيـ", "تَغْـ", "دٌ"],
            correct: 1,
            hint: "تَاء مَفْتُوحَة مَعَ غَيْن سَاكِنَة!"
        }
    ];

    let currentGhaynQuizIndex = 0;
    let ghaynScore = 0;

    window.initGhaynQuiz = function() {
        currentGhaynQuizIndex = 0;
        ghaynScore = 0;
        showGhaynQuizQuestion();
        playAudio('letter_ghayn_quiz_intro');
    };

    function showGhaynQuizQuestion() {
        const qContainer = document.getElementById('ghaynQuizCard');
        if (!qContainer) return;

        if (currentGhaynQuizIndex >= ghaynQuizQuestions.length) {
            // إنهاء الاختبار والاحتفال
            qContainer.innerHTML = `
                <div style="text-align: center; padding: 24px;">
                    <div style="font-size: 3.5rem; margin-bottom: 12px;">🏆🌟🎉</div>
                    <h3 style="color: #065f46; font-size: 1.6rem; font-weight: 900; margin-bottom: 8px;">مُبَارَكٌ يَا بَطَلَ الْقِرَاءَةِ!</h3>
                    <p style="font-size: 1.15rem; color: #047857; font-weight: 800; margin-bottom: 16px;">
                        أَجَبْتَ عَلَى كَامِلِ الأَسْئِلَةِ بِنَجَاح! نَتِيجَتُكَ: ${ghaynScore} مِنْ ${ghaynQuizQuestions.length} ⭐
                    </p>
                    <button class="btn-primary" onclick="initGhaynQuiz()" style="background: #059669; border-color: #047857;">
                        <span>🔄</span> <span>إِعَادَةُ التَّحَدِّي</span>
                    </button>
                </div>
            `;
            mascotCelebrates();
            playAudio('letter_ghayn_encourage_super');
            return;
        }

        const q = ghaynQuizQuestions[currentGhaynQuizIndex];
        let optionsHtml = '';
        q.options.forEach((opt, idx) => {
            optionsHtml += `
                <button class="ghayn-quiz-btn" onclick="checkGhaynQuizAnswer(${idx})">
                    <span>${opt}</span>
                </button>
            `;
        });

        qContainer.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; border-bottom: 2px dashed #a7f3d0; padding-bottom: 10px;">
                <span style="font-size: 0.95rem; font-weight: 800; color: #059669;">السُّؤَالُ ${currentGhaynQuizIndex + 1} مِنْ ${ghaynQuizQuestions.length}</span>
                <span style="font-size: 1rem; font-weight: 900; color: #f59e0b;">⭐ النِّقَاط: ${ghaynScore}</span>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 16px;">
                <h4 style="margin: 0; font-size: 1.3rem; font-weight: 900; color: #065f46;">${q.question}</h4>
                <button class="btn-secondary" onclick="playAudio('${q.audio}')" style="padding: 6px 14px; font-size: 0.85rem;">
                    <span>🔊</span> <span>اسْتَمِعْ</span>
                </button>
            </div>
            <div class="ghayn-quiz-options">
                ${optionsHtml}
            </div>
            <div id="ghaynQuizFeedback" style="margin-top: 14px; text-align: center; font-size: 1.1rem; font-weight: 800;"></div>
        `;
    }

    window.checkGhaynQuizAnswer = function(selectedIndex) {
        const q = ghaynQuizQuestions[currentGhaynQuizIndex];
        const fb = document.getElementById('ghaynQuizFeedback');
        if (selectedIndex === q.correct) {
            ghaynScore++;
            mascotCelebrates();
            playAudio('letter_ghayn_correct');
            if (fb) {
                fb.style.color = '#059669';
                fb.innerHTML = '✨ أَحْسَنْتَ يَا بَطَل! إِجَابَةٌ صَحِيحَةٌ!';
            }
            setTimeout(() => {
                currentGhaynQuizIndex++;
                showGhaynQuizQuestion();
            }, 1200);
        } else {
            playAudio('letter_ghayn_wrong');
            if (fb) {
                fb.style.color = '#dc2626';
                fb.innerHTML = '❌ حَاوِلْ مَرَّةً أُخْرَى، اسْتَمِعْ جَيِّدًا!';
            }
        }
    };

    /* ==========================================================================
       الدرس الثاني: حرف الهاء (هـ ، ـهـ ، ـه ، ه) وتطبيقاته وقراءة مِيَاهُ الْمَطَرِ / هِلَالُ الْعِيدِ / نَبِيهٌ يَعْمَلُ (ص ١١٤ - ١١٧)
       ========================================================================== */

    /* ========================================================
       القسم 8: التنقل بين محطات درس حرف الهاء
    ======================================================== */
    window.switchLetterHaStation = function(stationNum) {
        document.querySelectorAll('#view-tab-letter_ha .station-tab').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('#view-tab-letter_ha .letter-ha-station').forEach(el => el.classList.remove('active'));

        const targetStation = document.getElementById('stationHa_' + stationNum);
        const targetBtn = document.getElementById('btnStationHa_' + stationNum);

        if (targetStation) targetStation.classList.add('active');
        if (targetBtn) targetBtn.classList.add('active');

        if (stationNum === 1) {
            mascotSpeak('الْوَحْدَةُ السَّادِسَةُ: الْعَالَمُ مِنْ حَوْلِي! مَعَ دَرْسِ حَرْفِ الْهَاءِ (هـ ، ـهـ ، ـه ، ه) وَتَطْبِيقَاتِهِ (ص ١١٤ - ١١٧)! اِسْتَمِعُوا لِصَوْتِ الْهَاءِ الْحَلْقِيِّ الْمَهْمُوسِ، وَتَعَرَّفُوا عَلَى أَشْكَالِهِ الأَرْبَعَةِ وَكَلِمَاتِ الْكِتَابِ ص ١١٤!', 'letter_ha_intro');
        } else if (stationNum === 2) {
            mascotSpeak('أَصْوَاتُ الْمُدُودِ وَالْمَقَاطِعِ السَّاكِنَةِ لِحَرْفِ الْهَاءِ! قَارِنْ بَيْنَ هَـ ، هُـ ، هِـ وَ هَا ، هُو ، هِيـ، وَمَيِّزْ مَقَاطِعَ: سَهْـ ، مُهْـ ، زَهْـ ، فَهْـ ، وَجْـ ، نَهْـ!', 'letter_ha_act2_intro');
        } else if (stationNum === 3) {
            mascotSpeak('الْتَّحْلِيلُ وَالتَّرْكِيبُ وَتَرْتِيبُ الْجُمَلِ وَالْفِقْرَةِ! حَلِّلْ كَلِمَاتِ (هُدْهُدٌ ، صَهِيلٌ ، مُهَرِّجٌ) بِالتَّصْفِيق، وَرَكِّبِ الْمَقَاطِعَ، وَرَتِّبِ الْجُمَلَ بِإِتْقَان!', 'letter_ha_act5_intro');
        } else if (stationNum === 4) {
            mascotSpeak('مَحَطَّةُ الْقِرَاءَةِ وَالسَّبُّورَةِ وَالنُّصُوصِ التُّرَاثِيَّةِ! اقْرَأْ نَصَّ الْكِتَابِ ص ١١٧، وَالنُّصُوصَ التُّرَاثِيَّةَ الْعِرَاقِيَّةَ الأَصِيلَةَ: مِيَاهُ الْمَطَرِ ، وَهِلَالُ الْعِيدِ ، وَنَبِيهٌ يَعْمَلُ!', 'letter_ha_read_intro');
            setTimeout(initHaCanvas, 100);
        }
    };

    /* ========================================================
       القسم 9: أصوات حرف الهاء الفونيمية والكلمات المصورة
    ======================================================== */
    window.playHaLetterSound = function() {
        mascotCelebrates();
        playAudio('letter_ha_sound');
    };

    window.playHaPhonemeFaseeh = function() {
        mascotCelebrates();
        playAudio('letter_ha_phoneme_faseeh');
    };

    window.playHaWord = function(wordKey) {
        mascotCelebrates();
        const map = {
            'haatif': 'letter_ha_word_haatif',
            'hadiyyah': 'letter_ha_word_hadiyyah',
            'munabbih': 'letter_ha_word_munabbih',
            'sahm': 'letter_ha_word_sahm',
            'zuhoor': 'letter_ha_word_zuhoor',
            'taahi': 'letter_ha_word_taahi',
            'allah': 'letter_ha_word_allah',
            'miah': 'letter_ha_word_miah',
            'hudhud': 'letter_ha_word_hudhud',
            'wajh': 'letter_ha_word_wajh',
            'zahrah': 'letter_ha_word_zahrah',
            'muhr': 'letter_ha_word_muhr',
            'dhahaba': 'letter_ha_word_dhahaba',
            'suhool': 'letter_ha_word_suhool',
            'saheel': 'letter_ha_word_saheel',
            'muharrij': 'letter_ha_word_muharrij',
            'hilaal': 'letter_ha_word_hilaal',
            'hiyaam': 'letter_ha_word_hiyaam',
            'sihaam': 'letter_ha_word_sihaam',
            'hadeel': 'letter_ha_word_hadeel',
            'hadeer': 'letter_ha_word_hadeer',
            'haadi': 'letter_ha_word_haadi',
            'naheed': 'letter_ha_word_naheed',
            'hirrah': 'letter_ha_word_hirrah',
            'fahd': 'letter_ha_word_fahd',
            'nahr': 'letter_ha_word_nahr',
            'nabeeh': 'letter_ha_word_nabeeh',
            'yusaaiduh': 'letter_ha_word_yusaaiduh',
            'abooh': 'letter_ha_word_abooh',
            'hisham': 'letter_ha_word_hisham',
            'huda': 'letter_ha_word_huda',
            'humaam': 'letter_ha_word_humaam',
            'suhaad': 'letter_ha_word_suhaad',
            'mahdi': 'letter_ha_word_mahdi',
            'habata': 'letter_ha_word_habata',
            'haasoob': 'letter_ha_word_haasoob',
            'mufeedah': 'letter_ha_word_mufeedah',
            'shubbaak': 'letter_ha_word_shubbaak',
            'yusafir': 'letter_ha_word_yusafir',
            'buldaan': 'letter_ha_word_buldaan',
            'mukhtalifah': 'letter_ha_word_mukhtalifah',
            'almatar': 'letter_ha_word_almatar',
            'tasqi': 'letter_ha_word_tasqi',
            'alzar': 'letter_ha_word_alzar',
            'yazra': 'letter_ha_word_yazra',
            'raaka': 'letter_ha_word_raaka'
        };
        const audioKey = map[wordKey] || ('letter_ha_word_' + wordKey);
        playAudio(audioKey);
    };

    /* ========================================================
       القسم 10: أصوات الحركات والمدود والمقاطع الساكنة للهاء
    ======================================================== */
    window.playHaVowel = function(type) {
        mascotCelebrates();
        const map = {
            'short_a': 'letter_ha_short_a',
            'short_u': 'letter_ha_short_u',
            'short_i': 'letter_ha_short_i',
            'long_aa': 'letter_ha_long_aa',
            'long_oo': 'letter_ha_long_oo',
            'long_ee': 'letter_ha_long_ee'
        };
        playAudio(map[type] || 'letter_ha_act2_intro');
    };

    window.playHaSyllable = function(sylKey) {
        mascotCelebrates();
        const map = {
            'sah': 'letter_ha_syl_sah',
            'muh': 'letter_ha_syl_muh',
            'zah': 'letter_ha_syl_zah',
            'fah': 'letter_ha_syl_fah',
            'waj': 'letter_ha_syl_waj',
            'nah': 'letter_ha_syl_nah'
        };
        playAudio(map[sylKey] || 'letter_ha_act4_intro');
    };

    /* ========================================================
       القسم 11: التحليل والتركيب والاستبدال الصوتي للهاء
    ======================================================== */
    window.playHaSplit = function(wordKey) {
        mascotCelebrates();
        const map = {
            'hudhud': 'letter_ha_split_hudhud',
            'saheel': 'letter_ha_split_saheel',
            'muharrij': 'letter_ha_split_muharrij'
        };
        playAudio(map[wordKey] || 'letter_ha_act5_intro');
    };

    window.playHaMerge = function(wordKey) {
        mascotCelebrates();
        const map = {
            'hadiyyah': 'letter_ha_merge_hadiyyah',
            'hadeel': 'letter_ha_merge_hadeel',
            'haadi': 'letter_ha_merge_haadi',
            'naheed': 'letter_ha_merge_naheed'
        };
        playAudio(map[wordKey] || 'letter_ha_act7_intro');
    };

    window.playHaSwap = function(swapKey) {
        mascotCelebrates();
        if (swapKey === 'saheel_hilaal') {
            playAudio('letter_ha_word_hilaal');
        } else if (swapKey === 'sihaam_hiyaam') {
            playAudio('letter_ha_word_hiyaam');
        } else {
            playAudio('letter_ha_act6_intro');
        }
    };

    /* ========================================================
       القسم 12: القراءة ونصوص الكتاب والنصوص التراثية للهاء
    ======================================================== */
    window.playHaReadingSentence = function(sentenceKey) {
        mascotCelebrates();
        playAudio(sentenceKey);
    };

    window.playHaStoryFull = function(storyKey) {
        mascotCelebrates();
        const map = {
            'p117': 'letter_ha_read_p117_full',
            'miah': 'letter_ha_story_miah_full',
            'hilaal': 'letter_ha_story_hilaal_full',
            'nabeeh': 'letter_ha_story_nabeeh_full'
        };
        playAudio(map[storyKey] || 'letter_ha_read_intro');
    };

    /* ========================================================
       القسم 13: سبورة تتبع ورسم حرف الهاء (Handwriting Canvas)
    ======================================================== */
    let haCanvas = null;
    let haCtx = null;
    let isDrawingHa = false;
    let haBrushColor = '#0284c7';
    let haBrushSize = 6;

    window.initHaCanvas = function() {
        haCanvas = document.getElementById('haCanvas');
        if (!haCanvas) return;
        haCtx = haCanvas.getContext('2d');

        const rect = haCanvas.getBoundingClientRect();
        haCanvas.width = rect.width || 600;
        haCanvas.height = 240;

        drawHaGuidelines();

        haCanvas.onmousedown = startHaDraw;
        haCanvas.onmousemove = drawHa;
        haCanvas.onmouseup = stopHaDraw;
        haCanvas.onmouseleave = stopHaDraw;

        haCanvas.ontouchstart = function(e) {
            e.preventDefault();
            const touch = e.touches[0];
            startHaDraw({ clientX: touch.clientX, clientY: touch.clientY });
        };
        haCanvas.ontouchmove = function(e) {
            e.preventDefault();
            const touch = e.touches[0];
            drawHa({ clientX: touch.clientX, clientY: touch.clientY });
        };
        haCanvas.ontouchend = stopHaDraw;
    };

    function drawHaGuidelines() {
        if (!haCtx || !haCanvas) return;
        haCtx.clearRect(0, 0, haCanvas.width, haCanvas.height);

        // خط الأساس المنقط
        haCtx.strokeStyle = '#bae6fd';
        haCtx.lineWidth = 2;
        haCtx.setLineDash([8, 8]);
        haCtx.beginPath();
        haCtx.moveTo(20, haCanvas.height * 0.65);
        haCtx.lineTo(haCanvas.width - 20, haCanvas.height * 0.65);
        haCtx.stroke();
        haCtx.setLineDash([]);

        // نصوص تتبع إرشادية خفيفة لأشكال الهاء الأربعة
        haCtx.font = 'bold 72px Cairo, Tahoma, sans-serif';
        haCtx.fillStyle = 'rgba(2, 132, 199, 0.15)';
        haCtx.textAlign = 'center';
        haCtx.textBaseline = 'middle';
        haCtx.fillText('هـ    ـهـ    ـه    ه', haCanvas.width / 2, haCanvas.height * 0.52);
    }

    function startHaDraw(e) {
        isDrawingHa = true;
        const rect = haCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        haCtx.beginPath();
        haCtx.moveTo(x, y);
    }

    function drawHa(e) {
        if (!isDrawingHa) return;
        const rect = haCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        haCtx.strokeStyle = haBrushColor;
        haCtx.lineWidth = haBrushSize;
        haCtx.lineCap = 'round';
        haCtx.lineJoin = 'round';
        haCtx.lineTo(x, y);
        haCtx.stroke();
    }

    function stopHaDraw() {
        isDrawingHa = false;
    }

    window.clearHaCanvas = function() {
        if (!haCtx || !haCanvas) return;
        drawHaGuidelines();
        mascotSpeak('مَسَحْنَا السَّبُّورَة! حَاوِلْ كِتَابَةَ حَرْفِ الْهَاءِ مَرَّةً أُخْرَى بِإِتْقَانٍ يَا بَطَل!', 'letter_ha_sound');
    };

    window.setHaCanvasColor = function(color) {
        haBrushColor = color;
    };

    window.setHaCanvasSize = function(size) {
        haBrushSize = size;
    };

    /* ========================================================
       القسم 14: اختبار التحدي التفاعلي لدرس حرف الهاء (10 أسئلة)
    ======================================================== */
    const haQuizQuestions = [
        {
            question: "مَا هُوَ صَوْتُ حَرْفِ الْهَاءِ الصَّافِي السَّاكِن؟",
            audio: "letter_ha_sound",
            options: ["هْ... اِهْـ", "حْ... اِحْـ", "خْ... اِخْـ"],
            correct: 0,
            hint: "اسْتَمِعْ لِصَوْتِ الْهَاءِ الْحَلْقِيِّ الْمَهْمُوسِ الْمُرَقَّق!"
        },
        {
            question: "أَيُّ كَلِمَةٍ تَبْدَأُ بِحَرْفِ الْهَاءِ (هـ) فِي أَوَّلِهَا؟",
            audio: "letter_ha_word_hadiyyah",
            options: ["مُنَبِّهٌ", "هَدِيَّةٌ", "سَهْمٌ"],
            correct: 1,
            hint: "تَبْدَأُ بِهَاءٍ مَفْتُوحَة (هَـ)!"
        },
        {
            question: "كَيْفَ يُكْتَبُ حَرْفُ الْهَاءِ فِي وَسَطِ الْكَلِمَةِ؟",
            audio: "letter_ha_word_sahm",
            options: ["ـهـ (كَالْفَرَاشَةِ)", "ـه (مُتَّصِلَة)", "ه (مُنْفَصِلَة)"],
            correct: 0,
            hint: "لَهُ جَنَاحَانِ يَتَّصِلُ بِمَا قَبْلَهُ وَمَا بَعْدَهُ!"
        },
        {
            question: "أَيْنَ يَقَعُ حَرْفُ الْهَاءِ فِي كَلِمَةِ (مِيَاهٌ)؟",
            audio: "letter_ha_word_miah",
            options: ["فِي آخِرِ الْكَلِمَةِ مُنْفَصِل (ه)", "فِي أَوَّلِ الْكَلِمَةِ (هـ)", "فِي وَسَطِ الْكَلِمَةِ (ـهـ)"],
            correct: 0,
            hint: "هَاءٌ مُنْفَصِلَةٌ كَالدَّائِرَةِ تَأْتِي بَعْدَ حَرْفِ الأَلِف!"
        },
        {
            question: "مَا هُوَ مَقْطَعُ الْمَدِّ الطَّوِيلِ فِي كَلِمَةِ (هَاتِفٌ)؟",
            audio: "letter_ha_long_aa",
            options: ["هُو", "هِيـ", "هَا"],
            correct: 2,
            hint: "هَاء مَعَ مَدِّ الأَلِف!"
        },
        {
            question: "مَا هُوَ الْمَقْطَعُ السَّاكِنُ فِي كَلِمَةِ (سَهْمٌ)؟",
            audio: "letter_ha_syl_sah",
            options: ["مُهْـ", "سَهْـ", "زَهْـ"],
            correct: 1,
            hint: "سِين مَفْتُوحَة مَعَ هَاء سَاكِنَة!"
        },
        {
            question: "كَمْ مَقْطَعًا صَوْتِيًّا فِي كَلِمَةِ (هُدْهُدٌ)؟",
            audio: "letter_ha_split_hudhud",
            options: ["مَقْطَعَانِ", "٣ مَقَاطِعَ (هُدْ + هُـ + دٌ)", "٤ مَقَاطِعَ"],
            correct: 1,
            hint: "هُدْ... هُـ... دٌ، صَفِّقْ ثَلَاثَ مَرَّات!"
        },
        {
            question: "عِنْدَ اسْتِبْدَالِ حَرْفِ الصَّادِ فِي (صَهِيلٌ) بِالْهَاءِ، مَاذَا نَحْصُل؟",
            audio: "letter_ha_word_hilaal",
            options: ["هِلالٌ", "صَبَّاغٌ", "هُدْهُدٌ"],
            correct: 0,
            hint: "هِلَالُ الْعِيدِ الْمُبَارَك!"
        },
        {
            question: "فِي قِصَّةِ «مِيَاهُ الْمَطَرِ»، مَنْ يُسَاعِدُ أَبُو نَبِيهٍ فِي الزَّرْعِ؟",
            audio: "letter_ha_story_miah_s3",
            options: ["غَسَّانُ", "هِشَامٌ", "نَبِيهٌ"],
            correct: 2,
            hint: "نَبِيهٌ يُسَاعِدُهُ!"
        },
        {
            question: "مَاذَا قَالَ الْعَمُّ مَهْدِيٌّ لِلأَوْلَادِ فِي قِصَّةِ «هِلَالُ الْعِيدِ»؟",
            audio: "letter_ha_story_hilaal_s4",
            options: ["وَعِيدُكُمَا سَعِيدٌ يَا أَوْلَادُ", "شُكْرًا لَكَ يَا نَبِيهُ", "أَنَا عَطْشَانُ"],
            correct: 0,
            hint: "قَالَ الْعَمُّ: وَعِيدُكُمَا سَعِيدٌ يَا أَوْلَادُ!"
        }
    ];

    let currentHaQuizIndex = 0;
    let haScore = 0;

    window.initHaQuiz = function() {
        currentHaQuizIndex = 0;
        haScore = 0;
        showHaQuizQuestion();
        playAudio('letter_ha_quiz_intro');
    };

    function showHaQuizQuestion() {
        const qContainer = document.getElementById('haQuizCard');
        if (!qContainer) return;

        if (currentHaQuizIndex >= haQuizQuestions.length) {
            qContainer.innerHTML = `
                <div style="text-align: center; padding: 24px;">
                    <div style="font-size: 3.5rem; margin-bottom: 12px;">🏆🌟🎉</div>
                    <h3 style="color: #0369a1; font-size: 1.6rem; font-weight: 900; margin-bottom: 8px;">مُبَارَكٌ يَا بَطَلَ الْقِرَاءَةِ!</h3>
                    <p style="font-size: 1.15rem; color: #0284c7; font-weight: 800; margin-bottom: 16px;">
                        أَجَبْتَ عَلَى كَامِلِ الأَسْئِلَةِ بِنَجَاح! نَتِيجَتُكَ: ${haScore} مِنْ ${haQuizQuestions.length} ⭐
                    </p>
                    <button class="btn-primary" onclick="initHaQuiz()" style="background: #0284c7; border-color: #0369a1;">
                        <span>🔄</span> <span>إِعَادَةُ التَّحَدِّي</span>
                    </button>
                </div>
            `;
            mascotCelebrates();
            playAudio('letter_ha_encourage_super');
            return;
        }

        const q = haQuizQuestions[currentHaQuizIndex];
        let optionsHtml = '';
        q.options.forEach((opt, idx) => {
            optionsHtml += `
                <button class="ha-quiz-btn" onclick="checkHaQuizAnswer(${idx})">
                    <span>${opt}</span>
                </button>
            `;
        });

        qContainer.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; border-bottom: 2px dashed #bae6fd; padding-bottom: 10px;">
                <span style="font-size: 0.95rem; font-weight: 800; color: #0284c7;">السُّؤَالُ ${currentHaQuizIndex + 1} مِنْ ${haQuizQuestions.length}</span>
                <span style="font-size: 1rem; font-weight: 900; color: #f59e0b;">⭐ النِّقَاط: ${haScore}</span>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 16px;">
                <h4 style="margin: 0; font-size: 1.3rem; font-weight: 900; color: #0369a1;">${q.question}</h4>
                <button class="btn-secondary" onclick="playAudio('${q.audio}')" style="padding: 6px 14px; font-size: 0.85rem;">
                    <span>🔊</span> <span>اسْتَمِعْ</span>
                </button>
            </div>
            <div class="ha-quiz-options">
                ${optionsHtml}
            </div>
            <div id="haQuizFeedback" style="margin-top: 14px; text-align: center; font-size: 1.1rem; font-weight: 800;"></div>
        `;
    }

    window.checkHaQuizAnswer = function(selectedIndex) {
        const q = haQuizQuestions[currentHaQuizIndex];
        const fb = document.getElementById('haQuizFeedback');
        if (selectedIndex === q.correct) {
            haScore++;
            mascotCelebrates();
            playAudio('letter_ha_correct');
            if (fb) {
                fb.style.color = '#0284c7';
                fb.innerHTML = '✨ أَحْسَنْتَ يَا بَطَل! إِجَابَةٌ صَحِيحَةٌ!';
            }
            setTimeout(() => {
                currentHaQuizIndex++;
                showHaQuizQuestion();
            }, 1200);
        } else {
            playAudio('letter_ha_wrong');
            if (fb) {
                fb.style.color = '#dc2626';
                fb.innerHTML = '❌ حَاوِلْ مَرَّةً أُخْرَى، اسْتَمِعْ جَيِّدًا!';
            }
        }
    };

    /* ========================================================
       القسم 13: التنقل بين محطات درس حرف الذال (ذ) ص 118 - 121
    ======================================================== */
    window.switchLetterDhalStation = function(stationNum) {
        document.querySelectorAll('#view-tab-letter_dhal .station-tab').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('#view-tab-letter_dhal .letter-dhal-station').forEach(el => el.classList.remove('active'));

        const targetStation = document.getElementById('stationDhal_' + stationNum);
        const targetBtn = document.getElementById('btnStationDhal_' + stationNum);

        if (targetStation) targetStation.classList.add('active');
        if (targetBtn) targetBtn.classList.add('active');

        if (stationNum === 1) {
            mascotSpeak('الْوَحْدَةُ السَّادِسَةُ: الْعَالَمُ مِنْ حَوْلِي! مَعَ دَرْسِ حَرْفِ الذَّالِ (ذ) وَتَطْبِيقَاتِهِ (ص ١١٨ - ١٢١)! اِسْتَمِعُوا لِصَوْتِ الذَّالِ اللِّثَوِيِّ الْمَجْهُورِ، وَتَعَرَّفُوا عَلَى كَلِمَاتِ الْكِتَابِ ص ١١٨!', 'letter_dhal_intro');
        } else if (stationNum === 2) {
            mascotSpeak('أَصْوَاتُ الْمُدُودِ وَالْمَقَاطِعِ السَّاكِنَةِ لِحَرْفِ الذَّالِ! قَارِنْ بَيْنَ ذَ ، ذُ ، ذِ وَ ذَا ، ذُو ، ذِيـ، وَمَيِّزْ مَقَاطِعَ: مِذْ ، أُذْ ، جَذْ فِي كَلِمَاتِ: مِذْيَاعٌ ، أُذْنٌ ، جَذْرٌ!', 'letter_dhal_act2_intro');
        } else if (stationNum === 3) {
            mascotSpeak('الْتَّحْلِيلُ وَالتَّرْكِيبُ وَتَرْتِيبُ الْكَلِمَاتِ! حَلِّلْ كَلِمَاتِ (بُذُورٌ ، يُذِيعُ ، تِلْمِيذٌ) بِالتَّصْفِيق، وَاسْتَبْدِلِ الْحُرُوفَ، وَرَكِّبْ كَلِمَاتِ (بَذَلَ ، بَذَرَ ، أُسْتَاذٌ ، مُعَاذٌ)، وَرَتِّبْ جُمْلَةَ مُنْذِرٍ الطَّبَّاخِ وَفِقْرَةَ ذُرَى!', 'letter_dhal_act5_intro');
            setTimeout(() => {
                initDhalOrderSentence();
                initDhalPara();
            }, 100);
        } else if (stationNum === 4) {
            mascotSpeak('مَحَطَّةُ الْقِرَاءَةِ وَالسَّبُّورَةِ وَالنُّصُوصِ التُّرَاثِيَّةِ! اقْرَأْ نَصَّ الْكِتَابِ ص ١٢١: مَعَاذٌ مُعَلِّمٌ ، وَالنَّصَّ التُّرَاثِيَّ الْعِرَاقِيَّ الْخَالِدَ: أُسْتَاذٌ وَتَلَامِيذٌ!', 'letter_dhal_read_intro');
            setTimeout(initDhalCanvas, 100);
            setTimeout(initDhalQuiz, 100);
        }
    };

    /* ========================================================
       القسم 14: أصوات حرف الذال الفونيمية والكلمات المصورة
    ======================================================== */
    window.playDhalLetterSound = function() {
        mascotCelebrates();
        playAudio('letter_dhal_sound');
    };

    window.playDhalPhonemeFaseeh = function() {
        mascotCelebrates();
        playAudio('letter_dhal_phoneme_faseeh');
    };

    window.playDhalWord = function(wordKey) {
        mascotCelebrates();
        const map = {
            'dhayl': 'letter_dhal_word_dhayl',
            'dhubaabah': 'letter_dhal_word_dhubaabah',
            'dhiraa': 'letter_dhal_word_dhiraa',
            'qunfudh': 'letter_dhal_word_qunfudh',
            'udhun': 'letter_dhal_word_udhun',
            'hidhaa': 'letter_dhal_word_hidhaa',
            'budhoor': 'letter_dhal_word_budhoor',
            'mudhee': 'letter_dhal_word_mudhee',
            'dhaqan': 'letter_dhal_word_dhaqan',
            'dhib': 'letter_dhal_word_dhib',
            'midhyaa': 'letter_dhal_word_midhyaa',
            'jadhr': 'letter_dhal_word_jadhr',
            'tilmeedh': 'letter_dhal_word_tilmeedh',
            'yudhee': 'letter_dhal_word_yudhee',
            'yabee': 'letter_dhal_word_yabee',
            'budoor': 'letter_dhal_word_budoor',
            'haadhiq': 'letter_dhal_word_haadhiq',
            'haariq': 'letter_dhal_word_haariq',
            'badhala': 'letter_dhal_word_badhala',
            'badhara': 'letter_dhal_word_badhara',
            'ustaadh': 'letter_dhal_word_ustaadh',
            'muaadh': 'letter_dhal_word_muaadh',
            'mundhir': 'letter_dhal_word_mundhir',
            'tabbaakh': 'letter_dhal_word_tabbaakh',
            'maahir': 'letter_dhal_word_maahir',
            'yatho': 'letter_dhal_word_yatho',
            'taaman': 'letter_dhal_word_taaman',
            'ladheedhan': 'letter_dhal_word_ladheedhan',
            'sihhiyyan': 'letter_dhal_word_sihhiyyan',
            'dhura': 'letter_dhal_word_dhura',
            'tilmeedhah': 'letter_dhal_word_tilmeedhah',
            'dhakiyyah': 'letter_dhal_word_dhakiyyah',
            'tuhibbu': 'letter_dhal_word_tuhibbu',
            'duroosaha': 'letter_dhal_word_duroosaha',
            'madrasataha': 'letter_dhal_word_madrasataha',
            'muallim': 'letter_dhal_word_muallim',
            'yarsumu': 'letter_dhal_word_yarsumu',
            'maa': 'letter_dhal_word_maa',
            'talaameedhih': 'letter_dhal_word_talaameedhih',
            'nabaataat': 'letter_dhal_word_nabaataat',
            'mukhtalifah': 'letter_dhal_word_mukhtalifah',
            'fayarsumoon': 'letter_dhal_word_fayarsumoon',
            'budhooran': 'letter_dhal_word_budhooran',
            'judhooran': 'letter_dhal_word_judhooran',
            'judhooan': 'letter_dhal_word_judhooan',
            'qadeer': 'letter_dhal_word_qadeer',
            'nasheet': 'letter_dhal_word_nasheet',
            'iqra': 'letter_dhal_word_iqra',
            'adhooq': 'letter_dhal_word_adhooq',
            'alasal': 'letter_dhal_word_alasal',
            'ladheedh': 'letter_dhal_word_ladheedh'
        };
        const audioKey = map[wordKey] || ('letter_dhal_word_' + wordKey);
        playAudio(audioKey);
    };

    /* ========================================================
       القسم 15: أصوات المدود والمقاطع الساكنة والتحليل والتركيب
    ======================================================== */
    window.playDhalVowel = function(vowelKey) {
        mascotCelebrates();
        playAudio('letter_dhal_' + vowelKey);
    };

    window.playDhalSyllable = function(sylKey, wordKey) {
        mascotCelebrates();
        playAudio('letter_dhal_syl_' + sylKey);
        if (wordKey) {
            setTimeout(() => {
                playDhalWord(wordKey);
            }, 800);
        }
    };

    window.playDhalSplit = function(wordKey) {
        mascotCelebrates();
        playAudio('letter_dhal_split_' + wordKey);
    };

    window.playDhalMerge = function(wordKey) {
        mascotCelebrates();
        playAudio('letter_dhal_merge_' + wordKey);
    };

    /* ========================================================
       القسم 16: نشاط ترتيب الجملة والفقرة (نشاط 8 و 9)
    ======================================================== */
    const dhalSentenceWords = [
        { id: 1, text: "مُنْذِرٌ", audio: "letter_dhal_word_mundhir" },
        { id: 2, text: "طَبَّاخٌ", audio: "letter_dhal_word_tabbaakh" },
        { id: 3, text: "مَاهِرٌ", audio: "letter_dhal_word_maahir" },
        { id: 4, text: "يَطْهُو", audio: "letter_dhal_word_yatho" },
        { id: 5, text: "طَعَامًا", audio: "letter_dhal_word_taaman" },
        { id: 6, text: "لَذِيذًا", audio: "letter_dhal_word_ladheedhan" },
        { id: 7, text: "وَصِحِّيًّا", audio: "letter_dhal_word_sihhiyyan" }
    ];

    let dhalSelectedOrder = [];

    window.initDhalOrderSentence = function() {
        dhalSelectedOrder = [];
        const container = document.getElementById('dhalOrderWordList');
        const target = document.getElementById('dhalOrderSentenceTarget');
        if (!container || !target) return;

        target.innerHTML = '<span style="color: #94a3b8; font-weight: 600;">(انقر الكلمات أعلاه لتظهر هنا مرتبة...)</span>';

        // ترتيب عشوائي للكلمات المعروضة
        const shuffled = [...dhalSentenceWords].sort(() => Math.random() - 0.5);
        container.innerHTML = '';
        shuffled.forEach(item => {
            const chip = document.createElement('div');
            chip.className = 'dhal-word-chip';
            chip.id = 'dhalChip_' + item.id;
            chip.innerText = item.text;
            chip.onclick = () => selectDhalOrderWord(item);
            container.appendChild(chip);
        });
    };

    function selectDhalOrderWord(item) {
        if (dhalSelectedOrder.some(w => w.id === item.id)) return;

        playAudio(item.audio);
        dhalSelectedOrder.push(item);

        const chip = document.getElementById('dhalChip_' + item.id);
        if (chip) chip.classList.add('selected');

        renderDhalOrderTarget();
    }

    function renderDhalOrderTarget() {
        const target = document.getElementById('dhalOrderSentenceTarget');
        if (!target) return;

        if (dhalSelectedOrder.length === 0) {
            target.innerHTML = '<span style="color: #94a3b8; font-weight: 600;">(انقر الكلمات أعلاه لتظهر هنا مرتبة...)</span>';
            return;
        }

        target.innerHTML = dhalSelectedOrder.map(w => `<span class="dhal-part-pill" style="font-size: 1.15rem; padding: 4px 12px;">${w.text}</span>`).join(' ');
    }

    window.resetDhalOrderSentence = function() {
        initDhalOrderSentence();
    };

    window.checkDhalOrderSentence = function() {
        const target = document.getElementById('dhalOrderSentenceTarget');
        if (!target) return;

        if (dhalSelectedOrder.length < dhalSentenceWords.length) {
            playAudio('letter_dhal_wrong');
            alert('الرجاء اختيار جميع الكلمات لإكمال الجملة!');
            return;
        }

        const isCorrect = dhalSelectedOrder.every((w, idx) => w.id === dhalSentenceWords[idx].id);

        if (isCorrect) {
            mascotCelebrates();
            playAudio('letter_dhal_correct');
            setTimeout(() => {
                playAudio('letter_dhal_order_sentence_full');
            }, 1000);
            target.style.borderColor = '#16a34a';
            target.style.background = '#f0fdf4';
        } else {
            playAudio('letter_dhal_wrong');
            target.style.borderColor = '#dc2626';
            target.style.background = '#fef2f2';
        }
    };

    // ترتيب فقرة نشاط 9
    let dhalParaFirstSelected = null;
    window.selectDhalParaFirst = function(choice) {
        dhalParaFirstSelected = choice;
        const fb = document.getElementById('dhalParaFeedback');
        const c1 = document.getElementById('paraDhalChoice_1');
        const c2 = document.getElementById('paraDhalChoice_2');

        if (choice === 1) { // 1 = ذُرَى تِلْمِيذَةٌ ذَكِيَّةٌ (صحيح)
            mascotCelebrates();
            playAudio('letter_dhal_correct');
            setTimeout(() => {
                playAudio('letter_dhal_order_para_full');
            }, 1200);

            if (c1) {
                c1.style.borderColor = '#16a34a';
                c1.style.background = '#f0fdf4';
            }
            if (c2) {
                c2.style.borderColor = '#d97706';
                c2.style.background = '#fffbeb';
            }
            if (fb) {
                fb.style.color = '#16a34a';
                fb.innerHTML = '✨ رَائِعٌ جِدًّا! التَّرْتِيبُ الصَّحِيحُ: «ذُرَى تِلْمِيذَةٌ ذَكِيَّةٌ. تُحِبُّ دُرُوسَهَا وَمَدْرَسَتَهَا.»';
            }
        } else {
            playAudio('letter_dhal_wrong');
            if (c2) {
                c2.style.borderColor = '#dc2626';
                c2.style.background = '#fef2f2';
            }
            if (fb) {
                fb.style.color = '#dc2626';
                fb.innerHTML = '❌ حَاوِلْ مَرَّةً أُخْرَى! ابْدَأْ بِالْجُمْلَةِ الَّتِي تُعَرِّفُنَا بِـ ذُرَى!';
            }
        }
    };

    window.resetDhalPara = function() {
        dhalParaFirstSelected = null;
        const fb = document.getElementById('dhalParaFeedback');
        const c1 = document.getElementById('paraDhalChoice_1');
        const c2 = document.getElementById('paraDhalChoice_2');
        if (c1) {
            c1.style.borderColor = '#fef3c7';
            c1.style.background = '#ffffff';
        }
        if (c2) {
            c2.style.borderColor = '#fef3c7';
            c2.style.background = '#ffffff';
        }
        if (fb) fb.innerHTML = '';
    };

    /* ========================================================
       القسم 17: سبورة رسم وتتبع حرف الذال (ذ)
    ======================================================== */
    let dhalCanvas, dhalCtx;
    let isDrawingDhal = false;
    let dhalColor = '#d97706';
    let dhalLineWidth = 8;

    window.initDhalCanvas = function() {
        dhalCanvas = document.getElementById('dhalCanvas');
        if (!dhalCanvas) return;
        dhalCtx = dhalCanvas.getContext('2d');

        function resizeDhalCanvas() {
            const rect = dhalCanvas.getBoundingClientRect();
            if (rect.width > 0) {
                dhalCanvas.width = rect.width;
                dhalCanvas.height = 240;
                drawDhalGuide();
            }
        }

        resizeDhalCanvas();
        window.addEventListener('resize', resizeDhalCanvas);

        function getDhalPos(e) {
            const r = dhalCanvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return {
                x: clientX - r.left,
                y: clientY - r.top
            };
        }

        function startDraw(e) {
            isDrawingDhal = true;
            const pos = getDhalPos(e);
            dhalCtx.beginPath();
            dhalCtx.moveTo(pos.x, pos.y);
            e.preventDefault();
        }

        function drawMove(e) {
            if (!isDrawingDhal) return;
            const pos = getDhalPos(e);
            dhalCtx.lineTo(pos.x, pos.y);
            dhalCtx.strokeStyle = dhalColor;
            dhalCtx.lineWidth = dhalLineWidth;
            dhalCtx.lineCap = 'round';
            dhalCtx.lineJoin = 'round';
            dhalCtx.stroke();
            e.preventDefault();
        }

        function endDraw() {
            if (isDrawingDhal) {
                isDrawingDhal = false;
                mascotCelebrates();
            }
        }

        dhalCanvas.onmousedown = startDraw;
        dhalCanvas.onmousemove = drawMove;
        dhalCanvas.onmouseup = endDraw;
        dhalCanvas.onmouseleave = endDraw;

        dhalCanvas.ontouchstart = startDraw;
        dhalCanvas.ontouchmove = drawMove;
        dhalCanvas.ontouchend = endDraw;
    };

    function drawDhalGuide() {
        if (!dhalCtx || !dhalCanvas) return;
        dhalCtx.clearRect(0, 0, dhalCanvas.width, dhalCanvas.height);

        // خط السطر
        dhalCtx.save();
        dhalCtx.strokeStyle = '#fed7aa';
        dhalCtx.lineWidth = 2;
        dhalCtx.setLineDash([6, 6]);
        dhalCtx.beginPath();
        dhalCtx.moveTo(20, dhalCanvas.height * 0.72);
        dhalCtx.lineTo(dhalCanvas.width - 20, dhalCanvas.height * 0.72);
        dhalCtx.stroke();

        // رسم باهت استرشادي لحرف الذال (ذ)
        dhalCtx.font = 'bold 120px "Traditional Arabic", "Amiri", sans-serif';
        dhalCtx.fillStyle = 'rgba(217, 119, 6, 0.16)';
        dhalCtx.textAlign = 'center';
        dhalCtx.textBaseline = 'middle';
        dhalCtx.fillText('ذ', dhalCanvas.width / 2, dhalCanvas.height * 0.52);
        dhalCtx.restore();
    }

    window.clearDhalCanvas = function() {
        drawDhalGuide();
        playAudio('letter_dhal_sound');
    };

    window.setDhalCanvasColor = function(c) {
        dhalColor = c;
    };

    window.setDhalCanvasSize = function(s) {
        dhalLineWidth = s;
    };

    /* ========================================================
       القسم 18: اختبار التحدي التفاعلي لدرس حرف الذال (ذ)
    ======================================================== */
    const dhalQuizQuestions = [
        {
            question: "مَا هُوَ صَوْتُ وَمَخْرَجُ حَرْفِ الذَّالِ (ذ) الصَّافِي؟",
            audio: "letter_dhal_sound",
            options: ["حَلْقِيٌّ مُفَخَّمٌ", "لِثَوِيٌّ مَجْهُورٌ لَطِيفٌ", "شَفَوِيٌّ مَهْمُوسٌ"],
            correct: 1,
            hint: "يَخْرُجُ مِنْ طَرَفِ اللِّسَانِ مَعَ أَطْرَافِ الثَّنَايَا الْعُلْيَا!"
        },
        {
            question: "أَيُّ كَلِمَةٍ تَبْدَأُ بِحَرْفِ الذَّالِ الْمَفْتُوحَةِ (ذَ)؟",
            audio: "letter_dhal_short_a",
            options: ["ذَقَنٌ", "ذُبَابَةٌ", "ذِئْبٌ"],
            correct: 0,
            hint: "ذَ... ذَقَنٌ!"
        },
        {
            question: "مَا هُوَ الْمَقْطَعُ السَّاكِنُ فِي كَلِمَةِ «مِذْيَاعٌ»؟",
            audio: "letter_dhal_syl_midh",
            options: ["مِذْ", "أُذْ", "جَذْ"],
            correct: 0,
            hint: "مِـ + ذْ = مِذْ!"
        },
        {
            question: "عِنْدَ اسْتِبْدَالِ حَرْفِ الذَّالِ بِالْبَاءِ فِي كَلِمَةِ «يَذِيعُ»، نَحْصُلُ عَلَى:",
            audio: "letter_dhal_word_yabee",
            options: ["يَبِيعُ", "بُدُورٌ", "حَارِقٌ"],
            correct: 0,
            hint: "نَسْتَبْدِلُ الذَّالَ بِالْبَاءِ: يَبِيعُ!"
        },
        {
            question: "فِي قِصَّةِ «أُسْتَاذٌ وَتَلَامِيذٌ»، مَاذَا ذَاقَ مُنْذِرٌ؟",
            audio: "letter_dhal_story_ustaadh_s4",
            options: ["الْمَاءَ", "الْعَسَلَ اللَّذِيذَ", "التُّفَّاحَ"],
            correct: 1,
            hint: "قَالَ مُنْذِرٌ: أَنَا أَذُوقُ الْعَسَلَ. الْعَسَلُ لَذِيذٌ!"
        }
    ];

    let currentDhalQuizIndex = 0;
    let dhalScore = 0;

    window.initDhalQuiz = function() {
        currentDhalQuizIndex = 0;
        dhalScore = 0;
        showDhalQuizQuestion();
    };

    function showDhalQuizQuestion() {
        const qContainer = document.getElementById('dhalQuizContainer');
        if (!qContainer) return;

        if (currentDhalQuizIndex >= dhalQuizQuestions.length) {
            qContainer.innerHTML = `
                <div style="text-align: center; padding: 24px;">
                    <div style="font-size: 3.5rem; margin-bottom: 12px;">🏆🍯🌟</div>
                    <h3 style="color: #92400e; font-size: 1.6rem; font-weight: 900; margin-bottom: 8px;">مُبَارَكٌ يَا بَطَلَ الْقِرَاءَةِ!</h3>
                    <p style="font-size: 1.15rem; color: #b45309; font-weight: 800; margin-bottom: 16px;">
                        أَجَبْتَ عَلَى كَامِلِ الأَسْئِلَةِ بِنَجَاح! نَتِيجَتُكَ: ${dhalScore} مِنْ ${dhalQuizQuestions.length} ⭐
                    </p>
                    <button class="btn-primary" onclick="initDhalQuiz()" style="background: #d97706; border-color: #b45309;">
                        <span>🔄</span> <span>إِعَادَةُ التَّحَدِّي</span>
                    </button>
                </div>
            `;
            mascotCelebrates();
            playAudio('letter_dhal_encourage_super');
            return;
        }

        const q = dhalQuizQuestions[currentDhalQuizIndex];
        let optionsHtml = '';
        q.options.forEach((opt, idx) => {
            optionsHtml += `
                <button class="dhal-quiz-btn" onclick="checkDhalQuizAnswer(${idx})">
                    <span>${opt}</span>
                </button>
            `;
        });

        qContainer.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; border-bottom: 2px dashed #fde68a; padding-bottom: 10px;">
                <span style="font-size: 0.95rem; font-weight: 800; color: #b45309;">السُّؤَالُ ${currentDhalQuizIndex + 1} مِنْ ${dhalQuizQuestions.length}</span>
                <span style="font-size: 1rem; font-weight: 900; color: #f59e0b;">⭐ النِّقَاط: ${dhalScore}</span>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 16px;">
                <h4 style="margin: 0; font-size: 1.3rem; font-weight: 900; color: #92400e;">${q.question}</h4>
                <button class="btn-secondary" onclick="playAudio('${q.audio}')" style="padding: 6px 14px; font-size: 0.85rem;">
                    <span>🔊</span> <span>اسْتَمِعْ</span>
                </button>
            </div>
            <div class="dhal-quiz-options">
                ${optionsHtml}
            </div>
            <div id="dhalQuizFeedback" style="margin-top: 14px; text-align: center; font-size: 1.1rem; font-weight: 800;"></div>
        `;
    }

    window.checkDhalQuizAnswer = function(selectedIndex) {
        const q = dhalQuizQuestions[currentDhalQuizIndex];
        const fb = document.getElementById('dhalQuizFeedback');
        if (selectedIndex === q.correct) {
            dhalScore++;
            mascotCelebrates();
            playAudio('letter_dhal_correct');
            if (fb) {
                fb.style.color = '#16a34a';
                fb.innerHTML = '✨ أَحْسَنْتَ يَا بَطَل! إِجَابَةٌ صَحِيحَةٌ!';
            }
            setTimeout(() => {
                currentDhalQuizIndex++;
                showDhalQuizQuestion();
            }, 1200);
        } else {
            playAudio('letter_dhal_wrong');
            if (fb) {
                fb.style.color = '#dc2626';
                fb.innerHTML = '❌ حَاوِلْ مَرَّةً أُخْرَى، اسْتَمِعْ جَيِّدًا!';
            }
        }
    };

    /* ==========================================================================
     * الدرس الرابع: حرف الظاء (ظ) وتطبيقاته وقراءة مُنْتَظَرٌ تَلْمِيذٌ نَشِيطٌ / مَحْفُوظٌ وَظَافِرٌ (ص ١٢٢ - ١٢٥)
     * ========================================================================== */

    /* ========================================================
       القسم 18: التنقل بين محطات درس حرف الظاء الأربعة
    ======================================================== */
    window.switchLetterDhaStation = function(stationNum) {
        document.querySelectorAll('#view-tab-letter_dha .station-tab').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('#view-tab-letter_dha .letter-dha-station').forEach(el => el.classList.remove('active'));

        const targetStation = document.getElementById('stationDha_' + stationNum);
        const targetBtn = document.getElementById('btnStationDha_' + stationNum);

        if (targetStation) targetStation.classList.add('active');
        if (targetBtn) targetBtn.classList.add('active');

        if (stationNum === 1) {
            mascotSpeak('الْوَحْدَةُ السَّادِسَةُ: الْعَالَمُ مِنْ حَوْلِي! مَعَ دَرْسِ حَرْفِ الظَّاءِ (ظ) وَتَطْبِيقَاتِهِ (ص ١٢٢ - ١٢٥)! اِسْتَمِعُوا لِصَوْتِ الظَّاءِ اللِّثَوِيِّ الْمُفَخَّمِ، وَتَعَرَّفُوا عَلَى كَلِمَاتِ الْكِتَابِ ص ١٢٢!', 'letter_dha_intro');
        } else if (stationNum === 2) {
            mascotSpeak('أَصْوَاتُ الْمُدُودِ وَالْمَقَاطِعِ السَّاكِنَةِ لِحَرْفِ الظَّاءِ! قَارِنْ بَيْنَ ظَ ، ظُ ، ظِ وَ ظَا ، ظُو ، ظِيـ، وَمَيِّزْ مَقَاطِعَ: عَظْ ، أَظْ فِي كَلِمَاتِ: عَظْمٌ ، أَظْفُرٌ ، أَظْفَارٌ!', 'letter_dha_act2_intro');
        } else if (stationNum === 3) {
            mascotSpeak('الْتَّحْلِيلُ وَالتَّرْكِيبُ وَتَرْتِيبُ الْكَلِمَاتِ! حَلِّلْ كَلِمَاتِ (حَظِيرَةٌ ، نَاظُورٌ ، نَظَّارَةٌ ، مَحْفَظَةٌ) بِالتَّصْفِيق، وَاسْتَبْدِلِ الْحُرُوفَ، وَرَكِّبْ كَلِمَاتِ (ظَافِرٌ ، حَافِظٌ ، مَحْفَظَةٌ)، وَرَتِّبْ جُمْلَةَ ظَافِرٍ وَفِقْرَةَ ظَفَارَ!', 'letter_dha_act5_intro');
            setTimeout(() => {
                initDhaOrderSentence();
                initDhaPara();
            }, 100);
        } else if (stationNum === 4) {
            mascotSpeak('مَحَطَّةُ الْقِرَاءَةِ وَالسَّبُّورَةِ وَالنُّصُوصِ التُّرَاثِيَّةِ! اقْرَأْ نَصَّ الْكِتَابِ ص ١٢٥: مُنْتَظَرٌ تَلْمِيذٌ نَشِيطٌ ، وَالنَّصَّ التُّرَاثِيَّ الْعِرَاقِيَّ الْخَالِدَ: مَحْفُوظٌ وَظَافِرٌ!', 'letter_dha_read_intro');
            setTimeout(initDhaCanvas, 100);
            setTimeout(initDhaQuiz, 100);
        }
    };

    /* ========================================================
       القسم 19: أصوات حرف الظاء الفونيمية والكلمات المصورة
    ======================================================== */
    window.playDhaLetterSound = function() {
        mascotCelebrates();
        playAudio('letter_dha_sound');
    };

    window.playDhaPhonemeFaseeh = function() {
        mascotCelebrates();
        playAudio('letter_dha_phoneme_faseeh');
    };

    window.playDhaWord = function(wordKey) {
        mascotCelebrates();
        const map = {
            'zaby': 'letter_dha_word_zaby',
            'zibaa': 'letter_dha_word_zibaa',
            'zarf': 'letter_dha_word_zarf',
            'haafiz': 'letter_dha_word_haafiz',
            'azm': 'letter_dha_word_azm',
            'zalama': 'letter_dha_word_zalama',
            'hazeerah': 'letter_dha_word_hazeerah',
            'naazoor': 'letter_dha_word_naazoor',
            'ezaam': 'letter_dha_word_ezaam',
            'zafar': 'letter_dha_word_zafar',
            'zill': 'letter_dha_word_zill',
            'nizaam': 'letter_dha_word_nizaam',
            'azfur': 'letter_dha_word_azfur',
            'azfaar': 'letter_dha_word_azfaar',
            'nazzaarah': 'letter_dha_word_nazzaarah',
            'haseerah': 'letter_dha_word_haseerah',
            'naatoor': 'letter_dha_word_naatoor',
            'zaafir': 'letter_dha_word_zaafir',
            'mahfazah': 'letter_dha_word_mahfazah',
            'yada': 'letter_dha_word_yada',
            'tibbiyyah': 'letter_dha_word_tibbiyyah',
            'likay': 'letter_dha_word_likay',
            'yara': 'letter_dha_word_yara',
            'biwudooh': 'letter_dha_word_biwudooh',
            'zafaar': 'letter_dha_word_zafaar',
            'turabbee': 'letter_dha_word_turabbee',
            'fee': 'letter_dha_word_fee',
            'hayawaanaat': 'letter_dha_word_hayawaanaat',
            'mutanawwiah': 'letter_dha_word_mutanawwiah',
            'indahaa': 'letter_dha_word_indahaa',
            'qitt': 'letter_dha_word_qitt',
            'sinjaab': 'letter_dha_word_sinjaab',
            'jameel': 'letter_dha_word_jameel',
            'muntazar': 'letter_dha_word_muntazar',
            'tilmeedh': 'letter_dha_word_tilmeedh',
            'nasheet': 'letter_dha_word_nasheet',
            'yanaamu': 'letter_dha_word_yanaamu',
            'yastayqizu': 'letter_dha_word_yastayqizu',
            'baakiran': 'letter_dha_word_baakiran',
            'yuhibbu': 'letter_dha_word_yuhibbu',
            'haasoobahu': 'letter_dha_word_haasoobahu',
            'yuhaafizu': 'letter_dha_word_yuhaafizu',
            'ala': 'letter_dha_word_ala',
            'sihhati': 'letter_dha_word_sihhati',
            'aynayh': 'letter_dha_word_aynayh',
            'falaa': 'letter_dha_word_falaa',
            'yalabu': 'letter_dha_word_yalabu',
            'bihi': 'letter_dha_word_bihi',
            'katheeran': 'letter_dha_word_katheeran',
            'mahfooz': 'letter_dha_word_mahfooz',
            'yaqoolu': 'letter_dha_word_yaqoolu',
            'lisadeeqihi': 'letter_dha_word_lisadeeqihi',
            'ihfaz': 'letter_dha_word_ihfaz',
            'duroosaka': 'letter_dha_word_duroosaka',
            'kulla': 'letter_dha_word_kulla',
            'yawm': 'letter_dha_word_yawm',
            'wahaafiz': 'letter_dha_word_wahaafiz',
            'nazaafati': 'letter_dha_word_nazaafati',
            'madrasatika': 'letter_dha_word_madrasatika',
            'annazaafatu': 'letter_dha_word_annazaafatu',
            'mina': 'letter_dha_word_mina',
            'aleemaan': 'letter_dha_word_aleemaan'
        };
        const audioKey = map[wordKey] || ('letter_dha_word_' + wordKey);
        playAudio(audioKey);
    };

    window.playDhaVowel = function(vowelKey) {
        mascotCelebrates();
        playAudio('letter_dha_' + vowelKey);
    };

    window.playDhaSyllable = function(sylKey, wordKey) {
        mascotCelebrates();
        playAudio('letter_dha_syl_' + sylKey);
        setTimeout(() => {
            playAudio('letter_dha_word_' + wordKey);
        }, 1100);
    };

    window.playDhaSplit = function(wordKey) {
        mascotCelebrates();
        playAudio('letter_dha_split_' + wordKey);
    };

    window.playDhaMerge = function(wordKey) {
        mascotCelebrates();
        playAudio('letter_dha_merge_' + wordKey);
    };

    /* ========================================================
       القسم 20: لعبة ترتيب كلمات جملة ظافر (نشاط 8 ص 124)
    ======================================================== */
    const dhaOrderTargetWords = [
        'يَضَعُ',
        'ظَافِرٌ',
        'نَظَّارَةً',
        'طِبِّيَّةً',
        'لِكَيْ',
        'يَرَى',
        'بِوُضُوحٍ'
    ];
    let dhaOrderScrambled = [];
    let dhaOrderCurrent = [];

    window.initDhaOrderSentence = function() {
        const pool = [
            { text: 'يَضَعُ', id: 0 },
            { text: 'ظَافِرٌ', id: 1 },
            { text: 'نَظَّارَةً', id: 2 },
            { text: 'طِبِّيَّةً', id: 3 },
            { text: 'لِكَيْ', id: 4 },
            { text: 'يَرَى', id: 5 },
            { text: 'بِوُضُوحٍ', id: 6 }
        ];
        dhaOrderScrambled = pool.sort(() => Math.random() - 0.5);
        dhaOrderCurrent = [];

        const listEl = document.getElementById('dhaOrderWordList');
        if (!listEl) return;
        listEl.innerHTML = '';

        dhaOrderScrambled.forEach((item, index) => {
            const btn = document.createElement('button');
            btn.className = 'dha-order-word-btn';
            btn.id = 'dhaOrderBtn_' + item.id;
            btn.innerText = item.text;
            btn.onclick = () => selectDhaOrderWord(item);
            listEl.appendChild(btn);
        });

        renderDhaOrderTarget();
    };

    function selectDhaOrderWord(item) {
        if (dhaOrderCurrent.some(w => w.id === item.id)) return;
        dhaOrderCurrent.push(item);
        const btn = document.getElementById('dhaOrderBtn_' + item.id);
        if (btn) btn.classList.add('used');
        renderDhaOrderTarget();
    }

    function renderDhaOrderTarget() {
        const target = document.getElementById('dhaOrderSentenceTarget');
        if (!target) return;
        if (dhaOrderCurrent.length === 0) {
            target.innerHTML = '<span style="color: #94a3b8; font-weight: 600;">(انقر الكلمات أعلاه لتظهر هنا مرتبة...)</span>';
            return;
        }
        target.innerHTML = dhaOrderCurrent.map(w => `<span class="dha-part-pill">${w.text}</span>`).join(' ');
    }

    window.resetDhaOrderSentence = function() {
        initDhaOrderSentence();
    };

    window.checkDhaOrderSentence = function() {
        if (dhaOrderCurrent.length !== dhaOrderTargetWords.length) {
            alert('الرجاء ترتيب جميع الكلمات أولاً!');
            return;
        }
        const userText = dhaOrderCurrent.map(w => w.text).join(' ');
        const correctText = dhaOrderTargetWords.join(' ');

        if (userText === correctText) {
            mascotCelebrates();
            playAudio('letter_dha_correct');
            alert('✨ ممتاز جداً يا بطل! رتبت جملة ظافر بنجاح!');
        } else {
            playAudio('letter_dha_wrong');
            alert('❌ الترتيب غير صحيح، حاول مرة أخرى!');
            resetDhaOrderSentence();
        }
    };

    /* ========================================================
       القسم 21: لعبة ترتيب فقرة ظفار (نشاط 9 ص 125)
    ======================================================== */
    let dhaParaSelectedFirst = null;

    window.initDhaPara = function() {
        dhaParaSelectedFirst = null;
        const c1 = document.getElementById('paraDhaChoice_1');
        const c2 = document.getElementById('paraDhaChoice_2');
        const fb = document.getElementById('dhaParaFeedback');
        if (c1) c1.style.borderColor = '#ccfbf1';
        if (c2) c2.style.borderColor = '#ccfbf1';
        if (fb) fb.innerHTML = '';
    };

    window.selectDhaParaFirst = function(choice) {
        const c1 = document.getElementById('paraDhaChoice_1');
        const c2 = document.getElementById('paraDhaChoice_2');
        const fb = document.getElementById('dhaParaFeedback');

        if (choice === 1) {
            // الجملة الأولى الصحيحة: ظَفَارُ تُرَبِّي فِي حَظِيرَتِهَا حَيَوَانَاتٍ مُتَنَوِّعَةً.
            if (c1) {
                c1.style.borderColor = '#10b981';
                c1.style.background = '#ecfdf5';
            }
            if (c2) {
                c2.style.borderColor = '#99f6e4';
                c2.style.background = '#ffffff';
            }
            if (fb) {
                fb.style.color = '#059669';
                fb.innerHTML = '✨ رَائِعٌ جِدًّا! «ظَفَارُ تُرَبِّي فِي حَظِيرَتِهَا...» هِيَ الْجُمْلَةُ الأُولَى، وَ«عِنْدَهَا ظَبْيٌ...» هِيَ الْجُمْلَةُ الثَّانِيَةُ!';
            }
            mascotCelebrates();
            playAudio('letter_dha_correct');
        } else {
            if (c2) {
                c2.style.borderColor = '#ef4444';
                c2.style.background = '#fef2f2';
            }
            if (fb) {
                fb.style.color = '#dc2626';
                fb.innerHTML = '❌ حَاوِلْ مَرَّةً أُخْرَى! ابْدَأْ بِالْجُمْلَةِ الَّتِي تُعَرِّفُنَا بِمَا تُرَبِّيهِ ظَفَارُ!';
            }
            playAudio('letter_dha_wrong');
        }
    };

    window.resetDhaPara = function() {
        initDhaPara();
    };

    /* ========================================================
       القسم 22: سبورة رسم وتتبع حرف الظاء (HTML5 Canvas)
    ======================================================== */
    let dhaCanvas, dhaCtx;
    let isDrawingDha = false;
    let dhaStrokeColor = '#0d9488';
    let dhaStrokeWidth = 8;

    window.initDhaCanvas = function() {
        dhaCanvas = document.getElementById('dhaCanvas');
        if (!dhaCanvas) return;
        dhaCtx = dhaCanvas.getContext('2d');

        function resizeDhaCanvas() {
            if (!dhaCanvas) return;
            const container = dhaCanvas.parentElement;
            if (container) {
                dhaCanvas.width = container.clientWidth || 500;
                dhaCanvas.height = 240;
                drawDhaGuide();
            }
        }

        resizeDhaCanvas();
        window.addEventListener('resize', resizeDhaCanvas);

        function getDhaPos(e) {
            const r = dhaCanvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return {
                x: clientX - r.left,
                y: clientY - r.top
            };
        }

        function startDraw(e) {
            isDrawingDha = true;
            const pos = getDhaPos(e);
            dhaCtx.beginPath();
            dhaCtx.moveTo(pos.x, pos.y);
            e.preventDefault();
        }

        function drawMove(e) {
            if (!isDrawingDha) return;
            const pos = getDhaPos(e);
            dhaCtx.lineTo(pos.x, pos.y);
            dhaCtx.strokeStyle = dhaStrokeColor;
            dhaCtx.lineWidth = dhaStrokeWidth;
            dhaCtx.lineCap = 'round';
            dhaCtx.lineJoin = 'round';
            dhaCtx.stroke();
            e.preventDefault();
        }

        function endDraw() {
            isDrawingDha = false;
        }

        dhaCanvas.onmousedown = startDraw;
        dhaCanvas.onmousemove = drawMove;
        window.onmouseup = endDraw;

        dhaCanvas.ontouchstart = startDraw;
        dhaCanvas.ontouchmove = drawMove;
        window.ontouchend = endDraw;
    };

    function drawDhaGuide() {
        if (!dhaCtx || !dhaCanvas) return;
        dhaCtx.clearRect(0, 0, dhaCanvas.width, dhaCanvas.height);

        // خط السطر
        dhaCtx.save();
        dhaCtx.strokeStyle = '#99f6e4';
        dhaCtx.lineWidth = 2;
        dhaCtx.setLineDash([6, 6]);
        dhaCtx.beginPath();
        dhaCtx.moveTo(20, dhaCanvas.height * 0.72);
        dhaCtx.lineTo(dhaCanvas.width - 20, dhaCanvas.height * 0.72);
        dhaCtx.stroke();

        // رسم باهت استرشادي لحرف الظاء (ظ)
        dhaCtx.font = 'bold 120px "Traditional Arabic", "Amiri", sans-serif';
        dhaCtx.textAlign = 'center';
        dhaCtx.textBaseline = 'middle';
        dhaCtx.fillStyle = 'rgba(13, 148, 136, 0.18)';
        dhaCtx.fillText('ظ', dhaCanvas.width / 2, dhaCanvas.height * 0.52);

        // سهم توجيهي لكتابة عصا الظاء ونقطتها
        dhaCtx.font = 'bold 14px "Cairo", sans-serif';
        dhaCtx.fillStyle = '#0f766e';
        dhaCtx.fillText('ابدأ من الصدر بيضاوياً ثم اسحب على السطر، وضع العصا والنقطة ✏️', dhaCanvas.width / 2, 28);
        dhaCtx.restore();
    }

    window.clearDhaCanvas = function() {
        drawDhaGuide();
    };

    window.setDhaCanvasColor = function(c) {
        dhaStrokeColor = c;
    };

    window.setDhaCanvasSize = function(s) {
        dhaStrokeWidth = s;
    };

    /* ========================================================
       القسم 23: اختبار التحدي التفاعلي لدرس حرف الظاء
    ======================================================== */
    const dhaQuizQuestions = [
        {
            question: "مَا هُوَ صَوْتُ وَمَخْرَجُ حَرْفِ الظَّاءِ (ظ) الصَّافِي؟",
            audio: "letter_dha_sound",
            options: ["لِثَوِيٌّ مُفَخَّمٌ مُطْبَقٌ", "حَلْقِيٌّ مُرَقَّقٌ", "شَفَوِيٌّ مَهْمُوسٌ"],
            correct: 0,
            hint: "يَخْرُجُ مِنْ طَرَفِ اللِّسَانِ مَعَ أَطْرَافِ الثَّنَايَا الْعُلْيَا مَفْخُومًا مُطْبَقًا!"
        },
        {
            question: "أَيُّ كَلِمَةٍ تَبْدَأُ بِحَرْفِ الظَّاءِ الْمَفْتُوحَةِ (ظَ)؟",
            audio: "letter_dha_short_a",
            options: ["ظَبْيٌ", "ظِلٌّ", "ظُرُوفٌ"],
            correct: 0,
            hint: "ظَ... ظَبْيٌ!"
        },
        {
            question: "مَا هُوَ الْمَقْطَعُ السَّاكِنُ فِي كَلِمَةِ «عَظْمٌ»؟",
            audio: "letter_dha_syl_azm",
            options: ["عَظْ", "أَظْ", "مَحْـ"],
            correct: 0,
            hint: "عَـ + ظْ = عَظْ!"
        },
        {
            question: "عِنْدَ اسْتِبْدَالِ حَرْفِ الظَّاءِ بِالصَّادِ فِي كَلِمَةِ «حَظِيرَةٌ»، نَحْصُلُ عَلَى:",
            audio: "letter_dha_word_haseerah",
            options: ["حَصِيرَةٌ", "نَاطُورٌ", "نَاظُورٌ"],
            correct: 0,
            hint: "نَسْتَبْدِلُ الظَّاءَ بِالصَّادِ: حَصِيرَةٌ!"
        },
        {
            question: "فِي قِرَاءَةِ نَصِّ «مُنْتَظَرٌ تَلْمِيذٌ نَشِيطٌ»، كَيْفَ يُحَافِظُ مُنْتَظَرٌ عَلَى صِحَّةِ عَيْنَيْهِ؟",
            audio: "letter_dha_read_p125_s3",
            options: ["فَلَا يَلْعَبُ بِحَاسُوبِهِ كَثِيرًا", "يَنَامُ مُتَأَخِّرًا", "يَجْلِسُ طَوِيلًا أَمَامَ الشَّاشَةِ"],
            correct: 0,
            hint: "يُحَافِظُ عَلَى صِحَّةِ عَيْنَيْهِ ، فَلَا يَلْعَبُ بِهِ كَثِيرًا!"
        },
        {
            question: "فِي النَّصِّ التُّرَاثِيِّ «مَحْفُوظٌ وَظَافِرٌ»، مَاذَا قَالَ مَحْفُوظٌ لِصَدِيقِهِ ظَافِرٍ؟",
            audio: "letter_dha_story_mahfooz_s3",
            options: ["احْفَظْ دُرُوسَكَ كُلَّ يَوْمٍ ، وَحَافِظْ عَلَى نَظَافَةِ مَدْرَسَتِكَ", "اذْهَبْ إِلَى السُّوقِ", "الْعَبْ كَثِيرًا"],
            correct: 0,
            hint: "احْفَظْ دُرُوسَكَ كُلَّ يَوْمٍ ، وَحَافِظْ عَلَى نَظَافَةِ مَدْرَسَتِكَ!"
        }
    ];

    let currentDhaQuizIndex = 0;
    let dhaScore = 0;

    window.initDhaQuiz = function() {
        currentDhaQuizIndex = 0;
        dhaScore = 0;
        showDhaQuizQuestion();
    };

    function showDhaQuizQuestion() {
        const qContainer = document.getElementById('dhaQuizContainer');
        if (!qContainer) return;

        if (currentDhaQuizIndex >= dhaQuizQuestions.length) {
            qContainer.innerHTML = `
                <div style="text-align: center; padding: 24px;">
                    <div style="font-size: 3.5rem; margin-bottom: 12px;">🏆👓🌟</div>
                    <h3 style="color: #134e4a; font-size: 1.6rem; font-weight: 900; margin-bottom: 8px;">مُبَارَكٌ يَا بَطَلَ الْقِرَاءَةِ!</h3>
                    <p style="font-size: 1.15rem; color: #0f766e; font-weight: 800; margin-bottom: 16px;">
                        أَجَبْتَ عَلَى كَامِلِ الأَسْئِلَةِ بِنَجَاح! نَتِيجَتُكَ: ${dhaScore} مِنْ ${dhaQuizQuestions.length} ⭐
                    </p>
                    <button class="btn-primary" onclick="initDhaQuiz()" style="background: #0d9488; border-color: #0f766e;">
                        <span>🔄</span> <span>إِعَادَةُ التَّحَدِّي</span>
                    </button>
                </div>
            `;
            mascotCelebrates();
            playAudio('letter_dha_encourage_super');
            return;
        }

        const q = dhaQuizQuestions[currentDhaQuizIndex];
        let optionsHtml = '';
        q.options.forEach((opt, idx) => {
            optionsHtml += `
                <button class="dha-quiz-btn" onclick="checkDhaQuizAnswer(${idx})">
                    <span>${opt}</span>
                </button>
            `;
        });

        qContainer.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; border-bottom: 2px dashed #99f6e4; padding-bottom: 10px;">
                <span style="font-size: 0.95rem; font-weight: 800; color: #0f766e;">السُّؤَالُ ${currentDhaQuizIndex + 1} مِنْ ${dhaQuizQuestions.length}</span>
                <span style="font-size: 1rem; font-weight: 900; color: #0d9488;">⭐ النِّقَاط: ${dhaScore}</span>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 16px;">
                <h4 style="margin: 0; font-size: 1.3rem; font-weight: 900; color: #134e4a;">${q.question}</h4>
                <button class="btn-secondary" onclick="playAudio('${q.audio}')" style="padding: 6px 14px; font-size: 0.85rem;">
                    <span>🔊</span> <span>اسْتَمِعْ</span>
                </button>
            </div>
            <div class="dha-quiz-options">
                ${optionsHtml}
            </div>
            <div id="dhaQuizFeedback" style="margin-top: 14px; text-align: center; font-size: 1.1rem; font-weight: 800;"></div>
        `;
    }

    window.checkDhaQuizAnswer = function(selectedIndex) {
        const q = dhaQuizQuestions[currentDhaQuizIndex];
        const fb = document.getElementById('dhaQuizFeedback');
        if (selectedIndex === q.correct) {
            dhaScore++;
            mascotCelebrates();
            playAudio('letter_dha_correct');
            if (fb) {
                fb.style.color = '#10b981';
                fb.innerHTML = '✨ أَحْسَنْتَ يَا بَطَل! إِجَابَةٌ صَحِيحَةٌ!';
            }
            setTimeout(() => {
                currentDhaQuizIndex++;
                showDhaQuizQuestion();
            }, 1200);
        } else {
            playAudio('letter_dha_wrong');
            if (fb) {
                fb.style.color = '#dc2626';
                fb.innerHTML = '❌ حَاوِلْ مَرَّةً أُخْرَى، اسْتَمِعْ جَيِّدًا!';
            }
        }
    };

})();
