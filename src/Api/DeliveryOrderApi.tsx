// Api/DeliveryOrderApi.ts
import { Delivery } from "@/types";
import { getAuth } from "firebase/auth";
import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/config/apibase";

export const useGetMyDeliveries = () => {
  const auth = getAuth();

  const getDeliveries = async (): Promise<Delivery[]> => {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error("User not authenticated");

    const res = await fetch(`${API_BASE_URL}/api/delivery`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch deliveries");

    const json = await res.json();
    return json.data; // ✅ ARRAY
  };

  return useQuery({
    queryKey: ["my-deliveries"],
    queryFn: getDeliveries,
  });
};
