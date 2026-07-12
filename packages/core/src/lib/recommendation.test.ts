import { describe, expect, it } from "vitest";
import { nextRecommendation, recommendStores, type MealHistory, type StoreCard } from "@ttc-meal-gacha/core";

const fast = "\u5feb";
const full = "\u9971\u8179";
const healthy = "\u5065\u5eb7";
const light = "\u6e05\u6de1";
const tasty = "\u597d\u5403";

const sampleStores: StoreCard[] = [
  {
    id: "fast-food",
    name: "\u5feb\u9910\u996d",
    kind: "food",
    category: "\u5feb\u9910\u7b80\u9910",
    floor: "B1",
    price: 25,
    tags: [fast, full],
    note: "\u5feb"
  },
  {
    id: "healthy-food",
    name: "\u5065\u5eb7\u996d",
    kind: "food",
    category: "\u8f7b\u98df",
    floor: "5F",
    price: 33,
    tags: [healthy, light],
    note: "\u5065\u5eb7"
  },
  {
    id: "tasty-food",
    name: "\u597d\u5403\u996d",
    kind: "food",
    category: "\u70ed\u98df",
    floor: "B1",
    price: 29,
    tags: [tasty, full],
    note: "\u597d\u5403"
  },
  {
    id: "drink",
    name: "\u6e05\u723d\u8336",
    kind: "drink",
    category: "\u8336\u996e",
    floor: "B1",
    price: 16,
    tags: ["\u8336", "\u6e05\u723d", fast],
    note: "\u559d"
  }
];

describe("recommendStores", () => {
  it("draws only from the requested kind", () => {
    const food = recommendStores({ kind: "food", stores: sampleStores, history: [] });
    const drink = recommendStores({ kind: "drink", stores: sampleStores, history: [] });

    expect(food.every((item) => item.store.kind === "food")).toBe(true);
    expect(drink).toHaveLength(1);
    expect(drink[0].store.id).toBe("drink");
  });

  it("penalizes a recently confirmed store", () => {
    const history: MealHistory[] = [
      {
        id: "h1",
        storeId: "fast-food",
        storeName: "\u5feb\u9910\u996d",
        kind: "food",
        category: "\u5feb\u9910\u7b80\u9910",
        tags: [fast, full],
        createdAt: new Date().toISOString()
      }
    ];

    const result = recommendStores({ kind: "food", stores: sampleStores, history });

    expect(result[0].store.id).not.toBe("fast-food");
    expect(result.find((item) => item.store.id === "fast-food")?.warnings[0]).toContain("\u6700\u8fd1\u521a\u62bd\u4e2d\u8fc7");
  });

  it("keeps healthier food competitive after fast food today without making it the only option", () => {
    const history: MealHistory[] = [
      {
        id: "h1",
        storeId: "another-fast",
        storeName: "\u53e6\u4e00\u4e2a\u5feb\u9910",
        kind: "food",
        category: "\u5feb\u9910\u7b80\u9910",
        tags: [fast],
        createdAt: new Date().toISOString()
      }
    ];

    const result = recommendStores({ kind: "food", stores: sampleStores, history });
    const healthyResult = result.find((item) => item.store.id === "healthy-food");

    expect(healthyResult?.reasons).toContain("\u4e0a\u4e00\u987f\u504f\u5feb\u9910\uff0c\u8fd9\u5f20\u66f4\u8f7b\u4e00\u70b9");
    expect(result.map((item) => item.store.id)).toContain("tasty-food");
  });

  it("moves through the whole queue instead of bouncing between two stores", () => {
    const queue = recommendStores({ kind: "food", stores: sampleStores, history: [] });
    const first = queue[0];
    const second = nextRecommendation(queue, first);
    const third = nextRecommendation(queue, second);

    expect(second?.store.id).toBe(queue[1].store.id);
    expect(third?.store.id).toBe(queue[2].store.id);
  });

  it("deduplicates stores by id before building the draw queue", () => {
    const result = recommendStores({
      kind: "food",
      stores: [...sampleStores, sampleStores[0]],
      history: []
    });

    expect(result.filter((item) => item.store.id === "fast-food")).toHaveLength(1);
  });
});
