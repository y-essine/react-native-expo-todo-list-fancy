import { Skia, SkPath } from "@shopify/react-native-skia";

export const createSpiralPath = (width: number, height: number): SkPath => {
  const path = Skia.Path.Make();
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(width, height) / 3;

  // Create a spiral
  let angle = 0;
  let radius = 0;
  const steps = 200;
  const radiusIncrement = maxRadius / steps;
  const angleIncrement = (Math.PI * 6) / steps; // 3 full rotations

  // Start at center
  path.moveTo(centerX, centerY);

  for (let i = 0; i < steps; i++) {
    radius += radiusIncrement;
    angle += angleIncrement;

    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    path.lineTo(x, y);
  }

  return path;
};
