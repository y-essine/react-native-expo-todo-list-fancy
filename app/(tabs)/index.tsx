// App.js - React Native Expo Fancy Todo App
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// Custom BlurCard Component
type BlurCardProps = {
  children: React.ReactNode;
  style?: any;
  intensity?: number;
};

const BlurCard = ({ children, style, intensity = 80 }: BlurCardProps) => (
  <BlurView intensity={intensity} tint="light" style={[{ borderRadius: 24, overflow: 'hidden' }, style]}>
    <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: 20 }}>
      {children}
    </View>
  </BlurView>
);

// Animated Card Component
const AnimatedCard = ({
  children,
  delay = 0,
  ...props
}: {
  children: React.ReactNode;
  delay?: number;
  [key: string]: any;
}) => {
  const translateY = useSharedValue(50);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    setTimeout(() => {
      translateY.value = withSpring(0, { damping: 15 });
      opacity.value = withTiming(1, { duration: 600 });
    }, delay);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={animatedStyle} {...props}>
      {children}
    </Animated.View>
  );
};

// Priority Badge Component
type Priority = 'high' | 'medium' | 'low';

const PriorityBadge = ({ priority }: { priority: Priority }) => {
  const colors: { [key in Priority]: [string, string] } = {
    high: ['#ef4444', '#ec4899'],
    medium: ['#f59e0b', '#f97316'],
    low: ['#10b981', '#059669'],
  };

  return (
    <LinearGradient
      colors={colors[priority]}
      style={{
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 8,
      }}
    >
      <Text style={{ color: 'white', fontSize: 10, fontWeight: '600' }}>
        {priority.toUpperCase()}
      </Text>
    </LinearGradient>
  );
};

// Todo Item Component
type Todo = {
  id: number;
  text: string;
  completed: boolean;
  priority: Priority;
  category: string;
};

type TodoItemProps = {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onUpdatePriority: () => void;
  index: number;
};

const TodoItem = ({ todo, onToggle, onDelete, onEdit, onUpdatePriority, index }: TodoItemProps) => {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
    ],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  interface SwipeGestureEvent {
    nativeEvent: {
      translationX: number;
      [key: string]: any;
    };
  }

  const handleSwipeGesture = (event: SwipeGestureEvent) => {
    const { translationX } = event.nativeEvent;
    
    if (Math.abs(translationX) > 100) {
      if (translationX > 0) {
        // Swipe right - complete
        runOnJS(onToggle)();
      } else {
        // Swipe left - delete
        runOnJS(onDelete)();
      }
      translateX.value = withSpring(0);
    } else {
      translateX.value = withSpring(0);
    }
  };

  interface CategoryIcons {
    [key: string]: string;
  }

  const getCategoryIcon = (category: string): keyof typeof Ionicons.glyphMap => {
    const icons: { [key: string]: keyof typeof Ionicons.glyphMap } = {
      work: 'briefcase',
      dev: 'code-slash',
      health: 'fitness',
      personal: 'person',
    };
    return icons[category] || 'document-text';
  };

  return (
    <AnimatedCard delay={index * 100}>
      <PanGestureHandler onGestureEvent={handleSwipeGesture}>
        <Animated.View style={animatedStyle}>
          <TouchableOpacity
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.9}
          >
            <BlurCard intensity={60}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={onToggle}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: todo.completed ? '#10b981' : '#9ca3af',
                    backgroundColor: todo.completed ? '#10b981' : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}
                >
                  {todo.completed && (
                    <Ionicons name="checkmark" size={14} color="white" />
                  )}
                </TouchableOpacity>

                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons
                      name={getCategoryIcon(todo.category)}
                      size={16}
                      color="#6b7280"
                      style={{ marginRight: 8 }}
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '500',
                        color: todo.completed ? '#9ca3af' : '#1f2937',
                        textDecorationLine: todo.completed ? 'line-through' : 'none',
                        flex: 1,
                      }}
                    >
                      {todo.text}
                    </Text>
                    <PriorityBadge priority={todo.priority} />
                  </View>
                </View>

                <View style={{ flexDirection: 'row', marginLeft: 12 }}>
                  <TouchableOpacity
                    onPress={onEdit}
                    style={{
                      padding: 8,
                      backgroundColor: 'rgba(99, 102, 241, 0.1)',
                      borderRadius: 12,
                      marginRight: 8,
                    }}
                  >
                    <Ionicons name="create-outline" size={16} color="#6366f1" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={onDelete}
                    style={{
                      padding: 8,
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      borderRadius: 12,
                    }}
                  >
                    <Ionicons name="trash-outline" size={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            </BlurCard>
          </TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>
    </AnimatedCard>
  );
};

// Main App Component
export default function App() {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: 1,
      text: 'Design the perfect mobile UI',
      completed: false,
      priority: 'high',
      category: 'work',
    },
    {
      id: 2,
      text: 'Add smooth animations',
      completed: true,
      priority: 'medium',
      category: 'dev',
    },
  ]);

  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showStats, setShowStats] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: Todo = {
        id: Date.now(),
        text: newTodo,
        completed: false,
        priority: 'medium' as Priority,
        category: 'personal',
      };
      setTodos([todo, ...todos]);
      setNewTodo('');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          const updated = { ...todo, completed: !todo.completed };
          if (updated.completed) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
          return updated;
        }
        return todo;
      })
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const filteredTodos = todos
    .filter((todo) => {
      if (filter === 'completed') return todo.completed;
      if (filter === 'active') return !todo.completed;
      if (filter !== 'all') return todo.category === filter;
      return true;
    })
    .filter((todo) =>
      todo.text.toLowerCase().includes(search.toLowerCase())
    );

  const stats = {
    total: todos.length,
    completed: todos.filter((t) => t.completed).length,
    pending: todos.filter((t) => !t.completed).length,
    highPriority: todos.filter((t) => t.priority === 'high' && !t.completed).length,
  };

  const filters = ['all', 'active', 'completed', 'work', 'dev', 'health', 'personal'];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LinearGradient
        colors={
          darkMode
            ? ['#1f2937', '#4c1d95', '#1e40af']
            : ['#dbeafe', '#e0e7ff', '#f3e8ff']
        }
        style={{ flex: 1 }}
      >
        <StatusBar
          barStyle={darkMode ? 'light-content' : 'dark-content'}
          backgroundColor="transparent"
          translucent
        />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 20, paddingTop: 60 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <AnimatedCard>
            <BlurCard style={{ marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <LinearGradient
                    colors={['#8b5cf6', '#7c3aed']}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 16,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 12,
                    }}
                  >
                    <Ionicons name="sparkles" size={24} color="white" />
                  </LinearGradient>
                  <View>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1f2937' }}>
                      Fancy Tasks
                    </Text>
                    <Text style={{ fontSize: 14, color: '#6b7280' }}>
                      Organize your life beautifully
                    </Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    onPress={() => setShowStats(!showStats)}
                    style={{
                      padding: 12,
                      backgroundColor: showStats ? '#8b5cf6' : 'rgba(255, 255, 255, 0.3)',
                      borderRadius: 12,
                      marginRight: 8,
                    }}
                  >
                    <Ionicons
                      name="bar-chart"
                      size={20}
                      color={showStats ? 'white' : '#6b7280'}
                    />
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={() => setDarkMode(!darkMode)}
                    style={{
                      padding: 12,
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      borderRadius: 12,
                    }}
                  >
                    <Ionicons
                      name={darkMode ? 'sunny' : 'moon'}
                      size={20}
                      color="#6b7280"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Add Todo Input */}
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <TextInput
                    value={newTodo}
                    onChangeText={setNewTodo}
                    placeholder="What needs to be done?"
                    placeholderTextColor="#9ca3af"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.5)',
                      borderRadius: 16,
                      padding: 16,
                      fontSize: 16,
                      color: '#1f2937',
                    }}
                    onSubmitEditing={addTodo}
                  />
                </View>
                
                <TouchableOpacity onPress={addTodo}>
                  <LinearGradient
                    colors={['#8b5cf6', '#7c3aed']}
                    style={{
                      padding: 16,
                      borderRadius: 16,
                      alignItems: 'center',
                      justifyContent: 'center',
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
              <BlurCard style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: '600', color: '#1f2937', marginBottom: 16 }}>
                  Statistics
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                  {([
                    { label: 'Total', value: stats.total, colors: ['#3b82f6', '#06b6d4'] as [string, string] },
                    { label: 'Completed', value: stats.completed, colors: ['#10b981', '#059669'] as [string, string] },
                    { label: 'Pending', value: stats.pending, colors: ['#f59e0b', '#f97316'] as [string, string] },
                    { label: 'High Priority', value: stats.highPriority, colors: ['#ef4444', '#ec4899'] as [string, string] },
                  ]).map((stat, i) => (
                    <LinearGradient
                      key={i}
                      colors={stat.colors}
                      style={{
                        flex: 1,
                        minWidth: '45%',
                        padding: 16,
                        borderRadius: 16,
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>
                        {stat.value}
                      </Text>
                      <Text style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.9)' }}>
                        {stat.label}
                      </Text>
                    </LinearGradient>
                  ))}
                </View>
              </BlurCard>
            </AnimatedCard>
          )}

          {/* Search and Filters */}
          <AnimatedCard delay={300}>
            <BlurCard style={{ marginBottom: 20 }}>
              <View style={{ marginBottom: 16 }}>
                <View style={{ position: 'relative' }}>
                  <TextInput
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Search tasks..."
                    placeholderTextColor="#9ca3af"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.5)',
                      borderRadius: 12,
                      padding: 12,
                      paddingLeft: 40,
                      fontSize: 16,
                      color: '#1f2937',
                    }}
                  />
                  <Ionicons
                    name="search"
                    size={20}
                    color="#9ca3af"
                    style={{ position: 'absolute', left: 12, top: 12 }}
                  />
                </View>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {filters.map((f) => (
                    <TouchableOpacity
                      key={f}
                      onPress={() => setFilter(f)}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 12,
                        backgroundColor: filter === f ? '#8b5cf6' : 'rgba(255, 255, 255, 0.3)',
                      }}
                    >
                      <Text
                        style={{
                          color: filter === f ? 'white' : '#6b7280',
                          fontWeight: '500',
                          textTransform: 'capitalize',
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
                onToggle={() => toggleTodo(todo.id)}
                onDelete={() => deleteTodo(todo.id)}
                onEdit={() => {/* Implement edit functionality */}}
                onUpdatePriority={() => {/* Implement priority update */}}
              />
            ))}
          </View>

          {filteredTodos.length === 0 && (
            <AnimatedCard delay={400}>
              <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <Text style={{ fontSize: 48, marginBottom: 16 }}>📝</Text>
                <Text style={{ fontSize: 18, color: '#6b7280', marginBottom: 8 }}>
                  No tasks found
                </Text>
                <Text style={{ fontSize: 14, color: '#9ca3af' }}>
                  Add a new task or adjust your filters
                </Text>
              </View>
            </AnimatedCard>
          )}
        </ScrollView>
      </LinearGradient>
    </GestureHandlerRootView>
  );
}