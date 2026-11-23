"use client";

import { CheckCircle2, Loader2, MessageCircle, Send } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BUDGET_OPTIONS, BRAND, INDUSTRIES } from "@/lib/constants";
import { enquirySchema } from "@/lib/validation";

type Status = "idle" | "submitting" | "success" | "error";

const INITIAL = {
  businessName: "",
  contactPerson: "",
  phone: "",
  industry: "Other" as (typeof INDUSTRIES)[number],
  value: 35000,
  notes: "",
};

const FIELD_IDS: Record<string, string> = {
  businessName: "enquiry-businessName",
  phone: "enquiry-phone",
  contactPerson: "enquiry-contactPerson",
  industry: "enquiry-industry",
  value: "enquiry-value",
  notes: "enquiry-notes",
};

export function EnquiryForm() {
  const [values, setValues] = useState(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const [submittedName, setSubmittedName] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const submitting = status === "submitting";

  function update<K extends keyof typeof INITIAL>(
    key: K,
    value: (typeof INITIAL)[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError("");

    const parsed = enquirySchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      const next: Record<string, string> = {};
      for (const [key, messages] of Object.entries(fieldErrors)) {
        if (messages && messages.length > 0) next[key] = messages[0];
      }
      setErrors(next);
      setStatus("error");
      const firstKey = Object.keys(next)[0];
      if (firstKey) {
        requestAnimationFrame(() => {
          document.getElementById(FIELD_IDS[firstKey] ?? "")?.focus();
        });
      }
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string; lead?: { businessName: string } }
        | null;

      if (!response.ok || !data?.ok) {
        setServerError(
          data?.error ??
            "We could not submit your enquiry. Please try again or message us on WhatsApp.",
        );
        setStatus("error");
        toast.error("Enquiry not submitted", {
          description: "Please check your details and try again.",
        });
        return;
      }

      setSubmittedName(data.lead?.businessName ?? parsed.data.businessName);
      setValues(INITIAL);
      setErrors({});
      setStatus("success");
      toast.success("Enquiry received", {
        description: "We will follow up on WhatsApp shortly.",
      });
    } catch {
      setServerError(
        "Something went wrong while sending your enquiry. Please check your connection and try again.",
      );
      setStatus("error");
      toast.error("Network error", {
        description: "Please check your connection and try again.",
      });
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.06] p-8 text-center sm:p-10">
        <div className="mx-auto grid size-14 place-items-center rounded-full border border-emerald-500/40 bg-emerald-500/15 text-emerald-300">
          <CheckCircle2 className="size-7" />
        </div>
        <h3 className="mt-5 text-2xl font-bold text-white">
          Thanks, {submittedName}.
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-300">
          Your enquiry is in. We review every request personally and will reach
          out on WhatsApp to understand your project before sending a quote.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild className="font-semibold">
            <a
              href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(
                "Hello LocalForge Tech, I just submitted a project enquiry.",
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="size-4" /> Message on WhatsApp
            </a>
          </Button>
          <Button
            variant="outline"
            onClick={() => setStatus("idle")}
            className="border-white/15 bg-transparent"
          >
            Submit another enquiry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="enquiry-businessName">
            Business name <span className="text-cyan-400">*</span>
          </Label>
          <Input
            id="enquiry-businessName"
            name="businessName"
            autoComplete="organization"
            placeholder="e.g. Jind Fitness Hub"
            value={values.businessName}
            onChange={(e) => update("businessName", e.target.value)}
            aria-invalid={Boolean(errors.businessName)}
            aria-describedby={
              errors.businessName ? "enquiry-businessName-error" : undefined
            }
          />
          {errors.businessName && (
            <p id="enquiry-businessName-error" className="text-xs text-rose-400">
              {errors.businessName}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="enquiry-contactPerson">Your name</Label>
          <Input
            id="enquiry-contactPerson"
            name="contactPerson"
            autoComplete="name"
            placeholder="Who should we speak to?"
            value={values.contactPerson}
            onChange={(e) => update("contactPerson", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="enquiry-phone">
            WhatsApp / phone <span className="text-cyan-400">*</span>
          </Label>
          <Input
            id="enquiry-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="95186 16117"
            value={values.phone}
            onChange={(e) => update("phone", e.target.value)}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "enquiry-phone-error" : undefined}
          />
          {errors.phone && (
            <p id="enquiry-phone-error" className="text-xs text-rose-400">
              {errors.phone}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="enquiry-industry">Industry</Label>
          <Select
            value={values.industry}
            onValueChange={(value) =>
              update("industry", value as (typeof INDUSTRIES)[number])
            }
          >
            <SelectTrigger id="enquiry-industry" className="w-full">
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRIES.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="enquiry-value">Estimated budget</Label>
          <Select
            value={String(values.value)}
            onValueChange={(value) => update("value", Number(value))}
          >
            <SelectTrigger id="enquiry-value" className="w-full">
              <SelectValue placeholder="Select a budget range" />
            </SelectTrigger>
            <SelectContent>
              {BUDGET_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="enquiry-notes">What do you need built?</Label>
          <Textarea
            id="enquiry-notes"
            name="notes"
            rows={4}
            placeholder="e.g. A member app with attendance, fee reminders and a small admin dashboard."
            value={values.notes}
            onChange={(e) => update("notes", e.target.value)}
          />
        </div>
      </div>

      {serverError && (
        <p
          role="alert"
          className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300"
        >
          {serverError}
        </p>
      )}

      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">
          No spam. We only use these details to reply to your enquiry.
        </p>
        <Button
          type="submit"
          disabled={submitting}
          className="h-11 w-full px-6 font-semibold sm:w-auto"
        >
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Sending…
            </>
          ) : (
            <>
              <Send className="size-4" /> Send enquiry
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
