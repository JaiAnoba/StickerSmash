"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, SafeAreaView, StatusBar, FlatList, TextInput, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RootStackParamList } from "../../App"
import { useTheme } from "../context/ThemeContext"
import { useFavorites } from "../context/FavoritesContext"
import { burgersData } from "../data/burgersData"
import type { Burger } from "../types/Burger"
import BurgerCard from "../components/BurgerCard"
import CategoryTab from "../components/CategoryTab"

type NavigationProp = StackNavigationProp<RootStackParamList>

const HomeScreen: React.FC = () => {
  const { colors, isDarkMode } = useTheme()
  const { favorites } = useFavorites()
  const navigation = useNavigation<NavigationProp>()

  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [filteredBurgers, setFilteredBurgers] = useState<Burger[]>(burgersData)

  const categories = ["All", "Classic", "Gourmet", "Vegetarian", "Spicy", "BBQ", "Healthy"]

  useEffect(() => {
    filterBurgers()
  }, [selectedCategory, searchQuery])

  const filterBurgers = () => {
    let filtered = burgersData

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((burger) => burger.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (burger) =>
          burger.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          burger.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          burger.ingredients.some((ingredient) => ingredient.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    setFilteredBurgers(filtered)
  }

  const handleBurgerPress = (burger: Burger) => {
    navigation.navigate("BurgerDetail", { burger })
  }

  const renderBurgerCard = ({ item }: { item: Burger }) => <BurgerCard burger={item} onPress={handleBurgerPress} />

  const renderCategoryTab = ({ item }: { item: string }) => (
    <CategoryTab category={item} isActive={selectedCategory === item} onPress={setSelectedCategory} />
  )

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 17) return "Good Afternoon"
    return "Good Evening"
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar backgroundColor={colors.statusBar} barStyle={isDarkMode ? "light-content" : "dark-content"} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}!</Text>
            <Text style={styles.headerTitle}>What burger are you craving?</Text>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => {
              /* Handle notifications */
            }}
          >
            <Text style={styles.notificationIcon}>🔔</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search burgers, ingredients..."
            placeholderTextColor={colors.subtext}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Categories</Text>
        <FlatList
          data={categories}
          renderItem={renderCategoryTab}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Text style={styles.statIcon}>🍔</Text>
          <Text style={[styles.statNumber, { color: colors.primary }]}>{filteredBurgers.length}</Text>
          <Text style={[styles.statLabel, { color: colors.subtext }]}>Recipes</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Text style={styles.statIcon}>❤️</Text>
          <Text style={[styles.statNumber, { color: colors.primary }]}>{favorites.length}</Text>
          <Text style={[styles.statLabel, { color: colors.subtext }]}>Favorites</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Text style={styles.statIcon}>⭐</Text>
          <Text style={[styles.statNumber, { color: colors.primary }]}>4.8</Text>
          <Text style={[styles.statLabel, { color: colors.subtext }]}>Rating</Text>
        </View>
      </View>

      {/* Burgers List */}
      <View style={styles.burgersSection}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {selectedCategory === "All" ? "All Burgers" : `${selectedCategory} Burgers`}
          </Text>
          {searchQuery && (
            <Text style={[styles.resultsCount, { color: colors.subtext }]}>{filteredBurgers.length} results</Text>
          )}
        </View>

        {filteredBurgers.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No burgers found</Text>
            <Text style={[styles.emptySubtitle, { color: colors.subtext }]}>
              Try adjusting your search or category filter
            </Text>
            <TouchableOpacity
              style={[styles.clearFiltersButton, { backgroundColor: colors.primary }]}
              onPress={() => {
                setSearchQuery("")
                setSelectedCategory("All")
              }}
            >
              <Text style={styles.clearFiltersText}>Clear Filters</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredBurgers}
            renderItem={renderBurgerCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.burgersList}
            columnWrapperStyle={styles.burgerRow}
          />
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  notificationIcon: {
    fontSize: 20,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: -10,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  clearIcon: {
    fontSize: 16,
    color: "#999",
    marginLeft: 8,
  },
  categoriesSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  categoriesList: {
    paddingHorizontal: 15,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    minWidth: 80,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  burgersSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  resultsCount: {
    fontSize: 14,
    fontStyle: "italic",
  },
  burgersList: {
    paddingBottom: 20,
  },
  burgerRow: {
    justifyContent: "space-between",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
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
    marginBottom: 30,
    lineHeight: 24,
  },
  clearFiltersButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  clearFiltersText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default HomeScreen
