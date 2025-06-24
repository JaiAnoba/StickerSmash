import React from "react"
import { Image, StyleSheet, TextInput, TouchableOpacity, View } from "react-native"
import { useTheme } from "../../context/ThemeContext"
import Text from "../CustomText"

interface BasicInformationSectionProps {
  formData: {
    name: string
    category: string
    description: string
    difficulty: string
    cookTime: string
    totalTime: string
    prepTime: string
    servings: string
    calories: string
    isRecommended: boolean
  }
  onInputChange: (field: string, value: string | boolean) => void
  onShowCategoryPicker: () => void
  onShowDifficultyPicker: () => void
}

export const BasicInformationSection: React.FC<BasicInformationSectionProps> = ({
  formData,
  onInputChange,
  onShowCategoryPicker,
  onShowDifficultyPicker,
}) => {
  const { colors } = useTheme()

  return (
    <View style={styles.section}>
      <Text weight="semiBold" style={[styles.sectionTitle, { color: colors.text }]}>
        Basic Information
      </Text>

      <View style={styles.inputContainer}>
        <Text weight="medium" style={[styles.label, { color: colors.text }]}>
          Burger Name
        </Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border },
          ]}
          placeholder="e.g., Classic Beef Burger"
          placeholderTextColor={colors.subtext}
          value={formData.name}
          onChangeText={(value) => onInputChange("name", value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text weight="medium" style={[styles.label, { color: colors.text }]}>
          Category
        </Text>
        <TouchableOpacity
          style={[
            styles.input,
            styles.picker,
            { backgroundColor: colors.inputBackground, borderColor: colors.border },
          ]}
          onPress={onShowCategoryPicker}
        >
          <Text style={[styles.pickerText, { color: formData.category ? colors.text : colors.subtext }]}>
            {formData.category || "Select category"}
          </Text>
          <Image
            source={{ uri: "https://img.icons8.com/ios-glyphs/30/expand-arrow--v1.png" }}
            style={[styles.dropdownIcon, { tintColor: colors.subtext }]}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Text weight="medium" style={[styles.label, { color: colors.text }]}>
          Description
        </Text>
        <TextInput
          style={[
            styles.input,
            styles.textArea,
            { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border },
          ]}
          placeholder="Describe your burger recipe..."
          placeholderTextColor={colors.subtext}
          value={formData.description}
          onChangeText={(value) => onInputChange("description", value)}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputContainer, styles.flex1, styles.marginRight]}>
          <Text weight="medium" style={[styles.label, { color: colors.text }]}>
            Difficulty
          </Text>
          <TouchableOpacity
            style={[
              styles.input,
              styles.picker,
              { backgroundColor: colors.inputBackground, borderColor: colors.border },
            ]}
            onPress={onShowDifficultyPicker}
          >
            <Text style={[styles.pickerText, { color: formData.difficulty ? colors.text : colors.subtext }]}>
              {formData.difficulty || "Select"}
            </Text>
            <Image
              source={{ uri: "https://img.icons8.com/ios-glyphs/30/expand-arrow--v1.png" }}
              style={[styles.dropdownIcon, { tintColor: colors.subtext }]}
            />
          </TouchableOpacity>
        </View>

        {/* <View style={[styles.inputContainer, styles.flex1]}>
          <Text weight="medium" style={[styles.label, { color: colors.text }]}>
            Cook Time
          </Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border },
            ]}
            placeholder="e.g., 15 mins"
            placeholderTextColor={colors.subtext}
            value={formData.cookTime}
            onChangeText={(value) => onInputChange("cookTime", value)}
          />
        </View> */}
      </View>

      <View style={styles.inputContainer}>
        <Text weight="medium" style={[styles.label, { color: colors.text }]}>
          Total Time
        </Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border },
          ]}
          placeholder="e.g., 30 mins"
          placeholderTextColor={colors.subtext}
          value={formData.totalTime}
          onChangeText={(value) => onInputChange("totalTime", value)}
        />
      </View>

      {/* <View style={styles.inputContainer}>
        <Text weight="medium" style={[styles.label, { color: colors.text }]}>
          Prep Time
        </Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border },
          ]}
          placeholder="e.g., 10 mins"
          placeholderTextColor={colors.subtext}
          value={formData.prepTime}
          onChangeText={(value) => onInputChange("prepTime", value)}
        />
      </View> */}

      <View style={styles.row}>
        {/* <View style={[styles.inputContainer, styles.flex1, styles.marginRight]}>
          <Text weight="medium" style={[styles.label, { color: colors.text }]}>
            Servings
          </Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border },
            ]}
            placeholder="e.g., 4"
            placeholderTextColor={colors.subtext}
            value={formData.servings}
            onChangeText={(value) => onInputChange("servings", value)}
            keyboardType="numeric"
          />
        </View> */}

        <View style={[styles.inputContainer, styles.flex1]}>
          <Text weight="medium" style={[styles.label, { color: colors.text }]}>
            Total Calories
          </Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border },
            ]}
            placeholder="e.g., 650"
            placeholderTextColor={colors.subtext}
            value={formData.calories}
            onChangeText={(value) => onInputChange("calories", value)}
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* <View style={styles.inputContainer}>
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={[
              styles.checkbox,
              formData.isRecommended && styles.checkboxChecked,
              { borderColor: colors.border },
            ]}
            onPress={() => onInputChange("isRecommended", !formData.isRecommended)}
          >
            {formData.isRecommended && (
              <Image
                source={{ uri: "https://img.icons8.com/ios-glyphs/30/checkmark.png" }}
                style={[styles.checkIcon, { tintColor: "#FFFFFF" }]}
              />
            )}
          </TouchableOpacity>
          <Text weight="medium" style={[styles.checkboxLabel, { color: colors.text }]}>
            Mark as Recommended
          </Text>
        </View>
      </View> */}
    </View>
  )
}

const styles = StyleSheet.create({
  section: { padding: 20, marginTop: -5 },
  sectionTitle: { fontSize: 16, marginBottom: 15 },
  inputContainer: { marginBottom: 15 },
  label: { fontSize: 14, marginBottom: 8 },
  input: { borderRadius: 999, padding: 12, fontSize: 14, borderWidth: 1, fontFamily: "Poppins-Regular" },
  textArea: { height: 80, borderRadius: 8, fontFamily: "Poppins-Regular" },
  picker: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  pickerText: { fontSize: 14, flex: 1 },
  dropdownIcon: { width: 16, height: 16 },
  row: { flexDirection: "row" },
  flex1: { flex: 1 },
  marginRight: { marginRight: 10 },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#8B0000",
    borderColor: "#8B0000",
  },
  checkIcon: {
    width: 16,
    height: 16,
  },
  checkboxLabel: {
    fontSize: 14,
    flex: 1,
  },
})