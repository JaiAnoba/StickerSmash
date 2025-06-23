import React from "react";
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
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={closeResetModal}>
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
          <TouchableOpacity onPress={closeResetModal} style={styles.closeButton}>
            <Image
              source={{
                uri: "https://img.icons8.com/ios-glyphs/90/multiply.png",
              }}
              style={[styles.closeIcon, { tintColor: colors.text }]}
            />
          </TouchableOpacity>

          {!resetSent ? (
            <>
              <Text weight="semiBold" style={[styles.modalTitle, { color: colors.text }]}>
                Reset Password
              </Text>
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

              <Button
                title={resetLoading ? "Sending..." : "Send Reset Link"}
                onPress={handleResetPassword}
                disabled={resetLoading}
                fullWidth
                style={styles.resetButton}
                textStyle={{ fontSize: 14 }}
              />

              {resetLoading && (
                <ActivityIndicator size="small" color={colors.primary} style={styles.loadingIndicator} />
              )}
            </>
          ) : (
            <View style={styles.successContainer}>
              <Text weight="semiBold" style={[styles.modalTitle, { color: colors.text }]}>Email Sent!</Text>
              <Text
                style={[styles.modalSubtitle, { color: colors.subtext, textAlign: "center" }]}
              >
                We've sent password reset instructions to:
              </Text>
              <Text weight="semiBold" style={[styles.emailSent, { color: colors.primary }]}>
                {resetEmail}
              </Text>
              <Text
                style={[
                  styles.modalSubtitle,
                  { color: colors.subtext, textAlign: "center", marginTop: 10 },
                ]}
              >
                Please check your inbox and follow the instructions to reset your password.
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
    fontFamily: "Poppins-Regular"
  },
  modalButtons: {
    gap: 10,
  },
  resetButton: {
    marginBottom: 0,
  },
  cancelButton: {
    marginBottom: 0,
  },
  backButton: {
    marginTop: 24,
  },
  successContainer: {
    alignItems: "center",
    gap: 8,
  },
  emailSent: {
    fontSize: 16,
  },
  loadingIndicator: {
    marginTop: 10,
  },
});

export default ForgotPasswordModal;
