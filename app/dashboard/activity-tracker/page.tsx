import { redirect } from "next/navigation";
import { PlatformShell } from "@/components/platform/platform-shell";
import { GlassPanel, LineChartCard, MetricGrid, TimelinePanel } from "@/components/platform/data-viz";
import { getSessionUser } from "@/lib/auth/server";
import { activityTimeline, riskLabels } from "@/lib/platform-mock";

const movementSeries = [18, 24, 30, 26, 34, 29, 36];

export default async function ActivityTrackerPage() {
  const session = await getSessionUser();
  if (!session) redirect("/login");
  if (session.role === "ADMIN") redirect("/dashboard/admin");

  return (
    <PlatformShell title="Activity Tracker" description="Movement patterns, working-hour timelines, and simulated delivery behavior." status="Tracking">
      <div className="space-y-6">
        <MetricGrid
          items={[
            { label: "Daily working hours", value: "8.4 h", hint: "Average active delivery hours" },
            { label: "Active windows", value: "4", hint: "Distinct high-productivity route blocks" },
            { label: "Idle periods", value: "1.7 h", hint: "Inactive time detected in tracked session" },
            { label: "Pattern stability", value: "Strong", hint: "Movement behavior matches trusted baseline", badge: "AI" }
          ]}
        />
        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <LineChartCard values={movementSeries} labels={riskLabels} title="Movement pattern visualization" />
          <GlassPanel title="Active vs inactive timeline" description="Session pattern view of workday activity.">
            <div className="space-y-4">
              {[
                ["07:00 - 09:00", "Active"],
                ["09:00 - 09:45", "Inactive"],
                ["09:45 - 13:10", "Active"],
                ["13:10 - 14:00", "Low activity"],
                ["14:00 - 18:00", "Active"]
              ].map(([slot, state]) => (
                <div key={slot} className="flex items-center justify-between rounded-[22px] border border-white/10 bg-slate-950/35 px-4 py-4">
                  <p className="text-sm text-slate-300">{slot}</p>
                  <p className="text-sm font-medium text-white">{state}</p>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <GlassPanel title="Delivery simulation pattern" description="Mock route cluster density showing a realistic delivery pattern across the city.">
            <div className="grid h-[300px] grid-cols-6 gap-3 rounded-[28px] border border-white/10 bg-slate-950/35 p-4">
              {Array.from({ length: 24 }).map((_, index) => (
                <div
                  key={index}
                  className={`rounded-[18px] ${[3, 4, 9, 10, 16, 17].includes(index) ? "bg-cyan-400/25" : [11, 12].includes(index) ? "bg-amber-400/20" : "bg-white/[0.04]"}`}
                />
              ))}
            </div>
          </GlassPanel>
          <TimelinePanel title="Tracked events" items={activityTimeline} />
        </div>
      </div>
    </PlatformShell>
  );
}
