import React from "react";
import { View, Text, Image, ScrollView, ActivityIndicator } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { useGetOrderById } from "../Api/OrderApi";
import OrderStatusDetail from "../components/OrderStatusDetail";
import OrderStatusHeader from "../components/OrderStatusHeader";

type RouteParams = {
  OrderStatusScreen: {
    orderId?: string;
  };
};

const OrderStatusScreen = () => {
  const route = useRoute<RouteProp<RouteParams, "OrderStatusScreen">>();
  const orderId = route.params?.orderId;

  const {
    order,
    isPending,
    isError,
  } = useGetOrderById(orderId!, {
    enabled: !!orderId,
    refetchInterval: 5000, // 🔁 Poll every 5s until webhook updates
  });

  // ❌ No orderId passed
  if (!orderId) {
    return (
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-lg text-center font-medium">
          Invalid payment session.
        </Text>
      </View>
    );
  }

  // ⏳ Loading / polling
  if (isPending) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
        <Text className="mt-3 text-base">
          Checking payment status...
        </Text>
      </View>
    );
  }

  // ❌ Error
  if (isError || !order) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-red-600">
          Failed to load order
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <View className="bg-white p-5 rounded-2xl mb-6 boxShadow">
        <OrderStatusHeader order={order} />

        <View className="mt-4 gap-6">
          <OrderStatusDetail order={order} />

          <View className="w-full h-48 rounded-lg overflow-hidden">
            <Image
              source={{
                uri:
                  order.restaurant?.imageUrl ||
                  "https://via.placeholder.com/400x200.png",
              }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default OrderStatusScreen;
