import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging.js";

let memberId = "";
let deviceToken = "";
let PWA = "false";
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
if (isPWA()) {
    console.log("pwa!!");
    PWA = "true";
    document.getElementById("iframe_enter").src = `https://www.mishehilekafe.co.il/enter-pwa`;
}
else {
    console.log("not pwa!!");
    document.getElementById("iframe_enter").src = "https://www.mishehilekafe.co.il/enter-browser";

}

// Register Service Workers
if ('serviceWorker' in navigator && 'PushManager' in window) {

    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js', { type: 'module' })
            .then(registration => {
                console.log('Service Worker registered successfully:((', registration);


            })
            .catch(error => {
                console.log('Service Worker registration failed: ', error);
            });

        navigator.serviceWorker.register('firebase-messaging-sw.js', { type: 'module' })
            .then((registration) => {
                console.log('Firebase Messaging Service Worker registered successfully:))', registration);
            })
            .catch((err) => {
                console.error('Firebase Messaging Service Worker registration failed:', err);
            });
    });
} else {
    console.log('Push notifications are not supported in this browser.');
}

if ('Notification' in window) {
    if (Notification.permission === "granted") {
        console.log("permission granted, change url");
        getFCMToken();
    } else {
        console.log('דפדפן זה אינו תומך בנוטיפיקציות.');
    }
}
///////////////////////////////
// 📲 הפעלת הקוד בעת טעינת הדף
console.log("09:26")
// בודק אם הדף פתוח במצב PWA
function isRunningAsPWA() {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

// מזהה שינוי במצב התצוגה
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        if (isRunningAsPWA()) {
            console.log('🚀 PWA נפתח ישירות מהדפדפן!');
            alert('🚀 PWA נפתח ישירות מהדפדפן!');
        }
    }
});
/////////////////


// Function to get the FCM Token
function getFCMToken() {
    console.log("----> getFCMToken");
    const vapidKey = "BKJdFLRgiRiRRNcNlQvRUDv15OIPDtaeXrIfeUClN9whgM1E1WIMt4AZlP8SPeV9vF1R6I3EZGO_OWyHzJTw73g"; // Replace with your VAPID Key from Firebase Console
    navigator.serviceWorker.getRegistration().then(registration => {
        console.log("getRegisration", registration);
        getToken(messaging, {
            vapidKey: vapidKey,
            serviceWorkerRegistration: registration
        })
            .then((currentToken) => {
                if (currentToken) {
                    console.log("FCM Token:", currentToken);
                    deviceToken = currentToken;
                    updateDeviceToken(memberId, currentToken);
                    if (isPWA())
                        document.getElementById("iframe_enter").src = `https://www.mishehilekafe.co.il/enter-pwa?notification=true`
                } else {
                    console.warn("No registration token available. Request permission to generate one.");
                }
            })
            .catch((err) => {
                console.error("An error occurred while retrieving the FCM token:", err);
            });
    });
}

// Communication with iframe
window.addEventListener("message", e => {
    console.log("message", e);
    if (e.data && e.data.memberId) {
        console.log("Received memberId from Wix iframe:", e.data.memberId);
        memberId = e.data.memberId;
        updateDeviceToken(memberId, deviceToken);
    }
    if (e.data === "enter") {
        window.location.href = `https://www.mishehilekafe.co.il?token=${deviceToken}&isPWA=${PWA}`;
    }
    if (e.data === "requestPermission") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                console.log("Notification permission granted!!!))).");
                getFCMToken();
            } else {
                console.log("Notification permission denied.");
            }
        });
    }
    if (e.data === "log-out from PWA") {
        window.location.href = `https://www.mishehilekafe.co.il?token=${deviceToken}&isPWA=${PWA}`;
    }
});

async function updateDeviceToken(memberId, deviceToken) {
    console.log("update device token in wix collection", memberId, deviceToken);
    if (!memberId || !deviceToken)
        return;
    const url = 'https://www.mishehilekafe.co.il/_functions/updateToken';
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

function isPWA() {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}







