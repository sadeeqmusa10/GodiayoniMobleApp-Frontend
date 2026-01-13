import React, { useEffect, useState } from "react";
import { View, Text, Pressable, Modal } from "react-native";
import { Menu, CircleUserRound } from "lucide-react-native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import type { User as FirebaseUser } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Usermenu from "./Usermenu";

const MobileNav = () => {
  const auth = getAuth();
  const navigation = useNavigation<any>();

  const [user, setUser] = useState<FirebaseUser | null>(auth.currentUser);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const handleLoginRedirect = async () => {
    await AsyncStorage.setItem("returnTo", "Home");
    setIsModalVisible(false);
    navigation.navigate("Login");
  };

  return (
    <View>
      {/* 🍔 HAMBURGER BUTTON */}
      <Pressable
        onPress={() => setIsModalVisible(true)}
        className="p-2"
      >
        <Menu size={28} color="black" />
      </Pressable>

      {/* 📱 BOTTOM MENU MODAL */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        {/* BACKDROP */}
        <Pressable
          className="flex-1 bg-black/40"
          onPress={() => setIsModalVisible(false)}
        />

        {/* MENU CONTENT */}
        <View className="bg-white p-5 pt-6 rounded-t-3xl">
          {/* USER HEADER */}
          <View className="flex-row items-center gap-3 mb-4">
            {user ? (
              <>
                <CircleUserRound color="orange" size={26} />
                <Text className="text-lg font-bold">
                  {user.email?.split("@")[0]}
                </Text>
              </>
            ) : (
              <Text className="text-lg font-bold">
                Welcome to Godiyaoni Express Delivery!
              </Text>
            )}
          </View>

          <View className="h-[1px] bg-gray-300 mb-5" />

          {/* MENU BODY */}
          {user ? (
            <Usermenu onClose={() => setIsModalVisible(false)} />
          ) : (
            <Pressable
              onPress={handleLoginRedirect}
              className="bg-orange-500 rounded-lg py-3"
            >
              <Text className="text-white font-bold text-center text-base">
                Log In
              </Text>
            </Pressable>
          )}

          {/* CLOSE BUTTON */}
          <Pressable
            onPress={() => setIsModalVisible(false)}
            className="mt-6 py-3 rounded-lg bg-gray-200"
          >
            <Text className="text-center font-semibold text-black">
              Close
            </Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};

export default MobileNav;
