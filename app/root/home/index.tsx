import Header from '@/components/header';
import RenderChatItem from '@/components/RenderChatItem';
import { API_URL } from '@/constants';
import { useAuth } from '@/context/auth-context';
import { Chat } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const Home = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [refreshing, setRefreshing] = useState(false); // Start false, trigger in useEffect
  const { user } = useAuth();

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/users/friends`, {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + user?.token
        }
      });
      const data = await response.json();
      setChats(data.data);
    } catch (error) {
      console.error("Error fetching chats:", error);
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
        data={chats}
        keyExtractor={(item) => item.id.toString()} // Good practice to add a key
        ListHeaderComponent={() => (
          <>
            <Header />
            <View>
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={24} color="#c0c0c0ff" />
                  <TextInput style={{ flex: 1 }} placeholder='Search' />
                </View>
            </View>
          </>
        )}
        renderItem={({ item }) => (
          <View style={styles.chatItemWrapper}>
            <RenderChatItem item={item} />
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
    marginBottom: 8
  }
})
export default Home