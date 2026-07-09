import React from "react";
import { Alert, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getAuth } from "firebase/auth";

import WayBillDeliveryForm from "../forms/user-pickup-delivery-form/DeliveryForm";
import { useCreateWayBillDelivery } from "../Api/LogisticsApi";
import { RootStackParamList } from "../types";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "DeliveryScreen"
>;

export default function WayBillDeliveryScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { createWayBillDelivery, isPending } = useCreateWayBillDelivery();

  const auth = getAuth();
  const userEmail = auth.currentUser?.email;

  if (!userEmail) {
    Alert.alert("Authentication error", "Please sign in again.");
    return null;
  }

  const handleSubmit = async (formData: FormData) => {
    try {
      const { deliveryId } = await createWayBillDelivery(formData);

      navigation.replace("DeliveryOrderScreen", { deliveryId });
    } catch (error) {
      console.error("Failed to create delivery:", error);
      Alert.alert("Error", "Failed to create delivery.");
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 px-4 py-6">
      <WayBillDeliveryForm onSave={handleSubmit} isLoading={isPending} />
    </ScrollView>
  );
}
