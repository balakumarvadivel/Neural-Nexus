import { cookies } from "next/headers";
import { ok, handleApiError } from "@/lib/api";
import { AUTH_COOKIE } from "@/lib/auth/session";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0
    });

    return ok({ loggedOut: true });
  } catch (error) {
    return handleApiError(error, "auth/logout");
  }
}
