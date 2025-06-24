import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { RootStackParamList } from '../../App';
import Button from '../components/Button';
import Text from "../components/CustomText";
import ScreenWrapper from "../components/ScreenWrapper";
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

type EditProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditProfile'>;

interface Props {
  navigation: EditProfileScreenNavigationProp;
}

const EditProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { user, updateUser } = useAuth();
  const { colors, isDarkMode } = useTheme()

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [initialProfileImage, setInitialProfileImage] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPassword(user.password ?? '');
    }
    loadProfileImage();
  }, [user]);

  useEffect(() => {
    checkForChanges();
  }, [name, email, profileImage, newPassword, confirmPassword]);

  const loadProfileImage = async () => {
    try {
      const savedImage = await AsyncStorage.getItem('profileImage');
      setProfileImage(savedImage);
      setInitialProfileImage(savedImage);
    } catch (err) {
      console.error('Failed to load profile image:', err);
    }
  };

  const saveProfileImage = async (uri: string) => {
    try {
      await AsyncStorage.setItem('profileImage', uri);
      setProfileImage(uri);
    } catch (err) {
      console.error('Failed to save profile image:', err);
    }
  };

  const removeProfileImage = async () => {
    try {
      await AsyncStorage.removeItem('profileImage');
      setProfileImage(null);
      checkForChanges();
    } catch (err) {
      console.error('Failed to remove profile image:', err);
    }
  };

  const checkForChanges = () => {
    const nameChanged = name !== user?.name;
    const emailChanged = email !== user?.email;
    const imageChanged = profileImage !== initialProfileImage;
    const passwordChanged = newPassword.length > 0;
    setHasChanges(nameChanged || emailChanged || imageChanged || passwordChanged);
  };

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Please allow gallery access.');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const uri = result.assets[0].uri;
        await saveProfileImage(uri);
        checkForChanges();
      }
    } catch (err) {
      console.error('Error picking image:', err);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) return Alert.alert('Error', 'Name cannot be empty');
    if (!email.trim()) return Alert.alert('Error', 'Email cannot be empty');
    if (!/\S+@\S+\.\S+/.test(email)) return Alert.alert('Error', 'Enter a valid email');

    if (showPasswordFields) {
      if (!newPassword || !confirmPassword) {
        return Alert.alert('Error', 'Please fill out both new password fields.');
      }
      if (newPassword !== confirmPassword) {
        return Alert.alert('Error', 'New passwords do not match.');
      }
    }

    setIsLoading(true);
    try {
      await updateUser({
        name: name.trim(),
        email: email.trim(),
        ...(showPasswordFields ? { password: newPassword } : {})
      });
      setInitialProfileImage(profileImage);
      Alert.alert('Success', 'Profile updated successfully!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (err) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackPress = () => {
    if (hasChanges) {
      Alert.alert('Discard Changes', 'You have unsaved changes. Do you want to go back?', [
        { text: 'Stay', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
      ]);
    } else {
      navigation.goBack();
    }
  };

  const ProfileAvatar = () => (
    <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
      {profileImage ? (
        <Image source={{ uri: profileImage }} style={styles.avatarImage} />
      ) : (
        <Text style={styles.avatarText}>{name ? name.charAt(0).toUpperCase() : ''}</Text>
      )}
      <TouchableOpacity style={[styles.editAvatarButton, { backgroundColor: colors.card, zIndex: 999, }]} onPress={handlePickImage}>
        <Image
          source={{ uri: 'https://img.icons8.com/puffy/32/camera.png' }}
          style={{ width: 18, height: 18 }}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenWrapper scroll>
      <StatusBar 
      backgroundColor={isDarkMode ? colors.statusBar : "#8B0000"} 
      barStyle={isDarkMode ? "light-content" : "dark-content"} />

      {/* Header */}
      <View style={[styles.headerContainer, { backgroundColor: colors.background }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Image
            source={{ uri: 'https://img.icons8.com/material-rounded/96/chevron-left.png' }}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text weight='semiBold' style={[styles.headerTitle, { color: colors.text }]}>Edit Profile</Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoidingView}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.avatarSection}>
            <ProfileAvatar />
            {profileImage && (
              <TouchableOpacity onPress={removeProfileImage} style={{ marginTop: 8 }}>
                <Text weight='semiBold' style={{ color: '#8B0000' }}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text weight='semiBold' style={[styles.label, { color: colors.text }]}>Full Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
                placeholder="Enter your full name"
                placeholderTextColor={colors.subtext}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text weight='semiBold'  style={[styles.label, { color: colors.text }]}>Email Address</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
                placeholder="Enter your email"
                placeholderTextColor={colors.subtext}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Current Pass */}
            <View style={styles.inputContainer}>
              <Text weight='semiBold' style={[styles.label, { color: colors.text }]}>Password</Text>
              <View style={styles.passwordField}>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
                  placeholder="Current password"
                  placeholderTextColor={colors.subtext}
                  secureTextEntry={!showPassword}
                  value={password}
                  editable={false}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Image
                    source={{
                      uri: showPassword
                        ? 'https://img.icons8.com/fluency-systems-regular/48/visible--v1.png'
                        : 'https://img.icons8.com/fluency-systems-regular/48/closed-eye.png',
                    }}
                    style={styles.eyeImage}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity onPress={() => setShowPasswordFields(!showPasswordFields)} style={styles.changePasswordLink}>
              <Text weight='semiBold' style={{ color: colors.primary }}>
                {showPasswordFields ? 'Cancel' : 'Change Password'}
              </Text>
            </TouchableOpacity>

            {showPasswordFields && (
              <>
                {/* New Pass */}
                <View style={styles.inputContainer}>
                  <Text weight='semiBold' style={[styles.label, { color: colors.text }]}>New Password</Text>
                  <View style={styles.passwordField}>
                    <TextInput
                      style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
                      placeholder="Enter new password"
                      placeholderTextColor={colors.subtext}
                      secureTextEntry={!showNewPassword}
                      value={newPassword}
                      onChangeText={setNewPassword}
                    />
                    <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)} style={styles.eyeIcon}>
                      <Image
                        source={{
                          uri: showNewPassword
                            ? 'https://img.icons8.com/fluency-systems-regular/48/visible--v1.png'
                            : 'https://img.icons8.com/fluency-systems-regular/48/closed-eye.png',
                        }}
                        style={styles.eyeImage}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Confirm Pass */}
                <View style={styles.inputContainer}>
                  <Text weight='semiBold' style={[styles.label, { color: colors.text }]}>Confirm Password</Text>
                  <View style={styles.passwordField}>
                    <TextInput
                      style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
                      placeholder="Confirm new password"
                      placeholderTextColor={colors.subtext}
                      secureTextEntry={!showConfirmPassword}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                    />
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                      <Image
                        source={{
                          uri: showConfirmPassword
                            ? 'https://img.icons8.com/fluency-systems-regular/48/visible--v1.png'
                            : 'https://img.icons8.com/fluency-systems-regular/48/closed-eye.png',
                        }}
                        style={styles.eyeImage}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

              </>
            )}

            <View style={styles.buttonContainer}>
              <Button
                title="Save Changes"
                onPress={handleSave}
                loading={isLoading}
                disabled={!hasChanges || isLoading}
                fullWidth
                size="small"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 20, },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingTop: 10,
  },
  backButton: {
    position: 'absolute',
    left: 15,
    padding: 5,
    zIndex: 1,
  },
  backIcon: {
    width: 22,
    height: 22,
    tintColor: 'black',
  },
  headerTitle: {
    fontSize: 20,
  },
  keyboardAvoidingView: { flex: 1 },
  content: { flex: 1 },
  avatarSection: { alignItems: 'center', paddingVertical: 30 },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarImage: { width: 100, height: 100, borderRadius: 50 },
  avatarText: { fontSize: 36, color: 'white' },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
  },
  avatarHint: { fontSize: 14, textAlign: 'center', marginTop: 8 },
  form: { paddingHorizontal: 20, paddingBottom: 30 },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 14, marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 50, paddingHorizontal: 16, paddingVertical: 14, fontSize: 12, fontFamily: "Poppins-Regular",},
  changePasswordLink: { alignItems: 'flex-end', marginBottom: 10 },
  buttonContainer: { marginTop: 10, borderRadius: 50, },
  passwordField: { position: 'relative', justifyContent: 'center', },
  eyeIcon: { position: 'absolute', right: 12, top: 10, padding: 5, zIndex: 10, },
  eyeImage: { width: 20, height: 20, tintColor: 'black', },

});

export default EditProfileScreen;
