"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { Burger } from "../types/Burger"
import { burgerImages } from '../data/burgerImages';

import { db } from "../../firebase";
import { collection, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";
import { useAuth } from "./AuthContext";

interface FavoritesContextType {
  favorites: Burger[]
  addFavorite: (burger: Burger) => void
  removeFavorite: (burgerId: string) => void
  isFavorite: (burgerId: string) => boolean 
  clearFavorites: () => void
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

interface FavoritesProviderProps {
  children: ReactNode
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<Burger[]>([])
  const { user } = useAuth();

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = async () => {
    try {
      if (user) {
        const ref = collection(db, "users", user.id, "favorites");
        const snapshot = await getDocs(ref);
        const data = snapshot.docs.map(doc => doc.data() as Burger);
        setFavorites(data);
        await AsyncStorage.setItem("favorites", JSON.stringify(data));
      } else {
        const saved = await AsyncStorage.getItem("favorites");
        if (saved) setFavorites(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  const saveFavorites = async (newFavorites: Burger[]) => {
    try {
      await AsyncStorage.setItem("favorites", JSON.stringify(newFavorites))
      setFavorites(newFavorites)
    } catch (error) {
      console.error("Error saving favorites:", error)
    }
  }

  const addFavorite = async (burger: Burger) => {
    if (!burger.image || !burgerImages[burger.image]) return;

    const exists = favorites.some(item => item.id === burger.id);
    if (exists) return;

    const newFavorites = [...favorites, burger];
    saveFavorites(newFavorites);

    // Sync to Firestore
    if (user) {
      try {
        const ref = doc(db, "users", user.id, "favorites", burger.id);
        await setDoc(ref, burger); // saves the full burger object
      } catch (error) {
        console.error("Error saving favorite to Firestore:", error);
      }
    }
  };

  const removeFavorite = async (burgerId: string) => {
    const newFavorites = favorites.filter(b => b.id !== burgerId);
    saveFavorites(newFavorites);

    if (user) {
      try {
        const ref = doc(db, "users", user.id, "favorites", burgerId);
        await deleteDoc(ref);
      } catch (error) {
        console.error("Error removing favorite from Firestore:", error);
      }
    }
  };

  const isFavorite = (burgerId: string): boolean => {
    return favorites.some((burger) => burger.id === burgerId)
  }

  const clearFavorites = () => {
    saveFavorites([])
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  return context
}
