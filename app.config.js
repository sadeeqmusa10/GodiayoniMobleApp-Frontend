import "dotenv/config";

export default {
  expo: {
    name: "Godiyaoni",
    slug: "Godiyaoni",
    version: "1.0.0",
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
    },

    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
      bundler: "metro",
    },

    plugins: ["expo-router"],

    extra: {
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      firebaseMeasurementId: process.env.FIREBASE_MEASUREMENT_ID,
    },
  },
};
