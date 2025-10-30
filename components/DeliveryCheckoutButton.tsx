import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, Pressable } from "react-native";
import { Delivery } from "@/Types";
import DeliveryInfo from "../components/DeliveryInfo"; // ✅ Make sure this component is also adapted to Expo

type Props = {
  onCheckout: () => void;
  isLoading: boolean;
  delivery: Delivery;
};

const DeliveryCheckoutButton = ({ delivery, isLoading, onCheckout }: Props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  if (isLoading) {
    return (
      <View className="flex items-center justify-center py-4">
        <Text className="text-gray-600">Loading...</Text>
      </View>
    );
  }

  return (
    <View>
      {/* Checkout Button */}
      <TouchableOpacity
        onPress={() => {
          onCheckout();
          setIsModalVisible(true);
        }}
        className="bg-orange-500 py-3 rounded-lg items-center"
      >
        <Text className="text-white text-base font-semibold">
          Confirm & Pay
        </Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 px-4">
          <View className="bg-white rounded-xl p-5 w-full max-w-md">
            <DeliveryInfo delivery={delivery} />

            <View className="flex-row justify-end mt-4 space-x-2">
              <Pressable
                onPress={() => setIsModalVisible(false)}
                className="px-4 py-2 rounded-lg border border-gray-300"
              >
                <Text className="text-gray-600 font-medium">Close</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setIsModalVisible(false);
                  // You can trigger payment or further checkout logic here
                }}
                className="bg-orange-500 px-4 py-2 rounded-lg"
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
