import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../config/firebase";

import { Button } from "@/components/nativewindui/Button";
import { useCreateUser } from "../Api/MyUserApi";

import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { toast } from "sonner-native";

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "LoginScreen"
>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({ email: "", password: "" });

  const createUserMutation = useCreateUser();

  const handleChange = (key: "email" | "password", value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAuth = async () => {
    const { email, password } = formData;

    if (!email || !password) {
      toast("Please fill in all fields");
      return;
    }

    if (!isValidEmail(email)) {
      toast("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        // SIGN UP
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const user = userCredential.user;

        await createUserMutation.mutateAsync({
          name: user.displayName ?? email.split("@")[0],
          email: user.email ?? "",
          firebaseId: user.uid,
        });

        toast("Account created successfully!");
      } else {
        // LOGIN
        await signInWithEmailAndPassword(auth, email, password);
        toast("Logged in successfully!");
      }
    } catch (error: any) {
      console.error("Auth error:", error?.code, error?.message);

      switch (error?.code) {
        case "auth/user-disabled":
          toast("Your account has been disabled.");
          break;
        case "auth/invalid-email":
          toast("Invalid email address");
          break;
        case "auth/user-not-found":
          toast("No account found with this email");
          break;
        case "auth/wrong-password":
          toast("Incorrect password");
          break;
        case "auth/email-already-in-use":
          toast("Email already in use");
          break;
        default:
          toast(error?.message ?? "Authentication failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const { email } = formData;

    if (!email) {
      toast("Please enter your email to reset password");
      return;
    }

    if (!isValidEmail(email)) {
      toast("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      toast("Password reset email sent!");
    } catch (error: any) {
      console.error("Forgot password error:", error?.code, error?.message);
      toast(error?.message ?? "Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-6 py-12">
            {/* HEADER */}
            <View className="items-center mb-12">
              <Image
                source={require("../../assets/godiyalogo.jpg")}
                style={{ width: 192, height: 64 }}
                resizeMode="contain"
              />

              <Text className="text-lg text-gray-600 mt-4">
                {isSignUp ? "Create Account" : "Welcome Back"}
              </Text>
            </View>

            {/* FORM */}
            <View className="space-y-6">
              {/* EMAIL */}
              <View className="space-y-2">
                <Text className="text-gray-700 font-medium">Email</Text>
                <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-white">
                  <MaterialIcons name="email" size={20} color="#6B7280" />
                  <TextInput
                    className="flex-1 ml-3 text-base"
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={formData.email}
                    onChangeText={(text) => handleChange("email", text)}
                  />
                </View>
              </View>

              {/* PASSWORD */}
              <View className="space-y-2">
                <Text className="text-gray-700 font-medium">Password</Text>
                <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-white">
                  <Ionicons name="lock-closed" size={20} color="#6B7280" />
                  <TextInput
                    className="flex-1 ml-3 text-base"
                    secureTextEntry={!showPassword}
                    placeholder="Enter your password"
                    autoCapitalize="none"
                    value={formData.password}
                    onChangeText={(text) => handleChange("password", text)}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off" : "eye"}
                      size={20}
                      color="#6B7280"
                    />
                  </TouchableOpacity>
                </View>

                {/* FORGOT PASSWORD */}
                {!isSignUp && (
                  <TouchableOpacity
                    onPress={handleForgotPassword}
                    className="mt-2"
                  >
                    <Text className="text-orange-600 text-right">
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* SUBMIT BUTTON */}
              <Button
                onPress={handleAuth}
                className="bg-orange-600 rounded-xl py-4 mt-4"
                disabled={isLoading || !formData.email || !formData.password}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white text-lg font-semibold">
                    {isSignUp ? "Create Account" : "Sign In"}
                  </Text>
                )}
              </Button>

              {/* SWITCH MODE */}
              <View className="flex-row justify-center mt-4">
                <Text className="text-gray-700">
                  {isSignUp
                    ? "Already have an account?"
                    : "Don't have an account?"}
                </Text>
                <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
                  <Text className="text-orange-600 font-semibold ml-1">
                    {isSignUp ? "Sign In" : "Sign Up"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* BACK TO HOME */}
              <TouchableOpacity
                onPress={() => navigation.navigate("HomeScreen")}
                className="mt-6"
              >
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}