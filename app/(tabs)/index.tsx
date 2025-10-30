import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner-native"; // or use react-native-toast-message / Alert
import AppNavigator from "@/app/AppNavigator";
import "@/global.css";
import { View } from "react-native";
import { FirebaseProvider } from "@/app/Auth/FirebaseProviderWithNavigate";

// ✅ Initialize Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FirebaseProvider>
        <View className="flex-1">
          <AppNavigator />
          <Toaster position="top-center" richColors />
        </View>
      </FirebaseProvider>
    </QueryClientProvider>
  );
}
