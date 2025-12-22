import { Chat } from '@/types';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const RenderChatItem = ({ item }:{ item: Chat }) =>{
    const handlePress=()=>{
        router.navigate({
            pathname:"/detail/[slug]",
            params:{slug:item.id}
        })
    }
    return (
    <TouchableOpacity style={styles.chatCard} onPress={handlePress}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.friendDetail.avator }} style={styles.avatar} />
        {item.isUnread && <View style={styles.onlineDot} />}
      </View>
      
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.userName}>{item.friendDetail.name}</Text>
          <Text style={styles.chatTime}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
        </View>
        <View style={styles.chatFooter}>
          <Text style={styles.lastMessage} numberOfLines={1}>{item.latestMessage}</Text>
          {2 > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{2}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
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
  unreadText: { color: 'white', fontSize: 10, fontWeight: 'bold' }
});

export default RenderChatItem