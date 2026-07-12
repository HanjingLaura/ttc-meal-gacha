import type { MealHistory } from "@ttc-meal-gacha/core";
import { apiUrl } from "./api-url";

export async function loadHistoryFile(): Promise<MealHistory[] | null> {
  try {
    const response = await fetch(apiUrl("/api/history"));
    if (!response.ok) return null;
    const payload = (await response.json()) as { history?: MealHistory[] };
    return Array.isArray(payload.history) ? payload.history : null;
  } catch {
    return null;
  }
}

export async function writeHistoryFile(history: MealHistory[]) {
  try {
    const response = await fetch(apiUrl("/api/history"), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ history })
    });
    return response.ok;
  } catch {
    return false;
  }
}
