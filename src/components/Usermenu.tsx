import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../Auth/FirebaseProviderWithNavigate";

const Usermenu = ({ onClose }: { onClose: () => void }) => {
  const navigation = useNavigation<any>();
  const { user, role } = useAuth();

  const navigateTo = (screen: string) => {
    onClose();
    navigation.navigate(screen);
  };

  const handleLogout = async () => {
    await signOut(getAuth());
    onClose();
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  };

  if (!user) return null;

  return (
    <View>
      <Text className="text-lg font-bold mb-4">User Menu</Text>

      {/* ADMIN */}
      {role === "admin" && (
        <>
          <MenuItem label="Manage Restaurant" onPress={() => navigateTo("ManageRestaurantScreen")} />
          <MenuItem label="Manage Delivery" onPress={() => navigateTo("ManageDeliveryScreen")} />
          <MenuItem label="Manage Orders" onPress={() => navigateTo("ManageOrdersScreen")} />
          <MenuItem label="Add New Restaurant" onPress={() => navigateTo("AddNewRestaurantScreen")} />
        </>
      )}

      {/* USER */}
      {role === "user" && (
        <>
          <MenuItem label="User Profile" onPress={() => navigateTo("UserProfileScreen")} />
          <MenuItem label="Package Delivery" onPress={() => navigateTo("DeliveryScreen")} />
          <MenuItem label="Delivery Status" onPress={() => navigateTo("DeliveryStatusScreen")} />
          <MenuItem label="Order Status" onPress={() => navigateTo("OrderStatusScreen")} />
        </>
      )}

      <View className="h-[1px] bg-gray-300 my-4" />

      <TouchableOpacity
        onPress={handleLogout}
        className="bg-orange-500 rounded-lg py-3"
      >
        <Text className="text-white font-bold text-center">
          Log Out
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const MenuItem = ({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity onPress={onPress} className="py-3">
    <Text className="text-base font-semibold text-gray-700">
      {label}
    </Text>
  </TouchableOpacity>
);

export default Usermenu;
