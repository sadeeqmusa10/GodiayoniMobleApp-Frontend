import "./global.css";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { View, ScrollView } from "react-native";
import Header from "./src/components/Header";
import Footer from "./src/components/Footer";
import Hero from "./src/components/Hero";

type Props = {
  children: React.ReactNode;
  showHero?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
};

export default function Layout({
  children,
  showHero = false,
  showHeader = true,
}: Props) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      {showHeader && <Header />}

      {/* Content wrapper */}
      <View className="flex-1">
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
          }}
        >
          {showHero && <Hero />}
          <View className="flex-1">{children}</View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}