// عامل الخدمة لمنصة قراءتي التفاعلية الذكية (PWA Service Worker)
// إعداد وتطوير: المهندس أسامة خليل هاشم
// الإصدار: v3.63 (ضبط مخارج الأستاذ باسل العراقية الفصيحة، مكتبة الفونيمات النقية للـ 28 حرفاً، إصلاح 123 مفتاحاً صوتياً مفقوداً وكاش PWA إلى v86)

const APP = 'qiraati-smart';
const CACHE_NAME = 'qiraati-smart-v86';

// الهيكل الأساسي للتطبيق (App Shell) لتشغيل فوري ودعم العمل دون إنترنت
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './curriculum_data.js',
  './css/fonts.css',
  './fonts/tajawal-400-arabic.woff2',
  './fonts/tajawal-400-latin.woff2',
  './fonts/tajawal-700-arabic.woff2',
  './fonts/tajawal-700-latin.woff2',
  './fonts/tajawal-800-arabic.woff2',
  './fonts/tajawal-800-latin.woff2',
  './fonts/tajawal-900-arabic.woff2',
  './fonts/tajawal-900-latin.woff2',
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
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/faseeh_avatar.svg',
  './icons/faseeh_avatar.png',
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
  // تجاهل الطلبات غير GET (مثل POST للذكاء الاصطناعي والمزامنة) وطلبات API والروابط الخارجية
  if (event.request.method !== 'GET') return;

  let reqUrl;
  try {
    reqUrl = new URL(event.request.url);
  } catch (e) {
    return;
  }

  // استثناء طلبات API (المسابقة الصفية، رادار المعلم، الذكاء الاصطناعي) والروابط خارج نطاق التطبيق
  if (reqUrl.origin !== self.location.origin || reqUrl.pathname.startsWith('/api/')) {
    return;
  }

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

  // لبقية الأصول المحلية (الأصوات audio/*.mp3، الصور *.png، CSS، JS):
  // استراتيجية Cache-First مع التخزين التلقائي وقت التشغيل (Runtime Caching)
  event.respondWith(
    caches.match(event.request, { cacheName: CACHE_NAME }).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return networkResponse;
      }).catch(() => {
        return new Response('', { status: 503, statusText: 'Offline' });
      });
    })
  );
});
