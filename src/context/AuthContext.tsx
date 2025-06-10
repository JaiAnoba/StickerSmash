"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface User {
  id: string
  name: string
  email: string
  joinDate: string
  stats?: {
    burgersViewed: number
    recipesCooked: number
    favoriteCategory: string
    totalCookTime: string
  }
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  updateUser: (userData: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuthState()
  }, [])

  const checkAuthState = async () => {
    try {
      const userToken = await AsyncStorage.getItem("userToken")
      const userData = await AsyncStorage.getItem("userData")

      if (userToken && userData) {
        setUser(JSON.parse(userData))
      }
    } catch (error) {
      console.error("Error checking auth state:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock successful login
      const userData: User = {
        id: "1",
        name: "John Doe",
        email: email,
        joinDate: new Date().toISOString(),
        stats: {
          burgersViewed: 25,
          recipesCooked: 8,
          favoriteCategory: "Classic",
          totalCookTime: "3h 45m",
        },
      }

      await AsyncStorage.setItem("userToken", "mock-token")
      await AsyncStorage.setItem("userData", JSON.stringify(userData))
      setUser(userData)
      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock successful registration
      const userData: User = {
        id: "1",
        name: name,
        email: email,
        joinDate: new Date().toISOString(),
        stats: {
          burgersViewed: 0,
          recipesCooked: 0,
          favoriteCategory: "None yet",
          totalCookTime: "0m",
        },
      }

      await AsyncStorage.setItem("userToken", "mock-token")
      await AsyncStorage.setItem("userData", JSON.stringify(userData))
      setUser(userData)
      return true
    } catch (error) {
      console.error("Registration error:", error)
      return false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem("userToken")
      await AsyncStorage.removeItem("userData")
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const updateUser = async (userData: Partial<User>): Promise<void> => {
    try {
      if (user) {
        const updatedUser = { ...user, ...userData }
        await AsyncStorage.setItem("userData", JSON.stringify(updatedUser))
        setUser(updatedUser)
      }
    } catch (error) {
      console.error("Update user error:", error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
