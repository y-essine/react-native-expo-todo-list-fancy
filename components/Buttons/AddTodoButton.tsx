import { Heading, View } from "@gluestack-ui/themed";
import { Check, Plus } from "lucide-react-native";
import { useState } from "react";
import {
  Dimensions,
  Pressable,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const { width: screenWidth } = Dimensions.get("window");

interface AddTodoButtonProps {
  onAddTodo?: (task: string) => void;
}

const AddTodoButton = ({ onAddTodo }: AddTodoButtonProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [taskText, setTaskText] = useState("");
  const animationProgress = useSharedValue(0);

  const handleExpand = () => {
    setIsExpanded(true);
    animationProgress.value = withSpring(1, {
      damping: 15,
      stiffness: 120,
    });
  };

  const handleCollapse = () => {
    if (taskText.trim()) {
      onAddTodo?.(taskText.trim());
    }
    animationProgress.value = withSpring(
      0,
      {
        damping: 15,
        stiffness: 120,
      },
      () => {
        runOnJS(setIsExpanded)(false);
        runOnJS(setTaskText)("");
      }
    );
  };

  const handleEnter = () => {
    if (taskText.trim()) {
      onAddTodo?.(taskText.trim());
    }
    handleCollapse();
  };
  const widthAnimatedStyle = useAnimatedStyle(() => {
    const width = interpolate(
      animationProgress.value,
      [0, 1],
      [70, screenWidth - 76]
    ); // 32 for padding
    const height = interpolate(animationProgress.value, [0, 1], [70, 200]);

    return {
      width,
      height,
    };
  });

  const buttonContentAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animationProgress.value,
      [0, 0.3, 1],
      [1, 0, 0]
    );

    return {
      opacity,
    };
  });

  const expandedContentAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animationProgress.value,
      [0, 0.7, 1],
      [0, 0, 1]
    );

    return {
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          right: 0,
          backgroundColor: "#67608A", // ultraviolet
          borderRadius: 30,
          justifyContent: "center",
          alignItems: "center",
          padding: 16,
          zIndex: 1000,
        },
        widthAnimatedStyle,
      ]}
    >
      {!isExpanded ? (
        <TouchableOpacity onPress={handleExpand} activeOpacity={0.8}>
          <Animated.View style={buttonContentAnimatedStyle}>
            <Plus color="white" size={30} />
          </Animated.View>
        </TouchableOpacity>
      ) : (
        <Pressable onPress={handleCollapse}>
          <Animated.View
            style={[{ flex: 1, width: "100%" }, expandedContentAnimatedStyle]}
          >
            {/* Input Section */}
            <View flex={1} marginBottom="$4">
              <TextInput
                value={taskText}
                onChangeText={setTaskText}
                placeholder="What needs to be done?"
                autoFocus
                multiline
                style={{
                  fontSize: 30,
                  fontWeight: "bold",
                  fontFamily: "Kefir_Bold",
                  color: "#F5F3EE",
                  flex: 1,
                  textAlignVertical: "center",
                  padding: 16,
                }}
              />
            </View>
            {/* Action Buttons */}
            <View flexDirection="row" gap="$3" justifyContent="space-between">
              <TouchableOpacity onPress={handleCollapse} style={{ flex: 1 }}>
                <View
                  bg="$arsenic"
                  py="$2"
                  px="$3"
                  rounded={20}
                  flexDirection="row"
                  justifyContent="center"
                  alignItems="center"
                  gap="$2"
                >
                  <Check color="#F5F3EE" size={30} />
                  <Heading color="$isabelline" bold>
                    Done
                  </Heading>
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Pressable>
      )}
    </Animated.View>
  );
};

export default AddTodoButton;
