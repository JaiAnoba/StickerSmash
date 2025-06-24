import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios";
import { API_URL } from "../utils/env";
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
  loginWithGoogleToken: (token: string) => Promise<void>
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
      const res = await axios.post(`${API_URL}/signin`, { email, password }, { withCredentials: true });
      if (res.data && res.data.token) {
        await AsyncStorage.setItem("userToken", res.data.token);
        await AsyncStorage.setItem("userData", JSON.stringify({ email }));
        setUser({ email, id: "", name: "", password: "", joinDate: "" });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const res = await axios.post(`${API_URL}/signup`, { fullName: name, email, password }, { withCredentials: true });
      if (res.data && res.data.token) {
        await AsyncStorage.setItem("userToken", res.data.token);
        await AsyncStorage.setItem("userData", JSON.stringify({ email, name }));
        setUser({ email, name, id: "", password: "", joinDate: "" });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };

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
      const res = await axios.post(`${API_URL}/forgot-password`, { email }, { withCredentials: true });
      if (res.data && res.data.message) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Password reset error:", error);
      return false;
    }
  }

  const loginWithGoogleToken = async (token: string): Promise<void> => {
    try {
      await AsyncStorage.setItem('userToken', token);
      // Optionally fetch user info from backend using token
      // For now, just set a minimal user object
      setUser({ email: '', id: '', name: '', password: '', joinDate: '' });
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

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
        loginWithGoogleToken,
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