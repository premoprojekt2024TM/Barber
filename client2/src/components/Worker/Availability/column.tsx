"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Droppable } from "@hello-pangea/dnd";
import * as z from "zod";
import { Plus } from "lucide-react";
import Task from "./task";
import { DayBadge } from "./day-badge";
import { useTodos } from "./todo-store";

// Schema for form validation
const formSchema = z.object({
  task: z.string().min(1, { message: "Task is required" }),
});

interface ColumnProps {
  variant: string;
  className?: string;
}

const columnTitle = (state: string): string => {
  const titles: Record<string, string> = {
    done: "DONE",
    archived: "ARCHIVED",
    monday: "HÉTFŐ",
    tuesday: "KEDD",
    wednesday: "SZERDA",
    thursday: "CSÜTÖRTÖK",
    friday: "PÉNTEK",
    saturday: "SZOMBAT",
    sunday: "VASÁRNAP",
  };
  return titles[state] || "";
};

export const Column = React.forwardRef<HTMLDivElement, ColumnProps>(
  ({ variant, className }, ref) => {
    const addTodo = useTodos((store) => store.addTodos);
    const todos = useTodos((store) => store.todos[variant]);
    const [isAddingTodo, setIsAddingTodo] = React.useState(false);

    const {
      control,
      handleSubmit,
      reset,
      formState: { errors },
      setFocus,
    } = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: { task: "" },
    });

    const inputRef = React.useRef<HTMLInputElement>(null);

    const onSubmit = (values: z.infer<typeof formSchema>) => {
      addTodo(values.task, variant);
      reset();
      setIsAddingTodo(false);
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
              className="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-50 transition-colors duration-200 transform hover:scale-110"
              onClick={() => {
                setIsAddingTodo(true);
                setTimeout(() => {
                  if (inputRef.current) {
                    setFocus("task");
                  }
                }, 0);
              }}
              aria-label="Add task"
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
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    onBlur={() => setIsAddingTodo(false)}
                  >
                    <Controller
                      name="task"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <textarea
                            {...field}
                            ref={(e) => {
                              field.ref(e);
                              inputRef.current = e;
                            }}
                            className={`w-full border rounded-lg p-3 text-sm resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 shadow-sm ${
                              errors.task ? "border-red-500" : "border-gray-300"
                            }`}
                            rows={2}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(onSubmit)();
                              }
                              if (e.key === "Escape") {
                                setIsAddingTodo(false);
                              }
                            }}
                            placeholder="What needs to be done?"
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
