import { View, Text, Pressable } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../Auth/FirebaseProviderWithNavigate";

const MobileNavLinks = () => {
  const { user, role, loading } = useAuth();
  const navigation = useNavigation<any>();
  const auth = getAuth();

  if (loading) return null;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } catch (error) {
      console.log("Logout failed:", error);
    }
  };

  const NavButton = ({ label, screen }: { label: string; screen: string }) => (
    <Pressable
      onPress={() => navigation.navigate(screen)}
      className="w-full bg-white rounded-md py-3 px-4 mb-2"
    >
      <Text className="text-black font-bold text-center">{label}</Text>
    </Pressable>
  );

  return (
    <View className="space-y-3">
      {user ? (
        <>
          {/* 🔐 ADMIN ONLY */}
          {role === "admin" && (
            <>
              <NavButton label="Manage Restaurant" screen="ManageRestaurant" />
              <NavButton label="Manage Delivery" screen="ManageDelivery" />
            </>
          )}

          {/* 👤 USER ONLY */}
          {role === "user" && (
            <>
              <NavButton label="User Profile" screen="UserProfile" />
              <NavButton label="Package Delivery" screen="Delivery" />
              <NavButton label="Order Status" screen="OrderStatus" />
              <NavButton label="Delivery Status" screen="DeliveryStatus" />
            </>
          )}

          {/* 🚪 LOGOUT */}
          <Pressable
            onPress={handleLogout}
            className="w-full bg-red-600 rounded-md py-3 px-4"
          >
            <Text className="text-white font-bold text-center">
              Log Out
            </Text>
          </Pressable>
        </>
      ) : (
        <>
          <NavButton label="Log In" screen="Login" />
          <Pressable
            onPress={() => navigation.navigate("Signup")}
            className="w-full bg-orange-600 rounded-md py-3 px-4"
          >
            <Text className="text-white font-bold text-center">
              Sign Up
            </Text>
          </Pressable>
        </>
      )}
    </View>
  );
};

export default MobileNavLinks;
