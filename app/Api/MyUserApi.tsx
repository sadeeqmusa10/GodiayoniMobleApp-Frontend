import { auth, db } from "../config/firebase";
import { User } from "../types";
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useMutation, useQuery } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import Constants from "expo-constants";
import React from "react";

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

interface CreateUserRequest {
  firebaseId: string;
  name: string;
  email: string;
}

interface UpdateMyUserRequest {
  [key: string]: any;
}

// ✅ Helper to get Firebase token
 const getFirebaseToken = async (): Promise<string> => {
  const currentUser = getAuth().currentUser;
  if (!currentUser) throw new Error("User not authenticated!");
  return currentUser.getIdToken();
};

// ✅ Get current Firestore user
 const useGetMyUser = () => {
  const getMyUserRequest = async (): Promise<User | null> => {
    const currentUser = getAuth().currentUser;
    if (!currentUser) throw new Error("User not authenticated!");

    const userRef = doc(db, "user", currentUser.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) throw new Error("User not found in Firestore!");

    return userSnap.data() as User;
  };

  const {
    data: currentUser,
    error,
    isPending,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["fetchCurrentUserFirestore"],
    queryFn: getMyUserRequest,
    enabled: !!getAuth().currentUser,
    staleTime: 1000 * 60 * 5,
  });

  // 🔔 Toast notifications handled via useEffect
  React.useEffect(() => {
    if (isError && error instanceof Error) {
      Toast.show({
        type: "error",
        text1: error.message.includes("403")
          ? "Your account has been disabled. Please contact support."
          : `Error: ${error.message}`,
      });
    }
  }, [isError, error]);

  return { currentUser, isPending, isError, isSuccess };
};

// ✅ Create user (via backend)
const useCreateUser = () => {
  const mutation = useMutation({
    mutationFn: async (user: CreateUserRequest) => {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch(`${API_BASE_URL}/api/my/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) throw new Error("Failed to create user");
      return response.json();
    },
  });

  React.useEffect(() => {
    if (mutation.isSuccess) {
      Toast.show({ type: "success", text1: "User created successfully!" });
    }
    if (mutation.isError && mutation.error instanceof Error) {
      Toast.show({ type: "error", text1: `Error: ${mutation.error.message}` });
    }
  }, [mutation.isSuccess, mutation.isError]);

  return mutation;
};

// ✅ Update user (Firestore)
 const useUpdateMyUser = () => {
  const mutation = useMutation({
    mutationFn: async (formData: UpdateMyUserRequest) => {
      const currentUser = getAuth().currentUser;
      if (!currentUser) throw new Error("User not authenticated!");

      const userRef = doc(db, "user", currentUser.uid);
      await updateDoc(userRef, formData);
    },
  });

  React.useEffect(() => {
    if (mutation.isSuccess) {
      Toast.show({ type: "success", text1: "User updated successfully!" });
    }
    if (mutation.isError && mutation.error instanceof Error) {
      Toast.show({
        type: "error",
        text1: `Failed to update user: ${mutation.error.message}`,
      });
    }
  }, [mutation.isSuccess, mutation.isError]);

  return mutation;
};

export default {
  getFirebaseToken,
  useGetMyUser,
  useCreateUser,
  useUpdateMyUser,
};
