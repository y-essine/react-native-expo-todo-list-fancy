import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type GlassProgressBarProps = {
  progress: number; // 0 to 100
  darkMode?: boolean;
  height?: number;
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  color?: "primary" | "success" | "warning" | "danger" | "info";
  style?: any;
};

export const GlassProgressBar = ({
  progress,
  darkMode = false,
  height = 8,
  showLabel = false,
  label,
  animated = true,
  color = "primary",
  style,
}: GlassProgressBarProps) => {
  const progressAnimation = useSharedValue(0);
  const shimmerAnimation = useSharedValue(0);

  const colorSchemes = {
    primary: {
      gradient: darkMode
        ? ["rgba(139, 92, 246, 0.8)", "rgba(124, 58, 237, 0.8)"]
        : ["rgba(139, 92, 246, 1)", "rgba(124, 58, 237, 1)"],
      glow: "rgba(139, 92, 246, 0.4)",
    },
    success: {
      gradient: darkMode
        ? ["rgba(16, 185, 129, 0.8)", "rgba(5, 150, 105, 0.8)"]
        : ["rgba(16, 185, 129, 1)", "rgba(5, 150, 105, 1)"],
      glow: "rgba(16, 185, 129, 0.4)",
    },
    warning: {
      gradient: darkMode
        ? ["rgba(251, 146, 60, 0.8)", "rgba(249, 115, 22, 0.8)"]
        : ["rgba(251, 146, 60, 1)", "rgba(249, 115, 22, 1)"],
      glow: "rgba(251, 146, 60, 0.4)",
    },
    danger: {
      gradient: darkMode
        ? ["rgba(239, 68, 68, 0.8)", "rgba(220, 38, 38, 0.8)"]
        : ["rgba(239, 68, 68, 1)", "rgba(220, 38, 38, 1)"],
      glow: "rgba(239, 68, 68, 0.4)",
    },
    info: {
      gradient: darkMode
        ? ["rgba(59, 130, 246, 0.8)", "rgba(37, 99, 235, 0.8)"]
        : ["rgba(59, 130, 246, 1)", "rgba(37, 99, 235, 1)"],
      glow: "rgba(59, 130, 246, 0.4)",
    },
  };

  const currentColor = colorSchemes[color];

  const theme = darkMode
    ? {
        background: "rgba(30, 41, 59, 0.4)",
        borderColor: "rgba(148, 163, 184, 0.2)",
        text: "#f8fafc",
        trackColor: "rgba(148, 163, 184, 0.2)",
      }
    : {
        background: "rgba(255, 255, 255, 0.6)",
        borderColor: "rgba(148, 163, 184, 0.3)",
        text: "#1f2937",
        trackColor: "rgba(148, 163, 184, 0.3)",
      };

  useEffect(() => {
    if (animated) {
      progressAnimation.value = withSpring(progress / 100, { damping: 15 });

      // Shimmer effect
      shimmerAnimation.value = withRepeat(
        withTiming(1, { duration: 2000, easing: Easing.linear }),
        -1,
        false
      );
    } else {
      progressAnimation.value = progress / 100;
    }
  }, [progress, animated]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressAnimation.value * 100}%`,
  }));

  const shimmerStyle = useAnimatedStyle(() => {
    if (!animated) return { transform: [{ translateX: 0 }] };

    const translateX = interpolate(shimmerAnimation.value, [0, 1], [-100, 300]);

    return {
      transform: [{ translateX }],
    };
  });

  const glowStyle = useAnimatedStyle(() => ({
    opacity: animated
      ? interpolate(progressAnimation.value, [0, 1], [0.5, 1])
      : 1,
  }));

  return (
    <View style={[{ width: "100%" }, style]}>
      {/* Label */}
      {showLabel && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          {label && (
            <Text
              style={{
                fontSize: 14,
                fontWeight: "500",
                color: theme.text,
              }}
            >
              {label}
            </Text>
          )}
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: theme.text,
            }}
          >
            {Math.round(progress)}%
          </Text>
        </View>
      )}

      {/* Progress Bar Container */}
      <View
        style={{
          height,
          borderRadius: height / 2,
          overflow: "hidden",
          shadowColor: currentColor.glow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <BlurView
          intensity={darkMode ? 60 : 80}
          tint={darkMode ? "dark" : "light"}
          style={{
            flex: 1,
            borderRadius: height / 2,
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: theme.background,
              borderRadius: height / 2,
              borderWidth: 0.5,
              borderColor: theme.borderColor,
              position: "relative",
            }}
          >
            {/* Track */}
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: theme.trackColor,
                borderRadius: height / 2,
              }}
            />

            {/* Progress Fill */}
            <Animated.View
              style={[
                {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  bottom: 0,
                  borderRadius: height / 2,
                  overflow: "hidden",
                },
                progressStyle,
              ]}
            >
              {/* Glow effect */}
              <Animated.View
                style={[
                  {
                    position: "absolute",
                    top: -2,
                    left: -2,
                    right: -2,
                    bottom: -2,
                    borderRadius: height / 2,
                    backgroundColor: currentColor.glow,
                  },
                  glowStyle,
                ]}
              />

              <LinearGradient
                colors={currentColor.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  flex: 1,
                  borderRadius: height / 2,
                }}
              >
                {/* Shimmer effect overlay */}
                {animated && (
                  <Animated.View
                    style={[
                      {
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        width: 40,
                        left: -40,
                      },
                      shimmerStyle,
                    ]}
                  >
                    <LinearGradient
                      colors={[
                        "transparent",
                        "rgba(255, 255, 255, 0.4)",
                        "transparent",
                      ]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{ flex: 1 }}
                    />
                  </Animated.View>
                )}
              </LinearGradient>
            </Animated.View>
          </View>
        </BlurView>
      </View>
    </View>
  );
};
