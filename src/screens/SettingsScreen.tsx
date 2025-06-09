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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Settings } from '../types/Burger';

const SettingsScreen: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    notifications: true,
    darkMode: false,
    language: 'English',
    autoSave: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async (): Promise<void> => {
    try {
      const savedSettings = await AsyncStorage.getItem('appSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings: Settings): Promise<void> => {
    try {
      await AsyncStorage.setItem('appSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const toggleSetting = (key: keyof Settings): void => {
    const newSettings = { ...settings, [key]: !settings[key] };
    saveSettings(newSettings);
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
      style={styles.settingRow} 
      onPress={onPress}
      disabled={!onPress && !onToggle}
    >
      <View style={styles.settingLeft}>
        <Text style={styles.settingIcon}>{icon}</Text>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingRight}>
        {onToggle && (
          <Switch
            value={value}
            onValueChange={onToggle}
            trackColor={{ false: '#E5E7EB', true: '#B91C1C' }}
            thumbColor={value ? 'white' : '#F3F4F6'}
          />
        )}
        {showArrow && <Text style={styles.arrow}>→</Text>}
      </View>
    </TouchableOpacity>
  );

  const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#B91C1C" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
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
          onPress={() => Alert.alert('Language', 'Language selection coming soon!')}
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
          style={styles.dangerButton}
          onPress={() => Alert.alert(
            'Clear All Data',
            'This will delete all your saved data. This action cannot be undone.',
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Clear Data', 
                style: 'destructive',
                onPress: async () => {
                  await AsyncStorage.clear();
                  Alert.alert('Success', 'All data has been cleared.');
                }
              }
            ]
          )}
        >
          <Text style={styles.dangerIcon}>🗑️</Text>
          <Text style={styles.dangerText}>Clear All Data</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with ❤️ for burger lovers</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#B91C1C',
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
    color: '#333',
    marginTop: 25,
    marginBottom: 15,
    marginLeft: 5,
  },
  settingRow: {
    backgroundColor: 'white',
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
    color: '#333',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  settingRight: {
    alignItems: 'center',
  },
  arrow: {
    fontSize: 16,
    color: '#B91C1C',
  },
  dangerButton: {
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  dangerIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  dangerText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#B91C1C',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default SettingsScreen;