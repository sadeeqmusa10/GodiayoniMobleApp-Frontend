import React, { useState } from "react";
import { View, Text, TextInput, Image, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";

const deliverySchema = z.object({
  senderName: z.string().min(3, "Sender name is required"),
  senderPhone: z.string().min(11, "Sender phone is required"),
  receiverName: z.string().min(3, "Receiver name is required"),
  receiverPhone: z.string().min(11, "Receiver phone is required"),
  pickupAddress: z.string().min(3, "Pickup address is required"),
  dropoffAddress: z.string().min(3, "Dropoff address is required"),
  packageDescription: z.string().min(3, "Description required"),
  weight: z.string(),
  value: z.string(),
  image: z
    .object({
      uri: z.string(),
      name: z.string(),
      type: z.string(),
    })
    .optional(),
});

type DeliveryFormData = z.infer<typeof deliverySchema>;

export default function DeliveryForm({
  onSave,
}: {
  onSave: (data: FormData) => void;
}) {
  const [image, setImage] = useState<any>(null);

  const { control, handleSubmit } = useForm<DeliveryFormData>({
    resolver: zodResolver(deliverySchema),
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const imageFile = {
        uri: asset.uri,
        name: asset.fileName || "image.jpg",
        type: asset.mimeType || "image/jpeg",
      };
      setImage(imageFile);
    }
  };

  const onSubmit = (data: DeliveryFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === "object" && value !== null && "uri" in value) {
        formData.append("image", value as any);
      } else {
        formData.append(key, value as string);
      }
    });
    if (image) formData.append("image", image);
    onSave(formData);
  };

  return (
    <View className="p-4">
      <Text className="text-xl font-bold mb-4">Delivery Form</Text>

      <Controller
        control={control}
        name="senderName"
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Sender Name"
            className="border p-3 mb-2 rounded"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="senderPhone"
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Sender Phone"
            keyboardType="phone-pad"
            className="border p-3 mb-2 rounded"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      {/* Example image picker */}
      <TouchableOpacity
        onPress={pickImage}
        className="bg-orange-500 p-3 rounded-md mt-4"
      >
        <Text className="text-white text-center">Pick Image</Text>
      </TouchableOpacity>

      {image && (
        <Image
          source={{ uri: image.uri }}
          className="w-full h-48 mt-3 rounded-md"
        />
      )}

      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        className="bg-blue-600 p-4 rounded-md mt-5"
      >
        <Text className="text-white text-center font-semibold">Submit</Text>
      </TouchableOpacity>
    </View>
  );
}
