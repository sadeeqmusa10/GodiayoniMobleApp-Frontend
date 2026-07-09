import React from "react";
import { View, Text, Image } from "react-native";
import { Order } from "../types";

type Props = {
  order: Order;
};

const OrderStatusDetail = ({ order }: Props) => {
  const address =
    typeof order.deliveryDetails.addressLine1 === "string"
      ? order.deliveryDetails.addressLine1
      : order.deliveryDetails.addressLine1?.text;

  const restaurant = order.restaurantSnapshot;


  return (
    <View className="space-y-6">
      {/* =====================
          RESTAURANT HEADER
      ===================== */}
      <View className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
        <Image
          source={{
            uri:
              restaurant?.imageUrl ||
              "https://via.placeholder.com/400x200.png",
          }}
          className="w-full h-40"
          resizeMode="cover"
        />

       <View className="p-4">
  <Text className="text-sm font-medium">
    Order from: {restaurant?.name}
  </Text>

  <Text className="text-sm  mt-1">
    {restaurant?.addressText}
  </Text>
</View>

      </View>

      {/* =====================
          DELIVERY DETAILS
      ===================== */}
      <View className="bg-white rounded-2xl p-4 border border-gray-200">
        <Text className="font-bold text-lg mb-2">
          Delivering to
        </Text>

        <Text className="text-gray-800">
          {order.deliveryDetails.name}
        </Text>

        <Text className="text-gray-700 mt-1">
          {address ?? "Address not available"},{" "}
          {order.deliveryDetails.city}
        </Text>
      </View>

      {/* =====================
          CART ITEMS
      ===================== */}
      <View className="bg-white rounded-2xl p-4 border border-gray-200">
        <Text className="font-bold text-lg mb-3">
          Your Order
        </Text>

        {order.cartItems.map((item, index) => (
          <View
            key={index}
            className="flex-row justify-between mb-2"
          >
             <Image
                    source={{ uri: item.imageUrl }}
                    className="w-12 h-12 rounded-lg mr-3"
                  />
            <Text className="text-gray-800">
              {item.name} × {item.quantity}
            </Text>
          </View>
        ))}
      </View>

      {/* =====================
          TOTAL
      ===================== */}
      <View className="bg-white rounded-2xl p-4 border border-gray-200">
        <Text className="font-bold text-lg">
          Total
        </Text>

        <Text className="text-xl font-bold text-orange-600 mt-1">
          ₦{order.totalAmount.toLocaleString()}
        </Text>
      </View>
    </View>
  );
};

export default OrderStatusDetail;
