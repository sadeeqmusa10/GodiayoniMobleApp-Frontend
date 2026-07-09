import { useNavigation } from "@react-navigation/native";
import { Image, Text, TouchableWithoutFeedback, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList, MenuItem } from "../types"; // adjust path if needed

type Props = {
  menuItem: MenuItem;
};

// Type your navigation properly
type NavProp = NativeStackNavigationProp<
  RootStackParamList,
  "HomeScreen"
>;

export default function FoodCard({ menuItem }: Props) {
  const navigation = useNavigation<NavProp>();

  return (
    <TouchableWithoutFeedback
      onPress={() =>
      navigation.navigate("DetailScreen", {
  firebaseId: menuItem.restaurantId,
})
      }
    >
      <View className="mr-4 w-52 bg-white rounded-2xl shadow-md overflow-hidden">
  <Image
    source={{ uri: menuItem.imageUrl }}
    className="h-32 w-full"
    style={{ width: 120, height: 160 }}
    resizeMode="cover"
  />

  <View className="p-3">
    <Text numberOfLines={1} className="font-semibold text-base text-gray-900">
      {menuItem.name}
    </Text>

    <Text className="text-green-600 font-bold mt-1">
      ₦{menuItem.price.toLocaleString()}
    </Text>
  </View>
</View>
    </TouchableWithoutFeedback>
  );
}