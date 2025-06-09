import { Burger } from '../types/Burger';

export const burgersData: Burger[] = [
  {
    id: '1',
    name: 'Classic Cheeseburger',
    category: 'Classic',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    description: 'A timeless American classic with a juicy beef patty, melted cheese, lettuce, tomato, and special sauce on a toasted sesame seed bun.',
    ingredients: [
      '1/4 lb ground beef patty (80/20 blend)',
      '1 slice American cheese',
      '1 sesame seed hamburger bun',
      '2-3 lettuce leaves',
      '2 tomato slices',
      '2-3 pickle slices',
      '1 thin slice red onion',
      '1 tbsp ketchup',
      '1 tbsp yellow mustard',
      'Salt and pepper to taste'
    ],
    instructions: [
      'Remove ground beef from refrigerator 30 minutes before cooking to bring to room temperature.',
      'Season both sides of the patty generously with salt and pepper.',
      'Preheat grill or cast-iron skillet over medium-high heat.',
      'Cook patty for 3-4 minutes on first side without pressing down.',
      'Flip patty and cook for another 3-4 minutes.',
      'Place cheese slice on patty during last minute of cooking.',
      'Toast bun halves cut-side down for 1-2 minutes until golden.',
      'Spread mustard on bottom bun, add lettuce, then patty with cheese.',
      'Top with tomato, pickles, onion, and ketchup.',
      'Crown with top bun and serve immediately.'
    ],
    difficulty: 'Easy',
    cookTime: '15 mins',
    rating: 4.5
  },
  {
    id: '2',
    name: 'BBQ Bacon Burger',
    category: 'Gourmet',
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=400&h=300&fit=crop',
    description: 'Smoky BBQ sauce, crispy bacon, and caramelized onions create an irresistible combination of flavors.',
    ingredients: [
      '1/3 lb ground beef patty',
      '2 strips thick-cut bacon',
      '1 slice sharp cheddar cheese',
      '1 brioche hamburger bun',
      '1/4 cup caramelized onions',
      '2 tbsp BBQ sauce',
      '2 lettuce leaves',
      '1 tomato slice',
      'Salt and pepper'
    ],
    instructions: [
      'Cook bacon in a large skillet until crispy. Remove and drain on paper towels.',
      'Reserve 1 tablespoon of bacon fat for caramelizing onions.',
      'Slice onions thinly and cook in bacon fat over low heat for 15-20 minutes until golden.',
      'Season beef patty with salt and pepper.',
      'Grill patty over medium-high heat for 4-5 minutes per side.',
      'Add cheddar cheese in the last minute of cooking.',
      'Toast brioche bun until golden brown.',
      'Spread BBQ sauce on both bun halves.',
      'Layer bottom bun with lettuce, patty with cheese, bacon, caramelized onions, and tomato.',
      'Top with remaining bun and serve hot.'
    ],
    difficulty: 'Medium',
    cookTime: '35 mins',
    rating: 4.8
  },
  {
    id: '3',
    name: 'Mushroom Swiss Burger',
    category: 'Gourmet',
    image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&h=300&fit=crop',
    description: 'Earthy sautéed mushrooms and creamy Swiss cheese create a sophisticated and savory burger experience.',
    ingredients: [
      '1/3 lb ground beef patty',
      '1 slice Swiss cheese',
      '1 brioche bun',
      '4 oz button mushrooms, sliced',
      '2 tbsp butter',
      '1 clove garlic, minced',
      '1 tsp fresh thyme',
      '2 cups fresh arugula',
      '2 tbsp mayonnaise',
      'Salt and pepper'
    ],
    instructions: [
      'Heat butter in a large skillet over medium heat.',
      'Add sliced mushrooms and cook for 5-7 minutes until golden brown.',
      'Add minced garlic and thyme, cook for another minute.',
      'Season mushrooms with salt and pepper, set aside.',
      'Season beef patty and grill for 4-5 minutes per side.',
      'Top with Swiss cheese in the last minute of cooking.',
      'Toast brioche bun until lightly golden.',
      'Spread mayonnaise on both bun halves.',
      'Layer bottom bun with arugula, patty with cheese, and sautéed mushrooms.',
      'Crown with top bun and serve immediately.'
    ],
    difficulty: 'Medium',
    cookTime: '25 mins',
    rating: 4.6
  },
  {
    id: '4',
    name: 'Spicy Jalapeño Burger',
    category: 'Spicy',
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&h=300&fit=crop',
    description: 'Turn up the heat with fresh jalapeños, pepper jack cheese, and spicy mayo for those who love bold flavors.',
    ingredients: [
      '1/4 lb ground beef patty',
      '1 slice pepper jack cheese',
      '2-3 fresh jalapeño slices',
      '1 sesame seed bun',
      '3 tbsp spicy mayo',
      '1 thin slice red onion',
      '2 lettuce leaves',
      '1 tomato slice',
      '1/4 tsp cayenne pepper',
      'Salt and pepper'
    ],
    instructions: [
      'Mix cayenne pepper into ground beef before forming patty.',
      'Season patty with salt and pepper.',
      'Lightly grill jalapeño slices for 1-2 minutes per side.',
      'Grill beef patty over medium-high heat for 3-4 minutes per side.',
      'Add pepper jack cheese in the final minute of cooking.',
      'Toast bun halves until golden brown.',
      'Spread spicy mayo generously on both bun halves.',
      'Layer bottom bun with lettuce, patty with cheese, grilled jalapeños, red onion, and tomato.',
      'Add top bun and serve with a glass of milk nearby!',
      'Warning: This burger packs serious heat!'
    ],
    difficulty: 'Easy',
    cookTime: '18 mins',
    rating: 4.3
  },
  {
    id: '5',
    name: 'Veggie Black Bean Burger',
    category: 'Vegetarian',
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400&h=300&fit=crop',
    description: 'A hearty plant-based option packed with black beans, vegetables, and bold southwestern flavors.',
    ingredients: [
      '1 cup cooked black beans, mashed',
      '1/2 cup breadcrumbs',
      '1/4 cup diced red onion',
      '1 egg, beaten',
      '1 tsp cumin',
      '1 tsp chili powder',
      '1 whole wheat bun',
      '1/2 avocado, sliced',
      '2 tbsp chipotle mayo',
      '1 cup mixed sprouts',
      '1 tomato slice',
      'Fresh cilantro leaves'
    ],
    instructions: [
      'In a bowl, combine mashed black beans, breadcrumbs, diced onion, and beaten egg.',
      'Add cumin, chili powder, salt, and pepper. Mix well.',
      'Form mixture into a patty and refrigerate for 30 minutes.',
      'Heat oil in a non-stick pan over medium heat.',
      'Cook black bean patty for 4-5 minutes per side until crispy outside.',
      'Toast whole wheat bun until golden.',
      'Mash avocado with a pinch of salt and lime juice.',
      'Spread chipotle mayo on top bun, avocado mash on bottom bun.',
      'Layer bottom bun with sprouts, black bean patty, tomato, and cilantro.',
      'Top with remaining bun and enjoy this healthy alternative!'
    ],
    difficulty: 'Medium',
    cookTime: '45 mins',
    rating: 4.4
  },
  {
    id: '6',
    name: 'Double Bacon Deluxe',
    category: 'Gourmet',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop',
    description: 'Two beef patties, double bacon, and premium toppings make this the ultimate indulgent burger experience.',
    ingredients: [
      '2 x 1/4 lb ground beef patties',
      '4 strips thick-cut bacon',
      '2 slices aged cheddar cheese',
      '1 brioche bun',
      '2 tbsp garlic aioli',
      '2 butter lettuce leaves',
      '2 thick tomato slices',
      '1 slice red onion',
      'Salt and pepper'
    ],
    instructions: [
      'Cook bacon until extra crispy, drain on paper towels.',
      'Season both beef patties generously with salt and pepper.',
      'Grill first patty for 3-4 minutes per side, add cheese slice.',
      'Grill second patty for 3-4 minutes per side, add cheese slice.',
      'Toast brioche bun until golden brown.',
      'Spread garlic aioli on both bun halves.',
      'Layer bottom bun with lettuce, first patty with cheese, 2 bacon strips.',
      'Add second patty with cheese, remaining bacon, tomato, and onion.',
      'Crown with top bun, secure with toothpick if needed.',
      'Serve with napkins - you\'ll need them!'
    ],
    difficulty: 'Hard',
    cookTime: '30 mins',
    rating: 4.9
  }
];

export const categories = [
  { id: '1', name: 'All', isActive: true },
  { id: '2', name: 'Classic', isActive: false },
  { id: '3', name: 'Gourmet', isActive: false },
  { id: '4', name: 'Spicy', isActive: false },
  { id: '5', name: 'Vegetarian', isActive: false }
];