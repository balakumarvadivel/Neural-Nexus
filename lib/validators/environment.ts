import { z } from "zod";
import { DEMO_CITIES } from "@/lib/constants";

export const simulateEnvironmentSchema = z.object({
  city: z.enum(DEMO_CITIES),
  rainfallMm: z.number().min(0).max(500),
  temperatureC: z.number().min(-10).max(60),
  aqi: z.number().int().min(0).max(600)
});
