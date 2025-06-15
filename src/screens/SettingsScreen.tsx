import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Switch,
  Alert,
  Modal,
  FlatList,
  Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Settings, Language } from '../types/Burger';
import { useTheme } from '../context/ThemeContext';
import Text from '../components/CustomText'
import { useNavigation } from "@react-navigation/native";

const SettingsScreen: React.FC = () => {
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const navigation = useNavigation();
  const [settings, setSettings] = useState<Settings>({
    notifications: true,
    darkMode: isDarkMode,
    language: 'English',
    autoSave: true,
    cookingTimer: true,
    shoppingList: false,
    nutritionInfo: true,
  });
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('English');

  const languages: Language[] = ['English', 'Spanish', 'French', 'German', 'Japanese'];

  useEffect(() => {
    loadSettings();
  }, [isDarkMode]);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('appSettings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        // Make sure darkMode is synced with the theme context
        setSettings({ ...parsedSettings, darkMode: isDarkMode });
        setSelectedLanguage(parsedSettings.language || 'English');
      } else {
        // If no settings found, use defaults but sync darkMode
        setSettings(prev => ({ ...prev, darkMode: isDarkMode }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings: Settings) => {
    try {
      await AsyncStorage.setItem('appSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const toggleSetting = (key: keyof Settings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    
    // Special handling for dark mode
    if (key === 'darkMode') {
      toggleTheme();
    }
    
    saveSettings(newSettings);
  };

  const handleLanguageSelect = (language: Language) => {
    const newSettings = { ...settings, language };
    saveSettings(newSettings);
    setSelectedLanguage(language);
    setIsLanguageModalVisible(false);
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all your saved data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear Data', 
          style: 'destructive',
          onPress: async () => {
            try {
              // Keep user logged in but clear other data
              const userToken = await AsyncStorage.getItem('userToken');
              const userData = await AsyncStorage.getItem('userData');
              
              await AsyncStorage.clear();
              
              // Restore user session
              if (userToken) await AsyncStorage.setItem('userToken', userToken);
              if (userData) await AsyncStorage.setItem('userData', userData);
              
              // Reset settings to default but keep dark mode
              const defaultSettings: Settings = {
                notifications: true,
                darkMode: isDarkMode,
                language: 'English',
                autoSave: true,
                cookingTimer: true,
                shoppingList: false,
                nutritionInfo: true,
              };
              
              await AsyncStorage.setItem('appSettings', JSON.stringify(defaultSettings));
              setSettings(defaultSettings);
              
              Alert.alert('Success', 'All app data has been cleared.');
            } catch (error) {
              console.error('Error clearing data:', error);
              Alert.alert('Error', 'Failed to clear data. Please try again.');
            }
          }
        }
      ]
    );
  };

  const SettingRow: React.FC<{
    title: string;
    subtitle?: string;
    iconComponent?: React.ReactNode;
    value?: boolean;
    onToggle?: () => void;
    onPress?: () => void;
    showArrow?: boolean;
  }> = ({ title, subtitle, iconComponent, value, onToggle, onPress, showArrow = false }) => (
    <TouchableOpacity 
      style={[styles.settingRow, { backgroundColor: colors.card, borderColor: colors.border }]} 
      onPress={onPress}
      disabled={!onPress && !onToggle}
    >
      <View style={styles.settingLeft}>
        {iconComponent}
        <View style={styles.settingText}>
          <Text weight='medium' style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
          {subtitle && <Text style={[styles.settingSubtitle, { color: colors.subtext }]}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingRight}>
        {onToggle && (
          <Switch
            value={value}
            onValueChange={onToggle}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={value ? 'white' : '#F3F4F6'}
          />
        )}
        {showArrow && (
          <Image
            source={{ uri: "https://img.icons8.com/material-rounded/48/chevron-right.png" }}
            style={styles.arrowIcon}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <Text weight='semiBold' style={[styles.sectionHeader, { color: colors.text }]}>{title}</Text>
  );

  const LanguageItem: React.FC<{ language: Language }> = ({ language }) => (
    <TouchableOpacity
      style={[
        styles.languageItem,
        { borderBottomColor: colors.border },
        selectedLanguage === language && [
          styles.selectedLanguage,
          { backgroundColor: isDarkMode ? '#3B0F0F' : '#FECACA' }
        ]
      ]}
      onPress={() => handleLanguageSelect(language)}
    >
      <Text style={[
        styles.languageText,
        { color: colors.text },
        selectedLanguage === language && { color: colors.primary }
      ]}>
        {language}
      </Text>
      {selectedLanguage === language && (
        <Text style={[styles.checkmark, { color: colors.primary }]}>✓</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar backgroundColor={colors.statusBar} barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>

        <TouchableOpacity style={styles.side} onPress={() => navigation.goBack()}>
          <Image source={{ uri: "https://img.icons8.com/sf-black/100/back.png" }} style={styles.backIcon} />
        </TouchableOpacity>

        <Text weight='semiBold' style={styles.headerTitle}>Settings</Text>

        <View style={styles.side} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Preferences */}
        <SectionHeader title="Preferences" />
        
        <SettingRow
            title="Push Notifications"
            subtitle="Get notified about new recipes and updates"
            iconComponent={
            <Image
                  source={{ uri: 'https://img.icons8.com/external-anggara-basic-outline-anggara-putra/48/external-notification-bell-user-interface-anggara-basic-outline-anggara-putra.png' }}
                  style={{ width: 22, height: 22, marginRight: 12 }}
                />
            }
            value={settings.notifications}
            onToggle={() => toggleSetting('notifications')}
        />
        
        <SettingRow
            title="Dark Mode"
            subtitle="Switch to dark theme"
            iconComponent={
            <Image
                  source={{ uri: 'https://img.icons8.com/material-outlined/48/do-not-disturb-2.png' }}
                  style={{ width: 22, height: 22, marginRight: 12 }}
                />
            }
            value={settings.darkMode}
            onToggle={() => toggleSetting('darkMode')}
        />
        
        <SettingRow
          title="Auto-save Favorites"
          subtitle="Automatically save liked recipes"
          iconComponent={
            <Image
                  source={{ uri: 'https://img.icons8.com/sf-regular/48/save.png' }}
                  style={{ width: 22, height: 22, marginRight: 12 }}
                />
          }
          value={settings.autoSave}
          onToggle={() => toggleSetting('autoSave')}
        />
        
        <SettingRow
          title="Language"
          subtitle={settings.language}
          iconComponent={
            <Image
                  source={{ uri: 'https://img.icons8.com/fluency-systems-regular/48/globe--v1.png' }}
                  style={{ width: 22, height: 22, marginRight: 12 }}
                />
          }
          showArrow
          onPress={() => setIsLanguageModalVisible(true)}
        />

        {/* Features */}
        <SectionHeader title="Features" />
        
        <SettingRow
          title="Cooking Timer"
          subtitle="Enable built-in cooking timer"
          iconComponent={
            <Image
                  source={{ uri: 'https://img.icons8.com/fluency-systems-filled/48/timer.png' }}
                  style={{ width: 22, height: 22, marginRight: 12 }}
                />
          }
          value={settings.cookingTimer}
          onToggle={() => toggleSetting('cookingTimer')}
        />
        
        <SettingRow
          title="Shopping List"
          subtitle="Create shopping lists from recipes"
          iconComponent={
            <Image
                  source={{ uri: 'https://img.icons8.com/windows/64/shopping-cart.png' }}
                  style={{ width: 22, height: 22, marginRight: 12 }}
                />
          }
          value={settings.shoppingList}
          onToggle={() => toggleSetting('shoppingList')}
        />
        
        <SettingRow
          title="Nutrition Information"
          subtitle="Show calorie and nutrition data"
          iconComponent={
            <Image
                  source={{ uri: 'https://img.icons8.com/windows/64/organic-food.png' }}
                  style={{ width: 22, height: 22, marginRight: 12 }}
                />
          }
          value={settings.nutritionInfo}
          onToggle={() => toggleSetting('nutritionInfo')}
        />

        {/* Account */}
        <SectionHeader title="Account" />
        
        <SettingRow
          title="Privacy Policy"
            iconComponent={
            <Image
                source={{ uri: 'https://img.icons8.com/material-outlined/48/lock-2.png' }}
                style={{ width: 22, height: 22, marginRight: 12 }}
              />
            }
            showArrow
            onPress={() => Alert.alert('Privacy Policy', 'View our privacy policy at burgerpedia.com/privacy')}
          />
        
        <SettingRow
            title="Terms of Service"
            iconComponent={
            <Image
                  source={{ uri: 'https://img.icons8.com/material-outlined/48/documents--v2.png' }}
                  style={{ width: 22, height: 22, marginRight: 12 }}
                />
            }
            showArrow
            onPress={() => Alert.alert('Terms of Service', 'View our terms at burgerpedia.com/terms')}
          />
        
        <SettingRow
          title="Data & Storage"
          subtitle="Manage your app data"
          iconComponent={
            <Image
                  source={{ uri: 'https://img.icons8.com/forma-light/48/data-backup.png' }}
                  style={{ width: 22, height: 22, marginRight: 12 }}
                />
          }
          showArrow
          onPress={() => Alert.alert('Data Management', 'Data management options coming soon!')}
        />

        {/* Support */}
        <SectionHeader title="Support" />
        
        <SettingRow
          title="Help Center"
          iconComponent={
            <Image
                  source={{ uri: 'https://img.icons8.com/fluency-systems-regular/48/help--v1.png' }}
                  style={{ width: 22, height: 22, marginRight: 12 }}
                />
          }
          showArrow
          onPress={() => Alert.alert('Help Center', 'Visit our help center at help.burgerpedia.com')}
        />
        
        <SettingRow
          title="Contact Us"
          subtitle="Get in touch with our team"
          iconComponent={
            <Image
                  source={{ uri: 'https://img.icons8.com/material-outlined/48/email.png' }}
                  style={{ width: 22, height: 22, marginRight: 12 }}
                />
          }
          showArrow
          onPress={() => Alert.alert('Contact Us', 'Email us at support@burgerpedia.com')}
        />
        
        <SettingRow
          title="Rate App"
          subtitle="Rate us on the app store"
          iconComponent={
            <Image
                  source={{ uri: 'https://img.icons8.com/fluency-systems-regular/48/star--v1.png' }}
                  style={{ width: 22, height: 22, marginRight: 12 }}
                />
          }
          showArrow
          onPress={() => Alert.alert('Rate App', 'Thank you for using Burgerpedia!')}
        />

        {/* About */}
        <SectionHeader title="About" />
        
        <SettingRow
          title="App Version"
          subtitle="1.0.0"
          iconComponent={
            <Image
                  source={{ uri: 'https://img.icons8.com/material-outlined/48/iphone--v2.png' }}
                  style={{ width: 22, height: 22, marginRight: 12 }}
                />
          }
        />
        
        <SettingRow
          title="Build Number"
          subtitle="2024.01.15"
          iconComponent={
            <Image
                  source={{ uri: 'https://img.icons8.com/fluency-systems-regular/48/open-end-wrench.png' }}
                  style={{ width: 22, height: 22, marginRight: 12 }}
                />
          }
        />

        {/* Danger Zone */}
        <SectionHeader title="Danger Zone" />
        
        <TouchableOpacity 
          style={[
            styles.dangerButton, 
            { 
              backgroundColor: isDarkMode ? '#2D1515' : '#FEE2E2',
              borderColor: isDarkMode ? '#5B1F1F' : '#FECACA'
            }
          ]}
          onPress={handleClearData}
        >
          <Text style={[styles.dangerText, { color: colors.primary }]}>Clear All Data</Text>
        </TouchableOpacity>
        
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.subtext }]}>
            Made with love for burger lovers
          </Text>
        </View>
      </ScrollView>

      {/* Language Selection Modal */}
      <Modal
        visible={isLanguageModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsLanguageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.modalHeader}>
              <Text weight='semiBold' style={[styles.modalTitle, { color: colors.text }]}>Select Language</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsLanguageModalVisible(false)}
              >
                <Text style={[styles.closeButtonText, { color: colors.text }]}>×</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={languages}
              keyExtractor={(item) => item}
              renderItem={({ item }) => <LanguageItem language={item} />}
              style={styles.languageList}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: "space-between", 
    marginBottom: 5,
    backgroundColor: "#8B0000",
    borderBottomStartRadius: 50,
    borderBottomEndRadius: 50,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: "white",
  },
  side: {
    width: 40, 
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    color: 'white',
    textAlign: "center", 
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    fontSize: 16,
    marginTop: 25,
    marginBottom: 15,
    marginLeft: 5,
  },
  settingRow: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
  },
  settingRight: {
    alignItems: 'center',
  },
  arrowIcon: {
    width: 16,
    height: 16,
    resizeMode: "contain",
  },
  dangerButton: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dangerIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  dangerText: {
    fontSize: 14,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Poppins-Italic',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    maxHeight: '80%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 16,
  },
  closeButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 30,
  },
  languageList: {
    maxHeight: 300,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  selectedLanguage: {
    borderRadius: 50,
    marginHorizontal: 10,
    paddingHorizontal: 10,
  },
  languageText: {
    fontSize: 14,
  },
  checkmark: {
    fontSize: 16,
  },
  modalFooter: {
    padding: 10,
    paddingTop: 10,
  },
});

export default SettingsScreen;