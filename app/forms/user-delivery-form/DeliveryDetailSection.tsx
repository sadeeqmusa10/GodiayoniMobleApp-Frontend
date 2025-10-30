import React from "react";
import { View, TextInput, Text, ScrollView } from "react-native";
import { useFormContext, Controller } from "react-hook-form";

const DeliveryDetailSection = () => {
  const { control } = useFormContext();

  return (
    <ScrollView className="flex flex-col gap-5">
      {/* Section Title */}
      <Text className="font-semibold text-2xl text-center text-gray-800">
        Package Details
      </Text>

      {/* Package Description */}
      <Controller
        control={control}
        name="package.description"
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="flex flex-col gap-1">
            <Text className="text-base font-medium">Package Description</Text>
            <TextInput
              multiline
              numberOfLines={4}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="Describe the package..."
              className="bg-white rounded-xl border border-gray-300 p-3 text-black"
              textAlignVertical="top"
            />
          </View>
        )}
      />

      {/* Package Weight */}
      <Controller
        control={control}
        name="package.weight"
        render={({ field: { onChange, value } }) => (
          <View className="flex flex-col gap-1">
            <Text className="text-base font-medium">Weight (kg)</Text>
            <TextInput
              keyboardType="numeric"
              value={value?.toString() || ""}
              onChangeText={(text) => onChange(Number(text))}
              placeholder="Enter weight"
              className="bg-white rounded-xl border border-gray-300 p-3 text-black"
            />
          </View>
        )}
      />

      {/* Estimated Value */}
      <Controller
        control={control}
        name="package.value"
        render={({ field: { onChange, value } }) => (
          <View className="flex flex-col gap-1">
            <Text className="text-base font-medium">Estimated Value (₦)</Text>
            <TextInput
              keyboardType="numeric"
              value={value?.toString() || ""}
              onChangeText={(text) => onChange(Number(text))}
              placeholder="Enter estimated value"
              className="bg-white rounded-xl border border-gray-300 p-3 text-black"
            />
          </View>
        )}
      />
    </ScrollView>
  );
};

export default DeliveryDetailSection;
