"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface Rating {
  burgerId: string
  rating: number
  date: string
}

interface RatingContextType {
  ratings: Rating[]
  addRating: (burgerId: string, rating: number) => Promise<void>
  getUserRating: (burgerId: string) => number | null
  getAverageRating: (burgerId: string) => number
}

const RatingContext = createContext<RatingContextType | undefined>(undefined)

export const RatingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ratings, setRatings] = useState<Rating[]>([])

  useEffect(() => {
    loadRatings()
  }, [])

  const loadRatings = async () => {
    try {
      const storedRatings = await AsyncStorage.getItem("userRatings")
      if (storedRatings) {
        setRatings(JSON.parse(storedRatings))
      }
    } catch (error) {
      console.error("Error loading ratings:", error)
    }
  }

  const saveRatings = async (newRatings: Rating[]) => {
    try {
      await AsyncStorage.setItem("userRatings", JSON.stringify(newRatings))
    } catch (error) {
      console.error("Error saving ratings:", error)
    }
  }

  const addRating = async (burgerId: string, rating: number) => {
    const newRating: Rating = {
      burgerId,
      rating,
      date: new Date().toISOString(),
    }

    // Check if user already rated this burger
    const existingIndex = ratings.findIndex((r) => r.burgerId === burgerId)

    let updatedRatings: Rating[]
    if (existingIndex >= 0) {
      // Update existing rating
      updatedRatings = [...ratings]
      updatedRatings[existingIndex] = newRating
    } else {
      // Add new rating
      updatedRatings = [...ratings, newRating]
    }

    setRatings(updatedRatings)
    await saveRatings(updatedRatings)
  }

  const getUserRating = (burgerId: string): number | null => {
    const userRating = ratings.find((r) => r.burgerId === burgerId)
    return userRating ? userRating.rating : null
  }

  const getAverageRating = (burgerId: string): number => {
    const userRating = getUserRating(burgerId)
    return userRating || 4.5 // Default to 4.5 if no user rating
  }

  return (
    <RatingContext.Provider value={{ ratings, addRating, getUserRating, getAverageRating }}>
      {children}
    </RatingContext.Provider>
  )
}

export const useRatings = () => {
  const context = useContext(RatingContext)
  if (context === undefined) {
    throw new Error("useRatings must be used within a RatingProvider")
  }
  return context
}
