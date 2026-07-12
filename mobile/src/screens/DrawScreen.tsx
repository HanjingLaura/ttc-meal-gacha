import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  nextRecommendation,
  stores,
  type DrawKind,
  type MealHistory,
  type Recommendation
} from "@ttc-meal-gacha/core";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { writeHistoryFile } from "../api/history-client";
import { requestRecommendations } from "../api/recommendation-client";
import { AnimatedStoreArt } from "../components/AnimatedStoreArt";
import { Header, Shell } from "../components/chrome";
import { addHistory, HISTORY_KEY } from "../history";
import { getStoreArtLayers } from "../store-art-assets";
import { styles } from "../styles";
import { uiArt } from "../ui-art-assets";

function ResultPanel({ current, isDrawing, kind }: { current: Recommendation | null; isDrawing: boolean; kind: DrawKind }) {
  if (!current) {
    if (isDrawing) {
      return (
        <View style={styles.resultPanel}>
          <View style={styles.standbyVisual}>
            <AnimatedStoreArt layers={kind === "food" ? uiArt.categoryFood : uiArt.categoryDrink} storeKey={`loading-${kind}`} />
          </View>
          <Text style={styles.rendering}>{"> 正在成像 . . ."}</Text>
        </View>
      );
    }
    return (
      <View style={styles.resultPanel}>
        <Text style={styles.standbyLabel}>STANDBY</Text>
        <View style={styles.standbyVisual}>
          <AnimatedStoreArt layers={kind === "food" ? uiArt.categoryFood : uiArt.categoryDrink} storeKey={`standby-${kind}`} />
        </View>
        <Text style={styles.waiting}>[ 等待抽取 ]</Text>
      </View>
    );
  }

  const { store } = current;
  // Every store ships photo-based art layers; fall back to the category art
  // for any store id that has not been generated yet.
  const artLayers = getStoreArtLayers(store.id) ?? (store.kind === "food" ? uiArt.categoryFood : uiArt.categoryDrink);
  return (
    <View style={styles.resultPanel}>
      <Text style={styles.outputLabel}>TODAY'S OUTPUT</Text>
      <Text style={styles.resultName}>{store.name}</Text>
      <Text style={styles.resultMeta}>{`${store.category}  ·  ${store.floor}  ·  ¥${store.price}/人`}</Text>
      <AnimatedStoreArt layers={artLayers} storeKey={store.id} />
      <View style={styles.tags}>{store.tags.slice(0, 4).map((tag) => <Text key={tag} style={styles.tag}>#{tag}</Text>)}</View>
      <Text style={styles.note}>{store.note}</Text>
    </View>
  );
}

export function DrawScreen({ history, kind, onBack, onHistoryChange }: { history: MealHistory[]; kind: DrawKind; onBack: () => void; onHistoryChange: (history: MealHistory[]) => void }) {
  const [queue, setQueue] = useState<Recommendation[]>([]);
  const [current, setCurrent] = useState<Recommendation | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [saved, setSaved] = useState(false);

  async function draw(next = false) {
    if (isDrawing) return;
    setSaved(false);
    setIsDrawing(true);
    const startedAt = Date.now();
    const source = queue.length
      ? queue
      : (await requestRecommendations({ kind, stores, history })).recommendations;
    const result = next ? nextRecommendation(source, current) : source[0] ?? null;
    setQueue(source);

    const remainingDelay = Math.max(0, 430 - (Date.now() - startedAt));
    if (remainingDelay) {
      await new Promise((resolve) => setTimeout(resolve, remainingDelay));
    }

    // 换一家 keeps the art mounted so it collapses into the sparse dark
    // field and reveals the new store band by band.
    setCurrent(result);
    setIsDrawing(false);
  }

  async function confirm() {
    if (!current) return;
    const updated = addHistory(current.store, history);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    await writeHistoryFile(updated);
    onHistoryChange(updated);
    setSaved(true);
  }

  return (
    <Shell>
      <Header onBack={onBack} right={kind === "food" ? "食" : "饮"} />
      <View style={styles.drawHeading}>
        <Text style={styles.drawKicker}>{kind === "food" ? "MEAL MODE" : "DRINK MODE"}</Text>
        <Text style={styles.drawPageTitle}>{kind === "food" ? "今天吃这家" : "今天喝这家"}</Text>
      </View>
      <ResultPanel current={current} isDrawing={isDrawing} kind={kind} />
      {!current ? (
        <Pressable disabled={isDrawing} onPress={() => draw(false)} style={({ pressed }) => [styles.drawButton, pressed && styles.pressed]}>
          <Text style={styles.drawBracket}>[</Text>
          <Text style={styles.drawLabel}>{isDrawing ? "正在抽取" : "开始抽取"}</Text>
          <Text style={styles.drawBracket}>]</Text>
        </Pressable>
      ) : (
        <View style={styles.actionRow}>
          <Pressable onPress={() => draw(true)} style={({ pressed }) => [styles.secondaryAction, pressed && styles.pressed]}><Text style={styles.secondaryActionText}>&lt;&lt; 换一家</Text></Pressable>
          <Pressable disabled={saved} onPress={confirm} style={({ pressed }) => [styles.primaryAction, saved && styles.disabled, pressed && styles.pressed]}><Text style={styles.primaryActionText}>{saved ? "√ 已加入记录" : "[ 就这家 ]"}</Text></Pressable>
        </View>
      )}
    </Shell>
  );
}
