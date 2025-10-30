import React from "react";
import { View, Text, Pressable } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/Auth/FirebaseProviderWithNavigate"; // ✅ assuming you’ll reuse this hook

const MobileNavLinks = () => {
  const { user, role } = useAuth();
  const navigation = useNavigation();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate("Home" as never);
    } catch (error) {
      console.log("Logout failed:", error);
    }
  };

  const NavButton = ({ label, screen }: { label: string; screen: string }) => (
    <Pressable
      onPress={() => navigation.navigate(screen as never)}
      className="w-full bg-white rounded-md py-3 px-4 mb-2"
    >
      <Text className="text-black font-bold text-center">{label}</Text>
    </Pressable>
  );

  return (
    <View className="space-y-3">
      {user ? (
        <>
          {/* Admin-only navigation */}
          {role === "admin" && (
            <>
              <NavButton label="Manage Restaurant" screen="ManageRestaurant" />
              <NavButton label="Manage Delivery" screen="ManageDelivery" />
            </>
          )}

          {/* User-only navigation */}
          {role === "user" && (
            <>
              <NavButton label="User Profile" screen="UserProfile" />
              <NavButton label="Package Delivery" screen="Delivery" />
              <NavButton label="Order Status" screen="OrderStatus" />
              <NavButton label="Delivery Status" screen="DeliveryStatus" />
            </>
          )}

          {/* Logout */}
          <Pressable
            onPress={handleLogout}
            className="w-full bg-red-600 rounded-md py-3 px-4"
          >
            <Text className="text-white font-bold text-center">Log Out</Text>
          </Pressable>
        </>
      ) : (
        <View className="flex flex-col space-y-2">
          <NavButton label="Log In" screen="Login" />
          <Pressable
            onPress={() => navigation.navigate("Signup" as never)}
            className="w-full bg-orange-600 rounded-md py-3 px-4"
          >
            <Text className="text-white font-bold text-center">Sign Up</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default MobileNavLinks;
