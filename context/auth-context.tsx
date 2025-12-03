import { auth } from "@/firebase.config";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { createContext, ReactNode, useContext, useEffect } from "react";

export const AuthContext = createContext({
    register:(name:string,email:string,password:string)=>{
    },
    login:(name:string,email:string)=>{},
    logout:()=>{}
})

const AuthProvider=({children}:{children:ReactNode})=>{
const register=(name:string,email:string,password:string)=>{
        createUserWithEmailAndPassword(auth,email,password).then((user)=>{
            console.log(user)
        }).catch(err=>console.log(err))
}
const login=(email:string,password:string)=>{
    signInWithEmailAndPassword(auth,email,password).then((user)=>{
        console.log(user)
    }).catch(err=>console.log(err))
}
const logout=()=>{
    signOut(auth);
}
useEffect(()=>{
   const unsub =  onAuthStateChanged(auth,(user)=>{
    console.log(user)
   })
return unsub;
},[])
return <AuthContext.Provider value={{login,logout,register}}>
        {children}
    </AuthContext.Provider>
}

 export const useAuth=()=>useContext(AuthContext);

export default AuthProvider;

