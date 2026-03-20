import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().min(8).optional().or(z.literal("")),
  password: z.string().min(8),
  city: z.string().min(2)
});

export const loginSchema = z.object({
  identifier: z.string().min(3),
  password: z.string().min(8)
});
