// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//         navigator.serviceWorker.register('sw.js')
//             .then(registration => {
//                 console.log('Service Worker registered good: ', registration);
//             })
//             .catch(error => {
//                 console.log('Service Worker registration failed: ', error);
//             });
//     });
// }

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";// TODO: Add SDKs for Firebase products that you want to use
import { getMessaging, getToken } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-messaging.js";

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

if ('serviceWorker' in navigator && 'PushManager' in window) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js', { type: 'module' })
            .then(registration => {
                console.log('Service Worker registered successfully: ', registration);


                const messaging = getMessaging(app);
            })
            .catch(error => {
                console.log('Service Worker registration failed: ', error);
            });
    });
} else {
    console.log('Push notifications are not supported in this browser.');
}



// document.addEventListener('DOMContentLoaded', () => {
//     const iframe = document.getElementById('browser-container');
//     function loadWebsite(url) {
//         // const iframe = document.createElement('iframe');
//         iframe.src = url;
//         iframe.setAttribute('allow', 'fullscreen');
//         iframe.addEventListener('load', () => {
//             // Enable scrolling within the iframe
//               iframe.contentWindow.document.body.style.overflow = 'auto';
//             // const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
//             // iframeDoc.documentElement.style.overflow = 'hidden';
//             // iframeDoc.body.style.overflow = 'hidden';
//         });
//         // browserContainer.innerHTML = '';
//         //browserContainer.appendChild(iframe);
//     }
//     // Example usage:
//     loadWebsite('https://yaels936.wixsite.com/post');
// });


