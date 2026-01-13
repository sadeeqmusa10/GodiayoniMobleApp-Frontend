import { View, Image, Pressable } from "react-native";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import MobileNav from "./MobileNav";

const Header = () => {
  const navigation = useNavigation<any>();

  return (
    <View className="border-b border-gray-200 bg-white">
      <View className="flex-row items-center justify-between pl-0 pr-2 py-4">
        {/* LOGO — overlaps left edge */}
        <Pressable
          onPress={() => navigation.navigate("HomeScreen")}
          className="-ml-3"
        >
          <Image
            source={require("../../assets/godiyalogo.jpg")}
            style={{ width: 140, height: 44 }}
            resizeMode="contain"
          />
        </Pressable>

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
