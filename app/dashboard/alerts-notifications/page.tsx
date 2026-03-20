import { redirect } from "next/navigation";
import { PlatformShell } from "@/components/platform/platform-shell";
import { GlassPanel, MetricGrid, StatRows, TimelinePanel } from "@/components/platform/data-viz";
import { getSessionUser } from "@/lib/auth/server";
import { activityTimeline, alertsFeed } from "@/lib/platform-mock";

export default async function AlertsNotificationsPage() {
  const session = await getSessionUser();
  if (!session) redirect("/login");
  if (session.role === "ADMIN") redirect("/dashboard/admin");

  return (
    <PlatformShell title="Alerts & Notifications" description="Prioritized alerts across weather, risk, policy state, and system changes." status="Attention Managed">
      <div className="space-y-6">
        <MetricGrid
          items={[
            { label: "Unread alerts", value: "6", hint: "Across weather, risk, and payouts" },
            { label: "High priority", value: "2", hint: "Needs route or time-slot awareness" },
            { label: "System updates", value: "3", hint: "Automated backend and model changes" },
            { label: "Notification health", value: "On", hint: "Push and in-app delivery active", badge: "Live" }
          ]}
        />
        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <GlassPanel title="Priority feed" description="High, medium, and low-priority cards designed for rapid scanning.">
            <StatRows items={alertsFeed} />
          </GlassPanel>
          <TimelinePanel title="Notification history" items={activityTimeline} />
        </div>
      </div>
    </PlatformShell>
  );
}
