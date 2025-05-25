import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type GlassMorphButtonProps = {
  onPress: () => void;
  children?: React.ReactNode;
  title?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "success"
    | "warning"
    | "danger";
  size?: "small" | "medium" | "large";
  darkMode?: boolean;
  disabled?: boolean;
  loading?: boolean;
  style?: any;
};

export const GlassMorphButton = ({
  onPress,
  children,
  title,
  icon,
  variant = "primary",
  size = "medium",
  darkMode = false,
  disabled = false,
  loading = false,
  style,
}: GlassMorphButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const pressAnimation = useSharedValue(0);
  const rippleScale = useSharedValue(0);
  const rippleOpacity = useSharedValue(0);
  const loadingRotation = useSharedValue(0);

  // Size configurations
  const sizeConfig = {
    small: { padding: 8, fontSize: 14, iconSize: 16, minHeight: 36 },
    medium: { padding: 12, fontSize: 16, iconSize: 20, minHeight: 48 },
    large: { padding: 16, fontSize: 18, iconSize: 24, minHeight: 56 },
  };

  // Variant color schemes
  const variants = {
    primary: {
      colors: darkMode
        ? ["rgba(139, 92, 246, 0.6)", "rgba(124, 58, 237, 0.6)"]
        : ["rgba(139, 92, 246, 0.8)", "rgba(124, 58, 237, 0.8)"],
      textColor: "white",
      borderColor: darkMode
        ? "rgba(139, 92, 246, 0.4)"
        : "rgba(139, 92, 246, 0.6)",
      rippleColor: "rgba(255, 255, 255, 0.3)",
    },
    secondary: {
      colors: darkMode
        ? ["rgba(148, 163, 184, 0.4)", "rgba(100, 116, 139, 0.4)"]
        : ["rgba(148, 163, 184, 0.6)", "rgba(100, 116, 139, 0.6)"],
      textColor: darkMode ? "#f8fafc" : "#1f2937",
      borderColor: darkMode
        ? "rgba(148, 163, 184, 0.3)"
        : "rgba(148, 163, 184, 0.5)",
      rippleColor: darkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)",
    },
    accent: {
      colors: darkMode
        ? ["rgba(59, 130, 246, 0.6)", "rgba(37, 99, 235, 0.6)"]
        : ["rgba(59, 130, 246, 0.8)", "rgba(37, 99, 235, 0.8)"],
      textColor: "white",
      borderColor: darkMode
        ? "rgba(59, 130, 246, 0.4)"
        : "rgba(59, 130, 246, 0.6)",
      rippleColor: "rgba(255, 255, 255, 0.3)",
    },
    success: {
      colors: darkMode
        ? ["rgba(16, 185, 129, 0.6)", "rgba(5, 150, 105, 0.6)"]
        : ["rgba(16, 185, 129, 0.8)", "rgba(5, 150, 105, 0.8)"],
      textColor: "white",
      borderColor: darkMode
        ? "rgba(16, 185, 129, 0.4)"
        : "rgba(16, 185, 129, 0.6)",
      rippleColor: "rgba(255, 255, 255, 0.3)",
    },
    warning: {
      colors: darkMode
        ? ["rgba(251, 146, 60, 0.6)", "rgba(249, 115, 22, 0.6)"]
        : ["rgba(251, 146, 60, 0.8)", "rgba(249, 115, 22, 0.8)"],
      textColor: "white",
      borderColor: darkMode
        ? "rgba(251, 146, 60, 0.4)"
        : "rgba(251, 146, 60, 0.6)",
      rippleColor: "rgba(255, 255, 255, 0.3)",
    },
    danger: {
      colors: darkMode
        ? ["rgba(239, 68, 68, 0.6)", "rgba(220, 38, 38, 0.6)"]
        : ["rgba(239, 68, 68, 0.8)", "rgba(220, 38, 38, 0.8)"],
      textColor: "white",
      borderColor: darkMode
        ? "rgba(239, 68, 68, 0.4)"
        : "rgba(239, 68, 68, 0.6)",
      rippleColor: "rgba(255, 255, 255, 0.3)",
    },
  };

  const currentVariant = variants[variant];
  const currentSize = sizeConfig[size];

  // Start loading animation
  React.useEffect(() => {
    if (loading) {
      loadingRotation.value = withSequence(
        withTiming(360, { duration: 1000 }),
        withTiming(0, { duration: 0 })
      );
      const interval = setInterval(() => {
        loadingRotation.value = withSequence(
          withTiming(360, { duration: 1000 }),
          withTiming(0, { duration: 0 })
        );
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const handlePressIn = () => {
    if (disabled || loading) return;
    setIsPressed(true);
    pressAnimation.value = withSpring(1, { damping: 15 });

    // Ripple effect
    rippleScale.value = 0;
    rippleOpacity.value = 0.6;
    rippleScale.value = withTiming(1, { duration: 400 });
    rippleOpacity.value = withTiming(0, { duration: 400 });
  };

  const handlePressOut = () => {
    setIsPressed(false);
    pressAnimation.value = withSpring(0, { damping: 15 });
  };

  const handlePress = () => {
    if (disabled || loading) return;
    onPress();
  };

  const buttonStyle = useAnimatedStyle(() => {
    const scale = interpolate(pressAnimation.value, [0, 1], [1, 0.95]);
    const opacity = disabled
      ? 0.6
      : interpolate(pressAnimation.value, [0, 1], [1, 0.8]);

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const rippleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: rippleScale.value }],
    opacity: rippleOpacity.value,
  }));

  const loadingStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${loadingRotation.value}deg` }],
  }));

  return (
    <Animated.View style={[buttonStyle, style]}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        activeOpacity={1}
        disabled={disabled || loading}
        style={{
          borderRadius: 16,
          overflow: "hidden",
          minHeight: currentSize.minHeight,
          shadowColor: darkMode ? "#000" : currentVariant.borderColor,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 6,
        }}
      >
        {/* Ripple effect */}
        <Animated.View
          style={[
            {
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: currentVariant.rippleColor,
              transform: [{ translateX: -50 }, { translateY: -50 }],
            },
            rippleStyle,
          ]}
        />

        <BlurView
          intensity={darkMode ? 60 : 80}
          tint={darkMode ? "dark" : "light"}
          style={{ borderRadius: 16 }}
        >
          <LinearGradient
            colors={currentVariant.colors}
            style={{
              borderRadius: 16,
              borderWidth: 1,
              borderColor: currentVariant.borderColor,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: currentSize.padding * 1.5,
                paddingVertical: currentSize.padding,
                minHeight: currentSize.minHeight,
              }}
            >
              {/* Loading spinner */}
              {loading && (
                <Animated.View style={[{ marginRight: 8 }, loadingStyle]}>
                  <Ionicons
                    name="sync"
                    size={currentSize.iconSize}
                    color={currentVariant.textColor}
                  />
                </Animated.View>
              )}

              {/* Icon */}
              {!loading && icon && (
                <Ionicons
                  name={icon}
                  size={currentSize.iconSize}
                  color={currentVariant.textColor}
                  style={{ marginRight: title || children ? 8 : 0 }}
                />
              )}

              {/* Text content */}
              {title && (
                <Text
                  style={{
                    fontSize: currentSize.fontSize,
                    fontWeight: "600",
                    color: currentVariant.textColor,
                  }}
                >
                  {title}
                </Text>
              )}

              {/* Custom children */}
              {children}
            </View>
          </LinearGradient>
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );
};
