import { useAuth } from "@/context/auth-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, Tabs } from "expo-router";
import { useEffect } from "react";

export default function TabsLayout() {
  const {user}=useAuth();
    useEffect(()=>{
      if(!user) router.navigate("/auth/login")
    },[user])
  return <Tabs screenOptions={{tabBarStyle:{
    position:"absolute",
    bottom:0,
    width:"100%"
  },headerShown:false}}>
    <Tabs.Screen name="home" options={{title:"Home",tabBarLabel:"Home",tabBarIcon:({color,focused,size})=><MaterialCommunityIcons name="home" color={color} size={size}/>}} />
    <Tabs.Screen name="friends/index" options={{title:"Friends",tabBarLabel:"Friends",tabBarIcon:({color,focused,size})=><MaterialCommunityIcons name="account-group" color={color} size={size}/>}} />
    <Tabs.Screen name="profile/index" options={{title:"Profile",tabBarLabel:"Profile",tabBarIcon:({color,focused,size})=><MaterialCommunityIcons name="account" color={color} size={size}/>}}/>
  </Tabs>;
}