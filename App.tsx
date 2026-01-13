// App.tsx
import "./global.css";
import { View } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Toaster } from "sonner-native";
import { navigationRef } from "./src/config/navigationRef";
import FirebaseProvider from "./src/Auth/FirebaseProviderWithNavigate";
import AppNavigator from "./AppNavigator";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

// ✅ ADD THIS
const linking = {
  prefixes: ["godiyaoni://"],
  config: {
    screens: {
      OrderStatusScreen: {
        path: "order/:orderId",
      },
    },
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        {/* ✅ PASS linking HERE */}
        <NavigationContainer ref={navigationRef} linking={linking}>
          <FirebaseProvider>
            <View style={{ flex: 1 }}>
              <AppNavigator />
              <Toaster position="top-center" richColors />
            </View>
          </FirebaseProvider>
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
