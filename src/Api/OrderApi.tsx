import React from "react";
import { Order } from "../types";
import { getAuth } from "firebase/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { API_BASE_URL } from "@/config/apibase";

/* ============================
   GET MY ORDERS
============================ */

const useGetMyOrders = () => {
  const auth = getAuth();
  const toastShown = React.useRef(false);

  const getMyOrdersRequest = async (): Promise<Order[]> => {
    const token = await auth.currentUser?.getIdToken();
    if (!token) {
      throw new Error("User not authenticated");
    }

    const res = await fetch(`${API_BASE_URL}/api/order`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to get orders");
    }

    const json = await res.json();
    return json.data ?? [];
  };

  const query = useQuery({
    queryKey: ["my-orders"],
    queryFn: getMyOrdersRequest,
    staleTime: 1000 * 60 * 5,
  });

  React.useEffect(() => {
    if (query.isSuccess && !toastShown.current) {
      Toast.show({
        type: "success",
        text1: "Orders loaded",
      });
      toastShown.current = true;
    }

    if (query.isError && query.error instanceof Error) {
      Toast.show({
        type: "error",
        text1: query.error.message,
      });
    }
  }, [query.isSuccess, query.isError]);

  return {
    orders: query.data ?? [],
    isPending: query.isPending,
  };
};

/* ============================
   CREATE CHECKOUT SESSION
============================ */

export type CheckoutSessionRequest = {
  restaurantId: string;

  cartItems: {
    id: string;
    name: string;
    quantity: number;
    imageUrl: string;
  }[];

  deliveryDetails: {
    name: string;
    phone: string;

    orderType: "delivery" | "takeaway" | "dining";
    deliveryType?: "standard" | "express" | "same-day";

    addressLine1?: {
      text: string;
      lat: number;
      lng: number;
    };

    city?: string;
    country?: string;
  };
};

const useCreateCheckoutSession = () => {
  const auth = getAuth();

  const createCheckoutSessionRequest = async (
    payload: CheckoutSessionRequest
  ) => {
    const token = await auth.currentUser?.getIdToken();

    if (!token) {
      throw new Error("User not authenticated");
    }

    const response = await fetch(
      `${API_BASE_URL}/api/order/checkout/create-checkout-session`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(
        err?.message ?? "Unable to create checkout session"
      );
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

/* ============================
   GET ORDER BY ID
============================ */

export const useGetOrderById = (
  orderId: string,
  options?: {
    enabled?: boolean;
    refetchInterval?: number;
  }
) => {
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

  const query = useQuery({
    queryKey: ["order", orderId],
    queryFn: fetchOrder,
    enabled: options?.enabled ?? true,
    refetchInterval: options?.refetchInterval,
  });

  return {
    order: query.data,
    isPending: query.isPending,
    isError: query.isError,
  };
};

export {
  useGetMyOrders,
  useCreateCheckoutSession,
};
