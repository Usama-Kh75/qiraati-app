// منصة قراءتي التفاعلية الذكية - إعداد المهندس أسامة خليل هاشم
const CACHE_NAME = 'qiraati-smart-v12';
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
  './icons/icon-192.png',
  './icons/icon-512.png'
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
