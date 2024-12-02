import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging.js";

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

// Request Notification Permission
Notification.requestPermission().then(permission => {
    if (permission === "granted") {
        console.log("Notification permission granted.");
        getFCMToken(); // קריאה לפונקציה לקבלת ה-FCM Token
    } else {
        console.log("Notification permission denied.");
    }
});

// Register Service Workers
if ('serviceWorker' in navigator && 'PushManager' in window) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js', { type: 'module' })
            .then(registration => {
                console.log('Service Worker registered successfully: ', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed: ', error);
            });

        navigator.serviceWorker.register('firebase-messaging-sw.js', { type: 'module' })
            .then((registration) => {
                console.log('Firebase Messaging Service Worker registered successfully:', registration);
            })
            .catch((err) => {
                console.error('Firebase Messaging Service Worker registration failed:', err);
            });
    });
} else {
    console.log('Push notifications are not supported in this browser.');
}

// Function to get the FCM Token
function getFCMToken() {
    const vapidKey = "BKJdFLRgiRiRRNcNlQvRUDv15OIPDtaeXrIfeUClN9whgM1E1WIMt4AZlP8SPeV9vF1R6I3EZGO_OWyHzJTw73g"; // Replace with your VAPID Key from Firebase Console
    getToken(messaging, { vapidKey: vapidKey })
        .then((currentToken) => {
            if (currentToken) {
                console.log("FCM Token:", currentToken);
                sendTokenToServer(currentToken); // Save token to your server
            } else {
                console.warn("No registration token available. Request permission to generate one.");
            }
        })
        .catch((err) => {
            console.error("An error occurred while retrieving the FCM token:", err);
        });
}

// Function to send the token to your server
function sendTokenToServer(token) {
    console.log("Sending token to server:", token);
    // Here you can send the token to your backend server using fetch/axios
}

// Show a notification
function showNotification() {
    const notificationOptions = {
        body: 'TEST',
        icon: '/singleCoffeeCup.png'
    };
    new Notification('קיבלת הודעה חדשה!', notificationOptions);
}

// Listen for foreground messages
onMessage(messaging, (payload) => {
    console.log("Message received in foreground:", payload);
    const { title, body, icon } = payload.notification;
    new Notification(title, { body, icon });
});

// Communication with iframe
window.addEventListener("message", e => {
    console.log("Message from Wix iframe:", e);
    document.getElementById("wix-iframe").contentWindow.postMessage("send message to wix from site!");
});
