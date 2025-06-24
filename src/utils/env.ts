import Constants from 'expo-constants';

export const API_URL = Constants.manifest?.extra?.API_URL || process.env.API_URL || "http://localhost:8000/auth";
