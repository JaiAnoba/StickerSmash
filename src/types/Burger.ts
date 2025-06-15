export interface Burger {
  id: string
  name: string
  category: string
  image: string
  description: string
  ingredients: string[]
  instructions: string[]
  cookTime: string
  prepTime: string
  totalTime: string
  servings: number
  calories: number
  rating: number
  isRecommended: boolean
  difficulty: "Easy" | "Medium" | "Hard"
  nutrition?: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
}

export interface UserStats {
  recipesCooked: number
  totalCookTime: string
}

export interface Settings {
  notifications: boolean
  darkMode: boolean
  language: Language
  autoSave: boolean
  cookingTimer: boolean
  shoppingList: boolean
  nutritionInfo: boolean
}

export interface AIMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export type Language = "English" | "Spanish" | "French" | "German" | "Japanese"
