import { redirect } from "next/navigation";

import { isCrmAuthed } from "@/lib/crm-auth";
import { getLeadsWithLogs } from "@/lib/leads-data";

import { CrmDashboard } from "./crm-dashboard";

export const metadata = {
  title: "CRM dashboard",
  description: "LocalForge Tech lead pipeline and client directory.",
};

export const dynamic = "force-dynamic";

export default async function CrmPage() {
  if (!(await isCrmAuthed())) {
    redirect("/crm/login");
  }

  const leads = await getLeadsWithLogs();

  return <CrmDashboard initialLeads={leads} />;
}
