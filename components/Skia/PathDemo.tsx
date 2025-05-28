import { Canvas } from "@shopify/react-native-skia";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import OnboardingPath from "./OnboardingPath";
import { PathType } from "./paths";

const PathDemo = () => {
  const [currentPathType, setCurrentPathType] = useState<PathType>("wave");
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const pathTypes: PathType[] = [
    "wave",
    "circle",
    "onboard1",
    "onboard2",
    "spiral",
  ];

  const cyclePath = () => {
    const currentIndex = pathTypes.indexOf(currentPathType);
    const nextIndex = (currentIndex + 1) % pathTypes.length;
    setCurrentPathType(pathTypes[nextIndex]);
  };

  return (
    <View style={styles.container}>
      <Canvas style={styles.canvas}>
        <OnboardingPath
          color="#58B3B3"
          pathType={currentPathType}
          autoPlay={isAutoPlay}
          onAnimationComplete={() => {
            console.log(`${currentPathType} animation completed`);
          }}
        />
      </Canvas>

      <View style={styles.controls}>
        <Text style={styles.currentPath}>Current: {currentPathType}</Text>

        <TouchableOpacity style={styles.button} onPress={cyclePath}>
          <Text style={styles.buttonText}>Next Path</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsAutoPlay(!isAutoPlay)}
        >
          <Text style={styles.buttonText}>{isAutoPlay ? "Pause" : "Play"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  canvas: {
    flex: 1,
  },
  controls: {
    padding: 20,
    backgroundColor: "#111",
    gap: 10,
  },
  currentPath: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#58B3B3",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PathDemo;
