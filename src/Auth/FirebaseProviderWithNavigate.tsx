import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

export type Role = "admin" | "user";

type AuthContextType = {
  user: FirebaseUser | null;
  role: Role | null;
  loading: boolean;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const FirebaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        // 🔥 1️⃣ CHECK ADMIN COLLECTION FIRST
        const adminSnap = await getDoc(
          doc(db, "admin", currentUser.uid)
        );

        if (adminSnap.exists()) {
          setRole("admin");
          setLoading(false);
          return;
        }

        // 🔹 2️⃣ OTHERWISE USER
        setRole("user");
      } catch (err) {
        console.error("Failed to determine role", err);
        setRole("user");
      }

      setLoading(false);
    });

    return unsub;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        isAuthenticated: !!user,
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
