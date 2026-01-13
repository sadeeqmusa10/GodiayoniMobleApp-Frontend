import { View, Text, Pressable } from "react-native";
import Checkbox from "expo-checkbox";
import { ControllerRenderProps } from "react-hook-form";

type Props = {
  cuisine: string;
  field: ControllerRenderProps<any, "cuisines">;
};

const CuisineCheckbox = ({ cuisine, field }: Props) => {
  const isSelected = field.value?.includes(cuisine) ?? false;

  const toggleCheckbox = () => {
    if (isSelected) {
      // Remove cuisine from selected array
      field.onChange(field.value.filter((item: string) => item !== cuisine));
    } else {
      // Add cuisine to selected array
      field.onChange([...(field.value || []), cuisine]);
    }
  };

  return (
    <Pressable
      onPress={toggleCheckbox}
      className="flex-row items-center p-2 border rounded-md"
    >
      <Checkbox
        value={isSelected}
        onValueChange={toggleCheckbox}
        color={isSelected ? "#4630EB" : undefined}
      />
      <Text className="ml-2">{cuisine}</Text>
    </Pressable>
  );
};

export default CuisineCheckbox;
