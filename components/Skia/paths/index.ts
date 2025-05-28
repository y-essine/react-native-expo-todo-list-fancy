import { SkPath } from "@shopify/react-native-skia";
import { createCirclePath } from "./CirclePath";
import { createOnboard1Path } from "./Onboard1Path";
import { createOnboard2Path } from "./Onboard2Path";
import { createSpiralPath } from "./SpiralPath";
import { createWavePath } from "./WavePath";

export type PathType = "wave" | "circle" | "onboard1" | "onboard2" | "spiral";

export interface PathConfig {
  name: string;
  createPath: (width: number, height: number) => SkPath;
  duration?: number;
  strokeWidth?: number;
}

export const pathRegistry: Record<PathType, PathConfig> = {
  wave: {
    name: "Wave",
    createPath: createWavePath,
    duration: 3000,
    strokeWidth: 4,
  },
  circle: {
    name: "Circle",
    createPath: createCirclePath,
    duration: 2000,
    strokeWidth: 3,
  },
  onboard1: {
    name: "Onboard Path 1",
    createPath: createOnboard1Path,
    duration: 4000,
    strokeWidth: 5,
  },
  onboard2: {
    name: "Onboard Path 2",
    createPath: createOnboard2Path,
    duration: 3500,
    strokeWidth: 5,
  },
  spiral: {
    name: "Spiral",
    createPath: createSpiralPath,
    duration: 2500,
    strokeWidth: 3,
  },
};

export const getPathConfig = (pathType: PathType): PathConfig => {
  return pathRegistry[pathType] || pathRegistry.wave;
};
