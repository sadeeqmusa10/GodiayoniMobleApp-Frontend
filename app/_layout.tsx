import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FirebaseProvider from "@/app/Auth/FirebaseProviderWithNavigate";
import { Toaster } from "sonner-native";
import { View } from "react-native";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <FirebaseProvider>
        <View className="flex-1">
          <Stack screenOptions={{ headerShown: false }} />
          <Toaster position="top-center" richColors />
        </View>
      </FirebaseProvider>
    </QueryClientProvider>
  );
}
