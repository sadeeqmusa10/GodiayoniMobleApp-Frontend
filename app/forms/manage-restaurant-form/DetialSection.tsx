import { View, Text, TextInput } from "react-native";
import { useFormContext, Controller } from "react-hook-form";

const DetailSection = () => {
  const { control } = useFormContext();

  const renderInput = (name: string, label: string, placeholder?: string) => (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <View className="flex-1 mb-2">
          <Text className="text-sm font-semibold mb-1">{label}</Text>
          <TextInput
            {...field}
            placeholder={placeholder}
            className="bg-white border border-gray-300 rounded-md px-3 py-2"
          />
        </View>
      )}
    />
  );

  return (
    <View className="space-y-4">
      <View>
        <Text className="text-2xl font-bold">Details</Text>
        <Text className="text-sm text-gray-500">
          Enter details about your restaurant
        </Text>
      </View>

      {renderInput("restaurantName", "Name")}

      <View className="flex-row gap-4">
        {renderInput("city", "City")}
        {renderInput("country", "Country")}
      </View>

      <View className="flex-row gap-4">
        {renderInput("deliveryPrice", "Delivery Price (₦)", "500")}
        {renderInput(
          "estimatedDeliveryTime",
          "Estimated Delivery Time (minutes)",
          "30"
        )}
      </View>
    </View>
  );
};

export default DetailSection;
