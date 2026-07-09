import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";

type Props = {
  item: {
    title: string;
    image: any;
    screen: keyof RootStackParamList;
  };
};

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export default function TransportCard({ item }: Props) {
  const navigation = useNavigation<NavProp>();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(item.screen as any)}
      className="w-28 mr-4"
    >
      <View className="bg-white rounded-2xl shadow-md overflow-hidden items-center p-3">
         <Image
          source={item.image}
          className="w-full h-24"
          style={{ width: 120, height: 120 }}
          resizeMode="cover" // or "contain" if image has padding
        />

        <Text className="text-lg font-semibold text-center text-gray-800">
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}