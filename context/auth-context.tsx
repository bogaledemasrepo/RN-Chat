import { User } from "@/types";
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Added for icons
import React, { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

type ToastType = 'success' | 'error' | 'info';

interface AuthContextType {
  user: User | null;
  handleSetUser: (data: User | null) => void;
  handleTost: (title: string, type: ToastType, duration?: number) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const { width } = Dimensions.get('window');

// Helper to get icon name based on type
const getToastIcon = (type: ToastType): keyof typeof MaterialCommunityIcons.glyphMap => {
  switch (type) {
    case 'success': return 'check-circle';
    case 'error': return 'alert-circle';
    case 'info': return 'information';
    default: return 'bell';
  }
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [toast, setToast] = useState<{ title: string; type: ToastType }>({
    title: "",
    type: "info",
  });

  const translateY = useSharedValue(-150);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleTost = (title: string, type: ToastType, duration: number = 3000) => {
    setToast({ title, type });
    translateY.value = withSpring(60, { damping: 15, stiffness: 100 });

    setTimeout(() => {
      translateY.value = withSpring(-150);
    }, duration);
  };

  const handleSetUser = (data: User | null) => setUser(data);

  const value = useMemo(() => ({ user, handleSetUser, handleTost }), [user]);

  return (
    <AuthContext.Provider value={value}>
      {children}

      {/* Toast UI */}
      <Animated.View style={[styles.toastContainer, animatedStyle, styles[toast.type]]}>
        <View style={styles.toastContent}>
          <MaterialCommunityIcons 
            name={getToastIcon(toast.type)} 
            size={28} 
            style={styles[`text_${toast.type}`]} 
          />
          <View style={styles.textWrapper}>
            <Text style={[styles.toastText, styles[`text_${toast.type}`]]}>
              {toast.title}
            </Text>
          </View>
        </View>
      </Animated.View>
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export default AuthProvider;

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    top: 0,
    left: width * 0.05,
    width: width * 0.9,
    minHeight: 60,
    borderRadius: 16,
    backgroundColor: '#fff',
    zIndex: 9999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1.5,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  textWrapper: {
    flex: 1, // Ensures text wraps if it is too long
  },
  toastText: {
    fontSize: 15,
    fontWeight: "700",
  },
  // Color Themes
  success: { borderColor: "#27c43b", backgroundColor: "#f6fff7" },
  error: { borderColor: "#f85c5c", backgroundColor: "#fff6f6" },
  info: { borderColor: "#3183ff", backgroundColor: "#f6faff" },
  text_success: { color: "#1b8a29" },
  text_error: { color: "#d32f2f" },
  text_info: { color: "#1976d2" },
});