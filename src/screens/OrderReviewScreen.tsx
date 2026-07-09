import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
  Linking,
} from "react-native";
import {
  RouteProp,
  useRoute,
  useNavigation,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import InAppBrowser from "react-native-inappbrowser-reborn";

import { RootStackParamList } from "../types";
import { useCreateCheckoutSession } from "../Api/OrderApi";

/* =====================
   TYPES
===================== */

type RouteProps = RouteProp<
  RootStackParamList,
  "OrderReviewScreen"
>;

type NavigationProps =
  NativeStackNavigationProp<RootStackParamList>;

/* =====================
   COMPONENT
===================== */

const OrderReviewScreen = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProps>();

  const { restaurant, cartItems, deliveryDetails } =
    route.params;

  const {
    createCheckoutSession,
    isPending,
  } = useCreateCheckoutSession();

  /* =====================
     SUBTOTAL ONLY
     (Backend calculates delivery)
  ===================== */

  const subtotal = cartItems.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  /* =====================
     PAY & CREATE ORDER
  ===================== */

  const handlePayment = async () => {
    try {
      const payload = {
        restaurantId: restaurant.restaurantId,

        cartItems: cartItems.map((i) => ({
          id: i.id,
          name: i.name,
          quantity: i.quantity,
          imageUrl: i.imageUrl,
        })),

        deliveryDetails,
      };

      const { url } =
        await createCheckoutSession(payload);

      if (Platform.OS === "web") {
        window.location.href = url;
        return;
      }

      if (await InAppBrowser.isAvailable()) {
        await InAppBrowser.openAuth(
          url,
          "godiyaoni://CurrentOrderStatusScreen"
        );
      } else {
        Linking.openURL(url);
      }
    } catch (error) {
      Alert.alert(
        "Payment Error",
        "Unable to proceed to payment"
      );
    }
  };

  /* =====================
     RENDER
  ===================== */

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      {/* RESTAURANT */}
      <View className="bg-white rounded-2xl p-4 mb-4">
        <Text className="text-xl font-bold mb-2">
          {restaurant.restaurantName}
        </Text>

        <Image
          source={{ uri: restaurant.imageUrl }}
          className="w-full h-40 rounded-xl"
        />

        <Text className="mt-2 text-gray-600">
          {restaurant.address.text}
        </Text>
      </View>

      {/* CART ITEMS */}
      <View className="bg-white rounded-2xl p-4 mb-4">
        <Text className="text-lg font-semibold mb-3">
          Order Items
        </Text>
{cartItems.map((item) => (
  <View
    key={item.id}
    className="flex-row justify-between items-center mb-3"
  >
    <View className="flex-row items-center">
      <Image
        source={{ uri: item.imageUrl }}
        className="w-12 h-12 rounded-lg mr-3"
      />

      <Text>
        {item.quantity} × {item.name}
      </Text>
    </View>

    <Text>
      ₦{(item.price * item.quantity).toLocaleString()}
    </Text>
  </View>
))}

      </View>

      {/* DELIVERY DETAILS */}
      <View className="bg-white rounded-2xl p-4 mb-4">
        <Text className="text-lg font-semibold mb-3">
          Delivery Details
        </Text>

        <Text>Name: {deliveryDetails.name}</Text>
        <Text>Phone: {deliveryDetails.phone}</Text>
        <Text>Order Type: {deliveryDetails.orderType}</Text>

        {deliveryDetails.orderType === "delivery" && (
          <>
            <Text>
              Delivery Type:{" "}
              {deliveryDetails.deliveryType}
            </Text>

            <Text className="mt-2">
              Address:{" "}
              {deliveryDetails.addressLine1?.text}
            </Text>

            <Text>
              {deliveryDetails.city},{" "}
              {deliveryDetails.country}
            </Text>
          </>
        )}
      </View>

      {/* SUMMARY */}
      <View className="bg-white rounded-2xl p-4 mb-6">
        <Text className="text-lg font-semibold mb-3">
          Summary
        </Text>

        <View className="flex-row justify-between">
          <Text>Subtotal</Text>
          
          <Text>₦{subtotal.toLocaleString()}</Text>
        </View>

        <View className="flex-row justify-between mt-2">
          <Text>Delivery</Text>
          <Text className="text-gray-500">
            Calculated at checkout
          </Text>
        </View>

        <View className="flex-row justify-between mt-3">
          <Text className="font-bold">
            Final Total
          </Text>
          <Text className="font-bold text-gray-500">
            Confirmed after payment
          </Text>
        </View>
      </View>

      {/* PAY BUTTON */}
      <TouchableOpacity
        disabled={isPending}
        onPress={handlePayment}
        className={`p-4 rounded-xl ${
          isPending
            ? "bg-gray-400"
            : "bg-orange-500"
        }`}
      >
        <Text className="text-white text-center text-lg font-semibold">
          {isPending
            ? "Processing..."
            : "Confirm & Pay"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default OrderReviewScreen;
