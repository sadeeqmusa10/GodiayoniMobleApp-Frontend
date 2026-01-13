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
  showFooter = true,
}: Props) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* HEADER */}
      {showHeader && <Header />}

      {/* HERO */}
      {showHero && <Hero />}

      {/* SCROLLABLE CONTENT */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: showFooter ? 100 : 24,
        }}
      >
        <View className="flex-1 ">
          {children}
        </View>
      </ScrollView>

      {/* FOOTER */}
      {showFooter && <Footer />}
    </SafeAreaView>
  );
}
