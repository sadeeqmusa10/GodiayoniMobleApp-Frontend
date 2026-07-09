import React, { useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AddressInput from "@/components/GoogleAddressInput";
import RNPickerSelect from "react-native-picker-select";

/* =======================
   SCHEMA
======================= */

export const profileSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().min(10, "Invalid phone number"),

    orderType: z.enum(["delivery", "takeaway", "dining"], {
      required_error: "Order type is required",
    }),

    deliveryType: z
      .enum(["standard", "express", "same-day"])
      .optional(),

    addressLine1: z.object({
      text: z.string().min(5, "Please select an address"),
      lat: z.number(),
      lng: z.number(),
    }),

    city: z.string().min(2, "City is required"),
    country: z.string().min(2, "Country is required"),
  })
  .refine(
    (data) =>
      data.orderType !== "delivery" || !!data.deliveryType,
    {
      message: "Delivery type is required",
      path: ["deliveryType"],
    }
  );

export type OrderDetailsData = z.infer<typeof profileSchema>;

/* =======================
   FORM FIELD
======================= */

type FormFieldProps = {
  control: any;
  name: keyof OrderDetailsData;
  label: string;
  placeholder?: string;
  keyboardType?: "default" | "phone-pad";
};

const FormField = ({
  control,
  name,
  label,
  placeholder,
  keyboardType = "default",
}: FormFieldProps) => (
  <Controller
    control={control}
    name={name}
    render={({ field: { onChange, value }, fieldState: { error } }) => (
      <View className="mb-4">
        <Text className="text-gray-600 mb-1">
          {label}
        </Text>

        <TextInput
          className="border border-gray-300 rounded-xl p-3"
          value={value as string}
          placeholder={placeholder}
          keyboardType={keyboardType}
          onChangeText={onChange}
        />

        {error && (
          <Text className="text-red-500 text-sm mt-1">
            {error.message}
          </Text>
        )}
      </View>
    )}
  />
);

/* =======================
   MAIN FORM
======================= */

type Props = {
  currentUser?: Partial<OrderDetailsData>;
  onSave: (data: OrderDetailsData) => void;
  isLoading: boolean;
  title?: string;
  buttonText?: string;
};

const OrderDetailsForm = ({
  currentUser,
  onSave,
  isLoading,
  title = "Delivery Details",
  buttonText = "Continue",
}: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
  } = useForm<OrderDetailsData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      phone: "",
      orderType: "delivery",
      deliveryType: undefined,
      addressLine1: { text: "", lat: 0, lng: 0 },
      city: "",
      country: "",
    },
  });

  const orderType = watch("orderType");

  useEffect(() => {
    if (currentUser) {
      reset(currentUser as OrderDetailsData);
    }
  }, [currentUser, reset]);

  return (
    <ScrollView className="p-5 bg-white">
      <Text className="text-2xl font-bold text-center mb-6">
        {title}
      </Text>

      {/* NAME */}
      <FormField
        control={control}
        name="name"
        label="Full Name"
        placeholder="Enter your name"
      />

      {/* PHONE */}
      <FormField
        control={control}
        name="phone"
        label="Phone Number"
        placeholder="080..."
        keyboardType="phone-pad"
      />

      {/* ORDER TYPE */}
      <Controller
        control={control}
        name="orderType"
        render={({ field: { onChange, value } }) => (
          <View className="mb-4">
            <Text className="text-gray-600 mb-1">
              Order Type
            </Text>

            <View className="border border-gray-300 rounded-xl px-3 py-4">
              <RNPickerSelect
                value={value}
                onValueChange={onChange}
                placeholder={{
                  label: "Select order type",
                  value: null,
                }}
                items={[
                  { label: "Delivery", value: "delivery" },
                  { label: "Takeaway", value: "takeaway" },
                  { label: "Dining", value: "dining" },
                ]}
              />
            </View>
          </View>
        )}
      />

      {/* DELIVERY TYPE */}
      {orderType === "delivery" && (
        <Controller
          control={control}
          name="deliveryType"
          render={({ field: { onChange, value }, fieldState }) => (
            <View className="mb-4">
              <Text className="text-gray-600 mb-1">
                Delivery Type
              </Text>

              <View className="border border-gray-300 rounded-xl px-3 py-4">
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
      )}

      {/* ADDRESS */}
      {orderType === "delivery" && (
        <Controller
          control={control}
          name="addressLine1"
          render={({ field: { onChange, value } }) => (
            <View className="mb-4">
              <Text className="text-gray-600 mb-1">
                Delivery Address
              </Text>

              <AddressInput
                placeholder="Search delivery address"
                value={value.text}
                onChangeText={(text) =>
                  onChange({ text, lat: 0, lng: 0 })
                }
                onSelect={onChange}
              />
            </View>
          )}
        />
      )}

      {/* CITY */}
      <FormField
        control={control}
        name="city"
        label="City"
      />

      {/* COUNTRY */}
      <FormField
        control={control}
        name="country"
        label="Country"
      />

      {/* SUBMIT */}
      <TouchableOpacity
        onPress={handleSubmit(onSave)}
        disabled={isLoading}
        className="mt-6 bg-orange-500 p-4 rounded-xl"
      >
        <Text className="text-white text-center font-semibold">
          {isLoading ? "Processing..." : buttonText}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default OrderDetailsForm;
