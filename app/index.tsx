import { MaterialCommunityIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Index = () => {
  setTimeout(()=>{
    router.navigate("/auth/login")
  },3000)
  return (<SafeAreaView style={styles.continer}>
          <View style={styles.hero}>
            <MaterialCommunityIcons name='chat' size={96} color={"#fff"} />
            <Text style={styles.label}>Wellcome to RN-Chat</Text>
          </View>
        <StatusBar style='auto'/>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  continer:{
    flex:1,
    backgroundColor:"#2252acff",
    display:"flex",
    alignItems:"center",
    justifyContent:"center"
  },
  hero:{
    width:"100%",
    display:"flex",
    flexDirection:"column",
    alignItems:"center",
    justifyContent:"center"
  },
  label:{
    fontSize:24,
    fontWeight:"bold",
    color:"#fff"
  }
})
export default Index