export type { AppView, DrawKind, MealHistory, Recommendation, StoreCard, StoreTag } from "./types";
export { getStoresByKind, stores } from "./data/stores";
export { nextRecommendation, recommendStores } from "./lib/recommendation";
