import { Stack } from 'expo-router'
import React from 'react'

function OthersLayout() {
  return (
    <Stack>
        <Stack.Screen name='notifications' />
    </Stack>
  )
}

export default OthersLayout