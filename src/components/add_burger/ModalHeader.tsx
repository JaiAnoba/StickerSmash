import React from "react"
import { Image, StyleSheet, TouchableOpacity, View } from "react-native"
import { useTheme } from "../../context/ThemeContext"
import Text from "../CustomText"

interface ModalHeaderProps {
  onClose: () => void
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({ onClose }) => {
  const { colors } = useTheme()

  return (
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
  )
}

const styles = StyleSheet.create({
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
})