const CACHE_NAME = 'polar-brinque-v6';

const urlsToCache = [
  '/polar-brinque/',
  '/polar-brinque/index.html',
  '/polar-brinque/manifest.json',
  '/polar-brinque/icons/icon-192.png',
  '/polar-brinque/icons/icon-512.png',
  '/polar-brinque/audio/tantas.mp3'
];

// Instalação
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Ativação
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

// Estratégia Cache First
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});