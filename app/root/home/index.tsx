import Header from '@/components/header';
import RenderChatItem from '@/components/RenderChatItem';
import { API_URL } from '@/constants';
import { useAuth } from '@/context/auth-context';
import { Chat } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { FlatList, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Home = () => {
  const [chats,setChats]=useState<Chat[]>([]);
  const {user}=useAuth()
  useEffect(()=>{
    fetch(`${API_URL}/users/friends`,{
      method:"GET",
      headers:{
        "Authorization":"Bearer "+user?.token
      }
    }).then(res=>{
      return res.json()
    }).then(data=>{
      setChats(data.data)
    })
  },[]) 
  return (
          <SafeAreaView style={{flex:1,paddingHorizontal:4,backgroundColor:"#fff"}}>
            <Header />
              <View style={{marginTop:76}}>
                <View style={{
                  width:"100%",
                  height:48,
                  borderRadius:4,
                  backgroundColor:"#fff",
                  borderWidth:1,
                  borderColor:"#eee",
                  display:"flex",
                  flexDirection:"row",
                  alignItems:"center",
                  justifyContent:"space-between",
                  paddingHorizontal:8,
                  marginBottom:4
                  }}>
                  <Ionicons name="search" size={24} color="#c0c0c0ff" />
                  <TextInput style={{flex:1}} placeholder='Search' />
                  
                </View>
              </View>
          <FlatList
            refreshing
            data={chats}
            renderItem={({item})=>(
            <View  style={{borderWidth:1,borderColor:"#eee",padding:8,borderRadius:8}}>
              {<RenderChatItem item={item} />}
            </View>
          )}/>
          <View style={{height:80}}></View>
    </SafeAreaView>
  )
}



export default Home