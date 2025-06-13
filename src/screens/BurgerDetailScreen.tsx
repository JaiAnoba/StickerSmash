"use client"

import { FC } from "react"
import { useState, useEffect } from "react"
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, SafeAreaView, StatusBar } from "react-native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RouteProp } from "@react-navigation/native"
import type { RootStackParamList } from "../../App"
import { burgerImages } from "../data/burgerImages"
import Text from "../components/CustomText"
// Add imports for the new components and contexts
import { useRatings } from "../context/RatingContext"
import { useCooking } from "../context/CookingContext"
import StarRating from "../components/StarRating"

type BurgerDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, "BurgerDetail">
type BurgerDetailScreenRouteProp = RouteProp<RootStackParamList, "BurgerDetail">

interface Props {
  navigation: BurgerDetailScreenNavigationProp
  route: BurgerDetailScreenRouteProp
}

type TabType = "details" | "ingredients" | "instructions"

// Update the BurgerDetailScreen component to include rating functionality and Let's Start button
const BurgerDetailScreen: FC<Props> = ({ navigation, route }) => {
  const { burger } = route.params
  const [activeTab, setActiveTab] = useState<TabType>("details")
  const { getUserRating, addRating } = useRatings()
  const { startCooking } = useCooking()
  const [userRating, setUserRating] = useState<number | null>(null)

  useEffect(() => {
    // Load user's rating when the component mounts
    const rating = getUserRating(burger.id)
    setUserRating(rating)
  }, [burger.id, getUserRating])

  const handleRatingChange = (rating: number) => {
    setUserRating(rating)
    addRating(burger.id, rating)
  }

  const handleStartCooking = () => {
    startCooking(burger)
    navigation.navigate("CookingTimer", { burger })
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

  // Modify the renderTabContent function to include the user rating UI in the details tab
  const renderTabContent = (): JSX.Element | null => {
    switch (activeTab) {
      case "details":
        return (
          <View style={styles.tabContent}>
            <Text style={styles.description}>{burger.description}</Text>
            <View style={styles.metaInfo}>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Difficulty</Text>
                <Text
                  weight="semiBold"
                  style={[
                    styles.metaValue,
                    burger.difficulty === "Easy" && styles.easyText,
                    burger.difficulty === "Medium" && styles.mediumText,
                    burger.difficulty === "Hard" && styles.hardText,
                  ]}
                >
                  {burger.difficulty}
                </Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Cook Time</Text>
                <Text weight="semiBold" style={styles.metaValue}>
                  {burger.cookTime}
                </Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Rating</Text>
                <View style={styles.ratingContainer}>
                  <Text style={styles.stars}>{renderStars(burger.rating)}</Text>
                  <Text weight="semiBold" style={styles.ratingValue}>
                    {burger.rating}
                  </Text>
                </View>
              </View>
            </View>

            {/* User Rating Section */}
            <View style={styles.userRatingSection}>
              <Text weight="semiBold" style={styles.userRatingTitle}>
                Rate this burger
              </Text>
              <View style={styles.userRatingContainer}>
                <StarRating
                  rating={userRating || 0}
                  editable={true}
                  onRatingChange={handleRatingChange}
                  size={32}
                  color="#8B0000"
                />
                <Text style={styles.userRatingText}>{userRating ? `Your rating: ${userRating}` : "Tap to rate"}</Text>
              </View>
            </View>

            {/* Let's Start Button */}
            <TouchableOpacity style={styles.startButton} onPress={handleStartCooking}>
              <Text weight="semiBold" style={styles.startButtonText}>
                Let's Start Cooking!
              </Text>
            </TouchableOpacity>
          </View>
        )
      case "ingredients":
        return (
          <View style={styles.tabContent}>
            <Text weight="semiBold" style={styles.sectionTitle}>
              Ingredients
            </Text>
            {burger.ingredients.map((ingredient: string, index: number) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>{ingredient}</Text>
              </View>
            ))}
          </View>
        )
      case "instructions":
        return (
          <View style={styles.tabContent}>
            <Text weight="semiBold" style={styles.sectionTitle}>
              Cooking Instructions
            </Text>
            {burger.instructions.map((instruction: string, index: number) => (
              <View key={index} style={styles.instructionItem}>
                <View style={styles.stepNumber}>
                  <Text weight="semiBold" style={styles.stepNumberText}>
                    {index + 1}
                  </Text>
                </View>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>
        )
      default:
        return null
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#8B0000" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={{ uri: "https://img.icons8.com/sf-black/100/back.png" }} style={styles.backIcon} />
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.favoriteButton}>
          <Text style={styles.favoriteIcon}>♡</Text>
        </TouchableOpacity> */}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Image Section */}
        <View style={styles.imageContainer}>
          <Image source={burgerImages[burger.image]} style={styles.burgerImage} />
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text weight="semiBold" style={styles.burgerName}>
            {burger.name}
          </Text>
          <Text weight="medium" style={styles.burgerCategory}>
            {burger.category}
          </Text>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "details" && styles.activeTab]}
              onPress={() => setActiveTab("details")}
            >
              <Text style={[styles.tabText, activeTab === "details" && styles.activeTabText]}>Details</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "ingredients" && styles.activeTab]}
              onPress={() => setActiveTab("ingredients")}
            >
              <Text style={[styles.tabText, activeTab === "ingredients" && styles.activeTabText]}>Ingredients</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "instructions" && styles.activeTab]}
              onPress={() => setActiveTab("instructions")}
            >
              <Text style={[styles.tabText, activeTab === "instructions" && styles.activeTabText]}>Instructions</Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          {renderTabContent()}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

// Add these styles to the existing StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#8B0000",
  },
  header: {
    backgroundColor: "#8B0000",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(215, 214, 214, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: "white",
  },
  backButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteIcon: {
    color: "white",
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    backgroundColor: "#8B0000",
    paddingBottom: 30,
    alignItems: "center",
  },
  burgerImage: {
    width: 280,
    height: 280,
    resizeMode: "cover",
    zIndex: 999,
  },
  infoSection: {
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -155,
    paddingTop: 120,
    paddingHorizontal: 20,
    flex: 1,
  },
  burgerName: {
    fontSize: 21,
    color: "#333",
    textAlign: "left",
    marginBottom: 2,
  },
  burgerCategory: {
    fontSize: 14,
    color: "#8B0000",
    textAlign: "left",
    marginBottom: 30,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontWeight: "600",
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    borderRadius: 25,
    padding: 4,
    marginBottom: 25,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#8B0000",
  },
  tabText: {
    fontSize: 14,
    color: "#666",
  },
  activeTabText: {
    color: "white",
  },
  tabContent: {
    paddingBottom: 30,
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 24,
    marginBottom: 25,
    textAlign: "center",
  },
  metaInfo: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#F9FAFB",
    borderRadius: 15,
    padding: 20,
    marginBottom: 55,
  },
  metaItem: {
    alignItems: "center",
  },
  metaLabel: {
    fontSize: 11,
    color: "#666",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: 14,
    color: "#333",
  },
  easyText: {
    color: "#059669",
    fontSize: 14,
  },
  mediumText: {
    color: "#D97706",
    fontSize: 14,
  },
  hardText: {
    color: "#B91C1C",
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stars: {
    color: "#B91C1C",
    fontSize: 14,
    marginRight: 4,
  },
  ratingValue: {
    fontSize: 14,
    color: "#333",
  },
  sectionTitle: {
    fontSize: 18,
    color: "#333",
    marginBottom: 20,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  bullet: {
    fontSize: 20,
    color: "#B91C1C",
    marginRight: 12,
    marginTop: 2,
  },
  listText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
    top: 6,
    flex: 1,
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  stepNumber: {
    width: 26,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#8B0000",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    color: "white",
    fontSize: 14,
  },
  instructionText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
    top: 7,
    flex: 1,
  },
  userRatingSection: {
    marginTop: 20,
    marginBottom: 30,
    backgroundColor: "#F9FAFB",
    borderRadius: 15,
    padding: 20,
  },
  userRatingTitle: {
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  userRatingContainer: {
    alignItems: "center",
  },
  userRatingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 14,
  },
  startButton: {
    backgroundColor: "#8B0000",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  startButtonText: {
    color: "white",
    fontSize: 16,
  },
})

export default BurgerDetailScreen
