import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';

interface CardProps {
  title: string;
  description: string;
  imageUri: string;
  tag?: string;
  onPress?: () => void;
  containerStyle?: ViewStyle;
}

const BeautifulCard: React.FC<CardProps> = ({ 
  title, 
  description, 
  imageUri, 
  tag, 
  onPress, 
  containerStyle 
}) => {
  return (
    <TouchableOpacity 
      activeOpacity={0.9} 
      onPress={onPress} 
      style={[styles.card, containerStyle]}
    >
      {/* Image Section */}
      <Image source={{ uri: imageUri }} style={styles.image} />
      
      {/* Content Section */}
      <View style={styles.content}>
        {tag && (
          <View style={styles.tagContainer}>
            <Text style={styles.tagText}>{tag.toUpperCase()}</Text>
          </View>
        )}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginVertical: 10,
    marginHorizontal: 20,
    // iOS Shadows
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    // Android Shadow
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 16,
  },
  tagContainer: {
    backgroundColor: '#E3F2FD',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  tagText: {
    color: '#1976D2',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default BeautifulCard;