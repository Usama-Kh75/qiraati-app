// عامل الخدمة لمنصة قراءتي التفاعلية الذكية (PWA Service Worker)
// إعداد وتطوير: المهندس أسامة خليل هاشم
// الإصدار: v3.57 (إصلاح الواجهة البصرية + إغلاق ملاحظات v3.56 + المعالجة الصوتية الاستوديوية)

const APP = 'qiraati-smart';
const CACHE_NAME = 'qiraati-smart-v80';

// الهيكل الأساسي للتطبيق (App Shell) - أقل من 4 ميغابايت لتثبيت فوري خلال ثوانٍ
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './curriculum_data.js',

  // أنماط CSS
  './css/variables.css',
  './css/layout.css',
  './css/components.css',
  './css/stations.css',
  './css/lessons-prep.css',
  './css/lessons-unit1.css',
  './css/lessons-unit2.css',
  './css/lessons-unit3.css',
  './css/lessons-unit4.css',
  './css/lessons-unit5.css',
  './css/lessons-unit6.css',
  './css/evaluation.css',
  './css/enrichment.css',
  './css/blackboard.css',
  './css/games.css',
  './css/gamification.css',
  './css/teacher-dashboard.css',
  './css/classroom-sync.css',
  './css/classroom-quiz.css',
  './css/interactive-guide.css',
  './css/diagnostic-exams.css',
  './css/voice-coach.css',
  './css/dictation-lab.css',
  './css/readers-theater.css',
  './css/nasheed-studio.css',
  './css/story-studio.css',
  './css/student-profiles.css',

  // أكواد JavaScript المجزأة
  './js/core/ai-bridge.js',
  './js/core/modals.js',
  './js/core/audio.js',
  './js/core/navigation.js',
  './js/core/evaluation.js',
  './js/core/enrichment.js',
  './js/core/blackboard.js',
  './js/core/games.js',
  './js/core/gamification.js',
  './js/core/teacher-dashboard.js',
  './js/core/classroom-sync.js',
  './js/core/classroom-quiz.js',
  './js/core/interactive-guide.js',
  './js/core/diagnostic-exams.js',
  './js/core/voice-coach.js',
  './js/core/dictation-lab.js',
  './js/core/readers-theater.js',
  './js/core/nasheed-studio.js',
  './js/core/story-studio.js',
  './js/core/student-profiles.js',
  './js/lessons/prep.js',
  './js/lessons/unit1.js',
  './js/lessons/unit2.js',
  './js/lessons/unit3.js',
  './js/lessons/unit4.js',
  './js/lessons/unit5.js',
  './js/lessons/unit6.js',
  './js/app.js',

  // أيقونات التطبيق
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/qiraati.ico'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('PWA Service Worker: Caching App Shell for instant launch');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        // المخازن مشتركة بين كل تطبيقات usama-kh75.github.io: يُحذف القديم من مخازن هذا التطبيق وحده
        keys.filter((key) => key.startsWith(APP + '-') && key !== CACHE_NAME)
            .map((key) => {
              console.log('PWA Service Worker: Clearing old cache', key);
              return caches.delete(key);
            })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // للروابط ومستند HTML الرئيسي: محاولة الجلب من الشبكة أولاً مع التحديث التلقائي للكاش، والرجوع للمخزن عند عدم الاتصال
  if (event.request.mode === 'navigate' || event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return networkResponse;
      }).catch(() => {
        return caches.match('./index.html', { cacheName: CACHE_NAME });
      })
    );
    return;
  }

  // لبقية الأصول (الأصوات audio/*.mp3، الصور *.png، الخطوط):
  // استراتيجية Cache-First مع التخزين التلقائي وقت التشغيل (Runtime Caching)
  event.respondWith(
    caches.match(event.request, { cacheName: CACHE_NAME }).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && (networkResponse.type === 'basic' || networkResponse.type === 'cors')) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return networkResponse;
      });
    })
  );
});
