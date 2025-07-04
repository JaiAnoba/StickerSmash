import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import * as Font from "expo-font"
import * as SplashScreen from "expo-splash-screen"
import { useCallback, useEffect, useState } from "react"
import { ActivityIndicator, View } from "react-native"

import { AuthProvider, useAuth } from "./src/context/AuthContext"
import { BurgerDataProvider } from "./src/context/BurgerDataContext"
import { CookingProvider } from "./src/context/CookingContext"
import { FavoritesProvider } from "./src/context/FavoritesContext"
import { NotificationProvider } from "./src/context/NotificationContext"
import { RatingProvider } from "./src/context/RatingContext"
import { ThemeProvider } from "./src/context/ThemeContext"

import BurgerDetailScreen from "./src/screens/BurgerDetailScreen"
import CookingHistoryScreen from "./src/screens/CookingHistoryScreen"
import CookingTimerScreen from "./src/screens/CookingTimerScreen"
import DataStorageScreen from "./src/screens/DataStorageScreen"
import EditProfileScreen from "./src/screens/EditProfileScreen"
import LoginScreen from "./src/screens/LoginScreen"
import MainScreen from "./src/screens/MainScreen"
import RegisterScreen from "./src/screens/RegisterScreen"
import SettingsScreen from "./src/screens/SettingsScreen"
import ShareAppScreen from "./src/screens/ShareAppScreen"
import ShoppingListScreen from "./src/screens/ShoppingListScreen"
import type { Burger } from "./src/types/Burger"

SplashScreen.preventAutoHideAsync()

const Stack = createStackNavigator<RootStackParamList>()

export type RootStackParamList = {
  Login: undefined
  Register: undefined
  Main: undefined
  BurgerDetail: { burger: Burger }
  EditProfile: undefined
  Settings: undefined
  CookingTimer: { burger: Burger }
  CookingHistory: undefined
  ShoppingList: undefined
  DataStorage: undefined
  ShareApp: undefined
}

const loadFonts = () =>
  Font.loadAsync({
    "Poppins-Regular": require("./assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("./assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("./assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("./assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Italic": require("./assets/fonts/Poppins-Italic.ttf"),
  })

const AppNavigator = () => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFFFFF" }}>
        <ActivityIndicator size="large" color="#8B0000" />
      </View>
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: true }}>
        {/* Login & Register */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />

        {/* App Screens */}
        {user && (
          <>
            <Stack.Screen name="Main" component={MainScreen} />
            <Stack.Screen name="BurgerDetail" component={BurgerDetailScreen} />
            <Stack.Screen name="CookingTimer" component={CookingTimerScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="CookingHistory" component={CookingHistoryScreen} />
            <Stack.Screen name="ShoppingList" component={ShoppingListScreen} />
            <Stack.Screen name="DataStorage" component={DataStorageScreen} />
            <Stack.Screen name="ShareApp" component={ShareAppScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer> 
  )
}

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false)

  useEffect(() => {
    async function prepare() {
      try {
        await loadFonts()
      } catch (e) {
        console.warn(e)
      } finally {
        setFontsLoaded(true)
      }
    }

    prepare()
  }, [])

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  if (!fontsLoaded) {
    return null
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <BurgerDataProvider>
      <ThemeProvider>
        <AuthProvider>
          <FavoritesProvider>
            <RatingProvider>
              <CookingProvider>
                <NotificationProvider>
                  <AppNavigator />
                </NotificationProvider>
              </CookingProvider>
            </RatingProvider>
          </FavoritesProvider>
        </AuthProvider>
      </ThemeProvider>
      </BurgerDataProvider>
    </View>
  )
}

export default App