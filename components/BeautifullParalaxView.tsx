import React, { useRef } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { StatusBar } from 'expo-status-bar';

const HEADER_MAX_HEIGHT = 240;
const HEADER_MIN_HEIGHT = 64;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const HEADER_MIN_WIDTH = 60;
// const HEADER_SCROLL_DISTANCE = HEADER_MAX_WIDTH - HEADER_MIN_WIDTH;

const ParallaxView = () => {
  const scrollY = useRef(new Animated.Value(0)).current;

  // 1. Header Width Animation
  const imageSize = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [200, HEADER_MIN_WIDTH],
    extrapolate: 'clamp',
  });

  // 2. Header Height Animation
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });
  // 2. Image scale animation (zoom on pull down)
  // const imageScale = scrollY.interpolate({
  //   inputRange: [-150, 0],
  //   outputRange: [2, 1],
  //   extrapolate: 'clamp',
  // });

  // 3. Image opacity animation (fade out on scroll up)
  // const imageOpacity = scrollY.interpolate({
  //   inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
  //   outputRange: [1, 1, 0],
  //   extrapolate: 'clamp',
  // });

  return (
    <View style={styles.container}>
      <StatusBar animated style='auto' />
      {/* Animated Header */}
      <Animated.View style={[styles.header, { height: headerHeight, width: "100%", marginHorizontal: "auto" }]}>
        <Animated.Image
          source={{ uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb' }}
          style={[
            styles.headerBackground,
            { width: imageSize, height: imageSize , borderRadius: 1000,},
          ]}
        />
      </Animated.View>
      <ScrollView
        contentContainerStyle={{ paddingTop: HEADER_MAX_HEIGHT }}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false } // Set to false because we are animating height
        )}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Main Content Area</Text>
          {[1,2,3,4,5,6].map((_, i) => (
            <View key={i} style={styles.card}>
              <Text>Item List Number {i + 1}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1,position:"relative", backgroundColor: '#f5f5f5' },
  header: {
    position: 'absolute',
    top: 0,
    overflow: 'hidden',
    backgroundColor: '#0a1e27be',
    zIndex: 10,
    display:"flex",
    justifyContent:"center",
    alignItems:"center",padding:4
  },
  headerBackground: {
    resizeMode: 'cover'
  },
  headerTitleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
  },
  content: { padding: 8 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 4,
    marginBottom: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
});

export default ParallaxView;