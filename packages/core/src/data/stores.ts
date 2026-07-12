import type { StoreCard } from "../types";

export const stores: StoreCard[] = [
  {
    id: "drink-lanxiong",
    name: "兰熊鲜奶",
    kind: "drink",
    category: "酸奶鲜奶",
    floor: "5F",
    price: 16,
    tags: ["奶", "冰", "甜", "清爽"],
    note: "冰激凌奶香浓郁"
  },
  {
    id: "drink-chabaidao",
    name: "茶百道",
    kind: "drink",
    category: "茶饮果汁",
    floor: "B1",
    price: 15,
    tags: ["茶", "冰", "清爽", "甜", "快"],
    note: "果茶稳定，适合随手带走"
  },
  {
    id: "drink-chaos-yogurt",
    name: "艾炒酸奶",
    kind: "drink",
    category: "冰淇淋",
    floor: "B1",
    price: 23,
    tags: ["奶", "冰", "甜", "特色"],
    note: "水果酸奶口感更像小甜品"
  },
  {
    id: "drink-yeye",
    name: "爷爷不泡茶",
    kind: "drink",
    category: "茶饮果汁",
    floor: "B1",
    price: 18,
    tags: ["茶", "冰", "清爽", "甜"],
    note: "白兰青提适合夏天"
  },
  {
    id: "drink-luckin",
    name: "瑞幸咖啡",
    kind: "drink",
    category: "咖啡",
    floor: "B1",
    price: 14,
    tags: ["咖啡", "快", "冰"],
    note: "性价比高，提神路线"
  },
  {
    id: "drink-qintiantian",
    name: "脸红秦田田",
    kind: "drink",
    category: "茶饮果汁",
    floor: "B1",
    price: 15,
    tags: ["茶", "冰", "甜", "特色"],
    note: "石榴接骨木比较有记忆点"
  },
  {
    id: "drink-coco",
    name: "CoCo都可",
    kind: "drink",
    category: "茶饮果汁",
    floor: "B1",
    price: 14,
    tags: ["茶", "冰", "甜", "快"],
    note: "物美价廉，点起来不纠结"
  },
  {
    id: "drink-more-yogurt",
    name: "茉酸奶",
    kind: "drink",
    category: "酸奶鲜奶",
    floor: "B1",
    price: 23,
    tags: ["奶", "甜", "健康", "冰"],
    note: "酸奶类，比奶茶更轻一点"
  },
  {
    id: "drink-starbucks",
    name: "星巴克",
    kind: "drink",
    category: "咖啡",
    floor: "1F",
    price: 34,
    tags: ["咖啡", "贵一点", "冰"],
    note: "环境稳定，适合顺手坐一会"
  },
  {
    id: "drink-chagee",
    name: "霸王茶姬",
    kind: "drink",
    category: "茶饮果汁",
    floor: "1F",
    price: 20,
    tags: ["茶", "清爽", "健康", "奶"],
    note: "茶味更明显，少糖也能喝"
  },
  {
    id: "drink-gelato",
    name: "野人先生现做冰淇淋",
    kind: "drink",
    category: "冰淇淋",
    floor: "B1",
    price: 28,
    tags: ["冰", "甜", "特色", "贵一点"],
    note: "像奖励自己的甜品卡"
  },
  {
    id: "drink-bojoo",
    name: "宝珠奶酪",
    kind: "drink",
    category: "茶饮果汁",
    floor: "5F",
    price: 24,
    tags: ["奶", "甜", "特色"],
    note: "奶酪风味更有存在感"
  },
  {
    id: "drink-linlee",
    name: "LINLEE林里",
    kind: "drink",
    category: "手打柠檬茶",
    floor: "B1",
    price: 17,
    tags: ["茶", "冰", "清爽", "快"],
    note: "手打柠檬茶，清醒一夏"
  },
  {
    id: "drink-teasure",
    name: "煮叶",
    kind: "drink",
    category: "茶饮果汁",
    floor: "3F",
    price: 27,
    tags: ["茶", "清爽", "健康", "贵一点"],
    note: "茶包路线，活动价更香"
  },
  {
    id: "drink-manner",
    name: "Manner Coffee",
    kind: "drink",
    category: "咖啡",
    floor: "1F",
    price: 21,
    tags: ["咖啡", "快", "冰"],
    note: "口味稳，适合下午续命"
  },
  {
    id: "food-zuimian",
    name: "醉面",
    kind: "food",
    category: "粉面馆",
    floor: "5F",
    price: 22,
    tags: ["快", "清淡", "饱腹"],
    note: "凉面清爽，适合不想太油"
  },
  {
    id: "food-liumian",
    name: "六面寿面馆",
    kind: "food",
    category: "粉面馆",
    floor: "B1",
    price: 23,
    tags: ["快", "饱腹", "好吃"],
    note: "炸酱面路线，吃完顶得住"
  },
  {
    id: "food-lutai",
    name: "卤太宗·大鸡腿饭",
    kind: "food",
    category: "快餐简餐",
    floor: "B1",
    price: 23,
    tags: ["快", "饱腹", "热"],
    note: "鸡腿饭简单直接"
  },
  {
    id: "food-zigulu",
    name: "子固路老南昌拌粉",
    kind: "food",
    category: "粉面馆",
    floor: "B1",
    price: 24,
    tags: ["快", "辣", "饱腹"],
    note: "一口封神的拌粉路线"
  },
  {
    id: "food-zhangruhuo",
    name: "张如火重庆酸辣粉",
    kind: "food",
    category: "小吃快餐",
    floor: "B1",
    price: 24,
    tags: ["快", "辣", "热"],
    note: "正宗酸辣，回味南方"
  },
  {
    id: "food-mcdonalds",
    name: "麦当劳",
    kind: "food",
    category: "西式快餐",
    floor: "1F",
    price: 25,
    tags: ["快", "甜", "饱腹"],
    note: "不知道吃啥时的保底牌"
  },
  {
    id: "food-jiayibing",
    name: "甲乙饼·冰粥·手工肉饼",
    kind: "food",
    category: "粥店",
    floor: "B1",
    price: 26,
    tags: ["饱腹", "热", "清淡"],
    note: "肉饼加冰粥，整体比较舒服"
  },
  {
    id: "food-miaoamei",
    name: "苗阿妹贵州羊肉粉",
    kind: "food",
    category: "粉面馆",
    floor: "5F",
    price: 27,
    tags: ["热", "特色", "饱腹"],
    note: "贵州羊肉粉，热乎有特色"
  },
  {
    id: "food-zhaoer",
    name: "赵崽儿川式面品",
    kind: "food",
    category: "粉面馆",
    floor: "B1",
    price: 29,
    tags: ["辣", "快", "热"],
    note: "椒麻豆花，冰凉解暑"
  },
  {
    id: "food-bailuyuan",
    name: "白鹿原西安肉夹馍",
    kind: "food",
    category: "快餐简餐",
    floor: "B1",
    price: 31,
    tags: ["快", "饱腹", "特色"],
    note: "凉皮爽口，服务态度好"
  },
  {
    id: "food-laoxiangji",
    name: "老乡鸡",
    kind: "food",
    category: "快餐简餐",
    floor: "5F",
    price: 31,
    tags: ["健康", "快", "热"],
    note: "家常中餐，适合想吃稳一点"
  },
  {
    id: "food-jiangzhouzi",
    name: "柒十二匠·酱肘子",
    kind: "food",
    category: "熟食熏酱",
    floor: "B1",
    price: 33,
    tags: ["好吃", "饱腹", "热"],
    note: "肉量快乐，但别太频繁"
  },
  {
    id: "food-hefu",
    name: "和府捞面",
    kind: "food",
    category: "面馆",
    floor: "5F",
    price: 33,
    tags: ["热", "清淡", "健康"],
    note: "热汤面，适合想吃清淡热乎"
  },
  {
    id: "food-shaguopo",
    name: "砂锅婆砂锅下饭菜",
    kind: "food",
    category: "快餐简餐",
    floor: "B1",
    price: 34,
    tags: ["热", "饱腹", "快"],
    note: "砂锅菜性价比高"
  },
  {
    id: "food-micun",
    name: "米村拌饭",
    kind: "food",
    category: "快餐简餐",
    floor: "5F",
    price: 34,
    tags: ["热", "饱腹", "快"],
    note: "韩式拌饭，稳定顶饱"
  },
  {
    id: "food-jiagelao",
    name: "夹捞盛·鲜鱼汤麻辣烫",
    kind: "food",
    category: "麻辣烫",
    floor: "B1",
    price: 39,
    tags: ["辣", "热", "健康"],
    note: "能加菜，别点太重也可以健康"
  },
  {
    id: "food-tubestation",
    name: "Tubestation站点比萨",
    kind: "food",
    category: "比萨",
    floor: "4F",
    price: 72,
    tags: ["正餐", "特色", "贵一点"],
    note: "披萨卡，适合想吃不一样"
  },
  {
    id: "food-xiangshanting",
    name: "湘膳廷·湘楚精选菜",
    kind: "food",
    category: "湘菜",
    floor: "5F",
    price: 73,
    tags: ["正餐", "辣", "多人", "好吃"],
    note: "适合多人坐下吃湘菜"
  },
  {
    id: "food-xintang",
    name: "新棠师兄·新派粤味",
    kind: "food",
    category: "茶餐厅",
    floor: "5F",
    price: 74,
    tags: ["正餐", "甜", "特色", "多人"],
    note: "粤味正餐，烧腊糖水都能点"
  },
  {
    id: "food-yunhaiyao",
    name: "云海肴·汽锅鸡",
    kind: "food",
    category: "云南菜",
    floor: "6F",
    price: 75,
    tags: ["正餐", "特色", "多人", "健康"],
    note: "云南菜特色卡，适合改善伙食"
  },
  {
    id: "food-samgyetang",
    name: "鲜有基参鸡汤",
    kind: "food",
    category: "韩式料理",
    floor: "5F",
    price: 81,
    tags: ["健康", "正餐", "热", "贵一点"],
    note: "参鸡汤热腾腾，适合补一补"
  },
  {
    id: "food-xibei",
    name: "西贝",
    kind: "food",
    category: "西北民间菜",
    floor: "5F",
    price: 88,
    tags: ["正餐", "特色", "多人", "贵一点"],
    note: "西北风味扎实，等位也算好事儿"
  }
];

export function getStoresByKind(kind: StoreCard["kind"]) {
  return stores.filter((store) => store.kind === kind);
}
