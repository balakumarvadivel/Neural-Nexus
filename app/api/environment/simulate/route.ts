import { handleApiError, ok } from "@/lib/api";
import { requireAdmin } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { simulateEnvironmentSchema } from "@/lib/validators/environment";

export async function POST(request: Request) {
  try {
    const session = await requireAdmin();
    const payload = simulateEnvironmentSchema.parse(await request.json());
    const environment = await prisma.environmentData.create({
      data: {
        ...payload,
        simulatedBy: session.userId,
        source: "admin-simulation"
      }
    });

    return ok(environment, { status: 201 });
  } catch (error) {
    return handleApiError(error, "environment/simulate");
  }
}
