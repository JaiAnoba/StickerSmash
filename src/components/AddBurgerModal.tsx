import { REMOVE_BG_API_KEY } from "@env"
import axios from "axios"
import { Buffer } from "buffer"
import * as FileSystem from "expo-file-system"
import type React from "react"
import { useState } from "react"
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native"
import { BasicInformationSection } from "../components/add_burger/BasicInformationSection"
import { CategoryPicker } from "../components/add_burger/CategoryPicker"
import { DifficultyPicker } from "../components/add_burger/DifficultyPicker"
import { ImagePickerModal } from "../components/add_burger/ImagePickerModal"
import { ImageUploadSection } from "../components/add_burger/ImageUploadSection"
import { IngredientsSection } from "../components/add_burger/IngredientsSection"
import { InstructionsSection } from "../components/add_burger/InstructionsSection"
import { ModalHeader } from "../components/add_burger/ModalHeader"
import { useBurgerData } from "../context/BurgerDataContext"
import { useTheme } from "../context/ThemeContext"
import type { Burger } from "../types/Burger"
import Button from "./Button"

interface AddBurgerModalProps {
  visible: boolean
  onClose: () => void
}

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

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNutritionChange = (field: string, value: string) => {
    setNutrition((prev) => ({ ...prev, [field]: value }))
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
    // if (!formData.cookTime.trim()) {
    //   Alert.alert("Error", "Please enter cook time")
    //   return
    // }
    if (!formData.totalTime.trim()) {
      Alert.alert("Error", "Please enter total time")
      return
    }
    // if (!formData.prepTime.trim()) {
    //   Alert.alert("Error", "Please enter prep time")
    //   return
    // }
    // if (!formData.servings.trim()) {
    //   Alert.alert("Error", "Please enter number of servings")
    //   return
    // }
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

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar
          backgroundColor={isDarkMode ? colors.statusBar : "#8B0000"}
          barStyle={isDarkMode ? "light-content" : "dark-content"}
        />

        <ModalHeader onClose={onClose} />

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <ImageUploadSection
            selectedImage={selectedImage}
            onImageSelect={setSelectedImage}
            onShowImagePicker={() => setShowImagePicker(true)}
            imageUploading={imageUploading}
          />

          <BasicInformationSection
            formData={formData}
            onInputChange={handleInputChange}
            onShowCategoryPicker={() => setShowCategoryPicker(true)}
            onShowDifficultyPicker={() => setShowDifficultyPicker(true)}
          />

          <IngredientsSection
            ingredients={ingredients}
            currentIngredient={currentIngredient}
            onIngredientsChange={setIngredients}
            onCurrentIngredientChange={setCurrentIngredient}
          />

          <InstructionsSection
            instructions={instructions}
            currentInstruction={currentInstruction}
            onInstructionsChange={setInstructions}
            onCurrentInstructionChange={setCurrentInstruction}
          />

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

        <ImagePickerModal
          visible={showImagePicker}
          onClose={() => setShowImagePicker(false)}
          onImageSelect={setSelectedImage}
          imageUploading={imageUploading}
          setImageUploading={setImageUploading}
          removeImageBackground={removeImageBackground}
        />

        <CategoryPicker
          visible={showCategoryPicker}
          onClose={() => setShowCategoryPicker(false)}
          onSelect={(category) => {
            handleInputChange("category", category)
            setShowCategoryPicker(false)
          }}
        />

        <DifficultyPicker
          visible={showDifficultyPicker}
          onClose={() => setShowDifficultyPicker(false)}
          onSelect={(difficulty) => {
            handleInputChange("difficulty", difficulty)
            setShowDifficultyPicker(false)
          }}
        />
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  buttonContainer: { padding: 20 },
  button: { flex: 1 },
  submitButton: { marginLeft: 5 },
})

export default AddBurgerModal