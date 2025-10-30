import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { useCreateUser } from "@/app/Api/MyUserApi";
import UserLoginForm from "@/components/LoginForm"; // You'll adapt this form for mobile
import { router } from "expo-router"; // Or useNavigation if not using expo-router

type LoginFormData = {
  email: string;
  password: string;
};

const LoginScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const createUserMutation = useCreateUser();

  const handleAuth = async (
    userProfileData: LoginFormData,
    isSignUp: boolean
  ) => {
    setIsLoading(true);
    try {
      let userCredential;

      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          userProfileData.email,
          userProfileData.password
        );

        const user = userCredential.user;

        await createUserMutation.mutateAsync({
          name: user.displayName ?? "New User",
          email: user.email ?? "",
          firebaseId: user.uid,
        });

        Alert.alert("Success", "Account created successfully!");
      } else {
        userCredential = await signInWithEmailAndPassword(
          auth,
          userProfileData.email,
          userProfileData.password
        );
        Alert.alert("Success", "Logged in successfully!");
      }

      router.push("/"); // Navigate home if using expo-router
    } catch (error: any) {
      if (error.code === "auth/user-disabled") {
        Alert.alert(
          "Access Denied",
          "Your account has been disabled. Please contact support."
        );
        router.push("/blockedaccount" as any);
      } else {
        Alert.alert("Error", error.message || "Authentication failed.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white p-6">
      <UserLoginForm onSave={handleAuth} isLoading={isLoading} />
      {isLoading && <ActivityIndicator size="large" className="mt-4" />}
    </View>
  );
};

export default LoginScreen;
