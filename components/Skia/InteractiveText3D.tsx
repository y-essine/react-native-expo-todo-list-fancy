import { Group, Text as SkiaText, useFont } from "@shopify/react-native-skia";
import React from "react";
import { Dimensions } from "react-native";
import {
  interpolate,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface InteractiveText3DProps {
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
  // Touch values passed from parent
  touchX?: any;
  touchY?: any;
  isPressed?: any;
}

const InteractiveText3D: React.FC<InteractiveText3DProps> = ({
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
  touchX,
  touchY,
  isPressed,
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

  // Update rotations based on touch input
  useDerivedValue(() => {
    if (touchX && touchY && isPressed?.value) {
      // Calculate rotation based on touch position relative to text center
      const deltaX = touchX.value - x;
      const deltaY = touchY.value - y;

      const newRotationY = interpolate(
        deltaX,
        [-screenWidth / 2, screenWidth / 2],
        [-maxRotationY, maxRotationY],
        "clamp"
      );

      const newRotationX = interpolate(
        deltaY,
        [-screenHeight / 2, screenHeight / 2],
        [maxRotationX, -maxRotationX],
        "clamp"
      );

      rotationX.value = withSpring(newRotationX, springConfig);
      rotationY.value = withSpring(newRotationY, springConfig);
    } else {
      // Return to center when not pressed
      rotationX.value = withSpring(0, springConfig);
      rotationY.value = withSpring(0, springConfig);
    }
  }, [touchX, touchY, isPressed]);

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

export default InteractiveText3D;
