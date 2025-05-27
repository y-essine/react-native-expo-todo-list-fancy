/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
  primary: "#0a0a0a", // Indigo-600
  secondary: "#e7e8e8", // Indigo-400
  background: "#e7e8e8", // Gray-100
  text: "#083427", // Gray-800
  // gray 600
  textDark: "#4B5563", // Gray-500
  // gray 500
  textMedium: "#6B7280", // Gray-600
  textLight: "#9CA3AF", // Gray-400
  white: "#FFFFFF",
  black: "#000000",
};

export default Colors;
