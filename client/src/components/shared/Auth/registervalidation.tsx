import { z } from "zod";

export const emailSchema = z.object({
  email: z
    .string()
    .min(1, "Email cím megadása kötelező")
    .email("Érvénytelen email cím"),
});

export const personalInfoSchema = z.object({
  firstName: z
    .string()
    .min(1, "Keresztnév megadása kötelező")
    .min(3, "Minimum 3 karakteresnek kell lennie")
    .max(12, "Nem haladhatja meg a 12 karaktert")
    .refine(
      (val) => /^[a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ\s]*$/.test(val),
      "Csak betűt tartalmazhat",
    ),
  lastName: z
    .string()
    .min(1, "Vezetéknév megadása kötelező")
    .min(3, "Minimum 3 karakteresnek kell lennie")
    .max(12, "Nem haladhatja meg a 12 karaktert")
    .refine(
      (val) => /^[a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ\s]*$/.test(val),
      "Csak betűt tartalmazhat",
    ),
  username: z
    .string()
    .min(1, "Felhasználónév megadása kötelező")
    .min(3, "A felhasználónév legalább 3 karakter hosszú kell legyen")
    .max(12, "A felhasználónév legfeljebb 12 karakter hosszú lehet")
    .refine(
      (val) => !/\s/.test(val),
      "A felhasználónév nem tartalmazhat szóközt",
    ),
});


export const passwordSchema = z.object({
  password: z
    .string()
    .min(1, "Jelszó megadása kötelező")
    .min(6, "A jelszó legalább 6 karakter hosszú kell legyen"),
  userType: z.enum(["kliens", "fodrasz"]),
});

export const registerFormSchema = emailSchema
  .merge(personalInfoSchema)
  .merge(passwordSchema);


export type RegisterFormData = z.infer<typeof registerFormSchema>;


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
        result = passwordSchema.safeParse(data);
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
    return {
      success: false,
      errors: { form: "Hiba történt a validáció során" },
    };
  }
};

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
    return {
      success: false,
      errors: { form: "Hiba történt a validáció során" },
    };
  }
};


export const mapUserTypeToRole = (userType: string): "client" | "worker" => {
  return userType === "kliens" ? "client" : "worker";
};
