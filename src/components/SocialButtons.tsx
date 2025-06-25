import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { useGoogleAuth } from "../utils/useGoogleAuth";
import Text from "./CustomText";

const SocialLoginButtons = () => {
  const { promptAsync, response } = useGoogleAuth();
  const navigation = useNavigation();

  React.useEffect(() => {
    if (response?.type === "success" && response.url) {
      // Optionally: parse token and store user info here
      navigation.reset({
        index: 0,
        routes: [{ name: "Main" as never }],
      });
    }
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

        <TouchableOpacity onPress={() => promptAsync()}>
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