import { burgerImages } from "../data/burgerImages"
import type { Burger } from "../types/Burger"

export const getBurgerImageSource = (burger: Burger) => {
  if (burger.isUserAdded) {
    // User-added burger with URI string
    return { uri: burger.image }
  } else {
    // Default burger with image key - check if key exists in burgerImages
    const imageKey = burger.image as keyof typeof burgerImages
    if (burgerImages[imageKey]) {
      return burgerImages[imageKey]
    } else {
      // Fallback to a placeholder if key doesn't exist
      console.warn(`Burger ${burger.name} has invalid or missing image key: ${burger.image}`)
      return { uri: "https://via.placeholder.com/260x260/cccccc/666666?text=No+Image" }
    }
  }
}

export const validateBurgerImage = (burger: Burger): boolean => {
  if (burger.isUserAdded) {
    return typeof burger.image === "string" && burger.image.length > 0
  } else {
    const imageKey = burger.image as keyof typeof burgerImages
    return !!burgerImages[imageKey]
  }
}
