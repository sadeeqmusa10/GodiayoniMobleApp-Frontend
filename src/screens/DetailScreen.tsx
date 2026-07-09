import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useGetRestaurant } from "../Api/RestaurantApi";
import RestaurantInfo from "../components/RestaurantInfo";
import MenuItem from "../components/MenuItem";
import OrderSummary from "@/components/OrderSummary";
import UserProfileForm, {
  UserFormData,
} from "../forms/user-profile-form/UserProfileForm";
import { RootStackParamList } from "../types";
import OrderDetailsForm, { OrderDetailsData } from "@/forms/order-details-form/OrderDetailsForm";
import SearchBar from "@/components/SearchBar";

/* =====================
   TYPES
===================== */

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
};

type DetailRouteProp = RouteProp<
  RootStackParamList,
  "DetailScreen"
>;

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList
>;

/* =====================
   COMPONENT
===================== */

const DetailScreen = () => {
  const route = useRoute<DetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { firebaseId } = route.params;

  const { restaurant, isLoading } =
    useGetRestaurant(firebaseId);

  const [cartItems, setCartItems] =
    useState<CartItem[]>([]);
  const [showCheckoutForm, setShowCheckoutForm] =
    useState(false);

    const [menuSearch, setMenuSearch] = useState("");

  /* =====================
     LOAD CART
  ====================== */

  useEffect(() => {
    if (!firebaseId) return;

    try {
      const stored =
        globalThis?.localStorage?.getItem(
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

  /* =====================
     CART HANDLERS
  ====================== */

  const addToCart = (menuItem: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
  }) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (i) => i.id === menuItem.id
      );

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
    const updated = cartItems.filter(
      (i) => i.id !== item.id
    );
    setCartItems(updated);
    persistCart(updated);
  };

  /* =====================
     FORM SUBMIT
  ====================== */

  const onContinue = (formData: OrderDetailsData) => {
    if (!restaurant) return;

    if (!formData.orderType) return;

    if (
      formData.orderType === "delivery" &&
      !formData.addressLine1
    ) {
      return;
    }

    setShowCheckoutForm(false);

    navigation.navigate("OrderReviewScreen", {
      restaurant,
      cartItems,
      deliveryDetails: formData, 
    });
  };

  /* =====================
     LOADING
  ====================== */

  if (isLoading || !restaurant) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" />
        <Text className="mt-3 text-gray-600">
          Loading restaurant…
        </Text>
      </View>
    );
  }

  const filteredMenu = restaurant.menuItem.filter((item) =>
 item.name.toLowerCase().includes(menuSearch.toLowerCase())
);

  /* =====================
     RENDER
  ====================== */

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <SearchBar
  placeholder="Search menu items..."
  searchQuery={menuSearch}
  onSubmit={(data) => setMenuSearch(data.searchQuery)}
  onChangeText={(text) => setMenuSearch(text)}
/>
      <Image
        source={{ uri: restaurant.imageUrl }}
        className="w-full h-56 rounded-b-3xl"
      />

      <View className="p-4">
        <RestaurantInfo restaurant={restaurant} />

        <Text className="text-2xl font-bold my-4 text-gray-800">
          Menu
        </Text>

        {filteredMenu.length === 0 ? (
  <Text className="text-center text-gray-500 mt-4">
    No menu items found.
  </Text>
) : (
  filteredMenu.map((item) => (
    <MenuItem
      key={item.id}
      menuItem={item}
      addToCart={() =>
        addToCart({
          id: item.id,
          name: item.name,
          price: item.price,
          imageUrl: item.imageUrl,
        })
      }
    />
  ))
)}

        <OrderSummary
          restaurant={restaurant}
          cartItems={cartItems}
          removeFromCart={removeFromCart}
        />

        <TouchableOpacity
          disabled={cartItems.length === 0}
          onPress={() => setShowCheckoutForm(true)}
          className={`mt-6 p-4 rounded-xl ${
            cartItems.length === 0
              ? "bg-gray-300"
              : "bg-orange-500"
          }`}
        >
          <Text className="text-white text-center text-lg font-semibold">
            Continue
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showCheckoutForm}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() =>
          setShowCheckoutForm(false)
        }
      >
        <ScrollView className="flex-1 bg-white p-4">
          <OrderDetailsForm
            title="Delivery Details"
            buttonText="Review Order"
            isLoading={false}
            onSave={onContinue}
          />

          <TouchableOpacity
            onPress={() =>
              setShowCheckoutForm(false)
            }
            className="mt-6"
          >
            <Text className="text-center text-red-500">
              Cancel
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </ScrollView>
  );
};

export default DetailScreen;
