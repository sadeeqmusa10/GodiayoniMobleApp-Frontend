import { Delivery } from "../types";
import { getAuth } from "firebase/auth";
import { useQuery } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL as string;

const useGetDelivery = () => {
  const auth = getAuth();

  const getDelivery = async (): Promise<Delivery[]> => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const token = await user.getIdToken();

    const response = await fetch(`${API_BASE_URL}/api/delivery`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to get delivery");

    return response.json();
  };

  const {
    data: delivery = [], // default empty array
    isPending,
    isSuccess,
    isError,
  } = useQuery<Delivery[]>({
    queryKey: ["fetchDelivery"],
    queryFn: getDelivery,
    enabled: !!auth.currentUser,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: false,
    meta: {
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: "✅ Success",
          text2: "Deliveries loaded successfully",
        });
      },
      onError: () => {
        Toast.show({
          type: "error",
          text1: "❌ Error",
          text2: "Unable to fetch deliveries!",
        });
      },
    },
  });

  const isLoading = isPending;

  return { delivery, isLoading, isSuccess, isError };
};

export default { useGetDelivery };
