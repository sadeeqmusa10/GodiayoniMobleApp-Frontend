import React, { useEffect } from "react";
import { View, Text, ScrollView, Pressable, Platform } from "react-native";
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
    restaurantName: z.string().min(1, "Restaurant name is required"),
    city: z.string().min(1, "City name is required"),
    country: z.string().min(1, "Country name is required"),

    address: z.object({
      text: z.string().min(1, "Address is required"),
      lat: z.number(),
      lng: z.number(),
    }),

    deliveryPrice: z.coerce.number().min(0, "Delivery price is required"),
    estimatedDeliveryTime: z.coerce
      .number()
      .min(0, "Estimated delivery time is required"),

    cuisines: z
      .array(z.string())
      .nonempty("Please select at least one cuisine"),

    menuItem: z.array(
      z.object({
        id: z.string().optional(),
        name: z.string().min(1, "Name is required"),
        price: z.coerce.number().min(1, "Price is required"),
        imageUrl: z.string().optional(),
        imageFile: z
          .object({
            uri: z.string(),
            type: z.string().optional(),
            name: z.string().optional(),
          })
          .optional(),
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
    message: "Restaurant image is required",
    path: ["imageFile"],
  });

export type RestaurantFormData = z.infer<typeof formSchema>;

type Props = {
  restaurant?: Restaurant;
  onSave: (restaurantFormData: FormData) => void;
  isLoading: boolean;
  mode: "create" | "edit";
};

const ManageRestaurantForm = ({
  restaurant,
  onSave,
  isLoading,
  mode,
}: Props) => {
  // --------------------
  // Initialize Form
  // --------------------
  const form = useForm<RestaurantFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      restaurantName: "",
      city: "",
      country: "",
      address: {
        text: "",
        lat: 0,
        lng: 0,
      },
      deliveryPrice: 0,
      estimatedDeliveryTime: 0,
      cuisines: [],
      menuItem: [
        {
          id:"",
          name: "",
          price: 0,
          imageUrl: "",
          imageFile: undefined,
        },
      ],
      imageUrl: "",
      imageFile: undefined,
    },
  });

  const { handleSubmit, reset } = form;

  // --------------------
  // Populate form safely (NO CRASH VERSION)
  // --------------------
  useEffect(() => {
    if (mode === "create") {
      reset({
        restaurantName: "",
        city: "",
        country: "",
        address: {
          text: "",
          lat: 0,
          lng: 0,
        },
        deliveryPrice: 0,
        estimatedDeliveryTime: 0,
        cuisines: [],
        menuItem: [
          {
            id:"",
            name: "",
            price: 0,
            imageUrl: "",
            imageFile: undefined,
          },
        ],
        imageUrl: "",
        imageFile: undefined,
      });
      return;
    }

    if (!restaurant) return;

    reset({
      restaurantName: restaurant.restaurantName ?? "",
      city: restaurant.city ?? "",
      country: restaurant.country ?? "",

      address: restaurant.address ?? {
        text: "",
        lat: 0,
        lng: 0,
      },

      deliveryPrice: Number(restaurant.deliveryPrice ?? 0),
      estimatedDeliveryTime: Number(
        restaurant.estimatedDeliveryTime ?? 0
      ),

      cuisines: restaurant.cuisines ?? [],

      menuItem:
        restaurant.menuItem?.map((item) => ({
          id: item.id ?? "",
          name: item.name ?? "",
          price: Number(item.price ?? 0),
          imageUrl: item.imageUrl ?? "",
          imageFile: undefined,
        })) ?? [
          {
            id: "",
            name: "",
            price: 0,
            imageUrl: "",
            imageFile: undefined,
          },
        ],

      imageUrl: restaurant.imageUrl ?? "",
      imageFile: undefined,
    });
  }, [restaurant, mode, reset]);

  // --------------------
  // Submit
  // --------------------
const onSubmit = async (data: RestaurantFormData) => {
  const formData = new FormData();

  formData.append("restaurantName", data.restaurantName);
  formData.append("city", data.city);
  formData.append("country", data.country);
  formData.append("deliveryPrice", data.deliveryPrice.toString());
  formData.append("estimatedDeliveryTime", data.estimatedDeliveryTime.toString());
  formData.append("restaurantAddress", JSON.stringify(data.address));
  formData.append("cuisines", JSON.stringify(data.cuisines));

  const cleanMenu = data.menuItem.map(item => ({
    id: item.id,
    name: item.name,
    price: item.price,
    imageUrl: item.imageUrl || "",
  }));

  formData.append("menuItem", JSON.stringify(cleanMenu));

  // ✅ HANDLE IMAGES PROPERLY
  const imagePromises: Promise<void>[] = [];

  // MENU IMAGES
  data.menuItem.forEach((item, i) => {
    if (!item.imageFile?.uri) return;

    if (Platform.OS === "web") {
      const p = fetch(item.imageFile.uri)
        .then(res => res.blob())
        .then(blob => {
          formData.append(`menuImage_${i}`, blob, `menu-${i}.jpg`);
        });
      imagePromises.push(p);
    } else {
      formData.append(`menuImage_${i}`, {
        uri: item.imageFile.uri,
        type: item.imageFile.type || "image/jpeg",
        name: item.imageFile.name || `menu-${i}.jpg`,
      } as any);
    }
  });

  // RESTAURANT IMAGE
  if (data.imageFile?.uri) {
    if (Platform.OS === "web") {
      const p = fetch(data.imageFile.uri)
        .then(res => res.blob())
        .then(blob => {
          formData.append("imageFile", blob, "restaurant.jpg");
        });
      imagePromises.push(p);
    } else {
      formData.append("imageFile", {
        uri: data.imageFile.uri,
        type: data.imageFile.type || "image/jpeg",
        name: data.imageFile.name || "restaurant.jpg",
      } as any);
    }
  }

  // ✅ WAIT FOR ALL BLOBS (THIS IS THE FIX)
  await Promise.all(imagePromises);

  console.log("FINAL FORM DATA READY");

  onSave(formData);
};
  // --------------------
  // UI
  // --------------------
  return (
    <FormProvider {...form}>
      <ScrollView className="flex-1 bg-gray-50 p-4">
        <View className="space-y-8 bg-white p-4 rounded-lg">
          <Text className="text-2xl font-bold text-center">{restaurant?.restaurantName}</Text>

          <ImageSection />
          <View className="h-px bg-gray-200 my-2" />
          <DetailSection />
          <View className="h-px bg-gray-200 my-2" />
          <CuisinesSection />
          <View className="h-px bg-gray-200 my-2" />
          <MenuSection />

          {isLoading ? (
            <LoadingButton />
          ) : (
            <Pressable
              onPress={handleSubmit(onSubmit)}
              className="bg-orange-500 p-3 rounded-md items-center mt-4"
            >
              <Text className="text-white font-semibold">
                {mode === "create"
                  ? "Create Restaurant"
                  : "Update Restaurant"}
              </Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </FormProvider>
  );
};

export default ManageRestaurantForm;
