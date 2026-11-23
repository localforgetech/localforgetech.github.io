"use client";

import { Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  INDUSTRIES,
  LEAD_STATUSES,
  SOURCES,
} from "@/lib/constants";
import type { LeadDTO } from "@/lib/types";
import { leadCreateSchema } from "@/lib/validation";

export type LeadFormValues = {
  businessName: string;
  contactPerson: string;
  phone: string;
  email: string;
  industry: string;
  status: string;
  source: string;
  value: number;
  nextFollowUp: string;
  notes: string;
};

const EMPTY: LeadFormValues = {
  businessName: "",
  contactPerson: "",
  phone: "",
  email: "",
  industry: "Other",
  status: "New Lead",
  source: "Website Enquiry",
  value: 0,
  nextFollowUp: "",
  notes: "",
};

function toFormValues(lead: LeadDTO | null): LeadFormValues {
  if (!lead) return EMPTY;
  return {
    businessName: lead.businessName,
    contactPerson: lead.contactPerson ?? "",
    phone: lead.phone,
    email: lead.email ?? "",
    industry: lead.industry,
    status: lead.status,
    source: lead.source,
    value: lead.value,
    nextFollowUp: lead.nextFollowUp ?? "",
    notes: lead.notes ?? "",
  };
}

const FIELD_IDS: Record<string, string> = {
  businessName: "lead-businessName",
  phone: "lead-phone",
  email: "lead-email",
  value: "lead-value",
  nextFollowUp: "lead-nextFollowUp",
};

export function LeadFormDialog({
  open,
  onOpenChange,
  lead,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: LeadDTO | null;
  onSubmit: (values: LeadFormValues) => Promise<boolean>;
}) {
  const [values, setValues] = useState<LeadFormValues>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setValues(toFormValues(lead));
      setErrors({});
    }
  }, [open, lead]);

  function update<K extends keyof LeadFormValues>(
    key: K,
    value: LeadFormValues[K],
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

    const parsed = leadCreateSchema.safeParse({
      ...values,
      value: values.value,
      nextFollowUp: values.nextFollowUp,
    });

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      const next: Record<string, string> = {};
      for (const [key, messages] of Object.entries(fieldErrors)) {
        if (messages && messages.length > 0) next[key] = messages[0];
      }
      setErrors(next);
      const firstKey = Object.keys(next)[0];
      if (firstKey) {
        requestAnimationFrame(() => {
          document.getElementById(FIELD_IDS[firstKey] ?? "")?.focus();
        });
      }
      return;
    }

    setSubmitting(true);
    const ok = await onSubmit(values);
    setSubmitting(false);
    if (ok) onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-[#0a1220] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{lead ? "Edit lead" : "Add a lead"}</DialogTitle>
          <DialogDescription>
            {lead
              ? "Update the details for this enquiry."
              : "Log a new enquiry so it appears in your pipeline."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="lead-businessName">
                Business name <span className="text-cyan-400">*</span>
              </Label>
              <Input
                id="lead-businessName"
                value={values.businessName}
                onChange={(e) => update("businessName", e.target.value)}
                aria-invalid={Boolean(errors.businessName)}
              />
              {errors.businessName && (
                <p className="text-xs text-rose-400">{errors.businessName}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="lead-contactPerson">Contact person</Label>
              <Input
                id="lead-contactPerson"
                value={values.contactPerson}
                onChange={(e) => update("contactPerson", e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="lead-phone">
                Phone <span className="text-cyan-400">*</span>
              </Label>
              <Input
                id="lead-phone"
                type="tel"
                inputMode="tel"
                value={values.phone}
                onChange={(e) => update("phone", e.target.value)}
                aria-invalid={Boolean(errors.phone)}
              />
              {errors.phone && (
                <p className="text-xs text-rose-400">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="lead-email">Email</Label>
              <Input
                id="lead-email"
                type="email"
                inputMode="email"
                value={values.email}
                onChange={(e) => update("email", e.target.value)}
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email && (
                <p className="text-xs text-rose-400">{errors.email}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="lead-industry">Industry</Label>
              <Select
                value={values.industry}
                onValueChange={(v) => update("industry", v)}
              >
                <SelectTrigger id="lead-industry" className="w-full">
                  <SelectValue />
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

            <div className="space-y-1.5">
              <Label htmlFor="lead-status">Status</Label>
              <Select
                value={values.status}
                onValueChange={(v) => update("status", v)}
              >
                <SelectTrigger id="lead-status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEAD_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="lead-source">Source</Label>
              <Select
                value={values.source}
                onValueChange={(v) => update("source", v)}
              >
                <SelectTrigger id="lead-source" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SOURCES.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="lead-value">Deal value (₹)</Label>
              <Input
                id="lead-value"
                type="number"
                inputMode="numeric"
                min={0}
                value={values.value}
                onChange={(e) => update("value", Number(e.target.value))}
                aria-invalid={Boolean(errors.value)}
              />
              {errors.value && (
                <p className="text-xs text-rose-400">{errors.value}</p>
              )}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="lead-nextFollowUp">Next follow-up</Label>
              <Input
                id="lead-nextFollowUp"
                type="date"
                value={values.nextFollowUp}
                onChange={(e) => update("nextFollowUp", e.target.value)}
                aria-invalid={Boolean(errors.nextFollowUp)}
              />
              {errors.nextFollowUp && (
                <p className="text-xs text-rose-400">{errors.nextFollowUp}</p>
              )}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="lead-notes">Notes</Label>
              <Textarea
                id="lead-notes"
                rows={3}
                value={values.notes}
                onChange={(e) => update("notes", e.target.value)}
                placeholder="What do they need? Any deadlines or budget notes?"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-white/15 bg-transparent"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="font-semibold">
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Saving…
                </>
              ) : (
                <>
                  <Save className="size-4" /> {lead ? "Save changes" : "Add lead"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
