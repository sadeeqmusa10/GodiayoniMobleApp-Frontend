import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "./FirebaseProviderWithNavigate";
import { RootStackParamList } from "../types";

type Props = {
  children: React.ReactNode;
};

const AdminRoute = ({ children }: Props) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { role, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading && (!isAuthenticated || role !== "admin")) {
      navigation.replace("HomeScreen"); // ✅ FIXED
    }
  }, [loading, role, isAuthenticated]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (role !== "admin") return null;

  return <>{children}</>;
};

export default AdminRoute;
