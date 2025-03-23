import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Droppable } from "@hello-pangea/dnd";
import * as z from "zod";
import { Plus } from "lucide-react";
import Task from "./task";
import { DayBadge } from "./day-badge";
import { useTodos } from "./todo-store";
import { TaskVariant, ColumnProps } from "./types";

const formSchema = z.object({
  task: z
    .string()
    .min(1, { message: "Időpont szükséges" })
    .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
      message: "Az időnek HH:MM formátumban kell lennie (pl. 09:20, 14:30).",
    }),
});

type FormValues = z.infer<typeof formSchema>;

const columnTitle = (state: TaskVariant): string => {
  const titles: Record<TaskVariant, string> = {
    done: "FOGLALT",
    monday: "HÉTFŐ",
    tuesday: "KEDD",
    wednesday: "SZERDA",
    thursday: "CSÜTÖRTÖK",
    friday: "PÉNTEK",
    saturday: "SZOMBAT",
    sunday: "VASÁRNAP",
  };
  return titles[state];
};

export const Column = React.forwardRef<HTMLDivElement, ColumnProps>(
  ({ variant, className }, ref) => {
    const addTodo = useTodos((store) => store.addTodos);
    const todos = useTodos((store) => store.todos[variant]);
    const [isAddingTodo, setIsAddingTodo] = React.useState<boolean>(false);

    const {
      control,
      handleSubmit,
      reset,
      formState: { errors },
      setFocus,
      getValues,
    } = useForm<FormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: { task: "" },
    });

    const inputRef = React.useRef<HTMLInputElement | null>(null);

    const onSubmit = (values: FormValues): void => {
      addTodo(values.task, variant);
      reset();
      setIsAddingTodo(false);
    };

    const handleBlur = (): void => {
      const values = getValues();
      if (values.task && !errors.task) {
        handleSubmit(onSubmit)();
      } else {
        setIsAddingTodo(false);
      }
    };

    return (
      <div
        ref={ref}
        className={`bg-gradient-to-b from-white to-gray-50 shadow-lg rounded-xl m-3 min-w-[300px] flex-1 border border-gray-200 transition-all duration-300 hover:shadow-xl ${className}`}
      >
        <div className="flex justify-between items-center p-5 pb-2">
          <DayBadge day={columnTitle(variant)} />
          {variant !== "done" && (
            <button
              className="text-black hover:text-black p-2 rounded-full hover:bg-black-50 transition-colors duration-200 transform hover:scale-110"
              onClick={() => {
                setIsAddingTodo(true);
                setTimeout(() => {
                  setFocus("task");
                }, 0);
              }}
              aria-label="Adj hozzá időpontot"
            >
              <Plus size={22} />
            </button>
          )}
        </div>

        <Droppable droppableId={variant}>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex flex-col h-full min-h-60 pt-3 px-2"
            >
              {todos.map((task, index) => (
                <Task
                  index={index}
                  key={task.id}
                  id={task.id}
                  state={variant}
                />
              ))}
              {provided.placeholder}

              {variant !== "done" && isAddingTodo && (
                <div className="p-3">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                      name="task"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <input
                            {...field}
                            ref={(e) => {
                              field.ref(e);
                              inputRef.current = e;
                            }}
                            type="text"
                            className={`w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-all duration-200 shadow-sm ${
                              errors.task ? "border-red-500" : "border-gray-300"
                            }`}
                            onKeyDown={(e) => {
                              if (e.key === "Escape") {
                                setIsAddingTodo(false);
                              }
                            }}
                            onBlur={handleBlur}
                            placeholder="Adj hozzá időpontot (pl 09:30)"
                            maxLength={5}
                          />
                          {errors.task && (
                            <p className="text-red-500 text-xs mt-1 ml-1">
                              {errors.task.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                  </form>
                </div>
              )}
            </div>
          )}
        </Droppable>
      </div>
    );
  },
);

Column.displayName = "Column";

export const ColumnMemo = React.memo(Column);
