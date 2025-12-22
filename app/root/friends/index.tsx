import Header from '@/components/header';
import { API_URL } from '@/constants';
import { useAuth } from '@/context/auth-context';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const Explore = () => {
  const {user}=useAuth();
  const [users,setUsers]=useState<{
        id: string;
        name: string;
        email: string;
        avator:string;
    }[]>([]);
  
    const RenderChatItem = ({ item }:{ item: {
        id: string;
        name: string;
        email: string;
        avator:string;
    } }) => {
      const handleNaviate=()=>{
        router.navigate({
            pathname: "/root/friends/[slug]",
            params: { slug: [user?.id.trim(), item.id].sort().join('_') }
          }
        )
      }
      return (<>
    <TouchableOpacity style={styles.chatCard} onPress={handleNaviate}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: item.avator }} style={styles.avatar} />
          </View>
          
          <View style={styles.chatInfo}>
            <View style={styles.chatHeader}>
              <Text style={styles.userName}>{item.name}</Text>
              {/* <Text style={styles.chatTime}>{new Date(item.timestamp).toLocaleTimeString()}</Text> */}
            </View>
            <View style={styles.chatFooter}>
               <Text style={styles.lastMessage} numberOfLines={1}>{item.email}</Text>
              {/*
              {2 > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{2}</Text>
                </View>
              )} */}
            </View>
          </View>
        </TouchableOpacity>
        </>)};

  useEffect(()=>{
    fetch(`${API_URL}/users/explore`,{
      method:"GET",
      headers:{
        "Authorization":"Bearer "+user?.token
      }
    }).then(res=>{
      return res.json()
    }).then(data=>{
      setUsers(data.data)
    })
  },[]) 
  return (<SafeAreaView style={{flex:1,paddingHorizontal:4,backgroundColor:"#fff"}}>
            <Header />
              <View style={{marginTop:76}}></View>
              <FlatList
                data={users}
                renderItem={({item})=>(
                  <RenderChatItem item={item} />
            )}/>
        <View style={{height:80}}></View>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
    chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: { position: 'relative' },
  avatar: { width: 60, height: 60, borderRadius: 8 },
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
  userName: { fontSize: 16, fontWeight: '600', color: '#1A1A1A' },
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

export default Explore;