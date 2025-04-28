// firebase.js

// Import necessary Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-analytics.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDgoc4Zx064nL1iydJbccI692HDpu8gLLE",
  authDomain: "capstone-project-312dc.firebaseapp.com",
  projectId: "capstone-project-312dc",
  storageBucket: "capstone-project-312dc.firebasestorage.app",
  messagingSenderId: "82712440613",
  appId: "1:82712440613:web:124a86e48a3b9c3e6bf4cc",
  measurementId: "G-YFF9RVYJ9C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Export Firestore instance
export { db };