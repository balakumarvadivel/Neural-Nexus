import { prisma } from "@/lib/prisma";

export async function runFraudCheck(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      fraudFlags: {
        where: { resolved: false },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  const signals = [
    {
      key: "patternOverlap",
      detected: user.email?.includes("+") ?? false,
      reason: "Potential multiple-account naming pattern detected."
    },
    {
      key: "locationJumps",
      detected: user.city === "Delhi" && user.weeklyEarningsBase > 900,
      reason: "Sudden location shift relative to earning pattern."
    },
    {
      key: "unrealisticActivity",
      detected: user.weeklyEarningsBase > 1400,
      reason: "Unrealistic activity volume for the selected city."
    }
  ];

  const detectedSignals = signals.filter((signal) => signal.detected);

  return {
    flagged: detectedSignals.length > 0 || user.isFlagged,
    signals,
    unresolvedFlags: user.fraudFlags
  };
}
