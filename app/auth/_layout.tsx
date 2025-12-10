import { useAuth } from "@/context/auth-context";
import { router, Stack } from "expo-router";
import { useEffect } from "react";

export default function AuthLayout() {
  const {user}=useAuth();
  useEffect(()=>{
    if(user) router.navigate("/root/home")
  },[user])
  return <Stack screenOptions={{headerShown:false}}>
    <Stack.Screen name="login/index" />
    <Stack.Screen name="register/index" />
  </Stack>;
}
