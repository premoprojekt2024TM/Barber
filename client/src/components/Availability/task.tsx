import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Draggable } from "@hello-pangea/dnd";
import { useTodos } from "./todoStore";
import { formSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTextarea } from "./use-adjust-textarea";
import { TaskVariant } from "./types";

// MUI imports
import { Card, CardContent, IconButton, Typography, TextareaAutosize } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

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
  const editTodo = useTodos((store) => store.editTodo); // Get the edit function from the store
  const deleteTodo = useTodos((store) => store.deleteTodos); // Get the delete function from the store
  const { textareaRef, adjustTextareaHeight } = useTextarea();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { task: todo?.title },
  });

  // If no todo is found, return null after hook initialization
  if (!todo) return null;

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
          variant="outlined"
          sx={{
            backgroundColor: "background.paper",
            boxShadow: 3,
            borderRadius: 1,
            padding: 2,
            marginBottom: 1,
            position: "relative",
            cursor: "move",
            ...(snapshot.isDragging && {
              borderColor: "primary.dark", 
              boxShadow: 6,
            }),
          }}
        >
          <CardContent sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
            {!editTask ? (
              <>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                    textDecoration: state === "done" ? "line-through" : "none",
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
                <IconButton
                  onClick={() => {
                    deleteTodo(id, state); // Call the delete function with the task's id and state
                  }}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    color: "text.secondary",
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </>
            ) : (
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <TextareaAutosize
                  {...form.register("task")}
                  minRows={3}
                  maxRows={5}
                  ref={(e: HTMLTextAreaElement | null) => {
                    textareaRef.current = e;
                    form.register("task").ref(e);
                  }}
                  onChange={adjustTextareaHeight}
                  style={{
                    width: "100%",
                    padding: "8px",
                    fontSize: "14px",
                    borderRadius: "4px",
                    border: "1px solid",
                    borderColor: "grey.400",
                    backgroundColor: "transparent",
                    resize: "none",
                  }}
                />
                <IconButton
                  type="submit"
                  sx={{
                    marginTop: 1,
                    alignSelf: "flex-end",
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </form>
            )}
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
});

export default Task;

