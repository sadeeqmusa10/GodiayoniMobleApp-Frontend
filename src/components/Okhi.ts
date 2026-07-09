import { Platform } from "react-native";

let OkCollect: any;

if (Platform.OS !== "web") {
  OkCollect = require("@okhi/react-native-okcollect").OkCollect;
}

type VerifyParams = {
  phone: string;
  onSuccess: (id: string) => void;
  onError?: () => void;
};

export async function verifyAddress({
  phone,
  onSuccess,
  onError,
}: VerifyParams) {
  try {
    /* ================= WEB ================= */
    if (Platform.OS === "web") {
      const OkHi = (window as any).OkHi;

      if (!OkHi) {
        console.error("❌ OkHi not loaded");
        onError?.();
        return;
      }

      console.log("🚀 Launching OkHi Web");

      const result = await OkHi.selectLocation({
        clientKey: process.env.EXPO_PUBLIC_OKHI_CLIENT_KEY,
        branchId: "main",
        user: { phone },
      });

      console.log("✅ OkHi result:", result);

      if (
        result?.status === "success" &&
        result.location?.id
      ) {
        onSuccess(result.location.id);
      } else {
        console.warn("⚠️ OkHi cancelled or failed");
        onError?.();
      }
    }

    /* ================= MOBILE ================= */
    else {
      const okcollect = new OkCollect({
        clientKey: process.env.EXPO_PUBLIC_OKHI_CLIENT_KEY,
        branchId: "main",
        user: { phone },
      });

      okcollect.launch({
        onSuccess: (location: { id: string }) => {
          onSuccess(location.id);
        },
        onError: () => onError?.(),
        onClose: () => {},
      });
    }
  } catch (err) {
    console.error("❌ OkHi error:", err);
    onError?.();
  }
}
