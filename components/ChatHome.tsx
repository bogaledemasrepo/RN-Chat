import { Feather } from '@expo/vector-icons';
import React from 'react';
import {
    FlatList,
    Image,
    StyleSheet, Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock Data for the Chat List
const CHATS = [
  { id: '1', name: 'Alisa Hearth', message: 'The new designs look amazing!', time: '10:25 AM', unread: 2, online: true, image: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', name: 'Ben Thompson', message: 'Are we still meeting at 5?', time: 'Yesterday', unread: 0, online: true, image: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', name: 'Design Team', message: 'Draft_v2.pdf attached', time: 'Yesterday', unread: 5, online: false, image: 'https://i.pravatar.cc/150?u=3' },
  { id: '4', name: 'Kira Vance', message: 'I’ll send the invoice over tonight.', time: 'Monday', unread: 0, online: false, image: 'https://i.pravatar.cc/150?u=4' },
];

const ChatIndex = () => {

  const renderChatItem = ({ item }:{ item: any }) => (
    <TouchableOpacity style={styles.chatCard}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.image }} style={styles.avatar} />
        {item.online && <View style={styles.onlineDot} />}
      </View>
      
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.chatTime}>{item.time}</Text>
        </View>
        <View style={styles.chatFooter}>
          <Text style={styles.lastMessage} numberOfLines={1}>{item.message}</Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Styled Header (Similar to your reference) */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Feather name="menu" size={24} color="#1A1A1A" />
          <Text style={styles.headerTitle}>Messages</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconBtn}>
              <Feather name="search" size={22} color="#1A1A1A" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Image source={{ uri: 'https://i.pravatar.cc/150?u=me' }} style={styles.profilePic} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 2. Chat List */}
      <FlatList
        data={CHATS}
        keyExtractor={(item) => item.id}
        renderItem={renderChatItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <Text style={styles.sectionTitle}>Recent Chats</Text>
        )}
      />

      {/* 3. Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <Feather name="plus" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    paddingHorizontal: 12,
    paddingVertical: 15,
    backgroundColor: '#FFF',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { marginLeft: 15 },
  profilePic: { width: 35, height: 35, borderRadius: 12, backgroundColor: '#EEE' },
  
  listContent: { paddingHorizontal: 12, paddingBottom: 100 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#A0A0A0', textTransform: 'uppercase', marginVertical: 20, letterSpacing: 1 },
  
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: { position: 'relative' },
  avatar: { width: 60, height: 60, borderRadius: 12 },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4ADE80',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  chatInfo: { flex: 1, marginLeft: 15 },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  userName: { fontSize: 17, fontWeight: '700', color: '#1A1A1A' },
  chatTime: { fontSize: 12, color: '#A0A0A0' },
  chatFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lastMessage: { fontSize: 14, color: '#666', flex: 1, marginRight: 10 },
  unreadBadge: {
    backgroundColor: '#7D01FF', // Your purple accent
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#7D01FF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#7D01FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  }
});

export default ChatIndex;