import { stores, type DrawKind, type MealHistory } from "@ttc-meal-gacha/core";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { AnimatedStoreArt } from "../components/AnimatedStoreArt";
import { BottomNav, CategoryButton, Header, Shell, StoreRows } from "../components/chrome";
import type { StoreArtLayers } from "../store-art-assets";
import { styles } from "../styles";
import { palette } from "../theme";
import { uiArt } from "../ui-art-assets";

const heroLayers: Record<DrawKind, StoreArtLayers> = {
  food: uiArt.homeFeast,
  drink: uiArt.categoryDrink
};

export function HomeScreen({ history, onHistory, onStart }: { history: MealHistory[]; onHistory: () => void; onStart: (kind: DrawKind) => void }) {
  const [selected, setSelected] = useState<DrawKind>("food");
  const foodCount = stores.filter((store) => store.kind === "food").length;
  const drinkCount = stores.filter((store) => store.kind === "drink").length;

  return (
    <Shell>
      <Header />
      <View style={styles.hero}>
        <View style={styles.heroKickerRow}>
          <Text style={styles.heroKicker}>RANDOM PICKER</Text>
          <Text style={styles.heroCount}>{`${stores.length} STORES`}</Text>
        </View>
        <Text style={styles.heroTitle}>{selected === "food" ? "今天吃什么" : "今天喝什么"}</Text>
        <View style={styles.heroArtBox}>
          <AnimatedStoreArt layers={heroLayers[selected]} storeKey={`hero-${selected}`} />
        </View>
      </View>

      <Pressable onPress={() => onStart(selected)} style={({ pressed }) => [styles.drawButton, pressed && styles.pressed]}>
        <Text style={styles.drawBracket}>[</Text>
        <Text style={styles.drawLabel}>抽一个</Text>
        <Text style={styles.drawBracket}>]</Text>
      </Pressable>

      <View style={styles.modeList}>
        <CategoryButton art={uiArt.categoryFood} color={palette.coral} label="正餐" meta={`${foodCount} 家店`} selected={selected === "food"} sub="MEAL" onPress={() => setSelected("food")} />
        <CategoryButton art={uiArt.categoryDrink} color={palette.blue} label="饮料" meta={`${drinkCount} 家店`} selected={selected === "drink"} sub="DRINK" onPress={() => setSelected("drink")} />
      </View>

      <StoreRows history={history} onOpen={onHistory} />
      <BottomNav active="home" onHome={() => undefined} onHistory={onHistory} />
    </Shell>
  );
}
