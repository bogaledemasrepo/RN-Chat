import { useAuth } from '@/context/auth-context';
import { db } from '@/firebase.config';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { collection, doc, getDoc, onSnapshot, orderBy, query, setDoc, writeBatch } from 'firebase/firestore';


import React, { useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

async function sendMessage(chatId:string, senderId:string, text:string) {
  const batch = writeBatch(db); // Use a batch for atomicity

  const messageRef = doc(collection(db, "chats", chatId, "messages")); // Auto-generated ID
  const now = new Date();

  // 1. Add the new message to the messages subcollection
  batch.set(messageRef, {
    senderId: senderId,
    text: text,
    timestamp: now,
  });

  // 2. Update the parent chat document (denormalization)
  const chatRef = doc(db, "chats", chatId);
  batch.update(chatRef, {
    lastMessageText: text,
    lastMessageTimestamp: now,
  });

  try {
    await batch.commit();
    console.log("Message sent and chat updated successfully.");
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

function getChatMessagesQuery(chatId:string) {
  return query(
    collection(db, "chats", chatId, "messages"),
    orderBy("timestamp", "asc")
  );
  // Use this query with onSnapshot() to listen for new messages in real-time.
}

async function createOneOnOneChat(userId1:string, userId2:string) {
  // Create a unique, sorted Chat ID
  const memberIds = [userId1, userId2].sort();
  const chatId = memberIds.join('_'); 

  const chatRef = doc(db, "chats", chatId);

  try {
    await setDoc(chatRef, {
      memberIds: memberIds,
      isGroupChat: false,
      lastMessageText: "Chat created.",
      lastMessageTimestamp: new Date(),
      title: `${userId1} & ${userId2} Chat`, // You would use names in a real app
    }, { merge: true }); // Use merge to prevent overwriting if it exists
    
    return true;
  } catch (error) {
    console.error("Error creating chat:", error);
    return false;
  }
}

const Detail = () => {
  const [messages,setMessages]=useState<{senderId:string,text:string,id:string}[]>([])
  const [message,setMessage]=useState("")
  const [isYourFriend,setIsYourFriend]=useState(false);
  const {user}=useAuth();
  const {slug}= useLocalSearchParams();
   // Create a unique, sorted Chat ID
  const memberIds = [user?.id, slug].sort();
  const chatId = memberIds.join('_'); 

   useEffect(()=>{
    const q = query(
    collection(db, "chats", chatId, "messages"),
    orderBy("timestamp", "asc")
  );
  // query(collection(db, "messages"), where("id", "==", slug));
    const unsub = onSnapshot(q, (querySnapshot) => {
      let messagesUpdated=[] as {senderId:string,text:string,id:string}[];
        querySnapshot.docs.forEach((doc) => {
          // Iterate over the documents in the new snapshot
          const {senderId,text}=doc.data()
          messagesUpdated=[...messagesUpdated,{senderId,text,id:doc.id}]
        });
        console.log(messagesUpdated)
        setMessages(messagesUpdated)
          // You can also inspect document changes (ADDED, MODIFIED, REMOVED)
          return unsub;
      },);
   return unsub;
   },[])
 useEffect(()=>{
    getDoc(doc(db, "chats", chatId)).then(docSnap=>{
      if (docSnap.exists()) {
        // const chatData = docSnap.data();
        // const id = docSnap.id;
        // return { id, ...chatData };
        setIsYourFriend(true)
      } else {
        console.log("No such chat document!");
        return null;
      }
    }).catch(err=>console.log(err))
 },[])
 const startChat=()=>{
   if(user?.id && slug) createOneOnOneChat(user?.id,slug as string).then(res=>{
    if(res == true) return setIsYourFriend(true)
      return;
   })
 }
 const handleSendMessage=()=>{
  if(chatId && user?.id && message){
   sendMessage(chatId,user?.id,message);
   setMessage("")
   return;
  } 
  return console.log("something went wrong")

 }
  const scrollViewRef = useRef<ScrollView>(null); 

  // This function is called every time the content size changes.
  const handleContentSizeChange = () => {
    // scrollToEnd() scrolls to the bottom for vertical, or right for horizontal.
    scrollViewRef.current?.scrollToEnd({ animated: false }); 
  };
  return (<>
  <SafeAreaView>
            <View style={{height:"100%",backgroundColor:"333",display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:8}}>
             {isYourFriend && 
              <KeyboardAvoidingView behavior='padding'>
                <FlatList
                  data={messages}
                  renderItem={({item})=> <View  style={{borderWidth:1,marginVertical:4, borderColor:"#ddddddff",borderRadius:8,padding:12}}>
                    <Text>{item.text}</Text>
                    </View>}
                  keyExtractor={item => item.id}
                  // inverted={true} // Inverts the scroll direction and display order
                  style={{bottom:0}}
                  bounces
                  scrollEnabled
                  scrollsToTop
                />
                <View style={{position:"relative"}}>
                    <TextInput value={message} onChangeText={setMessage} multiline style={{borderWidth:2,borderColor:"#bdbdbdff",borderRadius:8,padding:12}} />
                    <TouchableOpacity onPress={handleSendMessage} style={[styles.border,{borderColor:"#d8d8d8ff",height:48,width:"100%",backgroundColor:"#3183ff",display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center",gap:8}]}>
                      <Text style={{color:"#fff"}}>Send</Text>
                      <MaterialCommunityIcons style={{}} name='send-circle-outline' size={24} color={"#ffffffff"} />
                    </TouchableOpacity>
                </View>
           
                <View style={{height:20}}>
                </View>
              </KeyboardAvoidingView>
              }
              {!isYourFriend && 
                <TouchableOpacity onPress={startChat} style={[styles.border,{borderColor:"#d8d8d8ff",height:48,width:"100%",backgroundColor:"#3183ff",display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center"}]}>
                  <Text style={{color:"#fff"}}>Start Chat</Text>
                </TouchableOpacity>
              }
              <View style={{height:32}}></View>
            </View>
            
          </SafeAreaView>
          <StatusBar animated barStyle={"default"} />
          </>)
}

export default Detail


const styles = StyleSheet.create({
  border:{
    borderWidth:1,
    color:"#eeeeee9a",
    borderRadius:8,
    paddingHorizontal:12
  },
  container: {
    flex: 1,
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: 'space-around',
  },
  textInput: {
    height: 40,
    borderColor: '#000000',
    borderBottomWidth: 1,
    marginBottom: 36,
  },
})