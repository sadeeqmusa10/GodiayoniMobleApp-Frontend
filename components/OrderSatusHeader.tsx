import React from "react";
import { View, Text } from "react-native";
import { Order } from "@/app/types";
import { ORDER_STATUS } from "../app/config/order-status-config";

type Props = {
  order: Order;
};

const OrderStatusHeader = ({ order }: Props) => {
  const getExpectedDelivery = () => {
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

  const getOrderStatusInfo = () => {
    return (
      ORDER_STATUS.find((o) => o.value === order.status) || ORDER_STATUS[0]
    );
  };

  const statusInfo = getOrderStatusInfo();

  return (
    <View className="space-y-4 p-4">
      <View className="flex flex-col md:flex-row justify-between">
        <Text className="text-2xl font-bold text-gray-800">
          Order Status: {statusInfo.label}
        </Text>
        <Text className="text-lg text-gray-600">
          Expected by: {getExpectedDelivery()}{" "}
          {new Date(
            "toDate" in order.createdAt
              ? order.createdAt.toDate()
              : order.createdAt._seconds * 1000
          ).toLocaleDateString()}
        </Text>
      </View>

      {/* Custom progress bar */}
      <View className="w-full h-3 bg-gray-300 rounded-full overflow-hidden">
        <View
          className="h-3 bg-orange-500 rounded-full"
          style={{ width: `${statusInfo.progressValue}%` }}
        />
      </View>
    </View>
  );
};

export default OrderStatusHeader;
