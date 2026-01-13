import React from "react";
import { View, Text, Image } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function HomeScreen() {
  return (
    <>
      <StatusBar style="dark" />

      {/* TOP BRAND */}
      <View className="items-center mt-4">
        <Image
          source={require("../../assets/appDownload.png")}
          style={{ width: 150, height: 48 }}
          resizeMode="contain"
        />
      </View>

      {/* HERO TEXT */}
      <View className="items-center mt-6">
        <Text className="text-xl font-bold text-gray-900 text-center">
          Delivery All The Way 24/7
        </Text>
        <Text className="text-sm text-gray-600 mt-1 text-center">
          Your Order Is Just A Click Away!
        </Text>
      </View>

      {/* MAIN IMAGE */}
      <View className="items-center mt-6">
        <Image
          source={require("../../assets/landing.png")}
          style={{ width: "100%", height: 180 }}
          resizeMode="contain"
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
    </>
  );
}
