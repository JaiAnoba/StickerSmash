"use client"

import type React from "react"
import { TouchableOpacity, View, Text, StyleSheet, Image } from "react-native"
import { useTheme } from "../context/ThemeContext"
import { useNotifications } from "../context/NotificationContext"

interface NotificationButtonProps {
  onPress: () => void
}

const NotificationButton: React.FC<NotificationButtonProps> = ({ onPress }) => {
  const { colors, isDarkMode } = useTheme()
  const { unreadCount } = useNotifications()

  return (
    <TouchableOpacity
      style={[
        styles.notificationButton,
        {
          backgroundColor: isDarkMode ? "rgba(255,255,255,0.1)" : "#F0F0F0",
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: "https://img.icons8.com/fluency-systems-regular/48/appointment-reminders--v1.png" }}
        style={[styles.notificationImage, { tintColor: isDarkMode ? "white" : "black" }]}
      />
      {unreadCount > 0 && (
        // <View style={[styles.badgeWrapper]}>
          <View style={[styles.badge, { backgroundColor: colors.primary }]}>
            <Text style={styles.badgeText}>{unreadCount > 99 ? "99+" : unreadCount}</Text>
          </View>
        // </View>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  notificationImage: {
    width: 20,
    height: 20,
  },
  badge: {
    position: "absolute",
    top: 1,
    right: 0.5,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
})

export default NotificationButton
