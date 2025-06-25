import Constants from 'expo-constants';
import { Platform } from 'react-native';

let API_URL = '';

if (Platform.OS === 'web') {
  API_URL = Constants.manifest?.extra?.API_URL || process.env.API_URL || 'http://localhost:8000';
} else if (Platform.OS === 'android') {
  API_URL = Constants.manifest?.extra?.API_URL || process.env.API_URL || 'http://192.168.100.38:8000';
} else {
  API_URL = Constants.manifest?.extra?.API_URL || process.env.API_URL || 'http://192.168.100.38:8000';
}

export { API_URL };

