import React from "react"
import { Image, Modal, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import { useTheme } from "../../context/ThemeContext"
import Text from "../CustomText"

interface CategoryPickerProps {
  visible: boolean
  onClose: () => void
  onSelect: (category: string) => void
}

const categories = [
  "Beef",
  "Chicken",
  "Pork",
  "Fish",
  "Lamb",
  "Turkey",
  "Vegetarian",
  "Vegan",
  "Cheese",
  "Egg",
  "Mushroom",
  "Tofu",
  "Plant-Based",
  "Spicy",
  "Bacon",
  "BBQ",
  "Mini / Slider",
  "Breakfast",
  "Double Patty",
  "Specialty",
]

export const CategoryPicker: React.FC<CategoryPickerProps> = ({
  visible,
  onClose,
  onSelect,
}) => {
  const { colors } = useTheme()

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.pickerOverlay}>
        <View style={[styles.pickerContainer, { backgroundColor: colors.background }]}>
          <View style={styles.pickerHeader}>
            <Text weight="semiBold" style={[styles.pickerTitle, { color: colors.text }]}>
              Select Category
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Image
                source={{ uri: "https://img.icons8.com/ios-glyphs/30/multiply.png" }}
                style={[styles.closeIcon, { tintColor: colors.text }]}
              />
            </TouchableOpacity>
          </View>
          <ScrollView style={{ maxHeight: 300 }}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={styles.pickerItem}
                onPress={() => onSelect(category)}
              >
                <Text style={[styles.pickerItemText, { color: colors.text }]}>{category}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  pickerOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  pickerContainer: { borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 20 },
  pickerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  pickerTitle: { fontSize: 16 },
  closeIcon: { width: 20, height: 20 },
  pickerItem: { paddingHorizontal: 20, paddingVertical: 15 },
  pickerItemText: { fontSize: 16 },
})