import { handleApiError, ok } from "@/lib/api";
import { requireAuth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await requireAuth();
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        city: true,
        weeklyEarningsBase: true,
        isFlagged: true
      }
    });

    return ok(user);
  } catch (error) {
    return handleApiError(error, "user/profile");
  }
}
