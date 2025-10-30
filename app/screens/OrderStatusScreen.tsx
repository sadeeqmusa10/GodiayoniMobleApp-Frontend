import React from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { useGetMyOrders } from "../Api/OrderApi";
import OrderStatusDetail from "@/components/OrderStatusDetail";
import OrderStatusHeader from "@/components/OrderSatusHeader";

const OrderStatusPage = () => {
  const { orders, isPending } = useGetMyOrders();

  if (isPending) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg">Loading...</Text>
      </View>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg">No orders found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4 space-y-6">
      {orders.map((order) => (
        <View
          key={order.firebaseId}
          className="bg-white p-5 rounded-2xl mb-6 shadow"
        >
          {/* Header */}
          <OrderStatusHeader order={order} />

          {/* Details */}
          <View className="flex-col md:flex-row gap-6 mt-4">
            <OrderStatusDetail order={order} />

            {/* Image */}
            <View className="w-full h-48 rounded-lg overflow-hidden mt-4">
              <Image
                source={{
                  uri:
                    order.restaurant?.imageUrl ||
                    "https://via.placeholder.com/400x200.png?text=Restaurant",
                }}
                alt={order.restaurant?.restaurantName || "Restaurant"}
                className="w-full h-full object-cover rounded-lg"
                resizeMode="cover"
              />
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default OrderStatusPage;
