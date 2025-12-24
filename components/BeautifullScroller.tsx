import React from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');
const ITEM_SIZE = 140; // Size of the square image
const SPACING = 10;

const DATA = [
  { id: '1', image: 'https://picsum.photos/id/10/300/300' },
  { id: '2', image: 'https://picsum.photos/id/11/300/300' },
  { id: '3', image: 'https://picsum.photos/id/12/300/300' },
  { id: '4', image: 'https://picsum.photos/id/13/300/300' },
  { id: '5', image: 'https://picsum.photos/id/14/300/300' },
  { id: '6', image: 'https://picsum.photos/id/15/300/300' },
];

const HorizontalGrid = () => {
  const renderItem = ({ item }: { item: typeof DATA[0] }) => (
    <TouchableOpacity activeOpacity={0.8} style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Gallery</Text>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        horizontal
        nestedScrollEnabled={true} // Crucial for Android inside ScrollView
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#444',
    marginBottom: 12,
  },
  listContent: {
    paddingRight: 20, 
  },
  card: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    marginRight: SPACING,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#ddd',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default HorizontalGrid;