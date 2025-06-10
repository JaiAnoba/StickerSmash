"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  Image,
  Modal,
} from "react-native"
import { launchImageLibrary, type ImagePickerResponse, type MediaType } from "react-native-image-picker"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RootStackParamList } from "../../App"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"
import { useFavorites } from "../context/FavoritesContext"
import type { UserStats } from "../types/Burger"
import Button from "../components/Button"
import AsyncStorage from "@react-native-async-storage/async-storage"

type NavigationProp = StackNavigationProp<RootStackParamList>

const ProfileScreen: React.FC = () => {
  const { colors, isDarkMode } = useTheme()
  const { user, logout, updateUser } = useAuth()
  const { favorites } = useFavorites()
  const navigation = useNavigation<NavigationProp>()
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [isImageModalVisible, setIsImageModalVisible] = useState(false)
  const [stats, setStats] = useState<UserStats>({
    burgersViewed: 0,
    recipesCooked: 0,
    favoriteCategory: "None yet",
    totalCookTime: "0m",
  })

  useEffect(() => {
    loadUserStats()
    loadProfileImage()
  }, [favorites, user])

  const loadProfileImage = async () => {
    try {
      const savedImage = await AsyncStorage.getItem("profileImage")
      if (savedImage) {
        setProfileImage(savedImage)
      }
    } catch (error) {
      console.error("Error loading profile image:", error)
    }
  }

  const saveProfileImage = async (imageUri: string) => {
    try {
      await AsyncStorage.setItem("profileImage", imageUri)
      setProfileImage(imageUri)
    } catch (error) {
      console.error("Error saving profile image:", error)
    }
  }

  const handleImagePicker = () => {
    const options = {
      mediaType: "photo" as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8 as 0.8,
    }

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorMessage) {
        return
      }

      if (response.assets && response.assets[0]) {
        const imageUri = response.assets[0].uri
        if (imageUri) {
          saveProfileImage(imageUri)
          setIsImageModalVisible(false)
        }
      }
    })
  }

  const removeProfileImage = async () => {
    try {
      await AsyncStorage.removeItem("profileImage")
      setProfileImage(null)
      setIsImageModalVisible(false)
    } catch (error) {
      console.error("Error removing profile image:", error)
    }
  }

  const loadUserStats = () => {
    if (user?.stats) {
      const categoryCount: Record<string, number> = {}
      favorites.forEach((burger) => {
        categoryCount[burger.category] = (categoryCount[burger.category] || 0) + 1
      })

      let topCategory = "None yet"
      let maxCount = 0
      Object.entries(categoryCount).forEach(([category, count]) => {
        if (count > maxCount) {
          maxCount = count
          topCategory = category
        }
      })

      setStats({
        ...user.stats,
        favoriteCategory: favorites.length > 0 ? topCategory : "None yet",
      })
    } else {
      setStats({
        burgersViewed: Math.floor(Math.random() * 50) + 10,
        recipesCooked: Math.floor(Math.random() * 20) + 1,
        favoriteCategory: favorites.length > 0 ? favorites[0].category : "None yet",
        totalCookTime: `${Math.floor(Math.random() * 10) + 1}h ${Math.floor(Math.random() * 60)}m`,
      })
    }
  }

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout()
        },
      },
    ])
  }

  const StatCard: React.FC<{ title: string; value: string; icon: string }> = ({ title, value, icon }) => (
    <View style={[styles.statCard, { backgroundColor: colors.inputBackground }]}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={[styles.statValue, { color: colors.primary }]}>{value}</Text>
      <Text style={[styles.statTitle, { color: colors.subtext }]}>{title}</Text>
    </View>
  )

  const MenuButton: React.FC<{
    title: string
    icon: string
    onPress: () => void
    subtitle?: string
  }> = ({ title, icon, onPress, subtitle }) => (
    <TouchableOpacity
      style={[styles.menuButton, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
    >
      <View style={styles.menuButtonLeft}>
        <Text style={styles.menuIcon}>{icon}</Text>
        <View style={styles.menuTextContainer}>
          <Text style={[styles.menuTitle, { color: colors.text }]}>{title}</Text>
          {subtitle && <Text style={[styles.menuSubtitle, { color: colors.subtext }]}>{subtitle}</Text>}
        </View>
      </View>
      <Text style={[styles.menuArrow, { color: colors.primary }]}>→</Text>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.primary }]}>
          <View style={styles.profileInfo}>
            <TouchableOpacity style={styles.avatarContainer} onPress={() => setIsImageModalVisible(true)}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{user?.name ? user.name.charAt(0).toUpperCase() : "👤"}</Text>
                </View>
              )}
              <View style={styles.cameraIcon}>
                <Text style={styles.cameraText}>📷</Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.userName}>{user?.name || "User"}</Text>
            <Text style={styles.userEmail}>{user?.email || "user@example.com"}</Text>
            <Text style={styles.joinDate}>
              Member since {user?.joinDate ? new Date(user.joinDate).toLocaleDateString() : "Today"}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Stats</Text>
          <View style={styles.statsGrid}>
            <StatCard title="Burgers Viewed" value={stats.burgersViewed.toString()} icon="🍔" />
            <StatCard title="Recipes Cooked" value={stats.recipesCooked.toString()} icon="👨‍🍳" />
            <StatCard title="Favorite Category" value={stats.favoriteCategory} icon="❤️" />
            <StatCard title="Total Cook Time" value={stats.totalCookTime} icon="⏱️" />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={[styles.quickActionButton, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => navigation.navigate("Main")}
            >
              <Text style={styles.quickActionIcon}>🍔</Text>
              <Text style={[styles.quickActionText, { color: colors.text }]}>Browse</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickActionButton, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => navigation.navigate("Main")}
            >
              <Text style={styles.quickActionIcon}>❤️</Text>
              <Text style={[styles.quickActionText, { color: colors.text }]}>Favorites</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickActionButton, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => navigation.navigate("Main")}
            >
              <Text style={styles.quickActionIcon}>🤖</Text>
              <Text style={[styles.quickActionText, { color: colors.text }]}>AI Chef</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickActionButton, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => navigation.navigate("Settings")}
            >
              <Text style={styles.quickActionIcon}>⚙️</Text>
              <Text style={[styles.quickActionText, { color: colors.text }]}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menuContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>

          <MenuButton
            title="Edit Profile"
            subtitle="Update your personal information"
            icon="✏️"
            onPress={() => navigation.navigate("EditProfile")}
          />

          <MenuButton
            title="Favorite Burgers"
            subtitle={`${favorites.length} saved burgers`}
            icon="❤️"
            onPress={() => navigation.navigate("Main")}
          />

          <MenuButton
            title="Cooking History"
            subtitle="View your cooking journey"
            icon="📚"
            onPress={() => navigation.navigate("CookingHistory")}
          />

          <MenuButton
            title="Shopping List"
            subtitle="Manage your ingredient lists"
            icon="🛒"
            onPress={() => navigation.navigate("ShoppingList")}
          />

          <MenuButton
            title="Data & Storage"
            subtitle="Manage your app data"
            icon="📊"
            onPress={() => navigation.navigate("DataStorage")}
          />

          <MenuButton
            title="Share App"
            subtitle="Tell friends about Burgerpedia"
            icon="📤"
            onPress={() => navigation.navigate("ShareApp")}
          />

          <MenuButton
            title="Settings"
            subtitle="App preferences and configuration"
            icon="⚙️"
            onPress={() => navigation.navigate("Settings")}
          />

          <Button
            title="Logout"
            onPress={handleLogout}
            variant="danger"
            fullWidth
            style={styles.logoutButton}
            icon="🚪"
          />
        </View>
      </ScrollView>

      {/* Profile Image Modal */}
      <Modal
        visible={isImageModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsImageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Profile Picture</Text>

            <View style={styles.modalButtons}>
              <Button title="Choose from Gallery" onPress={handleImagePicker} icon="📷" style={styles.modalButton} />

              {profileImage && (
                <Button
                  title="Remove Picture"
                  onPress={removeProfileImage}
                  variant="danger"
                  icon="🗑️"
                  style={styles.modalButton}
                />
              )}

              <Button
                title="Cancel"
                onPress={() => setIsImageModalVisible(false)}
                variant="secondary"
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: "center",
  },
  profileInfo: {
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarText: {
    fontSize: 32,
    color: "white",
    fontWeight: "bold",
  },
  cameraIcon: {
    position: "absolute",
    bottom: -5,
    right: -5,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraText: {
    fontSize: 14,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 5,
  },
  joinDate: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
  },
  statsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    borderRadius: 15,
    padding: 15,
    width: "48%",
    alignItems: "center",
    marginBottom: 10,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    textAlign: "center",
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickActionButton: {
    width: "23%",
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  menuContainer: {
    padding: 20,
  },
  menuButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
  },
  menuButtonLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  menuSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  menuArrow: {
    fontSize: 16,
  },
  logoutButton: {
    marginTop: 20,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 350,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    gap: 10,
  },
  modalButton: {
    marginBottom: 5,
  },
})

export default ProfileScreen
