import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useEffect } from "react";
import { Dimensions, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width: screenWidth } = Dimensions.get("window");

type GlassToastProps = {
  visible: boolean;
  message: string;
  type?: "success" | "error" | "warning" | "info";
  darkMode?: boolean;
  duration?: number;
  onHide?: () => void;
  position?: "top" | "center" | "bottom";
};

export const GlassToast = ({
  visible,
  message,
  type = "info",
  darkMode = false,
  duration = 3000,
  onHide,
  position = "top",
}: GlassToastProps) => {
  const translateY = useSharedValue(
    position === "top" ? -100 : position === "bottom" ? 100 : 0
  );
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  const typeConfig = {
    success: {
      icon: "checkmark-circle" as const,
      colors: darkMode
        ? ["rgba(16, 185, 129, 0.8)", "rgba(5, 150, 105, 0.6)"]
        : ["rgba(16, 185, 129, 0.9)", "rgba(5, 150, 105, 0.8)"],
      borderColor: darkMode
        ? "rgba(16, 185, 129, 0.4)"
        : "rgba(16, 185, 129, 0.6)",
      iconColor: darkMode ? "#10b981" : "#059669",
    },
    error: {
      icon: "close-circle" as const,
      colors: darkMode
        ? ["rgba(239, 68, 68, 0.8)", "rgba(220, 38, 38, 0.6)"]
        : ["rgba(239, 68, 68, 0.9)", "rgba(220, 38, 38, 0.8)"],
      borderColor: darkMode
        ? "rgba(239, 68, 68, 0.4)"
        : "rgba(239, 68, 68, 0.6)",
      iconColor: darkMode ? "#ef4444" : "#dc2626",
    },
    warning: {
      icon: "warning" as const,
      colors: darkMode
        ? ["rgba(251, 146, 60, 0.8)", "rgba(249, 115, 22, 0.6)"]
        : ["rgba(251, 146, 60, 0.9)", "rgba(249, 115, 22, 0.8)"],
      borderColor: darkMode
        ? "rgba(251, 146, 60, 0.4)"
        : "rgba(251, 146, 60, 0.6)",
      iconColor: darkMode ? "#f59e0b" : "#f97316",
    },
    info: {
      icon: "information-circle" as const,
      colors: darkMode
        ? ["rgba(59, 130, 246, 0.8)", "rgba(37, 99, 235, 0.6)"]
        : ["rgba(59, 130, 246, 0.9)", "rgba(37, 99, 235, 0.8)"],
      borderColor: darkMode
        ? "rgba(59, 130, 246, 0.4)"
        : "rgba(59, 130, 246, 0.6)",
      iconColor: darkMode ? "#3b82f6" : "#2563eb",
    },
  };

  const currentType = typeConfig[type];

  const theme = darkMode
    ? {
        background: "rgba(30, 41, 59, 0.6)",
        text: "#f8fafc",
        blur: 80,
      }
    : {
        background: "rgba(255, 255, 255, 0.8)",
        text: "#1f2937",
        blur: 100,
      };

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 15 });
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withSpring(1, { damping: 12 });

      // Auto hide after duration
      if (duration > 0) {
        const timer = setTimeout(() => {
          translateY.value = withSpring(
            position === "top" ? -100 : position === "bottom" ? 100 : 0
          );
          opacity.value = withTiming(0, { duration: 200 });
          scale.value = withTiming(0.8, { duration: 200 });
          setTimeout(() => onHide?.(), 250);
        }, duration);

        return () => clearTimeout(timer);
      }
    } else {
      translateY.value = withTiming(
        position === "top" ? -100 : position === "bottom" ? 100 : 0
      );
      opacity.value = withTiming(0, { duration: 200 });
      scale.value = withTiming(0.8, { duration: 200 });
    }
  }, [visible, duration, position]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  if (!visible && opacity.value === 0) return null;

  return (
    <View
      style={{
        position: "absolute",
        top:
          position === "top" ? 60 : position === "center" ? "50%" : undefined,
        bottom: position === "bottom" ? 60 : undefined,
        left: 20,
        right: 20,
        zIndex: 9999,
        alignItems: "center",
      }}
    >
      <Animated.View
        style={[
          {
            maxWidth: screenWidth - 40,
            borderRadius: 16,
            overflow: "hidden",
            shadowColor: currentType.iconColor,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 10,
          },
          animatedStyle,
        ]}
      >
        <BlurView
          intensity={theme.blur}
          tint={darkMode ? "dark" : "light"}
          style={{ borderRadius: 16 }}
        >
          <View
            style={{
              backgroundColor: theme.background,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: currentType.borderColor,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingVertical: 12,
              minHeight: 56,
            }}
          >
            {/* Icon */}
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: `${currentType.iconColor}20`,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Ionicons
                name={currentType.icon}
                size={20}
                color={currentType.iconColor}
              />
            </View>

            {/* Message */}
            <Text
              style={{
                flex: 1,
                fontSize: 14,
                fontWeight: "500",
                color: theme.text,
                lineHeight: 20,
              }}
              numberOfLines={3}
            >
              {message}
            </Text>
          </View>
        </BlurView>
      </Animated.View>
    </View>
  );
};
