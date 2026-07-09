import { Text, Pressable, View } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { useAuth } from "../Auth/FirebaseProviderWithNavigate";
import { navigationRef } from "../config/navigationRef";
import Usermenu from "./Usermenu";

const MainNav = () => {
  const { user } = useAuth();
  const auth = getAuth();

  const handleLogout = async () => {
    await signOut(auth);
    navigationRef.navigate("HomeScreen");
  };

  return (
    <View className="flex flex-row space-x-3 items-center">
      {user ? (
        <Usermenu onClose={function (): void {
          throw new Error("Function not implemented.");
        } } />
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
