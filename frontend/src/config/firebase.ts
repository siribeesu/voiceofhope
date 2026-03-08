// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGwBxlk6cKtRq5XlWmy6toqwYtSgYstW4",
  authDomain: "voiceofhope-87105.firebaseapp.com",
  projectId: "voiceofhope-87105",
  storageBucket: "voiceofhope-87105.firebasestorage.app",
  messagingSenderId: "558885101040",
  appId: "1:558885101040:web:14cd9e622658d419a95135",
  measurementId: "G-NZ6469E0EW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
export default app;