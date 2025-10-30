import { Restaurant } from "../types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAuth } from "firebase/auth";
import { Alert } from "react-native";

// ✅ Expo uses process.env.EXPO_PUBLIC_ for environment variables
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL as string;

// 🔹 Helper to get Firebase token
const getFirebaseToken = async (): Promise<string> => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("User not authenticated!");
  }

  return currentUser.getIdToken();
};

// 🔹 Get My Restaurant
const useGetMyRestaurant = () => {
  const getMyRestaurantRequest = async (): Promise<Restaurant> => {
    const token = await getFirebaseToken();

    const response = await fetch(`${API_BASE_URL}/api/my/restaurant`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch restaurant!");
    }

    return response.json();
  };

  const { data: restaurant, isLoading } = useQuery({
    queryKey: ["fetchMyRestaurant"],
    queryFn: getMyRestaurantRequest,
  });

  return { restaurant, isLoading };
};

// 🔹 Create My Restaurant
const useCreateMyRestaurant = () => {
  const createMyRestaurantRequest = async (
    restaurantFormData: FormData
  ): Promise<Restaurant> => {
    const token = await getFirebaseToken();

    const response = await fetch(`${API_BASE_URL}/api/my/restaurant`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: restaurantFormData,
    });

    if (!response.ok) {
      throw new Error("Failed to create restaurant!");
    }

    return response.json();
  };

  const {
    mutate: createRestaurant,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: createMyRestaurantRequest,
    onSuccess: () => {
      Alert.alert("✅ Success", "Restaurant created successfully!");
    },
    onError: (err: any) => {
      Alert.alert("❌ Error", err.message || "Unable to create restaurant!");
    },
  });

  return { createRestaurant, isPending, isSuccess, isError, error };
};

// 🔹 Update My Restaurant
const useUpdateMyRestaurant = () => {
  const updateMyRestaurantRequest = async (
    restaurantFormData: FormData
  ): Promise<Restaurant> => {
    const token = await getFirebaseToken();

    const response = await fetch(`${API_BASE_URL}/api/my/restaurant`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: restaurantFormData,
    });

    if (!response.ok) {
      throw new Error("Failed to update restaurant!");
    }

    return response.json();
  };

  const {
    mutate: updateRestaurant,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: updateMyRestaurantRequest,
    onSuccess: () => {
      Alert.alert("✅ Success", "Restaurant updated successfully!");
    },
    onError: (err: any) => {
      Alert.alert("❌ Error", err.message || "Failed to update restaurant!");
    },
  });

  return { updateRestaurant, isPending, isSuccess, isError, error };
};

export default {
  useGetMyRestaurant,
  useCreateMyRestaurant,
  useUpdateMyRestaurant,
};
