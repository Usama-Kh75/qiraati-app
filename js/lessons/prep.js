/* ==========================================================================
 * منصة قراءتي التفاعلية الذكية - دروس وحدة التهيئة والاستعداد (Preparation Unit Lessons)
 * إعداد وتطوير: المهندس أسامة خليل هاشم
 * ========================================================================== */

        /* ========================================================

           4. Lesson 1 Logic (نشيد البطة واستكشاف الصورة ص 7)

        ======================================================== */

        function playNasheed() {
            const card = document.getElementById('card-nasheed-section');
            if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            const btn = document.getElementById('btnLesson1Nasheed');

            if (currentAudio && !currentAudio.paused && window._currentPlayingKey === 'nasheed_batta') {

                stopAudio();

                if (btn) btn.innerHTML = '🎵 نشاط ٢: استمع لنشيد البطة وردد';

                return;

            }

            mascotCelebrates();

            if (btn) btn.innerHTML = '⏹️ إيقاف النشيد';

            mascotSpeak('🎵 استمع إلى النشيد وردد: <br><b>«يَا بَـطُّ يَا بَـطْ ... اِسْبَـحْ بِالشَّــطْ!»</b>', 'nasheed_batta', () => {

                if (btn) btn.innerHTML = '🎵 نشاط ٢: استمع لنشيد البطة وردد';

            });

        }

        function explorePicturePrompt() {
            const card = document.getElementById('card-items3-section');
            if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            resetObjectItems();

            mascotSpeak('🔍 انقر على أي أداة من الأدوات التسعة في الصورة لنتعرف على اسمها وفائدتها!', 'act5_diff_intro');

        }

        function resetObjectItems() {

            document.querySelectorAll('#card-items3-section .diff-circle-path').forEach(c => c.classList.remove('draw'));

        }

        function clickObjectItem(itemKey) {

            resetObjectItems();

            const circle = document.getElementById('circle-item-' + itemKey);

            if (circle) circle.classList.add('draw');

            mascotCelebrates();

            const itemsMap = {

                mistara: { text: '📏 <b>مِسْطَرَة!</b> نستخدمها لرسم الخطوط المستقيمة في الدفتر!', audio: 'item_mistara' },

                qalam:   { text: '✏️ <b>قَلَمُ رَصَاص!</b> نكتب به كلماتنا الجميلة ونرسم!', audio: 'item_qalam' },

                melaqa:  { text: '🥄 <b>مِلْعَقَة!</b> نأكل بها طعامنا الصحي اللذيذ!', audio: 'item_melaqa' },

                miqas:   { text: '✂️ <b>مِقَصّ!</b> نقص به الأوراق والأشكال بحذر مع المعلمة!', audio: 'item_miqas' },

                kitab:   { text: '📖 <b>كِتَاب!</b> كتاب قراءتي الذي نتعلم منه الحروف والقراءة!', audio: 'item_kitab' },

                haqiba:  { text: '🎒 <b>حَقِيبَةُ مَدْرَسِيَّة!</b> نضع فيها كتبنا ودفاترنا المرتبة!', audio: 'item_haqiba' },

                qitar:   { text: '🚂 <b>قِطَار!</b> قطار الألعاب الجميل له عربات تسير على السكة!', audio: 'item_qitar' },

                safira:  { text: '📢 <b>صَافِرَة!</b> صافرة حمراء تصدر صوتاً عالياً ومرحاً!', audio: 'item_safira' },

                saa:     { text: '⏰ <b>سَاعَةُ حَائِط!</b> تعلمنا الوقت لنستيقظ باكراً بنشاط!', audio: 'item_saa' }

            };

            const item = itemsMap[itemKey];

            if (item) {

                mascotSpeak(item.text, item.audio);

            }

        }

        /* ========================================================

           4b. Lesson 2 Logic (نشاط ٤: أتحدث عن الصور ص 8)

        ======================================================== */

        function narrateAct4FullStory() {

            mascotCelebrates();

            mascotSpeak('📖 <b>قصة صباحي الجميل:</b><br>«أَسْتَيْقِظُ مُبَكِّراً بِنَشَاط، آكُلُ فُطُورِي الصِّحِّي، ثُمَّ أَنْطَلِقُ إِلَى المَدْرَسَةِ بِسُرُور!»', 'act4_full_story');

        }

        function promptAct4Scenes() {

            mascotSpeak('🔍 اضغط على مشهد الاستيقاظ، أو مائدة الفطور، أو الذهاب للمدرسة لتسمع وتتحدث عنها!', 'act4_intro');

        }

        function clickAct4Pic(picId) {

            mascotCelebrates();

            if (picId === 'wake') {

                mascotSpeak('🛏️ <b>المشهد الأول:</b><br>«أَسْتَيْقِظُ مِنَ النَّوْمِ فِي الصَّبَاحِ البَاكِرِ بِنَشَاطٍ، وَأُرَتِّبُ سَرِيرِي!»', 'act4_pic1_wake');

            } else if (picId === 'breakfast') {

                mascotSpeak('🍳 <b>المشهد الثاني:</b><br>«أَتَنَاوَلُ وَجْبَةَ الفُطُورِ الصِّحِّيَّةَ لَذِيذَةً، وَأَشْرَبُ الحَلِيبَ مَعَ إِخْوَتِي لِأَكُونَ قَوِيّاً!»', 'act4_pic2_breakfast');

            } else if (picId === 'school') {

                mascotSpeak('🏫 <b>المشهد الثالث:</b><br>«أَرْتَدِي زِيِّي المَدْرَسِيَّ المُرَتَّب، وَأَسِيرُ بِنَشَاطٍ مَعَ زُمَلائِي نَحْوَ المَدْرَسَةِ لِنَتَعَلَّمَ وَنَمْرَحَ!»', 'act4_pic3_school');

            }

        }

        /* ========================================================

           4c. Lesson 3 Logic (نشاط ٥: أميز المتشابه والمختلف ص 8)

        ======================================================== */

        function clickDiffItem(itemId) {

            if (itemId === 'pencils_match') {

                document.getElementById('circle-diff-pencils').classList.add('draw');

                mascotCelebrates();

                mascotSpeak('🌟 <b style="color: #16a34a;">أحسنت يا بطل!</b> هذان قلمان متشابهان تماماً مع القلمين في الأعلى!', 'act5_diff_pencils_correct');

            } else if (itemId === 'pencils_wrong') {

                const card = document.getElementById('card-act5diff');

                card.classList.add('shake');

                setTimeout(() => card.classList.remove('shake'), 500);

                mascotSpeak('⚠️ ابحث عن <b>قلمين اثنين</b> يشبهان القلمين في المربع الأخضر بالأعلى!', 'act5_diff_pencils_prompt');

            } else if (itemId === 'hens_match') {

                document.getElementById('circle-diff-hens').classList.add('draw');

                mascotCelebrates();

                mascotSpeak('🌟 <b style="color: #16a34a;">رائع جداً!</b> هذه دجاجة تشبه الدجاجة في المربع الأخضر!', 'act5_diff_hens_correct');

            } else if (itemId === 'ostrich') {

                const card = document.getElementById('card-act5diff');

                card.classList.add('shake');

                setTimeout(() => card.classList.remove('shake'), 500);

                mascotSpeak('⚠️ هذه <b>نعامة طويلة</b>، وهي مختلفة عن الدجاجة!', 'act5_diff_ostrich_click');

            } else if (itemId === 'tennis') {

                document.getElementById('circle-diff-tennis').classList.add('draw');

                mascotCelebrates();

                mascotSpeak('🌟 <b style="color: #16a34a;">ممتاز يا ذكي!</b> كرة التنس الخضراء هي المختلفة عن كرتي القدم!', 'act5_diff_balls_correct');

            } else if (itemId === 'football_wrong') {

                const card = document.getElementById('card-act5diff');

                card.classList.add('shake');

                setTimeout(() => card.classList.remove('shake'), 500);

                mascotSpeak('⚠️ المطلوب هو وضع دائرة حول <b>المختلف</b> وليس المتشابه!', 'act5_diff_balls_prompt');

            } else if (itemId === 'yellowbook') {

                document.getElementById('circle-diff-yellowbook').classList.add('draw');

                mascotCelebrates();

                mascotSpeak('🌟 <b style="color: #16a34a;">بارك الله فيك!</b> الكتاب الأصفر هو المختلف عن الكتابين الأزرقين!', 'act5_diff_books_correct');

            } else if (itemId === 'bluebook_wrong') {

                const card = document.getElementById('card-act5diff');

                card.classList.add('shake');

                setTimeout(() => card.classList.remove('shake'), 500);

                mascotSpeak('⚠️ هذان كتابان أزرقان متشابهان.. ابحث عن الكتاب <b>المختلف</b>!', 'act5_diff_books_prompt');

            }

        }

        function teachAct5Diff() {

            resetAct5Diff();

            mascotSpeak('💡 سنتعلم اليوم المتشابه والمختلف: نضع دائرة خضراء حول المتشابه، ودائرة حمراء حول المختلف!', 'act5_diff_intro', () => {

                setTimeout(() => {

                    document.getElementById('circle-diff-pencils').classList.add('draw');

                    mascotSpeak('✏️ في الصندوق الأيمن: هذان قلمان يشبهان القلمين في الأعلى!', 'act5_diff_pencils_correct', () => {

                        setTimeout(() => {

                            document.getElementById('circle-diff-tennis').classList.add('draw');

                            mascotSpeak('🎾 في صف الكرات: كرة التنس هي المختلفة عن كرتي القدم!', 'act5_diff_balls_correct', () => {

                                setTimeout(() => {

                                    document.getElementById('circle-diff-yellowbook').classList.add('draw');

                                    mascotSpeak('📚 وفي صف الكتب: الكتاب الأصفر هو المختلف عن الأزرقين!', 'act5_diff_books_correct');

                                }, 1500);

                            });

                        }, 1500);

                    });

                }, 1000);

            });

        }

        function quizAct5Diff() {

            resetAct5Diff();

            mascotSpeak('🎯 <b>سؤال الاختبار:</b> انقر على الأشكال المطلوبة لتضع الدائرة حول الإجابة الصحيحة!', 'act5_diff_intro');

        }

        function resetAct5Diff() {

            document.querySelectorAll('#card-act5diff .diff-circle-path').forEach(c => c.classList.remove('draw'));

        }

        /* ========================================================

           5. Activity 5 Logic (الصوت الفونيمي وسلامة الراء)

        ======================================================== */

        let currentlySelectedLetter = 'ا';

        function selectPhonics(letter) {

            currentlySelectedLetter = letter;

            document.querySelectorAll('.letter-pick-card').forEach(c => c.classList.remove('selected'));

            if (letter === 'ا') {

                document.getElementById('pick-alif').classList.add('selected');

                mascotSpeak('اخترت صوت المد: <b>( آااا )</b> مثل صوت A في Cat. الآن اضغط على الفراغ المناسب!', 'phonics_a');

            } else {

                document.getElementById('pick-maqsura').classList.add('selected');

                mascotSpeak('اخترت صوت الألف المقصورة اللينة: <b>( ى )</b>. الآن اضغط على الفراغ المناسب!', 'phonics_maqsura');

            }

        }

        let filledCount = 0;

        const totalSlots = 5;

        function fillSlot(slotId, correctLetter, audioKey, wordDesc) {

            const spot = document.getElementById('spot-' + slotId);

            const mask = document.getElementById('mask-' + slotId);

            const text = document.getElementById('text-' + slotId);

            if (spot.classList.contains('filled')) return;

            if (currentlySelectedLetter === correctLetter) {

                spot.classList.add('filled');

                mask.style.display = 'inline';

                text.classList.add('show');

                filledCount++;

                mascotCelebrates();

                mascotSpeak(`🎉 <b style="color: #16a34a;">ممتاز يا بطل!</b> الصوت صحيح: <b>${wordDesc}</b>`, audioKey, () => {

                    if (filledCount === totalSlots) {

                        setTimeout(() => {

                            mascotCelebrates();

                            mascotSpeak('🏆 <b style="color: #7c3aed;">رائع جداً ومبهر!</b> ركّبت جميع الأصوات في الكلمات بنجاح!', 'act5_complete');

                        }, 500);

                    }

                });

            } else {

                const card = document.getElementById('card-act5');

                card.classList.add('shake');

                setTimeout(() => card.classList.remove('shake'), 500);

                mascotSpeak(`⚠️ <b style="color: #dc2626;">استمع جيداً!</b> هل تحتاج الكلمة لصوت المد (آاا) أم صوت (ى)؟ فكّر مرة أخرى!`, 'act5_wrong');

            }

        }

        function resetAct5() {

            filledCount = 0;

            document.querySelectorAll('.slot-hotspot').forEach(s => s.classList.remove('filled'));

            document.querySelectorAll('.dot-mask').forEach(m => m.style.display = 'none');

            document.querySelectorAll('.placed-letter').forEach(t => t.classList.remove('show'));

            mascotSpeak('أعدنا ضبط الفراغات. اختر صوت ( آاا ) أو ( ى ) ثم انقر على الكلمة!', 'act5_prompt');

        }

        function startAct5Quiz() {

            resetAct5();

            mascotSpeak('🎯 <b>سؤال الاختبار:</b> ضع الصوت المناسب ( آاا ) أو ( ى ) في الفراغات لتكمل الكلمات الخمس!', 'act5_prompt');

        }

        function autoSolveAct5() {

            resetAct5();

            mascotSpeak('💡 مرحباً يا أبطال، سنتعلم معاً صوت الحرف المناسب لكل كلمة...', 'act5_prompt', () => {

                setTimeout(() => {

                    selectPhonics('ا');

                    document.getElementById('spot-nar').classList.add('filled');

                    document.getElementById('mask-nar').style.display = 'inline';

                    document.getElementById('text-nar').classList.add('show');

                    mascotSpeak('🔥 كلمة <b>(نَارُ)</b>: نَـ... آاا... رُ $\\rightarrow$ نَارُ!', 'act5_nar', () => {

                        setTimeout(() => {

                            selectPhonics('ى');

                            document.getElementById('spot-mrma').classList.add('filled');

                            document.getElementById('mask-mrma').style.display = 'inline';

                            document.getElementById('text-mrma').classList.add('show');

                            mascotSpeak('⚽ كلمة <b>(مَرْمَى)</b>: مَرْ... مَى $\\rightarrow$ مَرْمَى!', 'act5_mrma', () => {

                                setTimeout(() => {

                                    selectPhonics('ا');

                                    document.getElementById('spot-dar').classList.add('filled');

                                    document.getElementById('mask-dar').style.display = 'inline';

                                    document.getElementById('text-dar').classList.add('show');

                                    mascotSpeak('🏡 كلمة <b>(دَارُ)</b>: دَ... آاا... رُ $\\rightarrow$ دَارُ!', 'act5_dar', () => {

                                        setTimeout(() => {

                                            selectPhonics('ى');

                                            document.getElementById('spot-halwa').classList.add('filled');

                                            document.getElementById('mask-halwa').style.display = 'inline';

                                            document.getElementById('text-halwa').classList.add('show');

                                            mascotSpeak('🍬 كلمة <b>(حَلْوَى)</b>: حَلْـ... وَى $\\rightarrow$ حَلْوَى!', 'act5_halwa', () => {

                                                setTimeout(() => {

                                                    selectPhonics('ا');

                                                    document.getElementById('spot-asa').classList.add('filled');

                                                    document.getElementById('mask-asa').style.display = 'inline';

                                                    document.getElementById('text-asa').classList.add('show');

                                                    mascotSpeak('🦯 كلمة <b>(عَصَا)</b>: عَصَـ... آاا $\\rightarrow$ عَصَا!', 'act5_asa', () => {

                                                        setTimeout(() => {

                                                            mascotCelebrates();

                                                            mascotSpeak('✨ <b>أحسنتم يا أبطال!</b> تعلمنا التمييز بين صوت المد (آاا) وصوت الألف المقصورة (ى)!', 'act5_complete');

                                                        }, 600);

                                                    });

                                                }, 1200);

                                            });

                                        }, 1200);

                                    });

                                }, 1200);

                            });

                        }, 1200);

                    });

                }, 1000);

            });

        }

        /* ========================================================

           6. Activity 6 Logic (الأطول والأقصر)

        ======================================================== */

        function resetActivity6() {

            document.querySelectorAll('.circle-path').forEach(c => c.classList.remove('draw'));

            mascotSpeak('أعدنا ضبط الصورة لوضعها الطبيعي!', 'reset');

        }

        function handleItemClick(itemId) {

            if (itemId === 'tall-giraffe') {

                document.getElementById('circle-tall-giraffe').classList.add('draw');

                mascotCelebrates();

                mascotSpeak('🎉 <b style="color: #16a34a;">ممتاز يا بطل!</b> هذه هي الزرافة الأطول، ووضعنا حولها دائرة!', 'tall_giraffe_correct');

            } else if (itemId === 'short-giraffe') {

                const card = document.getElementById('activityCard6');

                card.classList.add('shake');

                setTimeout(() => card.classList.remove('shake'), 500);

                mascotSpeak('⚠️ <b style="color: #dc2626;">هذه الزرافة قصيرة!</b> المطلوب هو وضع دائرة حول <b>الأطول</b>.', 'short_giraffe_wrong');

            } else if (itemId === 'tall-pencil') {

                document.getElementById('circle-tall-pencil').classList.add('draw');

                mascotCelebrates();

                mascotSpeak('🌟 <b style="color: #16a34a;">رائع جداً!</b> هذا هو القلم الأطول!', 'tall_pencil_correct');

            } else if (itemId === 'short-pencil') {

                const card = document.getElementById('activityCard6');

                card.classList.add('shake');

                setTimeout(() => card.classList.remove('shake'), 500);

                mascotSpeak('⚠️ <b style="color: #dc2626;">هذا هو القلم الأقصر!</b> اختر القلم الأطول!', 'short_pencil_wrong');

            }

        }

        function startQuizMode() {

            resetActivity6();

            mascotSpeak('🎯 <b>سؤال الاختبار:</b> انقر على الزرافة الأطول والقلم الأطول لتضع الدائرة!', 'quiz_prompt');

        }

        function startTeachMode() {

            resetActivity6();

            mascotSpeak('💡 مرحباً يا أبطال، سنتعلم اليوم كيف نميز الأقصر والأطول...', 'teach_intro', () => {

                mascotSpeak('🦒 انظروا إلى الزرافتين.. الزرافة التي على اليمين هي <b>الأطول</b>، سنضع حولها دائرة الآن!', 'teach_giraffe', () => {

                    document.getElementById('circle-tall-giraffe').classList.add('draw');

                    setTimeout(() => {

                        mascotSpeak('✏️ والآن انظروا إلى القلمين.. القلم الذي على اليسار هو <b>الأطول</b>، سنضع حوله دائرة أيضاً!', 'teach_pencil', () => {

                            document.getElementById('circle-tall-pencil').classList.add('draw');

                        });

                    }, 1000);

                });

            });

        }

        /* ========================================================

           7. Activity 7 Logic (أحدد الأماكن: فوق وتحت، أمام وخلف)

        ======================================================== */

        function clickPlaceItem(itemId) {

            if (itemId === 'book') {

                document.getElementById('circle-place-book').classList.add('draw');

                mascotCelebrates();

                mascotSpeak('📘 <b style="color: #2563eb;">الكتابُ فَوْقَ الطَّاوِلَة!</b>', 'act7_book_above');

            } else if (itemId === 'cat') {

                document.getElementById('circle-place-cat').classList.add('draw');

                mascotCelebrates();

                mascotSpeak('🐱 <b style="color: #16a34a;">القِطَّةُ تَحْتَ الطَّاوِلَة!</b>', 'act7_cat_under');

            } else if (itemId === 'girl') {

                document.getElementById('circle-place-girl').classList.add('draw');

                mascotCelebrates();

                mascotSpeak('👧 <b style="color: #e11d48;">البِنْتُ أَمَامَ الكُرْسِيّ!</b>', 'act7_girl_infront');

            } else if (itemId === 'boy') {

                document.getElementById('circle-place-boy').classList.add('draw');

                mascotCelebrates();

                mascotSpeak('👦 <b style="color: #f59e0b;">الوَلَدُ خَلْفَ الكُرْسِيّ!</b>', 'act7_boy_behind');

            }

        }

        function teachAct7() {

            resetAct7();

            mascotSpeak('💡 هيا نتعرف على الأماكن: فَوْقَ، تَحْتَ، أَمَامَ، خَلْفَ!', 'act7_intro', () => {

                setTimeout(() => {

                    clickPlaceItem('book');

                    setTimeout(() => {

                        clickPlaceItem('cat');

                        setTimeout(() => {

                            clickPlaceItem('girl');

                            setTimeout(() => {

                                clickPlaceItem('boy');

                            }, 2000);

                        }, 2000);

                    }, 2000);

                }, 1000);

            });

        }

        function quizAct7() {

            resetAct7();

            mascotSpeak('🎯 انقر على الكتاب لمعرفة موضعه، أو القطة، أو البنت، أو الولد!', 'act7_intro');

        }

        function resetAct7() {

            document.querySelectorAll('#card-act7 .diff-circle-path').forEach(c => c.classList.remove('draw'));

        }

        /* ========================================================

           7b. Activity 8 Logic (أتعرف إلى الاتجاهات: يمين ويسار)

        ======================================================== */

        function clickDirection(dirId) {

            if (dirId === 'car_left') {

                document.getElementById('circle-dir-carleft').classList.add('draw');

                mascotCelebrates();

                mascotSpeak('🚙 <b style="color: #2563eb;">السَّيَّارَةُ الزَّرْقَاءُ تَتَّجِهُ نَحْوَ اليَسَار!</b>', 'act8_car_left');

            } else if (dirId === 'car_right') {

                document.getElementById('circle-dir-carright').classList.add('draw');

                mascotCelebrates();

                mascotSpeak('🚗 <b style="color: #dc2626;">السَّيَّارَةُ الحَمْرَاءُ تَتَّجِهُ نَحْوَ اليَمِين!</b>', 'act8_car_right');

            } else if (dirId === 'police') {

                document.getElementById('circle-dir-police').classList.add('draw');

                mascotCelebrates();

                mascotSpeak('👮 <b style="color: #16a34a;">شُرْطِيُّ المُرُورِ يُنَظِّمُ حَرَكَةَ السَّيَّارَاتِ بِأَمَان!</b>', 'act8_police');

            } else if (dirId === 'traffic_light') {

                document.getElementById('circle-dir-light').classList.add('draw');

                mascotCelebrates();

                mascotSpeak('🚦 <b style="color: #f59e0b;">إِشَارَةُ المُرُورِ:</b> الأحمر قِفْ، الأصفر اسْتَعِدّ، الأخضر انْطَلِقْ!', 'act8_traffic_light');

            }

        }

        function teachAct8() {

            resetAct8();

            mascotSpeak('💡 أهلاً بكم! هيا نتعرف إلى الاتجاهات: يمين ويسار وإشارات المرور!', 'act8_intro', () => {

                setTimeout(() => {

                    clickDirection('car_left');

                    setTimeout(() => {

                        clickDirection('car_right');

                        setTimeout(() => {

                            clickDirection('police');

                            setTimeout(() => {

                                clickDirection('traffic_light');

                            }, 2000);

                        }, 2000);

                    }, 2000);

                }, 1000);

            });

        }

        function quizAct8() {

            resetAct8();

            mascotSpeak('🎯 اضغط على السيارة أو شرطي المرور أو الإشارة لتتعرف على اتجاهها!', 'act8_intro');

        }

        function resetAct8() {

            document.querySelectorAll('#card-act8 .diff-circle-path').forEach(c => c.classList.remove('draw'));

        }

        /* ========================================================

           8. Letter Blending Logic (دَادَا)

        ======================================================== */

        function pronounceLetter(boxId, soundKey, messageText) {

            const box = document.getElementById(boxId);

            if (box) {

                box.classList.remove('active');

                void box.offsetWidth;

                box.classList.add('active');

            }

            mascotSpeak(messageText, soundKey);

        }

        function animateBlending() {

            const b1 = document.getElementById('box1');

            const b2 = document.getElementById('box2');

            const b3 = document.getElementById('box3');

            const b4 = document.getElementById('box4');

            const merged = document.getElementById('mergedWord');

            const meaning = document.getElementById('wordMeaning');

            mascotSpeak('شاهد الحروف وهي تقترب لتصافح بعضها وتكوّن الكلمة! 🤝', 'blend_intro', () => {

                b1.style.transform = 'translateX(-30px) scale(0.95)';

                b2.style.transform = 'translateX(-10px) scale(0.95)';

                b3.style.transform = 'translateX(10px) scale(0.95)';

                b4.style.transform = 'translateX(30px) scale(0.95)';

                mascotSpeak('صوت المقطع: <b>دَا</b>', 'syllable_da', () => {

                    setTimeout(() => {

                        b1.style.opacity = '0';

                        b2.style.opacity = '0';

                        b3.style.opacity = '0';

                        b4.style.opacity = '0';

                        merged.classList.add('show');

                        meaning.innerHTML = '✨ <b>أحسنت!</b> تكونت كلمة (<b>دَادَا</b>) وهي تعني الطفل الصغير الذي يتعلم الحبو والمشي!';

                        mascotCelebrates();

                        mascotSpeak('👶 <b>دَادَا... دَا دَا، دَادَا!</b>', 'word_dada', () => {

                            setTimeout(() => {

                                mascotSpeak('أحسنت! كلمة دَادَا تعني الطفل الصغير!', 'blend_success');

                            }, 500);

                        });

                    }, 800);

                });

            });

            setTimeout(() => {

                b1.style.transform = 'none';

                b2.style.transform = 'none';

                b3.style.transform = 'none';

                b4.style.transform = 'none';

                b1.style.opacity = '1';

                b2.style.opacity = '1';

                b3.style.opacity = '1';

                b4.style.opacity = '1';

                merged.classList.remove('show');

            }, 12000);

        }

        /* ========================================================

           9. Vowel W Logic (صوت حرف المد و - ص 13 - 14)

        ======================================================== */

        function switchWStation(stationNum) {

            for (let i = 1; i <= 4; i++) {

                const btn = document.getElementById('btnStationW' + i);

                const pane = document.getElementById('stationW' + i);

                if (btn) btn.classList.toggle('active', i === stationNum);

                if (pane) {

                    pane.style.display = (i === stationNum) ? 'block' : 'none';

                    pane.classList.toggle('active', i === stationNum);

                }

            }

            if (stationNum === 4) {

                setTimeout(initWCanvas, 100);

            }

        }

        function playWLetterSound() {

            mascotCelebrates();

            mascotSpeak('صوت حرف المد بالواو: ( ووووو )! مد طويل مبهج!', 'vowel_w_sound');

        }

        function clickWItem(itemKey) {

            document.querySelectorAll('.w-item-card').forEach(c => c.classList.remove('highlighted'));

            const card = document.getElementById('card-w-' + itemKey);

            if (card) card.classList.add('highlighted');

            mascotCelebrates();

            if (itemKey === 'buma') {

                mascotSpeak('🦉 <b>بُـوْمَـةُ!</b> استمع لصوت المد في الوسط: بُـ... <b>ووو</b>... مَـة ➔ بُوْمَة!', 'vowel_w_buma');

            } else if (itemKey === 'nujum') {

                mascotSpeak('⭐ <b>نُـجُـوْمٌ!</b> نُـ... جُـ... <b>ووو</b>... م ➔ نُجُوم! صوت المد بالواو نقي وطويل!', 'vowel_w_nujum');

            } else if (itemKey === 'kharuf') {

                mascotSpeak('🐑 <b>خَـرُوْفٌ!</b> خَـ... رُ... <b>ووو</b>... ف ➔ خَرُوف! أحسنتم يا شطار!', 'vowel_w_kharuf');

            } else if (itemKey === 'dumya') {

                mascotSpeak('🧸 <b>دُمْـيَـةُ!</b> انتبه يا بطل: دُمْيَة فيها ضمة قصيرة (دُ)، وليس فيها صوت مد بالواو!', 'vowel_w_dumya');

            }

        }

        // Station 2: Quiz Logic

        function checkWQuiz(wordKey) {

            const card = document.getElementById('quiz-w-' + wordKey);

            const badge = document.getElementById('badge-w-' + wordKey);

            if (wordKey === 'hasub') {

                if (card) { card.classList.add('correct'); card.classList.remove('info-only'); }

                if (badge) { badge.innerHTML = '✔️ يحوي صوت المد (و)!'; badge.style.color = '#059669'; }

                mascotCelebrates();

                mascotSpeak('💻 صحيح! <b>حَـاسُـوْب</b> تحوي صوت المد بالواو: سُـ... <b>ووو</b>... بُ ➔ حَاسُوب!', 'vowel_w_hasub');

            } else if (wordKey === 'buq') {

                if (card) { card.classList.add('correct'); card.classList.remove('info-only'); }

                if (badge) { badge.innerHTML = '✔️ يحوي صوت المد (و)!'; badge.style.color = '#059669'; }

                mascotCelebrates();

                mascotSpeak('🎺 أحسنت! <b>بُـوْق</b> فيها صوت مد بالواو طويل: بُـ... <b>ووو</b>... قُ!', 'vowel_w_buq');

            } else if (wordKey === 'tut') {

                if (card) { card.classList.add('correct'); card.classList.remove('info-only'); }

                if (badge) { badge.innerHTML = '✔️ يحوي صوت المد (و)!'; badge.style.color = '#059669'; }

                mascotCelebrates();

                mascotSpeak('🫐 رائع! <b>تُـوْت</b> تحوي صوت مد بالواو: تُـ... <b>ووو</b>... تُ!', 'vowel_w_tut');

            } else if (wordKey === 'bunduq') {

                if (card) { card.classList.add('info-only'); card.classList.remove('correct'); }

                if (badge) { badge.innerHTML = '💡 ضمة سريعة فقط!'; badge.style.color = '#2563eb'; }

                mascotSpeak('🌰 استمع جيداً: <b>بُـنْـدُق</b> فيها ضمة سريعة (بُـ)، ولا يوجد فيها صوت مد بالواو!', 'vowel_w_bunduq');

            }

        }

        function autoSolveWQuiz() {

            checkWQuiz('hasub');

            setTimeout(() => checkWQuiz('buq'), 3500);

            setTimeout(() => checkWQuiz('tut'), 7000);

            setTimeout(() => checkWQuiz('bunduq'), 10500);

        }

        function resetWQuiz() {

            ['hasub', 'buq', 'tut', 'bunduq'].forEach(k => {

                const card = document.getElementById('quiz-w-' + k);

                const badge = document.getElementById('badge-w-' + k);

                if (card) { card.classList.remove('correct'); card.classList.remove('info-only'); }

                if (badge) { badge.innerHTML = 'اضغط للفحص 🔍'; badge.style.color = '#64748b'; }

            });

        }

        // Station 3: Fill-in Logic

        function fillWWord(wordKey) {

            const slot = document.getElementById('slot-w-' + wordKey);

            const label = document.getElementById('label-w-' + wordKey);

            if (!slot) return;

            slot.innerHTML = 'و';

            slot.classList.add('filled');

            mascotCelebrates();

            if (wordKey === 'kharuf') {

                if (label) { label.innerHTML = '✅ خَـرُوْف'; label.style.color = '#059669'; }

                mascotSpeak('🐑 خَـرُ... <b>و</b>... فُ ➔ <b>خَـرُوْف</b>! أحسنت صارت خَرُوف!', 'vowel_w_fill_kharuf');

            } else if (wordKey === 'suf') {

                if (label) { label.innerHTML = '✅ صُـوْف'; label.style.color = '#059669'; }

                mascotSpeak('🧶 صُـ... <b>و</b>... فُ ➔ <b>صُـوْف</b>! صوف الخروف الناعم!', 'vowel_w_fill_suf');

            } else if (wordKey === 'laymun') {

                if (label) { label.innerHTML = '✅ لَيْـمُـوْن'; label.style.color = '#059669'; }

                mascotSpeak('🍋 لَيْـمُـ... <b>و</b>... نُ ➔ <b>لَيْـمُـوْن</b>! ليمون أصفر لذيذ!', 'vowel_w_fill_laymun');

            } else if (wordKey === 'nusur') {

                if (label) { label.innerHTML = '✅ نُـسُـوْر'; label.style.color = '#059669'; }

                mascotSpeak('🦅 نُـسُـ... <b>و</b>... رُ ➔ <b>نُـسُـوْر</b>! نسور قوية تطير في السماء!', 'vowel_w_fill_nusur');

            }

        }

        function autoSolveWFill() {

            fillWWord('kharuf');

            setTimeout(() => fillWWord('suf'), 3500);

            setTimeout(() => fillWWord('laymun'), 7000);

            setTimeout(() => fillWWord('nusur'), 10500);

        }

        function resetWFill() {

            ['kharuf', 'suf', 'laymun', 'nusur'].forEach(k => {

                const slot = document.getElementById('slot-w-' + k);

                const label = document.getElementById('label-w-' + k);

                if (slot) { slot.innerHTML = '..'; slot.classList.remove('filled'); }

                if (label) { label.innerHTML = 'انقر لوضع حرف (و)'; label.style.color = '#64748b'; }

            });

        }

        // Station 4: Drawing Canvas Logic

        let wCanvasInited = false;

        let wDrawing = false;

        let wDrawColor = '#2563eb';

        let wLineWidth = 8;

        let wIsEraser = false;

        function initWCanvas() {

            const canvas = document.getElementById('wDrawingCanvas');

            if (!canvas) return;

            const ctx = canvas.getContext('2d');

            if (!wCanvasInited) {

                wCanvasInited = true;

                drawWCanvasGuides(ctx, canvas);

                const startDrawing = (e) => {

                    wDrawing = true;

                    ctx.beginPath();

                    const pos = getCanvasPos(canvas, e);

                    ctx.moveTo(pos.x, pos.y);

                    if (e.cancelable) e.preventDefault();

                };

                const drawMove = (e) => {

                    if (!wDrawing) return;

                    const pos = getCanvasPos(canvas, e);

                    ctx.lineTo(pos.x, pos.y);

                    ctx.strokeStyle = wIsEraser ? '#ffffff' : wDrawColor;

                    ctx.lineWidth = wIsEraser ? 24 : wLineWidth;

                    ctx.lineCap = 'round';

                    ctx.lineJoin = 'round';

                    ctx.stroke();

                    if (e.cancelable) e.preventDefault();

                };

                const stopDrawing = () => {

                    if (wDrawing) {

                        wDrawing = false;

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

        function getCanvasPos(canvas, evt) {

            const rect = canvas.getBoundingClientRect();

            const scaleX = canvas.width / rect.width;

            const scaleY = canvas.height / rect.height;

            const clientX = evt.touches ? evt.touches[0].clientX : evt.clientX;

            const clientY = evt.touches ? evt.touches[0].clientY : evt.clientY;

            return {

                x: (clientX - rect.left) * scaleX,

                y: (clientY - rect.top) * scaleY

            };

        }

        function drawWCanvasGuides(ctx, canvas) {

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Baseline

            ctx.save();

            ctx.strokeStyle = '#94a3b8';

            ctx.lineWidth = 2;

            ctx.setLineDash([8, 8]);

            ctx.beginPath();

            ctx.moveTo(20, 180);

            ctx.lineTo(canvas.width - 20, 180);

            ctx.stroke();

            // Guide dashed letter و

            ctx.font = '900 170px "Tajawal", sans-serif';

            ctx.fillStyle = '#f1f5f9';

            ctx.textAlign = 'center';

            ctx.textBaseline = 'middle';

            ctx.fillText('و', canvas.width / 2, 175);

            ctx.strokeStyle = '#cbd5e1';

            ctx.lineWidth = 3;

            ctx.setLineDash([6, 6]);

            ctx.strokeText('و', canvas.width / 2, 175);

            // Numbered hint labels

            ctx.setLineDash([]);

            ctx.font = 'bold 16px "Tajawal", sans-serif';

            ctx.fillStyle = '#64748b';

            ctx.fillText('① ابدأ بالدائرة فوق السطر ➔ ثم ② انزل منحنياً كالزحليقة', canvas.width / 2, 290);

            ctx.restore();

        }

        function clearWCanvas() {

            const canvas = document.getElementById('wDrawingCanvas');

            if (!canvas) return;

            const ctx = canvas.getContext('2d');

            drawWCanvasGuides(ctx, canvas);

        }

        function setWDrawColor(color, el) {

            wIsEraser = false;

            wDrawColor = color;

            document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));

            if (el) el.classList.add('active');

        }

        function setWEraser(el) {

            wIsEraser = true;

            document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));

            if (el) el.classList.add('active');

        }

        /* ========================================================

           10. Vowel Y Logic (صوت حرف المد يـ ، ي - ص 15 - 16)

        ======================================================== */

        function switchYStation(stationNum) {

            for (let i = 1; i <= 4; i++) {

                const btn = document.getElementById('btnStationY' + i);

                const pane = document.getElementById('stationY' + i);

                if (btn) btn.classList.toggle('active', i === stationNum);

                if (pane) {

                    pane.style.display = (i === stationNum) ? 'block' : 'none';

                    pane.classList.toggle('active', i === stationNum);

                }

            }

            if (stationNum === 4) {

                setTimeout(initYCanvas, 100);

            }

        }

        function playYLetterSound() {

            mascotCelebrates();

            mascotSpeak('صوت حرف المد بالياء: ( ييييي )! صوت مد مكسور طويل ومبهج!', 'vowel_y_sound');

        }

        function clickYItem(itemKey) {

            document.querySelectorAll('.y-item-card').forEach(c => c.classList.remove('highlighted'));

            const card = document.getElementById('card-y-' + itemKey);

            if (card) card.classList.add('highlighted');

            mascotCelebrates();

            if (itemKey === 'fil') {

                mascotSpeak('🐘 <b>فِـيْـلٌ!</b> فِـ... <b>ييي</b>... ل ➔ فِيل! استمعوا لصوت المد الطويل: يييي!', 'vowel_y_fil');

            } else if (itemKey === 'tin') {

                mascotSpeak('🫐 <b>تِـيْـنٌ!</b> تِـ... <b>ييي</b>... ن ➔ تِين! تين حلو ولذيذ!', 'vowel_y_tin');

            } else if (itemKey === 'mizan') {

                mascotSpeak('⚖️ <b>مِـيْـزَانٌ!</b> مِـ... <b>ييي</b>... زَان ➔ مِيزَان! نزن به الأشياء!', 'vowel_y_mizan');

            } else if (itemKey === 'siwar') {

                mascotSpeak('📿 <b>سِـوَارٌ!</b> انتبه يا بطل: سِوَار فيها كسرة قصيرة (سِـ)، وليس فيها صوت مد بالياء!', 'vowel_y_siwar');

            }

        }

        // Station 2: Quiz Logic for Y

        function checkYQuiz(wordKey) {

            const card = document.getElementById('quiz-y-' + wordKey);

            const badge = document.getElementById('badge-y-' + wordKey);

            if (wordKey === 'dik') {

                if (card) { card.classList.add('correct'); card.classList.remove('info-only'); }

                if (badge) { badge.innerHTML = '✔️ يحوي صوت المد (ي)!'; badge.style.color = '#059669'; }

                mascotCelebrates();

                mascotSpeak('🐓 صحيح! <b>دِيْـك</b> يحوي صوت المد بالياء: دِ... <b>ييي</b>... كُ ➔ دِيك!', 'vowel_y_dik');

            } else if (wordKey === 'rish') {

                if (card) { card.classList.add('correct'); card.classList.remove('info-only'); }

                if (badge) { badge.innerHTML = '✔️ يحوي صوت المد (ي)!'; badge.style.color = '#059669'; }

                mascotCelebrates();

                mascotSpeak('🪶 أحسنت! <b>رِيْـش</b> فيه صوت مد بالياء: رِ... <b>ييي</b>... شُ ➔ رِيش!', 'vowel_y_rish');

            } else if (wordKey === 'halib') {

                if (card) { card.classList.add('correct'); card.classList.remove('info-only'); }

                if (badge) { badge.innerHTML = '✔️ يحوي صوت المد (ي)!'; badge.style.color = '#059669'; }

                mascotCelebrates();

                mascotSpeak('🥛 رائع! <b>حَـلِـيْـب</b> يحوي صوت مد بالياء: لِـ... <b>ييي</b>... بُ ➔ حَلِيب!', 'vowel_y_halib');

            } else if (wordKey === 'bisat') {

                if (card) { card.classList.add('info-only'); card.classList.remove('correct'); }

                if (badge) { badge.innerHTML = '💡 كسرة سريعة فقط!'; badge.style.color = '#2563eb'; }

                mascotSpeak('🛋️ استمع جيداً: <b>بِـسَـاط</b> فيه كسرة سريعة (بِـ)، ولا يوجد فيه صوت مد بالياء!', 'vowel_y_bisat');

            }

        }

        function autoSolveYQuiz() {

            checkYQuiz('dik');

            setTimeout(() => checkYQuiz('rish'), 3500);

            setTimeout(() => checkYQuiz('halib'), 7000);

            setTimeout(() => checkYQuiz('bisat'), 10500);

        }

        function resetYQuiz() {

            ['dik', 'rish', 'halib', 'bisat'].forEach(k => {

                const card = document.getElementById('quiz-y-' + k);

                const badge = document.getElementById('badge-y-' + k);

                if (card) { card.classList.remove('correct'); card.classList.remove('info-only'); }

                if (badge) { badge.innerHTML = 'اضغط للفحص 🔍'; badge.style.color = '#64748b'; }

            });

        }

        // Station 3: Fill-in Logic for Y

        function fillYWord(wordKey) {

            const slot = document.getElementById('slot-y-' + wordKey);

            const label = document.getElementById('label-y-' + wordKey);

            if (!slot) return;

            slot.innerHTML = 'يـ';

            slot.classList.add('filled');

            mascotCelebrates();

            if (wordKey === 'bittikh') {

                if (label) { label.innerHTML = '✅ بِـطِّـيْـخُ'; label.style.color = '#059669'; }

                mascotSpeak('🍉 بِـطِّـ... <b>يـ</b>... خُ ➔ <b>بِـطِّـيْـخ</b>! أحسنت صارت بِطِّيخ لذيذ!', 'vowel_y_fill_bittikh');

            } else if (wordKey === 'safina') {

                if (label) { label.innerHTML = '✅ سَـفِـيْـنَـةُ'; label.style.color = '#059669'; }

                mascotSpeak('⛵ سَـفِـ... <b>يـ</b>... نَـة ➔ <b>سَـفِـيْـنَـة</b>! سفينة تبحر في البحر!', 'vowel_y_fill_safina');

            } else if (wordKey === 'fil') {

                if (label) { label.innerHTML = '✅ فِـيْـلُ'; label.style.color = '#059669'; }

                mascotSpeak('🐘 فِـ... <b>يـ</b>... ل ➔ <b>فِـيْـل</b>! فيل ضخم ولطيف!', 'vowel_y_fill_fil');

            } else if (wordKey === 'rish') {

                if (label) { label.innerHTML = '✅ رِيْـشُ'; label.style.color = '#059669'; }

                mascotSpeak('🪶 رِ... <b>يـ</b>... ش ➔ <b>رِيْـش</b>! ريش الطائر الملون!', 'vowel_y_fill_rish');

            }

        }

        function autoSolveYFill() {

            fillYWord('bittikh');

            setTimeout(() => fillYWord('safina'), 3500);

            setTimeout(() => fillYWord('fil'), 7000);

            setTimeout(() => fillYWord('rish'), 10500);

        }

        function resetYFill() {

            ['bittikh', 'safina', 'fil', 'rish'].forEach(k => {

                const slot = document.getElementById('slot-y-' + k);

                const label = document.getElementById('label-y-' + k);

                if (slot) { slot.innerHTML = '..'; slot.classList.remove('filled'); }

                if (label) { label.innerHTML = 'انقر لوضع حرف (يـ)'; label.style.color = '#64748b'; }

            });

        }

        // Station 4: Drawing Canvas Logic for Y

        let yCanvasInited = false;

        let yDrawing = false;

        let yDrawColor = '#7c3aed';

        let yLineWidth = 8;

        let yIsEraser = false;

        function initYCanvas() {

            const canvas = document.getElementById('yDrawingCanvas');

            if (!canvas) return;

            const ctx = canvas.getContext('2d');

            if (!yCanvasInited) {

                yCanvasInited = true;

                drawYCanvasGuides(ctx, canvas);

                const startDrawing = (e) => {

                    yDrawing = true;

                    ctx.beginPath();

                    const pos = getCanvasPos(canvas, e);

                    ctx.moveTo(pos.x, pos.y);

                    if (e.cancelable) e.preventDefault();

                };

                const drawMove = (e) => {

                    if (!yDrawing) return;

                    const pos = getCanvasPos(canvas, e);

                    ctx.lineTo(pos.x, pos.y);

                    ctx.strokeStyle = yIsEraser ? '#ffffff' : yDrawColor;

                    ctx.lineWidth = yIsEraser ? 24 : yLineWidth;

                    ctx.lineCap = 'round';

                    ctx.lineJoin = 'round';

                    ctx.stroke();

                    if (e.cancelable) e.preventDefault();

                };

                const stopDrawing = () => {

                    if (yDrawing) {

                        yDrawing = false;

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

        function drawYCanvasGuides(ctx, canvas) {

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Baseline

            ctx.save();

            ctx.strokeStyle = '#94a3b8';

            ctx.lineWidth = 2;

            ctx.setLineDash([8, 8]);

            ctx.beginPath();

            ctx.moveTo(20, 180);

            ctx.lineTo(canvas.width - 20, 180);

            ctx.stroke();

            // Guide dashed letters يـ   ي

            ctx.font = '900 130px "Tajawal", sans-serif';

            ctx.fillStyle = '#f5f3ff';

            ctx.textAlign = 'center';

            ctx.textBaseline = 'middle';

            ctx.fillText('يـ   ي', canvas.width / 2, 160);

            ctx.strokeStyle = '#ddd6fe';

            ctx.lineWidth = 3;

            ctx.setLineDash([6, 6]);

            ctx.strokeText('يـ   ي', canvas.width / 2, 160);

            // Numbered hint labels

            ctx.setLineDash([]);

            ctx.font = 'bold 15px "Tajawal", sans-serif';

            ctx.fillStyle = '#6d28d9';

            ctx.fillText('① الياء المنفصلة (كالبطة مع نقطتين)  |  ② الياء في أول الكلمة (سن ونقطتان)', canvas.width / 2, 290);

            ctx.restore();

        }

        function clearYCanvas() {

            const canvas = document.getElementById('yDrawingCanvas');

            if (!canvas) return;

            const ctx = canvas.getContext('2d');

            drawYCanvasGuides(ctx, canvas);

        }

        function setYDrawColor(color, el) {

            yIsEraser = false;

            yDrawColor = color;

            document.querySelectorAll('.color-dot-y').forEach(d => d.classList.remove('active'));

            if (el) el.classList.add('active');

        }

        function setYEraser(el) {

            yIsEraser = true;

            document.querySelectorAll('.color-dot-y').forEach(d => d.classList.remove('active'));

            if (el) el.classList.add('active');

        }

        

