export type TaskVariant =
  | "done"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface ColumnProps {
  variant: TaskVariant;
  className?: string;
}

export interface TaskProps {
  id: string;
  index: number;
  state: TaskVariant;
}

export interface Todo {
  id: string;
  text: string;
}
export interface Task {
  id: string;
  title: string;
  state: TaskVariant;
  order: number;
  originalDay: string;
  status: string;
}

export interface Todos {
  done: Task[];
  monday: Task[];
  tuesday: Task[];
  wednesday: Task[];
  thursday: Task[];
  friday: Task[];
  saturday: Task[];
  sunday: Task[];
}

export interface AvailabilityResponse {
  availability: {
    Monday?: string[];
    Tuesday?: string[];
    Wednesday?: string[];
    Thursday?: string[];
    Friday?: string[];
    Saturday?: string[];
    Sunday?: string[];
  };
}

export interface CreateAvailabilityResponse {
  success: boolean;
  message: string;
}

export interface TodoStore {
  todos: Todos;
  counter: number;
  loading: boolean;
  error: string | null;

  resetCounter: (counter: number) => void;
  setCounter: (id: string, newOrder: number) => void;
  fetchAvailability: () => Promise<void>;
  addTodos: (title: string, state: keyof Todos) => void;
  deleteTodos: (id: string, state: keyof Todos) => void;
  editTodo: (taskId: string, newTitle: string) => void;
  moveTaskBetweenCategories: (
    taskId: string,
    sourceCategory: keyof Todos,
    targetCategory: keyof Todos,
    targetIndex: number,
  ) => void;
  createAvailability: () => Promise<CreateAvailabilityResponse>;
}
