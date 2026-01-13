// src/config/navigationRef.ts

import { createNavigationContainerRef } from "@react-navigation/native";
import { RootStackParamList } from "../types";

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigateSafe<Name extends keyof RootStackParamList>(
  name: Name,
  params?: RootStackParamList[Name]
) {
  if (navigationRef.isReady()) {
    (navigationRef.navigate as any)(name, params);
  } else {
    // Retry until navigation is ready
    setTimeout(() => navigateSafe(name, params), 50);
  }
}
