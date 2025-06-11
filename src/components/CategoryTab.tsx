import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

interface CategoryTabProps {
  category: string;
  isActive: boolean;
  onPress: (category: string) => void;
}

const CategoryTab: React.FC<CategoryTabProps> = ({ category, isActive, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.tab, isActive && styles.activeTab]}
      onPress={() => onPress(category)}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, isActive && styles.activeText]}>
        {category}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tab: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 12,
  },
  activeTab: {
    backgroundColor: "#8B0000",
    borderColor: '#B91C1C',
  },
  text: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  activeText: {
    color: 'white',
  },
});

export default CategoryTab;