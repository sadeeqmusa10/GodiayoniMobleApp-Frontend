import { useFormContext, Controller } from "react-hook-form";
import { View, Text } from "react-native";
import CuisineCheckbox from "../manage-restaurant-form/CuisineCheckBox";
import { cuisineList } from "../../config/restaurants-options-config";

const CuisinesSection = () => {
  const { control } = useFormContext();

  return (
    <View className="space-y-2">
      <View>
        <Text className="text-2xl font-bold">Cuisines</Text>
        <Text className="text-sm text-gray-500">
          Select restaurant cuisines
        </Text>
      </View>

      <Controller
        control={control}
        name="cuisines"
        render={({ field }) => (
          <View className="flex-wrap flex-row gap-2">
            {cuisineList.map((cuisineItem) => (
              <CuisineCheckbox
                key={cuisineItem}
                cuisine={cuisineItem}
                field={field}
              />
            ))}
          </View>
        )}
      />
    </View>
  );
};

export default CuisinesSection;
