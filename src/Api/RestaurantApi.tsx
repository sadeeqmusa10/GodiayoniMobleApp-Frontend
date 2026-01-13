import { useQuery } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import Constants from "expo-constants";
import { Restaurant, RestaurantSearchResponse } from "../types";
import { SearchState } from "../screens/SearchScreen";
import { useEffect } from "react";

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

/* =========================
   GET SINGLE RESTAURANT
========================= */
const useGetRestaurant = (firebaseId?: string) => {
  const query = useQuery<Restaurant, Error>({
    queryKey: ["restaurant", firebaseId],
    enabled: !!firebaseId,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    queryFn: async () => {
      const res = await fetch(
        `${API_BASE_URL}/api/restaurant/${firebaseId}`
      );

      if (!res.ok) {
        throw new Error("Failed to load restaurant");
      }

      const data: Restaurant = await res.json();
      console.log("Restaurant response:", data);

      return data;
    },
  });

  useEffect(() => {
    if (query.isError) {
      Toast.show({
        type: "error",
        text1: query.error?.message ?? "Failed to load restaurant",
      });
    }
  }, [query.isError]);

  return {
    restaurant: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
};

/* =========================
   SEARCH RESTAURANTS
========================= */
const useSearchRestaurant = (
  searchState: SearchState,
  city?: string
) => {
  const query = useQuery<RestaurantSearchResponse, Error>({
    queryKey: [
      "searchRestaurants",
      city,
      searchState.page,
      searchState.searchQuery,
      searchState.sortOption,
      searchState.selectedCuisines.join(","),
    ],
    enabled: !!city,
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      if (!city) {
        return {
          data: [],
          pagination: { total: 0, page: 1, pages: 1 },
        };
      }

      const params = new URLSearchParams();

      if (searchState.searchQuery) {
        params.set(
          "searchQuery",
          searchState.searchQuery.trim().toLowerCase()
        );
      }

      params.set("page", String(searchState.page));
      params.set("sortOption", searchState.sortOption);

      if (searchState.selectedCuisines.length) {
        params.set(
          "selectedCuisines",
          searchState.selectedCuisines.join(",")
        );
      }

      const url = `${API_BASE_URL}/api/restaurant/search/${city.toLowerCase()}?${params.toString()}`;
      console.log("Search URL:", url);

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error("Failed to fetch restaurants");
      }

      const data: RestaurantSearchResponse = await res.json();
      console.log("Search response:", data);

      return data;
    },
  });

  useEffect(() => {
    if (query.isError) {
      Toast.show({
        type: "error",
        text1: query.error?.message ?? "Search failed",
      });
    }
  }, [query.isError]);

  return {
    results:
      query.data ?? {
        data: [],
        pagination: { total: 0, page: 1, pages: 1 },
      },
    isLoading: query.isLoading,
    isError: query.isError,
  };
};

export { useGetRestaurant, useSearchRestaurant };
