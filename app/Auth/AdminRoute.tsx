import { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "./FirebaseProviderWithNavigate";

type Props = {
  children: React.ReactNode;
};

const AdminRoute = ({ children }: Props) => {
  const router = useRouter();
  const { role, loading } = useAuth();

  useEffect(() => {
    if (!loading && role !== "admin") {
      router.replace("/"); // redirect non-admin users
    }
  }, [loading, role]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (role !== "admin") return null;

  return <>{children}</>;
};

export default AdminRoute;
