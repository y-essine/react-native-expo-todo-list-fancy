import * as Haptics from 'expo-haptics';
import { useCallback, useMemo, useState } from 'react';
import { FilterType, Priority, Stats, Todo } from '../types';

export const useTodos = () => {
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

  const addTodo = useCallback((text: string) => {
    if (text.trim()) {
      const todo: Todo = {
        id: Date.now(),
        text: text.trim(),
        completed: false,
        priority: 'medium' as Priority,
        category: 'personal',
      };
      setTodos(prev => [todo, ...prev]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, []);

  const toggleTodo = useCallback((id: number) => {
    setTodos(prev => prev.map((todo) => {
      if (todo.id === id) {
        const updated = { ...todo, completed: !todo.completed };
        if (updated.completed) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        return updated;
      }
      return todo;
    }));
  }, []);

  const deleteTodo = useCallback((id: number) => {
    setTodos(prev => prev.filter((todo) => todo.id !== id));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  const editTodo = useCallback((id: number, newText: string) => {
    setTodos(prev => prev.map((todo) => 
      todo.id === id ? { ...todo, text: newText } : todo
    ));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const getFilteredTodos = useCallback((filter: FilterType, search: string) => {
    return todos
      .filter((todo) => {
        if (filter === 'completed') return todo.completed;
        if (filter === 'active') return !todo.completed;
        if (filter !== 'all') return todo.category === filter;
        return true;
      })
      .filter((todo) =>
        todo.text.toLowerCase().includes(search.toLowerCase())
      );
  }, [todos]);

  const stats = useMemo((): Stats => ({
    total: todos.length,
    completed: todos.filter((t) => t.completed).length,
    pending: todos.filter((t) => !t.completed).length,
    highPriority: todos.filter((t) => t.priority === 'high' && !t.completed).length,
  }), [todos]);

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    getFilteredTodos,
    stats,
  };
};
