import { config } from "@/config/gluestack-ui.config";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { useFonts } from "expo-font";
import "react-native-reanimated";

import { Slot } from "expo-router";

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Kefir: require("../assets/fonts/kefir/Kefir-Regular.otf"),
    Kefir_Bold: require("../assets/fonts/kefir/Kefir-Bold.otf"),
    Kefir_DemiBold: require("../assets/fonts/kefir/Kefir-DemiBold.otf"),
    Kefir_Medium: require("../assets/fonts/kefir/Kefir-Medium.otf"),
    Kefir_Light: require("../assets/fonts/kefir/Kefir-Light.otf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <GluestackUIProvider config={config} colorMode="light">
      <Slot />
    </GluestackUIProvider>
  );
}
