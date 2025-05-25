import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useRef, useState } from 'react';
import { Dimensions, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated';

import { colors } from '../theme';
import { Todo } from '../types';
import { getCategoryIcon } from '../utils/icons';
import { AnimatedCard } from './AnimatedCard';
import { BlurCard } from './BlurCard';
import { PriorityBadge } from './PriorityBadge';

const { width } = Dimensions.get('window');

type TodoItemProps = {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: (newText: string) => void;
  onUpdatePriority: () => void;
  onEditStart?: (itemRef: View | null) => void;
  index: number;
  darkMode: boolean;
};

export const TodoItem = ({ todo, onToggle, onDelete, onEdit, onUpdatePriority, onEditStart, index, darkMode }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const editInputRef = useRef<TextInput>(null);
  const itemRef = useRef<View>(null);
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
    ],
  }));

  const handlePressIn = () => {
    if (!isEditing) {
      scale.value = withSpring(0.95);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePressOut = () => {
    if (!isEditing) {
      scale.value = withSpring(1);
    }
  };
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (!isEditing) {
        translateX.value = event.translationX * 0.8; // Add resistance
      }
    })
    .onEnd((event) => {
      if (!isEditing) {
        const { translationX, velocityX } = event;
        
        // More responsive swipe detection
        if (Math.abs(translationX) > 80 || Math.abs(velocityX) > 500) {
          if (translationX < 0) {
            // Swipe left - delete with animation
            translateX.value = withTiming(-width, { duration: 300 }, (finished) => {
              if (finished) {
                runOnJS(onDelete)();
              }
            });
            return;
          }
        }
        translateX.value = withSpring(0);
      }
    });  const handleTextPress = () => {
    if (!todo.completed) {
      setIsEditing(true);
      setEditText(todo.text);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      // Notify parent to scroll to this item
      if (onEditStart) {
        onEditStart(itemRef.current);
      }
      
      // Focus the input after a short delay to ensure it's rendered
      setTimeout(() => {
        editInputRef.current?.focus();
      }, 100);
    }
  };

  const handleSaveEdit = () => {
    if (editText.trim() && editText !== todo.text) {
      onEdit(editText.trim());
    }
    setIsEditing(false);
    Keyboard.dismiss();
  };

  const handleCancelEdit = () => {
    setEditText(todo.text);
    setIsEditing(false);
    Keyboard.dismiss();
  };

  const theme = darkMode ? colors.dark : colors.light;
  return (
    <AnimatedCard delay={index * 100}>
      <View ref={itemRef}>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={animatedStyle}>
          <TouchableOpacity
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.9}
            disabled={isEditing}
          >
            <BlurCard intensity={60} darkMode={darkMode}>
              <View style={{ minHeight: 80 }}>
                {/* Main content row */}
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 }}>
                  <TouchableOpacity
                    onPress={onToggle}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      borderWidth: 2,
                      borderColor: todo.completed ? '#10b981' : theme.textMuted,
                      backgroundColor: todo.completed ? '#10b981' : 'transparent',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 16,
                      marginTop: 2,
                    }}
                  >
                    {todo.completed && (
                      <Ionicons name="checkmark" size={16} color="white" />
                    )}
                  </TouchableOpacity>

                  <View style={{ flex: 1, paddingRight: 8 }}>
                    {isEditing ? (                      <View>
                        <TextInput
                          ref={editInputRef}
                          value={editText}
                          onChangeText={setEditText}
                          style={{
                            fontSize: 18,
                            fontWeight: '500',
                            color: theme.text,
                            backgroundColor: theme.inputBackground,
                            borderRadius: 8,
                            padding: 12,
                            marginBottom: 8,
                          }}
                          multiline
                          autoFocus
                          returnKeyType="done"
                          blurOnSubmit={true}
                          onSubmitEditing={handleSaveEdit}
                          onBlur={handleCancelEdit}
                        />
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                          <TouchableOpacity
                            onPress={handleSaveEdit}
                            style={{
                              backgroundColor: '#10b981',
                              paddingHorizontal: 12,
                              paddingVertical: 6,
                              borderRadius: 8,
                            }}
                          >
                            <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>
                              Save
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={handleCancelEdit}
                            style={{
                              backgroundColor: theme.textMuted,
                              paddingHorizontal: 12,
                              paddingVertical: 6,
                              borderRadius: 8,
                            }}
                          >
                            <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>
                              Cancel
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      <TouchableOpacity onPress={handleTextPress} activeOpacity={0.7}>
                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: '500',
                            color: todo.completed ? theme.textMuted : theme.text,
                            textDecorationLine: todo.completed ? 'line-through' : 'none',
                            lineHeight: 24,
                          }}
                        >
                          {todo.text}
                        </Text>
                        {!todo.completed && (
                          <Text style={{ 
                            fontSize: 12, 
                            color: theme.textMuted, 
                            marginTop: 2,
                            fontStyle: 'italic'
                          }}>
                            Tap to edit
                          </Text>
                        )}
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                {/* Bottom row with category, priority, and actions */}
                <View style={{ 
                  flexDirection: 'row', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons
                      name={getCategoryIcon(todo.category)}
                      size={14}
                      color={theme.textSecondary}
                      style={{ marginRight: 6 }}
                    />
                    <Text style={{ 
                      fontSize: 12, 
                      color: theme.textSecondary,
                      textTransform: 'capitalize'
                    }}>
                      {todo.category}
                    </Text>
                    <View style={{ marginLeft: 8 }}>
                      <PriorityBadge priority={todo.priority} compact={true} />
                    </View>
                  </View>

                  {/* <View style={{ flexDirection: 'row', gap: 6 }}>
                    <TouchableOpacity
                      onPress={handleTextPress}
                      style={{
                        padding: 6,
                        backgroundColor: darkMode ? 'rgba(139, 92, 246, 0.15)' : 'rgba(99, 102, 241, 0.08)',
                        borderRadius: 8,
                      }}
                    >
                      <Ionicons name="create-outline" size={14} color={darkMode ? '#a78bfa' : '#6366f1'} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      onPress={onDelete}
                      style={{
                        padding: 6,
                        backgroundColor: darkMode ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.08)',
                        borderRadius: 8,
                      }}
                    >
                      <Ionicons name="trash-outline" size={14} color={darkMode ? '#f87171' : '#ef4444'} />
                    </TouchableOpacity>
                  </View> */}
                </View>
              </View>
            </BlurCard>
          </TouchableOpacity>        </Animated.View>
      </GestureDetector>
      </View>
    </AnimatedCard>
  );
};
