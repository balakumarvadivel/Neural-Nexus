import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { PageShell } from "@/components/layout/page-shell";

export default function LoginPage() {
  return (
    <PageShell className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-lg">
        <AuthForm mode="login" />
        <p className="mt-4 text-center text-sm text-slate-400">
          New to GigShield AI?{" "}
          <Link href="/signup" className="text-emerald-300">
            Create an account
          </Link>
        </p>
      </div>
    </PageShell>
  );
}
