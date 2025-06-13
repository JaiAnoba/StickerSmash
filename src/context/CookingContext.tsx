"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { Burger } from "../types/Burger"

interface CookingSession {
  burgerId: string
  burgerName: string
  cookingTime: number // in seconds
  date: string
  completed: boolean
}

interface CookingContextType {
  cookingSessions: CookingSession[]
  currentSession: CookingSession | null
  startCooking: (burger: Burger) => void
  completeCooking: (elapsedTime: number) => void
  cancelCooking: () => void
  getTotalCookingTime: () => string
  getRecipesCooked: () => number
}

const CookingContext = createContext<CookingContextType | undefined>(undefined)

export const CookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cookingSessions, setCookingSessions] = useState<CookingSession[]>([])
  const [currentSession, setCurrentSession] = useState<CookingSession | null>(null)

  useEffect(() => {
    loadCookingSessions()
  }, [])

  const loadCookingSessions = async () => {
    try {
      const storedSessions = await AsyncStorage.getItem("cookingSessions")
      if (storedSessions) {
        setCookingSessions(JSON.parse(storedSessions))
      }
    } catch (error) {
      console.error("Error loading cooking sessions:", error)
    }
  }

  const saveCookingSessions = async (sessions: CookingSession[]) => {
    try {
      await AsyncStorage.setItem("cookingSessions", JSON.stringify(sessions))
    } catch (error) {
      console.error("Error saving cooking sessions:", error)
    }
  }

  const startCooking = (burger: Burger) => {
    const newSession: CookingSession = {
      burgerId: burger.id,
      burgerName: burger.name,
      cookingTime: 0,
      date: new Date().toISOString(),
      completed: false,
    }
    setCurrentSession(newSession)
  }

  const completeCooking = (elapsedTime: number) => {
    if (currentSession) {
      const completedSession: CookingSession = {
        ...currentSession,
        cookingTime: elapsedTime,
        completed: true,
      }

      const updatedSessions = [...cookingSessions, completedSession]
      setCookingSessions(updatedSessions)
      saveCookingSessions(updatedSessions)
      setCurrentSession(null)

      // Update user stats in AsyncStorage
      updateUserStats(completedSession)
    }
  }

  const cancelCooking = () => {
    setCurrentSession(null)
  }

  const updateUserStats = async (session: CookingSession) => {
    try {
      // Get current user stats
      const userStatsString = await AsyncStorage.getItem("userStats")
      const userStats = userStatsString
        ? JSON.parse(userStatsString)
        : {
            burgersViewed: 0,
            recipesCooked: 0,
            totalCookTime: 0, // in seconds
          }

      // Update stats
      userStats.recipesCooked += 1
      userStats.totalCookTime += session.cookingTime

      // Save updated stats
      await AsyncStorage.setItem("userStats", JSON.stringify(userStats))
    } catch (error) {
      console.error("Error updating user stats:", error)
    }
  }

  const getTotalCookingTime = (): string => {
    const totalSeconds = cookingSessions.reduce((total, session) => {
      return total + (session.completed ? session.cookingTime : 0)
    }, 0)

    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else {
      return `${minutes}m`
    }
  }

  const getRecipesCooked = (): number => {
    return cookingSessions.filter((session) => session.completed).length
  }

  return (
    <CookingContext.Provider
      value={{
        cookingSessions,
        currentSession,
        startCooking,
        completeCooking,
        cancelCooking,
        getTotalCookingTime,
        getRecipesCooked,
      }}
    >
      {children}
    </CookingContext.Provider>
  )
}

export const useCooking = () => {
  const context = useContext(CookingContext)
  if (context === undefined) {
    throw new Error("useCooking must be used within a CookingProvider")
  }
  return context
}
