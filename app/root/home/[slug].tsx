import { useAuth } from '@/context/auth-context'
import { db } from '@/firebase.config'
import { useLocalSearchParams } from 'expo-router'
import { collection, doc, DocumentData, getDoc, getDocs } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Detail = () => {
  const [messages,setMessages]=useState<DocumentData[]>([])
  const {user}=useAuth();
 const {slug}= useLocalSearchParams();
  const memberIds = [user?.id, slug].sort();
  const chatId = memberIds.join('_'); 
     async function fetchMessages(chatID:string) {
       const messagesRef = collection(db, 'messages',chatID);
       const messages = await getDocs(messagesRef);
       const messagesList = messages.docs.map(doc => doc.data());
       if(messagesList.length > 0) setMessages(messagesList)
   }


   async function fetchChat() {
     console.log("RUN RUN")
       const userRef = doc(db, 'users',chatId);
       const user = await getDoc(userRef);
        console.log(user)
      //  const userList = userSnapshot.docs.map(doc => doc.data());
       if(user.exists()){
        const slectedUSer=user.data()
          console.log(slectedUSer,"SELECTED USER")
       }
        console.log("RUN RUN 1")

       const chatRef = doc(db, 'chats',chatId);
       const chat = await getDoc(chatRef);
      //  const userList = userSnapshot.docs.map(doc => doc.data());
       if(chat.exists()){
          fetchMessages(chatId)
       }
   }

   useEffect(()=>{
   
     fetchChat();
   },[])
 
  return (<SafeAreaView>
    <View>
      <Text>Detail</Text>
    </View>
    </SafeAreaView>
  )
}

export default Detail