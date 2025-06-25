import axios from "axios";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { API_URL } from "../utils/env";
import { validatePassword } from "../utils/validatePassword";
import Button from "./Button";
import Text from "./CustomText";

interface ForgotPasswordModalProps {
  visible: boolean;
  resetEmail: string;
  setResetEmail: (email: string) => void;
  resetLoading: boolean;
  resetSent: boolean;
  closeResetModal: () => void;
  handleResetPassword: () => void;
  colors: any;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  visible,
  resetEmail,
  setResetEmail,
  resetLoading,
  resetSent,
  closeResetModal,
  handleResetPassword,
  colors,
}) => {
  const [step, setStep] = React.useState<"email" | "otp" | "password" | "success">("email");
  const [otp, setOtp] = React.useState(["", "", "", "", "", ""]);
  const [error, setError] = React.useState<string | null>(null);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const inputsRef = React.useRef<Array<TextInput | null>>([]);
  const [resendCooldown, setResendCooldown] = React.useState(0);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [emailError, setEmailError] = useState("");

  const [verifying, setVerifying] = useState(false);
  const [verifiedToken, setVerifiedToken] = useState<string | null>(null);

  React.useEffect(() => {
    if (resetSent) setStep("otp");
  }, [resetSent]);

  React.useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  React.useEffect(() => {
    if (step === "success") {
      const timer = setTimeout(() => {
        closeResetModal();    
        setStep("email");      
      }, 2000); 

      return () => clearTimeout(timer); 
    }
  }, [step]);

  const handleOtpSubmit = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6 || !/^\d{6}$/.test(otpValue)) {
      setError("Enter a valid 6-digit OTP.");
      return;
    }
    setError(null);
    setVerifying(true);
    try {
      // Debug: log OTP value
      console.log("Submitting OTP:", otpValue);
      // Call backend to verify token
      const res = await axios.get(
        `${API_URL}/auth/verify-reset-token/${otpValue}`
      );
      setVerifiedToken(otpValue);
      setStep("password");
    } catch (err: any) {
      // Debug: log error and response
      console.log("OTP verify error:", err?.response?.data, err);
      setError(
        err?.response?.data?.message || "Invalid or expired reset token."
      );
    } finally {
      setVerifying(false);
    }
  };

  const handleConfirmReset = async () => {
    setError(null);
    if (!newPassword || !confirmPassword) {
      setError("Both password fields are required.");
      return;
    }
    const validation = validatePassword(newPassword);
    if (validation) {
      setError("New password: " + validation);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setConfirmLoading(true);
    try {
      // Call backend to reset password
      await axios.post(
        `${API_URL}/auth/reset-password/${verifiedToken}`,
        { password: newPassword }
      );
      setStep("success");
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to reset password."
      );
    } finally {
      setConfirmLoading(false);
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

  const handleValidateAndSendReset = () => {
    setEmailError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!resetEmail.trim()) {
      setEmailError("Email is required");
      return;
    } else if (!emailRegex.test(resetEmail)) {
      setEmailError("Invalid email format");
      return;
    }

    handleResetPassword();
  };

  const resendOtp = () => {
    setResendCooldown(30);
    handleResetPassword(); 
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={closeResetModal}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {step !== "success" && (
            <TouchableOpacity onPress={closeResetModal} style={styles.closeButton}>
              <Image
                source={{ uri: "https://img.icons8.com/ios-glyphs/90/multiply.png" }}
                style={[styles.closeIcon, { tintColor: colors.text }]}
              />
            </TouchableOpacity>
          )}

          {step === "email" && (
            <>
              <Text weight="semiBold" style={[styles.modalTitle, { color: colors.text }]}>
                Reset Password
              </Text>
              <Text style={[styles.modalSubtitle, { color: colors.subtext }]}>
                Enter your email and we'll send a reset link.
              </Text>

              <View style={styles.modalInputContainer}>
                <Text style={[styles.label, { color: colors.text }]}>Email</Text>
                <TextInput
                  style={inputStyle(emailError)}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.subtext}
                  value={resetEmail}
                  onChangeText={(text) => {
                    setResetEmail(text);
                    setEmailError(""); 
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {emailError ? (
                  <Text style={[styles.errorText, { color: "red", textAlign: "left", marginTop: 6 }]}>
                    {emailError}
                  </Text>
                ) : null}
              </View>

              <Button
                title={resetLoading ? "Sending..." : "Send Reset Link"}
                onPress={handleValidateAndSendReset}
                disabled={resetLoading}
                fullWidth
                style={styles.resetButton}
                textStyle={{ fontSize: 14 }}
              />
              {resetLoading && (
                <ActivityIndicator size="small" color={colors.primary} style={styles.loadingIndicator} />
              )}
            </>
          )}

          {step === "otp" && (
            <>
              <Text weight="semiBold" style={[styles.modalTitle, { color: colors.text }]}>Enter OTP</Text>
              <Text style={[styles.modalSubtitle, { color: colors.subtext }]}>
                We’ve sent a 6-digit OTP to {resetEmail}.
              </Text>

              <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => { inputsRef.current[index] = ref; }}
                    style={[
                      styles.otpInput,
                      {
                        backgroundColor: colors.inputBackground,
                        color: colors.text,
                        borderColor: error ? "red" : colors.border,
                      },
                    ]}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={digit}
                    onChangeText={(text) => {
                      const newOtp = [...otp];
                      newOtp[index] = text;
                      setOtp(newOtp);
                      if (text && index < 5) inputsRef.current[index + 1]?.focus();
                    }}
                    onKeyPress={({ nativeEvent }) => {
                      if (nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
                        inputsRef.current[index - 1]?.focus();
                      }
                    }}
                    textAlign="center"
                  />
                ))}
              </View>

              {error && <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>}

              <Button title={verifying ? "Verifying..." : "Confirm OTP"} onPress={handleOtpSubmit} fullWidth style={styles.resetButton} disabled={verifying} />
              <TouchableOpacity onPress={resendOtp} disabled={resendCooldown > 0}>
                <Text
                  style={{
                    color: resendCooldown > 0 ? colors.subtext : colors.primary,
                    fontSize: 12,
                    textAlign: "center",
                    marginTop: 12,
                  }}
                >
                  {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : "Resend OTP"}
                </Text>
              </TouchableOpacity>
            </>
          )}

          {step === "password" && (
            <>
              <Text weight="semiBold" style={[styles.modalTitle, { color: colors.text }]}>
                Set New Password
              </Text>

              {/* New Password */}
              <View style={styles.modalInputContainer}>
                <Text style={[styles.label, { color: colors.text }]}>New Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={inputStyle(newPasswordError)}
                    placeholder="Enter new password"
                    placeholderTextColor={colors.subtext}
                    value={newPassword}
                    onChangeText={(text) => {
                      setNewPassword(text);
                      setNewPasswordError(validatePassword(text) ?? "");
                    }}
                    secureTextEntry={!showNewPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity style={styles.eyeButton} onPress={() => setShowNewPassword(!showNewPassword)}>
                    <Image
                      source={{
                        uri: showNewPassword
                          ? "https://img.icons8.com/fluency-systems-regular/48/visible--v1.png"
                          : "https://img.icons8.com/fluency-systems-regular/48/closed-eye.png",
                      }}
                      style={[styles.eyeIcon, { tintColor: colors.subtext }]}
                    />
                  </TouchableOpacity>
                </View>
                {newPasswordError ? (
                  <Text style={[styles.errorText, { color: "red", textAlign: "left", marginTop: 6 }]}>
                    {newPasswordError}
                  </Text>
                ) : null}
              </View>

              {/* Confirm Password */}
              <View style={styles.modalInputContainer}>
                <Text style={[styles.label, { color: colors.text }]}>Confirm Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={inputStyle(confirmPasswordError)}
                    placeholder="Confirm your password"
                    placeholderTextColor={colors.subtext}
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      setConfirmPasswordError(
                        text !== newPassword ? "Passwords do not match" : ""
                      );
                    }}
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
                {confirmPasswordError ? (
                  <Text style={[styles.errorText, { color: "red", textAlign: "left", marginTop: 6 }]}>
                    {confirmPasswordError}
                  </Text>
                ) : null}
              </View>

              <Button
                title={confirmLoading ? "Resetting..." : "Confirm Reset"}
                onPress={handleConfirmReset}
                disabled={
                  !!newPasswordError ||
                  !!confirmPasswordError ||
                  !newPassword ||
                  !confirmPassword ||
                  confirmLoading
                }
                fullWidth
                style={styles.resetButton}
              />
              {confirmLoading && (
                <ActivityIndicator size="small" color={colors.primary} style={styles.loadingIndicator} />
              )}
            </>
          )}
          {step === "success" && (
            <View style={{ alignItems: "center", gap: 12 }}>
              <Text weight="semiBold" style={[styles.modalTitle, { color: colors.text }]}>
                Password Reset Successful!
              </Text>
              <Text style={[styles.modalSubtitle, { color: colors.subtext, textAlign: "center" }]}>
                Your password has been changed. You can now log in with your new credentials.
              </Text>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 4,
    zIndex: 2,
  },
  closeIcon: {
    width: 18,
    height: 18,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 13,
    marginBottom: 20,
  },
  modalInputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    borderRadius: 50,
    padding: 12,
    borderWidth: 1,
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
  resetButton: {
    marginBottom: 0,
  },
  loadingIndicator: {
    marginTop: 10,
  },
  errorText: {
    fontSize: 12,
    textAlign: "center",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 8,
  },
  otpInput: {
    width: 40,
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 18,
    fontFamily: "Poppins-Regular",
  },
  passwordContainer: {
    position: "relative",
  },
  eyeButton: {
    position: "absolute",
    right: 16,
    top: 8,
    padding: 4,
  },
  eyeIcon: {
    width: 20,
    height: 20,
  },
});

export default ForgotPasswordModal;
