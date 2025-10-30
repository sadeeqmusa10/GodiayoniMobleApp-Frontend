import { View, Text, ScrollView, Pressable } from "react-native";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DetailSection from "./DetialSection";
import CuisinesSection from "./CuisinesSection";
import ImageSection from "./ImageSection";
import MenuSection from "./Menusection";

import { Restaurant } from "@/app/types";

// You can replace this with a spinner or custom button component later
import LoadingButton from "@/components/LoadingButton";

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

type RestaurantFormData = z.infer<typeof formSchema>;

type Props = {
  restaurant?: Restaurant;
  onSave: (restaurantFormData: FormData) => void;
  isLoading: boolean;
};

const ManageRestaurantForm = ({ onSave, isLoading, restaurant }: Props) => {
  const form = useForm<RestaurantFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cuisines: [],
      menuItem: [{ name: "", price: 0 }],
    },
  });

  const { handleSubmit, reset, getValues } = form;

  useEffect(() => {
    if (!restaurant) return;

    const deliveryPriceFormatted = Number(restaurant.deliveryPrice);
    const menuItemFormatted = (restaurant.menuItem || []).map((item) => ({
      ...item,
      price: Number(item.price),
    }));

    const updatedRestaurant = {
      ...restaurant,
      deliveryPrice: deliveryPriceFormatted,
      menuItem: menuItemFormatted,
    };

    reset(updatedRestaurant);
  }, [reset, restaurant]);

  const onSubmit = (formDataJson: RestaurantFormData) => {
    const formData = new FormData();

    formData.append("restaurantName", formDataJson.restaurantName);
    formData.append("city", formDataJson.city);
    formData.append("country", formDataJson.country);
    formData.append("deliveryPrice", formDataJson.deliveryPrice.toString());
    formData.append(
      "estimatedDeliveryTime",
      formDataJson.estimatedDeliveryTime.toString()
    );

    formDataJson.cuisines.forEach((cuisine, index) => {
      formData.append(`cuisines[${index}]`, cuisine);
    });

    formDataJson.menuItem.forEach((menuItem, index) => {
      formData.append(`menuItem[${index}][name]`, menuItem.name);
      formData.append(`menuItem[${index}][price]`, menuItem.price.toString());
    });

    // In React Native, imageFile is an object with a uri
    if (formDataJson.imageFile?.uri) {
      const image = {
        uri: formDataJson.imageFile.uri,
        type: "image/jpeg",
        name: "restaurant.jpg",
      } as any;
      formData.append("imageFile", image);
    }

    onSave(formData);
  };

  return (
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
  );
};

export default ManageRestaurantForm;
