"use client"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { View, ActivityIndicator } from "react-native"
import { ThemeProvider } from "./src/context/ThemeContext"
import { AuthProvider, useAuth } from "./src/context/AuthContext"
import { FavoritesProvider } from "./src/context/FavoritesContext"
import LoginScreen from "./src/screens/LoginScreen"
import RegisterScreen from "./src/screens/RegisterScreen"
import MainScreen from "./src/screens/MainScreen"
import BurgerDetailScreen from "./src/screens/BurgerDetailScreen"
import EditProfileScreen from "./src/screens/EditProfileScreen"
import SettingsScreen from "./src/screens/SettingsScreen"
import CookingHistoryScreen from "./src/screens/CookingHistoryScreen"
import ShoppingListScreen from "./src/screens/ShoppingListScreen"
import DataStorageScreen from "./src/screens/DataStorageScreen"
import ShareAppScreen from "./src/screens/ShareAppScreen"
import type { Burger } from "./src/types/Burger"

const Stack = createStackNavigator<RootStackParamList>();

export type RootStackParamList = {
  Login: undefined
  Register: undefined
  Main: undefined
  BurgerDetail: { burger: Burger }
  EditProfile: undefined
  Settings: undefined
  CookingHistory: undefined
  ShoppingList: undefined
  DataStorage: undefined
  ShareApp: undefined
}

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
      <Stack.Navigator
        initialRouteName={user ? "Main" : "Login"}
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
        }}
      >
        {user ? (
          // Authenticated screens
          <>
            <Stack.Screen name="Main" component={MainScreen} />
            <Stack.Screen name="BurgerDetail" component={BurgerDetailScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="CookingHistory" component={CookingHistoryScreen} />
            <Stack.Screen name="ShoppingList" component={ShoppingListScreen} />
            <Stack.Screen name="DataStorage" component={DataStorageScreen} />
            <Stack.Screen name="ShareApp" component={ShareAppScreen} />
          </>
        ) : (
          // Authentication screens
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FavoritesProvider>
          <AppNavigator />
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
