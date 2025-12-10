import { auth, db } from "@/firebase.config";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, doc, getDocs, limit, query, setDoc, where } from "firebase/firestore";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Text } from 'react-native';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';

// Define the type for the full context object
interface AuthContextType {
    isLoading:boolean,
    user: {name:string,email:string,id:string} | null;
    register: (name: string, email: string, password: string) => void;
    login: (email: string, password: string) => void; // Corrected login signature
    logout: () => void;
    handleTost:(title: string, type: string, duration: number)=>void;
}

// The 'as AuthContextType' assertion ensures TypeScript knows the final type
export const AuthContext = createContext<AuthContextType>({
    isLoading:false,
    user: null,
    register: () => {}, // Dummy functions
    login: () => {},
    logout: () => {},
    handleTost:(title: string, type: string, duration: number)=>{}
});

const AuthProvider=({children}:{children:ReactNode})=>{
const [isLoading,setIsLoading]=useState(false);
const [user,setUser]=useState<{id:string,email:string,name:string} | null>(null);
const top = useSharedValue(-100);
const [tostTitle,setTostTitle]=useState("")
const [tostType,setTostType]=useState("")

  const handleTost = (title:string,type:string,duration:number) => {
    setTostTitle(title)
    setTostType(type)
    top.value = withSpring(100);
    setTimeout(()=>{
      top.value = withSpring(-100);
    },duration)
  };
const register=async (name:string,email:string,password:string)=>{
    setIsLoading(true)
    await createUserWithEmailAndPassword(auth,email,password).then((crd)=>{
        setDoc(doc(db,"users",crd.user.uid),{
            name:name,
            email:email,
            id:crd.user.uid
        }).then(res=>console.log(res))
        .catch(err=>console.log(err))
    }).catch(err=>{
      handleTost("Feild to register user","error",3000)
        console.log(err)
    }).finally(()=>setIsLoading(false));
}


const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const usersRef = collection(db, "users");
        const q = query(usersRef, where("id", "==", user.uid), limit(1)); 

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const data = querySnapshot.docs[0].data();
            console.log(data)
            // setUser({id,email,name})
        } else {
            console.log("No user document found in Firestore.");
        }

    } catch (err) {
        handleTost("Email or password error!", "error", 3000);
        console.error("Login Error:", err);
    } finally {
        setIsLoading(false);
    }
}
const logout=async ()=>{
    setIsLoading(true)
    await signOut(auth).then(()=>setIsLoading(false));
}
useEffect(()=>{
   const unsub =  onAuthStateChanged(auth,(user)=>{
    if(!user) {
        setUser(null);
    }
    else{
      const q = query(collection(db,"users"), where("id", "==", user.uid), limit(1)); 
       getDocs(q).then(snapshot=>{
        if(!snapshot.empty) {
         const {id,name,email} = snapshot.docs[0].data()
         setUser({id,name,email})
        }
       });
    }
   })
   setUser({"email": "jk@gmail.com", "id": "9J6CXRw5ylhGdeOnIypctjrdqt13", "name": "Jacob"});
return unsub;
},[])

return <AuthContext.Provider value={{user,login,logout,register,isLoading,handleTost}}>
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

