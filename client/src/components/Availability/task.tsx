import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Draggable } from "@hello-pangea/dnd";
import { useTodos } from "./todoStore";
import { formSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { TaskVariant } from "./types";

import { Card, CardContent, IconButton, Typography, Input } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';

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
  const editTodo = useTodos((store) => store.editTodo);
  const deleteTodo = useTodos((store) => store.deleteTodos);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { task: todo?.title },
  });

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
                    setEditTask(true);
                  }}
                >
                  {todo.title}
                </Typography>
                <IconButton
                  onClick={() => {
                    deleteTodo(id, state);
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
                <Input
                  {...form.register("task")}
                  fullWidth
                  multiline
                  disableUnderline
                  autoFocus
                  sx={{
                    padding: "8px",
                    fontSize: "14px",
                    borderRadius: "4px",
                    border: "1px solid",
                    borderColor: "grey.400",
                    backgroundColor: "transparent",
                    marginBottom: 1,
                  }}
                />
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <IconButton
                    onClick={() => setEditTask(false)}
                    sx={{ marginRight: 1 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    type="submit"
                    color="primary"
                  >
                    <CheckIcon />
                  </IconButton>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
});

export default Task;