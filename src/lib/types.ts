import type { LeadStatus } from "./constants";

export type LeadLogDTO = {
  id: string;
  leadId: string;
  type: string;
  summary: string;
  createdAt: string;
};

export type LeadDTO = {
  id: string;
  businessName: string;
  contactPerson: string | null;
  phone: string;
  email: string | null;
  industry: string;
  status: LeadStatus;
  source: string;
  value: number;
  nextFollowUp: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  logs: LeadLogDTO[];
};
