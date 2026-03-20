import bcrypt from "bcryptjs";
import { PrismaClient, ProtectionStatus, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Password123!", 10);

  const [worker, admin] = await Promise.all([
    prisma.user.upsert({
      where: { email: "worker@gigshield.ai" },
      update: {},
      create: {
        name: "Aarav Kumar",
        email: "worker@gigshield.ai",
        phone: "+919900000001",
        passwordHash,
        city: "Bengaluru",
        weeklyEarningsBase: 780
      }
    }),
    prisma.user.upsert({
      where: { email: "admin@gigshield.ai" },
      update: {},
      create: {
        name: "Platform Admin",
        email: "admin@gigshield.ai",
        phone: "+919900000999",
        passwordHash,
        role: Role.ADMIN,
        city: "Bengaluru"
      }
    })
  ]);

  await prisma.subscription.create({
    data: {
      userId: worker.id,
      city: "Bengaluru",
      premium: 49,
      weeklyCoverage: 420,
      status: ProtectionStatus.ACTIVE,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  });

  await prisma.environmentData.createMany({
    data: [
      { city: "Bengaluru", rainfallMm: 38, temperatureC: 34, aqi: 112, source: "seed" },
      { city: "Delhi", rainfallMm: 4, temperatureC: 42, aqi: 241, source: "seed" }
    ]
  });

  await prisma.riskScore.create({
    data: {
      userId: worker.id,
      trustScore: 82,
      gpsConsistency: 85,
      activityPattern: 78,
      sessionConsistency: 83
    }
  });

  await prisma.fraudFlag.create({
    data: {
      userId: worker.id,
      severity: "LOW",
      reason: "Routine behavior sampling for baseline monitoring.",
      metadata: { source: "seed" }
    }
  });

  await prisma.payout.create({
    data: {
      userId: worker.id,
      amount: 210,
      reason: "Heavy rainfall disruption",
      status: "PROCESSED",
      priorityScore: 82,
      processedAt: new Date()
    }
  });

  console.log("Seeded GigShield AI demo data.");
  console.log("Worker login: worker@gigshield.ai / Password123!");
  console.log("Admin login: admin@gigshield.ai / Password123!");
  console.log(`Admin user id: ${admin.id}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
