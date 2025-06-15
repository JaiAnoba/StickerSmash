"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface Colors {
  primary: string
  background: string
  card: string
  text: string
  subtext: string
  border: string
  inputBackground: string
  statusBar: string
}

interface ThemeContextType {
  isDarkMode: boolean
  colors: Colors
  toggleTheme: () => void
}

const lightColors: Colors = {
  primary: "#8B0000",
  background: "#FFFFFF",
  card: "#FFFFFF",
  text: "#000000",
  subtext: "#666666",
  border: "#E5E5E5",
  inputBackground: "#F5F5F5",
  statusBar: "#8B0000",
}

const darkColors: Colors = {
  primary: "#8B0000",
  background: "#121212",
  card: "#1E1E1E",
  text: "#FFFFFF",
  subtext: "#CCCCCC",
  border: "#333333",
  inputBackground: "#2A2A2A",
  statusBar: "#8B0000",
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    loadTheme()
  }, [])

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("isDarkMode")
      if (savedTheme !== null) {
        setIsDarkMode(JSON.parse(savedTheme))
      }
    } catch (error) {
      console.error("Error loading theme:", error)
    }
  }

  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode
      setIsDarkMode(newTheme)
      await AsyncStorage.setItem("isDarkMode", JSON.stringify(newTheme))
    } catch (error) {
      console.error("Error saving theme:", error)
    }
  }

  const colors = isDarkMode ? darkColors : lightColors

  return <ThemeContext.Provider value={{ isDarkMode, colors, toggleTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
