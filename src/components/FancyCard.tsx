import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useMemo } from "react";
import { Platform, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { createBoxShadow } from "../utils/shadow";

type FancyCardProps = {
  children: React.ReactNode;
  style?: any;
  darkMode?: boolean;
  variant?: "default" | "warm" | "cool" | "electric";
  enableAnimations?: boolean; // Allow disabling animations for better performance
  useSimpleVersion?: boolean; // Use simple version without blur/animations for low-end devices
};

export const FancyCard = ({
  children,
  style,
  darkMode = false,
  variant = "default",
  enableAnimations = Platform.OS !== "android", // Disable animations on Android by default for better performance
  useSimpleVersion = false,
}: FancyCardProps) => {
  // Use simple version if requested
  if (useSimpleVersion) {
    return (
      <SimpleFancyCard
        children={children}
        style={style}
        darkMode={darkMode}
        variant={variant}
      />
    );
  }
  // Animation values for the two light points
  const lightPoint1X = useSharedValue(0);
  const lightPoint1Y = useSharedValue(0);
  const lightPoint2X = useSharedValue(0);
  const lightPoint2Y = useSharedValue(0);
  const rotation = useSharedValue(0);

  // Optimized animation parameters with smaller radii and faster durations
  const animationParams = useMemo(() => {
    // Use a simple hash based on variant and darkMode to pick variation
    const hashString = `${variant}-${darkMode}`;
    const hash = hashString.length % 4; // Simple hash to pick variation

    const variations = [
      {
        radius1: 180, // Reduced from 320
        radius2: 150, // Reduced from 280
        xDur1: 4000, // Reduced from 8000
        yDur1: 3000, // Reduced from 6000
        xDur2: 5000, // Reduced from 10000
        yDur2: 3500, // Reduced from 7000
      },
      {
        radius1: 200, // Reduced from 340
        radius2: 170, // Reduced from 300
        xDur1: 4500, // Reduced from 9000
        yDur1: 3500, // Reduced from 7000
        xDur2: 5500, // Reduced from 11000
        yDur2: 4000, // Reduced from 8000
      },
      {
        radius1: 220, // Reduced from 360
        radius2: 190, // Reduced from 320
        xDur1: 5000, // Reduced from 10000
        yDur1: 4000, // Reduced from 8000
        xDur2: 6000, // Reduced from 12000
        yDur2: 4500, // Reduced from 9000
      },
      {
        radius1: 240, // Reduced from 380
        radius2: 210, // Reduced from 340
        xDur1: 5500, // Reduced from 11000
        yDur1: 4500, // Reduced from 9000
        xDur2: 6500, // Reduced from 13000
        yDur2: 5000, // Reduced from 10000
      },
    ];

    const variation = variations[hash];

    return {
      point1: {
        radius: variation.radius1,
        xDuration: variation.xDur1,
        yDuration: variation.yDur1,
        xRange: [15, 85] as [number, number], // Reduced movement range
        yRange: [25, 75] as [number, number], // Reduced movement range
        rotationSpeed: 15000, // Reduced from 20000
      },
      point2: {
        radius: variation.radius2,
        xDuration: variation.xDur2,
        yDuration: variation.yDur2,
        xRange: [75, 25] as [number, number], // Reduced movement range
        yRange: [15, 65] as [number, number], // Reduced movement range
        rotationSpeed: 18000, // Reduced from 25000
      },
    };
  }, [variant, darkMode]);
  // Color schemes for different variants
  const colorSchemes = {
    default: {
      light1: [
        "rgba(20, 184, 166, 0.4)", // teal-500
        "rgba(45, 212, 191, 0.3)", // teal-400
        "rgba(94, 234, 212, 0.2)", // teal-300
        "rgba(153, 246, 228, 0.1)", // teal-200
      ] as const,
      light2: [
        "rgba(147, 51, 234, 0.4)", // purple-600
        "rgba(168, 85, 247, 0.3)", // purple-500
        "rgba(196, 181, 253, 0.2)", // purple-300
        "rgba(221, 214, 254, 0.1)", // purple-200
      ] as const,
    },
    warm: {
      light1: [
        "rgba(251, 146, 60, 0.4)", // orange-400
        "rgba(253, 186, 116, 0.3)", // orange-300
        "rgba(254, 215, 170, 0.2)", // orange-200
        "rgba(255, 237, 213, 0.1)", // orange-100
      ] as const,
      light2: [
        "rgba(244, 63, 94, 0.4)", // rose-500
        "rgba(251, 113, 133, 0.3)", // rose-400
        "rgba(253, 164, 175, 0.2)", // rose-300
        "rgba(254, 205, 211, 0.1)", // rose-200
      ] as const,
    },
    cool: {
      light1: [
        "rgba(59, 130, 246, 0.4)", // blue-500
        "rgba(96, 165, 250, 0.3)", // blue-400
        "rgba(147, 197, 253, 0.2)", // blue-300
        "rgba(191, 219, 254, 0.1)", // blue-200
      ] as const,
      light2: [
        "rgba(16, 185, 129, 0.4)", // emerald-500
        "rgba(52, 211, 153, 0.3)", // emerald-400
        "rgba(110, 231, 183, 0.2)", // emerald-300
        "rgba(167, 243, 208, 0.1)", // emerald-200
      ] as const,
    },
    electric: {
      light1: [
        "rgba(236, 72, 153, 0.4)", // pink-500
        "rgba(244, 114, 182, 0.3)", // pink-400
        "rgba(249, 168, 212, 0.2)", // pink-300
        "rgba(252, 207, 227, 0.1)", // pink-200
      ] as const,
      light2: [
        "rgba(139, 92, 246, 0.4)", // violet-500
        "rgba(167, 139, 250, 0.3)", // violet-400
        "rgba(196, 181, 253, 0.2)", // violet-300
        "rgba(221, 214, 254, 0.1)", // violet-200
      ] as const,
    },
  };
  // Simplified grain pattern with fewer dots for better performance
  const grainPattern = useMemo(() => {
    // Reduced number of grain dots from 15 to 8
    const positions = [
      { left: 20, top: 30, opacity: 0.15 },
      { left: 50, top: 65, opacity: 0.1 },
      { left: 80, top: 25, opacity: 0.2 },
      { left: 30, top: 75, opacity: 0.1 },
      { left: 70, top: 45, opacity: 0.15 },
      { left: 15, top: 60, opacity: 0.1 },
      { left: 85, top: 70, opacity: 0.15 },
      { left: 60, top: 15, opacity: 0.2 },
    ];
    return positions.map((pos, i) => ({ key: i, ...pos }));
  }, []);

  const currentScheme = colorSchemes[variant];
  useEffect(() => {
    // Only start animations if enabled
    if (!enableAnimations) return;

    // Start animations with optimized parameters
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

    rotation.value = withRepeat(
      withTiming(360, {
        duration: animationParams.point1.rotationSpeed,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, [animationParams, enableAnimations]);
  // Animated styles for the light points with conditional animation
  const lightPoint1Style = useAnimatedStyle(() => {
    if (!enableAnimations) {
      // Static positioning when animations are disabled
      return {
        position: "absolute",
        width: animationParams.point1.radius,
        height: animationParams.point1.radius,
        borderRadius: animationParams.point1.radius / 2,
        left: "50%",
        top: "50%",
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
      // Static positioning when animations are disabled
      return {
        position: "absolute",
        width: animationParams.point2.radius,
        height: animationParams.point2.radius,
        borderRadius: animationParams.point2.radius / 2,
        left: "30%",
        top: "70%",
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

  return (
    <View style={[{ borderRadius: 24, overflow: "hidden" }, style]}>
      {/* Background with light points */}
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
        {/* First animated light point - Dynamic gradient */}
        <Animated.View style={lightPoint1Style}>
          <LinearGradient
            colors={currentScheme.light1}
            style={{
              flex: 1,
              borderRadius: animationParams.point1.radius / 2,
            }}
          />
        </Animated.View>

        {/* Second animated light point - Dynamic gradient */}
        <Animated.View style={lightPoint2Style}>
          <LinearGradient
            colors={currentScheme.light2}
            style={{
              flex: 1,
              borderRadius: animationParams.point2.radius / 2,
            }}
          />
        </Animated.View>

        {/* Grainy noise overlay - using a pattern to simulate grain */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: darkMode
              ? "rgba(15, 23, 42, 0.2)"
              : "rgba(248, 250, 252, 0.2)",
            opacity: 0.6,
          }}
        />
      </View>
      {/* Blur overlay with reduced intensity for better performance */}
      <BlurView
        intensity={darkMode ? 60 : 80} // Reduced from 120/140
        tint={darkMode ? "dark" : "light"}
        style={{
          flex: 1,
          borderRadius: 24,
        }}
      >
        {/* Simplified grain effect - only show on iOS for better performance */}
        {Platform.OS === "ios" && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "transparent",
              opacity: 0.3, // Reduced from 0.5
              borderRadius: 24,
              zIndex: 1,
            }}
          >
            {/* Create a static dotted pattern for grain effect */}
            {grainPattern.map((dot) => (
              <View
                key={dot.key}
                style={{
                  position: "absolute",
                  width: 1.5, // Reduced from 2
                  height: 1.5, // Reduced from 2
                  backgroundColor: darkMode ? "#94a3b8" : "#64748b",
                  left: `${dot.left}%`,
                  top: `${dot.top}%`,
                  opacity: dot.opacity,
                  borderRadius: 0.75, // Reduced from 1
                }}
              />
            ))}
          </View>
        )}

        {/* Content container */}
        <View
          style={{
            backgroundColor: darkMode
              ? "rgba(30, 41, 59, 0.4)"
              : "rgba(255, 255, 255, 0.3)",
            padding: 20,
            borderRadius: 24,
            borderWidth: 1,
            borderColor: darkMode
              ? "rgba(148, 163, 184, 0.1)"
              : "rgba(148, 163, 184, 0.2)",
            // Add subtle inner shadow effect using boxShadow
            boxShadow: darkMode
              ? createBoxShadow("rgba(0, 0, 0, 0.1)", 0, 2, 8)
              : createBoxShadow("rgba(100, 116, 139, 0.1)", 0, 2, 8),
            elevation: 4,
          }}
        >
          {children}
        </View>
      </BlurView>
    </View>
  );
};

// Simple fallback component for very low-performance devices
const SimpleFancyCard = ({
  children,
  style,
  darkMode,
  variant,
}: FancyCardProps) => {
  const colorSchemes = {
    default: darkMode ? "rgba(30, 41, 59, 0.8)" : "rgba(255, 255, 255, 0.8)",
    warm: darkMode ? "rgba(45, 25, 25, 0.8)" : "rgba(255, 248, 240, 0.8)",
    cool: darkMode ? "rgba(25, 35, 45, 0.8)" : "rgba(240, 248, 255, 0.8)",
    electric: darkMode ? "rgba(35, 25, 45, 0.8)" : "rgba(248, 240, 255, 0.8)",
  };

  return (
    <View
      style={[
        {
          borderRadius: 24,
          backgroundColor: colorSchemes[variant || "default"],
          padding: 20,
          borderWidth: 1,
          borderColor: darkMode
            ? "rgba(148, 163, 184, 0.1)"
            : "rgba(148, 163, 184, 0.2)",
          boxShadow: darkMode
            ? "0 2px 8px rgba(0, 0, 0, 0.1)"
            : "0 2px 8px rgba(100, 116, 139, 0.1)",
          elevation: 4,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};
