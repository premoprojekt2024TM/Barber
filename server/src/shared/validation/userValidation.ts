import { z } from "zod";

// Regisztrációs űrlap séma
export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "A felhasználónévnek legalább 3 karakter hosszúnak kell lennie")
    .max(12, "A felhasználónév legfeljebb 12 karakter hosszú lehet")
    .refine(
      (val) => !/\s/.test(val),
      "A felhasználónév nem tartalmazhat szóközt",
    ),
  email: z.string().email("Érvénytelen email formátum"),
  firstName: z.string(),
  lastName: z.string(),
  password: z
    .string()
    .min(6, "A jelszónak legalább 6 karakter hosszúnak kell lennie"),
  role: z.enum(["client", "worker"]),
});

// Bejelentkezési űrlap séma
export const loginSchema = z.object({
  email: z.string().email("Érvénytelen email formátum"),
  password: z
    .string()
    .min(6, "A jelszónak legalább 6 karakter hosszúnak kell lennie"),
});

// Felhasználó frissítési séma
export const updateSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  profilePic: z.string().optional(),
});

// Bolt létrehozási séma
export const storeSchema = z.object({
  name: z
    .string()
    .min(3, "A bolt nevének legalább 3 karakter hosszúnak kell lennie")
    .max(100, "A bolt neve legfeljebb 100 karakter hosszú lehet"),

  workerId: z
    .number()
    .int()
    .min(1, "A dolgozó azonosítónak pozitív egész számnak kell lennie"),

  address: z
    .string()
    .min(3, "A címnek legalább 3 karakter hosszúnak kell lennie")
    .max(100, "A cím legfeljebb 100 karakter hosszú lehet"),

  phone: z
    .string()
    .min(10, "A telefonszámnak legalább 10 karakter hosszúnak kell lennie")
    .max(15, "A telefonszám legfeljebb 15 karakter hosszú lehet"),

  email: z.string().email("Érvénytelen email formátum"),

  picture: z.string(),
});
