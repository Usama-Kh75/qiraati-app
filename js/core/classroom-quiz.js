/* ==========================================================================
 * منصة قراءتي التفاعلية الذكية - محرك المسابقات التنافسية الصفية المباشرة
 * (Classroom Live Quiz & Game Show Engine)
 * للمسابقات الحية بين أجهزة التابلت وشاشة العرض الذكية / السبورة التفاعلية
 * متوافق 100% مع معايير وزارة التربية وقواعد أسامة المعمارية
 * إعداد وتطوير: المهندس أسامة خليل هاشم
 * ========================================================================== */

(function () {
    'use strict';

    // مفاتيح التخزين المحلي الصارمة (تلتزم بالبادئة qiraati-smart- وفق قواعد أسامة)
    const STORAGE_KEY_ROLE = 'qiraati-smart-quiz-role';
    const STORAGE_KEY_PIN = 'qiraati-smart-quiz-pin';
    const STORAGE_KEY_TEAM = 'qiraati-smart-quiz-team';
    const STORAGE_KEY_PLAYER_NAME = 'qiraati-smart-quiz-player-name';
    const STORAGE_KEY_AVATAR = 'qiraati-smart-quiz-avatar';
    const STORAGE_KEY_ACTIVE_QUIZ = 'qiraati-smart-quiz-active-id';

    // الفرق الصفية الأربعة المعتمدة
    const TEAMS_DEF = {
        falcons: { id: 'falcons', name: 'فريق الصقور', icon: '🦅', color: '#0284c7', bg: '#e0f2fe' },
        stars:   { id: 'stars',   name: 'فريق النجوم', icon: '⭐', color: '#d97706', bg: '#fef3c7' },
        knights: { id: 'knights', name: 'فريق الفرسان', icon: '🐎', color: '#7c3aed', bg: '#ede9fe' },
        lions:   { id: 'lions',   name: 'فريق الأبطال', icon: '🦁', color: '#dc2626', bg: '#fee2e2' }
    };

    // الأشكال الهندسية وألوان الخيارات الأربعة (نمط Game Show العالمي)
    const OPTIONS_DEF = [
        { shape: '🔺', name: 'مثلث', color: '#ef4444', label: 'أ' },
        { shape: '🔷', name: 'معين',  color: '#0284c7', label: 'ب' },
        { shape: '🟡', name: 'دائرة', color: '#eab308', label: 'ج' },
        { shape: '🟩', name: 'مربع',  color: '#10b981', label: 'د' }
    ];

    // ==========================================================================
    // بنك أسئلة المسابقات التنافسية المنهجي المصنف (Curriculum Quiz Catalog)
    // ==========================================================================
    const QUIZ_CATALOG = {
        quiz_prep: {
            id: 'quiz_prep',
            title: 'مسابقة التهيئة والاستعداد القرائي 🎒',
            unit: 'التهيئة والاستعداد',
            desc: 'تحدي تمييز الأصوات والأماكن والأطوال والاتجاهات المنهجية (كتاب ص 7 - 10)',
            icon: '🌱',
            timeLimit: 15,
            questions: [
                {
                    text: 'أي الأداة التالية نستخدمها لكتابة الحروف في الدفتر؟',
                    category: 'تسمية الأشياء',
                    image: 'activity_3_items.png',
                    audioWord: 'قَلَم',
                    options: ['قَلَمُ الرَّصَاص', 'الْمِمْحَاة', 'الْمِسْطَرَة', 'الْحَقِيبَة'],
                    correct: 0,
                    hint: 'أداة خشبية لها سن رصاص نكتب به',
                    explanation: 'قلم الرصاص هو الأداة الأساسية لكتابة الحروف ورسم الخطوط الجميلة.'
                },
                {
                    text: 'في صورة ص ٩ من كتاب قراءتي: أي الحيوانات هو الأطول؟',
                    category: 'المفاهيم المكانية',
                    image: 'activity_6.png',
                    audioWord: 'زَرَافَة',
                    options: ['الزَّرَافَةُ الْجَمِيلَة', 'الْقِطَّةُ الصَّغِيرَة', 'الْأَرْنَبُ السَّرِيع', 'الْعُصْفُور'],
                    correct: 0,
                    hint: 'لها رقبة طويلة تصل لأعلى الأشجار',
                    explanation: 'الزرافة هي الحيوان الأطول بين الحيوانات بفضل رقبتها الطويلة الشامخة.'
                },
                {
                    text: 'عند إشارة المرور، ما اللون الذي يعني: (تَوَقَّفْ ولا تعبر)؟',
                    category: 'الاتجاهات والسلامة',
                    image: 'activity_8_directions.png',
                    audioWord: 'إِشَارَةُ الْمُرُور',
                    options: ['اللَّوْنُ الْأَحْمَر', 'اللَّوْنُ الْأَخْضَر', 'اللَّوْنُ الْأَصْفَر', 'اللَّوْنُ الْأَزْرَق'],
                    correct: 0,
                    hint: 'اللون الأحمر التحذيري في أعلى الإشارة',
                    explanation: 'اللون الأحمر في إشارة المرور يعني التوقف التام حفاظاً على سلامة التلاميذ.'
                },
                {
                    text: 'العصفور في الشجرة يقف: (فَوْقَ الغصن) أم (تَحْتَ الغصن)؟',
                    category: 'الأماكن والاتجاهات',
                    image: 'activity_7_places.png',
                    audioWord: 'فَوْق',
                    options: ['فَوْقَ الْغُصْن', 'تَحْتَ التُّرَاب', 'خَلْفَ الْبَاب', 'دَاخِلَ الصُّنْدُوق'],
                    correct: 0,
                    hint: 'يقف في الأعلى يغرد بنشاط',
                    explanation: 'يقف العصفور فوق الغصن ليطل على الحديقة ويغرد بأجمل الألحان.'
                },
                {
                    text: 'ما الصوت الأول الذي تسمعه في كلمة «بَطَّة»؟',
                    category: 'الوعي الفونيمي',
                    image: 'activity_4.png',
                    audioWord: 'بَطَّة',
                    options: ['صوت (بَـ)', 'صوت (دَ)', 'صوت (رَ)', 'صوت (مَـ)'],
                    correct: 0,
                    hint: 'حرف الباء مع الفتحة النقطة تحته',
                    explanation: 'كلمة بَطَّة تبدأ بالصوت القصير المفتوح (بَـ).'
                }
            ]
        },

        quiz_unit1: {
            id: 'quiz_unit1',
            title: 'مسابقة الوحدة الأولى: أُسْرَتِي 🏠',
            unit: 'الوحدة الأولى',
            desc: 'تحدي حروف (ب ، م ، د ، ر) وقراءة كلمات (دَادَا ، دَار ، بَابَا ، مَامَا) (ص 17 - 35)',
            icon: '👨‍👩‍👧‍👦',
            timeLimit: 20,
            questions: [
                {
                    text: 'إذا دمجنا الصوتين «دَا» + «دَا»، فما هي الكلمة التي نحصل عليها؟',
                    category: 'تركيب مقطعي',
                    image: 'unit1_family_listen.png',
                    audioWord: 'دَادَا',
                    options: ['دَادَا (الطفل الصغير)', 'دَار (البيت)', 'دُور (البيوت)', 'دُود'],
                    correct: 0,
                    hint: 'الطفل الرضيع الصغير في حضن أمه',
                    explanation: 'المقطعان المتطابقان (دَا + دَا) يكونان كلمة دَادَا وهي أولى كلمات قراءتي.'
                },
                {
                    text: 'ما هو الحرف المشترك بين كلمتي: «بَابَا» و «بَقَرَة»؟',
                    category: 'الحروف الهجائية',
                    image: 'unit1_story_living.png',
                    audioWord: 'بَابَا',
                    options: ['حرف الباء (بـ / ب)', 'حرف الراء (ر)', 'حرف الدال (د)', 'حرف الميم (م)'],
                    correct: 0,
                    hint: 'حرف تحته نقطة واحدة مميزة',
                    explanation: 'كلا الكلمتين تبدآن بحرف الباء (بـ) بنقطته اللطيفة في الأسفل.'
                },
                {
                    text: 'حلل كلمة «مَامَا» إلى مقاطِعها الصوتية الصحيحة:',
                    category: 'تحليل صوتي',
                    image: 'unit1_story_kitchen.png',
                    audioWord: 'مَامَا',
                    options: ['مَا + مَا', 'مَـ + امَا', 'مَام + َا', 'مُو + مِي'],
                    correct: 0,
                    hint: 'مقطعان صوتيان طويلان متطابقان يبدآن بالميم',
                    explanation: 'كلمة مَامَا تتألف من مقطعي مد بالألف متماثلين: (مَا + مَا).'
                },
                {
                    text: 'ما الفرق بين كلمة «دَار» وكلمة «دُور»؟',
                    category: 'المدود الفونيمية',
                    image: 'activity_r_scene.png',
                    audioWord: 'دَار',
                    options: ['دَار فيها مد الألف (ا)، ودُور فيها مد الواو (و)', 'لا يوجد أي فرق', 'دَار تبدأ بالباء', 'دُور تنتهي بالميم'],
                    correct: 0,
                    hint: 'انتبه لحرف المد الأوسط في الكلمتين',
                    explanation: 'دَار صوت مد الألف، بينما دُور صوت مد الواو وهو جمع يدل على بيوت كثيرة.'
                },
                {
                    text: 'في درس قراءتي: ماذا كانت تفعل الجدة في غرفة الجلوس؟',
                    category: 'فهم المقروء',
                    image: 'unit1_story_grandma.png',
                    audioWord: 'الْجَدَّة',
                    options: ['تَرْوِي حِكَايَةً مُشَوِّقَةً لِلْأَبْنَاءِ', 'تَسْبَحُ فِي الشَّاطِئ', 'تَقُودُ الطَّائِرَة', 'تَلْعَبُ كُرَةَ الْقَدَم'],
                    correct: 0,
                    hint: 'تجلس مبتسمة وتجمع الأحفاد حولها',
                    explanation: 'الجدة الحنونة تجمع الأطفال لتحكي لهم قصصاً وحكايات مفيدة وجميلة.'
                }
            ]
        },

        quiz_unit2: {
            id: 'quiz_unit2',
            title: 'مسابقة الوحدة الثانية: مَدْرَسَتِي 🎒',
            unit: 'الوحدة الثانية',
            desc: 'تحدي حروف (س ، ن ، ت ، ة) وتنوين الضم وقراءة كلمات فِرَاس وسَارَة ونُور (ص 31 - 52)',
            icon: '🏫',
            timeLimit: 20,
            questions: [
                {
                    text: 'ما هو الصوت الذي ينتهي به اسم البطلة اللطيفة «سَارَة»؟',
                    category: 'التاء المربوطة',
                    image: 'unit2_story_friends.png',
                    audioWord: 'سَارَة',
                    options: ['التاء المربوطة المنفصلة (ة)', 'التاء المفتوحة (ت)', 'الهاء الساكنة', 'النون الساكنة'],
                    correct: 0,
                    hint: 'دائرة صغيرة تعلوها نقطتان',
                    explanation: 'ينتهي اسم سَارَة بالتاء المربوطة (ـة/ة) التي تُنطق تاءً مع الحركات وهاءً عند الوقف.'
                },
                {
                    text: 'إذا أضفنا تنوين الضم (ـٌ) إلى كلمة «وَرْد»، فكيف نلفظها؟',
                    category: 'التنوين',
                    image: 'activity_tanween_dham_scene.png',
                    audioWord: 'وَرْدٌ',
                    options: ['وَرْدٌ (وَرْدُنْ)', 'وَرْدَ (وَرْدَا)', 'وَرْدِ (وَرْدِنْ)', 'وَرْدْ'],
                    correct: 0,
                    hint: 'ضمتان تُصدران نغمة موسيقية كحرف النون',
                    explanation: 'تنوين الضم (ـٌ) ينطق نوناً ساكنة في اللفظ فنقول: وَرْدٌ.'
                },
                {
                    text: 'ما هي المقاطع المكونة لاسم الصديق «فِـ رَ ا س»؟',
                    category: 'تركيب مقطعي',
                    image: 'unit2_story_classroom.png',
                    audioWord: 'فِرَاس',
                    options: ['فِـ + رَا + س', 'فِرْ + اس', 'فِ + رَ + س', 'فَا + رُوس'],
                    correct: 0,
                    hint: 'ثلاثة مقاطع صوتية متناسقة',
                    explanation: 'فِـ (صوت قصير) + رَا (مد طويل بالراء) + س (صوت ساكن) = فِرَاس.'
                },
                {
                    text: 'حرف النون في أول كلمة «نُور» يكتب بالشكل:',
                    category: 'أشكال الحروف',
                    image: 'activity_n_scene.png',
                    audioWord: 'نُور',
                    options: ['نـ (يمد يده ليتصل بما بعده)', 'ن (منفصل)', 'ـن (متصل آخري)', 'ة'],
                    correct: 0,
                    hint: 'صحن صغير يعلوه نقطة واحدة ويمد ذراعه لليسار',
                    explanation: 'يكتب النون في أول الكلمة (نـ) ليتصل بحرف المد الواو.'
                },
                {
                    text: 'أكمل بيت النشيد المدرسي: «مَدْرَسَتِي حَدِيقَتِي وَبَابُهَا .....»:',
                    category: 'الأناشيد المنهجية',
                    image: 'unit2_story_yard.png',
                    audioWord: 'مَدْرَسَتِي',
                    options: ['الْكِتَابُ', 'الْبَابُ', 'السَّحَابُ', 'الشَّبَابُ'],
                    correct: 0,
                    hint: 'مفتاح العلم والمعرفة',
                    explanation: 'مَدْرَسَتِي حَدِيقَتِي وَبَابُهَا الْكِتَابُ.. شَكْرًا لِمُعَلِّمِي وَحُبَّا لِلْأَصْحَاب.'
                }
            ]
        },

        quiz_unit3: {
            id: 'quiz_unit3',
            title: 'مسابقة الوحدة الثالثة: أَلْعَابِي وَحَيَوَانَاتِي ⚽',
            unit: 'الوحدة الثالثة',
            desc: 'تحدي حروف (ط ، ف ، ق) وقراءة رِيف مَنَاف وبُوق نَدِيم وبَطّ وطُيُور (ص 53 - 70)',
            icon: '🦆',
            timeLimit: 20,
            questions: [
                {
                    text: 'في درس قراءتي: بوق مَن كان قديماً؟',
                    category: 'فهم المقروء',
                    image: 'activity_booq_scene.png',
                    audioWord: 'بُوقُ نَدِيم',
                    options: ['بُوقُ نَدِيمٍ قَدِيمٌ', 'بُوقُ مَنَافٍ جَدِيدٌ', 'بُوقُ طَارِقٍ ضَخْمٌ', 'بُوقُ زَيْدٍ سَرِيعٌ'],
                    correct: 0,
                    hint: 'بُوقُ نَدِيمٍ قَدِيمٌ.. نَدِيمٌ يَقُودُ بَقَرَ مَنَافٍ',
                    explanation: 'الجملة المنهجية الشهيرة في كتاب قراءتي: بُوقُ نَدِيمٍ قَدِيمٌ.'
                },
                {
                    text: 'كلمة «رِيف» وكلمة «فَارُوق» تشتركان في وجود حرف:',
                    category: 'الحروف الهجائية',
                    image: 'activity_reef_read.png',
                    audioWord: 'رِيف',
                    options: ['حرف الفاء (فـ / ف)', 'حرف الطاء (ط)', 'حرف الصاد (ص)', 'حرف الدال (د)'],
                    correct: 0,
                    hint: 'دائرة فوقها نقطة واحدة وصوت الهواء يخرج بنعومة',
                    explanation: 'كلا الكلمتين تحويان صوت حرف الفاء (فـ في فاروق، وـف في ريف).'
                },
                {
                    text: 'ما هو الحرف الذي يميز كلمة «بَـ طّ» في نهايته مع الشدة؟',
                    category: 'الظواهر اللغوية',
                    image: 'activity_ta_scene.png',
                    audioWord: 'بَطّ',
                    options: ['حرف الطاء المشدد (طّ)', 'حرف التاء (ت)', 'حرف الظاء (ظ)', 'حرف الدال (د)'],
                    correct: 0,
                    hint: 'حرف مفخم قوي بعصا شامخة',
                    explanation: 'تنتهي كلمة بَطّ بحرف الطاء المشدد المفخم والقوي.'
                },
                {
                    text: 'أي الكلمات التالية تحوي صوت حرف القاف في أولها (قـ)؟',
                    category: 'الوعي الفونيمي',
                    image: 'activity_booq_trace.png',
                    audioWord: 'قَلَم',
                    options: ['قَلَم / قِطَار', 'فَرَاشَة / فِيل', 'طَيَّار / طَيْر', 'بَاب / بِنْت'],
                    correct: 0,
                    hint: 'حرف له نقطتان فوق رأسه وينطق من أقصى الحلق',
                    explanation: 'كلمتا قَلَم وقِطَار تبدآن بحرف القاف بنقطتيه الاثنتين.'
                },
                {
                    text: 'رِيفُ مَنَافٍ فِيهِ بَقَرٌ وَ...... أكمل الجملة الصحيحة:',
                    category: 'فهم المقروء',
                    image: 'activity_reef_scene.png',
                    audioWord: 'بَقَرٌ وَوَزّ',
                    options: ['بَقَرٌ وَوَزٌّ', 'سَمَكٌ وَحِيتَان', 'طَيَّارَات وَسَيَّارَات', 'ذِئَاب وَنُمُور'],
                    correct: 0,
                    hint: 'طائر مائي أبيض يسبح في الغدير',
                    explanation: 'رِيفُ مَنَافٍ فِيهِ بَقَرٌ.. رِيفُ مَنَافٍ فِيهِ وَزٌّ.'
                }
            ]
        },

        quiz_unit4: {
            id: 'quiz_unit4',
            title: 'مسابقة الوحدة الرابعة: صِحَّتِي وَبِيئَتِي 🍎',
            unit: 'الوحدة الرابعة',
            desc: 'تحدي حروف (ح ، ش ، ز ، ج ، ص) وتنوين الكسر وطَيَّارَة وَقَّاص (ص 71 - 89)',
            icon: '🧼',
            timeLimit: 20,
            questions: [
                {
                    text: 'ماذا صنع وَقَّاصٌ من الورق في درس القراءة؟',
                    category: 'فهم المقروء',
                    image: 'activity_sad_read.png',
                    audioWord: 'طَيَّارَةُ وَقَّاص',
                    options: ['طَيَّارَةً وَرَقِيَّةً جَمِيلَة', 'سَفِينَةً خَشَبِيَّة', 'بَيْتًا صَغِيرًا', 'قِطَارًا حَدِيدِيًّا'],
                    correct: 0,
                    hint: 'لعبة ورقية تطير في الهواء بالخيط',
                    explanation: 'صَنَعَ وَقَّاصٌ طَيَّارَةً وَرَقِيَّةً لَعِبَ بِهَا مَعَ صَدِيقِهِ مَنْصُور.'
                },
                {
                    text: 'حرف الصاد في كلمة «مَنْصُور» صوته:',
                    category: 'الأصوات الفونيمية',
                    image: 'activity_sad_scene.png',
                    audioWord: 'مَنْصُور',
                    options: ['صوت مفخم قوي (صُـ)', 'صوت مرقق مثل السين (سـ)', 'صوت الشين (شـ)', 'صوت الزاي (ز)'],
                    correct: 0,
                    hint: 'حرف استعلاء قوي ومطبق يملأ الفم بصداه',
                    explanation: 'الصاد حرف استعلاء مفخم ومطبق يختلف تماماً عن السين المرققة.'
                },
                {
                    text: 'كلمة «زَيْـ ـتُـ ـو ن» كم مقطعاً صوتياً تحوي؟',
                    category: 'تحليل مقطعي',
                    image: 'activity_z_words.png',
                    audioWord: 'زَيْتُون',
                    options: ['3 مقاطع (زَيْـ + تُو + ن)', 'مقطعان فقط', '4 مقاطع', 'مقطع واحد'],
                    correct: 0,
                    hint: 'زَيْـ (ساكن) + تُو (مد بالواو) + ن (ساكن)',
                    explanation: 'زَيْتُون = زَيْـ (مقطع لين ساكن) + تُو (مقطع مد طويل) + ن (صوت منفصل).'
                },
                {
                    text: 'علامة تنوين الكسر (ـٍ) توضع:',
                    category: 'الحركات والتنوين',
                    image: 'activity_sad_tanween_kasr.png',
                    audioWord: 'تَنْوِينُ الْكَسْر',
                    options: ['تَحْتَ الْحَرْفِ (كسرتان)', 'فَوْقَ الْحَرْفِ (ضمتان)', 'فَوْقَ الْأَلِفِ (فتحتان)', 'بِجَانِبِ الْحَرْف'],
                    correct: 0,
                    hint: 'كسرتان متوازيتان تجلسان تحت الحرف في ختام الكلمة',
                    explanation: 'تنوين الكسر (ـٍ) يكتب كسرتين تحت آخر حرف في الكلمة.'
                },
                {
                    text: 'أي الحيوانات التالية يبدأ بحرف الجيم (جـ)؟',
                    category: 'الوعي الفونيمي',
                    image: 'activity_j_scene.png',
                    audioWord: 'جَمَل',
                    options: ['جَمَل (سفينة الصحراء)', 'حِصَان', 'خَرُوف', 'أَسَد'],
                    correct: 0,
                    hint: 'حيوان صبور يعيش في الصحراء وله سنام',
                    explanation: 'جَمَل يبدأ بحرف الجيم (جـ) بنقطتها المميزة في بطنها.'
                }
            ]
        },

        quiz_unit5: {
            id: 'quiz_unit5',
            title: 'مسابقة الوحدة الخامسة: هِوَايَاتِي وَأَلْعَابِي 🎨',
            unit: 'الوحدة الخامسة',
            desc: 'تحدي الهمزة بأشكالها والضاد والخاء والثاء والكاف والشدة (ص 89 - 109)',
            icon: '🪁',
            timeLimit: 20,
            questions: [
                {
                    text: 'ما هي مهنة «أَمِين» في درس القراءة ص ٩٠؟',
                    category: 'فهم المقروء',
                    image: 'activity_hamza_read.png',
                    audioWord: 'أَمِين بَنَّاء',
                    options: ['أَمِين بَنَّاءٌ (يَبْنِي الدُّور)', 'أَمِين سَمَّاكٌ (يَصِيدُ السَّمَك)', 'أَمِين خَبَّازٌ', 'أَمِين طَبِيبٌ'],
                    correct: 0,
                    hint: 'أَمِينُ بَنَّاءٌ.. يَبْنِي دَارَنَا وَيَبْنِي دَارَ أَدِيب',
                    explanation: 'أَمِين بَنَّاءٌ يَبْنِي دَارَنَا وَدَارَ أَدِيب.'
                },
                {
                    text: 'الهمزة المكسورة في أول الكلمة كما في «إِقْبَال» تكتب:',
                    category: 'رسم الهمزة',
                    image: 'activity_hamza_scene.png',
                    audioWord: 'إِقْبَال',
                    options: ['تَحْتَ الْأَلِفِ (إِ)', 'فَوْقَ الْأَلِفِ (أَ)', 'عَلَى الْوَاوِ (ؤ)', 'عَلَى السَّطْرِ (ء)'],
                    correct: 0,
                    hint: 'كسرة تسحب الهمزة لتجلس تحت الألف',
                    explanation: 'عندما تكون الهمزة مكسورة، تُكتب تحت الألف دائماً: (إِ).'
                },
                {
                    text: 'ما الحرف المميز الذي يجعل لغتنا تسمى «لُغَةَ الضَّاد»؟',
                    category: 'الحروف الهجائية',
                    image: 'activity_dhad_read.png',
                    audioWord: 'حَرْفُ الضَّاد',
                    options: ['حرف الضاد (ضـ / ض)', 'حرف الصاد (ص)', 'حرف الظاء (ظ)', 'حرف الدال (د)'],
                    correct: 0,
                    hint: 'حرف عربي أصيل لا يوجد في سائر اللغات العالمية',
                    explanation: 'اللغة العربية تسمى لغة الضاد لأن حرف الضاد حرف فريد يميز مخارجها.'
                },
                {
                    text: 'في درس الشدة: كلمة «شَمَّام» نطقنا حرف الميم فيها مرتين لأن فوقه:',
                    category: 'الشدة والتضعيف',
                    image: 'activity_shaddah_read.png',
                    audioWord: 'شَمَّام',
                    options: ['عَلَامَةَ الشَّدَّةِ (ـّ)', 'حَرَكَةَ السُّكُونِ', 'تَنْوِينَ الضَّمِّ', 'مَدَّ الْأَلِفِ'],
                    correct: 0,
                    hint: 'رسم يشبه رأس السين الصغيرة يدمج الحرف الساكن والمتحرك',
                    explanation: 'الشدة (ـّ) تدل على أن الحرف مكون من حرفين: الأول ساكن والثاني متحرك.'
                },
                {
                    text: 'مَالِكٌ فِي دَرْسِ الْقِرَاءَةِ كَانَ يَعْمَلُ:',
                    category: 'فهم المقروء',
                    image: 'activity_kaf_read.png',
                    audioWord: 'مَالِكٌ سَمَّاكٌ',
                    options: ['مَالِكٌ سَمَّاكٌ (يَبِيعُ السَّمَكَ الطَّازَج)', 'مَالِكٌ خَيَّاطٌ', 'مَالِكٌ زَرَّاعٌ', 'مَالِكٌ حَلَّاقٌ'],
                    correct: 0,
                    hint: 'مَالِكٌ سَمَّاكٌ.. يَبِيعُ السَّمَكَ فِي الشِّبَاك',
                    explanation: 'مَالِكٌ سَمَّاكٌ يَبِيعُ السَّمَك.. عِنْدَ مَالِكٍ زَوْرَقٌ وَشِبَاكٌ.'
                }
            ]
        },

        quiz_unit6: {
            id: 'quiz_unit6',
            title: 'مسابقة الوحدة السادسة: الْعَالَمُ مِنْ حَوْلِي 🌍',
            unit: 'الوحدة السادسة',
            desc: 'تحدي حروف الغين والهاء والذال ونَبِيهٌ ومِيَاهُ الْمَطَرِ وأُسْتَاذٌ وَتَلَامِيذٌ (ص 109 - 128)',
            icon: '🌟',
            timeLimit: 20,
            questions: [
                {
                    text: 'في درس ص ١١٤: «مِيَاهُ الْمَطَرِ تَسْقِي .....» أكمل الجملة:',
                    category: 'فهم المقروء',
                    image: 'activity_ha_read.png',
                    audioWord: 'مِيَاهُ الْمَطَر',
                    options: ['تَسْقِي الزَّرْعَ', 'تَسْقِي الْبُيُوتَ', 'تَمْلَأُ السَّيَّارَاتِ', 'تُغْرِقُ الطَّرِيقَ'],
                    correct: 0,
                    hint: 'مِيَاهُ الْمَطَرِ تَسْقِي الزَّرْعَ.. أَبُو نَبِيهٍ يَزْرَعُ',
                    explanation: 'مِيَاهُ الْمَطَرِ تَسْقِي الزَّرْعَ.. أَبُو نَبِيهٍ يَزْرَعُ وَنَبِيهٌ يُسَاعِدُهُ.'
                },
                {
                    text: 'ما الفرق في النقطة بين حرف الدال (د) وحرف الذال (ذ)؟',
                    category: 'الحروف المتشابهة',
                    image: 'activity_dhal_read.png',
                    audioWord: 'حَرْفُ الذَّال',
                    options: ['الذال يعلوه نقطة واحدة ونخرج فيه طرف اللسان، والدال بلا نقطة', 'الدال له نقطتان', 'لا يوجد أي فرق', 'الذال تحته نقطة'],
                    correct: 0,
                    hint: 'الذال حرف لثوي تخرج معه ذؤابة اللسان اللطيفة',
                    explanation: 'الذال (ذ) حرف لثوي فوقه نقطة، بينما الدال (د) مجرد من النقاط.'
                },
                {
                    text: 'في درس «غَزَالٌ وَغُرَابٌ»: أين سقط الغزال الصغير؟',
                    category: 'فهم المقروء',
                    image: 'activity_ghayn_read.png',
                    audioWord: 'غَزَالٌ وَغُرَاب',
                    options: ['سَقَطَ فِي الْحُفْرَةِ وَانْكَسَرَتْ سَاقُهُ', 'طَارَ فِي السَّمَاءِ', 'نَامَ فِي السَّرِيرِ', 'سَبَحَ فِي الْبَحْرِ'],
                    correct: 0,
                    hint: 'صَاحَ الْغَزَالُ: سَاقِي مَكْسُورَةٌ، أَعِنِّي يَا صَدِيقِي',
                    explanation: 'سقط الغزال في الحفرة وانكسرت ساقه، فجاء الغراب وأنقذه بذكاء.'
                },
                {
                    text: 'ما شكل حرف الهاء المربوطة في كلمة «مِيَاه»؟',
                    category: 'أشكال الهاء',
                    image: 'activity_ha_scene.png',
                    audioWord: 'مِيَاه',
                    options: ['هاء آخرية منفصلة (ه)', 'تاء مربوطة (ة)', 'هاء فيونكة (ـهـ)', 'هاء أولية (هـ)'],
                    correct: 0,
                    hint: 'دائرة لطيفة بدون أي نقاط في آخر الكلمة بعد الألف',
                    explanation: 'في كلمة مِيَاه، الهاء آخرية منفصلة (ه) لا نقاط فوقها.'
                },
                {
                    text: '«مَنْ جَدَّ وَجَدَ، وَمَنْ زَرَعَ .....» أكمل الحكمة المنهجية:',
                    category: 'الحكم والآداب',
                    image: 'activity_ha_read.png',
                    audioWord: 'حَصَد',
                    options: ['حَصَدَ (نَالَ ثَمَرَةَ جُهْدِهِ)', 'رَقَدَ', 'فَقَدَ', 'شَرِبَ'],
                    correct: 0,
                    hint: 'مَن يزرع الخير يحصد النجاح والتفوق',
                    explanation: 'من جد وجد ومن زرع حصد، من يدرس بجد يتفوق ويفوز بالمراتب العليا.'
                }
            ]
        },

        quiz_all: {
            id: 'quiz_all',
            title: 'كأس البطولة الكبرى لقراءتي 🏆',
            unit: 'مسابقة شاملة لكافة الوحدات',
            desc: 'المسابقة الكبرى الشاملة للتحدي الصفي الفونيمي والقرائي لكتاب قراءتي كاملاً (129 صفحة)',
            icon: '👑',
            timeLimit: 25,
            questions: [
                {
                    text: 'ما هو الصوت النقي لحرف الدال الصامت كما في الطريقة الفونيمية؟',
                    category: 'الوعي الفونيمي',
                    image: 'activity_d_scene.png',
                    audioWord: 'دْ',
                    options: ['صوت (دْ) النقي الساكن', 'اسم الحرف (دال)', 'صوت الضاد', 'صوت الدال مع التنوين'],
                    correct: 0,
                    hint: 'الصوت الخالص المجرد بدون اسم ولا حركة',
                    explanation: 'الطريقة الفونيمية تعلم الطفل صوت الحرف النقي الصرف (دْ) لتسهيل الدمج المباشر.'
                },
                {
                    text: 'إذا جمعنا الكلمات الثلاث: «دَارُ» + «نُورِي» + «بَابَا»، فما الجملة المفيدة؟',
                    category: 'تركيب الجمل',
                    image: 'unit1_family_listen.png',
                    audioWord: 'دَارُ نُورِي',
                    options: ['دَارُ نُورِي قَرِيبٌ مِنْ بَابَا', 'بَابَا فِي الْقَمَر', 'نُورِي طَيَّارَة', 'دَار مَامَا فِي الْبَحْر'],
                    correct: 0,
                    hint: 'جملة مفيدة تحكي عن بيت الجيران القريب',
                    explanation: 'دَارُ نُورِي قَرِيبٌ.. جَمَعْنَا الْكَلِمَاتِ لِتَكْوِينِ جُمْلَةٍ قِرَائِيَّةٍ مُتَكَامِلَة.'
                },
                {
                    text: 'أي الكلمات التالية تحوي (لاماً شمسية) لا تظهر في النطق؟',
                    category: 'اللام الشمسية والقمرية',
                    image: 'activity_lam_scene.png',
                    audioWord: 'الشَّمْس',
                    options: ['الشَّمْسُ (تُكتب اللام وتدغم)', 'الْقَمَرُ (تظهر اللام ساكنة)', 'الْكِتَابُ', 'الْمَدْرَسَةُ'],
                    correct: 0,
                    hint: 'الشين حرف شمسي مشدد يجعل اللام خفية في اللفظ',
                    explanation: 'في كلمة الشَّمْس، اللام شمسية تُكتب ولا تُلفظ، والحرف بعدها مشدد.'
                },
                {
                    text: 'ما هي الكلمة الصحيحة التي تدل على جمع كلمة «دَار»؟',
                    category: 'المفرد والجمع',
                    image: 'activity_r_scene.png',
                    audioWord: 'دُور',
                    options: ['دُور (بمد الواو)', 'دَارَات', 'أَدْوَار', 'دَيْر'],
                    correct: 0,
                    hint: 'دَارٌ وَاحِدَة، وَدُورٌ كَثِيرَة',
                    explanation: 'دَار مفرد، وجمعها في كتاب قراءتي هو: دُور.'
                },
                {
                    text: 'شخصية مساعدنا الذكي المرح في منصة قراءتي يسمى:',
                    category: 'هوية المنصة',
                    image: 'icons/faseeh_avatar.svg',
                    audioWord: 'فَصِيح',
                    options: ['القلم الذكي «فَصِيح» ✏️', 'الغراب الصغير', 'العصفور المغرد', 'البطة السريعة'],
                    correct: 0,
                    hint: 'صديقنا القلم الرصاص المتحدث والمتحرك',
                    explanation: 'المساعد الكرتوني الذكي «فَصِيح» هو رفيق الأطفال في رحلة تعلم القراءة.'
                }
            ]
        }
    };

    // ==========================================================================
    // حالة المحرك المحلية (Engine State)
    // ==========================================================================
    let state = {
        role: 'host', // 'host' (شاشة العرض الذكية) أو 'tablet' (شاشة التلميذ) أو 'hotseat' (السبورة المباشرة)
        status: 'idle', // 'idle', 'lobby', 'question', 'revealed', 'leaderboard', 'podium'
        hostUrl: '',
        activeQuizId: 'quiz_unit1',
        gameMode: 'solo', // 'solo' أو 'teams'
        pin: '1234',
        timeLimit: 20,
        timerVal: 20,
        timerInterval: null,
        syncPollInterval: null,
        hotseatCurrentTeam: 'falcons',

        // بيانات المعلم / الاستوديو
        hostQuiz: null,
        hostQIndex: -1,
        hostPlayers: {},
        hostTeams: JSON.parse(JSON.stringify(TEAMS_DEF)),
        hostDistribution: [0, 0, 0, 0],

        // بيانات التلميذ على التابلت
        tabletStudentId: '',
        tabletStudentName: 'تلميذ بطل',
        tabletTeam: 'falcons',
        tabletAvatar: '⭐',
        tabletAnswerSent: false,
        tabletSelectedOption: -1,
        tabletScore: 0,
        tabletStreak: 0,
        tabletLastResult: null,

        // المؤثرات الصوتية
        audioCtx: null
    };

    // ==========================================================================
    // محرك النغمات والمؤثرات الصوتية الفورية (Web Audio Synthesizer)
    // ==========================================================================
    function getAudioCtx() {
        if (!state.audioCtx) {
            const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
            if (AudioCtxClass) {
                state.audioCtx = new AudioCtxClass();
            }
        }
        if (state.audioCtx && state.audioCtx.state === 'suspended') {
            state.audioCtx.resume();
        }
        return state.audioCtx;
    }

    function playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.15) {
        try {
            const ctx = getAudioCtx();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(gainVal, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (e) {
            // صامت
        }
    }

    function sfxStartQuiz() {
        // نغمة البداية الحماسية (Arpeggio)
        setTimeout(() => playTone(330, 'triangle', 0.12, 0.2), 0);
        setTimeout(() => playTone(440, 'triangle', 0.12, 0.2), 120);
        setTimeout(() => playTone(554, 'triangle', 0.15, 0.2), 240);
        setTimeout(() => playTone(659, 'triangle', 0.35, 0.25), 360);
    }

    function sfxTimerTick() {
        // تكتكة خفيفة للثواني الأخيرة
        playTone(880, 'square', 0.04, 0.08);
    }

    function sfxBuzzerPress() {
        // ضغطة التابلت
        playTone(523.25, 'sine', 0.08, 0.2);
    }

    function sfxCorrect() {
        // نغمة الإجابة الصحيحة
        setTimeout(() => playTone(523.25, 'sine', 0.12, 0.25), 0);
        setTimeout(() => playTone(659.25, 'sine', 0.15, 0.25), 100);
        setTimeout(() => playTone(783.99, 'triangle', 0.35, 0.3), 200);
    }

    function sfxIncorrect() {
        // نغمة التشجيع عند الخطأ
        setTimeout(() => playTone(280, 'sawtooth', 0.18, 0.15), 0);
        setTimeout(() => playTone(220, 'sawtooth', 0.28, 0.18), 180);
    }

    function sfxPodium() {
        // لحن التتويج الملكي
        const melody = [523, 523, 523, 659, 783, 659, 783, 1046];
        const times = [0, 150, 300, 450, 600, 800, 950, 1150];
        times.forEach((t, i) => {
            setTimeout(() => playTone(melody[i], 'triangle', 0.25, 0.25), t);
        });
    }

    // ==========================================================================
    // تهيئة المحرك واكتشاف البيئة
    // ==========================================================================
    function init() {
        initTabletIdentity();
        detectHostUrl();
        loadSavedQuizSettings();
        bindUIEvents();
    }

    function initTabletIdentity() {
        let tid = localStorage.getItem('qiraati-smart-sync-tablet-id');
        if (!tid) {
            tid = 'tab_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
            localStorage.setItem('qiraati-smart-sync-tablet-id', tid);
        }
        state.tabletStudentId = tid;

        const savedName = localStorage.getItem(STORAGE_KEY_PLAYER_NAME) || localStorage.getItem('qiraati-smart-eval-name');
        if (savedName) state.tabletStudentName = savedName;

        const savedTeam = localStorage.getItem(STORAGE_KEY_TEAM);
        if (savedTeam && TEAMS_DEF[savedTeam]) state.tabletTeam = savedTeam;

        const savedAvatar = localStorage.getItem(STORAGE_KEY_AVATAR);
        if (savedAvatar) state.tabletAvatar = savedAvatar;
    }

    function detectHostUrl() {
        const saved = localStorage.getItem('qiraati-smart-sync-host');
        if (saved) {
            state.hostUrl = saved;
            return;
        }
        if (window.location.protocol.startsWith('http')) {
            state.hostUrl = window.location.origin;
        } else {
            state.hostUrl = 'http://localhost:8080';
        }
    }

    function loadSavedQuizSettings() {
        const savedRole = localStorage.getItem(STORAGE_KEY_ROLE);
        if (savedRole) state.role = savedRole;

        const savedPin = localStorage.getItem(STORAGE_KEY_PIN);
        if (savedPin) state.pin = savedPin;

        const savedQuiz = localStorage.getItem(STORAGE_KEY_ACTIVE_QUIZ);
        if (savedQuiz && QUIZ_CATALOG[savedQuiz]) state.activeQuizId = savedQuiz;
    }

    function bindUIEvents() {
        // ربط أزرار التبديل والمستمعين
    }

    // ==========================================================================
    // إدارة النوافذ والتبديل بين الأنماط (Host / Tablet / HotSeat)
    // ==========================================================================
    function openQuizModal(preferredMode = 'host') {
        const modal = document.getElementById('classroomQuizModal');
        if (!modal) return;
        modal.style.display = 'flex';
        document.body.classList.add('modal-open');

        // كشف تلقائي: إذا كان جهازاً محمولاً أو تم حفظه كتابلت
        const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768;
        if (preferredMode === 'tablet' || (isMobileDevice && preferredMode !== 'host')) {
            switchViewMode('tablet');
        } else if (preferredMode === 'hotseat') {
            switchViewMode('hotseat');
        } else {
            switchViewMode('host');
        }
    }

    function closeQuizModal() {
        const modal = document.getElementById('classroomQuizModal');
        if (modal) modal.style.display = 'none';
        document.body.classList.remove('modal-open');
        stopSyncPolling();
        clearInterval(state.timerInterval);
    }

    function switchViewMode(mode) {
        state.role = mode;
        localStorage.setItem(STORAGE_KEY_ROLE, mode);

        const tabHost = document.getElementById('tabQuizMode_host');
        const tabTablet = document.getElementById('tabQuizMode_tablet');
        const tabHotseat = document.getElementById('tabQuizMode_hotseat');

        const paneHost = document.getElementById('quizPane_host');
        const paneTablet = document.getElementById('quizPane_tablet');
        const paneHotseat = document.getElementById('quizPane_hotseat');

        if (tabHost) tabHost.classList.toggle('active', mode === 'host');
        if (tabTablet) tabTablet.classList.toggle('active', mode === 'tablet');
        if (tabHotseat) tabHotseat.classList.toggle('active', mode === 'hotseat');

        if (paneHost) paneHost.style.display = mode === 'host' ? 'block' : 'none';
        if (paneTablet) paneTablet.style.display = mode === 'tablet' ? 'block' : 'none';
        if (paneHotseat) paneHotseat.style.display = mode === 'hotseat' ? 'block' : 'none';

        if (mode === 'host') {
            renderHostLobbySetup();
        } else if (mode === 'tablet') {
            renderTabletJoinScreen();
            startTabletSyncPolling();
        } else if (mode === 'hotseat') {
            renderHotseatSetup();
        }
    }

    // ==========================================================================
    // 1. منطق شاشة العرض الذكية للمعلم (Smartboard Arena & Host Engine)
    // ==========================================================================
    function renderHostLobbySetup() {
        const quiz = QUIZ_CATALOG[state.activeQuizId] || QUIZ_CATALOG.quiz_unit1;
        state.hostQuiz = quiz;

        const titleEl = document.getElementById('quizSetupTitle');
        const descEl = document.getElementById('quizSetupDesc');
        const qCountEl = document.getElementById('quizSetupQCount');
        const timeEl = document.getElementById('quizSetupTimeLimit');
        const pinDisplay = document.getElementById('quizLobbyPinDisplay');

        if (titleEl) titleEl.textContent = quiz.title;
        if (descEl) descEl.textContent = quiz.desc;
        if (qCountEl) qCountEl.textContent = `${quiz.questions.length} أسئلة`;
        if (timeEl) timeEl.value = quiz.timeLimit || 20;
        if (pinDisplay) pinDisplay.textContent = state.pin;

        // تحديث قائمة بنوك الأسئلة في شاشة الاختيار
        renderQuizCatalogDropdown();
        renderHostStage('setup');
    }

    function renderQuizCatalogDropdown() {
        const select = document.getElementById('quizSelectCatalog');
        if (!select) return;
        select.innerHTML = '';
        Object.keys(QUIZ_CATALOG).forEach(key => {
            const item = QUIZ_CATALOG[key];
            const opt = document.createElement('option');
            opt.value = key;
            opt.textContent = `${item.icon} ${item.title} (${item.questions.length} أسئلة)`;
            if (key === state.activeQuizId) opt.selected = true;
            select.appendChild(opt);
        });
    }

    function onQuizCatalogSelectChange() {
        const select = document.getElementById('quizSelectCatalog');
        if (!select) return;
        state.activeQuizId = select.value;
        localStorage.setItem(STORAGE_KEY_ACTIVE_QUIZ, state.activeQuizId);
        renderHostLobbySetup();
    }

    function onGameModeChange(mode) {
        state.gameMode = mode;
        const btnSolo = document.getElementById('btnModeSolo');
        const btnTeams = document.getElementById('btnModeTeams');
        if (btnSolo) btnSolo.classList.toggle('active', mode === 'solo');
        if (btnTeams) btnTeams.classList.toggle('active', mode === 'teams');
    }

    function generateNewPin() {
        // توليد رمز PIN من 4 أرقام واضحة للأطفال
        const pin = Math.floor(1000 + Math.random() * 9000).toString();
        state.pin = pin;
        localStorage.setItem(STORAGE_KEY_PIN, pin);
        const pinDisplay = document.getElementById('quizLobbyPinDisplay');
        if (pinDisplay) pinDisplay.textContent = pin;
    }

    // إطلاق شاشة اللوبي ودعوة التلاميذ بالـ PIN
    async function hostStartLobby() {
        const quiz = QUIZ_CATALOG[state.activeQuizId] || QUIZ_CATALOG.quiz_unit1;
        state.hostQuiz = quiz;
        state.status = 'lobby';
        state.hostQIndex = -1;
        state.hostPlayers = {};
        state.hostTeams = JSON.parse(JSON.stringify(TEAMS_DEF));
        state.timeLimit = parseInt(document.getElementById('quizSetupTimeLimit')?.value || 20, 10);

        sfxStartQuiz();
        renderHostStage('lobby');

        // إرسال بدء اللوبي للخادم المحلي
        try {
            await fetch(`${state.hostUrl}/api/quiz/host`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'start_lobby',
                    title: quiz.title,
                    category: quiz.unit,
                    game_mode: state.gameMode,
                    pin: state.pin,
                    time_limit: state.timeLimit,
                    questions: quiz.questions
                })
            });
        } catch (e) {
            console.warn('خادم بايثون غير متصل أو يعمل بوضع المحاكاة:', e);
        }

        // بدء فحص قائمة المنضمين كل ثانية
        startHostLobbyPolling();
    }

    function startHostLobbyPolling() {
        stopSyncPolling();
        state.syncPollInterval = setInterval(async () => {
            try {
                const res = await fetch(`${state.hostUrl}/api/quiz/state`);
                const data = await res.json();
                if (data && data.success) {
                    updateLobbyPlayersCount(data.total_players);
                }
            } catch (e) {
                // محاكاة وضع أوفلاين
            }
        }, 1200);
    }

    function updateLobbyPlayersCount(count) {
        const countEl = document.getElementById('quizLobbyPlayersCount');
        if (countEl) countEl.textContent = count;
    }

    // إطلاق السؤال التالي
    async function hostNextQuestion() {
        state.hostQIndex++;
        const questions = state.hostQuiz.questions;

        if (state.hostQIndex >= questions.length) {
            hostShowPodium();
            return;
        }

        state.status = 'question';
        state.timerVal = state.timeLimit;
        state.hostDistribution = [0, 0, 0, 0];

        renderHostStage('question');
        renderHostQuestionUI(questions[state.hostQIndex], state.hostQIndex, questions.length);

        // إرسال بدء السؤال للخادم
        try {
            await fetch(`${state.hostUrl}/api/quiz/host`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'start_question',
                    q_index: state.hostQIndex
                })
            });
        } catch (e) {
            console.warn('تحديث السؤال في الخادم:', e);
        }

        startQuestionCountdown();
        startHostQuestionPolling();
    }

    function renderHostQuestionUI(q, idx, total) {
        const qNumEl = document.getElementById('quizHostQNumber');
        const qTextEl = document.getElementById('quizHostQText');
        const qCatEl = document.getElementById('quizHostQCategory');
        const qImgEl = document.getElementById('quizHostQImage');
        const optionsHolder = document.getElementById('quizHostOptionsHolder');
        const audioWordBtn = document.getElementById('quizHostAudioBtn');

        if (qNumEl) qNumEl.textContent = `السؤال ${idx + 1} من ${total}`;
        if (qTextEl) qTextEl.textContent = q.text;
        if (qCatEl) qCatEl.textContent = q.category || 'تحدي قرائي';

        if (qImgEl) {
            if (q.image) {
                qImgEl.src = q.image;
                qImgEl.style.display = 'block';
            } else {
                qImgEl.style.display = 'none';
            }
        }

        if (audioWordBtn) {
            audioWordBtn.onclick = () => {
                if (window.AudioEngine && q.audioWord) {
                    window.AudioEngine.speakWord(q.audioWord);
                }
            };
        }

        if (optionsHolder) {
            optionsHolder.innerHTML = '';
            q.options.forEach((optText, oIdx) => {
                const optDef = OPTIONS_DEF[oIdx] || OPTIONS_DEF[0];
                const card = document.createElement('div');
                card.className = 'quiz-host-option-card';
                card.style.borderColor = optDef.color;
                card.id = `hostOptionCard_${oIdx}`;
                card.innerHTML = `
                    <div class="quiz-option-shape" style="background:${optDef.color};">${optDef.shape}</div>
                    <div class="quiz-option-body">
                        <span class="quiz-option-letter">${optDef.label}</span>
                        <span class="quiz-option-text">${escapeHtml(optText)}</span>
                    </div>
                    <div class="quiz-option-answer-count" id="hostOptionCount_${oIdx}">0</div>
                `;
                optionsHolder.appendChild(card);
            });
        }

        // تصفير عداد إجابات التلاميذ
        const answersCountEl = document.getElementById('quizHostAnswersCount');
        if (answersCountEl) answersCountEl.textContent = '0';
    }

    function startQuestionCountdown() {
        clearInterval(state.timerInterval);
        const timerNumEl = document.getElementById('quizHostTimerNum');
        const timerBarEl = document.getElementById('quizHostTimerBar');

        state.timerInterval = setInterval(() => {
            state.timerVal--;
            if (timerNumEl) timerNumEl.textContent = Math.max(0, state.timerVal);
            if (timerBarEl) {
                const pct = (state.timerVal / state.timeLimit) * 100;
                timerBarEl.style.width = `${pct}%`;
                if (pct < 30) timerBarEl.style.background = '#ef4444';
                else timerBarEl.style.background = '#0284c7';
            }

            // دقات الثواني الأخيرة
            if (state.timerVal <= 5 && state.timerVal > 0) {
                sfxTimerTick();
            }

            if (state.timerVal <= 0) {
                clearInterval(state.timerInterval);
                hostRevealAnswer();
            }
        }, 1000);
    }

    function startHostQuestionPolling() {
        stopSyncPolling();
        state.syncPollInterval = setInterval(async () => {
            try {
                const res = await fetch(`${state.hostUrl}/api/quiz/state`);
                const data = await res.json();
                if (data && data.success) {
                    const answersCountEl = document.getElementById('quizHostAnswersCount');
                    if (answersCountEl) {
                        answersCountEl.textContent = `${data.answered_count} / ${data.total_players}`;
                    }
                    // تحديث توزيع الأصوات اللحظي
                    if (data.distribution) {
                        state.hostDistribution = data.distribution;
                        data.distribution.forEach((cnt, idx) => {
                            const cEl = document.getElementById(`hostOptionCount_${idx}`);
                            if (cEl) cEl.textContent = cnt;
                        });
                    }
                }
            } catch (e) {
                // محاكاة
            }
        }, 800);
    }

    // كشف الإجابة الصحيحة وإحصاءات الصف
    async function hostRevealAnswer() {
        clearInterval(state.timerInterval);
        stopSyncPolling();
        state.status = 'revealed';

        const q = state.hostQuiz.questions[state.hostQIndex];
        const correctIdx = q.correct;

        // إبراز الخيار الصحيح بوميض ذهبي
        const correctCard = document.getElementById(`hostOptionCard_${correctIdx}`);
        if (correctCard) {
            correctCard.classList.add('correct-highlight');
        }

        // نغمة كشف الإجابة
        sfxCorrect();

        // إرسال أمر كشف الإجابة للخادم
        try {
            await fetch(`${state.hostUrl}/api/quiz/host`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'reveal_answer' })
            });
        } catch (e) {
            console.warn('كشف الإجابة في الخادم:', e);
        }

        renderHostStage('revealed');
        renderDistributionChart();

        // عرض شرح فصيح
        const explTextEl = document.getElementById('quizHostExplanationText');
        if (explTextEl) {
            explTextEl.textContent = q.explanation || 'أحسنتم يا أبطال القراءة!';
        }
    }

    function renderDistributionChart() {
        const totalAnswers = state.hostDistribution.reduce((a, b) => a + b, 0) || 1;
        state.hostDistribution.forEach((cnt, idx) => {
            const bar = document.getElementById(`chartBar_${idx}`);
            const val = document.getElementById(`chartVal_${idx}`);
            const pct = Math.round((cnt / totalAnswers) * 100);
            if (bar) bar.style.height = `${Math.max(12, pct)}%`;
            if (val) val.textContent = `${cnt} (${pct}%)`;
        });
    }

    // عرض لوحة الصدارة
    async function hostShowLeaderboard() {
        state.status = 'leaderboard';
        renderHostStage('leaderboard');

        let players = [];
        let teams = [];

        try {
            const res = await fetch(`${state.hostUrl}/api/quiz/leaderboard`);
            const data = await res.json();
            if (data && data.success) {
                players = data.top_players || [];
                teams = data.teams || [];
            }
        } catch (e) {
            // بيانات محاكاة محلية
            players = Object.values(state.hostPlayers);
        }

        // إرسال أمر الصدارة للخادم
        try {
            await fetch(`${state.hostUrl}/api/quiz/host`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'show_leaderboard' })
            });
        } catch (e) {
            // صامت
        }

        renderLeaderboardUI(players, teams);
    }

    function renderLeaderboardUI(players, teams) {
        const listHolder = document.getElementById('quizLeaderboardList');
        const teamsHolder = document.getElementById('quizLeaderboardTeams');

        if (listHolder) {
            listHolder.innerHTML = '';
            if (players.length === 0) {
                listHolder.innerHTML = '<div class="quiz-empty-msg">لا يوجد متسابقون مسجلون حتى الآن.</div>';
            } else {
                players.slice(0, 7).forEach((p, rank) => {
                    const row = document.createElement('div');
                    row.className = `quiz-leaderboard-row rank-${rank + 1}`;
                    const streakBadge = p.streak >= 3 ? `<span class="quiz-streak-tag">🔥 ${p.streak} متتالية</span>` : '';
                    row.innerHTML = `
                        <div class="leaderboard-rank">#${rank + 1}</div>
                        <div class="leaderboard-avatar">${p.avatar || '⭐'}</div>
                        <div class="leaderboard-info">
                            <div class="leaderboard-name">${escapeHtml(p.name)}</div>
                            <div class="leaderboard-meta">${TEAMS_DEF[p.team]?.name || 'فردي'} ${streakBadge}</div>
                        </div>
                        <div class="leaderboard-score">${p.total_score.toLocaleString()} ⭐</div>
                    `;
                    listHolder.appendChild(row);
                });
            }
        }

        if (teamsHolder) {
            teamsHolder.innerHTML = '';
            if (state.gameMode === 'teams') {
                teamsHolder.style.display = 'grid';
                teams.forEach(t => {
                    const teamCard = document.createElement('div');
                    teamCard.className = 'quiz-team-rank-card';
                    teamCard.style.borderTopColor = t.color;
                    teamCard.innerHTML = `
                        <div class="quiz-team-rank-icon">${t.icon}</div>
                        <div class="quiz-team-rank-name">${t.name}</div>
                        <div class="quiz-team-rank-score">${t.total_score.toLocaleString()} نقطة</div>
                    `;
                    teamsHolder.appendChild(teamCard);
                });
            } else {
                teamsHolder.style.display = 'none';
            }
        }
    }

    // عرض منصة التتويج النهائية الكبرى
    async function hostShowPodium() {
        state.status = 'podium';
        renderHostStage('podium');
        sfxPodium();

        let top3 = [];
        try {
            const res = await fetch(`${state.hostUrl}/api/quiz/leaderboard`);
            const data = await res.json();
            if (data && data.success) {
                top3 = data.top_players || [];
            }
        } catch (e) {
            top3 = Object.values(state.hostPlayers);
        }

        // إرسال أمر التتويج للخادم
        try {
            await fetch(`${state.hostUrl}/api/quiz/host`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'show_podium' })
            });
        } catch (e) {
            // صامت
        }

        renderPodiumUI(top3);
        triggerPodiumConfetti();
    }

    function renderPodiumUI(players) {
        const p1 = players[0] || { name: 'بطل القراءة 🥇', total_score: 5000, avatar: '👑' };
        const p2 = players[1] || { name: 'وصيف القراءة 🥈', total_score: 4200, avatar: '⭐' };
        const p3 = players[2] || { name: 'فارس القراءة 🥉', total_score: 3600, avatar: '🎒' };

        const elP1Name = document.getElementById('podiumP1Name');
        const elP1Score = document.getElementById('podiumP1Score');
        const elP1Avatar = document.getElementById('podiumP1Avatar');

        const elP2Name = document.getElementById('podiumP2Name');
        const elP2Score = document.getElementById('podiumP2Score');
        const elP2Avatar = document.getElementById('podiumP2Avatar');

        const elP3Name = document.getElementById('podiumP3Name');
        const elP3Score = document.getElementById('podiumP3Score');
        const elP3Avatar = document.getElementById('podiumP3Avatar');

        if (elP1Name) elP1Name.textContent = p1.name;
        if (elP1Score) elP1Score.textContent = `${p1.total_score.toLocaleString()} ⭐`;
        if (elP1Avatar) elP1Avatar.textContent = p1.avatar || '👑';

        if (elP2Name) elP2Name.textContent = p2.name;
        if (elP2Score) elP2Score.textContent = `${p2.total_score.toLocaleString()} ⭐`;
        if (elP2Avatar) elP2Avatar.textContent = p2.avatar || '⭐';

        if (elP3Name) elP3Name.textContent = p3.name;
        if (elP3Score) elP3Score.textContent = `${p3.total_score.toLocaleString()} ⭐`;
        if (elP3Avatar) elP3Avatar.textContent = p3.avatar || '🎒';
    }

    function triggerPodiumConfetti() {
        const canvas = document.getElementById('quizPodiumConfettiCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.parentElement.clientWidth || 800;
        canvas.height = canvas.parentElement.clientHeight || 500;

        const particles = [];
        const colors = ['#f59e0b', '#ef4444', '#10b981', '#0284c7', '#8b5cf6', '#ec4899'];
        for (let i = 0; i < 90; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * -canvas.height,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                speedY: Math.random() * 3 + 2,
                speedX: Math.random() * 2 - 1,
                rotation: Math.random() * 360,
                rotSpeed: Math.random() * 6 - 3
            });
        }

        let animFrame;
        function drawConfetti() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.y += p.speedY;
                p.x += p.speedX;
                p.rotation += p.rotSpeed;
                if (p.y > canvas.height) {
                    p.y = -10;
                    p.x = Math.random() * canvas.width;
                }
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
                ctx.restore();
            });
            animFrame = requestAnimationFrame(drawConfetti);
        }
        drawConfetti();
        setTimeout(() => cancelAnimationFrame(animFrame), 9000);
    }

    // إيداع درجات المسابقة في سجل لوحة تحكم المعلم
    async function ingestQuizResultsToTeacherRecords() {
        try {
            let players = [];
            const res = await fetch(`${state.hostUrl}/api/quiz/leaderboard`);
            const data = await res.json();
            if (data && data.success) {
                players = data.top_players || [];
            } else {
                players = Object.values(state.hostPlayers);
            }

            if (players.length === 0) {
                alert('لا توجد نتائج مسابقة للإيداع حالياً.');
                return;
            }

            if (window.TeacherDashboard && typeof window.TeacherDashboard.ingestQuizResults === 'function') {
                window.TeacherDashboard.ingestQuizResults(players, state.hostQuiz.title);
                alert(`✔ تم إيداع نتائج ${players.length} تلميذ في سجل درجات لوحة تحكم المعلم بنجاح! ⭐`);
            } else {
                alert('لوحة تحكم المعلم جاهزة لاستقبال النتائج في السجل المدرسي.');
            }
        } catch (e) {
            console.error('إيداع نتائج المسابقة:', e);
            alert('تعذر إيداع النتائج تلقائياً.');
        }
    }

    function renderHostStage(stage) {
        const stages = ['setup', 'lobby', 'question', 'revealed', 'leaderboard', 'podium'];
        stages.forEach(s => {
            const el = document.getElementById(`quizHostStage_${s}`);
            if (el) el.style.display = (s === stage) ? 'block' : 'none';
        });
    }

    // ==========================================================================
    // 2. منطق شاشة التابلت للتلميذ (Student Tablet Buzzer Engine)
    // ==========================================================================
    function renderTabletJoinScreen() {
        const pinInput = document.getElementById('tabletPinInput');
        const nameInput = document.getElementById('tabletStudentNameInput');
        const teamSelect = document.getElementById('tabletTeamSelect');

        if (pinInput) pinInput.value = state.pin;
        if (nameInput) nameInput.value = state.tabletStudentName;
        if (teamSelect) teamSelect.value = state.tabletTeam;

        renderTabletStage('join');
    }

    async function tabletJoinQuiz() {
        const pinInput = document.getElementById('tabletPinInput');
        const nameInput = document.getElementById('tabletStudentNameInput');
        const teamSelect = document.getElementById('tabletTeamSelect');

        const enteredPin = (pinInput?.value || '').trim();
        const studentName = (nameInput?.value || '').trim() || 'تلميذ بطل';
        const team = teamSelect?.value || 'falcons';

        state.tabletStudentName = studentName;
        state.tabletTeam = team;
        localStorage.setItem(STORAGE_KEY_PLAYER_NAME, studentName);
        localStorage.setItem(STORAGE_KEY_TEAM, team);

        sfxBuzzerPress();

        try {
            const res = await fetch(`${state.hostUrl}/api/quiz/join`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId: state.tabletStudentId,
                    name: studentName,
                    team: team,
                    avatar: state.tabletAvatar,
                    pin: enteredPin
                })
            });
            const data = await res.json();
            if (data && data.success) {
                renderTabletStage('waiting');
                startTabletSyncPolling();
            } else {
                alert(data.message || 'تعذر الانضمام، تحقق من رمز PIN الخاص بالمسابقة.');
            }
        } catch (e) {
            // محاكاة الانضمام في حال عدم توفر الخادم
            renderTabletStage('waiting');
            startTabletSyncPolling();
        }
    }

    function startTabletSyncPolling() {
        stopSyncPolling();
        state.syncPollInterval = setInterval(async () => {
            try {
                const res = await fetch(`${state.hostUrl}/api/quiz/state`);
                const data = await res.json();
                if (data && data.success) {
                    handleTabletStateUpdate(data);
                }
            } catch (e) {
                // صامت
            }
        }, 650);
    }

    function handleTabletStateUpdate(serverQuizState) {
        const status = serverQuizState.status;

        if (status === 'lobby') {
            renderTabletStage('waiting');
            const wTitle = document.getElementById('tabletWaitingQuizTitle');
            if (wTitle) wTitle.textContent = serverQuizState.title || 'مسابقة قراءتي التنافسية';
        } else if (status === 'question') {
            // سؤال جديد انطلق
            if (state.tabletLastQIndex !== serverQuizState.q_index) {
                state.tabletLastQIndex = serverQuizState.q_index;
                state.tabletAnswerSent = false;
                state.tabletSelectedOption = -1;
                renderTabletBuzzerStage(serverQuizState);
            }
        } else if (status === 'revealed') {
            if (state.tabletSelectedOption !== -1 && !state.tabletResultShown) {
                renderTabletResultStage(serverQuizState);
            }
        } else if (status === 'leaderboard') {
            renderTabletLeaderboardStage();
        } else if (status === 'podium') {
            renderTabletPodiumStage();
        } else if (status === 'idle') {
            renderTabletStage('join');
        }
    }

    function renderTabletBuzzerStage(quizState) {
        renderTabletStage('buzzer');
        state.tabletResultShown = false;
        const curQ = quizState.current_question || {};
        const qTitle = document.getElementById('tabletBuzzerQTitle');
        const qTimer = document.getElementById('tabletBuzzerTimer');

        if (qTitle) qTitle.textContent = curQ.text || 'أجب بأسرع ما يمكن يا بطل!';
        if (qTimer) qTimer.textContent = `${quizState.time_remaining || 0} ث`;

        // تفعيل أزرار البزر الأربعة
        for (let i = 0; i < 4; i++) {
            const btn = document.getElementById(`tabletBtnOption_${i}`);
            if (btn) {
                btn.disabled = false;
                btn.classList.remove('selected', 'dimmed');
            }
        }
    }

    async function tabletSelectOption(optionIndex) {
        if (state.tabletAnswerSent) return;
        state.tabletAnswerSent = true;
        state.tabletSelectedOption = optionIndex;

        sfxBuzzerPress();
        if (navigator.vibrate) navigator.vibrate(50);

        // إبراز الخيار المختار وتعتيم البقية
        for (let i = 0; i < 4; i++) {
            const btn = document.getElementById(`tabletBtnOption_${i}`);
            if (btn) {
                btn.disabled = true;
                if (i === optionIndex) btn.classList.add('selected');
                else btn.classList.add('dimmed');
            }
        }

        renderTabletStage('answered');

        // إرسال الإجابة للخادم
        try {
            const res = await fetch(`${state.hostUrl}/api/quiz/answer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId: state.tabletStudentId,
                    name: state.tabletStudentName,
                    team: state.tabletTeam,
                    q_index: state.tabletLastQIndex,
                    option: optionIndex,
                    timeSpentMs: 3000 // تقدير زمن الحل
                })
            });
            const data = await res.json();
            if (data && data.success) {
                state.tabletLastResult = data;
                if (data.is_correct) {
                    state.tabletScore = data.total_score;
                    state.tabletStreak = data.streak;
                } else {
                    state.tabletStreak = 0;
                }
            }
        } catch (e) {
            console.warn('إرسال إجابة التابلت للخادم:', e);
        }
    }

    function renderTabletResultStage(quizState) {
        state.tabletResultShown = true;
        renderTabletStage('result');

        const curQ = quizState.current_question || {};
        const isCorrect = (state.tabletSelectedOption === curQ.correct);

        const card = document.getElementById('tabletResultCard');
        const icon = document.getElementById('tabletResultIcon');
        const title = document.getElementById('tabletResultTitle');
        const desc = document.getElementById('tabletResultDesc');
        const score = document.getElementById('tabletResultScore');

        if (isCorrect) {
            sfxCorrect();
            if (card) card.className = 'tablet-result-box correct';
            if (icon) icon.textContent = '🎉';
            if (title) title.textContent = 'إجابة صحيحة ومتقنة يا بطل!';
            if (desc) desc.textContent = 'أحسنت! سرعة وذكاء رائع في اختيار الإجابة الصحيحة.';
            if (score) score.textContent = `+${state.tabletLastResult?.points || 1200} نقطة ⭐`;
        } else {
            sfxIncorrect();
            if (card) card.className = 'tablet-result-box incorrect';
            if (icon) icon.textContent = '👏';
            if (title) title.textContent = 'محاولة طيبة يا شاطر!';
            const correctOptText = curQ.options ? curQ.options[curQ.correct] : '';
            if (desc) desc.textContent = `الإجابة الصحيحة كانت: (${correctOptText}). ركّز في السؤال القادم!`;
            if (score) score.textContent = '+0 نقطة';
        }
    }

    function renderTabletLeaderboardStage() {
        renderTabletStage('leaderboard');
        const scoreEl = document.getElementById('tabletPlayerScoreSummary');
        const streakEl = document.getElementById('tabletPlayerStreakSummary');
        if (scoreEl) scoreEl.textContent = `${state.tabletScore.toLocaleString()} ⭐`;
        if (streakEl) streakEl.textContent = `${state.tabletStreak} إجابات متتالية 🔥`;
    }

    function renderTabletPodiumStage() {
        renderTabletStage('podium');
    }

    function renderTabletStage(stage) {
        const stages = ['join', 'waiting', 'buzzer', 'answered', 'result', 'leaderboard', 'podium'];
        stages.forEach(s => {
            const el = document.getElementById(`quizTabletStage_${s}`);
            if (el) el.style.display = (s === stage) ? 'block' : 'none';
        });
    }

    // ==========================================================================
    // 3. نمط السبورة الذكية المباشر (Smartboard Hot Seat / Touch Arena)
    // ==========================================================================
    function renderHotseatSetup() {
        const quiz = QUIZ_CATALOG[state.activeQuizId] || QUIZ_CATALOG.quiz_unit1;
        state.hostQuiz = quiz;
        state.hostQIndex = 0;
        state.hostTeams = JSON.parse(JSON.stringify(TEAMS_DEF));

        const titleEl = document.getElementById('hotseatQuizTitle');
        if (titleEl) titleEl.textContent = quiz.title;

        renderHotseatQuestion();
    }

    function renderHotseatQuestion() {
        const q = state.hostQuiz.questions[state.hostQIndex];
        if (!q) {
            renderHotseatPodium();
            return;
        }

        const qNum = document.getElementById('hotseatQNumber');
        const qText = document.getElementById('hotseatQText');
        const qImg = document.getElementById('hotseatQImage');
        const optionsHolder = document.getElementById('hotseatOptionsHolder');

        if (qNum) qNum.textContent = `السؤال ${state.hostQIndex + 1} من ${state.hostQuiz.questions.length}`;
        if (qText) qText.textContent = q.text;
        if (qImg) {
            if (q.image) {
                qImg.src = q.image;
                qImg.style.display = 'block';
            } else {
                qImg.style.display = 'none';
            }
        }

        if (optionsHolder) {
            optionsHolder.innerHTML = '';
            q.options.forEach((optText, oIdx) => {
                const optDef = OPTIONS_DEF[oIdx] || OPTIONS_DEF[0];
                const btn = document.createElement('button');
                btn.className = 'hotseat-option-btn';
                btn.style.borderColor = optDef.color;
                btn.innerHTML = `
                    <span class="hotseat-opt-shape" style="background:${optDef.color};">${optDef.shape}</span>
                    <span class="hotseat-opt-text">${escapeHtml(optText)}</span>
                `;
                btn.onclick = () => onHotseatOptionClick(oIdx, btn);
                optionsHolder.appendChild(btn);
            });
        }

        updateHotseatTeamsBar();
    }

    function onHotseatOptionClick(optionIdx, btnEl) {
        const q = state.hostQuiz.questions[state.hostQIndex];
        const isCorrect = (optionIdx === q.correct);

        // تعطيل كل الأزرار
        const allBtns = document.querySelectorAll('.hotseat-option-btn');
        allBtns.forEach(b => b.disabled = true);

        if (isCorrect) {
            sfxCorrect();
            btnEl.classList.add('correct');
            // احتساب نقاط للفريق المختار
            state.hostTeams[state.hotseatCurrentTeam].total_score += 1000;
        } else {
            sfxIncorrect();
            btnEl.classList.add('incorrect');
            // إظهار الصحيح
            if (allBtns[q.correct]) allBtns[q.correct].classList.add('correct');
        }

        updateHotseatTeamsBar();

        setTimeout(() => {
            state.hostQIndex++;
            renderHotseatQuestion();
        }, 2200);
    }

    function updateHotseatTeamsBar() {
        const bar = document.getElementById('hotseatTeamsBar');
        if (!bar) return;
        bar.innerHTML = '';
        Object.keys(state.hostTeams).forEach(tid => {
            const t = state.hostTeams[tid];
            const isCur = (tid === state.hotseatCurrentTeam);
            const chip = document.createElement('div');
            chip.className = `hotseat-team-chip ${isCur ? 'active' : ''}`;
            chip.style.borderColor = t.color;
            chip.innerHTML = `
                <span>${t.icon} ${t.name}:</span>
                <b>${t.total_score} ⭐</b>
            `;
            chip.onclick = () => {
                state.hotseatCurrentTeam = tid;
                updateHotseatTeamsBar();
            };
            bar.appendChild(chip);
        });
    }

    function renderHotseatPodium() {
        sfxPodium();
        const pane = document.getElementById('quizPane_hotseat');
        if (!pane) return;

        const sortedTeams = Object.values(state.hostTeams).sort((a, b) => b.total_score - a.total_score);
        const winner = sortedTeams[0];

        pane.innerHTML = `
            <div class="hotseat-podium-box">
                <div style="font-size: 4rem;">🏆</div>
                <h2 style="font-size: 2rem; color: #1e3a8a; margin: 12px 0;">مبروك الفوز يا أبطال قراءتي!</h2>
                <div style="font-size: 1.6rem; font-weight: 900; color: ${winner.color}; margin-bottom: 20px;">
                    الفريق الفائز بالمركز الأول: ${winner.icon} ${winner.name} (${winner.total_score} نقطة ⭐)
                </div>
                <div style="display: flex; gap: 12px; justify-content: center; margin-top: 25px;">
                    <button class="btn btn-teach" style="padding: 10px 24px; font-size: 1.05rem;" onclick="ClassroomQuiz.openQuizModal('hotseat')">
                        🔄 جولة جديدة
                    </button>
                    <button class="btn btn-eval" style="padding: 10px 24px; font-size: 1.05rem;" onclick="ClassroomQuiz.closeQuizModal()">
                        إغلاق
                    </button>
                </div>
            </div>
        `;
    }

    // ==========================================================================
    // دوال مساعدة
    // ==========================================================================
    function stopSyncPolling() {
        if (state.syncPollInterval) {
            clearInterval(state.syncPollInterval);
            state.syncPollInterval = null;
        }
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    // التهيئة التلقائية
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // تصدير الكائن العام للمحرك
    window.ClassroomQuiz = {
        init,
        openQuizModal,
        closeQuizModal,
        switchViewMode,
        onQuizCatalogSelectChange,
        onGameModeChange,
        generateNewPin,
        hostStartLobby,
        hostNextQuestion,
        hostRevealAnswer,
        hostShowLeaderboard,
        hostShowPodium,
        ingestQuizResultsToTeacherRecords,
        tabletJoinQuiz,
        tabletSelectOption,
        state,
        QUIZ_CATALOG,
        TEAMS_DEF
    };

    window.openClassroomQuizModal = openQuizModal;
    window.closeClassroomQuizModal = closeQuizModal;

})();
