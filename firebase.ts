// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0Svds5qTm4dVciUzvzMDDavKENqwdFeQ",
  authDomain: "tandeem-1b802.firebaseapp.com",
  projectId: "tandeem-1b802",
  storageBucket: "tandeem-1b802.firebasestorage.app",
  messagingSenderId: "284119809643",
  appId: "1:284119809643:web:9d90e3ff9128531189bb2e",
  measurementId: "G-5D3VYZPCMW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export { storage };
