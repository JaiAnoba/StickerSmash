import type React from "react"
import { Image, StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native"
import { useFavorites } from "../context/FavoritesContext"
import { useTheme } from "../context/ThemeContext"
import type { Burger } from "../types/Burger"
import IconButton from "./IconButton"

interface BurgerItemProps {
    burger: Burger
    onPress: (burger: Burger) => void
    style?: StyleProp<ViewStyle>
    compact?: boolean
}

const BurgerItem: React.FC<BurgerItemProps> = ({ burger, onPress, compact = false }) => {
  const { colors } = useTheme()
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()
  const isLiked = isFavorite(burger.id)

  const handleFavoritePress = () => {
    if (isLiked) {
      removeFavorite(burger.id)
    } else {
      addFavorite(burger)
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

  if (compact) {
    return (
      <TouchableOpacity
        style={[styles.compactCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => onPress(burger)}
        activeOpacity={0.8}
      >
        <Image source={{ uri: burger.image }} style={styles.compactImage} />
        <View style={styles.compactContent}>
          <Text style={[styles.compactName, { color: colors.text }]} numberOfLines={1}>
            {burger.name}
          </Text>
          <Text style={[styles.compactCategory, { color: colors.subtext }]}>{burger.category}</Text>
          <View style={styles.compactFooter}>
            <Text style={[styles.compactRating, { color: colors.primary }]}>{burger.rating.toFixed(1)}</Text>
            <IconButton
              icon={isLiked ? "❤️" : "🤍"}
              onPress={handleFavoritePress}
              style={styles.compactFavoriteButton}
              size={14}
            />
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const favoriteButtonStyle = [
    styles.favoriteButton,
    { backgroundColor: "rgba(255,255,255,0.9)" }
] as StyleProp<ViewStyle>;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => onPress(burger)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: burger.image }} style={styles.image} />
        <IconButton
            icon={isLiked ? "❤️" : "🤍"}
            onPress={handleFavoritePress}
            style={favoriteButtonStyle}
            size={16}
        />
      </View>

      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
          {burger.name}
        </Text>
        <Text style={[styles.category, { color: colors.subtext }]}>{burger.category}</Text>

        <View style={styles.footer}>
          <View style={styles.rating}>
            <Text style={[styles.stars, { color: colors.primary }]}>{renderStars(burger.rating)}</Text>
            <Text style={[styles.ratingText, { color: colors.subtext }]}>{burger.rating}</Text>
          </View>
          <Text style={[styles.cookTime, { color: colors.subtext }]}>{burger.cookTime}</Text>
        </View>

        <View style={styles.difficulty}>
          <Text
            style={[
              styles.difficultyText,
              burger.difficulty === "Easy" && styles.easy,
              burger.difficulty === "Medium" && styles.medium,
              burger.difficulty === "Hard" && styles.hard,
            ]}
          >
            {burger.difficulty}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    margin: 8,
    flex: 1,
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
  content: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
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
  // Compact styles
  compactCard: {
    flexDirection: "row",
    borderRadius: 12,
    marginVertical: 6,
    overflow: "hidden",
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  compactImage: {
    width: 80,
    height: 80,
    resizeMode: "cover",
  },
  compactContent: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  compactName: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  compactCategory: {
    fontSize: 11,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  compactFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  compactRating: {
    fontSize: 12,
    fontWeight: "bold",
  },
  compactFavoriteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
})

export default BurgerItem
