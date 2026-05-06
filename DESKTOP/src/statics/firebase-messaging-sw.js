importScripts('https://www.gstatic.com/firebasejs/7.2.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/7.2.0/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyBs1-42BzURQw1RvlRkGWRY1mWA44VpJQw",
    authDomain: "testapi-281700.firebaseapp.com",
    databaseURL: "https://testapi-281700-default-rtdb.firebaseio.com",
    projectId: "testapi-281700",
    storageBucket: "testapi-281700.appspot.com",
    messagingSenderId: "707108675052",
    appId: "1:707108675052:web:ef1c4d0f9fb864436d74c9",
    measurementId: "G-H71R89VTDP"
};
// // Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
        body: 'Background Message body.',
        icon: '/firebase-logo.png'
    };

    return self.registration.showNotification(notificationTitle,
        notificationOptions);
});