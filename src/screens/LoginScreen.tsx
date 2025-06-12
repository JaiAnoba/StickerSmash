"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  View,
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
  Image,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RootStackParamList } from "../../App"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"
import Button from "../components/Button"
import Text from "../components/CustomText"

type NavigationProp = StackNavigationProp<RootStackParamList>

const LoginScreen: React.FC = () => {
  const { colors, isDarkMode } = useTheme()
  const { user, login } = useAuth();
  const navigation = useNavigation<NavigationProp>()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Forgot password states
  const [forgotPasswordModalVisible, setForgotPasswordModalVisible] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [resetLoading, setResetLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  
  useEffect(() => {
    if (user) {
      navigation.reset({
        index: 0,
        routes: [{ name: "Main" }],
      });
    }
  }, [user]);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(email, password); 
      if (success) {

      } else {
        Alert.alert("Error", "Invalid email or password");
      }
    } catch (error) {
      Alert.alert("Error", "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar backgroundColor={colors.statusBar} barStyle={isDarkMode ? "light-content" : "dark-content"} />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Image source={require('../../assets/images/b.png')} style={styles.logo} />
          <Text weight="bold" style={styles.title}>
            Welcome to Burgify
          </Text>
          <Text style={styles.subtitle}>Discover amazing burger recipes and cooking tips</Text>
        </View>

        {/* Login Form */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text weight="semiBold" style={styles.label}>
              Email
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.inputBackground,
                  color: colors.text,
                  borderColor: colors.border,
                  fontFamily: "Poppins-Regular",
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
            <Text weight="semiBold" style={styles.label}>
              Password
            </Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.passwordInput,
                  {
                    backgroundColor: colors.inputBackground,
                    color: colors.text,
                    borderColor: colors.border,
                    fontFamily: "Poppins-Regular",
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

          {/* Forgot Password Link */}
          <TouchableOpacity style={styles.forgotPasswordContainer} onPress={handleForgotPassword} activeOpacity={0.7}>
            <Text weight="medium" style={[styles.forgotPasswordText, { color: colors.primary }]}>
              Forgot password?
            </Text>
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
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={navigateToRegister}>
            <Text weight="semiBold" style={[styles.linkText, { color: colors.primary }]}>
              Sign up here
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Forgot Password Modal */}
      <Modal
        visible={forgotPasswordModalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeResetModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            {/* X Close Button */}
            <TouchableOpacity
              onPress={closeResetModal}
              style={styles.closeIconContainer}
              activeOpacity={0.7}
            >
              <Text style={[styles.closeIcon, { color: colors.text }]}>×</Text>
            </TouchableOpacity>

            {!resetSent ? (
              <>
                <Text weight="bold" style={styles.modalTitle}>
                  Reset Password
                </Text>
                <Text style={styles.modalSubtitle}>
                  Enter your email address and we'll send you instructions to reset your password.
                </Text>

                <View style={styles.modalInputContainer}>
                  <Text weight="semiBold" style={styles.label}>
                    Email
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: colors.inputBackground,
                        color: colors.text,
                        borderColor: colors.border,
                        fontFamily: "Poppins-Regular",
                        fontSize: 13,
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
                </View>

                {resetLoading && (
                  <ActivityIndicator
                    size="small"
                    color={colors.primary}
                    style={styles.loadingIndicator}
                  />
                )}
              </>
            ) : (
              <View style={styles.successContainer}>
                <Text weight="bold" style={styles.modalTitle}>
                  Email Sent!
                </Text>
                <Text style={[styles.modalSubtitle, { textAlign: "center" }]}>
                  We've sent password reset instructions to:
                </Text>
                <Text
                  weight="semiBold"
                  style={[styles.emailSent, { color: colors.primary }]}
                >
                  {resetEmail}
                </Text>
                <Text
                  style={[styles.modalSubtitle, { textAlign: "center", marginTop: 10 }]}
                >
                  Please check your inbox and follow the instructions to reset your password.
                </Text>

                {/* <Button
                  title="Back to Login"
                  onPress={closeResetModal}
                  fullWidth
                  style={styles.backButton}
                /> */}
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
    width: 50, 
    height: 50, 
    resizeMode: 'contain', 
    marginBottom: 10, 
  },
  title: {
    fontSize: 23,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
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
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    borderRadius: 999,
    padding: 16,
    fontSize: 14,
    borderWidth: 1,
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    borderRadius: 999,
    padding: 14,
    paddingRight: 50,
    fontSize: 14,
    borderWidth: 1,
  },
  eyeButton: {
    position: "absolute",
    right: 16,
    top: 11,
    padding: 4,
  },
  eyeIcon: {
    width: 20,
    height: 20,
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 14,
  },
  loginButton: {
    marginTop: 10,
    borderRadius: 999,
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
    fontSize: 14,
    marginRight: 5,
  },
  linkText: {
    fontSize: 14,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.83)",
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
    fontSize: 18,
    marginBottom: 12,
  },
  modalSubtitle: {
    fontSize: 12,
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
    marginVertical: 8,
  },
  backButton: {
    marginTop: 24,
  },
  closeIconContainer: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 1,
  },
  closeIcon: {
    fontSize: 28,
    fontWeight: "bold",
  },
})

export default LoginScreen
