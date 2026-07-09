import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../types";
import { useAuth } from "./FirebaseProviderWithNavigate";

type Props = {
  children: React.ReactNode;
};

const ProtectedLayout = ({ children }: Props) => {
  const { isAuthenticated, loading } = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

 useEffect(() => {
  if (!loading && !isAuthenticated) {
    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: "LoginScreen" }],
      });
    }, 0);
  }
}, [isAuthenticated, loading]);


  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Loading...</Text>
      </View>
    );
  }

  return <>{children}</>;
};

export default ProtectedLayout;
