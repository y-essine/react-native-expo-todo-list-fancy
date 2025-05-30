// components/FadeView.tsx
import { View } from "@gluestack-ui/themed";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

interface FadeViewProps {
  visible: boolean;
  children: React.ReactNode;
  delay?: number;
}

const FadeView = ({
  visible,
  children,
  delay = 200,
  ...props
}: FadeViewProps) => {
  // if (!visible) return null;

  return (
    <View {...props}>
      <View style={{ opacity: 0 }}>{children}</View>
      {visible && (
        <Animated.View
          entering={FadeIn.delay(delay).springify()}
          exiting={FadeOut.delay(0).springify()}
          style={{ position: "absolute" }}
        >
          {children}
        </Animated.View>
      )}
    </View>
  );
};

export default FadeView;
