import { handleApiError, ok } from "@/lib/api";
import { requireAuth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await requireAuth();
    const payouts =
      session.role === "ADMIN"
        ? await prisma.payout.findMany({ include: { user: true }, orderBy: { createdAt: "desc" }, take: 20 })
        : await prisma.payout.findMany({ where: { userId: session.userId }, orderBy: { createdAt: "desc" } });
    return ok(payouts);
  } catch (error) {
    return handleApiError(error, "payout/history");
  }
}
