import { User } from "@/types";
import { createContext, ReactNode, useContext, useState } from "react";
import { Text } from 'react-native';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';

// Define the type for the full context object
interface AuthContextType {
    user: User|null;
    handleSetUser: (data:User|null) => void
    handleTost:(title: string, type: string, duration: number)=>void;
}

// The 'as AuthContextType' assertion ensures TypeScript knows the final type
export const AuthContext = createContext<AuthContextType>({
    user: null,
    handleSetUser: (data:User|null) => {},
    handleTost:(title: string, type: string, duration: number)=>{}
});

const AuthProvider=({children}:{children:ReactNode})=>{
const [user,setUser]=useState<User | null>(null);
const top = useSharedValue(-100);
const [tostTitle,setTostTitle]=useState("")
const [tostType,setTostType]=useState("")
const [profileUpdated,setProfileUpdated]=useState(false);

  const handleTost = (title:string,type:string,duration:number) => {
    setTostTitle(title)
    setTostType(type)
    top.value = withSpring(100);
    setTimeout(()=>{
      top.value = withSpring(-100);
    },duration)
  };

// useEffect(()=>{
//    const unsub =  onAuthStateChanged(auth,(user)=>{
//     if(!user) {
//         setUser(null);
//     }
//     else{
//       const q = query(collection(db,"users"), where("id", "==", user.uid), limit(1)); 
//        getDocs(q).then(snapshot=>{
//         if(!snapshot.empty) {
//          const {id,name,email,avator} = snapshot.docs[0].data()
//          setUser({id,name,email,avator})
//          setProfileUpdated(false)
//         }
//        });
//     }
//    })
//    setUser({"email": "jk@gmail.com", "id": "9J6CXRw5ylhGdeOnIypctjrdqt13", "name": "Jacob","avator":""});
// return unsub;
// },[profileUpdated])
const handleSetUser=(data:User|null)=>{
    setUser(data);
}
return <AuthContext.Provider value={{user,handleSetUser,handleTost}}>
    <Animated.View
            style={{
              position:"absolute",
              borderWidth:1,
              borderColor:tostType == "success"?"#27c43bff": tostType == 'error'?"#ff7e7ee1":"#59aff5ff",
              borderRadius:4,
              top,
              left:"2%",
              width:"96%",
              marginHorizontal:"auto",
              height: 80,
              backgroundColor: '#fff',
              zIndex:999,
              display:"flex",
              alignItems:"center",
              justifyContent:"center"
            }}
          >
            <Text style={{textAlign:"center",color:tostType=="success"?"#27c43bff":tostType=='error'?"#f85c5cff":"#59aff5ff",fontWeight:"bold",marginVertical:16,fontSize:16}}>{tostTitle}</Text>
          </Animated.View>
        {children}
    </AuthContext.Provider>
}

 export const useAuth=()=>useContext(AuthContext);

export default AuthProvider;

