import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import godiyalogo from "../assets/godiyalogo.jpg";

type LoginFormData = {
  email: string;
  password: string;
  confirmPassword?: string;
};

type Props = {
  onSave: (userProfileData: LoginFormData, isSignUp: boolean) => void;
  isLoading: boolean;
};

// ✅ Zod schema with conditional validation
const formSchema = (isSignUp: boolean) =>
  z
    .object({
      email: z.string().email("Please enter a valid email"),
      password: z.string().min(6, "Password must be at least 6 characters"),
      confirmPassword: isSignUp
        ? z.string().min(6, "Please confirm your password")
        : z.string().optional(),
    })
    .refine((data) => !isSignUp || data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: "Passwords must match",
    });

const UserLoginForm = ({ onSave, isLoading }: Props) => {
  const [action, setAction] = useState<"SignUp" | "Login">("Login");

  const schema = useMemo(() => formSchema(action === "SignUp"), [action]);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    reset();
  }, [action]);

  const onSubmit = (data: LoginFormData) => {
    const { email, password } = data;
    onSave({ email, password }, action === "SignUp");
  };

  return (
    <View className="flex-1 items-center justify-center bg-gray-100 p-5">
      {/* Logo */}
      <Image
        source={godiyalogo}
        className="w-32 h-32 rounded-lg mb-6"
        resizeMode="contain"
      />

      {/* Card Container */}
      <View className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-lg">
        <Text className="text-2xl font-bold text-center mb-4 text-gray-700">
          {action === "SignUp" ? "Create an Account" : "Welcome Back!"}
        </Text>

        {/* Switch Buttons */}
        <View className="flex-row justify-center mb-5">
          <TouchableOpacity
            className={`px-4 py-2 mx-1 rounded-full ${
              action === "Login" ? "bg-orange-600" : "bg-gray-400"
            }`}
            onPress={() => setAction("Login")}
          >
            <Text className="text-white font-semibold">Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`px-4 py-2 mx-1 rounded-full ${
              action === "SignUp" ? "bg-orange-600" : "bg-gray-400"
            }`}
            onPress={() => setAction("SignUp")}
          >
            <Text className="text-white font-semibold">Sign Up</Text>
          </TouchableOpacity>
        </View>

        {/* Email */}
        <Text className="text-gray-600 mb-1">Email</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-1 text-gray-800"
              placeholder="Enter your email"
              keyboardType="email-address"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.email && (
          <Text className="text-red-500 text-sm mb-2">
            {errors.email.message}
          </Text>
        )}

        {/* Password */}
        <Text className="text-gray-600 mb-1">Password</Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-1 text-gray-800"
              placeholder="Enter password"
              secureTextEntry
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.password && (
          <Text className="text-red-500 text-sm mb-2">
            {errors.password.message}
          </Text>
        )}

        {/* Confirm Password (Sign Up only) */}
        {action === "SignUp" && (
          <>
            <Text className="text-gray-600 mb-1">Confirm Password</Text>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 mb-1 text-gray-800"
                  placeholder="Confirm password"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.confirmPassword && (
              <Text className="text-red-500 text-sm mb-2">
                {errors.confirmPassword.message}
              </Text>
            )}
          </>
        )}

        {/* Forgot Password */}
        {action === "Login" && (
          <TouchableOpacity className="mt-2 mb-4">
            <Text className="text-blue-500 text-sm text-right">
              Forgot Password?
            </Text>
          </TouchableOpacity>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
          className={`mt-3 p-3 rounded-lg ${
            isLoading ? "bg-gray-400" : "bg-orange-500"
          }`}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-center text-lg font-semibold">
              {action === "SignUp" ? "Create Account" : "Login"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UserLoginForm;
