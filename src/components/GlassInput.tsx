import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type GlassInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  darkMode?: boolean;
  onSubmit?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  submitIcon?: keyof typeof Ionicons.glyphMap;
  multiline?: boolean;
  numberOfLines?: number;
};

export const GlassInput = ({
  value,
  onChangeText,
  placeholder = "Enter text...",
  darkMode = false,
  onSubmit,
  icon,
  submitIcon = "send",
  multiline = false,
  numberOfLines = 1,
}: GlassInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const focusAnimation = useSharedValue(0);
  const rippleScale = useSharedValue(0);
  const rippleOpacity = useSharedValue(0);

  const theme = darkMode
    ? {
        background: "rgba(30, 41, 59, 0.4)",
        borderColor: "rgba(148, 163, 184, 0.2)",
        focusBorderColor: "rgba(139, 92, 246, 0.5)",
        text: "#f8fafc",
        placeholder: "#94a3b8",
        glowColor: "rgba(139, 92, 246, 0.3)",
      }
    : {
        background: "rgba(255, 255, 255, 0.4)",
        borderColor: "rgba(148, 163, 184, 0.3)",
        focusBorderColor: "rgba(139, 92, 246, 0.6)",
        text: "#1f2937",
        placeholder: "#9ca3af",
        glowColor: "rgba(139, 92, 246, 0.2)",
      };

  const handleFocus = () => {
    setIsFocused(true);
    focusAnimation.value = withSpring(1, { damping: 15 });

    // Ripple effect
    rippleScale.value = 0;
    rippleOpacity.value = 0.5;
    rippleScale.value = withTiming(1, { duration: 600 });
    rippleOpacity.value = withTiming(0, { duration: 600 });
  };

  const handleBlur = () => {
    setIsFocused(false);
    focusAnimation.value = withSpring(0, { damping: 15 });
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit();
      // Submit ripple effect
      rippleScale.value = 0;
      rippleOpacity.value = 0.8;
      rippleScale.value = withTiming(1.2, { duration: 400 });
      rippleOpacity.value = withTiming(0, { duration: 400 });
    }
  };
  const containerStyle = useAnimatedStyle(() => {
    const borderWidth = interpolate(focusAnimation.value, [0, 1], [1, 2]);
    const glowOpacity = interpolate(focusAnimation.value, [0, 1], [0, 1]);

    return {
      borderWidth,
      boxShadow: `0px 0px 10px rgba(139, 92, 246, ${glowOpacity * 0.3})`,
      elevation: interpolate(focusAnimation.value, [0, 1], [2, 6]),
    };
  });

  const rippleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: rippleScale.value }],
    opacity: rippleOpacity.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: focusAnimation.value,
  }));

  return (
    <View style={{ position: "relative" }}>
      {/* Glow effect */}
      <Animated.View
        style={[
          {
            position: "absolute",
            top: -4,
            left: -4,
            right: -4,
            bottom: -4,
            borderRadius: 20,
            backgroundColor: theme.glowColor,
            boxShadow: `0px 0px 10px rgba(139, 92, 246, 0.5)`,
          },
          glowStyle,
        ]}
      />

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
            backgroundColor: theme.focusBorderColor,
            transform: [{ translateX: -50 }, { translateY: -50 }],
          },
          rippleStyle,
        ]}
      />

      {/* Main container */}
      <Animated.View
        style={[
          {
            borderRadius: 16,
            borderColor: isFocused ? theme.focusBorderColor : theme.borderColor,
            overflow: "hidden",
            boxShadow: darkMode
              ? "0px 2px 8px rgba(0, 0, 0, 0.3)"
              : "0px 2px 8px rgba(139, 92, 246, 0.3)",
            elevation: 2,
          },
          containerStyle,
        ]}
      >
        <BlurView
          intensity={darkMode ? 60 : 80}
          tint={darkMode ? "dark" : "light"}
          style={{ borderRadius: 16 }}
        >
          <View
            style={{
              backgroundColor: theme.background,
              flexDirection: "row",
              alignItems: multiline ? "flex-start" : "center",
              paddingHorizontal: 16,
              paddingVertical: multiline ? 12 : 16,
              minHeight: multiline ? numberOfLines * 20 + 24 : 56,
            }}
          >
            {/* Icon */}
            {icon && (
              <Ionicons
                name={icon}
                size={20}
                color={theme.placeholder}
                style={{ marginRight: 12, marginTop: multiline ? 2 : 0 }}
              />
            )}

            {/* Input */}
            <TextInput
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              placeholderTextColor={theme.placeholder}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onSubmitEditing={handleSubmit}
              returnKeyType={onSubmit ? "send" : "done"}
              blurOnSubmit={!multiline}
              multiline={multiline}
              numberOfLines={numberOfLines}
              style={{
                flex: 1,
                fontSize: 16,
                color: theme.text,
                textAlignVertical: multiline ? "top" : "center",
              }}
            />

            {/* Submit button */}
            {onSubmit && value.trim().length > 0 && (
              <TouchableOpacity
                onPress={handleSubmit}
                style={{
                  marginLeft: 8,
                  padding: 8,
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                <LinearGradient
                  colors={
                    darkMode
                      ? ["rgba(139, 92, 246, 0.8)", "rgba(124, 58, 237, 0.8)"]
                      : ["rgba(139, 92, 246, 1)", "rgba(124, 58, 237, 1)"]
                  }
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 8,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name={submitIcon} size={16} color="white" />
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </BlurView>
      </Animated.View>
    </View>
  );
};
