import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { useTheme } from '../context/ThemeContext';
import { useFavorites } from '../context/FavoritesContext';
import { Burger } from '../types/Burger';
import BurgerCard from '../components/BurgerCard';
import Button from '../components/Button';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const FavoritesScreen: React.FC = () => {
  const { colors, isDarkMode } = useTheme();
  const { favorites, removeFavorite } = useFavorites();
  const navigation = useNavigation<NavigationProp>();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(favorites.map(burger => burger.category)))];

  const filteredFavorites = selectedCategory === 'All' 
    ? favorites 
    : favorites.filter(burger => burger.category === selectedCategory);

  const handleBurgerPress = (burger: Burger) => {
    navigation.navigate('BurgerDetail', { burger });
  };

  const handleRemoveFavorite = (burger: Burger) => {
    Alert.alert(
      'Remove Favorite',
      `Remove "${burger.name}" from favorites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeFavorite(burger.id),
        },
      ]
    );
  };

  const renderBurgerCard = ({ item }: { item: Burger }) => (
    <View style={styles.cardContainer}>
      <BurgerCard burger={item} onPress={handleBurgerPress} />
      <TouchableOpacity
        style={[styles.removeButton, { backgroundColor: colors.primary }]}
        onPress={() => handleRemoveFavorite(item)}
      >
        <Text style={styles.removeButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  const CategoryTab: React.FC<{ category: string; isActive: boolean }> = ({ category, isActive }) => (
    <TouchableOpacity
      style={[
        styles.categoryTab,
        { backgroundColor: colors.card, borderColor: colors.border },
        isActive && { backgroundColor: colors.primary }
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text style={[
        styles.categoryText,
        { color: colors.text },
        isActive && { color: 'white' }
      ]}>
        {category}
      </Text>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>💔</Text>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>No Favorites Yet</Text>
      <Text style={[styles.emptyText, { color: colors.subtext }]}>
        Start exploring burgers and tap the heart icon to add them to your favorites!
      </Text>
      <Button
        title="Explore Burgers"
        onPress={() => navigation.navigate('Main')}
        style={styles.exploreButton}
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar backgroundColor={colors.statusBar} barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerTitle}>My Favorites</Text>
        <Text style={styles.headerSubtitle}>
          {favorites.length} {favorites.length === 1 ? 'burger' : 'burgers'}
        </Text>
      </View>

      {favorites.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Categories */}
          {categories.length > 1 && (
            <View style={styles.categoriesContainer}>
              <FlatList
                data={categories}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <CategoryTab category={item} isActive={selectedCategory === item} />
                )}
                contentContainerStyle={styles.categoriesContent}
              />
            </View>
          )}

          {/* Favorites List */}
          <View style={styles.content}>
            <FlatList
              data={filteredFavorites}
              renderItem={renderBurgerCard}
              keyExtractor={(item) => item.id}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.favoritesList}
              ListEmptyComponent={() => (
                <View style={styles.emptyCategory}>
                  <Text style={[styles.emptyCategoryText, { color: colors.subtext }]}>
                    No {selectedCategory.toLowerCase()} favorites yet
                  </Text>
                </View>
              )}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  categoriesContainer: {
    paddingVertical: 15,
  },
  categoriesContent: {
    paddingHorizontal: 20,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  favoritesList: {
    paddingBottom: 20,
  },
  cardContainer: {
    position: 'relative',
    flex: 1,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  exploreButton: {
    paddingHorizontal: 30,
  },
  emptyCategory: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyCategoryText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default FavoritesScreen;