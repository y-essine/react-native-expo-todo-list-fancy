import FadeView from "@/components/FadeView";
import { Heading, View } from "@gluestack-ui/themed";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import { useRef, useState } from "react";
import { Dimensions, SafeAreaView, TouchableOpacity } from "react-native";

const { width, height } = Dimensions.get("window");

const StartPage = () => {
  const [expanded, setExpanded] = useState(false);
  const LottieRef = useRef(null);

  const toggle = () => {
    console.log("Toggle pressed");
    LottieRef.current?.play();

    setExpanded(!expanded);
    setTimeout(() => {
      router.push("/main");
      setExpanded(false);
    }, 4000);
  };

  return (
    <View bg="$ship" flex={1} justify="center" alignItems="center">
      <SafeAreaView />
      <LottieView
        source={require("../assets/anims/start_dailyt.json")}
        autoPlay={false}
        loop={false}
        ref={LottieRef}
        style={{
          flex: 1,
          position: "absolute",
          width,
          height,
          transform: [{ scale: 1.6 }],
        }}
      />
      {/* <BlobTransition expanded={expanded} /> */}
      {/* <MorphingCircle /> */}
      <FadeView visible={!expanded}>
        <View justify="center" alignItems="center" p="$4">
          <Heading
            fontSize={76}
            lineHeight={108}
            color="$bone"
            fontFamily="$bogart"
            mt={-30}
          >
            Get
          </Heading>
          <Heading
            fontSize={76}
            lineHeight={108}
            color="$bone"
            fontFamily="$bogartSbItalic"
            mt={-30}
          >
            things
          </Heading>
          <Heading
            fontSize={76}
            lineHeight={108}
            color="$bone"
            fontFamily="$bogart"
            mt={-30}
          >
            done.
          </Heading>
        </View>
      </FadeView>
      <View
        style={{
          width: 372,
          height: 349,
          transform: [{ translateX: -10 }, { translateY: -20 }],
        }}
      >
        {/* <LottieView
          source={require("../assets/anims/start_dailyto.json")}
          autoPlay={false}
          loop={false}
          ref={LottieRef}
          style={{ width: 392, height: 392 }}
        /> */}
      </View>
      <FadeView visible={!expanded}>
        <View>
          <TouchableOpacity onPress={toggle}>
            <View
              bg="$ultraviolet"
              justify="center"
              items="center"
              py="$2"
              px="$10"
              rounded={50}
            >
              <Heading size="3xl" color="$bone" fontFamily="$bogartSbItalic">
                Get started
              </Heading>
            </View>
          </TouchableOpacity>
          <SafeAreaView />
        </View>
      </FadeView>
    </View>
  );
};

export default StartPage;
