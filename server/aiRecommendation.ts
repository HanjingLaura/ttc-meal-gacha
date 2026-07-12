import { recommendStores, type DrawKind, type MealHistory, type Recommendation, type StoreCard } from "../packages/core/src/index";

type AiRecommendationItem = {
  id: string;
  reasons?: string[];
  warnings?: string[];
};

type AiRecommendationResponse = {
  picks?: AiRecommendationItem[];
};

type RecommendationRequest = {
  kind: DrawKind;
  stores: StoreCard[];
  history: MealHistory[];
};

const DEFAULT_BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1";
const DEFAULT_MODEL = "qwen-plus";

function env(name: string) {
  return process.env[name]?.trim();
}

function normalizeBaseUrl(value: string) {
  return value.replace(/\/$/, "");
}

function safeJsonParse(value: string): AiRecommendationResponse | null {
  try {
    return JSON.parse(value) as AiRecommendationResponse;
  } catch {
    const match = value.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]) as AiRecommendationResponse;
    } catch {
      return null;
    }
  }
}

function buildSystemPrompt() {
  return [
    "\u4f60\u662f ttc-Ai Native Team \u7684\u4e94\u9053\u53e3\u5403\u559d\u62bd\u5361\u63a8\u8350\u5668\u3002",
    "\u4f60\u7684\u4efb\u52a1\u662f\u751f\u6210\u4e00\u4e2a\u6709\u53d8\u5316\u7684\u62bd\u5361\u961f\u5217\uff0c\u4e0d\u662f\u6c38\u8fdc\u63a8\u8350\u540c\u51e0\u5bb6\u3002",
    "\u8bf7\u7efc\u5408\u8003\u8651\uff1a\u6700\u8fd1\u4e0d\u8981\u91cd\u590d\u3001\u54c1\u7c7b\u8f6e\u6362\u3001\u5065\u5eb7\u53ea\u662f\u52a0\u5206\u56e0\u7d20\u4e4b\u4e00\u3001\u597d\u5403\u548c\u65b9\u4fbf\u3001\u4e0a\u4e00\u987f\u4e0e\u4e0b\u4e00\u987f\u642d\u914d\u3002",
    "\u4e0d\u8981\u53ea\u63a8\u5065\u5eb7\u9910\uff0c\u4e5f\u4e0d\u8981\u53ea\u63a8\u5feb\u9910\u6216\u9762\u9986\u3002",
    "\u5982\u679c\u6700\u8fd1 3 \u5929\u786e\u8ba4\u8fc7\u540c\u4e00\u5bb6\uff0c\u4e0d\u8981\u653e\u5728\u524d 5 \u4f4d\u3002",
    "\u524d 8 \u4e2a picks \u5c3d\u91cf\u8986\u76d6\u4e0d\u540c\u54c1\u7c7b\uff0c\u4e0d\u8981\u5728\u4e24\u4e09\u5bb6\u5e97\u91cc\u6765\u56de\u5faa\u73af\u3002",
    "\u53ea\u8fd4\u56de JSON\uff0c\u4e0d\u8981 Markdown\uff0c\u4e0d\u8981\u89e3\u91ca\u6a21\u578b\u8fc7\u7a0b\u3002",
    'JSON \u683c\u5f0f\uff1a{"picks":[{"id":"store-id","reasons":["\u77ed\u7406\u75311","\u77ed\u7406\u75312"],"warnings":["\u53ef\u9009\u63d0\u9192"]}]}',
    "picks \u8fd4\u56de 8 \u5230 12 \u4e2a\uff0c\u5fc5\u987b\u5168\u90e8\u6765\u81ea\u7ed9\u5b9a stores \u7684 id\u3002"
  ].join("\n");
}

function buildUserPrompt(request: RecommendationRequest) {
  return JSON.stringify({
    kind: request.kind,
    now: new Date().toISOString(),
    stores: request.stores.filter((store) => store.kind === request.kind).map((store) => ({
      id: store.id,
      name: store.name,
      kind: store.kind,
      category: store.category,
      floor: store.floor,
      price: store.price,
      tags: store.tags,
      note: store.note
    })),
    recentHistory: request.history.slice(0, 20).map((item) => ({
      storeId: item.storeId,
      storeName: item.storeName,
      kind: item.kind,
      category: item.category,
      tags: item.tags,
      createdAt: item.createdAt
    }))
  });
}

function mergeAiPicks(
  ai: AiRecommendationResponse,
  request: RecommendationRequest,
  fallback: Recommendation[]
): Recommendation[] {
  const fallbackById = new Map(fallback.map((item) => [item.store.id, item]));
  const seen = new Set<string>();
  const picked: Recommendation[] = [];

  for (const item of ai.picks ?? []) {
    if (seen.has(item.id)) continue;
    const base = fallbackById.get(item.id);
    if (!base) continue;
    seen.add(item.id);
    picked.push({
      ...base,
      reasons: (item.reasons?.length ? item.reasons : base.reasons).slice(0, 3),
      warnings: (item.warnings ?? base.warnings).slice(0, 2)
    });
  }

  for (const item of fallback) {
    if (seen.has(item.store.id)) continue;
    picked.push(item);
  }

  return picked.filter((item) => item.store.kind === request.kind);
}

export async function getRecommendationQueue(request: RecommendationRequest): Promise<{
  recommendations: Recommendation[];
  engine: "bailian" | "fallback";
  error?: string;
}> {
  const fallback = recommendStores(request);
  const apiKey = env("DASHSCOPE_API_KEY") || env("BAILIAN_API_KEY");

  if (!apiKey) {
    return { recommendations: fallback, engine: "fallback", error: "missing_api_key" };
  }

  const baseUrl = normalizeBaseUrl(env("BAILIAN_BASE_URL") || DEFAULT_BASE_URL);
  const model = env("BAILIAN_MODEL") || DEFAULT_MODEL;

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        temperature: 0.78,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: buildSystemPrompt() },
          { role: "user", content: buildUserPrompt(request) }
        ]
      })
    });

    if (!response.ok) {
      return { recommendations: fallback, engine: "fallback", error: `http_${response.status}` };
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = payload.choices?.[0]?.message?.content ?? "";
    const parsed = safeJsonParse(content);

    if (!parsed?.picks?.length) {
      return { recommendations: fallback, engine: "fallback", error: "empty_ai_response" };
    }

    return {
      recommendations: mergeAiPicks(parsed, request, fallback),
      engine: "bailian"
    };
  } catch (error) {
    return {
      recommendations: fallback,
      engine: "fallback",
      error: error instanceof Error ? error.message : "unknown_error"
    };
  }
}
