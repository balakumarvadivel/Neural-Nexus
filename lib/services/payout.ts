import { PayoutStatus, ProtectionStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentEnvironment, evaluateEnvironment } from "@/lib/services/environment";
import { refreshRiskScore } from "@/lib/services/risk";
import { log } from "@/lib/logger";

export async function runPayoutEngine(triggeredBy: string) {
  const activeSubscriptions = await prisma.subscription.findMany({
    where: {
      status: {
        in: [ProtectionStatus.ACTIVE, ProtectionStatus.RISK_ZONE]
      }
    },
    include: {
      user: true
    }
  });

  const results = [];

  for (const subscription of activeSubscriptions) {
    const environment = await getCurrentEnvironment(subscription.city);
    const evaluation = evaluateEnvironment(environment);

    if (!evaluation.triggered) {
      results.push({
        subscriptionId: subscription.id,
        userId: subscription.userId,
        skipped: true,
        reason: "Conditions within safe threshold."
      });
      continue;
    }

    const risk = await refreshRiskScore(subscription.userId);
    const amount = Math.round(subscription.weeklyCoverage * (risk.trustScore >= 75 ? 1 : 0.75));
    const status =
      risk.needsReview || risk.payoutDelayDays > 0 ? PayoutStatus.DELAYED : PayoutStatus.PROCESSED;
    const reasonParts = [];

    if (evaluation.triggers.rain) reasonParts.push("heavy rainfall");
    if (evaluation.triggers.heat) reasonParts.push("extreme heat");
    if (evaluation.triggers.pollution) reasonParts.push("hazardous AQI");

    const payout = await prisma.payout.create({
      data: {
        userId: subscription.userId,
        subscriptionId: subscription.id,
        amount,
        reason: `Automatic payout triggered by ${reasonParts.join(", ")}`,
        status,
        priorityScore: risk.trustScore,
        processedAt: status === PayoutStatus.PROCESSED ? new Date() : null
      }
    });

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: risk.needsReview ? ProtectionStatus.DELAYED : ProtectionStatus.RISK_ZONE
      }
    });

    results.push({
      subscriptionId: subscription.id,
      userId: subscription.userId,
      payoutId: payout.id,
      status,
      amount
    });
  }

  log("info", "Payout engine completed", { triggeredBy, processed: results.length });

  return {
    processed: results.length,
    results
  };
}
