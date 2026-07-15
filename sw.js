/* Service Worker — تطبيق بهار
   يخزن ملفات التطبيق حتى يشتغل حتى بدون انترنت، ويسمح بإشعارات أوضح على أندرويد */

const CACHE_NAME = 'bahar-checklist-v1';
const ASSETS = [
  './bahar-checklist.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).catch(() => cached))
  );
});

// يسمح للتطبيق نفسه يطلب من الـ Service Worker يعرض إشعار (أوضح وأثبت على أندرويد
// من إشعار الصفحة العادي، خصوصًا لو التطبيق مثبت كأيقونة على الشاشة الرئيسية)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    self.registration.showNotification(event.data.title, event.data.options || {});
  }
});
