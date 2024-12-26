import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getMessaging, onBackgroundMessage } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-sw.js";


console.log("firebase-messaging-sw.js running...");



// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDSllBt0vuMT8VboviUDRKF3k1XyheQPcs",
  authDomain: "push-notifications-weunica.firebaseapp.com",
  projectId: "push-notifications-weunica",
  storageBucket: "push-notifications-weunica.firebasestorage.app",
  messagingSenderId: "1042180147223",
  appId: "1:1042180147223:web:3d73406c082f45dcac3452"
};

// self.addEventListener('fetch', fetchEvent => {
//     console.log("come to proxy???");
//     const requestUrl = fetchEvent.request.url;
//     // בדיקה אם הבקשה היא עבור ה-iframe
//     if (requestUrl === 'https://ruthweunica.github.io/mishehilekafe/') {
//         fetchEvent.respondWith(
//               fetch("https://www.mishehilekafe.co.il/")
//                 .then(response => response)
//                 .catch(error => {
//                     console.log('Error fetching alternate URL:', error);
//                     return new Response("Failed to fetch alternate URL.", { status: 500 });
//                 })

//         );
//     }
// });
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
console.log("messaging", messaging);

//Handle background messages
onBackgroundMessage(messaging, (payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: 'singleCoffeeCup.png',
    data: {
      url: payload.data?.url
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function (event) {
  console.log("notification clicked!", event);
  event.notification.close(); // סוגר את הנוטיפיקציה
  let url = event.notification.data.url;
  if (url) {
    if (url.includes("https://wa.me") || url.includes("https://api.whatsapp.com")) {
      // פותח את הקישור של וואצאפ בחלון חדש
      event.waitUntil(clients.openWindow(url).then(window => {
        if (window) {
          window.focus(); // מוודא פוקוס לחלון אם נפתח
        }
      }));
    } else {
      // לוגיקה רגילה עבור קישורים אחרים
      event.waitUntil(
        clients.matchAll({ includeUncontrolled: true, type: 'window' }).then(windowClients => {
          for (var i = 0; i < windowClients.length; i++) {
            var client = windowClients[i];
            if (client.url === url && 'focus' in client) {
              return client.focus();
            }
          }
          if (clients.openWindow) {
            return clients.openWindow(url);
          }
        })
      );
    }
  }
});



