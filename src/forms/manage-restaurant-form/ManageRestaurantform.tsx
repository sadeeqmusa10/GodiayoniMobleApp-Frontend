import React, { useEffect } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import DetailSection from "./DetialSection";
import CuisinesSection from "./CuisinesSection";
import ImageSection from "./ImageSection";
import MenuSection from "./Menusection";

import { Restaurant } from "@/types";
import LoadingButton from "../../components/LoadingButton";

// --------------------
// Form Schema
// --------------------
const formSchema = z
  .object({
    restaurantName: z.string({ message: "Restaurant name is required" }),
    city: z.string({ message: "City name is required" }),
    country: z.string({ message: "Country name is required" }),
    deliveryPrice: z.coerce.number({ message: "Delivery price is required" }),
    estimatedDeliveryTime: z.coerce.number({
      message: "Estimated delivery time is required",
    }),
    cuisines: z.array(z.string()).nonempty({
      message: "Please select at least one cuisine",
    }),
    menuItem: z.array(
      z.object({
        name: z.string().min(1, "Name is required"),
        price: z.coerce.number().min(1, "Price is required"),
      })
    ),
    imageUrl: z.string().optional(),
    imageFile: z
      .object({
        uri: z.string(),
        type: z.string().optional(),
        name: z.string().optional(),
      })
      .optional(),
  })
  .refine((data) => data.imageUrl || data.imageFile, {
    message: "Image file or URL must be provided",
    path: ["imageFile"],
  });

export type RestaurantFormData = z.infer<typeof formSchema>;

type Props = {
  restaurant?: Restaurant;
  onSave: (restaurantFormData: FormData) => void;
  isLoading: boolean;
  mode: "create" | "edit";
};

const ManageRestaurantForm = ({  restaurant, onSave, isLoading, mode }: Props) => {
  // --------------------
  // Initialize RHF
  // --------------------
  const form = useForm<RestaurantFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      restaurantName: "",
      city: "",
      country: "",
      deliveryPrice: 0,
      estimatedDeliveryTime: 0,
      cuisines: [],
      menuItem: [{ name: "", price: 0 }],
      imageUrl: undefined,
      imageFile: undefined,
    },
  });

  const { handleSubmit, reset } = form;

  // --------------------
  // Populate form from Firestore restaurant
  // --------------------
 useEffect(() => {
  if (mode === "create") {
    reset({
      restaurantName: "",
      city: "",
      country: "",
      deliveryPrice: 0,
      estimatedDeliveryTime: 0,
      cuisines: [],
      menuItem: [{ name: "", price: 0 }],
      imageUrl: undefined,
      imageFile: undefined,
    });
    return;
  }

  if (!restaurant) return;

  reset({
    restaurantName: restaurant.restaurantName,
    city: restaurant.city,
    country: restaurant.country,
    deliveryPrice: Number(restaurant.deliveryPrice),
    estimatedDeliveryTime: Number(restaurant.estimatedDeliveryTime),
    cuisines: restaurant.cuisines || [],
    menuItem:
      restaurant.menuItem?.map((item) => ({
        name: item.name,
        price: Number(item.price),
      })) || [{ name: "", price: 0 }],
    imageUrl: restaurant.imageUrl || undefined,
    imageFile: undefined,
  });
}, [restaurant, mode, reset]);

  // --------------------
  // Submit handler
  // --------------------
  const onSubmit = (data: RestaurantFormData) => {
    const formData = new FormData();

    formData.append("restaurantName", data.restaurantName);
    formData.append("city", data.city);
    formData.append("country", data.country);
    formData.append("deliveryPrice", data.deliveryPrice.toString());
    formData.append("estimatedDeliveryTime", data.estimatedDeliveryTime.toString());

    data.cuisines.forEach((cuisine, i) => formData.append(`cuisines[${i}]`, cuisine));

    data.menuItem.forEach((item, i) => {
      formData.append(`menuItem[${i}][name]`, item.name);
      formData.append(`menuItem[${i}][price]`, item.price.toString());
    });

    if (data.imageFile?.uri) {
      formData.append("imageFile", {
        uri: data.imageFile.uri,
        type: data.imageFile.type || "image/jpeg",
        name: data.imageFile.name || "restaurant.jpg",
      } as any);
    }

    onSave(formData);
  };

  return (
    <FormProvider {...form}>
      <ScrollView className="flex-1 bg-gray-50 p-4">
        <View className="space-y-8 bg-white p-4 rounded-lg">
          <DetailSection />
          <View className="h-px bg-gray-200 my-2" />
          <CuisinesSection />
          <View className="h-px bg-gray-200 my-2" />
          <ImageSection />
          <View className="h-px bg-gray-200 my-2" />
          <MenuSection />

          {isLoading ? (
            <LoadingButton />
          ) : (
            <Pressable
              onPress={handleSubmit(onSubmit)}
              className="bg-orange-500 p-3 rounded-md items-center mt-4"
            >
              <Text className="text-white font-semibold">Update</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </FormProvider>
  );
};

export default ManageRestaurantForm;
