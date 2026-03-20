import { redirect } from "next/navigation";
import { PlatformShell } from "@/components/platform/platform-shell";
import { GlassPanel, LineChartCard, MetricGrid } from "@/components/platform/data-viz";
import { getSessionUser } from "@/lib/auth/server";
import { analyticsSeries, earningsSeries, riskLabels, riskSeries } from "@/lib/platform-mock";

export default async function AnalyticsPage() {
  const session = await getSessionUser();
  if (!session) redirect("/login");
  if (session.role === "ADMIN") redirect("/dashboard/admin");

  return (
    <PlatformShell title="Analytics" description="Performance, protection, risk, and fraud trends through an investor-ready operational lens." status="Insight Ready">
      <div className="space-y-6">
        <MetricGrid
          items={[
            { label: "Income trend", value: "+12%", hint: "Week-on-week uplift despite disruption pockets" },
            { label: "Risk trend", value: "-6%", hint: "Overall exposure easing compared with previous week" },
            { label: "Claim frequency", value: "1.4 / week", hint: "Average triggered payouts under current risk conditions" },
            { label: "Fraud attempts", value: "0.2%", hint: "Anomaly rate in protected worker cohort", badge: "Healthy" }
          ]}
        />
        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <LineChartCard values={earningsSeries} labels={riskLabels} title="Income trends" />
          <LineChartCard values={riskSeries} labels={riskLabels} title="Risk trends" />
        </div>
        <GlassPanel title="Operational highlights" description="Compact analytics summary for leadership and insurance partners.">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Claim frequency", "Controlled", "Claims are triggered mostly by rainfall bursts, not abuse patterns."],
              ["Fraud attempts", "Contained", "Trust score logic is catching anomalies without hurting honest workers."],
              ["Payout latency", "Low", "Most trusted accounts can settle within the same operational window."]
            ].map(([title, value, detail]) => (
              <div key={title} className="rounded-[24px] border border-white/10 bg-slate-950/35 p-4">
                <p className="text-sm text-slate-400">{title}</p>
                <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
                <p className="mt-3 text-sm leading-6 text-slate-400">{detail}</p>
              </div>
            ))}
          </div>
        </GlassPanel>
        <LineChartCard values={analyticsSeries} labels={riskLabels} title="Claim frequency and fraud stats" />
      </div>
    </PlatformShell>
  );
}
