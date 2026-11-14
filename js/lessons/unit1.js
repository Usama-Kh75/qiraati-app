/* ==========================================================================
 * منصة قراءتي التفاعلية الذكية - الوحدة الأولى: أسرتي (Unit 1 Lessons)
 * إعداد وتطوير: المهندس أسامة خليل هاشم
 * ========================================================================== */

        /* ========================================================

           الوحدة الأولى: أسرتي - الدرس الأول: الاستماع والمحادثة (ص 17)

        ======================================================== */

        function switchUnit1Station(stationNum) {

            document.querySelectorAll('.unit1-station').forEach(el => el.style.display = 'none');

            document.querySelectorAll('#view-tab-unit1_family_story .station-tab').forEach(el => el.classList.remove('active'));

            const targetStation = document.getElementById('stationUnit1_' + stationNum);

            const targetBtn = document.getElementById('btnStationUnit1_' + stationNum);

            if (targetStation) targetStation.style.display = 'block';

            if (targetBtn) targetBtn.classList.add('active');

            if (stationNum === 1) {

                mascotSpeak('الاستماع لقصة الأسرة السعيدة! استمع للقصة كاملة وتعرف على دور كل فرد في الأسرة.', 'unit1_welcome');

            } else if (stationNum === 2) {

                mascotSpeak('أنا أتحدث: عبّر عن صور التعاون والقراءة وبر الوالدين، وأجب عن أسئلة فصيح!', 'unit1_q1_desc');

            }

        }

        function playFamilyStory(charKey) {

            mascotCelebrates();

            if (charKey === 'full') {

                mascotSpeak('🏠 <b>قصة أسرتي:</b><br>«نَحْنُ أُسْرَةٌ سَعِيدَةٌ مُتَحَابَّة، يَرْعَانَا أَبِي، وَتَحْنُو عَلَيْنَا أُمِّي، نَعِيشُ فِي مَنْزِلِنَا الدَّافِئِ بِمَحَبَّةٍ وَتَعَاوُن!»', 'unit1_listen_story');

            } else if (charKey === 'father') {

                mascotSpeak('👔 <b>أَبِي الْغَالِي:</b><br>يَعْمَلُ بِنَشَاطٍ لِيَرْعَانَا وَيَحْمِينَا، وَيُوَفِّرَ لَنَا كُلَّ مَا نَحْتَاجُهُ، نُحِبُّهُ وَنُطِيعُهُ!', 'unit1_listen_story');

            } else if (charKey === 'mother') {

                mascotSpeak('🧕 <b>أُمِّي الْحَبِيبَة:</b><br>تَحْنُو عَلَيْنَا وَتَغْمُرُنَا بِعَطْفِهَا، تُعِدُّ لَنَا الطَّعَامَ اللَّذِيذَ وَتَسْهَرُ عَلَى رَاحَتِنَا!', 'unit1_listen_story');

            } else if (charKey === 'brother') {

                mascotSpeak('👦 <b>أَخِي بَاسِم:</b><br>يَتَعَاوَنُ مَعَنَا فِي الْمَنْزِل، وَيَذْهَبُ مَعِي إِلَى الْمَدْرَسَةِ بِنَشَاطٍ وَسُرُور!', 'unit1_story_kitchen');

            } else if (charKey === 'sister') {

                mascotSpeak('👧 <b>أُخْتِي رِيم:</b><br>تُسَاعِدُ أُمَّنَا، وَتَقْرَأُ مَعَنَا الْقِصَصَ، نَلْعَبُ مَعاً بِمَحَبَّةٍ وَأَدَب!', 'unit1_story_living');

            }

        }

        function playUnit1StoryScene(sceneKey) {

            mascotCelebrates();

            if (sceneKey === 'kitchen') {

                mascotSpeak('🍲 <b>الْمَشْهَدُ الْأَوَّل (الْمَطْبَخ):</b><br>«نُسَاعِدُ أُمَّنَا فِي إِعْدَادِ مَائِدَةِ الطَّعَامِ وَتَرْتِيبِهَا بِنِظَامٍ وَنَظَافَة!»', 'unit1_story_kitchen');

            } else if (sceneKey === 'living') {

                mascotSpeak('📚 <b>الْمَشْهَدُ الثَّانِي (غُرْفَةُ الْجُلُوس):</b><br>«نَجْلِسُ فِي غُرْفَةِ الْجُلُوسِ نَقْرَأُ الْقِصَصَ الْمُفِيدَةَ مَعَ أَبِينَا وَأُمِّنَا!»', 'unit1_story_living');

            } else if (sceneKey === 'grandma') {

                mascotSpeak('👵 <b>الْمَشْهَدُ الثَّالِث (بِرُّ الْجَدَّة):</b><br>«نَبَرُّ جَدَّتَنَا، نُقَبِّلُ يَدَيْهَا، وَنُقَدِّمُ لَهَا الْمُسَاعَدَةَ بِابْتِسَامَةٍ وَأَدَب!»', 'unit1_story_grandma');

            }

        }

        function playUnit1Question(qNum) {

            mascotCelebrates();

            if (qNum === 1) {

                mascotSpeak('❓ <b>السؤال الأول:</b> أصف ما أراه في كل صورة: التعاون في إعداد المائدة، القراءة المفيدة، وبر الجدة!', 'unit1_q1_desc');

            } else if (qNum === 2) {

                mascotSpeak('📖 <b>السؤال الثاني:</b> أُكوّن قصة: نبدأ يومنا بالتعاون في المنزل، ثم نقرأ ونتعلم مع والدينا، ونبر جدتنا الحبيبة!', 'unit1_q2_story');

            } else if (qNum === 3) {

                mascotSpeak('❤️ <b>السؤال الثالث:</b> كيف أتعامل مع أسرتي؟ أطيع والديّ وأبرهما، أعطف على إخوتي، وأحترم الكبار دائماً!', 'unit1_q3_deal');

            }

        }

        /* ========================================================

           الوحدة الأولى: أسرتي - الدرس الثاني: حرف الباء وتطبيقاته (ص 18 - 20)

        ======================================================== */

        let bCanvasInited = false;

        let bDrawing = false;

        let bDrawColor = '#dc2626';

        let bIsEraser = false;

        let bLineWidth = 12;

        function switchBStation(stationNum) {

            document.querySelectorAll('.letter-b-station').forEach(el => el.style.display = 'none');

            document.querySelectorAll('#view-tab-letter_b .station-tab').forEach(el => el.classList.remove('active'));

            const targetStation = document.getElementById('stationB' + stationNum);

            const targetBtn = document.getElementById('btnStationB' + stationNum);

            if (targetStation) targetStation.style.display = 'block';

            if (targetBtn) targetBtn.classList.add('active');

            if (stationNum === 1) {

                mascotSpeak('حرف الباء (بـ ، ب)! انقر على بطاقات الكلمات المصورة واستمع لصوت الحرف!', 'letter_b_intro');

            } else if (stationNum === 2) {

                mascotSpeak('أصوات المد القصيرة والطويلة! قارن بين الفتحة والمد بالألف، والضمة والواو، والكسرة والياء!', 'letter_b_vowels_intro');

            } else if (stationNum === 3) {

                mascotSpeak('المقاطع والتحليل الصوتي! استمع لصوت الباء الساكن، وحلل كلمات (باب، بابا، بابي)!', 'letter_b_analysis_intro');

            } else if (stationNum === 4) {

                mascotSpeak('تركيب وقراءة (بابا) مع العصفور! ركّب المقاطع واقرأ وتدرّب على رسم حرف الباء!', 'letter_b_merge_intro');

                setTimeout(initBCanvas, 100);

            }

        }

        function playBLetterSound() {

            mascotCelebrates();

            mascotSpeak('🔴 <b>صَوْتُ حَرْفِ الْبَاء النَّقِيّ:</b><br><span style="font-size:2rem; color:#dc2626;">بْ... بْ... بْ</span>', 'letter_b_sound');

        }

        function playBPicnicStory() {

            const btn = document.getElementById('btnBPicnic');

            if (currentAudio && !currentAudio.paused && window._currentPlayingKey === 'letter_b_picnic_full') {

                stopAudio();

                if (btn) btn.innerHTML = '🧺 استمع لقصة نزهة الأسرة';

                return;

            }

            mascotCelebrates();

            if (btn) btn.innerHTML = '⏹️ إيقاف قصة النزهة';

            mascotSpeak('🧺 <b>نُزْهَةُ الْأُسْرَةِ فِي الرَّبِيع:</b><br>«نَجْلِسُ عَلَى بِسَاطٍ فِي الرَّبِيع، نَأْكُلُ خُبْزاً وَبُرْتُقَالاً، وَنَشْرَبُ حَلِيباً، كُلُّهَا بِصَوْتِ الْبَاء!»', 'letter_b_picnic_full', () => {

                if (btn) btn.innerHTML = '🧺 استمع لقصة نزهة الأسرة';

            });

        }

        function clickBItem(itemKey) {

            mascotCelebrates();

            const items = {

                'baqara': { title: 'بَـقَـرَةٌ', audio: 'letter_b_baqara', desc: 'صوت فتحة قصيرة في أول الكلمة (بَـ)' },

                'burtuqal': { title: 'بُـرْتُـقَـالٌ', audio: 'letter_b_burtuqal', desc: 'صوت ضمة قصيرة في أول الكلمة (بُـ)' },

                'bisat': { title: 'بِـسَـاطٌ', audio: 'letter_b_bisat', desc: 'صوت كسرة قصيرة في أول الكلمة (بِـ)' },

                'halib': { title: 'حَـلِـيـبٌ', audio: 'letter_b_halib', desc: 'صوت الباء في آخر الكلمة (ـبْ)' },

                'khubz': { title: 'خُـبْـزٌ', audio: 'letter_b_khubz', desc: 'صوت الباء الساكن في وسط الكلمة (ـبْـ)' },

                'bab': { title: 'بَـابٌ', audio: 'letter_b_bab', desc: 'صوت مد طويل بالألف (بَا)' },

                'buq': { title: 'بُـوقٌ', audio: 'letter_b_buq', desc: 'صوت مد طويل بالواو (بُو)' },

                'rabi': { title: 'رَ بِيـعٌ', audio: 'letter_b_rabi', desc: 'صوت مد طويل بالياء (بِي)' },

                'basal': { title: 'بَـصَلٌ', audio: 'letter_b_basal', desc: 'صوت فتحة قصيرة (بَـ)' },

                'bittikh': { title: 'بِـطِّيخٌ', audio: 'letter_b_bittikh', desc: 'صوت كسرة قصيرة (بِـ)' }

            };

            const it = items[itemKey];

            if (it) {

                mascotSpeak(`⭐ <b>${it.title}:</b><br>${it.desc}`, it.audio);

            }

        }

        function playBVowel(type, vowel) {

            mascotCelebrates();

            if (type === 'short' && vowel === 'a') {

                mascotSpeak('🔴 <b>فَتْحَةٌ قَصِيرَة:</b><br><span style="font-size:2.2rem; color:#1e40af;">بَـ</span>', 'letter_b_short_a');

            } else if (type === 'long' && vowel === 'a') {

                mascotSpeak('🔴 <b>مَدٌّ بِالْأَلِف (طَوِيل):</b><br><span style="font-size:2.2rem; color:#b91c1c;">بَااا</span>', 'letter_b_long_a');

            } else if (type === 'short' && vowel === 'u') {

                mascotSpeak('🔴 <b>ضَمَّةٌ قَصِيرَة:</b><br><span style="font-size:2.2rem; color:#1e40af;">بُـ</span>', 'letter_b_short_u');

            } else if (type === 'long' && vowel === 'u') {

                mascotSpeak('🔴 <b>مَدٌّ بِالْوَاو (طَوِيل):</b><br><span style="font-size:2.2rem; color:#b91c1c;">بُووو</span>', 'letter_b_long_u');

            } else if (type === 'short' && vowel === 'i') {

                mascotSpeak('🔴 <b>كَسْرَةٌ قَصِيرَة:</b><br><span style="font-size:2.2rem; color:#1e40af;">بِـ</span>', 'letter_b_short_i');

            } else if (type === 'long' && vowel === 'i') {

                mascotSpeak('🔴 <b>مَدٌّ بِالْيَاء (طَوِيل):</b><br><span style="font-size:2.2rem; color:#b91c1c;">بِييي</span>', 'letter_b_long_i');

            }

        }

        function playBSyllable(syllableKey) {

            mascotCelebrates();

            if (syllableKey === 'tabl') {

                mascotSpeak('🥁 <b>طَبْلٌ:</b> الْمَقْطَعُ السَّاكِن هو: <b style="color:#b91c1c; font-size:1.6rem;">طَبْـ</b>', 'letter_b_tabl_syllable');

            } else if (syllableKey === 'jubn') {

                mascotSpeak('🧀 <b>جُبْنٌ:</b> الْمَقْطَعُ السَّاكِن هو: <b style="color:#b91c1c; font-size:1.6rem;">جُبْـ</b>', 'letter_b_jubn_syllable');

            } else if (syllableKey === 'shibl') {

                mascotSpeak('🦁 <b>شِبْلٌ:</b> الْمَقْطَعُ السَّاكِن هو: <b style="color:#b91c1c; font-size:1.6rem;">شِبْـ</b>', 'letter_b_shibl_syllable');

            }

        }

        

        // ==============================================================

        // نظام دليل المعلم: الصفقات الصوتية والنمذجة الصريحة

        // إعداد وتطوير: المهندس أسامة خليل هاشم

        // ==============================================================

        window.currentModelingMode = 'model'; // 'model' (أنا وحدي) أو 'student' (أنتم وحدكم)

        function setModelingMode(letter, mode) {

            window.currentModelingMode = mode;

            document.querySelectorAll('#btnModeModel' + letter + ', #btnModeStudent' + letter).forEach(b => b.classList.remove('active'));

            const activeBtn = document.getElementById(mode === 'model' ? 'btnModeModel' + letter : 'btnModeStudent' + letter);

            if (activeBtn) activeBtn.classList.add('active');

            if (mode === 'model') {

                mascotCelebrates();

                mascotSpeak('🎓 <b>طَوْرُ النَّمْذَجَةِ («أَنَا وَحْدِي»):</b><br>فَصِيح يُمَثِّلُ الْمُعَلِّمَ، سَأُفَكِّرُ بِصَوْتٍ عَالٍ وَأُحَلِّلُ الْمَقَاطِعَ مَعَ الصَّفَقَاتِ أَمَامَكَ!');

            } else {

                mascotCelebrates();

                mascotSpeak('🕹️ <b>طَوْرُ التَّحَدِّي («أَنْتُمْ وَحْدَكُمْ»):</b><br>خُذْ وَقْتَكَ فِي التَّفْكِيرِ (٣٠ ثَانِيَة)، ثُمَّ اضْغَطْ وَحَلِّلِ الْكَلِمَةَ بِنَفْسِكَ يَا بَطَل!');

            }

        }

        function playClapAudio() {

            try {

                const AudioCtx = window.AudioContext || window.webkitAudioContext;

                if (!AudioCtx) return;

                if (!window._clapCtx) window._clapCtx = new AudioCtx();

                const ctx = window._clapCtx;

                if (ctx.state === 'suspended') ctx.resume();

                const duration = 0.09;

                const bufferSize = Math.floor(ctx.sampleRate * duration);

                const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);

                const data = buffer.getChannelData(0);

                for (let i = 0; i < bufferSize; i++) {

                    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.016));

                }

                const noise = ctx.createBufferSource();

                noise.buffer = buffer;

                const filter = ctx.createBiquadFilter();

                filter.type = 'bandpass';

                filter.frequency.setValueAtTime(1150, ctx.currentTime);

                filter.Q.setValueAtTime(2.2, ctx.currentTime);

                const gain = ctx.createGain();

                gain.gain.setValueAtTime(0.75, ctx.currentTime);

                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

                noise.connect(filter);

                filter.connect(gain);

                gain.connect(ctx.destination);

                noise.start();

            } catch (e) {

                console.log('Clap synth audio error:', e);

            }

        }

        function showFloatingClap(syllableText, clapNumber) {

            const bubble = document.createElement('div');

            bubble.className = 'floating-clap-bubble';

            bubble.innerHTML = `👏 صَفْقَة ${clapNumber}: [ ${syllableText} ]`;

            document.body.appendChild(bubble);

            setTimeout(() => bubble.remove(), 650);

        }

        function triggerClapSequence(wordKey, syllables) {

            mascotCelebrates();

            const wordLabels = {

                bab: 'بَابُ', baba: 'بَابَا', babi: 'بَابِي',

                mama: 'مَامَا', bum: 'بُوْمُ',

                dada: 'دَادَا', dood: 'دُودُ',

                fam: 'فَمُ', mufeed: 'مُفِيدُ', dufoof: 'دُفُوفُ'

            };

            const label = wordLabels[wordKey] || wordKey;

            syllables.forEach((syl, idx) => {

                setTimeout(() => {

                    playClapAudio();

                    showFloatingClap(syl, idx + 1);

                }, idx * 600);

            });

            setTimeout(() => {

                mascotCelebrates();

                mascotSpeak(`👏 <b>أَحْسَنْتَ يَا بَطَل!</b><br>كَلِمَةُ <b>(${label})</b> تَتَكَوَّنُ مِنْ <b>(${syllables.length})</b> مَقَاطِع، صَفَّقْنَا لَهَا <b>(${syllables.length})</b> صَفَقَات!`, 'applause');

            }, syllables.length * 600 + 200);

        }

        function openCurrentLessonGuide() {

            if (!window.flatLessonsList || currentLessonIndex < 0 || currentLessonIndex >= flatLessonsList.length) return;

            const lesson = flatLessonsList[currentLessonIndex];

            const modal = document.getElementById('teacherGuideModal');

            if (!modal) return;

            document.getElementById('guideModalLessonTitle').innerText = lesson.title + ` (ص ${lesson.page})`;

            const gInfo = lesson.guideInfo;

            const outcomesList = document.getElementById('guideOutcomesList');

            const strategiesList = document.getElementById('guideStrategiesList');

            const integrationBox = document.getElementById('guideIntegrationBox');

            const tipsBox = document.getElementById('guideTipsBox');

            if (gInfo) {

                outcomesList.innerHTML = gInfo.outcomes.map(o => `

                    <div class="guide-outcome-item">

                        <span class="guide-code-pill">🎯 نتاج رسمي</span>

                        <span class="guide-outcome-text">${o}</span>

                    </div>

                `).join('');

                strategiesList.innerHTML = gInfo.strategies.map(s => `

                    <div class="guide-strategy-item">

                        <span class="guide-bullet">💡</span>

                        <span>${s}</span>

                    </div>

                `).join('');

                integrationBox.innerHTML = `

                    <div class="guide-section-card horizontal-card">

                        <div class="guide-card-header">🌐 التكامل الأفقي مع المواد:</div>

                        <p style="margin: 0; font-weight: 700;">${gInfo.horizontal}</p>

                    </div>

                    <div class="guide-section-card vertical-card">

                        <div class="guide-card-header">📈 التكامل الرأسي (المنهج الحلزوني):</div>

                        <p style="margin: 0; font-weight: 700;">${gInfo.vertical}</p>

                    </div>

                `;

                tipsBox.innerHTML = `

                    <div class="guide-section-card tips-card">

                        <div class="guide-card-header">👨‍🏫 إرشادات وتوجيهات المعلم الصفي من الدليل:</div>

                        <p style="margin: 0; font-weight: 700;">${gInfo.tips}</p>

                    </div>

                `;

            } else {

                outcomesList.innerHTML = '<p style="color:#64748b; font-weight:700;">جاري إضافة النتاجات الرسمية لهذا الدرس قريباً...</p>';

                strategiesList.innerHTML = '<p style="color:#64748b;">-</p>';

                integrationBox.innerHTML = '<p style="color:#64748b;">-</p>';

                tipsBox.innerHTML = '<p style="color:#64748b;">-</p>';

            }

            modal.style.display = 'flex';

            switchGuideTab('outcomes');

        }

        function closeTeacherGuideModal() {

            const modal = document.getElementById('teacherGuideModal');

            if (modal) modal.style.display = 'none';

        }

        function switchGuideTab(tabName) {

            document.querySelectorAll('.guide-modal-tab').forEach(t => t.classList.remove('active'));

            document.querySelectorAll('.guide-tab-pane').forEach(p => p.classList.remove('active'));

            const btn = document.getElementById('btnGuideTab_' + tabName);

            if (btn) btn.classList.add('active');

            const pane = document.getElementById('paneGuideTab_' + tabName);

            if (pane) pane.classList.add('active');

        }

        function splitBWord(wordKey) {

            mascotCelebrates();

            const isModel = window.currentModelingMode === 'model';

            if (wordKey === 'bab') {

                const chips = document.getElementById('chips-split-bab');

                chips.style.transform = 'scale(1.15)';

                setTimeout(() => chips.style.transform = 'scale(1)', 400);

                if (isModel) {

                    mascotSpeak('🎓 <b>نَمْذَجَةُ فَصِيح («أَنَا وَحْدِي»):</b><br>أَسْتَمِعُ لِكَلِمَةِ (بَابُ).. فِيهَا صَوْتَان: <b style="color:#2563eb;">[ بَا ]</b> ➕ <b style="color:#2563eb;">[ بُ ]</b>، إِذَنْ فِيهَا مَقْطَعَانِ! صَفِّقْ مَعِي 👏 👏', 'letter_b_split_bab');

                    triggerClapSequence('bab', ['بَا', 'بُ']);

                } else {

                    mascotSpeak('✂️ <b>كَلِمَةُ (بَابُ):</b><br>مُمْتَاز! تَتَكَوَّنُ مِنْ مَقْطَعَيْن: <b style="color:#2563eb;">[ بَا ]</b> ➕ <b style="color:#2563eb;">[ بُ ]</b> 🌟 أَنْتَ قَارِئٌ مَاهِرٌ!', 'letter_b_split_bab');

                    triggerClapSequence('bab', ['بَا', 'بُ']);

                }

            } else if (wordKey === 'baba') {

                const chips = document.getElementById('chips-split-baba');

                chips.style.transform = 'scale(1.15)';

                setTimeout(() => chips.style.transform = 'scale(1)', 400);

                if (isModel) {

                    mascotSpeak('🎓 <b>نَمْذَجَةُ فَصِيح («أَنَا وَحْدِي»):</b><br>كَلِمَةُ (بَابَا): أَنْطِقُ: <b style="color:#2563eb;">[ بَا ]</b> ثُمَّ <b style="color:#2563eb;">[ بَا ]</b>، فِيهَا مَقْطَعَانِ مُتَطَابِقَانِ! صَفِّقْ مَعِي 👏 👏', 'letter_b_split_baba');

                    triggerClapSequence('baba', ['بَا', 'بَا']);

                } else {

                    mascotSpeak('✂️ <b>كَلِمَةُ (بَابَا):</b><br>رَائِع! تَتَكَوَّنُ مِنْ مَقْطَعَيْن: <b style="color:#2563eb;">[ بَا ]</b> ➕ <b style="color:#2563eb;">[ بَا ]</b> 🌟 أَنْتَ مُحَلِّلٌ ذَكِيٌّ!', 'letter_b_split_baba');

                    triggerClapSequence('baba', ['بَا', 'بَا']);

                }

            } else if (wordKey === 'babi') {

                const chips = document.getElementById('chips-split-babi');

                chips.style.transform = 'scale(1.15)';

                setTimeout(() => chips.style.transform = 'scale(1)', 400);

                if (isModel) {

                    mascotSpeak('🎓 <b>نَمْذَجَةُ فَصِيح («أَنَا وَحْدِي»):</b><br>كَلِمَةُ (بَابِي): أَنْطِقُ: <b style="color:#2563eb;">[ بَا ]</b> ثُمَّ <b style="color:#7c3aed;">[ بِي ]</b>، فِيهَا مَقْطَعَانِ! صَفِّقْ مَعِي 👏 👏', 'letter_b_split_babi');

                    triggerClapSequence('babi', ['بَا', 'بِي']);

                } else {

                    mascotSpeak('✂️ <b>كَلِمَةُ (بَابِي):</b><br>أَحْسَنْتَ! تَتَكَوَّنُ مِنْ مَقْطَعَيْن: <b style="color:#2563eb;">[ بَا ]</b> ➕ <b style="color:#7c3aed;">[ بِي ]</b> 🌟 بَطَلُ الْقِرَاءَةِ!', 'letter_b_split_babi');

                    triggerClapSequence('babi', ['بَا', 'بِي']);

                }

            }

        }

        function mergeBPuzzle(targetWord) {

            mascotCelebrates();

            if (targetWord === 'bab') {

                mascotSpeak('✨ <b>ادمج المقاطع:</b><br>[ بَا ] ➕ [ بُ ] ➔ <b style="font-size:2rem; color:#15803d;">🚪 بَابُ</b>', 'letter_b_merge_bab');

            } else if (targetWord === 'baba') {

                mascotSpeak('✨ <b>ادمج المقاطع:</b><br>[ بَا ] ➕ [ بَا ] ➔ <b style="font-size:2rem; color:#15803d;">👨‍👧‍👦 بَابَا</b>', 'letter_b_merge_baba');

            } else if (targetWord === 'babi') {

                mascotSpeak('✨ <b>ادمج المقاطع:</b><br>[ بَا ] ➕ [ بِي ] ➔ <b style="font-size:2rem; color:#15803d;">🏡 بَابِي</b>', 'letter_b_merge_babi');

            }

        }

        function playBReadWord(word) {

            mascotCelebrates();

            if (word === 'bab') {

                mascotSpeak('📖 اقرأ: <b style="font-size:2.4rem; color:#1e40af;">بَابُ</b> (بَا... بُ)', 'letter_b_merge_bab');

            } else if (word === 'baba') {

                mascotSpeak('📖 اقرأ: <b style="font-size:2.4rem; color:#1e40af;">بَابَا</b> (بَا... بَا)', 'letter_b_merge_baba');

            } else if (word === 'babi') {

                mascotSpeak('📖 اقرأ: <b style="font-size:2.4rem; color:#1e40af;">بَابِي</b> (بَا... بِي)', 'letter_b_merge_babi');

            }

        }

        function playBReadAll() {

            mascotCelebrates();

            mascotSpeak('🐦✨ <b>أَقْرَأُ مَعَ الْعُصْفُورِ الْمُغَرِّد:</b><br><span style="font-size:2.2rem; color:#1e3a8a; font-weight:900;">بَابُ ... بَابَا ... بَابِي</span><br>أَحْسَنْتُمْ يَا أَبْطَالَ الصَّفِّ الْأَوَّل!', 'letter_b_read_all');

        }

        function playBDrawHint() {

            mascotSpeak('🎨 <b>إرشاد رسم حرف الباء:</b><br>نبدأ من أعلى اليمين، ننزل للسطر، نسير لليسار، ثم نصعد قليلاً، ونضع نقطة واحدة في الأسفل!', 'letter_b_draw_hint');

        }

        function initBCanvas() {

            const canvas = document.getElementById('bDrawingCanvas');

            if (!canvas) return;

            const ctx = canvas.getContext('2d');

            if (!bCanvasInited) {

                bCanvasInited = true;

                drawBCanvasGuides(ctx, canvas);

                const startDrawing = (e) => {

                    bDrawing = true;

                    ctx.beginPath();

                    const pos = getCanvasPos(canvas, e);

                    ctx.moveTo(pos.x, pos.y);

                    if (e.cancelable) e.preventDefault();

                };

                const drawMove = (e) => {

                    if (!bDrawing) return;

                    const pos = getCanvasPos(canvas, e);

                    ctx.lineTo(pos.x, pos.y);

                    ctx.strokeStyle = bIsEraser ? '#ffffff' : bDrawColor;

                    ctx.lineWidth = bIsEraser ? 24 : bLineWidth;

                    ctx.lineCap = 'round';

                    ctx.lineJoin = 'round';

                    ctx.stroke();

                    if (e.cancelable) e.preventDefault();

                };

                const stopDrawing = () => {

                    if (bDrawing) {

                        bDrawing = false;

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

        function drawBCanvasGuides(ctx, canvas) {

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.save();

            ctx.fillStyle = '#ffffff';

            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Baseline guide line

            ctx.strokeStyle = '#93c5fd';

            ctx.lineWidth = 3;

            ctx.setLineDash([8, 8]);

            ctx.beginPath();

            ctx.moveTo(20, 200);

            ctx.lineTo(canvas.width - 20, 200);

            ctx.stroke();

            // Dotted Letter B (ب) guide

            ctx.strokeStyle = '#fca5a5';

            ctx.lineWidth = 14;

            ctx.setLineDash([12, 12]);

            ctx.lineCap = 'round';

            ctx.lineJoin = 'round';

            // Draw large Baa plate (left side)

            ctx.beginPath();

            ctx.moveTo(canvas.width * 0.75, 120);

            ctx.lineTo(canvas.width * 0.72, 195);

            ctx.lineTo(canvas.width * 0.45, 195);

            ctx.lineTo(canvas.width * 0.42, 130);

            ctx.stroke();

            // Dot under Baa (left)

            ctx.setLineDash([]);

            ctx.fillStyle = '#ef4444';

            ctx.beginPath();

            ctx.arc(canvas.width * 0.58, 245, 9, 0, Math.PI * 2);

            ctx.fill();

            // Initial Baa (بـ) guide (right side)

            ctx.strokeStyle = '#fed7aa';

            ctx.lineWidth = 14;

            ctx.setLineDash([12, 12]);

            ctx.beginPath();

            ctx.moveTo(canvas.width * 0.32, 120);

            ctx.lineTo(canvas.width * 0.30, 195);

            ctx.lineTo(canvas.width * 0.12, 195);

            ctx.stroke();

            // Dot under initial Baa

            ctx.setLineDash([]);

            ctx.fillStyle = '#f97316';

            ctx.beginPath();

            ctx.arc(canvas.width * 0.25, 245, 9, 0, Math.PI * 2);

            ctx.fill();

            // Hint label

            ctx.font = 'bold 15px "Tajawal", sans-serif';

            ctx.fillStyle = '#dc2626';

            ctx.textAlign = 'center';

            ctx.fillText('① الباء المنفصلة (ب) مع النقطة بالأسفل  |  ② الباء في أول الكلمة (بـ)', canvas.width / 2, 290);

            ctx.restore();

        }

        function clearBCanvas() {

            const canvas = document.getElementById('bDrawingCanvas');

            if (!canvas) return;

            const ctx = canvas.getContext('2d');

            drawBCanvasGuides(ctx, canvas);

        }

        function setBDrawColor(color, el) {

            bIsEraser = false;

            bDrawColor = color;

            document.querySelectorAll('.color-dot-b').forEach(d => d.classList.remove('active'));

            if (el) el.classList.add('active');

        }

        function setBEraser(el) {

            bIsEraser = true;

            document.querySelectorAll('.color-dot-b').forEach(d => d.classList.remove('active'));

            if (el) el.classList.add('active');

        }

        /* ========================================================

           الوحدة الأولى: أسرتي - الدرس الثالث: حرف الميم وتكوين (مَامَا) (ص 21 - 23)

        ======================================================== */

        let mCanvasInited = false;

        let mDrawing = false;

        let mDrawColor = '#c026d3';

        let mIsEraser = false;

        let mLineWidth = 12;

        function switchMStation(stationNum) {

            document.querySelectorAll('.letter-m-station').forEach(el => el.style.display = 'none');

            document.querySelectorAll('#view-tab-letter_m .station-tab').forEach(el => el.classList.remove('active'));

            const targetStation = document.getElementById('stationM' + stationNum);

            const targetBtn = document.getElementById('btnStationM' + stationNum);

            if (targetStation) targetStation.style.display = 'block';

            if (targetBtn) targetBtn.classList.add('active');

            if (stationNum === 1) {

                mascotSpeak('حرف الميم (مـ ، م)! انقر على بطاقات الكلمات المصورة واستمع لصوت الحرف!', 'letter_m_intro');

            } else if (stationNum === 2) {

                mascotSpeak('أصوات المد القصيرة والطويلة! قارن بين الفتحة والمد بالألف، والضمة والواو، والكسرة والياء!', 'letter_m_vowels_intro');

            } else if (stationNum === 3) {

                mascotSpeak('المقاطع والتحليل الصوتي! استمع لصوت الميم الساكن، وحلل كلمات (مَامَا، بُوم)!', 'letter_m_analysis_intro');

            } else if (stationNum === 4) {

                mascotSpeak('تركيب وقراءة (مَامَا) مع العصفور! ركّب المقاطع واقرأ وتدرّب على رسم حرف الميم!', 'letter_m_merge_intro');

                setTimeout(initMCanvas, 100);

            }

        }

        function playMLetterSound() {

            mascotCelebrates();

            mascotSpeak('🟣 <b>صَوْتُ حَرْفِ الْمِيم النَّقِيّ:</b><br><span style="font-size:2rem; color:#c026d3;">مْ... مْ... مْ</span>', 'letter_m_sound');

        }

        function playMSceneStory() {

            const btn = document.getElementById('btnMSceneStory');

            if (currentAudio && !currentAudio.paused && window._currentPlayingKey === 'letter_m_scene_story') {

                stopAudio();

                if (btn) btn.innerHTML = '🎧 استمع لقصة الأسرة في غرفة المعيشة';

                return;

            }

            mascotCelebrates();

            if (btn) btn.innerHTML = '⏹️ إيقاف قصة الأسرة';

            mascotSpeak('👩‍👧‍👦 <b>فِي بَيْتِ الأُسْرَةِ السَّعِيدَة:</b><br>«تَجْلِسُ مَامَا مَعَ أَبْنَائِهَا، حَوْلَهَا مَوْزٌ، وَلَيْمُونٌ، وَمِيزَانٌ، وَمِفْتَاحٌ، وَمِزْمَار! كُلُّهَا بِصَوْتِ الْمِيم!»', 'letter_m_scene_story', () => {

                if (btn) btn.innerHTML = '🎧 استمع لقصة الأسرة في غرفة المعيشة';

            });

        }

        function clickMItem(itemKey) {

            mascotCelebrates();

            const items = {

                'mawz': { title: 'مَـوْزٌ', audio: 'letter_m_mawz', desc: 'صوت فتحة قصيرة في أول الكلمة (مَـ)' },

                'murabba': { title: 'مُـرَبَّـعٌ', audio: 'letter_m_murabba', desc: 'صوت ضمة قصيرة في أول الكلمة (مُـ)' },

                'miftah': { title: 'مِـفْـتَـاحٌ', audio: 'letter_m_miftah', desc: 'صوت كسرة قصيرة في أول الكلمة (مِـ)' },

                'thawm': { title: 'ثُـومٌ', audio: 'letter_m_thawm', desc: 'صوت الميم في آخر الكلمة (ـمْ)' },

                'qamh': { title: 'قَـمْـحٌ', audio: 'letter_m_qamh', desc: 'صوت الميم الساكن في وسط الكلمة (ـمْـ)' },

                'mizmar': { title: 'مِـزْمَـارٌ', audio: 'letter_m_mizmar', desc: 'كسرة (مِـ) في الأول ومد بالألف (مَا) في الوسط' },

                'laymun': { title: 'لَـيْـمُـونٌ', audio: 'letter_m_laymun', desc: 'صوت مد طويل بالواو في وسط الكلمة (مُو)' },

                'mizan': { title: 'مِـيـزَانٌ', audio: 'letter_m_mizan', desc: 'صوت مد طويل بالياء في أول الكلمة (مِيـ)' },

                'mawz_vowel': { title: 'مَـوْزٌ', audio: 'letter_m_mawz_vowel', desc: 'صوت فتحة قصيرة (مَـ)' },

                'muthallath': { title: 'مُـثَلَّـثٌ', audio: 'letter_m_muthallath', desc: 'صوت ضمة قصيرة (مُـ)' },

                'miqas': { title: 'مِـقَصٌّ', audio: 'letter_m_miqas', desc: 'صوت كسرة قصيرة (مِـ)' },

                'mizmar_vowel': { title: 'مِـزْمَـارٌ', audio: 'letter_m_mizmar_vowel', desc: 'مد طويل بالألف (مَا)' },

                'laymun_vowel': { title: 'لَـيْـمُـونٌ', audio: 'letter_m_laymun_vowel', desc: 'مد طويل بالواو (مُو)' },

                'mizan_vowel': { title: 'مِـيـزَانٌ', audio: 'letter_m_mizan_vowel', desc: 'مد طويل بالياء (مِيـ)' }

            };

            const it = items[itemKey];

            if (it) {

                mascotSpeak(`⭐ <b>${it.title}:</b><br>${it.desc}`, it.audio);

            }

        }

        function playMVowel(type, vowel) {

            mascotCelebrates();

            if (type === 'short' && vowel === 'a') {

                mascotSpeak('🟣 <b>فَتْحَةٌ قَصِيرَة:</b><br><span style="font-size:2.2rem; color:#1e40af;">مَـ</span>', 'letter_m_short_a');

            } else if (type === 'long' && vowel === 'a') {

                mascotSpeak('🟣 <b>مَدٌّ بِالْأَلِف (طَوِيل):</b><br><span style="font-size:2.2rem; color:#c026d3;">مَااا</span>', 'letter_m_long_a');

            } else if (type === 'short' && vowel === 'u') {

                mascotSpeak('🟣 <b>ضَمَّةٌ قَصِيرَة:</b><br><span style="font-size:2.2rem; color:#1e40af;">مُـ</span>', 'letter_m_short_u');

            } else if (type === 'long' && vowel === 'u') {

                mascotSpeak('🟣 <b>مَدٌّ بِالْوَاو (طَوِيل):</b><br><span style="font-size:2.2rem; color:#c026d3;">مُووو</span>', 'letter_m_long_u');

            } else if (type === 'short' && vowel === 'i') {

                mascotSpeak('🟣 <b>كَسْرَةٌ قَصِيرَة:</b><br><span style="font-size:2.2rem; color:#1e40af;">مِـ</span>', 'letter_m_short_i');

            } else if (type === 'long' && vowel === 'i') {

                mascotSpeak('🟣 <b>مَدٌّ بِالْيَاء (طَوِيل):</b><br><span style="font-size:2.2rem; color:#c026d3;">مِييي</span>', 'letter_m_long_i');

            }

        }

        function playMSyllable(syllableKey) {

            mascotCelebrates();

            if (syllableKey === 'tamr') {

                mascotSpeak('🌴 <b>تَمْرٌ:</b> الْمَقْطَعُ السَّاكِن هو: <b style="color:#c026d3; font-size:1.6rem;">تَمْـ</b>', 'letter_m_tamr_syllable');

            } else if (syllableKey === 'namr') {

                mascotSpeak('🐆 <b>نَمْرٌ:</b> الْمَقْطَعُ السَّاكِن هو: <b style="color:#c026d3; font-size:1.6rem;">نَمْـ</b>', 'letter_m_namr_syllable');

            } else if (syllableKey === 'timsah') {

                mascotSpeak('🐊 <b>تِمْسَاحٌ:</b> الْمَقْطَعُ السَّاكِن هو: <b style="color:#c026d3; font-size:1.6rem;">تِمْـ</b>', 'letter_m_timsah_syllable');

            }

        }

        function splitMWord(wordKey) {

            mascotCelebrates();

            const isModel = window.currentModelingMode === 'model';

            if (wordKey === 'mama') {

                const chips = document.getElementById('chips-split-mama');

                chips.style.transform = 'scale(1.15)';

                setTimeout(() => chips.style.transform = 'scale(1)', 400);

                if (isModel) {

                    mascotSpeak('🎓 <b>نَمْذَجَةُ فَصِيح («أَنَا وَحْدِي»):</b><br>كَلِمَةُ (مَامَا): أَنْطِقُ <b style="color:#c026d3;">[ مَا ]</b> ثُمَّ <b style="color:#c026d3;">[ مَا ]</b>، مَقْطَعَانِ مُتَشَابِهَانِ! صَفِّقْ مَعِي 👏 👏', 'letter_m_split_mama');

                    triggerClapSequence('mama', ['مَا', 'مَا']);

                } else {

                    mascotSpeak('✂️ <b>كَلِمَةُ (مَامَا):</b><br>مُمْتَاز! تَتَكَوَّنُ مِنْ مَقْطَعَيْن: <b style="color:#c026d3;">[ مَا ]</b> ➕ <b style="color:#c026d3;">[ مَا ]</b> 🌟 أَنْتَ قَارِئٌ مَاهِرٌ!', 'letter_m_split_mama');

                    triggerClapSequence('mama', ['مَا', 'مَا']);

                }

            } else if (wordKey === 'bum') {

                const chips = document.getElementById('chips-split-bum');

                chips.style.transform = 'scale(1.15)';

                setTimeout(() => chips.style.transform = 'scale(1)', 400);

                if (isModel) {

                    mascotSpeak('🎓 <b>نَمْذَجَةُ فَصِيح («أَنَا وَحْدِي»):</b><br>كَلِمَةُ (بُوْمُ): أَنْطِقُ <b style="color:#2563eb;">[ بُو ]</b> ثُمَّ <b style="color:#c026d3;">[ مُ ]</b>، فِيهَا مَقْطَعَانِ! صَفِّقْ مَعِي 👏 👏', 'letter_m_split_bum');

                    triggerClapSequence('bum', ['بُو', 'مُ']);

                } else {

                    mascotSpeak('✂️ <b>كَلِمَةُ (بُوْمُ):</b><br>أَحْسَنْتَ! تَتَكَوَّنُ مِنْ مَقْطَعَيْن: <b style="color:#2563eb;">[ بُو ]</b> ➕ <b style="color:#c026d3;">[ مُ ]</b> 🌟 بَطَلُ الْقِرَاءَةِ!', 'letter_m_split_bum');

                    triggerClapSequence('bum', ['بُو', 'مُ']);

                }

            }

        }

        function mergeMPuzzle(targetWord) {

            mascotCelebrates();

            if (targetWord === 'mama') {

                mascotSpeak('✨ <b>ادمج المقاطع:</b><br>[ مَا ] ➕ [ مَا ] ➔ <b style="font-size:2rem; color:#86198f;">👩‍👧‍👦 مَامَا</b>', 'letter_m_merge_mama');

            } else if (targetWord === 'bum') {

                mascotSpeak('✨ <b>ادمج المقاطع:</b><br>[ بُو ] ➕ [ مُ ] ➔ <b style="font-size:2rem; color:#15803d;">🦉 بُومُ</b>', 'letter_m_merge_bum');

            } else if (targetWord === 'baba') {

                mascotSpeak('✨ <b>ادمج المقاطع:</b><br>[ بَا ] ➕ [ بَا ] ➔ <b style="font-size:2rem; color:#15803d;">👨‍👧‍👦 بَابَا</b>', 'letter_m_merge_baba');

            }

        }

        function playMReadWord(word) {

            mascotCelebrates();

            if (word === 'mama') {

                mascotSpeak('📖 اقرأ: <b style="font-size:2.4rem; color:#a21caf;">مَامَا</b> (مَا... مَا)', 'letter_m_read_mama');

            } else if (word === 'bum') {

                mascotSpeak('📖 اقرأ: <b style="font-size:2.4rem; color:#1e40af;">بُوْمُ</b> (بُو... مُ)', 'letter_m_read_bum');

            } else if (word === 'baba') {

                mascotSpeak('📖 اقرأ: <b style="font-size:2.4rem; color:#dc2626;">بَابَا</b> (بَا... بَا)', 'letter_m_read_baba');

            }

        }

        function playMReadAll() {

            mascotCelebrates();

            mascotSpeak('🐦✨ <b>أَقْرَأُ مَعَ الْعُصْفُورِ الْمُغَرِّد:</b><br><span style="font-size:2.2rem; color:#86198f; font-weight:900;">بَابَا ... مَامَا ... بُوم!</span><br>أَحْسَنْتُمْ يَا أَبْطَالَ الصَّفِّ الْأَوَّل!', 'letter_m_read_all');

        }

        function playMDrawHint() {

            mascotSpeak('🎨 <b>إرشاد رسم حرف الميم:</b><br>الميم الأولي (مـ): نبدأ بدائرة صغيرة من أعلى ثم نمد خطا على السطر لليسار! والميم الآخرية (م): نرسم الدائرة ثم ننزل بعصا مستقيمة نحو الأسفل!', 'letter_m_draw_hint');

        }

        function initMCanvas() {

            const canvas = document.getElementById('mDrawingCanvas');

            if (!canvas) return;

            const ctx = canvas.getContext('2d');

            if (!mCanvasInited) {

                mCanvasInited = true;

                drawMCanvasGuides(ctx, canvas);

                const startDrawing = (e) => {

                    mDrawing = true;

                    ctx.beginPath();

                    const pos = getCanvasPos(canvas, e);

                    ctx.moveTo(pos.x, pos.y);

                    if (e.cancelable) e.preventDefault();

                };

                const drawMove = (e) => {

                    if (!mDrawing) return;

                    const pos = getCanvasPos(canvas, e);

                    ctx.lineTo(pos.x, pos.y);

                    ctx.strokeStyle = mIsEraser ? '#ffffff' : mDrawColor;

                    ctx.lineWidth = mIsEraser ? 24 : mLineWidth;

                    ctx.lineCap = 'round';

                    ctx.lineJoin = 'round';

                    ctx.stroke();

                    if (e.cancelable) e.preventDefault();

                };

                const stopDrawing = () => {

                    if (mDrawing) {

                        mDrawing = false;

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

        function drawMCanvasGuides(ctx, canvas) {

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.save();

            ctx.fillStyle = '#ffffff';

            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Baseline guide line

            ctx.strokeStyle = '#93c5fd';

            ctx.lineWidth = 3;

            ctx.setLineDash([8, 8]);

            ctx.beginPath();

            ctx.moveTo(20, 190);

            ctx.lineTo(canvas.width - 20, 190);

            ctx.stroke();

            // Dotted Final Letter Meem (م) on the left side

            ctx.strokeStyle = '#f0abfc';

            ctx.lineWidth = 14;

            ctx.setLineDash([12, 12]);

            ctx.lineCap = 'round';

            ctx.lineJoin = 'round';

            // Meem head (circle on baseline)

            ctx.beginPath();

            ctx.arc(canvas.width * 0.65, 160, 32, 0, Math.PI * 2);

            ctx.stroke();

            // Meem tail downwards below baseline

            ctx.beginPath();

            ctx.moveTo(canvas.width * 0.65 - 32, 160);

            ctx.lineTo(canvas.width * 0.65 - 32, 280);

            ctx.stroke();

            // Dotted Initial Letter Meem (مـ) on the right side

            ctx.strokeStyle = '#fed7aa';

            ctx.lineWidth = 14;

            ctx.setLineDash([12, 12]);

            // Meem initial head

            ctx.beginPath();

            ctx.arc(canvas.width * 0.28, 160, 30, 0, Math.PI * 2);

            ctx.stroke();

            // Meem arm on baseline

            ctx.beginPath();

            ctx.moveTo(canvas.width * 0.28, 190);

            ctx.lineTo(canvas.width * 0.10, 190);

            ctx.stroke();

            ctx.restore();

        }

        function clearMCanvas() {

            const canvas = document.getElementById('mDrawingCanvas');

            if (!canvas) return;

            const ctx = canvas.getContext('2d');

            drawMCanvasGuides(ctx, canvas);

        }

        function setMDrawColor(color, el) {

            mDrawColor = color;

            mIsEraser = false;

            document.querySelectorAll('.color-dot-m').forEach(d => d.classList.remove('active'));

            if (el) el.classList.add('active');

        }

        function setMEraser(el) {

            mIsEraser = true;

            document.querySelectorAll('.color-dot-m').forEach(d => d.classList.remove('active'));

            if (el) el.classList.add('active');

        }

    

        /* ========================================================

           منطق وتفاعلات حرف الدال (د ، ـد) وتكوين كلمة دَادَا (ص 24 - 26)

        ======================================================== */

        let dCanvasInited = false;

        let dDrawing = false;

        let dDrawColor = '#059669';

        let dIsEraser = false;

        let dLineWidth = 12;

        function switchDStation(stationNum) {

            document.querySelectorAll('.letter-d-station').forEach(el => el.style.display = 'none');

            document.querySelectorAll('#view-tab-letters .station-tab').forEach(el => el.classList.remove('active'));

            const targetStation = document.getElementById('stationD' + stationNum);

            const targetBtn = document.getElementById('btnStationD' + stationNum);

            if (targetStation) targetStation.style.display = 'block';

            if (targetBtn) targetBtn.classList.add('active');

            if (stationNum === 1) {

                mascotSpeak('حرف الدال (د ، ـد)! انقر على بطاقات الكلمات المصورة واستمع لصوت الحرف!', 'letter_d_intro');

            } else if (stationNum === 2) {

                mascotSpeak('أصوات المد القصيرة والطويلة! قارن بين الفتحة والمد بالألف، والضمة والواو، والكسرة والياء!', 'letter_d_vowels_intro');

            } else if (stationNum === 3) {

                mascotSpeak('المقاطع والتحليل الصوتي! استمع لصوت الدال الساكن، وحلل كلمتي (دَادَا ، دُود)!', 'letter_d_syllables_intro');

            } else if (stationNum === 4) {

                mascotSpeak('تركيب وقراءة (دَادَا) مع العصفور! ركّب المقاطع واقرأ وتدرّب على رسم حرف الدال!', 'letter_d_merge_intro');

                setTimeout(initDCanvas, 100);

            }

        }

        function playDLetterSound() {

            mascotCelebrates();

            mascotSpeak('🟢 <b>صَوْتُ حَرْفِ الدَّالِ النَّقِيّ:</b><br><span style="font-size:2rem; color:#059669;">دْ... دْ... دْ</span>', 'letter_d_sound');

        }

        function playDSceneStory() {

            const btn = document.getElementById('btnDSceneStory');

            if (currentAudio && !currentAudio.paused && window._currentPlayingKey === 'letter_d_scene_story') {

                stopAudio();

                if (btn) btn.innerHTML = '🔊 اِسْتَمِعْ لِقِصَّةِ دَادَا وَعَنَاصِرِ حَرْفِ الدَّال';

                return;

            }

            mascotCelebrates();

            if (btn) btn.innerHTML = '⏹️ إيقاف قصة دَادَا';

            mascotSpeak('👶 <b>فِي بَيْتِ الأُسْرَةِ السَّعِيدَة:</b><br>«يَجْلِسُ الطِّفْلُ الصَّغِيرُ دَادَا فِي حِضْنِ أُمِّهِ، حَوْلَهُ دُبٌّ لَطِيف، وَدَلَّةُ قَهْوَة، وَفِي الدَّارِ قِطٌّ صَغِيرٌ يَلْعَب، كُلُّهَا تَحْوِي صَوْتَ الدَّال!»', 'letter_d_scene_story', () => {

                if (btn) btn.innerHTML = '🔊 اِسْتَمِعْ لِقِصَّةِ دَادَا وَعَنَاصِرِ حَرْفِ الدَّال';

            });

        }

        function clickDItem(itemKey) {

            mascotCelebrates();

            const items = {

                'dalla': { title: 'دَلَّـةُ قَهْوَة', audio: 'letter_d_dalla', desc: 'صوت فتحة قصيرة في أول الكلمة (دَ)' },

                'dub': { title: 'دُبٌّ لَطِيف', audio: 'letter_d_dub', desc: 'صوت ضمة قصيرة في أول الكلمة (دُ)' },

                'dirham': { title: 'دِرْهَـمٌ لَامِع', audio: 'letter_d_dirham', desc: 'صوت كسرة قصيرة في أول الكلمة (دِ)' },

                'asad': { title: 'أَسَـدٌ شُجَاع', audio: 'letter_d_asad', desc: 'صوت الدال المتصل في آخر الكلمة (ـد)' },

                'qird': { title: 'قِـرْدٌ مَرِح', audio: 'letter_d_qird', desc: 'صوت الدال المنفصل في آخر الكلمة (د)' },

                'deek': { title: 'دِيـكٌ جَمِيل', audio: 'letter_d_deek', desc: 'صوت مد طويل بالياء في أول الكلمة (دِيـ)' },

                'dood': { title: 'دُودٌ صَغِير', audio: 'letter_d_dood', desc: 'صوت مد طويل بالواو في أول الكلمة (دُو)' },

                'dar': { title: 'دَارُ الأَسْرَة', audio: 'letter_d_dar', desc: 'صوت مد طويل بالألف في أول الكلمة (دَا)' },

                'daraj_vowel': { title: 'دَرَجٌ', audio: 'letter_d_daraj_vowel', desc: 'صوت فتحة قصيرة (دَ)' },

                'dumya_vowel': { title: 'دُمْيَةٌ', audio: 'letter_d_dumya_vowel', desc: 'صوت ضمة قصيرة (دُ)' },

                'dibs_vowel': { title: 'دِبْسٌ', audio: 'letter_d_dibs_vowel', desc: 'صوت كسرة قصيرة (دِ)' },

                'dar_vowel': { title: 'دَارٌ', audio: 'letter_d_dar_vowel', desc: 'مد طويل بالألف (دَا)' },

                'dood_vowel': { title: 'دُودٌ', audio: 'letter_d_dood_vowel', desc: 'مد طويل بالواو (دُو)' },

                'deek_vowel': { title: 'دِيـكٌ', audio: 'letter_d_deek_vowel', desc: 'مد طويل بالياء (دِيـ)' }

            };

            const it = items[itemKey];

            if (it) {

                mascotSpeak(`⭐ <b>${it.title}:</b><br>${it.desc}`, it.audio);

            }

        }

        function playDVowel(type, vowel) {

            mascotCelebrates();

            if (type === 'short' && vowel === 'a') {

                mascotSpeak('🟢 <b>فَتْحَةٌ قَصِيرَة:</b><br><span style="font-size:2.2rem; color:#1e40af;">دَ</span>', 'letter_d_short_a');

            } else if (type === 'long' && vowel === 'a') {

                mascotSpeak('🟢 <b>مَدٌّ بِالْأَلِف (طَوِيل):</b><br><span style="font-size:2.2rem; color:#059669;">دَااا</span>', 'letter_d_long_a');

            } else if (type === 'short' && vowel === 'u') {

                mascotSpeak('🟢 <b>ضَمَّةٌ قَصِيرَة:</b><br><span style="font-size:2.2rem; color:#1e40af;">دُ</span>', 'letter_d_short_u');

            } else if (type === 'long' && vowel === 'u') {

                mascotSpeak('🟢 <b>مَدٌّ بِالْوَاو (طَوِيل):</b><br><span style="font-size:2.2rem; color:#059669;">دُووو</span>', 'letter_d_long_u');

            } else if (type === 'short' && vowel === 'i') {

                mascotSpeak('🟢 <b>كَسْرَةٌ قَصِيرَة:</b><br><span style="font-size:2.2rem; color:#1e40af;">دِ</span>', 'letter_d_short_i');

            } else if (type === 'long' && vowel === 'i') {

                mascotSpeak('🟢 <b>مَدٌّ بِالْيَاء (طَوِيل):</b><br><span style="font-size:2.2rem; color:#059669;">دِييي</span>', 'letter_d_long_i');

            }

        }

        function playDSyllable(syllableKey) {

            mascotCelebrates();

            if (syllableKey === 'qidr') {

                mascotSpeak('🍲 <b>قِدْرٌ:</b> الْمَقْطَعُ السَّاكِن هو: <b style="color:#059669; font-size:1.6rem;">قِدْ ✊</b>', 'letter_d_qidr_syllable');

            } else if (syllableKey === 'badr') {

                mascotSpeak('🌕 <b>بَدْرٌ:</b> الْمَقْطَعُ السَّاكِن هو: <b style="color:#059669; font-size:1.6rem;">بَدْ ✊</b>', 'letter_d_badr_syllable');

            } else if (syllableKey === 'hudhud') {

                mascotSpeak('🪶 <b>هُدْهُدٌ:</b> الْمَقْطَعُ السَّاكِن هو: <b style="color:#059669; font-size:1.6rem;">هُدْ ✊</b>', 'letter_d_hudhud_syllable');

            }

        }

        function splitDWord(wordKey) {

            mascotCelebrates();

            const isModel = window.currentModelingMode === 'model';

            if (wordKey === 'dada') {

                const chips = document.getElementById('chips-split-dada');

                chips.style.transform = 'scale(1.15)';

                setTimeout(() => chips.style.transform = 'scale(1)', 400);

                if (isModel) {

                    mascotSpeak('🎓 <b>نَمْذَجَةُ فَصِيح («أَنَا وَحْدِي»):</b><br>كَلِمَةُ (دَادَا): أَنْطِقُ <b style="color:#059669;">[ دَا ]</b> ثُمَّ <b style="color:#059669;">[ دَا ]</b>، مَقْطَعَانِ مُتَطَابِقَانِ! صَفِّقْ مَعِي 👏 👏', 'letter_d_split_dada');

                    triggerClapSequence('dada', ['دَا', 'دَا']);

                } else {

                    mascotSpeak('✂️ <b>كَلِمَةُ (دَادَا):</b><br>مُمْتَاز! تَتَكَوَّنُ مِنْ مَقْطَعَيْن: <b style="color:#059669;">[ دَا ]</b> ➕ <b style="color:#059669;">[ دَا ]</b> 🌟 أَنْتَ بَطَلُ الْقِرَاءَةِ!', 'letter_d_split_dada');

                    triggerClapSequence('dada', ['دَا', 'دَا']);

                }

            } else if (wordKey === 'dood') {

                const chips = document.getElementById('chips-split-dood');

                chips.style.transform = 'scale(1.15)';

                setTimeout(() => chips.style.transform = 'scale(1)', 400);

                if (isModel) {

                    mascotSpeak('🎓 <b>نَمْذَجَةُ فَصِيح («أَنَا وَحْدِي»):</b><br>كَلِمَةُ (دُودُ): أَنْطِقُ <b style="color:#2563eb;">[ دُو ]</b> ثُمَّ <b style="color:#059669;">[ دُ ]</b>، فِيهَا مَقْطَعَانِ! صَفِّقْ مَعِي 👏 👏', 'letter_d_split_dood');

                    triggerClapSequence('dood', ['دُو', 'دُ']);

                } else {

                    mascotSpeak('✂️ <b>كَلِمَةُ (دُودُ):</b><br>أَحْسَنْتَ! تَتَكَوَّنُ مِنْ مَقْطَعَيْن: <b style="color:#2563eb;">[ دُو ]</b> ➕ <b style="color:#059669;">[ دُ ]</b> 🌟 رَائِعٌ جِدًّا!', 'letter_d_split_dood');

                    triggerClapSequence('dood', ['دُو', 'دُ']);

                }

            }

        }

        function mergeDPuzzle(targetWord) {

            mascotCelebrates();

            if (targetWord === 'dada') {

                mascotSpeak('✨ <b>ادمج المقاطع:</b><br>[ دَا ] ➕ [ دَا ] ➔ <b style="font-size:2rem; color:#065f46;">👶 دَادَا</b>', 'letter_d_merge_dada');

            } else if (targetWord === 'dama') {

                mascotSpeak('✨ <b>ادمج المقاطع:</b><br>[ دَا ] ➕ [ مَ ] ➔ <b style="font-size:2rem; color:#059669;">🌟 دَامَ</b>', 'letter_d_merge_dama');

            } else if (targetWord === 'baba') {

                mascotSpeak('✨ <b>ادمج المقاطع:</b><br>[ بَا ] ➕ [ بَا ] ➔ <b style="font-size:2rem; color:#15803d;">👨‍👧‍👦 بَابَا</b>', 'letter_d_merge_baba');

            } else if (targetWord === 'mama') {

                mascotSpeak('✨ <b>ادمج المقاطع:</b><br>[ مَا ] ➕ [ مَا ] ➔ <b style="font-size:2rem; color:#86198f;">👩‍👧‍👦 مَامَا</b>', 'letter_d_merge_mama');

            }

        }

        function playDReadWord(word) {

            mascotCelebrates();

            if (word === 'baba') {

                mascotSpeak('📖 اقرأ: <b style="font-size:2.4rem; color:#dc2626;">بَابَا</b> (بَا... بَا)', 'letter_d_read_baba');

            } else if (word === 'mama') {

                mascotSpeak('📖 اقرأ: <b style="font-size:2.4rem; color:#a21caf;">مَامَا</b> (مَا... مَا)', 'letter_d_read_mama');

            } else if (word === 'dada') {

                mascotSpeak('📖 اقرأ: <b style="font-size:2.4rem; color:#059669;">دَادَا</b> (دَا... دَا)', 'letter_d_read_dada');

            }

        }

        function playDReadAll() {

            mascotCelebrates();

            mascotSpeak('🐦✨ <b>أَقْرَأُ مَعَ الْعُصْفُورِ الْمُغَرِّد:</b><br><span style="font-size:2.2rem; color:#065f46; font-weight:900;">بَابَا ... مَامَا ... دَادَا!</span><br>أَحْسَنْتُمْ يَا أَبْطَالَ الصَّفِّ الْأَوَّل!', 'letter_d_read_all');

        }

        function playDDrawHint() {

            mascotSpeak('🎨 <b>إرشاد رسم حرف الدال:</b><br>نَبْدَأُ مِنْ أَعْلَى مَائِلًا إِلَى السَّطْرِ ثُمَّ نَمُدُّ خَطًّا أُفُقِيًّا مُسْتَقِيمًا عَلَى السَّطْرِ لِلْيَسَار! وَحَرْفُ الدَّالِ لَا يَتَّصِلُ بِمَا بَعْدَه!', 'letter_d_draw_hint');

        }

        function initDCanvas() {

            const canvas = document.getElementById('dDrawingCanvas');

            if (!canvas) return;

            const ctx = canvas.getContext('2d');

            if (!dCanvasInited) {

                dCanvasInited = true;

                drawDCanvasGuides(ctx, canvas);

                const startDrawing = (e) => {

                    dDrawing = true;

                    ctx.beginPath();

                    const pos = getCanvasPos(canvas, e);

                    ctx.moveTo(pos.x, pos.y);

                    if (e.cancelable) e.preventDefault();

                };

                const drawMove = (e) => {

                    if (!dDrawing) return;

                    const pos = getCanvasPos(canvas, e);

                    ctx.lineTo(pos.x, pos.y);

                    ctx.strokeStyle = dIsEraser ? '#ffffff' : dDrawColor;

                    ctx.lineWidth = dIsEraser ? 24 : dLineWidth;

                    ctx.lineCap = 'round';

                    ctx.lineJoin = 'round';

                    ctx.stroke();

                    if (e.cancelable) e.preventDefault();

                };

                const stopDrawing = () => {

                    if (dDrawing) {

                        dDrawing = false;

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

        function drawDCanvasGuides(ctx, canvas) {

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.save();

            ctx.fillStyle = '#ffffff';

            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Baseline guide line

            ctx.strokeStyle = '#93c5fd';

            ctx.lineWidth = 3;

            ctx.setLineDash([8, 8]);

            ctx.beginPath();

            ctx.moveTo(20, 190);

            ctx.lineTo(canvas.width - 20, 190);

            ctx.stroke();

            // Dotted Letter Dal (د) on the right side

            ctx.strokeStyle = '#a7f3d0';

            ctx.lineWidth = 14;

            ctx.setLineDash([12, 12]);

            ctx.lineCap = 'round';

            ctx.lineJoin = 'round';

            ctx.beginPath();

            // Curve from top right downwards to baseline

            ctx.moveTo(220, 110);

            ctx.quadraticCurveTo(180, 160, 170, 190);

            // Along baseline to left

            ctx.lineTo(110, 190);

            ctx.stroke();

            // Dotted Connected Dal (ـد) on the left side

            ctx.beginPath();

            // connecting line on baseline

            ctx.moveTo(490, 190);

            ctx.lineTo(410, 190);

            // up to slant top

            ctx.quadraticCurveTo(420, 140, 440, 110);

            ctx.stroke();

            // Retrace along baseline

            ctx.beginPath();

            ctx.moveTo(410, 190);

            ctx.lineTo(350, 190);

            ctx.stroke();

            // Direction arrow and labels

            ctx.setLineDash([]);

            ctx.fillStyle = '#059669';

            ctx.font = 'bold 22px "Noto Naskh Arabic", sans-serif';

            ctx.textAlign = 'center';

            ctx.fillText('د (مُنْفَصِل)', 165, 80);

            ctx.fillText('ـد (مُتَّصِل)', 420, 80);

            // Start green dot

            ctx.fillStyle = '#10b981';

            ctx.beginPath();

            ctx.arc(220, 110, 7, 0, Math.PI * 2);

            ctx.fill();

            ctx.beginPath();

            ctx.arc(490, 190, 7, 0, Math.PI * 2);

            ctx.fill();

            ctx.restore();

        }

        function clearDCanvas() {

            const canvas = document.getElementById('dDrawingCanvas');

            if (!canvas) return;

            const ctx = canvas.getContext('2d');

            drawDCanvasGuides(ctx, canvas);

            mascotSpeak('تم مسح السبورة! هيا ارسم حرف الدال من جديد يا بطل! 🎨');

        }

        function setDDrawColor(color, el) {

            dDrawColor = color;

            dIsEraser = false;

            document.querySelectorAll('.color-dot-d').forEach(d => d.classList.remove('active'));

            if (el) el.classList.add('active');

        }

        function setDEraser(el) {

            dIsEraser = true;

            document.querySelectorAll('.color-dot-d').forEach(d => d.classList.remove('active'));

            if (el) el.classList.add('active');

        }

        // ========================================================

        // دوال حرف الفاء (فـ ، ـفـ ، ف) - إعداد المهندس أسامة خليل هاشم

        // ========================================================

        let fCanvasInited = false;

        let fDrawing = false;

        let fDrawColor = '#0284c7';

        let fLineWidth = 7;

        let fIsEraser = false;

        function switchFStation(stationNum) {

            document.querySelectorAll('.letter-f-station').forEach(el => el.style.display = 'none');

            document.querySelectorAll('#view-tab-letter_f .station-tab').forEach(el => el.classList.remove('active'));

            const targetStation = document.getElementById('stationF' + stationNum);

            const targetBtn = document.getElementById('btnStationF' + stationNum);

            if (targetStation) targetStation.style.display = 'block';

            if (targetBtn) targetBtn.classList.add('active');

            if (stationNum === 1) {

                mascotSpeak('حرف الفاء (فـ ، ـفـ ، ف)! انقر على بطاقات الكلمات المصورة واستمع لصوت الحرف!', 'letter_f_intro');

            } else if (stationNum === 2) {

                mascotSpeak('أصوات المد القصيرة والطويلة! قارن بين الفتحة والمد بالألف، والضمة والواو، والكسرة والياء!', 'letter_f_vowels_intro');

            } else if (stationNum === 3) {

                mascotSpeak('المقاطع والتحليل الصوتي! استمع لصوت الفاء الساكنة ✊ وحلل كلمات (فَمُ ، مُفِيدُ ، دُفُوفُ) بالصفقات!', 'letter_f_syllables_intro');

            } else if (stationNum === 4) {

                mascotSpeak('تركيب وقراءة (فَادِي) مع العصفور! ركّب المقاطع واقرأ وتدرّب على رسم حرف الفاء!', 'letter_f_merge_intro');

                setTimeout(initFCanvas, 100);

            }

        }

        function playFLetterSound() {

            mascotCelebrates();

            mascotSpeak('🟢 <b>صَوْتُ حَرْفِ الْفَاءِ النَّقِيّ:</b><br><span style="font-size:2rem; color:#0284c7;">فْ... فْ... فْ</span>', 'letter_f_sound');

        }

        function playFSceneStory() {

            const btn = document.getElementById('btnFSceneStory');

            if (currentAudio && !currentAudio.paused && window._currentPlayingKey === 'letter_f_scene_story') {

                stopAudio();

                if (btn) btn.innerHTML = '🔊 اِسْتَمِعْ لِقِصَّةِ حَدِيقَةِ فَادِي وَعَنَاصِرِ حَرْفِ الْفَاء';

                return;

            }

            mascotCelebrates();

            if (btn) btn.innerHTML = '⏹️ إيقاف قصة فَادِي';

            mascotSpeak('👦 <b>فِي حَدِيقَةِ فَادِي:</b><br>«فِي يَوْمٍ مُشْرِقٍ جَمِيل، يَجْلِسُ الصَّدِيقُ فَادِي فِي حَدِيقَةِ الدَّار، يُشَاهِدُ الْفَرَاشَاتِ الْمُلَوَّنَةَ تُحَلِّقُ حَوْلَ النَّافُورَة، وَيَحْمِلُ بِيَدِهِ فَانُوسًا مُضِيئًا، كُلُّهَا تَحْوِي صَوْتَ الْفَاء!»', 'letter_f_scene_story', () => {

                if (btn) btn.innerHTML = '🔊 اِسْتَمِعْ لِقِصَّةِ حَدِيقَةِ فَادِي وَعَنَاصِرِ حَرْفِ الْفَاء';

            });

        }

        function clickFItem(itemKey) {

            mascotCelebrates();

            const items = {

                'farasha': { title: 'فَرَاشَةٌ مُلَوَّنَة', audio: 'letter_f_farasha', desc: 'صوت فتحة قصيرة في أول الكلمة (فَـ)' },

                'fustan': { title: 'فُسْتَانٌ جَمِيل', audio: 'letter_f_fustan', desc: 'صوت ضمة قصيرة في أول الكلمة (فُـ)' },

                'fijl': { title: 'فِجْلٌ طَازَج', audio: 'letter_f_fijl', desc: 'صوت كسرة قصيرة في أول الكلمة (فِـ)' },

                'miftah': { title: 'مِفْتَاحُ الدَّار', audio: 'letter_f_miftah', desc: 'صوت فاء ساكنة في وسط الكلمة (ـفْـ)' },

                'fam': { title: 'فَمٌ نَاطِق', audio: 'letter_f_fam', desc: 'صوت الفاء المفتوحة في كلمة من حرفين (فَـ)' },

                'fanous': { title: 'فَانُوسٌ مُضِيء', audio: 'letter_f_fanous', desc: 'صوت مد طويل بالألف (فَا)' },

                'nafoora': { title: 'نَافُورَةُ الْمَاء', audio: 'letter_f_nafoora', desc: 'صوت مد طويل بالواو في وسط الكلمة (ـفُوـ)' },

                'feel': { title: 'فِيلٌ كَبِير', audio: 'letter_f_feel', desc: 'صوت مد طويل بالياء (فِيـ)' },

                'fahd_vowel': { title: 'فَهْدٌ سَرِيع', audio: 'letter_f_fahd_vowel', desc: 'صوت مد قصير - فتحة (فَـ)' },

                'furn_vowel': { title: 'فُرْنٌ سَاخِن', audio: 'letter_f_furn_vowel', desc: 'صوت مد قصير - ضمة (فُـ)' },

                'finjan_vowel': { title: 'فِنْجَانُ قَهْوَة', audio: 'letter_f_finjan_vowel', desc: 'صوت مد قصير - كسرة (فِـ)' },

                'fanous_vowel': { title: 'فَانُوسٌ', audio: 'letter_f_fanous_vowel', desc: 'صوت مد طويل بالألف (فَا)' },

                'osfoor_vowel': { title: 'عُصْفُورٌ', audio: 'letter_f_osfoor_vowel', desc: 'صوت مد طويل بالواو (فُو)' },

                'feel_vowel': { title: 'فِيلٌ', audio: 'letter_f_feel_vowel', desc: 'صوت مد طويل بالياء (فِيـ)' }

            };

            const it = items[itemKey];

            if (it) {

                mascotSpeak(`⭐ <b>${it.title}:</b><br>${it.desc}`, it.audio);

            }

        }

        function playFVowel(type, vowel) {

            mascotCelebrates();

            if (type === 'short' && vowel === 'a') {

                mascotSpeak('🟢 <b>فَتْحَةٌ قَصِيرَة:</b><br><span style="font-size:2.2rem; color:#0284c7;">فَـ</span>', 'letter_f_short_a');

            } else if (type === 'long' && vowel === 'a') {

                mascotSpeak('🟢 <b>مَدٌّ بِالْأَلِف (طَوِيل):</b><br><span style="font-size:2.2rem; color:#0369a1;">فَااا</span>', 'letter_f_long_a');

            } else if (type === 'short' && vowel === 'u') {

                mascotSpeak('🟢 <b>ضَمَّةٌ قَصِيرَة:</b><br><span style="font-size:2.2rem; color:#0284c7;">فُـ</span>', 'letter_f_short_u');

            } else if (type === 'long' && vowel === 'u') {

                mascotSpeak('🟢 <b>مَدٌّ بِالْوَاو (طَوِيل):</b><br><span style="font-size:2.2rem; color:#0369a1;">فُووو</span>', 'letter_f_long_u');

            } else if (type === 'short' && vowel === 'i') {

                mascotSpeak('🟢 <b>كَسْرَةٌ قَصِيرَة:</b><br><span style="font-size:2.2rem; color:#0284c7;">فِـ</span>', 'letter_f_short_i');

            } else if (type === 'long' && vowel === 'i') {

                mascotSpeak('🟢 <b>مَدٌّ بِالْيَاء (طَوِيل):</b><br><span style="font-size:2.2rem; color:#0369a1;">فِييي</span>', 'letter_f_long_i');

            }

        }

        function playFSyllable(syllableKey) {

            mascotCelebrates();

            if (syllableKey === 'difda') {

                mascotSpeak('🐸 <b>ضِفْدَعُ:</b> الْمَقْطَعُ السَّاكِن هو: <b style="color:#0284c7; font-size:1.6rem;">ضِفْ ✊</b>', 'letter_f_difda_syllable');

            } else if (syllableKey === 'hafla') {

                mascotSpeak('🎈 <b>حَفْلَةُ:</b> الْمَقْطَعُ السَّاكِن هو: <b style="color:#0284c7; font-size:1.6rem;">حَفْ ✊</b>', 'letter_f_hafla_syllable');

            } else if (syllableKey === 'tifl') {

                mascotSpeak('👶 <b>طِفْلُ:</b> الْمَقْطَعُ السَّاكِن هو: <b style="color:#0284c7; font-size:1.6rem;">طِفْ ✊</b>', 'letter_f_tifl_syllable');

            }

        }

        function splitFWord(wordKey) {

            mascotCelebrates();

            const isModel = window.currentModelingMode === 'model';

            if (wordKey === 'fam') {

                const chips = document.getElementById('chips-split-fam');

                if (chips) {

                    chips.style.transform = 'scale(1.15)';

                    setTimeout(() => chips.style.transform = 'scale(1)', 400);

                }

                if (isModel) {

                    mascotSpeak('🎓 <b>نَمْذَجَةُ فَصِيح («أَنَا وَحْدِي»):</b><br>كَلِمَةُ (فَمُ): مَقْطَعٌ وَاحِدٌ يَنْتَهِي بِالضَّمِّ: <b style="color:#0284c7;">[ فَمُ ]</b>! صَفِّقْ مَعِي صفقة واحدة 👏', 'letter_f_split_fam');

                    triggerClapSequence('fam', ['فَمُ']);

                } else {

                    mascotSpeak('✂️ <b>كَلِمَةُ (فَمُ):</b><br>مُمْتَاز! مَقْطَعٌ وَاحِدٌ صَوْتِيٌّ كَامِل: <b style="color:#0284c7;">[ فَمُ ]</b> 🌟 صَفْقَةٌ وَاحِدَةٌ مُوَفَّقَة!', 'letter_f_split_fam');

                    triggerClapSequence('fam', ['فَمُ']);

                }

            } else if (wordKey === 'mufeed') {

                const chips = document.getElementById('chips-split-mufeed');

                if (chips) {

                    chips.style.transform = 'scale(1.15)';

                    setTimeout(() => chips.style.transform = 'scale(1)', 400);

                }

                if (isModel) {

                    mascotSpeak('🎓 <b>نَمْذَجَةُ فَصِيح («أَنَا وَحْدِي»):</b><br>كَلِمَةُ (مُفِيدُ): أَنْطِقُ <b style="color:#166534;">[ مُـ ]</b> ثُمَّ <b style="color:#0284c7;">[ فِيـ ]</b> ثُمَّ <b style="color:#991b1b;">[ دُ ]</b>! ثَلاثُ صَفْقَات 👏 👏 👏', 'letter_f_split_mufeed');

                    triggerClapSequence('mufeed', ['مُـ', 'فِيـ', 'دُ']);

                } else {

                    mascotSpeak('✂️ <b>كَلِمَةُ (مُفِيدُ):</b><br>أَحْسَنْتَ يَا بَطَل! ثَلاثَةُ مَقَاطِع: <b style="color:#166534;">[ مُـ ]</b> ➕ <b style="color:#0284c7;">[ فِيـ ]</b> ➕ <b style="color:#991b1b;">[ دُ ]</b> 🌟', 'letter_f_split_mufeed');

                    triggerClapSequence('mufeed', ['مُـ', 'فِيـ', 'دُ']);

                }

            } else if (wordKey === 'dufoof') {

                const chips = document.getElementById('chips-split-dufoof');

                if (chips) {

                    chips.style.transform = 'scale(1.15)';

                    setTimeout(() => chips.style.transform = 'scale(1)', 400);

                }

                if (isModel) {

                    mascotSpeak('🎓 <b>نَمْذَجَةُ فَصِيح («أَنَا وَحْدِي»):</b><br>كَلِمَةُ (دُفُوفُ): أَنْطِقُ <b style="color:#991b1b;">[ دُ ]</b> ثُمَّ <b style="color:#0284c7;">[ فُو ]</b> ثُمَّ <b style="color:#166534;">[ فُ ]</b>! ثَلاثُ صَفْقَات 👏 👏 👏', 'letter_f_split_dufoof');

                    triggerClapSequence('dufoof', ['دُ', 'فُو', 'فُ']);

                } else {

                    mascotSpeak('✂️ <b>كَلِمَةُ (دُفُوفُ):</b><br>رَائِعٌ جِدًّا! ثَلاثَةُ مَقَاطِع: <b style="color:#991b1b;">[ دُ ]</b> ➕ <b style="color:#0284c7;">[ فُو ]</b> ➕ <b style="color:#166534;">[ فُ ]</b> 🌟', 'letter_f_split_dufoof');

                    triggerClapSequence('dufoof', ['دُ', 'فُو', 'فُ']);

                }

            }

        }

        function mergeFPuzzle(targetWord) {

            mascotCelebrates();

            if (targetWord === 'fadi') {

                mascotSpeak('✨ <b>ادمج المقاطع:</b><br>[ فَا ] ➕ [ دِي ] ➔ <b style="font-size:2rem; color:#0369a1;">👦 فَادِي</b>', 'letter_f_merge_fadi');

            } else if (targetWord === 'badi') {

                mascotSpeak('✨ <b>ادمج المقاطع:</b><br>[ بَا ] ➕ [ دِي ] ➔ <b style="font-size:2rem; color:#0284c7;">🌟 بَادِي</b>', 'letter_f_merge_badi');

            } else if (targetWord === 'baba') {

                mascotSpeak('✨ <b>ادمج المقاطع:</b><br>[ بَا ] ➕ [ بَا ] ➔ <b style="font-size:2rem; color:#15803d;">👨‍👧‍👦 بَابَا</b>', 'letter_f_merge_baba');

            } else if (targetWord === 'mama') {

                mascotSpeak('✨ <b>ادمج المقاطع:</b><br>[ مَا ] ➕ [ مَا ] ➔ <b style="font-size:2rem; color:#86198f;">👩‍👧‍👦 مَامَا</b>', 'letter_f_merge_mama');

            }

        }

        function playFReadWord(word) {

            mascotCelebrates();

            if (word === 'fadi') {

                mascotSpeak('📖 اقرأ: <b style="font-size:2.4rem; color:#0284c7;">فَادِي</b> (فَا... دِي)', 'letter_f_read_fadi');

            } else if (word === 'mufeed') {

                mascotSpeak('📖 اقرأ: <b style="font-size:2.4rem; color:#059669;">مُفِيد</b> (مُـ... فِيـ... د)', 'letter_f_read_mufeed');

            } else if (word === 'fam') {

                mascotSpeak('📖 اقرأ: <b style="font-size:2.4rem; color:#dc2626;">فَم</b> (فَـ... م)', 'letter_f_read_fam');

            }

        }

        function playFReadAll() {

            mascotCelebrates();

            mascotSpeak('🐦✨ <b>أَقْرَأُ مَعَ الْعُصْفُورِ الْمُغَرِّد:</b><br><span style="font-size:2.2rem; color:#0369a1; font-weight:900;">فَادِي ... مُفِيد ... فَم!</span><br>أَحْسَنْتُمْ يَا أَبْطَالَ الصَّفِّ الأَوَّل!', 'letter_f_read_all');

        }

        function playFDrawHint() {

            mascotSpeak('🎨 <b>إِرْشَادُ رَسْمِ حَرْفِ الْفَاءِ:</b><br>نَرْسُمُ دَائِرَةً صَغِيرَةً فَوْقَ السَّطْر، ثُمَّ نَنْزِلُ بِرَقَبَةٍ قَصِيرَةٍ إِلَى السَّطْر، وَنَمْتَدُّ أُفُقِيًّا، وَنَضَعُ نُقْطَةً وَاحِدَةً فَوْقَ الرَّأْس!', 'letter_f_draw_hint');

        }

        function initFCanvas() {

            const canvas = document.getElementById('fDrawingCanvas');

            if (!canvas) return;

            const ctx = canvas.getContext('2d');

            if (!fCanvasInited) {

                fCanvasInited = true;

                drawFCanvasGuides(ctx, canvas);

                const startDrawing = (e) => {

                    fDrawing = true;

                    ctx.beginPath();

                    const pos = getCanvasPos(canvas, e);

                    ctx.moveTo(pos.x, pos.y);

                    if (e.cancelable) e.preventDefault();

                };

                const drawMove = (e) => {

                    if (!fDrawing) return;

                    const pos = getCanvasPos(canvas, e);

                    ctx.lineTo(pos.x, pos.y);

                    ctx.strokeStyle = fIsEraser ? '#f8fafc' : fDrawColor;

                    ctx.lineWidth = fIsEraser ? 24 : fLineWidth;

                    ctx.lineCap = 'round';

                    ctx.lineJoin = 'round';

                    ctx.stroke();

                    if (e.cancelable) e.preventDefault();

                };

                const stopDrawing = () => {

                    if (fDrawing) {

                        fDrawing = false;

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

        function drawFCanvasGuides(ctx, canvas) {

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // خط الأساس

            ctx.beginPath();

            ctx.strokeStyle = '#94a3b8';

            ctx.lineWidth = 2;

            ctx.setLineDash([6, 6]);

            ctx.moveTo(30, 140);

            ctx.lineTo(canvas.width - 30, 140);

            ctx.stroke();

            ctx.setLineDash([]);

            // خط إرشادي علوي خفيف

            ctx.beginPath();

            ctx.strokeStyle = '#cbd5e1';

            ctx.lineWidth = 1;

            ctx.setLineDash([4, 4]);

            ctx.moveTo(30, 70);

            ctx.lineTo(canvas.width - 30, 70);

            ctx.stroke();

            ctx.setLineDash([]);

            // كتابة الحروف المنقطة الإرشادية (فـ ، ـفـ ، ف)

            ctx.font = '900 78px "Noto Naskh Arabic", "Cairo", sans-serif';

            ctx.fillStyle = '#e2e8f0';

            ctx.textAlign = 'center';

            ctx.textBaseline = 'alphabetic';

            ctx.fillText('فـ', canvas.width * 0.78, 140);

            ctx.fillText('ـفـ', canvas.width * 0.50, 140);

            ctx.fillText('ف', canvas.width * 0.22, 140);

            // سهم توجيهي ونقطة بداية باللون البرتقالي

            ctx.fillStyle = '#f97316';

            ctx.beginPath();

            ctx.arc(canvas.width * 0.78 + 35, 88, 7, 0, Math.PI * 2);

            ctx.fill();

            ctx.font = 'bold 12px "Cairo", sans-serif';

            ctx.fillText('ابدأ هنا 🟢', canvas.width * 0.78 + 35, 68);

        }

        function clearFCanvas() {

            const canvas = document.getElementById('fDrawingCanvas');

            if (!canvas) return;

            const ctx = canvas.getContext('2d');

            drawFCanvasGuides(ctx, canvas);

            mascotSpeak('تم مسح السبورة! هيا ارسم حرف الفاء من جديد يا بطل! 🎨');

        }

        function setFDrawColor(color, el) {

            fDrawColor = color;

            fIsEraser = false;

            document.querySelectorAll('.color-dot-f').forEach(d => d.classList.remove('active'));

            if (el) el.classList.add('active');

        }

        function setFEraser(el) {

            fIsEraser = true;

            document.querySelectorAll('.color-dot-f').forEach(d => d.classList.remove('active'));

            if (el) el.classList.add('active');

        }

        // ========================================================

        // دوال خاتمة الوحدة الأولى: سورة الفاتحة ونشيد ماما بابا (ص ٣٠)

        // إعداد المهندس أسامة خليل هاشم

        // ========================================================

        function switchQStation(stationNum) {

            document.querySelectorAll('.unit1-quran-station').forEach(el => el.style.display = 'none');

            document.querySelectorAll('#view-tab-unit1_quran .station-tab').forEach(el => el.classList.remove('active'));

            const targetStation = document.getElementById('stationQ' + stationNum);

            const targetBtn = document.getElementById('btnStationQ' + stationNum);

            if (targetStation) targetStation.style.display = 'block';

            if (targetBtn) targetBtn.classList.add('active');

            if (stationNum === 1) {

                mascotSpeak('سُورَةُ الْفَاتِحَةِ الْمُبَارَكَة! اِسْتَمِعُوا لِلتِّلَاوَةِ الْعَطِرَةِ بِخُشُوعٍ وَرَدِّدُوا مَعِي آيَةً فَآيَة!', 'unit1_fatiha_intro');

            } else if (stationNum === 2) {

                mascotSpeak('نَشِيدُ (مَامَا بَابَا)! نَشِيدٌ بَهِيجٌ نُعَبِّرُ فِيهِ عَنْ حُبِّنَا لِأُمِّنَا وَأَبِينَا وَمُعَلِّمَتِنَا الْغَالِيَة!', 'unit1_nasheed_intro');

            } else if (stationNum === 3) {

                mascotSpeak('حَصَادُ الْوَحْدَةِ الْأُولَى: أُسْرَتِي! رَاجِعُوا كَافَّةَ الْحُرُوفِ وَالْكَلِمَاتِ الَّتِي تَعَلَّمْنَاهَا، وَاقْرَؤُوا لَوْحَةَ الشَّرَف!', 'unit1_harvest_intro');

            } else if (stationNum === 4) {

                mascotSpeak('مُبَارَكٌ لَكُمْ يَا أَبْطَالَ قِرَاءَتِي! لَقَدْ أَتْمَمْتُمْ دِرَاسَةَ الْوَحْدَةِ الْأُولَى بِنَجَاحٍ وَتَفَوُّق! اِسْتَلِمُوا وِسَامَ التَّمَيُّزِ وَشَهَادَةَ التَّخَرُّج!', 'unit1_grad_intro');

            }

        }

        function playFullFatiha() {

            const btn = document.getElementById('btnFullFatiha');

            if (currentAudio && !currentAudio.paused && window._currentPlayingKey === 'unit1_fatiha_full') {

                stopAudio();

                if (btn) btn.innerHTML = '▶️ اِسْتَمِعْ لِلتِّلَاوَةِ الْكَامِلَةِ مُرَتَّلَة';

                document.querySelectorAll('.ayah-card').forEach(el => el.classList.remove('active'));

                return;

            }

            mascotCelebrates();

            if (btn) btn.innerHTML = '⏹️ إِيقَافُ التِّلَاوَة';

            document.querySelectorAll('.ayah-card').forEach(el => el.classList.remove('active'));

            mascotSpeak('📖 <b>تِلَاوَةُ سُورَةِ الْفَاتِحَةِ الْمُبَارَكَة:</b><br>اِسْتَمِعُوا بِخُشُوعٍ وَتَدَبُّرٍ لِآيَاتِ اللهِ الْعَظِيمَة.', 'unit1_fatiha_full', () => {

                if (btn) btn.innerHTML = '▶️ اِسْتَمِعْ لِلتِّلَاوَةِ الْكَامِلَةِ مُرَتَّلَة';

                document.querySelectorAll('.ayah-card').forEach(el => el.classList.remove('active'));

            });

        }

        function playFatihaAyah(num) {

            mascotCelebrates();

            document.querySelectorAll('.ayah-card').forEach(el => el.classList.remove('active'));

            const card = document.getElementById('ayahCard-' + num);

            if (card) card.classList.add('active');

            const ayahsText = {

                1: '﴿ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴾',

                2: '﴿ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ﴾',

                3: '﴿ الرَّحْمَٰنِ الرَّحِيمِ ﴾',

                4: '﴿ مَالِكِ يَوْمِ الدِّينِ ﴾',

                5: '﴿ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ﴾',

                6: '﴿ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ﴾',

                7: '﴿ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ ﴾'

            };

            mascotSpeak(`✨ <b>الْآيَةُ (${num}):</b><br><span style="font-size:1.6rem; color:#065f46; font-family:'Amiri', serif;">${ayahsText[num]}</span>`, 'unit1_fatiha_ayah' + num);

        }

        function playFatihaSadaqa() {

            mascotCelebrates();

            document.querySelectorAll('.ayah-card').forEach(el => el.classList.remove('active'));

            const card = document.getElementById('ayahCard-sadaqa');

            if (card) card.classList.add('active');

            mascotSpeak('🤲 <b style="font-size:1.4rem; color:#475569;">صَدَقَ اللَّهُ الْعَلِيُّ الْعَظِيمُ</b>', 'unit1_fatiha_sadaqa');

        }

        function playFatihaRepeatPrompt() {

            mascotCelebrates();

            mascotSpeak('🎙️ <b>أَرَدِّدُ مَعَ فَصِيح:</b><br>اِقْرَأْ كُلَّ آيَةٍ بِصَوْتٍ عَالٍ وَخُشُوعٍ بَعْدَ سَمَاعِهَا!', 'unit1_fatiha_repeat_prompt');

        }

        function playFullNasheed() {

            const btn = document.getElementById('btnFullNasheed');

            if (currentAudio && !currentAudio.paused && window._currentPlayingKey === 'unit1_nasheed_full') {

                stopAudio();

                if (btn) btn.innerHTML = '🎶 اِسْتَمِعْ لِلنَّشِيدِ كَامِلاً';

                document.querySelectorAll('.nasheed-card').forEach(el => el.classList.remove('active'));

                return;

            }

            mascotCelebrates();

            if (btn) btn.innerHTML = '⏹️ إِيقَافُ النَّشِيد';

            document.querySelectorAll('.nasheed-card').forEach(el => el.classList.remove('active'));

            mascotSpeak('🎵 <b>نَشِيدُ (مَامَا بَابَا):</b><br>شِعْرُ: عَبْدِ الْعَزِيز أَبُو غُوش • اِسْتَمِعْ وَأَنْشِدْ مَعَنَا بِفَرَح!', 'unit1_nasheed_full', () => {

                if (btn) btn.innerHTML = '🎶 اِسْتَمِعْ لِلنَّشِيدِ كَامِلاً';

                document.querySelectorAll('.nasheed-card').forEach(el => el.classList.remove('active'));

            });

        }

        function playNasheedIntro() {

            mascotCelebrates();

            mascotSpeak('💡 <b>مُقَدِّمَةُ النَّشِيد:</b><br>نَشِيدُ مَامَا بَابَا يُعَبِّرُ عَنْ مَشَاعِرِ الْمَحَبَّةِ وَالْبِرِّ لِلْأُسْرَةِ وَالْمُعَلِّمَةِ الْفَاضِلَة.', 'unit1_nasheed_intro');

        }

        function playNasheedVerse(num) {

            mascotCelebrates();

            document.querySelectorAll('.nasheed-card').forEach(el => el.classList.remove('active'));

            const card = document.getElementById('verseCard-' + num);

            if (card) card.classList.add('active');

            const verses = {

                1: 'مَامَا بَابَا ... فَرْحَةُ قَلْبِي 💖',

                2: 'مَامَا بَابَا ... نَبْضُ الْحُبِّ 💓',

                3: 'مَامَا بَابَا ... خَفْقُ فُؤَادِي 💗',

                4: 'مَامَا بَابَا ... خَيْرُ عِمَادِ 🛡️',

                5: 'وَمُعَلِّمَتِي ... أَنْتِ أَنْتِ 👩‍🏫',

                6: 'أُمِّي الْأُخْرَى ... فِي مَدْرَسَتِي 🏫'

            };

            mascotSpeak(`🎵 <b>الْبَيْتُ (${num}):</b><br><span style="font-size:1.5rem; color:#e11d48;">${verses[num]}</span>`, 'unit1_nasheed_verse' + num);

        }

        function playNasheedWord(wordKey) {

            mascotCelebrates();

            if (wordKey === 'farha') {

                mascotSpeak('💖 <b>فَرْحَةُ قَلْبِي:</b> سَعَادَةٌ كَبِيرَةٌ تَمْلَأُ حَيَاتِي بِوُجُودِ مَامَا وَبَابَا!', 'unit1_nasheed_word_farha');

            } else if (wordKey === 'nabd') {

                mascotSpeak('💓 <b>نَبْضُ الْحُبّ:</b> دَقَّاتُ قَلْبِي الَّتِي تَنْبِضُ بِالْمَحَبَّةِ وَالْوَفَاء!', 'unit1_nasheed_word_nabd');

            } else if (wordKey === 'emad') {

                mascotSpeak('🛡️ <b>خَيْرُ عِمَاد:</b> أَعْظَمُ سَنَدٍ وَعَوْنٍ يَحْمِينِي وَيَرْعَانِي!', 'unit1_nasheed_word_emad');

            } else if (wordKey === 'moallimati') {

                mascotSpeak('👩‍🏫 <b>مُعَلِّمَتِي:</b> أُمِّي الْغَالِيَةُ فِي الْمَدْرَسَة، تُعَلِّمُنِي الْقِرَاءَةَ وَالْأَخْلَاق!', 'unit1_nasheed_word_moallimati');

            }

        }

        function playHarvestIntro() {

            mascotCelebrates();

            mascotSpeak('🏆 <b>حَصَادُ الْوَحْدَةِ الْأُولَى (أُسْرَتِي):</b><br>تَعَلَّمْنَا حُرُوفَ (ب ، م ، د ، ف) وَقَرَأْنَا أَجْمَلَ الْكَلِمَات!', 'unit1_harvest_intro');

        }

        function playHarvestLetter(letter) {

            mascotCelebrates();

            if (letter === 'b') {

                mascotSpeak('🔵 <b>حَرْفُ الْبَاء (بـ ، ب):</b><br>أَصْوَاتُهُ: (بَـ ، بُـ ، بِـ) • كَلِمَاتُهُ: (بَابَا ، بَابُ ، بَابِي)', 'unit1_review_b');

            } else if (letter === 'm') {

                mascotSpeak('🟣 <b>حَرْفُ الْمِيم (مـ ، م):</b><br>أَصْوَاتُهُ: (مَـ ، مُـ ، مِـ) • كَلِمَاتُهُ: (مَامَا ، بُومُ)', 'unit1_review_m');

            } else if (letter === 'd') {

                mascotSpeak('🟠 <b>حَرْفُ الدَّال (د ، ـد):</b><br>أَصْوَاتُهُ: (دَ ، دُ ، دِ) • كَلِمَاتُهُ: (دَادَا ، دُودُ ، دَامَ)', 'unit1_review_d');

            } else if (letter === 'f') {

                mascotSpeak('🟢 <b>حَرْفُ الْفَاء (فـ ، ـفـ ، ف):</b><br>أَصْوَاتُهُ: (فَـ ، فُـ ، فِـ) • كَلِمَاتُهُ: (فَادِي ، مُفِيدُ ، فَمُ)', 'unit1_review_f');

            }

        }

        function playAllHarvestWords() {

            mascotCelebrates();

            mascotSpeak('🌟 <b>كَلِمَاتُ لَوْحَةِ الشَّرَفِ التَّرَاكُمِيَّة:</b><br><span style="font-size:1.7rem; color:#065f46;">بَابَا ... مَامَا ... دَادَا ... فَادِي ... مُفِيد ... فَم!</span>', 'unit1_review_all_words');

        }

        function updateCertName(name) {

            const display = document.getElementById('certStudentDisplayName');

            if (display) {

                display.innerText = name.trim() ? name.trim() : 'بَطَلُ قِرَاءَتِي';

            }

        }

        function launchGradCelebration() {

            mascotCelebrates();

            mascotSpeak('🎉 <b>عَاشَ الْبَطَل!</b> نَحْنُ فَخُورُونَ بِكَ جِدًّا! أَنْتَ جَاهِزٌ لِلِانْطِلَاقِ نَحْوَ الْوَحْدَةِ الثَّانِيَةِ: مَدْرَسَتِي!', 'unit1_grad_cheer');

            // تأثيرات احتفالية إضافية

            const avatar = document.getElementById('mascotAvatar');

            if (avatar) {

                avatar.classList.add('mascot-celebrate');

                setTimeout(() => avatar.classList.remove('mascot-celebrate'), 3000);

            }

        }

        function printCert() {

            window.print();

        }

