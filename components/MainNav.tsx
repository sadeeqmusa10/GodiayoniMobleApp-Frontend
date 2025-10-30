import React from "react";
import { Text, Pressable, View } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "expo-router";
import { useAuth } from "@/Auth/FirebaseProviderWithNavigate";
import UsernameMenu from "../components/Usermenu";

const MainNav = () => {
  const { user } = useAuth();
  const router = useRouter();
  const auth = getAuth();

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/");
  };

  return (
    <View className="flex flex-row space-x-3 items-center">
      {user ? (
        <UsernameMenu />
      ) : (
        <Pressable
          onPress={() => router.push("/login" as any)}
          className="px-4 py-2 bg-orange-500 rounded-lg"
        >
          <Text className="text-white font-bold">Log In</Text>
        </Pressable>
      )}
    </View>
  );
};

export default MainNav;
