import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type React from "react"
import { useState } from "react"
import { Alert, FlatList, StatusBar, StyleSheet, TouchableOpacity, View } from "react-native"
import type { RootStackParamList } from "../../App"
import BurgerCard from "../components/BurgerCard"
import Text from "../components/CustomText"
import ScreenWrapper from "../components/ScreenWrapper"
import { useFavorites } from "../context/FavoritesContext"
import { useTheme } from "../context/ThemeContext"
import type { Burger } from "../types/Burger"
import BurgerDetailScreen from "./BurgerDetailScreen"

type NavigationProp = StackNavigationProp<RootStackParamList>

const FavoritesScreen: React.FC = () => {
  const { colors, isDarkMode } = useTheme()
  const { favorites, removeFavorite } = useFavorites()
  const navigation = useNavigation<NavigationProp>()
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [selectedBurger, setSelectedBurger] = useState<Burger | null>(null)
  const [burgerDetailVisible, setBurgerDetailVisible] = useState(false)

  const categories = ["All", ...Array.from(new Set(favorites.map((burger) => burger.category)))]

  const filteredFavorites =
    selectedCategory === "All" ? favorites : favorites.filter((burger) => burger.category === selectedCategory)

  const handleBurgerPress = (burger: Burger) => {
    setSelectedBurger(burger)
    setBurgerDetailVisible(true)
  }

  const handleCloseBurgerDetail = () => {
    setBurgerDetailVisible(false)
    setSelectedBurger(null)
  }

  const handleRemoveFavorite = (burger: Burger) => {
    Alert.alert("Remove Favorite", `Remove "${burger.name}" from favorites?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => removeFavorite(burger.id),
      },
    ])
  }

  const renderBurgerCard = ({ item }: { item: Burger }) => (
    <View style={styles.cardContainer}>
      <BurgerCard
        burger={item}
        isFavorite={true}
        onPress={() => handleBurgerPress(item)}
        onFavoritePress={() => handleRemoveFavorite(item)}
      />
    </View>
  )

  const CategoryTab: React.FC<{ category: string; isActive: boolean }> = ({ category, isActive }) => (
    <TouchableOpacity
      style={[
        styles.categoryTab,
        { backgroundColor: colors.card, borderColor: colors.border },
        isActive && { backgroundColor: colors.primary },
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text style={[styles.categoryText, { color: colors.text }, isActive && { color: "white" }]}>{category}</Text>
    </TouchableOpacity>
  )

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Text weight="semiBold" style={[styles.emptyTitle, { color: colors.text }]}>
        No Favorites Yet
      </Text>
      <Text style={[styles.emptyText, { color: colors.subtext }]}>
        Start exploring burgers and tap the heart icon to add them to your favorites!
      </Text>
    </View>
  )

  return (
    <ScreenWrapper>
      <StatusBar backgroundColor="#8B0000" barStyle={isDarkMode ? "light-content" : "dark-content"} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text weight="semiBold" style={styles.headerTitle}>
          My Favorites
        </Text>
        <Text style={styles.headerSubtitle}>
          {favorites.length} {favorites.length === 1 ? "burger" : "burgers"}
        </Text>
      </View>

      {favorites.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Categories */}
          {categories.length > 1 && (
            <View style={styles.categoriesContainer}>
              <FlatList
                data={categories}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item}
                renderItem={({ item }) => <CategoryTab category={item} isActive={selectedCategory === item} />}
                contentContainerStyle={styles.categoriesContent}
              />
            </View>
          )}

          {/* Favorites List */}
          <View style={styles.content}>
            <FlatList
              data={filteredFavorites}
              renderItem={renderBurgerCard}
              keyExtractor={(item) => item.id}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.favoritesList}
              ListEmptyComponent={() => (
                <View style={styles.emptyCategory}>
                  <Text style={[styles.emptyCategoryText, { color: colors.subtext }]}>
                    No {selectedCategory.toLowerCase()} favorites yet
                  </Text>
                </View>
              )}
            />
          </View>
        </>
      )}

      {/* Burger Detail Modal */}
      {selectedBurger && (
        <BurgerDetailScreen
          burger={selectedBurger}
          visible={burgerDetailVisible}
          onClose={handleCloseBurgerDetail}
          navigation={navigation}
        />
      )}
    </ScreenWrapper>
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
    borderBottomStartRadius: 60,
    borderBottomEndRadius: 60,
  },
  headerTitle: {
    fontSize: 20,
    color: "white",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
  },
  categoriesContainer: {
    paddingVertical: 15,
  },
  categoriesContent: {
    paddingHorizontal: 20,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  content: {
    marginBottom: 230,
    top: 5,
    paddingInline: 10,
  },
  favoritesList: {
    paddingTop: 15,
    paddingLeft: 9,
  },
  cardContainer: {
    position: "relative",
    marginBottom: 25,
    marginTop: 15,
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
  },
  emptyCategory: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyCategoryText: {
    fontSize: 16,
    textAlign: "center",
  },
})

export default FavoritesScreen
