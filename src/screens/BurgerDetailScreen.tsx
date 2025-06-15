"use client"

import React from "react"
import { useState, useEffect, useRef } from "react"
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  Easing,
  Alert,
  Modal,
  Dimensions,
} from "react-native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RouteProp } from "@react-navigation/native"
import type { RootStackParamList } from "../../App"
import { burgerImages } from "../data/burgerImages"
import Text from "../components/CustomText"
import { useRatings } from "../context/RatingContext"
import { useCooking } from "../context/CookingContext"
import StarRating from "../components/StarRating"
import Button from "../components/Button"
import { useFocusEffect } from "@react-navigation/native"
import type { Burger } from "../types/Burger"

type BurgerDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, "BurgerDetail">
type BurgerDetailScreenRouteProp = RouteProp<RootStackParamList, "BurgerDetail">

interface NavigationProps {
  navigation: BurgerDetailScreenNavigationProp
  route: BurgerDetailScreenRouteProp
}

interface DirectProps {
  burger: Burger
  visible: boolean
  onClose: () => void
  navigation: StackNavigationProp<RootStackParamList, keyof RootStackParamList>
}

type Props = NavigationProps | DirectProps

const { width, height } = Dimensions.get("window")

// Type guard to check if props are navigation-based
const isNavigationProps = (props: Props): props is NavigationProps => {
  return "route" in props && "route" in props
}

const BurgerDetailScreen: React.FC<Props> = (props) => {
  // Extract burger and other props based on the prop type
  const burger = isNavigationProps(props) ? props.route.params.burger : props.burger
  const navigation = props.navigation
  const isDirectModal = !isNavigationProps(props)
  const visible = isNavigationProps(props) ? true : props.visible
  const onClose = isNavigationProps(props) ? () => props.navigation.goBack() : props.onClose

  const { getUserRating, addRating } = useRatings()
  const { startCooking, cookingSessions } = useCooking()
  const [userRating, setUserRating] = useState<number | null>(null)
  const [tempRating, setTempRating] = useState<number | null>(null)
  const [ratingSaved, setRatingSaved] = useState(false)
  const [hasCookedBurger, setHasCookedBurger] = useState(false)
  const [modalVisible, setModalVisible] = useState(visible)

  // Animation values
  const buttonScale = useRef(new Animated.Value(1)).current
  const buttonOpacity = useRef(new Animated.Value(1)).current
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(height)).current
  const imageTranslateY = useRef(new Animated.Value(0)).current

  useEffect(() => {
    setModalVisible(visible)
  }, [visible])

  useEffect(() => {
    if (!visible) return

    // Load user's rating when the component mounts
    const rating = getUserRating(burger.id)
    setUserRating(rating)
    setTempRating(rating)
    setRatingSaved(rating !== null)

    // Check if user has cooked this burger before
    checkIfBurgerCooked()

    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(imageTranslateY, {
        toValue: -80, // Move image up to overlap with modal
        duration: 300,
        delay: 150,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
    ]).start()
  }, [burger.id, getUserRating, cookingSessions, visible])

  useFocusEffect(
    React.useCallback(() => {
      if (!isDirectModal) {
        buttonOpacity.setValue(1)
        buttonScale.setValue(1)
      }
      return () => {}
    }, [buttonOpacity, buttonScale, isDirectModal]),
  )

  const checkIfBurgerCooked = () => {
    const hasCooked = cookingSessions.some((session) => session.burgerId === burger.id && session.completed)
    setHasCookedBurger(hasCooked)
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

  const handleStartCooking = async () => {
    // Start button animation
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.in(Easing.ease),
      }),
    ]).start()

    // Start cooking and navigate after animations
    setTimeout(() => {
      startCooking(burger)
      if (isDirectModal) {
        onClose() // Close the modal first
      }
      navigation.navigate("CookingTimer", { burger })
    }, 500)
  }

  const handleClose = () => {
    // Animate out
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.in(Easing.ease),
      }),
      Animated.timing(imageTranslateY, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
        easing: Easing.in(Easing.ease),
      }),
    ]).start(() => {
      setModalVisible(false)
      onClose()
    })
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

  return (
    <Modal visible={modalVisible} transparent={true} animationType="none" onRequestClose={handleClose}>
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="rgba(0,0,0,0.5)" barStyle="light-content" />

        {/* Backdrop */}
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
          <TouchableOpacity style={styles.backdropTouchable} onPress={handleClose} />
        </Animated.View>

        {/* Burger Image */}
        <Animated.View
          style={[
            styles.floatingImageContainer,
            {
              transform: [{ translateY: Animated.add(slideAnim, imageTranslateY) }],
            },
          ]}
        >
          <Image source={burgerImages[burger.image]} style={styles.burgerImage} />
        </Animated.View>

        {/* Content Modal */}
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerSpacer} />
          </View>

          {/* Content */}
          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.contentContainer}>
              {/* Burger Name and Category - Name now above category */}
              <View style={styles.titleSection}>
                <Text weight="semiBold" style={styles.burgerName}>
                  {burger.name}
                </Text>
                <Text weight="medium" style={styles.burgerCategory}>
                  {burger.category}
                </Text>
              </View>

              {/* Details Content */}
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

                {/* User Rating Section - Only show if user has cooked this burger */}
                {hasCookedBurger && (
                  <View style={styles.userRatingSection}>
                    <Text weight="semiBold" style={styles.userRatingTitle}>
                      Rate this burger
                    </Text>
                    <View style={styles.userRatingContainer}>
                      <StarRating
                        rating={tempRating || 0}
                        editable={true}
                        onRatingChange={handleTempRatingChange}
                        size={32}
                        color="#8B0000"
                      />
                      <Text style={styles.userRatingText}>
                        {tempRating ? `Your rating: ${tempRating}` : "Tap to rate"}
                      </Text>
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

                {/* Let's Start Button with Animation */}
                <Animated.View
                  style={[
                    styles.startButtonContainer,
                    {
                      transform: [{ scale: buttonScale }],
                      opacity: buttonOpacity,
                    },
                  ]}
                >
                  <TouchableOpacity style={styles.startButton} onPress={handleStartCooking} activeOpacity={0.8}>
                    <Text weight="semiBold" style={styles.startButtonText}>
                      Let's Start Cooking!
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  backdropTouchable: {
    flex: 1,
  },
  floatingImageContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    width: "65%",
    zIndex: 5,
    top: "34%",
  },
  burgerImage: {
    width: 220,
    height: 220,
    resizeMode: "cover",
  },
  modalContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "63%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
    paddingTop: 50,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  closeIcon: {
    width: 20,
    height: 20,
    tintColor: "#333",
    zIndex: 999,
  },
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    flex: 1,
    marginTop: 30,
  },
  contentContainer: {
    padding: 20,
  },
  titleSection: {
    alignItems: "flex-start",
    marginBottom: 20,
  },
  burgerName: {
    fontSize: 20,
    color: "#333",
    textAlign: "left",
    marginBottom: 5,
  },
  burgerCategory: {
    fontSize: 12,
    color: "#8B0000",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1,
    fontWeight: "600",
  },
  tabContent: {
    paddingBottom: 30,
  },
  description: {
    fontSize: 12,
    color: "#666",
    lineHeight: 24,
    marginBottom: 25,
    textAlign: "left",
  },
  metaInfo: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#F9FAFB",
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
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
    fontSize: 12,
    color: "#333",
  },
  easyText: {
    color: "#059669",
    fontSize: 12,
  },
  mediumText: {
    color: "#D97706",
    fontSize: 12,
  },
  hardText: {
    color: "#B91C1C",
    fontSize: 12,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stars: {
    color: "#B91C1C",
    fontSize: 13,
    marginRight: 4,
  },
  ratingValue: {
    fontSize: 12,
    color: "#333",
  },
  userRatingSection: {
    marginBottom: 20,
    backgroundColor: "#F9FAFB",
    borderRadius: 15,
    padding: 20,
  },
  userRatingTitle: {
    fontSize: 15,
    color: "#333",
    marginBottom: 5,
    textAlign: "center",
  },
  userRatingContainer: {
    alignItems: "center",
  },
  userRatingText: {
    marginTop: 5,
    marginBottom: 15,
    color: "#666",
    fontSize: 13,
  },
  saveRatingButton: {
    minWidth: 150,
  },
  startButtonContainer: {},
  startButton: {
    backgroundColor: "#8B0000",
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: -50,
  },
  startButtonText: {
    color: "white",
    fontSize: 15,
  },
  nutritionSection: {
    backgroundColor: "#F9FAFB",
    borderRadius: 15,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  nutritionGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  nutritionItem: {
    alignItems: "center",
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#8B0000",
    marginBottom: 5,
  },
  nutritionLabel: {
    fontSize: 12,
    color: "#666",
  },
})

export default BurgerDetailScreen
