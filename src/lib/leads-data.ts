import { asc, desc } from "drizzle-orm";

import { db } from "./db";
import { leadLogs, leads } from "./schema";
import type { LeadDTO, LeadLogDTO } from "./types";
import type { LeadStatus } from "./constants";

export function toLeadDTO(
  lead: typeof leads.$inferSelect,
  logs: (typeof leadLogs.$inferSelect)[],
): LeadDTO {
  return {
    id: lead.id,
    businessName: lead.businessName,
    contactPerson: lead.contactPerson,
    phone: lead.phone,
    email: lead.email,
    industry: lead.industry,
    status: lead.status as LeadStatus,
    source: lead.source,
    value: lead.value,
    nextFollowUp: lead.nextFollowUp,
    notes: lead.notes,
    createdAt: lead.createdAt.toISOString(),
    updatedAt: lead.updatedAt.toISOString(),
    logs: logs
      .filter((log) => log.leadId === lead.id)
      .map(toLogDTO),
  };
}

export function toLogDTO(log: typeof leadLogs.$inferSelect): LeadLogDTO {
  return {
    id: log.id,
    leadId: log.leadId,
    type: log.type,
    summary: log.summary,
    createdAt: log.createdAt.toISOString(),
  };
}

export async function getLeadsWithLogs(): Promise<LeadDTO[]> {
  const rows = await db
    .select()
    .from(leads)
    .orderBy(desc(leads.createdAt));

  const logRows = await db
    .select()
    .from(leadLogs)
    .orderBy(asc(leadLogs.createdAt));

  return rows.map((lead) => toLeadDTO(lead, logRows));
}
