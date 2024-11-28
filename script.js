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


Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      console.log('הרשאת Push ניתנה');
      
    //   const messaging = getMessaging(app); // אתחול Firebase Messaging כאן
    } else {
      console.log('המשתמש לא נתן הרשאת Push');
    }
  });
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js', { type: 'module' })
            .then(registration => {
                console.log('Service Worker registered successfully: ', registration);
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


