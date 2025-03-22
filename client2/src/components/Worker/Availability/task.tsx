"use client";
import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { useTodos } from "./todo-store";
import type { TaskVariant } from "./types";
import { X } from "lucide-react";

interface TaskProps {
  id: string;
  index: number;
  state: TaskVariant;
}

const Task = React.memo(function Task({ id, index, state }: TaskProps) {
  const todo = useTodos((store) =>
    store.todos[state].find((task) => task.id === id),
  );
  const deleteTodo = useTodos((store) => store.deleteTodos);

  if (!todo) return null;

  return (
    <Draggable index={index} draggableId={todo?.id}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={`bg-white border rounded-xl p-4 mb-3 relative group cursor-move transition-all duration-200 ${
            snapshot.isDragging
              ? "border-indigo-400 shadow-lg scale-105"
              : "border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-200"
          }`}
        >
          <div className="flex flex-col w-full">
            <p
              className={`text-gray-700 whitespace-pre-wrap break-words ${
                state === "done" ? "line-through text-gray-400" : ""
              }`}
            >
              {todo.title}
            </p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteTodo(id, state);
              }}
              className="absolute top-2 right-2 text-gray-300 hover:text-red-500 transition-colors duration-200 p-1 rounded-full hover:bg-red-50"
              aria-label="Delete task"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
});

export default Task;
