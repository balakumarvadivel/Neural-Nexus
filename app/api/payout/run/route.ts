import { handleApiError, ok } from "@/lib/api";
import { requireAdmin } from "@/lib/auth/server";
import { runPayoutEngine } from "@/lib/services/payout";

export async function POST() {
  try {
    const session = await requireAdmin();
    return ok(await runPayoutEngine(session.userId));
  } catch (error) {
    return handleApiError(error, "payout/run");
  }
}
