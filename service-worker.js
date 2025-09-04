const CACHE_NAME = 'financas-cache-v2'; // Alteramos a versão do cache

self.addEventListener('install', (event) => {
  // Apenas pré-caching do ficheiro principal
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Pré-caching do ficheiro principal');
      return cache.add('./index.html');
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
            // Verifica se a resposta é válida e armazena no cache
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
            // Se a busca na rede falhar, você pode retornar uma página offline
            console.error('Falha ao buscar recurso:', error);
            // Poderia retornar uma página de erro aqui, se existisse
          });
      })
  );
});
