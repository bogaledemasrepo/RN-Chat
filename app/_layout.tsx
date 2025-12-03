import AuthProvider from "@/context/auth-context";
import { Stack } from "expo-router";

export default function RootLayout() {
  return <AuthProvider>
    <Stack />
    </AuthProvider>;
}
