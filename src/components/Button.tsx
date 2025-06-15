"use client"

import type React from "react"
import { Image, TouchableOpacity, StyleSheet, ActivityIndicator, View, type StyleProp, type ViewStyle } from "react-native"
import { useTheme } from "../context/ThemeContext"
import Text from "./CustomText"

interface ButtonProps {
  title: string
  onPress: () => void
  variant?: "primary" | "secondary" | "danger" | "success" | "outline" | string
  size?: "small" | "medium" | "large"
  fullWidth?: boolean
  disabled?: boolean
  loading?: boolean
  icon?: string
  iconColor?: string
  textColor?: string
  backgroundColor?: string
  borderColor?: string  
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
  iconColor,
  textColor,
  backgroundColor,
  borderColor, 
  style,
}) => {
  const { colors } = useTheme()

  const getBackgroundColor = () => {
    if (disabled) return colors.subtext
    if (backgroundColor) return backgroundColor
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
    if (textColor) return textColor
    switch (variant) {
      case "secondary":
        return colors.primary
      default:
        return "#FFFFFF"
    }
  }

  const getBorderColor = () => {
    if (disabled) return colors.subtext
    if (borderColor) return borderColor
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
          paddingVertical: 10,
          paddingHorizontal: 20,
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
        return 16
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
          {icon && (
            typeof icon === "string" && icon.startsWith("http") ? (
              <Image source={{ uri: icon }} style={styles.iconImage} />
            ) : (
              <Text
                style={[
                  styles.iconText,
                  { marginRight: 8, color: iconColor || getTextColor() },
                ]}
              >
                {icon}
              </Text>
            )
          )}
          <Text weight="semiBold" style={[styles.text, { color: textColor || getTextColor(), fontSize: getTextSize() }]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
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
    fontSize: 14,
  },
  iconText: {
    fontSize: 14,
  },
  iconImage: {
    width: 18,
    height: 18,
    marginRight: 8,
    resizeMode: "contain",
  },

})

export default Button
