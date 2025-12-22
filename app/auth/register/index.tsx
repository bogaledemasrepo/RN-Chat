import { API_URL } from '@/constants';
import { useAuth } from '@/context/auth-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Checkbox } from 'expo-checkbox';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SignUp = () => {
const [isChecked, setChecked] = useState(false);
  const [isSeret,setIsSecret]=useState(true)
  const [email,setEmail]=useState("")
  const [name,setName]=useState("")
  const [password,setPassword]=useState("")
  const [error,setError]=useState({email:"",password:"",name:""})
  const {handleSetUser,handleTost}=useAuth();
  const handlerSubmit=()=>{
        if(name=="") setError((prev)=>{
      return {...prev,name:"Name is required!"}
    /// VALIDATE
  })
    if(email=="") setError((prev)=>{
      return {...prev,email:"Email is required!"}
    /// VALIDATE
  })
        if(password.length < 6) setError((prev)=>{
      return {...prev,password:password==""?"Passowrd is required!":"Passowrd must be longer!"}
    /// VALIDATE
   
  })
   if(!email && !password && !name) return;

    fetch(`${API_URL}/auth/register`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify({name,email,password})
     }).then(res=>{
    if(!res.ok) handleTost("Something went wrrong!","error",3000)
      return res.json();
  }).then(data=>{
    console.log(data.token)
    AsyncStorage.setItem("authToken",data.token||"")
    handleSetUser({...data.user,token:data.token})
  })
 
}
  const handleEmailChange=(text: string)=>{
    setError({email:"",password:"",name:""})
    setEmail(text)
  }
    const handleNameChange=(text: string)=>{
    setError({email:"",password:"",name:""})
    setName(text)
  }
  const handlePasswordChange=(text: string)=>{
    setError({email:"",password:"",name:""})
    setPassword(text)
  }
  return (<SafeAreaView style={styles.container}>
    <View style={{width:"100%"}}>
    <View style={{width:"100%",display:"flex",justifyContent:"space-between",flexDirection:"row",alignItems:"center",marginBottom:16}}>
      <MaterialCommunityIcons name='arrow-left' size={24} color={"#3183ff"} />
      <Text style={{fontSize:24,fontWeight:900,color:"#3183ff"}}>Smart Chat App</Text>
      <Text></Text>
    </View>
    <View style={{width:"100%",borderRadius:12,backgroundColor:"#fff",padding:16,paddingVertical:8}}>
          <View style={{width:"100%",display:"flex",justifyContent:"center",flexDirection:"column",marginVertical:12}}>
            <Text style={{fontSize:16,fontWeight:700,color:"#8a8a8a9a",textAlign:"center"}}>Create New Account</Text>
          </View>

    <View style={{gap:16}}>
      <View style={[{width:"100%",gap:2}]}>
          <View style={[styles.border,{borderColor:error.email?"#ff6060c4":"#c7c7c7ff",height:48,width:"100%",backgroundColor:error.email?"#ff933b1a":"#f8f7f7ff",display:"flex",flexDirection:"row",alignItems:"center"}]}>
            <MaterialCommunityIcons name='account' size={24} color={"#c7c7c7ff"} />
            <TextInput onChangeText={handleNameChange} style={{flex:1}} placeholder='Name' />
          </View>
          {error.name &&
           <View style={{display:"flex",marginHorizontal:16}}>
            <Text style={{color:"#ff61619a",fontSize:12,textAlign:"center"}}>{error.name}</Text>
          </View>}
        </View>
        <View style={[{width:"100%",gap:2}]}>
          <View style={[styles.border,{borderColor:error.email?"#ff6060c4":"#c7c7c7ff",height:48,width:"100%",backgroundColor:error.email?"#ff933b1a":"#f8f7f7ff",display:"flex",flexDirection:"row",alignItems:"center"}]}>
            <MaterialCommunityIcons name='email' size={24} color={"#c7c7c7ff"} />
            <TextInput onChangeText={handleEmailChange} style={{flex:1}} placeholder='Email'/>
          </View>
          {error.email &&
           <View style={{display:"flex",marginHorizontal:16}}>
            <Text style={{color:"#ff61619a",fontSize:12,textAlign:"center"}}>{error.email}</Text>
          </View>}
        </View>
        <View style={[{width:"100%",gap:6}]}>
          <View style={[styles.border,{borderColor:error.password?"#ff6060c4":"#c7c7c7ff",height:48,width:"100%",backgroundColor:error.password?"#ff933b1a":"#f8f7f7ff",display:"flex",flexDirection:"row",alignItems:"center"}]}>
            <MaterialCommunityIcons name='lock' size={24} color={"#c7c7c7ff"} />
            <TextInput onChangeText={handlePasswordChange} secureTextEntry={!isSeret} placeholder='Password' style={{flex:1}}/>
            <MaterialCommunityIcons onPress={()=>setIsSecret(!isSeret)} name={isSeret?'eye':'eye-off'} size={24} color={"#c7c7c7ff"} />
          </View>{
            error.password &&
           <View style={{display:"flex",marginHorizontal:16}}>
            <Text style={{color:"#ff61619a",fontSize:12,textAlign:"center"}}>{error.password}</Text>
          </View>
          }
        </View>
        <View style={[{width:"100%",display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center"}]}>
        <View style={styles.section}>
          <Checkbox style={styles.checkbox} value={isChecked} onValueChange={setChecked} />
          <Text style={styles.paragraph}>Accept Terms and Policies.</Text>
        </View>
        </View>
        </View>
    <TouchableOpacity onPress={handlerSubmit} style={[styles.border,{height:48,width:"100%",backgroundColor:"#3183ff",display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center"}]}>
      <Text style={{color:"#fff"}}>{"Register"}</Text>
    </TouchableOpacity>
    <View style={{width:"100%",marginBottom:12}}>
      <Text style={{textAlign:"center",color:"#8a8a8a9a"}}>Or Sign In With</Text>
    </View>
      <View style={{width:"100%",display:"flex",flexDirection:"row",justifyContent:"space-evenly"}}>
          <TouchableOpacity style={[styles.border,{height:40,width:40,backgroundColor:"#d0e3ffff",display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center"}]}>
            <MaterialCommunityIcons name='facebook' size={16} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.border,{height:40,width:40,backgroundColor:"#d0e3ffff",display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center"}]}>
             <MaterialCommunityIcons name='google' size={16} />
          </TouchableOpacity>
            <TouchableOpacity style={[styles.border,{height:40,width:40,backgroundColor:"#d0e3ffff",display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center"}]}>
             <MaterialCommunityIcons name='apple' size={16} />
          </TouchableOpacity>
    </View>
   </View>
   </View>
</SafeAreaView>
  )
}

export default SignUp

const styles = StyleSheet.create({
  container:{
    backgroundColor:"#e9ecf4",
    flex:1,
    padding:12
  },
  border:{
    borderWidth:1,
    color:"#eeeeee9a",
    borderColor:"#c7c7c7ff",
    borderRadius:8,
    paddingHorizontal:12
  },
    section: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paragraph: {
    fontSize: 14,
    color:"#8a8a8a9a"
  },
  checkbox: {
    margin: 8,
  },
})