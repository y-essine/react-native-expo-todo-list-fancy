import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useMemo } from "react";
import { Platform, View, ViewStyle } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

type FancyViewProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  darkMode?: boolean;
  variant?: "default" | "warm" | "cool" | "electric";
  enableAnimations?: boolean;
  intensity?: "low" | "medium" | "high";
};

export const FancyView = ({
  children,
  style,
  darkMode = false,
  variant = "default",
  enableAnimations = Platform.OS !== "android",
  intensity = "medium",
}: FancyViewProps) => {
  // Animation values for multiple light points
  const lightPoint1X = useSharedValue(0);
  const lightPoint1Y = useSharedValue(0);
  const lightPoint2X = useSharedValue(0);
  const lightPoint2Y = useSharedValue(0);
  const lightPoint3X = useSharedValue(0);
  const lightPoint3Y = useSharedValue(0);
  const rotation = useSharedValue(0);

  // Animation parameters based on intensity
  const animationParams = useMemo(() => {
    const baseParams = {
      low: {
        radius1: 200,
        radius2: 180,
        radius3: 160,
        xDur1: 6000,
        yDur1: 4500,
        xDur2: 7000,
        yDur2: 5500,
        xDur3: 8000,
        yDur3: 6000,
        rotationSpeed: 20000,
      },
      medium: {
        radius1: 300,
        radius2: 260,
        radius3: 220,
        xDur1: 8000,
        yDur1: 6000,
        xDur2: 10000,
        yDur2: 7000,
        xDur3: 12000,
        yDur3: 8500,
        rotationSpeed: 25000,
      },
      high: {
        radius1: 400,
        radius2: 350,
        radius3: 300,
        xDur1: 10000,
        yDur1: 7500,
        xDur2: 12000,
        yDur2: 9000,
        xDur3: 15000,
        yDur3: 11000,
        rotationSpeed: 30000,
      },
    };

    const params = baseParams[intensity];

    return {
      point1: {
        radius: params.radius1,
        xDuration: params.xDur1,
        yDuration: params.yDur1,
        xRange: [10, 90] as [number, number],
        yRange: [20, 80] as [number, number],
        rotationSpeed: params.rotationSpeed,
      },
      point2: {
        radius: params.radius2,
        xDuration: params.xDur2,
        yDuration: params.yDur2,
        xRange: [80, 20] as [number, number],
        yRange: [10, 70] as [number, number],
        rotationSpeed: params.rotationSpeed * 1.2,
      },
      point3: {
        radius: params.radius3,
        xDuration: params.xDur3,
        yDuration: params.yDur3,
        xRange: [30, 70] as [number, number],
        yRange: [60, 30] as [number, number],
        rotationSpeed: params.rotationSpeed * 0.8,
      },
    };
  }, [intensity]);
  // Color schemes for different variants
  const colorSchemes = {
    default: {
      light1: [
        "rgba(20, 184, 166, 0.6)", // teal-500
        "rgba(45, 212, 191, 0.5)", // teal-400
        "rgba(94, 234, 212, 0.3)", // teal-300
        "rgba(153, 246, 228, 0.15)", // teal-200
      ] as const,
      light2: [
        "rgba(147, 51, 234, 0.6)", // purple-600
        "rgba(168, 85, 247, 0.5)", // purple-500
        "rgba(196, 181, 253, 0.3)", // purple-300
        "rgba(221, 214, 254, 0.15)", // purple-200
      ] as const,
      light3: [
        "rgba(59, 130, 246, 0.6)", // blue-500
        "rgba(96, 165, 250, 0.5)", // blue-400
        "rgba(147, 197, 253, 0.3)", // blue-300
        "rgba(191, 219, 254, 0.15)", // blue-200
      ] as const,
    },
    warm: {
      light1: [
        "rgba(251, 146, 60, 0.6)", // orange-400
        "rgba(253, 186, 116, 0.5)", // orange-300
        "rgba(254, 215, 170, 0.3)", // orange-200
        "rgba(255, 237, 213, 0.15)", // orange-100
      ] as const,
      light2: [
        "rgba(244, 63, 94, 0.6)", // rose-500
        "rgba(251, 113, 133, 0.5)", // rose-400
        "rgba(253, 164, 175, 0.3)", // rose-300
        "rgba(254, 205, 211, 0.15)", // rose-200
      ] as const,
      light3: [
        "rgba(245, 158, 11, 0.6)", // amber-500
        "rgba(251, 191, 36, 0.5)", // amber-400
        "rgba(252, 211, 77, 0.3)", // amber-300
        "rgba(253, 230, 138, 0.15)", // amber-200
      ] as const,
    },
    cool: {
      light1: [
        "rgba(59, 130, 246, 0.6)", // blue-500
        "rgba(96, 165, 250, 0.5)", // blue-400
        "rgba(147, 197, 253, 0.3)", // blue-300
        "rgba(191, 219, 254, 0.15)", // blue-200
      ] as const,
      light2: [
        "rgba(16, 185, 129, 0.6)", // emerald-500
        "rgba(52, 211, 153, 0.5)", // emerald-400
        "rgba(110, 231, 183, 0.3)", // emerald-300
        "rgba(167, 243, 208, 0.15)", // emerald-200
      ] as const,
      light3: [
        "rgba(14, 165, 233, 0.6)", // sky-500
        "rgba(56, 189, 248, 0.5)", // sky-400
        "rgba(125, 211, 252, 0.3)", // sky-300
        "rgba(186, 230, 253, 0.15)", // sky-200
      ] as const,
    },
    electric: {
      light1: [
        "rgba(236, 72, 153, 0.6)", // pink-500
        "rgba(244, 114, 182, 0.5)", // pink-400
        "rgba(249, 168, 212, 0.3)", // pink-300
        "rgba(252, 207, 227, 0.15)", // pink-200
      ] as const,
      light2: [
        "rgba(139, 92, 246, 0.6)", // violet-500
        "rgba(167, 139, 250, 0.5)", // violet-400
        "rgba(196, 181, 253, 0.3)", // violet-300
        "rgba(221, 214, 254, 0.15)", // violet-200
      ] as const,
      light3: [
        "rgba(217, 70, 239, 0.6)", // fuchsia-500
        "rgba(232, 121, 249, 0.5)", // fuchsia-400
        "rgba(240, 171, 252, 0.3)", // fuchsia-300
        "rgba(249, 200, 255, 0.15)", // fuchsia-200
      ] as const,
    },
  };

  const currentScheme = colorSchemes[variant];

  useEffect(() => {
    // Only start animations if enabled
    if (!enableAnimations) return;

    // Start animations for all light points
    lightPoint1X.value = withRepeat(
      withTiming(1, {
        duration: animationParams.point1.xDuration,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
    lightPoint1Y.value = withRepeat(
      withTiming(1, {
        duration: animationParams.point1.yDuration,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    lightPoint2X.value = withRepeat(
      withTiming(1, {
        duration: animationParams.point2.xDuration,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
    lightPoint2Y.value = withRepeat(
      withTiming(1, {
        duration: animationParams.point2.yDuration,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    lightPoint3X.value = withRepeat(
      withTiming(1, {
        duration: animationParams.point3.xDuration,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
    lightPoint3Y.value = withRepeat(
      withTiming(1, {
        duration: animationParams.point3.yDuration,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    rotation.value = withRepeat(
      withTiming(360, {
        duration: animationParams.point1.rotationSpeed,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, [animationParams, enableAnimations]);

  // Animated styles for the light points
  const lightPoint1Style = useAnimatedStyle(() => {
    if (!enableAnimations) {
      return {
        position: "absolute",
        width: animationParams.point1.radius,
        height: animationParams.point1.radius,
        borderRadius: animationParams.point1.radius / 2,
        left: "20%",
        top: "30%",
        transform: [
          { translateX: -animationParams.point1.radius / 2 },
          { translateY: -animationParams.point1.radius / 2 },
        ],
      };
    }

    const x = interpolate(
      lightPoint1X.value,
      [0, 1],
      animationParams.point1.xRange
    );
    const y = interpolate(
      lightPoint1Y.value,
      [0, 1],
      animationParams.point1.yRange
    );

    return {
      position: "absolute",
      width: animationParams.point1.radius,
      height: animationParams.point1.radius,
      borderRadius: animationParams.point1.radius / 2,
      left: `${x}%`,
      top: `${y}%`,
      transform: [
        { translateX: -animationParams.point1.radius / 2 },
        { translateY: -animationParams.point1.radius / 2 },
        { rotate: `${rotation.value}deg` },
      ],
    };
  });

  const lightPoint2Style = useAnimatedStyle(() => {
    if (!enableAnimations) {
      return {
        position: "absolute",
        width: animationParams.point2.radius,
        height: animationParams.point2.radius,
        borderRadius: animationParams.point2.radius / 2,
        left: "70%",
        top: "60%",
        transform: [
          { translateX: -animationParams.point2.radius / 2 },
          { translateY: -animationParams.point2.radius / 2 },
        ],
      };
    }

    const x = interpolate(
      lightPoint2X.value,
      [0, 1],
      animationParams.point2.xRange
    );
    const y = interpolate(
      lightPoint2Y.value,
      [0, 1],
      animationParams.point2.yRange
    );

    return {
      position: "absolute",
      width: animationParams.point2.radius,
      height: animationParams.point2.radius,
      borderRadius: animationParams.point2.radius / 2,
      left: `${x}%`,
      top: `${y}%`,
      transform: [
        { translateX: -animationParams.point2.radius / 2 },
        { translateY: -animationParams.point2.radius / 2 },
        { rotate: `${-rotation.value * 0.7}deg` },
      ],
    };
  });

  const lightPoint3Style = useAnimatedStyle(() => {
    if (!enableAnimations) {
      return {
        position: "absolute",
        width: animationParams.point3.radius,
        height: animationParams.point3.radius,
        borderRadius: animationParams.point3.radius / 2,
        left: "50%",
        top: "20%",
        transform: [
          { translateX: -animationParams.point3.radius / 2 },
          { translateY: -animationParams.point3.radius / 2 },
        ],
      };
    }

    const x = interpolate(
      lightPoint3X.value,
      [0, 1],
      animationParams.point3.xRange
    );
    const y = interpolate(
      lightPoint3Y.value,
      [0, 1],
      animationParams.point3.yRange
    );

    return {
      position: "absolute",
      width: animationParams.point3.radius,
      height: animationParams.point3.radius,
      borderRadius: animationParams.point3.radius / 2,
      left: `${x}%`,
      top: `${y}%`,
      transform: [
        { translateX: -animationParams.point3.radius / 2 },
        { translateY: -animationParams.point3.radius / 2 },
        { rotate: `${rotation.value * 0.5}deg` },
      ],
    };
  });
  return (
    <View style={[{ flex: 1 }, style]}>
      {/* Blurred background with animated gradient blobs */}
      {/* Base background */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: darkMode ? "#0f172a" : "#f8fafc",
        }}
      >
        {/* First animated light point */}
        <Animated.View style={lightPoint1Style}>
          <LinearGradient
            colors={currentScheme.light1}
            style={{
              flex: 1,
              borderRadius: animationParams.point1.radius / 2,
            }}
          />
        </Animated.View>

        {/* Second animated light point */}
        <Animated.View style={lightPoint2Style}>
          <LinearGradient
            colors={currentScheme.light2}
            style={{
              flex: 1,
              borderRadius: animationParams.point2.radius / 2,
            }}
          />
        </Animated.View>

        {/* Third animated light point */}
        <Animated.View style={lightPoint3Style}>
          <LinearGradient
            colors={currentScheme.light3}
            style={{
              flex: 1,
              borderRadius: animationParams.point3.radius / 2,
            }}
          />
        </Animated.View>

        {/* Subtle overlay for depth */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: darkMode
              ? "rgba(15, 23, 42, 0.3)"
              : "rgba(248, 250, 252, 0.3)",
          }}
        />
      </View>

      <BlurView
        intensity={200}
        tint={darkMode ? "dark" : "light"}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      ></BlurView>

      {/* Content */}
      {children}
    </View>
  );
};
