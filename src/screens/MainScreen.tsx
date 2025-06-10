"use client"

import type React from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { useTheme } from "../context/ThemeContext"
import HomeScreen from "./HomeScreen"
import FavoritesScreen from "./FavoritesScreen"
import AIAssistantScreen from "./AIAssistantScreen"
import ProfileScreen from "./ProfileScreen"

const Tab = createBottomTabNavigator()

const MainScreen: React.FC = () => {
  const { colors, isDarkMode } = useTheme()

  const getTabBarIcon = (routeName: string, focused: boolean) => {
    let icon = ""

    switch (routeName) {
      case "Home":
        icon = focused ? "🍔" : "🍔"
        break
      case "Favorites":
        icon = focused ? "❤️" : "🤍"
        break
      case "AI Assistant":
        icon = focused ? "🤖" : "🤖"
        break
      case "Profile":
        icon = focused ? "👤" : "👤"
        break
      default:
        icon = "📱"
    }

    return icon
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          const icon = getTabBarIcon(route.name, focused)
          return <span style={{ fontSize: 24 }}>{icon}</span>
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subtext,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          marginTop: 4,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarLabel: "Favorites",
        }}
      />
      <Tab.Screen
        name="AI Assistant"
        component={AIAssistantScreen}
        options={{
          tabBarLabel: "AI Chef",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
        }}
      />
    </Tab.Navigator>
  )
}

export default MainScreen
