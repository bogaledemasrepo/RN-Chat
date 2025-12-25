import NotificationAction from '@/components/NotificationAction';
import { API_URL } from '@/constants';
import { useAuth } from '@/context/auth-context';
import { RequestNotification } from '@/types';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Notifications = () => {
  const [friendRequesits, setFriendRequesits] = useState<RequestNotification[]>([]);
  const [refreshing, setRefreshing] = useState(false); // Start false, trigger in useEffect

  const { user } = useAuth();

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/requests`, {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + user?.token
        }
      });
      const data = await response.json();
      console.log(data)
      setFriendRequesits(data.requests);
    } catch (error) {
      console.error("Error fetching requesits:", error);
    } finally {
      setRefreshing(false); // Ensure spinner stops
    }
  };

  // Initial Load
  useEffect(() => {
    setRefreshing(true); // Show spinner on mount
    fetchData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData(); // Now this correctly waits for the fetch to complete
  };
  

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 4, backgroundColor: "#fff" }}>
      <FlatList
        refreshing={refreshing}
        onRefresh={handleRefresh}
        data={friendRequesits}
        keyExtractor={(item) => item.id.toString()} // Good practice to add a key
        renderItem={({ item }) => (
          <View style={styles.chatItemWrapper}>
                <NotificationAction item={item} />        
          </View>
        )}
      />
      <View style={{ height: 80 }}></View>
    </SafeAreaView>
  );
};

// Moving styles out of the render for better performance
const styles = StyleSheet.create({
  searchContainer: {
    width: "100%",
    height: 48,
    borderRadius: 4,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    marginBottom: 4
  },
  chatItemWrapper: {
    borderWidth: 1,
    borderColor: "#eee",
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    display:"flex",
    flexDirection:"row",
    gap:8
  },
})
export default Notifications
