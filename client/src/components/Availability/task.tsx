import React from "react";
import { useTodos } from "./todoStore";
import { TaskVariant } from "./types";
import { Card, CardContent, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Draggable } from "@hello-pangea/dnd";

interface TaskProps {
  id: string;
  index: number;
  state: TaskVariant;
}

const Task = React.memo(function ({ id, index, state }: TaskProps) {
  const todo = useTodos((store) =>
    store.todos[state].find((task) => task.id === id),
  );
  const deleteTodo = useTodos((store) => store.deleteTodos);

  if (!todo) return null;

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
          <CardContent
            sx={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                textDecoration: state === "done" ? "line-through" : "none",
                marginBottom: 1,
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
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
});

export default Task;
