import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Task from "./task";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "./form";
import { useForm } from "react-hook-form";
import { Droppable } from "@hello-pangea/dnd";
import { useTodos } from "../Availability/todoStore";
import { PlusIcon } from "@radix-ui/react-icons";
import { formSchema } from "./schema";
import { TaskVariant } from "./types";

// Material UI Imports
import { Card, CardHeader, IconButton, TextField, Box } from '@mui/material';

// Badge component for day labels
const DayBadge = ({ day }: { day: string }) => {
  return (
    <Box
      sx={{
        display: "inline-block",
        backgroundColor: "#1976d2", // Customize this color
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

// Adjust columnTitle function to include both task states and days of the week
const columnTitle = (state: string): string => {
  const titles: Record<string, string> = {
    planned: "TO DO",
    ongoing: "IN PROGRESS",
    done: "DONE",
    archived: "ARCHIVED",  // New column title
    monday: "HÉTFŐ",        // Day of the week
    tuesday: "KEDD",        // Day of the week
    wednesday: "SZERDA",    // Day of the week
    thursday: "CSÜTÖRTÖK",  // Day of the week
    friday: "PÉNTEK",      // Day of the week
    saturday: "SZOMBAT",    // Day of the week
    sunday: "VASÁRNAP",     // Day of the week
  };
  return titles[state] || "";  // Return the title or an empty string
};

export const Column = React.forwardRef<HTMLDivElement, ColumnProps>(({ variant, className }, ref) => {
  const addTodo = useTodos((store) => store.addTodos);
  const todos = useTodos((store) => store.todos[variant]);
  const [isAddingTodo, setIsAddingTodo] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { task: "" },
  });

  const inputRef = React.useRef<HTMLInputElement>(null);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addTodo(values.task, variant);
    form.reset();
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
        title={
          // Use the DayBadge component for day labels
          <DayBadge day={columnTitle(variant)} />
        }
        action={
          variant !== "done" ? (
            <IconButton
              color="primary"
              onClick={() => {
                if (inputRef.current) {
                  setIsAddingTodo(true);
                  setTimeout(() => {
                    inputRef.current?.focus();
                  }, 0);
                }
              }}
            >
              <PlusIcon />
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
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    onBlur={() => setIsAddingTodo(false)}
                  >
                    <FormField
                      control={form.control}
                      name="task"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl ref={inputRef}>
                            <TextField
                              {...field}
                              fullWidth
                              multiline
                              maxRows={4}
                              variant="outlined"
                              size="small"
                              error={!!form.formState.errors.task}
                              helperText={form.formState.errors.task?.message}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  form.handleSubmit(onSubmit)();
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
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </Card>
  );
});

export const ColumnMemo = React.memo(Column);
