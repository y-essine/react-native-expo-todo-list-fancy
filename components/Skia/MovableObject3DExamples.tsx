import {
  Circle,
  Rect,
  Text as SkiaText,
  useFont,
} from "@shopify/react-native-skia";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import MovableObject3D from "./MovableObject3D";
import TouchableSkiaCanvas from "./TouchableSkiaCanvas";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Example 1: 3D Text
export const MovableText3DExample = () => {
  const font = useFont(require("../../assets/fonts/kefir/Kefir-Bold.otf"), 48);
  const centerX = (50 / 100) * screenWidth;
  const centerY = (50 / 100) * screenHeight;

  return (
    <View style={styles.container}>
      <TouchableSkiaCanvas>
        <MovableObject3D
          xPercent={50}
          yPercent={50}
          scalePercent={100}
          damping={10}
          stiffness={150}
          maxRotationX={30}
          maxRotationY={30}
          width={200}
          height={60}
        >
          <SkiaText
            x={centerX}
            y={centerY}
            text="3D Text!"
            font={font}
            color="#4ECDC4"
          />
        </MovableObject3D>
      </TouchableSkiaCanvas>
    </View>
  );
};

// Example 2: 3D Shape (Circle)
export const MovableCircle3DExample = () => {
  const centerX = (50 / 100) * screenWidth;
  const centerY = (50 / 100) * screenHeight;

  return (
    <View style={styles.container}>
      <TouchableSkiaCanvas>
        <MovableObject3D
          xPercent={50}
          yPercent={50}
          scalePercent={100}
          damping={15}
          stiffness={200}
          maxRotationX={45}
          maxRotationY={45}
          width={80}
          height={80}
        >
          <Circle cx={centerX} cy={centerY} r={40} color="#FF6B6B" />
        </MovableObject3D>
      </TouchableSkiaCanvas>
    </View>
  );
};

// Example 3: 3D Rectangle
export const MovableRect3DExample = () => {
  const centerX = (50 / 100) * screenWidth;
  const centerY = (50 / 100) * screenHeight;

  return (
    <View style={styles.container}>
      <TouchableSkiaCanvas>
        <MovableObject3D
          xPercent={50}
          yPercent={50}
          scalePercent={100}
          damping={8}
          stiffness={300}
          maxRotationX={60}
          maxRotationY={60}
          width={120}
          height={80}
        >
          <Rect
            x={centerX - 60}
            y={centerY - 40}
            width={120}
            height={80}
            color="#96CEB4"
          />
        </MovableObject3D>
      </TouchableSkiaCanvas>
    </View>
  );
};

// Example 4: Multiple 3D Objects
export const Multiple3DObjectsExample = () => {
  const font = useFont(require("../../assets/fonts/kefir/Kefir-Bold.otf"), 32);

  const text1X = (25 / 100) * screenWidth;
  const text1Y = (30 / 100) * screenHeight;

  const text2X = (75 / 100) * screenWidth;
  const text2Y = (30 / 100) * screenHeight;

  const circleX = (50 / 100) * screenWidth;
  const circleY = (70 / 100) * screenHeight;

  return (
    <View style={styles.container}>
      <TouchableSkiaCanvas>
        {/* Left Text */}
        <MovableObject3D
          xPercent={25}
          yPercent={30}
          scalePercent={80}
          damping={12}
          stiffness={180}
          maxRotationX={35}
          maxRotationY={35}
          width={150}
          height={50}
        >
          <SkiaText
            x={text1X}
            y={text1Y}
            text="Left"
            font={font}
            color="#FF6B6B"
          />
        </MovableObject3D>

        {/* Right Text */}
        <MovableObject3D
          xPercent={75}
          yPercent={30}
          scalePercent={80}
          damping={12}
          stiffness={180}
          maxRotationX={35}
          maxRotationY={35}
          width={150}
          height={50}
        >
          <SkiaText
            x={text2X}
            y={text2Y}
            text="Right"
            font={font}
            color="#4ECDC4"
          />
        </MovableObject3D>

        {/* Bottom Circle */}
        <MovableObject3D
          xPercent={50}
          yPercent={70}
          scalePercent={100}
          damping={8}
          stiffness={250}
          maxRotationX={50}
          maxRotationY={50}
          width={60}
          height={60}
        >
          <Circle cx={circleX} cy={circleY} r={30} color="#96CEB4" />
        </MovableObject3D>
      </TouchableSkiaCanvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3C3549",
  },
});

export default {
  MovableText3DExample,
  MovableCircle3DExample,
  MovableRect3DExample,
  Multiple3DObjectsExample,
};
