import { Canvas } from "@shopify/react-native-skia";
import React from "react";
import { StyleSheet, View } from "react-native";
import MovableText3D from "./MovableText3D";

// Example 1: Simple 3D text with default settings
export const Simple3DTextExample = () => {
  return (
    <View style={styles.container}>
      <Canvas style={styles.canvas}>
        <MovableText3D
          text="Hello 3D!"
          color="#f8d057"
          fontSize={48}
          xPercent={50}
          yPercent={50}
        />
      </Canvas>
    </View>
  );
};

// Example 2: Multiple 3D texts with different positions and properties
export const Multiple3DTextExample = () => {
  return (
    <View style={styles.container}>
      <Canvas style={styles.canvas}>
        {/* Title text */}
        <MovableText3D
          text="3D Text"
          color="#f8d057"
          fontSize={64}
          xPercent={50}
          yPercent={25}
          scalePercent={120}
          damping={15}
          stiffness={200}
          maxRotationX={45}
          maxRotationY={45}
        />

        {/* Subtitle text */}
        <MovableText3D
          text="Touch & Drag"
          color="#67608A"
          fontSize={32}
          xPercent={50}
          yPercent={45}
          scalePercent={80}
          damping={8}
          stiffness={100}
          maxRotationX={25}
          maxRotationY={25}
        />

        {/* Bottom text */}
        <MovableText3D
          text="Interactive!"
          color="#4ECDC4"
          fontSize={40}
          xPercent={50}
          yPercent={75}
          scalePercent={100}
          damping={12}
          stiffness={180}
          maxRotationX={35}
          maxRotationY={35}
        />
      </Canvas>
    </View>
  );
};

// Example 3: Corner positioned texts
export const CornerPositioned3DTextExample = () => {
  return (
    <View style={styles.container}>
      <Canvas style={styles.canvas}>
        {/* Top-left */}
        <MovableText3D
          text="TL"
          color="#FF6B6B"
          fontSize={36}
          xPercent={15}
          yPercent={15}
          scalePercent={90}
        />

        {/* Top-right */}
        <MovableText3D
          text="TR"
          color="#4ECDC4"
          fontSize={36}
          xPercent={85}
          yPercent={15}
          scalePercent={90}
        />

        {/* Bottom-left */}
        <MovableText3D
          text="BL"
          color="#45B7D1"
          fontSize={36}
          xPercent={15}
          yPercent={85}
          scalePercent={90}
        />

        {/* Bottom-right */}
        <MovableText3D
          text="BR"
          color="#96CEB4"
          fontSize={36}
          xPercent={85}
          yPercent={85}
          scalePercent={90}
        />

        {/* Center */}
        <MovableText3D
          text="CENTER"
          color="#FFEAA7"
          fontSize={48}
          xPercent={50}
          yPercent={50}
          scalePercent={110}
          damping={20}
          stiffness={250}
        />
      </Canvas>
    </View>
  );
};

// Example 4: Physics variations
export const PhysicsVariations3DTextExample = () => {
  return (
    <View style={styles.container}>
      <Canvas style={styles.canvas}>
        {/* Bouncy */}
        <MovableText3D
          text="Bouncy"
          color="#FF6B6B"
          fontSize={32}
          xPercent={25}
          yPercent={25}
          damping={5}
          stiffness={300}
          mass={0.5}
        />

        {/* Smooth */}
        <MovableText3D
          text="Smooth"
          color="#4ECDC4"
          fontSize={32}
          xPercent={75}
          yPercent={25}
          damping={25}
          stiffness={100}
          mass={2}
        />

        {/* Heavy */}
        <MovableText3D
          text="Heavy"
          color="#45B7D1"
          fontSize={32}
          xPercent={25}
          yPercent={75}
          damping={15}
          stiffness={50}
          mass={3}
        />

        {/* Snappy */}
        <MovableText3D
          text="Snappy"
          color="#96CEB4"
          fontSize={32}
          xPercent={75}
          yPercent={75}
          damping={8}
          stiffness={400}
          mass={0.8}
        />
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3C3549",
  },
  canvas: {
    flex: 1,
  },
});

/*
Usage Notes:

1. Position with percentages:
   - xPercent: 0-100 (0 = left edge, 50 = center, 100 = right edge)
   - yPercent: 0-100 (0 = top edge, 50 = center, 100 = bottom edge)

2. Scale with percentages:
   - scalePercent: 50 = half size, 100 = normal, 200 = double size

3. Physics properties:
   - damping: Higher = less bouncy (5-30 recommended)
   - stiffness: Higher = faster spring (50-400 recommended)
   - mass: Higher = slower/heavier movement (0.5-3 recommended)

4. Rotation limits:
   - maxRotationX/Y: Maximum rotation in degrees (15-60 recommended)

5. Example integration in your grain.tsx:

<Canvas style={styles.canvas}>
  <Fill color="#3C3549" />
  
  <OnboardingPath
    color="#f8d057"
    pathType="onboard1"
    scaleX={1.2}
    x={-50}
    y={0}
    delay={0}
  />
  
  <MovableText3D
    text="Hello, Skia!"
    color="#f8d057"
    fontSize={54}
    xPercent={50}
    yPercent={20}
    scalePercent={120}
    damping={12}
    stiffness={180}
  />
</Canvas>
*/

export default {
  Simple3DTextExample,
  Multiple3DTextExample,
  CornerPositioned3DTextExample,
  PhysicsVariations3DTextExample,
};
