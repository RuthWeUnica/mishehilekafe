import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getMessaging, onBackgroundMessage } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-sw.js";


console.log("firebase-messaging-sw.js running...");
// service-worker.js
// service-worker.js
// מאזין fetch לתפיסת הבקשה המקורית
self.addEventListener('fetch', fetchEvent => {
   console.log("cammmmmmmmmmmmmmmmmeeeeeeeeee");
    const requestUrl = fetchEvent.request.url;

    // בדיקה אם הבקשה היא עבור ה-iframe
    if (requestUrl === 'https://ruthweunica.github.io/mishehilekafe/') {
       // console.log(`Intercepting iframe request to ${requestUrl}, redirecting to ${alternateUrl}`);
        fetchEvent.respondWith(
            fetch("https://www.mishehilekafe.co.il/")
                .then(response => response)
                .catch(error => {
                    console.error('Error fetching alternate URL:', error);
                    return new Response("Failed to fetch alternate URL.", { status: 500 });
                })
        );
    }
});

 
// מאזין לאירוע message לעדכון כתובת היעד
// self.addEventListener('message', event => {
//     console.log("cammmmmmmmmmmmmmmmmeeeeeeeeee:))))");
 
//     if (event.data && event.data.type === 'UPDATE_IFRAME_URL') {
//         alternateUrl = event.data.newUrl;
//         console.log('Updated alternate iframe URL to:', alternateUrl);
//     }
// });

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
