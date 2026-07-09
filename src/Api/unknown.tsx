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

/* ------------------ SCHEMA ------------------ */

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Invalid phone number"),
  addressLine1: z.object({
      text: z.string().min(5, "Please select an address"),
      lat: z.number(),
      lng: z.number(),
    }),
  city: z.string().min(2, "City is required"),
  country: z.string().min(2, "Country is required"),
});

export type UserFormData = z.infer<typeof profileSchema>;

/* ------------------ FORM FIELD HELPER ------------------ */

type FormFieldProps = {
  control: any;
  name: keyof UserFormData;
  label: string;
  placeholder: string;
  keyboardType?: "default" | "email-address" | "phone-pad";
  editable?: boolean;
};

const FormField = ({
  control,
  name,
  label,
  placeholder,
  keyboardType = "default",
  editable = true,
}: FormFieldProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View className="mb-4">
          <Text className="text-gray-600 mb-1">{label}</Text>

          <TextInput
            className="border border-gray-300 rounded-xl p-3 text-gray-800"
            placeholder={placeholder}
            value={value}
            editable={editable}
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
};

/* ------------------ MAIN FORM ------------------ */

type Props = {
  currentUser?: Partial<UserFormData>;
  onSave: (data: UserFormData) => void;
  isLoading: boolean;
  title?: string;
  buttonText?: string;
};

const UserProfileForm = ({
  currentUser,
  onSave,
  isLoading,
  title = "Confirm Delivery Details",
  buttonText = "Proceed to Payment",
}: Props) => {
  const { control, handleSubmit, reset } = useForm<UserFormData>({
  resolver: zodResolver(profileSchema),
  defaultValues: {
    name: "",
    email: "",
    phone: "",
    addressLine1: { text: "", lat: 0, lng: 0 },
    city: "",
    country: "",
  },
});

  useEffect(() => {
    if (currentUser) {
      reset({
        name: currentUser.name ?? "",
        email: currentUser.email ?? "",
        phone: currentUser.phone ?? "",
       addressLine1: currentUser.addressLine1 ?? {
  text: "",
  lat: 0,
  lng: 0,
},

        city: currentUser.city ?? "",
        country: currentUser.country ?? "",
      });
    }
  }, [currentUser, reset]);

  return (
    <ScrollView className="flex-1 bg-white rounded-2xl p-5">
      {/* TITLE */}
      <Text className="text-2xl font-bold text-center text-gray-800 mb-6">
        {title}
      </Text>

      <FormField
        control={control}
        name="name"
        label="Full Name"
        placeholder="Enter your name"
      />

      <FormField
        control={control}
        name="email"
        label="Email"
        placeholder="Enter your email"
        keyboardType="email-address"
        
      />

      <FormField
        control={control}
        name="phone"
        label="Phone"
        placeholder="Enter phone number"
        keyboardType="phone-pad"
      />

 <Controller
  control={control}
  name="addressLine1"
  render={({ field: { onChange, value }, fieldState: { error } }) => (
    <View className="mb-4">
      <Text className="text-gray-600 mb-1">Address</Text>

      <AddressInput
        placeholder="Enter delivery address"
        value={value?.text || ""}
        onChangeText={(text) =>
          onChange({ text, lat: 0, lng: 0 })
        }
        onSelect={(addr) =>
          onChange({
            text: addr.text,
            lat: addr.lat,
            lng: addr.lng,
          })
        }
      />

      
    </View>
  )}
/>


      <FormField
        control={control}
        name="city"
        label="City"
        placeholder="Enter your city"
      />

      <FormField
        control={control}
        name="country"
        label="Country"
        placeholder="Enter your country"
      />

      <TouchableOpacity
        disabled={isLoading}
        onPress={handleSubmit(onSave)}
        className={`mt-6 rounded-xl p-4 ${
          isLoading ? "bg-gray-400" : "bg-orange-500"
        }`}
      >
        <Text className="text-white text-center text-lg font-semibold">
          {isLoading ? "Processing..." : buttonText}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default UserProfileForm; 