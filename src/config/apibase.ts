import { Platform } from "react-native";

const LOCAL_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:8000"
    : "http://localhost:8000";

const PRODUCTION_URL =
  "https://godiyaoni-express-delivery-backend.onrender.com";

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || PRODUCTION_URL;