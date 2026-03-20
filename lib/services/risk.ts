import { prisma } from "@/lib/prisma";

export async function refreshRiskScore(userId: string) {
  const subscriptionsCount = await prisma.subscription.count({ where: { userId } });
  const payoutCount = await prisma.payout.count({ where: { userId } });
  const fraudCount = await prisma.fraudFlag.count({ where: { userId, resolved: false } });

  const gpsConsistency = Math.max(40, 92 - fraudCount * 15);
  const activityPattern = Math.max(35, 76 + subscriptionsCount * 3 - fraudCount * 12);
  const sessionConsistency = Math.max(30, 88 - payoutCount * 2 - fraudCount * 10);
  const trustScore = Math.max(
    20,
    Math.min(100, Math.round((gpsConsistency + activityPattern + sessionConsistency) / 3))
  );
  const payoutDelayDays = trustScore < 50 ? 3 : trustScore < 70 ? 1 : 0;
  const needsReview = trustScore < 55 || fraudCount > 0;

  return prisma.riskScore.create({
    data: {
      userId,
      trustScore,
      gpsConsistency,
      activityPattern,
      sessionConsistency,
      payoutDelayDays,
      needsReview
    }
  });
}
