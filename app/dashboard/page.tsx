import { redirect } from "next/navigation";
import { PlatformShell } from "@/components/platform/platform-shell";
import {
  GlassPanel,
  HeroProtectionCard,
  LineChartCard,
  LossEstimator,
  MetricGrid,
  StatRows,
  SuggestionPanel,
  TimelinePanel
} from "@/components/platform/data-viz";
import { getSessionUser } from "@/lib/auth/server";
import { getUserDashboard } from "@/lib/services/dashboard";
import { activityTimeline, alertsFeed, riskLabels, riskSeries } from "@/lib/platform-mock";
import { formatCurrency } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await getSessionUser();
  if (!session) {
    redirect("/login");
  }

  if (session.role === "ADMIN") {
    redirect("/dashboard/admin");
  }

  const dashboard = await getUserDashboard(session.userId);
  const protectedAmount = dashboard.payouts[0]?.amount || dashboard.metrics.weeklyEarningsEstimate * 0.55;

  return (
    <PlatformShell
      title="Dashboard"
      description="A real-time command center for weekly coverage, payout readiness, and route-level disruption visibility."
      status={dashboard.metrics.riskStatus}
    >
      <div className="space-y-6">
        <HeroProtectionCard
          headline="You are Protected this Week"
          coverage={`${dashboard.metrics.activeProtectionStatus.replace("_", " ")} coverage`}
          risk={`${dashboard.metrics.trustScore >= 75 ? "Low" : dashboard.metrics.trustScore >= 55 ? "Medium" : "High"} trust-adjusted risk`}
          details="GigShield AI is actively monitoring weather and environmental disruptions against your protection plan. If unsafe conditions persist, the payout engine will process compensation automatically."
        />

        <MetricGrid
          items={[
            {
              label: "Weekly Earnings",
              value: formatCurrency(dashboard.metrics.weeklyEarningsEstimate),
              hint: "Rolling estimate from recent activity and city-level patterns."
            },
            {
              label: "Protected Amount",
              value: formatCurrency(protectedAmount),
              hint: "Projected weekly fallback coverage if disruption thresholds hit.",
              badge: "Auto"
            },
            {
              label: "Risk Score",
              value: `${dashboard.metrics.trustScore}/100`,
              hint: "Trust-aware payout confidence and fraud posture."
            },
            {
              label: "Active Coverage Days",
              value: "7 days",
              hint: "Current policy cycle remains protected through the week."
            }
          ]}
        />

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <GlassPanel title="Real-time conditions" description="Sensor-backed environmental conditions for your active coverage city.">
            <StatRows
              items={[
                { label: "Temperature", value: `${dashboard.environment.temperatureC} C`, detail: "Live city condition snapshot" },
                { label: "Rainfall", value: `${dashboard.environment.rainfallMm} mm`, detail: "Compared against payout trigger threshold" },
                { label: "AQI", value: `${dashboard.environment.aqi}`, detail: "Pollution trigger sensitivity adjusted by location" },
                {
                  label: "Disruption alerts",
                  value: dashboard.metrics.riskStatus,
                  detail: "Composite status from rain, heat, and pollution",
                  tone: dashboard.metrics.riskStatus === "Risk Zone" ? "alert" : "safe"
                }
              ]}
            />
          </GlassPanel>
          <SuggestionPanel
            suggestions={[
              "Shift peak delivery slots earlier today. Heat exposure is expected to rise fastest after 1 PM.",
              "Keep coverage active in Bengaluru this week. Rain volatility remains above the seasonal baseline.",
              "Your trust score supports instant processing, so no manual claims action is needed if a trigger activates."
            ]}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <LineChartCard values={riskSeries} labels={riskLabels} />
          <LossEstimator current={280} protectedValue={Math.round(protectedAmount)} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <TimelinePanel title="Recent activity timeline" items={activityTimeline} />
          <GlassPanel title="Realtime update badges" description="Small but critical changes surfaced without cluttering the main workflow.">
            <div className="space-y-3">
              {alertsFeed.map((item) => (
                <div key={item.label} className="rounded-[22px] border border-white/10 bg-slate-950/35 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-medium text-white">{item.label}</p>
                    <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">{item.value}</p>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{item.detail}</p>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      </div>
    </PlatformShell>
  );
}
