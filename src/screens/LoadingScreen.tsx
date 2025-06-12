"use client"

import type React from "react"
import { View, ActivityIndicator, Text, StyleSheet } from "react-native"
import { useTheme } from "../context/ThemeContext"

const LoadingScreen: React.FC = () => {
  const { colors } = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={styles.logo}>🍔</Text>
      <ActivityIndicator size="large" color={colors.primary} style={styles.spinner} />
      <Text style={[styles.text, { color: colors.text }]}>Loading Burgify...</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    fontSize: 64,
    marginBottom: 20,
  },
  spinner: {
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
  },
})

export default LoadingScreen
