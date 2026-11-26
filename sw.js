// عامل الخدمة لمنصة قراءتي التفاعلية الذكية (PWA Service Worker)
// إعداد وتطوير: المهندس أسامة خليل هاشم
// الإصدار: v3.64 (المرحلة الثانية: تقسيم index.html والتحميل الكسول للـ 46 درساً، حفظ التقدم التلقائي، الوضع الليلي المريح، تعميم صوت الأستاذ باسل على كامل المنهج، تصحيح نطق فصيح ومطابقته للتشكيل وتنظيم عرض التوقيع، وكاش PWA إلى v90)

const APP = 'qiraati-smart';
const CACHE_NAME = 'qiraati-smart-v90';

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
  './css/dark-mode.css',
  './js/core/ai-bridge.js',
  './js/core/theme.js',
  './js/core/modals.js',
  './js/core/audio.js',
  './js/core/view-loader.js',
  './js/core/progress.js',
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
  './icons/qiraati.ico',
  './views/prep/01_lesson1.html',
  './views/prep/02_act4.html',
  './views/prep/03_act5_diff.html',
  './views/prep/04_act6.html',
  './views/prep/05_act7.html',
  './views/prep/06_act8.html',
  './views/prep/07_act5.html',
  './views/prep/08_vowel_w.html',
  './views/prep/09_vowel_y.html',
  './views/unit1/01_intro.html',
  './views/unit1/02_letter_b.html',
  './views/unit1/03_letter_m.html',
  './views/unit1/04_letter_d.html',
  './views/unit1/05_letter_f.html',
  './views/unit1/06_finale.html',
  './views/unit2/01_intro.html',
  './views/unit2/02_letter_r.html',
  './views/unit2/03_letter_s.html',
  './views/unit2/04_letter_n.html',
  './views/unit2/05_letter_t.html',
  './views/unit2/06_letter_marboota.html',
  './views/unit2/07_tanween_dham.html',
  './views/unit2/08_finale.html',
  './views/unit3/01_intro.html',
  './views/unit3/02_letter_ta.html',
  './views/unit3/03_letter_f_reef.html',
  './views/unit3/04_letter_q_booq.html',
  './views/unit3/05_letter_l_nabeel.html',
  './views/unit3/06_letter_ayn.html',
  './views/unit4/01_intro.html',
  './views/unit4/02_letter_h.html',
  './views/unit4/03_letter_sh.html',
  './views/unit4/04_letter_z.html',
  './views/unit4/05_letter_j.html',
  './views/unit4/06_letter_sad.html',
  './views/unit5/01_letter_hamza.html',
  './views/unit5/02_letter_dhad.html',
  './views/unit5/03_letter_kha.html',
  './views/unit5/04_letter_tha.html',
  './views/unit5/05_letter_kaf.html',
  './views/unit5/06_shaddah_and_reading.html',
  './views/unit6/01_letter_ghayn.html',
  './views/unit6/02_letter_ha.html',
  './views/unit6/03_letter_dhal.html',
  './views/unit6/04_letter_dha.html',
  './views/unit6/05_al_shamsiyyah_qamariyyah.html'
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
