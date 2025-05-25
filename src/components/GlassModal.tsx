import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useEffect } from "react";
import { Dimensions, Modal, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

type GlassModalProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  darkMode?: boolean;
  size?: "small" | "medium" | "large" | "fullscreen";
  showCloseButton?: boolean;
  animationType?: "slide" | "fade" | "scale";
  backdropOpacity?: number;
};

export const GlassModal = ({
  visible,
  onClose,
  children,
  title,
  darkMode = false,
  size = "medium",
  showCloseButton = true,
  animationType = "scale",
  backdropOpacity = 0.4,
}: GlassModalProps) => {
  const modalAnimation = useSharedValue(0);
  const backdropAnimation = useSharedValue(0);
  const scaleAnimation = useSharedValue(0);

  const sizeConfig = {
    small: { width: screenWidth * 0.8, maxHeight: screenHeight * 0.4 },
    medium: { width: screenWidth * 0.9, maxHeight: screenHeight * 0.6 },
    large: { width: screenWidth * 0.95, maxHeight: screenHeight * 0.8 },
    fullscreen: { width: screenWidth, maxHeight: screenHeight },
  };

  const currentSize = sizeConfig[size];

  useEffect(() => {
    if (visible) {
      backdropAnimation.value = withTiming(1, { duration: 300 });
      modalAnimation.value = withSpring(1, { damping: 15 });
      scaleAnimation.value = withSpring(1, { damping: 12 });
    } else {
      backdropAnimation.value = withTiming(0, { duration: 200 });
      modalAnimation.value = withTiming(0, { duration: 200 });
      scaleAnimation.value = withTiming(0, { duration: 200 });
    }
  }, [visible]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropAnimation.value * backdropOpacity,
  }));

  const modalStyle = useAnimatedStyle(() => {
    if (animationType === "slide") {
      const translateY = interpolate(
        modalAnimation.value,
        [0, 1],
        [screenHeight, 0]
      );
      return {
        transform: [{ translateY }],
        opacity: modalAnimation.value,
      };
    } else if (animationType === "fade") {
      return {
        opacity: modalAnimation.value,
      };
    } else {
      // scale
      const scale = interpolate(scaleAnimation.value, [0, 1], [0.8, 1]);
      return {
        transform: [{ scale }],
        opacity: modalAnimation.value,
      };
    }
  });

  const theme = darkMode
    ? {
        background: "rgba(30, 41, 59, 0.6)",
        borderColor: "rgba(148, 163, 184, 0.3)",
        text: "#f8fafc",
        textSecondary: "#cbd5e1",
        closeButtonBg: "rgba(239, 68, 68, 0.2)",
        closeButtonBorder: "rgba(239, 68, 68, 0.4)",
      }
    : {
        background: "rgba(255, 255, 255, 0.8)",
        borderColor: "rgba(148, 163, 184, 0.4)",
        text: "#1f2937",
        textSecondary: "#6b7280",
        closeButtonBg: "rgba(239, 68, 68, 0.1)",
        closeButtonBorder: "rgba(239, 68, 68, 0.3)",
      };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose}>
        <Animated.View
          style={[
            {
              flex: 1,
              backgroundColor: darkMode
                ? "rgba(0, 0, 0, 0.8)"
                : "rgba(0, 0, 0, 0.5)",
            },
            backdropStyle,
          ]}
        >
          <BlurView
            intensity={20}
            tint={darkMode ? "dark" : "light"}
            style={{ flex: 1 }}
          >
            {/* Modal Content */}
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                padding: 20,
              }}
            >
              <TouchableOpacity
                activeOpacity={1}
                onPress={(e) => e.stopPropagation()}
                style={{ width: "100%", alignItems: "center" }}
              >
                <Animated.View
                  style={[
                    {
                      width: size === "fullscreen" ? "100%" : currentSize.width,
                      maxHeight: currentSize.maxHeight,
                      borderRadius: size === "fullscreen" ? 0 : 24,
                      overflow: "hidden",
                      boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.3)",
                      elevation: 10,
                    },
                    modalStyle,
                  ]}
                >
                  <BlurView
                    intensity={darkMode ? 80 : 100}
                    tint={darkMode ? "dark" : "light"}
                    style={{
                      borderRadius: size === "fullscreen" ? 0 : 24,
                      flex: 1,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: theme.background,
                        borderRadius: size === "fullscreen" ? 0 : 24,
                        borderWidth: size === "fullscreen" ? 0 : 1,
                        borderColor: theme.borderColor,
                        flex: 1,
                      }}
                    >
                      {/* Header */}
                      {(title || showCloseButton) && (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: 20,
                            borderBottomWidth: 1,
                            borderBottomColor: theme.borderColor,
                          }}
                        >
                          {title ? (
                            <Text
                              style={{
                                fontSize: 20,
                                fontWeight: "bold",
                                color: theme.text,
                                flex: 1,
                              }}
                            >
                              {title}
                            </Text>
                          ) : (
                            <View style={{ flex: 1 }} />
                          )}

                          {showCloseButton && (
                            <TouchableOpacity
                              onPress={onClose}
                              style={{
                                padding: 8,
                                borderRadius: 12,
                                backgroundColor: theme.closeButtonBg,
                                borderWidth: 1,
                                borderColor: theme.closeButtonBorder,
                              }}
                            >
                              <Ionicons
                                name="close"
                                size={20}
                                color={darkMode ? "#f87171" : "#ef4444"}
                              />
                            </TouchableOpacity>
                          )}
                        </View>
                      )}

                      {/* Content */}
                      <View style={{ flex: 1, padding: 20 }}>{children}</View>
                    </View>
                  </BlurView>
                </Animated.View>
              </TouchableOpacity>
            </View>
          </BlurView>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};
