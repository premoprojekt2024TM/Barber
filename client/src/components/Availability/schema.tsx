import { z } from "zod";

const timeRegex = /^(?:[01]?[0-9]|2[0-3]):[0-5][0-9]$/;

const formSchema = z.object({
  task: z
    .string()
    .min(5, {
      message: "Time must be at least 5 characters (HH:mm).",
    })
    .max(5, {
      message: "Time must be exactly 5 characters (HH:mm).",
    })
    .regex(timeRegex, {
      message: "Please enter a valid time in 24-hour format (HH:mm).",
    }),
});

export { formSchema };
