import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Task from "./task";
import * as z from "zod";
import { useForm, Controller } from "react-hook-form";
import { Droppable } from "@hello-pangea/dnd";
import { useTodos } from "../Availability/todoStore";
import AddIcon from "@mui/icons-material/Add";
import { formSchema } from "./schema";
import { Card, CardHeader, IconButton, TextField, Box } from "@mui/material";

const DayBadge = ({ day }: { day: string }) => {
  return (
    <Box
      sx={{
        display: "inline-block",
        backgroundColor: "#1976d2",
        color: "white",
        borderRadius: "12px",
        padding: "0.5rem 1rem",
        fontSize: "1rem",
        fontWeight: "bold",
      }}
    >
      {day}
    </Box>
  );
};

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

    const { control, handleSubmit, reset, formState, setFocus } = useForm<z.infer<typeof formSchema>>({
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
      <Card
        ref={ref}
        variant="outlined"
        sx={{
          backgroundColor: "white",
          boxShadow: 3,
          borderRadius: 2,
          overflow: "hidden",
          margin: 2,
          minWidth: "282px",
          flex: 1,
          transformOrigin: "top left",
        }}
      >
        <CardHeader
          title={<DayBadge day={columnTitle(variant)} />}
          action={
            variant !== "done" ? (
              <IconButton
                color="primary"
                onClick={() => {
                  setIsAddingTodo(true);
                  setTimeout(() => {
                    if (inputRef.current) {
                      setFocus("task");
                    }
                  }, 0);
                }}
              >
                <AddIcon />
              </IconButton>
            ) : null
          }
          sx={{ paddingBottom: 0 }}
        />

        <Droppable droppableId={variant}>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                minHeight: "15rem",
                paddingTop: "1rem",
              }}
            >
              {todos.map((task, index) => (
                <Task index={index} key={task.id} id={task.id} state={variant} />
              ))}
              {provided.placeholder}

              {variant !== "done" && (
                <div style={{ padding: "1rem", display: isAddingTodo ? "block" : "none" }}>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    onBlur={() => setIsAddingTodo(false)}
                  >
                    <Controller
                      name="task"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          inputRef={inputRef}
                          fullWidth
                          multiline
                          maxRows={4}
                          variant="outlined"
                          size="small"
                          error={!!formState.errors.task}
                          helperText={formState.errors.task?.message}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleSubmit(onSubmit)();
                            }
                            if (e.key === "Escape") {
                              setIsAddingTodo(false);
                            }
                          }}
                          sx={{
                            paddingTop: "10px",
                            paddingBottom: "10px",
                          }}
                        />
                      )}
                    />
                  </form>
                </div>
              )}
            </div>
          )}
        </Droppable>
      </Card>
    );
  }
);

export const ColumnMemo = React.memo(Column);
