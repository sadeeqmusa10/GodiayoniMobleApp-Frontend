// AdminApi.ts (Expo + TypeScript + React Query v4)
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Toast from "react-native-toast-message";
import Constants from "expo-constants";
import { db } from "../config/firebase";
import {
  Order,
  OrderStatus,
  Restaurant,
  Delivery,
  DeliveryStatus,
} from "../types";

// ---------- Expo API base URL ----------
const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

// ---------- Helper: Get Firebase Token ----------
const getFirebaseToken = async (): Promise<string> => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("User not authenticated!");
  return currentUser.getIdToken();
};

// ---------- Types ----------
export type UpdateOrderStatusRequest = {
  orderId: string;
  status: OrderStatus;
};

export type UpdateDeliveryStatusRequest = {
  deliveryId: string;
  status: DeliveryStatus;
};

// ---------- Admin Hooks ----------

type Admin = { id: string; name: string; email: string; role: string };

// Fetch admin info from Firestore
const useGetAdmin = () => {
  const getAdminRequest = async (): Promise<Admin> => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("Admin not authenticated!");

    const adminRef = doc(db, "admin", currentUser.uid);
    const adminSnap = await getDoc(adminRef);
    if (!adminSnap.exists()) throw new Error("Admin not found in Firestore!");

    return { id: currentUser.uid, ...adminSnap.data() } as Admin;
  };

  return useQuery<Admin, Error>({
    queryKey: ["fetchAdmin"],
    queryFn: getAdminRequest,
    onError: (error: Error) => {
      Toast.show({ type: "error", text1: error.message });
    },
  });
};

// Fetch the admin's restaurant
const useGetAdminRestaurant = () => {
  const getAdminRestaurantRequest = async (): Promise<Restaurant> => {
    const token = await getFirebaseToken();
    const response = await fetch(`${API_BASE_URL}/api/my/admin/restaurant`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch restaurant!");
    return response.json();
  };

  return useQuery<Restaurant, Error>({
    queryKey: ["fetchAdminRestaurant"],
    queryFn: getAdminRestaurantRequest,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

// Fetch all restaurants with orders
const useGetAllRestaurantsWithOrders = () => {
  const getAllRestaurantsWithOrdersRequest = async (): Promise<
    (Restaurant & { orders: Order[] })[]
  > => {
    const token = await getFirebaseToken();
    const response = await fetch(`${API_BASE_URL}/api/my/admin/restaurant`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok)
      throw new Error("Failed to fetch restaurants with orders");
    return response.json();
  };

  return useQuery({
    queryKey: ["fetchRestaurantsWithOrders"],
    queryFn: getAllRestaurantsWithOrdersRequest,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

// ---------- Mutations ----------

const useUpdateAdminOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, UpdateOrderStatusRequest>({
    mutationFn: async ({ orderId, status }) => {
      const token = await getFirebaseToken();
      const response = await fetch(
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
      if (!response.ok) throw new Error("Failed to update order status");
      return response.json();
    },
    onSuccess: () => {
      Toast.show({ type: "success", text1: "Order status updated" });
      queryClient.invalidateQueries({
        queryKey: ["fetchRestaurantsWithOrders"],
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: error.message || "Failed to update order status",
      });
    },
  });
};

const useUpdateDeliveryStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, UpdateDeliveryStatusRequest>({
    mutationFn: async ({ deliveryId, status }) => {
      const token = await getFirebaseToken();
      const response = await fetch(
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
      if (!response.ok) throw new Error("Failed to update delivery status");
      return response.json();
    },
    onSuccess: () => {
      Toast.show({ type: "success", text1: "Delivery status updated" });
      queryClient.invalidateQueries({ queryKey: ["fetchAllDelivery"] });
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: error.message || "Failed to update delivery status",
      });
    },
  });
};

const useCreateAdminRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation<Restaurant, Error, FormData>({
    mutationFn: async (formData) => {
      const token = await getFirebaseToken();
      const response = await fetch(`${API_BASE_URL}/api/my/admin/restaurant`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to create restaurant");
      return response.json();
    },
    onSuccess: () => {
      Toast.show({ type: "success", text1: "Restaurant created!" });
      queryClient.invalidateQueries({
        queryKey: ["fetchRestaurantsWithOrders"],
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: error.message || "Failed to create restaurant",
      });
    },
  });
};

type UpdateAdminRestaurantRequest = { restaurantId: string; data: FormData };

const useUpdateAdminRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation<Restaurant, Error, UpdateAdminRestaurantRequest>({
    mutationFn: async ({ restaurantId, data }) => {
      const token = await getFirebaseToken();
      const response = await fetch(
        `${API_BASE_URL}/api/my/admin/restaurant/${restaurantId}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: data,
        }
      );
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to update restaurant: ${text}`);
      }
      return response.json();
    },
    onSuccess: () => {
      Toast.show({ type: "success", text1: "Restaurant updated successfully" });
      queryClient.invalidateQueries({
        queryKey: ["fetchRestaurantsWithOrders"],
      });
      queryClient.invalidateQueries({ queryKey: ["fetchAdminRestaurant"] });
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: error.message || "Failed to update restaurant",
      });
    },
  });
};

// Fetch all deliveries
const useGetAllDeliveries = () => {
  const auth = getAuth();

  const getAllDelivery = async (): Promise<Delivery[]> => {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error("User not authenticated");

    const response = await fetch(`${API_BASE_URL}/api/my/admin/delivery`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch deliveries");
    return response.json();
  };

  return useQuery<Delivery[], Error>({
    queryKey: ["fetchAllDelivery"],
    queryFn: getAllDelivery,
    enabled: !!auth.currentUser,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    onSuccess: () => {
      Toast.show({ type: "success", text1: "Deliveries loaded successfully" });
    },
    onError: (error: Error) => {
      Toast.show({
        type: "error",
        text1: error.message || "Unable to fetch deliveries",
      });
    },
  });
};

export default {
  getFirebaseToken,
  useGetAllDeliveries,
  useUpdateAdminRestaurant,
  useCreateAdminRestaurant,
  useUpdateDeliveryStatus,
  useUpdateAdminOrderStatus,
  useGetAllRestaurantsWithOrders,
  useGetAdminRestaurant,
  useGetAdmin,
};
