// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Aapka ZippyKart Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyCTPYITHNUzAWLdMXx9zraOJxyEp4mnXpk",
    authDomain: "zippykart-production-157e1.firebaseapp.com",
    projectId: "zippykart-production-157e1",
    storageBucket: "zippykart-production-157e1.firebasestorage.app",
    messagingSenderId: "803651431969",
    appId: "1:803651431969:web:7432f351ec9f5f0ec23d60"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Background Notification Handler (Jab user site par nahi hai)
messaging.onBackgroundMessage(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: 'https://cdn-icons-png.flaticon.com/512/3233/3233483.png', // Aapka ZippyKart Logo
        image: payload.notification.image // Rich Push Image (Ajio style)
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
