const cacheName = 'your-website-cache-v1'; // Update the cache version

const cachedAssets = [
  '/',
  'index.html',
  'styles.css',
  'script.js',
  'singleCoffeeCup.png',
  'singleCoffeeCup_copy.png',
  'icons/logobig.svg'
  // Add more paths to important assets, such as images, fonts, etc.
];
self.addEventListener('fetch', event => {
  console.log("try to rewrite the url!!!!!!!!!!!!!");
  const requestUrl = new URL(event.request.url);
  
  // אם ה-iframe מנסה לטעון את ה-URL שמתחיל ב-https://ruthweunica.github.io/mishehilekafe/
  if (requestUrl.origin === 'https://ruthweunica.github.io' && requestUrl.pathname.startsWith('/mishehilekafe/')) {
    // הכתובת החדשה שתרצה לטעון במקום
    const newUrl = 'https://www.mishehilekafe.co.il/'; // שים כאן את הכתובת החדשה שלך
    
    // יצירת בקשה חדשה עם ה-URL החדש
    const newRequest = new Request(newUrl, event.request);
    
    // שליחה של הבקשה החדשה
    event.respondWith(fetch(newRequest));
  } else {
    // אם זו בקשה אחרת (לא קשורה ל-iframe), פשוט טען אותה כרגיל
    event.respondWith(fetch(event.request));
  }
});



self.addEventListener('install', event => {
  console.log('Service Worker installing.');
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        return cache.addAll(cachedAssets);
      })
  );
});

// self.addEventListener('install', function (event) {
//   console.log('Service Worker installing.');
//   event.waitUntil(
//     caches.open(cacheName).then(function (cache) {
//       return cache.addAll([
//         '/index.html',
//         '/style.css',
//         '/script.js'
//       ]);
//     })
//   );
// });

self.addEventListener('activate', event => {
  console.log("activate")
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
  console.log("come into!!!!!!!!!!!!!!!!!!!!!!!");
  

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetchAndCache(event.request);
      })
  );
});

self.addEventListener("message",e=>{
  console.log("message from wix",e);
})

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

// });
// self.addEventListener('push', function(event) {
//   const data = event.data.json();  // Assuming the server sends JSON
//   const options = {
//       body: data.body,
//       icon: 'icon.png',
//       badge: 'badge.png'
//   };
//   event.waitUntil(
//       self.registration.showNotification(data.title, options)
//   );
// });

// service-worker.js
