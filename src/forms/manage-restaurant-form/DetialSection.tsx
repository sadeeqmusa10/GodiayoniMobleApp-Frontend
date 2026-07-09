import AddressInput from "@/components/GoogleAddressInput";
import { Controller, useFormContext } from "react-hook-form";
import { TextInput, View, Text } from "react-native";

const DetailSection = () => {
  const { control } = useFormContext();

  const renderInput = (
    name: string,
    label: string,
    placeholder?: string,
    keyboardType: "default" | "numeric" = "default"
  ) => (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <View className="flex-1 mb-2">
          <Text className="text-sm font-semibold mb-1">
            {label}
          </Text>
          <TextInput
            value={String(field.value ?? "")}
            onChangeText={field.onChange}
            placeholder={placeholder}
            keyboardType={keyboardType}
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

      {/* Restaurant Address */}
      <Controller
        control={control}
        name="address"
        render={({ field }) => (
          <View className="mb-4">
            <Text className=" mb-1">
              Restaurant Address
            </Text>

            <AddressInput
              placeholder="Restaurant address"
              value={field.value?.text ?? ""}
              onChangeText={(text) =>
                field.onChange({ text, lat: 0, lng: 0 })
              }
              onSelect={(addr) => field.onChange(addr)}
            />
          </View>
        )}
      />

      <View className="flex-row gap-4">
        {renderInput("city", "City")}
        {renderInput("country", "Country")}
      </View>

      <View className="flex-row gap-4">
        {renderInput(
          "deliveryPrice",
          "Delivery Price (₦)",
          "500",
          "numeric"
        )}
        {renderInput(
          "estimatedDeliveryTime",
          "Estimated Delivery Time (minutes)",
          "30",
          "numeric"
        )}
      </View>
    </View>
  );
};

export default DetailSection;
