import { Heading, View } from "@gluestack-ui/themed";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import { TouchableOpacity } from "react-native";

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
          <View
            bg="$ultraviolet"
            justify="center"
            items="center"
            py="$5"
            px="$8"
            rounded={50}
          >
            <Heading size="2xl" bold color="$isabelline">
              Get started
            </Heading>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AuthorizedPage;
