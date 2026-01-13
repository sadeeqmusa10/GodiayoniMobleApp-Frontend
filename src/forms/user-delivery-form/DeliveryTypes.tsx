import { View } from "react-native";
import { useFormContext, Controller } from "react-hook-form";
import { Picker } from "@react-native-picker/picker";
import FormSection from "../../components/ui/FormSection";

const DeliveryTypes = () => {
  const { control } = useFormContext();

  return (
    <FormSection title="Delivery Type">
      <Controller
        control={control}
        name="deliveryType"
        render={({ field: { onChange, value } }) => (
          <View className="border border-gray-300 rounded-xl overflow-hidden">
            <Picker
              selectedValue={value}
              onValueChange={onChange}
            >
              <Picker.Item label="Standard" value="standard" />
              <Picker.Item label="Express" value="express" />
              <Picker.Item label="Same Day" value="same-day" />
            </Picker>
          </View>
        )}
      />
    </FormSection>
  );
};

export default DeliveryTypes;
