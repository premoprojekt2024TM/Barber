import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { useTodos } from "./todo-store";
import type { TaskProps } from "./types";
import { X, Lock } from "lucide-react";

const Task = React.memo(function Task({ id, index, state }: TaskProps) {
  const todo = useTodos((store) =>
    store.todos[state].find((task) => task.id === id),
  );
  const deleteTodo = useTodos((store) => store.deleteTodos);

  if (!todo) return null;

  const isDone = state === "done";

  const hungarianDays: Record<string, string> = {
    monday: "Hétfő",
    tuesday: "Kedd",
    wednesday: "Szerda",
    thursday: "Csütörtök",
    friday: "Péntek",
    saturday: "Szombat",
    sunday: "Vasárnap",
  };

  const formatDay = (day: string) => {
    return hungarianDays[day] || day.charAt(0).toUpperCase() + day.slice(1);
  };

  return (
    <Draggable index={index} draggableId={todo?.id} isDragDisabled={isDone}>
      {(provided, snapshot) => (
        <div
          {...(isDone ? {} : provided.draggableProps)}
          {...(isDone ? {} : provided.dragHandleProps)}
          ref={provided.innerRef}
          className={`bg-white border rounded-xl p-4 mb-3 relative group transition-all duration-200 ${
            isDone ? "border-gray-200 shadow-sm cursor-default" : "cursor-move"
          } ${
            !isDone && snapshot.isDragging
              ? "border-black shadow-lg scale-105"
              : "border-gray-200 shadow-sm hover:shadow-md hover:border-black"
          }`}
        >
          <div className="flex flex-col w-full">
            <p
              className={`text-gray-700 whitespace-pre-wrap break-words ${
                isDone ? "line-through text-gray-400" : ""
              }`}
            >
              {todo.title}
            </p>
            {isDone && todo.originalDay && (
              <p className="text-xs text-gray-400 mt-1">
                {formatDay(todo.originalDay)}
              </p>
            )}
            {isDone ? (
              <div className="absolute top-2 right-2 text-gray-300 p-1">
                <Lock size={16} />
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTodo(id, state);
                }}
                className="absolute top-2 right-2 text-gray-300 hover:text-red-500 transition-colors duration-200 p-1 rounded-full hover:bg-red-50"
                aria-label="Feladat törlése"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
});

export default Task;
