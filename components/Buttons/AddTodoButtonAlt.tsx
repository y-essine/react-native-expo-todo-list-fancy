import { Heading, View } from "@gluestack-ui/themed";
import { BlurView } from "expo-blur";
import { Check, Plus, X } from "lucide-react-native";
import { useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface AddTodoButtonAltProps {
  onAddTodo?: (task: string) => void;
}

const AddTodoButtonAlt = ({ onAddTodo }: AddTodoButtonAltProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [taskText, setTaskText] = useState("");

  const handleOpen = () => {
    setIsVisible(true);
  };

  const handleClose = () => {
    setIsVisible(false);
    setTaskText("");
  };

  const handleAddTask = () => {
    if (taskText.trim()) {
      onAddTodo?.(taskText.trim());
      handleClose();
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <TouchableOpacity onPress={handleOpen} activeOpacity={0.8}>
        <View
          bg="$ultraviolet"
          w={70}
          h={70}
          borderRadius={35}
          justifyContent="center"
          alignItems="center"
        >
          <Plus color="#E5E5E5" size={30} />
        </View>
      </TouchableOpacity>

      {/* Fullscreen Modal */}
      <Modal
        visible={isVisible}
        transparent
        animationType="none"
        statusBarTranslucent
      >
        <Animated.View
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(200)}
          style={{
            flex: 1,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: screenWidth,
            height: screenHeight,
          }}
        >
          <BlurView
            intensity={50}
            style={{
              flex: 1,
            }}
          >
            <SafeAreaView style={{ flex: 1 }}>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
              >
                <Pressable style={{ flex: 1 }} onPress={handleClose}>
                  <View
                    flex={1}
                    justifyContent="flex-start"
                    alignItems="center"
                    px="$8"
                    pt="$8"
                  >
                    <Animated.View
                      entering={SlideInDown.delay(100).springify()}
                      exiting={SlideOutDown.springify()}
                    >
                      <Pressable onPress={(e) => e.stopPropagation()}>
                        <View
                          bg="$ultraviolet"
                          borderRadius={30}
                          p="$8"
                          width={screenWidth - 64}
                          minHeight={300}
                        >
                          {/* Close Button */}
                          <TouchableOpacity
                            onPress={handleClose}
                            style={{
                              position: "absolute",
                              top: 16,
                              right: 16,
                              zIndex: 1,
                            }}
                          >
                            <View
                              bg="$arsenic"
                              w={40}
                              h={40}
                              borderRadius={20}
                              justifyContent="center"
                              alignItems="center"
                            >
                              <X color="#F5F3EE" size={20} />
                            </View>
                          </TouchableOpacity>

                          {/* Title */}
                          {/* <View mb="$6" mt="$4">
                          <Heading
                            size="3xl"
                            bold
                            color="$isabelline"
                            textAlign="center"
                          >
                            Add New Task
                          </Heading>
                        </View> */}

                          {/* Input Section */}
                          <View flex={1} mb="$6">
                            <TextInput
                              value={taskText}
                              onChangeText={setTaskText}
                              placeholder="What needs to be done?"
                              placeholderTextColor={"rgba(245, 243, 238, 0.5)"}
                              autoFocus
                              multiline
                              style={{
                                fontSize: 24,
                                fontWeight: "bold",
                                fontFamily: "Kefir_Bold",
                                color: "#F5F3EE",
                                flex: 1,
                                textAlignVertical: "top",
                                padding: 16,

                                borderRadius: 20,
                                minHeight: 120,
                              }}
                            />
                          </View>

                          {/* Action Buttons */}
                          <View flexDirection="row" gap="$3">
                            <TouchableOpacity
                              onPress={handleClose}
                              style={{ flex: 1 }}
                            >
                              <View
                                bg="$arsenic"
                                py="$4"
                                px="$4"
                                borderRadius={20}
                                flexDirection="row"
                                justifyContent="center"
                                alignItems="center"
                                gap="$2"
                              >
                                <Heading color="$isabelline" bold size="lg">
                                  Cancel
                                </Heading>
                              </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                              onPress={handleAddTask}
                              style={{ flex: 1 }}
                            >
                              <View
                                bg="$isabelline"
                                py="$4"
                                px="$4"
                                borderRadius={20}
                                flexDirection="row"
                                justifyContent="center"
                                alignItems="center"
                                gap="$2"
                              >
                                <Check color="#67608A" size={24} />
                                <Heading color="$ultraviolet" bold size="lg">
                                  Add Task
                                </Heading>
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </Pressable>
                    </Animated.View>
                  </View>
                </Pressable>
              </KeyboardAvoidingView>
            </SafeAreaView>
          </BlurView>
        </Animated.View>
      </Modal>
    </>
  );
};

export default AddTodoButtonAlt;
