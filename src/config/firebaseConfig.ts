import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAVyQyPPAZcmJwYeG7Ra8R1plpsWXMl86Q",
  authDomain: "burgify-f72be.firebaseapp.com",
  projectId: "burgify-f72be",
  storageBucket: "burgify-f72be.appspot.com",
  messagingSenderId: "511723624200",
  appId: "1:511723624200:web:85f76b90ca30a0669e3ebd",
  measurementId: "G-VMWVNYKF75",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);

export { auth, app };
