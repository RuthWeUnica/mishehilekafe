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
    });
} else {
    console.log('Push notifications are not supported in this browser.');
}

// messaging.getToken({ vapidKey: 'BKJdFLRgiRiRRNcNlQvRUDv15OIPDtaeXrIfeUClN9whgM1E1WIMt4AZlP8SPeV9vF1R6I3EZGO_OWyHzJTw73g' }).then((currentToken) => {
//     if (currentToken) {
//       // Send the token to your server and update the UI if necessary
//       // ...
//       console.log("currentToken",currentToken);
//       return currentToken;
//     } else {
//       // Show permission request UI
//       console.log('No registration token available. Request permission to generate one.');
//       // ...
//     }
//   }).catch((err) => {
//     console.log('An error occurred while retrieving token. ', err);
//     // ...
//   });
//   messaging.onMessage(payload => {
//     console.log('Message received. ', payload);
//     // ...
//   });



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


