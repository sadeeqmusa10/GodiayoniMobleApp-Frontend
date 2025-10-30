import { useMutation, useQuery } from "@tanstack/react-query";
import { Delivery } from "../types";
import Toast from "react-native-toast-message";
import { getAuth } from "firebase/auth";
import Constants from "expo-constants";

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

// ✅ Helper: Get Firebase Token
const getFirebaseToken = async (): Promise<string> => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("User not authenticated!");
  return currentUser.getIdToken();
};

// ✅ Create Delivery
 const useCreateMyDelivery = () => {
  const createMyDeliveryRequest = async (
    DeliveryFormData: FormData
  ): Promise<Delivery> => {
    const token = await getFirebaseToken();

    const response = await fetch(`${API_BASE_URL}/api/delivery`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: DeliveryFormData,
    });

    if (!response.ok) {
      throw new Error("Failed to create Delivery!");
    }

    return response.json();
  };

  const {
    mutateAsync: createDelivery,
    status,
    error,
    isPending, // ✅ replaces isLoading
    isError,
    isSuccess,
  } = useMutation<Delivery, Error, FormData>({
    mutationFn: createMyDeliveryRequest,
    onSuccess: () => {
      Toast.show({ type: "success", text1: "Delivery created!" });
    },
    onError: () => {
      Toast.show({ type: "error", text1: "Unable to create Delivery!" });
    },
  });

  return { createDelivery, isPending, isSuccess, isError, error };
};

// ✅ Create Delivery Checkout Session
 const useCreateDeliverySession = () => {
  const auth = getAuth();

  const createDeliverySessionRequest = async ({
    deliveryId,
  }: {
    deliveryId: string;
  }) => {
    const token = await auth.currentUser?.getIdToken();

    const response = await fetch(
      `${API_BASE_URL}/api/delivery/checkout/create-checkout-session/${deliveryId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) throw new Error("Failed to create delivery session");

    return response.json(); // expects { url: string }
  };
  const {
    mutateAsync: createDeliverySession,
    isPending,
    isError,
    isSuccess,
    error,
    reset,
  } = useMutation<{ url: string }, Error, { deliveryId: string }>({
    mutationFn: createDeliverySessionRequest,
    onError: (err: Error) => {
      Toast.show({ type: "error", text1: err.message });
    },
  });

  return { createDeliverySession, isPending, error, reset };
};

// ✅ Fetch Delivery by ID
const useGetDeliveryOrder = (deliveryId?: string) => {
  const getDeliveryByIdRequest = async (): Promise<Delivery> => {
    const token = await getFirebaseToken();

    const response = await fetch(`${API_BASE_URL}/api/delivery/${deliveryId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch delivery");
    }

    return response.json();
  };

  const { data: delivery, isLoading } = useQuery({
    queryKey: ["fetchDelivery", deliveryId],
    queryFn: getDeliveryByIdRequest,
    enabled: !!deliveryId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    meta: {
      onSuccess: () => {
        Toast.show({ type: "success", text1: "Delivery loaded successfully!" });
      },
      onError: () => {
        Toast.show({ type: "error", text1: "Unable to load delivery!" });
      },
    },
  });
  return { data: delivery, isLoading };
};

export default {
  useCreateMyDelivery,
  useCreateDeliverySession,
  useGetDeliveryOrder,
};