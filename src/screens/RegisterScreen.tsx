import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import type { RootStackParamList } from "../../App";
import Button from "../components/Button";
import Text from "../components/CustomText";
import SocialButtons from "../components/SocialButtons";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { validatePassword } from "../utils/validatePassword";

type NavigationProp = StackNavigationProp<RootStackParamList>;

const RegisterScreen: React.FC = () => {
  const { colors, isDarkMode } = useTheme();
  const { register } = useAuth();
  const navigation = useNavigation<NavigationProp>();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const validateForm = () => {
    let isValid = true;
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    if (!name.trim()) {
      setNameError("Full name is required");
      isValid = false;
    } else if (name.trim().length < 2) {
      setNameError("Name must be at least 2 characters");
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Invalid email format");
      isValid = false;
    }

    const pwdValidation = validatePassword(password);
    if (pwdValidation) {
      setPasswordError(pwdValidation);
      isValid = false;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    }

    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const success = await register(name, email, password);
      if (success) {
        navigation.reset({ index: 0, routes: [{ name: "Login" }] });
      } else {
        setEmailError("Email already in use or registration failed");
      }
    } catch (error) {
      setEmailError("Something went wrong. Try again.");
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar 
      backgroundColor={isDarkMode ? colors.statusBar : "#8B0000"} 
      barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Image source={require("../../assets/images/b.png")} style={styles.logo} />
            <Text weight="bold" style={styles.title}>Join Burgify</Text>
            <Text style={styles.subtitle}>Create your account and start your burger journey</Text>
          </View>

          <View style={styles.form}>
            {/* Full Name */}
            <View style={styles.inputContainer}>
              <Text weight="semiBold" style={styles.label}>Full Name</Text>
              <TextInput
                style={inputStyle(nameError)}
                placeholder="Enter your full name"
                placeholderTextColor={colors.subtext}
                value={name}
                onChangeText={setName}
              />
              {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
            </View>

            {/* Email */}
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

            {/* Password */}
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

            {/* Confirm Password */}
            <View style={styles.inputContainer}>
              <Text weight="semiBold" style={styles.label}>Confirm Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={inputStyle(confirmPasswordError)}
                  placeholder="Confirm your password"
                  placeholderTextColor={colors.subtext}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity style={styles.eyeButton} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
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
              {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
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

          <SocialButtons />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text weight="semiBold" style={[styles.linkText, { color: colors.primary }]}>Sign in here</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 30, paddingVertical: 40 },
  header: { alignItems: "center", marginBottom: 40 },
  logo: { width: 50, height: 50, resizeMode: "contain", marginBottom: 10 },
  title: { fontSize: 22, textAlign: "center", marginBottom: 10 },
  subtitle: { fontSize: 14, textAlign: "center", lineHeight: 24 },
  form: { marginBottom: 10 },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 14, marginBottom: 8 },
  input: { borderRadius: 999, padding: 16, fontSize: 13, borderWidth: 1 },
  passwordContainer: { position: "relative" },
  eyeButton: { position: "absolute", right: 16, top: 12, padding: 4 },
  eyeIcon: { width: 20, height: 20 },
  registerButton: { borderRadius: 999, marginTop: 10 },
  loadingIndicator: { marginTop: 10 },
  footer: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 10 },
  footerText: { fontSize: 14, marginRight: 5 },
  linkText: { fontSize: 14 },
  errorText: { color: "red", fontSize: 12, marginTop: 4 },
});

export default RegisterScreen;
