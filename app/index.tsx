import { Heading, View } from "@gluestack-ui/themed";
import LottieView from "lottie-react-native";

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
        <Heading size="3xl" bold>
          Get started
        </Heading>
      </View>
    </View>
  );
};

export default AuthorizedPage;
