const CACHE_NAME = 'polar-brinque-v7';

const urlsToCache = [
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
      .then(cache => {
        // Adiciona cada recurso individualmente, ignorando falhas
        return Promise.allSettled(
          urlsToCache.map(url => 
            cache.add(url).catch(err => {
              console.warn('Falha ao adicionar ao cache:', url, err);
            })
          )
        );
      })
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

// Estratégia Cache First com fallback para rede
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});