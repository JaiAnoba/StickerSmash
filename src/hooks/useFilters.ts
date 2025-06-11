"use client"

import { useState, useEffect } from "react"
import type { Burger } from "../types/Burger"
import type { FilterOptions, SortOption } from "../types/Filter"
import { DEFAULT_FILTER_OPTIONS, DEFAULT_SORT_OPTION } from "../types/Filter"
import { filterBurgers, sortBurgers, hasActiveFilters, getActiveFilterCount } from "../utils/burgerFilters"

interface UseFiltersProps {
  burgers: Burger[]
  searchQuery: string
  selectedCategory: string
  isFavorite: (id: string) => boolean
}

export const useFilters = ({ burgers, searchQuery, selectedCategory, isFavorite }: UseFiltersProps) => {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(DEFAULT_FILTER_OPTIONS)
  const [sortOption, setSortOption] = useState<SortOption>(DEFAULT_SORT_OPTION)
  const [filteredBurgers, setFilteredBurgers] = useState<Burger[]>(burgers)

  useEffect(() => {
    const filtered = filterBurgers(burgers, searchQuery, selectedCategory, filterOptions, isFavorite)
    const sorted = sortBurgers(filtered, sortOption)
    setFilteredBurgers(sorted)
  }, [burgers, searchQuery, selectedCategory, filterOptions, sortOption, isFavorite])

  const resetFilters = () => {
    setFilterOptions(DEFAULT_FILTER_OPTIONS)
    setSortOption(DEFAULT_SORT_OPTION)
  }

  const updateCategoryFilter = (category: string) => {
    setFilterOptions((prev) => ({ ...prev, category }))
  }

  return {
    filterOptions,
    setFilterOptions,
    sortOption,
    setSortOption,
    filteredBurgers,
    resetFilters,
    updateCategoryFilter,
    hasActiveFilters: hasActiveFilters(filterOptions),
    activeFilterCount: getActiveFilterCount(filterOptions),
  }
}
