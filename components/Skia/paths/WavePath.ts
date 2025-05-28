import { createOnboardingPath } from "@/utils/createOnboardingPath";
import { SkPath } from "@shopify/react-native-skia";

export const createWavePath = (width: number, height: number): SkPath => {
  return createOnboardingPath(width, height);
};
