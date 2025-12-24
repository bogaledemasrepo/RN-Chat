import { Stack } from 'expo-router'
import React from 'react'

const ExploreLayout = () => {
  return (
    <Stack screenOptions={{headerShown:false}}>
      <Stack.Screen name='index' />
      {/* <Stack.Screen name='[slug]' /> */}
    </Stack>
  )
}

export default ExploreLayout