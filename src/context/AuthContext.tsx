"use client";

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import SHA256 from "crypto-js/sha256";
import Hex from "crypto-js/enc-hex"; // for .toString(Hex)

interface User {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  role?: "admin" | "user";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("userData");
      if (storedUser) setUser(JSON.parse(storedUser));
      setIsLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const userData = doc.data();
        const hashedInput = SHA256(password).toString(Hex);
        const isValid = hashedInput === userData.password;

        if (isValid) {
          const currentUser: User = {
            id: doc.id,
            name: userData.name,
            email: userData.email,
            joinDate: userData.joinDate,
            role: userData.role || "user",
          };

          await AsyncStorage.setItem("userData", JSON.stringify(currentUser));
          setUser(currentUser);
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      console.log("Checking if user already exists...");
      const usersRef = collection(db, "users");

      const q = query(usersRef, where("email", "==", email));
      const existing = await getDocs(q);
      if (!existing.empty) {
        console.warn("Email already exists");
        return false;
      }

      console.log("Hashing password...");
      const hashedPassword = SHA256(password).toString(Hex);
      const role = email.endsWith("@admin.com") ? "admin" : "user";

      console.log("Saving new user to Firestore...");
      await addDoc(usersRef, {
        name,
        email,
        password: hashedPassword,
        role,
        joinDate: Timestamp.now().toDate().toISOString(),
      });

      console.log("Registration successful.");
      return true;
    } catch (error: any) {
      console.error("Registration error:", error.message || error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem("userData");
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const updateUser = async (userData: Partial<User>): Promise<void> => {
    try {
      if (user) {
        const updatedUser = { ...user, ...userData };
        await AsyncStorage.setItem("userData", JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (error) {
      console.error("Update user error:", error);
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      console.log("Password reset requested for:", email);
      return true;
    } catch (error) {
      console.error("Password reset error:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, register, logout, resetPassword, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
