import { useMutation, UseMutationResult, useQuery } from "@tanstack/react-query";
import { Platform } from "react-native";
import Toast from "react-native-toast-message";
import { getAuth } from "firebase/auth";
import Constants from "expo-constants";
import { Delivery } from "../types";

/* ======================================================
   API BASE URL
====================================================== */
const API_BASE_URL =
  Constants.expoConfig?.extra?.API_BASE_URL ??
  (Platform.OS === "web" ? "http://localhost:8000" : "http://10.0.2.2:8000");


  interface CreateDeliverySessionInput {
  deliveryId: string;
}

interface CreateDeliverySessionResponse {
  url: string;
}

/* ======================================================
   FIREBASE TOKEN HELPER
====================================================== */
const getFirebaseToken = async (): Promise<string> => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");
  // Force refresh token to prevent 403
  return user.getIdToken(true);
};

/* ======================================================
   CREATE DELIVERY
====================================================== */
type CreateDeliveryResponse = { deliveryId: string };

const useCreateMyDelivery = () => {
  const createMyDeliveryRequest = async (formData: FormData): Promise<CreateDeliveryResponse> => {
    const token = await getFirebaseToken();

    const response = await fetch(`${API_BASE_URL}/api/delivery`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // Only Authorization header
      },
      body: formData, // Do NOT set Content-Type when sending FormData
    });

    const json = await response.json().catch(() => null);
    if (!response.ok) throw new Error(json?.message || "Failed to create delivery");

    return json as CreateDeliveryResponse;
  };

  const mutation = useMutation<CreateDeliveryResponse, Error, FormData>({
    mutationFn: createMyDeliveryRequest,
    onSuccess: () => {
      Toast.show({ type: "success", text1: "Delivery created successfully" });
    },
    onError: (err) => {
      Toast.show({ type: "error", text1: err.message });
    },
  });

  return {
    createDelivery: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    reset: mutation.reset,
  };
};

/* ======================================================
   CREATE DELIVERY CHECKOUT SESSION
====================================================== */
 const useCreateDeliverySession = (): {
  createDeliverySession: (input: CreateDeliverySessionInput) => Promise<CreateDeliverySessionResponse>;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  reset: () => void;
} => {
  const mutation: UseMutationResult<CreateDeliverySessionResponse, Error, CreateDeliverySessionInput> =
    useMutation<CreateDeliverySessionResponse, Error, CreateDeliverySessionInput>({
      mutationFn: async ({ deliveryId }: CreateDeliverySessionInput) => {
        const token = await getFirebaseToken();

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

        const json = await response.json();
        if (!response.ok) throw new Error(json?.message || "Failed to create checkout session");
        return json as CreateDeliverySessionResponse;
      },
      onError: (err: Error) => {
        Toast.show({ type: "error", text1: err.message });
      },
    });

  return {
    createDeliverySession: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
};


/* ======================================================
   FETCH DELIVERY BY ID
====================================================== */
const useGetDeliveryOrder = (deliveryId?: string) => {
  const getDeliveryByIdRequest = async (): Promise<Delivery> => {
    if (!deliveryId) throw new Error("DeliveryId is required");
    const token = await getFirebaseToken();

    const response = await fetch(`${API_BASE_URL}/api/delivery/${deliveryId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const json = await response.json().catch(() => null);
    if (!response.ok) throw new Error(json?.message || "Failed to fetch delivery");

    return json.delivery ?? json.data ?? json;
  };

  return useQuery({
    queryKey: ["delivery", deliveryId],
    queryFn: getDeliveryByIdRequest,
    enabled: !!deliveryId,
    staleTime: 1000 * 60 * 5,
  });
};

/* ======================================================
   EXPORT
====================================================== */
export { useCreateMyDelivery, useCreateDeliverySession, useGetDeliveryOrder };
