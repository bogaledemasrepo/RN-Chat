import { auth, db } from "@/firebase.config";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, doc, query, setDoc } from "firebase/firestore";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

// Define the type for the full context object
interface AuthContextType {
    user: {name:string,email:string,id:string} | null;
    register: (name: string, email: string, password: string) => void;
    login: (email: string, password: string) => void; // Corrected login signature
    logout: () => void;
}

// The 'as AuthContextType' assertion ensures TypeScript knows the final type
export const AuthContext = createContext<AuthContextType>({
    user: null,
    register: () => {}, // Dummy functions
    login: () => {},
    logout: () => {}
});

const AuthProvider=({children}:{children:ReactNode})=>{
const [user,setUser]=useState<{id:string,email:string,name:string} | null>(null);
const register=(name:string,email:string,password:string)=>{
        createUserWithEmailAndPassword(auth,email,password).then((crd)=>{
            setDoc(doc(db,"users",crd.user.uid),{
                name:name,
                email:email,
                id:crd.user.uid
            }).then(res=>console.log(res))
            .catch(err=>console.log(err))
        }).catch(err=>console.log(err))
}
const login=(email:string,password:string)=>{
    signInWithEmailAndPassword(auth,email,password).then((user)=>{
       console.log(query(collection(db,"users")));
        
        // console.log(user)
    }).catch(err=>console.log(err))
}
const logout=()=>{
    signOut(auth);
}
useEffect(()=>{
   const unsub =  onAuthStateChanged(auth,(user)=>{
    if(!user) {
        setUser(null);
    }
    else{
        const {uid:id,displayName:name,email}=user;
        setUser({id,email:email||"",name:name||""});
    }
   })
return unsub;
},[])
return <AuthContext.Provider value={{user,login,logout,register}}>
        {children}
    </AuthContext.Provider>
}

 export const useAuth=()=>useContext(AuthContext);

export default AuthProvider;

