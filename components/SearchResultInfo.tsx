import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

type Props = {
  total: number;
  city: string;
};

const SearchResultInfo = ({ total, city }: Props) => {
  const navigation = useNavigation<any>();

  return (
    <View className="flex flex-col gap-2 justify-between lg:flex-row lg:items-center my-2">
      <Text className="text-xl font-bold">
        {total} Restaurant{total !== 1 && "s"} found in {city}
      </Text>

      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Text className="text-sm font-semibold underline text-green-600">
          Change location
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SearchResultInfo;
