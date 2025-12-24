import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";

import HorizontalGrid from "@/components/BeautifullScroller";
import { API_URL } from "@/constants";
import { useAuth } from "@/context/auth-context";
import { Friend } from "@/types";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: windowWidth } = Dimensions.get("window");
const HEADER_MAX_HEIGHT = windowWidth;
const HEADER_MIN_HEIGHT = 100;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const UserDetail = () => {
  const [friend, setFriend] = useState<Friend>();
  const { user } = useAuth();
  const { slug } = useLocalSearchParams();
  const scrollY = useRef(new Animated.Value(0)).current;

  // 1. Border Radius Animation
  const borderRadius = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, HEADER_MIN_HEIGHT / 2], // Perfect circle at min height
    extrapolate: "clamp",
  });

  // 2. Header Height Animation
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  const fetchFriend = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/users/friends/${slug}`, {
        method: "GET",
        headers: { Authorization: "Bearer " + user?.token },
      });
      const data = await response.json();
      setFriend(data);
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  }, [user?.token, slug]);

  useEffect(() => {
    fetchFriend();
  }, [fetchFriend]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <StatusBar style="auto" />

      {/* ANIMATED HEADER */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Animated.Image
          source={{ uri: friend?.avator }}
          style={[
            styles.headerImage,
            {
              width: headerHeight,
              height: headerHeight,
              borderRadius: borderRadius,
            },
          ]}
          resizeMode="cover"
        />
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: HEADER_MAX_HEIGHT }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <View style={styles.mainContent}>
          {/* Action Row */}
          <View style={styles.actionRow}>
            <ActionButton icon="phone-call" color="#e98181" highlighted />
            <ActionButton icon="message-square" color="#666" />
            <ActionButton icon="video" color="#666" />
            <ActionButton icon="mail" color="#666" />
          </View>

          {/* User Info Card */}
          <View style={styles.card}>
            <Text style={styles.title}>{friend?.name || "Loading..."}</Text>
            <Text style={styles.bio}>{friend?.bio || "No bio available."}</Text>

            <View style={styles.divider} />

            <InfoRow icon="mail" text={friend?.email || user?.email} />
            <InfoRow
              icon="calendar"
              text={friend?.birthDate || "Jan 01, 1990"}
            />
          </View>

          {/* Horizontal Gallery */}
          <HorizontalGrid />

          <View style={{ height: 50 }} />
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

// --- Helper Components ---

const ActionButton = ({ icon, color, highlighted }: any) => (
  <View style={[styles.actionBtn, highlighted && styles.actionBtnActive]}>
    <Feather name={icon} size={24} color={highlighted ? color : "#333"} />
  </View>
);

const InfoRow = ({ icon, text }: any) => (
  <View style={styles.infoRow}>
    <Feather name={icon} size={18} color="#858585" />
    <Text style={styles.infoText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  headerImage: {
    backgroundColor: "#eee",
  },
  mainContent: {
    padding: 8,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  actionBtn: {
    width: "22%",
    height: 60,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnActive: {
    backgroundColor: "#fff0f0",
    borderColor: "#dab8b8",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  bio: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 15,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  infoText: { fontSize: 15, color: "#555" },
});

export default UserDetail;
