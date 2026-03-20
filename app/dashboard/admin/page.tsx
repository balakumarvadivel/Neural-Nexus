import { redirect } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import { getSessionUser } from "@/lib/auth/server";
import { getAdminDashboard } from "@/lib/services/dashboard";

export default async function AdminDashboardPage() {
  const session = await getSessionUser();
  if (!session) {
    redirect("/login");
  }

  if (session.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const dashboard = await getAdminDashboard();

  return (
    <PageShell className="py-12">
      <AdminDashboard dashboard={dashboard} />
    </PageShell>
  );
}
