import { LoadingSkeletonGrid } from "@/components/platform/data-viz";
import { PlatformShell } from "@/components/platform/platform-shell";

export default function DashboardLoading() {
  return (
    <PlatformShell title="Dashboard" description="Loading your live protection workspace..." status="Syncing">
      <div className="space-y-6">
        <div className="h-64 animate-pulse rounded-[32px] border border-white/10 bg-white/[0.05]" />
        <LoadingSkeletonGrid />
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="h-80 animate-pulse rounded-[32px] border border-white/10 bg-white/[0.05]" />
          <div className="h-80 animate-pulse rounded-[32px] border border-white/10 bg-white/[0.05]" />
        </div>
      </div>
    </PlatformShell>
  );
}
