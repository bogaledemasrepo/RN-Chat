import { Stack } from 'expo-router'
import React from 'react'

const HomLayout = () => {
  return (
    <Stack screenOptions={{headerShown:false}}>
      <Stack.Screen name='index' />
      <Stack.Screen name='[slug]' />
    </Stack>
  )
}

export default HomLayout