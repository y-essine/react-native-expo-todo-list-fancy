import { Heading, View } from "@gluestack-ui/themed";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import { TouchableOpacity } from "react-native";
import { SquircleView } from "react-native-figma-squircle";

const AuthorizedPage = () => {
  return (
    <View bg="$isabelline" flex={1} justify="center" alignItems="center">
      <View justify="center" alignItems="center">
        <Heading size="5xl" bold lineHeight="$5xl">
          Get
        </Heading>
        <Heading size="5xl" bold lineHeight="$5xl">
          things
        </Heading>
        <Heading size="5xl" bold lineHeight="$5xl">
          done!
        </Heading>
      </View>

      <View style={{ width: 300, height: 300 }}>
        <LottieView
          source={require("../assets/anims/poker.json")}
          autoPlay
          loop
          style={{ width: 300, height: 300 }}
        />
      </View>
      <View>
        <TouchableOpacity onPress={() => router.push("/main")}>
          <SquircleView
            style={{
              width: 300,
              height: 85,
              justifyContent: "center",
              alignItems: "center",
            }}
            squircleParams={{
              bottomLeftCornerRadius: 48,
              cornerSmoothing: 0.5,
              topRightCornerRadius: 48,
              cornerRadius: 45,
              fillColor: "#67608A",
            }}
          >
            <Heading size="3xl" bold color="$isabelline">
              Get started
            </Heading>
          </SquircleView>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AuthorizedPage;
