import React, { useState, useMemo } from "react";
import { View, Text, ScrollView } from "react-native";
import SearchBar, { SearchForm } from "../components/SearchBar";
import ManageRestaurantForm from "../forms/manage-restaurant-form/ManageRestaurantform";
import {
  useUpdateAdminRestaurant,
  useGetAllAdminRestaurants,
} from "../Api/AdminApi";
import { Restaurant } from "../types";

const ManageRestaurantScreen: React.FC = () => {
  const { data: restaurants = [], isLoading } = useGetAllAdminRestaurants();
  const { mutateAsync: updateAdminRestaurant, isPending } =
    useUpdateAdminRestaurant();

  const [searchQuery, setSearchQuery] = useState("");

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((r: Restaurant) =>
      r.restaurantNameLower.includes(searchQuery.toLowerCase())
    );
  }, [restaurants, searchQuery]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      stickyHeaderIndices={[0]}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      {/* Sticky Header */}
      <View className="bg-white px-4 pt-4 pb-4 border-b border-gray-200">
        <SearchBar
          searchQuery={searchQuery}
          placeholder="Search restaurant name"
          onSubmit={(data: SearchForm) =>
            setSearchQuery(data.searchQuery)
          }
          onReset={() => setSearchQuery("")}
        />
      </View>

      {/* Restaurant Update Forms */}
      <View className="px-4 mt-4 space-y-6">
        {filteredRestaurants.map((restaurant: Restaurant) => (
  <ManageRestaurantForm
    key={restaurant.restaurantId}
    mode="edit"
    restaurant={restaurant}
    onSave={(formData) =>
      updateAdminRestaurant({
        restaurantId: restaurant.restaurantId,
        data: formData,
      })
    }
    isLoading={isPending}
  />
))}

      </View>
    </ScrollView>
  );
};

export default ManageRestaurantScreen;
