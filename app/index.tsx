import { useAuth } from "@/context/auth-context";
import { Button, Text, View } from "react-native";

export default function Index() {
  const {register,login,logout}=useAuth()
  const handleRegister=()=>{
    register("Bg Bg","bgbgbg@gmail.com","test1234");
  }
    const handleLogin=()=>{
    login("bgbgbg@gmail.com","test1234");
  }
    const handleLogout=()=>{
    logout();
  }
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button title="Register" onPress={handleRegister} />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Logout" onPress={handleLogout} />
      <Text>Realtime time chat.</Text>
    </View>
  );
}
