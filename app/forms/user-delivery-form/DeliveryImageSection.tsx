import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useFormContext, Controller } from "react-hook-form";

const ImageSection = () => {
  const { control, watch } = useFormContext();
  const existingImageUrl = watch("imageUrl");

  // Function to pick an image from device
  const pickImage = async (onChange: (value: any) => void) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert(
        "Permission denied! You need to allow access to your media library."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      const pickedImage = result.assets[0];
      onChange(pickedImage); // store image object
    }
  };

  return (
    <View className="space-y-4">
      <View>
        <Text className="text-2xl font-bold">Image</Text>
        <Text className="text-gray-600">Add an image</Text>
      </View>

      <View className="flex flex-col gap-4 w-full">
        {/* Preview existing or selected image */}
        {existingImageUrl && (
          <View className="aspect-[16/9] rounded-lg overflow-hidden border border-gray-300">
            <Image
              source={{ uri: existingImageUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        )}

        <Controller
          control={control}
          name="imageFile"
          render={({ field: { value, onChange } }) => (
            <View className="flex flex-col items-center">
              {value?.uri && (
                <Image
                  source={{ uri: value.uri }}
                  className="w-full aspect-[16/9] rounded-lg mb-3"
                  resizeMode="cover"
                />
              )}
              <Pressable
                onPress={() => pickImage(onChange)}
                className="bg-orange-500 px-4 py-3 rounded-lg"
              >
                <Text className="text-white font-medium">
                  {value?.uri ? "Change Image" : "Select Image"}
                </Text>
              </Pressable>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default ImageSection;
