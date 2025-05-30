import { config } from "@/config/gluestack-ui.config";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Kefir_Regular: require("../assets/fonts/kefir/Kefir-Regular.otf"),
    Kefir_Bold: require("../assets/fonts/kefir/Kefir-Bold.otf"),
    Kefir_DemiBold: require("../assets/fonts/kefir/Kefir-DemiBold.otf"),
    Kefir_Medium: require("../assets/fonts/kefir/Kefir-Medium.otf"),
    Kefir_Light: require("../assets/fonts/kefir/Kefir-Light.otf"),
    Signika: require("../assets/fonts/SignikaNegative-Medium.ttf"),
    Bogart_Medium: require("../assets/fonts/Bogart-Medium-trial.ttf"),
    Bogart_Semibold_Italic: require("../assets/fonts/Bogart-Semibold-Italic-trial.ttf"),
  });
  // const [skiaLoaded, setSkiaLoaded] = useState(false);

  // Add this to your _layout.tsx useEffect
  // useEffect(() => {
  //   if (Platform.OS === "web") {
  //     console.log("Loading Skia Web...");

  //     // Check if canvaskit.wasm is accessible
  //     fetch('/canvaskit.wasm')
  //       .then(response => {
  //         console.log("canvaskit.wasm status:", response.status);
  //         return LoadSkiaWeb({
  //           locateFile: (file) => `/${file}`
  //         });
  //       })
  //       .then(() => {
  //         console.log("Skia Web loaded successfully");
  //         setSkiaLoaded(true);
  //       })
  //       .catch((error) => {
  //         console.error("Failed to load Skia Web:", error);
  //         setSkiaLoaded(true); // Don't block the app
  //       });
  //   }
  // }, []);
  {
    /* <Canvas
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <OnboardingPath
            color="#f8d057"
            pathType="whateverLine"
            scaleX={0.5}
            scaleY={0.5}
            x={100}
            y={0}
            delay={0} // Starts 3 seconds later
          />
          <Image
            image={grain}
            x={0}
            y={0}
            width={400}
            height={880}
            fit="cover"
            blendMode="multiply"
            opacity={0.4}
            transform={[{ scaleX: 2 }, { scaleY: 2 }]}
          />
        </Canvas> */
  }

  if (Platform.OS === "web") {
  }

  if (!fontsLoaded) {
    // Async font loading only occurs in development.
    return null;
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GluestackUIProvider config={config} colorMode="light">
        <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="main" />
        </Stack>
      </GluestackUIProvider>
    </GestureHandlerRootView>
  );
}
