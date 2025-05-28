import { Skia, SkPath } from "@shopify/react-native-skia";

export const createCirclePath = (width: number, height: number): SkPath => {
  const path = Skia.Path.Make();
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 4;

  path.addCircle(centerX, centerY, radius);
  return path;
};
