export interface FilterOptions {
  category: string
  ingredients: string[]
  difficulty: string[]
  cookTime: string
  favoritesOnly: boolean
}

export interface SortOption {
  field: "rating" | "cookTime" | "name" | "favorites"
  direction: "asc" | "desc"
}

export const CATEGORIES = ["All", "Classic", "Gourmet", "Vegetarian", "Spicy", "BBQ", "Healthy"]

export const INGREDIENTS = [
  "Beef",
  "Chicken",
  "Plant-based",
  "Cheese",
  "Bacon",
  "Gluten-Free Bun",
  "Egg-free / Dairy-free",
]

export const DIFFICULTIES = ["Easy", "Medium", "Hard"]

export const COOK_TIMES = ["All", "Under 15 minutes", "15–30 minutes", "30+ minutes"]

export const DEFAULT_FILTER_OPTIONS: FilterOptions = {
  category: "All",
  ingredients: [],
  difficulty: [],
  cookTime: "All",
  favoritesOnly: false,
}

export const DEFAULT_SORT_OPTION: SortOption = {
  field: "rating",
  direction: "desc",
}
