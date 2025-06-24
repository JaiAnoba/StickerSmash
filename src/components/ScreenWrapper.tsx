import React from "react"
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    View,
    ViewStyle,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useTheme } from "../context/ThemeContext"

interface ScreenWrapperProps {
  children: React.ReactNode
  scroll?: boolean
  style?: ViewStyle
  contentContainerStyle?: ViewStyle
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  scroll = false,
  style,
  contentContainerStyle,
}) => {
  const { colors, isDarkMode } = useTheme()

  const Wrapper = scroll ? ScrollView : View

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoiding}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <Wrapper
          style={[styles.wrapper, style]}
          contentContainerStyle={scroll ? [{ flexGrow: 1 }, contentContainerStyle] : undefined}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </Wrapper>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
  },
})

export default ScreenWrapper
