import { redirect } from "next/navigation";
import { PlatformShell } from "@/components/platform/platform-shell";
import { GlassPanel, MetricGrid, TimelinePanel } from "@/components/platform/data-viz";
import { getSessionUser } from "@/lib/auth/server";
import { getUserDashboard } from "@/lib/services/dashboard";
import { payoutEvents } from "@/lib/platform-mock";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function ClaimsPayoutsPage() {
  const session = await getSessionUser();
  if (!session) redirect("/login");
  if (session.role === "ADMIN") redirect("/dashboard/admin");

  const dashboard = await getUserDashboard(session.userId);

  return (
    <PlatformShell title="Claims & Payouts" description="Parametric payouts, event timelines, and payout settlement confirmations." status="Auto Payout Ready">
      <div className="space-y-6">
        <MetricGrid
          items={[
            { label: "Triggered payouts", value: String(dashboard.payouts.length), hint: "This worker account payout history" },
            { label: "Completed", value: String(dashboard.payouts.filter((p) => p.status === "PROCESSED").length), hint: "Settled automatically" },
            { label: "Processing", value: String(dashboard.payouts.filter((p) => p.status !== "PROCESSED").length), hint: "Under trust or system review" },
            { label: "UPI readiness", value: "Verified", hint: "Primary payout rail is active", badge: "UPI" }
          ]}
        />

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <GlassPanel title="Triggered payout list" description="Every payout generated from environmental trigger conditions.">
            <div className="space-y-4">
              {dashboard.payouts.map((payout) => (
                <div key={payout.id} className="rounded-[24px] border border-white/10 bg-slate-950/35 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-white">{payout.reason}</p>
                      <p className="mt-1 text-sm text-slate-400">{formatDate(payout.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-white">{formatCurrency(payout.amount)}</p>
                      <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">{payout.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>

          <div className="space-y-6">
            <TimelinePanel title="Payout event timeline" items={payoutEvents} />
            <GlassPanel title="UPI payout confirmations" description="Prototype payout rail confirmations with settlement visibility.">
              <div className="space-y-4">
                {["UPI-8437", "UPI-8426", "UPI-8411"].map((reference, index) => (
                  <div key={reference} className="rounded-[24px] border border-white/10 bg-gradient-to-r from-cyan-400/10 to-transparent p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Confirmation #{index + 1}</p>
                    <p className="mt-2 text-base font-medium text-white">{reference}</p>
                    <p className="mt-1 text-sm text-slate-400">Settlement confirmed to worker payout handle with audit trail preserved.</p>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </div>
        </div>
      </div>
    </PlatformShell>
  );
}
