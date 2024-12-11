import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getMessaging, onBackgroundMessage } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-sw.js";


console.log("firebase-messaging-sw.js running...");
self.addEventListener('fetch', event => {
  console.log("come into!!!!!!!!!!!!!!!!!!!!!!!");
   const url = new URL(event.request.url);
    console.log('Handling fetch event for:', url.href);
    // בדוק אם הבקשה מגיעה מתוך iframe בלבד
    if (event.request.destination === 'iframe') {
        console.log('Request is from an iframe');
        // בדוק אם הקישור הוא הקישור המקורי
        if (url.href === 'https://ruthweunica.github.io/mishehilekafe/') {
            console.log('Intercepting request and redirecting');
            // שנה את הכתובת
            const newUrl = 'https://www.mishehilekafe.co.il/';
            event.respondWith(
                fetch(newUrl).catch((error) => {
                    console.error('Fetch failed for:', newUrl, error);
                    return new Response('Failed to fetch new URL', { status: 500 });
                })
            );
            return;
        }
    }
    console.log('Proceeding with original request');
    event.respondWith(fetch(event.request));
  // event.respondWith(
  //   caches.match(event.request)
  //     .then(response => {
  //       return response || fetchAndCache(event.request);
  //     })
  // );
});
// Firebase configuration
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
const messaging = getMessaging(app);
console.log("messaging",messaging);

// Handle background messages
onBackgroundMessage(messaging, (payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
