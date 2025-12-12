import { useAuth } from '@/context/auth-context';
import { db } from '@/firebase.config';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { collection, doc, getDoc, onSnapshot, orderBy, query, setDoc, writeBatch } from 'firebase/firestore';


import React, { useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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

async function createOneOnOneChat(chatName:string,chatId:string) {
  // Create a unique, sorted Chat ID
  const memberIds = chatId.split('_').sort();

  const chatRef = doc(db, "chats", chatId);

  try {
    await setDoc(chatRef, {
      memberIds: memberIds,
      isGroupChat: false,
      lastMessageText: "Start chat",
      lastMessageTimestamp: new Date(),
      title: chatName, // You would use names in a real app
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
  const {user,handleTost}=useAuth();
  const {slug}= useLocalSearchParams();
  const [newChatName,setNewChatName]=useState("")
   // Create a unique, sorted Chat ID
  const chatId =slug as string; 

  const flatListRef = useRef<FlatList>(null); 

 const scrollToEnd = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

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
        setMessages(messagesUpdated)
         scrollToEnd()
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
  if(!newChatName) handleTost("Chat name is required","error",3000)
   if(user?.id && slug) createOneOnOneChat(newChatName,slug as string).then(res=>{
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

  return (<>
            <View style={{height:"100%",backgroundColor:"333",display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:8}}>
             {isYourFriend && 
              <KeyboardAvoidingView behavior='padding'>
                <FlatList
                  data={messages}
                  ref={flatListRef} // Attach the ref
                  renderItem={({item})=> <View  style={{borderWidth:1,marginVertical:4, borderColor:"#ddddddff",borderRadius:8,padding:12}}>
                    <Text>{item.text}</Text>
                    </View>}
                  keyExtractor={item => item.id}
                  // inverted={true} // Inverts the scroll direction and display order
                  style={{bottom:4}}
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
              {!isYourFriend && <View>
                <TextInput value={newChatName} onChangeText={setNewChatName} multiline style={{borderWidth:2,borderColor:"#bdbdbdff",borderRadius:8,padding:12}} />
                <TouchableOpacity onPress={startChat} style={[styles.border,{borderColor:"#d8d8d8ff",height:48,width:"100%",backgroundColor:"#3183ff",display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center"}]}>
                  <Text style={{color:"#fff"}}>Start Chat</Text>
                </TouchableOpacity>
                </View>
              }
              <View style={{height:32}}></View>
            </View>
            
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