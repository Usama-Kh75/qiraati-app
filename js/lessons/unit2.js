/* ==========================================================================
 * منصة قراءتي التفاعلية الذكية - الوحدة الثانية: مدرستي (Unit 2 Lessons)
 * إعداد وتطوير: المهندس أسامة خليل هاشم
 * ========================================================================== */

        // ==========================================

        // وظائف الوحدة الثانية: مدرستي - مدخل الوحدة (ص 31)

        // ==========================================

        function switchUnit2Station(stationNum) {

            document.querySelectorAll('.unit2-station').forEach(el => el.style.display = 'none');

            document.querySelectorAll('#view-tab-unit2_intro .station-tab').forEach(el => el.classList.remove('active'));

            const targetStation = document.getElementById('stationUnit2_' + stationNum);

            const targetBtn = document.getElementById('btnStationUnit2_' + stationNum);

            if (targetStation) targetStation.style.display = 'block';

            if (targetBtn) targetBtn.classList.add('active');

            if (stationNum === 1) {

                mascotSpeak('الاستماع لقصة مدرستي الجميلة! استمع للقصة كاملة أو استكشف مرافق المدرسة وأركانها.', 'unit2_welcome');

            } else if (stationNum === 2) {

                mascotSpeak('أنا أتحدث: عبّر عن صور ساحة المدرسة والغرفة الصفية وحسن التعامل مع المعلمة والزملاء، وأجب عن أسئلة فصيح!', 'unit2_q1_desc');

            } else if (stationNum === 3) {

                mascotSpeak('لعبة جولة في المدرسة مع فصيح! انقر على زر ابدأ اللعبة واجب عن الأسئلة يا بطل!', 'unit2_quiz_intro');

            }

        }

        function playSchoolStory(key) {

            mascotCelebrates();

            if (key === 'full') {

                mascotSpeak('🎒 <b>قصة مدرستي الجميلة:</b><br>«أَشْرَقَتْ شَمْسُ الصَّبَاحِ الدَّافِئَة، فَاسْتَيْقَظَ بَاسِمٌ وَرِيمُ بِنَشَاط، وَانْطَلَقَا بِشَوْقٍ إِلَى الْمَدْرَسَة... اصْطَفَّ التَّلَامِيذُ لِتَحِيَّةِ عَلَمِ الْعِرَاقِ الْغَالِي، ثُمَّ دَخَلُوا صُفُوفَهُمْ لِيَبْدَأُوا يَوْماً مَلِيئاً بِالْعِلْمِ وَالْمَحَبَّة!»', 'unit2_school_story_full');

            } else if (key === 'building') {

                mascotSpeak('🏫 <b>بِنَاءُ الْمَدْرَسَةِ وَبَوَّابَتُهَا:</b><br>«مَدْرَسَتُنَا صَرْحٌ جَمِيل، بِنَاؤُهَا كَبِيرٌ وَمُنَظَّم، فِيهَا غُرَفٌ صَفِّيَّةٌ نَظِيفَة، وَسَاحَةٌ وَاسِعَة، وَأَبْوَابُهَا تَفْتَحُ لَنَا طَرِيقَ الْمُسْتَقْبَل!»', 'unit2_facility_building');

            } else if (key === 'yard') {

                mascotSpeak('🌳 <b>سَاحَةُ الْمَدْرَسَةِ وَالْحَدِيقَة:</b><br>«مَكَانٌ رَائِعٌ نَجْتَمِعُ فِيهِ صَبَاحاً لِلِاصْطِفَافِ وَالرِّيَاضَة، وَنَلْعَبُ فِيهِ بِمَحَبَّةٍ وَأَمَانٍ فِي وَقْتِ الِاسْتِرَاحَة، وَنُحَافِظُ عَلَى نَظَافَتِهِ وَأَزْهَارِهِ الْجَمِيلَة!»', 'unit2_facility_yard');

            } else if (key === 'teacher') {

                mascotSpeak('🧑‍🏫 <b>الْمُعَلِّمَةُ الْفَاضِلَة:</b><br>«تُعَلِّمُنَا بِصَبْرٍ وَحَنَان، تُرْشِدُنَا لِحُرُوفِ الْقِرَاءَةِ وَالْكِتَابَة، نَحْتَرِمُهَا وَنَسْتَمِعُ لِتَوْجِيهَاتِهَا، فَهِيَ أُمُّنَا الثَّانِيَةُ فِي الْمَدْرَسَة!»', 'unit2_facility_teacher');

            } else if (key === 'pupils') {

                mascotSpeak('🎒 <b>التَّلَامِيذُ الْمُجْتَهِدُونَ:</b><br>«نَحْنُ أَصْدِقَاءٌ وَإِخْوَة، نَأْتِي إِلَى الْمَدْرَسَةِ بِنَشَاط، نَتَعَاوَنُ مَعاً فِي الصَّفّ، وَنَتَشَارَكُ الْمَعْرِفَةَ بِفَرَحٍ وَإِيثَار!»', 'unit2_facility_pupils');

            }

        }

        function playUnit2StoryScene(sceneKey) {

            mascotCelebrates();

            if (sceneKey === 'yard') {

                mascotSpeak('🌳 <b>الْمَشْهَدُ الْأَوَّل (سَاحَةُ الْمَدْرَسَةِ وَالِاصْطِفَاف):</b><br>«نَقِفُ فِي سَاحَةِ الْمَدْرَسَةِ بِنِظَام، نُحَيِّي عَلَمَ الْعِرَاقِ الْغَالِي، نُرَدِّدُ النَّشِيدَ الْوَطَنِيَّ بِفَخْر، وَنُؤَدِّي التَّمَارِينَ الصَّبَاحِيَّةَ لِنَكُونَ أَقْوِيَاءَ وَأَصِحَّاء!»', 'unit2_story_scene_yard');

            } else if (sceneKey === 'classroom') {

                mascotSpeak('📚 <b>الْمَشْهَدُ الثَّانِي (الْغُرْفَةُ الصَّفِّيَّةُ وَطَلَبُ الْعِلْم):</b><br>«نَجْلِسُ فِي صَفِّنَا بِنِظَامٍ وَهُدُوء، نَسْتَمِعُ لِمُعَلِّمَتِنَا بِانْتِبَاه، نَقْرَأُ الْكُتُبَ، وَنَسْتَأْذِنُ بِرَفْعِ الْيَدِ قَبْلَ أَنْ نَتَكَلَّم!»', 'unit2_story_scene_classroom');

            } else if (sceneKey === 'friends') {

                mascotSpeak('🤝 <b>الْمَشْهَدُ الثَّالِث (حُسْنُ التَّعَامُلِ مَعَ الْمُعَلِّمَةِ وَالزُّمَلَاء):</b><br>«نُعَامِلُ مُعَلِّمَتَنَا بِالتَّقْدِيرِ وَالْوَفَاء، وَنُحِبُّ زُمَلَاءَنَا فِي الصَّفّ، نُسَاعِدُ مَنْ يَحْتَاجُ إِلَى عَوْن، وَنَتَبَادَلُ الْأَدَوَاتِ الْمَدْرَسِيَّةَ بِلُطْف!»', 'unit2_story_scene_friends');

            }

        }

        function playUnit2Question(qNum) {

            mascotCelebrates();

            if (qNum === 1) {

                mascotSpeak('❓ <b>السؤال الأول:</b> أصف ما أشاهده في كل صورة: ساحة المدرسة والاصطفاف الصباحي، الغرفة الصفية المنظمة، وحسن التعامل والتعاون بين الزملاء والمعلمة!', 'unit2_q1_desc');

            } else if (qNum === 2) {

                mascotSpeak('❓ <b>السؤال الثاني:</b> لماذا يجتمع التلاميذ في ساحة المدرسة؟ لتحية علم العراق الغالي، وسماع الإذاعة المدرسية، وأداء التمارين الرياضية الصباحية بنشاط!', 'unit2_q2_yard');

            } else if (qNum === 3) {

                mascotSpeak('❓ <b>السؤال الثالث:</b> تخيل نفسك في هذه الغرفة الصفية ما الأعمال التي تقوم بها؟ أجلس في مقعدي بأدب، أقرأ كتابي، أكتب بخط جميل، أستمع لمعلمتي، وأشارك بفاعلية!', 'unit2_q3_classroom');

            } else if (qNum === 4) {

                mascotSpeak('❓ <b>السؤال الرابع:</b> قدم نصيحة لزميلك: استمع لمعلمتك باحترام وأنصت لشرحها، وكن لطيفاً متعاوناً مع زملائك، فالأخلاق الحسنة عنوان التلميذ الناجح!', 'unit2_q4_advice');

            } else if (qNum === 5) {

                mascotSpeak('📖 <b>السؤال الخامس:</b> أُكوّن قصة: في صباح مشرق، اجتمعنا في الساحة وحيينا العلم بنشاط، ثم دخلنا صفنا المنظم، استمعنا لمعلمتنا وتعاونّا بمحبة، فقضينا يوماً دراسياً ممتعاً!', 'unit2_q5_story');

            }

        }

        let currentUnit2QuizIndex = 0;

        const unit2QuizQuestions = [

            {

                qText: '١. أَيْنَ نَجْتَمِعُ صَبَاحاً لِنُحَيِّيَ عَلَمَ بِلَادِنَا الْغَالِي وَنُمَارِسَ الرِّيَاضَة؟',

                correctKey: 'yard',

                audioKey: 'unit2_quiz_q1'

            },

            {

                qText: '٢. أَيْنَ نَجْلِسُ بِنِظَامٍ لِنَقْرَأَ الْكِتَابَ وَنَكْتُبَ الدُّرُوسَ عَلَى السَّبُّورَة؟',

                correctKey: 'classroom',

                audioKey: 'unit2_quiz_q2'

            },

            {

                qText: '٣. مَاذَا نَفْعَلُ حِينَ يَحْتَاجُ زَمِيلُنَا إِلَى قَلَمٍ أَوْ مُسَاعَدَةٍ فِي الصَّفّ؟',

                correctKey: 'friends',

                audioKey: 'unit2_quiz_q3'

            }

        ];

        function startUnit2Quiz() {

            currentUnit2QuizIndex = 0;

            const promptBox = document.getElementById('unit2QuizPromptText');

            const feedback = document.getElementById('unit2QuizFeedback');

            if (feedback) feedback.style.display = 'none';

            document.querySelectorAll('#unit2QuizOptions .quiz-card').forEach(c => {

                c.style.border = '2px solid #e2e8f0';

                c.style.transform = 'none';

            });

            mascotSpeak('هَيَّا نَلْعَبْ مَعاً لُعْبَةَ جَوْلَتِي فِي الْمَدْرَسَة! اسْتَمِعْ لِلسُّؤَالِ وَاخْتَرْ الصُّورَةَ الْمُنَاسِبَة!', 'unit2_quiz_intro');

            setTimeout(() => {

                loadUnit2QuizQuestion(0);

            }, 5500);

        }

        function loadUnit2QuizQuestion(idx) {

            currentUnit2QuizIndex = idx;

            const q = unit2QuizQuestions[idx];

            const promptBox = document.getElementById('unit2QuizPromptText');

            if (promptBox) {

                promptBox.innerHTML = `❓ <b>${q.qText}</b>`;

                promptBox.style.borderColor = '#2563eb';

                promptBox.style.color = '#1e3a8a';

            }

            document.querySelectorAll('#unit2QuizOptions .quiz-card').forEach(c => {

                c.style.border = '2px solid #e2e8f0';

                c.style.transform = 'none';

                c.style.pointerEvents = 'auto';

            });

            mascotSpeak(q.qText, q.audioKey);

        }

        function answerUnit2Quiz(selectedKey) {

            const q = unit2QuizQuestions[currentUnit2QuizIndex];

            const feedback = document.getElementById('unit2QuizFeedback');

            if (!feedback) return;

            feedback.style.display = 'block';

            if (selectedKey === q.correctKey) {

                mascotCelebrates();

                feedback.innerHTML = '🎉 أَحْسَنْتَ يَا بَطَل! إِجَابَةٌ رَائِعَةٌ وَصَحِيحَة! ⭐⭐⭐';

                feedback.style.color = '#16a34a';

                const matchedCard = document.getElementById('quizCard' + selectedKey.charAt(0).toUpperCase() + selectedKey.slice(1));

                if (matchedCard) {

                    matchedCard.style.border = '3px solid #16a34a';

                    matchedCard.style.transform = 'scale(1.03)';

                }

                mascotSpeak('إِجَابَةٌ رَائِعَةٌ وَصَحِيحَة! أَنْتَ تِلْمِيذٌ مُجْتَهِدٌ وَبَارِعٌ جِدّاً!', 'unit2_quiz_correct');

                setTimeout(() => {

                    if (currentUnit2QuizIndex + 1 < unit2QuizQuestions.length) {

                        loadUnit2QuizQuestion(currentUnit2QuizIndex + 1);

                    } else {

                        feedback.innerHTML = '🏆 مَبْرُوك! لَقَدْ أَتْمَمْتَ جَوْلَةَ الْمَدْرَسَةِ بِنَجَاحٍ بَاهِر! أَنْتَ نَجْمُ الْمَدْرَسَة! 🌟🎓';

                        feedback.style.color = '#15803d';

                        mascotCelebrates();

                    }

                }, 4000);

            } else {

                feedback.innerHTML = '💡 حَاوِلْ مَرَّةً أُخْرَى يَا بَطَل، فَكِّرْ فِي الصُّورَةِ الْمُنَاسِبَة!';

                feedback.style.color = '#dc2626';

            }

        }

    
        /* ========================================================
           منظومة منطق درس حرف الراء (ر) وتركيب كلمة (دَار) (ص 32 - 34)
        ======================================================== */
        let rCanvasInited = false;
        let rDrawing = false;
        let rDrawColor = '#d97706';
        let rIsEraser = false;
        let rLineWidth = 6;

        function switchRStation(stationNum) {
            document.querySelectorAll('.letter-r-station').forEach(el => el.style.display = 'none');
            document.querySelectorAll('#view-tab-letter_r .station-tab').forEach(el => el.classList.remove('active'));

            const targetStation = document.getElementById('stationR' + stationNum);
            const targetBtn = document.getElementById('btnStationR' + stationNum);
            if (targetStation) targetStation.style.display = 'block';
            if (targetBtn) targetBtn.classList.add('active');

            if (stationNum === 1) {
                mascotSpeak('حرف الراء (ر)! انقر على بطاقات الكلمات المصورة واستمع لصوت الحرف!', 'letter_r_intro');
            } else if (stationNum === 2) {
                mascotSpeak('أصوات المد القصيرة والطويلة! قارن بين الفتحة والمد بالألف، والضمة والواو، والكسرة والياء!', 'letter_r_vowels_intro');
            } else if (stationNum === 3) {
                mascotSpeak('المقاطع والتحليل الصوتي! استمع لصوت الراء الساكنة ✊ وحلل كلمات (رِيمُ ، رَمَى ، مَرَامُ ، دَارُ) بالصفقات!', 'letter_r_syllables_intro');
            } else if (stationNum === 4) {
                mascotSpeak('تركيب وقراءة (دَار) مع العصفور وفصيح! ركّب المقاطع واقرأ وتدرّب على رسم حرف الراء!', 'letter_r_merge_intro');
                setTimeout(initRCanvas, 100);
            }
        }

        function playRLetterSound() {
            mascotCelebrates();
            mascotSpeak('🟢 <b>صَوْتُ حَرْفِ الرَّاءِ النَّقِيّ:</b><br><span style="font-size:2.2rem; color:#d97706;">رْ... رْ... رْ</span>', 'letter_r_sound');
        }

        function playRSceneStory() {
            const btn = document.getElementById('btnRSceneStory');
            if (currentAudio && !currentAudio.paused && window._currentPlayingKey === 'letter_r_scene_story') {
                stopAudio();
                if (btn) btn.innerHTML = '<span>🔊</span> <span>اِسْتَمِعْ لِقِصَّةِ دَارِنَا وَعَنَاصِرِ حَرْفِ الرَّاءِ</span>';
                return;
            }
            mascotCelebrates();
            if (btn) btn.innerHTML = '<span>⏹️</span> <span>إيقاف قصة دارنا وحرف الراء</span>';
            mascotSpeak('🏡 <b>فِي دَارِنَا الْجَمِيلَة:</b><br>«فِي دَارِنَا الْجَمِيلَة، يَجْلِسُ رَامِي مَعَ أُخْتِهِ رِيم وَأَخِيهِ الصَّغِيرِ رَافِد، يُشَاهِدُونَ الْخَرُوفَ الأَبْيَضَ اللَّطِيفَ فِي الْحَدِيقَة، وَفَوْقَ السَّرِيرِ مِبْرَاةُ رَامِي الْجَدِيدَة، كُلُّ هَذِهِ الْكَلِمَاتِ تَزْهُو بِحَرْفِ الرَّاء!»', 'letter_r_scene_story', () => {
                if (btn) btn.innerHTML = '<span>🔊</span> <span>اِسْتَمِعْ لِقِصَّةِ دَارِنَا وَعَنَاصِرِ حَرْفِ الرَّاءِ</span>';
            });
        }

        function playRModel(mode) {
            mascotCelebrates();
            if (mode === 'alone') {
                mascotSpeak('🎓 <b>«أَنَا وَحْدِي» نَمْذَجَةُ فَصِيح:</b><br>أَنَا أَنْطِقُ وَحْدِي بِصَوْتٍ مَسْمُوع: <b style="color:#d97706; font-size:1.5rem;">رَمْلٌ</b>... يَبْدَأُ بِحَرْفِ الرَّاءِ الْمَفْتُوح: <b style="color:#b45309;">رَ</b>!', 'letter_r_model_alone');
            } else if (mode === 'we') {
                mascotSpeak('🤝 <b>«أَنَا وَأَنْتُمْ» مُمَارَسَةٌ مُوَجَّهَة:</b><br>نَنْطِقُ مَعًا يَا أَبْطَال: <b style="color:#d97706; font-size:1.5rem;">جَزَرٌ</b>... فِي آخِرِهِ حَرْفُ الرَّاء!', 'letter_r_model_we');
            } else if (mode === 'you') {
                mascotSpeak('⭐ <b>«أَنْتُمْ وَحْدَكُمْ» اِسْتِقْلالِيَّة:</b><br>الآنَ دَوْرُكُمْ وَحْدَكُمْ يَا أَبْطَالَ الصَّفِّ الأَوَّل، اِنْقُرُوا عَلَى كُلِّ صُورَةٍ وَأَصْغُوا لِلَّفْظِ السَّلِيم!', 'letter_r_model_you');
            }
        }

        function clickRItem(itemKey) {
            mascotCelebrates();
            const items = {
                'raml': { title: 'رَمْلٌ نَاعِم', audio: 'letter_r_raml', desc: 'صوت فتحة قصيرة في أول الكلمة (رَ)' },
                'rijl': { title: 'رِجْلُ الإِنْسَان', audio: 'letter_r_rijl', desc: 'صوت كسرة قصيرة في أول الكلمة (رِ)' },
                'qird': { title: 'قِرْدٌ مَرِح', audio: 'letter_r_qird', desc: 'صوت راء ساكنة في وسط الكلمة (ـرْ)' },
                'jazar': { title: 'جَزَرٌ لَذِيذ', audio: 'letter_r_jazar', desc: 'صوت راء مضمومة في آخر الكلمة (ـرٌ)' },
                'kharoof': { title: 'خَرُوفٌ أَبْيَض', audio: 'letter_r_kharoof', desc: 'صوت مد بالواو في وسط الكلمة (ـرُوـ)' },
                'sareer': { title: 'سَرِيرٌ مُرَتَّب', audio: 'letter_r_sareer', desc: 'صوت مد بالياء في وسط الكلمة (ـرِيـ)' },
                'mibraat': { title: 'مِبْرَاةُ رَامِي', audio: 'letter_r_mibraat', desc: 'صوت مد بالألف في وسط الكلمة (ـرَا)' },
                'saffara': { title: 'صَفَّارَةُ الْمُعَلِّم', audio: 'letter_r_saffara', desc: 'صوت مد قصير - فتحة (رَ)' },
                'qarib': { title: 'قَارِبٌ فِي الْبَحْر', audio: 'letter_r_qarib', desc: 'صوت مد طويل بالألف (رَا)' },
                'zurr': { title: 'زِرُّ الْقَمِيص', audio: 'letter_r_zurr', desc: 'صوت حركة قصيرة - كسرة (رِ)' },
                'kharoof_vowel': { title: 'خَرُوفٌ', audio: 'letter_r_kharoof_vowel', desc: 'صوت مد طويل بالواو (رُو)' },
                'mibraat_vowel': { title: 'مِبْرَاةٌ', audio: 'letter_r_mibraat_vowel', desc: 'صوت مد طويل بالألف (ـرَا)' },
                'reesha': { title: 'رِيشَةٌ نَاعِمَة', audio: 'letter_r_reesha', desc: 'صوت مد طويل بالياء (رِيـ)' }
            };
            const it = items[itemKey];
            if (it) {
                mascotSpeak(`⭐ <b>${it.title}:</b><br>${it.desc}`, it.audio);
            }
        }

        function playRVowel(type, vowel) {
            mascotCelebrates();
            if (type === 'short' && vowel === 'a') {
                mascotSpeak('🟢 <b>فَتْحَةٌ قَصِيرَة:</b><br><span style="font-size:2.2rem; color:#b45309;">رَ</span>', 'letter_r_short_a');
            } else if (type === 'long' && vowel === 'a') {
                mascotSpeak('🟢 <b>مَدٌّ بِالْأَلِف (طَوِيل):</b><br><span style="font-size:2.2rem; color:#92400e;">رَااا</span>', 'letter_r_long_a');
            } else if (type === 'short' && vowel === 'u') {
                mascotSpeak('🟢 <b>ضَمَّةٌ قَصِيرَة:</b><br><span style="font-size:2.2rem; color:#b45309;">رُ</span>', 'letter_r_short_u');
            } else if (type === 'long' && vowel === 'u') {
                mascotSpeak('🟢 <b>مَدٌّ بِالْوَاو (طَوِيل):</b><br><span style="font-size:2.2rem; color:#92400e;">رُووو</span>', 'letter_r_long_u');
            } else if (type === 'short' && vowel === 'i') {
                mascotSpeak('🟢 <b>كَسْرَةٌ قَصِيرَة:</b><br><span style="font-size:2.2rem; color:#b45309;">رِ</span>', 'letter_r_short_i');
            } else if (type === 'long' && vowel === 'i') {
                mascotSpeak('🟢 <b>مَدٌّ بِالْيَاء (طَوِيل):</b><br><span style="font-size:2.2rem; color:#92400e;">رِييي</span>', 'letter_r_long_i');
            }
        }

        function playRSyllable(syllableKey) {
            mascotCelebrates();
            if (syllableKey === 'qird') {
                mascotSpeak('🐒 <b>قِرْدُ:</b> الْمَقْطَعُ السَّاكِن هو: <b style="color:#d97706; font-size:1.6rem;">قِرْ ✊</b>', 'letter_r_qird_syllable');
            } else if (syllableKey === 'furshaat') {
                mascotSpeak('🖌️ <b>فُرْشَاةُ:</b> الْمَقْطَعُ السَّاكِن هو: <b style="color:#d97706; font-size:1.6rem;">فُرْ ✊</b>', 'letter_r_furshaat_syllable');
            } else if (syllableKey === 'birka') {
                mascotSpeak('🌊 <b>بِرْكَةُ:</b> الْمَقْطَعُ السَّاكِن هو: <b style="color:#d97706; font-size:1.6rem;">بِرْ ✊</b>', 'letter_r_birka_syllable');
            }
        }

        function splitRWord(wordKey) {
            mascotCelebrates();
            const isModel = window.currentModelingMode === 'model';
            if (wordKey === 'reem') {
                const chips = document.getElementById('chips-split-reem');
                if (chips) {
                    chips.style.transform = 'scale(1.12)';
                    setTimeout(() => chips.style.transform = 'scale(1)', 400);
                }
                if (isModel) {
                    mascotSpeak('🎓 <b>نَمْذَجَةُ فَصِيح («أَنَا وَحْدِي»):</b><br>كَلِمَةُ (رِيمُ): مَقْطَعَانِ بِالضَّمِّ: <b style="color:#d97706;">[ رِيـ ]</b> + <b style="color:#d97706;">[ مُ ]</b>! صفقتان 👏 👏', 'letter_r_split_reem');
                    triggerClapSequence('reem', ['رِيـ', 'مُ']);
                } else {
                    mascotSpeak('✂️ <b>كَلِمَةُ رِيمُ:</b><br>تَتَكَوَّنُ مِنْ مَقْطَعَيْن: [ رِيـ ] + [ مُ ]! صَفِّقْ مَعِي 👏 👏', 'letter_r_split_reem');
                    triggerClapSequence('reem', ['رِيـ', 'مُ']);
                }
            } else if (wordKey === 'rama') {
                const chips = document.getElementById('chips-split-rama');
                if (chips) {
                    chips.style.transform = 'scale(1.12)';
                    setTimeout(() => chips.style.transform = 'scale(1)', 400);
                }
                if (isModel) {
                    mascotSpeak('🎓 <b>نَمْذَجَةُ فَصِيح («أَنَا وَحْدِي»):</b><br>كَلِمَةُ (رَمَى): مَقْطَعَان: <b style="color:#d97706;">[ رَ ]</b> + <b style="color:#d97706;">[ مَى ]</b>! صفقتان 👏 👏', 'letter_r_split_rama');
                    triggerClapSequence('rama', ['رَ', 'مَى']);
                } else {
                    mascotSpeak('✂️ <b>كَلِمَةُ رَمَى:</b><br>تَتَكَوَّنُ مِنْ مَقْطَعَيْن: [ رَ ] + [ مَى ]! صَفِّقْ مَعِي 👏 👏', 'letter_r_split_rama');
                    triggerClapSequence('rama', ['رَ', 'مَى']);
                }
            } else if (wordKey === 'maram') {
                const chips = document.getElementById('chips-split-maram');
                if (chips) {
                    chips.style.transform = 'scale(1.12)';
                    setTimeout(() => chips.style.transform = 'scale(1)', 400);
                }
                if (isModel) {
                    mascotSpeak('🎓 <b>نَمْذَجَةُ فَصِيح («أَنَا وَحْدِي»):</b><br>كَلِمَةُ (مَرَامُ): ثَلاثَةُ مَقَاطِع: <b style="color:#d97706;">[ مَـ ]</b> + <b style="color:#d97706;">[ رَا ]</b> + <b style="color:#d97706;">[ مُ ]</b>! ثلاث صفقات 👏 👏 👏', 'letter_r_split_maram');
                    triggerClapSequence('maram', ['مَـ', 'رَا', 'مُ']);
                } else {
                    mascotSpeak('✂️ <b>كَلِمَةُ مَرَامُ:</b><br>تَتَكَوَّنُ مِنْ ثَلاثَةِ مَقَاطِع: [ مَـ ] + [ رَا ] + [ مُ ]! صَفِّقْ مَعِي 👏 👏 👏', 'letter_r_split_maram');
                    triggerClapSequence('maram', ['مَـ', 'رَا', 'مُ']);
                }
            } else if (wordKey === 'dar') {
                const chips = document.getElementById('chips-split-dar');
                if (chips) {
                    chips.style.transform = 'scale(1.12)';
                    setTimeout(() => chips.style.transform = 'scale(1)', 400);
                }
                if (isModel) {
                    mascotSpeak('🎓 <b>نَمْذَجَةُ فَصِيح («أَنَا وَحْدِي»):</b><br>كَلِمَةُ (دَارُ): مَقْطَعَانِ بِالضَّمِّ: <b style="color:#d97706;">[ دَا ]</b> + <b style="color:#d97706;">[ رُ ]</b>! صفقتان 👏 👏', 'letter_r_split_dar');
                    triggerClapSequence('dar', ['دَا', 'رُ']);
                } else {
                    mascotSpeak('✂️ <b>كَلِمَةُ دَارُ:</b><br>تَتَكَوَّنُ مِنْ مَقْطَعَيْن: [ دَا ] + [ رُ ]! صَفِّقْ مَعِي 👏 👏', 'letter_r_split_dar');
                    triggerClapSequence('dar', ['دَا', 'رُ']);
                }
            }
        }

        function mergeRPuzzle(puzzleKey) {
            mascotCelebrates();
            if (puzzleKey === 'rafid') {
                const res = document.getElementById('result-merge-rafid');
                if (res) {
                    res.textContent = 'رَافِدُ';
                    res.style.borderColor = '#059669';
                    res.style.color = '#059669';
                    res.style.background = '#d1fae5';
                    res.style.transform = 'scale(1.15)';
                    setTimeout(() => res.style.transform = 'scale(1)', 400);
                }
                mascotSpeak('🧩 <b>تَرْكِيبُ الْمَقَاطِع:</b><br>[ رَا ] + [ فِـ ] + [ دُ ] = <b style="color:#059669; font-size:1.6rem;">رَافِدُ</b>! أَحْسَنْتَ يَا بَطَل!', 'letter_r_merge_rafid');
            } else if (puzzleKey === 'rami') {
                const res = document.getElementById('result-merge-rami');
                if (res) {
                    res.textContent = 'رَامِي';
                    res.style.borderColor = '#059669';
                    res.style.color = '#059669';
                    res.style.background = '#d1fae5';
                    res.style.transform = 'scale(1.15)';
                    setTimeout(() => res.style.transform = 'scale(1)', 400);
                }
                mascotSpeak('🧩 <b>تَرْكِيبُ الْمَقَاطِع:</b><br>[ رَا ] + [ مِي ] = <b style="color:#059669; font-size:1.6rem;">رَامِي</b>! عَبْقَرِيٌّ حَقًّا!', 'letter_r_merge_rami');
            } else if (puzzleKey === 'dar') {
                const res = document.getElementById('result-merge-dar');
                if (res) {
                    res.textContent = 'دَارُ';
                    res.style.borderColor = '#059669';
                    res.style.color = '#059669';
                    res.style.background = '#d1fae5';
                    res.style.transform = 'scale(1.15)';
                    setTimeout(() => res.style.transform = 'scale(1)', 400);
                }
                mascotSpeak('🧩 <b>تَرْكِيبُ كَلِمَةِ (دَار):</b><br>[ دَا ] + [ رُ ] = <b style="color:#059669; font-size:1.6rem;">دَارُ</b>! هَكَذَا صَنَعْنَا كَلِمَةَ دَار!', 'letter_r_merge_dar');
            }
        }

        function playRReadWord(wordKey) {
            mascotCelebrates();
            if (wordKey === 'baba_rami') {
                mascotSpeak('📖 <b>بَابَا رَامِي!</b><br>جُمْلَةٌ رَائِعَةٌ مِنْ مَقَاطِعِنَا الْمَدْرُوسَة!', 'letter_r_read_baba_rami');
            } else if (wordKey === 'mama_reem') {
                mascotSpeak('📖 <b>مَامَا رِيـْمُ!</b><br>مَامَا رِيمُ الْحَبِيبَةُ فِي دَارِنَا!', 'letter_r_read_mama_reem');
            } else if (wordKey === 'dada_maram') {
                mascotSpeak('📖 <b>دَادَا مَرَام!</b><br>دَادَا مَرَامُ الصَّغِيرَةُ اللَّطِيفَة!', 'letter_r_read_dada_maram');
            } else if (wordKey === 'dar_rami') {
                mascotSpeak('📖 <b>دَارُ رَامِي!</b><br>دَارُ رَامِي جَمِيلَةٌ وَمُرَتَّبَة!', 'letter_r_read_dar_rami');
            }
        }

        function playRReadAll() {
            mascotCelebrates();
            mascotSpeak('🐦 <b>الْقِرَاءَةُ الْجَمَاعِيَّةُ الشَّامِلَةُ مَعَ الْعُصْفُورِ الْمُغَرِّد:</b><br><span style="font-size:1.35rem; color:#1e3a8a; font-weight:900;">«بَابَا رَامِي... مَامَا رِيمُ... دَادَا مَرَامُ... دَارُ رَامِي!»</span><br>عَفْيَة عَلَيْكُم يَا أَبْطَالَ قِرَاءَتِي الْمَاهِرِين! 🌟', 'letter_r_read_all');
        }

        function playRDrawHint() {
            mascotCelebrates();
            mascotSpeak('💡 <b>إِرْشَادُ رَسْمِ حَرْفِ الرَّاءِ:</b><br>نَبْدَأُ مِنْ أَعْلَى السَّطْرِ قَلِيلاً عِنْدَ النُّقْطَةِ الْحَمْرَاء، ثُمَّ نَنْزِلُ مُنْحَنِينَ إِلَى تَحْتِ السَّطْرِ كَالزُّحْلَيْقَةِ الْمُمْتِعَة!', 'letter_r_draw_hint');
        }

        function initRCanvas() {
            const canvas = document.getElementById('rDrawingCanvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!rCanvasInited) {
                rCanvasInited = true;
                drawRCanvasGuides(ctx, canvas);

                const startDrawing = (e) => {
                    rDrawing = true;
                    ctx.beginPath();
                    const pos = getCanvasPos(canvas, e);
                    ctx.moveTo(pos.x, pos.y);
                    if (e.cancelable) e.preventDefault();
                };

                const drawMove = (e) => {
                    if (!rDrawing) return;
                    const pos = getCanvasPos(canvas, e);
                    ctx.lineTo(pos.x, pos.y);
                    ctx.strokeStyle = rIsEraser ? '#fffdf5' : rDrawColor;
                    ctx.lineWidth = rIsEraser ? 24 : rLineWidth;
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';
                    ctx.stroke();
                    if (e.cancelable) e.preventDefault();
                };

                const stopDrawing = () => {
                    if (rDrawing) {
                        rDrawing = false;
                        ctx.closePath();
                    }
                };

                canvas.addEventListener('mousedown', startDrawing);
                canvas.addEventListener('mousemove', drawMove);
                window.addEventListener('mouseup', stopDrawing);

                canvas.addEventListener('touchstart', startDrawing, { passive: false });
                canvas.addEventListener('touchmove', drawMove, { passive: false });
                window.addEventListener('touchend', stopDrawing);
            }
        }

        function drawRCanvasGuides(ctx, canvas) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // خط الأساس (سطر الكتابة)
            ctx.beginPath();
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 6]);
            ctx.moveTo(30, 130);
            ctx.lineTo(canvas.width - 30, 130);
            ctx.stroke();
            ctx.setLineDash([]);

            // خط إرشادي علوي خفيف
            ctx.beginPath();
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 4]);
            ctx.moveTo(30, 65);
            ctx.lineTo(canvas.width - 30, 65);
            ctx.stroke();
            ctx.setLineDash([]);

            // كتابة الحروف المنقطة الإرشادية (ر)
            ctx.font = '900 86px "Noto Naskh Arabic", "Cairo", sans-serif';
            ctx.fillStyle = '#fde68a';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'alphabetic';
            ctx.fillText('ر', canvas.width * 0.75, 140);
            ctx.fillText('ـر', canvas.width * 0.50, 140);
            ctx.fillText('ر', canvas.width * 0.25, 140);

            // نقطة بداية حمراء وسهم الزحليقة
            ctx.beginPath();
            ctx.arc(canvas.width * 0.77, 95, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#ef4444';
            ctx.fill();

            // تسمية توضيحية
            ctx.font = '700 13px "Tajawal", sans-serif';
            ctx.fillStyle = '#b45309';
            ctx.textAlign = 'right';
            ctx.fillText('سطر الكتابة ⬅️', canvas.width - 35, 126);
        }

        function setRDrawColor(color) {
            rIsEraser = false;
            rDrawColor = color;
            rLineWidth = 6;
        }

        function setREraser(isEraser) {
            rIsEraser = isEraser;
        }

        function clearRCanvas() {
            const canvas = document.getElementById('rDrawingCanvas');
            if (canvas) {
                const ctx = canvas.getContext('2d');
                drawRCanvasGuides(ctx, canvas);
            }

        /* ========================================================
           دوال درس حرف السين (سـ ، س) وقراءة (فِرَاس) - ص 35 - 37
        ======================================================== */
        let sCanvasInited = false;
        let sDrawing = false;
        let sDrawColor = '#059669';
        let sLineWidth = 6;
        let sIsEraser = false;

        function switchSStation(stationNum) {
            document.querySelectorAll('.letter-s-station').forEach(el => el.style.display = 'none');
            document.querySelectorAll('#view-tab-letter_s .station-tab').forEach(el => el.classList.remove('active'));

            const targetStation = document.getElementById('stationS' + stationNum);
            const targetBtn = document.getElementById('btnStationS' + stationNum);
            if (targetStation) targetStation.style.display = 'block';
            if (targetBtn) targetBtn.classList.add('active');

            if (stationNum === 1) {
                mascotSpeak('حرف السين (سـ ، س)! انقر على بطاقات الكلمات المصورة واستمع لصوت الحرف!', 'letter_s_intro');
            } else if (stationNum === 2) {
                mascotSpeak('أصوات المد القصيرة والطويلة! قارن بين الفتحة والمد بالألف، والضمة والواو، والكسرة والياء لحرف السين!', 'letter_s_vowels_intro');
            } else if (stationNum === 3) {
                mascotSpeak('المقاطع والتحليل الصوتي! استمع لصوت السين الساكنة ✊ وحلل كلمات (سَارَ ، سَافَرَ ، دَرَسَ) بالصفقات!', 'letter_s_syllables_intro');
            } else if (stationNum === 4) {
                mascotSpeak('تركيب وقراءة (فَارِس / فِرَاس) والرسم! ركّب المقاطع واقرأ وتدرّب على رسم حرف السين!', 'letter_s_merge_intro');
                setTimeout(initSCanvas, 100);
            }
        }

        function playSLetterSound() {
            mascotCelebrates();
            mascotSpeak('🟢 <b>صَوْتُ حَرْفِ السِّينِ النَّقِيّ:</b><br><span style="font-size:2.2rem; color:#059669;">سْ... سْ... سْ</span>', 'letter_s_sound');
        }

        function playSSceneStory() {
            const btn = document.getElementById('btnSSceneStory');
            if (currentAudio && !currentAudio.paused && window._currentPlayingKey === 'letter_s_scene_story') {
                stopAudio();
                if (btn) btn.innerHTML = '<span>🔊</span> <span>اِسْتَمِعْ لِقِصَّةِ حَدِيقَتِنَا وَعَنَاصِرِ حَرْفِ السِّينِ</span>';
                return;
            }
            mascotCelebrates();
            if (btn) btn.innerHTML = '<span>⏹️</span> <span>إيقاف قصة الحديقة وحرف السين</span>';
            mascotSpeak('🌿 <b>فِي حَدِيقَةِ بَيْتِنَا الْمُشْمِسَة:</b><br>«فِي حَدِيقَةِ الْبَيْتِ الْمُشْمِسَة، جَلَسَ فَارِسٌ يُشَاهِدُ السُّلَحْفَاةَ اللَّطِيفَة، وَبِجَانِبِهِ سَلَّةُ الْفَوَاكِهِ اللَّذِيذَة، وَتَحْتَ أَشِعَّةِ الشَّمْسِ الذَّهَبِيَّة، كُلُّ هَذِهِ الْكَلِمَاتِ تَزْهُو بِصَوْتِ حَرْفِ السِّين!»', 'letter_s_scene_story', () => {
                if (btn) btn.innerHTML = '<span>🔊</span> <span>اِسْتَمِعْ لِقِصَّةِ حَدِيقَتِنَا وَعَنَاصِرِ حَرْفِ السِّينِ</span>';
            });
        }

        function playSModel(mode) {
            mascotCelebrates();
            if (mode === 'alone') {
                mascotSpeak('🎓 <b>«أَنَا وَحْدِي» نَمْذَجَةُ فَصِيح:</b><br>أَنَا أَنْطِقُ وَحْدِي بِصَوْتٍ مَسْمُوع: <b style="color:#059669; font-size:1.5rem;">سَلَّةُ</b>... تَبْدَأُ بِحَرْفِ السِّينِ الْمَفْتُوح: <b style="color:#047857;">سَـ</b>!', 'letter_s_model_alone');
            } else if (mode === 'we') {
                mascotSpeak('🤝 <b>«أَنَا وَأَنْتُمْ» مُمَارَسَةٌ مُوَجَّهَة:</b><br>نَنْطِقُ مَعًا يَا أَبْطَال: <b style="color:#059669; font-size:1.5rem;">سُلَحْفَاةُ</b>... فِي أَوَّلِهَا سِينٌ مَضْمُومَة: <b style="color:#047857;">سُـ</b>!', 'letter_s_model_we');
            } else if (mode === 'you') {
                mascotSpeak('⭐ <b>«أَنْتُمْ وَحْدَكُمْ» اِسْتِقْلالِيَّة:</b><br>الآنَ دَوْرُكُمْ وَحْدَكُمْ يَا أَبْطَالَ الصَّفِّ الأَوَّل، اِنْقُرُوا عَلَى كُلِّ صُورَةٍ وَأَصْغُوا لِلَّفْظِ السَّلِيم!', 'letter_s_model_you');
            }
        }

        function clickSItem(itemKey) {
            mascotCelebrates();
            const items = {
                'salla': { title: 'سَلَّةُ الْفَوَاكِه', audio: 'letter_s_salla', badge: 'سَـ (مفتوح في أول الكلمة)' },
                'sulhafah': { title: 'سُلَحْفَاةُ اللَّطِيفَة', audio: 'letter_s_sulhafah', badge: 'سُـ (مضموم في أول الكلمة)' },
                'mismaar': { title: 'مِسْمَارٌ صُلْب', audio: 'letter_s_mismaar', badge: 'ـسْـ (ساكن في وسط الكلمة)' },
                'shams': { title: 'شَمْسٌ دَافِئَة', audio: 'letter_s_shams', badge: 'ـسُ (في آخر الكلمة)' },
                'sitara': { title: 'سِتَارَةُ النَّافِذَة', audio: 'letter_s_sitara', badge: 'سِـ (مكسور في أول الكلمة)' },
                'saah': { title: 'سَاعَةُ الْحَائِط', audio: 'letter_s_saah', badge: 'سَا (مد بالألف)' },
                'hasoob': { title: 'حَاسُوبٌ ذَكِيّ', audio: 'letter_s_hasoob', badge: 'ـسُو (مد بالواو)' },
                'timsaah': { title: 'تِمْسَاحٌ نَهْرِيّ', audio: 'letter_s_timsaah', badge: 'ـسَا (مد بالألف)' },
                'sabboora': { title: 'سَبُّورَةُ الصَّفّ', audio: 'letter_s_sabboora', badge: 'سَـ (صوت قصير بالفتحة)' },
                'sukkar': { title: 'سُكَّرٌ حُلْو', audio: 'letter_s_sukkar', badge: 'سُـ (صوت قصير بالضمة)' },
                'sinjab': { title: 'سِنْجَابٌ نَشِيط', audio: 'letter_s_sinjab', badge: 'سِـ (صوت قصير بالكسرة)' },
                'saah_vowel': { title: 'سَاعَةٌ ذَهَبِيَّة', audio: 'letter_s_saah_vowel', badge: 'سَا (صوت طويل بالألف)' },
                'sooq': { title: 'سُوقٌ كَبِير', audio: 'letter_s_sooq', badge: 'سُوْ (صوت طويل بالواو)' },
                'timsaah_vowel': { title: 'تِمْسَاحُ الْبُحَيْرَة', audio: 'letter_s_timsaah_vowel', badge: 'ـسَا (صوت طويل بالألف)' }
            };
            const item = items[itemKey];
            if (item) {
                mascotSpeak('📸 <b>' + item.title + ':</b><br><span style="font-size:1.15rem; color:#059669; font-weight:800;">' + item.badge + '</span>', item.audio);
            }
        }

        function playSVowel(type, vowel) {
            mascotCelebrates();
            if (type === 'short') {
                if (vowel === 'a') mascotSpeak('🎵 <b>حَرْكَةُ الْفَتْحَةِ الْقَصِيرَة:</b><br><b style="color:#059669; font-size:2rem;">سَـ</b>... صَوْتٌ قَصِيرٌ خَفِيف!', 'letter_s_short_a');
                else if (vowel === 'u') mascotSpeak('🎵 <b>حَرْكَةُ الضَّمَّةِ الْقَصِيرَة:</b><br><b style="color:#059669; font-size:2rem;">سُـ</b>... صَوْتٌ قَصِيرٌ مَضْمُوم!', 'letter_s_short_u');
                else if (vowel === 'i') mascotSpeak('🎵 <b>حَرْكَةُ الْكَسْرَةِ الْقَصِيرَة:</b><br><b style="color:#059669; font-size:2rem;">سِـ</b>... صَوْتٌ قَصِيرٌ مَكْسُور!', 'letter_s_short_i');
            } else if (type === 'long') {
                if (vowel === 'a') mascotSpeak('🎵 <b>مَدُّ الأَلِفِ الطَّوِيل:</b><br><b style="color:#047857; font-size:2rem;">سَا</b>... نَمُدُّ الصَّوْتَ بِالأَلِف!', 'letter_s_long_a');
                else if (vowel === 'u') mascotSpeak('🎵 <b>مَدُّ الْوَاوِ الطَّوِيل:</b><br><b style="color:#047857; font-size:2rem;">سُوْ</b>... نَمُدُّ الصَّوْتَ بِالْوَاو!', 'letter_s_long_u');
                else if (vowel === 'i') mascotSpeak('🎵 <b>مَدُّ الْيَاءِ الطَّوِيل:</b><br><b style="color:#047857; font-size:2rem;">سِيـ</b>... نَمُدُّ الصَّوْتَ بِالْيَاء!', 'letter_s_long_i');
            }
        }

        function playSSyllable(syllableKey) {
            mascotCelebrates();
            if (syllableKey === 'mistarah') {
                mascotSpeak('✊ <b>مِسْطَرَةُ:</b> الْمَقْطَعُ السَّاكِنُ هو: <b style="color:#059669; font-size:1.6rem;">مِسْـ ✊</b>', 'letter_s_mistarah_syllable');
            } else if (syllableKey === 'fustaan') {
                mascotSpeak('✊ <b>فُسْتَانُ:</b> الْمَقْطَعُ السَّاكِنُ هو: <b style="color:#059669; font-size:1.6rem;">فُسْـ ✊</b>', 'letter_s_fustaan_syllable');
            } else if (syllableKey === 'nasr') {
                mascotSpeak('✊ <b>نَسْرُ:</b> الْمَقْطَعُ السَّاكِنُ هو: <b style="color:#059669; font-size:1.6rem;">نَسْـ ✊</b>', 'letter_s_nasr_syllable');
            }
        }

        function splitSWord(wordKey) {
            mascotCelebrates();
            const isModel = window.currentModelingMode === 'model';
            if (wordKey === 'saara') {
                const chips = document.getElementById('chips-split-saara');
                if (chips) {
                    chips.style.transform = 'scale(1.12)';
                    setTimeout(() => chips.style.transform = 'scale(1)', 400);
                }
                mascotSpeak('✂️ <b>كَلِمَةُ سَارَ:</b><br>تَتَكَوَّنُ مِنْ مَقْطَعَيْن: [ سَا ] + [ رَ ]! صَفِّقْ مَعِي 👏 👏', 'letter_s_split_saara');
                triggerClapSequence('saara', ['سَا', 'رَ']);
            } else if (wordKey === 'saafara') {
                const chips = document.getElementById('chips-split-saafara');
                if (chips) {
                    chips.style.transform = 'scale(1.12)';
                    setTimeout(() => chips.style.transform = 'scale(1)', 400);
                }
                mascotSpeak('👩‍🏫 <b>كَلِمَةُ سَافَرَ:</b><br>تَتَكَوَّنُ مِنْ ثَلاثَةِ مَقَاطِع: [ سَا ] + [ فَـ ] + [ رَ ]! بِنُطْقِ الْمُعَلِّمَةِ الصَّافِي 👏 👏 👏', 'letter_s_read_word_safara');
                triggerClapSequence('saafara', ['سَا', 'فَـ', 'رَ']);
            } else if (wordKey === 'darasa') {
                const chips = document.getElementById('chips-split-darasa');
                if (chips) {
                    chips.style.transform = 'scale(1.12)';
                    setTimeout(() => chips.style.transform = 'scale(1)', 400);
                }
                mascotSpeak('✂️ <b>كَلِمَةُ دَرَسَ:</b><br>تَتَكَوَّنُ مِنْ ثَلاثَةِ مَقَاطِع: [ دَ ] + [ رَ ] + [ سَ ]! صَفِّقْ مَعِي 👏 👏 👏', 'letter_s_split_darasa');
                triggerClapSequence('darasa', ['دَ', 'رَ', 'سَ']);
            }
        }

        function mergeSPuzzle(puzzleKey) {
            mascotCelebrates();
            if (puzzleKey === 'mismaar') {
                const res = document.getElementById('result-merge-mismaar');
                if (res) {
                    res.textContent = 'مِسْمَارُ';
                    res.style.borderColor = '#059669';
                    res.style.color = '#059669';
                    res.style.background = '#d1fae5';
                    res.style.transform = 'scale(1.15)';
                    setTimeout(() => res.style.transform = 'scale(1)', 400);
                }
                mascotSpeak('🧩 <b>تَرْكِيبُ الْمَقَاطِع:</b><br>[ مِسْـ ] + [ مَا ] + [ رُ ] = <b style="color:#059669; font-size:1.6rem;">مِسْمَارُ</b>! أَحْسَنْتَ يَا بَطَل!', 'letter_s_merge_mismaar');
            } else if (puzzleKey === 'faris') {
                const res = document.getElementById('result-merge-faris');
                if (res) {
                    res.textContent = 'فَارِسُ';
                    res.style.borderColor = '#059669';
                    res.style.color = '#059669';
                    res.style.background = '#d1fae5';
                    res.style.transform = 'scale(1.15)';
                    setTimeout(() => res.style.transform = 'scale(1)', 400);
                }
                mascotSpeak('👩‍🏫 <b>تَرْكِيبُ كَلِمَةِ (فَارِسُ):</b><br>[ فَا ] + [ رِ ] + [ سُ ] = <b style="color:#059669; font-size:1.6rem;">فَارِسُ</b>! بِنُطْقِ الْمُعَلِّمَةِ الصَّافِي 🌟', 'letter_s_read_word_faris');
            } else if (puzzleKey === 'rasama') {
                const res = document.getElementById('result-merge-rasama');
                if (res) {
                    res.textContent = 'رَسَمَ';
                    res.style.borderColor = '#059669';
                    res.style.color = '#059669';
                    res.style.background = '#d1fae5';
                    res.style.transform = 'scale(1.15)';
                    setTimeout(() => res.style.transform = 'scale(1)', 400);
                }
                mascotSpeak('👩‍🏫 <b>تَرْكِيبُ كَلِمَةِ (رَسَمَ):</b><br>[ رَ ] + [ سَـ ] + [ مَ ] = <b style="color:#059669; font-size:1.6rem;">رَسَمَ</b>! بِنُطْقِ الْمُعَلِّمَةِ الصَّافِي 🌟', 'letter_s_read_word_rasama');
            }
        }

        function playSReadAll() {
            mascotCelebrates();
            mascotSpeak('👩‍🏫 <b>الْقِرَاءَةُ الشَّامِلَةُ لِدَفْتَرِ الدَّرْسِ بِصَوْتِ الْمُعَلِّمَةِ الْعِرَاقِيَّةِ الْفَصِيح:</b><br><span style="font-size:1.4rem; color:#065f46; font-weight:900;">«سَافَرَ بَابَا .. رَسَمَ مُوسَى بَابَا .. رَسَمَ فَارِسُ مَامَا»</span><br>قِرَاءَةٌ صَفِّيَّةٌ نَمُوذَجِيَّةٌ سَلِيمَةٌ 🌟', 'letter_s_read_all');
        }

        function playSTeacherSentence(num) {
            playSReadWord('sentence' + num);
        }

        function playSTeacherWord(wordKey) {
            playSReadWord(wordKey);
        }

        function playSReadWord(wordKey) {
            mascotCelebrates();
            if (wordKey === 'sentence1') {
                mascotSpeak('👩‍🏫 <b>«سَافَرَ بَابَا»</b><br>بِصَوْتِ الْمُعَلِّمَةِ الْعِرَاقِيَّةِ الْفَصِيحِ 🌟', 'letter_s_read_sentence1');
            } else if (wordKey === 'sentence2') {
                mascotSpeak('👩‍🏫 <b>«رَسَمَ مُوسَى بَابَا»</b><br>بِصَوْتِ الْمُعَلِّمَةِ الْعِرَاقِيَّةِ الْفَصِيحِ 🌟', 'letter_s_read_sentence2');
            } else if (wordKey === 'sentence3') {
                mascotSpeak('👩‍🏫 <b>«رَسَمَ فَارِسُ مَامَا»</b><br>بِصَوْتِ الْمُعَلِّمَةِ الْعِرَاقِيَّةِ الْفَصِيحِ 🌟', 'letter_s_read_sentence3');
            } else if (wordKey === 'safara') {
                mascotSpeak('👩‍🏫 <b>سَافَرَ!</b><br>بِنُطْقِ الْمُعَلِّمَةِ الْعِرَاقِيَّةِ الصَّافِي 🌟', 'letter_s_read_word_safara');
            } else if (wordKey === 'baba') {
                mascotSpeak('👩‍🏫 <b>بَابَا!</b><br>بِنُطْقِ الْمُعَلِّمَةِ الْعِرَاقِيَّةِ الصَّافِي 🌟', 'letter_s_read_word_baba');
            } else if (wordKey === 'rasama') {
                mascotSpeak('👩‍🏫 <b>رَسَمَ!</b><br>بِنُطْقِ الْمُعَلِّمَةِ الْعِرَاقِيَّةِ الصَّافِي 🌟', 'letter_s_read_word_rasama');
            } else if (wordKey === 'moosa') {
                mascotSpeak('👩‍🏫 <b>مُوْسَى!</b><br>بِنُطْقِ الْمُعَلِّمَةِ الْعِرَاقِيَّةِ الصَّافِي 🌟', 'letter_s_read_word_moosa');
            } else if (wordKey === 'faris') {
                mascotSpeak('👩‍🏫 <b>فَارِسُ!</b><br>بِنُطْقِ الْمُعَلِّمَةِ الْعِرَاقِيَّةِ الصَّافِي 🌟', 'letter_s_read_word_faris');
            } else if (wordKey === 'mama') {
                mascotSpeak('👩‍🏫 <b>مَامَا!</b><br>بِنُطْقِ الْمُعَلِّمَةِ الْعِرَاقِيَّةِ الصَّافِي 🌟', 'letter_s_read_word_mama');
            } else if (wordKey === 'firas') {
                mascotSpeak('🌟 <b>فِرَاسُ!</b><br>كَلِمَةُ الدَّرْسِ الشَّهِيرَة: فِرَاسٌ وَأَنِيسٌ وَمَيْسُون!', 'letter_s_read_word_firas');
            }
        }

        function playSDrawHint() {
            mascotCelebrates();
            mascotSpeak('💡 <b>إِرْشَادُ رَسْمِ حَرْفِ السِّين:</b><br>نَرْسِمُ ثَلاثَةَ أَسْنَانٍ مُتَسَاوِيَةٍ فَوْقَ السَّطْر، ثُمَّ نَمُدُّ لِلسِّينِ الأُولَى (سـ)، أَوْ نَنْزِلُ بِكَاسَةٍ مُقَوَّسَةٍ تَغُوصُ تَحْتَ السَّطْرِ وَتَصْعَدُ لِلسِّينِ الْكَامِلَة (س)!', 'letter_s_draw_hint');
        }

        function initSCanvas() {
            const canvas = document.getElementById('sDrawingCanvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!sCanvasInited) {
                sCanvasInited = true;
                drawSCanvasGuides(ctx, canvas);

                const startDrawing = (e) => {
                    sDrawing = true;
                    ctx.beginPath();
                    const pos = getCanvasPos(canvas, e);
                    ctx.moveTo(pos.x, pos.y);
                    if (e.cancelable) e.preventDefault();
                };

                const drawMove = (e) => {
                    if (!sDrawing) return;
                    const pos = getCanvasPos(canvas, e);
                    ctx.lineTo(pos.x, pos.y);
                    ctx.strokeStyle = sIsEraser ? '#fffdf5' : sDrawColor;
                    ctx.lineWidth = sIsEraser ? 24 : sLineWidth;
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';
                    ctx.stroke();
                    if (e.cancelable) e.preventDefault();
                };

                const stopDrawing = () => {
                    if (sDrawing) {
                        sDrawing = false;
                        ctx.closePath();
                    }
                };

                canvas.addEventListener('mousedown', startDrawing);
                canvas.addEventListener('mousemove', drawMove);
                window.addEventListener('mouseup', stopDrawing);

                canvas.addEventListener('touchstart', startDrawing, { passive: false });
                canvas.addEventListener('touchmove', drawMove, { passive: false });
                window.addEventListener('touchend', stopDrawing);
            }
        }

        function drawSCanvasGuides(ctx, canvas) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // خط الأساس (سطر الكتابة الأحمر)
            ctx.beginPath();
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 2.5;
            ctx.moveTo(30, 130);
            ctx.lineTo(canvas.width - 30, 130);
            ctx.stroke();

            // خط إرشادي علوي للأسنان
            ctx.beginPath();
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 4]);
            ctx.moveTo(30, 75);
            ctx.lineTo(canvas.width - 30, 75);
            ctx.stroke();
            ctx.setLineDash([]);

            // خط قاع الكاسة
            ctx.beginPath();
            ctx.strokeStyle = '#c084fc';
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 4]);
            ctx.moveTo(30, 180);
            ctx.lineTo(canvas.width - 30, 180);
            ctx.stroke();
            ctx.setLineDash([]);

            // حروف منقطة إرشادية (سـ ، س)
            ctx.font = '900 86px "Noto Naskh Arabic", "Cairo", sans-serif';
            ctx.fillStyle = '#bbf7d0';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'alphabetic';
            ctx.fillText('سـ', canvas.width * 0.75, 130);
            ctx.fillText('س', canvas.width * 0.35, 130);

            // نقطة بداية حمراء
            ctx.beginPath();
            ctx.arc(canvas.width * 0.77, 75, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#ef4444';
            ctx.fill();

            // تسمية توضيحية
            ctx.font = 'bold 12px "Cairo", sans-serif';
            ctx.fillStyle = '#64748b';
            ctx.textAlign = 'left';
            ctx.fillText('السطر الأساسي', 35, 125);
        }

        function setSColor(color, btn) {
            sIsEraser = false;
            sDrawColor = color;
            document.querySelectorAll('.color-dot-s').forEach(el => el.classList.remove('active'));
            if (btn) btn.classList.add('active');
        }

        function clearSCanvas() {
            const canvas = document.getElementById('sDrawingCanvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            drawSCanvasGuides(ctx, canvas);
            mascotSpeak('تم مسح السبورة! ارسم حرف السين مرة أخرى بيدك الرائعة!', 'hint_draw');
        }

        /* ========================================================
           دوال درس حرف النون (نـ ، ن) وقراءة (نُور) - ص 38 - 40
        ======================================================== */
        let nCanvasInited = false;
        let nDrawing = false;
        let nDrawColor = '#4f46e5';
        let nLineWidth = 6;
        let nIsEraser = false;

        function switchNStation(stationNum) {
            document.querySelectorAll('.letter-n-station').forEach(el => el.style.display = 'none');
            document.querySelectorAll('#view-tab-letter_n .station-tab').forEach(el => el.classList.remove('active'));

            const targetStation = document.getElementById('stationN' + stationNum);
            const targetBtn = document.getElementById('btnStationN' + stationNum);
            if (targetStation) targetStation.style.display = 'block';
            if (targetBtn) targetBtn.classList.add('active');

            if (stationNum === 1) {
                mascotSpeak('حرف النون (نـ ، ن)! انقر على بطاقات الكلمات المصورة واستمع لصوت الحرف!', 'letter_n_intro');
            } else if (stationNum === 2) {
                mascotSpeak('أصوات المد القصيرة والطويلة! قارن بين الفتحة والمد بالألف، والضمة والواو، والكسرة والياء لحرف النون!', 'letter_n_vowels_intro');
            } else if (stationNum === 3) {
                mascotSpeak('المقاطع والتحليل الصوتي! استمع لصوت النون الساكنة ✊ وحلل كلمات (نُور ، مَنَار ، سِنَان ، رَنِين) بالصفقات!', 'letter_n_syllables_intro');
            } else if (stationNum === 4) {
                mascotSpeak('تركيب وقراءة (فِي مَرْسَمِ سِنَان / نُور) والرسم! ركّب المقاطع واقرأ وتدرّب على رسم حرف النون!', 'letter_n_merge_intro');
                setTimeout(initNCanvas, 100);
            }
        }

        function playNLetterSound() {
            mascotCelebrates();
            mascotSpeak('🟢 <b>صَوْتُ حَرْفِ النُّونِ الصَّافِي:</b><br><span style="font-size:2.2rem; color:#4f46e5;">نْ... نْ... نْ</span>', 'letter_n_sound');
        }

        function playNSceneStory() {
            const btn = document.getElementById('btnNSceneStory');
            if (currentAudio && !currentAudio.paused && window._currentPlayingKey === 'letter_n_scene_story') {
                stopAudio();
                if (btn) btn.innerHTML = '<span>🔊</span> <span>اِسْتَمِعْ لِقِصَّةِ مَرْسَمِ سِنَان وَعَنَاصِرِ حَرْفِ النُّونِ</span>';
                return;
            }
            mascotCelebrates();
            if (btn) btn.innerHTML = '<span>⏹️</span> <span>إيقاف قصة المرسم وحرف النون</span>';
            mascotSpeak('🎨 <b>فِي مَرْسَمِ صَدِيقِنَا سِنَان:</b><br>«فِي مَرْسَمِ الصَّدِيقِ سِنَان، جَلَسَ الأَصْدِقَاءُ يَرْسُمُونَ بِأَلْوَانٍ بَهِيَّة! رَسَمَ فَارِسٌ لَوْحَةَ دَادَا، وَرَسَمَ سِنَانٌ صُورَةَ بَابَا، وَتَحْتَ ضَوْءِ النُّورِ، تَمْلَأُ عَنَاصِرُ حَرْفِ النُّونِ الْمَكَانَ بِالْفَرَحِ وَالإِبْدَاع!»', 'letter_n_scene_story', () => {
                if (btn) btn.innerHTML = '<span>🔊</span> <span>اِسْتَمِعْ لِقِصَّةِ مَرْسَمِ سِنَان وَعَنَاصِرِ حَرْفِ النُّونِ</span>';
            });
        }

        function playNModel(mode) {
            mascotCelebrates();
            if (mode === 'alone') {
                mascotSpeak('🎓 <b>«أَنَا وَحْدِي» نَمْذَجَةُ فَصِيح:</b><br>أَنَا أَنْطِقُ وَحْدِي بِصَوْتٍ مَسْمُوع: <b style="color:#4f46e5; font-size:1.5rem;">نَـمْلُ</b>... تَبْدَأُ بِحَرْفِ النُّونِ الْمَفْتُوح: <b style="color:#3730a3;">نَـ</b>!', 'letter_n_model_alone');
            } else if (mode === 'we') {
                mascotSpeak('🤝 <b>«أَنَا وَأَنْتُمْ» مُمَارَسَةٌ مُوَجَّهَة:</b><br>نَنْطِقُ مَعًا يَا أَبْطَال: <b style="color:#4f46e5; font-size:1.5rem;">نُـجُومُ</b>... فِي أَوَّلِهَا نُونٌ مَضْمُومَة: <b style="color:#3730a3;">نُـ</b>!', 'letter_n_model_we');
            } else if (mode === 'you') {
                mascotSpeak('⭐ <b>«أَنْتُمْ وَحْدَكُمْ» اِسْتِقْلالِيَّة:</b><br>الآنَ دَوْرُكُمْ وَحْدَكُمْ يَا أَبْطَالَ الصَّفِّ الأَوَّل، اِنْقُرُوا عَلَى كُلِّ صُورَةٍ وَأَصْغُوا لِلَّفْظِ السَّلِيم!', 'letter_n_model_you');
            }
        }

        function clickNItem(itemKey) {
            mascotCelebrates();
            const items = {
                'naml': { title: 'نَمْلٌ نَشِيط', audio: 'letter_n_naml', badge: 'نَـ (مفتوح في أول الكلمة)' },
                'niqaat': { title: 'نِقَاطٌ مُلَوَّنَة', audio: 'letter_n_niqaat', badge: 'نِـ (مكسور في أول الكلمة)' },
                'nujoom': { title: 'نُجُومٌ سَاطِعَة', audio: 'letter_n_nujoom', badge: 'نُـ (مضموم في أول الكلمة)' },
                'hisaan': { title: 'حِصَانٌ سَرِيع', audio: 'letter_n_hisaan', badge: 'ـنُ (منفصل في آخر الكلمة)' },
                'finjaan': { title: 'فِنْجَانُ الشَّاي', audio: 'letter_n_finjaan', badge: 'ـنُ (منفصل بآخرها / فِنْـ ساكن)' },
                'naar': { title: 'نَارٌ دَافِئَة', audio: 'letter_n_naar', badge: 'نَا (مد بالألف في أول الكلمة)' },
                'faanoos': { title: 'فَانُوسٌ مُضِيء', audio: 'letter_n_faanoos', badge: 'ـنُو (مد بالواو في وسط الكلمة)' },
                'neeraan': { title: 'نِيرَانٌ مُشْتَعِلَة', audio: 'letter_n_neeraan', badge: 'نِيـ (مد بالياء)' },
                'nasr': { title: 'نَسْرٌ مُحَلِّق', audio: 'letter_n_nasr', badge: 'نَـ (صوت قصير بالفتحة)' },
                'naar_vowel': { title: 'نَارُ الْمُوقَد', audio: 'letter_n_naar_vowel', badge: 'نَا (صوت طويل بالألف)' },
                'numoor': { title: 'نُمُورٌ قَوِيَّة', audio: 'letter_n_numoor', badge: 'نُـ (صوت قصير بالضمة)' },
                'junood': { title: 'جُنُودُ الْوَطَن', audio: 'letter_n_junood', badge: 'ـنُو (صوت طويل بالواو)' },
                'niqaat_vowel': { title: 'نِقَاطُ الْقَلَم', audio: 'letter_n_niqaat_vowel', badge: 'نِـ (صوت قصير بالكسرة)' },
                'janeen': { title: 'جَنِينٌ غَالٍ', audio: 'letter_n_janeen', badge: 'ـنِيـ (صوت طويل بالياء)' }
            };
            const item = items[itemKey];
            if (item) {
                mascotSpeak('📸 <b>' + item.title + ':</b><br><span style="font-size:1.15rem; color:#4f46e5; font-weight:800;">' + item.badge + '</span>', item.audio);
            }
        }

        function playNVowel(type, vowel) {
            mascotCelebrates();
            if (type === 'short') {
                if (vowel === 'a') mascotSpeak('🎵 <b>حَرْكَةُ الْفَتْحَةِ الْقَصِيرَة:</b><br><b style="color:#4f46e5; font-size:2rem;">نَـ</b>... صَوْتٌ قَصِيرٌ خَفِيف!', 'letter_n_short_a');
                else if (vowel === 'u') mascotSpeak('🎵 <b>حَرْكَةُ الضَّمَّةِ الْقَصِيرَة:</b><br><b style="color:#4f46e5; font-size:2rem;">نُـ</b>... صَوْتٌ قَصِيرٌ مَضْمُوم!', 'letter_n_short_u');
                else if (vowel === 'i') mascotSpeak('🎵 <b>حَرْكَةُ الْكَسْرَةِ الْقَصِيرَة:</b><br><b style="color:#4f46e5; font-size:2rem;">نِـ</b>... صَوْتٌ قَصِيرٌ مَكْسُور!', 'letter_n_short_i');
            } else if (type === 'long') {
                if (vowel === 'a') mascotSpeak('🎵 <b>مَدُّ الأَلِفِ الطَّوِيل:</b><br><b style="color:#3730a3; font-size:2rem;">نَا</b>... نَمُدُّ الصَّوْتَ بِالأَلِف!', 'letter_n_long_a');
                else if (vowel === 'u') mascotSpeak('🎵 <b>مَدُّ الْوَاوِ الطَّوِيل:</b><br><b style="color:#3730a3; font-size:2rem;">نُوْ</b>... نَمُدُّ الصَّوْتَ بِالْوَاو!', 'letter_n_long_u');
                else if (vowel === 'i') mascotSpeak('🎵 <b>مَدُّ الْيَاءِ الطَّوِيل:</b><br><b style="color:#3730a3; font-size:2rem;">نِيـ</b>... نَمُدُّ الصَّوْتَ بِالْيَاء!', 'letter_n_long_i');
            }
        }

        function playNSyllable(syllableKey) {
            mascotCelebrates();
            if (syllableKey === 'bint') {
                mascotSpeak('✊ <b>بِنْتُ:</b> الْمَقْطَعُ السَّاكِنُ هو: <b style="color:#4f46e5; font-size:1.6rem;">بِنْـ ✊</b>', 'letter_n_bint_syllable');
            } else if (syllableKey === 'bunduq') {
                mascotSpeak('✊ <b>بُنْدُقُ:</b> الْمَقْطَعُ السَّاكِنُ هو: <b style="color:#4f46e5; font-size:1.6rem;">بُنْـ ✊</b>', 'letter_n_bunduq_syllable');
            } else if (syllableKey === 'minjal') {
                mascotSpeak('✊ <b>مِنْجَلُ:</b> الْمَقْطَعُ السَّاكِنُ هو: <b style="color:#4f46e5; font-size:1.6rem;">مِنْـ ✊</b>', 'letter_n_minjal_syllable');
            }
        }

        function splitNWord(wordKey) {
            mascotCelebrates();
            if (wordKey === 'noor') {
                const chips = document.getElementById('chips-split-noor');
                if (chips) {
                    chips.style.transform = 'scale(1.12)';
                    setTimeout(() => chips.style.transform = 'scale(1)', 400);
                }
                mascotSpeak('✂️ <b>كَلِمَةُ نُورُ:</b><br>تَتَكَوَّنُ مِنْ مَقْطَعَيْن: [ نُو ] + [ رُ ]! صَفِّقْ مَعِي 👏 👏', 'letter_n_split_noor');
                triggerClapSequence('noor', ['نُو', 'رُ']);
            } else if (wordKey === 'manaar') {
                const chips = document.getElementById('chips-split-manaar');
                if (chips) {
                    chips.style.transform = 'scale(1.12)';
                    setTimeout(() => chips.style.transform = 'scale(1)', 400);
                }
                mascotSpeak('✂️ <b>كَلِمَةُ مَنَارُ:</b><br>تَتَكَوَّنُ مِنْ ثَلاثَةِ مَقَاطِع: [ مَ ] + [ نَا ] + [ رُ ]! صَفِّقْ مَعِي 👏 👏 👏', 'letter_n_split_manaar');
                triggerClapSequence('manaar', ['مَ', 'نَا', 'رُ']);
            } else if (wordKey === 'sinan') {
                const chips = document.getElementById('chips-split-sinan');
                if (chips) {
                    chips.style.transform = 'scale(1.12)';
                    setTimeout(() => chips.style.transform = 'scale(1)', 400);
                }
                mascotSpeak('✂️ <b>كَلِمَةُ سِنَانُ:</b><br>تَتَكَوَّنُ مِنْ ثَلاثَةِ مَقَاطِع: [ سِـ ] + [ نَا ] + [ نُ ]! صَفِّقْ مَعِي 👏 👏 👏', 'letter_n_split_sinan');
                triggerClapSequence('sinan', ['سِـ', 'نَا', 'نُ']);
            } else if (wordKey === 'raneen') {
                const chips = document.getElementById('chips-split-raneen');
                if (chips) {
                    chips.style.transform = 'scale(1.12)';
                    setTimeout(() => chips.style.transform = 'scale(1)', 400);
                }
                mascotSpeak('✂️ <b>كَلِمَةُ رَنِينُ:</b><br>تَتَكَوَّنُ مِنْ ثَلاثَةِ مَقَاطِع: [ رَ ] + [ نِيـ ] + [ نُ ]! صَفِّقْ مَعِي 👏 👏 👏', 'letter_n_split_raneen');
                triggerClapSequence('raneen', ['رَ', 'نِيـ', 'نُ']);
            }
        }

        function mergeNPuzzle(puzzleKey) {
            mascotCelebrates();
            if (puzzleKey === 'numoor') {
                const res = document.getElementById('result-merge-numoor');
                if (res) {
                    res.textContent = 'نُمُورُ';
                    res.style.borderColor = '#4f46e5';
                    res.style.color = '#3730a3';
                    res.style.background = '#e0e7ff';
                    res.style.transform = 'scale(1.15)';
                    setTimeout(() => res.style.transform = 'scale(1)', 400);
                }
                mascotSpeak('🧩 <b>تَرْكِيبُ الْمَقَاطِع:</b><br>[ نُـ ] + [ مُو ] + [ رُ ] = <b style="color:#4f46e5; font-size:1.6rem;">نُمُورُ</b>! أَحْسَنْتَ يَا بَطَل!', 'letter_n_merge_numoor');
            } else if (puzzleKey === 'naar') {
                const res = document.getElementById('result-merge-naar');
                if (res) {
                    res.textContent = 'نَارُ';
                    res.style.borderColor = '#4f46e5';
                    res.style.color = '#3730a3';
                    res.style.background = '#e0e7ff';
                    res.style.transform = 'scale(1.15)';
                    setTimeout(() => res.style.transform = 'scale(1)', 400);
                }
                mascotSpeak('🧩 <b>تَرْكِيبُ الْمَقَاطِع:</b><br>[ نَا ] + [ رُ ] = <b style="color:#4f46e5; font-size:1.6rem;">نَارُ</b>! عَبْقَرِيٌّ حَقًّا!', 'letter_n_merge_naar');
            } else if (puzzleKey === 'nasr') {
                const res = document.getElementById('result-merge-nasr');
                if (res) {
                    res.textContent = 'نَسْرُ';
                    res.style.borderColor = '#4f46e5';
                    res.style.color = '#3730a3';
                    res.style.background = '#e0e7ff';
                    res.style.transform = 'scale(1.15)';
                    setTimeout(() => res.style.transform = 'scale(1)', 400);
                }
                mascotSpeak('🧩 <b>تَرْكِيبُ كَلِمَةِ (نَسْر):</b><br>[ نَسْـ ] + [ رُ ] = <b style="color:#4f46e5; font-size:1.6rem;">نَسْرُ</b>! هَكَذَا صَنَعْنَا كَلِمَةَ نَسْر!', 'letter_n_merge_nasr');
            }
        }

        function playNReadWord(wordKey) {
            mascotCelebrates();
            if (wordKey === 'sentence1') {
                mascotSpeak('📖 <b>«فِي مَرْسَمِ سِنَان»</b><br>عُنْوَانُ النَّصِّ الْجَمِيلِ فِي مَرْسَمِ سِنَان!', 'letter_n_read_sentence1');
            } else if (wordKey === 'sentence2') {
                mascotSpeak('📖 <b>«رَسَمَ فَارِسُ دَادَا»</b><br>فَارِسُ الْبَطَلُ رَسَمَ دَادَا الْحَبِيبَة!', 'letter_n_read_sentence2');
            } else if (wordKey === 'sentence3') {
                mascotSpeak('📖 <b>«رَسَمَ سِنَانُ بَابَا»</b><br>سِنَانٌ الْفَنَّانُ رَسَمَ بَابَا الْعَزِيز!', 'letter_n_read_sentence3');
            } else if (wordKey === 'fee') {
                mascotSpeak('📖 <b>فِي!</b>', 'letter_n_read_word_fee');
            } else if (wordKey === 'marsam') {
                mascotSpeak('📖 <b>مَرْسَمِ!</b>', 'letter_n_read_word_marsam');
            } else if (wordKey === 'sinan') {
                mascotSpeak('📖 <b>سِنَان!</b>', 'letter_n_read_word_sinan');
            } else if (wordKey === 'rasama') {
                mascotSpeak('📖 <b>رَسَمَ!</b>', 'letter_n_read_word_rasama');
            } else if (wordKey === 'faris') {
                mascotSpeak('📖 <b>فَارِسُ!</b>', 'letter_n_read_word_faris');
            } else if (wordKey === 'dada') {
                mascotSpeak('📖 <b>دَادَا!</b>', 'letter_n_read_word_dada');
            } else if (wordKey === 'baba') {
                mascotSpeak('📖 <b>بَابَا!</b>', 'letter_n_read_word_baba');
            } else if (wordKey === 'noor') {
                mascotSpeak('🌟 <b>نُورُ!</b><br>كَلِمَةُ الدَّرْسِ التُّرَاثِيَّةِ الشَّهِيرَة: نُور نُور دَادَا نُور... دَار نُور!', 'letter_n_read_word_noor');
            }
        }

        function playNReadAll() {
            mascotCelebrates();
            mascotSpeak('📖 <b>الْقِرَاءَةُ الْجَمَاعِيَّةُ الشَّامِلَةُ لِدَرْسِ حَرْفِ النُّون:</b><br><span style="font-size:1.35rem; color:#3730a3; font-weight:900;">«فِي مَرْسَمِ سِنَان... رَسَمَ فَارِسُ دَادَا... رَسَمَ سِنَانُ بَابَا!»</span><br>عَفْيَة عَلَيْكُم يَا أَبْطَالَ قِرَاءَتِي الشُّجْعَان! 🌟', 'letter_n_read_all');
        }

        function playNDrawHint() {
            mascotCelebrates();
            mascotSpeak('💡 <b>إِرْشَادُ رَسْمِ حَرْفِ النُّون:</b><br>نَرْسِمُ صَحْنًا صَغِيرًا مُتَّصِلًا عَلَى السَّطْرِ لِلنُّونِ الأُولَى (نـ)، أَوْ صَحْنًا نِصْفَ دَائِرِيٍّ يَنْزِلُ تَحْتَ السَّطْرِ لِلنُّونِ الْكَامِلَة (ن)، وَنَضَعُ نُقْطَةً وَاحِدَةً فِي الأَعْلَى!', 'letter_n_draw_hint');
        }

        function initNCanvas() {
            const canvas = document.getElementById('nDrawingCanvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!nCanvasInited) {
                nCanvasInited = true;
                drawNCanvasGuides(ctx, canvas);

                const startDrawing = (e) => {
                    nDrawing = true;
                    ctx.beginPath();
                    const pos = getCanvasPos(canvas, e);
                    ctx.moveTo(pos.x, pos.y);
                    if (e.cancelable) e.preventDefault();
                };

                const drawMove = (e) => {
                    if (!nDrawing) return;
                    const pos = getCanvasPos(canvas, e);
                    ctx.lineTo(pos.x, pos.y);
                    ctx.strokeStyle = nIsEraser ? '#fffdf5' : nDrawColor;
                    ctx.lineWidth = nIsEraser ? 24 : nLineWidth;
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';
                    ctx.stroke();
                    if (e.cancelable) e.preventDefault();
                };

                const stopDrawing = () => {
                    if (nDrawing) {
                        nDrawing = false;
                        ctx.closePath();
                    }
                };

                canvas.addEventListener('mousedown', startDrawing);
                canvas.addEventListener('mousemove', drawMove);
                window.addEventListener('mouseup', stopDrawing);

                canvas.addEventListener('touchstart', startDrawing, { passive: false });
                canvas.addEventListener('touchmove', drawMove, { passive: false });
                window.addEventListener('touchend', stopDrawing);
            }
        }

        function drawNCanvasGuides(ctx, canvas) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // خط الأساس (سطر الكتابة الأحمر)
            ctx.beginPath();
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 2.5;
            ctx.moveTo(30, 130);
            ctx.lineTo(canvas.width - 30, 130);
            ctx.stroke();

            // خط إرشادي علوي للبداية والنقطة
            ctx.beginPath();
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 4]);
            ctx.moveTo(30, 75);
            ctx.lineTo(canvas.width - 30, 75);
            ctx.stroke();
            ctx.setLineDash([]);

            // خط قاع الصحن نصف الدائري
            ctx.beginPath();
            ctx.strokeStyle = '#818cf8';
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 4]);
            ctx.moveTo(30, 175);
            ctx.lineTo(canvas.width - 30, 175);
            ctx.stroke();
            ctx.setLineDash([]);

            // حروف منقطة إرشادية (نـ ، ن)
            ctx.font = '900 86px "Noto Naskh Arabic", "Cairo", sans-serif';
            ctx.fillStyle = '#c7d2fe';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'alphabetic';
            ctx.fillText('نـ', canvas.width * 0.75, 130);
            ctx.fillText('ن', canvas.width * 0.35, 130);

            // نقطة بداية حمراء للنون الأولى
            ctx.beginPath();
            ctx.arc(canvas.width * 0.77, 85, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#ef4444';
            ctx.fill();

            // نقطة بداية حمراء للنون الكاملة
            ctx.beginPath();
            ctx.arc(canvas.width * 0.42, 95, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#ef4444';
            ctx.fill();

            // تسمية توضيحية
            ctx.font = '700 13px "Cairo", sans-serif';
            ctx.fillStyle = '#64748b';
            ctx.textAlign = 'right';
            ctx.fillText('السطر الأساسي (أحمر)', canvas.width - 40, 122);
            ctx.fillText('ارتفاع النقطة (منقط)', canvas.width - 40, 70);
            ctx.fillText('عمق صحن النون المنفصلة (أزرق)', canvas.width - 40, 170);
        }

        function setNColor(color, btn) {
            nIsEraser = false;
            nDrawColor = color;
            document.querySelectorAll('.color-dot-n').forEach(el => el.classList.remove('active'));
            if (btn) btn.classList.add('active');
        }

        function clearNCanvas() {
            const canvas = document.getElementById('nDrawingCanvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            drawNCanvasGuides(ctx, canvas);
            mascotSpeak('تم مسح السبورة! ارسم حرف النون مرة أخرى بيدك الرائعة!', 'hint_draw');
        }

        /* ========================================================
           دوال درس حرف التاء (تـ ، ت) وقراءة (بَنَات) - ص 41 - 44
        ======================================================== */
        function switchTStation(stationNum) {
            document.querySelectorAll('#view-tab-letter_t .station-tab').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('#view-tab-letter_t .letter-t-station').forEach(el => el.classList.remove('active'));

            const targetStation = document.getElementById('stationT' + stationNum);
            const targetBtn = document.getElementById('btnStationT' + stationNum);

            if (targetStation) targetStation.classList.add('active');
            if (targetBtn) targetBtn.classList.add('active');

            if (stationNum === 1) {
                mascotSpeak('حرف التاء (تـ ، ت)! انقر على بطاقات الكلمات المصورة واستمع لصوت الحرف!', 'letter_t_intro');
            } else if (stationNum === 2) {
                mascotSpeak('أصوات المد القصيرة والطويلة! قارن بين الفتحة والمد بالألف، والضمة والواو، والكسرة والياء لحرف التاء!', 'letter_t_vowels_intro');
            } else if (stationNum === 3) {
                mascotSpeak('المقاطع والتحليل الصوتي! استمع لصوت التاء الساكنة ✊ وحلل كلمات (فَاتِن ، تُوت ، سِرْتُ ، بَنَات) بالصفقات!', 'letter_t_syllables_intro');
            } else if (stationNum === 4) {
                mascotSpeak('تركيب وقراءة (فِي بُسْتَانِ فَاتِن / بَنَات) والرسم! ركّب المقاطع واقرأ وتدرّب على رسم حرف التاء!', 'letter_t_merge_intro');
                setTimeout(initTCanvas, 100);
            }
        }

        function playTLetterSound() {
            mascotCelebrates();
            mascotSpeak('🔴 <b>صَوْتُ حَرْفِ التَّاءِ الصَّافِي:</b><br><span style="font-size:2.2rem; color:#e11d48;">تْ... تْ... تْ</span>', 'letter_t_sound');
        }

        function playTSceneStory() {
            const btn = document.getElementById('btnTSceneStory');
            if (currentAudio && !currentAudio.paused && window._currentPlayingKey === 'letter_t_scene_story') {
                stopAudio();
                if (btn) btn.innerHTML = '<span>🔊</span> <span>اِسْتَمِعْ لِقِصَّةِ بُسْتَانِ فَاتِن وَعَنَاصِرِ حَرْفِ التَّاءِ</span>';
                return;
            }
            mascotCelebrates();
            if (btn) btn.innerHTML = '<span>⏹️</span> <span>إيقاف قصة بستان فاتن</span>';
            mascotSpeak('🍎 <b>فِي بُسْتَانِ فَاتِن:</b><br>«فِي بُسْتَانِ فَاتِن، خَرَجَتِ الأُسْرَةُ إِلَى بُسْتَانِ فَاتِن الْجَمِيل! سَارَ بَابَا فِي الْمَمَرِّ الْمُخْضَرّ، وَسَارَتْ مَامَا تَسْتَمْتِعُ بِالأَزْهَارِ، وَفِي بُسْتَانِ فَاتِن أَشْجَارُ تِينٍ وَتُفَّاحٍ وَتَمْرٍ لَذِيذ، وَالأَطْفَالُ يَمْلَؤُونَ الْبُسْتَانَ بَهْجَةً وَنَشَاطاً!»', 'letter_t_scene_story', () => {
                if (btn) btn.innerHTML = '<span>🔊</span> <span>اِسْتَمِعْ لِقِصَّةِ بُسْتَانِ فَاتِن وَعَنَاصِرِ حَرْفِ التَّاءِ</span>';
            });
        }

        function playTModel(mode) {
            mascotCelebrates();
            if (mode === 'alone') {
                mascotSpeak('🎓 <b>«أَنَا وَحْدِي» نَمْذَجَةُ فَصِيح:</b><br>أَنَا أَنْطِقُ وَحْدِي بِصَوْتٍ مَسْمُوع: <b style="color:#e11d48; font-size:1.5rem;">تَـمْرُ</b>... تَبْدَأُ بِحَرْفِ التَّاءِ الْمَفْتُوح: <b style="color:#9f1239;">تَـ</b>!', 'letter_t_model_alone');
            } else if (mode === 'we') {
                mascotSpeak('🤝 <b>«أَنَا وَأَنْتُمْ» مُمَارَسَةٌ مُوَجَّهَة:</b><br>نَنْطِقُ مَعاً يَا أَبْطَال: <b style="color:#e11d48; font-size:1.5rem;">تُـفَّاحَةُ</b>... فِي أَوَّلِهَا تَاءٌ مَضْمُومَة: <b style="color:#9f1239;">تُـ</b>!', 'letter_t_model_we');
            } else if (mode === 'you') {
                mascotSpeak('⭐ <b>«أَنْتُمْ وَحْدَكُمْ» اِسْتِقْلالِيَّة:</b><br>الآنَ دَوْرُكُمْ وَحْدَكُمْ يَا أَبْطَالَ الصَّفِّ الأَوَّل، اِنْقُرُوا عَلَى كُلِّ صُورَةٍ وَأَصْغُوا لِلَّفْظِ السَّلِيم!', 'letter_t_model_you');
            }
        }

        function clickTItem(itemKey) {
            mascotCelebrates();
            const items = {
                'tamr': { title: 'تَمْرٌ عِرَاقِيّ', audio: 'letter_t_tamr', badge: 'تَـ (مفتوح في أول الكلمة)', desc: 'نَخْلَةٌ وَتَمْرٌ عِرَاقِيٌّ لَذِيذ' },
                'tuffaaha': { title: 'تُفَّاحَةٌ حَمْرَاء', audio: 'letter_t_tuffaaha', badge: 'تُـ (مضموم في أول الكلمة)', desc: 'تُفَّاحَةٌ حَمْرَاءُ حُلْوَة' },
                'toot': { title: 'تُوتٌ طَازَج', audio: 'letter_t_toot', badge: 'تُو (مد طويل بالواو)', desc: 'تُوتٌ طَازَجٌ شَهِيّ' },
                'taaj': { title: 'تَاجُ الْمَلِك', audio: 'letter_t_taaj', badge: 'تَا (مد طويل بالألف)', desc: 'تَاجُ الْمَلِكِ الذَّهَبِيّ' },
                'timsaah': { title: 'تِمْسَاحٌ قَوِيّ', audio: 'letter_t_timsaah', badge: 'تِـ (مكسور في أول الكلمة)', desc: 'تِمْسَاحٌ كَبِيرٌ قَوِيّ' },
                'sitt': { title: 'رَقْمُ سِتَّة', audio: 'letter_t_sitt', badge: 'ـتّ (تاء مشددة في الآخر)', desc: 'رَقْمُ سِتَّة' },
                'ankaboot': { title: 'عَنْكَبُوتٌ نَسَّاج', audio: 'letter_t_ankaboot', badge: 'ت (منفصل في آخر الكلمة)', desc: 'عَنْكَبُوتٌ نَسَّاج' },
                'teen': { title: 'تِينٌ مُبَارَك', audio: 'letter_t_teen', badge: 'تِيـ (مد طويل بالياء)', desc: 'تِينٌ مُبَارَكٌ وَحُلْو' },
                'banaat': { title: 'قِرَاءَةُ بَنَات', audio: 'letter_t_banaat', badge: 'ت (مفتوحة مبسوطة في الآخر)', desc: 'بَنَاتٌ ذَكِيَّاتٌ طَيِّبَات • نُور وَرِيم بَنَات' }
            };

            const it = items[itemKey];
            if (it) {
                mascotSpeak('📸 <b>' + it.title + ':</b><br><span style="font-size:1.8rem; color:#e11d48; font-weight:900;">' + it.title.split(' ')[0] + '</span><br><span style="color:#9f1239; font-weight:700;">' + it.badge + '</span><br>' + it.desc, it.audio);
            }
        }

        function playTVowel(type, vowel) {
            mascotCelebrates();
            if (type === 'short') {
                if (vowel === 'a') mascotSpeak('🔴 <b>فَتْحَةٌ قَصِيرَة:</b><br><span style="font-size:2.5rem; color:#e11d48; font-weight:900;">تَـ</span>', 'letter_t_short_a');
                else if (vowel === 'u') mascotSpeak('🔴 <b>ضَمَّةٌ قَصِيرَة:</b><br><span style="font-size:2.5rem; color:#e11d48; font-weight:900;">تُـ</span>', 'letter_t_short_u');
                else if (vowel === 'i') mascotSpeak('🔴 <b>كَسْرَةٌ قَصِيرَة:</b><br><span style="font-size:2.5rem; color:#e11d48; font-weight:900;">تِـ</span>', 'letter_t_short_i');
            } else {
                if (vowel === 'a') mascotSpeak('🔴 <b>مَدٌّ طَوِيلٌ بِالأَلِف:</b><br><span style="font-size:2.5rem; color:#be123c; font-weight:900;">تَا</span>', 'letter_t_long_a');
                else if (vowel === 'u') mascotSpeak('🔴 <b>مَدٌّ طَوِيلٌ بِالْوَاو:</b><br><span style="font-size:2.5rem; color:#be123c; font-weight:900;">تُو</span>', 'letter_t_long_u');
                else if (vowel === 'i') mascotSpeak('🔴 <b>مَدٌّ طَوِيلٌ بِالْيَاء:</b><br><span style="font-size:2.5rem; color:#be123c; font-weight:900;">تِيـ</span>', 'letter_t_long_i');
            }
        }

        function playTSyllable(syllableKey) {
            mascotCelebrates();
            if (syllableKey === 'makhtoom') {
                mascotSpeak('✊ <b>مَقْطَعٌ سَاكِنٌ مُغْلَق:</b><br>كَلِمَةُ: <b style="color:#9f1239; font-size:1.6rem;">مَخْتُومٌ</b><br>الْمَقْطَعُ السَّاكِنُ مَعَ قَبْضَةِ الْيَد: <b style="color:#e11d48; font-size:1.8rem;">[ مَخْـ ]</b>', 'letter_t_makhtoom_syllable');
            } else if (syllableKey === 'muhtafal') {
                mascotSpeak('✊ <b>مَقْطَعٌ سَاكِنٌ مُغْلَق:</b><br>كَلِمَةُ: <b style="color:#9f1239; font-size:1.6rem;">مُحْتَفَلٌ</b><br>الْمَقْطَعُ السَّاكِنُ مَعَ قَبْضَةِ الْيَد: <b style="color:#e11d48; font-size:1.8rem;">[ مُحْـ ]</b>', 'letter_t_muhtafal_syllable');
            } else if (syllableKey === 'iltafat') {
                mascotSpeak('✊ <b>مَقْطَعٌ سَاكِنٌ مُتَّصِل:</b><br>كَلِمَةُ: <b style="color:#9f1239; font-size:1.6rem;">اِلْتَفَتَ</b><br>الْمَقْطَعُ مَعَ قَبْضَةِ الْيَد: <b style="color:#e11d48; font-size:1.8rem;">[ ـتَفْـ ]</b>', 'letter_t_iltafat_syllable');
            }
        }

        function splitTWord(wordKey) {
            mascotCelebrates();
            if (wordKey === 'faatin') {
                mascotSpeak('👏 <b>تَحْلِيلُ كَلِمَةِ (فَاتِنُ):</b><br><span style="font-size:1.4rem;">👏 [ فَا ] + 👏 [ تِـ ] + 👏 [ نُ ]</span><br><b style="color:#e11d48;">ثَلاثَةُ مَقَاطِعَ مُتَتَالِيَة!</b>', 'letter_t_split_faatin');
            } else if (wordKey === 'toot') {
                mascotSpeak('👏 <b>تَحْلِيلُ كَلِمَةِ (تُوتُ):</b><br><span style="font-size:1.4rem;">👏 [ تُو ] + 👏 [ تُ ]</span><br><b style="color:#e11d48;">مَقْطَعَانِ صَوْتِيَّان!</b>', 'letter_t_split_toot');
            } else if (wordKey === 'sirtu') {
                mascotSpeak('👏 <b>تَحْلِيلُ كَلِمَةِ (سِرْتُ):</b><br><span style="font-size:1.4rem;">👏 [ سِرْ ] + 👏 [ تُ ]</span><br><b style="color:#e11d48;">مَقْطَعَانِ صَوْتِيَّان: سَاكِنٌ ثُمَّ قَصِير!</b>', 'letter_t_split_sirtu');
            } else if (wordKey === 'banaat') {
                mascotSpeak('👏 <b>تَحْلِيلُ كَلِمَةِ (بَنَاتُ):</b><br><span style="font-size:1.4rem;">👏 [ بَـ ] + 👏 [ نَا ] + 👏 [ تُ ]</span><br><b style="color:#e11d48;">ثَلاثَةُ مَقَاطِع: بَـ ... نَا ... تُ!</b>', 'letter_t_split_banaat');
            }
        }

        function mergeTPuzzle(puzzleKey) {
            mascotCelebrates();
            if (puzzleKey === 'tumoor') {
                const res = document.getElementById('result-merge-tumoor');
                if (res) {
                    res.textContent = 'تُمُورُ';
                    res.style.borderColor = '#f43f5e';
                    res.style.color = '#9f1239';
                    res.style.background = '#ffe4e6';
                    res.style.transform = 'scale(1.15)';
                    setTimeout(() => res.style.transform = 'scale(1)', 400);
                }
                mascotSpeak('🧩 <b>تَرْكِيبُ الْمَقَاطِع:</b><br>[ تُـ ] + [ مُو ] + [ رُ ] = <b style="color:#e11d48; font-size:1.6rem;">تُمُورُ</b>! أَحْسَنْتَ يَا بَطَل!', 'letter_t_merge_tumoor');
            } else if (puzzleKey === 'teen') {
                const res = document.getElementById('result-merge-teen');
                if (res) {
                    res.textContent = 'تِينُ';
                    res.style.borderColor = '#f43f5e';
                    res.style.color = '#9f1239';
                    res.style.background = '#ffe4e6';
                    res.style.transform = 'scale(1.15)';
                    setTimeout(() => res.style.transform = 'scale(1)', 400);
                }
                mascotSpeak('🧩 <b>تَرْكِيبُ الْمَقَاطِع:</b><br>[ تِيـ ] + [ نُ ] = <b style="color:#e11d48; font-size:1.6rem;">تِينُ</b>! عَبْقَرِيٌّ حَقًّا!', 'letter_t_merge_teen');
            } else if (puzzleKey === 'tamr') {
                const res = document.getElementById('result-merge-tamr');
                if (res) {
                    res.textContent = 'تَمْرُ';
                    res.style.borderColor = '#f43f5e';
                    res.style.color = '#9f1239';
                    res.style.background = '#ffe4e6';
                    res.style.transform = 'scale(1.15)';
                    setTimeout(() => res.style.transform = 'scale(1)', 400);
                }
                mascotSpeak('🧩 <b>تَرْكِيبُ كَلِمَةِ (تَمْر):</b><br>[ تَـ ] + [ مْـ ] + [ رُ ] = <b style="color:#e11d48; font-size:1.6rem;">تَمْرُ</b>! مُمْتَاز!', 'letter_t_merge_tamr');
            } else if (puzzleKey === 'banaat') {
                const res = document.getElementById('result-merge-banaat');
                if (res) {
                    res.textContent = 'بَنَاتُ';
                    res.style.borderColor = '#e11d48';
                    res.style.color = '#e11d48';
                    res.style.background = '#ffe4e6';
                    res.style.transform = 'scale(1.15)';
                    setTimeout(() => res.style.transform = 'scale(1)', 400);
                }
                mascotSpeak('🧩 <b>تَرْكِيبُ كَلِمَةِ (بَنَات):</b><br>[ بَـ ] + [ نَا ] + [ تُ ] = <b style="color:#e11d48; font-size:1.6rem;">بَنَاتُ</b>! هَكَذَا صَنَعْنَا كَلِمَةَ بَنَات!', 'letter_t_merge_banaat');
            }
        }

        function playTReadWord(wordKey) {
            mascotCelebrates();
            if (wordKey === 'sentence1') {
                mascotSpeak('📖 <b>«فِي بُسْتَانِ فَاتِن»</b><br>عُنْوَانُ النَّصِّ الْجَمِيلِ فِي بُسْتَانِ فَاتِن!', 'letter_t_read_sentence1');
            } else if (wordKey === 'sentence2') {
                mascotSpeak('📖 <b>«سَارَ بَابَا ، سَارَتْ مَامَا»</b><br>سَيْرُ بَابَا وَمَامَا فِي بُسْتَانِ فَاتِن!', 'letter_t_read_sentence2');
            } else if (wordKey === 'sentence3') {
                mascotSpeak('📖 <b>«فِي بُسْتَانِ فَاتِن تِين»</b><br>أَشْجَارُ التِّينِ الْحُلْوِ فِي بُسْتَانِ فَاتِن!', 'letter_t_read_sentence3');
            } else if (wordKey === 'sentence4') {
                mascotSpeak('🌟 <b>«دَادَا رِيم ، نُور وَرِيم بَنَات»</b><br>قِرَاءَةُ بَنَات الأَيْقُونِيَّة: نُور وَرِيم بَنَات!', 'letter_t_read_sentence4');
            } else if (wordKey === 'fee') {
                mascotSpeak('📖 <b>فِي!</b>', 'letter_t_read_word_fee');
            } else if (wordKey === 'bustan') {
                mascotSpeak('📖 <b>بُسْتَانِ!</b>', 'letter_t_read_word_bustan');
            } else if (wordKey === 'faatin') {
                mascotSpeak('📖 <b>فَاتِن!</b>', 'letter_t_read_word_faatin');
            } else if (wordKey === 'saara') {
                mascotSpeak('📖 <b>سَارَ!</b>', 'letter_t_read_word_saara');
            } else if (wordKey === 'baba') {
                mascotSpeak('📖 <b>بَابَا!</b>', 'letter_t_read_word_baba');
            } else if (wordKey === 'saarat') {
                mascotSpeak('📖 <b>سَارَتْ!</b>', 'letter_t_read_word_saarat');
            } else if (wordKey === 'mama') {
                mascotSpeak('📖 <b>مَامَا!</b>', 'letter_t_read_word_mama');
            } else if (wordKey === 'teen') {
                mascotSpeak('📖 <b>تِين!</b>', 'letter_t_read_word_teen');
            } else if (wordKey === 'banaat') {
                mascotSpeak('🌟 <b>بَنَات!</b><br>كَلِمَةُ الدَّرْسِ الشَّهِيرَة: دَادَا رِيم ، نُور وَرِيم بَنَات!', 'letter_t_read_word_banaat');
            }
        }

        function playTReadAll() {
            mascotCelebrates();
            mascotSpeak('📖 <b>الْقِرَاءَةُ الْجَمَاعِيَّةُ الشَّامِلَةُ لِدَرْسِ حَرْفِ التَّاء:</b><br><span style="font-size:1.35rem; color:#9f1239; font-weight:900;">«فِي بُسْتَانِ فَاتِن... سَارَ بَابَا ، سَارَتْ مَامَا... فِي بُسْتَانِ فَاتِن تِين... دَادَا رِيم ، نُور وَرِيم بَنَات!»</span><br>عَفْيَة عَلَيْكُم يَا أَبْطَالَ قِرَاءَتِي الشُّجْعَان! 🌟', 'letter_t_read_all');
        }

        function playTDrawHint() {
            mascotCelebrates();
            mascotSpeak('✏️ <b>إِرْشَادَاتُ رَسْمِ حَرْفِ التَّاءِ:</b><br>«اِبْدَأْ مِنَ النُّقْطَةِ الْحَمْرَاءِ، انْزِلْ إِلَى السَّطْرِ وَامْشِ عَلَيْهِ، ثُمَّ ارْفَعِ السِّنَّ وَضَعْ نُقْطَتَيْنِ فِي الأَعْلَى: نُقْطَة وَنُقْطَة تَفْرَحَان!»', 'letter_t_draw_hint');
        }

        function playTMarbootaIntro() {
            mascotCelebrates();
            mascotSpeak('🌸 <b>مَدْخَلُ التَّاءِ الْمَرْبُوطَةِ (ص ٤٤):</b><br>«هَلْ تَعْلَمُونَ أَنَّ لِلتَّاءِ أُخْتاً لَطِيفَةً تُسَمَّى التَّاءَ الْمَرْبُوطَة (ـة ، ة)؟ نَرَاهَا فِي مَدْرَسَة ، وَحَقِيبَة ، وَمِسْطَرَة!»', 'letter_t_marboota_intro');
        }

        let tDrawColor = '#e11d48';
        let tIsEraser = false;
        let tIsDrawing = false;
        let tLastX = 0;
        let tLastY = 0;

        function initTCanvas() {
            const canvas = document.getElementById('tDrawingCanvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');

            drawTCanvasGuides(ctx, canvas);

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
                tIsDrawing = true;
                const pos = getPos(e);
                tLastX = pos.x;
                tLastY = pos.y;
            }

            function draw(e) {
                if (!tIsDrawing) return;
                e.preventDefault();
                const pos = getPos(e);
                ctx.beginPath();
                ctx.moveTo(tLastX, tLastY);
                ctx.lineTo(pos.x, pos.y);
                ctx.strokeStyle = tIsEraser ? '#fffaf0' : tDrawColor;
                ctx.lineWidth = tIsEraser ? 24 : 7;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.stroke();
                tLastX = pos.x;
                tLastY = pos.y;
            }

            function stopDraw(e) {
                if (tIsDrawing) {
                    tIsDrawing = false;
                }
            }

            canvas.onmousedown = startDraw;
            canvas.onmousemove = draw;
            window.addEventListener('mouseup', stopDraw);

            canvas.ontouchstart = startDraw;
            canvas.ontouchmove = draw;
            window.addEventListener('touchend', stopDraw);
        }

        function drawTCanvasGuides(ctx, canvas) {
            ctx.fillStyle = '#fffaf0';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // خط الأساس (أحمر)
            ctx.beginPath();
            ctx.moveTo(30, 130);
            ctx.lineTo(canvas.width - 30, 130);
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 2.5;
            ctx.stroke();

            // خط ارتفاع الحرف (منقط)
            ctx.beginPath();
            ctx.setLineDash([6, 6]);
            ctx.moveTo(30, 80);
            ctx.lineTo(canvas.width - 30, 80);
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.setLineDash([]);

            // خط النقطتين في الأعلى (منقط وردي)
            ctx.beginPath();
            ctx.setLineDash([4, 4]);
            ctx.moveTo(30, 50);
            ctx.lineTo(canvas.width - 30, 50);
            ctx.strokeStyle = '#fca5a5';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.setLineDash([]);

            // نموذج باهت لحرف التاء (تـ) المتصل وحرف التاء (ت) المنفصل
            ctx.font = '900 78px "Cairo", sans-serif';
            ctx.fillStyle = '#fecdd3';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'alphabetic';
            ctx.fillText('تـ', canvas.width * 0.75, 130);
            ctx.fillText('ت', canvas.width * 0.35, 130);

            // نقطة بداية حمراء للتاء الأولى (تـ)
            ctx.beginPath();
            ctx.arc(canvas.width * 0.78, 85, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#ef4444';
            ctx.fill();

            // نقطة بداية حمراء للتاء الكاملة (ت)
            ctx.beginPath();
            ctx.arc(canvas.width * 0.44, 85, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#ef4444';
            ctx.fill();

            // تسمية توضيحية
            ctx.font = '700 13px "Cairo", sans-serif';
            ctx.fillStyle = '#64748b';
            ctx.textAlign = 'right';
            ctx.fillText('السطر الأساسي (أحمر)', canvas.width - 40, 122);
            ctx.fillText('ارتفاع السن (منقط)', canvas.width - 40, 75);
            ctx.fillText('ارتفاع النقطتين (وردي)', canvas.width - 40, 45);
        }

        function setTColor(color, btn) {
            tIsEraser = false;
            tDrawColor = color;
            document.querySelectorAll('.color-dot-t').forEach(el => el.classList.remove('active'));
            if (btn) btn.classList.add('active');
        }

        function clearTCanvas() {
            const canvas = document.getElementById('tDrawingCanvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            drawTCanvasGuides(ctx, canvas);
            mascotSpeak('تم مسح السبورة! ارسم حرف التاء بنقطتيه الجميلتين بيدك الرائعة!', 'letter_t_draw_hint');
        }



        }

    

        /* ========================================================
           دوال درس التاء المربوطة (ـة ، ة) وقراءة (فِي مَدْرَسَةِ سَارَة) - ص 44 - 46
        ======================================================== */
        function switchMarbootaStation(stationNum) {
            document.querySelectorAll('#view-tab-letter_marboota .station-tab').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('#view-tab-letter_marboota .letter-marboota-station').forEach(el => el.classList.remove('active'));

            const targetStation = document.getElementById('stationMarboota' + stationNum);
            const targetBtn = document.getElementById('btnStationMarboota' + stationNum);

            if (targetStation) targetStation.classList.add('active');
            if (targetBtn) targetBtn.classList.add('active');

            if (stationNum === 1) {
                mascotSpeak('التاء المربوطة (ـة ، ة)! انقر على بطاقات الكلمات المصورة واستمع لصوت الحرف!', 'letter_marboota_intro');
            } else if (stationNum === 2) {
                mascotSpeak('أصوات الحركات والوصل والوقف! استمع لنطق التاء المربوطة مع الفتحة والضمة والكسرة، والفرق بين الوصل والوقف!', 'letter_marboota_vowels_intro');
            } else if (stationNum === 3) {
                mascotSpeak('التمييز والفرز والمقاطع والتحليل الصوتي ص ٤٥! ضع دائرة حول التاء المربوطة، واختر شكلها، وحلل الكلمات بالصفقات!', 'letter_marboota_syllables_intro');
            } else if (stationNum === 4) {
                mascotSpeak('تركيب المقاطع وقراءة (فِي مَدْرَسَةِ سَارَة) والرسم ص ٤٦! ركّب المقاطع واقرأ وتدرّب على رسم التاء المربوطة!', 'letter_marboota_merge_intro');
                setTimeout(initMarbootaCanvas, 100);
            }
        }

        function playMarbootaLetterSound() {
            mascotCelebrates();
            mascotSpeak('🌸 <b>صَوْتُ التَّاءِ الْمَرْبُوطَة:</b><br><span style="font-size:2.2rem; color:#c026d3;">تْ... تْ / هْ... هْ</span>', 'letter_marboota_sound');
        }

        function playMarbootaSceneStory() {
            const btn = document.getElementById('btnMarbootaSceneStory');
            if (currentAudio && !currentAudio.paused && window._currentPlayingKey === 'letter_marboota_scene_story') {
                stopAudio();
                if (btn) btn.innerHTML = '<span>🔊</span> <span>اِسْتَمِعْ لِقِصَّةِ مَدْرَسَةِ سَارَة وَالصَّدِيقَاتِ الثَّلَاث</span>';
                return;
            }
            mascotCelebrates();
            if (btn) btn.innerHTML = '<span>⏹️</span> <span>إيقاف قصة مدرسة سارة</span>';
            mascotSpeak('🏫 <b>فِي مَدْرَسَةِ سَارَة:</b><br>«فِي مَدْرَسَةِ سَارَةَ الْجَمِيلَة، الْتَقَتِ الصَّدِيقَاتُ الثَّلَاثُ فِي الْغُرْفَةِ الصَّفِّيَّةِ الْمُرَتَّبَة. سَارَةُ تَرْسِمُ لَوْحَةً رَائِعَة، وَدِيمَةُ تَدْرُسُ بِجِدٍّ وَاجْتِهَاد، وَسَرْوَةُ تَبْتَسِمُ فَرِحَةً بِلِقَاءِ صَدِيقَاتِهَا وَمُعَلِّمَتِهَا!»', 'letter_marboota_scene_story', () => {
                if (btn) btn.innerHTML = '<span>🔊</span> <span>اِسْتَمِعْ لِقِصَّةِ مَدْرَسَةِ سَارَة وَالصَّدِيقَاتِ الثَّلَاث</span>';
            });
        }

        function playMarbootaModel(mode) {
            mascotCelebrates();
            if (mode === 'alone') {
                mascotSpeak('1️⃣ <b>فَصِيح يُنَمْذِج («أَنَا وَحْدِي»):</b><br>«أَسْتَمِعُ وَأُمَيِّزُ صَوْتَ التَّاءِ الْمَرْبُوطَةِ فِي كَلِمَة: حَقِيبَةُ!»', 'letter_marboota_model_alone');
            } else if (mode === 'we') {
                mascotSpeak('2️⃣ <b>مُمَارَسَةٌ مُوَجَّهَة («أَنَا وَأَنْتُمْ»):</b><br>«نُرَدِّدُ مَعاً بِلِسَانٍ فَصِيح: مَدْرَسَةُ... مَدْرَسَهْ!»', 'letter_marboota_model_we');
            } else if (mode === 'you') {
                mascotSpeak('3️⃣ <b>اِسْتِقْلالِيَّة («أَنْتُمْ وَحْدَكُمْ»):</b><br>«اِسْتَمِعُوا وَحَدِّدُوا صَوْتَ التَّاءِ الْمَرْبُوطَةِ فِي بَقِيَّةِ الْكَلِمَاتِ الْمُصَوَّرَة!»', 'letter_marboota_model_you');
            }
        }

        function clickMarbootaItem(item) {
            mascotCelebrates();
            const items = {
                'haqeebah': { word: 'حَقِيبَةُ', audio: 'letter_marboota_haqeebah', info: 'حَقِيبَةُ (ـة متصلة في آخر الكلمة)' },
                'mimhaah': { word: 'مِمْحَاةُ', audio: 'letter_marboota_mimhaah', info: 'مِمْحَاةُ (ة منفصلة في آخر الكلمة)' },
                'tilmeezah': { word: 'تِلْمِيذَةُ', audio: 'letter_marboota_tilmeezah', info: 'تِلْمِيذَةُ (ة منفصلة في آخر الكلمة)' },
                'madrasah': { word: 'مَدْرَسَةُ', audio: 'letter_marboota_madrasah', info: 'مَدْرَسَةُ (ـة متصلة في آخر الكلمة)' },
                'mibraah': { word: 'مِبْرَاةُ', audio: 'letter_marboota_mibraah', info: 'مِبْرَاةُ (ة منفصلة في آخر الكلمة)' },
                'mistarah': { word: 'مِسْطَرَةُ', audio: 'letter_marboota_mistarah', info: 'مِسْطَرَةُ (ة منفصلة في آخر الكلمة)' }
            };
            const d = items[item];
            if (d) {
                mascotSpeak(`✨ <b>${d.word}</b><br><span style="color:#86198f;">${d.info}</span>`, d.audio);
            }
        }

        function playMarbootaVowelsIntro() {
            mascotCelebrates();
            mascotSpeak('🎵 <b>أَصْوَاتُ التَّاءِ الْمَرْبُوطَةِ مَعَ الْحَرَكَات:</b><br>«نَشَاطُ ٢ صَفْحَة ٤٤: أَنْطِقُ صَوْتَ حَرْفِ (ة ، ـة) مَعَ الْحَرَكَاتِ: فَتْحَة، ضَمَّة، كَسْرَة، وَأُمَيِّزُ صَوْتَهَا عِنْدَ الْوَقْف!»', 'letter_marboota_vowels_intro');
        }

        function playMarbootaVowel(type) {
            mascotCelebrates();
            if (type === 'a') {
                mascotSpeak('🟡 <b>فَتْحَة:</b> ـةَ... ةَ... <span style="font-size:1.8rem; color:#d97706;">تَ!</span>', 'letter_marboota_short_a');
            } else if (type === 'u') {
                mascotSpeak('🔵 <b>ضَمَّة:</b> ـةُ... ةُ... <span style="font-size:1.8rem; color:#2563eb;">تُ!</span>', 'letter_marboota_short_u');
            } else if (type === 'i') {
                mascotSpeak('🟣 <b>كَسْرَة:</b> ـةِ... ةِ... <span style="font-size:1.8rem; color:#7c3aed;">تِ!</span>', 'letter_marboota_short_i');
            }
        }

        function playMarbootaWaqfWasl() {
            mascotCelebrates();
            mascotSpeak('🌟 <b>قَاعِدَةُ التَّاءِ الْمَرْبُوطَةِ الذَّهَبِيَّة:</b><br>«تُنْطَقُ تَاءً عِنْدَ الْحَرَكَةِ وَالْوَصْلِ: مَدْرَسَةُ سَارَة، وَتُنْطَقُ هَاءً عِنْدَ السُّكُونِ وَالْوَقْفِ: مَدْرَسَهْ!»', 'letter_marboota_waqf_wasl');
        }

        function playMarbootaPair(word) {
            mascotCelebrates();
            const pairs = {
                'madrasah': { text: 'مَدْرَسَةُ ↔️ مَدْرَسَهْ', audio: 'letter_marboota_madrasah_vowel' },
                'haqeebah': { text: 'حَقِيبَةُ ↔️ حَقِيبَهْ', audio: 'letter_marboota_haqeebah_vowel' },
                'mistarah': { text: 'مِسْطَرَةُ ↔️ مِسْطَرَهْ', audio: 'letter_marboota_mistarah_vowel' },
                'mimhaah': { text: 'مِمْحَاةُ ↔️ مِمْحَاهْ', audio: 'letter_marboota_mimhaah_vowel' },
                'tilmeezah': { text: 'تِلْمِيذَةُ ↔️ تِلْمِيذَهْ', audio: 'letter_marboota_tilmeezah_vowel' },
                'mibraah': { text: 'مِبْرَاةُ ↔️ مِبْرَاهْ', audio: 'letter_marboota_mibraah_vowel' }
            };
            const p = pairs[word];
            if (p) {
                mascotSpeak(`🔄 <b>مُقَارَنَةُ الْوَصْلِ وَالْوَقْف:</b><br><span style="font-size:1.4rem; color:#86198f;">${p.text}</span>`, p.audio);
            }
        }

        function playMarbootaSyllablesIntro() {
            mascotCelebrates();
            mascotSpeak('🧩 <b>الْمَحَطَّةُ الثَّالِثَة (ص ٤٥):</b><br>«اِكْتَشِفِ الْكَلِمَاتِ الَّتِي تَحْوِي تَاءً مَرْبُوطَة، وَحَدِّدْ شَكْلَهَا الْمُتَّصِلَ أَوِ الْمُنْفَصِل، وَحَلِّلِ الْكَلِمَاتِ بِالصَّفَقَاتِ الْإِيقَاعِيَّة!»', 'letter_marboota_syllables_intro');
        }

        function playMarbootaAct4Intro() {
            mascotCelebrates();
            mascotSpeak('✏️ <b>نَشَاط ٤ صَفْحَة ٤٥:</b><br>«أَرْسُمُ دَائِرَةً حَوْلَ شَكْلِ التَّاءِ الْمَرْبُوطَةِ الْمُنَاسِب: مُتَّصِلَة ـة أَمْ مُنْفَصِلَة ة!»', 'letter_marboota_act4_intro');
        }

        function checkMarbootaAct3(word, isMarboota) {
            mascotCelebrates();
            const el = document.getElementById('act3-' + word);
            const feedbackEl = el ? el.querySelector('.act3-feedback') : null;

            if (isMarboota) {
                if (el) el.classList.add('correct-selected');
                if (feedbackEl) feedbackEl.innerHTML = '<span style="color:#16a34a;">✅ تاء مربوطة! أحسنت!</span>';
            } else {
                if (el) el.classList.add('wrong-selected');
                if (feedbackEl) feedbackEl.innerHTML = '<span style="color:#ef4444;">❌ تاء مفتوحة مبسوطة!</span>';
            }

            const audioMap = {
                'dumyah': 'letter_marboota_dumyah',
                'toot': 'letter_marboota_toot',
                'samakah': 'letter_marboota_samakah',
                'lawhah': 'letter_marboota_lawhah',
                'banaat': 'letter_marboota_banaat'
            };
            if (audioMap[word]) {
                mascotSpeak(isMarboota ? 'أحسنت! هذه الكلمة تحوي تاء مربوطة لطيفة!' : 'انتبه يا بطل! هذه تاء مفتوحة مبسوطة وليست مربوطة!', audioMap[word]);
            }
        }

        function chooseMarbootaShape(word, shape, char, isCorrect) {
            mascotCelebrates();
            const connBtn = document.getElementById('shape-' + word + '-conn');
            const sepBtn = document.getElementById('shape-' + word + '-sep');
            const resEl = document.getElementById('res-shape-' + word);

            if (shape === 'connected') {
                if (connBtn) connBtn.classList.add('selected');
                if (sepBtn) sepBtn.classList.remove('selected');
            } else {
                if (sepBtn) sepBtn.classList.add('selected');
                if (connBtn) connBtn.classList.remove('selected');
            }

            if (isCorrect) {
                if (resEl) resEl.innerHTML = `✅ صحيح! (${char}) متصلة/منفصلة بحسب الحرف السابق!`;
            } else {
                if (resEl) resEl.innerHTML = `<span style="color:#ef4444;">حاول مرة أخرى!</span>`;
            }

            const audioMap = {
                'safeenah': 'letter_marboota_safeenah',
                'lawhah': 'letter_marboota_lawhah_shape',
                'namlah': 'letter_marboota_namlah',
                'mistarah': 'letter_marboota_mistarah_shape',
                'wardah': 'letter_marboota_wardah'
            };
            if (audioMap[word]) {
                mascotSpeak(`شكل التاء المربوطة لكلمة: ${word}`, audioMap[word]);
            }
        }

        function playMarbootaAnalysisIntro() {
            mascotCelebrates();
            mascotSpeak('👏 <b>نَشَاط ٥ صَفْحَة ٤٥:</b><br>«أَقْرَأُ الْكَلِمَاتِ، ثُمَّ أُحَلِّلُهَا إِلَى مَقَاطِعِهَا الصَّوْتِيَّةِ بِالصَّفَقَاتِ الْحَيَّة!»', 'letter_marboota_analysis_intro');
        }

        function playMarbootaSplit(word) {
            mascotCelebrates();
            const splits = {
                'dumyah': { text: '👏 دُمْـ + 👏 يَـ + 👏 تُ = دُمْيَةُ', audio: 'letter_marboota_split_dumyah' },
                'saarah': { text: '👏 سَا + 👏 رَ + 👏 تُ = سَارَةُ', audio: 'letter_marboota_split_saarah' },
                'madrasah': { text: '👏 مَدْ + 👏 رَ + 👏 سَـ + 👏 تُ = مَدْرَسَةُ', audio: 'letter_marboota_split_madrasah' },
                'safeenah': { text: '👏 سَـ + 👏 فِيـ + 👏 نَـ + 👏 تُ = سَفِينَةُ', audio: 'letter_marboota_split_safeenah' }
            };
            const s = splits[word];
            if (s) {
                mascotSpeak(`👏 <b>تَحْلِيلُ الْمَقَاطِع:</b><br><span style="font-size:1.3rem; color:#86198f;">${s.text}</span>`, s.audio);
            }
        }

        function playMarbootaMergeIntro() {
            mascotCelebrates();
            mascotSpeak('🧩 <b>نَشَاط ٦ صَفْحَة ٤٦:</b><br>«أُرَكِّبُ مِنَ الْمَقَاطِعِ التَّالِيَةِ كَلِمَاتٍ، ثُمَّ أَقْرَأُهَا!»', 'letter_marboota_merge_intro');
        }

        function playMarbootaMerge(word) {
            mascotCelebrates();
            const merges = {
                'saarah': { text: 'سَا + رَ + تُ = سَارَةُ', audio: 'letter_marboota_merge_saarah' },
                'saawah': { text: 'سَا + وَ + تُ = سَاوَةُ', audio: 'letter_marboota_merge_saawah' },
                'safeenah': { text: 'سَـ + فِيـ + نَـ + تُ = سَفِينَةُ', audio: 'letter_marboota_merge_safeenah' }
            };
            const m = merges[word];
            if (m) {
                mascotSpeak(`🧩 <b>تَرْكِيبُ الْكَلِمَة:</b><br><span style="font-size:1.4rem; color:#16a34a;">${m.text}</span>`, m.audio);
            }
        }

        function playMarbootaReadAll() {
            mascotCelebrates();
            mascotSpeak('📖 <b>فِي مَدْرَسَةِ سَارَة:</b><br>«فِي مَدْرَسَةِ سَارَة: سَارَةُ تَرْسِمُ. دِيمَةُ تَدْرُسُ. سَرْوَةُ تَبْتَسِمُ.»', 'letter_marboota_read_all');
        }

        function playMarbootaSentence(id) {
            mascotCelebrates();
            if (id === 'title') {
                mascotSpeak('🏫 <b>فِي مَدْرَسَةِ سَارَة</b>', 'letter_marboota_read_sentence_title');
            } else if (id === '1') {
                mascotSpeak('🎨 <b>سَارَةُ تَرْسِمُ</b>', 'letter_marboota_read_sentence1');
            } else if (id === '2') {
                mascotSpeak('📚 <b>دِيمَةُ تَدْرُسُ</b>', 'letter_marboota_read_sentence2');
            } else if (id === '3') {
                mascotSpeak('😊 <b>سَرْوَةُ تَبْتَسِمُ</b>', 'letter_marboota_read_sentence3');
            }
        }

        function playMarbootaWord(word) {
            mascotCelebrates();
            const words = {
                'fee': { text: 'فِي', audio: 'letter_marboota_read_word_fee' },
                'madrasati': { text: 'مَدْرَسَةِ', audio: 'letter_marboota_read_word_madrasati' },
                'saarah': { text: 'سَارَة', audio: 'letter_marboota_read_word_saarah' },
                'saaratu': { text: 'سَارَةُ', audio: 'letter_marboota_read_word_saaratu' },
                'tarsimu': { text: 'تَرْسِمُ', audio: 'letter_marboota_read_word_tarsimu' },
                'deematu': { text: 'دِيمَةُ', audio: 'letter_marboota_read_word_deematu' },
                'tadrusu': { text: 'تَدْرُسُ', audio: 'letter_marboota_read_word_tadrusu' },
                'sarwatu': { text: 'سَرْوَةُ', audio: 'letter_marboota_read_word_sarwatu' },
                'tabtasimu': { text: 'تَبْتَسِمُ', audio: 'letter_marboota_read_word_tabtasimu' }
            };
            const w = words[word];
            if (w) {
                mascotSpeak(`<span style="font-size:1.6rem; color:#86198f;">${w.text}</span>`, w.audio);
            }
        }

        function playMarbootaDrawHint() {
            mascotCelebrates();
            mascotSpeak('🎨 <b>سَبُّورَةُ رَسْمِ التَّاءِ الْمَرْبُوطَة:</b><br>«لِرَسْمِ التَّاءِ الْمُنْفَصِلَة (ة)، اِبْدَأْ مِنْ أَعْلَى السَّطْرِ وَدُرْ بِشَكْلٍ دَائِرِيٍّ لَطِيف، ثُمَّ ضَعْ نُقْطَتَيْنِ فِي الْأَعْلَى! وَلِرَسْمِ التَّاءِ الْمُتَّصِلَة (ـة)، اِمْشِ عَلَى السَّطْرِ، ثُمَّ اصْعَدْ لِلْأَعْلَى وَدُرْ رَأْساً مُسْتَدِيراً وَضَعِ النُّقْطَتَيْن!»', 'letter_marboota_draw_hint');
        }

        function playMarbootaRuleSummary() {
            mascotCelebrates();
            mascotSpeak('🌸 <b>خُلَاصَةُ قَاعِدَةِ فَصِيح:</b><br>«التَّاءُ الْمَفْتُوحَة (ت) تَبْقَى تَاءً فِي الْوَصْلِ وَالْوَقْف، مِثْلَ: بَنَات! أَمَّا التَّاءُ الْمَرْبُوطَة (ـة ، ة) فَتُنْطَقُ تَاءً مَعَ الْحَرَكَة: مَدْرَسَةُ، وَتُنْطَقُ هَاءً عِنْدَ الْوَقْف: مَدْرَسَهْ!»', 'letter_marboota_rule_summary');
        }

        /* كانفاس رسم التاء المربوطة */
        let marbootaIsDrawing = false;
        let marbootaDrawColor = '#c026d3';
        let marbootaLineWidth = 6;
        let marbootaIsEraser = false;
        let marbootaLastX = 0;
        let marbootaLastY = 0;

        function initMarbootaCanvas() {
            const canvas = document.getElementById('marbootaDrawingCanvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');

            drawMarbootaCanvasGuides(ctx, canvas);

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
                marbootaIsDrawing = true;
                const pos = getPos(e);
                marbootaLastX = pos.x;
                marbootaLastY = pos.y;
            }

            function draw(e) {
                if (!marbootaIsDrawing) return;
                e.preventDefault();
                const pos = getPos(e);
                ctx.beginPath();
                ctx.moveTo(marbootaLastX, marbootaLastY);
                ctx.lineTo(pos.x, pos.y);
                ctx.strokeStyle = marbootaIsEraser ? '#ffffff' : marbootaDrawColor;
                ctx.lineWidth = marbootaIsEraser ? 24 : marbootaLineWidth;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.stroke();
                marbootaLastX = pos.x;
                marbootaLastY = pos.y;
            }

            function stopDraw(e) {
                if (marbootaIsDrawing) {
                    marbootaIsDrawing = false;
                }
            }

            canvas.onmousedown = startDraw;
            canvas.onmousemove = draw;
            canvas.onmouseup = stopDraw;
            canvas.onmouseleave = stopDraw;

            canvas.ontouchstart = startDraw;
            canvas.ontouchmove = draw;
            canvas.ontouchend = stopDraw;
        }

        function drawMarbootaCanvasGuides(ctx, canvas) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // خط الأساس الأحمر
            ctx.beginPath();
            ctx.moveTo(30, 160);
            ctx.lineTo(canvas.width - 30, 160);
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 3;
            ctx.stroke();

            // خط النقطتين المنقط
            ctx.beginPath();
            ctx.setLineDash([6, 6]);
            ctx.moveTo(30, 80);
            ctx.lineTo(canvas.width - 30, 80);
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.setLineDash([]);

            // شكل خفيف شفاف للتاء المنفصلة (ة) في اليمين
            ctx.font = '900 80px "Cairo", sans-serif';
            ctx.fillStyle = '#f5d0fe';
            ctx.textAlign = 'center';
            ctx.fillText('ة', canvas.width * 0.72, 160);

            // شكل خفيف شفاف للتاء المتصلة (ـة) في الوسط
            ctx.fillText('ـة', canvas.width * 0.35, 160);

            // نقطة بداية حمراء للتاء المنفصلة
            ctx.beginPath();
            ctx.arc(canvas.width * 0.72, 92, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#ef4444';
            ctx.fill();

            // نقطة بداية حمراء للتاء المتصلة
            ctx.beginPath();
            ctx.arc(canvas.width * 0.42, 160, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#ef4444';
            ctx.fill();

            // تسميات توضيحية
            ctx.font = '700 13px "Cairo", sans-serif';
            ctx.fillStyle = '#64748b';
            ctx.textAlign = 'right';
            ctx.fillText('السطر الأساسي (أحمر)', canvas.width - 40, 155);
            ctx.fillText('ارتفاع النقطتين (منقط)', canvas.width - 40, 75);
        }

        function setMarbootaColor(color, btn) {
            marbootaIsEraser = false;
            marbootaDrawColor = color;
            document.querySelectorAll('.color-dot-marboota').forEach(el => el.classList.remove('active'));
            if (btn) btn.classList.add('active');
        }

        function setMarbootaEraser(btn) {
            marbootaIsEraser = true;
            document.querySelectorAll('.color-dot-marboota').forEach(el => el.classList.remove('active'));
            mascotSpeak('تم اختيار الممحاة! امسح ما تريد من السبورة!', 'hint_draw');
        }

        function clearMarbootaCanvas() {
            const canvas = document.getElementById('marbootaDrawingCanvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            drawMarbootaCanvasGuides(ctx, canvas);
            mascotSpeak('تم مسح السبورة! ارسم التاء المربوطة مرة أخرى بيدك الرائعة!', 'hint_draw');
        }

    

        /* ========================================================
           دوال درس تنوين الضم (ـٌ) وتطبيقاته وقراءة (وَرْدٌ) - ص 47 - 48
        ======================================================== */
        function switchTanweenDhamStation(stationNum) {
            document.querySelectorAll('#view-tab-tanween_dham .station-tab').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('#view-tab-tanween_dham .tanween-dham-station').forEach(el => el.classList.remove('active'));

            const targetStation = document.getElementById('stationTanween' + stationNum);
            const targetBtn = document.getElementById('btnStationTanween' + stationNum);

            if (targetStation) targetStation.classList.add('active');
            if (targetBtn) targetBtn.classList.add('active');

            if (stationNum === 1) {
                mascotSpeak('تنوين الضم (ـٌ)! انقر على بطاقات الكلمات المصورة واستمع لصوت التنوين الرنان!', 'tanween_dham_intro');
            } else if (stationNum === 2) {
                mascotSpeak('التمييز السمعي وتطبيقات التنوين ص ٤٧! استمع لنطق الكلمات وميّز بين الضمة الواحدة وتنوين الضم!', 'tanween_dham_vowels_station');
            } else if (stationNum === 3) {
                mascotSpeak('التحليل والتركيب الصوتي للمقاطع ص ٤٧ و ٤٨! حلل الكلمات بالصفقات وركّب المقاطع!', 'tanween_dham_syllables_station');
            } else if (stationNum === 4) {
                mascotSpeak('لوحة القراءة المقررة وقراءة وَرْدٌ وسبورة الرسم ص ٤٨! اقرأ وتدرب على رسم تنوين الضم!', 'tanween_dham_reading_station');
                setTimeout(initTanweenDhamCanvas, 100);
            }
        }

        function playTanweenDhamSound() {
            mascotCelebrates();
            mascotSpeak('🔔 <b>صَوْتُ تَنْوِينِ الضَّمِّ الرَّنَّان:</b><br><span style="font-size:2.2rem; color:#d97706;">ـٌ... ـٌ ( أُنْ... أُنْ )</span>', 'tanween_dham_sound');
        }

        function playTanweenDhamSceneStory() {
            const btn = document.getElementById('btnTanweenSceneStory');
            if (currentAudio && !currentAudio.paused && window._currentPlayingKey === 'tanween_dham_scene_story') {
                stopAudio();
                if (btn) btn.innerHTML = '<span>🔊</span> <span>اِسْتَمِعْ لِقِصَّةِ تَنْوِينِ الضَّمِّ وَالصَّفِّ النَّشِيط</span>';
                return;
            }
            mascotCelebrates();
            if (btn) btn.innerHTML = '<span>⏹️</span> <span>إيقاف قصة تنوين الضم</span>';
            mascotSpeak('👧 <b>أَتَعَرَّفُ تَنْوِينِ الضَّمّ:</b><br>«فِي صَفِّنَا النَّشِيط، تَقِفُ التِّلْمِيذَةُ فَرِحَةً تَرْفَعُ عَلَامَةَ تَنْوِينِ الضَّمِّ الرَّنَّانَة! حَوْلَهَا كِتَابٌ مُفِيد، وَحَقِيبَةٌ جَمِيلَة، وَفِي بُسْتَانِ فَاتِنَ تُوتٌ وَتِينٌ وَتَمْرٌ، وَفِي سَلَّتِهَا وَرْدٌ عَطِرٌ لَطِيف! مَا أَجْمَلَ تَنْوِينِ الضَّمِّ حِينَ يُزَيِّنُ آخِرَ الْكَلِمَات!»', 'tanween_dham_scene_story', () => {
                if (btn) btn.innerHTML = '<span>🔊</span> <span>اِسْتَمِعْ لِقِصَّةِ تَنْوِينِ الضَّمِّ وَالصَّفِّ النَّشِيط</span>';
            });
        }

        function playTanweenDhamModel(mode) {
            mascotCelebrates();
            if (mode === 'alone') {
                mascotSpeak('1️⃣ <b>فَصِيح يُنَمْذِج («أَنَا وَحْدِي»):</b><br>«أَسْتَمِعُ وَأُمَيِّزُ صَوْتَ تَنْوِينِ الضَّمِّ فِي كَلِمَة: قِـرْدٌ... دٌ... أُنْ!»', 'tanween_dham_model_alone');
            } else if (mode === 'we') {
                mascotSpeak('2️⃣ <b>مُمَارَسَةٌ مُوَجَّهَة («أَنَا وَأَنْتُمْ»):</b><br>«نُرَدِّدُ مَعاً يَا أَبْطَال بِلِسَانٍ فَصِيح: كِـتَـابٌ... بٌ... أُنْ!»', 'tanween_dham_model_we');
            } else if (mode === 'you') {
                mascotSpeak('3️⃣ <b>اِسْتِقْلالِيَّة («أَنْتُمْ وَحْدَكُمْ»):</b><br>«الآنَ دَوْرُكُمْ، اِنْقُرُوا عَلَى الصُّوَرِ وَاسْتَمِعُوا لِصَوْتِ تَنْوِينِ الضَّمِّ فِي كُلِّ كَلِمَةٍ وَرَدِّدُوا!»', 'tanween_dham_model_you');
            }
        }

        function clickTanweenDhamItem(item) {
            mascotCelebrates();
            const items = {
                'qird': { word: 'قِـرْدٌ', audio: 'tanween_dham_qird', info: 'قِـرْدٌ (دٌ : دال منونة بالضم)' },
                'kitab': { word: 'كِـتَـابٌ', audio: 'tanween_dham_kitab', info: 'كِـتَـابٌ (بٌ : باء منونة بالضم)' },
                'lahm': { word: 'لَـحْـمٌ', audio: 'tanween_dham_lahm', info: 'لَـحْـمٌ (مٌ : ميم منونة بالضم)' },
                'haqeebah': { word: 'حَـقِـيـبَـةٌ', audio: 'tanween_dham_haqeebah', info: 'حَـقِـيـبَـةٌ (ـةٌ : تاء مربوطة منونة بالضم)' }
            };
            const d = items[item];
            if (d) {
                mascotSpeak(`✨ <b>${d.word}</b><br><span style="color:#b45309;">${d.info}</span>`, d.audio);
            }
        }

        function playTanweenDhamAct2Intro() {
            mascotCelebrates();
            mascotSpeak('🎵 <b>نَشَاط ٢ صَفْحَة ٤٧:</b><br>«أَسْتَمِعُ لِنُطْقِ الْكَلِمَاتِ، وَأُمَيِّزُ فِيهَا صَوْتَ تَنْوِينِ الضَّمِّ ( ٌ ): مُدِيرَةٌ ، بَابٌ ، لَوْحٌ ، فَارِسٌ!»', 'tanween_dham_act2_intro');
        }

        function clickTanweenDhamAct2Item(item) {
            mascotCelebrates();
            const items = {
                'mudeerah': { word: 'مُـدِيـرَةٌ', audio: 'tanween_dham_mudeerah', info: 'ـةٌ : تاء مربوطة منونة بالضم' },
                'bab': { word: 'بَـابٌ', audio: 'tanween_dham_bab', info: 'بٌ : باء منونة بالضم' },
                'lawh': { word: 'لَـوْحٌ', audio: 'tanween_dham_lawh', info: 'حٌ : حاء منونة بالضم' },
                'faris': { word: 'فَـارِسٌ', audio: 'tanween_dham_faris', info: 'سٌ : سين منونة بالضم' }
            };
            const d = items[item];
            if (d) {
                mascotSpeak(`✨ <b>${d.word}</b><br><span style="color:#b45309;">${d.info}</span>`, d.audio);
            }
        }

        function playTanweenDhamCompareIntro() {
            mascotCelebrates();
            mascotSpeak('🌟 <b>مُقَارَنَةُ الضَّمَّةِ الْوَاحِدَةِ وَتَنْوِينِ الضَّمّ:</b><br>«الضَّمَّةُ الْوَاحِدَةُ (ـُ) صَوْتٌ قَصِير، أَمَّا تَنْوِينُ الضَّمِّ (ـٌ) فَنُنْطِقُهُ نُوناً سَاكِنَةً رَنَّانَة: أُنْ!»', 'tanween_dham_compare_intro');
        }

        function playTanweenDhamPair(pair) {
            mascotCelebrates();
            const pairs = {
                'da': { text: 'دُ ↔️ دٌ (دَارُ ↔️ دَارٌ)', audio: 'tanween_dham_pair_da' },
                'ba': { text: 'بُ ↔️ بُ (بَابُ ↔️ بَابٌ)', audio: 'tanween_dham_pair_ba' },
                'ra': { text: 'رُ ↔️ رٌ (سُوْرُ ↔️ سُوْرٌ)', audio: 'tanween_dham_pair_ra' },
                'ta': { text: 'تُ ↔️ تٌ (تُوتُ ↔️ تُوتٌ)', audio: 'tanween_dham_pair_ta' },
                'na': { text: 'نُ ↔️ نٌ (تِينُ ↔️ تِينٌ)', audio: 'tanween_dham_pair_na' },
                'ward': { text: 'وَرْدُ ↔️ وَرْدٌ', audio: 'tanween_dham_pair_ward' }
            };
            const p = pairs[pair];
            if (p) {
                mascotSpeak(`🔄 <b>مُقَارَنَةُ الضَّمَّةِ وَالتَّنْوِين:</b><br><span style="font-size:1.4rem; color:#b45309;">${p.text}</span>`, p.audio);
            }
        }

        function checkTanweenDhamQuiz(id, isCorrect) {
            mascotCelebrates();
            const el = document.getElementById(id);
            const feedbackEl = el ? el.querySelector('.feedback-txt') : null;

            if (isCorrect) {
                if (el) el.classList.add('correct-selected');
                if (feedbackEl) feedbackEl.innerHTML = '<span style="color:#16a34a;">✅ تنوين ضم! رائع!</span>';
                mascotSpeak('أَحْسَنْتَ يَا بَطَل! إِجَابَةٌ صَحِيحَة، تَنْوِينُ الضَّمِّ رَنَّانٌ وَوَاضِح!', 'tanween_dham_correct');
            } else {
                if (el) el.classList.add('wrong-selected');
                if (feedbackEl) feedbackEl.innerHTML = '<span style="color:#ef4444;">❌ ضمة واحدة أو حركة أخرى!</span>';
                mascotSpeak('اِنْتَبِهْ يَا بَطَل! هَذِهِ ضَمَّةٌ وَاحِدَةٌ أَوْ حَرَكَةٌ أُخْرَى، ابْحَثْ عَنِ التَّنْوِينِ الرَّنَّان!', 'tanween_dham_wrong');
            }
        }

        function playTanweenDhamAnalysisIntro() {
            mascotCelebrates();
            mascotSpeak('👏 <b>نَشَاط ٣ صَفْحَة ٤٧:</b><br>«أَقْرَأُ الْكَلِمَاتِ، ثُمَّ أُحَلِّلُهَا إِلَى مَقَاطِعِهَا الصَّوْتِيَّةِ بِالصَّفْقَاتِ الْحَيَّة!»', 'tanween_dham_analysis_intro');
        }

        function playTanweenDhamSplit(word) {
            mascotCelebrates();
            const splits = {
                'soor': { text: '👏 سُو + 👏 رٌ = سُوْرٌ', audio: 'tanween_dham_split_soor' },
                'sirb': { text: '👏 سِرْ + 👏 بٌ = سِرْبٌ', audio: 'tanween_dham_split_sirb' },
                'ward': { text: '👏 وَرْ + 👏 دٌ = وَرْدٌ', audio: 'tanween_dham_split_ward' }
            };
            const s = splits[word];
            if (s) {
                mascotSpeak(`👏 <b>تَحْلِيلُ الْمَقَاطِع:</b><br><span style="font-size:1.4rem; color:#b45309;">${s.text}</span>`, s.audio);
            }
        }

        function playTanweenDhamBlendIntro() {
            mascotCelebrates();
            mascotSpeak('🧩 <b>نَشَاط ٤ صَفْحَة ٤٨:</b><br>«أُرَكِّبُ الْكَلِمَاتِ مِنَ الْمَقَاطِعِ، ثُمَّ أَقْرَأُهَا!»', 'tanween_dham_blend_intro');
        }

        function playTanweenDhamMerge(word) {
            mascotCelebrates();
            const merges = {
                'toot': { text: 'تُوْ + تٌ = تُوتٌ', audio: 'tanween_dham_merge_toot' },
                'teen': { text: 'تِيْـ + نٌ = تِينٌ', audio: 'tanween_dham_merge_teen' },
                'tamr': { text: 'تَمْـ + رٌ = تَمْرٌ', audio: 'tanween_dham_merge_tamr' },
                'ward': { text: 'وَرْ + دٌ = وَرْدٌ', audio: 'tanween_dham_merge_ward' }
            };
            const m = merges[word];
            if (m) {
                mascotSpeak(`🧩 <b>تَرْكِيبُ الْكَلِمَة:</b><br><span style="font-size:1.4rem; color:#16a34a;">${m.text}</span>`, m.audio);
            }
        }

        function playTanweenDhamReadAll() {
            mascotCelebrates();
            mascotSpeak('📖 <b>قِرَاءَةُ الدَّرْسِ كَامِلاً:</b><br>«سُوْرُ مَدْرَسَتِي مَتِينٌ. فِي بُسْتَانِ فَاتِنَ تُوتٌ. وَتِينٌ وَتَمْرٌ. وَرْدٌ لَطِيفٌ ، وَرْدٌ جَمِيلٌ.»', 'tanween_dham_read_all');
        }

        function playTanweenDhamSentence(id) {
            mascotCelebrates();
            if (id === '1') {
                mascotSpeak('🧱 <b>سُـوْرُ مَدْرَسَتِـي مَتِـيـنٌ</b>', 'tanween_dham_read_s1');
            } else if (id === '2') {
                mascotSpeak('🌳 <b>فِـي بُسْتَانِ فَاتِـنَ تُـوْتٌ</b>', 'tanween_dham_read_s2');
            } else if (id === '3') {
                mascotSpeak('🌴 <b>وَتِـيـنٌ وَتَـمْـرٌ</b>', 'tanween_dham_read_s3');
            } else if (id === 'ward') {
                mascotSpeak('🌸 <b>وَرْدٌ لَطِيفٌ... وَرْدٌ جَمِيلٌ</b>', 'tanween_dham_read_s4_ward');
            }
        }

        function playTanweenDhamWord(word) {
            mascotCelebrates();
            const words = {
                'sooru': { text: 'سُوْرُ', audio: 'tanween_dham_word_sooru' },
                'madrasati': { text: 'مَدْرَسَتِي', audio: 'tanween_dham_word_madrasati' },
                'mateen': { text: 'مَتِينٌ', audio: 'tanween_dham_word_mateen' },
                'fee': { text: 'فِي', audio: 'tanween_dham_word_fee' },
                'bustaani': { text: 'بُسْتَانِ', audio: 'tanween_dham_word_bustaani' },
                'faatina': { text: 'فَاتِنَ', audio: 'tanween_dham_word_faatina' },
                'tootun': { text: 'تُوتٌ', audio: 'tanween_dham_word_tootun' },
                'wateenun': { text: 'وَتِينٌ', audio: 'tanween_dham_word_wateenun' },
                'watamrun': { text: 'وَتَمْرٌ', audio: 'tanween_dham_word_watamrun' },
                'wardun': { text: 'وَرْدٌ', audio: 'tanween_dham_word_wardun' },
                'lateefun': { text: 'لَطِيفٌ', audio: 'tanween_dham_word_lateefun' },
                'jameelun': { text: 'جَمِيلٌ', audio: 'tanween_dham_word_jameelun' }
            };
            const w = words[word];
            if (w) {
                mascotSpeak(`<span style="font-size:1.6rem; color:#b45309;">${w.text}</span>`, w.audio);
            }
        }

        function playTanweenDhamDrawHint() {
            mascotCelebrates();
            mascotSpeak('🎨 <b>سَبُّورَةُ رَسْمِ تَنْوِينِ الضَّمّ:</b><br>«تَنْوِينُ الضَّمِّ عِبَارَةٌ عَنْ ضَمَّتَيْنِ صَغِيرَتَيْنِ أَوْ ضَمَّةٍ مَعَ قَوْسٍ أَعْلَى الْحَرْف، اِرْسِمْهُ بِخِفَّةٍ وَأَنَاقَةٍ فَوْقَ خَطِّ الأَسَاس!»', 'tanween_dham_draw_hint');
        }

        function playTanweenDhamRuleSummary() {
            mascotCelebrates();
            mascotSpeak('🌟 <b>خُلَاصَةُ قَاعِدَةِ فَصِيح:</b><br>«تَنْوِينُ الضَّمِّ هُوَ ضَمَّتَانِ فَوْقَ الْحَرْفِ الأَخِير، نَنْطِقُهُ نُوناً سَاكِنَةً رَنَّانَة (أُنْ)، وَلَا نَكْتُبُ النُّونَ أَبَداً: كِتَابٌ ، بَابٌ ، وَرْدٌ!»', 'tanween_dham_rule_summary');
        }

        /* كانفاس رسم وتتبع تنوين الضم */
        let tanweenIsDrawing = false;
        let tanweenDrawColor = '#d97706';
        let tanweenLineWidth = 6;
        let tanweenIsEraser = false;
        let tanweenLastX = 0;
        let tanweenLastY = 0;

        function initTanweenDhamCanvas() {
            const canvas = document.getElementById('tanweenDhamDrawingCanvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');

            drawTanweenDhamCanvasGuides(ctx, canvas);

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
                tanweenIsDrawing = true;
                const pos = getPos(e);
                tanweenLastX = pos.x;
                tanweenLastY = pos.y;
            }

            function draw(e) {
                if (!tanweenIsDrawing) return;
                e.preventDefault();
                const pos = getPos(e);
                ctx.beginPath();
                ctx.moveTo(tanweenLastX, tanweenLastY);
                ctx.lineTo(pos.x, pos.y);
                ctx.strokeStyle = tanweenIsEraser ? '#ffffff' : tanweenDrawColor;
                ctx.lineWidth = tanweenIsEraser ? 24 : tanweenLineWidth;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.stroke();
                tanweenLastX = pos.x;
                tanweenLastY = pos.y;
            }

            function stopDraw(e) {
                if (tanweenIsDrawing) {
                    tanweenIsDrawing = false;
                }
            }

            canvas.onmousedown = startDraw;
            canvas.onmousemove = draw;
            canvas.onmouseup = stopDraw;
            canvas.onmouseleave = stopDraw;

            canvas.ontouchstart = startDraw;
            canvas.ontouchmove = draw;
            canvas.ontouchend = stopDraw;
        }

        function drawTanweenDhamCanvasGuides(ctx, canvas) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // خط الأساس الأحمر
            ctx.beginPath();
            ctx.moveTo(30, 160);
            ctx.lineTo(canvas.width - 30, 160);
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 3;
            ctx.stroke();

            // خط التنوين المنقط
            ctx.beginPath();
            ctx.setLineDash([6, 6]);
            ctx.moveTo(30, 80);
            ctx.lineTo(canvas.width - 30, 80);
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.setLineDash([]);

            // نموذج حرف الراء مع تنوين الضم شفاف للتتبع
            ctx.font = '900 80px "Cairo", sans-serif';
            ctx.fillStyle = '#fef08a';
            ctx.textAlign = 'center';
            ctx.fillText('رٌ', canvas.width * 0.72, 160);

            // نموذج حرف الباء مع تنوين الضم شفاف للتتبع
            ctx.fillText('ـبٌ', canvas.width * 0.35, 160);

            // نقطة بداية حمراء لتنوين الضم
            ctx.beginPath();
            ctx.arc(canvas.width * 0.72 + 6, 75, 5, 0, Math.PI * 2);
            ctx.fillStyle = '#ef4444';
            ctx.fill();

            ctx.beginPath();
            ctx.arc(canvas.width * 0.35 + 6, 75, 5, 0, Math.PI * 2);
            ctx.fillStyle = '#ef4444';
            ctx.fill();
        }

        function setTanweenDhamColor(color, el) {
            tanweenDrawColor = color;
            tanweenIsEraser = false;
            document.querySelectorAll('.color-dot-tanween').forEach(dot => dot.classList.remove('active'));
            if (el) el.classList.add('active');
        }

        function setTanweenDhamEraser(btn) {
            tanweenIsEraser = true;
            document.querySelectorAll('.color-dot-tanween').forEach(el => el.classList.remove('active'));
            mascotSpeak('تم اختيار الممحاة! امسح ما تريد من السبورة!', 'hint_draw');
        }

        function clearTanweenDhamCanvas() {
            const canvas = document.getElementById('tanweenDhamDrawingCanvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            drawTanweenDhamCanvasGuides(ctx, canvas);
            mascotSpeak('تم مسح السبورة! ارسم تنوين الضم مرة أخرى بيدك الرائعة!', 'hint_draw');
        }

    
        /* ========================================================
           دوال خاتمة الوحدة الثانية: نشيد (مَدْرَسَتِي) وحصاد المهارات وإكليل التفوق (ص 48 - 52)
           إعداد المهندس أسامة خليل هاشم
        ======================================================== */
        function switchUnit2Station(stationNum) {
            document.querySelectorAll('.unit2-station').forEach(el => el.style.display = 'none');
            document.querySelectorAll('#view-tab-unit2_nasheed .station-tab').forEach(el => el.classList.remove('active'));

            const targetStation = document.getElementById('stationUnit2_' + stationNum);
            const targetBtn = document.getElementById('btnStationU2_' + stationNum);

            if (targetStation) targetStation.style.display = 'block';
            if (targetBtn) targetBtn.classList.add('active');

            if (stationNum === 1) {
                mascotSpeak('نَشِيدُ (مَدْرَسَتِي) الْجَمِيل! مَدْرَسَتُنَا بَيْتُنَا الثَّانِي، فِيهَا نَتَعَلَّمُ وَنَلْعَبُ وَنَلْتَقِي بِأَصْدِقَائِنَا وَمُعَلِّمِينَا الْأَعِزَّاء! اِسْتَمِعُوا لِلنَّشِيدِ كَامِلاً أَوْ رَدِّدُوا بَيْتاً فَبَيْتاً مَعِي!', 'unit2_nasheed_intro');
            } else if (stationNum === 2) {
                mascotSpeak('مَحَطَّةُ الْقِرَاءَةِ الْمُقَرَّرَةِ وَتَرْكِيبِ الْمَقَاطِع! اِقْرَأْ جُمَلَ كِتَابِ قِرَاءَتِي بِطَلَاقَةٍ وَفَهْمٍ وَمَيِّزْ الْحُرُوفَ وَالْمُدُودَ وَتَنْوِينَ الضَّمّ!', 'unit2_reading_intro');
            } else if (stationNum === 3) {
                mascotSpeak('حَصَادُ مَهَارَاتِ الْوَحْدَةِ الثَّانِيَة: مَدْرَسَتِي! هَيَّا بِنَا نُرَاجِعُ كَافَّةَ الْحُرُوفِ وَالْأَصْوَاتِ وَتَنْوِينَ الضَّمِّ الَّتِي تَعَلَّمْنَاهَا فِي هَذِهِ الْوَحْدَةِ الْمُبَارَكَة!', 'unit2_harvest_intro');
            } else if (stationNum === 4) {
                mascotSpeak('مَرْحَى يَا أَبْطَالَ الصَّفِّ الْأَوَّل! لَقَدْ أَتْمَمْتُمْ دِرَاسَةَ الْوَحْدَةِ الثَّانِيَة (مَدْرَسَتِي) بِنَجَاحٍ بَاهِرٍ وَتَفَوُّقٍ مُسْتَحَقّ! تَسَلَّمُوا الْآنَ إِكْلِيلَ التَّفَوُّقِ الْمَلَكِيَّ وَشَهَادَةَ التَّمَيُّزِ الرَّسْمِيَّة!', 'unit2_grad_intro');
            }
        }

        function playUnit2NasheedFull() {
            const btn = document.getElementById('btnFullUnit2Nasheed');
            if (currentAudio && !currentAudio.paused && window._currentPlayingKey === 'unit2_nasheed_full') {
                stopAudio();
                if (btn) btn.innerHTML = '🎶 اِسْتَمِعْ لِلنَّشِيدِ كَامِلاً';
                document.querySelectorAll('#unit2NasheedList .nasheed-card').forEach(el => el.classList.remove('active'));
                return;
            }
            mascotCelebrates();
            if (btn) btn.innerHTML = '⏹️ إِيقَافُ النَّشِيد';
            document.querySelectorAll('#unit2NasheedList .nasheed-card').forEach(el => el.classList.remove('active'));
            mascotSpeak('🎵 <b>نَشِيدُ (مَدْرَسَتِي):</b><br>مَـــــدْرَسَتِـي .. مَـــــدْرَسَتِـي .. أُحِبُّـــــهَــا كَـــــإِخْـــوَتِـي .. فِيهَـا وَجَـدْتُ رَاحَتِـــــــي .. وَفَـــــرْحَتِــي وَعِـــــزَّتِـي!', 'unit2_nasheed_full', () => {
                if (btn) btn.innerHTML = '🎶 اِسْتَمِعْ لِلنَّشِيدِ كَامِلاً';
                document.querySelectorAll('#unit2NasheedList .nasheed-card').forEach(el => el.classList.remove('active'));
            });
        }

        function playUnit2NasheedIntro() {
            mascotCelebrates();
            mascotSpeak('💡 <b>مُقَدِّمَةُ النَّشِيد:</b><br>نَشِيدُ مَدْرَسَتِي يُعَبِّرُ عَنْ حُبِّ التِّلْمِيذِ لِمَدْرَسَتِهِ وَمُعَلِّمِيهِ وَزُمَلَائِهِ كَأُسْرَةٍ وَاحِدَة.', 'unit2_nasheed_intro');
        }

        function playUnit2NasheedVerse(num) {
            mascotCelebrates();
            document.querySelectorAll('#unit2NasheedList .nasheed-card').forEach(el => el.classList.remove('active'));
            const card = document.getElementById('u2VerseCard-' + num);
            if (card) card.classList.add('active');

            const verses = {
                1: 'مَـــــدْرَسَتِـي .. مَـــــدْرَسَتِـي 🏫',
                2: 'أُحِبُّـــــهَــا .. كَـــــإِخْـــوَتِـي 💖',
                3: 'فِيهَـا وَجَـدْتُ .. رَاحَتِـــــــي 🌟',
                4: 'وَفَـــــرْحَتِــي .. وَعِـــــزَّتِـي 🇮🇶'
            };
            mascotSpeak(`🎵 <b>الْبَيْتُ (${num}):</b><br><span style="font-size:1.6rem; color:#059669; font-weight:900;">${verses[num]}</span>`, 'unit2_nasheed_verse' + num);
        }

        function playUnit2NasheedWord(wordKey) {
            mascotCelebrates();
            if (wordKey === 'madrasati') {
                mascotSpeak('🏫 <b>مَدْرَسَتِي:</b> الْمَكَانُ الْجَمِيلُ الَّذِي أَتَعَلَّمُ فِيهِ الْقِرَاءَةَ وَالْكِتَابَةَ وَالْأَخْلَاقَ مَعَ زُمَلَائِي!', 'unit2_nasheed_word_madrasati');
            } else if (wordKey === 'ekhwati') {
                mascotSpeak('💖 <b>كَإِخْوَتِي:</b> أُحِبُّ مَدْرَسَتِي وَمُعَلِّمَتِي وَأَصْدِقَائِي فِي الصَّفِّ كَمَا أُحِبُّ إِخْوَتِي فِي الْبَيْتِ تَمَاماً!', 'unit2_nasheed_word_ekhwati');
            } else if (wordKey === 'rahati') {
                mascotSpeak('🌟 <b>رَاحَتِي:</b> أَشْعُرُ فِي مَدْرَسَتِي بِالْأَمَانِ وَالرَّاحَةِ وَالِاطْمِئْنَان!', 'unit2_nasheed_word_rahati');
            } else if (wordKey === 'farhati') {
                mascotSpeak('🎉 <b>فَرْحَتِي:</b> سَعَادَتِي وَبَهْجَتِي حِينَ أَلْعَبُ وَأَنْجَحُ وَأَتَفَوَّق!', 'unit2_nasheed_word_farhati');
            } else if (wordKey === 'izzati') {
                mascotSpeak('🇮🇶 <b>عِزَّتِي:</b> فَخْرِي وَاعْتِزَازِي بِعِلْمِي وَاجْتِهَادِي وَحُبِّي لِوَطَنِي الْعِرَاق!', 'unit2_nasheed_word_izzati');
            }
        }

        function playUnit2ReadingSentence(key) {
            mascotCelebrates();
            document.querySelectorAll('.unit2-reading-line').forEach(el => el.classList.remove('active'));
            if (key === 'soor') {
                const line = document.getElementById('u2ReadLine-1');
                if (line) line.classList.add('active');
                mascotSpeak('🏫 <b>سُوْرُ مَدْرَسَتِي مَتِينٌ</b>', 'unit2_reading_soor');
            } else if (key === 'fatin') {
                const line = document.getElementById('u2ReadLine-2');
                if (line) line.classList.add('active');
                mascotSpeak('🍇 <b>فِي بُسْتَانِ فَاتِنَ تُوتٌ</b>', 'unit2_reading_fatin');
            } else if (key === 'teen_tamr') {
                const line = document.getElementById('u2ReadLine-3');
                if (line) line.classList.add('active');
                mascotSpeak('🌴 <b>وَتِينٌ وَتَمْرٌ</b>', 'unit2_reading_teen_tamr');
            } else if (key === 'cumulative') {
                const line = document.getElementById('u2ReadLine-4');
                if (line) line.classList.add('active');
                mascotSpeak('🎨 <b>سَارَةُ تَرْسُمُ ، دِيمَةُ تَدْرُسُ ، سَرْوَةُ تَبْتَسِمُ</b>', 'unit2_reading_all_sentences');
            }
        }

        function playUnit2ReadingAll() {
            mascotCelebrates();
            document.querySelectorAll('.unit2-reading-line').forEach(el => el.classList.add('active'));
            mascotSpeak('📢 <b>نُصُوصُ الْقِرَاءَةِ الْمُقَرَّرَةِ كَامِلَة:</b><br><span style="font-size:1.4rem; color:#065f46;">سُوْرُ مَدْرَسَتِي مَتِينٌ. فِي بُسْتَانِ فَاتِنَ تُوتٌ وَتِينٌ وَتَمْرٌ. سَارَةُ تَرْسُمُ ، دِيمَةُ تَدْرُسُ ، سَرْوَةُ تَبْتَسِمُ.</span>', 'unit2_reading_all_sentences', () => {
                document.querySelectorAll('.unit2-reading-line').forEach(el => el.classList.remove('active'));
            });
        }

        function playUnit2Syllable(key) {
            mascotCelebrates();
            if (key === 'mateen') {
                mascotSpeak('👏 <b>تَحْلِيلُ كَلِمَةِ مَتِينٌ:</b><br><span style="font-size:1.5rem; color:#065f46;">مَـ (👏) + تِيـ (👏) + نٌ (👏) = مَتِينٌ!</span>', 'unit2_split_mateen');
            } else if (key === 'bustan') {
                mascotSpeak('👏 <b>تَحْلِيلُ كَلِمَةِ بُسْتَانِ:</b><br><span style="font-size:1.5rem; color:#1e3a8a;">بُسْـ (👏) + تَا (👏) + نِ (👏) = بُسْتَانِ!</span>', 'unit2_split_bustan');
            } else if (key === 'madrasati') {
                mascotSpeak('👏 <b>تَحْلِيلُ كَلِمَةِ مَدْرَسَتِي:</b><br><span style="font-size:1.5rem; color:#92400e;">مَدْ (👏) + رَ (👏) + سَـ (👏) + تِي (👏) = مَدْرَسَتِي!</span>', 'unit2_split_madrasati');
            } else if (key === 'toot') {
                mascotSpeak('🍇 <b>تَرْكِيبُ كَلِمَةِ تُوتٌ:</b><br><span style="font-size:1.5rem; color:#1d4ed8;">تُوْ + تٌ = تُوتٌ!</span>', 'unit2_merge_toot');
            } else if (key === 'teen') {
                mascotSpeak('🌿 <b>تَرْكِيبُ كَلِمَةِ تِينٌ:</b><br><span style="font-size:1.5rem; color:#1d4ed8;">تِيْـ + نٌ = تِينٌ!</span>', 'unit2_merge_teen');
            } else if (key === 'tamr') {
                mascotSpeak('🌴 <b>تَرْكِيبُ كَلِمَةِ تَمْرٌ:</b><br><span style="font-size:1.5rem; color:#1d4ed8;">تَمْـ + رٌ = تَمْرٌ!</span>', 'unit2_merge_tamr');
            }
        }

        function playUnit2HarvestIntro() {
            mascotCelebrates();
            mascotSpeak('🏆 <b>حَصَادُ مَهَارَاتِ الْوَحْدَةِ الثَّانِيَة (مَدْرَسَتِي):</b><br>تَعَلَّمْنَا حُرُوفَ (ر ، س ، ن ، ت ، ـة) وَتَنْوِينَ الضَّمِّ (ـٌ) وَقَرَأْنَا أَعْظَمَ النُّصُوص!', 'unit2_harvest_intro');
        }

        function playUnit2HarvestLetter(letter) {
            mascotCelebrates();
            if (letter === 'r') {
                mascotSpeak('🔵 <b>حَرْفُ الرَّاءِ (ر):</b><br>صَوْتُهُ: رْ • أَصْوَاتُهُ: رَ ، رُ ، رِ • كَلِمَاتُهُ: (دَارٌ ، دُور ، رِيم ، مَرَام)', 'unit2_review_r');
            } else if (letter === 's') {
                mascotSpeak('🟣 <b>حَرْفُ السِّينِ (سـ ، س):</b><br>صَوْتُهُ: سْ • أَصْوَاتُهُ: سَـ ، سُـ ، سِـ • كَلِمَاتُهُ: (فِرَاسٌ ، أَنِيس ، مَيْسُون ، سُور)', 'unit2_review_s');
            } else if (letter === 'n') {
                mascotSpeak('🟢 <b>حَرْفُ النُّونِ (نـ ، ن):</b><br>صَوْتُهُ: نْ • أَصْوَاتُهُ: نَـ ، نُـ ، نِـ • كَلِمَاتُهُ: (نُورٌ ، بَان ، نَبْنِي ، نَامَ)', 'unit2_review_n');
            } else if (letter === 't') {
                mascotSpeak('🟠 <b>حَرْفُ التَّاءِ (تـ ، ت):</b><br>صَوْتُهُ: تْ • أَصْوَاتُهُ: تَـ ، تُـ ، تِـ • كَلِمَاتُهُ: (بَنَاتٌ ، بَسْمَة ، تُوتٌ ، تِينٌ ، تَمْرٌ)', 'unit2_review_t');
            } else if (letter === 'marboota') {
                mascotSpeak('🔴 <b>التَّاءُ الْمَرْبُوطَةُ (ـة ، ة):</b><br>صَدِيقَةُ الْأَسْمَاءِ الْمُؤَنَّثَة، نَنْطِقُهَا هَاءً عِنْدَ الْوَقْف وَتَاءً عِنْدَ الْوَصْل • كَلِمَاتُهَا: (سَارَة ، حَدِيقَة ، كُرَة ، سَفِينَة)', 'unit2_review_marboota');
            } else if (letter === 'tanween') {
                mascotSpeak('🔷 <b>تَنْوِينُ الضَّمِّ (ـٌ / ٌ):</b><br>نُونٌ سَاكِنَةٌ نَنْطِقُهَا رَنَّانَةً (أُنْ) فِي آخِرِ الْأَسْمَاءِ، وَنَكْتُبُهَا ضَمَّتَيْنِ دُونَ كِتَابَةِ النُّون! • كَلِمَاتُهُ: (وَرْدٌ ، بَابٌ ، قِرْدٌ ، كِتَابٌ)', 'unit2_review_tanween');
            }
        }

        function playUnit2HarvestAllWords() {
            mascotCelebrates();
            mascotSpeak('🌟 <b>لَوْحَةُ الشَّرَفِ لِكَلِمَاتِ الْوَحْدَةِ الثَّانِيَة:</b><br><span style="font-size:1.6rem; color:#065f46;">دَارٌ ، فِرَاسٌ ، نُورٌ ، بَنَاتٌ ، سَارَةُ ، وَرْدٌ ، مَدْرَسَتِي ، مَتِينٌ ، تُوتٌ ، تِينٌ ، تَمْرٌ!</span>', 'unit2_review_all_words');
        }

        function updateUnit2CertName(name) {
            const display = document.getElementById('certUnit2StudentDisplayName');
            if (display) {
                display.innerText = name.trim() ? name.trim() : 'بَطَلُ قِرَاءَتِي';
            }
        }

        function launchUnit2GradCelebration() {
            mascotCelebrates();
            mascotSpeak('🎉 <b>أَلْفُ مُبَارَكٍ يَا بَطَل!</b> لَقَدْ تَوَّجْتَ نَفْسَكَ بِإِكْلِيلِ التَّفَوُّقِ الْمَلَكِيِّ لِلْوَحْدَةِ الثَّانِيَة! أَنْتُمْ فَخْرُ الْعِرَاقِ وَقَادَةُ الْمُسْتَقْبَل!', 'unit2_grad_cheer');
            const avatar = document.getElementById('mascotAvatar');
            if (avatar) {
                avatar.classList.add('mascot-celebrate');
                setTimeout(() => avatar.classList.remove('mascot-celebrate'), 3500);
            }
        }

        function printUnit2Cert() {
            window.print();
        }

        // منطق اختبار تحدي حصاد الوحدة الثانية
        let unit2QuizScores = { 1: false, 2: false, 3: false, 4: false, 5: false };

        function answerUnit2Quiz(qNum, optNum, isCorrect, btnEl) {
            const card = document.getElementById('quizCard-' + qNum);
            if (!card) return;
            card.querySelectorAll('.unit2-quiz-btn').forEach(b => {
                b.classList.remove('correct', 'wrong');
                b.disabled = true;
            });

            if (isCorrect) {
                btnEl.classList.add('correct');
                unit2QuizScores[qNum] = true;
                mascotCelebrates();
                mascotSpeak('🌟 <b>إِجَابَةٌ رَائِعَةٌ وَصَحِيحَة!</b> أَحْسَنْتَ يَا بَطَلَ الْقِرَاءَة!', 'unit2_quiz_correct');
            } else {
                btnEl.classList.add('wrong');
                unit2QuizScores[qNum] = false;
                mascotSpeak('💡 <b>حَاوِلْ مَرَّةً أُخْرَى بِتَرْكِيز!</b> أَنْتَ بَطَلٌ وَتَسْتَطِيعُ النَّجَاح!', 'unit2_quiz_wrong');
            }

            // تحديث النجوم
            const totalCorrect = Object.values(unit2QuizScores).filter(Boolean).length;
            const badge = document.getElementById('unit2QuizScoreBadge');
            const arabicNums = ['٠', '١', '٢', '٣', '٤', '٥'];
            if (badge) badge.innerText = `⭐ النُّجُومُ الْمُكْتَسَبَة: ${arabicNums[totalCorrect]} / ٥`;

            if (totalCorrect === 5) {
                setTimeout(() => {
                    mascotCelebrates();
                    mascotSpeak('👑 <b>إِنْجَازٌ أُسْطُورِيّ!</b> حَصَلْتَ عَلَى جَمِيعِ النُّجُومِ الْخَمْس! هَنِيئاً لَكَ إِكْلِيلُ التَّفَوُّقِ الْمَلَكِيّ!', 'unit2_quiz_finish');
                }, 1500);
            }
        }
    
