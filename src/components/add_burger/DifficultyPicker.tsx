import React from "react"
import { Image, Modal, StyleSheet, TouchableOpacity, View } from "react-native"
import { useTheme } from "../../context/ThemeContext"
import Text from "../CustomText"

interface DifficultyPickerProps {
  visible: boolean
  onClose: () => void
  onSelect: (difficulty: string) => void
}

const difficulties = ["Easy", "Medium", "Hard"]

export const DifficultyPicker: React.FC<DifficultyPickerProps> = ({
  visible,
  onClose,
  onSelect,
}) => {
  const { colors } = useTheme()

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.pickerOverlay}>
        <View style={[styles.pickerContainer, { backgroundColor: colors.background }]}>
          <View style={styles.pickerHeader}>
            <Text weight="semiBold" style={[styles.pickerTitle, { color: colors.text }]}>
              Select Difficulty
            </Text>
            <TouchableOpacity onPress={onClose}>
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
              onPress={() => onSelect(difficulty)}
            >
              <Text style={[styles.pickerItemText, { color: colors.text }]}>{difficulty}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  pickerOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  pickerContainer: { borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 20 },
  pickerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  pickerTitle: { fontSize: 16 },
  closeIcon: { width: 20, height: 20 },
  pickerItem: { paddingHorizontal: 20, paddingVertical: 15 },
  pickerItemText: { fontSize: 16 },
})