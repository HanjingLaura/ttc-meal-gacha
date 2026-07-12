import type { DrawKind, MealHistory, Recommendation, StoreCard } from "../types";

const DAY = 24 * 60 * 60 * 1000;

const TAG_HEALTHY = "\u5065\u5eb7";
const TAG_TASTY = "\u597d\u5403";
const TAG_FAST = "\u5feb";
const TAG_LIGHT = "\u6e05\u6de1";
const TAG_SPECIAL = "\u7279\u8272";
const TAG_SITDOWN = "\u6b63\u9910";
const TAG_GROUP = "\u591a\u4eba";

const COPY = {
  recentSameStore: "\u6700\u8fd1\u521a\u62bd\u4e2d\u8fc7\uff0c\u4f5c\u4e3a\u5907\u9009\u66f4\u5408\u9002",
  weekSameStore: "\u4e00\u5468\u5185\u62bd\u4e2d\u8fc7\uff0c\u5df2\u964d\u6743",
  recentCategory: "\u8fd1\u51e0\u5929\u5403\u8fc7\u540c\u7c7b\uff0c\u5148\u964d\u4e00\u70b9",
  recentGroup: "\u6700\u8fd1\u540c\u53e3\u5473\u504f\u591a\uff0c\u6362\u4e2a\u65b9\u5411",
  healthy: "\u5065\u5eb7\u4e00\u70b9",
  tasty: "\u53e3\u5473\u66f4\u7a33",
  fast: "\u62ff\u8d77\u6765\u5feb\uff0c\u4e0d\u62d6\u65f6\u95f4",
  fastBalance: "\u4e0a\u4e00\u987f\u504f\u5feb\u9910\uff0c\u8fd9\u5f20\u66f4\u8f7b\u4e00\u70b9",
  notRecent: "\u6700\u8fd1\u6ca1\u6709\u62bd\u5230\u8fd9\u5bb6",
  special: "\u5e26\u4e00\u70b9\u4eca\u65e5\u7279\u8272",
  pricey: "\u4ef7\u683c\u504f\u9ad8\uff0c\u9002\u5408\u60f3\u5403\u597d\u70b9"
};

function daysAgo(date: string, now: Date) {
  return Math.floor((now.getTime() - new Date(date).getTime()) / DAY);
}

function sameDay(a: Date, b: Date) {
  return a.toDateString() === b.toDateString();
}

function dayKey(now: Date) {
  return now.toISOString().slice(0, 10);
}

function hashToUnit(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return ((hash >>> 0) + 1) / 4294967297;
}

function includesText(value: string, needles: string[]) {
  return needles.some((needle) => value.includes(needle));
}

function hasTag(store: Pick<StoreCard | MealHistory, "tags">, tag: string) {
  return store.tags.some((item) => item === tag);
}

function latestFoodHistory(history: MealHistory[]) {
  return history
    .filter((item) => item.kind === "food")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
}

function hasRecentFastFood(history: MealHistory[], now: Date) {
  const latest = latestFoodHistory(history);
  if (!latest) return false;
  return sameDay(new Date(latest.createdAt), now) && hasTag(latest, TAG_FAST);
}

function foodGroup(value: Pick<StoreCard | MealHistory, "kind" | "category" | "tags"> & { name?: string; price?: number }) {
  if (value.kind !== "food") return value.category;

  const text = `${value.name ?? ""} ${value.category}`;
  if (includesText(text, ["\u9762", "\u7c89", "\u62cc\u7c89"])) return "noodle";
  if (hasTag(value, TAG_SITDOWN) || hasTag(value, TAG_GROUP) || (value.price ?? 0) >= 60) return "sitdown";
  if (hasTag(value, TAG_FAST) || includesText(text, ["\u5feb\u9910", "\u7b80\u9910", "\u6c49\u5821", "\u62cc\u996d"])) {
    return "quick";
  }
  return value.category;
}

function recentHistoryForStore(store: StoreCard, history: MealHistory[], now: Date) {
  return history
    .filter((item) => item.storeId === store.id)
    .map((item) => ({ item, age: daysAgo(item.createdAt, now) }))
    .sort((a, b) => a.age - b.age)[0];
}

function recentCategoryHit(store: StoreCard, history: MealHistory[], now: Date) {
  return history.some((item) => item.kind === store.kind && item.category === store.category && daysAgo(item.createdAt, now) <= 7);
}

function recentGroupHit(store: StoreCard, history: MealHistory[], now: Date) {
  const group = foodGroup(store);
  if (store.kind !== "food") return false;
  return history.some((item) => item.kind === "food" && foodGroup(item) === group && daysAgo(item.createdAt, now) <= 7);
}

function reasonForHealthyBalance(store: StoreCard, history: MealHistory[], now: Date) {
  if (store.kind !== "food") return null;
  if (!hasRecentFastFood(history, now)) return null;
  if (!hasTag(store, TAG_HEALTHY) && !hasTag(store, TAG_LIGHT)) return null;
  return COPY.fastBalance;
}

function scoreStore(store: StoreCard, history: MealHistory[], now: Date): Recommendation {
  let score = 100;
  const reasons: string[] = [];
  const warnings: string[] = [];
  const sameStoreHistory = recentHistoryForStore(store, history, now);

  if (sameStoreHistory) {
    if (sameStoreHistory.age <= 3) {
      score -= 90;
      warnings.push(COPY.recentSameStore);
    } else if (sameStoreHistory.age <= 7) {
      score -= 55;
      warnings.push(COPY.weekSameStore);
    }
  }

  if (recentCategoryHit(store, history, now)) {
    score -= 38;
    warnings.push(COPY.recentCategory);
  } else if (recentGroupHit(store, history, now)) {
    score -= 24;
    warnings.push(COPY.recentGroup);
  }

  if (hasTag(store, TAG_HEALTHY)) {
    score += 8;
    reasons.push(COPY.healthy);
  }
  if (hasTag(store, TAG_TASTY)) {
    score += 8;
    reasons.push(COPY.tasty);
  }
  if (hasTag(store, TAG_FAST)) {
    score += 4;
    reasons.push(COPY.fast);
  }

  const balanceReason = reasonForHealthyBalance(store, history, now);
  if (balanceReason) {
    score += 12;
    reasons.push(balanceReason);
  }

  if (!sameStoreHistory) {
    reasons.push(COPY.notRecent);
  }

  if (hasTag(store, TAG_SPECIAL)) {
    score += 4;
    reasons.push(COPY.special);
  }

  if (store.price >= 70) {
    score -= 8;
    warnings.push(COPY.pricey);
  }

  return {
    store,
    score,
    reasons: reasons.slice(0, 3),
    warnings
  };
}

function weightedPickIndex(remaining: Recommendation[], picked: Recommendation[], now: Date, kind: DrawKind) {
  const maxScore = Math.max(...remaining.map((item) => item.score));
  const recentGroups = new Set(picked.slice(-2).map((item) => foodGroup(item.store)));
  const usedGroups = new Set(picked.map((item) => foodGroup(item.store)));
  const position = picked.length;

  let bestIndex = 0;
  let bestKey = Number.POSITIVE_INFINITY;

  for (let index = 0; index < remaining.length; index += 1) {
    const item = remaining[index];
    const group = foodGroup(item.store);
    let weight = Math.exp((item.score - maxScore) / 28);

    if (recentGroups.has(group)) weight *= 0.24;
    else if (usedGroups.has(group)) weight *= 0.58;
    if (item.score < 40) weight *= 0.28;

    const random = hashToUnit(`${dayKey(now)}:${kind}:${position}:${item.store.id}`);
    const key = -Math.log(random) / Math.max(weight, 0.001);
    if (key < bestKey) {
      bestKey = key;
      bestIndex = index;
    }
  }

  return bestIndex;
}

function buildWeightedDeck(results: Recommendation[], now: Date, kind: DrawKind) {
  const remaining = [...results];
  const picked: Recommendation[] = [];

  while (remaining.length > 0) {
    const index = weightedPickIndex(remaining, picked, now, kind);
    const [next] = remaining.splice(index, 1);
    picked.push(next);
  }

  return picked;
}

function uniqueStoresById(stores: StoreCard[]) {
  const seen = new Set<string>();
  return stores.filter((store) => {
    if (seen.has(store.id)) return false;
    seen.add(store.id);
    return true;
  });
}

export function recommendStores(params: {
  kind: DrawKind;
  stores: StoreCard[];
  history: MealHistory[];
  now?: Date;
}): Recommendation[] {
  const now = params.now ?? new Date();
  const scored = uniqueStoresById(params.stores)
    .filter((store) => store.kind === params.kind)
    .map((store) => scoreStore(store, params.history, now));

  return buildWeightedDeck(scored, now, params.kind);
}

export function nextRecommendation(queue: Recommendation[], current?: Recommendation | null) {
  if (queue.length === 0) return null;
  if (!current) return queue[0];

  const currentIndex = queue.findIndex((item) => item.store.id === current.store.id);
  if (currentIndex === -1) return queue[0];

  for (let offset = 1; offset <= queue.length; offset += 1) {
    const next = queue[(currentIndex + offset) % queue.length];
    if (next.store.id !== current.store.id) return next;
  }

  return queue[0];
}
