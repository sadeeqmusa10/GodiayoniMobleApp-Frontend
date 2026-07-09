import { View, Text, TextInput } from "react-native";
import { useFormContext, Controller } from "react-hook-form";
import FormSection from "../../components/ui/FormSection";

const MotorParkDetailSection = () => {
  const { control } = useFormContext();

  return (
    <FormSection title="Package Details">
      {/* Description */}
      <Controller
        control={control}
        name="package.description"
        render={({ field }) => (
          <View className="gap-1">
            <Text className="font-medium">Package Description</Text>
            <TextInput
              {...field}
              multiline
              numberOfLines={4}
              className="border border-gray-300 rounded-xl p-3 text-black"
              textAlignVertical="top"
            />
          </View>
        )}
      />

      {/* Weight */}
      <Controller
        control={control}
        name="package.weight"
        render={({ field }) => (
          <View className="gap-1">
            <Text className="font-medium">Weight (kg)</Text>
            <TextInput
              keyboardType="numeric"
              value={String(field.value ?? "")}
              onChangeText={(v) => field.onChange(Number(v))}
              className="border border-gray-300 rounded-xl p-3"
            />
          </View>
        )}
      />

      {/* Value */}
      <Controller
        control={control}
        name="package.value"
        render={({ field }) => (
          <View className="gap-1">
            <Text className="font-medium">Estimated Value (₦)</Text>
            <TextInput
              keyboardType="numeric"
              value={String(field.value ?? "")}
              onChangeText={(v) => field.onChange(Number(v))}
              className="border border-gray-300 rounded-xl p-3"
            />
          </View>
        )}
      />
    </FormSection>
  );
};

export default MotorParkDetailSection;
