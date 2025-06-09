import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Burger } from '../types/Burger';
import { useAuth } from './AuthContext';

interface FavoritesContextType {
  favorites: Burger[];
  isLoading: boolean;
  addFavorite: (burger: Burger) => Promise<void>;
  removeFavorite: (burgerId: string) => Promise<void>;
  isFavorite: (burgerId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Burger[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setFavorites([]);
      setIsLoading(false);
    }
  }, [user]);

  const loadFavorites = async () => {
    try {
      if (!user) return;
      
      const favoritesKey = `favorites_${user.id}`;
      const savedFavorites = await AsyncStorage.getItem(favoritesKey);
      
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveFavorites = async (newFavorites: Burger[]) => {
    try {
      if (!user) return;
      
      const favoritesKey = `favorites_${user.id}`;
      await AsyncStorage.setItem(favoritesKey, JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const addFavorite = async (burger: Burger) => {
    if (!user) return;
    
    // Check if already in favorites
    if (!favorites.some(fav => fav.id === burger.id)) {
      const newFavorites = [...favorites, burger];
      setFavorites(newFavorites);
      await saveFavorites(newFavorites);
      
      // Update user stats
      const favoriteCategories = newFavorites.reduce((acc: Record<string, number>, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + 1;
        return acc;
      }, {});
      
      // Find most common category
      let topCategory = 'None';
      let maxCount = 0;
      
      Object.entries(favoriteCategories).forEach(([category, count]) => {
        if (count > maxCount) {
          maxCount = count;
          topCategory = category;
        }
      });
      
      // Update user's favorite category if needed
      if (user.stats && user.stats.favoriteCategory !== topCategory) {
        const updatedUser = {
          ...user,
          stats: {
            ...user.stats,
            favoriteCategory: topCategory
          }
        };
        
        await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      }
    }
  };

  const removeFavorite = async (burgerId: string) => {
    if (!user) return;
    
    const newFavorites = favorites.filter(burger => burger.id !== burgerId);
    setFavorites(newFavorites);
    await saveFavorites(newFavorites);
  };

  const isFavorite = (burgerId: string): boolean => {
    return favorites.some(burger => burger.id === burgerId);
  };

  return (
    <FavoritesContext.Provider value={{ 
      favorites, 
      isLoading, 
      addFavorite, 
      removeFavorite, 
      isFavorite 
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};