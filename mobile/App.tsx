import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AppView, DrawKind, MealHistory } from "@ttc-meal-gacha/core";
import { useFonts } from "expo-font";
import { useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import arkPixelFont from "./assets/fonts/ark-pixel-10px-zh-cn.ttf";
import geistPixelFont from "./assets/fonts/GeistPixel-Square.ttf";
import { loadHistoryFile, writeHistoryFile } from "./src/api/history-client";
import { HISTORY_KEY, safeParseHistory } from "./src/history";
import { DrawScreen } from "./src/screens/DrawScreen";
import { HistoryScreen } from "./src/screens/HistoryScreen";
import { HomeScreen } from "./src/screens/HomeScreen";

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    ArkPixel: arkPixelFont,
    GeistPixel: geistPixelFont
  });
  const [view, setView] = useState<AppView>("home");
  const [kind, setKind] = useState<DrawKind>("food");
  const [history, setHistory] = useState<MealHistory[]>([]);

  useEffect(() => {
    let active = true;
    Promise.all([AsyncStorage.getItem(HISTORY_KEY), loadHistoryFile()]).then(([local, fileHistory]) => {
      if (!active) return;
      setHistory(fileHistory ?? safeParseHistory(local));
    });
    return () => { active = false; };
  }, []);
  const todayHistory = useMemo(() => history.filter((item) => new Date(item.createdAt).toDateString() === new Date().toDateString()), [history]);

  function startDraw(next: DrawKind) { setKind(next); setView("draw"); }
  function clearHistory() {
    Alert.alert("清空记录", "确定删除所有抽取记录吗？", [
      { text: "取消", style: "cancel" },
      { text: "清空", style: "destructive", onPress: async () => {
        await AsyncStorage.removeItem(HISTORY_KEY);
        await writeHistoryFile([]);
        setHistory([]);
      } }
    ]);
  }

  if (!fontsLoaded && !fontError) return null;
  if (fontError) throw fontError;

  if (view === "draw") return <DrawScreen history={history} kind={kind} onBack={() => setView("home")} onHistoryChange={setHistory} />;
  if (view === "history") return <HistoryScreen history={history} onBack={() => setView("home")} onClear={clearHistory} />;
  return <HomeScreen history={todayHistory.length ? todayHistory : history} onHistory={() => setView("history")} onStart={startDraw} />;
}
