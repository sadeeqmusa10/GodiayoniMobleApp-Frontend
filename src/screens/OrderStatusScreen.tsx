import React from "react";
import { View, Text, Image, ScrollView, ActivityIndicator } from "react-native";
import { useGetMyOrders } from "../Api/OrderApi";
import OrderStatusDetail from "../components/OrderStatusDetail";
import OrderStatusHeader from "../components/OrderStatusHeader";

const OrderStatusScreen = () => {
  const { orders, isPending } = useGetMyOrders();

   if (isPending) {
      return (
        <View className="flex-1 items-center justify-center bg-gray-50">
          <ActivityIndicator size="large" color="#f97316" />
          <Text className="mt-4 text-gray-600">Loading...</Text>
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
    <ScrollView className="flex-1 bg-gray-50 p-4">
      {orders.map((order) => (
        <View
          key={order.id}
          className="bg-white p-5 rounded-2xl mb-6 boxShadow"
        >
          <OrderStatusHeader order={order} />

          <View className="mt-4 gap-6">
            <OrderStatusDetail order={order} />

            <Text className="font-semibold">
              Delivery Price: ₦{order.deliveryPrice}
            </Text>

            <View className="w-full h-48 rounded-lg overflow-hidden">
              <Image
                source={{
                  uri:
                    order.restaurantSnapshot?.imageUrl ||
                    "https://via.placeholder.com/400x200.png",
                }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default OrderStatusScreen;