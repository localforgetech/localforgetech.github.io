"use client";

import { Loader2, LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/crm/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;

      if (!response.ok || !data?.ok) {
        setError(data?.error ?? "Could not sign in. Please try again.");
        setSubmitting(false);
        return;
      }

      router.replace("/crm");
      router.refresh();
    } catch {
      setError("Network error. Please check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="crm-password">Access key</Label>
        <Input
          id="crm-password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your access key"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "crm-password-error" : undefined}
          autoFocus
          required
        />
        {error && (
          <p id="crm-password-error" role="alert" className="text-xs text-rose-400">
            {error}
          </p>
        )}
      </div>
      <Button
        type="submit"
        disabled={submitting}
        className="h-10 w-full font-semibold"
      >
        {submitting ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Signing in…
          </>
        ) : (
          <>
            <LockKeyhole className="size-4" /> Sign in
          </>
        )}
      </Button>
    </form>
  );
}
