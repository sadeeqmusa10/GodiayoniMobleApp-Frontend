import React from "react";
import { View, Text } from "react-native";
import { Order } from "../types";
import ORDER_STATUS from "../config/order-status-config";

type Props = {
  order: Order;
};

const OrderStatusHeader = ({ order }: Props) => {
  const createdDate =
    "toDate" in order.createdAt
      ? order.createdAt.toDate()
      : new Date(order.createdAt._seconds * 1000);

  const expectedDate = new Date(createdDate);
  expectedDate.setMinutes(
    expectedDate.getMinutes() + (order.deliveryTimeMinutes || 0)
  );

  const statusInfo =
    ORDER_STATUS.find((o) => o.value === order.status) ??
    ORDER_STATUS[0];

  return (
    <View className="space-y-4 p-4">
      <Text className="text-2xl font-bold">
        Order Status: {statusInfo.label}
      </Text>

      <Text className="text-gray-600">
        Expected by:{" "}
        {order.deliveryTimeMinutes
          ? expectedDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "N/A"}
      </Text>

      <View className="w-full h-3 bg-gray-300 rounded-full">
        <View
          className="h-3 bg-orange-500 rounded-full"
          style={{
            width: `${statusInfo.progressValue}%`,
          }}
        />
      </View>
    </View>
  );
};
export default OrderStatusHeader;
