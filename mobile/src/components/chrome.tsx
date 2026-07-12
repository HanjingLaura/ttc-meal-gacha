import type { AppView, MealHistory } from "@ttc-meal-gacha/core";
import { StatusBar } from "expo-status-bar";
import type { ReactNode } from "react";
import { Pressable, SafeAreaView, ScrollView, Text, useWindowDimensions, View } from "react-native";
import { formatTime } from "../history";
import type { StoreArtLayers } from "../store-art-assets";
import { styles } from "../styles";
import { palette } from "../theme";
import { AnimatedStoreArt } from "./AnimatedStoreArt";

export function Shell({ children }: { children: ReactNode }) {
  const { width } = useWindowDimensions();
  const padding = width < 360 ? 12 : 18;
  return (
    <SafeAreaView style={styles.app}>
      <StatusBar style="light" />
      <View pointerEvents="none" style={styles.vignette} />
      <ScrollView contentContainerStyle={[styles.scroll, { paddingHorizontal: padding }]}>
        <View style={[styles.rail, { maxWidth: 480 }]}>{children}</View>
      </ScrollView>
      <View pointerEvents="none" style={styles.texture} />
    </SafeAreaView>
  );
}

export function Header({ onBack, right = "sys" }: { onBack?: () => void; right?: string }) {
  return (
    <View style={styles.header}>
      <Pressable accessibilityLabel={onBack ? "返回" : "菜单"} onPress={onBack} style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
        <Text style={styles.iconText}>{onBack ? "<" : "::"}</Text>
      </Pressable>
      <Text style={styles.systemTitle}>TTC·MEAL·GACHA</Text>
      <View style={styles.iconButton}><Text style={styles.iconMark}>{right}</Text></View>
    </View>
  );
}

export function SectionTitle({ children, action }: { children: string; action?: string }) {
  return (
    <View style={styles.sectionHeading}>
      <Text style={styles.sectionPrefix}>&gt;</Text>
      <Text style={styles.sectionTitle}>{children}</Text>
      <View style={styles.leader} />
      {action ? <Text style={styles.sectionAction}>{action}</Text> : null}
    </View>
  );
}

export function CategoryButton({ art, color, label, meta, onPress, selected, sub }: { art: StoreArtLayers; color: string; label: string; meta: string; onPress: () => void; selected?: boolean; sub: string }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.modeRow, selected && { borderColor: color }, pressed && styles.pressed]}>
      <View style={styles.modeArt}>
        <AnimatedStoreArt layers={art} storeKey={`mode-${sub}`} />
      </View>
      <View style={styles.modeTitleRow}>
        <Text style={[styles.modeMark, { color: selected ? color : palette.goldDim }]}>{selected ? "[●]" : "[ ]"}</Text>
        <Text style={[styles.modeLabel, { color: selected ? color : palette.paper }]}>{label}</Text>
      </View>
      <Text style={styles.modeSub}>{sub}</Text>
      <Text style={styles.modeMeta}>{meta}</Text>
    </Pressable>
  );
}

export function StoreRows({ history, onOpen }: { history: MealHistory[]; onOpen: () => void }) {
  const rows = history.slice(0, 3).map((item) => ({ id: item.id, name: item.storeName, meta: formatTime(item.createdAt), kind: item.kind }));

  return (
    <View style={styles.recentBlock}>
      <SectionTitle action={rows.length ? "查看全部 >>" : undefined}>最近抽取</SectionTitle>
      {rows.length ? (
        rows.map((row, index) => (
          <Pressable key={row.id} onPress={onOpen} style={({ pressed }) => [styles.storeRow, pressed && styles.pressed]}>
            <Text style={[styles.storeGlyph, { color: index === 0 ? palette.coral : palette.goldDim }]}>{`${index + 1}`.padStart(2, "0")}</Text>
            <Text numberOfLines={1} style={styles.storeRowName}>{row.name}</Text>
            <View style={styles.leader} />
            <Text style={styles.storeRowMeta}>{row.meta}</Text>
          </Pressable>
        ))
      ) : (
        <View style={styles.recentEmpty}>
          <Text style={styles.recentEmptyText}>-- 暂无记录 --</Text>
        </View>
      )}
    </View>
  );
}

export function BottomNav({ active, onHome, onHistory }: { active: AppView; onHome: () => void; onHistory: () => void }) {
  return (
    <View style={styles.bottomNav}>
      <Pressable onPress={onHome} style={styles.navItem}>
        <Text style={[styles.navLabel, active === "home" && styles.navActive]}>{active === "home" ? "[ 抽一抽 ]" : "抽一抽"}</Text>
      </Pressable>
      <Text style={styles.navDivider}>|</Text>
      <Pressable onPress={onHistory} style={styles.navItem}>
        <Text style={[styles.navLabel, active === "history" && styles.navActive]}>{active === "history" ? "[ 记录 ]" : "记录"}</Text>
      </Pressable>
    </View>
  );
}
