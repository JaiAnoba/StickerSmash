"use client"

import type React from "react"
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity, Switch } from "react-native"
import { useTheme } from "../context/ThemeContext"
import type { FilterOptions, SortOption } from "../types/Filter"
import { CATEGORIES, INGREDIENTS, DIFFICULTIES, COOK_TIMES } from "../types/Filter"

interface FilterModalProps {
  visible: boolean
  onClose: () => void
  filterOptions: FilterOptions
  setFilterOptions: React.Dispatch<React.SetStateAction<FilterOptions>>
  sortOption: SortOption
  setSortOption: React.Dispatch<React.SetStateAction<SortOption>>
  onReset: () => void
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  filterOptions,
  setFilterOptions,
  sortOption,
  setSortOption,
  onReset,
}) => {
  const { colors, isDarkMode } = useTheme()

  const toggleIngredient = (ingredient: string) => {
    setFilterOptions((prev) => {
      if (prev.ingredients.includes(ingredient)) {
        return { ...prev, ingredients: prev.ingredients.filter((i) => i !== ingredient) }
      } else {
        return { ...prev, ingredients: [...prev.ingredients, ingredient] }
      }
    })
  }

  const toggleDifficulty = (difficulty: string) => {
    setFilterOptions((prev) => {
      if (prev.difficulty.includes(difficulty)) {
        return { ...prev, difficulty: prev.difficulty.filter((d) => d !== difficulty) }
      } else {
        return { ...prev, difficulty: [...prev.difficulty, difficulty] }
      }
    })
  }

  const handleSortOptionPress = (field: SortOption["field"]) => {
    if (field === "favorites") {
      setSortOption({ field, direction: "desc" })
    } else {
      setSortOption((prev) => ({
        field,
        direction: prev.field === field && prev.direction === "desc" ? "asc" : "desc",
      }))
    }
  }

  const getSortDirectionText = (field: SortOption["field"]) => {
    if (sortOption.field !== field) return ""

    switch (field) {
      case "rating":
        return sortOption.direction === "desc" ? "Highest to Lowest" : "Lowest to Highest"
      case "cookTime":
        return sortOption.direction === "asc" ? "Shortest to Longest" : "Longest to Shortest"
      case "name":
        return sortOption.direction === "asc" ? "A–Z" : "Z–A"
      case "favorites":
        return "Top Favorites First"
      default:
        return ""
    }
  }

  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor: isDarkMode ? colors.card : "#FFFFFF",
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Filter & Sort</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={[styles.closeButton, { color: colors.primary }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScrollView}>
            {/* Filter Section */}
            <View style={styles.modalSection}>
              <Text style={[styles.modalSectionTitle, { color: colors.text }]}>Filter Options</Text>

              {/* Category Filter */}
              <View style={styles.filterGroup}>
                <Text style={[styles.filterGroupTitle, { color: colors.text }]}>Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterChipsContainer}>
                  {CATEGORIES.map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.filterChip,
                        filterOptions.category === category
                          ? { backgroundColor: colors.primary }
                          : { backgroundColor: isDarkMode ? "#2A2A2A" : "#F5F5F5" },
                      ]}
                      onPress={() => setFilterOptions((prev) => ({ ...prev, category }))}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          filterOptions.category === category ? { color: "#FFFFFF" } : { color: colors.text },
                        ]}
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Ingredients Filter */}
              <View style={styles.filterGroup}>
                <Text style={[styles.filterGroupTitle, { color: colors.text }]}>Ingredients</Text>
                <View style={styles.filterCheckboxContainer}>
                  {INGREDIENTS.map((ingredient) => (
                    <TouchableOpacity
                      key={ingredient}
                      style={styles.checkboxRow}
                      onPress={() => toggleIngredient(ingredient)}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          filterOptions.ingredients.includes(ingredient)
                            ? { backgroundColor: colors.primary, borderColor: colors.primary }
                            : { backgroundColor: "transparent", borderColor: colors.border },
                        ]}
                      >
                        {filterOptions.ingredients.includes(ingredient) && <Text style={styles.checkmark}>✓</Text>}
                      </View>
                      <Text style={[styles.checkboxLabel, { color: colors.text }]}>{ingredient}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Difficulty Filter */}
              <View style={styles.filterGroup}>
                <Text style={[styles.filterGroupTitle, { color: colors.text }]}>Difficulty</Text>
                <View style={styles.filterCheckboxContainer}>
                  {DIFFICULTIES.map((difficulty) => (
                    <TouchableOpacity
                      key={difficulty}
                      style={styles.checkboxRow}
                      onPress={() => toggleDifficulty(difficulty)}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          filterOptions.difficulty.includes(difficulty)
                            ? { backgroundColor: colors.primary, borderColor: colors.primary }
                            : { backgroundColor: "transparent", borderColor: colors.border },
                        ]}
                      >
                        {filterOptions.difficulty.includes(difficulty) && <Text style={styles.checkmark}>✓</Text>}
                      </View>
                      <Text style={[styles.checkboxLabel, { color: colors.text }]}>{difficulty}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Cook Time Filter */}
              <View style={styles.filterGroup}>
                <Text style={[styles.filterGroupTitle, { color: colors.text }]}>Cook Time</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterChipsContainer}>
                  {COOK_TIMES.map((time) => (
                    <TouchableOpacity
                      key={time}
                      style={[
                        styles.filterChip,
                        filterOptions.cookTime === time
                          ? { backgroundColor: colors.primary }
                          : { backgroundColor: isDarkMode ? "#2A2A2A" : "#F5F5F5" },
                      ]}
                      onPress={() => setFilterOptions((prev) => ({ ...prev, cookTime: time }))}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          filterOptions.cookTime === time ? { color: "#FFFFFF" } : { color: colors.text },
                        ]}
                      >
                        {time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Favorites Only Filter */}
              <View style={styles.filterGroup}>
                <View style={styles.switchRow}>
                  <Text style={[styles.filterGroupTitle, { color: colors.text }]}>Favorites Only</Text>
                  <Switch
                    value={filterOptions.favoritesOnly}
                    onValueChange={(value) => setFilterOptions((prev) => ({ ...prev, favoritesOnly: value }))}
                    trackColor={{ false: "#767577", true: colors.primary }}
                    thumbColor={"#f4f3f4"}
                  />
                </View>
              </View>
            </View>

            {/* Sort Section */}
            <View style={styles.modalSection}>
              <Text style={[styles.modalSectionTitle, { color: colors.text }]}>Sort Options</Text>

              {/* Rating Sort */}
              <TouchableOpacity
                style={[
                  styles.sortOption,
                  sortOption.field === "rating" && { backgroundColor: isDarkMode ? "#2A2A2A" : "#F5F5F5" },
                ]}
                onPress={() => handleSortOptionPress("rating")}
              >
                <Text style={[styles.sortOptionText, { color: colors.text }]}>Rating</Text>
                <Text style={{ color: colors.primary }}>{getSortDirectionText("rating")}</Text>
              </TouchableOpacity>

              {/* Cook Time Sort */}
              <TouchableOpacity
                style={[
                  styles.sortOption,
                  sortOption.field === "cookTime" && { backgroundColor: isDarkMode ? "#2A2A2A" : "#F5F5F5" },
                ]}
                onPress={() => handleSortOptionPress("cookTime")}
              >
                <Text style={[styles.sortOptionText, { color: colors.text }]}>Cook Time</Text>
                <Text style={{ color: colors.primary }}>{getSortDirectionText("cookTime")}</Text>
              </TouchableOpacity>

              {/* Alphabetical Sort */}
              <TouchableOpacity
                style={[
                  styles.sortOption,
                  sortOption.field === "name" && { backgroundColor: isDarkMode ? "#2A2A2A" : "#F5F5F5" },
                ]}
                onPress={() => handleSortOptionPress("name")}
              >
                <Text style={[styles.sortOptionText, { color: colors.text }]}>Alphabetical</Text>
                <Text style={{ color: colors.primary }}>{getSortDirectionText("name")}</Text>
              </TouchableOpacity>

              {/* Most Favorited Sort */}
              <TouchableOpacity
                style={[
                  styles.sortOption,
                  sortOption.field === "favorites" && { backgroundColor: isDarkMode ? "#2A2A2A" : "#F5F5F5" },
                ]}
                onPress={() => handleSortOptionPress("favorites")}
              >
                <Text style={[styles.sortOptionText, { color: colors.text }]}>Most Favorited</Text>
                <Text style={{ color: colors.primary }}>{getSortDirectionText("favorites")}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={[styles.resetButton, { borderColor: colors.border }]} onPress={onReset}>
              <Text style={[styles.resetButtonText, { color: colors.text }]}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.applyButton, { backgroundColor: colors.primary }]} onPress={onClose}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 30,
    borderWidth: 1,
    borderBottomWidth: 0,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    fontSize: 24,
    fontWeight: "bold",
  },
  modalScrollView: {
    paddingHorizontal: 20,
  },
  modalSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  filterGroup: {
    marginBottom: 16,
  },
  filterGroupTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  filterChipsContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: "500",
  },
  filterCheckboxContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  checkboxLabel: {
    fontSize: 14,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sortOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  sortOptionText: {
    fontSize: 16,
    fontWeight: "500",
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    marginRight: 8,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  applyButton: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 8,
  },
  applyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default FilterModal
