import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAVyQyPPAZcmJwYeG7Ra8R1plpsWXMl86Q",
  authDomain: "burgify-f72be.firebaseapp.com",
  projectId: "burgify-f72be",
  storageBucket: "burgify-f72be.firebasestorage.app",
  messagingSenderId: "511723624200",
  appId: "1:511723624200:web:85f76b90ca30a0669e3ebd",
  measurementId: "G-VMWVNYKF75"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);