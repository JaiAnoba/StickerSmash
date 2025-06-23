import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import React, { useState } from "react"
import { Image, TouchableOpacity, View } from "react-native"
import AddBurgerModal from "../components/AddBurgerModal"
import AIAssistantScreen from "./AIAssistantScreen"
import FavoritesScreen from "./FavoritesScreen"
import HomeScreen from "./HomeScreen"
import ProfileScreen from "./ProfileScreen"

const Tab = createBottomTabNavigator()

const MainScreen: React.FC = () => {
  const [addBurgerVisible, setAddBurgerVisible] = useState(false)

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarHideOnKeyboard: false,
          keyboardHidesTabBar: false,
          tabBarIcon: ({ focused }) => {
            let iconSource = ""
            switch (route.name) {
              case "Home":
                iconSource = focused
                  ? "https://img.icons8.com/fluency-systems-filled/96/home.png"
                  : "https://img.icons8.com/fluency-systems-regular/96/home--v1.png"
                break
              case "Favorites":
                iconSource = focused
                  ? "https://img.icons8.com/puffy-filled/64/like.png"
                  : "https://img.icons8.com/puffy/64/like.png"
                break
              case "AI Assistant":
                iconSource = focused
                  ? "https://img.icons8.com/fluency-systems-filled/96/speech-bubble-with-dots.png"
                  : "https://img.icons8.com/fluency-systems-regular/96/speech-bubble-with-dots--v1.png"
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
                style={{ width: 20, height: 20, tintColor: "#fff" }}
                resizeMode="contain"
              />
            )
          },
          tabBarStyle: {
            position: "absolute",
            bottom: 15,
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
        <Tab.Screen
          name="Add"
          component={HomeScreen}
          options={{
            tabBarButton: (props) => (
              <TouchableOpacity
                onPress={() => setAddBurgerVisible(true)}
                style={{
                  top: -20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 35,
                    backgroundColor: "#B91C1C",
                    justifyContent: "center",
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 5,
                    elevation: 5,
                  }}
                >
                  <Image
                    source={{ uri: "https://img.icons8.com/ios-glyphs/90/plus-math.png" }}
                    style={{ width: 25, height: 25, tintColor: "#fff" }}
                  />
                </View>
              </TouchableOpacity>
            ),
          }}
        />
        <Tab.Screen name="AI Assistant" component={AIAssistantScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>

      {/* Add Burger Modal */}
      <AddBurgerModal visible={addBurgerVisible} onClose={() => setAddBurgerVisible(false)} />
    </>
  )
}

export default MainScreen