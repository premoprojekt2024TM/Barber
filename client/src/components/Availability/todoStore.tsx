import { nanoid } from "nanoid";
import { create } from "zustand";
import { TaskVariant } from "./types";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../../utils/axiosInstance"; // Importing your axios instance

interface Task {
  title: string;
  state: TaskVariant | string;
  id: string;
  order: number;
}

interface Todos {
  [category: string]: Task[];
}

// Define API response structure
interface AvailabilityResponse {
  message: string;
  availability: {
    [day: string]: string[];
  };
}

interface CreateAvailabilityResponse {
  message: string;
  appointment?: any;
}

type TodoStore = {
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

// Define the store
const useTodos = create<TodoStore>()(
  persist(
    (set, get) => ({
      todos: {
        done: [],
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
      },
      counter: 1,
      loading: false,
      error: null,

      resetCounter: (counter) => set({ counter }),

      setCounter: (id, newOrder) => {
        set((store) => {
          const { todos } = store;
          for (const category in todos) {
            const tasks = todos[category];
            const taskToEdit = tasks.find((task) => task.id === id);
            // If the task is found, update its order and break out of the loop
            if (taskToEdit) {
              taskToEdit.order = newOrder;
              break;
            }
          }
          return { todos: { ...todos } };
        });
      },

      fetchAvailability: async () => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.get<AvailabilityResponse>(
            "/api/v1/getMyAvailability",
          );
          const availabilityData = response.data.availability;

          // Initialize new todos object
          const newTodos: Todos = {
            done: [],
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: [],
            sunday: [],
          };

          // Convert API data to our task format
          let counter = 1;
          for (const day in availabilityData) {
            if (availabilityData[day] && Array.isArray(availabilityData[day])) {
              newTodos[day.toLowerCase()] = availabilityData[day].map(
                (time: string) => ({
                  id: nanoid(),
                  title: time,
                  state: day.toLowerCase(),
                  order: counter++,
                }),
              );
            }
          }

          set({ todos: newTodos, counter, loading: false });
        } catch (error) {
          console.error("Error fetching availability:", error);
          set({ loading: false, error: "Failed to load availability" });
        }
      },

      addTodos: (title, state) => {
        set((prev) => {
          const newTask = { title, state, id: nanoid(), order: prev.counter++ };

          // Log the new task to the console
          console.log("New task added:", newTask);

          return {
            todos: {
              ...prev.todos,
              [state]: [...prev.todos[state as keyof Todos], newTask],
            },
          };
        });
      },

      deleteTodos: (id, state) => {
        set((prev) => {
          return {
            todos: {
              ...prev.todos,
              [state]: prev.todos[state].filter((task) => task.id !== id),
            },
          };
        });
      },

      editTodo: (taskId: string, newTitle: string) => {
        set((store) => {
          const { todos } = store;
          for (const category in todos) {
            const tasks = todos[category];
            const taskToEdit = tasks.find((task) => task.id === taskId);
            // If the task is found, update its title and break out of the loop
            if (taskToEdit) {
              taskToEdit.title = newTitle;
              break;
            }
          }
          return { todos: { ...todos } };
        });
      },

      moveTaskBetweenCategories: (
        taskId: string,
        sourceCategory: string,
        targetCategory: string,
        targetIndex: number,
      ) =>
        set((store: TodoStore) => {
          const { todos } = store;
          const sourceTasks = todos[sourceCategory];
          const targetTasks = todos[targetCategory];
          const taskToMoveIndex = sourceTasks.findIndex(
            (task) => task.id === taskId,
          );
          if (
            taskToMoveIndex === -1 ||
            targetIndex < 0 ||
            targetIndex > targetTasks.length
          ) {
            // Invalid indices or categories, do nothing
            return store; // Return the original store to avoid the error
          }
          const taskToMove = sourceTasks.splice(taskToMoveIndex, 1)[0];
          targetTasks.splice(targetIndex, 0, {
            ...taskToMove,
            state: targetCategory,
          });
          return { todos: { ...todos } };
        }),

      saveAvailability: async () => {
        set({ loading: true, error: null });
        try {
          const { todos } = get();

          // Convert todos to the format expected by the API
          const availability: Record<string, string[]> = {};

          for (const day in todos) {
            if (day === "done") continue; // Skip 'done' category

            availability[day] = todos[day].map((task) => task.title);
          }

          await axiosInstance.post("/api/v1/saveAvailability", {
            availability,
          });
          set({ loading: false });
        } catch (error) {
          console.error("Error saving availability:", error);
          set({ loading: false, error: "Failed to save availability" });
        }
      },

      createAvailability: async () => {
        set({ loading: true, error: null });
        try {
          const { todos } = get();

          // Create the direct format expected by the API
          const monday = todos.monday.map((task) => task.title);
          const tuesday = todos.tuesday.map((task) => task.title);
          const wednesday = todos.wednesday.map((task) => task.title);
          const thursday = todos.thursday.map((task) => task.title);
          const friday = todos.friday.map((task) => task.title);
          const saturday = todos.saturday.map((task) => task.title);
          const sunday = todos.sunday.map((task) => task.title);

          const response = await axiosInstance.post<CreateAvailabilityResponse>(
            "/api/v1/createAvailability",
            {
              monday,
              tuesday,
              wednesday,
              thursday,
              friday,
              saturday,
              sunday,
            },
          );

          console.log("Availability created:", response.data);
          set({ loading: false });
          return response.data;
        } catch (error) {
          console.error("Error creating availability:", error);
          set({ loading: false, error: "Failed to create availability" });
          throw error;
        }
      },
    }),
    { name: "availability" },
  ),
);

export { useTodos };
