// components/AnimatedText.tsx
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

interface AnimatedTextProps {
  visible: boolean;
  children: React.ReactNode;
  delay?: number;
}

const AnimatedText = ({ visible, children, delay = 0 }: AnimatedTextProps) => {
  if (!visible) return null;

  return (
    <Animated.View
      entering={FadeIn.delay(delay).springify()}
      exiting={FadeOut.delay(0).springify()}
    >
      {children}
    </Animated.View>
  );
};

export default AnimatedText;
