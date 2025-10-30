import { useQuery } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import Constants from "expo-constants";
import { Restaurant, RestaurantSearchResponse } from "../types";
import { SearchState } from "../screens/SearchScreen";

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

const useGetRestaurant = (firebaseId: string) => {
  const getRestaurantByIdRequest = async (): Promise<Restaurant> => {
    const response = await fetch(
      `${API_BASE_URL}/api/restaurant/${firebaseId}`
    );
    if (!response.ok) throw new Error("Failed to get restaurant");
    return response.json();
  };

  // ✅ Proper v5 syntax
  const query = useQuery<Restaurant, Error>({
    queryKey: ["fetchRestaurant", firebaseId],
    queryFn: getRestaurantByIdRequest,
    enabled: !!firebaseId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // ✅ Optional toast handling
  if (query.isError) {
    Toast.show({
      type: "error",
      text1: query.error?.message || "Failed to load restaurant",
    });
  }

  if (query.isSuccess) {
    Toast.show({
      type: "success",
      text1: "Restaurant loaded successfully",
    });
  }

  return {
    restaurant: query.data,
    isLoading: query.isLoading,
  };
};

const useSearchRestaurant = (searchState: SearchState, city?: string) => {
  const fetchRestaurants = async (): Promise<RestaurantSearchResponse> => {
    if (!city) throw new Error("City is required for search");

    const params = new URLSearchParams();

    if (searchState.searchQuery) {
      params.set("searchQuery", searchState.searchQuery.trim().toLowerCase());
    }

    params.set("page", searchState.page.toString());

    if (searchState.selectedCuisines.length) {
      params.set("selectedCuisines", searchState.selectedCuisines.join(","));
    }

    params.set("sortOption", searchState.sortOption);

    const response = await fetch(
      `${API_BASE_URL}/api/restaurant/search/${city.toLowerCase()}?${params.toString()}`
    );

    if (!response.ok) throw new Error("Failed to fetch restaurants");

    return response.json();
  };

  // ✅ React Query v5 syntax
  const query = useQuery({
    queryKey: ["searchRestaurants", city, searchState],
    queryFn: fetchRestaurants,
    enabled: !!city && searchState.page > 0,
    placeholderData: (prev) => prev, // replaces keepPreviousData
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // ✅ Manually handle toast based on query state
  if (query.isError) {
    const err = query.error as Error;
    Toast.show({
      type: "error",
      text1: err.message || "Failed to search restaurants",
    });
  }

  if (query.isSuccess) {
    Toast.show({
      type: "success",
      text1: "Search results updated",
    });
  }

  return {
    results: query.data ?? {
      data: [],
      pagination: { total: 0, page: 1, pages: 1 },
    },
    isLoading: query.isLoading,
    isError: query.isError,
  };
};

export default { useGetRestaurant, useSearchRestaurant };
