import React from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useGetDelivery } from "../Api/DeliveryOrderApi";
import DeliveryInfo from "@/components/DeliveryInfo";
import DeliveryStatusHeader from "@/components/DeliveryStatusHeader";

const DeliveryStatusScreen = () => {
  const { delivery, isLoading } = useGetDelivery();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-10 bg-gray-50">
        <ActivityIndicator size="large" color="#f97316" />
        <Text className="mt-4 text-gray-600 text-lg">Loading...</Text>
      </View>
    );
  }

  if (!delivery?.length) {
    return (
      <View className="flex-1 items-center justify-center py-10 bg-gray-50">
        <Text className="text-gray-600 text-lg">No deliveries found.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 px-4 py-6">
      {delivery.map((item, index) => (
        <View key={index} className="mb-8">
          <DeliveryStatusHeader delivery={item} />
          <View className="bg-white shadow-md rounded-2xl p-5 mt-4">
            <DeliveryInfo delivery={item} />
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default DeliveryStatusScreen;
