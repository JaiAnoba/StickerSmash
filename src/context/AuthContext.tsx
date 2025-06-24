import AsyncStorage from "@react-native-async-storage/async-storage"
import type React from "react"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  password: string 
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
  resetPassword: (email: string) => Promise<boolean>
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
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Accept demo credentials or any email/password for demo purposes
      if (
        (email === "demo@burgerpedia.com" && password === "demo123") ||
        (email.includes("@") && password.length >= 3)
      ) {
        const userData: User = {
          id: Date.now().toString(),
          name: email === "demo@burgerpedia.com" ? "Demo User" : "User",
          email: email,
          password,
          joinDate: new Date().toISOString(),
          stats: {
            burgersViewed: 25,
            recipesCooked: 8,
            favoriteCategory: "Classic",
            totalCookTime: "3h 45m",
          },
        }

        await AsyncStorage.setItem("userToken", "mock-token-" + Date.now())
        await AsyncStorage.setItem("userData", JSON.stringify(userData))
        setUser(userData)
        return true
      }

      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, accept any valid input
      if (name.trim() && email.includes("@") && password.length >= 6) {
        const userData: User = {
          id: Date.now().toString(),
          name: name,
          email: email,
          password: password,
          joinDate: new Date().toISOString(),
          stats: {
            burgersViewed: 0,
            recipesCooked: 0,
            favoriteCategory: "None yet",
            totalCookTime: "0m",
          },
        }

        await AsyncStorage.setItem("userToken", "mock-token-" + Date.now())
        await AsyncStorage.setItem("userData", JSON.stringify(userData))
        setUser(userData)
        return true
      }

      return false
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

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, always return success
      // In a real app, you would call an API endpoint

      // Store the reset request in AsyncStorage for demo purposes
      await AsyncStorage.setItem("passwordResetRequested", email)

      return true
    } catch (error) {
      console.error("Password reset error:", error)
      return false
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        resetPassword,
      }}
    >
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