import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Delivery } from "../types";

type Props = {
  onCheckout: () => Promise<void>;
  isLoading: boolean;
  delivery: Delivery;
  disabled?: boolean;
};

const DeliveryCheckoutButton = ({
  isLoading,
  onCheckout,
  disabled,
}: Props) => {
  return (
    <View>
      <TouchableOpacity
        onPress={async () => {
          if (disabled || isLoading) return;
          await onCheckout();
        }}
        disabled={disabled || isLoading}
        className={`py-3 rounded-lg items-center ${
          disabled ? "bg-gray-400" : "bg-orange-500"
        }`}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-base font-semibold">
            Confirm & Pay
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default DeliveryCheckoutButton;
