import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { PageShell } from "@/components/layout/page-shell";

export default function SignupPage() {
  return (
    <PageShell className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-lg">
        <AuthForm mode="signup" />
        <p className="mt-4 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="text-emerald-300">
            Login
          </Link>
        </p>
      </div>
    </PageShell>
  );
}
