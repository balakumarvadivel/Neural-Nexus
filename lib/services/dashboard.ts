import { ProtectionStatus, Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { calculatePremium } from "@/lib/utils";
import { getCurrentEnvironment, evaluateEnvironment } from "@/lib/services/environment";
import { refreshRiskScore } from "@/lib/services/risk";

export async function getUserDashboard(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      subscriptions: { orderBy: { createdAt: "desc" }, take: 1 },
      payouts: { orderBy: { createdAt: "desc" }, take: 5 },
      riskScores: { orderBy: { createdAt: "desc" }, take: 1 },
      fraudFlags: { where: { resolved: false }, orderBy: { createdAt: "desc" }, take: 5 }
    }
  });

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  const latestSubscription = user.subscriptions[0] ?? null;
  const latestRisk = user.riskScores[0] ?? (await refreshRiskScore(userId));
  const city = latestSubscription?.city ?? user.city ?? "Bengaluru";
  const environment = await getCurrentEnvironment(city);
  const environmentStatus = evaluateEnvironment(environment);

  return {
    profile: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      city,
      role: user.role,
      flagged: user.isFlagged
    },
    metrics: {
      weeklyEarningsEstimate: user.weeklyEarningsBase,
      activeProtectionStatus: latestSubscription?.status ?? ProtectionStatus.INACTIVE,
      riskStatus: environmentStatus.status,
      dynamicPremium: calculatePremium(user.weeklyEarningsBase, environmentStatus.triggered ? 1.2 : 1),
      trustScore: latestRisk.trustScore
    },
    environment: {
      rainfallMm: environment.rainfallMm,
      temperatureC: environment.temperatureC,
      aqi: environment.aqi,
      recordedAt: environment.recordedAt,
      triggers: environmentStatus.triggers
    },
    payouts: user.payouts,
    riskScore: latestRisk,
    flags: user.fraudFlags
  };
}

export async function getAdminDashboard() {
  const [users, flaggedUsers, delayedPayouts] = await Promise.all([
    prisma.user.findMany({
      include: {
        subscriptions: { orderBy: { createdAt: "desc" }, take: 1 },
        riskScores: { orderBy: { createdAt: "desc" }, take: 1 }
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.user.findMany({
      where: {
        OR: [{ isFlagged: true }, { fraudFlags: { some: { resolved: false } } }]
      },
      include: {
        fraudFlags: {
          where: { resolved: false }
        }
      }
    }),
    prisma.payout.findMany({
      where: { status: "DELAYED" },
      include: { user: true },
      take: 10,
      orderBy: { createdAt: "desc" }
    })
  ]);

  return {
    stats: {
      totalUsers: users.filter((user) => user.role === Role.WORKER).length,
      admins: users.filter((user) => user.role === Role.ADMIN).length,
      flaggedUsers: flaggedUsers.length,
      delayedPayouts: delayedPayouts.length
    },
    users,
    flaggedUsers,
    delayedPayouts
  };
}
