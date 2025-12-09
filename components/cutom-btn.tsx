import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'

const CustomButton = ({label,onPress}:{label:string,onPress:()=>void}) => {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress}>
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  )
}

export default CustomButton

const styles = StyleSheet.create({
    btn:{
        borderWidth:2,
        borderColor:'#87b6ebff',
        padding:12,
        backgroundColor:'#87b6ebcc',
        borderRadius:8
    },
    text:{
      textAlign:"center",
      color:"#333"
    }
})