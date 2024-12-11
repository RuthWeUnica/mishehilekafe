import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getMessaging, onBackgroundMessage } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-sw.js";


console.log("firebase-messaging-sw.js running...");
// service-worker.js
// service-worker.js
self.addEventListener('message', (event) => {
    if (event.data.type === 'navigate-iframe') {
        const iframeUrl = event.data.url;
        console.log('ה-iframe מנסה לטעון את ה-URL:', iframeUrl);
        
        // כאן אתה יכול להחליט אם לנתב את ה-iframe לכתובת חדשה או לא
        const newUrl = 'https://www.mishehilekafe.co.il'; // דוגמה להחלפת כתובת

        // בדוק אם יש צורך לעקוב אחרי ה-URL הנוכחי ולבצע פעולה
        self.clients.matchAll().then(clients => {
            clients.forEach(client => {
                client.postMessage({
                    type: 'redirect-iframe',
                    url: newUrl
                });
            });
        });
    }
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
