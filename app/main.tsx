import AddTodoButtonAlt from "@/components/Buttons/AddTodoButtonAlt";
import TodoItem from "@/components/Todo/TodoItem";
import {
  Heading,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "@gluestack-ui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import { TouchableOpacity } from "react-native";

interface Todo {
  id: string; // Optional ID for future use
  title: string;
  completed: boolean;
}

const MainPage = () => {
  const [todos, setTodos] = useState<Todo[]>([
    { id: "5", title: "Do the laundry", completed: false },
    { id: "4", title: "Buy groceries and walk the dog", completed: false },
    { id: "3", title: "Finish the project report", completed: false },
    { id: "2", title: "Call the bank", completed: false },
    { id: "1", title: "Get familiar with React Native Skia", completed: false },
  ]);

  const handleToggleTodo = (id: string, completed: boolean) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.id === id ? { ...todo, completed } : todo))
    );
  };
  const handleAddTodo = (task: string) => {
    console.log("New task:", task);
    // Handle adding task logic here
    setTodos([
      { id: Date.now().toString(), title: task, completed: false },
      ...todos,
    ]); // Add new task to the beginning of the list
  };

  return (
    <SafeAreaView bg="#FFF0E2" flex={1}>
      <View flex={1} px="$8">
        <View p="$3" flexDirection="row" justifyContent="space-between">
          <View>
            <Heading size="5xl" bold lineHeight="$5xl">
              To-Do
            </Heading>
            <Heading size="5xl" bold lineHeight="$5xl">
              List
            </Heading>
          </View>
          <View>
            <AddTodoButtonAlt onAddTodo={handleAddTodo} />
          </View>
        </View>
        <View mt="$8">
          <TouchableOpacity onPress={() => router.push("/")}>
            <View
              bg="$ultraviolet"
              justify="center"
              py="$5"
              px="$8"
              rounded={35}
            >
              <Heading size="2xl" bold color="$textLight100">
                Today
              </Heading>
            </View>
          </TouchableOpacity>
        </View>

        <View flex={1}>
          <LinearGradient
            colors={[
              "rgba(245, 243, 238, 1)",
              "rgba(245, 243, 238, 0.5)",
              "rgba(245, 243, 238, 0)",
            ]}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 20,
              zIndex: 1,
              pointerEvents: "none",
            }}
          />
          <ScrollView px="$1" pt="$12" flex={1}>
            {todos.map((todo, index) => (
              <TodoItem key={index} todo={todo} onToggle={handleToggleTodo} />
            ))}
            {/* Example TodoItems for testing */}
            {/* <TodoItem title="Do the laundry" />
            <TodoItem title="Buy groceries and walk the dog" />
            <TodoItem title="Finish the project report" />
            <TodoItem title="Call the bank" />
            <TodoItem title="Get familiar with React Native Skia" /> */}
          </ScrollView>
          <LinearGradient
            colors={["rgba(245, 243, 238, 0)", "rgba(245, 243, 238, 1)"]}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 20,
              width: "100%",
              zIndex: 1,
              pointerEvents: "none",
            }}
          />
        </View>

        <View position="absolute" bottom={0} left={0} right={0} p="$8">
          <TouchableOpacity onPress={() => router.push("/grain")}>
            <View
              bg="$backgroundLight150"
              justify="center"
              py="$5"
              px="$8"
              rounded={30}
              boxShadow="0 4px 6px rgba(0, 0, 0, 0.24)"
            >
              <View>
                <View direction="row" justify="space-between">
                  <Text size="2xl">Go to the!</Text>
                  <Heading size="xl" bold color="$outerspace">
                    🙌
                  </Heading>
                </View>
                <Text mt="$1">Click here to go back to the home page</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MainPage;
