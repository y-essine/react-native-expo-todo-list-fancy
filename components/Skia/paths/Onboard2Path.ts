import { svgToSkiaPath } from "@/utils/svgToSkiaPath";
import { SkPath } from "@shopify/react-native-skia";

const ONBOARD_1_2_PATH =
  "M641.77 2.5C442.58 80.1603 63.3867 294.598 140.131 531.069C216.876 767.539 427.946 665.498 411.935 557.241C400.408 479.294 331.192 425.637 255.048 435.619C160.117 457.685 -22.6512 537.227 5.7283 678.863C34.1078 820.499 63.1869 829.736 121.145 859.5";

export const createOnboard2Path = (width: number, height: number): SkPath => {
  return svgToSkiaPath(ONBOARD_1_2_PATH, width, height);
};
