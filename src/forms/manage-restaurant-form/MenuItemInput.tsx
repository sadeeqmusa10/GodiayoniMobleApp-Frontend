import React from "react";
import { View, TextInput, Text, TouchableOpacity, Image } from "react-native";
import { useFormContext, Controller, FieldErrors } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

type MenuItem = {
  name: string;
  price: number;
  imageFile?: {
    uri: string;
    type?: string;
    name?: string;
  };
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

  const pickImage = async (onChange: any) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      onChange({
        uri: result.assets[0].uri,
        type: "image/jpeg",
        name: `menu-${index}.jpg`,
      });
    }
  };

  return (
    <View className="flex flex-col space-y-4">
      {/* Name */}
      <Controller
        control={control}
        name={`menuItem.${index}.name`}
        render={({ field }) => (
          <View>
            <Text className="text-gray-700 font-semibold mb-1">Name</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-2 bg-white"
              placeholder="Fried Rice"
              value={field.value}
              onChangeText={field.onChange}
            />
            {fieldError?.name && (
              <Text className="text-red-500 text-sm">
                {fieldError.name.message as string}
              </Text>
            )}
          </View>
        )}
      />

      {/* Price */}
      <Controller
        control={control}
        name={`menuItem.${index}.price`}
        render={({ field }) => (
          <View>
            <Text className="text-gray-700 font-semibold mb-1">Price (₦)</Text>
            <TextInput
              keyboardType="numeric"
              className="border border-gray-300 rounded-lg px-4 py-2 bg-white"
              placeholder="1500"
              value={field.value ? field.value.toString() : ""}
              onChangeText={(text) => field.onChange(Number(text))}
            />
            {fieldError?.price && (
              <Text className="text-red-500 text-sm">
                {fieldError.price.message as string}
              </Text>
            )}
          </View>
        )}
      />

      {/* Image Upload */}
      <Controller
        control={control}
        name={`menuItem.${index}.imageFile`}
        render={({ field }) => (
          <View>
            <TouchableOpacity
              onPress={() => pickImage(field.onChange)}
              className="bg-orange-500 py-2 px-4 rounded-lg items-center"
            >
              <Text className="text-white font-semibold">
                Upload Menu Image
              </Text>
            </TouchableOpacity>

            {field.value?.uri && (
              <Image
                source={{ uri: field.value.uri }}
                style={{
                  width: "100%",
                  height: 150,
                  marginTop: 10,
                  borderRadius: 8,
                }}
              />
            )}
          </View>
        )}
      />

      {/* Remove */}
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
