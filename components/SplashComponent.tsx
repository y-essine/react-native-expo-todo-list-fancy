import { View } from "@gluestack-ui/themed";
import { router, useLocalSearchParams } from "expo-router";
import LottieView from "lottie-react-native";
import { useEffect } from "react";
import { TouchableOpacity } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const SplashComponent = () => {
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const { next, time } = useLocalSearchParams();

  const nextRoute = next ? next + "" : "/";

  useEffect(() => {
    if (next) console.log("next", next);
  }, [next, time]);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 1000, easing: Easing.ease });
    setTimeout(() => {
      router.replace(nextRoute);
    }, time - 0 || 3000);
  }, []);

  return (
    <View flex="1" items="center" justify="center">
      <View w={150} h={150}>
        <Animated.View style={[animatedStyle]}>
          <TouchableOpacity onPress={() => router.replace(next + "")}>
            {/* @ts-ignore */}
            <LottieView
              source={require("@/assets/anims/sims.json")}
              autoPlay
              style={{ width: 150, height: 150 }}
              onAnimationFinish={() => {
                console.log("finished splash");
                router.replace(next + "");
              }}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

export default SplashComponent;
