import AuthProvider from '@/context/auth-context';
import { HelperProvider } from '@/context/use-helper';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';




const _layout = () => {

  // Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});
  return (<HelperProvider>
  <AuthProvider>
      <Stack screenOptions={{headerShown:false}}>
        <Stack.Screen name='index' />
        <Stack.Screen name='root' />
        <Stack.Screen name='auth' />
        <Stack.Screen name='detail/[slug]' />
      </Stack>
    </AuthProvider>
    </HelperProvider>
  )
}

export default _layout