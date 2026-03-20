import { handleApiError, ok } from "@/lib/api";
import { requireAuth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await requireAuth();
    const subscription = await prisma.subscription.findFirst({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" }
    });
    return ok(subscription);
  } catch (error) {
    return handleApiError(error, "plan/status");
  }
}
