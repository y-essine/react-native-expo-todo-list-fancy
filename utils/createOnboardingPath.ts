import { Skia } from "@shopify/react-native-skia";

export const createOnboardingPath = (width: number, height: number): any => {
  const path = Skia.Path.Make();

  // Scale the coordinates to fit the provided width and height
  // Original viewBox: 500x400
  const scaleX = width / 500;
  const scaleY = height / 400;

  // Start point: M-100,200
  path.moveTo(-100 * scaleX, 200 * scaleY);

  // First cubic Bézier curve: C150,-100 200,400 450,200
  path.cubicTo(
    150 * scaleX,
    -100 * scaleY, // Control point 1
    200 * scaleX,
    400 * scaleY, // Control point 2
    450 * scaleX,
    200 * scaleY // End point
  );

  // Second cubic Bézier curve: C550,100 650,300 800,200
  path.cubicTo(
    550 * scaleX,
    100 * scaleY, // Control point 1
    650 * scaleX,
    300 * scaleY, // Control point 2
    800 * scaleX,
    200 * scaleY // End point
  );

  return path;
};
