/* ==========================================================================
 * منصة قراءتي التفاعلية الذكية - المحرك الصوتي وفصيح والإعدادات (Audio Engine & Mascot)
 * إعداد وتطوير: المهندس أسامة خليل هاشم
 * ========================================================================== */

        /* ========================================================

           2. Audio & Mascot Engine

        ======================================================== */

                let currentAudio = null;

        window._currentPlayingKey = null;

        function updateAudioControlsState(isPlaying, audioKey) {

            const btnTopStop = document.getElementById('btnTopStop');

            const btnSpeechStop = document.getElementById('btnSpeechStop');

            const floatingStopBtn = document.getElementById('floatingStopBtn');

            const isFloatingEnabled = localStorage.getItem('qiraati_smart_floating_stop') !== 'false';

            if (isPlaying) {

                if (btnTopStop) btnTopStop.style.display = 'inline-flex';

                if (btnSpeechStop) btnSpeechStop.style.display = 'inline-flex';

                if (floatingStopBtn && isFloatingEnabled) floatingStopBtn.style.display = 'inline-flex';

            } else {

                if (btnTopStop) btnTopStop.style.display = 'none';

                if (btnSpeechStop) btnSpeechStop.style.display = 'none';

                if (floatingStopBtn) floatingStopBtn.style.display = 'none';

                window._currentPlayingKey = null;

                resetActiveAudioButtons();

            }

        }

        function stopAudio() {

            if (currentAudio) {

                try {

                    currentAudio.pause();

                    currentAudio.currentTime = 0;

                } catch(e) {}

                currentAudio = null;

            }

            const bubble = document.getElementById('speechBubble');

            const avatar = document.getElementById('mascotAvatar');

            if (bubble) bubble.classList.remove('speaking');

            if (avatar) avatar.classList.remove('mascot-speaking');

            updateAudioControlsState(false);

        }

        function resetActiveAudioButtons() {

            const btnNasheed = document.getElementById('btnLesson1Nasheed');

            if (btnNasheed && btnNasheed.innerText.includes('إيقاف')) {

                btnNasheed.innerHTML = '🎵 نشاط ٢: استمع لنشيد البطة وردد';

            }

            const btnFamily = document.getElementById('btnUnit1FamilyStory');

            if (btnFamily && btnFamily.innerText.includes('إيقاف')) {

                btnFamily.innerHTML = '🎧 استمع لقصة الأسرة كاملة';

            }

            const btnBPicnic = document.getElementById('btnBPicnic');

            if (btnBPicnic && btnBPicnic.innerText.includes('إيقاف')) {

                btnBPicnic.innerHTML = '🧺 استمع لقصة نزهة الأسرة';

            }

            const btnMScene = document.getElementById('btnMSceneStory');

            if (btnMScene && btnMScene.innerText.includes('إيقاف')) {

                btnMScene.innerHTML = '🎧 استمع لقصة الأسرة في غرفة المعيشة';

            }

        }

        function playAudio(audioKey, onEndedCallback) {
            mascotSpeak('', audioKey, onEndedCallback);
        }

        function mascotSpeak(text, audioKey, onEndedCallback) {
            const bubble = document.getElementById('speechBubble');
            const speechText = document.getElementById('speechText');
            const avatar = document.getElementById('mascotAvatar');

            if (text && speechText) {
                speechText.innerHTML = text;
            }
            if (text && bubble) {
                bubble.classList.add('speaking');
            }
            if (avatar) avatar.classList.add('mascot-speaking');

            if (currentAudio) {
                try {
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                } catch(e) {}
                currentAudio = null;
            }

            // تحديد الصوت بناءً على تفضيلات الضبط (المعلمة رنا / المعلم باسل / الوضع التكاملي / صوت المعلمة الميداني الحقيقي)
            const voicePref = localStorage.getItem('qiraati_smart_voice_pref') || 'integrated';
            let finalKey = audioKey;

            // جدول المطابقة الدقيقة لتحويل أصوات الدروس إلى تسجيلات المعلمة الميدانية الحقيقية
            const teacherDirectMap = {
                'letter_d_read_dada': 'teacher_reading_dada',
                'word_dada': 'teacher_reading_dada',
                'letter_d_read_baba': 'teacher_reading_baba',
                'letter_d_read_mama': 'teacher_reading_mama',
                'letter_m_read_bum': 'teacher_reading_boom',
                'letter_d_read_all': 'teacher_letter_d_words_all',
                'letter_m_read_all': 'teacher_letter_m_words_all',
                'letter_f_read_all': 'teacher_letter_f_read_all',
                'act5_pick_alif': 'teacher_act5_alif_sound',
                'act5_prompt': 'teacher_act5_intro',
                'letter_d_intro': 'teacher_letter_d_act1_intro',
                'letter_d_qidr_syllable': 'teacher_letter_d_qidr',
                'letter_f_intro': 'teacher_letter_f_act1_intro',
                'letter_m_intro': 'teacher_letter_m_act1_intro',
                'vowel_w_intro': 'teacher_vowel_w_intro',
                'vowel_w_read_all': 'teacher_vowel_w_all',
                'vowel_y_intro': 'teacher_vowel_y_intro',
                'vowel_y_read_all': 'teacher_vowel_y_all',
                'letter_s_read_all': 'letter_s_teacher_read_all',
                'letter_s_read_sentence1': 'letter_s_teacher_sentence1',
                'letter_s_read_sentence2': 'letter_s_teacher_sentence2',
                'letter_s_read_sentence3': 'letter_s_teacher_sentence3',
                'letter_s_read_word_safara': 'letter_s_teacher_word_safara',
                'letter_s_read_word_baba': 'letter_s_teacher_word_baba',
                'letter_s_read_word_rasama': 'letter_s_teacher_word_rasama',
                'letter_s_read_word_moosa': 'letter_s_teacher_word_moosa',
                'letter_s_read_word_faris': 'letter_s_teacher_word_faris',
                'letter_s_read_word_mama': 'letter_s_teacher_word_mama'
            };

            // جدول المطابقة الدقيقة لتحويل أصوات فصيح إلى التسجيلات الفونيمية المطورة
            const faseehDirectMap = {
                'word_dada': 'faseeh_blend_dada',
                'letter_d_read_dada': 'faseeh_blend_dada',
                'letter_r_read_dar': 'faseeh_blend_dar',
                'act5_dar': 'faseeh_blend_dar',
                'letter_d_read_door': 'faseeh_blend_door',
                'letter_n_read_noor': 'faseeh_blend_noor',
                'letter_s_read_word_firas': 'faseeh_blend_firas',
                'tanween_dham_read_ward': 'faseeh_blend_wardun',
                'letter_d_sound': 'faseeh_phoneme_d',
                'letter_r_sound': 'faseeh_phoneme_r',
                'letter_s_sound': 'faseeh_phoneme_s',
                'letter_m_sound': 'faseeh_phoneme_m',
                'letter_b_sound': 'faseeh_phoneme_b',
                'letter_n_sound': 'faseeh_phoneme_n',
                'letter_f_sound': 'faseeh_phoneme_f',
                'letter_t_sound': 'faseeh_phoneme_t',
                'marboota_sound': 'faseeh_phoneme_marboota',
                'tanween_dham_sound': 'faseeh_phoneme_tanween',
                'letter_d_vowels_intro': 'faseeh_vowels_d',
                'letter_r_vowels_intro': 'faseeh_vowels_r',
                'letter_s_vowels_intro': 'faseeh_vowels_s',
                'voice_preview_bassel': 'faseeh_model_ana_wahdi',
                'voice_confirm_bassel': 'faseeh_encourage_super'
            };

            if (window.AUDIO_DATA) {
                if (voicePref === 'teacher') {
                    if (audioKey && teacherDirectMap[audioKey] && window.AUDIO_DATA[teacherDirectMap[audioKey]]) {
                        finalKey = teacherDirectMap[audioKey];
                    } else if (audioKey && window.AUDIO_DATA['teacher_' + audioKey]) {
                        finalKey = 'teacher_' + audioKey;
                    } else if (audioKey && window.AUDIO_DATA[audioKey + '_teacher']) {
                        finalKey = audioKey + '_teacher';
                    } else if (audioKey && audioKey.startsWith('letter_s_read_')) {
                        const sCandidate = audioKey.replace('letter_s_read_', 'letter_s_teacher_');
                        if (window.AUDIO_DATA[sCandidate]) finalKey = sCandidate;
                    } else if (audioKey && window.AUDIO_DATA[audioKey]) {
                        finalKey = audioKey;
                    }
                } else if (voicePref === 'bassel') {
                    if (audioKey && faseehDirectMap[audioKey] && window.AUDIO_DATA[faseehDirectMap[audioKey]]) {
                        finalKey = faseehDirectMap[audioKey];
                    } else if (window.AUDIO_DATA[audioKey + '_bassel']) {
                        finalKey = audioKey + '_bassel';
                    } else if (window.AUDIO_DATA['bassel_' + audioKey]) {
                        finalKey = 'bassel_' + audioKey;
                    }
                } else if (voicePref === 'rana') {
                    if (window.AUDIO_DATA[audioKey + '_rana']) finalKey = audioKey + '_rana';
                    else if (window.AUDIO_DATA['rana_' + audioKey]) finalKey = 'rana_' + audioKey;
                } else if (voicePref === 'integrated') {
                    if (audioKey && (audioKey.includes('encourage') || audioKey.includes('hint') || audioKey.includes('mascot') || audioKey.includes('applause') || audioKey.includes('bassel'))) {
                        if (audioKey && faseehDirectMap[audioKey] && window.AUDIO_DATA[faseehDirectMap[audioKey]]) finalKey = faseehDirectMap[audioKey];
                        else if (window.AUDIO_DATA[audioKey + '_bassel']) finalKey = audioKey + '_bassel';
                        else if (window.AUDIO_DATA['bassel_' + audioKey]) finalKey = 'bassel_' + audioKey;
                    } else {
                        if (window.AUDIO_DATA[audioKey + '_rana']) finalKey = audioKey + '_rana';
                        else if (window.AUDIO_DATA['rana_' + audioKey]) finalKey = 'rana_' + audioKey;
                    }
                }
            }

            let src = '';
            if (window.AUDIO_DATA && finalKey && window.AUDIO_DATA[finalKey]) {
                src = window.AUDIO_DATA[finalKey];
            } else if (window.AUDIO_DATA && audioKey && window.AUDIO_DATA[audioKey]) {
                src = window.AUDIO_DATA[audioKey];
            } else if (finalKey) {
                src = 'audio/' + finalKey + '.mp3';
            } else if (audioKey) {
                src = 'audio/' + audioKey + '.mp3';
            }

            window._currentPlayingKey = audioKey;

            try {
                if (src) {
                    const audio = new Audio(src);
                    currentAudio = audio;
                    applyVolumeToAudio(audio, getMasterVolume());

                    // تطبيق التمايز الصوتي الفوري على النبرة وطبقة الصوت (Pitch & Formant Adaptation)
                    // لتغيير الصوت فورياً لجميع دروس وكلمات المنصة عند تغيير الخيار من الضبط
                    try {
                        if ((finalKey && finalKey.includes('teacher')) || (audioKey && audioKey.includes('teacher'))) {
                            audio.preservesPitch = true;
                            audio.playbackRate = 1.0; // صوت المعلمة الميداني الحقيقي الصافي بدون تغيير نبرة
                        } else if (voicePref === 'bassel') {
                            audio.preservesPitch = true;
                            audio.playbackRate = 1.0; // صوت فصيح الذكي المطور بنبرته الطبيعية الدافئة بدون تشويه روبوتي
                        } else if (voicePref === 'rana') {
                            if (!finalKey || !finalKey.includes('rana')) {
                                audio.preservesPitch = false;
                                audio.playbackRate = 1.07; // طبقة مشرقة دافئة أنثوية
                            } else {
                                audio.preservesPitch = true;
                                audio.playbackRate = 1.0;
                            }
                        } else {
                            audio.preservesPitch = true;
                            audio.playbackRate = 1.0; // النمط التكاملي الأصلي
                        }
                    } catch (eRate) {
                        console.warn('Audio rate adaptation note:', eRate);
                    }

                    updateAudioControlsState(true, audioKey);

                    audio.onended = () => {
                        if (bubble) bubble.classList.remove('speaking');
                        if (avatar) avatar.classList.remove('mascot-speaking');
                        updateAudioControlsState(false);
                        if (onEndedCallback) onEndedCallback();
                    };

                    audio.onerror = () => {
                        if (bubble) bubble.classList.remove('speaking');
                        if (avatar) avatar.classList.remove('mascot-speaking');
                        updateAudioControlsState(false);
                    };

                    audio.play().catch(e => {
                        console.log('Audio playback info:', e);
                        updateAudioControlsState(false);
                    });
                }
            } catch (err) {
                console.error(err);
                if (bubble) bubble.classList.remove('speaking');
                if (avatar) avatar.classList.remove('mascot-speaking');
                updateAudioControlsState(false);
            }
        }

        // ==============================================================

        // نظام ضبط المنصة واختيار القارئ الصوتي العراقي

        // إعداد وتطوير: المهندس أسامة خليل هاشم

        // ==============================================================

        
        // ==============================================================
        // نظام التحكم بمستوى الصوت ومضاعف التعزيز الرقمي (30% - 150%)
        // إعداد وتطوير: المهندس أسامة خليل هاشم
        // ==============================================================
        function getMasterVolume() {
            const v = localStorage.getItem('qiraati_smart_volume');
            return v ? parseInt(v, 10) : 100;
        }

        function changeMasterVolume(val) {
            val = parseInt(val, 10);
            if (isNaN(val)) val = 100;
            if (val < 0) val = 0;
            if (val > 150) val = 150;
            localStorage.setItem('qiraati_smart_volume', val);

            const topSlider = document.getElementById('topVolumeSlider');
            if (topSlider) topSlider.value = val;
            const topBadge = document.getElementById('topVolBadge');
            if (topBadge) topBadge.innerText = val + '%';
            const topIcon = document.getElementById('topVolIcon');
            if (topIcon) topIcon.innerText = val === 0 ? '🔇' : (val < 70 ? '🔉' : '🔊');

            const setSlider = document.getElementById('settingsVolSlider');
            if (setSlider) setSlider.value = val;
            const setBadge = document.getElementById('settingsVolBadge');
            if (setBadge) setBadge.innerText = val + '%';

            if (currentAudio) {
                applyVolumeToAudio(currentAudio, val);
            }
        }

        let _lastPreMuteVolume = 100;
        function toggleMuteAudio() {
            const cur = getMasterVolume();
            if (cur > 0) {
                _lastPreMuteVolume = cur;
                changeMasterVolume(0);
            } else {
                changeMasterVolume(_lastPreMuteVolume || 100);
            }
        }

        function applyVolumeToAudio(audio, volPct) {
            if (!audio) return;
            if (volPct <= 100) {
                audio.volume = Math.max(0, Math.min(1.0, volPct / 100));
            } else {
                audio.volume = 1.0;
                try {
                    const AudioContext = window.AudioContext || window.webkitAudioContext;
                    if (AudioContext && !audio._gainApplied) {
                        if (!window._sharedAudioCtx) {
                            window._sharedAudioCtx = new AudioContext();
                        }
                        if (window._sharedAudioCtx.state === 'suspended') {
                            window._sharedAudioCtx.resume();
                        }
                        const ctx = window._sharedAudioCtx;
                        const source = ctx.createMediaElementSource(audio);
                        const gainNode = ctx.createGain();
                        gainNode.gain.value = volPct / 100;
                        source.connect(gainNode);
                        gainNode.connect(ctx.destination);
                        audio._gainApplied = true;
                        audio._gainNode = gainNode;
                    } else if (audio._gainNode) {
                        audio._gainNode.gain.value = volPct / 100;
                    }
                } catch(e) {
                    audio.volume = 1.0;
                }
            }
        }

        function openSettingsModal() {
            const modal = document.getElementById('settingsModal');
            if (!modal) return;
            const currentPref = localStorage.getItem('qiraati_smart_voice_pref') || 'integrated';
            applyVoiceCardVisuals(currentPref);
            const isFloating = localStorage.getItem('qiraati_smart_floating_stop') !== 'false';
            const chk = document.getElementById('chkFloatingStop');
            if (chk) chk.checked = isFloating;
            const curVol = getMasterVolume();
            const setSlider = document.getElementById('settingsVolSlider');
            if (setSlider) setSlider.value = curVol;
            const setBadge = document.getElementById('settingsVolBadge');
            if (setBadge) setBadge.innerText = curVol + '%';
            modal.style.display = 'flex';
        }

        function closeSettingsModal() {
            const modal = document.getElementById('settingsModal');
            if (modal) modal.style.display = 'none';
        }

        function setVoicePreference(pref) {
            localStorage.setItem('qiraati_smart_voice_pref', pref);
            applyVoiceCardVisuals(pref);

            let confirmKey = '';
            let msg = '';
            if (pref === 'teacher') {
                confirmKey = 'letter_s_teacher_word_safara';
                msg = '👩‍🏫 تم اعتماد <b>صوت المعلمة الميداني الحقيقي</b> لدروس وكلمات القراءة!';
            } else if (pref === 'rana') {
                confirmKey = 'voice_confirm_rana';
                msg = '👩‍🏫 تم اعتماد صوت <b>(المعلمة رنا)</b> لجميع الدروس والكلمات والمقاطع!';
            } else if (pref === 'bassel') {
                confirmKey = 'faseeh_encourage_super';
                msg = '👨‍🏫 تم اعتماد <b>صوت فصيح الذكي المطور</b> (نطق فونيمي دافئ ومخارج حروف مطابقة للمنهج)!';
            } else {
                confirmKey = 'voice_confirm_integrated';
                msg = '🌟 تم اعتماد <b>الوضع التكاملي المشترك</b> (رنا للدروس وباسل لفصيح)!';
            }
            playAudio(confirmKey);
            const speechText = document.getElementById('speechText');
            if (speechText) speechText.innerHTML = msg;
            const bubble = document.getElementById('speechBubble');
            if (bubble) bubble.classList.add('speaking');
        }

        function applyVoiceCardVisuals(pref) {
            document.querySelectorAll('.settings-voice-card').forEach(c => c.classList.remove('active'));
            const card = document.getElementById('cardVoice_' + pref);
            if (card) card.classList.add('active');
            const radio = document.getElementById('radioVoice_' + pref);
            if (radio) radio.checked = true;
        }

        function playPreviewVoice(pref) {
            if (pref === 'teacher') {
                playAudio('letter_s_teacher_sentence1');
                const speechText = document.getElementById('speechText');
                if (speechText) speechText.innerHTML = '👩‍🏫 <b>«سَافَرَ بَابَا»</b><br>بِصَوْتِ الْمُعَلِّمَةِ الْعِرَاقِيَّةِ الْفَصِيحِ مِنَ الشَّرْحِ الصَّفِّيِّ الْحَقِيقِيِّ!';
                const bubble = document.getElementById('speechBubble');
                if (bubble) bubble.classList.add('speaking');
            } else if (pref === 'rana') {
                playAudio('voice_preview_rana');
                const speechText = document.getElementById('speechText');
                if (speechText) speechText.innerHTML = 'مَرْحَباً بِكُمْ! أَنَا الْمُعَلِّمَةُ رَنَا، سَنَتَعَلَّمُ مَعاً قِرَاءَةَ الْحُرُوفِ وَالْكَلِمَاتِ بِأَسْلُوبٍ مُمْتِعٍ وَفَصِيح!';
                const bubble = document.getElementById('speechBubble');
                if (bubble) bubble.classList.add('speaking');
            } else if (pref === 'bassel') {
                playAudio('faseeh_model_ana_wahdi');
                const speechText = document.getElementById('speechText');
                if (speechText) speechText.innerHTML = '👨‍🏫 <b>صَوْتُ فَصِيحٍ الذَّكِيِّ الْمُطَوَّر</b><br>«أَنَا وَحْدِي: أَنْظُرُ إِلَى الْكَلِمَة... دَا... دَا... دَادَا!»<br>بِالنُّطْقِ الْفَوْنِيمِيِّ الدَّافِئِ وَمَخَارِجِ الْحُرُوفِ الصَّافِيَة!';
                const bubble = document.getElementById('speechBubble');
                if (bubble) bubble.classList.add('speaking');
            }
        }

        function toggleFloatingStopSetting(enabled) {

            localStorage.setItem('qiraati_smart_floating_stop', enabled ? 'true' : 'false');

            const floatingBtn = document.getElementById('floatingStopBtn');

            if (floatingBtn && !enabled) {

                floatingBtn.style.display = 'none';

            } else if (floatingBtn && enabled && currentAudio && !currentAudio.paused) {

                floatingBtn.style.display = 'inline-flex';

            }

        }

        function mascotCelebrates() {

            const avatar = document.getElementById('mascotAvatar');

            avatar.classList.add('mascot-celebrate');

            setTimeout(() => avatar.classList.remove('mascot-celebrate'), 1500);

        }

        function mascotInteracted() {

            mascotCelebrates();

            mascotSpeak('أنا صديقك فَصِيح! اختر الدرس من القائمة اليمنى وسأرافقك دائماً!', 'mascot_hint');

        }

