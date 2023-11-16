
const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style-index.css',
  '/style-index.css',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(urlsToCache);
      })
    );
  });
  
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        // Cache hit - return the cached response
        if (response) {
          return response;
        }
  
        // Clone the request because it's a one-time use stream
        let fetchRequest = event.request.clone();
  
        return fetch(fetchRequest).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
  
          // Clone the response because it's a one-time use stream
          let responseToCache = response.clone();
  
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
  
          return response;
        });
      })
    );
  });
  
  self.addEventListener('activate', (event) => {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });
  
  // Cache Spotify API responses
  self.addEventListener('fetch', (event) => {
    const spotifyApiUrl = 'https://api.spotify.com';
    
    if (event.request.url.startsWith(spotifyApiUrl)) {
      event.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
          return cache.match(event.request).then((response) => {
            return (
              response ||
              fetch(event.request).then((apiResponse) => {
                cache.put(event.request, apiResponse.clone());
                return apiResponse;
              })
            );
          });
        })
      );
    }
  });
