import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Burger } from '../types/Burger';
import { useTheme } from '../context/ThemeContext';
import { useFavorites } from '../context/FavoritesContext';
import Text from "../components/CustomText";
import { burgerImages } from '../data/burgerImages';

const heartIcon = 'https://img.icons8.com/puffy/32/like.png';
const filledHeartIcon = 'https://img.icons8.com/puffy-filled/32/like.png';

interface BurgerCardProps {
  burger: Burger;
  isFavorite: boolean;
  onPress: (burger: Burger) => void;
  onFavoritePress: () => void;
}

const BurgerCard: React.FC<BurgerCardProps> = ({ burger, onPress }) => {
  const { colors } = useTheme();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const isLiked = isFavorite(burger.id);

  const handleFavoritePress = () => {
    if (isLiked) {
      removeFavorite(burger.id);
    } else {
      addFavorite(burger);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card]}
      onPress={() => onPress(burger)}
      activeOpacity={0.9}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={burgerImages[burger.image]} 
          style={styles.image}
        />
      </View>

      <View style={styles.infoSection}>
        <Text
          weight='semiBold'
          style={styles.name}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {burger.name}
        </Text>
        <Text style={styles.category}>{burger.category}</Text>

        <View style={styles.row}>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{burger.totalTime}</Text>
          </View>
          <View
            style={[
              styles.difficulty,
              burger.difficulty.toLowerCase() === 'medium' && { backgroundColor: '#FEF3C7' }, 
              burger.difficulty.toLowerCase() === 'hard' && { backgroundColor: '#FECACA' }, 
            ]}
          >
            <Text
              weight="semiBold"
              style={[
                styles.difficultyText,
                burger.difficulty.toLowerCase() === 'medium' && { color: '#B45309' }, 
                burger.difficulty.toLowerCase() === 'hard' && { color: '#B91C1C' },  
              ]}
            >
              {burger.difficulty.toUpperCase()}
            </Text>
          </View>

        </View>

        <TouchableOpacity onPress={handleFavoritePress} style={styles.favoriteIcon}>
          <Image
            source={{ uri: isLiked ? filledHeartIcon : heartIcon }}
            style={[
              styles.heart,
              isLiked && styles.heartFilled
            ]}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 12,
    marginLeft: 2,
    width: 150,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  imageWrapper: {
    position: 'relative',
    alignItems: 'center',
    marginTop: -45,
    zIndex: 10,
  },
  image: {
    width: 120,
    height: 100,
    resizeMode: 'contain',
  },
  favoriteIcon: {
    position: 'absolute',
    bottom: 0,
    right: 2,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 5,
    elevation: 2,
  },
  heart: {
    width: 18,
    height: 18,
    tintColor: 'black', 
  },
  heartFilled: {
    tintColor: '#8B0000', 
  },
  infoSection: {
    alignItems: 'flex-start',
    marginTop: 6,
    paddingLeft: 4,
  },
  name: {
    fontSize: 14,
    textAlign: 'left',
    marginBottom: 2,
    maxWidth: '100%',
    overflow: 'hidden',
  },
  category: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 2,
    alignSelf: 'flex-start',
  },
  row: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    gap: 4,
  },
  timeContainer: {
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  timeText: {
    fontSize: 11,
    color: 'black',
  },
  difficulty: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  difficultyText: {
    fontSize: 11,
    color: '#166534',
  },
});

export default BurgerCard;
