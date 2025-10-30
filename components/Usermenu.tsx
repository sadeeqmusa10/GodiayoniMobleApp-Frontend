import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, Pressable } from "react-native";
import { CircleUserRound } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { getAuth, signOut } from "firebase/auth";
import { useAuth } from "../Auth/FirebaseProviderWithNavigate"; // You can reuse this hook

const UsernameMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigation = useNavigation();
  const { user, role, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(getAuth());
      setIsOpen(false);
      navigation.navigate("Home" as never);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  if (loading) return null;

  if (!user) {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("Login" as never)}
        className="px-4 py-2 rounded-md bg-orange-500"
      >
        <Text className="text-white font-bold text-center">Log In</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View>
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        className="flex-row items-center gap-2"
      >
        <CircleUserRound size={24} color="#f97316" />
        <Text className="font-bold">{user?.email?.split("@")[0]}</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/40">
          <View className="bg-white rounded-lg w-4/5 p-4">
            <Text className="text-lg font-bold mb-3">Account Menu</Text>

            {role === "admin" && (
              <>
                <MenuItem
                  label="Manage Restaurant"
                  onPress={() => navigateTo("ManageRestaurant")}
                />
                <MenuItem
                  label="Manage Delivery"
                  onPress={() => navigateTo("ManageDelivery")}
                />
              </>
            )}

            {role === "user" && (
              <>
                <MenuItem
                  label="User Profile"
                  onPress={() => navigateTo("UserProfile")}
                />
                <MenuItem
                  label="Package Delivery"
                  onPress={() => navigateTo("Delivery")}
                />
                <MenuItem
                  label="Delivery Status"
                  onPress={() => navigateTo("DeliveryStatus")}
                />
                <MenuItem
                  label="Order Status"
                  onPress={() => navigateTo("OrderStatus")}
                />
              </>
            )}

            <View className="border-t border-gray-300 my-2" />

            <TouchableOpacity
              onPress={handleLogout}
              className="bg-orange-500 rounded-md p-3 mt-2"
            >
              <Text className="text-white font-bold text-center">Log Out</Text>
            </TouchableOpacity>

            <Pressable onPress={() => setIsOpen(false)} className="mt-3">
              <Text className="text-center text-gray-500 font-medium">
                Cancel
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );

  function navigateTo(screen: string) {
    setIsOpen(false);
    navigation.navigate(screen as never);
  }
};

const MenuItem = ({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity onPress={onPress} className="py-3">
    <Text className="text-base font-semibold text-gray-700">{label}</Text>
  </TouchableOpacity>
);

export default UsernameMenu;
