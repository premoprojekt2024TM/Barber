import { nanoid } from "nanoid";
import { create } from "zustand";
import {
  TodoStore,
  AvailabilityResponse,
  CreateAvailabilityResponse,
  Todos,
} from "../Types/type";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../../utils/axiosInstance";

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

      resetCounter: (counter: number) => set({ counter }),

      setCounter: (id: string, newOrder: number) => {
        set((store) => {
          const { todos } = store;
          for (const category in todos) {
            const tasks = todos[category];
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
            const tasks = todos[category];
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
            return store;
          }
          const taskToMove = sourceTasks.splice(taskToMoveIndex, 1)[0];
          targetTasks.splice(targetIndex, 0, {
            ...taskToMove,
            state: targetCategory,
          });
          return { todos: { ...todos } };
        }),

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

export { useTodos };
