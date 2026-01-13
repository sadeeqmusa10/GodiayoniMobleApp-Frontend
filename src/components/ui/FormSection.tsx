import React from "react";
import { View, Text } from "react-native";

export default function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View className="bg-white rounded-2xl p-5 gap-4 shadow-sm">
      <Text className="text-2xl font-bold text-gray-800 text-center mb-4">
        {title}
      </Text>
      {children}
    </View>
  );
}
