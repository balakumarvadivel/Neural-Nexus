"use client";

import type { FormEvent } from "react";
import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatDate } from "@/lib/utils";

type AdminPayload = Awaited<ReturnType<typeof import("@/lib/services/dashboard").getAdminDashboard>>;

export function AdminDashboard({ dashboard }: { dashboard: AdminPayload }) {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSimulation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const response = await fetch("/api/environment/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: String(formData.get("city")),
          rainfallMm: Number(formData.get("rainfallMm")),
          temperatureC: Number(formData.get("temperatureC")),
          aqi: Number(formData.get("aqi"))
        })
      });
      const data = await response.json();
      setMessage(response.ok ? "Environment updated for simulation." : data.error || "Simulation failed.");
    });
  }

  function handlePayoutRun() {
    startTransition(async () => {
      const response = await fetch("/api/payout/run", { method: "POST" });
      const data = await response.json();
      setMessage(response.ok ? `Payout engine processed ${data.data.processed} subscriptions.` : data.error || "Run failed.");
    });
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-5 md:grid-cols-4">
        <Stat label="Workers" value={String(dashboard.stats.totalUsers)} />
        <Stat label="Admins" value={String(dashboard.stats.admins)} />
        <Stat label="Flagged users" value={String(dashboard.stats.flaggedUsers)} />
        <Stat label="Delayed payouts" value={String(dashboard.stats.delayedPayouts)} />
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardTitle>Admin controls</CardTitle>
          <CardDescription className="mt-3">
            Simulate environmental disruptions, then trigger the payout engine exactly as a scheduled worker would.
          </CardDescription>
          <form onSubmit={handleSimulation} className="mt-6 space-y-3">
            <Input name="city" placeholder="City" defaultValue="Bengaluru" />
            <Input name="rainfallMm" type="number" placeholder="Rainfall mm" defaultValue={38} />
            <Input name="temperatureC" type="number" placeholder="Temperature C" defaultValue={41} />
            <Input name="aqi" type="number" placeholder="AQI" defaultValue={198} />
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Processing..." : "Simulate environment"}
            </Button>
          </form>
          <Button variant="outline" className="mt-4 w-full" onClick={handlePayoutRun} disabled={isPending}>
            Run payout engine
          </Button>
          {message ? <p className="mt-4 text-sm text-emerald-200">{message}</p> : null}
        </Card>

        <Card>
          <CardTitle>Flagged accounts</CardTitle>
          <div className="mt-5 space-y-4">
            {dashboard.flaggedUsers.length === 0 ? (
              <p className="text-sm text-slate-400">No flagged accounts right now.</p>
            ) : (
              dashboard.flaggedUsers.map((user) => (
                <div key={user.id} className="rounded-3xl border border-white/10 bg-slate-950/50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-white">{user.name}</p>
                      <p className="text-sm text-slate-400">{user.email || user.phone}</p>
                    </div>
                    <Badge className="border-amber-300/30 bg-amber-300/10 text-amber-100">Review</Badge>
                  </div>
                  <div className="mt-3 space-y-2">
                    {user.fraudFlags.map((flag) => (
                      <p key={flag.id} className="text-sm text-slate-300">
                        {flag.severity}: {flag.reason}
                      </p>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardTitle>All users</CardTitle>
          <div className="mt-5 overflow-hidden rounded-3xl border border-white/10">
            <table className="min-w-full text-left text-sm text-slate-300">
              <thead className="bg-white/5 text-xs uppercase tracking-[0.24em] text-slate-400">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">City</th>
                  <th className="px-4 py-3">Coverage</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.users.map((user) => (
                  <tr key={user.id} className="border-t border-white/10">
                    <td className="px-4 py-3">{user.name}</td>
                    <td className="px-4 py-3">{user.role}</td>
                    <td className="px-4 py-3">{user.city || "-"}</td>
                    <td className="px-4 py-3">{formatCurrency(user.subscriptions[0]?.weeklyCoverage || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <CardTitle>Delayed payouts</CardTitle>
          <div className="mt-5 space-y-4">
            {dashboard.delayedPayouts.length === 0 ? (
              <p className="text-sm text-slate-400">No delayed payouts.</p>
            ) : (
              dashboard.delayedPayouts.map((payout) => (
                <div key={payout.id} className="rounded-3xl border border-white/10 bg-slate-950/50 p-4">
                  <p className="font-medium text-white">{payout.user.name}</p>
                  <p className="mt-1 text-sm text-slate-400">{payout.reason}</p>
                  <p className="mt-2 text-sm text-amber-200">{formatCurrency(payout.amount)}</p>
                  <p className="mt-1 text-xs text-slate-500">{formatDate(payout.createdAt)}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardDescription>{label}</CardDescription>
      <CardTitle className="mt-3 text-3xl">{value}</CardTitle>
    </Card>
  );
}
