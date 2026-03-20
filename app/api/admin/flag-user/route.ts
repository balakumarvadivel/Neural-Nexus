import { handleApiError, ok } from "@/lib/api";
import { requireAdmin } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { flagUserSchema } from "@/lib/validators/admin";
import { refreshRiskScore } from "@/lib/services/risk";

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const payload = flagUserSchema.parse(await request.json());

    const [flag] = await prisma.$transaction([
      prisma.fraudFlag.create({
        data: {
          userId: payload.userId,
          severity: payload.severity,
          reason: payload.reason
        }
      }),
      prisma.user.update({
        where: { id: payload.userId },
        data: { isFlagged: true }
      })
    ]);

    await refreshRiskScore(payload.userId);
    return ok(flag, { status: 201 });
  } catch (error) {
    return handleApiError(error, "admin/flag-user");
  }
}
