export interface FilterOptions {
  topCategory: "All" | "Popular" | "Recommended";
  category: string;
  ingredients: string[]
  difficulty: string[]
  cookTime: string
  favoritesOnly: boolean
}

export interface SortOption {
  field: "rating" | "cookTime" | "name" | "favorites"
  direction: "asc" | "desc"
}

export const CATEGORIES = {
  // 1. Protein Type
  protein: [
    "Beef",
    "Chicken",
    "Turkey",
    "Lamb",
    "Fish",
    "Pork",
    "Bacon",
    "Plant-Based",
    "Vegetarian",
    "Vegan",
  ],

  // 2. Style / Flavor Profile
  style: [
    "Classic",
    "Gourmet",
    "Cheesy",
    "BBQ",
    "Spicy",
    "Savory",
    "Smoky",
    "Sweet & Savory",
    "Tangy",
    "Crispy",
  ],

  // 3. Dietary Preference
  dietary: [
    "Healthy",
    "Low Carb",
    "Keto-Friendly",
    "Gluten-Free",
    "Lettuce Wrap",
  ],

  // 4. Cheese Type
  cheese: [
    "American Cheese",
    "Cheddar",
    "Swiss",
    "Mozzarella",
    "Blue Cheese",
    "Brie",
    "Goat Cheese",
    "Pepper Jack",
  ],

  // 5. Bun Type
  bun: [
    "Brioche Bun",
    "Sesame Bun",
    "Pretzel Bun",
    "Potato Bun",
    "Gluten-Free Bun",
    "No Bun",
  ],

  // 6. Region / Culture
  region: [
    "Fusion",
    "Tex-Mex",
    "Asian-Inspired",
    "Italian-Style",
    "Southern Style",
    "Hawaiian",
    "Greek",
    "Indian Spiced",
  ],

  // 7. Cooking Style
  cooking: [
    "Grilled",
    "Charbroiled",
    "Pan-Seared",
    "Double Patty",
    "Smash Burger",
    "Stuffed Patty",
  ],

  // 8. Occasion
  occasion: [
    "Breakfast Burger",
    "Sliders",
    "Kids’ Burger",
    "Mini Burger",
    "Deluxe",
    "Stacked",
  ],

  // 9. Specialty Toppings
  toppings: [
    "Egg-Topped",
    "Avocado",
    "Mushroom",
    "Onion Rings",
    "Pickles",
    "Caramelized Onions",
    "Truffle",
    "Jalapeño",
    "Pineapple",
    "Coleslaw",
  ]
};

// all categories combined for easy access
export const ALL_CATEGORIES = [
  ...CATEGORIES.protein,
  ...CATEGORIES.style,
  ...CATEGORIES.dietary,
  ...CATEGORIES.cheese,
  ...CATEGORIES.bun,
  ...CATEGORIES.region,
  ...CATEGORIES.cooking,
  ...CATEGORIES.occasion,
  ...CATEGORIES.toppings
];

export const TOP_LEVEL_CATEGORIES = ["All", "Popular", "Recommended"];

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
  topCategory: "All",
  category: "",
  ingredients: [],
  difficulty: [],
  cookTime: "All",
  favoritesOnly: false,
}

export const DEFAULT_SORT_OPTION: SortOption = {
  field: "rating",
  direction: "desc",
}
