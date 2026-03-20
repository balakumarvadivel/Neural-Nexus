"use client";

import type { FormEvent } from "react";
import { useState, useTransition } from "react";
import { DEMO_CITIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export function SubscriptionForm({ suggestedPremium }: { suggestedPremium: number }) {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const response = await fetch("/api/plan/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city: String(formData.get("city")) })
      });
      const data = await response.json();
      setMessage(response.ok ? "Protection plan activated successfully." : data.error || "Subscription failed.");
    });
  }

  return (
    <Card className="max-w-3xl">
      <CardTitle>Activate weekly protection</CardTitle>
      <CardDescription className="mt-3">
        Dynamic premium starts around INR {suggestedPremium}. Choose a city and coverage begins immediately for this MVP.
      </CardDescription>
      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-[1fr_auto]">
        <select
          name="city"
          className="h-12 rounded-2xl border border-white/10 bg-slate-950/70 px-4 text-sm text-white outline-none focus:border-emerald-400/70"
          defaultValue={DEMO_CITIES[0]}
        >
          {DEMO_CITIES.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Activating..." : "Subscribe weekly"}
        </Button>
      </form>
      {message ? <p className="mt-4 text-sm text-emerald-200">{message}</p> : null}
    </Card>
  );
}
