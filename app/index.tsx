import CustomButton from '@/components/cutom-btn'
import { router } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const IndexScreen = () => {
  const navigateToAuthScreen=()=>{
    router.navigate("/auth/login")
  }
  return (<SafeAreaView style={styles.container}>
      <View style={styles.hero}></View>
      <Text style={styles.text1}>Wellcome to chat application</Text>
      <CustomButton label='Get Started' onPress={navigateToAuthScreen} />
    </SafeAreaView>
  )
}

export default IndexScreen


const styles = StyleSheet.create({
  container:{
    flex:1,
    paddingHorizontal:12,
    paddingVertical:8
  },
  hero:{
    width:"100%",
    height:"40%",
    backgroundColor:"#eee",
    borderRadius:12
  },
  text1:{
    fontSize:20,
    textAlign:"center",
    color:"#597fa3ff",
    marginVertical:12
  }
})