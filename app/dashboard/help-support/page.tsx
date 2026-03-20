import { redirect } from "next/navigation";
import { PlatformShell } from "@/components/platform/platform-shell";
import { GlassPanel } from "@/components/platform/data-viz";
import { getSessionUser } from "@/lib/auth/server";

export default async function HelpSupportPage() {
  const session = await getSessionUser();
  if (!session) redirect("/login");
  if (session.role === "ADMIN") redirect("/dashboard/admin");

  return (
    <PlatformShell title="Help & Support" description="Clear guidance for coverage behavior, payouts, and safety alerts." status="Support Online">
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <GlassPanel title="Support center" description="Essential help topics for workers using GigShield AI.">
          <div className="space-y-3">
            {[
              "How automatic payouts work",
              "What triggers a disruption payout",
              "Why trust score can delay a settlement",
              "How to keep policy data accurate"
            ].map((topic) => (
              <div key={topic} className="rounded-[22px] border border-white/10 bg-slate-950/35 px-4 py-4 text-sm text-slate-300">
                {topic}
              </div>
            ))}
          </div>
        </GlassPanel>
        <GlassPanel title="Empty state design" description="No unresolved support tickets at the moment.">
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-slate-950/25 text-center">
            <p className="text-lg font-medium text-white">Everything looks good right now</p>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
              When a support issue or escalated review appears, it will show up here with the right context instead of a blank screen.
            </p>
          </div>
        </GlassPanel>
      </div>
    </PlatformShell>
  );
}
