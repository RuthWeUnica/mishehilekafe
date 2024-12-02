Notification.requestPermission().then(permission => {
    if (permission === "granted") {
        console.log("Notification permission granted.");
        showNotification();

        // Additional logic for getting token or handling messages
    } else {
        console.log("Notification permission denied.");
    }
});


function showNotification() {
    let notificationOptions = {
        body: 'TEST',
        icon: '/singleCoffeeCup.png'
    }
    let notif = new Notification('קיבלת הודעה חדשה!', notificationOptions);

}

if ('serviceWorker' in navigator && 'PushManager' in window) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js', { type: 'module' })
            .then(registration => {
                console.log('Service Worker registered successfully: ', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed: ', error);
            });
        navigator.serviceWorker
            .register('firebase-messaging-sw.js', { type: 'module' })
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


window.addEventListener("message", e => {
    console.log("message from wix", e);
    document.getElementById("wix-iframe").contentWindow.postMessage("send message to wix from site!");
})




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


