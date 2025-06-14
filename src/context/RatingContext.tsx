"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { db } from "../../firebase";
import { collection, query, where, getDocs, setDoc, doc, Timestamp } from "firebase/firestore";
import { useAuth } from "./AuthContext";

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
  const { user } = useAuth(); 

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
    if (!user) return;

    const newRating: Rating = {
      burgerId,
      rating,
      date: new Date().toISOString(),
    };

    // Local cache update
    const existingIndex = ratings.findIndex((r) => r.burgerId === burgerId);
    let updatedRatings: Rating[];

    if (existingIndex >= 0) {
      updatedRatings = [...ratings];
      updatedRatings[existingIndex] = newRating;
    } else {
      updatedRatings = [...ratings, newRating];
    }

    setRatings(updatedRatings);
    await saveRatings(updatedRatings);

    // Firestore write
    const ratingRef = doc(db, "ratings", `${burgerId}_${user.id}`);
    await setDoc(ratingRef, {
      burgerId,
      rating,
      userId: user.id,
      userName: user.name,
      timestamp: Timestamp.now(),
    });
  };

  const getUserRating = (burgerId: string): number | null => {
    const userRating = ratings.find((r) => r.burgerId === burgerId)
    return userRating ? userRating.rating : null
  }

  const getAverageRating = (burgerId: string): number => {
    // In a real app, this would fetch from a backend
    // For now, we'll just return the user's rating or the default rating
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
