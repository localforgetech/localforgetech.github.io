"use client";

import {
  CalendarClock,
  IndianRupee,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  Plus,
  Tag,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  formatINR,
  LEAD_STATUSES,
  LOG_TYPES,
  STATUS_STYLES,
  whatsappLink,
  type LeadStatus,
} from "@/lib/constants";
import type { LeadDTO } from "@/lib/types";
import { cn } from "@/lib/utils";

function formatDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function LeadDetailDialog({
  lead,
  onOpenChange,
  onAddLog,
  onStatusChange,
}: {
  lead: LeadDTO | null;
  onOpenChange: (open: boolean) => void;
  onAddLog: (
    leadId: string,
    values: { type: string; summary: string },
  ) => Promise<boolean>;
  onStatusChange: (leadId: string, status: LeadStatus) => Promise<boolean>;
}) {
  const [logType, setLogType] = useState<string>(LOG_TYPES[0]);
  const [summary, setSummary] = useState("");
  const [addingLog, setAddingLog] = useState(false);
  const [changingStatus, setChangingStatus] = useState(false);

  useEffect(() => {
    if (lead) {
      setLogType(LOG_TYPES[0]);
      setSummary("");
    }
  }, [lead]);

  if (!lead) return null;

  const style = STATUS_STYLES[lead.status];

  async function handleAddLog(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!lead || summary.trim().length < 2) return;
    setAddingLog(true);
    const ok = await onAddLog(lead.id, {
      type: logType,
      summary: summary.trim(),
    });
    setAddingLog(false);
    if (ok) setSummary("");
  }

  async function handleStatusChange(value: string) {
    if (!lead) return;
    setChangingStatus(true);
    await onStatusChange(lead.id, value as LeadStatus);
    setChangingStatus(false);
  }

  return (
    <Dialog open={Boolean(lead)} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-[#0a1220] sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="pr-6">{lead.businessName}</DialogTitle>
          <DialogDescription>
            {lead.contactPerson || "No contact name"} ·{" "}
            {lead.industry}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
              style.badge,
            )}
          >
            <span className={cn("size-1.5 rounded-full", style.dot)} />
            {lead.status}
          </span>
          <Select
            value={lead.status}
            onValueChange={handleStatusChange}
            disabled={changingStatus}
          >
            <SelectTrigger className="h-8 w-auto gap-1.5 border-white/10 text-xs">
              <SelectValue placeholder="Move to" />
            </SelectTrigger>
            <SelectContent>
              {LEAD_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  Move to {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {changingStatus && (
            <Loader2 className="size-3.5 animate-spin text-slate-400" />
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Phone className="size-4 text-slate-500" />
            <a
              href={`tel:${lead.phone}`}
              className="hover:text-cyan-300"
            >
              {lead.phone}
            </a>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Mail className="size-4 text-slate-500" />
            {lead.email ? (
              <a
                href={`mailto:${lead.email}`}
                className="truncate hover:text-cyan-300"
              >
                {lead.email}
              </a>
            ) : (
              <span className="text-slate-500">No email</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <IndianRupee className="size-4 text-slate-500" />
            {formatINR(lead.value)}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Tag className="size-4 text-slate-500" />
            {lead.source}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <CalendarClock className="size-4 text-slate-500" />
            Follow-up: {formatDate(lead.nextFollowUp)}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <MessageCircle className="size-4 text-slate-500" />
            <a
              href={whatsappLink(lead.phone, lead.businessName)}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-300 hover:text-emerald-200"
            >
              Message on WhatsApp
            </a>
          </div>
        </div>

        {lead.notes && (
          <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3 text-sm text-slate-300">
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-500">
              Notes
            </p>
            {lead.notes}
          </div>
        )}

        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Activity ({lead.logs.length})
          </p>

          {lead.logs.length === 0 ? (
            <p className="rounded-lg border border-dashed border-white/10 px-3 py-4 text-center text-xs text-slate-500">
              No activity logged yet. Add the first note below.
            </p>
          ) : (
            <ul className="space-y-2">
              {lead.logs.map((log) => (
                <li
                  key={log.id}
                  className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-cyan-300">
                      {log.type}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {formatDate(log.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-300">{log.summary}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <form onSubmit={handleAddLog} className="space-y-3 border-t border-white/10 pt-4">
          <div className="grid gap-3 sm:grid-cols-[10rem_1fr]">
            <div className="space-y-1.5">
              <Label htmlFor="log-type">Type</Label>
              <Select value={logType} onValueChange={setLogType}>
                <SelectTrigger id="log-type" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LOG_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="log-summary">Summary</Label>
              <Textarea
                id="log-summary"
                rows={2}
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
                placeholder="What was discussed?"
              />
            </div>
          </div>
          <Button
            type="submit"
            size="sm"
            disabled={addingLog || summary.trim().length < 2}
            className="font-semibold"
          >
            {addingLog ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Saving…
              </>
            ) : (
              <>
                <Plus className="size-4" /> Add activity
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
