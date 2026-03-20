import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { Role } from "@prisma/client";
import { ok, handleApiError, fail } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { signToken, AUTH_COOKIE } from "@/lib/auth/session";
import { signupSchema } from "@/lib/validators/auth";
import { refreshRiskScore } from "@/lib/services/risk";

export async function POST(request: Request) {
  try {
    const payload = signupSchema.parse(await request.json());

    if (!payload.email && !payload.phone) {
      return fail("Either email or phone is required.");
    }

    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email: payload.email || undefined }, { phone: payload.phone || undefined }]
      }
    });

    if (existing) {
      return fail("An account already exists with that email or phone.");
    }

    const user = await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email || null,
        phone: payload.phone || null,
        city: payload.city,
        passwordHash: await bcrypt.hash(payload.password, 10),
        role: Role.WORKER
      }
    });

    await refreshRiskScore(user.id);

    const token = await signToken({
      userId: user.id,
      role: user.role,
      email: user.email
    });

    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    });

    return ok({ id: user.id, role: user.role });
  } catch (error) {
    return handleApiError(error, "auth/signup");
  }
}
