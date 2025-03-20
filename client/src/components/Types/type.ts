// types.ts

export type TaskVariant = "done" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export interface Task {
  title: string;
  state: TaskVariant | string;
  id: string;
  order: number;
}

export interface Todos {
  [category: string]: Task[];
}

export interface AvailabilityResponse {
  message: string;
  availability: {
    [day: string]: string[];
  };
}

export interface CreateAvailabilityResponse {
  message: string;
  appointment?: any;
}

export type TodoStore = {
  todos: Todos;
  counter: number;
  loading: boolean;
  error: string | null;
  setCounter: (id: string, newOrder: number) => void;
  resetCounter: (counter: number) => void;
  fetchAvailability: () => Promise<void>;
  addTodos: (title: string, state: TaskVariant) => void;
  deleteTodos: (id: string, state: TaskVariant) => void;
  editTodo: (taskId: string, newTitle: string) => void;
  moveTaskBetweenCategories: (
    taskId: string,
    sourceCategory: string,
    targetCategory: string,
    targetIndex: number,
  ) => void;
  saveAvailability: () => Promise<void>;
  createAvailability: () => Promise<CreateAvailabilityResponse>;
};
