import { Order } from "../types";
import { getAuth } from "firebase/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import Constants from "expo-constants";
import React from "react";

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

// ============================
// GET MY ORDERS
// ============================
const useGetMyOrders = () => {
  const auth = getAuth();
  const toastShown = React.useRef(false);

  const getMyOrdersRequest = async (): Promise<Order[]> => {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error("User not authenticated");

    const res = await fetch(`${API_BASE_URL}/api/order`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Failed to get orders");

    const json = await res.json();
    return json.data;
  };

  const query = useQuery({
    queryKey: ["my-orders"],
    queryFn: getMyOrdersRequest,
    staleTime: 1000 * 60 * 5,
  });

  React.useEffect(() => {
    if (query.isSuccess && !toastShown.current) {
      Toast.show({ type: "success", text1: "Orders loaded" });
      toastShown.current = true;
    }
    if (query.isError && query.error instanceof Error) {
      Toast.show({ type: "error", text1: query.error.message });
    }
  }, [query.isSuccess, query.isError]);

  return {
    orders: query.data,
    isPending: query.isPending,
  };
};

// ============================
// CREATE CHECKOUT SESSION
// ============================
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

  const createCheckoutSessionRequest = async (checkoutSessionRequest : CheckoutSessionRequest) => {
    const token = await auth.currentUser?.getIdToken();

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

    if (!response.ok) {
      throw new Error(`unable to create checkout session`);
    }
    return response.json();
  };
  const mutation = useMutation({
    mutationFn: createCheckoutSessionRequest,
  });

  return {
    createCheckoutSession: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
};

export const useGetOrderById = (orderId: string, options?: any) => {
  const auth = getAuth();

  const fetchOrder = async () => {
    const token = await auth.currentUser?.getIdToken();
    if (!token) {
      throw new Error("User not authenticated");
    }

    const res = await fetch(
      `${API_BASE_URL}/api/orders/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch order");
    }

    const json = await res.json();
    return json.data ?? json;
  };

  const { data, isPending, isError } = useQuery({
    queryKey: ["order", orderId],
    queryFn: fetchOrder,
    enabled: options?.enabled,
    refetchInterval: options?.refetchInterval,
  });

  return {
    order: data,
    isPending,
    isError,
  };
};


export { useGetMyOrders, useCreateCheckoutSession };
