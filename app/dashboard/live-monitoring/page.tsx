import { redirect } from "next/navigation";
import { PlatformShell } from "@/components/platform/platform-shell";
import { GlassPanel, MetricGrid, StatRows } from "@/components/platform/data-viz";
import { getSessionUser } from "@/lib/auth/server";
import { monitoringZones } from "@/lib/platform-mock";

export default async function LiveMonitoringPage() {
  const session = await getSessionUser();
  if (!session) redirect("/login");
  if (session.role === "ADMIN") redirect("/dashboard/admin");

  return (
    <PlatformShell title="Live Monitoring" description="Real-time city monitoring for active triggers, unsafe zones, and next disruption likelihood." status="Monitoring">
      <div className="space-y-6">
        <MetricGrid
          items={[
            { label: "Weather tracking", value: "Live", hint: "Rain, heat, and AQI updates every 15 minutes", badge: "Online" },
            { label: "Affected zones", value: "3", hint: "High-volatility routes detected in active city" },
            { label: "Trigger watch", value: "2 active", hint: "Rainfall and AQI are close to threshold" },
            { label: "Prediction confidence", value: "87%", hint: "Next disruption probability for the next 60 minutes" }
          ]}
        />
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <GlassPanel title="Affected zone map" description="A map-style operational view rendered as route clusters for the prototype.">
            <div className="grid h-[360px] grid-cols-3 gap-3 rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.18),transparent_25%),linear-gradient(135deg,rgba(2,6,23,0.9),rgba(15,23,42,0.8))] p-4">
              {Array.from({ length: 9 }).map((_, index) => (
                <div
                  key={index}
                  className={`rounded-[22px] border border-white/10 ${index === 4 || index === 7 ? "bg-cyan-400/20" : index === 5 ? "bg-amber-400/20" : "bg-white/[0.04]"}`}
                />
              ))}
            </div>
          </GlassPanel>
          <div className="space-y-6">
            <GlassPanel title="Trigger conditions panel" description="Condition-level monitoring aligned to payout logic.">
              <StatRows
                items={[
                  { label: "Rain trigger", value: "18 mm / 25 mm", detail: "Approaching threshold" },
                  { label: "Heat trigger", value: "41 C / 40 C", detail: "Threshold exceeded", tone: "alert" },
                  { label: "AQI trigger", value: "176 / 180", detail: "Likely to breach in 20 minutes" }
                ]}
              />
            </GlassPanel>
            <GlassPanel title="Next possible disruption" description="AI-estimated disruption window based on active environmental momentum.">
              <p className="text-3xl font-semibold text-white">12:40 PM</p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Whitefield and the eastern corridor are the most likely to trigger a temporary unsafe-work state next.
              </p>
              <div className="mt-5 space-y-3">
                {monitoringZones.map((zone) => (
                  <div key={zone.label} className="rounded-[22px] border border-white/10 bg-slate-950/35 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-white">{zone.label}</p>
                      <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">{zone.value}</p>
                    </div>
                    <p className="mt-2 text-sm text-slate-400">{zone.detail}</p>
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
