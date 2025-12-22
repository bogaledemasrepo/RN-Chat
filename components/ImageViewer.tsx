import { useAuth } from '@/context/auth-context';
import { db } from '@/firebase.config';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { doc, updateDoc } from 'firebase/firestore';
import React from 'react'; // Import useState
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import ProfileUpdate from './modal';

type Props = {
  imgSource: string|undefined;
};

export default function ImageViewer({ imgSource }: Props) {
   const {handleTost, user, setProfileUpdated} = useAuth(); // Assuming useAuth is correct
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], // Use the correct enum
      allowsEditing: true,
      quality: 0.7, 
    });

    if (result.canceled) {
      return;
    }
    const asset = result.assets[0];
    try {
        const form = new FormData();
        const fileExtension = asset.uri.split('.').pop();
        const mimeType = `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`;
        form.append('photos', {
            uri: asset.uri,
            type: mimeType,
            name: asset.fileName || `profile_photo.${fileExtension}`, // Ensure a name
        } as any);
        const response = await fetch('https://exp-server-collection.onrender.com/upload/freeuploadavator', {
            method: 'POST',
            body: form
        });

        if(!response.ok) {
            const errorText = await response.text();
            console.error("Server Response Error:", response.status, errorText);
            return handleTost(`Profile upload failed! Server status: ${response.status}`, "error", 5000);
        }

        const {url} = await response.json();
        const userRef = doc(db, "users", user?.id||"");
            try {
                await updateDoc(userRef, {
                    avator: url, 
                });

                console.log("Profile avator updated successfully in Firestore!");
                handleTost("Profile updated!", "success", 3000);
                setProfileUpdated(true)
            } catch (error) {
                console.error("Error updating user document:", error);
                handleTost("Failed to update profile avator in Firestore.", "error", 5000);
            }
        
        console.log("Uploaded URL:", url);
        handleTost("Profile photo uploaded successfully!", "success", 3000);

    } catch(error) {
        console.error("Network or Upload Error:", error);
        handleTost("An unexpected error occurred during upload.", "error", 5000);
    }
  };

  return (
    <View style={{display:"flex",flexDirection:"column",gap:8,width:"100%"}}>
        {imgSource?<Image contentFit='contain' source={{uri:imgSource}} style={styles.image} /> :
        <Image source={require("@/assets/images/icon.png")} style={styles.image} /> }
        <View style={{display:"flex",gap:8,height:60,flexDirection:"row",width:"100%"}}>
            <Pressable
            style={[styles.button]}
            onPress={pickImageAsync}>
                <MaterialCommunityIcons name="upload" size={24} color="#5f86b3ff" />
            <Text style={[{color:"#5f86b3ff"}]}>Photo</Text>
            </Pressable>
            <ProfileUpdate>
              <View style={{padding:4,gap:4}}>
              <Text>Name</Text>
              <TextInput style={{borderWidth:2,borderColor:"#bdbdbdff",borderRadius:8,padding:12}} />
              </View>
              <View style={{padding:8,gap:4}}>
                <Text>Email</Text>
                 <TextInput style={{borderWidth:2,borderColor:"#bdbdbdff",borderRadius:8,padding:12}} />
              </View>
              <View style={{display:"flex",gap:8,height:60,flexDirection:"row",width:"100%",padding:8}}>
                  <Pressable
                  style={[styles.button]}
                  onPress={pickImageAsync}>
                  <Text style={[{color:"#5f86b3ff"}]}>Cancel</Text>
                  </Pressable>
                  <Pressable
                  style={[styles.button]}
                  onPress={pickImageAsync}>
                  <Text style={[{color:"#5f86b3ff"}]}>Update</Text>
                  </Pressable>
              </View>
            </ProfileUpdate>
        </View>
    </View>
  );
}

// ... styles remain the same
const styles = StyleSheet.create({
  image: {
    width: 100,
    height:100,
    borderRadius: 100,
    marginHorizontal:"auto",
    borderWidth:1,
    borderColor:"#5f86b3ff"
  },
    button: {
    backgroundColor: '#fff',
    display:"flex",
    flexDirection:"row",
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    borderWidth:1,
    borderColor:'#dbdadaff',
    borderRadius: 4,
    flex:1,
  },
  buttonText: {
    color: '#f17777ff',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
  },
});
