import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Draggable } from "@hello-pangea/dnd";
import { useTodos } from "./todoStore";
import { cn } from "./utils";
import { formSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTextarea } from "./use-adjust-textarea";
import { TaskVariant } from "./types";

// MUI imports
import { Card, CardContent, IconButton, Typography } from "@mui/material";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete'; // Import the trash icon

interface TaskProps {
  id: string;
  index: number;
  state: TaskVariant;
}

const Task = React.memo(function ({ id, index, state }: TaskProps) {
  const [editTask, setEditTask] = React.useState(false);
  const todo = useTodos((store) =>
    store.todos[state].find((task) => task.id === id),
  );
  if (!todo) return null;

  const editTodo = useTodos((store) => store.editTodo); // Get the delete function from the store

  const { textareaRef, adjustTextareaHeight } = useTextarea();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { task: todo?.title },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.task.trim().length !== 0) {
      editTodo(id, values.task);
      setEditTask(false);
    } else {
      setEditTask(true);
    }
  }

  return (
    <Draggable index={index} draggableId={todo?.id}>
      {(provided, snapshot) => (
        <Card
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={cn(
            "group/task relative my-0.5 flex h-fit justify-between rounded-sm",
            snapshot.isDragging && "outline outline-1 outline-biru"
          )}
          variant="outlined"
          sx={{
            backgroundColor: "background.paper",
            boxShadow: 3,
            borderRadius: 1,
            padding: 2,
          }}
        >
          <CardContent sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
            {!editTask && (
              <>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                    textDecoration: state === "done" ? "line-through" : "none",
                    cursor: "pointer",
                    marginBottom: 1,
                  }}
                  onClick={() => {
                    if (textareaRef?.current) {
                      setEditTask(true);
                      setTimeout(() => {
                        textareaRef.current?.focus();
                        adjustTextareaHeight();
                      }, 0);
                    }
                  }}
                >
                  {todo.title}
                </Typography>

                {/* Trash Icon Button to Delete Task */}
                <IconButton              
                  sx={{ position: "absolute", top: 8, right: 8 }} // Position the trash icon
                >
                  <DeleteIcon />
                </IconButton>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
});

export default Task;
