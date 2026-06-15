import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYI7j525KIc3HFvacp-I82Uwgk8NtZ1ac",
  authDomain: "creator-revenue-calc.firebaseapp.com",
  projectId: "creator-revenue-calc",
  storageBucket: "creator-revenue-calc.firebasestorage.app",
  messagingSenderId: "185412108613",
  appId: "1:185412108613:web:a28984a60fc3d8586e3e2c",
  measurementId: "G-KJQKG2ZZ30"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, analytics };
