import React from "react";
import { View, Text } from "react-native";
import { useAuth } from "./FirebaseProviderWithNavigate";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { role, loading } = useAuth();

  if (loading) return null;

  if (role !== "admin") {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Unauthorized</Text>
      </View>
    );
  }

  return <>{children}</>;
};

export default AdminRoute;
