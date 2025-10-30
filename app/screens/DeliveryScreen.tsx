import React from "react";
import { Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router"; // useNavigation if using React Navigation
import { useCreateMyDelivery } from "../Api/DeliveryApi";
import UserDeliveryForm from "../forms/user-delivery-form/DeliveryForm";

const DeliveryScreen = () => {
  const { createDelivery, isPending } = useCreateMyDelivery();
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    try {
      const deliveryId = await createDelivery(formData);
      router.push(`/deliveryOrder/${deliveryId.deliveryId}`);
    } catch (error) {
      console.error("Failed to create delivery:", error);
      Alert.alert("Error", "Failed to create delivery. Please try again.");
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 px-4 py-6">
      <UserDeliveryForm onSave={handleSubmit} isLoading={isPending} />
    </ScrollView>
  );
};

export default DeliveryScreen;
