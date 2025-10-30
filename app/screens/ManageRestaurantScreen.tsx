import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import {
  useCreateAdminRestaurant,
  useGetAdminRestaurant,
  useGetAllRestaurantsWithOrders,
  useUpdateAdminRestaurant,
} from "../Api/AdminApi";
import OrderItemCard from "@/components/OrderItemCard";
import ManageRestaurantForm from "../forms/manage-restaurant-form/ManageRestaurantform";
import { Restaurant, Order } from "../types";

const ManageRestaurantScreen = () => {
  const { data: restaurants = [], isLoading: isRestaurantsLoading } =
    useGetAllRestaurantsWithOrders();
  const { isLoading: isAdminRestaurantLoading } = useGetAdminRestaurant();
  const { mutateAsync: createAdminRestaurant, isPending: isCreateLoading } =
    useCreateAdminRestaurant();

  const { mutateAsync: updateAdminRestaurant, isPending: isUpdateLoading } =
    useUpdateAdminRestaurant();

  const [activeTab, setActiveTab] = useState<"orders" | "manage-restaurant">(
    "orders"
  );

  if (isRestaurantsLoading || isAdminRestaurantLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  const orders: Order[] = restaurants.flatMap((r) => r.orders);

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      {/* Tabs Header */}
      <View className="flex-row justify-center mb-4">
        <TouchableOpacity
          onPress={() => setActiveTab("orders")}
          className={`px-4 py-2 mx-1 rounded-lg ${
            activeTab === "orders" ? "bg-blue-500" : "bg-gray-200"
          }`}
        >
          <Text
            className={`text-center ${
              activeTab === "orders" ? "text-white" : "text-black"
            }`}
          >
            Orders
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab("manage-restaurant")}
          className={`px-4 py-2 mx-1 rounded-lg ${
            activeTab === "manage-restaurant" ? "bg-blue-500" : "bg-gray-200"
          }`}
        >
          <Text
            className={`text-center ${
              activeTab === "manage-restaurant" ? "text-white" : "text-black"
            }`}
          >
            Manage Restaurant
          </Text>
        </TouchableOpacity>
      </View>

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <View className="space-y-3">
          <Text className="text-2xl font-bold mb-4 text-center">
            {orders.length} Active Orders
          </Text>
          {orders.map((order) => (
            <OrderItemCard key={order.firebaseId} order={order} />
          ))}
        </View>
      )}

      {/* Manage Restaurant Tab */}
      {activeTab === "manage-restaurant" && (
        <View className="space-y-6">
          {restaurants.map((restaurant: Restaurant) => (
            <ManageRestaurantForm
              key={restaurant.restaurantId}
              restaurant={restaurant}
              onSave={(formData) =>
                updateAdminRestaurant({
                  restaurantId: restaurant.restaurantId,
                  data: formData,
                })
              }
              isLoading={isUpdateLoading}
            />
          ))}

          {/* Create new restaurant */}
          <ManageRestaurantForm
            restaurant={undefined}
            onSave={(formData) => createAdminRestaurant(formData)}
            isLoading={isCreateLoading}
          />
        </View>
      )}
    </ScrollView>
  );
};

export default ManageRestaurantScreen;
