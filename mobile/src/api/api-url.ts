import { NativeModules, Platform } from "react-native";

export function apiUrl(path: string) {
  const configured = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
  if (configured) return `${configured.replace(/\/$/, "")}${path}`;

  if (Platform.OS === "web" && typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:8787${path}`;
  }

  const scriptUrl = NativeModules.SourceCode?.scriptURL as string | undefined;
  const host = scriptUrl?.match(/^[a-z]+:\/\/([^/:]+)/i)?.[1];
  return `http://${host ?? "localhost"}:8787${path}`;
}
