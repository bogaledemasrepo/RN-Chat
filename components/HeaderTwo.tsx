import React from 'react';
import {
  Animated,
  StyleSheet, Text,
  View
} from 'react-native';
// Note: You would typically use @expo/vector-icons or react-native-vector-icons
import { Feather, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CategoryHeader() {

  return (
    <SafeAreaView>
      <Animated.View style={[styles.headerContainer, { width: "100%" }]}>
        
        <View style={styles.topRow}>
          <View style={styles.leftSection}>
            <Feather name="menu" size={24} color="#333" />
            <Text style={styles.headerTitle}>Categories</Text>
          </View>
          <View style={styles.rightSection}>
            <View>
                <Ionicons name="notifications-outline" size={24} color="#333" />
                <View style={styles.dot} />
            </View>
            <Feather name="shopping-bag" size={24} color="#333" style={{ marginLeft: 20 }} />
          </View>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    alignSelf: 'center',
    zIndex: 10,
    padding: 12,
    justifyContent: 'center',
    // Shadow for elevation
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: '700', marginLeft: 15, color: '#4a4a68' },
  rightSection: { flexDirection: 'row', alignItems: 'center' },
  dot: {
    position: 'absolute',
    top: 0, right: 0,
    width: 8, height: 8,
    backgroundColor: '#FF3B30',
    borderRadius: 4,
    borderWidth: 1, borderColor: 'white'
  },
  categoryScroll: { paddingVertical: 5 },
  categoryBtn: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    backgroundColor: '#f1f2f6',
    borderRadius: 4,
    marginRight: 10,
  },
  activeBtn: { backgroundColor: '#7F00FF' },
  categoryText: { fontWeight: '600', color: '#4a4a68' },
  activeText: { color: 'white' },
  dummyContent: { height: 1000, marginHorizontal: 20 }
});