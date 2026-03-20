import { z } from "zod";
import { DEMO_CITIES } from "@/lib/constants";

export const subscribeSchema = z.object({
  city: z.enum(DEMO_CITIES)
});
