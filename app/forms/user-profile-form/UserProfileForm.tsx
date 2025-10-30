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

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Invalid phone number"),
  addressLine1: z.string().min(3, "Address is required"),
  city: z.string().min(2, "City is required"),
  country: z.string().min(2, "Country is required"),
});

export type UserFormData = z.infer<typeof profileSchema>;

type Props = {
  currentUser: Partial<UserFormData>;
  onSave: (data: UserFormData) => void;
  isLoading: boolean;
  title?: string;
  buttonText?: string;
};

const UserProfileForm = ({ currentUser, onSave, isLoading }: Props) => {
  const { control, handleSubmit, reset } = useForm<UserFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: currentUser,
  });

  useEffect(() => {
    if (currentUser) reset(currentUser);
  }, [currentUser]);

  return (
    <ScrollView className="flex-1 bg-white rounded-2xl p-5 shadow-md">
      <Text className="text-2xl font-bold text-center text-gray-800 mb-6">
        Edit Profile
      </Text>

      {/* Name */}
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <View className="mb-4">
            <Text className="text-gray-600 mb-1">Full Name</Text>
            <TextInput
              className="border border-gray-300 rounded-xl p-3 text-gray-800"
              placeholder="Enter your name"
              value={value}
              onChangeText={onChange}
            />
            {error && (
              <Text className="text-red-500 text-sm mt-1">{error.message}</Text>
            )}
          </View>
        )}
      />

      {/* Email */}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <View className="mb-4">
            <Text className="text-gray-600 mb-1">Email</Text>
            <TextInput
              className="border border-gray-300 rounded-xl p-3 text-gray-800"
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={value}
              onChangeText={onChange}
            />
            {error && (
              <Text className="text-red-500 text-sm mt-1">{error.message}</Text>
            )}
          </View>
        )}
      />

      {/* Phone */}
      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <View className="mb-4">
            <Text className="text-gray-600 mb-1">Phone</Text>
            <TextInput
              className="border border-gray-300 rounded-xl p-3 text-gray-800"
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              value={value}
              onChangeText={onChange}
            />
            {error && (
              <Text className="text-red-500 text-sm mt-1">{error.message}</Text>
            )}
          </View>
        )}
      />

      {/* Address */}
      <Controller
        control={control}
        name="addressLine1"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <View className="mb-4">
            <Text className="text-gray-600 mb-1">Address</Text>
            <TextInput
              className="border border-gray-300 rounded-xl p-3 text-gray-800"
              placeholder="Enter your address"
              value={value}
              onChangeText={onChange}
            />
            {error && (
              <Text className="text-red-500 text-sm mt-1">{error.message}</Text>
            )}
          </View>
        )}
      />

      {/* City */}
      <Controller
        control={control}
        name="city"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <View className="mb-4">
            <Text className="text-gray-600 mb-1">City</Text>
            <TextInput
              className="border border-gray-300 rounded-xl p-3 text-gray-800"
              placeholder="Enter your city"
              value={value}
              onChangeText={onChange}
            />
            {error && (
              <Text className="text-red-500 text-sm mt-1">{error.message}</Text>
            )}
          </View>
        )}
      />

      {/* Country */}
      <Controller
        control={control}
        name="country"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <View className="mb-4">
            <Text className="text-gray-600 mb-1">Country</Text>
            <TextInput
              className="border border-gray-300 rounded-xl p-3 text-gray-800"
              placeholder="Enter your country"
              value={value}
              onChangeText={onChange}
            />
            {error && (
              <Text className="text-red-500 text-sm mt-1">{error.message}</Text>
            )}
          </View>
        )}
      />

      {/* Submit Button */}
      <TouchableOpacity
        disabled={isLoading}
        onPress={handleSubmit(onSave)}
        className={`mt-6 rounded-xl p-4 ${
          isLoading ? "bg-gray-400" : "bg-orange-500"
        }`}
      >
        <Text className="text-white text-center text-lg font-semibold">
          {isLoading ? "Saving..." : "Save Changes"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default UserProfileForm;
