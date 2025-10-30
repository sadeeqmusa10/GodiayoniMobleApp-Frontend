import { Order } from "../types";
import { getAuth } from "firebase/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import Constants from "expo-constants";
import React from "react";

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

// ✅ Get My Orders
const useGetMyOrders = () => {
  const auth = getAuth();

  const getMyOrdersRequest = async (): Promise<Order[]> => {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error("User not authenticated");

    const response = await fetch(`${API_BASE_URL}/api/order`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to get orders");

    const data: Order[] = await response.json();

    // Fallback for missing restaurant data
    return data.map((order) => ({
      ...order,
      restaurant: order.restaurant || {
        restaurantName: "Unknown Restaurant",
        imageUrl: "/placeholder.png",
        estimatedDeliveryTime: 0,
      },
    }));
  };

  const query = useQuery({
    queryKey: ["fetchMyOrders"],
    queryFn: getMyOrdersRequest,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    refetchOnWindowFocus: false,
  });

  // ✅ Toasts via side effect (since v5 removed onSuccess/onError)
  React.useEffect(() => {
    if (query.isSuccess) {
      Toast.show({ type: "success", text1: "Orders loaded successfully!" });
    } else if (query.isError && query.error instanceof Error) {
      Toast.show({ type: "error", text1: query.error.message });
    }
  }, [query.isSuccess, query.isError]);

  return {
    orders: query.data,
    isPending: query.isPending, // ⬅️ replaces isLoading
    isError: query.isError,
    isSuccess: query.isSuccess,
  };
};

// ✅ Checkout session
type CheckoutSessionRequest = {
  cartItems: {
    menuItemId: string;
    name: string;
    quantity: string;
  }[];
  deliveryDetails: {
    email: string;
    name: string;
    phone: string;
    addressLine1: string;
    city: string;
  };
  restaurantId: string;
};

const useCreateCheckoutSession = () => {
  const auth = getAuth();

  const createCheckoutSessionRequest = async (
    checkoutSessionRequest: CheckoutSessionRequest
  ) => {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error("User not authenticated");

    const response = await fetch(
      `${API_BASE_URL}/api/order/checkout/create-checkout-session`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutSessionRequest),
      }
    );

    if (!response.ok) throw new Error("Unable to create checkout session");

    return response.json();
  };

  const mutation = useMutation({
    mutationFn: createCheckoutSessionRequest,
  });

  // ✅ Toasts handled reactively
  React.useEffect(() => {
    if (mutation.isSuccess) {
      Toast.show({
        type: "success",
        text1: "Checkout created successfully!",
      });
    } else if (mutation.isError && mutation.error instanceof Error) {
      Toast.show({
        type: "error",
        text1: mutation.error.message,
      });
    }
  }, [mutation.isSuccess, mutation.isError]);

  return {
    createCheckoutSession: mutation.mutateAsync,
    isPending: mutation.isPending, // ⬅️ replaces isLoading
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
  };
};

export default { useGetMyOrders, useCreateCheckoutSession };
