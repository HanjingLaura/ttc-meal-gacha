import { useEffect, useMemo, useRef, useState } from "react";
import { AccessibilityInfo, Animated, Easing, Image, Platform, View } from "react-native";
import grainFrame0 from "../../assets/store-art/grain-0.png";
import grainFrame1 from "../../assets/store-art/grain-1.png";
import grainFrame2 from "../../assets/store-art/grain-2.png";
import dustTexture from "../../assets/store-art/dust.png";
import type { StoreArtLayers } from "../store-art-assets";
import { styles } from "../styles";

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((value) => setReduced((prev) => prev || value));
    const subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduced);

    // react-native-web stubs AccessibilityInfo, so also watch the CSS media
    // query when running in a browser.
    if (Platform.OS === "web" && typeof window !== "undefined" && "matchMedia" in window) {
      const query = window.matchMedia("(prefers-reduced-motion: reduce)");
      const onChange = () => setReduced(query.matches);
      onChange();
      query.addEventListener("change", onChange);
      return () => {
        subscription.remove();
        query.removeEventListener("change", onChange);
      };
    }
    return () => subscription.remove();
  }, []);

  return reduced;
}

const BAND_COUNT = 6;
const MOTION_SCALE = 2;
const slow = (duration: number) => duration * MOTION_SCALE;
// One full loop is ~18s, with every motion running at half the previous speed.
const LOOP_BEATS = [820, 930, 790, 970, 850, 900, 780, 950, 830, 1180].map(slow);
// Dark beats keep readable structure — per-band residue, never a blackout.
const BAND_DARK = [0.3, 0.52, 0.36, 0.58, 0.32, 0.46];
const BAND_BRIGHT = [1, 0.95, 1, 0.92, 0.98, 1];

const grainFrames = [grainFrame0, grainFrame1, grainFrame2] as const;

export function AnimatedStoreArt({ layers, storeKey }: { layers: StoreArtLayers; storeKey: string }) {
  const reducedMotion = useReducedMotion();
  const [size, setSize] = useState(0);
  const [shown, setShown] = useState({ key: storeKey, layers });
  const sparseOpacity = useRef(new Animated.Value(0.95)).current;
  const glowOpacity = useRef(new Animated.Value(0.12)).current;
  const ghostOpacity = useRef(new Animated.Value(0)).current;
  const breathe = useRef(new Animated.Value(0)).current;
  const bandOpacity = useRef(BAND_DARK.map((value) => new Animated.Value(value))).current;
  const grainStep = useRef(new Animated.Value(0)).current;
  const dustOpacity = useRef(new Animated.Value(0)).current;
  const running = useRef<Animated.CompositeAnimation[]>([]);

  const allValues = useMemo(
    () => [sparseOpacity, glowOpacity, ghostOpacity, breathe, grainStep, dustOpacity, ...bandOpacity],
    [bandOpacity, breathe, dustOpacity, ghostOpacity, glowOpacity, grainStep, sparseOpacity]
  );

  function stopAll() {
    running.current.forEach((animation) => animation.stop());
    running.current = [];
    allValues.forEach((value) => value.stopAnimation());
  }

  function toDark(duration: number) {
    // Dark beat keeps residue: sparse skeleton up, a few bands linger,
    // ghost afterimage trails behind the fading glow.
    return Animated.parallel([
      Animated.timing(sparseOpacity, { toValue: 0.9, duration, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      Animated.sequence([
        Animated.delay(slow(90)),
        Animated.timing(glowOpacity, { toValue: 0.3, duration: Math.max(slow(160), duration - slow(90)), easing: Easing.out(Easing.quad), useNativeDriver: true })
      ]),
      Animated.sequence([
        Animated.delay(slow(120)),
        Animated.timing(ghostOpacity, { toValue: 0.3, duration: Math.max(slow(160), duration - slow(120)), easing: Easing.out(Easing.quad), useNativeDriver: true })
      ]),
      ...bandOpacity.map((value, index) =>
        Animated.sequence([
          Animated.delay(slow(index * 48)),
          Animated.timing(value, { toValue: BAND_DARK[index], duration: Math.max(slow(240), duration - slow(index * 48)), easing: Easing.inOut(Easing.quad), useNativeDriver: true })
        ])
      )
    ]);
  }

  function toBright(duration: number) {
    return Animated.parallel([
      Animated.timing(sparseOpacity, { toValue: 0.2, duration, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      Animated.sequence([
        Animated.delay(slow(70)),
        Animated.timing(glowOpacity, { toValue: 0.75, duration: Math.max(slow(180), duration - slow(70)), easing: Easing.out(Easing.quad), useNativeDriver: true })
      ]),
      Animated.sequence([
        Animated.delay(slow(110)),
        Animated.timing(ghostOpacity, { toValue: 0.12, duration: Math.max(slow(160), duration - slow(110)), easing: Easing.out(Easing.quad), useNativeDriver: true })
      ]),
      ...bandOpacity.map((value, index) =>
        Animated.sequence([
          Animated.delay(slow(index * 48)),
          Animated.timing(value, { toValue: BAND_BRIGHT[index], duration: Math.max(slow(240), duration - slow(index * 48)), easing: Easing.inOut(Easing.quad), useNativeDriver: true })
        ])
      )
    ]);
  }

  function startLoops() {
    const beats = LOOP_BEATS.map((duration, index) => (index % 2 === 0 ? toBright(duration) : toDark(duration)));
    const flicker = Animated.loop(Animated.sequence(beats));
    const breathing = Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, { toValue: 1, duration: slow(3200), easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(breathe, { toValue: -0.65, duration: slow(2900), easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(breathe, { toValue: 0, duration: slow(3200), easing: Easing.inOut(Easing.sin), useNativeDriver: true })
      ])
    );
    const grain = Animated.loop(
      Animated.sequence([
        Animated.timing(grainStep, { toValue: 1, duration: slow(210), easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(grainStep, { toValue: 2, duration: slow(230), easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(grainStep, { toValue: 0, duration: slow(220), easing: Easing.linear, useNativeDriver: true })
      ])
    );
    const dust = Animated.loop(
      Animated.sequence([
        Animated.delay(slow(3100)),
        Animated.timing(dustOpacity, { toValue: 0.5, duration: slow(130), easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(dustOpacity, { toValue: 0, duration: slow(330), easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.delay(slow(1900)),
        Animated.timing(dustOpacity, { toValue: 0.32, duration: slow(110), easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(dustOpacity, { toValue: 0, duration: slow(280), easing: Easing.out(Easing.quad), useNativeDriver: true })
      ])
    );
    running.current = [flicker, breathing, grain, dust];
    running.current.forEach((animation) => animation.start());
  }

  useEffect(() => {
    if (reducedMotion) {
      stopAll();
      sparseOpacity.setValue(0);
      glowOpacity.setValue(0.34);
      ghostOpacity.setValue(0);
      breathe.setValue(0);
      grainStep.setValue(0);
      dustOpacity.setValue(0);
      bandOpacity.forEach((value) => value.setValue(1));
      setShown({ key: storeKey, layers });
      return stopAll;
    }

    if (storeKey === shown.key) {
      // Initial mount (or same store re-render): reveal from dark, then loop.
      stopAll();
      toBright(slow(1000)).start(({ finished }) => finished && startLoops());
      return stopAll;
    }

    // Store switched (draw / re-draw): collapse into the sparse dark field,
    // swap sources, then reveal the new artwork band by band.
    stopAll();
    toDark(slow(680)).start(({ finished }) => {
      if (!finished) return;
      setShown({ key: storeKey, layers });
      toBright(slow(1040)).start((result) => result.finished && startLoops());
    });
    return stopAll;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeKey, reducedMotion]);

  const transform = {
    transform: [
      { scale: breathe.interpolate({ inputRange: [-1, 1], outputRange: [0.996, 1.008] }) },
      { translateY: breathe.interpolate({ inputRange: [-1, 1], outputRange: [1.5, -1.5] }) }
    ]
  };

  const active = shown.layers;
  return (
    <Animated.View
      accessibilityIgnoresInvertColors
      onLayout={(event) => setSize(event.nativeEvent.layout.width)}
      style={[styles.animatedArt, transform]}
    >
      <Animated.Image
        source={active.glow}
        resizeMode="contain"
        style={[styles.artLayer, { opacity: ghostOpacity, transform: [{ translateX: 4 }, { translateY: -2 }] }]}
      />
      <Animated.Image source={active.glow} resizeMode="contain" style={[styles.artLayer, { opacity: glowOpacity }]} />
      <Animated.Image source={active.sparse} resizeMode="contain" style={[styles.artLayer, { opacity: sparseOpacity }]} />
      {size > 0
        ? bandOpacity.map((opacity, index) => (
            <Animated.View
              key={index}
              style={[styles.artBand, { height: size / BAND_COUNT, top: (size / BAND_COUNT) * index, opacity }]}
            >
              <Image
                source={active.dense}
                resizeMode="contain"
                style={{ position: "absolute", width: size, height: size, top: -(size / BAND_COUNT) * index, left: 0 }}
              />
            </Animated.View>
          ))
        : null}
      {grainFrames.map((frame, index) => (
        <Animated.Image
          key={index}
          source={frame}
          resizeMode="repeat"
          style={[
            styles.artLayer,
            {
              opacity: reducedMotion
                ? index === 0
                  ? 0.1
                  : 0
                : grainStep.interpolate({
                    inputRange: [0, 0.5, 1, 1.5, 2],
                    outputRange: index === 0 ? [0.18, 0.03, 0, 0.03, 0] : index === 1 ? [0, 0.1, 0.18, 0.03, 0] : [0, 0.03, 0, 0.1, 0.18]
                  })
            }
          ]}
        />
      ))}
      <Animated.Image
        source={dustTexture}
        resizeMode="repeat"
        style={[styles.artLayer, { opacity: dustOpacity, transform: [{ translateX: 7 }, { translateY: 3 }] }]}
      />
      <View pointerEvents="none" style={styles.artVignette} />
    </Animated.View>
  );
}
