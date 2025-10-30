import React from "react";
import { View, Text } from "react-native";

const BlockedAccountScreen = () => {
  return (
    <View className="flex-1 items-center justify-center bg-red-50 px-6">
      <Text className="text-3xl font-bold text-red-600 mb-4">
        Access Denied
      </Text>

      <Text className="text-gray-700 text-center mb-6">
        Your account has been{" "}
        <Text className="font-bold">blocked or disabled</Text>.{"\n"}
        If this was a mistake, please contact support.
      </Text>

      <Text className="text-sm text-gray-500">support@godiya.app</Text>
    </View>
  );
};

export default BlockedAccountScreen;
