import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useGetAllAdminOrders } from "../Api/AdminApi";
import OrderItemCard from "../components/OrderItemCard";

const ManageOrdersScreen: React.FC = () => {
  // Fetch all orders
  const { data: orders = [], isLoading, error } = useGetAllAdminOrders();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading orders...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center px-4">
        <Text className="text-red-500">Failed to load orders: {error.message}</Text>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>No orders found</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {orders.map((order) => (
        <OrderItemCard key={order.id} order={order} />
      ))}
    </ScrollView>
  );
};

export default ManageOrdersScreen;
