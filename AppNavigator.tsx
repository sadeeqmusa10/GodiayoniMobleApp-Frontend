import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import {
  getAuth,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Layout from "./MainLayout";

import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import UserProfileScreen from "./src/screens/UserProfileScreen";
import SearchScreen from "./src/screens/SearchScreen";
import ManageRestaurantScreen from "./src/screens/ManageRestaurantScreen";
import ManageDeliveryScreen from "./src/screens/ManageDeliveryScreen";
import DeliveryScreen from "./src/screens/DeliveryScreen";
import DeliveryStatusScreen from "./src/screens/DeliveryStatusScreen";
import OrderStatusScreen from "./src/screens/OrderStatusScreen";
import DeliveryOrderScreen from "./src/screens/DeliveryOrderScreen";
import BlockedAccountScreen from "./src/screens/BlockedAccount";
import { RootStackParamList } from "@/types";
import DetailScreen from "@/screens/DetailScreen";
import CurrentOrderStatusScreen from "@/screens/CurrentOrderStatusScreen";
import ManageOrdersScreen from "@/screens/ManageOrdersScreen";
import AddNewRestaurantScreen from "@/screens/NewRestaurantScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const auth = getAuth();
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setCheckingAuth(false);
    });

    return unsubscribe;
  }, [auth]);

  if (checkingAuth) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!currentUser && (
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
      )}

      {currentUser && (
        <>
          <Stack.Screen name="HomeScreen">
            {() => (
              <Layout showHero>
                <HomeScreen />
              </Layout>
            )}
          </Stack.Screen>

          <Stack.Screen name="SearchScreen">
            {() => (
              <Layout>
                <SearchScreen />
              </Layout>
            )}
          </Stack.Screen>

          <Stack.Screen name="DetailScreen">
  {() => (
    <Layout showHero={false}>
      <DetailScreen />
    </Layout>
  )}
</Stack.Screen>


          <Stack.Screen name="UserProfileScreen">
            {() => (
              <Layout>
                <UserProfileScreen />
              </Layout>
            )}
          </Stack.Screen>

          <Stack.Screen name="ManageRestaurantScreen">
            {() => (
              <Layout>
                <ManageRestaurantScreen />
              </Layout>
            )}
          </Stack.Screen>

          <Stack.Screen name="ManageOrdersScreen">
            {() => (
              <Layout>
                <ManageOrdersScreen />
              </Layout>
            )}
          </Stack.Screen>

          <Stack.Screen name="AddNewRestaurantScreen">
            {() => (
              <Layout>
                <AddNewRestaurantScreen />
              </Layout>
            )}
          </Stack.Screen>

          <Stack.Screen name="ManageDeliveryScreen">
            {() => (
              <Layout showHero={false}>
                <ManageDeliveryScreen />
              </Layout>
            )}
          </Stack.Screen>

          <Stack.Screen name="DeliveryScreen">
            {() => (
              <Layout>
                <DeliveryScreen />
              </Layout>
            )}
          </Stack.Screen>

          <Stack.Screen name="DeliveryStatusScreen">
            {() => (
              <Layout>
                <DeliveryStatusScreen />
              </Layout>
            )}
          </Stack.Screen>

          <Stack.Screen name="OrderStatusScreen">
            {() => (
              <Layout>
                <OrderStatusScreen />
              </Layout>
            )}
          </Stack.Screen>

          <Stack.Screen name="CurrentOrderStatusScreen">
            {() => (
              <Layout>
                <CurrentOrderStatusScreen />
              </Layout>
            )}
          </Stack.Screen>

          <Stack.Screen name="DeliveryOrderScreen">
            {() => (
              <Layout>
                <DeliveryOrderScreen />
              </Layout>
            )}
          </Stack.Screen>

          <Stack.Screen name="BlockedAccount">
            {() => (
              <Layout>
                <BlockedAccountScreen />
              </Layout>
            )}
          </Stack.Screen>
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
