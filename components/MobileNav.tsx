import React, { useState, useEffect } from "react";
import { View, Text, Pressable, Modal } from "react-native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Menu, CircleUserRound } from "lucide-react-native";
import MobileNavLinks from "./MainNav"; // ✅ already converted version
import type { User as FirebaseUser } from "firebase/auth";

const MobileNav = () => {
  const auth = getAuth();
  const [user, setUser] = useState<FirebaseUser | null>(auth.currentUser);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => setUser(user));
    return () => unsubscribe();
  }, [auth]);

  const handleLoginRedirect = async () => {
    await AsyncStorage.setItem("returnTo", "Home");
    navigation.navigate("Login" as never);
    setIsModalVisible(false);
  };

  return (
    <View>
      {/* Menu button (top right or header) */}
      <Pressable onPress={() => setIsModalVisible(true)} className="p-2">
        <Menu size={28} color="black" />
      </Pressable>

      {/* Modal menu */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 bg-white p-5 pt-12 rounded-t-3xl mt-auto">
          {/* User info */}
          <View className="flex-row items-center gap-2 mb-4">
            {user ? (
              <>
                <CircleUserRound color="orange" size={24} />
                <Text className="font-bold text-lg">
                  {user.email?.split("@")[0]}
                </Text>
              </>
            ) : (
              <Text className="font-bold text-lg">
                Welcome To Godiyaoni Express Delivery!
              </Text>
            )}
          </View>

          {/* Separator */}
          <View className="h-[1px] bg-gray-300 mb-5" />

          {/* Links */}
          {user ? (
            <MobileNavLinks />
          ) : (
            <Pressable
              onPress={handleLoginRedirect}
              className="bg-orange-500 rounded-md py-3"
            >
              <Text className="text-white font-bold text-center text-base">
                Log In
              </Text>
            </Pressable>
          )}

          {/* Close button */}
          <Pressable
            onPress={() => setIsModalVisible(false)}
            className="mt-5 py-2 rounded-md bg-gray-200"
          >
            <Text className="text-center text-black font-semibold">Close</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};

export default MobileNav;
