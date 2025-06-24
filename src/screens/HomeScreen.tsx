import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type React from "react"
import { useEffect, useState } from "react"
import { FlatList, Image, StatusBar, StyleSheet, TextInput, TouchableOpacity, View } from "react-native"
import type { RootStackParamList } from "../../App"
import BurgerCard from "../components/BurgerCard"
import Text from "../components/CustomText"
import FilterModal from "../components/FilterModal"
import NotificationButton from "../components/NotificationButton"
import NotificationModal from "../components/NotificationModal"
import ScreenWrapper from "../components/ScreenWrapper"
import { useBurgerData } from "../context/BurgerDataContext"
import { useFavorites } from "../context/FavoritesContext"
import { useTheme } from "../context/ThemeContext"
import { useFilters } from "../hooks/useFilters"
import type { Burger } from "../types/Burger"
import { TOP_LEVEL_CATEGORIES } from "../types/Filter"
import type { Notification } from "../types/Notification"
import BurgerDetailScreen from "./BurgerDetailScreen"

type NavigationProp = StackNavigationProp<RootStackParamList>

const HomeScreen: React.FC = () => {
  const { colors, isDarkMode } = useTheme()
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()
  const { allBurgers } = useBurgerData() 
  const navigation = useNavigation<NavigationProp>()

  // State
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [filterModalVisible, setFilterModalVisible] = useState(false)
  const [notificationModalVisible, setNotificationModalVisible] = useState(false)
  const [selectedBurger, setSelectedBurger] = useState<Burger | null>(null)
  const [burgerDetailVisible, setBurgerDetailVisible] = useState(false)

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
    burgers: allBurgers,
    searchQuery,
    selectedCategory,
    isFavorite,
  })

  const handleBurgerPress = (burger: Burger) => {
    setSelectedBurger(burger)
    setBurgerDetailVisible(true)
  }

  const handleCloseBurgerDetail = () => {
    setBurgerDetailVisible(false)
    setSelectedBurger(null)
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
    if (notification.actionUrl && notification.data) {
      if (notification.actionUrl === "BurgerDetail") {
        const burger = allBurgers.find((b) => b.id === notification.data.burgerId)
        if (burger) {
          handleBurgerPress(burger)
        }
      }
    }
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
    <View style={{ width: "48%", marginBlock: 16, paddingTop: 8 }}>
      <BurgerCard
        burger={item}
        isFavorite={isFavorite(item.id)}
        onPress={() => handleBurgerPress(item)}
        onFavoritePress={() => handleFavoritePress(item)}
      />
    </View>
  )

  // Background color based on theme
  const backgroundColor = isDarkMode ? colors.background : "white"

  useEffect(() => {
    updateCategoryFilter("All")
  }, [])

  return (
    <ScreenWrapper>
      <StatusBar
        backgroundColor={isDarkMode ? colors.statusBar : "#8B0000"}
        barStyle={isDarkMode ? "light-content" : "dark-content"}
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor }]}>
        <View style={styles.headerContent}>
          <View style={styles.profileAndText}>
            <View style={styles.headerTextContainer}>
              <Text weight="semiBold" style={[styles.headerLineOne, { color: colors.text }]}>
                Choose
              </Text>
              <Text style={styles.headerLineTwo}>
                <Text weight="semiBold" style={[{ color: colors.text }]}>
                  Your Favorite{" "}
                </Text>
                <Text weight="semiBold" style={styles.redText}>
                  Burger
                </Text>
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
            style={[
              styles.searchInput,
              {
                color: colors.text,
                fontFamily: "Poppins-Regular",
              },
            ]}
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
          data={TOP_LEVEL_CATEGORIES}
          renderItem={renderCategoryTab}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Burgers List */}
      <View style={styles.burgersSection}>
        {filteredBurgers.length === 0 ? (
          <View style={styles.emptyState}>
            <Text weight="semiBold" style={[styles.emptyTitle, { color: colors.text }]}>
              No burgers found
            </Text>
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
    fontSize: 20,
  },
  headerLineTwo: {
    fontSize: 25,
    marginBottom: -5,
    marginTop: -4,
  },
  redText: {
    color: "#B91C1C",
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
    fontSize: 14,
    top: 2,
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
    marginBottom: 10,
    alignItems: "center",
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
    paddingTop: 5,
    marginBottom: 60,
  },
  burgersList: {
    paddingBottom: 20,
  },
  burgerRow: {
    justifyContent: "space-between",
    gap: 10,
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
    fontSize: 13,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
})

export default HomeScreen
