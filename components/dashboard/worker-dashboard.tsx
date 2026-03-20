import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/dashboard/metric-card";
import { formatCurrency, formatDate } from "@/lib/utils";

type WorkerDashboardData = Awaited<ReturnType<typeof import("@/lib/services/dashboard").getUserDashboard>>;

export function WorkerDashboard({ dashboard }: { dashboard: WorkerDashboardData }) {
  return (
    <div className="space-y-8">
      <section className="grid gap-5 lg:grid-cols-4">
        <MetricCard label="Weekly earnings estimate" value={formatCurrency(dashboard.metrics.weeklyEarningsEstimate)} hint="Based on your current city and recent activity baseline." />
        <MetricCard label="Protection status" value={dashboard.metrics.activeProtectionStatus.replace("_", " ")} hint="Updates when your subscription or risk state changes." />
        <MetricCard label="Real-time work status" value={dashboard.metrics.riskStatus} hint="Driven by rainfall, temperature, and AQI triggers." />
        <MetricCard label="Trust score" value={`${dashboard.metrics.trustScore}/100`} hint="Lower scores may delay payouts for safety checks." />
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardTitle>Protection overview</CardTitle>
          <CardDescription className="mt-3">
            Your current city is {dashboard.profile.city}. Dynamic premium for this week is {formatCurrency(dashboard.metrics.dynamicPremium)}.
          </CardDescription>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <StatusTile label="Rainfall" value={`${dashboard.environment.rainfallMm} mm`} active={dashboard.environment.triggers.rain} />
            <StatusTile label="Temperature" value={`${dashboard.environment.temperatureC} °C`} active={dashboard.environment.triggers.heat} />
            <StatusTile label="AQI" value={`${dashboard.environment.aqi}`} active={dashboard.environment.triggers.pollution} />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/plans">Activate protection plan</Link>
            </Button>
            <Badge className={dashboard.profile.flagged ? "border-amber-400/30 bg-amber-400/10 text-amber-200" : "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"}>
              {dashboard.profile.flagged ? "Account under review" : "Account in good standing"}
            </Badge>
          </div>
        </Card>

        <Card>
          <CardTitle>Trust and fraud signals</CardTitle>
          <div className="mt-5 space-y-4">
            <TrustRow label="GPS consistency" value={dashboard.riskScore.gpsConsistency} />
            <TrustRow label="Activity pattern" value={dashboard.riskScore.activityPattern} />
            <TrustRow label="Session consistency" value={dashboard.riskScore.sessionConsistency} />
          </div>
          <p className="mt-5 text-sm text-slate-400">
            {dashboard.flags.length > 0
              ? `There are ${dashboard.flags.length} active fraud review items on this account.`
              : "No active fraud flags. Payouts can process automatically when triggers hit."}
          </p>
        </Card>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardTitle>Past payouts</CardTitle>
          <div className="mt-5 space-y-4">
            {dashboard.payouts.length === 0 ? (
              <p className="text-sm text-slate-400">No payouts yet. When risk triggers are met, records will appear automatically.</p>
            ) : (
              dashboard.payouts.map((payout) => (
                <div key={payout.id} className="rounded-3xl border border-white/10 bg-slate-950/50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-400">{payout.reason}</p>
                      <p className="mt-1 text-xs text-slate-500">{formatDate(payout.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-white">{formatCurrency(payout.amount)}</p>
                      <p className="text-xs uppercase tracking-[0.24em] text-emerald-300">{payout.status}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <CardTitle>Protection promise</CardTitle>
          <CardDescription className="mt-3">
            GigShield AI removes the claim form from climate disruption. Unsafe conditions are matched against your active subscription and processed through the payout engine.
          </CardDescription>
          <div className="mt-6 space-y-3 text-sm text-slate-300">
            <p>Automatic weekly coverage</p>
            <p>Dynamic premium by city and risk</p>
            <p>No manual claims flow</p>
            <p>Trust-aware payout prioritization</p>
          </div>
        </Card>
      </section>
    </div>
  );
}

function StatusTile({ label, value, active }: { label: string; value: string; active: boolean }) {
  return (
    <div className={`rounded-3xl border p-4 ${active ? "border-amber-300/30 bg-amber-300/10" : "border-white/10 bg-slate-950/60"}`}>
      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-400">{active ? "Above payout threshold" : "Within safe threshold"}</p>
    </div>
  );
}

function TrustRow({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2 rounded-full bg-white/10">
        <div className="h-2 rounded-full bg-gradient-to-r from-amber-300 to-emerald-300" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
