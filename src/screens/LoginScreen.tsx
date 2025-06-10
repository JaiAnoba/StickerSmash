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
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RootStackParamList } from "../../App"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"
import Button from "../components/Button"

type NavigationProp = StackNavigationProp<RootStackParamList>

const LoginScreen: React.FC = () => {
  const { colors, isDarkMode } = useTheme()
  const { login } = useAuth()
  const navigation = useNavigation<NavigationProp>()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Forgot password states
  const [forgotPasswordModalVisible, setForgotPasswordModalVisible] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [resetLoading, setResetLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    setIsLoading(true)
    try {
      const success = await login(email, password)
      if (success) {
        // Navigate to Main screen after successful login
        navigation.reset({
          index: 0,
          routes: [{ name: "Main" }],
        })
      } else {
        Alert.alert("Error", "Invalid email or password")
      }
    } catch (error) {
      Alert.alert("Error", "Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const navigateToRegister = () => {
    navigation.navigate("Register")
  }

  const handleForgotPassword = () => {
    setForgotPasswordModalVisible(true)
    // Pre-fill with the email from login form if available
    if (email) {
      setResetEmail(email)
    }
  }

  const handleResetPassword = async () => {
    if (!resetEmail.trim() || !resetEmail.includes("@")) {
      Alert.alert("Error", "Please enter a valid email address")
      return
    }

    setResetLoading(true)
    try {
      // Simulate API call for password reset
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, always show success
      setResetSent(true)

      // In a real app, you would call an API endpoint:
      // await authService.sendPasswordResetEmail(resetEmail)
    } catch (error) {
      Alert.alert("Error", "Failed to send reset email. Please try again.")
    } finally {
      setResetLoading(false)
    }
  }

  const closeResetModal = () => {
    setForgotPasswordModalVisible(false)
    setResetEmail("")
    setResetSent(false)
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar backgroundColor={colors.statusBar} barStyle={isDarkMode ? "light-content" : "dark-content"} />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>🍔</Text>
          <Text style={[styles.title, { color: colors.text }]}>Welcome to Burgerpedia</Text>
          <Text style={[styles.subtitle, { color: colors.subtext }]}>
            Discover amazing burger recipes and cooking tips
          </Text>
        </View>

        {/* Login Form */}
        <View style={styles.form}>
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
            <TextInput
              style={[
                styles.input,
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
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Forgot Password Link */}
          <TouchableOpacity style={styles.forgotPasswordContainer} onPress={handleForgotPassword} activeOpacity={0.7}>
            <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>Forgot password?</Text>
          </TouchableOpacity>

          <Button
            title={isLoading ? "Logging in..." : "Login"}
            onPress={handleLogin}
            disabled={isLoading}
            fullWidth
            style={styles.loginButton}
          />

          {isLoading && <ActivityIndicator size="small" color={colors.primary} style={styles.loadingIndicator} />}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.subtext }]}>Don't have an account?</Text>
          <TouchableOpacity onPress={navigateToRegister}>
            <Text style={[styles.linkText, { color: colors.primary }]}>Sign up here</Text>
          </TouchableOpacity>
        </View>

        {/* Demo Credentials */}
        {/* <View style={[styles.demoContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.demoTitle, { color: colors.text }]}>Demo Credentials:</Text>
          <Text style={[styles.demoText, { color: colors.subtext }]}>Email: demo@burgerpedia.com</Text>
          <Text style={[styles.demoText, { color: colors.subtext }]}>Password: demo123</Text>
        </View> */}
      </View>

      {/* Forgot Password Modal */}
      <Modal visible={forgotPasswordModalVisible} transparent animationType="slide" onRequestClose={closeResetModal}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {!resetSent ? (
              <>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Reset Password</Text>
                <Text style={[styles.modalSubtitle, { color: colors.subtext }]}>
                  Enter your email address and we'll send you instructions to reset your password.
                </Text>

                <View style={styles.modalInputContainer}>
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
                    value={resetEmail}
                    onChangeText={setResetEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                <View style={styles.modalButtons}>
                  <Button
                    title={resetLoading ? "Sending..." : "Send Reset Link"}
                    onPress={handleResetPassword}
                    disabled={resetLoading}
                    fullWidth
                    style={styles.resetButton}
                  />

                  <Button
                    title="Cancel"
                    onPress={closeResetModal}
                    variant="secondary"
                    fullWidth
                    style={styles.cancelButton}
                  />
                </View>

                {resetLoading && (
                  <ActivityIndicator size="small" color={colors.primary} style={styles.loadingIndicator} />
                )}
              </>
            ) : (
              <View style={styles.successContainer}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Email Sent!</Text>
                <Text style={[styles.modalSubtitle, { color: colors.subtext, textAlign: "center" }]}>
                  We've sent password reset instructions to:
                </Text>
                <Text style={[styles.emailSent, { color: colors.primary }]}>{resetEmail}</Text>
                <Text style={[styles.modalSubtitle, { color: colors.subtext, textAlign: "center", marginTop: 10 }]}>
                  Please check your inbox and follow the instructions to reset your password.
                </Text>

                <Button title="Back to Login" onPress={closeResetModal} fullWidth style={styles.backButton} />
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: "center",
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
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: "500",
  },
  loginButton: {
    marginTop: 10,
  },
  loadingIndicator: {
    marginTop: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  footerText: {
    fontSize: 16,
    marginRight: 5,
  },
  linkText: {
    fontSize: 16,
    fontWeight: "600",
  },
  demoContainer: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    alignItems: "center",
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
  demoText: {
    fontSize: 12,
    marginBottom: 2,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  modalSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  modalInputContainer: {
    marginBottom: 24,
  },
  modalButtons: {
    gap: 12,
  },
  resetButton: {
    marginBottom: 0,
  },
  cancelButton: {
    marginBottom: 0,
  },
  successContainer: {
    alignItems: "center",
    padding: 10,
  },
  successIcon: {
    fontSize: 50,
    marginBottom: 20,
  },
  emailSent: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 8,
  },
  backButton: {
    marginTop: 24,
  },
})

export default LoginScreen
