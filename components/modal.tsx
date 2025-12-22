import { MaterialCommunityIcons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { PropsWithChildren, ReactNode, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = PropsWithChildren<{
  isVisible: boolean;
  onClose: () => void;
}>;

export default function ProfileUpdate({children}:{children:ReactNode}) {
    const [isVisible,setIsVisible]=useState(false);
  return (
    <>
    <Modal animationType="slide" transparent={isVisible} visible={isVisible}>
      <View style={styles.modalContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Choose a sticker</Text>
          <Pressable onPress={()=>setIsVisible(false)}>
            <MaterialIcons name="close" color="#fff" size={22} />
          </Pressable>
        </View>
        {children}
      </View>
    </Modal>
    <Pressable
        style={[styles.button,{gap:4}]}
        onPress={()=>setIsVisible(true)}> 
            <MaterialCommunityIcons name="pen" size={24} color="#5f86b3ff" />
            <Text style={[{color:"#5f86b3ff"}]}>Profile</Text>
        </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    height: '64%',
    width: '100%',
    backgroundColor: '#fff',
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    position: 'absolute',
    bottom: 0,
  },
  titleContainer: {
    height: 48,
    backgroundColor: '#3390fcff',
    borderColor:"#5f86b3ff",
    borderTopRightRadius: 4,
    borderTopLeftRadius: 4,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#fff',
    fontSize: 16,
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
});
