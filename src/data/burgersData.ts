import type { Burger } from "../types/Burger"
import {burgerImages} from "./burgerImages"


export const burgersData: Burger[] = [
  {
    id: "1",
    name: "Classic Cheeseburger",
    category: "Classic",
    image: "classic",
    description:
      "The timeless classic burger with juicy beef patty, melted cheese, fresh lettuce, tomato, and our special sauce.",
    ingredients: [
      "1 lb ground beef (80/20)",
      "4 hamburger buns",
      "4 slices American cheese",
      "1 tomato, sliced",
      "Lettuce leaves",
      "1 red onion, sliced",
      "4 tbsp mayonnaise",
      "2 tbsp ketchup",
      "1 tbsp mustard",
      "Salt and pepper to taste",
    ],
    instructions: [
      "Divide beef into 4 equal portions and form into patties slightly larger than your buns.",
      "Season both sides with salt and pepper.",
      "Heat grill or skillet to medium-high heat.",
      "Cook patties for 3-4 minutes per side for medium doneness.",
      "Add cheese during the last minute of cooking to melt.",
      "Mix mayonnaise, ketchup, and mustard to create special sauce.",
      "Toast buns lightly on the grill or in a toaster.",
      "Assemble burger with sauce, lettuce, patty with cheese, tomato, and onion.",
      "Serve immediately.",
    ],
    cookTime: "15 min",
    prepTime: "10 min",
    totalTime: "25 mins",
    servings: 4,
    calories: 650,
    rating: 4.8,
    isRecommended: false,
    difficulty: "Easy",
    nutrition: {
      calories: 650,
      protein: 35,
      carbs: 40,
      fat: 38,
    },
  },
  {
    id: "2",
    name: "Mushroom Swiss Burger",
    category: "Gourmet",
    image:
      "mushroomSwiss",
    description:
      "A savory delight featuring sautéed mushrooms, caramelized onions, and melted Swiss cheese on a juicy beef patty.",
    ingredients: [
      "1 lb ground beef (80/20)",
      "4 hamburger buns",
      "4 slices Swiss cheese",
      "8 oz mushrooms, sliced",
      "1 large onion, sliced",
      "2 tbsp butter",
      "1 tbsp olive oil",
      "2 cloves garlic, minced",
      "2 tbsp Worcestershire sauce",
      "Salt and pepper to taste",
      "2 tbsp mayonnaise",
      "1 tbsp Dijon mustard",
    ],
    instructions: [
      "Heat olive oil in a skillet over medium heat.",
      "Add sliced onions and cook until caramelized, about 15 minutes.",
      "Add mushrooms and garlic, cook until mushrooms are soft, about 5 minutes.",
      "Add Worcestershire sauce and cook for another minute. Set aside.",
      "Form beef into 4 patties and season with salt and pepper.",
      "Cook patties in butter for 4-5 minutes per side for medium doneness.",
      "Top with Swiss cheese and cover to melt.",
      "Mix mayonnaise and Dijon mustard.",
      "Spread sauce on toasted buns, add patty with cheese, and top with mushroom-onion mixture.",
      "Serve hot.",
    ],
    cookTime: "25 min",
    prepTime: "15 min",
    totalTime: "40 mins",
    servings: 4,
    calories: 720,
    rating: 4.6,
    isRecommended: true,
    difficulty: "Medium",
    nutrition: {
      calories: 720,
      protein: 38,
      carbs: 42,
      fat: 45,
    },
  },
  {
    id: "3",
    name: "Veggie Burger Deluxe",
    category: "Vegetarian",
    image:
      "veggie",
    description:
      "A hearty plant-based burger with black beans, quinoa, and roasted vegetables, topped with avocado and sprouts.",
    ingredients: [
      "1 can black beans, drained and rinsed",
      "1/2 cup cooked quinoa",
      "1/2 red bell pepper, diced",
      "1/2 onion, diced",
      "2 cloves garlic, minced",
      "1 carrot, grated",
      "1/4 cup breadcrumbs",
      "1 egg (or flax egg for vegan)",
      "1 tsp cumin",
      "1 tsp paprika",
      "1/2 tsp chili powder",
      "Salt and pepper to taste",
      "4 whole grain buns",
      "1 avocado, sliced",
      "Alfalfa sprouts",
      "Tomato slices",
      "Lettuce leaves",
      "Vegan mayo or hummus",
    ],
    instructions: [
      "Preheat oven to 375°F (190°C).",
      "Mash black beans in a large bowl, leaving some chunks for texture.",
      "Sauté onion, bell pepper, and garlic until soft, about 5 minutes.",
      "Add vegetables, quinoa, breadcrumbs, egg, and spices to the beans. Mix well.",
      "Form mixture into 4 patties and place on a lined baking sheet.",
      "Bake for 10 minutes, flip, and bake for another 10 minutes.",
      "Toast buns lightly.",
      "Spread vegan mayo or hummus on buns, add patty, and top with avocado, sprouts, tomato, and lettuce.",
      "Serve immediately.",
    ],
    cookTime: "25 min",
    prepTime: "20 min",
    totalTime: "45 mins",
    servings: 4,
    calories: 420,
    rating: 4.5,
    isRecommended: false,
    difficulty: "Medium",
    nutrition: {
      calories: 420,
      protein: 15,
      carbs: 58,
      fat: 18,
    },
  },
  {
    id: "4",
    name: "Spicy Jalapeño Burger",
    category: "Spicy",
    image:
      "spicy",
    description:
      "A fiery burger featuring jalapeños, pepper jack cheese, and chipotle mayo that will ignite your taste buds.",
    ingredients: [
      "1 lb ground beef (80/20)",
      "4 hamburger buns",
      "4 slices pepper jack cheese",
      "4 jalapeños, sliced (seeds removed for less heat)",
      "1/2 cup red onion, sliced",
      "1/4 cup cilantro, chopped",
      "1 tsp garlic powder",
      "1 tsp onion powder",
      "1 tsp cayenne pepper",
      "1/2 cup mayonnaise",
      "1 tbsp chipotle in adobo, minced",
      "1 lime, juiced",
      "Salt and pepper to taste",
      "Lettuce and tomato for serving",
    ],
    instructions: [
      "Mix ground beef with garlic powder, onion powder, cayenne, salt, and pepper.",
      "Form into 4 patties with a slight indentation in the center.",
      "Grill or cook patties in a skillet for 4-5 minutes per side.",
      "Top with pepper jack cheese during the last minute of cooking.",
      "Mix mayonnaise, chipotle, and lime juice to make chipotle mayo.",
      "Toast buns on the grill or in a toaster.",
      "Spread chipotle mayo on buns, add lettuce, patty with cheese, jalapeños, onion, cilantro, and tomato.",
      "Serve with extra jalapeños on the side for the brave.",
    ],
    cookTime: "15 min",
    prepTime: "15 min",
    totalTime: "30 mins",
    servings: 4,
    calories: 680,
    rating: 4.7,
    isRecommended: true,
    difficulty: "Medium",
    nutrition: {
      calories: 680,
      protein: 36,
      carbs: 38,
      fat: 42,
    },
  },
  {
    id: "5",
    name: "BBQ Bacon Burger",
    category: "BBQ",
    image:
      "bbq",
    description:
      "A smoky, sweet burger topped with crispy bacon, cheddar cheese, and tangy BBQ sauce for the ultimate comfort food experience.",
    ingredients: [
      "1 lb ground beef (80/20)",
      "4 hamburger buns",
      "8 slices bacon",
      "4 slices cheddar cheese",
      "1 large onion, sliced into rings",
      "1/2 cup BBQ sauce",
      "2 tbsp brown sugar",
      "1 tbsp Worcestershire sauce",
      "1 tsp smoked paprika",
      "1 tsp garlic powder",
      "Salt and pepper to taste",
      "Lettuce and tomato for serving",
    ],
    instructions: [
      "Cook bacon until crispy. Set aside on paper towels.",
      "Mix 1/4 cup BBQ sauce with ground beef, smoked paprika, garlic powder, salt, and pepper.",
      "Form into 4 patties with a slight indentation in the center.",
      "Grill or cook patties in a skillet for 4-5 minutes per side.",
      "Caramelize onions by cooking in the bacon fat with brown sugar until soft and golden.",
      "Top patties with cheddar cheese and cover to melt.",
      "Mix remaining BBQ sauce with Worcestershire sauce.",
      "Toast buns on the grill or in a toaster.",
      "Assemble burger with BBQ sauce, lettuce, patty with cheese, bacon, caramelized onions, and tomato.",
      "Serve with extra BBQ sauce on the side.",
    ],
    cookTime: "20 min",
    prepTime: "15 min",
    totalTime: "35 mins",
    servings: 4,
    calories: 780,
    rating: 4.9,
    isRecommended: false,
    difficulty: "Medium",
    nutrition: {
      calories: 780,
      protein: 42,
      carbs: 45,
      fat: 48,
    },
  },
  {
    id: "6",
    name: "Mediterranean Lamb Burger",
    category: "Gourmet",
    image:
      "lamb",
    description:
      "A sophisticated burger featuring ground lamb, feta cheese, tzatziki sauce, and fresh herbs for a Mediterranean twist.",
    ingredients: [
      "1 lb ground lamb",
      "4 pita breads or burger buns",
      "1/2 cup feta cheese, crumbled",
      "1/4 cup red onion, finely diced",
      "2 cloves garlic, minced",
      "2 tbsp fresh mint, chopped",
      "2 tbsp fresh parsley, chopped",
      "1 tsp dried oregano",
      "1 tsp ground cumin",
      "1/2 tsp cinnamon",
      "Salt and pepper to taste",
      "1 cucumber, sliced",
      "1 tomato, sliced",
      "1/2 cup tzatziki sauce",
      "1/4 cup Kalamata olives, pitted and chopped",
      "Mixed greens for serving",
    ],
    instructions: [
      "Mix ground lamb with onion, garlic, herbs, spices, salt, and pepper.",
      "Gently fold in feta cheese.",
      "Form into 4 patties and refrigerate for 30 minutes.",
      "Grill or cook patties in a skillet for 4-5 minutes per side for medium doneness.",
      "Warm pita breads or toast burger buns.",
      "Spread tzatziki sauce on bread or buns.",
      "Add mixed greens, lamb patty, cucumber, tomato, and chopped olives.",
      "Serve with extra tzatziki sauce on the side.",
    ],
    cookTime: "15 min",
    prepTime: "40 min",
    totalTime: "55 mins",
    servings: 4,
    calories: 580,
    rating: 4.7,
    isRecommended: true,
    difficulty: "Medium",
    nutrition: {
      calories: 580,
      protein: 32,
      carbs: 35,
      fat: 36,
    },
  },
  {
    id: "7",
    name: "Portobello Mushroom Burger",
    category: "Vegetarian",
    image:
      "portobello",
    description:
      "A meaty vegetarian option featuring marinated and grilled portobello mushroom caps, roasted red peppers, and goat cheese.",
    ingredients: [
      "4 large portobello mushroom caps, stems removed",
      "4 whole grain buns",
      "4 oz goat cheese",
      "1 jar roasted red peppers, drained",
      "2 cups arugula",
      "1/4 cup balsamic vinegar",
      "3 tbsp olive oil",
      "2 cloves garlic, minced",
      "1 tbsp fresh thyme, chopped",
      "1 tbsp fresh rosemary, chopped",
      "Salt and pepper to taste",
      "2 tbsp mayonnaise",
      "1 tbsp pesto",
    ],
    instructions: [
      "Clean mushroom caps and remove gills with a spoon.",
      "Mix balsamic vinegar, olive oil, garlic, thyme, rosemary, salt, and pepper.",
      "Marinate mushrooms in the mixture for at least 30 minutes, turning occasionally.",
      "Grill mushrooms for 4-5 minutes per side until tender.",
      "Mix mayonnaise and pesto to create pesto mayo.",
      "Toast buns lightly.",
      "Spread pesto mayo on buns, add arugula, mushroom cap, roasted red peppers, and crumbled goat cheese.",
      "Serve immediately.",
    ],
    cookTime: "15 min",
    prepTime: "40 min",
    totalTime: "55 mins",
    servings: 4,
    calories: 380,
    rating: 4.5,
    isRecommended: false,
    difficulty: "Easy",
    nutrition: {
      calories: 380,
      protein: 12,
      carbs: 42,
      fat: 22,
    },
  },
  {
    id: "8",
    name: "Hawaiian Teriyaki Burger",
    category: "Gourmet",
    image:
      "hawaiian",
    description:
      "A tropical-inspired burger with teriyaki glaze, grilled pineapple, and Swiss cheese that brings the flavors of Hawaii to your plate.",
    ingredients: [
      "1 lb ground beef (80/20)",
      "4 hamburger buns",
      "4 slices Swiss cheese",
      "4 pineapple rings",
      "1 red onion, sliced",
      "4 lettuce leaves",
      "1/2 cup teriyaki sauce",
      "2 tbsp brown sugar",
      "1 tbsp ginger, grated",
      "2 cloves garlic, minced",
      "1 tbsp sesame oil",
      "1 tbsp sesame seeds",
      "2 green onions, sliced",
      "Salt and pepper to taste",
    ],
    instructions: [
      "Mix 1/4 cup teriyaki sauce with ground beef, salt, and pepper.",
      "Form into 4 patties with a slight indentation in the center.",
      "In a small saucepan, combine remaining teriyaki sauce, brown sugar, ginger, garlic, and sesame oil.",
      "Simmer sauce until slightly thickened, about 5 minutes.",
      "Grill or cook patties in a skillet for 4-5 minutes per side.",
      "Grill pineapple rings for 2-3 minutes per side until caramelized.",
      "Top patties with Swiss cheese and cover to melt.",
      "Toast buns on the grill or in a toaster.",
      "Assemble burger with lettuce, patty with cheese, grilled pineapple, red onion, and teriyaki glaze.",
      "Sprinkle with sesame seeds and green onions before serving.",
    ],
    cookTime: "20 min",
    prepTime: "15 min",
    totalTime: "35 mins",
    servings: 4,
    calories: 650,
    rating: 4.6,
    isRecommended: true,
    difficulty: "Medium",
    nutrition: {
      calories: 650,
      protein: 34,
      carbs: 52,
      fat: 36,
    },
  },
  {
    id: "9",
    name: "Double Bacon Smash Burger",
    category: "Classic",
    image:
      "doubleBacon",
    description:
      "A decadent burger featuring two thin, crispy-edged smashed patties, double cheese, and plenty of bacon for the ultimate indulgence.",
    ingredients: [
      "1.5 lbs ground beef (80/20)",
      "8 slices bacon",
      "8 slices American cheese",
      "4 hamburger buns",
      "1 red onion, thinly sliced",
      "Pickle slices",
      "1/4 cup mayonnaise",
      "2 tbsp ketchup",
      "1 tbsp mustard",
      "1 tsp pickle juice",
      "Salt and pepper to taste",
    ],
    instructions: [
      "Cook bacon until crispy. Set aside on paper towels.",
      "Divide beef into 8 equal portions and form into loose balls.",
      "Heat a cast-iron skillet or griddle to high heat.",
      "Place beef balls on the hot surface and immediately smash down with a spatula to about 1/4 inch thickness.",
      "Season with salt and pepper and cook for about 2 minutes until edges are crispy.",
      "Flip patties, add cheese to each, and cook for another minute.",
      "Mix mayonnaise, ketchup, mustard, and pickle juice to create special sauce.",
      "Toast buns on the griddle in the beef and bacon fat.",
      "Assemble burger with sauce, two patties with cheese, bacon, onion, and pickles.",
      "Serve immediately.",
    ],
    cookTime: "15 min",
    prepTime: "15 min",
    totalTime: "30 mins",
    servings: 4,
    calories: 950,
    rating: 4.9,
    isRecommended: false,
    difficulty: "Medium",
    nutrition: {
      calories: 950,
      protein: 56,
      carbs: 40,
      fat: 65,
    },
  },
  {
    id: "10",
    name: "Turkey Avocado Burger",
    category: "Healthy",
    image:
      "turkey",
    description:
      "A lighter burger option made with lean ground turkey, topped with creamy avocado, sprouts, and a zesty yogurt sauce.",
    ingredients: [
      "1 lb ground turkey",
      "4 whole grain buns",
      "1 avocado, sliced",
      "1 cup alfalfa sprouts",
      "1 tomato, sliced",
      "1/4 red onion, thinly sliced",
      "1/4 cup Greek yogurt",
      "1 tbsp lemon juice",
      "1 tbsp fresh dill, chopped",
      "1 clove garlic, minced",
      "1 tsp Dijon mustard",
      "1/4 cup breadcrumbs",
      "1 egg",
      "1 tbsp olive oil",
      "1 tsp dried oregano",
      "Salt and pepper to taste",
    ],
    instructions: [
      "Mix ground turkey with breadcrumbs, egg, oregano, salt, and pepper.",
      "Form into 4 patties and refrigerate for 15 minutes.",
      "Mix Greek yogurt, lemon juice, dill, garlic, and Dijon mustard to create sauce.",
      "Heat olive oil in a skillet over medium heat.",
      "Cook turkey patties for 5-6 minutes per side until internal temperature reaches 165°F (74°C).",
      "Toast buns lightly.",
      "Spread yogurt sauce on buns, add patty, avocado slices, tomato, red onion, and sprouts.",
      "Serve immediately.",
    ],
    cookTime: "15 min",
    prepTime: "20 min",
    totalTime: "35 mins",
    servings: 4,
    calories: 420,
    rating: 4.4,
    isRecommended: true,
    difficulty: "Easy",
    nutrition: {
      calories: 420,
      protein: 28,
      carbs: 38,
      fat: 22,
    },
  },
   {
    id: "11",
    name: "Blue Cheese Burger",
    category: "Gourmet",
    image: "blueCheese",
    description: "Bold and tangy blue cheese paired with caramelized onions and arugula for a rich, gourmet experience.",
    ingredients: [
      "1 lb ground beef",
      "4 burger buns",
      "4 oz blue cheese, crumbled",
      "1 large onion, thinly sliced",
      "2 tbsp butter",
      "1 tbsp olive oil",
      "2 cups arugula",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Caramelize onions in butter and olive oil until golden brown.",
      "Form ground beef into 4 patties and season with salt and pepper.",
      "Grill or pan-sear patties 4-5 minutes per side.",
      "Top with crumbled blue cheese and cover to melt.",
      "Toast buns and layer arugula, patty, and caramelized onions.",
      "Serve immediately."
    ],
    cookTime: "20 min",
    prepTime: "15 min",
    totalTime: "35 mins",
    servings: 4,
    calories: 700,
    rating: 4.7,
    isRecommended: false,
    difficulty: "Medium",
    nutrition: {
      calories: 700,
      protein: 36,
      carbs: 34,
      fat: 45,
    }
  },
  {
    id: "12",
    name: "Breakfast Burger",
    category: "Specialty",
    image: "breakfast",
    description: "A morning twist with fried egg, crispy bacon, cheddar cheese, and a hash brown patty on a toasted bun.",
    ingredients: [
      "1 lb ground beef",
      "4 burger buns",
      "4 eggs",
      "4 hash brown patties",
      "8 slices bacon",
      "4 slices cheddar cheese",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Cook bacon until crispy.",
      "Fry hash browns and set aside.",
      "Form beef into patties, season, and cook until desired doneness.",
      "Top patties with cheddar and let melt.",
      "Fry eggs sunny-side up.",
      "Assemble burger with bun, hash brown, patty with cheese, bacon, and egg."
    ],
    cookTime: "20 min",
    prepTime: "10 min",
    totalTime: "30 mins",
    servings: 4,
    calories: 850,
    rating: 4.9,
    isRecommended: true,
    difficulty: "Medium",
    nutrition: {
      calories: 850,
      protein: 40,
      carbs: 46,
      fat: 55
    }
  },
  {
    id: "13",
    name: "Kimchi Burger",
    category: "Fusion",
    image: "kimchi",
    description: "A Korean-inspired burger with spicy kimchi, gochujang mayo, and crispy beef patty.",
    ingredients: [
      "1 lb ground beef",
      "4 buns",
      "1 cup kimchi, chopped",
      "1/4 cup gochujang",
      "1/2 cup mayonnaise",
      "4 slices mozzarella or cheddar",
      "Lettuce leaves",
      "Salt and pepper"
    ],
    instructions: [
      "Mix gochujang with mayonnaise.",
      "Form and season beef patties, grill or pan-fry until cooked.",
      "Top with cheese and melt.",
      "Toast buns, spread gochujang mayo.",
      "Layer with lettuce, patty, and kimchi."
    ],
    cookTime: "15 min",
    prepTime: "10 min",
    totalTime: "25 mins",
    servings: 4,
    calories: 720,
    rating: 4.8,
    isRecommended: false,
    difficulty: "Medium",
    nutrition: {
      calories: 720,
      protein: 35,
      carbs: 38,
      fat: 46
    }
  },
  {
    id: "14",
    name: "Salmon Burger",
    category: "Seafood",
    image: 'salmonBurger',
    description: "A light yet flavorful burger made with fresh salmon, dill, and lemon, perfect for seafood lovers.",
    ingredients: [
      "1 lb salmon filet, skin removed",
      "1/4 cup breadcrumbs",
      "2 tbsp fresh dill, chopped",
      "1 egg",
      "1 tbsp Dijon mustard",
      "1 tbsp lemon juice",
      "4 buns",
      "Lettuce and tomato",
      "Tartar sauce"
    ],
    instructions: [
      "Chop salmon finely or pulse in food processor.",
      "Mix with dill, breadcrumbs, egg, mustard, and lemon juice.",
      "Form into 4 patties and chill 15 min.",
      "Cook 3-4 minutes per side in skillet.",
      "Toast buns, spread tartar sauce, add lettuce, tomato, and salmon patty."
    ],
    cookTime: "10 min",
    prepTime: "15 min",
    totalTime: "25 mins",
    servings: 4,
    calories: 520,
    rating: 4.4,
    isRecommended: true,
    difficulty: "Easy",
    nutrition: {
      calories: 520,
      protein: 34,
      carbs: 30,
      fat: 28
    }
  },

]
