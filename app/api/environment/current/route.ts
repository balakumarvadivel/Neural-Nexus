import { handleApiError, ok } from "@/lib/api";
import { requireAuth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { getCurrentEnvironment, evaluateEnvironment } from "@/lib/services/environment";

export async function GET() {
  try {
    const session = await requireAuth();
    const user = await prisma.user.findUniqueOrThrow({ where: { id: session.userId } });
    const city = user.city || "Bengaluru";
    const environment = await getCurrentEnvironment(city);
    return ok({ ...environment, evaluation: evaluateEnvironment(environment) });
  } catch (error) {
    return handleApiError(error, "environment/current");
  }
}
