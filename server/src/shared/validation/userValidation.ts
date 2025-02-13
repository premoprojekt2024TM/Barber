
import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string()
    .min(3, 'Username should be at least 3 characters long')
    .max(12, 'Username should me maximum 12 characters long')
    .refine((val) => !/\s/.test(val),  'Username should not contain spaces'), 
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password should be at least 6 characters long'),
   role: z.enum(['client', 'hairdresser']),
});


export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password should be at least 6 characters long')
});


export const updateSchema = z.object({
  username: z.string()
    .min(3, 'Username should be at least 3 characters long')
    .max(12, 'Username should be maximum 12 characters long')
    .optional(),
  email: z.string().email('Invalid email format').optional(),
  password: z.string().min(6, 'Password should be at least 6 characters long').optional(),
});


