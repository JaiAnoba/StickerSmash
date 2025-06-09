import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Burger } from '../types/Burger';

interface BurgerCardProps {
  burger: Burger;
  onPress: (burger: Burger) => void;
}

const BurgerCard: React.FC<BurgerCardProps> = ({ burger, onPress }) => {
  const renderStars = (rating: number): string => {
    const stars: string[] = [];
    const fullStars: number = Math.floor(rating);
    const hasHalfStar: boolean = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }
    if (hasHalfStar) {
      stars.push('☆');
    }
    return stars.join('');
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(burger)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: burger.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {burger.name}
        </Text>
        <Text style={styles.category}>{burger.category}</Text>
        <View style={styles.footer}>
          <View style={styles.rating}>
            <Text style={styles.stars}>{renderStars(burger.rating)}</Text>
            <Text style={styles.ratingText}>{burger.rating}</Text>
          </View>
          <Text style={styles.cookTime}>{burger.cookTime}</Text>
        </View>
        <View style={styles.difficulty}>
          <Text style={[
            styles.difficultyText,
            burger.difficulty === 'Easy' && styles.easy,
            burger.difficulty === 'Medium' && styles.medium,
            burger.difficulty === 'Hard' && styles.hard,
          ]}>
            {burger.difficulty}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    margin: 8,
    flex: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    lineHeight: 20,
  },
  category: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    color: '#B91C1C',
    fontSize: 14,
    marginRight: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  cookTime: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  difficulty: {
    alignSelf: 'flex-start',
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  easy: {
    backgroundColor: '#DCFCE7',
    color: '#166534',
  },
  medium: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
  },
  hard: {
    backgroundColor: '#FEE2E2',
    color: '#B91C1C',
  },
});

export default BurgerCard;