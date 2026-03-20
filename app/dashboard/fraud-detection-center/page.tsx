import { redirect } from "next/navigation";
import { PlatformShell } from "@/components/platform/platform-shell";
import { GlassPanel, HeatGrid, MeterCard, StatRows, SuggestionPanel } from "@/components/platform/data-viz";
import { getSessionUser } from "@/lib/auth/server";
import { getUserDashboard } from "@/lib/services/dashboard";
import { heatmapData } from "@/lib/platform-mock";

export default async function FraudDetectionCenterPage() {
  const session = await getSessionUser();
  if (!session) redirect("/login");
  if (session.role === "ADMIN") redirect("/dashboard/admin");

  const dashboard = await getUserDashboard(session.userId);
  const fraudRisk = Math.max(8, 100 - dashboard.metrics.trustScore);

  return (
    <PlatformShell title="Fraud Detection Center" description="Behavioral trust signals, anomaly visibility, and payout circuit protection controls." status={dashboard.flags.length ? "Reviewing" : "Safe"}>
      <div className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <MeterCard title="Fraud risk score meter" value={fraudRisk} subtitle="Composite anomaly score generated from activity consistency and account integrity signals." />
          <GlassPanel title="Suspicious activity alerts" description="Events that could reduce payout priority or route an account to review.">
            <StatRows
              items={[
                { label: "Multiple account pattern", value: "Not detected", tone: "safe" },
                { label: "Sudden location changes", value: dashboard.flags.length ? "Watch closely" : "Stable", tone: dashboard.flags.length ? "alert" : "safe" },
                { label: "Unrealistic activity burst", value: "No evidence", tone: "safe" },
                { label: "Review queue status", value: dashboard.flags.length ? "Queued" : "Clear", tone: dashboard.flags.length ? "alert" : "safe" }
              ]}
            />
          </GlassPanel>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <HeatGrid title="Geo-clustering visualization" values={heatmapData} />
          <GlassPanel title="Behavioral anomaly indicators" description="Signal-level view of the trust engine.">
            <StatRows
              items={[
                { label: "GPS consistency", value: `${dashboard.riskScore.gpsConsistency}/100`, detail: "Route continuity and city-level coherence" },
                { label: "Activity pattern", value: `${dashboard.riskScore.activityPattern}/100`, detail: "Work rhythm compared to historical profile" },
                { label: "Session consistency", value: `${dashboard.riskScore.sessionConsistency}/100`, detail: "Session continuity across app activity" }
              ]}
            />
          </GlassPanel>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <GlassPanel title="System health status" description="Operational health of the trust and payout decisioning layer.">
            <StatRows
              items={[
                { label: "Fraud model health", value: "Healthy", tone: "safe" },
                { label: "Policy engine", value: "Online", tone: "safe" },
                { label: "Circuit breaker status", value: dashboard.flags.length ? "Active" : "Safe", tone: dashboard.flags.length ? "alert" : "safe" }
              ]}
            />
          </GlassPanel>
          <SuggestionPanel
            suggestions={[
              "Keep background location behavior steady during protected hours to preserve fast payout priority.",
              "Avoid sudden city switches while a policy week is active. Large route jumps increase anomaly sensitivity.",
              "Your account health is strong enough for automatic processing unless new geo-pattern conflicts appear."
            ]}
          />
        </div>
      </div>
    </PlatformShell>
  );
}
