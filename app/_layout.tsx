import AuthProvider from '@/context/auth-context'
import { Stack } from 'expo-router'
import React from 'react'

const _layout = () => {
  return (<AuthProvider>
    <Stack screenOptions={{headerShown:false}}>
      <Stack.Screen name='index' />
      <Stack.Screen name='root' />
      <Stack.Screen name='auth' />
      <Stack.Screen name='detail/[slug]' />
    </Stack>
    </AuthProvider>
  )
}

export default _layout