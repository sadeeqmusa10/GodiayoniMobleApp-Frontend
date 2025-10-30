import React from "react";
import { Text, View } from "react-native";
import Layouts from "./Layouts";
import RootLayout from "./_layout";

export default function Index() {
  return (
    <Layouts showHero>
      <RootLayout />
      <View className="items-center justify-center py-10">
        
      </View>
    </Layouts>
  );
}
