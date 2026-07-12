import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";
import { getRecommendationQueue } from "./server/aiRecommendation";
import { readHistoryFile, writeHistoryFile } from "./server/historyStore";

function localApiPlugin() {
  return {
    name: "local-api",
    configureServer(server: {
      middlewares: {
        use: (
          route: string,
          handler: (request: NodeJS.ReadableStream & { method?: string }, response: NodeJS.WritableStream & {
            statusCode?: number;
            setHeader: (name: string, value: string) => void;
            end: (body?: string) => void;
          }) => void
        ) => void;
      };
    }) {
      server.middlewares.use("/api/history", (request, response) => {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setHeader("Access-Control-Allow-Methods", "GET, PUT, OPTIONS");

        if (request.method === "OPTIONS") {
          response.statusCode = 204;
          response.end();
          return;
        }

        if (request.method === "GET") {
          readHistoryFile().then((history) => {
            response.statusCode = 200;
            response.setHeader("Content-Type", "application/json");
            response.end(JSON.stringify({ history }));
          });
          return;
        }

        if (request.method !== "PUT") {
          response.statusCode = 405;
          response.end(JSON.stringify({ error: "method_not_allowed" }));
          return;
        }

        let raw = "";
        request.on("data", (chunk) => { raw += chunk; });
        request.on("end", async () => {
          try {
            const payload = JSON.parse(raw) as { history?: unknown };
            if (!Array.isArray(payload.history)) throw new Error("invalid_history");
            await writeHistoryFile(payload.history);
            response.statusCode = 200;
            response.setHeader("Content-Type", "application/json");
            response.end(JSON.stringify({ ok: true }));
          } catch {
            response.statusCode = 400;
            response.end(JSON.stringify({ error: "invalid_body" }));
          }
        });
      });

      server.middlewares.use("/api/recommend", (request, response) => {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

        if (request.method === "OPTIONS") {
          response.statusCode = 204;
          response.end();
          return;
        }

        if (request.method === "GET") {
          response.statusCode = 200;
          response.setHeader("Content-Type", "application/json");
          response.end(
            JSON.stringify({
              ok: true,
              endpoint: "/api/recommend",
              usage: "POST JSON with { kind, stores, history } to get recommendations."
            })
          );
          return;
        }

        if (request.method !== "POST") {
          response.statusCode = 405;
          response.setHeader("Content-Type", "application/json");
          response.end(JSON.stringify({ error: "method_not_allowed" }));
          return;
        }

        let raw = "";
        request.on("data", (chunk) => {
          raw += chunk;
        });
        request.on("end", async () => {
          try {
            const body = JSON.parse(raw) as Parameters<typeof getRecommendationQueue>[0];
            const fileHistory = await readHistoryFile();
            const clientHistory = Array.isArray(body.history) ? body.history : [];
            const seen = new Set<string>();
            const history = [...clientHistory, ...fileHistory].filter((item) => {
              if (!item?.id || seen.has(item.id)) return false;
              seen.add(item.id);
              return true;
            });
            const result = await getRecommendationQueue({ ...body, history });
            response.statusCode = 200;
            response.setHeader("Content-Type", "application/json");
            response.end(JSON.stringify(result));
          } catch {
            response.statusCode = 400;
            response.setHeader("Content-Type", "application/json");
            response.end(JSON.stringify({ error: "invalid_body" }));
          }
        });
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  Object.assign(process.env, env);

  return {
    plugins: [localApiPlugin()],
    test: {
      environment: "node",
      globals: true,
      exclude: ["**/node_modules/**", "**/dist/**", "**/output/**", "**/.{idea,git,cache}/**"]
    }
  };
});
