const CACHE_NAME = 'financas-cache-v4'; // Versão atualizada do cache
const urlsToCache = [
  './',
  './index.html',
  'https://cdn.tailwindcss.com'
];

self.addEventListener('install', (event) => {
  // Pré-caching de todos os ficheiros essenciais
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Pré-caching dos ficheiros principais');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', (event) => {
  // Limpa caches antigos
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log(`Eliminando cache antigo: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Se a resposta estiver em cache, retorna-a
        if (response) {
          return response;
        }

        // Se não estiver em cache, busca-a na rede
        return fetch(event.request)
          .then((fetchResponse) => {
            if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
              return fetchResponse;
            }

            const responseToCache = fetchResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });

            return fetchResponse;
          })
          .catch((error) => {
            console.error('Falha ao buscar recurso:', error);
          });
      })
  );
});
