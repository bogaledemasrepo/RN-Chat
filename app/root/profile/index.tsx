import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";

import HorizontalGrid from "@/components/BeautifullScroller";
import { API_URL } from "@/constants";
import { useAuth } from "@/context/auth-context";
import { Friend } from "@/types";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: windowWidth } = Dimensions.get("window");
const HEADER_MAX_HEIGHT = windowWidth;
const HEADER_MIN_HEIGHT = 100;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const Profile = () => {
  const [friend, setFriend] = useState<Friend>();
  const { user } = useAuth();
  const { slug } = useLocalSearchParams();
  const scrollY = useRef(new Animated.Value(0)).current;

  // 1. Border Radius Animation
  const borderRadius = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, HEADER_MIN_HEIGHT / 2], // Perfect circle at min height
    extrapolate: "clamp",
  });

  // 2. Header Height Animation
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  const fetchProfileDetail = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/users/friends/${user?.id}`, {
        method: "GET",
        headers: { Authorization: "Bearer " + user?.token },
      });
      const data = await response.json();
      setFriend(data);
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  }, [user?.token, user?.id]);

  useEffect(() => {
    fetchProfileDetail();
  }, [fetchProfileDetail]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <StatusBar style="auto" />

      {/* ANIMATED HEADER */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Animated.Image
          source={{ uri: friend?.avator }}
          style={[
            styles.headerImage,
            {
              width: headerHeight,
              height: headerHeight,
              borderRadius: borderRadius,
            },
          ]}
          resizeMode="cover"
        />
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: HEADER_MAX_HEIGHT }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <View style={styles.mainContent}>

          {/* User Info Card */}
          <View style={styles.card}>
            <Text style={styles.title}>{friend?.name || "Loading..."}</Text>
            <Text style={styles.bio}>{friend?.bio || "No bio available."}</Text>

            <View style={styles.divider} />

            <InfoRow icon="mail" text={friend?.email || user?.email} />
            <InfoRow
              icon="calendar"
              text={friend?.birthDate || "Jan 01, 1990"}
            />
          </View>
          <HorizontalGrid />
          <View style={{ height: 50 }} />
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};
const ActionButton = ({ icon, color, highlighted }: any) => (
  <View style={[styles.actionBtn, highlighted && styles.actionBtnActive]}>
    <Feather name={icon} size={24} color={highlighted ? color : "#333"} />
  </View>
);

const InfoRow = ({ icon, text }: any) => (
  <View style={styles.infoRow}>
    <Feather name={icon} size={18} color="#858585" />
    <Text style={styles.infoText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  headerImage: {
    backgroundColor: "#eee",
  },
  mainContent: {
    padding: 8,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  actionBtn: {
    width: "22%",
    height: 60,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnActive: {
    backgroundColor: "#fff0f0",
    borderColor: "#dab8b8",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  bio: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 15,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  infoText: { fontSize: 15, color: "#555" },
});

export default Profile;

// import ImageViewer from '@/components/ImageViewer'
// import { useAuth } from '@/context/auth-context'
// import { Feather, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'

// import React from 'react'
// import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
// import { SafeAreaView } from 'react-native-safe-area-context'

// const Profile = () => {
//   const {user,handleSetUser}=useAuth();
//   console.log(user)

//   return (<SafeAreaView style={{flex:1}}>
//           <ScrollView style={{padding:16}}>
//               <View style={{marginHorizontal:"auto",marginTop:24}}>
//               <ImageViewer imgSource={user?.avator}/>
//               </View>
//               <View style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
//                 <Text style={{fontSize:18,fontWeight:"bold"}}>{(user?.name)?user.name:'Unknoun User'}</Text>
//                 <View style={{display:"flex",gap:4,flexDirection:"row",alignItems:"center"}}>
//                   <Feather name="mail" size={20} color={"#858585ff"}  />
//                   <Text style={{fontSize:16,color:"#858585ff"}}>{user?.email??'bgdm@gmail.com'}</Text>
//                 </View>
//               </View>
//             <View style={{marginTop:16}}>
//               <View>
//                 <Text style={{fontSize:16,color:"#858585ff"}}>Personal Information</Text>
//               </View>
//               <View style={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginVertical:4}}>
//                 <Text>Email Address</Text>
//                 <View>
//                   <FontAwesome name="angle-right" size={20} color="#858585ff" />
//                 </View>
//               </View>
//               <View style={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginVertical:4}}>
//                 <Text>Name</Text>
//                 <View>
//                   <FontAwesome name="angle-right" size={20} color="#858585ff" />
//                 </View>
//               </View>
//             </View>
//             <View style={{width:"100%",height:1,backgroundColor:"#cacacaff",marginVertical:16}}></View>
//             <View>
//               <View>
//                 <Text style={{fontSize:16,color:"#858585ff"}}>Security</Text>
//               </View>
//               <View style={{display:"flex",flexDirection:"row",justifyContent:"space-between",marginVertical:8,alignItems:"center"}}>
//                 <Text>Change Password</Text>
//                   <FontAwesome name="angle-right" size={20} color="#858585ff" />
//               </View>
//             </View>
//             <View style={{width:"100%",height:1,backgroundColor:"#cacacaff",marginVertical:16}}></View>
//             <View>
//               <View>
//                 <Text style={{fontSize:16,color:"#858585ff"}}>Help & Support</Text>
//               </View>
//               <View style={{display:"flex",flexDirection:"row",justifyContent:"space-between",marginVertical:4,alignItems:"center"}}>
//                 <Text>About us</Text>
//                   <FontAwesome name="angle-right" size={20} color="#858585ff" />
//               </View>
//               <View style={{display:"flex",flexDirection:"row",justifyContent:"space-between",marginVertical:4,alignItems:"center"}}>
//                 <Text>Frequently asked quastions</Text>
//                   <FontAwesome name="angle-right" size={20} color="#858585ff" />
//               </View>
//               <View style={{display:"flex",flexDirection:"row",justifyContent:"space-between",marginVertical:4,alignItems:"center"}}>
//                 <Text>Submit feedback</Text>
//                   <FontAwesome name="angle-right" size={20} color="#858585ff" />
//               </View>
//              <Pressable
//                 style={[styles.button]}
//                 onPress={()=>{}}>
//                   <MaterialCommunityIcons name="logout" size={24} color="#d45252ff" />
//                 <Text style={(styles.text, styles.buttonText)}>Logout</Text>
//               </Pressable>
//             </View>
//             <Pressable
//                 style={[styles.button]}
//                 onPress={()=>handleSetUser(null)}>
//                   <MaterialCommunityIcons name="logout" size={24} color="#d45252ff" />
//                 <Text style={(styles.text, styles.buttonText)}>Logout</Text>
//               </Pressable>
//             <View style={{width:"100%",height:1,backgroundColor:"#cacacaff",marginVertical:36}}></View>
//         </ScrollView>
      
//     </SafeAreaView>
//   )
// }

// export default Profile

// const styles = StyleSheet.create({
//     button: {
//     backgroundColor: '#fff',
//     display:"flex",
//     flexDirection:"row",
//     alignItems: 'center',
//     justifyContent: 'center',
//     height: 42,
//     borderWidth:1,
//     borderColor:'#dbdadaff',
//     borderRadius: 4,
//     marginTop: 30,
//     flex:1,
//   },
//   buttonText: {
//     color: '#f17777ff',
//   },
//   text: {
//     fontSize: 16,
//     lineHeight: 21,
//     fontWeight: 'bold',
//     letterSpacing: 0.25,
//   },
// })