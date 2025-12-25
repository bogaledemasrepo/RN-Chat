import { Stack } from 'expo-router'
import React from 'react'

const ProfileLayout = () => {
  return (
    <Stack screenOptions={{headerShown:false}}>
        <Stack.Screen name='index'/>
        <Stack.Screen 
          name='sethings' 
          options={{
            // This is the magic line for iOS/Android modals
            presentation: 'modal', 
            headerTitle: 'Settings',
            headerShown: true,
          }} 
        />
    </Stack>
  )
}

export default ProfileLayout