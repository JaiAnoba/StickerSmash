"use client"

import type React from "react"
import { TouchableOpacity, StyleSheet, ActivityIndicator, View, type StyleProp, type ViewStyle } from "react-native"
import { useTheme } from "../context/ThemeContext"
import Text from "./CustomText"

interface ButtonProps {
  title: string
  onPress: () => void
  variant?: "primary" | "secondary" | "danger"
  size?: "small" | "medium" | "large"
  fullWidth?: boolean
  disabled?: boolean
  loading?: boolean
  icon?: string
  style?: StyleProp<ViewStyle>
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  fullWidth = false,
  disabled = false,
  loading = false,
  icon,
  style,
}) => {
  const { colors } = useTheme()

  const getBackgroundColor = () => {
    if (disabled) return colors.subtext
    switch (variant) {
      case "secondary":
        return "transparent"
      case "danger":
        return "#DC3545"
      default:
        return colors.primary
    }
  }

  const getTextColor = () => {
    if (disabled) return "#FFFFFF"
    switch (variant) {
      case "secondary":
        return colors.primary
      default:
        return "#FFFFFF"
    }
  }

  const getBorderColor = () => {
    if (disabled) return colors.subtext
    switch (variant) {
      case "secondary":
        return colors.primary
      default:
        return "transparent"
    }
  }

  const getButtonSize = () => {
    switch (size) {
      case "small":
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
        }
      case "large":
        return {
          paddingVertical: 16,
          paddingHorizontal: 32,
        }
      default:
        return {
          paddingVertical: 12,
          paddingHorizontal: 24,
        }
    }
  }

  const getTextSize = () => {
    switch (size) {
      case "small":
        return 14
      case "large":
        return 18
      default:
        return 16
    }
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          width: fullWidth ? "100%" : "auto",
          ...getButtonSize(),
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <View style={styles.buttonContent}>
          {icon && <Text style={[styles.icon, { marginRight: 8 }]}>{icon}</Text>}
          <Text weight="semiBold" style={[styles.text, { color: getTextColor(), fontSize: getTextSize() }]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
  },
  icon: {
    fontSize: 16,
  },
})

export default Button
