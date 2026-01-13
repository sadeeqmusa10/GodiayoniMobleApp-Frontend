import React from "react";
import { View, Text, ScrollView } from "react-native";
import ManageRestaurantForm from "../forms/manage-restaurant-form/ManageRestaurantform";
import { useCreateAdminRestaurant } from "../Api/AdminApi";
import { useNavigation } from "@react-navigation/native";

const AddNewRestaurantScreen: React.FC = () => {
  const navigation = useNavigation();
  const { mutateAsync: createAdminRestaurant, isPending } =
    useCreateAdminRestaurant();

  return (
    <ScrollView className="flex-1 bg-gray-50 px-4 pt-6">
      <Text className="text-xl text-center font-bold mb-4">Create New Restaurant</Text>

     <ManageRestaurantForm
  mode="create"
  restaurant={undefined}
  isLoading={isPending}
  onSave={async (formData) => {
    await createAdminRestaurant(formData);
    navigation.goBack();
  }}
/>

    </ScrollView>
  );
};

export default AddNewRestaurantScreen;
