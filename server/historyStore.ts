import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { MealHistory } from "../packages/core/src/index";

const dataDirectory = path.resolve(process.cwd(), "data");
const historyPath = path.join(dataDirectory, "history.json");
const temporaryPath = path.join(dataDirectory, "history.tmp.json");
let pendingWrite = Promise.resolve();

export async function readHistoryFile(): Promise<MealHistory[]> {
  try {
    const parsed = JSON.parse(await readFile(historyPath, "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeHistoryFile(history: MealHistory[]) {
  pendingWrite = pendingWrite.then(async () => {
    await mkdir(dataDirectory, { recursive: true });
    await writeFile(temporaryPath, `${JSON.stringify(history, null, 2)}\n`, "utf8");
    await rename(temporaryPath, historyPath);
  });
  return pendingWrite;
}
