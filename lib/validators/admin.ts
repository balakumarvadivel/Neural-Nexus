import { z } from "zod";

export const flagUserSchema = z.object({
  userId: z.string().min(1),
  reason: z.string().min(5),
  severity: z.enum(["LOW", "MEDIUM", "HIGH"])
});
