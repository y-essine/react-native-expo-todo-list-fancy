import { HStack, Text } from "@gluestack-ui/themed";
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface TodoItemProps {
  todo: { id: string; title: string; completed: boolean };
  onToggle?: (id: string, completed: boolean) => void;
}

const TodoItem = ({ todo, onToggle }: TodoItemProps) => {
  const { title, completed } = todo;
  const [isCompleted, setIsCompleted] = useState(completed);
  const checkboxProgress = useSharedValue(completed ? 1 : 0);
  const textProgress = useSharedValue(completed ? 1 : 0);

  // Sync local state with prop changes only when the todo itself changes (different ID)
  useEffect(() => {
    setIsCompleted(completed);
    checkboxProgress.value = completed ? 1 : 0;
    textProgress.value = completed ? 1 : 0;
  }, [todo.id]); // Only depend on todo.id, not the completed state

  const handlePress = () => {
    const newCompleted = !isCompleted;
    setIsCompleted(newCompleted);

    checkboxProgress.value = withSpring(newCompleted ? 1 : 0, {
      damping: 12,
      stiffness: 200,
    });

    textProgress.value = withSpring(newCompleted ? 1 : 0, {
      damping: 15,
      stiffness: 180,
    });

    onToggle?.(todo.id, newCompleted);
  };

  const checkboxAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(checkboxProgress.value, [0, 0.5, 1], [1, 0.8, 1]);
    const backgroundColor = interpolateColor(
      checkboxProgress.value,
      [0, 1],
      ["transparent", "#67608A"] // ultraviolet color
    );

    return {
      transform: [{ scale }],
      backgroundColor,
    };
  });

  const checkmarkAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(checkboxProgress.value, [0, 0.6, 1], [0, 0, 1]);
    const opacity = interpolate(checkboxProgress.value, [0, 0.6, 1], [0, 0, 1]);

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(textProgress.value, [0, 1], [1, 0.5]);

    return {
      opacity,
    };
  });

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <HStack mb="$3" gap="$3" alignItems="center">
        <Animated.View
          style={[
            {
              width: 35,
              height: 35,
              borderRadius: 17.5,
              borderWidth: 5,
              borderColor: "#67608A", // ultraviolet
              justifyContent: "center",
              alignItems: "center",
            },
            checkboxAnimatedStyle,
          ]}
        >
          <Animated.Text
            style={[
              {
                color: "#F5F3EE", // isabelline
                fontSize: 18,
                fontWeight: "bold",
              },
              checkmarkAnimatedStyle,
            ]}
          >
            ✓
          </Animated.Text>
        </Animated.View>

        <Animated.View style={[{ flex: 1 }, textAnimatedStyle]}>
          <Text fontSize={25} bold>
            {title}
          </Text>
        </Animated.View>
      </HStack>
    </TouchableOpacity>
  );
};

export default TodoItem;
