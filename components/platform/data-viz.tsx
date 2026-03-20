import type { ReactNode } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function GlassPanel({
  title,
  description,
  children,
  className,
  action
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}) {
  return (
    <Card className={cn("border-white/10 bg-white/[0.045] shadow-[0_20px_60px_rgba(2,8,23,0.45)]", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <CardTitle>{title}</CardTitle>
          {description ? <CardDescription className="mt-2">{description}</CardDescription> : null}
        </div>
        {action}
      </div>
      <div className="mt-6">{children}</div>
    </Card>
  );
}

export function MetricGrid({
  items
}: {
  items: Array<{ label: string; value: string; hint: string; badge?: string }>;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} className="border-white/10 bg-white/[0.045]">
          <div className="flex items-center justify-between gap-3">
            <CardDescription>{item.label}</CardDescription>
            {item.badge ? <Badge className="border-cyan-400/20 bg-cyan-400/10 text-cyan-200">{item.badge}</Badge> : null}
          </div>
          <CardTitle className="mt-4 text-3xl">{item.value}</CardTitle>
          <p className="mt-3 text-sm text-slate-400">{item.hint}</p>
        </Card>
      ))}
    </div>
  );
}

export function HeroProtectionCard({
  headline,
  coverage,
  risk,
  details
}: {
  headline: string;
  coverage: string;
  risk: string;
  details: string;
}) {
  return (
    <Card className="overflow-hidden border-cyan-400/10 bg-[linear-gradient(135deg,rgba(14,165,233,0.18),rgba(15,23,42,0.45),rgba(59,130,246,0.08))]">
      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-200">Weekly protection</p>
          <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">{headline}</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">{details}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Badge className="border-emerald-400/20 bg-emerald-400/10 text-emerald-200">{coverage}</Badge>
            <Badge className="border-amber-300/20 bg-amber-300/10 text-amber-100">{risk}</Badge>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
          {[
            { label: "System", value: "Protected" },
            { label: "Confidence", value: "98.2%" },
            { label: "Update cadence", value: "15 min" }
          ].map((item) => (
            <div key={item.label} className="rounded-[24px] border border-white/10 bg-slate-950/35 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{item.label}</p>
              <p className="mt-3 text-2xl font-semibold text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export function LineChartCard({
  values,
  labels,
  title = "Live risk graph"
}: {
  values: number[];
  labels: string[];
  title?: string;
}) {
  const max = Math.max(...values, 1);
  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1 || 1)) * 100;
      const y = 100 - (value / max) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <GlassPanel title={title} description="Modeled from rainfall, temperature, AQI, and local disruption patterns.">
      <div className="rounded-[28px] border border-white/10 bg-slate-950/35 p-4">
        <svg viewBox="0 0 100 100" className="h-56 w-full">
          <defs>
            <linearGradient id="risk-line" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          {[20, 40, 60, 80].map((grid) => (
            <line key={grid} x1="0" y1={grid} x2="100" y2={grid} stroke="rgba(148,163,184,0.15)" strokeDasharray="2 4" />
          ))}
          <polyline fill="none" stroke="url(#risk-line)" strokeWidth="2.5" points={points} />
          {values.map((value, index) => {
            const x = (index / (values.length - 1 || 1)) * 100;
            const y = 100 - (value / max) * 100;
            return <circle key={`${value}-${index}`} cx={x} cy={y} r="2.1" fill="#bae6fd" />;
          })}
        </svg>
        <div className="mt-3 flex justify-between text-xs uppercase tracking-[0.2em] text-slate-500">
          {labels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>
    </GlassPanel>
  );
}

export function LossEstimator({ current, protectedValue }: { current: number; protectedValue: number }) {
  const total = Math.max(current, protectedValue);
  const currentWidth = `${(current / total) * 100}%`;
  const protectedWidth = `${(protectedValue / total) * 100}%`;

  return (
    <GlassPanel title="Income loss estimator" description="Projected disruption-adjusted loss versus insured weekly coverage.">
      <div className="space-y-5">
        <div>
          <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
            <span>Potential income loss</span>
            <span>INR {current}</span>
          </div>
          <div className="h-4 rounded-full bg-white/10">
            <div className="h-4 rounded-full bg-gradient-to-r from-amber-300 to-rose-400" style={{ width: currentWidth }} />
          </div>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
            <span>Protected payout</span>
            <span>INR {protectedValue}</span>
          </div>
          <div className="h-4 rounded-full bg-white/10">
            <div className="h-4 rounded-full bg-gradient-to-r from-cyan-300 to-blue-500" style={{ width: protectedWidth }} />
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}

export function TimelinePanel({
  title,
  items
}: {
  title: string;
  items: Array<{ time: string; headline: string; detail: string; tone?: "info" | "warning" | "success" }>;
}) {
  const toneClasses = {
    info: "bg-cyan-300",
    warning: "bg-amber-300",
    success: "bg-emerald-300"
  };

  return (
    <GlassPanel title={title} description="Auto-generated system and payout events in chronological order.">
      <div className="space-y-5">
        {items.map((item) => (
          <div key={`${item.time}-${item.headline}`} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={cn("h-3 w-3 rounded-full", toneClasses[item.tone || "info"])} />
              <div className="mt-2 h-full w-px bg-white/10" />
            </div>
            <div className="pb-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{item.time}</p>
              <p className="mt-2 font-medium text-white">{item.headline}</p>
              <p className="mt-1 text-sm leading-6 text-slate-400">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

export function HeatGrid({
  title,
  values
}: {
  title: string;
  values: Array<Array<{ label: string; value: number }>>;
}) {
  return (
    <GlassPanel title={title} description="Zone-level exposure intensity based on active climate and pollution triggers.">
      <div className="grid gap-3 sm:grid-cols-3">
        {values.flat().map((cell) => (
          <div
            key={cell.label}
            className="rounded-[24px] border border-white/10 p-4"
            style={{
              background: `linear-gradient(135deg, rgba(56,189,248,${0.15 + cell.value / 200}), rgba(30,41,59,0.45))`
            }}
          >
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{cell.label}</p>
            <p className="mt-3 text-2xl font-semibold text-white">{cell.value}</p>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

export function SuggestionPanel({ suggestions }: { suggestions: string[] }) {
  return (
    <GlassPanel
      title="AI suggestions"
      description="Personalized suggestions generated from your current route exposure and risk profile."
      action={<Sparkles className="h-5 w-5 text-cyan-200" />}
    >
      <div className="space-y-3">
        {suggestions.map((suggestion) => (
          <div key={suggestion} className="flex items-start gap-3 rounded-[22px] border border-white/10 bg-slate-950/35 p-4">
            <ArrowUpRight className="mt-0.5 h-4 w-4 text-cyan-200" />
            <p className="text-sm leading-6 text-slate-300">{suggestion}</p>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

export function StatRows({
  items
}: {
  items: Array<{ label: string; value: string; detail?: string; tone?: "default" | "alert" | "safe" }>;
}) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.label} className="flex items-center justify-between rounded-[22px] border border-white/10 bg-slate-950/35 px-4 py-4">
          <div>
            <p className="text-sm text-slate-300">{item.label}</p>
            {item.detail ? <p className="mt-1 text-xs text-slate-500">{item.detail}</p> : null}
          </div>
          <p
            className={cn(
              "text-sm font-medium",
              item.tone === "alert" ? "text-amber-200" : item.tone === "safe" ? "text-emerald-200" : "text-white"
            )}
          >
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}

export function MeterCard({
  title,
  value,
  subtitle
}: {
  title: string;
  value: number;
  subtitle: string;
}) {
  const angle = Math.min(180, Math.max(0, (value / 100) * 180));

  return (
    <GlassPanel title={title} description={subtitle}>
      <div className="relative mx-auto flex h-48 w-48 items-center justify-center">
        <div className="absolute inset-0 rounded-full border-[14px] border-white/10" />
        <div
          className="absolute inset-0 rounded-full border-[14px] border-cyan-300 border-r-transparent border-b-transparent"
          style={{ transform: `rotate(${angle}deg)` }}
        />
        <div className="text-center">
          <p className="text-4xl font-semibold text-white">{value}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.26em] text-slate-400">risk score</p>
        </div>
      </div>
    </GlassPanel>
  );
}

export function LoadingSkeletonGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="h-36 animate-pulse rounded-[28px] border border-white/10 bg-white/[0.04]" />
      ))}
    </div>
  );
}
