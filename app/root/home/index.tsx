import { useAuth } from '@/context/auth-context';
import { db } from '@/firebase.config';
import { Ionicons } from '@expo/vector-icons';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const Home = () => {
  const {user}=useAuth();
  const [users,setUsers]=useState([]);
  async function getMyFriends(userId:string) {
      const usersCol = collection(db, 'users', userId, "friends");
      const userSnapshot = await getDocs(usersCol);
      const userList = userSnapshot.docs.map(doc => doc.data());
      console.log(userList)
  }
  useEffect(()=>{
    getMyFriends(user?.id||"");
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
        
        {/* <View style={{padding:8}}>
          <View style={{width:"100%",height:42,borderRadius:8,backgroundColor:"#eee",borderWidth:1,borderColor:"#ccccccff",display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"space-between",paddingHorizontal:4}}>
            <Ionicons name="search" size={28} color="#858585ff" />
            <TextInput style={{flex:1}} placeholder='search' />
            <AntDesign name="scan" size={24}  color="#858585ff" />
          </View>
        </View> */}
        <FlatList data={[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]} contentContainerStyle={{padding:"1%",gap:4}} renderItem={()=>(
          <View style={{width:"100%",borderRadius:4,display:"flex",borderWidth:1,borderColor:"#d3d3d3ff",padding:4,flexDirection:"row",justifyContent:"space-between"}}>
           
           <View style={{display:"flex",flexDirection:"row"}}>
            <View style={{height:48,width:48,borderRadius:'100%',borderWidth:1,borderColor:"#e9e7e7ff"}}></View>
            <View style={{height:48,display:"flex",justifyContent:"space-between",padding:4}}>
              <Text style={{fontSize:10,color:"#b4b4b4ff",textAlign:"center"}}>Abebe Alenu</Text>
               <Text style={{fontSize:10,color:"#b4b4b4ff",textAlign:"center"}}> Last message!</Text>
            </View>
            </View> 
            <View style={{height:48,display:"flex",justifyContent:"space-between"}}>
              <Text style={{fontSize:10,color:"#b4b4b4ff",textAlign:"center"}}>2 Day ago</Text>
              <Ionicons name="checkmark-done" size={24} color="#858585ff" />
            </View>
            
          </View>)} />
          <View style={{height:80}}></View>
    </SafeAreaView>
  )
}

export default Home