import { Heading, Pressable, Text, View } from "@gluestack-ui/themed";
import {
  Canvas,
  Fill,
  Path,
  Text as SkiaText,
  useFont,
  useImage,
} from "@shopify/react-native-skia";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import {
  interpolate,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { createOnboardingPath } from "../utils/createOnboardingPath";

const GrainPage = () => {
  const { width, height } = Dimensions.get("window");
  const grain = useImage(require("../assets/images/paper2.jpg"));
  const font = useFont(require("../assets/fonts/kefir/Kefir-Bold.otf"), 80);

  // Animation shared values
  const animationProgress = useSharedValue(0);
  const [currentPath, setCurrentPath] = useState(() =>
    createOnboardingPath(width, height)
  );

  useEffect(() => {
    // Start the animation
    animationProgress.value = withRepeat(
      withTiming(1, { duration: 3000 }),
      -1,
      false
    );
  }, []);

  // Generate new random path when animation completes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPath(createOnboardingPath(width, height));
    }, 3000); // Generate new path every 3 seconds (matches animation duration)

    return () => clearInterval(interval);
  }, [width, height]);
  // Animated start and end values for path trimming
  const animatedStart = useDerivedValue(() => {
    return 0; // Always start from beginning
  });

  const animatedEnd = useDerivedValue(() => {
    return interpolate(animationProgress.value, [0, 1], [0, 1]);
  });

  if (!grain || !font) return null;

  return (
    <>
      <Canvas style={styles.canvas}>
        {/* === 1. Background Fill === */}
        <Fill color="#3C3549" />
        <Path
          path={currentPath}
          style="stroke"
          strokeWidth={4}
          color="#f8d057"
          start={animatedStart}
          end={animatedEnd}
        />
        <SkiaText x={40} y={156} text="Hello" font={font} color="#f8d057" />
        <SkiaText x={40} y={226} text="Skia!" font={font} color="#f8d057" />
      </Canvas>
      <View px="$6" py="$4" h={250} bg="$isabelline">
        <Pressable onPress={() => router.push("/main")}>
          <Heading size="3xl" bold>
            Path strokes
          </Heading>
        </Pressable>
        <Text>I'm just tryna make path strokes work here!</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
  },
});

export default GrainPage;
