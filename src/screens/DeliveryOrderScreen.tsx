import React from "react";
import { View, Text, ScrollView, Alert, Platform } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { useGetDeliveryOrder } from "@/Api/DeliveryApi";
import { useCreateDeliverySession } from "@/Api/DeliveryApi";
import DeliveryCheckoutButton from "../components/DeliveryCheckoutButton";
import DeliveryInfo from "../components/DeliveryInfo";
import { RootStackParamList } from "../types";

type DeliveryOrderRouteProp = RouteProp<
  RootStackParamList,
  "DeliveryOrderScreen"
>;

const DeliveryOrderScreen = () => {
  const route = useRoute<DeliveryOrderRouteProp>();
  const { deliveryId } = route.params;

  const { data: delivery, isLoading, isError } = useGetDeliveryOrder(deliveryId);
  const { createDeliverySession, isPending } = useCreateDeliverySession();

  const onCheckout = async () => {
    if (!delivery || isPending || delivery.price <= 0) return;

    try {
      const session = await createDeliverySession({ deliveryId });

      if (!session?.url) throw new Error("No checkout URL returned");

      if (Platform.OS === "web") {
        window.location.assign(session.url);
      } else {
        const { Linking } = await import("react-native");
        await Linking.openURL(session.url);
      }
    } catch (error: any) {
      console.error("Checkout failed", error);
      Alert.alert("Checkout failed", "Please try again later.");
    }
  };

  if (isLoading) {
    return <Text className="text-center py-10">Loading delivery...</Text>;
  }

  if (isError || !delivery) {
    return <Text className="text-center py-10">Delivery not found.</Text>;
  }

  // Prevent checkout if price invalid
  const isPriceValid = delivery.price < 1000;

  return (
    <ScrollView className="flex-1 bg-gray-50 px-6 py-6">
      <View className="bg-white rounded-2xl p-6 shadow-md">
        <DeliveryInfo delivery={delivery} />
      </View>

      <View className="mt-4">
        <Text className="text-lg font-semibold">
          Delivery Price: {isPriceValid ? `${delivery.price} NGN` : "Unavailable"}
        </Text>
        <Text className="text-sm text-gray-500 mt-1">
          Estimated delivery time: {delivery.estimatedDeliveryTime} mins
        </Text>
      </View>

      <View className="pt-8">
        <DeliveryCheckoutButton
          onCheckout={onCheckout}
          delivery={delivery}
          isLoading={isPending}
          disabled={!isPriceValid} // ✅ disables button if price invalid
        />
        {!isPriceValid && (
          <Text className="text-red-500 text-sm mt-2">
            Delivery price could not be calculated. Please review addresses.
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

export default DeliveryOrderScreen;
