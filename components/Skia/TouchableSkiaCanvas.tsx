import { Canvas, Fill } from "@shopify/react-native-skia";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";
import InteractiveText3D from "./InteractiveText3D";
import MovableObject3D from "./MovableObject3D";

interface TouchableSkiaCanvasProps {
  children?: React.ReactNode;
  style?: any;
}

const TouchableSkiaCanvas: React.FC<TouchableSkiaCanvasProps> = ({
  children,
  style,
}) => {
  // Shared values for touch coordinates
  const touchX = useSharedValue(0);
  const touchY = useSharedValue(0);
  const isPressed = useSharedValue(false);
  // Pan gesture to track touch position
  const panGesture = Gesture.Pan()
    .onBegin((event) => {
      isPressed.value = true;
      touchX.value = event.x;
      touchY.value = event.y;
    })
    .onUpdate((event) => {
      touchX.value = event.x;
      touchY.value = event.y;
    })
    .onEnd(() => {
      isPressed.value = false;
    })
    .onFinalize(() => {
      isPressed.value = false;
    });

  // Tap gesture for single touches
  const tapGesture = Gesture.Tap()
    .onStart((event) => {
      isPressed.value = true;
      touchX.value = event.x;
      touchY.value = event.y;
    })
    .onEnd(() => {
      isPressed.value = false;
    });

  // Combine gestures
  const combinedGesture = Gesture.Race(panGesture, tapGesture);
  return (
    <GestureDetector gesture={combinedGesture}>
      <View style={[styles.container, style]}>
        <Canvas style={styles.canvas}>
          <Fill color="#3C3549" />
          {/* Clone children and pass touch values to Interactive components */}
          {React.Children.map(children, (child) => {
            if (
              React.isValidElement(child) &&
              (child.type === InteractiveText3D ||
                child.type === MovableObject3D)
            ) {
              return React.cloneElement(child as any, {
                touchX,
                touchY,
                isPressed,
              });
            }
            return child;
          })}
        </Canvas>
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvas: {
    flex: 1,
  },
});

export default TouchableSkiaCanvas;
