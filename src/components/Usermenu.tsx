import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../Auth/FirebaseProviderWithNavigate";

const Usermenu = ({ onClose }: { onClose: () => void }) => {
  const navigation = useNavigation<any>();
  const { user, role } = useAuth();

  const [showLogistics, setShowLogistics] = useState(false);
const [showTransport, setShowTransport] = useState(false);

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
        <MenuItem label="Add New Restaurant" onPress={() => navigateTo("AddNewRestaurantScreen")} />
          <MenuItem label="Manage Restaurant" onPress={() => navigateTo("ManageRestaurantScreen")} />
          <MenuItem label="Manage Delivery" onPress={() => navigateTo("ManageDeliveryScreen")} />
          <MenuItem label="Manage Orders" onPress={() => navigateTo("ManageOrdersScreen")} />
        </>
      )}

      {/* USER */}
     {role === "user" && (
  <>
    <MenuItem label="User Profile" onPress={() => navigateTo("UserProfileScreen")} />

    {/* 🔽 LOGISTICS DROPDOWN */}
    <TouchableOpacity
      onPress={() => setShowLogistics(!showLogistics)}
      className="py-3"
    >
      <Text className="text-base font-semibold text-gray-700">
        Logistics {showLogistics ? "▲" : "▼"}
      </Text>
    </TouchableOpacity>

    {showLogistics && (
      <View className="pl-4">
        <MenuItem label="Door To Door Delivery" onPress={() => navigateTo("DoorToDoorDeliveryScreen")} />
        <MenuItem label="Motor Park Delivery" onPress={() => navigateTo("MotorParkDeliveryScreen")} />
        <MenuItem label="Pick Up Delivery" onPress={() => navigateTo("DeliveryScreen")} />
        <MenuItem label="WayBill Delivery" onPress={() => navigateTo("WayBillDeliveryScreen")} />
        
      </View>
    )}

    {/* 🔽 TRANSPORT DROPDOWN */}
    <TouchableOpacity
      onPress={() => setShowTransport(!showTransport)}
      className="py-3"
    >
      <Text className="text-base font-semibold text-gray-700">
        Transport {showTransport ? "▲" : "▼"}
      </Text>
    </TouchableOpacity>

    {showTransport && (
      <View className="pl-4">
        <MenuItem label="Cargo" onPress={() => navigateTo("CargoScreen")} />
        <MenuItem label="Shipping & Clearing" onPress={() => navigateTo("ShippingClearingandForwardingScreen")}/>
        <MenuItem label="Courier Services" onPress={() => navigateTo("CourrierServiceScreen")} />
      </View>
    )}

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
