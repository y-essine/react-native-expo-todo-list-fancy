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
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Local imports
import {
  AnimatedCard,
  BlurCard,
  FancyView,
  FloatingParticles,
  GlassInput,
  GlassModal,
  GlassMorphButton,
  GlassProgressBar,
  GlassToast,
  HolographicCard,
  TodoItem,
} from "../src/components";
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
  const [showModal, setShowModal] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<
    "success" | "error" | "warning" | "info"
  >("success");
  const scrollViewRef = useRef<ScrollView>(null);

  const { addTodo, toggleTodo, deleteTodo, editTodo, getFilteredTodos, stats } =
    useTodos();

  const filteredTodos = getFilteredTodos(filter, search);
  const theme = darkMode ? colors.dark : colors.light;
  const handleAddTodo = () => {
    if (newTodo.trim()) {
      addTodo(newTodo);
      setNewTodo("");
      showToast("Task added successfully!", "success");
    } else {
      showToast("Please enter a task", "warning");
    }
  };

  const showToast = (message: string, type: typeof toastType) => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
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
        <FancyView
          darkMode={darkMode}
          variant="default"
          enableAnimations={true}
          intensity="low"
          style={{ flex: 1 }}
        >
          {/* Floating Particles Background */}
          <FloatingParticles
            darkMode={darkMode}
            particleCount={6}
            intensity="medium"
          />

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
                  <View style={{ flexDirection: "row", flexShrink: 0, gap: 8 }}>
                    <GlassMorphButton
                      onPress={() => setShowModal(true)}
                      icon="settings"
                      variant="accent"
                      size="small"
                      darkMode={darkMode}
                    />

                    <GlassMorphButton
                      onPress={() => setShowStats(!showStats)}
                      icon="bar-chart"
                      variant={showStats ? "primary" : "secondary"}
                      size="small"
                      darkMode={darkMode}
                    />

                    <GlassMorphButton
                      onPress={() => setDarkMode(!darkMode)}
                      icon={darkMode ? "sunny" : "moon"}
                      variant="secondary"
                      size="small"
                      darkMode={darkMode}
                    />
                  </View>
                </View>
                {/* Add Todo Input */}
                <GlassInput
                  value={newTodo}
                  onChangeText={setNewTodo}
                  placeholder="What needs to be done?"
                  darkMode={darkMode}
                  onSubmit={handleAddTodo}
                  icon="add-circle-outline"
                  submitIcon="send"
                />
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
                      color: darkMode
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(0, 0, 0, 0.05)",
                      borderColor: darkMode
                        ? "rgba(255, 255, 255, 0.2)"
                        : "rgba(0, 0, 0, 0.1)",
                    },
                    {
                      label: "Completed",
                      value: stats.completed,
                      color: darkMode
                        ? "rgba(34, 197, 94, 0.15)"
                        : "rgba(34, 197, 94, 0.1)",
                      borderColor: darkMode
                        ? "rgba(34, 197, 94, 0.3)"
                        : "rgba(34, 197, 94, 0.2)",
                    },
                    {
                      label: "Pending",
                      value: stats.pending,
                      color: darkMode
                        ? "rgba(249, 115, 22, 0.15)"
                        : "rgba(249, 115, 22, 0.1)",
                      borderColor: darkMode
                        ? "rgba(249, 115, 22, 0.3)"
                        : "rgba(249, 115, 22, 0.2)",
                    },
                    {
                      label: "High Priority",
                      value: stats.highPriority,
                      color: darkMode
                        ? "rgba(239, 68, 68, 0.15)"
                        : "rgba(239, 68, 68, 0.1)",
                      borderColor: darkMode
                        ? "rgba(239, 68, 68, 0.3)"
                        : "rgba(239, 68, 68, 0.2)",
                    },
                  ].map((stat, i) => {
                    // Use HolographicCard for the "High Priority" stat for extra emphasis
                    if (stat.label === "High Priority") {
                      return (
                        <HolographicCard
                          key={i}
                          darkMode={darkMode}
                          intensity="high"
                          hue="pink"
                          style={{
                            flex: 1,
                            minWidth: "45%",
                            height: 100,
                          }}
                        >
                          <View
                            style={{
                              alignItems: "center",
                              justifyContent: "center",
                              flex: 1,
                            }}
                          >
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
                        </HolographicCard>
                      );
                    }

                    return (
                      <View
                        key={i}
                        style={{
                          flex: 1,
                          minWidth: "45%",
                          height: 100,
                          backgroundColor: stat.color,
                          borderRadius: 16,
                          borderWidth: 1,
                          borderColor: stat.borderColor,
                          padding: 16,
                          alignItems: "center",
                          justifyContent: "center",
                          shadowColor: darkMode ? "#000" : "#000",
                          shadowOffset: {
                            width: 0,
                            height: 2,
                          },
                          shadowOpacity: darkMode ? 0.3 : 0.1,
                          shadowRadius: 4,
                          elevation: 3,
                        }}
                      >
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
                    );
                  })}
                </View>

                {/* Progress Bar */}
                {stats.total > 0 && (
                  <View style={{ marginTop: 20, marginBottom: 10 }}>
                    <GlassProgressBar
                      progress={(stats.completed / stats.total) * 100}
                      darkMode={darkMode}
                      height={12}
                      showLabel={true}
                      label="Overall Progress"
                      animated={true}
                      color={
                        stats.completed === stats.total ? "success" : "primary"
                      }
                    />
                  </View>
                )}
              </AnimatedCard>
            )}
            {/* Search and Filters */}
            <AnimatedCard delay={300}>
              <BlurCard style={{ marginBottom: 20 }} darkMode={darkMode}>
                <View style={{ marginBottom: 16 }}>
                  <GlassInput
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Search tasks..."
                    darkMode={darkMode}
                    icon="search"
                  />
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    {filters.map((f) => (
                      <GlassMorphButton
                        key={f}
                        onPress={() => setFilter(f as FilterType)}
                        title={f.charAt(0).toUpperCase() + f.slice(1)}
                        variant={filter === f ? "primary" : "secondary"}
                        size="small"
                        darkMode={darkMode}
                      />
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
                  onToggle={() => {
                    toggleTodo(todo.id);
                    showToast(
                      todo.completed
                        ? "Task marked as pending"
                        : "Task completed! 🎉",
                      todo.completed ? "info" : "success"
                    );
                  }}
                  onDelete={() => {
                    deleteTodo(todo.id);
                    showToast("Task deleted", "info");
                  }}
                  onEdit={(newText) => {
                    editTodo(todo.id, newText);
                    showToast("Task updated", "success");
                  }}
                  onEditStart={handleEditStart}
                  onUpdatePriority={() => {
                    showToast("Priority updated", "info");
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

          {/* Glass Modal */}
          <GlassModal
            visible={showModal}
            onClose={() => setShowModal(false)}
            title="Task Settings"
            darkMode={darkMode}
            size="medium"
            showCloseButton={true}
            animationType="scale"
          >
            <View style={{ gap: 20 }}>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: darkMode ? "#f8fafc" : "#1f2937",
                    marginBottom: 8,
                  }}
                >
                  Statistics Overview
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: darkMode ? "#cbd5e1" : "#6b7280",
                    lineHeight: 20,
                  }}
                >
                  You have completed {stats.completed} out of {stats.total}{" "}
                  tasks.
                  {stats.highPriority > 0 &&
                    ` ${stats.highPriority} tasks are marked as high priority.`}
                </Text>
              </View>

              <View style={{ gap: 12 }}>
                <GlassMorphButton
                  onPress={() => {
                    setShowModal(false);
                    showToast("All completed tasks cleared!", "info");
                  }}
                  title="Clear Completed"
                  icon="checkmark-done"
                  variant="success"
                  size="medium"
                  darkMode={darkMode}
                />

                <GlassMorphButton
                  onPress={() => {
                    setShowModal(false);
                    setFilter("all");
                    setSearch("");
                    showToast("Filters reset", "info");
                  }}
                  title="Reset Filters"
                  icon="refresh"
                  variant="secondary"
                  size="medium"
                  darkMode={darkMode}
                />
              </View>

              <View>
                <Text
                  style={{
                    fontSize: 14,
                    color: darkMode ? "#94a3b8" : "#9ca3af",
                    textAlign: "center",
                    fontStyle: "italic",
                  }}
                >
                  More settings coming soon...
                </Text>
              </View>
            </View>
          </GlassModal>

          {/* Glass Toast */}
          <GlassToast
            visible={toastVisible}
            message={toastMessage}
            type={toastType}
            darkMode={darkMode}
            duration={2500}
            position="top"
            onHide={() => setToastVisible(false)}
          />
        </FancyView>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
}
