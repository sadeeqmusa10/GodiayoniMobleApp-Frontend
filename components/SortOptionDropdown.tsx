import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import { ChevronDown } from "lucide-react-native"; // RN version of lucide icons

type Props = {
  onChange: (value: string) => void;
  sortOption: string;
};

const SORT_OPTION = [
  { label: "Best match", value: "bestMatch" },
  { label: "Delivery price", value: "deliveryPrice" },
  { label: "Estimated Delivery Time", value: "estimatedDeliveryTime" },
];

const SortOptionDropDown = ({ onChange, sortOption }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedSortLabel =
    SORT_OPTION.find((option) => option.value === sortOption)?.label ||
    SORT_OPTION[0].label;

  const handleSelect = (value: string) => {
    onChange(value);
    setIsOpen(false);
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        className="border border-gray-300 rounded-md p-3 flex-row justify-between items-center"
      >
        <Text className="text-base">Sort by: {selectedSortLabel}</Text>
        <ChevronDown size={20} />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/40">
          <View className="bg-white w-3/4 rounded-lg p-4">
            <Text className="text-lg font-bold mb-2">Select sort option</Text>
            <FlatList
              data={SORT_OPTION}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item.value)}
                  className="p-3 border-b border-gray-200"
                >
                  <Text
                    className={`text-base ${
                      item.value === sortOption
                        ? "text-orange-500 font-semibold"
                        : ""
                    }`}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              onPress={() => setIsOpen(false)}
              className="mt-3 bg-gray-200 rounded-md p-3 items-center"
            >
              <Text className="font-semibold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SortOptionDropDown;
