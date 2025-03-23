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

type AlertType = "success" | "error";

type TimeSlotObject = { timeSlot: string; status: string };

const dayTranslations: Record<string, string> = {
  monday: "Hétfői",
  tuesday: "Keddi",
  wednesday: "Szerdai",
  thursday: "Csütörtöki",
  friday: "Pénteki",
  saturday: "Szombati",
  sunday: "Vasárnapi",
  done: "Kész",
};

const getHungarianDay = (day: string): string => {
  return dayTranslations[day] || day;
};

function isTimeSlotObject(item: any): item is TimeSlotObject {
  return (
    typeof item === "object" &&
    item !== null &&
    "timeSlot" in item &&
    "status" in item
  );
}

function isTimeSlotObjectArray(arr: any[]): arr is TimeSlotObject[] {
  return arr.length === 0 || isTimeSlotObject(arr[0]);
}

const showAlert = (message: string, type: AlertType = "success"): void => {
  const container = document.createElement("div");
  container.className = `fixed bottom-4 right-4 ${
    type === "success"
      ? "bg-green-100 border-green-500 text-green-700"
      : "bg-red-100 border-red-500 text-red-700"
  } border-l-4 p-4 rounded shadow-md flex items-center`;

  container.innerHTML = `
    <span class="mr-2" role="img" aria-label="${
      type === "success" ? "success" : "error"
    }">${type === "success" ? "✓" : "⚠"}</span>
    <span>${message}</span>
    <button
      class="ml-4 ${
        type === "success"
          ? "text-green-700 hover:text-green-900"
          : "text-red-700 hover:text-red-900"
      }"
      aria-label="Close notification"
    >
      &times;
    </button>
  `;

  document.body.appendChild(container);

  const closeButton = container.querySelector("button");
  if (closeButton) {
    closeButton.addEventListener("click", () => {
      document.body.removeChild(container);
    });
  }

  setTimeout(() => {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }, 5000);
};

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

      resetCounter: (counter: number): void => set({ counter }),

      setCounter: (id: string, newOrder: number): void => {
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

      fetchAvailability: async (): Promise<void> => {
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
            const dayData =
              availabilityData[day as keyof typeof availabilityData];

            if (dayData && Array.isArray(dayData)) {
              // Use type casting with a proper check
              if (isTimeSlotObjectArray(dayData)) {
                // Process as TimeSlotObject[]
                dayData.forEach((item: TimeSlotObject) => {
                  const todoItem = {
                    id: nanoid(),
                    title: item.timeSlot,
                    status: item.status,
                    state:
                      item.status === "accepted"
                        ? ("done" as keyof Todos)
                        : (day.toLowerCase() as keyof Todos),
                    order: counter++,
                    originalDay: day.toLowerCase(),
                  };

                  if (item.status === "accepted") {
                    newTodos.done.push(todoItem);
                  } else {
                    newTodos[day.toLowerCase() as keyof Todos].push(todoItem);
                  }
                });
              } else {
                // Process as string[]
                (dayData as string[]).forEach((timeSlot: string) => {
                  const todoItem = {
                    id: nanoid(),
                    title: timeSlot,
                    status: "available",
                    state: day.toLowerCase() as keyof Todos,
                    order: counter++,
                    originalDay: day.toLowerCase(),
                  };

                  newTodos[day.toLowerCase() as keyof Todos].push(todoItem);
                });
              }
            }
          }

          set({ todos: newTodos, counter, loading: false });
        } catch (error) {
          showAlert("Nem sikerült betölteni az időpontokat", "error");
          set({
            loading: false,
            error: "Nem sikerült betölteni az időpontokat",
          });
        }
      },

      addTodos: (title: string, state: keyof Todos): void => {
        set((prev) => {
          const existingTask = prev.todos[state].find(
            (task) => task.title === title,
          );

          if (existingTask) {
            const hungarianDay = getHungarianDay(state);
            showAlert(
              `Az időpont '${title}' már létezik ${hungarianDay} napon`,
              "error",
            );
            return prev;
          }

          const newTask = {
            title,
            state,
            id: nanoid(),
            order: prev.counter++,
            status: "available",
            originalDay: state,
          };
          return {
            todos: {
              ...prev.todos,
              [state]: [...prev.todos[state], newTask],
            },
          };
        });
      },

      deleteTodos: (id: string, state: keyof Todos): void => {
        set((prev) => {
          return {
            todos: {
              ...prev.todos,
              [state]: prev.todos[state].filter((task) => task.id !== id),
            },
          };
        });
      },

      editTodo: (taskId: string, newTitle: string): void => {
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
      ): void => {
        set((store) => {
          const newTodos = { ...store.todos };

          const sourceTasks = [...newTodos[sourceCategory]];
          const taskToMoveIndex = sourceTasks.findIndex(
            (task) => task.id === taskId,
          );
          if (
            taskToMoveIndex === -1 ||
            targetIndex < 0 ||
            targetIndex > newTodos[targetCategory].length
          ) {
            return store;
          }
          const [taskToMove] = sourceTasks.splice(taskToMoveIndex, 1);
          newTodos[sourceCategory] = sourceTasks;

          const targetTasks = [...newTodos[targetCategory]];
          targetTasks.splice(targetIndex, 0, {
            ...taskToMove,
            state: targetCategory,
            status:
              targetCategory === "done"
                ? "accepted"
                : taskToMove.status || "available",
          });
          newTodos[targetCategory] = targetTasks;
          return { ...store, todos: newTodos };
        });
      },

      createAvailability: async (): Promise<CreateAvailabilityResponse> => {
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

          showAlert("Időpont sikeresen létrehozva!", "success");
          set({ loading: false });
          return response.data;
        } catch (error) {
          showAlert("Nem sikerült létrehozni az időpontot", "error");
          set({
            loading: false,
            error: "Nem sikerült létrehozni az időpontot",
          });
          throw error;
        }
      },
    }),
    { name: "availability" },
  ),
);
