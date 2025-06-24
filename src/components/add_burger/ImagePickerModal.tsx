import * as ImagePicker from "expo-image-picker"
import React from "react"
import { Alert, Image, Modal, StyleSheet, TouchableOpacity, View } from "react-native"
import { useTheme } from "../../context/ThemeContext"
import Text from "../CustomText"

interface ImagePickerModalProps {
  visible: boolean
  onClose: () => void
  onImageSelect: (uri: string | null) => void
  imageUploading: boolean
  setImageUploading: (uploading: boolean) => void
  removeImageBackground: (imageUri: string) => Promise<string | null>
}

export const ImagePickerModal: React.FC<ImagePickerModalProps> = ({
  visible,
  onClose,
  onImageSelect,
  imageUploading,
  setImageUploading,
  removeImageBackground,
}) => {
  const { colors } = useTheme()

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
          onImageSelect(uriWithoutBg)
          onClose()
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
        onImageSelect(imageUri)
        onClose()
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo. Please try again.")
      console.error("Camera error:", error)
    } finally {
      setImageUploading(false)
    }
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.pickerOverlay}>
        <View style={[styles.imagePickerContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text weight="bold" style={[styles.headerTitle, { color: colors.text }]}>
              Select Image
            </Text>

            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
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
}

const styles = StyleSheet.create({
  pickerOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  imagePickerContainer: { borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 20 },
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    position: "relative",
  },
  headerTitle: { fontSize: 18, textAlign: "center" },
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
  imagePickerOptions: { padding: 20, gap: 15 },
  imagePickerOption: { padding: 20, borderRadius: 12, alignItems: "center" },
  imagePickerIcon: { width: 40, height: 40, marginBottom: 8 },
  imagePickerText: { fontSize: 16, marginBottom: 4 },
  imagePickerSubtext: { fontSize: 12, textAlign: "center" },
  uploadingContainer: { padding: 20, alignItems: "center" },
  uploadingText: { fontSize: 14 },
})