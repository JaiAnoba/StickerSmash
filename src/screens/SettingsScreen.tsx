import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Switch,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Settings, Language } from '../types/Burger';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

const SettingsScreen: React.FC = () => {
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const { logout } = useAuth();
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

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
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
    icon: string;
    value?: boolean;
    onToggle?: () => void;
    onPress?: () => void;
    showArrow?: boolean;
  }> = ({ title, subtitle, icon, value, onToggle, onPress, showArrow = false }) => (
    <TouchableOpacity 
      style={[styles.settingRow, { backgroundColor: colors.card, borderColor: colors.border }]} 
      onPress={onPress}
      disabled={!onPress && !onToggle}
    >
      <View style={styles.settingLeft}>
        <Text style={styles.settingIcon}>{icon}</Text>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
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
        {showArrow && <Text style={[styles.arrow, { color: colors.primary }]}>→</Text>}
      </View>
    </TouchableOpacity>
  );

  const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <Text style={[styles.sectionHeader, { color: colors.text }]}>{title}</Text>
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
        selectedLanguage === language && { fontWeight: 'bold', color: colors.primary }
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
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Preferences */}
        <SectionHeader title="Preferences" />
        
        <SettingRow
          title="Push Notifications"
          subtitle="Get notified about new recipes and updates"
          icon="🔔"
          value={settings.notifications}
          onToggle={() => toggleSetting('notifications')}
        />
        
        <SettingRow
          title="Dark Mode"
          subtitle="Switch to dark theme"
          icon="🌙"
          value={settings.darkMode}
          onToggle={() => toggleSetting('darkMode')}
        />
        
        <SettingRow
          title="Auto-save Favorites"
          subtitle="Automatically save liked recipes"
          icon="💾"
          value={settings.autoSave}
          onToggle={() => toggleSetting('autoSave')}
        />
        
        <SettingRow
          title="Language"
          subtitle={settings.language}
          icon="🌐"
          showArrow
          onPress={() => setIsLanguageModalVisible(true)}
        />

        {/* Features */}
        <SectionHeader title="Features" />
        
        <SettingRow
          title="Cooking Timer"
          subtitle="Enable built-in cooking timer"
          icon="⏱️"
          value={settings.cookingTimer}
          onToggle={() => toggleSetting('cookingTimer')}
        />
        
        <SettingRow
          title="Shopping List"
          subtitle="Create shopping lists from recipes"
          icon="🛒"
          value={settings.shoppingList}
          onToggle={() => toggleSetting('shoppingList')}
        />
        
        <SettingRow
          title="Nutrition Information"
          subtitle="Show calorie and nutrition data"
          icon="🥗"
          value={settings.nutritionInfo}
          onToggle={() => toggleSetting('nutritionInfo')}
        />

        {/* Account */}
        <SectionHeader title="Account" />
        
        <SettingRow
          title="Privacy Policy"
          icon="🔒"
          showArrow
          onPress={() => Alert.alert('Privacy Policy', 'View our privacy policy at burgerpedia.com/privacy')}
        />
        
        <SettingRow
          title="Terms of Service"
          icon="📄"
          showArrow
          onPress={() => Alert.alert('Terms of Service', 'View our terms at burgerpedia.com/terms')}
        />
        
        <SettingRow
          title="Data & Storage"
          subtitle="Manage your app data"
          icon="📊"
          showArrow
          onPress={() => Alert.alert('Data Management', 'Data management options coming soon!')}
        />

        {/* Support */}
        <SectionHeader title="Support" />
        
        <SettingRow
          title="Help Center"
          icon="❓"
          showArrow
          onPress={() => Alert.alert('Help Center', 'Visit our help center at help.burgerpedia.com')}
        />
        
        <SettingRow
          title="Contact Us"
          subtitle="Get in touch with our team"
          icon="📧"
          showArrow
          onPress={() => Alert.alert('Contact Us', 'Email us at support@burgerpedia.com')}
        />
        
        <SettingRow
          title="Rate App"
          subtitle="Rate us on the app store"
          icon="⭐"
          showArrow
          onPress={() => Alert.alert('Rate App', 'Thank you for using Burgerpedia!')}
        />

        {/* About */}
        <SectionHeader title="About" />
        
        <SettingRow
          title="App Version"
          subtitle="1.0.0"
          icon="📱"
        />
        
        <SettingRow
          title="Build Number"
          subtitle="2024.01.15"
          icon="🔧"
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
          <Text style={styles.dangerIcon}>🗑️</Text>
          <Text style={[styles.dangerText, { color: colors.primary }]}>Clear All Data</Text>
        </TouchableOpacity>
        
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="danger"
          fullWidth
          style={styles.logoutButton}
          icon="🚪"
        />

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.subtext }]}>
            Made with ❤️ for burger lovers
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
              <Text style={[styles.modalTitle, { color: colors.text }]}>Select Language</Text>
              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: colors.inputBackground }]}
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
            
            <View style={styles.modalFooter}>
              <Button
                title="Cancel"
                onPress={() => setIsLanguageModalVisible(false)}
                variant="secondary"
                fullWidth
              />
            </View>
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
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 15,
    marginLeft: 5,
  },
  settingRow: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    borderWidth: 1,
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
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
  },
  settingRight: {
    alignItems: 'center',
  },
  arrow: {
    fontSize: 16,
  },
  dangerButton: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  dangerIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  dangerText: {
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    marginTop: 10,
    marginBottom: 20,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  footerText: {
    fontSize: 14,
    fontStyle: 'italic',
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
    borderWidth: 1,
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
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
    borderBottomWidth: 1,
  },
  selectedLanguage: {
    borderRadius: 8,
    marginHorizontal: 10,
    paddingHorizontal: 10,
  },
  languageText: {
    fontSize: 16,
    fontWeight: '500',
  },
  checkmark: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalFooter: {
    padding: 20,
    paddingTop: 10,
  },
});

export default SettingsScreen;