import React, { useState } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, Alert, Platform } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import FormSection from "../../components/ui/FormSection";
import MapPicker from "../../components/MapPicker";


/* ===================== SCHEMA ===================== */
const deliverySchema = z.object({
  email: z.string().email("Valid email is required"),

  sender: z.object({
    name: z.string().min(3, "Sender name is required"),
    phone: z.string().min(11, "Sender phone is required"),
  }),

  receiver: z.object({
    name: z.string().min(3, "Receiver name is required"),
    phone: z.string().min(11, "Receiver phone is required"),
  }),

  package: z.object({
    description: z.string().min(3, "Package description is required"),
    weight: z.coerce.number().min(1, "Weight is required"),
    value: z.coerce.number().min(1, "Value is required"),
  }),

  deliveryType: z.enum(["standard", "express", "same-day"]),
  pickupAddress: z.string().optional(),
  dropoffAddress: z.string().optional(),

  imageFile: z.object({
    uri: z.string(),
    name: z.string(),
    type: z.string(),
  }),
});

type DeliveryFormData = z.infer<typeof deliverySchema>;

/* ===================== COMPONENT ===================== */
export default function DeliveryForm({
  onSave,
  isLoading,
  userEmail,
}: {
  onSave: (data: FormData) => void;
  isLoading: boolean;
  userEmail: string;
}) {
  const [previewImage, setPreviewImage] = useState<any>(null);
  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [dropoffCoords, setDropoffCoords] = useState<{ lat: number; lng: number } | null>(null);

  const { control, handleSubmit, setValue } = useForm<DeliveryFormData>({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      deliveryType: "standard",
      email: userEmail,
    },
  });

  /* ===================== IMAGE PICKER ===================== */
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];

      const imageObj = {
        uri: asset.uri,
        name: asset.fileName ?? "delivery.jpg",
        type: asset.mimeType ?? "image/jpeg",
      };

      setPreviewImage(imageObj);
      setValue("imageFile", imageObj, { shouldValidate: true });
    }
  };

  /* ===================== SUBMIT ===================== */
  const onSubmit = async (data: DeliveryFormData) => {
    if (!pickupCoords || !dropoffCoords) {
      Alert.alert("Error", "Please select pickup and dropoff locations on the map");
      return;
    }

    const formData = new FormData();

    formData.append("email", data.email);

    // Sender
    formData.append("sender.name", data.sender.name);
    formData.append("sender.phone", data.sender.phone);
    formData.append("sender.pickupAddress", data.pickupAddress ?? "");
    formData.append("sender.pickupLocation.lat", pickupCoords.lat.toString());
    formData.append("sender.pickupLocation.lng", pickupCoords.lng.toString());

    // Receiver
    formData.append("receiver.name", data.receiver.name);
    formData.append("receiver.phone", data.receiver.phone);
    formData.append("receiver.dropoffAddress", data.dropoffAddress ?? "");
    formData.append("receiver.dropoffLocation.lat", dropoffCoords.lat.toString());
    formData.append("receiver.dropoffLocation.lng", dropoffCoords.lng.toString());

    // Package & delivery
    formData.append("package.description", data.package.description);
    formData.append("package.weight", String(data.package.weight));
    formData.append("package.value", String(data.package.value));
    formData.append("deliveryType", data.deliveryType);

    // Image
    if (Platform.OS === "web") {
      const response = await fetch(data.imageFile.uri);
      const blob = await response.blob();
      const file = new File([blob], data.imageFile.name, { type: data.imageFile.type });
      formData.append("image", file);
    } else {
      formData.append("image", {
        uri: data.imageFile.uri,
        name: data.imageFile.name,
        type: data.imageFile.type,
      } as any);
    }

    onSave(formData);
  };

  /* ===================== UI ===================== */
  return (
    <View className="p-4 gap-6 bg-gray-100">
      {/* ---------- Sender ---------- */}
      <FormSection title="Sender">
        <Controller
          control={control}
          name="sender.name"
          render={({ field }) => (
            <TextInput {...field} placeholder="Sender Name" className="border p-3 rounded-xl bg-white" />
          )}
        />
        <Controller
          control={control}
          name="sender.phone"
          render={({ field }) => (
            <TextInput {...field} placeholder="Sender Phone" keyboardType="phone-pad" className="border p-3 rounded-xl bg-white" />
          )}
        />

        {/* Pickup Map */}
        <MapPicker
          label="Select Pickup Location"
          initialRegion={{
            latitude: 12.0022,
            longitude: 8.5919,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          onLocationSelected={setPickupCoords}
        />
        <Controller
          control={control}
          name="pickupAddress"
          render={({ field }) => (
            <TextInput {...field} placeholder="Optional address text" className="border p-3 rounded-xl bg-white mt-2" />
          )}
        />
      </FormSection>

      {/* ---------- Receiver ---------- */}
      <FormSection title="Receiver">
        <Controller
          control={control}
          name="receiver.name"
          render={({ field }) => (
            <TextInput {...field} placeholder="Receiver Name" className="border p-3 rounded-xl bg-white" />
          )}
        />
        <Controller
          control={control}
          name="receiver.phone"
          render={({ field }) => (
            <TextInput {...field} placeholder="Receiver Phone" keyboardType="phone-pad" className="border p-3 rounded-xl bg-white" />
          )}
        />

        {/* Dropoff Map */}
        <MapPicker
          label="Select Dropoff Location"
          initialRegion={{
            latitude: 12.0022,
            longitude: 8.5919,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          onLocationSelected={setDropoffCoords}
        />
        <Controller
          control={control}
          name="dropoffAddress"
          render={({ field }) => (
            <TextInput {...field} placeholder="Optional address text" className="border p-3 rounded-xl bg-white mt-2" />
          )}
        />
      </FormSection>

      {/* ---------- Delivery Type ---------- */}
      <FormSection title="Delivery Type">
        <Controller
          control={control}
          name="deliveryType"
          render={({ field }) => (
            <View className="border rounded-xl bg-white">
              <Picker selectedValue={field.value} onValueChange={field.onChange}>
                <Picker.Item label="Standard" value="standard" />
                <Picker.Item label="Express" value="express" />
                <Picker.Item label="Same Day" value="same-day" />
              </Picker>
            </View>
          )}
        />
      </FormSection>

      {/* ---------- Package ---------- */}
      <FormSection title="Package">
        <Controller
          control={control}
          name="package.description"
          render={({ field }) => (
            <TextInput {...field} placeholder="Package Description" className="border p-3 rounded-xl bg-white" />
          )}
        />
        <Controller
          control={control}
          name="package.weight"
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Weight (kg)"
              keyboardType="numeric"
              className="border p-3 rounded-xl bg-white"
              value={value ? String(value) : ""}
              onChangeText={(t) => onChange(t.replace(/[^0-9]/g, ""))}
            />
          )}
        />
        <Controller
          control={control}
          name="package.value"
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Value (₦)"
              keyboardType="numeric"
              className="border p-3 rounded-xl bg-white"
              value={value ? String(value) : ""}
              onChangeText={(t) => onChange(t.replace(/[^0-9]/g, ""))}
            />
          )}
        />
      </FormSection>

      {/* ---------- Image ---------- */}
      <FormSection title="Package Image">
        {previewImage && <Image source={{ uri: previewImage.uri }} className="h-40 rounded-xl mb-3" />}
        <TouchableOpacity onPress={pickImage} className="bg-orange-500 py-3 rounded-xl">
          <Text className="text-white text-center font-semibold">
            {previewImage ? "Change Image" : "Select Image"}
          </Text>
        </TouchableOpacity>
      </FormSection>

      {/* ---------- Submit ---------- */}
      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}
        className={`py-4 rounded-xl ${isLoading ? "bg-gray-400" : "bg-blue-600"}`}
      >
        <Text className="text-white text-center font-bold text-lg">
          {isLoading ? "Submitting..." : "Create Delivery"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
