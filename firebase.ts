// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBRvipUV0reaOH22eOH6oxhSnrvPk_5ZDA",
  authDomain: "amplified-alpha-445708-n5.firebaseapp.com",
  projectId: "amplified-alpha-445708-n5",
  storageBucket: "amplified-alpha-445708-n5.firebasestorage.app",
  messagingSenderId: "220898049197",
  appId: "1:220898049197:web:a0767071407746163c1a24",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };