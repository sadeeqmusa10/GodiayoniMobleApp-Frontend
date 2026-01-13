import React from "react";
import { Alert, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getAuth } from "firebase/auth";

import { useCreateMyDelivery } from "../Api/DeliveryApi";
import UserDeliveryForm from "../forms/user-delivery-form/DeliveryForm";
import { RootStackParamList } from "../types";

type DeliveryScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList, "DeliveryScreen">;

const DeliveryScreen = () => {
  const navigation = useNavigation<DeliveryScreenNavigationProp>();
  const { createDelivery, isPending } = useCreateMyDelivery();

  const auth = getAuth();
  const userEmail = auth.currentUser?.email;

  if (!userEmail) {
    Alert.alert(
      "Authentication error",
      "Please sign in again to create a delivery."
    );
    return null;
  }

  const handleSubmit = async (formData: FormData) => {
    try {
      const { deliveryId } = await createDelivery(formData);
      navigation.replace("DeliveryOrderScreen", { deliveryId });
    } catch (error) {
      console.error("Failed to create delivery:", error);
      Alert.alert("Error", "Failed to create delivery. Please try again.");
    }
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#F3F4F6",
        paddingHorizontal: 16,
        paddingVertical: 24,
      }}
    >
      <UserDeliveryForm
        onSave={handleSubmit}
        isLoading={isPending}
        userEmail={userEmail}  
      />
    </ScrollView>
  );
};

export default DeliveryScreen;
