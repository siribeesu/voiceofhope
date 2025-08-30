// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBKT_iQnDmlyuOEgp2lV5HDda4PzfKzmrc",
  authDomain: "voiceof-hope.firebaseapp.com",
  projectId: "voiceof-hope",
  storageBucket: "voiceof-hope.firebasestorage.app",
  messagingSenderId: "359076495899",
  appId: "1:359076495899:web:9aa26b278e6add27a4aebe",
  measurementId: "G-G4DBBZVLTF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export default app;