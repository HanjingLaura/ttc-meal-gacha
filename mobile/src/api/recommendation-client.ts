import {
  recommendStores,
  type DrawKind,
  type MealHistory,
  type Recommendation,
  type StoreCard
} from "@ttc-meal-gacha/core";
import { apiUrl } from "./api-url";

type RecommendationApiResponse = {
  recommendations?: Recommendation[];
  engine?: "bailian" | "fallback";
};

export async function requestRecommendations(params: {
  kind: DrawKind;
  stores: StoreCard[];
  history: MealHistory[];
}) {
  const fallback = recommendStores(params);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

  try {
    const response = await fetch(apiUrl("/api/recommend"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
      signal: controller.signal
    });

    if (!response.ok) {
      return { recommendations: fallback, engine: "fallback" as const };
    }

    const payload = (await response.json()) as RecommendationApiResponse;
    if (!payload.recommendations?.length) {
      return { recommendations: fallback, engine: "fallback" as const };
    }

    return {
      recommendations: payload.recommendations,
      engine: payload.engine ?? ("fallback" as const)
    };
  } catch {
    return { recommendations: fallback, engine: "fallback" as const };
  } finally {
    clearTimeout(timeout);
  }
}
