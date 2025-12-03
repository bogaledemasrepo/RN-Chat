// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import AsyncStorage from "@react-native-async-storage/async-storage";
// @ts-ignore: getReactNativePersistence exists in the RN bundle.
import { getReactNativePersistence, initializeAuth } from "firebase/auth";

// Your web app's Firebase configuration
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

export const auth = initializeAuth(app,{
    persistence:getReactNativePersistence(AsyncStorage)
})