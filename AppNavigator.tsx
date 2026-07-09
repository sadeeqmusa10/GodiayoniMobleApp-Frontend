import { ActivityIndicator, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Layout from "./MainLayout";

import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import UserProfileScreen from "./src/screens/UserProfileScreen";
import SearchScreen from "./src/screens/SearchScreen";
import ManageRestaurantScreen from "./src/screens/ManageRestaurantScreen";
import ManageDeliveryScreen from "./src/screens/ManageDeliveryScreen";
import DeliveryScreen from "./src/screens/PickUpDeliveryScreen";
import DeliveryStatusScreen from "./src/screens/DeliveryStatusScreen";
import OrderStatusScreen from "./src/screens/OrderStatusScreen";
import DeliveryOrderScreen from "./src/screens/DeliveryOrderScreen";
import BlockedAccountScreen from "./src/screens/BlockedAccount";
import DetailScreen from "@/screens/DetailScreen";
import CurrentOrderStatusScreen from "@/screens/CurrentOrderStatusScreen";
import ManageOrdersScreen from "@/screens/ManageOrdersScreen";
import AddNewRestaurantScreen from "@/screens/NewRestaurantScreen";

import { RootStackParamList } from "@/types";
import { useAuth } from "@/Auth/FirebaseProviderWithNavigate";
import AdminRoute from "@/Auth/AdminRoute";
import OrderReviewScreen from "@/screens/OrderReviewScreen";
import MotorParkDeliveryScreen from "@/screens/MotorParkDeliveryScreen";
import DoorToDoorDeliveryScreen from "@/screens/DoorToDoorDeliveryScreen";
import CargoScreen from "@/screens/CargoScreen";
import ShippingClearingandForwardingScreen from "@/screens/ShippingClearingandForwardingScreen";
import WayBillDeliveryScreen from "@/screens/WayBillDeliveryScreen";
import CourrierServiceScreen from "@/screens/CourrierServiceScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* 🔓 NOT AUTHENTICATED */}
      {!isAuthenticated && (
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
      )}

      {/* 🔐 AUTHENTICATED */}
      {isAuthenticated && (
        <>
          <Stack.Screen name="HomeScreen">
            {() => (
              <Layout showHero showFooter={false}>
                <HomeScreen />
              </Layout>
            )}
          </Stack.Screen>

          <Stack.Screen name="SearchScreen">
            {() => (
              <Layout showFooter={false}>
                <SearchScreen />
              </Layout>
            )}
          </Stack.Screen>

          <Stack.Screen name="DetailScreen">
            {() => (
              <Layout showHero={false}
              showFooter={false}>
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

          {/* 🔐 ADMIN ONLY */}
          <Stack.Screen name="ManageRestaurantScreen">
            {() => (
              <AdminRoute>
                <Layout showFooter={false}>
                  <ManageRestaurantScreen />
                </Layout>
              </AdminRoute>
            )}
          </Stack.Screen>

          <Stack.Screen name="ManageOrdersScreen">
            {() => (
              <AdminRoute>
                <Layout showFooter={false}>
                  <ManageOrdersScreen />
                </Layout>
              </AdminRoute>
            )}
          </Stack.Screen>

          <Stack.Screen name="AddNewRestaurantScreen">
            {() => (
              <AdminRoute>
                <Layout showFooter={false}>
                  <AddNewRestaurantScreen />
                </Layout>
              </AdminRoute>
            )}
          </Stack.Screen>

          <Stack.Screen name="ManageDeliveryScreen">
            {() => (
              <AdminRoute>
                <Layout showFooter={false}>
                  <ManageDeliveryScreen />
                </Layout>
              </AdminRoute>
            )}
          </Stack.Screen>

          {/* 👤 USER ROUTES */}
          <Stack.Screen name="DeliveryScreen">
            {() => (
              <Layout showFooter={false}>
                <DeliveryScreen />
              </Layout>
            )}
          </Stack.Screen>

          <Stack.Screen name="DoorToDoorDeliveryScreen">
            {() => (
              <Layout showFooter={false}>
                <DoorToDoorDeliveryScreen />
              </Layout>
            )}
          </Stack.Screen>

          <Stack.Screen name="MotorParkDeliveryScreen">
            {() => (
              <Layout showFooter={false}>
                <MotorParkDeliveryScreen/>
              </Layout>
            )}
          </Stack.Screen>

          <Stack.Screen name="WayBillDeliveryScreen">
            {() => (
              <Layout showFooter={false}>
                <WayBillDeliveryScreen/>
              </Layout>
            )}
          </Stack.Screen>

          <Stack.Screen name="CourrierServiceScreen">
            {() => (
              <Layout showFooter={false}>
                <CourrierServiceScreen />
              </Layout>
            )}
          </Stack.Screen>

          <Stack.Screen name="CargoScreen">
            {() => (
              <Layout showFooter={false}>
                <CargoScreen />
              </Layout>
            )}
          </Stack.Screen>

            <Stack.Screen name="ShippingClearingandForwardingScreen">
            {() => (
              <Layout showFooter={false}>
                <ShippingClearingandForwardingScreen />
              </Layout>
            )}
          </Stack.Screen>

          <Stack.Screen name="DeliveryStatusScreen">
            {() => (
              <Layout showFooter={false}>
                <DeliveryStatusScreen />
              </Layout>
            )}
          </Stack.Screen>

          <Stack.Screen name="OrderStatusScreen">
            {() => (
              <Layout showFooter={false}>
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

          <Stack.Screen name="OrderReviewScreen">
            {() => (
              <Layout showFooter={false}>
                <OrderReviewScreen />
              </Layout>
            )}
          </Stack.Screen>

          <Stack.Screen name="DeliveryOrderScreen">
            {() => (
              <Layout showFooter={false}>
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
