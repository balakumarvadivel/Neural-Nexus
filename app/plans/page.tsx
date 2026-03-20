import { redirect } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { SubscriptionForm } from "@/components/plans/subscription-form";
import { getSessionUser } from "@/lib/auth/server";
import { getUserDashboard } from "@/lib/services/dashboard";

export default async function PlansPage() {
  const session = await getSessionUser();
  if (!session) {
    redirect("/login");
  }

  const dashboard = await getUserDashboard(session.userId);

  return (
    <PageShell className="py-12">
      <div className="space-y-8">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-emerald-300">Plan subscription</p>
          <h1 className="mt-4 text-4xl font-semibold text-white">Choose a city and activate protection</h1>
          <p className="mt-4 max-w-2xl text-slate-300">
            Weekly protection is priced dynamically using your earnings baseline and the current environmental risk pattern.
          </p>
        </div>
        <SubscriptionForm suggestedPremium={dashboard.metrics.dynamicPremium} />
      </div>
    </PageShell>
  );
}
