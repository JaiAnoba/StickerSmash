"use client"

import type React from "react"
import { useState } from "react"
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  Text,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RootStackParamList } from "../../App"
import { useTheme } from "../context/ThemeContext"
import { useFavorites } from "../context/FavoritesContext"
import { burgersData } from "../data/burgersData"
import type { Burger } from "../types/Burger"
import type { Notification } from "../types/Notification"
import { CATEGORIES } from "../types/Filter"
import { useFilters } from "../hooks/useFilters"
import FilterModal from "../components/FilterModal"
import NotificationModal from "../components/NotificationModal"
import NotificationButton from "../components/NotificationButton"

type NavigationProp = StackNavigationProp<RootStackParamList>

const HomeScreen: React.FC = () => {
  const { colors, isDarkMode } = useTheme()
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()
  const navigation = useNavigation<NavigationProp>()

  // State
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [filterModalVisible, setFilterModalVisible] = useState(false)
  const [notificationModalVisible, setNotificationModalVisible] = useState(false)

  // Use the custom hook for filtering
  const {
    filterOptions,
    setFilterOptions,
    sortOption,
    setSortOption,
    filteredBurgers,
    resetFilters,
    updateCategoryFilter,
    hasActiveFilters,
  } = useFilters({
    burgers: burgersData,
    searchQuery,
    selectedCategory,
    isFavorite,
  })

  const handleBurgerPress = (burger: Burger) => {
    navigation.navigate("BurgerDetail", { burger })
  }

  const handleFavoritePress = (burger: Burger) => {
    if (isFavorite(burger.id)) {
      removeFavorite(burger.id)
    } else {
      addFavorite(burger)
    }
  }

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    updateCategoryFilter(category)
  }

  const handleResetFilters = () => {
    resetFilters()
    setSelectedCategory("All")
  }

  const handleNotificationPress = (notification: Notification) => {
    // Handle notification actions
    if (notification.actionUrl && notification.data) {
      if (notification.actionUrl === "BurgerDetail") {
        const burger = burgersData.find((b) => b.id === notification.data.burgerId)
        if (burger) {
          navigation.navigate("BurgerDetail", { burger })
        }
      }
    }
  }

  const renderStars = (rating: number): string => {
    const stars: string[] = []
    const fullStars: number = Math.floor(rating)
    const hasHalfStar: boolean = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push("★")
    }
    if (hasHalfStar) {
      stars.push("☆")
    }
    return stars.join("")
  }

  const renderCategoryTab = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.categoryTab,
        selectedCategory === item
          ? { backgroundColor: colors.primary }
          : { backgroundColor: isDarkMode ? "#2A2A2A" : "#FFFFFF" },
      ]}
      onPress={() => handleCategorySelect(item)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item
            ? { color: "#FFFFFF", fontWeight: "600" }
            : { color: isDarkMode ? colors.text : "#666666", fontWeight: "500" },
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  )

  const renderBurgerCard = ({ item }: { item: Burger }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => handleBurgerPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <TouchableOpacity
          style={[styles.favoriteButton, { backgroundColor: "rgba(255,255,255,0.9)" }]}
          onPress={() => handleFavoritePress(item)}
        >
          <Text style={styles.favoriteIcon}>{isFavorite(item.id) ? "❤️" : "🤍"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.text, fontWeight: "bold" }]} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={[styles.category, { color: colors.subtext }]}>{item.category}</Text>

        <View style={styles.footer}>
          <View style={styles.rating}>
            <Text style={[styles.stars, { color: colors.primary }]}>{renderStars(item.rating)}</Text>
            <Text style={[styles.ratingText, { color: colors.subtext }]}>{item.rating}</Text>
          </View>
          <Text style={[styles.cookTime, { color: colors.subtext }]}>{item.cookTime}</Text>
        </View>

        <View style={styles.difficulty}>
          <Text
            style={[
              styles.difficultyText,
              item.difficulty === "Easy" && styles.easy,
              item.difficulty === "Medium" && styles.medium,
              item.difficulty === "Hard" && styles.hard,
            ]}
          >
            {item.difficulty}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  // Background color based on theme
  const backgroundColor = isDarkMode ? colors.background : "white"

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar
        backgroundColor={isDarkMode ? colors.statusBar : "white"}
        barStyle={isDarkMode ? "light-content" : "dark-content"}
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor }]}>
        <View style={styles.headerContent}>
          <View style={styles.profileAndText}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
              }}
              style={styles.profileImage}
            />

            <View style={styles.headerTextContainer}>
              <Text style={[styles.headerLineOne, { color: colors.text }]}>Choose</Text>
              <Text style={styles.headerLineTwo}>
                <Text style={[styles.boldText, { color: colors.text }]}>Your Favorite </Text>
                <Text style={styles.redText}>Burger</Text>
              </Text>
            </View>
          </View>

          <NotificationButton onPress={() => setNotificationModalVisible(true)} />
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchWrapper}>
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: isDarkMode ? colors.inputBackground : "#F5F5F5",
              borderColor: isDarkMode ? colors.border : "transparent",
              borderWidth: isDarkMode ? 1 : 0,
            },
          ]}
        >
          <Image
            source={{
              uri: "https://img.icons8.com/fluency-systems-regular/48/search--v1.png",
            }}
            style={[styles.searchIcon, { tintColor: colors.subtext }]}
          />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search"
            placeholderTextColor={colors.subtext}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: colors.primary }]}
          onPress={() => setFilterModalVisible(true)}
        >
          <Image
            source={{
              uri: "https://img.icons8.com/sf-regular/48/FFFFFF/sorting-options.png",
            }}
            style={styles.filterIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.categoriesSection}>
        <FlatList
          data={CATEGORIES}
          renderItem={renderCategoryTab}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Burgers List */}
      <View style={styles.burgersSection}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontWeight: "bold" }]}>
            {selectedCategory === "All" ? "All Burgers" : `${selectedCategory} Burgers`}
          </Text>
          <View style={styles.resultsContainer}>
            <Text style={[styles.resultsCount, { color: colors.subtext }]}>
              {filteredBurgers.length} {filteredBurgers.length === 1 ? "result" : "results"}
            </Text>
          </View>
        </View>

        {filteredBurgers.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyTitle, { color: colors.text, fontWeight: "bold" }]}>No burgers found</Text>
            <Text style={[styles.emptySubtitle, { color: colors.subtext }]}>Try adjusting your search or filters</Text>
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

      {/* Filter Modal */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        filterOptions={filterOptions}
        setFilterOptions={setFilterOptions}
        sortOption={sortOption}
        setSortOption={setSortOption}
        onReset={handleResetFilters}
      />

      {/* Notification Modal */}
      <NotificationModal
        visible={notificationModalVisible}
        onClose={() => setNotificationModalVisible(false)}
        onNotificationPress={handleNotificationPress}
      />
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
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 10,
  },
  profileAndText: {
    flexDirection: "column",
  },
  headerTextContainer: {
    marginTop: 10,
  },
  headerLineOne: {
    fontSize: 18,
    fontWeight: "600",
  },
  headerLineTwo: {
    fontSize: 25,
    fontWeight: "bold",
  },
  boldText: {
    fontWeight: "bold",
  },
  redText: {
    color: "#B91C1C",
    fontWeight: "bold",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginRight: 20,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: -10,
    marginBottom: 20,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    paddingHorizontal: 16,
    height: 48,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    width: 17,
    height: 17,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filterButton: {
    marginLeft: 12,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  filterIcon: {
    width: 20,
    height: 20,
    tintColor: "#FFFFFF",
  },
  categoriesSection: {
    marginBottom: 20,
  },
  categoriesList: {
    paddingHorizontal: 15,
  },
  categoryTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
  },
  categoryText: {
    fontSize: 14,
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
  sectionTitle: {
    fontSize: 18,
  },
  resultsContainer: {
    flexDirection: "row",
    alignItems: "center",
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
  card: {
    borderRadius: 15,
    marginBottom: 16,
    width: "48%",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    overflow: "hidden",
    borderWidth: 1,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 140,
    resizeMode: "cover",
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteIcon: {
    fontSize: 16,
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    marginBottom: 4,
    lineHeight: 20,
  },
  category: {
    fontSize: 12,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
  },
  stars: {
    fontSize: 14,
    marginRight: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "500",
  },
  cookTime: {
    fontSize: 12,
    fontWeight: "500",
  },
  difficulty: {
    alignSelf: "flex-start",
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  easy: {
    backgroundColor: "#DCFCE7",
    color: "#166534",
  },
  medium: {
    backgroundColor: "#FEF3C7",
    color: "#92400E",
  },
  hard: {
    backgroundColor: "#FEE2E2",
    color: "#B91C1C",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
})

export default HomeScreen
