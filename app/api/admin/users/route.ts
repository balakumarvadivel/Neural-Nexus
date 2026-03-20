import { handleApiError, ok } from "@/lib/api";
import { requireAdmin } from "@/lib/auth/server";
import { getAdminDashboard } from "@/lib/services/dashboard";

export async function GET() {
  try {
    await requireAdmin();
    const dashboard = await getAdminDashboard();
    return ok(dashboard.users);
  } catch (error) {
    return handleApiError(error, "admin/users");
  }
}
