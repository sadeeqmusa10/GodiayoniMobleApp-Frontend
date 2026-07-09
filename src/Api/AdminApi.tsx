import { db } from "@/config/firebase";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import Toast from "react-native-toast-message";

import {
  PickUpDelivery,
  DeliveryStatus,
  Order,
  OrderStatus,
  Restaurant,
  User,
} from "@/types";
import { API_BASE_URL } from "@/config/apibase";
import React from "react";

// =======================
// AUTH TOKEN HELPER
// =======================
export const getFirebaseToken = async (): Promise<string> => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");
  return user.getIdToken();
};

// =======================
// TYPES
// =======================
export type UpdateOrderStatusRequest = {
  orderId: string;
  status: OrderStatus;
};

export type UpdateDeliveryStatusRequest = {
  deliveryId: string;
  status: DeliveryStatus;
};

export type Admin = {
  id: string;
  name: string;
  email: string;
  role: string;
};

// =======================
// QUERIES
// =======================

// Get Admin Profile
export const useGetmyAdmin = () => {
  const options: UseQueryOptions<Admin, Error> = {
    queryKey: ["admin"],
    queryFn: async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("Admin not authenticated");

      const snap = await getDoc(doc(db, "admin", user.uid));
      if (!snap.exists()) throw new Error("Admin not found");

      return { id: user.uid, ...snap.data() } as Admin;
    },
    retry: false,
  
    
  };

  return useQuery(options);
};


const useGetAdmin = () => {
  const getMyUserRequest = async (): Promise<User | null> => {
    const currentUser = getAuth().currentUser;
    if (!currentUser) throw new Error("User not authenticated!");

    const userRef = doc(db, "admin", currentUser.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) throw new Error("User not found in Firestore!");

    return userSnap.data() as User;
  };

  const {
    data: currentUser,
    error,
    isPending,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["fetchCurrentUserFirestore"],
    queryFn: getMyUserRequest,
    enabled: !!getAuth().currentUser,
    staleTime: 1000 * 60 * 5,
  });

  // 🔔 Toast notifications handled via useEffect
  React.useEffect(() => {
    if (isError && error instanceof Error) {
      Toast.show({
        type: "error",
        text1: error.message.includes("403")
          ? "Your account has been disabled. Please contact support."
          : `Error: ${error.message}`,
      });
    }
  }, [isError, error]);

  return { currentUser, isPending, isError, isSuccess };
};

// Get Admin Restaurant
export const useGetAdminRestaurant = () => {
  const options: UseQueryOptions<Restaurant, Error> = {
    queryKey: ["adminRestaurant"],
    queryFn: async () => {
      const token = await getFirebaseToken();
      const res = await fetch(`${API_BASE_URL}/api/my/admin/restaurant`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch restaurant");
      return res.json();
    },
  
  };

  return useQuery(options);
};

// Get All Restaurants + Orders
export const useGetAllRestaurantsWithOrders = () => {
  const options: UseQueryOptions<(Restaurant & { orders: Order[] })[], Error> = {
    queryKey: ["restaurantsWithOrders"],
    queryFn: async () => {
      const token = await getFirebaseToken();
      const res = await fetch(`${API_BASE_URL}/api/my/admin/restaurant`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch restaurants");
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  
  };

  return useQuery(options);
};

export const useGetAllAdminRestaurants = () => {
  return useQuery<Restaurant[], Error>({
    queryKey: ["restaurants"],
    queryFn: async () => {
      const token = await getFirebaseToken();
      const res = await fetch(`${API_BASE_URL}/api/my/admin/restaurant`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch restaurants");
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetAllAdminOrders = (restaurantId?: string) => {
  return useQuery<Order[], Error>({
    queryKey: ["orders", restaurantId],
    queryFn: async () => {
      const token = await getFirebaseToken();
      const url = new URL(`${API_BASE_URL}/api/my/admin/orders`);
      if (restaurantId) url.searchParams.append("restaurantId", restaurantId);

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });
};



// Get All Deliveries
export const useGetAllDeliveries = () => {
  const options: UseQueryOptions<PickUpDelivery[], Error> = {
    queryKey: ["deliveries"],
    queryFn: async () => {
      const token = await getFirebaseToken();
      const res = await fetch(`${API_BASE_URL}/api/my/admin/delivery`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch deliveries");
      return res.json();
    },
  
  };

  return useQuery(options);
};

// =======================
// MUTATIONS
// =======================

const defaultMutationOptions = <TData, TVariables>(
  successMessage: string,
  invalidateKeys: string[]
): UseMutationOptions<TData, Error, TVariables> => ({
  onSuccess: (_, __, context) => {
    Toast.show({ type: "success", text1: successMessage });
    const qc = useQueryClient();
    invalidateKeys.forEach((key) => qc.invalidateQueries({ queryKey: [key] }));
  },
  onError: (err) =>
    Toast.show({
      type: "error",
      text1: "Operation failed",
      text2: err.message,
    }),
});

// Update Order Status
export const useUpdateAdminOrderStatus = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: UpdateOrderStatusRequest) => {
      const token = await getFirebaseToken();
      const res = await fetch(
        `${API_BASE_URL}/api/my/admin/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );
      if (!res.ok) throw new Error("Order update failed");
      return res.json();
    },
    onSuccess: () => {
      Toast.show({ type: "success", text1: "Order status updated" });
      qc.invalidateQueries({ queryKey: ["restaurantsWithOrders"] });
    },
    onError: (err: any) => {
      Toast.show({ type: "error", text1: "Failed to update order", text2: err.message });
    },
  });
};

// Create Restaurant
export const useCreateAdminRestaurant = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData) => {
      const token = await getFirebaseToken();
      const res = await fetch(`${API_BASE_URL}/api/my/admin/restaurant`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });
      if (!res.ok) throw new Error("Create restaurant failed");
      return res.json();
    },
    onSuccess: () => {
      Toast.show({ type: "success", text1: "Restaurant created" });
      qc.invalidateQueries({ queryKey: ["adminRestaurant"] });
    },
    onError: (err: any) => {
      Toast.show({ type: "error", text1: "Failed to create restaurant", text2: err.message });
    },
  });
};

// Update Restaurant
export const useUpdateAdminRestaurant = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      restaurantId,
      data,
    }: {
      restaurantId: string;
      data: FormData;
    }) => {
      const token = await getFirebaseToken();
      const res = await fetch(
        `${API_BASE_URL}/api/my/admin/restaurant/${restaurantId}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: data,
        }
      );
      if (!res.ok) throw new Error("Update restaurant failed");
      return res.json();
    },
    onSuccess: () => {
      Toast.show({ type: "success", text1: "Restaurant updated" });
      qc.invalidateQueries({ queryKey: ["adminRestaurant"] });
      qc.invalidateQueries({ queryKey: ["restaurantsWithOrders"] });
    },
    onError: (err: any) => {
      Toast.show({ type: "error", text1: "Failed to update restaurant", text2: err.message });
    },
  });
};

// Update Delivery Status
export const useUpdateDeliveryStatus = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ deliveryId, status }: UpdateDeliveryStatusRequest) => {
      const token = await getFirebaseToken();
      const res = await fetch(
        `${API_BASE_URL}/api/my/admin/delivery/${deliveryId}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );
      if (!res.ok) throw new Error("Delivery update failed");
      return res.json();
    },
    onSuccess: () => {
      Toast.show({ type: "success", text1: "Delivery status updated" });
      qc.invalidateQueries({ queryKey: ["deliveries"] });
    },
    onError: (err: any) => {
      Toast.show({ type: "error", text1: "Failed to update delivery", text2: err.message });
    },
  });
};
