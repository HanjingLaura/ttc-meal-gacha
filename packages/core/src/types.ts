export type DrawKind = "food" | "drink";

export type StoreTag =
  | "健康"
  | "好吃"
  | "快"
  | "清淡"
  | "清爽"
  | "甜"
  | "冰"
  | "热"
  | "饱腹"
  | "辣"
  | "正餐"
  | "咖啡"
  | "茶"
  | "奶"
  | "特色"
  | "多人"
  | "贵一点";

export type StoreCard = {
  id: string;
  name: string;
  kind: DrawKind;
  category: string;
  floor: string;
  price: number;
  tags: StoreTag[];
  note: string;
};

export type MealHistory = {
  id: string;
  storeId: string;
  storeName: string;
  kind: DrawKind;
  category: string;
  tags: StoreTag[];
  createdAt: string;
};

export type Recommendation = {
  store: StoreCard;
  score: number;
  reasons: string[];
  warnings: string[];
};

export type AppView = "home" | "draw" | "history";
