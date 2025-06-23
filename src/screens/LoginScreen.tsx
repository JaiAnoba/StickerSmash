import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import type { RootStackParamList } from "../../App";
import Button from "../components/Button";
import Text from "../components/CustomText";
import ForgotPasswordModal from "../components/ForgotPassModal";
import SocialButtons from "../components/SocialButtons";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

type NavigationProp = StackNavigationProp<RootStackParamList>;

const validatePassword = (password: string): string | null => {
  if (!password) return "Password is required";
  if (password.length < 8) return "At least 8 characters required";
  if (!/[a-z]/.test(password)) return "Include a lowercase letter";
  if (!/[A-Z]/.test(password)) return "Include an uppercase letter";
  if (!/[0-9]/.test(password)) return "Include a number";
  if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) return "Include a special character";
  return null;
};

const LoginScreen: React.FC = () => {
  const { colors, isDarkMode } = useTheme();
  const { user, login } = useAuth();
  const navigation = useNavigation<NavigationProp>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Forgot password states
  const [forgotPasswordModalVisible, setForgotPasswordModalVisible] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [resetLoading, setResetLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  const handleLogin = async () => {
    let hasError = false;
    setEmailError("");
    setPasswordError("");

    if (!email.trim()) {
      setEmailError("Email is required");
      hasError = true;
    } else if (!email.includes("@")) {
      setEmailError("Invalid email format");
      hasError = true;
    }

    const pwdValidation = validatePassword(password);
    if (pwdValidation) {
      setPasswordError(pwdValidation);
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        navigation.reset({
          index: 0,
          routes: [{ name: "Main" }],
        });
      } else {
        setPasswordError("Invalid email or password");
      }
    } catch (error) {
      setPasswordError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = (error: string) => [
    styles.input,
    {
      backgroundColor: colors.inputBackground,
      color: colors.text,
      borderColor: error ? "red" : colors.border,
      fontFamily: "Poppins-Regular",
    },
  ];

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
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setResetSent(true)
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
      <StatusBar 
      backgroundColor={isDarkMode ? colors.statusBar : "#8B0000"} 
      barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Image source={require("../../assets/images/b.png")} style={styles.logo} />
          <Text weight="bold" style={styles.title}>Welcome to Burgify</Text>
          <Text style={styles.subtitle}>Discover amazing burger recipes and cooking tips</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text weight="semiBold" style={styles.label}>Email</Text>
            <TextInput
              style={inputStyle(emailError)}
              placeholder="Enter your email"
              placeholderTextColor={colors.subtext}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text weight="semiBold" style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={inputStyle(passwordError)}
                placeholder="Enter your password"
                placeholderTextColor={colors.subtext}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
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
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
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

        <SocialButtons />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text weight="semiBold" style={[styles.linkText, { color: colors.primary }]}>Sign up here</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        visible={forgotPasswordModalVisible}
        resetEmail={resetEmail}
        setResetEmail={setResetEmail}
        resetLoading={resetLoading}
        resetSent={resetSent}
        closeResetModal={closeResetModal}
        handleResetPassword={handleResetPassword}
        colors={colors}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 30, justifyContent: "center" },
  header: { alignItems: "center", marginBottom: 40 },
  logo: { width: 50, height: 50, resizeMode: "contain", marginBottom: 10 },
  title: { fontSize: 23, textAlign: "center", marginBottom: 10 },
  subtitle: { fontSize: 15, textAlign: "center", lineHeight: 24 },
  form: { marginBottom: 10 },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 14, marginBottom: 8 },
  input: { borderRadius: 999, padding: 16, fontSize: 14, borderWidth: 1 },
  passwordContainer: { position: "relative" },
  eyeButton: { position: "absolute", right: 16, top: 11, padding: 4 },
  eyeIcon: { width: 20, height: 20 },
  forgotPasswordContainer: { alignSelf: "flex-end", marginBottom: 20, marginTop: -10, },
  forgotPasswordText: { fontSize: 14, },
  loginButton: { marginTop: 10, borderRadius: 999 },
  loadingIndicator: { marginTop: 10 },
  footer: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 20, marginTop: 10  },
  footerText: { fontSize: 14, marginRight: 5 },
  linkText: { fontSize: 14 },
  errorText: { color: "red", fontSize: 12, marginTop: 4 },
});

export default LoginScreen;