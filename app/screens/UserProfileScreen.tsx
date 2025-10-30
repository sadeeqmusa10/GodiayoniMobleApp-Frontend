import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useGetMyUser, useUpdateMyUser } from "@/app/Api/MyUserApi";
import UserProfileForm from "@/app/forms/user-profile-form/UserProfileForm"; // note spelling consistency

const UserProfileScreen = () => {
  const { currentUser, isPending: isGetLoading } = useGetMyUser();
  const { mutate: updateUser, isPending: isUpdateLoading } = useUpdateMyUser();

  if (isGetLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#f97316" />
        <Text className="text-gray-700 mt-3">Loading...</Text>
      </View>
    );
  }

  if (!currentUser) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-red-500 font-semibold">
          Unable to load user profile.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <UserProfileForm
        currentUser={currentUser}
        onSave={updateUser}
        isLoading={isUpdateLoading}
      />
    </View>
  );
};

export default UserProfileScreen;
