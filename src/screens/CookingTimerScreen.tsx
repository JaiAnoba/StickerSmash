import type { RouteProp } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import {
  Alert,
  BackHandler,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native"
import type { RootStackParamList } from "../../App"
import Button from "../components/Button"
import Text from "../components/CustomText"
import ScreenWrapper from "../components/ScreenWrapper"
import StarRating from "../components/StarRating"
import { useCooking } from "../context/CookingContext"
import { useRatings } from "../context/RatingContext"
import { useTheme } from "../context/ThemeContext"

type CookingTimerScreenNavigationProp = StackNavigationProp<RootStackParamList, "CookingTimer">
type CookingTimerScreenRouteProp = RouteProp<RootStackParamList, "CookingTimer">

interface Props {
  navigation: CookingTimerScreenNavigationProp
  route: CookingTimerScreenRouteProp
}

type TabType = "ingredients" | "instructions" | "tips"

const CookingTimerScreen: React.FC<Props> = ({ navigation, route }) => {
  const { burger } = route.params
  const { completeCooking, cancelCooking } = useCooking()
  const { getUserRating, addRating } = useRatings()
  const { colors, isDarkMode } = useTheme()

  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [time, setTime] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [userRating, setUserRating] = useState<number | null>(null)
  const [tempRating, setTempRating] = useState<number | null>(null)
  const [ratingSaved, setRatingSaved] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>("ingredients")

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const scrollViewRef = useRef<ScrollView>(null)

  useEffect(() => {
    // Load user's rating when the component mounts
    const rating = getUserRating(burger.id)
    setUserRating(rating)
    setTempRating(rating)
    setRatingSaved(rating !== null)
  }, [burger.id, getUserRating])

  useEffect(() => {
    // Handle back button press
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      handleBackPress()
      return true
    })

    return () => {
      backHandler.remove()
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1)
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, isPaused])

  const handleBackPress = () => {
    if (isActive) {
      Alert.alert("Exit Cooking", "Are you sure you want to exit? Your cooking progress will be lost.", [
        { text: "Cancel", style: "cancel" },
        { text: "Exit", style: "destructive", onPress: handleExit },
      ])
    } else {
      handleExit()
    }
  }

  const handleExit = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    cancelCooking()
    navigation.goBack()
  }

  const handleStart = () => {
    setIsActive(true)
    setIsPaused(false)
  }

  const handlePause = () => {
    setIsPaused(true)
  }

  const handleResume = () => {
    setIsPaused(false)
  }

  const handleComplete = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    completeCooking(time)

    Alert.alert("Cooking Completed!", `You've successfully cooked ${burger.name} in ${formatTime(time)}!`, [
      { text: "Great!", onPress: () => navigation.navigate("Main") },
    ])
  }

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    let result = ""
    if (hrs > 0) {
      result += `${hrs}h `
    }
    if (mins > 0 || hrs > 0) {
      result += `${mins}m `
    }
    result += `${secs}s`

    return result
  }

  const nextStep = () => {
    if (currentStep < burger.instructions.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleTempRatingChange = (rating: number) => {
    setTempRating(rating)
    setRatingSaved(false)
  }

  const handleSaveRating = () => {
    if (tempRating !== null) {
      addRating(burger.id, tempRating)
      setUserRating(tempRating)
      setRatingSaved(true)
      Alert.alert("Rating Saved", `You've rated ${burger.name} ${tempRating} stars!`)
    }
  }

  // Generate AI tips based on burger difficulty
  const getAITips = () => {
    const difficultyTips = {
      Easy: [
        "Keep the heat medium-high for a perfect sear.",
        "Don't press down on the patty while cooking to keep juices in.",
        "Let the burger rest for 2-3 minutes before serving.",
        "Toast the buns for extra flavor and texture.",
      ],
      Medium: [
        "For juicier burgers, add a small ice cube in the center of each patty.",
        "Create a small dimple in the center of the patty to prevent it from puffing up.",
        "Season the meat just before cooking, not in advance.",
        "For cheese burgers, add cheese during the last minute of cooking and cover to melt perfectly.",
        "Let the meat come to room temperature before cooking for even results.",
      ],
      Hard: [
        "For gourmet results, grind your own meat blend with a ratio of 80% lean to 20% fat.",
        "Handle the meat as little as possible to keep the texture light.",
        "Use a meat thermometer for perfect doneness: 125°F for rare, 135°F for medium-rare, 145°F for medium.",
        "Rest the burger on a wire rack instead of a plate to prevent the bottom from getting soggy.",
        "When adding toppings, consider the balance of flavors, textures, and temperatures.",
        "For the best sear, make sure your cooking surface is extremely hot before adding the patty.",
      ],
    }

    return difficultyTips[burger.difficulty as keyof typeof difficultyTips] || difficultyTips.Medium
  }

  // Render the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "ingredients":
        return (
          <View style={styles.tabContent}>
            <View style={styles.ingredientsList}>
              {burger.ingredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientItem}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.ingredientText}>{ingredient}</Text>
                </View>
              ))}
            </View>
          </View>
        )
      case "instructions":
        return (
          <View style={styles.tabContent}>
            <View style={styles.stepCard}>
              <Text style={styles.stepText}>{burger.instructions[currentStep]}</Text>
            </View>

            <View style={styles.stepNavigation}>
              <Button
                title="Previous"
                onPress={prevStep}
                variant="outline"
                disabled={currentStep === 0}
                style={{ flex: 1, marginRight: 5 }}
              />
              <Button
                title="Next"
                onPress={nextStep}
                variant="outline"
                disabled={currentStep === burger.instructions.length - 1}
                style={{ flex: 1, marginLeft: 5 }}
              />
            </View>

            <Text style={styles.stepCounter}>
              Step {currentStep + 1} of {burger.instructions.length}
            </Text>

            {currentStep === burger.instructions.length - 1 && (
              <View style={styles.ratingSection}>
                <Text weight="semiBold" style={styles.ratingTitle}>
                  How was this recipe?
                </Text>
                <View style={styles.ratingContainer}>
                  <StarRating
                    rating={tempRating || 0}
                    editable={true}
                    onRatingChange={handleTempRatingChange}
                    size={32}
                    color="#8B0000"
                  />
                  <Text style={styles.ratingText}>{tempRating ? `Your rating: ${tempRating}` : "Tap to rate"}</Text>
                  <Button
                    title={ratingSaved ? "Update Rating" : "Save Rating"}
                    onPress={handleSaveRating}
                    variant="primary"
                    disabled={tempRating === null}
                    style={styles.saveRatingButton}
                  />
                </View>
              </View>
            )}
          </View>
        )
      case "tips":
        return (
          <View style={styles.tabContent}>
            <View style={styles.tipsContainer}>
              <Text weight="semiBold" style={styles.tipsTitle}>
                Tips for {burger.difficulty} Burgers
              </Text>
              {getAITips().map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <Text style={styles.tipNumber}>{index + 1}</Text>
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          </View>
        )
      default:
        return null
    }
  }

  return (
    <ScreenWrapper scroll>
      <StatusBar backgroundColor={isDarkMode ? colors.statusBar : "#8B0000"} 
      barStyle={isDarkMode ? "light-content" : "dark-content"} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Image source={{ uri: "https://img.icons8.com/sf-black/100/back.png" }} style={styles.backIcon} />
        </TouchableOpacity>
        <Text weight="semiBold" style={styles.headerTitle}>
          Cooking
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.timerContainer}>
          <Text weight="bold" style={styles.timerText}>
            {formatTime(time)}
          </Text>
          <View style={styles.timerControls}>
            {!isActive ? (
              <Button title="Start Cooking" onPress={handleStart} variant="primary" size="large" />
            ) : isPaused ? (
              <Button
                title="Resume"
                onPress={handleResume}
                variant="primary"
                size="large"
                icon="https://img.icons8.com/ios-filled/50/ffffff/play.png"
              />
            ) : (
              <Button
                title="Pause"
                textColor="#000"
                backgroundColor="#d9d9d9"
                onPress={handlePause}
                variant="secondary"
                size="large"
                icon="https://img.icons8.com/ios-glyphs/60/pause--v1.png"
              />
            )}

            {isActive && (
              <Button
                title="Complete"
                onPress={handleComplete}
                variant="success"
                size="large"
                style={{ marginTop: 10 }}
              />
            )}

          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "ingredients" && styles.activeTab]}
            onPress={() => setActiveTab("ingredients")}
            >
            <Text weight='medium' style={[styles.tabText, activeTab === "ingredients" && styles.activeTabText]}>
                Ingredients
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "instructions" && styles.activeTab]}
            onPress={() => setActiveTab("instructions")}
          >
            <Text weight='medium' style={[styles.tabText, activeTab === "instructions" && styles.activeTabText]}>Instructions</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "tips" && styles.activeTab]}
            onPress={() => setActiveTab("tips")}
          >
            <Text weight='medium' style={[styles.tabText, activeTab === "tips" && styles.activeTabText]}>Tips</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {renderTabContent()}
      </ScrollView>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    backgroundColor: "#8B0000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomStartRadius: 50,
    borderBottomEndRadius: 50,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: "white",
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 30,
  },
  timerContainer: {
    alignItems: "center",
    padding: 20,
    marginInline: 15,
    marginTop: 20,
    marginBottom: 15,
    borderRadius: 15,
  },
  timerText: {
    fontSize: 48,
    color: "#8B0000",
    marginBottom: 20,
  },
  timerControls: {
    width: "100%",
  },
  tabsContainer: {
    flexDirection: "row",
    marginHorizontal: 15,
    marginBottom: 10,
   },
   tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#F9FAFB", 
   },
   activeTab: {
    borderBottomColor: "#8B0000", 
   },
  tabText: {
    fontSize: 14,
    color: "#666",
    },
    activeTabText: {
    color: "#8B0000",
  },
  tabContent: {
    padding: 15,
  },
  stepCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  stepText: {
    fontSize: 16,
    lineHeight: 24,
    color: "black",
  },
  stepCounter: {
    textAlign: "center",
    marginTop: 15,
    color: "#6B7280",
    fontSize: 14,
  },
  stepNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ingredientsList: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 18,
    color: "#8B0000",
    marginRight: 10,
  },
  ingredientText: {
    fontSize: 14,
    color: "black",
    flex: 1,
    lineHeight: 20,
  },
  tipsContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
  },
  tipsTitle: {
    fontSize: 18,
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  tipItem: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "flex-start",
  },
  tipNumber: {
    backgroundColor: "#8B0000",
    color: "white",
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: "center",
    lineHeight: 24,
    marginRight: 10,
    fontWeight: "bold",
  },
  tipText: {
    fontSize: 14,
    color: "black",
    flex: 1,
    lineHeight: 20,
  },
  ratingSection: {
    marginTop: 30,
    backgroundColor: "#F9FAFB",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
  },
  ratingTitle: {
    fontSize: 18,
    marginBottom: 15,
    color: "#333",
    textAlign: "center",
  },
  ratingContainer: {
    alignItems: "center",
    width: "100%",
  },
  ratingText: {
    marginTop: 10,
    marginBottom: 15,
    color: "#666",
    fontSize: 14,
  },
  saveRatingButton: {
    minWidth: 150,
  },
})

export default CookingTimerScreen
