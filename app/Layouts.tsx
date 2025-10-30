import React from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";

type Props = {
  children: React.ReactNode;
  showHero?: boolean;
};

export default function Layouts({ children, showHero = false }: Props) {
  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-gray-50">
      <View className="flex-1">
        {/* Header */}
        <Header />

        {/* Optional Hero */}
        {showHero && <Hero />}

        {/* Scrollable main content */}
        <ScrollView
          horizontal={false} // ✅ force only vertical
          overScrollMode="never" // ✅ android side bounce fix
          nestedScrollEnabled // ✅ RN web fix
          contentContainerStyle={{ flexGrow: 1 }}
          className="flex-1 px-4 py-6"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>

        {/* Footer */}
        <Footer />
      </View>
    </SafeAreaView>
  );
}
