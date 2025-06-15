"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  Image,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RootStackParamList } from "../../App"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"
import { useFavorites } from "../context/FavoritesContext"
import type { UserStats } from "../types/Burger"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useCooking } from "../context/CookingContext"
import Text from "../components/CustomText"

type NavigationProp = StackNavigationProp<RootStackParamList>

const ProfileScreen: React.FC = () => {
  const { colors, isDarkMode } = useTheme()
  const { user, logout } = useAuth()
  const { favorites } = useFavorites()
  const { getRecipesCooked, getTotalCookingTime } = useCooking()
  const navigation = useNavigation<NavigationProp>()
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [stats, setStats] = useState<UserStats>({
    recipesCooked: 0,
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

  const loadUserStats = async () => {
    try {
      // Get recipes cooked from cooking context
      const recipesCooked = getRecipesCooked()

      // Get total cooking time from cooking context
      const totalCookTime = getTotalCookingTime()

      setStats({
        recipesCooked,
        totalCookTime,
      })
    } catch (error) {
      console.error("Error loading user stats:", error)
      setStats({
        recipesCooked: getRecipesCooked(),
        totalCookTime: getTotalCookingTime(),
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

  const StatCard: React.FC<{ title: string; value: string; }> = ({ title, value, }) => (
    <View style={[styles.statCard, { backgroundColor: colors.inputBackground }]}>
      <Text weight = 'semiBold' style={[styles.statValue, { color: colors.primary }]}>{value}</Text>
      <Text style={[styles.statTitle, { color: colors.subtext }]}>{title}</Text>
    </View>
  )

  const MenuButton: React.FC<{
    title: string
    icon: string
    onPress: () => void
    subtitle?: string
  }> = ({ title, icon, onPress, subtitle }) => {
    const isLogout = title.toLowerCase() === "logout"

    return (
      <TouchableOpacity
        style={[
          styles.menuButton,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
        onPress={onPress}
      >
        <View style={styles.menuButtonLeft}>
          <Image
            source={{ uri: icon }}
            style={[
              styles.menuIconImage,
              isLogout && { tintColor: "#8B0000" },
            ]}
          />
          <View style={styles.menuTextContainer}>
            <Text
              weight="semiBold"
              style={[
                styles.menuTitle,
                { color: isLogout ? "black" : colors.text },
              ]}
            >
              {title}
            </Text>
            {subtitle && !isLogout && (
              <Text style={[styles.menuSubtitle, { color: colors.subtext }]}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>

        {!isLogout && (
          <Image
            source={{
              uri: "https://img.icons8.com/material-rounded/96/chevron-right.png",
            }}
            style={[styles.menuArrow, { tintColor: 'black' }]}
          />
        )}
      </TouchableOpacity>
    )
  }


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { paddingHorizontal: 20 }]}>
          <View style={styles.headerCenterWrapper}>
            <Text weight="semiBold" style={styles.headerText}>My Profile</Text>
          </View>
          <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate("Settings")}>
            <Image
              source={{ uri: "https://img.icons8.com/puffy/48/settings.png" }}
              style={styles.settingsIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer} >
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatar}>
                  <Text weight='semiBold' style={styles.avatarText}>{user?.name ? user.name.charAt(0).toUpperCase() : "👤"}</Text>
                </View>
              )}
            </View>
            <Text weight='semiBold' style={styles.userName}>{user?.name || "User"}</Text>
            <Text style={styles.userEmail}>{user?.email || "user@example.com"}</Text>
            <Text style={styles.joinDate}>
              Member since {user?.joinDate ? new Date(user.joinDate).toLocaleDateString() : "Today"}
            </Text>
          </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <Text weight='semiBold' style={[styles.sectionTitle, { color: colors.text }]}>Your Stats</Text>
          <View style={styles.statsGrid}>
            <StatCard title="Recipes Cooked" value={stats.recipesCooked.toString()} />
            <StatCard title="Total Cook Time" value={stats.totalCookTime} />
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menuContainer}>
          <Text weight='semiBold' style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>

          <MenuButton
            title="Edit Profile"
            subtitle="Update your personal information"
            icon="https://img.icons8.com/fluency-systems-regular/48/edit--v1.png"
            onPress={() => navigation.navigate("EditProfile")}
          />

          {/* <MenuButton
            title="Favorite Burgers"
            subtitle={`${favorites.length} saved burgers`}
            icon="https://img.icons8.com/puffy/48/like.png"
            onPress={() => navigation.navigate("Main")}
          /> */}

          <MenuButton
            title="Cooking History"
            subtitle="View your cooking journey"
            icon="https://img.icons8.com/fluency-systems-regular/48/activity-history.png"
            onPress={() => navigation.navigate("CookingHistory")}
          />

          <MenuButton
            title="Shopping List"
            subtitle="Manage your ingredient lists"
            icon="https://img.icons8.com/windows/48/shopping-cart.png"
            onPress={() => navigation.navigate("ShoppingList")}
          />

          {/* <MenuButton
            title="Data & Storage"
            subtitle="Manage your app data"
            icon="https://img.icons8.com/forma-light/48/data-backup.png"
            onPress={() => navigation.navigate("DataStorage")}
          /> */}

          <MenuButton
            title="Share App"
            subtitle="Tell friends about Burgerpedia"
            icon="https://img.icons8.com/forma-light/48/share.png"
            onPress={() => navigation.navigate("ShareApp")}
          />

          <View style={{ marginTop: 5, paddingBottom: 70 }}>
            <MenuButton
              title="Logout"
              subtitle=""
              icon="https://img.icons8.com/fluency-systems-filled/48/logout-rounded-left.png"
              onPress={handleLogout}
            />
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 30,
    alignItems: "center",
    position: "relative",
    justifyContent: "center",
    backgroundColor: '#8B0000',
  },
  headerCenterWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 20,
    alignItems: "center",
  },
  settingsButton: {
    position: "absolute",
    right: 20,
    top: 20,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
  },
  settingsIcon: {
    width: 22,
    height: 22,
    tintColor: "white",
  },
  profileInfo: {
    alignItems: "center",
    paddingBottom: 30,
    backgroundColor: '#8B0000',
    borderBottomStartRadius: 60,
    borderBottomEndRadius: 60,
  },
  avatarContainer: {
    position: "relative",
    paddingBottom: 25,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(222, 222, 222, 0.2)", 
  },
  avatarText: {
    fontSize: 30,
    color: "black",
  },
  userName: {
    fontSize: 17,
    color: "white",
    marginTop: -3,
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 12,
    color: "rgba(240, 240, 240, 0.8)",
    marginBottom: 5,
  },
  joinDate: {
    fontSize: 11,
    color: "rgba(234, 234, 234, 0.8)",
  },
  statsContainer: {
    paddingInline: 20,
    paddingTop: 30,
  },
  sectionTitle: {
    fontSize: 14,
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
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    textAlign: "center",
  },
  menuContainer: {
    paddingInline: 20,
    paddingBottom: 20,
    paddingTop: 15,
  },
  menuButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  menuButtonLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuIconImage: {
    width: 20,
    height: 20,
    marginRight: 12,
    resizeMode: 'contain',
  },
  menuArrow: {
    width: 16,
    height: 18,
    marginLeft: 8,
    tintColor: "black"
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 14,
  },
  menuSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
})

export default ProfileScreen
