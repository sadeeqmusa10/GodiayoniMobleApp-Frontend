import { View, Image, Pressable } from "react-native";
import { useNavigation, DrawerActions, useRoute } from "@react-navigation/native";
import MobileNav from "./MobileNav";
import { Ionicons } from "@expo/vector-icons";

const Header = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const isHome = route.name === "HomeScreen";

  return (
    <View className="bg-white">
      <View className="flex-row items-center justify-between pl-0 pr-2 py-4">
       {/* LEFT SIDE */}
        {isHome ? (
          // ✅ Show LOGO on Home
          <Pressable
            onPress={() => navigation.navigate("HomeScreen")}
            className="-ml-3 "
          >
            <Image
              source={require("../../assets/godiyalogo.jpg")}
              style={{ width: 140, height: 44 }}
              resizeMode="contain"
            />
          </Pressable>
        ) : (
          // ✅ Show BACK BUTTON on other screens
          <Pressable
            onPress={() => navigation.goBack()}
            className="-ml-1 p-2"
          >
            <Ionicons name="arrow-back" size={26} color="black" />
          </Pressable>
        )}

        {/* HAMBURGER — overlaps right edge */}
        <Pressable
          onPress={() =>
            navigation.dispatch(DrawerActions.toggleDrawer())
          }
          className="-mr-3"
        >
          <MobileNav />
        </Pressable>
      </View>
    </View>
  );
};

export default Header;
