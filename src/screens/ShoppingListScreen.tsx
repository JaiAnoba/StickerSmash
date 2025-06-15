"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Image
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useTheme } from "../context/ThemeContext"
import Button from "../components/Button"
import { useNavigation } from "@react-navigation/native"
import Text from "../components/CustomText"

interface ShoppingItem {
  id: string
  name: string
  quantity: string
  category: string
  completed: boolean
  addedAt: string
}

const ShoppingListScreen: React.FC = () => {
  const { colors, isDarkMode } = useTheme()
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([])
  const [isAddModalVisible, setIsAddModalVisible] = useState(false)
  const [newItemName, setNewItemName] = useState("")
  const [newItemQuantity, setNewItemQuantity] = useState("")
  const [newItemCategory, setNewItemCategory] = useState("Meat")
  const [loading, setLoading] = useState(true)
  const navigation = useNavigation()

  const categories = ["Meat", "Vegetables", "Dairy", "Condiments", "Bread", "Spices", "Other"]

  useEffect(() => {
    loadShoppingList()
  }, [])

  const loadShoppingList = async () => {
    try {
      const list = await AsyncStorage.getItem("shoppingList")
      if (list) {
        setShoppingList(JSON.parse(list))
      }
    } catch (error) {
      console.error("Error loading shopping list:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveShoppingList = async (list: ShoppingItem[]) => {
    try {
      await AsyncStorage.setItem("shoppingList", JSON.stringify(list))
      setShoppingList(list)
    } catch (error) {
      console.error("Error saving shopping list:", error)
    }
  }

  const addItem = () => {
    if (!newItemName.trim()) {
      Alert.alert("Error", "Please enter an item name")
      return
    }

    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name: newItemName.trim(),
      quantity: newItemQuantity.trim() || "1",
      category: newItemCategory,
      completed: false,
      addedAt: new Date().toISOString(),
    }

    const updatedList = [...shoppingList, newItem]
    saveShoppingList(updatedList)

    setNewItemName("")
    setNewItemQuantity("")
    setNewItemCategory("Meat")
    setIsAddModalVisible(false)
  }

  const toggleItem = (id: string) => {
    const updatedList = shoppingList.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    saveShoppingList(updatedList)
  }

  const deleteItem = (id: string) => {
    Alert.alert("Delete Item", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          const updatedList = shoppingList.filter((item) => item.id !== id)
          saveShoppingList(updatedList)
        },
      },
    ])
  }

  const clearCompleted = () => {
    const completedItems = shoppingList.filter((item) => item.completed)
    if (completedItems.length === 0) {
      Alert.alert("Info", "No completed items to clear")
      return
    }

    Alert.alert("Clear Completed", `Remove ${completedItems.length} completed items?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: () => {
          const updatedList = shoppingList.filter((item) => !item.completed)
          saveShoppingList(updatedList)
        },
      },
    ])
  }

  const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
      Meat: "🥩",
      Vegetables: "🥬",
      Dairy: "🥛",
      Condiments: "🍯",
      Bread: "🍞",
      Spices: "🧂",
      Other: "📦",
    }
    return icons[category] || "📦"
  }

  const renderShoppingItem = ({ item }: { item: ShoppingItem }) => (
    <TouchableOpacity
      style={[
        styles.shoppingItem,
        { backgroundColor: colors.card, borderColor: colors.border },
        item.completed && styles.completedItem,
      ]}
      onPress={() => toggleItem(item.id)}
    >
      <View style={styles.itemLeft}>
        <Text style={styles.categoryIcon}>{getCategoryIcon(item.category)}</Text>
        <View style={styles.itemDetails}>
          <Text weight='semiBold' style={[styles.itemName, { color: colors.text }, item.completed && styles.completedText]}>
            {item.name}
          </Text>
          <Text style={[styles.itemQuantity, { color: colors.subtext }]}>
            {item.quantity} • {item.category}
          </Text>
        </View>
      </View>

      <View style={styles.itemRight}>
        <TouchableOpacity
          style={[
            styles.checkbox,
            { borderColor: colors.border },
            item.completed && { backgroundColor: colors.primary },
          ]}
          onPress={() => toggleItem(item.id)}
        >
          {item.completed && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteItem(item.id)}>
          <Image
            source={{ uri: "https://img.icons8.com/forma-bold/72/delete-forever.png" }}
            style={styles.deleteIcon}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )

  const completedCount = shoppingList.filter((item) => item.completed).length
  const totalCount = shoppingList.length

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading shopping list...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar backgroundColor={colors.statusBar} barStyle={isDarkMode ? "light-content" : "dark-content"} />

      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity style={styles.side} onPress={() => navigation.goBack()}>
          <Image source={{ uri: "https://img.icons8.com/sf-black/100/back.png" }} style={styles.backIcon} />
        </TouchableOpacity>

        <Text weight="semiBold" style={styles.headerTitle}>Shopping List</Text>

        <View style={styles.side} />
      </View>

      {shoppingList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image
            source={{ uri: "https://img.icons8.com/material-outlined/96/shopping-cart--v1.png" }}
            style={styles.emptyIcon}
          />
          <Text weight='semiBold' style={[styles.emptyTitle, { color: colors.text }]}>Empty Shopping List</Text>
          <Text style={[styles.emptySubtitle, { color: colors.subtext }]}>
            Add ingredients you need for your burger recipes!
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.statsHeader}>
            <Text style={[styles.progress, { color: colors.text }]}>
              {completedCount} of {totalCount} completed
            </Text>
            <View style={styles.headerButtons}>
              <Button
                title="Clear Done"
                onPress={clearCompleted}
                variant="secondary"
                size="small"
                icon="✓"
                style={styles.headerButton}
              />
            </View>
          </View>

          <FlatList
            data={shoppingList}
            keyExtractor={(item) => item.id}
            renderItem={renderShoppingItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.primary }]}
        onPress={() => setIsAddModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* Add Item Modal */}
      <Modal
        visible={isAddModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text weight='semiBold' style={[styles.modalTitle, { color: colors.text }]}>Add Shopping Item</Text>

            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border },
              ]}
              placeholder="Item name"
              placeholderTextColor={colors.subtext}
              value={newItemName}
              onChangeText={setNewItemName}
            />

            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border },
              ]}
              placeholder="Quantity (optional)"
              placeholderTextColor={colors.subtext}
              value={newItemQuantity}
              onChangeText={setNewItemQuantity}
            />

            <Text weight='semiBold' style={[styles.categoryLabel, { color: colors.text }]}>Category:</Text>
            <View style={styles.categoryGrid}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    { borderColor: colors.border },
                    newItemCategory === category && { backgroundColor: colors.primary },
                  ]}
                  onPress={() => setNewItemCategory(category)}
                >
                  <Text style={styles.categoryButtonIcon}>{getCategoryIcon(category)}</Text>
                  <Text
                    style={[
                      styles.categoryButtonText,
                      { color: colors.text },
                      newItemCategory === category && { color: "white" },
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <Button title="Add Item" onPress={addItem} icon="+" iconColor="white" style={styles.modalButton} />
              <Button
                title="Cancel"
                onPress={() => setIsAddModalVisible(false)}
                variant="secondary"
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    borderBottomStartRadius: 50,
    borderBottomEndRadius: 50,
  },
  headerTitle: {
    fontSize: 20,
    color: "white",
    fontWeight: "600",
    textAlign: "center",
  },
  side: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBlock: 20,
    paddingInline: 40,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    marginBottom: 20,
    resizeMode: "contain",
  },
  emptyTitle: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 24,
  },
  statsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  progress: {
    fontSize: 14,
  },
  headerButtons: {
    flexDirection: "row",
  },
  headerButton: {
    marginLeft: 10,
  },
  listContainer: {
    padding: 20,
    paddingTop: 0,
  },
  shoppingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  completedItem: {
    opacity: 0.6,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: "line-through",
  },
  itemQuantity: {
    fontSize: 14,
  },
  itemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  checkmark: {
    color: "white",
    fontSize: 14,
  },
  deleteButton: {
    padding: 4,
  },
  deleteIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  addButtonText: {
    color: "white",
    fontSize: 24,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderRadius: 50,
    padding: 16,
    marginBottom: 16,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    borderWidth: 1,
  },
  categoryLabel: {
    fontSize: 14,
    marginBottom: 12,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  categoryButton: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  categoryButtonIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  categoryButtonText: {
    fontSize: 12,
    textAlign: "center",
  },
  modalButtons: {
    gap: 10,
  },
  modalButton: {
    marginBottom: 5,
  },
})

export default ShoppingListScreen
