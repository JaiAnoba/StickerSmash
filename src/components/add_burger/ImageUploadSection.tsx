import React from "react"
import { Alert, Dimensions, Image, StyleSheet, TouchableOpacity, View } from "react-native"
import { useTheme } from "../../context/ThemeContext"
import Text from "../CustomText"

interface ImageUploadSectionProps {
  selectedImage: string | null
  onImageSelect: (uri: string | null) => void
  onShowImagePicker: () => void
  imageUploading: boolean
}

const { width } = Dimensions.get("window")

export const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  selectedImage,
  onImageSelect,
  onShowImagePicker,
  imageUploading,
}) => {
  const { colors } = useTheme()

  const removeImage = () => {
    Alert.alert("Remove Image", "Are you sure you want to remove this image?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => onImageSelect(null),
      },
    ])
  }

  return (
    <View style={styles.section}>
      <Text weight="semiBold" style={[styles.sectionTitle, { color: colors.text }]}>
        Burger Image
      </Text>

      {selectedImage ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
          <View style={styles.imageOverlay}>
            <TouchableOpacity style={styles.imageActionButton} onPress={onShowImagePicker}>
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
          onPress={onShowImagePicker}
          disabled={imageUploading}
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
  )
}

const styles = StyleSheet.create({
  section: { padding: 20, marginTop: -5 },
  sectionTitle: { fontSize: 16, marginBottom: 15 },
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
})