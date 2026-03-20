import { handleApiError, ok } from "@/lib/api";
import { requireAuth } from "@/lib/auth/server";
import { runFraudCheck } from "@/lib/services/fraud";

export async function GET() {
  try {
    const session = await requireAuth();
    return ok(await runFraudCheck(session.userId));
  } catch (error) {
    return handleApiError(error, "fraud/check");
  }
}
