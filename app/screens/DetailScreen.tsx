import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useGetRestaurant } from "../Api/RestaurantApi";
import { useCreateCheckoutSession } from "../Api/OrderApi";
import RestaurantInfo from "@/components/RestaurantInfo";
import MenuItem from "@/components/MenuItem";
import OrderSummary from "@/components/OrderSummary";
import type { UserFormData } from "@/app/forms/user-profile-form/UserProfileForm";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

const DetailScreen = () => {
  const { firebaseId } = useLocalSearchParams<{ firebaseId: string }>();
  const { restaurant, isLoading } = useGetRestaurant(firebaseId ?? "");
  const { createCheckoutSession, isPending: isCheckoutLoading } =
    useCreateCheckoutSession();

  const router = useRouter();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (firebaseId) {
      const stored = globalThis.localStorage?.getItem(
        `cartItems-${firebaseId}`
      );
      if (stored) setCartItems(JSON.parse(stored));
    }
  }, [firebaseId]);

  const saveCart = (updated: CartItem[]) => {
    if (firebaseId) {
      globalThis.localStorage?.setItem(
        `cartItems-${firebaseId}`,
        JSON.stringify(updated)
      );
    }
  };

  const addToCart = (menuItem: { id: string; name: string; price: number }) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === menuItem.id);
      const updated = existing
        ? prev.map((item) =>
            item.id === menuItem.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...prev, { ...menuItem, quantity: 1 }];
      saveCart(updated);
      return updated;
    });
  };

  const removeFromCart = (cartItem: CartItem) => {
    const updated = cartItems.filter((item) => item.id !== cartItem.id);
    setCartItems(updated);
    saveCart(updated);
  };

  const onCheckout = async (userFormData: UserFormData) => {
    if (!restaurant || !firebaseId) return;

    const checkoutData = {
      cartItems: cartItems.map((item) => ({
        menuItemId: item.id,
        name: item.name,
        quantity: item.quantity.toString(),
      })),
      restaurantId: restaurant.restaurantId,
      deliveryDetails: {
        name: userFormData.name,
        addressLine1: userFormData.addressLine1,
        phone: userFormData.phone,
        city: userFormData.city,
        country: userFormData.country,
        email: userFormData.email as string,
      },
    };

    try {
      const data = await createCheckoutSession(checkoutData);
      router.push(`/checkout?url=${encodeURIComponent(data.url)}` as any);
    } catch (error) {
      console.error("Checkout failed", error);
      Alert.alert("Error", "Checkout failed. Please try again.");
    }
  };

  if (isLoading || !restaurant) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#f97316" />
        <Text className="mt-2 text-gray-600">Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Restaurant Image */}
      <Image
        source={{ uri: restaurant.imageUrl }}
        className="w-full h-48 rounded-b-2xl"
        resizeMode="cover"
      />

      {/* Restaurant Info */}
      <View className="px-4 py-6 space-y-4">
        <RestaurantInfo restaurant={restaurant} />

        <Text className="text-2xl font-bold mt-4">Menu</Text>
        {restaurant.menuItem.map((menuItem: any) => (
          <MenuItem
            key={menuItem.id || menuItem.name}
            menuItem={{ ...menuItem, id: menuItem.id || menuItem.name }}
            addToCart={() =>
              addToCart({
                id: menuItem.id || menuItem.name,
                name: menuItem.name,
                price: menuItem.price,
              })
            }
          />
        ))}

        {/* Order Summary */}
        <View className="bg-white rounded-2xl p-5 mt-6 shadow">
          <OrderSummary
            restaurant={restaurant}
            cartItems={cartItems}
            removeFromCart={removeFromCart}
          />
          <TouchableOpacity
            disabled={cartItems.length === 0 || isCheckoutLoading}
            onPress={() =>
              onCheckout({
                name: "Test User",
                phone: "0000000000",
                addressLine1: "Test Address",
                city: "Abuja",
                country: "Nigeria",
                email: "test@example.com",
              })
            }
            className={`mt-4 p-4 rounded-lg ${
              cartItems.length === 0
                ? "bg-gray-300"
                : "bg-orange-500 active:bg-orange-600"
            }`}
          >
            <Text className="text-center text-white font-semibold text-lg">
              {isCheckoutLoading ? "Processing..." : "Proceed to Checkout"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default DetailScreen;
