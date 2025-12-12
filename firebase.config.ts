// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import AsyncStorage from "@react-native-async-storage/async-storage";
// @ts-ignore: getReactNativePersistence exists in the RN bundle.
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where,
  writeBatch
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDE_Vn83pTVyKfUxgcHXiNh5pBpkFuJXkU",
  authDomain: "chat-app-firebase-58eea.firebaseapp.com",
  projectId: "chat-app-firebase-58eea",
  storageBucket: "chat-app-firebase-58eea.firebasestorage.app",
  messagingSenderId: "560966211250",
  appId: "1:560966211250:web:a5b8aac02e5b13c496dbab"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// export const auth = initializeAuth(app)
export const auth = initializeAuth(app,{
    persistence:getReactNativePersistence(AsyncStorage)
})
export const db = getFirestore(app);

export async function createFriendship(myId:string, friendId:string, myName:string, friendName:string, status = 'accepted') {
  const batch = writeBatch(db); // Use a batch to ensure atomicity

  // 1. Write the friendship to the current user's subcollection
  const myFriendRef = doc(db, "users", myId, "friends", friendId);
  batch.set(myFriendRef, {
    friendId: friendId,
    name: friendName,
    status: status,
    addedAt: new Date(),
  });

  // 2. Write the reverse friendship to the friend's subcollection
  const friendFriendRef = doc(db, "users", friendId, "friends", myId);
  batch.set(friendFriendRef, {
    friendId: myId,
    name: myName,
    status: status,
    addedAt: new Date(),
  });

  try {
    await batch.commit();
    console.log("Friendship created/updated successfully.");
  } catch (error) {
    console.error("Error creating/updating friendship:", error);
    throw error;
  }
}

export function getMyFriends(userId:string) {
  // Returns a Query object you can use with onSnapshot or getDocs
  return collection(db, "users", userId, "friends");
}





export function getUserChatsQuery(userId:string) {
  return query(
    collection(db, "chats"),
    where("memberIds", "array-contains", userId),
    orderBy("lastMessageTimestamp", "desc")
  );
  // Use this query with onSnapshot() in your client to get the chat list.
}






// Get a list of cities from your database
export async function getUsers() {
  const usersCol = collection(db, 'users');
  const userSnapshot = await getDocs(usersCol);
  const userList = userSnapshot.docs.map(doc => doc.data());
  // const docRef = doc(db, "users", "userId");
  // const upDocRef=await updateDoc(docRef,{});
  // const docSnap = await getDoc(docRef);

  // if (docSnap.exists()) {
  //     console.log("Document data:", docSnap.data());
  // } else {
  //     console.log("No such document!");
  // }
  // console.log(userList,docSnap,upDocRef)
  // addDoc(usersCol,{
  //   uid:"jkdffioehfiehfseuisuefskjiissifhsi",
  //   email:"bbbbbbbbbbbbbbbbbbbbbbbbbbb@gmail.com",
  //   name:"NNNNNNNNNNNNNNNn NNNNNNNNNNNNNNNNNNNNNnn"
  // }).then(res=>console.log("Success",res)).catch(err=>console.log("Error",err))

  return userList;
}