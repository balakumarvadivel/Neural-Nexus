import { handleApiError, ok } from "@/lib/api";
import { requireAuth } from "@/lib/auth/server";
import { getUserDashboard } from "@/lib/services/dashboard";

export async function GET() {
  try {
    const session = await requireAuth();
    return ok(await getUserDashboard(session.userId));
  } catch (error) {
    return handleApiError(error, "user/dashboard");
  }
}
