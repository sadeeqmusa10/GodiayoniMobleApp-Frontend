import { useMutation, UseMutationResult, useQuery } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { getAuth } from "firebase/auth";
import { PickUpDelivery } from "../types";
import { API_BASE_URL } from "@/config/apibase";

/* ======================================================
   API BASE URL
====================================================== */
interface CreateDoorToDoorDeliverySessionInput {
  deliveryId: string;
}

interface CreateWayBillDeliverySessionInput {
  deliveryId: string;
}

interface CreateWayBillDeliverySessionInput {
  url: string;
}
interface CreateWayBillDeliverySessionResponse {
  url: string;
}


interface CreateDoorToDoorDeliverySessionResponse {
  url: string;
}

  interface CreatePickUpDeliverySessionInput {
  deliveryId: string;
}

interface CreatePickUpDeliverySessionResponse {
  url: string;
}

  interface CreateMotorParkDeliverySessionInput {
  deliveryId: string;
}

interface CreateMotorParkDeliverySessionResponse {
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
type CreatePickUpDeliveryResponse = { deliveryId: string };

const useCreateMyPickUpDelivery = () => {
  const createMyPickUpDeliveryRequest = async (formData: FormData): Promise<CreatePickUpDeliveryResponse> => {
    const token = await getFirebaseToken();

    const response = await fetch(`${API_BASE_URL}/api/pickUpDelivery`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // Only Authorization header
      },
      body: formData, // Do NOT set Content-Type when sending FormData
    });

    const json = await response.json().catch(() => null);
    if (!response.ok) throw new Error(json?.message || "Failed to create delivery");

    return json as CreatePickUpDeliveryResponse;
  };

  const mutation = useMutation<CreatePickUpDeliveryResponse, Error, FormData>({
    mutationFn: createMyPickUpDeliveryRequest,
    onSuccess: () => {
      Toast.show({ type: "success", text1: "Delivery created successfully" });
    },
    onError: (err) => {
      Toast.show({ type: "error", text1: err.message });
    },
  });

  return {
    createPickUpDelivery: mutation.mutateAsync,
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
 const useCreatePickUpDeliverySession = (): {
  createPickUpDeliverySession: (input: CreatePickUpDeliverySessionInput) => Promise<CreatePickUpDeliverySessionResponse>;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  reset: () => void;
} => {
  const mutation: UseMutationResult<CreatePickUpDeliverySessionResponse, Error, CreatePickUpDeliverySessionInput> =
    useMutation<CreatePickUpDeliverySessionResponse, Error, CreatePickUpDeliverySessionInput>({
      mutationFn: async ({ deliveryId }: CreatePickUpDeliverySessionInput) => {
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
        return json as CreatePickUpDeliverySessionResponse;
      },
      onError: (err: Error) => {
        Toast.show({ type: "error", text1: err.message });
      },
    });

  return {
    createPickUpDeliverySession: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
};

/* ======================================================
   CREATE DoorToDoor DELIVERY
====================================================== */
type CreateDoorToDoorDeliveryResponse = { deliveryId: string };

const useCreateMyDoorToDoorDelivery = () => {
  const createMyDoorToDoorDeliveryRequest = async (formData: FormData): Promise<CreateDoorToDoorDeliveryResponse> => {
    const token = await getFirebaseToken();

    const response = await fetch(`${API_BASE_URL}/api/doorToDoorDelivery`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // Only Authorization header
      },
      body: formData, // Do NOT set Content-Type when sending FormData
    });

    const json = await response.json().catch(() => null);
    if (!response.ok) throw new Error(json?.message || "Failed to create delivery");

    return json as CreateDoorToDoorDeliveryResponse;
  };

  const mutation = useMutation<CreateDoorToDoorDeliveryResponse, Error, FormData>({
    mutationFn: createMyDoorToDoorDeliveryRequest,
    onSuccess: () => {
      Toast.show({ type: "success", text1: "Delivery created successfully" });
    },
    onError: (err) => {
      Toast.show({ type: "error", text1: err.message });
    },
  });

  return {
    createDoorToDoorDelivery: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    reset: mutation.reset,
  };
};

/* ======================================================
   CREATE DoorToDoor DELIVERY CHECKOUT SESSION
====================================================== */
 const useCreateDoorToDoorDeliverySession = (): {
  createDoorToDoorDeliverySession: (input: CreateDoorToDoorDeliverySessionInput) => Promise<CreateDoorToDoorDeliverySessionResponse>;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  reset: () => void;
} => {
  const mutation: UseMutationResult<CreateDoorToDoorDeliverySessionResponse, Error, CreateDoorToDoorDeliverySessionInput> =
    useMutation<CreateDoorToDoorDeliverySessionResponse, Error, CreateDoorToDoorDeliverySessionInput>({
      mutationFn: async ({ deliveryId }: CreateDoorToDoorDeliverySessionInput) => {
        const token = await getFirebaseToken();

        const response = await fetch(
          `${API_BASE_URL}/api/doorToDoorDelivery/checkout/create-checkout-session/${deliveryId}`,
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
        return json as CreateDoorToDoorDeliverySessionResponse;
      },
      onError: (err: Error) => {
        Toast.show({ type: "error", text1: err.message });
      },
    });

  return {
    createDoorToDoorDeliverySession: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
};


/* ======================================================
   CREATE WayBill DELIVERY
====================================================== */
type CreateWayBillDeliveryResponse = { deliveryId: string };

const useCreateWayBillDelivery = () => {
  const createWayBillDeliveryRequest = async (formData: FormData): Promise<CreateWayBillDeliveryResponse> => {
    const token = await getFirebaseToken();

    const response = await fetch(`${API_BASE_URL}/api/WayBillDelivery`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // Only Authorization header
      },
      body: formData, // Do NOT set Content-Type when sending FormData
    });

    const json = await response.json().catch(() => null);
    if (!response.ok) throw new Error(json?.message || "Failed to create delivery");

    return json as CreateWayBillDeliveryResponse;
  };

  const mutation = useMutation<CreateWayBillDeliveryResponse, Error, FormData>({
    mutationFn: createWayBillDeliveryRequest,
    onSuccess: () => {
      Toast.show({ type: "success", text1: "Delivery created successfully" });
    },
    onError: (err) => {
      Toast.show({ type: "error", text1: err.message });
    },
  });

  return {
    createWayBillDelivery: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    reset: mutation.reset,
  };
};

/* ======================================================
   CREATE WayBill DELIVERY CHECKOUT SESSION
====================================================== */
 const useCreateWayBillDeliverySession = (): {
  createWayBillDeliverySession: (input: CreateWayBillDeliverySessionInput) => Promise<CreateWayBillDeliverySessionResponse>;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  reset: () => void;
} => {
  const mutation: UseMutationResult<CreateWayBillDeliverySessionResponse, Error, CreateWayBillDeliverySessionInput> =
    useMutation<CreateWayBillDeliverySessionResponse, Error, CreateWayBillDeliverySessionInput>({
      mutationFn: async ({ deliveryId }: CreateWayBillDeliverySessionInput) => {
        const token = await getFirebaseToken();

        const response = await fetch(
          `${API_BASE_URL}/api/wayBiilDelivery/checkout/create-checkout-session/${deliveryId}`,
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
        return json as CreateWayBillDeliverySessionResponse;
      },
      onError: (err: Error) => {
        Toast.show({ type: "error", text1: err.message });
      },
    });

  return {
    createWayBillDeliverySession: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
};


/* ======================================================
   CREATE MotorPark DELIVERY
====================================================== */
type CreateMotorParkDeliveryResponse = { deliveryId: string };

const useCreateMyMotorParkDelivery = () => {
  const createMyMotorParkDeliveryRequest = async (formData: FormData): Promise<CreateMotorParkDeliveryResponse> => {
    const token = await getFirebaseToken();

    const response = await fetch(`${API_BASE_URL}/api/MotorParkDelivery`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // Only Authorization header
      },
      body: formData, // Do NOT set Content-Type when sending FormData
    });

    const json = await response.json().catch(() => null);
    if (!response.ok) throw new Error(json?.message || "Failed to create delivery");

    return json as CreateMotorParkDeliveryResponse;
  };

  const mutation = useMutation<CreateMotorParkDeliveryResponse, Error, FormData>({
    mutationFn: createMyMotorParkDeliveryRequest,
    onSuccess: () => {
      Toast.show({ type: "success", text1: "Delivery created successfully" });
    },
    onError: (err) => {
      Toast.show({ type: "error", text1: err.message });
    },
  });

  return {
    createMotorParkDelivery: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    reset: mutation.reset,
  };
};


 const useCreateMotorParkDeliverySession = (): {
  createMotorParkDeliverySession: (input: CreateMotorParkDeliverySessionInput) => Promise<CreateMotorParkDeliverySessionResponse>;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  reset: () => void;
} => {
  const mutation: UseMutationResult<CreateMotorParkDeliverySessionResponse, Error, CreateMotorParkDeliverySessionInput> =
    useMutation<CreateMotorParkDeliverySessionResponse, Error, CreateMotorParkDeliverySessionInput>({
      mutationFn: async ({ deliveryId }: CreateMotorParkDeliverySessionInput) => {
        const token = await getFirebaseToken();

        const response = await fetch(
          `${API_BASE_URL}/api/MotorParkDelivery/checkout/create-checkout-session/${deliveryId}`,
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
        return json as CreateMotorParkDeliverySessionResponse;
      },
      onError: (err: Error) => {
        Toast.show({ type: "error", text1: err.message });
      },
    });

  return {
    createMotorParkDeliverySession: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
};


/* ======================================================
   FETCH PICK UP DELIVERY BY ID
====================================================== */
const useGetPickUpDeliveryOrder = (deliveryId?: string) => {
  const getPickUpDeliveryByIdRequest = async (): Promise<PickUpDelivery> => {
    if (!deliveryId) throw new Error("PickUpDeliveryId is required");
    const token = await getFirebaseToken();

    const response = await fetch(`${API_BASE_URL}/api/PickUpdelivery/${deliveryId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const json = await response.json().catch(() => null);
    if (!response.ok) throw new Error(json?.message || "Failed to fetch Pickdelivery");

    return json.delivery ?? json.data ?? json;
  };

  return useQuery({
    queryKey: ["PickUpdelivery", deliveryId],
    queryFn: getPickUpDeliveryByIdRequest,
    enabled: !!deliveryId,
    staleTime: 1000 * 60 * 5,
  });
};

/* ======================================================
   EXPORT
====================================================== */
export { useCreateMyPickUpDelivery, useCreateMyDoorToDoorDelivery, useCreateWayBillDelivery, useCreateMyMotorParkDelivery, useCreatePickUpDeliverySession, useCreateDoorToDoorDeliverySession, useCreateMotorParkDeliverySession, useCreateWayBillDeliverySession, useGetPickUpDeliveryOrder };
