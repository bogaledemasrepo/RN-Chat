import { API_URL } from "@/constants";
import { useAuth } from "@/context/auth-context";
import { RequestNotification } from "@/types";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ActionType = "accept" | "reject";

const NotificationAction = ({ item }: { item: RequestNotification }) => {
  const [loadingAction, setLoadingAction] = useState<ActionType | null>(null);
  const { user, handleTost } = useAuth();

  const handleRequest = async (action: ActionType) => {
    setLoadingAction(action);
    try {
      const response = await fetch(`${API_URL}/requests/${action}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.token}` 
        },
        body: JSON.stringify({ requestId: item.id }),
      });
      console.log(`${API_URL}/requests/${action}`,`Bearer ${user?.token}` ,JSON.stringify({ requestId: item.id }))
      if (!response.ok) throw new Error();
      handleTost(`Request ${action}ed!`, "success", 2000);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      handleTost(`Failed to ${action}`, "error", 2000);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <View style={styles.mainWrapper}>
      {/* 1. Avatar Section */}
      <Image
        source={{ uri: item.sender.avator || "" }}
        style={styles.avatar}
      />
      
      {/* 2. Middle Section (Name) - Forced to take remaining space */}
      <View style={styles.infoSection}>
        <Text style={styles.senderName} numberOfLines={1}>
          {item.sender.name || "Unknown User"}
        </Text>
        <Text style={styles.subText} numberOfLines={1}>
          Friend Request
        </Text>
      </View>

      {/* 3. Action Section (Buttons) */}
      <View style={styles.actionSection}>
        <TouchableOpacity
          onPress={() => handleRequest("reject")}
          disabled={!!loadingAction}
          style={[styles.btn, styles.rejectBtn]}
        >
          {loadingAction === "reject" ? (
            <ActivityIndicator size={16} color="#666" />
          ) : (
            <Feather name="x" size={18} color="#666" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleRequest("accept")}
          disabled={!!loadingAction}
          style={[styles.btn, styles.acceptBtn]}
        >
          {loadingAction === "accept" ? (
            <ActivityIndicator size={16} color="#fff" />
          ) : (
            <Feather name="check" size={18} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NotificationAction;

const styles = StyleSheet.create({
  mainWrapper: {
    width: '100%',             // Ensure it fills the screen width
    flexDirection: "row",      // Align Avatar, Info, and Actions in a row
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f0f0f0",
  },
  infoSection: {
    flex: 1,                   // TAKE ALL REMAINING MIDDLE SPACE
    marginHorizontal: 12,      // Space between avatar and buttons
    justifyContent: 'center',
  },
  senderName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
    flexShrink: 1,             // Prevents the name from pushing buttons out
  },
  subText: {
    fontSize: 12,
    color: "#888",
  },
  actionSection: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  btn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  rejectBtn: {
    borderColor: "#ddd",
    backgroundColor: "#f9f9f9",
  },
  acceptBtn: {
    backgroundColor: "#3183ff",
    borderColor: "#3183ff",
  },
});