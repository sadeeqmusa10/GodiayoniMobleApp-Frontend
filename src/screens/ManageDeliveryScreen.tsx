import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  useGetAllDeliveries,
  useUpdateDeliveryStatus,
} from "../Api/AdminApi";

import DeliveryInfo from "../components/DeliveryInfo";
import DeliveryStatusHeader from "../components/DeliveryStatusHeader";
import { DELIVERY_STATUS } from "../config/delivery-status-config";
import { Delivery, DeliveryStatus } from "../types";

const ManageDeliveryScreen: React.FC = () => {
  const { data: deliveries = [], isLoading } = useGetAllDeliveries();
  const { mutateAsync: updateDeliveryStatus } = useUpdateDeliveryStatus();

  const [statusMap, setStatusMap] = useState<Record<string, DeliveryStatus>>({});

  // Initialize status map
  useEffect(() => {
    const initialStatuses: Record<string, DeliveryStatus> = {};
    deliveries.forEach((d: Delivery) => {
      initialStatuses[d.deliveryId] = d.status;
    });
    setStatusMap(initialStatuses);
  }, [deliveries]);

  // Handle status change
  const handleStatusChange = async (
    deliveryId: string,
    newStatus: DeliveryStatus
  ) => {
    try {
      await updateDeliveryStatus({ deliveryId, status: newStatus });
      setStatusMap((prev) => ({ ...prev, [deliveryId]: newStatus }));
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#f97316" />
        <Text className="mt-2 text-gray-600">Loading deliveries...</Text>
      </View>
    );
  }

  if (!deliveries.length) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-600 text-lg">No deliveries found.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      {deliveries.map((delivery: Delivery) => (
        <View
          key={delivery.deliveryId}
          className="bg-white rounded-2xl p-5 mb-6 boxShadow-md"
        >
          <DeliveryStatusHeader delivery={delivery} />

          <View className="my-4">
            <DeliveryInfo delivery={delivery} />
          </View>

          <View className="mt-4">
            <Text className="text-gray-800 font-semibold mb-2">
              Update Delivery Status:
            </Text>

            <View className="border border-gray-300 rounded-lg overflow-hidden">
              <Picker
                selectedValue={statusMap[delivery.deliveryId]}
                onValueChange={(value) =>
                  handleStatusChange(delivery.deliveryId, value as DeliveryStatus)
                }
              >
                {DELIVERY_STATUS.map((status) => (
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
      ))}
    </ScrollView>
  );
};

export default ManageDeliveryScreen;
