// منصة قراءتي التفاعلية الذكية - إعداد المهندس أسامة خليل هاشم
const CACHE_NAME = 'qiraati-smart-v5';
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
  './icons/icon-192.png',
  './icons/icon-512.png',
  './وثيقة_تصميم_وخطة_المشروع.md'
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
          if (key !== CACHE_NAME) {
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
