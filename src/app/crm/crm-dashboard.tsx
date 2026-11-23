"use client";

import {
  ArrowLeft,
  Briefcase,
  CalendarClock,
  Download,
  Eye,
  IndianRupee,
  Loader2,
  Lock,
  LogOut,
  MessageCircle,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { BrandLockup } from "@/components/site/brand-mark";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatINR,
  INDUSTRIES,
  LEAD_STATUSES,
  STATUS_STYLES,
  whatsappLink,
  type LeadStatus,
} from "@/lib/constants";
import type { LeadDTO } from "@/lib/types";
import { cn } from "@/lib/utils";

import { LeadDetailDialog } from "./lead-detail-dialog";
import { LeadFormDialog, type LeadFormValues } from "./lead-form-dialog";

type Tab = "overview" | "pipeline" | "directory";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "pipeline", label: "Pipeline" },
  { id: "directory", label: "Directory" },
];

function formatDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

function StatusPill({ status }: { status: LeadStatus }) {
  const style = STATUS_STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium",
        style.badge,
      )}
    >
      <span className={cn("size-1.5 rounded-full", style.dot)} />
      {status}
    </span>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0a1220] p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {label}
        </span>
        <Icon className="size-4 text-cyan-400" />
      </div>
      <p className="mt-2 text-2xl font-bold tracking-tight text-white">
        {value}
      </p>
      <p className="mt-0.5 text-xs text-slate-500">{hint}</p>
    </div>
  );
}

export function CrmDashboard({ initialLeads }: { initialLeads: LeadDTO[] }) {
  const router = useRouter();
  const [leads, setLeads] = useState<LeadDTO[]>(initialLeads);
  const [tab, setTab] = useState<Tab>("overview");
  const [query, setQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [refreshing, setRefreshing] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<LeadDTO | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LeadDTO | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const detailLead = leads.find((lead) => lead.id === detailId) ?? null;

  const metrics = useMemo(() => {
    const total = leads.length;
    const won = leads.filter((lead) => lead.status === "Closed Won");
    const active = leads.filter(
      (lead) =>
        lead.status !== "Closed Won" && lead.status !== "Closed Lost",
    );
    const pipelineValue = leads
      .filter((lead) => lead.status !== "Closed Lost")
      .reduce((sum, lead) => sum + lead.value, 0);
    const wonValue = won.reduce((sum, lead) => sum + lead.value, 0);
    const conversion = total > 0 ? Math.round((won.length / total) * 100) : 0;

    return {
      total,
      active: active.length,
      pipelineValue,
      wonValue,
      wonCount: won.length,
      conversion,
    };
  }, [leads]);

  const statusCounts = useMemo(
    () =>
      LEAD_STATUSES.map((status) => {
        const items = leads.filter((lead) => lead.status === status);
        return {
          status,
          count: items.length,
          value: items.reduce((sum, lead) => sum + lead.value, 0),
        };
      }),
    [leads],
  );

  const maxStatusCount = Math.max(1, ...statusCounts.map((s) => s.count));

  const upcoming = useMemo(
    () =>
      leads
        .filter(
          (lead) =>
            lead.nextFollowUp &&
            lead.status !== "Closed Won" &&
            lead.status !== "Closed Lost",
        )
        .sort((a, b) =>
          (a.nextFollowUp ?? "") < (b.nextFollowUp ?? "") ? -1 : 1,
        )
        .slice(0, 5),
    [leads],
  );

  const filteredLeads = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((lead) => {
      const matchesQuery =
        !q ||
        lead.businessName.toLowerCase().includes(q) ||
        (lead.contactPerson ?? "").toLowerCase().includes(q) ||
        lead.phone.includes(q);
      const matchesIndustry =
        industryFilter === "All" || lead.industry === industryFilter;
      const matchesStatus =
        statusFilter === "All" || lead.status === statusFilter;
      return matchesQuery && matchesIndustry && matchesStatus;
    });
  }, [leads, query, industryFilter, statusFilter]);

  async function refresh() {
    setRefreshing(true);
    try {
      const response = await fetch("/api/leads", { cache: "no-store" });
      if (response.status === 401) {
        router.replace("/crm/login");
        return;
      }
      const data = (await response.json().catch(() => null)) as
        | { leads?: LeadDTO[]; error?: string }
        | null;
      if (!response.ok || !data?.leads) {
        throw new Error(data?.error ?? "Could not load leads.");
      }
      setLeads(data.leads);
      toast.success("Pipeline refreshed");
    } catch {
      toast.error("Could not refresh", {
        description: "Please check your connection and try again.",
      });
    } finally {
      setRefreshing(false);
    }
  }

  async function saveLead(values: LeadFormValues): Promise<boolean> {
    const isEdit = Boolean(editing);
    try {
      const response = await fetch(
        isEdit ? `/api/leads/${editing?.id}` : "/api/leads",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        },
      );
      if (response.status === 401) {
        router.replace("/crm/login");
        return false;
      }
      const data = (await response.json().catch(() => null)) as
        | { lead?: LeadDTO; error?: string }
        | null;
      if (!response.ok || !data?.lead) {
        toast.error(isEdit ? "Could not update lead" : "Could not add lead", {
          description: data?.error ?? "Please try again.",
        });
        return false;
      }
      const saved = data.lead;
      setLeads((prev) =>
        isEdit
          ? prev.map((lead) => (lead.id === saved.id ? saved : lead))
          : [saved, ...prev],
      );
      toast.success(isEdit ? "Lead updated" : "Lead added");
      setEditing(null);
      return true;
    } catch {
      toast.error("Network error", {
        description: "Please check your connection and try again.",
      });
      return false;
    }
  }

  async function changeStatus(id: string, status: LeadStatus) {
    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (response.status === 401) {
        router.replace("/crm/login");
        return false;
      }
      const data = (await response.json().catch(() => null)) as
        | { lead?: LeadDTO; error?: string }
        | null;
      if (!response.ok || !data?.lead) {
        toast.error("Could not update status", {
          description: data?.error ?? "Please try again.",
        });
        return false;
      }
      const updated = data.lead;
      setLeads((prev) =>
        prev.map((lead) => (lead.id === id ? updated : lead)),
      );
      toast.success(`Moved to ${status}`);
      return true;
    } catch {
      toast.error("Network error", {
        description: "Please check your connection and try again.",
      });
      return false;
    }
  }

  async function addLog(
    leadId: string,
    values: { type: string; summary: string },
  ) {
    try {
      const response = await fetch(`/api/leads/${leadId}/logs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (response.status === 401) {
        router.replace("/crm/login");
        return false;
      }
      const data = (await response.json().catch(() => null)) as
        | { log?: LeadDTO["logs"][number]; error?: string }
        | null;
      if (!response.ok || !data?.log) {
        toast.error("Could not add activity", {
          description: data?.error ?? "Please try again.",
        });
        return false;
      }
      const log = data.log;
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === leadId
            ? { ...lead, logs: [...lead.logs, log] }
            : lead,
        ),
      );
      toast.success("Activity added");
      return true;
    } catch {
      toast.error("Network error", {
        description: "Please check your connection and try again.",
      });
      return false;
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const response = await fetch(`/api/leads/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (response.status === 401) {
        router.replace("/crm/login");
        return;
      }
      if (!response.ok) {
        toast.error("Could not delete lead", {
          description: "Please try again.",
        });
        return;
      }
      setLeads((prev) =>
        prev.filter((lead) => lead.id !== deleteTarget.id),
      );
      toast.success("Lead deleted");
      setDeleteTarget(null);
    } catch {
      toast.error("Network error", {
        description: "Please check your connection and try again.",
      });
    } finally {
      setDeleting(false);
    }
  }

  async function logout() {
    setLoggingOut(true);
    try {
      await fetch("/api/crm/logout", { method: "POST" });
    } catch {
      // ignore network errors on logout
    }
    router.replace("/");
    router.refresh();
  }

  function exportData() {
    try {
      const blob = new Blob(
        [
          JSON.stringify(
            { exportedAt: new Date().toISOString(), leads },
            null,
            2,
          ),
        ],
        { type: "application/json" },
      );
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `localforge-crm-${new Date()
        .toISOString()
        .slice(0, 10)}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
      toast.success("Backup downloaded");
    } catch {
      toast.error("Could not export data");
    }
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070b14]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <BrandLockup />
            <span className="hidden rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-300 sm:inline">
              CRM
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={refresh}
              disabled={refreshing}
              aria-label="Refresh leads"
              className="size-9"
            >
              <RefreshCw
                className={cn("size-4", refreshing && "animate-spin")}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={exportData}
              aria-label="Export backup"
              className="hidden size-9 sm:inline-flex"
            >
              <Download className="size-4" />
            </Button>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hidden text-slate-300 sm:inline-flex"
            >
              <Link href="/">
                <ArrowLeft className="size-4" /> Website
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              disabled={loggingOut}
              className="border-white/15 bg-transparent"
            >
              {loggingOut ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <LogOut className="size-4" />
              )}
              <span className="hidden sm:inline">Lock</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {tab === "overview" && "Overview"}
              {tab === "pipeline" && "Lead pipeline"}
              {tab === "directory" && "Client directory"}
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Track enquiries, move deals forward and keep every follow-up in
              one place.
            </p>
          </div>
          <Button
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
            className="h-9 font-semibold"
          >
            <Plus className="size-4" /> Add lead
          </Button>
        </div>

        <div className="mt-6 flex items-center gap-1 border-b border-white/10">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                "-mb-px border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
                tab === item.id
                  ? "border-cyan-400 text-white"
                  : "border-transparent text-slate-400 hover:text-slate-200",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                icon={Users}
                label="Total leads"
                value={String(metrics.total)}
                hint="All enquiries on record"
              />
              <MetricCard
                icon={Briefcase}
                label="Active deals"
                value={String(metrics.active)}
                hint="Open and in progress"
              />
              <MetricCard
                icon={IndianRupee}
                label="Pipeline value"
                value={formatINR(metrics.pipelineValue)}
                hint="Excludes lost deals"
              />
              <MetricCard
                icon={Trophy}
                label="Won"
                value={`${metrics.wonCount} · ${metrics.conversion}%`}
                hint={`${formatINR(metrics.wonValue)} closed value`}
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-[#0a1220] p-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-white">
                    Pipeline by stage
                  </h2>
                  <TrendingUp className="size-4 text-slate-500" />
                </div>
                <ul className="mt-4 space-y-3">
                  {statusCounts.map((row) => (
                    <li key={row.status}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-2 text-slate-300">
                          <span
                            className={cn(
                              "size-1.5 rounded-full",
                              STATUS_STYLES[row.status].dot,
                            )}
                          />
                          {row.status}
                        </span>
                        <span className="font-mono text-slate-400">
                          {row.count}
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/5">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            STATUS_STYLES[row.status].dot,
                          )}
                          style={{
                            width: `${(row.count / maxStatusCount) * 100}%`,
                          }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#0a1220] p-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-white">
                    Upcoming follow-ups
                  </h2>
                  <CalendarClock className="size-4 text-slate-500" />
                </div>
                {upcoming.length === 0 ? (
                  <p className="mt-6 text-sm text-slate-500">
                    No follow-ups scheduled. Add a date to a lead to see it
                    here.
                  </p>
                ) : (
                  <ul className="mt-4 divide-y divide-white/5">
                    {upcoming.map((lead) => (
                      <li key={lead.id}>
                        <button
                          type="button"
                          onClick={() => setDetailId(lead.id)}
                          className="flex w-full items-center justify-between gap-3 py-2.5 text-left transition-colors hover:text-cyan-300"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-slate-200">
                              {lead.businessName}
                            </p>
                            <p className="text-xs text-slate-500">
                              {lead.contactPerson || lead.phone}
                            </p>
                          </div>
                          <span className="shrink-0 rounded-md border border-white/10 px-2 py-0.5 text-[11px] text-slate-300">
                            {formatDate(lead.nextFollowUp)}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0a1220] p-5">
              <h2 className="text-sm font-semibold text-white">
                Recent enquiries
              </h2>
              {leads.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500">
                  No leads yet. Enquiries from the website appear here
                  automatically.
                </p>
              ) : (
                <ul className="mt-3 divide-y divide-white/5">
                  {leads.slice(0, 5).map((lead) => (
                    <li
                      key={lead.id}
                      className="flex flex-wrap items-center justify-between gap-2 py-2.5"
                    >
                      <button
                        type="button"
                        onClick={() => setDetailId(lead.id)}
                        className="text-left text-sm font-medium text-slate-200 hover:text-cyan-300"
                      >
                        {lead.businessName}
                        <span className="ml-2 text-xs font-normal text-slate-500">
                          {lead.industry}
                        </span>
                      </button>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400">
                          {formatINR(lead.value)}
                        </span>
                        <StatusPill status={lead.status} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {tab === "pipeline" && (
          <div className="mt-6 overflow-x-auto pb-4">
            <div className="flex min-w-max gap-3">
              {statusCounts.map((column) => (
                <div
                  key={column.status}
                  className="w-72 shrink-0 rounded-xl border border-white/10 bg-white/[0.02]"
                >
                  <div
                    className={cn(
                      "flex items-center justify-between border-b px-3 py-2.5",
                      STATUS_STYLES[column.status].column,
                    )}
                  >
                    <span className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                      <span
                        className={cn(
                          "size-1.5 rounded-full",
                          STATUS_STYLES[column.status].dot,
                        )}
                      />
                      {column.status}
                    </span>
                    <span className="font-mono text-[11px] text-slate-500">
                      {column.count}
                    </span>
                  </div>
                  <div className="space-y-2 p-2.5">
                    {leads
                      .filter((lead) => lead.status === column.status)
                      .map((lead) => (
                        <div
                          key={lead.id}
                          className="rounded-lg border border-white/10 bg-[#0a1220] p-3"
                        >
                          <button
                            type="button"
                            onClick={() => setDetailId(lead.id)}
                            className="block w-full text-left"
                          >
                            <p className="truncate text-sm font-semibold text-white">
                              {lead.businessName}
                            </p>
                            <p className="mt-0.5 truncate text-xs text-slate-400">
                              {lead.contactPerson || lead.phone}
                            </p>
                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-xs font-medium text-slate-300">
                                {formatINR(lead.value)}
                              </span>
                              <span className="text-[11px] text-slate-500">
                                {formatDate(lead.nextFollowUp)}
                              </span>
                            </div>
                          </button>
                          <div className="mt-2.5 flex items-center gap-1.5">
                            <a
                              href={whatsappLink(lead.phone, lead.businessName)}
                              target="_blank"
                              rel="noreferrer"
                              aria-label={`WhatsApp ${lead.businessName}`}
                              className="grid size-7 place-items-center rounded-md border border-emerald-500/25 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                            >
                              <MessageCircle className="size-3.5" />
                            </a>
                            <Select
                              value={lead.status}
                              onValueChange={(value) =>
                                changeStatus(lead.id, value as LeadStatus)
                              }
                            >
                              <SelectTrigger
                                className="h-7 flex-1 border-white/10 text-[11px]"
                                aria-label={`Move ${lead.businessName}`}
                              >
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
                        </div>
                      ))}
                    {column.count === 0 && (
                      <p className="rounded-lg border border-dashed border-white/10 px-3 py-6 text-center text-xs text-slate-600">
                        No leads here
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "directory" && (
          <div className="mt-6 space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by business, contact or phone"
                  aria-label="Search leads"
                  className="pl-9"
                />
              </div>
              <Select
                value={industryFilter}
                onValueChange={setIndustryFilter}
              >
                <SelectTrigger className="w-full sm:w-44" aria-label="Filter by industry">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All industries</SelectItem>
                  {INDUSTRIES.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-44" aria-label="Filter by status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All statuses</SelectItem>
                  {LEAD_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0a1220]">
              {filteredLeads.length === 0 ? (
                <div className="px-6 py-14 text-center">
                  <p className="text-sm font-medium text-slate-300">
                    No leads match these filters.
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Try clearing the search or adding a new lead.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead>Business</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Industry</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Value</TableHead>
                        <TableHead>Follow-up</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLeads.map((lead) => (
                        <TableRow
                          key={lead.id}
                          className="border-white/5 hover:bg-white/[0.02]"
                        >
                          <TableCell>
                            <button
                              type="button"
                              onClick={() => setDetailId(lead.id)}
                              className="text-left text-sm font-medium text-white hover:text-cyan-300"
                            >
                              {lead.businessName}
                            </button>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm text-slate-300">
                              {lead.contactPerson || "—"}
                            </p>
                            <p className="text-xs text-slate-500">
                              {lead.phone}
                            </p>
                          </TableCell>
                          <TableCell className="text-sm text-slate-400">
                            {lead.industry}
                          </TableCell>
                          <TableCell>
                            <StatusPill status={lead.status} />
                          </TableCell>
                          <TableCell className="text-right font-mono text-sm text-slate-300">
                            {formatINR(lead.value)}
                          </TableCell>
                          <TableCell className="text-sm text-slate-400">
                            {formatDate(lead.nextFollowUp)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8"
                                onClick={() => setDetailId(lead.id)}
                                aria-label={`View ${lead.businessName}`}
                              >
                                <Eye className="size-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8"
                                onClick={() => {
                                  setEditing(lead);
                                  setFormOpen(true);
                                }}
                                aria-label={`Edit ${lead.businessName}`}
                              >
                                <Pencil className="size-4" />
                              </Button>
                              <Button
                                asChild
                                variant="ghost"
                                size="icon"
                                className="size-8 text-emerald-300 hover:text-emerald-200"
                              >
                                <a
                                  href={whatsappLink(
                                    lead.phone,
                                    lead.businessName,
                                  )}
                                  target="_blank"
                                  rel="noreferrer"
                                  aria-label={`WhatsApp ${lead.businessName}`}
                                >
                                  <MessageCircle className="size-4" />
                                </a>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 text-rose-300 hover:text-rose-200"
                                onClick={() => setDeleteTarget(lead)}
                                aria-label={`Delete ${lead.businessName}`}
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <LeadFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}
        lead={editing}
        onSubmit={saveLead}
      />

      <LeadDetailDialog
        lead={detailLead}
        onOpenChange={(open) => {
          if (!open) setDetailId(null);
        }}
        onAddLog={addLog}
        onStatusChange={changeStatus}
      />

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent className="border-white/10 bg-[#0a1220]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this lead?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget
                ? `"${deleteTarget.businessName}" and its activity history will be permanently removed. This cannot be undone.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/15 bg-transparent">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleting}
              className="bg-rose-500 text-white hover:bg-rose-600"
            >
              {deleting ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Deleting…
                </>
              ) : (
                <>
                  <Trash2 className="size-4" /> Delete lead
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <p className="mx-auto max-w-7xl px-4 pb-8 text-center text-[11px] text-slate-600 sm:px-6">
        <Lock className="mr-1 inline size-3" /> Private studio workspace · Only
        shared with the LocalForge Tech team
      </p>
    </div>
  );
}
