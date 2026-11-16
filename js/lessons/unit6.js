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
})();
