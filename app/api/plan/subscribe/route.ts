import { addDays } from "@/lib/time";
import { handleApiError, ok } from "@/lib/api";
import { requireAuth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { subscribeSchema } from "@/lib/validators/plan";
import { calculatePremium } from "@/lib/utils";
import { getCurrentEnvironment, evaluateEnvironment } from "@/lib/services/environment";

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const payload = subscribeSchema.parse(await request.json());
    const user = await prisma.user.findUniqueOrThrow({ where: { id: session.userId } });
    const environment = await getCurrentEnvironment(payload.city);
    const risk = evaluateEnvironment(environment);
    const premium = calculatePremium(user.weeklyEarningsBase, risk.triggered ? 1.2 : 1);
    const weeklyCoverage = Math.round(user.weeklyEarningsBase * 0.55);

    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        city: payload.city,
        premium,
        weeklyCoverage,
        status: risk.triggered ? "RISK_ZONE" : "ACTIVE",
        expiresAt: addDays(7)
      }
    });

    return ok(subscription, { status: 201 });
  } catch (error) {
    return handleApiError(error, "plan/subscribe");
  }
}
