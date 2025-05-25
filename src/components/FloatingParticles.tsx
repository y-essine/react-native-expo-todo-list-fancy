import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useMemo } from "react";
import { Dimensions, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

type FloatingParticlesProps = {
  darkMode?: boolean;
  particleCount?: number;
  intensity?: "low" | "medium" | "high";
};

const FloatingParticle = ({
  size,
  delay,
  darkMode,
  colors,
  startX,
  startY,
  endX,
  endY,
  duration,
}: {
  size: number;
  delay: number;
  darkMode: boolean;
  colors: string[];
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  duration: number;
}) => {
  const translateX = useSharedValue(startX);
  const translateY = useSharedValue(startY);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);

  useEffect(() => {
    // Start animation with delay
    opacity.value = withDelay(
      delay,
      withRepeat(
        withTiming(0.6, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      )
    );

    scale.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      )
    );

    translateX.value = withDelay(
      delay,
      withRepeat(
        withTiming(endX, { duration, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      )
    );

    translateY.value = withDelay(
      delay,
      withRepeat(
        withTiming(endY, {
          duration: duration * 1.2,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      )
    );
  }, [delay, endX, endY, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        animatedStyle,
      ]}
    >
      <LinearGradient
        colors={colors}
        style={{
          flex: 1,
          borderRadius: size / 2,
        }}
      />
    </Animated.View>
  );
};

export const FloatingParticles = ({
  darkMode = false,
  particleCount = 8,
  intensity = "medium",
}: FloatingParticlesProps) => {
  const particles = useMemo(() => {
    const intensityConfig = {
      low: {
        sizeRange: [8, 16],
        opacityRange: [0.1, 0.3],
        durationRange: [8000, 12000],
      },
      medium: {
        sizeRange: [12, 24],
        opacityRange: [0.15, 0.4],
        durationRange: [10000, 15000],
      },
      high: {
        sizeRange: [16, 32],
        opacityRange: [0.2, 0.5],
        durationRange: [12000, 18000],
      },
    };

    const config = intensityConfig[intensity];

    const colorSchemes = darkMode
      ? [
          [
            "rgba(139, 92, 246, 0.2)",
            "rgba(139, 92, 246, 0.05)",
            "transparent",
          ],
          [
            "rgba(59, 130, 246, 0.2)",
            "rgba(59, 130, 246, 0.05)",
            "transparent",
          ],
          [
            "rgba(16, 185, 129, 0.2)",
            "rgba(16, 185, 129, 0.05)",
            "transparent",
          ],
          [
            "rgba(251, 146, 60, 0.2)",
            "rgba(251, 146, 60, 0.05)",
            "transparent",
          ],
          ["rgba(244, 63, 94, 0.2)", "rgba(244, 63, 94, 0.05)", "transparent"],
        ]
      : [
          ["rgba(139, 92, 246, 0.3)", "rgba(139, 92, 246, 0.1)", "transparent"],
          ["rgba(59, 130, 246, 0.3)", "rgba(59, 130, 246, 0.1)", "transparent"],
          ["rgba(16, 185, 129, 0.3)", "rgba(16, 185, 129, 0.1)", "transparent"],
          ["rgba(251, 146, 60, 0.3)", "rgba(251, 146, 60, 0.1)", "transparent"],
          ["rgba(244, 63, 94, 0.3)", "rgba(244, 63, 94, 0.1)", "transparent"],
        ];

    return Array.from({ length: particleCount }, (_, i) => {
      const size =
        config.sizeRange[0] +
        Math.random() * (config.sizeRange[1] - config.sizeRange[0]);
      const startX = Math.random() * screenWidth;
      const startY = Math.random() * screenHeight;
      const endX = Math.random() * screenWidth;
      const endY = Math.random() * screenHeight;
      const duration =
        config.durationRange[0] +
        Math.random() * (config.durationRange[1] - config.durationRange[0]);
      const delay = Math.random() * 3000;
      const colors =
        colorSchemes[Math.floor(Math.random() * colorSchemes.length)];

      return {
        id: i,
        size,
        startX,
        startY,
        endX,
        endY,
        duration,
        delay,
        colors,
      };
    });
  }, [darkMode, particleCount, intensity]);

  return (
    <View
      style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {particles.map((particle) => (
        <FloatingParticle
          key={particle.id}
          size={particle.size}
          delay={particle.delay}
          darkMode={darkMode}
          colors={particle.colors}
          startX={particle.startX}
          startY={particle.startY}
          endX={particle.endX}
          endY={particle.endY}
          duration={particle.duration}
        />
      ))}
    </View>
  );
};
