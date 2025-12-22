import Button from '@/components/button';
import { API_URL } from '@/constants';
import { useAuth } from '@/context/auth-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Index = () => {
  const {handleSetUser}=useAuth();
  useEffect(()=>{
    async function getUser() {
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
      }
   getUser()
  },[]) 
  return (<SafeAreaView style={styles.container}>
    <View>
      <Text>index</Text>
    </View>
    <Button onPress={() => router.navigate("/auth/login")} label={'Get started'} theme='primary'/>
    <StatusBar style='auto' />
  </SafeAreaView>)
}

const styles = StyleSheet.create({
  container:{
    flex:1 ,
    display:"flex",
    backgroundColor:"#0b1133ff",
    padding:16,
    alignItems:"center",
    justifyContent:"center",
    
  }
})

export default Index


