import React, { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  useGetAllAdminOrders,
  useUpdateAdminOrderStatus,
} from "../Api/AdminApi";
import { Order, OrderStatus } from "@/types";
import ORDER_STATUS from "@/config/order-status-config";
import OrderStatusDetail from "@/components/OrderStatusDetail";
import OrderStatusHeader from "@/components/OrderStatusHeader";

const ManageOrdersScreen: React.FC = () => {
  const { data: orders = [], isLoading, error } = useGetAllAdminOrders();
  const { mutateAsync:UpdateOrderStatusRequest } = useUpdateAdminOrderStatus();

  const [statusMap, setStatusMap] = useState<Record<string, OrderStatus>>({});

  // Initialize status map when orders load
  useEffect(() => {
    const initialStatuses: Record<string, OrderStatus> = {};

    orders.forEach((order: Order) => {
      initialStatuses[order.id] = order.status;
    });

    setStatusMap(initialStatuses);
  }, [orders]);

  // Handle status change
  const handleStatusChange = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    try {
      await UpdateOrderStatusRequest({
        orderId,
        status: newStatus,
      });

      setStatusMap((prev) => ({
        ...prev,
        [orderId]: newStatus,
      }));
    } catch (err) {
      console.error("Failed to update order status", err);
    }
  };

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
        <Text className="text-red-500">
          Failed to load orders: {error.message}
        </Text>
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
        <View
          key={order.id}
          className="bg-white p-5 rounded-2xl mb-6 boxShadow"
        >
          <OrderStatusHeader order={order} />

          <View className="mt-4 gap-6">
            <OrderStatusDetail order={order} />

            <View className="mt-3">
              <Text className="text-gray-800 font-semibold mb-2">
                Update Order Status
              </Text>

              <View className="border border-gray-300 rounded-lg overflow-hidden">
                <Picker
                  selectedValue={statusMap[order.id] ?? order.status}
                  onValueChange={(value) =>
                    handleStatusChange(order.id, value as OrderStatus)
                  }
                >
                  {ORDER_STATUS.map((status) => (
                    <Picker.Item
                      key={status.value}
                      label={status.label}
                      value={status.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default ManageOrdersScreen;
