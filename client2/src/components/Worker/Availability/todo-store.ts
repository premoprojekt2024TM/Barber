import { nanoid } from "nanoid";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  TodoStore,
  AvailabilityResponse,
  CreateAvailabilityResponse,
  Todos,
} from "./types";
import { axiosInstance } from "../../../utils/axiosinstance";

export const useTodos = create<TodoStore>()(
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

      resetCounter: (counter: number) => set({ counter }),

      setCounter: (id: string, newOrder: number) => {
        set((store) => {
          const { todos } = store;
          for (const category in todos) {
            const tasks = todos[category as keyof Todos];
            const taskToEdit = tasks.find((task) => task.id === id);
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

          let counter = 1;
          for (const day in availabilityData) {
            if (
              availabilityData[day as keyof typeof availabilityData] &&
              Array.isArray(
                availabilityData[day as keyof typeof availabilityData],
              )
            ) {
              newTodos[day.toLowerCase() as keyof Todos] = (
                availabilityData[
                  day as keyof typeof availabilityData
                ] as string[]
              ).map((time: string) => ({
                id: nanoid(),
                title: time,
                state: day.toLowerCase() as keyof Todos,
                order: counter++,
              }));
            }
          }

          set({ todos: newTodos, counter, loading: false });
        } catch (error) {
          console.error("Error fetching availability:", error);
          set({ loading: false, error: "Failed to load availability" });
        }
      },

      addTodos: (title: string, state: keyof Todos) => {
        set((prev) => {
          // Check if the time already exists for the given day (state)
          const existingTask = prev.todos[state].find(
            (task) => task.title === title,
          );

          if (existingTask) {
            // If the time already exists, prevent adding a duplicate
            console.error(`The time '${title}' already exists for ${state}`);
            return prev; // Return the store unchanged
          }

          const newTask = { title, state, id: nanoid(), order: prev.counter++ };
          return {
            todos: {
              ...prev.todos,
              [state]: [...prev.todos[state], newTask],
            },
          };
        });
      },

      deleteTodos: (id: string, state: keyof Todos) => {
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
            const tasks = todos[category as keyof Todos];
            const taskToEdit = tasks.find((task) => task.id === taskId);
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
        sourceCategory: keyof Todos,
        targetCategory: keyof Todos,
        targetIndex: number,
      ) => {
        set((store) => {
          // Create a deep copy of the todos object
          const newTodos = { ...store.todos };

          // Find the task to move
          const sourceTasks = [...newTodos[sourceCategory]];
          const taskToMoveIndex = sourceTasks.findIndex(
            (task) => task.id === taskId,
          );

          // If task not found or invalid target index, don't update state
          if (
            taskToMoveIndex === -1 ||
            targetIndex < 0 ||
            targetIndex > newTodos[targetCategory].length
          ) {
            return store; // No change to state
          }

          // Remove the task from source
          const [taskToMove] = sourceTasks.splice(taskToMoveIndex, 1);
          newTodos[sourceCategory] = sourceTasks;

          // Add the task to target
          const targetTasks = [...newTodos[targetCategory]];
          targetTasks.splice(targetIndex, 0, {
            ...taskToMove,
            state: targetCategory,
          });
          newTodos[targetCategory] = targetTasks;

          // Return the updated state
          return { ...store, todos: newTodos };
        });
      },

      createAvailability: async () => {
        set({ loading: true, error: null });
        try {
          const { todos } = get();

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
