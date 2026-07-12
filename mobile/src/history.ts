import type { MealHistory, StoreCard } from "@ttc-meal-gacha/core";

export const HISTORY_KEY = "ttc_meal_gacha_history";

export function safeParseHistory(value: string | null): MealHistory[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addHistory(store: StoreCard, history: MealHistory[]): MealHistory[] {
  return [
    {
      id: `${store.id}-${Date.now()}`,
      storeId: store.id,
      storeName: store.name,
      kind: store.kind,
      category: store.category,
      tags: store.tags,
      createdAt: new Date().toISOString()
    },
    ...history
  ].slice(0, 80);
}

export function formatTime(value: string) {
  const date = new Date(value);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const day = date.toDateString() === today.toDateString() ? "今天" : date.toDateString() === yesterday.toDateString() ? "昨天" : `${date.getMonth() + 1}/${date.getDate()}`;
  return `${day} ${`${date.getHours()}`.padStart(2, "0")}:${`${date.getMinutes()}`.padStart(2, "0")}`;
}
