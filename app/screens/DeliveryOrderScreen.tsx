import React from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router"; // or useRoute() if you’re using react-navigation
import {
  useCreateDeliverySession,
  useGetDeliveryOrder,
} from "../Api/DeliveryApi";
import DeliveryCheckoutButton from "@/components/DeliveryCheckoutButton";
import DeliveryInfo from "@/components/DeliveryInfo";

const DeliveryOrderScreen = () => {
  const { deliveryId } = useLocalSearchParams<{ deliveryId: string }>();
  const { data: delivery, isLoading } = useGetDeliveryOrder(
    deliveryId as string
  );
  const { createDeliverySession, isPending: isCheckoutLoading } =
    useCreateDeliverySession();

  const onCheckout = async () => {
    try {
      const session = await createDeliverySession({ deliveryId: deliveryId! });

      // In web: window.location.href = session.url;
      // In mobile: use Linking to open the payment URL
      import("react-native").then(({ Linking }) => {
        Linking.openURL(session.url);
      });
    } catch (error) {
      console.error("Checkout failed", error);
      Alert.alert("Checkout failed", "Please try again later.");
    }
  };

  if (isLoading)
    return <Text className="text-center py-10 text-gray-700">Loading...</Text>;

  if (!delivery)
    return (
      <Text className="text-center py-10 text-gray-700">
        No delivery found.
      </Text>
    );

  return (
    <ScrollView className="flex-1 bg-gray-50 px-6 py-6 space-y-8">
      <View className="bg-white rounded-2xl p-6 shadow">
        <DeliveryInfo delivery={delivery} />
      </View>

      <View className="pt-8">
        <DeliveryCheckoutButton
          onCheckout={onCheckout}
          delivery={delivery}
          isLoading={isCheckoutLoading}
        />
      </View>
    </ScrollView>
  );
};

export default DeliveryOrderScreen;
