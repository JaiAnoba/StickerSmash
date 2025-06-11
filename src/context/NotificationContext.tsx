"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { Notification } from "../types/Notification"
import { mockNotifications } from "../data/notificationsData"

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (notificationId: string) => void
  markAllAsRead: () => void
  deleteNotification: (notificationId: string) => void
  clearAllNotifications: () => void
  addNotification: (notification: Omit<Notification, "id" | "timestamp">) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

interface NotificationProviderProps {
  children: ReactNode
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      const savedNotifications = await AsyncStorage.getItem("notifications")
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications))
      } else {
        // First time loading, use mock data
        setNotifications(mockNotifications)
        await AsyncStorage.setItem("notifications", JSON.stringify(mockNotifications))
      }
    } catch (error) {
      console.error("Error loading notifications:", error)
      setNotifications(mockNotifications)
    }
  }

  const saveNotifications = async (newNotifications: Notification[]) => {
    try {
      await AsyncStorage.setItem("notifications", JSON.stringify(newNotifications))
      setNotifications(newNotifications)
    } catch (error) {
      console.error("Error saving notifications:", error)
    }
  }

  const markAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map((notification) =>
      notification.id === notificationId ? { ...notification, read: true } : notification,
    )
    saveNotifications(updatedNotifications)
  }

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((notification) => ({ ...notification, read: true }))
    saveNotifications(updatedNotifications)
  }

  const deleteNotification = (notificationId: string) => {
    const updatedNotifications = notifications.filter((notification) => notification.id !== notificationId)
    saveNotifications(updatedNotifications)
  }

  const clearAllNotifications = () => {
    saveNotifications([])
  }

  const addNotification = (notificationData: Omit<Notification, "id" | "timestamp">) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    }
    const updatedNotifications = [newNotification, ...notifications]
    saveNotifications(updatedNotifications)
  }

  const unreadCount = notifications.filter((notification) => !notification.read).length

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
