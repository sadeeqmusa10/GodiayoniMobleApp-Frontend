import React, { useState } from "react";
import {
  Text,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  ScrollView,
  View,
  Platform,
} from "react-native";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import * as ImagePicker from "expo-image-picker";
import RNPickerSelect from "react-native-picker-select";
import AddressInput from "@/components/GoogleAddressInput";

/* ===================== SCHEMA ===================== */

const addressSchema = z
  .object({
    text: z.string().min(5, "Please select an address"),
    lat: z.number(),
    lng: z.number(),
  })
  .refine((v) => !Number.isNaN(v.lat) && !Number.isNaN(v.lng), {
    message: "Please select an address from the list",
    path: ["text"],
  });

const personSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(7, "Phone number is required"),
  address: addressSchema,
});

const formSchema = z.object({
  sender: personSchema,
  receiver: personSchema,
  package: z.object({
    description: z.string().min(2, "Description required"),
    weight: z.number().positive("Weight required"),
    value: z.number().positive("Value required"),
  }),
  deliveryType: z.enum(["standard", "express", "same-day"]),
  imageFile: z
    .object({
      uri: z.string(),
      name: z.string(),
      type: z.string(),
    })
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  onSave: (formData: FormData) => Promise<void>;
  isLoading: boolean;
};

export default function DooToDoorForm({ onSave, isLoading }: Props) {
  const [previewImage, setPreviewImage] =
    useState<FormValues["imageFile"] | null>(null);

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sender: {
        name: "",
        phone: "",
        address: { text: "", lat: 0, lng: 0 },
      },
      receiver: {
        name: "",
        phone: "",
        address: { text: "", lat: 0, lng: 0 },
      },
      package: {
        description: "",
        weight: 1,
        value: 1,
      },
      deliveryType: "standard",
    },
  });

  /* ===================== IMAGE ===================== */

  const pickImage = async () => {
    if (Platform.OS !== "web") {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (result.canceled) return;

    const asset = result.assets[0];

    const image = {
      uri: asset.uri,
      name: asset.fileName ?? `package-${Date.now()}.jpg`,
      type: asset.mimeType ?? "image/jpeg",
    };

    setPreviewImage(image);
    setValue("imageFile", image, { shouldValidate: true });
  };

  /* ===================== SUBMIT ===================== */

  const onSubmit = async (data: FormValues) => {
    try {
      const formData = new FormData();

      formData.append(
        "data",
        JSON.stringify({
          sender: data.sender,
          receiver: data.receiver,
          package: data.package,
          deliveryType: data.deliveryType,
        })
      );

      if (data.imageFile) {
        if (Platform.OS === "web") {
          const blob = await (await fetch(data.imageFile.uri)).blob();
          formData.append(
            "image",
            new File([blob], data.imageFile.name, {
              type: data.imageFile.type,
            })
          );
        } else {
          formData.append("image", data.imageFile as any);
        }
      }

      await onSave(formData);
    } catch {
      Alert.alert("Error", "Failed to create delivery");
    }
  };

  const ErrorText = ({ msg }: { msg?: string }) =>
    msg ? <Text className="text-red-500 mb-2">{msg}</Text> : null;

  /* ===================== UI ===================== */

  return (
    <ScrollView className="flex-1 bg-gray-100 p-5">
      {/* ---------- SENDER ---------- */}
      <Text className="text-lg font-bold mb-2">House Hold Sender</Text>

      <Controller
        control={control}
        name="sender.name"
        render={({ field }) => (
          <TextInput
            placeholder="sending house holder name"
            value={field.value}
            onChangeText={field.onChange}
            className="border rounded-lg px-3 py-3 mb-2 bg-white"
          />
        )}
      />
      <ErrorText msg={errors.sender?.name?.message} />

      <Controller
        control={control}
        name="sender.phone"
        render={({ field }) => (
          <TextInput
            placeholder="house hold Phone number"
            keyboardType="phone-pad"
            value={field.value}
            onChangeText={field.onChange}
            className="border rounded-lg px-3 py-3 mb-2 bg-white"
          />
        )}
      />
      <ErrorText msg={errors.sender?.phone?.message} />

      <Controller
        control={control}
        name="sender.address"
        render={({ field }) => (
          <>
            <AddressInput
              placeholder="packeage holder addres"
              value={field.value.text}
              onChangeText={(text) =>
                field.onChange({ text, lat: 0, lng: 0 })
              }
              onSelect={(addr) => field.onChange(addr)}
            />
            <ErrorText msg={errors.sender?.address?.text?.message} />
          </>
        )}
      />

      {/* ---------- RECEIVER ---------- */}
      <Text className="text-lg font-bold mt-6 mb-2">House Hold Receiver</Text>

      <Controller
        control={control}
        name="receiver.name"
        render={({ field }) => (
          <TextInput
            placeholder="recieveing house holder name"
            value={field.value}
            onChangeText={field.onChange}
            className="border rounded-lg px-3 py-3 mb-2 bg-white"
          />
        )}
      />
      <ErrorText msg={errors.receiver?.name?.message} />

      <Controller
        control={control}
        name="receiver.phone"
        render={({ field }) => (
          <TextInput
            placeholder="house hold reciever Phone number"
            keyboardType="phone-pad"
            value={field.value}
            onChangeText={field.onChange}
            className="border rounded-lg px-3 py-3 mb-2 bg-white"
          />
        )}
      />
      <ErrorText msg={errors.receiver?.phone?.message} />

      <Controller
        control={control}
        name="receiver.address"
        render={({ field }) => (
          <>
            <AddressInput
              placeholder="packeage reciver address"
              value={field.value.text}
              onChangeText={(text) =>
                field.onChange({ text, lat: 0, lng: 0 })
              }
              onSelect={(addr) => field.onChange(addr)}
            />
            <ErrorText msg={errors.receiver?.address?.text?.message} />
          </>
        )}
      />

      {/* ---------- PACKAGE ---------- */}
      <Text className="text-lg font-bold mt-6 mb-2">Package</Text>

      <Controller
        control={control}
        name="package.description"
        render={({ field }) => (
          <TextInput
            placeholder="Description"
            value={field.value}
            onChangeText={field.onChange}
            className="border rounded-lg px-3 py-3 mb-2 bg-white"
          />
        )}
      />
      <ErrorText msg={errors.package?.description?.message} />

      <Controller
        control={control}
        name="package.weight"
        render={({ field }) => (
          <TextInput
            placeholder="Weight (kg)"
            keyboardType="numeric"
            value={String(field.value)}
            onChangeText={(v) => field.onChange(Number(v))}
            className="border rounded-lg px-3 py-3 mb-2 bg-white"
          />
        )}
      />
      <ErrorText msg={errors.package?.weight?.message} />

      <Controller
        control={control}
        name="package.value"
        render={({ field }) => (
          <TextInput
            placeholder="Value (₦)"
            keyboardType="numeric"
            value={String(field.value)}
            onChangeText={(v) => field.onChange(Number(v))}
            className="border rounded-lg px-3 py-3 mb-3 bg-white"
          />
        )}
      />
      <ErrorText msg={errors.package?.value?.message} />

      {/* ---------- DELIVERY TYPE ---------- */}
       <Controller
          control={control}
          name="deliveryType"
          render={({ field: { onChange, value }, fieldState }) => (
            <View className="mb-4">
              <Text className="font-bold text-lg mb-1">
                Delivery Type
              </Text>

              <View className="border rounded-xl px-3 py-4">
                <RNPickerSelect
                  value={value}
                  onValueChange={onChange}
                  placeholder={{
                    label: "Select delivery type",
                    value: null,
                  }}
                  items={[
                    { label: "Standard", value: "standard" },
                    { label: "Express", value: "express" },
                    { label: "Same Day", value: "same-day" },
                  ]}
                />
              </View>

              {fieldState.error && (
                <Text className="text-red-500 text-sm mt-1">
                  {fieldState.error.message}
                </Text>
              )}
            </View>
          )}
        />

      {previewImage && (
        <Image
          source={{ uri: previewImage.uri }}
          className="h-40 rounded-xl mb-3"
        />
      )}

      <TouchableOpacity
        onPress={pickImage}
        className="bg-orange-500 py-3 rounded-lg mb-6"
      >
        <Text className="text-white text-center font-semibold">
          Upload Package Image
        </Text>
      </TouchableOpacity>

      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          className="bg-green-600 py-4 rounded-xl mb-10"
        >
          <Text className="text-white text-center font-bold text-lg">
            Create Delivery
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}
