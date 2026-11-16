/* ==========================================================================
 * منصة قراءتي التفاعلية الذكية - التنقل وشريط المنهج والدروس (Navigation & Curriculum Sidebar)
 * إعداد وتطوير: المهندس أسامة خليل هاشم
 * ========================================================================== */

        /* ========================================================

           3. Right Sidebar Generator & Sequential Navigation

        ======================================================== */

        var flatLessonsList = [];

        window.flatLessonsList = flatLessonsList;

        var currentLessonIndex = 0;

        window.currentLessonIndex = currentLessonIndex;

        function buildCurriculumSidebar() {

            const accordion = document.getElementById('unitsAccordion');

            if (!accordion) return;

            accordion.innerHTML = '';

            flatLessonsList = [];

            if (!window.CURRICULUM_DATA || !Array.isArray(window.CURRICULUM_DATA)) {

                console.warn('CURRICULUM_DATA not loaded yet or empty');

                return;

            }

            window.CURRICULUM_DATA.forEach((unit, uIdx) => {

                const card = document.createElement('div');

                card.className = 'unit-card' + (uIdx === 0 ? ' open' : '');

                const titleBar = document.createElement('div');

                titleBar.className = 'unit-title-bar';

                titleBar.onclick = () => card.classList.toggle('open');

                titleBar.innerHTML = `

                    <div class="unit-info-left">

                        <span>${unit.icon}</span>

                        <span>${unit.title}</span>

                    </div>

                    <span style="font-size: 0.8rem; color: #64748b;">(ص ${unit.pages})</span>

                `;

                card.appendChild(titleBar);

                const lessonsList = document.createElement('div');

                lessonsList.className = 'unit-lessons-list';

                unit.lessons.forEach(lesson => {

                    flatLessonsList.push(lesson);

                    const item = document.createElement('div');

                    item.className = 'lesson-nav-item';

                    item.id = 'nav-' + lesson.id;

                    item.onclick = (e) => {

                        e.stopPropagation();

                        const idx = flatLessonsList.findIndex(l => l.id === lesson.id);

                        goToLessonByIndex(idx);

                    };

                    const badgeClass = lesson.status === 'ready' ? 'badge-ready' : 'badge-upcoming';

                    const badgeText = lesson.status === 'ready' ? 'مفعل جاهز ✅' : 'قيد التطوير 🚀';

                    item.innerHTML = `

                        <span>${lesson.title}</span>

                        <span class="lesson-badge ${badgeClass}">${badgeText}</span>

                    `;

                    lessonsList.appendChild(item);

                });

                card.appendChild(lessonsList);

                accordion.appendChild(card);

            });

            // بدء التشغيل من الدرس الأول في المنهج (الفهرس 0)

            goToLessonByIndex(0);

        }

        function goToLessonByIndex(index) {
            const mainStageEl = document.querySelector('.main-stage');
            if (mainStageEl) mainStageEl.scrollTop = 0;
            window.scrollTo(0, 0);

            if (index < 0 || index >= flatLessonsList.length) return;

            currentLessonIndex = index;

            const lesson = flatLessonsList[index];

            if (window.innerWidth <= 992) {

                const sb = document.getElementById('curriculumSidebar');

                if (sb) sb.classList.remove('open');

                const bd = document.getElementById('sidebarBackdrop');

                if (bd) bd.classList.remove('show');

            }

            // تحديث مؤشر شريط الدرس

            document.querySelectorAll('.lesson-nav-item').forEach(el => el.classList.remove('active'));

            const activeNav = document.getElementById('nav-' + lesson.id);

            if (activeNav) activeNav.classList.add('active');

            // تحديث عنوان الدرس في شريط التنقل السفلي والعلوي

            const labelText = `${lesson.title} (ص ${lesson.page})`;

            const currentLabel = document.getElementById('currentLessonLabel');

            if (currentLabel) currentLabel.innerText = labelText;

            document.querySelectorAll('.current-lesson-label-top').forEach(el => el.innerText = labelText);

            if (lesson.status !== 'ready') {

                mascotSpeak(`درس <b>(${lesson.title})</b> قيد الإعداد والإضافة للتطبيق قريباً يا بطل! 🚀`, 'mascot_hint');

                return;

            }

            // إظهار واجهة الدرس

            document.querySelectorAll('.lesson-view').forEach(v => v.classList.remove('active'));

            const targetView = document.getElementById('view-' + lesson.id);

            if (targetView) targetView.classList.add('active');

            // توجيه فصيح الصوتي بحسب الدرس

            if (lesson.id === 'tab-lesson1') {

                mascotSpeak('الدرس الأول: نشيد البطة وتسمية الأشياء! استمع للنشيد واضغط على عناصر الصورة!', 'lesson1_intro');

            } else if (lesson.id === 'tab-act4') {

                mascotSpeak('الدرس الثاني: نشاط ٤ - أتحدث عن الصور! كيف نبدأ يومنا بنشاط؟ اضغط على الصور!', 'act4_intro');

            } else if (lesson.id === 'tab-act5_diff') {

                mascotSpeak('الدرس الثالث: نشاط ٥ - أميز المتشابه والمختلف! ضع دائرة حول الإجابة الصحيحة!', 'act5_diff_intro');

            } else if (lesson.id === 'tab-act6') {

                mascotSpeak('الدرس الرابع: نشاط ٦ - أميز الأقصر والأطول! اضغط على الخيار الأطول!', 'quiz_prompt');

            } else if (lesson.id === 'tab-act7') {

                mascotSpeak('الدرس الخامس: نشاط ٧ - أحدد الأماكن: فَوْقَ وتَحْتَ، أَمَامَ وخَلْفَ!', 'act7_intro');

            } else if (lesson.id === 'tab-act8') {

                mascotSpeak('الدرس السادس: نشاط ٨ - أتعرف إلى الاتجاهات: يمين ويسار!', 'act8_intro');

            } else if (lesson.id === 'tab-act5') {

                mascotSpeak('نشاط ٥: استمع لصوت المد (آاا) وصوت (ى) وضع الصوت في الفراغ!', 'act5_prompt');

            } else if (lesson.id === 'tab-vowel_w') {

                mascotSpeak('درس صوت حرف المد (و)! استمع لصوت المد المضموم (وووو) وردد مع فصيح!', 'vowel_w_intro');

            } else if (lesson.id === 'tab-vowel_y') {

                mascotSpeak('درس صوت حرف المد (يـ ، ي)! استمع لصوت المد المكسور (يييي) وردد مع فصيح!', 'vowel_y_intro');

            } else if (lesson.id === 'tab-unit1_family_story') {

                mascotSpeak('الْوَحْدَةُ الْأُولَى: أُسْرَتِي! اِسْتَمِعْ لِقِصَّةِ الْأُسْرَةِ السَّعِيدَةِ وَعَبِّرْ عَنِ الصُّوَرِ!', 'unit1_welcome');

            } else if (lesson.id === 'tab-letter_m') {

                mascotSpeak('حَرْفُ الْمِيم (مـ ، م)! اِسْتَمِعْ لِصَوْتِ الْحَرْفِ النَّقِيّ (مْ) وَأَصْوَاتِ الْمَدُودِ وَرَكِّبْ كَلِمَةَ (مَامَا)!', 'letter_m_intro');

                setTimeout(initMCanvas, 200);

            } else if (lesson.id === 'tab-letter_b') {

                mascotSpeak('حَرْفُ الْبَاء (بـ ، ب)! اِسْتَمِعْ لِصَوْتِ الْحَرْفِ النَّقِيّ (بْ) وَأَصْوَاتِ الْمَدُودِ وَرَكِّبْ كَلِمَةَ (بَابَا)!', 'letter_b_intro');

                setTimeout(initBCanvas, 200);

            } else if (lesson.id === 'tab-letters') {

                mascotSpeak('حَرْفُ الدَّال (د ، ـد)! اِسْتَمِعْ لِصَوْتِ الْحَرْفِ النَّقِيّ (دْ) وَأَصْوَاتِ الْمَدُودِ وَرَكِّبْ كَلِمَةَ (دَادَا) وَاقْرَأْ (بَابَا ، مَامَا ، دَادَا)!', 'letter_d_intro');

                setTimeout(initDCanvas, 200);

            } else if (lesson.id === 'tab-letter_f') {

                mascotSpeak('حَرْفُ الْفَاء (فـ ، ـفـ ، ف)! اِسْتَمِعْ لِصَوْتِ الْحَرْفِ النَّقِيّ (فْ) وَأَصْوَاتِ الْمَدُودِ وَرَكِّبْ كَلِمَةَ (فَادِي) وَاقْرَأْ (فَادِي ، مُفِيد ، فَم)!', 'letter_f_intro');

                setTimeout(initFCanvas, 200);

            } else if (lesson.id === 'tab-unit1_quran') {

                mascotSpeak('خَاتِمَةُ الْوَحْدَةِ الْأُولَى: أُسْرَتِي! اِسْتَمِعْ لِسُورَةِ الْفَاتِحَةِ الْمُبَارَكَةِ وَنَشِيدِ (مَامَا بَابَا) وَشَاهِدْ حَصَادَ الْوَحْدَةِ وَاسْتَلِمْ شَهَادَةَ التَّخَرُّجِ!', 'unit1_quran_welcome');

            } else if (lesson.id === 'tab-unit2_nasheed') {
                mascotSpeak('خَاتِمَةُ الْوَحْدَةِ الثَّانِيَةِ: نَشِيدُ (مَدْرَسَتِي) وَحَصَادُ الْمَهَارَاتِ وَإِكْلِيلُ التَّفَوُّق! اِسْتَمِعُوا لِلنَّشِيدِ، وَاقْرَؤُوا لَوْحَةَ الشَّرَف، وَاجْتَازُوا تَحَدِّي الْحَصَادِ لِتَتَوَّجُوا بِإِكْلِيلِ التَّفَوُّقِ الْمَلَكِيّ!', 'unit2_nasheed_intro');
            } else if (lesson.id === 'tab-unit3_intro') {
                mascotSpeak('الْوَحْدَةُ الثَّالِثَةُ: أَلْعَابِي وَحَيَوَانَاتِي! مَدْخَلُ الْوَحْدَةِ وَالِاسْتِمَاعُ وَالْمُحَادَثَةُ (ص ٥٣)! اِسْتَمِعُوا لِقِصَّةِ أَلْعَابِي وَحَيَوَانَاتِي الأَلِيفَةِ، وَعَبِّرُوا عَنْ صُوَرِ الْمُحَادَثَةِ، وَاجْتَازُوا تَحَدِّي فَصِيح!', 'unit3_intro_welcome');
            } else if (lesson.id === 'tab-letter_ta') {
                mascotSpeak('الْوَحْدَةُ الثَّالِثَةُ: حَرْفُ الطَّاءِ (طـ ، ط) وَقِرَاءَةُ (بَطّ) (ص ٥٣ - ٥٦)! اِسْتَمِعُوا لِصَوْتِ حَرْفِ الطَّاءِ الْمُفَخَّمِ، وَتَعَرَّفُوا عَلَى الْمَدِّ الْقَصِيرِ وَالطَّوِيلِ وَالْمَقَاطِعِ السَّاكِنَةِ، وَاقْرَؤُوا قِرَاءَةَ (بَطّ وَطُيُور) وَتَدَرَّبُوا عَلَى كِتَابَةِ الْحَرْفِ!', 'letter_ta_intro');
                setTimeout(initTaCanvas, 200);
            } else if (lesson.id === 'tab-letter_q_booq') {
                mascotSpeak('الْوَحْدَةُ الثَّالِثَةُ: حَرْفُ الْقَافِ (قـ ، ق) وَقِرَاءَةُ (بُوقِ نَدِيم) (ص ٦١ - ٦٤)! اِسْتَمِعُوا لِصَوْتِ حَرْفِ الْقَافِ الْمُفَخَّمِ النَّقِيّ، وَتَعَرَّفُوا عَلَى الْمَدِّ الْقَصِيرِ وَالطَّوِيلِ وَالْمَقَاطِعِ وَاقْرَأُوا مَعَ نَدِيم!', 'letter_q_booq_intro');
                switchQBooqStation(1);
            } else if (lesson.id === 'tab-unit4_intro') {
                mascotSpeak('مَرْحَباً بِكُمْ فِي الْوَحْدَةِ الرَّابِعَة: صِحَّتِي وَبِيئَتِي! اِسْتَمِعُوا لِقِصَّةِ الصِّحَّةِ وَالنَّظَافَةِ وَالْبِيئَةِ الْجَمِيلَة!', 'unit4_intro_welcome');
                if (typeof switchUnit4Station === 'function') switchUnit4Station(1);
            } else if (lesson.id === 'tab-letter_h') {
                mascotSpeak('الْوَحْدَةُ الرَّابِعَةُ: حَرْفُ الْحَاءِ (حـ ، ـحـ ، ـح ، ح) وَقِرَاءَةُ صَلَاح تِلْمِيذ وَصَلَاح فَلَّاح (ص ٧٢ - ٧٦)! اسْتَمِعُوا لِصَوْتِ الْحَاءِ الْحَلْقِيِّ الصَّافِي، وَتَعَلَّمُوا مَعَ صَلَاحٍ الْعِنَايَةَ بِالصِّحَّةِ وَالْبِيئَة!', 'letter_h_intro');
                if (typeof switchLetterHStation === 'function') switchLetterHStation(1);
            } else if (lesson.id === 'tab-letter_sh') {
                mascotSpeak('الْوَحْدَةُ الرَّابِعَةُ: حَرْفُ الشِّينِ (شـ ، ـشـ ، ـش ، ش) وَقِرَاءَةُ (شَامِل شُرْطِيُّ الْمُرُور) (ص ٧٥ - ٧٨)! اِسْتَمِعُوا لِصَوْتِ الشِّينِ التَّفَشِّي الصَّافِي، وَتَعَرَّفُوا عَلَى الْمُدُودِ وَالْمَقَاطِعِ وَشَامِلٍ شُرْطِيِّ الْمُرُورِ النَّشِيط!', 'letter_sh_intro');
                if (typeof switchLetterShStation === 'function') switchLetterShStation(1);
            } else if (lesson.id === 'tab-letter_z') {
                mascotSpeak('الْوَحْدَةُ الرَّابِعَةُ: حَرْفُ الزَّايِ (ز ، ـز) وَقِرَاءَةُ (مِيزَان قَدُّورِي / وَزّ) (ص ٧٨ - ٨٠)! اِسْتَمِعُوا لِصَوْتِ الزَّايِ الصَّفِيرِيِّ الرَّنَّانِ كَأَزِيزِ النَّحْلِ، وَتَعَرَّفُوا عَلَى مَزْرَعَةِ مَازِنٍ وَمِيزَانِ قَدُّورِي الْوَزَّان!', 'letter_z_intro');
                if (typeof switchLetterZStation === 'function') switchLetterZStation(1);
            } else if (lesson.id === 'tab-letter_j') {
                mascotSpeak('الْوَحْدَةُ الرَّابِعَةُ: حَرْفُ الْجِيمِ (جـ ، ـجـ ، ـج ، ج) وَقِرَاءَةُ (فَرَج نَسَّاج) (ص ٨١ - ٨٣)! اِسْتَمِعُوا لِصَوْتِ الْجِيمِ الشَّدِيدِ الْمَجْهُورِ الصَّافِي، وَتَعَرَّفُوا عَلَى الْمُدُودِ وَالْمَقَاطِعِ وَفَرَجٍ النَّسَّاجِ الْمَاهِرِ وَبِسَاطِهِ الْجَدِيدِ الْجَمِيل!', 'letter_j_intro');
                if (typeof switchLetterJStation === 'function') switchLetterJStation(1);
            } else if (lesson.id === 'tab-letter_sad') {
                mascotSpeak('الْوَحْدَةُ الرَّابِعَةُ: حَرْفُ الصَّادِ (صـ ، ـصـ ، ـص ، ص) وَتَنْوِينُ الْكَسْرِ وَقِرَاءَةُ (طَيَّارَةُ وَقَّاص) (ص ٨٤ - ٨٨)! اِسْتَمِعُوا لِصَوْتِ الصَّادِ الْمُفَخَّمِ الرَّنَّانِ، وَتَعَلَّمُوا تَنْوِينَ الْكَسْرِ، وَطَيِّرُوا مَعَ وَقَّاصٍ وَصَدِيقِهِ مَنْصُورٍ أَجْمَلَ طَيَّارَةٍ وَرَقِيَّة!', 'letter_sad_intro');
                if (typeof switchLetterSadStation === 'function') switchLetterSadStation(1);
            } else if (lesson.id === 'tab-letter_hamza') {
                mascotSpeak('الْوَحْدَةُ الْخَامِسَةُ: هِوَايَاتِي وَأَلْعَابِي! مَعَ دَرْسِ الْهَمْزَةِ (ء ، أ ، إ ، ؤ ، ئ) وَأَشْكَالِهَا (ص ٨٩ - ٩٢)! اِسْتَمِعُوا لِصَوْتِ الْهَمْزَةِ الْقَوِيِّ، وَتَعَرَّفُوا عَلَى أَشْكَالِهَا الْخَمْسَةِ وَالْمَقَاطِعِ السَّاكِنَةِ وَقِرَاءَةِ نُصُوصِ الْكِتَابِ وَالنُّصُوصِ التُّرَاثِيَّةِ الْخَالِدَة!', 'letter_hamza_intro');
                if (typeof switchLetterHamzaStation === 'function') switchLetterHamzaStation(1);
            } else if (lesson.id === 'tab-letter_dhad') {
                mascotSpeak('الْوَحْدَةُ الْخَامِسَةُ: هِوَايَاتِي وَأَلْعَابِي! مَعَ دَرْسِ حَرْفِ الضَّادِ (ضـ ، ض) وَتَطْبِيقَاتِهِ (ص ٩٣ - ٩٥)! اِسْتَمِعُوا لِصَوْتِ الضَّادِ الْمُفَخَّمِ، وَتَعَرَّفُوا عَلَى أَشْكَالِهِ الأَرْبَعَةِ وَالْمَقَاطِعِ السَّاكِنَةِ وَقِرَاءَةِ نُصُوصِ الْكِتَابِ وَالنَّصِّ التُّرَاثِيِّ الْخَالِدِ (حَوْضُ السِّبَاحَةِ)!', 'letter_dhad_intro');
                if (typeof switchLetterDhadStation === 'function') switchLetterDhadStation(1);
            } else if (lesson.id === 'tab-letter_kha') {
                mascotSpeak('الْوَحْدَةُ الْخَامِسَةُ: هِوَايَاتِي وَأَلْعَابِي! مَعَ دَرْسِ حَرْفِ الْخَاءِ (خـ ، خ) وَتَطْبِيقَاتِهِ (ص ٩٦ - ٩٨)! اِسْتَمِعُوا لِصَوْتِ الْخَاءِ الْمُفَخَّمِ الرَّخْوِ، وَتَعَرَّفُوا عَلَى أَشْكَالِهِ الأَرْبَعَةِ وَالْمَقَاطِعِ السَّاكِنَةِ وَقِرَاءَةِ نُصُوصِ الْكِتَابِ (خِتَامُ تَطْبَخُ فِي مَطْبَخِ خَالَتِي) وَالنَّصِّ التُّرَاثِيِّ (خَرُوفُ خَلِيلٍ)!', 'letter_kha_intro');
                if (typeof switchLetterKhaStation === 'function') switchLetterKhaStation(1);
            } else if (lesson.id === 'tab-letter_tha') {
                mascotSpeak('الْوَحْدَةُ الْخَامِسَةُ: هِوَايَاتِي وَأَلْعَابِي! مَعَ دَرْسِ حَرْفِ الثَّاءِ (ثـ ، ث) وَتَطْبِيقَاتِهِ (ص ٩٩ - ١٠١)! اِسْتَمِعُوا لِصَوْتِ الثَّاءِ اللِّثَوِيِّ الْهَامِسِ الرَّخْوِ، وَتَعَرَّفُوا عَلَى أَشْكَالِهِ الأَرْبَعَةِ وَالْمَقَاطِعِ السَّاكِنَةِ وَقِرَاءَةِ نَصِّ الْكِتَابِ (تُرَاثُ تَصْنَعُ لُعَبًا مِنْ وَرَقٍ) وَالنَّصِّ التُّرَاثِيِّ (مِحْرَاثُ حَارِثٍ)!', 'letter_tha_intro');
                if (typeof switchLetterThaStation === 'function') switchLetterThaStation(1);
            } else if (lesson.id === 'tab-letter_kaf') {
                mascotSpeak('الْوَحْدَةُ الْخَامِسَةُ: هِوَايَاتِي وَأَلْعَابِي! مَعَ دَرْسِ حَرْفِ الْكَافِ (كـ ، ك) وَتَطْبِيقَاتِهِ (ص ١٠٢ - ١٠٤)! اِسْتَمِعُوا لِصَوْتِ الْكَافِ الشَّدِيدِ الْمَهْمُوسِ الْمُرَقَّقِ، وَتَعَرَّفُوا عَلَى أَشْكَالِهِ الأَرْبَعَةِ وَالْمَقَاطِعِ السَّاكِنَةِ وَقِرَاءَةِ نَصِّ الْكِتَابِ (بَابَا يَقْرَأُ كِتَابًا) وَالنُّصُوصِ التُّرَاثِيَّةِ (مَالِكٌ سَمَّاكٌ / كِتَابٌ مَكْتُوبٌ)!', 'letter_kaf_intro');
                if (typeof switchLetterKafStation === 'function') switchLetterKafStation(1);
            } else if (lesson.id === 'tab-shaddah') {
                mascotSpeak('الْوَحْدَةُ الْخَامِسَةُ: هِوَايَاتِي وَأَلْعَابِي! مَعَ دَرْسِ الشَّدَّةِ (ـّ) وَتَطْبِيقَاتِهَا وَقِرَاءَةِ (زُرْنَا بَيْتَ جَدِّي) وَنَشِيدِ (هَيَّا نَلْعَبْ) (ص ١٠٥ - ١٠٨)! تَعَرَّفُوا عَلَى سِرِّ تِكْرَارِ الْحَرْفِ وَدَمْجِهِ، وَأَصْوَاتِ الشَّدَّةِ مَعَ الْحَرَكَاتِ، وَتَحْلِيلِ وَتَرْكِيبِ الْكَلِمَاتِ الْمُشَدَّدَةِ، وَاقْرَؤُوا وَأَنْشِدُوا مَعَنَا!', 'shaddah_intro');
                if (typeof switchShaddahStation === 'function') switchShaddahStation(1);
            } else if (lesson.id === 'tab-letter_ghayn') {
                mascotSpeak('الْوَحْدَةُ السَّادِسَةُ: الْعَالَمُ مِنْ حَوْلِي! مَعَ دَرْسِ حَرْفِ الْغَيْنِ (غـ ، ـغـ ، ـغ ، غ) وَتَطْبِيقَاتِهِ (ص ١١٠ - ١١٣)! اِسْتَمِعُوا لِصَوْتِ الْغَيْنِ الْحَلْقِيِّ الْمُفَخَّمِ، وَتَعَرَّفُوا عَلَى أَشْكَالِهِ الأَرْبَعَةِ وَالْمَقَاطِعِ وَالتَّرْكِيبِ وَقِرَاءَةِ نُصُوصِ الْكِتَابِ وَالنُّصُوصِ التُّرَاثِيَّةِ: غَزَالٌ وَغُرَابٌ ، وَأَصْبَاغُ هِشَامٍ ، وَغُرَابٌ أَعْيَرُ!', 'letter_ghayn_intro');
                if (typeof switchLetterGhaynStation === 'function') switchLetterGhaynStation(1);
            } else if (lesson.id === 'tab-letter_ha') {
                mascotSpeak('الْوَحْدَةُ السَّادِسَةُ: الْعَالَمُ مِنْ حَوْلِي! مَعَ دَرْسِ حَرْفِ الْهَاءِ (هـ ، ـهـ ، ـه ، ه) وَتَطْبِيقَاتِهِ (ص ١١٤ - ١١٧)! اِسْتَمِعُوا لِصَوْتِ الْهَاءِ الْحَلْقِيِّ الْمَهْمُوسِ، وَتَعَرَّفُوا عَلَى أَشْكَالِهِ الأَرْبَعَةِ وَالْمَقَاطِعِ وَالتَّرْكِيبِ وَقِرَاءَةِ نَصِّ الْكِتَابِ وَالنُّصُوصِ التُّرَاثِيَّةِ: مِيَاهُ الْمَطَرِ ، وَهِلَالُ الْعِيدِ ، وَنَبِيهٌ يَعْمَلُ!', 'letter_ha_intro');
                if (typeof switchLetterHaStation === 'function') switchLetterHaStation(1);
            } else if (lesson.id === 'tab-letter_ayn') {
                mascotSpeak('الْوَحْدَةُ الثَّالِثَةُ: حَرْفُ الْعَيْنِ (عـ ، ـعـ ، ـع ، ع) وَقِرَاءَةُ (سَالِم زَرَّاع) (ص ٦٩ - ٧٢)! اِسْتَمِعُوا لِصَوْتِ حَرْفِ الْعَيْنِ الْحَلْقِيِّ الأَصِيلِ، وَتَعَرَّفُوا عَلَى الْمُدُودِ وَالْمَقَاطِعِ السَّاكِنَةِ وَالتَّنْوِينِ وَزُورُوا بُسْتَانَ سَالِمٍ الْوَاسِع!', 'letter_ayn_salim_intro');
                switchAynSalimStation(1);
            } else if (lesson.id === 'tab-letter_l_nabeel') {
                mascotSpeak('الْوَحْدَةُ الثَّالِثَةُ: حَرْفُ اللَّامِ (لـ ، ل) وَقِرَاءَةُ (نَبِيل بَقَّال) (ص ٦٥ - ٦٨)! اِسْتَمِعُوا لِصَوْتِ حَرْفِ اللَّامِ الْمُرَقَّقِ النَّقِيّ، وَتَعَرَّفُوا عَلَى الْمَدِّ الْقَصِيرِ وَالطَّوِيلِ وَالْمَقَاطِعِ وَزُورُوا دُكَّانَ نَبِيل!', 'letter_l_nabeel_intro');
                switchLNabeelStation(1);
            } else if (lesson.id === 'tab-letter_f_reef') {
                mascotSpeak('الْوَحْدَةُ الثَّالِثَةُ: حَرْفُ الْفَاءِ (فـ ، ف) وَقِرَاءَةُ (رِيفِ مَنَاف) (ص ٥٧ - ٦٠)! اِسْتَمِعُوا لِصَوْتِ حَرْفِ الْفَاءِ النَّقِيِّ، وَتَعَرَّفُوا عَلَى الْمَدِّ الْقَصِيرِ وَالطَّوِيلِ وَالْمَقَاطِعِ السَّاكِنَةِ، وَاقْرَؤُوا قِرَاءَةَ (رِيفُ مَنَاف) وَتَدَرَّبُوا عَلَى كِتَابَةِ الْحَرْفِ!', 'letter_f_reef_intro');
                setTimeout(initFReefCanvas, 500);
            } else if (lesson.id === 'tab-tanween_dham') {
                mascotSpeak('الْوَحْدَةُ الثَّانِيَة: تَنْوِينُ الضَّمِّ (ـٌ) وَتَطْبِيقَاتُهُ وَقِرَاءَةُ (وَرْدٌ)! اِسْتَمِعْ لِصَوْتِ تَنْوِينِ الضَّمِّ الرَّنَّانِ (ـٌ)، وَمَيِّزْ بَيْنَهُ وَبَيْنَ الضَّمَّة، وَحَلِّلْ وَرَكِّبْ الْمَقَاطِعَ، وَاقْرَأْ نَصَّ (سُوْرُ مَدْرَسَتِي مَتِينٌ) وَقِرَاءَةَ (وَرْدٌ)!', 'tanween_dham_intro');
                setTimeout(initTanweenDhamCanvas, 200);
            } else if (lesson.id === 'tab-letter_marboota') {
                mascotSpeak('الْوَحْدَةُ الثَّانِيَة: التَّاءُ الْمَرْبُوطَةُ (ـة ، ة) وَقِرَاءَةُ (فِي مَدْرَسَةِ سَارَة)! اِسْتَمِعْ لِصَوْتِ التَّاءِ الْمَرْبُوطَةِ اللَّطِيفَةِ عِنْدَ الْوَصْلِ وَعِنْدَ الْوَقْفِ، وَمَيِّزْ بَيْنَهَا وَبَيْنَ التَّاءِ الْمَفْتُوحَةِ، وَحَلِّلْ وَرَكِّبْ كَلِمَاتِ (سَارَة ، سَاوَة ، سَفِينَة)، وَاقْرَأْ نَصَّ (فِي مَدْرَسَةِ سَارَة: سَارَةُ تَرْسِمُ ، دِيمَةُ تَدْرُسُ ، سَرْوَةُ تَبْتَسِمُ)!', 'letter_marboota_intro');
                setTimeout(initMarbootaCanvas, 200);
            } else if (lesson.id === 'tab-letter_t') {
                mascotSpeak('الْوَحْدَةُ الثَّانِيَة: حَرْفُ التَّاءِ (تـ ، ت) وَقِرَاءَةُ (فِي بُسْتَانِ فَاتِن / بَنَات)! اِسْتَمِعْ لِصَوْتِ التَّاءِ النَّقِيّ (تْ) وَأَصْوَاتِ الْمَدُودِ وَحَلِّلْ وَرَكِّبْ كَلِمَاتِ (تُمُور ، تِين ، تَمْر) وَاقْرَأْ (فِي بُسْتَانِ فَاتِن: سَارَ بَابَا ، سَارَتْ مَامَا ، فِي بُسْتَانِ فَاتِن تِين) وَاحْتَفِ بِقِرَاءَةِ بَنَات!', 'letter_t_intro');
                setTimeout(initTCanvas, 200);
            } else if (lesson.id === 'tab-letter_n') {
                mascotSpeak('الْوَحْدَةُ الثَّانِيَة: حَرْفُ النُّون (نـ ، ن) وَقِرَاءَةُ (نُور)! اِسْتَمِعْ لِصَوْتِ النُّونِ النَّقِيّ (نْ) وَأَصْوَاتِ الْمَدُودِ وَحَلِّلْ وَرَكِّبْ كَلِمَاتِ (نُمُور ، نَار ، نَسْر) وَاقْرَأْ (فِي مَرْسَمِ سِنَان: رَسَمَ فَارِسُ دَادَا ، رَسَمَ سِنَانُ بَابَا) وَاحْتَفِ بِقِرَاءَةِ نُور!', 'letter_n_intro');
                setTimeout(initNCanvas, 200);
            } else if (lesson.id === 'tab-letter_s') {
                mascotSpeak('الْوَحْدَةُ الثَّانِيَة: حَرْفُ السِّين (سـ ، س) وَقِرَاءَةُ (فِرَاس)! اِسْتَمِعْ لِصَوْتِ السِّينِ النَّقِيّ (سْ) وَأَصْوَاتِ الْمَدُودِ وَحَلِّلْ وَرَكِّبْ كَلِمَاتِ (مِسْمَار ، فَارِس ، رَسَمَ) وَاقْرَأْ (بَابَا رَامِي رَسَمَ مُوسَى ، فَارِسُ رَسَمَ مَامَا)!', 'letter_s_intro');
                setTimeout(initSCanvas, 200);
            } else if (lesson.id === 'tab-letter_r') {
                mascotSpeak('الْوَحْدَةُ الثَّانِيَة: حَرْفُ الرَّاءِ (ر) وَتَرْكِيبُ كَلِمَةِ (دَار)! اِسْتَمِعْ لِصَوْتِ الْحَرْفِ النَّقِيّ (رْ) وَأَصْوَاتِ الْمَدُودِ وَحَلِّلْ وَرَكِّبْ كَلِمَةَ (دَار) وَاقْرَأْ (بَابَا رَامِي ، مَامَا رِيم ، دَادَا مَرَام ، دَار رَامِي)!', 'letter_r_intro');
                setTimeout(initRCanvas, 200);
            } else if (lesson.id === 'tab-unit2_intro') {

                mascotSpeak('الْوَحْدَةُ الثَّانِيَةُ: مَدْرَسَتِي! اِسْتَمِعْ لِقِصَّةِ مَدْرَسَتِي الْجَمِيلَةِ وَعَبِّرْ عَنِ الصُّوَرِ وَأَجِبْ عَنْ أَسْئِلَةِ فَصِيح!', 'unit2_welcome');

            }

        }

        function stepLesson(direction) {

            if (!flatLessonsList || flatLessonsList.length === 0) return;

            let nextIdx = currentLessonIndex + direction;

            if (nextIdx >= flatLessonsList.length) {

                nextIdx = 0;

            } else if (nextIdx < 0) {

                nextIdx = flatLessonsList.length - 1;

            }

            let loopCount = 0;

            while (nextIdx >= 0 && nextIdx < flatLessonsList.length && loopCount < flatLessonsList.length) {

                if (flatLessonsList[nextIdx].status === 'ready') {

                    goToLessonByIndex(nextIdx);

                    return;

                }

                nextIdx += direction;

                if (nextIdx >= flatLessonsList.length) nextIdx = 0;

                if (nextIdx < 0) nextIdx = flatLessonsList.length - 1;

                loopCount++;

            }

        }

