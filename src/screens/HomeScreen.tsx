import React from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import Footer from "@/components/Footer";
import FeaturedRow from "@/components/FeaturedRow";
import { useGetAllAdminRestaurants } from "@/Api/AdminApi";


export default function HomeScreen() {
  

  const { data: restaurants = [], isLoading } = useGetAllAdminRestaurants();

  // 🔥 1. Flatten menu items
  const allFoodItems = restaurants.flatMap((restaurant) =>
    restaurant.menuItem.map((item) => ({
      ...item,
      restaurantId: restaurant.restaurantId, // 🔥 IMPORTANT
    }))
  );

  // 🔥 2. Shuffle randomly
  const randomFood = allFoodItems
    .sort(() => 0.5 - Math.random())
    .slice(0, 10); // show only 10 items

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1">
          {/* HERO TEXT */}
          <View className="items-center mt-6">
            <Text className="text-xl font-bold text-gray-900 text-center">
              Delivery All The Way 24/7
            </Text>
            <Text className="text-sm text-gray-600 mt-1 text-center">
              Your Order Is Just A Click Away!
            </Text>
          </View>

          {/* 🔥 FOOD SECTION */}
          <View className="mt-4">
            <FeaturedRow
              name=""
              price="Top picks for you"
              foodCard={randomFood}
            />
          </View>

          {/* DOWNLOAD SECTION */}
          <View className="items-center mt-8 mb-6">
            <Text className="text-base font-semibold text-gray-900 text-center">
              Get your package at your doorstep!
            </Text>
            <Text className="text-xs text-gray-600 mt-1 text-center">
              Download the mobile or iOS app from the app store
            </Text>

            <Image
              source={require("../../assets/appDownload.png")}
              style={{ width: 160, height: 54 }}
              resizeMode="contain"
              className="mt-3"
            />
          </View>
        </View>
      </ScrollView>

      <Footer />
    </View>
  );
}