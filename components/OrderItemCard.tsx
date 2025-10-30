import React, { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { Order, OrderStatus } from "@/app/types";
import { ORDER_STATUS } from "@/app/config/order-status-config";
import { useUpdateAdminOrderStatus } from "@/app/Api/AdminApi";

type Props = {
  order: Order;
};

const OrderItemCard = ({ order }: Props) => {
  const { mutate: updateStatusOrderRequest, isPending } =
    useUpdateAdminOrderStatus();
  const [status, setStatus] = useState<OrderStatus>(order.status);

  useEffect(() => {
    setStatus(order.status);
  }, [order.status]);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    await updateStatusOrderRequest({
      orderId: order.id as string,
      status: newStatus,
    });
    setStatus(newStatus);
  };

  const getTime = () => {
    const createdDate =
      "toDate" in order.createdAt
        ? order.createdAt.toDate()
        : new Date(order.createdAt._seconds * 1000);

    createdDate.setMinutes(
      createdDate.getMinutes() + order.restaurant.estimatedDeliveryTime
    );

    return createdDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
      {/* Header Info */}
      <View className="mb-3">
        <Text className="font-bold text-lg mb-1">Order Information</Text>
        <Text className="text-gray-700">
          <Text className="font-semibold">Customer:</Text>{" "}
          {order.deliveryDetails.name}
        </Text>
        <Text className="text-gray-700">
          <Text className="font-semibold">Address:</Text>{" "}
          {order.deliveryDetails.addressLine1}, {order.deliveryDetails.city}
        </Text>
        <Text className="text-gray-700">
          <Text className="font-semibold">Time:</Text> {getTime()}
        </Text>
        <Text className="text-gray-700">
          <Text className="font-semibold">Total:</Text> ₦
          {((order.totalAmount / 100) * 100).toFixed(2)}
        </Text>
      </View>

      {/* Cart Items */}
      <View className="border-t border-gray-200 mt-2 pt-3">
        <Text className="font-bold mb-2">Items</Text>
        {order.cartItems.map((cartItem, idx) => (
          <View key={idx} className="flex-row items-center mb-1">
            <View className="bg-gray-200 rounded-full px-2 py-1 mr-2">
              <Text className="text-sm font-bold">{cartItem.quantity}</Text>
            </View>
            <Text className="text-gray-800">{cartItem.name}</Text>
          </View>
        ))}
      </View>

      {/* Status Picker */}
      <View className="mt-4">
        <Text className="font-bold mb-2">Order Status</Text>
        <View className="border border-gray-300 rounded-md p-2">
          <RNPickerSelect
            onValueChange={(value) => handleStatusChange(value as OrderStatus)}
            value={status}
            disabled={isPending}
            placeholder={{ label: "Select Status", value: null }}
            items={ORDER_STATUS.map((s) => ({
              label: s.label,
              value: s.value,
            }))}
          />
        </View>
      </View>
    </View>
  );
};

export default OrderItemCard;
