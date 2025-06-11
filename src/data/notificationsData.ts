import type { Notification } from "../types/Notification"

export const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New Recipe Added! 🍔",
    message: "Try the amazing Truffle Mushroom Burger - a gourmet delight!",
    type: "recipe",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    read: false,
    icon: "🍔",
    actionUrl: "BurgerDetail",
    data: { burgerId: "11" },
  },
  {
    id: "2",
    title: "Achievement Unlocked! 🏆",
    message: "Burger Explorer - You've viewed 10 different burger recipes!",
    type: "achievement",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    read: false,
    icon: "🏆",
  },
  {
    id: "3",
    title: "Cooking Tip 💡",
    message: "Pro tip: Let your burger patties rest for 5 minutes after cooking for juicier results!",
    type: "tip",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    read: true,
    icon: "💡",
  },
  {
    id: "4",
    title: "Weekly Challenge 🎯",
    message: "This week's challenge: Try cooking a vegetarian burger! Earn points and unlock new recipes.",
    type: "achievement",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    read: true,
    icon: "🎯",
  },
  {
    id: "5",
    title: "App Update Available 📱",
    message: "Version 2.1 is here! New features include meal planning and nutrition tracking.",
    type: "update",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    read: false,
    icon: "📱",
  },
  {
    id: "6",
    title: "Cooking Reminder ⏰",
    message: "Don't forget to check your shopping list before your next grocery trip!",
    type: "reminder",
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    read: true,
    icon: "⏰",
  },
  {
    id: "7",
    title: "Featured Recipe 🌟",
    message: "The BBQ Bacon Burger is trending! Join 500+ users who've tried this recipe.",
    type: "recipe",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    read: true,
    icon: "🌟",
    actionUrl: "BurgerDetail",
    data: { burgerId: "5" },
  },
  {
    id: "8",
    title: "Ingredient Spotlight 🥬",
    message: "Learn about the health benefits of adding fresh arugula to your burgers!",
    type: "tip",
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
    read: true,
    icon: "🥬",
  },
  {
    id: "9",
    title: "Community Recipe 👥",
    message: "User @ChefMike shared an amazing Korean BBQ Burger recipe! Check it out.",
    type: "recipe",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
    read: true,
    icon: "👥",
  },
  {
    id: "10",
    title: "Cooking Streak! 🔥",
    message: "Amazing! You've cooked burgers 3 days in a row. Keep the streak going!",
    type: "achievement",
    timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
    read: true,
    icon: "🔥",
  },
]
