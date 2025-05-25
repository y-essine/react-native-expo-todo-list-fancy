import React from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type AnimatedCardProps = {
  children: React.ReactNode;
  delay?: number;
  [key: string]: any;
};

export const AnimatedCard = ({
  children,
  delay = 0,
  ...props
}: AnimatedCardProps) => {
  const translateY = useSharedValue(50);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    setTimeout(() => {
      translateY.value = withSpring(0, { damping: 15 });
      opacity.value = withTiming(1, { duration: 600 });
    }, delay);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={animatedStyle} {...props}>
      {children}
    </Animated.View>
  );
};
