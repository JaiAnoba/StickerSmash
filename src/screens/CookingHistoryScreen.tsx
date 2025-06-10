"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, SafeAreaView, StatusBar, FlatList, Alert } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useTheme } from "../context/ThemeContext"
import type { Burger } from "../types/Burger"
import Button from "../components/Button"

interface CookingRecord {
  id: string
  burger: Burger
  cookedAt: string
  cookTime: string
  rating?: number
  notes?: string
}

const CookingHistoryScreen: React.FC = () => {
  const { colors, isDarkMode } = useTheme()
  const [cookingHistory, setCookingHistory] = useState<CookingRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCookingHistory()
  }, [])

  const loadCookingHistory = async () => {
    try {
      const history = await AsyncStorage.getItem("cookingHistory")
      if (history) {
        setCookingHistory(JSON.parse(history))
      }
    } catch (error) {
      console.error("Error loading cooking history:", error)
    } finally {
      setLoading(false)
    }
  }

  const clearHistory = () => {
    Alert.alert("Clear History", "Are you sure you want to clear all cooking history?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("cookingHistory")
            setCookingHistory([])
          } catch (error) {
            console.error("Error clearing history:", error)
          }
        },
      },
    ])
  }

  const renderStars = (rating: number): string => {
    return "★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating))
  }

  const renderHistoryItem = ({ item }: { item: CookingRecord }) => (
    <View style={[styles.historyItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.historyHeader}>
        <Text style={[styles.burgerName, { color: colors.text }]}>{item.burger.name}</Text>
        <Text style={[styles.cookDate, { color: colors.subtext }]}>{new Date(item.cookedAt).toLocaleDateString()}</Text>
      </View>

      <Text style={[styles.category, { color: colors.subtext }]}>{item.burger.category}</Text>

      <View style={styles.historyDetails}>
        <Text style={[styles.cookTime, { color: colors.subtext }]}>Cook Time: {item.cookTime}</Text>
        {item.rating && (
          <Text style={[styles.rating, { color: colors.primary }]}>
            {renderStars(item.rating)} ({item.rating}/5)
          </Text>
        )}
      </View>

      {item.notes && <Text style={[styles.notes, { color: colors.text }]}>Notes: {item.notes}</Text>}
    </View>
  )

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading history...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar backgroundColor={colors.statusBar} barStyle={isDarkMode ? "light-content" : "dark-content"} />

      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerTitle}>Cooking History</Text>
      </View>

      {cookingHistory.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>👨‍🍳</Text>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No Cooking History</Text>
          <Text style={[styles.emptySubtitle, { color: colors.subtext }]}>
            Start cooking some burgers to see your history here!
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.statsHeader}>
            <Text style={[styles.totalRecords, { color: colors.text }]}>
              Total Recipes Cooked: {cookingHistory.length}
            </Text>
            <Button title="Clear History" onPress={clearHistory} variant="danger" size="small" icon="🗑️" />
          </View>

          <FlatList
            data={cookingHistory}
            keyExtractor={(item) => item.id}
            renderItem={renderHistoryItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
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
  statsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  totalRecords: {
    fontSize: 16,
    fontWeight: "600",
  },
  listContainer: {
    padding: 20,
    paddingTop: 0,
  },
  historyItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  burgerName: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    marginRight: 10,
  },
  cookDate: {
    fontSize: 14,
    fontWeight: "500",
  },
  category: {
    fontSize: 14,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  historyDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cookTime: {
    fontSize: 14,
  },
  rating: {
    fontSize: 14,
    fontWeight: "500",
  },
  notes: {
    fontSize: 14,
    fontStyle: "italic",
    marginTop: 4,
  },
})

export default CookingHistoryScreen
