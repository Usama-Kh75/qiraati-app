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
            } catch(e) {}
        }

        // دالة تهريب HTML موحدة لمنع ثغرات XSS في جميع وحدات المنصة
        function qiraatiEscapeHtml(str) {
            if (str === null || str === undefined) return '';
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }
        window.qiraatiEscapeHtml = qiraatiEscapeHtml;

        // دالة قراءة كلمات لوحة الشرف في ختام الوحدتين الأولى والثانية
        function playWordRead(wordKey) {
            const WORD_READ_MAP = {
                baba:  { audio: 'letter_d_read_baba',  text: 'بَابَا (بَا + بَا) 🌟' },
                mama:  { audio: 'letter_m_read_mama',  text: 'مَامَا (مَا + مَا) 🌟' },
                dada:  { audio: 'letter_d_read_dada',  text: 'دَادَا (دَا + دَا) 🌟' },
                dar:   { audio: 'letter_d_dar',        text: 'دَارٌ 🏡' },
                firas: { audio: 'letter_s_read_word_firas', text: 'فِرَاسٌ 👦' },
                noor:  { audio: 'letter_n_read_word_noor',  text: 'نُورٌ 👧' },
                banat: { audio: 'letter_n_bint',       text: 'بَنَاتٌ 👭' },
                sarah: { audio: null,                  text: 'سَارَةُ 👩‍🎨' },
                ward:  { audio: 'faseeh_blend_wardun', text: 'وَرْدٌ 🌹' }
            };
            const item = WORD_READ_MAP[wordKey];
            if (item && item.audio) {
                if (typeof mascotSpeak === 'function') {
                    mascotSpeak(`استمع جيداً للكلمة: <b>${item.text}</b>`, item.audio);
                } else {
                    playAudio(item.audio);
                }
            } else if (item) {
                if (typeof mascotSpeak === 'function') {
                    mascotSpeak(`اقرأ معي بوضوح: <b>${item.text}</b>`, null);
                }
            } else if (wordKey) {
                playAudio(wordKey);
            }
        }
        window.playWordRead = playWordRead;

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

        function stopCurrentMediaAudio() {
            if (currentAudio) {
                try {
                    cleanupAudioNodes(currentAudio);
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                } catch(e) {}
                currentAudio = null;
            }
        }

        function stopAudio() {
            stopCurrentMediaAudio();
            if (window.FaseehVoice && typeof window.FaseehVoice.stop === 'function') {
                window.FaseehVoice.stop();
            }
            const bubble = document.getElementById('speechBubble');
            const avatar = document.getElementById('mascotAvatar');
            const mouth = document.getElementById('mascotMouth');
            if (mouth) {
                mouth.style.transform = 'scaleY(1)';
                mouth.style.transformOrigin = '80px 102px';
            }
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

        let mascotBubbleTimer = null;

        function closeMascotBubble(e) {
            if (e && e.stopPropagation) e.stopPropagation();
            if (mascotBubbleTimer) {
                clearTimeout(mascotBubbleTimer);
                mascotBubbleTimer = null;
            }
            const bubble = document.getElementById('speechBubble');
            if (bubble) {
                bubble.classList.add('bubble-hidden');
                bubble.classList.remove('speaking');
            }
        }

        function scheduleMascotBubbleAutoClose() {
            if (mascotBubbleTimer) {
                clearTimeout(mascotBubbleTimer);
                mascotBubbleTimer = null;
            }
            mascotBubbleTimer = setTimeout(() => {
                closeMascotBubble();
            }, 5000);
        }

        function toggleMascotCollapse(e) {
            if (e && e.stopPropagation) e.stopPropagation();
            const container = document.getElementById('mascotContainer');
            if (!container) return;
            const isCollapsed = container.classList.contains('collapsed');
            if (isCollapsed) {
                container.classList.remove('collapsed');
                try { localStorage.setItem('qiraati-smart-faseeh-collapsed', 'false'); } catch(err) {}
            } else {
                container.classList.add('collapsed');
                closeMascotBubble();
                try { localStorage.setItem('qiraati-smart-faseeh-collapsed', 'true'); } catch(err) {}
            }
        }

        window.closeMascotBubble = closeMascotBubble;
        window.toggleMascotCollapse = toggleMascotCollapse;

        function playAudio(audioKey, onEndedCallback) {
            mascotSpeak('', audioKey, onEndedCallback);
        }

        function playAudioSource(src, opts) {
            const options = opts || {};
            const audioKey = options.audioKey !== undefined ? options.audioKey : null;
            const onEndedCallback = typeof options.onEnded === 'function'
                ? options.onEnded
                : (typeof options.onEnd === 'function' ? options.onEnd : null);
            const onErrorCallback = typeof options.onError === 'function' ? options.onError : null;
            const bubble = document.getElementById('speechBubble');
            const avatar = document.getElementById('mascotAvatar');

            window._currentPlayingKey = audioKey;
            if (avatar) avatar.classList.add('mascot-speaking');

            try {
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

                const finalizeVisuals = () => {
                    cleanupAudioNodes(audio);
                    if (currentAudio === audio) currentAudio = null;
                    const mouth = document.getElementById('mascotMouth');
                    if (mouth) {
                        mouth.style.transform = 'scaleY(1)';
                        mouth.style.transformOrigin = '80px 102px';
                    }
                    if (bubble) bubble.classList.remove('speaking');
                    if (avatar) avatar.classList.remove('mascot-speaking');
                    updateAudioControlsState(false);
                };

                audio.onended = () => {
                    finalizeVisuals();
                    if (onEndedCallback) onEndedCallback();
                };

                audio.onerror = () => {
                    finalizeVisuals();
                    if (onErrorCallback) onErrorCallback();
                };

                audio.play().catch(e => {
                    console.log('Audio playback info:', e);
                    finalizeVisuals();
                    if (onErrorCallback) onErrorCallback();
                });
                return audio;
            } catch (err) {
                console.error(err);
                if (currentAudio) cleanupAudioNodes(currentAudio);
                currentAudio = null;
                if (bubble) bubble.classList.remove('speaking');
                if (avatar) avatar.classList.remove('mascot-speaking');
                updateAudioControlsState(false);
                if (onErrorCallback) onErrorCallback();
                return null;
            }
        }

        function mascotSpeak(text, audioKey, onEndedCallback) {
            const bubble = document.getElementById('speechBubble');
            const speechText = document.getElementById('speechText');
            const avatar = document.getElementById('mascotAvatar');

            if (text && speechText) {
                speechText.innerHTML = text;
            }
            if (text && bubble) {
                bubble.classList.remove('bubble-hidden');
                bubble.classList.add('speaking');
                scheduleMascotBubbleAutoClose();
            }

            stopCurrentMediaAudio();
            if (window.FaseehVoice && typeof window.FaseehVoice.stop === 'function') {
                window.FaseehVoice.stop();
            }

            // النطق البشري الذكي للنصوص التي لا تملك مفتاحاً مسجلاً مسبقاً (audioKey === null صراحةً)
            if (audioKey === null && text) {
                if (window.FaseehVoice && typeof window.FaseehVoice.speak === 'function') {
                    window.FaseehVoice.speak(text, { onEnded: onEndedCallback, keepBubble: true });
                } else if (typeof onEndedCallback === 'function') {
                    onEndedCallback();
                }
                return;
            }

            // استدعاء نصي مرئي فقط دون صوت
            if (!audioKey) {
                if (avatar) avatar.classList.remove('mascot-speaking');
                return;
            }

            if (avatar) avatar.classList.add('mascot-speaking');

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
                "letter_z_phoneme_faseeh", "mascot_hint", "mascot_welcome", "shaddah_phoneme_faseeh", "teacher_act5_alif_sound", "teacher_act5_all", "teacher_act5_asa",
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
                "unit2_facility_teacher", "unit2_welcome_bassel", "voice_confirm_bassel", "voice_confirm_integrated", "voice_confirm_rana", "voice_preview_bassel",
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
                } else if (audioKey && audioKey.endsWith('_sound') && hasSpecialAudioKey(audioKey.replace(/_sound$/, '_phoneme_faseeh'))) {
                    finalKey = audioKey.replace(/_sound$/, '_phoneme_faseeh');
                } else if (audioKey && hasSpecialAudioKey(audioKey + '_bassel')) {
                    finalKey = audioKey + '_bassel';
                } else if (audioKey && hasSpecialAudioKey('bassel_' + audioKey)) {
                    finalKey = 'bassel_' + audioKey;
                }
            } else if (voicePref === 'rana') {
                if (audioKey && hasSpecialAudioKey(audioKey + '_rana')) finalKey = audioKey + '_rana';
                else if (audioKey && hasSpecialAudioKey('rana_' + audioKey)) finalKey = 'rana_' + audioKey;
            } else if (voicePref === 'integrated') {
                if (audioKey && (audioKey.includes('encourage') || audioKey.includes('hint') || audioKey.includes('mascot') || audioKey.includes('applause') || audioKey.includes('bassel') || audioKey.includes('faseeh'))) {
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

            if (src) {
                playAudioSource(src, { audioKey, onEnded: onEndedCallback });
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
                if (audio._gainNode) {
                    audio._gainNode.gain.value = 1.0;
                }
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
            const avatar = document.getElementById('mascotAvatar');
            if (avatar && avatar.getAttribute('data-dragged') === 'true') return;
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
                        mascotSpeak(tutorRes.reply, null);
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
                        mascotSpeak(tutorRes.reply, null);
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

        // ==============================================================
        // تهيئة ميزات فصيح الذكية (الطي التلقائي، السحب، والإغلاق المؤقت)
        // ==============================================================
        function initMascotFeatures() {
            try {
                if (localStorage.getItem('qiraati-smart-faseeh-collapsed') === 'true') {
                    const container = document.getElementById('mascotContainer');
                    if (container) container.classList.add('collapsed');
                }
            } catch(e) {}

            // إغلاق فقاعة الترحيب تلقائياً بعد 5 ثوانٍ
            scheduleMascotBubbleAutoClose();

            // تفعيل سحب فصيح بحرية لمنع حجب نصوص أو صور كتاب القراءة
            const avatar = document.getElementById('mascotAvatar');
            const container = document.getElementById('mascotContainer');
            if (!avatar || !container) return;

            let isDragging = false;
            let startX = 0, startY = 0, origLeft = 0, origBottom = 0;
            let hasMoved = false;

            function onPointerDown(e) {
                if (e.target.closest('#btnMascotMinimize') || e.target.closest('.btn-bubble-close')) return;
                isDragging = true;
                hasMoved = false;
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;
                startX = clientX;
                startY = clientY;
                const rect = container.getBoundingClientRect();
                origLeft = rect.left;
                origBottom = window.innerHeight - rect.bottom;
            }

            function onPointerMove(e) {
                if (!isDragging) return;
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;
                const dx = clientX - startX;
                const dy = clientY - startY;
                if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
                    hasMoved = true;
                }
                if (hasMoved) {
                    let newLeft = origLeft + dx;
                    let newBottom = origBottom - dy;
                    newLeft = Math.max(10, Math.min(window.innerWidth - 110, newLeft));
                    newBottom = Math.max(10, Math.min(window.innerHeight - 140, newBottom));
                    container.style.left = `${newLeft}px`;
                    container.style.bottom = `${newBottom}px`;
                }
            }

            function onPointerUp() {
                if (isDragging && hasMoved) {
                    avatar.setAttribute('data-dragged', 'true');
                    setTimeout(() => avatar.removeAttribute('data-dragged'), 150);
                }
                isDragging = false;
            }

            avatar.addEventListener('mousedown', onPointerDown);
            window.addEventListener('mousemove', onPointerMove);
            window.addEventListener('mouseup', onPointerUp);

            avatar.addEventListener('touchstart', onPointerDown, { passive: true });
            window.addEventListener('touchmove', onPointerMove, { passive: true });
            window.addEventListener('touchend', onPointerUp);
        }

        // ==============================================================
        // محرك النطق البشري الذكي لشخصية «فَصِيح» (FaseehVoice & AudioEngine)
        // يجمع بين: 1) تسجيلات الاستوديو البشري 2) Gemini Live TTS 3) الصوت العصبي المتدرج
        // إعداد وتطوير: المهندس أسامة خليل هاشم
        // ==============================================================
        const FaseehVoice = (() => {
            let _ttsToken = 0;
            let _ttsMouthTimer = null;
            let _ttsChunkTimer = null;
            let _voicesLoaded = false;

            const WORD_AUDIO_MAP = {
                // حروف ومخارج فونيمية
                'ب': 'letter_b_sound',
                'د': 'letter_d_sound',
                'ف': 'letter_f_sound',
                'م': 'letter_m_sound',
                'ن': 'letter_n_sound',
                'ر': 'letter_r_sound',
                'س': 'letter_s_sound',
                'ت': 'letter_t_sound',
                'ط': 'letter_ta_sound',
                'ق': 'letter_q_booq_sound',
                'ل': 'letter_l_nabeel_sound',
                'ع': 'letter_ayn_salim_sound',
                'ه': 'letter_h_sound',
                'هـ': 'letter_h_sound',
                'ش': 'letter_sh_sound',
                'ز': 'letter_z_sound',
                'ج': 'letter_j_sound',
                'ص': 'letter_sad_sound',
                'ا': 'teacher_act5_alif_sound',
                'ء': 'letter_hamza_sound',
                'ض': 'letter_dhad_sound',
                'خ': 'letter_kha_sound',
                'ث': 'letter_tha_sound',
                'ك': 'letter_kaf_sound',
                'غ': 'letter_ghayn_sound',
                'ح': 'letter_ha_sound',
                'ذ': 'letter_dhal_sound',
                'ظ': 'letter_dha_sound',
                'و': 'vowel_w_sound',
                'ي': 'vowel_y_sound',
                'ى': 'vowel_y_sound',
                'ة': 'letter_marboota_sound',
                'تنوين': 'tanween_dham_sound',
                'شدة': 'shaddah_sound',
                // كلمات المنهج
                'دادا': 'faseeh_blend_dada',
                'بابا': 'letter_d_read_baba',
                'ماما': 'letter_m_read_mama',
                'دار': 'faseeh_blend_dar',
                'دور': 'faseeh_blend_door',
                'نور': 'faseeh_blend_noor',
                'فراس': 'faseeh_blend_firas',
                'ورد': 'faseeh_blend_wardun',
                'بوق': 'letter_q_booq_word_booq',
                'ريف': 'letter_f_reef_word_reef',
                'بط': 'letter_ta_word_bat',
                'صلاح': 'letter_h_word_salah',
                'شامل': 'letter_sh_word_shamil',
                'ميزان': 'letter_z_word_mizan',
                'فرج': 'letter_j_word_faraj',
                'طيارة': 'letter_sad_word_tayyarah',
                'ارنب': 'letter_hamza_word_arnab',
                'حوض': 'letter_dhad_word_hawd',
                'خروف': 'vowel_w_kharuf',
                'ثمار': 'letter_tha_word_thimaar',
                'كتاب': 'item_kitab',
                'غزال': 'letter_z_word_ghazal',
                'هدهد': 'letter_ha_word_hudhud',
                'ذئب': 'letter_dhal_word_dhib',
                'ظبي': 'letter_dha_word_zaby',
                'شمس': 'lam_word_ashams',
                'الشمس': 'lam_word_ashams',
                'قمر': 'lam_word_alqamar',
                'القمر': 'lam_word_alqamar',
                // عبارات فصيح المعيارية
                'ممتاز يا بطل': 'faseeh_encourage_super',
                'اهلا بكم في منصة قراءتي الذكية': 'mascot_welcome'
            };

            const ISOLATED_LETTER_NAMES = {
                'ا': 'أَلِفْ', 'أ': 'أَلِفْ هَمْزَة', 'إ': 'أَلِفْ مَكْسُورَة', 'آ': 'أَلِفْ مَمْدُودَة', 'ء': 'هَمْزَة',
                'ب': 'بَاءْ', 'ت': 'تَاءْ', 'ث': 'ثَاءْ', 'ج': 'جِيمْ', 'ح': 'حَاءْ', 'خ': 'خَاءْ',
                'د': 'دَالْ', 'ذ': 'ذَالْ', 'ر': 'رَاءْ', 'ز': 'زَايْ', 'س': 'سِينْ', 'ش': 'شِينْ',
                'ص': 'صَادْ', 'ض': 'ضَادْ', 'ط': 'طَاءْ', 'ظ': 'ظَاءْ', 'ع': 'عَيْنْ', 'غ': 'غَيْنْ',
                'ف': 'فَاءْ', 'ق': 'قَافْ', 'ك': 'كَافْ', 'ل': 'لَامْ', 'م': 'مِيمْ', 'ن': 'نُونْ',
                'ه': 'هَاءْ', 'هـ': 'هَاءْ', 'ة': 'تَاءْ مَرْبُوطَة', 'و': 'وَاوْ', 'ي': 'يَاءْ', 'ى': 'أَلِفْ مَقْصُورَة'
            };

            function stripHtmlAndEmoji(raw) {
                if (!raw) return '';
                let s = String(raw);
                s = s.replace(/<br\s*\/?>/gi, '، ')
                    .replace(/<\/(p|div|li|h[1-6])>/gi, '، ')
                    .replace(/<[^>]*>/g, ' ')
                    .replace(/&nbsp;/gi, ' ')
                    .replace(/&amp;/gi, ' و ')
                    .replace(/&quot;|&apos;|&#39;|&lt;|&gt;/gi, ' ');
                // إزالة الرموز التعبيرية والعناصر الزخرفية مع إبقاء العربية والأرقام وعلامات الترقيم
                try {
                    s = s.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\uFE00-\uFE0F\u200D]/gu, ' ');
                } catch (e) {
                    s = s.replace(/[\uD800-\uDFFF]/g, ' ');
                }
                return s.replace(/[*_`#~|]+/g, ' ').replace(/\s+/g, ' ').trim();
            }

            function normalizeArabicForAudio(raw) {
                let s = stripHtmlAndEmoji(raw);
                // إزالة التشكيل والمدّة وعلامات الترقيم
                s = s.replace(/[\u064B-\u065F\u0670\u0640]/g, '')
                    .replace(/[أإآٱ]/g, 'ا')
                    .replace(/[^\u0621-\u064A0-9\s]/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim();
                if (s.startsWith('حرف ')) {
                    const rest = s.slice(4).trim();
                    if (WORD_AUDIO_MAP[rest]) return rest;
                }
                return s;
            }

            function prepareArabicSpeechText(raw) {
                let s = stripHtmlAndEmoji(raw);
                s = s.replace(/\s*\+\s*/g, ' وَ ')
                    .replace(/\s*\/\s*/g, '، أَوْ ')
                    .replace(/[←→↔⇒⇐]/g, '، ')
                    .replace(/[:؛]+/g, '، ');

                // إذا كان النص حرفاً منفرداً فقط لتفادي التهجئة الآلية الخشنة
                const bareNoMarks = s.replace(/[\u064B-\u065F\u0670\u0640]/g, '').trim();
                if (ISOLATED_LETTER_NAMES[bareNoMarks]) {
                    return 'حَرْفُ ' + ISOLATED_LETTER_NAMES[bareNoMarks];
                }

                // تحويل صيغ "حرف د" إلى "حرف الدال" لنطق طبيعي وسليم
                s = s.replace(/(^|\s)حَرْفُ?\s+([\u0621-\u064A])(\s|[،.؟!]|$)/g, (m, p1, ch, p3) => {
                    const nm = ISOLATED_LETTER_NAMES[ch];
                    return nm ? `${p1}حَرْفُ ${nm}${p3}` : m;
                });

                return s.replace(/\s+/g, ' ').trim();
            }

            function splitArabicSpeechChunks(text) {
                if (!text) return [];
                const rawParts = text.split(/(?<=[.!؟؛،\n])\s+/).map(p => p.trim()).filter(Boolean);
                const merged = [];
                for (const part of rawParts) {
                    if (merged.length > 0 && part.split(/\s+/).length < 3 && (merged[merged.length - 1].length + part.length) < 125) {
                        merged[merged.length - 1] += ' ' + part;
                    } else if (part.length > 150) {
                        const words = part.split(/\s+/);
                        let buf = '';
                        for (const w of words) {
                            if ((buf + ' ' + w).trim().length > 130 && buf) {
                                merged.push(buf.trim());
                                buf = w;
                            } else {
                                buf = (buf + ' ' + w).trim();
                            }
                        }
                        if (buf) merged.push(buf);
                    } else {
                        merged.push(part);
                    }
                }
                return merged.length > 0 ? merged : [text];
            }

            function selectBestArabicVoice() {
                if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
                const voices = window.speechSynthesis.getVoices() || [];
                const arVoices = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith('ar'));
                if (arVoices.length === 0) return null;

                let best = null;
                let bestScore = -999;
                for (const v of arVoices) {
                    const name = (v.name || '').toLowerCase();
                    const lang = (v.lang || '').toLowerCase();
                    let score = 0;
                    if (/natural|neural|online/.test(name)) score += 120;
                    if (/google/.test(name)) score += 90;
                    if (/hamed|bassel|shakir|maged|tarik|naayf|salman|omar|zayd|fahed|jamal|ayman|rami/.test(name)) score += 45;
                    if (/zariyah|rana|salma|noura|laila|mariam|hoda|amina/.test(name)) score += 25;
                    if (lang === 'ar-iq') score += 20;
                    else if (/ar-sa|ar-eg|ar-ae|ar-jo/.test(lang)) score += 12;
                    if (/espeak|rhvoice|festival|android/.test(name) && !/google|natural/.test(name)) score -= 200;
                    if (!v.localService) score += 10;
                    if (score > bestScore) {
                        bestScore = score;
                        best = v;
                    }
                }
                return best;
            }

            if (typeof window !== 'undefined' && 'speechSynthesis' in window && !_voicesLoaded) {
                _voicesLoaded = true;
                try {
                    window.speechSynthesis.getVoices();
                    if (typeof window.speechSynthesis.addEventListener === 'function') {
                        window.speechSynthesis.addEventListener('voiceschanged', () => {
                            window.speechSynthesis.getVoices();
                        });
                    }
                } catch (e) {}
            }

            function stopTtsTimersAndMouth() {
                if (_ttsMouthTimer) {
                    clearInterval(_ttsMouthTimer);
                    _ttsMouthTimer = null;
                }
                if (_ttsChunkTimer) {
                    clearTimeout(_ttsChunkTimer);
                    _ttsChunkTimer = null;
                }
                const mouth = document.getElementById('mascotMouth');
                if (mouth) {
                    mouth.style.transform = 'scaleY(1)';
                    mouth.style.transformOrigin = '80px 102px';
                }
            }

            function startOrganicMouthAnim(token) {
                stopTtsTimersAndMouth();
                const avatar = document.getElementById('mascotAvatar');
                const mouth = document.getElementById('mascotMouth');
                if (avatar) avatar.classList.add('mascot-speaking');
                let step = 0;
                _ttsMouthTimer = setInterval(() => {
                    if (token !== _ttsToken) {
                        stopTtsTimersAndMouth();
                        return;
                    }
                    step++;
                    if (mouth) {
                        const wave = 1.08 + Math.abs(Math.sin(step * 1.15) * 0.34 + Math.cos(step * 0.7) * 0.12);
                        mouth.style.transformOrigin = '80px 102px';
                        mouth.style.transform = `scaleY(${wave.toFixed(2)})`;
                    }
                }, 115);
            }

            function stop() {
                _ttsToken++;
                stopTtsTimersAndMouth();
                if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                    try {
                        window.speechSynthesis.cancel();
                    } catch (e) {}
                }
                if (!currentAudio) {
                    const bubble = document.getElementById('speechBubble');
                    const avatar = document.getElementById('mascotAvatar');
                    if (bubble) bubble.classList.remove('speaking');
                    if (avatar) avatar.classList.remove('mascot-speaking');
                    updateAudioControlsState(false);
                }
            }

            function speakWithBrowserNeuralFallback(text, token, opts, doneCb) {
                if (token !== _ttsToken) return Promise.resolve({ mode: 'cancelled' });
                if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
                    doneCb();
                    return Promise.resolve({ mode: 'none' });
                }

                const prepared = prepareArabicSpeechText(text);
                if (!prepared) {
                    doneCb();
                    return Promise.resolve({ mode: 'empty' });
                }

                const chunks = splitArabicSpeechChunks(prepared);
                const voice = selectBestArabicVoice();
                const isSlow = isEducationalSlowRate();
                const rate = typeof opts.rate === 'number' ? opts.rate : (isSlow ? 0.78 : 0.90);
                const pitch = typeof opts.pitch === 'number' ? opts.pitch : 1.03;
                const vol = Math.min(1.0, Math.max(0.0, getMasterVolume() / 100));

                return new Promise(resolve => {
                    let idx = 0;
                    let finished = false;
                    const bubble = document.getElementById('speechBubble');
                    const avatar = document.getElementById('mascotAvatar');

                    function finishAll(modeLabel) {
                        if (finished) return;
                        finished = true;
                        stopTtsTimersAndMouth();
                        if (token === _ttsToken) {
                            if (bubble) bubble.classList.remove('speaking');
                            if (avatar) avatar.classList.remove('mascot-speaking');
                            updateAudioControlsState(false);
                            doneCb();
                        }
                        resolve({ mode: modeLabel || 'speechSynthesis' });
                    }

                    function nextChunk() {
                        if (token !== _ttsToken) {
                            finishAll('cancelled');
                            return;
                        }
                        if (idx >= chunks.length) {
                            finishAll('speechSynthesis');
                            return;
                        }
                        const utter = new SpeechSynthesisUtterance(chunks[idx]);
                        utter.lang = (voice && voice.lang) ? voice.lang : (opts.lang || 'ar-SA');
                        if (voice) utter.voice = voice;
                        utter.rate = rate;
                        utter.pitch = pitch;
                        utter.volume = vol;

                        utter.onstart = () => {
                            if (token !== _ttsToken) return;
                            updateAudioControlsState(true, 'faseeh_speech');
                            startOrganicMouthAnim(token);
                        };
                        utter.onend = () => {
                            if (token !== _ttsToken) {
                                finishAll('cancelled');
                                return;
                            }
                            idx++;
                            if (idx < chunks.length) {
                                // وقفة تنفس طبيعية قصيرة بين الجمل تمنع السرد الآلي المتلاحق
                                _ttsChunkTimer = setTimeout(nextChunk, 150);
                            } else {
                                finishAll('speechSynthesis');
                            }
                        };
                        utter.onerror = () => {
                            if (token !== _ttsToken) {
                                finishAll('cancelled');
                                return;
                            }
                            idx++;
                            if (idx < chunks.length) {
                                _ttsChunkTimer = setTimeout(nextChunk, 90);
                            } else {
                                finishAll('speechSynthesis_fallback');
                            }
                        };

                        try {
                            window.speechSynthesis.speak(utter);
                        } catch (e) {
                            finishAll('speechSynthesis_error');
                        }
                    }

                    try {
                        window.speechSynthesis.cancel();
                    } catch (e) {}
                    updateAudioControlsState(true, 'faseeh_speech');
                    nextChunk();
                });
            }

            async function speak(text, opts) {
                const options = opts || {};
                const onEndedCb = typeof options.onEnded === 'function'
                    ? options.onEnded
                    : (typeof options.onEnd === 'function' ? options.onEnd : () => {});

                stopCurrentMediaAudio();
                _ttsToken++;
                const myToken = _ttsToken;
                stopTtsTimersAndMouth();
                if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                    try { window.speechSynthesis.cancel(); } catch (e) {}
                }

                if (!text || !String(text).trim()) {
                    onEndedCb();
                    return { mode: 'empty' };
                }

                // 1) مطابقة الكلمات والحروف المسجلة بالصوت البشري التوليدي الدافئ (أوفلاين 100% وزمن استجابة صفر)
                const normalized = normalizeArabicForAudio(text);
                const mappedKey = !options.preferLive ? WORD_AUDIO_MAP[normalized] : null;
                if (mappedKey) {
                    const mappedSrc = (window.AUDIO_DATA && window.AUDIO_DATA[mappedKey])
                        ? window.AUDIO_DATA[mappedKey]
                        : `audio/${mappedKey}.mp3`;
                    return await new Promise(resolve => {
                        let resolved = false;
                        const finishMp3 = (info) => {
                            if (resolved) return;
                            resolved = true;
                            resolve(info);
                        };
                        playAudioSource(mappedSrc, {
                            audioKey: mappedKey,
                            onEnded: () => {
                                onEndedCb();
                                finishMp3({ mode: 'mp3', key: mappedKey });
                            },
                            onError: () => {
                                if (myToken !== _ttsToken) {
                                    finishMp3({ mode: 'cancelled' });
                                    return;
                                }
                                speakWithBrowserNeuralFallback(text, myToken, options, onEndedCb).then(finishMp3);
                            }
                        });
                    });
                }

                // 2) النطق الحي الذكي عبر Gemini TTS إذا كان الخادم المحلي متاحاً
                const cleanForAi = stripHtmlAndEmoji(text);
                if (cleanForAi.length > 0 && cleanForAi.length <= 450
                    && window.AIBridge && typeof window.AIBridge.speakWithFaseeh === 'function'
                    && (!window.AIBridge.isAvailable || window.AIBridge.isAvailable())) {
                    try {
                        const aiRes = await window.AIBridge.speakWithFaseeh(cleanForAi);
                        if (myToken !== _ttsToken) return { mode: 'cancelled' };
                        const aiUri = typeof aiRes === 'string'
                            ? aiRes
                            : (aiRes && (aiRes.audioDataUri || aiRes.dataUri || aiRes.audio || aiRes.url || aiRes.audioUrl));
                        if (aiUri) {
                            return await new Promise(resolve => {
                                let resolved = false;
                                const finishAi = (info) => {
                                    if (resolved) return;
                                    resolved = true;
                                    resolve(info);
                                };
                                playAudioSource(aiUri, {
                                    audioKey: 'faseeh_ai_tts',
                                    onEnded: () => {
                                        onEndedCb();
                                        finishAi({ mode: 'gemini_tts' });
                                    },
                                    onError: () => {
                                        if (myToken !== _ttsToken) {
                                            finishAi({ mode: 'cancelled' });
                                            return;
                                        }
                                        speakWithBrowserNeuralFallback(text, myToken, options, onEndedCb).then(finishAi);
                                    }
                                });
                            });
                        }
                    } catch (e) {
                        console.warn('Faseeh AI TTS fallback note:', e);
                        if (myToken !== _ttsToken) return { mode: 'cancelled' };
                    }
                }

                // 3) الصوت العصبي المتدرج للمتصفح عند العمل أوفلاين
                return await speakWithBrowserNeuralFallback(text, myToken, options, onEndedCb);
            }

            return {
                speak,
                stop,
                normalizeArabicForAudio,
                WORD_AUDIO_MAP
            };
        })();

        const AudioEngine = {
            speakWord(word, opts) {
                return FaseehVoice.speak(word, opts);
            },
            playSystemTone(type) {
                try {
                    const AudioCtx = window.AudioContext || window.webkitAudioContext;
                    if (!AudioCtx) return;
                    if (!window._sharedAudioCtx) {
                        window._sharedAudioCtx = new AudioCtx();
                    }
                    const ctx = window._sharedAudioCtx;
                    if (ctx.state === 'suspended') ctx.resume();

                    const now = ctx.currentTime;
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    const volScale = Math.max(0.05, Math.min(1.0, getMasterVolume() / 100)) * 0.14;

                    if (type === 'success' || type === 'correct' || type === 'win') {
                        osc.type = 'sine';
                        osc.frequency.setValueAtTime(523.25, now);
                        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.16);
                        gain.gain.setValueAtTime(volScale, now);
                        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
                        osc.connect(gain);
                        gain.connect(ctx.destination);
                        osc.start(now);
                        osc.stop(now + 0.3);
                    } else if (type === 'error' || type === 'wrong') {
                        osc.type = 'triangle';
                        osc.frequency.setValueAtTime(290, now);
                        osc.frequency.exponentialRampToValueAtTime(195, now + 0.18);
                        gain.gain.setValueAtTime(volScale, now);
                        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
                        osc.connect(gain);
                        gain.connect(ctx.destination);
                        osc.start(now);
                        osc.stop(now + 0.25);
                    } else {
                        osc.type = 'sine';
                        osc.frequency.setValueAtTime(640, now);
                        gain.gain.setValueAtTime(volScale * 0.7, now);
                        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
                        osc.connect(gain);
                        gain.connect(ctx.destination);
                        osc.start(now);
                        osc.stop(now + 0.09);
                    }
                } catch (e) {}
            }
        };

        function playFaseehVoiceShowcase() {
            const showcaseText = '👨‍🏫 <b>عَرْضُ صَوْتِ «فَصِيح» الْجَدِيدِ (Gemini Natural Voice):</b><br>«أَنَا وَحْدِي: أَنْظُرُ إِلَى الْكَلِمَة... دَا... دَا... دَادَا!» 🌟';
            if (typeof playAudio === 'function') {
                mascotSpeak(showcaseText, 'faseeh_model_ana_wahdi', () => {
                    setTimeout(() => {
                        if (!currentAudio) {
                            mascotSpeak('مُمْتَازٌ يَا بَطَل! نُطْقٌ دَافِئٌ وَفَصِيحٌ 100% بِمَخَارِجِ الْحُرُوفِ الْعَرَبِيَّةِ الصَّحِيحَةِ! ⭐', 'faseeh_encourage_super');
                        }
                    }, 300);
                });
            }
        }

        window.FaseehVoice = FaseehVoice;
        window.AudioEngine = AudioEngine;
        window.playFaseehVoiceShowcase = playFaseehVoiceShowcase;
        window.mascotSpeak = mascotSpeak;
        window.playAudio = playAudio;
        window.stopAudio = stopAudio;

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initMascotFeatures);
        } else {
            initMascotFeatures();
        }

