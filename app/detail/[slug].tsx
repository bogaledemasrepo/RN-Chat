import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ChatBubble from '@/components/BeautifullChatBabel';
import { useAuth } from '@/context/auth-context';
import { db } from '@/firebase.config';

// --- Types ---
interface Message {
  senderId: string;
  text: string;
  id: string;
  time: string;
}

// --- Firebase Helpers ---
async function sendMessage(chatId: string, senderId: string, text: string) {
  const batch = writeBatch(db);
  const messageRef = doc(collection(db, "chats", chatId, "messages"));
  const now = new Date();

  batch.set(messageRef, {
    senderId,
    text,
    timestamp: now,
  });

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

async function createOneOnOneChat(chatName: string, chatId: string) {
  const memberIds = chatId.split('_').sort();
  const chatRef = doc(db, "chats", chatId);

  try {
    await setDoc(chatRef, {
      memberIds: memberIds,
      isGroupChat: false,
      lastMessageText: "Start chat",
      lastMessageTimestamp: new Date(),
      title: chatName,
    }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error creating chat:", error);
    return false;
  }
}

const Detail = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [isYourFriend, setIsYourFriend] = useState(false);
  const [newChatName, setNewChatName] = useState("");
  
  const { user, handleTost } = useAuth();
  const { slug } = useLocalSearchParams();
  const chatId = slug as string;

  const flatListRef = useRef<FlatList>(null);

  // 1. Check if chat exists on mount
  useEffect(() => {
    if (!chatId) return;

    getDoc(doc(db, "chats", chatId))
      .then((docSnap) => {
        if (docSnap.exists()) {
          setIsYourFriend(true);
        }
      })
      .catch((err) => console.log("Fetch error:", err));
  }, [chatId]);

  // 2. Real-time Message Listener
  useEffect(() => {
    if (!chatId || !isYourFriend) return;

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesUpdated: Message[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          senderId: data.senderId,
          text: data.text,
          time: data.timestamp ? (data.timestamp as Timestamp).toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
        };
      });
      setMessages(messagesUpdated);
    });

    return () => unsubscribe(); // Correct cleanup
  }, [chatId, isYourFriend]);

  const handleSendMessage = async () => {
    if (chatId && user?.id && message.trim()) {
      const currentMsg = message;
      setMessage(""); // Clear input immediately for UX
      try {
        await sendMessage(chatId, user.id, currentMsg);
      } catch (e) {
        handleTost("Failed to send message", "error", 2000);
      }
    }
  };

  const startChat = async () => {
    if (!newChatName.trim()) {
      return handleTost("Chat name is required", "error", 3000);
    }
    if (user?.id && chatId) {
      const success = await createOneOnOneChat(newChatName, chatId);
      if (success) setIsYourFriend(true);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: isYourFriend ? "Chat" : "New Chat" }} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
        keyboardVerticalOffset={90}
      >
        <View style={styles.mainContainer}>
          {isYourFriend ? (
            <>
              <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                renderItem={({ item }) => (
                  <ChatBubble 
                    message={item.text} 
                    timestamp={item.time} 
                    isLeft={item.senderId !== user?.id} 
                  />
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
              
              <View style={styles.inputWrapper}>
                <TextInput 
                  value={message} 
                  onChangeText={setMessage} 
                  placeholder="Type a message..."
                  multiline 
                  style={styles.textInput} 
                />
                <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
                  <Text style={{ color: "#fff", fontWeight: 'bold' }}>Send</Text>
                  <MaterialCommunityIcons name='send-circle-outline' size={24} color={"#fff"} />
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.setupContainer}>
              <Text style={styles.label}>Enter Chat Name to start:</Text>
              <TextInput 
                value={newChatName} 
                onChangeText={setNewChatName} 
                placeholder="Friend's Name"
                style={styles.textInput} 
              />
              <TouchableOpacity onPress={startChat} style={styles.startChatButton}>
                <Text style={{ color: "#fff", fontWeight: 'bold' }}>Start Chat</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
      <StatusBar barStyle="dark-content" />
    </SafeAreaView>
  );
};

export default Detail;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  mainContainer: {
    flex: 1,
    padding: 8,
  },
  inputWrapper: {
    gap: 8,
    marginTop: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#bdbdbd",
    borderRadius: 8,
    padding: 12,
    maxHeight: 100,
    backgroundColor: '#f9f9f9',
  },
  sendButton: {
    height: 48,
    width: "100%",
    backgroundColor: "#3183ff",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  setupContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 15,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  startChatButton: {
    height: 48,
    backgroundColor: "#3183ff",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});


// import ChatBubble from '@/components/BeautifullChatBabel';
// import { useAuth } from '@/context/auth-context';
// import { db } from '@/firebase.config';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { useLocalSearchParams } from 'expo-router';
// import { collection, doc, getDoc, onSnapshot, orderBy, query, setDoc, writeBatch } from 'firebase/firestore';


// import React, { useEffect, useRef, useState } from 'react';
// import { FlatList, KeyboardAvoidingView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// async function sendMessage(chatId:string, senderId:string, text:string) {
//   const batch = writeBatch(db); // Use a batch for atomicity

//   const messageRef = doc(collection(db, "chats", chatId, "messages")); // Auto-generated ID
//   const now = new Date();

//   // 1. Add the new message to the messages subcollection
//   batch.set(messageRef, {
//     senderId: senderId,
//     text: text,
//     timestamp: now,
//   });

//   // 2. Update the parent chat document (denormalization)
//   const chatRef = doc(db, "chats", chatId);
//   batch.update(chatRef, {
//     lastMessageText: text,
//     lastMessageTimestamp: now,
//   });

//   try {
//     await batch.commit();
//   } catch (error) {
//     console.error("Error sending message:", error);
//     throw error;
//   }
// }

// function getChatMessagesQuery(chatId:string) {
//   return query(
//     collection(db, "chats", chatId, "messages"),
//     orderBy("timestamp", "asc")
//   );
//   // Use this query with onSnapshot() to listen for new messages in real-time.
// }

// async function createOneOnOneChat(chatName:string,chatId:string) {
//   // Create a unique, sorted Chat ID
//   const memberIds = chatId.split('_').sort();

//   const chatRef = doc(db, "chats", chatId);

//   try {
//     await setDoc(chatRef, {
//       memberIds: memberIds,
//       isGroupChat: false,
//       lastMessageText: "Start chat",
//       lastMessageTimestamp: new Date(),
//       title: chatName, // You would use names in a real app
//     }, { merge: true }); // Use merge to prevent overwriting if it exists
    
//     return true;
//   } catch (error) {
//     console.error("Error creating chat:", error);
//     return false;
//   }
// }

// const Detail = () => {
//   const [messages,setMessages]=useState<{senderId:string,text:string,id:string,time:string}[]>([])
//   const [message,setMessage]=useState("")
//   const [isYourFriend,setIsYourFriend]=useState(false);
//   const {user,handleTost}=useAuth();
//   const {slug}= useLocalSearchParams();
//   const [newChatName,setNewChatName]=useState("")
//    // Create a unique, sorted Chat ID
//   const chatId =slug as string; 

//   const flatListRef = useRef<FlatList>(null); 

//  const scrollToEnd = () => {
//     if (flatListRef.current) {
//       flatListRef.current.scrollToEnd({ animated: true });
//     }
//   };

//    useEffect(()=>{
//     const q = query(
//     collection(db, "chats", chatId, "messages"),
//     orderBy("timestamp", "asc")
//   );
//   // query(collection(db, "messages"), where("id", "==", slug));
//     const unsub = onSnapshot(q, (querySnapshot) => {
//       let messagesUpdated=[] as {senderId:string,text:string,id:string,time:string}[];
//         querySnapshot.docs.forEach((doc) => {
//           // Iterate over the documents in the new snapshot
//           const {senderId,text,timestamp}=doc.data()
//           messagesUpdated=[...messagesUpdated,{senderId,text,id:doc.id,time:timestamp? `${timestamp.toDate().toLocaleTimeString()}`:""}]
//         });
//         setMessages(messagesUpdated)
//          scrollToEnd()
//           // You can also inspect document changes (ADDED, MODIFIED, REMOVED)
//           return unsub;
//       },);
//    return unsub;
//    },[])
//  useEffect(()=>{
//     getDoc(doc(db, "chats", chatId)).then(docSnap=>{
//       if (docSnap.exists()) {
//         // const chatData = docSnap.data();
//         // const id = docSnap.id;
//         // return { id, ...chatData };
//         setIsYourFriend(true)
//       } else {
//         console.log("No such chat document!");
//         return null;
//       }
//     }).catch(err=>console.log(err))
//  },[])
//  const startChat=()=>{
//   if(!newChatName) handleTost("Chat name is required","error",3000)
//    if(user?.id && slug) createOneOnOneChat(newChatName,slug as string).then(res=>{
//     if(res == true) return setIsYourFriend(true)
//       return;
//    })
//  }
//  const handleSendMessage=()=>{
//   if(chatId && user?.id && message){
//    sendMessage(chatId,user?.id,message);
//    setMessage("")
//    return;
//   } 
//   return console.log("something went wrong")

//  }
// console.log("Messages:",messages)
//   return (<SafeAreaView style={{flex:1,backgroundColor:"#fff"}}>
//             <View style={{height:"100%",backgroundColor:"333",display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:8}}>
//              <KeyboardAvoidingView behavior='padding'>
//              {isYourFriend && <>
//              <FlatList
//                    data={messages}
//                    keyExtractor={(item) => item.id}
//                    renderItem={({ item }) => (
//                      <ChatBubble message={item.text} timestamp={item.time} isLeft={item.senderId != user?.id} />
//                    )}
//                  />
//                  <View style={{position:"relative"}}>
//                   <TextInput value={message} onChangeText={setMessage} multiline style={{borderWidth:2,borderColor:"#bdbdbdff",borderRadius:8,padding:12}} />
//                   <TouchableOpacity onPress={handleSendMessage} style={[styles.border,{borderColor:"#d8d8d8ff",height:48,width:"100%",backgroundColor:"#3183ff",display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center",gap:8}]}>
//                     <Text style={{color:"#fff"}}>Send</Text>
//                     <MaterialCommunityIcons style={{}} name='send-circle-outline' size={24} color={"#ffffffff"} />
//                   </TouchableOpacity>
//                 </View></>
//                  }
            
//               {!isYourFriend && <View>
//                 <TextInput value={newChatName} onChangeText={setNewChatName} multiline style={{borderWidth:2,borderColor:"#bdbdbdff",borderRadius:8,padding:12}} />
//                 <TouchableOpacity onPress={startChat} style={[styles.border,{borderColor:"#d8d8d8ff",height:48,width:"100%",backgroundColor:"#3183ff",display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center"}]}>
//                   <Text style={{color:"#fff"}}>Start Chat</Text>
//                 </TouchableOpacity>
//                 </View>
//               }
//               </KeyboardAvoidingView>
//             </View>
            
//           <StatusBar animated barStyle={"default"} />
//           </SafeAreaView>)
// }

// export default Detail


// const styles = StyleSheet.create({
//   border:{
//     borderWidth:1,
//     color:"#eeeeee9a",
//     borderRadius:8,
//     paddingHorizontal:12
//   },
//   container: {
//     flex: 1,
//   },
//   inner: {
//     padding: 24,
//     flex: 1,
//     justifyContent: 'space-around',
//   },
//   textInput: {
//     height: 40,
//     borderColor: '#000000',
//     borderBottomWidth: 1,
//     marginBottom: 36,
//   },
// })