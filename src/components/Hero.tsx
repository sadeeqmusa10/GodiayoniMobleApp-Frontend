import { View, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import SearchBar from "../components/SearchBar";
import type { SearchForm } from "../components/SearchBar";
import { RootStackParamList } from "@/types";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "SearchScreen"
>;

const Hero = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleSearchSubmit = (values: SearchForm) => {
    navigation.navigate("SearchScreen", {
      city: values.searchQuery,
    });
  };

  return (
    <View className="w-full flex-col gap-6 items-center">
      <SearchBar
        placeholder="Search for city"
        onSubmit={handleSearchSubmit}
        searchQuery=""
      />

      <View className="w-full h-[220px] overflow-hidden rounded-xl">
        <Image
          source={require("../../assets/anidelivery.jpg")}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
          accessibilityLabel="delivery hero"
        />
      </View>
    </View>
  );
};

export default Hero;
