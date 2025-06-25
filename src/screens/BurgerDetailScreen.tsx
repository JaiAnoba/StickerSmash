import type { RouteProp } from "@react-navigation/native"
import { useFocusEffect } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import React, { useCallback, useEffect, useRef, useState } from "react"
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native"
import type { RootStackParamList } from "../../App"
import Button from "../components/Button"
import Text from "../components/CustomText"
import StarRating from "../components/StarRating"
import { useCooking } from "../context/CookingContext"
import { useFavorites } from "../context/FavoritesContext"
import { useRatings } from "../context/RatingContext"
import { useTheme } from "../context/ThemeContext"
import type { Burger } from "../types/Burger"
import { getBurgerImageSource } from "../utils/imageUtils"

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

const isNavigationProps = (props: Props): props is NavigationProps => {
  return "route" in props && "route" in props
}

const BurgerDetailScreen: React.FC<Props> = (props) => {
  const burger = isNavigationProps(props) ? props.route.params.burger : props.burger
  const navigation = props.navigation
  const isDirectModal = !isNavigationProps(props)
  const visible = isNavigationProps(props) ? true : props.visible
  const onClose = isNavigationProps(props) ? () => props.navigation.goBack() : props.onClose
  const { colors, isDarkMode } = useTheme()

  const { isFavorite, addFavorite, removeFavorite } = useFavorites()
  const isLiked = isFavorite(burger.id)

  const { getUserRating, addRating } = useRatings()
  const { startCooking, cookingSessions } = useCooking()
  const [userRating, setUserRating] = useState<number | null>(null)
  const [tempRating, setTempRating] = useState<number | null>(null)
  const [ratingSaved, setRatingSaved] = useState(false)
  const [hasCookedBurger, setHasCookedBurger] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)

  const heartIcon = "https://img.icons8.com/puffy/32/like.png"
  const filledHeartIcon = "https://img.icons8.com/puffy-filled/32/like.png"

  // Animation values
  const buttonScale = useRef(new Animated.Value(1)).current
  const buttonOpacity = useRef(new Animated.Value(1)).current
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(height)).current

  const handleFavoritePress = useCallback(() => {
    try {
      if (isLiked) {
        removeFavorite(burger.id)
      } else {
        addFavorite(burger)
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
      Alert.alert("Error", "Failed to update favorites")
    }
  }, [isLiked, burger.id, addFavorite, removeFavorite])

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
        onClose() 
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
    ]).start(() => {
      setModalVisible(false)
      onClose()
    })
  }

  return (
    <Modal visible={modalVisible} transparent={true} animationType="none" onRequestClose={handleClose}>
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={isDarkMode ? colors.statusBar : "#8B0000"} 
          barStyle={isDarkMode ? "light-content" : "dark-content"} />

        {/* Backdrop */}
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
          <TouchableOpacity style={styles.backdropTouchable} onPress={handleClose} />
        </Animated.View>

        {/* Content Modal */}
        <Animated.View
          style={[
            styles.modalContent,
            {
              backgroundColor: colors.background,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Burger Image at the top inside modal */}
          <View style={styles.imageWrapper}>
            <Image
              source={getBurgerImageSource(burger)}
              style={styles.burgerImage}
              onError={() => {
                console.log(`Image load error for ${burger.name}`)
              }}
            />
          </View>

          {/* Content */}
          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.contentContainer}>
              {/* Burger Name and Category */}
              <View style={styles.titleRow}>
                <Text weight="semiBold" style={[styles.burgerName, {color: colors.text,}]}>{burger.name}</Text>
                <TouchableOpacity onPress={handleFavoritePress} style={[styles.favoriteIcon, {backgroundColor: isDarkMode ? "#121212" : "#fff",}]}>
                  <Image
                    source={{ uri: isLiked ? filledHeartIcon : heartIcon }}
                    style={[
                      styles.heart,
                      isLiked && styles.heartFilled, {tintColor: isDarkMode ? "#8B0000" : "#8B0000",}
                    ]}
                  />
                </TouchableOpacity>
              </View>
              <Text weight="medium" style={[styles.burgerCategory, {color: colors.primary,}]}>{burger.category}</Text>

              {/* Details Content */}
              <View style={styles.tabContent}>
                <Text style={[styles.description, {color: colors.subtext,}]}>{burger.description}</Text>
                <View style={[styles.metaInfo, {backgroundColor: isDarkMode ? colors.inputBackground : "#F9FAFB",}]}>
                  <View style={styles.metaItem}>
                    <Text style={[styles.metaLabel, {color: colors.subtext,}]}>Difficulty</Text>
                    <Text
                      weight="semiBold"
                      style={[
                        styles.metaValue,
                        burger.difficulty === "Easy" && styles.easyText,
                        burger.difficulty === "Medium" && styles.mediumText,
                        burger.difficulty === "Hard" && styles.hardText, 
                        {color: colors.text,}
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
                      <Image
                        source={{ uri: "https://img.icons8.com/fluency-systems-filled/96/star.png" }}
                        style={{ width: 14, height: 14, tintColor: "#8B0000", marginRight: 4 }}
                      />
                      <Text weight="semiBold" style={[styles.ratingValue, {color: colors.text,}]}>
                        {burger.rating}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* User Rating Section - Only show if user has cooked this burger */}
                {hasCookedBurger && (
                  <View style={[styles.userRatingSection, {backgroundColor: isDarkMode ? colors.inputBackground : "#F9FAFB",}]}>
                    <Text weight="semiBold" style={[styles.userRatingTitle, {color: colors.text,}]}>
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
                      <Text style={[styles.userRatingText, {color: colors.subtext,}]}>
                        {tempRating ? `Your rating: ${tempRating}` : "Tap to rate"}
                      </Text>
                      <Button
                        title={ratingSaved ? "Update Rating" : "Save Rating"}
                        onPress={handleSaveRating}
                        variant="primary"
                        size="small"
                        disabled={tempRating === null}
                        style={styles.saveRatingButton}
                      />
                    </View>
                  </View>
                )}

                {/* Let's Start Button */}
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
                    <Text weight="semiBold" style={[styles.startButtonText, {color: isDarkMode ? "#fff" : "#fff"}]}>
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
  imageWrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 0,
    marginBottom: 0,
  },
  burgerImage: {
    aspectRatio: 1,
    height: '70%',
    maxWidth: 300,
    alignSelf: "center",
    resizeMode: "contain",
    marginTop: 0,
    marginBottom: 0,
    borderWidth: 1,
    borderColor: 'yellow'
  },
  modalContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: "80%",
    minHeight: 400,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
    paddingTop: 0,
    paddingBottom: 10,
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
  scrollContent: {

  },
  contentContainer: {
    padding: 20,
    borderColor: 'red',
    borderWidth: 1
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  favoriteIcon: {
    padding: 6,
  },
  heart: {
    width: 20,
    height: 20,
  },
  heartFilled: {
    tintColor: "#8B0000",
  },
  burgerName: {
    fontSize: 20,
    textAlign: "left",
    marginBottom: 5,
  },
  burgerCategory: {
    fontSize: 12,
    textAlign: "left",
    textTransform: "uppercase",
    letterSpacing: 1,
    fontWeight: "600",
    marginBottom: 15,
  },
  tabContent: {
    paddingBottom: 30,
  },
  description: {
    fontSize: 12,
    lineHeight: 24,
    marginBottom: 25,
    textAlign: "left",
  },
  metaInfo: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
  },
  metaItem: {
    alignItems: "center",
  },
  metaLabel: {
    fontSize: 11,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: 12,
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
    top: 3,
  },
  userRatingSection: {
    marginBottom: 20,
    borderRadius: 15,
    padding: 20,
  },
  userRatingTitle: {
    fontSize: 15,
    marginBottom: 5,
    textAlign: "center",
  },
  userRatingContainer: {
    alignItems: "center",
  },
  userRatingText: {
    marginTop: 5,
    marginBottom: 15,
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
    fontSize: 15,
  },
})

export default BurgerDetailScreen