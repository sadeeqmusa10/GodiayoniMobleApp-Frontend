import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CartItem } from "../app/screens/DetailScreen";
import { Restaurant } from "@/app/types";

type Props = {
  restaurant: Restaurant;
  cartItems: CartItem[];
  removeFromCart: (cartItem: CartItem) => void;
};

const OrderSummary = ({ restaurant, cartItems, removeFromCart }: Props) => {
  const getTotalCost = () => {
    const totalInKobo = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    return totalInKobo + restaurant.deliveryPrice;
  };

  return (
    <View className="p-4 bg-white rounded-2xl shadow">
      {/* Header */}
      <View className="flex-row justify-between mb-4">
        <Text className="text-2xl font-bold">Your Order</Text>
        <Text className="text-2xl font-bold">₦{getTotalCost()}</Text>
      </View>

      {/* Cart Items */}
      {cartItems.map((item) => (
        <View
          key={item.name}
          className="flex-row justify-between items-center py-2 border-b border-gray-200"
        >
          <View className="flex-row items-center">
            <View className="bg-gray-200 rounded-full px-2 py-1 mr-2">
              <Text className="font-semibold">{item.quantity}</Text>
            </View>
            <Text className="text-base">{item.name}</Text>
          </View>

          <View className="flex-row items-center space-x-2">
            <Pressable onPress={() => removeFromCart(item)}>
              <Ionicons name="trash-outline" size={20} color="red" />
            </Pressable>
            <Text className="text-base font-semibold">
              ₦{item.price * item.quantity}
            </Text>
          </View>
        </View>
      ))}

      {/* Delivery Fee */}
      <View className="flex-row justify-between mt-4 pt-4 border-t border-gray-300">
        <Text className="text-base font-medium">Delivery</Text>
        <Text className="text-base font-semibold">
          ₦{restaurant.deliveryPrice}
        </Text>
      </View>
    </View>
  );
};

export default OrderSummary;
