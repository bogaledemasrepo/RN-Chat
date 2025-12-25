import React, { useRef } from 'react';
import {
    Animated,
    Dimensions,
    PanResponder,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const Sethings = () => {
  // Initial position: just below the screen
  const translateY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        // Only allow dragging downwards
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        // If dragged down more than 150px, close it (not implemented here for simplicity)
        // Otherwise, spring back to top
        if (gestureState.dy > 150) {
          Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT,
            duration: 300,
            useNativeDriver: true,
          }).start();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            friction: 5,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
      <Animated.View 
        style={[styles.modal, { transform: [{ translateY }] }]}
        {...panResponder.panHandlers}
      >
        {/* The Drag Handle */}
        <View style={styles.handle} />
        
        <View style={[]}>
          <Text style={styles.title}>Modern Sheet</Text>
          <Text style={styles.description}>
            Swipe down on this modal to feel the smooth physics-based movement.
          </Text>
          
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Confirm Action</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6366f1',
    justifyContent: 'flex-end',
  },
  modal: {
    height: SCREEN_HEIGHT * 0.4,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#6366f1',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  }
});

export default Sethings;