import { Stack } from 'expo-router'
import React from 'react'

const AuthLayout =() => {
  return (
    <Stack>
        <Stack.Screen name='login' />
        <Stack.Screen name='register' />
    </Stack>
  )
}

export default AuthLayout