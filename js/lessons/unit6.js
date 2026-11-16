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
})();
