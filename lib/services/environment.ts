import { EnvironmentData } from "@prisma/client";
import { DEFAULT_THRESHOLDS } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

export function evaluateEnvironment(environment: Pick<EnvironmentData, "rainfallMm" | "temperatureC" | "aqi">) {
  const triggers = {
    rain: environment.rainfallMm > DEFAULT_THRESHOLDS.rainfallMm,
    heat: environment.temperatureC > DEFAULT_THRESHOLDS.temperatureC,
    pollution: environment.aqi > DEFAULT_THRESHOLDS.aqi
  };

  const triggered = Object.values(triggers).some(Boolean);

  return {
    triggers,
    triggered,
    status: triggered ? "Risk Zone" : "Safe to Work"
  };
}

export async function getCurrentEnvironment(city: string) {
  const latest = await prisma.environmentData.findFirst({
    where: { city },
    orderBy: { recordedAt: "desc" }
  });

  if (latest) {
    return latest;
  }

  return prisma.environmentData.create({
    data: {
      city,
      rainfallMm: 8,
      temperatureC: 31,
      aqi: 95,
      source: "fallback"
    }
  });
}
