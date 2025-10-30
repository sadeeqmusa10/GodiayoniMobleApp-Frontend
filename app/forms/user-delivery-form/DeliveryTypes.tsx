import React from "react";
import { View, Text } from "react-native";
import { useFormContext, Controller } from "react-hook-form";
import { Picker } from "@react-native-picker/picker";

const DeliveryTypes = () => {
  const { control } = useFormContext();

  return (
    <View className="flex flex-col gap-5">
      {/* Header */}
      <Text className="font-semibold text-2xl text-center text-gray-800">
        Delivery Type
      </Text>

      {/* Picker Field */}
      <Controller
        control={control}
        name="deliveryType"
        render={({ field: { onChange, value } }) => (
          <View className="bg-white rounded-xl border border-gray-300">
            <Picker
              selectedValue={value}
              onValueChange={(itemValue) => onChange(itemValue)}
              style={{ color: "black" }}
            >
              <Picker.Item label="Standard" value="standard" />
              <Picker.Item label="Express" value="express" />
              <Picker.Item label="Same Day" value="same-day" />
            </Picker>
          </View>
        )}
      />
    </View>
  );
};

export default DeliveryTypes;
