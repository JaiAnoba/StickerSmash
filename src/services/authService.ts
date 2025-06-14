import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { app } from "../config/firebaseConfig"; 

const auth = getAuth(app);

// Register
export const register = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Login
export const login = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Logout
export const logout = () => {
  return signOut(auth);
};
