import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/Burger';
import { Alert } from 'react-native';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const userData = await AsyncStorage.getItem('userData');
      
      if (userToken && userData) {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll accept any email/password
      // In a real app, you would validate against a backend
      
      // Check if user exists in AsyncStorage (for demo)
      const existingUsers = await AsyncStorage.getItem('users');
      const users = existingUsers ? JSON.parse(existingUsers) : [];
      
      const foundUser = users.find((u: any) => u.email === email);
      
      if (!foundUser) {
        throw new Error('User not found. Please register first.');
      }
      
      if (foundUser.password !== password) {
        throw new Error('Invalid password.');
      }
      
      // Create user object without password
      const { password: _, ...userWithoutPassword } = foundUser;
      const userData: User = userWithoutPassword;
      
      await AsyncStorage.setItem('userToken', 'token-' + Date.now());
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Something went wrong');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if user already exists
      const existingUsers = await AsyncStorage.getItem('users');
      const users = existingUsers ? JSON.parse(existingUsers) : [];
      
      if (users.some((u: any) => u.email === email)) {
        throw new Error('Email already registered. Please login instead.');
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password, // In a real app, this would be hashed
        joinDate: new Date().toISOString(),
        favorites: [],
        stats: {
          burgersViewed: 0,
          recipesCooked: 0,
          favoriteCategory: 'None yet',
          totalCookTime: '0m',
        }
      };
      
      // Save to "database"
      users.push(newUser);
      await AsyncStorage.setItem('users', JSON.stringify(users));
      
      // Create user object without password
      const { password: _, ...userWithoutPassword } = newUser;
      const userData: User = userWithoutPassword;
      
      // Log user in
      await AsyncStorage.setItem('userToken', 'token-' + Date.now());
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'Something went wrong');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      if (!user) return;
      
      const updatedUser = { ...user, ...userData };
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      
      // Also update in users array
      const existingUsers = await AsyncStorage.getItem('users');
      if (existingUsers) {
        const users = JSON.parse(existingUsers);
        const updatedUsers = users.map((u: any) => 
          u.id === user.id ? { ...u, ...userData } : u
        );
        await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
      }
      
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      Alert.alert('Update Failed', 'Failed to update user information');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoading, 
      login, 
      register, 
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};