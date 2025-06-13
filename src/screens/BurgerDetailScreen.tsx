import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { burgerImages } from '../data/burgerImages';
import Text from "../components/CustomText";

type BurgerDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BurgerDetail'>;
type BurgerDetailScreenRouteProp = RouteProp<RootStackParamList, 'BurgerDetail'>;

interface Props {
  navigation: BurgerDetailScreenNavigationProp;
  route: BurgerDetailScreenRouteProp;
}

type TabType = 'details' | 'ingredients' | 'instructions';

const BurgerDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { burger } = route.params;
  const [activeTab, setActiveTab] = useState<TabType>('details');

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

  const renderTabContent = (): JSX.Element | null => {
    switch (activeTab) {
      case 'details':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.description}>{burger.description}</Text>
            <View style={styles.metaInfo}>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Difficulty</Text>
                <Text style={[
                  styles.metaValue,
                  burger.difficulty === 'Easy' && styles.easyText,
                  burger.difficulty === 'Medium' && styles.mediumText,
                  burger.difficulty === 'Hard' && styles.hardText,
                ]}>
                  {burger.difficulty}
                </Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Cook Time</Text>
                <Text style={styles.metaValue}>{burger.cookTime}</Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Rating</Text>
                <View style={styles.ratingContainer}>
                  <Text style={styles.stars}>{renderStars(burger.rating)}</Text>
                  <Text style={styles.ratingValue}>{burger.rating}</Text>
                </View>
              </View>
            </View>
          </View>
        );
      case 'ingredients':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            {burger.ingredients.map((ingredient: string, index: number) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>{ingredient}</Text>
              </View>
            ))}
          </View>
        );
      case 'instructions':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Cooking Instructions</Text>
            {burger.instructions.map((instruction: string, index: number) => (
              <View key={index} style={styles.instructionItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#B91C1C" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {burger.name}
        </Text>
        <TouchableOpacity style={styles.favoriteButton}>
          <Text style={styles.favoriteIcon}>♡</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Image Section */}
        <View style={styles.imageContainer}>
          <Image
            source={burgerImages[burger.image]} 
            style={styles.burgerImage}
          />
        </View>
        
        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.burgerName}>{burger.name}</Text>
          <Text style={styles.burgerCategory}>{burger.category}</Text>
          
          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'details' && styles.activeTab]}
              onPress={() => setActiveTab('details')}
            >
              <Text style={[styles.tabText, activeTab === 'details' && styles.activeTabText]}>
                Details
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'ingredients' && styles.activeTab]}
              onPress={() => setActiveTab('ingredients')}
            >
              <Text style={[styles.tabText, activeTab === 'ingredients' && styles.activeTabText]}>
                Ingredients
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'instructions' && styles.activeTab]}
              onPress={() => setActiveTab('instructions')}
            >
              <Text style={[styles.tabText, activeTab === 'instructions' && styles.activeTabText]}>
                Instructions
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Tab Content */}
          {renderTabContent()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: '#B91C1C',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    color: 'white',
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    backgroundColor: '#B91C1C',
    paddingBottom: 30,
    alignItems: 'center',
  },
  burgerImage: {
    width: 280,
    height: 280,
    borderRadius: 140,
    resizeMode: 'cover',
    borderWidth: 8,
    borderColor: 'white',
  },
  infoSection: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingTop: 30,
    paddingHorizontal: 20,
    flex: 1,
  },
  burgerName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  burgerCategory: {
    fontSize: 16,
    color: '#B91C1C',
    textAlign: 'center',
    marginBottom: 30,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 25,
    padding: 4,
    marginBottom: 25,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#B91C1C',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  activeTabText: {
    color: 'white',
  },
  tabContent: {
    paddingBottom: 30,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 25,
    textAlign: 'center',
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F9FAFB',
    borderRadius: 15,
    padding: 20,
  },
  metaItem: {
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  easyText: {
    color: '#059669',
  },
  mediumText: {
    color: '#D97706',
  },
  hardText: {
    color: '#B91C1C',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    color: '#B91C1C',
    fontSize: 16,
    marginRight: 4,
  },
  ratingValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bullet: {
    fontSize: 16,
    color: '#B91C1C',
    marginRight: 12,
    marginTop: 2,
  },
  listText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    flex: 1,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#B91C1C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  instructionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    flex: 1,
  },
});

export default BurgerDetailScreen;