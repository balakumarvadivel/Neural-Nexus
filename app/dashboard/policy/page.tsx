import { redirect } from "next/navigation";
import { PlatformShell } from "@/components/platform/platform-shell";
import { GlassPanel, MetricGrid, StatRows, TimelinePanel } from "@/components/platform/data-viz";
import { getSessionUser } from "@/lib/auth/server";
import { getUserDashboard } from "@/lib/services/dashboard";
import { activityTimeline } from "@/lib/platform-mock";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function PolicyPage() {
  const session = await getSessionUser();
  if (!session) redirect("/login");
  if (session.role === "ADMIN") redirect("/dashboard/admin");

  const dashboard = await getUserDashboard(session.userId);

  return (
    <PlatformShell title="My Policy" description="Coverage details, policy status, and the latest payout-ready protection settings." status="Protected">
      <div className="space-y-6">
        <MetricGrid
          items={[
            { label: "Coverage city", value: dashboard.profile.city, hint: "Primary insured operating city" },
            { label: "Weekly premium", value: formatCurrency(dashboard.metrics.dynamicPremium), hint: "Dynamic pricing based on current risk mix" },
            { label: "Trust score", value: `${dashboard.metrics.trustScore}/100`, hint: "Impacts payout delay behavior" },
            { label: "Last environment sync", value: formatDate(dashboard.environment.recordedAt), hint: "Latest policy-linked trigger snapshot" }
          ]}
        />
        <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
          <GlassPanel title="Policy summary" description="This week’s parametric policy configuration.">
            <StatRows
              items={[
                { label: "Coverage status", value: dashboard.metrics.activeProtectionStatus.replace("_", " "), tone: "safe" },
                { label: "Auto payout mode", value: "Enabled", detail: "No manual claim is required when triggers hit", tone: "safe" },
                { label: "Delay policy", value: `${dashboard.riskScore.payoutDelayDays} days`, detail: "Applied only for low-trust or flagged sessions" },
                { label: "Fraud review state", value: dashboard.flags.length ? "Watchlisted" : "Clear", tone: dashboard.flags.length ? "alert" : "safe" }
              ]}
            />
          </GlassPanel>
          <TimelinePanel title="Policy events" items={activityTimeline} />
        </div>
      </div>
    </PlatformShell>
  );
}
