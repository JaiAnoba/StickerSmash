import type React from "react"
import { Image, StyleSheet, TouchableOpacity, View } from "react-native"
import Text from "../components/CustomText"
import { useTheme } from "../context/ThemeContext"
import type { Burger } from "../types/Burger"
import { getBurgerImageSource } from "../utils/imageUtils"

const heartIcon = "https://img.icons8.com/puffy/32/like.png"
const filledHeartIcon = "https://img.icons8.com/puffy-filled/32/like.png"

interface BurgerCardProps {
  burger: Burger
  isFavorite: boolean
  onPress: (burger: Burger) => void
  onFavoritePress: () => void
}

const BurgerCard: React.FC<BurgerCardProps> = ({ burger, isFavorite, onPress, onFavoritePress }) => {
  const { colors, isDarkMode } = useTheme()

  // Use utility function to get the image source
  const imageSource = getBurgerImageSource(burger)

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.text }]}
      onPress={() => onPress(burger)}
      activeOpacity={0.9}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={imageSource}
          style={burger.isUserAdded ? styles.userImage : styles.image}
          onError={(error) => {
            console.warn(`Failed to load image for burger ${burger.name}:`, error.nativeEvent.error)
          }}
        />
      </View>

      <View style={styles.infoSection}>
        <Text weight="semiBold" style={[styles.name, { color: colors.text }]} numberOfLines={1} ellipsizeMode="tail">
          {burger.name}
        </Text>

        <Text style={[styles.category, { color: colors.subtext }]}>{burger.category}</Text>

        <View style={styles.row}>
          <View style={styles.timeContainer}>
            <Text style={[styles.timeText, { color: colors.text }]}>{burger.totalTime}</Text>
          </View>

          <View
            style={[
              styles.difficulty,
              burger.difficulty.toLowerCase() === "medium" && { backgroundColor: "#FEF3C7" },
              burger.difficulty.toLowerCase() === "hard" && { backgroundColor: "#FECACA" },
            ]}
          >
            <Text
              weight="semiBold"
              style={[
                styles.difficultyText,
                burger.difficulty.toLowerCase() === "medium" && { color: "#B45309" },
                burger.difficulty.toLowerCase() === "hard" && { color: "#B91C1C" },
              ]}
            >
              {burger.difficulty.toUpperCase()}
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={onFavoritePress} style={[styles.favoriteIcon, { backgroundColor: colors.card }]}>
          < Image
            source={{ uri: isFavorite ? filledHeartIcon : heartIcon }}
            style={[
              styles.heart,
              {
                tintColor: isFavorite ? "#8B0000" : isDarkMode ? "#FFFFFF" : "black",
              },
            ]}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 12,
    marginLeft: 2,
    width: 150,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  imageWrapper: {
    position: "relative",
    alignItems: "center",
    height: 100,
    marginTop: -45,
    zIndex: 10,
  },
  image: {
    width: 120,
    height: 100,
    resizeMode: "contain",
    position: "absolute",
  },
  userImage: {
    width: 150,
    height: 125,
    resizeMode: "contain",
    position: "absolute",
    bottom: 0.5,
  },
  favoriteIcon: {
    position: "absolute",
    bottom: 0,
    right: 2,
    borderRadius: 20,
    padding: 5,
    elevation: 2,
  },
  heart: {
    width: 18,
    height: 18,
    tintColor: "black",
  },
  heartFilled: {
    tintColor: "#8B0000",
  },
  infoSection: {
    alignItems: "flex-start",
    marginTop: 6,
    paddingLeft: 4,
  },
  name: {
    fontSize: 14,
    textAlign: "left",
    marginBottom: 2,
    maxWidth: "100%",
    overflow: "hidden",
  },
  category: {
    fontSize: 11,
    marginBottom: 2,
    alignSelf: "flex-start",
  },
  row: {
    flexDirection: "column",
    justifyContent: "space-between",
    width: "100%",
    gap: 4,
  },
  timeContainer: {
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  timeText: {
    fontSize: 11,
  },
  difficulty: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  difficultyText: {
    fontSize: 11,
    color: "#166534",
  },
})

export default BurgerCard
