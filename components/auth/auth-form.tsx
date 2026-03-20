"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type AuthMode = "login" | "signup";

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const payload =
        mode === "login"
          ? {
              identifier: String(formData.get("identifier") || ""),
              password: String(formData.get("password") || "")
            }
          : {
              name: String(formData.get("name") || ""),
              email: String(formData.get("email") || ""),
              phone: String(formData.get("phone") || ""),
              password: String(formData.get("password") || ""),
              city: String(formData.get("city") || "")
            };

      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Authentication failed");
        return;
      }

      router.push(data.data.role === "ADMIN" ? "/dashboard/admin" : "/dashboard");
      router.refresh();
    });
  }

  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardTitle>{mode === "login" ? "Welcome back" : "Create your protection account"}</CardTitle>
      <CardDescription className="mt-3">
        {mode === "login"
          ? "Use your email or phone to access your worker or admin dashboard."
          : "Start with a simple worker account and activate a weekly protection plan."}
      </CardDescription>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {mode === "signup" ? (
          <>
            <Input name="name" placeholder="Full name" required />
            <Input name="email" type="email" placeholder="Email (optional if phone provided)" />
            <Input name="phone" placeholder="Phone number (optional if email provided)" />
            <Input name="city" placeholder="City" required />
          </>
        ) : (
          <Input name="identifier" placeholder="Email or phone" required />
        )}
        <Input name="password" type="password" placeholder="Password" required />
        {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        <Button className="w-full" type="submit" disabled={isPending}>
          {isPending ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
        </Button>
      </form>
    </Card>
  );
}
