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
                sarah: { audio: 'word_sarah',          text: 'سَارَةُ 👩‍🎨' },
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

            // تحديد الصوت بناءً على تفضيلات الضبط (المعلم باسل الافتراضي / المعلمة رنا / الوضع التكاملي / صوت المعلمة الميداني الحقيقي)
            const voicePref = getStoredPref('qiraati-smart-voice-pref', 'qiraati_smart_voice_pref', 'bassel');
            const AUDIO_KEY_ALIASES = {
                sound_alif: 'phoneme_pure_alif',
                vowel_a_sound: 'phoneme_pure_alif',
                sound_ba: 'phoneme_pure_baa',
                letter_b: 'phoneme_pure_baa',
                sound_ta: 'phoneme_pure_taa',
                sound_tha: 'phoneme_pure_thaa',
                sound_ja: 'phoneme_pure_jeem',
                sound_jeem: 'phoneme_pure_jeem',
                sound_ha: 'phoneme_pure_haa',
                sound_kha: 'phoneme_pure_khaa',
                sound_da: 'phoneme_pure_dal',
                sound_dha: 'phoneme_pure_dhal',
                sound_dhal: 'phoneme_pure_dhal',
                sound_ra: 'phoneme_pure_raa',
                sound_za: 'phoneme_pure_zay',
                sound_sa: 'phoneme_pure_seen',
                sound_sha: 'phoneme_pure_sheen',
                sound_sheen: 'phoneme_pure_sheen',
                sound_sad: 'phoneme_pure_sad',
                sound_dad: 'phoneme_pure_dhad',
                sound_dhad: 'phoneme_pure_dhad',
                sound_taa: 'phoneme_pure_ta',
                sound_ta_heavy: 'phoneme_pure_ta',
                sound_dhaa: 'phoneme_pure_dha',
                sound_dha_heavy: 'phoneme_pure_dha',
                sound_ain: 'phoneme_pure_ayn',
                sound_ghain: 'phoneme_pure_ghayn',
                sound_fa: 'phoneme_pure_faa',
                sound_qa: 'phoneme_pure_qaf',
                letter_qaf: 'phoneme_pure_qaf',
                sound_ka: 'phoneme_pure_kaf',
                sound_la: 'phoneme_pure_lam',
                sound_ma: 'phoneme_pure_meem',
                sound_na: 'phoneme_pure_noon',
                sound_haa: 'phoneme_pure_ha',
                sound_wa: 'phoneme_pure_waw',
                sound_ya: 'phoneme_pure_yaa',
                sound_du: 'word_dood',
                sound_di: 'word_nadeem',
                marboota_sound: 'letter_marboota_sound'
            };
            if (audioKey && AUDIO_KEY_ALIASES[audioKey]) {
                audioKey = AUDIO_KEY_ALIASES[audioKey];
            }
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

            // جدول المطابقة الدقيقة لتحويل أصوات فصيح والأستاذ باسل (توجيه البطاقات لمكتبة الفونيمات النقية الـ 28)
            const faseehDirectMap = {
                'word_dada': 'faseeh_blend_dada',
                'letter_d_read_dada': 'faseeh_blend_dada',
                'letter_d_read_baba': 'faseeh_blend_baba',
                'letter_m_read_mama': 'faseeh_blend_mama',
                'letter_r_read_dar': 'faseeh_blend_dar',
                'act5_dar': 'faseeh_blend_dar',
                'letter_d_read_door': 'faseeh_blend_door',
                'letter_n_read_noor': 'faseeh_blend_noor',
                'letter_s_read_word_firas': 'faseeh_blend_firas',
                'tanween_dham_read_ward': 'faseeh_blend_wardun',
                'tanween_dham_word_wardun': 'faseeh_blend_wardun',
                'letter_q_booq_word_booq': 'faseeh_blend_booq',
                'letter_ta_word_bat': 'faseeh_blend_bat',
                'item_qitar': 'faseeh_blend_qitar',
                'letter_z_word_ghazal': 'faseeh_blend_ghazal',
                'letter_ha_word_miah': 'faseeh_blend_miah',
                'letter_ayn_salim_word_salim': 'faseeh_word_salim',
                'letter_ha_word_nabeeh': 'faseeh_word_nabeeh',
                'letter_hamza_sound': 'phoneme_pure_alif',
                'letter_b_sound': 'phoneme_pure_baa',
                'letter_t_sound': 'phoneme_pure_taa',
                'letter_tha_sound': 'phoneme_pure_thaa',
                'letter_j_sound': 'phoneme_pure_jeem',
                'letter_h_sound': 'phoneme_pure_haa',
                'letter_kha_sound': 'phoneme_pure_khaa',
                'letter_d_sound': 'phoneme_pure_dal',
                'letter_dhal_sound': 'phoneme_pure_dhal',
                'letter_r_sound': 'phoneme_pure_raa',
                'letter_z_sound': 'phoneme_pure_zay',
                'letter_s_sound': 'phoneme_pure_seen',
                'letter_sh_sound': 'phoneme_pure_sheen',
                'letter_sad_sound': 'phoneme_pure_sad',
                'letter_dhad_sound': 'phoneme_pure_dhad',
                'letter_ta_sound': 'phoneme_pure_ta',
                'letter_dha_sound': 'phoneme_pure_dha',
                'letter_ayn_salim_sound': 'phoneme_pure_ayn',
                'letter_ghayn_sound': 'phoneme_pure_ghayn',
                'letter_f_sound': 'phoneme_pure_faa',
                'letter_f_reef_sound': 'phoneme_pure_faa',
                'letter_q_booq_sound': 'phoneme_pure_qaf',
                'letter_kaf_sound': 'phoneme_pure_kaf',
                'letter_l_nabeel_sound': 'phoneme_pure_lam',
                'letter_m_sound': 'phoneme_pure_meem',
                'letter_n_sound': 'phoneme_pure_noon',
                'letter_ha_sound': 'phoneme_pure_ha',
                'vowel_w_sound': 'phoneme_pure_waw',
                'vowel_y_sound': 'phoneme_pure_yaa',
                'marboota_sound': 'letter_marboota_sound',
                'letter_marboota_sound': 'letter_marboota_sound',
                'tanween_dham_sound': 'tanween_dham_sound',
                'shaddah_sound': 'shaddah_sound',
                'letter_d_vowels_intro': 'faseeh_vowels_d',
                'letter_r_vowels_intro': 'faseeh_vowels_r',
                'letter_s_vowels_intro': 'faseeh_vowels_s'
            };

            // قائمة المفاتيح الصوتية الخاصة للتأكد من وجودها سواء عبر audio/*.mp3 أو window.AUDIO_DATA
            const SPECIAL_AUDIO_KEYS = new Set([
                "applause", "hint_draw",
                "faseeh_blend_baba", "faseeh_blend_bat", "faseeh_blend_booq", "faseeh_blend_dada", "faseeh_blend_dar",
                "faseeh_blend_door", "faseeh_blend_firas", "faseeh_blend_ghazal", "faseeh_blend_mama", "faseeh_blend_miah",
                "faseeh_blend_noor", "faseeh_blend_qitar", "faseeh_blend_wardun", "faseeh_encourage_super",
                "faseeh_model_ana_wa_antum", "faseeh_model_ana_wahdi", "faseeh_model_claps", "faseeh_phoneme_b",
                "faseeh_phoneme_d", "faseeh_phoneme_f", "faseeh_phoneme_m", "faseeh_phoneme_marboota", "faseeh_phoneme_n",
                "faseeh_phoneme_r", "faseeh_phoneme_s", "faseeh_phoneme_t", "faseeh_phoneme_tanween", "faseeh_vowels_d",
                "faseeh_vowels_r", "faseeh_vowels_s", "faseeh_word_nabeeh", "faseeh_word_salim", "faseeh_word_zaytoon",
                "game_lam_w1", "game_lam_w2", "game_lam_w3", "game_lam_w4", "game_lam_w5", "game_lam_w6",
                "game_lam_w7", "game_lam_w8", "game_lam_w9", "game_lam_w10", "game_lam_w11", "game_lam_w12",
                "game_quiz_q1", "game_quiz_q2", "game_quiz_q3", "game_quiz_q4", "game_quiz_q5",
                "game_quiz_q6", "game_quiz_q7", "game_quiz_q8", "game_quiz_q9", "game_quiz_q10",
                "lam_phoneme_faseeh", "letter_ayn_salim_phoneme_faseeh", "letter_dha_phoneme_faseeh", "letter_dhad_phoneme_faseeh",
                "letter_dhal_phoneme_faseeh", "letter_f_reef_phoneme_faseeh", "letter_ghayn_phoneme_faseeh",
                "letter_h_phoneme_faseeh", "letter_ha_phoneme_faseeh", "letter_hamza_phoneme_faseeh", "letter_hamza_word_darana",
                "letter_j_phoneme_faseeh", "letter_kaf_phoneme_faseeh", "letter_kha_phoneme_faseeh", "letter_l_nabeel_phoneme_faseeh",
                "letter_marboota_sound", "letter_q_booq_phoneme_faseeh", "letter_s_teacher_read_all", "letter_s_teacher_sentence1",
                "letter_s_teacher_sentence2", "letter_s_teacher_sentence3", "letter_s_teacher_word_baba", "letter_s_teacher_word_faris",
                "letter_s_teacher_word_mama", "letter_s_teacher_word_moosa", "letter_s_teacher_word_rasama", "letter_s_teacher_word_safara",
                "letter_sad_phoneme_faseeh", "letter_sh_phoneme_faseeh", "letter_ta_phoneme_faseeh", "letter_tha_phoneme_faseeh",
                "letter_z_phoneme_faseeh", "mascot_hint", "mascot_welcome",
                "phoneme_pure_alif", "phoneme_pure_baa", "phoneme_pure_taa", "phoneme_pure_thaa", "phoneme_pure_jeem",
                "phoneme_pure_haa", "phoneme_pure_khaa", "phoneme_pure_dal", "phoneme_pure_dhal", "phoneme_pure_raa",
                "phoneme_pure_zay", "phoneme_pure_seen", "phoneme_pure_sheen", "phoneme_pure_sad", "phoneme_pure_dhad",
                "phoneme_pure_ta", "phoneme_pure_dha", "phoneme_pure_ayn", "phoneme_pure_ghayn", "phoneme_pure_faa",
                "phoneme_pure_qaf", "phoneme_pure_kaf", "phoneme_pure_lam", "phoneme_pure_meem", "phoneme_pure_noon",
                "phoneme_pure_ha", "phoneme_pure_waw", "phoneme_pure_yaa",
                "rt_convo_asking_help_partner", "rt_convo_feedback_correct", "rt_convo_feedback_retry",
                "rt_convo_greeting_partner", "rt_convo_picture_desc_partner",
                "rt_play_baqar_basim_l1", "rt_play_baqar_basim_l2", "rt_play_baqar_basim_l3", "rt_play_baqar_basim_l4", "rt_play_baqar_basim_l5",
                "rt_play_classroom_love_l1", "rt_play_classroom_love_l2", "rt_play_classroom_love_l3", "rt_play_classroom_love_l4", "rt_play_classroom_love_l5",
                "rt_play_crow_smart_l1", "rt_play_crow_smart_l2", "rt_play_crow_smart_l3", "rt_play_crow_smart_l4", "rt_play_crow_smart_l5", "rt_play_crow_smart_l6",
                "rt_play_dar_dada_l1", "rt_play_dar_dada_l2", "rt_play_dar_dada_l3", "rt_play_dar_dada_l4", "rt_play_dar_dada_l5",
                "rt_play_matar_bulbul_l1", "rt_play_matar_bulbul_l2", "rt_play_matar_bulbul_l3", "rt_play_matar_bulbul_l4", "rt_play_matar_bulbul_l5",
                "rt_play_mizan_qaddouri_l1", "rt_play_mizan_qaddouri_l2", "rt_play_mizan_qaddouri_l3", "rt_play_mizan_qaddouri_l4", "rt_play_mizan_qaddouri_l5",
                "sentence_booq_nadeem", "sentence_dar_noor",
                "shaddah_phoneme_faseeh", "shaddah_sound",
                "ss_basim_countryside_p1", "ss_basim_countryside_p2", "ss_basim_countryside_p3",
                "ss_ch_crow_water_prompt", "ss_ch_crow_water_win", "ss_ch_mazin_horn_prompt", "ss_ch_mazin_horn_win",
                "ss_ch_qaddoori_scale_prompt", "ss_ch_qaddoori_scale_win",
                "ss_clever_crow_p1", "ss_clever_crow_p2", "ss_clever_crow_p3", "ss_clever_crow_p4",
                "ss_default_story_p1", "ss_default_story_p2", "ss_default_story_p3",
                "ss_faseeh_dada_p1", "ss_faseeh_dada_p2", "ss_faseeh_dada_p3", "ss_faseeh_dada_p4",
                "ss_mazin_horn_p1", "ss_mazin_horn_p2", "ss_mazin_horn_p3",
                "ss_qaddoori_scale_p1", "ss_qaddoori_scale_p2", "ss_qaddoori_scale_p3",
                "story_dada_rabab", "story_mizan_qaddouri", "story_reef_manaf", "story_school_pupil", "story_swimming_pool",
                "syl_baa", "syl_bu", "syl_daa", "syl_doo", "syl_maa", "syl_noo", "syl_ree",
                "tanween_dham_sound",
                "teacher_act5_alif_sound", "teacher_act5_all", "teacher_act5_asa",
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
                "voice_preview_rana",
                "word_alam", "word_athath", "word_bab", "word_babu", "word_ban", "word_banat", "word_baqar", "word_batt",
                "word_bilad", "word_booq", "word_dar", "word_dari", "word_dawr", "word_deena", "word_dhubab", "word_dood",
                "word_door", "word_fallah", "word_firas", "word_ghazal", "word_ghurab", "word_haql", "word_hawdh", "word_hilal",
                "word_himar", "word_jaddi", "word_jamal", "word_khaleelin", "word_khayma", "word_kitab", "word_mahfooth", "word_maktaba",
                "word_mama", "word_manaf", "word_matar", "word_mazin", "word_mizan", "word_muntadhar", "word_muroor", "word_naam",
                "word_nabeel", "word_nadeem", "word_nakhl", "word_nameer", "word_natheef", "word_noor", "word_nouri", "word_qaddouri",
                "word_qalam", "word_qitar", "word_reef", "word_reem", "word_sabeel", "word_salah", "word_salma", "word_sarah",
                "word_shurti", "word_tariq", "word_tayyar", "word_tayyarah", "word_tuyoor", "word_ustadh", "word_ward", "word_wazz",
                "word_wazzan", "word_zoraq"
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
            const currentPref = getStoredPref('qiraati-smart-voice-pref', 'qiraati_smart_voice_pref', 'bassel');
            applyVoiceCardVisuals(currentPref);
            const isFloating = getStoredPref('qiraati-smart-floating-stop', 'qiraati_smart_floating_stop', 'true') !== 'false';
            const chk = document.getElementById('chkFloatingStop');
            if (chk) chk.checked = isFloating;
            const curVol = getMasterVolume();
            const setSlider = document.getElementById('settingsVolSlider');
            if (setSlider) setSlider.value = curVol;
            const setBadge = document.getElementById('settingsVolBadge');
            if (setBadge) setBadge.innerText = curVol + '%';
            if (window.ThemeManager && typeof window.ThemeManager.syncUI === 'function') {
                window.ThemeManager.syncUI();
            }
            if (window.StudentProgress && typeof window.StudentProgress.updateSettingsUI === 'function') {
                window.StudentProgress.updateSettingsUI();
            }
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
                msg = '👩‍🏫 تم اعتماد صوت <b>(المعلمة رنا)</b> للأصوات البديلة وقراءات المفردات!';
            } else if (pref === 'bassel') {
                confirmKey = 'voice_confirm_bassel';
                msg = '👨‍🏫 تم اعتماد <b>صوت الأستاذ باسل (فصيح البشري التعبيري)</b> لكامل المنهج الدراسي والحوارات والقصص والألعاب!';
            } else {
                confirmKey = 'voice_confirm_integrated';
                msg = '🌟 تم اعتماد <b>الوضع التكاملي المشترك</b> (الأستاذ باسل للحوارات والقصص والتوجيه + المعلمة للأصوات المساندة)!';
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
                playAudio('voice_preview_bassel');
                const speechText = document.getElementById('speechText');
                if (speechText) speechText.innerHTML = '👨‍🏫 <b>صَوْتُ الأُسْتَاذِ بَاسِل (فَصِيح البَشَرِيُّ التَّعْبِيرِيّ)</b><br>«أَهْلاً بِكُمْ يَا أَبْطَالَ الْقِرَاءَة! أَنَا صَدِيقُكُمْ فَصِيحٌ أُرَافِقُكُمْ فِي كُلِّ خُطْوَة!»<br>مُعْتَمَدٌ لِكَامِلِ الْمَنْهَجِ الدِّرَاسِيِّ وَالْحِوَارَاتِ وَالْقِصَصِ وَالْأَلْعَاب!';
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
                // تجميع كل روابط الصور وواجهات الدروس من DOM و LessonViewLoader و curriculum_data
                const assetsSet = new Set();
                document.querySelectorAll('img').forEach(img => {
                    const src = img.getAttribute('src');
                    if (src && !src.startsWith('data:') && !src.startsWith('http')) {
                        assetsSet.add(src);
                    }
                });

                const viewPaths = (window.LessonViewLoader && typeof window.LessonViewLoader.getAllViewPaths === 'function')
                    ? window.LessonViewLoader.getAllViewPaths()
                    : [];
                viewPaths.forEach(vp => assetsSet.add(vp));

                if (viewPaths.length > 0) {
                    const imgExtractRegex = /(?:src=["']|openBookPageModal\(["'])(?:\.\/)?([a-zA-Z0-9_\-\/]+\.(?:png|jpg|jpeg|webp|svg))["']/gi;
                    for (let i = 0; i < viewPaths.length; i += 10) {
                        const vBatch = viewPaths.slice(i, i + 10);
                        await Promise.all(vBatch.map(vp =>
                            fetch(vp).then(r => r.ok ? r.text() : '').then(txt => {
                                if (!txt) return;
                                let m;
                                while ((m = imgExtractRegex.exec(txt)) !== null) {
                                    if (m[1]) assetsSet.add(m[1]);
                                }
                                imgExtractRegex.lastIndex = 0;
                            }).catch(() => null)
                        ));
                    }
                }

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
                // ترحيل تلقائي لمرة واحدة لاعتماد صوت الأستاذ باسل كصوت افتراضي للحوارات والمنصة
                if (localStorage.getItem('qiraati-smart-voice-default-v362') !== '1') {
                    const curVoice = localStorage.getItem('qiraati-smart-voice-pref') || localStorage.getItem('qiraati_smart_voice_pref');
                    if (!curVoice || curVoice === 'integrated') {
                        localStorage.setItem('qiraati-smart-voice-pref', 'bassel');
                    }
                    localStorage.setItem('qiraati-smart-voice-default-v362', '1');
                }
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
                // حروف ومخارج فونيمية (مكتبة الفونيمات النقية الـ 28 كاملة)
                'ا': 'phoneme_pure_alif',
                'أ': 'phoneme_pure_alif',
                'إ': 'phoneme_pure_alif',
                'آ': 'phoneme_pure_alif',
                'ء': 'phoneme_pure_alif',
                'ب': 'phoneme_pure_baa',
                'ت': 'phoneme_pure_taa',
                'ث': 'phoneme_pure_thaa',
                'ج': 'phoneme_pure_jeem',
                'ح': 'phoneme_pure_haa',
                'خ': 'phoneme_pure_khaa',
                'د': 'phoneme_pure_dal',
                'ذ': 'phoneme_pure_dhal',
                'ر': 'phoneme_pure_raa',
                'ز': 'phoneme_pure_zay',
                'س': 'phoneme_pure_seen',
                'ش': 'phoneme_pure_sheen',
                'ص': 'phoneme_pure_sad',
                'ض': 'phoneme_pure_dhad',
                'ط': 'phoneme_pure_ta',
                'ظ': 'phoneme_pure_dha',
                'ع': 'phoneme_pure_ayn',
                'غ': 'phoneme_pure_ghayn',
                'ف': 'phoneme_pure_faa',
                'ق': 'phoneme_pure_qaf',
                'ك': 'phoneme_pure_kaf',
                'ل': 'phoneme_pure_lam',
                'م': 'phoneme_pure_meem',
                'ن': 'phoneme_pure_noon',
                'ه': 'phoneme_pure_ha',
                'هـ': 'phoneme_pure_ha',
                'و': 'phoneme_pure_waw',
                'ي': 'phoneme_pure_yaa',
                'ى': 'phoneme_pure_yaa',
                'ة': 'letter_marboota_sound',
                'تنوين': 'tanween_dham_sound',
                'شدة': 'shaddah_sound',
                // كلمات المنهج بصوت الأستاذ باسل / فصيح المعتمد
                'دادا': 'faseeh_blend_dada',
                'بابا': 'faseeh_blend_baba',
                'ماما': 'faseeh_blend_mama',
                'دار': 'faseeh_blend_dar',
                'دور': 'faseeh_blend_door',
                'نور': 'faseeh_blend_noor',
                'فراس': 'faseeh_blend_firas',
                'ورد': 'faseeh_blend_wardun',
                'بوق': 'faseeh_blend_booq',
                'ريف': 'letter_f_reef_word_reef',
                'بط': 'faseeh_blend_bat',
                'قطار': 'faseeh_blend_qitar',
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
                'غزال': 'faseeh_blend_ghazal',
                'مياه': 'faseeh_blend_miah',
                'زيتون': 'faseeh_word_zaytoon',
                'سالم': 'faseeh_word_salim',
                'نبيه': 'faseeh_word_nabeeh',
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
            // توسيع التغطية الصوتية لـ 750+ كلمة منهجية بصوت الأستاذ باسل أوفلاين
            Object.assign(WORD_AUDIO_MAP, {"ابريق":"letter_hamza_word_ibreeq","ابوه":"letter_ha_word_abooh","ابي":"letter_ayn_salim_word_abi","ابيع":"letter_ayn_salim_word_abee","اثاث":"word_athath","اثاثي":"letter_tha_word_athaath","اثقل":"letter_tha_word_athqaal","اثنان":"letter_tha_word_ithnaan","احسان":"letter_hamza_word_ihsaan","احضرت":"letter_kha_word_ahdarat","احفظ":"letter_dha_word_ihfaz","احمد":"letter_hamza_word_ahmad","اخضر":"letter_kha_word_akhdar","اخطبوط":"letter_hamza_word_ukhtuboot","اديب":"letter_hamza_word_adeeb","اذن":"letter_dhal_word_udhun","اذوق":"letter_dhal_word_adhooq","ارتفع":"letter_ghayn_word_irtafa_a","ارسل":"letter_kaf_word_arsil","ارض":"letter_dhad_word_ard","اركبت":"shaddah_word_rakkaptu","اريد":"letter_hamza_word_ureed","ازرع":"letter_hamza_word_azra","ازهار":"letter_hamza_word_azhaar","استاذ":"word_ustadh","اسد":"letter_hamza_word_asad","اشارة المرور":"act8_traffic_light","اشجار":"letter_hamza_word_ashjaar","اشجارا":"letter_j_word_ashjaaran","اصباغ":"letter_ghayn_word_asbaagh","اصبع":"letter_ayn_salim_word_isba","اظفار":"letter_dha_word_azfaar","اظفر":"letter_dha_word_azfur","اغنام":"letter_ghayn_word_aghnaam","اقبال":"letter_hamza_word_iqbaal","اقرا":"letter_dhal_word_iqra","الارض":"lam_word_alard","الايمان":"letter_dha_word_aleemaan","البطة":"lam_word_albattah","التلاميذ":"lam_word_talaameedh","الثلج":"lam_word_athalj","الجرارة":"letter_tha_word_aljarraar","الحمد":"lam_word_alhamdu","الحمد لله":"letter_ghayn_word_alhamdu","الخريف":"lam_word_alkhareef","الدجاج":"letter_tha_word_addajaaj","الدفتر":"lam_word_addaftar","الربيع":"lam_word_arrabee","الزرع":"letter_ha_word_alzar","الزهرة":"lam_word_azzahrah","السحاب":"lam_word_assahaab","السلام":"letter_kaf_word_assalaamu","السماء":"lam_word_assamaa","السمكة":"letter_kaf_word_assamaka","السيارة":"lam_word_assayyaarah","الشتاء":"lam_word_ashshitaa","الصورة":"letter_ghayn_word_soorah","الصيف":"lam_word_assayf","العسل":"letter_dhal_word_alasal","الغراب":"lam_word_alguraab","الغنم":"letter_tha_word_alghanam","الغيوم":"lam_word_alguyoom","الفضاء":"lam_word_alfadaa","الفلفل":"letter_ayn_salim_word_fulful","القلم":"lam_word_alqalam","الكتاب":"lam_word_alkitaab","الكوكب":"lam_word_alkawkab","الله":"lam_word_allahu","المرور":"letter_sh_word_muroor","المريخ":"lam_word_almirreekh","المطر":"lam_word_almatar","المعلم":"lam_word_almuallim","المقصة":"letter_sad_word_miqas","الناس":"letter_sh_word_alnaas","النجم":"lam_word_annajm","النظافة":"letter_dha_word_annazaafatu","الورد":"lam_word_alward","الورقة":"letter_sad_word_waraq","الى العم":"letter_kaf_word_ilal_amm","امي":"letter_hamza_word_ummee","امين":"letter_hamza_word_ameen","امين بناء":"letter_hamza_read_ameen_full","انا":"letter_ayn_salim_word_ana","اناء":"letter_hamza_word_inaa","اوز":"letter_hamza_word_iwazzah","ايمان":"letter_hamza_word_eemaan","ايمن":"letter_hamza_word_ayman","بئر":"letter_hamza_word_bi_r","باب":"word_bab","بابنا":"letter_z_word_babana","باثقال":"letter_tha_word_bi-athqaal","باكرا":"letter_dha_word_baakiran","بالوان":"letter_kha_word_bi-alwaan","بان":"word_ban","ببغاء":"letter_ghayn_word_babbaghaa","بدور":"letter_dhal_word_budoor","بديع":"letter_ayn_salim_word_badee","بذر":"letter_dhal_word_badhara","بذل":"letter_dhal_word_badhala","بذور":"letter_dhal_word_budhoor","بذورا":"letter_dhal_word_budhooran","براد":"shaddah_word_barraad","برتقال":"letter_q_booq_word_burtuqaal","برد":"letter_j_word_burj","بركان":"letter_kaf_word_burkaan","بزاز":"letter_z_word_bazzaz","بساط بساط":"letter_ta_word_bisaat","بساطا":"letter_j_word_bisaat","بستان":"letter_ayn_salim_word_bustani","بستاني":"letter_l_nabeel_word_bustani","بط بط":"letter_ta_word_bat","بطة":"lam_word_albattah","بطريق":"letter_q_booq_word_batreeq","بطريق بطريق":"letter_ta_word_bitreeq","بطيخ":"letter_kha_word_battikh","بعث":"letter_tha_word_baaith","بقال":"letter_l_nabeel_word_baqqal","بقر":"word_baqar","بقر ووز":"letter_f_reef_read_full","بلاد":"word_bilad","بلدان":"letter_ha_word_buldaan","بلدي":"letter_l_nabeel_word_baladi","بناء":"letter_hamza_word_bannaa","بنات":"word_banat","به":"letter_dha_word_bihi","بوضوح":"letter_dha_word_biwudooh","بوق نديم":"sentence_booq_nadeem","بيت":"letter_kaf_word_deek","بيتي":"letter_l_nabeel_word_bayti","بيد":"letter_dhad_word_bayd","تاج":"letter_j_word_taaj","تبتسم":"letter_marboota_read_word_tabtasimu","تحب":"letter_dhal_word_tuhibbu","تحت":"act7_below","تحمل":"letter_dhad_word_tahmilu","تدرس":"letter_marboota_read_word_tadrusu","تدرسان":"letter_j_word_tadrusaan","تراث":"letter_tha_word_turaath","تربي":"letter_dha_word_turabbee","ترسم":"letter_marboota_read_word_tarsimu","ترى":"letter_tha_word_taraa","تسقي":"letter_ha_word_tasqi","تصبغ":"letter_ghayn_word_tasbugh","تصنع":"letter_tha_word_tasnaoo","تطبخ":"letter_kha_word_tatbakhu","تعبر":"letter_j_word_taaburu","تعتني":"letter_dhad_word_ta-tanee","تغريد":"letter_ghayn_word_taghreed","تغليف":"letter_ghayn_word_taghleef","تفاح":"shaddah_word_tuffaah","تفل تفل":"letter_ta_word_tifl","تقول":"letter_hamza_word_taqool","تلاميذه":"letter_dhal_word_talaameedhih","تلميذ":"letter_dha_word_tilmeedh","تلميذة":"letter_dhal_word_tilmeedhah","تمثال":"letter_tha_word_timthaal","تمساح":"letter_h_word_timsah","تمشط":"shaddah_word_tumashshitu","تنسج":"letter_j_word_tansiju","تنقش":"letter_j_word_tunaqqishu","تنوين الكسر":"tanween_kasr_intro","توت":"tanween_dham_word_tootun","تين":"letter_t_read_word_teen","تين تين":"letter_ta_word_teen","ثابت":"letter_tha_word_thaabit","ثريا":"letter_tha_word_thurayyaa","ثعبان":"letter_tha_word_thubaan","ثعلب":"letter_ayn_salim_word_thalab","ثلج":"lam_word_thalj","ثمر":"letter_tha_word_thimaar","ثوم":"letter_tha_word_thawm","ثياب":"letter_tha_word_thiyaab","ثيرن":"letter_tha_word_theeraan","جالس":"letter_j_word_jaalis","جامعا":"letter_j_word_jaami","جاموس":"letter_j_word_jaamoos","جاموسة":"letter_j_word_jaamoosah","جبنا":"letter_j_word_jubn","جد":"shaddah_word_jadd","جدتي":"shaddah_word_jaddati","جدي":"word_jaddi","جديدا":"letter_j_word_jadeedan","جذر":"letter_dhal_word_jadhr","جرب":"letter_ghayn_word_jarrah","جرس":"letter_j_word_jaras","جزر":"letter_j_word_jazar","جزيرة":"letter_j_word_jazeerah","جسر":"letter_j_word_jisr","جمال":"letter_j_word_jimaal","جمل":"word_jamal","جميل":"letter_dha_word_jameel","جميلة":"letter_j_word_jameelah","جنى":"letter_j_word_jana","جورب":"letter_j_word_jawrab","جيش":"letter_sh_word_jaysh","حائط":"letter_h_word_haait","حاتم":"letter_h_word_haatim","حاذق":"letter_dhal_word_haadhiq","حارث":"letter_tha_word_haarith","حارس":"letter_h_word_haaris","حارق":"letter_dhal_word_haariq","حاسوب":"letter_ha_word_haasoob","حاسوبه":"letter_dha_word_haasoobahu","حافظ":"letter_dha_word_haafiz","حامد":"letter_h_word_haamid","حبل":"letter_h_word_habl","حبوب":"letter_h_word_huboob","حجر":"letter_j_word_hajar","حديقة":"letter_j_word_hadeeqah","حديقتنا":"letter_hamza_word_hadeeqatina","حذاء":"letter_dhal_word_hidhaa","حرف الذال":"phoneme_pure_dhal","حرف الضاد":"phoneme_pure_dhad","حزام":"letter_z_word_hizam","حسن":"letter_h_word_hasan","حشيش":"letter_h_word_hasheesh","حصاة":"letter_ghayn_word_hasaat","حصان":"letter_h_word_hisaan","حصيرة":"letter_dha_word_haseerah","حظيرة":"letter_dha_word_hazeerah","حقل":"word_haql","حكايات":"letter_kaf_word_hikayaat","حكاية":"letter_kaf_word_hikayah","حلزون":"letter_z_word_halazoon","حلو":"letter_sh_word_hulw","حليب":"letter_l_nabeel_word_haleeb","حليبا":"letter_z_word_haleeb","حمار":"word_himar","حمامة":"letter_h_word_hamaamah","حنن":"letter_h_word_hanaan","حوت":"letter_h_word_hoot","حيطان":"letter_h_word_heetaan","حيوان":"letter_h_word_hayawan","حيوانات":"letter_dha_word_hayawaanaat","خاتم":"letter_kha_word_khaatam","خالتي":"letter_kha_word_khaalatee","خبز":"letter_kha_word_khubz","ختام":"letter_kha_word_khitaam","خرجي":"letter_kha_word_kharaja","خروج":"letter_j_word_khurooj","خس":"letter_kha_word_khass","خشب":"letter_kha_word_khashab","خضار":"letter_dhad_word_khudaar","خضارا":"letter_kha_word_khudaaran","خلدون":"letter_kha_word_khaldoon","خلق":"lam_word_khalaqa","خلود":"letter_kha_word_kholood","خليل":"word_khaleelin","خوخ":"letter_kha_word_kookh","خوخة":"letter_kha_word_khookh","خوذة":"letter_kha_word_khoodhah","خيار":"letter_kha_word_khiyaar","خيط":"letter_kha_word_khayt","خيمة":"word_khayma","دارنا":"letter_hamza_word_darana","داري":"word_dari","دب":"shaddah_word_dubb","دبوس":"shaddah_word_dabboos","دجاجة":"letter_j_word_dajaajah","دخان":"letter_kha_word_dukhaan","دربنا":"letter_z_word_darbina","درس":"letter_dhad_word_dirsun","دروسك":"letter_dha_word_duroosaka","دروسها":"letter_dhal_word_duroosaha","دفئ":"letter_hamza_word_daafi","دق":"letter_z_word_daqqa","دقيق":"letter_q_booq_word_daqeeq","دلو":"letter_l_nabeel_word_dalw","دماغ":"letter_ghayn_word_dimaagh","دود":"word_dood","ديم":"letter_dhad_word_diyaa","ديمة":"letter_marboota_read_word_deematu","دينا":"word_deena","ذباب":"word_dhubab","ذبابة":"letter_dhal_word_dhubaabah","ذراع":"letter_ayn_salim_word_zhiraa","ذرى":"letter_dhal_word_dhura","ذقن":"letter_dhal_word_dhaqan","ذكية":"letter_dhal_word_dhakiyyah","ذهب":"letter_ha_word_dhahaba","ذيل":"letter_dhal_word_dhayl","راحة":"letter_sad_word_raaha","راس":"letter_hamza_word_raas","رامي":"letter_s_read_word_rami","رباب":"letter_z_word_rabab","ربيع":"letter_ayn_salim_word_rabee","رجل":"letter_j_word_rijl","رسم":"letter_ghayn_word_rassam","رضيع":"letter_dhad_word_radeea","رعاك":"letter_ha_word_raaka","رغيف":"letter_ghayn_word_ragheef","رفيق":"letter_f_reef_word_rafeeq","ركبة":"letter_kaf_word_rukbah","رمل":"letter_l_nabeel_word_raml","روزي":"letter_z_word_ruzz","رياض":"letter_dhad_word_riyaad","ريش":"letter_sh_word_reesh","ريم":"word_reem","زبيب":"letter_z_word_zabeeb","زجاجة ماء":"letter_z_word_zujajah","زر":"letter_z_word_zirr","زرافة":"teach_giraffe","زرع":"letter_ayn_salim_word_zarraa","زرنا":"shaddah_word_zurna","زهرة":"letter_ha_word_zahrah","زهور":"letter_ha_word_zuhoor","زورق":"word_zoraq","زيد":"letter_z_word_zayd","زيدون":"letter_z_word_zaydoon","زينب":"lam_word_zaynab","زينة":"letter_z_word_zeenah","سؤال":"letter_hamza_word_suaal","ساخنا":"letter_kha_word_saakhinan","سار":"letter_j_word_saara","سارة":"word_sarah","سارت":"letter_t_read_word_saarat","سافر":"letter_s_read_word_safara","ساقي":"letter_ghayn_word_saaqee","سال":"lam_word_saala","سباحة":"letter_dhad_word_sibahah","سبورة":"shaddah_word_sabboorah","سبيل":"word_sabeel","سحاب":"letter_h_word_sahab","سروة":"letter_marboota_read_word_sarwatu","سطر":"letter_sad_word_saqr","سلمى":"word_salma","سماتد":"letter_kaf_word_sammaak","سمك":"letter_kaf_word_samak","سمن":"letter_hamza_word_samaa","سنان":"letter_n_read_word_sinan","سندباد":"letter_kaf_word_sindibaad","سهاد":"letter_ha_word_suhaad","سهام":"letter_ha_word_sihaam","سهم":"letter_ha_word_sahm","سهول":"letter_ha_word_suhool","سور":"tanween_dham_word_sooru","سورة":"letter_sad_word_soorah","سيارة":"shaddah_word_sayyaarah","شارع":"letter_ayn_salim_word_shaari","شارعنا":"letter_j_word_shaariuna","شاطئ":"letter_hamza_word_shaati","شباك":"letter_ha_word_shubbaak","شبت":"letter_kaf_word_shibaak","شبكة الصيد":"item_shabaka","شبل":"letter_sh_word_shibl","شجرة":"letter_j_word_shajarah","شراع":"letter_sh_word_shiraa","شرب":"letter_ghayn_word_shariba","شرطي":"word_shurti","شعلة":"letter_ayn_salim_word_shulah","شكرا":"letter_ghayn_word_shukran","شمعة":"letter_sh_word_shamah","شيرين":"letter_sh_word_sheereen","صابون":"letter_sad_word_saaboon","صادق":"letter_sad_word_saadiq","صاروخ":"letter_sad_word_saarookh","صافرة":"letter_sad_word_safirah","صبا":"letter_sad_word_saba","صباح":"letter_sad_word_sabah","صباغ":"letter_ghayn_word_sabbaagh","صحة":"letter_dha_word_sihhati","صحيا":"letter_dhal_word_sihhiyyan","صخرة":"letter_kha_word_sakhrah","صخور":"letter_kha_word_sukhoor","صدب":"letter_sad_word_sidq","صديق":"letter_sad_word_sadeeq","صديقي":"letter_dhad_word_saadiq","صغير":"letter_ghayn_word_sagheer","صقر":"letter_q_booq_word_saqr","صمغ":"letter_ghayn_word_samgh","صنارة":"letter_sad_word_sinnarah","صندوق":"letter_sad_word_sundooq","صنع":"letter_sad_word_sanaa","صهيل":"letter_ha_word_saheel","صوص":"letter_sad_word_soos","صوف":"letter_sad_word_soof","صياد":"letter_sad_word_sayyad","صيصان":"letter_sad_word_seesan","ضابط":"letter_dhad_word_daabit","ضحى":"letter_dhad_word_duha","ضفدع":"letter_dhad_word_difda","ضفيرة":"letter_dhad_word_dafeerah","ضيوف":"letter_dhad_word_duyoof","طارق":"word_tariq","طارق طارق":"letter_ta_word_taariq","طالب طالب":"letter_ta_word_taalib","طاهي":"letter_ha_word_taahi","طباخ":"letter_dhal_word_tabbaakh","طباشير":"letter_sh_word_tabasheer","طبل طبل":"letter_ta_word_tabl","طبيب طبيب":"letter_ta_word_tabeeb","طبية":"letter_dha_word_tibbiyyah","ططر":"shaddah_word_qittah","طعاما":"letter_dhal_word_taaman","طفلا":"letter_dhad_word_tiflan","طلوعي":"letter_sh_word_tuloo","طيار":"word_tayyar","طيارة وقاص":"shaddah_read_waqqas","طيور":"word_tuyoor","طيور طيور":"letter_ta_word_tuyoort","ظافر":"letter_dha_word_zaafir","ظباء":"letter_dha_word_zibaa","ظرف":"letter_dha_word_zarf","ظفار":"letter_dha_word_zafaar","ظفر":"letter_dha_word_zafar","ظل":"letter_dha_word_zill","ظلم":"letter_dha_word_zalama","عالم":"letter_ayn_salim_word_aalim","عاليا":"letter_ayn_salim_word_aaliya","عامر":"letter_ayn_salim_word_aamir","عبوري":"letter_sh_word_uboor","عجوز":"letter_dhad_word_ajooz","عجيبة":"letter_kaf_word_ajeebah","عجين":"letter_j_word_ajeen","عراق":"letter_ayn_salim_word_iraq","عشب":"letter_sh_word_ushb","عصفور":"letter_ayn_salim_word_usfoor","عصير":"letter_sad_word_aseer","عضلات":"letter_dhad_word_adalaat","عطشان":"letter_ghayn_word_atshaan","عظام":"letter_ayn_salim_word_izaam","عظم":"letter_dha_word_azm","علبة":"letter_ghayn_word_ulbah","علم":"word_alam","على":"letter_dha_word_ala","علي":"lam_word_aliyyun","عليكم":"letter_kaf_word_alaykum","عليه":"letter_j_word_alaihi","عن":"letter_kaf_word_an","عنب":"letter_ayn_salim_word_inab","عند":"letter_kaf_word_inda","عندها":"letter_dha_word_indahaa","عنك":"letter_kaf_word_anka","عودا":"letter_ayn_salim_word_ood","عيدان":"letter_ayn_salim_word_eadaan","عينيه":"letter_dha_word_aynayh","غابة":"letter_ghayn_word_ghaabah","غالب":"letter_ghayn_word_ghaalib","غامض":"letter_ghayn_word_ghaamidh","غذاء":"letter_ghayn_word_ghidhaa","غراب":"word_ghurab","غريب":"letter_ghayn_word_ghareeb","غزل":"letter_ghayn_word_ghazaal","غسالة":"letter_ghayn_word_ghassaalah","غسان":"letter_ghayn_word_ghassaan","غسل":"letter_ghayn_word_ghassaal","غصن":"letter_ghayn_word_ghusn","غطاء":"letter_ghayn_word_ghitaa","غواصة":"letter_ghayn_word_ghawwaasah","غوريلا":"letter_ghayn_word_ghoorilla","غيث":"letter_tha_word_ghayth","فؤاد":"letter_hamza_word_fuad","فاتن":"letter_t_read_word_faatin","فار":"letter_hamza_word_faar","فارس":"letter_n_read_word_faris","فاس":"letter_hamza_word_faas","فبرد":"letter_kha_word_khaabirah","فحم":"letter_h_word_fahm","فخور":"letter_kha_word_fakhoor","فراشة":"letter_f_reef_word_farasha","فرح":"letter_ghayn_word_fariha","فرش":"letter_q_booq_word_qirsh","فروخ":"letter_sad_word_furookh","فروق":"letter_f_reef_word_farooq","فستان":"letter_f_reef_word_fustan","فصل":"letter_sad_word_qasr","فصيح":"mascot_welcome","فقال":"letter_kaf_word_faqaala","فقير":"letter_ghayn_word_faqeer","فلا":"letter_dha_word_falaa","فلاح":"word_fallah","فلفل":"letter_l_nabeel_word_fulful","فهد":"letter_ha_word_fahd","فوق":"act7_above","في":"letter_dha_word_fee","في ف":"letter_t_read_word_fee","فيرسمون":"letter_dhal_word_fayarsumoon","فيل":"letter_f_reef_word_feel","فيها":"lam_word_feeha","قارب":"letter_q_booq_word_qaarib","قال":"lam_word_qaala","قبطان قبطان":"letter_ta_word_qubtaan","قبع":"letter_q_booq_word_qubbaah","قدم":"letter_ghayn_word_qaddama","قدوري":"word_qaddouri","قدير":"letter_dhal_word_qadeer","قديم":"letter_q_booq_word_qadeem","قديمة":"letter_kaf_word_qadeemah","قرا":"letter_hamza_word_qaraa","قرات":"letter_kaf_word_qara-tu","قرانا":"letter_hamza_word_qaraana","قريب":"letter_ghayn_word_qareeb","قص":"letter_sad_word_qas","قط":"letter_q_booq_word_qitt","قطار قطار":"letter_ta_word_qitaar","قفص":"letter_sad_word_qafas","قلم":"word_qalam","قلنا":"letter_l_nabeel_word_qulna","قلوب":"letter_l_nabeel_word_quloob","قليل":"letter_l_nabeel_word_qaleel","قماشا":"letter_j_word_qumaash","قمح":"letter_h_word_qamh","قنفذ":"letter_dhal_word_qunfudh","كامل":"letter_kaf_word_kaamil","كبيرة":"letter_kaf_word_kabeerah","كتابا":"letter_kaf_word_kitaaban","كتب":"letter_kaf_word_kataba","كثيرا":"letter_dha_word_katheeran","كراتي":"letter_tha_word_kuraat","كرة":"letter_kaf_word_kurah","كريم":"letter_kaf_word_kareem","كل":"letter_dha_word_kulla","كلب":"letter_kaf_word_kalb","كمثرى":"letter_tha_word_kummathraa","كمنجة":"letter_kaf_word_kamanjah","كنان":"letter_kaf_word_kinaan","كوب":"letter_kaf_word_koob","كوثر":"letter_kaf_word_kawthar","كوكب":"lam_word_kawkab","لؤلؤا":"letter_hamza_word_lu_lu","لبن":"letter_l_nabeel_word_laban","لحم":"letter_l_nabeel_word_lahm","لدينا":"letter_l_nabeel_word_ladayna","لذيذ":"letter_dhal_word_ladheedh","لذيذا":"letter_dhal_word_ladheedhan","لسان":"letter_l_nabeel_word_lisan","لصديقه":"letter_dha_word_lisadeeqihi","لطفي لطفي":"letter_ta_word_lutfi","لطيف":"tanween_dham_word_lateefun","لعب":"letter_l_nabeel_word_laib","لعبا":"letter_tha_word_luaban","لعبة":"letter_ayn_salim_word_lubah","لك":"letter_kaf_word_laka","لكي":"letter_dha_word_likay","لله":"lam_word_lillah","لماذا":"letter_l_nabeel_word_limatha","لنا":"lam_word_lana","ليث":"letter_tha_word_layth","ماء":"letter_hamza_word_maa","ماذا":"lam_word_maadha","مازن":"word_mazin","مالك سماك":"letter_kaf_read_maalik_full","مامون":"letter_hamza_word_mamoon","ماهر":"letter_dhal_word_maahir","ماهرة":"letter_j_word_mahirah","متنوعة":"letter_dha_word_mutanawwiah","متين":"tanween_dham_word_mateen","مثلث":"letter_tha_word_muthallath","مثمرة":"letter_tha_word_muthmirah","مجهر":"letter_j_word_mijhar","محاسن":"letter_h_word_mahasin","محراث":"letter_tha_read_h1","محرار":"letter_h_word_mihraar","محفظة":"letter_dha_word_mahfazah","محفوظ":"word_mahfooth","مختلفة":"letter_dhal_word_mukhtalifah","مدرسة":"letter_j_word_madrasah","مدرستك":"letter_dha_word_madrasatika","مدرستي":"tanween_dham_word_madrasati","مذياع":"letter_ayn_salim_word_mizhyaa","مذيع":"letter_dhal_word_mudhee","مر":"letter_z_word_marra","مرسم":"letter_n_read_word_marsam","مرفوعا":"letter_ayn_salim_word_marfooa","مرور":"word_muroor","مريض":"letter_dhad_word_mareed","مزرعة":"letter_z_word_mazraah","مزمار":"letter_z_word_mizmar","مزهرية":"letter_z_word_mizhariyyah","مستشفى":"letter_dhad_word_mustashfa","مشرقة":"letter_sh_word_mushriqah","مشط":"letter_sh_word_misht","مشعل":"letter_sh_word_mishaal","مشمش":"letter_sh_word_mishmish","مصباح":"letter_sad_word_misbaah","مضرب":"letter_dhad_word_midrab","مطبخ":"letter_kha_word_matbakh","مطبخ مطبخ":"letter_ta_word_matbakh","مطر":"word_matar","مطرقة مطرق":"letter_ta_word_mitraqah","مع":"letter_dhal_word_maa","معا":"letter_ayn_salim_word_maan","معاذ":"letter_dhal_word_muaadh","معجون":"letter_j_word_majoon","معلم":"letter_dhal_word_muallim","مغزل":"letter_ghayn_word_mighzal","مغسلة":"letter_ghayn_word_mighsalah","مفتاح":"letter_f_reef_word_miftah","مفيد":"letter_f_reef_word_mufeed","مفيدة":"letter_ha_word_mufeedah","مقص":"shaddah_word_miqass","مكتبة":"word_maktaba","مكتوبا":"letter_kaf_word_maktooban","مكسورة":"letter_ghayn_word_maksoorah","مكعبات":"shaddah_word_muka-abaat","مكواة":"letter_kaf_word_mikwaah","ملابس":"letter_l_nabeel_word_malabis","ملحا":"letter_h_word_milh","ملعب":"letter_l_nabeel_word_malab","ملك":"letter_kaf_word_maalik","ملونة":"shaddah_word_mulawwanah","ممرض":"letter_dhad_word_mumarriz","من":"letter_dha_word_mina","من ورق":"letter_tha_word_min_waraq","مناشير":"letter_sh_word_manasheer","مناف":"word_manaf","منبه":"letter_ha_word_munabbih","منتظر":"word_muntadhar","منذر":"letter_dhal_word_mundhir","منشار":"letter_sh_word_minshaar","منصور":"letter_sad_word_mansoor","مهدي":"letter_ha_word_mahdi","مهر":"letter_ha_word_muhr","مهرج":"letter_ha_word_muharrij","موز":"tanween_kasr_word_mawz","موسى":"letter_s_read_word_moosa","مياه المطر":"letter_ha_story_miah_s1","ميراث":"letter_tha_word_meeraath","ميسون":"letter_ghayn_word_maysmoon","نادر":"letter_z_word_nadir","ناطور":"letter_dha_word_naatoor","ناظور":"letter_dha_word_naazoor","نام":"word_naam","ناهض":"letter_dhad_word_naahid","نباتات":"letter_dhal_word_nabaataat","نبعا":"letter_ayn_salim_word_nab","نبيل":"word_nabeel","نجار":"shaddah_word_najjaar","نجم":"lam_word_najm","نجوم":"letter_j_word_nujoom","نحل":"letter_h_word_nahl","نحن":"letter_dhad_word_nahnu","نخل":"word_nakhl","نخلة":"letter_kha_word_nakhla","نخيل":"letter_kha_word_nakheel","نديم":"word_nadeem","نركض":"letter_dhad_word_narkud","نزور":"letter_z_word_nazoor","نساج":"letter_j_word_nassaaj","نساجة":"letter_j_word_nassaajah","نسال":"letter_kaf_word_nas-alu","نسيم":"letter_sh_word_naseem","نشاط":"letter_sad_word_nasheeda","نشتري":"letter_z_word_nashtari","نشيط":"letter_dha_word_nasheet","نظارة":"letter_dha_word_nazzaarah","نظافة":"letter_dha_word_nazaafati","نظام":"letter_dha_word_nizaam","نظيف":"word_natheef","نعامة":"letter_ayn_salim_word_naama","نعناع":"letter_ayn_salim_word_naanaa","نفرح":"letter_dhad_word_nafrah","نقود":"letter_q_booq_word_nuqood","نلعب":"letter_ayn_salim_word_nalab","نملة":"letter_l_nabeel_word_namlah","نمير":"word_nameer","نهر":"letter_ha_word_nahr","نهيد":"letter_ha_word_naheed","نورس":"letter_j_word_nawras","نوري":"word_nouri","هاتف":"letter_ha_word_haatif","هادي":"letter_ha_word_haadi","هبط":"letter_ha_word_habata","هدى":"letter_ha_word_huda","هدية":"letter_ha_word_hadiyyah","هدير":"letter_ha_word_hadeer","هديل":"letter_ha_word_hadeel","هرة":"letter_ha_word_hirrah","هشام":"letter_ghayn_word_hishaam","هلال":"word_hilal","همام":"letter_ha_word_humaam","هواء":"letter_hamza_word_hawaa","هيام":"letter_ha_word_hiyaam","هيزل":"letter_kaf_word_kees","واسع":"letter_ayn_salim_word_wasi","والنجوم":"lam_word_wannujoom","وبساط":"letter_kaf_word_wa-bisaat","وتمر":"tanween_dham_word_watamrun","وتين":"tanween_dham_word_wateenun","وجدتي":"shaddah_word_wa-jaddati","وجذورا":"letter_dhal_word_judhooran","وجذوعا":"letter_dhal_word_judhooan","وجه":"letter_ha_word_wajh","وحافظ":"letter_dha_word_wahaafiz","وداد":"letter_j_word_widaad","وردا":"letter_j_word_wardan","وركب":"shaddah_word_wa-rakkappa","وز":"word_wazz","وزان":"word_wazzan","وزبدا":"letter_z_word_zubd","وزن":"letter_z_word_wazana","وسم":"letter_j_word_wisaam","وسن":"letter_j_word_wasan","وسنجاب":"letter_dha_word_sinjaab","وضوء":"letter_dhad_word_wudoo","وقاص":"letter_sad_word_waqqas","وقالت":"lam_word_qaalat","وقط":"letter_dha_word_qitt","ولده":"letter_tha_word_waladuhu","ومدرستها":"letter_dhal_word_madrasataha","ووضعت":"letter_kha_word_wadaat","ويستيقظ":"letter_dha_word_yastayqizu","يبني":"letter_hamza_word_yabnee","يبيع":"letter_dhal_word_yabee","يحافظ":"letter_dha_word_yuhaafizu","يحب":"letter_dha_word_yuhibbu","يحرث":"letter_tha_word_yahruthu","يحوي":"letter_kaf_word_yahwee","يذيع":"letter_dhal_word_yudhee","يرسم":"letter_dhal_word_yarsumu","يرضع":"letter_dhad_word_yardau","يرى":"letter_dha_word_yara","يزرع":"letter_ayn_salim_word_yazra","يساعد":"letter_sh_word_yusaid","يساعده":"letter_ha_word_yusaaiduh","يسافر":"letter_ha_word_yusafir","يسبح":"letter_dhad_word_yasbahu","يسوق":"letter_tha_word_yasooqu","يضحك":"letter_dhad_word_yad-hak","يضرب":"letter_dhad_word_yadrib","يضع":"letter_dha_word_yada","يطهو":"letter_dhal_word_yatho","يطير":"letter_kaf_word_yateer","يقرا":"letter_hamza_word_yaqra","يقص":"shaddah_word_yaqussu","يقف":"letter_sh_word_yaqif","يقود":"letter_q_booq_word_yaqood","يقول":"letter_ayn_salim_word_yaqool","يكتب":"letter_kaf_word_yaktubu","يلعب":"letter_dha_word_yalabu","ينام":"letter_dha_word_yanaamu","ينسج":"letter_j_word_yansiju","يوم":"letter_dha_word_yawm"});

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
                    if (/bassel/.test(name)) score += 65;
                    if (/hamed|shakir|maged|tarik|naayf|salman|omar|zayd|fahed|jamal|ayman|rami/.test(name)) score += 45;
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

