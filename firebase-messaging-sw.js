import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getMessaging, onBackgroundMessage } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-sw.js";


console.log("firebase-messaging-sw.js running...");
// service-worker.js
self.addEventListener('fetch', function(event) {
  console.log("tryyyyyyyyyyyyyyyyyyyyyy");
    // const requestUrl = new URL(event.request.url);

    // // מדפיס את ה-URL של הבקשה שמנסה ה-iframe לגשת אליה
    // console.log('בקשה נכנסה ל-Service Worker:', event.request.url);

    // // בודק אם ה-iframe מנווט לכתובת שאנחנו רוצים לתפוס
    // if (requestUrl.hostname === 'www.example.com') {
    //     console.log('ה-iframe מנסה לגשת לכתובת זו:', event.request.url);
        
    //     // כאן אפשר להחזיר תשובה מותאמת או לשנות את הבקשה
    //     event.respondWith(
    //         new Response('הפניה נחסמה!', { status: 403 })
    //     );
    // } else {
    //     // אם זה לא ה-URL שאנחנו רוצים לתפוס, מבצע את הבקשה כרגיל
    //     event.respondWith(fetch(event.request));
    // }
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
