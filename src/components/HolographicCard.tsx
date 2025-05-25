import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { createBoxShadow } from "../utils/shadow";

type HolographicCardProps = {
  children: React.ReactNode;
  style?: any;
  darkMode?: boolean;
  intensity?: "low" | "medium" | "high";
  animated?: boolean;
  hue?: "rainbow" | "blue" | "purple" | "green" | "orange" | "pink";
};

export const HolographicCard = ({
  children,
  style,
  darkMode = false,
  intensity = "medium",
  animated = true,
  hue = "rainbow",
}: HolographicCardProps) => {
  const hologramAnimation = useSharedValue(0);
  const shimmerAnimation = useSharedValue(0);
  const borderAnimation = useSharedValue(0);

  // Color schemes for different hues
  const hueSchemes = {
    rainbow: [
      "rgba(255, 0, 150, 0.3)",
      "rgba(0, 255, 255, 0.3)",
      "rgba(255, 255, 0, 0.3)",
      "rgba(150, 0, 255, 0.3)",
      "rgba(255, 100, 0, 0.3)",
    ],
    blue: [
      "rgba(59, 130, 246, 0.4)",
      "rgba(147, 197, 253, 0.3)",
      "rgba(191, 219, 254, 0.2)",
      "rgba(96, 165, 250, 0.3)",
    ],
    purple: [
      "rgba(139, 92, 246, 0.4)",
      "rgba(196, 181, 253, 0.3)",
      "rgba(221, 214, 254, 0.2)",
      "rgba(167, 139, 250, 0.3)",
    ],
    green: [
      "rgba(16, 185, 129, 0.4)",
      "rgba(110, 231, 183, 0.3)",
      "rgba(167, 243, 208, 0.2)",
      "rgba(52, 211, 153, 0.3)",
    ],
    orange: [
      "rgba(251, 146, 60, 0.4)",
      "rgba(253, 186, 116, 0.3)",
      "rgba(254, 215, 170, 0.2)",
      "rgba(249, 115, 22, 0.3)",
    ],
    pink: [
      "rgba(236, 72, 153, 0.4)",
      "rgba(249, 168, 212, 0.3)",
      "rgba(252, 207, 227, 0.2)",
      "rgba(244, 114, 182, 0.3)",
    ],
  };

  const intensityConfig = {
    low: { blurIntensity: 40, opacity: 0.6, animationDuration: 8000 },
    medium: { blurIntensity: 60, opacity: 0.8, animationDuration: 6000 },
    high: { blurIntensity: 80, opacity: 1, animationDuration: 4000 },
  };

  const currentIntensity = intensityConfig[intensity];
  const currentColors = hueSchemes[hue];

  useEffect(() => {
    if (animated) {
      hologramAnimation.value = withRepeat(
        withTiming(1, {
          duration: currentIntensity.animationDuration,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      );

      shimmerAnimation.value = withRepeat(
        withTiming(1, {
          duration: currentIntensity.animationDuration * 0.7,
          easing: Easing.linear,
        }),
        -1,
        false
      );

      borderAnimation.value = withRepeat(
        withTiming(1, {
          duration: currentIntensity.animationDuration * 1.2,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      );
    }
  }, [animated, currentIntensity.animationDuration]);

  const hologramStyle = useAnimatedStyle(() => {
    if (!animated) return { opacity: currentIntensity.opacity };

    const colorIndex = Math.floor(
      interpolate(
        hologramAnimation.value,
        [0, 1],
        [0, currentColors.length - 1]
      )
    );

    return {
      opacity:
        currentIntensity.opacity *
        interpolate(hologramAnimation.value, [0, 0.5, 1], [0.6, 1, 0.6]),
    };
  });

  const shimmerStyle = useAnimatedStyle(() => {
    if (!animated) return { transform: [{ translateX: 0 }] };

    const translateX = interpolate(shimmerAnimation.value, [0, 1], [-100, 400]);

    return {
      transform: [{ translateX }],
    };
  });

  const borderStyle = useAnimatedStyle(() => {
    if (!animated) return { opacity: 0.6 };

    const opacity = interpolate(
      borderAnimation.value,
      [0, 0.5, 1],
      [0.3, 0.8, 0.3]
    );

    return {
      opacity,
    };
  });

  const theme = darkMode
    ? {
        background: "rgba(30, 41, 59, 0.4)",
        borderColor: "rgba(148, 163, 184, 0.2)",
      }
    : {
        background: "rgba(255, 255, 255, 0.6)",
        borderColor: "rgba(148, 163, 184, 0.3)",
      };

  return (
    <View style={[{ borderRadius: 24, overflow: "hidden" }, style]}>
      {/* Holographic background layer */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        {/* Multiple holographic layers for depth */}
        {currentColors.map((color, index) => (
          <Animated.View
            key={index}
            style={[
              {
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: color,
                opacity: 0.3,
              },
              hologramStyle,
            ]}
          />
        ))}

        {/* Shimmer effect */}
        <Animated.View
          style={[
            {
              position: "absolute",
              top: 0,
              bottom: 0,
              width: 100,
              left: -100,
            },
            shimmerStyle,
          ]}
        >
          <LinearGradient
            colors={[
              "transparent",
              darkMode
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(255, 255, 255, 0.3)",
              "transparent",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          />
        </Animated.View>

        {/* Animated border highlight */}
        <Animated.View
          style={[
            {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 24,
              borderWidth: 1,
              borderColor: currentColors[0],
            },
            borderStyle,
          ]}
        />
      </View>

      {/* Main content with blur */}
      <BlurView
        intensity={currentIntensity.blurIntensity}
        tint={darkMode ? "dark" : "light"}
        style={{ borderRadius: 24 }}
      >
        <View
          style={{
            backgroundColor: theme.background,
            borderRadius: 24,
            borderWidth: 1,
            borderColor: theme.borderColor,
            padding: 20,
            boxShadow: darkMode
              ? createBoxShadow("rgba(0, 0, 0, 0.3)", 0, 4, 12)
              : createBoxShadow("rgba(139, 92, 246, 0.3)", 0, 4, 12),
            elevation: 8,
          }}
        >
          {children}
        </View>
      </BlurView>
    </View>
  );
};
