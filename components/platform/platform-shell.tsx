"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import type { Route } from "next";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
  Activity,
  AlertTriangle,
  Bell,
  ChevronLeft,
  CircleHelp,
  LogOut,
  LayoutDashboard,
  LineChart,
  MapPinned,
  Menu,
  Radar,
  Search,
  Settings,
  Shield,
  ShieldAlert,
  Signal,
  Wallet
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Policy", href: "/dashboard/policy", icon: Shield },
  { label: "Risk Insights", href: "/dashboard/risk-insights", icon: Radar },
  { label: "Live Monitoring", href: "/dashboard/live-monitoring", icon: MapPinned },
  { label: "Claims & Payouts", href: "/dashboard/claims-payouts", icon: Wallet },
  { label: "Fraud Detection Center", href: "/dashboard/fraud-detection-center", icon: ShieldAlert },
  { label: "Activity Tracker", href: "/dashboard/activity-tracker", icon: Activity },
  { label: "Earnings Protection", href: "/dashboard/earnings-protection", icon: Signal },
  { label: "Alerts & Notifications", href: "/dashboard/alerts-notifications", icon: Bell },
  { label: "Analytics", href: "/dashboard/analytics", icon: LineChart },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
  { label: "Help & Support", href: "/dashboard/help-support", icon: CircleHelp }
] as const satisfies ReadonlyArray<{
  label: string;
  href: Route;
  icon: typeof LayoutDashboard;
}>;

export function PlatformShell({
  children,
  title,
  description,
  statusLabel = "System Status",
  status = "Protected"
}: {
  children: ReactNode;
  title: string;
  description: string;
  statusLabel?: string;
  status?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [isLoggingOut, startTransition] = useTransition();
  const [profile, setProfile] = useState<{
    name: string;
    role: "WORKER" | "ADMIN";
  } | null>(null);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const response = await fetch("/api/user/profile", {
          credentials: "include",
          cache: "no-store"
        });

        if (!response.ok) {
          return;
        }

        const result = await response.json();
        if (!active || !result?.data) {
          return;
        }

        setProfile({
          name: result.data.name,
          role: result.data.role
        });
      } catch {
        // Leave the shell on a safe fallback if profile loading fails.
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  const initials = useMemo(() => {
    const source = profile?.name?.trim();
    if (!source) {
      return "GU";
    }

    return source
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("");
  }, [profile?.name]);

  const roleLabel = profile?.role === "ADMIN" ? "Admin account" : "Worker account";

  function handleLogout() {
    startTransition(async () => {
      await fetch("/api/auth/logout", {
        method: "POST"
      });
      router.push("/login");
      router.refresh();
    });
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#020817_0%,#071326_50%,#020617_100%)] text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.16),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.9),transparent_35%)]" />
      <div className="flex min-h-screen">
        <aside
          className={cn(
            "sticky top-0 hidden h-screen border-r border-white/10 bg-slate-950/45 p-4 backdrop-blur-2xl transition-all duration-300 lg:block",
            collapsed ? "w-[96px]" : "w-[290px]"
          )}
        >
          <div className="flex items-center justify-between gap-3 px-3 pb-6 pt-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400/30 to-blue-500/20 text-cyan-200 shadow-[0_14px_40px_rgba(59,130,246,0.25)]">
                <Shield className="h-6 w-6" />
              </div>
              {!collapsed ? (
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-200">GigShield AI</p>
                  <p className="text-xs text-slate-400">Parametric protection cloud</p>
                </div>
              ) : null}
            </div>
            <button
              className="rounded-2xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10"
              onClick={() => setCollapsed((value) => !value)}
              type="button"
            >
              {collapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>

          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition-all",
                    active
                      ? "bg-gradient-to-r from-cyan-400/20 to-blue-500/15 text-white shadow-[0_12px_30px_rgba(37,99,235,0.2)]"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!collapsed ? <span>{item.label}</span> : null}
                </Link>
              );
            })}
          </div>

          {!collapsed ? (
            <div className="mt-8 rounded-[28px] border border-cyan-400/10 bg-gradient-to-br from-cyan-500/12 to-slate-900/60 p-4">
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-200">Live cover</p>
              <p className="mt-3 text-sm text-slate-300">AI is monitoring Bengaluru conditions every 15 minutes.</p>
              <Badge className="mt-4 border-emerald-400/20 bg-emerald-400/10 text-emerald-200">Realtime update</Badge>
            </div>
          ) : null}
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/35 px-4 py-4 backdrop-blur-2xl md:px-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-200">{statusLabel}</p>
                <div className="mt-2 flex items-center gap-3">
                  <h1 className="text-2xl font-semibold tracking-tight text-white">{title}</h1>
                  <Badge className="border-emerald-400/20 bg-emerald-400/10 text-emerald-200">{status}</Badge>
                </div>
                <p className="mt-2 text-sm text-slate-400">{description}</p>
              </div>

              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-400 shadow-[0_10px_30px_rgba(15,23,42,0.35)]">
                  <Search className="h-4 w-4 text-cyan-200" />
                  <span>Search policies, alerts, zones</span>
                </div>
                  <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10">
                  <Bell className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/25 to-blue-500/25 text-sm font-semibold text-cyan-100">
                    {initials}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-white">{profile?.name || "Loading profile..."}</p>
                    <p className="text-xs text-slate-400">{roleLabel}</p>
                  </div>
                  <button
                    className="ml-2 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/45 px-3 py-2 text-xs font-medium text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={handleLogout}
                    type="button"
                    disabled={isLoggingOut}
                  >
                    <LogOut className="h-4 w-4" />
                    {isLoggingOut ? "Signing out..." : "Logout"}
                  </button>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
