"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native"

interface Burger {
  id: string
  name: string
  price: number
  image: string
  category: string
}

const burgersData: Burger[] = [
  {
    id: "1",
    name: "Classic Burger",
    price: 9.99,
    image: "https://example.com/classic-burger.jpg",
    category: "Classic",
  },
  {
    id: "2",
    name: "Gourmet Burger",
    price: 12.99,
    image: "https://example.com/gourmet-burger.jpg",
    category: "Gourmet",
  },
  {
    id: "3",
    name: "Vegetarian Burger",
    price: 10.49,
    image: "https://example.com/vegetarian-burger.jpg",
    category: "Vegetarian",
  },
  { id: "4", name: "Spicy Burger", price: 11.49, image: "https://example.com/spicy-burger.jpg", category: "Spicy" },
  { id: "5", name: "BBQ Burger", price: 11.99, image: "https://example.com/bbq-burger.jpg", category: "BBQ" },
  {
    id: "6",
    name: "Another Classic Burger",
    price: 8.99,
    image: "https://example.com/classic-burger.jpg",
    category: "Classic",
  },
]

interface CategoryTabProps {
  category: string
  onPress: () => void
  isSelected: boolean
}

const CategoryTab: React.FC<CategoryTabProps> = ({ category, onPress, isSelected }) => (
  <TouchableOpacity style={[styles.categoryTab, isSelected ? styles.categoryTabSelected : null]} onPress={onPress}>
    <Text style={[styles.categoryText, isSelected ? styles.categoryTextSelected : null]}>{category}</Text>
  </TouchableOpacity>
)

const HomeScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [filteredBurgers, setFilteredBurgers] = useState<Burger[]>(burgersData)

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredBurgers(burgersData)
    } else {
      setFilteredBurgers(burgersData.filter((burger) => burger.category === selectedCategory))
    }
  }, [selectedCategory])

  const categories = ["All", "Classic", "Gourmet", "Vegetarian", "Spicy", "BBQ"]

  const renderBurgerItem = ({ item }: { item: Burger }) => (
    <View style={styles.burgerItem}>
      <Image source={{ uri: item.image }} style={styles.burgerImage} />
      <Text style={styles.burgerName}>{item.name}</Text>
      <Text style={styles.burgerPrice}>${item.price.toFixed(2)}</Text>
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.categoryList}>
        {categories.map((category) => (
          <CategoryTab
            key={category}
            category={category}
            onPress={() => setSelectedCategory(category)}
            isSelected={selectedCategory === category}
          />
        ))}
      </View>
      <FlatList
        data={filteredBurgers}
        renderItem={renderBurgerItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.burgersList}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
  },
  categoryList: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: "space-around",
  },
  categoryTab: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  categoryTabSelected: {
    backgroundColor: "#e0e0e0",
  },
  categoryText: {
    fontSize: 16,
    color: "#333",
  },
  categoryTextSelected: {
    fontWeight: "bold",
  },
  burgersList: {
    paddingHorizontal: 10,
  },
  burgerItem: {
    flex: 1,
    margin: 10,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    alignItems: "center",
  },
  burgerImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  burgerName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  burgerPrice: {
    fontSize: 16,
    color: "green",
  },
})

export default HomeScreen
