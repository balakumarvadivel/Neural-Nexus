import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { ok, handleApiError, fail } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { signToken, AUTH_COOKIE } from "@/lib/auth/session";
import { loginSchema } from "@/lib/validators/auth";

export async function POST(request: Request) {
  try {
    const payload = loginSchema.parse(await request.json());

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: payload.identifier }, { phone: payload.identifier }]
      }
    });

    if (!user) {
      return fail("Invalid credentials.", 401);
    }

    const valid = await bcrypt.compare(payload.password, user.passwordHash);
    if (!valid) {
      return fail("Invalid credentials.", 401);
    }

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
    return handleApiError(error, "auth/login");
  }
}
