"use client"

import React from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Image } from "react-native"
import HomeScreen from "./HomeScreen"
import FavoritesScreen from "./FavoritesScreen"
import AIAssistantScreen from "./AIAssistantScreen"
import ProfileScreen from "./ProfileScreen"

const Tab = createBottomTabNavigator()

const MainScreen: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconSource = ""

          switch (route.name) {
            case "Home":
              iconSource = focused
                ? "https://img.icons8.com/fluency-systems-filled/48/home.png"
                : "https://img.icons8.com/fluency-systems-regular/48/home--v1.png"
              break
            case "Favorites":
              iconSource = focused
                ? "https://img.icons8.com/puffy-filled/32/like.png"
                : "https://img.icons8.com/puffy/32/like.png"
              break
            case "AI Assistant":
              iconSource = focused
                ? "https://img.icons8.com/material-rounded/24/bot.png"
                : "https://img.icons8.com/material-outlined/24/bot.png"
              break
            case "Profile":
              iconSource = focused
                ? "https://img.icons8.com/fluency-systems-filled/48/user.png"
                : "https://img.icons8.com/fluency-systems-regular/48/user--v1.png"
              break
          }

          return (
            <Image
              source={{ uri: iconSource }}
              style={{
                width: 20,
                height: 20,
                tintColor: "#fff", 
              }}
              resizeMode="contain"
            />
          )
        },
        tabBarStyle: {
          position: "absolute",
          bottom: 10,
          left: 20,
          right: 20,
          backgroundColor: "#8B0000",
          borderRadius: 35,
          height: 66,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 0,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 10,
        },
        tabBarShowLabel: false,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="AI Assistant" component={AIAssistantScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}

export default MainScreen
