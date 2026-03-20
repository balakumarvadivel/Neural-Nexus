import { cookies, headers } from "next/headers";
import { NextRequest } from "next/server";
import { AUTH_COOKIE, SessionUser, verifyToken } from "@/lib/auth/session";

async function extractRawToken(request?: NextRequest) {
  if (request) {
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      return authHeader.replace("Bearer ", "");
    }

    return request.cookies.get(AUTH_COOKIE)?.value;
  }

  const headerStore = await headers();
  const authHeader = headerStore.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.replace("Bearer ", "");
  }

  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE)?.value;
}

export async function getSessionUser(request?: NextRequest): Promise<SessionUser | null> {
  const token = await extractRawToken(request);
  if (!token) {
    return null;
  }

  try {
    return await verifyToken(token);
  } catch {
    return null;
  }
}

export async function requireAuth(request?: NextRequest) {
  const session = await getSessionUser(request);
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }

  return session;
}

export async function requireAdmin(request?: NextRequest) {
  const session = await requireAuth(request);
  if (session.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }

  return session;
}
