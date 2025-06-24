import { REMOVE_BG_API_KEY } from "@env"
import axios from "axios"
import { Buffer } from "buffer"
import * as FileSystem from "expo-file-system"
import * as ImagePicker from "expo-image-picker"
import type React from "react"
import { useState } from "react"
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { useBurgerData } from "../context/BurgerDataContext"
import { useTheme } from "../context/ThemeContext"
import type { Burger } from "../types/Burger"
import Button from "./Button"
import Text from "./CustomText"

interface AddBurgerModalProps {
  visible: boolean
  onClose: () => void
}

const { width } = Dimensions.get("window")

const removeImageBackground = async (imageUri: string): Promise<string | null> => {
  try {
    const base64Img = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    })

    const response = await axios.post(
      "https://api.remove.bg/v1.0/removebg",
      {
        image_file_b64: base64Img,
        size: "auto",
      },
      {
        headers: {
          "X-Api-Key": REMOVE_BG_API_KEY,
        },
        responseType: "arraybuffer",
      }
    )

    const base64FromBuffer = `data:image/png;base64,${Buffer.from(response.data, "binary").toString("base64")}`

    const outputPath = `${FileSystem.cacheDirectory}bg-removed-${Date.now()}.png`

    await FileSystem.writeAsStringAsync(outputPath, base64FromBuffer.replace(/^data:image\/png;base64,/, ""), {
      encoding: FileSystem.EncodingType.Base64,
    })

    return outputPath
  } catch (error) {
    console.error("Background removal failed", error)
    Alert.alert("Error", "Failed to remove background from image.")
    return null
  }
}

const AddBurgerModal: React.FC<AddBurgerModalProps> = ({ visible, onClose }) => {
  const { colors, isDarkMode } = useTheme()
  const { addBurger } = useBurgerData()

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    difficulty: "",
    cookTime: "",
    totalTime: "",
    prepTime: "", 
    servings: "", 
    rating: "",
    calories: "", 
    isRecommended: false, 
  })

  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [imageUploading, setImageUploading] = useState(false)

  const [ingredients, setIngredients] = useState<string[]>([])
  const [currentIngredient, setCurrentIngredient] = useState("")

  const [instructions, setInstructions] = useState<string[]>([])
  const [currentInstruction, setCurrentInstruction] = useState("")

  const [nutrition, setNutrition] = useState({
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  })

  const [showCategoryPicker, setShowCategoryPicker] = useState(false)
  const [showDifficultyPicker, setShowDifficultyPicker] = useState(false)
  const [showImagePicker, setShowImagePicker] = useState(false)

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
  const difficulties = ["Easy", "Medium", "Hard"]

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNutritionChange = (field: string, value: string) => {
    setNutrition((prev) => ({ ...prev, [field]: value }))
  }

  const addIngredient = () => {
    if (currentIngredient.trim()) {
      setIngredients((prev) => [...prev, currentIngredient.trim()])
      setCurrentIngredient("")
    }
  }

  const removeIngredient = (index: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index))
  }

  const addInstruction = () => {
    if (currentInstruction.trim()) {
      setInstructions((prev) => [...prev, currentInstruction.trim()])
      setCurrentInstruction("")
    }
  }

  const removeInstruction = (index: number) => {
    setInstructions((prev) => prev.filter((_, i) => i !== index))
  }

  // Request permissions for image picker
  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== "granted") {
      Alert.alert("Permission Required", "Sorry, we need camera roll permissions to upload burger images!", [
        { text: "OK" },
      ])
      return false
    }
    return true
  }

  // Handle image selection from gallery
  const pickImageFromGallery = async () => {
    const hasPermission = await requestPermissions()
    if (!hasPermission) return

    setImageUploading(true)
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        exif: false,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const originalUri = result.assets[0].uri
        const uriWithoutBg = await removeImageBackground(originalUri)

        if (uriWithoutBg) {
          setSelectedImage(uriWithoutBg)
          setShowImagePicker(false)
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image.")
      console.error(error)
    } finally {
      setImageUploading(false)
    }
  }

  // Handle image capture from camera
  const takePhotoWithCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== "granted") {
      Alert.alert("Permission Required", "Sorry, we need camera permissions to take burger photos!", [{ text: "OK" }])
      return
    }

    setImageUploading(true)
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        exif: false,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri
        setSelectedImage(imageUri)
        setShowImagePicker(false)
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo. Please try again.")
      console.error("Camera error:", error)
    } finally {
      setImageUploading(false)
    }
  }

  // Remove selected image
  const removeImage = () => {
    Alert.alert("Remove Image", "Are you sure you want to remove this image?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => setSelectedImage(null),
      },
    ])
  }

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      description: "",
      difficulty: "",
      cookTime: "",
      totalTime: "",
      prepTime: "",
      servings: "",
      rating: "",
      calories: "",
      isRecommended: false,
    })
    setSelectedImage(null)
    setIngredients([])
    setInstructions([])
    setCurrentIngredient("")
    setCurrentInstruction("")
    setNutrition({
      calories: "",
      protein: "",
      carbs: "",
      fat: "",
    })
  }

  const handleSubmit = () => {
    // Validation
    if (!formData.name.trim()) {
      Alert.alert("Error", "Please enter a burger name")
      return
    }
    if (!formData.category) {
      Alert.alert("Error", "Please select a category")
      return
    }
    if (!formData.description.trim()) {
      Alert.alert("Error", "Please enter a description")
      return
    }
    if (!formData.difficulty) {
      Alert.alert("Error", "Please select difficulty level")
      return
    }
    if (!formData.cookTime.trim()) {
      Alert.alert("Error", "Please enter cook time")
      return
    }
    if (!formData.totalTime.trim()) {
      Alert.alert("Error", "Please enter total time")
      return
    }
    if (!formData.prepTime.trim()) {
      Alert.alert("Error", "Please enter prep time")
      return
    }
    if (!formData.servings.trim()) {
      Alert.alert("Error", "Please enter number of servings")
      return
    }
    if (!selectedImage) {
      Alert.alert("Error", "Please add a burger image")
      return
    }
    if (ingredients.length === 0) {
      Alert.alert("Error", "Please add at least one ingredient")
      return
    }
    if (instructions.length === 0) {
      Alert.alert("Error", "Please add at least one instruction")
      return
    }

    // Create the new burger object
    const newBurger: Burger = {
      id: `user_${Date.now()}`,
      name: formData.name.trim(),
      category: formData.category,
      description: formData.description.trim(),
      difficulty: formData.difficulty as "Easy" | "Medium" | "Hard",
      cookTime: `${formData.cookTime.trim()} mins`,
      totalTime: `${formData.totalTime.trim()} mins`,
      prepTime: `${formData.prepTime.trim()} mins`,
      servings: Number.parseInt(formData.servings) || 1,
      calories: Number.parseInt(formData.calories) || 0, 
      rating: Number.parseFloat(formData.rating) || 4.0, 
      isRecommended: formData.isRecommended, 
      image: selectedImage,
      ingredients,
      instructions,
      nutrition: {
        calories: Number.parseInt(nutrition.calories) || 0,
        protein: Number.parseInt(nutrition.protein) || 0,
        carbs: Number.parseInt(nutrition.carbs) || 0,
        fat: Number.parseInt(nutrition.fat) || 0,
      },
      isUserAdded: true,
    }

    addBurger(newBurger)

    resetForm()

    Alert.alert("Success", "Burger recipe added successfully!", [
      {
        text: "OK",
        onPress: () => {
          onClose()
        },
      },
    ])
  }

  const renderImagePicker = () => (
    <Modal visible={showImagePicker} transparent animationType="slide">
      <View style={styles.pickerOverlay}>
        <View style={[styles.imagePickerContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text weight="bold" style={[styles.headerTitle, { color: colors.text }]}>
              Select Image
            </Text>

            <TouchableOpacity onPress={() => setShowImagePicker(false)} style={styles.closeButton}>
              <Image
                source={{ uri: "https://img.icons8.com/ios-glyphs/90/multiply.png" }}
                style={[styles.closeIcon, { tintColor: colors.text }]}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.imagePickerOptions}>
            <TouchableOpacity
              style={[styles.imagePickerOption, { backgroundColor: colors.inputBackground }]}
              onPress={takePhotoWithCamera}
              disabled={imageUploading}
            >
              <Image
                source={{ uri: "https://img.icons8.com/ios-glyphs/60/camera--v1.png" }}
                style={[styles.imagePickerIcon, { tintColor: colors.primary }]}
              />
              <Text weight="medium" style={[styles.imagePickerText, { color: colors.text }]}>
                Take Photo
              </Text>
              <Text style={[styles.imagePickerSubtext, { color: colors.subtext }]}>Use camera to capture</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.imagePickerOption, { backgroundColor: colors.inputBackground }]}
              onPress={pickImageFromGallery}
              disabled={imageUploading}
            >
              <Image
                source={{ uri: "https://img.icons8.com/ios-glyphs/60/image--v1.png" }}
                style={[styles.imagePickerIcon, { tintColor: colors.primary }]}
              />
              <Text weight="medium" style={[styles.imagePickerText, { color: colors.text }]}>
                Choose from Gallery
              </Text>
              <Text style={[styles.imagePickerSubtext, { color: colors.subtext }]}>Select from your photos</Text>
            </TouchableOpacity>
          </View>

          {imageUploading && (
            <View style={styles.uploadingContainer}>
              <Text style={[styles.uploadingText, { color: colors.subtext }]}>Processing image...</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  )

  const renderCategoryPicker = () => (
    <Modal visible={showCategoryPicker} transparent animationType="slide">
      <View style={styles.pickerOverlay}>
        <View style={[styles.pickerContainer, { backgroundColor: colors.background }]}>
          <View style={styles.pickerHeader}>
            <Text weight="semiBold" style={[styles.pickerTitle, { color: colors.text }]}>
              Select Category
            </Text>
            <TouchableOpacity onPress={() => setShowCategoryPicker(false)}>
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
                onPress={() => {
                  handleInputChange("category", category)
                  setShowCategoryPicker(false)
                }}
              >
                <Text style={[styles.pickerItemText, { color: colors.text }]}>{category}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )

  const renderDifficultyPicker = () => (
    <Modal visible={showDifficultyPicker} transparent animationType="slide">
      <View style={styles.pickerOverlay}>
        <View style={[styles.pickerContainer, { backgroundColor: colors.background }]}>
          <View style={styles.pickerHeader}>
            <Text weight="semiBold" style={[styles.pickerTitle, { color: colors.text }]}>
              Select Difficulty
            </Text>
            <TouchableOpacity onPress={() => setShowDifficultyPicker(false)}>
              <Image
                source={{ uri: "https://img.icons8.com/ios-glyphs/30/multiply.png" }}
                style={[styles.closeIcon, { tintColor: colors.text }]}
              />
            </TouchableOpacity>
          </View>
          {difficulties.map((difficulty) => (
            <TouchableOpacity
              key={difficulty}
              style={styles.pickerItem}
              onPress={() => {
                handleInputChange("difficulty", difficulty)
                setShowDifficultyPicker(false)
              }}
            >
              <Text style={[styles.pickerItemText, { color: colors.text }]}>{difficulty}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  )

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar
          backgroundColor={isDarkMode ? colors.statusBar : "#8B0000"}
          barStyle={isDarkMode ? "light-content" : "dark-content"}
        />

        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text weight="bold" style={[styles.headerTitle, { color: colors.text }]}>
            Add New Burger Recipe
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Image
              source={{ uri: "https://img.icons8.com/ios-glyphs/90/multiply.png" }}
              style={[styles.closeIcon, { tintColor: colors.text }]}
            />
          </TouchableOpacity>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Image Upload Section */}
          <View style={styles.section}>
            <Text weight="semiBold" style={[styles.sectionTitle, { color: colors.text }]}>
              Burger Image
            </Text>

            {selectedImage ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
                <View style={styles.imageOverlay}>
                  <TouchableOpacity style={styles.imageActionButton} onPress={() => setShowImagePicker(true)}>
                    <Image
                      source={{ uri: "https://img.icons8.com/ios-glyphs/30/edit--v1.png" }}
                      style={styles.imageActionIcon}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.imageActionButton, styles.removeButton]} onPress={removeImage}>
                    <Image
                      source={{ uri: "https://img.icons8.com/ios-glyphs/30/trash--v1.png" }}
                      style={styles.imageActionIcon}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={[
                  styles.imageUploadButton,
                  { backgroundColor: colors.inputBackground, borderColor: colors.border },
                ]}
                onPress={() => setShowImagePicker(true)}
              >
                <Image
                  source={{ uri: "https://img.icons8.com/ios-glyphs/60/add-image.png" }}
                  style={[styles.uploadIcon, { tintColor: colors.subtext }]}
                />
                <Text weight="medium" style={[styles.uploadText, { color: colors.text }]}>
                  Add Burger Image
                </Text>
                <Text style={[styles.uploadSubtext, { color: colors.subtext }]}>
                  Take a photo or choose from gallery
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Basic Information */}
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
                onChangeText={(value) => handleInputChange("name", value)}
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
                onPress={() => setShowCategoryPicker(true)}
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
                onChangeText={(value) => handleInputChange("description", value)}
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
                  onPress={() => setShowDifficultyPicker(true)}
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

              <View style={[styles.inputContainer, styles.flex1]}>
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
                  onChangeText={(value) => handleInputChange("cookTime", value)}
                />
              </View>
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
                onChangeText={(value) => handleInputChange("totalTime", value)}
              />
            </View>

            <View style={styles.inputContainer}>
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
                onChangeText={(value) => handleInputChange("prepTime", value)}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.flex1, styles.marginRight]}>
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
                  onChangeText={(value) => handleInputChange("servings", value)}
                  keyboardType="numeric"
                />
              </View>

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
                  onChangeText={(value) => handleInputChange("calories", value)}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.checkboxContainer}>
                <TouchableOpacity
                  style={[
                    styles.checkbox,
                    formData.isRecommended && styles.checkboxChecked,
                    { borderColor: colors.border },
                  ]}
                  onPress={() => handleInputChange("isRecommended", !formData.isRecommended)}
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
            </View>
          </View>

          {/* Ingredients */}
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
                onChangeText={setCurrentIngredient}
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

          {/* Instructions */}
          <View style={styles.section}>
            <Text weight="semiBold" style={[styles.sectionTitle, { color: colors.text }]}>
              Cooking Instructions
            </Text>

            <View style={styles.addItemContainer}>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  styles.flex1,
                  styles.marginRight,
                  { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border },
                ]}
                placeholder="Add a cooking step..."
                placeholderTextColor={colors.subtext}
                value={currentInstruction}
                onChangeText={setCurrentInstruction}
                multiline
                numberOfLines={2}
                textAlignVertical="top"
              />
              <TouchableOpacity style={styles.addButton} onPress={addInstruction}>
                <Image source={{ uri: "https://img.icons8.com/ios-glyphs/90/plus-math.png" }} style={styles.addIcon} />
              </TouchableOpacity>
            </View>

            <View style={styles.instructionsList}>
              {instructions.map((instruction, index) => (
                <View key={index} style={[styles.instructionItem, { backgroundColor: colors.inputBackground }]}>
                  <View style={styles.instructionNumber}>
                    <Text style={styles.instructionNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={[styles.instructionText, { color: colors.text }]}>{instruction}</Text>
                  <TouchableOpacity onPress={() => removeInstruction(index)}>
                    <Image
                      source={{ uri: "https://img.icons8.com/ios-glyphs/30/multiply.png" }}
                      style={[styles.removeIcon, { tintColor: colors.subtext }]}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          {/* Nutrition Information */}
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
                  onChangeText={(value) => handleNutritionChange("calories", value)}
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
                  onChangeText={(value) => handleNutritionChange("protein", value)}
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
                  onChangeText={(value) => handleNutritionChange("carbs", value)}
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
                  onChangeText={(value) => handleNutritionChange("fat", value)}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* Submit Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              title="Add Burger Recipe"
              onPress={handleSubmit}
              variant="primary"
              style={[styles.button, styles.submitButton]}
              textStyle={{ fontSize: 16 }}
            />
          </View>
        </ScrollView>

        {renderImagePicker()}
        {renderCategoryPicker()}
        {renderDifficultyPicker()}
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    right: 20,
    top: 8,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  closeIcon: { width: 20, height: 20 },
  headerTitle: { fontSize: 18, textAlign: "center" },
  headerSpacer: { width: 40 },
  scrollView: { flex: 1 },
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
  imageContainer: { position: "relative", alignItems: "center", marginBottom: 15 },
  selectedImage: { width: width * 0.6, height: width * 0.6, borderRadius: 12, resizeMode: "cover" },
  imageOverlay: { position: "absolute", top: 10, right: 10, flexDirection: "row", gap: 8 },
  imageActionButton: {
    width: 36,
    height: 36,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButton: { backgroundColor: "rgba(220,38,38,0.9)" },
  imageActionIcon: { width: 18, height: 18, tintColor: "white" },
  imageUploadButton: {
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  uploadIcon: { width: 40, height: 40, marginBottom: 8 },
  uploadText: { fontSize: 16, marginBottom: 4 },
  uploadSubtext: { fontSize: 12, textAlign: "center" },
  imagePickerContainer: { borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 20 },
  imagePickerOptions: { padding: 20, gap: 15 },
  imagePickerOption: { padding: 20, borderRadius: 12, alignItems: "center" },
  imagePickerIcon: { width: 40, height: 40, marginBottom: 8 },
  imagePickerText: { fontSize: 16, marginBottom: 4 },
  imagePickerSubtext: { fontSize: 12, textAlign: "center" },
  uploadingContainer: { padding: 20, alignItems: "center" },
  uploadingText: { fontSize: 14 },
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
  instructionsList: { gap: 10 },
  instructionItem: { flexDirection: "row", alignItems: "flex-start", padding: 12, borderRadius: 8, gap: 10 },
  instructionNumber: {
    width: 24,
    height: 24,
    backgroundColor: "#8B0000",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  instructionNumberText: { color: "white", fontSize: 12, fontWeight: "bold" },
  instructionText: { flex: 1, fontSize: 14, lineHeight: 20 },
  nutritionGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  nutritionItem: { width: "48%" },
  buttonContainer: { padding: 20 },
  button: { flex: 1 },
  cancelButton: { marginRight: 5 },
  submitButton: { marginLeft: 5 },
  pickerOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  pickerContainer: { borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 20 },
  pickerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  pickerTitle: { fontSize: 16 },
  pickerItem: { paddingHorizontal: 20, paddingVertical: 15, },
  pickerItemText: { fontSize: 16 },
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

export default AddBurgerModal
