import { createContext, ReactNode, useContext, useEffect, useState } from "react";

const AuthContext = createContext({
    user:null,
    register:(name:string,email:string,password:string)=>{},
    login:(name:string,email:string)=>{},
    logout:()=>{}
})

const AuthProvider=({children}:{children:ReactNode})=>{
const [user,setUser]=useState(null)
const register=(name:string,email:string,password:string)=>{}
const login=(name:string,email:string)=>{}
const logout=()=>{}
useEffect(()=>{

},[])
return <AuthContext.Provider value={{login,logout,register,user}}>
        {children}
    </AuthContext.Provider>
}

export const useAuth=useContext(AuthContext);

export default AuthProvider;

