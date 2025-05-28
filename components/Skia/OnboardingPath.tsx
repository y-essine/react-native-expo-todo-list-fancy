import { Group, Path } from "@shopify/react-native-skia";
import { useEffect, useState } from "react";
import { Dimensions } from "react-native";
import {
  interpolate,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { PathType, getPathConfig } from "./paths";

interface OnboardingPathProps {
  color: string;
  pathType?: PathType;
  autoPlay?: boolean;
  onAnimationComplete?: () => void;
  // Animation props
  delay?: number; // Delay before animation starts (in milliseconds)
  // Position props
  x?: number;
  y?: number;
  // Scale props
  scaleX?: number;
  scaleY?: number;
  scale?: number; // Uniform scale for both x and y
  // Origin for transformations (default is center)
  originX?: number;
  originY?: number;
}

const OnboardingPath = ({
  color,
  pathType = "wave",
  autoPlay = true,
  onAnimationComplete,
  delay = 0,
  x = 0,
  y = 0,
  scaleX,
  scaleY,
  scale = 1,
  originX,
  originY,
}: OnboardingPathProps) => {
  const { width, height } = Dimensions.get("window");
  const pathConfig = getPathConfig(pathType);

  // Calculate effective scale values
  const effectiveScaleX = scaleX ?? scale;
  const effectiveScaleY = scaleY ?? scale;

  // Calculate default origin points (center of canvas)
  const defaultOriginX = width / 2;
  const defaultOriginY = height / 2;
  const transformOriginX = originX ?? defaultOriginX;
  const transformOriginY = originY ?? defaultOriginY;

  const [currentPath, setCurrentPath] = useState(() =>
    pathConfig.createPath(width, height)
  );

  // Animation shared values
  const animationProgress = useSharedValue(0);

  // Update path when pathType changes
  useEffect(() => {
    const newPathConfig = getPathConfig(pathType);
    setCurrentPath(newPathConfig.createPath(width, height));
  }, [pathType, width, height]);
  useEffect(() => {
    if (!autoPlay) return;

    const duration = pathConfig.duration || 3000;

    // Create a sequence with optional initial delay: draw (0->1), wait, erase (1->2), wait, then repeat
    animationProgress.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration }), // Draw the path
          withDelay(1000, withTiming(1, { duration: 0 })), // Wait 1 second
          withTiming(2, { duration }), // Erase the path
          withDelay(1000, withTiming(2, { duration: 0 })) // Wait 1 second before loop
        ),
        -1,
        false,
        () => {
          onAnimationComplete?.();
        }
      )
    );
  }, [pathType, autoPlay, pathConfig.duration, delay]);

  // Animated start and end values for path trimming
  const animatedStart = useDerivedValue(() => {
    if (animationProgress.value <= 1) {
      return 0; // Drawing phase: start stays at 0
    } else {
      return interpolate(animationProgress.value, [1, 2], [0, 1]); // Erasing phase: start moves from 0 to 1
    }
  });

  const animatedEnd = useDerivedValue(() => {
    if (animationProgress.value <= 1) {
      return interpolate(animationProgress.value, [0, 1], [0, 1]); // Drawing phase: end moves from 0 to 1
    } else {
      return 1; // Erasing phase: end stays at 1
    }
  });
  return (
    <Group
      transform={[
        { translateX: x },
        { translateY: y },
        { translateX: transformOriginX },
        { translateY: transformOriginY },
        { scaleX: effectiveScaleX },
        { scaleY: effectiveScaleY },
        { translateX: -transformOriginX },
        { translateY: -transformOriginY },
      ]}
    >
      <Path
        path={currentPath}
        style="stroke"
        strokeWidth={pathConfig.strokeWidth || 4}
        color={color}
        start={animatedStart}
        end={animatedEnd}
      />
    </Group>
  );
};

export default OnboardingPath;
