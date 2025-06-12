import type { Burger } from "../types/Burger"
import type { FilterOptions, SortOption } from "../types/Filter"

export const filterBurgers = (
  burgers: Burger[],
  searchQuery: string,
  selectedCategory: string,
  filterOptions: FilterOptions,
  isFavorite: (id: string) => boolean,
): Burger[] => {
  let filtered = [...burgers]

  if (selectedCategory !== "All") {
    if (selectedCategory === "Popular") {
      filtered = filtered.filter((burger) =>
        typeof burger.rating === "number" && burger.rating >= 4.5,
      )
    } else if (selectedCategory === "Recommended") {
      // Recommended = isRecommended flag
      filtered = filtered.filter((burger) => burger.isRecommended === true)
    } else {
      filtered = filtered.filter((burger) => burger.category === selectedCategory)
    }
  }

  if (searchQuery.trim()) {
    filtered = filtered.filter(
      (burger) =>
        burger.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        burger.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        burger.ingredients.some((ingredient) =>
          ingredient.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
    )
  }

  // Category filter from modal
  if (selectedCategory === "All" && filterOptions.category !== "All") {
    filtered = filtered.filter((burger) => burger.category === filterOptions.category)
  }

  // Ingredients filter
  if (filterOptions.ingredients.length > 0) {
    filtered = filtered.filter((burger) =>
      filterOptions.ingredients.some((ingredient) =>
        burger.ingredients.some((burgerIngredient) =>
          burgerIngredient.toLowerCase().includes(ingredient.toLowerCase()),
        ),
      ),
    )
  }

  // Difficulty filter
  if (filterOptions.difficulty.length > 0) {
    filtered = filtered.filter((burger) => filterOptions.difficulty.includes(burger.difficulty))
  }

  // Cook time filter
  if (filterOptions.cookTime !== "All") {
    filtered = filtered.filter((burger) => {
      const cookTimeMinutes = Number.parseInt(burger.cookTime.split(" ")[0])

      switch (filterOptions.cookTime) {
        case "Under 15 minutes":
          return cookTimeMinutes < 15
        case "15–30 minutes":
          return cookTimeMinutes >= 15 && cookTimeMinutes <= 30
        case "30+ minutes":
          return cookTimeMinutes > 30
        default:
          return true
      }
    })
  }

  // Favorites only filter
  if (filterOptions.favoritesOnly) {
    filtered = filtered.filter((burger) => isFavorite(burger.id))
  }

  return filtered
}

export const sortBurgers = (burgers: Burger[], sortOption: SortOption): Burger[] => {
  return [...burgers].sort((a, b) => {
    switch (sortOption.field) {
      case "rating":
        return sortOption.direction === "desc" ? b.rating - a.rating : a.rating - b.rating
      case "cookTime":
        const aCookTime = Number.parseInt(a.cookTime.split(" ")[0])
        const bCookTime = Number.parseInt(b.cookTime.split(" ")[0])
        return sortOption.direction === "desc" ? bCookTime - aCookTime : aCookTime - bCookTime
      case "name":
        return sortOption.direction === "desc" ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)
      case "favorites":
        // This is a placeholder - in a real app you'd have a count of how many users favorited each burger
        // For now, we'll just use the rating as a proxy for popularity
        return sortOption.direction === "desc" ? b.rating - a.rating : a.rating - b.rating
      default:
        return 0
    }
  })
}

export const hasActiveFilters = (filterOptions: FilterOptions): boolean => {
  return (
    filterOptions.ingredients.length > 0 ||
    filterOptions.difficulty.length > 0 ||
    filterOptions.cookTime !== "All" ||
    filterOptions.favoritesOnly
  )
}

export const getActiveFilterCount = (filterOptions: FilterOptions): number => {
  let count = 0

  if (filterOptions.ingredients.length > 0) count++
  if (filterOptions.difficulty.length > 0) count++
  if (filterOptions.cookTime !== "All") count++
  if (filterOptions.favoritesOnly) count++

  return count
}
