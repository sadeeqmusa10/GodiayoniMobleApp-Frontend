import { View, Text, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1 bg-white"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Section */}
        <View className="px-6 py-8 bg-white rounded-2xl shadow-md items-center mt-4 space-y-4">
          <Text className="text-2xl font-bold text-neutral-900 text-center">
            Delivery All The Way 24/7
          </Text>
          <Text className="text-lg text-center text-gray-700">
            Your Order Is Just A Click Away!
          </Text>
        </View>

        {/* Middle Section */}
        <View className="mt-8 items-center justify-center px-4">
          <Image
            source={require("@/assets/landing.png")}
            className="w-full max-w-[320px] h-72 rounded-2xl"
            resizeMode="contain"
          />

          <View className="mt-6 items-center space-y-3">
            <Text className="text-2xl font-semibold text-center text-gray-900">
              Get your package at your door step!
            </Text>
            <Text className="text-base text-gray-700 text-center">
              Download the mobile or iOS app from the app store
            </Text>

            <Image
              source={require("@/assets/appDownload.png")}
              className=""
              resizeMode="contain"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
