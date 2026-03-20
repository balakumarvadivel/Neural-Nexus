"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Gauge, HandCoins, ScanSearch, ShieldAlert, Waves } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

const steps = [
  {
    title: "Worker subscribes weekly",
    description: "Choose a city, view the premium, and activate protection for the coming work week."
  },
  {
    title: "Environment is continuously evaluated",
    description: "GigShield AI tracks rainfall, temperature, and AQI thresholds in each coverage city."
  },
  {
    title: "Payouts trigger automatically",
    description: "If conditions enter a risk zone, the payout engine creates and processes compensation with no claims form."
  }
];

const trustItems = [
  {
    icon: Gauge,
    title: "Trust score engine",
    description: "Scores GPS consistency, activity pattern, and session behavior to reduce abuse without blocking honest workers."
  },
  {
    icon: ScanSearch,
    title: "Fraud detection",
    description: "Flags unrealistic activity, identity pattern overlap, and sudden location jumps for admin review."
  },
  {
    icon: ShieldAlert,
    title: "Priority controls",
    description: "Low-trust or flagged accounts are delayed, not blindly denied, keeping the system humane and resilient."
  }
];

export function LandingSections() {
  return (
    <div className="space-y-24 pb-20">
      <SectionBlock
        eyebrow="The problem"
        title="A delivery shift can disappear in one storm"
        body="A rider can wake up ready to earn, pay rent, and send money home, only to lose the entire day when roads flood, heat becomes dangerous, or pollution spikes. Most income protection products are built for salaried workers. Gig workers are left carrying all of the risk alone."
        icon={<Waves className="h-6 w-6 text-orange-300" />}
      />
      <SectionBlock
        eyebrow="What we built"
        title="An automatic financial safety layer for platform work"
        body="GigShield AI combines climate signals, subscription protection, payout automation, and trust scoring into one operating system for worker resilience. It is designed as an MVP that can run today and scale into insurer-grade workflows later."
        icon={<HandCoins className="h-6 w-6 text-emerald-300" />}
      />
      <section className="space-y-8">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-emerald-300">How it works</p>
          <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">Three steps from risk detection to payout</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12 }}
            >
              <Card className="h-full">
                <p className="text-sm text-emerald-300">0{index + 1}</p>
                <CardTitle className="mt-4">{step.title}</CardTitle>
                <CardDescription className="mt-3 leading-7">{step.description}</CardDescription>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
      <section className="space-y-8">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-emerald-300">Fraud and trust</p>
          <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">Protection that stays fair under pressure</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {trustItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12 }}
            >
              <Card className="h-full">
                <item.icon className="h-6 w-6 text-amber-300" />
                <CardTitle className="mt-4">{item.title}</CardTitle>
                <CardDescription className="mt-3 leading-7">{item.description}</CardDescription>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
      <SectionBlock
        eyebrow="Mission"
        title="If climate volatility keeps rising, worker protection has to become real-time"
        body="GigShield AI is a simple proposition: when risk prevents work, income support should move automatically. No forms, no long disputes, no waiting for a perfect system before helping the people most exposed to disruption."
        icon={<AlertTriangle className="h-6 w-6 text-rose-300" />}
      />
    </div>
  );
}

function SectionBlock({
  eyebrow,
  title,
  body,
  icon
}: {
  eyebrow: string;
  title: string;
  body: string;
  icon: ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="grid gap-6 rounded-[36px] border border-white/10 bg-white/5 p-8 md:grid-cols-[auto_1fr] md:gap-8 md:p-10"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/8">{icon}</div>
      <div>
        <p className="text-sm uppercase tracking-[0.32em] text-emerald-300">{eyebrow}</p>
        <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">{title}</h2>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-300">{body}</p>
      </div>
    </motion.section>
  );
}
