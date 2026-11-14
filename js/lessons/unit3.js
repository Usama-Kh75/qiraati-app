/* ==========================================================================
 * منصة قراءتي التفاعلية الذكية - الوحدة الثالثة: ألعابي وحيواناتي (Unit 3 Lessons)
 * إعداد وتطوير: المهندس أسامة خليل هاشم
 * ========================================================================== */

        /* ========================================================
           الوحدة الثالثة: ألعابي وحيواناتي وحرف الطاء وقراءة بط
        ======================================================== */
        function switchUnit3Station(stationNum) {
            document.querySelectorAll('#view-tab-unit3_intro .station-tab').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('#view-tab-unit3_intro .unit3-station').forEach(el => el.classList.remove('active'));

            const targetStation = document.getElementById('stationUnit3_' + stationNum);
            const targetBtn = document.getElementById('btnStationUnit3_' + stationNum);

            if (targetStation) targetStation.classList.add('active');
            if (targetBtn) targetBtn.classList.add('active');

            if (stationNum === 1) {
                mascotSpeak('مرحباً بكم في الوحدة الثالثة: ألعابي وحيواناتي! استمعوا للقصة واستكشفوا الألعاب والطيور الأليفة!', 'unit3_intro_welcome');
            } else if (stationNum === 2) {
                mascotSpeak('المحادثة والتعبير الشفهي! عبّروا عن ألعابكم المفضلة وكيف نرفق بالحيوانات ونطعم الطيور في وطننا!', 'unit3_talk_questions');
            } else if (stationNum === 3) {
                mascotSpeak('تحدي الألعاب والحيوانات! ميزوا بين أسماء الألعاب والطيور، وتصفحوا صفحات الكتاب المدرسي!', 'unit3_talk_toys');
            }
        }

        function playUnit3Story(type) {
            mascotCelebrates();
            if (type === 'full') {
                playAudio('unit3_intro_story_full');
            } else {
                playAudio('unit3_intro_welcome');
            }
        }

        function playUnit3Talk(type) {
            mascotCelebrates();
            if (type === 'toys') {
                playAudio('unit3_talk_toys');
            } else if (type === 'animals') {
                playAudio('unit3_talk_animals');
            } else {
                playAudio('unit3_talk_questions');
            }
        }

        function checkUnit3Quiz(type) {
            const fb = document.getElementById('unit3QuizFeedback');
            mascotCelebrates();
            playAudio('letter_ta_correct');
            if (fb) {
                fb.style.color = '#15803d';
                fb.innerHTML = '🌟 أَحْسَنْتَ يَا عَبْقَرِيّ! إِجَابَةٌ صَحِيحَةٌ وَمُمَيَّزَةٌ!';
            }
        }

        function switchTaStation(stationNum) {
            document.querySelectorAll('#view-tab-letter_ta .station-tab').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('#view-tab-letter_ta .letter-ta-station').forEach(el => el.classList.remove('active'));

            const targetStation = document.getElementById('stationTa' + stationNum);
            const targetBtn = document.getElementById('btnStationTa' + stationNum);

            if (targetStation) targetStation.classList.add('active');
            if (targetBtn) targetBtn.classList.add('active');

            if (stationNum === 1) {
                mascotSpeak('حرف الطاء (طـ ، ط)! حرف مفخم وقوي، انقر على الكلمات المصورة واستمع لصوت الحرف!', 'letter_ta_intro');
            } else if (stationNum === 2) {
                mascotSpeak('أصوات المدود وتمييز الطاء الساكنة! قارن بين طَ طُ طِ و طَا طُو طِيـ، وميز مقاطع (مَطْـ ، مِطْـ ، بِطْـ)!', 'letter_ta_vowels_station');
            } else if (stationNum === 3) {
                mascotSpeak('التحليل والتركيب الصوتي! فكك كلمات (بَطّ ، قُبْطَان ، طَرِيق ، بِسَاط) بالتصفيق، وركب المقاطع لكلمات جديدة!', 'letter_ta_analysis_intro');
            } else if (stationNum === 4) {
                mascotSpeak('قراءة (بَطّ وَطُيُور) والرسم! اقرأ قراءة جهرية فصيحة وتدرب على كتابة حرف الطاء على السبورة!', 'letter_ta_read_intro');
                setTimeout(initTaCanvas, 100);
            }
        }

        function playTaLetterSound() {
            mascotCelebrates();
            playAudio('letter_ta_sound');
        }

        function playTaPhonemeFaseeh() {
            mascotCelebrates();
            playAudio('letter_ta_phoneme_faseeh');
        }

        function playTaWord(word) {
            mascotCelebrates();
            const map = {
                'bat': 'letter_ta_word_bat',
                'tuyoort': 'letter_ta_word_tuyoort',
                'taariq': 'letter_ta_word_taariq',
                'tabeeb': 'letter_ta_word_tabeeb',
                'tifl': 'letter_ta_word_tifl',
                'qubtaan': 'letter_ta_word_qubtaan',
                'bisaat': 'letter_ta_word_bisaat',
                'mitraqah': 'letter_ta_word_mitraqah'
            };
            if (map[word]) playAudio(map[word]);
        }

        function playTaVowel(vowel) {
            mascotCelebrates();
            const map = {
                'short_a': 'letter_ta_short_a',
                'short_u': 'letter_ta_short_u',
                'short_i': 'letter_ta_short_i',
                'long_aa': 'letter_ta_long_aa',
                'long_oo': 'letter_ta_long_oo',
                'long_ee': 'letter_ta_long_ee'
            };
            if (map[vowel]) playAudio(map[vowel]);
        }

        function playTaSyllable(syl) {
            mascotCelebrates();
            const map = {
                'mat': 'letter_ta_syl_mat',
                'mit': 'letter_ta_syl_mit',
                'bit': 'letter_ta_syl_bit'
            };
            if (map[syl]) playAudio(map[syl]);
        }

        function playTaAnalysis(word) {
            mascotCelebrates();
            const map = {
                'bat': 'letter_ta_split_bat',
                'qubtaan': 'letter_ta_split_qubtaan',
                'tareeq': 'letter_ta_split_tareeq',
                'bisaat': 'letter_ta_split_bisaat'
            };
            if (map[word]) playAudio(map[word]);
        }

        function playTaBlend(word) {
            mascotCelebrates();
            const map = {
                'bat': 'letter_ta_merge_bat',
                'taariq': 'letter_ta_merge_taariq',
                'toofaan': 'letter_ta_merge_toofaan',
                'qitaar': 'letter_ta_merge_qitaar',
                'taalib': 'letter_ta_merge_taalib'
            };
            if (map[word]) playAudio(map[word]);
        }

        function playTaReading(verseNum) {
            mascotCelebrates();
            document.querySelectorAll('#view-tab-letter_ta .reading-line-card').forEach(el => el.classList.remove('active'));
            if (verseNum === 0) {
                playAudio('letter_ta_read_full');
            } else {
                const lineEl = document.getElementById('lineTa' + verseNum);
                if (lineEl) lineEl.classList.add('active');
                playAudio('letter_ta_read_s' + verseNum);
            }
        }

        function playTaReadingFatima() {
            mascotCelebrates();
            playAudio('letter_ta_read_fatima_full');
        }

        /* سبورة رسم وتتبع حرف الطاء */
        let taIsDrawing = false;
        let taLastX = 0;
        let taLastY = 0;
        let taDrawColor = '#dc2626';
        let taIsEraser = false;

        function setTaDrawColor(color) {
            taDrawColor = color;
            taIsEraser = false;
        }

        function setTaEraser() {
            taIsEraser = true;
        }

        function clearTaCanvas() {
            const canvas = document.getElementById('taDrawingCanvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawTaCanvasGuides(ctx, canvas);
        }

        function drawTaCanvasGuides(ctx, canvas) {
            ctx.save();
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 6]);
            const baseLine = canvas.height * 0.65;
            ctx.beginPath();
            ctx.moveTo(30, baseLine);
            ctx.lineTo(canvas.width - 30, baseLine);
            ctx.stroke();

            ctx.setLineDash([]);
            ctx.font = 'bold 110px "Segoe UI", Tahoma, sans-serif';
            ctx.fillStyle = 'rgba(2, 132, 199, 0.12)';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('طـ   ط', canvas.width / 2, canvas.height / 2);
            ctx.restore();
        }

        function initTaCanvas() {
            const canvas = document.getElementById('taDrawingCanvas');
            if (!canvas || canvas._initialized) return;
            canvas._initialized = true;
            const ctx = canvas.getContext('2d');
            drawTaCanvasGuides(ctx, canvas);

            function getPos(e) {
                const rect = canvas.getBoundingClientRect();
                const scaleX = canvas.width / rect.width;
                const scaleY = canvas.height / rect.height;
                if (e.touches && e.touches[0]) {
                    return {
                        x: (e.touches[0].clientX - rect.left) * scaleX,
                        y: (e.touches[0].clientY - rect.top) * scaleY
                    };
                }
                return {
                    x: (e.clientX - rect.left) * scaleX,
                    y: (e.clientY - rect.top) * scaleY
                };
            }

            function startDraw(e) {
                e.preventDefault();
                taIsDrawing = true;
                const pos = getPos(e);
                taLastX = pos.x;
                taLastY = pos.y;
            }

            function draw(e) {
                if (!taIsDrawing) return;
                e.preventDefault();
                const pos = getPos(e);
                ctx.beginPath();
                ctx.moveTo(taLastX, taLastY);
                ctx.lineTo(pos.x, pos.y);
                ctx.strokeStyle = taIsEraser ? '#fffaf0' : taDrawColor;
                ctx.lineWidth = taIsEraser ? 24 : 7;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.stroke();
                taLastX = pos.x;
                taLastY = pos.y;
            }

            function stopDraw() {
                taIsDrawing = false;
            }

            canvas.addEventListener('mousedown', startDraw);
            canvas.addEventListener('mousemove', draw);
            window.addEventListener('mouseup', stopDraw);

            canvas.addEventListener('touchstart', startDraw, { passive: false });
            canvas.addEventListener('touchmove', draw, { passive: false });
            window.addEventListener('touchend', stopDraw);
        }

        /* ========================================================
           الوحدة الثالثة: الدرس الثالث - حرف الفاء (فـ ، ف) وقراءة (رِيف)
           إعداد المهندس أسامة خليل هاشم
        ======================================================== */
        function switchFReefStation(stationNum) {
            document.querySelectorAll('#view-tab-letter_f_reef .station-tab').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('#view-tab-letter_f_reef .letter-f-reef-station').forEach(el => el.classList.remove('active'));

            const targetStation = document.getElementById('stationFReef' + stationNum);
            const targetBtn = document.getElementById('btnStationFReef' + stationNum);

            if (targetStation) targetStation.classList.add('active');
            if (targetBtn) targetBtn.classList.add('active');

            if (stationNum === 1) {
                mascotSpeak('الْوَحْدَةُ الثَّالِثَةُ: حَرْفُ الْفَاءِ (فـ ، ف) وَقِرَاءَةُ رِيفِ مَنَاف (ص ٥٧ - ٦٠)! اِسْتَمِعُوا لِصَوْتِ الْفَاءِ النَّقِيِّ وَزُورُوا رِيفَ مَنَافٍ الْجَمِيل!', 'letter_f_reef_intro');
            } else if (stationNum === 2) {
                mascotSpeak('أَصْوَاتُ الْمُدُودِ وَتَمْيِيزُ الْفَاءِ السَّاكِنَة! قَارِنْ بَيْنَ فَـ فُـ فِـ وَ فَا فُو فِيـ، وَمَيِّزْ مَقَاطِعَ: طِفْـ ، حَفْـ ، ضِفْـ!', 'letter_f_reef_vowels_station');
            } else if (stationNum === 3) {
                mascotSpeak('الْتَّحْلِيلُ وَالتَّرْكِيبُ الصَّوْتِيّ! فَكِّكْ كَلِمَاتِ (رِيف ، مَنَاف ، فَارُوق ، مُفِيد) بِالتَّصْفِيق، وَرَكِّبِ الْمَقَاطِعَ لِتَكْوِينِ كَلِمَاتٍ جَدِيدَة!', 'letter_f_reef_analysis_intro');
            } else if (stationNum === 4) {
                mascotSpeak('قِرَاءَةُ (رِيفُ مَنَاف) وَالرَّسْم! اقْرَأْ قِرَاءَةً جَهْرِيَّةً سَلِيمَةً سَطْراً بِسَطْر وَتَدَرَّبْ عَلَى كِتَابَةِ حَرْفِ الْفَاءِ عَلَى السَّبُّورَةِ التَّفَاعُلِيَّة!', 'letter_f_reef_read_intro');
                setTimeout(initFReefCanvas, 100);
            }
        }

        function playFReefLetterSound() {
            mascotCelebrates();
            playAudio('letter_f_reef_sound');
        }

        function playFReefPhonemeFaseeh() {
            mascotCelebrates();
            playAudio('letter_f_reef_phoneme_faseeh');
        }

        function playFReefWord(word) {
            mascotCelebrates();
            const map = {
                'reef': 'letter_f_reef_word_reef',
                'manaf': 'letter_f_reef_word_manaf',
                'farooq': 'letter_f_reef_word_farooq',
                'mufeed': 'letter_f_reef_word_mufeed',
                'baqar': 'letter_f_reef_word_baqar',
                'wazz': 'letter_f_reef_word_wazz',
                'feel': 'letter_f_reef_word_feel',
                'kharoof': 'letter_f_reef_word_kharoof',
                'rafeeq': 'letter_f_reef_word_rafeeq',
                'farasha': 'letter_f_reef_word_farasha',
                'fustan': 'letter_f_reef_word_fustan',
                'miftah': 'letter_f_reef_word_miftah'
            };
            if (map[word]) playAudio(map[word]);
        }

        function playFReefVowel(vowel) {
            mascotCelebrates();
            const map = {
                'short_a': 'letter_f_reef_short_a',
                'short_u': 'letter_f_reef_short_u',
                'short_i': 'letter_f_reef_short_i',
                'long_aa': 'letter_f_reef_long_aa',
                'long_oo': 'letter_f_reef_long_oo',
                'long_ee': 'letter_f_reef_long_ee'
            };
            if (map[vowel]) playAudio(map[vowel]);
        }

        function playFReefSyllable(syl) {
            mascotCelebrates();
            const map = {
                'tif': 'letter_f_reef_syl_tif',
                'haf': 'letter_f_reef_syl_haf',
                'dif': 'letter_f_reef_syl_dif',
                'raf': 'letter_f_reef_syl_raf'
            };
            if (map[syl]) playAudio(map[syl]);
        }

        function playFReefAnalysis(word) {
            mascotCelebrates();
            const map = {
                'reef': 'letter_f_reef_split_reef',
                'manaf': 'letter_f_reef_split_manaf',
                'farooq': 'letter_f_reef_split_farooq',
                'mufeed': 'letter_f_reef_split_mufeed',
                'baqar': 'letter_f_reef_split_baqar'
            };
            if (map[word]) playAudio(map[word]);
        }

        function playFReefBlend(word) {
            mascotCelebrates();
            const map = {
                'reef': 'letter_f_reef_merge_reef',
                'manaf': 'letter_f_reef_merge_manaf',
                'farooq': 'letter_f_reef_merge_farooq',
                'mufeed': 'letter_f_reef_merge_mufeed',
                'baqar': 'letter_f_reef_merge_baqar'
            };
            if (map[word]) playAudio(map[word]);
        }

        function playFReefReading(verseNum) {
            mascotCelebrates();
            document.querySelectorAll('#view-tab-letter_f_reef .reading-line-card').forEach(el => el.classList.remove('active'));
            if (verseNum === 0) {
                playAudio('letter_f_reef_read_full');
            } else {
                const lineEl = document.getElementById('lineFReef' + verseNum);
                if (lineEl) lineEl.classList.add('active');
                playAudio('letter_f_reef_read_s' + verseNum);
            }
        }

        /* سبورة رسم وتتبع حرف الفاء */
        let fReefIsDrawing = false;
        let fReefLastX = 0;
        let fReefLastY = 0;
        let fReefDrawColor = '#15803d';
        let fReefIsEraser = false;

        function setFReefDrawColor(color) {
            fReefDrawColor = color;
            fReefIsEraser = false;
        }

        function setFReefEraser() {
            fReefIsEraser = true;
        }

        function clearFReefCanvas() {
            const canvas = document.getElementById('fReefDrawingCanvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawFReefCanvasGuides(ctx, canvas);
        }

        function drawFReefCanvasGuides(ctx, canvas) {
            ctx.save();
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 6]);
            const baseLine = canvas.height * 0.65;
            ctx.beginPath();
            ctx.moveTo(30, baseLine);
            ctx.lineTo(canvas.width - 30, baseLine);
            ctx.stroke();

            ctx.setLineDash([]);
            ctx.font = 'bold 110px "Segoe UI", Tahoma, sans-serif';
            ctx.fillStyle = 'rgba(21, 128, 61, 0.12)';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('فـ   ف', canvas.width / 2, canvas.height / 2);
            ctx.restore();
        }

        function initFReefCanvas() {
            const canvas = document.getElementById('fReefDrawingCanvas');
            if (!canvas || canvas._initialized) return;
            canvas._initialized = true;
            const ctx = canvas.getContext('2d');
            drawFReefCanvasGuides(ctx, canvas);

            function getPos(e) {
                const rect = canvas.getBoundingClientRect();
                const scaleX = canvas.width / rect.width;
                const scaleY = canvas.height / rect.height;
                if (e.touches && e.touches[0]) {
                    return {
                        x: (e.touches[0].clientX - rect.left) * scaleX,
                        y: (e.touches[0].clientY - rect.top) * scaleY
                    };
                }
                return {
                    x: (e.clientX - rect.left) * scaleX,
                    y: (e.clientY - rect.top) * scaleY
                };
            }

            function startDraw(e) {
                e.preventDefault();
                fReefIsDrawing = true;
                const p = getPos(e);
                fReefLastX = p.x;
                fReefLastY = p.y;
            }

            function doDraw(e) {
                if (!fReefIsDrawing) return;
                e.preventDefault();
                const p = getPos(e);
                ctx.beginPath();
                ctx.moveTo(fReefLastX, fReefLastY);
                ctx.lineTo(p.x, p.y);
                ctx.strokeStyle = fReefIsEraser ? '#ffffff' : fReefDrawColor;
                ctx.lineWidth = fReefIsEraser ? 24 : 8;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.stroke();
                fReefLastX = p.x;
                fReefLastY = p.y;
            }

            function stopDraw(e) {
                fReefIsDrawing = false;
            }

            canvas.addEventListener('mousedown', startDraw);
            canvas.addEventListener('mousemove', doDraw);
            window.addEventListener('mouseup', stopDraw);

            canvas.addEventListener('touchstart', startDraw, { passive: false });
            canvas.addEventListener('touchmove', doDraw, { passive: false });
            window.addEventListener('touchend', stopDraw);
        }

        function checkFReefQuiz(opt) {
            const fb = document.getElementById('fReefQuizFeedback');
            if (opt === 1) {
                mascotCelebrates();
                playAudio('letter_f_reef_correct');
                if (fb) {
                    fb.style.color = '#15803d';
                    fb.innerHTML = '🎉 إِجَابَةٌ نَمُوذَجِيَّةٌ يَا بَطَل! (رِيفٌ) فِيهَا مَدُّ الْيَاءِ (فِيـ)!';
                }
            } else {
                playAudio('letter_f_reef_wrong');
                if (fb) {
                    fb.style.color = '#dc2626';
                    fb.innerHTML = 'حَاوِلْ مَرَّةً ثَانِيَةً يَا بَطَل، اِبْحَثْ عَنِ الْمَدِّ بِالْيَاء (فِيـ).';
                }
            }
        }

        function checkTaQuiz(opt) {
            const fb = document.getElementById('taQuizFeedback');
            if (opt === 1) {
                mascotCelebrates();
                playAudio('letter_ta_correct');
                if (fb) {
                    fb.style.color = '#15803d';
                    fb.innerHTML = '🎉 إِجَابَةٌ نَمُوذَجِيَّةٌ يَا بَطَل! (طَارِقٌ) تَبْدَأُ بِمَدِّ الأَلِفِ (طَا)!';
                }
            } else {
                playAudio('letter_ta_wrong');
                if (fb) {
                    fb.style.color = '#dc2626';
                    fb.innerHTML = 'حَاوِلْ مَرَّةً ثَانِيَةً يَا بَطَل، اِبْحَثْ عَنِ الْمَدِّ بِالأَلِف (طَا).';
                }
            }
        }


        /* ====================================================
           دوال درس حرف القاف وقراءة بُوق نَدِيم (الوحدة الثالثة ص ٦١ - ٦٤)
           ==================================================== */
        function switchQBooqStation(stationNum) {
            document.querySelectorAll('#view-tab-letter_q_booq .station-tab').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('#view-tab-letter_q_booq .letter-q-booq-station').forEach(el => el.classList.remove('active'));

            const targetStation = document.getElementById('stationQBooq' + stationNum);
            const targetBtn = document.getElementById('btnStationQBooq' + stationNum);

            if (targetStation) targetStation.classList.add('active');
            if (targetBtn) targetBtn.classList.add('active');

            if (stationNum === 1) {
                mascotSpeak('الْوَحْدَةُ الثَّالِثَةُ: حَرْفُ الْقَافِ (قـ ، ق) وَقِرَاءَةُ بُوقِ نَدِيم (ص ٦١ - ٦٤)! اِسْتَمِعُوا لِصَوْتِ الْقَافِ الْمُفَخَّمِ وَزُورُوا نَدِيمَ وَالأَبْقَارَ فِي الْمَرْعَى!', 'letter_q_booq_intro');
            } else if (stationNum === 2) {
                mascotSpeak('أَصْوَاتُ الْمُدُودِ وَتَمْيِيزُ الْقَافِ السَّاكِنَة! قَارِنْ بَيْنَ قَـ قُـ قِـ وَ قَا قُو قِيـ، وَمَيِّزْ مَقَاطِعَ: صَقْـ ، حَقْـ ، عَقْـ ، سَقْـ!', 'letter_q_booq_vowels_station');
            } else if (stationNum === 3) {
                mascotSpeak('الْتَّحْلِيلُ وَالتَّرْكِيبُ الصَّوْتِيّ! فَكِّكْ كَلِمَاتِ (بُوق ، نَدِيم ، قَدِيم ، يَقُود ، بَقَر) بِالتَّصْفِيق، وَرَكِّبِ الْمَقَاطِعَ لِتَكْوِينِ كَلِمَاتٍ جَدِيدَة!', 'letter_q_booq_analysis_intro');
            } else if (stationNum === 4) {
                mascotSpeak('قِرَاءَةُ (بُوقُ نَدِيم) وَالرَّسْم! اقْرَأْ قِرَاءَةً جَهْرِيَّةً سَلِيمَةً سَطْراً بِسَطْر وَتَدَرَّبْ عَلَى كِتَابَةِ حَرْفِ الْقَافِ عَلَى السَّبُّورَةِ التَّفَاعُلِيَّة!', 'letter_q_booq_read_intro');
                setTimeout(initQBooqCanvas, 100);
            }
        }

        function playQBooqLetterSound() {
            mascotCelebrates();
            playAudio('letter_q_booq_sound');
        }

        function playQBooqPhonemeFaseeh() {
            mascotCelebrates();
            playAudio('letter_q_booq_phoneme_faseeh');
        }

        function playQBooqWord(word) {
            mascotCelebrates();
            const map = {
                'booq': 'letter_q_booq_word_booq',
                'nadeem': 'letter_q_booq_word_nadeem',
                'qadeem': 'letter_q_booq_word_qadeem',
                'yaqood': 'letter_q_booq_word_yaqood',
                'baqar': 'letter_q_booq_word_baqar',
                'qareeb': 'letter_q_booq_word_qareeb',
                'qalam': 'letter_q_booq_word_qalam',
                'qubbaah': 'letter_q_booq_word_qubbaah',
                'qirsh': 'letter_q_booq_word_qirsh',
                'batreeq': 'letter_q_booq_word_batreeq',
                'saqr': 'letter_q_booq_word_saqr',
                'qaarib': 'letter_q_booq_word_qaarib',
                'nuqood': 'letter_q_booq_word_nuqood',
                'daqeeq': 'letter_q_booq_word_daqeeq',
                'burtuqaal': 'letter_q_booq_word_burtuqaal',
                'qitt': 'letter_q_booq_word_qitt'
            };
            if (map[word]) playAudio(map[word]);
        }

        function playQBooqVowel(vowel) {
            mascotCelebrates();
            const map = {
                'short_a': 'letter_q_booq_short_a',
                'short_u': 'letter_q_booq_short_u',
                'short_i': 'letter_q_booq_short_i',
                'long_aa': 'letter_q_booq_long_aa',
                'long_oo': 'letter_q_booq_long_oo',
                'long_ee': 'letter_q_booq_long_ee'
            };
            if (map[vowel]) playAudio(map[vowel]);
        }

        function playQBooqSyllable(syl) {
            mascotCelebrates();
            const map = {
                'saq': 'letter_q_booq_syl_saq',
                'haq': 'letter_q_booq_syl_haq',
                'aq': 'letter_q_booq_syl_aq',
                'saq2': 'letter_q_booq_syl_saq2'
            };
            if (map[syl]) playAudio(map[syl]);
        }

        function playQBooqAnalysis(word) {
            mascotCelebrates();
            const map = {
                'booq': 'letter_q_booq_split_booq',
                'nadeem': 'letter_q_booq_split_nadeem',
                'qadeem': 'letter_q_booq_split_qadeem',
                'yaqood': 'letter_q_booq_split_yaqood',
                'baqar': 'letter_q_booq_split_baqar',
                'saqf': 'letter_q_booq_split_saqf',
                'minqaar': 'letter_q_booq_split_minqaar'
            };
            if (map[word]) playAudio(map[word]);
        }

        function playQBooqBlend(word) {
            mascotCelebrates();
            const map = {
                'booq': 'letter_q_booq_merge_booq',
                'nadeem': 'letter_q_booq_merge_nadeem',
                'qadeem': 'letter_q_booq_merge_qadeem',
                'yaqood': 'letter_q_booq_merge_yaqood',
                'baqar': 'letter_q_booq_merge_baqar',
                'qaarib': 'letter_q_booq_merge_qaarib',
                'naqeeb': 'letter_q_booq_merge_naqeeb',
                'qaadim': 'letter_q_booq_merge_qaadim'
            };
            if (map[word]) playAudio(map[word]);
        }

        function playQBooqReading(verseNum) {
            mascotCelebrates();
            document.querySelectorAll('#view-tab-letter_q_booq .reading-line-card').forEach(el => el.classList.remove('active'));
            if (verseNum === 0) {
                playAudio('letter_q_booq_read_full');
            } else {
                const lineEl = document.getElementById('lineQBooq' + verseNum);
                if (lineEl) lineEl.classList.add('active');
                playAudio('letter_q_booq_read_s' + verseNum);
            }
        }

        /* سبورة رسم وتتبع حرف القاف */
        let qBooqIsDrawing = false;
        let qBooqLastX = 0;
        let qBooqLastY = 0;
        let qBooqDrawColor = '#b45309';
        let qBooqIsEraser = false;

        function setQBooqDrawColor(color) {
            qBooqDrawColor = color;
            qBooqIsEraser = false;
        }

        function setQBooqEraser() {
            qBooqIsEraser = true;
        }

        function clearQBooqCanvas() {
            const canvas = document.getElementById('qBooqDrawingCanvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawQBooqCanvasGuides(ctx, canvas);
        }

        function drawQBooqCanvasGuides(ctx, canvas) {
            ctx.save();
            ctx.strokeStyle = '#fde68a';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([6, 6]);

            // خط السطر الأساسي
            ctx.beginPath();
            ctx.moveTo(30, canvas.height * 0.58);
            ctx.lineTo(canvas.width - 30, canvas.height * 0.58);
            ctx.stroke();

            // رسم نموذج خفيف منقط لحرف القاف (قـ  ق)
            ctx.font = 'bold 88px Cairo, sans-serif';
            ctx.fillStyle = '#fef08a';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('قـ        ق', canvas.width / 2, canvas.height * 0.52);

            ctx.restore();
        }

        function initQBooqCanvas() {
            const canvas = document.getElementById('qBooqDrawingCanvas');
            if (!canvas || canvas._initialized) return;
            canvas._initialized = true;
            const ctx = canvas.getContext('2d');
            drawQBooqCanvasGuides(ctx, canvas);

            function getPos(e) {
                const rect = canvas.getBoundingClientRect();
                const scaleX = canvas.width / rect.width;
                const scaleY = canvas.height / rect.height;
                let clientX = e.clientX;
                let clientY = e.clientY;
                if (e.touches && e.touches.length > 0) {
                    clientX = e.touches[0].clientX;
                    clientY = e.touches[0].clientY;
                }
                return {
                    x: (clientX - rect.left) * scaleX,
                    y: (clientY - rect.top) * scaleY
                };
            }

            function startDraw(e) {
                e.preventDefault();
                qBooqIsDrawing = true;
                const p = getPos(e);
                qBooqLastX = p.x;
                qBooqLastY = p.y;
            }

            function doDraw(e) {
                if (!qBooqIsDrawing) return;
                e.preventDefault();
                const p = getPos(e);
                ctx.beginPath();
                ctx.moveTo(qBooqLastX, qBooqLastY);
                ctx.lineTo(p.x, p.y);
                ctx.strokeStyle = qBooqIsEraser ? '#fffdfa' : qBooqDrawColor;
                ctx.lineWidth = qBooqIsEraser ? 24 : 8;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.stroke();
                qBooqLastX = p.x;
                qBooqLastY = p.y;
            }

            function stopDraw(e) {
                qBooqIsDrawing = false;
            }

            canvas.addEventListener('mousedown', startDraw);
            canvas.addEventListener('mousemove', doDraw);
            window.addEventListener('mouseup', stopDraw);

            canvas.addEventListener('touchstart', startDraw, { passive: false });
            canvas.addEventListener('touchmove', doDraw, { passive: false });
            window.addEventListener('touchend', stopDraw);
        }

        function checkQBooqQuiz(opt) {
            const fb = document.getElementById('qBooqQuizFeedback');
            if (opt === 1) {
                mascotCelebrates();
                playAudio('letter_q_booq_correct');
                if (fb) {
                    fb.style.color = '#b45309';
                    fb.innerHTML = '🎉 أَحْسَنْتَ يَا بَطَل! كَلِمَةُ (بُـوق) تَنْتَهِي بِحَرْفِ الْقَاف! أَنْتَ مُمْتَاز! ⭐⭐⭐';
                }
            } else {
                playAudio('letter_q_booq_wrong');
                if (fb) {
                    fb.style.color = '#dc2626';
                    fb.innerHTML = '❌ حَاوِلْ مَرَّةً أُخْرَى يَا بَطَل! ابْحَثْ عَنِ الْكَلِمَةِ الَّتِي تَسْمَعُ فِيهَا صَوْتَ (قْ)!';
                }
            }
        }

        
        /* ====================================================
           دوال الدرس السادس: حرف العين (عـ ، ـعـ ، ـع ، ع) وقراءة (سَالِم / سَالِم زَرَّاع) (ص ٦٩ - ٧٢)
           ==================================================== */
        function switchAynSalimStation(stationNum) {
            document.querySelectorAll('#view-tab-letter_ayn .station-tab').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('#view-tab-letter_ayn .letter-ayn-salim-station').forEach(el => el.classList.remove('active'));

            const targetStation = document.getElementById('stationAynSalim' + stationNum);
            const targetBtn = document.getElementById('btnStationAynSalim' + stationNum);

            if (targetStation) targetStation.classList.add('active');
            if (targetBtn) targetBtn.classList.add('active');

            if (stationNum === 1) {
                mascotSpeak('الْوَحْدَةُ الثَّالِثَةُ: حَرْفُ الْعَيْنِ (عـ ، ـعـ ، ـع ، ع) وَقِرَاءَةُ سَالِم زَرَّاع (ص ٦٩ - ٧٢)! اِسْتَمِعُوا لِصَوْتِ الْعَيْنِ الْحَلْقِيِّ النَّقِيِّ وَزُورُوا بُسْتَانَ سَالِمٍ الْوَاسِع!', 'letter_ayn_salim_intro');
            } else if (stationNum === 2) {
                mascotSpeak('أَصْوَاتُ الْمُدُودِ وَالْعَيْنُ السَّاكِنَةُ وَالتَّنْوِين! قَارِنْ بَيْنَ عَـ عُـ عِـ وَ عَا عُو عِيـ، وَمَيِّزْ مَقَاطِعَ: لُعْـ ، نَعْـ ، ثَعْـ ، زَرْعْ، وَتَنْوِينَاتِ الضَّمِّ وَالْفَتْحِ وَالْكَسْر!', 'letter_ayn_salim_vowels_station');
            } else if (stationNum === 3) {
                mascotSpeak('الْتَّحْلِيلُ وَالتَّرْكِيبُ الصَّوْتِيّ! فَكِّكْ كَلِمَاتِ (سَالِم ، زَرَّاع ، بُسْتَان ، وَاسِع ، بَدِيع ، يَزْرَع ، أَبِيع ، الْوَرْد ، الْفُلْفُل) بِالتَّصْفِيق، وَرَكِّبِ الْمَقَاطِعَ لِتَكْوِينِ كَلِمَاتٍ جَدِيدَة!', 'letter_ayn_salim_analysis_intro');
            } else if (stationNum === 4) {
                mascotSpeak('قِرَاءَةُ (سَالِم زَرَّاع) وَعَلَمُ وَطَنِي وَالرَّسْم! اقْرَأْ قِرَاءَةً جَهْرِيَّةً سَلِيمَةً سَطْراً بِسَطْر وَتَدَرَّبْ عَلَى كِتَابَةِ حَرْفِ الْعَيْنِ عَلَى السَّبُّورَةِ التَّفَاعُلِيَّة!', 'letter_ayn_salim_read_intro');
                setTimeout(initAynSalimCanvas, 100);
            }
        }

        function playAynSalimLetterSound() {
            mascotCelebrates();
            playAudio('letter_ayn_salim_sound');
        }

        function playAynSalimPhonemeFaseeh() {
            mascotCelebrates();
            playAudio('letter_ayn_salim_phoneme_faseeh');
        }

        function playAynSalimWord(word) {
            mascotCelebrates();
            const map = {
                'salim': 'letter_ayn_salim_word_salim',
                'zarraa': 'letter_ayn_salim_word_zarraa',
                'bustani': 'letter_ayn_salim_word_bustani',
                'wasi': 'letter_ayn_salim_word_wasi',
                'badee': 'letter_ayn_salim_word_badee',
                'yaqool': 'letter_ayn_salim_word_yaqool',
                'abi': 'letter_ayn_salim_word_abi',
                'yazra': 'letter_ayn_salim_word_yazra',
                'ward': 'letter_ayn_salim_word_ward',
                'fulful': 'letter_ayn_salim_word_fulful',
                'ana': 'letter_ayn_salim_word_ana',
                'abee': 'letter_ayn_salim_word_abee',
                'alam': 'letter_ayn_salim_word_alam',
                'ood': 'letter_ayn_salim_word_ood',
                'inab': 'letter_ayn_salim_word_inab',
                'usfoor': 'letter_ayn_salim_word_usfoor',
                'naanaa': 'letter_ayn_salim_word_naanaa',
                'thalab': 'letter_ayn_salim_word_thalab',
                'lubah': 'letter_ayn_salim_word_lubah',
                'maan': 'letter_ayn_salim_word_maan',
                'nab': 'letter_ayn_salim_word_nab',
                'rabee': 'letter_ayn_salim_word_rabee',
                'zhiraa': 'letter_ayn_salim_word_zhiraa',
                'mizhyaa': 'letter_ayn_salim_word_mizhyaa',
                'shaari': 'letter_ayn_salim_word_shaari',
                'aamir': 'letter_ayn_salim_word_aamir',
                'marfooa': 'letter_ayn_salim_word_marfooa',
                'aaliya': 'letter_ayn_salim_word_aaliya',
                'aalim': 'letter_ayn_salim_word_aalim',
                'izaam': 'letter_ayn_salim_word_izaam',
                'isba': 'letter_ayn_salim_word_isba',
                'shulah': 'letter_ayn_salim_word_shulah',
                'eadaan': 'letter_ayn_salim_word_eadaan',
                'naama': 'letter_ayn_salim_word_naama',
                'iraq': 'letter_ayn_salim_word_iraq',
                'nalab': 'letter_ayn_salim_word_nalab'
            };
            if (map[word]) playAudio(map[word]);
        }

        function playAynSalimVowel(vowel) {
            mascotCelebrates();
            const map = {
                'short_a': 'letter_ayn_salim_short_a',
                'short_u': 'letter_ayn_salim_short_u',
                'short_i': 'letter_ayn_salim_short_i',
                'long_aa': 'letter_ayn_salim_long_aa',
                'long_oo': 'letter_ayn_salim_long_oo',
                'long_ee': 'letter_ayn_salim_long_ee'
            };
            if (map[vowel]) playAudio(map[vowel]);
        }

        function playAynSalimSyllable(syl) {
            mascotCelebrates();
            const map = {
                'lua': 'letter_ayn_salim_syl_lua',
                'naa': 'letter_ayn_salim_syl_naa',
                'thaa': 'letter_ayn_salim_syl_thaa',
                'zar': 'letter_ayn_salim_syl_zar',
                'tanween_dham': 'letter_ayn_salim_tanween_dham',
                'tanween_fath': 'letter_ayn_salim_tanween_fath',
                'tanween_kasr': 'letter_ayn_salim_tanween_kasr'
            };
            if (map[syl]) playAudio(map[syl]);
        }

        function playAynSalimAnalysis(word) {
            mascotCelebrates();
            const map = {
                'salim': 'letter_ayn_salim_split_salim',
                'zarraa': 'letter_ayn_salim_split_zarraa',
                'wasi': 'letter_ayn_salim_split_wasi',
                'badee': 'letter_ayn_salim_split_badee',
                'yazra': 'letter_ayn_salim_split_yazra',
                'ward': 'letter_ayn_salim_split_ward',
                'fulful': 'letter_ayn_salim_split_fulful',
                'abee': 'letter_ayn_salim_split_abee',
                'alam': 'letter_ayn_salim_split_alam',
                'aamir': 'letter_ayn_salim_split_aamir',
                'naanaa': 'letter_ayn_salim_split_naanaa',
                'thalab': 'letter_ayn_salim_split_thalab'
            };
            if (map[word]) playAudio(map[word]);
        }

        function playAynSalimMerge(word) {
            mascotCelebrates();
            const map = {
                'salim': 'letter_ayn_salim_merge_salim',
                'zarraa': 'letter_ayn_salim_merge_zarraa',
                'wasi': 'letter_ayn_salim_merge_wasi',
                'badee': 'letter_ayn_salim_merge_badee',
                'yazra': 'letter_ayn_salim_merge_yazra',
                'abee': 'letter_ayn_salim_merge_abee',
                'alam': 'letter_ayn_salim_merge_alam',
                'aamir': 'letter_ayn_salim_merge_aamir',
                'saala': 'letter_ayn_salim_merge_saala',
                'thalab': 'letter_ayn_salim_merge_thalab'
            };
            if (map[word]) playAudio(map[word]);
        }

        function playAynSalimReadingLine(verseNum) {
            document.querySelectorAll('#view-tab-letter_ayn .reading-line-card').forEach(el => el.classList.remove('active'));
            if (verseNum === 0) {
                mascotCelebrates();
                playAudio('letter_ayn_salim_read_full');
            } else {
                mascotCelebrates();
                const card = document.getElementById('lineAynSalim' + verseNum);
                if (card) card.classList.add('active');
                playAudio('letter_ayn_salim_read_s' + verseNum);
            }
        }

        /* سبورة رسم وتتبع حرف العين التفاعلية */
        let aynSalimCanvas, aynSalimCtx, aynSalimDrawing = false;
        let aynSalimDrawColor = '#059669';
        let aynSalimIsEraser = false;

        function initAynSalimCanvas() {
            aynSalimCanvas = document.getElementById('canvasAynSalim');
            if (!aynSalimCanvas) return;
            aynSalimCtx = aynSalimCanvas.getContext('2d');

            function getTouchPos(e) {
                const rect = aynSalimCanvas.getBoundingClientRect();
                const touch = e.touches[0] || e.changedTouches[0];
                return {
                    x: (touch.clientX - rect.left) * (aynSalimCanvas.width / rect.width),
                    y: (touch.clientY - rect.top) * (aynSalimCanvas.height / rect.height)
                };
            }

            function startDraw(x, y) {
                aynSalimDrawing = true;
                aynSalimCtx.beginPath();
                aynSalimCtx.moveTo(x, y);
            }
            function draw(x, y) {
                if (!aynSalimDrawing) return;
                aynSalimCtx.lineWidth = aynSalimIsEraser ? 24 : 10;
                aynSalimCtx.lineCap = 'round';
                aynSalimCtx.lineJoin = 'round';
                aynSalimCtx.strokeStyle = aynSalimIsEraser ? '#ffffff' : aynSalimDrawColor;
                aynSalimCtx.lineTo(x, y);
                aynSalimCtx.stroke();
            }
            function stopDraw() {
                aynSalimDrawing = false;
            }

            aynSalimCanvas.onmousedown = (e) => startDraw(e.offsetX, e.offsetY);
            aynSalimCanvas.onmousemove = (e) => draw(e.offsetX, e.offsetY);
            aynSalimCanvas.onmouseup = stopDraw;
            aynSalimCanvas.onmouseleave = stopDraw;

            aynSalimCanvas.ontouchstart = (e) => { e.preventDefault(); const p = getTouchPos(e); startDraw(p.x, p.y); };
            aynSalimCanvas.ontouchmove = (e) => { e.preventDefault(); const p = getTouchPos(e); draw(p.x, p.y); };
            aynSalimCanvas.ontouchend = stopDraw;

            clearAynSalimCanvas();
        }

        function clearAynSalimCanvas() {
            if (!aynSalimCanvas || !aynSalimCtx) return;
            aynSalimCtx.clearRect(0, 0, aynSalimCanvas.width, aynSalimCanvas.height);
            aynSalimCtx.fillStyle = '#ffffff';
            aynSalimCtx.fillRect(0, 0, aynSalimCanvas.width, aynSalimCanvas.height);

            // خطوط السطر الإرشادي
            aynSalimCtx.save();
            aynSalimCtx.strokeStyle = '#ef4444';
            aynSalimCtx.lineWidth = 3;
            aynSalimCtx.beginPath();
            aynSalimCtx.moveTo(20, 160);
            aynSalimCtx.lineTo(aynSalimCanvas.width - 20, 160);
            aynSalimCtx.stroke();

            // خط علوي منقط
            aynSalimCtx.setLineDash([8, 6]);
            aynSalimCtx.strokeStyle = '#94a3b8';
            aynSalimCtx.lineWidth = 1.5;
            aynSalimCtx.beginPath();
            aynSalimCtx.moveTo(20, 90);
            aynSalimCtx.lineTo(aynSalimCanvas.width - 20, 90);
            aynSalimCtx.stroke();

            // خط سفلي منقط
            aynSalimCtx.beginPath();
            aynSalimCtx.moveTo(20, 230);
            aynSalimCtx.lineTo(aynSalimCanvas.width - 20, 230);
            aynSalimCtx.stroke();
            aynSalimCtx.restore();

            // رسم خفيف إرشادي لحرف العين
            aynSalimCtx.save();
            aynSalimCtx.fillStyle = '#f1f5f9';
            aynSalimCtx.font = 'bold 100px Arial, sans-serif';
            aynSalimCtx.textAlign = 'center';
            aynSalimCtx.textBaseline = 'middle';
            aynSalimCtx.fillText('عـ   ـعـ   ـع   ع', aynSalimCanvas.width / 2, 150);
            aynSalimCtx.restore();
        }

        function setAynSalimDrawColor(color) {
            aynSalimDrawColor = color;
            aynSalimIsEraser = false;
        }

        function setAynSalimEraser() {
            aynSalimIsEraser = true;
        }

        function checkAynSalimQuiz(opt) {
            const fb = document.getElementById('aynSalimQuizFeedback');
            if (!fb) return;
            if (opt === 1) {
                mascotCelebrates();
                playAudio('letter_ayn_salim_correct');
                setTimeout(() => playAudio('letter_ayn_salim_encourage_super'), 1800);
                fb.style.color = '#059669';
                fb.innerHTML = '🎉 صَحِيحٌ يَا بَطَل! كَلِمَةُ (زَ<span style="color:#059669;">رَّا</span>ع) تَحْتَوِي عَلَى حَرْفِ الْعَيْنِ (ع) الْمُنْفَصِل!';
            } else {
                mascotSpeaks('حَاوِلْ مَرَّةً أُخْرَى!');
                playAudio('letter_ayn_salim_wrong');
                fb.style.color = '#dc2626';
                fb.innerHTML = '❌ حَاوِلْ مَرَّةً أُخْرَى يَا بَطَل! ابْحَثْ عَنِ الْكَلِمَةِ الَّتِي تَسْمَعُ فِيهَا صَوْتَ (عْ)!';
            }
        }

/* ====================================================
           دوال الدرس الخامس: حرف اللام (لـ ، ل) وقراءة (نَبِيل بَقَّال) (ص ٦٥ - ٦٨)
           ==================================================== */
        function switchLNabeelStation(stationNum) {
            document.querySelectorAll('#view-tab-letter_l_nabeel .station-tab').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('#view-tab-letter_l_nabeel .letter-l-nabeel-station').forEach(el => el.classList.remove('active'));

            const targetStation = document.getElementById('stationLNabeel' + stationNum);
            const targetBtn = document.getElementById('btnStationLNabeel' + stationNum);

            if (targetStation) targetStation.classList.add('active');
            if (targetBtn) targetBtn.classList.add('active');

            if (stationNum === 1) {
                mascotSpeak('الْوَحْدَةُ الثَّالِثَةُ: حَرْفُ اللَّامِ (لـ ، ل) وَقِرَاءَةُ نَبِيل بَقَّال (ص ٦٥ - ٦٨)! اِسْتَمِعُوا لِصَوْتِ اللَّامِ الْمُرَقَّقِ وَزُورُوا نَبِيلَ فِي الدُّكَّانِ الْعَامِر!', 'letter_l_nabeel_intro');
            } else if (stationNum === 2) {
                mascotSpeak('أَصْوَاتُ الْمُدُودِ وَتَمْيِيزُ اللَّامِ السَّاكِنَة! قَارِنْ بَيْنَ لَـ لُـ لِـ وَ لَا لُو لِيـ، وَمَيِّزْ مَقَاطِعَ: مَلْـ ، دَلْـ ، فُلْـ ، قُلْـ!', 'letter_l_nabeel_vowels_station');
            } else if (stationNum === 3) {
                mascotSpeak('الْتَّحْلِيلُ وَالتَّرْكِيبُ الصَّوْتِيّ! فَكِّكْ كَلِمَاتِ (نَبِيل ، بَقَّال ، لَبَن ، رُمَّان ، قَلِيل) بِالتَّصْفِيق، وَرَكِّبِ الْمَقَاطِعَ لِتَكْوِينِ كَلِمَاتٍ جَدِيدَة!', 'letter_l_nabeel_analysis_intro');
            } else if (stationNum === 4) {
                mascotSpeak('قِرَاءَةُ (نَبِيل بَقَّال) وَالرَّسْم! اقْرَأْ قِرَاءَةً جَهْرِيَّةً سَلِيمَةً سَطْراً بِسَطْر وَتَدَرَّبْ عَلَى كِتَابَةِ حَرْفِ اللَّامِ عَلَى السَّبُّورَةِ التَّفَاعُلِيَّة!', 'letter_l_nabeel_read_intro');
                setTimeout(initLNabeelCanvas, 100);
            }
        }

        function playLNabeelLetterSound() {
            mascotCelebrates();
            playAudio('letter_l_nabeel_sound');
        }

        function playLNabeelPhonemeFaseeh() {
            mascotCelebrates();
            playAudio('letter_l_nabeel_phoneme_faseeh');
        }

        function playLNabeelWord(word) {
            mascotCelebrates();
            const map = {
                'nabeel': 'letter_l_nabeel_word_nabeel',
                'baqqal': 'letter_l_nabeel_word_baqqal',
                'laban': 'letter_l_nabeel_word_laban',
                'rumman': 'letter_l_nabeel_word_rumman',
                'qaleel': 'letter_l_nabeel_word_qaleel',
                'qulna': 'letter_l_nabeel_word_qulna',
                'ladayna': 'letter_l_nabeel_word_ladayna',
                'qala': 'letter_l_nabeel_word_qala',
                'baladi': 'letter_l_nabeel_word_baladi',
                'bayti': 'letter_l_nabeel_word_bayti',
                'bustani': 'letter_l_nabeel_word_bustani',
                'lubah': 'letter_l_nabeel_word_lubah',
                'lisan': 'letter_l_nabeel_word_lisan',
                'lahm': 'letter_l_nabeel_word_lahm',
                'kalb': 'letter_l_nabeel_word_kalb',
                'haleeb': 'letter_l_nabeel_word_haleeb',
                'quloob': 'letter_l_nabeel_word_quloob',
                'ghazal': 'letter_l_nabeel_word_ghazal',
                'laib': 'letter_l_nabeel_word_laib',
                'qalam': 'letter_l_nabeel_word_qalam',
                'limatha': 'letter_l_nabeel_word_limatha',
                'aalim': 'letter_l_nabeel_word_aalim',
                'fulful': 'letter_l_nabeel_word_fulful',
                'dalw': 'letter_l_nabeel_word_dalw',
                'malab': 'letter_l_nabeel_word_malab',
                'namlah': 'letter_l_nabeel_word_namlah',
                'raml': 'letter_l_nabeel_word_raml',
                'malabis': 'letter_l_nabeel_word_malabis'
            };
            if (map[word]) playAudio(map[word]);
        }

        function playLNabeelVowel(vowel) {
            mascotCelebrates();
            const map = {
                'short_a': 'letter_l_nabeel_short_a',
                'short_u': 'letter_l_nabeel_short_u',
                'short_i': 'letter_l_nabeel_short_i',
                'long_aa': 'letter_l_nabeel_long_aa',
                'long_oo': 'letter_l_nabeel_long_oo',
                'long_ee': 'letter_l_nabeel_long_ee'
            };
            if (map[vowel]) playAudio(map[vowel]);
        }

        function playLNabeelSyllable(syl) {
            mascotCelebrates();
            const map = {
                'mal': 'letter_l_nabeel_syl_mal',
                'dal': 'letter_l_nabeel_syl_dal',
                'ful': 'letter_l_nabeel_syl_ful',
                'qul': 'letter_l_nabeel_syl_qul'
            };
            if (map[syl]) playAudio(map[syl]);
        }

        function playLNabeelAnalysis(word) {
            mascotCelebrates();
            const map = {
                'nabeel': 'letter_l_nabeel_split_nabeel',
                'baqqal': 'letter_l_nabeel_split_baqqal',
                'laban': 'letter_l_nabeel_split_laban',
                'rumman': 'letter_l_nabeel_split_rumman',
                'qaleel': 'letter_l_nabeel_split_qaleel',
                'qulna': 'letter_l_nabeel_split_qulna',
                'qala': 'letter_l_nabeel_split_qala',
                'baladi': 'letter_l_nabeel_split_baladi',
                'namlah': 'letter_l_nabeel_split_namlah',
                'fulful': 'letter_l_nabeel_split_fulful',
                'malab': 'letter_l_nabeel_split_malab'
            };
            if (map[word]) playAudio(map[word]);
        }

        function playLNabeelBlend(word) {
            mascotCelebrates();
            const map = {
                'nabeel': 'letter_l_nabeel_merge_nabeel',
                'baqqal': 'letter_l_nabeel_merge_baqqal',
                'laban': 'letter_l_nabeel_merge_laban',
                'rumman': 'letter_l_nabeel_merge_rumman',
                'qaleel': 'letter_l_nabeel_merge_qaleel',
                'qulna': 'letter_l_nabeel_merge_qulna',
                'qala': 'letter_l_nabeel_merge_qala',
                'baladi': 'letter_l_nabeel_merge_baladi',
                'malabis': 'letter_l_nabeel_merge_malabis'
            };
            if (map[word]) playAudio(map[word]);
        }

        function playLNabeelReading(verseNum) {
            document.querySelectorAll('#view-tab-letter_l_nabeel .reading-line-card').forEach(el => el.classList.remove('active'));
            if (verseNum === 0) {
                mascotCelebrates();
                playAudio('letter_l_nabeel_read_full');
            } else {
                const lineEl = document.getElementById('lineLNabeel' + verseNum);
                if (lineEl) lineEl.classList.add('active');
                playAudio('letter_l_nabeel_read_s' + verseNum);
            }
        }

        /* سبورة رسم وتتبع حرف اللام */
        let lNabeelIsDrawing = false;
        let lNabeelLastX = 0;
        let lNabeelLastY = 0;
        let lNabeelDrawColor = '#1d4ed8';
        let lNabeelIsEraser = false;

        function setLNabeelDrawColor(color) {
            lNabeelDrawColor = color;
            lNabeelIsEraser = false;
        }

        function setLNabeelEraser() {
            lNabeelIsEraser = true;
        }

        function clearLNabeelCanvas() {
            const canvas = document.getElementById('lNabeelDrawingCanvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawLNabeelCanvasGuides(ctx, canvas);
        }

        function drawLNabeelCanvasGuides(ctx, canvas) {
            ctx.save();
            ctx.strokeStyle = '#bfdbfe';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([6, 6]);

            // خط السطر الأساسي
            ctx.beginPath();
            ctx.moveTo(30, canvas.height * 0.58);
            ctx.lineTo(canvas.width - 30, canvas.height * 0.58);
            ctx.stroke();

            // رسم نموذج خفيف منقط لحرف اللام (لـ  ل)
            ctx.font = 'bold 88px Cairo, sans-serif';
            ctx.fillStyle = '#dbeafe';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('لـ        ل', canvas.width / 2, canvas.height * 0.52);

            ctx.restore();
        }

        function initLNabeelCanvas() {
            const canvas = document.getElementById('lNabeelDrawingCanvas');
            if (!canvas || canvas._initialized) return;
            canvas._initialized = true;
            const ctx = canvas.getContext('2d');
            drawLNabeelCanvasGuides(ctx, canvas);

            function getPos(e) {
                const rect = canvas.getBoundingClientRect();
                const scaleX = canvas.width / rect.width;
                const scaleY = canvas.height / rect.height;
                let clientX = e.clientX;
                let clientY = e.clientY;
                if (e.touches && e.touches.length > 0) {
                    clientX = e.touches[0].clientX;
                    clientY = e.touches[0].clientY;
                }
                return {
                    x: (clientX - rect.left) * scaleX,
                    y: (clientY - rect.top) * scaleY
                };
            }

            function startDraw(e) {
                e.preventDefault();
                lNabeelIsDrawing = true;
                const p = getPos(e);
                lNabeelLastX = p.x;
                lNabeelLastY = p.y;
            }

            function doDraw(e) {
                if (!lNabeelIsDrawing) return;
                e.preventDefault();
                const p = getPos(e);
                ctx.beginPath();
                ctx.moveTo(lNabeelLastX, lNabeelLastY);
                ctx.lineTo(p.x, p.y);
                ctx.strokeStyle = lNabeelIsEraser ? '#f8fafc' : lNabeelDrawColor;
                ctx.lineWidth = lNabeelIsEraser ? 24 : 8;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.stroke();
                lNabeelLastX = p.x;
                lNabeelLastY = p.y;
            }

            function stopDraw(e) {
                lNabeelIsDrawing = false;
            }

            canvas.addEventListener('mousedown', startDraw);
            canvas.addEventListener('mousemove', doDraw);
            window.addEventListener('mouseup', stopDraw);

            canvas.addEventListener('touchstart', startDraw, { passive: false });
            canvas.addEventListener('touchmove', doDraw, { passive: false });
            window.addEventListener('touchend', stopDraw);
        }

        function checkLNabeelQuiz(opt) {
            const fb = document.getElementById('lNabeelQuizFeedback');
            if (opt === 1) {
                mascotCelebrates();
                playAudio('letter_l_nabeel_correct');
                if (fb) {
                    fb.style.color = '#1d4ed8';
                    fb.innerHTML = '🎉 أَحْسَنْتَ يَا بَطَل! كَلِمَةُ (لَـبَـن) تَبْدَأُ بِحَرْفِ اللَّام! أَنْتَ مُمْتَاز! ⭐⭐⭐';
                }
            } else {
                playAudio('letter_l_nabeel_wrong');
                if (fb) {
                    fb.style.color = '#dc2626';
                    fb.innerHTML = '❌ حَاوِلْ مَرَّةً أُخْرَى يَا بَطَل! ابْحَثْ عَنِ الْكَلِمَةِ الَّتِي تَسْمَعُ فِيهَا صَوْتَ (لْ)!';
                }
            }
        }

