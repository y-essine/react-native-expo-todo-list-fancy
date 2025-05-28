import { Skia } from "@shopify/react-native-skia";

// Helper function to add controlled randomness
const randomInRange = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

// Helper function to ensure smooth curves by calculating control points
const calculateSmoothControlPoints = (
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  curvature: number = 0.5,
  randomFactor: number = 0.3
) => {
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;

  // Add controlled randomness to the control points
  const randomOffsetX =
    randomInRange(-randomFactor, randomFactor) * Math.abs(endX - startX);
  const randomOffsetY =
    randomInRange(-randomFactor, randomFactor) * Math.abs(endY - startY);

  const cp1X = startX + (midX - startX) * curvature + randomOffsetX;
  const cp1Y = startY + (midY - startY) * curvature + randomOffsetY;

  const cp2X = endX - (endX - midX) * curvature + randomOffsetX * 0.5;
  const cp2Y = endY - (endY - midY) * curvature + randomOffsetY * 0.5;

  return { cp1X, cp1Y, cp2X, cp2Y };
};

export const createOnboardingPath = (width: number, height: number): any => {
  const path = Skia.Path.Make();

  // Random starting parameters
  const startX = randomInRange(-150, -80);
  const startY = randomInRange(height * 0.2, height * 0.4);

  // Random loop positions with constraints to ensure good flow
  const loop1X = randomInRange(width * 0.2, width * 0.4);
  const loop1Y = randomInRange(height * 0.15, height * 0.35);

  const loop2X = randomInRange(width * 0.55, width * 0.75);
  const loop2Y = randomInRange(height * 0.3, height * 0.6);

  // Random exit point
  const exitX = randomInRange(width + 80, width + 150);
  const exitY = randomInRange(height * 0.25, height * 0.55);

  path.moveTo(startX, startY);

  // First curve - entry to first loop
  const curve1 = calculateSmoothControlPoints(
    startX,
    startY,
    loop1X,
    loop1Y,
    0.6,
    0.2
  );
  path.cubicTo(
    curve1.cp1X,
    curve1.cp1Y,
    curve1.cp2X,
    curve1.cp2Y,
    loop1X,
    loop1Y
  );

  // Second curve - first loop to second loop
  const curve2 = calculateSmoothControlPoints(
    loop1X,
    loop1Y,
    loop2X,
    loop2Y,
    0.7,
    0.25
  );
  path.cubicTo(
    curve2.cp1X,
    curve2.cp1Y,
    curve2.cp2X,
    curve2.cp2Y,
    loop2X,
    loop2Y
  );

  // Third curve - second loop to exit
  const curve3 = calculateSmoothControlPoints(
    loop2X,
    loop2Y,
    exitX,
    exitY,
    0.5,
    0.2
  );
  path.cubicTo(
    curve3.cp1X,
    curve3.cp1Y,
    curve3.cp2X,
    curve3.cp2Y,
    exitX,
    exitY
  );

  // Optional: Add a subtle wave variation along the path
  const shouldAddWave = Math.random() > 0.5;
  if (shouldAddWave) {
    // Create a new path with subtle wave variations
    const wavyPath = Skia.Path.Make();
    const segments = 50;
    const pathLength = Math.sqrt(
      Math.pow(exitX - startX, 2) + Math.pow(exitY - startY, 2)
    );

    // Sample points along the original path and add subtle variations
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const point = path.getPoint(t);

      if (point) {
        const waveAmplitude = randomInRange(2, 8);
        const waveFrequency = randomInRange(0.02, 0.05);
        const waveOffset =
          Math.sin(t * Math.PI * 2 * waveFrequency) * waveAmplitude;

        const adjustedX = point.x + waveOffset * Math.cos(t * Math.PI * 2);
        const adjustedY = point.y + waveOffset * Math.sin(t * Math.PI * 2);

        if (i === 0) {
          wavyPath.moveTo(adjustedX, adjustedY);
        } else {
          wavyPath.lineTo(adjustedX, adjustedY);
        }
      }
    }

    return wavyPath;
  }

  return path;
};
