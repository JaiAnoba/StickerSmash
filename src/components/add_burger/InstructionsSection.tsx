import React from "react"
import { Image, StyleSheet, TextInput, TouchableOpacity, View } from "react-native"
import { useTheme } from "../../context/ThemeContext"
import Text from "../CustomText"

interface InstructionsSectionProps {
  instructions: string[]
  currentInstruction: string
  onInstructionsChange: (instructions: string[]) => void
  onCurrentInstructionChange: (instruction: string) => void
}

export const InstructionsSection: React.FC<InstructionsSectionProps> = ({
  instructions,
  currentInstruction,
  onInstructionsChange,
  onCurrentInstructionChange,
}) => {
  const { colors } = useTheme()

  const addInstruction = () => {
    if (currentInstruction.trim()) {
      onInstructionsChange([...instructions, currentInstruction.trim()])
      onCurrentInstructionChange("")
    }
  }

  const removeInstruction = (index: number) => {
    onInstructionsChange(instructions.filter((_, i) => i !== index))
  }

  return (
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
          onChangeText={onCurrentInstructionChange}
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
  )
}

const styles = StyleSheet.create({
  section: { padding: 20, marginTop: -5 },
  sectionTitle: { fontSize: 16, marginBottom: 15 },
  input: { borderRadius: 999, padding: 12, fontSize: 14, borderWidth: 1, fontFamily: "Poppins-Regular" },
  textArea: { height: 80, borderRadius: 8, fontFamily: "Poppins-Regular" },
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
  removeIcon: { width: 14, height: 14 },
  flex1: { flex: 1 },
  marginRight: { marginRight: 10 },
})