// Types for the Todo App
export type Priority = "high" | "medium" | "low";

export type Todo = {
  id: number;
  text: string;
  completed: boolean;
  priority: Priority;
  category: string;
};

export type FilterType =
  | "all"
  | "active"
  | "completed"
  | "work"
  | "dev"
  | "health"
  | "personal";

export type Stats = {
  total: number;
  completed: number;
  pending: number;
  highPriority: number;
};
