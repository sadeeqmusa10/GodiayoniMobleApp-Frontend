import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Restaurant } from "@/app/types";

type Props = {
  restaurant: Restaurant;
};

const RestaurantInfo = ({ restaurant }: Props) => {
  return (
    <View className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
      {/* Header */}
      <View className="mb-2">
        <Text className="text-2xl font-bold">{restaurant.restaurantName}</Text>
        <Text className="text-gray-600">
          {restaurant.city}, {restaurant.country}
        </Text>
      </View>

      {/* Cuisines */}
      <View className="flex-row flex-wrap items-center">
        {restaurant.cuisines.map((item, index) => (
          <View className="flex-row items-center" key={index}>
            <Text className="text-gray-800">{item}</Text>
            {index < restaurant.cuisines.length - 1 && (
              <Ionicons
                name="ellipse"
                size={6}
                color="#6B7280"
                style={{ marginHorizontal: 6 }}
              />
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

export default RestaurantInfo;
