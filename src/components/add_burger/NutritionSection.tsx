import React from "react"
import { StyleSheet, TextInput, View } from "react-native"
import { useTheme } from "../../context/ThemeContext"
import Text from "../CustomText"

interface NutritionSectionProps {
  nutrition: {
    calories: string
    protein: string
    carbs: string
    fat: string
  }
  onNutritionChange: (field: string, value: string) => void
}

export const NutritionSection: React.FC<NutritionSectionProps> = ({
  nutrition,
  onNutritionChange,
}) => {
  const { colors } = useTheme()

  return (
    <View style={styles.section}>
      <Text weight="semiBold" style={[styles.sectionTitle, { color: colors.text }]}>
        Nutrition Information (Optional)
      </Text>

      <View style={styles.nutritionGrid}>
        <View style={[styles.inputContainer, styles.nutritionItem]}>
          <Text weight="medium" style={[styles.label, { color: colors.text }]}>
            Calories
          </Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border },
            ]}
            placeholder="450"
            placeholderTextColor={colors.subtext}
            value={nutrition.calories}
            onChangeText={(value) => onNutritionChange("calories", value)}
            keyboardType="numeric"
          />
        </View>

        <View style={[styles.inputContainer, styles.nutritionItem]}>
          <Text weight="medium" style={[styles.label, { color: colors.text }]}>
            Protein (g)
          </Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border },
            ]}
            placeholder="25"
            placeholderTextColor={colors.subtext}
            value={nutrition.protein}
            onChangeText={(value) => onNutritionChange("protein", value)}
            keyboardType="numeric"
          />
        </View>

        <View style={[styles.inputContainer, styles.nutritionItem]}>
          <Text weight="medium" style={[styles.label, { color: colors.text }]}>
            Carbs (g)
          </Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border },
            ]}
            placeholder="35"
            placeholderTextColor={colors.subtext}
            value={nutrition.carbs}
            onChangeText={(value) => onNutritionChange("carbs", value)}
            keyboardType="numeric"
          />
        </View>

        <View style={[styles.inputContainer, styles.nutritionItem]}>
          <Text weight="medium" style={[styles.label, { color: colors.text }]}>
            Fat (g)
          </Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border },
            ]}
            placeholder="20"
            placeholderTextColor={colors.subtext}
            value={nutrition.fat}
            onChangeText={(value) => onNutritionChange("fat", value)}
            keyboardType="numeric"
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  section: { padding: 20, marginTop: -5 },
  sectionTitle: { fontSize: 16, marginBottom: 15 },
  inputContainer: { marginBottom: 15 },
  label: { fontSize: 14, marginBottom: 8 },
  input: { borderRadius: 999, padding: 12, fontSize: 14, borderWidth: 1, fontFamily: "Poppins-Regular" },
  nutritionGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  nutritionItem: { width: "48%" },
})