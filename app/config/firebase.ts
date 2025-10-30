import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import Constants from "expo-constants";

const extra = Constants.expoConfig?.extra || {};

const firebaseConfig = {
  apiKey: extra.firebaseApiKey || "AIzaSyBDQq49wYQw3fmodsm0RW7CwyoZ7_eq8cI", // hardcode here temporarily
  authDomain:
    extra.firebaseAuthDomain || "godiyaoni-express-delivery.firebaseapp.com",
  projectId: extra.firebaseProjectId || "godiyaoni-express-delivery",
  storageBucket:
    extra.firebaseStorageBucket || "godiyaoni-express-delivery.appspot.com",
  messagingSenderId: extra.firebaseMessagingSenderId || "1234567890",
  appId: extra.firebaseAppId || "1:1234567890:web:abcdef123456",
  measurementId: extra.firebaseMeasurementId || "G-ABCDEFG123",
};

// ✅ Check if loaded properly
console.log(
  "Firebase API Key:",
  firebaseConfig.apiKey ? "Loaded ✅" : "❌ Missing"
);

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export default { auth, db };
