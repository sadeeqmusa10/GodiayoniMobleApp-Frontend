import { Text, Pressable, View } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { useAuth } from "../Auth/FirebaseProviderWithNavigate";
import UsernameMenu from "../components/Usermenu";
import { navigationRef } from "../config/navigationRef";

const MainNav = () => {
  const { user } = useAuth();
  const auth = getAuth();

  const handleLogout = async () => {
    await signOut(auth);
    navigationRef.navigate("Home");
  };

  return (
    <View className="flex flex-row space-x-3 items-center">
      {user ? (
        <UsernameMenu />
      ) : (
        <Pressable
          onPress={() =>  navigationRef.navigate("/login" as any)}
          className="px-4 py-2 bg-orange-500 rounded-lg"
        >
          <Text className="text-white font-bold">Log In</Text>
        </Pressable>
      )}
    </View>
  );
};

export default MainNav;
