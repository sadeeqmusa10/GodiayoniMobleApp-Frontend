// screens/DeliveryStatusScreen.tsx
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useGetMyDeliveries } from "../Api/DeliveryOrderApi";
import DeliveryInfo from "../components/DeliveryInfo";
import DeliveryStatusHeader from "../components/DeliveryStatusHeader";

const DeliveryStatusScreen = () => {
  const { data: deliveries, isLoading } = useGetMyDeliveries();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#f97316" />
        <Text className="mt-4 text-gray-600">Loading...</Text>
      </View>
    );
  }

  if (!deliveries || deliveries.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-gray-600">No deliveries found.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 px-4 py-6">
      {deliveries.map((item) => (
        <View key={item.deliveryId} className="mb-8">
          <DeliveryStatusHeader delivery={item} />
          <View className="bg-white rounded-2xl p-5 mt-4">
            <DeliveryInfo delivery={item} />
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default DeliveryStatusScreen;
