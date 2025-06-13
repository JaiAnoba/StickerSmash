import type React from "react"
import { View, StyleSheet, TouchableOpacity } from "react-native"
import Text from "./CustomText"

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: number
  editable?: boolean
  onRatingChange?: (rating: number) => void
  color?: string
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 24,
  editable = false,
  onRatingChange,
  color = "#B91C1C",
}) => {
  const handlePress = (selectedRating: number) => {
    if (editable && onRatingChange) {
      onRatingChange(selectedRating)
    }
  }

  return (
    <View style={styles.container}>
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1
        const isFilled = starValue <= rating
        const isHalfFilled = !isFilled && starValue - 0.5 <= rating

        return (
          <TouchableOpacity
            key={index}
            activeOpacity={editable ? 0.7 : 1}
            onPress={() => handlePress(starValue)}
            style={{ padding: 2 }}
          >
            <Text style={[styles.star, { fontSize: size, color: color }]}>
              {isFilled ? "★" : isHalfFilled ? "⭐" : "☆"}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  star: {
    textAlign: "center",
  },
})

export default StarRating
