import React, { useState, useMemo } from "react";
import { View, Text, Image } from "react-native";
import { Delivery } from "../types";

type Props = {
  delivery: Delivery;
};

const DeliveryInfo = ({ delivery }: Props) => {
  const [imageError, setImageError] = useState(false);

  /**
   * Optimize Cloudinary image automatically
   * - f_auto → best format (webp)
   * - q_auto → automatic compression
   * - w_800  → limit width for faster load
   */
  const optimizedImageUrl = useMemo(() => {
    if (!delivery?.imageUrl) return null;

    if (delivery.imageUrl.includes("res.cloudinary.com")) {
      return delivery.imageUrl.replace(
        "/upload/",
        "/upload/f_auto,q_auto,w_800/"
      );
    }

    return delivery.imageUrl;
  }, [delivery?.imageUrl]);

  return (
    <View className="w-full bg-white rounded-2xl p-4 space-y-4">
      {/* Image */}
      <View className="w-full aspect-[16/5] rounded-lg overflow-hidden border">
        {optimizedImageUrl && !imageError ? (
          <Image
            source={{ uri: optimizedImageUrl }}
            className="w-full h-52"
            resizeMode="cover"
            onError={() => {
              console.warn("Image failed to load");
              setImageError(true); // 🔥 Prevent infinite retry
            }}
          />
        ) : (
          <View className="w-full h-52 bg-gray-200 justify-center items-center">
            <Text className="text-gray-400">Image unavailable</Text>
          </View>
        )}
      </View>

      {/* Sender & Receiver */}
      <View className="flex flex-col md:flex-row gap-4">
        {/* Sender */}
        <View className="flex-1 bg-gray-50 p-4">
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            Sender
          </Text>
          <Text className="text-gray-700">
            {delivery?.sender?.name || "N/A"}
          </Text>
          <Text className="text-gray-600">
            {delivery?.sender?.phone || "N/A"}
          </Text>
          <Text className="text-gray-600">
            {delivery?.sender?.address?.text || "N/A"}
          </Text>
        </View>

        {/* Receiver */}
        <View className="flex-1 bg-gray-50 p-4">
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            Receiver
          </Text>
          <Text className="text-gray-700">
            {delivery?.receiver?.name || "N/A"}
          </Text>
          <Text className="text-gray-600">
            {delivery?.receiver?.phone || "N/A"}
          </Text>
          <Text className="text-gray-600">
            {delivery?.receiver?.address?.text || "N/A"}
          </Text>
        </View>
      </View>

      {/* Package Info */}
      <View className="bg-gray-50 p-4">
        <Text className="text-lg font-semibold text-gray-800 mb-2">
          Package Details
        </Text>
        <Text className="text-gray-700">
          <Text className="font-medium">Description:</Text>{" "}
          {delivery?.package?.description || "N/A"}
        </Text>
        <Text className="text-gray-700">
          <Text className="font-medium">Weight:</Text>{" "}
          {delivery?.package?.weight ?? "N/A"} kg
        </Text>
        <Text className="text-gray-700">
          <Text className="font-medium">Value:</Text> ₦
          {delivery?.package?.value ?? "N/A"}
        </Text>
      </View>

      {/* Delivery Info */}
      <View className="bg-gray-50 p-4 flex-row flex-wrap justify-between">
        <View className="w-1/2 md:w-1/4 mb-2">
          <Text className="text-sm text-gray-500">Type</Text>
          <Text className="font-semibold">
            {delivery?.deliveryType || "N/A"}
          </Text>
        </View>

        <View className="w-1/2 md:w-1/4 mb-2">
          <Text className="text-sm text-gray-500">Status</Text>
          <Text className="font-semibold">
            {delivery?.status || "N/A"}
          </Text>
        </View>

        <View className="w-1/2 md:w-1/4 mb-2">
          <Text className="text-sm text-gray-500">Price</Text>
          <Text className="font-semibold">
            ₦{delivery?.price ?? "N/A"}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default DeliveryInfo;
