import { View, Text, Image, Pressable } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Controller, useFormContext } from "react-hook-form";

const ImageSection = () => {
  const { control, watch, setValue } = useFormContext();
  const existingImageUrl = watch("imageUrl");

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      // In React Native, result.assets[0].uri contains the image path
      setValue("imageFile", result.assets[0]);
      setValue("imageUrl", result.assets[0].uri);
    }
  };

  return (
    <View className="space-y-4">
      <View>
        <Text className="text-2xl font-bold">Image</Text>
        <Text className="text-sm text-gray-500">Add package Image</Text>
      </View>

      <Controller
        control={control}
        name="imageFile"
        render={() => (
          <View className="space-y-4">
            {existingImageUrl && (
              <View className="w-full h-60 overflow-hidden rounded-md">
                <Image
                  source={{ uri: existingImageUrl }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              </View>
            )}
            <Pressable
              onPress={pickImage}
              className="bg-gray-200 px-4 py-2 rounded-md"
            >
              <Text>Select Image</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
};

export default ImageSection;
