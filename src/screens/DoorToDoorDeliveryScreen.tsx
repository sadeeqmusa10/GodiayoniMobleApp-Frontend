import React from "react";
import { Alert, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getAuth } from "firebase/auth";

import DoorToDoorForm from "../forms/user-doortodoor-delivery-form/DooToDoorForm";
import { useCreateMyDoorToDoorDelivery } from "../Api/LogisticsApi";
import { RootStackParamList } from "../types";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "DeliveryScreen"
>;

export default function DoorToDoorDeliveryScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { createDoorToDoorDelivery, isPending } = useCreateMyDoorToDoorDelivery();

  const auth = getAuth();
  const userEmail = auth.currentUser?.email;

  if (!userEmail) {
    Alert.alert("Authentication error", "Please sign in again.");
    return null;
  }

  const handleSubmit = async (formData: FormData) => {
    try {
      const { deliveryId } = await createDoorToDoorDelivery(formData);

      navigation.replace("DeliveryOrderScreen", { deliveryId });
    } catch (error) {
      console.error("Failed to create delivery:", error);
      Alert.alert("Error", "Failed to create delivery.");
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 px-4 py-6">
      <DoorToDoorForm onSave={handleSubmit} isLoading={isPending} />
    </ScrollView>
  );
}
