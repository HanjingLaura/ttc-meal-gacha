import type { MealHistory } from "@ttc-meal-gacha/core";
import { Pressable, Text, View } from "react-native";
import { AnimatedStoreArt } from "../components/AnimatedStoreArt";
import { BottomNav, Header, Shell } from "../components/chrome";
import { formatTime } from "../history";
import { styles } from "../styles";
import { palette } from "../theme";
import { uiArt } from "../ui-art-assets";

export function HistoryScreen({ history, onBack, onClear }: { history: MealHistory[]; onBack: () => void; onClear: () => void }) {
  return (
    <Shell>
      <Header onBack={onBack} right="记" />
      <View style={styles.drawHeading}><Text style={styles.drawKicker}>MEAL LOG</Text><Text style={styles.drawPageTitle}>抽取记录</Text></View>
      {history.length ? (
        <View style={styles.historyList}>
          {history.map((item, index) => (
            <View key={item.id} style={styles.historyRow}>
              <Text style={[styles.historyIndex, { color: item.kind === "food" ? palette.coral : palette.blue }]}>{`${index + 1}`.padStart(2, "0")}</Text>
              <View style={styles.historyCopy}><Text style={styles.historyName}>{item.storeName}</Text><Text style={styles.historyMeta}>{`${item.category} · ${formatTime(item.createdAt)}`}</Text></View>
            </View>
          ))}
          <Pressable onPress={onClear} style={styles.clearButton}><Text style={styles.clearText}>[ 清空记录 ]</Text></Pressable>
        </View>
      ) : (
        <View style={styles.resultPanel}>
          <Text style={styles.standbyLabel}>EMPTY LOG</Text>
          <View style={styles.emptyLogVisual}>
            <AnimatedStoreArt layers={uiArt.historyLog} storeKey="history-empty" />
          </View>
          <Text style={styles.waiting}>[ 还没有抽取记录 ]</Text>
        </View>
      )}
      <BottomNav active="history" onHome={onBack} onHistory={() => undefined} />
    </Shell>
  );
}
