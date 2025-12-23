import Header from '@/components/header';
import { API_URL } from '@/constants';
import { useAuth } from '@/context/auth-context';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Move interface outside for cleanliness
interface UserItem {
  id: string;
  name: string;
  email: string;
  avator: string;
}

const RenderChatItem = ({ item }: { item: UserItem }) => {
  const handleNavigate = () => {
    router.navigate({
      pathname: "/root/friends/[slug]",
      params: { slug: item.id }
    });
  };

  return (
    <TouchableOpacity style={styles.chatCard} onPress={handleNavigate}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.avator }} style={styles.avatar} />
      </View>
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.userName}>{item.name}</Text>
        </View>
        <View style={styles.chatFooter}>
          <Text style={styles.lastMessage} numberOfLines={1}>{item.email}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const Explore = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Unified fetch function
  const fetchExploreUsers = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/users/explore`, {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + user?.token
        }
      });
      const data = await response.json();
      setUsers(data.data || []);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setRefreshing(false);
    }
  }, [user?.token]);

  // Initial load
  useEffect(() => {
    setRefreshing(true);
    fetchExploreUsers();
  }, [fetchExploreUsers]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchExploreUsers();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      {/* Spacer to handle the Header height if it's absolute positioned */}
      
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RenderChatItem item={item} />}
        contentContainerStyle={{ paddingHorizontal: 4 }}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            colors={['#7D01FF']} // Android spinner color
            tintColor={'#7D01FF'} // iOS spinner color
          />
        }
        ListEmptyComponent={
            !refreshing ? <Text style={styles.emptyText}>No users found</Text> : null
        }
      />
      
      <View style={{ height: 140 }} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8
  },
  avatarContainer: { position: 'relative' },
  avatar: { width: 60, height: 60, borderRadius: 8 },
  chatInfo: { flex: 1, marginLeft: 15 },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  userName: { fontSize: 16, fontWeight: '600', color: '#1A1A1A' },
  chatFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lastMessage: { fontSize: 14, color: '#666', flex: 1, marginRight: 10 },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#A0A0A0' }
});

export default Explore;