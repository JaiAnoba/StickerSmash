import { Image, Platform, StyleSheet, TouchableOpacity, View, Alert } from "react-native";
import Text from "./CustomText";
import { useGoogleAuth } from '../utils/useGoogleAuth';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';

const SocialLoginButtons = () => {
  const { request, response, promptAsync } = useGoogleAuth();
  const { loginWithGoogleToken } = useAuth();

  React.useEffect(() => {
    const handleGoogleResponse = async () => {
      if (response?.type === 'success' && response.url) {
        const match = response.url.match(/[&#?]token=([^&#]+)/);
        const token = match ? decodeURIComponent(match[1]) : null;
        if (token) {
          await AsyncStorage.setItem('userToken', token);
          await loginWithGoogleToken(token);
          Alert.alert('Google login successful!');
        } else {
          Alert.alert('Google login failed: No token received.');
        }
      } else if (response?.type === 'error') {
        Alert.alert('Google login error.');
      }
    };
    handleGoogleResponse();
  }, [response]);

  return (
    <View style={styles.container}>
      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <View>
          <Text style={styles.dividerText}>or</Text>
        </View>
        <View style={styles.line} />
      </View>

      <View style={styles.iconsContainer}>
        <TouchableOpacity>
          <Image
            source={{ uri: "https://img.icons8.com/fluency/96/facebook-new.png" }}
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => promptAsync()} disabled={!request}>
          <Image
            source={{ uri: "https://img.icons8.com/fluency/96/google-logo.png" }}
            style={styles.icon}
          />
        </TouchableOpacity>

        {Platform.OS === "ios" && (
          <TouchableOpacity>
            <Image
              source={{ uri: "https://img.icons8.com/material-rounded/96/mac-os.png" }}
              style={styles.icon}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    marginVertical: 20 
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 12,
    color: "#888",
  },
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  icon: {
    width: 25,
    height: 25,
  },
});

export default SocialLoginButtons;