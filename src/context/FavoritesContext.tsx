"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { Burger } from "../types/Burger"
import { burgerImages } from '../data/burgerImages';

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

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem("favorites")
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites))
      }
    } catch (error) {
      console.error("Error loading favorites:", error)
    }
  }

  const saveFavorites = async (newFavorites: Burger[]) => {
    try {
      await AsyncStorage.setItem("favorites", JSON.stringify(newFavorites))
      setFavorites(newFavorites)
    } catch (error) {
      console.error("Error saving favorites:", error)
    }
  }

  const addFavorite = (burger: Burger) => {
    if (!burger.image || !burgerImages[burger.image]) {
      console.warn(`Burger ${burger.name} has invalid or missing image key.`);
      return;
    }

    const exists = favorites.some(item => item.id === burger.id);
    if (!exists) {
      const newFavorites = [...favorites, burger];
      saveFavorites(newFavorites);
    }
  };


  const removeFavorite = (burgerId: string) => {
    const newFavorites = favorites.filter((burger) => burger.id !== burgerId)
    saveFavorites(newFavorites)
  }

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
