const cacheName = 'your-website-cache-v1'; // Update the cache version

const cachedAssets = [
  '/',
  'index.html',
  'styles.css',
  'script.js',
  'icons/singleCoffeeCup.png',
  'icons/logobig.svg'
  // Add more paths to important assets, such as images, fonts, etc.
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        return cache.addAll(cachedAssets);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys.map(key => {
        if (key !== cacheName) {
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetchAndCache(event.request);
      })
  );
});

function fetchAndCache(request) {
  return fetch(request)
    .then(response => {
      // Check if we received a valid response
      if (!response || response.status !== 200 || response.type !== 'basic') {
        return response;
      }

      const responseToCache = response.clone();

      caches.open(cacheName)
        .then(cache => {
          cache.put(request, responseToCache);
        });

      return response;
    })
    .catch(error => {
      console.error('Error fetching and caching:', error);
    });
}