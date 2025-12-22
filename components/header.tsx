import { useAuth } from '@/context/auth-context'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import React from 'react'
import { StatusBar, Text, View } from 'react-native'

const Header = () => {
const {user}= useAuth();
  return (
    <View style={{
        position:"absolute",
        top:0,
        left:0,
        right:0,
        zIndex:999,
        paddingTop:StatusBar.currentHeight,
        borderBottomRightRadius:24,
        borderBottomLeftRadius:24,
        display:"flex",
        backgroundColor:"#0077ffff",
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between",
        borderWidth:1,
        borderColor:"#e9e7e7ff"
        }}>
        <View style={{display:"flex",flexDirection:"row",alignItems:"flex-end"}}>
            <View style={{
            width:60,
            height:60,
            display:"flex",
            borderRadius:60,
            margin:4,
            borderWidth:2,
            borderColor:"#fff",
            overflow:"hidden"}}>
                {user?.avator?<Image style={{width:"100%",height:"100%"}} contentPosition={"center"} contentFit='fill' source={{uri:user.avator}} /> :
                <Image source={require("@/assets/images/icon.png")} /> }
            </View>
            <Text style={{fontSize:14,margin:4,fontWeight:"bold",textAlign:"center",color:"#fff"}}>{user?.name||"Unknoun User"}</Text>
        </View>
        <View style={{paddingHorizontal:8}}>
        <Ionicons name="notifications-outline" size={28} color="#fff" />
        </View>
    </View>
  )
}

export default Header