// منصة قراءتي التفاعلية الذكية - إعداد المهندس أسامة خليل هاشم

const CACHE_NAME = 'qiraati-smart-v18';

const ASSETS_TO_CACHE = [

  './',

  './index.html',

  './manifest.json',

  './audio_data.js',

  './curriculum_data.js',

  './mobile_qr.png',

  './activity_nasheed_box.png',

  './activity_3_items.png',

  './activity_4.png',

  './activity_5_diff.png',

  './activity_5.png',

  './activity_6.png',

  './activity_7_places.png',

  './activity_8_directions.png',

  './activity_w_showcase.png',

  './activity_w_words.png',

  './activity_w_fill.png',

  './activity_y_showcase.png',

  './activity_y_words.png',

  './activity_y_fill.png',

  './page_17.png',

  './page_18.png',

  './page_19.png',

  './page_20.png',

  './unit1_family_listen.png',

  './unit1_story_kitchen.png',

  './unit1_story_living.png',

  './unit1_story_grandma.png',

  './activity_b_picnic.png',

  './activity_b_words.png',

  './activity_b_vowels.png',

  './activity_b_vowel_words.png',

  './activity_b_syllables.png',

  './activity_b_analysis.png',

  './activity_b_blend.png',

  './activity_b_read.png',

  './page_21.png',

  './page_22.png',

  './page_23.png',

  './activity_m_scene.png',

  './activity_m_words.png',

  './activity_m_vowels.png',

  './activity_m_vowel_words.png',

  './activity_m_syllables.png',

  './activity_m_analysis.png',

  './activity_m_blend.png',

  './activity_m_read.png',

  './activity_m_trace.png',

  './page_24.png',

  './page_25.png',

  './page_26.png',

  './activity_d_scene.png',

  './activity_d_words.png',

  './activity_d_vowels.png',

  './activity_d_vowel_words.png',

  './activity_d_syllables.png',

  './activity_d_analysis.png',

  './activity_d_blend.png',

  './activity_d_read.png',

  './activity_d_trace.png',

  './page_27.png',

  './page_28.png',

  './page_29.png',

  './activity_f_scene.png',

  './page_30.png',

  './activity_fatiha_frame.png',

  './activity_nasheed_mama_baba.png',

  './page_31.png',

  './unit2_school_listen.png',

  './unit2_story_yard.png',

  './unit2_story_classroom.png',

  './unit2_story_friends.png',
  './page_32.png',
  './page_33.png',
  './page_34.png',
  './activity_r_scene.png',
  './activity_r_words.png',
  './activity_r_vowel_words.png',
  './activity_r_syllables.png',
  './activity_r_analysis.png',
  './activity_r_blend.png',
  './activity_r_read.png',
  './activity_r_trace.png',

  './icons/icon-192.png',

  './icons/icon-512.png',

  './page_35.png',
  './page_36.png',
  './page_37.png',
  './activity_s_scene.png',
  './activity_s_words.png',
  './activity_s_vowel_words.png',
  './activity_s_syllables.png',
  './activity_s_analysis.png',
  './activity_s_blend.png',
  './activity_s_read.png',
  './activity_s_trace.png',
  './audio/letter_s_analysis_intro.mp3',
  './audio/letter_s_draw_hint.mp3',
  './audio/letter_s_fustaan.mp3',
  './audio/letter_s_fustaan_syllable.mp3',
  './audio/letter_s_hasoob.mp3',
  './audio/letter_s_intro.mp3',
  './audio/letter_s_long_a.mp3',
  './audio/letter_s_long_i.mp3',
  './audio/letter_s_long_u.mp3',
  './audio/letter_s_merge_faris.mp3',
  './audio/letter_s_merge_intro.mp3',
  './audio/letter_s_merge_mismaar.mp3',
  './audio/letter_s_merge_rasama.mp3',
  './audio/letter_s_mismaar.mp3',
  './audio/letter_s_mistarah.mp3',
  './audio/letter_s_mistarah_syllable.mp3',
  './audio/letter_s_model_alone.mp3',
  './audio/letter_s_model_we.mp3',
  './audio/letter_s_model_you.mp3',
  './audio/letter_s_nasr.mp3',
  './audio/letter_s_nasr_syllable.mp3',
  './audio/letter_s_read_all.mp3',
  './audio/letter_s_read_intro.mp3',
  './audio/letter_s_read_sentence1.mp3',
  './audio/letter_s_read_sentence2.mp3',
  './audio/letter_s_read_sentence3.mp3',
  './audio/letter_s_read_word_safara.mp3',
  './audio/letter_s_read_word_baba.mp3',
  './audio/letter_s_read_word_faris.mp3',
  './audio/letter_s_read_word_firas.mp3',
  './audio/letter_s_read_word_mama.mp3',
  './audio/letter_s_read_word_moosa.mp3',
  './audio/letter_s_read_word_rami.mp3',
  './audio/letter_s_read_word_rasama.mp3',
  './audio/letter_s_saah.mp3',
  './audio/letter_s_saah_vowel.mp3',
  './audio/letter_s_sabboora.mp3',
  './audio/letter_s_salla.mp3',
  './audio/letter_s_scene_story.mp3',
  './audio/letter_s_shams.mp3',
  './audio/letter_s_short_a.mp3',
  './audio/letter_s_short_i.mp3',
  './audio/letter_s_short_u.mp3',
  './audio/letter_s_sinjab.mp3',
  './audio/letter_s_sitara.mp3',
  './audio/letter_s_sooq.mp3',
  './audio/letter_s_sound.mp3',
  './audio/letter_s_split_darasa.mp3',
  './audio/letter_s_split_saafara.mp3',
  './audio/letter_s_split_saara.mp3',
  './audio/letter_s_sukkar.mp3',
  './audio/letter_s_sulhafah.mp3',
  './audio/letter_s_syllables_intro.mp3',
  './audio/letter_s_timsaah.mp3',
  './audio/letter_s_timsaah_vowel.mp3',
  './audio/letter_s_vowels_compare_intro.mp3',
  './audio/letter_s_vowels_intro.mp3',
  './audio/letter_s_teacher_read_all.mp3',
  './audio/letter_s_teacher_sentence1.mp3',
  './audio/letter_s_teacher_sentence2.mp3',
  './audio/letter_s_teacher_sentence3.mp3',
  './audio/letter_s_teacher_word_safara.mp3',
  './audio/letter_s_teacher_word_baba.mp3',
  './audio/letter_s_teacher_word_rasama.mp3',
  './audio/letter_s_teacher_word_moosa.mp3',
  './audio/letter_s_teacher_word_faris.mp3',
  './audio/letter_s_teacher_word_mama.mp3',
  './page_38.png',
  './page_39.png',
  './page_40.png',
  './activity_n_scene.png',
  './activity_n_words.png',
  './activity_n_vowel_words.png',
  './activity_n_syllables.png',
  './activity_n_analysis.png',
  './activity_n_blend.png',
  './activity_n_read.png',
  './activity_n_trace.png',
  './audio/letter_n_analysis_intro.mp3',
  './audio/letter_n_bint.mp3',
  './audio/letter_n_bint_syllable.mp3',
  './audio/letter_n_bunduq.mp3',
  './audio/letter_n_bunduq_syllable.mp3',
  './audio/letter_n_draw_hint.mp3',
  './audio/letter_n_faanoos.mp3',
  './audio/letter_n_finjaan.mp3',
  './audio/letter_n_hisaan.mp3',
  './audio/letter_n_intro.mp3',
  './audio/letter_n_janeen.mp3',
  './audio/letter_n_junood.mp3',
  './audio/letter_n_long_a.mp3',
  './audio/letter_n_long_i.mp3',
  './audio/letter_n_long_u.mp3',
  './audio/letter_n_merge_intro.mp3',
  './audio/letter_n_merge_naar.mp3',
  './audio/letter_n_merge_nasr.mp3',
  './audio/letter_n_merge_numoor.mp3',
  './audio/letter_n_minjal.mp3',
  './audio/letter_n_minjal_syllable.mp3',
  './audio/letter_n_model_alone.mp3',
  './audio/letter_n_model_we.mp3',
  './audio/letter_n_model_you.mp3',
  './audio/letter_n_naar.mp3',
  './audio/letter_n_naar_vowel.mp3',
  './audio/letter_n_naml.mp3',
  './audio/letter_n_nasr.mp3',
  './audio/letter_n_neeraan.mp3',
  './audio/letter_n_niqaat.mp3',
  './audio/letter_n_niqaat_vowel.mp3',
  './audio/letter_n_nujoom.mp3',
  './audio/letter_n_numoor.mp3',
  './audio/letter_n_read_all.mp3',
  './audio/letter_n_read_intro.mp3',
  './audio/letter_n_read_sentence1.mp3',
  './audio/letter_n_read_sentence2.mp3',
  './audio/letter_n_read_sentence3.mp3',
  './audio/letter_n_read_word_baba.mp3',
  './audio/letter_n_read_word_dada.mp3',
  './audio/letter_n_read_word_faris.mp3',
  './audio/letter_n_read_word_fee.mp3',
  './audio/letter_n_read_word_marsam.mp3',
  './audio/letter_n_read_word_noor.mp3',
  './audio/letter_n_read_word_rasama.mp3',
  './audio/letter_n_read_word_sinan.mp3',
  './audio/letter_n_scene_story.mp3',
  './audio/letter_n_short_a.mp3',
  './audio/letter_n_short_i.mp3',
  './audio/letter_n_short_u.mp3',
  './audio/letter_n_sound.mp3',
  './audio/letter_n_split_manaar.mp3',
  './audio/letter_n_split_noor.mp3',
  './audio/letter_n_split_raneen.mp3',
  './audio/letter_n_split_sinan.mp3',
  './audio/letter_n_syllables_intro.mp3',
  './audio/letter_n_vowels_compare_intro.mp3',
  './audio/letter_n_vowels_intro.mp3',
  './page_41.png',
  './page_42.png',
  './page_43.png',
  './page_44.png',
  './activity_t_scene.png',
  './activity_t_words.png',
  './activity_t_vowel_words.png',
  './activity_t_syllables.png',
  './activity_t_analysis.png',
  './activity_t_blend.png',
  './activity_t_read.png',
  './activity_t_trace.png',
  './audio/letter_t_analysis_intro.mp3',
  './audio/letter_t_ankaboot.mp3',
  './audio/letter_t_banaat.mp3',
  './audio/letter_t_draw_hint.mp3',
  './audio/letter_t_iltafat.mp3',
  './audio/letter_t_iltafat_syllable.mp3',
  './audio/letter_t_intro.mp3',
  './audio/letter_t_long_a.mp3',
  './audio/letter_t_long_i.mp3',
  './audio/letter_t_long_u.mp3',
  './audio/letter_t_makhtoom.mp3',
  './audio/letter_t_makhtoom_syllable.mp3',
  './audio/letter_t_marboota_intro.mp3',
  './audio/letter_t_merge_banaat.mp3',
  './audio/letter_t_merge_intro.mp3',
  './audio/letter_t_merge_tamr.mp3',
  './audio/letter_t_merge_teen.mp3',
  './audio/letter_t_merge_tumoor.mp3',
  './audio/letter_t_model_alone.mp3',
  './audio/letter_t_model_we.mp3',
  './audio/letter_t_model_you.mp3',
  './audio/letter_t_muhtafal.mp3',
  './audio/letter_t_muhtafal_syllable.mp3',
  './audio/letter_t_read_all.mp3',
  './audio/letter_t_read_intro.mp3',
  './audio/letter_t_read_sentence1.mp3',
  './audio/letter_t_read_sentence2.mp3',
  './audio/letter_t_read_sentence3.mp3',
  './audio/letter_t_read_sentence4.mp3',
  './audio/letter_t_read_word_baba.mp3',
  './audio/letter_t_read_word_banaat.mp3',
  './audio/letter_t_read_word_bustan.mp3',
  './audio/letter_t_read_word_faatin.mp3',
  './audio/letter_t_read_word_fee.mp3',
  './audio/letter_t_read_word_mama.mp3',
  './audio/letter_t_read_word_saara.mp3',
  './audio/letter_t_read_word_saarat.mp3',
  './audio/letter_t_read_word_teen.mp3',
  './audio/letter_t_scene_story.mp3',
  './audio/letter_t_short_a.mp3',
  './audio/letter_t_short_i.mp3',
  './audio/letter_t_short_u.mp3',
  './audio/letter_t_sitt.mp3',
  './audio/letter_t_sound.mp3',
  './audio/letter_t_split_banaat.mp3',
  './audio/letter_t_split_faatin.mp3',
  './audio/letter_t_split_sirtu.mp3',
  './audio/letter_t_split_toot.mp3',
  './audio/letter_t_syllables_intro.mp3',
  './audio/letter_t_taaj.mp3',
  './audio/letter_t_taaj_vowel.mp3',
  './audio/letter_t_tamr.mp3',
  './audio/letter_t_tamr_vowel.mp3',
  './audio/letter_t_teen.mp3',
  './audio/letter_t_teen_vowel.mp3',
  './audio/letter_t_timsaah.mp3',
  './audio/letter_t_timsaah_vowel.mp3',
  './audio/letter_t_toot.mp3',
  './audio/letter_t_toot_vowel.mp3',
  './audio/letter_t_tuffaah_vowel.mp3',
  './audio/letter_t_tuffaaha.mp3',
  './audio/letter_t_vowels_compare_intro.mp3',
  './audio/letter_t_vowels_intro.mp3'
];



self.addEventListener('install', (event) => {

  event.waitUntil(

    caches.open(CACHE_NAME).then((cache) => {

      console.log('PWA Service Worker: Caching all assets for offline use');

      return cache.addAll(ASSETS_TO_CACHE);

    })

  );

  self.skipWaiting();

});



self.addEventListener('activate', (event) => {

  event.waitUntil(

    caches.keys().then((keys) => {

      return Promise.all(

        keys.map((key) => {

          // المخازن مشتركة بين كل تطبيقات usama-kh75.github.io: يُحذف القديم من مخازن هذا التطبيق وحده

          if (key.startsWith('qiraati-smart-') && key !== CACHE_NAME) {

            console.log('PWA Service Worker: Clearing old cache', key);

            return caches.delete(key);

          }

        })

      );

    })

  );

  self.clients.claim();

});



self.addEventListener('fetch', (event) => {

  event.respondWith(

    caches.match(event.request).then((cachedResponse) => {

      if (cachedResponse) {

        return cachedResponse;

      }

      return fetch(event.request).catch(() => {

        if (event.request.mode === 'navigate') {

          return caches.match('./index.html');

        }

      });

    })

  );

});

