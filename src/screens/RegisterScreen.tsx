"use client"

import type React from "react"
import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RootStackParamList } from "../../App"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"
import Button from "../components/Button"

type NavigationProp = StackNavigationProp<RootStackParamList>

const RegisterScreen: React.FC = () => {
  const { colors, isDarkMode } = useTheme()
  const { register } = useAuth()
  const navigation = useNavigation<NavigationProp>()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter your name")
      return false
    }
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email")
      return false
    }
    if (!email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email address")
      return false
    }
    if (!password.trim()) {
      Alert.alert("Error", "Please enter a password")
      return false
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long")
      return false
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match")
      return false
    }
    return true
  }

  const handleRegister = async () => {
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      const success = await register(name, email, password)
      if (success) {
        Alert.alert("Success", "Account created successfully!", [
          {
            text: "OK",
            onPress: () => {
              // Navigate to Main screen after successful registration
              navigation.reset({
                index: 0,
                routes: [{ name: "Main" }],
              })
            },
          },
        ])
      } else {
        Alert.alert("Error", "Registration failed. Please try again.")
      }
    } catch (error) {
      Alert.alert("Error", "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const navigateToLogin = () => {
    navigation.goBack()
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar backgroundColor={colors.statusBar} barStyle={isDarkMode ? "light-content" : "dark-content"} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>🍔</Text>
            <Text style={[styles.title, { color: colors.text }]}>Join Burgerpedia</Text>
            <Text style={[styles.subtitle, { color: colors.subtext }]}>
              Create your account and start your burger journey
            </Text>
          </View>

          {/* Registration Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Full Name</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.inputBackground,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="Enter your full name"
                placeholderTextColor={colors.subtext}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Email</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.inputBackground,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="Enter your email"
                placeholderTextColor={colors.subtext}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.passwordInput,
                    {
                      backgroundColor: colors.inputBackground,
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.subtext}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity style={styles.eyeButton} onPress={togglePasswordVisibility} activeOpacity={0.7}>
                  <Image
                    source={{
                      uri: showPassword
                        ? "https://img.icons8.com/fluency-systems-regular/48/visible--v1.png"
                        : "https://img.icons8.com/fluency-systems-regular/48/closed-eye.png",
                    }}
                    style={[styles.eyeIcon, { tintColor: colors.subtext }]}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Confirm Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.passwordInput,
                    {
                      backgroundColor: colors.inputBackground,
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
                  placeholder="Confirm your password"
                  placeholderTextColor={colors.subtext}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={toggleConfirmPasswordVisibility}
                  activeOpacity={0.7}
                >
                  <Image
                    source={{
                      uri: showConfirmPassword
                        ? "https://img.icons8.com/fluency-systems-regular/48/visible--v1.png"
                        : "https://img.icons8.com/fluency-systems-regular/48/closed-eye.png",
                    }}
                    style={[styles.eyeIcon, { tintColor: colors.subtext }]}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <Button
              title={isLoading ? "Creating Account..." : "Create Account"}
              onPress={handleRegister}
              disabled={isLoading}
              fullWidth
              style={styles.registerButton}
            />

            {isLoading && <ActivityIndicator size="small" color={colors.primary} style={styles.loadingIndicator} />}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.subtext }]}>Already have an account?</Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text style={[styles.linkText, { color: colors.primary }]}>Sign in here</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  form: {
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    borderRadius: 12,
    padding: 16,
    paddingRight: 50,
    fontSize: 16,
    borderWidth: 1,
  },
  eyeButton: {
    position: "absolute",
    right: 16,
    top: 16,
    padding: 4,
  },
  eyeIcon: {
    width: 20,
    height: 20,
  },
  registerButton: {
    marginTop: 10,
  },
  loadingIndicator: {
    marginTop: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 16,
    marginRight: 5,
  },
  linkText: {
    fontSize: 16,
    fontWeight: "600",
  },
})

export default RegisterScreen
