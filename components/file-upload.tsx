import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { useAuth } from '@/context/auth-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export interface PhotoUploadProps {
  onUpload: (avatarUrl: string) => void; // Callback to update parent component with new avatar URL
  initialImage?: string; // Optional initial image URL (e.g., current avatar)
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ onUpload, initialImage }) => {
  const [image, setImage] = useState<string | null>(initialImage || null);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();

   const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'Please allow access to your photo library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (result.canceled) {
      return;
    }

    if (result.assets.length > 1) {
      Alert.alert('Error', 'You can upload only one image.');
      return;
    }

    if (result.assets[0].uri) {
      setUploading(true);
      try {

        const form = new FormData();
        form.append("photos", {
            uri: result.assets[0].uri,
            name: `avatar-${Date.now()}.jpg`,
            type: 'image/jpeg',
            } as any);

        const response = await  fetch('http://localhost:3000/upload/freeuploadavator', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data; boundary=---011000010111000001101001',
                'User-Agent': 'insomnia/11.6.2'
            },
            body:form
            });
            

        if (!response.ok) {
            console.log(response)
          
          throw new Error('Profile upload error.');
        }
          const {url}=await response.json();
          console.log(url)

        // const data = await response.json();
        // await AsyncStorage.setItem('appUser', JSON.stringify(data));
        // setImage(data.avatar);
        // onUpload(data.avatar);
        // Alert.alert('Success', 'Avatar uploaded successfully!');
      } catch (error) {
        console.log(error)
        Alert.alert('Error', 'Failed to upload image');
      } finally {
        setUploading(false);
      }
    }
  };
  return (
      <TouchableOpacity style={styles.container} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: `${process.env.EXPO_PUBLIC_API_URL}/${image}` }} style={styles.preview} resizeMode="cover" />
        ) : (
          <View style={styles.placeholder}>
            <MaterialCommunityIcons name="camera" size={48} color={"#4042b3ff"} />
          </View>
        )}
        {image && (
          <View style={styles.buttonContainer}>
            
          </View>
        )}
        {/* <Text style={{fontSize:18,color:"#5a83c2ff",fontWeight:"bold"}}>{image?"Profile photo":"Upload profile"}</Text> */}
      </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
  container: {
    alignItems: 'center',
  },
  preview: {
    width: 100,
    height: 100,
    borderRadius: 75,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  placeholder: {
    width: 100,
    height: 100,
    borderRadius: 75,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default PhotoUpload;