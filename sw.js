// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDSllBt0vuMT8VboviUDRKF3k1XyheQPcs",
  authDomain: "push-notifications-weunica.firebaseapp.com",
  projectId: "push-notifications-weunica",
  storageBucket: "push-notifications-weunica.firebasestorage.app",
  messagingSenderId: "1042180147223",
  appId: "1:1042180147223:web:3d73406c082f45dcac3452"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
//   console.log('Received background message ', payload);
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//       body: payload.notification.body,
//       icon: payload.notification.icon
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });

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

// self.addEventListener('install', event => {
//   event.waitUntil(
//     caches.open(cacheName)
//       .then(cache => {
//         return cache.addAll(cachedAssets);
//       })
//   );
// });

self.addEventListener('install', function(event) {
  console.log('Service Worker installing.');
  event.waitUntil(
      caches.open(cacheName).then(function(cache) {
          return cache.addAll([
              '/index.html',
              '/style.css',
              '/script.js'
          ]);
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

self.addEventListener('push', function(event) {
  const data = event.data.json();  // Assuming the server sends JSON
  const options = {
      body: data.body,
      icon: 'icon.png',
      badge: 'badge.png'
  };
  event.waitUntil(
      self.registration.showNotification(data.title, options)
  );
});