// App.tsx
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Toaster } from "sonner-native";

import FirebaseProvider from "./src/Auth/FirebaseProviderWithNavigate";
import AppNavigator from "./AppNavigator";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const linking = {
  prefixes: ["godiyaoni://", "https://godiyaoni.com"],
  config: {
    screens: {
      // ⚠️ MUST match AppNavigator screen name
      HomeScreen: "",

      OrderReview: "order/review",

      CurrentOrderStatus: "order/current/:orderId",

      OrderStatus: "order/history/:orderId",

      DeliveryStatus: "delivery/:deliveryId",
    },
  },
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer linking={linking}>
            <FirebaseProvider>
              <AppNavigator />
              <Toaster position="top-center" richColors />
            </FirebaseProvider>
          </NavigationContainer>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}