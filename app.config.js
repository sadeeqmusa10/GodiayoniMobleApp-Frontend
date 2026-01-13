import "dotenv/config";

export default {
  name: "Godiyaoni",
  slug: "Godiyaoni",
  version: "1.0.0",

  updates: {
    enabled: false,
    checkAutomatically: "NEVER",
  },

  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "godiyaoni",
  userInterfaceStyle: "automatic",

  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.godiyaoni.app",
  },

  android: {
    package: "com.godiyaoni.app",
    intentFilters: [
      {
        action: "VIEW",
        data: [{ scheme: "godiyaoni" }],
        category: ["BROWSABLE", "DEFAULT"],
      },
    ],
  },

  web: {
    output: "single",
    favicon: "./assets/images/favicon.png",
    bundler: "metro",
  },

  extra: {
    API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
    firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    firebaseMessagingSenderId:
      process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    firebaseMeasurementId:
      process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
  },

  experiments: {
    router: false,
  },
};
