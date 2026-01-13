// src/Auth/FirebaseProvider.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { View, Text, ActivityIndicator } from "react-native";
import { auth } from "../config/firebase";

export type Role = "admin" | "user";

type AuthContextType = {
  user: FirebaseUser | null;
  role: Role | null;
  loading: boolean;
  isAuthenticated: boolean;
  logginWithRedirect: (returnTo?: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const FirebaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        // 🔴 force refresh so claims are always correct
        const tokenResult = await currentUser.getIdTokenResult(true);
        setRole(tokenResult.claims.admin ? "admin" : "user");
      } catch (err) {
        console.error("Failed to read auth claims", err);
        setRole("user");
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logginWithRedirect = () => {
    // handled by navigator
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 12 }}>Checking authentication...</Text>
      </View>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        isAuthenticated: !!user,
        logginWithRedirect,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default FirebaseProvider;

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within FirebaseProvider");
  return ctx;
};
