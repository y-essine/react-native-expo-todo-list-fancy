import { Heading, View } from "@gluestack-ui/themed";
import { router } from "expo-router";
import { TouchableOpacity } from "react-native";
import { SquircleView } from "react-native-figma-squircle";

const MainPage = () => {
  return (
    <View bg="$isabelline" flex={1} p="$8">
      <View p="$3" direction="row" justifyContent="space-between">
        <View>
          <Heading size="5xl" bold lineHeight="$5xl">
            To-Do
          </Heading>
          <Heading size="5xl" bold lineHeight="$5xl">
            List
          </Heading>
        </View>
        <View>
          <SquircleView
            style={{
              width: 70,
              height: 70,
              justifyContent: "center",
              alignItems: "center",
            }}
            squircleParams={{
              bottomLeftCornerRadius: 50,
              cornerSmoothing: 0.8,
              topRightCornerRadius: 52,
              cornerRadius: 45,
              fillColor: "#67608A",
            }}
          >
            <Heading size="4xl" bold color="$isabelline">
              +
            </Heading>
          </SquircleView>
        </View>
      </View>

      <View my="$12">
        <TouchableOpacity onPress={() => router.push("/")}>
          <SquircleView
            style={{
              width: "100%",
              height: 70,
              justifyContent: "center",
              paddingHorizontal: 20,
            }}
            squircleParams={{
              bottomLeftCornerRadius: 48,
              cornerSmoothing: 0.5,
              topRightCornerRadius: 48,
              cornerRadius: 45,
              fillColor: "#67608A",
            }}
          >
            <Heading size="2xl" bold color="$isabelline">
              Today
            </Heading>
          </SquircleView>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MainPage;
