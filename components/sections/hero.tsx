"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CloudRain, Shield, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pb-20 pt-12">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(22,163,74,0.25),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(249,115,22,0.22),_transparent_30%)]" />
      <div className="grid gap-10 lg:grid-cols-[1.25fr_0.9fr] lg:items-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <p className="mb-5 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200">
            Climate-triggered micro-insurance for India&apos;s delivery workforce
          </p>
          <h1 className="max-w-3xl text-5xl font-semibold leading-tight tracking-tight text-white md:text-7xl">
            Because rain shouldn&apos;t decide someone&apos;s salary
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            GigShield AI turns weather disruption into automatic protection. When heavy rain, dangerous heat, or toxic air
            makes delivery work unsafe, payouts are triggered without claims paperwork.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild size="lg">
              <Link href="/signup">Protect this week</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/dashboard">View worker dashboard</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid gap-5"
        >
          <Card className="bg-gradient-to-br from-emerald-400/15 to-slate-900/80">
            <CardTitle>Real-time protection state</CardTitle>
            <CardDescription className="mt-2">Weather, heat, and AQI triggers combine into one worker-safe decision layer.</CardDescription>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <StatTile icon={CloudRain} label="Rainfall" value="38 mm" />
              <StatTile icon={Shield} label="Protection" value="Active" />
              <StatTile icon={Wallet} label="Payout" value="Auto" />
            </div>
          </Card>
          <Card>
            <CardDescription>Built for insurers, platforms, and governments piloting resilient gig work safety nets.</CardDescription>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

function StatTile({
  icon: Icon,
  label,
  value
}: {
  icon: typeof CloudRain;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-4">
      <Icon className="h-5 w-5 text-emerald-300" />
      <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-2 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}
