import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  Linking,
  Modal,
} from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useGetRestaurant } from "../Api/RestaurantApi";
import { useCreateCheckoutSession } from "../Api/OrderApi";
import RestaurantInfo from "../components/RestaurantInfo";
import MenuItem from "../components/MenuItem";
import OrderSummary from "@/components/OrderSummary";
import UserProfileForm from "../forms/user-profile-form/UserProfileForm";
import type { UserFormData } from "../forms/user-profile-form/UserProfileForm";
import { RootStackParamList } from "../types";

import InAppBrowser from "react-native-inappbrowser-reborn";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type DetailRouteProp = RouteProp<RootStackParamList, "DetailScreen">;
type DetailNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "DetailScreen"
>;

const DetailScreen = () => {
  const navigation = useNavigation<DetailNavProp>();
  const route = useRoute<DetailRouteProp>();
  const { firebaseId } = route.params;

  const { restaurant, isLoading } = useGetRestaurant(firebaseId);
  const { createCheckoutSession, isPending: isCheckoutLoading } =
    useCreateCheckoutSession();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);

  /* =====================
     LOAD CART (WEB SAFE)
  ====================== */
  useEffect(() => {
    if (!firebaseId) return;
    try {
      const stored = globalThis?.localStorage?.getItem(
        `cartItems-${firebaseId}`
      );
      if (stored) setCartItems(JSON.parse(stored));
    } catch {}
  }, [firebaseId]);

  const persistCart = (items: CartItem[]) => {
    try {
      globalThis?.localStorage?.setItem(
        `cartItems-${firebaseId}`,
        JSON.stringify(items)
      );
    } catch {}
  };

  const addToCart = (menuItem: {
    id: string;
    name: string;
    price: number;
  }) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === menuItem.id);
      const updated = existing
        ? prev.map((i) =>
            i.id === menuItem.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        : [...prev, { ...menuItem, quantity: 1 }];
      persistCart(updated);
      return updated;
    });
  };

  const removeFromCart = (item: CartItem) => {
    const updated = cartItems.filter((i) => i.id !== item.id);
    setCartItems(updated);
    persistCart(updated);
  };

  /* =====================
     CHECKOUT HANDLER
  ====================== */
 const onCheckout = async (formData: UserFormData) => {
  if (!restaurant || !firebaseId) return;

  const payload = {
    restaurantId: restaurant.restaurantId,
    cartItems: cartItems.map((i) => ({
      menuItemId: i.id,
      name: i.name,
      quantity: i.quantity.toString(),
    })),
    deliveryDetails: {
      ...formData,
    },
  };

  try {
    const { url } = await createCheckoutSession(payload);

    // 🌐 WEB
    if (Platform.OS === "web") {
      window.location.href = url;
      return;
    }

    // 📱 MOBILE
    if (await InAppBrowser.isAvailable()) {
      await InAppBrowser.openAuth(
        url,
        "godiyaoni://CurrentOrderStatusScreen",
        {
          dismissButtonStyle: "cancel",
          preferredBarTintColor: "#F97316",
          preferredControlTintColor: "white",
          showTitle: false,
        }
      );
    }
  } catch (err) {
    Alert.alert("Payment Error", "Unable to proceed to payment");
  }
};
  /* =====================
     LOADING STATE
  ====================== */
  if (isLoading || !restaurant) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#F97316" />
        <Text style={{ marginTop: 8 }}>Loading restaurant…</Text>
      </View>
    );
  }

  /* =====================
     RENDER
  ====================== */
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <Image
        source={{ uri: restaurant.imageUrl }}
        style={{
          width: "100%",
          height: 220,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
        }}
      />

      <View style={{ padding: 16 }}>
        <RestaurantInfo restaurant={restaurant} />

        <Text style={{ fontSize: 22, fontWeight: "700", marginVertical: 16 }}>
          Menu
        </Text>

        {restaurant.menuItem.map((item) => (
          <MenuItem
            key={item.id}
            menuItem={item}
            addToCart={() =>
              addToCart({
                id: item.id,
                name: item.name,
                price: item.price,
              })
            }
          />
        ))}

        <OrderSummary
          restaurant={restaurant}
          cartItems={cartItems}
          removeFromCart={removeFromCart}
        />

        {/* CHECKOUT BUTTON */}
        <TouchableOpacity
          disabled={cartItems.length === 0}
          onPress={() => setShowCheckoutForm(true)}
          style={{
            marginTop: 20,
            padding: 16,
            borderRadius: 12,
            backgroundColor:
              cartItems.length === 0 ? "#D1D5DB" : "#F97316",
          }}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontSize: 18,
              fontWeight: "600",
            }}
          >
            Proceed to Checkout
          </Text>
        </TouchableOpacity>
      </View>

      {/* =====================
          CHECKOUT FORM MODAL
      ====================== */}
      <Modal
        visible={showCheckoutForm}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCheckoutForm(false)}
      >
        <ScrollView style={{ flex: 1, padding: 16 }}>
          <UserProfileForm
            currentUser={{
              name: "",
              phone: "",
              addressLine1: "",
              city: "",
              country: "",
              email: "",
            }}
            isLoading={isCheckoutLoading}
            title="Confirm Delivery Details"
            buttonText="Proceed To Payment"
            onSave={(data) => {
              setShowCheckoutForm(false);
              onCheckout(data);
            }}
          />

          <TouchableOpacity
            onPress={() => setShowCheckoutForm(false)}
            style={{ marginTop: 20 }}
          >
            <Text style={{ textAlign: "center", color: "#EF4444" }}>
              Cancel
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </ScrollView>
  );
};

export default DetailScreen;
