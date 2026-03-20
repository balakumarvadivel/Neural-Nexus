import { redirect } from "next/navigation";
import { PlatformShell } from "@/components/platform/platform-shell";
import { GlassPanel } from "@/components/platform/data-viz";
import { getSessionUser } from "@/lib/auth/server";

export default async function SettingsPage() {
  const session = await getSessionUser();
  if (!session) redirect("/login");
  if (session.role === "ADMIN") redirect("/dashboard/admin");

  return (
    <PlatformShell title="Settings" description="Profile, payouts, alerts, and privacy controls for the worker experience." status="Configured">
      <div className="grid gap-6 xl:grid-cols-2">
        {[
          {
            title: "Profile settings",
            description: "Name, city, and contact details used for authentication and risk linking.",
            rows: ["Aarav Kumar", "Bengaluru", "worker@gigshield.ai"]
          },
          {
            title: "Payment method",
            description: "Primary UPI destination for automatic payouts.",
            rows: ["UPI handle verified", "Primary rail active", "Settlement confirmations enabled"]
          },
          {
            title: "Notification preferences",
            description: "Choose how risk alerts and payout updates reach you.",
            rows: ["In-app alerts enabled", "Push notifications on", "High-priority weather alerts pinned"]
          },
          {
            title: "Privacy controls",
            description: "Visibility and data-sharing controls across location and behavioral signals.",
            rows: ["Location sharing during protected hours", "Session anomaly review allowed", "Analytics export disabled"]
          }
        ].map((section) => (
          <GlassPanel key={section.title} title={section.title} description={section.description}>
            <div className="space-y-3">
              {section.rows.map((row) => (
                <div key={row} className="rounded-[22px] border border-white/10 bg-slate-950/35 px-4 py-4 text-sm text-slate-300">
                  {row}
                </div>
              ))}
            </div>
          </GlassPanel>
        ))}
      </div>
    </PlatformShell>
  );
}
