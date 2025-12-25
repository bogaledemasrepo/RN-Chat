import { API_URL } from "@/constants";
import { useAuth } from "@/context/auth-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, Stack } from "expo-router";
import { useCallback, useEffect } from "react";

export default function AuthLayout() {
  const {handleSetUser}=useAuth();
  const getUser=useCallback(()=> async () =>{
      const token =await AsyncStorage.getItem("authToken");
      if(token){
        fetch(`${API_URL}/profile/me`,{
          headers:{
          "Content-Type":"application/json",
          "Authorization":`Bearer ${token}`
          }
        
        }).then(res=>{
              if(!res.ok) throw new Error("Faild to auto login!");
              return res.json(); 
          }).then(data=>{
            console.log(data)
            handleSetUser({...data,token:token})
          }).catch(err=>console.log(err))
      }
    },[handleSetUser]);
  const {user}=useAuth();
  useEffect(()=>{
    if(user) return router.navigate("/root/home");
     getUser();
  },[user,getUser]) 
  return <Stack screenOptions={{headerShown:false}}>
    <Stack.Screen name="login/index" />
    <Stack.Screen name="register/index" />
  </Stack>;
}
 