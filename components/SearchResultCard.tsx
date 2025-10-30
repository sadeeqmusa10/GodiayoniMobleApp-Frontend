import React from "react";
import { TouchableOpacity, Image, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Clock, Banknote, Dot } from "lucide-react-native";
import type { Restaurant } from "@/Types";

type Props = {
  restaurant: Restaurant;
};

const SearchResultCard = ({ restaurant }: Props) => {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Detail", { id: restaurant.firebaseId })
      }
      className="flex flex-col md:flex-row gap-4 mb-4 bg-white rounded-lg shadow-sm"
    >
      <View className="w-full md:w-1/2 aspect-[16/6]">
        <Image
          source={{ uri: restaurant.imageUrl }}
          accessibilityLabel="Restaurant image"
          className="w-full h-full rounded-lg object-cover"
        />
      </View>

      <View className="flex-1 p-2">
        <Text className="text-2xl font-bold mb-2">
          {restaurant.restaurantName}
        </Text>

        <View className="flex flex-row flex-wrap mb-2">
          {restaurant.cuisines.map((item, index) => (
            <View key={index} className="flex flex-row items-center">
              <Text className="text-gray-700">{item}</Text>
              {index < restaurant.cuisines.length - 1 && (
                <Dot size={14} color="#9ca3af" />
              )}
            </View>
          ))}
        </View>

        <View className="flex flex-col space-y-1">
          <View className="flex flex-row items-center gap-1">
            <Clock size={18} color="#16a34a" />
            <Text className="text-green-600">
              {restaurant.estimatedDeliveryTime} mins
            </Text>
          </View>

          <View className="flex flex-row items-center gap-1">
            <Banknote size={18} color="#374151" />
            <Text>Delivery price ₦{restaurant.deliveryPrice.toFixed(2)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SearchResultCard;
