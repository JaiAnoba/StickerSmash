import type React from "react"
import { createContext, useContext, useState, type ReactNode } from "react"
import { burgersData } from "../data/burgersData"
import type { Burger } from "../types/Burger"

interface BurgerDataContextType {
  allBurgers: Burger[]
  addBurger: (burger: Burger) => void
  getBurgerById: (id: string) => Burger | undefined
}

const BurgerDataContext = createContext<BurgerDataContextType | undefined>(undefined)

interface BurgerDataProviderProps {
  children: ReactNode
}

export const BurgerDataProvider: React.FC<BurgerDataProviderProps> = ({ children }) => {
  // Initialize with existing burgers data and user-added burgers
  const [userAddedBurgers, setUserAddedBurgers] = useState<Burger[]>([])

  // Combine existing burgers with user-added ones
  const allBurgers = [...burgersData, ...userAddedBurgers]

  const addBurger = (burger: Burger) => {
    setUserAddedBurgers((prev) => [...prev, burger])
  }

  const getBurgerById = (id: string): Burger | undefined => {
    return allBurgers.find((burger) => burger.id === id)
  }

  return (
    <BurgerDataContext.Provider
      value={{
        allBurgers,
        addBurger,
        getBurgerById,
      }}
    >
      {children}
    </BurgerDataContext.Provider>
  )
}

export const useBurgerData = (): BurgerDataContextType => {
  const context = useContext(BurgerDataContext)
  if (!context) {
    throw new Error("useBurgerData must be used within a BurgerDataProvider")
  }
  return context
}
