import React from "react";
import { View, Text } from "react-native";
import { Delivery } from "@/types";
import { DELIVERY_STATUS } from "../config/delivery-status-config";

type Props = {
  delivery: Delivery;
};

const DeliveryStatusHeader = ({ delivery }: Props) => {
  const parseCreatedAt = (): Date => {
    return new Date(delivery.createdAt._seconds * 1000);
  };

  const getExpectedDelivery = () => {
    const createdDate = parseCreatedAt();

    const expected = new Date(createdDate);
    expected.setMinutes(
      expected.getMinutes() + delivery.estimatedDeliveryTime
    );

    return expected.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCreatedDate = () => {
    return parseCreatedAt().toLocaleDateString();
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
      <Text className="text-2xl font-bold tracking-tight mb-3">
        Expected by: {getExpectedDelivery()} {getCreatedDate()}
      </Text>

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
