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

// Request Notification Permission
Notification.requestPermission().then(permission => {
    if (permission === "granted") {
        document.getElementById("notify-button").innerHTML = "התראות פועלות עבור האפליקציה!";
        console.log("Notification permission granted!!!))).");
        getFCMToken();
    } else {
        document.getElementById('login_btn').disabled = false;
        console.log("Notification permission denied.");
    }
});


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

                // sendMessageToServiceWorker();
                console.log('Firebase Messaging Service Worker registered successfully:))', registration);
                getFCMToken();
                // loadIframe();

            })
            .catch((err) => {
                console.error('Firebase Messaging Service Worker registration failed:', err);
            });
    });
} else {
    document.getElementById('login_btn').disabled = false;
    console.log('Push notifications are not supported in this browser.');
}


// function sendMessageToServiceWorker() {
//     console.log("came into messageeeeeeeeeeeeeeee:)))))))))");
//     // קודם כל לוודא שה- service worker נרשם
//     if (navigator.serviceWorker.controller) {
//         navigator.serviceWorker.controller.postMessage({
//             type: 'UPDATE_IFRAME_URL',
//             newUrl: 'https://www.mishehilekafe.co.il/' // ה-URL החדש שברצונך להשתמש בו ב-iframe
//         });
//         console.log('Message sent to service worker');
//     } else {
//         console.log('No active service worker to send message to.');
//     }
// }

// טעינת ה-iframe רק לאחר שה-`service worker` נרשם
// function loadIframe() {
//     console.log("come into load iframe:))))))))");
//   const iframe = document.getElementById('wix-iframe');
//   iframe.src = 'https://ruthweunica.github.io/mishehilekafe/'; // הצב כאן את ה-URL הרצוי ל-iframe
//  console.log("switch to misheile");

// }

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
                    // document.getElementById("token").innerHTML = `token: ${currentToken}`
                } else {
                    // document.getElementById("token").innerHTML = `token: no token`

                    console.warn("No registration token available. Request permission to generate one.");
                }
                document.getElementById('login_btn').disabled = false;
            })
            .catch((err) => {
                // document.getElementById("token").innerHTML = `token: no token ${err}`
                document.getElementById('login_btn').disabled = false;
                console.error("An error occurred while retrieving the FCM token:", err);
            });
    });
}

// Listen for foreground messages
// onMessage(messaging, (payload) => {
//     console.log("Message received in foreground:", payload);
//     const { title, body, icon } = payload.notification;
//     new Notification(title, { body, icon });
// });

// Communication with iframe
window.addEventListener("message", e => {

    if (e.data && e.data.memberId) {
        console.log("Received memberId from Wix iframe:", e.data.memberId);
        memberId = e.data.memberId;
        updateDeviceToken(memberId, deviceToken);
    }
});



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
document.getElementById("login_btn").addEventListener("click", (e) => {
    console.log("device token to quaryParam", deviceToken);
    window.location.href = `https://www.mishehilekafe.co.il?token=${deviceToken}&isPWA=${PWA}`;
})

document.getElementById('notify-button').addEventListener('click', function () {
    Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
            document.getElementById("notify-button").innerHTML = "התראות פועלות עבור האפליקציה!";
            getFCMToken();
            console.log('Notifications allowed');
        } else {
            console.log('Notifications denied');
            document.getElementById('login_btn').disabled = false;
        }
    });
});

function isPWA() {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

// מציג את ההודעה אם רץ כ-PWA
if (isPWA()) {
    PWA = "true";
    document.getElementById('pwa-message').style.display = 'block';
}

export function showStep(imageSrc) {
    const instructionDiv = document.getElementById("instruction");
    const instructionImage = document.getElementById("instruction-image");

    instructionImage.src = imageSrc;

    // הצגת הדיב עם אנימציה
    instructionDiv.style.display = "flex";
    instructionDiv.style.height = "388px"; // גובה פתוח
    instructionDiv.style.transition = "height 0.5s ease"; // אנימציה חלקה
}

function hideStep() {
    const instructionDiv = document.getElementById("instruction");

    // סגירת הדיב
    instructionDiv.style.height = "0";
    setTimeout(() => {
        instructionDiv.style.display = "none";
    }, 500); 
}

document.getElementById("android-btn").addEventListener('click',(e)=>{
    console.log("click on android btn");
   let imageSrc = 'Instructions2.png';
    const instructionDiv = document.getElementById("instruction");
    const instructionImage = document.getElementById("instruction-image");

    instructionImage.src = imageSrc;

    // הצגת הדיב עם אנימציה
    instructionDiv.style.display = "flex";
    instructionDiv.style.height = "388px"; // גובה פתוח
    instructionDiv.style.transition = "height 0.5s ease"; // אנימציה חלקה
})


