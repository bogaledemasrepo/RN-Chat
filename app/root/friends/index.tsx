import { useAuth } from '@/context/auth-context';
import { db } from '@/firebase.config';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const Explore = () => {
  const {user}=useAuth();
  const [users,setUsers]=useState<{
        id: string;
        name: string;
        email: string;
    }[]>([]);
  async function exploreUsers() {
      const usersCol = collection(db, 'users');
      const userSnapshot = await getDocs(usersCol);
      const userList = userSnapshot.docs.map(doc =>{
        const {id,name,email}= doc.data();return {id,name,email} as {id:string,name:string,email:string}
      });
      setUsers(userList);
  }
  useEffect(()=>{
    exploreUsers();
  },[])
  return (<SafeAreaView style={{flex:1}}>
    <View style={{width:"98%",borderRadius:4,marginHorizontal:"1%",height:56,display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"space-between",borderWidth:1,borderColor:"#e9e7e7ff"}}>
          <View style={{display:"flex",flexDirection:"row",alignItems:"flex-end"}}>
          <View style={{width:48,height:48,display:"flex",borderRadius:4,borderWidth:1,borderColor:"#ccccccff"}}></View>
              <Text style={{fontSize:14,margin:8,fontWeight:"bold",textAlign:"center",color:"#b4b4b4ff"}}>{user?.name||"Unknoun User"}</Text>
          </View>
          <View>
            <Ionicons name="notifications-outline" size={24} color="#858585ff" />
          </View>
        </View>
   
        <FlatList data={users} contentContainerStyle={{padding:"1%",gap:4}} renderItem={({item})=>(
          <Link  href={{
            pathname: "/detail/[slug]",
            params: { slug: [user?.id.trim(), item.id].sort().join('_') }
          }}>
          <View style={{width:"100%",borderRadius:4,display:"flex",borderWidth:1,borderColor:"#d3d3d3ff",padding:4,flexDirection:"row",justifyContent:"space-between"}}>
           <View style={{display:"flex",flexDirection:"row"}}>
            <View style={{height:48,width:48,borderRadius:'100%',borderWidth:1,borderColor:"#e9e7e7ff"}}></View>
            <View style={{height:48,display:"flex",justifyContent:"space-between",padding:4,alignItems:"flex-start"}}>
              <Text style={{fontSize:10,color:"#b4b4b4ff",textAlign:"center"}}>{item.name.length>12?item.name.slice(0,12)+"...":item.name}</Text>
               <Text style={{fontSize:10,color:"#b4b4b4ff",textAlign:"center"}}> Last message!</Text>
            </View>
            </View> 
            <View style={{height:48,display:"flex",justifyContent:"space-between"}}>
            </View>
          </View>
          </Link>)} />
          <View style={{height:80}}></View>
    </SafeAreaView>
  )
}

export default Explore;