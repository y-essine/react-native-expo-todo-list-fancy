import OnboardingPath from "@/components/Skia/OnboardingPath";
import { Heading, Pressable, Text, View } from "@gluestack-ui/themed";
import { Canvas, Fill, useFont } from "@shopify/react-native-skia";
import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const GrainPage = () => {
  // Load the font for the Skia text
  const font = useFont(require("../assets/fonts/kefir/Kefir-Bold.otf"), 48);
  const centerX = (50 / 100) * screenWidth;
  const centerY = (50 / 100) * screenHeight;

  return (
    <>
      <Canvas style={styles.canvas}>
        <Fill color="#3C3549" />
        <OnboardingPath
          color="#f8d057"
          pathType="onboard1"
          scaleX={1.2}
          x={-50}
          y={0}
          delay={0} // Starts immediately
        />
        <OnboardingPath
          color="#f8d057"
          pathType="whateverLine"
          scaleX={0.5}
          scaleY={0.5}
          x={100}
          y={0}
          delay={0} // Starts 3 seconds later
        />
      </Canvas>

      <View justify="space-between" flex={1}>
        <View flex={1}>
          <SafeAreaView>
            <View p="$8">
              <Heading size="5xl" bold color="$isabelline" lineHeight="$5xl">
                Hello, Skia!
              </Heading>
              <Text color="$isabelline" mt="$2">
                This is a demo of Skia paths in React Native using Expo Router.
              </Text>
            </View>
          </SafeAreaView>
        </View>
        <View
          px="$6"
          py="$4"
          h={250}
          bg="$isabelline"
          justify="space-between"
          mt="-$5"
          borderTopStartRadius={20}
          borderTopEndRadius={20}
        >
          <View>
            <Pressable onPress={() => router.push("/main")}>
              <Heading size="3xl" bold>
                Pasta man!
              </Heading>
            </Pressable>
            <Text>I'm just tryna make path strokes work here!</Text>
          </View>
          <SafeAreaView>
            <TouchableOpacity onPress={() => router.push("/main")}>
              <View w="100%" bg="$mustard" p="$6" rounded={20}>
                <Text color="$arsenic" bold textAlign="center" size="2xl">
                  Whatever
                </Text>
              </View>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  canvas: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
  },
});

export default GrainPage;
