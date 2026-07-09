import React, { useEffect, useRef } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import {
  getAuth,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { db } from "../config/firebase"; // same Firebase config file

const AuthCallbackScreen = () => {
  const navigation = useNavigation<any>();
  const hasCreatedUser = useRef(false);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(
      auth,
      async (user: FirebaseUser | null) => {
        if (!user || hasCreatedUser.current) return;

        try {
          const userDocRef = doc(db!, "users", user.uid);
          const userSnapshot = await getDoc(userDocRef);

          if (!userSnapshot.exists()) {
            console.log("Creating new user in Firestore...");
            await setDoc(userDocRef, {
              name: user.displayName || "Unknown User",
              firebaseId: user.uid,
              email: user.email || "",
              createdAt: new Date().toISOString(),
            });
          } else {
            console.log("User already exists in Firestore.");
          }

          hasCreatedUser.current = true;
        } catch (error) {
          console.error("Error saving user to Firestore:", error);
        }
      }
    );

    return () => unsubscribe();
  }, [navigation]);

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="#f97316" />
      <Text className="mt-4 text-lg text-gray-600">
        Processing authentication...
      </Text>
    </View>
  );
};

export default AuthCallbackScreen;
