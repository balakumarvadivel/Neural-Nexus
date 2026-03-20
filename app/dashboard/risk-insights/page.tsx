import { redirect } from "next/navigation";
import { PlatformShell } from "@/components/platform/platform-shell";
import { GlassPanel, HeatGrid, LineChartCard, SuggestionPanel } from "@/components/platform/data-viz";
import { getSessionUser } from "@/lib/auth/server";
import { heatmapData, riskLabels, riskSeries } from "@/lib/platform-mock";

export default async function RiskInsightsPage() {
  const session = await getSessionUser();
  if (!session) redirect("/login");
  if (session.role === "ADMIN") redirect("/dashboard/admin");

  return (
    <PlatformShell title="Risk Insights" description="Localized risk intelligence built from weather volatility, AQI exposure, and route-level disruption patterns." status="At Risk">
      <div className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <HeatGrid title="Risk heatmap" values={heatmapData} />
          <GlassPanel title="Area risk classification" description="Current zone labels ranked by likelihood of work interruption.">
            <div className="space-y-3">
              {[
                ["South Tech Belt", "High"],
                ["Central Hub", "High"],
                ["West Corridor", "Medium"],
                ["Airport Belt", "Low"]
              ].map(([zone, risk]) => (
                <div key={zone} className="flex items-center justify-between rounded-[22px] border border-white/10 bg-slate-950/35 px-4 py-4">
                  <p className="text-sm text-slate-300">{zone}</p>
                  <p className="text-sm font-medium text-white">{risk}</p>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <LineChartCard values={riskSeries} labels={riskLabels} title="Weekly trend graph" />
          <SuggestionPanel
            suggestions={[
              "Prefer mid-morning working windows in eastern zones this week. Late afternoon exposure is trending upward.",
              "If rainfall crosses 25 mm again, keep app activity consistent. Stable sessions support fast auto-payouts.",
              "AQI signals remain noisy today, so nearby zone switching may reduce both exposure and downtime."
            ]}
          />
        </div>
      </div>
    </PlatformShell>
  );
}
