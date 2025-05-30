// components/BlobTransition.tsx
import { Canvas, Circle, mix, useClock } from "@shopify/react-native-skia";
import { Dimensions } from "react-native";
import {
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

interface BlobTransitionProps {
  expanded: boolean;
}

const BlobTransition = ({ expanded }: BlobTransitionProps) => {
  const baseScale = useSharedValue(1);
  const clock = useClock();

  const scale = useDerivedValue(() => {
    const pulse = mix(Math.sin(clock.value / 1000) * 0.05, 1, 0.95);
    return expanded ? withTiming(5, { duration: 1000 }) : withTiming(pulse);
  }, [expanded, clock]);

  // Skia doesn't read Reanimated directly, so we sync manually
  useDerivedValue(() => {
    return withTiming(scale.value, { duration: 1000 });
  }, [scale]);

  return (
    <Canvas style={{ position: "absolute", width, height }}>
      <Circle
        cx={width / 2}
        cy={height / 2}
        r={120}
        color="#FFE5EC"
        origin={{ x: width / 2, y: height / 2 }}
      />
    </Canvas>
  );
};

export default BlobTransition;
