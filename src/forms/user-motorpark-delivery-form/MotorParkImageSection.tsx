import { View, Text, Image, Pressable } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useFormContext, Controller } from "react-hook-form";
import FormSection from "../../components/ui/FormSection";

const MotorParkImageSection = () => {
  const { control } = useFormContext();

  const pickImage = async (onChange: (val: any) => void) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      onChange(result.assets[0]);
    }
  };

  return (
    <FormSection title="Image">
      <Controller
        control={control}
        name="imageFile"
        render={({ field }) => (
          <View className="gap-4">
            {field.value?.uri && (
              <View className="aspect-[16/9] rounded-xl overflow-hidden border">
                <Image
                  source={{ uri: field.value.uri }}
                  className="w-full h-full"
                />
              </View>
            )}

            <Pressable
              onPress={() => pickImage(field.onChange)}
              className="bg-orange-500 py-3 rounded-xl"
            >
              <Text className="text-white text-center font-semibold">
                {field.value?.uri ? "Change Image" : "Select Image"}
              </Text>
            </Pressable>
          </View>
        )}
      />
    </FormSection>
  );
};

export default MotorParkImageSection;
