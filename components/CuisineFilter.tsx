import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cuisineList } from "@/app/config/restaurants-options-config";

type Props = {
  onChange: (cuisines: string[]) => void;
  selectedCuisines: string[];
  isExpanded: boolean;
  onExpandedClick: () => void;
};

const CuisineFilter = ({
  onChange,
  selectedCuisines,
  isExpanded,
  onExpandedClick,
}: Props) => {
  const handleCuisinePress = (cuisine: string) => {
    const isSelected = selectedCuisines.includes(cuisine);
    const newCuisineList = isSelected
      ? selectedCuisines.filter((c) => c !== cuisine)
      : [...selectedCuisines, cuisine];

    onChange(newCuisineList);
  };

  const handleReset = () => onChange([]);

  const visibleCuisines = isExpanded ? cuisineList : cuisineList.slice(0, 7);

  return (
    <View className="px-2">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-md font-semibold">Filter by cuisines</Text>
        <TouchableOpacity onPress={handleReset}>
          <Text className="text-md font-semibold underline text-blue-500">
            Reset filters
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <ScrollView showsVerticalScrollIndicator={false} className="space-y-2">
        {visibleCuisines.map((cuisine) => {
          const isSelected = selectedCuisines.includes(cuisine);

          return (
            <TouchableOpacity
              key={cuisine}
              onPress={() => handleCuisinePress(cuisine)}
              className={`flex-row items-center rounded-full px-4 py-2 my-1 border ${
                isSelected ? "border-green-600" : "border-gray-300"
              }`}
            >
              {isSelected && (
                <Ionicons name="checkmark" size={20} color="#16a34a" />
              )}
              <Text
                className={`ml-2 font-semibold ${
                  isSelected ? "text-green-600" : "text-gray-800"
                }`}
              >
                {cuisine}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Expand Button */}
      <TouchableOpacity
        onPress={onExpandedClick}
        className="mt-4 flex-row items-center justify-center"
      >
        {isExpanded ? (
          <>
            <Text className="text-orange-500 font-medium mr-1">View less</Text>
            <Ionicons name="chevron-up" size={20} color="#f97316" />
          </>
        ) : (
          <>
            <Text className="text-orange-500 font-medium mr-1">View more</Text>
            <Ionicons name="chevron-down" size={20} color="#f97316" />
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default CuisineFilter;
