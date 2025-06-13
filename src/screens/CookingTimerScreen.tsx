"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  BackHandler,
  ScrollView,
} from "react-native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RouteProp } from "@react-navigation/native"
import type { RootStackParamList } from "../../App"
import { useCooking } from "../context/CookingContext"
import { useRatings } from "../context/RatingContext"
import Text from "../components/CustomText"
import Button from "../components/Button"
import StarRating from "../components/StarRating"

type CookingTimerScreenNavigationProp = StackNavigationProp<RootStackParamList, "CookingTimer">
type CookingTimerScreenRouteProp = RouteProp<RootStackParamList, "CookingTimer">

interface Props {
  navigation: CookingTimerScreenNavigationProp
  route: CookingTimerScreenRouteProp
}

const CookingTimerScreen: React.FC<Props> = ({ navigation, route }) => {
  const { burger } = route.params
  const { completeCooking, cancelCooking } = useCooking()
  const { getUserRating, addRating } = useRatings()

  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [time, setTime] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [userRating, setUserRating] = useState<number | null>(null)
  const [tempRating, setTempRating] = useState<number | null>(null)
  const [ratingSaved, setRatingSaved] = useState(false)

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

  // Scroll to the bottom when reaching the last step
  useEffect(() => {
    if (currentStep === burger.instructions.length - 1) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true })
      }, 300)
    }
  }, [currentStep, burger.instructions.length])

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#8B0000" barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text weight="semiBold" style={styles.headerTitle}>
          Cooking: {burger.name}
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
              <Button title="Start Cooking" onPress={handleStart} variant="primary" icon="🍳" />
            ) : isPaused ? (
              <Button title="Resume" onPress={handleResume} variant="primary" icon="▶️" />
            ) : (
              <Button title="Pause" onPress={handlePause} variant="secondary" icon="⏸️" />
            )}

            {isActive && (
              <Button title="Complete" onPress={handleComplete} variant="success" icon="✅" style={{ marginTop: 10 }} />
            )}
          </View>
        </View>

        <View style={styles.instructionsContainer}>
          <Text weight="semiBold" style={styles.instructionsTitle}>
            Step {currentStep + 1} of {burger.instructions.length}
          </Text>

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

        <View style={styles.ingredientsContainer}>
          <Text weight="semiBold" style={styles.ingredientsTitle}>
            Ingredients Needed
          </Text>
          <View style={styles.ingredientsList}>
            {burger.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientItem}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.ingredientText}>{ingredient}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    color: "white",
    fontSize: 20,
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
    backgroundColor: "white",
    margin: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  timerText: {
    fontSize: 48,
    color: "#8B0000",
    marginBottom: 20,
  },
  timerControls: {
    width: "100%",
  },
  instructionsContainer: {
    backgroundColor: "white",
    margin: 15,
    marginTop: 0,
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  instructionsTitle: {
    fontSize: 18,
    marginBottom: 15,
    color: "#333",
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
    color: "#4B5563",
  },
  stepNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ingredientsContainer: {
    backgroundColor: "white",
    margin: 15,
    marginTop: 0,
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ingredientsTitle: {
    fontSize: 18,
    marginBottom: 15,
    color: "#333",
  },
  ingredientsList: {
    marginBottom: 10,
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
    color: "#4B5563",
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
