import React from "react";
import { Badge } from "./badge";
import { zodResolver } from "@hookform/resolvers/zod";
import Task from "./task";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "./form";
import { useForm } from "react-hook-form";
import { cn } from "./utils";
import { Droppable } from "@hello-pangea/dnd";
import { useTodos } from "../Add/todoStore";
import { PlusIcon } from "@radix-ui/react-icons";
import { formSchema } from "./schema";
import { TaskVariant } from "./types";

// Material UI Imports
import { Card, CardContent, CardHeader, IconButton, TextField, Typography } from '@mui/material';

interface ColumnProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  variant: TaskVariant;
}

const columnTitle = (state: string): string => {
  const titles: Record<string, string> = {
    planned: "TO DO",
    ongoing: "IN PROGRESS",
    done: "DONE",
    archived: "ARCHIVED",  // New column title
  };
  return titles[state] || "";
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
      className={cn("group/column m-2 min-w-[282px] flex-1", className)}
      variant="outlined"
      sx={{
        backgroundColor: "white",
        boxShadow: 3,
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <CardHeader
        title={
          <Badge variant={variant} className="ml-2 cursor-default font-bold">
            <Typography variant="h6">{columnTitle(variant)}</Typography>
          </Badge>
        }
        action={
          variant === "planned" ? (
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
              <PlusIcon className="h-5 w-5" />
            </IconButton>
          ) : null
        }
        sx={{ paddingBottom: 0 }}
      />

      <Droppable droppableId={variant}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={cn(
              "flex h-full min-h-[15rem] w-full flex-col p-1.5",
              snapshot.isUsingPlaceholder && "border-biru"
            )}
          >
            {todos.map((task, index) => (
              <Task index={index} key={task.id} id={task.id} state={variant} />
            ))}
            {provided.placeholder}

            {/* Task Input (Visible when adding a task) */}
            {variant === "planned" && (
              <div className={cn("p-2", isAddingTodo ? "block" : "hidden")}>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    onBlur={() => setIsAddingTodo(false)}
                  >
                    <FormField
                      control={form.control}
                      name="task"
                      render={({ field }) => (
                        <FormItem className="relative text-bg">
                          <FormControl ref={inputRef}>
                            <TextField
                              {...field}
                              fullWidth
                              multiline
                              maxRows={4}
                              variant="outlined"
                              size="small"
                              error={form.formState.errors.task ? true : false}
                              helperText={form.formState.errors.task?.message}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  form.handleSubmit(onSubmit)();
                                }
                                if (e.key === "Escape") {
                                  setIsAddingTodo(false);
                                }
                              }}
                              InputProps={{
                                style: {
                                  paddingTop: '10px',
                                  paddingBottom: '10px',
                                },
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
