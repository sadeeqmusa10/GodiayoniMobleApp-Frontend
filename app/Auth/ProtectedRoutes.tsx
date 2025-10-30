import { Slot, useRouter } from "expo-router";
import { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useAuth } from "./FirebaseProviderWithNavigate";

export default function ProtectedLayout() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login" as any);
    }
  }, [isAuthenticated, loading]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <ActivityIndicator size="large" color="#000" />
        <Text className="mt-2 text-gray-800 dark:text-gray-200">
          Loading...
        </Text>
      </View>
    );
  }

  return <Slot />;
}
