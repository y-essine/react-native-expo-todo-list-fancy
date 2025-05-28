// Example usage of OnboardingPath component

import OnboardingPath from "@/components/Skia/OnboardingPath";
import { PathType } from "@/components/Skia/paths";
import { Canvas } from "@shopify/react-native-skia";
import React, { useState } from "react";
import { StyleSheet } from "react-native";

// Example 1: Simple usage with default wave animation
export const SimplePathExample = () => {
  return (
    <Canvas style={styles.canvas}>
      <OnboardingPath color="#58B3B3" />
    </Canvas>
  );
};

// Example 2: Cycling through different path types
export const CyclingPathsExample = () => {
  const [pathIndex, setPathIndex] = useState(0);
  const pathTypes: PathType[] = [
    "wave",
    "circle",
    "onboard1",
    "onboard2",
    "spiral",
  ];

  return (
    <Canvas style={styles.canvas}>
      <OnboardingPath
        color="#FF6B6B"
        pathType={pathTypes[pathIndex]}
        onAnimationComplete={() => {
          setPathIndex((prev) => (prev + 1) % pathTypes.length);
        }}
      />
    </Canvas>
  );
};

// Example 3: Manual control with auto-play disabled
export const ManualControlExample = () => {
  const [currentPath, setCurrentPath] = useState<PathType>("onboard1");

  const switchToNextPath = () => {
    const paths: PathType[] = ["onboard1", "onboard2"];
    const currentIndex = paths.indexOf(currentPath);
    const nextIndex = (currentIndex + 1) % paths.length;
    setCurrentPath(paths[nextIndex]);
  };

  return (
    <Canvas style={styles.canvas}>
      <OnboardingPath color="#4ECDC4" pathType={currentPath} autoPlay={false} />
    </Canvas>
  );
};

// Example 4: Multiple paths with different colors
export const MultiplePathsExample = () => {
  return (
    <Canvas style={styles.canvas}>
      <OnboardingPath color="#FF6B6B" pathType="wave" />
      <OnboardingPath color="#4ECDC4" pathType="circle" />
      <OnboardingPath color="#45B7D1" pathType="spiral" />
    </Canvas>
  );
};

// Example 5: Onboarding sequence
export const OnboardingSequence = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps: { path: PathType; color: string }[] = [
    { path: "onboard1", color: "#58B3B3" },
    { path: "onboard2", color: "#FF6B6B" },
    { path: "wave", color: "#4ECDC4" },
  ];

  const handleAnimationComplete = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Reset to beginning or navigate to next screen
      setCurrentStep(0);
    }
  };

  return (
    <Canvas style={styles.canvas}>
      <OnboardingPath
        color={steps[currentStep].color}
        pathType={steps[currentStep].path}
        onAnimationComplete={handleAnimationComplete}
      />
    </Canvas>
  );
};

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    backgroundColor: "#000",
  },
});

/*
Usage in your main component:

import { Canvas } from '@shopify/react-native-skia';
import OnboardingPath from './components/Skia/OnboardingPath';

function App() {
  return (
    <View style={{ flex: 1 }}>
      <Canvas style={{ flex: 1 }}>
        <OnboardingPath 
          color="#58B3B3" 
          pathType="onboard1"
          onAnimationComplete={() => {
            console.log('Animation completed!');
          }}
        />
      </Canvas>
    </View>
  );
}

Available path types:
- 'wave': The original wave path you created
- 'circle': A simple circle animation
- 'onboard1': Path from your onboard-1-1.svg file
- 'onboard2': Path from your onboard-1-2.svg file
- 'spiral': A spiral animation

Props:
- color: string (required) - The color of the path stroke
- pathType: PathType (optional, default: 'wave') - Which path animation to use
- autoPlay: boolean (optional, default: true) - Whether to start animation automatically
- onAnimationComplete: () => void (optional) - Callback when animation cycle completes
*/
