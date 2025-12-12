import { useAuth } from '@/context/auth-context';
import { db } from '@/firebase.config';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { collection, DocumentData, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const Home = () => {
  const {user}=useAuth();
  const [chats,setChats]=useState<DocumentData[]>([]);
async function getChats() {
    // 1. Define the query
    const chatsCol = query(
      collection(db, 'chats'),
      // Assuming 'user?.id' holds the current user's ID string
      where("memberIds", "array-contains", user?.id) 
    );

    // 2. Execute the query
    const chatSnapshot = await getDocs(chatsCol);

    // 3. Map the documents and convert the Timestamp
    const chatList = chatSnapshot.docs.map(doc => {
      const data = doc.data();
      
      // Check if lastMessageTimestamp exists and has the toDate method
      if (data.lastMessageTimestamp && typeof data.lastMessageTimestamp.toDate === 'function') {
        data.lastMessageTimestamp = `${data.lastMessageTimestamp.toDate()}`;
      }
      
      return {...data,id:doc.id};
    });
    
    // 4. Update the state
    setChats(chatList);
  }
  useEffect(()=>{
    getChats();
  },[])
  return (<SafeAreaView style={{flex:1,paddingHorizontal:4}}>
    <View style={{width:"100%",borderRadius:4,height:56,display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"space-between",borderWidth:1,borderColor:"#e9e7e7ff"}}>
          <View style={{display:"flex",flexDirection:"row",alignItems:"flex-end"}}>
          <View style={{width:48,height:48,display:"flex",borderRadius:4,borderWidth:1,borderColor:"#ccccccff"}}></View>
              <Text style={{fontSize:14,margin:8,fontWeight:"bold",textAlign:"center",color:"#b4b4b4ff"}}>{user?.name||"Unknoun User"}</Text>
          </View>
          <View>
            <Ionicons name="notifications-outline" size={24} color="#858585ff" />
          </View>
        </View>
        
        {/* <View style={{padding:8}}>
          <View style={{width:"100%",height:42,borderRadius:8,backgroundColor:"#eee",borderWidth:1,borderColor:"#ccccccff",display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"space-between",paddingHorizontal:4}}>
            <Ionicons name="search" size={28} color="#858585ff" />
            <TextInput style={{flex:1}} placeholder='search' />
            <AntDesign name="scan" size={24}  color="#858585ff" />
          </View>
        </View> */}
          <FlatList
            data={chats}
            renderItem={({item})=>(
            <Link  href={{
                        pathname: "/detail/[slug]",
                        params: { slug: item.id }}}
             style={{width:"100%",marginVertical:2,backgroundColor:"#fff", borderRadius:4,display:"flex",borderWidth:1,borderColor:"#ecececff",padding:4,flexDirection:"row",justifyContent:"space-between"}}>
            <View style={{display:"flex",flexDirection:"row",gap:4}}>
              <View style={{height:48,width:48,borderRadius:'100%',borderWidth:1,borderColor:"#e9e7e7ff"}}></View>
              <View style={{height:48,display:"flex",flexDirection:"column",justifyContent:"space-between",padding:4,alignItems:"flex-start"}}>
                <Text style={{fontSize:10,color:"#b4b4b4ff",textAlign:"center"}}>{item.title.length < 16? item.title:`${item.title.slice(0,12)}...`}</Text>
                <Text style={{fontSize:10,color:"#b4b4b4ff",textAlign:"center"}}>{item.lastMessageText}</Text>
              </View>
              </View> 
              <View style={{height:48,display:"flex",justifyContent:"space-between"}}>
                <Text style={{fontSize:10,color:"#b4b4b4ff",textAlign:"center"}}>{item.lastMessageTimestamp.split(" ").slice(0,4).join(" ")}</Text>
                {/* <Ionicons name="checkmark-done" size={24} color="#858585ff" /> */}
              </View>
              
            </Link>)} />
          <View style={{height:80}}></View>
    </SafeAreaView>
  )
}

export default Home