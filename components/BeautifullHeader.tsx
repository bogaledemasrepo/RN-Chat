import React, { useRef } from 'react';
import {
    Animated,
    Dimensions,
    StatusBar,
    StyleSheet,
    Text,
    View
} from 'react-native';

const { width } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = 90;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const AnimatedHeader = () => {
  const scrollY = useRef(new Animated.Value(0)).current;

  // 1. Animate Header Height
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  // 2. Animate Image Opacity
  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 1, 0],
    extrapolate: 'clamp',
  });

  // 3. Animate Title Scale/Position
  const titleScale = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  });

  const titleTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -40],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Animated.ScrollView
        contentContainerStyle={{ paddingTop: HEADER_MAX_HEIGHT }}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false } // Height/Padding don't support native driver
        )}
      >
        {/* Placeholder Content */}
        <View style={styles.scrollContent}>
          {Array.from({ length: 20 }).map((_, i) => (
            <View key={i} style={styles.contentBlock}>
              <Text style={styles.contentText}>Item {i + 1}</Text>
            </View>
          ))}
        </View>
      </Animated.ScrollView>

      {/* Animated Header */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Animated.Image
          source={{ uri: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b' }}
          style={[styles.headerBackground, { opacity: imageOpacity }]}
        />
        <Animated.View 
          style={[
            styles.headerTitleContainer, 
            { transform: [{ scale: titleScale }, { translateY: titleTranslateY }] }
          ]}
        >
          <Text style={styles.headerTitle}>Mountain Odyssey</Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F7' },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1a1a1a',
    overflow: 'hidden',
    zIndex: 10,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: HEADER_MAX_HEIGHT,
    resizeMode: 'cover',
  },
  headerTitleContainer: {
    position: 'absolute',
    bottom: 16,
    left: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  scrollContent: {
    padding: 20,
  },
  contentBlock: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  contentText: { color: '#333', fontSize: 16 },
});

export default AnimatedHeader;