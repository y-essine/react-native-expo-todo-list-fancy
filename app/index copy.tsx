// App.js - React Native Expo Fancy Todo App
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Local imports
import { AnimatedCard, BlurCard, FancyCard, TodoItem } from "../src/components";
import { useTodos } from "../src/hooks/useTodos";
import { colors, filters } from "../src/theme";
import { FilterType } from "../src/types";

// Main App Component
export default function App() {
  const [newTodo, setNewTodo] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [showStats, setShowStats] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);

  const { addTodo, toggleTodo, deleteTodo, editTodo, getFilteredTodos, stats } =
    useTodos();

  const filteredTodos = getFilteredTodos(filter, search);
  const theme = darkMode ? colors.dark : colors.light;
  const handleAddTodo = () => {
    addTodo(newTodo);
    setNewTodo("");
  };

  const handleEditStart = (itemElement: View | null) => {
    if (itemElement && scrollViewRef.current) {
      // Add a small delay to ensure the editing UI is rendered
      setTimeout(() => {
        itemElement.measureLayout(
          scrollViewRef.current as any,
          (x: number, y: number, width: number, height: number) => {
            // Scroll to show the item with some extra space below it
            const extraSpace = 100; // Extra space below the card
            const scrollToY = y + height + extraSpace - 200; // 200 is roughly keyboard visible area

            scrollViewRef.current?.scrollTo({
              y: Math.max(0, scrollToY),
              animated: true,
            });
          },
          () => {
            console.log("Failed to measure layout");
          }
        );
      }, 150); // Delay to allow keyboard animation to start
    }
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <LinearGradient colors={theme.background} style={{ flex: 1 }}>
          <StatusBar
            style={darkMode ? "light" : "dark"}
            backgroundColor="transparent"
          />
          <ScrollView
            ref={scrollViewRef}
            style={{ flex: 1 }}
            contentContainerStyle={{
              padding: 20,
              paddingTop: 60,
              paddingBottom: 40,
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <AnimatedCard>
              <BlurCard style={{ marginBottom: 20 }} darkMode={darkMode}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 20,
                    minHeight: 48, // Fix for clipping on iPhone 11 Pro
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      flex: 1,
                      marginRight: 12,
                    }}
                  >
                    <LinearGradient
                      colors={[theme.primary, theme.primaryDark]}
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 16,
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 12,
                      }}
                    >
                      <Ionicons name="sparkles" size={24} color="white" />
                    </LinearGradient>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 22, // Slightly smaller to prevent clipping
                          fontWeight: "bold",
                          color: theme.text,
                          flexShrink: 1,
                        }}
                      >
                        Fancy Tasks
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          color: theme.textSecondary,
                          flexShrink: 1,
                        }}
                      >
                        Organize your life beautifully
                      </Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: "row", flexShrink: 0 }}>
                    <TouchableOpacity
                      onPress={() => setShowStats(!showStats)}
                      style={{
                        padding: 12,
                        backgroundColor: showStats
                          ? theme.primary
                          : theme.filterBackground,
                        borderRadius: 12,
                        marginRight: 8,
                      }}
                    >
                      <Ionicons
                        name="bar-chart"
                        size={20}
                        color={showStats ? "white" : theme.textSecondary}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => setDarkMode(!darkMode)}
                      style={{
                        padding: 12,
                        backgroundColor: theme.filterBackground,
                        borderRadius: 12,
                      }}
                    >
                      <Ionicons
                        name={darkMode ? "sunny" : "moon"}
                        size={20}
                        color={theme.textSecondary}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Add Todo Input */}
                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 1, marginRight: 12 }}>
                    <TextInput
                      value={newTodo}
                      onChangeText={setNewTodo}
                      placeholder="What needs to be done?"
                      placeholderTextColor={theme.textMuted}
                      style={{
                        backgroundColor: theme.inputBackground,
                        borderRadius: 16,
                        padding: 16,
                        fontSize: 16,
                        color: theme.text,
                      }}
                      returnKeyType="done"
                      blurOnSubmit={true}
                      onSubmitEditing={handleAddTodo}
                    />
                  </View>

                  <TouchableOpacity onPress={handleAddTodo}>
                    <LinearGradient
                      colors={[theme.primary, theme.primaryDark]}
                      style={{
                        padding: 16,
                        borderRadius: 16,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons name="add" size={24} color="white" />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </BlurCard>
            </AnimatedCard>
            {/* Stats */}
            {showStats && (
              <AnimatedCard delay={200}>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 12,
                    marginBottom: 20,
                  }}
                >
                  {[
                    {
                      label: "Total",
                      value: stats.total,
                      variant: "default" as const,
                    },
                    {
                      label: "Completed",
                      value: stats.completed,
                      variant: "cool" as const,
                    },
                    {
                      label: "Pending",
                      value: stats.pending,
                      variant: "warm" as const,
                    },
                    {
                      label: "High Priority",
                      value: stats.highPriority,
                      variant: "electric" as const,
                    },
                  ].map((stat, i) => (
                    <FancyCard
                      key={i}
                      darkMode={darkMode}
                      variant={stat.variant}
                      style={{
                        flex: 1,
                        minWidth: "45%",
                        innerHeight: 100,
                      }}
                    >
                      <View style={{ alignItems: "center" }}>
                        <Text
                          style={{
                            fontSize: 24,
                            fontWeight: "bold",
                            color: theme.text,
                            marginBottom: 4,
                          }}
                        >
                          {stat.value}
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            color: theme.textSecondary,
                            textAlign: "center",
                            fontWeight: "500",
                          }}
                        >
                          {stat.label}
                        </Text>
                      </View>
                    </FancyCard>
                  ))}
                </View>
              </AnimatedCard>
            )}
            {/* Search and Filters */}
            <AnimatedCard delay={300}>
              <BlurCard style={{ marginBottom: 20 }} darkMode={darkMode}>
                <View style={{ marginBottom: 16 }}>
                  <View style={{ position: "relative" }}>
                    <TextInput
                      value={search}
                      onChangeText={setSearch}
                      placeholder="Search tasks..."
                      placeholderTextColor={theme.textMuted}
                      style={{
                        backgroundColor: theme.inputBackground,
                        borderRadius: 12,
                        padding: 12,
                        paddingLeft: 40,
                        fontSize: 16,
                        color: theme.text,
                      }}
                      returnKeyType="search"
                      blurOnSubmit={true}
                    />
                    <Ionicons
                      name="search"
                      size={20}
                      color={theme.textMuted}
                      style={{ position: "absolute", left: 12, top: 12 }}
                    />
                  </View>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    {filters.map((f) => (
                      <TouchableOpacity
                        key={f}
                        onPress={() => setFilter(f as FilterType)}
                        style={{
                          paddingHorizontal: 16,
                          paddingVertical: 8,
                          borderRadius: 12,
                          backgroundColor:
                            filter === f
                              ? theme.primary
                              : theme.filterBackground,
                        }}
                      >
                        <Text
                          style={{
                            color: filter === f ? "white" : theme.textSecondary,
                            fontWeight: "500",
                            textTransform: "capitalize",
                          }}
                        >
                          {f}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </BlurCard>
            </AnimatedCard>
            {/* Todo List */}
            <View style={{ gap: 12 }}>
              {filteredTodos.map((todo, index) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  index={index}
                  darkMode={darkMode}
                  onToggle={() => toggleTodo(todo.id)}
                  onDelete={() => deleteTodo(todo.id)}
                  onEdit={(newText) => editTodo(todo.id, newText)}
                  onEditStart={handleEditStart}
                  onUpdatePriority={() => {
                    /* Implement priority update */
                  }}
                />
              ))}
            </View>
            {filteredTodos.length === 0 && (
              <AnimatedCard delay={400}>
                <View style={{ alignItems: "center", paddingVertical: 40 }}>
                  <Text style={{ fontSize: 48, marginBottom: 16 }}>📝</Text>
                  <Text
                    style={{
                      fontSize: 18,
                      color: theme.textSecondary,
                      marginBottom: 8,
                    }}
                  >
                    No tasks found
                  </Text>
                  <Text style={{ fontSize: 14, color: theme.textMuted }}>
                    Add a new task or adjust your filters
                  </Text>
                </View>
              </AnimatedCard>
            )}
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
}
