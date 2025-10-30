import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User as FirebaseUser,
} from "firebase/auth";
import { toast } from "sonner-native";

import HomeScreen from "../app/screens/HomeScreen";
import LoginScreen from "../app/screens/LoginScreen";
import UserProfileScreen from "../app/screens/UserProfileScreen";
import SearchScreen from "../app/screens/SearchScreen";
import ManageRestaurantScreen from "../app/screens/ManageRestaurantScreen";
import ManageDeliveryScreen from "../app/screens/ManageDeliveryScreen";
import DeliveryScreen from "../app/screens//DeliveryScreen";
import DeliveryStatusScreen from "../app/screens/DeliveryStatusScreen";
import OrderStatusScreen from "../app/screens/OrderStatusScreen";
import DeliveryOrderScreen from "../app/screens/DeliveryOrderScreen";
import BlockedAccountScreen from "../app/screens//BlockedAccount";

import { useCreateUser } from "@/app/Api/MyUserApi";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const auth = getAuth();
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const createUserMutation = useCreateUser();

  // ✅ Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setCheckingAuth(false);
    });
    return unsubscribe;
  }, []);

  const handleAuth = async (
    { email, password }: { email: string; password: string },
    isSignUp: boolean
  ) => {
    setIsLoading(true);
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        await createUserMutation.mutateAsync({
          name: user.displayName ?? "New User",
          email: user.email ?? "",
          firebaseId: user.uid,
        });
        toast.success("Account created!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Logged in!");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Public routes */}
        {!currentUser ? (
          <>
            <Stack.Screen name="Login" options={{ headerShown: false }}>
              {(props) => <LoginScreen />}
            </Stack.Screen>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Search" component={SearchScreen} />
            <Stack.Screen
              name="BlockedAccount"
              component={BlockedAccountScreen}
            />
          </>
        ) : (
          <>
            {/* Protected routes */}
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={UserProfileScreen} />
            <Stack.Screen
              name="ManageRestaurant"
              component={ManageRestaurantScreen}
            />
            <Stack.Screen
              name="ManageDelivery"
              component={ManageDeliveryScreen}
            />
            <Stack.Screen name="Delivery" component={DeliveryScreen} />
            <Stack.Screen
              name="DeliveryStatus"
              component={DeliveryStatusScreen}
            />
            <Stack.Screen name="OrderStatus" component={OrderStatusScreen} />
            <Stack.Screen
              name="DeliveryOrder"
              component={DeliveryOrderScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
