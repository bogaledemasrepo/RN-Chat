
import BeautifulInput from '@/components/BeatifullInput';
import BeautifulCard from '@/components/BeautifullCard';
import AnimatedHeader from '@/components/BeautifullHeader';
import CustomButton from '@/components/cutom-btn';
import BeautifulDropdown from '@/components/DropDown';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const colors = [
  { label: 'Red', value: 'red' },
  { label: 'Blue', value: 'blue' },
  { label: 'Green', value: 'green' },
  { label: 'Yellow', value: 'yellow' },
];
const chatData = [
  { id: '1', text: 'Hey, how is the app coming along?', time: '10:00 AM', me: false },
  { id: '2', text: 'Going great! Just finished the chat bubbles.', time: '10:02 AM', me: true },
];
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>([]);
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined
  );

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));

    if (Platform.OS === 'android') {
      Notifications.getNotificationChannelsAsync().then(value => setChannels(value ?? []));
    }
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);
const navigateToAuthScreen=()=>{
  router.navigate("/auth/login")
}
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const [selectedColor, setSelectedColor] = useState('blue');
const handleSelected=(value:string|number)=>{
  setSelectedColor(value as string);
}
  return (<SafeAreaView style={{flex:1}}>
   
    <ScrollView contentContainerStyle={{ flexGrow: 1,width:"100%" }}>
      <AnimatedHeader />
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        {/* <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text> */}
      </View>
  <CustomButton label='Get Started' onPress={navigateToAuthScreen} />
      <Button
        title="Press to schedule a notification"
        onPress={async () => {
          await schedulePushNotification();
        }}
      />
      <View style={{ flex: 1, padding: 20, backgroundColor: '#F0F0F0',width:"100%" }}>
      
      {/* Required 'label' prop */}
      <BeautifulInput
        label="Username"
        placeholder="e.g., john.doe@mail.com"
        keyboardType="email-address" // TypeScript checks this prop!
        value={username}
        onChangeText={setUsername}
      />

      <BeautifulInput
        label="Password"
        placeholder="Enter your secret key"
        secureTextEntry={true} // TypeScript checks this prop!
        value={password}
        onChangeText={setPassword}
      />

     <View style={{ width: '100%', backgroundColor: '#F0F0F0' }}>
      <BeautifulDropdown 
        label="Favorite Color"
        items={colors}
        selectedValue={selectedColor}
        onValueChange={handleSelected}
      />
      <Text>Your selection: {selectedColor}</Text>
    </View>
    <View style={{ width: '100%', backgroundColor: '#F0F0F0' }}>
    <BeautifulCard 
      title="Exploring the Swiss Alps"
      description="Discover the hidden gems of the mountains with our guided tours and breathtaking views."
      imageUri="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0"
      tag="Travel"
      onPress={() => console.log('Card Pressed')}
    />
    </View>
    </View>
    
    </ScrollView>
    </SafeAreaView>
  );
}

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Here is the notification body',
      data: { data: 'goes here', test: { test1: 'more data' } },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 2,
    },
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('myNotificationChannel', {
      name: 'A channel is needed for the permissions prompt to appear',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    // EAS projectId is used here.
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error('Project ID not found');
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(token);
    } catch (e) {
      token = `${e}`;
    }

  return token;
}

