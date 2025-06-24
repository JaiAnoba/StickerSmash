import React from "react"
import { Image, StyleSheet, TextInput, TouchableOpacity, View } from "react-native"
import { useTheme } from "../../context/ThemeContext"
import Text from "../CustomText"

interface IngredientsSectionProps {
  ingredients: string[]
  currentIngredient: string
  onIngredientsChange: (ingredients: string[]) => void
  onCurrentIngredientChange: (ingredient: string) => void
}

export const IngredientsSection: React.FC<IngredientsSectionProps> = ({
  ingredients,
  currentIngredient,
  onIngredientsChange,
  onCurrentIngredientChange,
}) => {
  const { colors } = useTheme()

  const addIngredient = () => {
    if (currentIngredient.trim()) {
      onIngredientsChange([...ingredients, currentIngredient.trim()])
      onCurrentIngredientChange("")
    }
  }

  const removeIngredient = (index: number) => {
    onIngredientsChange(ingredients.filter((_, i) => i !== index))
  }

  return (
    <View style={styles.section}>
      <Text weight="semiBold" style={[styles.sectionTitle, { color: colors.text }]}>
        Ingredients
      </Text>

      <View style={styles.addItemContainer}>
        <TextInput
          style={[
            styles.input,
            styles.flex1,
            styles.marginRight,
            { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border },
          ]}
          placeholder="Add an ingredient..."
          placeholderTextColor={colors.subtext}
          value={currentIngredient}
          onChangeText={onCurrentIngredientChange}
          onSubmitEditing={addIngredient}
        />
        <TouchableOpacity style={styles.addButton} onPress={addIngredient}>
          <Image source={{ uri: "https://img.icons8.com/ios-glyphs/90/plus-math.png" }} style={styles.addIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.itemsList}>
        {ingredients.map((ingredient, index) => (
          <View key={index} style={[styles.itemTag, { backgroundColor: colors.inputBackground }]}>
            <Text style={[styles.itemTagText, { color: colors.text }]}>{ingredient}</Text>
            <TouchableOpacity onPress={() => removeIngredient(index)}>
              <Image
                source={{ uri: "https://img.icons8.com/ios-glyphs/30/multiply.png" }}
                style={[styles.removeIcon, { tintColor: colors.subtext }]}
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  section: { padding: 20, marginTop: -5 },
  sectionTitle: { fontSize: 16, marginBottom: 15 },
  input: { borderRadius: 999, padding: 12, fontSize: 14, borderWidth: 1, fontFamily: "Poppins-Regular" },
  addItemContainer: { flexDirection: "row", alignItems: "flex-start", marginBottom: 15 },
  addButton: {
    width: 40,
    height: 40,
    backgroundColor: "#8B0000",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  addIcon: { width: 15, height: 15, tintColor: "white" },
  itemsList: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  itemTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
  },
  itemTagText: { fontSize: 12, marginRight: 6 },
  removeIcon: { width: 14, height: 14 },
  flex1: { flex: 1 },
  marginRight: { marginRight: 10 },
})