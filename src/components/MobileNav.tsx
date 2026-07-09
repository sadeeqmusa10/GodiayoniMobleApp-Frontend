import React, { useEffect, useState } from "react";
import { View, Text, Pressable, Modal, ActivityIndicator } from "react-native";
import { Menu, CircleUserRound } from "lucide-react-native";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

import Usermenu from "./Usermenu";
import AdminMenu from "./AdminMenu"; // 👈 create this

type Role = "admin" | "user";

const MobileNav = () => {
  const auth = getAuth();
  const navigation = useNavigation<any>();

  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        // 🔥 FORCE refresh to get latest claims
        const tokenResult = await currentUser.getIdTokenResult(true);
        const claimRole = tokenResult.claims.role === "admin" ? "admin" : "user";
        setRole(claimRole);
      } catch (err) {
        console.error("Failed to load role", err);
        setRole("user");
      }

      setLoading(false);
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
      {/* 🍔 HAMBURGER */}
      <Pressable onPress={() => setIsModalVisible(true)} className="p-2">
        <Menu size={28} color="black" />
      </Pressable>

      {/* 📱 MODAL */}
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

        {/* CONTENT */}
        <View className="bg-white p-5 pt-6 rounded-t-3xl">
          {/* HEADER */}
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

          {/* BODY */}
          {loading ? (
            <ActivityIndicator size="large" />
          ) : user ? (
            role === "admin" ? (
              <AdminMenu onClose={() => setIsModalVisible(false)} />
            ) : (
              <Usermenu onClose={() => setIsModalVisible(false)} />
            )
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

          {/* CLOSE */}
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
