import { useState } from "react"; 
import { Modal, View, Text, TouchableOpacity, Pressable, ActivityIndicator } from "react-native";
import { Delivery } from "../types";
import DeliveryInfo from "./DeliveryInfo";

type Props = {
  onCheckout: () => void;
  isLoading: boolean;
  delivery: Delivery;
  disabled?: boolean; // ✅ allow disabling
};

const DeliveryCheckoutButton = ({ delivery, isLoading, onCheckout, disabled }: Props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  if (!delivery) return null;

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          if (disabled) return;
          setIsModalVisible(true);
        }}
        disabled={disabled || isLoading}
        className={`py-3 rounded-lg items-center ${disabled ? "bg-gray-400" : "bg-orange-500"}`}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-base font-semibold">Confirm & Pay</Text>
        )}
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 px-4">
          <View className="bg-white rounded-xl p-5 w-full max-w-md">
            <DeliveryInfo delivery={delivery} />

            {disabled && (
              <Text className="text-red-500 text-sm mt-2">
                Delivery price could not be calculated. Please review addresses.
              </Text>
            )}

            <View className="flex-row justify-end mt-4 space-x-2">
              <Pressable
                onPress={() => setIsModalVisible(false)}
                className="px-4 py-2 rounded-lg border border-gray-300"
              >
                <Text className="text-gray-600 font-medium">Close</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  if (disabled || isLoading) return;
                  setIsModalVisible(false);
                  onCheckout();
                }}
                className={`px-4 py-2 rounded-lg ${disabled ? "bg-gray-400" : "bg-orange-500"}`}
              >
                <Text className="text-white font-medium">Pay</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DeliveryCheckoutButton;
