import { Group, Text as SkiaText, useFont } from "@shopify/react-native-skia";
import React from "react";
import { Dimensions } from "react-native";
import {
  interpolate,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface MovableText3DProps {
  text: string;
  fontSize?: number;
  color?: string;
  fontPath?: string;
  // Position as percentage of canvas size (0-100)
  xPercent?: number;
  yPercent?: number;
  // Scale as percentage (100 = normal size)
  scalePercent?: number;
  // Physics properties
  damping?: number;
  stiffness?: number;
  mass?: number;
  // Rotation limits in degrees
  maxRotationX?: number;
  maxRotationY?: number;
  // Perspective distance
  perspective?: number;
}

const MovableText3D: React.FC<MovableText3DProps> = ({
  text,
  fontSize = 48,
  color = "#FFFFFF",
  fontPath,
  xPercent = 50,
  yPercent = 50,
  scalePercent = 100,
  damping = 10,
  stiffness = 150,
  mass = 1,
  maxRotationX = 30,
  maxRotationY = 30,
  perspective = 300,
}) => {
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  // Animation values for 3D rotation
  const rotationX = useSharedValue(0);
  const rotationY = useSharedValue(0);

  // Load font (optional)
  const font = useFont(fontPath, fontSize);

  // Calculate position and scale based on percentages
  const x = (xPercent / 100) * screenWidth;
  const y = (yPercent / 100) * screenHeight;
  const scale = scalePercent / 100;

  // Spring configuration
  const springConfig = {
    damping,
    stiffness,
    mass,
  };

  // Auto-rotate effect (optional - you can remove this for pure touch control)
  React.useEffect(() => {
    const interval = setInterval(() => {
      // Add subtle auto-animation if no touch is happening
      if (rotationX.value === 0 && rotationY.value === 0) {
        rotationX.value = withSpring(
          Math.sin(Date.now() / 2000) * 5,
          springConfig
        );
        rotationY.value = withSpring(
          Math.cos(Date.now() / 3000) * 3,
          springConfig
        );
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Create 3D transform matrix
  const transform = useDerivedValue(() => {
    // Convert degrees to radians
    const rotX = (rotationX.value * Math.PI) / 180;
    const rotY = (rotationY.value * Math.PI) / 180;

    // Calculate perspective effect
    const perspectiveScale = interpolate(
      Math.abs(rotationX.value) + Math.abs(rotationY.value),
      [0, maxRotationX + maxRotationY],
      [1, 0.8],
      "clamp"
    );

    return [
      { translateX: x },
      { translateY: y },
      { perspective },
      { rotateX: rotX },
      { rotateY: rotY },
      { scaleX: scale * perspectiveScale },
      { scaleY: scale * perspectiveScale },
      { translateX: -x },
      { translateY: -y },
    ];
  });

  // Animated opacity for depth effect
  const opacity = useDerivedValue(() => {
    const totalRotation = Math.abs(rotationX.value) + Math.abs(rotationY.value);
    return interpolate(
      totalRotation,
      [0, maxRotationX + maxRotationY],
      [1, 0.7],
      "clamp"
    );
  });
  return (
    <Group transform={transform} opacity={opacity}>
      <SkiaText x={x} y={y} text={text} font={font} color={color} />
    </Group>
  );
};

export default MovableText3D;
