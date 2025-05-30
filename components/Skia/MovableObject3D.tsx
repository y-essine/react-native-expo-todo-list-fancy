import { Group } from "@shopify/react-native-skia";
import React from "react";
import { Dimensions } from "react-native";
import {
  interpolate,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface MovableObject3DProps {
  children:
    | React.ReactNode
    | ((props: { centerX: number; centerY: number }) => React.ReactNode);
  // Position as percentage of canvas size (0-100)
  xPercent?: number;
  yPercent?: number;
  // Scale as percentage (100 = normal size)
  scalePercent?: number;
  // Physics properties
  damping?: number;
  stiffness?: number;
  // Rotation limits in degrees
  maxRotationX?: number;
  maxRotationY?: number;
  // Touch values passed from parent
  touchX?: any;
  touchY?: any;
  isPressed?: any;
  // Width and height for center calculation
  width?: number;
  height?: number;
}

const MovableObject3D: React.FC<MovableObject3DProps> = ({
  children,
  xPercent = 50,
  yPercent = 50,
  scalePercent = 100,
  damping = 10,
  stiffness = 150,
  maxRotationX = 30,
  maxRotationY = 30,
  touchX,
  touchY,
  isPressed,
  width = 200,
  height = 60,
}) => {
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

  // Animation values for 3D rotation
  const rotationX = useSharedValue(0);
  const rotationY = useSharedValue(0);

  // Calculate position based on percentages
  const centerX = (xPercent / 100) * screenWidth;
  const centerY = (yPercent / 100) * screenHeight;
  const scale = scalePercent / 100;

  // Spring configuration
  const springConfig = {
    damping,
    stiffness,
  };
  // Update rotations based on touch input
  useDerivedValue(() => {
    if (touchX && touchY && isPressed && isPressed.value) {
      // Calculate rotation based on touch position relative to object center
      const deltaX = touchX.value - centerX;
      const deltaY = touchY.value - centerY;

      // Only rotate if touch is near the object (within reasonable distance)
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = Math.max(width, height);

      if (distance < maxDistance * 2) {
        // Increased touch area
        const newRotationY = interpolate(
          deltaX,
          [-width, width],
          [-maxRotationY, maxRotationY],
          "clamp"
        );

        const newRotationX = interpolate(
          deltaY,
          [-height, height],
          [maxRotationX, -maxRotationX],
          "clamp"
        );

        rotationX.value = withSpring(newRotationX, springConfig);
        rotationY.value = withSpring(newRotationY, springConfig);
      }
    } else {
      // Return to center when not pressed
      rotationX.value = withSpring(0, springConfig);
      rotationY.value = withSpring(0, springConfig);
    }
  }, [touchX, touchY, isPressed]);

  // Create simple transform with rotation
  const transform = useDerivedValue(() => {
    // Convert degrees to radians
    const rotX = (rotationX.value * Math.PI) / 180;
    const rotY = (rotationY.value * Math.PI) / 180;

    // Calculate scale with subtle depth effect
    const totalRotation = Math.abs(rotationX.value) + Math.abs(rotationY.value);
    const depthScale = interpolate(
      totalRotation,
      [0, maxRotationX + maxRotationY],
      [1, 0.9],
      "clamp"
    );

    return [
      { translateX: centerX },
      { translateY: centerY },
      { rotateX: rotX },
      { rotateY: rotY },
      { scaleX: scale * depthScale },
      { scaleY: scale * depthScale },
      { translateX: -centerX },
      { translateY: -centerY },
    ];
  });

  return (
    <Group transform={transform}>
      {typeof children === "function"
        ? children({ centerX, centerY })
        : children}
    </Group>
  );
};

export default MovableObject3D;
