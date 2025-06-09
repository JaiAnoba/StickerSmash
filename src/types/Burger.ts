export interface Burger {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cookTime: string;
  rating: number;
}

export interface Category {
  id: string;
  name: string;
  isActive: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  favoriteCategory?: string;
  joinDate: string;
}

export interface AIMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface Settings {
  notifications: boolean;
  darkMode: boolean;
  language: string;
  autoSave: boolean;
}