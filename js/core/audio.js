/* ==========================================================================
 * منصة قراءتي التفاعلية الذكية - المحرك الصوتي وفصيح والإعدادات (Audio Engine & Mascot)
 * إعداد وتطوير: المهندس أسامة خليل هاشم
 * ========================================================================== */

        /* ========================================================

           2. Audio & Mascot Engine

        ======================================================== */

        let currentAudio = null;
        window._currentPlayingKey = null;
        let _lipSyncAnimId = null;
        let _karaokeTimer = null;

        // دوال التخزين المحلي الآمنة مع ترحيل تلقائي لبادئة قواعد أسامة (qiraati-smart-*)
        function getStoredPref(key, oldKey, defaultVal) {
            try {
                const val = localStorage.getItem(key);
                if (val !== null && val !== undefined) return val;
                if (oldKey) {
                    const oldVal = localStorage.getItem(oldKey);
                    if (oldVal !== null && oldVal !== undefined) {
                        localStorage.setItem(key, oldVal);
                        return oldVal;
                    }
                }
            } catch(e) {}
            return defaultVal;
        }

        function setStoredPref(key, oldKey, val) {
            try {
                localStorage.setItem(key, val);
                if (oldKey) localStorage.setItem(oldKey, val);
            } catch(e) {}
        }

        function cleanupAudioNodes(audio) {
            if (_lipSyncAnimId) {
                cancelAnimationFrame(_lipSyncAnimId);
                _lipSyncAnimId = null;
            }
            const mouth = document.getElementById('mascotMouth');
            if (mouth) {
                mouth.style.transform = 'scaleY(1)';
                mouth.style.transformOrigin = '80px 102px';
            }
            if (_karaokeTimer) {
                clearInterval(_karaokeTimer);
                _karaokeTimer = null;
            }
            const activeKaraokeWords = document.querySelectorAll('.karaoke-word.karaoke-active');
            activeKaraokeWords.forEach(w => w.classList.remove('karaoke-active'));

            if (!audio) return;
            try {
                if (audio._analyserNode) {
                    audio._analyserNode.disconnect();
                    audio._analyserNode = null;
                }
                if (audio._gainNode) {
                    audio._gainNode.disconnect();
                    audio._gainNode = null;
                }
                if (audio._audioSource) {
                    audio._audioSource.disconnect();
                    audio._audioSource = null;
                }
            } catch(e) {}
        }

        // مزامنة فم القلم «فَصِيح» الحقيقية (Real Lip-Sync) مع الموجة الصوتية
        function setupLipSync(audio) {
            try {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (!AudioCtx) return;
                if (!window._sharedAudioCtx) {
                    window._sharedAudioCtx = new AudioCtx();
                }
                if (window._sharedAudioCtx.state === 'suspended') {
                    window._sharedAudioCtx.resume();
                }
                const ctx = window._sharedAudioCtx;

                // ربط مصدر الصوت دون تكرار
                let source = audio._audioSource;
                if (!source) {
                    source = ctx.createMediaElementSource(audio);
                    audio._audioSource = source;
                }

                const analyser = ctx.createAnalyser();
                analyser.fftSize = 256;
                analyser.smoothingTimeConstant = 0.45;
                audio._analyserNode = analyser;

                if (!audio._gainNode) {
                    const gainNode = ctx.createGain();
                    const volPct = getMasterVolume();
                    gainNode.gain.value = volPct > 100 ? volPct / 100 : 1.0;
                    if (volPct <= 100) {
                        audio.volume = Math.max(0, Math.min(1.0, volPct / 100));
                    } else {
                        audio.volume = 1.0;
                    }
                    audio._gainNode = gainNode;
                }

                source.disconnect();
                source.connect(analyser);
                analyser.connect(audio._gainNode);
                audio._gainNode.disconnect();
                audio._gainNode.connect(ctx.destination);

                const mouth = document.getElementById('mascotMouth');
                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);

                if (_lipSyncAnimId) {
                    cancelAnimationFrame(_lipSyncAnimId);
                    _lipSyncAnimId = null;
                }

                function updateLipSync() {
                    if (!currentAudio || currentAudio.paused || currentAudio.ended) {
                        if (mouth) {
                            mouth.style.transform = 'scaleY(1)';
                            mouth.style.transformOrigin = '80px 102px';
                        }
                        return;
                    }
                    analyser.getByteFrequencyData(dataArray);
                    let sum = 0;
                    for (let i = 0; i < bufferLength; i++) {
                        sum += dataArray[i];
                    }
                    const avg = sum / bufferLength;
                    let scale = 1.0;
                    if (avg > 8) {
                        scale = 1.0 + Math.min(1.6, (avg - 8) / 22);
                    }
                    if (mouth) {
                        mouth.style.transformOrigin = '80px 102px';
                        mouth.style.transform = `scaleY(${scale.toFixed(2)})`;
                    }
                    _lipSyncAnimId = requestAnimationFrame(updateLipSync);
                }

                _lipSyncAnimId = requestAnimationFrame(updateLipSync);
            } catch (e) {
                // العمل بسلاسة في حال تعذر Web Audio
                console.warn('Real lip-sync setup note:', e);
            }
        }

        // التظليل الصوتي المتزامن كلمةً بكلمة (Karaoke Reading Highlight)
        function highlightReadingElement(containerEl, durationMs) {
            if (typeof containerEl === 'string') {
                containerEl = document.querySelector(containerEl);
            }
            if (!containerEl) return;

            if (_karaokeTimer) {
                clearInterval(_karaokeTimer);
                _karaokeTimer = null;
            }
            const prevActives = document.querySelectorAll('.karaoke-word.karaoke-active');
            prevActives.forEach(w => w.classList.remove('karaoke-active'));

            let words = containerEl.querySelectorAll('.karaoke-word');
            if (words.length === 0) {
                const childSpans = Array.from(containerEl.children).filter(el => 
                    el.tagName === 'SPAN' && el.innerText.trim().length > 0 && !(el.getAttribute('onclick') || '').includes('stopAudio')
                );
                if (childSpans.length > 0) {
                    childSpans.forEach(s => s.classList.add('karaoke-word'));
                    words = containerEl.querySelectorAll('.karaoke-word');
                } else {
                    const rawText = containerEl.innerText.trim();
                    if (!rawText) return;
                    const tokens = rawText.split(/\s+/);
                    containerEl.innerHTML = tokens.map(token => `<span class="karaoke-word">${token}</span>`).join(' ');
                    words = containerEl.querySelectorAll('.karaoke-word');
                }
            }

            if (words.length === 0) return;

            const totalDuration = durationMs || (currentAudio && currentAudio.duration && !isNaN(currentAudio.duration) ? currentAudio.duration * 1000 : words.length * 750);
            const intervalMs = Math.max(150, Math.floor(totalDuration / words.length));

            let idx = 0;
            words.forEach(w => w.classList.remove('karaoke-active'));
            words[0].classList.add('karaoke-active');

            _karaokeTimer = setInterval(() => {
                idx++;
                if (idx < words.length) {
                    words.forEach(w => w.classList.remove('karaoke-active'));
                    words[idx].classList.add('karaoke-active');
                } else {
                    clearInterval(_karaokeTimer);
                    _karaokeTimer = null;
                    setTimeout(() => {
                        words.forEach(w => w.classList.remove('karaoke-active'));
                    }, 500);
                }
            }, intervalMs);
        }

        function updateAudioControlsState(isPlaying, audioKey) {
            const btnTopStop = document.getElementById('btnTopStop');
            const btnSpeechStop = document.getElementById('btnSpeechStop');
            const floatingStopBtn = document.getElementById('floatingStopBtn');
            const isFloatingEnabled = getStoredPref('qiraati-smart-floating-stop', 'qiraati_smart_floating_stop', 'true') !== 'false';

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
                    cleanupAudioNodes(currentAudio);
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
            const voicePref = getStoredPref('qiraati-smart-voice-pref', 'qiraati_smart_voice_pref', 'integrated');
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

            // قائمة المفاتيح الصوتية الخاصة للتأكد من وجودها سواء عبر audio/*.mp3 أو window.AUDIO_DATA
            const SPECIAL_AUDIO_KEYS = new Set([
                "faseeh_blend_dada", "faseeh_blend_dar", "faseeh_blend_door", "faseeh_blend_firas", "faseeh_blend_noor",
                "faseeh_blend_wardun", "faseeh_encourage_super", "faseeh_model_ana_wa_antum", "faseeh_model_ana_wahdi",
                "faseeh_model_claps", "faseeh_phoneme_b", "faseeh_phoneme_d", "faseeh_phoneme_f", "faseeh_phoneme_m",
                "faseeh_phoneme_marboota", "faseeh_phoneme_n", "faseeh_phoneme_r", "faseeh_phoneme_s", "faseeh_phoneme_t",
                "faseeh_phoneme_tanween", "faseeh_vowels_d", "faseeh_vowels_r", "faseeh_vowels_s", "lam_phoneme_faseeh",
                "letter_ayn_salim_phoneme_faseeh", "letter_dha_phoneme_faseeh", "letter_dhad_phoneme_faseeh",
                "letter_dhal_phoneme_faseeh", "letter_f_reef_phoneme_faseeh", "letter_ghayn_phoneme_faseeh",
                "letter_h_phoneme_faseeh", "letter_ha_phoneme_faseeh", "letter_hamza_phoneme_faseeh", "letter_hamza_word_darana",
                "letter_j_phoneme_faseeh", "letter_kaf_phoneme_faseeh", "letter_kha_phoneme_faseeh", "letter_l_nabeel_phoneme_faseeh",
                "letter_q_booq_phoneme_faseeh", "letter_s_teacher_read_all", "letter_s_teacher_sentence1", "letter_s_teacher_sentence2",
                "letter_s_teacher_sentence3", "letter_s_teacher_word_baba", "letter_s_teacher_word_faris", "letter_s_teacher_word_mama",
                "letter_s_teacher_word_moosa", "letter_s_teacher_word_rasama", "letter_s_teacher_word_safara",
                "letter_sad_phoneme_faseeh", "letter_sh_phoneme_faseeh", "letter_ta_phoneme_faseeh", "letter_tha_phoneme_faseeh",
                "letter_z_phoneme_faseeh", "shaddah_phoneme_faseeh", "teacher_act5_alif_sound", "teacher_act5_all", "teacher_act5_asa",
                "teacher_act5_dar", "teacher_act5_ghazal", "teacher_act5_halwa", "teacher_act5_intro", "teacher_act5_mrma",
                "teacher_letter_d_act1_intro", "teacher_letter_d_asad", "teacher_letter_d_dalla", "teacher_letter_d_dar",
                "teacher_letter_d_deek", "teacher_letter_d_dirham", "teacher_letter_d_dood", "teacher_letter_d_dub",
                "teacher_letter_d_qidr", "teacher_letter_d_words_all", "teacher_letter_f_act1_intro", "teacher_letter_f_act7_intro",
                "teacher_letter_f_fanous", "teacher_letter_f_farasha", "teacher_letter_f_feel", "teacher_letter_f_finjan",
                "teacher_letter_f_fustan", "teacher_letter_f_miftah", "teacher_letter_f_mitaf", "teacher_letter_f_nafoora",
                "teacher_letter_f_read_all", "teacher_letter_f_read_fadi", "teacher_letter_f_read_fam", "teacher_letter_f_read_mufeed",
                "teacher_letter_f_split_dufoof", "teacher_letter_f_words_all", "teacher_letter_m_act1_intro", "teacher_letter_m_laymun",
                "teacher_letter_m_mawz", "teacher_letter_m_miftah", "teacher_letter_m_mizan", "teacher_letter_m_mizmar",
                "teacher_letter_m_murabba", "teacher_letter_m_qamh", "teacher_letter_m_thawm", "teacher_letter_m_words_all",
                "teacher_reading_act7_a_intro", "teacher_reading_act7_b_intro", "teacher_reading_baba", "teacher_reading_baba_b",
                "teacher_reading_baba_mama_boom", "teacher_reading_baba_mama_dada", "teacher_reading_boom", "teacher_reading_dada",
                "teacher_reading_mama", "teacher_reading_mama_b", "teacher_vowel_w_all", "teacher_vowel_w_buma", "teacher_vowel_w_intro",
                "teacher_vowel_w_kharuf", "teacher_vowel_w_soos", "teacher_vowel_w_tawoos", "teacher_vowel_w_usfoor", "teacher_vowel_y_all",
                "teacher_vowel_y_bisat", "teacher_vowel_y_dik", "teacher_vowel_y_halib", "teacher_vowel_y_intro", "teacher_vowel_y_rish",
                "unit2_facility_teacher", "unit2_welcome_bassel", "voice_confirm_bassel", "voice_confirm_rana", "voice_preview_bassel",
                "voice_preview_rana"
            ]);

            function hasSpecialAudioKey(k) {
                if (!k) return false;
                if (window.AUDIO_DATA) return !!window.AUDIO_DATA[k];
                return SPECIAL_AUDIO_KEYS.has(k);
            }

            if (voicePref === 'teacher') {
                if (audioKey && teacherDirectMap[audioKey] && hasSpecialAudioKey(teacherDirectMap[audioKey])) {
                    finalKey = teacherDirectMap[audioKey];
                } else if (audioKey && hasSpecialAudioKey('teacher_' + audioKey)) {
                    finalKey = 'teacher_' + audioKey;
                } else if (audioKey && hasSpecialAudioKey(audioKey + '_teacher')) {
                    finalKey = audioKey + '_teacher';
                } else if (audioKey && audioKey.startsWith('letter_s_read_')) {
                    const sCandidate = audioKey.replace('letter_s_read_', 'letter_s_teacher_');
                    if (hasSpecialAudioKey(sCandidate)) finalKey = sCandidate;
                } else if (audioKey) {
                    finalKey = audioKey;
                }
            } else if (voicePref === 'bassel') {
                if (audioKey && faseehDirectMap[audioKey] && hasSpecialAudioKey(faseehDirectMap[audioKey])) {
                    finalKey = faseehDirectMap[audioKey];
                } else if (audioKey && hasSpecialAudioKey(audioKey + '_bassel')) {
                    finalKey = audioKey + '_bassel';
                } else if (audioKey && hasSpecialAudioKey('bassel_' + audioKey)) {
                    finalKey = 'bassel_' + audioKey;
                }
            } else if (voicePref === 'rana') {
                if (audioKey && hasSpecialAudioKey(audioKey + '_rana')) finalKey = audioKey + '_rana';
                else if (audioKey && hasSpecialAudioKey('rana_' + audioKey)) finalKey = 'rana_' + audioKey;
            } else if (voicePref === 'integrated') {
                if (audioKey && (audioKey.includes('encourage') || audioKey.includes('hint') || audioKey.includes('mascot') || audioKey.includes('applause') || audioKey.includes('bassel'))) {
                    if (audioKey && faseehDirectMap[audioKey] && hasSpecialAudioKey(faseehDirectMap[audioKey])) finalKey = faseehDirectMap[audioKey];
                    else if (audioKey && hasSpecialAudioKey(audioKey + '_bassel')) finalKey = audioKey + '_bassel';
                    else if (audioKey && hasSpecialAudioKey('bassel_' + audioKey)) finalKey = 'bassel_' + audioKey;
                } else {
                    if (audioKey && hasSpecialAudioKey(audioKey + '_rana')) finalKey = audioKey + '_rana';
                    else if (audioKey && hasSpecialAudioKey('rana_' + audioKey)) finalKey = 'rana_' + audioKey;
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
                    const audio = new Audio();
                    audio.preload = "none";
                    audio.src = src;
                    currentAudio = audio;
                    applyVolumeToAudio(audio, getMasterVolume());

                    // ضبط سرعة التشغيل الطبيعية الصافية (1.0) مع خيار الإبطاء التعليمي النظيف (0.85) للمعلم
                    // وإلغاء أي تشويه أو تسريع مصطنع (No artificial pitch distortion)
                    try {
                        const isEducationalSlow = getStoredPref('qiraati-smart-slow-rate', 'qiraati_smart_slow_rate', 'false') === 'true';
                        audio.preservesPitch = true;
                        audio.playbackRate = isEducationalSlow ? 0.85 : 1.0;
                    } catch (eRate) {
                        console.warn('Audio rate adaptation note:', eRate);
                    }

                    // تفعيل مزامنة فم «فَصِيح» الحقيقية عبر Web Audio API
                    setupLipSync(audio);

                    updateAudioControlsState(true, audioKey);

                    audio.onended = () => {
                        cleanupAudioNodes(audio);
                        if (bubble) bubble.classList.remove('speaking');
                        if (avatar) avatar.classList.remove('mascot-speaking');
                        updateAudioControlsState(false);
                        if (onEndedCallback) onEndedCallback();
                    };

                    audio.onerror = () => {
                        cleanupAudioNodes(audio);
                        if (bubble) bubble.classList.remove('speaking');
                        if (avatar) avatar.classList.remove('mascot-speaking');
                        updateAudioControlsState(false);
                    };

                    audio.play().catch(e => {
                        console.log('Audio playback info:', e);
                        cleanupAudioNodes(audio);
                        updateAudioControlsState(false);
                    });
                }
            } catch (err) {
                console.error(err);
                if (currentAudio) cleanupAudioNodes(currentAudio);
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
            const v = getStoredPref('qiraati-smart-volume', 'qiraati_smart_volume', '100');
            return v ? parseInt(v, 10) : 100;
        }

        function changeMasterVolume(val) {
            val = parseInt(val, 10);
            if (isNaN(val)) val = 100;
            if (val < 0) val = 0;
            if (val > 150) val = 150;
            setStoredPref('qiraati-smart-volume', 'qiraati_smart_volume', val.toString());

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
                        audio._audioSource = source;
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
            const currentPref = getStoredPref('qiraati-smart-voice-pref', 'qiraati_smart_voice_pref', 'integrated');
            applyVoiceCardVisuals(currentPref);
            const isFloating = getStoredPref('qiraati-smart-floating-stop', 'qiraati_smart_floating_stop', 'true') !== 'false';
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
            setStoredPref('qiraati-smart-voice-pref', 'qiraati_smart_voice_pref', pref);
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
            setStoredPref('qiraati-smart-floating-stop', 'qiraati_smart_floating_stop', enabled ? 'true' : 'false');
            const floatingBtn = document.getElementById('floatingStopBtn');
            if (floatingBtn && !enabled) {
                floatingBtn.style.display = 'none';
            } else if (floatingBtn && enabled && currentAudio && !currentAudio.paused) {
                floatingBtn.style.display = 'inline-flex';
            }
        }

        function isEducationalSlowRate() {
            return getStoredPref('qiraati-smart-slow-rate', 'qiraati_smart_slow_rate', 'false') === 'true';
        }

        function setEducationalSlowRate(enabled) {
            setStoredPref('qiraati-smart-slow-rate', 'qiraati_smart_slow_rate', enabled ? 'true' : 'false');
            if (currentAudio) {
                currentAudio.preservesPitch = true;
                currentAudio.playbackRate = enabled ? 0.85 : 1.0;
            }
        }

        function mascotCelebrates() {

            const avatar = document.getElementById('mascotAvatar');

            avatar.classList.add('mascot-celebrate');

            setTimeout(() => avatar.classList.remove('mascot-celebrate'), 1500);

        }

        async function mascotInteracted() {
            mascotCelebrates();

            // فحص إمكانية استشارة فصيح الذكية بالذكاء الاصطناعي التوليدي
            if (window.AIBridge && window.AIBridge.isAvailable()) {
                const curLessonLabel = document.getElementById('currentLessonLabel')?.innerText || 'درس القراءة';
                try {
                    const tutorRes = await window.AIBridge.askFaseeh({
                        currentLesson: curLessonLabel,
                        userQuestion: 'أخبرني نصيحة مشجعة ومرحة عن هذا الحرف أو الدرس يا فصيح!',
                        learnedLetters: ['د', 'ر', 'و', 'ب', 'م', 'ن', 'ي', 'س']
                    });
                    if (tutorRes && tutorRes.reply) {
                        mascotSpeak(tutorRes.reply, 'mascot_hint');
                        return;
                    }
                } catch (e) {
                    console.warn('AI Faseeh tutor error:', e);
                }
            }

            mascotSpeak('أَنَا صَدِيقُكَ فَصِيح! اخْتَرِ الدَّرْسَ مِنَ القَائِمَةِ وَسَأُرَافِقُكَ دَائِمَاً لِنَنَالَ النُّجُوم! ⭐', 'mascot_hint');
        }

        async function askFaseehCustomQuestion(questionText) {
            mascotCelebrates();
            const curLessonLabel = document.getElementById('currentLessonLabel')?.innerText || 'درس القراءة';
            if (window.AIBridge) {
                try {
                    const tutorRes = await window.AIBridge.askFaseeh({
                        currentLesson: curLessonLabel,
                        userQuestion: questionText,
                        learnedLetters: ['د', 'ر', 'و', 'ب', 'م', 'ن', 'ي', 'س']
                    });
                    if (tutorRes && tutorRes.reply) {
                        mascotSpeak(tutorRes.reply, 'mascot_hint');
                        return tutorRes.reply;
                    }
                } catch (e) {
                    console.warn('askFaseehCustomQuestion error:', e);
                }
            }
            mascotSpeak('رَائِعٌ يَا بَطَل! اسْتَمِعْ لِصَوْتِ الحَرْفِ جَيِّداً وَرَدِّدْ مَعِي!', 'mascot_hint');
        }

        window.askFaseehCustomQuestion = askFaseehCustomQuestion;

        // ==============================================================
        // نظام التنزيل بالخلفية لملفات الأوفلاين (Background Offline Downloader)
        // إعداد وتطوير: المهندس أسامة خليل هاشم
        // ==============================================================
        let _isDownloadingOffline = false;
        async function downloadAllOfflineAssets() {
            if (_isDownloadingOffline) return;
            const btn = document.getElementById('btnDownloadOfflineAssets');
            const label = document.getElementById('btnDownloadOfflineLabel');
            const statusEl = document.getElementById('offlineDownloadStatus');
            const progressContainer = document.getElementById('offlineProgressBarContainer');
            const progressBar = document.getElementById('offlineProgressBar');

            _isDownloadingOffline = true;
            if (btn) btn.disabled = true;
            if (label) label.innerText = 'جارٍ جمع قائمة الملفات...';
            if (progressContainer) progressContainer.style.display = 'block';
            if (statusEl) statusEl.innerText = '0%';

            try {
                // تجميع كل روابط الصور من DOM و curriculum_data
                const assetsSet = new Set();
                document.querySelectorAll('img').forEach(img => {
                    const src = img.getAttribute('src');
                    if (src && !src.startsWith('data:') && !src.startsWith('http')) {
                        assetsSet.add(src);
                    }
                });

                if (window.CURRICULUM_DATA && Array.isArray(window.CURRICULUM_DATA)) {
                    window.CURRICULUM_DATA.forEach(u => {
                        if (u.lessons && Array.isArray(u.lessons)) {
                            u.lessons.forEach(l => {
                                if (l.bookPageImg) assetsSet.add(l.bookPageImg);
                                if (l.boardImg) assetsSet.add(l.boardImg);
                            });
                        }
                    });
                }

                // إضافة الأصوات الأساسية الخاصة
                if (typeof SPECIAL_AUDIO_KEYS !== 'undefined') {
                    SPECIAL_AUDIO_KEYS.forEach(k => assetsSet.add('audio/' + k + '.mp3'));
                }

                const assetsList = Array.from(assetsSet);
                const total = assetsList.length;
                let completed = 0;

                if (label) label.innerText = `جارٍ تنزيل ${total} ملفاً على دفعات...`;

                const BATCH_SIZE = 10;
                for (let i = 0; i < total; i += BATCH_SIZE) {
                    const batch = assetsList.slice(i, i + BATCH_SIZE);
                    await Promise.all(batch.map(url => {
                        return fetch(url).catch(() => null).finally(() => {
                            completed++;
                            const pct = Math.round((completed / total) * 100);
                            if (progressBar) progressBar.style.width = pct + '%';
                            if (statusEl) statusEl.innerText = `${pct}% (${completed}/${total})`;
                        });
                    }));
                }

                if (label) label.innerText = 'اكتمل التنزيل بنجاح ✅';
                if (statusEl) statusEl.innerText = `تم حفظ كافة وسائط الكتاب (${total} ملفاً) في الكاش أوفلاين بنجاح!`;
            } catch (err) {
                console.error('Offline download error:', err);
                if (label) label.innerText = 'حدث تنبيه أثناء التنزيل';
                if (statusEl) statusEl.innerText = 'تم تخزين ما تيسر من الملفات، والباقي سيُخزن تلقائياً عند فتحه.';
            } finally {
                _isDownloadingOffline = false;
                if (btn) btn.disabled = false;
            }
        }

