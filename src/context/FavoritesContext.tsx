import type React from "react";
import { createContext, useContext, useState, type ReactNode } from "react";
import { burgerImages } from "../data/burgerImages";
import type { Burger } from "../types/Burger";

interface FavoritesContextType {
  favorites: Burger[]
  isFavorite: (burgerId: string) => boolean
  addFavorite: (burger: Burger) => void
  removeFavorite: (burgerId: string) => void
  clearFavorites: () => void
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

interface FavoritesProviderProps {
  children: ReactNode
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<Burger[]>([])

  const isFavorite = (burgerId: string): boolean => {
    return favorites.some((burger) => burger.id === burgerId)
  }

  const addFavorite = (burger: Burger) => {
    try {
      // Validate the burger object
      if (!burger || !burger.id) {
        console.warn("Invalid burger object passed to addFavorite:", burger)
        return
      }

      // Check if burger already exists in favorites
      const exists = favorites.some((item) => item.id === burger.id)
      if (exists) {
        console.log(`Burger ${burger.name} is already in favorites`)
        return
      }

      // Validate image based on burger type
      if (burger.isUserAdded) {
        if (!burger.image || typeof burger.image !== "string" || burger.image.length === 0) {
          console.warn(`User-added burger ${burger.name} has invalid image URI.`)
          return
        }
      } else {
        if (!burger.image || !burgerImages[burger.image as keyof typeof burgerImages]) {
          console.warn(`Default burger ${burger.name} has invalid or missing image key.`)
          return
        }
      }

      const newFavorites = [...favorites, burger]
      setFavorites(newFavorites)
      console.log(`Successfully added ${burger.name} to favorites`)
    } catch (error) {
      console.error("Error adding burger to favorites:", error)
    }
  }

  const removeFavorite = (burgerId: string) => {
    try {
      setFavorites((prev) => {
        const filtered = prev.filter((burger) => burger.id !== burgerId)
        console.log(`Removed burger ${burgerId} from favorites`)
        return filtered
      })
    } catch (error) {
      console.error("Error removing burger from favorites:", error)
    }
  }

  const clearFavorites = () => {
    setFavorites([])
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        addFavorite,
        removeFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  return context
}

