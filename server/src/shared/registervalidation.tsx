import { z } from "zod";

// Step 1 validation schema
export const emailSchema = z.object({
  email: z
    .string()
    .min(1, "Email cím megadása kötelező")
    .email("Érvénytelen email cím"),
});

// Step 2 validation schema
export const personalInfoSchema = z.object({
  firstName: z.string().min(1, "Keresztnév megadása kötelező"),
  lastName: z.string().min(1, "Vezetéknév megadása kötelező"),
  username: z
    .string()
    .min(3, "A felhasználónév legalább 3 karakter hosszú kell legyen")
    .max(12, "A felhasználónév legfeljebb 12 karakter hosszú lehet")
    .refine(
      (val) => !/\s/.test(val),
      "A felhasználónév nem tartalmazhat szóközt",
    ),
});

// Step 3 validation schema
export const passwordAndTermsSchema = z.object({
  password: z
    .string()
    .min(1, "Jelszó megadása kötelező")
    .min(6, "A jelszó legalább 6 karakter hosszú kell legyen"),
  agreedToTerms: z
    .boolean()
    .refine((val) => val === true, "El kell fogadnod a feltételeket"),
  userType: z.enum(["kliens", "fodrasz"]),
});

// Combined schema for full registration data
export const registerFormSchema = emailSchema
  .merge(personalInfoSchema)
  .merge(passwordAndTermsSchema);

// Type for the form data
export type RegisterFormData = z.infer<typeof registerFormSchema>;

// Schema for API registration
export const apiRegisterSchema = z.object({
  email: z.string().email("Érvénytelen email cím"),
  username: z
    .string()
    .min(3, "A felhasználónév legalább 3 karakter hosszú kell legyen")
    .max(12, "A felhasználónév legfeljebb 12 karakter hosszú lehet")
    .refine(
      (val) => !/\s/.test(val),
      "A felhasználónév nem tartalmazhat szóközt",
    ),
  password: z
    .string()
    .min(6, "A jelszó legalább 6 karakter hosszú kell legyen"),
  firstName: z.string().min(1, "Keresztnév megadása kötelező"),
  lastName: z.string().min(1, "Vezetéknév megadása kötelező"),
  role: z.enum(["client", "worker"]),
});

// Validation helper functions
export const validateStep = (
  step: number,
  data: Partial<RegisterFormData>,
): { success: boolean; errors: Record<string, string> } => {
  let result;
  let errors: Record<string, string> = {};

  try {
    switch (step) {
      case 1:
        result = emailSchema.safeParse(data);
        break;
      case 2:
        result = personalInfoSchema.safeParse(data);
        break;
      case 3:
        result = passwordAndTermsSchema.safeParse(data);
        break;
      default:
        return { success: false, errors: { form: "Érvénytelen lépés" } };
    }

    if (!result.success && "error" in result) {
      result.error.errors.forEach((err) => {
        const field = err.path[0].toString();
        errors[field] = err.message;
      });
      return { success: false, errors };
    }

    return { success: true, errors: {} };
  } catch (error) {
    console.error("Validation error:", error);
    return {
      success: false,
      errors: { form: "Hiba történt a validáció során" },
    };
  }
};

// Validate the entire form data
export const validateFullForm = (
  data: Partial<RegisterFormData>,
): { success: boolean; errors: Record<string, string> } => {
  try {
    const result = registerFormSchema.safeParse(data);

    if (!result.success && "error" in result) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0].toString();
        errors[field] = err.message;
      });
      return { success: false, errors };
    }

    return { success: true, errors: {} };
  } catch (error) {
    console.error("Form validation error:", error);
    return {
      success: false,
      errors: { form: "Hiba történt a validáció során" },
    };
  }
};

// Map user type to role for API
export const mapUserTypeToRole = (userType: string): "client" | "worker" => {
  return userType === "kliens" ? "client" : "worker";
};
