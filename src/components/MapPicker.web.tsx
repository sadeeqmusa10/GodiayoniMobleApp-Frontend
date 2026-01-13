import React from "react";
import { View, Text } from "react-native";

type Props = {
  label?: string;
  onLocationSelected: (coords: { lat: number; lng: number }) => void;
};

export default function MapPicker({ label }: Props) {
  return (
    <View className="mb-4 p-4 border rounded-xl bg-gray-200">
      <Text className="font-semibold mb-1">
        {label || "Location"}
      </Text>
      <Text className="text-gray-600">
        Map selection is not supported on web.
        Please use the address field.
      </Text>
    </View>
  );
}
