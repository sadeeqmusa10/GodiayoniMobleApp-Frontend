import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useFieldArray, useFormContext } from "react-hook-form";
import MenuItemInput from "./MenuItemInput";
import { Ionicons } from "@expo/vector-icons";

const MenuSection = () => {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "menuItem",
  });

  return (
    <View className="space-y-4">
      {/* Header */}
      <View>
        <Text className="text-2xl font-bold text-gray-800">Menu</Text>
        <Text className="text-gray-500 text-sm">
          Please add a name and a price
        </Text>
      </View>

      {/* Menu Item Inputs */}
      <ScrollView className="space-y-4">
        {fields.map((field, index) => (
          <View
            key={field.id}
            className="bg-gray-50 p-4 rounded-xl border border-gray-200"
          >
            <MenuItemInput index={index} removeMenuItem={() => remove(index)} />
          </View>
        ))}
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity
        onPress={() => append({ name: "", price: undefined })}
        className="bg-orange-500 py-3 rounded-xl flex-row items-center justify-center"
      >
        <Ionicons name="add" size={20} color="white" />
        <Text className="text-white font-semibold ml-2">Add Menu Item</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MenuSection;
