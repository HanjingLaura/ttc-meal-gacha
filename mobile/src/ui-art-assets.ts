import categoryDrinkDense from "../assets/ui-art/category-drink-dense.webp";
import categoryDrinkGlow from "../assets/ui-art/category-drink-glow.webp";
import categoryDrinkSparse from "../assets/ui-art/category-drink-sparse.webp";
import categoryFoodDense from "../assets/ui-art/category-food-dense.webp";
import categoryFoodGlow from "../assets/ui-art/category-food-glow.webp";
import categoryFoodSparse from "../assets/ui-art/category-food-sparse.webp";
import historyLogDense from "../assets/ui-art/history-log-dense.webp";
import historyLogGlow from "../assets/ui-art/history-log-glow.webp";
import historyLogSparse from "../assets/ui-art/history-log-sparse.webp";
import homeFeastDense from "../assets/ui-art/home-feast-dense.webp";
import homeFeastGlow from "../assets/ui-art/home-feast-glow.webp";
import homeFeastSparse from "../assets/ui-art/home-feast-sparse.webp";
import type { StoreArtLayers } from "./store-art-assets";

export const uiArt = {
  homeFeast: { dense: homeFeastDense, sparse: homeFeastSparse, glow: homeFeastGlow },
  categoryFood: { dense: categoryFoodDense, sparse: categoryFoodSparse, glow: categoryFoodGlow },
  categoryDrink: { dense: categoryDrinkDense, sparse: categoryDrinkSparse, glow: categoryDrinkGlow },
  historyLog: { dense: historyLogDense, sparse: historyLogSparse, glow: historyLogGlow }
} satisfies Record<string, StoreArtLayers>;
