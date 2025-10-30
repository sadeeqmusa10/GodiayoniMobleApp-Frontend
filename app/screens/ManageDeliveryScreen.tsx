// ManageDeliveryScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker"; // ✅ Use this for React Native
import {
  useGetAllDeliveries,
  useUpdateDeliveryStatus,
} from "@/app/Api/AdminApi";
import DeliveryInfo from "@/components/DeliveryInfo";
import DeliveryStatusHeader from "@/components/DeliveryStatusHeader";
import { DELIVERY_STATUS } from "@/app/config/delivery-status-config";
import { Delivery, DeliveryStatus } from "@/app/types";

const ManageDeliveryScreen: React.FC = () => {
  // ✅ Fetch deliveries
  const { data: deliveries, isLoading } = useGetAllDeliveries();
  const { mutateAsync: updateDeliveryStatus } = useUpdateDeliveryStatus();

  // ✅ Track status per delivery
  const [statusMap, setStatusMap] = useState<Record<string, DeliveryStatus>>(
    {}
  );

  // ✅ Initialize status map when deliveries are loaded
  useEffect(() => {
    if (deliveries?.length) {
      const initialStatuses = Object.fromEntries(
        deliveries.map((d) => [d.deliveryId, d.status])
      );
      setStatusMap(initialStatuses);
    }
  }, [deliveries]);

  // ✅ Handle status change
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

  if (!deliveries?.length) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-600 text-lg">No deliveries found.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      {deliveries.map((delivery) => (
        <View
          key={delivery.deliveryId}
          className="bg-white rounded-2xl p-5 mb-6 shadow-md"
        >
          {/* Header */}
          <DeliveryStatusHeader delivery={delivery} />

          {/* Info */}
          <View className="my-4">
            <DeliveryInfo delivery={delivery} />
          </View>

          {/* Status Selector */}
          <View className="mt-4">
            <Text className="text-gray-800 font-semibold mb-2">
              Update Delivery Status:
            </Text>

            <View className="border border-gray-300 rounded-lg overflow-hidden">
              <Picker
                selectedValue={statusMap[delivery.deliveryId]}
                onValueChange={(value) =>
                  handleStatusChange(
                    delivery.deliveryId,
                    value as DeliveryStatus
                  )
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
