import React from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { useFormContext, Controller, FieldErrors } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";

type MenuItem = {
  name: string;
  price: number;
};

type FormValues = {
  menuItem: MenuItem[];
};

type Props = {
  index: number;
  removeMenuItem: () => void;
};

const MenuItemInput = ({ index, removeMenuItem }: Props) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<FormValues>();

  const fieldError =
    (errors.menuItem && (errors.menuItem as FieldErrors<MenuItem>[])[index]) ||
    {};

  return (
    <View className="flex flex-col space-y-4">
      {/* Name Input */}
      <View>
        <Text className="text-gray-700 font-semibold mb-1">Name</Text>
        <Controller
          control={control}
          name={`menuItem.${index}.name`}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-2 bg-white"
              placeholder="fried rice"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          )}
        />
        {fieldError?.name && (
          <Text className="text-red-500 text-sm">
            {fieldError.name.message as string}
          </Text>
        )}
      </View>

      {/* Price Input */}
      <View>
        <Text className="text-gray-700 font-semibold mb-1">Price (₦)</Text>
        <Controller
          control={control}
          name={`menuItem.${index}.price`}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-2 bg-white"
              placeholder="1500"
              keyboardType="numeric"
              value={value ? value.toString() : ""}
              onBlur={onBlur}
              onChangeText={(text) => onChange(Number(text))}
            />
          )}
        />
        {fieldError?.price && (
          <Text className="text-red-500 text-sm">
            {fieldError.price.message as string}
          </Text>
        )}
      </View>

      {/* Remove Button */}
      <TouchableOpacity
        onPress={removeMenuItem}
        className="bg-red-500 py-2 px-4 rounded-lg flex-row items-center justify-center mt-2"
      >
        <Ionicons name="trash" size={18} color="white" />
        <Text className="text-white font-semibold ml-2">Remove</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MenuItemInput;
