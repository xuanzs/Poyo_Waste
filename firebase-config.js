import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDgoc4Zx064nL1iydJbccI692HDpu8gLLE",
    authDomain: "capstone-project-312dc.firebaseapp.com",
    projectId: "capstone-project-312dc",
    storageBucket: "capstone-project-312dc.appspot.com",
    messagingSenderId: "82712440613",
    appId: "1:82712440613:web:124a86e48a3b9c3e6bf4cc",
    measurementId: "G-YFF9RVYJ9C"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

// // Request notification permission
// export const requestForToken = async () => {
//     try {
//       const token = await getToken(messaging, { 
//         vapidKey: "YOUR_VAPID_KEY" // From Firebase Console → Cloud Messaging
//       });
//       console.log("FCM Token:", token);
//       return token; // Send this to your backend for user association
//     } catch (err) {
//       console.error("Failed to get FCM token", err);
//     }
//   };
  
//   // Listen for foreground messages
//   export const onMessageListener = () =>
//     new Promise((resolve) => {
//       onMessage(messaging, (payload) => {
//         console.log("Message received:", payload);
//         resolve(payload);
//       });
//     });
  
//   export { messaging };