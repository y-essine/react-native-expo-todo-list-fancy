import { Heading, View } from "@gluestack-ui/themed";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import { SafeAreaView, TouchableOpacity } from "react-native";

const StartPage = () => {
  return (
    <View bg="$ship" flex={1} justify="center" alignItems="center">
      <SafeAreaView />
      <View justify="center" alignItems="center" p="$4">
        <Heading
          fontSize={88}
          lineHeight={108}
          color="$bone"
          fontFamily="$bogart"
        >
          Get
        </Heading>
        <Heading
          fontSize={88}
          lineHeight={108}
          color="$bone"
          fontFamily="$bogartSbItalic"
          mt={-30}
        >
          things
        </Heading>
        <Heading
          fontSize={88}
          lineHeight={108}
          color="$bone"
          fontFamily="$bogart"
          mt={-30}
        >
          done!
        </Heading>
      </View>
      <View
        style={{
          width: 372,
          height: 349,
          transform: [{ translateX: -10 }, { translateY: -20 }],
        }}
      >
        <LottieView
          source={require("../assets/anims/TakraAnim.json")}
          autoPlay
          loop
          style={{ width: 392, height: 392 }}
        />
      </View>
      <View>
        <TouchableOpacity onPress={() => router.push("/main")}>
          <View
            bg="$ultraviolet"
            justify="center"
            items="center"
            py="$2"
            px="$10"
            rounded={50}
          >
            <Heading size="3xl" color="$bone" fontFamily="$bogart">
              Get started
            </Heading>
          </View>
        </TouchableOpacity>
        <SafeAreaView />
      </View>
    </View>
  );
};

export default StartPage;
