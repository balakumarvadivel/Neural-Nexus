import { redirect } from "next/navigation";
import { PlatformShell } from "@/components/platform/platform-shell";
import { GlassPanel, LineChartCard, LossEstimator, MetricGrid } from "@/components/platform/data-viz";
import { getSessionUser } from "@/lib/auth/server";
import { analyticsSeries, earningsSeries, protectedIncomeSeries, riskLabels } from "@/lib/platform-mock";

export default async function EarningsProtectionPage() {
  const session = await getSessionUser();
  if (!session) redirect("/login");
  if (session.role === "ADMIN") redirect("/dashboard/admin");

  return (
    <PlatformShell title="Earnings Protection" description="Protected income visibility, coverage ratios, and exposure-aware earnings forecasting." status="Shielded">
      <div className="space-y-6">
        <MetricGrid
          items={[
            { label: "Protection percentage", value: "55%", hint: "Current protected portion of baseline weekly income" },
            { label: "Average payout readiness", value: "92%", hint: "Likelihood of immediate payout processing if triggered" },
            { label: "Coverage reliability", value: "High", hint: "Based on trigger availability and trust posture" },
            { label: "Forecast confidence", value: "88%", hint: "AI estimate for projected coverage adequacy", badge: "Forecast" }
          ]}
        />
        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <LineChartCard values={earningsSeries} labels={riskLabels} title="Weekly income graph" />
          <LineChartCard values={protectedIncomeSeries} labels={riskLabels} title="Protected income graph" />
        </div>
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <LossEstimator current={320} protectedValue={410} />
          <GlassPanel title="Loss coverage breakdown" description="How protected income absorbs operational disruption.">
            <div className="space-y-4">
              {[
                ["Expected income", "INR 760"],
                ["Modeled loss under disruption", "INR 320"],
                ["Covered by policy", "INR 410"],
                ["Potential uncovered gap", "INR 0 - 40"]
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between rounded-[22px] border border-white/10 bg-slate-950/35 px-4 py-4">
                  <p className="text-sm text-slate-300">{label}</p>
                  <p className="text-sm font-medium text-white">{value}</p>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
        <LineChartCard values={analyticsSeries} labels={riskLabels} title="Protected income trend" />
      </div>
    </PlatformShell>
  );
}
