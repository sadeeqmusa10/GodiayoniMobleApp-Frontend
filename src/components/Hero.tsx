import { View,Text, Image, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import SearchBar from "../components/SearchBar";
import type { SearchForm } from "../components/SearchBar";
import { RootStackParamList } from "@/types";
import TransportCard from "./TransportCards";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type TransportService = {
  id: string;
  title: string;
  image: any;
  screen: keyof RootStackParamList;
};

const Hero = () => {

    const transportServices : TransportService[] = [
    {
      id: "1",
      title: "Door to Door",
      image: require("../../assets/DoorToDoor.png"),
      screen: "DoorToDoorDeliveryScreen",
    },
    {
      id: "2",
      title: "Motor Park",
      image: require("../../assets/MotorPark.png"),
      screen: "MotorParkDeliveryScreen",
    },
    {
      id: "3",
      title: "Pick Up",
      image: require("../../assets/PickUp.png"),
      screen: "DeliveryScreen",
    },
    {
      id: "4",
      title: "Waybill",
      image: require("../../assets/WayBill.png"),
      screen: "WayBillDeliveryScreen",
    },
    {
      id: "5",
      title: "Cargo",
      image: require("../../assets/CargoServices.png"),
      screen: "CargoScreen",
    },
  ];

  const navigation = useNavigation<NavigationProp>();

  const handleSearchSubmit = (values: SearchForm) => {
    navigation.navigate("SearchScreen", {
      city: values.searchQuery,
    });
  };

  return (
    <View className="w-full gap-6">
  <SearchBar
    placeholder="Search for your city"
    onSubmit={handleSearchSubmit}
    searchQuery=""
  />

  {/* TRANSPORT SECTION */}
  <View className="mt-4 px-2">
    <Text className="font-bold text-center text-xl text-gray-900 mb-3">
      Transport & Logistics
    </Text>

    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {transportServices.map((item) => (
        <TransportCard key={item.id} item={item} />
      ))}
    </ScrollView>
  </View>
</View>
  );
};

export default Hero;
