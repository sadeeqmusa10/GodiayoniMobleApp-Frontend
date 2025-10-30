import React from "react";
import { View, Text } from "react-native";
import { Delivery } from "@/app/types";
import { DELIVERY_STATUS } from "@/app/config/delivery-status-config";

type Props = {
  delivery: Delivery;
};

const DeliveryStatusHeader = ({ delivery }: Props) => {
  const getExpectedDelivery = () => {
    const createdDate =
      "toDate" in delivery.createdAt
        ? delivery.createdAt.toDate()
        : new Date(delivery.createdAt._seconds * 1000);

    createdDate.setMinutes(
      createdDate.getMinutes() + delivery.estimatedDeliveryTime
    );

    return createdDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDeliveryStatusInfo = () => {
    return (
      DELIVERY_STATUS.find((o) => o.value === delivery.status) ||
      DELIVERY_STATUS[0]
    );
  };

  const progressValue = getDeliveryStatusInfo().progressValue;

  return (
    <View className="w-full mb-4">
      {/* Header text */}
      <Text className="text-2xl font-bold tracking-tight mb-3">
        Expected by: {getExpectedDelivery()}{" "}
        {new Date(
          "toDate" in delivery.createdAt
            ? delivery.createdAt.toDate()
            : delivery.createdAt._seconds * 1000
        ).toLocaleDateString()}
      </Text>

      {/* Progress Bar */}
      <View className="h-3 w-full bg-gray-300 rounded-full overflow-hidden">
        <View
          className="h-full bg-green-500 rounded-full"
          style={{ width: `${progressValue}%` }}
        />
      </View>
    </View>
  );
};

export default DeliveryStatusHeader;
