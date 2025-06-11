"use client"

import type React from "react"
import { View, Text, StyleSheet, Modal, FlatList, TouchableOpacity, SafeAreaView, StatusBar, Alert } from "react-native"
import { useTheme } from "../context/ThemeContext"
import { useNotifications } from "../context/NotificationContext"
import type { Notification } from "../types/Notification"

interface NotificationModalProps {
  visible: boolean
  onClose: () => void
  onNotificationPress?: (notification: Notification) => void
}

const NotificationModal: React.FC<NotificationModalProps> = ({ visible, onClose, onNotificationPress }) => {
  const { colors, isDarkMode } = useTheme()
  const { notifications, markAsRead, markAllAsRead, deleteNotification, clearAllNotifications } = useNotifications()

  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date()
    const notificationTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`

    const diffInWeeks = Math.floor(diffInDays / 7)
    return `${diffInWeeks}w ago`
  }

  const getTypeColor = (type: string): string => {
    switch (type) {
      case "recipe":
        return "#8B0000"
      case "achievement":
        return "#FFD700"
      case "tip":
        return "#4CAF50"
      case "update":
        return "#2196F3"
      case "reminder":
        return "#FF9800"
      default:
        return colors.primary
    }
  }

  const handleNotificationPress = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
    if (onNotificationPress) {
      onNotificationPress(notification)
    }
    onClose()
  }

  const handleDeleteNotification = (notificationId: string) => {
    Alert.alert("Delete Notification", "Are you sure you want to delete this notification?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteNotification(notificationId),
      },
    ])
  }

  const handleClearAll = () => {
    Alert.alert("Clear All Notifications", "Are you sure you want to clear all notifications?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear All",
        style: "destructive",
        onPress: clearAllNotifications,
      },
    ])
  }

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        {
          backgroundColor: item.read ? colors.card : isDarkMode ? "#2A2A2A" : "#F8F9FA",
          borderColor: colors.border,
        },
      ]}
      onPress={() => handleNotificationPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <View style={styles.notificationLeft}>
            <Text style={styles.notificationIcon}>{item.icon}</Text>
            <View style={styles.notificationTextContainer}>
              <Text style={[styles.notificationTitle, { color: colors.text }]} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={[styles.notificationTime, { color: colors.subtext }]}>{formatTimeAgo(item.timestamp)}</Text>
            </View>
          </View>
          <View style={styles.notificationRight}>
            {!item.read && <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteNotification(item.id)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={[styles.deleteIcon, { color: colors.subtext }]}>×</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={[styles.notificationMessage, { color: colors.subtext }]} numberOfLines={2}>
          {item.message}
        </Text>
        <View style={[styles.typeBadge, { backgroundColor: getTypeColor(item.type) }]}>
          <Text style={styles.typeBadgeText}>{item.type.toUpperCase()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar backgroundColor={colors.statusBar} barStyle={isDarkMode ? "light-content" : "dark-content"} />

        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.primary }]}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Notifications</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        {notifications.length > 0 && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={markAllAsRead}
            >
              <Text style={[styles.actionButtonText, { color: colors.text }]}>Mark All Read</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={handleClearAll}
            >
              <Text style={[styles.actionButtonText, { color: "#DC3545" }]}>Clear All</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Notifications</Text>
            <Text style={[styles.emptySubtitle, { color: colors.subtext }]}>
              You're all caught up! New notifications will appear here.
            </Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            renderItem={renderNotificationItem}
            contentContainerStyle={styles.notificationsList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
  },
  actionButtons: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  notificationsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  notificationItem: {
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  notificationContent: {
    padding: 16,
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  notificationLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },
  notificationIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  notificationTime: {
    fontSize: 12,
  },
  notificationRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  deleteButton: {
    padding: 4,
  },
  deleteIcon: {
    fontSize: 20,
    fontWeight: "bold",
  },
  notificationMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
    marginLeft: 32,
  },
  typeBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 32,
  },
  typeBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
})

export default NotificationModal
