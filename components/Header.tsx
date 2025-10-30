import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { DrawerActions } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // or use any icon set you like

const Header = () => {
  const navigation = useNavigation<any>();

  return (
    <View className="border-b border-gray-300 py-4 px-4 bg-white flex flex-row justify-between items-center">
      {/* Logo */}
      <Pressable onPress={() => navigation.navigate("Home")}>
        <Image
          source={require("../assets/godiyalogo.jpg")}
          className="w-12 h-12 rounded-full"
          resizeMode="contain"
        />
      </Pressable>

      {/* Mobile menu icon */}
      <Pressable
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        className="md:hidden"
      >
        <Ionicons name="menu" size={28} color="#000" />
      </Pressable>

      {/* Desktop navigation (optional if using drawer only) */}
      <View className="hidden md:flex flex-row gap-6">
        <Pressable onPress={() => navigation.navigate("Home")}>
          <Text className="text-lg font-semibold text-red-600">Home</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate("Search")}>
          <Text className="text-lg font-semibold text-red-600">Search</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate("Orders")}>
          <Text className="text-lg font-semibold text-red-600">Orders</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Header;
