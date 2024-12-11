import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging.js";


let memberId = "";
let deviceToken = "";
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

console.log("messeging in script.js", messaging);

// Request Notification Permission
Notification.requestPermission().then(permission => {
    if (permission === "granted") {
        console.log("Notification permission granted.");
        // getFCMToken();
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
                getFCMToken();
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
    console.log("----> getFCMToken");
    const vapidKey = "BKJdFLRgiRiRRNcNlQvRUDv15OIPDtaeXrIfeUClN9whgM1E1WIMt4AZlP8SPeV9vF1R6I3EZGO_OWyHzJTw73g"; // Replace with your VAPID Key from Firebase Console
    navigator.serviceWorker.getRegistration().then(registration => {
        console.log("getRegisration", registration);
        getToken(messaging, {
            vapidKey: vapidKey,
            serviceWorkerRegistration: registration
            // serviceWorkerRegistration: registration 
        })
            .then((currentToken) => {
                if (currentToken) {
                    console.log("FCM Token:", currentToken);
                    deviceToken = currentToken;
                    updateDeviceToken(memberId, currentToken);
                } else {
                    console.warn("No registration token available. Request permission to generate one.");
                }
            })
            .catch((err) => {
                console.error("An error occurred while retrieving the FCM token:", err);
            });
    });
}

// Listen for foreground messages
onMessage(messaging, (payload) => {
    console.log("Message received in foreground:", payload);
    const { title, body, icon } = payload.notification;
    new Notification(title, { body, icon });
});

// Communication with iframe
window.addEventListener("message", e => {

    if (e.data && e.data.memberId) {
        console.log("Received memberId from Wix iframe:", e.data.memberId);
        memberId = e.data.memberId;
        updateDeviceToken(memberId, deviceToken);
    } 
});
// JavaScript בצד הלקוח (ב-d0ף שמכיל את ה-iframe)
const iframe = document.getElementById('wix-iframe');

iframe.addEventListener('load', () => {
    const iframeWindow = iframe.contentWindow;
    
    // שליחה לדף הראשי על ה-URL של ה-iframe
    iframeWindow.addEventListener('beforeunload', function () {
        console.log('ה-iframe מנסה לטעון כתובת חדשה:', iframeWindow.location.href);
        
        // שלח לדף הראשי את המידע של ה-URL שניסה ה-iframe לטעון
        if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
                type: 'navigate-iframe',
                url: iframeWindow.location.href
            });
        }
    });
});
// JavaScript בצד הלקוח (דף שמכיל את ה-iframe)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
        console.log('Service Worker רשום בהצלחה:', registration);
    }).catch(function(error) {
        console.log('שגיאה בהרשמת ה-Service Worker:', error);
    });

    // האזן להודעות מ-Service Worker
    navigator.serviceWorker.addEventListener('message', function(event) {
        if (event.data.type === 'redirect-iframe') {
            // עדכן את ה-iframe לכתובת החדשה
            const iframe = document.getElementById('wix-iframe');
            iframe.src = event.data.url; // שינוי ה-src לכתובת החדשה
            console.log('ה-iframe מנווט לכתובת חדשה:', event.data.url);
        }
    });
}



async function updateDeviceToken(memberId, deviceToken) {
    console.log("update device token in wix collection", memberId, deviceToken);
    if (!memberId || !deviceToken)
        return;
    const url = 'https://www.mishehilekafe.co.il/_functions/updateToken';
    // const url = 'https://www.mishehilekafe.co.il/_functions/myFunction';
    const data = {
        memberId: memberId,
        deviceToken: deviceToken,
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        // const result = await response.json();
        console.log('Response from server:', response);
    } catch (error) {
        console.error('Error updating device token:', error);
    }
}


