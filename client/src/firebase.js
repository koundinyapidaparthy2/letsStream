import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "letsstream-4da5f.firebaseapp.com",
  projectId: "letsstream-4da5f",
  storageBucket: "letsstream-4da5f.firebasestorage.app",
  messagingSenderId: "857388377508",
  appId: "1:857388377508:web:50c11253fd17a359c80d31"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();

export default app;
