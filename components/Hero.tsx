import React from "react";
import { View, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import SearchBar from "../components/SearchBar"; // ✅ We'll adapt this too
import type { SearchForm } from "../components/SearchBar";

const Hero = () => {
  const navigation = useNavigation<any>();

  const handleSearchSubmit = (searchFormValues: SearchForm) => {
    navigation.navigate("SearchResults", {
      searchQuery: searchFormValues.searchQuery,
    });
  };

  return (
    <View className="flex flex-col gap-6 items-center w-full">
      <SearchBar
        placeholder="Search for city"
        onSubmit={handleSearchSubmit}
        searchQuery=""
      />
      <Image
        source={require("../assets/anidelivery.jpg")}
        className="w-full max-h-[300px] rounded-lg"
        resizeMode="cover"
        accessibilityLabel="anidelievry"
      />
    </View>
  );
};

export default Hero;
