import { createContext, useContext, useEffect, useState } from "react";
import { initializeApp, getApps } from "firebase/app";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useRouter, useSegments } from "expo-router";
import { View, Text, ActivityIndicator } from "react-native";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// ✅ Initialize Firebase only once
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

type AuthContextType = {
  user: User | null;
  role: "admin" | "user" | null;
  loading: boolean;
  isAuthenticated: boolean;
  logginWithRedirect: (returnTo?: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const FirebaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<"admin" | "user" | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const tokenResult = await currentUser.getIdTokenResult(true);
          if (tokenResult.claims.admin) {
            setRole("admin");
          } else {
            setRole("user");
          }
        } catch (err) {
          console.log("Error fetching custom claims:", err);
          setRole("user");
        }
      } else {
        setRole(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    const group = segments[0] as string | undefined;
    const inAuthGroup = group === "(auth)";
    const inProtectedGroup = group === "(protected)";
    const inAdminGroup = group === "(admin)";

    if (!user && (inProtectedGroup || inAdminGroup)) {
      router.replace("/login" as any);
    } else if (user && inAuthGroup) {
      router.replace("/" as any);
    } else if (user && inAdminGroup && role !== "admin") {
      router.replace("/" as any);
    }
  }, [user, role, loading, segments]);

  const logginWithRedirect = (returnTo?: string) => {
    if (returnTo) {
      console.log("Return to after login:", returnTo);
    }
    router.replace("/login" as any);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <ActivityIndicator size="large" color="#000" />
        <Text className="mt-2 text-gray-800 dark:text-gray-200">
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        role,
        isAuthenticated: !!user,
        logginWithRedirect,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within FirebaseProvider");
  }
  return context;
};

// ✅ FIXED EXPORT
export default FirebaseProvider;
